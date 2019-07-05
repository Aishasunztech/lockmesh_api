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
const device_helpers = require('../../helper/device_helpers');
const general_helpers = require('../../helper/general_helper');
const moment = require('moment')
const verifyToken = require('../../config/auth');

let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no"

/**GET all the devices**/
exports.devices = async function (req, res) {

    var verify = await verifyToken(req, res);
    var where_con = '';
    let newArray = [];

    if (verify.status !== undefined && verify.status == true) {
        if (verify.user.user_type !== 'admin') {
            if (verify.user.user_type === 'dealer') {
                where_con = ` AND (usr_acc.dealer_id =${verify.user.id} OR usr_acc.prnt_dlr_id = ${verify.user.id})`;
                let query = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = ${verify.user.id} AND del_status IS NULL`;
                newArray = await sql.query(query)
            } else {
                where_con = ` AND usr_acc.dealer_id = ${verify.user.id} `;
                let query = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = ${verify.user.id} AND del_status IS NULL`;
                newArray = await sql.query(query)
            }
        } else {
            let query = `SELECT * From acc_action_history WHERE action = 'UNLINKED'`;
            newArray = await sql.query(query)
        }

        // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC');
        // sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer , pgp_emails.pgp_email,chat_ids.chat_id ,sim_ids.sim_id from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id LEFT JOIN pgp_emails on pgp_emails.user_acc_id = usr_acc.id LEFT JOIN chat_ids on chat_ids.user_acc_id = usr_acc.id LEFT JOIN sim_ids on sim_ids.device_id = usr_acc.device_id where usr_acc.transfer_status = 0 ' + where_con + ' order by devices.id DESC', function (error, results, fields) {
        // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 ' + where_con + ' order by devices.id DESC');
        sql.query(`SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0  ${where_con} ORDER BY devices.id DESC`, async function (error, results, fields) {
            // console.log('query ', 'select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 ' + where_con + ' order by devices.id DESC')
            if (error) throw error;
            for (var i = 0; i < results.length; i++) {
                results[i].finalStatus = device_helpers.checkStatus(results[i])
                results[i].pgp_email = await device_helpers.getPgpEmails(results[i])
                results[i].sim_id = await device_helpers.getSimids(results[i])
                results[i].chat_id = await device_helpers.getChatids(results[i])
                results[i].validity = await device_helpers.checkRemainDays(results[i].created_at, results[i].validity)
                // dealerData = await device_helpers.getDealerdata(results[i]);
            }
            let finalResult = [...results, ...newArray]
            // console.log('old', finalResult);

            let checkValue = general_helpers.checkValue;
            for (let device of finalResult) {

                device.account_email = checkValue(device.account_email)
                device.account_name = checkValue(device.account_name)
                device.account_status = checkValue(device.account_status)
                device.activation_code = checkValue(device.activation_code)
                device.activation_status = checkValue(device.activation_status)
                device.batch_no = checkValue(device.batch_no)
                device.chat_id = checkValue(device.chat_id)
                device.client_id = checkValue(device.client_id)
                device.connected_dealer = checkValue(device.connected_dealer)
                device.created_at = checkValue(device.created_at)
                device.dealer_id = checkValue(device.dealer_id)
                device.dealer_name = checkValue(device.dealer_name)
                device.del_status = checkValue(device.del_status)
                device.device_id = checkValue(device.device_id)
                device.device_status = checkValue(device.device_status)
                device.expiry_date = checkValue(device.expiry_date)
                device.expiry_months = checkValue(device.expiry_months)
                device.fcm_token = checkValue(device.fcm_token)
                device.finalStatus = checkValue(device.finalStatus)
                device.flagged = checkValue(device.flagged)
                device.id = checkValue(device.id)
                device.imei = checkValue(device.imei)
                device.imei2 = checkValue(device.imei2)
                device.ip_address = checkValue(device.ip_address)
                device.is_push_apps = checkValue(device.is_push_apps)
                device.is_sync = checkValue(device.is_sync)
                device.link_code = checkValue(device.link_code)
                device.mac_address = checkValue(device.mac_address)
                device.model = checkValue(device.model)
                device.name = checkValue(device.name)
                device.note = checkValue(device.note)
                device.online = checkValue(device.online)
                device.pgp_email = checkValue(device.pgp_email)
                device.prnt_dlr_id = checkValue(device.prnt_dlr_id)
                device.prnt_dlr_name = checkValue(device.prnt_dlr_name)
                device.reject_status = checkValue(device.reject_status)
                device.screen_start_date = checkValue(device.screen_start_date)
                device.serial_number = checkValue(device.serial_number)
                device.session_id = checkValue(device.session_id)
                device.sim_id = checkValue(device.sim_id)
                device.simno = checkValue(device.simno)
                device.simno2 = checkValue(device.simno2)
                device.start_date = checkValue(device.start_date)
                device.status = checkValue(device.status)
                device.transfer_status = checkValue(device.transfer_status)
                device.unlink_status = checkValue(device.unlink_status)
                device.updated_at = checkValue(device.updated_at)
                device.user_id = checkValue(device.user_id)
                device.usr_device_id = checkValue(device.usr_device_id)
                device.validity = checkValue(device.validity)
            }
            
            // let dumyData = finalResult;
            // let newResultArray = [];
            // for (let device of finalResult) {
            //     // console.log('device ', device.device_id)
            //     if (device.batch_no !== undefined && device.batch_no !== null && device.batch_no !== 'null' && device.batch_no !== 'undefined') {
            //         let batch_array = [];
            //         // console.log('batch no is exist')
            //         let chcek = newResultArray.findIndex(dvc => {
            //             return dvc.batch_no == device.batch_no
            //         });
            //         if (chcek == -1) {
            //             for (let batch_device of dumyData) {
            //                 if (device.batch_no == batch_device.batch_no) {
            //                     // console.log('batch no is matched', batch_device.batch_no)
            //                     batch_array.push(JSON.parse(JSON.stringify(batch_device)));
            //                 }
            //             }
            //             // console.log(batch_array, 'batch array length')
            //             if (batch_array.length) {
            //                 device.batchData = batch_array;
            //             }

            //             newResultArray.push(JSON.parse(JSON.stringify(device)))
            //         }

            //     } else {
            //         device.batchData = [];
            //         // if (!newResultArray.find(dvc => {
            //             // dvc.device_id == null && dvc.device_id == 'null'
            //         // })) {
            //              newResultArray.push(JSON.parse(JSON.stringify(device)) )
            //             // }
            //     }
            // }

            // console.log('final list ',newResultArray[0])

            data = {
                "status": true,
                // "data": newResultArray
                "data": finalResult
            };
            res.send(data);
            return;
        });

    }
}

