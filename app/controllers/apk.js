const { sql } = require('../../config/database');
const multer = require('multer');
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var XLSX = require('xlsx');
var empty = require('is-empty');
var mime = require('mime');
const axios = require('axios');

const Constants = require('../../constants/application');
const device_helpers = require('../../helpers/device_helpers');
const general_helpers = require('../../helpers/general_helpers');
const moment = require('moment')

exports.apklist = async function (req, res) {
    console.log(req.decoded);
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
                msg: "No result found",
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
            msg: "Error while uploading"
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
        // let file = path.join(__dirname, "../uploads/" + filename);
        let versionCode = await general_helpers.getAPKVersionCode(filePath);
        // console.log("version code", versionCode);
        // let apk_stats = fs.statSync(file);

        // let formatByte = helpers.formatBytes(apk_stats.size);
        if (versionCode) {

            fileName = fieldName + '-' + Date.now() + '.apk';
            let target_path = path.join(__dirname, "../../uploads/" + fileName);

            general_helpers.move(filePath, target_path, function (error) {
                console.log(error);
                if (error) {
                    res.send({
                        status: false,
                        msg: "Error while uploading"
                    })
                }
                console.log(fileName);
                data = {
                    status: true,
                    msg: 'Uploaded Successfully',
                    fileName: fileName,
                    size: formatByte
                };
                res.send(data)
                return
            });
        } else {
            data = {
                status: false,
                msg: "Error while Uploading",
            };
            res.send(data);
            return;
        }
    } else if (fieldName === Constants.LOGO) {
        // console.log(req.files);


        fileName = fieldName + '-' + Date.now() + '.jpg';
        let target_path = path.join(__dirname, "../../uploads/" + fileName);

        general_helpers.move(filePath, target_path, function (error) {
            console.log(error);
            if (error) {
                res.send({
                    status: false,
                    msg: "Error while uploading"
                })
            }
            data = {
                status: true,
                msg: 'Uploaded Successfully',
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
            msg: "Error while Uploading"
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

            let file = path.join(__dirname, "../../uploads/" + apk);
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
exports.deleteApk = async function (req, res) {
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

exports.editApk = async function (req, res) {
    // console.log(req.body);
    try {
        let logo = req.body.logo;
        let apk = req.body.apk;
        let apk_name = req.body.name;
        if (!empty(logo) && !empty(apk) && !empty(apk_name)) {
            // console.log("object");
            let file = path.join(__dirname, "../../uploads/" + apk);
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

                sql.query("update apk_details set app_name = '" + apk_name + "', logo = '" + logo + "', apk_file = '" + apk + "', version_code = '" + versionCode + "', version_name = '" + versionName + "', package_name='" + packageName + "', details='" + details + "', apk_bytes='" + apk_stats.size + "',  apk_size='" + formatByte + "'  where id = '" + req.body.apk_id + "'", function (err, rslts) {

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
    } catch (error) {
        data = {
            status: false,
            msg: "Error while Uploading",
        };
        res.send(data);
        return;
    }
}