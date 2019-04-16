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
var upload = multer({
    dest: 'uploads/'
});
var XLSX = require('xlsx');
const url = require('url');
var path = require('path');
var fs = require("fs");
var Constants = require('../constants/Application');

var helpers = require('../helper/general_helper.js');
const device_helpers = require('../helper/device_helpers.js');
// const UserApps = require('../models/UserApps');
// const Devices = require('../models/Devices');

const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
let usr_acc_query_text = "usr_acc.id,usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,del_status"
// var CryptoJS = require("crypto-js");
// var io = require("../bin/www");


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
    // console.log("hello smtp", smtpTransport);
    smtpTransport.sendMail(mailOptions, cb);
}


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
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Failed to authenticate token.'
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
            msg: 'No token provided.'
        });
    }
    return ath;
}



/* GET users listing. */
router.get('/', function (req, res, next) {
    // let query = "UPDATE user_apps set guest=0 WHERE id = 5037";
    // let result = UserApps.findAll().then((result) => {
    //     res.send(result);
    // });
    // console.log(result);
    // res.send(result);
    // let result =
});

router.get('/test', async function (req, res) {
    var componentAllowed = await helpers.isAllowedComponent(1, 155);
    console.log(componentAllowed);
    res.send({
        status: true,
        allowed: componentAllowed
    });
});

/*****User Login*****/
router.post('/login', async function (req, res) {
    var email = req.body.demail;
    var pwd = req.body.pwd;
    var enc_pwd = md5(pwd);
    var data = '';

    //check for if email is already registered
    var sql1 = "SELECT * FROM dealers WHERE dealer_email = '" + email + "' limit 1";

    var users = await sql.query(sql1);
    if (users.length == 0) {
        data = {
            'status': false,
            'msg': 'User does not exist',
            'data': null
        }
        res.status(200).send(data);
    } else {

        var userTypeQuery = "SELECT * FROM user_roles WHERE id =" + users[0].type + " AND status='1'";
        var userType = await sql.query(userTypeQuery);
        if (userType.length == 0) {

            data = {
                'status': false,
                'msg': 'User does not exist',
                'data': null
            }
            res.status(200).send(data);
        } else {

            var dUser = "SELECT * FROM dealers WHERE  dealer_email='" + email + "' and password ='" + enc_pwd + "';";

            var usr = await sql.query(dUser);

            if (usr.length) {
                if (users[0].account_status == 'suspended') {
                    data = {
                        'status': false,
                        'msg': 'Your account is suspended',
                        'data': null
                    }
                    res.status(200).send(data);
                    return;
                } else if (users[0].unlink_status == 1) {
                    data = {
                        'status': false,
                        'msg': 'Your account is deleted',
                        'data': null
                    }
                    res.status(200).send(data);
                    return;
                } else {
                    var userType = await helpers.getUserType(users[0].dealer_id);
                    var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + users[0].dealer_id + "'");

                    console.log('object data is ', users[0]);
                    const user = {
                        "id": users[0].dealer_id,
                        "dealer_id": users[0].dealer_id,
                        "email": users[0].dealer_email,
                        "lastName": users[0].last_name,
                        "name": users[0].dealer_name,
                        "firstName": users[0].first_name,
                        "dealer_name": users[0].dealer_name,
                        "dealer_email": users[0].dealer_email,
                        "link_code": users[0].link_code,
                        "connected_dealer": users[0].connected_dealer,
                        "connected_devices": get_connected_devices,
                        "account_status": users[0].account_status,
                        "user_type": userType,
                        "created": users[0].created,
                        "modified": users[0].modified,
                        "token": null
                    }
                    // const user = {
                    //     "id": users[0].dealer_id,

                    //     "email": users[0].dealer_email,
                    //     "user_type": userType[0].role,
                    //     "modified": users[0].modified,
                    //     "created": users[0].created
                    // }
                    jwt.sign({
                        user
                    }, config.secret, {
                            expiresIn: '86400s'
                        }, (err, token) => {
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
});

/*****User Registration*****/
router.post('/Signup', async function (req, res) {
    // var firstName = req.body.firstName;
    // var lastName = req.body.lastName;
    // var email = req.body.email;

    // var upass = ' ';
    // var data = '';

    // //hash the password
    // const saltRounds = 10;
    // var salt = bcrypt.genSaltSync(saltRounds);
    // var upass = bcrypt.hashSync(req.body.upass, salt);

    // var user = await sql.query("SELECT * FROM users WHERE email = '" + email + "'");

    // console.log(user.length);
    // if (user.length > 0) {
    //     data = {
    //         'status': false,
    //         'msg': 'User Already Registered.Please use another email id.',
    //         'data': {
    //             'userId': user[0].id
    //         }
    //     }

    //     res.status(200).send(data);
    // } else {
    //     var sql2 = "INSERT INTO users (firstName, lastName, email, password, modified, created)";
    //     sql2 += " values('" + firstName + "','" + lastName + "', '" + email + "' ,'" + upass + "', NOW(), NOW())";

    //     var userInsrt = await sql.query(sql2);

    //     data = {
    //         'status': true,
    //         'msg': 'User has been registered successfully',
    //         'data': {
    //             'userId': userInsrt.insertId
    //         }
    //     }
    //     res.status(200).send(data);
    // }

});





router.get('/get_allowed_components', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {


        

    }
});



router.post('/check_component', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {
        var componentUri = req.body.ComponentUri;
        var userId = verify.user.id;
        var result = await helpers.isAllowedComponentByUri(componentUri, userId);
        let getUser = "select * from dealers where dealer_id =" + userId;
        let user = await sql.query(getUser);
        var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + userId + "'");

        

        if (user.length) {

            const usr = {
                "id": user[0].dealer_id,
                "dealer_id": user[0].dealer_id,
                "email": user[0].dealer_email,
                "lastName": user[0].last_name,
                "name": user[0].dealer_name,
                "firstName": user[0].first_name,
                "dealer_name": user[0].dealer_name,
                "dealer_email": user[0].dealer_email,
                "link_code": user[0].link_code,
                "connected_dealer": user[0].connected_dealer,
                "connected_devices": get_connected_devices,
                "account_status": user[0].account_status,
                "user_type": verify.user.user_type,
                "created": user[0].created,
                "modified": user[0].modified,
            }

            res.json({
                'status': true,
                'msg': '',
                user: usr,
                ComponentAllowed: result
            });
        } else {
            res.send({
                status: false,
                msg: "authentication failed"
            });
        }

    }
});

/** is_admin **/


/**GET all the devices**/
router.get('/devices', async function (req, res) {

    var verify = verifyToken(req, res);
    var where_con = '';
    let newArray = [];
    if (verify.status !== undefined && verify.status == true) {
        if (verify.user.user_type !== 'admin') {
            if (verify.user.user_type === 'dealer') {
                where_con = 'AND (usr_acc.dealer_id =' + verify.user.id + ' OR usr_acc.prnt_dlr_id =' + verify.user.id + ')';
                let query = "SELECT * From acc_action_history WHERE action = '" + Constants.DEVICE_UNLINKED + "' AND dealer_id = '" + verify.user.id + "'";
                console.log(query);
                newArray = await sql.query(query)
            } else {
                where_con = 'AND usr_acc.dealer_id = ' + verify.user.id + ' ';
                let query = "SELECT * From acc_action_history WHERE action = '" + Constants.DEVICE_UNLINKED + "' AND dealer_id = '" + verify.user.id + "'";
                console.log(query);
                newArray = await sql.query(query)
            }
        }

        // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC');
        // sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer , pgp_emails.pgp_email,chat_ids.chat_id ,sim_ids.sim_id from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id LEFT JOIN pgp_emails on pgp_emails.user_acc_id = usr_acc.id LEFT JOIN chat_ids on chat_ids.user_acc_id = usr_acc.id LEFT JOIN sim_ids on sim_ids.device_id = usr_acc.device_id where usr_acc.transfer_status = 0 ' + where_con + ' order by devices.id DESC', function (error, results, fields) {
        sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 ' + where_con + ' order by devices.id DESC', async function (error, results, fields) {

            if (error) throw error;
            for (var i = 0; i < results.length; i++) {
                results[i].finalStatus = device_helpers.checkStatus(results[i])
                results[i].pgp_email = await device_helpers.getPgpEmails(results[i])
                results[i].sim_id = await device_helpers.getSimids(results[i])
                results[i].chat_id = await device_helpers.getChatids(results[i])
                // dealerData = await device_helpers.getDealerdata(results[i]);
            }
            let finalResult = [...results, ...newArray]
            // console.log(Object.keys(finalResult[0]));
            // console.log(Object.values(finalResult[0]));
            // let data123 = await helpers.getAllRecordbyDeviceId('UHLZ092101')
            // device_helpers.saveActionHistory(finalResult[1], Constants.DEVICE_UNLINKED)
            // console.log("return data", data123);
            // console.log("Here is data",await helpers.getAllRecordbyDeviceId(finalResult[0].id));
            // device_helpers.getQueryOfInsert(finalResult[0])
            data = {
                "status": true,
                "data": finalResult
            };
            res.send(data);
        });
    }
});


/**GET New the devices**/
router.get('/new/devices', function (req, res) {
    var verify = verifyToken(req, res);
    var where_con = '';

    if (verify.status !== undefined && verify.status == true) {
        if (verify.user.user_type !== 'admin') {
            if (verify.user.user_type === 'dealer') {
                console.log('done of dealer', verify.user.id)
                where_con = 'AND (usr_acc.dealer_id =' + verify.user.id + ' OR usr_acc.prnt_dlr_id =' + verify.user.id + ')';
            } else {
                where_con = 'AND usr_acc.dealer_id = ' + verify.user.id + ' ';
            }
        }

        sql.query('select devices.*  ,' + usr_acc_query_text + ' from devices left join usr_acc on  devices.id = usr_acc.device_id WHERE ((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC', function (error, results, fields) {
            if (error) throw error;
            data = {
                "status": true,
                "data": results
            };
            res.send(data);
        });
    }
});

