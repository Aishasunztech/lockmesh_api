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


exports.apklist = async function (req, res) {
    // console.log(req.decoded);

    let data = []
    sql.query("select * from apk_details where delete_status=0 AND apk_type = 'permanent' order by id ASC", async function (error, results) {
        if (error) throw error;

        if (results.length > 0) {
            // let adminRoleId = await helpers.getuserTypeIdByName(Constants.ADMIN);
            // let dealerCount = await helpers.dealerCount(adminRoleId);
            // console.log("dealer count", dealerCount)
            for (var i = 0; i < results.length; i++) {
                // let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
                // let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                // let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                dta = {
                    "apk_id": results[i].id,
                    "apk_name": results[i].app_name,
                    "logo": results[i].logo,
                    "apk": results[i].apk_file,
                    "permissions": [],
                    "apk_status": results[i].status,
                    "size": results[i].apk_size,
                    "permission_count": '',
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
                msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
                list: []
            }
            res.send(data);
        }

    });
}

exports.uploadApk = async function (req, res) {
    let fileUploaded = false;
    let fileName = "";
    let mimeType = "";
    let fieldName = req.params.fieldName;

    let file = null
    if (fieldName === Constants.LOGO) {
        file = req.files.logo;
    } else if (fieldName === Constants.APK) {
        file = req.files.apk;
    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error while uploading"
        })
        return;
    }

    console.log(file);
    filePath = file.path;
    mimeType = file.type;
    bytes = file.size
    let formatByte = general_helpers.formatBytes(bytes);
    console.log(formatByte);

    if (fieldName === Constants.APK) {
        // let file = path.join(__dirname, "../../uploads/" + filename);
        let versionCode = await general_helpers.getAPKVersionCode(filePath);

        // let apk_stats = fs.statSync(file);

        // let formatByte = helpers.formatBytes(apk_stats.size);
        if (versionCode) {

            fileName = fieldName + '-' + Date.now() + '.apk';
            let target_path = path.join(__dirname, "../../../uploads/" + fileName);

            general_helpers.move(filePath, target_path, async function (error) {
                console.log(error);
                if (error) {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error while uploading"
                    })
                }
                console.log(fileName);
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.UPLOADED_SUCCESSFULLY], "Uploaded Successfully"), // 'Uploaded Successfully',
                    fileName: fileName,
                    size: formatByte
                };
                res.send(data)
                return
            });
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error while Uploading",
            };
            res.send(data);
            return;
        }
    } else if (fieldName === Constants.LOGO) {
        // console.log(req.files);


        fileName = fieldName + '-' + Date.now() + '.jpg';
        let target_path = path.join(__dirname, "../../../uploads/" + fileName);

        general_helpers.move(filePath, target_path, async function (error) {
            console.log(error);
            if (error) {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error while uploading"
                })
            }
            data = {
                status: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.UPLOADED_SUCCESSFULLY], "Uploaded Successfully"), // 'Uploaded Successfully',
                fileName: fileName,
                size: formatByte

            };
            res.send(data)
            return
        });
    }
    else {
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error while Uploading"
        }
        res.send(data);
        return;
    }
}

// exports.addApk = async function (req, res) {
//     try {
//         let logo = req.body.logo;
//         let apk = req.body.apk;
//         let apk_name = req.body.name;
//         if (!empty(logo) && !empty(apk) && !empty(apk_name)) {

//             let file = path.join(__dirname, "../../../uploads/" + apk);
//             console.log("File", file);
//             if (fs.existsSync(file)) {
//                 let versionCode = '';
//                 let versionName = '';
//                 let packageName = '';
//                 let label = '';
//                 let details = '';

//                 versionCode = await general_helpers.getAPKVersionCode(file);
//                 if (versionCode) {
//                     versionName = await general_helpers.getAPKVersionName(file);
//                     if (!versionName) {
//                         versionName = ''
//                     }

//                     packageName = await general_helpers.getAPKPackageName(file);
//                     if (!packageName) {
//                         packageName = '';
//                     }

//                     label = await general_helpers.getAPKLabel(file);
//                     console.log("Label", label);

//                     if (!label) {
//                         label = ''

//                     }
//                 } else {
//                     versionCode = '';
//                 }

