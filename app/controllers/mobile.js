// packages libraries
var jwt = require('jsonwebtoken');
var path = require('path');
var fs = require("fs");
var empty = require('is-empty');
var moment = require('moment-strftime');

// user defined libraries
const device_helpers = require('../../helpers/device_helpers');
const general_helpers = require('../../helpers/general_helpers');
const { sql } = require('../../config/database');
const constants = require('../../config/constants');
const app_constants = require('../../constants/application');


exports.systemLogin = async function (req, res) {
    let { imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address } = device_helpers.getDeviceInfo(req);

    let addDeviceQ = `INSERT IGNORE into device_login (mac_address, serial_number, ip_address, simno, imei, simno2, imei2) VALUES ('${mac_address}', '${serial_number}', '${ip}', '', '', '', '')`;
    let device = await sql.query(addDeviceQ);

    if (device) {
        const systemInfo = {
            serial_number, ip, mac_address
        };

        jwt.sign(
            {
                ...systemInfo
            },
            constants.SECRET,
            {
                expiresIn: constants.EXPIRES_IN
            },
            (err, token) => {
                if (err) {
                    res.json({
                        err: err,
                        status: false,
                        success: false
                    });
                }

                if (token) {

                    res.json({
                        token: token,
                        status: true,
                        success: true
                    });
                    return;
                }
            }
        );
    } else {
        res.json({
            status: false,
            success: false
        });
        return;
    }

}

exports.getWhiteLabel = async function (req, res) {

    // console.log(req.decoded);

    if (req.decoded) {
        let whiteLabelQ = `SELECT id, model_id, name, command_name FROM white_labels WHERE command_name='${req.body.model_id}'`;
        let whiteLabel = await sql.query(whiteLabelQ);

        if (Object.keys(whiteLabel).length) {
            let whiteLabelAPKQ = ''
            console.log(req.body);
            if (req.body.byod_status) {
                whiteLabelAPKQ = `SELECT apk_file, package_name FROM whitelabel_apks WHERE whitelabel_id = ${whiteLabel[0].id} AND is_byod = 1`;
            } else {
                whiteLabelAPKQ = `SELECT apk_file, package_name FROM whitelabel_apks WHERE whitelabel_id = ${whiteLabel[0].id} AND is_byod != 1`;
            }
            console.log(whiteLabelAPKQ);
            // let whiteLabelAPKQ = `SELECT apk_file, package_name FROM whitelabel_apks WHERE whitelabel_id = ${whiteLabel[0].id}`;
            let whiteLabelAPKS = await sql.query(whiteLabelAPKQ);
            // console.log("hello", whiteLabelAPKS);
            res.send({
                status: true,
                apks: whiteLabelAPKS,
                msg: "Whitelabel exist",
                model_id: whiteLabel[0].model_id
            })
        } else {
            res.send({
                status: false,
                msg: ""
            });
        }
    } else {
        res.send({
            status: false,
            msg: ""
        })
    }
}
exports.getUpdate = async (req, res) => {
    let versionName = req.params.version;
    let uniqueName = req.params.uniqueName;
    let label = req.params.label;
    console.log(label);

    let query = `SELECT * FROM apk_details WHERE package_name = '${uniqueName}' AND ( label = '${label}' ) AND apk_type = 'permanent' AND delete_status = 0`;

    sql.query(query, function (error, response) {

        if (error) {
            res.send({
                success: true,
                status: false,
                msg: "Error in Query"
            });
        }

        let isAvail = false;

        if (Object.keys(response).length) {
            for (let i = 0; i < Object.keys(response).length; i++) {

                console.log(response[i].version_code);

                if (Number(response[i].version_code) > Number(versionName)) {
                    console.log("update available");
                    isAvail = true;
                    res.send({
                        apk_status: true,
                        success: true,
                        apk_url: response[i].apk_file
                    });

                    break;
                }
            }
            if (!isAvail) {
                res.send({
                    apk_status: false,
                    success: true,
                });
            }

        } else {
            res.send({
                apk_status: false,
                success: true,
            });
        }
    })

}

exports.getApk = async (req, res) => {

    let file = path.join(__dirname, "../../uploads/" + req.params.apk + '.apk');
    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        res.send({
            status: false,
            msg: "file not found"
        })
    }

}


