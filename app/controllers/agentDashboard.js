// Libraries
const multer = require('multer');
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var XLSX = require('xlsx');
var empty = require('is-empty');
const axios = require('axios');
var moment = require('moment-strftime');
var randomize = require('randomatic');
var datetime = require('node-datetime');
var generator = require('generate-password');
const bcrypt = require('bcrypt-nodejs');

// custom Libraries
const { sendEmail } = require('../../lib/email');
const sockets = require('../../routes/sockets');

// helpers
const { sql } = require('../../config/database');
const device_helpers = require('../../helper/device_helpers');
const helpers = require('../../helper/general_helper');
const socket_helpers = require('../../helper/socket_helper');


// constants
const constants = require('../../constants/Application');
var MsgConstants = require('../../constants/MsgConstants');
const app_constants = require('../../config/constants');

// constants
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id, usr_acc.account_email, usr_acc.account_name, usr_acc.dealer_id, usr_acc.dealer_id, usr_acc.prnt_dlr_id, usr_acc.link_code, usr_acc.client_id, usr_acc.start_date, usr_acc.expiry_months, usr_acc.expiry_date, usr_acc.activation_code, usr_acc.status, usr_acc.device_status, usr_acc.activation_status, usr_acc.account_status, usr_acc.unlink_status, usr_acc.transfer_status, usr_acc.dealer_name, usr_acc.prnt_dlr_name, usr_acc.del_status, usr_acc.note, usr_acc.validity, usr_acc.batch_no, usr_acc.type, usr_acc.version"
let usr_acc_query_text = constants.usr_acc_query_text;
var data;


/**GET all the devices**/
exports.devices = async function (req, res) {

    var verify = req.decoded; // await verifyToken(req, res);
    var where_con = '';
    let newArray = [];

    if (verify) {
        let dealer_type = verify.user.user_type;
        let dealer_id = verify.user.id;

        if (dealer_type !== constants.ADMIN) {
            if (dealer_type === constants.DEALER) {

                where_con = ` AND (usr_acc.dealer_id =${dealer_id} OR usr_acc.prnt_dlr_id = ${dealer_id})`;
                let userAccQ = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = ${dealer_id} AND del_status IS NULL`;
                newArray = await sql.query(userAccQ)
            } else {
                where_con = ` AND usr_acc.dealer_id = ${dealer_id} `;
                let userAccQ = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = ${dealer_id} AND del_status IS NULL`;
                newArray = await sql.query(userAccQ)
            }
        } else {
            let query = `SELECT * From acc_action_history WHERE action = 'UNLINKED'`;
            newArray = await sql.query(query)
        }

        sql.query(`SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers ON (usr_acc.dealer_id = dealers.dealer_id) WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0  ${where_con} ORDER BY devices.id DESC`, async function (error, results) {

            if (error) {
                console.log(error);
            }
            if (results.length) {

                let devices_acc_array = [];
                let usr_device_ids_array = []
                for (let i = 0; i < results.length; i++) {
                    devices_acc_array.push(results[i].id)
                    usr_device_ids_array.push(results[i].usr_device_id)
                }
                let user_acc_ids = devices_acc_array.join()
                let usr_device_ids = usr_device_ids_array.join()
                let pgp_emails = await device_helpers.getPgpEmails(user_acc_ids);
                let sim_ids = await device_helpers.getSimids(user_acc_ids);
                let chat_ids = await device_helpers.getChatids(user_acc_ids);
                // let loginHistoryData = await device_helpers.getLastLoginDetail(usr_device_ids)

                for (var i = 0; i < results.length; i++) {
                    let pgp_email = pgp_emails.find(pgp_email => pgp_email.user_acc_id === results[i].id);
                    if (pgp_email) {
                        results[i].pgp_email = pgp_email.pgp_email
                    }
                    let sim_idArray = sim_ids.filter(sim_id => sim_id.user_acc_id === results[i].id);
                    if (sim_idArray && sim_idArray.length) {
                        results[i].sim_id = sim_idArray[0].sim_id
                        results[i].sim_id2 = sim_idArray[1] ? sim_idArray[1].sim_id : "N/A"
                    }
                    let chat_id = chat_ids.find(chat_id => chat_id.user_acc_id === results[i].id);
                    if (chat_id) {
                        results[i].chat_id = chat_id.chat_id
                    }
                    // let lastOnline = loginHistoryData.find(record => record.device_id == results[i].usr_device_id);
                    // if (lastOnline) {
                        results[i].lastOnline = results[i].last_login ? results[i].last_login : "N/A"
                    // }
                    results[i].finalStatus = device_helpers.checkStatus(
                        results[i]
                    );
                    results[i].validity = await device_helpers.checkRemainDays(
                        results[i].created_at,
                        results[i].validity
                    );
                }
            }

            let finalResult = [...results, ...newArray]

            let checkValue = helpers.checkValue;
            for (let device of finalResult) {

                device.account_email = checkValue(device.account_email)
                device.firmware_info = checkValue(device.firmware_info)
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

            data = {
                status: true,
                // "data": newResultArray
                data: finalResult
            };
            res.send(data);
            return;
        });

    }
}

/**GET New the devices**/
exports.getNewDevices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
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
    if (verify) {
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
            if (loggedDealerType === constants.SDEALER) {
                checkDevice = checkDevice + " AND usr_acc.dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === constants.DEALER) {
                checkDevice = checkDevice + " AND (usr_acc.dealer_id =" + loggedDealerId + " OR usr_acc.prnt_dlr_id =" + loggedDealerId + ") ";
            } else if (loggedDealerType === constants.ADMIN) {
                checkDevice = checkDevice;
            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "New Device Not Added Please try Again"
                });
                return;
            }

            sql.query(checkDevice, async function (checkDeviceError, rows) {
                if (checkDeviceError) {
                    console.log(checkDeviceError)
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "New Device Not Added Please try Again"
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
                                msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "New Device Not Added Please try Again"
                            });
                            return;
                        }

                        if (success.length || checkDevicepgp.length) {
                            res.send({
                                status: false,
                                msg: "Account Email OR PGP Email already taken"
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
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "New Device Not Added Please try Again"
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
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], "Record updated successfully"), // 'Record updated successfully.',
                                    data: rsltq
                                };
                                res.send(data);
                                return;
                            });
                            return;
                        } else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "device is not added"
                            });
                            return;
                        }
                    });
                    return;
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "New Device Not Added Please try Again"
                    });
                    return;
                }
            });
            return;
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "Device Not Added Try Again"
            });
            return;
        }
    }
}

