// Libraries
const multer = require("multer");
var path = require("path");
var fs = require("fs");
var mime = require("mime");
var XLSX = require("xlsx");
var empty = require("is-empty");
const axios = require("axios");
// var moment = require("moment-strftime");
var moment = require('moment');
var randomize = require("randomatic");
var datetime = require("node-datetime");
var html = require('html-escaper');

// custom Libraries
const { sendEmail } = require("../../lib/email");
const sockets = require("../../routes/sockets");

// helpers
const { sql } = require("../../config/database");
const device_helpers = require("../../helper/device_helpers");
const helpers = require("../../helper/general_helper");
const socket_helpers = require("../../helper/socket_helper");
// const verifyToken = require("../../config/auth");
// const sockets = require("../../routes/sockets");

// constants
const constants = require("../../constants/Application");
var MsgConstants = require("../../constants/MsgConstants");
const app_constants = require("../../config/constants");

// constants

let usr_acc_query_text = constants.usr_acc_query_text; //"usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status, usr_acc.transfer_user_status, usr_acc.transfered_from,usr_acc.transfered_to, usr_acc.user_transfered_from, usr_acc.user_transfered_to,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"


var data;



// get history
exports.bulkDevicesHistory = async function (req, res) {
    var verify = req.decoded;
    let userId = verify.user.id;

    console.log('at bulk history:')
    // return;
    if (verify) {

        var selectQuery = `SELECT * FROM bulk_device_history WHERE action_by = '${userId}'`;
        var getHistory = await sql.query(selectQuery);

        if (getHistory.length) {
            for (let index = 0; index < getHistory.length; index++) {

                // get devices
                console.log("getHistory[index].device_id ", getHistory[index].device_ids);

                if (JSON.parse(getHistory[index].device_ids).length) {
                    let query = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers ON (usr_acc.dealer_id = dealers.dealer_id) 
                WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.device_id IN (${JSON.parse(getHistory[index].device_ids)}) ORDER BY devices.id DESC`;
                    console.log('query is: ', query);

                    let results = await sql.query(query);
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
                        // let pgp_emails = await device_helpers.getPgpEmails(user_acc_ids);
                        // let sim_ids = await device_helpers.getSimids(user_acc_ids);
                        // let chat_ids = await device_helpers.getChatids(user_acc_ids);
                        let loginHistoryData = await device_helpers.getLastLoginDetail(usr_device_ids)
                        let servicesData = await device_helpers.getServicesData(user_acc_ids)
                        let servicesIds = servicesData.map(item => { return item.id })
                        let userAccServiceData = []
                        let data_plans = []
                        if (servicesIds.length) {
                            userAccServiceData = await device_helpers.getUserAccServicesData(user_acc_ids, servicesIds)
                            data_plans = await device_helpers.getDataPlans(servicesIds)
                        }

                        for (var i = 0; i < results.length; i++) {
                            results[i].sim_id = "N/A"
                            results[i].sim_id2 = "N/A"
                            results[i].pgp_email = "N/A"
                            results[i].chat_id = "N/A"

                            let service_id = null
                            let services = servicesData.filter(data => data.user_acc_id === results[i].id);
                            if (services && services.length) {
                                services.map((item) => {
                                    if (item.status === 'extended') {
                                        results[i].extended_services = item
                                    } else {
                                        results[i].services = item
                                        service_id = item.id
                                    }
                                })
                            }
                            let productsData = userAccServiceData.filter(item => item.user_acc_id === results[i].id && item.service_id === service_id);
                            if (productsData && productsData.length) {
                                productsData.map((item) => {
                                    if (item.type === 'sim_id') {
                                        results[i].sim_id = item.product_value
                                    }
                                    else if (item.type === 'sim_id2') {
                                        results[i].sim_id2 = item.product_value
                                    }
                                    else if (item.type === 'pgp_email') {
                                        results[i].pgp_email = item.product_value
                                    }
                                    else if (item.type === 'chat_id') {
                                        results[i].chat_id = item.product_value
                                    }
                                })
                            }
                            // let pgp_email = pgp_emails.find(pgp_email => pgp_email.user_acc_id === results[i].id);
                            // if (pgp_email) {
                            //     results[i].pgp_email = pgp_email.pgp_email
                            // }
                            // let sim_idArray = sim_ids.filter(sim_id => sim_id.user_acc_id === results[i].id);
                            // if (sim_idArray && sim_idArray.length) {
                            //     results[i].sim_id = sim_idArray[0].sim_id
                            //     results[i].sim_id2 = sim_idArray[1] ? sim_idArray[1].sim_id : "N/A"
                            // }
                            // let chat_id = chat_ids.find(chat_id => chat_id.user_acc_id === results[i].id);
                            // if (chat_id) {
                            //     results[i].chat_id = chat_id.chat_id
                            // }

                            let sim_id_data_plan = data_plans.filter((item) => item.sim_type == 'sim_id')
                            results[0].sim_id_data_plan = sim_id_data_plan[0]
                            let sim_id2_data_plan = data_plans.filter((item) => item.sim_type == 'sim_id2')
                            results[0].sim_id2_data_plan = sim_id2_data_plan[0]

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

                        let finalResult = [...results];
                        let checkValue = helpers.checkValue;
                        for (let device of finalResult) {

                            let remainTermDays = "N/A"

                            if (device.expiry_date !== null) {
                                let startDate = moment(new Date())
                                let expiray_date = new Date(device.expiry_date)
                                let endDate = moment(expiray_date)
                                remainTermDays = endDate.diff(startDate, 'days')
                            }
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
                            device.sim_id2 = checkValue(device.sim_id2)
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
                        }

                        getHistory[index]["data"] = JSON.stringify(finalResult);
                    } else {
                        getHistory[index]["data"] = "[]";
                    }
                } else {
                    getHistory[index]["data"] = "[]";
                }
            }
        }
        res.send(getHistory);

    }
}

// Bulk Devices list
exports.getFilteredBulkDevices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var where_con = "";
    var where_in_dealer = "";
    var where_in_user = "";
    let newArray = [];

    // console.log('getFilteredBulkDevices ==========> ', req.body);
    let IN_DEALER_ARRAY = [];
    let IN_USER_ARRAY = [];
    let users_list = [];

    try {
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

                // console.log('arrary of dealer ids ', IN_DEALER_ARRAY);
                // console.log('arrary of user ids ', IN_USER_ARRAY);



                if (verify.user.user_type == "admin") {

                    let selectUserQuery = "";
                    if (IN_DEALER_ARRAY.length > 0) {
                        selectUserQuery = `SELECT * FROM users WHERE del_status =0 AND dealer_id IN (${IN_DEALER_ARRAY}) ORDER BY created_at DESC`;
                    } else {
                        selectUserQuery = `SELECT * FROM users WHERE del_status =0 ORDER BY created_at DESC`;
                    }

                    // console.log('query is selectUserQuery: ', selectUserQuery)

                    let userResults = await sql.query(selectUserQuery);
                    // console.log('and result is: ', userResults);
                    if (userResults && userResults.length) {
                        for (let i = 0; i < userResults.length; i++) {
                            if (userResults[i].user_id) {
                                let data = await helpers.getAllRecordbyUserID(userResults[i].user_id)
                                userResults[i].devicesList = data
                            }
                        }
                        users_list = userResults;
                    }
                }



                if (where_in_dealer != "" || where_in_user != "") {
                    // let unlinkQ = '';
                    // if (verify.user.user_type !== constants.ADMIN) {
                    //     if (verify.user.user_type === constants.DEALER) {
                    //         where_con = ` AND (usr_acc.dealer_id =${
                    //             verify.user.id
                    //             } OR usr_acc.prnt_dlr_id = ${verify.user.id})`;
                    //         unlinkQ = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = ${
                    //             verify.user.id
                    //             } AND del_status IS NULL`;

                    //     } else {
                    //         where_con = ` AND usr_acc.dealer_id = ${verify.user.id} `;
                    //         unlinkQ = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = ${
                    //             verify.user.id
                    //             } AND del_status IS NULL`;
                    //     }
                    // } else {
                    //     unlinkQ = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND del_status IS NULL `;
                    // }
                    // newArray = await sql.query(unlinkQ);

                    let query = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) 
            WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 AND usr_acc.device_status != 0 ${where_in_dealer} ${where_in_user} ${where_con} ORDER BY devices.id DESC`;
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
                            let servicesData = await device_helpers.getServicesData(user_acc_ids)

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
                                let services = servicesData.find(data => data.user_acc_id === results[i].id);
                                if (services) {
                                    results[i].services = services
                                }
                                // let lastOnline = loginHistoryData.find(record => record.device_id == results[i].usr_device_id);
                                // if (lastOnline) {
                                results[i].lastOnline = results[i].last_login
                                // }
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
    } catch (error) {
        console.log("Query Error: ", error);
        return res.send({ status: false, msg: 'Error while processing!', data: [] });
    }
};

// suspend devices
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
        let onlineDevices = [];
        let offlineDevices = [];

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

                    if (resquery.length) {
                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                        let servicesData = await device_helpers.getServicesData(resquery[0].id)
                        let servicesIds = servicesData.map(item => { return item.id })
                        let userAccServiceData = []
                        let data_plans = []
                        if (servicesIds.length) {
                            userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                            data_plans = await device_helpers.getDataPlans(servicesIds)
                        }
                        resquery[0].sim_id = "N/A"
                        resquery[0].sim_id2 = "N/A"
                        resquery[0].pgp_email = "N/A"
                        resquery[0].chat_id = "N/A"

                        let services = servicesData;
                        let service_id = null
                        if (services && services.length) {
                            services.map((item) => {
                                if (item.status === 'extended') {
                                    resquery[0].extended_services = item
                                } else {
                                    resquery[0].services = item
                                    service_id = item.id
                                }
                            })
                        }

                        let productsData = userAccServiceData.filter(item => item.user_acc_id === resquery[0].id && item.service_id === service_id);
                        if (productsData && productsData.length) {
                            productsData.map((item) => {
                                if (item.type === 'sim_id') {
                                    resquery[0].sim_id = item.product_value
                                }
                                else if (item.type === 'sim_id2') {
                                    resquery[0].sim_id2 = item.product_value
                                }
                                else if (item.type === 'pgp_email') {
                                    resquery[0].pgp_email = item.product_value
                                }
                                else if (item.type === 'chat_id') {
                                    resquery[0].chat_id = item.product_value
                                }
                            })
                        }

                        let sim_id_data_plan = data_plans.filter((item) => item.sim_type == 'sim_id')
                        resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                        let sim_id2_data_plan = data_plans.filter((item) => item.sim_type == 'sim_id2')
                        resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]

                        resquery[0].lastOnline = resquery[0].last_login ? resquery[0].last_login : "N/A"

                        let remainTermDays = "N/A"

                        if (resquery[0].expiry_date !== null) {
                            let startDate = moment(new Date())
                            let expiray_date = new Date(resquery[0].expiry_date)
                            let endDate = moment(expiray_date)
                            remainTermDays = endDate.diff(startDate, 'days')
                        }
                        resquery[0].remainTermDays = remainTermDays

                        // onlineDevices.push(resquery[0]);

                        // check online/offline devices
                        let isOnline = await device_helpers.isDeviceOnline(resquery[0].device_id);
                        if (isOnline) {
                            socket_helpers.sendDeviceStatus(sockets.baseIo, resquery[0].device_id, "suspended");
                            // console.log("device is online")
                            onlineDevices.push({ device_id: resquery[0].device_id, usr_device_id: resquery[0].usr_device_id });
                        } else {
                            // console.log("device is offline")
                            offlineDevices.push({ device_id: resquery[0].device_id, usr_device_id: resquery[0].usr_device_id });
                        }
                        device_helpers.saveActionHistory(
                            resquery[0],
                            constants.DEVICE_SUSPENDED
                        );


                    }
                }
            } else {
                alreadyExpired.push(getDevices[index].device_id);
            }
        }

        let messageTxt = '';
        let contentTxt = '';

        if (failedToSuspend.length) {
            messageTxt = await helpers.convertToLang(req.translation[MsgConstants.ACC_NOT_SUSP], "All Selected Devices Failed to suspended. Please try again") // Account not suspended.Please try again.
        }
        else if (alreadyExpired.length) {
            messageTxt = await helpers.convertToLang(req.translation[MsgConstants.NOT_SUSP_ACC_EXP], "Can't suspend !!! All Selected Devices are Already Expired") // Can't suspend !!! Account Already Expired."
        }
        else if (offlineDevices.length) {
            messageTxt = await helpers.convertToLang(req.translation[""], "Warning All Devices Are Offline");
            contentTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices will Suspended Soon. Action will be performed when devices back online");
        }
        else if (onlineDevices.length) {
            messageTxt = await helpers.convertToLang(req.translation[MsgConstants.ACC_SUSP_SUCC], "All Selected Devices are Suspended Successfully") // Account suspended successfully.
        }

        if (failedToSuspend.length || alreadyExpired.length || onlineDevices.length || offlineDevices.length) {

            // get user_device_ids and string device ids of online and offline devices
            let queue_dvc_ids = [];
            let queue_usr_dvc_ids = [];
            let pushed_dvc_ids = [];
            let pushed_usr_dvc_ids = [];

            let all_usr_dvc_ids = [];

            offlineDevices.forEach(item => {
                queue_dvc_ids.push(item.device_id);
                queue_usr_dvc_ids.push(item.usr_device_id);
            });

            onlineDevices.forEach(item => {
                pushed_dvc_ids.push(item.device_id);
                pushed_usr_dvc_ids.push(item.usr_device_id);
            });
            all_usr_dvc_ids = [...queue_usr_dvc_ids, ...pushed_usr_dvc_ids];

            req.body["device_ids"] = all_usr_dvc_ids;
            req.body["action_by"] = userId;
            // console.log('save bulk history')
            device_helpers.saveBuklActionHistory(req.body, constants.BULK_SUSPENDED_DEVICES);

            data = {
                status: true,
                online: onlineDevices.length ? true : false,
                offline: offlineDevices.length ? true : false,
                failed: failedToSuspend.length ? true : false,
                expire: alreadyExpired.length ? true : false,
                msg: messageTxt,
                content: contentTxt,
                data: {
                    failed_device_ids: failedToSuspend,
                    queue_device_ids: queue_dvc_ids,
                    pushed_device_ids: pushed_dvc_ids,
                    expire_device_ids: alreadyExpired
                }
            };
        } else {
            data = {
                status: false,
                msg: 'Error while Processing'
            }
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

// activate devices
exports.activateBulkDevices = async function (req, res) {
    var verify = req.decoded;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format("Y-m-d H:M:S");
    let device_ids = req.body.device_ids;
    // console.log('data is: ', req.body)

    if (verify && device_ids.length) {
        let userId = verify.user.id;
        // console.log("userId ", userId);

        let alreadyExpired = [];
        let failedToActivate = [];
        let onlineDevices = [];
        let offlineDevices = [];

        var selectQuery = `select * from usr_acc WHERE device_id IN (${device_ids})`;
        var getDevices = await sql.query(selectQuery);

        // console.log("start for loop")
        for (let index = 0; index < getDevices.length; index++) {
            // console.log('index is: ', index)

            if (getDevices[0].expiry_date < formatted_dt) {
                // console.log('expiry_date is: ')
                alreadyExpired.push(getDevices[index].device_id);
            } else {
                // console.log('not expiry')
                var updateStatus = "update usr_acc set account_status='' where device_id = '" + getDevices[index].device_id + "'";
                var results = await sql.query(updateStatus);

                if (results.affectedRows == 0) {
                    // console.log('failed')
                    failedToActivate.push(getDevices[index].device_id);
                } else {
                    // console.log('not failed')
                    let selectQuery = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices left join usr_acc ON (devices.id = usr_acc.device_id) LEFT JOIN dealers ON (usr_acc.dealer_id = dealers.dealer_id) WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= '${getDevices[index].device_id}';`
                    // console.log("selectQuery ", selectQuery)
                    let resquery = await sql.query(selectQuery);

                    if (resquery.length) {
                        // console.log("select device detail")
                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                        let servicesData = await device_helpers.getServicesData(resquery[0].id);
                        let servicesIds = servicesData.map(item => { return item.id })
                        let userAccServiceData = []
                        let data_plans = []
                        if (servicesIds.length) {
                            userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                            data_plans = await device_helpers.getDataPlans(servicesIds)
                        }
                        resquery[0].sim_id = "N/A"
                        resquery[0].sim_id2 = "N/A"
                        resquery[0].pgp_email = "N/A"
                        resquery[0].chat_id = "N/A"

                        let services = servicesData;
                        let service_id = null
                        if (services && services.length) {
                            services.map((item) => {
                                if (item.status === 'extended') {
                                    resquery[0].extended_services = item
                                } else {
                                    resquery[0].services = item
                                    service_id = item.id
                                }
                            })
                        }

                        let productsData = userAccServiceData.filter(item => item.user_acc_id === resquery[0].id && item.service_id === service_id);
                        if (productsData && productsData.length) {
                            productsData.map((item) => {
                                if (item.type === 'sim_id') {
                                    resquery[0].sim_id = item.product_value
                                }
                                else if (item.type === 'sim_id2') {
                                    resquery[0].sim_id2 = item.product_value
                                }
                                else if (item.type === 'pgp_email') {
                                    resquery[0].pgp_email = item.product_value
                                }
                                else if (item.type === 'chat_id') {
                                    resquery[0].chat_id = item.product_value
                                }
                            })
                        }

                        let sim_id_data_plan = data_plans.filter((item) => item.sim_type == 'sim_id')
                        resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                        let sim_id2_data_plan = data_plans.filter((item) => item.sim_type == 'sim_id2')
                        resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]

                        resquery[0].lastOnline = resquery[0].last_login ? resquery[0].last_login : "N/A"
                        let remainTermDays = "N/A"

                        if (resquery[0].expiry_date !== null) {
                            let startDate = moment(new Date())
                            let expiray_date = new Date(resquery[0].expiry_date)
                            let endDate = moment(expiray_date)
                            remainTermDays = endDate.diff(startDate, 'days')
                        }
                        resquery[0].remainTermDays = remainTermDays


                        // check online/offline devices
                        let isOnline = await device_helpers.isDeviceOnline(resquery[0].device_id);
                        if (isOnline) {
                            socket_helpers.sendDeviceStatus(sockets.baseIo,
                                resquery[0].device_id,
                                "active",
                                true
                            );
                            // console.log("device is online")
                            onlineDevices.push({ device_id: resquery[0].device_id, usr_device_id: resquery[0].usr_device_id });
                        } else {
                            // console.log("device is offline")
                            offlineDevices.push({ device_id: resquery[0].device_id, usr_device_id: resquery[0].usr_device_id });
                        }

                        // console.log('save action history')
                        device_helpers.saveActionHistory(
                            resquery[0],
                            constants.DEVICE_ACTIVATED
                        );
                    }
                }
            }
        }

        // console.log("after end of loop ", failedToActivate, alreadyExpired, onlineDevices, offlineDevices)

        let messageTxt = '';
        let contentTxt = '';

        if (failedToActivate.length) {
            messageTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices Failed to activate. Please try again")
        }
        else if (alreadyExpired.length) {
            messageTxt = await helpers.convertToLang(req.translation[""], "Warning All Selected Devices cannot be activated. These are expired already")
        }
        else if (offlineDevices.length) {
            messageTxt = await helpers.convertToLang(req.translation[""], "Warning All Selected Devices Are Offline");
            contentTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices will Activate Soon. Action will be performed when devices back online");
        }
        else if (onlineDevices.length) {
            messageTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices activated successfully")
        }

        if (failedToActivate.length || alreadyExpired.length || onlineDevices.length || offlineDevices.length) {

            // get user_device_ids and string device ids of online and offline devices
            let queue_dvc_ids = [];
            let queue_usr_dvc_ids = [];
            let pushed_dvc_ids = [];
            let pushed_usr_dvc_ids = [];

            let all_usr_dvc_ids = [];

            offlineDevices.forEach(item => {
                queue_dvc_ids.push(item.device_id);
                queue_usr_dvc_ids.push(item.usr_device_id);
            });

            onlineDevices.forEach(item => {
                pushed_dvc_ids.push(item.device_id);
                pushed_usr_dvc_ids.push(item.usr_device_id);
            });
            all_usr_dvc_ids = [...queue_usr_dvc_ids, ...pushed_usr_dvc_ids];

            req.body["device_ids"] = all_usr_dvc_ids;
            req.body["action_by"] = userId;
            // console.log('save bulk history')
            device_helpers.saveBuklActionHistory(req.body, constants.BULK_ACTIVATED_DEVICES);

            data = {
                status: true,
                online: onlineDevices.length ? true : false,
                offline: offlineDevices.length ? true : false,
                failed: failedToActivate.length ? true : false,
                expire: alreadyExpired.length ? true : false,
                msg: messageTxt,
                content: contentTxt,
                data: {
                    failed_device_ids: failedToActivate,
                    queue_device_ids: queue_dvc_ids,
                    pushed_device_ids: pushed_dvc_ids,
                    expire_device_ids: alreadyExpired
                }
            };
        } else {
            data = {
                status: false,
                msg: 'Error while Processing'
            }
        }
        // console.log("response data is: ", data)
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


// exports.getUsersOfDealers = async function (req, res) {
//     var verify = req.decoded;
//     let userId = verify.user.id;


//     console.log('getUsersOfDealers: =============> ', req.body);

//     return;
//     if (verify) {

//         if (verify.user.user_type == "admin") {

//             let IN_DEALER_ARRAY = [];
//             req.body.forEach((item) => {
//                 IN_DEALER_ARRAY.push(item.key);
//             })

//             // var role = await helpers.getuserTypeIDByName(verify.user.user_type);

//             let selectUserQuery = "";
//             if (IN_DEALER_ARRAY.length > 0) {
//                 selectUserQuery = `SELECT * FROM users WHERE del_status =0 AND dealer_id IN (${IN_DEALER_ARRAY}) ORDER BY created_at DESC`;
//             } else {
//                 selectUserQuery = `SELECT * FROM users WHERE del_status =0 ORDER BY created_at DESC`;
//             }


//             console.log('query is selectUserQuery: ', selectUserQuery)


//             let results = await sql.query(selectUserQuery);
//             console.log('and result is: ', results);
//             if (results.length) {
//                 for (let i = 0; i < results.length; i++) {
//                     let data = await helpers.getAllRecordbyUserID(results[i].user_id)
//                     results[i].devicesList = data
//                 }
//                 // console.log("Devices For user", devicesData);
//                 data = {
//                     status: true,
//                     users_list: results,
//                 }
//                 res.send(data);
//                 return;
//             } else {
//                 data = {
//                     status: false,
//                     users_list: [],

//                 }
//                 res.send(data);
//                 return;
//             }
//         }

//     }
// }

// Push Apps
exports.applyBulkPushApps = async function (req, res) {
    // console.log('hi applyBulkPushApps')
    try {
        var verify = req.decoded;
        let selectedDevices = req.body.selectedDevices;
        // console.log("applyBulkPushApps req.body::  ", req.body)

        if (verify && selectedDevices && selectedDevices.length && req.body.apps.length) {
            let dealer_id = verify.user.id;
            let push_apps = req.body.apps;
            let noOfApps = push_apps.length;

            let apps = push_apps === undefined ? "[]" : JSON.stringify(push_apps);

            let failedToPush = [];
            let queueAppsList = [];
            let pushedAppsList = [];

            for (let index = 0; index < selectedDevices.length; index++) {

                var applyQuery = `INSERT INTO device_history (device_id,dealer_id,user_acc_id, push_apps, type, action_by, dealer_type) VALUES ('${selectedDevices[index].device_id}', ${dealer_id}, ${selectedDevices[index].usrAccId}, '${apps}', 'push_apps', ${verify.user.id}, '${verify.user.user_type}');`;
                console.log("applyQuery for bulk push apps ", applyQuery)
                let rslts = await sql.query(applyQuery);

                if (rslts && rslts.affectedRows) {
                    let isOnline = await device_helpers.isDeviceOnline(selectedDevices[index].device_id);
                    //job Queue query
                    var loadDeviceQ = `INSERT INTO apps_queue_jobs (device_id,action,type,total_apps,is_in_process) VALUES ('${selectedDevices[index].device_id}', 'push', 'push', ${noOfApps}, 1);`;
                    sql.query(loadDeviceQ);
                    if (isOnline) {
                        console.log("device is online")
                        socket_helpers.applyPushApps(sockets.baseIo, rslts.insertId, apps, selectedDevices[index].device_id);
                        pushedAppsList.push({ device_id: selectedDevices[index].device_id, usr_device_id: selectedDevices[index].usr_device_id });
                    } else {
                        console.log("device is offline")
                        // socket_helpers.applyPushApps(sockets.baseIo, apps, selectedDevices[index].device_id);
                        queueAppsList.push({ device_id: selectedDevices[index].device_id, usr_device_id: selectedDevices[index].usr_device_id });
                    }

                    // res.send(data);
                } else {
                    failedToPush.push(selectedDevices[index].device_id);
                }
            } // end for loop

            let messageTxt = '';
            let contentTxt = '';

            if (failedToPush.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Failed to Push Apps");
            }
            else if (queueAppsList.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Warning All Devices Are Offline");
                contentTxt = await helpers.convertToLang(req.translation[""], "Apps pushed to all selected devices. Action will be performed when devices back online");
            }
            else if (pushedAppsList.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Apps are Being Pushed on All Selected Devices");
            }

            if (failedToPush.length || queueAppsList.length || pushedAppsList.length) {

                // get user_device_ids and string device ids of online and offline devices
                let queue_dvc_ids = [];
                let queue_usr_dvc_ids = [];
                let pushed_dvc_ids = [];
                let pushed_usr_dvc_ids = [];

                let all_usr_dvc_ids = [];

                queueAppsList.forEach(item => {
                    queue_dvc_ids.push(item.device_id);
                    queue_usr_dvc_ids.push(item.usr_device_id);
                });

                pushedAppsList.forEach(item => {
                    pushed_dvc_ids.push(item.device_id);
                    pushed_usr_dvc_ids.push(item.usr_device_id);
                });
                all_usr_dvc_ids = [...queue_usr_dvc_ids, ...pushed_usr_dvc_ids];

                req.body["device_ids"] = all_usr_dvc_ids;
                req.body["action_by"] = dealer_id;
                device_helpers.saveBuklActionHistory(req.body, constants.BULK_PUSHED_APPS);

                data = {
                    status: true,
                    online: pushedAppsList.length ? true : false,
                    offline: queueAppsList.length ? true : false,
                    failed: failedToPush.length ? true : false,
                    msg: messageTxt,
                    content: contentTxt,
                    data: {
                        failed_device_ids: failedToPush,
                        queue_device_ids: queue_dvc_ids,
                        pushed_device_ids: pushed_dvc_ids,
                    }
                };
            } else {
                data = {
                    status: false,
                    msg: 'Error while Processing'
                }
            }
            res.send(data);
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[""], "Data not found"),
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], "Error while Processing"),
            content: ""
        });
    }
};

