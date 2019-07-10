const { sql } = require('../../config/database');
const multer = require('multer');
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var XLSX = require('xlsx');
var empty = require('is-empty');
const axios = require('axios');
var moment = require('moment-strftime');
var datetime = require('node-datetime');
const constants = require('../../constants/Application');
var MsgConstants = require('../../constants/MsgConstants');
var Constants = require('../../constants/Application');

const device_helpers = require('../../helper/device_helpers');
const helpers = require('../../helper/general_helper');
const verifyToken = require('../../config/auth');
const app_constants = require('../../config/constants');

// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no"


var data;

/**GET all the devices**/
exports.devices = async function (req, res) {

    var verify = req.decoded; // await verifyToken(req, res);
    var where_con = '';
    let newArray = [];

    if (verify) {
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

            let checkValue = helpers.checkValue;
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

//         device.whitelabel = helpers.checkValue(device.whitelabel);
//         device.fl_dvc_id = helpers.checkValue(device.fl_dvc_id)
//         device.wl_dvc_id = helpers.checkValue(device.wl_dvc_id)
//         device.status = helpers.checkValue(device.status)
//         device.mac_address = helpers.checkValue(device.mac_address)
//         device.serial_number = helpers.checkValue(device.serial_number);
//     })
//     if (devices.length) {
//         res.send({
//             status: true,
//             devices
//         })
//     } else {
//         res.send({
//             status: false,
//             msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "No data found",
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
//                 msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "No data found"
//             })
//         }
//         if (updateQ != '') {
//             console.log('deviceStatus update query is: ', updateQ);
//             await sql.query(updateQ, async function (err, rslts) {
//                 if (err) {
//                     console.log(err);
//                     res.send({
//                         status: false,
//                         msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Error occur"
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
//                                 msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Error occur"
//                             });
//                         } else if (devices.length) {
//                             devices.forEach((device) => {
//                                 device.finalStatus = device_helpers.checkStatus(device)

//                                 device.whitelabel = helpers.checkValue(device.whitelabel);
//                                 device.fl_dvc_id = helpers.checkValue(device.fl_dvc_id)
//                                 device.wl_dvc_id = helpers.checkValue(device.wl_dvc_id)
//                                 device.status = helpers.checkValue(device.status)
//                                 device.mac_address = helpers.checkValue(device.mac_address)
//                                 device.serial_number = helpers.checkValue(device.serial_number);
//                             })
//                             res.send({
//                                 status: true,
//                                 devices: devices,
//                                 msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Offline Device Status Successfully Updated!"
//                             })
//                         } else {
//                             res.send({
//                                 status: false,
//                                 devices: [],
//                                 msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Failed to update Offline Device Status!",
//                             })
//                         }
//                     });

//                 }

//             });
//         } else {
//             res.send({
//                 status: false,
//                 msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Query not run"
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         res.send({
//             status: false,
//             msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "exception for deviceStatus",
//         });
//         return;
//     }

// }


// /**GET New the devices**/
exports.newDevices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
        if(verify) {
        // console.log("Dealer_Translations" , req.translation)
        var where_con = '';
        if (verify.user.user_type !== constants.ADMIN) {
            
            if (verify.user.user_type === constants.DEALER) {
                // console.log('done of dealer', verify.user.id)
                where_con = ` AND (usr_acc.dealer_id =${verify.user.id} OR usr_acc.prnt_dlr_id = ${verify.user.id}) `;
            } else {
                where_con = ` AND usr_acc.dealer_id = ${verify.user.id} `;
            }

            sql.query(`select devices.*, ${usr_acc_query_text} FROM devices LEFT JOIN usr_acc ON  (devices.id = usr_acc.device_id) WHERE ((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) AND devices.reject_status = 0 ${where_con} ORDER BY devices.id DESC`, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    data = {
                        status: false,
                    };
                    res.send(data);
                    return; 
                }

                data = {
                    status: true,
                    data: results
                };
                res.send(data);
                return;
            });
        } else {
            data = {
                status: false,
            };
            res.send(data);
            return;
        }
    }
}

exports.acceptDevice = async function (req, res) {
    // res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify){
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let user_id = req.body.user_id;

        let userData = await helpers.getUserDataByUserId(user_id);

        let device_id = req.body.device_id;
        let device_name = userData[0].name;
        let device_email = userData[0].email;
        let client_id = req.body.client_id;
        let model = req.body.model;
        let dealer_id = req.body.dealer_id;
        let connected_dealer = req.body.connected_dealer;
        let usr_acc_id = req.body.usr_acc_id;
        let usr_device_id = req.body.usr_device_id
        let policy_id = req.body.policy_id;

        // let s_dealer_id = req.body.s_dealer;
        // let expiray_date = req.body.expiray_date;

        let sim_id = (req.body.sim_id == undefined) ? '' : req.body.sim_id;
        let chat_id = (req.body.chat_id == undefined) ? '' : req.body.chat_id;
        let pgp_email = (req.body.pgp_email == undefined) ? '' : req.body.pgp_email;
        var trial_status = 0

        let start_date = req.body.start_date;
        if (req.body.expiry_date === '' || req.body.expiry_date === null) {
            var status = 'expired';
        } else if (req.body.expiry_date == 0) {
            var status = 'trial';
            trial_status = 1;
            // req.body.expiry_date = 
        }
        else {
            var status = 'active';
        }
        if (req.body.expiry_date == 0) {
            var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
            var expiry_date = moment(trailDate).format("YYYY/MM/DD")
        } else {
            let exp_month = req.body.expiry_date;
            var expiry_date = helpers.getExpDateByMonth(start_date, exp_month);
        }

        if (!empty(usr_device_id)) {

            var checkDevice = `SELECT * FROM devices LEFT JOIN usr_acc ON (usr_acc.device_id = devices.id) WHERE devices.device_id = '${device_id}' `;

            let checkDealer = "SELECT * FROM dealers where dealer_id =" + dealer_id;
            let dealer = await sql.query(checkDealer);

            // let connected = await sql.query(checkConnectedDealer);
            if (loggedDealerType === SDEALER) {
                checkDevice = checkDevice + " AND usr_acc.dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === DEALER) {
                checkDevice = checkDevice + " AND (usr_acc.dealer_id =" + loggedDealerId + " OR usr_acc.prnt_dlr_id =" + loggedDealerId + ") ";
            } else if (loggedDealerType === Constants.ADMIN) {
                checkDevice = checkDevice;
            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
                });
                return;
            }

            sql.query(checkDevice, async function (checkDeviceError, rows) {
                if(checkDeviceError){
                    console.log(checkDeviceError)
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
                    });
                    return;
                }

                if (rows.length) {

                    let checkUniquePgp = `SELECT pgp_email FROM pgp_emails WHERE (pgp_email= '${pgp_email}' AND used=1)`;
                    let checkDevicepgp = await sql.query(checkUniquePgp);

                    let checkUnique = `SELECT usr_acc.* FROM usr_acc WHERE account_email= '${device_email}' AND device_id != '${device_id}' AND user_id != '${user_id}'`
                    sql.query(checkUnique, async (checkUniqueEror, success) => {
                        if(checkUniqueEror){
                            console.log(checkUniqueEror)
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
                            });
                            return;
                        }

                        if (success.length || checkDevicepgp.length) {
                            res.send({
                                status: false,
                                "msg": "Account Email OR PGP Email already taken"
                            });
                            return;
                        } else if (dealer_id !== 0 && dealer_id !== null) {

                            if (connected_dealer !== 0) {

                                common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'"
                                
                                usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + device_email + "', status = '" + status + "',trial_status = '" + trial_status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "', prnt_dlr_id=" + dealer_id + ", prnt_dlr_name='" + dealer[0].dealer_name + "' WHERE device_id = '" + usr_device_id + "'"
                                
                            } else {

                                common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'"
                                usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + device_email + "', status = '" + status + "',trial_status = '" + trial_status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' WHERE device_id = '" + usr_device_id + "'"
                            }

                            sql.query(common_Query, async function (commonQueryError, result) {
                                if(commonQueryError){
                                    console.log(commonQueryError);
                                    res.send({
                                        status: false,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
                                    });
                                    return;
                                }

                                await sql.query(usr_acc_Query)
                                
                                let updateChatIds = 'update chat_ids set user_acc_id = ' + usr_acc_id + ', used=1 where chat_id ="' + chat_id + '"';
                                await sql.query(updateChatIds);
                                
                                let updateSimIds = 'update sim_ids set user_acc_id = ' + usr_acc_id + ', used=1 where sim_id ="' + sim_id + '"';
                                await sql.query(updateSimIds)
                                
                                let updatePgpEmails = 'update pgp_emails set user_acc_id = ' + usr_acc_id + ', used=1 where pgp_email ="' + pgp_email + '"';
                                await sql.query(updatePgpEmails);

                                var slctquery = "select devices.*, " + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer , pgp_emails.pgp_email,chat_ids.chat_id ,sim_ids.sim_id from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id LEFT JOIN pgp_emails on pgp_emails.user_acc_id = usr_acc.id LEFT JOIN chat_ids on chat_ids.user_acc_id = usr_acc.id LEFT JOIN sim_ids on sim_ids.user_acc_id = usr_acc.device_id where devices.device_id = '" + device_id + "'";
                                // console.log(slctquery);
                                rsltq = await sql.query(slctquery);
                                // console.log(rsltq);

                                if (policy_id !== '') {
                                    var slctpolicy = "select * from policy where id = " + policy_id + "";
                                    let policy = await sql.query(slctpolicy);
                                    var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type) VALUES ('" + device_id + "' ," + dealer_id + "," + usr_acc_id + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy')";
                                    sql.query(applyQuery)
                                }

                                rsltq[0].finalStatus = device_helpers.checkStatus(rsltq[0])


                                axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                                    // console.log("SUPER ADMIN LOGIN API RESPONSE", response);
                                    if (response.data.status) {
                                        let data = {
                                            linkToWL: true,
                                            SN: rsltq[0].serial_number,
                                            mac: rsltq[0].mac_address,
                                            device_id: rsltq[0].device_id
                                        }
                                        axios.put(app_constants.UPDATE_DEVICE_SUPERADMIN_URL, data, { headers: { authorization: response.data.user.token } })
                                    }
                                })
                                
                                data = {
                                    status: true,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], MsgConstants.RECORD_UPD_SUCC), // 'Record updated successfully.',
                                    data: rsltq
                                };
                                res.send(data);
                                return;
                            });
                            return;
                        } else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], MsgConstants.NEW_DEVICE_NOT_ADDED), // "device is not added"
                            });
                            return;
                        }
                    });
                    return;
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
                    });
                    return;
                }
            });
            return;
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], MsgConstants.NEW_DEVICE_NOT_ADDED), // "Device Not Added Try Again"
            });
            return;
        }
    }
}


