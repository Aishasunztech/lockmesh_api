var express = require('express');
var router = express.Router();
var generator = require('generate-password');
var md5 = require('md5');
const sql = require('../helper/sql.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var empty = require('is-empty');
var datetime = require('node-datetime');
var cron = require('node-cron');
//var uniqid = require('uniqid');
var jwt = require('jsonwebtoken');
var randomize = require('randomatic');
var multer = require('multer');
var config = require('../helper/config.js');
var upload = multer({ dest: 'uploads/' });
const url = require('url');
var path = require('path');
var fs = require("fs");
// var CryptoJS = require("crypto-js");
// var io = require("../bin/www");

var helpers = require('../helper/general_helper.js');

const device_helpers = require('../helper/device_helpers.js');
/** SMTP Email **/
var smtpTransport = nodemailer.createTransport({
    host: "smtpout.asia.secureserver.net",
    secureConnection: true,
    port: 465,
    auth: {
        user: "sales@microsoft-techsupport.com",
        pass: "test@123"
    }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send({
        url: 'http://' + req.headers.host,
        md5_hash: md5('38:80:DF:12:6F:56' + '_' + '354107094690935').substring(0, 5),
    });
});


/*Check For Token in the header */
var verifyToken = function (req, res) {
    // check header or url parameters or post parameters for token
    var ath;
    var token = req.headers['authorization'];
    //console.log(token);

    if (token) {
        // token = CryptoJS.AES.decrypt(token.replace(/['"]+/g, ''), config.secret).toString();
        // console.log("middleware");
        // console.log(token);

        jwt.verify(token, config.secret, function (err, decoded) {
            console.log(err);
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
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
            message: 'No token provided.'
        });
    }
    return ath;
}


router.get('/test', async function (req, res) {
    var componentAllowed = await helpers.isAllowedComponent(1, 155);
    console.log(componentAllowed);
    res.send(componentAllowed);
});

/** check component**/
router.get('/check_component/:componentName', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    if (verify.status == true) {
        var componentName = req.params.componentName;
        var userId = verify.user.id;
        var result = await helpers.isAllowedComponentByName(componentName, userId);
        if (result == true) {
            res.send({
                componentAllowed: true
            });
        } else {
            res.send({
                componentAllowed: false
            });
        }

    } else {
        res.send({
            componentAllowed: false
        });
    }
});

/** is_admin **/

router.get('/check_admin', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    if (verify.status == true) {
        var userId = verify.user.id;
        var admin = await helpers.isAdmin(userId);

        res.send({
            isAdmin: admin
        })
    } else {
        res.send({
            isAdmin: false
        });
    }
})

/*** Add Dealer ***/
router.post('/add/dealer', async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);

    var dealerName = req.body.dealerName;
    var dealerEmail = req.body.dealerEmail;
    var type = await helpers.getDealerTypeIdByName(req.body.type);

    //console.log(dealerEmail);
    //var userName = req.body.userName;
    //var link_code = Math.floor(Math.random() * 900000) + 100000; 
    var link_code = randomize('0', 6);

    var dealer_pwd = generator.generate({
        length: 10,
        numbers: true
    });

    var enc_pwd = md5(dealer_pwd); //encryted pwd

    if (verify.status == true) {
        if (!empty(dealerEmail) && !empty(dealerName)) {
            var dealer = await sql.query("SELECT * FROM dealers WHERE dealer_email = '" + dealerEmail + "'");
            //console.log(user);
            console.log(dealer.length);
            if (dealer.length > 0) {
                data = {
                    'status': false,
                    'msg': 'Dealer Already Registered.Please use another email id.',
                }

                res.status(200).send(data);
            } else {
                var sql1 = "INSERT INTO dealers (dealer_name, dealer_email, password, link_code , type , modified, created)";
                sql1 += " values('" + dealerName + "','" + dealerEmail + "', '" + enc_pwd + "','" + link_code + "', '" + type + "', NOW(), NOW())";

                // console.log(sql2);

                sql.query(sql1, function (error, rows) {
                    //  if (error) throw error;

                    let mailOptions = {
                        from: "support <sales@microsoft-techsupport.com>",
                        to: dealerEmail,
                        subject: 'MDM Panel account registration',
                        html: 'Your login details are : <br> Username : ' + dealerEmail + '<br> Password : ' + dealer_pwd + '<br> dealer id : ' + rows.insertId + '<br> Dealer Pin : ' + link_code + '.<br> Below is the link to login : <br> http://www.lockmesh.com <br>',
                    };

                    smtpTransport.sendMail(mailOptions, function (errors, response) {
                        if (error) {
                            res.send("Email could not sent due to error: " + errors);
                        } else {
                            //res.send("Email has been sent successfully");
                            data = {
                                'status': true,
                                'msg': 'Dealer has been registered successfully',

                            }

                            res.status(200).send(data);
                        }

                    });

                });
            }
        } else {
            data = {
                'status': false,
                'msg': 'Invalid email or name'
            }
            res.status(200).send(data);
        }
    }
});

/*Get all dealers*/
router.get('/dealers', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        var role = await helpers.getDealerTypeIdByName('dealer');

        sql.query("select * from dealers where type=" + role + " order by created DESC", async function (error, results) {
            if (error) throw error;
            console.log(results.length);
            var data = [];
            for (var i = 0; i < results.length; i++) {
                var get_connected_devices = await sql.query("select count(*) as total from devices where dealer_id='" + results[i].dealer_id + "'");
                //console.log("select count(*) from devices where dealer_id='" + results[i].dealer_id + "'");

                dt = {
                    "status": true,
                    //"data": {
                    "dealer_id": results[i].dealer_id,
                    "dealer_name": results[i].dealer_name,
                    "dealer_email": results[i].dealer_email,
                    "link_code": results[i].link_code,
                    "account_status": results[i].account_status,
                    "unlink_status": results[i].unlink_status,
                    "created": results[i].created,
                    "modified": results[i].modified,
                    "connected_devices": get_connected_devices
                    //  }

                };
                data.push(dt);
            }
            res.send(data);
        });
    }
});

/* Dealer Login & sub dealer login */
router.post('/dlogin', async function (req, res) {

    var email = req.body.demail;
    var pwd = req.body.pwd;
    var type = req.body.type;
    var enc_pwd = md5(pwd);

    var sql1 = "SELECT * FROM dealers WHERE  dealer_email= '" + email + "' and password = '" + enc_pwd + "' and type = '" + type + "'";
    var users = await sql.query(sql1);
    if (users.length == 0) {
        data = {
            'status': false,
            'msg': 'Invalid email or password',
            'data': null
        }
        res.status(200).send(data);
        return;
    } else if (users[0].account_status == 'suspended') {
        data = {
            'status': false,
            'msg': 'Account Suspended.Please Contact Admin.',
            'data': null
        }
        res.status(200).send(data);
        return;
    } else if (users[0].unlink_status == 1) {
        data = {
            'status': false,
            'msg': 'Account Deleted.Please Contact Admin.',
            'data': null
        }
        res.status(200).send(data);
        return;
    } else {
        const user = {
            "dealer_id": users[0].dealer_id,
            "dealer_name": users[0].dealer_name,
            "dealer_email": users[0].dealer_email,
            "link_code": users[0].link_code,
            "connected_dealer": users[0].connected_dealer,
            "account_status": users[0].account_status,
            "created": users[0].created,
            "modified": users[0].modified
        }
        jwt.sign({ user }, config.secret, { expiresIn: '86400s' }, (err, token) => {
            if (err) {
                res.json({
                    'err': err
                });
            } else {
                res.json({
                    token: token,
                    'status': true,
                    'msg': 'User loged in Successfully',
                    'expiresIn': "1539763907",
                    user
                });
            }
        });
    }

});

