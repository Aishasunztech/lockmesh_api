const { sql } = require('../../config/database');
const multer = require('multer');
var path = require('path');
var fs = require("fs");
var empty = require('is-empty');
var mime = require('mime');
const moment = require('moment');


const Constants = require('../../constants/Application');
var MsgConstants = require('../../constants/MsgConstants');

const device_helpers = require('../../helper/device_helpers');
const helpers = require('../../helper/general_helper');


exports.apkList = async function (req, res) {
    var verify = req.decoded;
    var data = [];
    var obj = {};
    var obj1 = {};
    let selectQ = '';

    if (verify) {
        let loggedUserType = verify.user.user_type;

        if (loggedUserType === Constants.ADMIN) {
            selectQ = `SELECT * FROM apk_details WHERE delete_status=0 AND apk_type != 'permanent' ORDER BY id ASC`
        }
        else if (loggedUserType === Constants.DEALER) {
            selectQ = `SELECT apk_details.*, dealer_permissions.permission_id, dealer_permissions.dealer_id, dealer_permissions.permission_type FROM apk_details JOIN dealer_permissions ON (apk_details.id = dealer_permissions.permission_id) WHERE (dealer_permissions.dealer_id='${verify.user.id}' OR dealer_permissions.dealer_id = 0) AND apk_details.apk_type != 'permanent' AND apk_details.delete_status = 0 AND dealer_permissions.permission_type = 'apk';`;
        }
        else if (loggedUserType === Constants.AUTO_UPDATE_ADMIN) {
            selectQ = `SELECT * FROM apk_details WHERE delete_status=0 AND apk_type = 'permanent' ORDER BY id ASC`
        }
        else {
            return res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"),
                list: []
            });
        }

        console.log("selectQ of apk list:: ", selectQ);
        if (selectQ !== '') {
            sql.query(selectQ, async function (error, results) {
                if (error) {
                    console.log(error);
                    return res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
                        list: []
                    })
                }

                if (results && results.length > 0) {
                    let dealerCount = 0;
                    let sdealerList = [];

                    if (loggedUserType !== Constants.AUTO_UPDATE_ADMIN) {
                        if (loggedUserType === Constants.ADMIN) {
                            let adminRoleId = await helpers.getUserTypeIDByName(loggedUserType);
                            dealerCount = await helpers.dealerCount(adminRoleId);
                        }
                        else if (loggedUserType === Constants.DEALER) {
                            sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            dealerCount = sdealerList ? sdealerList.length : 0;
                        }
                    }
                    for (var i = 0; i < results.length; i++) {
                        let permissions = [];
                        let policies = [];
                        let permissionC = 0;

                        if (loggedUserType !== Constants.AUTO_UPDATE_ADMIN) {
                            policies = await sql.query(`SELECT * FROM policy LEFT JOIN policy_apps on (policy.id = policy_apps.policy_id) WHERE policy_apps.apk_id=${results[i].id} AND policy.delete_status=0`)
                            permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');

                            if (loggedUserType === Constants.DEALER) {
                                permissions = permissions.filter(function (item) {
                                    for (let i = 0; i < sdealerList.length; i++) {
                                        if (item === sdealerList[i].dealer_id) {
                                            return item
                                        }
                                    }
                                })
                            }

                            let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                            permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        }
                        obj = {
                            apk_id: results[i].id,
                            apk_name: results[i].app_name,
                            logo: results[i].logo,
                            apk: results[i].apk,
                            permissions: permissions,
                            apk_status: results[i].status,
                            permission_count: permissionC,
                            label: results[i].label,
                            package_name: results[i].package_name,
                            policies: policies,
                            version: results[i].version_name,
                            updated_at: results[i].modified,
                            created_at: results[i].created,
                        }

                        if (loggedUserType === Constants.ADMIN) {
                            obj1 = {
                                size: results[i].apk_size,
                                deleteable: (results[i].apk_type == "permanent") ? false : true,
                            }
                            obj = { ...obj, ...obj1 };
                        }
                        data.push(obj);
                    }

                    return res.send({
                        status: true,
                        success: true,
                        list: data
                    });

                } else {
                    return res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
                        list: []
                    });
                }
            });
        } else {
            return res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[""], "Processing Failed"),
                list: []
            });
        }
    }
}