// exports.offlineDevices = async function (req, res) {
//     console.log('offline devices get: ');
//     let devicesQ = `SELECT devices.*, white_labels.name as whitelabel FROM devices LEFT JOIN white_labels ON (devices.whitelabel_id = white_labels.id)`;
//     let devices = await sql.query(devicesQ);
//     devices.forEach((device) => {
//         device.finalStatus = device_helpers.checkStatus(device)

//         device.whitelabel = general_helpers.checkValue(device.whitelabel);
//         device.fl_dvc_id = general_helpers.checkValue(device.fl_dvc_id)
//         device.wl_dvc_id = general_helpers.checkValue(device.wl_dvc_id)
//         device.status = general_helpers.checkValue(device.status)
//         device.mac_address = general_helpers.checkValue(device.mac_address)
//         device.serial_number = general_helpers.checkValue(device.serial_number);
//     })
//     if (devices.length) {
//         res.send({
//             status: true,
//             devices
//         })
//     } else {
//         res.send({
//             status: false,
//             msg: "No data found",
//             devices: []
//         })
//     }

// }


// exports.deviceStatus = async function (req, res) {
//     // console.log('deviceStatus at server: ', req.body);
//     let id = req.body.data.id;
//     let requiredStatus = req.body.requireStatus;
//     let start_date = req.body.data.start_date;
//     let expiry_date = req.body.data.expiry_date;
//     try {
//         let updateQ = '';
//         if (start_date && expiry_date && id && requiredStatus == Constants.DEVICE_EXTEND) {
//             let status = 'expired';
//             var varDate = new Date(expiry_date);
//             var today = new Date();

