var express = require('express');
var router = express.Router();
//var uniqid = require('uniqid'); 
var randomize = require('randomatic');
const { sql } = require('../config/database');

var helpers = require('../helper/general_helper.js');
const bcrypt = require('bcrypt');
var datetime = require('node-datetime');
var empty = require('is-empty');
var jwt = require('jsonwebtoken');
// var config = require('../helper/config.js');
var path = require('path');
var md5 = require('md5');
var fs = require("fs");
const nodemailer = require('nodemailer');
var moment = require('moment-strftime');
const device_helpers = require('../helper/device_helpers.js');
var Constants = require('../constants/Application');

const constants = require('../config/constants');
const smtpTransport = require('../helper/mail')


function sendEmail(subject, message, to, callback) {
    let cb = callback;
    subject = "Lockmesh.com Team - " + subject
    let mailOptions = {
        from: "admin@lockmesh.com",
        to: to,
        subject: subject,
        html: message
    };
    smtpTransport.sendMail(mailOptions, cb);
}

/*Check For Token in the header */
var verifyToken = function (req, res) {
    // check header or url parameters or post parameters for token
    var ath;
    var token = req.headers['authorization'];

    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, constants.SECRET, function (err, decoded) {
            // console.log(err);
            if (err) {
                ath = {
                    status: false,
                    success: false
                };
                return res.json({
                    success: false,
                    msg: 'TOKEN_INVALID'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;

                req.decoded.status = true;
                req.decoded.success = true;
                ath = decoded;
            }
        });
    } else {
        ath = {
            status: false,
            success: false
        };
        return res.send({
            success: false,
            msg: 'TOKEN_NOT_PROVIDED'
        });
    }

    return ath;
}

/* Client Login with Link Code MDM  */
router.post('/login', async function (req, resp) {

    var linkCode = req.body.link_code;
    var mac_address = req.body.macAddr;
    var serial_number = req.body.serialNo
    var dateNow = new Date()
    var start_date = moment(dateNow).format("YYYY/MM/DD")

    console.log("mac_address", mac_address);
    console.log("serial_number", serial_number);

    var data;
    //console.log(linkCode);
    if (linkCode !== undefined && linkCode !== null) {
        if (linkCode.length <= 6) {

            var dealerQ = "SELECT * FROM dealers WHERE link_code = '" + linkCode + "'";
            var dealer = await sql.query(dealerQ);
            if (dealer.length == 0) {
                data = {
                    'status': false,
                    'msg': 'Invalid link code'
                }
                resp.send(data);
            } else {
                let dealerStatus = helpers.getDealerStatus(dealer[0]);
                // console.log("dealer status", dealerStatus);
                if (dealerStatus === Constants.DEALER_SUSPENDED) {
                    data = {
                        'status': false,
                        'msg': 'Dealer Suspended, Contact Admin'
                    }
                    resp.send(data);

                } else if (dealerStatus === Constants.DEALER_UNLINKED) {
                    data = {
                        'status': false,
                        'msg': 'Dealer Suspended, Contact Admin'
                    }
                    resp.send(data);
                } else {

                    const device = {
                        dId: dealer[0].dealer_id,
                        dealer_pin: dealer[0].link_code,
                        connected_dealer: dealer[0].connected_dealer,
                        type: await helpers.getUserTypeByTypeId(dealer[0].type)
                    }

                    jwt.sign({
                        device
                    }, constants.SECRET, {
                            expiresIn: constants.EXPIRES_IN
                        }, (err, token) => {
                            if (err) {
                                resp.json({
                                    'err': err
                                });
                            } else {
                                // console.log(device);

                                resp.json({
                                    token: token,
                                    status: true,
                                    data: device,
                                });
                            }
                        });
                }
            }
        } else if (linkCode.length >= 7) {
            var usrAccQ = "SELECT * FROM usr_acc WHERE activation_code='" + linkCode + "' and activation_status=0";
            var usrAcc = await sql.query(usrAccQ);
            if (usrAcc.length === 0) {
                data = {
                    'status': false,
                    'msg': 'Invalid activation code'
                }
                resp.send(data);
            } else {
                let validity = await device_helpers.checkRemainDays(usrAcc[0].created_at, usrAcc[0].validity)
                if (validity < 0 || validity === 'Expired') {
                    data = {
                        'status': false,
                        'msg': 'Invalid activation code'
                    }
                    resp.send(data);
                } else {
                    var dealerQ = "SELECT * FROM dealers WHERE dealer_id = " + usrAcc[0].dealer_id;
                    var dealer = await sql.query(dealerQ);
                    if (dealer.length) {
                        if (dealer[0].unlink_status == 1 || dealer[0].account_status == 'suspended') {
                            data = {
                                status: false,
                                msg: 'Dealer Suspended, Contact Admin'
                            }
                            resp.status(200).send(data);

                        } else {

                            let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address } = device_helpers.getDeviceInfo(req);
                            if (!empty(mac_address) || !empty(serial_number)) {
                                // console.log("this is info ", { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address });
                                let chechedDeviceId = await helpers.getDeviceId(serial_number, mac_address)
                                // let chechedDeviceId = checkDeviceId(NewDeviceId, serial_number, mac_address)
                                if (usrAcc[0].expiry_months == 0) {
                                    var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
                                    var expiry_date = moment(trailDate).format("YYYY/MM/DD")
                                } else {
                                    var expiry_date = helpers.getExpDateByMonth(new Date(), usrAcc[0].expiry_months);
                                }
                                var updateDevice = "UPDATE devices set device_id = '" + chechedDeviceId + "', ip_address = '" + ip + "', simno = '" + simNo1 + "', online = '" + Constants.DEVICE_OFFLINE + "', imei='" + imei1 + "', imei2='" + imei2 + "', serial_number='" + serial_number + "', mac_address='" + mac_address + "', simno2 = '" + simNo2 + "' where id='" + usrAcc[0].device_id + "'";
                                await sql.query(updateDevice);

                                var updateAccount = "UPDATE usr_acc set activation_status=1, status='active', expiry_date='" + expiry_date + "', start_date='" + start_date + "', device_status=1, unlink_status = 0 WHERE id = " + usrAcc[0].id;
                                await sql.query(updateAccount);
                                device_helpers.saveImeiHistory(chechedDeviceId, serial_number, mac_address, imei1, imei2)
                                let device_id = await device_helpers.getDvcIDByDeviceID(usrAcc[0].device_id)

                                const device = {
                                    dId: dealer[0].dealer_id,
                                    dealer_pin: dealer[0].link_code,
                                    connected_dealer: dealer[0].connected_dealer,
                                    type: await helpers.getUserTypeByTypeId(dealer[0].type),
                                    device_id: device_id
                                }

                                jwt.sign({
                                    device
                                }, constants.SECRET, {
                                        expiresIn: constants.EXPIRES_IN
                                    }, (err, token) => {
                                        if (err) {
                                            resp.json({
                                                err: err
                                            });
                                        } else {

                                            resp.json({
                                                token: token,
                                                status: true,
                                                data: device,
                                            });
                                            return;
                                        }
                                    });
                            } else {
                                data = {
                                    status: false,
                                    msg: 'Information not provided'
                                }
                                resp.send(data);
                                return;
                            }

                        }
                    } else {

                    }

                }

            }
            // console.log("activation code");
        }

    } else if ((mac_address !== undefined && mac_address !== null) && (serial_number !== undefined && serial_number !== null)) {

        var deviceQ = "SELECT * FROM devices WHERE mac_address = '" + mac_address + "' OR serial_number='" + serial_number + "'";
        var device = await sql.query(deviceQ);
        if (device.length === 0) {
            // console.log("hello", "login")
            data = {
                status: false,
                msg: 'unlinked'
            }
            resp.send(data);
        } else {
            let usr_acc = await device_helpers.getUserAccByDvcId(device[0].id);
            let deviceStatus = device_helpers.checkStatus(usr_acc);
            // console.log("usr_acc", usr_acc);

            if (deviceStatus == "Unlinked") {
                data = {
                    status: false,
                    msg: 'unlinked'
                }

            } else if (deviceStatus == 'Expired') {
                data = {
                    status: false,
                    msg: 'expired'
                }
            } else if (deviceStatus == "Suspended") {
                data = {
                    status: false,
                    msg: 'suspended'
                }
            }
            // } else if (device[0].wipe_status == "wipe") {
            //     data = {
            //         'status': false,
            //         'msg': 'wipe'
            //     }

            // }
            else {
                data = {
                    status: true,
                    msg: 'success'
                }

            }

            const dvc = {
                dId: usr_acc.dealer_id,
                device_id: device[0].device_id,
                link_code: usr_acc.link_code,
                // ...data
            }
            // console.log("this is device", dvc);
            jwt.sign({
                dvc
            }, constants.SECRET, {
                    expiresIn: constants.EXPIRES_IN
                }, (err, token) => {
                    if (err) {
                        resp.json({
                            'err': err
                        });
                        return;
                    }

                    try {
                        var d = new Date(usr_acc.expiry_date);
                        var n = d.valueOf()
                        // console.log("expire in", n);

                        resp.json({
                            token: token,
                            status: data.status,
                            msg: data.msg,
                            dId: dvc.dId,
                            dealer_pin: dvc.link_code,
                            device_id: dvc.device_id,
                            expiresIn: n
                        });
                        return;
                    } catch (error) {
                        // console.log(error);
                    }
                });
        }

    } else {
        data = {
            status: false,
            msg: 'information not provided'
        }
        resp.send(data);
    }
});