/**GET all the devices**/
router.get('/devices', function (req, res) {
    var verify = verifyToken(req, res);
    var where_con = '';
    if (verify.user.user_type !== 'admin') {
        where_con = 'WHERE dvc.dealer_id = ' + verify.user.id + ' ';
    }
    if (verify.status == true) {
        sql.query('select dvc.* , dl.link_code , dl.dealer_name from devices as dvc left join dealers as dl on dvc.dealer_id = dl.dealer_id ' + where_con + ' order by dvc.id DESC', function (error, results, fields) {
            if (error) throw error;

            data = {
                "status": true,
                "data": results
            };
            res.send(data);
        });
    }
});

/**GET all the devices for particular dealer**/
router.get('/dealer/devices/:dealer_id', function (req, res) {

    var verify = verifyToken(req, res);
    if (verify.status == true) {
        sql.query('select dvc.* , dl.link_code , dl.dealer_name , dl.unlink_status as dl_unlink_status , dl.account_status as dl_account_status from devices as dvc left join dealers as dl on dvc.dealer_id = dl.dealer_id where dvc.dealer_id =' + req.params.dealer_id + ' order by dvc.id DESC', function (error, results, fields) {
            if (error) throw error;
            if (results.length == 0) {
                data = {
                    "status": false,
                    "msg": 'No devices linked'
                };
            } else {
                // if dealer suspended / deleted
                if (results[0].dl_account_status == 'suspended') {
                    data = {
                        "status": false,
                        "msg": 'Account suspended'
                    };

                } else if (results[0].dl_unlink_status == 1) {
                    data = {
                        "status": false,
                        "msg": 'Account deleted'
                    };

                } else {
                    data = {
                        "status": true,
                        "data": results
                    };

                }

            }
            res.send(data);
        });
    }
});

/***Add devices (not using) ***/
router.post('/new/devices', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);
    var link_code = Math.floor(Math.random() * 9000) + 1000;

    if (verify.status == true) {
        sql.query('INSERT INTO devices (name, client_id, model, link_code, imei, s_dealer, status, online, start_date, expiry_date, account) values(?,?,?,?,?,?,?,?,?,?,?)', [req.body.name, req.body.client_id, req.body.model, link_code, req.body.imei, req.body.s_dealer, req.body.status, req.body.online, req.body.start_date, req.body.expiry_date, req.body.account], function (error, rows) {
            //response.end(JSON.stringify(rows));
            if (error) throw error;
            data = {
                "status": true,
                "data": rows
            };

            res.send(data);
        });
    }
});

/**UPDATE Devices details**/
router.put('/edit/devices', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);
    let sim_id = (req.body.sim_id==undefined)? '': req.body.sim_id;
    if (verify.status == true) {
        if (!empty(req.body.device_id)) {
            var query1 = "select start_date from devices where device_id = '" + req.body.device_id + "'";
            //  console.log(query1);
            rslt1 = null;
            sql.query(query1, async function (error, rows) {
                if (req.body.s_dealer != '') {
                    var query1 = "select * from dealers where dealer_id = '" + req.body.s_dealer + "'";
                    console.log(query1);
                    rslt1 = await sql.query(query1);
                    console.log(rslt1);
                }

                if (req.body.expiry_date == '') {
                    var sttatus = 'expired';
                } else {
                    var sttatus = 'active';
                }

                if (rows[0].start_date == null || rows[0].start_date == '') {
                    //    console.log('start date not null');
                    if (rslt1 != null) {
                        if (rslt1.length > 0) {

                            sql1 = "UPDATE devices set name = '" + req.body.name + "' , email = '" + req.body.email + "' , sim_id='"+ sim_id +"', client_id ='" + req.body.client_id + "' , model = '" + req.body.model + "' , s_dealer_name = '" + rslt1[0].dealer_name + "' , s_dealer = '" + req.body.s_dealer + "' , status = '" + sttatus + "' , device_status = '1' ,  start_date = '" + req.body.start_date + "' ,expiry_date = '" + req.body.expiry_date + "' where device_id = '" + req.body.device_id + "'";
                        }
                    } else {
                        sql1 = "UPDATE devices set name = '" + req.body.name + "' , email = '" + req.body.email + "' , sim_id='"+ sim_id +"', client_id ='" + req.body.client_id + "' , model = '" + req.body.model + "' , status = '" + sttatus + "' , device_status = '1' ,  start_date = '" + req.body.start_date + "' ,expiry_date = '" + req.body.expiry_date + "' where device_id = '" + req.body.device_id + "'";
                    }

                    //console.log('empty');
                    console.log(sql1);
                    sql.query(sql1, function (error, row) {
                        data = {
                            "status": true,
                            "msg": 'Record updated successfully.',
                            "data": row
                        };
                        res.send(data);
                    });
                } else {
                    //   console.log('start date is null');
                    if (req.body.expiry_date != null || req.body.expiry_date != '') {

                        //  console.log('expire date not null');
                        if (rslt1 != null) {
                            if (rslt1.length > 0) {
                                var sql1 = "UPDATE devices set name = '" + req.body.name + "' , email = '" + req.body.email + "' , sim_id='"+ sim_id +"', client_id ='" + req.body.client_id + "' , model = '" + req.body.model + "' , s_dealer_name = '" + rslt1[0].dealer_name + "' , s_dealer = '" + req.body.s_dealer + "' , status = 'active' , device_status = '1' ,  start_date = '" + req.body.start_date + "' ,expiry_date = '" + req.body.expiry_date + "' where device_id = '" + req.body.device_id + "'";
                            }
                        } else {
                            var sql1 = "UPDATE devices set name = '" + req.body.name + "' , email = '" + req.body.email + "' , sim_id='"+ sim_id +"', client_id ='" + req.body.client_id + "' , model = '" + req.body.model + "' , status = 'active' , device_status = '1' ,  start_date = '" + req.body.start_date + "' ,expiry_date = '" + req.body.expiry_date + "' where device_id = '" + req.body.device_id + "'";
                        }

                        if (sql1 == undefined) {
                            sql1 = "UPDATE devices set name = '" + req.body.name + "' , email = '" + req.body.email + "' , sim_id='"+ sim_id +"', client_id ='" + req.body.client_id + "' , model = '" + req.body.model + "' ,expiry_date = '" + req.body.expiry_date + "' where device_id = '" + req.body.device_id + "'";
                        }
                        //  console.log('not empty');
                        console.log(sql1);

                        sql.query(sql1, function (error, row) {
                            data = {
                                "status": true,
                                "msg": 'Record updated successfully.',
                                "data": row
                            };
                            res.send(data);
                        });
                    } else {

                        //    console.log('expire date is null');
                        if (rslt1 != null) {
                            if (rslt1.length > 0) {
                                sql1 = "UPDATE devices set name = '" + req.body.name + "' , email = '" + req.body.email + "' , sim_id='"+ sim_id +"', client_id ='" + req.body.client_id + "' , model = '" + req.body.model + "' , s_dealer_name = '" + rslt1[0].dealer_name + "' , s_dealer = '" + req.body.s_dealer + "' , status = '" + sttatus + "' , device_status = '1' ,  start_date = '" + req.body.start_date + "' ,expiry_date = '" + req.body.expiry_date + "' where device_id = '" + req.body.device_id + "'";
                            }
                        } else {
                            sql1 = "UPDATE devices set name = '" + req.body.name + "' , email = '" + req.body.email + "' , sim_id='"+ sim_id +"', client_id ='" + req.body.client_id + "' , model = '" + req.body.model + "' , status = '" + sttatus + "' , device_status = '1' ,  start_date = '" + req.body.start_date + "' ,expiry_date = '" + req.body.expiry_date + "' where device_id = '" + req.body.device_id + "'";
                        }

                        //  console.log('not empty');
                        console.log(sql1);

                        sql.query(sql1, function (error, row) {
                            data = {
                                "status": true,
                                "msg": 'Record updated successfully.',
                                "data": row
                            };
                            res.send(data);
                        });
                    }
                }
            });
        }
    }
});

