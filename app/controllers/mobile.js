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
const app_constants = require('../../constants/Application');


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

