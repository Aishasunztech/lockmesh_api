var mime = require('mime');
var moment = require('moment-strftime');
const axios = require('axios');
var empty = require('is-empty');
var jwt = require('jsonwebtoken');

var path = require('path');
var md5 = require('md5');
var fs = require("fs");


const { sql } = require('../../config/database');
var helpers = require('../../helper/general_helper.js');

const device_helpers = require('../../helper/device_helpers.js');
var Constants = require('../../constants/Application');
var app_constants = require('../../config/constants');

const { sendEmail } = require('../../lib/email');

let usr_acc_query_text = Constants.usr_acc_query_text;

var verifyToken = function (req, res) {
    // check header or url parameters or post parameters for token
    var ath;
    var token = req.headers['authorization'];
    // console.log("TOken", token);

    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app_constants.SECRET, function (err, decoded) {
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

// without token
exports.login = async function (req, resp) {

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
                    }, app_constants.SECRET, {
                        expiresIn: app_constants.EXPIRES_IN
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
                                dealer_pin: device.dealer_pin,
                                dId: dealer[0].dealer_id,
                                dealer_pin: dealer[0].link_code,
                                connected_dealer: dealer[0].connected_dealer,
                            });
                        }
                    });
                }
            }
        } else if (linkCode.length >= 7) {
            console.log(linkCode);
            var usrAccQ = "SELECT * FROM usr_acc WHERE activation_code='" + linkCode + "' and activation_status=0";
            console.log(usrAccQ);
            var usrAcc = await sql.query(usrAccQ);
            if (usrAcc.length === 0) {
                console.log("Activation Not found");
                data = {
                    'status': false,
                    'msg': 'Invalid activation code'
                }
                resp.send(data);
            } else {
                let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address, type, version } = device_helpers.getDeviceInfo(req);
                var deviceCheckQuery = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND devices.mac_address = '${mac_address}' AND devices.serial_number = '${serial_number}' AND usr_acc.unlink_status = 1 ORDER BY devices.id DESC`;
                console.log(deviceCheckQuery);
                let result = await sql.query(deviceCheckQuery)
                console.log(result);
                if (result && result.length > 0) {
                    var deleteSql1 = `DELETE FROM usr_acc where device_id=${result[0].usr_device_id}`;
                    await sql.query(deleteSql1)
                    console.log("DELETE from devices where device_id = '" + result[0].device_id + "'", `DELETE FROM usr_acc where device_id = ${result[0].usr_device_id}`);
                    var sqlDevice = "DELETE from devices where device_id = '" + result[0].device_id + "'";
                    await sql.query(sqlDevice);

                }
                let validity = await device_helpers.checkRemainDays(usrAcc[0].created_at, usrAcc[0].validity)
                if (validity < 0 || validity === 'Expired') {
                    console.log("Dealer Not found");
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

                            let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address, type, version } = device_helpers.getDeviceInfo(req);
                            if (!empty(mac_address) || !empty(serial_number)) {
                                let status = 'active'
                                // console.log("this is info ", { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address });
                                let chechedDeviceId = await helpers.getDeviceId(serial_number, mac_address)
                                // let chechedDeviceId = checkDeviceId(NewDeviceId, serial_number, mac_address)
                                if (usrAcc[0].expiry_months == 0) {
                                    var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
                                    var expiry_date = moment(trailDate).format("YYYY/MM/DD")
                                    status = 'trial'
                                } else {
                                    var expiry_date = helpers.getExpDateByMonth(new Date(), usrAcc[0].expiry_months);
                                }
                                var updateDevice = "UPDATE devices set device_id = '" + chechedDeviceId + "', ip_address = '" + ip + "', simno = '" + simNo1 + "', online = '" + Constants.DEVICE_OFFLINE + "', imei='" + imei1 + "', imei2='" + imei2 + "', serial_number='" + serial_number + "', mac_address='" + mac_address + "', simno2 = '" + simNo2 + "' where id='" + usrAcc[0].device_id + "'";
                                await sql.query(updateDevice);

                                var updateAccount = "UPDATE usr_acc set activation_status=1, type = '" + type + "', version = '" + version + "', status='" + status + "', expiry_date='" + expiry_date + "', start_date='" + start_date + "', device_status=1, unlink_status = 0 WHERE id = " + usrAcc[0].id;
                                await sql.query(updateAccount);
                                device_helpers.saveImeiHistory(chechedDeviceId, serial_number, mac_address, imei1, imei2)
                                let device_id = await device_helpers.getDvcIDByDeviceID(usrAcc[0].device_id)

                                // Update device details on Super admin
                                axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                                    // console.log("SUPER ADMIN LOGIN API RESPONSE", response);
                                    if (response.data.status) {
                                        let data = {
                                            linkToWL: true,
                                            SN: serial_number,
                                            mac: mac_address,
                                            device_id: device_id
                                        }
                                        axios.put(app_constants.UPDATE_DEVICE_SUPERADMIN_URL, data, { headers: { authorization: response.data.user.token } })
                                    }
                                }).catch((err) => {
                                    if (err) {
                                        console.log("SA SERVER NOT RESPONDING")
                                    }
                                })

                                const device = {
                                    dId: dealer[0].dealer_id,
                                    dealer_pin: dealer[0].link_code,
                                    connected_dealer: dealer[0].connected_dealer,
                                    type: await helpers.getUserTypeByTypeId(dealer[0].type),
                                    device_id: device_id
                                }

                                jwt.sign({
                                    device
                                }, app_constants.SECRET, {
                                    expiresIn: app_constants.EXPIRES_IN
                                }, (err, token) => {
                                    if (err) {
                                        resp.json({
                                            err: err
                                        });
                                    } else {

                                        resp.json({
                                            token: token,
                                            status: true,
                                            dId: dealer[0].dealer_id,
                                            dealer_pin: dealer[0].link_code,
                                            connected_dealer: dealer[0].connected_dealer,
                                            device_id: device_id
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
                        console.log("Dealer Not found");
                        data = {
                            'status': false,
                            'msg': 'Invalid activation code'
                        }
                        resp.send(data);
                    }
                }

            }
        }

    }
    else {
        data = {
            status: false,
            msg: 'information not provided'
        }
        resp.send(data);
    }
}

// without token
exports.systemLogin = async function (req, res) {
    let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address } = device_helpers.getDeviceInfo(req);
    console.log(imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address);
    const systemInfo = {
        serial_number, ip, mac_address
    };

    jwt.sign({
        systemInfo
    },
    app_constants.SECRET,
        {
            expiresIn: app_constants.EXPIRES_IN
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

}

exports.linkDevice = async function (req, resp) {

    var reslt = verifyToken(req, resp);
    if (reslt.status == true) {
        let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address, type, version } = device_helpers.getDeviceInfo(req);
        // console.log("serial no", serial_number);
        // console.log("mac address", mac_address);
        console.log(type, version);
        if (!empty(serial_number) && !empty(mac_address)) {
            var dId = req.body.dId;
            var connected_dealer = (req.body.connected_dealer === undefined || req.body.connected_dealer === null) ? 0 : req.body.connected_dealer;
            var dealerQ = "select * from dealers where dealer_id = '" + dId + "'";
            let dealer = await sql.query(dealerQ);
            // console.log("dealer query", dealer)
            // res2 = dealer
            if (dealer.length) {
                var deviceId = await helpers.getDeviceId(serial_number, mac_address);
                //deviceId = await helpers.checkDeviceId(deviceId, serial_number, mac_address);


                var deviceCheckQuery = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND devices.device_id = '${deviceId}' ORDER BY devices.id DESC`;
                let deviceCheckResponse = await sql.query(deviceCheckQuery);
                if (deviceCheckResponse.length) {
                    if (deviceCheckResponse[0].unlink_status == 1) {
                        if (deviceCheckResponse[0].dealer_id == dId) {
                            let currentDate = moment(new Date()).format("YYYY/MM/DD")
                            if (deviceCheckResponse[0].expiry_date > currentDate) {
                                var sql1 = `UPDATE  usr_acc SET unlink_status = 0, device_status = 1 where device_id=${deviceCheckResponse[0].usr_device_id}`;
                                await sql.query(sql1)
                                resp.send({
                                    status: true,
                                    device_id: deviceId,
                                    msg: "Device Linked.",
                                    dealer_pin: dealer[0].link_code
                                });
                                return
                            } else {
                                var deleteSql1 = `DELETE FROM usr_acc where device_id=${deviceCheckResponse[0].usr_device_id}`;
                                await sql.query(deleteSql1)
                                var sqlDevice = "DELETE from devices where device_id = '" + deviceId + "'";
                                await sql.query(sqlDevice);
                            }
                        } else {
                            var deleteSql1 = `DELETE FROM usr_acc where device_id=${deviceCheckResponse[0].usr_device_id}`;
                            await sql.query(deleteSql1)
                            var sqlDevice = "DELETE from devices where device_id = '" + deviceId + "'";
                            await sql.query(sqlDevice);

                        }
                    } else {
                        console.log('Some thing bad happend. user should not be here. Device already exist.', deviceId);
                        resp.send({
                            status: false,
                            msg: "Devices already exist."
                        });
                        return
                    }
                }


                var lastLinkAttemptQ = `SELECT * FROM acc_action_history 
                    WHERE action = '${Constants.DEVICE_PENDING_ACTIVATION}' AND device_id = '${deviceId}' 
                    ORDER BY id DESC LIMIT 1`;
                let lastLinkAttempt = await sql.query(lastLinkAttemptQ);
                if (lastLinkAttempt.length) {
                    let createdDateTime = new Date(lastLinkAttempt[0].created_at);
                    let dateNow = new Date();
                    let difference_ms = dateNow.getTime() - createdDateTime.getTime();
                    //Get 1 hour in milliseconds
                    let one_hour = 1000 * 60 * 60;
                    let elapsed_hours = difference_ms / one_hour;
                    if (elapsed_hours >= 1) {
                        sendEmail("New Device Request", "You have a new device request", dealer[0].dealer_email, function (error, response) {
                            if (error) console.log(error);
                        });
                    }
                }


                let insertDevice = "INSERT INTO devices (device_id, imei, imei2, ip_address, simno, simno2, serial_number, mac_address, online) values(?,?,?,?,?,?,?,?,?)";
                sql.query(insertDevice, [deviceId, imei1, imei2, ip, simNo1, simNo2, serial_number, mac_address, Constants.DEVICE_OFFLINE], function (error, deviceRes) {
                    // console.log("Insert Query" , insertDevice, [deviceId, imei1, imei2, ip, simNo1, simNo2, serial_number, mac_address, 'On']);
                    if (error) {
                        //throw Error(error);
                        console.log(error);
                        resp.send({
                            status: false,
                            msg: error
                        });
                        return false;
                    }
                    let dvc_id = deviceRes.insertId;
                    let insertUserAcc = "";
                    let values;
                    // console.log("dealer", dealer[0].dealer_id);
                    if (connected_dealer !== 0) {

                        insertUserAcc = "INSERT INTO usr_acc (device_id, dealer_id, link_code, prnt_dlr_id,type,version) values(?,?,?,?,?,?)";
                        values = [dvc_id, dealer[0].dealer_id, dealer[0].link_code, connected_dealer, type, version];
                    } else {
                        insertUserAcc = "INSERT INTO usr_acc (device_id, dealer_id, link_code,type,version) values(?,?,?,?,?,?)";
                        values = [dvc_id, dealer[0].dealer_id, dealer[0].link_code, type, version];
                    }

                    sql.query(insertUserAcc, values, async function (error, rows) {
                        if (error) throw error;
                        // console.log();
                        let record = await helpers.getAllRecordbyDeviceId(deviceId);
                        // console.log("dasdsd", record);
                        device_helpers.saveActionHistory(record, Constants.DEVICE_PENDING_ACTIVATION)
                        device_helpers.saveImeiHistory(deviceId, serial_number, mac_address, imei1, imei2)
                        resp.send({
                            status: true,
                            device_id: deviceId,
                            msg: "Device Linked.",
                            dealer_pin: dealer[0].link_code

                        });
                        return
                    });

                });

            } else {
                resp.send({
                    status: false,
                    msg: "dealer not found"
                });
                return
            }
        } else {
            resp.send({
                status: false,
                msg: "information not provided"
            })
            return
        }
    }
}