// exports.apkList = async function (req, res) {
//     var verify = req.decoded;
//     var data = [];

//     if (verify) {
//         if (verify.user.user_type === Constants.ADMIN) {
//             sql.query("select * from apk_details where delete_status=0 AND apk_type != 'permanent' order by id ASC", async function (error, results) {
//                 if (error) {
//                     console.log(error);
//                 }

//                 if (results.length > 0) {

//                     let adminRoleId = await helpers.getUserTypeIDByName(Constants.ADMIN);
//                     let dealerCount = await helpers.dealerCount(adminRoleId);
//                     // console.log("dealer count", dealerCount)
//                     for (var i = 0; i < results.length; i++) {
//                         let policies = await sql.query(`SELECT * FROM policy LEFT JOIN policy_apps on (policy.id = policy_apps.policy_id) WHERE policy_apps.apk_id=${results[i].id} AND policy.delete_status=0`)
//                         let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
//                         let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
//                         let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
//                         dta = {
//                             apk_id: results[i].id,
//                             apk_name: results[i].app_name,
//                             logo: results[i].logo,
//                             apk: results[i].apk,
//                             permissions: permissions,
//                             apk_status: results[i].status,
//                             size: results[i].apk_size,
//                             permission_count: permissionC,
//                             deleteable: (results[i].apk_type == "permanent") ? false : true,
//                             label: results[i].label,
//                             package_name: results[i].package_name,
//                             policies: policies,
//                             version: results[i].version_name,
//                             updated_at: results[i].modified,
//                             created_at: results[i].created,
//                         }
//                         data.push(dta);
//                     }

//                     return res.send({
//                         status: true,
//                         success: true,
//                         list: data
//                     });

//                 } else {
//                     data = {
//                         status: false,
//                         msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
//                         list: []
//                     }
//                     return res.send(data);
//                 }

//             });
//         } else if (verify.user.user_type === Constants.DEALER) {
//             // let selectQ = `SELECT dealer_apks.* ,apk_details.* FROM dealer_apks JOIN apk_details ON (apk_details.id = dealer_apks.apk_id) WHERE dealer_apks.dealer_id='${verify.user.id}' AND apk_details.apk_type != 'permanent' AND delete_status = 0`
//             let selectQ = `SELECT apk_details.*, dealer_permissions.permission_id, dealer_permissions.dealer_id, dealer_permissions.permission_type FROM apk_details JOIN dealer_permissions ON (apk_details.id = dealer_permissions.permission_id) WHERE dealer_permissions.dealer_id='${verify.user.id}' AND apk_details.apk_type != 'permanent' AND apk_details.delete_status = 0 AND dealer_permissions.permission_type = 'apk';`;

//             console.log("selectQ of apk list:: ", selectQ);
//             sql.query(selectQ, async function (error, results) {
//                 if (error) {
//                     console.log(error);
//                 }
//                 if (results && results.length > 0) {

