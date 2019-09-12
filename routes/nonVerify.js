// Libraries
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var CryptoJS = require("crypto-js");

// Custom Libraries
const { sql } = require('../config/database');

// Controllers
var backupController = require('../app/controllers/backup')
var languageController = require('../app/controllers/language')

// Model
var Policy = require('../app/models/Policy');

// Helpers and Constants
const helpers = require('../helper/general_helper');
const MsgConstants = require('../constants/MsgConstants');


/**
 * This function comment is parsed by doctrine
 * @route GET /users/
 * @group No Auth - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

/* GET users listing. */
router.get('/', async function (req, res, next) {

    // let policies = await Policy.findAll();
    // // console.log(policies)
    // let policyApps = await policies.getPolicyApps();
    // res.send(policyApps);

    return res.send("test");
    // let data = {
    //     key: 'value'
    // }
    // var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123');
    // console.log(ciphertext.toString());

    // // Decrypt
    // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 13');
    // var plaintext = bytes.toString(CryptoJS.enc.Utf8);

    // console.log(plaintext);

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

router.get('/refactor_policy_apps', async function (req, res) {
    let policies = await sql.query('SELECT * FROM policy');
    policies.forEach(async (policy) => {
        let pushApps = JSON.parse(policy.push_apps);
        console.log("pushApps: ", pushApps)
        if (pushApps.length) {
            pushApps.forEach(async (app) => {
                let insertRelQ = `INSERT IGNORE INTO policy_apps (policy_id, apk_id, guest, encrypted, enable) VALUES (${policy.id}, ${app.apk_id}, ${app.guest}, ${app.encrypted}, ${app.enable})`;
                await sql.query(insertRelQ);
            })
        }
    });

    res.send('test');
})

router.get('/refactor_policy_sys_permissions', async function (req, res) {

    let permissions = {
        "wifi_status": "Wifi",
        "bluetooth_status": "Bluetooth",
        "hotspot_status": "Hotspot Configuration",
        "screenshot_status": "Screen Capture",
        "call_status": 'Block Calls',
        'bluetooth_sharing_status': 'Bluetooth File Sharing',
        "camera_status": "Camera",
        "speaker_status": 'Speaker',
        "mic_status": "Microphone",
        // "location_status"
        // "nfc_status"
    }

    // refactoring previous policies
    let policies = await sql.query('SELECt * FROM policy');
    policies.forEach(async (policy) => {
        if (policy.controls) {
            let sysPermissions = JSON.parse(policy.controls);

            if (sysPermissions instanceof Array) {
                console.log("new policy");

                sysPermissions.forEach((permission) => {
                    if (permissions[permission.setting_name]) {
                        permission.setting_name = permissions[permission.setting_name]
                    }
                })

                policyUpdateQ = `UPDATE policy SET controls='${JSON.stringify(sysPermissions)}' WHERE id=${policy.id}`;
                await sql.query(policyUpdateQ);

            } else {
                console.log("old policy");
                let data = []
                for (var obj in sysPermissions) {
                    if (permissions[obj]) {
                        data.push({
                            setting_name: permissions[obj],
                            setting_status: sysPermissions[obj]
                        });
                    } else {
                        data.push({
                            setting_name: obj,
                            setting_status: sysPermissions[obj]
                        });
                    }
                }
                
                policyUpdateQ = `UPDATE policy SET controls='${JSON.stringify(data)}' WHERE id=${policy.id}`;
                await sql.query(policyUpdateQ);
            }
        }

    });

    // refactoring previous histories

    let histories = await sql.query('SELECt * FROM device_history');
    histories.forEach(async (history) => {
        if (history.controls) {

            let sysPermissions = JSON.parse(history.controls);
            

            if (sysPermissions instanceof Array) {
                console.log('new history');
                sysPermissions.forEach((permission) => {
                    if (permissions[permission.setting_name]) {
                        permission.setting_name = permissions[permission.setting_name]
                    }
                })
                historyUpdateQ = `UPDATE device_history SET controls='${JSON.stringify(sysPermissions)}' WHERE id=${history.id}`;
                await sql.query(historyUpdateQ);

            } else {
                console.log('old history')
                let data = []
                for (var obj in sysPermissions) {
                    if (permissions[obj]) {
                        data.push({
                            setting_name: permissions[obj],
                            setting_status: sysPermissions[obj]
                        });
                    } else {
                        data.push({
                            setting_name: obj,
                            setting_status: sysPermissions[obj]
                        });
                    }

                }
                historyUpdateQ = `UPDATE device_history SET controls='${JSON.stringify(data)}' WHERE id=${history.id}`;
                await sql.query(historyUpdateQ);
            }
        }
    });

    // refactoring previous profiles
    let profiles = await sql.query('SELECt * FROM usr_acc_profile');
    profiles.forEach(async (profile) => {
        if(profile.controls){

            let sysPermissions = JSON.parse(profile.controls);

            if (sysPermissions instanceof Array) {
                console.log("new profile");
                sysPermissions.forEach((permission) => {
                    if (permissions[permission.setting_name]) {
                        permission.setting_name = permissions[permission.setting_name]
                    }
                })
                profileUpdateQ = `UPDATE usr_acc_profile SET controls='${JSON.stringify(sysPermissions)}' WHERE id=${profile.id}`;
                await sql.query(profileUpdateQ);

            } else {
                console.log('old profile')
                let data = []
                for (var obj in sysPermissions) {
                    if (permissions[obj]) {
                        data.push({
                            setting_name: permissions[obj],
                            setting_status: sysPermissions[obj]
                        });
                    } else {
                        data.push({
                            setting_name: obj,
                            setting_status: sysPermissions[obj]
                        });
                    }
                }
                profileUpdateQ = `UPDATE usr_acc_profile SET controls='${JSON.stringify(data)}' WHERE id=${profile.id}`;
                await sql.query(profileUpdateQ);
            }
        }
    });

    // refactoring user_app_permissions
    let user_app_permissions = await sql.query('SELECt * FROM user_app_permissions');
    
    user_app_permissions.forEach(async (user_app_permission) => {
        
        if(user_app_permission.permissions && user_app_permission.permissions!=='null'){
           
            let sysPermissions = JSON.parse(user_app_permission.permissions);

            if (sysPermissions instanceof Array) {
                console.log("new permissions");
                sysPermissions.forEach((permission) => {
                    if (permissions[permission.setting_name]) {
                        permission.setting_name = permissions[permission.setting_name]
                    }
                })
                profileUpdateQ = `UPDATE user_app_permissions SET permissions='${JSON.stringify(sysPermissions)}' WHERE id=${user_app_permission.id}`;
                await sql.query(profileUpdateQ);

            } else {
                console.log('old permissions')
                let data = []
                for (var obj in sysPermissions) {
                    console.log('this is :', obj);

                    if (permissions[obj]) {
                        data.push({
                            setting_name: permissions[obj],
                            setting_status: sysPermissions[obj]
                        });
                    } else {
                        data.push({
                            setting_name: obj,
                            setting_status: sysPermissions[obj]
                        });
                    }
                }
                profileUpdateQ = `UPDATE user_app_permissions SET permissions='${JSON.stringify(data)}' WHERE id=${user_app_permission.id}`;
                await sql.query(profileUpdateQ);
            }
        }
    });

    res.send("refactor policies system permissions");
})
/** Get back up DB File **/
router.get("/getBackupFile/:file", backupController.getBackupFiles);

/** Get image logo **/
router.get("/getFile/:file", async function (req, res) {
    // let verify = await verifyToken(req, res);
    // if (verify.status) {
    if (fs.existsSync(path.join(__dirname, "../uploads/" + req.params.file))) {
        let file = path.join(__dirname, "../uploads/" + req.params.file);
        let fileMimeType = mime.getType(file);
        let filetypes = /jpeg|jpg|apk|png/;
        // Do something
        // if (filetypes.test(fileMimeType)) {
        // res.set('Content-Type', fileMimeType); // mimeType eg. 'image/bmp'
        res.sendFile(path.join(__dirname, "../uploads/" + req.params.file));
        // } else {
        //     res.send({
        //         "status": false,
        //         "msg": await helpers.convertToLang(req.translation[MsgConstants.DEALER_ACTIV_SUCC], MsgConstants.DEALER_ACTIV_SUCC), // file not found"
        //     })
        // }
    } else {
        data = {
            "status": false,
            "msg": "file not found", //  await helpers.convertToLang(req.translation[MsgConstants.FILE_NOT_FOUND], MsgConstants.FILE_NOT_FOUND),
        }
        res.send(data)
    }
    // }

});

router.get('/languages', languageController.languages)

module.exports = router;
