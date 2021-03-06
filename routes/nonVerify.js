// Libraries
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var pdf = require('html-pdf');
var CryptoJS = require("crypto-js");
var moment = require("moment")
// const { check, validationResult } = require('express-validator');
// Custom Libraries
const { sql } = require('../config/database');

// Controllers
var backupController = require('../app/controllers/backup')
var languageController = require('../app/controllers/language')
const reportingController = require('../app/controllers/reports');

// Models
// var Policy = require('../app/models/Policy');

// Helpers and Constants
const helpers = require('../helper/general_helper');
// const MsgConstants = require('../constants/MsgConstants');
const constants = require('../constants/Application');
// const { sendEmail } = require("../lib/email");


/**
 * This function comment is parsed by doctrine
 * @route GET /users/
 * @group No Auth - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

/* GET users listing. */
router.get('/', async function (req, res, next) {

    // let html = `<div class="ant-modal-content"><div class="ant-modal-body" style="overflow: overlay;"><div><h1 style="text-align: center;">MDM PANEL SERVICES</h1><h4 style="text-align: center;">FLAT/RM H 15/F  SIU KING BLDG 6 ON WAH ST <br> NGAU TAU KOK KLN, HONG KONG</h4><h2>INVOICE</h2><div style="border-top: 2px solid lightgray; border-bottom: 2px solid lightgray; padding-top: 10px; padding-bottom: 10px;"><div class="ant-row"><div class="ant-col-6">Invoice Number:</div><div class="ant-col-6">PI000334</div><div class="ant-col-6">Dealer Name:</div><div class="ant-col-6">HAMZA DAWOOD </div></div><div class="ant-row"><div class="ant-col-6">Invoice Date:</div><div class="ant-col-6">2020/02/19 </div><div class="ant-col-6">Dealer PIN:</div><div class="ant-col-6">541663</div></div><div class="ant-row"><div class="ant-col-6">Balance Due:</div><div class="ant-col-6">200 Credits</div><div class="ant-col-6">SIM ID:</div><div class="ant-col-6">8901260852296619158</div></div></div><div style="margin-top: 20px;"><h4>SIM SERVICES</h4><div class="ant-table-wrapper"><div class="ant-spin-nested-loading"><div class="ant-spin-container"><div class="ant-table ant-table-middle ant-table-scroll-position-left"><div class="ant-table-content"><div class="ant-table-body"><table class=""><colgroup><col><col><col><col><col><col><col></colgroup><thead class="ant-table-thead"><tr><th class="row ant-table-align-center" style="text-align: center;"><div>#</div></th><th class="ant-table-align-center" style="text-align: center;"><div>ITEM</div></th><th class="ant-table-align-center" style="text-align: center;"><div>DESCRPTION</div></th><th class="ant-table-align-center" style="text-align: center;"><div>SERVICE TERM</div></th><th class="ant-table-align-center" style="text-align: center;"><div>UNIT PRICE (CREDITS)</div></th><th class="ant-table-align-center" style="text-align: center;"><div>QUANTITY</div></th><th class="ant-table-align-center" style="text-align: center;"><div>TOTAL</div></th></tr></thead><tbody class="ant-table-tbody"><tr class="ant-table-row ant-table-row-level-0" data-row-key="0"><td class="row" style="text-align: center;"><span class="ant-table-row-indent indent-level-0" style="padding-left: 0px;"></span>1</td><td class="" style="text-align: center;">STAND ALONE SIM</td><td class="" style="text-align: center;">test</td><td class="" style="text-align: center;">1 month</td><td class="" style="text-align: center;">100</td><td class="" style="text-align: center;">1</td><td class="" style="text-align: center;">100</td></tr><tr class="ant-table-row ant-table-row-level-0" data-row-key="1"><td class="row" style="text-align: center;"><span class="ant-table-row-indent indent-level-0" style="padding-left: 0px;"></span>2</td><td class="" style="text-align: center;">Data plan</td><td class="" style="text-align: center;">3GB from LM</td><td class="" style="text-align: center;">1 month</td><td class="" style="text-align: center;">100</td><td class="" style="text-align: center;">1</td><td class="" style="text-align: center;">100</td></tr></tbody></table></div></div></div></div></div></div></div><div style="margin-top: 20px; text-align: right;"><div class="ant-row"><div class="ant-col-16"></div><div class="ant-col-4">Subtotal : </div><div class="ant-col-4">200 Credits</div></div><br><div class="ant-row" style="font-weight: bold;"><div class="ant-col-12"></div><div class="ant-col-8">Total : </div><div class="ant-col-4">200&nbsp;Credits</div></div><div class="ant-row" style="font-weight: bold;"><div class="ant-col-14"></div><div class="ant-col-6">Equivalent USD Price: </div><div class="ant-col-4">$200.00</div></div></div><p style="text-align: center; margin-top: 70px;">Thank you for your business.</p></div></div></div>`
    // let fileName = "invoice-html-pdf.pdf"
    // let filePath = path.join(__dirname, "../uploads/" + fileName)
    // console.log(filePath);
    // pdf.create(html).toStream(function (err, stream) {
    //     stream.pipe(fs.createWriteStream(filePath));
    // });



    // console.log(req.app);


    // transactions
    // sql.getConnection((error, connection) => {
    //     if (error) {
    //         console.log(error)
    //     }
    //     connection.beginTransaction(async function (err) {
    //         if (err) {
    //             console.log(err)
    //         };
    //         let something = await connection.query("SELECT * FROM devices");
    //         console.log(something);
    //         connection.commit(function (err) {
    //             if (err) {
    //                 console.log(err)
    //             }
    //         })
    //     })
    // })
    return res.send('test')

    // helpers.updateSimStatus('8901260852293382529', 'deactivated')
    // let attachment = {
    //     fileName: "invoice-PI000045.pdf",
    //     file: path.join(__dirname, "../uploads/invoice-PI000045.pdf")
    // }
    // let html = 'Pre-activation device created successfully. Invoice is attached below. <br>';
    // sendEmail("Pre-Activation device creation.", html, 'hamza.dawood007@gmail.com', null, attachment)
    // let d = moment().format('YYYY-MM-DD H:m:s');
    // console.log("Date Time:", d)

    // let attachment = {
    //     fileName: "invoice-PI000045.pdf",
    //     file: path.join(__dirname, "../uploads/invoice-PI000045.pdf")
    // }
    // let html = 'Pre-activation device created successfully. Invoice is attached below. <br>';
    // sendEmail("Pre-Activation device creation.", html, 'hamza.dawood007@gmail.com', null, attachment)


    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.json({ errors: errors.array() });
    // }

    // return res.send("test");
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
    let policyAppsIds = await sql.query('SELECT * FROM policy_apps');
    let apk_ids = [];
    let policy_ids = [];
    policyAppsIds.map((app) => {
        apk_ids.push(app.apk_id)
        policy_ids.push(app.policy_id)
    })
    policies.forEach(async (policy) => {
        let pushApps = JSON.parse(policy.push_apps);
        if (pushApps.length) {
            pushApps.forEach(async (app) => {
                console.log(!policy_ids.includes(policy.id), !apk_ids.includes(app.apk_id));
                if (!policy_ids.includes(policy.id) || !apk_ids.includes(app.apk_id)) {
                    let insertRelQ = `INSERT INTO policy_apps (policy_id, apk_id, guest, encrypted, enable) VALUES (${policy.id}, ${app.apk_id}, ${app.guest}, ${app.encrypted}, ${app.enable})`;
                    await sql.query(insertRelQ);
                }
            })
        }
    });

    res.send('test');
})

