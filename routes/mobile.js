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
                return res.json({ success: false, message: 'TOKEN_INVALID' });
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
    console.log("linkcode: " + linkCode);
    console.log("macaddress: " + mac_address);
    var data;
    //console.log(linkCode);
    if (linkCode != undefined && linkCode != null) {

        var sql1 = "SELECT * FROM dealers WHERE link_code = '" + linkCode + "'";
        var res = await sql.query(sql1);
        if (res.length == 0) {
            data = {
                'status': false,
                'msg': 'Invalid link code'
            }
            resp.status(200).send(data);
        } else {
            if (res[0].unlink_status == 1 || res[0].account_status == 'suspended') {
                data = {
                    'status': false,
                    'msg': 'Dealer SUSPENDED Contact ADMIN'
                }
                resp.status(200).send(data);

            } else {

                const user = {
                    'dId': res[0].dealer_id,
                    'connected_dealer': res[0].connected_dealer,
                    'type': await helpers.getUserTypeByTypeId(res[0].type)
                }

                jwt.sign({ user }, config.secret, { expiresIn: '86400s' }, (err, token) => {
                    if (err) {
                        resp.json({
                            'err': err
                        });
                    } else {
                        console.log(user);

                        resp.json({
                            token: token,
                            'status': true,
                            'data': user,
                            'expiresIn': "1539763907"
                        });
                    }
                });
            }
        }
    } else if (mac_address != undefined && mac_address != null) {

        var sql1 = "SELECT * FROM devices WHERE mac_address = '" + mac_address + "'";
        var res = await sql.query(sql1);
        console.log(res);
        if (res.length == 0) {
            data = {
                'status': false,
                'msg': 'Invalid Device'
            }
            resp.status(200).send(data);
        } else {
            if (res[0].unlink_status == 1) {
                data = {
                    'status': false,
                    'msg': 'unlinked'
                }
                // resp.status(200).send(data);

            } else if (res[0].status == 'expired') {
                data = {
                    'status': false,
                    'msg': 'expired'
                }
                // resp.status(200).send(data);
            } else if (res[0].account_status == "suspended") {
                data = {
                    'status': false,
                    'msg': 'suspended'
                }
                // resp.status(200).send(data);
            } else {

                data = {
                    'status': true,
                    'msg': 'success'
                }

            }

            const user = {
                'dId': res[0].dealer_id,
                'device_id': res[0].device_id,
                data
            }

            jwt.sign({ user }, config.secret, { expiresIn: '86400s' }, (err, token) => {
                if (err) {
                    resp.json({
                        'err': err
                    });
                } else {
                    try {
                        console.log({
                            token: token,
                            'status': data.status,
                            'msg': data.msg,
                            'dId': user.dId,
                            'device_id': user.device_id,
                            'expiresIn': "1539763907"
                        });
                        resp.json({
                            token: token,
                            'status': data.status,
                            'msg': data.msg,
                            'dId': user.dId,
                            'device_id': user.device_id,
                            'expiresIn': "1539763907"
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        }

    } else {
        data = {
            'status': false,
            'msg': 'Device not linked'
        }
        resp.status(200).send(data);
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

/** Link Device MDM **/
router.post('/linkdevice', async function (req, resp) {
    //res.setHeader('Content-Type', 'application/json');

    var reslt = verifyToken(req, resp);

    var dId = req.body.dId;
    var connected_dealer = req.body.connected_dealer;
    // var deviceId = uniqid.process();
    var imei = req.body.imei;
    var ip = req.body.ip;
    var simNo = req.body.simNo;
    var serial_number = req.body.serialNo;
    var mac_address = req.body.macAddr;

    var device_id = helpers.getDeviceId();

    var deviceId = await checkDeviceId(device_id);

    if (reslt.status == true) {
        var sql1 = "SELECT * FROM devices WHERE  mac_address='" + mac_address + "'";
        var res = await sql.query(sql1);

        if (res.length != 0) {
            // console.log('yes');
            if (res[0].unlink_status == 1) {
                var sql1 = "update devices set dealer_id = '" + dId + "',ip_address = '" + ip + "',simNo = '" + simNo + "',online = 'On',unlink_status = 0 where mac_address = '" + mac_address + "'";

                sql.query(sql1, function (error, rows) {
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

        } else {
            if (connected_dealer != 0) {
                sql.query('INSERT INTO devices (dealer_id,connected_dealer,device_id,imei,ip_address,simNo,serial_number,mac_address,online) values(?,?,?,?,?,?,?,?,?)', [dId, connected_dealer, deviceId, imei, ip, simNo, serial_number, mac_address, 'On'], function (error, rows) {
                    //response.end(JSON.stringify(rows));
                    if (error) throw error;

                    resp.json({
                        "status": true,
                        "data": rows

                    });

                });
            } else {
                sql.query('INSERT INTO devices (dealer_id,device_id,imei,ip_address,simNo,serial_number,mac_address,online) values(?,?,?,?,?,?,?,?)', [dId, deviceId, imei, ip, simNo, serial_number, mac_address, 'On'], function (error, rows) {
                    //response.end(JSON.stringify(rows));
                    if (error) throw error;

                    resp.json({
                        "status": true,
                        "data": rows

                    });

                });
            }

        }
    }
});

/** Device status (Added Device or not) api  MDM **/
router.post('/getstatus', async function (req, resp) {
    var imei = req.body.imei;
    var mac = req.body.mac;
    var reslt = verifyToken(req, resp);

    if (reslt.status == true) {
        var sql1 = "SELECT * FROM devices WHERE  mac_address= '" + mac + "'";
        //console.log(sql1);

        var res = await sql.query(sql1);

        //console.log(res[0].device_status);
        if (res.length > 0) {
            if (res[0].device_status == 0) {
                if (res[0].unlink_status == 1) {
                    data = {
                        "status": -1,
                        "msg": "Device Unlinked.",
                        "dealer_id": res[0].dealer_id,
                        "device_id": res[0].device_id
                    };
                } else {
                    data = {
                        "status": 0,
                        "msg": "Processing.",
                        "dealer_id": res[0].dealer_id,
                        "device_id": res[0].device_id
                    };

                }

                resp.send(data);

            } else {

                if (res[0].expiry_date == null || res[0].expiry_date == '') {
                    data = {
                        "status": 1,
                        "msg": "Device activated.",
                        "dealer_id": res[0].dealer_id,
                        "expiry_date": '',
                        "device_id": res[0].device_id

                    };
                    resp.send(data);
                } else {
                    data = {
                        "status": 1,
                        "msg": "Device activated.",
                        "dealer_id": res[0].dealer_id,
                        "expiry_date": res[0].expiry_date,
                        "device_id": res[0].device_id
                    };
                    resp.send(data);
                }

            }
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
    if (!empty(req.params.mac)) {
        if (reslt.status == true) {
            var query = "UPDATE `devices` SET unlink_status=1, dealer_id=0 WHERE `imei` = '" + req.params.mac + "'";

            await sql.query(query);
            data = {
                "status": true,
                "msg": "Device Unlinked successfully"
            };
            res.send(data);

        }
    } else {
        data = {
            "status": false,
            "msg": "Invalid device"
        };
        res.send(data);
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

    var sql1 = "select expiry_date,status,device_status from devices where mac_address = '" + mac + "'";
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
            return res.json({ success: true, list: data });

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

    res.sendFile(path.join(__dirname, "../uploads/" + req.params.apk + '.apk'));
});

/** New API MDM Client App (11th.Oct.2018) **/

/** Get status of device (active,expired,inactive) **/
router.post('/accountstatus', async function (req, res) {
    var imei = req.body.imei;
    var mac = req.body.mac;
    var data;
    console.log('imei : ' + imei);
    console.log('mac : ' + mac);

    if (empty(imei) || empty(mac)) {
        data = {
            "status": false,
        }
        res.send(data);
    } else {
        var sqls1 = "select * from devices where mac_address = '" + mac + "'";
        console.log(sqls1);
        var reslts = await sql.query(sqls1);
        console.log('length : ' + reslts.length);
        if (reslts.length > 0) {
            if (reslts[0].dealer_id != 0) {
                var sqls2 = "select * from dealers where dealer_id = '" + reslts[0].dealer_id + "'";
                var reslts2 = await sql.query(sqls2);

                if (reslts2[0].account_status == 'suspended') {
                    data = {
                        "status": false,
                        "msg": "Dealer Suspended.Contact Admin."
                    }
                    res.send(data);
                } else if (reslts2[0].unlink_status == 1) {
                    data = {
                        "status": false,
                        "msg": "Dealer Not found.Contact Admin."
                    }
                    res.send(data);
                } else {
                    if (reslts[0].device_status == 0 && (reslts[0].status == '' || reslts[0].status == null) && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
                        console.log('hello');
                        data = {
                            "status": true,
                            "msg": "pending"
                        }
                        res.send(data);
                        return;
                    }

                    if (reslts[0].status == 'active' && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
                        data = {
                            "status": true,
                            "msg": "account active"
                        }
                        res.send(data);

                    } else {
                        if (reslts[0].account_status == 'suspended') {
                            data = {
                                "status": false,
                                "msg": "account suspended"
                            }
                            res.send(data);
                        }

                        if (reslts[0].status == 'expired') {
                            data = {
                                "status": false,
                                "msg": "account expired"
                            }
                        }
                        res.send(data);
                    }

                }
            } else {
                if (reslts[0].device_status == 0 && (reslts[0].status == '' || reslts[0].status == null) && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
                    console.log('hello');
                    data = {
                        "status": true,
                        "msg": "pending"
                    }
                    res.send(data);
                    return;
                }

                if (reslts[0].status == 'active' && (reslts[0].account_status == '' || reslts[0].account_status == null)) {
                    data = {
                        "status": true,
                        "msg": "account active"
                    }
                    res.send(data);

                } else {
                    if (reslts[0].account_status == 'suspended') {
                        data = {
                            "status": false,
                            "msg": "account suspended"
                        }
                        res.send(data);
                    }
                    if (reslts[0].status == 'expired') {
                        data = {
                            "status": false,
                            "msg": "account expired"
                        }
                    }
                    res.send(data);
                }

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