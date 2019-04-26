var express = require('express');
var router = express.Router();
//var uniqid = require('uniqid'); 
var randomize = require('randomatic');
const sql = require('../helper/sql.js');
var helpers = require('../helper/general_helper.js');
const bcrypt = require('bcrypt');
var datetime = require('node-datetime');
var empty = require('is-empty');
var jwt = require('jsonwebtoken');
var config = require('../helper/config.js');
var path = require('path');
var md5 = require('md5');
var fs = require("fs");
const nodemailer = require('nodemailer');
var moment = require('moment-strftime');
const device_helpers = require('../helper/device_helpers.js');
var Constants = require('../constants/Application');
/** SMTP Email **/
var smtpTransport = nodemailer.createTransport({
    host: "smtp.office365.com",
    secureConnection: true,
    // logger: true,
    // debug: true,
    connectionTimeout: 600000,
    greetingTimeout: 300000,
    port: 587,
    auth: {
        user: "admin@lockmesh.com",
        pass: "34e@2!2xder"
    }
});

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
        jwt.verify(token, config.secret, function (err, decoded) {
            // console.log(err);
            if (err) {
                return res.json({
                    success: false,
                    message: 'TOKEN_INVALID'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                req.decoded.status = true;
                ath = decoded;
            }
        });
    } else {
        // if there is no token return an error
        return res.status(403).send({
            success: false,
            message: 'TOKEN_NOT_PROVIDED'
        });
    }
    return ath;
}

/* Client Login with Link Code MDM  */
/* Client Login via Locker app*/
router.post('/login', async function (req, resp) {

    var linkCode = req.body.link_code;
    var mac_address = req.body.macAddr;
    var serial_number = req.body.serialNo
    // console.log("mac_address", mac_address);
    // console.log("serial_number", serial_number);
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
                        'dId': dealer[0].dealer_id,
                        'dealer_pin': dealer[0].link_code,
                        'connected_dealer': dealer[0].connected_dealer,
                        'type': await helpers.getUserTypeByTypeId(dealer[0].type)
                    }

                    jwt.sign({
                        device
                    }, config.secret, {
                            expiresIn: '86400s'
                        }, (err, token) => {
                            if (err) {
                                resp.json({
                                    'err': err
                                });
                            } else {
                                // console.log(device);

                                resp.json({
                                    token: token,
                                    'status': true,
                                    'data': device,
                                });
                            }
                        });
                }
            }

        } else if (linkCode.length >= 7) {
            var usrAccQ = "SELECT * FROM usr_acc WHERE activation_code='" + linkCode + "'";
            var usrAcc = await sql.query(usrAccQ);
            if (usrAcc.length === 0) {
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
                            'status': false,
                            'msg': 'Dealer Suspended, Contact Admin'
                        }
                        resp.status(200).send(data);

                    } else {

                        let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address } = getDeviceInfo(req);
                        // console.log("this is info ", { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address });
                        let NewDeviceId = helpers.getDeviceId(serial_number, mac_address)
                        let chechedDeviceId = checkDeviceId(NewDeviceId, serial_number, mac_address)
                        if (usrAcc[0].expiry_months == 0) {
                            var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
                            var expiry_date = moment(trailDate).format("YYYY/MM/DD")
                        } else {
                            var expiry_date = helpers.getExpDateByMonth(new Date(), usrAcc[0].expiry_months);
                        }
                        var updateDevice = "UPDATE devices set device_id = '" + chechedDeviceId + "'  ip_address = '" + ip + "', simno = '" + simNo1 + "', online = 'On', imei='" + imei1 + "', imei2='" + imei2 + "', serial_number='" + serial_number + "', mac_address='" + mac_address + "' , simno2 = '" + simNo2 + "' where id='" + usrAcc[0].device_id + "'";
                        var updateAccount = "UPDATE usr_acc set activation_status=1, status='active', expiry_date='" + expiry_date + "', device_status=1, unlink_status = 0 WHERE id = " + usrAcc[0].id;

                        await sql.query(updateDevice);
                        await sql.query(updateAccount);
                        let device_id = await device_helpers.getDvcIDByDeviceID(usrAcc[0].device_id)
                        const device = {
                            'dId': dealer[0].dealer_id,
                            'dealer_pin': dealer[0].link_code,
                            'connected_dealer': dealer[0].connected_dealer,
                            'type': await helpers.getUserTypeByTypeId(dealer[0].type),
                            'device_id': device_id
                        }

                        jwt.sign({
                            device
                        }, config.secret, {
                                expiresIn: config.expiresIn
                            }, (err, token) => {
                                if (err) {
                                    resp.json({
                                        'err': err
                                    });
                                } else {

                                    resp.json({
                                        token: token,
                                        'status': true,
                                        'data': device,
                                    });
                                }
                            });
                    }
                }
                else {

                }
            }
            // console.log("activation code");
        }

    } else if ((mac_address !== undefined && mac_address !== null) && (serial_number !== undefined && serial_number !== null)) {

        var deviceQ = "SELECT * FROM devices WHERE mac_address = '" + mac_address + "' OR serial_number='" + serial_number + "'";
        var device = await sql.query(deviceQ);
        if (device.length == 0) {
            data = {
                'status': false,
                'msg': 'Invalid Device'
            }
            resp.send(data);
        } else {
            let usr_acc = await device_helpers.getUserAccByDvcId(device[0].id);
            let deviceStatus = device_helpers.checkStatus(usr_acc);

            if (deviceStatus == "Unlinked") {
                data = {
                    'status': false,
                    'msg': 'unlinked'
                }

            } else if (deviceStatus == 'Expired') {
                data = {
                    'status': false,
                    'msg': 'expired'
                }
            } else if (deviceStatus == "Suspended") {
                data = {
                    'status': false,
                    'msg': 'suspended'
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
                    'status': true,
                    'msg': 'success'
                }

            }

            const dvc = {
                'dId': usr_acc.dealer_id,
                'device_id': device[0].device_id,
                data
            }
            // console.log("this is device", dvc);
            jwt.sign({
                dvc
            }, config.secret, {
                    expiresIn: '86400s'
                }, (err, token) => {
                    if (err) {
                        resp.json({
                            'err': err
                        });
                        return;
                    }

                    var d = new Date(usr_acc.expiry_date);
                    var n = d.valueOf()
                    // console.log("expire in", n);
                    try {

                        resp.json({
                            token: token,
                            'status': data.status,
                            'msg': data.msg,
                            'dId': device.dId,
                            'device_id': dvc.device_id,
                            'expiresIn': n
                        });
                    } catch (error) {
                        // console.log(error);
                    }
                });
        }

    } else {
        data = {
            'status': false,
            'msg': 'Device not linked'
        }
        resp.send(data);
    }
});