exports.createDeviceProfile = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        
        // var dataStag = [];
        var code = randomize('0', 7);
        var activation_code = await helpers.checkActivationCode(code);
        var client_id = req.body.client_id;
        var chat_id = req.body.chat_id ? req.body.chat_id : '';
        var model = req.body.model;
        var user_id = req.body.user_id;

        let userData = await helpers.getUserDataByUserId(user_id)

        var name = userData[0].user_name;
        var email = userData[0].email;
        var pgp_email = req.body.pgp_email;
        var start_date = req.body.start_date;
        var note = req.body.note;
        var validity = req.body.validity;
        var duplicate = req.body.duplicate ? req.body.duplicate : 0;
        var link_code = await device_helpers.getLinkCodeByDealerId(verify.user.id)
        if (req.body.expiry_date == 0) {
            var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
            var expiry_date = moment(trailDate).format("YYYY/MM/DD")
        } else {
            let exp_month = req.body.expiry_date;
            var expiry_date = helpers.getExpDateByMonth(start_date, exp_month);
        }

        var exp_month = req.body.expiry_date;
        var dealer_id = verify.user.dealer_id;
        var sim_id = req.body.sim_id ? req.body.sim_id : '';
        var loggedUserId = verify.user.id;
        var loggedUserType = verify.user.type;
        let policy_id = req.body.policy_id ? req.body.policy_id : '';
        if (loggedUserType === ADMIN) {
            //    dealer_id= req.body.dealer_id;
        }
        if (duplicate > 0) {
            let pgpEmail = "SELECT pgp_email from pgp_emails WHERE used=0";
            let pgp_emails = await sql.query(pgpEmail);
            let chatIds = "SELECT chat_id from chat_ids WHERE used=0";
            let chat_ids = await sql.query(chatIds);
            let simIds = "SELECT sim_id from sim_ids WHERE used=0";
            let sim_ids = await sql.query(simIds);
            let activationCodes = []
            let deviceIds = []
            let batch_no = new Date().valueOf();
            const addDuplicateActivations = async () => {
                for (let i = 0; i < duplicate; i++) {
                    let code = randomize('0', 7);
                    var activationCode = await helpers.checkActivationCode(code);
                    activationCodes.push(activationCode);
                    // deviceIds.push("'" + deviceId + "'");
                    let chat_id = (chat_ids[i]) ? chat_ids[i].chat_id : null;
                    let sim_id = (sim_ids[i]) ? sim_ids[i].sim_id : null;
                    let pgp_email = (pgp_emails[i]) ? pgp_emails[i].pgp_email : null;
                    // console.log(pgp_emails[i].pgp_email, chat_ids[i].chat_id, sim_isim_id, activationCode, deviceId);

                    var insertDevice = "INSERT INTO devices (name , created_at ) VALUES ('" + name + "', NOW())";
                    let resp = await sql.query(insertDevice)
                    // console.log("inserted id", resp.insertId);
                    let dvc_id = resp.insertId;
                    deviceIds.push(dvc_id);
                    var insertUser_acc = "INSERT INTO usr_acc (device_id , user_id,batch_no, activation_code, expiry_months, dealer_id,link_code, device_status, activation_status, expiry_date,note,validity,account_email,account_name "
                    var User_acc_values = ") VALUES ('" + dvc_id + "', '" + user_id + "', '" + batch_no + "', '" + activationCode + "',  " + exp_month + ", " + dealer_id + ", '" + link_code + "' ,  0, 0 ,'" + expiry_date + "','" + note + "','" + validity + "','" + email + "','" + name + "')";
                    insertUser_acc = insertUser_acc + User_acc_values;
                    if (resp.insertId) {
                        let resps = await sql.query(insertUser_acc)
                        let user_acc_id = resps.insertId;
                        // console.log("affectedRows", resps.affectedRows);
                        if (resps.affectedRows) {
                            let updateChatIds = 'update chat_ids set used=1, user_acc_id="' + user_acc_id + '" where chat_id ="' + chat_id + '"';
                            await sql.query(updateChatIds);
                            let updateSimIds = 'update sim_ids set used=1, user_acc_id="' + user_acc_id + '" where sim_id ="' + sim_id + '"';
                            await sql.query(updateSimIds)
                            let updatePgpEmails = 'update pgp_emails set used=1, user_acc_id="' + user_acc_id + '" where pgp_email ="' + pgp_email + '"';
                            await sql.query(updatePgpEmails);
                            if (policy_id !== '') {
                                var slctpolicy = "select * from policy where id = " + policy_id + "";
                                let policy = await sql.query(slctpolicy);
                                var applyQuery = "INSERT INTO device_history (dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type) VALUES (" + dealer_id + "," + user_acc_id + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy')";
                                sql.query(applyQuery)
                            }
                        }

                    }

                }
            }
            await addDuplicateActivations()
            html = 'Amount of activation codes : ' + activationCodes.length + '<br> ' + 'Activation Codes are following : <br>' + activationCodes.join("<br>") + '.<br> ';

            sendEmail("Activation codes successfuly generated.", html, verify.user.dealer_email);
            // console.log("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name, dealers.connected_dealer from devices left join usr_acc on devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 and devices.device_id IN (" + deviceIds.join() + ")");
            var slctquery = "select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id IN (" + deviceIds.join() + ")";
            // console.log(slctquery);
            rsltq = await sql.query(slctquery);
            // console.log(rsltq);
            for (var i = 0; i < rsltq.length; i++) {
                rsltq[i].finalStatus = device_helpers.checkStatus(rsltq[i])
                rsltq[i].pgp_email = await device_helpers.getPgpEmails(rsltq[i])
                rsltq[i].sim_id = await device_helpers.getSimids(rsltq[i])
                rsltq[i].chat_id = await device_helpers.getChatids(rsltq[i])
                await device_helpers.saveActionHistory(rsltq[i], Constants.DEVICE_PRE_ACTIVATION);
            }
            data = {
                "status": true,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // Pre-activations added succcessfully.Email sends to your account.
                "data": rsltq
            };
            res.send({
                status: true,
                data: data
            })
            return;
        } else {
            let checkUnique = "SELECT account_email from usr_acc WHERE account_email= '" + email + "' AND user_id != '" + user_id + "'";
            let checkUniquePgp = "SELECT pgp_email from pgp_emails WHERE (pgp_email= '" + pgp_email + "' AND used=1)";

            let checkDevice = await sql.query(checkUnique);
            let checkDevicepgp = await sql.query(checkUniquePgp);

            if (checkDevice.length || checkDevicepgp.length) {
                res.send({
                    status: false,
                    msg: "Account email or PGP email already taken"
                });
                return;
            } else {
                var checkDealer = "SELECT * FROM dealers WHERE dealer_id = " + dealer_id;

                var insertDevice = "INSERT INTO devices (name, model ";

                var values = ") VALUES ('" + name + "', '" + model + "'";
                // var values = ") VALUES ('" + activation_code + "', '" + name + "', '" + client_id + "', '" + chat_id + "', '" + model + "', '" + email + "', '" + pgp_email + "', " + exp_month + ", " + dealer_id + ", 0, 0 ";
                sql.query(checkDealer, async (error, response) => {
                    if (error) {
                        console.log(error);
                    }

                    if (response.length) {
                        if (response[0].connected_dealer != 0) {
                            // insertDevice = insertDevice + ", connected_dealer " + values + ",  " + response[0].connected_dealer + ")"
                        } else {
                            insertDevice = insertDevice + values + ")";
                        }
                        sql.query(insertDevice, async (err, resp) => {
                            if (err) {
                                console.log(err)
                            }
                            console.log("inserted id", resp.insertId);
                            let dvc_id = resp.insertId;
                            var insertUser_acc = "INSERT INTO usr_acc (device_id, user_id, activation_code, client_id , account_email,expiry_months, dealer_id, link_code ,device_status, activation_status, expiry_date , note,validity  "
                            // var insertDevice = "INSERT INTO devices ( activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status ";
                            var User_acc_values = ") VALUES ('" + dvc_id + "','" + user_id + "', '" + activation_code + "', '" + client_id + "', '" + email + "',  " + exp_month + ", " + dealer_id + ",'" + link_code + "' ,  0, 0 ,'" + expiry_date + "','" + note + "','" + validity + "')";
                            insertUser_acc = insertUser_acc + User_acc_values;
                            console.log(insertUser_acc);
                            if (resp.affectedRows) {
                                sql.query(insertUser_acc, async (err, resp) => {

                                    if (err) {
                                        console.log(err)
                                    }
                                    let user_acc_id = resp.insertId;

                                    console.log("affectedRows", resp.affectedRows);
                                    if (resp && resp.affectedRows) {
                                        let updateChatIds = 'update chat_ids set used=1, user_acc_id="' + user_acc_id + '" where chat_id ="' + chat_id + '"';
                                        await sql.query(updateChatIds);
                                        let updateSimIds = 'update sim_ids set used=1, user_acc_id="' + user_acc_id + '" where sim_id ="' + sim_id + '"';
                                        await sql.query(updateSimIds)
                                        let updatePgpEmails = 'update pgp_emails set used=1, user_acc_id="' + user_acc_id + '" where pgp_email ="' + pgp_email + '"';
                                        await sql.query(updatePgpEmails);
                                        if (policy_id !== '') {
                                            var slctpolicy = "select * from policy where id = " + policy_id + "";
                                            let policy = await sql.query(slctpolicy);
                                            var applyQuery = "INSERT INTO device_history (dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type) VALUES (" + dealer_id + "," + user_acc_id + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy')";
                                            sql.query(applyQuery)
                                        }

                                        sql.query("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name, dealers.connected_dealer from devices left join usr_acc on devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 and devices.id='" + dvc_id + "'", async function (error, results, fields) {

                                            if (error) {
                                                console.log(error);
                                            }
                                            // console.log("user data list ", results)

                                            results[0].finalStatus = device_helpers.checkStatus(results[0])
                                            results[0].pgp_email = await device_helpers.getPgpEmails(results[0])
                                            results[0].sim_id = await device_helpers.getSimids(results[0])
                                            results[0].chat_id = await device_helpers.getChatids(results[0])

                                            // dealerData = await device_helpers.getDealerdata(results[i]);
                                            device_helpers.saveActionHistory(results[0], Constants.DEVICE_PRE_ACTIVATION)
                                            data = {
                                                "status": true,
                                                "msg": await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC], MsgConstants.PRE_ACTIV_ADD_SUCC), // Pre-activation added succcessfully.
                                                "data": results
                                            };

                                            res.send({
                                                status: true,
                                                data: data
                                            })
                                            return;
                                        })


                                        // console.log('devices f', results);

                                    } else {
                                        data = {
                                            status: false,
                                            msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_ADD], MsgConstants.DEVICE_NOT_ADD), // Device couldn't added
                                        }
                                        res.send(data);
                                        return;
                                    }

                                });
                            }


                        })

                    } else {

                    }
                });
            }
        }
    }
}

