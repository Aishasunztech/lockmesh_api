// ====== libraries
var express = require('express');
var router = express.Router();
var generator = require('generate-password');
var md5 = require('md5');
const bcrypt = require('bcrypt');
var empty = require('is-empty');
var datetime = require('node-datetime');
var cron = require('node-cron');
var jwt = require('jsonwebtoken');
var randomize = require('randomatic');
//var uniqid = require('uniqid');
var multer = require('multer');

var XLSX = require('xlsx');
const url = require('url');
var path = require('path');
var fs = require("fs");
var moment = require('moment-strftime');
var mime = require('mime');


const axios = require('axios')
var util = require('util')
const stripe = require("stripe")("sk_test_1rS6KC3GoPT8wlOYWSLEQFk6");

// ========= Helper =============
const { sql } = require('../config/database');
var config = require('../helper/config.js');

var Constants = require('../constants/Application');
var app_constants = require('../config/constants');
var helpers = require('../helper/general_helper.js');
const device_helpers = require('../helper/device_helpers.js');

//=========== Custom Libraries =========
const { sendEmail } = require('../lib/email');


// ========== Controllers ========
const authController = require('../app/controllers/auth');
const aclController = require('../app/controllers/acl');
const deviceController = require('../app/controllers/device');
const dealerController = require('../app/controllers/dealer');

// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no"