//                 versionCode = versionCode.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
//                 versionName = versionName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
//                 packageName = packageName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
//                 label = label.toString().replace(/(\r\n|\n|\r)/gm, "");
//                 details = details.toString().replace(/(\r\n|\n|\r)/gm, "");

//                 let apk_type = 'permanent'

//                 let apk_stats = fs.statSync(file);

//                 let formatByte = general_helpers.formatBytes(apk_stats.size);

//                 sql.query(`INSERT INTO apk_details (app_name, logo, apk_file, apk_type, version_code, version_name, package_name, details, apk_bytes, apk_size, label) VALUES ('${apk_name}' , '${logo}' , '${apk}', '${apk_type}', '${versionCode}', '${versionName}', '${packageName}', '${details}', ${apk_stats.size}, '${formatByte}', '${label}')`, async function (err, rslts) {
//                     let newData = await sql.query("SELECT * from apk_details where id = " + rslts.insertId)
//                     // console.log(newData[0]);
//                     dta = {
//                         apk_id: newData[0].id,
//                         apk_name: newData[0].app_name,
//                         logo: newData[0].logo,
//                         apk: newData[0].apk_file,
//                         permissions: [],
//                         apk_status: newData[0].status,
//                         permission_count: 0,
//                         deleteable: (newData[0].apk_type == "permanent") ? false : true,
//                         apk_type: newData[0].apk_type,
//                         size: newData[0].apk_size,
//                     }


//                     if (err) throw err;
//                     data = {
//                         status: true,
//                         msg: await helpers.convertToLang(req.translation[MsgConstants.APK_IS_UPLOADED], "Apk is uploaded"), // "Apk is uploaded",
//                         data: dta
//                     };
//                     res.send(data);
//                     return;
//                 });

//             } else {
//                 console.log("file not found");
//                 res.send({
//                     status: false,
//                     msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error While Uploading"
//                 })
//                 return;
//             }

//         } else {
//             data = {
//                 status: false,
//                 msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error While Uploading"
//             };
//             res.send(data);
//             return;
//         }
//     } catch (error) {
//         console.log(error);
//         data = {
//             status: false,
//             msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error while Uploading",
//         };
//         return;
//     }
// }

// exports.editApk = async function (req, res) {
//     // console.log(req.body);
//     try {
//         let logo = req.body.logo;
//         let apk = req.body.apk;
//         let apk_name = req.body.name;
//         if (!empty(logo) && !empty(apk) && !empty(apk_name)) {
//             // console.log("object");
//             let file = path.join(__dirname, "../../../uploads/" + apk);
//             // console.log(file);
//             if (fs.existsSync(file)) {
//                 let versionCode = '';
//                 let versionName = '';
//                 let packageName = ' ';
//                 let label = '';
//                 let details = '';

//                 versionCode = await general_helpers.getAPKVersionCode(file);
//                 if (versionCode) {
//                     versionName = await general_helpers.getAPKVersionName(file);
//                     if (!versionName) {
//                         versionName = ''
//                     }
//                     packageName = await general_helpers.getAPKPackageName(file);
//                     if (!packageName) {
//                         packageName = '';
//                     }
//                     label = await general_helpers.getAPKLabel(file);
//                     console.log("Label", label);

//                     if (!label) {
//                         label = ''
//                     }
//                 } else {
//                     versionCode = '';
//                 }

//                 versionCode = versionCode.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
//                 versionName = versionName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
//                 packageName = packageName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
//                 label = label.replace(/(\r\n|\n|\r)/gm, "");
//                 details = details.replace(/(\r\n|\n|\r)/gm, "");

//                 // let apk_type = (verify.user.user_type === AUTO_UPDATE_ADMIN) ? 'permanent' : 'basic'

//                 let apk_stats = fs.statSync(file);

//                 let formatByte = general_helpers.formatBytes(apk_stats.size);

//                 sql.query("UPDATE apk_details SET label = '" + label + "', app_name = '" + apk_name + "', logo = '" + logo + "', apk_file = '" + apk + "', version_code = '" + versionCode + "', version_name = '" + versionName + "', package_name='" + packageName + "', details='" + details + "', apk_bytes='" + apk_stats.size + "',  apk_size='" + formatByte + "'  WHERE id = '" + req.body.apk_id + "'", async function (err, rslts) {
//                     if (err) { console.log(err) };

//                     data = {
//                         status: true,
//                         msg: await helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], "Record Updated"), // "Record Updated"