async function checkDeviceId(device_id, sn, mac) {

    let query = "SELECT device_id FROM devices WHERE device_id = '" + device_id + "';"
    let result = await sql.query(query);
    if (result.length > 1) {
        device_id = helpers.getDeviceId(sn, mac);
        checkDeviceId(device_id, sn, mac);
    } else {
        return device_id;
    }
}

function getDeviceInfo(req) {
    // var dId = req.body.dId;
    // // var connected_dealer = req.body.connected_dealer;
    // // var deviceId = uniqid.process();

    var imei = req.body.imei;
    var ip = req.body.ip;
    var simNo = req.body.simNo;
    var serial_number = req.body.serialNo;
    var mac_address = req.body.macAddr;

    //geting imei's
    var imei1 = imei[0] ? imei[0] : null;
    var imei2 = imei[1] ? imei[1] : null;

    var simNo1 = simNo[0] ? simNo[0] : null;
    var simNo2 = simNo[1] ? simNo[1] : null;
    return {
        imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address
    }
}
/** Link Device MDM **/
router.post('/linkdevice', async function (req, resp) {
    //res.setHeader('Content-Type', 'application/json');
    // console.log("/linkdevice");

    var reslt = verifyToken(req, resp);
    var dId = req.body.dId;
    var connected_dealer = (req.body.connected_dealer === undefined || req.body.connected_dealer === null) ? 0 : req.body.connected_dealer;
    // var deviceId = uniqid.process();
    let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address } = getDeviceInfo(req);

    var device_id = helpers.getDeviceId(serial_number, mac_address);

    var deviceId = await checkDeviceId(device_id, serial_number, mac_address);

    if (reslt.status == true) {
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
            // let dealerStatus = helpers.getDealerStatus(dealer[0]);

            if (device.length > 0) {
                var user_acc = await device_helpers.getUserAccByDvcId(device[0].id);
                if (user_acc) {
                    let deviceStatus = device_helpers.checkStatus(user_acc);
                    if (deviceStatus == Constants.DEVICE_UNLINKED) {

                        var link_acc = "";
                        var updateDviceQ = "UPDATE devices set ip_address = '" + ip + "', simno = '" + simNo1 + "', online = 'On' , simno2 = '" + simNo2 + "', reject_status=0  where id=" + device[0].id;
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

                        resp.json({
                            "status": true,
                            "msg": "Device linked."
                        });
                    });
                }

            } else {
                let insertDevice = "INSERT INTO devices (device_id, imei, imei2, ip_address, simno, simno2, serial_number, mac_address, online) values(?,?,?,?,?,?,?,?,?)";
                sql.query(insertDevice, [deviceId, imei1, imei2, ip, simNo1, simNo2, serial_number, mac_address, 'On'], function (error, deviceRes) {
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

                    sql.query(insertUserAcc, values, function (error, rows) {
                        if (error) throw error;
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

    }
});

/** Device status (Added Device or not) api  MDM **/
router.post('/getstatus', async function (req, resp) {
    var serial_number = req.body.serial_number;
    var mac = req.body.mac;
    var reslt = verifyToken(req, resp);

    if (reslt.status == true) {
        var deviceQ = "SELECT * FROM devices WHERE  mac_address= '" + mac + "' OR serial_number = '" + serial_number + "'";
        //console.log(sql1);

        var device = await sql.query(deviceQ);
        // console.log("my device", device);
        // res
        //console.log(res[0].device_status);
        if (device.length > 0) {
            // let userAcc = await sql.query("SELECT * FROM usr_acc WHERE device_id="+ device[0].id);
            let userAcc = await device_helpers.getUserAccByDvcId(device[0].id);
            // console.log("get usr account by device id", userAcc);
            if (userAcc) {
                let deviceStatus = device_helpers.checkStatus(userAcc);
                // console.log("device_status get_status", deviceStatus);

                if (userAcc.device_status == 0) {
                    if (userAcc.unlink_status == 1) {
                        data = {
                            "status": -1,
                            "msg": "Device Unlinked.",
                            "dealer_id": userAcc.dealer_id,
                            "device_id": device[0].device_id
                        };
                    } else {
                        data = {
                            "status": 0,
                            "msg": "Processing.",
                            "dealer_id": userAcc.dealer_id,
                            "device_id": device[0].device_id
                        };

                    }

                    resp.send(data);
                } else {
                    data = {
                        "status": 1,
                        "msg": "Device activated.",
                        "dealer_id": userAcc.dealer_id,
                        "expiry_date": userAcc.expiry_date,
                        "device_id": device[0].device_id,
                        // "chat_id": res[0].chat_id,
                        // "pgp_email": res[0].pgp_email,
                        // "sim_id": res[0].sim_id
                    };
                    resp.send(data);
                }
                // if(deviceStatus === Constants.DEVICE_PENDING_ACTIVATION){
                //     console.log("pending");
                //     data = {
                //         "status": -1,
                //         "msg": "Device Unlinked.",
                //         "dealer_id": userAcc.dealer_id,
                //         "device_id": device[0].device_id
                //     };
                //     resp.send(data);
                //     return;
                // }  

                // else {
                //     console.log("activated");
                //     data = {
                //         "status": 0,
                //         "msg": "Processing.",
                //         "dealer_id": userAcc.dealer_id,
                //         "expiry_date": usrAcc.expiry_date,
                //         "device_id": device[0].device_id,
                //         // "chat_id": res[0].chat_id,
                //         // "pgp_email": res[0].pgp_email,
                //         // "sim_id": res[0].sim_id
                //     };
                //     resp.send(data);
                // }
                // else {
                //     console.log("activated");
                //     data = {
                //         "status": 1,
                //         "msg": "Device activated.",
                //         "dealer_id": userAcc.dealer_id,
                //         "expiry_date": usrAcc.expiry_date,
                //         "device_id": device[0].device_id,
                //         // "chat_id": res[0].chat_id,
                //         // "pgp_email": res[0].pgp_email,
                //         // "sim_id": res[0].sim_id
                //     };
                //     resp.send(data);
                // }

            }


            // else if (userAcc.expiry_date == null || userAcc.expiry_date == '') {
            //     console.log("expiry date");

            //     data = {
            //         "status": 1,
            //         "msg": "Device activated.",
            //         "dealer_id": userAcc.dealer_id,
            //         "expiry_date": '',
            //         "device_id": device[0].device_id,
            //         // "chat_id": userAcc[0].chat_id,
            //         // "pgp_email": res[0].pgp_email,
            //         // "sim_id": res[0].sim_id
            //     };
            //     resp.send(data);
            // }


            // } else {

            // }
        } else {
            data = {
                "status": -1,
                "msg": "Not found."
            };
            resp.send(data);


        }
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
        if (!empty(mac_address) || !empty(serial_number)) {
            let deviceQ = "SELECT id FROM devices WHERE mac_address='" + mac_address + "' OR serial_number='" + serial_number + "'";
            sql.query(deviceQ, async function (error, resp) {
                if (error) throw (error);
                if (resp.length) {
                    var query = "UPDATE usr_acc SET unlink_status=1, dealer_id=null WHERE device_id = '" + resp[0].id + "'";

                    await sql.query(query);
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

/* Screen Lock Expiry Date   */
router.post('/screen/getstatus', async function (req, res) {
    var verify = verifyToken(req, res);
    var imei = req.body.imei;
    var mac = req.body.mac;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');
    // console.log(formatted_dt);    

    var sql1 = "select expiry_date, status, device_status from devices where mac_address = '" + mac + "'";
    var reslt = await sql.query(sql1);

    if (verify == true) {
        if (reslt.length > 0) {
            if (reslt[0].expiry_date > formatted_dt && reslt[0].device_status == 1 && reslt[0].expiry_date != null) {
                data = {
                    "status": true,
                    "exp_date": reslt[0].expiry_date,
                    "msg": "active"

                };
                res.send(data);
            } else {

                data = {
                    "status": false,
                    "msg": "Device EXPIRED Contact ADMIN"

                };
                res.send(data);
            }
        } else {
            data = {
                "status": false,
                "msg": "Device NOT LINKED contact ADMIN"

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


router.get('/getUpdate/:version/:uniqueName', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let versionName = req.params.version;
    let uniqueName = req.params.uniqueName;
    let query = "SELECT * FROM apk_details WHERE package_name = '" + uniqueName + "' AND delete_status=0 limit 1";
    sql.query(query, function (error, response) {
        // console.log("res", response);

        if (error) {
            res.send({
                status: false,
                msg: ""
            });

        }

        if (response.length) {
            // console.log("verion name", Number(response[0].version_name));
            // console.log("verion name", Number(versionName));

            if (Number(response[0].version_name) > Number(versionName)) {
                console.log("i am here", response[0].version_name);

                res.send({
                    apk_status: true,
                    apk_url: response[0].apk
                })
            } else {
                res.send({
                    apk_status: false,
                    msg: ""
                });
            }
        } else {
            res.send({
                apk_status: false,
                msg: ""
            });
        }
    })
});

/** Get Apk **/
router.get("/getApk/:apk", (req, res) => {

    if (fs.existsSync(path.join(__dirname, "../uploads/" + req.params.apk + '.apk'))) {
        // Do something
        res.sendFile(path.join(__dirname, "../uploads/" + req.params.apk + '.apk'));
    } else {
        res.send({
            "status": false,
            "msg": "file not found"
        })
    }
});

/** New API MDM Client App (11th.Oct.2018) **/

/** Get status of device (active,expired,inactive) **/
router.post('/accountstatus', async function (req, res) {
    var serial_number = req.body.serialNo;
    var mac = req.body.macAddr;
    var data;

    console.log('serial_number : ' + serial_number);
    console.log('mac : ' + mac);

    if (empty(serial_number) || empty(mac)) {
        data = {
            status: false,
            msg: "Information not provided"
        }
        res.send(data);
    } else {
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

                        const device = {
                            dId: dealer[0].dealer_id,
                            dealer_pin: dealer[0].link_code,
                            connected_dealer: dealer[0].connected_dealer,
                            type: await helpers.getUserTypeByTypeId(dealer[0].type),
                            device_id: device[0].device_id
                        }

                        jwt.sign({
                            device
                        }, config.secret, {
                            expiresIn: config.expiresIn
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
                                if (deviceStatus === Constants.DEVICE_PENDING_ACTIVATION || deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_UNLINKED) {
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
                            "status": false,
                            "msg": "Dealer Not found.Contact Admin.",
                            "device_id": device[0].device_id,
                            "expiry_date": user_acc[0].expiry_date
                        }
                        res.send(data);
                        return;
                    }
                } else {
                    const device = {
                        // dId: dealer[0].dealer_id,
                        // dealer_pin: dealer[0].link_code,
                        // connected_dealer: dealer[0].connected_dealer,
                        type: await helpers.getUserTypeByTypeId(dealer[0].type),
                        device_id: device[0].device_id
                    }

                    jwt.sign({
                        device
                    }, config.secret, {
                        expiresIn: config.expiresIn
                    }, (err, token) => {

                        if (err) {
                            res.json({
                                'err': err
                            });
                            return;
                        }
                        //when devcie have no dealer id 
                        if (deviceStatus === Constants.DEVICE_PENDING_ACTIVATION || deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_UNLINKED) {
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
                    "status": true,
                    "msg": Constants.NEW_DEVICE,
                }
                res.send(data);

                // data = {
                //     "status": true,
                //     "msg": "account disabled",
                // }
                // res.send(data);
            }

        } else {
            data = {
                "status": true,
                "msg": Constants.NEW_DEVICE,
            }
            res.send(data);
        }
    }

});

module.exports = router;