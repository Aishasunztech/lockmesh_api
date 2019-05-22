var express = require('express');
var router = express.Router();
var generator = require('generate-password');
var md5 = require('md5');
const sql = require('../helper/sql.js');
const bcrypt = require('bcrypt');
var empty = require('is-empty');
var datetime = require('node-datetime');
var cron = require('node-cron');
//var uniqid = require('uniqid');
var jwt = require('jsonwebtoken');
var randomize = require('randomatic');
var multer = require('multer');
var config = require('../helper/config.js');

var XLSX = require('xlsx');
const url = require('url');
var path = require('path');
var fs = require("fs");
var Constants = require('../constants/Application');
var moment = require('moment-strftime');
var mime = require('mime');

var helpers = require('../helper/general_helper.js');
const device_helpers = require('../helper/device_helpers.js');
// const UserApps = require('../models/UserApps');
// const Devices = require('../models/Devices');

const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no"
let deviceColumns = ["DEVICE ID", "USER ID", "REMAINING DAYS", "FLAGGED", "STATUS", "MODE", "DEVICE NAME", "ACTIVATION CODE", "ACCOUNT EMAIL", "PGP EMAIL", "CHAT ID", "CLIENT ID", "DEALER ID", "DEALER PIN", "MAC ADDRESS", "SIM ID", "IMEI 1", "SIM 1", "IMEI 2", "SIM 2", "SERIAL NUMBER", "MODEL", "START DATE", "EXPIRY DATE", "DEALER NAME", "S-DEALER", "S-DEALER NAME"]
let dealerColumns = ["DEALER ID", "DEALER NAME", "DEALER EMAIL", "DEALER PIN", "DEVICES", "TOKENS"];
let apkColumns = ["SHOW ON DEVICE", "APK", "APP NAME", "APP LOGO"]
let sdealerColumns = ["DEALER ID", "DEALER NAME", "DEALER EMAIL", "DEALER PIN", "DEVICES", "TOKENS", "PARENT DEALER", "PARENT DEALER ID"]
// var CryptoJS = require("crypto-js");
// var io = require("../bin/www");

var util = require('util')

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
    // console.log("hello smtp", smtpTransport);
    smtpTransport.sendMail(mailOptions, cb);
}

/*Check For Token in the header */
var verifyToken = function (req, res) {
    var ath;
    var token = req.headers['authorization'];
    //console.log(token);
    if (token) {

        jwt.verify(token, config.secret, async function (err, decoded) {
            if (err) {
                ath = {
                    status: false,
                    success: false
                };
                return res.json({
                    success: false,
                    msg: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                // let result = await helpers.getLoginByToken(token);
                // console.log("decoding", result);
                // if(result){
                // if(result.status === true || result.status === 1){
                req.decoded = decoded;
                req.decoded.status = true;
                req.decoded.success = true;
                ath = decoded;
                // console.log(ath);


                // } else {
                //     ath.status = false;
                //     return res.json({
                //         success: false,
                //         msg: 'Failed to authenticate token.'
                //     });
                // }
                // } else {
                //     ath.status = false;
                //     return res.json({
                //         success: false,
                //         msg: 'Failed to authenticate token.'
                //     });
                // } 

            }
        });
    } else {
        ath = {
            status: false,
            success: false
        };
        return res.status(403).send({
            success: false,
            msg: 'No token provided.'
        });
    }
    return ath;
}



/* GET users listing. */
router.get('/', async function (req, res, next) {
    let file = path.join(__dirname, "../uploads/gana.apk");
    // let file = path.join(__dirname, "../uploads/apk-1541677256487.apk");
    let packageName = await helpers.getAPKPackageName(file);
    let versionName = await helpers.getAPKVersionName(file);
    let versionCode = await helpers.getAPKVersionCode(file);
    res.send({
        packageName: packageName,
        versionName: versionName,
        versionCode: versionCode,
    });

    // helpers.resetDB();
    // apk-ScreenLocker v3.31.apk

    // const unzip = zlib.createGunzip();
    // fileContents.pipe(unzip).pipe(writeStream);

    // const directoryFiles = fs.readdirSync(path.join(__dirname, "../"));

    // res.send(directoryFiles);
    // directoryFiles.forEach(filename => {
    // const fileContents = fs.createReadStream(`./data/${filename}`);
    // const writeStream = fs.createWriteStream(`./data/${filename.slice(0, -3)}`);
    // const unzip = zlib.createGunzip();
    // fileContents.pipe(unzip).pipe(writeStream);
    // });

    // var zip = new AdmZip(path.join(__dirname, "../uploads/apk-ScreenLocker v3.31.apk"));
    // var zipEntries = await zip.getEntries();
    // console.log(zipEntries.length)
    // res.send(zipEntries);
    // for (var i = 0; i < zipEntries.length; i++) {
    //   if (zipEntries[i].entryName.match(/readme/))
    //     console.log(zip.readAsText(zipEntries[i]));
    // }
});

/*****User Registration*****/
router.post('/Signup', async function (req, res) {

});


/*****User Login*****/
router.post('/login', async function (req, res) {
    var email = req.body.demail;
    var pwd = req.body.pwd;
    var enc_pwd = md5(pwd);
    var data = '';

    //check for if email is already registered
    var userQ = "SELECT * FROM dealers WHERE dealer_email = '" + email + "' limit 1";
    var users = await sql.query(userQ);

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

            if (users[0].password === enc_pwd) {
                let dealerStatus = helpers.getDealerStatus(users[0]);
                if (dealerStatus === Constants.DEALER_SUSPENDED) {
                    data = {
                        'status': false,
                        'msg': 'Your account is suspended',
                        'data': null
                    }
                    res.status(200).send(data);
                    return;
                } else if (dealerStatus === Constants.DEALER_UNLINKED) {
                    data = {
                        'status': false,
                        'msg': 'Your account is deleted',
                        'data': null
                    }
                    res.status(200).send(data);
                    return;
                } else {

                    if (users[0].is_two_factor_auth === 1 || users[0].is_two_factor_auth === true) {
                        verificationCode = randomize('0', 6);
                        verificationCode = await helpers.checkVerificationCode(verificationCode);
                        let updateVerification = "UPDATE dealers SET verified=0, verification_code='" + md5(verificationCode) + "' WHERE dealer_id=" + users[0].dealer_id;
                        await sql.query(updateVerification);
                        let html = "Your Login Code is: " + verificationCode;
                        sendEmail("Dual Auth Verification", html, users[0].dealer_email, function (error, response) {
                            if (error) {
                                throw (error)
                            } else {
                                res.send({
                                    status: true,
                                    two_factor_auth: true,
                                    msg: "Verification Code sent to Your Email"
                                })
                            }

                        });
                    } else {
                        // send email you are successfully logged in

                        var userType = await helpers.getUserType(users[0].dealer_id);
                        var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + users[0].dealer_id + "'");
                        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        // console.log('object data is ', users[0]);

                        const user = {
                            id: users[0].dealer_id,
                            dealer_id: users[0].dealer_id,
                            email: users[0].dealer_email,
                            lastName: users[0].last_name,
                            name: users[0].dealer_name,
                            firstName: users[0].first_name,
                            dealer_name: users[0].dealer_name,
                            dealer_email: users[0].dealer_email,
                            link_code: users[0].link_code,
                            connected_dealer: users[0].connected_dealer,
                            connected_devices: get_connected_devices,
                            account_status: users[0].account_status,
                            user_type: userType,
                            created: users[0].created,
                            modified: users[0].modified,
                            two_factor_auth: users[0].is_two_factor_auth,
                            ip_address: ip,
                        }

                        jwt.sign(
                            {
                                user
                            },
                            config.secret,
                            {
                                expiresIn: config.expiresIn
                            }, (err, token) => {
                                if (err) {
                                    res.json({
                                        'err': err
                                    });
                                } else {
                                    user.expiresIn = config.expiresIn;
                                    // console.log("logged in user", user[0]);
                                    user.verified = (users[0].is_two_factor_auth === true || users[0].is_two_factor_auth === 1) ? false : true;
                                    user.token = token;

                                    helpers.saveLogin(user, userType, Constants.TOKEN, 1);

                                    res.json({
                                        token: token,
                                        status: true,
                                        msg: 'User loged in Successfully',
                                        expiresIn: config.expiresIn,
                                        user,
                                        two_factor_auth: false,
                                    });
                                }
                            }
                        );
                    }


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

router.post('/verify_code', async function (req, res) {
    let verify_code = req.body.verify_code;

    let checkVerificationQ = "SELECT * FROM dealers WHERE verification_code = '" + md5(verify_code) + "' limit 1";
    let checkRes = await sql.query(checkVerificationQ);
    if (checkRes.length) {
        let updateVerificationQ = "UPDATE dealers SET verified = 1, verification_code=null WHERE dealer_id=" + checkRes[0].dealer_id;
        // let updateVerificationQ = "UPDATE dealers SET verified = 1 WHERE dealer_id=" + checkRes[0].dealer_id;
        sql.query(updateVerificationQ, async function (error, response) {
            if (error) throw (error);
            if (response.affectedRows) {
                let dealerStatus = helpers.getDealerStatus(checkRes[0]);
                console.log("dealer status", dealerStatus);
                if (dealerStatus === Constants.DEALER_SUSPENDED) {
                    data = {
                        'status': false,
                        'msg': 'Your account is suspended',
                        'data': null
                    }
                    res.status(200).send(data);
                    return;
                } else if (dealerStatus === Constants.DEALER_UNLINKED) {
                    data = {
                        'status': false,
                        'msg': 'Your account is deleted',
                        'data': null
                    }
                    res.status(200).send(data);
                    return;
                } else {

                    var userType = await helpers.getUserType(checkRes[0].dealer_id);

                    var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + checkRes[0].dealer_id + "'");
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    // console.log('object data is ', users[0]);

                    const user = {
                        id: checkRes[0].dealer_id,
                        dealer_id: checkRes[0].dealer_id,
                        email: checkRes[0].dealer_email,
                        lastName: checkRes[0].last_name,
                        name: checkRes[0].dealer_name,
                        firstName: checkRes[0].first_name,
                        dealer_name: checkRes[0].dealer_name,
                        dealer_email: checkRes[0].dealer_email,
                        link_code: checkRes[0].link_code,
                        connected_dealer: checkRes[0].connected_dealer,
                        connected_devices: get_connected_devices,
                        account_status: checkRes[0].account_status,
                        user_type: userType,
                        created: checkRes[0].created,
                        modified: checkRes[0].modified,
                        two_factor_auth: checkRes[0].is_two_factor_auth,
                        ip_address: ip,
                    }

                    jwt.sign({
                        user
                    }, config.secret, {
                            expiresIn: config.expiresIn
                        }, (err, token) => {
                            if (err) {
                                res.json({
                                    'err': err
                                });
                            } else {
                                user.expiresIn = config.expiresIn;
                                user.verified = checkRes[0].verified;
                                user.token = token;
                                helpers.saveLogin(user, userType, Constants.TOKEN, 1);

                                res.send({
                                    token: token,
                                    status: true,
                                    msg: 'User loged in Successfully',
                                    expiresIn: config.expiresIn,
                                    user
                                });
                            }
                        });
                }
            } else {
                return {
                    status: false,
                    msg: "verification code successfully matched",
                    data: null
                }
            }
        });

    } else {
        data = {
            status: false,
            msg: 'invalid verification code',
            data: null
        }
        res.status(200).send(data);
    }

});

// enable or disable two factor auth
router.post('/two_factor_auth', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let loggedDealerId = verify.user.id;
        isEnable = req.body.isEnable;
        let updateDealerQ = "UPDATE dealers SET is_two_factor_auth=" + isEnable + " WHERE dealer_id=" + loggedDealerId;
        let updatedDealer = await sql.query(updateDealerQ);
        if (updatedDealer.affectedRows) {
            if (isEnable) {
                res.send({
                    status: true,
                    msg: "Dual Authentication is Successfully enabled",
                    isEnable: isEnable
                })
            } else {
                res.send({
                    status: true,
                    msg: "Dual Authentication is Successfully disabled",
                    isEnable: isEnable
                })
            }
        } else {
            res.send({
                status: false,
                msg: "Dual Authentication could not be enabled"
            })
        }

    }
});


router.get('/get_allowed_components', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {

    }
});


router.post('/check_component', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {
        var componentUri = req.body.ComponentUri;
        var userId = verify.user.id;
        var result = await helpers.isAllowedComponentByUri(componentUri, userId);
        let getUser = "SELECT * from dealers where dealer_id =" + userId;
        let user = await sql.query(getUser);
        var get_connected_devices = await sql.query("SELECT count(*) as total from usr_acc where dealer_id='" + userId + "'");

        if (user.length) {

            const usr = {
                id: user[0].dealer_id,
                dealer_id: user[0].dealer_id,
                email: user[0].dealer_email,
                lastName: user[0].last_name,
                name: user[0].dealer_name,
                firstName: user[0].first_name,
                dealer_name: user[0].dealer_name,
                dealer_email: user[0].dealer_email,
                link_code: user[0].link_code,
                connected_dealer: user[0].connected_dealer,
                connected_devices: get_connected_devices,
                account_status: user[0].account_status,
                user_type: verify.user.user_type,
                created: user[0].created,
                modified: user[0].modified,
                two_factor_auth: user[0].is_two_factor_auth,
                verified: user[0].verified
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
router.get('/is_admin', async function (req, res) {

});

/** get_user_type **/
router.get('/user_type', async function (req, res) {

});

/**GET all the devices**/
router.get('/devices', async function (req, res) {

    var verify = await verifyToken(req, res);
    var where_con = '';
    let newArray = [];
    // console.log("user data", verify.user);
    if (verify.status !== undefined && verify.status == true) {
        if (verify.user.user_type !== 'admin') {
            if (verify.user.user_type === 'dealer') {
                where_con = 'AND (usr_acc.dealer_id =' + verify.user.id + ' OR usr_acc.prnt_dlr_id =' + verify.user.id + ')';
                let query = "SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = '" + verify.user.id + "' AND del_status IS NULL";
                newArray = await sql.query(query)
            } else {
                where_con = 'AND usr_acc.dealer_id = ' + verify.user.id + ' ';
                let query = "SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = '" + verify.user.id + "' AND del_status IS NULL";
                newArray = await sql.query(query)
            }
        } else {
            let query = "SELECT * From acc_action_history WHERE action = 'UNLINKED'";
            newArray = await sql.query(query)
        }

        // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC');
        // sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer , pgp_emails.pgp_email,chat_ids.chat_id ,sim_ids.sim_id from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id LEFT JOIN pgp_emails on pgp_emails.user_acc_id = usr_acc.id LEFT JOIN chat_ids on chat_ids.user_acc_id = usr_acc.id LEFT JOIN sim_ids on sim_ids.device_id = usr_acc.device_id where usr_acc.transfer_status = 0 ' + where_con + ' order by devices.id DESC', function (error, results, fields) {
        // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 ' + where_con + ' order by devices.id DESC');
        sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 ' + where_con + ' order by devices.id DESC', async function (error, results, fields) {
// console.log('query ', 'select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 ' + where_con + ' order by devices.id DESC')
            if (error) throw error;
            for (var i = 0; i < results.length; i++) {
                results[i].finalStatus = device_helpers.checkStatus(results[i])
                results[i].pgp_email = await device_helpers.getPgpEmails(results[i])
                results[i].sim_id = await device_helpers.getSimids(results[i])
                results[i].chat_id = await device_helpers.getChatids(results[i])
                results[i].validity = await device_helpers.checkRemainDays(results[i].created_at, results[i].validity)
                // dealerData = await device_helpers.getDealerdata(results[i]);
            }
            let finalResult = [...results, ...newArray]
            // console.log('old', finalResult.length)
            // let dumyData = finalResult;
            // let newResultArray = [];
            // for (let device of finalResult) {
            //     // console.log('device ', device.device_id)
            //     if (device.batch_no !== undefined && device.batch_no !== null && device.batch_no !== 'null' && device.batch_no !== 'undefined') {
            //         let batch_array = [];
            //         // console.log('batch no is exist')
            //         let chcek = newResultArray.findIndex(dvc => {
            //             return dvc.batch_no == device.batch_no
            //         });
            //         if (chcek == -1) {
            //             for (let batch_device of dumyData) {
            //                 if (device.batch_no == batch_device.batch_no) {
            //                     // console.log('batch no is matched', batch_device.batch_no)
            //                     batch_array.push(JSON.parse(JSON.stringify(batch_device)));
            //                 }
            //             }
            //             // console.log(batch_array, 'batch array length')
            //             if (batch_array.length) {
            //                 device.batchData = batch_array;
            //             }

            //             newResultArray.push(JSON.parse(JSON.stringify(device)))
            //         }

            //     } else {
            //         device.batchData = [];
            //         // if (!newResultArray.find(dvc => {
            //             // dvc.device_id == null && dvc.device_id == 'null'
            //         // })) {
            //              newResultArray.push(JSON.parse(JSON.stringify(device)) )
            //             // }
            //     }
            // }

            // console.log('final list ',newResultArray[0])

            data = {
                "status": true,
                // "data": newResultArray
                "data": finalResult
            };
            res.send(data);
        });

    }
});

/**GET New the devices**/
router.get('/new/devices', async function (req, res) {
    var verify = await verifyToken(req, res);
    var where_con = '';

    if (verify['status'] !== undefined && verify.status == true) {
        if (verify.user.user_type !== 'admin') {
            if (verify.user.user_type === 'dealer') {
                // console.log('done of dealer', verify.user.id)
                where_con = 'AND (usr_acc.dealer_id =' + verify.user.id + ' OR usr_acc.prnt_dlr_id =' + verify.user.id + ')';
            } else {
                where_con = 'AND usr_acc.dealer_id = ' + verify.user.id + ' ';
            }
            sql.query('select devices.*  ,' + usr_acc_query_text + ' from devices left join usr_acc on  devices.id = usr_acc.device_id WHERE ((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC', function (error, results, fields) {
                // console.log('select devices.*  ,' + usr_acc_query_text + ' from devices left join usr_acc on  devices.id = usr_acc.device_id WHERE ((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC');
                if (error) throw error;
                data = {
                    "status": true,
                    "data": results
                };
                res.send(data);
            });
        } else {
            data = {
                "status": false,
            };
            res.send(data);
        }
    }
});

/*** Add Dealer ***/
router.post('/add/dealer', async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);

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
        // console.log("dealer_pwd: " + dealer_pwd);


        var enc_pwd = md5(dealer_pwd); //encryted pwd
        // console.log("encrypted password" + enc_pwd);
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
                if (rows.affectedRows) {

                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(deviceColumns) + "', 'devices') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(dealerColumns) + "', 'dealer') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(sdealerColumns) + "', 'sdealer') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(apkColumns) + "', 'apk') ")
                }

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


/*** Add User ***/
router.post('/add/user', async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        var userName = req.body.name;
        var loggedInuid = verify.user.id;
        var userEmail = req.body.email;

        var userId = randomize('0', 6);
        userId = 'ID' + await helpers.checkUserId(userId)
        var user_pwd = generator.generate({
            length: 10,
            numbers: true
        });
        var enc_pwd = md5(user_pwd); //encryted pwd
        // console.log("encrypted password" + enc_pwd);
        if (!empty(userEmail) && !empty(userName)) {
            var user = await sql.query("SELECT * FROM users WHERE email = '" + userEmail + "'");

            if (user.length > 0) {
                data = {
                    'status': false,
                    'msg': 'User Already Registered. Please use another email.',
                }
                res.status(200).send(data);
                return;
            }

            var sql1 = "INSERT INTO users (user_id, user_name, email, password, dealer_id , type)";
            sql1 += " VALUES ('" + userId + "', '" + userName + "','" + userEmail + "', '" + enc_pwd + "','" + loggedInuid + "', 4)";
            sql.query(sql1, async function (error, rows) {
                if (error) throw error;

                var html = 'User details are : <br> ' +
                    'User ID : ' + userId + '.<br> ' +
                    'Name : ' + userName + '<br> ' +
                    'Email : ' + userEmail + '<br> '
                sendEmail("User Registration", html, verify.user.email)
                sendEmail("User Registration", html, userEmail)

                //res.send("Email has been sent successfully");
                var user = await sql.query("SELECT * FROM users WHERE email = '" + userEmail + "'");
                let data = await helpers.getAllRecordbyUserID(userId)
                user[0].devicesList = data
                // console.log('result add',dealer);
                data = {
                    'status': true,
                    'msg': 'User has been registered successfully.',
                    'user': user,
                }
                res.status(200).send(data);

            });

        } else {
            data = {
                'status': false,
                'msg': 'Invalid email or name'
            }
            res.status(200).send(data);
        }
    }
});