exports.deleteDevice = async function (req, res) {

    var verify = req.decoded // await verifyToken(req, res);

    if (verify) {
        if (!empty(req.params.device_id)) {
            let userType = verify.user.user_type;
            let loggedUserId = verify.user.id;
            let device_id = req.params.device_id;

            let where = '';

            if (userType === constants.DEALER) {
                where = ` AND (dealer_id=${loggedUserId} OR prnt_dlr_id = ${loggedUserId})`;
            } else if (userType === constants.SDEALER) {
                where = ' AND (dealer_id=' + loggedUserId;
            }

            let device = await helpers.getAllRecordbyDeviceId(device_id)

            if (device.dealer_id === loggedUserId || device.prnt_dlr_id === loggedUserId || userType === constants.ADMIN) {

                console.log("reject device:", device);
                // sql.query("DELETE from usr_acc  where device_id = " + usr_device_id, async function (error, results, fields) {
                //     // sql.query("UPDATE usr_acc set unlink_status = 1 WHERE device_id = '" + usr_device_id + "'")
                //     //response.end(JSON.stringify(rows));
                //     // console.log(results);
                //     if (error) {
                //         console.log(error);
                //     }
                //     if (results.affectedRows !== 0) {
                //         var sqlDevice = "DELETE from devices where device_id = '" + req.params.device_id + "'";
                //         sql.query(sqlDevice);
                //         data = {
                //             status: true,
                //             msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_DEL_SUCC], "Device deleted successfully"), // Device deleted successfully.
                //         };
                //     } else {
                //         data = {
                //             status: false,
                //             msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_DEL], "Device not deleted"), // Device not deleted.
                //             "fld": fields,
                //             "rdlt": results
                //         };
                //     }
                //     return res.send(data);
                // });
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_DEL], "Device not deleted"), // Device not deleted.
                };
                return res.send(data)
            }
        }
    }
}