/**Devices record delete**/
router.delete('/delete/:device_id', function (req, res) {

    var verify = verifyToken(req, res);

    if (verify.status == true) {
        if (!empty(req.params.device_id)) {
            sql.query('DELETE FROM devices WHERE device_id ="' + [req.params.device_id] + '"', function (error, results, fields) {
                //response.end(JSON.stringify(rows));
                if (error) throw error;
                if (fields) {
                    data = {
                        "status": false,
                        "msg": "Device not deleted.",
                        "fld": fields,
                        "rdlt": results
                    };
                } else {
                    data = {
                        "status": true,
                        "msg": "Device deleted successfully.",

                    };
                }
                res.send(data);
            });
        }
    }
});


/***GET all the clients (not using) ***/
router.get('/clients', function (req, res) {
    console.log(req);
    sql.query('select * from clients', function (error, results, fields) {
        if (error) throw error;
        data = {
            "status": true,
            "data": results
        };
        res.send(data);
    });
});

/***Add client (not using)***/
router.post('/new/client', function (req, res) {
    console.log(req);
    sql.query('INSERT INTO clients (name, client_id, imei, s_dealer, start_date, expiry_date, online, status, model) values(?,?,?,?,?,?,?,?,?)', [req.body.name, req.body.client_id, req.body.imei, req.body.s_dealer, req.body.start_date, req.body.expiry_date, req.body.expiry_date, req.body.online, req.body.status, req.body.model], function (error, rows) {
        //response.end(JSON.stringify(rows));
        if (error) throw error;
        data = {
            "status": true,
            "data": rows
        };
        res.send(data);
    });
});

/**UPDATE Client details (not using) **/
router.put('/client/:client_id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log(req);
    sql.query('UPDATE clients SET `name` = ?, `imei` = ?, `s_dealer` = ? , `start_date` = ?, `expiry_date` = ?, `status` = ?, `model`= ? where `client_id` = ?', [req.body.name, req.body.imei, req.body.s_dealer, req.body.start_date, req.body.expiry_date, req.body.status, req.body.model, req.body.client_id], function (error, rows) {

        if (error) throw error;
        data = {
            "status": true,
            "data": rows
        };
        res.send(data);
    });
});

/**client record delete (not using) **/
router.delete('/client/:client_id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log(req);
    sql.query('DELETE FROM `clients` WHERE `client_id`=?', [req.params.client_id], function (error, results, fields) {

        if (error) throw error;
        data = {
            "status": true,
            "data": results
        };
        res.send(data);
    });
});

/** Unlink Device  **/
router.post('/unlink/:id', function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;

    if (verify.status == true) {
        if (!empty(device_id)) {
            var sql1 = "update devices set dealer_id = '', s_dealer = '' , status = '' , online = 'off' , device_status = 0 , start_date= '', expiry_date= '' , unlink_status=1 where device_id = '" + device_id + "'";

            console.log(sql1);
            var rest = sql.query(sql1, function (error, results) {
                if (error) throw error;
                console.log(results);
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Device not unlinked."
                    }
                } else {
                    data = {
                        "status": true,
                        "msg": "Device unlinked successfully."
                    }
                }
                res.send(data);
            });

        } else {
            data = {
                "status": false,
                "msg": "Invalid device id."
            }
        }
    }
});

/** Suspend Account Devices / client **/
router.post('/suspend/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');


    if (verify.status == true) {
        var sql2 = "select * from devices where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);


        if (!empty(device_id)) {
            if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null) {

                var sql1 = "update devices set account_status='suspended' where device_id = '" + device_id + "'";

                var rest = sql.query(sql1, function (error, results) {
                    if (error) throw error;
                    if (results.affectedRows == 0) {
                        data = {
                            "status": false,
                            "msg": "Account not suspended.Please try again."
                        }
                    } else {

                        data = {
                            "status": true,
                            "msg": "Account suspended successfully."
                        }

                    }
                    require("../bin/www").sendDeviceStatus(gtres[0].device_id, "suspended");
                    res.send(data);
                });

            } else {

                if (gtres[0].expiry_date >= formatted_dt) {

                    var sql1 = "update devices set account_status='suspended' where device_id = '" + device_id + "'";

                    var rest = sql.query(sql1, function (error, results) {
                        if (error) throw error;
                        if (results.affectedRows == 0) {
                            data = {
                                "status": false,
                                "msg": "Account not suspended.Please try again."
                            }
                        } else {

                            require("../bin/www").sendDeviceStatus(gtres[0].device_id, "suspended");

                            data = {
                                "status": true,
                                "msg": "Account suspended successfully."
                            }

                        }
                        res.send(data);
                    });

                } else {

                    data = {
                        "status": false,
                        "msg": "Can't suspend !!! Account Already Expired."
                    }
                    res.send(data);
                }
            }

        } else {
            data = {
                "status": false,
                "msg": "Invalid Device."
            }
            res.send(data);
        }
    }

});

/** Activate Device **/
router.post('/activate/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');

    if (verify.status == true) {
        var sql2 = "select * from devices where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        if (!empty(device_id)) {

            if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null) {

                var sql1 = "update devices set account_status='' where device_id = '" + device_id + "'";

                var rest = sql.query(sql1, function (error, results) {
                    if (error) throw error;
                    if (results.affectedRows == 0) {
                        data = {
                            "status": false,
                            "msg": "Device not activated.Please try again."
                        }
                    } else {
                        require("../bin/www").sendDeviceStatus(gtres[0].device_id, "active", true);
                        data = {
                            "status": true,
                            "msg": "Device activated successfully."
                        }

                    }
                    res.send(data);
                });

            } else {

                if (gtres[0].expiry_date > formatted_dt) {

                    var sql1 = "update devices set account_status='' where device_id = '" + device_id + "'";

                    var rest = sql.query(sql1, function (error, results) {
                        if (error) throw error;
                        if (results.affectedRows == 0) {
                            data = {
                                "status": false,
                                "msg": "Device not activated.Please try again."
                            }
                        } else {
                            require("../bin/www").sendDeviceStatus(gtres[0].device_id, "active", true);
                            data = {
                                "status": true,
                                "msg": "Device actvated successfully."
                            }

                        }
                        res.send(data);
                    });

                } else {

                    data = {
                        "status": false,
                        "msg": "Device cannnot be activated.It is expired already."
                    }
                    res.send(data);
                }
            }

        } else {
            data = {
                "status": false,
                "msg": "Invalid Device."
            }
            res.send(data);
        }
    }

});