/*** Edit User ***/
router.post('/edit/user', async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        var userName = req.body.name;
        var userEmail = req.body.email;
        var user_id = req.body.user_id
        if (!empty(userEmail) && !empty(userName)) {
            var user = await sql.query("SELECT * FROM users WHERE email = '" + userEmail + "' AND user_id != '" + user_id + "'");

            if (user.length > 0) {
                data = {
                    'status': false,
                    'msg': 'User Already Registered. Please use another email.',
                }
                res.status(200).send(data);
                return;
            }
            let PrevUserData = await helpers.getUserDataByUserId(user_id)
            var sql1 = "UPDATE users set user_name ='" + userName + "',  email = '" + userEmail + "' WHERE user_id ='" + user_id + "'";
            sql.query(sql1, async function (error, rows) {
                if (error) throw error;

                if (PrevUserData[0].email != userEmail) {

                    var html = 'User details are : <br> ' +
                        'User ID : ' + user_id + '.<br> ' +
                        'Name : ' + userName + '<br> ' +
                        'Email : ' + userEmail + '<br> '
                    sendEmail("User info Changed Successfully", html, verify.user.email)
                    sendEmail("User Info Changed Successfully", html, userEmail)
                }

                //res.send("Email has been sent successfully");
                let userData = await helpers.getUserDataByUserId(user_id)
                let data = await helpers.getAllRecordbyUserID(user_id)
                userData[0].devicesList = data

                data = {
                    'status': true,
                    'msg': 'User Info has been changed successfully.',
                    'user': userData,
                }
                res.status(200).send(data);

            });

        } else {
            data = {
                'status': false,
                'msg': 'Invalid email or name'
            }
            res.status(200).send(data);
        }
    }
});
/*** DELETE User ***/
router.put('/delete_user/:user_id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var user_id = req.params.user_id
        if (!empty(user_id) && user_id != undefined) {
            let deleteUserQ = "UPDATE users SET del_status = 1 WHERE user_id ='" + user_id + "'";
            console.log(deleteUserQ);
            sql.query(deleteUserQ, function (err, result) {
                if (err) {
                    throw err
                }
                if (result && result.affectedRows !== 0) {
                    data = {
                        'status': true,
                        'msg': 'User deleted successfully.'
                    }
                    res.send(data);
                    return
                } else {
                    data = {
                        'status': true,
                        'msg': 'User not deleted try again later.'
                    }
                    res.send(data);
                    return
                }
            })
        } else {
            data = {
                'status': false,
                'msg': 'Invalid User.'
            }
            res.send(data);
            return
        }
    }
});
/***UNDO DELETE User ***/
router.put('/undo_delete_user/:user_id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var user_id = req.params.user_id
        if (!empty(user_id) && user_id != undefined) {
            let deleteUserQ = "UPDATE users SET del_status = 0 WHERE user_id ='" + user_id + "'";
            console.log(deleteUserQ);
            sql.query(deleteUserQ, function (err, result) {
                if (err) {
                    throw err
                }
                if (result && result.affectedRows !== 0) {
                    data = {
                        'status': true,
                        'msg': 'User added again successfully.'
                    }
                    res.send(data);
                    return
                } else {
                    data = {
                        'status': true,
                        'msg': 'User not added try again later.'
                    }
                    res.send(data);
                    return
                }
            })
        } else {
            data = {
                'status': false,
                'msg': 'Invalid User.'
            }
            res.send(data);
            return
        }
    }
});





/*Get dealers*/
router.get('/dealers/:pageName', async function (req, res) {
    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
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

            var role = await helpers.getuserTypeIdByName(verify.user.user_type);
            console.log("role id", role);
            sql.query("select * from dealers where connected_dealer = '" + verify.user.id + "' AND  type = 3 order by created DESC", async function (error, results) {
                if (error) throw error;
                // console.log("select * from dealers where connected_dealer = '" + verify.user.id + "' AND  type = 2 order by created DESC");
                var data = [];
                console.log(results);
                for (var i = 0; i < results.length; i++) {

                    var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + results[i].id + "'");

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
                    data.push(dt);
                }
                console.log("Dealers Data", data);
                res.send(data);
            });
        }

    }
});

