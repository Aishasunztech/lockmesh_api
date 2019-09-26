// libraries
// var express = require('express');
// var router = express.Router();
var md5 = require('md5');
var empty = require('is-empty');
var datetime = require('node-datetime');
var cron = require('node-cron');

// helpers
const { sql } = require('../config/database');
const device_helpers = require('../helper/device_helpers.js');

/** Cron for device expiry date **/
cron.schedule('0 0 0 * * *', async () => {
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y/m/d');
    var userAccQ = "SELECT * FROM usr_acc WHERE device_status = 1";
    var results = await sql.query(userAccQ);

    for (var i = 0; i < results.length; i++) {

        if (formatted_dt >= results[i].expiry_date) {
            var updateUsrAcc = `update usr_acc set status = 'expired' where device_id ='${results[i].device_id}'`;
            var dvcID = await device_helpers.getDvcIDByDeviceID(results[i].device_id);
            sql.query(updateUsrAcc, function (error, updatedResults) {
                if (error) console.log(error);

                if (updatedResults && updatedResults.affectedRows == 0) {
                    console.log('not done');
                } else {
                    try {
                        console.log('expired');
                        require("../routes/sockets").sendDeviceStatus(dvcID, "expired", true);
                    } catch (error) {
                        console.log(error);
                    }
                }
            });

        }
    }
});