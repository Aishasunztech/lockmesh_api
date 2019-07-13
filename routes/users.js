// ====== libraries
var express = require('express');
var router = express.Router();
var generator = require('generate-password');
var md5 = require('md5');
var empty = require('is-empty');
var datetime = require('node-datetime');
var jwt = require('jsonwebtoken');
var randomize = require('randomatic');
var multer = require('multer');

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
// var config = require('../helper/config.js');

var Constants = require('../constants/Application');
var MsgConstants = require('../constants/MsgConstants');
var app_constants = require('../config/constants');

var helpers = require('../helper/general_helper.js');
const device_helpers = require('../helper/device_helpers.js');

//=========== Custom Libraries =========
const constants = require('../config/constants');
const { sendEmail } = require('../lib/email');


// ========== Controllers ========
var userController = require('../app/controllers/user');
const authController = require('../app/controllers/auth');
const aclController = require('../app/controllers/acl');
const deviceController = require('../app/controllers/device');
const dealerController = require('../app/controllers/dealer');
const policyController = require('../app/controllers/policy');
const accountController = require('../app/controllers/account');
const apkController = require('../app/controllers/apk');
const billingController = require('../app/controllers/billing');
const backupController = require('../app/controllers/backup');
const appController = require('../app/controllers/app');
const languageController = require('../app/controllers/language');


// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no"


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
    // }, async function (err, token) {
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

    // let data1 = await cm.import(options, data, async function (err, rows) {
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

// router.post('/super_admin_login', authController.superAdminLogin)


// /*****User Login*****/
// router.post('/login', authController.login);

// router.post('/verify_code', authController.verifyCode);

// enable or disable two factor auth
router.post('/two_factor_auth', async function (req, res) {
    var verify = req.decoded;
    // if (verify['status'] !== undefined && verify.status === true) {
        if (verify) {
        let loggedDealerId = verify.user.id;
        isEnable = req.body.isEnable;
        let updateDealerQ = "UPDATE dealers SET is_two_factor_auth=" + isEnable + " WHERE dealer_id=" + loggedDealerId;
        let updatedDealer = await sql.query(updateDealerQ);
        if (updatedDealer.affectedRows) {
            if (isEnable) {
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.DUAL_AUTH_SUCC_ENBL], "Dual Authentication is Successfully enabled"), // Dual Authentication is Successfully enabled
                    isEnable: isEnable
                }
                res.send(data)
            } else {
                data =  {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.DUAL_AUTH_SUCC_DISABL], "Dual Authentication is Successfully disabled"), // Dual Authentication is Successfully disabled
                    isEnable: isEnable
                }
                res.send(data)
            }
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.DUAL_AUTH_NOT_ENBL], "Dual Authentication could not be enabled"), // Dual Authentication could not be enabled
            }
            res.send(data)
        }

    }
});


router.get('/get_allowed_components', aclController.getAllowedComponents);


router.post('/check_component', aclController.checkComponent);

/** is_admin **/
router.get('/is_admin', aclController.isAdmin);

/** get_user_type **/
router.get('/user_type', aclController.getUserType);


// ============== Devices ============ //

/**GET all the devices**/
router.get('/devices', deviceController.devices);

// add new device
router.put('/new/device', deviceController.acceptDevice);

/**GET New the devices**/
router.get('/new/devices', deviceController.newDevices);

/***Add devices (not using) ***/

// router.post('/create/device_profile', deviceController.createPreactivations);
router.post('/create/device_profile', deviceController.createDeviceProfile);

router.post('/transfer/device_profile', deviceController.transferDeviceProfile);


/**UPDATE Device details**/
router.put('/edit/devices', deviceController.editDevices);

/**Devices record delete**/
router.put('/delete/:device_id', deviceController.deleteDevice);

/** Unlink Device  **/
router.post('/unlink/:id', deviceController.unlinkDevice);

/** Suspend Account Devices / client **/
router.post('/suspend/:id', deviceController.suspendAccountDevices);