// system control login, secure market login
router.post('/systemlogin', async function (req, res) {
    let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address } = device_helpers.getDeviceInfo(req);
    console.log(imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address);
    const sysmtemInfo = {
        serial_number, ip, mac_address
    };

    jwt.sign({
        sysmtemInfo
    },
        constants.SECRET,
        {
            expiresIn: constants.EXPIRES_IN
        },
        (err, token) => {
            if (err) {
                res.json({
                    'err': err
                });
            } else {

                res.json({
                    token: token,
                    status: true,
                });
                return;
            }
        }
    );

});

/** Link Device MDM **/
router.post('/linkdevice', async function (req, resp) {
    //res.setHeader('Content-Type', 'application/json');
    // console.log("/linkdevice");
    var reslt = verifyToken(req, resp);
    if (reslt.status == true) {
        let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address } = device_helpers.getDeviceInfo(req);
        // console.log("serial no", serial_number);
        // console.log("mac address", mac_address);
        if (!empty(serial_number) && !empty(mac_address)) {
            var dId = req.body.dId;
            var connected_dealer = (req.body.connected_dealer === undefined || req.body.connected_dealer === null) ? 0 : req.body.connected_dealer;

            var deviceQ = "SELECT * FROM devices WHERE  mac_address='" + mac_address + "' OR serial_number='" + serial_number + "'";
            var device = await sql.query(deviceQ);

            // console.log("device query", device);
            // console.log("link device dealer id", dId);
            var dealerQ = "select * from dealers where dealer_id = " + dId;
            let dealer = await sql.query(dealerQ);
            // console.log("dealer query", dealer)
            // res2 = dealer

            if (dealer.length) {

                sendEmail("New Device Request", "You have a new device request", dealer[0].dealer_email, function (error, response) {
                    if (error) throw error;
                });

                if (device.length > 0) {
                    var user_acc = await device_helpers.getUserAccByDvcId(device[0].id);
                    if (user_acc) {
                        let deviceStatus = device_helpers.checkStatus(user_acc);
                        if (deviceStatus == Constants.DEVICE_UNLINKED) {

                            var link_acc = "";
                            var updateDviceQ = "UPDATE devices set ip_address = '" + ip + "', simno = '" + simNo1 + "', online = '" + Constants.DEVICE_OFFLINE + "' , simno2 = '" + simNo2 + "', reject_status=0  where id=" + device[0].id;
                            // , unlink_status = 0
                            // console.log(updateDviceQ);
                            var updateDevice = await sql.query(updateDviceQ);

                            var link_acc = "update usr_acc set link_code='" + dealer[0].link_code + "', dealer_id = '" + dId + "', prnt_dlr_id=" + connected_dealer + ", unlink_status = 0 where device_id = " + device[0].id;
                            // console.log(link_acc);
                            sql.query(link_acc, function (error, rows) {
                                //response.end(JSON.stringify(rows));
                                if (error) throw error;
                                device_helpers.saveImeiHistory(deviceId, serial_number, mac_address, imei1, imei2)

                                resp.json({
                                    "status": true,
                                    "msg": "Device linked."
                                });
                            });
                        } else {
                            resp.json({
                                "status": true,
                                "msg": "Device already linked"
                            });
                        }

                    } else {
                        var link_acc = "INSERT INTO usr_acc  (device_id, link_code, dealer_id, prnt_dlr_id, unlink_status) value (" + device.id + ", " + dealer[0].link_code + ", '" + dId + "'," + connected_dealer + ", 0) ";

                        sql.query(link_acc, function (error, rows) {
                            //response.end(JSON.stringify(rows));
                            if (error) throw error;
                            device_helpers.saveImeiHistory(deviceId, serial_number, mac_address, imei1, imei2)
                            resp.json({
                                "status": true,
                                "msg": "Device linked."
                            });
                        });
                    }

                } else {
                    var deviceId = await helpers.getDeviceId(serial_number, mac_address);
                    // var deviceId = await checkDeviceId(device_id, serial_number, mac_address);

                    let insertDevice = "INSERT INTO devices (device_id, imei, imei2, ip_address, simno, simno2, serial_number, mac_address, online) values(?,?,?,?,?,?,?,?,?)";
                    sql.query(insertDevice, [deviceId, imei1, imei2, ip, simNo1, simNo2, serial_number, mac_address, Constants.DEVICE_OFFLINE], function (error, deviceRes) {
                        // console.log("Insert Query" , insertDevice, [deviceId, imei1, imei2, ip, simNo1, simNo2, serial_number, mac_address, 'On']);
                        if (error) {
                            throw Error(error);
                        }
                        let dvc_id = deviceRes.insertId;
                        let insertUserAcc = "";
                        let values;
                        // console.log("dealer", dealer[0].dealer_id);
                        if (connected_dealer !== 0) {

                            insertUserAcc = "INSERT INTO usr_acc (device_id, dealer_id, link_code, prnt_dlr_id) values(?,?,?,?)";
                            values = [dvc_id, dealer[0].dealer_id, dealer[0].link_code, connected_dealer];
                        } else {
                            insertUserAcc = "INSERT INTO usr_acc (device_id, dealer_id, link_code) values(?,?,?,?)";
                            values = [dvc_id, dealer[0].dealer_id, dealer[0].link_code];
                        }

                        sql.query(insertUserAcc, values, async function (error, rows) {
                            if (error) throw error;
                            // console.log();
                            let record = await helpers.getAllRecordbyDeviceId(deviceId);
                            // console.log("dasdsd", record);
                            device_helpers.saveActionHistory(record, Constants.DEVICE_PENDING_ACTIVATION)
                            device_helpers.saveImeiHistory(deviceId, serial_number, mac_address, imei1, imei2)
                            resp.json({
                                "status": true,
                                "data": rows

                            });

                        });

                    });

                }

            } else {
                resp.send({
                    status: false,
                    msg: "dealer not found"
                });
            }
        } else {
            resp.send({
                status: false,
                msg: "information not provided"
            })
        }

    }
});