//             if (varDate > today) {
//                 status = 'active';
//             }
//             // console.log('status is: ', status);

//             updateQ = `UPDATE devices SET start_date= '${start_date}', status = '${status}', expiry_date = '${expiry_date}', remaining_days = '2' WHERE id = ${id}`;
//         } else if (id && requiredStatus == Constants.DEVICE_ACTIVATED) {
//             updateQ = `UPDATE devices SET account_status= '', status='active' WHERE id = ${id}`;
//         } else if (id && requiredStatus == Constants.DEVICE_SUSPENDED) {
//             updateQ = `UPDATE devices SET account_status= 'suspended' WHERE id = ${id}`;
//         } else {
//             res.send({
//                 status: false,
//                 msg: "No data found"
//             })
//         }
//         if (updateQ != '') {
//             console.log('deviceStatus update query is: ', updateQ);
//             await sql.query(updateQ, async function (err, rslts) {
//                 if (err) {
//                     console.log(err);
//                     res.send({
//                         status: false,
//                         msg: "Error occur"
//                     });
//                 } else {
//                     let selectQuery = `SELECT devices.*, white_labels.name as whitelabel FROM devices LEFT JOIN white_labels ON (devices.whitelabel_id = white_labels.id) WHERE devices.id = ${id}`;
//                     console.log('select query: ', selectQuery);
//                     await sql.query(selectQuery, async function (err, devices) {
//                         console.log('selectQuery result is: ', devices);
//                         if (err) {
//                             console.log(err);
//                             res.send({
//                                 status: false,
//                                 msg: "Error occur"
//                             });
//                         } else if (devices.length) {
//                             devices.forEach((device) => {
//                                 device.finalStatus = device_helpers.checkStatus(device)

//                                 device.whitelabel = general_helpers.checkValue(device.whitelabel);
//                                 device.fl_dvc_id = general_helpers.checkValue(device.fl_dvc_id)
//                                 device.wl_dvc_id = general_helpers.checkValue(device.wl_dvc_id)
//                                 device.status = general_helpers.checkValue(device.status)
//                                 device.mac_address = general_helpers.checkValue(device.mac_address)
//                                 device.serial_number = general_helpers.checkValue(device.serial_number);
//                             })
//                             res.send({
//                                 status: true,
//                                 devices: devices,
//                                 msg: "Offline Device Status Successfully Updated!"
//                             })
//                         } else {
//                             res.send({
//                                 status: false,
//                                 devices: [],
//                                 msg: "Failed to update Offline Device Status!",
//                             })
//                         }
//                     });

//                 }

//             });
//         } else {
//             res.send({
//                 status: false,
//                 msg: "Query not run"
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         res.send({
//             status: false,
//             msg: "exception for deviceStatus",
//         });
//         return;
//     }

// }


// /**GET New the devices**/
// router.get('/new/devices', async function (req, res) {
//     var verify = await verifyToken(req, res);
//     var where_con = '';

//     if (verify['status'] !== undefined && verify.status == true) {
//         if (verify.user.user_type !== 'admin') {
//             if (verify.user.user_type === 'dealer') {
//                 // console.log('done of dealer', verify.user.id)
//                 where_con = 'AND (usr_acc.dealer_id =' + verify.user.id + ' OR usr_acc.prnt_dlr_id =' + verify.user.id + ')';
//             } else {
//                 where_con = 'AND usr_acc.dealer_id = ' + verify.user.id + ' ';
//             }
//             sql.query('select devices.*  ,' + usr_acc_query_text + ' from devices left join usr_acc on  devices.id = usr_acc.device_id WHERE ((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC', function (error, results, fields) {
//                 // console.log('select devices.*  ,' + usr_acc_query_text + ' from devices left join usr_acc on  devices.id = usr_acc.device_id WHERE ((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC');
//                 if (error) throw error;
//                 data = {
//                     "status": true,
//                     "data": results
//                 };
//                 res.send(data);
//             });
//         } else {
//             data = {
//                 "status": false,
//             };
//             res.send(data);
//         }
//     }
// });