const { sql } = require('../../config/database');
const multer = require('multer');
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var XLSX = require('xlsx');
var empty = require('is-empty');
var mime = require('mime');
const axios = require('axios');

const Constants = require('../../constants/Application');
var MsgConstants = require('../../constants/MsgConstants');

const device_helpers = require('../../helper/general_helper');
const helpers = require('../../helper/general_helper');
const moment = require('moment')

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
                msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND] , MsgConstants.NO_DATA_FOUND), // "No result found",
                list: []
            }
            res.send(data);
        }

    });
}
exports.checkApkName = async function (req, res) {
    try {
        // console.log(req.body);
        let apkName = req.body.name;
        let apk_id = req.body.apk_id
        let query = '';
        // console.log(apk_id);
        if (apkName != '' || apkName != null) {
            if (apk_id == '') {
                query = "SELECT * from apk_details where app_name = '" + apkName + "' AND delete_status != 1"
            }
            else {
                query = "SELECT * from apk_details where app_name = '" + apkName + "' AND delete_status != 1 AND id != " + apk_id;
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
        throw error
    }
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
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error while uploading"
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
        // console.log("version code", versionCode);
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error while uploading"
                    })
                }
                console.log(fileName);
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.UPLOADED_SUCCESSFULLY], MsgConstants.UPLOADED_SUCCESSFULLY), // 'Uploaded Successfully',
                    fileName: fileName,
                    size: formatByte
                };
                res.send(data)
                return
            });
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error while Uploading",
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
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error while uploading"
                })
            }
            data = {
                status: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.UPLOADED_SUCCESSFULLY], MsgConstants.UPLOADED_SUCCESSFULLY), // 'Uploaded Successfully',
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
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error while Uploading"
        }
        res.send(data);
        return;
    }
}
exports.addApk = async function (req, res) {
    try {
        let logo = req.body.logo;
        let apk = req.body.apk;
        let apk_name = req.body.name;
        if (!empty(logo) && !empty(apk) && !empty(apk_name)) {

            let file = path.join(__dirname, "../../../uploads/" + apk);
            console.log("File", file);
            if (fs.existsSync(file)) {
                let versionCode = '';
                let versionName = '';
                let packageName = '';
                let label = '';
                let details = '';

                versionCode = await general_helpers.getAPKVersionCode(file);
                if (versionCode) {
                    versionName = await general_helpers.getAPKVersionName(file);
                    if (!versionName) {
                        versionName = ''
                    }

                    packageName = await general_helpers.getAPKPackageName(file);
                    if (!packageName) {
                        packageName = '';
                    }

                    label = await general_helpers.getAPKLabel(file);
                    console.log("Label", label);

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

                let apk_type = 'permanent'

                let apk_stats = fs.statSync(file);

                let formatByte = general_helpers.formatBytes(apk_stats.size);

                sql.query(`INSERT INTO apk_details (app_name, logo, apk_file, apk_type, version_code, version_name, package_name, details, apk_bytes, apk_size, label) VALUES ('${apk_name}' , '${logo}' , '${apk}', '${apk_type}', '${versionCode}', '${versionName}', '${packageName}', '${details}', ${apk_stats.size}, '${formatByte}', '${label}')`, async function (err, rslts) {
                    let newData = await sql.query("SELECT * from apk_details where id = " + rslts.insertId)
                    // console.log(newData[0]);
                    dta = {
                        apk_id: newData[0].id,
                        apk_name: newData[0].app_name,
                        logo: newData[0].logo,
                        apk: newData[0].apk_file,
                        permissions: [],
                        apk_status: newData[0].status,
                        permission_count: 0,
                        deleteable: (newData[0].apk_type == "permanent") ? false : true,
                        apk_type: newData[0].apk_type,
                        size: newData[0].apk_size,
                    }


                    if (err) throw err;
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.APK_IS_UPLOADED], MsgConstants.APK_IS_UPLOADED), // "Apk is uploaded",
                        data: dta
                    };
                    res.send(data);
                    return;
                });

            } else {
                console.log("file not found");
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error While Uploading"
                })
                return;
            }

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error While Uploading"
            };
            res.send(data);
            return;
        }
    } catch (error) {
        console.log(error);
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error while Uploading",
        };
        return;
    }
}
exports.deleteApk = async function (req, res) {
    if (!empty(req.body.apk_id)) {
        sql.query("update `apk_details` set delete_status='1' WHERE id='" + req.body.apk_id + "'", async function (error, results) {
            console.log(results);

            if (error) throw error;
            if (results.affectedRows == 0) {
                data = {
                    "status": false,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.APK_NOT_DELETED], MsgConstants.APK_NOT_DELETED), // "Apk not deleted.",
                    "rdlt": results
                };
            } else {
                let deletedRecord = "SELECT * FROM apk_details where id=" + req.body.apk_id + " and delete_status='1'";
                let result = await sql.query(deletedRecord);
                if (result.length) {

                    data = {
                        "status": true,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.APK_DELETED_SUCCESSFULLY], MsgConstants.APK_DELETED_SUCCESSFULLY), // "Apk deleted successfully.",
                        "apk": result[0]
                    };
                } else {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.APK_NOT_DELETED], MsgConstants.APK_NOT_DELETED), // "Apk not deleted.",
                        "rdlt": results
                    };
                }

            }
            res.send(data);
        });
    } else {
        data = {
            "status": false,
            "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR], MsgConstants.ERROR), // "Some error occurred."

        }
        res.send(data);
    }
}