/** Activate Device **/
router.post('/activate/:id', deviceController.activateDevice);

router.post('/wipe/:id', deviceController.wipeDevice);

router.post('/UnflagDevice/:id', deviceController.unflagDevice);

router.post('/flagDevice/:id', deviceController.flagDevice);

/** Get Device Details of Dealers (Connect Page) **/
router.get('/connect/:device_id', deviceController.connectDevice);

/** Get get App Job Queue  (Connect Page) **/
router.get('/getAppJobQueue/:device_id', deviceController.getAppJobQueueOfDevice);
// resync device
router.patch('/sync-device', deviceController.resyncDevice);

/** Get Device Details of Dealers (Connect Page) **/
router.get('/get_apps/:device_id', deviceController.getAppsOfDevice);

router.put('/deleteUnlinkDevice', deviceController.deleteUnlinkDevice);

// ====================== Users ==================== //

/*** Add User ***/
router.post('/add/user', userController.addUser);

/*** Edit User ***/
router.post('/edit/user', userController.editUser);
/*** DELETE User ***/
router.put('/delete_user/:user_id', userController.deleteUser);

/***UNDO DELETE User ***/
router.put('/undo_delete_user/:user_id', userController.undoDeleteUser);


/**UPDATE Profile details  **/
router.put('/updateProfile/:id', userController.updateProfile);


/** Reset password dealers (Admin Panel) **/
router.post('/resetpwd', dealerController.resetPwd);

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

/** Get Dropdown Selected Items **/
router.get('/dealer/gtdropdown/:dropdownType', dealerController.getDropdownSelectedItems);

router.post('/dealer/dropdown', dealerController.dropDown);

router.get('/dealer/getPagination/:dropdownType', dealerController.getPagination);

router.post('/dealer/postPagination', dealerController.postPagination);

/** Dealer and S Dealer Info **/
router.get('/getinfo', dealerController.getInfo);

/** Get logged in Dealer permitted apps  **/
router.get('/get_dealer_apps', dealerController.getLoggedDealerApps);

router.get('/get_usr_acc_id/:device_id', async function (req, res) {
    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
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


router.get('/get_app_permissions', appController.getAppPermissions);



// =========== Policy ============= //

// policy name should be unique

router.get('/get_policies', policyController.getPolicies);


router.post('/change_policy_status', policyController.changePolicyStatus);

router.post('/save_policy_changes', policyController.savePolicyChanges);

router.post('/check_policy_name', policyController.checkPolicyName);


router.post('/save_policy', policyController.savePolicy);

router.post('/apply_policy/:device_id', policyController.applyPolicy);


router.post('/save/profile', accountController.saveProfile);


router.post('/apply_settings/:device_id', deviceController.applySettings);

router.post('/apply_pushapps/:device_id', deviceController.applyPushApps);

router.post('/apply_pullapps/:device_id', deviceController.applyPullApps);

router.post('/get_profiles', accountController.getProfiles);

router.post('/get_device_history', deviceController.getDeviceHistory);

router.post('/save_new_data', accountController.saveNewData);

// import sims
router.post('/import/:fieldName', accountController.importIDs);

router.get('/export/:fieldName', accountController.exportIDs);

router.get('/get_sim_ids', accountController.getSimIDs);


router.get('/get_all_sim_ids', accountController.getAllSimIDs);

router.get('/get_used_sim_ids', accountController.getUsedSimIDs);


router.get('/get_chat_ids', accountController.getChatIDs);


router.get('/get_all_chat_ids', accountController.getAllChatIDs);

router.get('/get_used_chat_ids', accountController.getUsedChatIDs);

router.get('/get_pgp_emails', accountController.getPGPEmails);

router.get('/get_all_pgp_emails', accountController.getAllPGPEmails);

router.get('/get_used_pgp_emails', accountController.getUsedPGPEmails);

router.get('/get_used_sim_ids', accountController.getUsedSimIDs);

router.post('/releaseCSV/:fieldName', accountController.releaseCSV);


/** Get Apk List Admin Panel **/

router.get('/apklist', apkController.apkList);


// upload test apk
router.post('/upload', apkController.upload);



// add apk. endpoints name should be changed
router.post('/checkApkName', async function (req, res) {
    var verify = req.decoded;
    
    // if (verify['status'] && verify.status == true) {
        if (verify) {
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

// add apk. endpoints name should be changed
router.post('/addApk', async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = req.decoded;
    
    // if (verify['status'] && verify.status == true) {
        if (verify) {
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
                            msg: await helpers.convertToLang(req.translation[MsgConstants.APK_IS_UPLOADED], "Apk is uploaded"), // "Apk is uploaded",
                            data: dta
                        };
                        res.send(data);
                        return;
                    });

                } else {
                    console.log("file not found");
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error While Uploading"), // "Error While Uploading"
                    }
                    res.send(data)
                    return;
                }

            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error While Uploading"), // "Error While Uploading"
                };
                res.send(data);
                return;
            }
        } catch (error) {
            console.log(error);
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error While Uploading"), // "Error while Uploading",
            };
            return;
        }

    }
});