/** Device status (Added Device or not) api  MDM **/
router.post('/getstatus', async function (req, resp) {
    var serial_number = req.body.serial_number;
    var mac = req.body.mac;
    var reslt = verifyToken(req, resp);

    if (reslt.status == true) {
        if (!empty(serial_number) && !empty(mac)) {

            if (serial_number === Constants.PRE_DEFINED_SERIAL_NUMBER && mac === Constants.PRE_DEFINED_MAC_ADDRESS) {
                data = {
                    status: 323,
                    msg: "both Static"
                }
                resp.send(data);
                return
            }
            else if (serial_number === Constants.PRE_DEFINED_SERIAL_NUMBER) {

                var deviceQ = "SELECT * FROM devices WHERE  mac_address= '" + mac + "' ";
                var device = await sql.query(deviceQ);
                if (device.length && device[0].device_status == 0 && device[0].activation_status == null) {
                    console.log('MAC FOUUND');
                    data = {
                        "status": false,
                        "msg": "Mac duplicate."
                    };
                    resp.send(data);
                    return
                }
                else {
                    var deviceQ = "SELECT * FROM devices WHERE  mac_address= '" + mac + "' AND serial_number = '" + serial_number + "'";
                    //console.log(sql1);
                    // console.log(deviceQ);
                    var device = await sql.query(deviceQ);
                    // console.log("my device", device)
                    if (device.length > 0) {
                        // let userAcc = await sql.query("SELECT * FROM usr_acc WHERE device_id="+ device[0].id);
                        let userAcc = await device_helpers.getUserAccByDvcId(device[0].id);
                        // console.log("get usr account by device id", userAcc);
                        if (userAcc) {
                            // console.log(userAcc);
                            let deviceStatus = device_helpers.checkStatus(userAcc);
                            let dealerQ = "SELECT dealer_id, link_code FROM dealers WHERE dealer_id =" + userAcc.dealer_id;
                            let dealer = await sql.query(dealerQ);
                            if (dealer.length) {
                                if (userAcc.device_status == 0) {
                                    if (userAcc.unlink_status == 1) {
                                        data = {
                                            status: -1,
                                            msg: "Device Unlinked.",
                                            dealer_id: userAcc.dealer_id,
                                            device_id: device[0].device_id,
                                            dealer_pin: dealer[0].link_code
                                        };
                                    } else {
                                        data = {
                                            status: 0,
                                            msg: "Processing.",
                                            dealer_id: userAcc.dealer_id,
                                            device_id: device[0].device_id,
                                            dealer_pin: dealer[0].link_code,
                                        };

                                    }

                                    resp.send(data);
                                } else {
                                    data = {
                                        status: 1,
                                        msg: "Device activated.",
                                        dealer_id: userAcc.dealer_id,
                                        expiry_date: userAcc.expiry_date,
                                        device_id: device[0].device_id,
                                        dealer_pin: dealer[0].link_code
                                        // "chat_id": res[0].chat_id,
                                        // "pgp_email": res[0].pgp_email,
                                        // "sim_id": res[0].sim_id
                                    };
                                    resp.send(data);
                                }
                            } else {
                                console.log("Dealer ID not Found");
                            }
                        } else {
                        }

                    } else {
                        data = {
                            "status": -1,
                            "msg": "Not found."
                        };
                        resp.send(data);
                    }

                }
            }
            else if (serial_number === Constants.PRE_DEFINED_MAC_ADDRESS) {

                var deviceQ = "SELECT * FROM devices WHERE  serial_number= '" + serial_number + "' ";
                var device = await sql.query(deviceQ);
                if (device.length) {
                    console.log('SERIAL FOUUND');
                    data = {
                        "status": false,
                        "msg": "serial duplicate."
                    };
                    resp.send(data);
                    return
                }
                else {
                    var deviceQ = "SELECT * FROM devices WHERE  mac_address= '" + mac + "' AND serial_number = '" + serial_number + "'";
                    //console.log(sql1);
                    // console.log(deviceQ);
                    var device = await sql.query(deviceQ);
                    // console.log("my device", device)
                    if (device.length > 0) {
                        // let userAcc = await sql.query("SELECT * FROM usr_acc WHERE device_id="+ device[0].id);
                        let userAcc = await device_helpers.getUserAccByDvcId(device[0].id);
                        // console.log("get usr account by device id", userAcc);
                        if (userAcc) {
                            // console.log(userAcc);
                            let deviceStatus = device_helpers.checkStatus(userAcc);
                            let dealerQ = "SELECT dealer_id, link_code FROM dealers WHERE dealer_id =" + userAcc.dealer_id;
                            let dealer = await sql.query(dealerQ);
                            if (dealer.length) {
                                if (userAcc.device_status == 0) {
                                    if (userAcc.unlink_status == 1) {
                                        data = {
                                            status: -1,
                                            msg: "Device Unlinked.",
                                            dealer_id: userAcc.dealer_id,
                                            device_id: device[0].device_id,
                                            dealer_pin: dealer[0].link_code
                                        };
                                    } else {
                                        data = {
                                            status: 0,
                                            msg: "Processing.",
                                            dealer_id: userAcc.dealer_id,
                                            device_id: device[0].device_id,
                                            dealer_pin: dealer[0].link_code,
                                        };

                                    }

                                    resp.send(data);
                                } else {
                                    data = {
                                        status: 1,
                                        msg: "Device activated.",
                                        dealer_id: userAcc.dealer_id,
                                        expiry_date: userAcc.expiry_date,
                                        device_id: device[0].device_id,
                                        dealer_pin: dealer[0].link_code
                                        // "chat_id": res[0].chat_id,
                                        // "pgp_email": res[0].pgp_email,
                                        // "sim_id": res[0].sim_id
                                    };
                                    resp.send(data);
                                }
                            } else {
                                console.log("Dealer ID not Found");
                            }
                        } else {
                        }

                    } else {
                        data = {
                            "status": -1,
                            "msg": "Not found."
                        };
                        resp.send(data);
                    }
                }
            }
            else {
                var deviceQ = "SELECT * FROM devices WHERE  mac_address= '" + mac + "' OR serial_number = '" + serial_number + "'";
                //console.log(sql1);
                // console.log(deviceQ);
                var device = await sql.query(deviceQ);
                // console.log("my device", device)
                if (device.length > 0) {
                    // let userAcc = await sql.query("SELECT * FROM usr_acc WHERE device_id="+ device[0].id);
                    let userAcc = await device_helpers.getUserAccByDvcId(device[0].id);
                    // console.log("get usr account by device id", userAcc);
                    if (userAcc) {
                        // console.log(userAcc);
                        let deviceStatus = device_helpers.checkStatus(userAcc);
                        let dealerQ = "SELECT dealer_id, link_code FROM dealers WHERE dealer_id =" + userAcc.dealer_id;
                        let dealer = await sql.query(dealerQ);
                        if (dealer.length) {
                            if (userAcc.device_status == 0) {
                                if (userAcc.unlink_status == 1) {
                                    data = {
                                        status: -1,
                                        msg: "Device Unlinked.",
                                        dealer_id: userAcc.dealer_id,
                                        device_id: device[0].device_id,
                                        dealer_pin: dealer[0].link_code
                                    };
                                } else {
                                    data = {
                                        status: 0,
                                        msg: "Processing.",
                                        dealer_id: userAcc.dealer_id,
                                        device_id: device[0].device_id,
                                        dealer_pin: dealer[0].link_code,
                                    };

                                }

                                resp.send(data);
                            } else {
                                data = {
                                    status: 1,
                                    msg: "Device activated.",
                                    dealer_id: userAcc.dealer_id,
                                    expiry_date: userAcc.expiry_date,
                                    device_id: device[0].device_id,
                                    dealer_pin: dealer[0].link_code
                                    // "chat_id": res[0].chat_id,
                                    // "pgp_email": res[0].pgp_email,
                                    // "sim_id": res[0].sim_id
                                };
                                resp.send(data);
                            }
                        } else {
                            console.log("Dealer ID not Found");
                        }
                    } else {
                    }

                } else {
                    data = {
                        "status": -1,
                        "msg": "Not found."
                    };
                    resp.send(data);
                }
            }
        }
    } else {
        data = {
            "status": false,
            "msg": "Information not provided."
        };
        resp.send(data);
    }
});