exports.transferDeviceProfile =  async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded // await verifyToken(req, res);
    if (verify){
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let device_id = req.body.device_id;
        console.log('device id', device_id);
        var code = randomize('0', 7);
        var activation_code = await helpers.checkActivationCode(code);
        // let device_id_new = helpers.getDeviceId();
        // device_id_new = await helpers.checkDeviceId(device_id_new);

        let device = Devices.findAll({
            where: {
                device_id: device_id
            }
        }).then(async function (response, err) {
            console.log(err, 'oject res', response[0]['dataValues']);
            let new_object = response[0]['dataValues'];
            // new_object['device_id'] = device_id_new;
            console.log('sdfa', new_object.activation_code);
            // new_object['device_status'] = 0;

            var insertDevice = "INSERT INTO transferred_profiles (device_id, activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status, ip_address,sim_id, simno, imei,sim_id2,simno2, imei2, serial_number, mac_address, s_dealer, s_dealer_name, account, fcm_token,account_status,start_date, expiry_date, link_code  ";

            var value = ") VALUES ('" + device_id_new + "', '" + activation_code + "', '" + new_object.name + "', '" + new_object.client_id + "', '" + new_object.chat_id + "', '" + new_object.model + "', '" + new_object.email + "', '" + new_object.pgp_email + "', '" + new_object.expiry_months + "', '" + new_object.dealer_id + "', 0, 0 , '" + new_object.ip_address + "', '" + new_object.sim_id + "', '" + new_object.simno + "', '" + new_object.imei + "', '" + new_object.sim_id2 + "', '" + new_object.simno2 + "', '" + new_object.imei2 + "', '" + new_object.serial_number + "', '" + new_object.mac_address + "', '" + new_object.s_dealer + "', '" + new_object.s_dealer_name + "', '" + new_object.account + "', '" + new_object.fcm_token + "', '" + new_object.account_status + "', '" + new_object.start_date + "', '" + new_object.expiry_date + "', '" + new_object.link_code + "' )";
            let query = insertDevice + value;
            // console.log('qerury', query);
            sql.query(query, async function (err, resp) {
                // console.log('query reslut response', resp)
                if (err) {
                    console.log(err)
                }
                if (resp.affectedRows) {

                    var code = randomize('0', 7);
                    var activation_code = await helpers.checkActivationCode(code);
                    // let device_id_new = helpers.getDeviceId();
                    // device_id_new = await helpers.checkDeviceId(device_id_new);

                    let updateprevDevice = 'update devices set transfer_status=1, email=null, pgp_email=null, chat_id=null, sim_id=null where device_id ="' + device_id + '"';
                    await sql.query(updateprevDevice);

                    console.log('id', device_id);
                    let insertpreActiveD = "insert into devices (device_id, activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status)";
                    let values = "values('" + device_id_new + "', '" + activation_code + "', '" + new_object.name + "', '" + new_object.client_id + "', '" + new_object.chat_id + "', '" + new_object.model + "', '" + new_object.email + "', '" + new_object.pgp_email + "', '" + new_object.expiry_months + "', '" + new_object.dealer_id + "', 0, 0 )";
                    let query1 = insertpreActiveD + values;
                    await sql.query(query1);

                    res.send({
                        status: true,
                        data: {
                            "status": true,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.RECORD_TRANSF_SUCC], MsgConstants.RECORD_TRANSF_SUCC), // Record Transfered Successfully.
                        }
                    });
                } else {
                    res.send({
                        status: false,
                        data: {
                            "status": false,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.ERR_TRANSF], MsgConstants.ERR_TRANSF), // Error While Transfere.
                        }
                    });
                }
            })
        })
        // console.log("hello device", device);
        // if(loggedDealerType === DEALER){

        // } else if (loggedDealerType === SDEALER){

        // }

    }
}