exports.getStatus = async function (req, resp) {
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

                            // deviceStatus varible not use at that function so i (abaid) comment it
                            // let deviceStatus = device_helpers.checkStatus(userAcc); 
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

                            // deviceStatus varible not use at that function so i (abaid) comment it
                            // let deviceStatus = device_helpers.checkStatus(userAcc);
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

                        // deviceStatus varible not use at that function so i (abaid) comment it
                        // let deviceStatus = device_helpers.checkStatus(userAcc);
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
}

exports.deviceStatus = async function (req, res) {
    var serial_number = req.body.serial_no;
    var mac = req.body.mac_address;
    var dealer_pin = req.body.dealer_pin
    var data;
    console.log('serial number: ', serial_number);
    console.log('mac address: ', mac);

    if (empty(serial_number) && empty(mac)) {
        data = {
            status: false,
            msg: "Information not provided"
        }
        res.send(data);
        return
    }
    else if (serial_number === Constants.PRE_DEFINED_SERIAL_NUMBER && mac === Constants.PRE_DEFINED_MAC_ADDRESS) {
        data = {
            status: false,
            msg: Constants.DUPLICATE_MAC_AND_SERIAL
        }
        res.send(data);
        return
    }
    else if (mac == Constants.PRE_DEFINED_MAC_ADDRESS) {
        var deviceQ = "SELECT * FROM devices WHERE  serial_number= '" + serial_number + "' ";
        var device = await sql.query(deviceQ);
        if (device.length) {
            var user_acc = await sql.query("SELECT * FROM usr_acc where device_id = " + device[0].id);
            if (user_acc.length > 0) {

                // get user account device status
                user_acc[0]["flagged"] = device[0].flagged;
                let deviceStatus = device_helpers.checkStatus(user_acc[0]);
                console.log("device_status", deviceStatus);

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
                        }, app_constants.SECRET, {
                            expiresIn: app_constants.EXPIRES_IN
                        }, (err, token) => {

                            if (err) {
                                res.json({
                                    'err': err
                                });
                                return;
                            }
                            if (deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
                                var d = new Date(user_acc[0].expiry_date);
                                var n = d.valueOf()
                                data = {
                                    status: true,
                                    msg: deviceStatus,
                                    device_id: device[0].device_id,
                                    expiry_date: n,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code
                                }
                                res.send(data);
                                return;
                            }
                            else if (deviceStatus === Constants.DEVICE_UNLINKED) {
                                var d = new Date(user_acc[0].expiry_date);
                                var n = d.valueOf()
                                data = {
                                    status: false,
                                    msg: deviceStatus,
                                    expiry_date: n,
                                    device_id: device[0].device_id,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code
                                }
                                res.send(data);
                                return;
                            }
                            else {

                                data = {
                                    status: true,
                                    msg: deviceStatus,
                                    device_id: device[0].device_id,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code
                                }
                                res.send(data);
                                return;
                            }
                        });
                    }
                    else {
                        data = {
                            status: false,
                            msg: Constants.DEALER_NOT_FOUND,
                            device_id: device[0].device_id,
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
                    }, app_constants.SECRET, {
                        expiresIn: app_constants.EXPIRES_IN
                    }, (err, token) => {

                        if (err) {
                            res.json({
                                'err': err
                            });
                            return;
                        }
                        //when devcie have no dealer id 
                        if (deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
                            var d = new Date(user_acc[0].expiry_date);
                            var n = d.valueOf()
                            data = {
                                status: true,
                                msg: deviceStatus,
                                device_id: device[0].device_id,
                                expiry_date: n,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }
                        else if (deviceStatus === Constants.DEVICE_UNLINKED) {
                            var d = new Date(user_acc[0].expiry_date);
                            var n = d.valueOf()
                            data = {
                                status: false,
                                msg: deviceStatus,
                                expiry_date: n,
                                device_id: device[0].device_id,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }
                        else {
                            data = {
                                status: true,
                                msg: deviceStatus,
                                device_id: device[0].device_id,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }
                    });


                }
            } else {
                data = {
                    status: false,
                    msg: Constants.NEW_DEVICE,
                }
                return res.send(data);
            }
        }
        else {
            data = {
                status: false,
                msg: Constants.NEW_DEVICE,
            }
            return res.send(data);
        }
    }
    else if (serial_number == Constants.PRE_DEFINED_SERIAL_NUMBER) {
        var deviceQ = "SELECT * FROM devices WHERE  mac_address= '" + mac + "' ";
        var device = await sql.query(deviceQ);
        if (device.length) {
            var user_acc = await sql.query("SELECT * FROM usr_acc where device_id = " + device[0].id);
            if (user_acc.length > 0) {

                // console.log('user_acc[0] ', user_acc[0].transfer_status, user_acc[0].status)
                // get user account device status
                user_acc[0]["flagged"] = device[0].flagged;
                let deviceStatus = device_helpers.checkStatus(user_acc[0]);
                console.log("device_status", deviceStatus);

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
                        console.log("predefined serial: ", dvc);

                        jwt.sign({
                            dvc
                        }, app_constants.SECRET, {
                            expiresIn: app_constants.EXPIRES_IN
                        }, (err, token) => {

                            if (err) {
                                res.json({
                                    'err': err
                                });
                                return;
                            }
                            if (deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
                                var d = new Date(user_acc[0].expiry_date);
                                var n = d.valueOf()
                                data = {
                                    status: true,
                                    msg: deviceStatus,
                                    device_id: device[0].device_id,
                                    expiry_date: n,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code,
                                }
                                res.send(data);
                                return;
                            }
                            else if (deviceStatus === Constants.DEVICE_UNLINKED) {
                                var d = new Date(user_acc[0].expiry_date);
                                var n = d.valueOf()
                                data = {
                                    status: false,
                                    msg: deviceStatus,
                                    expiry_date: n,
                                    device_id: device[0].device_id,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code
                                }
                                res.send(data);
                                return;
                            }
                            else {
                                data = {
                                    status: true,
                                    msg: deviceStatus,
                                    device_id: device[0].device_id,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code,
                                }
                                res.send(data);
                                return;
                            }
                        });
                    }
                    else {
                        data = {
                            status: false,
                            msg: Constants.DEALER_NOT_FOUND,
                            device_id: device[0].device_id,
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
                    }, app_constants.SECRET, {
                        expiresIn: app_constants.EXPIRES_IN
                    }, (err, token) => {

                        if (err) {
                            res.json({
                                'err': err
                            });
                            return;
                        }
                        //when devcie have no dealer id 
                        if (deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
                            var d = new Date(user_acc[0].expiry_date);
                            var n = d.valueOf()
                            data = {
                                status: true,
                                msg: deviceStatus,
                                device_id: device[0].device_id,
                                expiry_date: n,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }
                        else if (deviceStatus === Constants.DEVICE_UNLINKED) {
                            var d = new Date(user_acc[0].expiry_date);
                            var n = d.valueOf()
                            data = {
                                status: false,
                                msg: deviceStatus,
                                expiry_date: n,
                                device_id: device[0].device_id,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }

                        else {
                            data = {
                                status: true,
                                msg: deviceStatus,
                                device_id: device[0].device_id,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }
                    });


                }
            } else {

                data = {
                    status: false,
                    msg: Constants.NEW_DEVICE,
                }
                res.send(data);
            }
        }
        else {
            data = {
                status: false,
                msg: Constants.NEW_DEVICE,
            }
            res.send(data);
            return
        }
    }
    else {
        var deviceQuery = "select * from devices where mac_address = '" + mac + "' AND serial_number = '" + serial_number + "'";

        var device = await sql.query(deviceQuery);

        if (device.length > 0) {
            var user_acc = await sql.query("SELECT * FROM usr_acc where device_id = " + device[0].id);
            if (user_acc.length > 0) {
                console.log('user_acc[0] ', user_acc[0].transfer_status, user_acc[0].status)
                // get user account device status
                console.log('status is: ', device[0].device_id)

                user_acc[0]["flagged"] = device[0].flagged;
                let deviceStatus = device_helpers.checkStatus(user_acc[0]);
                console.log("device_status", deviceStatus);

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
                        }, app_constants.SECRET, {
                            expiresIn: app_constants.EXPIRES_IN
                        }, (err, token) => {

                            if (err) {
                                res.json({
                                    'err': err
                                });
                                return;
                            }
                            if (deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
                                var d = new Date(user_acc[0].expiry_date);
                                var n = d.valueOf()
                                data = {
                                    status: true,
                                    msg: deviceStatus,
                                    device_id: device[0].device_id,
                                    expiry_date: n,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code
                                }
                                res.send(data);
                                return;
                            }
                            else if (deviceStatus === Constants.DEVICE_UNLINKED) {
                                var d = new Date(user_acc[0].expiry_date);
                                var n = d.valueOf()
                                data = {
                                    status: false,
                                    msg: deviceStatus,
                                    expiry_date: n,
                                    device_id: device[0].device_id,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code
                                }
                                res.send(data);
                                return;
                            }
                            else {

                                data = {
                                    status: true,
                                    msg: deviceStatus,
                                    device_id: device[0].device_id,
                                    token: token,
                                    dealer_pin: user_acc[0].link_code
                                }
                                res.send(data);
                                return;
                            }
                        });
                    }
                    else {
                        data = {
                            status: false,
                            msg: Constants.DEALER_NOT_FOUND,
                            device_id: device[0].device_id,
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
                    }, app_constants.SECRET, {
                        expiresIn: app_constants.EXPIRES_IN
                    }, (err, token) => {

                        if (err) {
                            res.json({
                                'err': err
                            });
                            return;
                        }
                        //when devcie have no dealer id 
                        if (deviceStatus === Constants.DEVICE_ACTIVATED || deviceStatus === Constants.DEVICE_TRIAL || deviceStatus === Constants.DEVICE_SUSPENDED || deviceStatus === Constants.DEVICE_EXPIRED) {
                            var d = new Date(user_acc[0].expiry_date);
                            var n = d.valueOf()
                            data = {
                                status: true,
                                msg: deviceStatus,
                                device_id: device[0].device_id,
                                expiry_date: n,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }
                        else if (deviceStatus === Constants.DEVICE_UNLINKED) {
                            var d = new Date(user_acc[0].expiry_date);
                            var n = d.valueOf()
                            data = {
                                status: false,
                                msg: deviceStatus,
                                expiry_date: n,
                                device_id: device[0].device_id,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }


                        else {
                            data = {
                                status: true,
                                msg: deviceStatus,
                                device_id: device[0].device_id,
                                token: token,
                                dealer_pin: user_acc[0].link_code
                            }
                            res.send(data);
                            return;
                        }
                    });


                }
            } else {
                console.log(Constants.NEW_DEVICE);
                data = {
                    status: false,
                    msg: Constants.NEW_DEVICE,
                }
                res.send(data);
            }
        }
        else {
            var deviceQuery = "select * from devices where mac_address = '" + mac + "' OR serial_number = '" + serial_number + "'";
            // 
            var device = await sql.query(deviceQuery);

            if (device.length > 0) {

                if (mac === device[0].mac_address) {
                    data = {
                        status: false,
                        msg: Constants.DUPLICATE_MAC,
                        device_id: device[0].device_id
                    }
                    res.send(data);
                    return
                } else {
                    data = {
                        status: false,
                        msg: Constants.DUPLICATE_SERIAL,
                        device_id: device[0].device_id
                    }
                    res.send(data);
                    return
                }
            } else {
                data = {
                    status: false,
                    msg: Constants.NEW_DEVICE,
                }
                res.send(data);
                return

                // }

            }
        }
    }
}