// Pull Apps
exports.applyBulkPullApps = async function (req, res) {
    try {
        var verify = req.decoded;
        let selectedDevices = req.body.selectedDevices;
        // console.log("applyBulkPullApps req.body::  ", req.body)

        if (verify && selectedDevices && selectedDevices.length && req.body.apps.length) {
            let dealer_id = verify.user.id;
            let pull_apps = req.body.apps;
            let noOfApps = pull_apps.length;

            let apps = pull_apps === undefined ? "[]" : JSON.stringify(pull_apps);

            let failedToPull = [];
            let queueAppsList = [];
            let pulledAppsList = [];

            for (let index = 0; index < selectedDevices.length; index++) {

                var applyQuery = `INSERT INTO device_history (device_id,dealer_id,user_acc_id, pull_apps, type, action_by, dealer_type) VALUES ('${selectedDevices[index].device_id}', ${dealer_id}, ${selectedDevices[index].usrAccId}, '${apps}', 'pull_apps', ${verify.user.id}, '${verify.user.user_type}');`;
                // console.log("applyQuery for bulk pull apps ", applyQuery)
                let rslts = await sql.query(applyQuery);

                if (rslts && rslts.affectedRows) {
                    let isOnline = await device_helpers.isDeviceOnline(selectedDevices[index].device_id);
                    //job Queue query
                    var loadDeviceQ = `INSERT INTO apps_queue_jobs (device_id,action,type,total_apps,is_in_process) VALUES ('${selectedDevices[index].device_id}', 'pull', 'pull', ${noOfApps}, 1);`;
                    sql.query(loadDeviceQ);
                    if (isOnline) {
                        // console.log("device is online")
                        socket_helpers.getPullApps(sockets.baseIo, rslts.insertId, apps, selectedDevices[index].device_id);
                        pulledAppsList.push({ device_id: selectedDevices[index].device_id, usr_device_id: selectedDevices[index].usr_device_id });
                    } else {
                        // console.log("device is offline")
                        // socket_helpers.getPullApps(sockets.baseIo, apps, selectedDevices[index].device_id);
                        queueAppsList.push({ device_id: selectedDevices[index].device_id, usr_device_id: selectedDevices[index].usr_device_id });
                    }

                    // res.send(data);
                } else {
                    failedToPull.push(selectedDevices[index].device_id);
                }
            } // end for loop

            let messageTxt = '';
            let contentTxt = '';

            if (failedToPull.length > 0) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Failed to Pull Apps");
            }
            else if (queueAppsList.length > 0) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Warning All Devices Are Offline");
                contentTxt = await helpers.convertToLang(req.translation[""], "Apps pulled from all selected devices. Action will be performed when devices back online");
            }
            else if (pulledAppsList.length > 0) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Apps are Being Pulled from All Selected Devices");
            }

            if (failedToPull.length || queueAppsList.length || pulledAppsList.length) {

                // get user_device_ids and string device ids of online and offline devices
                let queue_dvc_ids = [];
                let queue_usr_dvc_ids = [];
                let pulled_dvc_ids = [];
                let pulled_usr_dvc_ids = [];

                let all_usr_dvc_ids = [];

                queueAppsList.forEach(item => {
                    queue_dvc_ids.push(item.device_id);
                    queue_usr_dvc_ids.push(item.usr_device_id);
                });

                pulledAppsList.forEach(item => {
                    pulled_dvc_ids.push(item.device_id);
                    pulled_usr_dvc_ids.push(item.usr_device_id);
                });
                all_usr_dvc_ids = [...queue_usr_dvc_ids, ...pulled_usr_dvc_ids];

                req.body["device_ids"] = all_usr_dvc_ids;
                req.body["action_by"] = dealer_id;
                device_helpers.saveBuklActionHistory(req.body, constants.BULK_PULLED_APPS);

                data = {
                    status: true,
                    online: pulledAppsList.length ? true : false,
                    offline: queueAppsList.length ? true : false,
                    failed: failedToPull.length ? true : false,
                    msg: messageTxt,
                    content: contentTxt,
                    data: {
                        failed_device_ids: failedToPull,
                        queue_device_ids: queue_dvc_ids,
                        pushed_device_ids: pulled_dvc_ids,
                    }
                };
            } else {
                data = {
                    status: false,
                    msg: 'Error while Processing'
                }
            }
            res.send(data);
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[""], "Data not found"),
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], "Error while Processing"),
        });
    }
};

