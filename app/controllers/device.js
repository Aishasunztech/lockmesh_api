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

exports.offlineDevices = async function (req, res) {
    console.log('offline devices get: ');
    let devicesQ = `SELECT devices.*, white_labels.name as whitelabel FROM devices LEFT JOIN white_labels ON (devices.whitelabel_id = white_labels.id)`;
    let devices = await sql.query(devicesQ);
    devices.forEach((device) => {
        device.finalStatus = device_helpers.checkStatus(device)

        device.whitelabel = general_helpers.checkValue(device.whitelabel);
        device.fl_dvc_id = general_helpers.checkValue(device.fl_dvc_id)
        device.wl_dvc_id = general_helpers.checkValue(device.wl_dvc_id)
        device.status = general_helpers.checkValue(device.status)
        device.mac_address = general_helpers.checkValue(device.mac_address)
        device.serial_number = general_helpers.checkValue(device.serial_number);
    })
    if (devices.length) {
        res.send({
            status: true,
            devices
        })
    } else {
        res.send({
            status: false,
            msg: "No data found",
            devices: []
        })
    }

}


exports.deviceStatus = async function (req, res) {
    // console.log('deviceStatus at server: ', req.body);
    let id = req.body.data.id;
    let requiredStatus = req.body.requireStatus;
    let start_date = req.body.data.start_date;
    let expiry_date = req.body.data.expiry_date;
    try {
        let updateQ = '';
        if (start_date && expiry_date && id && requiredStatus == Constants.DEVICE_EXTEND) {
            let status = 'expired';
            var varDate = new Date(expiry_date);
            var today = new Date();

            if (varDate > today) {
                status = 'active';
            }
            // console.log('status is: ', status);

            updateQ = `UPDATE devices SET start_date= '${start_date}', status = '${status}', expiry_date = '${expiry_date}', remaining_days = '2' WHERE id = ${id}`;
        } else if (id && requiredStatus == Constants.DEVICE_ACTIVATED) {
            updateQ = `UPDATE devices SET account_status= '', status='active' WHERE id = ${id}`;
        } else if (id && requiredStatus == Constants.DEVICE_SUSPENDED) {
            updateQ = `UPDATE devices SET account_status= 'suspended' WHERE id = ${id}`;
        } else {
            res.send({
                status: false,
                msg: "No data found"
            })
        }
        if (updateQ != '') {
            console.log('deviceStatus update query is: ', updateQ);
            await sql.query(updateQ, async function (err, rslts) {
                if (err) {
                    console.log(err);
                    res.send({
                        status: false,
                        msg: "Error occur"
                    });
                } else {
                    let selectQuery = `SELECT devices.*, white_labels.name as whitelabel FROM devices LEFT JOIN white_labels ON (devices.whitelabel_id = white_labels.id) WHERE devices.id = ${id}`;
                    console.log('select query: ', selectQuery);
                    await sql.query(selectQuery, async function (err, devices) {
                        console.log('selectQuery result is: ', devices);
                        if (err) {
                            console.log(err);
                            res.send({
                                status: false,
                                msg: "Error occur"
                            });
                        } else if (devices.length) {
                            devices.forEach((device) => {
                                device.finalStatus = device_helpers.checkStatus(device)

                                device.whitelabel = general_helpers.checkValue(device.whitelabel);
                                device.fl_dvc_id = general_helpers.checkValue(device.fl_dvc_id)
                                device.wl_dvc_id = general_helpers.checkValue(device.wl_dvc_id)
                                device.status = general_helpers.checkValue(device.status)
                                device.mac_address = general_helpers.checkValue(device.mac_address)
                                device.serial_number = general_helpers.checkValue(device.serial_number);
                            })
                            res.send({
                                status: true,
                                devices: devices,
                                msg: "Offline Device Status Successfully Updated!"
                            })
                        } else {
                            res.send({
                                status: false,
                                devices: [],
                                msg: "Failed to update Offline Device Status!",
                            })
                        }
                    });

                }

            });
        } else {
            res.send({
                status: false,
                msg: "Query not run"
            })
        }
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            msg: "exception for deviceStatus",
        });
        return;
    }

}