/*** Add Dealer ***/
router.post('/add/dealer', async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        var dealerName = req.body.name;
        // console.log("dealerName:", req.body.name);
        var loggedInuid = verify.user.id;
        let userType = await helpers.getUserType(loggedInuid);
        // console.log('userType', userType);
        var dealerEmail = req.body.email;
        // console.log("dealerEmail: " + dealerEmail);

        var pageType = req.body.pageType;
        // console.log("pageType: " + pageType);

        if (userType == SDEALER || (userType == DEALER && pageType == DEALER)) {
            data = {
                "status": false,
                "msg": "invalid operation",
            }
            res.send(data);
        }
        let sdealerDealerId = 0;

        if (userType == ADMIN && pageType == SDEALER) {
            sdealerDealerId = req.body.dealerId;
        } else if (userType == DEALER && pageType == SDEALER) {
            sdealerDealerId = loggedInuid;
        }
        //console.log("dealerId: " + dealerId);

        var link_code = randomize('0', 6);
        link_code = await helpers.checkLinkCode(link_code)
        // console.log("link_code: " + link_code);

        // console.log("dealerType: " + userType);
        var type = await helpers.getDealerTypeIdByName(pageType);

        // console.log("dealerType converted: " + type);

        var dealer_pwd = generator.generate({
            length: 10,
            numbers: true
        });
        console.log("dealer_pwd: " + dealer_pwd);

        var enc_pwd = md5(dealer_pwd); //encryted pwd
        console.log("encrypted password" + enc_pwd);
        if (!empty(dealerEmail) && !empty(dealerName)) {
            var dealer = await sql.query("SELECT * FROM dealers WHERE dealer_email = '" + dealerEmail + "'");

            if (dealer.length > 0) {
                data = {
                    'status': false,
                    'msg': 'Dealer Already Registered. Please use another email.',
                }

                res.status(200).send(data);
                return;
            }

            var sql1 = "INSERT INTO dealers (connected_dealer, dealer_name, dealer_email, password, link_code , type , modified, created)";
            if (sdealerDealerId != undefined && !empty(sdealerDealerId) && sdealerDealerId != null && sdealerDealerId != 0) {
                sql1 += " VALUES (" + sdealerDealerId + ", '" + dealerName + "','" + dealerEmail + "', '" + enc_pwd + "','" + link_code + "', '" + type + "', NOW(), NOW())";
            } else {
                sql1 += " VALUES (0, '" + dealerName + "','" + dealerEmail + "', '" + enc_pwd + "','" + link_code + "', '" + type + "', NOW(), NOW())";
            }
            console.log("insert query" + sql1);

            sql.query(sql1, function (error, rows) {
                if (error) throw error;

                var html = '';
                if (pageType === DEALER) {

                    html = 'Your login details are : <br> ' +
                        'Email : ' + dealerEmail + '<br> ' +
                        'Password : ' + dealer_pwd + '<br> ' +
                        'Dealer id : ' + rows.insertId + '<br> ' +
                        'Dealer Pin : ' + link_code + '.<br> ' +
                        'Below is the link to login : <br> http://www.lockmesh.com <br>';
                } else {
                    html = 'Your login details are : <br> ' +
                        'Email : ' + dealerEmail + '<br> ' +
                        'Password : ' + dealer_pwd + '<br> ' +
                        'S-Dealer id : ' + rows.insertId + '<br> ' +
                        'S-Dealer Pin : ' + link_code + '.<br> ' +
                        'Below is the link to login : <br> http://www.lockmesh.com <br>';
                }


                sendEmail("Account Registration", html, dealerEmail, async function (errors, response) {
                    if (error) {
                        res.send("Email could not sent due to error: " + errors);
                    } else {
                        //res.send("Email has been sent successfully");
                        var dealer = await sql.query("SELECT * FROM dealers WHERE dealer_email = '" + dealerEmail + "'");
                        // console.log('result add',dealer);
                        data = {
                            'status': true,
                            'msg': 'Dealer has been registered successfully',
                            'item_added': dealer,

                        }

                        res.status(200).send(data);
                    }

                });

            });

        } else {
            data = {
                'status': false,
                'msg': 'Invalid email or name'
            }
            res.status(200).send(data);
        }

    }
    // res.setHeader('Content-Type', 'application/json');

    // var verify = verifyToken(req, res);

    // var dealerName = req.body.name;
    // // var sdealerName = req.body.sdealerName;
    // var dealerEmail = req.body.email;
    // console.log("dealerEmail: " + dealerEmail);

    // // var sdealerEmail = req.body.sdealerEmail;
    // var pageType = req.body.pageType;
    // console.log("pageType: " + pageType);

    // var dealerId = req.body.dealerId;
    // console.log("dealerId: " + dealerId);

    // var link_code = randomize('0', 6);
    // // var link_code = Math.floor(Math.random() * 900000) + 100000;
    // console.log("link_code: " + link_code);

    // console.log("dealerType: " + req.body.type);
    // var type = await helpers.getDealerTypeIdByName(req.body.type);
    // console.log("dealerType converted: " + type);

    // var dealer_pwd = generator.generate({
    //     length: 10,
    //     numbers: true
    // });
    // console.log("dealer_pwd: " + dealer_pwd);

    // var enc_pwd = md5(dealer_pwd); //encryted pwd
    // console.log("encrypted password" + enc_pwd);

    // if (verify.status == true) {
    //     if (!empty(dealerEmail) && !empty(dealerName)) {
    //         var dealer = await sql.query("SELECT * FROM dealers WHERE dealer_email = '" + dealerEmail + "'");

    //         if (dealer.length > 0) {
    //             data = {
    //                 'status': false,
    //                 'msg': 'Dealer Already Registered.Please use another email id.',
    //             }

    //             res.status(200).send(data);
    //             return;
    //         }

    //         var sql1 = "INSERT INTO dealers (connected_dealer, dealer_name, dealer_email, password, link_code , type , modified, created)";
    //         if (!empty(dealerId) && dealerId != null && dealerId != 0) {
    //             sql1 += " VALUES (" + dealerId + ", '" + dealerName + "','" + dealerEmail + "', '" + enc_pwd + "','" + link_code + "', '" + type + "', NOW(), NOW())";
    //         } else {
    //             sql1 += " VALUES (0, '" + dealerName + "','" + dealerEmail + "', '" + enc_pwd + "','" + link_code + "', '" + type + "', NOW(), NOW())";
    //         }
    //         console.log("insert query" + sql1);

    //         sql.query(sql1, function (error, rows) {
    //             if (error) throw error;

    //             var html = 'Your login details are : <br> ' +
    //                 'Email : ' + dealerEmail + '<br> ' +
    //                 'Password : ' + dealer_pwd + '<br> ' +
    //                 'Dealer id : ' + rows.insertId + '<br> ' +
    //                 'Dealer Pin : ' + link_code + '.<br> ' +
    //                 'Below is the link to login : <br> http://www.lockmesh.com <br>';

    //             sendEmail("Account Registration", html, dealerEmail, function (errors, response) {
    //                 if (error) {
    //                     res.send("Email could not sent due to error: " + errors);
    //                 } else {
    //                     //res.send("Email has been sent successfully");
    //                     data = {
    //                         'status': true,
    //                         'msg': 'Dealer has been registered successfully',

    //                     }

    //                     res.status(200).send(data);
    //                 }

    //             });

    //         });

    //     } else {
    //         data = {
    //             'status': false,
    //             'msg': 'Invalid email or name'
    //         }
    //         res.status(200).send(data);
    //     }
    // }
});


/*Get dealers*/
router.get('/dealers/:pageName', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let where = "";
        console.log("pageName", req.params.pageName);
        console.log("userType: " + verify.user.user_type);

        if (verify.user.user_type == "admin") {
            var role = await helpers.getDealerTypeIdByName(req.params.pageName);
        } else if (verify.user.user_type == "dealer") {
            var role = await helpers.getDealerTypeIdByName('sdealer');
            where = " AND connected_dealer =" + verify.user.id
        }
        console.log("where where", where);
        console.log("select * from dealers where type=" + role + " " + where + " order by created DESC");
        if (role) {
            sql.query("select * from dealers where type=" + role + " " + where + " order by created DESC", async function (error, results) {
                if (error) throw error;
                console.log(results.length);
                var data = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].connected_dealer != 0 && results[i].connected_dealer != '' && results[i].connected_dealer != '0') {
                        var get_parent_dealer = await sql.query("select dealer_id, dealer_name from dealers where dealer_id=" + results[i].connected_dealer + " limit 1");
                        console.log(get_parent_dealer);
                    }
                    var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + results[i].dealer_id + "'");

                    dt = {
                        "status": true,
                        "dealer_id": results[i].dealer_id,
                        "dealer_name": results[i].dealer_name,
                        "dealer_email": results[i].dealer_email,
                        "link_code": results[i].link_code,
                        "account_status": results[i].account_status,
                        "unlink_status": results[i].unlink_status,
                        "created": results[i].created,
                        "modified": results[i].modified,
                        "connected_devices": get_connected_devices
                    };

                    if (get_parent_dealer != undefined && get_parent_dealer.length > 0) {
                        dt.parent_dealer = get_parent_dealer[0].dealer_name;
                        dt.parent_dealer_id = get_parent_dealer[0].dealer_id;
                    } else {
                        dt.parent_dealer = "";
                        dt.parent_dealer_id = "";
                    }

                    data.push(dt);
                }
                res.send(data);
            });
        }
    }
});

/*Get All Dealers */
router.get('/dealers', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        console.log("userType: " + verify.user.user_type);

        if (verify.user.user_type == "admin") {
            var role = await helpers.getuserTypeIdByName(verify.user.user_type);
            console.log("role id", role);
            sql.query("select * from dealers where type!=" + role + " order by created DESC", async function (error, results) {
                if (error) throw error;

                var data = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].connected_dealer != 0 && results[i].connected_dealer != '' && results[i].connected_dealer != '0') {
                        var get_parent_dealer = await sql.query("select dealer_id, dealer_name from dealers where dealer_id=" + results[i].connected_dealer + " limit 1");
                        console.log(get_parent_dealer);
                    }
                    var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + results[i].dealer_id + "'");

                    dt = {
                        "status": true,
                        "dealer_id": results[i].dealer_id,
                        "dealer_name": results[i].dealer_name,
                        "dealer_email": results[i].dealer_email,
                        "link_code": results[i].link_code,
                        "account_status": results[i].account_status,
                        "unlink_status": results[i].unlink_status,
                        "created": results[i].created,
                        "modified": results[i].modified,
                        "connected_devices": get_connected_devices
                    };

                    if (get_parent_dealer != undefined && get_parent_dealer.length > 0) {
                        dt.parent_dealer = get_parent_dealer[0].dealer_name;
                        dt.parent_dealer_id = get_parent_dealer[0].dealer_id;
                    } else {
                        dt.parent_dealer = "";
                        dt.parent_dealer_id = "";
                    }

                    data.push(dt);
                }
                res.send(data);
            });
        } else {
            res.send({
                status: true,
                message: "forbidden access"
            })
        }

    }
});

/***Add devices (not using) ***/
router.post('/create/device_profile', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var activation_code = randomize('0', 7);
        let device_id = helpers.getDeviceId();
        device_id = await helpers.checkDeviceId(device_id);
        console.log("device_id", device_id);
        var name = req.body.name;
        var client_id = req.body.client_id;
        var chat_id = req.body.chat_id ? req.body.chat_id : '';
        var model = req.body.model;
        var email = req.body.email
        var pgp_email = req.body.pgp_email;
        var start_date = req.body.start_date;
        var exp_month = req.body.expiry_date;
        var dealer_id = verify.user.dealer_id;
        var sim_id = req.body.sim_id ? req.body.sim_id : '';
        var loggedUserId = verify.user.id;
        var loggedUserType = verify.user.type;
        let policy_id = req.body.policy_id ? req.body.policy_id : '';
        if (loggedUserType === ADMIN) {
            //    dealer_id= req.body.dealer_id;
        }
        let checkUnique = "SELECT account_email from usr_acc WHERE account_email= '" + email + "'";
        let checkUniquePgp = "SELECT pgp_email from pgp_emails WHERE (pgp_email= '" + pgp_email + "' AND used=1)";

        let checkDevice = await sql.query(checkUnique);
        let checkDevicepgp = await sql.query(checkUniquePgp);

        if (checkDevice.length || checkDevicepgp.length) {
            res.send({
                status: false,
                msg: "Account email or PGP email already taken"
            });
            return;
        } else {
            var checkDealer = "SELECT * FROM dealers WHERE dealer_id = " + dealer_id;

            var insertDevice = "INSERT INTO devices (device_id, name, model ";

            var values = ") VALUES ('" + device_id + "','" + name + "', '" + model + "'";
            // var values = ") VALUES ('" + activation_code + "', '" + name + "', '" + client_id + "', '" + chat_id + "', '" + model + "', '" + email + "', '" + pgp_email + "', " + exp_month + ", " + dealer_id + ", 0, 0 ";
            sql.query(checkDealer, async (error, response) => {
                if (error) throw (error);

                if (response.length) {
                    if (response[0].connected_dealer != 0) {
                        // insertDevice = insertDevice + ", connected_dealer " + values + ",  " + response[0].connected_dealer + ")"
                    } else {
                        insertDevice = insertDevice + values + ")";
                    }
                    sql.query(insertDevice, async (err, resp) => {
                        if (err) throw (err);
                        console.log("inserted id", resp.insertId);
                        let dvc_id = resp.insertId;
                        var insertUser_acc = "INSERT INTO usr_acc (device_id, activation_code, client_id , account_email,expiry_months, dealer_id, device_status, activation_status  "
                        // var insertDevice = "INSERT INTO devices ( activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status ";
                        var User_acc_values = ") VALUES ('" + dvc_id + "', '" + activation_code + "', '" + client_id + "', '" + email + "',  " + exp_month + ", " + dealer_id + ", 0, 0 )";
                        insertUser_acc = insertUser_acc + User_acc_values;

                        if (resp.affectedRows) {
                            sql.query(insertUser_acc, async (err, resp) => {

                                if (err) throw (err);
                                let user_acc_id = resp.insertId;

                                console.log("affectedRows", resp.affectedRows);
                                if (resp.affectedRows) {
                                    let updateChatIds = 'update chat_ids set used=1, user_acc_id="' + user_acc_id + '" where chat_id ="' + chat_id + '"';
                                    await sql.query(updateChatIds);
                                    let updateSimIds = 'update sim_ids set used=1, user_acc_id="' + user_acc_id + '" where sim_id ="' + sim_id + '"';
                                    await sql.query(updateSimIds)
                                    let updatePgpEmails = 'update pgp_emails set used=1, user_acc_id="' + user_acc_id + '" where pgp_email ="' + pgp_email + '"';
                                    await sql.query(updatePgpEmails);
                                    if (policy_id !== '') {
                                        var slctpolicy = "select * from device_history where id = " + policy_id + "";
                                        policy_obj = await sql.query(slctpolicy);
                                        // console.log('policy ', policy_obj);
                                        policy_obj[0].dealer_id = dealer_id;
                                        policy_obj[0].status = 0;
                                        policy_obj[0].type = 'history';

                                        var insertQuery = "INSERT INTO device_history ( user_acc_id, app_list, setting, controls, status ) "
                                            + " VALUES('" + user_acc_id + "', '" + policy_obj[0].app_list + "', '" + policy_obj[0].setting + "', '" + policy_obj[0].controls + "', 0 ) "

                                        await sql.query(insertQuery);
                                    }

                                    var slctquery = "select * from devices where device_id = '" + device_id + "'";
                                    console.log(slctquery);
                                    rsltq = await sql.query(slctquery);

                                    sql.query("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name, dealers.connected_dealer from devices left join usr_acc on devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 and devices.device_id='" + device_id + "'", async function (error, results, fields) {

                                        if (error) throw error;
                                        console.log("user data list ", results)

                                        results[0].finalStatus = device_helpers.checkStatus(results[0])
                                        results[0].pgp_email = await device_helpers.getPgpEmails(results[0])
                                        results[0].sim_id = await device_helpers.getSimids(results[0])
                                        results[0].chat_id = await device_helpers.getChatids(results[0])

                                        // dealerData = await device_helpers.getDealerdata(results[i]);
                                        device_helpers.saveActionHistory(results[0], Constants.DEVICE_PRE_ACTIVATION)
                                        data = {
                                            "status": true,
                                            "msg": 'Record Inserted successfully.',
                                            "data": results
                                        };

                                        res.send({
                                            status: true,
                                            data: data
                                        })
                                        return;


                                    })


                                    // console.log('devices f', results);

                                } else {
                                    res.send({
                                        status: false,
                                        msg: "Device couldn't added"
                                    });
                                    return;
                                }

                            });
                        }


                    })

                } else {

                }
            });
        }

    }

});