exports.editDevices = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded // await verifyToken(req, res);

        if(verify) {

        if (!empty(req.body.usr_device_id)) {

            let loggedDealerId = verify.user.id;
            let loggedDealerType = verify.user.user_type;

            var user_id = req.body.user_id;

            let userData = await helpers.getUserDataByUserId(user_id)

            let device_id = req.body.device_id;
            let dealer_id = req.body.dealer_id;
            let device_name = userData[0].user_name;
            let email = userData[0].email;
            let client_id = req.body.client_id;
            let model = req.body.model;
            let usr_acc_id = req.body.usr_acc_id;
            let usr_device_id = req.body.usr_device_id;
            let prevPGP = req.body.prevPGP
            let finalStatus = req.body.finalStatus
            var note = req.body.note;
            var validity = req.body.validity;
            // let s_dealer_id = req.body.s_dealer;
            let start_date = req.body.start_date;
            // let expiray_date = req.body.expiray_date;

            let sim_id = (req.body.sim_id == undefined) ? '' : req.body.sim_id;
            let chat_id = (req.body.chat_id == undefined) ? '' : req.body.chat_id;
            let pgp_email = (req.body.pgp_email == undefined) ? '' : req.body.pgp_email;

            var d = new Date(req.body.start_date);

            if (req.body.expiry_date === '' || req.body.expiry_date === null) {
                var status = 'expired';
            } else if (req.body.expiry_date == 0) {
                var status = 'trial';
            }
            else if (finalStatus === Constants.DEVICE_PRE_ACTIVATION) {
                var status = ''
            }
            else {
                var status = 'active';
            }
            if (req.body.expiry_date == 0) {
                if (finalStatus === Constants.DEVICE_PRE_ACTIVATION || finalStatus === Constants.DEVICE_TRIAL) {
                    var expiry_date = req.body.expiry_date
                }
                else {
                    let exp_month = req.body.expiry_date;
                    var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
                    var expiry_date = moment(trailDate).format("YYYY/MM/DD")
                }
            } else {
                let exp_month = req.body.expiry_date;
                var expiry_date = helpers.getExpDateByMonth(start_date, exp_month);
            }
            // console.log('month', g_months, 'year', g_years);
            // console.log('date now', expiry_date);

            // let checkDealer = "SELECT * from dealers where dealer_id =" + dealer_id;

            // let dealer = await sql.query(checkDealer);

            var checkDevice = "SELECT start_date from usr_acc WHERE device_id = '" + usr_device_id + "' ";
            if (loggedDealerType === SDEALER) {
                checkDevice = checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === DEALER) {
                checkDevice = checkDevice + " AND (dealer_id = " + loggedDealerId + " OR prnt_dlr_id = " + loggedDealerId + " )";
            } else if (loggedDealerType === ADMIN) {
                checkDevice = checkDevice;
            } else {
                res.send({
                    status: false,
                    msg: ""
                });
                return;
            }
            // console.log(checkDevice);
            sql.query(checkDevice, async function (error, rows) {
                if (rows.length) {
                    let checkUniquePgp = "SELECT * from pgp_emails WHERE pgp_email= '" + pgp_email + "' AND user_acc_id != '' AND user_acc_id != '" + usr_acc_id + "'"
                    // let checkUnique = "SELECT usr_acc.* from usr_acc WHERE account_email= '" + device_email + "' AND device_id != '" + device_id + "'"
                    sql.query(checkUniquePgp, async function (error, success) {
                        if (success.length) {
                            res.send({
                                status: false,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.PGP_EMAIL_ALRDY_TKN], MsgConstants.PGP_EMAIL_ALRDY_TKN), // PGP email already taken
                            });
                        } else {
                            common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'";
                            if (finalStatus !== Constants.DEVICE_PRE_ACTIVATION) {
                                if (expiry_date == 0) {
                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' ,account_email = '" + email + "',status = '" + status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' WHERE device_id = '" + usr_device_id + "'"
                                } else {
                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' ,account_email = '" + email + "', status = '" + status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' WHERE device_id = '" + usr_device_id + "'"
                                }
                            } else {
                                if (expiry_date == 0) {
                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + email + "',status = '" + status + "',validity = '" + validity + "' ,note = '" + note + "' ,client_id = '" + client_id + "', device_status = 0, unlink_status=0 ,start_date = '" + start_date + "' WHERE device_id = '" + usr_device_id + "'"
                                } else {
                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + email + "',status = '" + status + "',validity = '" + validity + "' ,note = '" + note + "' ,client_id = '" + client_id + "', device_status = 0, unlink_status=0 ,start_date = '" + start_date + "', expiry_date = '" + expiry_date + "' WHERE device_id = '" + usr_device_id + "'"
                                }

                            }

                            // let sql1 = common_Query + ", s_dealer_name = '" + rslt1[0].dealer_name + "', s_dealer = '" + req.body.s_dealer + "'" + common_Query2;
                            // let sql1 = common_Query + common_Query2;
                            //console.log('empty');
                            // console.log(sql1);
                            sql.query(common_Query, async function (error, row) {
                                await sql.query(usr_acc_Query);
                                let updateChatIds = 'update chat_ids set user_acc_id = "' + usr_acc_id + '", used=1 where chat_id ="' + chat_id + '"';
                                await sql.query(updateChatIds);
                                let updateSimIds = 'update sim_ids set user_acc_id = "' + usr_acc_id + '",  used=1 where sim_id ="' + sim_id + '"';
                                await sql.query(updateSimIds)
                                let updatePgpEmails = 'update pgp_emails set user_acc_id = "' + usr_acc_id + '",  used=1 where pgp_email ="' + pgp_email + '"';
                                await sql.query(updatePgpEmails)

                                if (finalStatus === Constants.DEVICE_PRE_ACTIVATION) {
                                    if (pgp_email !== prevPGP) {
                                        let updatePrevPgp = 'update pgp_emails set user_acc_id = null,  used=0 where pgp_email ="' + prevPGP + '"';
                                        sql.query(updatePrevPgp)

                                    }
                                }

                                var slctquery = "select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id = '" + usr_device_id + "'";
                                // console.log(slctquery);
                                rsltq = await sql.query(slctquery);
                                // console.log(rsltq);
                                for (var i = 0; i < rsltq.length; i++) {
                                    rsltq[i].finalStatus = device_helpers.checkStatus(rsltq[i])
                                    rsltq[i].pgp_email = await device_helpers.getPgpEmails(rsltq[i])
                                    rsltq[i].sim_id = await device_helpers.getSimids(rsltq[i])
                                    rsltq[i].chat_id = await device_helpers.getChatids(rsltq[i])
                                    // dealerData = await device_helpers.getDealerdata(results[i]);
                                }

                                data = {
                                    "status": true,
                                    "msg": await helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], MsgConstants.RECORD_UPD_SUCC), // Record updated successfully.
                                    "data": rsltq
                                };
                                res.send(data);
                                return;
                            });
                        }
                    });


                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FOUND], MsgConstants.DEVICE_NOT_FOUND), // No Device found
                    })
                }

            });
        } else {
            res.send({
                status: false,
                msg: ""
            })
        }
    }
}