//                     let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
//                     // console.log(sdealerList);
//                     let dealerCount = sdealerList ? sdealerList.length : 0;
//                     // console.log("dealer_count ", dealerCount);
//                     for (var i = 0; i < results.length; i++) {
//                         let policies = await sql.query(`SELECT * FROM policy LEFT JOIN policy_apps on (policy.id = policy_apps.policy_id) WHERE policy_apps.apk_id=${results[i].id} AND policy.delete_status=0`)
//                         let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
//                         let Sdealerpermissions = permissions.filter(function (item) {
//                             for (let i = 0; i < sdealerList.length; i++) {
//                                 if (item === sdealerList[i].dealer_id) {
//                                     return item
//                                 }
//                             }
//                         })
//                         // console.log(Sdealerpermissions);
//                         let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
//                         let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
//                         dta = {
//                             apk_id: results[i].id,
//                             apk_name: results[i].app_name,
//                             logo: results[i].logo,
//                             apk: results[i].apk,
//                             permissions: Sdealerpermissions,
//                             apk_status: results[i].status,
//                             permission_count: permissionC,
//                             label: results[i].label,
//                             package_name: results[i].package_name,
//                             policies: policies,
//                             version: results[i].version_name,
//                             updated_at: results[i].modified,
//                             created_at: results[i].created,
//                             // "deleteable": (results[i].apk_type == "permanent") ? false : true
//                         }
//                         data.push(dta);
//                     }

//                     return res.send({
//                         status: true,
//                         success: true,
//                         list: data
//                     });

//                 } else {
//                     data = {
//                         status: false,
//                         msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
//                         list: []
//                     }
//                     return res.send(data);
//                 }
//             });
//         } else if (verify.user.user_type === Constants.AUTO_UPDATE_ADMIN) {
//             sql.query("select * from apk_details where delete_status=0 AND apk_type = 'permanent' order by id ASC", async function (error, results) {
//                 if (error) {
//                     console.log(error);
//                 }
//                 if (results.length > 0) {
//                     // console.log("dealer_count ", dealerCount);
//                     for (var i = 0; i < results.length; i++) {
//                         // dta = {
//                         //     apk_id: results[i].id,
//                         //     apk_name: results[i].app_name,
//                         //     logo: results[i].logo,
//                         //     apk: results[i].apk,
//                         //     permissions: [],
//                         //     apk_status: results[i].status,
//                         //     permission_count: 0,
//                         //     // "deleteable": (results[i].apk_type == "permanent") ? false : true
//                         // }

//                         dta = {
//                             apk_id: results[i].id,
//                             apk_name: results[i].app_name,
//                             logo: results[i].logo,
//                             apk: results[i].apk,
//                             permissions: [],
//                             apk_status: results[i].status,
//                             permission_count: 0,
//                             label: results[i].label,
//                             package_name: results[i].package_name,
//                             version: results[i].version_name,
//                             updated_at: results[i].modified,
//                             created_at: results[i].created,
//                             // "deleteable": (results[i].apk_type == "permanent") ? false : true
//                         }
//                         data.push(dta);
//                     }

//                     return res.json({
//                         status: true,
//                         success: true,
//                         list: data
//                     });

//                 } else {
//                     data = {
//                         status: false,
//                         msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
//                         list: []
//                     }
//                     return res.send(data);
//                 }
//             });
//         } else {
//             data = {
//                 status: false,
//                 msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
//                 list: []
//             }
//             return res.send(data);
//         }
//     }
// }

exports.checkApkName = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        try {

            let apkName = req.body.name;
            let apk_id = req.body.apk_id
            let query = '';

            if (!empty(apkName)) {
                if (apk_id == '') {
                    query = "SELECT * from apk_details where app_name = '" + apkName + "' AND delete_status != 1"
                } else {
                    query = "SELECT * from apk_details where app_name = '" + apkName + "' AND delete_status != 1 AND id != " + apk_id
                }

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
                return;
            } else {
                return res.send({
                    status: true
                })
            }
        } catch (error) {
            console.log(error);
        }

    }
}