//                     };
//                     res.send(data);
//                     return;
//                 });
//                 return;
//             } else {
//                 data = {
//                     status: false,
//                     msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error While Uploading"
//                 };
//                 res.send(data);
//                 return;
//             }

//         } else {
//             data = {
//                 status: false,
//                 msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error While Uploading"
//             };
//             res.send(data);
//             return;
//         }
//     } catch (error) {
//         data = {
//             status: false,
//             msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error while Uploading",
//         };
//         res.send(data);
//         return;
//     }
// }


exports.apkList = async function (req, res) {
    var verify = req.decoded;
    var data = [];

    if (verify) {
        if (verify.user.user_type === Constants.ADMIN) {
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
                            "deleteable": (results[i].apk_type == "permanent") ? false : true,
                            "package_name": results[i].package_name,
                            "version": results[i].version_name,
                            "updated_at": results[i].modified,
                            "created_at": results[i].created,
                        }
                        data.push(dta);
                    }

                    return res.send({
                        status: true,
                        success: true,
                        list: data
                    });

                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
                        list: []
                    }
                    return res.send(data);
                }

            });
        } else if (verify.user.user_type === Constants.DEALER) {
            sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.apk_type != 'permanent' AND delete_status = 0", async function (error, results) {
                if (error) {
                    console.log(error);
                }
                if (results.length > 0) {

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
                            "package_name": results[i].package_name,
                            "version": results[i].version_name,
                            "updated_at": results[i].modified,
                            "created_at": results[i].created,
                            // "deleteable": (results[i].apk_type == "permanent") ? false : true
                        }
                        data.push(dta);
                    }

                    return res.send({
                        status: true,
                        success: true,
                        list: data
                    });

                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
                        list: []
                    }
                    return res.send(data);
                }
            });
        } else if (verify.user.user_type === Constants.AUTO_UPDATE_ADMIN) {
            sql.query("select * from apk_details where delete_status=0 AND apk_type = 'permanent' order by id ASC", async function (error, results) {
                if (error) {
                    console.log(error);
                }
                if (results.length > 0) {
                    // console.log("dealer_count ", dealerCount);
                    for (var i = 0; i < results.length; i++) {
                        dta = {
                            apk_id: results[i].id,
                            apk_name: results[i].app_name,
                            logo: results[i].logo,
                            apk: results[i].apk,
                            permissions: [],
                            apk_status: results[i].status,
                            permission_count: 0,
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
                        list: []
                    }
                    return res.send(data);
                }
            });
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // "No result found",
                list: []
            }
            return res.send(data);
        }
    }
}