/** Stop linking Device / Delete device MDM **/

router.delete('/unlink/:macAddr/:serialNo', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var reslt = verifyToken(req, res);
    //console.log(req);
    let mac_address = req.params.macAddr;
    let serial_number = req.params.serialNo;
    // console.log("mac_address", mac_address);
    // console.log("serialNo", serial_number);
    if (reslt.status == true) {
        if (!empty(mac_address) && !empty(serial_number)) {
            let deviceQ = "SELECT id ,device_id FROM devices WHERE mac_address='" + mac_address + "' OR serial_number='" + serial_number + "'";
            sql.query(deviceQ, async function (error, resp) {
                if (error) throw (error);
                if (resp.length) {
                    let device_record = await helpers.getAllRecordbyDeviceId(resp[0].device_id)
                    device_helpers.saveActionHistory(device_record, Constants.DEVICE_UNLINKED)
                    var query = "DELETE from usr_acc WHERE device_id = '" + resp[0].id + "'";
                    await sql.query(query);
                    var sqlDevice = "DELETE from devices where device_id = '" + resp[0].device_id + "'";
                    sql.query(sqlDevice);
                    data = {
                        "status": true,
                        "msg": "Device Unlinked successfully"
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": "Invalid device"
                    };
                    res.send(data);
                    return;
                }
            });

        } else {
            data = {
                "status": false,
                "msg": "Invalid device"
            };
            res.send(data);
        }
    }
});


