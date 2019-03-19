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

var helpers = require('../helper/general_helper.js');
const device_helpers = require('../helper/device_helpers.js');
const UserApps = require('../models/UserApps');
const Devices = require('../models/Devices');

const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";

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
/* GET users listing. */
router.get('/', function (req, res, next) {
    // let query = "UPDATE user_apps set guest=0 WHERE id = 5037";
    let result = UserApps.findAll().then((result) => {
        res.send(result);
    });
    // console.log(result);
    // res.send(result);
    // let result =
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
                        "account_status": users[0].account_status,
                        "user_type": userType,
                        "created": users[0].created,
                        "modified": users[0].modified,
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



router.get('/test', async function (req, res) {
    var componentAllowed = await helpers.isAllowedComponent(1, 155);
    console.log(componentAllowed);
    res.send({
        status: true,
        allowed: componentAllowed
    });
});

router.get('/get_allowed_components', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {


        // const user = {
        //     "id": users[0].dealer_id,
        //     "dealer_id": users[0].dealer_id,
        //     "email": users[0].dealer_email,
        //     "lastName": users[0].last_name,
        //     "name": users[0].dealer_name,
        //     "firstName": users[0].first_name,
        //     "dealer_name": users[0].dealer_name,
        //     "dealer_email": users[0].dealer_email,
        //     "link_code": users[0].link_code,
        //     "connected_dealer": users[0].connected_dealer,
        //     "account_status": users[0].account_status,
        //     "user_type": userType,
        //     "created": users[0].created,
        //     "modified": users[0].modified,
        // }
        // var result = await helpers.isAllowedComponentByName(componentName, userId);

        // res.send({
        //     status:true,
        //     componentAllowed:result
        // });

    }
});


router.post('/check_component', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var componentUri = req.body.ComponentUri;
        var userId = verify.user.id;
        var result = await helpers.isAllowedComponentByUri(componentUri, userId);
        res.send({
            status: true,
            ComponentAllowed: result
        });

    }
});

/** is_admin **/

router.get('/get_user', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    try {
        if (verify['status'] !== undefined && verify.status == true) {

            var userId = verify.user.id;

            let query = "select * from dealers where dealer_id =" + userId;
            let user = await sql.query(query);

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
                    "account_status": user[0].account_status,
                    "user_type": verify.user.user_type,
                    "created": user[0].created,
                    "modified": user[0].modified,
                }

                res.json({
                    'status': true,
                    'msg': '',
                    user: usr
                });
            } else {
                res.send({
                    status: false,
                    msg: "authentication failed"
                });
            }
            // var result = await helpers.isAllowedComponentByName(componentName, userId);

        }
    } catch (error) {
        console.log(error);
    }
});