// Unlink Devices
exports.unlinkBulkDevices = async function (req, res) {

    try {
        var verify = req.decoded;
        // var device_id = req.params.id;
        let allDevices = req.body.selectedDevices;

        allDevices = allDevices ? JSON.parse(allDevices) : [];

        // console.log("allDevices unlinkBulkDevices =========>  ", allDevices);
        // return res.send({ status: true })
        if (verify && allDevices.length) {
            let loggedUserId = verify.user.id;

            let failedToUnlink = [];
            let onlineDevices = [];
            let offlineDevices = [];


            // console.log("device id:", device_id);

            for (let device of allDevices) {
                // let dvcId = await device_helpers.getDvcIDByDeviceID(device.usr_device_id); // integer device id (device_id)
                // console.log("dvc id:", dvcId); // string device id (dvcId)

                var sql1 = `UPDATE  usr_acc SET unlink_status = 1, device_status = 0 where device_id =${device.usr_device_id}`;
                let results = await sql.query(sql1);

                if (results && results.affectedRows) {

                    // check online/offline devices
                    let isOnline = await device_helpers.isDeviceOnline(device.device_id);
                    if (isOnline) {
                        // console.log("device is online")
                        onlineDevices.push({ device_id: device.device_id, usr_device_id: device.usr_device_id });
                        socket_helpers.sendDeviceStatus(sockets.baseIo, device.device_id, "unlinked", true);
                    } else {
                        // console.log("device is offline")
                        offlineDevices.push({ device_id: device.device_id, usr_device_id: device.usr_device_id });
                    }
                    console.log("bulk unlink device databulk: ", device);
                    device_helpers.saveActionHistory(device, constants.DEVICE_UNLINKED);

                    try {
                        axios
                            .post(
                                app_constants.SUPERADMIN_LOGIN_URL,
                                app_constants.SUPERADMIN_USER_CREDENTIALS,
                                { headers: {} }
                            )
                            .then(async function (response) {
                                // console.log("SUPER ADMIN LOGIN API RESPONSE", response);
                                if (response.data.status) {
                                    let data = {
                                        linkToWL: false,
                                        device_id: device.device_id
                                    };
                                    console.log("for SA DATA is:: ", data);
                                    axios.put(
                                        app_constants.UPDATE_DEVICE_SUPERADMIN_URL,
                                        data,
                                        {
                                            headers: {
                                                authorization:
                                                    response.data.user.token
                                            }
                                        }
                                    );
                                }
                            }).catch((err) => {
                                if (err) {
                                    console.log("SA SERVER NOT RESPONDING");
                                }
                            });

                    } catch (err) {
                        console.log(err);
                    }

                    // data = {
                    //     status: true,
                    //     msg: await helpers.convertToLang(
                    //         req.translation[MsgConstants.DEVICE_UNLNK_SUCC],
                    //         "Device unlinked successfully"
                    //     ) // Device unlinked successfully.
                    // };
                } else {
                    // data = {
                    //     status: false,
                    //     msg: await helpers.convertToLang(
                    //         req.translation[MsgConstants.DEVICE_NOT_UNLNK],
                    //         "Device not unlinked"
                    //     ) // Device not unlinked.
                    // };
                    failedToUnlink.push(device.device_id);
                }
                // res.send(data);
                // return;

            }

            let messageTxt = '';
            let contentTxt = '';

            if (failedToUnlink.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices Failed to unlink. Please try again")
            }
            else if (offlineDevices.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Warning All Selected Devices Are Offline");
                contentTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices will Unlink Soon. Action will be performed when devices back online");
            }
            else if (onlineDevices.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices Unklinked successfully")
            }

            if (failedToUnlink.length || onlineDevices.length || offlineDevices.length) {

                // get user_device_ids and string device ids of online and offline devices
                let queue_dvc_ids = [];
                let queue_usr_dvc_ids = [];
                let pushed_dvc_ids = [];
                let pushed_usr_dvc_ids = [];

                let all_usr_dvc_ids = [];

                offlineDevices.forEach(item => {
                    queue_dvc_ids.push(item.device_id);
                    queue_usr_dvc_ids.push(item.usr_device_id);
                });

                onlineDevices.forEach(item => {
                    pushed_dvc_ids.push(item.device_id);
                    pushed_usr_dvc_ids.push(item.usr_device_id);
                });
                all_usr_dvc_ids = [...queue_usr_dvc_ids, ...pushed_usr_dvc_ids];

                req.body["device_ids"] = all_usr_dvc_ids;
                req.body["action_by"] = loggedUserId;
                // console.log('save bulk history')
                device_helpers.saveBuklActionHistory(req.body, constants.BULK_UNLINKED_DEVICES);

                data = {
                    status: true,
                    online: onlineDevices.length ? true : false,
                    offline: offlineDevices.length ? true : false,
                    failed: failedToUnlink.length ? true : false,
                    msg: messageTxt,
                    content: contentTxt,
                    data: {
                        failed_device_ids: failedToUnlink,
                        queue_device_ids: queue_dvc_ids,
                        pushed_device_ids: pushed_dvc_ids,
                    }
                };
            } else {
                data = {
                    status: false,
                    msg: 'Error while Processing'
                }
            }
            // console.log("response data is: ", data)
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
            return;
        }
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation["MsgConstants.ERROR_PROC"], "Error while Processing"),
        });
    }
};