exports.deleteDevice = async function (req, res) {

    // console.log(req.body);
    var verify = req.decoded // await verifyToken(req, res);

    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        if (!empty(req.params.device_id)) {
            let userType = verify.user.user_type;
            let loggedUserId = verify.user.id;
            let where = '';
            if (userType === DEALER) {
                where = ' AND (dealer_id=' + loggedUserId + ' OR prnt_dlr_id = ' + loggedUserId + ')';
            } else if (userType === SDEALER) {
                where = ' AND (dealer_id=' + loggedUserId;
            }
            // console.log("delete where ", 'DELETE FROM devices WHERE device_id ="' + [req.params.device_id])
            if (req.body.dealer_id === loggedUserId || req.body.prnt_dlr_id === loggedUserId || userType === ADMIN) {

                let usr_device_id = await device_helpers.getOriginalIdByDeviceId(req.params.device_id);
                sql.query("DELETE from usr_acc  where device_id = " + usr_device_id, async function (error, results, fields) {
                    // sql.query("UPDATE usr_acc set unlink_status = 1 WHERE device_id = '" + usr_device_id + "'")
                    //response.end(JSON.stringify(rows));
                    // console.log(results);
                    if (error) {
                        console.log(error);
                    }
                    if (results.affectedRows !== 0) {
                        var sqlDevice = "DELETE from devices where device_id = '" + req.params.device_id + "'";
                        sql.query(sqlDevice);
                        data = {
                            "status": true,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_DEL_SUCC], MsgConstants.DEVICE_DEL_SUCC), // Device deleted successfully.
                        };
                    } else {
                        data = {
                            "status": false,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_DEL], MsgConstants.DEVICE_NOT_DEL), // Device not deleted.
                            "fld": fields,
                            "rdlt": results
                        };
                    }
                    res.send(data);
                });
            } else {
                data = {
                    "status": false,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_DEL], MsgConstants.DEVICE_NOT_DEL), // Device not deleted.
                };
                res.send(data)
            }
        }
    }
}


exports.unlinkDevice =  async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
    var device_id = req.params.id;

    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        

        if (!empty(device_id)) {
            let dvcId = await device_helpers.getDvcIDByDeviceID(device_id);
            var sql1 = `DELETE from usr_acc  where device_id=${device_id}`;
            sql.query(sql1, async function (error, results) {
                if (error) {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_UNLNK], MsgConstants.DEVICE_NOT_UNLNK), // Device not unlinked."
                    }
                };

                if (results && results.affectedRows) {
                    // Update device details on Super admin
                    axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then(async function (response) {
                        // console.log("SUPER ADMIN LOGIN API RESPONSE", response);
                        if (response.data.status) {
                            let data = {
                                linkToWL: false,
                                device_id: dvcId
                            }
                            axios.put(app_constants.UPDATE_DEVICE_SUPERADMIN_URL, data, { headers: { authorization: response.data.user.token } })
                        }
                    })
                    var userAccId = await device_helpers.getUsrAccIDbyDvcId(device_id)
                    await sql.query("update pgp_emails set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    await sql.query("update chat_ids set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    await sql.query("update sim_ids set user_acc_id = null WHERE user_acc_id = '" + userAccId + "'");
                    var sqlDevice = "DELETE from devices where id = '" + device_id + "'";
                    await sql.query(sqlDevice);

                    device_helpers.saveActionHistory(req.body.device, Constants.DEVICE_UNLINKED)
                    require("../bin/www").sendDeviceStatus(dvcId, "unlinked", true);
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_UNLNK_SUCC], MsgConstants.DEVICE_UNLNK_SUCC), // Device unlinked successfully.
                    }
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_UNLNK], MsgConstants.DEVICE_NOT_UNLNK), // Device not unlinked.
                    }
                }
                res.send(data);
                return;
            });

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEVICE_ID], MsgConstants.INVALID_DEVICE_ID), // Invalid device id.
            }
            res.send(data);
            return;
        }
    }
    // console.log('dddddddd', data)
}

exports.suspendAccountDevices = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');

    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        
        var sql2 = "select * from usr_acc where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        if (!empty(device_id)) {

            let resDevice = null;

            if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null) {

                var sql1 = "update usr_acc set account_status='suspended' where device_id = '" + device_id + "'";

                var rest = sql.query(sql1, async function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    if (results.affectedRows == 0) {


                        data = {
                            "status": false,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.ACC_NOT_SUSP], MsgConstants.ACC_NOT_SUSP), // Account not suspended.Please try again.
                        }
                    } else {
                        sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                            if (error) {
                                console.log(error);
                            }
                            console.log('lolo else', resquery[0])

                            if (resquery.length) {
                                resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                                resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                                resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                                resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                                // dealerData = await getDealerdata(res[i]);
                                data = {
                                    "data": resquery[0],
                                    "status": true,
                                    "msg": await helpers.convertToLang(req.translation[MsgConstants.ACC_SUSP_SUCC], MsgConstants.ACC_SUSP_SUCC), // Account suspended successfully.
                                }
                                device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_SUSPENDED)
                                require("../bin/www").sendDeviceStatus(resquery[0].device_id, "suspended");


                                res.send(data);

                            }
                        })

                    }


                });

            } else {

                if (gtres[0].expiry_date >= formatted_dt) {

                    var sql1 = "update usr_acc set account_status='suspended' where device_id = '" + device_id + "'";

                    var rest = sql.query(sql1, async function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        if (results.affectedRows == 0) {

                            data = {
                                "status": false,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.ACC_NOT_SUSP], MsgConstants.ACC_NOT_SUSP), // Account not suspended.Please try again."
                            }
                        } else {


                            sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                // console.log('lolo else', resquery[0])

                                if (resquery.length) {
                                    resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                                    resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                                    resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                                    resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                                    // dealerData = await getDealerdata(res[i]);
                                    data = {
                                        "data": resquery[0],
                                        "status": true,
                                        "msg": await helpers.convertToLang(req.translation[MsgConstants.ACC_SUSP_SUCC], MsgConstants.ACC_SUSP_SUCC), // Account suspended successfully."
                                    }
                                    device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_SUSPENDED)
                                    require("../../bin/www").sendDeviceStatus(resquery[0].device_id, "suspended");
                                    res.send(data);
                                }
                            })



                        }

                    });

                } else {

                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.NOT_SUSP_ACC_EXP], MsgConstants.NOT_SUSP_ACC_EXP), // Can't suspend !!! Account Already Expired."
                    }
                    res.send(data);
                }
            }

        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEVICE], MsgConstants.INVALID_DEVICE), // Invalid Device."
            }
            res.send(data);
        }
    }

}


exports.activateDevice =  async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format('Y-m-d H:M:S');

    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        
        var sql2 = "select * from usr_acc where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        if (!empty(device_id)) {

            if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null) {

                var sql1 = "update usr_acc set account_status='' where device_id = '" + device_id + "'";

                var rest = sql.query(sql1, async function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    if (results.affectedRows == 0) {
                        data = {
                            "status": false,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_ACTIV], MsgConstants.DEVICE_NOT_ACTIV), // Device not activated.Please try again."
                        }
                    } else {
                        sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                            if (error) {
                                console.log(error);
                            }
                            console.log('lolo else', resquery[0])

                            if (resquery.length) {
                                resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                                resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                                resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                                resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                                // dealerData = await getDealerdata(res[i]);
                                require("../bin/www").sendDeviceStatus(resquery[0].device_id, "active", true);
                                data = {
                                    "data": resquery[0],
                                    "status": true,
                                    "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_ACTIV_SUCC], MsgConstants.DEVICE_ACTIV_SUCC), // Device activated successfully.
                                }
                                device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_ACTIVATED)
                                res.send(data);

                            }
                        })

                    }

                });

            } else {

                if (gtres[0].expiry_date > formatted_dt) {

                    var sql1 = "update usr_acc set account_status='' where device_id = '" + device_id + "'";

                    var rest = sql.query(sql1, async function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        if (results.affectedRows == 0) {
                            data = {
                                "status": false,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_ACTIV], MsgConstants.DEVICE_NOT_ACTIV), // Device not activated.Please try again."
                            }
                        } else {
                            sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                console.log('lolo else', resquery[0])

                                if (resquery.length) {
                                    resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                                    resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                                    resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                                    resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                                    // dealerData = await getDealerdata(res[i]);
                                    require("../../bin/www").sendDeviceStatus(resquery[0].device_id, "active", true);
                                    data = {
                                        "data": resquery[0],
                                        "status": true,
                                        "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_ACTIV_SUCC], MsgConstants.DEVICE_ACTIV_SUCC), // Device activated successfully."
                                    }
                                    device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_ACTIVATED)
                                    res.send(data);

                                }
                            })

                        }

                    });

                } else {

                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_ACTIV_EXP], MsgConstants.DEVICE_NOT_ACTIV_EXP), // Device cannnot be activated.It is expired already.
                    }
                    res.send(data);
                }
            }

        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEVICE], MsgConstants.INVALID_DEVICE), // Invalid Device."
            }
            res.send(data);
        }
    }

}