router.get('/refactor_policy_apps_icon', async function (req, res) {
    let policyDefaultAppsQ = '';
});

router.get('/update_parent_dealer_data_into_user_acc', async function (req, res) {
    let data = {};

    sql.query(`SELECT * FROM  dealers`, async function (error, result) {

        if (error) {
            data = {
                status: false,
                msg: "Query error"
            }
            res.send(data);
            return;
        }

        if (result && result.length) {
            for (let i = 0; i < result.length; i++) {

                let parentDealerId = null;
                let parentDealerName = '';

                if (result[i].connected_dealer && result[i].type === 3) { // type 3 represent only to sdealer
                    parentDealerId = result[i].connected_dealer;

                    console.log("Sdealer found :: ===>  Dealer id: ", result[i].dealer_id, "  Parent dealer id: ", parentDealerId);

                    // get parent dealer name
                    let getParentDealerName = await sql.query(`SELECT dealer_name FROM dealers WHERE dealer_id = ${parentDealerId};`);
                    if (getParentDealerName && getParentDealerName.length) {
                        parentDealerName = getParentDealerName[0].dealer_name;
                    }
                }

                // Update parent dealer data into usr_acc table
                let updateUserAcc = `UPDATE usr_acc SET prnt_dlr_id = ${parentDealerId}, prnt_dlr_name = '${parentDealerName}' WHERE dealer_id = ${result[i].dealer_id};`;
                let updateResults = await sql.query(updateUserAcc);

                if (updateResults && updateResults.affectedRows) {
                    console.log(` usr_acc table record Update successfully Dealer ID is: ${result[i].dealer_id}`);
                }

                // Update parent dealer data into acc_action_history table
                let updateAccActionHistoy = `UPDATE acc_action_history SET prnt_dlr_id = ${parentDealerId}, prnt_dlr_name = '${parentDealerName}' WHERE dealer_id = ${result[i].dealer_id};`;
                let accHistoryResults = await sql.query(updateAccActionHistoy);

                if (accHistoryResults && accHistoryResults.affectedRows) {
                    console.log(` acc_action_history table record Update successfully Dealer ID is: ${result[i].dealer_id}`);
                }


                // else {
                //     console.log(`Not found Parent dealer into usr_acc table of Dealer ID is: ${result[i].dealer_id}`);
                // }
            }

            data = {
                status: true,
                msg: `All parent dealer id and name Update successfully`
            }
            return res.send(data);
        } else {
            data = {
                status: false,
                msg: "Not found any dealer record"
            }
            res.send(data);
            return;
        }
    });

});