exports.checkExpiry = async (req, res) => {
    var serial_number = req.body.serial_no;
    var mac = req.body.mac_address;
    var ip = req.body.ip;
    var uniqueName = req.body.unique_name;
    console.log("information", serial_number, mac, uniqueName);
    let dvcInfo = {
        serial_number,
        mac,
        ip,
        uniqueName
    }

    if (empty(serial_number) && empty(mac)) {
        res.send({
            status: false,
            msg: "Information not provided"
        });
        return
    } else if (serial_number === app_constants.PRE_DEFINED_SERIAL_NUMBER && mac === app_constants.PRE_DEFINED_MAC_ADDRESS) {
        res.send({
            status: false,
            msg: app_constants.DUPLICATE_MAC_AND_SERIAL
        });
        return
    } else if (mac == app_constants.PRE_DEFINED_MAC_ADDRESS) {
        var deviceQ = `SELECT * FROM devices WHERE  serial_number= '${serial_number}' `;
        var device = await sql.query(deviceQ);
        if (device.length) {
            let deviceStatus = device_helpers.checkStatus(device);
            res.send({
                status: true,
                device_status: deviceStatus,
                of_device_id: device[0].fl_dvc_id
            })
            return;
        } else {
            await newDevice(dvcInfo, res);
            return
        }
    } else if (serial_number == app_constants.PRE_DEFINED_SERIAL_NUMBER) {
        var deviceQ = `SELECT * FROM devices WHERE  mac_address= '${mac}' `;
        var device = await sql.query(deviceQ);
        if (device.length) {

            let deviceStatus = device_helpers.checkStatus(device);
            res.send({
                status: true,
                device_status: deviceStatus,
                of_device_id: device[0].fl_dvc_id
            })
            return;
        } else {
            await newDevice(dvcInfo, res);
            return;
        }
    } else {
        var deviceQuery = `SELECT * FROM devices WHERE mac_address = '${mac}' AND serial_number = '${serial_number}'`;

        let device = await sql.query(deviceQuery);

        if (device.length > 0) {
            let deviceStatus = device_helpers.checkStatus(device);
            res.send({
                status: true,
                device_status: deviceStatus,
                of_device_id: device[0].fl_dvc_id
            })
            return;

        } else {
            var deviceQ = `SELECT * FROM devices WHERE mac_address = '${mac}' OR serial_number = '${serial_number}'`;
            // 
            let device = await sql.query(deviceQuery);

            if (device.length > 0) {

                if (mac === device[0].mac_address) {
                    res.send({
                        status: false,
                        msg: Constants.DUPLICATE_MAC,
                        device_id: device[0].fl_dvc_id
                    });
                    return
                } else {
                    res.send({
                        status: false,
                        msg: Constants.DUPLICATE_SERIAL,
                        of_device_id: device[0].fl_dvc_id
                    });
                    return
                }
            } else {
                await newDevice(dvcInfo, res);
                return;
            }
        }
    }
}

async function newDevice(dvcInfo, res) {
    let whitelabelQ = `SELECT id FROM white_labels WHERE unique_name='${dvcInfo.uniqueName}' limit 1`;
    let whitelabelId = await sql.query(whitelabelQ);
    if (whitelabelId.length) {
        let device_id = await general_helpers.getOfflineDvcId(dvcInfo.serial_number, dvcInfo.mac);
        
        // get expiry dates
        let start_date = moment();
        let expiry_date = moment(start_date).add(1, 'M');
        start_date = moment(start_date).format('YYYY-MM-DD hh:mm:ss')
        expiry_date = moment(expiry_date).format('YYYY-MM-DD hh:mm:ss');
        
        let addDeviceQ = `INSERT into devices (fl_dvc_id, whitelabel_id, mac_address, serial_number, ip_address, simno, imei, simno2, imei2, start_date, expiry_date, remaining_days) VALUES ('${device_id}', ${whitelabelId[0].id}, '${dvcInfo.mac}', '${dvcInfo.serial_number}', '${dvcInfo.ip}', '', '', '', '', '${start_date}', '${expiry_date}', '30')`;
        let device = await sql.query(addDeviceQ);

        if (device) {

            let dvcQ = `SELECT * FROM devices WHERE id=${device.insertId} limit 1`;
            let dvcRes = await sql.query(dvcQ);

            if(dvcRes.length){

                let deviceStatus = device_helpers.checkStatus(dvcRes);
    
                res.send({
                    status: true,
                    device_status: deviceStatus,
                    of_device_id: dvcRes[0].fl_dvc_id
                });
                return;
            }else {
                res.send({
                    status: false,
                    msg: "hello"
                });
                return;
            }
        } else {
            res.send({
                status: false,
                msg: ""
            });
            return;
        }
    } else {
        res.send({
            status: false,
            msg: ""
        });
        return;
    }

}