exports.wipeDevice = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
    var device_id = req.params.id;
    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        var sql2 = "select * from devices where id = '" + device_id + "'";
        var gtres = await sql.query(sql2);
        if (!empty(device_id)) {

            var sql1 = "update usr_acc set wipe_status='wipe' where device_id = '" + device_id + "'";

            var rest = sql.query(sql1, async function (error, results) {
                if (error) {
                    console.log(error)
                }
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_WIPE], MsgConstants.DEVICE_NOT_WIPE), // Device not wiped.Please try again.
                    }
                    res.send(data);
                } else {
                    require("../bin/www").sendDeviceStatus(gtres[0].device_id, Constants.DEVICE_WIPE);

                    sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                        if (error) {
                            console.log(error);
                        }
                        // console.log('lolo else', resquery[0])

                        if (resquery.length) {
                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                            resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                            resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                            resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                            // dealerData = await getDealerdata(res[i]);

                            device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_WIPE)
                            data = {
                                "data": resquery[0],
                                "status": true,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_WIPE_SUCC], MsgConstants.DEVICE_WIPE_SUCC), // Device Wiped successfully.
                            }
                            res.send(data);
                        }
                    })
                }
            });



        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEVICE], MsgConstants.INVALID_DEVICE), // Invalid Device."
            }
            res.send(data);
        }
    }
}


exports.unflagDevice = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
    var device_id = req.params.id;
    
    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        if (!empty(device_id)) {
            var sql1 = "update devices set flagged= 'Not flagged' where device_id='" + device_id + "'";
            var rest = sql.query(sql1, async function (error, results) {
                if (error) {
                    console.log(error);
                }
                else if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_UNFLAG], MsgConstants.DEVICE_NOT_UNFLAG), // Device not Unflagged.Please try again.
                    }
                    res.send(data);
                } else {
                    await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.device_id= "' + device_id + '"', async function (error, resquery, fields) {
                        if (error) {
                            console.log(error);
                        }
                        console.log('lolo else', resquery[0])

                        if (resquery.length) {
                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                            resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                            resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                            resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                            // dealerData = await getDealerdata(res[i]);
                            data = {
                                // "data": resquery[0],
                                "status": true,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_UNFLAG_SUCC], MsgConstants.DEVICE_UNFLAG_SUCC), // Device Unflagged successfully.
                            }
                        }
                        device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_UNFLAGGED)
                        res.send(data);
                    })

                }
            });

        }

    } else {

        data = {
            "status": false,
            "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_UNFLAG], MsgConstants.DEVICE_NOT_UNFLAG), // Device Is not unflagged.Please try again"
        }
        res.send(data);
    }
}


exports.flagDevice = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
    var device_id = req.params.id;
    var option = req.body.data
    // console.log(option);
  
    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        var sql2 = "select * from devices where id = '" + device_id + "'";
        var gtres = await sql.query(sql2);
        if (!empty(device_id)) {

            if (gtres[0].flagged === '' || gtres[0].flagged === 'null' || gtres[0].flagged === null || gtres[0].flagged === 'Not flagged') {
                var sql1 = "update devices set flagged='" + option + "' where id = '" + device_id + "'";
                console.log(sql1);
                await sql.query(sql1)
                var sql1 = "update usr_acc set account_status='suspended' where device_id = '" + device_id + "'";

                let results = await sql.query(sql1)
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FLAG], MsgConstants.DEVICE_NOT_FLAG), // Device not Flagged.Please try again."
                    }
                } else {
                    require("../bin/www").sendDeviceStatus(gtres[0].device_id, "suspended");

                    let resquery = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"')
                    // console.log('lolo else', resquery)
                    // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"');
                    if (resquery.length) {
                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                        resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                        resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                        resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                        // dealerData = await getDealerdata(res[i]);
                        device_helpers.saveActionHistory(resquery[0], Constants.DEVICE_FLAGGED)
                        // console.log(resquery[0]);
                        data = {
                            "data": resquery[0],
                            "status": true,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_FLAG_SUCC], MsgConstants.DEVICE_FLAG_SUCC), // Device Flagged successfully."
                        }

                        res.send(data);
                    }
                }

            } else {
                data = {
                    "status": false,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.DEVICE_ALRDY_FLAG], MsgConstants.DEVICE_ALRDY_FLAG), // Device Already Flagged
                }
                res.send(data);
            }

        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEVICE], MsgConstants.INVALID_DEVICE), // Invalid Device."
            }
            res.send(data);
        }
    }
}



/** Get Device Details of Dealers (Connect Page) **/
exports.connectDevice = async function (req, res) {
    // console.log('api check is caled')
    var verify = req.decoded // await verifyToken(req, res);
  
    // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
        if (!empty(req.params.device_id)) {
            let userId = verify.user.id;
            //  console.log(verify.user);
            let usertype = await helpers.getUserType(userId);
            let where = "devices.device_id = '" + req.params.device_id + "'";

            if (usertype != ADMIN) {
                where = where + " and (usr_acc.dealer_id=" + userId + " OR usr_acc.prnt_dlr_id = " + userId + ")";
            }
            // console.log("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id where " + where);
            await sql.query("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id where " + where, async function (error, results) {

                if (error) {
                    console.log(error);
                }
                // console.log('rslt done', results);
                if (results.length == 0) {
                    _data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DETAIL_FOUND], MsgConstants.NO_DETAIL_FOUND), // No details found
                    };
                } else {
                    var query = "select * from dealers where dealer_id =" + results[0].dealer_id;
                    let dealer_details = await sql.query(query);
                    device_data = results[0]
                    device_data.finalStatus = device_helpers.checkStatus(results[0]);
                    device_data.pgp_email = await device_helpers.getPgpEmails(results[0]);
                    device_data.sim_id = await device_helpers.getSimids(results[0]);
                    device_data.chat_id = await device_helpers.getChatids(results[0]);

                    if (dealer_details.length) {
                        device_data.link_code = dealer_details[0].link_code;
                        device_data.dealer_name = dealer_details[0].dealer_name;
                    } else {
                        device_data.link_code = 0;
                        device_data.dealer_name = "";
                    }

                    _data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // success
                        data: device_data
                    };
                }

                res.send(_data);
            });
        } else {
            _data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FOUND], MsgConstants.DEVICE_NOT_FOUND), // Device not found
            };
        }
        res.send(_data);
    }
}


exports.getAppJobQueueOfDevice =  async function (req, res) {
    // console.log('api check is caled')
    var verify = req.decoded // await verifyToken(req, res);
   
        if (verify) {
        let device_id = req.params.device_id;
        if (!empty(device_id)) {

            let jobQueue = await device_helpers.getAppJobQueue(device_id);
            _data = {
                status: true,
                data: jobQueue.data,
                type: jobQueue.type
            };
        } else {
            _data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FOUND], MsgConstants.DEVICE_NOT_FOUND), // Device not found"
            };
        }
        res.send(_data);
    }
}


exports.resyncDevice = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
   
        if (verify) {
        let deviceId = req.body.device_id;
        if (!empty(deviceId)) {
            let query = "SELECT * FROM devices WHERE device_id = '" + deviceId + "' and online = '" + Constants.DEVICE_ONLINE + "'";
            sql.query(query, async function (error, response) {
                if (error) console.log(error);
                if (response.length) {
                    require("../bin/www").syncDevice(deviceId);
                }
                res.send({
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_SYNC_SUCC], MsgConstants.DEVICE_SYNC_SUCC), // device synced successfully
                })
            });
        }
    }
}