exports.upload = async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = req.decoded;

    if (verify) {
        console.log("field name: ", req.query.fieldName);

        let fieldName = req.query.fieldName;
        let screen = req.query.screen;
        if (fieldName) {
            let fileName = "";
            let mimeType = "";
            let apk_id = req.headers["id"] ? Number(req.headers["id"]) : null;
            let featureApk = req.headers["featured"] ? req.headers["featured"] : null;
            let file = null;
            let formatByte = '';
            let filePath = null;
            let bytes = null;

            if (fieldName === Constants.LOGO) {
                file = req.files.logo;
            } else if (fieldName === Constants.APK) {
                file = req.files.apk;
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.UNAUTHORIZED_FILE_UPLOADING_ATTEMPT], "Error: Unauthorized file uploading attempt."), // "Error: Unauthorized file uploading attempt."
                }
                return res.send(data);
            }

            filePath = file.path;
            mimeType = file.type;
            bytes = file.size
            formatByte = helpers.formatBytes(bytes);
            console.log(file);

            if (fieldName === Constants.APK) {

                console.log(filePath);
                let versionCode = await helpers.getAPKVersionCode(filePath);
                console.log("version code: ", versionCode);

                if (versionCode) {
                    versionCode = versionCode.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');


                    let packageName = await helpers.getAPKPackageName(filePath);
                    packageName = packageName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    console.log("Package Name: ", packageName);

                    let versionName = await helpers.getAPKVersionName(filePath);
                    versionName = versionName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    console.log("Version Name: ", versionName);

                    let label = await helpers.getAPKLabel(filePath);
                    console.log(label)
                    label = label.toString().replace(/(\r\n|\n|\r)/gm, "");
                    console.log("label Name: ", label);

                    let current_date = moment().format("YYYYMMDDHHmmss")
                    fileName = fieldName + '-' + current_date + '.apk';
                    console.log(fileName);
                    let target_path = path.join(__dirname, "../../uploads/" + fileName);
                    helpers.move(filePath, target_path, async function (error) {
                        if (error) {
                            return res.send({
                                status: false,
                                msg: "Error while uploading"
                            });
                        }
                        console.log("fileName:", fileName);

                        if ((packageName === 'com.armorSec.android' || packageName === 'com.rim.mobilefusion.client' || packageName === 'com.secure.vpn') && featureApk == null) {
                            // console.log(packageName, 'pkg name if')
                            data = {
                                status: false,
                                msg: await helpers.convertToLang(req.translation["not allowed"], "Error: Uploaded Apk is not Allowed."), // "Error: Unable to read APP properties.",
                            };
                            return res.send(data);
                        } else {
                            // console.log('else featured', featureApk)
                            if (featureApk !== null) {

                                if (featureApk === "CHAT" && packageName === 'com.armorSec.android') {
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: fileName,
                                        size: formatByte,
                                        version: versionName


                                    };
                                    res.send(data);
                                    return;
                                } else if (featureApk === "PGP" && packageName === 'ca.unlimitedwireless.mailpgp') {
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: fileName,
                                        size: formatByte,
                                        version: versionName

                                    };
                                    res.send(data);
                                    return;
                                } else if (featureApk === "UEM" && packageName === 'com.rim.mobilefusion.client') {
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: fileName,
                                        size: formatByte,
                                        version: versionName

                                    };
                                    res.send(data);
                                    return;
                                } else if (featureApk === "VPN" && packageName === 'com.secure.vpn') {
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: fileName,
                                        size: formatByte,
                                        version: versionName

                                    };
                                    res.send(data);
                                    return;
                                }
                                else {
                                    data = {
                                        status: false,
                                        msg: await helpers.convertToLang(req.translation[""], "Error: Wrong apk uploaded. Please choose another apk and try again"), // "Error: Unable to read APP properties.",
                                    };
                                    res.send(data);
                                    return;
                                }
                            } else {
                                let checkFileQuery = '';
                                if (screen == 'autoUpdate') {
                                    checkFileQuery = "SELECT * FROM apk_details where label = '" + label + "' AND package_name = '" + packageName + "' AND delete_status=0";
                                } else {
                                    checkFileQuery = "SELECT * FROM apk_details where package_name = '" + packageName + "'  AND delete_status=0";
                                }

                                if (apk_id) {
                                    checkFileQuery = checkFileQuery + " AND id != " + apk_id
                                }

                                let checkPackageResult = await sql.query(checkFileQuery);
                                if (checkPackageResult.length) {
                                    // console.log(checkPackageResult, 'error version');

                                    data = {
                                        status: false,
                                        msg: await helpers.convertToLang(req.translation[""], "Error: Apk with same package name already uploaded. Please choose another apk and try again"), // "Error: Unable to read APP properties.",
                                    };
                                    res.send(data);
                                    return;
                                } else {
                                    console.log(versionName, 'success version');
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: fileName,
                                        size: formatByte,
                                        version: versionName

                                    };
                                    res.send(data);
                                    return;
                                }
                            }
                        }

                        // data = {
                        //     status: true,
                        //     msg: 'Uploaded Successfully',
                        //     fileName: fileName,
                        //     size: formatByte
                        // };
                        // res.send(data)
                        // return
                    });
                    return;
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.UNABLE_TO_READ_APP_PROPERTIES], "Error: Unable to read APP properties."), // "Error: Unable to read APP properties.",
                    };
                    res.send(data);
                    return;
                }

            } else if (fieldName === Constants.LOGO) {
                // console.log(req.files);
                let current_date = moment().format("YYYYMMDDHHmmss")
                fileName = fieldName + '-' + current_date + '.jpg';
                console.log(fileName);
                let target_path = path.join(__dirname, "../../uploads/" + fileName);

                helpers.move(filePath, target_path, async function (error) {
                    console.log(error);
                    if (error) {
                        return res.send({
                            status: false,
                            msg: "Error while uploading"
                        })
                    }

                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_LOGO_UPLOADED_SUCCESSFULLY], "Success: App logo Uploaded Successfully"), // 'Success: App logo Uploaded Successfully.',
                        fileName: fileName,
                        size: formatByte
                    };
                    return res.send(data)
                });
                return;
            } else {
                data = {
                    status: false,
                    msg: "Error while Uploading"
                }
                return res.send(data);
            }

        } else {
            return res.send({
                status: false,
                msg: "Error while uploading: Field not defined"
            })
        }



    }
}