/*****User Registration*****/
router.post('/Signup', async function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var upass = ' ';
    var data = '';

    //hash the password
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var upass = bcrypt.hashSync(req.body.upass, salt);

    var user = await sql.query("SELECT * FROM users WHERE email = '" + email + "'");

    console.log(user.length);
    if (user.length > 0) {
        data = {
            'status': false,
            'msg': 'User Already Registered.Please use another email id.',
            'data': {
                'userId': user[0].id
            }
        }

        res.status(200).send(data);
    } else {
        var sql2 = "INSERT INTO users (firstName, lastName, email, password, modified, created)";
        sql2 += " values('" + firstName + "','" + lastName + "', '" + email + "' ,'" + upass + "', NOW(), NOW())";

        var userInsrt = await sql.query(sql2);

        data = {
            'status': true,
            'msg': 'User has been registered successfully',
            'data': {
                'userId': userInsrt.insertId
            }
        }
        res.status(200).send(data);
    }

});

/*****User Login*****/

router.post('/Login', async function (req, res) {
    var email = req.body.demail;
    var pwd = req.body.pwd;
    var type = req.body.type;
    var enc_pwd = md5(pwd);
    var data = '';

    //check for if email is already registered
    var sql1 = "SELECT * FROM dealers WHERE dealer_email = '" + email + "' limit 1";

    var users = await sql.query(sql1);


    if (users.length == 0) {
        data = {
            'status': false,
            'msg': 'User is not Registered',
            'data': null
        }
        res.status(200).send(data);
    } else {

        var userTypeQuery = "SELECT * FROM user_roles WHERE id =" + users[0].type + " AND status='1'";
        var userType = await sql.query(userTypeQuery);
        if (userType.length == 0) {

            data = {
                'status': false,
                'msg': 'User is not Registered',
                'data': null
            }
            res.status(200).send(data);
        } else {

            if (userType[0].role == "admin") {

                if (bcrypt.compareSync(req.body.pwd, users[0].password)) {

                    const user = {
                        "id": users[0].dealer_id,
                        "name": users[0].dealer_name,
                        "firstName": users[0].first_name,
                        "lastName": users[0].last_name,
                        "email": users[0].dealer_email,
                        "user_type": userType[0].role,
                        "modified": users[0].modified,
                        "created": users[0].created
                    }

                    jwt.sign({ user }, config.secret, { expiresIn: '86400s' }, (err, token) => {
                        // token = CryptoJS.AES.encrypt(token, config.secret).toString();

                        if (err) {
                            res.json({
                                'err': err
                            });
                        } else {
                            res.json({
                                'status': true,
                                token: token,
                                'msg': 'User loged in Successfully',
                                'expiresIn': "1539763907",
                                user

                            });
                        }
                    });

                } else {
                    data = {
                        'status': false,
                        'msg': 'Wrong Password',
                        'data': null
                    }
                    res.status(200).send(data);
                }
            } else {
                var dUser = "SELECT * FROM dealers WHERE  dealer_email='" + email + "' and password ='" + enc_pwd + "';";

                var usr = await sql.query(dUser);

                if (usr.length) {
                    if (users[0].account_status == 'suspended') {
                        data = {
                            'status': false,
                            'msg': 'Account Suspended.Please Contact Admin.',
                            'data': null
                        }
                        res.status(200).send(data);
                        return;
                    } else if (users[0].unlink_status == 1) {
                        data = {
                            'status': false,
                            'msg': 'Account Deleted.Please Contact Admin.',
                            'data': null
                        }
                        res.status(200).send(data);
                        return;
                    } else {
                        var userType = await helpers.getUserType(users[0].dealer_id);
                        const user = {
                            "id": users[0].dealer_id,
                            "dealer_id": users[0].dealer_id,
                            "email": users[0].dealer_email,
                            "name": users[0].dealer_name,
                            "dealer_name": users[0].dealer_name,
                            "dealer_email": users[0].dealer_email,
                            "link_code": users[0].link_code,
                            "connected_dealer": users[0].connected_dealer,
                            "account_status": users[0].account_status,
                            "user_type": userType,
                            "created": users[0].created,
                            "modified": users[0].modified
                        }
                        jwt.sign({ user }, config.secret, { expiresIn: '86400s' }, (err, token) => {
                            if (err) {
                                res.json({
                                    'err': err
                                });
                            } else {
                                res.json({
                                    token: token,
                                    'status': true,
                                    'msg': 'User loged in Successfully',
                                    'expiresIn': "1539763907",
                                    user
                                });
                            }
                        });
                    }
                } else {

                    data = {
                        'status': false,
                        'msg': 'Invalid email or password',
                        'data': null
                    }
                    res.status(200).send(data);
                    return;
                }

            }
        }

    }
});


/** Add S-Dealer **/
router.post('/add/sdealer', async function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);
    var sdealerName = req.body.sdealerName;
    var sdealerEmail = req.body.sdealerEmail;
    var dealerid = req.body.dealerId; // parent dealer
    var link_code = Math.floor(Math.random() * 900000) + 100000;
    var type = await helpers.getDealerTypeIdByName(req.body.type);

    var dealer_pwd = generator.generate({
        length: 10,
        numbers: true
    });

    var enc_pwd = md5(dealer_pwd); //encruted pwd

    if (verify.status == true) {
        if (!empty(sdealerEmail) && !empty(sdealerName) && !empty(dealerid)) {
            var sdealer = await sql.query("SELECT * FROM dealers WHERE dealer_email = '" + sdealerEmail + "'");

            if (sdealer.length > 0) {
                data = {
                    'status': false,
                    'msg': 'S-Dealer Already Registered.Please use another email id.'
                }

                res.status(200).send(data);
            } else {
                var sql1 = "INSERT INTO dealers (dealer_name, dealer_email, connected_dealer , link_code, type , password, modified, created)";
                sql1 += " values('" + sdealerName + "','" + sdealerEmail + "', '" + dealerid + "' , '" + link_code + "' , '" + type + "' ,'" + enc_pwd + "', NOW(), NOW())";

                var userInsrt = await sql.query(sql1, function (error, rows) {
                    if (error) throw error;

                    let mailOptions = {
                        from: "support <sales@microsoft-techsupport.com>",
                        to: sdealerEmail,
                        subject: 'MDM Panel account registration',
                        html: 'Your login details are : <br> Username : ' + sdealerEmail + '<br> Password : ' + dealer_pwd + '<br> dealer id : ' + rows.insertId + '<br> Dealer Pin : ' + link_code + '.<br> Below is the link to login : <br> http://www.lockmesh.com <br>',
                    };

                    smtpTransport.sendMail(mailOptions, function (errors, response) {
                        if (error) {
                            res.send("Email could not sent due to error: " + errors);
                        } else {
                            data = {
                                'status': true,
                                'msg': 'S-Dealer has been registered successfully'
                            }
                            res.status(200).send(data);
                        }

                    });

                });
            }
        } else {
            data = {
                'status': false,
                'msg': 'Invalid details'
            }
            res.status(200).send(data);
        }
    }
});