exports.getAppsOfDevice =  async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
   
        if (verify) {
        if (!empty(req.params.device_id)) {
            // var query = 'SELECT user_apps.*, apps_info.label, apps_info.unique_name as uniqueName, apps_info.icon as icon from user_apps LEFT JOIN apps_info on user_apps.app_id = apps_info.id LEFT JOIN devices on user_apps.device_id=devices.id where devices.device_id ="' + req.params.device_id + '"';
            // console.log(query);
            var getAppsQ = "SELECT user_apps.id, user_apps.device_id, user_apps.app_id, user_apps.guest, user_apps.encrypted, user_apps.`enable`, " +
                " apps_info.label,apps_info.default_app,apps_info.visible, apps_info.unique_name as uniqueName, apps_info.icon as icon , apps_info.extension, apps_info.extension_id" +
                " FROM user_apps" +
                " LEFT JOIN apps_info on user_apps.app_id = apps_info.id" +
                " LEFT JOIN devices on user_apps.device_id=devices.id" +
                " WHERE devices.device_id = '" + req.params.device_id + "'"
            // console.log("get apps query", getAppsQ);
            try {
                sql.query(getAppsQ, async (error, apps) => {
                    if (error) {
                        throw Error("Query Expection");
                    }
                    // console.log('app list is ', apps);
                    let Extension = [];
                    let onlyApps = [];
                    let settings = [];
                    for (let item of apps) {
                        let subExtension = [];
                        // console.log("extenstion id", item.extension_id);
                        if (item.extension === 1 && item.extension_id === 0) {

                            Extension.push(item);
                        }
                        if (item.extension == 0 && item.visible == 1) {
                            onlyApps.push(item)
                        }
                        if (item.visible == 0) {

                            settings.push(item)
                        }
                    }

                    // console.log(onlyApps, 'onlu apps')

                    let newExtlist = [];
                    for (let ext of Extension) {
                        let subExtension = [];

                        for (let item of apps) {
                            // console.log(ext.app_id, ' ', item.visible);
                            if (ext.app_id === item.extension_id) {
                                //  console.log(ext.uniqueName);
                                subExtension.push({
                                    uniqueName: ext.uniqueName,
                                    uniqueExtension: item.uniqueName,
                                    guest: item.guest != undefined ? item.guest : 0,
                                    label: item.label,
                                    icon: item.icon,
                                    encrypted: item.encrypted != undefined ? item.encrypted : 0,
                                    id: item.id,
                                    device_id: item.device_id,
                                    app_id: item.app_id,
                                    default_app: item.default_app
                                });
                            }
                        }

                        // console.log('subextensiondsf ', subExtension)

                        newExtlist.push({
                            uniqueName: ext.uniqueName,
                            guest: ext.guest != undefined ? ext.guest : 0,
                            encrypted: ext.encrypted != undefined ? ext.encrypted : 0,
                            enable: ext.enable != undefined ? ext.enable : 0,
                            label: ext.label,
                            subExtension: subExtension,
                            visible: ext.visible,
                            default_app: ext.default_app,
                            extension: ext.extension

                        })
                    }
                    // console.log("apps length" + apps.length);
                    var query1 = 'SELECT * from user_app_permissions where device_id ="' + req.params.device_id + '" limit 1';
                    // 
                    sql.query(query1, async (error, controls) => {
                        if (error) {
                            throw Error("Query Expection");
                        }
                        if (controls.length > 0) {
                            // console.log("geting device app");
                            let cntrls = JSON.parse(controls[0].permissions);
                            //    consrols.push(settings);
                            res.send({
                                status: true,
                                app_list: onlyApps,
                                controls: { controls: cntrls, settings: settings },
                                extensions: newExtlist
                            });

                        } else {
                            res.send({
                                status: true,
                                app_list: onlyApps,
                                controls: controls,
                                extensions: newExtlist
                            });
                        }
                    });

                });

            } catch (error) {
                console.error(error);

            }

        }
    }
}


exports.deleteUnlinkDevice = async function (req, res) {
    try {
        var verify = req.decoded // await verifyToken(req, res);
        
            if (verify) {

            let insertError = 0;
            let NotDeleted = [];
            let deletedDevices = [];
            let action = req.body.action
            console.log(req.body.devices, 'devicess sdf sd');
            // console.log('data for delte ', req.body.devices);
            for (let device of req.body.devices) {
                if (action == 'unlink') {
                    let deleteq = "UPDATE acc_action_history SET del_status='1' WHERE id='" + device.id + "' AND dealer_id = '" + verify.user.id + "' AND (action = 'UNLINKED' OR action = 'PRE-ACTIVATED')";
                    console.log('query is ', deleteq)
                    let resp = await sql.query(deleteq)
                    if (resp.affectedRows) {
                        deletedDevices.push(device.id);

                    }
                } else if (action == 'pre-active') {
                    let statusChangeQuery = "UPDATE usr_acc SET del_status='" + 1 + "' WHERE device_id='" + device.usr_device_id + "'";
                    // console.log(statusChangeQuery);
                    let resp = await sql.query(statusChangeQuery)
                    // console.log('response query is', resp);
                    if (resp.affectedRows) {
                        if (action == 'pre-active') {
                            await sql.query("UPDATE pgp_emails set user_acc_id = null , used = 0 where pgp_email ='" + device.pgp_email + "'")
                            await sql.query("UPDATE chat_ids set user_acc_id = null , used = 0 where chat_id ='" + device.chat_id + "'")
                            await sql.query("UPDATE sim_ids set user_acc_id = null , used = 0 where sim_id ='" + device.sim_id + "'")
                        }
                        deletedDevices.push(device.id);
                        // console.log('status Updated');
                        let deleteHistoryQuery = "UPDATE acc_action_history SET del_status='1' WHERE user_acc_id='" + device.id + "' AND dealer_id = '" + verify.user.id + "' AND (action = 'UNLINK' OR action = 'PRE-ACTIVATED')";
                        // console.log(deleteHistoryQuery);
                        await sql.query(deleteHistoryQuery)
                        // await device_helpers.saveActionHistory(device, Constants.UNLINK_DEVICE_DELETE);

                    }
                    else {
                        insertError += 1;
                        NotDeleted.push(device.id)
                    }
                }

            }

            if (insertError === 0) {
                data = {
                    'status': true,
                    'msg': await helpers.convertToLang(req.translation[MsgConstants.DEVICE_DEL_SUCC], MsgConstants.DEVICE_DEL_SUCC), // Deleted Successfully',
                    'data': deletedDevices
                }
                res.send(data);
            }
            else {

                data = {
                    'status': false,
                    'msg': NotDeleted.toString() + await helpers.convertToLang(req.translation[MsgConstants.NOT_DELETE], MsgConstants.NOT_DELETE),
                }
                res.send(data);
            }
        }


    } catch (error) {
        console.log(error)
    }
}


exports.applySettings = async function (req, res) {
    try {
        var verify = req.decoded // await verifyToken(req, res);
        // if (verify.status !== undefined && verify.status == true) {
            if (verify) {
            let device_id = req.params.device_id;

            let usrAccId = req.body.usr_acc_id;
            let type = req.body.device_setting.type

            let dealer_id = verify.user.id

            let device_setting = req.body.device_setting;

            let app_list = (device_setting.app_list === undefined) ? '' : JSON.stringify(device_setting.app_list);

            let passwords = (device_setting.passwords === undefined) ? '' : JSON.stringify(device_setting.passwords);

            let controls = (req.body.device_setting.controls == undefined) ? '' : JSON.stringify(req.body.device_setting.controls);
            // console.log("hello controls", controls);
            let subExtensions = (req.body.device_setting.subExtensions == undefined) ? '' : JSON.stringify(req.body.device_setting.subExtensions);
            let applyQuery = '';
            if (type == 'profile') {

                applyQuery = "insert into device_history (device_id,dealer_id,user_acc_id, profile_name,app_list, passwords, controls, permissions, type) values ('" + device_id + "'," + dealer_id + "," + usrAccId + ",'" + device_setting.name + "' , '" + app_list + "', '" + passwords + "', '" + controls + "', '" + subExtensions + "' , 'profile')";
            } else {
                applyQuery = "insert into device_history (device_id,dealer_id,user_acc_id, app_list, passwords, controls, permissions) values ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + app_list + "', '" + passwords + "', '" + controls + "', '" + subExtensions + "')";
            }

            await sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log(err);
                }

                let isOnline = await device_helpers.isDeviceOnline(device_id);
                let permissions = subExtensions;

                if (isOnline) {
                    require("../bin/www").sendEmit(app_list, passwords, controls, permissions, device_id);
                }

                if (rslts) {
                    if (type == 'profile') {
                        data = {
                            "status": true,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.PROFILE_APPLIED_SUCCESSFULLY], MsgConstants.PROFILE_APPLIED_SUCCESSFULLY), // Profile Applied Successfully
                        };
                        res.send(data);
                    }
                    else {
                        data = {
                            "status": true,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.SETTINGS_APPLIED_SUCCESSFULLY], MsgConstants.SETTINGS_APPLIED_SUCCESSFULLY), // Settings Applied Successfully',
                        };
                        res.send(data);
                    }
                } else {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], MsgConstants.ERROR_PROC), // Error while Processing',
                    };
                    res.send(data);
                }

            });

        }
    } catch (error) {
        console.log(error)
    }

}