router.post('/transfer/device_profile', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let device_id = req.body.device_id;
        console.log('device id', device_id);
        var activation_code = randomize('0', 7);
        let device_id_new = helpers.getDeviceId();
        device_id_new = await helpers.checkDeviceId(device_id_new);

        let device = Devices.findAll({
            where: {
                device_id: device_id
            }
        }).then((response, err) => {
            console.log(err, 'oject res', response[0]['dataValues']);
            let new_object = response[0]['dataValues'];
            // new_object['device_id'] = device_id_new;
            console.log('sdfa', new_object.activation_code);
            // new_object['device_status'] = 0;

            var insertDevice = "INSERT INTO transferred_profiles (device_id, activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status, ip_address,sim_id, simno, imei,sim_id2,simno2, imei2, serial_number, mac_address, s_dealer, s_dealer_name, account, fcm_token,account_status,start_date, expiry_date, link_code  ";

            var value = ") VALUES ('" + device_id_new + "', '" + activation_code + "', '" + new_object.name + "', '" + new_object.client_id + "', '" + new_object.chat_id + "', '" + new_object.model + "', '" + new_object.email + "', '" + new_object.pgp_email + "', '" + new_object.expiry_months + "', '" + new_object.dealer_id + "', 0, 0 , '" + new_object.ip_address + "', '" + new_object.sim_id + "', '" + new_object.simno + "', '" + new_object.imei + "', '" + new_object.sim_id2 + "', '" + new_object.simno2 + "', '" + new_object.imei2 + "', '" + new_object.serial_number + "', '" + new_object.mac_address + "', '" + new_object.s_dealer + "', '" + new_object.s_dealer_name + "', '" + new_object.account + "', '" + new_object.fcm_token + "', '" + new_object.account_status + "', '" + new_object.start_date + "', '" + new_object.expiry_date + "', '" + new_object.link_code + "' )";
            let query = insertDevice + value;
            // console.log('qerury', query);
            sql.query(query, async (err, resp) => {
                // console.log('query reslut response', resp)
                if (err) throw (err);
                if (resp.affectedRows) {

                    var activation_code = randomize('0', 7);
                    let device_id_new = helpers.getDeviceId();
                    device_id_new = await helpers.checkDeviceId(device_id_new);

                    let updateprevDevice = 'update devices set transfer_status=1, email=null, pgp_email=null, chat_id=null, sim_id=null where device_id ="' + device_id + '"';
                    await sql.query(updateprevDevice);

                    console.log('id', device_id);
                    let insertpreActiveD = "insert into devices (device_id, activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status)";
                    let values = "values('" + device_id_new + "', '" + activation_code + "', '" + new_object.name + "', '" + new_object.client_id + "', '" + new_object.chat_id + "', '" + new_object.model + "', '" + new_object.email + "', '" + new_object.pgp_email + "', '" + new_object.expiry_months + "', '" + new_object.dealer_id + "', 0, 0 )";
                    let query1 = insertpreActiveD + values;
                    await sql.query(query1);

                    res.send({
                        status: true,
                        data: {
                            "status": true,
                            "msg": 'Record Transfered Successfully.',
                        }
                    });
                } else {
                    res.send({
                        status: false,
                        data: {
                            "status": false,
                            "msg": 'Error While Transfere .',
                        }
                    });
                }
            })
        })
        // console.log("hello device", device);
        // if(loggedDealerType === DEALER){

        // } else if (loggedDealerType === SDEALER){

        // }

    }
});



router.put('/new/device', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;

        let device_id = req.body.device_id;
        let device_name = req.body.name;
        let device_email = req.body.email;
        let client_id = req.body.client_id;
        let model = req.body.model;
        let dealer_id = req.body.dealer_id;
        let connected_dealer = req.body.connected_dealer;
        let usr_acc_id = req.body.usr_acc_id;
        let usr_device_id = req.body.usr_device_id
        let policy_id = req.body.policy_id;

        // let s_dealer_id = req.body.s_dealer;
        // let expiray_date = req.body.expiray_date;

        let sim_id = (req.body.sim_id == undefined) ? '' : req.body.sim_id;
        let chat_id = (req.body.chat_id == undefined) ? '' : req.body.chat_id;
        let pgp_email = (req.body.pgp_email == undefined) ? '' : req.body.pgp_email;


        let start_date = req.body.start_date;

        if (req.body.expiry_date == '' || req.body.expiry_date == null || req.body.expiry_date == 0) {
            var status = 'expired';
        } else {
            var status = 'active';
        }

        let exp_month = req.body.expiry_date;
        var expiry_date = helpers.getExpDateByMonth(start_date, exp_month);

        // console.log(device_id);
        if (!empty(device_id)) {

            var checkDevice = "SELECT * from devices WHERE device_id = '" + device_id + "' ";
            let checkDealer = "SELECT * from dealers where dealer_id =" + dealer_id;
            // let checkConnectedDealer = "SELECT * from dealers where dealer_id =" + connected_dealer;

            let dealer = await sql.query(checkDealer);
            // let connected = await sql.query(checkConnectedDealer);
            if (loggedDealerType === SDEALER) {
                checkDevice = checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === DEALER) {
                checkDevice = checkDevice + " AND (dealer_id = " + loggedDealerId + " OR prnt_dlr_id = " + loggedDealerId + " )";
            }
            else if (loggedDealerType === ADMIN) {
                checkDevice = checkDevice;
            }

            else {
                res.send({
                    status: false,
                    msg: "New Device Not Added Please try Again"
                });
                return;
            }
            // console.log(checkDevice);
            sql.query(checkDevice, async function (error, rows) {
                if (rows.length) {

                    let checkUniquePgp = "SELECT pgp_email from pgp_emails WHERE (pgp_email= '" + pgp_email + "' AND used=1)";
                    let checkDevicepgp = await sql.query(checkUniquePgp);

                    let checkUnique = "SELECT usr_acc.* from usr_acc WHERE account_email= '" + device_email + "' AND device_id != '" + device_id + "'"
                    sql.query(checkUnique, async (error, success) => {
                        if (success.length || checkDevicepgp.length) {
                            res.send({
                                status: false,
                                "msg": "Account Email OR PGP Email already taken"
                            });
                        }
                        else if (dealer_id !== 0 && dealer_id !== null) {

                            if (connected_dealer !== 0) {

                                // let common_Query = "UPDATE devices set name = '" + device_name + "', email = '" + device_email + "', pgp_email='" + pgp_email + "', chat_id='" + chat_id + "', sim_id='" + sim_id + "', client_id ='" + client_id + "', model = '" + req.body.model + "'"
                                // let common_Query2 = " status = '" + status + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' where device_id = '" + device_id + "'";
                                common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'"
                                // let common_Query2 = " status = '" + status + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' where device_id = '" + device_id + "'";
                                usr_acc_Query = "UPDATE usr_acc set account_email = '" + device_email + "', status = '" + status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "', prnt_dlr_id=" + dealer_id + ", prnt_dlr_name='" + dealer[0].dealer_name + "' WHERE device_id = '" + usr_device_id + "'"
                                // 
                                // let sql1 = common_Query + ", s_dealer_name = '" + rslt1[0].dealer_name + "', s_dealer = '" + req.body.s_dealer + "'" + common_Query2;
                                // console.log("UPafet Quety", usr_acc_Query);
                            } else {

                                common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'"
                                usr_acc_Query = "UPDATE usr_acc set account_email = '" + device_email + "', status = '" + status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' WHERE device_id = '" + usr_device_id + "'"
                                // let sql1 = common_Query + ", s_dealer_name = '" + rslt1[0].dealer_name + "', s_dealer = '" + req.body.s_dealer + "'" + common_Query2;
                                // console.log("UPafet Quety", usr_acc_Query);
                            }


                            sql.query(common_Query, async function (error, result) {
                                await sql.query(usr_acc_Query)
                                let updateChatIds = 'update chat_ids set user_acc_id = ' + usr_acc_id + ', used=1 where chat_id ="' + chat_id + '"';
                                await sql.query(updateChatIds);
                                let updateSimIds = 'update sim_ids set user_acc_id = ' + usr_acc_id + ', used=1 where sim_id ="' + sim_id + '"';
                                await sql.query(updateSimIds)
                                let updatePgpEmails = 'update pgp_emails set user_acc_id = ' + usr_acc_id + ', used=1 where pgp_email ="' + pgp_email + '"';
                                await sql.query(updatePgpEmails);

                                var slctquery = "select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer , pgp_emails.pgp_email,chat_ids.chat_id ,sim_ids.sim_id from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id LEFT JOIN pgp_emails on pgp_emails.user_acc_id = usr_acc.id LEFT JOIN chat_ids on chat_ids.user_acc_id = usr_acc.id LEFT JOIN sim_ids on sim_ids.user_acc_id = usr_acc.device_id where devices.device_id = '" + device_id + "'";
                                console.log(slctquery);
                                rsltq = await sql.query(slctquery);
                                console.log(rsltq);

                                if (policy_id !== undefined && policy_id !== '' && policy_id !== null) {
                                    var slctpolicy = "select * from device_history where id = " + policy_id + "";
                                    policy_obj = await sql.query(slctpolicy);
                                    var insertQuery = "INSERT INTO device_history ( device_id, app_list, setting, controls, passwords, type, status ) "
                                        + " VALUES('" + device_id + "', '" + policy_obj[0].app_list + "', '" + policy_obj[0].setting + "', '" + policy_obj[0].controls + "', '" + policy_obj[0].passwords + "', 'history', 0 ) "

                                    await sql.query(insertQuery);
                                }
                                for (var i = 0; i < rsltq.length; i++) {
                                    rsltq[i].finalStatus = device_helpers.checkStatus(rsltq[i])
                                }

                                data = {
                                    "status": true,
                                    "msg": 'Record updated successfully.',
                                    "data": rsltq
                                };
                                res.send(data);
                                return;
                            });
                        } else {
                            res.send({
                                status: false,
                                msg: "device is not added"
                            });
                        }

                    });

                } else {

                }
            });

        } else {
            res.send({
                status: false,
                msg: "Device Not Added Try Again"
            })
        }
    }
});