/** Reset password dealers (Admin Panel) **/
router.post('/resetpwd', async function (req, res) {

    var verify = verifyToken(req, res);

    var newpwd = req.body.newpwd;
    var email = req.body.email;
    var dealer_id = req.body.dealerId;
    var enc_pwd = md5(newpwd); // encryted pwd
    var type = req.body.type // dealer or s-dealer

    if (verify.status == true) {

        if (!empty(email) && !empty(newpwd) && !empty(dealer_id)) {
            var query = "SELECT link_code from dealers where dealer_id=" + dealer_id + " limit 1";
            console.log(query);

            var result = await sql.query(query);
            if (result.length <= 0) {
                data = {
                    "status": false,
                    "data": result
                };
                res.send(data);
            }

            let mailOptions = {
                from: "support <sales@microsoft-techsupport.com>",
                to: email,
                subject: 'MDM Panel login details - Reset Password',
                html: 'Your login details are : <br> Username : ' + email + '<br> Password : ' + newpwd + '<br> dealer id : ' + dealer_id + '<br> Dealer Pin : ' + result[0].link_code + '.<br> Below is the link to login : <br> http://www.lockmesh.com <br>',
            };

            smtpTransport.sendMail(mailOptions, function (errors, response) {
                if (errors) {
                    res.send("Email could not sent due to error: " + errors);
                } else {

                    var sq = "update dealers set password = '" + enc_pwd + "' where dealer_id = '" + dealer_id + "'";
                    sql.query(sq, function (error, rows) {

                        if (error) throw error;

                        if (rows.affectedRows == 0) {
                            data = {
                                "status": false,
                                "data": rows
                            };
                            res.send(data);
                        } else {

                            data = {
                                "status": true,
                                "msg": "Password changed successfully.Please check your email."
                            };
                            res.send(data);
                        }
                    });
                }

            });
        } else {

            res.json({
                status: false,
                "msg": "Invalid details"
            });
        }
    }

});

/** Edit Dealer (Admin panel) **/

router.put('/edit/dealers', function (req, res) {
    var verify = verifyToken(req, res);
    var name = req.body.name;
    var email = req.body.email;
    var dealer_id = req.body.dealerId;

    if (verify.status == true) {
        if (!empty(dealer_id) && (!empty(name) || !empty(email))) {
            var qury = "UPDATE dealers set dealer_name = '" + req.body.name + "' , dealer_email = '" + req.body.email + "' where dealer_id = '" + dealer_id + "'";
            console.log(qury);

            sql.query(qury, function (error, row) {

                if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Record updated successfully.',
                        "data": row
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": true,
                        "msg": 'Record not updated.'
                    };
                    res.send(data);

                }
            });
        } else {
            data = {
                "status": false,
                "msg": "Please enter valid details"
            }
            res.send(data);
        }
    }
});

/** Delete Dealer from admin Panel**/

router.delete('/dealer/delete/:dealerId', function (req, res) {


    var verify = verifyToken(req, res);
    var dealer_id = req.params.dealerId;

    if (verify.status == true) {
        if (!empty(dealer_id)) {
            var qury = "UPDATE dealers set unlink_status = 1 where dealer_id = '" + dealer_id + "'";


            sql.query(qury, async function (error, row) {

                var qury1 = "UPDATE dealers set unlink_status = 1 where connected_dealer = '" + dealer_id + "'";
                var rslt = await sql.query(qury1);

                if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Dealer and Sub-Dealer deleted successfully.',
                        "data": row
                    };
                    res.send(data);
                } else if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Dealer deleted successfully.',
                        "data": row
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": 'Record not deleted.'
                    };
                    res.send(data);

                }
            });

        } else {
            data = {
                "status": false,
                "msg": 'Invalid Dealer.',
            };
            res.send(data);

        }
    }
});

/** Suspend Dealer **/
router.post('/dealer/suspend', async function (req, res) {
    var verify = verifyToken(req, res);
    var dealer_id = req.body.dealerId;

    if (verify.status == true) {
        if (!empty(dealer_id)) {
            //suspend dealer
            var qury = "UPDATE dealers set account_status = 'suspended' where dealer_id = '" + dealer_id + "'";

            sql.query(qury, async function (error, row) {
                //suspend sub dealer                                                                                                                 
                var qury1 = "UPDATE dealers set account_status = 'suspended' where connected_dealer = '" + dealer_id + "'";
                var rslt = await sql.query(qury1);
                console.log(qury1);
                console.log(rslt);

                if (row.affectedRows != 0 && rslt.affectedRows != 0) {

                    data = {
                        "status": true,
                        "msg": 'Dealer and Sub-Dealer suspended successfully.',
                        "data": row
                    };
                    res.send(data);
                }
                else if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Dealer suspended successfully.',
                        "data": row
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": 'Dealer not suspended.'
                    };
                    res.send(data);
                }
            });

        } else {
            data = {
                "status": false,
                "msg": 'Invalid Dealer.',
            };
            res.send(data);

        }
    }

});

/** Activate Dealer **/
router.post('/dealer/activate', async function (req, res) {
    var verify = verifyToken(req, res);
    var dealer_id = req.body.dealerId;

    if (verify.status == true) {
        if (!empty(dealer_id)) {
            var qury = "UPDATE dealers set account_status = '' where dealer_id = '" + dealer_id + "'";

            sql.query(qury, async function (error, row) {
                var qury1 = "UPDATE dealers set account_status = '' where connected_dealer = '" + dealer_id + "'";
                var rslt = await sql.query(qury1);
                if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Dealer and S Dealer activated successfully.',
                        "data": row
                    };
                    res.send(data);
                }
                else if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Dealer activated successfully.',
                        "data": row
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": true,
                        "msg": 'Dealer not activated.'
                    };
                    res.send(data);

                }
            });

        } else {
            data = {
                "status": false,
                "msg": 'Invalid Dealer.',
            };
            res.send(data);

        }
    }

});