exports.addApk = async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = req.decoded;
    if (verify) {
        try {
            let logo = req.body.logo;
            let apk = req.body.apk;
            let apk_name = req.body.name;
            if (!empty(logo) && !empty(apk) && !empty(apk_name)) {

                let file = path.join(__dirname, "../../uploads/" + apk);
                if (fs.existsSync(file)) {
                    let versionCode = '';
                    let versionName = '';
                    let packageName = '';
                    let label = '';
                    let details = '';
                    // console.log(file)
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
                    label = label.toString().replace(/(\r\n|\n|\r)/gm, "");
                    details = details.toString().replace(/(\r\n|\n|\r)/gm, "");
                    // console.log(labe)    

                    let apk_type = (verify.user.user_type === Constants.AUTO_UPDATE_ADMIN) ? 'permanent' : 'basic'

                    let apk_stats = fs.statSync(file);

                    let formatByte = helpers.formatBytes(apk_stats.size);

                    sql.query(`INSERT INTO apk_details (app_name, logo, apk, apk_type, version_code, version_name, label, package_name, details, apk_bytes, apk_size) VALUES ('${apk_name}' , '${logo}' , '${apk}', '${apk_type}', '${versionCode}', '${versionName}', '${label}', '${packageName}', '${details}', ${apk_stats.size}, '${formatByte}')`, async function (err, rslts) {
                        if (err) {
                            console.log(err)
                        };

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
                            apk_type: newData[0].apk_type,
                            size: newData[0].apk_size,
                            label: newData[0].label,
                            package_name: newData[0].package_name,
                            version: newData[0].version_name,
                            updated_at: newData[0].modified,
                            created_at: newData[0].created
                        }



                        data = {
                            status: true,
                            msg: `${newData[0].app_name} ${await helpers.convertToLang(req.translation["was uploaded successfully"], "was uploaded successfully")}`, // MsgConstants.APK_IS_UPLOADED
                            data: dta
                        };
                        return res.send(data);
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
                console.log('error while uploading', logo, apk, apk_name)
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error While Uploading"
                };
                return res.send(data);
            }
        } catch (error) {
            console.log(error, 'error while upload')
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error while Uploading",
            };
            return res.send(data);
        }
    }
}

