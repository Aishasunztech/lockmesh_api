const { sql } = require('../../config/database');
const multer = require('multer');
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var XLSX = require('xlsx');
var empty = require('is-empty');
const axios = require('axios');
var moment = require('moment-strftime');
var randomize = require('randomatic');
var moment = require('moment-strftime');

const constants = require('../../constants/Application');
var MsgConstants = require('../../constants/MsgConstants');

const device_helpers = require('../../helper/device_helpers');
const general_helpers = require('../../helper/general_helper');
const verifyToken = require('../../config/auth');
const { sendEmail } = require('../../lib/email');

const app_constants = require('../../config/constants');

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
//             msg: await helpers.convertToLang(loggedInuid, MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "No data found",
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
//                 msg: await helpers.convertToLang(loggedInuid, MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "No data found"
//             })
//         }
//         if (updateQ != '') {
//             console.log('deviceStatus update query is: ', updateQ);
//             await sql.query(updateQ, async function (err, rslts) {
//                 if (err) {
//                     console.log(err);
//                     res.send({
//                         status: false,
//                         msg: await helpers.convertToLang(loggedInuid, MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Error occur"
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
//                                 msg: await helpers.convertToLang(loggedInuid, MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Error occur"
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
//                                 msg: await helpers.convertToLang(loggedInuid, MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Offline Device Status Successfully Updated!"
//                             })
//                         } else {
//                             res.send({
//                                 status: false,
//                                 devices: [],
//                                 msg: await helpers.convertToLang(loggedInuid, MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Failed to update Offline Device Status!",
//                             })
//                         }
//                     });

//                 }

//             });
//         } else {
//             res.send({
//                 status: false,
//                 msg: await helpers.convertToLang(loggedInuid, MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "Query not run"
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         res.send({
//             status: false,
//             msg: await helpers.convertToLang(loggedInuid, MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND), // "exception for deviceStatus",
//         });
//         return;
//     }

// }


// /**GET New the devices**/
exports.newDevices = async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {

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
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let user_id = req.body.user_id;

        let userData = await general_helpers.getUserDataByUserId(user_id);

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
            var expiry_date = general_helpers.getExpDateByMonth(start_date, exp_month);
        }

        if (!empty(usr_device_id)) {

            var checkDevice = `SELECT * FROM devices LEFT JOIN usr_acc ON (usr_acc.device_id = devices.id) WHERE devices.device_id = '${device_id}' `;

            let checkDealer = "SELECT * FROM dealers where dealer_id =" + dealer_id;
            let dealer = await sql.query(checkDealer);

            // let connected = await sql.query(checkConnectedDealer);
            if (loggedDealerType === constants.SDEALER) {
                checkDevice = checkDevice + " AND usr_acc.dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === constants.DEALER) {
                checkDevice = checkDevice + " AND (usr_acc.dealer_id =" + loggedDealerId + " OR usr_acc.prnt_dlr_id =" + loggedDealerId + ") ";
            } else if (loggedDealerType === constants.ADMIN) {
                checkDevice = checkDevice;
            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(loggedDealerId, MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
                });
                return;
            }

            sql.query(checkDevice, async function (checkDeviceError, rows) {
                if (checkDeviceError) {
                    console.log(checkDeviceError)
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(loggedDealerId, MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
                    });
                    return;
                }

                if (rows.length) {

                    let checkUniquePgp = `SELECT pgp_email FROM pgp_emails WHERE (pgp_email= '${pgp_email}' AND used=1)`;
                    let checkDevicepgp = await sql.query(checkUniquePgp);

                    let checkUnique = `SELECT usr_acc.* FROM usr_acc WHERE account_email= '${device_email}' AND device_id != '${device_id}' AND user_id != '${user_id}'`
                    sql.query(checkUnique, async (checkUniqueEror, success) => {
                        if (checkUniqueEror) {
                            console.log(checkUniqueEror)
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(loggedDealerId, MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
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
                                if (commonQueryError) {
                                    console.log(commonQueryError);
                                    res.send({
                                        status: false,
                                        msg: await helpers.convertToLang(loggedDealerId, MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
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
                                    msg: "Record updated successfully.", // 'Record updated successfully.',
                                    data: rsltq
                                };
                                res.send(data);
                                return;
                            });
                            return;
                        } else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(loggedDealerId, MsgConstants.NEW_DEVICE_NOT_ADDED), // "device is not added"
                            });
                            return;
                        }
                    });
                    return;
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(loggedDealerId, MsgConstants.NEW_DEVICE_NOT_ADDED), // "New Device Not Added Please try Again"
                    });
                    return;
                }
            });
            return;
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(loggedDealerId, MsgConstants.NEW_DEVICE_NOT_ADDED), // "Device Not Added Try Again"
            });
            return;
        }
    }
}

exports.createPreactivations = async function (req, res) {
    // res.setHeader('Content-Type', 'application/json');
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        // var dataStag = [];
        var code = randomize('0', 7);
        var activation_code = await general_helpers.checkActivationCode(code);
        var client_id = req.body.client_id;
        var chat_id = req.body.chat_id ? req.body.chat_id : '';
        var model = req.body.model;
        var user_id = req.body.user_id;

        let userData = await general_helpers.getUserDataByUserId(user_id)

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
            var expiry_date = general_helpers.getExpDateByMonth(start_date, exp_month);
        }

        var exp_month = req.body.expiry_date;
        var dealer_id = verify.user.dealer_id;
        var sim_id = req.body.sim_id ? req.body.sim_id : '';
        var loggedUserId = verify.user.id;
        var loggedUserType = verify.user.type;
        let policy_id = req.body.policy_id ? req.body.policy_id : '';
        if (loggedUserType === constants.ADMIN) {
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
                    var activationCode = await general_helpers.checkActivationCode(code);
                    activationCodes.push(activationCode);

                    let chat_id = (chat_ids[i]) ? chat_ids[i].chat_id : null;
                    let sim_id = (sim_ids[i]) ? sim_ids[i].sim_id : null;
                    let pgp_email = (pgp_emails[i]) ? pgp_emails[i].pgp_email : null;

                    var insertDevice = `INSERT INTO devices (name) VALUES ('${name}')`;
                    let resp = await sql.query(insertDevice)

                    let dvc_id = resp.insertId;
                    deviceIds.push(dvc_id);
                    var insertUser_acc = "INSERT INTO usr_acc (device_id , user_id,batch_no, activation_code, expiry_months, dealer_id,link_code, device_status, activation_status, expiry_date, note, validity,account_email, account_name "
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
                await device_helpers.saveActionHistory(rsltq[i], constants.DEVICE_PRE_ACTIVATION);
            }
            data = {
                status: true,
                msg: 'Pre-activations added succcessfully.Email sends to your account.',
                data: rsltq
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
                                            device_helpers.saveActionHistory(results[0], constants.DEVICE_PRE_ACTIVATION)
                                            data = {
                                                "status": true,
                                                "msg": 'Pre-activation added succcessfully.',
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
                                        res.send({
                                            status: false,
                                            msg: "Device couldn't added"
                                        });
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