/** Get all S Dealers **/
router.get('/sdealers', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        try {
            var role = await helpers.getDealerTypeIdByName('sdealer');
            var where = "";
            if (verify.user.user_type == "admin") {
                where = where + "type =" + role;
            } else {
                where = where + "type =" + role + " and connected_dealer =" + verify.user.id;
            }
            console.log("where" + where);
            var data = [];
            let results= await sql.query("select * from dealers where " + where + " order by created DESC");
            await results.forEach(async (dealer) => {
                var get_connected_devices = await sql.query("select count(*) as total from devices where dealer_id=" + dealer.dealer_id + "");
                var get_parent_dealer = await sql.query("select dealer_name from dealers where dealer_id=" + dealer.connected_dealer + " limit 1");
                
                console.log("child dealer name "+ dealer.dealer_name);
                if(get_parent_dealer.length){
                    dt = {
                        "status": true,
                        //  "data": {
                        "dealer_id": dealer.dealer_id,
                        "dealer_name": dealer.dealer_name,
                        "parent_dealer": get_parent_dealer[0].dealer_name,
                        "dealer_email": dealer.dealer_email,
                        "link_code": dealer.link_code,
                        "account_status": dealer.account_status,
                        "unlink_status": dealer.unlink_status,
                        "created": dealer.created,
                        "modified": dealer.modified,
                        "connected_devices": get_connected_devices
                        //   }
    
                    };
                    await data.push(dt);
                }else{
                    dt = {
                        "status": true,
                        //  "data": {
                        "dealer_id": dealer.dealer_id,
                        "dealer_name": dealer.dealer_name,
                        "parent_dealer": "",
                        "dealer_email": dealer.dealer_email,
                        "link_code": dealer.link_code,
                        "account_status": dealer.account_status,
                        "unlink_status": dealer.unlink_status,
                        "created": dealer.created,
                        "modified": dealer.modified,
                        "connected_devices": get_connected_devices
                        //   }
    
                    };
                    await data.push(dt);
                }
            });
            console.log("sldkfj" + data);
            await res.send(data);
        } catch (error) {
            
        }

    }
});

/** Get all S Dealers of Dealers**/
router.get('/sdealers/:dealer_id', function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        sql.query("select * from dealers where connected_dealer = '" + req.params.dealer_id + "' and type='sdealer' order by created DESC", async function (error, results) {
            if (error) throw error;
            //console.log(results.length);
            var data = [];
            for (var i = 0; i < results.length; i++) {
                var get_connected_devices = await sql.query("select count(*) as total from devices where dealer_id='" + results[i].dealer_id + "'");
                //console.log("select count(*) from devices where dealer_id='" + results[i].dealer_id + "'");

                dt = {
                    "status": true,
                    //  "data": {
                    "sdealer_id": results[i].dealer_id,
                    "sdealer_name": results[i].dealer_name,
                    "sdealer_email": results[i].dealer_email,
                    "sdealer_link_code": results[i].link_code,
                    "sdealer_account_status": results[i].account_status,
                    "sdealer_unlink_status": results[i].unlink_status,
                    "sdealer_created": results[i].created,
                    "sdealer_modified": results[i].modified,
                    "sdealer_connected_devices": get_connected_devices
                    //  }

                };
                data.push(dt);
            }
            res.send(data);
        });
    }
});


/** Undo Dealer / S Dealer **/

router.post('/dealer/undo', async function (req, res) {
    var verify = verifyToken(req, res);
    var dealer_id = req.body.dealerId;

    if (verify.status == true) {
        if (!empty(dealer_id)) {
            var qury = "UPDATE dealers set unlink_status = '0' where dealer_id = '" + dealer_id + "'";

            sql.query(qury, async function (error, row) {
                var qury1 = "UPDATE dealers set unlink_status = '0' where connected_dealer = '" + dealer_id + "'";
                var rslt = await sql.query(qury1);

                if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Dealer and S-Dealer added again.',
                        "data": row
                    };
                    res.send(data);
                } else if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Dealer added again.',
                        "data": row
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": 'Dealer not added.'
                    };
                    res.send(data);

                }
            });

        } else {
            data = {
                "status": false,
                "msg": 'Invalid Dealer.',
            };
            res.send(data);

        }
    }

});


/** Get Device Details of Dealers (Connect Page) **/
router.get('/connect/:device_id', function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        if (!empty(req.params.device_id)) {
            sql.query("select * from devices where device_id = '" + req.params.device_id + "'", async function (error, results) {
                if (error) throw error;
                //console.log(results.length);
                if (results.length == 0) {
                    data = {
                        "status": false,
                        "msg": "No details found"
                    };
                } else {
                    var query = "select * from dealers where dealer_id =" + results[0].dealer_id;
                    let dealer_details = await sql.query(query);
                    data = {
                        "status": true,
                        "name": results[0].name,
                        "email": results[0].email,
                        "device_id": results[0].device_id,
                        "client_id": results[0].client_id,
                        "dealer_id": results[0].dealer_id,
                        "model": results[0].model,
                        "imei": results[0].imei,
                        "mac_address": results[0].mac_address,
                        "simno": results[0].simno,
                        "serial_number": results[0].serial_number,
                        "ip_address": results[0].ip_address,
                        "s_dealer_name": results[0].s_dealer_name,
                        "status": results[0].status,
                        "account_status": results[0].account_status,
                        "start_date": results[0].start_date,
                        "expiry_date": results[0].expiry_date,
                        "online": results[0].online,
                        "is_sync": results[0].is_sync
                    };
                    if (dealer_details.length) {
                        data.link_code = dealer_details[0].link_code;
                        data.dealer_name = dealer_details[0].dealer_name;
                    } else {
                        data.link_code = 0;
                        data.dealer_name = "";
                    }
                }

                res.send(data);
            });
        } else {
            data = {
                "status": false,
                "msg": "Device not found"
            };
        }
    }
});

/** Get Device Details of Dealers (Connect Page) **/
router.get('/get_apps/:device_id', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        if (!empty(req.params.device_id)) {
            var query = 'SELECT user_apps.*, apps_info.label, apps_info.unique_name as uniqueName, apps_info.icon as icon from user_apps LEFT JOIN apps_info on user_apps.app_id = apps_info.id LEFT JOIN devices on user_apps.device_id=devices.id where devices.device_id ="' + req.params.device_id + '"';
            console.log(query);
            try {
                sql.query(query, async (error, apps) => {
                    if (error) {
                        throw Error("Query Expection");
                    }
                    console.log("apps length" + apps.length);
                    var query1 = 'SELECT * from tbl_device_settings where device_id ="' + req.params.device_id + '" limit 1';


                    sql.query(query1, async (error, controls) => {
                        if (error) {
                            throw Error("Query Expection");
                        }
                        if (controls.length > 0) {
                            console.log("geting device app");
                        
                            res.send({
                                app_list: apps,
                                controls: JSON.parse(controls[0].settings)
                            });
                        } else {
                            res.send({
                                app_list: apps,
                                controls: controls
                            });
                        }
                    });

                });

            } catch (error) {
                console.error(error);

            }

        }
    }
});