exports.editDevices = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded // await verifyToken(req, res);

    if (verify) {

        if (!empty(req.body.usr_device_id)) {
            console.log(req.body);
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

            console.log(finalStatus);

            let sim_id = (req.body.sim_id == undefined) ? '' : req.body.sim_id;
            let chat_id = (req.body.chat_id == undefined) ? '' : req.body.chat_id;
            let pgp_email = (req.body.pgp_email == undefined) ? '' : req.body.pgp_email;

            var d = new Date(req.body.start_date);

            if (req.body.expiry_date === '' || req.body.expiry_date === null) {
                var status = 'expired';
            } else if (req.body.expiry_date == 0) {
                var status = 'trial';
            }
            else if (finalStatus === constants.DEVICE_PRE_ACTIVATION) {
                var status = ''
            }
            else if (finalStatus === constants.DEVICE_EXPIRED) {
                var status = 'expired';
            } else {
                var status = 'active';
            }


            var checkDevice = "SELECT start_date ,expiry_date from usr_acc WHERE device_id = '" + usr_device_id + "'";
            if (loggedDealerType === constants.SDEALER) {
                checkDevice = checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === constants.DEALER) {
                checkDevice = checkDevice + " AND (dealer_id = " + loggedDealerId + " OR prnt_dlr_id = " + loggedDealerId + " )";
            } else if (loggedDealerType === constants.ADMIN) {
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
                                msg: await helpers.convertToLang(req.translation[MsgConstants.PGP_EMAIL_ALRDY_TKN], "PGP email already taken"), // PGP email already taken
                            });
                        } else {

                            if (req.body.expiry_date == 0) {
                                if (finalStatus === constants.DEVICE_PRE_ACTIVATION || finalStatus === constants.DEVICE_TRIAL) {
                                    var expiry_date = req.body.expiry_date
                                }
                                else {
                                    let exp_month = req.body.expiry_date;
                                    var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
                                    var expiry_date = moment(trailDate).format("YYYY/MM/DD")
                                }
                            } else if (req.body.expiry_date === 1 || req.body.expiry_date === 3 || req.body.expiry_date === 6 || req.body.expiry_date === 12) {
                                let exp_month = req.body.expiry_date;
                                var expiry_date = helpers.getExpDateByMonth(rows[0].expiry_date, exp_month);
                                // console.log(expiry_date);
                                let currentDate = moment(new Date()).format("YYYY/MM/DD")
                                // console.log(currentDate, expiry_date);
                                if (currentDate < expiry_date) {
                                    // console.log(device);
                                    socket_helpers.sendDeviceStatus(sockets.baseIo, device_id, "active", true);
                                    status = 'active'
                                }
                            }
                            else {
                                var expiry_date = req.body.expiry_date
                            }


                            common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'";
                            if (finalStatus !== constants.DEVICE_PRE_ACTIVATION) {
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

                                if (finalStatus === constants.DEVICE_PRE_ACTIVATION) {
                                    if (pgp_email !== prevPGP) {
                                        let updatePrevPgp = 'update pgp_emails set user_acc_id = null,  used=0 where pgp_email ="' + prevPGP + '"';
                                        sql.query(updatePrevPgp)

                                    }
                                }

                                var slctquery = "select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id = '" + usr_device_id + "'";
                                // console.log(slctquery);
                                rsltq = await sql.query(slctquery);
                                // console.log(rsltq);
                                if (rsltq.length) {
                                    let devices_acc_array = [];
                                    for (let i = 0; i < rsltq.length; i++) {
                                        devices_acc_array.push(rsltq[i].id)
                                    }
                                    let user_acc_ids = devices_acc_array.join()
                                    let pgp_emails = await device_helpers.getPgpEmails(user_acc_ids);
                                    let sim_ids = await device_helpers.getSimids(user_acc_ids);
                                    let chat_ids = await device_helpers.getChatids(user_acc_ids);

                                    for (var i = 0; i < rsltq.length; i++) {
                                        let pgp_email = pgp_emails.find(pgp_email => pgp_email.user_acc_id === rsltq[i].id);
                                        if (pgp_email) {
                                            rsltq[i].pgp_email = pgp_email.pgp_email
                                        }
                                        let sim_idArray = sim_ids.filter(sim_id => sim_id.user_acc_id === rsltq[i].id);
                                        if (sim_idArray && sim_idArray.length) {
                                            rsltq[i].sim_id = sim_idArray[0].sim_id
                                            rsltq[i].sim_id2 = sim_idArray[1] ? sim_idArray[1].sim_id : "N/A"
                                        }
                                        let chat_id = chat_ids.find(chat_id => chat_id.user_acc_id === rsltq[i].id);
                                        if (chat_id) {
                                            rsltq[i].chat_id = chat_id.chat_id
                                        }
                                        rsltq[i].finalStatus = device_helpers.checkStatus(
                                            rsltq[i]
                                        );
                                    }
                                }

                                data = {
                                    status: true,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], "Record updated successfully"), // Record updated successfully.
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FOUND], "No Device found"), // No Device found
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

