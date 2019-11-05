// libraries
var datetime = require('node-datetime');
var moment = require('moment');
var cron = require('node-cron');

// custom libraries
const { sql } = require('../config/database');
const sockets = require('../routes/sockets');

// helpers
const device_helpers = require('../helper/device_helpers.js');
const socket_helpers = require('../helper/socket_helper');

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
                        socket_helpers.sendDeviceStatus(sockets.baseIo, dvcID, "expired", true);
                    } catch (error) {
                        console.log(error);
                    }
                }
            });

        }
    }
});

/** account status **/
cron.schedule('0 0 0 * * *', async () => {

    let getDate = moment().subtract(22, 'day').format('YYYY-MM-DD');
    let allDealers = await sql.query(`SELECT dealer_id FROM dealers WHERE type = 2 OR type = 3`);


    if (allDealers.length) {
        allDealers.map(async (item) => {
            let getTransaction = await sql.query("SELECT * FROM financial_account_transections " +
                "WHERE user_id = " + item.dealer_id + " AND status = 'pending' AND DATE(created_at) >= " + getDate + " LIMIT 1");
            if (getTransaction.length) {

                let now = moment();
                let end = moment(getTransaction[0].created_at).format('YYYY-MM-DD');
                let duration = now.diff(end, 'days');

                if (duration > 21 && duration <= 60) {
                    await sql.query("UPDATE dealers set account_balance_status = 'restricted' WHERE dealer_id = " + item.dealer_id);
                } else if (duration > 60) {
                    await sql.query("UPDATE dealers set account_balance_status = 'suspended' WHERE dealer_id = " + item.dealer_id);
                }
            }
        })
    }
});

/** complete service **/
cron.schedule('0 0 0 * * *', async () => {

    let service_data = await sql.query(`SELECT * FROM services_data WHERE status = 'active' OR status = 'request_for_cancel'`);

    if (service_data.length) {

        service_data.map(async (item) => {
            if (item.service_expiry_date === moment().format('YYYY/MM/DD')) {
                console.log(item.total_credits, item.service_expiry_date)
                await sql.query("UPDATE services_data set end_date = '" + item.service_expiry_date + "', status = 'completed', paid_credits = " + item.total_credits + " WHERE id = " + item.id);
            }

            // if (duration > 21 && duration <= 60){
            //     await sql.query("UPDATE dealers set account_balance_status = 'restricted' WHERE dealer_id = "+item.dealer_id);
            // }else if (duration > 60){
            //     await sql.query("UPDATE dealers set account_balance_status = 'suspended' WHERE dealer_id = "+item.dealer_id);
            // }
        })
    }
});