/* Screen Lock Get Status of Apk  */
router.get('/apklist', async function (req, res) {
    sql.query("select * from apk_details where status='On' and delete_status='0'", function (err, rows) {

        if (err) throw err;

        var data = [];
        if (rows.length > 0) {

            for (var i = 0; i < rows.length; i++) {

                dta = {
                    "apk_name": rows[i].app_name,
                    "logo": rows[i].logo,
                    "apk": rows[i].apk,
                    "apk_status": rows[i].status
                }
                data.push(dta);
            }
            //   console.log(data);
            //res.json("status" : true , result : data);
            return res.json({
                success: true,
                list: data
            });

        } else {
            data = {
                "status": false,
                "msg": "No result found"
            }
            res.send(data);
        }

    });
});


router.get('/getUpdate/:version/:uniqueName/:label', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let verify = req.decoded;
    if (verify) {
        let versionName = req.params.version;
        let uniqueName = req.params.uniqueName;
        let query = "SELECT * FROM apk_details WHERE package_name = '" + uniqueName + "' AND delete_status=0";
        sql.query(query, function (error, response) {
            // console.log("res", response);

            if (error) {
                res.send({
                    success: true,
                    status: false,
                    msg: "Error in Query"
                });
            }

            let isAvail = false;

            if (response.length) {
                for (let i = 0; i < response.length; i++) {
                    if (Number(response[i].version_code) > Number(versionName)) {
                        isAvail = true;
                        res.send({
                            apk_status: true,
                            success: true,
                            apk_url: response[i].apk
                        });

                        break;
                    }
                }
                if (!isAvail) {
                    res.send({
                        apk_status: false,
                        success: true,
                        msg: ""
                    });
                }

            } else {
                res.send({
                    apk_status: false,
                    success: true,
                    msg: ""
                });
            }
        })
    }

});

/** Get Apk **/
router.get("/getApk/:apk", async (req, res) => {
    let file = path.join(__dirname, "../uploads/" + req.params.apk + '.apk');
    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        res.send({
            status: false,
            msg: "file not found"
        })
    }
    // }
});

/** New API MDM Client App (11th.Oct.2018) **/