exports.unlinkDevice = async function (req, res) {
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
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_UNLNK], "Device not unlinked"), // Device not unlinked."
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

                    device_helpers.saveActionHistory(req.body.device, constants.DEVICE_UNLINKED)
                    socket_helpers.sendDeviceStatus(sockets.baseIo, dvcId, "unlinked", true);
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_UNLNK_SUCC], "Device unlinked successfully"), // Device unlinked successfully.
                    }
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_UNLNK], "Device not unlinked"), // Device not unlinked.
                    }
                }
                res.send(data);
                return;
            });

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEVICE_ID], "Invalid device id"), // Invalid device id.
            }
            res.send(data);
            return;
        }
    }
}

exports.suspendDevice = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);

    if (verify) {
        var device_id = req.params.id;

        if (!empty(device_id)) {
            var tod_dat = datetime.create();
            var formatted_dt = tod_dat.format('Y-m-d H:M:S');

            var userAccQ = `SELECT * FROM usr_acc WHERE device_id = ${device_id}`;
            var gtres = await sql.query(userAccQ);

            if (gtres.length) {


                var sql1 = `UPDATE usr_acc SET account_status='suspended' WHERE device_id = '${device_id}' `;
                // if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null) {


                //     sql.query(sql1, async function (error, results) {
                //         if (error) {
                //             console.log(error);
                //         }

                //         if (results && results.affectedRows === 0) {

                //             data = {
                //                 status: false,
                //                 msg: "Account not suspended.Please try again", // Account not suspended.Please try again.
                //             }
                //             return res.send(data);
                //         } else {

                //             sql.query('select devices.*, ' + usr_acc_query_text + ', dealers.dealer_name, dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery) {
                //                 if (error) {
                //                     console.log(error);
                //                 }

                //                 if (resquery.length) {
                //                     resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                //                     resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                //                     resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                //                     resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                //                     // dealerData = await getDealerdata(res[i]);
                //                     data = {
                //                         data: resquery[0],
                //                         status: true,
                //                         msg: await helpers.convertToLang(req.translation[MsgConstants.ACC_SUSP_SUCC], "Account suspended successfully"), // Account suspended successfully.
                //                     }
                //                     device_helpers.saveActionHistory(resquery[0], constants.DEVICE_SUSPENDED)
                //                     socket_helpers.sendDeviceStatus(sockets.baseIo, resquery[0].device_id, "suspended");


                //                     res.send(data);

                //                 }
                //             })

                //         }


                //     });

                // } else {

                if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null || gtres[0].expiry_date >= formatted_dt) {


                    sql.query(sql1, async function (error, results) {
                        if (error) {
                            data = {
                                status: false,
                                msg: "Device not suspended. Please try again", // Account not suspended.Please try again."
                            }
                            return res.send(data);
                        }

                        if (results.affectedRows == 0) {

                            data = {
                                status: false,
                                msg: "device not suspended. Please try again", // Account not suspended.Please try again."
                            }
                            return res.send(data);

                        } else {


                            sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                // console.log('lolo else', resquery[0])

                                if (resquery.length) {
                                    let pgp_emails = await device_helpers.getPgpEmails(results[0].id);
                                    let sim_ids = await device_helpers.getSimids(results[0].id);
                                    let chat_ids = await device_helpers.getChatids(results[0].id);
                                    results[0].finalStatus = device_helpers.checkStatus(results[0]);
                                    if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                        results[0].pgp_email = pgp_emails[0].pgp_email
                                    } else {
                                        results[0].pgp_email = "N/A"
                                    }
                                    if (sim_ids && sim_ids.length) {
                                        resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                        resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                    }
                                    if (chat_ids[0] && chat_ids[0].chat_id) {
                                        results[0].chat_id = chat_ids[0].chat_id
                                    }
                                    else {
                                        results[0].chat_id = "N/A"
                                    }
                                    // dealerData = await getDealerdata(res[i]);
                                    data = {
                                        data: resquery[0],
                                        status: true,
                                        msg: "Device suspended successfully", // Account suspended successfully."
                                    }
                                    device_helpers.saveActionHistory(resquery[0], constants.DEVICE_SUSPENDED)
                                    socket_helpers.sendDeviceStatus(sockets.baseIo, resquery[0].device_id, "suspended");
                                    return res.send(data);
                                }
                            })

                        }

                    });

                } else {

                    data = {
                        status: false,
                        msg: "Can't suspend !!! Device Already Expired", // Can't suspend !!! Account Already Expired."
                    }
                    return res.send(data);
                }
                // }
            } else {
                data = {
                    status: false,
                    msg: "Invalid Device", // Invalid Device."
                }
                return res.send(data);
            }

        } else {
            data = {
                status: false,
                msg: "Invalid Device", // Invalid Device."
            }
            return res.send(data);
        }
    }

}