router.get('/update_device_columns', async function (req, res) {
    let data = {};

    sql.query(`UPDATE dealer_dropdown_list SET selected_items='${JSON.stringify(constants.deviceColumns)}' 
    WHERE type = "devices"`, async function (error, result) {

        if (error) {
            data = {
                status: false,
                msg: "Query error to update devices column dropdown"
            }
            res.send(data);
            return;
        }

        if (result && result.affectedRows) {
            data = {
                status: true,
                msg: "Devices Dropdown update successfully"
            }
            res.send(data);
            return;
        } else {
            data = {
                status: false,
                msg: "No affected any record"
            }
            res.send(data);
            return;
        }
    });

});

router.get('/update_dealer_columns', async function (req, res) {
    let data = {};

    sql.query(`UPDATE dealer_dropdown_list SET selected_items='${JSON.stringify(constants.dealerColumns)}' 
    WHERE type = "dealer"`, async function (error, result) {

        if (error) {
            data = {
                status: false,
                msg: "Query error to update dealer column dropdown"
            }
            res.send(data);
            return;
        }

        if (result && result.affectedRows) {
            data = {
                status: true,
                msg: "Dealer Dropdown update successfully"
            }
            res.send(data);
            return;
        } else {
            data = {
                status: false,
                msg: "No affected any record"
            }
            res.send(data);
            return;
        }
    });

});

router.get('/update_sdealer_columns', async function (req, res) {
    let data = {};

    sql.query(`UPDATE dealer_dropdown_list SET selected_items='${JSON.stringify(constants.sdealerColumns)}' 
    WHERE type = "sdealer"`, async function (error, result) {

        if (error) {
            data = {
                status: false,
                msg: "Query error to update sdealer column dropdown"
            }
            res.send(data);
            return;
        }

        if (result && result.affectedRows) {
            data = {
                status: true,
                msg: "S-Dealer Dropdown update successfully"
            }
            res.send(data);
            return;
        } else {
            data = {
                status: false,
                msg: "No affected any record"
            }
            res.send(data);
            return;
        }
    });

});