/** Get status of device (active,expired,inactive) **/
router.post('/device_status', async function (req, res) {
    var serial_number = req.body.serialNo;
    var mac = req.body.macAddr;
    var data;

    if (empty(serial_number) && empty(mac)) {
        data = {
            status: false,
            msg: "Information not provided"
        }
        res.send(data);
        return
    }
    // else if (serial_number === Constants.PRE_DEFINED_SERIAL_NUMBER && mac === Constants.PRE_DEFINED_MAC_ADDRESS) {
    //     data = {
    //         status: false,
    //         msg: "not valid."
    //     }
    //     res.send(data);
    //     return
    // }
    // else if (serial_number === Constants.PRE_DEFINED_SERIAL_NUMBER) {

    //     var deviceQ = "SELECT * FROM devices WHERE  mac_address= '" + mac + "' ";
    //     var device = await sql.query(deviceQ);
    //     if (device.length) {
    //         console.log('MAC FOUUND');
    //         data = {
    //             "status": false,
    //             "msg": "Mac duplicate."
    //         };
    //         res.send(data);
    //         return
    //     }
    //     else {
    //         var deviceQuery = "select * from devices where mac_address = '" + mac + "' AND serial_number = '" + serial_number + "'";
    //         var device = await sql.query(deviceQuery);
    //         if (device.length > 0) {
    //             var user_acc = await sql.query("SELECT * FROM usr_acc where device_id = " + device[0].id);
    //             if (user_acc.length > 0) {

    //                 // get user account device status
    //                 let deviceStatus = device_helpers.checkStatus(user_acc[0]);
    //                 console.log("device_status accountstatus", deviceStatus);

    //                 if (user_acc[0].dealer_id !== 0 && user_acc[0].dealer_id !== null) {

    //                     var dealerQuery = "select * from dealers where dealer_id = '" + user_acc[0].dealer_id + "'";
    //                     var dealer = await sql.query(dealerQuery);
    //                     // reslts2 
    //                     if (dealer.length > 0) {

    //                         const dvc = {
    //                             dId: dealer[0].dealer_id,
    //                             dealer_pin: dealer[0].link_code,
    //                             connected_dealer: dealer[0].connected_dealer,
    //                             type: await helpers.getUserTypeByTypeId(dealer[0].type),
    //                             device_id: device[0].device_id
    //                         }

    //                         jwt.sign({
    //                             dvc
    //                         }, constants.SECRET, {
    //                                 expiresIn: constants.EXPIRES_IN
    //                             }, (err, token) => {

    //                                 if (err) {
    //                                     res.json({
    //                                         'err': err
    //                                     });
    //                                     return;
    //                                 }

    //                                 let dealerStatus = helpers.getDealerStatus(dealer[0]);

    //                                 if (dealerStatus === Constants.DEALER_SUSPENDED) {
    //                                     data = {
    //                                         status: false,
    //                                         msg: "Dealer Suspended. Contact Admin.",
    //                                         status_msg: dealerStatus,
    //                                         device_id: device[0].device_id,
    //                                         expiry_date: user_acc[0].expiry_date,
    //                                         token: token
    //                                     }
    //                                     res.send(data);
    //                                     return;
    //                                 } else if (dealerStatus == Constants.DEALER_UNLINKED) {
    //                                     data = {
    //                                         status: false,
    //                                         msg: "Dealer Not found. Contact Admin.",
    //                                         status_msg: dealerStatus,
    //                                         device_id: device[0].device_id,
    //                                         expiry_date: user_acc[0].expiry_date,
    //                                         token: token
    //                                     }
    //                                     res.send(data);
    //                                     return;
    //                                 } else {
    //                                     // if (reslts[0].device_status == 0 && (reslts[0].status == '' || reslts[0].status == null) && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
    //                                     if (deviceStatus === Constants.DEVICE_PENDING_ACTIVATION || deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_UNLINKED) {
    //                                         data = {
    //                                             status: true,
    //                                             msg: deviceStatus,
    //                                             device_id: device[0].device_id,
    //                                             expiry_date: user_acc[0].expiry_date,
    //                                             token: token
    //                                         }
    //                                         res.send(data);
    //                                         return;
    //                                     } else if (deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
    //                                         data = {
    //                                             status: false,
    //                                             msg: deviceStatus,
    //                                             device_id: device[0].device_id,
    //                                             expiry_date: user_acc[0].expiry_date,
    //                                             token: token
    //                                         }
    //                                         res.send(data);
    //                                         return;
    //                                     }
    //                                 }

    //                             });


    //                     } else {
    //                         data = {
    //                             status: false,
    //                             msg: "Dealer Not found.Contact Admin.",
    //                             device_id: device[0].device_id,
    //                             expiry_date: user_acc[0].expiry_date
    //                         }
    //                         res.send(data);
    //                         return;
    //                     }
    //                 } else {
    //                     const dvc = {
    //                         // dId: dealer[0].dealer_id,
    //                         // dealer_pin: dealer[0].link_code,
    //                         // connected_dealer: dealer[0].connected_dealer,
    //                         // type: await helpers.getUserTypeByTypeId(dealer[0].type),
    //                         device_id: device[0].device_id
    //                     }

    //                     jwt.sign({
    //                         dvc
    //                     }, constants.SECRET, {
    //                             expiresIn: constants.EXPIRES_IN
    //                         }, (err, token) => {

    //                             if (err) {
    //                                 res.json({
    //                                     'err': err
    //                                 });
    //                                 return;
    //                             }
    //                             //when devcie have no dealer id 
    //                             if (deviceStatus === Constants.DEVICE_PENDING_ACTIVATION || deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_UNLINKED) {
    //                                 data = {
    //                                     status: true,
    //                                     msg: deviceStatus,
    //                                     device_id: device[0].device_id,
    //                                     expiry_date: user_acc[0].expiry_date,
    //                                     token: token
    //                                 }
    //                                 res.send(data);
    //                                 return;
    //                             } else if (deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
    //                                 data = {
    //                                     status: false,
    //                                     msg: deviceStatus,
    //                                     device_id: device[0].device_id,
    //                                     expiry_date: user_acc[0].expiry_date,
    //                                     token: token
    //                                 }
    //                                 res.send(data);
    //                                 return;
    //                             }
    //                         });
    //                 }
    //             } else {
    //                 data = {
    //                     status: true,
    //                     msg: Constants.NEW_DEVICE,
    //                 }
    //                 res.send(data);

    //                 // data = {
    //                 //     "status": true,
    //                 //     "msg": "account disabled",
    //                 // }
    //                 // res.send(data);
    //             }

    //         } else {
    //             console.log(Constants.NEW_DEVICE)
    //             data = {
    //                 status: true,
    //                 msg: Constants.NEW_DEVICE,
    //             }
    //             res.send(data);
    //         }
    //     }
    // }
    // else if (serial_number === Constants.PRE_DEFINED_MAC_ADDRESS) {

    //     var deviceQ = "SELECT * FROM devices WHERE  serial_number= '" + serial_number + "' ";
    //     var device = await sql.query(deviceQ);
    //     if (device.length) {
    //         console.log('SERIAL FOUUND');
    //         data = {
    //             "status": false,
    //             "msg": "serial duplicate."
    //         };
    //         res.send(data);
    //         return
    //     }
    //     else {
    //         var deviceQuery = "select * from devices where mac_address = '" + mac + "' AND serial_number = '" + serial_number + "'";
    //         // 
    //         var device = await sql.query(deviceQuery);
    //         if (device.length > 0) {
    //             var user_acc = await sql.query("SELECT * FROM usr_acc where device_id = " + device[0].id);
    //             if (user_acc.length > 0) {

    //                 // get user account device status
    //                 let deviceStatus = device_helpers.checkStatus(user_acc[0]);
    //                 console.log("device_status accountstatus", deviceStatus);

    //                 if (user_acc[0].dealer_id !== 0 && user_acc[0].dealer_id !== null) {

    //                     var dealerQuery = "select * from dealers where dealer_id = '" + user_acc[0].dealer_id + "'";
    //                     var dealer = await sql.query(dealerQuery);
    //                     // reslts2 
    //                     if (dealer.length > 0) {

    //                         const dvc = {
    //                             dId: dealer[0].dealer_id,
    //                             dealer_pin: dealer[0].link_code,
    //                             connected_dealer: dealer[0].connected_dealer,
    //                             type: await helpers.getUserTypeByTypeId(dealer[0].type),
    //                             device_id: device[0].device_id
    //                         }

    //                         jwt.sign({
    //                             dvc
    //                         }, constants.SECRET, {
    //                                 expiresIn: constants.EXPIRES_IN
    //                             }, (err, token) => {

    //                                 if (err) {
    //                                     res.json({
    //                                         'err': err
    //                                     });
    //                                     return;
    //                                 }

    //                                 let dealerStatus = helpers.getDealerStatus(dealer[0]);

    //                                 if (dealerStatus === Constants.DEALER_SUSPENDED) {
    //                                     data = {
    //                                         status: false,
    //                                         msg: "Dealer Suspended. Contact Admin.",
    //                                         status_msg: dealerStatus,
    //                                         device_id: device[0].device_id,
    //                                         expiry_date: user_acc[0].expiry_date,
    //                                         token: token
    //                                     }
    //                                     res.send(data);
    //                                     return;
    //                                 } else if (dealerStatus == Constants.DEALER_UNLINKED) {
    //                                     data = {
    //                                         status: false,
    //                                         msg: "Dealer Not found. Contact Admin.",
    //                                         status_msg: dealerStatus,
    //                                         device_id: device[0].device_id,
    //                                         expiry_date: user_acc[0].expiry_date,
    //                                         token: token
    //                                     }
    //                                     res.send(data);
    //                                     return;
    //                                 } else {
    //                                     // if (reslts[0].device_status == 0 && (reslts[0].status == '' || reslts[0].status == null) && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
    //                                     if (deviceStatus === Constants.DEVICE_PENDING_ACTIVATION || deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_UNLINKED) {
    //                                         data = {
    //                                             status: true,
    //                                             msg: deviceStatus,
    //                                             device_id: device[0].device_id,
    //                                             expiry_date: user_acc[0].expiry_date,
    //                                             token: token
    //                                         }
    //                                         res.send(data);
    //                                         return;
    //                                     } else if (deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
    //                                         data = {
    //                                             status: false,
    //                                             msg: deviceStatus,
    //                                             device_id: device[0].device_id,
    //                                             expiry_date: user_acc[0].expiry_date,
    //                                             token: token
    //                                         }
    //                                         res.send(data);
    //                                         return;
    //                                     }
    //                                 }

    //                             });


    //                     } else {
    //                         data = {
    //                             status: false,
    //                             msg: "Dealer Not found.Contact Admin.",
    //                             device_id: device[0].device_id,
    //                             expiry_date: user_acc[0].expiry_date
    //                         }
    //                         res.send(data);
    //                         return;
    //                     }
    //                 } else {
    //                     const dvc = {
    //                         // dId: dealer[0].dealer_id,
    //                         // dealer_pin: dealer[0].link_code,
    //                         // connected_dealer: dealer[0].connected_dealer,
    //                         // type: await helpers.getUserTypeByTypeId(dealer[0].type),
    //                         device_id: device[0].device_id
    //                     }

    //                     jwt.sign({
    //                         dvc
    //                     }, constants.SECRET, {
    //                             expiresIn: constants.EXPIRES_IN
    //                         }, (err, token) => {

    //                             if (err) {
    //                                 res.json({
    //                                     'err': err
    //                                 });
    //                                 return;
    //                             }
    //                             //when devcie have no dealer id 
    //                             if (deviceStatus === Constants.DEVICE_PENDING_ACTIVATION || deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_UNLINKED) {
    //                                 data = {
    //                                     status: true,
    //                                     msg: deviceStatus,
    //                                     device_id: device[0].device_id,
    //                                     expiry_date: user_acc[0].expiry_date,
    //                                     token: token
    //                                 }
    //                                 res.send(data);
    //                                 return;
    //                             } else if (deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
    //                                 data = {
    //                                     status: false,
    //                                     msg: deviceStatus,
    //                                     device_id: device[0].device_id,
    //                                     expiry_date: user_acc[0].expiry_date,
    //                                     token: token
    //                                 }
    //                                 res.send(data);
    //                                 return;
    //                             }
    //                         });
    //                 }
    //             } else {
    //                 data = {
    //                     status: true,
    //                     msg: Constants.NEW_DEVICE,
    //                 }
    //                 res.send(data);

    //                 // data = {
    //                 //     "status": true,
    //                 //     "msg": "account disabled",
    //                 // }
    //                 // res.send(data);
    //             }

    //         } else {
    //             console.log(Constants.NEW_DEVICE)
    //             data = {
    //                 status: true,
    //                 msg: Constants.NEW_DEVICE,
    //             }
    //             res.send(data);
    //         }
    //     }
    // }
    else {
        var deviceQuery = "select * from devices where mac_address = '" + mac + "' OR serial_number = '" + serial_number + "'";
        // 
        var device = await sql.query(deviceQuery);
        if (device.length > 0) {
            var user_acc = await sql.query("SELECT * FROM usr_acc where device_id = " + device[0].id);
            if (user_acc.length > 0) {

                // get user account device status
                let deviceStatus = device_helpers.checkStatus(user_acc[0]);
                console.log("device_status accountstatus", deviceStatus);

                if (user_acc[0].dealer_id !== 0 && user_acc[0].dealer_id !== null) {

                    var dealerQuery = "select * from dealers where dealer_id = '" + user_acc[0].dealer_id + "'";
                    var dealer = await sql.query(dealerQuery);
                    // reslts2 
                    if (dealer.length > 0) {

                        const dvc = {
                            dId: dealer[0].dealer_id,
                            dealer_pin: dealer[0].link_code,
                            connected_dealer: dealer[0].connected_dealer,
                            type: await helpers.getUserTypeByTypeId(dealer[0].type),
                            device_id: device[0].device_id
                        }

                        jwt.sign({
                            dvc
                        }, constants.SECRET, {
                                expiresIn: constants.EXPIRES_IN
                            }, (err, token) => {

                                if (err) {
                                    res.json({
                                        'err': err
                                    });
                                    return;
                                }

                                let dealerStatus = helpers.getDealerStatus(dealer[0]);

                                if (dealerStatus === Constants.DEALER_SUSPENDED) {
                                    data = {
                                        status: false,
                                        msg: "Dealer Suspended. Contact Admin.",
                                        status_msg: dealerStatus,
                                        device_id: device[0].device_id,
                                        expiry_date: user_acc[0].expiry_date,
                                        token: token
                                    }
                                    res.send(data);
                                    return;
                                } else if (dealerStatus == Constants.DEALER_UNLINKED) {
                                    data = {
                                        status: false,
                                        msg: "Dealer Not found. Contact Admin.",
                                        status_msg: dealerStatus,
                                        device_id: device[0].device_id,
                                        expiry_date: user_acc[0].expiry_date,
                                        token: token
                                    }
                                    res.send(data);
                                    return;
                                } else {
                                    // if (reslts[0].device_status == 0 && (reslts[0].status == '' || reslts[0].status == null) && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
                                    if (deviceStatus === Constants.DEVICE_PENDING_ACTIVATION || deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_UNLINKED) {
                                        data = {
                                            status: true,
                                            msg: deviceStatus,
                                            device_id: device[0].device_id,
                                            expiry_date: user_acc[0].expiry_date,
                                            token: token
                                        }
                                        res.send(data);
                                        return;
                                    } else if (deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
                                        data = {
                                            status: false,
                                            msg: deviceStatus,
                                            device_id: device[0].device_id,
                                            expiry_date: user_acc[0].expiry_date,
                                            token: token
                                        }
                                        res.send(data);
                                        return;
                                    }
                                }

                            });


                    } else {
                        data = {
                            status: false,
                            msg: "Dealer Not found.Contact Admin.",
                            device_id: device[0].device_id,
                            expiry_date: user_acc[0].expiry_date
                        }
                        res.send(data);
                        return;
                    }
                } else {
                    const dvc = {
                        // dId: dealer[0].dealer_id,
                        // dealer_pin: dealer[0].link_code,
                        // connected_dealer: dealer[0].connected_dealer,
                        // type: await helpers.getUserTypeByTypeId(dealer[0].type),
                        device_id: device[0].device_id
                    }

                    jwt.sign({
                        dvc
                    }, constants.SECRET, {
                            expiresIn: constants.EXPIRES_IN
                        }, (err, token) => {

                            if (err) {
                                res.json({
                                    'err': err
                                });
                                return;
                            }
                            //when devcie have no dealer id 
                            if (deviceStatus === Constants.DEVICE_PENDING_ACTIVATION || deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_UNLINKED) {
                                data = {
                                    status: true,
                                    msg: deviceStatus,
                                    device_id: device[0].device_id,
                                    expiry_date: user_acc[0].expiry_date,
                                    token: token
                                }
                                res.send(data);
                                return;
                            } else if (deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
                                data = {
                                    status: false,
                                    msg: deviceStatus,
                                    device_id: device[0].device_id,
                                    expiry_date: user_acc[0].expiry_date,
                                    token: token
                                }
                                res.send(data);
                                return;
                            }
                        });


                }
            } else {

                data = {
                    status: true,
                    msg: Constants.NEW_DEVICE,
                }
                res.send(data);

                // data = {
                //     "status": true,
                //     "msg": "account disabled",
                // }
                // res.send(data);
            }

        } else {
            console.log(Constants.NEW_DEVICE)
            data = {
                status: true,
                msg: Constants.NEW_DEVICE,
            }
            res.send(data);
        }
    }
});