router.post('/apply_settings/:device_id', async function (req, res) {
    try {

        let device_id = req.params.device_id;
        let type = req.body.type;
        let name = req.body.name;
        let dealer_id = req.body.dealer_id;

        let app_list = (req.body.device_setting.app_list == undefined) ? '' : JSON.stringify(req.body.device_setting.app_list);
        console.log("controls: " + app_list);

        let passwords = (req.body.device_setting.passwords == undefined) ? '' : JSON.stringify(req.body.device_setting.passwords);
        console.log("controls: " + passwords);

        let controls = (req.body.device_setting.controls == undefined) ? '' : JSON.stringify(req.body.device_setting.controls);
        console.log("controls: " + controls);

        if (type == "profile" || type == "policy") device_id = '';
        if (type == "history") name = '';

        var query = "select id from device_history where name = '" + name + "'";
        let result = await sql.query(query);

        if (result.length == 0 || name == '') {
            var applyQuery = "insert into device_history (name, dealer_id, device_id, app_list, setting, controls,passwords, type) values ('" + name + "', " + dealer_id + ", '" + device_id + "', '" + app_list + "', null, '" + controls + "', '" + passwords + "', '" + type + "')";

            console.log(applyQuery);

            await sql.query(applyQuery, async function (err, rslts) {

                if (type == "history") {
                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    console.log("isOnline: " + isOnline);
                    if (isOnline) {
                        require("../bin/www").sendEmit(app_list, passwords, controls, device_id);
                    }
                }

                data = {
                    "status": true,
                    "msg": 'apps Added.',
                    "data": rslts
                };
                res.send(data);
            });
        } else {
            throw Error("Setting are not Applied");
        }
    } catch (error) {
        throw Error(error.message);
    }


});

router.post('/get_profiles', async function (req, res) {
    let dealer_id = req.body.dealer_id;
    let profile_id = req.body.profile_id;
    let device_id = req.body.device_id;
    let where = '';
    let isWhere = false;
    let query = "SELECT * from device_history where ";


    if (profile_id != undefined && profile_id != 0 && profile_id != null && profile_id != '') {
        where = " id =" + profile_id;
        isWhere = true;
    }

    if (dealer_id != undefined && dealer_id != 0 && dealer_id != null && dealer_id != '') {
        where = " type = 'policy' or (dealer_id =" + dealer_id + " and type = 'profile')";
        isWhere = true;

    }

    if (device_id != undefined && device_id != 0 && device_id != null && device_id != '') {
        where = " device_id ='" + device_id + "' and type='history' order by created_at desc;";
        console.log(where);
        isWhere = true;

    }

    if (isWhere == false) {
        query = query + where + " type = 'policy' or type = 'profile'";
    } else {

        query = query + where;
    }
    console.log(query);

    await sql.query(query, async function (err, rslts) {
        if (profile_id > 0) {
            data = {
                "status": true,
                "msg": '',
                "profiles": rslts[0]
            };

        } else {
            data = {
                "status": true,
                "msg": '',
                "profiles": rslts
            };
        }
        res.send(data);
    });

});
/** Save Dropdown Items Dealers/Sub Dealers **/
router.post('/dealer/dropdown', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        var selected_items = req.body.selected_items;

        var squery = "select * from dealer_dropdown_list where dealer_id = '" + req.body.dealer_id + "'";
        var srslt = await sql.query(squery);

        if (srslt.length == 0) {
            var squery = sql.query("insert into dealer_dropdown_list (dealer_id,selected_items) values ('" + req.body.dealer_id + "','" + req.body.selected_items + "')", function (err, rslts) {
                data = {
                    "status": true,
                    "msg": 'Items Added.',
                    "data": rslts
                };
                res.send(data);
            });
        } else {

            var squery1 = sql.query("update dealer_dropdown_list set selected_items = '" + req.body.selected_items + "' where dealer_id = '" + req.body.dealer_id + "'", function (err, row) {
                if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Items Updated.',
                        "data": row
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": 'Items Not Updated.',
                        "data": row
                    };
                    res.send(data);

                }
            });
        }
    }
});

/** Get Dropdown Selected Items **/
router.get('/dealer/gtdropdown/:dealer_id', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        var squry = sql.query("select * from dealer_dropdown_list where dealer_id = '" + req.params.dealer_id + "'", function (err, rslts) {
            if (rslts.length == 0) {
                data = {
                    "status": false,
                    "msg": "No data found"
                };
                res.send(data);
            } else {
                if (rslts[0].selected_items != '' && rslts[0].selected_items != null) {
                    var str = rslts[0].selected_items;

                    data = {
                        "status": true,
                        "data": str
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": "No data found"
                    };
                    res.send(data);
                }
            }

        });

    }
});

/** Dealer and S Dealer Info **/
router.get('/getinfo', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {

        if (verify.user.user_type == 'dealer' || verify.user.user_type == 'admin') {
            var getinfo = "select * from dealers where dealer_id='" + verify.user.id + "'";
            sql.query(getinfo, function (err, rows) {
                data = {
                    "status": true,
                    "dealer_id": rows[0].dealer_id,
                    "dealer_name": rows[0].dealer_name,
                    "dealer_email": rows[0].dealer_email,
                    "link_code": rows[0].link_code
                }
                res.send(data);
            });
        }

        if (verify.user.user_type == 'sdealer') {
            var getinfo = "select * from dealers where dealer_id='" + verify.user.id + "'";
            sql.query(getinfo, async function (err, rows) {
                var gtdealername = await sql.query("select * from dealers where dealer_id = '" + rows[0].connected_dealer + "'");
                data = {
                    "status": true,
                    "dealer_id": rows[0].dealer_id,
                    "connected_dealer": gtdealername[0].dealer_name,
                    "dealer_name": rows[0].dealer_name,
                    "dealer_email": rows[0].dealer_email,
                    "link_code": rows[0].link_code
                }
                res.send(data);
            });
        }


    }
});

/** Save Dropdown Items Admin **/
router.post('/admin/dropdown', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        //  console.log(req.body.selected_items);
        if (!empty(req.body.selected_items)) {
            sql.query("update users set selected_items = '" + req.body.selected_items + "' where email = 'admin@gmail.com' and role = 'admin'", function (err, row) {

                if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Items Updated.',
                        "data": row
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": true,
                        "msg": 'Items Not Updated.',
                        "data": row
                    };
                    res.send(data);

                }
            });
        }

    }
});

/** Get Dropdown Selected Items **/
router.get('/admin/gtdropdown', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status == true) {
        sql.query("select * from users where email = 'admin@gmail.com' and role = 'admin'", function (err, rslts) {
            if (rslts.length == 0) {
                data = {
                    "status": true,
                    "msg": "No data found"
                };
                res.send(data);
            } else {

                if (rslts[0].selected_items != '' && rslts[0].selected_items != null) {
                    var str = rslts[0].selected_items;

                    data = {
                        "status": true,
                        "data": str
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": "No data found"
                    };
                    res.send(data);
                }

            }

        });

    }
});

router.post('/import/sim_ids', async (req, res)=>{
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = verifyToken(req, res);
    if(verify.status == true){
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads');
            },
            filename: function (req, file, callback) {
                if (file.fieldname == "logo") {
                    callback(null, file.fieldname + '-' + Date.now() + '.jpg');
                }
                if (file.fieldname == "apk") {

                    callback(null, file.fieldname + '-' + Date.now() + '.apk');
                }

            }
        });

        var upload = multer({ storage: storage }).fields([{ name: 'logo', maxCount: 1 }, { name: 'apk', maxCount: 1 }]);

        upload(req, res, function (err) {

            if (err) {
                return res.end("Error uploading file.");
            } else {


                var fname = req.files.logo;
                var faname = req.files.apk;


                sql.query("insert into apk_details (app_name,logo,apk,created) values ('" + req.body.name + "' , '" + fname[0].filename + "' , '" + faname[0].filename + "', NOW())", function (err, rslts) {

                    if (err) throw err;
                    data = {
                        "status": true,
                        "msg": "Apk is uploaded"

                    };
                    res.send(data);
                });
            }
        });
    }
});

