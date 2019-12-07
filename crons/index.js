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

// constants
const constants = require('../constants/Application');

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

            let getTransaction = await sql.query(`SELECT * FROM financial_account_transections 
            WHERE user_id = ${item.dealer_id} AND status = 'pending' AND DATE(created_at) >= ${getDate} LIMIT 1`);
            
            if (getTransaction.length) {

                let now = moment();
                let end = moment(getTransaction[0].created_at).format('YYYY-MM-DD');
                let duration = now.diff(end, 'days');
                
                /**
                 * @author Usman Hafeez
                 * @description added condition if restriction mode is settled by Admin then don't change any level 
                 */

                if(item.account_balance_status_by !== constants.ADMIN || (item.account_balance_status_by==constants.ADMIN && item.account_balance_status=='active')){

                    if (duration > 21 && duration <= 60) {
                        await sql.query("UPDATE dealers set account_balance_status = 'restricted', account_balance_status_by = 'due_credits' WHERE dealer_id = " + item.dealer_id);
                    } else if (duration > 60) {
                        await sql.query("UPDATE dealers set account_balance_status = 'suspended', account_balance_status_by = 'due_credits' WHERE dealer_id = " + item.dealer_id);
                    }
                }
                
            } else {

                /**
                 * @author Usman Hafeez
                 * @description added condition if restriction mode is settled by Admin then don't change any level 
                 */

                if(item.account_balance_status_by !== constants.ADMIN){
                    await sql.query("UPDATE dealers set account_balance_status = 'active', account_balance_status_by = 'due_credits' WHERE dealer_id = " + item.dealer_id);
                }
            }
        })
    }
});

/** complete service **/
cron.schedule('0 0 0 * * *', async () => {

    var userAccQ = "SELECT * FROM usr_acc WHERE device_status = 1";
    var results = await sql.query(userAccQ);
    for (let i = 0; i < results.length; i++) {
        let service_data = await sql.query(`SELECT * FROM services_data WHERE (status = 'active' OR status = 'request_for_cancel') AND user_acc_id = ${results[i].id} `);
        if (service_data.length) {
            let current_date = moment().format('YYYY/MM/DD')
            if (service_data[0].service_expiry_date <= current_date) {

                await sql.query("UPDATE services_data set end_date = '" + service_data[0].service_expiry_date + "', status = 'completed', paid_credits = " + service_data[0].total_credits + " WHERE id = " + service_data[0].id);
                await sql.query(`UPDATE user_acc_services SET end_date = ${service_data[0].service_expiry_date} WHERE service_id =  ${service_data[0].id}`)
                let extended_service = await sql.query(`SELECT * FROM services_data WHERE user_acc_id = ${results[i].id} AND status = 'extended'`)
                if (extended_service && extended_service.length) {
                    let end_date = current_date.add(moment(extended_service[0].service_term))
                    await sql.query(`UPDATE services_data SET status = 'active' , start_date = ${current_date} , end_date = ${end_date} WHERE user_acc_id = ${results[i].id} AND status = 'extended'`)
                }
            }
        }
    }
});