/***Add devices (not using) ***/
router.post('/create/device_profile', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        // var dataStag = [];
        var code = randomize('0', 7);
        var activation_code = await helpers.checkActivationCode(code);
        var client_id = req.body.client_id;
        var chat_id = req.body.chat_id ? req.body.chat_id : '';
        var model = req.body.model;
        var user_id = req.body.user_id;

        let userData = await helpers.getUserDataByUserId(user_id)

        var name = userData[0].user_name;
        var email = userData[0].email;
        var pgp_email = req.body.pgp_email;
        var start_date = req.body.start_date;
        var note = req.body.note;
        var validity = req.body.validity;
        var duplicate = req.body.duplicate ? req.body.duplicate : 0;
        var link_code = await device_helpers.getLinkCodeByDealerId(verify.user.id)
        if (req.body.expiry_date == 0) {
            var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
            var expiry_date = moment(trailDate).format("YYYY/MM/DD")
        } else {
            let exp_month = req.body.expiry_date;
            var expiry_date = helpers.getExpDateByMonth(start_date, exp_month);
        }

        var exp_month = req.body.expiry_date;
        var dealer_id = verify.user.dealer_id;
        var sim_id = req.body.sim_id ? req.body.sim_id : '';
        var loggedUserId = verify.user.id;
        var loggedUserType = verify.user.type;
        let policy_id = req.body.policy_id ? req.body.policy_id : '';
        if (loggedUserType === ADMIN) {
            //    dealer_id= req.body.dealer_id;
        }
        if (duplicate > 0) {
            let pgpEmail = "SELECT pgp_email from pgp_emails WHERE used=0";
            let pgp_emails = await sql.query(pgpEmail);
            let chatIds = "SELECT chat_id from chat_ids WHERE used=0";
            let chat_ids = await sql.query(chatIds);
            let simIds = "SELECT sim_id from sim_ids WHERE used=0";
            let sim_ids = await sql.query(simIds);
            let activationCodes = []
            let deviceIds = []
            let batch_no = new Date().valueOf();
            const addDuplicateActivations = async () => {
                for (let i = 0; i < duplicate; i++) {
                    let code = randomize('0', 7);
                    var activationCode = await helpers.checkActivationCode(code);
                    activationCodes.push(activationCode);
                    // deviceIds.push("'" + deviceId + "'");
                    let chat_id = (chat_ids[i]) ? chat_ids[i].chat_id : null;
                    let sim_id = (sim_ids[i]) ? sim_ids[i].sim_id : null;
                    let pgp_email = (pgp_emails[i]) ? pgp_emails[i].pgp_email : null;
                    // console.log(pgp_emails[i].pgp_email, chat_ids[i].chat_id, sim_isim_id, activationCode, deviceId);

                    var insertDevice = "INSERT INTO devices (name , created_at ) VALUES ('" + name + "', NOW())";
                    let resp = await sql.query(insertDevice)
                    // console.log("inserted id", resp.insertId);
                    let dvc_id = resp.insertId;
                    deviceIds.push(dvc_id);
                    var insertUser_acc = "INSERT INTO usr_acc (device_id , user_id,batch_no, activation_code, expiry_months, dealer_id,link_code, device_status, activation_status, expiry_date,note,validity,account_email,account_name "
                    var User_acc_values = ") VALUES ('" + dvc_id + "', '" + user_id + "', '" + batch_no + "', '" + activationCode + "',  " + exp_month + ", " + dealer_id + ", '" + link_code + "' ,  0, 0 ,'" + expiry_date + "','" + note + "','" + validity + "','" + email + "','" + name + "')";
                    insertUser_acc = insertUser_acc + User_acc_values;
                    if (resp.insertId) {
                        let resps = await sql.query(insertUser_acc)
                        let user_acc_id = resps.insertId;
                        // console.log("affectedRows", resps.affectedRows);
                        if (resps.affectedRows) {
                            let updateChatIds = 'update chat_ids set used=1, user_acc_id="' + user_acc_id + '" where chat_id ="' + chat_id + '"';
                            await sql.query(updateChatIds);
                            let updateSimIds = 'update sim_ids set used=1, user_acc_id="' + user_acc_id + '" where sim_id ="' + sim_id + '"';
                            await sql.query(updateSimIds)
                            let updatePgpEmails = 'update pgp_emails set used=1, user_acc_id="' + user_acc_id + '" where pgp_email ="' + pgp_email + '"';
                            await sql.query(updatePgpEmails);
                            // if (policy_id !== '') {

                            //     var slctpolicy = "select * from device_history where id = " + policy_id + "";
                            //     policy_obj = await sql.query(slctpolicy);
                            //     // console.log('policy ', policy_obj);
                            //     policy_obj[0].dealer_id = dealer_id;
                            //     policy_obj[0].status = 0;
                            //     policy_obj[0].type = 'history';

                            //     var insertQuery = "INSERT INTO device_history ( user_acc_id, app_list, setting, controls, status ) "
                            //         + " VALUES('" + user_acc_id + "', '" + policy_obj[0].app_list + "', '" + policy_obj[0].setting + "', '" + policy_obj[0].controls + "', 0 ) "

                            //     await sql.query(insertQuery);
                            // }
                        }

                    }

                }
            }
            await addDuplicateActivations()
            html = 'Amount of activation codes : ' + activationCodes.length + '<br> ' + 'Activation Codes are following : <br>' + activationCodes.join("<br>") + '.<br> ';

            sendEmail("Activation codes successfuly generated.", html, verify.user.dealer_email);
            // console.log("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name, dealers.connected_dealer from devices left join usr_acc on devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 and devices.device_id IN (" + deviceIds.join() + ")");
            var slctquery = "select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id IN (" + deviceIds.join() + ")";
            // console.log(slctquery);
            rsltq = await sql.query(slctquery);
            // console.log(rsltq);
            for (var i = 0; i < rsltq.length; i++) {
                rsltq[i].finalStatus = device_helpers.checkStatus(rsltq[i])
                rsltq[i].pgp_email = await device_helpers.getPgpEmails(rsltq[i])
                rsltq[i].sim_id = await device_helpers.getSimids(rsltq[i])
                rsltq[i].chat_id = await device_helpers.getChatids(rsltq[i])
                await device_helpers.saveActionHistory(rsltq[i], Constants.DEVICE_PRE_ACTIVATION);
            }
            data = {
                "status": true,
                "msg": 'Pre-activations added succcessfully.Email sends to your account.',
                "data": rsltq
            };
            res.send({
                status: true,
                data: data
            })
            return;
        } else {
            let checkUnique = "SELECT account_email from usr_acc WHERE account_email= '" + email + "' AND user_id != '" + user_id + "'";
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

                var insertDevice = "INSERT INTO devices (name, model ";

                var values = ") VALUES ('" + name + "', '" + model + "'";
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
                            var insertUser_acc = "INSERT INTO usr_acc (device_id, user_id, activation_code, client_id , account_email,expiry_months, dealer_id, link_code ,device_status, activation_status, expiry_date , note,validity  "
                            // var insertDevice = "INSERT INTO devices ( activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status ";
                            var User_acc_values = ") VALUES ('" + dvc_id + "','" + user_id + "', '" + activation_code + "', '" + client_id + "', '" + email + "',  " + exp_month + ", " + dealer_id + ",'" + link_code + "' ,  0, 0 ,'" + expiry_date + "','" + note + "','" + validity + "')";
                            insertUser_acc = insertUser_acc + User_acc_values;
                            console.log(insertUser_acc);
                            if (resp.affectedRows) {
                                sql.query(insertUser_acc, async (err, resp) => {

                                    if (err) throw (err);
                                    let user_acc_id = resp.insertId;

                                    console.log("affectedRows", resp.affectedRows);
                                    if (resp && resp.affectedRows) {
                                        let updateChatIds = 'update chat_ids set used=1, user_acc_id="' + user_acc_id + '" where chat_id ="' + chat_id + '"';
                                        await sql.query(updateChatIds);
                                        let updateSimIds = 'update sim_ids set used=1, user_acc_id="' + user_acc_id + '" where sim_id ="' + sim_id + '"';
                                        await sql.query(updateSimIds)
                                        let updatePgpEmails = 'update pgp_emails set used=1, user_acc_id="' + user_acc_id + '" where pgp_email ="' + pgp_email + '"';
                                        await sql.query(updatePgpEmails);
                                        // if (policy_id !== '') {
                                        //     var slctpolicy = "select * from device_history where id = " + policy_id + "";
                                        //     policy_obj = await sql.query(slctpolicy);
                                        //     // console.log('policy ', policy_obj);
                                        //     policy_obj[0].dealer_id = dealer_id;
                                        //     policy_obj[0].status = 0;
                                        //     policy_obj[0].type = 'history';

                                        //     var insertQuery = "INSERT INTO device_history ( user_acc_id, app_list, setting, controls, status ) "
                                        //         + " VALUES('" + user_acc_id + "', '" + policy_obj[0].app_list + "', '" + policy_obj[0].setting + "', '" + policy_obj[0].controls + "', 0 ) "

                                        //     await sql.query(insertQuery);
                                        // }

                                        sql.query("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name, dealers.connected_dealer from devices left join usr_acc on devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 and devices.id='" + dvc_id + "'", async function (error, results, fields) {

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
                                                "msg": 'Pre-activation added succcessfully.',
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
    }
});

router.post('/transfer/device_profile', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let device_id = req.body.device_id;
        console.log('device id', device_id);
        var code = randomize('0', 7);
        var activation_code = await helpers.checkActivationCode(code);
        // let device_id_new = helpers.getDeviceId();
        // device_id_new = await helpers.checkDeviceId(device_id_new);

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

                    var code = randomize('0', 7);
                    var activation_code = await helpers.checkActivationCode(code);
                    // let device_id_new = helpers.getDeviceId();
                    // device_id_new = await helpers.checkDeviceId(device_id_new);

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
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let user_id = req.body.user_id;

        let userData = await helpers.getUserDataByUserId(user_id);

        let device_id = req.body.device_id;
        let device_name = userData[0].name;
        let device_email = userData[0].email;
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
        var trial_status = 0

        let start_date = req.body.start_date;
        if (req.body.expiry_date === '' || req.body.expiry_date === null) {
            var status = 'expired';
        } else if (req.body.expiry_date == 0) {
            var status = 'trial';
            trial_status = 1;
            // req.body.expiry_date = 
        }
        else {
            var status = 'active';
        }
        if (req.body.expiry_date == 0) {
            var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
            var expiry_date = moment(trailDate).format("YYYY/MM/DD")
        } else {
            let exp_month = req.body.expiry_date;
            var expiry_date = helpers.getExpDateByMonth(start_date, exp_month);
        }
        // console.log(expiry_date);
        // console.log(device_id);
        if (!empty(usr_device_id)) {

            var checkDevice = "SELECT * from devices LEFT JOIN usr_acc ON usr_acc.device_id = devices.id WHERE devices.device_id = '" + device_id + "' ";
            let checkDealer = "SELECT * from dealers where dealer_id =" + dealer_id;
            // let checkConnectedDealer = "SELECT * from dealers where dealer_id =" + connected_dealer;

            let dealer = await sql.query(checkDealer);

            // let connected = await sql.query(checkConnectedDealer);
            if (loggedDealerType === SDEALER) {
                checkDevice = checkDevice + " AND usr_acc.dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === DEALER) {
                checkDevice = checkDevice + " AND (usr_acc.dealer_id =" + loggedDealerId + " OR usr_acc.prnt_dlr_id =" + loggedDealerId + ") ";
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
            console.log(checkDevice);
            sql.query(checkDevice, async function (error, rows) {
                if (rows.length) {

                    let checkUniquePgp = "SELECT pgp_email from pgp_emails WHERE (pgp_email= '" + pgp_email + "' AND used=1)";
                    let checkDevicepgp = await sql.query(checkUniquePgp);

                    let checkUnique = "SELECT usr_acc.* from usr_acc WHERE account_email= '" + device_email + "' AND device_id != '" + device_id + "' AND user_id != '" + user_id + "'"
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
                                usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + device_email + "', status = '" + status + "',trial_status = '" + trial_status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "', prnt_dlr_id=" + dealer_id + ", prnt_dlr_name='" + dealer[0].dealer_name + "' WHERE device_id = '" + usr_device_id + "'"
                                // 
                                // let sql1 = common_Query + ", s_dealer_name = '" + rslt1[0].dealer_name + "', s_dealer = '" + req.body.s_dealer + "'" + common_Query2;
                                // console.log("UPafet Quety", usr_acc_Query);
                            } else {

                                common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'"
                                usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + device_email + "', status = '" + status + "',trial_status = '" + trial_status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' WHERE device_id = '" + usr_device_id + "'"
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

                                // if (policy_id !== undefined && policy_id !== '' && policy_id !== null) {
                                //     var slctpolicy = "select * from device_history where id = " + policy_id + "";
                                //     policy_obj = await sql.query(slctpolicy);
                                //     var insertQuery = "INSERT INTO device_history ( device_id, app_list, setting, controls, passwords, type, status ) "
                                //         + " VALUES('" + device_id + "', '" + policy_obj[0].app_list + "', '" + policy_obj[0].setting + "', '" + policy_obj[0].controls + "', '" + policy_obj[0].passwords + "', 'history', 0 ) "

                                //     await sql.query(insertQuery);
                                // }
                                for (var i = 0; i < rsltq.length; i++) {
                                    rsltq[i].finalStatus = device_helpers.checkStatus(rsltq[i])
                                }
                                // device_helpers.saveActionHistory(rslts[0], Constants.DEVICE_ACCEPT)
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
    var verify = await verifyToken(req, res);

    if (verify['status'] !== undefined && verify.status == true) {

        if (!empty(req.body.usr_device_id)) {

            let loggedDealerId = verify.user.id;
            let loggedDealerType = verify.user.user_type;

            var user_id = req.body.user_id;

            let userData = await helpers.getUserDataByUserId(user_id)

            let device_id = req.body.device_id;
            let dealer_id = req.body.dealer_id;
            let device_name = userData[0].user_name;
            let email = userData[0].email;
            let client_id = req.body.client_id;
            let model = req.body.model;
            let usr_acc_id = req.body.usr_acc_id;
            let usr_device_id = req.body.usr_device_id;
            let prevPGP = req.body.prevPGP
            let finalStatus = req.body.finalStatus
            var note = req.body.note;
            var validity = req.body.validity;
            // let s_dealer_id = req.body.s_dealer;
            let start_date = req.body.start_date;
            // let expiray_date = req.body.expiray_date;

            let sim_id = (req.body.sim_id == undefined) ? '' : req.body.sim_id;
            let chat_id = (req.body.chat_id == undefined) ? '' : req.body.chat_id;
            let pgp_email = (req.body.pgp_email == undefined) ? '' : req.body.pgp_email;

            var d = new Date(req.body.start_date);

            if (req.body.expiry_date === '' || req.body.expiry_date === null) {
                var status = 'expired';
            } else if (req.body.expiry_date == 0) {
                var status = 'trial';
            }
            else if (finalStatus === Constants.DEVICE_PRE_ACTIVATION) {
                var status = ''
            }
            else {
                var status = 'active';
            }
            if (req.body.expiry_date == 0) {
                if (finalStatus === Constants.DEVICE_PRE_ACTIVATION || finalStatus === Constants.DEVICE_TRIAL) {
                    var expiry_date = req.body.expiry_date
                }
                else {
                    let exp_month = req.body.expiry_date;
                    var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
                    var expiry_date = moment(trailDate).format("YYYY/MM/DD")
                }
            } else {
                let exp_month = req.body.expiry_date;
                var expiry_date = helpers.getExpDateByMonth(start_date, exp_month);
            }
            // console.log('month', g_months, 'year', g_years);
            // console.log('date now', expiry_date);

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
            // console.log(checkDevice);
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
                            common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'";
                            if (finalStatus !== Constants.DEVICE_PRE_ACTIVATION) {
                                if (expiry_date == 0) {
                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' ,account_email = '" + email + "',status = '" + status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' WHERE device_id = '" + usr_device_id + "'"
                                } else {
                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' ,account_email = '" + email + "', status = '" + status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' WHERE device_id = '" + usr_device_id + "'"
                                }
                            } else {
                                if (expiry_date == 0) {
                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + email + "',status = '" + status + "',validity = '" + validity + "' ,note = '" + note + "' ,client_id = '" + client_id + "', device_status = 0, unlink_status=0 ,start_date = '" + start_date + "' WHERE device_id = '" + usr_device_id + "'"
                                } else {
                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + email + "',status = '" + status + "',validity = '" + validity + "' ,note = '" + note + "' ,client_id = '" + client_id + "', device_status = 0, unlink_status=0 ,start_date = '" + start_date + "', expiry_date = '" + expiry_date + "' WHERE device_id = '" + usr_device_id + "'"
                                }

                            }

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

                                if (finalStatus === Constants.DEVICE_PRE_ACTIVATION) {
                                    if (pgp_email !== prevPGP) {
                                        let updatePrevPgp = 'update pgp_emails set user_acc_id = null,  used=0 where pgp_email ="' + prevPGP + '"';
                                        sql.query(updatePrevPgp)

                                    }
                                }

                                var slctquery = "select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id = '" + usr_device_id + "'";
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
router.put('/delete/:device_id', async function (req, res) {

    // console.log(req.body);
    var verify = await verifyToken(req, res);

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
            // console.log("delete where ", 'DELETE FROM devices WHERE device_id ="' + [req.params.device_id])
            if (req.body.dealer_id === loggedUserId || req.body.prnt_dlr_id === loggedUserId || userType === ADMIN) {

                let usr_device_id = await device_helpers.getOriginalIdByDeviceId(req.params.device_id);
                sql.query("DELETE from usr_acc  where device_id = " + usr_device_id, async function (error, results, fields) {
                    // sql.query("UPDATE usr_acc set unlink_status = 1 WHERE device_id = '" + usr_device_id + "'")
                    //response.end(JSON.stringify(rows));
                    // console.log(results);
                    if (error) throw error;
                    if (results.affectedRows !== 0) {
                        var sqlDevice = "DELETE from devices where device_id = '" + req.params.device_id + "'";
                        sql.query(sqlDevice);
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
router.put('/updateProfile/:id', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
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


/** Unlink Device  **/
router.post('/unlink/:id', async function (req, res) {
    var verify = await verifyToken(req, res);
    var device_id = req.params.id;
    var pgp_email = req.body.device.pgp_email;
    var chat_id = req.body.device.chat_id;
    var sim_id = req.body.device.sim_id;

    if (verify.status !== undefined && verify.status == true) {
        let dvcId = await device_helpers.getDvcIDByDeviceID(device_id);
        console.log('unlinked: ', dvcId);

        if (!empty(device_id)) {

            var sql1 = "DELETE from usr_acc  where device_id = '" + device_id + "'";
            var rest = sql.query(sql1, async function (error, results) {
                if (error) throw error;
                console.log(results);
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Device not unlinked."
                    }
                } else {
                    var userAccId = await device_helpers.getUsrAccIDbyDvcId(device_id)
                    await sql.query("update pgp_emails set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    await sql.query("update chat_ids set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    await sql.query("update sim_ids set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    var sqlDevice = "DELETE from devices where id = '" + device_id + "'";
                    await sql.query(sqlDevice);

                    device_helpers.saveActionHistory(req.body.device, Constants.DEVICE_UNLINKED)
                    require("../bin/www").sendDeviceStatus(dvcId, "unlinked", true);
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
    var verify = await verifyToken(req, res);
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
                                require("../bin/www").sendDeviceStatus(resquery[0].device_id, "suspended");


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
                                    require("../bin/www").sendDeviceStatus(resquery[0].device_id, "suspended");
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
    var verify = await verifyToken(req, res);
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
                    require("../bin/www").sendDeviceStatus(gtres[0].device_id, Constants.DEVICE_WIPE);

                    sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                        if (error) throw error;
                        // console.log('lolo else', resquery[0])

                        if (resquery.length) {
                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                            resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                            resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                            resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                            // dealerData = await getDealerdata(res[i]);

                            device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_WIPE)
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
    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
    var device_id = req.params.id;
    var option = req.body.data
    console.log(option);
    if (verify.status !== undefined && verify.status == true) {
        var sql2 = "select * from devices where id = '" + device_id + "'";
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
    var verify = await verifyToken(req, res);
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
                                require("../bin/www").sendDeviceStatus(resquery[0].device_id, "active", true);
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
                                    require("../bin/www").sendDeviceStatus(resquery[0].device_id, "active", true);
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

    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
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

            let dealer_email = await sql.query("SELECT * from dealers where dealer_email = '" + email + "' AND dealer_id = " + dealer_id)
            var dealer_pwd = generator.generate({
                length: 10,
                numbers: true
            });
            var enc_pwd = md5(dealer_pwd);
            if (!empty(name) && name != '' && name != null) {
                if (mailgiven == true && alreadyAvailable == false && dealer_email.length === 0) {
                    setFields = setFields + ", dealer_name='" + name + "'" + ",password = '" + enc_pwd + "'";
                } else {
                    setFields = " dealer_name='" + name + "'";

                }
            }
            var query = "UPDATE dealers set " + setFields + " where dealer_id = " + dealer_id + "";
            // var query = "UPDATE dealers set dealer_name = '" + req.body.name + "' , dealer_email = '" + req.body.email + "' where dealer_id = " + dealer_id + "";

            // console.log(query);

            sql.query(query, async function (error, row) {

                if (row.affectedRows != 0) {
                    if (dealer_email.length === 0 && alreadyAvailable === false) {
                        html = 'Your login details are : <br> ' +
                            'Email : ' + email + '<br> ' +
                            'Password : ' + dealer_pwd + '<br> ' +
                            'Below is the link to login : <br> http://www.lockmesh.com <br>';
                        sendEmail("Account Registration", html, email, function (error, response) {
                            if (error) {
                                throw (error)
                            } else {
                                res.send({
                                    status: true,
                                    msg: 'Record updated successfully. Email has been sent.',
                                    "alreadyAvailable": alreadyAvailable
                                })
                            }
                        });
                    } else {
                        data = {
                            "status": true,
                            "msg": 'Record updated successfully.',
                            "data": row,
                            "alreadyAvailable": alreadyAvailable
                        };
                        res.send(data);
                    }
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

router.post('/dealer/delete/', async function (req, res) {

    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
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
router.get('/sdealers/:dealer_id', async function (req, res) {
    var verify = await verifyToken(req, res);
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


/** Undo Dealer / S-Dealer **/
router.post('/dealer/undo', async function (req, res) {
    var verify = await verifyToken(req, res);
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
    // console.log('api check is caled')
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.device_id)) {
            let userId = verify.user.id;
            //  console.log(verify.user);
            let usertype = await helpers.getUserType(userId);
            let where = "devices.device_id = '" + req.params.device_id + "'";

            if (usertype != ADMIN) {
                where = where + " and (usr_acc.dealer_id=" + userId + " OR usr_acc.prnt_dlr_id = " + userId + ")";
            }
            // console.log("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id where " + where);
            await sql.query("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id where " + where, async function (error, results) {

                if (error) throw error;
                // console.log('rslt done', results);
                if (results.length == 0) {
                    _data = {
                        status: false,
                        msg: "No details found"
                    };
                } else {
                    var query = "select * from dealers where dealer_id =" + results[0].dealer_id;
                    let dealer_details = await sql.query(query);
                    device_data = results[0]
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
                        status: true,
                        msg: "success",
                        data: device_data
                    };
                }

                res.send(_data);
            });
        } else {
            _data = {
                status: false,
                msg: "Device not found"
            };
        }
        res.send(_data);
    }
});

// resync device
router.patch('/sync-device', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let deviceId = req.body.device_id;
        if (!empty(deviceId)) {
            let query = "SELECT * FROM devices WHERE device_id = '" + deviceId + "' and (online = 'On' OR online = 'on') ";
            sql.query(query, function (error, response) {
                if (error) console.log(error);
                if (response.length) {
                    require("../bin/www").syncDevice(deviceId);
                }
                res.send({
                    status: true,
                    msg: "device synced successfully"
                })
            });
        }
    }
});

/** Get logged in Dealer permitted apps  **/
router.get('/get_dealer_apps', async function (req, res) {
    // console.log('apoi recivedx')
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let loggedUserId = verify.user.id;
        let loggedUserType = verify.user.user_type;

        let getAppsQ = "SELECT apk_details.* FROM apk_details ";
        if (loggedUserType !== Constants.ADMIN) {
            getAppsQ = getAppsQ + " JOIN dealer_apks on dealer_apks.apk_id = apk_details.id WHERE dealer_apks.dealer_id =" + loggedUserId + " AND delete_status=0";
        } else {
            getAppsQ = getAppsQ + " WHERE delete_status=0";

        }
        let apps = await sql.query(getAppsQ);

        if (apps.length > 0) {
            let data = []
            for (var i = 0; i < apps.length; i++) {
                dta = {
                    apk_id: apps[i].id,
                    apk_name: apps[i].app_name,
                    logo: apps[i].logo,
                    apk: apps[i].apk,
                    package_name: apps[i].package_name,
                    version_name: apps[i].version_name,
                    guest: false,
                    encrypted: false,
                    enable: false,
                    apk_status: apps[i].status,
                    deleteable: (apps[i].apk_type == "permanent") ? false : true
                }
                data.push(dta);
            }

            return res.json({
                status: true,
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
    var verify = await verifyToken(req, res);

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


router.get('/get_app_permissions', async function (req, res) {
    var verify = await verifyToken(req, res);
    // console.log('get app permisiion si sdaf', verify.status)
    if (verify.status !== undefined && verify.status == true) {
        // console.log('id is the ', req.params);
        let loggedUserType = verify.user.user_type;
        // if (loggedUserType !== Constants.ADMIN) {
        let query = "select * from apps_info";

        sql.query(query, async (error, apps) => {

            if (error) throw error;
            // console.log(query, 'rslt  ', apps);
            let Extension = [];
            let onlyApps = [];
            for (let item of apps) {
                let subExtension = [];
                // console.log("extenstion id", item.extension_id);
                if (item.extension === 1 && item.extension_id === 0) {
                    // console.log('main', item)
                    Extension.push(item);
                }

                if (item.extension == 0 && item.visible == 1) {
                    onlyApps.push(item)
                }
            }

            let newExtlist = [];
            for (let ext of Extension) {
                let subExtension = [];

                for (let item of apps) {
                    // console.log(ext.id, item.extension_id);
                    if (ext.id === item.extension_id) {
                        //  console.log('sub ext item', item.guest)
                        // console.log(ext.unique_name, 'dfs',item.unique_name);
                        subExtension.push({
                            uniqueName: ext.unique_name,
                            uniqueExtension: item.unique_name,
                            guest: item.guest != undefined ? item.guest : 0,
                            label: item.label,
                            icon: item.icon,
                            encrypted: item.encrypted != undefined ? item.encrypted : 0,
                            id: item.id,
                            device_id: item.device_id,
                            app_id: item.id,
                            default_app: item.default_app
                        });
                    }

                }


                newExtlist.push({
                    uniqueName: ext.unique_name,
                    guest: ext.guest != undefined ? ext.guest : 0,
                    encrypted: ext.encrypted != undefined ? ext.encrypted : 0,
                    enable: ext.enable != undefined ? ext.enable : 0,
                    label: ext.label,
                    subExtension: subExtension,
                    extension: ext.extension,
                    default_app: ext.default_app,
                    visible: ext.visible

                })
            }


            res.send({
                status: true,
                extensions: newExtlist,
                appPermissions: onlyApps
            });
        })
    }
    // }

});

/** Get Device Details of Dealers (Connect Page) **/
router.get('/get_apps/:device_id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.device_id)) {
            // var query = 'SELECT user_apps.*, apps_info.label, apps_info.unique_name as uniqueName, apps_info.icon as icon from user_apps LEFT JOIN apps_info on user_apps.app_id = apps_info.id LEFT JOIN devices on user_apps.device_id=devices.id where devices.device_id ="' + req.params.device_id + '"';
            // console.log(query);
            var getAppsQ = "SELECT user_apps.id, user_apps.device_id, user_apps.app_id, user_apps.guest, user_apps.encrypted, user_apps.`enable`, " +
                " apps_info.label,apps_info.default_app,apps_info.visible, apps_info.unique_name as uniqueName, apps_info.icon as icon , apps_info.extension, apps_info.extension_id" +
                " FROM user_apps" +
                " LEFT JOIN apps_info on user_apps.app_id = apps_info.id" +
                " LEFT JOIN devices on user_apps.device_id=devices.id" +
                " WHERE devices.device_id = '" + req.params.device_id + "'"
            // console.log("get apps query", getAppsQ);
            try {
                sql.query(getAppsQ, async (error, apps) => {
                    if (error) {
                        throw Error("Query Expection");
                    }
                    // console.log('app list is ', apps);
                    let Extension = [];
                    let onlyApps = [];
                    let settings = [];
                    for (let item of apps) {
                        let subExtension = [];
                        // console.log("extenstion id", item.extension_id);
                        if (item.extension === 1 && item.extension_id === 0) {

                            Extension.push(item);
                        }
                        if (item.extension == 0 && item.visible == 1) {
                            onlyApps.push(item)
                        }
                        if (item.visible == 0) {

                            settings.push(item)
                        }
                    }

                    // console.log(onlyApps, 'onlu apps')

                    let newExtlist = [];
                    for (let ext of Extension) {
                        let subExtension = [];

                        for (let item of apps) {
                            // console.log(ext.app_id, ' ', item.visible);
                            if (ext.app_id === item.extension_id) {
                                //  console.log(ext.uniqueName);
                                subExtension.push({
                                    uniqueName: ext.uniqueName,
                                    uniqueExtension: item.uniqueName,
                                    guest: item.guest != undefined ? item.guest : 0,
                                    label: item.label,
                                    icon: item.icon,
                                    encrypted: item.encrypted != undefined ? item.encrypted : 0,
                                    id: item.id,
                                    device_id: item.device_id,
                                    app_id: item.app_id,
                                    default_app: item.default_app
                                });
                            }
                        }

                        // console.log('subextensiondsf ', subExtension)

                        newExtlist.push({
                            uniqueName: ext.uniqueName,
                            guest: ext.guest != undefined ? ext.guest : 0,
                            encrypted: ext.encrypted != undefined ? ext.encrypted : 0,
                            enable: ext.enable != undefined ? ext.enable : 0,
                            label: ext.label,
                            subExtension: subExtension,
                            visible: ext.visible,
                            default_app: ext.default_app,
                            extension: ext.extension

                        })
                    }
                    // console.log("apps length" + apps.length);
                    var query1 = 'SELECT * from user_app_permissions where device_id ="' + req.params.device_id + '" limit 1';
                    // 
                    sql.query(query1, async (error, controls) => {
                        if (error) {
                            throw Error("Query Expection");
                        }
                        if (controls.length > 0) {
                            // console.log("geting device app");
                            let cntrls = JSON.parse(controls[0].permissions);
                            //    consrols.push(settings);
                            res.send({
                                status: true,
                                app_list: onlyApps,
                                controls: { controls: cntrls, settings: settings },
                                extensions: newExtlist
                            });

                        } else {
                            res.send({
                                status: true,
                                app_list: onlyApps,
                                controls: controls,
                                extensions: newExtlist
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

// router.get('default_apps', async function (req, res) {
//     var verify = await verifyToken(req, res);
//     if (verify['status'] !== undefined && verify.status === true) {
//         var query = 'SELECT apps_info.label, apps_info.unique_name as uniqueName, apps_info.icon as icon from default_apps as apps_info ';
//         // console.log(query);
//         sql.query(query, async (error, apps) => {
//             if (error) {
//                 throw Error("Query Expection");
//             }

//             res.send({
//                 status: true,
//                 app_list: apps,

//             });

//         });

//     }
// })


router.put('/deleteUnlinkDevice', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let insertError = 0;
            let NotDeleted = [];
            let deletedDevices = [];
            let action = req.body.action
            console.log(req.body.devices, 'devicess sdf sd');
            // console.log('data for delte ', req.body.devices);
            for (let device of req.body.devices) {
                if (action == 'unlink') {
                    let deleteq = "UPDATE acc_action_history SET del_status='1' WHERE id='" + device.id + "' AND dealer_id = '" + verify.user.id + "' AND (action = 'UNLINKED' OR action = 'PRE-ACTIVATED')";
                    console.log('query is ', deleteq)
                    let resp = await sql.query(deleteq)
                    if (resp.affectedRows) {
                        deletedDevices.push(device.id);

                    }
                } else if (action == 'pre-active') {
                    let statusChangeQuery = "UPDATE usr_acc SET del_status='" + 1 + "' WHERE device_id='" + device.usr_device_id + "'";
                    // console.log(statusChangeQuery);
                    let resp = await sql.query(statusChangeQuery)
                    // console.log('response query is', resp);
                    if (resp.affectedRows) {
                        if (action == 'pre-active') {
                            await sql.query("UPDATE pgp_emails set user_acc_id = null , used = 0 where pgp_email ='" + device.pgp_email + "'")
                            await sql.query("UPDATE chat_ids set user_acc_id = null , used = 0 where chat_id ='" + device.chat_id + "'")
                            await sql.query("UPDATE sim_ids set user_acc_id = null , used = 0 where sim_id ='" + device.sim_id + "'")
                        }
                        deletedDevices.push(device.id);
                        // console.log('status Updated');
                        let deleteHistoryQuery = "UPDATE acc_action_history SET del_status='1' WHERE user_acc_id='" + device.id + "' AND dealer_id = '" + verify.user.id + "' AND (action = 'UNLINK' OR action = 'PRE-ACTIVATED')";
                        // console.log(deleteHistoryQuery);
                        await sql.query(deleteHistoryQuery)
                        // await device_helpers.saveActionHistory(device, Constants.UNLINK_DEVICE_DELETE);

                    }
                    else {
                        insertError += 1;
                        NotDeleted.push(device.id)
                    }
                }

            }

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

router.post('/save_policy', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {

            let policy_name = req.body.data.policy_name !== undefined ? req.body.data.policy_name : null;
            if (policy_name !== null) {
                let policy_note = req.body.data.policy_note !== undefined ? req.body.data.policy_note : null;
                let push_apps = req.body.data.push_apps !== undefined ? JSON.stringify(req.body.data.push_apps) : null;
                let app_list = req.body.data.app_list !== undefined ? JSON.stringify(req.body.data.app_list) : null;
                let secure_apps = req.body.data.secure_apps !== undefined ? JSON.stringify(req.body.data.secure_apps) : null;
                let system_permissions = req.body.data.system_permissions !== undefined ? JSON.stringify(req.body.data.system_permissions) : null;

                let loggedDealerId = verify.user.id;
                let loggedDealerType = verify.user.user_type;
                let connectedDealer = verify.user.connected_dealer;
                let checkExistingQ = "SELECT policy_name FROM policy WHERE policy_name='" + policy_name + "' ";
                // let checkExisting = await sql.query(checkExistingQ);

                if (loggedDealerType === ADMIN) {

                } else if (loggedDealerType === DEALER) {
                    let subDealerQ = "SELECT dealer_id FROM dealers WHERE connected_dealer=" + loggedDealerId;
                    let subDealers = await sql.query(subDealerQ);
                    let subDealerArray = [];
                    subDealers.map((dealer) => {
                        subDealerArray.push(dealer.dealer_id)
                    });
                    if (subDealerArray.length) {
                        checkExistingQ = checkExistingQ + " AND (dealer_type='" + ADMIN + "' OR dealer_id=" + loggedDealerId + " OR dealer_id in (" + subDealerArray.join() + "))"
                    } else {
                        checkExistingQ = checkExistingQ + " AND (dealer_type='" + ADMIN + "' OR dealer_id=" + loggedDealerId + " )"
                    }
                } else if (loggedDealerType === SDEALER) {
                    checkExistingQ = checkExistingQ + " AND (dealer_type='" + ADMIN + "' OR dealer_id=" + loggedDealerId + " OR dealer_id = " + connectedDealer + ")";
                }
                let checkExisting = await sql.query(checkExistingQ);
                if (checkExisting.length) {
                    data = {
                        status: false,
                        msg: 'Policy name has already been taken',

                    };
                    res.send(data);
                    return;
                }
                var command_name = '#' + policy_name.replace(/ /g, "_");

                var applyQuery = "INSERT INTO policy (policy_name, policy_note, command_name, app_list, push_apps, controls, permissions, dealer_id, dealer_type, dealers) VALUES ('" + policy_name + "', '" + policy_note + "', '" + command_name + "', '" + app_list + "', '" + push_apps + "', '" + system_permissions + "', '" + secure_apps + "', '" + loggedDealerId + "', '" + loggedDealerType + "', '[]')";

                sql.query(applyQuery, async function (err, rslts) {
                    if (err) throw err;
                    // console.log('query/........... ', applyQuery)

                    if (rslts.affectedRows) {
                        data = {
                            status: true,
                            msg: 'Policy Saved Successfully',

                        };
                    } else {
                        data = {
                            status: false,
                            msg: 'Policy Couldn\'t be saved'
                        }
                    }
                    res.send(data);
                    return;
                })
            } else {
                data = {
                    status: false,
                    msg: 'Policy Couldn\'t be saved'
                }
                res.send(data);
                return;
            }

        }
    } catch (error) {
        throw Error(error.message);
    }

});



router.post('/save/profile', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            console.log('body is', req.body)
            let name = req.body.profileName;
            let dealer_id = verify.user.id;
            let usr_acc_id = req.body.usr_acc_id;

            let app_list = (req.body.device_setting.app_list == undefined) ? '' : JSON.stringify(req.body.device_setting.app_list);

            let passwords = (req.body.device_setting.passwords == undefined) ? '' : JSON.stringify(req.body.device_setting.passwords);


            let controls = (req.body.device_setting.controls == undefined) ? '' : JSON.stringify(req.body.device_setting.controls);

            let permissions = (req.body.device_setting.extensions == undefined) ? '' : JSON.stringify(req.body.device_setting.extensions);

            var query = "select id from usr_acc_profile where profile_name = '" + name + "'";

            let result = await sql.query(query);


            if (result.length == 0 || name == '') {
                var applyQuery = "insert into usr_acc_profile (profile_name,dealer_id, user_acc_id, app_list,permissions, controls,passwords) values ('" + name + "', '" + dealer_id + "','" + usr_acc_id + "','" + app_list + "','" + permissions + "', '" + controls + "', '" + passwords + "')";
                // console.log('query insert', applyQuery);
                console.log(applyQuery, 'thats it');

                sql.query(applyQuery, async function (err, rslts) {
                    if (err) throw err;
                    // console.log(rslts, 'rslt is query')
                    if (rslts.affectedRows) {
                        data = {
                            "status": true,
                            "msg": 'Profile Saved Successfully',
                            "data": rslts
                        };
                        res.send(data);
                    } else {
                        data = {
                            "status": false,
                            "msg": 'Profile Name is already Exist',
                        };
                        res.send(data);
                    }


                });

            } else {
                data = {
                    "status": false,
                    "msg": 'Profile Name is already Exist',
                };
                res.send(data);
            }

        }
    } catch (error) {
        throw Error(error.message);
    }
});

router.post('/apply_settings/:device_id', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let device_id = req.params.device_id;

            let usrAccId = req.body.usr_acc_id;

            let dealer_id = verify.user.id

            let device_setting = req.body.device_setting;
            // console.log('app list length',device_setting.app_list.length)

            let app_list = (device_setting.app_list === undefined) ? '' : JSON.stringify(device_setting.app_list);

            let passwords = (device_setting.passwords === undefined) ? '' : JSON.stringify(device_setting.passwords);

            let controls = (req.body.device_setting.controls == undefined) ? '' : JSON.stringify(req.body.device_setting.controls);
            // console.log("hello controls", controls);
            let subExtensions = (req.body.device_setting.subExtensions == undefined) ? '' : JSON.stringify(req.body.device_setting.subExtensions);

            var applyQuery = "insert into device_history (device_id,dealer_id,user_acc_id, app_list, passwords, controls, permissions) values ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + app_list + "', '" + passwords + "', '" + controls + "', '" + subExtensions + "')";

            await sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    throw err;
                }

                let isOnline = await device_helpers.isDeviceOnline(device_id);
                let permissions = subExtensions;

                if (isOnline) {
                    require("../bin/www").sendEmit(app_list, passwords, controls, permissions, device_id);
                }

                if (rslts) {
                    data = {
                        "status": true,
                        "msg": 'Settings Applied Successfully',
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": 'Error while Processing',
                    };
                    res.send(data);
                }

            });

        }
    } catch (error) {
        throw Error(error.message);
    }

});

router.post('/apply_pushapps/:device_id', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let device_id = req.params.device_id;

            let dealer_id = verify.user.id

            let usrAccId = req.body.usrAccId;

            let push_apps = req.body.push_apps;

            let apps = (push_apps === undefined) ? '' : JSON.stringify(push_apps);

            var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, push_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + apps + "', 'push_apps')";

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    throw err;
                }
                if (rslts) {

                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                    await sql.query(loadDeviceQ)
                    if (isOnline) {

                        require("../bin/www").applyPushApps(apps, device_id);
                        data = {
                            "status": true,
                            "online": true
                        };
                    }
                    else {
                        require("../bin/www").applyPushApps(apps, device_id);
                        data = {
                            "status": true,
                        };
                    }
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": 'Error while Processing',
                    };
                    res.send(data);
                }

            });

        }
    } catch (error) {
        throw Error(error.message);
    }
});

router.post('/apply_policy/:device_id', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let device_id = req.params.device_id;
            let dealer_id = verify.user.id
            let userAccId = req.body.userAccId;
            let policy_id = req.body.policyId;
            if (device_id !== null || device_id !== '' || device_id !== undefined || device_id !== 'undefined' || policy_id !== null || policy_id !== '' || policy_id !== undefined || policy_id !== 'undefined') {

                let getPolicyQ = "SELECT * FROM policy WHERE id =" + policy_id;
                let policy = await sql.query(getPolicyQ)

                if (policy.length) {
                    policy = helpers.refactorPolicy(policy);

                    var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, app_list, controls, permissions, push_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + userAccId + ", '" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy')";
                    sql.query(applyQuery, async function (err, policyApplied) {
                        if (err) {
                            throw err;
                        }

                        if (policyApplied && policyApplied.affectedRows) {

                            let isOnline = await device_helpers.isDeviceOnline(device_id, policy[0]);
                            var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                            await sql.query(loadDeviceQ)
                            if (isOnline) {
                                require("../bin/www").getPolicy(device_id, policy[0]);

                                data = {
                                    status: true,
                                    online: true,
                                };
                            } else {
                                require("../bin/www").getPolicy(device_id, policy[0]);
                                data = {
                                    status: true,

                                };
                            }
                            res.send(data);
                            return;
                        } else {
                            data = {
                                status: false,
                                msg: 'Error while Processing',
                            };
                            res.send(data);
                        }

                    });
                } else {

                }
            }
        }
    } catch (error) {
        throw Error(error.message);
    }
});

router.post('/apply_pullapps/:device_id', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let device_id = req.params.device_id;

            let usrAccId = req.body.usrAccId;

            let dealer_id = verify.user.id
            let pull_apps = req.body.pull_apps;

            let apps = (pull_apps === undefined) ? '' : JSON.stringify(pull_apps);

            var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, pull_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + apps + "', 'pull_apps')";

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    throw err;
                }
                if (rslts) {

                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                    await sql.query(loadDeviceQ)
                    if (isOnline) {
                        data = {
                            "status": true,
                            "online": true
                        };
                    } else {
                        data = {
                            "status": true,
                        };
                    }
                    res.send(data);
                    require("../bin/www").getPullApps(apps, device_id);
                } else {
                    data = {
                        "status": false,
                        "msg": 'Error while Processing',
                    };
                    res.send(data);
                }

            });

        }
    } catch (error) {
        throw Error(error.message);
    }
});

router.post('/get_profiles', async function (req, res) {
    var verify = await verifyToken(req, res);
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

router.get('/get_policies', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status === true) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);
        //   console.log('user id si', user_acc_id);
        let where = "";
        let isValid = true;
        let policies = [];

        if (user_acc_id != undefined || user_acc_id != '' || user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

        } else {
            isValid = false;
        }
        if (isValid) {
            if (verify.user.user_type === ADMIN) {
                let query = "SELECT * FROM policy where delete_status=0";
                sql.query(query, async (error, results) => {
                    if (results.length) {
                        let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                        let dealerCount = await helpers.dealerCount(adminRoleId);

                        for (var i = 0; i < results.length; i++) {
                            // console.log('push apps', results[i].push_apps)
                            let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
                            let controls = (results[i].controls !== undefined && results[i].controls !== null) ? JSON.parse(results[i].controls) : JSON.parse('[]');
                            let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : JSON.parse('[]');
                            let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : JSON.parse('[]');
                            let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : JSON.parse('[]');
                            let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                            let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                            dta = {
                                id: results[i].id,
                                policy_name: results[i].policy_name,
                                policy_note: results[i].policy_note,
                                status: results[i].status,
                                dealer_permission: permissions,
                                permission_count: permissionC,
                                // app_list: results[i].apk_list,
                                command_name: results[i].command_name,
                                controls: controls,
                                secure_apps: secure_apps,
                                push_apps: push_apps,
                                app_list: app_list2,
                                dealer_id: results[i].dealer_id
                            }
                            policies.push(dta);
                        }
                    }
                    data = {
                        "status": true,
                        "msg": 'successful',
                        "policies": policies
                    };
                    // console.log(data);
                    res.send(data);
                });
            } else {
                sql.query("select policy.* from policy left join dealer_policies on policy.id = dealer_policies.policy_id where (dealer_policies.dealer_id='" + verify.user.id + "' OR policy.dealer_id = " + verify.user.id + ") AND policy.delete_status=0", async function (error, results) {

                    if (error) throw error;
                    if (results.length > 0) {
                        // console.log(results);
                        let dealerRole = await helpers.getuserTypeIdByName(Constants.DEALER);
                        let default_policy = await sql.query("SELECT * from default_policies WHERE dealer_id = '" + userId + "'")
                        let default_policy_id = (default_policy.length) ? default_policy[0].policy_id : null

                        let sdealerList = await sql.query("select count(*) as dealer_count ,dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                        let dealerCount = sdealerList[0].dealer_count;
                        for (var i = 0; i < results.length; i++) {
                            let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
                            let Sdealerpermissions = permissions.filter(function (item) {
                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (item === sdealerList[i].dealer_id) {
                                        return item
                                    }
                                }
                            })
                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                            let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                            let controls = (results[i].controls !== undefined && results[i].controls !== 'undefined' && results[i].controls !== null) ? JSON.parse(results[i].controls) : JSON.parse('[]');
                            let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== 'undefined' && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : JSON.parse('[]');
                            let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== 'undefined' && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : JSON.parse('[]');
                            let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== 'undefined' && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : JSON.parse('[]');
                            let is_default = (results[i].id === default_policy_id) ? true : false
                            dta = {
                                id: results[i].id,
                                policy_name: results[i].policy_name,
                                policy_note: results[i].policy_note,
                                status: results[i].status,
                                dealer_permission: permissions,
                                permission_count: permissionC,
                                // app_list: results[i].apk_list,
                                command_name: results[i].command_name,
                                controls: controls,
                                secure_apps: secure_apps,
                                push_apps: push_apps,
                                app_list: app_list2,
                                is_default: is_default,
                                dealer_id: results[i].dealer_id
                            }
                            policies.push(dta);
                        }
                        return res.json({
                            "status": true,
                            "msg": 'successful',
                            "policies": policies
                        });

                    } else {
                        data = {
                            status: false,
                            msg: "No result found",
                            policies: []
                        }
                        res.send(data);
                    }
                });
            }
        } else {
            data = {
                "status": false,
                "msg": 'Invalid User',
                "policies": []
            };
            res.send(data);
        }
    }

});


router.post('/change_policy_status', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status === true) {
        let id = req.body.id;
        let value = req.body.value == true ? 1 : 0;
        let key = req.body.key;

        let query = "UPDATE policy SET " + key + " = '" + value + "' WHERE id='" + id + "'";


        sql.query(query, (error, result) => {

            if (error) throw error;
            // console.log(result, 'relstsdf')
            if (result.affectedRows) {
                data = {
                    "status": true,
                    "msg": 'successful'
                };
                res.send(data);
            } else {
                data = {
                    "status": false,
                    "msg": 'error'
                };
                res.send(data);
            }

        });
    }
})

router.post('/save_policy_changes', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status === true) {
        // console.log('body of kth e', req.body);
        let record = req.body;
        let id = record.id;
        let push_apps = record.push_apps;
        let controls = record.controls;
        let permissions = record.permissions;
        let app_list = record.app_list;
        // console.log('id id', id)

        let query = "UPDATE policy SET push_apps = '" + push_apps + "', controls = '" + controls + "', permissions = '" + permissions + "', app_list = '" + app_list + "' WHERE id='" + id + "'";
        // console.log('qerury', query)
        sql.query(query, (error, result) => {
            // console.log(result, 'relstsdf');
            if (error) throw error;
            if (result.affectedRows) {
                data = {
                    "status": true,
                    "msg": 'Policy Updated Successfully'
                };
                res.send(data);
            } else {
                data = {
                    "status": false,
                    "msg": 'error'
                };
                res.send(data);
            }

        });
    }
})


router.post('/get_device_history', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);

        let where = " WHERE ";

        if (user_acc_id != undefined && user_acc_id != '' && user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

            let query = "SELECT * FROM device_history " + where;
            sql.query(query, (error, result) => {
                data = {
                    "status": true,
                    "msg": 'successful',
                    "profiles": result
                };
                res.send(data);
            });

        } else {
            where = "";
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
    var verify = await verifyToken(req, res);
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
    // console.log("Working")
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var selectedValue = req.body.selectedValue;
        var dropdownType = req.body.pageName;
        var dealer_id = verify.user.id;
        var squery = "select * from dealer_pagination where dealer_id = " + dealer_id + " AND type ='" + dropdownType + "'";
        var srslt = await sql.query(squery);

        if (srslt.length == 0) {
            var squery = sql.query("insert into dealer_pagination (dealer_id, record_per_page, type) values (" + dealer_id + ", '" + selectedValue + "', '" + dropdownType + "')", function (err, rslts) {
                data = {
                    status: true,
                    msg: 'record Added.',
                    data: rslts
                };
                res.send(data);
            });
        } else {

            sql.query("update dealer_pagination set record_per_page = '" + selectedValue + "' where type='" + dropdownType + "' AND dealer_id='" + dealer_id + "'", function (err, row) {
                // console.log('squery data ', 'rowws', row);
                if (row && row.affectedRows !== 0) {
                    data = {
                        status: true,
                        msg: 'Items Updated.',
                        data: row
                    };

                    res.send(data);
                } else {
                    data = {
                        status: false,
                        msg: 'Items Not Updated.',
                        data: row
                    };
                    res.send(data);

                }
            });
        }
    }
});

router.get('/dealer/getPagination/:dropdownType', async function (req, res) {
    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
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



router.post('/save_new_data', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let error = 0;
        if (req.body.type == 'sim_id') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
                if (!result.affectedRows) {
                    error += 1;
                }
            }
        } else if (req.body.type == 'chat_id') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE chat_ids (chat_id) value ('" + row.chat_id + "')");
                if (!result.affectedRows) {
                    error += 1;
                }
            }
        } else if (req.body.type == 'pgp_email') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE pgp_emails (pgp_email) value ('" + row.pgp_email + "')");
                if (!result.affectedRows) {
                    error += 1;
                }
            }
        }

        if (error == 0) {
            res.send({
                "status": true,
                "msg": "Inserted Successfully"
            })

        } else {
            res.send({
                "status": false,
                "msg": "Error While Insertion, " + error + " records not Inserted"
            })
        }
        //    let newData = req.body.
    }
});

// import sims
router.post('/import/:fieldName', async (req, res) => {
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = await verifyToken(req, res);
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
                // console.log("success file name", filename);
                var workbook = XLSX.readFile('uploads/' + filename);

                workbook.SheetNames.forEach(async (sheet) => {
                    let singleSheet = workbook.Sheets[sheet];
                    let parsedData = XLSX.utils.sheet_to_json(singleSheet, {
                        raw: true
                    });
                    if (fieldName == "sim_ids") {
                        let error = false;
                        let duplicatedSimIds = [];
                        let InsertableSimIds = [];
                        let isSimId = parsedData.findIndex(
                            obj => Object.keys(obj).includes('sim_id')
                        ) !== -1;
                        let isStartDate = parsedData.findIndex(
                            obj => Object.keys(obj).includes('start_date')
                        ) !== -1;

                        let isExpiryDate = parsedData.findIndex(
                            obj => Object.keys(obj).includes('expiry_date')
                        ) !== -1;

                        if (isSimId && isStartDate && isExpiryDate) {

                        } else {
                            res.send({
                                status: false,
                                msg: "Incorrect file data",
                                "duplicateData": [],
                            })
                        }

                        let sim = []
                        for (let row of parsedData) {
                            sim.push(row.sim_id)
                        }
                        let slctQ = "SELECT sim_id, start_date, expiry_date from sim_ids WHERE sim_id IN (" + sim + ")";
                        let dataof = await sql.query(slctQ);
                        if (dataof.length) {
                            // console.log(parsedData, 'daata of', dataof);

                            for (let row of parsedData) {

                                let index = dataof.findIndex((item) => item.sim_id == row.sim_id);

                                if (index >= 0) {
                                    duplicatedSimIds.push(row)
                                } else {
                                    InsertableSimIds.push(row)
                                }
                            }
                        }

                        if (duplicatedSimIds.length == 0) {
                            for (let row of parsedData) {
                                if (row.sim_id && row.start_date && row.expiry_date) {
                                    let result = await sql.query("INSERT sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
                                } else {
                                    error = true;
                                }
                            }
                        }

                        // console.log('duplicate data is', duplicatedSimIds)

                        if (!error && duplicatedSimIds.length === 0) {
                            res.send({
                                "status": true,
                                "msg": "imported successfully",
                                "type": "sim_id",
                                "duplicateData": [],
                            });
                        } else {
                            res.send({
                                "status": false,
                                "msg": "File contained invalid data that has been ignored, rest has been imported successfully.",
                                "type": "sim_id",
                                "duplicateData": duplicatedSimIds,
                                "newData": InsertableSimIds


                            });
                        }

                        return;
                    } else if (fieldName === "chat_ids") {
                        let error = false;
                        let duplicatedChat_ids = [];
                        let InsertableChat_ids = [];

                        let isChatId = parsedData.findIndex(
                            obj => Object.keys(obj).includes('chat_id')
                        ) !== -1;

                        if (isChatId) {

                        } else {
                            res.send({
                                status: false,
                                msg: "Incorrect file data",
                                "duplicateData": [],
                            })
                        }



                        let chat_ids = []
                        for (let row of parsedData) {
                            chat_ids.push(row.chat_id.toString())
                        }
                        let slctQ = "SELECT chat_id from chat_ids WHERE chat_id IN (" + chat_ids + ")";
                        let dataof = await sql.query(slctQ);
                        if (dataof.length) {
                            // console.log(parsedData, 'daata of', dataof);

                            for (let row of parsedData) {

                                let index = dataof.findIndex((item) => item.chat_id == row.chat_id);

                                if (index >= 0) {
                                    duplicatedChat_ids.push(row)
                                } else {
                                    InsertableChat_ids.push(row)
                                }
                            }
                        }

                        if (duplicatedChat_ids.length == 0) {
                            for (let row of parsedData) {
                                if (row.chat_id) {
                                    let result = await sql.query("INSERT sim_ids (chat_id) value ('" + row.chat_id + "')");
                                } else {
                                    error = true;
                                }
                            }
                        }

                        // console.log('duplicate data is', duplicatedChat_ids)

                        if (!error && duplicatedChat_ids.length === 0) {
                            res.send({
                                "status": true,
                                "msg": "imported successfully",
                                "type": "chat_id",
                                "duplicateData": [],
                            });
                        } else {
                            res.send({
                                "status": false,
                                "msg": "File contained invalid data that has been ignored, rest has been imported successfully.",
                                "type": "chat_id",
                                "duplicateData": duplicatedChat_ids,
                                "newData": InsertableChat_ids

                            });
                        }

                        return;
                    } else if (fieldName === "pgp_emails") {
                        let error = false;
                        let duplicatedPgp_emails = [];
                        let InsertablePgp_emails = [];

                        let isPgpEmail = parsedData.findIndex(
                            obj => Object.keys(obj).includes('pgp_email')
                        ) !== -1;

                        if (isPgpEmail) {

                        } else {
                            res.send({
                                status: false,
                                msg: "Incorrect file data",
                                "duplicateData": [],
                            })
                        }

                        let pgp_emails = []
                        for (let row of parsedData) {
                            pgp_emails.push(row.pgp_email)
                        }
                        let slctQ = "SELECT pgp_email from pgp_emails WHERE pgp_email IN (" + pgp_emails.map(item => { return "'" + item + "'" }) + ")";
                        // console.log('pgp query', slctQ)
                        let dataof = await sql.query(slctQ);
                        if (dataof.length) {
                            // console.log(parsedData, 'daata of', dataof);

                            for (let row of parsedData) {

                                let index = dataof.findIndex((item) => item.pgp_email == row.pgp_email);

                                if (index >= 0) {
                                    duplicatedPgp_emails.push(row)
                                } else {
                                    InsertablePgp_emails.push(row)
                                }
                            }
                        }

                        if (duplicatedPgp_emails.length == 0) {
                            for (let row of parsedData) {
                                if (row.pgp_email) {
                                    let result = await sql.query("INSERT pgp_emails (pgp_email) value ('" + row.pgp_email + "')");
                                } else {
                                    error = true;
                                }
                            }
                        }

                        // console.log('duplicate data is', duplicatedPgp_emails)

                        if (!error && duplicatedPgp_emails.length === 0) {
                            res.send({
                                "status": true,
                                "msg": "imported successfully",
                                "type": "pgp_email",
                                "duplicateData": [],
                            });
                        } else {
                            res.send({
                                "status": false,
                                "msg": "File contained invalid data that has been ignored, rest has been imported successfully.",
                                "type": "pgp_email",
                                "duplicateData": duplicatedPgp_emails,
                                "newData": InsertablePgp_emails

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
    var verify = await verifyToken(req, res);
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
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from sim_ids where used=0";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    } else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }

});
router.get('/get_used_sim_ids', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from sim_ids where used=1";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }
});


router.get('/get_chat_ids', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from chat_ids where used=0";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    } else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }
});
router.get('/get_used_chat_ids', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from chat_ids where used=1";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }
});

router.get('/get_pgp_emails', async (req, res) => {
    var verify = await verifyToken(req, res);
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
    else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }
});
router.get('/get_used_pgp_emails', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from pgp_emails where used=1 AND user_acc_id is null";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }
});
router.get('/get_used_sim_ids', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from sim_ids where used=1 AND user_acc_id is null";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }
});
router.get('/get_used_chat_ids', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from chat_ids where used=1 AND user_acc_id is null";
        sql.query(query, (error, resp) => {
            res.send({
                status: false,
                msg: "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }
});
router.post('/releaseCSV/:fieldName', async (req, res) => {
    var verify = await verifyToken(req, res);
    var fieldName = req.params.fieldName
    var ids = req.body.ids
    if (verify['status'] !== undefined && verify.status === true) {
        // console.log(fieldName, ids);
        if (fieldName === 'pgp_email') {
            let query = "UPDATE pgp_emails set used = 0 ,user_acc_id = null where id IN (" + ids.join() + ")";
            // console.log(query);
            sql.query(query, (error, resp) => {
                if (error) throw error
                if (resp.affectedRows) {
                    let query = "select * from pgp_emails where used=1";
                    sql.query(query, (error, resp) => {
                        res.send({
                            status: true,
                            type: 'pgp',
                            msg: "CSV Released Successfully.",
                            data: resp
                        });
                    });
                } else {
                    res.send({
                        status: false,
                        msg: "CSV Not Released.",
                    });
                }
            });
        }
        else if (fieldName === 'sim_id') {
            let query = "UPDATE sim_ids set used = 0 ,user_acc_id = null where id IN (" + ids.join() + ")";
            // console.log(query);
            sql.query(query, (error, resp) => {
                if (error) throw error
                if (resp.affectedRows) {
                    let query = "select * from sim_ids where used=1";
                    sql.query(query, (error, resp) => {
                        res.send({
                            status: true,
                            type: 'sim',
                            msg: "CSV Released Successfully.",
                            data: resp
                        });
                    });
                } else {
                    res.send({
                        status: true,
                        msg: "CSV Not Released.",
                    });
                }
            });
        }
        else if (fieldName === 'chat_id') {
            let query = "UPDATE chat_ids set used = 0 ,user_acc_id = null where id IN (" + ids.join() + ")";
            // console.log(query);
            sql.query(query, (error, resp) => {
                if (error) throw error
                if (resp.affectedRows) {

                    let query = "select * from chat_ids where used=1";
                    sql.query(query, (error, resp) => {
                        res.send({
                            status: true,
                            type: 'chat',
                            msg: "CSV Released Successfully.",
                            data: resp
                        });
                    });
                } else {
                    res.send({
                        status: false,
                        msg: "CSV Not Released.",
                    });
                }
            });
        }
    }
});


/** Get Apk List Admin Panel **/

router.get('/apklist', async function (req, res) {
    var verify = await verifyToken(req, res);
    var data = [];
    if (verify.status !== undefined && verify.status == true) {
        if (verify.user.user_type === ADMIN) {
            sql.query("select * from apk_details where delete_status=0 order by id ASC", async function (error, results) {
                if (error) throw error;

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
        else if (verify.user.user_type === DEALER) {
            sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "'", async function (error, results) {
                if (error) throw error;
                if (results.length > 0) {
                    let dealerRole = await helpers.getuserTypeIdByName(Constants.DEALER);
                    console.log("Role", dealerRole);

                    let sdealerList = await sql.query("select count(*) as dealer_count ,dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                    // console.log(sdealerList);
                    let dealerCount = sdealerList[0].dealer_count;
                    // console.log("dealer_count ", dealerCount);
                    for (var i = 0; i < results.length; i++) {
                        let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
                        let Sdealerpermissions = permissions.filter(function (item) {
                            for (let i = 0; i < sdealerList.length; i++) {
                                if (item === sdealerList[i].dealer_id) {
                                    return item
                                }
                            }
                        })
                        // console.log(Sdealerpermissions);
                        let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                        let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        dta = {
                            "apk_id": results[i].id,
                            "apk_name": results[i].app_name,
                            "logo": results[i].logo,
                            "apk": results[i].apk,
                            "permissions": Sdealerpermissions,
                            "apk_status": results[i].status,
                            "permission_count": permissionC,
                            // "deleteable": (results[i].apk_type == "permanent") ? false : true
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


    }
});


// upload test apk
router.post('/addApk', async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = await verifyToken(req, res);
    //  console.log('verify', verify.status);
    if (verify.status !== undefined && verify.status == true) {
        let fileUploaded = false;

        let filename = "";
        let mimeType = "";
        let fieldName = "";


        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './uploads');
            },

            filename: function (req, file, callback) {
                mimeType = file.mimetype;
                fieldName = file.fieldname;
                var filetypes = /jpeg|jpg|apk|png/;

                console.log('files', req.files, file);

                // let data = fs.readFile(req.files.apk.path,'utf8');
                // console.log("file", data);

                if (fieldName === Constants.LOGO && filetypes.test(mimeType)) {
                    fileUploaded = true;
                    filename = fieldName + '-' + Date.now() + '.jpg';

                    callback(null, filename);
                } else if (fieldName === Constants.APK && mimeType === "application/vnd.android.package-archive") {
                    fileUploaded = true;
                    filename = fieldName + '-' + Date.now() + '.apk';
                    // apk manifest should be check here
                    // helpers.getAPKVersionCode(req.files.apk);
                    callback(null, filename);
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

        upload(req, res, async function (err) {
            if (err) {
                return res.send({
                    status: false,
                    msg: "Error while Uploading"
                });
            }

            if (fileUploaded) {

                if (fieldName === Constants.APK) {
                    let file = path.join(__dirname, "../uploads/" + filename);
                    let versionCode = await helpers.getAPKVersionCode(file);
                    console.log("version code", versionCode);
                    if (versionCode) {

                        data = {
                            status: true,
                            msg: 'Uploaded Successfully',
                            fileName: filename,
                        };
                        res.send(data);
                        return;
                    } else {
                        data = {
                            status: false,
                            msg: "Error while Uploading",
                        };
                        res.send(data);
                        return;
                    }

                } else if (fieldName === Constants.LOGO) {
                    data = {
                        status: true,
                        msg: 'Uploaded Successfully',
                        fileName: filename,
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: "Error while Uploading"
                    }
                    res.send(data);
                    return;
                }
            } else {
                data = {
                    status: false,
                    msg: "Error while Uploading",
                };
                res.send(data);
                return;
            }
        });
    }
});

// add apk. endpoints name should be changed
router.post('/upload', async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = await verifyToken(req, res);

    if (verify['status'] && verify.status == true) {
        try {
            if (req.body.logo !== '' && req.body.apk !== '' && req.body.name !== '') {
                let apk = req.body.apk;
                let file = path.join(__dirname, "../uploads/" + apk);
                if (fs.existsSync(file)) {
                    let versionCode = await helpers.getAPKVersionCode(file);
                    let versionName = await helpers.getAPKVersionName(file);
                    // let label = helpers.getAPKLabel(file);
                    let packageName = await helpers.getAPKPackageName(file);
                    console.log("versionName", versionName);
                    // let details = JSON.stringify(helpers.getAPKDetails(file));
                    let details = null;

                    console.log("file size in format", formatByte)
                    if (versionCode && versionName && packageName) {
                        let apk_name = req.body.name;
                        let logo = req.body.logo;
                        let apk_stats = fs.statSync(file);

                        let formatByte = helpers.formatBytes(apk_stats.size);
                        sql.query("INSERT INTO apk_details (app_name, logo, apk, version_code, version_name, package_name, details, apk_bytes, apk_size) VALUES ('" + apk_name + "' , '" + logo + "' , '" + apk + "', '" + versionCode + "', '" + versionName + "', '" + packageName + "', '" + details + "', " + apk_stats.size + ", '" + formatByte + "')", function (err, rslts) {

                            if (err) throw err;
                            data = {
                                status: true,
                                msg: "Apk is uploaded"
                            };
                            res.send(data);
                            return;

                        });
                    } else {
                        console.log("file not found");
                        res.send({
                            status: false,
                            msg: "Error While Uploading"
                        })
                        return;
                    }
                } else {
                    console.log("file not found");
                    res.send({
                        status: false,
                        msg: "Error While Uploading"
                    })
                    return;
                }

            } else {
                data = {
                    status: false,
                    msg: "Error While Uploading"
                };
                res.send(data);
                return;
            }
        } catch (error) {
            data = {
                status: false,
                msg: "Error while Uploading",
            };
            return;
        }

    }
});


/** Edit Apk (Admin panel) **/
router.post('/edit/apk', async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = await verifyToken(req, res);
    if (verify['status'] && verify.status == true) {
        try {
            if (req.body.logo !== '' && req.body.apk !== '' && req.body.name !== '') {
                let apk = req.body.apk;
                let file = path.join(__dirname, "../uploads/" + apk);
                if (fs.existsSync(file)) {

                    let versionCode = await helpers.getAPKVersionCode(file);
                    let versionName = await helpers.getAPKVersionName(file);
                    let packageName = await helpers.getAPKPackageName(file);
                    // let details = JSON.stringify(helpers.getAPKDetails(file));
                    let details = null;
                    if (versionCode && versionName && packageName) {
                        let apk_name = req.body.name;
                        let logo = req.body.logo;
                        sql.query("update apk_details set app_name = '" + apk_name + "', logo = '" + logo + "', apk = '" + apk + "', version_code = '" + versionCode + "', version_name = '" + versionName + "', package_name='" + packageName + "', details='" + details + "'  where id = '" + req.body.apk_id + "'", function (err, rslts) {

                            if (err) throw err;
                            data = {
                                status: true,
                                msg: "Record Updated"

                            };
                            res.send(data);
                            return;
                        });

                    } else {
                        data = {
                            status: false,
                            msg: "Error While Uploading"
                        };
                        res.send(data);
                        return;
                    }
                } else {
                    data = {
                        status: false,
                        msg: "Error While Uploading"
                    };
                    res.send(data);
                    return;
                }

            } else {
                data = {
                    status: false,
                    msg: "Error While Uploading"
                };
                res.send(data);
                return;
            }
        } catch (error) {
            data = {
                status: false,
                msg: "Error while Uploading",
            };
            res.send(data);
            return;
        }
    }

});

/** Toggle Apk Admin Panel (On / Off) **/
router.post('/toggle', async function (req, res) {
    var verify = await verifyToken(req, res);

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

/** Save apk Permissions**/
router.post('/save_apk_permissions', async function (req, res) {
    var verify = await verifyToken(req, res);
    // console.log(req.body.action);
    if (verify['status'] !== undefined && verify.status == true) {
        var action = req.body.action
        let apkId = req.body.apkId;
        let dealers = req.body.dealers;

        let prevPermissions = await sql.query("select dealers from apk_details WHERE id = " + apkId);
        // console.log(apkId,'query id ', prevPermissions)
        let prevParsDealers = (prevPermissions[0].dealers !== null) ? JSON.parse(prevPermissions[0].dealers) : [];
        // console.log("prevParsDelaer", prevParsDealers);

        if (action === 'save') {
            var parsedDealers = JSON.parse(dealers);
            console.log("hello parsed", parsedDealers);

            for (let i = 0; i < parsedDealers.length; i++) {
                if (prevParsDealers.indexOf(parsedDealers[i]) === -1) {
                    prevParsDealers.push(parsedDealers[i])
                }
            }
            let parsedCombineArray = JSON.stringify(prevParsDealers)
            let updateAPKQ = "UPDATE apk_details set dealers = '" + parsedCombineArray + "' WHERE id=" + apkId;

            if (prevParsDealers.length) {
                let deleteNotIn = "DELETE FROM dealer_apks WHERE dealer_id NOT IN (" + prevParsDealers.join() + ") AND apk_id = " + apkId;
                // console.log(deleteNotIn);
                await sql.query(deleteNotIn);
                let insertQuery = "INSERT IGNORE INTO dealer_apks (dealer_id, apk_id) VALUES ";

                let insertOrIgnore = ' '
                for (let i = 0; i < prevParsDealers.length; i++) {
                    if (i === prevParsDealers.length - 1) {
                        insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + apkId + ")"
                    } else {
                        insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + apkId + "),"
                    }
                }
                await sql.query(insertQuery + insertOrIgnore);
                // console.log(insertQuery + insertOrIgnore);
            }

            sql.query(updateAPKQ, async (error, result) => {
                if (error) throw (error);
                let permissionC = [];
                let rslt = await sql.query("select dealers from apk_details where id='" + apkId + "' order by id ASC")
                if (rslt !== undefined && rslt !== null) {
                    if (rslt.length) {
                        let permission = JSON.parse(rslt[0].dealers);
                        console.log("Verify user id", verify.user.user_type);
                        if (verify.user.user_type === Constants.ADMIN) {
                            if (permission !== undefined && permission !== null && permission !== '[]') {
                                let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                                let dealerCount = await helpers.dealerCount(adminRoleId);
                                permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();

                            }
                        }
                        else if (verify.user.user_type === Constants.DEALER) {
                            let sdealerList = await sql.query("select count(*) as dealer_count ,dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList[0].dealer_count;
                            console.log("dasda", dealerCount);
                            let Sdealerpermissions = permission.filter(function (item) {
                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (item === sdealerList[i].dealer_id) {
                                        return item
                                    }
                                }
                            })
                            console.log("sadasdsad", Sdealerpermissions);
                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                            permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        }
                    }
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
        } else {
            console.log(dealers);
            dealers = JSON.parse(dealers);
            for (let i = 0; i < dealers.length; i++) {
                var index = prevParsDealers.indexOf(dealers[i]);
                console.log("array index", index);
                if (index > -1) {
                    prevParsDealers.splice(index, 1);
                }
            }
            console.log(prevParsDealers);
            let toDeleteDealers = (prevParsDealers.length > 0) ? prevParsDealers.join() : '""';

            let updateAPKQ = "UPDATE apk_details set dealers = '" + JSON.stringify(prevParsDealers) + "' WHERE id=" + apkId;
            if (dealers.length) {
                let deleteNotIn = "DELETE FROM dealer_apks WHERE dealer_id NOT IN (" + toDeleteDealers + ") AND apk_id = " + apkId;
                console.log(deleteNotIn);
                await sql.query(deleteNotIn);
                if (prevParsDealers.length > 0) {
                    let insertQuery = "INSERT IGNORE INTO dealer_apks (dealer_id, apk_id) VALUES";

                    let insertOrIgnore = ' '
                    for (let i = 0; i < prevParsDealers.length; i++) {
                        if (i === prevParsDealers.length - 1) {
                            insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + apkId + ")"
                        } else {
                            insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + apkId + "),"
                        }
                    }
                    console.log(insertQuery + insertOrIgnore);
                    await sql.query(insertQuery + insertOrIgnore);

                }
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
                        console.log("Verify user id", verify.user.user_type);
                        if (verify.user.user_type === Constants.ADMIN) {
                            if (permission !== undefined && permission !== null && permission !== '[]') {
                                let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                                let dealerCount = await helpers.dealerCount(adminRoleId);
                                permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();

                            }
                        }
                        else if (verify.user.user_type === Constants.DEALER) {
                            let sdealerList = await sql.query("select count(*) as dealer_count ,dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList[0].dealer_count;
                            console.log("dasda", dealerCount);
                            let Sdealerpermissions = permission.filter(function (item) {
                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (item === sdealerList[i].dealer_id) {
                                        return item
                                    }
                                }
                            })
                            console.log("sadasdsad", Sdealerpermissions);
                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                            permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        }
                    };

                }
                if (result.affectedRows) {
                    res.send({
                        status: true,
                        msg: "Permission Removed successfully",
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

    }
})

/** Save Policy Permission **/
router.post('/save_policy_permissions', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var action = req.body.action
        let policyId = req.body.policyId;
        let dealers = req.body.dealers;

        let prevPermissions = await sql.query("SELECT dealers FROM policy WHERE id = " + policyId);
        let prevParsDealers = (prevPermissions[0].dealers !== null && prevPermissions[0].dealers !== '' && prevPermissions[0].dealers !== 'null') ? JSON.parse(prevPermissions[0].dealers) : [];
        console.log(prevPermissions[0].dealers, prevParsDealers, 'dalers for da', dealers)
        if (action === 'save') {
            var parsedDealers = JSON.parse(dealers);
            for (let i = 0; i < parsedDealers.length; i++) {
                if (prevParsDealers.indexOf(parsedDealers[i]) === -1) {
                    prevParsDealers.push(parsedDealers[i])
                }
            }
            let parsedCombineArray = JSON.stringify(prevParsDealers)
            let updateAPKQ = "UPDATE policy SET dealers = '" + parsedCombineArray + "' WHERE id=" + policyId;

            if (prevParsDealers.length) {
                let deleteNotIn = "DELETE FROM dealer_policies WHERE dealer_id NOT IN (" + prevParsDealers.join() + ") AND policy_id = " + policyId;
                // console.log(deleteNotIn);
                await sql.query(deleteNotIn);
                let insertQuery = "INSERT IGNORE INTO dealer_policies (dealer_id, policy_id) VALUES ";

                let insertOrIgnore = ' '
                for (let i = 0; i < prevParsDealers.length; i++) {
                    if (i === prevParsDealers.length - 1) {
                        insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + policyId + ")"
                    } else {
                        insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + policyId + "),"
                    }
                }
                await sql.query(insertQuery + insertOrIgnore);
            }

            sql.query(updateAPKQ, async (error, result) => {
                if (error) throw (error);
                let permissionC = [];
                let rslt = await sql.query("select dealers from policy where id='" + policyId + "' order by id ASC")
                if (rslt.length) {
                    if (rslt !== undefined && rslt !== null) {
                        let permission = JSON.parse(rslt[0].dealers);
                        console.log("Verify user id", verify.user.user_type);
                        if (verify.user.user_type === Constants.ADMIN) {
                            if (permission !== undefined && permission !== null && permission !== '[]') {
                                let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                                let dealerCount = await helpers.dealerCount(adminRoleId);
                                permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();

                            }
                        } else if (verify.user.user_type === Constants.DEALER) {
                            let sdealerList = await sql.query("select count(*) as dealer_count ,dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList[0].dealer_count;
                            console.log("dasda", dealerCount);
                            let Sdealerpermissions = permission.filter(function (item) {
                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (item === sdealerList[i].dealer_id) {
                                        return item
                                    }
                                }
                            })
                            console.log("sadasdsad", Sdealerpermissions);
                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                            permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        }
                    };
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
        } else {
            console.log(dealers);
            dealers = JSON.parse(dealers);
            for (let i = 0; i < dealers.length; i++) {
                var index = prevParsDealers.indexOf(dealers[i]);
                console.log("array index", index);
                if (index > -1) {
                    prevParsDealers.splice(index, 1);
                }
            }
            console.log(prevParsDealers);
            let toDeleteDealers = (prevParsDealers.length > 0) ? prevParsDealers.join() : '""';

            let updateAPKQ = "UPDATE policy SET dealers = '" + JSON.stringify(prevParsDealers) + "' WHERE id=" + policyId;
            if (dealers.length) {
                let deleteNotIn = "DELETE FROM dealer_policies WHERE dealer_id NOT IN (" + toDeleteDealers + ") AND policy_id = " + policyId;
                console.log(deleteNotIn);
                await sql.query(deleteNotIn);
                if (prevParsDealers.length > 0) {
                    let insertQuery = "INSERT IGNORE INTO dealer_policies (dealer_id, policy_id) VALUES";

                    let insertOrIgnore = ' '
                    for (let i = 0; i < prevParsDealers.length; i++) {
                        if (i === prevParsDealers.length - 1) {
                            insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + policyId + ")"
                        } else {
                            insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + policyId + "),"
                        }
                    }
                    console.log(insertQuery + insertOrIgnore);
                    await sql.query(insertQuery + insertOrIgnore);

                }
                // console.log(insertQuery + insertOrIgnore);
            }

            sql.query(updateAPKQ, async (error, result) => {
                if (error) throw (error);
                let permissionC = [];
                let rslt = await sql.query("select dealers from policy where id='" + policyId + "' order by id ASC")
                if (rslt.length) {
                    console.log(rslt, ' do ti ');
                    if (rslt !== undefined && rslt !== null) {
                        let permission = JSON.parse(rslt[0].dealers);
                        console.log("Verify user id", verify.user.user_type);
                        if (verify.user.user_type === Constants.ADMIN) {
                            if (permission !== undefined && permission !== null && permission !== '[]') {
                                let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                                let dealerCount = await helpers.dealerCount(adminRoleId);
                                permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();

                            }
                        }
                        else if (verify.user.user_type === Constants.DEALER) {
                            let sdealerList = await sql.query("select count(*) as dealer_count ,dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList[0].dealer_count;
                            console.log("dasda", dealerCount);
                            let Sdealerpermissions = permission.filter(function (item) {
                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (item === sdealerList[i].dealer_id) {
                                        return item
                                    }
                                }
                            })
                            console.log("sadasdsad", Sdealerpermissions);
                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                            permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        }
                    };

                }
                if (result.affectedRows) {
                    res.send({
                        status: true,
                        msg: "Permission Removed successfully",
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
    }
});



/** Get image logo **/
router.get("/getFile/:file", (req, res) => {

    if (fs.existsSync(path.join(__dirname, "../uploads/" + req.params.file))) {
        let file = path.join(__dirname, "../uploads/" + req.params.file);
        let fileMimeType = mime.getType(file);
        let filetypes = /jpeg|jpg|apk|png/;
        // Do something
        // if (filetypes.test(fileMimeType)) {
        res.set('Content-Type', fileMimeType); // mimeType eg. 'image/bmp'
        res.sendFile(path.join(__dirname, "../uploads/" + req.params.file));
        // } else {
        //     res.send({
        //         "status": false,
        //         "msg": "file not found"
        //     })
        // }
    } else {
        res.send({
            "status": false,
            "msg": "file not found"
        })
    }

});



/**Delete Apk**/
router.post('/apk/delete', async function (req, res) {

    var verify = await verifyToken(req, res);

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
    var verify = await verifyToken(req, res);

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
    var verify = await verifyToken(req, res);
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

// Get Imei history
router.get('/get_imei_history/:device_id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from imei_history where device_id = '" + req.params.device_id + "' ";
        sql.query(query, (error, resp) => {
            res.send({
                status: true,
                msg: "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: "access forbidden"
        })
    }

});

/*Get All users */
router.get('/userList', async function (req, res) {
    let devicesData = [];
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        if (verify.user.user_type == ADMIN) {
            var role = await helpers.getuserTypeIdByName(verify.user.user_type);
            let results = await sql.query("select * from users order by created_at DESC")
            if (results.length) {
                for (let i = 0; i < results.length; i++) {
                    let data = await helpers.getAllRecordbyUserID(results[i].user_id)
                    results[i].devicesList = data
                }
                // console.log("Devices For user", devicesData);
                data = {
                    "status": true,
                    data: {
                        users_list: results,
                    }
                }
                res.send(data);
            }
        } else if (verify.user.user_type === DEALER) {
            sql.query("select dealer_id from dealers where connected_dealer = '" + verify.user.id + "' AND  type = 3 order by created DESC", async function (error, result) {
                if (error) throw error;
                dealer = [verify.user.id]
                console.log(result);
                if (result.length) {
                    for (var i = 0; i < result.length; i++) {
                        var sDealers_id = result[i].dealer_id;
                        dealer.push(sDealers_id)
                    }
                }
                console.log("select * from users WHERE dealer_id IN (" + dealer.join() + ") order by created_at DESC");
                let results = await sql.query("select * from users WHERE dealer_id IN (" + dealer.join() + ") order by created_at DESC")
                if (results.length) {
                    for (let i = 0; i < results.length; i++) {
                        let data = await helpers.getAllRecordbyUserID(results[i].user_id)
                        results[i].devicesList = data
                    }
                    // console.log("Devices For user", devicesData);
                    data = {
                        "status": true,
                        data: {
                            users_list: results,
                        }
                    }
                    res.send(data);
                }
            });
        }
        else {
            let results = await sql.query("select * from users WHERE dealer_id = '" + verify.user.id + "' order by created_at DESC")
            if (results.length) {
                for (let i = 0; i < results.length; i++) {
                    let data = await helpers.getAllRecordbyUserID(results[i].user_id)
                    results[i].devicesList = data
                }
                // console.log("Devices For user", devicesData);
                data = {
                    "status": true,
                    data: {
                        users_list: results,
                    }
                }
                res.send(data);
            }

        }
    }
    else {
        data = {
            "status": false,
        }
        res.send(data)
    }
});

/*Transfer Apps to secure market */
router.post('/transferApps', async function (req, res) {

    let appKeys = req.body.data
    var verify = await verifyToken(req, res);
    let toDelete = '"' + appKeys.join('","') + '"'
    if (verify.status !== undefined && verify.status == true) {
        let dealer_type = verify.user.user_type;
        let dealer_id = verify.user.id;
        if (dealer_type === ADMIN) {

            let deleteNotIn = "DELETE FROM secure_market_apps WHERE apk_id NOT IN ('" + toDelete + "')"
            console.log(deleteNotIn);
            await sql.query(deleteNotIn);
            if (appKeys.length) {
                let insertQuery = "INSERT IGNORE INTO secure_market_apps (dealer_type,dealer_id, apk_id) VALUES ";

                let insertOrIgnore = ' '
                for (let i = 0; i < appKeys.length; i++) {
                    if (i === appKeys.length - 1) {
                        insertOrIgnore = insertOrIgnore + "('" + dealer_type + "' ," + dealer_id + " , " + appKeys[i] + ")"
                    } else {
                        insertOrIgnore = insertOrIgnore + "('" + dealer_type + "' ," + dealer_id + " , " + appKeys[i] + "),"
                    }
                }
                await sql.query(insertQuery + insertOrIgnore);
            }
        } else {
            let deleteNotIn = "DELETE FROM secure_market_apps WHERE apk_id NOT IN ('" + toDelete + "') AND dealer_id = '" + verify.user.id + " '"
            // console.log(deleteNotIn);
            await sql.query(deleteNotIn);
            let adminAppKeys = await sql.query("SELECT apk_id FROM secure_market_apps WHERE dealer_type = '" + ADMIN + "'");
            adminAppKeys.forEach((item) => {
                let index = appKeys.indexOf(item.apk_id)
                if (index !== -1) {
                    appKeys.splice(index, 1)
                }
            })
            if (appKeys.length) {
                let insertQuery = "INSERT IGNORE INTO secure_market_apps (dealer_type,dealer_id, apk_id) VALUES ";
                let insertOrIgnore = ' '
                for (let i = 0; i < appKeys.length; i++) {
                    if (i === appKeys.length - 1) {
                        insertOrIgnore = insertOrIgnore + "('" + dealer_type + "' ," + dealer_id + " , " + appKeys[i] + ")"
                    } else {
                        insertOrIgnore = insertOrIgnore + "('" + dealer_type + "' ," + dealer_id + " , " + appKeys[i] + "),"
                    }
                }
                await sql.query(insertQuery + insertOrIgnore);
            }
        }

        where = '';
        if (verify.user.user_type !== ADMIN) {
            apklist = await sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.delete_status = 0")
        }
        else {
            apklist = await sql.query("select * from apk_details where delete_status=0")
        }
        if (verify.user.user_type !== ADMIN) {
            where = "AND (secure_market_apps.dealer_type = 'admin' OR secure_market_apps.dealer_id = '" + verify.user.id + "')"
        }
        sql.query("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id, secure_market_apps.is_restrict_uninstall  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 " + where + " ORDER BY created_at desc", async function (err, results) {
            if (err) throw err;
            if (results.length) {
                apklist.forEach((item, index) => {
                    for (let i = 0; i < results.length; i++) {
                        if (item.apk_id === results[i].id) {
                            apklist.splice(index, 1)
                        }
                    }
                })
                data = {
                    status: true,
                    msg: 'Apps Transfered Sussecfully',
                    data: {
                        marketApplist: results,
                        availableApps: apklist
                    }
                }
                res.send(data)
            } else {
                data = {
                    status: true,
                    msg: 'Apps Transfered Sussecfully',
                    data: {
                        marketApplist: [],
                        availableApps: apklist
                    }
                }
                res.send(data)
            }
        })
    }
    else {
        data = {
            "status": false,
        }
        res.send(data)
    }
});

/** Get Market app List **/

router.get('/marketApplist', async function (req, res) {

    var verify = await verifyToken(req, res);
    var data = [];
    let apklist = []
    if (verify.status !== undefined && verify.status == true) {
        where = '';
        if (verify.user.user_type !== ADMIN) {
            apklist = await sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.delete_status = 0")
        }
        else {
            apklist = await sql.query("select * from apk_details where delete_status=0")
        }
        if (verify.user.user_type !== ADMIN) {
            where = "AND (secure_market_apps.dealer_type = 'admin' OR secure_market_apps.dealer_id = '" + verify.user.id + "')"
        }
        // console.log("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 " + where + "ORDER BY created_at desc");
        sql.query("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id , secure_market_apps.is_restrict_uninstall  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 " + where + "ORDER BY created_at desc", async function (err, results) {
            if (err) throw err;
            if (results.length) {
                apklist.forEach((item, index) => {
                    for (let i = 0; i < results.length; i++) {
                        if (item.apk_id === results[i].id) {
                            apklist.splice(index, 1)
                        }
                    }
                })
                data = {
                    status: true,
                    data: {
                        marketApplist: results,
                        availableApps: apklist
                    }

                }
                res.send(data)
            } else {
                data = {
                    status: true,
                    data: {
                        marketApplist: [],
                        availableApps: apklist
                    }
                }
                res.send(data)
            }
        })
    }
    else {
        data = {
            status: false
        }
        res.send(data)
    }
});


// Change unistall app restriction for Secure market apps 
router.put('/handleUninstall/:apk_id', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let is_restricted = (req.body.value) ? 0 : 1;
            let apk_id = req.params.apk_id;
            // console.log("UPDATE secure_market_apps SET is_restrict_uninstall = " + is_restricted + " WHERE apk_id ='" + apk_id + "'");
            sql.query("UPDATE secure_market_apps SET is_restrict_uninstall = " + is_restricted + " WHERE apk_id ='" + apk_id + "'", function (err, results) {
                if (err) throw err
                if (results.affectedRows) {
                    data = {
                        status: true,
                        msg: "Uninstall permission changed."
                    }
                    res.send(data);
                    return
                }
                else {
                    data = {
                        status: false,
                        msg: "Uninstall permission not changed. Please try again later."
                    }
                    res.send(data);

                }
            })
        }
    } catch (error) {
        throw Error(error.message);
    }
});

// Write IMEI on device
router.post('/writeImei/:device_id', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let device_id = req.params.device_id;
            let usrAccId = req.body.usrAccId;
            let dealer_id = verify.user.id
            let type = req.body.type;
            let imeiNo = req.body.imeiNo;
            let device = req.body.device

            let imei = await device_helpers.checkvalidImei(imeiNo)
            if (imei) {
                let imei1 = (type == 'IMEI1') ? imeiNo : null
                let imei2 = (type == 'IMEI2') ? imeiNo : null

                let query = "SELECT * from device_history WHERE user_acc_id = '" + usrAccId + "' AND type = 'imei' AND status = 0 order by created_at desc limit 1"

                let result = await sql.query(query);
                if (result.length) {
                    let prevImei = JSON.parse(result[0].imei)
                    // console.log(prevImei);
                    if (type == 'IMEI1') {
                        prevImei.imei1 = imei1
                    }
                    else {
                        prevImei.imei2 = imei2
                    }
                    let newImei = JSON.stringify(prevImei)
                    sql.query("INSERT INTO device_history (device_id,dealer_id,user_acc_id, imei, type) VALUES (" + device_id + "," + dealer_id + "," + usrAccId + ", '" + newImei + "', 'imei')", async function (err, results) {
                        if (err) throw err;
                        if (results.affectedRows) {
                            var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                            await sql.query(loadDeviceQ)
                            let isOnline = await device_helpers.isDeviceOnline(device_id);
                            if (isOnline) {
                                require("../bin/www").writeImei(newImei, device_id);
                                data = {
                                    "status": true,
                                    'online': true,
                                    // 'insertedData': insertedData
                                };
                                res.send(data);
                            } else {
                                data = {
                                    "status": true,
                                    // 'insertedData': insertedData
                                };
                                res.send(data);
                            }

                        } else {
                            data = {
                                "status": false,
                                "msg": 'Error while Processing',
                            };
                            res.send(data);
                        }

                    })
                } else {
                    let imei = {
                        imei1: imei1,
                        imei2: imei2
                    }
                    let newImei = JSON.stringify(imei)
                    var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, imei, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + newImei + "', 'imei')";

                    sql.query(applyQuery, async function (err, rslts) {
                        if (err) {
                            throw err;
                        }
                        if (rslts) {
                            // var applyPushQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                            // await sql.query(applyPushQ)
                            let isOnline = await device_helpers.isDeviceOnline(device_id);
                            if (isOnline) {
                                require("../bin/www").writeImei(newImei, device_id);
                                data = {
                                    "status": true,
                                    'online': true,
                                    // 'insertedData': insertedData
                                };
                                res.send(data);
                            } else {
                                data = {
                                    "status": true,
                                    'online': false,
                                    // 'insertedData': insertedData
                                };
                                res.send(data);
                            }
                        } else {
                            data = {
                                "status": false,
                                "msg": 'Error while Processing',
                            };
                            res.send(data);
                        }
                    });
                }
            } else {
                data = {
                    "status": false,
                    "msg": "Invalid IMEI number, please make sure you are using a valid IMEI number and try again",
                };
                res.send(data);
            }
        }
    } catch (error) {
        throw Error(error.message);
    }
});

// get activities 
router.get('/get_activities/:device_id', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {

            let device_id = req.params.device_id
            let activities = [];
            let usrAccId = await device_helpers.getUserAccByDeviceId(device_id)
            // 'DELETE','SUSPENDED','UNLINKED','EXPIRED','ACTIVE','FLAGGED','UNFLAGGED','TRANSFER','Pre-activated','wiped'
            let acc_action_query = "SELECT * FROM acc_action_history WHERE device_id = '" + device_id + "'"
            let accResults = await sql.query(acc_action_query)
            let device_history_query = "SELECT * FROM device_history WHERE user_acc_id = '" + usrAccId.id + "'"
            let deviceResults = await sql.query(device_history_query)

            let action;
            for (let i = 0; i < accResults.length; i++) {
                if (accResults[i].action == Constants.DEVICE_PRE_ACTIVATION || accResults[i].action === Constants.DEVICE_EXPIRED || accResults[i].action == 'DELETE') {
                    continue
                } else {
                    action = {
                        "action_name": await helpers.getActivityName(accResults[i].action),
                        "created_at": accResults[i].created_at
                    }
                    activities.push(action)
                }
            }
            for (let i = 0; i < deviceResults.length; i++) {
                action = {
                    "action_name": await helpers.getActivityName(deviceResults[i].type),
                    "created_at": deviceResults[i].created_at
                }
                activities.push(action)
            }
            // console.log(activities);
            data = {
                "status": true,
                "data": activities
            };
            res.send(data);
        }
    } catch (error) {
        throw Error(error.message);
    }
});

// set default for w.r.t dealer
router.post('/set_default_policy', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let enable = req.body.enable
            let policy_id = req.body.policy_id

            let default_policy = await sql.query("SELECT * FROM default_policies WHERE dealer_id = '" + verify.user.id + "'")
            if (default_policy.length) {
                if (enable) {
                    sql.query("UPDATE default_policies SET policy_id = '" + policy_id + "' WHERE dealer_id = '" + verify.user.id + "'")
                }
                else {
                    sql.query("DELETE FROM default_policies WHERE dealer_id = '" + verify.user.id + "' AND policy_id = '" + policy_id + "'")
                }
            } else {
                sql.query("INSERT INTO default_policies (dealer_id , policy_id) VALUES (" + verify.user.id + " , " + policy_id + " )")
            }
            data = {
                "status": true,
                "msg": 'Default policy changed successfully'
            };
            res.send(data);
        }
    } catch (error) {
        throw Error(error.message);
    }
});

router.put('/force_update', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let device_id = req.body.device_id;
        let dealer_id = verify.user.id
        if (!empty(device_id)) {
            let deviceQ = "SELECT * FROM devices WHERE device_id='" + device_id + "'";
            let device = await sql.query(deviceQ);
            if (device.length) {
                if (device[0].online === Constants.DEVICE_ONLINE) {
                    // require('../bin/www').forceCheckUpdate(device[0].device_id);
                    require("../bin/www").forceCheckUpdate(device[0].device_id);
                    res.send({
                        status: true,
                        msg: "force update has been applied"
                    })
                } else {
                    let usr_acc = await device_helpers.getUserAccByDeviceId(device_id);
                    let historyQ = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, type) VALUES ('" + device_id + "'," + dealer_id + "," + usr_acc.id + ",'" + Constants.DEVICE_HISTORY_FORCE_UPDATE + "')";
                    sql.query(historyQ, function (error, resp) {
                        if (error) throw (error);
                        res.send({
                            status: true,
                            msg: "force update will apply when device will come online"
                        })
                    });
                }
            } else {
                res.send({
                    status: false,
                    msg: "Device not Found"
                })
            }
        } else {
            res.send({
                status: false,
                msg: "Device not Found"
            })
        }
    }
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
            var dvcID = await device_helpers.getDvcIDByDeviceID(results[i].device_id);
            sql.query(updateUsrAcc, function (error, results) {
                if (error) throw error;
                if (results.affectedRows == 0) {
                    console.log('not done');
                } else {
                    try {
                        console.log('expired');
                        require("../bin/www").sendDeviceStatus(dvcID, "expired", true);
                    } catch (error) {
                        console.log(error);
                    }
                }
            });

        }
    }
});


module.exports = router;