exports.editApk = async function (req, res) {
    // console.log(req.body);
    try {
        let logo = req.body.logo;
        let apk = req.body.apk;
        let apk_name = req.body.name;
        if (!empty(logo) && !empty(apk) && !empty(apk_name)) {
            // console.log("object");
            let file = path.join(__dirname, "../../../uploads/" + apk);
            // console.log(file);
            if (fs.existsSync(file)) {
                let versionCode = '';
                let versionName = '';
                let packageName = ' ';
                let label = '';
                let details = '';

                versionCode = await general_helpers.getAPKVersionCode(file);
                if (versionCode) {
                    versionName = await general_helpers.getAPKVersionName(file);
                    if (!versionName) {
                        versionName = ''
                    }
                    packageName = await general_helpers.getAPKPackageName(file);
                    if (!packageName) {
                        packageName = '';
                    }
                    label = await general_helpers.getAPKLabel(file);
                    console.log("Label", label);

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
                // console.log("label", label);
                // console.log('detai')

                // let apk_type = (verify.user.user_type === AUTO_UPDATE_ADMIN) ? 'permanent' : 'basic'

                let apk_stats = fs.statSync(file);

                let formatByte = general_helpers.formatBytes(apk_stats.size);
                // console.log("update apk_details set app_name = '" + apk_name + "', logo = '" + logo + "', apk = '" + apk + "', version_code = '" + versionCode + "', version_name = '" + versionName + "', package_name='" + packageName + "', details='" + details + "', apk_byte='" + apk_stats.size + "',  apk_size='"+ formatByte +"'  where id = '" + req.body.apk_id + "'");

                sql.query("update apk_details set app_name = '" + apk_name + "', logo = '" + logo + "', apk_file = '" + apk + "', version_code = '" + versionCode + "', version_name = '" + versionName + "', package_name='" + packageName + "', details='" + details + "', apk_bytes='" + apk_stats.size + "',  apk_size='" + formatByte + "'  where id = '" + req.body.apk_id + "'", async function (err, rslts) {

                    if (err) throw err;
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], MsgConstants.RECORD_UPD_SUCC), // "Record Updated"

                    };
                    res.send(data);
                    return;
                });


            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error While Uploading"
                };
                res.send(data);
                return;
            }

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error While Uploading"
            };
            res.send(data);
            return;
        }
    } catch (error) {
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_WHILE_UPLOADING], MsgConstants.ERROR_WHILE_UPLOADING), // "Error while Uploading",
        };
        res.send(data);
        return;
    }
}


exports.apkList = async function (req, res) {
    var verify = req.decoded;
    var data = [];
    
    // if (verify.status !== undefined && verify.status == true) {
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], MsgConstants.NO_DATA_FOUND), // "No result found",
                        list: []
                    }
                    res.send(data);
                }

            });
        }
        else if (verify.user.user_type === Constants.DEALER) {
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], MsgConstants.NO_DATA_FOUND), // "No result found",
                        list: []
                    }
                    res.send(data);
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], MsgConstants.NO_DATA_FOUND), // "No result found",
                        list: []
                    }
                    res.send(data);
                }
            });
        }


    }
}