exports.editApk = async function (req, res) {

    res.setHeader('Content-Type', 'multipart/form-data');
    var verify = req.decoded;

    if (verify) {
        try {
            let logo = req.body.logo;
            let apk = req.body.apk;
            let apk_name = req.body.name;
            if (!empty(logo) && !empty(apk) && !empty(apk_name)) {

                let file = path.join(__dirname, "../../uploads/" + apk);
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
                    label = label.replace(/(\r\n|\n|\r)/gm, "");
                    details = details.replace(/(\r\n|\n|\r)/gm, "");

                    // let apk_type = (verify.user.user_type === AUTO_UPDATE_ADMIN) ? 'permanent' : 'basic'

                    let apk_stats = fs.statSync(file);

                    let formatByte = helpers.formatBytes(apk_stats.size);

                    sql.query(`UPDATE apk_details SET app_name = '${apk_name}', logo = '${logo}',label = '${label}', apk = '${apk}', version_code = '${versionCode}', version_name = '${versionName}', package_name='${packageName}', details='${details}', apk_bytes='${apk_stats.size}',  apk_size='${formatByte}'  WHERE id = ${req.body.apk_id}`, async function (err, rslts) {

                        if (err) {
                            console.log(err)
                        };
                        let newData = await sql.query("SELECT * from apk_details where id = " + req.body.apk_id)
                        dta = {
                            apk_id: newData[0].id,
                            apk_name: newData[0].app_name,
                            logo: newData[0].logo,
                            apk: newData[0].apk,
                            permissions: [],
                            apk_status: newData[0].status,
                            permission_count: 0,
                            deleteable: (newData[0].apk_type == "permanent") ? false : true,
                            apk_type: newData[0].apk_type,
                            size: newData[0].apk_size,
                            label: newData[0].label,
                            package_name: newData[0].package_name,
                            version: newData[0].version_name,
                            updated_at: newData[0].modified,
                            created_at: newData[0].created
                        }

                        data = {
                            status: true,
                            msg: `${newData[0].app_name} ${await helpers.convertToLang(req.translation["was uploaded successfully"], "was uploaded successfully")}`, // MsgConstants.APK_IS_UPLOADED
                            data: dta
                        };
                        return res.send(data);
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

}

exports.deleteApk = async function (req, res) {
    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        if (!empty(req.body.apk_id)) {

            // check if apk is used in any policy
            // sql.query(`SELECT id FROM policy_apss WHERE apk_id = ${req.body.apk_id}`)

            sql.query(`UPDATE apk_details SET delete_status=1 WHERE id=${req.body.apk_id}`, async function (error, results) {

                if (error) {
                    console.log(error);
                }

                if (results && results.affectedRows == 0) {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.APK_NOT_DELETED], "Apk not deleted"), // Apk not deleted.",
                        rdlt: results
                    };
                } else {
                    let deletedRecord = `SELECT * FROM apk_details WHERE id=${req.body.apk_id} AND delete_status=1`;
                    let result = await sql.query(deletedRecord);
                    if (result.length) {

                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.APK_DELETED_SUCCESSFULLY], "Apk deleted successfully"), // Apk deleted successfully.",
                            apk: result[0]
                        };
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.APK_NOT_DELETED], "Apk not deleted"), // Apk not deleted.",
                            rdlt: results
                        };
                    }

                }
                return res.send(data);
            });
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some error occurred"), // Some error occurred."
            }

            return res.send(data);
        }

    }

}