/*Check For Token in the header */
var verifyToken = function (req, res) {
    var ath;
    var token = req.headers['authorization'];
    // console.log(token);
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
    res.send("Test")

    // stripe.tokens.create({
    //     card: {
    //         number: '4242424242424242',
    //         exp_month: 12,
    //         exp_year: 2020,
    //         cvc: '1234'
    //     }
    // }, function (err, token) {
    //     console.log(err);
    //     console.log(token);
    // });

    // var ip = req.headers['x-forwarded-for']
    // res.send({
    //     ip: ip
    // })

    // var cm = require('csv-mysql');

    // var data = '"1","2","3"\n"4","5","6"';
    // var options = {
    //     mysql: {
    //         host: 'localhost',
    //         user: 'root',
    //         database: 'lockmesh_db',
    //     },
    //     csv: {
    //         comment: '#',
    //         quote: '"'
    //     },
    //     headers: ["c1", "c2", "c3"]
    // }

    // res.send(tablesName)

    // let data1 = await cm.import(options, data, function (err, rows) {
    //     if (err === null) err = false;
    //     // expect(err).to.equal(false);
    //     // done();
    // });
    // res.send(data1)

    // var clientip = req.socket.remoteAddress;
    // var xffip = req.header('x-real-ip') || req.connection.remoteAddress
    // var ip = xffip ? xffip : clientip;
    // res.send({ client: xffip });

    // let filename = "icon_AdSense.png";
    // let filename = "apk-1541677256487.apk.jpg";
    // var ip_info = get_ip(req);
    // console.log(ip_info.clientIp);
    // res.send({
    //     ip_info
    // })
    // proxy_set_header X-Forwarded-For $remote_addr;
    // res.send('IP = ' + req.connection.remoteAddress + ':' + req.connection.remotePort)
    // console.log(req.headers['x-forwarded-for'])
    // res.send({
    //     data: req.headers['x-forwarded-for']
    // })
    // let file = path.join(__dirname, "../uploads/" + filename);

    // Jimp.read(file)
    //     .then(lenna => {
    //         console.log("success", file)
    //     })
    //     .catch(err => {
    //         console.error("error", err);
    //     });

    // let file = path.join(__dirname, "../uploads/apk-1541677256487.apk");
    // let packageName = await helpers.getAPKPackageName(file);
    // let versionName = await helpers.getAPKVersionName(file);
    // let versionCode = await helpers.getAPKVersionCode(file);
    // let label = await helpers.getAPKLabel(file);
    // res.send({
    //     packageName: packageName,
    //     versionName: versionName,
    //     versionCode: versionCode,
    //     label: label
    // });
    // res.send(mime.getExtension(filename));

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

router.post('/super_admin_login', authController.superAdminLogin)


/*****User Login*****/
router.post('/login', authController.login);

router.post('/verify_code', authController.verifyCode);

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


router.get('/get_allowed_components', aclController.getAllowedComponents);


router.post('/check_component', aclController.checkComponent);

/** is_admin **/
router.get('/is_admin', aclController.isAdmin);

/** get_user_type **/
router.get('/user_type', aclController.getUserType);


router.get('/languages', async function (req, res) {
    // var verify = await verifyToken(req, res);
    let languages = [];
    let selectQuery = "SELECT * FROM languages";
    languages = await sql.query(selectQuery);

    if (languages.length) {
        res.send({
            status: true,
            data: languages
        });
    } else {
        res.send({
            status: false,
            data: []
        })
    }
});


// ============== Devices ============ //

/**GET all the devices**/
router.get('/devices', deviceController.devices);

// add new device
router.put('/new/device', deviceController.acceptDevice);

/**GET New the devices**/
router.get('/new/devices', deviceController.newDevices);

/***Add devices (not using) ***/
router.post('/create/device_profile', deviceController.createPreactivations);

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
                if (err) {
                    console.log(err)
                }
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


/**UPDATE Device details**/
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
                    if (error) {
                        console.log(error);
                    }
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

/** Unlink Device  **/
router.post('/unlink/:id', async function (req, res) {
    var verify = await verifyToken(req, res);
    var device_id = req.params.id;

    if (verify.status !== undefined && verify.status == true) {

        if (!empty(device_id)) {
            let dvcId = await device_helpers.getDvcIDByDeviceID(device_id);
            var sql1 = `DELETE from usr_acc  where device_id=${device_id}`;
            sql.query(sql1, async function (error, results) {
                if (error) {
                    data = {
                        status: false,
                        msg: "Device not unlinked."
                    }
                };

                if (results && results.affectedRows) {
                    // Update device details on Super admin
                    axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                        // console.log("SUPER ADMIN LOGIN API RESPONSE", response);
                        if (response.data.status) {
                            let data = {
                                linkToWL: false,
                                device_id: dvcId
                            }
                            axios.put(app_constants.UPDATE_DEVICE_SUPERADMIN_URL, data, { headers: { authorization: response.data.user.token } })
                        }
                    })
                    var userAccId = await device_helpers.getUsrAccIDbyDvcId(device_id)
                    await sql.query("update pgp_emails set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    await sql.query("update chat_ids set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    await sql.query("update sim_ids set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    var sqlDevice = "DELETE from devices where id = '" + device_id + "'";
                    await sql.query(sqlDevice);

                    device_helpers.saveActionHistory(req.body.device, Constants.DEVICE_UNLINKED)
                    require("../bin/www").sendDeviceStatus(dvcId, "unlinked", true);
                    data = {
                        status: true,
                        msg: "Device unlinked successfully."
                    }
                } else {
                    data = {
                        status: false,
                        msg: "Device not unlinked."
                    }
                }
                res.send(data);
                return;
            });

        } else {
            data = {
                status: false,
                msg: "Invalid device id."
            }
            res.send(data);
            return;
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
                    if (error) {
                        console.log(error);
                    }
                    if (results.affectedRows == 0) {


                        data = {
                            "status": false,
                            "msg": "Account not suspended.Please try again."
                        }
                    } else {
                        sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                            if (error) {
                                console.log(error);
                            }
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
                        if (error) {
                            console.log(error);
                        }
                        if (results.affectedRows == 0) {

                            data = {
                                "status": false,
                                "msg": "Account not suspended.Please try again."
                            }
                        } else {


                            sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                // console.log('lolo else', resquery[0])

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
                    if (error) {
                        console.log(error);
                    }
                    if (results.affectedRows == 0) {
                        data = {
                            "status": false,
                            "msg": "Device not activated.Please try again."
                        }
                    } else {
                        sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                            if (error) {
                                console.log(error);
                            }
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
                        if (error) {
                            console.log(error);
                        }
                        if (results.affectedRows == 0) {
                            data = {
                                "status": false,
                                "msg": "Device not activated.Please try again."
                            }
                        } else {
                            sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                                if (error) {
                                    console.log(error);
                                }
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

router.post('/wipe/:id', async function (req, res) {
    var verify = await verifyToken(req, res);
    var device_id = req.params.id;
    if (verify.status !== undefined && verify.status == true) {
        var sql2 = "select * from devices where id = '" + device_id + "'";
        var gtres = await sql.query(sql2);
        if (!empty(device_id)) {

            var sql1 = "update usr_acc set wipe_status='wipe' where device_id = '" + device_id + "'";

            var rest = sql.query(sql1, async function (error, results) {
                if (error) {
                    console.log(error)
                }
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Device not wiped.Please try again."
                    }
                    res.send(data);
                } else {
                    require("../bin/www").sendDeviceStatus(gtres[0].device_id, Constants.DEVICE_WIPE);

                    sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                        if (error) {
                            console.log(error);
                        }
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
            var sql1 = "update devices set flagged= 'Not flagged' where device_id='" + device_id + "'";
            var rest = sql.query(sql1, async function (error, results) {
                if (error) {
                    console.log(error);
                }
                else if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": "Device not Unflagged.Please try again."
                    }
                    res.send(data);
                } else {
                    await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.device_id= "' + device_id + '"', async function (error, resquery, fields) {
                        if (error) {
                            console.log(error);
                        }
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
    // console.log(option);
    if (verify.status !== undefined && verify.status == true) {
        var sql2 = "select * from devices where id = '" + device_id + "'";
        var gtres = await sql.query(sql2);
        if (!empty(device_id)) {

            if (gtres[0].flagged === '' || gtres[0].flagged === 'null' || gtres[0].flagged === null || gtres[0].flagged === 'Not flagged') {
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

                if (error) {
                    console.log(error);
                }
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

/** Get get App Job Queue  (Connect Page) **/
router.get('/getAppJobQueue/:device_id', async function (req, res) {
    // console.log('api check is caled')
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let device_id = req.params.device_id;
        if (!empty(device_id)) {

            let jobQueue = await device_helpers.getAppJobQueue(device_id);
            _data = {
                status: true,
                data: jobQueue.data,
                type: jobQueue.type
            };
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
            let query = "SELECT * FROM devices WHERE device_id = '" + deviceId + "' and online = '" + Constants.DEVICE_ONLINE + "'";
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
        console.log(error)
    }
})

// ====================== Users ==================== //

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
            var user = await sql.query("SELECT * FROM users WHERE email = '" + userEmail + "' AND dealer_id = " + loggedInuid + " AND del_status = 0");

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
                if (error) {
                    console.log(error);
                }

                var html = 'User details are : <br> ' +
                    'User ID : ' + userId + '.<br> ' +
                    'Name : ' + userName + '<br> ' +
                    'Email : ' + userEmail + '<br> '
                sendEmail("User Registration", html, verify.user.email)
                sendEmail("User Registration", html, userEmail)

                // res.send(rows.insertId);
                var user = await sql.query("SELECT * FROM users WHERE id = " + rows.insertId + "");
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
                if (error) {
                    console.log(error);
                }

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
            // console.log(deleteUserQ);
            sql.query(deleteUserQ, function (err, result) {
                if (err) {
                    console.log(err)
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
                    console.log(err)
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




/**UPDATE Profile details  **/
router.put('/updateProfile/:id', async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        sql.query('UPDATE dealers SET `dealer_name` = ? where `dealer_id` = ?', [req.body.name, req.body.dealerId], function (error, rows, status) {

            if (error) {
                console.log(error);
            }
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


/** Reset password dealers (Admin Panel) **/
router.post('/resetpwd', async function (req, res) {

    var verify = await verifyToken(req, res);
    var isReset = false;
    if (verify.status !== undefined && verify.status == true) {
        var user = verify.user;
        if (req.body.pageName != undefined && req.body.pageName != "") {
            if (user.user_type === ADMIN || user.user_type === DEALER) {
                var newpwd = generator.generate({
                    length: 10,
                    numbers: true
                });
                isReset = true;
                var query = "SELECT password FROM dealers WHERE dealer_id=" + req.body.dealer_id + " limit 1";
                var rslt = await sql.query(query);
                var curntPassword = rslt[0].password;
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
                        return;
                    } else {

                        var sq = "update dealers set password = '" + enc_pwd + "' where dealer_id = '" + dealer_id + "'";
                        sql.query(sq, function (error, rows) {


                            if (error) {
                                console.log(error);
                            }

                            if (rows.affectedRows == 0) {
                                data = {
                                    "status": false,
                                    "data": rows
                                };
                                res.send(data);
                                return;
                            } else {
                                data = {

                                    "status": true,
                                    "msg": "Password changed successfully.Please check your email."
                                };
                                res.send(data);
                                return;
                            }
                        });
                    }

                });
            } else {
                data = {
                    "status": false,
                    "msg": 'Invalid User and Password'
                };
                res.send(data);
                return;
            }


        } else {

            res.json({
                status: false,
                "msg": "Invalid details"
            });
            return;
        }
    }

});

// =================== Dealers ================= //
/*Get All Dealers */
router.get('/dealers', dealerController.getAllDealers);

/*Get dealers*/
router.get('/dealers/:pageName', dealerController.getDealers);

/*** Add Dealer ***/
router.post('/add/dealer', dealerController.addDealer);

/** Edit Dealer (Admin panel) **/
router.put('/edit/dealers', dealerController.editDealers);

/** Delete Dealer from admin Panel**/
router.post('/dealer/delete/', dealerController.deleteDealer);

/** Undo Dealer / S-Dealer **/
router.post('/dealer/undo', dealerController.undoDealer);

/** Suspend Dealer **/
router.post('/dealer/suspend', dealerController.suspendDealer);

/** Activate Dealer **/
router.post('/dealer/activate', dealerController.activateDealer);


/** Get logged in Dealer permitted apps  **/
router.get('/get_dealer_apps', async function (req, res) {
    // console.log('apoi recivedx')
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let loggedUserId = verify.user.id;
        let loggedUserType = verify.user.user_type;

        let getAppsQ = "SELECT apk_details.* FROM apk_details ";
        if (loggedUserType !== Constants.ADMIN) {
            getAppsQ = getAppsQ + " JOIN dealer_apks on dealer_apks.apk_id = apk_details.id WHERE dealer_apks.dealer_id =" + loggedUserId + " AND delete_status=0 AND apk_type != 'permanent'";
        } else {
            getAppsQ = getAppsQ + " WHERE delete_status=0 AND apk_type != 'permanent'";

        }
        // console.log(getAppsQ);
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
        let query = "select id, unique_name as uniqueName, label, package_name as packageName, icon, extension, visible, default_app, extension_id, created_at from default_apps";

        sql.query(query, async (error, apps) => {

            if (error) {
                console.log(error)
            };
            ;            // console.log(query, 'rslt  ', apps);
            let Extension = [];
            let onlyApps = [];
            for (let item of apps) {
                let subExtension = [];
                // console.log("extenstion id", item.extension_id);
                if (item.extension === 1 && item.extension_id === 0) {
                    // console.log('main', item)
                    Extension.push(item);
                }

                if (item.extension == 0 && item.extension_id === 0) {
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
                            uniqueName: ext.uniqueName,
                            uniqueExtension: item.uniqueName,
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
                    uniqueName: ext.uniqueName,
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
                console.log(err)
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

router.get('/dealer/getPagination/:dropdownType', async function (req, res) {
    var verify = await verifyToken(req, res);
    // console.log('done or not');
    if (verify.status !== undefined && verify.status == true) {
        // console.log('data from req', req.params.dropdownType);
        let dealer_id = verify.user.id;
        let dropdownType = req.params.dropdownType;
        sql.query("select record_per_page from dealer_pagination where dealer_id = " + dealer_id + " AND type = '" + dropdownType + "'", function (err, rslts) {
            if (err) {
                console.log(err)
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

// =========== Policy ============= //

// policy name should be unique

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
                // console.log(verify.user, "select policy.* from policy left join dealer_policies on policy.id = dealer_policies.policy_id where (dealer_policies.dealer_id='" + verify.user.id + "' OR policy.dealer_id = " + verify.user.id + ") AND policy.delete_status=0")
                // sql.query("select policy.* from policy left join dealer_policies on policy.id = dealer_policies.policy_id where (dealer_policies.dealer_id='" + verify.user.id + "' OR policy.dealer_id = " + verify.user.id + ") AND policy.delete_status=0", async function (error, results) {
                let myquery = "select policy_id from dealer_policies where dealer_id='" + verify.user.id + "'";
                // console.log(myquery, '1 query');
                let permittedids = await sql.query(myquery);
                let prrr = [];
                if (permittedids && permittedids.length) {
                    for (let item of permittedids) {
                        prrr.push(item.policy_id)
                    }
                }
                // console.log(prrr, 'permited ids');
                // console.log('2 query',"select * from policy where (dealer_id='" + verify.user.id + "' OR id IN ("+prrr+")) AND delete_status=0")
                sql.query("select * from policy where (dealer_id='" + verify.user.id + "' OR id IN (" + prrr + ")) AND delete_status=0", async function (error, results) {

                    if (error) {
                        console.lo
                        g(error)
                    }
                    if (results.length > 0) {
                        // console.log(results);
                        let dealerRole = await helpers.getuserTypeIdByName(Constants.DEALER);
                        let default_policy = await sql.query("SELECT * from default_policies WHERE dealer_id = '" + userId + "'")
                        let default_policy_id = (default_policy.length) ? default_policy[0].policy_id : null

                        let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                        let dealerCount = sdealerList.length;
                        for (var i = 0; i < results.length; i++) {
                            let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
                            let Sdealerpermissions = permissions.filter(function (item) {

                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (
                                        item === sdealerList[i].dealer_id
                                    ) {
                                        return item
                                    }
                                }
                            })

                            // console.log(permissions,'sdealer list',Sdealerpermissions)




                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                            // console.log(permissions, 'permissions',Sdealerpermissions, 'sealerpermissions', permissionCount, 'permision count', )
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

            if (error) {
                console.log(error);
            }
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
        let policy_note = record.policy_note;
        let policy_name = record.policy_name;
        // console.log(record,'id id', id)


        let query = "UPDATE policy SET push_apps = '" + push_apps + "', controls = '" + controls + "', permissions = '" + permissions + "', app_list = '" + app_list + "', policy_note = '" + policy_note + "', policy_name = '" + policy_name + "' WHERE id='" + id + "'";
        // console.log('qerury', query)
        sql.query(query, (error, result) => {
            console.log(result, 'relstsdf');
            if (error) {
                console.log(error);
            }
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

router.post('/check_policy_name', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] && verify.status == true) {
        try {
            let policy_name = req.body.name !== undefined ? req.body.name : null;
            let policy_id = req.body.policy_id;
            console.log(policy_id, 'policy id is')
            let loggedDealerId = verify.user.id;
            let loggedDealerType = verify.user.user_type;
            let connectedDealer = verify.user.connected_dealer;
            let except_id = "";
            let checkExistingQ = "SELECT policy_name FROM policy WHERE policy_name='" + policy_name + "' AND delete_status = 0 " + except_id;
            if (loggedDealerType === ADMIN) {
                if (policy_id != '') {
                    console.log('if called')
                    except_id = " AND id !='" + policy_id + "'";
                    checkExistingQ = checkExistingQ + except_id;
                }

            } else if (loggedDealerType === DEALER) {
                if (policy_id !== '') {
                    except_id = " AND id !='" + policy_id + "'";
                }
                let subDealerQ = "SELECT dealer_id FROM dealers WHERE connected_dealer=" + loggedDealerId;
                let subDealers = await sql.query(subDealerQ);
                let subDealerArray = [];
                subDealers.map((dealer) => {
                    subDealerArray.push(dealer.dealer_id)
                });
                if (subDealerArray.length) {
                    checkExistingQ = checkExistingQ + " AND (dealer_type='" + ADMIN + "' OR dealer_id=" + loggedDealerId + " OR dealer_id in (" + subDealerArray.join() + "))" + except_id
                } else {
                    checkExistingQ = checkExistingQ + " AND (dealer_type='" + ADMIN + "' OR dealer_id=" + loggedDealerId + " )" + except_id
                }
            } else if (loggedDealerType === SDEALER) {
                checkExistingQ = checkExistingQ + " AND (dealer_type='" + ADMIN + "' OR dealer_id=" + loggedDealerId + " OR dealer_id = " + connectedDealer + ")" + except_id;
            }
            let checkExisting = await sql.query(checkExistingQ);
            console.log(checkExistingQ, 'query is')
            if (checkExisting.length) {
                data = {
                    status: false,
                };
                res.send(data);
                return;
            }
            else {
                data = {
                    status: true,
                };
                res.send(data);
                return;
            }
        } catch (error) {
            console.log(error);
        }

    }
});

router.post('/save_policy', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {

            let policy_name = req.body.data.policy_name !== undefined ? req.body.data.policy_name : null;
            if (policy_name !== null) {
                let policy_note = req.body.data.policy_note !== undefined ? req.body.data.policy_note : null;
                let push_apps = null;
                let app_list = null;
                let secure_apps = null;
                if (req.body.data.push_apps !== undefined) {
                    req.body.data.push_apps.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        app.enable = (app.enable !== undefined) ? app.enable : false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;

                    });
                    push_apps = JSON.stringify(req.body.data.push_apps);
                }

                if (req.body.data.app_list !== undefined) {
                    req.body.data.app_list.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        app.enable = (app.enable !== undefined) ? app.enable : false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;

                    });
                    app_list = JSON.stringify(req.body.data.app_list);
                }

                if (req.body.data.secure_apps !== undefined) {
                    req.body.data.secure_apps.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        // app.enable = (app.enable!==undefined)? app.enable: false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;

                    });
                    secure_apps = JSON.stringify(req.body.data.secure_apps);
                }

                let system_permissions = req.body.data.system_permissions !== undefined ? JSON.stringify(req.body.data.system_permissions) : null;

                let loggedDealerId = verify.user.id;
                let loggedDealerType = verify.user.user_type;
                let connectedDealer = verify.user.connected_dealer;
                let checkExistingQ = "SELECT policy_name FROM policy WHERE policy_name='" + policy_name + "' AND delete_status = 0 ";
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

                var applyQuery = "INSERT INTO policy (policy_name, policy_note, command_name, app_list, push_apps, controls, permissions, dealer_id, dealer_type, dealers,status) VALUES ('" + policy_name + "', '" + policy_note + "', '" + command_name + "', '" + app_list + "', '" + push_apps + "', '" + system_permissions + "', '" + secure_apps + "', '" + loggedDealerId + "', '" + loggedDealerType + "', '[]',1)";

                sql.query(applyQuery, async function (err, rslts) {
                    if (err) {
                        console.log(err)
                    }
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
        console.log(error)
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

                    var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + userAccId + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy')";
                    sql.query(applyQuery, async function (err, policyApplied) {
                        if (err) {
                            console.log(err)
                        }

                        if (policyApplied && policyApplied.affectedRows) {

                            let isOnline = await device_helpers.isDeviceOnline(device_id, policy[0]);
                            // var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                            var loadDeviceQ = "INSERT INTO policy_queue_jobs (policy_id,device_id,is_in_process) " + " VALUES ('" + policy_id + "','" + device_id + "',1)"
                            // console.log(loadDeviceQ)
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
        console.log(error)
    }
});


router.post('/save/profile', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            // console.log('body is', req.body)
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
                // console.log(applyQuery, 'thats it');

                sql.query(applyQuery, async function (err, rslts) {
                    if (err) {
                        console.log(err)
                    }
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
        console.log(error)
    }
});


router.post('/apply_settings/:device_id', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let device_id = req.params.device_id;

            let usrAccId = req.body.usr_acc_id;
            let type = req.body.device_setting.type

            let dealer_id = verify.user.id

            let device_setting = req.body.device_setting;

            let app_list = (device_setting.app_list === undefined) ? '' : JSON.stringify(device_setting.app_list);

            let passwords = (device_setting.passwords === undefined) ? '' : JSON.stringify(device_setting.passwords);

            let controls = (req.body.device_setting.controls == undefined) ? '' : JSON.stringify(req.body.device_setting.controls);
            // console.log("hello controls", controls);
            let subExtensions = (req.body.device_setting.subExtensions == undefined) ? '' : JSON.stringify(req.body.device_setting.subExtensions);
            let applyQuery = '';
            if (type == 'profile') {

                applyQuery = "insert into device_history (device_id,dealer_id,user_acc_id, profile_name,app_list, passwords, controls, permissions, type) values ('" + device_id + "'," + dealer_id + "," + usrAccId + ",'" + device_setting.name + "' , '" + app_list + "', '" + passwords + "', '" + controls + "', '" + subExtensions + "' , 'profile')";
            } else {
                applyQuery = "insert into device_history (device_id,dealer_id,user_acc_id, app_list, passwords, controls, permissions) values ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + app_list + "', '" + passwords + "', '" + controls + "', '" + subExtensions + "')";
            }

            await sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log(err);
                }

                let isOnline = await device_helpers.isDeviceOnline(device_id);
                let permissions = subExtensions;

                if (isOnline) {
                    require("../bin/www").sendEmit(app_list, passwords, controls, permissions, device_id);
                }

                if (rslts) {
                    if (type == 'profile') {
                        data = {
                            "status": true,
                            "msg": 'Profile Applied Successfully',
                        };
                        res.send(data);
                    }
                    else {
                        data = {
                            "status": true,
                            "msg": 'Settings Applied Successfully',
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
    } catch (error) {
        console.log(error)
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
            let noOfApps = push_apps.length

            let apps = (push_apps === undefined) ? '' : JSON.stringify(push_apps);

            var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, push_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + apps + "', 'push_apps')";

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log(err);
                }
                if (rslts) {
                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    //job Queue query
                    var loadDeviceQ = "INSERT INTO apps_queue_jobs (device_id,action,type,total_apps,is_in_process) " + " VALUES ('" + device_id + "', 'push', 'push', " + noOfApps + " ,1)"
                    // var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                    await sql.query(loadDeviceQ)

                    if (isOnline) {

                        require("../bin/www").applyPushApps(apps, device_id);
                        data = {
                            "status": true,
                            "online": true,
                            noOfApps: noOfApps
                        };
                    }
                    else {
                        require("../bin/www").applyPushApps(apps, device_id);
                        data = {
                            "status": true,
                            noOfApps: noOfApps
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
        console.log(error)
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
            let noOfApps = pull_apps.length

            let apps = (pull_apps === undefined) ? '' : JSON.stringify(pull_apps);

            var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, pull_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + apps + "', 'pull_apps')";

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log(err);
                }
                if (rslts) {

                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    var loadDeviceQ = "INSERT INTO apps_queue_jobs (device_id,action,type,total_apps,is_in_process) " + " VALUES ('" + device_id + "', 'pull', 'pull', " + noOfApps + " ,1)"
                    // var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                    await sql.query(loadDeviceQ)
                    if (isOnline) {
                        data = {
                            "status": true,
                            "online": true,
                            noOfApps: noOfApps
                        };
                    } else {
                        data = {
                            "status": true,
                            noOfApps: noOfApps
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
        console.log(error)
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
        let profiles = [];
        // console.log('d_id', user_acc_id);
        if (user_acc_id != undefined && user_acc_id != '' && user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

        } else {
            where = "";
        }

        if (isValid) {
            let query = "SELECT * FROM usr_acc_profile " + where;

            // console.log("getprofiles query", query);
            sql.query(query, (error, results) => {

                for (var i = 0; i < results.length; i++) {
                    // console.log('push apps', results[i].push_apps)
                    let controls = (results[i].controls !== undefined && results[i].controls !== null) ? JSON.parse(results[i].controls) : JSON.parse('[]');;
                    let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : JSON.parse('[]');
                    let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : JSON.parse('[]');
                    let passwords = (results[i].passwords !== undefined && results[i].passwords !== null) ? JSON.parse(results[i].passwords) : JSON.parse('[]');

                    dta = {
                        id: results[i].id,
                        profile_name: results[i].profile_name,
                        controls: controls,
                        secure_apps: secure_apps,
                        app_list: app_list2,
                        passwords: passwords
                    }
                    profiles.push(dta);
                }
                //  console.log('profile',result)
                data = {
                    "status": true,
                    "msg": 'successful',
                    "profiles": profiles
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


router.post('/save_new_data', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        if (req.body.type == 'sim_id') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
            }
        } else if (req.body.type == 'chat_id') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE chat_ids (chat_id) value ('" + row.chat_id + "')");
            }
        } else if (req.body.type == 'pgp_email') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE pgp_emails (pgp_email) value ('" + row.pgp_email + "')");
            }
        }
        res.send({
            "status": true,
            "msg": "Inserted Successfully"
        })
        return
    } else {
        res.send({
            "status": false,
        })
        return
    }
});

// import sims
router.post('/import/:fieldName', async (req, res) => {
    // res.setHeader('Content-Type', 'multipart/form-data');
    // console.log(req);

    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        res.setHeader('Content-Type', 'multipart/form-data');
        // let filename = '';
        let fieldName = req.params.fieldName;
        let data = req.body.parsedData;
        if (fieldName == 'sim_ids') {
            for (let row of data) {
                if (row.sim_id && row.start_date && row.expiry_date) {
                    // let result = await sql.query("INSERT sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
                    let insertQ = `INSERT IGNORE INTO sim_ids (sim_id, start_date, expiry_date) value ( '${row.sim_id}','${row.start_date}', '${row.expiry_date}')`;
                    await sql.query(insertQ);
                }
            }
            res.send({
                status: true
            })
            return
        } else if (fieldName == 'chat_ids') {
            for (let row of data) {
                if (row.chat_id) {
                    let insertQ = `INSERT IGNORE INTO chat_ids (chat_id) value ('${row.chat_id}')`;
                    await sql.query(insertQ);
                }
            }
            res.send({
                status: true
            })
            return
        } else if (fieldName == 'pgp_emails') {

            for (let row of data) {
                if (row.pgp_email) {
                    let insertQ = `INSERT IGNORE INTO pgp_emails (pgp_email) value ('${row.pgp_email}')`;
                    await sql.query(insertQ);
                }
            }
            res.send({
                status: true
            })
            return
        } else {
            res.send({
                status: false,
            })
        }
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
                query = "SELECT * FROM sim_ids ";
            } else if (fieldName === "chat_ids") {
                query = "SELECT * FROM chat_ids "
            } else if (fieldName === "pgp_emails") {
                query = "SELECT * FROM pgp_emails ";
            }
            sql.query(query, async (error, response) => {
                if (error) {
                    console.log(error);
                }
                if (response.length) {
                    var data = [];

                    if (fieldName === "sim_ids") {
                        response.forEach((sim_id) => {
                            data.push({
                                sim_id: sim_id.sim_id,
                                start_date: sim_id.start_date,
                                expiry_date: sim_id.expiry_date,
                                used: sim_id.used
                            });
                        });
                    } else if (fieldName === "chat_ids") {
                        response.forEach((chat_id) => {
                            data.push({
                                chat_id: chat_id.chat_id,
                                used: chat_id.used
                            });
                        });
                    } else if (fieldName === "pgp_emails") {
                        response.forEach((pgp_email) => {
                            data.push({
                                pgp_email: pgp_email.pgp_email,
                                used: pgp_email.used
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

router.get('/get_all_sim_ids', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from sim_ids";
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

router.get('/get_all_chat_ids', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from chat_ids";
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

router.get('/get_all_pgp_emails', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from pgp_emails";
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
                if (error) {
                    console.log(error);
                }
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
                if (error) {
                    console.log(error);
                }
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
                if (error) {
                    console.log(error);
                }
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
            sql.query("select * from apk_details where delete_status=0 AND apk_type != 'permanent' order by id ASC", async function (error, results) {
                if (error) {
                    console.log(error);
                }

                if (results.length > 0) {
                    let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                    let dealerCount = await helpers.dealerCount(adminRoleId);
                    // console.log("dealer count", dealerCount)
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
                            "size": results[i].apk_size,
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
            sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.apk_type != 'permanent' AND delete_status = 0", async function (error, results) {
                if (error) {
                    console.log(error);
                }
                if (results.length > 0) {
                    let dealerRole = await helpers.getuserTypeIdByName(Constants.DEALER);
                    // console.log("Role", dealerRole);

                    let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                    // console.log(sdealerList);
                    let dealerCount = sdealerList ? sdealerList.length : 0;
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
        } else if (verify.user.user_type === AUTO_UPDATE_ADMIN) {
            sql.query("select * from apk_details where delete_status=0 AND apk_type = 'permanent' order by id ASC", async function (error, results) {
                if (error) {
                    console.log(error);
                }
                if (results.length > 0) {
                    // console.log("dealer_count ", dealerCount);
                    for (var i = 0; i < results.length; i++) {
                        dta = {
                            "apk_id": results[i].id,
                            "apk_name": results[i].app_name,
                            "logo": results[i].logo,
                            "apk": results[i].apk,
                            "permissions": [],
                            "apk_status": results[i].status,
                            "permission_count": 0,
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
router.post('/upload', async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = await verifyToken(req, res);
    //  console.log('verify', verify.status);
    if (verify.status !== undefined && verify.status == true) {
        let fileUploaded = false;
        let filename = "";
        let mimeType = "";
        let fieldName = "";

        console.log("File Uploading started.");

        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, path.join(__dirname, "../uploads/"));
            },

            filename: function (req, file, callback) {
                mimeType = file.mimetype;
                fieldName = file.fieldname;

                var filetypes = /jpeg|jpg|apk|png/;

                if (fieldName === Constants.LOGO && filetypes.test(mimeType)) {
                    fileUploaded = true;
                    filename = fieldName + '-' + Date.now() + '.jpg';
                    console.log("filename", filename);
                    callback(null, filename);
                } else if (fieldName === Constants.APK && mimeType === "application/vnd.android.package-archive" || mimeType === "application/octet-stream") {
                    fileUploaded = true;
                    filename = fieldName + '-' + Date.now() + '.apk';
                    // apk manifest should be check here
                    // helpers.getAPKVersionCode(req.files.apk);
                    callback(null, filename);
                } else {
                    callback("File type is not supported.");
                }
            }
        });

        var upload = multer({
            storage: storage,
            limits: { fileSize: "100mb" }
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
                    msg: "Error: " + err
                });
            }

            if (fileUploaded) {
                console.log("file uploaded")
                if (fieldName === Constants.APK) {
                    let file = path.join(__dirname, "../uploads/" + filename);
                    let versionCode = await helpers.getAPKVersionCode(file);
                    console.log("version code", versionCode);
                    let apk_stats = fs.statSync(file);

                    let formatByte = helpers.formatBytes(apk_stats.size);
                    if (versionCode) {

                        data = {
                            status: true,
                            msg: 'Success: App Uploaded Successfully.',
                            fileName: filename,
                            size: formatByte

                        };
                        res.send(data);
                        return;
                    } else {
                        data = {
                            status: false,
                            msg: "Error: Unable to read APP properties.",
                        };
                        res.send(data);
                        return;
                    }
                } else if (fieldName === Constants.LOGO) {
                    console.log("file was image");
                    data = {
                        status: true,
                        msg: 'Success: App logo Uploaded Successfully.',
                        fileName: filename,
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: "Error: Unauthorized file uploading attempt."
                    }
                    res.send(data);
                    return;
                }
            } else {
                data = {
                    status: false,
                    msg: "Error: Uploaded file is corrupt.",
                };
                res.send(data);
                return;
            }
        });
    }
});


// add apk. endpoints name should be changed
router.post('/checkApkName', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] && verify.status == true) {
        try {
            console.log(req.body);
            let apkName = req.body.name;
            let apk_id = req.body.apk_id
            let query = '';
            // console.log(apk_id);
            if (apkName != '' && apkName != null) {
                if (apk_id == '') {
                    query = "SELECT * from apk_details where app_name = '" + apkName + "' AND delete_status != 1"
                }
                else {
                    query = "SELECT * from apk_details where app_name = '" + apkName + "' AND delete_status != 1 AND id != " + apk_id
                }
                // console.log(query);
                let isUniqueName = await sql.query(query)
                if (isUniqueName.length) {
                    res.send({
                        status: false,
                    })
                } else {
                    res.send({
                        status: true
                    })
                }
            } else {
                res.send({
                    status: true
                })
            }
        } catch (error) {
            console.log(error);
        }

    }
});
// Purchase credits_CASH
router.post('/purchase_credits', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] && verify.status == true) {
        try {
            // console.log(req.body);
            let credits = req.body.data.credits
            let method = req.body.data.method
            let total_price = req.body.data.total
            let currency_price = req.body.data.currency_price
            let promo_code = req.body.data.promo_code
            let currency = req.body.data.currency
            let dealerId = verify.user.id
            // console.log(currency_price);

            // return
            if (credits != undefined && credits != '' && credits != null) {

                if (promo_code != '') {

                } else {
                    let query = `INSERT INTO credit_purchase (dealer_id,credits,usd_price,currency_price,payment_method) VALUES (${dealerId},${credits},${total_price},${currency_price},'${method}')`;
                    // console.log(query);
                    sql.query(query, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        // console.log(result);
                        if (result.affectedRows > 0) {
                            if (verify.user.user_type === ADMIN) {
                                if (method == 'CASH') {
                                    axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                                        if (response.data.status) {
                                            let data = {
                                                dealer_id: dealerId,
                                                dealer_pin: verify.user.link_code,
                                                dealer_name: verify.user.dealer_name,
                                                label: app_constants.APP_TITLE,
                                                credits: credits,
                                                dealer_email: verify.user.email
                                            }
                                            axios.post(app_constants.REQUEST_FOR_CREDITS, data, { headers: { authorization: response.data.user.token } }).then((response) => {
                                                // console.log(response);
                                                if (response.data.status) {
                                                    res.send({
                                                        status: true,
                                                        msg: response.data.msg
                                                    })

                                                } else {
                                                    // console.log("object");
                                                    res.send({
                                                        status: false,
                                                        msg: response.data.msg
                                                    })
                                                }
                                            })
                                        }
                                        else {
                                            // console.log("NOT ALLOWED");
                                            res.send({
                                                status: false,
                                                msg: "Not allowed to make request.",
                                            })
                                            return
                                        }
                                    })

                                } else {
                                    res.send()
                                }
                            } else {
                                // console.log(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`);
                                sql.query(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    if (result && result.affectedRows > 0) {
                                        res.send({
                                            status: true,
                                            msg: "Request submitted successfully.",
                                        })
                                        return
                                    }
                                    else {
                                        res.send({
                                            status: false,
                                            msg: "Request not submitted please try again.",
                                        })
                                    }
                                })

                            }
                        } else {
                            res.send()
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }

    }
});

// Purchase credits form Credit card
router.post('/purchase_credits_CC', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] && verify.status == true) {
        try {
            let credits = req.body.creditInfo.credits
            let method = req.body.creditInfo.method
            let total_price = req.body.creditInfo.total * 100
            let currency_price = req.body.creditInfo.currency_price
            let promo_code = req.body.creditInfo.promo_code
            let currency = req.body.creditInfo.currency
            let cardNumber = req.body.cardInfo.number
            let cardName = req.body.cardInfo.name
            let cvc = req.body.cardInfo.cvc
            let expiryCard = req.body.cardInfo.expiry
            let dealerId = verify.user.id
            let stripeToken = null
            let cardExpiryMonth = expiryCard.slice(0, 2)
            let cardExpiryYear = 20 + expiryCard.slice(5)
            // console.log(cardExpiryMonth);
            // console.log(cardExpiryYear);
            // console.log(total_price.toFixed(2));


            // return
            if (credits != undefined && credits != '' && credits != null) {

                if (promo_code != '') {

                } else {
                    let query = `INSERT INTO credit_purchase (dealer_id,credits,usd_price,currency_price,payment_method) VALUES (${dealerId},${credits},${total_price},${currency_price},'${method}')`;
                    // console.log(query);
                    sql.query(query, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        // console.log(result);
                        if (result.affectedRows > 0) {
                            stripe.tokens.create({
                                card: {
                                    number: cardNumber,
                                    exp_month: cardExpiryMonth,
                                    exp_year: cardExpiryYear,
                                    cvc: cvc
                                }
                            }, function (err, token) {
                                if (err) {
                                    console.log(err.type);
                                    switch (err.type) {
                                        case 'StripeCardError':
                                            // A declined card error
                                            console.log(err.message);
                                            err.message; // => e.g. "Your card's expiration year is invalid."
                                            break;
                                        case 'RateLimitError':
                                            // Too many requests made to the API too quickly
                                            break;
                                        case 'StripeInvalidRequestError':
                                            // Invalid parameters were supplied to Stripe's API
                                            break;
                                        case 'StripeAPIError':
                                            // An error occurred internally with Stripe's API
                                            break;
                                        case 'StripeConnectionError':
                                            // Some kind of error occurred during the HTTPS communication
                                            break;
                                        case 'StripeAuthenticationError':
                                            // You probably used an incorrect API key
                                            break;
                                        default:
                                            // Handle any other types of unexpected errors
                                            break;
                                    }
                                    res.send({
                                        status: false,
                                        msg: err.message
                                    })
                                    return
                                } else {
                                    stripeToken = token
                                    // console.log(token);
                                    stripe.charges.create({
                                        amount: total_price,
                                        currency: "usd",
                                        source: stripeToken.id, // obtained with Stripe.js
                                        metadata: { 'order_id': '6735' }
                                    }).then((response) => {
                                        if (response.status == 'succeeded') {
                                            res.send({
                                                status: true,
                                                msg: "Payment has been done.",
                                            })
                                            return
                                        };
                                    });
                                }
                            });
                            if (verify.user.user_type === ADMIN) {



                            } else {
                                // console.log(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`);
                                sql.query(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`, function (err, result) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    if (result && result.affectedRows > 0) {
                                        res.send({
                                            status: true,
                                            msg: "Request submitted successfully.",
                                        })
                                        return
                                    }
                                    else {
                                        res.send({
                                            status: false,
                                            msg: "Request not submitted please try again.",
                                        })
                                    }
                                })

                            }
                        } else {
                            res.send()
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }

    }
});



// add apk. endpoints name should be changed
router.post('/addApk', async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = await verifyToken(req, res);

    if (verify['status'] && verify.status == true) {
        try {
            let logo = req.body.logo;
            let apk = req.body.apk;
            let apk_name = req.body.name;
            if (!empty(logo) && !empty(apk) && !empty(apk_name)) {

                let file = path.join(__dirname, "../uploads/" + apk);
                if (fs.existsSync(file)) {
                    let versionCode = '';
                    let versionName = '';
                    let packageName = '';
                    let label = '';
                    let details = '';

                    versionCode = await helpers.getAPKVersionCode(file);
                    if (versionCode) {
                        versionName = await helpers.getAPKVersionName(file);
                        if (!versionName) {
                            versionName = ''
                        }

                        packageName = await helpers.getAPKPackageName(file);
                        if (!packageName) {
                            packageName = '';
                        }

                        label = await helpers.getAPKLabel(file);
                        if (!label) {
                            label = ''
                        }
                    } else {
                        versionCode = '';
                    }

                    versionCode = versionCode.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    versionName = versionName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    packageName = packageName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    // label = label.toString().replace(/(\r\n|\n|\r)/gm, "");
                    details = details.toString().replace(/(\r\n|\n|\r)/gm, "");
                    // console.log("versionName", versionName);
                    // console.log("pKGName", packageName);
                    // console.log("version Code", versionCode);
                    console.log("label", label);
                    // console.log('detai')

                    let apk_type = (verify.user.user_type === AUTO_UPDATE_ADMIN) ? 'permanent' : 'basic'

                    let apk_stats = fs.statSync(file);

                    let formatByte = helpers.formatBytes(apk_stats.size);

                    sql.query("INSERT INTO apk_details (app_name, logo, apk, apk_type, version_code, version_name, package_name, details, apk_bytes, apk_size) VALUES ('" + apk_name + "' , '" + logo + "' , '" + apk + "', '" + apk_type + "','" + versionCode + "', '" + versionName + "', '" + packageName + "', '" + details + "', " + apk_stats.size + ", '" + formatByte + "')", async function (err, rslts) {
                        let newData = await sql.query("SELECT * from apk_details where id = " + rslts.insertId)
                        dta = {
                            apk_id: newData[0].id,
                            apk_name: newData[0].app_name,
                            logo: newData[0].logo,
                            apk: newData[0].apk,
                            permissions: [],
                            apk_status: newData[0].status,
                            permission_count: 0,
                            deleteable: (newData[0].apk_type == "permanent") ? false : true,
                            apk_type: newData[0].apk_type
                        }


                        if (err) {
                            console.log(err)
                        };
                        data = {
                            status: true,
                            msg: "Apk is uploaded",
                            data: dta
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
                data = {
                    status: false,
                    msg: "Error While Uploading"
                };
                res.send(data);
                return;
            }
        } catch (error) {
            console.log(error);
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
            let logo = req.body.logo;
            let apk = req.body.apk;
            let apk_name = req.body.name;
            if (!empty(logo) && !empty(apk) && !empty(apk_name)) {

                let file = path.join(__dirname, "../uploads/" + apk);
                if (fs.existsSync(file)) {
                    let versionCode = '';
                    let versionName = '';
                    let packageName = '';
                    let label = '';
                    let details = '';

                    versionCode = await helpers.getAPKVersionCode(file);
                    if (versionCode) {
                        versionName = await helpers.getAPKVersionName(file);
                        if (!versionName) {
                            versionName = ''
                        }
                        packageName = await helpers.getAPKPackageName(file);
                        if (!packageName) {
                            packageName = '';
                        }
                        label = await helpers.getAPKLabel(file);
                        if (!label) {
                            label = ''
                        }
                    } else {
                        versionCode = '';
                    }

                    versionCode = versionCode.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    versionName = versionName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    packageName = packageName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    // label = label.replace(/(\r\n|\n|\r)/gm, "");
                    details = details.replace(/(\r\n|\n|\r)/gm, "");
                    // console.log("versionName", versionName);
                    // console.log("pKGName", packageName);
                    // console.log("version Code", versionCode);
                    console.log("label", label);
                    // console.log('detai')

                    // let apk_type = (verify.user.user_type === AUTO_UPDATE_ADMIN) ? 'permanent' : 'basic'

                    let apk_stats = fs.statSync(file);

                    let formatByte = helpers.formatBytes(apk_stats.size);
                    // console.log("update apk_details set app_name = '" + apk_name + "', logo = '" + logo + "', apk = '" + apk + "', version_code = '" + versionCode + "', version_name = '" + versionName + "', package_name='" + packageName + "', details='" + details + "', apk_byte='" + apk_stats.size + "',  apk_size='"+ formatByte +"'  where id = '" + req.body.apk_id + "'");

                    sql.query("update apk_details set app_name = '" + apk_name + "', logo = '" + logo + "', apk = '" + apk + "', version_code = '" + versionCode + "', version_name = '" + versionName + "', package_name='" + packageName + "', details='" + details + "', apk_bytes='" + apk_stats.size + "',  apk_size='" + formatByte + "'  where id = '" + req.body.apk_id + "'", function (err, rslts) {

                        if (err) {
                            console.log(err)
                        };
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
                if (err) {
                    console.log(err)
                };

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
                if (error) {
                    console.log(error);
                }
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
                            let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList ? sdealerList.length : 0;
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
                if (error) {
                    console.log(error);
                }
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
            console.log(parsedDealers.length, 'parsed dealers')
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
                if (error) {
                    console.log(error);
                }
                let permissionC = [];
                let rslt = await sql.query("select dealers from policy where id='" + policyId + "' order by id ASC")
                if (rslt.length) {
                    if (rslt !== undefined && rslt !== null) {
                        let permission = JSON.parse(rslt[0].dealers);
                        console.log(rslt, 'reslt lenth')
                        // console.log("Verify user id", verify.user.user_type);
                        if (verify.user.user_type === Constants.ADMIN) {
                            if (permission !== undefined && permission !== null && permission !== '[]') {
                                let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
                                let dealerCount = await helpers.dealerCount(adminRoleId);
                                console.log('amdin add all', permission.length, dealerCount)
                                permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();

                            }
                        } else if (verify.user.user_type === Constants.DEALER) {
                            let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList ? sdealerList.length : 0;
                            // console.log("dealer count", dealerCount);
                            let Sdealerpermissions = permission.filter(function (item) {
                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (item === sdealerList[i].dealer_id) {
                                        return item
                                    }
                                }
                            })
                            // console.log("sdeler permissiosn", Sdealerpermissions);
                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;

                            permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                            // console.log(permissionC, 'permissions count')
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
            console.log(dealers, 'dealer list from front-end');
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
                if (error) {
                    console.log(error);
                }
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
                            let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList ? sdealerList.length : 0;
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



/** Get back up DB File **/
router.get("/getBackupFile/:file", (req, res) => {

    if (fs.existsSync(path.join(__dirname, "../db_backup/" + req.params.file))) {
        let file = path.join(__dirname, "../db_backup/" + req.params.file);
        res.sendFile(file);
    } else {
        res.send({
            "status": false,
            "msg": "file not found"
        })
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

                if (error) {
                    console.log(error);
                }
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

//GET logion history

router.get('/login_history', async function (req, res) {
    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {

            let id = verify.user.id;
            let data = {}
            let query = "SELECT * from login_history where dealer_id = '" + id + "' AND type = 'token' order by created_at desc"
            // console.log(query);
            sql.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result.length) {
                    data = {
                        status: true,
                        data: result
                    }
                    res.send(data)
                }
                else {
                    data = {
                        status: false,
                        data: []
                    }
                    res.send(data)
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
});



router.delete('/delete_profile/:profile_id', async function (req, res) {
    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        if (!empty(req.params.profile_id)) {

            sql.query("delete from device_history WHERE id=" + req.params.profile_id, function (error, results) {
                // console.log(results);
                //response.end(JSON.stringify(rows));
                if (error) {
                    console.log(error);
                }
                if (results.affectedRows == 0) {
                    data = {
                        status: false,
                        msg: "Apk not deleted.",
                        fld: fields,
                        rdlt: results
                    };
                } else {
                    data = {
                        status: true,
                        msg: "Apk deleted successfully.",

                    };
                }
                res.send(data);
                return;
            });
        } else {
            data = {
                status: false,
                msg: "Some error occurred."

            }
            res.send(data);
            return;
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
                password_matched: true
            });
            return;
        }
    }
    res.send({
        password_matched: false
    });
    return;
});

// Get Imei history
router.get('/get_imei_history/:device_id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let query = "select * from imei_history where device_id = '" + req.params.device_id + "'";
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
            let results = await sql.query("select * from users where del_status =0 order by created_at DESC")
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
                if (error) {
                    console.log(error);
                }
                dealer = [verify.user.id]
                console.log(result);
                if (result.length) {
                    for (var i = 0; i < result.length; i++) {
                        var sDealers_id = result[i].dealer_id;
                        dealer.push(sDealers_id)
                    }
                }
                console.log("select * from users WHERE dealer_id IN (" + dealer.join() + ") order by created_at DESC");
                let results = await sql.query("select * from users WHERE dealer_id IN (" + dealer.join() + ") AND del_status = 0 order by created_at DESC")
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
            let results = await sql.query("select * from users WHERE dealer_id = '" + verify.user.id + "' AND del_status = 0 order by created_at DESC")
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
    let toDelete = (appKeys.length === 0) ? "''" : appKeys.join(',')
    if (verify.status !== undefined && verify.status == true) {
        let dealer_type = verify.user.user_type;
        let dealer_id = verify.user.id;
        if (dealer_type === ADMIN) {

            let deleteNotIn = "DELETE FROM secure_market_apps WHERE apk_id NOT IN (" + toDelete + ")"
            // console.log(deleteNotIn);
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
                // console.log(insertQuery + insertOrIgnore);
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
            apklist = await sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.delete_status = 0 AND apk_details.apk_type != 'permanent'")
        }
        else {
            apklist = await sql.query("select * from apk_details where delete_status=0 AND apk_type != 'permanent'")
        }
        if (verify.user.user_type !== ADMIN) {
            where = "AND (secure_market_apps.dealer_type = 'admin' OR secure_market_apps.dealer_id = '" + verify.user.id + "')"
        }
        sql.query("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id, secure_market_apps.is_restrict_uninstall  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 AND apk_details.apk_type != 'permanent'" + where + " ORDER BY created_at desc", async function (err, results) {
            if (err) {
                console.log(err);
            }

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
        return;
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
            apklist = await sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.delete_status = 0 AND apk_details.apk_type != 'permanent'")
        }
        else {
            apklist = await sql.query("select * from apk_details where delete_status=0 AND apk_type != 'permanent'")
        }
        if (verify.user.user_type !== ADMIN) {
            where = "AND (secure_market_apps.dealer_type = 'admin' OR secure_market_apps.dealer_id = '" + verify.user.id + "')"
        }
        // console.log("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 " + where + "ORDER BY created_at desc");
        sql.query("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id , secure_market_apps.is_restrict_uninstall  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 AND apk_details.apk_type != 'permanent'" + where + "ORDER BY created_at desc", async function (err, results) {
            if (err) {
                console.log(err);
            }

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
        return;
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
                if (err) {
                    console.log(err)
                }
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
        console.log(error);
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
                    sql.query("INSERT INTO device_history (device_id,dealer_id,user_acc_id, imei, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + newImei + "', 'imei')", async function (err, results) {
                        if (err) {
                            console.log(err)
                        }

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
                            console.log(err)
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
        console.log(error);
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
                if (accResults[i].action == Constants.DEVICE_PENDING_ACTIVATION || accResults[i].action == Constants.DEVICE_PRE_ACTIVATION || accResults[i].action === Constants.DEVICE_EXPIRED || accResults[i].action == 'DELETE') {
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
                    "data": deviceResults[i],
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
        console.log(error);
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
        console.log(error);
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
                    let historyQ = "INSERT INTO device_history (device_id, dealer_id, user_acc_id, type) VALUES ('" + device_id + "', " + dealer_id + ", " + usr_acc.id + ", '" + Constants.DEVICE_HISTORY_FORCE_UPDATE + "')";
                    sql.query(historyQ, function (error, resp) {
                        if (error) {
                            console.log(error);
                        };
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


/*****AUTHENTICATE UPDATE USER*****/
router.post('/authenticate_update_user', async function (req, res) {
    var email = req.body.email;
    var pwd = req.body.pwd;
    console.log(pwd);
    var enc_pwd = md5(pwd);
    var data = '';
    var userType = await helpers.getDealerTypeIdByName(AUTO_UPDATE_ADMIN);
    var verify = await verifyToken(req, res);
    if (verify.status) {
        // console.log("select * from dealers where type = '" + userType + "' and dealer_email='" + email + "' and password='" + enc_pwd + "'");
        let query_res = await sql.query("select * from dealers where type = '" + userType + "' and dealer_email='" + email + "' and password='" + enc_pwd + "'");
        if (query_res.length) {

            data = {
                status: true,
                matched: true
            }
            res.send(data);
            return;
        }
        else {
            data = {
                status: false,
                matched: false
            }
            res.send(data);
            return
        }
    } else {
        data = {
            status: false,
            matched: false
        }
        res.send(data);
        return
    }
});


// *****************************  SET AND GET => PRICES & PAKAGES   **************************
router.patch('/save-prices', async function (req, res) {
    // console.log('save-prices data at server is', req.body)
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let data = req.body.data;
        if (data) {
            // console.log(data, 'data')
            // let dealer_id = req.body.dealer_id;
            let dealer_id = verify.user.dealer_id;
            if (dealer_id) {
                // console.log(dealer_id, 'whitelableid');
                let error = 0;

                let month = ''
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        // console.log(key + " -> " + data[key]);
                        let outerKey = key;

                        let innerObject = data[key];
                        // console.log('iner object is', innerObject)
                        for (var innerKey in innerObject) {
                            if (innerObject.hasOwnProperty(innerKey)) {
                                let days = 0;
                                // console.log(innerKey + " -> " + innerObject[innerKey]);
                                if (innerObject[innerKey]) {

                                    // console.log('is string', string)
                                    let stringarray = [];

                                    stringarray = innerKey.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                                    if (stringarray) {
                                        // console.log(stringarray,'is string lenth', stringarray.length)
                                        if (stringarray.length) {
                                            month = stringarray[0];
                                            // console.log('is month', month, stringarray[1])
                                            if (month && stringarray[1]) {
                                                // console.log('sring[1]', stringarray[1])
                                                if (stringarray[1] == 'month') {
                                                    days = parseInt(month) * 30
                                                } else if (string[1] == 'year') {
                                                    days = parseInt(month) * 365
                                                } else {
                                                    days = 30
                                                }
                                            }
                                        }
                                    }
                                }
                                // console.log(days, 'days are')
                                let unit_price = innerKey;
                                let updateQuery = "UPDATE prices SET unit_price='" + innerObject[innerKey] + "', price_expiry='" + days + "', dealer_id='" + dealer_id + "' WHERE price_term='" + innerKey + "' AND price_for='" + key + "'";
                                // console.log(updateQuery, 'query')
                                sql.query(updateQuery, async function (err, result) {
                                    if (err) {
                                        console.log(err)
                                    }

                                    if (result) {
                                        // console.log('outerKey', outerKey)
                                        if (!result.affectedRows) {
                                            let insertQuery = "INSERT INTO prices (price_for, unit_price, price_term, price_expiry, dealer_id) VALUES('" + outerKey + "', '" + innerObject[innerKey] + "', '" + unit_price + "', '" + days + "', '" + dealer_id + "')";
                                            // console.log('insert query', insertQuery)
                                            let rslt = await sql.query(insertQuery);
                                            if (rslt) {
                                                if (rslt.affectedRows == 0) {
                                                    error++;
                                                }
                                            }
                                            // console.log(rslt, 'inner rslt')
                                        }
                                    }
                                })
                            }
                        }

                    }
                }
                console.log('errors are ', error)

                if (error == 0) {
                    res.send({
                        status: true,
                        msg: 'Prices Set Successfully'
                    })
                } else {
                    res.send({
                        status: false,
                        msg: 'Some Error Accured'
                    })
                }

            } else {
                res.send({
                    status: false,
                    msg: 'Invalid Dealer'
                })
            }

        } else {
            res.send({
                status: false,
                msg: 'Invalid Data'
            })
        }
    }
});


router.post('/save-package', async function (req, res) {
    console.log('data is', req.body)
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        // console.log(verify.user, 'user is the ')
        let data = req.body.data;
        let dealer_id = verify.user.dealer_id;
        if (data) {
            // console.log(data, 'data')
            // let dealer_id = req.body.data.dealer_id;
            if (dealer_id) {
                // console.log(dealer_id, 'whitelableid');
                let days = 0;
                if (data.pkgTerm) {
                    stringarray = data.pkgTerm.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                    if (stringarray) {
                        // console.log(stringarray,'is string lenth', stringarray.length)
                        if (stringarray.length) {
                            month = stringarray[0];
                            // console.log('is month', month, stringarray[1])
                            if (month && stringarray[1]) {
                                // console.log('sring[1]', stringarray[1])
                                if (stringarray[1] == 'month') {
                                    days = parseInt(month) * 30
                                } else if (string[1] == 'year') {
                                    days = parseInt(month) * 365
                                } else {
                                    days = 30
                                }
                            }
                        }
                    }
                }
                let pkg_features = JSON.stringify(data.pkgFeatures)
                let insertQuery = "INSERT INTO packages (pkg_name, pkg_term, pkg_price, pkg_expiry, pkg_features, dealer_id) VALUES('" + data.pkgName + "', '" + data.pkgTerm + "', '" + data.pkgPrice + "','" + days + "', '" + pkg_features + "', '" + dealer_id + "')";
                sql.query(insertQuery, async (err, rslt) => {
                    if (err) {
                        console.log(err)
                    }

                    if (rslt) {
                        if (rslt.affectedRows) {
                            insertedRecord = await sql.query("SELECT * FROM packages WHERE dealer_id='" + dealer_id + "' AND id='" + rslt.insertId + "'")
                            res.send({
                                status: true,
                                msg: 'Package Saved Successfully',
                                data: insertedRecord
                            })
                        }
                    }
                })

            } else {
                res.send({
                    status: false,
                    msg: 'Invalid Dealer'
                })
            }
        } else {
            res.send({
                status: false,
                msg: 'Invalid Data'
            })
        }
    }
});


router.get('/get-language', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            let selectQuery = `SELECT LT.key_id, LT.key_value FROM dealer_language AS dl 
            JOIN lng_translations AS LT 
            ON (LT.lng_id = dl.dealer_lng_id) 
            WHERE dl.dealer_id=${dealer_id}`;

            sql.query(selectQuery, (err, rslt) => {
                if (err) console.log(err);

                if (rslt && rslt.length) {
                    let obj = {}
                    rslt.forEach((elem) => {
                        let key_id = elem.key_id;
                        // obj.push({
                        obj[key_id] = elem.key_value
                        // });
                    })
                    res.send({
                        status: true,
                        msg: 'success',
                        data: JSON.stringify(obj)
                    })
                    return;
                } else {
                    res.send({
                        status: false,
                        msg: 'No data',
                        data: {}
                    })
                    return;
                }
            })
        }
    }
})


router.patch('/save-language', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        // console.log('save lang body is: ', req.body);
        let lang_id = req.body.language.id;
        let language = req.body.language;
        let dealer_lan_id = req.body.language.language_id;
        // console.log('------------------------------')
        // console.log('dealer lang id is: ', dealer_lan_id)
        // console.log('dealer lang id is: ', language)
        // console.log('------------------------------')

        let dealer_id = verify.user.dealer_id;
        console.log(dealer_id, 'dealer id is', verify.user)
        if (dealer_id && language) {
            language = JSON.stringify(language);
            let updateQuery = "UPDATE dealer_language SET dealer_lng_id='" + lang_id + "' WHERE dealer_id='" + dealer_id + "'";
            sql.query(updateQuery, async (err, rslt) => {
                if (err) {
                    console.log(err)
                }

                if (rslt) {
                    if (rslt.affectedRows) {
                        res.send({
                            status: true,
                            msg: 'Language changed Successfully'
                        })
                    } else {
                        let insertQuery = "INSERT INTO dealer_language (dealer_id, dealer_lng_id) VALUES ('" + dealer_id + "', '" + lang_id + "')";
                        let inserted = sql.query(insertQuery);
                        if (inserted) {
                            res.send({
                                status: true,
                                msg: 'Language changed Successfully'
                            })
                        } else {
                            res.send({
                                status: false,
                                msg: 'Error while Process'
                            })
                        }
                    }

                } else {
                    res.send({
                        status: false,
                        msg: 'Error while Process'
                    })
                }
            })
        }

    }
})



router.get('/get-prices/:dealer_id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        // let dealer_id = req.params.dealer_id;
        console.log(verify.user)
        let dealer_id = verify.user.dealer_id;
        let sim_id = {};
        let chat_id = {};
        let pgp_email = {};
        let vpn = {};
        if (dealer_id) {
            let selectQuery = "SELECT * FROM prices WHERE dealer_id='" + dealer_id + "'";
            sql.query(selectQuery, async (err, reslt) => {
                if (err) {
                    console.log(err)
                }
                if (reslt) {
                    console.log('result for get prices are is ', reslt);

                    if (reslt.length) {
                        for (let item of reslt) {
                            if (item.price_for == 'sim_id') {
                                sim_id[item.price_term] = item.unit_price
                            } else if (item.price_for == 'chat_id') {
                                chat_id[item.price_term] = item.unit_price
                            } else if (item.price_for == 'pgp_email') {
                                pgp_email[item.price_term] = item.unit_price
                            } else if (item.price_for == 'vpn') {
                                vpn[item.price_term] = item.unit_price
                            }
                        }
                        let data = {
                            sim_id: sim_id ? sim_id : {},
                            chat_id: chat_id ? chat_id : {},
                            pgp_email: pgp_email ? pgp_email : {},
                            vpn: vpn ? vpn : {}
                        }
                        console.log(data, 'reslt data of prices')
                        res.send({
                            status: true,
                            msg: "Data found",
                            data: data

                        })
                    } else {
                        let data = {
                            sim_id: sim_id ? sim_id : {},
                            chat_id: chat_id ? chat_id : {},
                            pgp_email: pgp_email ? pgp_email : {},
                            vpn: vpn ? vpn : {}
                        }

                        res.send({
                            status: true,
                            msg: "Data found",
                            data: data
                        })
                    }

                } else {
                    let data = {
                        sim_id: sim_id ? sim_id : {},
                        chat_id: chat_id ? chat_id : {},
                        pgp_email: pgp_email ? pgp_email : {},
                        vpn: vpn ? vpn : {}
                    }

                    res.send({
                        status: true,
                        msg: "Data found",
                        data: data
                    })
                }
            })
        } else {

            let data = {
                sim_id: sim_id ? sim_id : {},
                chat_id: chat_id ? chat_id : {},
                pgp_email: pgp_email ? pgp_email : {},
                vpn: vpn ? vpn : {}
            }

            res.send({
                status: false,
                msg: 'Invalid dealer_id',
                data: data

            })
        }
    }
});

router.get('/get-packages/:dealer_id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        // let dealer_id = req.params.dealer_id;
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            let selectQuery = "SELECT * FROM packages WHERE dealer_id='" + dealer_id + "'";
            sql.query(selectQuery, async (err, reslt) => {
                if (err) {
                    console.log(err)
                }

                if (reslt) {
                    console.log('result for get prices are is ', reslt);

                    if (reslt.length) {
                        console.log(reslt, 'reslt data of prices')
                        res.send({
                            status: true,
                            msg: "Data found",
                            data: reslt

                        })
                    } else {
                        res.send({
                            status: true,
                            msg: "Data found",
                            data: []

                        })
                    }

                } else {

                    res.send({
                        status: true,
                        msg: "Data found",
                        data: []
                    })
                }
            })
        } else {

            res.send({
                status: false,
                msg: 'Invalid dealer_id',
                data: []

            })
        }
    }
});

router.patch('/check-package-name', async function (req, res) {

    try {
        var verify = await verifyToken(req, res);
        if (verify.status !== undefined && verify.status == true) {
            let name = req.body.name !== undefined ? req.body.name : null;

            let checkExistingQ = "SELECT pkg_name FROM packages WHERE pkg_name='" + name + "'";

            let checkExisting = await sql.query(checkExistingQ);
            console.log(checkExistingQ, 'query is')
            if (checkExisting.length) {
                data = {
                    status: false,
                };
                res.send(data);
                return;
            }
            else {
                data = {
                    status: true,
                };
                res.send(data);
                return;
            }
        }
    } catch (error) {
        console.log(error);
    }

});
router.post('/update_credit', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        try {
            let credits = req.body.data.credits
            let dealer_id = req.body.data.dealer_id
            console.log(credits);
            if (dealer_id !== '' && dealer_id !== undefined && dealer_id !== null) {
                sql.query("SELECt * from dealer_credits where dealer_id = " + dealer_id, function (err, result) {
                    if (err) {
                        console.log(err)
                    }

                    if (result.length) {
                        let newCredit = credits + result[0].credits
                        sql.query("update dealer_credits set credits = " + newCredit + " where dealer_id = " + dealer_id, function (err, reslt) {
                            if (err) {
                                console.log(err)
                            }

                            if (reslt && reslt.affectedRows > 0) {
                                res.send({
                                    status: true,
                                    msg: "Credits added successfully."
                                })
                                return
                            }
                            else {
                                res.send({
                                    status: false,
                                    msg: "Credits not updated please try again."
                                })
                                returns

                            }
                        })
                    }
                    else {
                        let query = `INSERT into dealer_credits (dealer_id,credits) VALUES (${dealer_id}, ${credits})`;
                        sql.query(query, function (err, reslt) {
                            if (err) {
                                console.log(err);
                            }
                            if (reslt && reslt.affectedRows > 0) {
                                res.send({
                                    status: true,
                                    msg: "Credits added successfully."
                                })
                                return
                            }
                            else {
                                res.send({
                                    status: false,
                                    msg: "Credits not updated please try again."
                                })
                                returns

                            }
                        })
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
});
router.get('/newRequests', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        try {
            let query = ''
            // console.log(verify.user);
            if (verify.user.user_type === ADMIN) {
                query = "SELECT * from credit_requests where status = '0' AND dealer_type = 'dealer'"
            } else {
                let sdealers = await helpers.getSdealersByDealerId(verify.user.id)
                // console.log(sdealers);
                if (sdealers.length) {
                    query = `SELECT * from credit_requests where status = '0' AND dealer_type = 'sdealer' AND dealer_id IN (${sdealers.join()})`
                } else {
                    data = {
                        "status": false,
                        "data": []
                    };
                    res.send(data);
                    return
                }
            }
            console.log(query);
            sql.query(query, function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    data = {
                        "status": true,
                        "data": result
                    };
                    res.send(data);
                    return
                } else {
                    data = {
                        "status": true,
                        "data": []
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
})
router.get('/get_user_credits', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        try {
            let query = ''
            query = `SELECT credits from dealer_credits where dealer_id= ${verify.user.id}`

            sql.query(query, function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    console.log(result);
                    data = {
                        "status": true,
                        "credits": result[0].credits
                    };
                    res.send(data);
                    return
                } else {
                    data = {
                        "status": true,
                        "credits": 0
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
})
router.put('/delete_request/:id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        try {
            let id = req.params.id
            let query = "SELECT * from credit_requests where id = " + id + " and  status = '0'"
            console.log(query);
            sql.query(query, function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {

                    let updateQuery = "update credit_requests set status = 1, del_status = 1 where id= " + id
                    sql.query(updateQuery, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        if (result && result.affectedRows > 0) {
                            data = {
                                "status": true,
                                "msg": "Request deleted successfully."
                            };
                            res.send(data);
                            return
                        } else {
                            data = {
                                "status": false,
                                "msg": "Request not deleted please try again."
                            };
                            res.send(data);
                            return
                        }
                    })

                } else {
                    data = {
                        "status": false,
                        msg: "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
})

router.put('/accept_request/:id', async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        try {
            let id = req.params.id
            let query = "SELECT * from credit_requests where id = " + id + " and  status = '0'"
            // console.log(query);
            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    let logginUserCredits = await sql.query("select credits from dealer_credits where dealer_id = " + verify.user.id)
                    if (logginUserCredits.length) {
                        if (logginUserCredits[0].credits > result[0].credits) {
                            let dealer_id = result[0].dealer_id
                            let newCredit = result[0].credits
                            let deductedCredits = logginUserCredits[0].credits - result[0].credits
                            let credits = await sql.query("select * from dealer_credits where dealer_id = " + dealer_id);
                            // console.log(resul);
                            if (credits.length) {
                                newCredit = credits[0].credits + result[0].credits
                            }
                            sql.query("update dealer_credits set credits = " + newCredit + " where dealer_id = " + dealer_id, async function (err, reslt) {
                                if (err) {
                                    console.log(err);
                                }
                                if (reslt && reslt.affectedRows > 0) {
                                    let updateQuery = "update credit_requests set status = 1 where id= " + id
                                    await sql.query(updateQuery);
                                    let userCredits = "update dealer_credits set credits = " + deductedCredits + " where dealer_id = " + verify.user.id;
                                    await sql.query(userCredits)
                                    res.send({
                                        status: true,
                                        msg: "Credits added successfully.",
                                        user_credits: deductedCredits
                                    })
                                    return
                                }
                                else {
                                    let query = `INSERT into dealer_credits (dealer_id,credits) VALUES (${dealer_id}, ${newCredit})`;
                                    sql.query(query, async function (err, reslt) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (reslt && reslt.affectedRows > 0) {
                                            let updateQuery = "update credit_requests set status = 1 where id= " + id
                                            await sql.query(updateQuery)
                                            let userCredits = "update dealer_credits set credits = " + deductedCredits + " where dealer_id = " + verify.user.id;
                                            await sql.query(userCredits)
                                            res.send({
                                                status: true,
                                                msg: "Credits added successfully.",
                                                user_credits: deductedCredits
                                            })
                                            return
                                        }
                                        else {
                                            res.send({
                                                status: false,
                                                msg: "Credits not updated please try again."
                                            })
                                            returns

                                        }
                                    })
                                }
                            })
                        }
                        else {
                            res.send({
                                status: false,
                                msg: "Your credits are not enough to accept a request."
                            })
                            return
                        }
                    } else {
                        res.send({
                            status: false,
                            msg: "Your credits are not enough to accept a request."
                        })
                        return
                    }
                } else {
                    data = {
                        "status": false,
                        msg: "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
})

/*** Create Backup ***/
router.post('/create_backup_DB', async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        var ws;
        var wb = XLSX.utils.book_new();
        let devices = []
        let query = "SELECT * From acc_action_history WHERE action = 'UNLINKED'";
        let newArray = await sql.query(query)
        let results = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 order by devices.id DESC')
        for (var i = 0; i < results.length; i++) {
            results[i].finalStatus = device_helpers.checkStatus(results[i])
            results[i].pgp_email = await device_helpers.getPgpEmails(results[i])
            results[i].sim_id = await device_helpers.getSimids(results[i])
            results[i].chat_id = await device_helpers.getChatids(results[i])
            results[i].validity = await device_helpers.checkRemainDays(results[i].created_at, results[i].validity)
            // dealerData = await device_helpers.getDealerdata(results[i]);
        }
        let finalResult = [...results, ...newArray]
        // console.log('old', finalResult);
        let checkValue = helpers.checkValue;
        for (let device of finalResult) {
            let data = {
                device_id: checkValue(device.device_id),
                user_id: checkValue(device.user_id),
                batch_no: checkValue(device.batch_no),
                name: checkValue(device.name),
                dealer_id: checkValue(device.dealer_id),
                dealer_name: checkValue(device.dealer_name),
                account_email: checkValue(device.account_email),
                account_name: checkValue(device.account_name),
                model: checkValue(device.model),
                link_code: checkValue(device.link_code),
                activation_code: checkValue(device.activation_code),
                pgp_email: checkValue(device.pgp_email),
                chat_id: checkValue(device.chat_id),
                sim_id: checkValue(device.sim_id),
                client_id: checkValue(device.client_id),
                finalStatus: checkValue(device.finalStatus),
                ip_address: checkValue(device.ip_address),
                mac_address: checkValue(device.mac_address),
                serial_number: checkValue(device.serial_number),
                imei: checkValue(device.imei),
                imei2: checkValue(device.imei2),
                online: checkValue(device.online),
                simno: checkValue(device.simno),
                simno2: checkValue(device.simno2),
                note: checkValue(device.note),
                prnt_dlr_id: checkValue(device.prnt_dlr_id),
                prnt_dlr_name: checkValue(device.prnt_dlr_name),
                connected_dealer: checkValue(device.connected_dealer),
                start_date: checkValue(device.start_date),
                expiry_date: checkValue(device.expiry_date),
                expiry_months: checkValue(device.expiry_months),
                validity: checkValue(device.validity),
                updated_at: checkValue(device.updated_at),
                created_at: checkValue(device.created_at),
            }
            devices.push(data)
        }
        if (devices.length) {
            ws = XLSX.utils.json_to_sheet(devices);
            XLSX.utils.book_append_sheet(wb, ws, 'Devices');
        }

        let userData = await sql.query('select id,user_id,user_name,email,dealer_id from users');
        if (userData.length) {
            ws = XLSX.utils.json_to_sheet(userData);
            XLSX.utils.book_append_sheet(wb, ws, 'Users');
        }
        let dealerData = await sql.query('select dealer_id,dealer_name,dealer_email,link_code,connected_dealer ,unlink_status from dealers WHERE dealer_email != "super123!admin@gmail.com"');
        if (userData.length) {
            ws = XLSX.utils.json_to_sheet(dealerData);
            XLSX.utils.book_append_sheet(wb, ws, 'Dealers');
        }
        let IDsTables = ['chat_ids', 'sim_ids', 'pgp_emails'];
        for (let i = 0; i < IDsTables.length; i++) {
            let tableDate = await sql.query("SELECT * from " + IDsTables[i])
            if (tableDate.length) {
                /* make the worksheet */
                ws = XLSX.utils.json_to_sheet(tableDate);
                /* add to workbook */
                XLSX.utils.book_append_sheet(wb, ws, IDsTables[i]);
            }
        }
        let fileNameCSV = 'DB_Backup' + '_' + Date.now() + ".xlsx";
        await XLSX.writeFile(wb, path.join(__dirname, "../db_backup/" + fileNameCSV))
        let data = {
            status: true,
            path: fileNameCSV
        }
        res.send(data)
        // let file =  zipFileName
    }
});


router.get('/get_csv_ids', async (req, res) => {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let pgp_query = "select * from pgp_emails";
        let pgp_emails = await sql.query(pgp_query)
        let chat_query = "select * from chat_ids";
        let chat_ids = await sql.query(chat_query)
        let sim_query = "select * from sim_ids";
        let sim_ids = await sql.query(sim_query)

        res.send({
            status: true,
            pgp_emails,
            chat_ids,
            sim_ids
        })
    }
    else {
        res.send({
            status: false,
        })
    }
});


module.exports = router;