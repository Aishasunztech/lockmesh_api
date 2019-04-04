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
            console.log(err);
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
    var mac_address = req.body.mac_address;
    var serial_number = req.body.serialNo
    var data;
    //console.log(linkCode);
    if (linkCode !== undefined && linkCode !== null) {
        if(linkCode.length <= 6){

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

                if (dealerStatus==="suspended") {
                    data = {
                        'status': false,
                        'msg': 'Dealer Suspended, Contact Admin'
                    }
                    resp.send(data);

                } else if (dealerStatus === "unlinked") {
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
                            console.log(device);

                            resp.json({
                                token: token,
                                'status': true,
                                'data': device,
                            });
                        }
                    });
                }
            }

        }else if(linkCode.length >= 7){
            var usrAccQ = "SELECT * FROM user_acc WHERE activation_code='" + linkCode + "'";
            var usrAcc = await sql.query(usrAccQ);
            if (usrAcc.length === 0){
                data = {
                    'status': false,
                    'msg': 'Invalid activation code'
                }
                resp.send(data);
            } else {
                var dealerQ = "SELECT * FROM dealers WHERE dealer_id = " + usrAcc[0].dealer_id ;
                var dealer = await sql.query(dealerQ);

                if (dealer[0].unlink_status == 1 || dealer[0].account_status == 'suspended') {
                    data = {
                        'status': false,
                        'msg': 'Dealer Suspended, Contact Admin'
                    }
                    resp.status(200).send(data);

                } else {

                    let {imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address} = getDeviceInfo(req);
                    console.log("this is info ", {imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address});
                    
                    
                    let expiry_date = helpers.getExpDateByMonth(new Date(),usrAcc[0].expiry_months);
                    var updateDevice = "UPDATE devices set  ip_address = '" + ip + "', simno = '" + simNo1 + "', online = 'On', imei='"+ imei1+"', imei2='"+imei2+"', serial_number='"+ serial_number +"', mac_address='"+ mac_address +"' , simno2 = '" + simNo2 + "' where id='"+ usrAcc[0].device_id +"'";                    
                    var updateAccount = "UPDATE usr_acc set activation_status=1, expiry_date='"+ expiry_date +"', device_status=1, unlink_status = 0 WHERE id = " + userAcc[0].id;
                    
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
                        expiresIn: '86400s'
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
            console.log("activation code");
        }
        
    } else if ((mac_address !== undefined && mac_address !== null) && (serial_number !== undefined && serial_number !== null)) {

        var deviceQ = "SELECT * FROM devices WHERE mac_address = '" + mac_address + "' OR serial_number='"+ serial_number +"'";
        var device = await sql.query(deviceQ);
        console.log("login with mac address", device);
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
            } else {

                data = {
                    'status': true,
                    'msg': 'success'
                }

            }

            const device = {
                'dId': usr_acc.dealer_id,
                'device_id': device[0].device_id,
                data
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
                    return;
                }
                
                var d = new Date(usr_acc.expiry_date);
                var n = d.valueOf()
                console.log("expire in", n);
                try {
                        
                    resp.json({
                        token: token,
                        'status': data.status,
                        'msg': data.msg,
                        'dId': device.dId,
                        'device_id': device.device_id,
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




async function checkDeviceId(device_id) {

    let query = "select device_id from devices where device_id = '" + device_id + "';"
    let result = await sql.query(query);
    if (result.length > 1) {
        device_id = helpers.getDeviceId();
        checkDeviceId(device_id);
    } else {
        return device_id;
    }
}

function getDeviceInfo(req){
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

    var reslt = verifyToken(req, resp);
    var dId = req.body.dId;
    var connected_dealer = (req.body.connected_dealer === undefined || req.body.connected_dealer === null)?0: req.body.connected_dealer;
    // var deviceId = uniqid.process();
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

    var device_id = helpers.getDeviceId();

    var deviceId = await checkDeviceId(device_id);

    if (reslt.status == true) {
        var deviceQ = "SELECT * FROM devices WHERE  mac_address='" + mac_address + "' OR serial_number='"+ serial_number +"'";
        var device = await sql.query(deviceQ);
        // res = device

        var dealerQ = "select * from dealers where dealer_id = " + dId;
        let dealer = await sql.query(dealerQ);
        // res2 = dealer
        // console.log("mysql ",res2[0].dealer_email);

        if (dealer.length) {

            sendEmail("New Device Request", "You have a new device request", dealer[0].dealer_email, function (error, response) {
                if (error) throw error;
            });
            // let dealerStatus = helpers.getDealerStatus(dealer[0]);

            if (device.length > 0) {
                // console.log('yes');
                let deviceStatus = device_helpers.checkStatus(device[0]);
                if(deviceStatus == "Unlinked"){

                    var user_acc = await sql.query("SELECT * FROM usr_acc WHERE device_id=" + device[0].id);
                    var link_acc = "";
                    var updateDviceQ = "UPDATE devices set ip_address = '" + ip + "', simno = '" + simNo1 + "', online = 'On' , simno2 = '" + simNo2 + "' where id=" + device[0].id;
                    // , unlink_status = 0
                    var updateDevice = await sql.query(updateDviceQ);

                    if(user_acc.length){

                        var link_acc = "update usr_acc set link_code='" + dealer[0].link_code + "', dealer_id = '" + dId + "', prnt_dlr_id="+ connected_dealer +", unlink_status = 0 where mac_address = '" + mac_address + "'";

                    } else {
                        var link_acc = "INSERT INTO user_acc  (device_id, link_code, dealer_id, prnt_dlr_id, unlink_status) value ("+ device.id +", " + dealer[0].link_code +", '" + dId + "',"+ connected_dealer +", 0) ";
                    }
                    
                    sql.query(link_acc, function (error, rows) {
                        //response.end(JSON.stringify(rows));
                        if (error) throw error;

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
                
                // if (device[0].unlink_status == 1) {
                // } else {
                // }


            } else {
                let insertDevice = "INSERT INTO devices (device_id, imei, imei2, ip_address, simno, simno2, serial_number, mac_address, online) values(?,?,?,?,?,?,?,?,?)";
                sql.query(insertDevice,[deviceId, imei1, imei2, ip, simNo1, simNo2, serial_number, mac_address, 'On' ], function(error, deviceRes){
                    if(error){
                        throw Error(error);
                    }
                    let dvc_id = deviceRes.insertId;
                    let insertUserAcc = "";
                    let values;
                    console.log("dealers", dealer[0].dealer_id);
                    if(connected_dealer!==0){

                        insertUserAcc = "INSERT INTO usr_acc (device_id, dealer_id, link_code, prnt_dlr_id) values(?,?,?,?)";
                        values = [dvc_id, dealer[0].dealer_id, dealer[0].link_code,connected_dealer];
                    } else {
                        insertUserAcc = "INSERT INTO usr_acc (device_id, dealer_id, link_code) values(?,?,?,?)";
                        values = [dvc_id, dealer[0].dealer_id, dealer[0].link_code];
                    }

                    sql.query(insertUserAcc, values, function (error, rows) {
                        if (error) throw error;

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
    var imei = req.body.imei;
    var mac = req.body.mac;
    var reslt = verifyToken(req, resp);

    if (reslt.status == true) {
        var deviceQ = "SELECT * FROM devices WHERE  mac_address= '" + mac + "' OR imei = '"+ imei+"'";
        //console.log(sql1);

        var device = await sql.query(deviceQ);
        // res
        //console.log(res[0].device_status);
        if (device.length > 0) {
            // let userAcc = await sql.query("SELECT * FROM usr_acc WHERE device_id="+ device[0].id);
            let userAcc = await device_helpers.getUserAccByDvcId(device[0].id);
            if(userAcc.length){
                let deviceStatus = device_helpers.checkStatus(userAcc[0]);
                if(deviceStatus === "Unlinked"){
                    data = {
                        "status": -1,
                        "msg": "Device Unlinked.",
                        "dealer_id": userAcc.dealer_id,
                        "device_id": device[0].device_id
                    };
                    resp.send(data);
                    return;
                } else if (userAcc.expiry_date == null || userAcc.expiry_date == '') {
                    data = {
                        "status": 1,
                        "msg": "Device activated.",
                        "dealer_id": userAcc.dealer_id,
                        "expiry_date": '',
                        "device_id": device[0].device_id,
                        // "chat_id": userAcc[0].chat_id,
                        // "pgp_email": res[0].pgp_email,
                        // "sim_id": res[0].sim_id
                    };
                    resp.send(data);
                } else {
                    data = {
                        "status": 1,
                        "msg": "Device activated.",
                        "dealer_id": userAcc.dealer_id,
                        "expiry_date": usrAcc.expiry_date,
                        "device_id": device[0].device_id,
                        // "chat_id": res[0].chat_id,
                        // "pgp_email": res[0].pgp_email,
                        // "sim_id": res[0].sim_id
                    };
                    resp.send(data);
                }
                
            }


            // if (res[0].device_status == 0) {
            //     if (res[0].unlink_status == 1) {
            //         data = {
            //             "status": -1,
            //             "msg": "Device Unlinked.",
            //             "dealer_id": res[0].dealer_id,
            //             "device_id": res[0].device_id
            //         };
            //     } else {
            //         data = {
            //             "status": 0,
            //             "msg": "Processing.",
            //             "dealer_id": res[0].dealer_id,
            //             "device_id": res[0].device_id
            //         };

            //     }

            //     resp.send(data);

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

router.delete('/unlink/:mac', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var reslt = verifyToken(req, res);
    //console.log(req);
    if (reslt.status == true) {
        if (!empty(req.params.mac)) {
            var query = "UPDATE `devices` SET unlink_status=1, dealer_id=0 WHERE `imei` = '" + req.params.mac + "'";

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
    var serial_number = req.body.serial_number;
    var mac = req.body.mac;
    var data;
    console.log('serial_number : ' + serial_number);
    console.log('mac : ' + mac);

    if (empty(serial_number) || empty(mac)) {
        data = {
            "status": false,
        }
        res.send(data);
    } else {
        var deviceQuery = "select * from devices where mac_address = '" + mac + "' OR serial_number = '"+ serial_number +"'";
        // 
        var device = await sql.query(deviceQuery);
        //reslts 
        if (device.length > 0) {
            var user_acc = await sql.query("SELECT * FROM usr_acc where device_id = " + device[0].id);
            if(user_acc.length > 0){
                
                // get user account device status
                let deviceStatus = device_helpers.checkStatus(user_acc[0]);

                if (user_acc[0].dealer_id !== 0 && user_acc.dealer_id !== null) {
                    
                    var dealerQuery = "select * from dealers where dealer_id = '" + user_acc[0].dealer_id + "'";
                    var dealer = await sql.query(dealerQuery);
                    // reslts2 
                    if(dealer.length > 0){
                        let dealerStatus = helpers.getDealerStatus(dealer[0]);
    
                        if (dealerStatus === 'suspended') {
                            data = {
                                "status": false,
                                "msg": "Dealer Suspended.Contact Admin."
                            }
                            res.send(data);
                            return;
                        } else if (dealerStatus == "unlinked") {
                            data = {
                                "status": false,
                                "msg": "Dealer Not found.Contact Admin."
                            }
                            res.send(data);
                            return;
                        } else {
        
                            // if (reslts[0].device_status == 0 && (reslts[0].status == '' || reslts[0].status == null) && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
                            
                            if (deviceStatus === "Pending activation"){
                                data = {
                                    "status": true,
                                    "msg": "pending"
                                }
                                res.send(data);
                                return;
                            } else if (deviceStatus === "Activated"){
                                data = {
                                    "status": true,
                                    "msg": "account active"
                                }
                                res.send(data);
                                return;
                            } else if (deviceStatus === "Suspended"){
                                data = {
                                    "status": false,
                                    "msg": "account suspended"
                                }
                                res.send(data);
                                return;
                            } else if (deviceStatus === "Expired"){
        
                                data = {
                                    "status": false,
                                    "msg": "account expired"
                                }
                                res.send(data);
                                return;
                            }
        
                            // if (user_acc[0].device_status == 0 && helpers.checkNullStatus(user_acc[0]) && helpers.checkNullUserAccountStatus(user_acc[0])) {
                            //     data = {
                            //         "status": true,
                            //         "msg": "pending"
                            //     }
                            //     res.send(data);
                            //     return;
                            // }else if (user_acc[0].status == 'active' && helpers.checkNullUserAccountStatus(user_acc[0])) {
                            //     data = {
                            //         "status": true,
                            //         "msg": "account active"
                            //     }
                            //     res.send(data);
                            //     return;
                            // } else if (user_acc[0].account_status == 'suspended') {
                            //     data = {
                            //         "status": false,
                            //         "msg": "account suspended"
                            //     }
                            //     res.send(data);
                            //     return;
                            // } else if (user_acc[0].status == 'expired') {
                            //     data = {
                            //         "status": false,
                            //         "msg": "account expired"
                            //     }
                            //     res.send(data);
                            //     return;
                            // }
                            
        
                        }
                    } else {
                        data = {
                            "status": false,
                            "msg": "Dealer Not found.Contact Admin."
                        }
                        res.send(data);
                        return;
                    }
                } else {

                    if (deviceStatus === "Pending activation"){
                        data = {
                            "status": true,
                            "msg": "pending"
                        }
                        res.send(data);
                        return;
                    } else if (deviceStatus === "Activated"){
                        data = {
                            "status": true,
                            "msg": "account active"
                        }
                        res.send(data);
                        return;
                    } else if (deviceStatus === "Suspended"){
                        data = {
                            "status": false,
                            "msg": "account suspended"
                        }
                        res.send(data);
                        return;
                    } else if (deviceStatus === "Expired"){

                        data = {
                            "status": false,
                            "msg": "account expired"
                        }
                        res.send(data);
                        return;
                    }

                    // if (reslts[0].device_status == 0 && (reslts[0].status == '' || reslts[0].status == null) && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
                    //     console.log('hello');
                    //     data = {
                    //         "status": true,
                    //         "msg": "pending"
                    //     }
                    //     res.send(data);
                    //     return;
                    // } else if (reslts[0].status == 'active' && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
                    //     data = {
                    //         "status": true,
                    //         "msg": "account active"
                    //     }
                    //     res.send(data);
    
                    // } else {
                    //     if (reslts[0].account_status == 'suspended') {
                    //         data = {
                    //             "status": false,
                    //             "msg": "account suspended"
                    //         }
                    //         res.send(data);
                    //     }
                    //     if (reslts[0].status == 'expired') {
                    //         data = {
                    //             "status": false,
                    //             "msg": "account expired"
                    //         }
                    //     }
                    //     res.send(data);
                    // }
    
                }
            } else {

            }    

        } else {
            data = {
                "status": true,
                "msg": "new device"
            }
            res.send(data);
        }
    }

});

module.exports = router;