exports.activateDevice = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);

    if (verify) {
        var device_id = req.params.id;

        if (!empty(device_id)) {
            var tod_dat = datetime.create();
            var formatted_dt = tod_dat.format('Y-m-d H:M:S');

            var userAccQ = `select * from usr_acc where device_id = '${device_id}'`;
            var gtres = await sql.query(userAccQ);
            if (gtres.length) {

                // if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null) {

                //     var sql1 = "update usr_acc set account_status='' where device_id = '" + device_id + "'";

                //     var rest = sql.query(sql1, async function (error, results) {
                //         if (error) {
                //             console.log(error);
                //         }
                //         if (results.affectedRows == 0) {
                //             data = {
                //                 status: false,
                //                 msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_ACTIV], "Device not activated.Please try again"), // Device not activated.Please try again."
                //             }
                //         } else {
                //             sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                //                 if (error) {
                //                     console.log(error);
                //                 }
                //                 console.log('lolo else', resquery[0])

                //                 if (resquery.length) {
                //                     resquery[0].finalStatus = device_helpers.checkStatus(resquery[0])
                //                     resquery[0].pgp_email = await device_helpers.getPgpEmails(resquery[0])
                //                     resquery[0].sim_id = await device_helpers.getSimids(resquery[0])
                //                     resquery[0].chat_id = await device_helpers.getChatids(resquery[0])
                //                     // dealerData = await getDealerdata(res[i]);
                //                     socket_helpers.sendDeviceStatus(sockets.baseIo, resquery[0].device_id, "active", true);
                //                     data = {
                //                         "data": resquery[0],
                //                         status: true,
                //                         msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_ACTIV_SUCC], "Device activated successfully"), // Device activated successfully.
                //                     }
                //                     device_helpers.saveActionHistory(resquery[0], constants.DEVICE_ACTIVATED)
                //                     res.send(data);

                //                 }
                //             })

                //         }

                //     });

                // } else {

                if (gtres[0].expiry_date == '' || gtres[0].expiry_date == null || gtres[0].expiry_date > formatted_dt) {

                    var sql1 = "UPDATE usr_acc SET account_status='' WHERE device_id = '" + device_id + "'";

                    sql.query(sql1, async function (error, results) {
                        if (error) {
                            data = {
                                status: false,
                                msg: "Invalid Device", // Invalid Device."
                            }
                            return res.send(data);
                        }
                        if (results && results.affectedRows === 0) {
                            data = {
                                status: false,
                                msg: "Device not activated.Please try again", // Device not activated.Please try again."
                            }
                        } else {
                            sql.query('select devices.*, ' + usr_acc_query_text + ', dealers.dealer_name, dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' + device_id + '"', async function (error, resquery, fields) {
                                if (error) {
                                    console.log(error);
                                }

                                if (resquery.length) {
                                    let pgp_emails = await device_helpers.getPgpEmails(results[0].id);
                                    let sim_ids = await device_helpers.getSimids(results[0].id);
                                    let chat_ids = await device_helpers.getChatids(results[0].id);
                                    results[0].finalStatus = device_helpers.checkStatus(results[0]);
                                    if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                        results[0].pgp_email = pgp_emails[0].pgp_email
                                    } else {
                                        results[0].pgp_email = "N/A"
                                    }
                                    if (sim_ids && sim_ids.length) {
                                        results[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                        results[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                    }
                                    if (chat_ids[0] && chat_ids[0].chat_id) {
                                        results[0].chat_id = chat_ids[0].chat_id
                                    }
                                    else {
                                        results[0].chat_id = "N/A"

                                    }
                                    // dealerData = await getDealerdata(res[i]);
                                    socket_helpers.sendDeviceStatus(sockets.baseIo, resquery[0].device_id, "active", true);
                                    data = {
                                        data: resquery[0],
                                        status: true,
                                        msg: "Device activated successfully", // Device activated successfully."
                                    }
                                    device_helpers.saveActionHistory(resquery[0], constants.DEVICE_ACTIVATED)
                                    return res.send(data);

                                }
                            })

                        }

                    });

                } else {

                    data = {
                        status: false,
                        msg: "Device cannnot be activated.It is expired already", // Device cannnot be activated.It is expired already.
                    }
                    return res.send(data);
                }
                // }
            } else {
                data = {
                    status: false,
                    msg: "Invalid Device", // Invalid Device."
                }
                return res.send(data);
            }

        } else {
            data = {
                status: false,
                msg: "Invalid Device", // Invalid Device."
            }
            return res.send(data);
        }
    }

}