exports.toggle = async function (req, res) {
    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {

        if (!empty(req.body.status) && !empty(req.body.apk_id)) {
            sql.query("update apk_details set status = '" + req.body.status + "' where id = '" + req.body.apk_id + "'", async function (err, result) {
                if (err) {
                    console.log(err)
                };

                if (result.affectedRows != 0) {
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.STATUS_UPDATED], "Status Changed Successfully"), // Status Updated.'
                    };
                    res.send(data);
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.STATUS_NOT_UPDATED], "Status Not Updated"), // Status Not Updated.'

                    };
                    res.send(data);

                }
            });
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some error occurred"), // Some error occurred.'
            };
            res.send(data);
        }
    }

}

exports.saveApkPermission = async function (req, res) {
    var verify = req.decoded;

    // console.log(req.body.action);
    // if (verify['status'] !== undefined && verify.status == true) {
    if (verify) {
        var action = req.body.action
        let apkId = req.body.apkId;
        let dealers = req.body.dealers;

        let prevPermissions = await sql.query("select dealers from apk_details WHERE id = " + apkId);
        // console.log(apkId,'query id ', prevPermissions)
        let prevParsDealers = (prevPermissions[0].dealers !== null) ? JSON.parse(prevPermissions[0].dealers) : [];
        // console.log("prevParsDelaer", prevParsDealers);

        if (action === 'save') {
            var parsedDealers = JSON.parse(dealers);

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
                let dealerids = []
                let apkIds = []
                let dealer_apks_data = await sql.query("SELECT * from dealer_apks");
                if (dealer_apks_data.length) {
                    dealer_apks_data.map((item) => {
                        dealerids.push(item.dealer_id)
                        apkIds.push(item.apk_id)
                    })
                }
                let insertQuery = "INSERT INTO dealer_apks (dealer_id, apk_id) VALUES";

                let insertOrIgnore = ' '
                for (let i = 0; i < prevParsDealers.length; i++) {
                    if (apkIds.indexOf(apkId) !== -1 && dealerids.indexOf(prevParsDealers[i]) !== -1) {
                        continue
                    }
                    insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + apkId + "),"
                }
                if (insertOrIgnore.length > 1) {
                    let query = insertQuery + insertOrIgnore;
                    query = query.slice(0, query.length - 1)
                    console.log(query);
                    await sql.query(query);
                }
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
                                let adminRoleId = await helpers.getUserTypeIDByName(Constants.ADMIN);
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_SAVED_SUCCESSFULLY], "Permission saved successfully"), // "Permission saved successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], "Permission couldn't be saved"), // "Permission couldn't be saved"
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
                    let dealerids = []
                    let apkIds = []
                    let dealer_apks_data = await sql.query("SELECT * from dealer_apks");
                    if (dealer_apks_data.length) {
                        dealer_apks_data.map((item) => {
                            dealerids.push(item.dealer_id)
                            apkIds.push(item.apk_id)
                        })
                    }
                    let insertQuery = "INSERT INTO dealer_apks (dealer_id, apk_id) VALUES";

                    let insertOrIgnore = ' '
                    for (let i = 0; i < prevParsDealers.length; i++) {
                        if (apkIds.indexOf(apkId) !== -1 && dealerids.indexOf(prevParsDealers[i]) !== -1) {
                            continue
                        }
                        insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + apkId + "),"
                    }
                    if (insertOrIgnore.length > 1) {
                        let query = insertQuery + insertOrIgnore;
                        query = query.slice(0, query.length - 1)
                        console.log(query);
                        await sql.query(query);
                    }
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
                                let adminRoleId = await helpers.getUserTypeIDByName(Constants.ADMIN);
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_REMOVED_SUCCESSFULLY], "Permission Removed successfully"), // "Permission Removed successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], "Permission couldn't be saved"), // "Permission couldn't be saved"
                    })
                }
            });

        }

    }
}