/** Edit Apk (Admin panel) **/
router.post('/edit/apk', async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = req.decoded;
    
    // if (verify['status'] && verify.status == true) {
        if (verify) {
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

                    sql.query("update apk_details set app_name = '" + apk_name + "', logo = '" + logo + "', apk = '" + apk + "', version_code = '" + versionCode + "', version_name = '" + versionName + "', package_name='" + packageName + "', details='" + details + "', apk_bytes='" + apk_stats.size + "',  apk_size='" + formatByte + "'  where id = '" + req.body.apk_id + "'", async function (err, rslts) {

                        if (err) {
                            console.log(err)
                        };
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], "Record Updated"), // "Record Updated"

                        };
                        res.send(data);
                        return;
                    });


                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error While Uploading"), // "Error While Uploading"
                    };
                    res.send(data);
                    return;
                }

            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error While Uploading"), // "Error While Uploading"
                };
                res.send(data);
                return;
            }
        } catch (error) {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error While Uploading"), // "Error while Uploading",
            };
            res.send(data);
            return;
        }
    }

});

/**Delete Apk**/
router.post('/apk/delete', async function (req, res) {

    var verify = req.decoded;
    
    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        if (!empty(req.body.apk_id)) {

            sql.query("update `apk_details` set delete_status='1' WHERE id='" + req.body.apk_id + "'", async function (error, results) {
                console.log(results);

                if (error) {
                    console.log(error);
                }
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.APK_NOT_DELETED], "Apk not deleted"), // Apk not deleted.",
                        "rdlt": results
                    };
                } else {
                    let deletedRecord = "SELECT * FROM apk_details where id=" + req.body.apk_id + " and delete_status='1'";
                    let result = await sql.query(deletedRecord);
                    if (result.length) {

                        data = {
                            "status": true,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.APK_DELETED_SUCCESSFULLY], "Apk deleted successfully"), // Apk deleted successfully.",
                            "apk": result[0]
                        };
                    } else {
                        data = {
                            "status": false,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.APK_NOT_DELETED], "Apk not deleted"), // Apk not deleted.",
                            "rdlt": results
                        };
                    }

                }
                res.send(data);
            });
        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some error occurred"), // Some error occurred."

            }
            res.send(data);
        }

    }
});

/** Toggle Apk Admin Panel (On / Off) **/
router.post('/toggle', apkController.toggle);

/** Save apk Permissions**/
router.post('/save_apk_permissions', apkController.saveApkPermission);


// Purchase credits_CASH
router.post('/purchase_credits', accountController.purchaseCredits);

// Purchase credits form Credit card
router.post('/purchase_credits_CC', accountController.purchaseCredits_CC);


/** Save Policy Permission **/
router.post('/save_policy_permissions', apkController.savePolicyPermissions);