/**UPDATE Devices details**/
router.put('/edit/devices', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);

    if (verify['status'] !== undefined && verify.status == true) {

        console.log('s_dealer', req.body.s_dealer);

        if (!empty(req.body.device_id)) {

            let loggedDealerId = verify.user.id;
            let loggedDealerType = verify.user.user_type;

            let device_id = req.body.device_id;
            let dealer_id = req.body.dealer_id;
            let device_name = req.body.name;
            let device_email = req.body.email;
            let client_id = req.body.client_id;
            let model = req.body.model;
            let usr_acc_id = req.body.usr_acc_id;
            let usr_device_id = req.body.usr_device_id;
            let prevPGP = req.body.prevPGP

            // let s_dealer_id = req.body.s_dealer;
            let start_date = req.body.start_date;
            // let expiray_date = req.body.expiray_date;

            let sim_id = (req.body.sim_id == undefined) ? '' : req.body.sim_id;
            let chat_id = (req.body.chat_id == undefined) ? '' : req.body.chat_id;
            let pgp_email = (req.body.pgp_email == undefined) ? '' : req.body.pgp_email;

            var d = new Date(req.body.start_date);

            if (req.body.expiry_date == '') {
                var status = 'expired';
            } else {
                var status = 'active';
            }

            let mnth2 = req.body.expiry_date;


            var expiry_date = helpers.getExpDateByMonth(req.body.start_date, mnth2);

            // console.log('month', g_months, 'year', g_years);
            console.log('date now', expiry_date);

            // let checkDealer = "SELECT * from dealers where dealer_id =" + dealer_id;

            // let dealer = await sql.query(checkDealer);

            var checkDevice = "SELECT start_date from usr_acc WHERE device_id = '" + usr_device_id + "' ";
            if (loggedDealerType === SDEALER) {
                checkDevice = checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === DEALER) {
                checkDevice = checkDevice + " AND (dealer_id = " + loggedDealerId + " OR prnt_dlr_id = " + loggedDealerId + " )";
            } else if (loggedDealerType === ADMIN) {
                checkDevice = checkDevice;
            } else {
                res.send({
                    status: false,
                    msg: ""
                });
                return;
            }
            console.log(checkDevice);
            sql.query(checkDevice, async function (error, rows) {
                if (rows.length) {
                    let checkUniquePgp = "SELECT * from pgp_emails WHERE pgp_email= '" + pgp_email + "' AND user_acc_id != '' AND user_acc_id != '" + usr_acc_id + "'"
                    // let checkUnique = "SELECT usr_acc.* from usr_acc WHERE account_email= '" + device_email + "' AND device_id != '" + device_id + "'"
                    sql.query(checkUniquePgp, async (error, success) => {
                        if (success.length) {
                            res.send({
                                status: false,
                                "msg": "PGP email already taken"
                            });
                        } else {
                            common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE device_id = '" + device_id + "'"
                            usr_acc_Query = "UPDATE usr_acc set status = '" + status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' WHERE device_id = '" + usr_device_id + "'"
                            // let sql1 = common_Query + ", s_dealer_name = '" + rslt1[0].dealer_name + "', s_dealer = '" + req.body.s_dealer + "'" + common_Query2;

                            // let sql1 = common_Query + common_Query2;
                            //console.log('empty');
                            // console.log(sql1);
                            sql.query(common_Query, async function (error, row) {
                                await sql.query(usr_acc_Query);
                                let updateChatIds = 'update chat_ids set user_acc_id = "' + usr_acc_id + '", used=1 where chat_id ="' + chat_id + '"';
                                await sql.query(updateChatIds);
                                let updateSimIds = 'update sim_ids set user_acc_id = "' + usr_acc_id + '",  used=1 where sim_id ="' + sim_id + '"';
                                await sql.query(updateSimIds)
                                let updatePgpEmails = 'update pgp_emails set user_acc_id = "' + usr_acc_id + '",  used=1 where pgp_email ="' + pgp_email + '"';
                                await sql.query(updatePgpEmails)
                                if (pgp_email !== prevPGP) {
                                    let updatePrevPgp = 'update pgp_emails set user_acc_id = null,  used=0 where pgp_email ="' + prevPGP + '"';
                                    sql.query(updatePrevPgp)
                                }


                                var slctquery = "select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.device_id = '" + device_id + "'";
                                // console.log(slctquery);
                                rsltq = await sql.query(slctquery);
                                // console.log(rsltq);
                                for (var i = 0; i < rsltq.length; i++) {
                                    rsltq[i].finalStatus = device_helpers.checkStatus(rsltq[i])
                                    rsltq[i].pgp_email = await device_helpers.getPgpEmails(rsltq[i])
                                    rsltq[i].sim_id = await device_helpers.getSimids(rsltq[i])
                                    rsltq[i].chat_id = await device_helpers.getChatids(rsltq[i])
                                    // dealerData = await device_helpers.getDealerdata(results[i]);
                                }

                                data = {
                                    "status": true,
                                    "msg": 'Record updated successfully.',
                                    "data": rsltq
                                };
                                res.send(data);
                                return;
                            });
                        }
                    });


                } else {
                    res.send({
                        status: false,
                        msg: "No Device found"
                    })
                }

            });
        } else {
            res.send({
                status: false,
                msg: ""
            })
        }
    }
});

/**Devices record delete**/
router.put('/delete/:device_id', function (req, res) {

    console.log(req.body);
    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.device_id)) {
            let userType = verify.user.user_type;
            let loggedUserId = verify.user.id;
            let where = '';
            if (userType === DEALER) {
                where = ' AND (dealer_id=' + loggedUserId + ' OR prnt_dlr_id = ' + loggedUserId + ')';
            } else if (userType === SDEALER) {
                where = ' AND (dealer_id=' + loggedUserId;
            }
            console.log("delete where ", 'DELETE FROM devices WHERE device_id ="' + [req.params.device_id])
            if (req.body.dealer_id === loggedUserId || req.body.prnt_dlr_id === loggedUserId || userType === ADMIN) {
                sql.query('UPDATE devices set reject_status = 1 WHERE device_id ="' + [req.params.device_id] + '"', async function (error, results, fields) {
                    let usr_device_id = await device_helpers.getOriginalIdByDeviceId(req.params.device_id);
                    sql.query("UPDATE usr_acc set unlink_status = 1 WHERE device_id = '" + usr_device_id + "'")
                    //response.end(JSON.stringify(rows));
                    console.log(results);
                    if (error) throw error;
                    if (results.affectedRows !== 0) {
                        data = {
                            "status": true,
                            "msg": "Device deleted successfully.",

                        };
                    } else {
                        data = {
                            "status": false,
                            "msg": "Device not deleted.",
                            "fld": fields,
                            "rdlt": results
                        };
                    }
                    res.send(data);
                });
            } else {
                data = {
                    "status": false,
                    "msg": "Device not deleted.",
                };
                res.send(data)
            }
        }
    }
});


/**UPDATE Profile details  **/
router.put('/updateProfile/:id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        console.log('body data', req.body);
        sql.query('UPDATE dealers SET `dealer_name` = ? where `dealer_id` = ?', [req.body.name, req.body.dealerId], function (error, rows, status) {

            if (error) throw error;
            if (status) {
                data = {
                    "status": false,
                    "data": req.body,
                    "msg": "Error While Updating Profile"
                };
            } else {
                data = {
                    "status": true,
                    "data": req.body,
                    "msg": "Profile Updated Successfully"
                };
            }

            console.log('success');
            res.send(data);
        });
    }
});

/***GET all the clients (not using) ***/
// router.get('/clients', function (req, res) {
//     console.log(req);
//     sql.query('select * from clients', function (error, results, fields) {
//         if (error) throw error;
//         data = {
//             "status": true,
//             "data": results
//         };
//         res.send(data);
//     });
// });

/***Add client (not using)***/
// router.post('/new/client', function (req, res) {
//     console.log(req);
//     sql.query('INSERT INTO clients (name, client_id, imei, s_dealer, start_date, expiry_date, online, status, model) values(?,?,?,?,?,?,?,?,?)', [req.body.name, req.body.client_id, req.body.imei, req.body.s_dealer, req.body.start_date, req.body.expiry_date, req.body.expiry_date, req.body.online, req.body.status, req.body.model], function (error, rows) {
//         //response.end(JSON.stringify(rows));
//         if (error) throw error;
//         data = {
//             "status": true,
//             "data": rows
//         };
//         res.send(data);
//     });
// });

/**UPDATE Client details (not using) **/
// router.put('/client/:client_id', function (req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     console.log(req);
//     sql.query('UPDATE clients SET `name` = ?, `imei` = ?, `s_dealer` = ? , `start_date` = ?, `expiry_date` = ?, `status` = ?, `model`= ? where `client_id` = ?', [req.body.name, req.body.imei, req.body.s_dealer, req.body.start_date, req.body.expiry_date, req.body.status, req.body.model, req.body.client_id], function (error, rows) {

//         if (error) throw error;
//         data = {
//             "status": true,
//             "data": rows
//         };
//         res.send(data);
//     });
// });

/**client record delete (not using) **/
// router.delete('/client/:client_id', function (req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     console.log(req);
//     sql.query('DELETE FROM `clients` WHERE `client_id`=?', [req.params.client_id], function (error, results, fields) {

//         if (error) throw error;
//         data = {
//             "status": true,
//             "data": results
//         };
//         res.send(data);
//     });
// });

/** Unlink Device  **/
router.post('/unlink/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    // console.log('unlink data ', device_id);

    if (verify.status !== undefined && verify.status == true) {
        console.log('unlinked', device_id);
        if (!empty(device_id)) {
            let query = "SELECT activation_code from usr_acc where device_id = '" + device_id + "'";
            let result = await sql.query(query);

            if (result[0].activation_code !== null) {
                var sql1 = "update usr_acc set dealer_id = null, activation_status=0, status = '' , device_status = 0 , start_date= '', expiry_date= '' , unlink_status=1 where device_id = '" + device_id + "'";
            } else {

                var sql1 = "update usr_acc set dealer_id = null, status = '' , device_status = 0 , start_date= '', expiry_date= '' , unlink_status=1 where device_id = '" + device_id + "'";
            }

            var rest = sql.query(sql1, function (error, results) {
                if (error) throw error;
                console.log(results);
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Device not unlinked."
                    }
                } else {
                    device_helpers.saveActionHistory(req.body.device, Constants.DEVICE_UNLINKED)
                    require("../bin/www").sendDeviceStatus(device_id, "unlinked", true);
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
    // console.log('dddddddd', data)
});

/** Suspend Account Devices / client **/
router.post('/suspend/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');

    if (verify.status !== undefined && verify.status == true) {
        var sql2 = "select * from usr_acc where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        if (!empty(device_id)) {

            let resDevice = null;

            if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null) {

                var sql1 = "update usr_acc set account_status='suspended' where device_id = '" + device_id + "'";

                var rest = sql.query(sql1, async function (error, results) {
                    if (error) throw error;
                    if (results.affectedRows == 0) {


                        data = {
                            "status": false,
                            "msg": "Account not suspended.Please try again."
                        }
                    } else {
                        sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                            if (error) throw error;
                            console.log('lolo else', resquery[0])

                            if (resquery.length) {
                                resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                                resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                                resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                                resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                                // dealerData = await getDealerdata(res[i]);
                                data = {
                                    "data": resquery[0],
                                    "status": true,
                                    "msg": "Account suspended successfully."
                                }
                                device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_SUSPENDED)
                                require("../bin/www").sendDeviceStatus(gtres[0].device_id, "suspended");


                                res.send(data);

                            }
                        })

                    }


                });

            } else {

                if (gtres[0].expiry_date >= formatted_dt) {

                    var sql1 = "update usr_acc set account_status='suspended' where device_id = '" + device_id + "'";

                    var rest = sql.query(sql1, async function (error, results) {
                        if (error) throw error;
                        if (results.affectedRows == 0) {

                            data = {
                                "status": false,
                                "msg": "Account not suspended.Please try again."
                            }
                        } else {

                            require("../bin/www").sendDeviceStatus(gtres[0].device_id, "suspended");

                            sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                                if (error) throw error;
                                console.log('lolo else', resquery[0])

                                if (resquery.length) {
                                    resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                                    resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                                    resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                                    resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                                    // dealerData = await getDealerdata(res[i]);
                                    data = {
                                        "data": resquery[0],
                                        "status": true,
                                        "msg": "Account suspended successfully."
                                    }
                                    device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_SUSPENDED)
                                    res.send(data);
                                }
                            })



                        }

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
router.post('/wipe/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    if (verify.status !== undefined && verify.status == true) {
        var sql2 = "select * from devices where id = '" + device_id + "'";
        var gtres = await sql.query(sql2);
        if (!empty(device_id)) {

            var sql1 = "update usr_acc set wipe_status='wipe' where device_id = '" + device_id + "'";
            console.log(sql1);
            var rest = sql.query(sql1, async function (error, results) {
                if (error) throw error;
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Device not wiped.Please try again."
                    }
                    res.send(data);
                } else {
                    require("../bin/www").sendDeviceStatus(gtres[0].device_id, "wiped");

                    sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                        if (error) throw error;
                        console.log('lolo else', resquery[0])

                        if (resquery.length) {
                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                            resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                            resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                            resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                            // dealerData = await getDealerdata(res[i]);
                            data = {
                                "data": resquery[0],
                                "status": true,
                                "msg": "Device Wiped successfully."
                            }
                            res.send(data);
                        }
                    })
                }
            });



        } else {
            data = {
                "status": false,
                "msg": "Invalid Device."
            }
            res.send(data);
        }
    }
})