exports.savePolicyPermissions = async function (req, res) {
    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
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

                let dealerids = []
                let policyids = []
                let dealer_policies_data = await sql.query("SELECT * from dealer_policies");
                if (dealer_policies_data.length) {
                    dealer_policies_data.map((item) => {
                        dealerids.push(item.dealer_id)
                        policyids.push(item.policy_id)
                    })
                }
                let insertQuery = "INSERT INTO dealer_policies (dealer_id, policy_id) VALUES";

                let insertOrIgnore = ' '
                for (let i = 0; i < prevParsDealers.length; i++) {
                    console.log(policyids.indexOf(policyId) !== -1, dealerids.indexOf(prevParsDealers[i]) !== -1);
                    if (policyids.indexOf(policyId) !== -1 && dealerids.indexOf(prevParsDealers[i]) !== -1) {
                        continue
                    }
                    insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + policyId + "),"
                }
                if (insertOrIgnore.length > 1) {
                    let query = insertQuery + insertOrIgnore;
                    query = query.slice(0, query.length - 1)
                    console.log(query);
                    await sql.query(query);
                }
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
                                let adminRoleId = await helpers.getUserTypeIDByName(Constants.ADMIN);
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_SAVED_SUCCESSFULLY], "Permission saved successfully"), // "Permission saved successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], "Permission couldn't be saved"), // "Permission couldn't be saved"
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
                    let dealerids = []
                    let policyids = []
                    let dealer_policies_data = await sql.query("SELECT * from dealer_policies");
                    if (dealer_policies_data.length) {
                        dealer_policies_data.map((item) => {
                            dealerids.push(item.dealer_id)
                            policyids.push(item.policy_id)
                        })
                    }
                    let insertQuery = "INSERT INTO dealer_policies (dealer_id, policy_id) VALUES";

                    let insertOrIgnore = ' '
                    for (let i = 0; i < prevParsDealers.length; i++) {
                        console.log(policyids.indexOf(policyId) !== -1, dealerids.indexOf(prevParsDealers[i]) !== -1);
                        if (policyids.indexOf(policyId) !== -1 && dealerids.indexOf(prevParsDealers[i]) !== -1) {
                            continue
                        }
                        insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + policyId + "),"
                    }
                    if (insertOrIgnore.length > 1) {
                        let query = insertQuery + insertOrIgnore;
                        query = query.slice(0, query.length - 1)
                        console.log(query);
                        await sql.query(query);
                    }

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
                                let adminRoleId = await helpers.getUserTypeIDByName(Constants.ADMIN);
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_REMOVED_SUCCESSFULLY], "Permission Removed successfully"), // "Permission Removed successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], "Permission couldn't be saved"), // "Permission couldn't be saved"
                    })
                }
            });

        }
    }
}

exports.handleUninstallApk = async function (req, res) {
    try {
        var verify = req.decoded;
        let spaceType = req.body.spaceType;
        console.log('spaceType ====> ', spaceType)

        // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
            let is_restricted = (req.body.value) ? 0 : 1;
            let apk_id = req.params.apk_id;
            // console.log("UPDATE secure_market_apps SET is_restrict_uninstall = " + is_restricted + " WHERE apk_id ='" + apk_id + "'");
            sql.query(`UPDATE secure_market_apps SET is_restrict_uninstall = ${is_restricted} WHERE apk_id = '${apk_id}' AND space_type = '${spaceType}' AND dealer_id = ${verify.user.dealer_id}`, async function (err, results) {
                if (err) {
                    console.log(err);
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.UNINSTALL_PERMISSION_NOT_CHANGED], "Uninstall permission not changed. Please try again later"), // "Uninstall permission not changed. Please try again later."
                    }
                    res.send(data);
                    return;
                }
                if (results.affectedRows) {
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.UNINSTALL_PERMISSION_CHANGED], "Uninstall permission changed"), // "Uninstall permission changed."
                    }
                    res.send(data);
                    return
                }
                else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.UNINSTALL_PERMISSION_NOT_CHANGED], "Uninstall permission not changed. Please try again later"), // "Uninstall permission not changed. Please try again later."
                    }
                    res.send(data);

                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}