exports.showPoliciesUsedApk = async function (req, res) {

}

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

    console.log();
    var verify = req.decoded;

    if (verify) {
        let fileUploaded = false;
        let filename = "";
        let mimeType = "";
        let fieldName = "";
        let apk_id = req.headers["id"] ? Number(req.headers["id"]) : null;
        let featureApk = req.headers["featured"] ? req.headers["featured"] : null;
        console.log(featureApk);
        console.log("File Uploading started.");

        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, path.join(__dirname, "../../uploads/"));
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
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some error occurred") + err, // "Error: " + err
                });
            }

            if (fileUploaded) {
                console.log("file uploaded")
                if (fieldName === Constants.APK) {
                    let file = path.join(__dirname, "../../uploads/" + filename);
                    console.log(file);
                    let versionCode = await helpers.getAPKVersionCode(file);
                    console.log("version code", versionCode);
                    let packageName = await helpers.getAPKPackageName(file);
                    packageName = packageName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    let versionName = await helpers.getAPKVersionName(file);
                    versionName = versionName.toString().replace(/(\r\n|\n|\r)/gm, "").replace(/['"]+/g, '');
                    console.log("Package Name", packageName);

                    let apk_stats = fs.statSync(file);

                    let formatByte = helpers.formatBytes(apk_stats.size);
                    if (versionCode) {
                        if ((packageName === 'com.armorSec.android' || packageName === 'ca.unlimitedwireless.mailpgp' || packageName === 'com.rim.mobilefusion.client') && featureApk == null) {
                            data = {
                                status: false,
                                msg: await helpers.convertToLang(req.translation["not allowed"], "Error: Uploaded Apk is not Allowed."), // "Error: Unable to read APP properties.",
                            };
                            res.send(data);
                            return;
                        } else {

                            if (featureApk !== null) {

                                if (featureApk === "CHAT" && packageName === 'com.armorSec.android') {
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: filename,
                                        size: formatByte,
                                        version: versionName


                                    };
                                    res.send(data);
                                    return;
                                } else if (featureApk === "PGP" && packageName === 'ca.unlimitedwireless.mailpgp') {
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: filename,
                                        size: formatByte,
                                        version: versionName

                                    };
                                    res.send(data);
                                    return;
                                } else if (featureApk === "UEM" && packageName === 'com.rim.mobilefusion.client') {
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: filename,
                                        size: formatByte,
                                        version: versionName

                                    };
                                    res.send(data);
                                    return;
                                } else {
                                    data = {
                                        status: false,
                                        msg: await helpers.convertToLang(req.translation[""], "Error: Wrong apk uploaded. Please choose another apk and try again"), // "Error: Unable to read APP properties.",
                                    };
                                    res.send(data);
                                    return;
                                }
                            } else {
                                let checkPackage = "SELECT * FROM apk_details where package_name = '" + packageName + "'  AND delete_status=0";
                                if (apk_id) {
                                    checkPackage = checkPackage + " AND id != " + apk_id
                                }
                                console.log(checkPackage);
                                let checkPackageResult = await sql.query(checkPackage);
                                if (checkPackageResult.length) {
                                    data = {
                                        status: false,
                                        msg: await helpers.convertToLang(req.translation[""], "Error: Apk with same package name already uploaded. Please choose another apk and try again"), // "Error: Unable to read APP properties.",
                                    };
                                    res.send(data);
                                    return;
                                } else {
                                    console.log(versionName);
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], "Success: App Uploaded Successfully"), // 'Success: App Uploaded Successfully.',
                                        fileName: filename,
                                        size: formatByte,
                                        version: versionName

                                    };
                                    res.send(data);
                                    return;
                                }
                            }
                        }
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.UNABLE_TO_READ_APP_PROPERTIES], "Error: Unable to read APP properties."), // "Error: Unable to read APP properties.",
                        };
                        res.send(data);
                        return;
                    }
                } else if (fieldName === Constants.LOGO) {
                    console.log("file was image");
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_LOGO_UPLOADED_SUCCESSFULLY], "Success: App logo Uploaded Successfully"), // 'Success: App logo Uploaded Successfully.',
                        fileName: filename,
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.UNAUTHORIZED_FILE_UPLOADING_ATTEMPT], "Error: Unauthorized file uploading attempt."), // "Error: Unauthorized file uploading attempt."
                    }
                    res.send(data);
                    return;
                }
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.UPLOADED_FILE_IS_CORRUPT], "Error: Uploaded file is corrupt."), // "Error: Uploaded file is corrupt.",
                };
                res.send(data);
                return;
            }
        });
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
                            package_name: newData[0].package_name,
                            version: newData[0].version_name,
                            updated_at: newData[0].modified,
                            created_at: newData[0].created
                        }



                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.APK_IS_UPLOADED], "Apk is uploaded"), // "Apk is uploaded",
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
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], "Error while uploading"), // "Error While Uploading"
                };
                return res.send(data);
            }
        } catch (error) {
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

                    sql.query(`UPDATE apk_details SET app_name = '${apk_name}', logo = '${logo}', apk = '${apk}', version_code = '${versionCode}', version_name = '${versionName}', package_name='${packageName}', details='${details}', apk_bytes='${apk_stats.size}',  apk_size='${formatByte}'  WHERE id = ${req.body.apk_id}`, async function (err, rslts) {

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
                            package_name: newData[0].package_name,
                            version: newData[0].version_name,
                            updated_at: newData[0].modified,
                            created_at: newData[0].created
                        }

                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.APK_IS_UPLOADED], "Apk is uploaded"), // "Apk is uploaded",
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

        // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
            let is_restricted = (req.body.value) ? 0 : 1;
            let apk_id = req.params.apk_id;
            // console.log("UPDATE secure_market_apps SET is_restrict_uninstall = " + is_restricted + " WHERE apk_id ='" + apk_id + "'");
            sql.query("UPDATE secure_market_apps SET is_restrict_uninstall = " + is_restricted + " WHERE apk_id ='" + apk_id + "'", async function (err, results) {
                if (err) {
                    console.log(err)
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