router.post('/UnflagDevice/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    if (verify.status !== undefined && verify.status == true) {

        if (!empty(device_id)) {
            var sql1 = "update devices set flagged= '' where device_id='" + device_id + "'";
            var rest = sql.query(sql1, async function (error, results) {
                if (error) throw error;
                else if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Device not Unflagged.Please try again."
                    }
                    res.send(data);
                } else {
                    await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.device_id= "' + device_id + '"', async function (error, resquery, fields) {
                        if (error) throw error;
                        console.log('lolo else', resquery[0])

                        if (resquery.length) {
                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                            resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                            resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                            resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                            // dealerData = await getDealerdata(res[i]);
                            data = {
                                // "data": resquery[0],
                                "status": true,
                                "msg": "Device Unflagged successfully."
                            }
                        }
                        device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_UNFLAGGED)
                        res.send(data);
                    })

                }
            });

        }

    } else {

        data = {
            "status": false,
            "msg": "Device Is not unflagged.Please try again"
        }
        res.send(data);
    }
})

router.post('/flagDevice/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    var option = req.body.data
    console.log(option);
    if (verify.status !== undefined && verify.status == true) {
        var sql2 = "select flagged from devices where id = '" + device_id + "'";
        var gtres = await sql.query(sql2);
        if (!empty(device_id)) {

            if (gtres[0].flagged === '' || gtres[0].flagged === 'null' || gtres[0].flagged === null) {
                var sql1 = "update devices set flagged='" + option + "' where id = '" + device_id + "'";
                console.log(sql1);
                await sql.query(sql1)
                var sql1 = "update usr_acc set account_status='suspended' where device_id = '" + device_id + "'";

                let results = await sql.query(sql1)
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Device not Flagged.Please try again."
                    }
                } else {
                    require("../bin/www").sendDeviceStatus(gtres[0].device_id, "suspended");

                    let resquery = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"')
                    // console.log('lolo else', resquery)
                    // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"');
                    if (resquery.length) {
                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                        resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                        resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                        resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                        // dealerData = await getDealerdata(res[i]);
                        device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_FLAGGED)
                        // console.log(resquery[0]);
                        data = {
                            "data": resquery[0],
                            "status": true,
                            "msg": "Device Flagged successfully."
                        }

                        res.send(data);
                    }
                }

            } else {
                data = {
                    "status": false,
                    "msg": "Device Already Flagged"
                }
                res.send(data);
            }

        } else {
            data = {
                "status": false,
                "msg": "Invalid Device."
            }
            res.send(data);
        }
    }
})