exports.resetPwd = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        console.log(verify);
        // var agentID = req.params.agentID;

        var dealer_pin = req.body.dealer_pin;
        var email = req.body.email;
        console.log(dealer_pin, email)

        if (!empty(dealer_pin) && dealer_pin !== undefined && !empty(email) && email !== undefined) {
            console.log("again", dealer_pin, email)

            var dealerAgentQ = `SELECT * FROM dealer_agents WHERE email= '${email}' AND delete_status=0 LIMIT 1`;
            var dealerAgent = await sql.query(dealerAgentQ);

            if (dealerAgent.length) {
                var dealerQ = `SELECT * FROM dealers WHERE link_code='${dealer_pin}' LIMIT 1`;
                let dealer = await sql.query(dealerQ);
                if (dealer.length) {

                    var agentPwd = generator.generate({
                        length: 10,
                        numbers: true
                    });
                    var enc_pwd = await bcrypt.hash(agentPwd, 10);

                    let updateDealerAgentQ = `UPDATE dealer_agents SET password='${enc_pwd}' WHERE email='${email}'`;
                    let updateDealer = await sql.query(updateDealerAgentQ);
                    if (updateDealer.affectedRows === 0) {
                        data = {
                            status: false,
                            msg: "Agent password is not changed.", // Password changed successfully.Please check your email.
                        };
                        return res.send(data);
                    } else {

                        var html = `Your Agent details are: <br/>
                                Staff ID : ${dealerAgent[0].staff_id} <br/>
                                Username : ${dealerAgent[0].name} <br/>
                                Email : ${dealerAgent[0].email} <br/> 
                                Password : ${agentPwd} <br/>
                                Dealer Pin : ${dealer[0].link_code}`;

                        sendEmail("Agent password changed successfully", html, verify.user.dealer_email)
                        sendEmail("Agent password changed successfully", html, dealerAgent[0].email)

                        data = {
                            status: true,
                            msg: "Password changed successfully", // Password changed successfully.Please check your email.
                        };
                        return res.send(data);
                    }
                } else {
                    data = {
                        status: false,
                        msg: "Invalid Agent", // Invalid User.
                    }
                    return res.send(data);
                }

            } else {
                data = {
                    status: false,
                    msg: "Invalid Agent", // Invalid User.
                }
                return res.send(data);
            }
        } else {
            data = {
                status: false,
                msg: "Invalid Agent", // Invalid User.
            }
            return res.send(data);
        }
    }
}

exports.getStatus = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let agentID = verify.user.agent_id;
        let agentQ = `SELECT * FROM dealer_agents WHERE id = ${agentID} AND delete_status=0`;
        let agent = await sql.query(agentQ);
        if (agent.length) {
            return res.send({
                status: true,
                agent_status: agent[0].status,
                agent_type: agent[0].type,
                agent_email: agent[0].email
            })
        } else {
            return res.send({
                status: false,
                msg: "Agent not found"
            })
        }
    }
}