//GET logion history
router.get('/login_history', async function (req, res) {
    try {
        var verify = req.decoded;
        
        // if (verify.status !== undefined && verify.status == true) {
            if (verify) {

            let id = verify.user.id;
            let data = {}
            let query = "SELECT * from login_history where dealer_id = '" + id + "' AND type = 'token' order by created_at desc"
            // console.log(query);
            sql.query(query, async function (err, result) {
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



router.delete('/delete_profile/:profile_id', userController.checkProfile);

// check prviouse password
router.post('/check_pass', userController.checkPrevPass);

// Get Imei history
router.get('/get_imei_history/:device_id', deviceController.getIMEI_History);

/*Get All users */
router.get('/userList', userController.getAllUsers);

/*Transfer Apps to secure market */
router.post('/transferApps', appController.trasnferApps);

/** Get Market app List **/

router.get('/marketApplist', appController.marketApplist);


// Change unistall app restriction for Secure market apps 
router.put('/handleUninstall/:apk_id', apkController.handleUninstallApk);

// Write IMEI on device
router.post('/writeImei/:device_id', deviceController.writeIMEI);

// get activities 
router.get('/get_activities/:device_id', deviceController.getActivities);

// set default for w.r.t dealer
router.post('/set_default_policy', policyController.setDefaultPolicy);

router.put('/force_update', async function (req, res) {
    var verify = req.decoded;
    
    // if (verify['status'] !== undefined && verify.status === true) {
        if (verify) {
        let device_id = req.body.device_id;
        let dealer_id = verify.user.id
        if (!empty(device_id)) {
            let deviceQ = "SELECT * FROM devices WHERE device_id='" + device_id + "'";
            let device = await sql.query(deviceQ);
            if (device.length) {
                if (device[0].online === Constants.DEVICE_ONLINE) {
                    // require('../bin/www').forceCheckUpdate(device[0].device_id);
                    require("../bin/www").forceCheckUpdate(device[0].device_id);
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.FORCE_UPDATE_HAS_BEEN_APPLIED], "force update has been applied"), // "force update has been applied"
                    }
                    res.send(data)
                } else {
                    let usr_acc = await device_helpers.getUserAccByDeviceId(device_id);
                    let historyQ = "INSERT INTO device_history (device_id, dealer_id, user_acc_id, type) VALUES ('" + device_id + "', " + dealer_id + ", " + usr_acc.id + ", '" + Constants.DEVICE_HISTORY_FORCE_UPDATE + "')";
                    sql.query(historyQ, async function (error, resp) {
                        if (error) {
                            console.log(error);
                        };
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.FORCE_UPDATE_WILL_APPLY], "force update will apply when device will come online"), // "force update will apply when device will come online"
                        }
                        res.send(data)
                    });
                }
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FOUND], "Device not Found"), // "Device not Found"
                }
                res.send(data)
            }
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FOUND], "Device not Found"), // "Device not Found"
            }
            res.send(data)
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
    var verify = req.decoded;
    
    if (verify) {
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
router.patch('/save-prices', billingController.savePrices);


router.post('/save-package', billingController.savePackage);


router.get('/get-language', languageController.getLanguage);


router.patch('/save-language', languageController.saveLanguage);



router.get('/get-prices/:dealer_id', billingController.getPrices)

router.get('/get-packages/:dealer_id', billingController.getPackages);

router.patch('/check-package-name', billingController.checkPackageName);

router.post('/update_credit', billingController.updateCredit);

router.get('/newRequests', billingController.newRequests);

router.get('/get_user_credits', billingController.getUserCredits);


router.put('/delete_request/:id', billingController.deleteRequest);

router.put('/accept_request/:id', billingController.acceptRequest);

/*** Create Backup ***/
router.post('/create_backup_DB', backupController.createBackupDB);


router.get('/get_csv_ids', async (req, res) => {
    var verify = req.decoded;
    if (verify) {
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
        });
        return;
    } else {
        res.send({
            status: false,
        })
        return;
    }
});


module.exports = router;