/** Activate Device **/
router.post('/activate/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');

    if (verify.status !== undefined && verify.status == true) {
        var sql2 = "select * from usr_acc where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        if (!empty(device_id)) {

            if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null) {

                var sql1 = "update usr_acc set account_status='' where device_id = '" + device_id + "'";

                var rest = sql.query(sql1, function (error, results) {
                    if (error) throw error;
                    if (results.affectedRows == 0) {
                        data = {
                            "status": false,
                            "msg": "Device not activated.Please try again."
                        }
                    } else {
                        sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                            if (error) throw error;
                            console.log('lolo else', resquery[0])

                            if (resquery.length) {
                                resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                                resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                                resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                                resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                                // dealerData = await getDealerdata(res[i]);
                                require("../bin/www").sendDeviceStatus(gtres[0].device_id, "active", true);
                                data = {
                                    "data": resquery[0],
                                    "status": true,
                                    "msg": "Device activated successfully."
                                }
                                device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_ACTIVATED)
                                res.send(data);

                            }
                        })

                    }

                });

            } else {

                if (gtres[0].expiry_date > formatted_dt) {

                    var sql1 = "update usr_acc set account_status='' where device_id = '" + device_id + "'";

                    var rest = sql.query(sql1, function (error, results) {
                        if (error) throw error;
                        if (results.affectedRows == 0) {
                            data = {
                                "status": false,
                                "msg": "Device not activated.Please try again."
                            }
                        } else {
                            sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                                if (error) throw error;
                                console.log('lolo else', resquery[0])

                                if (resquery.length) {
                                    resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                                    resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                                    resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                                    resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                                    // dealerData = await getDealerdata(res[i]);
                                    require("../bin/www").sendDeviceStatus(gtres[0].device_id, "active", true);
                                    data = {
                                        "data": resquery[0],
                                        "status": true,
                                        "msg": "Device activated successfully."
                                    }
                                    device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_ACTIVATED)
                                    res.send(data);

                                }
                            })

                        }

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



/** Reset password dealers (Admin Panel) **/
router.post('/resetpwd', async function (req, res) {

    var verify = verifyToken(req, res);
    var isReset = false;
    if (verify.status !== undefined && verify.status == true) {
        console.log('body data');
        console.log(req.body);
        var user = verify.user;
        if (req.body.pageName != undefined && req.body.pageName != "") {
            console.log('user type', user.user_type);
            if (user.user_type === ADMIN || user.user_type === DEALER) {
                var newpwd = generator.generate({
                    length: 10,
                    numbers: true
                });
                isReset = true;
                var query = "SELECT password FROM dealers WHERE dealer_id=" + req.body.dealer_id + " limit 1";
                var rslt = await sql.query(query);
                var curntPassword = rslt[0].password;
                console.log(curntPassword, 'password');
            }
        } else {

            if (req.body.newpwd != undefined) {
                var newpwd = req.body.newpwd;
                var curntPassword = md5(req.body.curntpwd);
            }
        }
        // console.log("new password " + newpwd);
        var email = req.body.dealer_email;
        var dealer_id = req.body.dealer_id;
        var enc_pwd = md5(newpwd); // encryted pwd


        if (!empty(email) && !empty(newpwd) && !empty(dealer_id)) {

            var query = "SELECT link_code from dealers where dealer_id=" + dealer_id + " AND password='" + curntPassword + "' limit 1";
            console.log(query);

            var result = await sql.query(query);
            if (result.length) {
                // console.log('error');
                if (isReset) {
                    var subject = "Password Reset";
                    var message = 'Your login details are : <br> Email : ' + email + '<br> Password : ' + newpwd + '<br> Dealer id : ' + dealer_id + '<br> Dealer Pin : ' + result[0].link_code + '.<br> Below is the link to login : <br> http://www.lockmesh.com <br>';
                } else {
                    var subject = "Password Change";
                    var message = 'You have changed your password in your Lockmesh.com account. <br><br> This is just to inform you about the activity. If it was not you, please immediately contact your provider to reset the password.';
                }

                sendEmail(subject, message, email, function (errors, response) {
                    if (errors) {
                        res.send("Email could not sent due to error: " + errors);
                    } else {

                        var sq = "update dealers set password = '" + enc_pwd + "' where dealer_id = '" + dealer_id + "'";
                        sql.query(sq, function (error, rows) {


                            if (error) throw error;

                            if (rows.affectedRows == 0) {
                                console.log('false');
                                data = {
                                    "status": false,
                                    "data": rows
                                };
                                res.send(data);
                            } else {
                                console.log('success');
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
                console.log('reslult', result);
                data = {
                    "status": false,
                    "msg": 'Invalid User and Password'
                };
                res.send(data);
            }


        } else {

            res.json({
                status: false,
                "msg": "Invalid details"
            });
        }
    }

});

/** Edit Dealer (Admin panel) **/

router.put('/edit/dealers', async function (req, res) {
    var verify = verifyToken(req, res);
    var name = req.body.name;
    var email = req.body.email;
    var dealer_id = req.body.dealer_id;
    var setFields = "";
    var alreadyAvailable = false;
    var mailgiven = false;

    if (verify.status !== undefined && verify.status == true) {
        if (!empty(dealer_id) && (!empty(name) || !empty(email))) {
            if (!empty(email) && email != '' && email != null) {
                mailgiven = true;
                let checkMail = await sql.query("select dealer_id from dealers where dealer_email='" + email + "' and dealer_id !=" + dealer_id);
                // console.log("select dealer_id from dealers where dealer_email='" + email +"' and dealer_id !="+ dealer_id);
                if (checkMail.length) {
                    alreadyAvailable = true;
                }
                setFields = setFields + "dealer_email='" + email + "' ";
            }

            if (!empty(name) && name != '' && name != null) {
                if (mailgiven == true && alreadyAvailable == false) {
                    setFields = setFields + ", dealer_name='" + name + "'";
                } else {
                    setFields = " dealer_name='" + name + "'";

                }
            }
            var query = "UPDATE dealers set " + setFields + " where dealer_id = " + dealer_id + "";
            // var query = "UPDATE dealers set dealer_name = '" + req.body.name + "' , dealer_email = '" + req.body.email + "' where dealer_id = " + dealer_id + "";

            // console.log(query);

            sql.query(query, function (error, row) {

                if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": 'Record updated successfully.',
                        "data": row,
                        "alreadyAvailable": alreadyAvailable
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

router.post('/dealer/delete/', function (req, res) {

    var verify = verifyToken(req, res);
    var dealer_id = req.body.dealer_id;

    if (verify.status !== undefined && verify.status == true) {
        console.log('dealer_id', dealer_id);
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
                console.log('data', data);

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
    let dealer_id = req.body.dealer_id;

    console.log('user statur', verify.status);

    if (verify.status !== undefined && verify.status == true) {
        console.log('id', dealer_id);
        if (!empty(dealer_id)) {
            console.log('dealer_id');
            console.log(dealer_id);
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
                } else if (row.affectedRows != 0) {
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
    var dealer_id = req.body.dealer_id;

    if (verify.status !== undefined && verify.status == true) {
        console.log('dealer_id', dealer_id);
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
                } else if (row.affectedRows != 0) {
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
                console.log('status', data)
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



/** Get all S Dealers of Dealers**/
router.get('/sdealers/:dealer_id', function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
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
    var dealer_id = req.body.dealer_id;

    if (verify.status !== undefined && verify.status == true) {
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
router.get('/connect/:device_id', async function (req, res) {
    console.log('api check is caled')
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.device_id)) {
            let userId = verify.user.id;
            // console.log("userId", userId);
            //  console.log(verify.user);
            let usertype = await helpers.getUserType(userId);
            let where = "devices.device_id = '" + req.params.device_id + "'";

            if (usertype != "admin") {
                where = where + " and (usr_acc.dealer_id=" + userId + " OR usr_acc.prnt_dlr_id = " + userId + ")";
            }
            // console.log("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id where " + where);
            await sql.query("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id where " + where, async function (error, results) {

                if (error) throw error;
                // console.log('rslt done', results);
                if (results.length == 0) {
                    _data = {
                        "status": false,
                        "msg": "No details found"
                    };
                } else {
                    var query = "select * from dealers where dealer_id =" + results[0].dealer_id;
                    let dealer_details = await sql.query(query);
                    device_data = {
                        "name": results[0].name,
                        "account_email": results[0].account_email,
                        "device_id": results[0].device_id,
                        "client_id": results[0].client_id,
                        // "pgp_email": results[0].pgp_email,
                        // "chat_id": results[0].chat_id,
                        "simno2": results[0].simno2,
                        "imei2": results[0].imei2,
                        "dealer_id": results[0].dealer_id,
                        "model": results[0].model,
                        "imei": results[0].imei,
                        "mac_address": results[0].mac_address,
                        // "sim_id": results[0].sim_id,
                        "simno": results[0].simno,
                        "serial_number": results[0].serial_number,
                        "ip_address": results[0].ip_address,
                        "s_dealer": results[0].s_dealer,
                        "s_dealer_name": results[0].s_dealer_name,
                        "status": results[0].status,
                        "account_status": results[0].account_status,
                        "device_status": results[0].device_status,
                        "activation_status": results[0].activation_status,
                        "activation_code": results[0].activation_code,
                        "serial_number": results[0].serial_number,
                        "online": results[0].online,
                        "device_name": results[0].name,
                        // "start_date": datetime.create(results[0].start_date).format('m-d-Y'),
                        // "expiry_date": datetime.create(results[0].expiry_date).format('m-d-Y'),
                        "start_date": results[0].start_date,
                        "expiry_date": results[0].expiry_date,
                        "online": results[0].online,
                        "is_sync": results[0].is_sync,
                        "flagged": results[0].flagged,
                        'unlink_status': results[0].unlink_status,
                        'usr_device_id': results[0].usr_device_id,
                        'id': results[0].id
                    };
                    device_data.finalStatus = device_helpers.checkStatus(results[0]);
                    device_data.pgp_email = await device_helpers.getPgpEmails(results[0]);
                    device_data.sim_id = await device_helpers.getSimids(results[0]);
                    device_data.chat_id = await device_helpers.getChatids(results[0]);

                    if (dealer_details.length) {
                        device_data.link_code = dealer_details[0].link_code;
                        device_data.dealer_name = dealer_details[0].dealer_name;
                    } else {
                        device_data.link_code = 0;
                        device_data.dealer_name = "";
                    }

                    _data = {
                        "status": true,
                        "msg": "success",
                        "data": device_data
                    };
                }


                //  console.log('data is ', data)

                res.send(_data);
            });
        } else {
            _data = {
                "status": false,
                "msg": "Device not found"
            };
        }
        res.send(_data);
    }
});

/** Get logged in Dealer permitted apps  **/
router.get('/get_dealer_apps', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let loggedUserId = verify.user.id;
        let loggedUserType = verify.user.user_type;

        let getAppsQ = "SELECT * FROM apk_details ";
        if (loggedUserType !== Constants.ADMIN) {
            getAppsQ = getAppsQ + " JOIN dealer_apks on (dealer_apks.apk_id = apk_details.id) WHERE dealer_apks.dealer_id =" + loggedUserId;
        }
        let apps = await sql.query(getAppsQ);

        if (apps.length > 0) {
            let data = []
            for (var i = 0; i < apps.length; i++) {
                // let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : '[]';
                // let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                // let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                dta = {
                    "apk_id": apps[i].id,
                    "apk_name": apps[i].app_name,
                    "logo": apps[i].logo,
                    "apk": apps[i].apk,
                    // "permissions": permissions,
                    // "permission_count": permissionC,
                    "apk_status": apps[i].status,
                    "deleteable": (apps[i].apk_type == "permanent") ? false : true
                }
                data.push(dta);
            }

            return res.json({
                status: true,
                success: true,
                list: data
            });

        } else {
            data = {
                status: false,
                msg: "No result found",
                list: []
            }
            res.send(data);
        }
    }
});

router.get('/get_usr_acc_id/:device_id', async function (req, res) {
    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        //console.log('id is the ', req.params);
        let query = "select usr_acc.id from usr_acc left join devices on devices.id=usr_acc.device_id where devices.device_id='" + req.params.device_id + "'";

        await sql.query(query, async (error, rslt) => {
            // console.log(query, 'rslt id ', rslt)
            res.send({
                status: true,
                user_acount_id: rslt[0].id,
            });
        })
    }
})

/** Get Device Details of Dealers (Connect Page) **/
router.get('/get_apps/:device_id', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.device_id)) {
            // var query = 'SELECT user_apps.*, apps_info.label, apps_info.unique_name as uniqueName, apps_info.icon as icon from user_apps LEFT JOIN apps_info on user_apps.app_id = apps_info.id LEFT JOIN devices on user_apps.device_id=devices.id where devices.device_id ="' + req.params.device_id + '"';
            // console.log(query);
            var getAppsQ = "SELECT user_apps.id, user_apps.device_id, user_apps.app_id, user_apps.guest, user_apps.encrypted, user_apps.`enable`, " +
            " apps_info.label, apps_info.unique_name as uniqueName, apps_info.icon as icon , apps_info.extension, apps_info.extension_id" + 
            " FROM user_apps" +
            " LEFT JOIN apps_info on user_apps.app_id = apps_info.id" + 
            " LEFT JOIN devices on user_apps.device_id=devices.id" + 
            " WHERE devices.device_id = '"+ req.params.device_id +"'"
            // console.log("hello", getAppsQ);
            try {
                sql.query(getAppsQ, async (error, apps) => {
                    if (error) {
                        throw Error("Query Expection");
                    }
                    // console.log("apps length" + apps.length);
                    var query1 = 'SELECT * from user_app_permissions';
                    // where device_id ="' + req.params.device_id + '"

                    sql.query(query1, async (error, controls) => {
                        if (error) {
                            throw Error("Query Expection");
                        }
                        if (controls.length > 0) {
                            // console.log("geting device app");

                            res.send({
                                status: true,
                                app_list: apps,
                                controls: JSON.parse(controls[0].permissions)
                            });
                        } else {
                            res.send({
                                status: true,
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

router.get('default_apps', function (req, res) {
    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        var query = 'SELECT apps_info.label, apps_info.unique_name as uniqueName, apps_info.icon as icon from default_apps as apps_info ';
        // console.log(query);
        sql.query(query, async (error, apps) => {
            if (error) {
                throw Error("Query Expection");
            }

            res.send({
                status: true,
                app_list: apps,

            });

        });

    }
})


router.put('/deleteUnlinkDevice', async function (req, res) {
    try {
        var verify = verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let insertError = 0;
            let NotDeleted = [];
            let deletedDevices = [];

            //  console.log('data for delte ', req.body.devices);
            for (let device of req.body.devices) {
                let statusChangeQuery = "UPDATE usr_acc SET del_status='" + 1 + "' WHERE device_id='" + device.usr_device_id + "'";
                console.log(statusChangeQuery);
                console.log('devie is ', device);
                let resp = await sql.query(statusChangeQuery)

                console.log('response query is', resp);
                if (resp.affectedRows) {
                    deletedDevices.push(device.usr_device_id);
                    console.log('status Updated');
                    await device_helpers.saveActionHistory(device, Constants.UNLINK_DEVICE_DELETE);

                }
                else {
                    insertError += 1;
                    NotDeleted.push(device.device_id)
                }
            }
            console.log('eror', insertError);
            console.log('delte degicve', deletedDevices);
            if (insertError === 0) {
                data = {
                    'status': true,
                    'msg': 'Deleted Successfully',
                    'data': deletedDevices
                }
                res.send(data);
            }
            else {

                data = {
                    'status': false,
                    'msg': NotDeleted.toString() + ' Not Deleted, Try Again!'
                }
                res.send(data);
            }
        }


    } catch (error) {
        throw Error(error.message);
    }
})



router.post('/apply_settings/:device_id', async function (req, res) {
    try {
        var verify = verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let device_id = req.params.device_id;

            let type = req.body.type;
            let name = req.body.name;
            let dealer_id = verify.user.id;
            let usr_acc_id = req.body.usr_acc_id;

            let app_list = (req.body.device_setting.app_list == undefined) ? '' : JSON.stringify(req.body.device_setting.app_list);
            // console.log("controls: " + app_list);

            let passwords = (req.body.device_setting.passwords == undefined) ? '' : JSON.stringify(req.body.device_setting.passwords);
            // console.log("controls: " + passwords);

            let controls = (req.body.device_setting.controls == undefined) ? '' : JSON.stringify(req.body.device_setting.controls);
            // console.log("controls: " + controls);

            if (type == "profile" || type == "policy") device_id = '';
            if (type == "history") {
                name = '';
                dealer_id = 0;
            }

            if (type === 'profile') {
                console.log('action type', type);
                var query = "select id from usr_acc_profile where profile_name = '" + name + "'";
                let result = await sql.query(query);

                if (result.length == 0 || name == '') {
                    var applyQuery = "insert into usr_acc_profile (profile_name, user_acc_id, app_list, setting, controls,passwords, type) values ('" + name + "', " + usr_acc_id + ",'" + app_list + "', null, '" + controls + "', '" + passwords + "', '" + type + "')";
                    // console.log('query insert', applyQuery);
                    // console.log(applyQuery);

                    await sql.query(applyQuery, async function (err, rslts) {

                        // if (type == "history") {
                        //     let isOnline = await device_helpers.isDeviceOnline(device_id);
                        //     // console.log("isOnline: " + isOnline);
                        //     if (isOnline) {
                        //         require("../bin/www").sendEmit(app_list, passwords, controls, device_id);
                        //     }
                        // }

                        data = {
                            "status": true,
                            "msg": 'Setting Applied Successfully',
                            "data": rslts
                        };
                        res.send(data);
                    });

                } else {
                    data = {
                        "status": false,
                        "msg": 'Profile Name is already Exist',
                    };
                    res.send(data);
                }
            } else if (type === 'policy') {
                console.log('action type polocy', type);
                var query = "select id from policy where policy_name = '" + name + "'";
                let result = await sql.query(query);

                if (result.length == 0 || name == '') {
                    var applyQuery = "insert into policy (policy_name, app_list, setting, controls,passwords) values ('" + name + "','" + app_list + "', null, '" + controls + "', '" + passwords + "')";
                    console.log('query insert', applyQuery);
                    // console.log(applyQuery);

                    await sql.query(applyQuery, async function (err, rslts) {
                        if (err) throw err;
                        // if (type == "history") {
                        //     let isOnline = await device_helpers.isDeviceOnline(device_id);
                        //     // console.log("isOnline: " + isOnline);
                        //     if (isOnline) {
                        //         require("../bin/www").sendEmit(app_list, passwords, controls, device_id);
                        //     }
                        // }
                        console.log('resluts id ', rslts);
                        if (rslts.affectedRows) {
                            data = {
                                "status": true,
                                "msg": 'Policy Saved Successfully',
                                "data": rslts
                            };
                            res.send(data);
                        }

                    });
                } else {
                    data = {
                        "status": false,
                        "msg": 'Policy Name is already Exist',
                    };
                    res.send(data);
                }
            } else if (type === 'history') {

                var applyQuery = "insert into device_history (user_acc_id, app_list, setting, controls) values ('" + usr_acc_id + "','" + app_list + "', null, '" + controls + "')";
                //  console.log('query insert', applyQuery);
                console.log(applyQuery);
                await sql.query(applyQuery, async function (err, rslts) {

                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    // console.log("isOnline: " + isOnline);
                    if (isOnline) {
                        require("../bin/www").sendEmit(app_list, passwords, controls, device_id);
                    }

                    if (rslts.affectedRows) {
                        data = {
                            "status": true,
                            "msg": 'Settings Applied Successfully',
                        };
                        res.send(data);
                    } else {
                        data = {
                            "status": false,
                            "msg": 'Error while Proccessing',
                        };
                        res.send(data);
                    }

                });
            }
        }
    } catch (error) {
        throw Error(error.message);
    }

});



router.post('/get_profiles', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status === true) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);
        // console.log('user id si', user_acc_id);
        let where = "where";
        let isValid = true;
        // console.log('d_id', user_acc_id);
        if (user_acc_id != undefined && user_acc_id != '' && user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

        } else {
            where = "";
        }

        if (isValid) {
            let query = "SELECT * FROM usr_acc_profile " + where;

            // console.log("getprofiles query", query);
            sql.query(query, (error, result) => {
                //  console.log('profile',result)
                data = {
                    "status": true,
                    "msg": 'successful',
                    "profiles": result
                };
                res.send(data);
            });

        } else {
            data = {
                "status": false,
                "msg": 'Invalid User'
            };
            res.send(data);
        }
    }

});

router.post('/get_policies', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status === true) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);
        //   console.log('user id si', user_acc_id);
        let where = "where";
        let isValid = true;
        // console.log('d_id', user_acc_id);
        if (user_acc_id != undefined && user_acc_id != '' && user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

        } else {
            where = "";
        }

        if (isValid) {
            let query = "SELECT * FROM policy ";
            sql.query(query, (error, result) => {
                //  console.log(query,'policy',result)
                data = {
                    "status": true,
                    "msg": 'successful',
                    "policies": result
                };
                res.send(data);
            });

        } else {
            data = {
                "status": false,
                "msg": 'Invalid User'
            };
            res.send(data);
        }
    }

});

router.post('/get_device_history', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status === true) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);
        // console.log('user id si', user_acc_id);
        let where = "where";
        let isValid = true;
        // console.log('d_id', user_acc_id);
        if (user_acc_id != undefined && user_acc_id != '' && user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

        } else {
            where = "";
        }
        // if (userType != ADMIN) {
        //     if (userType == DEALER) {
        //         where = where + " AND ((type='profile' AND dealer_id=" + userId + ") OR type='policy')";
        //     } else {
        //         let connected_dealer = verify.user.connected_dealer;
        //         if (connected_dealer != undefined && connected_dealer != '' && connected_dealer != null && connected_dealer != 0) {
        //             where = where + " AND ((type='profile' AND dealer_id=" + connected_dealer + ") OR type='policy')";
        //         } else {
        //             isValid = false;
        //         }
        //     }
        // }
        // console.log(where);
        if (isValid) {
            let query = "SELECT * FROM device_history " + where;
            // console.log("getprofiles query", query);
            sql.query(query, (error, result) => {
                data = {
                    "status": true,
                    "msg": 'successful',
                    "profiles": result
                };
                res.send(data);
            });

        } else {
            data = {
                "status": false,
                "msg": 'Invalid User'
            };
            res.send(data);
        }
    }

});

// router.post('/get_profiles', async function (req, res) {
//     var verify = verifyToken(req, res);
//     if (verify.status === true) {
//         let userId = verify.user.id;
//         let userType = await helpers.getUserType(userId);
//         let profileType = "";
//         let where = "";
//         let isValid = true;
// // console.log('d_id', req.body.device_id);
//         if (req.body.device_id != undefined && req.body.device_id != '' && req.body.device_id != null) {
//             profileType = "history";
//             where = where + " user_acc_id='" + req.body.device_id + "' AND type= '" + profileType + "' ";

//         } else {
//             where = where + " type!='history' ";
//         }

//         if (userType != ADMIN) {
//             if (userType == DEALER) {
//                 where = where + " AND ((type='profile' AND dealer_id=" + userId + ") OR type='policy')";
//             } else {
//                 let connected_dealer = verify.user.connected_dealer;
//                 if (connected_dealer != undefined && connected_dealer != '' && connected_dealer != null && connected_dealer != 0) {
//                     where = where + " AND ((type='profile' AND dealer_id=" + connected_dealer + ") OR type='policy')";
//                 } else {
//                     isValid = false;
//                 }
//             }
//         }
//         // console.log(where);
//         if (isValid) {
//             let query = "SELECT * FROM device_history where " + where;
//             console.log("getprofiles query", query);
//             sql.query(query, (error, result) => {
//                 console.log("now reslt", result);
//                 data = {
//                     "status": true,
//                     "msg": 'successful',
//                     "profiles": result
//                 };
//                 res.send(data);
//             });

//         } else {
//             data = {
//                 "status": false,
//                 "msg": 'Invalid User'
//             };
//             res.send(data);
//         }
//     }

// });

/** Save Dropdown Items Dealers/Sub Dealers **/
router.post('/dealer/dropdown', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var selected_items = req.body.selected_items;
        var dropdownType = req.body.pageName;
        var dealer_id = verify.user.id;
        var squery = "select * from dealer_dropdown_list where dealer_id = " + dealer_id + " AND type ='" + dropdownType + "'";
        // console.log('query', squery);
        var srslt = await sql.query(squery);
        // console.log('query result', srslt);

        if (srslt.length == 0) {
            var squery = sql.query("insert into dealer_dropdown_list (dealer_id, selected_items, type) values (" + dealer_id + ", '" + selected_items + "', '" + dropdownType + "')", function (err, rslts) {
                data = {
                    "status": true,
                    "msg": 'Items Added.',
                    "data": rslts
                };
                res.send(data);
            });
        } else {

            sql.query("update dealer_dropdown_list set selected_items = '" + selected_items + "' where type='" + dropdownType + "' AND dealer_id='" + dealer_id + "'", function (err, row) {
                // console.log('squery data ', 'rowws', row);
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

router.post('/dealer/postPagination', async function (req, res) {
    console.log("Working")
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        console.log(verify.status, "verify")
        var selectedValue = req.body.selectedValue;
        var dropdownType = req.body.pageName;
        var dealer_id = verify.user.id;
        var squery = "select * from dealer_pagination where dealer_id = " + dealer_id + " AND type ='" + dropdownType + "'";
        // console.log('query', squery);
        var srslt = await sql.query(squery);
        // console.log('query result', srslt);

        if (srslt.length == 0) {
            var squery = sql.query("insert into dealer_pagination (dealer_id, record_per_page, type) values (" + dealer_id + ", '" + selectedValue + "', '" + dropdownType + "')", function (err, rslts) {
                data = {
                    "status": true,
                    "msg": 'record Added.',
                    "data": rslts
                };
                res.send(data);
            });
        } else {

            sql.query("update dealer_pagination set record_per_page = '" + selectedValue + "' where type='" + dropdownType + "' AND dealer_id='" + dealer_id + "'", function (err, row) {
                // console.log('squery data ', 'rowws', row);
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

router.get('/dealer/getPagination/:dropdownType', async function (req, res) {
    var verify = verifyToken(req, res);
    // console.log('done or not');
    if (verify.status !== undefined && verify.status == true) {
        // console.log('data from req', req.params.dropdownType);
        let dealer_id = verify.user.id;
        let dropdownType = req.params.dropdownType;
        sql.query("select record_per_page from dealer_pagination where dealer_id = " + dealer_id + " AND type = '" + dropdownType + "'", function (err, rslts) {
            if (err) {
                throw (err);
            }

            if (rslts.length == 0) {
                data = {
                    "status": false,
                    "msg": "No data found",
                    "data": '10'
                };
                res.send(data);
            } else {

                data = {
                    "status": true,
                    "data": rslts[0].record_per_page

                };
                res.send(data);

            }
        });
    }
});

/** Get Dropdown Selected Items **/
router.get('/dealer/gtdropdown/:dropdownType', async function (req, res) {
    var verify = verifyToken(req, res);
    // console.log('done or not');
    if (verify.status !== undefined && verify.status == true) {
        // console.log('data from req', req.params.dropdownType);
        let dealer_id = verify.user.id;
        let dropdownType = req.params.dropdownType;
        sql.query("select * from dealer_dropdown_list where dealer_id = " + dealer_id + " AND type = '" + dropdownType + "'", function (err, rslts) {
            if (err) {
                throw (err);
            }

            if (rslts.length == 0) {
                data = {
                    "status": false,
                    "msg": "No data found",
                    "data": '[]'
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
                        "msg": "No data found",
                        "data": '[]'
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
    if (verify.status !== undefined && verify.status == true) {
        var getinfo = "select * from dealers where dealer_id='" + verify.user.id + "'";

        sql.query(getinfo, async function (err, rows) {
            if (verify.user.user_type != 'sdealer') {
                data = {
                    "status": true,
                    "dealer_id": rows[0].dealer_id,
                    "dealer_name": rows[0].dealer_name,
                    "dealer_email": rows[0].dealer_email,
                    "link_code": rows[0].link_code
                }
            } else {
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
            }
            res.send(data);
        });

    }
});

/** Save Dropdown Items Admin **/
router.post('/admin/dropdown', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
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
    if (verify.status !== undefined && verify.status == true) {
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

// import sims
router.post('/import/:fieldName', async (req, res) => {
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        res.setHeader('Content-Type', 'multipart/form-data');
        let filename = '';
        let fieldName = req.params.fieldName;

        // console.log("filename sdflks",req.params.fieldName);
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads');
            },
            filename: function (req, file, callback) {
                var ext = file.originalname.split(".");
                // console.log("ext", ext.length)
                // console.log("mimetype ", file.mimetype);
                if ((
                    file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                    file.mimetype === "text/csv" ||
                    file.mimetype === "application/vnd.ms-excel"
                ) && ext.length === 2) {
                    filename = file.originalname;
                    callback(null, file.originalname);
                } else {
                    callback("file is not supported");
                }

            }
        });

        var upload = multer({
            storage: storage,
            // fileFilter: fileFilter,
        }).fields([{
            name: "sim_ids",
            maxCount: 1
        }, {
            name: "chat_ids",
            maxCount: 1
        }, {
            name: "pgp_emails",
            maxCount: 1
        }]);

        upload(req, res, function (err) {
            console.log("error", err);
            if (err) {
                res.send({
                    "status": false,
                    "msg": err
                });
                return;
            } else {
                console.log("success file name", filename);
                var workbook = XLSX.readFile('uploads/' + filename);

                workbook.SheetNames.forEach(async (sheet) => {
                    let singleSheet = workbook.Sheets[sheet];
                    let parsedData = XLSX.utils.sheet_to_json(singleSheet, {
                        raw: true
                    });
                    if (fieldName == "sim_ids") {
                        let error = false;
                        parsedData.forEach(async (row) => {
                            if (row.sim_id && row.start_date && row.expiry_date) {
                                let result = await sql.query("INSERT IGNORE sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
                                console.log(result);
                            } else {
                                error = true;
                            }

                        })

                        if (!error) {
                            res.send({
                                "status": true,
                                "msg": "imported successfully",
                                "data": []
                            });
                        } else {
                            res.send({
                                "status": true,
                                "msg": "File contained invalid data that has been ignored, rest has been imported successfully.",
                                "data": []
                            });
                        }

                        return;
                    } else if (fieldName === "chat_ids") {
                        let error = false;
                        parsedData.forEach(async (row) => {
                            if (row.chat_id) {

                                let result = await sql.query("INSERT IGNORE into chat_ids (chat_id) value ('" + row.chat_id + "')");
                                console.log(result);
                            } else {
                                error = true;
                            }

                        })

                        if (!error) {
                            res.send({
                                "status": true,
                                "msg": "imported successfully",
                                "data": []
                            });
                        } else {
                            res.send({
                                "status": true,
                                "msg": "File contained invalid data that has been ignored, rest has been imported successfully.",
                                "data": []
                            });
                        }

                        return;
                    } else if (fieldName === "pgp_emails") {
                        let error = false;
                        parsedData.forEach(async (row) => {
                            if (row.pgp_email) {
                                let email = helpers.validateEmail(row.pgp_email);
                                if (email) {
                                    let result = await sql.query("INSERT IGNORE into pgp_emails (pgp_email) value ('" + row.pgp_email + "')");
                                    console.log(result);
                                }

                            } else {
                                error = true;
                            }


                        })

                        if (!error) {
                            res.send({
                                "status": true,
                                "msg": "imported successfully",
                                "data": []
                            });
                        } else {
                            res.send({
                                "status": true,
                                "msg": "File contained invalid data that has been ignored, rest has been imported successfully.",
                                "data": []
                            });
                        }

                        return;
                    }

                });

            }
        });
    }
});

router.get('/export/:fieldName', async (req, res) => {
    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        console.log("exporting data");
        let fieldName = req.params.fieldName;
        if (verify.user.user_type === ADMIN) {
            let query = '';
            if (fieldName === "sim_ids") {
                query = "SELECT * FROM sim_ids where used = 0";
            } else if (fieldName === "chat_ids") {
                query = "SELECT * FROM chat_ids where used = 0"
            } else if (fieldName === "pgp_emails") {
                query = "SELECT * FROM pgp_emails where used = 0";
            }
            sql.query(query, async (error, response) => {
                if (error) throw error;
                if (response.length) {
                    var data = [];

                    if (fieldName === "sim_ids") {
                        response.forEach((sim_id) => {
                            data.push({
                                sim_id: sim_id.sim_id,
                                start_date: sim_id.start_date,
                                expiry_date: sim_id.expiry_date
                            });
                        });
                    } else if (fieldName === "chat_ids") {
                        response.forEach((chat_id) => {
                            data.push({
                                chat_id: chat_id.chat_id,
                            });
                        });
                    } else if (fieldName === "pgp_emails") {
                        response.forEach((pgp_email) => {
                            data.push({
                                pgp_email: pgp_email.pgp_email,
                            });
                        });
                    }

                    /* this line is only needed if you are not adding a script tag reference */

                    if (data.length) {
                        /* make the worksheet */
                        var ws = XLSX.utils.json_to_sheet(data);

                        /* add to workbook */
                        var wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "People");

                        /* generate an XLSX file */
                        let fileName = fieldName + '_' + Date.now() + ".xlsx";
                        await XLSX.writeFile(wb, path.join(__dirname, "../uploads/" + fileName));

                        res.send({
                            path: fileName,
                            status: true
                        });
                    } else {
                        res.send({
                            status: false,
                            msg: "no data to import"
                        })
                    }

                }
            })
        } else {
            res.send({
                status: false,
                msg: "access forbidden"
            })
        }
    }
});

router.get('/get_sim_ids', async (req, res) => {
    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from sim_ids where used=0";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    }
});


router.get('/get_chat_ids', async (req, res) => {
    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from chat_ids where used=0";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    }
});

router.get('/get_pgp_emails', async (req, res) => {
    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from pgp_emails where used=0";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    }
});
// upload test apk

router.post('/addApk', function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = verifyToken(req, res);
    //  console.log('verify', verify.status);
    let fileUploaded = false;

    let filename = "";
    if (verify.status !== undefined && verify.status == true) {
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads');
            },

            filename: function (req, file, callback) {
                let mimetype = file.mimetype;
                console.log("mimetype", mimetype);
                
                if (file.fieldname == "logo") {
                    fileUploaded = true;
                    filename = file.fieldname + '-' + Date.now() + '.jpg';
                    callback(null, file.fieldname + '-' + Date.now() + '.jpg');
                } else if (file.fieldname === "apk" && mimetype === "application/vnd.android.package-archive") {
                    fileUploaded = true;
                    filename = file.fieldname + '-' + Date.now() + '.apk';
                    callback(null, file.fieldname + '-' + Date.now() + '.apk');
                } else {
                    callback("file not supported");
                }
            }
        });
        
        var upload = multer({
            storage: storage,
            limits: { fileSize: "50mb" }
        }).fields([{
            name: 'logo',
            maxCount: 1
        }, {
            name: 'apk',
            maxCount: 1
        }]);

        upload(req, res, function (err) {
            if (err) {
                return res.end("Error while Uploading");
            } 

            if (fileUploaded) {
                data = {
                    "status": true,
                    "msg": 'Uploaded Successfully',
                    "fileName": filename
                };
            } else {
                data = {
                    "status": false,
                    "msg": "Error while Uploading",
                };
            }
            
            res.send(data);

        });
    }
});

router.post('/upload', function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = verifyToken(req, res);

    if (verify.status == true) {
        console.log('form data');
        console.log(req.body);
        if (req.body.logo !== '' && req.body.apk !== '' && req.body.name !== '') {
            sql.query("insert into apk_details (app_name,logo,apk,created) values ('" + req.body.name + "' , '" + req.body.logo + "' , '" + req.body.apk + "', NOW())", function (err, rslts) {

                if (err) throw err;
                data = {
                    "status": true,
                    "msg": "Apk is uploaded"

                };
                res.send(data);
            });
        } else {
            data = {
                "status": false,
                "msg": "Error While Uploading"
            };
            res.send(data);
        }
    }
});


/** Get Apk List Admin Panel **/

router.get('/apklist', async function (req, res) {
    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        sql.query("select * from apk_details where delete_status=0 order by id ASC", async function (error, results) {
            if (error) throw error;

            var data = [];
            if (results.length > 0) {
                let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                let dealerCount = await helpers.dealerCount(adminRoleId);
                console.log("dealer count", dealerCount)
                for (var i = 0; i < results.length; i++) {
                    let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
                    let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                    let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                    dta = {
                        "apk_id": results[i].id,
                        "apk_name": results[i].app_name,
                        "logo": results[i].logo,
                        "apk": results[i].apk,
                        "permissions": permissions,
                        "apk_status": results[i].status,
                        "permission_count": permissionC,
                        "deleteable": (results[i].apk_type == "permanent") ? false : true
                    }
                    data.push(dta);
                }

                return res.json({
                    status: true,
                    success: true,
                    list: data
                });

            } else {
                data = {
                    status: false,
                    msg: "No result found",
                    list: []
                }
                res.send(data);
            }

        });

    }
});

/** Save Permissions**/
router.post('/save_permissions', async function (req, res) {
    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        let apkId = req.body.apkId;
        let dealers = req.body.dealers;
        let updateAPKQ = "UPDATE apk_details set dealers = '" + dealers + "' WHERE id=" + apkId;

        let parsedDealers = JSON.parse(dealers);
        if (parsedDealers.length) {
            let deleteNotIn = "DELETE FROM dealer_apks WHERE dealer_id NOT IN (" + parsedDealers.join() + ") AND apk_id = " + apkId;
            // console.log(deleteNotIn);
            await sql.query(deleteNotIn);
            let insertQuery = "INSERT IGNORE INTO dealer_apks (dealer_id, apk_id) VALUES ";

            let insertOrIgnore = ' '
            for (let i = 0; i < parsedDealers.length; i++) {
                if (i === parsedDealers.length - 1) {
                    insertOrIgnore = insertOrIgnore + "(" + parsedDealers[i] + "," + apkId + ")"
                } else {
                    insertOrIgnore = insertOrIgnore + "(" + parsedDealers[i] + "," + apkId + "),"
                }
            }
            await sql.query(insertQuery + insertOrIgnore);
            // console.log(insertQuery + insertOrIgnore);
        }

        sql.query(updateAPKQ, async (error, result) => {
            if (error) throw (error);
            let permissionC = [];
            let rslt = await sql.query("select dealers from apk_details where id='" + apkId + "' order by id ASC")
            if (rslt.length) {
                console.log(rslt, ' do ti ');
                if (rslt !== undefined && rslt !== null) {
                    let permission = JSON.parse(rslt[0].dealers);

                    if (permission !== undefined && permission !== null && permission !== '[]') {
                        let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                        let dealerCount = await helpers.dealerCount(adminRoleId);
                        permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();

                    }
                }

                ;

            }
            if (result.affectedRows) {
                res.send({
                    status: true,
                    msg: "Permission saved successfully",
                    permission_count: permissionC,
                })
            } else {
                res.send({
                    status: false,
                    msg: "Permission couldn't be saved"
                })
            }
        });
    }
})

/** Toggle Apk Admin Panel (On / Off) **/

router.post('/toggle', function (req, res) {
    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {

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


/** Get image logo **/
router.get("/getFile/:file", (req, res) => {

    if (fs.existsSync(path.join(__dirname, "../uploads/" + req.params.file))) {
        // Do something
        res.sendFile(path.join(__dirname, "../uploads/" + req.params.file));
    } else {
        res.send({
            "status": false,
            "msg": "file not found"
        })
    }

});


/** Edit Apk (Admin panel) **/
router.post('/edit/apk', function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        sql.query("update apk_details set app_name = '" + req.body.name + "', logo = '" + req.body.logo + "', apk = '" + req.body.apk + "', modified = NOW() where id = '" + req.body.apk_id + "'", function (err, rslts) {

            if (err) throw err;
            data = {
                "status": true,
                "msg": "Record Updated"

            };
            res.send(data);
        });
    }

});




// router.post('/edit/apk', function (req, res) {
//     res.setHeader('Content-Type', 'multipart/form-data');
//     var verify = verifyToken(req, res);

//     if (verify.status == true) {
//         var storage = multer.diskStorage({
//             destination: function (req, file, callback) {
//                 callback(null, './uploads');
//             },
//             filename: function (req, file, callback) {
//                 if (file.fieldname == "logo") {
//                     callback(null, file.fieldname + '-' + Date.now() + '.jpg');
//                 }
//                 if (file.fieldname == "apk") {

//                     callback(null, file.fieldname + '-' + Date.now() + '.apk');
//                 }

//             }
//         });

//         var upload = multer({ storage: storage }).fields([{ name: 'logo', maxCount: 1 }, { name: 'apk', maxCount: 1 }]);

//         upload(req, res, function (err) {

//             if (err) {
//                 return res.end("Error uploading file.");
//             } else {


//                 var fname = req.files.logo;
//                 var faname = req.files.apk;


//                 sql.query("update apk_details set app_name = '" + req.body.name + "', logo = '" + fname[0].filename + "', apk = '" + faname[0].filename + "', modified = NOW() where id = '" + req.body.apk_id + "'", function (err, rslts) {

//                     if (err) throw err;
//                     data = {
//                         "status": true,
//                         "msg": "Record Updated"

//                     };
//                     res.send(data);
//                 });
//             }
//         });
//     }

// });


/**Delete Apk**/
router.post('/apk/delete', function (req, res) {

    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.body.apk_id)) {

            sql.query("update `apk_details` set delete_status='1' WHERE id='" + req.body.apk_id + "'", async function (error, results) {
                console.log(results);

                if (error) throw error;
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Apk not deleted.",
                        "rdlt": results
                    };
                } else {
                    let deletedRecord = "SELECT * FROM apk_details where id=" + req.body.apk_id + " and delete_status='1'";
                    let result = await sql.query(deletedRecord);
                    if (result.length) {

                        data = {
                            "status": true,
                            "msg": "Apk deleted successfully.",
                            "apk": result[0]
                        };
                    } else {
                        data = {
                            "status": false,
                            "msg": "Apk not deleted.",
                            "rdlt": results
                        };
                    }

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

    if (verify.status !== undefined && verify.status == true) {
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

// check prviouse password
router.post('/check_pass', async function (req, res) {
    console.log(req.body);
    var verify = verifyToken(req, res);
    if (verify.status) {
        let pwd = md5(req.body.user.password);

        let query_res = await sql.query("select * from dealers where dealer_id=" + verify.user.id + " and password='" + pwd + "'");
        if (query_res.length) {
            res.send({
                "password_matched": true
            });
            return;
        }
    }
    data = {
        "password_matched": false
    }
    res.send(data);
});

/** Cron for expiry date **/
cron.schedule('0 0 0 * * *', async () => {
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y/m/d');
    var userAccQ = "select * from usr_acc where device_status = 1";
    var results = await sql.query(userAccQ);

    for (var i = 0; i < results.length; i++) {

        if (formatted_dt >= results[i].expiry_date) {
            var updateUsrAcc = "update usr_acc set status = 'expired' where device_id ='" + results[i].device_id + "'";

            sql.query(updateUsrAcc, function (error, results) {
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