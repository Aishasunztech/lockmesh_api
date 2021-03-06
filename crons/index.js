// libraries
var datetime = require('node-datetime');
var moment = require('moment');
var cron = require('node-cron');
var html = require('html-escaper');

// custom libraries
const { sql } = require('../config/database');
const sockets = require('../routes/sockets');

// helpers
const device_helpers = require('../helper/device_helpers.js');
const socket_helpers = require('../helper/socket_helper');

// constants
const constants = require('../constants/Application');
const app_constants = require("../config/constants");

/**
 * =================
 * Asterisk. E.g. *
 * Ranges. E.g. 1-3,5
 * Steps. E.g. *'/2
 * =================
 * Seconds: 0-59
 * Minutes: 0-59
 * Hours: 0-23
 * Day of Month: 1-31
 * Months: 0-11 (Jan-Dec)
 * Day of Week: 0-6 (Sun-Sat)
 *
 *   *         *       *         *            *       *
 * Seconds  Minutes  Hours  (Days of Month)  Months  Weekday
 */

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

                if (item.account_balance_status_by !== constants.ADMIN || (item.account_balance_status_by == constants.ADMIN && item.account_balance_status == 'active')) {

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

                if (item.account_balance_status_by !== constants.ADMIN) {
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

/** send messages on devices **/
cron.schedule('0 * * * * *', async () => { // '*/10 * * * * *' (after each 10 seconds)
    //**************************** local testing  ******************/ 
    // let job_id = Math.floor(Math.random() * 1000) + 1;
    // console.log("send msg on socket ", job_id)
    // socket_helpers.sendMsgToDevice(
    //     sockets.baseIo,
    //     "ELDB929541",
    //     job_id,
    //     "testing msg, blah blah blah...",
    //     app_constants.TIME_ZONE
    // );

    //**************************** local testing  ******************/ 


    // Get current time
    // let currentTime = moment().tz(app_constants.TIME_ZONE).format(constants.TIMESTAMP_FORMAT);
    // var getMsgQueue = `SELECT * FROM task_schedules WHERE ((status = 'NEW' OR status = 'FAILED' OR status = 'IN-PROCESS' OR status = 'SUCCESS') AND next_schedule <= '${currentTime}');`;
    let currentTime = moment().tz(app_constants.TIME_ZONE).format(constants.TIMESTAMP_FORMAT_NOT_SEC);
    var getMsgQueue = `SELECT *, DATE_FORMAT(\`next_schedule\`, '%Y-%m-%d %H:%i') AS \`next_schedule_format\` FROM task_schedules WHERE (status = 'NEW' OR status = 'IN-PROCESS') having next_schedule_format <= '${currentTime}';`;
    // console.log("getMsgQueue ", getMsgQueue);
    var results = await sql.query(getMsgQueue);
    // console.log("results ", results);

    for (let i = 0; i < results.length; i++) {

        // check online/offline devices
        let isOnline = await device_helpers.isDeviceOnline(results[i].device_id);
        if (isOnline) {
            let sendCount = 0;
            if (results[0].send_count || results[0].send_count === 0) {
                sendCount = results[0].send_count + 1;
            }
            // console.log("device is online to send msg")

            // Calculate Minutes from first time send msg to devices with no response
            // let totalMin = 0;
            // if (results[i].start_time && results[i].next_schedule) {
            //     totalMin = moment(currentTime).diff(moment(results[i].start_time), 'minutes');
            // }
            // console.log("calculte time: Start Time: ", results[i].start_time, "Next Schedules: ", currentTime, "totalMin ", totalMin);

            let updateMsgScheduleStatus = '';

            // when same msg wih same job id send to socket 3 times then status of this job will be failed and not send again for now but will handle it later
            if (sendCount && sendCount > 3 && results[i].status === 'IN-PROCESS') {
                console.log('set failed to send');
                updateMsgScheduleStatus = `UPDATE task_schedules SET status = 'FAILED' WHERE id=${results[i].id};`;
            }
            else { // New 
                // console.log('set in process to send')
                updateMsgScheduleStatus = `UPDATE task_schedules SET status = 'IN-PROCESS', send_count = ${sendCount} WHERE id=${results[i].id};`;

                // send msg to device using Socket
                socket_helpers.sendMsgToDevice(
                    sockets.baseIo,
                    results[i].device_id,
                    results[i].id,
                    html.unescape(results[i].title),
                    app_constants.TIME_ZONE
                );
            }
            console.log("MsgScheduleStatus : ", updateMsgScheduleStatus);
            if (updateMsgScheduleStatus) {
                await sql.query(updateMsgScheduleStatus);
            }

        } // end if of check online device
        // else{
        //     console.log("device is offline to send msg")
        // }
    }
});

// app_constants.twilioClient.monitor.events('DEe06a6f910aeecb0e4f7390b4ff85603d').fetch().then(function (){
//     console.log('hello')
// });
/** sim data usage */
cron.schedule('*/4 * * * * *', async () => {
    // let activeServicesDataQ = `SELECT * FROM services_data WHERE (status='active' OR status='request_for_cancel')`
    // sql.query(activeServicesDataQ, function (error, activeServicesData) {
    //     if (error) {
    //         console.log('activeServicesQ Error: ', error.message)
    //     }

    //     if (activeServicesData && activeServicesData.length) {
    //         // console.log(activeServicesData)
    //         activeServicesData.map(activeService => {
    //             let serviceQ = `SELECT * FROM user_acc_services WHERE service_id=? AND (type='sim_id' OR type='sim_id2')`
    //             sql.query(serviceQ, [activeService.id], function (error, services) {
    //                 if (error) {
    //                     console.log('simServiceQ Error: ', error.message)
    //                 }
    //                 if(services && services.length){
    //                     console.log(services);
    //                 }
    //             })
    //         })

    //     }
    // })


    // get usage records for all sims
    // app_constants.twilioClient.usage.records.daily.each((usageRecords) => {
    //     // console.log(usageRecords)
    //     // usageRecords.forEach(u => console.log(u))
    // })


    // get usage record overall account
    // app_constants.twilioClient.wireless.usageRecords.list({
    //     // end: Date,
    //     // granularity: UsageRecordGranularity,
    //     limit: 20,
    //     // pageSize: number,
    //     // start: Date,
    // }).then((usageRecords) => {
    //     usageRecords.forEach(u => console.log(u))
    // });
    // console.log()
    
    

    // Get usage record for specific sim

    // app_constants.twilioClient.wireless.sims('DEe06a6f910aeecb0e4f7390b4ff85603d').usageRecords.list({}).then((simId)=>{
    //     console.log(simId)
    // })
})

// [
//     {
//         simSid: 'DEe06a6f910aeecb0e4f7390b4ff85603d',
//         accountSid: 'AC2383c4b776efb51c86cc6f9a5cdb4e89',
//         period: { start: '2020-01-21T00:00:00Z', end: '2020-02-22T00:00:00Z' },
//         commands: {
//             billing_units: 'USD',
//             from_sim: null,
//             to_sim: null,
//             national_roaming: {
//                 billing_units: 'USD',
//                 billed: 0,
//                 total: 0,
//                 from_sim: 0,
//                 to_sim: 0
//             },
//             home: {
//                 billing_units: 'USD',
//                 billed: 0,
//                 total: 0,
//                 from_sim: 0,
//                 to_sim: 0
//             },
//             international_roaming: [],
//             billed: 0,
//             total: null
//         },
//         data: {
//             billing_units: 'USD',
//             upload: 3465767,
//             download: 19772337,
//             national_roaming: {
//                 billing_units: 'USD',
//                 upload: 0,
//                 download: 0,
//                 units: 'bytes',
//                 billed: 0,
//                 total: 0
//             },
//             home: {
//                 billing_units: 'USD',
//                 upload: 0,
//                 download: 0,
//                 units: 'bytes',
//                 billed: 0,
//                 total: 0
//             },
//             units: 'bytes',
//             international_roaming: [[Object]],
//             billed: 2.33,
//             total: 23238104
//         }
//     }
// ]