exports.applyPushApps =  async function (req, res) {
    try {
        var verify = req.decoded // await verifyToken(req, res);
        // if (verify.status !== undefined && verify.status == true) {
            if (verify) {
            let device_id = req.params.device_id;

            let dealer_id = verify.user.id

            let usrAccId = req.body.usrAccId;

            let push_apps = req.body.push_apps;
            let noOfApps = push_apps.length

            let apps = (push_apps === undefined) ? '' : JSON.stringify(push_apps);

            var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, push_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + apps + "', 'push_apps')";

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log(err);
                }
                if (rslts) {
                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    //job Queue query
                    var loadDeviceQ = "INSERT INTO apps_queue_jobs (device_id,action,type,total_apps,is_in_process) " + " VALUES ('" + device_id + "', 'push', 'push', " + noOfApps + " ,1)"
                    // var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                    await sql.query(loadDeviceQ)

                    if (isOnline) {

                        require("../bin/www").applyPushApps(apps, device_id);
                        data = {
                            "status": true,
                            "online": true,
                            noOfApps: noOfApps
                        };
                    }
                    else {
                        require("../bin/www").applyPushApps(apps, device_id);
                        data = {
                            "status": true,
                            noOfApps: noOfApps
                        };
                    }
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], MsgConstants.ERROR_PROC), // Error while Processing',
                    };
                    res.send(data);
                }

            });

        }
    } catch (error) {
        console.log(error)
    }
}

exports.applyPullApps =  async function (req, res) {
    try {
        var verify = req.decoded // await verifyToken(req, res);
        // if (verify.status !== undefined && verify.status == true) {
            if (verify) {
            let device_id = req.params.device_id;

            let usrAccId = req.body.usrAccId;

            let dealer_id = verify.user.id
            let pull_apps = req.body.pull_apps;
            let noOfApps = pull_apps.length

            let apps = (pull_apps === undefined) ? '' : JSON.stringify(pull_apps);

            var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, pull_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + apps + "', 'pull_apps')";

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log(err);
                }
                if (rslts) {

                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    var loadDeviceQ = "INSERT INTO apps_queue_jobs (device_id,action,type,total_apps,is_in_process) " + " VALUES ('" + device_id + "', 'pull', 'pull', " + noOfApps + " ,1)"
                    // var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                    await sql.query(loadDeviceQ)
                    if (isOnline) {
                        data = {
                            "status": true,
                            "online": true,
                            noOfApps: noOfApps
                        };
                    } else {
                        data = {
                            "status": true,
                            noOfApps: noOfApps
                        };
                    }
                    res.send(data);
                    require("../bin/www").getPullApps(apps, device_id);
                } else {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], MsgConstants.ERROR_PROC), // Error while Processing',
                    };
                    res.send(data);
                }

            });

        }
    } catch (error) {
        console.log(error)
    }
}



exports.getDeviceHistory = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
        if(verify) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);

        let where = " WHERE ";

        if (user_acc_id != undefined && user_acc_id != '' && user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

            let query = "SELECT * FROM device_history " + where;
            sql.query(query, async function (error, result) {
                data = {
                    "status": true,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // successful',
                    "profiles": result
                };
                res.send(data);
            });

        } else {
            where = "";
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], MsgConstants.INVALID_USER), // Invalid User'
            };
            res.send(data);
        }
    }

}


exports.writeIMEI =  async function (req, res) {
    try {
        var verify = req.decoded // await verifyToken(req, res);
        
            if (verify) {
            let device_id = req.params.device_id;
            let usrAccId = req.body.usrAccId;
            let dealer_id = verify.user.id
            let type = req.body.type;
            let imeiNo = req.body.imeiNo;
            let device = req.body.device

            let imei = await device_helpers.checkvalidImei(imeiNo)
            if (imei) {
                let imei1 = (type == 'IMEI1') ? imeiNo : null
                let imei2 = (type == 'IMEI2') ? imeiNo : null

                let query = "SELECT * from device_history WHERE user_acc_id = '" + usrAccId + "' AND type = 'imei' AND status = 0 order by created_at desc limit 1"

                let result = await sql.query(query);
                if (result.length) {
                    let prevImei = JSON.parse(result[0].imei)
                    // console.log(prevImei);
                    if (type == 'IMEI1') {
                        prevImei.imei1 = imei1
                    }
                    else {
                        prevImei.imei2 = imei2
                    }
                    let newImei = JSON.stringify(prevImei)
                    sql.query("INSERT INTO device_history (device_id,dealer_id,user_acc_id, imei, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + newImei + "', 'imei')", async function (err, results) {
                        if (err) {
                            console.log(err)
                        }

                        if (results.affectedRows) {
                            var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                            await sql.query(loadDeviceQ)
                            let isOnline = await device_helpers.isDeviceOnline(device_id);
                            if (isOnline) {
                                require("../bin/www").writeImei(newImei, device_id);
                                data = {
                                    "status": true,
                                    'online': true,
                                    // 'insertedData': insertedData
                                };
                                res.send(data);
                            } else {
                                data = {
                                    "status": true,
                                    // 'insertedData': insertedData
                                };
                                res.send(data);
                            }

                        } else {
                            data = {
                                "status": false,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], MsgConstants.ERROR_PROC), // Error while Processing',
                            };
                            res.send(data);
                        }

                    })
                } else {
                    let imei = {
                        imei1: imei1,
                        imei2: imei2
                    }
                    let newImei = JSON.stringify(imei)
                    var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, imei, type) VALUES ('" + device_id + "'," + dealer_id + "," + usrAccId + ", '" + newImei + "', 'imei')";

                    sql.query(applyQuery, async function (err, rslts) {
                        if (err) {
                            console.log(err)
                        }

                        if (rslts) {
                            // var applyPushQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                            // await sql.query(applyPushQ)
                            let isOnline = await device_helpers.isDeviceOnline(device_id);
                            if (isOnline) {
                                require("../bin/www").writeImei(newImei, device_id);
                                data = {
                                    "status": true,
                                    'online': true,
                                    // 'insertedData': insertedData
                                };
                                res.send(data);
                            } else {
                                data = {
                                    "status": true,
                                    'online': false,
                                    // 'insertedData': insertedData
                                };
                                res.send(data);
                            }
                        } else {
                            data = {
                                "status": false,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], MsgConstants.ERROR_PROC), // Error while Processing',
                            };
                            res.send(data);
                        }
                    });
                }
            } else {
                data = {
                    "status": false,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_IMEI_NUMBER], MsgConstants.INVALID_IMEI_NUMBER), // Invalid IMEI number, please make sure you are using a valid IMEI number and try again",
                };
                res.send(data);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getActivities = async function (req, res) {
    try {
        var verify = req.decoded // await verifyToken(req, res);
        
            if (verify) {

            let device_id = req.params.device_id
            let activities = [];
            let usrAccId = await device_helpers.getUserAccByDeviceId(device_id)
            // 'DELETE','SUSPENDED','UNLINKED','EXPIRED','ACTIVE','FLAGGED','UNFLAGGED','TRANSFER','Pre-activated','wiped'
            let acc_action_query = "SELECT * FROM acc_action_history WHERE device_id = '" + device_id + "'"
            let accResults = await sql.query(acc_action_query)
            let device_history_query = "SELECT * FROM device_history WHERE user_acc_id = '" + usrAccId.id + "'"
            let deviceResults = await sql.query(device_history_query)

            let action;
            for (let i = 0; i < accResults.length; i++) {
                if (accResults[i].action == Constants.DEVICE_PENDING_ACTIVATION || accResults[i].action == Constants.DEVICE_PRE_ACTIVATION || accResults[i].action === Constants.DEVICE_EXPIRED || accResults[i].action == 'DELETE') {
                    continue
                } else {
                    action = {
                        "action_name": await helpers.getActivityName(accResults[i].action),
                        "created_at": accResults[i].created_at
                    }
                    activities.push(action)
                }
            }
            for (let i = 0; i < deviceResults.length; i++) {
                action = {
                    "action_name": await helpers.getActivityName(deviceResults[i].type),
                    "data": deviceResults[i],
                    "created_at": deviceResults[i].created_at
                }
                activities.push(action)
            }
            // console.log(activities);
            data = {
                "status": true,
                "data": activities
            };
            res.send(data);
        }
    } catch (error) {
        console.log(error);
    }
}


exports.getIMEI_History =   async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
 
    if (verify){
        let query = "select * from imei_history where device_id = '" + req.params.device_id + "'";
        sql.query(query, async function (error, resp) {
            res.send({
                status: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], MsgConstants.ACCESS_FORBIDDEN), // "access forbidden"
        })
    }

}