router.post('/imeiChanged', async function (req, res) {
    let deviceId = req.body.device_id;
    var imei = req.body.imei;
    var serial_number = req.body.serial;
    var mac_address = req.body.mac;
    var imei1 = imei[0] ? imei[0] : null;
    var imei2 = imei[1] ? imei[1] : null;
    // console.log(req.body);

    if (serial_number !== undefined && serial_number !== null && mac_address !== undefined && mac_address !== null) {
        if (imei1) {
            sql.query("UPDATE devices set imei = '" + imei1 + "' WHERE device_id = '" + deviceId + "'")
        } else {
            sql.query("UPDATE devices set imei2 = '" + imei2 + "' WHERE device_id = '" + deviceId + "'")
        }
        let response = await device_helpers.saveImeiHistory(deviceId, serial_number, mac_address, imei1, imei2)
        // console.log("response", response);
        res.send({
            status: response
        })
    }
});

router.get('/admin/marketApplist', async function (req, res) {
    let data = [];
    sql.query("SELECT apk_details.* , secure_market_apps.is_restrict_uninstall from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 AND secure_market_apps.dealer_type = 'admin'", function (err, results) {
        if (err) throw err;
        if (results.length) {
            for (var i = 0; i < results.length; i++) {
                dta = {
                    apk_name: results[i].app_name,
                    logo: results[i].logo,
                    apk: results[i].apk,
                    apk_status: results[i].status,
                    package_name: results[i].package_name,
                    is_restrict_uninstall: results[i].is_restrict_uninstall,
                    apk_size: results[i].apk_size,
                }
                data.push(dta);
            }
            //   console.log(data);
            //res.json("status" : true , result : data);
            return res.json({
                success: true,
                list: data
            });
        } else {
            data = {
                "status": false,
                "msg": "No result found"
            }
            res.send(data);
        }
    })
});
router.get('/marketApplist/:linkCode', async function (req, res) {
    let data = [];

    let dealer_id = await helpers.getDealerIdByLinkOrActivation(req.params.linkCode)

    if (dealer_id) {
        sql.query("SELECT apk_details.* , secure_market_apps.is_restrict_uninstall from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 AND (secure_market_apps.dealer_id = '" + dealer_id + "' OR dealer_type = 'admin')", function (err, results) {
            // console.log("SELECT apk_details.* from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 AND secure_market_apps.dealer_id = '" + dealer_id + "'");
            if (err) throw err;
            if (results.length) {
                for (var i = 0; i < results.length; i++) {
                    dta = {
                        apk_name: results[i].app_name,
                        logo: results[i].logo,
                        apk: results[i].apk,
                        apk_status: results[i].status,
                        package_name: results[i].package_name,
                        is_restrict_uninstall: results[i].is_restrict_uninstall,
                        apk_size: results[i].apk_size,
                    }
                    data.push(dta);
                }
                //   console.log(data);
                //res.json("status" : true , result : data);
                return res.json({
                    success: true,
                    list: data
                });
            } else {
                data = {
                    status: false,
                    msg: "No result found"
                }
                res.send(data);
            }
        })
    } else {
        data = {
            status: false,
            msg: "No result found"
        }
        res.send(data);
    }
});
module.exports = router;