// Wipe Devices
exports.wipeBulkDevices = async function (req, res) {
    try {
        var verify = req.decoded;
        // console.log("wipeBulkDevices ", req.body);
        let wipePassword = req.body.wipePassword;

        // console.log("wipePassword ", wipePassword);

        let checkWipePassQ = `SELECT * FROM passwords WHERE password_type = 'wipe' AND password = '${wipePassword}';`;
        // console.log("checkWipePassQ ", checkWipePassQ);
        let checkWipePassResult = await sql.query(checkWipePassQ);

        // console.log("checkWipePassresult ", checkWipePassResult);

        // return res.send({ status: false, msg: "error" })
        let device_ids = req.body.selectedDevices;
        device_ids = device_ids ? device_ids : [];
        if (checkWipePassResult && checkWipePassResult.length) {
            if (verify && device_ids && device_ids.length) {
                let loggedUserId = verify.user.id;

                let failedToWipe = [];
                let onlineDevices = [];
                let offlineDevices = [];

                for (let device_id of device_ids) {

                    var deviceQuery = "select devices.*  ," + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.reject_status = 0 AND devices.id= "' + device_id + '"';
                    var resquery = await sql.query(deviceQuery);
                    if (device_id && resquery && resquery.length) {
                        var sql1 = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, type, action_by, dealer_type) VALUES ('" +
                            resquery[0].device_id +
                            "'," +
                            resquery[0].dealer_id +
                            "," +
                            resquery[0].id +
                            ", 'wipe', " + verify.user.id + ", '" + verify.user.user_type + "')";

                        let results = await sql.query(sql1);

                        if (results.affectedRows == 0) {
                            failedToWipe.push(resquery[0].dealer_id);
                        } else {
                            let wipe_device_date = await sql.query("SELECT created_at FROM device_history WHERE id= " + results.insertId)
                            let historyUpdate = "UPDATE device_history SET status=1 WHERE user_acc_id=" + resquery[0].id + " AND (type = 'push_apps' || type = 'pull_apps' || type = 'policy' || type = 'profile') AND created_at <= '" + wipe_device_date[0].created_at + "'";
                            sql.query(historyUpdate);

                            if (resquery[0].online === constants.DEVICE_ONLINE) {
                                socket_helpers.sendDeviceStatus(sockets.baseIo,
                                    resquery[0].device_id,
                                    constants.DEVICE_WIPE
                                );
                                onlineDevices.push({ device_id: resquery[0].device_id, usr_device_id: resquery[0].usr_device_id });

                                // Need to remove this code after APP TEAM release
                                var clearWipeDevice = "UPDATE device_history SET status=1 WHERE type='wipe' AND user_acc_id=" + resquery[0].id + "";
                                sql.query(clearWipeDevice)
                            } else {
                                offlineDevices.push({ device_id: resquery[0].device_id, usr_device_id: resquery[0].usr_device_id });
                            }

                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                            let servicesData = await device_helpers.getServicesData(resquery[0].id);
                            let servicesIds = servicesData.map(item => { return item.id })
                            let userAccServiceData = []
                            let data_plans = []
                            if (servicesIds.length) {
                                userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                                data_plans = await device_helpers.getDataPlans(servicesIds)
                            }
                            resquery[0].sim_id = "N/A"
                            resquery[0].sim_id2 = "N/A"
                            resquery[0].pgp_email = "N/A"
                            resquery[0].chat_id = "N/A"

                            let services = servicesData;
                            let service_id = null
                            if (services && services.length) {
                                services.map((item) => {
                                    if (item.status === 'extended') {
                                        resquery[0].extended_services = item
                                    } else {
                                        resquery[0].services = item
                                        service_id = item.id
                                    }
                                })
                            }

                            let productsData = userAccServiceData.filter(item => item.user_acc_id === resquery[0].id && item.service_id === service_id);
                            if (productsData && productsData.length) {
                                productsData.map((item) => {
                                    if (item.type === 'sim_id') {
                                        resquery[0].sim_id = item.product_value
                                    }
                                    else if (item.type === 'sim_id2') {
                                        resquery[0].sim_id2 = item.product_value
                                    }
                                    else if (item.type === 'pgp_email') {
                                        resquery[0].pgp_email = item.product_value
                                    }
                                    else if (item.type === 'chat_id') {
                                        resquery[0].chat_id = item.product_value
                                    }
                                })
                            }

                            let sim_id_data_plan = data_plans.filter((item) => item.sim_type == 'sim_id')
                            resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                            let sim_id2_data_plan = data_plans.filter((item) => item.sim_type == 'sim_id2')
                            resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]

                            device_helpers.saveActionHistory(
                                resquery[0],
                                constants.DEVICE_WIPE
                            );
                        }
                    } else {
                        failedToWipe.push(resquery[0].dealer_id);
                    }
                } // end of for loop


                let messageTxt = '';
                let contentTxt = '';

                if (failedToWipe.length) {
                    messageTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices Failed to wipe. Please try again")
                }
                else if (offlineDevices.length) {
                    messageTxt = await helpers.convertToLang(req.translation[""], "Warning All Selected Devices Are Offline");
                    contentTxt = await helpers.convertToLang(req.translation[""], "Wipe command sent to All Selected Devices. Action will be performed when devices back online");
                }
                else if (onlineDevices.length) {
                    messageTxt = await helpers.convertToLang(req.translation[""], "All Selected Devices Wiped successfully")
                }

                if (failedToWipe.length || onlineDevices.length || offlineDevices.length) {

                    // get user_device_ids and string device ids of online and offline devices
                    let queue_dvc_ids = [];
                    let queue_usr_dvc_ids = [];
                    let pushed_dvc_ids = [];
                    let pushed_usr_dvc_ids = [];

                    let all_usr_dvc_ids = [];

                    offlineDevices.forEach(item => {
                        queue_dvc_ids.push(item.device_id);
                        queue_usr_dvc_ids.push(item.usr_device_id);
                    });

                    onlineDevices.forEach(item => {
                        pushed_dvc_ids.push(item.device_id);
                        pushed_usr_dvc_ids.push(item.usr_device_id);
                    });
                    all_usr_dvc_ids = [...queue_usr_dvc_ids, ...pushed_usr_dvc_ids];

                    req.body["device_ids"] = all_usr_dvc_ids;
                    req.body["action_by"] = loggedUserId;
                    // console.log('save bulk history')
                    device_helpers.saveBuklActionHistory(req.body, constants.BULK_WIPED_DEVICES);

                    data = {
                        status: true,
                        online: onlineDevices.length ? true : false,
                        offline: offlineDevices.length ? true : false,
                        failed: failedToWipe.length ? true : false,
                        msg: messageTxt,
                        content: contentTxt,
                        data: {
                            failed_device_ids: failedToWipe,
                            queue_device_ids: queue_dvc_ids,
                            pushed_device_ids: pushed_dvc_ids,
                        }
                    };
                } else {
                    data = {
                        status: false,
                        msg: 'Error while Processing To Wipe Devices'
                    }
                }
                // console.log("response data is: ", data)
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
        } else {
            data = {
                status: false,
                wipePassNotMatch: true,
                msg: await helpers.convertToLang(
                    req.translation[""],
                    "Password wrong to wipe bulk devices"
                )
            };
            res.send(data);
        }
    } catch (err) {
        console.log(err);
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


// Apply Policy
exports.applyBulkPolicy = async function (req, res) {
    try {
        var verify = req.decoded;
        let allDevices = req.body.selectedDevices;
        let policy_id = req.body.policyId;

        if (verify && allDevices && allDevices.length && policy_id) {
            let dealer_id = verify.user.id

            let failedToApply = [];
            let onlineDevices = [];
            let offlineDevices = [];

            let getPolicyQ = `SELECT * FROM policy WHERE id=${policy_id}`;
            let policy = await sql.query(getPolicyQ)
            policy = await helpers.refactorPolicy(policy);


            for (let device of allDevices) {
                let userAccId = device.usrAccId; // await device_helpers.getUsrAccIDbyDvcId(device.usr_device_id);

                var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type, action_by, dealer_type) VALUES ('" + device.device_id + "'," + dealer_id + "," + userAccId + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy', " + verify.user.id + ", '" + verify.user.user_type + "')";
                let policyApplied = await sql.query(applyQuery);

                if (policyApplied && policyApplied.insertId) {
                    var loadDeviceQ = "INSERT INTO policy_queue_jobs (policy_id,device_id,is_in_process) " + " VALUES ('" + policy_id + "','" + device.device_id + "',1)"
                    sql.query(loadDeviceQ)

                    let isOnline = await device_helpers.isDeviceOnline(device.device_id);
                    if (isOnline) {
                        socket_helpers.getPolicy(sockets.baseIo, policyApplied.insertId, device.device_id, policy[0]);
                        onlineDevices.push({ device_id: device.device_id, usr_device_id: device.usr_device_id });

                    } else {
                        offlineDevices.push({ device_id: device.device_id, usr_device_id: device.usr_device_id });
                    }
                } else {
                    failedToApply.push(device.device_id);
                }

            } // end for loop

            let messageTxt = '';
            let contentTxt = '';

            if (failedToApply.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Failed to Applied Policy on All Selected Devices . Please try again")
            }
            else if (offlineDevices.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Warning All Selected Devices Are Offline");
                contentTxt = await helpers.convertToLang(req.translation[""], "Policy will be Applied Soon on all Selected Devices. Action will be performed when devices back online");
            }
            else if (onlineDevices.length) {
                messageTxt = await helpers.convertToLang(req.translation[""], "Policy is Being Applied on all selected devices")
            }

            if (failedToApply.length || onlineDevices.length || offlineDevices.length) {

                // get user_device_ids and string device ids of online and offline devices
                let queue_dvc_ids = [];
                let queue_usr_dvc_ids = [];
                let pushed_dvc_ids = [];
                let pushed_usr_dvc_ids = [];

                let all_usr_dvc_ids = [];

                offlineDevices.forEach(item => {
                    queue_dvc_ids.push(item.device_id);
                    queue_usr_dvc_ids.push(item.usr_device_id);
                });

                onlineDevices.forEach(item => {
                    pushed_dvc_ids.push(item.device_id);
                    pushed_usr_dvc_ids.push(item.usr_device_id);
                });
                all_usr_dvc_ids = [...queue_usr_dvc_ids, ...pushed_usr_dvc_ids];

                req.body["device_ids"] = all_usr_dvc_ids;
                req.body["action_by"] = dealer_id;
                req.body["policy"] = policy;
                // console.log('save bulk history')
                device_helpers.saveBuklActionHistory(req.body, constants.BULK_PUSHED_POLICY);

                data = {
                    status: true,
                    online: onlineDevices.length ? true : false,
                    offline: offlineDevices.length ? true : false,
                    failed: failedToApply.length ? true : false,
                    msg: messageTxt,
                    content: contentTxt,
                    data: {
                        failed_device_ids: failedToApply,
                        queue_device_ids: queue_dvc_ids,
                        pushed_device_ids: pushed_dvc_ids,
                    }
                };
            } else {
                data = {
                    status: false,
                    msg: 'Error while Processing'
                }
            }
            // console.log("response data is: ", data)
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
            return;
        }
    } catch (error) {
        console.log(error)
        res.send({
            status: false,
            msg: 'Error while Processing'
        })
    }
}


// Send Messages
exports.sendBulkMsg = async function (req, res) {
    console.log("req body sendBulkMsg ==> ", req.body);
    let device_ids = [];
    let user_device_ids = [];

    try {
        var verify = req.decoded;
        let allDevices = req.body.data.devices;
        let dealerIds = req.body.data.dealer_ids;
        let userIds = req.body.data.user_ids;
        let txtMsg = req.body.data.msg ? html.escape(req.body.data.msg) : '';
        let timer = req.body.data.timer ? req.body.data.timer : '';
        let repeat = req.body.data.repeat ? req.body.data.repeat : ''; // daily, weekly, etc...
        let dateTime = req.body.data.dateTime;
        let weekDay = req.body.data.weekDay ? req.body.data.weekDay : 0;
        let monthDate = req.body.data.monthDate ? req.body.data.monthDate : 0; // 1 - 31
        let monthName = req.body.data.monthName ? req.body.data.monthName : 0; // for 12 months e.g February
        let time = req.body.data.time;
        let intervalTime = 0; // calculate for repeat (no need of interval time)
        let dealerTZ = req.body.timezone;

        allDevices.forEach((item) => {
            device_ids.push(item.device_id);
            user_device_ids.push(item.usr_device_id);
        });

        let valid_conditions = true;

        // Form data Validations
        if (timer === "NOW") { // 01
            dateTime = dealerTZ ? moment.tz(dealerTZ).tz(app_constants.TIME_ZONE).format(constants.TIMESTAMP_FORMAT) : moment().tz(app_constants.TIME_ZONE).format(constants.TIMESTAMP_FORMAT);
            repeat = "NONE";
        }
        else if (timer === "DATE/TIME") { // 02
            repeat = "NONE";
            if (!dateTime) valid_conditions = false;
        }
        else if (timer === "REPEAT") { // 03
            if (repeat === "DAILY") {
                if (!time) {
                    valid_conditions = false;
                }
                // intervalTime = 1440;
            } else if (repeat === "WEEKLY") {
                if (!time && !weekDay) {
                    valid_conditions = false;
                }
                // intervalTime = 10080;
            } else if (repeat === "MONTHLY" || repeat === "3 MONTHS" || repeat === "6 MONTHS") {
                if (!time && !weekDay && !monthDate) {
                    valid_conditions = false;
                }
                // if (repeat === "MONTHLY") intervalTime = 43829;
                // if (repeat === "3 MONTHS") intervalTime = 131487;
                // if (repeat === "6 MONTHS") intervalTime = 262975;

            } else if (repeat === "12 MONTHS") {
                if (!time && !weekDay && !monthName) {
                    valid_conditions = false;
                }
                // intervalTime = 525949;
            }
        }
        else { // 04
            valid_conditions = false;
        }
        // end validation process

        if (verify && allDevices && allDevices.length && txtMsg && valid_conditions) {
            let loggedUserId = verify.user.id;

            let dataObj = {
                action_by: loggedUserId,
                device_ids: user_device_ids,
                dealer_ids: dealerIds,
                user_ids: userIds,
                msg: txtMsg,
                timer,
                repeat,
                dateTime,
                weekDay,
                monthDate,
                monthName,
                // time
            }
            // console.log("dataObj ", dataObj)

            let response = await device_helpers.saveBuklMsg(dataObj);
            // console.log("response ", response);
            let device_detail = await device_helpers.getCompleteDetailOfDevice(user_device_ids);

            if (response.status) {
                for (let device_id of device_ids) {
                    var insertJobQueue = `INSERT INTO task_schedules (task_id, device_id, title, interval_status, interval_time, interval_description, next_schedule, last_execution_time, week_day, month_day, month_name, action_by) 
                    VALUES (${response.insertId}, '${device_id}','${txtMsg}','${timer}', ${intervalTime}, '${repeat}', '${dateTime}', '${dateTime}', ${weekDay}, ${monthDate}, ${monthName}, ${loggedUserId});`;
                    // console.log("insertJobQueue ", insertJobQueue);
                    let response_data = await sql.query(insertJobQueue);
                }

                //************************** update inter description text and date time value w.r.t dealer timezone  *************/ 
                let msgData = response.responseData[0];
                let duration = msgData.repeat_duration ? msgData.repeat_duration : "NONE";

                if (msgData.timer_status === "NOW" || msgData.timer_status === "DATE/TIME") {
                    duration = `One Time`
                }
                else if (msgData.timer_status === "REPEAT") {
                    if (duration === "DAILY") {
                        duration = `Everyday`
                    }
                    else if (duration === "WEEKLY") {
                        duration = await helpers.getWeekDay(msgData.week_day)
                    }
                    else if (duration === "MONTHLY") {
                        duration = `Every month on ${await helpers.checkValue(msgData.month_date)} date`
                    }
                    else if (duration === "3 MONTHS") {
                        duration = `Every 3 months later on ${await helpers.checkValue(msgData.month_date)} date`
                    }
                    else if (duration === "6 MONTHS") {
                        duration = `Every 6 months later on ${await helpers.checkValue(msgData.month_date)} date`
                    }
                    else if (duration === "12 MONTHS") {
                        duration = `Every ${await helpers.getMonthName(msgData.month_name)} on ${await helpers.checkValue(msgData.month_date)} date`
                    } else {
                        duration = "N/A"
                    }
                } else {
                    duration = "N/A"
                }

                let convertDateTime = msgData.date_time && msgData.date_time !== "N/A" && msgData.date_time !== "n/a" && msgData.date_time !== "0000-00-00 00:00:00" && dealerTZ ? moment.tz(msgData.date_time, app_constants.TIME_ZONE).tz(dealerTZ).format(constants.TIMESTAMP_FORMAT) : "N/A";
                msgData["msg"] = html.unescape(msgData.msg);
                msgData["date_time"] = convertDateTime;
                msgData["interval_description"] = duration;
                // end to update msg data w.r.t dealer timezone

                // console.log("last inserted msg record: ", msgData);
                data = {
                    status: true,
                    msg: "Bulk message saved successfully",
                    devices: device_detail ? JSON.stringify(device_detail) : '[]',
                    lastMsg: msgData
                }
            } else {
                data = {
                    status: false,
                    msg: "Failed to save bulk message"
                }
            }
            res.send(data);

        } else {
            data = {
                status: false,
                msg: "Invalid Data"
            };
            res.send(data);
            return;
        }

    } catch (error) {
        console.log(error)
        res.send({
            status: false,
            msg: 'Error while Processing'
        })
    }
}

// Update Messages
exports.updateBulkMsg = async function (req, res) {
    console.log("req body updateBulkMsg ==> ", req.body);
    try {
        var verify = req.decoded;
        let updateId = req.body.data.id;
        let txtMsg = req.body.data.msg ? req.body.data.msg : '';
        let timer = req.body.data.timer_status ? req.body.data.timer_status : '';
        let repeat = req.body.data.repeat_duration ? req.body.data.repeat_duration : ''; // daily, weekly, etc...
        let dateTime = req.body.data.date_time && req.body.data.date_time !== "N/A" ? req.body.data.date_time : '';
        let weekDay = req.body.data.week_day ? req.body.data.week_day : 0;
        let monthDate = req.body.data.month_date ? req.body.data.month_date : 0; // 1 - 31
        let monthName = req.body.data.month_name ? req.body.data.month_name : 0; // for 12 months
        let time = req.body.data.time;
        let intervalTime = 0; // calculate for repeat
        let dealerTZ = req.body.timezone;

        let valid_conditions = true;

        // Form data Validations
        if (timer === "NOW") { // 01
            dateTime = dealerTZ ? moment.tz(dealerTZ).tz(app_constants.TIME_ZONE).format(constants.TIMESTAMP_FORMAT) : moment().tz(app_constants.TIME_ZONE).format(constants.TIMESTAMP_FORMAT);
            repeat = "NONE";
        }
        else if (timer === "DATE/TIME") { // 02
            repeat = "NONE";
            if (!dateTime) valid_conditions = false;
        }
        else if (timer === "REPEAT") { // 03
            // console.log("at repeat")
            if (repeat === "DAILY") {
                // console.log("at repeat daily", time, time ? true: false)
                if (!time) {
                    // console.log("at repeat with time true")
                    valid_conditions = false;
                }
                // intervalTime = 1440;
            } else if (repeat === "WEEKLY") {
                if (!time && !weekDay) {
                    valid_conditions = false;
                }
                // intervalTime = 10080;
            } else if (repeat === "MONTHLY" || repeat === "3 MONTHS" || repeat === "6 MONTHS") {
                if (!time && !weekDay && !monthDate) {
                    valid_conditions = false;
                }
                // if (repeat === "MONTHLY") intervalTime = 43829;
                // if (repeat === "3 MONTHS") intervalTime = 131487;
                // if (repeat === "6 MONTHS") intervalTime = 262975;

            } else if (repeat === "12 MONTHS") {
                if (!time && !weekDay && !monthName) {
                    valid_conditions = false;
                }
                // intervalTime = 525949;
            }
        }
        else { // 04
            valid_conditions = false;
        }
        // end validation process

        if (verify && txtMsg && valid_conditions) {
            let loggedUserId = verify.user.id

            let updateMsgQuery = `UPDATE bulk_messages SET msg='${txtMsg}', timer_status = '${timer}', repeat_duration='${repeat}',  date_time='${dateTime}', week_day=${weekDay}, month_date=${monthDate}, month_name= ${monthName} WHERE id = ${updateId}`
            console.log("updateMsgQuery ", updateMsgQuery);
            let result = await sql.query(updateMsgQuery);

            if (result && result.affectedRows) {

                // Update task Scheduling data
                var updateJobQueue = `UPDATE task_schedules SET title = '${txtMsg}', interval_status = '${timer}', interval_time = ${intervalTime}, interval_description = '${repeat}', next_schedule = '${dateTime}', week_day = ${weekDay}, month_day = ${monthDate}, month_name = ${monthName} WHERE task_id = ${updateId} AND action_by = ${loggedUserId} AND status = 'NEW';`;
                console.log("updateJobQueue ", updateJobQueue);
                let response_data = await sql.query(updateJobQueue);

                data = {
                    status: true,
                    msg: "Message Setting update Successfully."
                }
            } else {
                data = {
                    status: false,
                    msg: "Failed to update message setting."
                }
            }
            res.send(data);

        } else {
            data = {
                status: false,
                msg: "Invalid Data"
            };
            res.send(data);
            return;
        }

    } catch (error) {
        console.log(error)
        res.send({
            status: false,
            msg: 'Error while Processing'
        })
    }
}


// get Bulk messages
exports.getBulkMsgsList = async function (req, res) {
    try {
        console.log("req.body =======> ", req.body);
        var verify = req.decoded;
        let loggedUserId = verify.user.id;
        let dealerTZ = req.body.timezone;

        if (verify) {

            var selectQuery = `SELECT id, device_ids, repeat_duration, timer_status, msg, date_time, week_day, month_date, month_name, time, created_at FROM bulk_messages WHERE action_by = '${loggedUserId}' AND delete_status = 0 ORDER BY id DESC;`;
            var result = await sql.query(selectQuery);
            // console.log("result ", result)

            if (result && result.length) {

                for (let msgData of result) {

                    // get devices list of bulk msgs
                    let devicesList = "[]";
                    let deviceIds = msgData.device_ids ? JSON.parse(msgData.device_ids) : [];
                    // console.log("deviceIds before get detail: ", deviceIds);
                    if (deviceIds && deviceIds.length) {
                        let device_detail = await device_helpers.getCompleteDetailOfDevice(deviceIds);
                        devicesList = JSON.stringify(device_detail);
                    }

                    let duration = msgData.repeat_duration ? msgData.repeat_duration : "NONE";

                    // start set interval description w.r.t timer status
                    if (msgData.timer_status === "NOW" || msgData.timer_status === "DATE/TIME") {
                        duration = `One Time`
                    }
                    else if (msgData.timer_status === "REPEAT") {
                        if (duration === "DAILY") {
                            duration = `Everyday`
                        }
                        else if (duration === "WEEKLY") {
                            duration = await helpers.getWeekDay(msgData.week_day)
                        }
                        else if (duration === "MONTHLY") {
                            duration = `Every month on ${await helpers.checkValue(msgData.month_date)} date`
                        }
                        else if (duration === "3 MONTHS") {
                            duration = `Every 3 months later on ${await helpers.checkValue(msgData.month_date)} date`
                        }
                        else if (duration === "6 MONTHS") {
                            duration = `Every 6 months later on ${await helpers.checkValue(msgData.month_date)} date`
                        }
                        else if (duration === "12 MONTHS") {
                            duration = `Every ${await helpers.getMonthName(msgData.month_name)} on ${await helpers.checkValue(msgData.month_date)} date`
                        } else {
                            duration = "N/A"
                        }
                    } else {
                        duration = "N/A"
                    }
                    // end set interval description w.r.t timer status

                    let convertDateTime = msgData.date_time && msgData.date_time !== "N/A" && msgData.date_time !== "n/a" && msgData.date_time !== "0000-00-00 00:00:00" && dealerTZ ? moment.tz(msgData.date_time, app_constants.TIME_ZONE).tz(dealerTZ).format(constants.TIMESTAMP_FORMAT) : "N/A";
                    msgData["msg"] = html.unescape(msgData.msg);
                    msgData["date_time"] = convertDateTime;
                    msgData["interval_description"] = duration;
                    msgData["devices"] = devicesList;
                }

                // console.log("final data: ", result);
                res.send({
                    status: true,
                    data: result
                });
            } else {
                res.send({ status: false });
            }

        }
    } catch (err) {
        console.log(err);
        res.send({ status: false })
    }
}


// delete Bulk message
exports.deleteBulkMsg = async function (req, res) {
    console.log("Api called: deleteBulkMsg");
    try {

        var verify = req.decoded;
        let loggedUserId = verify.user.id;
        let msgId = req.params.id;
        console.log('at deleteBulkMsg: msgId', msgId)
        if (verify && msgId) {

            var selectQuery = `UPDATE bulk_messages SET delete_status = 1 WHERE id=${msgId};`;
            var result = await sql.query(selectQuery);
            // console.log("result ", result)

            if (result && result.affectedRows) {

                let deleteJobQueue = `DELETE FROM task_schedules WHERE task_id = ${msgId};`;
                // console.log("delete api deleteJobQueue ", deleteJobQueue);
                sql.query(deleteJobQueue);
                res.send({
                    status: true,
                    msg: "Message Delete Successfully"
                });
            } else {
                res.send({ status: false, msg: 'Failded to delete message' });
            }

        }
    } catch (err) {
        console.log(err);
        res.send({ status: false, msg: 'Failded to delete message' })
    }
}