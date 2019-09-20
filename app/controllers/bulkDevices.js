// Libraries
const multer = require("multer");
var path = require("path");
var fs = require("fs");
var mime = require("mime");
var XLSX = require("xlsx");
var empty = require("is-empty");
const axios = require("axios");
var moment = require("moment-strftime");
var randomize = require("randomatic");
var datetime = require("node-datetime");

// custom Libraries
const { sendEmail } = require("../../lib/email");

// helpers
const { sql } = require("../../config/database");
const device_helpers = require("../../helper/device_helpers");
const helpers = require("../../helper/general_helper");
const verifyToken = require("../../config/auth");
const sockets = require("../../routes/sockets");

// constants
const constants = require("../../constants/Application");
var MsgConstants = require("../../constants/MsgConstants");
const app_constants = require("../../config/constants");

// constants

let usr_acc_query_text = constants.usr_acc_query_text; //"usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status, usr_acc.transfer_user_status, usr_acc.transfered_from,usr_acc.transfered_to, usr_acc.user_transfered_from, usr_acc.user_transfered_to,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"


var data;



// Bulk Devices
exports.getFilteredBulkDevices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var where_con = "";
    var where_in_dealer = "";
    var where_in_user = "";
    let newArray = [];

    console.log('getFilteredBulkDevices ==========> ', req.body);
    let IN_DEALER_ARRAY = [];
    let IN_USER_ARRAY = [];
    let users_list = [];

    if (verify) {
        if (Object.keys(req.body).length) {

            // get dealer ids
            req.body.dealers.forEach((item) => {
                IN_DEALER_ARRAY.push(item.key);
            })

            // get user ids
            req.body.users.forEach((item) => {
                IN_USER_ARRAY.push(`"${item.key}"`);
            })

            // where in condition for dealers
            if (IN_DEALER_ARRAY.length) {
                where_in_dealer = `AND usr_acc.dealer_id IN (${IN_DEALER_ARRAY})`
            }

            // where in condition for users
            if (IN_USER_ARRAY.length) {
                where_in_user = `AND usr_acc.user_id IN (${IN_USER_ARRAY})`
            }

            console.log('arrary of dealer ids ', IN_DEALER_ARRAY);
            console.log('arrary of user ids ', IN_USER_ARRAY);



            if (verify.user.user_type == "admin") {

                let selectUserQuery = "";
                if (IN_DEALER_ARRAY.length > 0) {
                    selectUserQuery = `SELECT * FROM users WHERE del_status =0 AND dealer_id IN (${IN_DEALER_ARRAY}) ORDER BY created_at DESC`;
                } else {
                    selectUserQuery = `SELECT * FROM users WHERE del_status =0 ORDER BY created_at DESC`;
                }

                // console.log('query is selectUserQuery: ', selectUserQuery)

                let results = await sql.query(selectUserQuery);
                // console.log('and result is: ', results);
                if (results.length) {
                    for (let i = 0; i < results.length; i++) {
                        let data = await helpers.getAllRecordbyUserID(results[i].user_id)
                        results[i].devicesList = data
                    }
                    users_list = results;
                }
            }



            if (where_in_dealer != "" || where_in_user != "") {

                // AND  usr_acc.dealer_id IN (${IN_DEALER_ARRAY}) OR usr_acc.user_id IN (${IN_USER_ARRAY})
                let query = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) 
            WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 AND usr_acc.device_status != 0 ${where_in_dealer} ${where_in_user} ORDER BY devices.id DESC`;
                console.log('query is: ', query);

                sql.query(query, async function (error, results, fields) {
                    if (error) throw error;
                    // console.log('result is: ', results)

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
                        let loginHistoryData = await device_helpers.getLastLoginDetail(usr_device_ids)

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
                            let lastOnline = loginHistoryData.find(record => record.device_id == results[i].usr_device_id);
                            if (lastOnline) {
                                results[i].lastOnline = lastOnline.created_at
                            }
                            results[i].finalStatus = device_helpers.checkStatus(
                                results[i]
                            );
                            results[i].validity = await device_helpers.checkRemainDays(
                                results[i].created_at,
                                results[i].validity
                            );
                        }
                    } else {
                        data = {
                            status: true,
                            data: [],
                            users_list
                        };
                        res.send(data);
                        return;
                    }

                    let finalResult = [...results, ...newArray];

                    let checkValue = helpers.checkValue;
                    for (let device of finalResult) {

                        let startDate = moment(new Date())
                        let expiray_date = new Date(device.expiry_date)
                        let endDate = moment(expiray_date)

                        // let startDate = moment()
                        // let endDate = moment(device.expiry_date)
                        let remainTermDays = endDate.diff(startDate, 'days')
                        device.remainTermDays = remainTermDays
                        device.account_email = checkValue(device.account_email);
                        device.firmware_info = checkValue(device.firmware_info);
                        device.account_name = checkValue(device.account_name);
                        device.account_status = checkValue(device.account_status);
                        device.activation_code = checkValue(device.activation_code);
                        device.activation_status = checkValue(
                            device.activation_status
                        );
                        device.batch_no = checkValue(device.batch_no);
                        device.chat_id = checkValue(device.chat_id);
                        device.client_id = checkValue(device.client_id);
                        device.connected_dealer = checkValue(
                            device.connected_dealer
                        );
                        device.created_at = checkValue(device.created_at);
                        device.dealer_id = checkValue(device.dealer_id);
                        device.dealer_name = checkValue(device.dealer_name);
                        device.del_status = checkValue(device.del_status);
                        device.device_id = checkValue(device.device_id);
                        device.device_status = checkValue(device.device_status);
                        device.expiry_date = checkValue(device.expiry_date);
                        device.expiry_months = checkValue(device.expiry_months);
                        device.fcm_token = checkValue(device.fcm_token);
                        device.finalStatus = checkValue(device.finalStatus);
                        device.flagged = checkValue(device.flagged);
                        device.id = checkValue(device.id);
                        device.imei = checkValue(device.imei);
                        device.imei2 = checkValue(device.imei2);
                        device.ip_address = checkValue(device.ip_address);
                        device.is_push_apps = checkValue(device.is_push_apps);
                        device.is_sync = checkValue(device.is_sync);
                        device.link_code = checkValue(device.link_code);
                        device.mac_address = checkValue(device.mac_address);
                        device.model = checkValue(device.model);
                        device.name = checkValue(device.name);
                        device.note = checkValue(device.note);
                        device.online = checkValue(device.online);
                        device.pgp_email = checkValue(device.pgp_email);
                        device.prnt_dlr_id = checkValue(device.prnt_dlr_id);
                        device.prnt_dlr_name = checkValue(device.prnt_dlr_name);
                        device.reject_status = checkValue(device.reject_status);
                        device.screen_start_date = checkValue(
                            device.screen_start_date
                        );
                        device.serial_number = checkValue(device.serial_number);
                        device.session_id = checkValue(device.session_id);
                        device.sim_id = checkValue(device.sim_id);
                        device.simno = checkValue(device.simno);
                        device.simno2 = checkValue(device.simno2);
                        device.start_date = checkValue(device.start_date);
                        device.status = checkValue(device.status);
                        device.transfer_status = checkValue(device.transfer_status);
                        device.unlink_status = checkValue(device.unlink_status);
                        device.updated_at = checkValue(device.updated_at);
                        device.user_id = checkValue(device.user_id);
                        device.usr_device_id = checkValue(device.usr_device_id);
                        device.validity = checkValue(device.validity);
                        device.validity = checkValue(device.validity);
                    }

                    data = {
                        status: true,
                        // "data": newResultArray
                        data: finalResult,
                        users_list
                    };
                    res.send(data);
                    return;
                }
                );

            } else {
                data = {
                    status: true,
                    data: [],
                    users_list
                };
                res.send(data);
                return;
            }
        } else {
            data = {
                status: true,
                data: [],
                users_list
            };
            res.send(data);
            return;
        }
    }
};

exports.suspendBulkAccountDevices = async function (req, res) {
    var verify = req.decoded;
    // var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format("Y-m-d H:M:S");
    let device_ids = req.body.device_ids;

    if (verify && device_ids.length) {
        let userId = verify.user.id;
        console.log("userId ", userId);
        // let usertype = await helpers.getUserType(userId);
        // console.log("usertype ", usertype);

        let alreadyExpired = [];
        let failedToSuspend = [];
        let SuspendDevices = [];

        var selectQuery = `select * from usr_acc WHERE device_id IN (${device_ids})`;
        var getDevices = await sql.query(selectQuery);

        for (let index = 0; index < getDevices.length; index++) {

            if (getDevices[index].expiry_date == "" || getDevices[index].expiry_date == null || getDevices[index].expiry_date >= formatted_dt) {
                var updateStatusQuery = "update usr_acc set account_status='suspended' where device_id = '" + getDevices[index].device_id + "'";

                let results = await sql.query(updateStatusQuery);
                if (results.affectedRows == 0) {
                    failedToSuspend.push(getDevices[index].device_id);
                } else {
                    let selectQuery = "select devices.*  ," +
                        usr_acc_query_text +
                        ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' +
                        getDevices[index].device_id +
                        '"';

                    let resquery = await sql.query(selectQuery);
                    let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
                    let sim_ids = await device_helpers.getSimids(resquery[0].id);
                    let chat_ids = await device_helpers.getChatids(resquery[0].id);
                    if (resquery.length) {
                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                        if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                            resquery[0].pgp_email = pgp_emails[0].pgp_email
                        } else {
                            resquery[0].pgp_email = "N/A"
                        }
                        if (sim_ids && sim_ids.length) {
                            resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                            resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                        }
                        if (chat_ids[0] && chat_ids[0].chat_id) {
                            resquery[0].chat_id = chat_ids[0].chat_id
                        }
                        else {
                            resquery[0].chat_id = "N/A"
                        }

                        SuspendDevices.push(resquery[0]);

                        device_helpers.saveActionHistory(
                            resquery[0],
                            constants.DEVICE_SUSPENDED
                        );
                        sockets.sendDeviceStatus(
                            resquery[0].device_id,
                            "suspended"
                        );
                    }
                }
            } else {
                alreadyExpired.push(getDevices[index].device_id);
            }
        }

        if (alreadyExpired.length > 0) {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.NOT_SUSP_ACC_EXP], "Can't suspend !!! Account Already Expired") // Can't suspend !!! Account Already Expired."
            };
        } else if (failedToSuspend.length > 0) {
            data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.ACC_NOT_SUSP], "Account not suspended.Please try again") // Account not suspended.Please try again.
            };
        } else if (SuspendDevices.length > 0) {
            data = {
                data: SuspendDevices,
                status: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ACC_SUSP_SUCC], "Account suspended successfully") // Account suspended successfully.
            };

            let dvc_ids = [];
            SuspendDevices.forEach((item) => {
                dvc_ids.push(item.usr_device_id);
            });
            req.body["device_ids"] = dvc_ids;
            req.body["action_by"] = userId;

            device_helpers.saveBuklActionHistory(req.body, constants.BULK_SUSPENDED_DEVICES);

        }
        res.send(data);

    } else {
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEVICE], "Invalid Device") // Invalid Device."
        };
        res.send(data);
    }
};


exports.activateBulkDevices = async function (req, res) {
    var verify = req.decoded;
    // var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format("Y-m-d H:M:S");
    let device_ids = req.body.device_ids;
    console.log('data is: ', req.body)

    if (verify && device_ids.length) {
        let userId = verify.user.id;
        console.log("userId ", userId);
        // let usertype = await helpers.getUserType(userId);
        // console.log("usertype ", usertype);

        let alreadyExpired = [];
        let failedToActivate = [];
        let ActivateDevices = [];

        var selectQuery = `select * from usr_acc WHERE device_id IN (${device_ids})`;
        var getDevices = await sql.query(selectQuery);

        for (let index = 0; index < getDevices.length; index++) {

            if (getDevices[0].expiry_date < formatted_dt) {
                alreadyExpired.push(getDevices[index].device_id);
            } else {
                var updateStatus = "update usr_acc set account_status='' where device_id = '" + getDevices[index].device_id + "'";

                var results = await sql.query(updateStatus);

                if (results.affectedRows == 0) {
                    failedToActivate.push(getDevices[index].device_id);
                } else {

                    let selectQuery = "select devices.*  ," +
                        usr_acc_query_text +
                        ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' +
                        getDevices[index].device_id +
                        '"'

                    let resquery = await sql.query(selectQuery);

                    let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
                    let sim_ids = await device_helpers.getSimids(resquery[0].id);
                    let chat_ids = await device_helpers.getChatids(resquery[0].id);
                    if (resquery.length) {
                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                        if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                            resquery[0].pgp_email = pgp_emails[0].pgp_email
                        } else {
                            resquery[0].pgp_email = "N/A"
                        }
                        if (sim_ids && sim_ids.length) {
                            resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                            resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                        }
                        if (chat_ids[0] && chat_ids[0].chat_id) {
                            resquery[0].chat_id = chat_ids[0].chat_id
                        }
                        else {
                            resquery[0].chat_id = "N/A"

                        }
                        sockets.sendDeviceStatus(
                            resquery[0].device_id,
                            "active",
                            true
                        );

                        ActivateDevices.push(resquery[0]);

                        device_helpers.saveActionHistory(
                            resquery[0],
                            constants.DEVICE_ACTIVATED
                        );
                    }

                }

            }

        }

        if (alreadyExpired.length > 0) {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[""], "Devices cannnot be activated.It is expired already")
            };
        } else if (failedToActivate.length > 0) {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[""], "Devices not activated.Please try again")
            };
        } else if (ActivateDevices.length > 0) {
            data = {
                data: ActivateDevices,
                status: true,
                msg: await helpers.convertToLang(req.translation[""], "Devices activated successfully")
            };

            let dvc_ids = [];
            ActivateDevices.forEach((item) => {
                dvc_ids.push(item.usr_device_id);
            });
            req.body["device_ids"] = dvc_ids;
            req.body["action_by"] = userId;
            device_helpers.saveBuklActionHistory(req.body, constants.BULK_ACTIVATED_DEVICES);
        }
        res.send(data);

    } else {
        data = {
            status: false,
            msg: await helpers.convertToLang(
                req.translation[""],
                "Invalid Devices"
            )
        };
        res.send(data);
    }
};


exports.bulkDevicesHistory = async function (req, res) {
    var verify = req.decoded;
    let userId = verify.user.id;

    console.log('at bulk history:')
    // return;
    if (verify) {

        var selectQuery = `SELECT * FROM bulk_device_history WHERE action_by = '${userId}'`;
        var getHistory = await sql.query(selectQuery);

        getHistory[0]["data"] = JSON.stringify([{ a: "aa" }]);
        console.log("getHistory ", getHistory);

        // data = {
        //     status: true,
        //     data: getHistory
        // }

        res.send(getHistory);

    }
}

exports.getUsersOfDealers = async function (req, res) {
    var verify = req.decoded;
    let userId = verify.user.id;


    console.log('getUsersOfDealers: =============> ', req.body);

    return null;
    if (verify) {

        if (verify.user.user_type == "admin") {

            let IN_DEALER_ARRAY = [];
            req.body.forEach((item) => {
                IN_DEALER_ARRAY.push(item.key);
            })

            // var role = await helpers.getuserTypeIDByName(verify.user.user_type);

            let selectUserQuery = "";
            if (IN_DEALER_ARRAY.length > 0) {
                selectUserQuery = `SELECT * FROM users WHERE del_status =0 AND dealer_id IN (${IN_DEALER_ARRAY}) ORDER BY created_at DESC`;
            } else {
                selectUserQuery = `SELECT * FROM users WHERE del_status =0 ORDER BY created_at DESC`;
            }


            console.log('query is selectUserQuery: ', selectUserQuery)


            let results = await sql.query(selectUserQuery);
            console.log('and result is: ', results);
            if (results.length) {
                for (let i = 0; i < results.length; i++) {
                    let data = await helpers.getAllRecordbyUserID(results[i].user_id)
                    results[i].devicesList = data
                }
                // console.log("Devices For user", devicesData);
                data = {
                    status: true,
                    users_list: results,
                }
                res.send(data);
                return;
            } else {
                data = {
                    status: false,
                    users_list: [],

                }
                res.send(data);
                return;
            }
        }

    }
}