exports.stopLinking = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var reslt = verifyToken(req, res);
    //console.log(req);
    let mac_address = req.params.macAddr;
    let serial_number = req.params.serialNo;
    // console.log("mac_address", mac_address);
    // console.log("serialNo", serial_number);
    if (reslt.status == true) {
        if (!empty(mac_address) && !empty(serial_number)) {
            let deviceQ = "SELECT id ,device_id FROM devices WHERE mac_address='" + mac_address + "' AND serial_number='" + serial_number + "'";
            sql.query(deviceQ, async function (error, resp) {
                if (error) throw (error);
                if (resp.length) {
                    let device_record = await helpers.getAllRecordbyDeviceId(resp[0].device_id)
                    // console.log(device_record);
                    device_helpers.saveActionHistory(device_record, Constants.DEVICE_UNLINKED)
                    var query = "DELETE from usr_acc WHERE device_id = " + resp[0].id;
                    console.log(query);
                    await sql.query(query);
                    var sqlDevice = "DELETE from devices where device_id = '" + resp[0].device_id + "'";
                    sql.query(sqlDevice);
                    console.log(sqlDevice);
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
}

exports.installAppList = async function (req, res) {
    sql.query("select * from apk_details where status='On' and delete_status='0'", function (err, rows) {

        if (err) throw err;

        var data = [];
        if (rows.length > 0) {

            for (var i = 0; i < rows.length; i++) {

                dta = {
                    "apk_name": rows[i].app_name,
                    "logo": rows[i].logo,
                    "apk": rows[i].apk,
                    "apk_status": rows[i].status,
                    "package_name": rows[i].package_name,
                    "apk_size": rows[i].apk_size,
                    "version_code": rows[i].version_code,
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
}

exports.checkForUpdate = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let verify = await verifyToken(req, res);
    if (verify.status === true) {
        // console.log(verify.status);
        let version = req.params.version;
        let packageName = req.params.packageName;
        let label = req.params.label;
        let apk_url = null;
        let getUpdateQ = "SELECT * FROM apk_details WHERE package_name = '" + packageName + "' AND label = '" + label + "' AND delete_status=0";
        let updateApks = await sql.query(getUpdateQ);

        if (updateApks.length) {
            for (let i = 0; i < updateApks.length; i++) {
                if (Number(updateApks[i].version_code) > Number(version)) {
                    apk_url = updateApks[i].apk;
                    break;
                }
            }
            if (apk_url) {
                res.send({
                    apk_status: true,
                    success: true,
                    apk_url: apk_url
                });
            } else {
                res.send({
                    apk_status: false,
                    success: true,
                    msg: ""
                });
            }
            return;
        } else {
            res.send({
                apk_status: false,
                success: true,
                msg: ""
            });
            return;
        }
    }

}

exports.getUpdate = async (req, res) => {
    // let verify = await verifyToken(req, res);
    // if (verify.status) {
    if (fs.existsSync(path.join(__dirname, "../../uploads/" + req.params.apk + '.apk'))) {
        let file = path.join(__dirname, "../../uploads/" + req.params.apk + '.apk');
        let fileMimeType = mime.getType(file);
        let filetypes = /jpeg|jpg|apk|png/;
        // Do something
        // if (filetypes.test(fileMimeType)) {
        return res.sendFile(file);
        // } else {
        //     return res.send({
        //         status: false,
        //         msg: "file not found", // file not found"
        //     })
        // }
    } else {
        return res.send({
            status: false,
            msg: "file not found"
        })
    }
    // }
}

exports.IMEIChanged = async function (req, res) {
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
}

exports.adminSMAppList = async function (req, res) {
    let data = [];
    sql.query("SELECT apk_details.*, secure_market_apps.is_restrict_uninstall FROM apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id WHERE apk_details.delete_status = 0 AND secure_market_apps.dealer_type = 'admin'", function (err, results) {
        if (err) {
            console.log(err);
        };
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
                    version_code: results[i].version_code
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
            return res.send(data);
        }
    })
}

exports.SMAppList = async function (req, res) {
    let data = [];

    let dealer_id = await helpers.getDealerIDByLinkOrActivation(req.params.linkCode)

    if (dealer_id) {
        sql.query("SELECT apk_details.*, secure_market_apps.is_restrict_uninstall from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id WHERE apk_details.delete_status = 0 AND (secure_market_apps.dealer_id = '" + dealer_id + "' OR dealer_type = 'admin')", function (err, results) {
            if (err) {
                console.log(err);
            };
            
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
                        version_code: results[i].version_code
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
                return res.send(data);
            }
        })
    } else {
        data = {
            status: false,
            msg: "No result found"
        }
        return res.send(data);
    }
}