/**GET all the devices**/
router.get('/devices', function (req, res) {
    var verify = verifyToken(req, res);
    var where_con = '';

    if (verify.status !== undefined && verify.status == true) {
        if (verify.user.user_type !== 'admin') {
            if (verify.user.user_type === 'dealer') {
                where_con = 'WHERE dvc.dealer_id =' + verify.user.id + ' OR dvc.connected_dealer =' + verify.user.id;
            } else {

                where_con = 'WHERE dvc.dealer_id = ' + verify.user.id + ' ';
            }
        }
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


/**GET New the devices**/
router.get('/new/devices', function (req, res) {
    var verify = verifyToken(req, res);
    var where_con = '';

    if (verify.status !== undefined && verify.status == true) {
        if (verify.user.user_type !== 'admin') {
            if (verify.user.user_type === 'dealer') {
                console.log('done of dealer', verify.user.id)
                where_con = 'AND (dvc.dealer_id =' + verify.user.id + ' OR dvc.connected_dealer =' + verify.user.id + ')';
            } else {
                where_con = 'AND dvc.dealer_id = ' + verify.user.id + ' ';
            }
        }
        sql.query('select dvc.* , dl.link_code , dl.dealer_name from devices as dvc left join dealers as dl on dvc.dealer_id = dl.dealer_id WHERE (dvc.device_status=0 AND dvc.unlink_status=0) AND (dvc.account_status = "" OR dvc.account_status=null)' + where_con + ' order by dvc.id DESC', function (error, results, fields) {
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

        if (userType == 'sdealer' || (userType == 'dealer' && pageType == 'dealer')) {
            data = {
                "status": false,
                "msg": "invalid operation",
            }
            res.send(data);
        }
        let sdealerDealerId = 0;

        if (userType == 'admin' && pageType == 'sdealer') {
            sdealerDealerId = req.body.dealerId;
        } else if (userType == 'dealer' && pageType == 'sdealer') {
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

                var html = 'Your login details are : <br> ' +
                    'Email : ' + dealerEmail + '<br> ' +
                    'Password : ' + dealer_pwd + '<br> ' +
                    'Dealer id : ' + rows.insertId + '<br> ' +
                    'Dealer Pin : ' + link_code + '.<br> ' +
                    'Below is the link to login : <br> http://www.lockmesh.com <br>';
                console.log(html);
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


/*Get all dealers*/
router.get('/dealers/:pageName', async function (req, res) {
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        console.log("userType: " + verify.user.user_type);
        let where = "";

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
                    var get_connected_devices = await sql.query("select count(*) as total from devices where dealer_id='" + results[i].dealer_id + "'");

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


/***Add devices (not using) ***/
router.post('/create/device_profile', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var activation_code = randomize('0', 7);
        let device_id =  helpers.getDeviceId();
        device_id = await helpers.checkDeviceId(device_id);
        console.log("device_id", device_id);
        var name =req.body.name;
        var client_id =req.body.client_id;
        var chat_id =req.body.chat_id;
        var model =req.body.model;
        var email = req.body.email 
        var pgp_email = req.body.pgp_email;
        var start_date =req.body.start_date; 
        var exp_month = req.body.expiry_date;
        var dealer_id = verify.user.dealer_id;
        var sim_id = req.body.sim_id;
        var loggedUserId = verify.user.id;
        var loggedUserType = verify.user.type;
        let policy_id = req.body.policy_id;
        if(loggedUserType === ADMIN){
        //    dealer_id= req.body.dealer_id;
        }
        let checkUnique = "SELECT * from devices WHERE (email= '" + email + "' OR pgp_email='" + pgp_email + "')";
        let checkDevice = await sql.query(checkUnique);
        if(checkDevice.length){
            res.send({
                status: false,
                msg: "Account email or PGP email already taken"
            });
            return;
        }else{
            var checkDealer = "SELECT * FROM dealers WHERE dealer_id = " + dealer_id;
            
            var insertDevice = "INSERT INTO devices (device_id, activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status ";
            
            var values = ") VALUES ('"+ device_id +"', '"+ activation_code +"', '"+ name +"', '"+ client_id +"', '"+ chat_id +"', '"+ model +"', '"+ email+"', '"+ pgp_email +"', "+ exp_month +", "+ dealer_id+", 0, 0 ";
            
            sql.query(checkDealer, async (error, response) => {
                if(error) throw (error);

                if(response.length){
                    if(response[0].connected_dealer != 0){
                        insertDevice = insertDevice + ", connected_dealer " + values + ",  "+ response[0].connected_dealer +")"
                    } else {
                        insertDevice = insertDevice + values + ")";
                    }
                    sql.query(insertDevice, async (err, resp)=>{
                        if(err) throw (err);
                        
                        console.log("affectedRows", resp.affectedRows);
                        if(resp.affectedRows){
                            let updateChatIds = 'update chat_ids set used=1 where chat_id ="' + chat_id + '"';
                            await sql.query(updateChatIds);
                            let updateSimIds = 'update sim_ids set used=1 where sim_id ="' + sim_id + '"';
                            await sql.query(updateSimIds)
                            let updatePgpEmails = 'update pgp_emails set used=1 where pgp_email ="' + pgp_email + '"';
                            await sql.query(updatePgpEmails);
                            if(policy_id !== '')
                            {
                                var slctpolicy = "select * from device_history where id = '" + policy_id + "'";
                                policy_obj = await sql.query(slctpolicy);
                               // console.log('policy ', policy_obj);
                                policy_obj[0].dealer_id = dealer_id;
                                policy_obj[0].status = 0;
                                policy_obj[0].type = 'history';
    
                                var insertQuery = "INSERT INTO device_history (name, device_id, app_list, setting, controls, passwords, type, status ) "
                                               + " VALUES('"+policy_obj[0].name+"', '"+device_id+"', '"+policy_obj[0].app_list+"', '"+policy_obj[0].setting+"', '"+policy_obj[0].controls+"', '"+policy_obj[0].passwords+"', 'history', 0 ) "
    
                                 await sql.query(insertQuery);
                            }

                            var slctquery = "select * from devices where device_id = '" + device_id + "'";
                            console.log(slctquery);
                            rsltq = await sql.query(slctquery);
                           

                          //  console.log(rsltq);
    
                            data = {
                                "status": true,
                                "msg": 'Record Inserted successfully.',
                                "data": rsltq
                            };

                            res.send({
                                status: true,
                                data: data
                            })
                            return;
                        } else {
                            res.send({
                                status: false,
                                msg: "Device couldn't added"
                            });
                            return;
                        }

                    });

                } else {

                }
            });
        }
        
    }
});

router.post('/transfer/device_profile', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var verify = verifyToken(req, res);
    if(verify['status'] !== undefined && verify.status === true) {
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let device_id = req.body.device_id;
        var activation_code = randomize('0', 7);

        let device = Devices.findAll({
            where: {
              device_id: device_id
            }
        });
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
        

        if (!empty(device_id)) {

            var checkDevice = "SELECT * from devices WHERE device_id = '" + device_id + "' ";
            let checkDealer = "SELECT * from dealers where dealer_id =" + dealer_id;

            // let checkConnectedDealer = "SELECT * from dealers where dealer_id =" + connected_dealer;

            let dealer = await sql.query(checkDealer);
            // let connected = await sql.query(checkConnectedDealer);
            if (loggedDealerType === SDEALER) {
                checkDevice = checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === DEALER) {
                checkDevice = checkDevice + " AND (dealer_id = " + loggedDealerId + " OR connected_dealer = " + loggedDealerId + " )";
            } else if (loggedDealerType === ADMIN) {

            } else {
                res.send({
                    status: false,
                    msg: ""
                });
                return;
            }
            sql.query(checkDevice, async function (error, rows) {
                if(rows.length){
                    let checkUnique = "SELECT * from devices WHERE (email= '" + device_email + "' OR pgp_email='" + pgp_email + "') AND device_id != '"+ device_id +"'"
                    sql.query(checkUnique, async (error, success)=>{
                        if(success.length){
                            res.send({
                                status:false,
                                "msg": "Account Email or PGP email already taken"
                            });
                        }else if(dealer_id!==0){
                            
                            if(connected_dealer!==0){
                                
                                let common_Query = "UPDATE devices set name = '" + device_name + "', email = '" + device_email + "', pgp_email='" + pgp_email + "', chat_id='" + chat_id + "', sim_id='" + sim_id + "', client_id ='" + client_id + "', model = '" + req.body.model + "'"
                                let common_Query2 = " status = '" + status + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' where device_id = '" + device_id + "'";
                                // 
                                // let sql1 = common_Query + ", s_dealer_name = '" + rslt1[0].dealer_name + "', s_dealer = '" + req.body.s_dealer + "'" + common_Query2;
                                sql1 = common_Query + ", s_dealer="+ dealer_id +", s_dealer_name='" + dealer[0].dealer_name + "' " + common_Query2;
                            }else{

                                let common_Query = "UPDATE devices set name = '" + device_name + "', email = '" + device_email + "', pgp_email='" + pgp_email + "', chat_id='" + chat_id + "', sim_id='" + sim_id + "', client_id ='" + client_id + "', model = '" + req.body.model + "'"
                                let common_Query2 = " status = '" + status + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' where device_id = '" + device_id + "'";
                                // 
                                // let sql1 = common_Query + ", s_dealer_name = '" + rslt1[0].dealer_name + "', s_dealer = '" + req.body.s_dealer + "'" + common_Query2;
                                sql1 = common_Query + ", " + common_Query2;
                            }
                           
                        
                            sql.query(sql1, async function (error, result) {
                                let updateChatIds = 'update chat_ids set used=1 where chat_id ="' + chat_id + '"';
                                await sql.query(updateChatIds);
                                let updateSimIds = 'update sim_ids set used=1 where sim_id ="' + sim_id + '"';
                                await sql.query(updateSimIds)
                                let updatePgpEmails = 'update pgp_emails set used=1 where pgp_email ="' + pgp_email + '"';
                                await sql.query(updatePgpEmails);

                                var slctquery = "select * from devices where device_id = '" + device_id + "'";
                                console.log(slctquery);
                                rsltq = await sql.query(slctquery);
                                console.log(rsltq);
        
                                data = {
                                    "status": true,
                                    "msg": 'Record updated successfully.',
                                    "data": rsltq
                                };
                                res.send(data);
                                return;
                            });
                        }else {
                            res.send({
                                status: false,
                                msg: "device is not added"
                            });
                        }

                    });

                } else {
                    
                }
            });

        }else{
            res.send({
                status: false,
                msg: ""
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
            var mnth = d.getMonth() + 1 + mnth2;


            if (mnth > 12) {
                var years = Math.floor(mnth / 12);
                var dump = ((mnth / 12) - years) + 0.01
                var months = Math.floor(dump * 12);
                console.log(months, 'month for');
                console.log(dump, 'dump for');
            } else {
                var months = mnth;
                var years = 0;
            }

            if (months < 10) {
                months = '0' + months;
            }

            console.log('now months is ', months);
            var days = req.body.start_date.split("/");

            var g_years = d.getFullYear();

            var expiry_date = (g_years + years) + '/' + months + '/' + days[2]

            // console.log('month', g_months, 'year', g_years);
            console.log('date now', expiry_date);

            // let checkDealer = "SELECT * from dealers where dealer_id =" + dealer_id;

            // let dealer = await sql.query(checkDealer);

            var checkDevice = "SELECT start_date from devices WHERE device_id = '" + device_id + "' ";
            if (loggedDealerType === SDEALER) {
                checkDevice = checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === DEALER) {
                checkDevice = checkDevice + " AND (dealer_id = " + loggedDealerId + " OR connected_dealer = " + loggedDealerId + " )";
            } else if (loggedDealerType === ADMIN) {

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
                    let checkUnique = "SELECT * from devices WHERE (email= '" + device_email + "' OR pgp_email='" + pgp_email + "') AND device_id != '"+ device_id +"'"
                    sql.query(checkUnique, async (error, success)=>{
                        if(success.length){
                            res.send({
                                status:false,
                                "msg": "Account Email or PGP email already taken"
                            });
                        } else {
                            let common_Query = "UPDATE devices set name = '" + device_name + "', email = '" + device_email + "', pgp_email='" + pgp_email + "',  chat_id='" + chat_id + "', sim_id='" + sim_id + "', client_id ='" + client_id + "', model = '" + model + "'"
                            let common_Query2 = ", status = '" + status + "', expiry_date = '" + expiry_date + "' where device_id = '" + device_id + "'";
        
                            let sql1 = common_Query + common_Query2;
                            //console.log('empty');
                            console.log(sql1);
                            sql.query(sql1, async function (error, row) {
                                let updateChatIds = 'update chat_ids set used=1 where chat_id ="' + chat_id + '"';
                                await sql.query(updateChatIds);
                                let updateSimIds = 'update sim_ids set used=1 where sim_id ="' + sim_id + '"';
                                await sql.query(updateSimIds)
                                let updatePgpEmails = 'update pgp_emails set used=1 where pgp_email ="' + pgp_email + '"';
                                await sql.query(updatePgpEmails);
                                
                                var slctquery = "select * from devices where device_id = '" + device_id + "'";
                                console.log(slctquery);
                                rsltq = await sql.query(slctquery);
                                console.log(rsltq);
        
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
router.delete('/delete/:device_id', function (req, res) {

    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.device_id)) {
            let userType = verify.user.user_type;
            let loggedUserId = verify.user.id;
            let where = '';
            if (userType === DEALER) {
                where = ' AND (dealer_id=' + loggedUserId + ' OR connected_dealer = ' + loggedUserId + ')';
            } else if (userType === SDEALER) {
                where = ' AND (dealer_id=' + loggedUserId;
            }
            console.log("delete where ", 'DELETE FROM devices WHERE device_id ="' + [req.params.device_id] + '" ' + where);
            sql.query('DELETE FROM devices WHERE device_id ="' + [req.params.device_id] + '" ' + where, function (error, results, fields) {
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


/**UPDATE Profile details  **/
router.put('/updateProfile/:id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        console.log('body data', req.body);
        sql.query('UPDATE dealers SET `first_name` = ?, `last_name` = ? where `dealer_id` = ?', [req.body.first_name, req.body.last_name, req.body.dealerId], function (error, rows, status) {

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
router.post('/unlink/:id', function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;

    if (verify.status !== undefined && verify.status == true) {
        console.log('unlinked');
        if (!empty(device_id)) {
            var sql1 = "update devices set dealer_id = 0, s_dealer = '' , status = '' , online = 'off' , device_status = 0 , start_date= '', expiry_date= '' , unlink_status=1 where device_id = '" + device_id + "'";

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
});

/** Suspend Account Devices / client **/
router.post('/suspend/:id', async function (req, res) {
    var verify = verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');


    if (verify.status !== undefined && verify.status == true) {
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
                        console.log('successfully suspended');
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

    if (verify.status !== undefined && verify.status == true) {
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
                var subject = "Password Change";
                if (isReset) {
                    var message = 'Your login details are : <br> Email : ' + email + '<br> Password : ' + newpwd + '<br> Dealer id : ' + dealer_id + '<br> Dealer Pin : ' + result[0].link_code + '.<br> Below is the link to login : <br> http://www.lockmesh.com <br>';
                } else {
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
    var verify = verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.device_id)) {
            let userId = verify.user.id;
            console.log("userId", userId);
            console.log(verify.user);
            let usertype = await helpers.getUserType(userId);
            let where = "device_id = '" + req.params.device_id + "'";

            if (usertype != "admin") {
                where = where + " and dealer_id=" + userId;
            }
            console.log("where: " + where);
            sql.query("select * from devices where " + where, async function (error, results) {
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
                        "name": results[0].name,
                        "email": results[0].email,
                        "device_id": results[0].device_id,
                        "client_id": results[0].client_id,
                        "pgp_email": results[0].pgp_email,
                        "chat_id": results[0].chat_id,
                        "simno2": results[0].simno2,
                        "imei2": results[0].imei2,
                        "dealer_id": results[0].dealer_id,
                        "model": results[0].model,
                        "imei": results[0].imei,
                        "mac_address": results[0].mac_address,
                        "sim_id": results[0].sim_id,
                        "simno": results[0].simno,
                        "serial_number": results[0].serial_number,
                        "ip_address": results[0].ip_address,
                        "s_dealer": results[0].s_dealer,
                        "s_dealer_name": results[0].s_dealer_name,
                        "status": results[0].status,
                        "account_status": results[0].account_status,
                        // "start_date": datetime.create(results[0].start_date).format('m-d-Y'),
                        // "expiry_date": datetime.create(results[0].expiry_date).format('m-d-Y'),
                        "start_date": results[0].start_date,
                        "expiry_date": results[0].expiry_date,
                        "online": results[0].online,
                        "is_sync": results[0].is_sync,
                        'unlink_status': results[0].unlink_status,
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
    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.device_id)) {
            var query = 'SELECT user_apps.*, apps_info.label, apps_info.unique_name as uniqueName, apps_info.icon as icon from user_apps LEFT JOIN apps_info on user_apps.app_id = apps_info.id LEFT JOIN devices on user_apps.device_id=devices.id where devices.device_id ="' + req.params.device_id + '"';
            // console.log(query);
            try {
                sql.query(query, async (error, apps) => {
                    if (error) {
                        throw Error("Query Expection");
                    }
                    // console.log("apps length" + apps.length);
                    var query1 = 'SELECT * from tbl_device_settings where device_id ="' + req.params.device_id + '" limit 1';


                    sql.query(query1, async (error, controls) => {
                        if (error) {
                            throw Error("Query Expection");
                        }
                        if (controls.length > 0) {
                            // console.log("geting device app");

                            res.send({
                                status: true,
                                app_list: apps,
                                controls: JSON.parse(controls[0].settings)
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


router.post('/apply_settings/:device_id', async function (req, res) {
    try {
        var verify = verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let device_id = req.params.device_id;
            let type = req.body.type;
            let name = req.body.name;
            let dealer_id = verify.user.id;

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

            var query = "select id from device_history where name = '" + name + "'";
            let result = await sql.query(query);

            if (result.length == 0 || name == '') {
                var applyQuery = "insert into device_history (name, dealer_id, device_id, app_list, setting, controls,passwords, type) values ('" + name + "', " + dealer_id + ", '" + device_id + "', '" + app_list + "', null, '" + controls + "', '" + passwords + "', '" + type + "')";

                // console.log(applyQuery);

                await sql.query(applyQuery, async function (err, rslts) {

                    if (type == "history") {
                        let isOnline = await device_helpers.isDeviceOnline(device_id);
                        // console.log("isOnline: " + isOnline);
                        if (isOnline) {
                            require("../bin/www").sendEmit(app_list, passwords, controls, device_id);
                        }
                    }

                    data = {
                        "status": true,
                        "msg": 'Setting Applied Successfully',
                        "data": rslts
                    };
                    res.send(data);
                });
            } else {
                data = {
                    "status": true,
                    "msg": 'Settings are not applied',
                };
                res.send(data);
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
        let profileType = "";
        let where = "";
        let isValid = true;

        if (req.body.device_id != undefined && req.body.device_id != '' && req.body.device_id != null) {
            profileType = "history";
            where = where + " device_id='" + req.body.device_id + "' AND type= '" + profileType + "' ";

        } else {
            where = where + " type!='history' ";
        }

        if (userType != ADMIN) {
            if (userType == DEALER) {
                where = where + " AND ((type='profile' AND dealer_id=" + userId + ") OR type='policy')";
            } else {
                let connected_dealer = verify.user.connected_dealer;
                if (connected_dealer != undefined && connected_dealer != '' && connected_dealer != null && connected_dealer != 0) {
                    where = where + " AND ((type='profile' AND dealer_id=" + connected_dealer + ") OR type='policy')";
                } else {
                    isValid = false;
                }
            }
        }
        // console.log(where);
        if (isValid) {
            let query = "SELECT * FROM device_history where " + where;
            console.log("getprofiles query",query);
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
                                let result = await sql.query("INSERT IGNORE into pgp_emails (pgp_email) value ('" + row.pgp_email + "')");

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
                    }

                });

            }
        });
    }
});

router.get('/export/:fieldName', async (req, res) => { 
    var verify = verifyToken(req, res);
    if(verify['status'] !==undefined && verify.status === true){
        console.log("exporting data");
        let fieldName = req.params.fieldName;
        if(verify.user.user_type === ADMIN){
            let query = '';
            if(fieldName === "sim_ids"){
                query = "SELECT * FROM sim_ids where used = 0";
            } else if (fieldName === "chat_ids"){
                query = "SELECT * FROM chat_ids where used = 0"
            } else if (fieldName === "pgp_emails"){
                query = "SELECT * FROM pgp_emails where used = 0";
            }
            sql.query(query, async (error, response) => {
                if(error) throw error;
                if(response.length){
                    var data = [];

                    if(fieldName === "sim_ids"){
                        response.forEach((sim_id) => {
                            data.push({
                                sim_id: sim_id.sim_id,
                                start_date: sim_id.start_date,
                                expiry_date: sim_id.expiry_date
                            });
                        });
                    } else if (fieldName === "chat_ids"){
                        response.forEach((chat_id) => {
                            data.push({
                                chat_id: chat_id.chat_id,
                            });
                        });
                    } else if (fieldName === "pgp_emails"){
                        response.forEach((pgp_email) => {
                            data.push({
                                pgp_email: pgp_email.pgp_email,
                            });
                        });
                    }
                    
                    /* this line is only needed if you are not adding a script tag reference */
                    
                    if(data.length){
                        /* make the worksheet */
                        var ws = XLSX.utils.json_to_sheet(data);
                        
                        /* add to workbook */
                        var wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "People");
                        
                        /* generate an XLSX file */
                        let fileName = fieldName + '_' + Date.now() + ".xlsx";
                        await XLSX.writeFile(wb,path.join(__dirname, "../uploads/" + fileName));
    
                        res.send({
                            path:fileName,
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
                status : false,
                msg : "access forbidden"
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
    let filename = "";
    if (verify.status !== undefined && verify.status == true) {
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads');
            },
            filename: function (req, file, callback) {


                console.log("file.fieldname", file.fieldname);
                if (file.fieldname == "logo") {
                    filename = file.fieldname + '-' + Date.now() + '.jpg';
                    callback(null, file.fieldname + '-' + Date.now() + '.jpg');
                }

                if (file.fieldname == "apk") {
                    filename = file.fieldname + '-' + Date.now() + '.apk';
                    callback(null, file.fieldname + '-' + Date.now() + '.apk');
                }
                console.log('file name', filename)

            }
        });
        let fileUploaded = false;

        var fileFilter = function (req, file, callback) {
            var filetypes = /jpeg|jpg|apk|png/;
            if (file.mimetype === 'application/vnd.android.package-archive') {
                var mimetype = false;
                var ext = file.originalname.split(".");
                console.log('ext', ext);
                if (ext.length === 2) {
                    var mimetype = true
                    console.log('apk length', ext.length);
                }

            } else {
                var mimetype = filetypes.test(file.mimetype);
                var ext = file.originalname.split(".");
                console.log('ext', ext);
                if (mimetype) {
                    if (ext.length === 2) {
                        mimetype = true
                        console.log('logo length', ext.length);
                    } else {
                        mimetype = false;
                    }
                }

            }

            var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            console.log('mim');
            console.log(file.mimetype);
            console.log('extname');
            console.log(extname);
            console.log("here");
            if (mimetype && extname) {
                console.log("validated");
                fileUploaded = true;
                return callback(null, true);

            }
            callback("Error: File upload only supports the following filetypes - " + filetypes);
        }

        var upload = multer({
            fileFilter: fileFilter,
            storage: storage
        }).fields([{
            name: 'logo',
            maxCount: 1
        }, {
            name: 'apk',
            maxCount: 1
        }]);

        upload(req, res, function (err) {
            console.log("error", err);
            console.log("fileUploaded:" + fileUploaded);
            if (err) {
                return res.end("Error while Uploading");
            } else {

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

            }
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

/** Upload Apk Admin Panel **/
// router.post('/upload', function (req, res) {
//     res.setHeader('Content-Type', 'multipart/form-data');

//     var verify = verifyToken(req, res);

//     if (verify.status == true) {
//         var storage = multer.diskStorage({
//             destination: function (req, file, callback) {
//                 callback(null, './uploads');
//             },
//             filename: function (req, file, callback) {
//                 console.log("file.fieldname", file.filename);
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


//                 sql.query("insert into apk_details (app_name,logo,apk,created) values ('" + req.body.name + "' , '" + fname[0].filename + "' , '" + faname[0].filename + "', NOW())", function (err, rslts) {

//                     if (err) throw err;
//                     data = {
//                         "status": true,
//                         "msg": "Apk is uploaded"

//                     };
//                     res.send(data);
//                 });
//             }
//         });
//     }
// });


/** Get Apk List Admin Panel **/

router.get('/apklist', function (req, res) {
    var verify = verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        sql.query("select * from apk_details where delete_status='0' order by id ASC", function (error, results) {
            if (error) throw error;

            var data = [];
            if (results.length > 0) {

                for (var i = 0; i < results.length; i++) {

                    dta = {
                        "apk_id": results[i].id,
                        "apk_name": results[i].app_name,
                        "logo": results[i].logo,
                        "apk": results[i].apk,
                        "apk_status": results[i].status,
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
    var verify = verifyToken(req, res);
    if (verify.status) {
        let pwd = md5(req.body.password);

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