exports.upload = async function (req, res) {
    res.setHeader('Content-Type', 'multipart/form-data');

    var verify = req.decoded;
    //  console.log('verify', verify.status);
    
    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        let fileUploaded = false;
        let filename = "";
        let mimeType = "";
        let fieldName = "";

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
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], MsgConstants.ERROR) + err, // "Error: " + err
                });
            }

            if (fileUploaded) {
                console.log("file uploaded")
                if (fieldName === Constants.APK) {
                    let file = path.join(__dirname, "../../uploads/" + filename);
                    let versionCode = await helpers.getAPKVersionCode(file);
                    console.log("version code", versionCode);
                    let apk_stats = fs.statSync(file);

                    let formatByte = helpers.formatBytes(apk_stats.size);
                    if (versionCode) {

                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.APP_UPLOADED_SUCCESSFULLY], MsgConstants.APP_UPLOADED_SUCCESSFULLY), // 'Success: App Uploaded Successfully.',
                            fileName: filename,
                            size: formatByte

                        };
                        res.send(data);
                        return;
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.UNABLE_TO_READ_APP_PROPERTIES], MsgConstants.UNABLE_TO_READ_APP_PROPERTIES), // "Error: Unable to read APP properties.",
                        };
                        res.send(data);
                        return;
                    }
                } else if (fieldName === Constants.LOGO) {
                    console.log("file was image");
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.APP_LOGO_UPLOADED_SUCCESSFULLY], MsgConstants.APP_LOGO_UPLOADED_SUCCESSFULLY), // 'Success: App logo Uploaded Successfully.',
                        fileName: filename,
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.UNAUTHORIZED_FILE_UPLOADING_ATTEMPT], MsgConstants.UNAUTHORIZED_FILE_UPLOADING_ATTEMPT), // "Error: Unauthorized file uploading attempt."
                    }
                    res.send(data);
                    return;
                }
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.UPLOADED_FILE_IS_CORRUPT], MsgConstants.UPLOADED_FILE_IS_CORRUPT), // "Error: Uploaded file is corrupt.",
                };
                res.send(data);
                return;
            }
        });
    }
}


exports.toggle =  async function (req, res) {
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
                        "status": true,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.STATUS_UPDATED], MsgConstants.STATUS_UPDATED), // Status Updated.'
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.STATUS_NOT_UPDATED], MsgConstants.STATUS_NOT_UPDATED), // Status Not Updated.'

                    };
                    res.send(data);

                }
            });
        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR], MsgConstants.ERROR), // Some error occurred.'
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_SAVED_SUCCESSFULLY], MsgConstants.PERMISSION_SAVED_SUCCESSFULLY), // "Permission saved successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], MsgConstants.PERMISSION_NOT_SAVED), // "Permission couldn't be saved"
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_REMOVED_SUCCESSFULLY], MsgConstants.PERMISSION_REMOVED_SUCCESSFULLY), // "Permission Removed successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], MsgConstants.PERMISSION_NOT_SAVED), // "Permission couldn't be saved"
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_SAVED_SUCCESSFULLY], MsgConstants.PERMISSION_SAVED_SUCCESSFULLY), // "Permission saved successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], MsgConstants.PERMISSION_NOT_SAVED), // "Permission couldn't be saved"
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_REMOVED_SUCCESSFULLY], MsgConstants.PERMISSION_REMOVED_SUCCESSFULLY), // "Permission Removed successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], MsgConstants.PERMISSION_NOT_SAVED), // "Permission couldn't be saved"
                    })
                }
            });

        }
    }
}

exports.handleUninstallApk =  async function (req, res) {
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.UNINSTALL_PERMISSION_CHANGED], MsgConstants.UNINSTALL_PERMISSION_CHANGED), // "Uninstall permission changed."
                    }
                    res.send(data);
                    return
                }
                else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.UNINSTALL_PERMISSION_NOT_CHANGED], MsgConstants.UNINSTALL_PERMISSION_NOT_CHANGED), // "Uninstall permission not changed. Please try again later."
                    }
                    res.send(data);

                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}