router.get('/update_apk_columns', async function (req, res) {
    let data = {};

    sql.query(`UPDATE dealer_dropdown_list SET selected_items='${JSON.stringify(constants.apkColumns)}' 
    WHERE type = "apk"`, async function (error, result) {

        if (error) {
            data = {
                status: false,
                msg: "Query error to update apk column dropdown"
            }
            res.send(data);
            return;
        }

        if (result && result.affectedRows) {
            data = {
                status: true,
                msg: "apk dropdown update successfully"
            }
            res.send(data);
            return;
        } else {
            data = {
                status: false,
                msg: "No affected any record"
            }
            res.send(data);
            return;
        }
    });

});

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
        if (profile.controls) {

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

        if (user_app_permission.permissions && user_app_permission.permissions !== 'null') {

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

router.get('/refactor_pending_histories', async function (req, res) {
    sql.query(`UPDATE device_history SET status='completed_successfully' WHERE status='pending'`, async function (error, result) {
        if (error) {
            console.log(error)
        }
        res.send("action completed")
    });
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


router.get("/getFileWithFolder/:folder/:file", async function (req, res) {
    // let verify = await verifyToken(req, res);
    // if (verify.status) {
    if (fs.existsSync(path.join(__dirname, "../uploads/" + req.params.folder + '/' + req.params.file))) {
        let file = path.join(__dirname, "../uploads/" + req.params.folder + '/' + req.params.file);
        let fileMimeType = mime.getType(file);
        let filetypes = /jpeg|jpg|apk|png/;
        // Do something
        // if (filetypes.test(fileMimeType)) {
        // res.set('Content-Type', fileMimeType); // mimeType eg. 'image/bmp'
        res.sendFile(path.join(__dirname, "../uploads/" + req.params.folder + '/' + req.params.file));
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

// router.get('/languages', languageController.getAll_Languages)


router.get('/create_domains', async function (req, res) {
    let domains = [];

    // get existing domains
    let all_domains = await sql.query("SELECT name from domains")
    // console.log("BEFOR: all_domains ", all_domains);

    if (all_domains.length) {
        all_domains.map((item) => {
            domains.push(item.name)
        })
    }

    // get existing pgp emails
    let all_pgp_emails = await sql.query("SELECT id, pgp_email from pgp_emails")

    // add new domains
    let checkDuplicateDomains = [];
    for (let row of all_pgp_emails) {
        let domainName = row.pgp_email.split('@').pop().trim();
        if (!domains.includes(domainName) && !checkDuplicateDomains.includes(domainName)) {
            if (domainName) {
                checkDuplicateDomains.push(domainName);
                let insertQ = `INSERT INTO domains (name) value ('${domainName}')`;
                await sql.query(insertQ);
            }
        }
    }

    // get latest domains
    all_domains = await sql.query("SELECT * FROM domains");
    // console.log("AFTER: all_domains ", all_domains);

    // add domain_id into pgp_emails
    for (let row of all_pgp_emails) {
        // console.log("row ", row);

        if (row.pgp_email) {
            let indexDomain = all_domains.findIndex((dm) => dm.name === row.pgp_email.split('@').pop().trim());
            // console.log("indexDomain ", indexDomain);
            let domain_id = (indexDomain > -1) ? all_domains[indexDomain].id : null;

            let insertQ = `UPDATE pgp_emails SET domain_id=${domain_id} WHERE id=${row.id};`;
            // console.log("update pgp_emails domains ids: insertQ ", insertQ);
            await sql.query(insertQ);
        }
    }

    return res.send({ status: true });
});

// router.get('/create_lng_file', async function (req, res) {
//     sql.query("SELECT * FROM languages", async function (err, data) {
//         if (data.length) {
//             // console.log(data);
//             if (!fs.existsSync(path.join(__dirname, "../languages"))) {
//                 fs.mkdirSync(path.join(__dirname, "../languages"));
//             }
//             for (var i = 0; i < data.length; i++) {
//                 let language_data = await sql.query("SELECT key_id,key_value FROM lng_translations WHERE lng_id = " + data[i].id)
//                 if (language_data.length) {
//                     let lan_obj = {}
//                     language_data.forEach((elem) => {
//                         let key_id = elem.key_id;
//                         lan_obj[key_id] = elem.key_value
//                     })
//                     let jsonData = JSON.stringify(lan_obj)
//                     fileName = data[i].locale + ".json"
//                     let target_path = path.join(__dirname, "../languages/" + fileName);
//                     fs.writeFile(target_path, jsonData, 'utf8', function (err, res) {
//                         if (err) {
//                             console.log(err);
//                         }
//                     });
//                 }
//             }

//             res.send("FILE CREATED")
//         }
//     })
// })


router.get('/update_apk_labels', async function (req, res) {
    sql.query("SELECT * FROM apk_details WHERE label is NULL", async function (err, data) {
        if (data.length) {
            data.map(async (item) => {
                let fileName = item.apk
                let file = path.join(__dirname, "../uploads/" + fileName);
                if (fs.existsSync(file)) {
                    let label = '';
                    label = await helpers.getAPKLabel(file);
                    if (!label) {
                        label = ''
                    }

                    label = label.replace(/(\r\n|\n|\r)/gm, "");

                    sql.query(`UPDATE apk_details SET label = '${label}' WHERE id = ${item.id}`);

                }
            })
            return res.send("LABELS ADDED SUCCESSFULLY");
        }
    })
})

router.get('/check_available_apps', async function (req, res) {
    sql.query("SELECT id, app_name, apk, label, package_name, version_code, version_name, apk_size FROM apk_details WHERE delete_status=0 ", async function (err, data) {
        if (err) {
            return res.send({
                msg: "query error",
                status: false,
            })
        }
        if (data.length) {
            let results = [];
            data.map(async (item) => {
                console.log(item);
                let fileName = item.apk
                let file = path.join(__dirname, "../uploads/" + fileName);
                if (fs.existsSync(file)) {
                    item.available = true
                } else {
                    item.available = false
                }
                results.push(item);
            })
            return res.send(results);
        }
    })
})

router.get('/check_apps_in_folder', async function (req, res) {
    fs.readdir(path.join(__dirname, '../uploads/'), {}, async function (err, files) {
        if (err) {
            return res.status(403).send('no files available');
        }
        let apkFiles = [];
        if (files && files.length) {
            apks = files.filter(el => /\.apk$/.test(el))
            for (let i = 0; i < apks.length; i++) {
                let packageName = await helpers.getAPKPackageName(path.join(__dirname, '../uploads/' + apks[i]));
                apkFiles.push({ file: apks[i], packageName });
            }
        }
        return res.send(apkFiles);
    });
})

router.get('/update_dealer_ids_product_tables', async function (req, res) {
    let current_date = moment().format("YYYY-MM-DD HH:mm:ss")
    let usedChatids = "SELECT * FROM chat_ids WHERE used = 1 AND user_acc_id IS NOT NULL"
    let chat_ids_data = await sql.query(usedChatids)
    if (chat_ids_data.length) {
        for (let i = 0; i < chat_ids_data.length; i++) {
            let result = await sql.query("SELECT dealer_id FROM usr_acc WHERE id = " + chat_ids_data[i].user_acc_id)
            if (result && result.length) {
                await sql.query("UPDATE chat_ids SET dealer_id = " + result[0].dealer_id + " , start_date ='" + current_date + "' WHERE id=" + chat_ids_data[i].id)
            }
        }
    }

    let usedPgpEmails = "SELECT * FROM pgp_emails WHERE used = 1 AND user_acc_id IS NOT NULL"
    let pgp_emails_data = await sql.query(usedPgpEmails)
    if (pgp_emails_data.length) {
        for (let i = 0; i < pgp_emails_data.length; i++) {
            let result = await sql.query("SELECT dealer_id FROM usr_acc WHERE id = " + pgp_emails_data[i].user_acc_id)
            if (result && result.length) {
                await sql.query("UPDATE pgp_emails SET dealer_id = " + result[0].dealer_id + " , start_date ='" + current_date + "' WHERE id=" + pgp_emails_data[i].id)
            }
        }
    }

    let usedSimIds = "SELECT * FROM sim_ids WHERE used = 1 AND user_acc_id IS NOT NULL"
    let sim_ids_data = await sql.query(usedSimIds)
    if (sim_ids_data.length) {
        for (let i = 0; i < sim_ids_data.length; i++) {
            let result = await sql.query("SELECT dealer_id FROM usr_acc WHERE id = " + sim_ids_data[i].user_acc_id)
            if (result && result.length) {
                await sql.query("UPDATE sim_ids SET dealer_id = " + result[0].dealer_id + " , start_date ='" + current_date + "' WHERE id=" + sim_ids_data[i].id)
            }
        }
    }
    res.send("UPDATED SUCCESSFULLY")
})

router.get('/add-existing-dealers-accounts', async function (req, res) {
    let query = "SELECT * FROM dealers"
    sql.query(query, function (err, result) {
        if (err) {
            console.log(err);
            return res.send("QUERY ERROR")
        }
        if (result && result.length) {
            result.map(async (item) => {
                let dealer_account = await sql.query(`SELECT * FROM financial_account_balance WHERE dealer_id = ${item.dealer_id}`)
                if (dealer_account.length == 0) {
                    sql.query("INSERT INTO financial_account_balance(dealer_id) VALUES(" + item.dealer_id + ")")
                }
            })
            return res.send("ACCOUNTS ADDED SUCCESSFULLY")
        }
    })
})


router.get('/create-services-for-existing-devices', async function (req, res) {
    let query = "SELECT user_acc_id FROM services_data"
    let package = [{ id: 0, pkg_features: { chat_id: false, sim_id: false, sim_id2: false, pgp_email: true, vpn: false }, pkg_price: 0, pkg_dealer_type: "admin", pkg_name: "temp", pkg_term: "1 month", retail_price: 0 }]
    sql.query(query, function (err, result) {
        if (err) {
            console.log(err);
            return res.send("QUERY ERROR")
        }
        let alreadyCreated = []
        if (result && result.length) {
            alreadyCreated = result.map(item => item.user_acc_id)
        }

        let where = ''
        if (alreadyCreated.length) {
            where = `AND id NOT IN (${alreadyCreated.join()})`
        }
        let devicesWithOutServices = `SELECT * FROM usr_acc WHERE unlink_status = 0 AND del_status = 0  ${where}`
        sql.query(devicesWithOutServices, function (err, devices) {
            if (err) {
                console.log(err);
                return res.send("QUERY ERROR")
            }
            if (devices && devices.length) {
                let user_acc_ids = devices.map(item => item.id)
                let pgp_email_query = `SELECT * FROM pgp_emails WHERE user_acc_id IN(${user_acc_ids.join()})`
                sql.query(pgp_email_query, function (err, pgpData) {
                    if (err) {
                        console.log(err);
                        return res.send("QUERY ERROR")
                    }
                    if (pgpData.length) {

                        pgpData.map(item => {
                            let device = devices.find(device => device.id == item.user_acc_id)
                            let insertServiceQ = `INSERT INTO services_data (user_acc_id , dealer_id , products, packages , total_credits, start_date, service_expiry_date , service_term , is_temp) VALUES (${item.user_acc_id},${device.dealer_id}, '[]','${JSON.stringify(package)}',0,'${device.start_date}',  '${device.expiry_date}' ,0 , 1 )`
                            sql.query(insertServiceQ, function (err, insertedData) {
                                if (err) {
                                    console.log(err);
                                } else if (insertedData && insertedData.insertId) {
                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id,product_value, type , start_date) VALUES(${item.user_acc_id} , ${insertedData.insertId} , ${item.id} , '${item.pgp_email}' , 'pgp_email' , '${device.start_date}')`
                                    sql.query(insertAccService)
                                }

                            })
                        })
                        return res.send("ACCOUNTS ADDED SUCCESSFULLY")
                    } else {
                        return res.send("Pgp emails not found to create services")
                    }
                })
            } else {
                return res.send("Devices not found to create services")
            }
        })



    })
})

router.post('/show-pdf-file', reportingController.showPdfFile);


module.exports = router;