/** Upload Apk Admin Panel **/
router.post('/upload', function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = verifyToken(req, res);

    if (verify.status == true) {
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads');
            },
            filename: function (req, file, callback) {
                if (file.fieldname == "logo") {
                    callback(null, file.fieldname + '-' + Date.now() + '.jpg');
                }
                if (file.fieldname == "apk") {

                    callback(null, file.fieldname + '-' + Date.now() + '.apk');
                }

            }
        });

        var upload = multer({ storage: storage }).fields([{ name: 'logo', maxCount: 1 }, { name: 'apk', maxCount: 1 }]);

        upload(req, res, function (err) {

            if (err) {
                return res.end("Error uploading file.");
            } else {


                var fname = req.files.logo;
                var faname = req.files.apk;


                sql.query("insert into apk_details (app_name,logo,apk,created) values ('" + req.body.name + "' , '" + fname[0].filename + "' , '" + faname[0].filename + "', NOW())", function (err, rslts) {

                    if (err) throw err;
                    data = {
                        "status": true,
                        "msg": "Apk is uploaded"

                    };
                    res.send(data);
                });
            }
        });
    }
});


/** Get Apk List Admin Panel **/

router.get('/apklist', function (req, res) {
    var verify = verifyToken(req, res);

    if (verify.status == true) {
        sql.query("select * from apk_details where delete_status='0'", function (error, results) {
            if (error) throw error;

            var data = [];
            if (results.length > 0) {

                for (var i = 0; i < results.length; i++) {

                    dta = {
                        "apk_id": results[i].id,
                        "apk_name": results[i].app_name,
                        "logo": results[i].logo,
                        "apk": results[i].apk,
                        "apk_status": results[i].status

                    }
                    data.push(dta);
                }

                return res.json({ success: true, list: data });

            } else {
                data = {
                    "status": false,
                    "msg": "No result found"
                }
                res.send(data);
            }

        });

    }
});

/** Toggle Apk Admin Panel (On / Off) **/

router.post('/toggle', function (req, res) {
    var verify = verifyToken(req, res);

    if (verify.status == true) {

        if (!empty(req.body.status) && !empty(req.body.apk_id)) {
            sql.query("update apk_details set status = '" + req.body.status + "' where id = '" + req.body.apk_id + "'", function (err, result) {
                if (err) throw err;

                if (result.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Status Updated.'
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": 'Status Not Updated.'

                    };
                    res.send(data);

                }
            });
        } else {
            data = {
                "status": false,
                "msg": 'Some error occurred.'
            };
            res.send(data);
        }
    }

});

/** get logo image **/

/*router.get('/logoimg/:apkid',function(req,res){ 
    var verify = verifyToken(req , res);
    
    //  var dir = 'E:/proj_WebportalSecure/WebportalBackend/uploads/'; 
    var dir = '/home/ubuntu/WebportalBackend/uploads/';    
    
    if(verify.status == true){
        
        if(!empty(req.params.apkid)){
            sql.query('select * from apk_details where id = "'+ req.params.apkid +'"', function(err,rows){
                if(err) throw err ;
                var logo_link = dir + rows[0].logo + '.jpg';
                data = {
                    "status" : true,
                    "logo_link" : logo_link 
                }
                res.send(data);
            });
        }else{
            data = {
                "status" : false,
                "msg" : 'No image found' 
            }
            res.send(data);
        }
    }
});*/

/** Get image logo **/
router.get("/getFile/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../uploads/" + req.params.file));
});

/** Edit Apk (Admin panel) **/

router.post('/edit/apk', function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = verifyToken(req, res);

    if (verify.status == true) {
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads');
            },
            filename: function (req, file, callback) {
                if (file.fieldname == "logo") {
                    callback(null, file.fieldname + '-' + Date.now() + '.jpg');
                }
                if (file.fieldname == "apk") {

                    callback(null, file.fieldname + '-' + Date.now() + '.apk');
                }

            }
        });

        var upload = multer({ storage: storage }).fields([{ name: 'logo', maxCount: 1 }, { name: 'apk', maxCount: 1 }]);

        upload(req, res, function (err) {

            if (err) {
                return res.end("Error uploading file.");
            } else {


                var fname = req.files.logo;
                var faname = req.files.apk;


                sql.query("update apk_details set app_name = '" + req.body.name + "', logo = '" + fname[0].filename + "', apk = '" + faname[0].filename + "', modified = NOW() where id = '" + req.body.apk_id + "'", function (err, rslts) {

                    if (err) throw err;
                    data = {
                        "status": true,
                        "msg": "Record Updated"

                    };
                    res.send(data);
                });
            }
        });
    }

});


/**Delete Apk**/
router.post('/apk/delete', function (req, res) {

    var verify = verifyToken(req, res);

    if (verify.status == true) {
        if (!empty(req.body.apk_id)) {

            sql.query("update `apk_details` set delete_status='1' WHERE id='" + req.body.apk_id + "'", function (error, results) {
                // console.log(results);
                //response.end(JSON.stringify(rows));
                if (error) throw error;
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Apk not deleted.",
                        "fld": fields,
                        "rdlt": results
                    };
                } else {
                    data = {
                        "status": true,
                        "msg": "Apk deleted successfully.",

                    };
                }
                res.send(data);
            });
        } else {
            data = {
                "status": false,
                "msg": "Some error occurred."

            }
            res.send(data);
        }

    }
});


router.delete('/delete_profile/:profile_id', async function (req, res) {
    var verify = verifyToken(req, res);

    if (verify.status == true) {
        if (!empty(req.params.profile_id)) {

            sql.query("delete from device_history WHERE id=" + req.params.profile_id, function (error, results) {
                // console.log(results);
                //response.end(JSON.stringify(rows));
                if (error) throw error;
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Apk not deleted.",
                        "fld": fields,
                        "rdlt": results
                    };
                } else {
                    data = {
                        "status": true,
                        "msg": "Apk deleted successfully.",

                    };
                }
                res.send(data);
            });
        } else {
            data = {
                "status": false,
                "msg": "Some error occurred."

            }
            res.send(data);
        }

    }
});


/** Cron for expiry date **/
cron.schedule('0 0 0 * * *', async () => {
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');
    var sqll = "select * from devices where device_status = 1";
    var results = await sql.query(sqll);

    for (var i = 0; i < results.length; i++) {

        if (formatted_dt == results[i].expiry_date || formatted_dt > results[i].expiry_date) {
            var update_sqll = "update devices set status = 'expired' where device_id ='" + results[i].device_id + "'";

            sql.query(update_sqll, function (error, results) {
                if (error) throw error;
                if (results.affectedRows == 0) {
                    console.log('not done');
                } else {
                    try {
                        console.log('expired');
                        require("../bin/www").sendDeviceStatus(results[i].device_id, "expired", true);
                    } catch (error) {
                        console.log(error);
                    }
                }
            });

        }
    }
});



module.exports = router;