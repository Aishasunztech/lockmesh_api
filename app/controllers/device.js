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
const sockets = require("../../routes/sockets");

// helpers
const { sql } = require("../../config/database");
const device_helpers = require("../../helper/device_helpers");
const helpers = require("../../helper/general_helper");
const socket_helpers = require("../../helper/socket_helper");


// constants
const constants = require("../../constants/Application");
var MsgConstants = require("../../constants/MsgConstants");
const app_constants = require("../../config/constants");

const { createInvoice } = require('../../helper/CreateInvoice')

// constants

let usr_acc_query_text = constants.usr_acc_query_text; //"usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status, usr_acc.transfer_user_status, usr_acc.transfered_from,usr_acc.transfered_to, usr_acc.user_transfered_from, usr_acc.user_transfered_to,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"

var data;

/**GET all the devices**/
exports.devices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var where_con = "";
    let newArray = [];
    let query = ""
    if (verify) {
        if (verify.user.user_type !== constants.ADMIN) {
            if (verify.user.user_type === constants.DEALER) {
                where_con = ` AND (usr_acc.dealer_id =${
                    verify.user.id
                    } OR usr_acc.prnt_dlr_id = ${verify.user.id})`;
            } else {
                where_con = ` AND usr_acc.dealer_id = ${verify.user.id} `;

            }
            // query = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND dealer_id = ${
            //     verify.user.id
            //     } AND del_status IS NULL`;
        } else {
            // query = `SELECT * From acc_action_history WHERE action = 'UNLINKED' AND del_status IS NULL `;
        }
        // newArray = await sql.query(query);


        // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 ' + where_con + ' order by devices.id DESC');
        // sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer , pgp_emails.pgp_email,chat_ids.chat_id ,sim_ids.sim_id from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id LEFT JOIN pgp_emails on pgp_emails.user_acc_id = usr_acc.id LEFT JOIN chat_ids on chat_ids.user_acc_id = usr_acc.id LEFT JOIN sim_ids on sim_ids.device_id = usr_acc.device_id where usr_acc.transfer_status = 0 ' + where_con + ' order by devices.id DESC', function (error, results, fields) {
        // console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 ' + where_con + ' order by devices.id DESC');
        let deviceQuery = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE ((devices.reject_status = 0 AND usr_acc.del_status = 0) OR (usr_acc.relink_status = 1))  ${where_con} ORDER BY devices.id DESC`;

        sql.query(deviceQuery, async function (error, results, fields) {
            data = {
                status: false,
                data: []
            };
            if (error) {
                console.log(error);

            };

            // console.log("results ", results.length)
            if (results && results.length) {
                let devices_acc_array = [];
                let expired_devices_acc_array = [];
                let usr_device_ids_array = []
                for (let i = 0; i < results.length; i++) {
                    devices_acc_array.push(results[i].id)
                    usr_device_ids_array.push(results[i].usr_device_id)
                    if (results[i].status === 'expired') {
                        expired_devices_acc_array.push(results[i].id)
                    }
                }
                let user_acc_ids = devices_acc_array.join()
                let usr_device_ids = usr_device_ids_array.join()
                // let pgp_emails = await device_helpers.getPgpEmails(user_acc_ids);
                // let sim_ids = await device_helpers.getSimids(user_acc_ids);
                // let chat_ids = await device_helpers.getChatids(user_acc_ids);

                // ********  last online device data use from devices table not from login history
                // let loginHistoryData = await device_helpers.getLastLoginDetail(usr_device_ids)
                let servicesData = await device_helpers.getServicesData(user_acc_ids)
                let servicesIds = servicesData.map(item => { return item.id })

                let userAccServiceData = []
                let dataPlans = []
                if (servicesIds.length) {
                    userAccServiceData = await device_helpers.getUserAccServicesData(user_acc_ids, servicesIds)
                    dataPlans = await device_helpers.getDataPlans(servicesIds)
                }

                for (var i = 0; i < results.length; i++) {
                    results[i].sim_id = "N/A"
                    results[i].sim_id2 = "N/A"
                    results[i].pgp_email = "N/A"
                    results[i].chat_id = "N/A"
                    results[i].finalStatus = device_helpers.checkStatus(
                        results[i]
                    );
                    let service_id = null
                    let services = servicesData.filter(data => data.user_acc_id === results[i].id);
                    if (services && services.length) {
                        services.map((item) => {
                            if (results[i].finalStatus !== 'Expired') {
                                if (item.status === 'extended') {
                                    results[i].extended_services = item
                                } else {
                                    results[i].services = item
                                    service_id = item.id
                                }
                            } else {
                                if (item.status === 'completed') {
                                    results[i].services = item
                                    service_id = item.id
                                }
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
                    let sim_id_data_plan = dataPlans.filter((item) => item.service_id == service_id && item.sim_type == 'sim_id')
                    results[i].sim_id_data_plan = sim_id_data_plan[0]
                    let sim_id2_data_plan = dataPlans.filter((item) => item.service_id == service_id && item.sim_type == 'sim_id2')
                    results[i].sim_id2_data_plan = sim_id2_data_plan[0]
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

                    // let lastOnline = loginHistoryData.find(record => record.device_id == results[i].usr_device_id);
                    // if (lastOnline) {
                    // results[i].lastOnline = lastOnline.created_at

                    results[i].lastOnline = results[i].last_login ? results[i].last_login : "N/A"
                    // }

                    results[i].validity = await device_helpers.checkRemainDays(
                        results[i].created_at,
                        results[i].validity
                    );
                }
                // console.log("devices api: ", results);
                // let finalResult = [...results, ...newArray];
                let finalResult = results;

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

                data = {
                    status: true,
                    data: finalResult
                };
            }
            return res.send(data);
        });
    }
};
/**GET all the devices FOR CONNECT PAGE**/
exports.getDevicesForConnectPage = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var where_con = "";
    if (verify) {
        if (verify.user.user_type !== constants.ADMIN) {
            if (verify.user.user_type === constants.DEALER) {
                where_con = ` AND (usr_acc.dealer_id =${
                    verify.user.id
                    } OR usr_acc.prnt_dlr_id = ${verify.user.id})`;
            } else {
                where_con = ` AND usr_acc.dealer_id = ${verify.user.id} `;
            }
        }

        let deviceQuery = `SELECT devices.device_id,devices.flagged,usr_acc.user_id,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status, usr_acc.transfer_user_status FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0  ${where_con} ORDER BY devices.id DESC`;
        sql.query(deviceQuery, async function (error, results, fields) {
            data = {
                status: false,
                data: []
            };
            if (error) {
                console.log(error);
            };
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    results[i].finalStatus = device_helpers.checkStatus(
                        results[i]
                    );
                }
                results = results.filter((item) => item.finalStatus !== constants.DEVICE_PENDING_ACTIVATION && item.finalStatus !== constants.DEVICE_PRE_ACTIVATION && item.finalStatus !== constants.DEVICE_UNLINKED)
                data = {
                    status: true,
                    data: results
                };
            }
            return res.send(data);
        });
    }
};

exports.getDevicesForReport = async function (req, res) {
    var verify = req.decoded;
    var where_con = "";

    if (verify) {
        let user_type = verify.user.user_type;
        let dealer_id = req.params.dealer_id ? req.params.dealer_id : '';

        if (user_type === constants.DEALER && dealer_id === '') {
            let sDealerIds = await helpers.getSdealersByDealerId(verify.user.id);
            if (sDealerIds.length > 0) {
                where_con += ' AND ua.dealer_id IN (' + verify.user.id + ',' + sDealerIds.join(',') + ')'
            } else {
                where_con += ' AND ua.dealer_id = ' + verify.user.id
            }
        } else if (user_type === constants.ADMIN && dealer_id === '') {
            where_con = ''
        } else if (dealer_id !== '') {
            where_con += ' AND ua.dealer_id = ' + dealer_id
        }

        let deviceQuery = `SELECT d.device_id as device_id, ua.dealer_id as dealer_id FROM devices as d
            JOIN usr_acc as ua
                on ua.device_id = d.id
         WHERE d.reject_status = 0 AND d.device_id IS NOT NULL ${where_con} GROUP BY device_id`;
        console.log(deviceQuery);
        sql.query(deviceQuery, async function (error, results, fields) {
            data = {
                data: results,
                status: true
            };
            return res.send(data);

        });
    }
};


// /**GET New the devices**/
exports.newDevices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        // console.log("Dealer_Translations" , req.translation)
        var where_con = "";
        if (verify.user.user_type !== constants.ADMIN) {
            if (verify.user.user_type === constants.DEALER) {
                // console.log('done of dealer', verify.user.id)
                where_con = ` AND (usr_acc.dealer_id =${
                    verify.user.id
                    } ) `;
            } else {
                where_con = ` AND usr_acc.dealer_id = ${verify.user.id} `;
            }

            sql.query(
                `select devices.*, ${usr_acc_query_text} FROM devices LEFT JOIN usr_acc ON  (devices.id = usr_acc.device_id) WHERE (((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) OR (usr_acc.relink_status = 1)) AND devices.reject_status = 0 ${where_con} ORDER BY devices.id DESC`,
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        data = {
                            status: false
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
                }
            );
        } else {
            data = {
                status: false
            };
            res.send(data);
            return;
        }
    }
};

exports.acceptDevice = async function (req, res) {
    // res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let user_id = req.body.user_id;

        let pay_now = req.body.pay_now
        let userData = await helpers.getUserDataByUserId(user_id);

        let device_id = req.body.device_id;
        let device_name = userData[0].name;
        let device_email = userData[0].email;
        let client_id = req.body.client_id;
        let model = req.body.model;
        let dealer_id = req.body.dealer_id;
        let connected_dealer = req.body.connected_dealer;
        let usr_acc_id = req.body.usr_acc_id;
        let usr_device_id = req.body.usr_device_id;
        let policy_id = req.body.policy_id;
        let sim_id = req.body.sim_id == undefined ? "" : req.body.sim_id;
        var sim_id2 = req.body.sim_id2 ? req.body.sim_id2 : '';
        let chat_id = req.body.chat_id == undefined ? "" : req.body.chat_id;
        let pgp_email = req.body.pgp_email == undefined ? "" : req.body.pgp_email;
        var trial_status = 0;

        let start_date = moment().format("YYYY/MM/DD");
        let term = req.body.term

        let expiry_date = ''

        let products = (req.body.products) ? req.body.products : []
        let packages = (req.body.packages) ? req.body.packages : []
        let hardwares = req.body.hardwares ? req.body.hardwares : []
        let total_price = req.body.total_price;
        let discount = 0
        let hardwarePrice = req.body.hardwarePrice ? req.body.hardwarePrice : 0
        let discounted_price = total_price + hardwarePrice
        let invoice_subtotal = total_price + hardwarePrice
        if (pay_now) {
            discount = Math.ceil(((total_price + hardwarePrice) * 0.03));
            discounted_price = (total_price + hardwarePrice) - discount
        }
        let invoice_status = pay_now ? "PAID" : "UNPAID"
        let paid_credits = 0

        var basic_data_plan = {
            sim_id:
            {
                data_limit: 2000,
                pkg_price: 0,
                term: term,
                added_date: start_date
            },
            sim_id2:
            {
                data_limit: 2000,
                pkg_price: 0,
                term: term,
                added_date: start_date

            }
        }
        // console.log(req.body.data_plans)
        var data_plans = req.body.data_plans ? req.body.data_plans : basic_data_plan

        // if (pay_now) {
        //     total_price = total_price - (total_price * 0.03);
        // }
        let admin_profit = 0
        let dealer_profit = 0
        let endUser_pay_status = req.body.paid_by_user
        let admin_data = await sql.query("SELECT * from dealers WHERE type = 1")
        let data_plan_price = 0

        let sim_id_included = false
        let sim_id2_included = false

        if (packages.length) {
            packages.map((item) => {
                if (item.pkg_features.sim_id) {
                    sim_id_included = true
                }
                if (item.pkg_features.sim_id2) {
                    sim_id2_included = true
                }
            })
        }
        if (term === '' || term === null) {
            var status = 'expired';
        } else if (term == 0) {
            var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
            expiry_date = moment(trailDate).format("YYYY/MM/DD")
            var status = 'trial';
            trial_status = 1;
        }
        else {
            var status = 'active';
            expiry_date = helpers.getExpDateByMonth(start_date, term)
        }

        let loggedInUserData = await sql.query(`SELECT * FROM dealers WHERE dealer_id =${loggedDealerId}`)
        if (!loggedInUserData || loggedInUserData.length < 1) {
            res.send({
                status: false,
                msg: "Error: Dealer Data not found."
            });
            return
        }
        if (loggedDealerType !== constants.ADMIN) {
            if (loggedInUserData[0].account_balance_status == 'suspended') {
                res.send({
                    status: false,
                    msg: "Error: Your Account balance status is on restricted level 2. You cannot add a new device. Please Contact your admin"
                });
                return
            }
            else if (loggedInUserData[0].account_balance_status !== 'active' && !pay_now) {
                res.send({
                    status: false,
                    msg: "Error: Your Account balance status is restricted. You cannot use pay later function. Please Contact your admin"
                });
                return
            }
        }


        let user_credits = "SELECT * FROM financial_account_balance WHERE dealer_id=" + loggedDealerId
        sql.query(user_credits, async function (err, result) {
            if (err) {
                res.send({
                    status: false,
                    msg: "Error: Dealer Credits not found."
                });
                return
            }
            else {
                if (result[0].credits_limit > (result[0].credits - discounted_price)) {
                    res.send({
                        status: false,
                        msg: "Error: Your Credits limits will exceed after apply this service. Please select other services OR Purchase Credits."
                    });
                    return
                }
                if (result.length || term === '0' || !pay_now) {
                    let dealer_credits = (result.length) ? result[0].credits : 0
                    let dealer_credits_copy = dealer_credits
                    let admin_credits = 0
                    if (dealer_credits > discounted_price || term === '0' || !pay_now) {

                        if (!empty(usr_device_id)) {

                            if (packages.length || products.length) {

                                if (pay_now) {
                                    dealer_credits = dealer_credits - discounted_price
                                }
                                if (term !== '0') {
                                    let profitLoss = await helpers.calculateProfitLoss(packages, products, loggedDealerType)
                                    if (pay_now) {
                                        admin_profit = profitLoss.admin_profit - Math.ceil((profitLoss.admin_profit * 0.03))
                                        dealer_profit = profitLoss.dealer_profit - Math.ceil((profitLoss.dealer_profit * 0.03))
                                    } else {
                                        admin_profit = profitLoss.admin_profit
                                        dealer_profit = profitLoss.dealer_profit
                                    }
                                }

                                var checkDevice = `SELECT * FROM devices LEFT JOIN usr_acc ON (usr_acc.device_id = devices.id) WHERE devices.device_id = '${device_id}' `;

                                let checkDealer = "SELECT * FROM dealers where dealer_id =" + loggedDealerId
                                    ;
                                let dealer = await sql.query(checkDealer);
                                if (term == 0) {
                                    if (dealer[0].remaining_demos <= 0) {
                                        res.send({
                                            status: false,
                                            msg: await helpers.convertToLang(req.translation[""], "Your Demos Limit has been exceeded, you cannot use Trial Packages. Please Contact with you admin."), // "New Device Not Added Please try Again"
                                        });
                                        return;
                                    }
                                }
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
                                        if (checkDevicepgp.length) {
                                            res.send({
                                                status: false,
                                                msg: "PGP Email already taken"
                                            });
                                            return;
                                        }
                                        let checkUnique = `SELECT usr_acc.* FROM usr_acc WHERE account_email= '${device_email}' AND device_id != '${device_id}' AND user_id != '${user_id}'`
                                        sql.query(checkUnique, async (checkUniqueEror, success) => {
                                            if (checkUniqueEror) {
                                                res.send({
                                                    status: false,
                                                    msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "New Device Not Added Please try Again"
                                                });
                                                return;
                                            }

                                            if (success.length) {
                                                res.send({
                                                    status: false,
                                                    msg: "Account Email already taken."
                                                });
                                                return;
                                            } else if (dealer_id !== 0 && dealer_id !== null) {

                                                if (connected_dealer) {
                                                    // get connected dealer data
                                                    let connectedDealer = `SELECT * FROM dealers WHERE dealer_id = '${connected_dealer}';`;
                                                    let conn_dealer_result = await sql.query(connectedDealer);

                                                    common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'"

                                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + device_email + "', status = '" + status + "',trial_status = '" + trial_status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' , expiry_months = '" + term + "' , prnt_dlr_id=" + connected_dealer + ", prnt_dlr_name='" + conn_dealer_result[0].dealer_name + "' WHERE device_id = '" + usr_device_id + "'"

                                                } else {

                                                    common_Query = "UPDATE devices set name = '" + device_name + "',  model = '" + req.body.model + "' WHERE id = '" + usr_device_id + "'"
                                                    usr_acc_Query = "UPDATE usr_acc set user_id = '" + user_id + "' , account_email = '" + device_email + "', status = '" + status + "',trial_status = '" + trial_status + "',client_id = '" + client_id + "', device_status = 1, unlink_status=0 ,  start_date = '" + start_date + "' ,expiry_date = '" + expiry_date + "' , expiry_months = '" + term + "' WHERE device_id = '" + usr_device_id + "'"
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

                                                    let remaining_credits = dealer_credits

                                                    var transection_status = 'transferred'
                                                    if (!pay_now) {
                                                        transection_status = 'pending'
                                                    } else {
                                                        total_price = total_price - Math.ceil(Number(total_price * 0.03))
                                                        hardwarePrice = hardwarePrice - Math.ceil(Number((hardwarePrice * 0.03)))
                                                    }

                                                    if (data_plans.sim_id) {
                                                        let discount = 0
                                                        if (pay_now) {
                                                            discount = Math.ceil(Number((Number(data_plans.sim_id.pkg_price) * 0.03)))
                                                        }
                                                        data_plan_price += (Number(data_plans.sim_id.pkg_price) - discount)
                                                    }
                                                    if (data_plans.sim_id2) {
                                                        let discount = 0
                                                        if (pay_now) {
                                                            discount = Math.ceil(Number((Number(data_plans.sim_id2.pkg_price) * 0.03)))
                                                        }
                                                        data_plan_price += (Number(data_plans.sim_id2.pkg_price) - discount)
                                                    }

                                                    let service_billing = `INSERT INTO services_data (user_acc_id , dealer_id , products, packages , total_credits, start_date, service_expiry_date , service_term ) VALUES (${usr_acc_id},${dealer_id}, '${JSON.stringify(products)}','${JSON.stringify(packages)}',${total_price - data_plan_price} ,'${start_date}',  '${expiry_date}' ,'${term}' )`

                                                    let service_data_result = await sql.query(service_billing);
                                                    let service_id = null
                                                    if (service_data_result.affectedRows) {
                                                        service_id = service_data_result.insertId
                                                        helpers.saveServiceSalesDetails(JSON.parse(JSON.stringify(packages)), products, loggedDealerType, usr_acc_id, service_data_result.insertId, pay_now)
                                                    }

                                                    let dealer_credits_remaining = true
                                                    if (pay_now) {
                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${total_price} ,'credit' , '${transection_status}' , 'services' , ${total_price} , ${0})`
                                                        await sql.query(transection_credits)
                                                    }
                                                    else {
                                                        let transection_due_credits = total_price;
                                                        if (dealer_credits_copy > 0) {
                                                            if (dealer_credits_copy < total_price) {
                                                                transection_due_credits = total_price - dealer_credits_copy
                                                                paid_credits = dealer_credits_copy
                                                                let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${total_price} ,'credit' , '${transection_status}' , 'services' , ${paid_credits} , ${transection_due_credits})`
                                                                await sql.query(transection_credits)
                                                                dealer_credits_remaining = false
                                                            } else {
                                                                dealer_credits_copy -= total_price
                                                                let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${total_price} ,'credit' , 'transferred' , 'services' , ${total_price} ,0)`
                                                                await sql.query(transection_credits)
                                                            }
                                                            invoice_status = "PARTIALLY PAID"
                                                        } else {
                                                            let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${total_price} ,'credit' , 'pending' , 'services' , 0 ,${total_price})`
                                                            await sql.query(transection_credits)
                                                            dealer_credits_remaining = false
                                                        }
                                                    }

                                                    let update_credits_query = '';
                                                    if (pay_now) {
                                                        update_credits_query = 'update financial_account_balance set credits =' + remaining_credits + ' where dealer_id ="' + dealer_id + '"';
                                                    } else {
                                                        update_credits_query = 'update financial_account_balance set credits = credits - ' + (total_price + hardwarePrice) + ' where dealer_id ="' + dealer_id + '"';
                                                    }
                                                    await sql.query(update_credits_query);

                                                    if (hardwares.length) {
                                                        let dealer_hardware_profit = 0
                                                        let admin_hardware_profit = 0

                                                        let hardwareProfits = await helpers.calculateHardwareProfitLoss(hardwares, loggedDealerType)
                                                        // console.log(hardwareProfits);
                                                        if (pay_now) {
                                                            admin_hardware_profit = hardwareProfits.admin_profit - Math.ceil((hardwareProfits.admin_profit * 0.03))
                                                            dealer_hardware_profit = hardwareProfits.dealer_profit - Math.ceil((hardwareProfits.dealer_profit * 0.03))
                                                        } else {
                                                            admin_hardware_profit = hardwareProfits.admin_profit
                                                            dealer_hardware_profit = hardwareProfits.dealer_profit
                                                        }

                                                        let profit_status = transection_status === 'transferred' ? transection_status : 'holding'

                                                        if (admin_hardware_profit > 0) {
                                                            let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${admin_hardware_profit} ,'debit' , '${profit_status}' , 'hardwares')`
                                                            await sql.query(transection_credits)
                                                            if (pay_now) {
                                                                let update_admin_credits = `UPDATE financial_account_balance SET credits = credits + ${admin_hardware_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
                                                                await sql.query(update_admin_credits)
                                                            }
                                                        }

                                                        if (dealer_hardware_profit > 0) {
                                                            let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${dealer_hardware_profit} ,'debit' , '${profit_status}' , 'hardwares')`
                                                            await sql.query(transection_credits)
                                                            if (pay_now) {
                                                                let update_dealer_credits = `UPDATE financial_account_balance SET credits = credits + ${dealer_hardware_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
                                                                await sql.query(update_dealer_credits)
                                                            }
                                                        }
                                                        for (let i = 0; i < hardwares.length; i++) {
                                                            let price = hardwares[i].hardware_price
                                                            if (pay_now) {
                                                                price = price - Math.ceil(Number((price * 0.03)))
                                                            }
                                                            let admin_cost = 0
                                                            let dealer_cost = 0
                                                            let result = await sql.query("SELECT * FROM dealer_hardwares_prices WHERE hardware_id =" + hardwares[i].id + " AND created_by = 'super_admin'")
                                                            // console.log(result);
                                                            if (result.length) {
                                                                admin_cost = result[0].price
                                                            }
                                                            if (loggedUserType === constants.SDEALER) {
                                                                let result = await sql.query("SELECT * FROM dealer_hardwares_prices WHERE hardware_id =" + hardwares[i].id + " AND created_by = 'admin'")
                                                                if (result.length) {
                                                                    dealer_cost = result[0].price
                                                                }
                                                            }

                                                            if (pay_now) {
                                                                admin_cost = admin_cost - Math.ceil(Number((admin_cost * 0.03)))
                                                                dealer_cost = dealer_cost - Math.ceil(Number((dealer_cost * 0.03)))
                                                            }

                                                            let hardware_data = `INSERT INTO hardwares_data(user_acc_id, dealer_id, hardware_name , hardware_data,total_credits , admin_cost_credits , dealer_cost_credits ) VALUES(${usr_acc_id}, ${dealer_id}, '${hardwares[i].hardware_name}', '${JSON.stringify(hardwares[i])}' ,${price} ,${admin_cost}, ${dealer_cost})`
                                                            await sql.query(hardware_data);
                                                        }
                                                        if (pay_now) {
                                                            let hardware_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${hardwarePrice} , 'credit' , '${transection_status}' , 'hardwares', ${hardwarePrice} ,0)`
                                                            await sql.query(hardware_transection)
                                                        } else {
                                                            if (dealer_credits_remaining) {
                                                                let paid_transection = dealer_credits_copy
                                                                let due_transection = hardwarePrice - paid_transection
                                                                let hardware_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${hardwarePrice} , 'credit' , '${transection_status}' , 'hardwares', ${paid_transection} , ${due_transection})`
                                                                await sql.query(hardware_transection)
                                                            } else {
                                                                let hardware_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${hardwarePrice} , 'credit' , '${transection_status}' , 'hardwares',0, ${hardwarePrice})`
                                                                await sql.query(hardware_transection)
                                                            }
                                                        }

                                                    }


                                                    await helpers.updateProfitLoss(admin_profit, dealer_profit, admin_data, verify.user.connected_dealer, usr_acc_id, loggedDealerType, pay_now, service_id)

                                                    let updateChatIds = 'update chat_ids set used=1, user_acc_id="' + usr_acc_id + '" , start_date = "' + start_date + '" where chat_id ="' + chat_id + '"';
                                                    let chatIdUpdateResult = await sql.query(updateChatIds);
                                                    if (chatIdUpdateResult.affectedRows) {
                                                        let getChatID = "SELECT * FROM chat_ids WHERE chat_id = '" + chat_id + "'"
                                                        sql.query(getChatID, function (err, result) {
                                                            if (result && result.length) {
                                                                let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id,product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].chat_id}' , 'chat_id' , '${start_date}')`
                                                                sql.query(insertAccService)
                                                            }
                                                        })
                                                    }
                                                    if (sim_id_included) {
                                                        if (sim_id) {
                                                            let insertSimIds = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used , uploaded_by , uploaded_by_id) VALUES ('${sim_id}' , ${usr_acc_id} , '${start_date}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;
                                                            let simIdInsertResult = await sql.query(insertSimIds)
                                                            if (simIdInsertResult.affectedRows) {
                                                                helpers.updateSimStatus(sim_id, 'active')

                                                                let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id + "'"
                                                                sql.query(getsimID, function (err, result) {
                                                                    if (result && result.length) {
                                                                        let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id,product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id' , '${start_date}')`
                                                                        sql.query(insertAccService)
                                                                    }
                                                                })
                                                            }
                                                        }

                                                        let data_plan_package = [basic_data_plan.sim_id]
                                                        let data_plan_price = 0
                                                        let data_limit = basic_data_plan.sim_id.data_limit

                                                        if (data_plans.sim_id) {
                                                            data_plans.sim_id.added_date = start_date
                                                            data_plan_package.push(data_plans.sim_id)
                                                            data_plan_price = data_plan_price + Number(data_plans.sim_id.pkg_price)
                                                            data_limit = data_limit + Number(data_plans.sim_id.data_limit)
                                                        }

                                                        let data_package_plan = `INSERT INTO sim_data_plans ( service_id , data_plan_package , total_price , total_data , sim_type , start_date) VALUES( ${service_id} , '${JSON.stringify(data_plan_package)}' , '${data_plan_price}' , '${data_limit}' , 'sim_id' , '${start_date}')`
                                                        sql.query(data_package_plan)

                                                    }

                                                    if (sim_id2_included) {
                                                        if (sim_id2) {
                                                            let insertSimId2 = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used , uploaded_by , uploaded_by_id) VALUES ('${sim_id2}' , ${usr_acc_id} , '${start_date}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;
                                                            let simId2InsertResult = await sql.query(insertSimId2)
                                                            if (simId2InsertResult.affectedRows) {
                                                                helpers.updateSimStatus(sim_id2, 'active')

                                                                let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id2 + "'"
                                                                sql.query(getsimID, function (err, result) {
                                                                    if (result && result.length) {
                                                                        let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id,product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' ,'sim_id' , '${start_date}')`
                                                                        sql.query(insertAccService)
                                                                    }
                                                                })
                                                            }
                                                        }

                                                        let data_plan_package2 = [basic_data_plan.sim_id2]
                                                        let data_plan_price = 0
                                                        let data_limit = basic_data_plan.sim_id2.data_limit

                                                        if (data_plans.sim_id2) {
                                                            data_plans.sim_id2.added_date = start_date
                                                            data_plan_package2.push(data_plans.sim_id2)
                                                            data_plan_price = data_plan_price + Number(data_plans.sim_id2.pkg_price)
                                                            data_limit = data_limit + Number(data_plans.sim_id2.data_limit)
                                                        }

                                                        let data_package_plan2 = `INSERT INTO sim_data_plans ( service_id , data_plan_package ,  total_price, total_data , sim_type , start_date) VALUES( ${service_id} , '${JSON.stringify(data_plan_package2)}' , '${data_plan_price}' , '${data_limit}' , 'sim_id2' , '${start_date}')`
                                                        sql.query(data_package_plan2)

                                                    }


                                                    let updatePgpEmails = 'update pgp_emails set used=1, user_acc_id="' + usr_acc_id + '" , start_date = "' + start_date + '" where pgp_email ="' + pgp_email + '"';
                                                    let pgpEmailUpdateResult = await sql.query(updatePgpEmails);
                                                    if (pgpEmailUpdateResult.affectedRows) {
                                                        let getsimID = "SELECT * FROM pgp_emails WHERE pgp_email = '" + pgp_email + "'"
                                                        sql.query(getsimID, function (err, result) {
                                                            if (result && result.length) {
                                                                let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id,product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].pgp_email}' , 'pgp_email' , '${start_date}')`
                                                                sql.query(insertAccService)
                                                            }
                                                        })
                                                    }

                                                    if (term == 0) {
                                                        sql.query(`UPDATE dealers SET remaining_demos = remaining_demos - 1 WHERE dealer_id = ${dealer_id}`)
                                                    }

                                                    var slctquery = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE devices.device_id = '${device_id}'`;
                                                    // console.log(slctquery);
                                                    rsltq = await sql.query(slctquery);
                                                    if (rsltq.length) {
                                                        // let pgp_emails = await device_helpers.getPgpEmails(rsltq[0].id);
                                                        // let sim_ids = await device_helpers.getSimids(rsltq[0].id);
                                                        // let chat_ids = await device_helpers.getChatids(rsltq[0].id);
                                                        let servicesData = await device_helpers.getServicesData(rsltq[0].id);
                                                        let servicesIds = servicesData.map(item => { return item.id })
                                                        let userAccServiceData = []
                                                        let dataPlans = []
                                                        if (servicesIds.length) {
                                                            userAccServiceData = await device_helpers.getUserAccServicesData(rsltq[0].id, servicesIds)
                                                            dataPlans = await device_helpers.getDataPlans(servicesIds)
                                                        }
                                                        rsltq[0].finalStatus = device_helpers.checkStatus(rsltq[0]);
                                                        rsltq[0].sim_id = "N/A"
                                                        rsltq[0].sim_id2 = "N/A"
                                                        rsltq[0].pgp_email = "N/A"
                                                        rsltq[0].chat_id = "N/A"

                                                        // ********  last online device data use from devices table not from login history
                                                        rsltq[0].lastOnline = rsltq[0].last_login ? rsltq[0].last_login : "N/A"
                                                        // let loginHistoryData = await device_helpers.getLastLoginDetail(rsltq[0].usr_device_id);
                                                        // if (loginHistoryData[0] && loginHistoryData[0].created_at) {
                                                        //     rsltq[0].lastOnline = loginHistoryData[0].created_at
                                                        // } else {
                                                        //     rsltq[0].lastOnline = "N/A"
                                                        // }
                                                        let remainTermDays = "N/A"

                                                        if (rsltq[0].expiry_date !== null) {
                                                            let startDate = moment(new Date())
                                                            let expiray_date = new Date(rsltq[0].expiry_date)
                                                            let endDate = moment(expiray_date)
                                                            remainTermDays = endDate.diff(startDate, 'days')
                                                        }
                                                        rsltq[0].remainTermDays = remainTermDays


                                                        // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                                        //     rsltq[0].pgp_email = pgp_emails[0].pgp_email
                                                        // } else {
                                                        //     rsltq[0].pgp_email = "N/A"
                                                        // }
                                                        // if (sim_ids && sim_ids.length) {
                                                        //     rsltq[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                                        //     rsltq[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                                        // }
                                                        // if (chat_ids[0] && chat_ids[0].chat_id) {
                                                        //     rsltq[0].chat_id = chat_ids[0].chat_id
                                                        // }
                                                        // else {
                                                        //     rsltq[0].chat_id = "N/A"
                                                        // }
                                                        let services = servicesData;
                                                        let service_id = null
                                                        if (services && services.length) {
                                                            services.map((item) => {
                                                                if (item.status === 'extended') {
                                                                    rsltq[0].extended_services = item
                                                                } else {
                                                                    rsltq[0].services = item
                                                                    service_id = item.id
                                                                }
                                                            })
                                                        }

                                                        let productsData = userAccServiceData.filter(item => item.user_acc_id === rsltq[0].id && item.service_id === service_id);
                                                        if (productsData && productsData.length) {
                                                            productsData.map((item) => {
                                                                if (item.type === 'sim_id') {
                                                                    rsltq[0].sim_id = item.product_value
                                                                }
                                                                else if (item.type === 'sim_id2') {
                                                                    rsltq[0].sim_id2 = item.product_value
                                                                }
                                                                else if (item.type === 'pgp_email') {
                                                                    rsltq[0].pgp_email = item.product_value
                                                                }
                                                                else if (item.type === 'chat_id') {
                                                                    rsltq[0].chat_id = item.product_value
                                                                }
                                                            })
                                                        }

                                                        let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                                        rsltq[0].sim_id_data_plan = sim_id_data_plan[0]
                                                        let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                                        rsltq[0].sim_id2_data_plan = sim_id2_data_plan[0]
                                                        // rsltq[0].vpn = await device_helpers.getVpn(rsltq[0])
                                                    }


                                                    if (policy_id !== '') {
                                                        var slctpolicy = "select * from policy where id = " + policy_id + "";
                                                        let policy = await sql.query(slctpolicy);
                                                        var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type, action_by, dealer_type) VALUES ('" + device_id + "' ," + dealer_id + "," + usr_acc_id + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy', " + verify.user.id + ", '" + verify.user.user_type + "')";
                                                        sql.query(applyQuery)
                                                    }

                                                    if (term !== '0') {
                                                        let inv_no = await helpers.getInvoiceId()
                                                        const invoice = {
                                                            shipping: {
                                                                name: verify.user.dealer_name,
                                                                device_id: device_id,
                                                                dealer_pin: verify.user.link_code,
                                                                user_id: user_id
                                                            },
                                                            products: products,
                                                            packages: packages,
                                                            hardwares: hardwares,
                                                            pay_now: pay_now,
                                                            discount: discount,
                                                            discountPercent: "3%",
                                                            quantity: 1,
                                                            subtotal: invoice_subtotal,
                                                            paid: discounted_price,
                                                            invoice_nr: inv_no,
                                                            invoice_status: invoice_status,
                                                            paid_credits: paid_credits,
                                                            expiry_date: expiry_date
                                                        };

                                                        let fileName = "invoice-" + inv_no + ".pdf"
                                                        let filePath = path.join(__dirname, "../../uploads/" + fileName)
                                                        await createInvoice(invoice, filePath)

                                                        let attachment = {
                                                            fileName: fileName,
                                                            file: filePath
                                                        }

                                                        sql.query(`INSERT INTO invoices (inv_no,user_acc_id,dealer_id,file_name ,end_user_payment_status) VALUES('${inv_no}',${usr_acc_id},${dealer_id}, '${fileName}' , '${endUser_pay_status}')`)

                                                        html = 'You have accepted the link device request of ' + device_id + '.<br>Your Invoice is attached below. <br>';

                                                        sendEmail("LINK DEVICE ACCEPTED.", html, verify.user.dealer_email, null, attachment);
                                                    }

                                                    rsltq[0].finalStatus = device_helpers.checkStatus(rsltq[0])

                                                    let user_credits = "SELECT * FROM financial_account_balance WHERE dealer_id=" + dealer_id
                                                    let account_balance = await sql.query(user_credits)

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
                                                    }).catch((err) => {
                                                        console.log(err);
                                                    })

                                                    data = {
                                                        status: true,
                                                        msg: await helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], "Record updated successfully"), // 'Record updated successfully.',
                                                        data: rsltq,
                                                        credits: account_balance[0] ? account_balance[0].credits : 0,
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
                                    msg: await helpers.convertToLang(req.translation[""], "Services are not found in request.Please select sevices and try again."), // "Device Not Added Try Again"
                                });
                                return;
                            }
                        } else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.NEW_DEVICE_NOT_ADDED], "New Device Not Added Please try Again"), // "Device Not Added Try Again"
                            });
                            return;
                        }

                    } else {
                        res.send({
                            status: false,
                            msg: "Error: Dealer doesn't have enough credits to make this request. Please purchase credits and try again later."
                        });
                        return
                    }
                } else {
                    res.send({
                        status: false,
                        msg: "Error: Dealer doesn't have credits to make this request. Please purchase credits and try again later."
                    });
                    return
                }
            }
        });
    }
};


exports.createDeviceProfile = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var code = randomize('0', 7);
        var activation_code = await helpers.checkActivationCode(code);
        var client_id = (req.body.client_id) ? req.body.client_id : null;
        var chat_id = req.body.chat_id ? req.body.chat_id : '';
        var model = (req.body.model) ? req.body.model : null;

        var user_id = req.body.user_id;

        let userData = await helpers.getUserDataByUserId(user_id)

        var name = userData[0].user_name;
        var email = userData[0].email;
        var pgp_email = req.body.pgp_email ? req.body.pgp_email : '';
        var start_date = moment().format("YYYY/MM/DD");
        var exp_month = req.body.term
        var expiry_date = '';
        var dealer_id = verify.user.dealer_id;
        var duplicate = req.body.duplicate ? req.body.duplicate : 0;
        var basic_data_plan = {
            sim_id:
            {
                data_limit: 2000,
                pkg_price: 0,
                term: exp_month,
                added_date: start_date
            },
            sim_id2:
            {
                data_limit: 2000,
                pkg_price: 0,
                term: exp_month,
                added_date: start_date

            }
        }
        // console.log(req.body.data_plans)
        var data_plans = req.body.data_plans ? req.body.data_plans : basic_data_plan
        if (exp_month === '0') {
            var trailDate = moment(start_date, "YYYY/MM/DD").add(7, 'days');
            expiry_date = moment(trailDate).format("YYYY/MM/DD")
            let checkDealer = "SELECT * FROM dealers where dealer_id =" + dealer_id;
            let dealer = await sql.query(checkDealer);
            if (dealer[0].remaining_demos <= 0 || dealer[0].remaining_demos < duplicate) {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[""], "Your Demos Limit has been exceeded, you cannot use Trial Packages. Please Contact with you admin."), // "New Device Not Added Please try Again"
                });
                return;
            }

        } else {
            expiry_date = helpers.getExpDateByMonth(start_date, exp_month)
        }

        let sim_id_included = false
        let sim_id2_included = false

        var note = req.body.note;
        var validity = req.body.validity;

        var link_code = verify.user.link_code
        var sim_id = req.body.sim_id ? req.body.sim_id : '';
        var sim_id2 = req.body.sim_id2 ? req.body.sim_id2 : '';
        var loggedUserId = verify.user.id;
        var loggedUserType = verify.user.user_type;
        let policy_id = req.body.policy_id ? req.body.policy_id : '';

        let products = (req.body.products) ? req.body.products : []
        let packages = (req.body.packages) ? req.body.packages : []
        let hardwares = req.body.hardwares

        if (packages.length) {
            packages.map((item) => {
                if (item.pkg_features.sim_id) {
                    sim_id_included = true
                }
                if (item.pkg_features.sim_id2) {
                    sim_id2_included = true
                }
            })
        }

        let admin_profit = 0
        let dealer_profit = 0
        let pay_now = req.body.pay_now

        let total_price = req.body.total_price
        let discount = 0
        let hardwarePrice = req.body.hardwarePrice ? req.body.hardwarePrice : 0
        let discounted_price = total_price + hardwarePrice
        let invoice_subtotal = total_price + hardwarePrice
        let endUser_pay_status = req.body.paid_by_user
        let paid_credits = 0
        let transection_due_credits = 0
        let data_plan_price = 0

        // console.log(req.body);
        // let services_discounted_price = 0
        // let hardwares_discounted_price = 0
        if (pay_now) {
            discount = Math.ceil(Number(((discounted_price) * 0.03)));
            discounted_price = (discounted_price) - discount
        }
        let invoice_status = pay_now ? "PAID" : "UNPAID"
        let admin_data = await sql.query("SELECT * from dealers WHERE type = 1")
        // console.log(verify.user);
        let loggedInUserData = await sql.query(`SELECT * FROM dealers WHERE dealer_id =${loggedUserId}`)
        if (!loggedInUserData || loggedInUserData.length < 1) {
            res.send({
                status: false,
                msg: "Error: Dealer Data not found."
            });
            return
        }
        if (loggedUserType !== constants.ADMIN) {
            if (loggedInUserData[0].account_balance_status == 'suspended') {
                res.send({
                    status: false,
                    msg: "Error: Your Account balance status is on restricted level 2. You cannot add a new device. Please Contact your admin"
                });
                return
            }
            else if (loggedInUserData[0].account_balance_status !== 'active' && !pay_now) {
                res.send({
                    status: false,
                    msg: "Error: Your Account balance status is restricted. You cannot use pay later function. Please Contact your admin"
                });
                return
            }
        }


        let user_credits = "SELECT * FROM financial_account_balance WHERE dealer_id=" + dealer_id
        sql.query(user_credits, async function (err, result) {
            if (err) {
                res.send({
                    status: false,
                    msg: "Error: Dealer Credits not found."
                });
                return
            }
            else {
                if (result[0].credits_limit > (result[0].credits - discounted_price)) {
                    res.send({
                        status: false,
                        msg: "Error: Your Credits limits will exceed after apply this service. Please select other services OR Purchase Credits."
                    });
                    return
                }
                if (result.length || req.body.term === '0' || !pay_now) {
                    let dealer_credits = result.length ? result[0].credits : 0;
                    let dealer_credits_copy = dealer_credits
                    if (dealer_credits >= discounted_price || req.body.term === '0' || !pay_now) {
                        if (products.length || packages.length) {

                            if (pay_now) {
                                dealer_credits = dealer_credits - discounted_price
                                // if (hardwares.length) {
                                //     hardwarePrice = hardwarePrice - (hardwarePrice * 0.03)
                                // }
                            }

                            if (exp_month !== '0') {
                                let profitLoss = await helpers.calculateProfitLoss(packages, products, loggedUserType)
                                if (pay_now) {
                                    admin_profit = profitLoss.admin_profit - Math.ceil(Number((profitLoss.admin_profit * 0.03)))
                                    dealer_profit = profitLoss.dealer_profit - Math.ceil(Number((profitLoss.dealer_profit * 0.03)))
                                } else {
                                    admin_profit = profitLoss.admin_profit
                                    dealer_profit = profitLoss.dealer_profit
                                }
                            }

                            if (duplicate > 0) {
                                if (dealer_credits > discounted_price || req.body.term === '0') {
                                    let pgpEmail = "SELECT pgp_email from pgp_emails WHERE used=0";
                                    let pgp_emails = await sql.query(pgpEmail);
                                    let chatIds = "SELECT chat_id from chat_ids WHERE used=0";
                                    let chat_ids = await sql.query(chatIds);
                                    let simIds = "SELECT sim_id from sim_ids WHERE used=0";
                                    let sim_ids = await sql.query(simIds);
                                    let activationCodes = []
                                    let deviceIds = []
                                    let batch_no = new Date().valueOf();
                                    let user_acc_ids = []
                                    const addDuplicateActivations = async () => {
                                        for (let i = 0; i < duplicate; i++) {
                                            let code = randomize('0', 7);
                                            var activationCode = await helpers.checkActivationCode(code);
                                            activationCodes.push(activationCode);
                                            var chat_id = null;
                                            var pgp_email = null;
                                            var sim_id = null;
                                            var sim_id2 = "";

                                            if (packages.length) {
                                                packages.map((item) => {
                                                    if (item.pkg_features.sim_id) {
                                                        sim_id = (sim_ids[0]) ? sim_ids[0].sim_id : null;
                                                        if (sim_id) {
                                                            sim_ids.shift();
                                                        }
                                                    }
                                                    if (item.pkg_features.sim_id2) {
                                                        sim_id2 = (sim_ids[0]) ? sim_ids[0].sim_id : null;
                                                        if (sim_id) {
                                                            sim_ids.shift();
                                                        }
                                                    }

                                                    if (item.pkg_features.chat_id) {
                                                        chat_id = (chat_ids[i]) ? chat_ids[i].chat_id : null;
                                                    }
                                                    if (item.pkg_features.pgp_email) {
                                                        pgp_email = (pgp_emails[i]) ? pgp_emails[i].pgp_email : null;
                                                    }
                                                })
                                            }
                                            if (products.length) {
                                                products.map((item) => {
                                                    if (item.price_for === 'sim_id') {
                                                        sim_id = (sim_ids[0]) ? sim_ids[0].sim_id : null;
                                                        if (sim_id) {
                                                            sim_ids.shift();
                                                        }
                                                    }
                                                    if (item.price_for === 'sim_id2') {
                                                        sim_id = (sim_ids[0]) ? sim_ids[0].sim_id : null;
                                                        if (sim_id) {
                                                            sim_ids.shift();
                                                        }
                                                    }
                                                    if (item.price_for === 'chat_id') {
                                                        chat_id = (chat_ids[i]) ? chat_ids[i].chat_id : null;
                                                    }
                                                    if (item.price_for === 'pgp_email') {
                                                        pgp_email = (pgp_emails[i]) ? pgp_emails[i].pgp_email : null;
                                                    }
                                                })
                                            }

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
                                                user_acc_ids.push(user_acc_id)
                                                // console.log("affectedRows", resps.affectedRows);
                                                if (resps.affectedRows) {

                                                    let service_data = `INSERT INTO services_data(user_acc_id, dealer_id, products, packages, start_date ,total_credits,service_expiry_date , service_term) VALUES(${user_acc_id}, ${dealer_id}, '${JSON.stringify(products)}', '${JSON.stringify(packages)}', '${start_date}', ${discounted_price / duplicate} , '${expiry_date}' , '${exp_month}')`
                                                    let service_data_result = await sql.query(service_data);
                                                    let service_id = null
                                                    if (service_data_result.affectedRows) {
                                                        service_id = service_data_result.insertId
                                                        helpers.saveServiceSalesDetails(JSON.parse(JSON.stringify(packages)), products, loggedUserType, user_acc_id, service_data_result.insertId, pay_now)
                                                    }
                                                    var transection_status = 'transferred'
                                                    if (!pay_now) {
                                                        transection_status = 'pending'
                                                    }

                                                    if (hardwares.length) {
                                                        let dealer_hardware_profit = 0
                                                        let admin_hardware_profit = 0

                                                        let hardwareProfits = await helpers.calculateHardwareProfitLoss(hardwares, loggedUserType)
                                                        // console.log(hardwareProfits);
                                                        if (pay_now) {
                                                            admin_hardware_profit = hardwareProfits.admin_profit - Math.ceil((hardwareProfits.admin_profit * 0.03))
                                                            dealer_hardware_profit = hardwareProfits.dealer_profit - Math.ceil((hardwareProfits.dealer_profit * 0.03))
                                                        } else {
                                                            admin_hardware_profit = hardwareProfits.admin_profit
                                                            dealer_hardware_profit = hardwareProfits.dealer_profit
                                                        }

                                                        let profit_status = transection_status === 'transferred' ? transection_status : 'holding'
                                                        if (admin_hardware_profit > 0) {
                                                            let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${admin_hardware_profit} ,'debit' , '${profit_status}' , 'hardwares')`
                                                            await sql.query(transection_credits)
                                                            if (pay_now) {
                                                                let update_admin_credits = `UPDATE financial_account_balance SET credits = credits + ${admin_hardware_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
                                                                await sql.query(update_admin_credits)
                                                            }
                                                        }

                                                        if (dealer_hardware_profit > 0) {
                                                            let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${dealer_hardware_profit} ,'debit' , '${profit_status}' , 'hardwares')`
                                                            await sql.query(transection_credits)
                                                            if (pay_now) {
                                                                let update_dealer_credits = `UPDATE financial_account_balance SET credits = credits + ${dealer_hardware_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
                                                                await sql.query(update_dealer_credits)
                                                            }
                                                        }
                                                        for (let i = 0; i < hardwares.length; i++) {
                                                            let price = hardwares[i].hardware_price
                                                            if (pay_now) {
                                                                price = price - Math.ceil(Number((price * 0.03)))
                                                            }
                                                            let admin_cost = 0
                                                            let dealer_cost = 0
                                                            let result = await sql.query("SELECT * FROM dealer_hardwares_prices WHERE hardware_id =" + hardwares[i].id + " AND created_by = 'super_admin'")
                                                            // console.log(result);
                                                            if (result.length) {
                                                                admin_cost = result[0].price
                                                            }
                                                            if (loggedUserType === constants.SDEALER) {
                                                                let result = await sql.query("SELECT * FROM dealer_hardwares_prices WHERE hardware_id =" + hardwares[i].id + " AND created_by = 'admin'")
                                                                if (result.length) {
                                                                    dealer_cost = result[0].price
                                                                }
                                                            }
                                                            if (pay_now) {
                                                                admin_cost = admin_cost - Math.ceil(Number((admin_cost * 0.03)))
                                                                dealer_cost = dealer_cost - Math.ceil(Number((dealer_cost * 0.03)))
                                                            }
                                                            let hardware_data = `INSERT INTO hardwares_data(user_acc_id, dealer_id, hardware_name, hardware_data,total_credits, admin_cost_credits, dealer_cost_credits) VALUES(${user_acc_id}, ${dealer_id}, '${hardwares[i].hardware_name}', '${JSON.stringify(hardwares[i])}', ${price} , ${admin_cost} , ${dealer_cost})`
                                                            await sql.query(hardware_data);
                                                        }

                                                        let hardware_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, service_id: service_id })}' ,${hardwarePrice / duplicate} , 'credit' , '${transection_status}' , 'hardwares' ,${(pay_now) ? hardwarePrice / duplicate : 0} , ${(pay_now) ? 0 : hardwarePrice / duplicate})`
                                                        await sql.query(hardware_transection)
                                                    }

                                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, service_id: service_id })}' ,${total_price / duplicate} ,'credit' , '${transection_status}' , 'services' , ${(pay_now) ? total_price / duplicate : 0} , ${(pay_now) ? 0 : total_price / duplicate})`
                                                    await sql.query(transection_credits)

                                                    await helpers.updateProfitLoss(admin_profit, dealer_profit, admin_data, verify.user.connected_dealer, user_acc_id, loggedUserType, pay_now, service_id)

                                                    let updateChatIds = 'update chat_ids set used=1, user_acc_id="' + user_acc_id + '"  , start_date = "' + start_date + '" where chat_id ="' + chat_id + '"';
                                                    await sql.query(updateChatIds);
                                                    let updateSimIds = 'update sim_ids set used=1, user_acc_id="' + user_acc_id + '" , start_date = "' + start_date + '" where sim_id ="' + sim_id + '" OR sim_id = "' + sim_id2 + '"';
                                                    await sql.query(updateSimIds)
                                                    let updatePgpEmails = 'update pgp_emails set used=1, user_acc_id="' + user_acc_id + '" , start_date = "' + start_date + '" where pgp_email ="' + pgp_email + '"';
                                                    await sql.query(updatePgpEmails);
                                                    if (policy_id !== '') {
                                                        var slctpolicy = "select * from policy where id = " + policy_id + "";
                                                        let policy = await sql.query(slctpolicy);
                                                        var applyQuery = "INSERT INTO device_history (dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type, action_by, dealer_type) VALUES (" + dealer_id + "," + user_acc_id + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy', " + verify.user.id + ", '" + verify.user.user_type + "')";
                                                        sql.query(applyQuery)
                                                    }
                                                }

                                            }

                                        }
                                    }
                                    await addDuplicateActivations();
                                    let remaining_credits = dealer_credits

                                    let update_credits_query = '';

                                    if (pay_now) {
                                        update_credits_query = 'UPDATE financial_account_balance set credits =' + remaining_credits + ' where dealer_id ="' + dealer_id + '"';
                                    } else {
                                        update_credits_query = 'UPDATE financial_account_balance set credits = credits - ' + (total_price + hardwarePrice) + ' where dealer_id ="' + dealer_id + '"';
                                    }
                                    await sql.query(update_credits_query);
                                    if (exp_month !== '0') {
                                        let inv_no = await helpers.getInvoiceId()
                                        const invoice = {
                                            shipping: {
                                                name: verify.user.dealer_name,
                                                device_id: duplicate + " Pre-activaions",
                                                dealer_pin: verify.user.link_code,
                                                user_id: user_id
                                            },
                                            products: products,
                                            packages: packages,
                                            hardwares: hardwares,
                                            pay_now: pay_now,
                                            discount: discount,
                                            discountPercent: "3%",
                                            quantity: duplicate,
                                            subtotal: invoice_subtotal,
                                            paid: discounted_price,
                                            invoice_nr: inv_no,
                                            invoice_status: invoice_status,
                                            paid_credits: paid_credits,
                                            expiry_date: expiry_date
                                        };

                                        let fileName = "invoice-" + inv_no + ".pdf"
                                        let filePath = path.join(__dirname, "../../uploads/" + fileName)
                                        await createInvoice(invoice, filePath)

                                        let attachment = {
                                            fileName: fileName,
                                            file: filePath
                                        }

                                        sql.query(`INSERT INTO invoices (inv_no,user_acc_id,dealer_id,file_name , end_user_payment_status) VALUES('${inv_no}','${JSON.stringify(user_acc_ids)}',${dealer_id}, '${fileName}' , '${endUser_pay_status}')`)

                                        html = 'Amount of activation codes : ' + activationCodes.length + '<br> ' + 'Activation Codes are following : <br>' + activationCodes.join("<br>") + '.<br> Invoice is attached below. <br>';

                                        sendEmail("Activation codes successfully generated.", html, verify.user.dealer_email, null, attachment);
                                    } else {
                                        html = 'Amount of activation codes : ' + activationCodes.length + '<br> ' + 'Activation Codes are following : <br>' + activationCodes.join("<br>");
                                        sendEmail("Activation codes successfully generated.", html, verify.user.dealer_email, null, null);
                                    }
                                    if (exp_month == 0) {
                                        sql.query(`UPDATE dealers SET remaining_demos = remaining_demos - ${duplicate} WHERE dealer_id = ${dealer_id}`)
                                    }

                                    let user_credits = "SELECT * FROM financial_account_balance WHERE dealer_id=" + dealer_id
                                    let account_balance = await sql.query(user_credits)

                                    var slctquery = "select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id IN (" + deviceIds.join() + ")";
                                    // console.log(slctquery);
                                    rsltq = await sql.query(slctquery);
                                    // console.log(rsltq);
                                    if (rsltq.length) {
                                        let devices_acc_array = [];
                                        let usr_device_ids_array = []
                                        for (let i = 0; i < rsltq.length; i++) {
                                            devices_acc_array.push(rsltq[i].id)
                                            usr_device_ids_array.push(rsltq[i].usr_device_id)
                                        }
                                        let user_acc_ids = devices_acc_array.join()
                                        let usr_device_ids = usr_device_ids_array.join()
                                        // let pgp_emails = await device_helpers.getPgpEmails(user_acc_ids);
                                        // let sim_ids = await device_helpers.getSimids(user_acc_ids);
                                        // let chat_ids = await device_helpers.getChatids(user_acc_ids);
                                        let servicesData = await device_helpers.getServicesData(user_acc_ids)
                                        let servicesIds = servicesData.map(item => { return item.id })
                                        let userAccServiceData = []
                                        let dataPlans = []
                                        if (servicesIds.length) {
                                            userAccServiceData = await device_helpers.getUserAccServicesData(user_acc_ids, servicesIds)
                                            dataPlans = await device_helpers.getDataPlans(servicesIds)
                                        }
                                        // let loginHistoryData = await device_helpers.getLastLoginDetail(usr_device_ids)

                                        for (var i = 0; i < rsltq.length; i++) {
                                            // let pgp_email = pgp_emails.find(pgp_email => pgp_email.user_acc_id === rsltq[i].id);
                                            // if (pgp_email) {
                                            //     rsltq[i].pgp_email = pgp_email.pgp_email
                                            // }
                                            // let sim_idArray = sim_ids.filter(sim_id => sim_id.user_acc_id === rsltq[i].id);
                                            // if (sim_idArray && sim_idArray.length) {
                                            //     rsltq[i].sim_id = sim_idArray[0].sim_id
                                            //     rsltq[i].sim_id2 = sim_idArray[1] ? sim_idArray[1].sim_id : "N/A"
                                            // }
                                            // let chat_id = chat_ids.find(chat_id => chat_id.user_acc_id === rsltq[i].id);
                                            // if (chat_id) {
                                            //     rsltq[i].chat_id = chat_id.chat_id
                                            // }
                                            rsltq[i].sim_id = "N/A"
                                            rsltq[i].sim_id2 = "N/A"
                                            rsltq[i].pgp_email = "N/A"
                                            rsltq[i].chat_id = "N/A"
                                            rsltq[i].finalStatus = device_helpers.checkStatus(
                                                rsltq[i]
                                            );
                                            rsltq[i].validity = await device_helpers.checkRemainDays(
                                                rsltq[i].created_at,
                                                rsltq[i].validity
                                            );
                                            let services = servicesData.filter(data => data.user_acc_id === rsltq[i].id);
                                            let service_id = null
                                            if (services && services.length) {
                                                services.map((item) => {
                                                    if (item.status === 'extended') {
                                                        rsltq[i].extended_services = item
                                                    } else {
                                                        rsltq[i].services = item
                                                        service_id = item.id
                                                    }
                                                })
                                            }
                                            let productsData = userAccServiceData.filter(item => item.user_acc_id === rsltq[i].id && item.service_id === service_id);
                                            if (productsData && productsData.length) {
                                                productsData.map((item) => {
                                                    if (item.type === 'sim_id') {
                                                        rsltq[i].sim_id = item.product_value
                                                    }
                                                    else if (item.type === 'sim_id2') {
                                                        rsltq[i].sim_id2 = item.product_value
                                                    }
                                                    else if (item.type === 'pgp_email') {
                                                        rsltq[i].pgp_email = item.product_value
                                                    }
                                                    else if (item.type === 'chat_id') {
                                                        rsltq[i].chat_id = item.product_value
                                                    }
                                                })
                                            }

                                            let sim_id_data_plan = dataPlans.filter((item) => item.service_id == service_id && item.sim_type == 'sim_id')
                                            rsltq[i].sim_id_data_plan = sim_id_data_plan[0]
                                            let sim_id2_data_plan = dataPlans.filter((item) => item.service_id == service_id && item.sim_type == 'sim_id2')
                                            rsltq[i].sim_id2_data_plan = sim_id2_data_plan[0]
                                            // let services = servicesData.find(data => data.user_acc_id === rsltq[i].id);
                                            // if (services && services.length) {
                                            //     rsltq[i].services = services
                                            // }

                                            rsltq[i].vpn = await device_helpers.getVpn(rsltq[i])
                                            await device_helpers.saveActionHistory(
                                                rsltq[i],
                                                constants.DEVICE_PRE_ACTIVATION,
                                                verify.user
                                            );
                                        }
                                    }
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC_EMAIL_SEND], "Pre-activations added succcessfully.Email sends to your account"), // Pre-activations added succcessfully.Email sends to your account.
                                        "data": rsltq,
                                        credits: account_balance[0] ? account_balance[0].credits : 0
                                    };
                                    res.send({
                                        status: true,
                                        data: data
                                    })
                                    return;

                                } else {
                                    res.send({
                                        status: false,
                                        msg: "Your Credits are not enough to apply these services. Please select other services OR Purchase Credits."
                                    });
                                    return
                                }
                            } else {
                                let checkUnique = "SELECT account_email from usr_acc WHERE account_email= '" + email + "' AND user_id != '" + user_id + "'";
                                let checkUniquePgp = "SELECT pgp_email from pgp_emails WHERE (pgp_email= '" + pgp_email + "' AND used=1)";

                                let checkDevice = await sql.query(checkUnique);
                                let checkDevicepgp = await sql.query(checkUniquePgp);
                                if (checkDevicepgp.length) {
                                    res.send({
                                        status: false,
                                        msg: "PGP Email already taken"
                                    });
                                    return;
                                }
                                if (checkDevice.length) {
                                    res.send({
                                        status: false,
                                        msg: "Account email already taken."
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
                                            res.send({
                                                status: false,
                                                msg: "Dealer not found."
                                            });
                                            return
                                        }

                                        if (response.length) {

                                            insertDevice = insertDevice + values + ")";
                                            sql.query(insertDevice, async (err, resp) => {
                                                if (err) {
                                                    console.log(err)
                                                    res.send({
                                                        status: false,
                                                        msg: "Pre-activation not added successfully. Please try again."
                                                    });
                                                    return
                                                }
                                                let dvc_id = resp.insertId;
                                                var insertUser_acc = "INSERT INTO usr_acc (device_id, user_id, activation_code, client_id , account_email,expiry_months, dealer_id, link_code ,device_status, activation_status, expiry_date , note,validity  "
                                                // var insertDevice = "INSERT INTO devices ( activation_code, name, client_id, chat_id, model, email, pgp_email, expiry_months, dealer_id, device_status, activation_status ";
                                                var User_acc_values = ") VALUES ('" + dvc_id + "','" + user_id + "', '" + activation_code + "', '" + client_id + "', '" + email + "'," + exp_month + ", " + dealer_id + ",'" + link_code + "' ,  0, 0 ,'" + expiry_date + "','" + note + "','" + validity + "')";
                                                insertUser_acc = insertUser_acc + User_acc_values;
                                                if (resp.affectedRows) {
                                                    sql.query(insertUser_acc, async (err, respData) => {

                                                        if (err) {
                                                            console.log(err)
                                                        }
                                                        let user_acc_id = respData.insertId;

                                                        if (respData && respData.affectedRows) {

                                                            let remaining_credits = dealer_credits

                                                            let update_credits_query = '';

                                                            if (pay_now) {
                                                                update_credits_query = 'UPDATE financial_account_balance set credits =' + remaining_credits + ' where dealer_id ="' + dealer_id + '"';
                                                            } else {
                                                                update_credits_query = 'UPDATE financial_account_balance set credits = credits - ' + (total_price + hardwarePrice) + ' where dealer_id ="' + dealer_id + '"';
                                                            }

                                                            await sql.query(update_credits_query);

                                                            var transection_status = 'transferred'
                                                            if (!pay_now) {
                                                                transection_status = 'pending'
                                                            } else {
                                                                total_price = total_price - Math.ceil(Number((total_price * 0.03)))
                                                                hardwarePrice = hardwarePrice - Math.ceil(Number((hardwarePrice * 0.03)))
                                                            }
                                                            if (data_plans.sim_id) {
                                                                let discount = 0
                                                                if (pay_now) {
                                                                    discount = Math.ceil(Number((Number(data_plans.sim_id.pkg_price) * 0.03)))
                                                                }
                                                                data_plan_price += (Number(data_plans.sim_id.pkg_price) - discount)
                                                            }
                                                            if (data_plans.sim_id2) {
                                                                let discount = 0
                                                                if (pay_now) {
                                                                    discount = Math.ceil(Number((Number(data_plans.sim_id2.pkg_price) * 0.03)))
                                                                }
                                                                data_plan_price += (Number(data_plans.sim_id2.pkg_price) - discount)
                                                            }
                                                            let service_data = `INSERT INTO services_data(user_acc_id, dealer_id, products, packages, start_date, total_credits ,service_expiry_date , service_term ) VALUES(${user_acc_id}, ${dealer_id}, '${JSON.stringify(products)}', '${JSON.stringify(packages)}', '${start_date}', ${total_price - data_plan_price} , '${expiry_date}' , '${exp_month}')`
                                                            let service_data_result = await sql.query(service_data);
                                                            let service_id = null
                                                            if (service_data_result.affectedRows) {
                                                                service_id = service_data_result.insertId
                                                                helpers.saveServiceSalesDetails(JSON.parse(JSON.stringify(packages)), products, loggedUserType, user_acc_id, service_data_result.insertId, pay_now)
                                                            }
                                                            let dealer_credits_remaining = true
                                                            if (pay_now) {
                                                                let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, service_id: service_id })}' ,${total_price} ,'credit' , '${transection_status}' , 'services' , ${total_price} , ${0})`
                                                                await sql.query(transection_credits)
                                                            }
                                                            else {
                                                                let transection_due_credits = total_price;


                                                                if (dealer_credits_copy > 0) {
                                                                    if (dealer_credits_copy < total_price) {
                                                                        transection_due_credits = total_price - dealer_credits_copy
                                                                        paid_credits = dealer_credits_copy
                                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, service_id: service_id })}' ,${total_price} ,'credit' , '${transection_status}' , 'services' , ${paid_credits} , ${transection_due_credits})`
                                                                        await sql.query(transection_credits)
                                                                        dealer_credits_remaining = false
                                                                    } else {
                                                                        dealer_credits_copy -= total_price
                                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, service_id: service_id })}' ,${total_price} ,'credit' , 'transferred' , 'services' , ${total_price} ,0)`
                                                                        await sql.query(transection_credits)
                                                                    }
                                                                    invoice_status = "PARTIALLY PAID"
                                                                } else {
                                                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, service_id: service_id })}' ,${total_price} ,'credit' , 'pending' , 'services' , 0 ,${total_price})`
                                                                    await sql.query(transection_credits)
                                                                    dealer_credits_remaining = false
                                                                }
                                                            }

                                                            if (hardwares.length) {
                                                                let dealer_hardware_profit = 0
                                                                let admin_hardware_profit = 0

                                                                let hardwareProfits = await helpers.calculateHardwareProfitLoss(hardwares, loggedUserType)
                                                                // console.log(hardwareProfits);
                                                                if (pay_now) {
                                                                    admin_hardware_profit = hardwareProfits.admin_profit - Math.ceil((hardwareProfits.admin_profit * 0.03))
                                                                    dealer_hardware_profit = hardwareProfits.dealer_profit - Math.ceil((hardwareProfits.dealer_profit * 0.03))
                                                                } else {
                                                                    admin_hardware_profit = hardwareProfits.admin_profit
                                                                    dealer_hardware_profit = hardwareProfits.dealer_profit
                                                                }

                                                                let profit_status = transection_status === 'transferred' ? transection_status : 'holding'
                                                                if (admin_hardware_profit > 0) {
                                                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${admin_hardware_profit} ,'debit' , '${profit_status}' , 'hardwares')`
                                                                    await sql.query(transection_credits)
                                                                    if (pay_now) {
                                                                        let update_admin_credits = `UPDATE financial_account_balance SET credits = credits + ${admin_hardware_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
                                                                        await sql.query(update_admin_credits)
                                                                    }
                                                                }
                                                                if (dealer_hardware_profit > 0) {
                                                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${dealer_hardware_profit} ,'debit' , '${profit_status}' , 'hardwares')`
                                                                    await sql.query(transection_credits)
                                                                    if (pay_now) {
                                                                        let update_dealer_credits = `UPDATE financial_account_balance SET credits = credits + ${dealer_hardware_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
                                                                        await sql.query(update_dealer_credits)
                                                                    }
                                                                }
                                                                for (let i = 0; i < hardwares.length; i++) {
                                                                    let price = hardwares[i].hardware_price
                                                                    if (pay_now) {
                                                                        price = price - Math.ceil(Number((price * 0.03)))
                                                                    }
                                                                    let admin_cost = 0
                                                                    let dealer_cost = 0
                                                                    let result = await sql.query("SELECT * FROM dealer_hardwares_prices WHERE hardware_id =" + hardwares[i].id + " AND created_by = 'super_admin'")
                                                                    // console.log(result);
                                                                    if (result.length) {
                                                                        admin_cost = result[0].price
                                                                    }
                                                                    if (loggedUserType === constants.SDEALER) {
                                                                        let result = await sql.query("SELECT * FROM dealer_hardwares_prices WHERE hardware_id =" + hardwares[i].id + " AND created_by = 'admin'")
                                                                        if (result.length) {
                                                                            dealer_cost = result[0].price
                                                                        }
                                                                    }

                                                                    if (pay_now) {
                                                                        admin_cost = admin_cost - Math.ceil(Number((admin_cost * 0.03)))
                                                                        dealer_cost = dealer_cost - Math.ceil(Number((dealer_cost * 0.03)))
                                                                    }

                                                                    let hardware_data = `INSERT INTO hardwares_data(user_acc_id, dealer_id, hardware_name , hardware_data,total_credits , admin_cost_credits , dealer_cost_credits ) VALUES(${user_acc_id}, ${dealer_id}, '${hardwares[i].hardware_name}', '${JSON.stringify(hardwares[i])}', ${price} , ${admin_cost} , ${dealer_cost})`
                                                                    await sql.query(hardware_data);
                                                                }
                                                                if (pay_now) {
                                                                    let hardware_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${hardwarePrice} , 'credit' , '${transection_status}' , 'hardwares', ${hardwarePrice} ,0)`
                                                                    await sql.query(hardware_transection)
                                                                } else {
                                                                    if (dealer_credits_remaining) {
                                                                        let paid_transection = dealer_credits_copy
                                                                        let due_transection = hardwarePrice - paid_transection
                                                                        let hardware_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${hardwarePrice} , 'credit' , '${transection_status}' , 'hardwares', ${paid_transection} , ${due_transection})`
                                                                        await sql.query(hardware_transection)
                                                                    } else {
                                                                        let hardware_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}' ,${hardwarePrice} , 'credit' , '${transection_status}' , 'hardwares',0, ${hardwarePrice})`
                                                                        await sql.query(hardware_transection)
                                                                    }
                                                                }
                                                            }


                                                            helpers.updateProfitLoss(admin_profit, dealer_profit, admin_data, verify.user.connected_dealer, user_acc_id, loggedUserType, pay_now, service_id)

                                                            let updateChatIds = 'update chat_ids set used=1, user_acc_id="' + user_acc_id + '" , start_date = "' + start_date + '" , dealer_id  = "' + dealer_id + '"   where chat_id ="' + chat_id + '"';
                                                            let chatIdUpdateResult = await sql.query(updateChatIds);
                                                            if (chatIdUpdateResult.affectedRows) {
                                                                let getChatID = "SELECT * FROM chat_ids WHERE chat_id = '" + chat_id + "'"
                                                                sql.query(getChatID, function (err, result) {
                                                                    if (result && result.length) {
                                                                        let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${user_acc_id} , ${service_id} , ${result[0].id} , '${result[0].chat_id}' , 'chat_id' , '${start_date}')`
                                                                        sql.query(insertAccService)
                                                                    }
                                                                })
                                                            }
                                                            if (sim_id_included) {
                                                                if (sim_id) {
                                                                    let insertSimIds = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used , uploaded_by , uploaded_by_id) VALUES ('${sim_id}' , ${user_acc_id} , '${start_date}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;
                                                                    // let insertSimIds = 'update sim_ids set used=1, user_acc_id="' + user_acc_id + '" ,start_date = "' + start_date + '" , dealer_id  = "' + dealer_id + '"  where sim_id ="' + sim_id + '"';
                                                                    let simIdInsertResult = await sql.query(insertSimIds)
                                                                    if (simIdInsertResult.affectedRows) {
                                                                        // helpers.updateSimStatus(sim_id, 'active')
                                                                        let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id + "'"
                                                                        sql.query(getsimID, function (err, result) {
                                                                            if (result && result.length) {
                                                                                let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${user_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id' , '${start_date}')`
                                                                                sql.query(insertAccService)
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                                let data_plan_package = [basic_data_plan.sim_id]
                                                                let data_plan_price = 0
                                                                let data_limit = basic_data_plan.sim_id.data_limit
                                                                if (data_plans.sim_id) {
                                                                    data_plans.sim_id.added_date = start_date
                                                                    data_plan_package.push(data_plans.sim_id)
                                                                    data_plan_price = data_plan_price + Number(data_plans.sim_id.pkg_price)
                                                                    data_limit = data_limit + Number(data_plans.sim_id.data_limit)

                                                                }
                                                                let data_package_plan = `INSERT INTO sim_data_plans ( service_id , data_plan_package , total_price , total_data , sim_type , start_date) VALUES( ${service_id} , '${JSON.stringify(data_plan_package)}' , '${data_plan_price}' , '${data_limit}' , 'sim_id' , '${start_date}')`
                                                                sql.query(data_package_plan)
                                                            }
                                                            if (sim_id2_included) {
                                                                if (sim_id2) {
                                                                    let insertSimId2 = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used , uploaded_by , uploaded_by_id) VALUES ('${sim_id2}' , ${user_acc_id} , '${start_date}' , ${dealer_id} , 1, '${verify.user.user_type}' , '${verify.user.id}')`;
                                                                    // let updateSimIds = 'update sim_ids set used=1, user_acc_id="' + user_acc_id + '" , start_date = "' + start_date + '" , dealer_id  = "' + dealer_id + '" where sim_id ="' + sim_id2 + '"';
                                                                    let simIdInsertResult = await sql.query(insertSimId2)
                                                                    if (simIdInsertResult.affectedRows) {
                                                                        // helpers.updateSimStatus(sim_id, 'active')


                                                                        let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id2 + "'"
                                                                        sql.query(getsimID, function (err, result) {
                                                                            if (result && result.length) {
                                                                                let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${user_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id' , '${start_date}')`
                                                                                sql.query(insertAccService)
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                                let data_plan_package2 = [basic_data_plan.sim_id2]
                                                                let data_plan_price = 0
                                                                let data_limit = basic_data_plan.sim_id2.data_limit
                                                                if (data_plans.sim_id2) {
                                                                    data_plans.sim_id2.added_date = start_date
                                                                    data_plan_package2.push(data_plans.sim_id2)
                                                                    data_plan_price = data_plan_price + Number(data_plans.sim_id2.pkg_price)
                                                                    data_limit = data_limit + Number(data_plans.sim_id2.data_limit)
                                                                }
                                                                let data_package_plan2 = `INSERT INTO sim_data_plans ( service_id , data_plan_package ,  total_price, total_data , sim_type , start_date) VALUES( ${service_id} , '${JSON.stringify(data_plan_package2)}' , '${data_plan_price}' , '${data_limit}' , 'sim_id2' , '${start_date}')`
                                                                sql.query(data_package_plan2)
                                                            }

                                                            let updatePgpEmails = 'update pgp_emails set used=1, user_acc_id="' + user_acc_id + '" , start_date ="' + start_date + '" , dealer_id  = "' + dealer_id + '"  where pgp_email ="' + pgp_email + '"';
                                                            let pgpEmailUpdateResult = await sql.query(updatePgpEmails);
                                                            if (pgpEmailUpdateResult.affectedRows) {
                                                                let getsimID = "SELECT * FROM pgp_emails WHERE pgp_email = '" + pgp_email + "'"
                                                                sql.query(getsimID, function (err, result) {
                                                                    if (result && result.length) {
                                                                        let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${user_acc_id} , ${service_id} , ${result[0].id} , '${result[0].pgp_email}' , 'pgp_email' , '${start_date}')`
                                                                        sql.query(insertAccService)
                                                                    }
                                                                })
                                                            }

                                                            if (policy_id !== '') {
                                                                var slctpolicy = "select * from policy where id = " + policy_id + "";
                                                                let policy = await sql.query(slctpolicy);
                                                                var applyQuery = "INSERT INTO device_history (dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type, action_by, dealer_type) VALUES (" + dealer_id + "," + user_acc_id + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy', " + verify.user.id + ", '" + verify.user.user_type + "')";
                                                                sql.query(applyQuery)
                                                            }
                                                            // console.log(packages);
                                                            if (exp_month !== '0') {
                                                                let inv_no = await helpers.getInvoiceId()
                                                                const invoice = {
                                                                    shipping: {
                                                                        name: verify.user.dealer_name,
                                                                        device_id: "Pre-activaion",
                                                                        dealer_pin: verify.user.link_code,
                                                                        user_id: user_id
                                                                    },
                                                                    products: products,
                                                                    packages: packages,
                                                                    hardwares: hardwares,
                                                                    pay_now: pay_now,
                                                                    discount: discount,
                                                                    discountPercent: "3%",
                                                                    quantity: 1,
                                                                    subtotal: invoice_subtotal,
                                                                    paid: discounted_price,
                                                                    invoice_nr: inv_no,
                                                                    invoice_status: invoice_status,
                                                                    paid_credits: paid_credits,
                                                                    expiry_date: expiry_date
                                                                };

                                                                let fileName = "invoice-" + inv_no + ".pdf"
                                                                let filePath = path.join(__dirname, "../../uploads/" + fileName)
                                                                await createInvoice(invoice, filePath)

                                                                let attachment = {
                                                                    fileName: fileName,
                                                                    file: filePath
                                                                }

                                                                let html = 'Pre-activation device created successfully. Invoice is attached below. <br>';
                                                                sendEmail("Pre-Activation device creation.", html, verify.user.dealer_email, null, attachment)

                                                                sql.query(`INSERT INTO invoices (inv_no,user_acc_id,dealer_id,file_name ,end_user_payment_status) VALUES('${inv_no}',${user_acc_id},${dealer_id}, '${fileName}' , '${endUser_pay_status}')`)
                                                            }

                                                            if (exp_month == 0) {
                                                                sql.query(`UPDATE dealers SET remaining_demos = remaining_demos - 1 WHERE dealer_id = ${dealer_id}`)
                                                            }
                                                            let user_credits = "SELECT * FROM financial_account_balance WHERE dealer_id=" + dealer_id
                                                            let account_balance = await sql.query(user_credits)

                                                            sql.query("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name, dealers.connected_dealer from devices left join usr_acc on devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 and devices.id='" + dvc_id + "'", async function (error, results, fields) {

                                                                if (error) {
                                                                    console.log(error);
                                                                }
                                                                // console.log("user data list ", results)
                                                                // let pgp_emails = await device_helpers.getPgpEmails(results[0].id);
                                                                // let sim_ids = await device_helpers.getSimids(results[0].id);
                                                                // let chat_ids = await device_helpers.getChatids(results[0].id);
                                                                results[0].finalStatus = device_helpers.checkStatus(results[0]);
                                                                let servicesData = await device_helpers.getServicesData(results[0].id);
                                                                let servicesIds = servicesData.map(item => { return item.id })
                                                                let userAccServiceData = []
                                                                let dataPlans = []
                                                                if (servicesIds.length) {
                                                                    userAccServiceData = await device_helpers.getUserAccServicesData(results[0].id, servicesIds)
                                                                    dataPlans = await device_helpers.getDataPlans(servicesIds)
                                                                }
                                                                // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                                                //     results[0].pgp_email = pgp_emails[0].pgp_email
                                                                // } else {
                                                                //     results[0].pgp_email = "N/A"
                                                                // }
                                                                // if (sim_ids && sim_ids.length) {
                                                                //     results[0].sim_id = sim_ids[0].sim_id
                                                                //     results[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                                                // }
                                                                // if (chat_ids[0] && chat_ids[0].chat_id) {
                                                                //     results[0].chat_id = chat_ids[0].chat_id
                                                                // }
                                                                // else {
                                                                //     results[0].chat_id = "N/A"
                                                                // }
                                                                results[0].sim_id = "N/A"
                                                                results[0].sim_id2 = "N/A"
                                                                results[0].pgp_email = "N/A"
                                                                results[0].chat_id = "N/A"
                                                                let services = servicesData;
                                                                let service_id = null
                                                                if (services && services.length) {
                                                                    services.map((item) => {
                                                                        if (item.status === 'extended') {
                                                                            results[0].extended_services = item
                                                                        } else {
                                                                            results[0].services = item
                                                                            service_id = item.id
                                                                        }
                                                                    })
                                                                }

                                                                let productsData = userAccServiceData.filter(item => item.user_acc_id === results[0].id && item.service_id === service_id);
                                                                if (productsData && productsData.length) {
                                                                    productsData.map((item) => {
                                                                        if (item.type === 'sim_id') {
                                                                            results[0].sim_id = item.product_value
                                                                        }
                                                                        else if (item.type === 'sim_id2') {
                                                                            results[0].sim_id2 = item.product_value
                                                                        }
                                                                        else if (item.type === 'pgp_email') {
                                                                            results[0].pgp_email = item.product_value
                                                                        }
                                                                        else if (item.type === 'chat_id') {
                                                                            results[0].chat_id = item.product_value
                                                                        }
                                                                    })
                                                                }
                                                                let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                                                results[0].sim_id_data_plan = sim_id_data_plan[0]
                                                                let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                                                results[0].sim_id2_data_plan = sim_id2_data_plan[0]
                                                                // if (servicesData[0]) {
                                                                //     results[0].services = servicesData[0]
                                                                // }

                                                                // dealerData = await device_helpers.getDealerdata(results[i]);
                                                                device_helpers.saveActionHistory(
                                                                    results[0],
                                                                    constants.DEVICE_PRE_ACTIVATION,
                                                                    verify.user
                                                                );
                                                                results[0].vpn = await device_helpers.getVpn(results[0])

                                                                data = {
                                                                    status: true,
                                                                    msg: await helpers.convertToLang(req.translation[MsgConstants.PRE_ACTIV_ADD_SUCC], "Pre-activation added succcessfully."), // Pre-activation added succcessfully.
                                                                    data: results,
                                                                    credits: account_balance[0] ? account_balance[0].credits : 0
                                                                };

                                                                res.send({
                                                                    status: true,
                                                                    data: data,

                                                                })
                                                                return;
                                                            })

                                                        } else {
                                                            data = {
                                                                status: false,
                                                                msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_ADD], "Device couldn't added"), // Device couldn't added
                                                            }
                                                            res.send(data);
                                                            return;
                                                        }

                                                    });
                                                }


                                            })

                                        } else {
                                            res.send({
                                                status: false,
                                                msg: "Dealer not found."
                                            });
                                            return

                                        }
                                    });
                                }
                            }
                        }
                        else {
                            res.send({
                                status: false,
                                msg: "Services are not found in request.Please select sevices and try again."
                            });
                            return
                        }

                    } else {
                        res.send({
                            status: false,
                            msg: "Error: Dealer doesn't have enough credits to make this request. Please purchase credits and try again later."
                        });
                        return
                    }
                } else {
                    res.send({
                        status: false,
                        msg: "Error: Dealer doesn't have credits to make this request. Please purchase credits and try again later."
                    });
                    return
                }
            }
        });
    }
}

exports.editDevice = async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let usr_device_id = req.body.usr_device_id;
        if (usr_device_id) {

            let loggedDealerId = verify.user.id;
            let loggedDealerType = verify.user.user_type;
            let device_id = req.body.device_id;
            let dealer_id = req.body.dealer_id;
            let client_id = req.body.client_id;
            let model = req.body.model;
            let user_id = req.body.user_id;
            let usr_acc_id = req.body.usr_acc_id;
            let usr_device_id = req.body.usr_device_id;
            let prevPGP = req.body.prevPGP;
            let prevChatID = req.body.prevChatID;
            let prevSimId = req.body.prevSimId;
            let prevSimId2 = req.body.prevSimId2;
            let finalStatus = req.body.finalStatus;
            var note = req.body.note;
            var validity = req.body.validity;
            let start_date = req.body.start_date;
            let sim_id = req.body.sim_id;
            let sim_id2 = req.body.sim_id2;
            let chat_id = req.body.chat_id;
            let pgp_email = req.body.pgp_email;
            // console.log(sim_id, sim_id2 ,  pgp_email);
            let newService = req.body.service;
            let prevService = req.body.prevService
            let endUser_pay_status = req.body.paid_by_user ? req.body.paid_by_user : "PAID"
            let products = (req.body.products) ? req.body.products : []
            let packages = (req.body.packages) ? req.body.packages : []
            let admin_data = await sql.query("SELECT * FROM dealers WHERE type = 1")
            let total_price = req.body.total_price;
            let admin_profit = 0
            let dealer_profit = 0
            let prev_service_admin_profit = 0
            let prev_service_dealer_profit = 0
            let refund_prev_service_admin_profit = 0
            let refund_prev_service_dealer_profit = 0
            let dealer_credits = 0
            let refund_due_credits = 0
            let remaining_credits = null
            // console.log(req.body.expiry_date);
            var expiry_date = loggedDealerType === constants.ADMIN ? moment(req.body.expiry_date).format("YYYY/MM/DD") : req.body.expiry_date
            var date_now = moment(new Date()).format('YYYY/MM/DD')
            let creditsToRefund = 0
            let prevServicePaidPrice = 0
            let prevServicePackages = []
            let prevServiceProducts = []
            let serviceRemainingDays = 0
            let newServicePrice = 0
            let prevServiceTotalDays = 0
            let pay_now = req.body.pay_now
            let cancelService = req.body.cancelService ? req.body.cancelService : false
            let exp_month = expiry_date
            let sub_total = 0
            let paid_credits = 0

            let invoice_status = pay_now ? "PAID" : "UNPAID"
            let dealer_credits_copy = 0
            var basic_data_plan = {
                sim_id:
                {
                    data_limit: 2000,
                    pkg_price: 0,
                    term: exp_month
                },
                sim_id2:
                {
                    data_limit: 2000,
                    pkg_price: 0,
                    term: exp_month
                }
            }
            // console.log(req.body.data_plans)
            var data_plans = req.body.data_plans ? req.body.data_plans : basic_data_plan
            // console.log(expiry_date);
            // return
            // console.log("Cancel Services", user_id);
            // if (pay_now) {
            //     total_price = total_price - (total_price * 0.03);
            // }

            let sim_id_included = false
            let sim_id2_included = false

            if (packages.length) {
                packages.map((item) => {
                    if (item.pkg_features.sim_id) {
                        sim_id_included = true
                    }
                    if (item.pkg_features.sim_id2) {
                        sim_id2_included = true
                    }
                })
            }

            if (expiry_date == "" || expiry_date === null) {
                var status = "expired";
            } else if (expiry_date == 0) {
                var status = "trial";
            } else if (finalStatus === constants.DEVICE_PRE_ACTIVATION) {
                var status = "";
            } else if (finalStatus === constants.DEVICE_EXPIRED) {
                var status = "expired";
            } else {
                var status = "active";
            }

            let loggedInUserData = await sql.query(`SELECT * FROM dealers WHERE dealer_id =?`, [loggedDealerId])
            if (!loggedInUserData || loggedInUserData.length < 1) {
                res.send({
                    status: false,
                    msg: "Error: Dealer not found."
                });
                return
            }

            if (loggedDealerType !== constants.ADMIN) {
                if (loggedInUserData[0].account_balance_status !== 'active' && !pay_now && newService) {
                    res.send({
                        status: false,
                        msg: "Error: Your Account balance status is on restricted level 1. You cannot use pay later function. Please Contact your admin"
                    });
                    return
                }
            }

            var checkDevice = `SELECT * FROM usr_acc WHERE device_id = ?`;
            if (loggedDealerType === constants.SDEALER) {
                checkDevice = checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === constants.DEALER) {
                checkDevice =
                    checkDevice +
                    " AND (dealer_id = " +
                    loggedDealerId +
                    " OR prnt_dlr_id = " +
                    loggedDealerId +
                    " )";
            } else if (loggedDealerType === constants.ADMIN) {
                checkDevice = checkDevice;
            } else {
                res.send({
                    status: false,
                    msg: ""
                });
                return;
            }
            console.log('====>:', checkDevice)
            if (loggedDealerType === constants.ADMIN) {
                let response = await device_helpers.editDeviceAdmin(req.body, verify)
                res.send(response)
                return
            } else {
                sql.query(checkDevice, [sql.escape(usr_device_id)], async function (error, rows) {
                    if (error) {
                        console.log('edit check device error:');
                        return res.send({
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[''],
                                "ERROR: internal server error"
                            ) // No Device found
                        });
                    }
                    console.log(rows);
                    if (rows.length) {
                        if (newService) {
                            let user_credits_q = "SELECT * FROM financial_account_balance WHERE dealer_id=" + dealer_id
                            let results = await sql.query(user_credits_q)
                            if (!pay_now && results[0].credits_limit > (results[0].credits - total_price)) {
                                res.send({
                                    status: false,
                                    msg: "Error: Your Credits limits will exceed after apply this service. Please select other services OR Purchase Credits."
                                });
                                return
                            }
                            if (results && results.length || expiry_date == 0 || !pay_now) {
                                dealer_credits = results[0] ? results[0].credits : 0
                                dealer_credits_copy = dealer_credits
                                if (dealer_credits < total_price && pay_now) {
                                    res.send({
                                        status: false,
                                        msg: "Error: Dealer doesn't have enough credits to make this request. Please purchase credits and try again later."
                                    });
                                    return
                                } else {
                                    if (pgp_email) {
                                        let checkUniquePgp =
                                            "SELECT * from pgp_emails WHERE pgp_email= '" +
                                            pgp_email +
                                            "' AND user_acc_id != '' AND user_acc_id != '" +
                                            usr_acc_id +
                                            "'";
                                        // let checkUnique = "SELECT usr_acc.* from usr_acc WHERE account_email= '" + device_email + "' AND device_id != '" + device_id + "'"
                                        let success = await sql.query(checkUniquePgp)
                                        if (success.length) {
                                            res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(
                                                    req.translation[
                                                    MsgConstants.PGP_EMAIL_ALRDY_TKN
                                                    ],
                                                    "PGP email already taken"
                                                ) // PGP email already taken
                                            });
                                            return
                                        }
                                    }

                                    if (expiry_date == 0) {
                                        if (
                                            finalStatus ===
                                            constants.DEVICE_PRE_ACTIVATION ||
                                            finalStatus === constants.DEVICE_TRIAL
                                        ) {
                                            var trailDate = moment(
                                                date_now,
                                                "YYYY/MM/DD"
                                            ).add(7, "days");
                                            expiry_date = moment(trailDate).format(
                                                "YYYY/MM/DD"
                                            );
                                        }
                                    } else if (
                                        expiry_date == 1 ||
                                        expiry_date == 3 ||
                                        expiry_date == 6 ||
                                        expiry_date == 12
                                    ) {
                                        expiry_date = moment(
                                            date_now,
                                            "YYYY/MM/DD"
                                        ).add(expiry_date, "M").format('YYYY/MM/DD');

                                        let currentDate = moment(new Date()).format(
                                            "YYYY/MM/DD"
                                        );
                                        // console.log(currentDate, expiry_date);
                                        if (currentDate < expiry_date && finalStatus === constants.DEVICE_EXPIRED) {
                                            // console.log(device);
                                            socket_helpers.sendDeviceStatus(sockets.baseIo,
                                                device_id,
                                                "active",
                                                true
                                            );
                                            status = "active";
                                        }
                                        if (prevService) {
                                            prevServiceData = await sql.query("SELECT * from services_data WHERE id = " + prevService.id)
                                            if (prevServiceData.length) {
                                                let prevService = prevServiceData[0]
                                                prevServicePackages = JSON.parse(prevService.packages)
                                                prevServiceProducts = JSON.parse(prevService.products)
                                                let preTotalPrice = prevService.total_credits
                                                let prevServiceExpiryDate = moment(new Date(prevService.service_expiry_date))
                                                let prevServiceStartDate = moment(new Date(prevService.start_date))
                                                let dateNow = moment(new Date())
                                                serviceRemainingDays = prevServiceExpiryDate.diff(dateNow, 'days') + 1
                                                prevServiceTotalDays = prevServiceExpiryDate.diff(prevServiceStartDate, 'days')
                                                // console.log(serviceRemainingDays, prevServiceTotalDays, preTotalPrice);
                                                creditsToRefund = Math.ceil((preTotalPrice / prevServiceTotalDays) * serviceRemainingDays)
                                                // console.log(creditsToRefund);
                                                // return
                                                prevServicePaidPrice = preTotalPrice - creditsToRefund

                                                let profitLoss = await helpers.calculateProfitLoss(prevServicePackages, prevServiceProducts, loggedDealerType)
                                                prev_service_admin_profit = profitLoss.admin_profit
                                                prev_service_dealer_profit = profitLoss.dealer_profit
                                                refund_prev_service_admin_profit = Math.ceil((prev_service_admin_profit / prevServiceTotalDays) * serviceRemainingDays)
                                                refund_prev_service_dealer_profit = Math.ceil((prev_service_dealer_profit / prevServiceTotalDays) * serviceRemainingDays)
                                            }
                                        }
                                        // console.log(products);
                                        if (packages && packages.length) {
                                            packages.map((item) => {
                                                newServicePrice += Number(item.pkg_price)
                                            })
                                        }
                                        if (products && products.length) {
                                            products.map((item) => {
                                                newServicePrice += Number(item.unit_price)
                                            })
                                        }
                                        sub_total = newServicePrice
                                        // console.log(newServicePrice, prevServicePaidPrice, newServicePrice, creditsToRefund);
                                        if (pay_now) {
                                            newServicePrice = newServicePrice - Math.ceil((newServicePrice * 0.03))
                                        }
                                        total_price = newServicePrice - creditsToRefund

                                        let profitLoss = await helpers.calculateProfitLoss(packages, products, loggedDealerType)
                                        if (pay_now) {
                                            admin_profit = profitLoss.admin_profit - Math.ceil((profitLoss.admin_profit * 0.03))
                                            dealer_profit = profitLoss.dealer_profit - Math.ceil((profitLoss.dealer_profit * 0.03))
                                        } else {
                                            admin_profit = profitLoss.admin_profit
                                            dealer_profit = profitLoss.dealer_profit
                                        }
                                    }

                                }
                            } else {
                                res.send({
                                    status: false,
                                    msg: "Error: Dealer doesn't have credits to make this request. Please purchase credits and try again later."
                                });
                                return
                            }
                        }
                        common_Query = `UPDATE devices set model = '${req.body.model}' WHERE id = '${usr_device_id}'`;
                        if (
                            finalStatus !== constants.DEVICE_PRE_ACTIVATION
                        ) {
                            if (expiry_date == 0) {
                                usr_acc_Query =
                                    "UPDATE usr_acc set status = '" +
                                    status +
                                    "',note = '" +
                                    note +
                                    "' ,client_id = '" +
                                    client_id +
                                    "', device_status = 1, unlink_status=0 ,  start_date = '" +
                                    start_date +
                                    "' WHERE device_id = '" +
                                    usr_device_id +
                                    "'";
                            } else {
                                usr_acc_Query =
                                    "UPDATE usr_acc set  status = '" +
                                    status +
                                    "',note = '" +
                                    note +
                                    "' ,client_id = '" +
                                    client_id +
                                    "', device_status = 1, unlink_status=0 ,  start_date = '" +
                                    start_date +
                                    "' ,expiry_date = '" +
                                    expiry_date +
                                    "' WHERE device_id = '" +
                                    usr_device_id +
                                    "'";
                            }
                        } else {
                            if (expiry_date == 0) {
                                usr_acc_Query =
                                    "UPDATE usr_acc set status = '" +
                                    status +
                                    "',validity = '" +
                                    validity +
                                    "' ,note = '" +
                                    note +
                                    "' ,client_id = '" +
                                    client_id +
                                    "', device_status = 0, unlink_status=0 ,start_date = '" +
                                    start_date +
                                    "' WHERE device_id = '" +
                                    usr_device_id +
                                    "'";
                            } else {
                                usr_acc_Query =
                                    "UPDATE usr_acc set status = '" +
                                    status +
                                    "',validity = '" +
                                    validity +
                                    "' ,note = '" +
                                    note +
                                    "' ,client_id = '" +
                                    client_id +
                                    "', device_status = 0, unlink_status=0 ,start_date = '" +
                                    start_date +
                                    "', expiry_date = '" +
                                    expiry_date +
                                    "' WHERE device_id = '" +
                                    usr_device_id +
                                    "'";
                            }
                        }
                        sql.query(common_Query, async function (error, row) {
                            if (error) {
                                console.log('update device query error:');
                                return res.send({
                                    status: false,
                                    msg: await helpers.convertToLang(
                                        req.translation[''],
                                        "ERROR: internal server error"
                                    ) // No Device found
                                });
                            }

                            await sql.query(usr_acc_Query);
                            if (newService) {

                                let update_credits_query = '';
                                let prev_data_packages = []
                                if (prevService) {
                                    let update_prev_service_billing = `UPDATE services_data set status = 'returned',paid_credits = ${prevServicePaidPrice}, end_date = '${date_now}' WHERE id = ${prevService.id} `
                                    await sql.query(update_prev_service_billing);

                                    helpers.updateRefundSaleDetails(usr_acc_id, prevService.id, serviceRemainingDays, prevServiceTotalDays)

                                    let transection_record = "SELECT * from financial_account_transections where user_dvc_acc_id = " + usr_acc_id + " AND user_id = '" + verify.user.id + "' AND type = 'services' ORDER BY id DESC LIMIT 1"
                                    let transection_record_data = await sql.query(transection_record)
                                    if (transection_record_data.length) {
                                        if (transection_record_data[0] && transection_record_data[0].status === 'pending') {
                                            let update_transection = "UPDATE financial_account_transections SET status = 'cancelled' WHERE id = " + transection_record_data[0].id
                                            await sql.query(update_transection)

                                            update_credits_query = 'update financial_account_balance set credits = credits + ' + transection_record_data[0].credits + ' where dealer_id ="' + dealer_id + '"';
                                            await sql.query(update_credits_query);


                                            let update_profits_transections = "UPDATE financial_account_transections SET status = 'cancelled' WHERE user_dvc_acc_id = " + usr_acc_id + " AND status = 'holding' AND type = 'services'"
                                            await sql.query(update_profits_transections)

                                            if (prevServicePaidPrice > 0) {
                                                let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service charges", service_id: prevService.id })}',${prevServicePaidPrice} ,'credit','pending' , 'services' , 0 , ${prevServicePaidPrice})`
                                                await sql.query(transection_credits)

                                                update_credits_query = 'update financial_account_balance set credits = credits - ' + prevServicePaidPrice + ' where dealer_id ="' + dealer_id + '"';
                                                await sql.query(update_credits_query);

                                                let admin_holding_profit = prev_service_admin_profit - refund_prev_service_admin_profit
                                                let dealer_holding_profit = prev_service_dealer_profit - refund_prev_service_dealer_profit

                                                if (admin_holding_profit > 0) {
                                                    let admin_profit_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${admin_data[0].dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service holding profit", service_id: prevService.id })}',${admin_holding_profit} ,'debit','holding' , 'services')`
                                                    await sql.query(admin_profit_transection)
                                                }

                                                if (dealer_holding_profit > 0) {
                                                    let dealer_profit_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${verify.user.connected_dealer},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service holding profit", service_id: prevService.id })}',${dealer_holding_profit} ,'debit','holding' , 'services')`
                                                    await sql.query(dealer_profit_transection)
                                                }
                                            }

                                        } else {
                                            let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, details: "REFUND SERVICES CREITS", service_id: prevService.id })}' ,${creditsToRefund} ,'debit' , 'transferred' , 'services')`
                                            await sql.query(transection_credits)
                                            update_credits_query = 'update financial_account_balance set credits = credits + ' + creditsToRefund + ' where dealer_id ="' + dealer_id + '"';
                                            await sql.query(update_credits_query);
                                            refund_prev_service_admin_profit = refund_prev_service_admin_profit - Math.ceil((refund_prev_service_admin_profit * 0.03))
                                            refund_prev_service_dealer_profit = refund_prev_service_dealer_profit - Math.ceil((refund_prev_service_dealer_profit * 0.03))

                                            if (prevServicePaidPrice > 0) {

                                                let admin_prev_service_profit = prev_service_admin_profit - refund_prev_service_admin_profit
                                                let dealer_prev_service_profit = prev_service_dealer_profit - refund_prev_service_dealer_profit

                                                if (admin_prev_service_profit > 0) {

                                                    let admin_profit_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${admin_data[0].dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service refund profit", service_id: prevService.id })}',${admin_prev_service_profit} ,'credit','transferred' , 'services')`
                                                    await sql.query(admin_profit_transection)
                                                }
                                                if (dealer_prev_service_profit > 0) {
                                                    let dealer_profit_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${verify.user.connected_dealer},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service refund profit", service_id: prevService.id })}',${dealer_prev_service_profit} ,'credit','transferred' , 'services')`
                                                    await sql.query(dealer_profit_transection)
                                                }
                                            }
                                            // console.log("", refund_prev_service_admin_profit);
                                            if (refund_prev_service_admin_profit) {
                                                updateAdminProfit = 'update financial_account_balance set credits = credits - ' + refund_prev_service_admin_profit + ' where dealer_id ="' + admin_data[0].dealer_id + '"';
                                                await sql.query(updateAdminProfit);
                                            }
                                            if (refund_prev_service_dealer_profit) {
                                                updateAdminProfit = 'update financial_account_balance set credits = credits - ' + refund_prev_service_dealer_profit + ' where dealer_id ="' + verify.user.connected_dealer + '"';
                                                await sql.query(updateAdminProfit);
                                            }
                                        }
                                    }
                                    prev_data_packages = await sql.query(`SELECT * FROM sim_data_plans WHERE service_id = ${prevService.id} AND status = 'active'`)
                                }

                                let service_billing = `INSERT INTO services_data (user_acc_id , dealer_id , products, packages, total_credits, start_date, service_expiry_date , service_term) VALUES (${usr_acc_id},${dealer_id}, '${JSON.stringify(products)}','${JSON.stringify(packages)}',${newServicePrice} ,'${date_now}' ,'${expiry_date}' , '${exp_month}')`
                                let service_data_result = await sql.query(service_billing);
                                let service_id = null
                                if (service_data_result.affectedRows) {
                                    service_id = service_data_result.insertId
                                    helpers.saveServiceSalesDetails(JSON.parse(JSON.stringify(packages)), products, loggedDealerType, usr_acc_id, service_data_result.insertId, pay_now)
                                }

                                if (pgp_email != prevPGP) {
                                    console.log("PGP change");

                                    let updatePgpEmails =
                                        'update pgp_emails set user_acc_id = "' +
                                        usr_acc_id +
                                        '",  used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '"  where pgp_email ="' +
                                        pgp_email +
                                        '"';
                                    await sql.query(updatePgpEmails);

                                    if (
                                        finalStatus ===
                                        constants.DEVICE_PRE_ACTIVATION
                                    ) {
                                        let updatePrevPgp =
                                            'update pgp_emails set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where pgp_email ="' +
                                            prevPGP +
                                            '"';
                                        await sql.query(updatePrevPgp);
                                    } else {
                                        let updatePrevPgp =
                                            'update pgp_emails set used=1 ,  end_date = "' + date_now + '"  where pgp_email ="' +
                                            prevPGP +
                                            '"';
                                        await sql.query(updatePrevPgp);
                                    }
                                }
                                if (chat_id != prevChatID) {
                                    console.log("Chat change");
                                    let updateChatIds =
                                        'update chat_ids set user_acc_id = "' +
                                        usr_acc_id +
                                        '", used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '" where chat_id ="' +
                                        chat_id +
                                        '"';
                                    await sql.query(updateChatIds);
                                    if (
                                        finalStatus ===
                                        constants.DEVICE_PRE_ACTIVATION
                                    ) {
                                        let updatePrevChat =
                                            'update chat_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where chat_id ="' +
                                            prevChatID +
                                            '"';
                                        await sql.query(updatePrevChat);
                                    } else {
                                        let updatePrevChat =
                                            'update chat_ids set used=1 , end_date = "' + date_now + '" where chat_id ="' +
                                            prevChatID +
                                            '"';
                                        await sql.query(updatePrevChat);
                                    }
                                }
                                if (sim_id != prevSimId) {
                                    console.log("sim change");
                                    if (sim_id && sim_id !== 'N/A') {
                                        let insertSimIds = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used , uploaded_by , uploaded_by_id) VALUES ('${sim_id}' , ${usr_acc_id} , '${date_now}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;

                                        sql.query(insertSimIds, function (err, result) {
                                            if (result && result.insertId) {
                                                if (finalStatus != constants.DEVICE_PRE_ACTIVATION) {
                                                    helpers.updateSimStatus(sim_id, 'active')
                                                }
                                            }
                                        });
                                    }
                                    if (
                                        finalStatus ===
                                        constants.DEVICE_PRE_ACTIVATION
                                    ) {
                                        let updatePrevSim =
                                            'update sim_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null , delete_status = 1 where sim_id ="' +
                                            prevSimId +
                                            '"';
                                        await sql.query(updatePrevSim);
                                    } else {
                                        let updatePrevSim =
                                            'update sim_ids set used=1 , expiry_date = "' + date_now + '" , delete_status = 1 where sim_id ="' +
                                            prevSimId +
                                            '"';
                                        await sql.query(updatePrevSim);

                                        if (finalStatus != constants.DEVICE_PRE_ACTIVATION) {
                                            helpers.updateSimStatus(sim_id, 'suspended')
                                        }


                                    }
                                }
                                if (sim_id2 != prevSimId2) {
                                    console.log("sim id 2 change");
                                    if (sim_id2 && sim_id !== 'N/A') {
                                        let insertSimIds = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used ,uploaded_by , uploaded_by_id) VALUES ('${sim_id2}' , ${usr_acc_id} , '${date_now}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;
                                        sql.query(insertSimIds, function (err, result) {
                                            if (result && result.insertId) {
                                                if (finalStatus != constants.DEVICE_PRE_ACTIVATION) {
                                                    helpers.updateSimStatus(sim_id2, 'active')
                                                }
                                            }
                                        });
                                    }
                                    if (
                                        finalStatus ===
                                        constants.DEVICE_PRE_ACTIVATION
                                    ) {
                                        let updatePrevSim =
                                            'update sim_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where sim_id ="' +
                                            prevSimId +
                                            '"';
                                        await sql.query(updatePrevSim);
                                    } else {
                                        let updatePrevSim =
                                            'update sim_ids set used=1 , expiry_date = "' + date_now + '" , delete_status = 1 where sim_id ="' +
                                            prevSimId +
                                            '"';
                                        await sql.query(updatePrevSim);
                                        if (finalStatus != constants.DEVICE_PRE_ACTIVATION) {
                                            helpers.updateSimStatus(sim_id, 'suspended')
                                        }
                                    }
                                }

                                if (chat_id && chat_id !== '') {
                                    let getChatID = "SELECT * FROM chat_ids WHERE chat_id = '" + chat_id + "'"
                                    sql.query(getChatID, function (err, result) {
                                        if (result && result.length) {
                                            let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].chat_id}' , 'chat_id' , '${start_date}')`
                                            sql.query(insertAccService)
                                        }
                                    })
                                }

                                if (sim_id && sim_id !== '') {
                                    let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id + "'"
                                    sql.query(getsimID, function (err, result) {
                                        if (result && result.length) {
                                            let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id' , '${start_date}')`
                                            sql.query(insertAccService)
                                        }
                                    })
                                }

                                if (sim_id2 && sim_id2 !== '') {
                                    let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id2 + "'"
                                    sql.query(getsimID, function (err, result) {
                                        if (result && result.length) {
                                            let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id' , '${start_date}')`
                                            sql.query(insertAccService)
                                        }
                                    })
                                }

                                if (pgp_email && pgp_email !== '') {
                                    let getPgp = "SELECT * FROM pgp_emails WHERE pgp_email = '" + pgp_email + "'"
                                    sql.query(getPgp, function (err, result) {
                                        if (result && result.length) {
                                            let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].pgp_email}' , 'pgp_email' , '${start_date}')`
                                            sql.query(insertAccService)
                                        }
                                    })
                                }

                                if (sim_id_included) {
                                    let used_data = 0
                                    if (prev_data_packages && prev_data_packages.length) {
                                        let sim_id_data_plan = prev_data_packages.find(item => item.sim_type === 'sim_id')
                                        if (sim_id_data_plan) {
                                            used_data = sim_id_data_plan.used_data
                                            await sql.query(`UPDATE sim_data_plans SET status = 'deleted' , end_date = '${date_now}' WHERE id = ${sim_id_data_plan.id}`)
                                        }

                                    }
                                    let data_plan_package = data_plans.sim_id
                                    let data_package_plan = `INSERT INTO sim_data_plans ( service_id , data_plan_package , total_data , sim_type , used_data , start_date) VALUES( ${service_id} , '${JSON.stringify(data_plan_package)}' , '${data_plan_package.data_limit}' , 'sim_id' , ${used_data} , '${date_now}')`
                                    sql.query(data_package_plan)
                                }

                                if (sim_id2_included) {
                                    let used_data = 0
                                    if (prev_data_packages && prev_data_packages.length) {
                                        let sim_id2_data_plan = prev_data_packages.find(item => item.sim_type === 'sim_id')
                                        if (sim_id2_data_plan) {
                                            used_data = sim_id2_data_plan.used_data
                                            await sql.query(`UPDATE sim_data_plans SET status = 'deleted' , end_date = '${date_now}' WHERE id = ${sim_id2_data_plan.id}`)
                                        }
                                    }
                                    let data_plan_package2 = data_plans.sim_id2
                                    let data_package_plan2 = `INSERT INTO sim_data_plans ( service_id , data_plan_package , total_data , sim_type , used_data , start_date) VALUES( ${service_id} , '${JSON.stringify(data_plan_package2)}' , '${data_plan_package2.data_limit}' , 'sim_id2' , ${used_data} , '${date_now}')`
                                    sql.query(data_package_plan2)
                                }

                                let transection_status = 'transferred'

                                if (!pay_now) {
                                    transection_status = 'pending'
                                }

                                if (pay_now) {
                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${newServicePrice} ,'credit' , '${transection_status}' , 'services' , ${newServicePrice} , ${0})`
                                    await sql.query(transection_credits)
                                }
                                else {
                                    let transection_due_credits = newServicePrice;
                                    dealer_credits_copy += creditsToRefund
                                    if (dealer_credits_copy > 0) {
                                        transection_due_credits = newServicePrice - dealer_credits_copy
                                        paid_credits = dealer_credits_copy
                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${newServicePrice} ,'credit' , '${transection_status}' , 'services' , ${paid_credits} , ${transection_due_credits})`
                                        await sql.query(transection_credits)
                                        invoice_status = "PARTIALLY PAID"
                                    } else {
                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${newServicePrice} ,'credit' , 'pending' , 'services' , 0 ,${newServicePrice})`
                                        await sql.query(transection_credits)
                                    }
                                }

                                update_credits_query = 'update financial_account_balance set credits = credits - ' + newServicePrice + ' where dealer_id ="' + dealer_id + '"';

                                await sql.query(update_credits_query);
                                // if (pay_now) {
                                //     update_credits_query = 'update financial_account_balance set credits =' + remaining_credits + ' ,due_credits = due_credits - ' + refund_due_credits + '  where dealer_id ="' + dealer_id + '"';
                                // } else {
                                //     total_price = total_price - refund_due_credits
                                // }

                                await helpers.updateProfitLoss(admin_profit, dealer_profit, admin_data, verify.user.connected_dealer, usr_acc_id, loggedDealerType, pay_now, service_id)
                                if (exp_month == 0 && prevService && prevService.service_term != 0) {
                                    sql.query(`UPDATE dealers SET remaining_demos = remaining_demos - 1 WHERE dealer_id = ${dealer_id}`)
                                } else if (prevService && prevService.service_term == 0 && exp_month != 0) {
                                    sql.query(`UPDATE dealers SET remaining_demos = remaining_demos + 1 WHERE dealer_id = ${dealer_id}`)
                                }

                                let inv_no = await helpers.getInvoiceId()
                                const invoice = {
                                    shipping: {
                                        name: verify.user.dealer_name,
                                        device_id: device_id,
                                        dealer_pin: verify.user.link_code,
                                        user_id: user_id
                                    },
                                    products: products,
                                    packages: packages,
                                    prevService: {
                                        prevServicePackages: prevServicePackages,
                                        prevServiceProducts: prevServiceProducts,
                                        creditsToRefund: creditsToRefund,
                                        serviceRemainingDays: serviceRemainingDays,
                                        prevServiceTotalDays: prevServiceTotalDays
                                    },
                                    pay_now: pay_now,
                                    discount: (pay_now) ? Math.ceil(newServicePrice * 0.03) : 0,
                                    discountPercent: "3%",
                                    quantity: 1,
                                    subtotal: sub_total,
                                    paid: total_price,
                                    invoice_nr: inv_no,
                                    invoice_status: invoice_status,
                                    paid_credits: paid_credits,
                                    expiry_date: expiry_date
                                };

                                let fileName = "invoice-" + inv_no + ".pdf"
                                let filePath = path.join(__dirname, "../../uploads/" + fileName)
                                await createInvoice(invoice, filePath, 'editService')

                                let attachment = {
                                    fileName: fileName,
                                    file: filePath
                                }

                                sql.query(`INSERT INTO invoices (inv_no,user_acc_id,dealer_id,file_name ,end_user_payment_status) VALUES('${inv_no}',${usr_acc_id},${dealer_id}, '${fileName}' , '${endUser_pay_status}')`)

                                html = 'You have changed the services on device. Device ID ' + device_id + '.<br>Your Invoice is attached below. <br>';

                                sendEmail("DEVICE SERVICE HAS BEEN CHANGED.", html, verify.user.dealer_email, null, attachment);

                            } else {
                                let service_id = prevService.id
                                if (service_id) {
                                    if (pgp_email && pgp_email !== 'N/A' && pgp_email != prevPGP) {
                                        console.log("PGP change");
                                        let updatePgpEmails =
                                            'update pgp_emails set user_acc_id = "' +
                                            usr_acc_id +
                                            '",  used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '"  where pgp_email ="' +
                                            pgp_email +
                                            '"';
                                        await sql.query(updatePgpEmails);

                                        if (
                                            finalStatus ===
                                            constants.DEVICE_PRE_ACTIVATION
                                        ) {
                                            let updatePrevPgp =
                                                'update pgp_emails set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where pgp_email ="' +
                                                prevPGP +
                                                '"';
                                            await sql.query(updatePrevPgp);
                                        } else {
                                            let updatePrevPgp =
                                                'update pgp_emails set end_date = "' + date_now + '" where pgp_email ="' +
                                                prevPGP +
                                                '"';
                                            await sql.query(updatePrevPgp);
                                        }
                                        let getPgp = "SELECT * FROM pgp_emails WHERE pgp_email = '" + pgp_email + "'"
                                        sql.query(getPgp, function (err, result) {
                                            if (result && result.length) {
                                                if (prevPGP === 'N/A') {
                                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].pgp_email}' , 'pgp_email' , '${start_date}')`
                                                    sql.query(insertAccService)
                                                } else {
                                                    sql.query(`UPDATE user_acc_services SET product_value = '${pgp_email}' , product_id = ${result[0].id} WHERE service_id= ${service_id} AND product_value = '${prevPGP}'`)
                                                }
                                            }
                                        })
                                    }
                                    if (chat_id && chat_id !== 'N/A' && chat_id != prevChatID) {
                                        console.log("Chat change");
                                        let updateChatIds =
                                            'update chat_ids set user_acc_id = "' +
                                            usr_acc_id +
                                            '", used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '" where chat_id ="' +
                                            chat_id +
                                            '"';
                                        await sql.query(updateChatIds);
                                        if (
                                            finalStatus ===
                                            constants.DEVICE_PRE_ACTIVATION
                                        ) {
                                            let updatePrevChat =
                                                'update chat_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where chat_id ="' +
                                                prevChatID +
                                                '"';
                                            await sql.query(updatePrevChat);
                                        } else {
                                            let updatePrevChat =
                                                'update chat_ids set end_date = "' + date_now + '" where chat_id ="' +
                                                prevChatID +
                                                '"';
                                            await sql.query(updatePrevChat);
                                        }

                                        let getChatID = "SELECT * FROM chat_ids WHERE chat_id = '" + chat_id + "'"
                                        sql.query(getChatID, function (err, result) {
                                            if (result && result.length) {
                                                if (prevChatID === 'N/A') {
                                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].chat_id}' , 'chat_id' , '${start_date}')`
                                                    sql.query(insertAccService)
                                                } else {
                                                    sql.query(`UPDATE user_acc_services SET product_value = '${chat_id}' WHERE service_id= ${service_id} AND product_value = '${prevChatID}'`)
                                                }
                                            }
                                        })

                                    }
                                    if (sim_id && sim_id !== 'N/A' && sim_id != prevSimId) {
                                        console.log("sim change");
                                        // console.log("sim id 2 change");
                                        let insertSimIds = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used ,uploaded_by , uploaded_by_id) VALUES ('${sim_id}' , ${usr_acc_id} , '${date_now}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;

                                        // let insertSimIds =
                                        //     'update sim_ids set user_acc_id = "' +
                                        //     usr_acc_id +
                                        //     '",  used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '" where sim_id ="' +
                                        //     sim_id +
                                        //     '"';
                                        sql.query(insertSimIds, function (err, result) {
                                            if (result && result.insertId) {
                                                if (finalStatus != constants.DEVICE_PRE_ACTIVATION) {
                                                    helpers.updateSimStatus(sim_id, 'active')
                                                }
                                            }
                                        });

                                        if (
                                            finalStatus ===
                                            constants.DEVICE_PRE_ACTIVATION
                                        ) {
                                            let updatePrevSim =
                                                'update sim_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where sim_id ="' +
                                                prevSimId +
                                                '"';
                                            await sql.query(updatePrevSim);
                                        } else {
                                            let updatePrevSim =
                                                'update sim_ids set expiry_date = "' + date_now + '" where sim_id ="' +
                                                prevSimId +
                                                '"';
                                            await sql.query(updatePrevSim);
                                        }

                                        let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id + "'"
                                        sql.query(getsimID, function (err, result) {
                                            if (result && result.length) {
                                                if (prevSimId === 'N/A') {
                                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id' , '${start_date}')`
                                                    sql.query(insertAccService)
                                                } else {
                                                    sql.query(`UPDATE user_acc_services SET product_value = '${sim_id}' WHERE service_id= ${service_id} AND product_value = '${prevSimId}'`)
                                                }
                                            }
                                        })

                                    }

                                    if (sim_id2 && sim_id2 !== 'N/A' && sim_id2 != prevSimId2) {
                                        console.log("sim id 2 change");
                                        let insertSimIds = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used ,uploaded_by , uploaded_by_id) VALUES ('${sim_id2}' , ${usr_acc_id} , '${date_now}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;

                                        // let insertSimIds =
                                        //     'update sim_ids set user_acc_id = "' +
                                        //     usr_acc_id +
                                        //     '",  used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '" where sim_id ="' +
                                        //     sim_id +
                                        //     '"';
                                        sql.query(insertSimIds, function (err, result) {
                                            if (result && result.insertId) {
                                                if (finalStatus != constants.DEVICE_PRE_ACTIVATION) {
                                                    helpers.updateSimStatus(sim_id2, 'active')
                                                }
                                            }
                                        });

                                        if (
                                            finalStatus ===
                                            constants.DEVICE_PRE_ACTIVATION
                                        ) {
                                            let updatePrevSim =
                                                'update sim_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where sim_id ="' +
                                                prevSimId +
                                                '"';
                                            await sql.query(updatePrevSim);
                                        } else {
                                            let updatePrevSim =
                                                'update sim_ids set expiry_date = "' + date_now + '" where sim_id ="' +
                                                prevSimId +
                                                '"';
                                            await sql.query(updatePrevSim);
                                        }

                                        let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id2 + "'"
                                        sql.query(getsimID, function (err, result) {
                                            if (result && result.length) {
                                                if (prevSimId2 === 'N/A') {
                                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id2' , '${start_date}')`
                                                    sql.query(insertAccService)
                                                } else {
                                                    sql.query(`UPDATE user_acc_services SET product_value = '${sim_id2}' WHERE service_id= ${service_id} AND product_value = '${prevSimId2}'`)
                                                }
                                            }
                                        })

                                    }
                                }
                            }

                            if (cancelService) {
                                let query = "UPDATE services_data SET status = 'request_for_cancel' WHERE user_acc_id = " + usr_acc_id + " AND  status = 'active'"
                                await sql.query(query);
                            }

                            let user_credits_q = "SELECT * FROM financial_account_balance WHERE dealer_id=" + dealer_id
                            let results = await sql.query(user_credits_q)

                            var slctquery =
                                "select devices.*  ," +
                                usr_acc_query_text +
                                ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id = '" +
                                usr_device_id +
                                "'";
                            // console.log(slctquery);
                            rsltq = await sql.query(slctquery);

                            // let pgp_emails = await device_helpers.getPgpEmails(rsltq[0].id);
                            // let sim_ids = await device_helpers.getSimids(rsltq[0].id);
                            // let chat_ids = await device_helpers.getChatids(rsltq[0].id);
                            let servicesData = await device_helpers.getServicesData(rsltq[0].id);
                            let servicesIds = servicesData.map(item => { return item.id })
                            let userAccServiceData = []
                            let dataPlans = []
                            if (servicesIds.length) {
                                userAccServiceData = await device_helpers.getUserAccServicesData(rsltq[0].id, servicesIds)
                                dataPlans = await device_helpers.getDataPlans(servicesIds)

                            }

                            if (rsltq.length) {
                                rsltq[0].sim_id = "N/A"
                                rsltq[0].sim_id2 = "N/A"
                                rsltq[0].pgp_email = "N/A"
                                rsltq[0].chat_id = "N/A"
                                rsltq[0].finalStatus = device_helpers.checkStatus(rsltq[0]);
                                // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                //     rsltq[0].pgp_email = pgp_emails[0].pgp_email
                                // } else {
                                //     rsltq[0].pgp_email = "N/A"
                                // }
                                // if (sim_ids && sim_ids.length) {
                                //     rsltq[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                //     rsltq[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                // }
                                // if (chat_ids[0] && chat_ids[0].chat_id) {
                                //     rsltq[0].chat_id = chat_ids[0].chat_id
                                // }
                                // else {
                                //     rsltq[0].chat_id = "N/A"
                                // }

                                let services = servicesData;
                                let service_id = null
                                if (services && services.length) {
                                    services.map((item) => {
                                        if (item.status === 'extended') {
                                            rsltq[0].extended_services = item
                                        } else {
                                            rsltq[0].services = item
                                            service_id = item.id
                                        }
                                    })
                                }

                                let productsData = userAccServiceData.filter(item => item.user_acc_id === rsltq[0].id && item.service_id === service_id);
                                if (productsData && productsData.length) {
                                    productsData.map((item) => {
                                        if (item.type === 'sim_id') {
                                            rsltq[0].sim_id = item.product_value
                                        }
                                        else if (item.type === 'sim_id2') {
                                            rsltq[0].sim_id2 = item.product_value
                                        }
                                        else if (item.type === 'pgp_email') {
                                            rsltq[0].pgp_email = item.product_value
                                        }
                                        else if (item.type === 'chat_id') {
                                            rsltq[0].chat_id = item.product_value
                                        }
                                    })
                                }
                                // if (servicesData[0]) {
                                //     rsltq[0].services = servicesData[0]
                                // }
                                let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                rsltq[0].sim_id_data_plan = sim_id_data_plan[0]
                                let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                rsltq[0].sim_id2_data_plan = sim_id2_data_plan[0]

                                if (rsltq[0].expiry_date !== null) {
                                    let startDate = moment(new Date())
                                    let expiry_date = new Date(rsltq[0].expiry_date)
                                    let endDate = moment(expiry_date)
                                    remainTermDays = endDate.diff(startDate, 'days')
                                    rsltq[0].remainTermDays = remainTermDays
                                }
                            }
                            var d = new Date(rsltq[0].expiry_date);
                            var n = d.valueOf();

                            socket_helpers.deviceInfoUpdated(sockets.baseIo,
                                device_id,
                                {
                                    device_id: rsltq[0].device_id,
                                    expiry_date: n,
                                    user_id: rsltq[0].user_id,
                                    sim_id: rsltq[0].sim_id,
                                    sim_id2: rsltq[0].sim_id2,
                                    pgp_email: rsltq[0].pgp_email,
                                    chat_id: rsltq[0].chat_id
                                }
                            );
                            data = {
                                status: true,
                                msg: cancelService ? "Request has been submitted to cancel your services." : await helpers.convertToLang(
                                    req.translation[
                                    MsgConstants.RECORD_UPD_SUCC
                                    ],
                                    "Record updated successfully"
                                ), // Record updated successfully.
                                data: rsltq,
                                credits: results[0] ? results[0].credits : 0,
                            };
                            res.send(data);
                            return;
                        });
                    } else {
                        return res.send({
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_NOT_FOUND],
                                "No Device found"
                            ) // No Device found
                        });
                    }
                });
            }
        } else {
            res.send({
                status: false,
                msg: ""
            });
        }
    }
};

exports.extendServices = async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        if (!empty(req.body.usr_device_id)) {

            let loggedDealerId = verify.user.id;
            let loggedDealerType = verify.user.user_type;
            let device_id = req.body.device_id;
            let dealer_id = req.body.dealer_id;
            let client_id = req.body.client_id;
            let usr_acc_id = req.body.usr_acc_id;
            let usr_device_id = req.body.usr_device_id;
            let prevPGP = req.body.prevPGP;
            let prevChatID = req.body.prevChatID;
            let prevSimId = req.body.prevSimId;
            let prevSimId2 = req.body.prevSimId2;
            let finalStatus = req.body.finalStatus;
            var note = req.body.note;
            let start_date = req.body.start_date;
            let sim_id = req.body.sim_id;
            let sim_id2 = req.body.sim_id2;
            let chat_id = req.body.chat_id;
            let pgp_email = req.body.pgp_email;

            let newService = req.body.service;
            let prevService = req.body.prevService
            let endUser_pay_status = req.body.paid_by_user ? req.body.paid_by_user : "PAID"
            let products = (req.body.products) ? req.body.products : []
            let packages = (req.body.packages) ? req.body.packages : []
            let admin_data = await sql.query("SELECT * from dealers WHERE type = 1")
            let total_price = req.body.total_price;
            let admin_profit = 0
            let dealer_profit = 0
            let dealer_credits = 0
            var expiry_date = req.body.expiry_date
            var date_now = moment(new Date()).format('YYYY/MM/DD')
            let creditsToRefund = 0
            let prevServicePackages = []
            let prevServiceProducts = []
            let serviceRemainingDays = 0
            let newServicePrice = 0
            let prevServiceTotalDays = 0
            let pay_now = req.body.pay_now
            let renewService = req.body.renewService
            let simIncluded = false
            let sim2Included = false
            let chatIncluded = false
            let pgpIncluded = false
            let vpnIncluded = false
            let user_id = req.body.user_id
            let exp_month = expiry_date
            let paid_credits = 0
            let dealer_credits_copy = 0
            let invoice_status = (pay_now) ? "PAID" : "UNPAID"
            var basic_data_plan = {
                sim_id:
                {
                    data_limit: 2000,
                    pkg_price: 0,
                    term: exp_month,
                    added_date: date_now
                },
                sim_id2:
                {
                    data_limit: 2000,
                    pkg_price: 0,
                    term: exp_month,
                    added_date: date_now

                }
            }
            // console.log(req.body.data_plans)
            var data_plans = req.body.data_plans ? req.body.data_plans : basic_data_plan

            let data_plan_price = 0

            // let pkg_term = null
            // console.log(expiry_date);
            // return
            var checkDevice =
                "SELECT start_date ,expiry_date , expiry_months , status from usr_acc WHERE device_id = '" +
                usr_device_id +
                "'";
            if (loggedDealerType === constants.SDEALER) {
                checkDevice =
                    checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === constants.DEALER) {
                checkDevice =
                    checkDevice +
                    " AND (dealer_id = " +
                    loggedDealerId +
                    " OR prnt_dlr_id = " +
                    loggedDealerId +
                    " )";
            } else if (loggedDealerType === constants.ADMIN) {
                checkDevice = checkDevice;
            } else {
                res.send({
                    status: false,
                    msg: ""
                });
                return;
            }
            sql.query(checkDevice, async function (error, rows) {
                if (rows.length) {
                    let status = rows[0].status
                    if (newService || renewService) {

                        let user_credits_q = "SELECT * FROM financial_account_balance WHERE dealer_id=" + dealer_id
                        let results = await sql.query(user_credits_q)
                        if (results && results.length || !pay_now) {
                            dealer_credits = results[0] ? results[0].credits : 0
                            dealer_credits_copy = dealer_credits
                            if (packages && packages.length) {
                                packages.map((item) => {
                                    // pkg_term = item.pkg_term.split(' ')[0]
                                    newServicePrice += Number(item.pkg_price)
                                    if (item.pkg_features.sim_id) {
                                        simIncluded = true
                                    }
                                    if (item.pkg_features.sim_id2) {
                                        sim2Included = true
                                    }

                                    if (item.pkg_features.chat_id) {
                                        chatIncluded = true
                                    }
                                    if (item.pkg_features.pgp_email) {
                                        pgpIncluded = true
                                    }
                                    if (item.pkg_features.vpn) {
                                        vpnIncluded = true
                                    }

                                })
                            }
                            if (products && products.length) {
                                products.map((item) => {
                                    newServicePrice += Number(item.unit_price)
                                    if (item.price_for === 'sim_id') {
                                        simIncluded = true
                                    }
                                    if (item.price_for === 'sim_id2') {
                                        sim2Included = true
                                    }
                                    if (item.price_for === 'chat_id') {
                                        chatIncluded = true
                                    }
                                    if (item.price_for === 'pgp_email') {
                                        pgpIncluded = true
                                    }
                                    if (item.price_for === 'vpn') {
                                        vpnIncluded = true
                                    }
                                })
                            }
                            if (pay_now) {
                                newServicePrice = newServicePrice - Math.ceil((newServicePrice * 0.03))
                            }

                            total_price = newServicePrice

                            if (dealer_credits < total_price && pay_now) {
                                res.send({
                                    status: false,
                                    msg: "Error: Dealer doesn't have enough credits to make this request. Please purchase credits and try again later."
                                });
                                return
                            } else {
                                if (pgp_email) {
                                    let checkUniquePgp =
                                        "SELECT * from pgp_emails WHERE pgp_email= '" +
                                        pgp_email +
                                        "' AND user_acc_id != '' AND user_acc_id != '" +
                                        usr_acc_id +
                                        "'";
                                    let success = await sql.query(checkUniquePgp)
                                    if (success.length) {
                                        res.send({
                                            status: false,
                                            msg: await helpers.convertToLang(
                                                req.translation[
                                                MsgConstants.PGP_EMAIL_ALRDY_TKN
                                                ],
                                                "PGP email already taken"
                                            ) // PGP email already taken
                                        });
                                        return
                                    }
                                }
                                let prevServiceRecord = ""
                                if (finalStatus !== constants.DEVICE_EXPIRED) {
                                    prevServiceRecord = await sql.query(`SELECT * FROM services_data WHERE user_acc_id = ${usr_acc_id} AND (status = 'active' OR status = 'request_for_cancel')`)
                                } else {
                                    prevServiceRecord = await sql.query(`SELECT * FROM services_data WHERE user_acc_id = ${usr_acc_id} AND status = 'completed'`)
                                }
                                if (prevServiceRecord && prevServiceRecord.length) {
                                    if (renewService) {
                                        let service_expiry_date = moment(prevServiceRecord[0].service_expiry_date)
                                        let service_start_date = moment(prevServiceRecord[0].start_date)
                                        let service_months = service_expiry_date.diff(service_start_date, 'months', true)
                                        if (finalStatus === constants.DEVICE_EXPIRED) {
                                            expiry_date = moment(date_now, "YYYY/MM/DD").add(service_months, "M").format('YYYY/MM/DD');
                                            status = 'active'
                                        } else {
                                            expiry_date = moment(prevServiceRecord[0].service_expiry_date, "YYYY/MM/DD").add(service_months, "M").format('YYYY/MM/DD');
                                        }

                                    } else {
                                        console.log(finalStatus);
                                        if (finalStatus === constants.DEVICE_EXPIRED) {
                                            expiry_date = moment(date_now, "YYYY/MM/DD").add(expiry_date, "M").format('YYYY/MM/DD');
                                            console.log("dadasd");
                                            status = 'active'
                                        } else {
                                            expiry_date = moment(rows[0].expiry_date, "YYYY/MM/DD").add(expiry_date, "M").format('YYYY/MM/DD');
                                        }
                                    }
                                    let profitLoss = await helpers.calculateProfitLoss(packages, products, loggedDealerType)
                                    if (pay_now) {
                                        admin_profit = profitLoss.admin_profit - Math.ceil((profitLoss.admin_profit * 0.03))
                                        dealer_profit = profitLoss.dealer_profit - Math.ceil((profitLoss.dealer_profit * 0.03))
                                    } else {
                                        admin_profit = profitLoss.admin_profit
                                        dealer_profit = profitLoss.dealer_profit
                                    }
                                } else {
                                    res.send({
                                        status: false,
                                        msg: "Error: Current Service not found to Extend/Renew Service."
                                    });
                                    return
                                }
                            }
                        } else {
                            res.send({
                                status: false,
                                msg: "Error: Dealer doesn't have credits to make this request. Please purchase credits and try again later."
                            });
                            return
                        }
                    }
                    common_Query =
                        "UPDATE devices set model = '" +
                        req.body.model +
                        "' WHERE id = '" +
                        usr_device_id +
                        "'";
                    if (
                        finalStatus !== constants.DEVICE_PRE_ACTIVATION
                    ) {
                        usr_acc_Query =
                            "UPDATE usr_acc set note = '" +
                            note +
                            "' ,client_id = '" +
                            client_id +
                            "', device_status = 1, unlink_status=0 ,  start_date = '" +
                            start_date +
                            "' ,expiry_date = '" +
                            expiry_date +
                            "' ,status = '" +
                            status +
                            "' WHERE device_id = '" +
                            usr_device_id +
                            "'";
                    }
                    sql.query(common_Query, async function (error, row) {
                        await sql.query(usr_acc_Query);

                        if (data_plans.sim_id) {
                            let discount = 0
                            if (pay_now) {
                                discount = Math.ceil(Number((Number(data_plans.sim_id.pkg_price) * 0.03)))
                            }
                            data_plan_price += (Number(data_plans.sim_id.pkg_price) - discount)
                        }
                        if (data_plans.sim_id2) {
                            let discount = 0
                            if (pay_now) {
                                discount = Math.ceil(Number((Number(data_plans.sim_id2.pkg_price) * 0.03)))
                            }
                            data_plan_price += (Number(data_plans.sim_id2.pkg_price) - discount)
                        }
                        let insert_service_query = `INSERT INTO services_data (user_acc_id , dealer_id , products, packages, total_credits, start_date, service_expiry_date , status , service_term) VALUES (${usr_acc_id},${dealer_id}, '${JSON.stringify(products)}','${JSON.stringify(packages)}',${newServicePrice - data_plan_price} ,'${rows[0].expiry_date}' ,'${expiry_date}' , 'extended' , '${exp_month}')`
                        if (finalStatus === constants.DEVICE_EXPIRED) {
                            insert_service_query = `INSERT INTO services_data (user_acc_id , dealer_id , products, packages, total_credits, start_date, service_expiry_date , status , service_term) VALUES (${usr_acc_id},${dealer_id}, '${JSON.stringify(products)}','${JSON.stringify(packages)}',${newServicePrice - data_plan_price} ,'${date_now}' ,'${expiry_date}' , 'active' , '${exp_month}')`
                        }
                        let service_data_result = await sql.query(insert_service_query);
                        let service_id = null
                        if (service_data_result.affectedRows) {
                            service_id = service_data_result.insertId
                            helpers.saveServiceSalesDetails(JSON.parse(JSON.stringify(packages)), products, loggedDealerType, usr_acc_id, service_data_result.insertId, pay_now)
                        }

                        if (renewService) {
                            // console.log("Hello Hello", total_price);
                            let user_acc_prevServices = await sql.query(`SELECT * FROM user_acc_services WHERE service_id = ${prevService.id} AND user_acc_id = ${usr_acc_id}`)
                            if (user_acc_prevServices.length) {
                                for (let i = 0; i < user_acc_prevServices.length; i++) {
                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date , status) VALUES(${usr_acc_id} , ${service_id} , ${user_acc_prevServices[i].product_id} ,'${user_acc_prevServices[i].product_value}' ,  '${user_acc_prevServices[i].type}' , '${date_now}' , 'extended')`
                                    sql.query(insertAccService)
                                }
                            }
                        }
                        else if (newService) {
                            if (pgpIncluded) {
                                if (pgp_email != prevPGP) {
                                    console.log("PGP change");
                                    let updatePgpEmails =
                                        'update pgp_emails set user_acc_id = "' +
                                        usr_acc_id +
                                        '",  used=1 where pgp_email ="' +
                                        pgp_email +
                                        '"';
                                    await sql.query(updatePgpEmails);
                                }
                                let pgpData = await sql.query(`SELECT * FROM pgp_emails WHERE pgp_email = '${pgp_email}'`)
                                if (pgpData && pgpData.length) {
                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date , status) VALUES(${usr_acc_id} , ${service_id} , ${pgpData[0].id} , '${pgpData[0].pgp_email}' , 'pgp_email' , '${date_now}' , 'extended')`
                                    sql.query(insertAccService)
                                }
                            }
                            if (chatIncluded) {
                                if (chat_id != prevChatID) {
                                    console.log("Chat change");
                                    let updateChatIds =
                                        'update chat_ids set user_acc_id = "' +
                                        usr_acc_id +
                                        '", used=1 where chat_id ="' +
                                        chat_id +
                                        '"';
                                    await sql.query(updateChatIds);
                                }
                                let chatData = await sql.query(`SELECT * FROM chat_ids WHERE chat_id = '${chat_id}'`)
                                if (chatData && chatData.length) {
                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id,product_value, type , start_date , status) VALUES(${usr_acc_id} , ${service_id} , ${chatData[0].id} , '${chatData[0].chat_id}' , 'chat_id' , '${date_now}' , 'extended')`
                                    sql.query(insertAccService)
                                }
                            }
                            if (simIncluded) {
                                if (sim_id != prevSimId) {
                                    console.log("sim change");
                                    let updateSimIds =
                                        'update sim_ids set user_acc_id = "' +
                                        usr_acc_id +
                                        '",  used=1 where sim_id ="' +
                                        sim_id +
                                        '"';
                                    await sql.query(updateSimIds);
                                }
                                let simData = await sql.query(`SELECT * FROM sim_ids WHERE sim_id = '${sim_id}'`)
                                if (simData && simData.length) {
                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id,product_value, type , start_date , status) VALUES(${usr_acc_id} , ${service_id} , ${simData[0].id} , '${simData[0].sim_id}' ,'sim_id' , '${date_now}' , 'extended')`
                                    sql.query(insertAccService)
                                }

                                let data_plan_package = [basic_data_plan.sim_id]
                                let data_plan_price = 0
                                let data_limit = basic_data_plan.sim_id.data_limit
                                if (data_plans.sim_id) {
                                    data_plans.sim_id.added_date = date_now
                                    data_plan_package.push(data_plans.sim_id)
                                    data_plan_price = data_plan_price + Number(data_plans.sim_id.pkg_price)
                                    data_limit = data_limit + Number(data_plans.sim_id.data_limit)

                                }
                                let data_package_plan = `INSERT INTO sim_data_plans ( service_id , data_plan_package , total_price , total_data , sim_type , start_date) VALUES( ${service_id} , '${JSON.stringify(data_plan_package)}' , '${data_plan_price}' , '${data_limit}' , 'sim_id' , '${date_now}')`
                                sql.query(data_package_plan)
                            }
                            if (sim2Included) {
                                if (sim_id2 != prevSimId2) {
                                    console.log("sim change");
                                    let updateSimIds =
                                        'update sim_ids set user_acc_id = "' +
                                        usr_acc_id +
                                        '",  used=1 where sim_id ="' +
                                        sim_id2 +
                                        '"';
                                    await sql.query(updateSimIds);
                                }
                                let simData = await sql.query(`SELECT * FROM sim_ids WHERE sim_id = '${sim_id2}'`)
                                if (simData && simData.length) {
                                    let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value,type , start_date , status) VALUES(${usr_acc_id} , ${service_id} , ${simData[0].id} , '${simData[0].sim_id}' , 'sim_id2' , '${date_now}' , 'extended')`
                                    sql.query(insertAccService)
                                }
                                let data_plan_package2 = [basic_data_plan.sim_id2]
                                let data_plan_price = 0
                                let data_limit = basic_data_plan.sim_id2.data_limit
                                if (data_plans.sim_id2) {
                                    data_plans.sim_id2.added_date = date_now
                                    data_plan_package2.push(data_plans.sim_id2)
                                    data_plan_price = data_plan_price + Number(data_plans.sim_id2.pkg_price)
                                    data_limit = data_limit + Number(data_plans.sim_id2.data_limit)
                                }
                                let data_package_plan2 = `INSERT INTO sim_data_plans ( service_id , data_plan_package ,  total_price, total_data , sim_type , start_date) VALUES( ${service_id} , '${JSON.stringify(data_plan_package2)}' , '${data_plan_price}' , '${data_limit}' , 'sim_id2' , '${date_now}')`
                                sql.query(data_package_plan2)
                            }
                        }

                        let transection_status = 'transferred'

                        if (!pay_now) {
                            transection_status = 'pending'
                        }

                        if (pay_now) {

                            let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${newServicePrice} ,'credit' , 'transferred' , 'services' , ${newServicePrice} , ${0})`
                            await sql.query(transection_credits)
                        }
                        else {
                            let transection_due_credits = newServicePrice;
                            if (dealer_credits_copy > 0) {
                                transection_due_credits = newServicePrice - dealer_credits_copy
                                paid_credits = dealer_credits_copy
                                let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${newServicePrice} ,'credit' , 'pending' , 'services' , ${paid_credits} , ${transection_due_credits})`
                                await sql.query(transection_credits)
                                invoice_status = "PARTIALLY PAID"
                            } else {
                                let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${newServicePrice} ,'credit' , 'pending' , 'services' , 0 ,${newServicePrice})`
                                await sql.query(transection_credits)
                            }
                        }

                        let update_credits_query = 'update financial_account_balance set credits = credits - ' + newServicePrice + ' where dealer_id ="' + dealer_id + '"';
                        await sql.query(update_credits_query);

                        await helpers.updateProfitLoss(admin_profit, dealer_profit, admin_data, verify.user.connected_dealer, usr_acc_id, loggedDealerType, pay_now, service_id)


                        let inv_no = await helpers.getInvoiceId()
                        const invoice = {
                            shipping: {
                                name: verify.user.dealer_name,
                                device_id: device_id,
                                dealer_pin: verify.user.link_code,
                                user_id: user_id
                            },
                            products: products,
                            packages: packages,
                            hardwares: [],
                            pay_now: pay_now,
                            discount: (pay_now) ? Math.ceil(newServicePrice * 0.03) : 0,
                            discountPercent: "3%",
                            quantity: 1,
                            subtotal: (pay_now) ? newServicePrice + Math.ceil(newServicePrice * 0.03) : newServicePrice,
                            paid: total_price,
                            invoice_nr: inv_no,
                            paid_credits: paid_credits,
                            invoice_status: invoice_status,
                            expiry_date: expiry_date
                        };

                        let fileName = "invoice-" + inv_no + ".pdf"
                        let filePath = path.join(__dirname, "../../uploads/" + fileName)
                        await createInvoice(invoice, filePath, 'extend')

                        let attachment = {
                            fileName: fileName,
                            file: filePath
                        }

                        sql.query(`INSERT INTO invoices (inv_no,user_acc_id,dealer_id,file_name ,end_user_payment_status) VALUES('${inv_no}',${usr_acc_id},${dealer_id}, '${fileName}' , '${endUser_pay_status}')`)

                        html = 'You have extended the services on device. Device ID ' + device_id + '.<br>Your Invoice is attached below. <br>';

                        sendEmail("DEVICE SERVICE HAS BEEN EXTENDED.", html, verify.user.dealer_email, null, attachment);

                        let user_credits_q = "SELECT * FROM financial_account_balance WHERE dealer_id=" + dealer_id
                        let results = await sql.query(user_credits_q)

                        var slctquery =
                            "select devices.*  ," +
                            usr_acc_query_text +
                            ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id = '" +
                            usr_device_id +
                            "'";
                        // console.log(slctquery);
                        rsltq = await sql.query(slctquery);

                        // let pgp_emails = await device_helpers.getPgpEmails(rsltq[0].id);
                        // let sim_ids = await device_helpers.getSimids(rsltq[0].id);
                        // let chat_ids = await device_helpers.getChatids(rsltq[0].id);
                        let servicesData = await device_helpers.getServicesData(rsltq[0].id);
                        let servicesIds = servicesData.map(item => { return item.id })
                        let userAccServiceData = []
                        let dataPlans = []
                        if (servicesIds.length) {
                            userAccServiceData = await device_helpers.getUserAccServicesData(rsltq[0].id, servicesIds)
                            dataPlans = await device_helpers.getDataPlans(servicesIds)
                        }
                        if (rsltq.length) {
                            rsltq[0].sim_id = "N/A"
                            rsltq[0].sim_id2 = "N/A"
                            rsltq[0].pgp_email = "N/A"
                            rsltq[0].chat_id = "N/A"
                            rsltq[0].finalStatus = device_helpers.checkStatus(rsltq[0]);
                            // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                            //     rsltq[0].pgp_email = pgp_emails[0].pgp_email
                            // } else {
                            //     rsltq[0].pgp_email = "N/A"
                            // }
                            // if (sim_ids && sim_ids.length) {
                            //     rsltq[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                            //     rsltq[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                            // }
                            // if (chat_ids[0] && chat_ids[0].chat_id) {
                            //     rsltq[0].chat_id = chat_ids[0].chat_id
                            // }
                            // else {
                            //     rsltq[0].chat_id = "N/A"
                            // }

                            let services = servicesData;
                            let service_id = null
                            if (services && services.length) {
                                services.map((item) => {
                                    if (item.status === 'extended') {
                                        rsltq[0].extended_services = item
                                    } else {
                                        rsltq[0].services = item
                                        service_id = item.id
                                    }
                                })
                            }

                            let productsData = userAccServiceData.filter(item => item.user_acc_id === rsltq[0].id && item.service_id === service_id);
                            if (productsData && productsData.length) {
                                productsData.map((item) => {
                                    if (item.type === 'sim_id') {
                                        rsltq[0].sim_id = item.product_value
                                    }
                                    else if (item.type === 'sim_id2') {
                                        rsltq[0].sim_id2 = item.product_value
                                    }
                                    else if (item.type === 'pgp_email') {
                                        rsltq[0].pgp_email = item.product_value
                                    }
                                    else if (item.type === 'chat_id') {
                                        rsltq[0].chat_id = item.product_value
                                    }
                                })
                            }

                            let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                            rsltq[0].sim_id_data_plan = sim_id_data_plan[0]
                            let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                            rsltq[0].sim_id2_data_plan = sim_id2_data_plan[0]

                            if (rsltq[0].expiry_date !== null) {
                                let startDate = moment(new Date())
                                let expiray_date = new Date(rsltq[0].expiry_date)
                                let endDate = moment(expiray_date)
                                remainTermDays = endDate.diff(startDate, 'days')
                                rsltq[0].remainTermDays = remainTermDays
                            }
                        }
                        data = {
                            status: true,
                            msg: renewService ? "Your services has been renewed successfully." : await helpers.convertToLang(
                                req.translation[
                                MsgConstants.RECORD_UPD_SUCC
                                ],
                                "Record updated successfully"
                            ), // Record updated successfully.
                            data: rsltq,
                            credits: results[0] ? results[0].credits : 0,
                        };
                        res.send(data);
                        return;
                    });

                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(
                            req.translation[MsgConstants.DEVICE_NOT_FOUND],
                            "No Device found"
                        ) // No Device found
                    });
                }
            })
        } else {
            res.send({
                status: false,
                msg: ""
            });
        }
    }
};

exports.cancelExtendedServices = async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        if (!empty(req.body.service_id)) {
            let service_id = req.body.service_id
            let user_acc_id = req.body.user_acc_id
            // console.log(req.body);
            let extendedServicesData = `SELECT * FROM services_data WHERE id = ${service_id} AND status = 'extended' AND user_acc_id = ${user_acc_id}`

            sql.query(extendedServicesData, async function (err, result) {
                if (err) {
                    console.log(err);
                    res.send({
                        status: false,
                        msg: "Internal Server Error"
                    });
                    return
                }
                if (result && result.length) {

                    let getDeviceInfo = `SELECT * FROM usr_acc WHERE id= ${user_acc_id}`
                    let deviceData = await sql.query(getDeviceInfo)
                    if (deviceData.length) {
                        let admin_data = await sql.query("SELECT * from dealers WHERE type = 1")
                        let service = result[0]
                        let dealer_id = service.dealer_id
                        let dealer_type = await helpers.getUserType(dealer_id)
                        let servicePackages = JSON.parse(service.packages)
                        let serviceProducts = JSON.parse(service.products)
                        let totalPrice = service.total_credits
                        let date_now = moment(new Date()).format("YYYY/MM/DD")
                        let profitLoss = await helpers.calculateProfitLoss(servicePackages, serviceProducts, dealer_type)
                        let service_admin_profit = profitLoss.admin_profit
                        let service_dealer_profit = profitLoss.dealer_profit


                        let updateDeviceExpiry = `UPDATE usr_acc SET expiry_date = '${service.start_date}' WHERE id = ${user_acc_id}`
                        sql.query(updateDeviceExpiry)
                        let update_service_data = `UPDATE services_data set status = 'deleted', paid_credits = 0, end_date = '${date_now}' WHERE id = ${service.id} `
                        sql.query(update_service_data)
                        let updateSaleDetails = `UPDATE services_sale SET paid_sale_price =0, paid_admin_cost = 0 , paid_dealer_cost = 0 , status = 'returned' , end_date = '${date_now}' WHERE user_acc_id = ${user_acc_id} AND service_data_id = ${service.id}`
                        sql.query(updateSaleDetails)

                        let updateDataPlans = `UPDATE sim_data_plans SET status ='deleted' WHERE service_id = ${service.id}`
                        sql.query(updateDataPlans)


                        let transection_record = `SELECT * from financial_account_transections where transection_data LIKE '%service_id":${service.id}%' AND  user_dvc_acc_id = ${user_acc_id} AND user_id = '${verify.user.id}' AND type = 'services' ORDER BY id DESC LIMIT 1`
                        let transection_record_data = await sql.query(transection_record)
                        if (transection_record_data.length) {
                            if (transection_record_data[0] && transection_record_data[0].status === 'pending') {


                                let update_transection = "UPDATE financial_account_transections SET status = 'cancelled' WHERE id = " + transection_record_data[0].id
                                await sql.query(update_transection)

                                update_credits_query = 'update financial_account_balance set credits = credits + ' + transection_record_data[0].credits + ' where dealer_id ="' + dealer_id + '"';
                                await sql.query(update_credits_query);

                                let update_profits_transections = `UPDATE financial_account_transections SET status = 'cancelled' WHERE transection_data LIKE '%transection_type":"profit","service_id": ${service.id}%' AND user_dvc_acc_id = ${user_acc_id} AND status = 'holding' AND type = 'services'`
                                await sql.query(update_profits_transections)

                            } else {

                                let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, details: "REFUND SERVICES CREITS", service_id: service.id })}' ,${totalPrice} ,'debit' , 'transferred' , 'services')`
                                await sql.query(transection_credits)

                                update_credits_query = 'update financial_account_balance set credits = credits + ' + transection_record_data[0].credits + ' where dealer_id ="' + dealer_id + '"';
                                await sql.query(update_credits_query);

                                // let update_profits_transections = `SELECT * financial_account_transections SET status = 'cancelled' WHERE transection_data LIKE '%transection_type":"profit","service_id": ${service.id}% ' user_dvc_acc_id = ${user_acc_id} AND status = 'transferred' AND type = 'services'`
                                // await sql.query(update_profits_transections)

                                service_admin_profit = service_admin_profit - Math.ceil(service_admin_profit * 0.03)
                                service_dealer_profit = service_dealer_profit - Math.ceil(service_dealer_profit * 0.03)

                                if (service_admin_profit) {
                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${admin_data[0].dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, details: "REFUND SERVICES PROFIT CREITS", service_id: service.id })}' ,${service_admin_profit} ,'credit' , 'transferred' , 'services')`
                                    await sql.query(transection_credits)

                                    updateAdminProfit = 'update financial_account_balance set credits = credits - ' + service_admin_profit + ' where dealer_id ="' + admin_data[0].dealer_id + '"';
                                    await sql.query(updateAdminProfit);
                                }

                                if (service_dealer_profit) {
                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${deviceData[0].prnt_dlr_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, details: "REFUND SERVICES PROFIT CREITS", service_id: service.id })}' ,${service_dealer_profit} ,'credit' , 'transferred' , 'services')`
                                    await sql.query(transection_credits)

                                    updateAdminProfit = 'update financial_account_balance set credits = credits - ' + service_dealer_profit + ' where dealer_id ="' + deviceData[0].prnt_dlr_id + '"';
                                    await sql.query(updateAdminProfit);
                                }
                            }
                        }

                        let dealer_balance = null

                        if (dealer_type === verify.user.user_type) {
                            dealer_balance = await sql.query(`SELECT * FROM financial_account_balance WHERE dealer_id = ${verify.user.id}`)
                        }

                        sql.query(
                            "select devices.*  ," +
                            usr_acc_query_text +
                            ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id where usr_acc.id = " + user_acc_id,
                            async function (error, results) {
                                if (error) {
                                    console.log(error);
                                }
                                // console.log('rslt done', results);
                                if (results.length == 0) {
                                    _data = {
                                        status: false,
                                        msg: await helpers.convertToLang(
                                            req.translation[MsgConstants.NO_DETAIL_FOUND],
                                            "No details found"
                                        ) // No details found
                                    };
                                } else {
                                    var query =
                                        "select * from dealers where dealer_id =" +
                                        results[0].dealer_id;
                                    let dealer_details = await sql.query(query);

                                    // let pgp_emails = await device_helpers.getPgpEmails(results[0].id);
                                    // let sim_ids = await device_helpers.getSimids(results[0].id);
                                    // let chat_ids = await device_helpers.getChatids(results[0].id);
                                    results[0].finalStatus = device_helpers.checkStatus(results[0]);
                                    let servicesData = await device_helpers.getServicesData(results[0].id);
                                    let servicesIds = servicesData.map(item => { return item.id })
                                    let userAccServiceData = []
                                    let dataPlans = []
                                    if (servicesIds.length) {
                                        userAccServiceData = await device_helpers.getUserAccServicesData(results[0].id, servicesIds)
                                        dataPlans = await device_helpers.getDataPlans(servicesIds)
                                    }
                                    results[0].sim_id = "N/A"
                                    results[0].sim_id2 = "N/A"
                                    results[0].pgp_email = "N/A"
                                    results[0].chat_id = "N/A"
                                    // let loginHistoryData = await device_helpers.getLastLoginDetail(results[0].usr_device_id)
                                    // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                    //     results[0].pgp_email = pgp_emails[0].pgp_email
                                    // } else {
                                    //     results[0].pgp_email = "N/A"
                                    // }
                                    // if (sim_ids && sim_ids.length) {
                                    //     results[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                    //     results[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                    // }
                                    // if (chat_ids[0] && chat_ids[0].chat_id) {
                                    //     results[0].chat_id = chat_ids[0].chat_id
                                    // }
                                    // else {
                                    //     results[0].chat_id = "N/A"
                                    // }
                                    let services = servicesData;
                                    let service_id = null
                                    if (services && services.length) {
                                        services.map((item) => {
                                            if (item.status === 'extended') {
                                                results[0].extended_services = item
                                            } else {
                                                results[0].services = item
                                                service_id = item.id
                                            }
                                        })
                                    }

                                    let productsData = userAccServiceData.filter(item => item.user_acc_id === results[0].id && item.service_id === service_id);
                                    if (productsData && productsData.length) {
                                        productsData.map((item) => {
                                            if (item.type === 'sim_id') {
                                                results[0].sim_id = item.product_value
                                            }
                                            else if (item.type === 'sim_id2') {
                                                results[0].sim_id2 = item.product_value
                                            }
                                            else if (item.type === 'pgp_email') {
                                                results[0].pgp_email = item.product_value
                                            }
                                            else if (item.type === 'chat_id') {
                                                results[0].chat_id = item.product_value
                                            }
                                        })
                                    }

                                    let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                    results[0].sim_id_data_plan = sim_id_data_plan[0]
                                    let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                    results[0].sim_id2_data_plan = sim_id2_data_plan[0]
                                    results[0].lastOnline = results[0].last_login ? results[0].last_login : "N/A"
                                    let device_data = results[0]
                                    let startDate = moment(new Date())
                                    let expiray_date = new Date(device_data.expiry_date)
                                    let endDate = moment(expiray_date)
                                    let remainTermDays = endDate.diff(startDate, 'days')
                                    device_data.remainTermDays = remainTermDays

                                    if (dealer_details.length) {
                                        device_data.link_code = dealer_details[0].link_code;
                                        device_data.dealer_name =
                                            dealer_details[0].dealer_name;
                                    } else {
                                        device_data.link_code = 0;
                                        device_data.dealer_name = "";
                                    }
                                    res.send({
                                        status: true,
                                        msg: "Extended Services Cancelled Successfully.",
                                        credits: (dealer_balance) ? dealer_balance[0].credits : null,
                                        data: device_data
                                    });
                                    return

                                }
                            })
                    }
                    else {
                        res.send({
                            status: false,
                            msg: "Device Not found."
                        });
                        return
                    }
                } else {
                    res.send({
                        status: false,
                        msg: "Extended Service not found."
                    });
                    return
                }
            })
        } else {
            res.send({
                status: false,
                msg: "Extended Service not found."
            });
            return
        }
    }
};

exports.getServiceRefund = async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let service_id = req.body.service_id
        console.log(service_id);
        if (service_id) {
            sql.query("SELECT * from services_data WHERE id = " + service_id, async function (err, result) {
                if (err) {
                    res.send({
                        status: false,
                        msg: "Service Not Found."
                    })
                    return
                }
                if (result.length) {
                    let prevService = result[0]
                    let transection_record = `SELECT * from financial_account_transections where transection_data LIKE '%service_id":${service_id}%' AND  user_dvc_acc_id = ${prevService.user_acc_id} AND user_id = '${verify.user.id}' AND type = 'services' ORDER BY id DESC LIMIT 1`
                    let transection_record_data = await sql.query(transection_record)
                    if (transection_record_data.length) {
                        let preTotalPrice = prevService.total_credits
                        let prevServiceExpiryDate = moment(new Date(prevService.service_expiry_date))
                        let prevServiceStartDate = moment(new Date(prevService.start_date))
                        let dateNow = moment(new Date())
                        let serviceRemainingDays = prevServiceExpiryDate.diff(dateNow, 'days') + 1

                        let totalDays = prevServiceExpiryDate.diff(prevServiceStartDate, 'days')
                        let creditsToRefund = Math.floor((preTotalPrice / totalDays) * serviceRemainingDays)
                        console.log(creditsToRefund);
                        res.send({
                            status: true,
                            creditsToRefund: creditsToRefund,
                            serviceRemainingDays: serviceRemainingDays,
                            totalDays: totalDays
                        })
                        return
                    } else {
                        res.send({
                            status: false,
                            msg: ""
                        });
                    }
                } else {
                    res.send({
                        status: false,
                        msg: ""
                    });
                }
            })
        } else {
            res.send({
                status: false,
                msg: ""
            });
        }
    }
};

exports.deleteDevice = async function (req, res) {
    // console.log(req.body);
    var verify = req.decoded; // await verifyToken(req, res);

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        if (!empty(req.params.device_id)) {
            let userType = verify.user.user_type;
            let loggedUserId = verify.user.id;
            let where = "";
            if (userType === constants.DEALER) {
                where =
                    " AND (dealer_id=" +
                    loggedUserId +
                    " OR prnt_dlr_id = " +
                    loggedUserId +
                    ")";
            } else if (userType === constants.SDEALER) {
                where = " AND (dealer_id=" + loggedUserId;
            }
            // console.log("delete where ", 'DELETE FROM devices WHERE device_id ="' + [req.params.device_id])
            let usr_device_id = await device_helpers.getOriginalIdByDeviceId(
                req.params.device_id
            );
            sql.query(`SELECT * FROM usr_acc WHERE device_id = ${usr_device_id} AND del_status = 0`, async function (err, device) {
                if (err) {
                    console.log(err);
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(
                            req.translation[""],
                            "ERROR: Internal Server Error."
                        )
                    };
                    return res.send(data);
                }
                if (device && device.length) {
                    if (
                        device[0].dealer_id === loggedUserId ||
                        device[0].prnt_dlr_id === loggedUserId ||
                        userType === constants.ADMIN
                    ) {
                        // console.log(usr_device_id);
                        sql.query(
                            "DELETE from usr_acc  where device_id = " + usr_device_id,
                            async function (error, results, fields) {

                                if (error) {
                                    console.log(error);
                                    data = {
                                        status: false,
                                        msg: await helpers.convertToLang(
                                            req.translation[""],
                                            "ERROR: Internal Server Error."
                                        )
                                    };
                                    return res.send(data);
                                }
                                if (results.affectedRows !== 0) {
                                    var sqlDevice =
                                        "DELETE from devices where device_id = '" +
                                        req.params.device_id +
                                        "' ";
                                    sql.query(sqlDevice);
                                    data = {
                                        status: true,
                                        msg: await helpers.convertToLang(
                                            req.translation[
                                            MsgConstants.DEVICE_DEL_SUCC
                                            ],
                                            "Device deleted successfully"
                                        ) // Device deleted successfully.
                                    };
                                } else {
                                    data = {
                                        status: false,
                                        msg: await helpers.convertToLang(
                                            req.translation[
                                            MsgConstants.DEVICE_NOT_DEL
                                            ],
                                            "Device not deleted"
                                        ), // Device not deleted.
                                        fld: fields,
                                        rdlt: results
                                    };
                                }
                                res.send(data);
                            }
                        );
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_NOT_DEL],
                                "Device not deleted"
                            )
                        };
                        res.send(data);
                    }
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(
                            req.translation[""],
                            "ERROR: Device Not found."
                        )
                    };
                    return res.send(data);
                }
            })
        }
    }
};

exports.unlinkDevice = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var device_id = req.params.id;

    console.log("unlinkDevice device_id ", device_id)

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var sql2 =
            "select * from usr_acc where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);
        if (!empty(device_id) && gtres.length) {
            console.log("device id:", device_id);
            if (verify.user.user_type === constants.ADMIN || verify.user.id === gtres[0].dealer_id || verify.user.id === gtres[0].prnt_dlr_id) {
                let dvcId = await device_helpers.getDvcIDByDeviceID(device_id);
                console.log("dvc id:", dvcId);

                var sql1 = `UPDATE  usr_acc SET unlink_status = 1, device_status = 0 where device_id=${device_id}`;
                sql.query(sql1, async function (error, results) {
                    if (error) {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_NOT_UNLNK],
                                "Device not unlinked"
                            )
                        };
                    }

                    if (results && results.affectedRows) {
                        // Update device details on Super admin


                        // var sqlDevice =
                        //     "DELETE from devices where id = '" + device_id + "'";
                        // await sql.query(sqlDevice);

                        var userAccId = await device_helpers.getUsrAccIDbyDvcId(
                            device_id
                        );

                        // await sql.query(
                        //     "update pgp_emails set user_acc_id = null WHERE user_acc_id = '" +
                        //     userAccId +
                        //     "'"
                        // );
                        // await sql.query(
                        //     "update chat_ids set user_acc_id = null WHERE user_acc_id = '" +
                        //     userAccId +
                        //     "'"
                        // );

                        // await sql.query(
                        //     "update sim_ids set user_acc_id = null WHERE user_acc_id = '" +
                        //     userAccId +
                        //     "'"
                        // );

                        // // Delete unlinked & Transferred device 
                        let unlinkDeviceQ = `SELECT * FROM usr_acc WHERE id=${userAccId} AND device_id='${device_id}'`;
                        let getUnlinDeviceResult = await sql.query(unlinkDeviceQ);
                        // console.log("getUnlinDeviceResult ", getUnlinDeviceResult);
                        if (getUnlinDeviceResult[0].transfer_status) {
                            let deleteUserQ = `DELETE FROM usr_acc WHERE id=${userAccId}`;
                            // console.log("deleteUserQ ", deleteUserQ);
                            let response = await sql.query(deleteUserQ);
                            // console.log("response ", response)
                            if (response.affectedRows > 0) {
                                let deleteDevice = `DELETE FROM devices WHERE id=${device_id}`;
                                // console.log("deleteDevice ", deleteDevice)
                                sql.query(deleteDevice);
                            }
                        }

                        console.log("unlink devices data: req.body.device: ", req.body.device)
                        device_helpers.saveActionHistory(
                            req.body.device,
                            constants.DEVICE_UNLINKED,
                            verify.user
                        );
                        socket_helpers.sendDeviceStatus(sockets.baseIo, dvcId, "unlinked", true);

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
                                            device_id: dvcId
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

                        data = {
                            status: true,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_UNLNK_SUCC],
                                "Device unlinked successfully"
                            ) // Device unlinked successfully.
                        };
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_NOT_UNLNK],
                                "Device not unlinked"
                            ) // Device not unlinked.
                        };
                    }
                    res.send(data);
                    return;
                });
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(
                        req.translation[""],
                        "Unauthorized Access"
                    )
                };
                return res.send(data);
            }

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.INVALID_DEVICE_ID],
                    "Invalid device id"
                ) // Invalid device id.
            };
            res.send(data);
            return;
        }
    }
};


exports.relinkDevice = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var user_acc_id = req.params.id;

    console.log("RelinkDevice id ", user_acc_id)

    if (verify) {
        var sql2 =
            "SELECT * FROM usr_acc WHERE id = '" + user_acc_id + "' AND del_status = 0";
        var gtres = await sql.query(sql2);
        if (!empty(user_acc_id) && gtres.length) {
            // console.log("device id:", device_id);

            if (verify.user.user_type === constants.ADMIN || verify.user.id === gtres[0].dealer_id || verify.user.id === gtres[0].prnt_dlr_id) {
                let dvcId = await device_helpers.getDvcIDByDeviceID(gtres[0].device_id);

                var sql1 = `UPDATE usr_acc SET unlink_status = 0, device_status = 1 , relink_status = 0 where id=${user_acc_id}`;
                sql.query(sql1, async function (error, results) {
                    if (error) {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_NOT_UNLNK],
                                "Device not unlinked"
                            )
                        };
                    }

                    if (results && results.affectedRows) {

                        // socket_helpers.sendDeviceStatus(sockets.baseIo, dvcId, "unlinked", true);
                        let record = await helpers.getAllRecordbyUserAccId(user_acc_id);
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(
                                req.translation[""],
                                "Device Relinked successfully"
                            ), // Device unlinked successfully.,
                            data: record
                        };
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_NOT_UNLNK],
                                "Device not relinked"
                            ) // Device not unlinked.
                        };
                    }
                    res.send(data);
                    return;
                });
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(
                        req.translation[""],
                        "Unauthorized Access"
                    )
                };
                return res.send(data);
            }

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[""],
                    "Invalid device"
                ) // Invalid device id.
            };
            res.send(data);
            return;
        }
    }
};



// ******************************************* Transfer Module

exports.unflagDevice = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var device_id = req.params.id;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var sql2 =
            "select * from usr_acc where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        if (!empty(device_id) && gtres.length) {
            if (verify.user.user_type === constants.ADMIN || verify.user.id === gtres[0].dealer_id || verify.user.id === gtres[0].prnt_dlr_id) {
                var sql1 = "update devices set flagged= 'Not flagged' where id='" + device_id + "'";
                var rest = sql.query(sql1, async function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    else if (results.affectedRows == 0) {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_UNFLAG], "Device not Unflagged.Please try again"), // Device not Unflagged.Please try again.
                        }
                        res.send(data);
                    } else {
                        await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.reject_status = 0 AND usr_acc.device_id= "' + device_id + '"', async function (error, resquery, fields) {
                            if (error) {
                                console.log(error);
                            }
                            // console.log('resquery ==> ', resquery[0])

                            if (resquery.length) {
                                resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                                let servicesData = await device_helpers.getServicesData(resquery[0].id);
                                let servicesIds = servicesData.map(item => { return item.id })
                                let dataPlans = []
                                let userAccServiceData = []
                                if (servicesIds.length) {
                                    userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                                    dataPlans = await device_helpers.getDataPlans(servicesIds)
                                }
                                resquery[0].sim_id = "N/A"
                                resquery[0].sim_id2 = "N/A"
                                resquery[0].pgp_email = "N/A"
                                resquery[0].chat_id = "N/A"
                                // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                //     resquery[0].pgp_email = pgp_emails[0].pgp_email
                                // } else {
                                //     resquery[0].pgp_email = "N/A"
                                // }
                                // if (sim_ids && sim_ids.length) {
                                //     resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                //     resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                // }
                                // if (chat_ids[0] && chat_ids[0].chat_id) {
                                //     resquery[0].chat_id = chat_ids[0].chat_id
                                // }
                                // else {
                                //     resquery[0].chat_id = "N/A"
                                // }
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

                                let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                                let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]

                                // let loginHistoryData = await device_helpers.getLastLoginDetail(resquery[0].usr_device_id);
                                // if (loginHistoryData[0] && loginHistoryData[0].created_at) {
                                resquery[0].lastOnline = resquery[0].last_login ? resquery[0].last_login : "N/A"
                                // } else {
                                //     resquery[0].lastOnline = "N/A"
                                // }
                                let remainTermDays = "N/A"

                                if (resquery[0].expiry_date !== null) {
                                    let startDate = moment(new Date())
                                    let expiray_date = new Date(resquery[0].expiry_date)
                                    let endDate = moment(expiray_date)
                                    remainTermDays = endDate.diff(startDate, 'days')
                                }
                                resquery[0].remainTermDays = remainTermDays
                                // if (servicesData[0]) {
                                //     resquery[0].services = servicesData[0]
                                // }
                                // dealerData = await getDealerdata(res[i]);
                                resquery[0]["transfered_from"] = null;
                                resquery[0]["transfered_to"] = null;

                                let msgStatus = "";
                                let status = false;

                                if (resquery[0].finalStatus == constants.DEVICE_SUSPENDED) {
                                    msgStatus = "suspended";
                                } else if (resquery[0].finalStatus == constants.DEVICE_ACTIVATED || resquery[0].finalStatus == constants.DEVICE_TRIAL) {
                                    msgStatus = "active";
                                    status = true;
                                }
                                // else if (resquery[0].finalStatus == constants.DEVICE_EXPIRED) {
                                //     status = "Expired";
                                // }
                                socket_helpers.sendDeviceStatus(sockets.baseIo, resquery[0].device_id, msgStatus, status);
                                device_helpers.saveActionHistory(resquery[0], constants.DEVICE_UNFLAGGED, verify.user)
                                data = {
                                    "data": resquery[0],
                                    status: true,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_UNFLAG_SUCC], "Device Unflagged successfully"), // Device Unflagged successfully.
                                }
                            } else {
                                data = {
                                    status: false,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Error")
                                }
                            }

                            res.send(data);
                        })

                    }
                });

            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(
                        req.translation[""],
                        "Unauthorized Access"
                    )
                };
                return res.send(data);
            }

        }
        else {
            data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[""],
                    "Device Not Found"
                )
            };
            return res.send(data);
        }

    } else {

        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_UNFLAG], "Device not Unflagged.Please try again"), // Device Is not unflagged.Please try again"
        }
        res.send(data);
    }
}

exports.flagDevice = async function (req, res) {
    var verify = req.decoded // await verifyToken(req, res);
    var device_id = req.params.id;
    var option = req.body.data
    console.log('======= device_id =========', device_id)
    console.log(option);
    // return;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var sql2 = "select * from devices where id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        var getUserAcc = "select * from usr_acc where device_id = '" + device_id + "'";
        var getUserAccRes = await sql.query(getUserAcc);

        if (!empty(device_id) && gtres.length && getUserAccRes.length) {
            if (verify.user.user_type === constants.ADMIN || verify.user.id === getUserAccRes[0].dealer_id || verify.user.id === getUserAccRes[0].prnt_dlr_id) {
                if (gtres[0].flagged === '' || gtres[0].flagged === 'null' || gtres[0].flagged === null || gtres[0].flagged === 'Not flagged') {
                    var sql1 = `update devices set flagged='${option}' where id = '${device_id}'`;
                    console.log(sql1);
                    let results = await sql.query(sql1)

                    if (results.affectedRows == 0) {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FLAG], "Device not Flagged.Please try again"), // Device not Flagged.Please try again."
                        }
                    } else {
                        socket_helpers.sendDeviceStatus(sockets.baseIo, gtres[0].device_id, "flagged");

                        let resquery = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.reject_status = 0 AND devices.id= "' + device_id + '"')
                        if (resquery.length) {
                            // let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
                            // let sim_ids = await device_helpers.getSimids(resquery[0].id);
                            // let chat_ids = await device_helpers.getChatids(resquery[0].id);
                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                            let servicesData = await device_helpers.getServicesData(resquery[0].id);
                            let servicesIds = servicesData.map(item => { return item.id })
                            let userAccServiceData = []
                            let dataPlans = []
                            if (servicesIds.length) {
                                userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                                dataPlans = await device_helpers.getDataPlans(servicesIds)
                            }
                            // let loginHistoryData = await device_helpers.getLastLoginDetail(resquery[0].usr_device_id);
                            // if (loginHistoryData[0] && loginHistoryData[0].created_at) {
                            resquery[0].sim_id = "N/A"
                            resquery[0].sim_id2 = "N/A"
                            resquery[0].pgp_email = "N/A"
                            resquery[0].chat_id = "N/A"
                            resquery[0].lastOnline = resquery[0].last_login ? resquery[0].last_login : "N/A"
                            // } else {
                            //     resquery[0].lastOnline = "N/A"
                            // }
                            let remainTermDays = "N/A"

                            if (resquery[0].expiry_date !== null) {
                                let startDate = moment(new Date())
                                let expiray_date = new Date(resquery[0].expiry_date)
                                let endDate = moment(expiray_date)
                                remainTermDays = endDate.diff(startDate, 'days')
                            }
                            resquery[0].remainTermDays = remainTermDays


                            // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                            //     resquery[0].pgp_email = pgp_emails[0].pgp_email
                            // } else {
                            //     resquery[0].pgp_email = "N/A"
                            // }
                            // if (sim_ids && sim_ids.length) {
                            //     resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                            //     resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                            // }
                            // if (chat_ids[0] && chat_ids[0].chat_id) {
                            //     resquery[0].chat_id = chat_ids[0].chat_id
                            // }
                            // else {
                            //     resquery[0].chat_id = "N/A"
                            // }
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

                            let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                            resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                            let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                            resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]
                            // if (servicesData[0]) {
                            //     resquery[0].services = servicesData[0]
                            // }
                            // dealerData = await getDealerdata(res[i]);
                            resquery[0]["transfered_from"] = null;
                            resquery[0]["transfered_to"] = null;


                            device_helpers.saveActionHistory(resquery[0], constants.DEVICE_FLAGGED, verify.user)
                            console.log(resquery[0]);
                            data = {
                                data: resquery[0],
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_FLAG_SUCC], "Device Flagged successfully"), // Device Flagged successfully."
                            }
                            res.send(data);
                        }
                    }

                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_ALRDY_FLAG], "Device Already Flagged"), // Device Already Flagged
                    }
                    res.send(data);
                }
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(
                        req.translation[""],
                        "Unauthorized Access"
                    )
                };
                return res.send(data);
            }
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEVICE], "Invalid Device"), // Invalid Device."
            }
            res.send(data);
        }
    }
}


exports.transferUser = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        try {

            let NewUser = req.body.NewUser;
            let OldUser = req.body.OldUser;
            let usr_device_id = req.body.OldUsr_device_id;

            // console.log('NewUser is: ', NewUser)
            // console.log('OldUser is: ', OldUser)
            // console.log('usr_device_id is: ', usr_device_id)

            var userResult = await sql.query(`SELECT * from users WHERE user_id='${NewUser}'`);
            let updateUsrAcc = `UPDATE usr_acc SET user_id='${userResult[0].user_id}',account_email='${userResult[0].email}', transfer_user_status=1, user_transfered_from='${OldUser}', user_transfered_to='${NewUser}'  WHERE user_id = '${OldUser}' AND device_id=${usr_device_id};`;
            sql.query(updateUsrAcc, async function (err, resp) {
                if (err) {
                    console.log(err);
                    data = {
                        status: false,
                        msg: "Query Error"
                    }
                    res.send(data);
                    return;
                }

                if (resp && resp.affectedRows > 0) {


                    // Updae device name
                    var getDeviceName = await sql.query(`SELECT user_name from users WHERE user_id='${NewUser}'`);
                    sql.query(`UPDATE devices SET name= '${getDeviceName[0].user_name}' WHERE id=${usr_device_id}`);

                    // Save History into "acc_action_history"
                    let resquery = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.reject_status = 0 AND devices.id= "' + usr_device_id + '"')

                    // let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
                    // let sim_ids = await device_helpers.getSimids(resquery[0].id);
                    // let chat_ids = await device_helpers.getChatids(resquery[0].id);
                    resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                    let servicesData = await device_helpers.getServicesData(resquery[0].id);
                    let servicesIds = servicesData.map(item => { return item.id })
                    let dataPlans = []
                    let userAccServiceData = []
                    if (servicesIds.length) {
                        userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                        dataPlans = await device_helpers.getDataPlans(servicesIds)
                    }
                    resquery[0].sim_id = "N/A"
                    resquery[0].sim_id2 = "N/A"
                    resquery[0].pgp_email = "N/A"
                    resquery[0].chat_id = "N/A"
                    // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                    //     resquery[0].pgp_email = pgp_emails[0].pgp_email
                    // } else {
                    //     resquery[0].pgp_email = "N/A"
                    // }
                    // if (sim_ids && sim_ids.length) {
                    //     resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                    //     resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                    // }
                    // if (chat_ids[0] && chat_ids[0].chat_id) {
                    //     resquery[0].chat_id = chat_ids[0].chat_id
                    // }
                    // else {
                    //     resquery[0].chat_id = "N/A"
                    // }
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

                    let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                    resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                    let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                    resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]
                    // if (servicesData[0]) {
                    //     resquery[0].services = servicesData[0]
                    // }

                    var d = new Date(resquery[0].expiry_date);
                    var n = d.valueOf();

                    socket_helpers.deviceInfoUpdated(sockets.baseIo,
                        resquery[0].device_id,
                        {
                            device_id: resquery[0].device_id,
                            expiry_date: n,
                            user_id: resquery[0].user_id,
                            sim_id: resquery[0].sim_id,
                            sim_id2: resquery[0].sim_id2,
                            pgp_email: resquery[0].pgp_email,
                            chat_id: resquery[0].chat_id
                        }
                    );
                    device_helpers.saveActionHistory(resquery[0], constants.USER_TRANSFERED, verify.user)
                    data = {
                        status: true,
                        msg: "User Transfered Successfully"
                    }
                    res.send(data);
                } else {
                    data = {
                        status: false,
                        msg: "User Not Found"
                    }
                    res.send(data);
                }

            });

        } catch (err) {
            console.log(err);
            data = {
                status: false,
                msg: "Query Error"
            }
            res.send(data);
        }

    }
}


exports.transferDeviceProfile = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded;
    if (verify) {
        try {
            let flagged_device = req.body.flagged_device;
            let reqDevice = req.body.reqDevice;
            console.log(flagged_device, reqDevice);
            let date_now = moment().format('YYYY/MM/DD')
            // Get data of Flagged Device
            var SelectFlaggedDeviceDetail = `SELECT ${usr_acc_query_text} FROM usr_acc WHERE device_id = ${flagged_device.usr_device_id} AND id = ${flagged_device.id}`;
            sql.query(SelectFlaggedDeviceDetail, async function (err, rsltq) {
                if (err) {
                    console.log(err);
                    data = {
                        status: false,
                        msg: 'Query Error'
                    }
                    res.send(data);
                    return;
                }

                if (rsltq.length > 0) {
                    var selectRequestedDeviceDetail = `SELECT ${usr_acc_query_text} FROM usr_acc WHERE device_id = ${reqDevice.usr_device_id} AND id = ${reqDevice.id}`;
                    sql.query(selectRequestedDeviceDetail, async function (err, requestedDevice) {
                        if (err) {
                            data = {
                                status: false,
                                msg: 'ERROR: Internal server error.'
                            }
                            res.send(data);
                            return;
                        }
                        if (requestedDevice && requestedDevice.length) {
                            // Update New usr_acc
                            // let Update_UsrAcc_Query = `UPDATE usr_acc SET device_id='${rsltq[0].usr_device_id}', account_email='${rsltq[0].account_email}',account_name='${rsltq[0].account_name}',dealer_id=${rsltq[0].dealer_id},prnt_dlr_id=${rsltq[0].prnt_dlr_id},link_code='${rsltq[0].link_code}',client_id='${rsltq[0].client_id}',start_date='${rsltq[0].start_date}',expiry_months='${rsltq[0].expiry_months}',expiry_date='${rsltq[0].expiry_date}',status='${rsltq[0].status}',device_status=${rsltq[0].device_status},activation_status=${rsltq[0].activation_status},account_status='${rsltq[0].account_status}',unlink_status=0,transfer_status=0, transfered_from='${flagged_device.device_id}', transfered_to='${reqDevice.device_id}',dealer_name='${rsltq[0].dealer_name}',prnt_dlr_name='${rsltq[0].prnt_dlr_name}',del_status='0',note='${rsltq[0].note}',validity=${rsltq[0].validity}, batch_no='${rsltq[0].batch_no}'  WHERE device_id=${reqDevice.usr_device_id};`;
                            let Update_UsrAcc_Query = `UPDATE usr_acc SET device_id='${requestedDevice[0].usr_device_id}' , transfer_status=0, transfered_from='${flagged_device.device_id}', transfered_to='${reqDevice.device_id}'  WHERE device_id=${rsltq[0].usr_device_id};`;
                            console.log(Update_UsrAcc_Query)
                            sql.query(Update_UsrAcc_Query, async function (err, resp) {
                                if (err) {
                                    console.log(err);
                                    data = {
                                        status: false,
                                        msg: 'Query Error'
                                    }
                                    res.send(data);
                                    return;
                                }

                                if (resp && resp.affectedRows > 0) {

                                    // Update flagged device acc
                                    let UpdateQueryTransfer = `UPDATE usr_acc SET device_id = '${rsltq[0].usr_device_id}' ,  transfer_status = '1',transfered_from='${flagged_device.device_id}', transfered_to='${reqDevice.device_id}' ,account_email='${rsltq[0].account_email}',account_name='${rsltq[0].account_name}',dealer_id=${rsltq[0].dealer_id},prnt_dlr_id=${rsltq[0].prnt_dlr_id},link_code='${rsltq[0].link_code}',client_id='${rsltq[0].client_id}',start_date='${rsltq[0].start_date}',expiry_months='${rsltq[0].expiry_months}',expiry_date='${date_now}',status='expired',device_status=${rsltq[0].device_status},activation_status=${rsltq[0].activation_status},account_status='${rsltq[0].account_status}',unlink_status=0,dealer_name='${rsltq[0].dealer_name}',prnt_dlr_name='${rsltq[0].prnt_dlr_name}',del_status='0',note='${rsltq[0].note}',validity=${rsltq[0].validity}, batch_no='${rsltq[0].batch_no}' WHERE id=${requestedDevice[0].id};`;
                                    console.log(UpdateQueryTransfer)

                                    await sql.query(UpdateQueryTransfer, async function (err, resp) {
                                        if (err) {
                                            console.log(err);
                                            data = {
                                                status: false,
                                                msg: 'Query Error'
                                            }
                                            res.send(data);
                                            return;
                                        }
                                        if (resp && resp.affectedRows > 0) {

                                            // Updae device name
                                            var getDeviceName = await sql.query(`SELECT name from devices WHERE id='${rsltq[0].usr_device_id}'`);
                                            await sql.query(`UPDATE devices SET name='${getDeviceName[0].name}', is_sync='0' WHERE id=${requestedDevice[0].usr_device_id}`);

                                            // var slctquery =
                                            //     "select devices.*  ," +
                                            //     usr_acc_query_text +
                                            //     ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id = '" +
                                            //     flagged_device.usr_device_id +
                                            //     "'";
                                            // // console.log(slctquery);
                                            // rsltq = await sql.query(slctquery);

                                            // // let pgp_emails = await device_helpers.getPgpEmails(rsltq[0].id);
                                            // // let sim_ids = await device_helpers.getSimids(rsltq[0].id);
                                            // // let chat_ids = await device_helpers.getChatids(rsltq[0].id);
                                            // let flaggedDeviceServicesData = await device_helpers.getServicesData(rsltq[0].id);
                                            // let flaggedDeviceServicesIds = flaggedDeviceServicesData.map(item => { return item.id })
                                            // let flaggedDeviceUserAccServiceData = []
                                            // let flaggedDeviceDataPlans = []
                                            // if (flaggedDeviceServicesIds.length) {
                                            //     flaggedDeviceUserAccServiceData = await device_helpers.getUserAccServicesData(rsltq[0].id, flaggedDeviceServicesIds)
                                            //     flaggedDeviceDataPlans = await device_helpers.getDataPlans(flaggedDeviceServicesIds)
                                            // }

                                            // let flaggedDeviceServices = flaggedDeviceServicesData;
                                            // if (flaggedDeviceServices && flaggedDeviceServices.length) {
                                            //     flaggedDeviceServices.map(async (item) => {
                                            //         console.log("UPDATE SERVICE QUERY:", `UPDATE services_data SET status = 'transferred' WHERE id = ${item.id}`);
                                            //         await sql.query(`UPDATE services_data SET status = 'transferred' , end_date = '${date_now}' WHERE id = ${item.id}`)

                                            //         console.log("INSERT SERVICE QUERY:", `INSERT INTO services_data (user_acc_id , dealer_id , packages , products, total_credits , paid_credits , start_date,service_term , service_expiry_date , status, grace_days, data_plan_price) VALUES(${reqDevice.id} ,${item.dealer_id} ,'${item.packages}' ,'${item.products}' ,${item.total_credits} ,${item.paid_credits} , '${item.start_date}' , '${item.service_term}' , '${item.service_expiry_date}' , '${item.status}' , ${item.grace_days} , ${item.data_plan_price})`);
                                            //         let insertedService = await sql.query(`INSERT INTO services_data (user_acc_id , dealer_id , packages , products, total_credits , paid_credits , start_date,service_term , service_expiry_date , status, grace_days, data_plan_price) VALUES(${reqDevice.id} ,${item.dealer_id} ,'${item.packages}' ,'${item.products}' ,${item.total_credits} ,${item.paid_credits} , '${item.start_date}' , '${item.service_term}' , '${item.service_expiry_date}' , '${item.status}' , ${item.grace_days} , ${item.data_plan_price})`)

                                            //         let insertedServiceId = insertedService.insertId
                                            //         if (flaggedDeviceDataPlans && flaggedDeviceDataPlans.length) {
                                            //             await sql.query(`UPDATE sim_data_plans SET status = deleted WHERE service_id = ${item.id}`)
                                            //             flaggedDeviceDataPlans.map(async dataPlan => {
                                            //                 let data_package_plan = `INSERT INTO sim_data_plans ( service_id , data_plan_package , total_price , total_data , sim_type , start_date , used_data) VALUES( ${insertedServiceId} , '${dataPlan.data_plan_package}' , '${dataPlan.data_plan_price}' , '${dataPlan.data_limit}' , '${dataPlan.sim_type}' , '${dataPlan.start_date}' ,'${dataPlan.used_data}')`
                                            //                 await sql.query(data_package_plan)
                                            //             })
                                            //         }

                                            //         let productsData = flaggedDeviceUserAccServiceData.filter(usr_acc_service => usr_acc_service.service_id === item.id);
                                            //         if (productsData && productsData.length) {
                                            //             productsData.map(async (productItem) => {
                                            //                 let insert_again = true
                                            //                 let inserted_id = null
                                            //                 let insertedProductData = null
                                            //                 if (productItem.type === 'sim_id' || productItem.type === 'sim_id2') {
                                            //                     if (item.status === 'extended') {
                                            //                         let alreadyAdded = await sql.query(`SELECT sim_id FROM sim_ids WHERE sim_id = '${productItem.product_value}' AND user_acc_id = '${reqDevice.id}'`)
                                            //                         if (alreadyAdded && alreadyAdded.length) {
                                            //                             insert_again = false
                                            //                             inserted_id = alreadyAdded[0].id
                                            //                         }
                                            //                     }
                                            //                     let UpdateSimIds = `UPDATE sim_ids SET delete_status = '1' WHERE sim_id = '${productItem.product_value}'`;
                                            //                     await sql.query(UpdateSimIds);
                                            //                     if (insert_again) {
                                            //                         let InsertSimIds = `INSERT INTO sim_ids (sim_id, user_acc_id, used , dealer_id , start_date , uploaded_by , uploaded_by_id , activated) VALUES('${productItem.product_value}', '${reqDevice.id}', '1' , '${productItem.dealer_id}' , '${productItem.start_date}' , '${productItem.uploaded_by}' ,  '${productItem.uploaded_by_id}' , '${productItem.activated}')`;
                                            //                         insertedProductData = await sql.query(InsertSimIds);
                                            //                         if (insertedProductData) {
                                            //                             inserted_id = insertedProductData.insertId
                                            //                         }
                                            //                     }
                                            //                 }
                                            //                 else if (productItem.type === 'pgp_email') {
                                            //                     if (item.status === 'extended') {
                                            //                         let alreadyAdded = await sql.query(`SELECT pgp_email FROM pgp_emails WHERE pgp_email = '${productItem.product_value}' AND user_acc_id = '${reqDevice.id}'`)
                                            //                         if (alreadyAdded && alreadyAdded.length) {
                                            //                             insert_again = false
                                            //                             inserted_id = alreadyAdded[0].id
                                            //                         }
                                            //                     }
                                            //                     let UpdatePgp = `UPDATE pgp_emails SET delete_status = '1' WHERE pgp_email = '${productItem.product_value}'`;
                                            //                     await sql.query(UpdatePgp);

                                            //                     if (insert_again) {
                                            //                         let InsertPgp = `INSERT INTO pgp_emails (pgp_email, user_acc_id, used , dealer_id , start_date , uploaded_by , uploaded_by_id , domain_id) VALUES('${productItem.product_value}', '${reqDevice.id}', '1' , '${productItem.dealer_id}' , '${productItem.start_date}' , '${productItem.uploaded_by}' ,  '${productItem.uploaded_by_id}' , '${productItem.domain_id}')`;
                                            //                         insertedProductData = await sql.query(InsertPgp);
                                            //                         if (insertedProductData) {
                                            //                             inserted_id = insertedProductData.insertId
                                            //                         }
                                            //                     }
                                            //                 }
                                            //                 else if (productItem.type === 'chat_id') {
                                            //                     if (item.status === 'extended') {
                                            //                         let alreadyAdded = await sql.query(`SELECT chat_id FROM chat_ids WHERE chat_id = '${productItem.product_value}' AND user_acc_id = '${reqDevice.id}'`)
                                            //                         if (alreadyAdded && alreadyAdded.length) {
                                            //                             insert_again = false
                                            //                             inserted_id = alreadyAdded[0].id
                                            //                         }
                                            //                     }
                                            //                     let UpdateChat = `UPDATE chat_ids SET delete_status = '1' WHERE chat_id = '${productItem.product_value}'`;
                                            //                     insertedProductData = await sql.query(UpdateChat);

                                            //                     if (insert_again) {
                                            //                         let InsertChat = `INSERT INTO chat_ids (chat_id, user_acc_id, used , dealer_id , start_date , uploaded_by , uploaded_by_id  ) VALUES('${productItem.product_value}', '${reqDevice.id}', '1' , '${productItem.dealer_id}' , '${productItem.start_date}' , '${productItem.uploaded_by}' ,  '${productItem.uploaded_by_id}')`;
                                            //                         insertedProductData = await sql.query(InsertChat);
                                            //                         if (insertedProductData) {
                                            //                             inserted_id = insertedProductData.insertId
                                            //                         }
                                            //                     }
                                            //                 }
                                            //                 await sql.query(`UPDATE user_acc_services SET status = 'transferred' WHERE id = ${productItem.id}`)
                                            //                 if (inserted_id) {
                                            //                     let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id,product_value, type , start_date) VALUES(${reqDevice.id} , ${insertedServiceId} , ${inserted_id} , '${productItem.product_value}' , '${productItem.type}' , '${productItem.start_date}')`
                                            //                     await sql.query(insertAccService)
                                            //                 }
                                            //             })
                                            //         }
                                            //     })
                                            // }
                                            // Save History 
                                            let resquery = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.reject_status = 0 AND devices.id= "' + flagged_device.usr_device_id + '"')

                                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);

                                            let servicesData = await device_helpers.getServicesData(resquery[0].id);
                                            let servicesIds = servicesData.map(item => { return item.id })
                                            let userAccServiceData = []
                                            let dataPlans = []
                                            if (servicesIds.length) {
                                                userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                                                dataPlans = await device_helpers.getDataPlans(servicesIds)
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

                                            let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                            resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                                            let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                            resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]
                                            // if (servicesData[0]) {
                                            //     resquery[0].services = servicesData[0]
                                            // }
                                            device_helpers.saveActionHistory(resquery[0], "Device Transfered", verify.user);
                                            // console.log(resquery[0]);
                                            socket_helpers.sendDeviceStatus(sockets.baseIo, resquery[0].device_id, "transfered");


                                            data = {
                                                status: true,
                                                msg: "Device Transfered Successfully"
                                            }
                                            res.send(data);
                                            return;

                                        } else {
                                            data = {
                                                status: false,
                                                msg: "Error: Account detail Transfer but Flagged Device not found"
                                            }
                                            res.send(data);
                                        }

                                    });

                                } else {
                                    data = {
                                        status: false,
                                        msg: "Error: Device not found to transer device services."
                                    }
                                    res.send(data);
                                }
                            });
                        } else {
                            data = {
                                status: false,
                                msg: 'ERROR: New device not found to be transferred.'
                            }
                            res.send(data);
                            return
                        }
                    })




                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERR_TRANSF], "Error While Transfer"), // Error While Transfer.
                    }
                    res.send(data);
                }
            });

        } catch (err) {
            console.log(err);
            data = {
                status: false,
                msg: 'Query Error'
            }
            res.send(data);
        }
    }
}

// exports.transferDeviceProfile = async function (req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     var verify = req.decoded;
//     if (verify) {
//         try {
//             let flagged_device = req.body.flagged_device;
//             let reqDevice = req.body.reqDevice;

//             // Get data of Flagged Device
//             var SelectFlaggedDeviceDetail = `SELECT ${usr_acc_query_text} FROM usr_acc WHERE device_id = ${flagged_device.usr_device_id} AND id = ${flagged_device.id}`;
//             sql.query(SelectFlaggedDeviceDetail, async function (err, rsltq) {
//                 if (err) {
//                     console.log(err);
//                     data = {
//                         status: false,
//                         msg: "Query Error"
//                     }
//                     res.send(data);
//                 }

//                 if (rsltq.length > 0) {

//                     // Update New usr_acc
//                     let Update_UsrAcc_Query = `UPDATE usr_acc SET user_id='${rsltq[0].user_id}', account_email='${rsltq[0].account_email}',account_name='${rsltq[0].account_name}',dealer_id='${rsltq[0].dealer_id}',prnt_dlr_id='${rsltq[0].prnt_dlr_id}',link_code='${rsltq[0].link_code}',client_id='${rsltq[0].client_id}',start_date='${rsltq[0].start_date}',expiry_months='${rsltq[0].expiry_months}',expiry_date='${rsltq[0].expiry_date}',status='${rsltq[0].status}',device_status='${rsltq[0].device_status}',activation_status='${rsltq[0].activation_status}',account_status='${rsltq[0].account_status}',unlink_status='0',transfer_status='0', transfered_from='${flagged_device.device_id}', transfered_to='${reqDevice.device_id}',dealer_name='${rsltq[0].dealer_name}',prnt_dlr_name='${rsltq[0].prnt_dlr_name}',del_status='0',note='${rsltq[0].note}',validity='${rsltq[0].validity}', batch_no='${rsltq[0].batch_no}'  WHERE device_id=${reqDevice.usr_device_id};`;
//                     console.log("Update_UsrAcc_Query", Update_UsrAcc_Query);

//                     sql.query(Update_UsrAcc_Query, async function (err, resp) {
//                         if (err) {
//                             console.log(err);
//                         }

//                         if (resp.affectedRows > 0) {

//                             // Update flagged device acc
//                             let UpdateQueryTransfer = `UPDATE usr_acc SET transfer_status = '1',transfered_from='${flagged_device.device_id}', transfered_to='${reqDevice.device_id}' WHERE id=${flagged_device.id};`;
//                             sql.query(UpdateQueryTransfer, async function (err, resp) {
//                                 if (err) {
//                                     console.log(err);
//                                     data = {
//                                         status: false,
//                                         msg: "Query Error"
//                                     }
//                                     res.send(data);
//                                 }

//                                 if (resp.affectedRows > 0) {

//                                     // Updae device name
//                                     var getDeviceName = await sql.query(`SELECT name from devices WHERE id='${flagged_device.usr_device_id}'`);
//                                     sql.query(`UPDATE devices SET name='${getDeviceName[0].name}', is_sync='0' WHERE id=${reqDevice.usr_device_id}`);

//                                     // console.log('==============> :: 08', flagged_device.id)
//                                     // // Get usr_acc_profile
//                                     // let Select_UsrAccProfile = `SELECT * FROM usr_acc_profile WHERE user_acc_id = ${flagged_device.id} AND delete_status = '0'`;
//                                     // console.log('Select_UsrAccProfile ', Select_UsrAccProfile)
//                                     // let UsrAccProfile_Result = await sql.query(Select_UsrAccProfile)

//                                     // // Copy usr_acc_profile
//                                     // if (UsrAccProfile_Result.length > 0) {

//                                     //     console.log('==============> :: 09')
//                                     //     // Update usr_acc_profile
//                                     //     // let Update_UsrAccProfile = `UPDATE usr_acc_profile SET profile_name='${UsrAccProfile_Result[0].profile_name}', profile_note='${UsrAccProfile_Result[0].profile_note}', policy_id='${UsrAccProfile_Result[0].policy_id}', user_acc_id='${reqDevice.id}', dealer_id='${UsrAccProfile_Result[0].dealer_id}', app_list='${UsrAccProfile_Result[0].app_list}', permissions='${UsrAccProfile_Result[0].permissions}', controls='${UsrAccProfile_Result[0].controls}', passwords='${UsrAccProfile_Result[0].passwords}', status='${UsrAccProfile_Result[0].status}' WHERE user_acc_id=${reqDevice.id};`;
//                                     //     let Insert_UsrAccProfile = `INSERT INTO usr_acc_profile (profile_name, profile_note, policy_id, user_acc_id, dealer_id, app_list, permissions, controls, passwords, status) 
//                                     //     VALUES('${UsrAccProfile_Result[0].profile_name}', '${UsrAccProfile_Result[0].profile_note}', '${UsrAccProfile_Result[0].policy_id}', '${reqDevice.id}', '${UsrAccProfile_Result[0].dealer_id}', '${UsrAccProfile_Result[0].app_list}', '${UsrAccProfile_Result[0].permissions}', '${UsrAccProfile_Result[0].controls}', '${UsrAccProfile_Result[0].passwords}', '${UsrAccProfile_Result[0].status}');`;

//                                     //     let resp = await sql.query(Insert_UsrAccProfile);
//                                     //     // await sql.query(Insert_UsrAccProfile, async function (err, resp) {

//                                     //     console.log('Insert_UsrAccProfile ', Insert_UsrAccProfile)
//                                     //     console.log('==============> :: 10')
//                                     //     if (resp.affectedRows > 0) {

//                                     //         console.log('==============> :: 11')
//                                     //         // Delete Old usr_acc_profile
//                                     //         let delete_UsrAccProfile = `UPDATE usr_acc_profile SET delete_status = '1' WHERE user_acc_id=${flagged_device.id};`;
//                                     //         console.log('delete_UsrAccProfile ', delete_UsrAccProfile)
//                                     //           await sql.query(delete_UsrAccProfile);
//                                     //     }
//                                     //     // });




//                                     // }
//                                     // else {
//                                     //     console.log('==============> :: 12')
//                                     //     data = {
//                                     //         status: false,
//                                     //         msg: "Device Services not fully transfered"
//                                     //     }
//                                     //     res.send(data);
//                                     //     return;
//                                     // }

//                                     // ChatIds
//                                     let ChatIds = `SELECT * FROM chat_ids WHERE user_acc_id = '${flagged_device.id}' AND delete_status = '0'`; // "flagged_device.id" is user id(primary key) at usr_acc table
//                                     let ChatIds_Result = await sql.query(ChatIds)
//                                     if (ChatIds_Result.length > 0) {

//                                         let InsertChatIds = `INSERT INTO chat_ids (chat_id, user_acc_id) VALUES('${ChatIds_Result[0].chat_id}', '${reqDevice.id}')`;
//                                         sql.query(InsertChatIds);
//                                         // Update chat_ids
//                                         let UpdateChatIds = `UPDATE chat_ids SET delete_status = '1' WHERE user_acc_id=${flagged_device.id};`;
//                                         sql.query(UpdateChatIds);
//                                     }

//                                     // pgp_emails
//                                     let pgpEmails = `SELECT * FROM pgp_emails WHERE user_acc_id = '${flagged_device.id}' AND delete_status = '0'`; // "flagged_device.id" is user id(primary key) at usr_acc table
//                                     let pgp_emails_Result = await sql.query(pgpEmails)
//                                     if (pgp_emails_Result.length > 0) {

//                                         let InsertPgp_emails = `INSERT INTO pgp_emails (pgp_email, user_acc_id) VALUES('${pgp_emails_Result[0].pgp_email}', '${reqDevice.id}')`;
//                                         sql.query(InsertPgp_emails);
//                                         let UpdatePgp_emails = `UPDATE pgp_emails SET delete_status = '1' WHERE user_acc_id=${flagged_device.id};`;
//                                         sql.query(UpdatePgp_emails);
//                                     }

//                                     // SimIds
//                                     let SimIds = `SELECT * FROM sim_ids WHERE user_acc_id = '${flagged_device.id}' AND delete_status = '0'`;
//                                     let SimIds_Result = await sql.query(SimIds);
//                                     if (SimIds_Result.length > 0) {
//                                         for (var i = 0; i < SimIds_Result.length; i++) {
//                                             let InsertSimIds = `INSERT INTO sim_ids (sim_id, user_acc_id) VALUES('${SimIds_Result[0].sim_id}', '${reqDevice.id}')`;
//                                             let resp = await sql.query(InsertSimIds);

//                                             // Update sim_ids
//                                             if (resp.affectedRows > 0) {
//                                                 let UpdateSim_ids = `UPDATE sim_ids SET delete_status = '1' WHERE user_acc_id=${flagged_device.id};`;
//                                                 sql.query(UpdateSim_ids);
//                                             }
//                                         }
//                                     }

//                                     // Save History 
//                                     let resquery = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.reject_status = 0 AND devices.id= "' + flagged_device.usr_device_id + '"')

//                                     let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
//                                     let sim_ids = await device_helpers.getSimids(resquery[0].id);
//                                     let chat_ids = await device_helpers.getChatids(resquery[0].id);
//                                     resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
//                                     if (pgp_emails[0] && pgp_emails[0].pgp_email) {
//                                         resquery[0].pgp_email = pgp_emails[0].pgp_email
//                                     } else {
//                                         resquery[0].pgp_email = "N/A"
//                                     }
//                                     if (sim_ids[0] && sim_ids[0].sim_id) {
//                                         resquery[0].sim_id = sim_ids[0].sim_id
//                                     } else {
//                                         resquery[0].sim_id = "N/A"
//                                     }
//                                     if (chat_ids[0] && chat_ids[0].chat_id) {
//                                         resquery[0].chat_id = chat_ids[0].chat_id
//                                     }
//                                     else {
//                                         resquery[0].chat_id = "N/A"
//                                     }
//                                     device_helpers.saveActionHistory(resquery[0], "Device Transfered");
//                                     // console.log(resquery[0]);
//                                     socket_helpers.sendDeviceStatus(sockets.baseIo, resquery[0].device_id, "transfered");


//                                     data = {
//                                         status: true,
//                                         msg: "Device Transfered Successfully"
//                                     }
//                                     res.send(data);
//                                     return;

//                                 } else {
//                                     data = {
//                                         status: false,
//                                         msg: "Error: Account detail Transfer but Flagged Device not found"
//                                     }
//                                     res.send(data);
//                                 }

//                             });

//                         } else {
//                             data = {
//                                 status: false,
//                                 msg: "Error: Device not found to transer device services."
//                             }
//                             res.send(data);
//                         }
//                     });

//                 } else {
//                     data = {
//                         status: false,
//                         msg: await helpers.convertToLang(req.translation[MsgConstants.ERR_TRANSF], "Error While Transfer"), // Error While Transfer.
//                     }
//                     res.send(data);
//                 }
//             });

//         } catch (err) {
//             console.log(err);
//             data = {
//                 status: false,
//                 msg: 'Query Error'
//             }
//             res.send(data);
//         }
//     }
// }




exports.transferHistory = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded;
    console.log("transferHistory device id: ", req.params.device_id)
    if (verify) {
        try {
            if (req.params.device_id) {
                let getHistory = `SELECT action,device_id, user_acc_id, transfered_from, transfered_to, user_transfered_from, user_transfered_to, created_at FROM acc_action_history WHERE (action = 'User Transfered' OR action = 'Device Transfered') AND device_id='${req.params.device_id}';`;

                // console.log('getHistory ', getHistory)
                await sql.query(getHistory, async function (err, resp) {
                    if (err) {
                        console.log(err);
                        data = {
                            status: false,
                            data: []
                        }
                        res.send(data);
                        return;
                    }

                    // console.log('resp: ', resp)
                    if (resp && resp.length > 0) {

                        data = {
                            status: true,
                            data: resp
                        }
                        res.send(data);
                    } else {
                        data = {
                            status: false,
                            data: []
                        }
                        res.send(data);
                    }
                });
            } else {
                res.send({
                    status: false,
                    data: []
                })
            }
        } catch (err) {
            console.log(err);
            data = {
                status: false,
                data: []
            }
            res.send(data);
        }

    }
}



// ******************************************** End Transfer Module


exports.getServicesHistory = async function (req, res) {
    var verify = req.decoded;
    let usr_acc_id = req.params.usr_acc_id;

    console.log("getServicesHistory : ", usr_acc_id)
    if (verify) {
        // console.log("hi");

        let selectQ = `SELECT * FROM services_data WHERE user_acc_id = ${usr_acc_id} AND (status = 'returned' OR status = 'cancelled' OR status = 'completed' OR status = 'deleted') ORDER BY id DESC`
        console.log("getServicesHistory selectQ ", selectQ);

        let results = await sql.query(selectQ, async function (err, results) {
            if (err) {
                console.log("err ", err);
                return res.send({
                    status: false,
                    data: []
                });
            }
            // console.log("results ", results);

            if (results && results.length) {
                return res.send({
                    status: true,
                    data: results
                });
            } else {
                return res.send({
                    status: false,
                    data: []
                });
            }
        });

    }
}

exports.suspendAccountDevices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format("Y-m-d H:M:S");

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var sql2 =
            "select * from usr_acc where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        if (!empty(device_id) && gtres.length) {
            let resDevice = null;
            if (verify.user.user_type === constants.ADMIN || verify.user.id === gtres[0].dealer_id || verify.user.id === gtres[0].prnt_dlr_id) {
                if (gtres[0].expiry_date == "" || gtres[0].expiry_date == null) {
                    var sql1 =
                        "update usr_acc set account_status='suspended' where device_id = '" +
                        device_id +
                        "'";

                    var rest = sql.query(sql1, async function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        if (results.affectedRows == 0) {
                            data = {
                                status: false,
                                msg: await helpers.convertToLang(
                                    req.translation[MsgConstants.ACC_NOT_SUSP],
                                    "Account not suspended.Please try again"
                                ) // Account not suspended.Please try again.
                            };
                        } else {
                            sql.query(
                                "select devices.*  ," +
                                usr_acc_query_text +
                                ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' +
                                device_id +
                                '"',
                                async function (error, resquery, fields) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    console.log("lolo else", resquery[0]);

                                    if (resquery.length) {
                                        // let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
                                        // let sim_ids = await device_helpers.getSimids(resquery[0].id);
                                        // let chat_ids = await device_helpers.getChatids(resquery[0].id);
                                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);

                                        let servicesData = await device_helpers.getServicesData(resquery[0].id);
                                        let servicesIds = servicesData.map(item => { return item.id })
                                        let userAccServiceData = []
                                        let dataPlans = []
                                        if (servicesIds.length) {
                                            userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                                            dataPlans = await device_helpers.getDataPlans(servicesIds)
                                        }
                                        resquery[0].sim_id = "N/A"
                                        resquery[0].sim_id2 = "N/A"
                                        resquery[0].pgp_email = "N/A"
                                        resquery[0].chat_id = "N/A"
                                        // if (pgp_emails[0].pgp_email) {
                                        //     resquery[0].pgp_email = pgp_emails[0].pgp_email
                                        // } else {
                                        //     resquery[0].pgp_email = "N/A"
                                        // }
                                        // if (sim_ids[0].sim_id) {
                                        //     resquery[0].sim_id = sim_ids[0].sim_id
                                        // } else {
                                        //     resquery[0].sim_id = "N/A"
                                        // }
                                        // if (chat_ids[0].chat_id) {
                                        //     resquery[0].chat_id = chat_ids[0].chat_id
                                        // }
                                        // else {
                                        //     resquery[0].chat_id = "N/A"

                                        // }
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

                                        let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                        resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                                        let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                        resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]
                                        // if (servicesData[0]) {
                                        //     resquery[0].services = servicesData[0]
                                        // }
                                        // let loginHistoryData = await device_helpers.getLastLoginDetail(resquery[0].usr_device_id)
                                        // if (loginHistoryData[0] && loginHistoryData[0].created_at) {
                                        resquery[0].lastOnline = resquery[0].last_login ? resquery[0].last_login : "N/A"
                                        // } else {
                                        //     resquery[0].lastOnline = "N/A"
                                        // }
                                        let remainTermDays = "N/A"

                                        if (resquery[0].expiry_date !== null) {
                                            let startDate = moment(new Date())
                                            let expiray_date = new Date(resquery[0].expiry_date)
                                            let endDate = moment(expiray_date)
                                            remainTermDays = endDate.diff(startDate, 'days')
                                        }
                                        resquery[0].remainTermDays = remainTermDays
                                        // dealerData = await getDealerdata(res[i]);
                                        data = {
                                            data: resquery[0],
                                            status: true,
                                            msg: await helpers.convertToLang(
                                                req.translation[
                                                MsgConstants.ACC_SUSP_SUCC
                                                ],
                                                "Account suspended successfully"
                                            ) // Account suspended successfully.
                                        };
                                        device_helpers.saveActionHistory(
                                            resquery[0],
                                            constants.DEVICE_SUSPENDED,
                                            verify.user
                                        );
                                        socket_helpers.sendDeviceStatus(sockets.baseIo,
                                            resquery[0].device_id,
                                            "suspended"
                                        );

                                        res.send(data);
                                    }
                                }
                            );
                        }
                    });
                } else {
                    if (gtres[0].expiry_date >= formatted_dt) {
                        var sql1 =
                            "update usr_acc set account_status='suspended' where device_id = '" +
                            device_id +
                            "'";

                        var rest = sql.query(sql1, async function (error, results) {
                            if (error) {
                                console.log(error);
                            }
                            if (results.affectedRows == 0) {
                                data = {
                                    status: false,
                                    msg: await helpers.convertToLang(
                                        req.translation[MsgConstants.ACC_NOT_SUSP],
                                        "Account not suspended.Please try again"
                                    ) // Account not suspended.Please try again."
                                };
                            } else {
                                sql.query(
                                    "select devices.*  ," +
                                    usr_acc_query_text +
                                    ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' +
                                    device_id +
                                    '"',
                                    async function (error, resquery, fields) {
                                        if (error) {
                                            console.log(error);
                                        }
                                        // console.log('lolo else', resquery[0])

                                        if (resquery.length) {
                                            // let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
                                            // let sim_ids = await device_helpers.getSimids(resquery[0].id);
                                            // let chat_ids = await device_helpers.getChatids(resquery[0].id);
                                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                                            let servicesData = await device_helpers.getServicesData(resquery[0].id);
                                            let servicesIds = servicesData.map(item => { return item.id })
                                            let userAccServiceData = []
                                            let dataPlans = []
                                            if (servicesIds.length) {
                                                userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                                                dataPlans = await device_helpers.getDataPlans(servicesIds)
                                            }
                                            resquery[0].sim_id = "N/A"
                                            resquery[0].sim_id2 = "N/A"
                                            resquery[0].pgp_email = "N/A"
                                            resquery[0].chat_id = "N/A"
                                            // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                            //     resquery[0].pgp_email = pgp_emails[0].pgp_email
                                            // } else {
                                            //     resquery[0].pgp_email = "N/A"
                                            // }
                                            // if (sim_ids && sim_ids.length) {
                                            //     resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                            //     resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                            // }
                                            // if (chat_ids[0] && chat_ids[0].chat_id) {
                                            //     resquery[0].chat_id = chat_ids[0].chat_id
                                            // }
                                            // else {
                                            //     resquery[0].chat_id = "N/A"

                                            // }
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

                                            let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                            resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                                            let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                            resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]
                                            // if (servicesData[0]) {
                                            //     resquery[0].services = servicesData[0]
                                            // }
                                            // let loginHistoryData = await device_helpers.getLastLoginDetail(resquery[0].usr_device_id)
                                            // if (loginHistoryData[0] && loginHistoryData[0].created_at) {
                                            resquery[0].lastOnline = resquery[0].last_login ? resquery[0].last_login : "N/A"
                                            // } else {
                                            //     resquery[0].lastOnline = "N/A"
                                            // }
                                            let remainTermDays = "N/A"

                                            if (resquery[0].expiry_date !== null) {
                                                let startDate = moment(new Date())
                                                let expiray_date = new Date(resquery[0].expiry_date)
                                                let endDate = moment(expiray_date)
                                                remainTermDays = endDate.diff(startDate, 'days')
                                            }
                                            resquery[0].remainTermDays = remainTermDays
                                            // dealerData = await getDealerdata(res[i]);
                                            data = {
                                                data: resquery[0],
                                                status: true,
                                                msg: await helpers.convertToLang(
                                                    req.translation[
                                                    MsgConstants.ACC_SUSP_SUCC
                                                    ],
                                                    "Account suspended successfully"
                                                ) // Account suspended successfully."
                                            };
                                            device_helpers.saveActionHistory(
                                                resquery[0],
                                                constants.DEVICE_SUSPENDED,
                                                verify.user
                                            );
                                            socket_helpers.sendDeviceStatus(sockets.baseIo,
                                                resquery[0].device_id,
                                                "suspended"
                                            );
                                            res.send(data);
                                        }
                                    }
                                );
                            }
                        });
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.NOT_SUSP_ACC_EXP],
                                "Can't suspend !!! Account Already Expired"
                            ) // Can't suspend !!! Account Already Expired."
                        };
                        res.send(data);
                    }
                }
            }
            else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(
                        req.translation[""],
                        "Unautorized Access"
                    ) // Can't suspend !!! Account Already Expired."
                };
                return res.send(data);
            }

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.INVALID_DEVICE],
                    "Invalid Device"
                ) // Invalid Device."
            };
            res.send(data);
        }
    }
};


exports.activateDevice = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var device_id = req.params.id;
    var tod_dat = datetime.create();
    var formatted_dt = tod_dat.format("Y-m-d H:M:S");

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var sql2 =
            "select * from usr_acc where device_id = '" + device_id + "'";
        var gtres = await sql.query(sql2);

        if (!empty(device_id) && gtres.length) {
            if (verify.user.user_type === constants.ADMIN || verify.user.id === gtres[0].dealer_id || verify.user.id === gtres[0].prnt_dlr_id) {
                if (gtres[0].expiry_date == "" || gtres[0].expiry_date == null) {
                    var sql1 =
                        "update usr_acc set account_status='' where device_id = '" +
                        device_id +
                        "'";

                    var rest = sql.query(sql1, async function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        if (results.affectedRows == 0) {
                            data = {
                                status: false,
                                msg: await helpers.convertToLang(
                                    req.translation[MsgConstants.DEVICE_NOT_ACTIV],
                                    "Device not activated.Please try again"
                                ) // Device not activated.Please try again."
                            };
                        } else {
                            sql.query(
                                "select devices.*  ," +
                                usr_acc_query_text +
                                ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' +
                                device_id +
                                '"',
                                async function (error, resquery, fields) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    console.log("lolo else", resquery[0]);

                                    if (resquery.length) {
                                        // let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
                                        // let sim_ids = await device_helpers.getSimids(resquery[0].id);
                                        // let chat_ids = await device_helpers.getChatids(resquery[0].id);
                                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                                        let servicesData = await device_helpers.getServicesData(resquery[0].id);
                                        let servicesIds = servicesData.map(item => { return item.id })
                                        let userAccServiceData = []
                                        let dataPlans = []
                                        if (servicesIds.length) {
                                            userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                                            dataPlans = await device_helpers.getDataPlans(servicesIds)
                                        }
                                        resquery[0].sim_id = "N/A"
                                        resquery[0].sim_id2 = "N/A"
                                        resquery[0].pgp_email = "N/A"
                                        resquery[0].chat_id = "N/A"
                                        // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                        //     resquery[0].pgp_email = pgp_emails[0].pgp_email
                                        // } else {
                                        //     resquery[0].pgp_email = "N/A"
                                        // }
                                        // if (sim_ids && sim_ids.length) {
                                        //     resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                        //     resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                        // }
                                        // if (chat_ids[0] && chat_ids[0].chat_id) {
                                        //     resquery[0].chat_id = chat_ids[0].chat_id
                                        // }
                                        // else {
                                        //     resquery[0].chat_id = "N/A"

                                        // }
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

                                        let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                        resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                                        let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
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

                                        socket_helpers.sendDeviceStatus(sockets.baseIo,
                                            resquery[0].device_id,
                                            "active",
                                            true
                                        );
                                        data = {
                                            data: resquery[0],
                                            status: true,
                                            msg: await helpers.convertToLang(
                                                req.translation[
                                                MsgConstants.DEVICE_ACTIV_SUCC
                                                ],
                                                "Device activated successfully"
                                            ) // Device activated successfully.
                                        };
                                        device_helpers.saveActionHistory(
                                            resquery[0],
                                            constants.DEVICE_ACTIVATED,
                                            verify.user
                                        );
                                        res.send(data);
                                    }
                                }
                            );
                        }
                    });
                } else {
                    if (gtres[0].expiry_date > formatted_dt) {
                        var sql1 =
                            "update usr_acc set account_status='' where device_id = '" +
                            device_id +
                            "'";

                        var rest = sql.query(sql1, async function (error, results) {
                            if (error) {
                                console.log(error);
                            }
                            if (results.affectedRows == 0) {
                                data = {
                                    status: false,
                                    msg: await helpers.convertToLang(
                                        req.translation[
                                        MsgConstants.DEVICE_NOT_ACTIV
                                        ],
                                        "Device not activated.Please try again"
                                    ) // Device not activated.Please try again."
                                };
                            } else {
                                sql.query(
                                    "select devices.*  ," +
                                    usr_acc_query_text +
                                    ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "' +
                                    device_id +
                                    '"',
                                    async function (error, resquery, fields) {
                                        if (error) {
                                            console.log(error);
                                        }
                                        console.log("lolo else", resquery[0]);

                                        if (resquery.length) {
                                            let pgp_emails = await device_helpers.getPgpEmails(resquery[0].id);
                                            let sim_ids = await device_helpers.getSimids(resquery[0].id);
                                            let chat_ids = await device_helpers.getChatids(resquery[0].id);
                                            resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                                            let servicesData = await device_helpers.getServicesData(resquery[0].id);
                                            let servicesIds = servicesData.map(item => { return item.id })
                                            let userAccServiceData = []
                                            let dataPlans = []
                                            if (servicesIds.length) {
                                                userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                                                dataPlans = await device_helpers.getDataPlans(servicesIds)
                                            }
                                            resquery[0].sim_id = "N/A"
                                            resquery[0].sim_id2 = "N/A"
                                            resquery[0].pgp_email = "N/A"
                                            resquery[0].chat_id = "N/A"
                                            // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                            //     resquery[0].pgp_email = pgp_emails[0].pgp_email
                                            // } else {
                                            //     resquery[0].pgp_email = "N/A"
                                            // }
                                            // if (sim_ids && sim_ids.length) {
                                            //     resquery[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                            //     resquery[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                            // }
                                            // if (chat_ids[0] && chat_ids[0].chat_id) {
                                            //     resquery[0].chat_id = chat_ids[0].chat_id
                                            // }
                                            // else {
                                            //     resquery[0].chat_id = "N/A"

                                            // }
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

                                            let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                            resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                                            let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                            resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]
                                            // if (servicesData[0]) {
                                            //     resquery[0].services = servicesData[0]
                                            // }
                                            // let loginHistoryData = await device_helpers.getLastLoginDetail(resquery[0].usr_device_id)
                                            // if (loginHistoryData[0] && loginHistoryData[0].created_at) {
                                            resquery[0].lastOnline = resquery[0].last_login ? resquery[0].last_login : "N/A"
                                            // } else {
                                            //     resquery[0].lastOnline = "N/A"
                                            // }
                                            let remainTermDays = "N/A"

                                            if (resquery[0].expiry_date !== null) {
                                                let startDate = moment(new Date())
                                                let expiray_date = new Date(resquery[0].expiry_date)
                                                let endDate = moment(expiray_date)
                                                remainTermDays = endDate.diff(startDate, 'days')
                                            }
                                            resquery[0].remainTermDays = remainTermDays
                                            // dealerData = await getDealerdata(res[i]);
                                            socket_helpers.sendDeviceStatus(sockets.baseIo,
                                                resquery[0].device_id,
                                                "active",
                                                true
                                            );
                                            data = {
                                                data: resquery[0],
                                                status: true,
                                                msg: await helpers.convertToLang(
                                                    req.translation[
                                                    MsgConstants
                                                        .DEVICE_ACTIV_SUCC
                                                    ],
                                                    "Device activated successfully"
                                                ) // Device activated successfully."
                                            };
                                            device_helpers.saveActionHistory(
                                                resquery[0],
                                                constants.DEVICE_ACTIVATED,
                                                verify.user
                                            );
                                            res.send(data);
                                        }
                                    }
                                );
                            }
                        });
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_NOT_ACTIV_EXP],
                                "Device cannnot be activated.It is expired already"
                            ) // Device cannnot be activated.It is expired already.
                        };
                        res.send(data);
                    }
                }
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(
                        req.translation[""],
                        "Unauthorized Access"
                    )
                };
                res.send(data);
            }

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.INVALID_DEVICE],
                    "Invalid Device"
                ) // Invalid Device."
            };
            res.send(data);
        }
    }
};
exports.wipeDevice = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    var device_id = req.params.id;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var deviceQuery = "select devices.*  ," +
            usr_acc_query_text +
            ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.reject_status = 0 AND devices.id= "' +
            device_id +
            '"';
        var resquery = await sql.query(deviceQuery);
        if (device_id && resquery.length) {
            if (verify.user.user_type === constants.ADMIN || verify.user.id === resquery[0].dealer_id || verify.user.id === resquery[0].prnt_dlr_id) {
                var sql1 = "INSERT INTO device_history (device_id,dealer_id,user_acc_id, type, action_by, dealer_type) VALUES ('" +
                    resquery[0].device_id +
                    "'," +
                    resquery[0].dealer_id +
                    "," +
                    resquery[0].id +
                    ", 'wipe', " + verify.user.id + ", '" + verify.user.user_type + "')";

                sql.query(sql1, async function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    if (results.affectedRows == 0) {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.DEVICE_NOT_WIPE],
                                "Device not wiped.Please try again"
                            ) // Device not wiped.Please try again.
                        };
                        res.send(data);
                    } else {
                        let wipe_device_date = await sql.query("SELECT created_at FROM device_history WHERE id= " + results.insertId)
                        let historyUpdate = "UPDATE device_history SET status=1 WHERE user_acc_id=" + resquery[0].id + " AND (type = 'push_apps' || type = 'pull_apps' || type = 'policy' || type = 'profile') AND created_at <= '" + wipe_device_date[0].created_at + "'";
                        await sql.query(historyUpdate);

                        if (resquery[0].online === constants.DEVICE_ONLINE) {
                            socket_helpers.sendDeviceStatus(sockets.baseIo,
                                resquery[0].device_id,
                                constants.DEVICE_WIPE
                            );
                            data = {
                                status: true,
                                online: true,
                                msg: await helpers.convertToLang(
                                    req.translation[""],
                                    "Device Wiped Susseccfully."
                                ),
                                content: ""
                            }
                            // Need to remove this code after APP TEAM release
                            var clearWipeDevice = "UPDATE device_history SET status=1 WHERE type='wipe' AND user_acc_id=" + resquery[0].id + "";
                            sql.query(clearWipeDevice)
                        } else {
                            data = {
                                status: true,
                                online: false,
                                msg: await helpers.convertToLang(
                                    req.translation[
                                    MsgConstants.WARNING_DEVICE_OFFLINE
                                    ],
                                    "Warning Device Offline"
                                ),
                                content: await helpers.convertToLang(
                                    req.translation[
                                    ""
                                    ],
                                    "Wipe command sent to device. Action will be performed when device is back online"
                                )
                            }
                        }
                        resquery[0].finalStatus = device_helpers.checkStatus(resquery[0]);
                        let servicesData = await device_helpers.getServicesData(resquery[0].id);
                        let servicesIds = servicesData.map(item => { return item.id })
                        let userAccServiceData = []
                        let dataPlans = []
                        if (servicesIds.length) {
                            userAccServiceData = await device_helpers.getUserAccServicesData(resquery[0].id, servicesIds)
                            dataPlans = await device_helpers.getDataPlans(servicesIds)
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
                        let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                        resquery[0].sim_id_data_plan = sim_id_data_plan[0]
                        let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                        resquery[0].sim_id2_data_plan = sim_id2_data_plan[0]

                        device_helpers.saveActionHistory(
                            resquery[0],
                            constants.DEVICE_WIPE,
                            verify.user
                        );

                        res.send(data);

                    }
                });
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(
                        req.translation[""],
                        "Unauthorized Access"
                    )
                };
                return res.send(data);
            }

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.INVALID_DEVICE],
                    "Invalid Device"
                ) // Invalid Device."
            };
            res.send(data);
        }
    }
};


/** Get Device Details of Dealers (Connect Page) **/
exports.connectDevice = async function (req, res) {

    // console.log('api check is caled')
    var verify = req.decoded; // await verifyToken(req, res);

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        if (req.params.device_id) {
            let device_id = req.params.device_id;
            let userId = verify.user.id;
            //  console.log(verify.user);
            let usertype = await helpers.getUserType(userId);

            let where = `devices.device_id = ?`;

            if (usertype != constants.ADMIN) {
                where =
                    where +
                    " and (usr_acc.dealer_id=" +
                    userId +
                    " OR usr_acc.prnt_dlr_id = " +
                    userId +
                    ")";
            }
            // console.log("select devices.*  ," + usr_acc_query_text + ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id left join dealers on dealers.dealer_id = usr_acc.dealer_id where " + where);
            await sql.query(`select devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON devices.id = usr_acc.device_id LEFT JOIN dealers ON dealers.dealer_id = usr_acc.dealer_id WHERE ${where}`, [device_id],
                async function (error, results) {
                    if (error) {
                        console.log(error);
                    }
                    // console.log('rslt done', results);
                    if (results.length == 0) {
                        _data = {
                            status: false,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.NO_DETAIL_FOUND],
                                "No details found"
                            ) // No details found
                        };
                    } else {
                        var query =
                            "select * from dealers where dealer_id =" +
                            results[0].dealer_id;
                        let dealer_details = await sql.query(query);

                        // let pgp_emails = await device_helpers.getPgpEmails(results[0].id);
                        // let sim_ids = await device_helpers.getSimids(results[0].id);
                        // let chat_ids = await device_helpers.getChatids(results[0].id);
                        results[0].finalStatus = device_helpers.checkStatus(results[0]);
                        let servicesData = await device_helpers.getServicesData(results[0].id);
                        let servicesIds = servicesData.map(item => { return item.id })
                        let userAccServiceData = []
                        let dataPlans = []
                        if (servicesIds.length) {
                            userAccServiceData = await device_helpers.getUserAccServicesData(results[0].id, servicesIds)
                            dataPlans = await device_helpers.getDataPlans(servicesIds)
                        }
                        results[0].sim_id = "N/A"
                        results[0].sim_id2 = "N/A"
                        results[0].pgp_email = "N/A"
                        results[0].chat_id = "N/A"
                        // let loginHistoryData = await device_helpers.getLastLoginDetail(results[0].usr_device_id)
                        // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                        //     results[0].pgp_email = pgp_emails[0].pgp_email
                        // } else {
                        //     results[0].pgp_email = "N/A"
                        // }
                        // if (sim_ids && sim_ids.length) {
                        //     results[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                        //     results[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                        // }
                        // if (chat_ids[0] && chat_ids[0].chat_id) {
                        //     results[0].chat_id = chat_ids[0].chat_id
                        // }
                        // else {
                        //     results[0].chat_id = "N/A"

                        // }
                        let services = servicesData;
                        let service_id = null
                        if (services && services.length) {
                            services.map((item) => {
                                if (item.status === 'extended') {
                                    results[0].extended_services = item
                                } else {
                                    results[0].services = item
                                    service_id = item.id
                                }
                            })
                        }

                        let productsData = userAccServiceData.filter(item => item.user_acc_id === results[0].id && item.service_id === service_id);
                        if (productsData && productsData.length) {
                            productsData.map((item) => {
                                if (item.type === 'sim_id') {
                                    results[0].sim_id = item.product_value
                                }
                                else if (item.type === 'sim_id2') {
                                    results[0].sim_id2 = item.product_value
                                }
                                else if (item.type === 'pgp_email') {
                                    results[0].pgp_email = item.product_value
                                }
                                else if (item.type === 'chat_id') {
                                    results[0].chat_id = item.product_value
                                }
                            })
                        }

                        let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                        results[0].sim_id_data_plan = sim_id_data_plan[0]
                        let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                        results[0].sim_id2_data_plan = sim_id2_data_plan[0]
                        // if (servicesData[0]) {
                        //     results[0].services = servicesData[0]
                        // }
                        // if (loginHistoryData[0] && loginHistoryData[0].created_at) {
                        results[0].lastOnline = results[0].last_login ? results[0].last_login : "N/A"
                        // } else {
                        //     results[0].lastOnline = "N/A"
                        // }
                        let device_data = results[0]
                        let startDate = moment(new Date())
                        let expiray_date = new Date(device_data.expiry_date)
                        let endDate = moment(expiray_date)
                        let remainTermDays = endDate.diff(startDate, 'days')
                        device_data.remainTermDays = remainTermDays

                        if (dealer_details.length) {
                            device_data.link_code = dealer_details[0].link_code;
                            device_data.dealer_name =
                                dealer_details[0].dealer_name;
                        } else {
                            device_data.link_code = 0;
                            device_data.dealer_name = "";
                        }

                        _data = {
                            status: true,
                            msg: await helpers.convertToLang(
                                req.translation[MsgConstants.SUCCESS],
                                "success"
                            ), // success
                            data: device_data
                        };
                    }

                    res.send(_data);
                }
            );
        } else {
            _data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.DEVICE_NOT_FOUND],
                    "No Device found"
                ) // Device not found
            };
        }
        res.send(_data);
    }
};

exports.getDeviceBillingHistory = async function (req, res) {

    let verify = req.decoded;

    if (verify) {

        let user_acc_id = req.params.user_acc_id;
        let dealer_id = req.params.dealer_id;
        sql.query(`SELECT * FROM financial_account_transections WHERE user_dvc_acc_id = ${user_acc_id} AND user_id = ${dealer_id} AND status != 'cancelled' AND status != 'holding'  ORDER BY id DESC`, function (err, result) {
            if (err) {
                console.log(err)
                let response = {
                    status: false,
                    data: [],
                };
                return res.send(response);
            }
            if (result) {
                let response = {
                    status: false,
                    data: result,
                };
                return res.send(response);
            }
        });
    }

};

exports.getAppsOfDevice = async function (req, res) {
    try {
        var verify = req.decoded; // await verifyToken(req, res);
        if (verify) {
            let deviceId = req.params.device_id;
            if (deviceId) {

                /**
                 * extension => application is extension or not
                 * visible => status either application should show in list or not
                 * default => default application can not be hidden for encrypted space
                 * system_app => system application cannot be pulled
                 */
                var getAppsQ = `SELECT user_apps.id, user_apps.device_id, user_apps.app_id, user_apps.guest, user_apps.encrypted, user_apps.enable, apps_info.label, apps_info.default_app, apps_info.system_app, apps_info.package_name, apps_info.visible, apps_info.unique_name as uniqueName, apps_info.icon as icon , apps_info.extension, apps_info.extension_id FROM user_apps LEFT JOIN apps_info ON (user_apps.app_id = apps_info.id) LEFT JOIN devices ON (user_apps.device_id=devices.id) WHERE devices.device_id = ?`;

                sql.query(getAppsQ, [deviceId], async (error, apps) => {
                    if (error) {
                        console.log("get application errors: ", error);
                        return res.send({
                            status: false,
                            msg: ''
                        });
                    }

                    let mainExtensions = [];

                    let extensions = [];
                    let onlyApps = [];

                    for (let app of apps) {

                        if (app.extension == 0 || (app.extension === 1 && app.extension_id == 0)) {
                            onlyApps.push(app);
                            if (app.extension === 1 && app.extension_id == 0) {
                                mainExtensions.push(app);
                            }
                        }
                    }

                    for (let app of apps) {

                        if (app.extension === 1 && app.extension_id !== 0) {
                            let ext = mainExtensions.find(mainExtension => mainExtension.app_id === app.extension_id);
                            if (ext) {
                                app.uniqueExtension = app.uniqueName;
                                app.uniqueName = ext.uniqueName;

                                extensions.push(app);
                            }
                        }
                    }

                    var systemPermissionQ = `SELECT * FROM user_app_permissions WHERE device_id =? LIMIT 1`;
                    //
                    sql.query(systemPermissionQ, [deviceId], async (error, controls) => {
                        if (error) {
                            console.log("Error:", error);

                        }

                        let cntrls = []
                        if (controls && controls.length > 0) {
                            cntrls = JSON.parse(controls[0].permissions);
                        }

                        return res.send({
                            status: true,
                            app_list: onlyApps,
                            controls: cntrls,
                            extensions: extensions
                        });
                    });
                    return;
                });
                return;
            } else {
                return res.send({
                    status: false,
                    msg: 'Device not found'
                })
            }
        }
    } catch (error) {
        console.error(error);
    }
};

exports.applySettings = async function (req, res) {
    console.log("applySettings ==========> ", req.body);
    try {
        var verify = req.decoded; // await verifyToken(req, res);
        // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
            let device_id = req.params.device_id;

            let usrAccId = req.body.usr_acc_id;

            let type = req.body.device_setting.type;

            let dealer_id = verify.user.id;

            let device_setting = req.body.device_setting;

            let app_list = device_setting.app_list === undefined ? "" : JSON.stringify(device_setting.app_list);

            let passwords = device_setting.passwords === undefined ? "" : JSON.stringify(device_setting.passwords);

            let controls = req.body.device_setting.controls == undefined ? "" : JSON.stringify(req.body.device_setting.controls);

            let subExtensions = req.body.device_setting.subExtensions == undefined ? "" : JSON.stringify(req.body.device_setting.subExtensions);

            let applyQuery = "";

            if (!type || type === "null" || type === "undefined") {
                type = "history";
            }

            if (type == "profile") {
                applyQuery = `INSERT INTO device_history (device_id, dealer_id, user_acc_id, profile_name, app_list, passwords, controls, permissions, type, action_by, dealer_type) VALUES ('${device_id}', ${dealer_id}, ${usrAccId}, '${device_setting.name}' , '${app_list}', '${passwords}', '${controls}', '${subExtensions}', 'profile', ${verify.user.id}, '${verify.user.user_type}')`;
            } else {
                applyQuery = `INSERT INTO device_history (device_id, dealer_id, user_acc_id, app_list, passwords, controls, permissions, type, action_by, dealer_type) VALUES ('${device_id}', ${dealer_id}, ${usrAccId}, '${app_list}', '${passwords}', '${controls}', '${subExtensions}', '${type}', ${verify.user.id}, '${verify.user.user_type}')`;
            }

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log("apply setting and profile query error: ", err);
                }


                if (rslts && rslts.insertId) {
                    let isOnline = await device_helpers.isDeviceOnline(device_id);

                    let permissions = subExtensions;

                    if (isOnline) {

                        socket_helpers.sendEmit(sockets.baseIo, rslts.insertId, app_list, passwords, controls, permissions, device_id);

                        if (type === "profile") {
                            data = {
                                status: true,
                                online: isOnline,
                                msg: await helpers.convertToLang(
                                    req.translation[
                                    MsgConstants
                                        .PROFILE_APPLIED_SUCCESSFULLY
                                    ],
                                    "Profile Applied Successfully"
                                ) // Profile Applied Successfully
                            };
                        } else {
                            data = {
                                status: true,
                                online: isOnline,
                                msg: await helpers.convertToLang(
                                    req.translation[
                                    MsgConstants
                                        .SETTINGS_APPLIED_SUCCESSFULLY
                                    ],
                                    "Settings Applied Successfully"
                                ) // Settings Applied Successfully',
                            };
                        }
                        return res.send(data);
                    } else {
                        if (type == "profile") {
                            data = {
                                status: true,
                                online: isOnline,
                                msg: await helpers.convertToLang(
                                    req.translation[MsgConstants.DUMY_ID],
                                    "Profile Applied to device. Action will be performed when device is back online"
                                ) // Profile Applied Successfully
                            };
                        } else {
                            data = {
                                status: true,
                                online: isOnline,
                                msg: await helpers.convertToLang(
                                    req.translation[MsgConstants.DUMY_ID],
                                    "Setting Applied to device. Action will be performed when device is back online"
                                ) // Settings Applied Successfully',
                            };
                        }
                        return res.send(data);
                    }
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(
                            req.translation[MsgConstants.ERROR_PROC],
                            "Error while Processing"
                        ) // Error while Processing',
                    };
                    return res.send(data);
                }
            });
            return;
        }
    } catch (error) {
        console.log(error);
    }
};

exports.applyPushApps = async function (req, res) {
    try {
        var verify = req.decoded; // await verifyToken(req, res);
        // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
            let device_id = req.params.device_id;

            let dealer_id = verify.user.id;

            let usrAccId = req.body.usrAccId;

            let push_apps = req.body.push_apps;
            let noOfApps = push_apps.length;

            let apps = push_apps === undefined ? "" : JSON.stringify(push_apps);

            var applyQuery =
                "INSERT INTO device_history (device_id,dealer_id,user_acc_id, push_apps, type, action_by, dealer_type) VALUES ('" +
                device_id +
                "'," +
                dealer_id +
                "," +
                usrAccId +
                ", '" +
                apps +
                "', 'push_apps', " + verify.user.id + ", '" + verify.user.user_type + "')";

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log(err);
                }
                if (rslts) {
                    let isOnline = await device_helpers.isDeviceOnline(device_id);
                    //job Queue query
                    var loadDeviceQ =
                        "INSERT INTO apps_queue_jobs (device_id,action,type,total_apps,is_in_process) " +
                        " VALUES ('" +
                        device_id +
                        "', 'push', 'push', " +
                        noOfApps +
                        " ,1)";
                    // var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                    await sql.query(loadDeviceQ);

                    if (isOnline) {
                        socket_helpers.applyPushApps(sockets.baseIo, rslts.insertId, apps, device_id);
                        data = {
                            status: true,
                            online: true,
                            noOfApps: noOfApps,
                            msg: await helpers.convertToLang(
                                req.translation[
                                MsgConstants.APPS_ARE_BEING_PUSHED
                                ],
                                "Apps are Being pushed"
                            ),
                            content: ""
                        };
                    } else {
                        socket_helpers.applyPushApps(sockets.baseIo, apps, device_id);
                        data = {
                            status: true,
                            noOfApps: noOfApps,
                            msg: await helpers.convertToLang(
                                req.translation[
                                MsgConstants.WARNING_DEVICE_OFFLINE
                                ],
                                "Warning Device Offline"
                            ),
                            content: await helpers.convertToLang(
                                req.translation[
                                MsgConstants
                                    .APPS_PUSHED_TO_DEVICE_ON_BACK_ONLINE
                                ],
                                "Apps pushed to device. Action will be performed when device is back online"
                            )
                        };
                    }
                    res.send(data);
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(
                            req.translation[MsgConstants.ERROR_PROC],
                            "Error while Processing"
                        ), // Error while Processing',
                        content: ""
                    };
                    res.send(data);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.applyPullApps = async function (req, res) {
    try {
        var verify = req.decoded;

        if (verify) {
            let device_id = req.params.device_id;

            let usrAccId = req.body.usrAccId;

            let dealer_id = verify.user.id;
            let pull_apps = req.body.pull_apps;
            console.log("pull_apps ", pull_apps)
            let noOfApps = pull_apps.length;

            let apps = pull_apps === undefined ? "" : JSON.stringify(pull_apps);

            var applyQuery = `INSERT INTO device_history (device_id,dealer_id,user_acc_id, pull_apps, type, action_by, dealer_type) VALUES ('${device_id}', ${dealer_id}, ${usrAccId}, '${apps}', 'pull_apps', ${verify.user.id}, '${verify.user.user_type}')`;

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log(err);
                }

                if (rslts) {
                    let isOnline = await device_helpers.isDeviceOnline(device_id);

                    var loadDeviceQ = `INSERT INTO apps_queue_jobs (device_id, action, type, total_apps, is_in_process)
						VALUES ('${device_id}', 'pull', 'pull', ${noOfApps}, 1)`;

                    await sql.query(loadDeviceQ);

                    if (isOnline) {
                        data = {
                            status: true,
                            online: true,
                            noOfApps: noOfApps,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.APPS_ARE_BEING_PULLED], "Apps are Being pulled"),
                            content: ""
                        };
                        socket_helpers.getPullApps(sockets.baseIo, rslts.insertId, apps, device_id);
                    } else {
                        data = {
                            status: true,
                            noOfApps: noOfApps,
                            msg: await helpers.convertToLang(
                                req.translation[
                                MsgConstants.WARNING_DEVICE_OFFLINE
                                ],
                                "Warning Device Offline"
                            ),
                            content: await helpers.convertToLang(
                                req.translation[
                                MsgConstants
                                    .APPS_PULLED_TO_DEVICE_ON_BACK_ONLINE
                                ],
                                "Apps pulled to device. Action will be performed when device is back online"
                            )
                        };
                    }

                    return res.send(data);
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(
                            req.translation[MsgConstants.ERROR_PROC],
                            "Error while Processing"
                        ), // Error while Processing',
                        content: ""
                    };
                    res.send(data);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};


exports.getAppJobQueueOfDevice = async function (req, res) {
    // console.log('api check is caled')
    var verify = req.decoded; // await verifyToken(req, res);

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
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.DEVICE_NOT_FOUND],
                    "No Device found"
                ) // Device not found"
            };
        }
        res.send(_data);
    }
};

exports.resyncDevice = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        let deviceId = req.body.device_id;
        if (!empty(deviceId)) {

            let getDeviceQ = `SELECT * FROM devices WHERE device_id = '${deviceId}' LIMIT 1`;

            sql.query(getDeviceQ, async function (error, device) {
                if (error) console.log(error);
                if (device.length) {
                    if (device[0].online === constants.DEVICE_ONLINE) {
                        socket_helpers.syncDevice(sockets.baseIo, deviceId);

                        // sync device on real time
                        // let updateSyncStatusQ = `UPDATE devices SET is_sync=0 WHERE device_id = '${deviceId}' `;
                        // await sql.query(updateSyncStatusQ);


                    } else {
                    }
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(
                            req.translation[MsgConstants.DEVICE_SYNC_SUCC],
                            "device synced successfully"
                        )
                    });
                    return;
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(
                            req.translation[MsgConstants.DEVICE_SYNC_SUCC],
                            "device not Synced"
                        ) // device synced successfully
                    });
                    return;
                }
            });
        }
    }
};

exports.deleteUnlinkDevice = async function (req, res) {
    try {
        var verify = req.decoded // await verifyToken(req, res);

        if (verify) {

            let deleteError = 0;
            let NotDeleted = [];
            let deletedDevices = [];
            let action = req.body.action
            let dealer_credits = 0
            if (action === 'pre-active') {
                let user_creditsQ = "SELECT * FROM financial_account_balance WHERE dealer_id=" + verify.user.dealer_id;
                let user_creditsRes = await sql.query(user_creditsQ);
                if (user_creditsRes.length) {
                    dealer_credits = dealer_credits + user_creditsRes[0].credits
                }
            }
            let refundedCredits = Number(dealer_credits);

            if (req.body.devices.length) {
                if (action === 'unlink') {
                    for (let device of req.body.devices) {
                        // console.log(req.body.devices.length);
                        // let deleteq = "UPDATE acc_action_history SET del_status='1' WHERE id='" + device.id + "' AND dealer_id = '" + verify.user.id + "' AND action = 'UNLINKED'";
                        // // console.log('query is ', deleteq)
                        // let resp = await sql.query(deleteq)
                        // if (resp.affectedRows) {
                        let updateResp = await sql.query(`UPDATE usr_acc SET del_status = '1' WHERE id = ${device.user_acc_id} AND unlink_status = 1`)
                        if (updateResp.affectedRows) {
                            deletedDevices.push(device.id);
                        } else {
                            deleteError += 1;
                            NotDeleted.push(device.id)
                        }
                    }
                    if (deleteError === 0) {
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_DEL_SUCC], "Device deleted successfully"), // Deleted Successfully',
                            data: deletedDevices,
                        }
                        res.send(data);
                        return
                    }
                    else {
                        data = {
                            'status': false,
                            'msg': NotDeleted.toString() + await helpers.convertToLang(req.translation[MsgConstants.NOT_DELETE], "Not Deleted, Try Again!"),
                        }
                        res.send(data);
                        return
                    }
                } else {
                    let dealer_profit = 0
                    let admin_profit = 0
                    let dealer_hardware_profit = 0
                    let admin_hardware_profit = 0
                    let admin_data = await sql.query("SELECT * from dealers WHERE type = 1")
                    let deletedDemos = 0
                    for (let device of req.body.devices) {
                        let statusChangeQuery = "UPDATE usr_acc SET del_status='" + 1 + "' WHERE device_id='" + device.usr_device_id + "'";
                        let resp = await sql.query(statusChangeQuery)
                        if (resp.affectedRows) {
                            if (device.expiry_months == 0) {
                                deletedDemos++
                            }
                            await sql.query("UPDATE pgp_emails set user_acc_id = null , used = 0 , start_date = null where pgp_email ='" + device.pgp_email + "'")
                            await sql.query("UPDATE chat_ids set user_acc_id = null , used = 0 , start_date = null where chat_id ='" + device.chat_id + "'")
                            await sql.query("UPDATE sim_ids set user_acc_id = null , used = 0 , start_date = null , delete_status = 1 where sim_id ='" + device.sim_id + "' OR sim_id ='" + device.sim_id2 + "'")
                            let deleteHistoryQuery = "UPDATE acc_action_history SET del_status='1' WHERE user_acc_id='" + device.id + "' AND dealer_id = '" + verify.user.id + "' AND action = 'PRE-ACTIVATED'";
                            await sql.query(deleteHistoryQuery)
                            deletedDevices.push(device.id);
                            let user_acc_id = device.id
                            let getBillingPkgs = "select * from services_data where user_acc_id = " + user_acc_id + " AND status = 'active'"
                            let bills = await sql.query(getBillingPkgs);
                            let getHardwares = "select * from hardwares_data where user_acc_id = " + user_acc_id + " AND status = 'delivered'"
                            let hardwaresData = await sql.query(getHardwares);
                            let packages = []
                            let products = []
                            let hardwares = []
                            if (bills.length) {
                                packages = JSON.parse(bills[0].packages)
                                products = JSON.parse(bills[0].products)

                                let currentDate = moment().format("YYYY/MM/DD");
                                let updateBilling = "UPDATE services_data set status = 'deleted' ,paid_credits = 0 , end_date = '" + currentDate + "' WHERE user_acc_id = " + user_acc_id;
                                await sql.query(updateBilling);

                                sql.query("UPDATE sim_data_plans set status = 'deleted' WHERE service_id = " + bills[0].id);

                                let updateSeviceSaleQuery = `UPDATE services_sale SET status = 'cancelled' WHERE user_acc_id = ${user_acc_id} AND service_data_id = ${bills[0].id}`
                                sql.query(updateSeviceSaleQuery)

                                let services_transection_record = "SELECT * from financial_account_transections where user_dvc_acc_id = " + user_acc_id + " AND user_id = '" + verify.user.id + "' AND type = 'services' ORDER BY id DESC LIMIT 1"
                                let services_transection_record_data = await sql.query(services_transection_record)
                                if (services_transection_record_data.length) {
                                    if (services_transection_record_data[0] && services_transection_record_data[0].status === 'pending') {
                                        let update_transection = "UPDATE financial_account_transections SET status = 'cancelled' WHERE id = " + services_transection_record_data[0].id
                                        await sql.query(update_transection)
                                        let update_profits_transections = "UPDATE financial_account_transections SET status = 'cancelled' WHERE user_dvc_acc_id = " + user_acc_id + " AND status = 'holding' AND type = 'services'"
                                        await sql.query(update_profits_transections)
                                        // let updateCredits = "UPDATE financial_account_balance set credits = credits + " + Number(bills[0].total_credits) + " WHERE dealer_id = " + verify.user.dealer_id
                                        // await sql.query(updateCredits);
                                        refundedCredits = refundedCredits + Number(services_transection_record_data[0].credits);
                                    }
                                    else {
                                        refundedCredits = refundedCredits + Number(services_transection_record_data[0] ? services_transection_record_data[0].credits : 0);
                                        let dealer_profit_query = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data ,credits , transection_type , type) VALUES (${verify.user.id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}', ${bills[0].total_credits} ,'debit' , 'services')`
                                        await sql.query(dealer_profit_query);
                                        if (device.expiry_months != 0) {
                                            let profits = await helpers.calculateProfitLoss(packages, products, verify.user.user_type)
                                            dealer_profit = profits.dealer_profit - Math.ceil((profits.dealer_profit * 0.03))
                                            admin_profit = profits.admin_profit - Math.ceil((profits.admin_profit * 0.03))
                                        }
                                    }
                                }
                            }

                            if (hardwaresData.length) {
                                let updateHardwareData = "UPDATE hardwares_data set status = 'returned' WHERE user_acc_id = " + user_acc_id;
                                await sql.query(updateHardwareData);
                                hardwares = hardwaresData[0].hardwares
                                let total_hardware_credits = 0
                                hardwares = []
                                hardwaresData.map((hardware) => {
                                    hardwares.push(JSON.parse(hardware.hardware_data))
                                    total_hardware_credits += Number(hardware.total_credits)
                                })

                                let hardware_transection_record = "SELECT * from financial_account_transections where user_dvc_acc_id = " + user_acc_id + " AND user_id = '" + verify.user.id + "' AND type = 'hardwares' ORDER BY id DESC LIMIT 1"
                                let hardware_transection_record_data = await sql.query(hardware_transection_record)
                                if (hardware_transection_record_data.length) {
                                    if (hardware_transection_record_data[0] && hardware_transection_record_data[0].status === 'pending') {
                                        let update_transection = "UPDATE financial_account_transections SET status = 'cancelled' WHERE id = " + hardware_transection_record_data[0].id
                                        await sql.query(update_transection)
                                        let update_profits_transections = "UPDATE financial_account_transections SET status = 'cancelled' WHERE user_dvc_acc_id = " + user_acc_id + " AND status = 'holding' AND type = 'hardwares'"
                                        await sql.query(update_profits_transections)
                                        // let updateCredits = "UPDATE financial_account_balance set credits = credits + " + Number(hardware_transection_record_data[0].credits) + " WHERE dealer_id = " + verify.user.dealer_id
                                        // await sql.query(updateCredits);
                                        refundedCredits = refundedCredits + Number(hardware_transection_record_data[0].credits);
                                    } else {
                                        refundedCredits = refundedCredits + Number(hardware_transection_record_data[0].credits);
                                        let dealer_profit_query = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data ,credits , transection_type , type) VALUES (${verify.user.id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}', ${total_hardware_credits} ,'debit' , 'hardwares')`
                                        await sql.query(dealer_profit_query);

                                        let profits = await helpers.calculateHardwareProfitLoss(hardwares, verify.user.user_type)
                                        dealer_hardware_profit = profits.dealer_profit - Math.ceil((profits.dealer_profit * 0.03))
                                        admin_hardware_profit = profits.admin_profit - Math.ceil((profits.admin_profit * 0.03))

                                    }
                                }
                            }


                            if (admin_profit !== 0) {
                                let type = ""
                                if (admin_profit > 0) {
                                    type = "credit"
                                }
                                if (admin_profit < 0) {
                                    type = "debit"
                                }
                                let admin_profit_query = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data ,credits , transection_type , type) VALUES (${admin_data[0].dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}', ${admin_profit} ,'${type}' , 'services')`
                                let profit_result = await sql.query(admin_profit_query);
                                if (profit_result.insertId) {
                                    await sql.query(`UPDATE financial_account_balance SET credits = credits - ${Number(admin_profit)} WHERE dealer_id = ${admin_data[0].dealer_id}`)
                                }
                            }
                            if (verify.user.user_type === constants.SDEALER && dealer_profit !== 0) {
                                let type = ""
                                if (dealer_profit > 0) {
                                    type = "credit"
                                }
                                if (dealer_profit < 0) {
                                    type = "debit"
                                }
                                let dealer_profit_query = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data ,credits , transection_type , type) VALUES (${admin_data[0].dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}', ${dealer_profit} ,'${type}' , 'services')`
                                let profit_result = await sql.query(dealer_profit_query);
                                if (profit_result.insertId) {
                                    await sql.query(`UPDATE financial_account_balance SET credits = credits - ${Number(dealer_profit)} WHERE dealer_id = ${verify.user.connected_dealer}`)
                                }
                            }
                            if (admin_hardware_profit !== 0) {
                                let type = ""
                                if (admin_hardware_profit > 0) {
                                    type = "credit"
                                }
                                if (admin_hardware_profit < 0) {
                                    type = "debit"
                                }
                                let admin_profit_query = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data ,credits , transection_type , type) VALUES (${admin_data[0].dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}', ${admin_hardware_profit} ,'${type}' , 'services')`
                                let profit_result = await sql.query(admin_profit_query);
                                if (profit_result.insertId) {
                                    await sql.query(`UPDATE financial_account_balance SET credits = credits - ${Number(admin_hardware_profit)} WHERE dealer_id = ${admin_data[0].dealer_id}`)
                                }
                            }
                            if (verify.user.user_type === constants.SDEALER && dealer_hardware_profit !== 0) {
                                let type = ""
                                if (dealer_hardware_profit > 0) {
                                    type = "credit"
                                }
                                if (dealer_hardware_profit < 0) {
                                    type = "debit"
                                }
                                let dealer_profit_query = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data ,credits , transection_type , type) VALUES (${admin_data[0].dealer_id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id })}', ${dealer_profit} ,'${type}' , 'services')`
                                let profit_result = await sql.query(dealer_profit_query);
                                if (profit_result.insertId) {
                                    await sql.query(`UPDATE financial_account_balance SET credits = credits - ${Number(dealer_hardware_profit)} WHERE dealer_id = ${verify.user.connected_dealer}`)
                                }
                            }
                        }
                        else {
                            deleteError += 1;
                            NotDeleted.push(device.device_id)
                        }
                    }
                    if (refundedCredits !== 0) {
                        let updateCredits = "UPDATE financial_account_balance set credits = " + Number(refundedCredits) + " WHERE dealer_id = " + verify.user.dealer_id
                        await sql.query(updateCredits);
                    }

                    if (deletedDemos > 0) {
                        sql.query(`UPDATE dealers SET remaining_demos = remaining_demos + ${deletedDemos} WHERE dealer_id = ${verify.user.dealer_id}`)
                    }
                    if (deleteError === 0) {
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DEVICE_DEL_SUCC], "Device deleted successfully"), // Deleted Successfully',
                            data: deletedDevices,
                            credits: refundedCredits
                        }
                        res.send(data);
                        return
                    }
                    else {
                        data = {
                            'status': false,
                            'msg': NotDeleted.toString() + await helpers.convertToLang(req.translation[MsgConstants.NOT_DELETE], "Not Deleted, Try Again!"),
                        }
                        res.send(data);
                        return
                    }
                }
            } else {
                data = {
                    'status': false,
                    'msg': NotDeleted.toString() + await helpers.convertToLang(req.translation[""], "No record found. Please try again."),
                }
                res.send(data);
                return
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}

exports.getDeviceHistory = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(
            req.body.device_id
        );

        let where = " WHERE ";

        if (
            user_acc_id != undefined &&
            user_acc_id != "" &&
            user_acc_id != null
        ) {
            where = where + " user_acc_id='" + user_acc_id + "'";

            let query = "SELECT * FROM device_history " + where;
            sql.query(query, async function (error, result) {
                data = {
                    status: true,
                    msg: await helpers.convertToLang(
                        req.translation[MsgConstants.SUCCESS],
                        "success"
                    ), // successful',
                    profiles: result
                };
                res.send(data);
            });
        } else {
            where = "";
            data = {
                status: false,
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.INVALID_USER],
                    "Invalid User"
                ) // Invalid User'
            };
            res.send(data);
        }
    }
};

exports.writeIMEI = async function (req, res) {
    try {
        var verify = req.decoded; // await verifyToken(req, res);

        if (verify) {
            let device_id = req.params.device_id;
            let usrAccId = req.body.usrAccId;
            let dealer_id = verify.user.id;
            let type = req.body.type;
            let imeiNo = req.body.imeiNo;
            let device = req.body.device;

            let imei = await device_helpers.checkvalidImei(imeiNo);
            if (imei) {
                let imei1 = type == "IMEI1" ? imeiNo : null;
                let imei2 = type == "IMEI2" ? imeiNo : null;

                let query =
                    "SELECT * from device_history WHERE user_acc_id = '" +
                    usrAccId +
                    "' AND type = 'imei' AND status = 0 order by created_at desc limit 1";

                let result = await sql.query(query);
                if (result.length) {
                    let prevImei = JSON.parse(result[0].imei);
                    // console.log(prevImei);
                    if (type == "IMEI1") {
                        prevImei.imei1 = imei1;
                    } else {
                        prevImei.imei2 = imei2;
                    }
                    let newImei = JSON.stringify(prevImei);
                    sql.query(
                        "INSERT INTO device_history (device_id,dealer_id,user_acc_id, imei, type, action_by, dealer_type) VALUES ('" +
                        device_id +
                        "'," +
                        dealer_id +
                        "," +
                        usrAccId +
                        ", '" +
                        newImei +
                        "', 'imei', " + verify.user.id + ", '" + verify.user.user_type + "')",
                        async function (err, results) {
                            if (err) {
                                console.log(err);
                            }

                            if (results.affectedRows) {
                                var loadDeviceQ =
                                    "UPDATE devices set is_push_apps=1 WHERE device_id='" +
                                    device_id +
                                    "'";
                                await sql.query(loadDeviceQ);
                                let isOnline = await device_helpers.isDeviceOnline(device_id);
                                if (isOnline) {
                                    socket_helpers.writeImei(sockets.baseIo, results.insertId, newImei, device_id);
                                    data = {
                                        status: true,
                                        online: true,
                                        // 'insertedData': insertedData
                                        title1: await helpers.convertToLang(
                                            req.translation[
                                            MsgConstants
                                                .SUCCESSFULLY_WRITTEN_TO
                                            ],
                                            " successfully written to "
                                        ),
                                        title2: await helpers.convertToLang(
                                            req.translation[
                                            MsgConstants
                                                .RESTART_DEVICE_REQUIRED_TO_APPLY_IMEI
                                            ],
                                            " on Device. Restart device is required to apply IMEI."
                                        )
                                    };
                                    res.send(data);
                                } else {
                                    data = {
                                        status: true,
                                        // 'insertedData': insertedData
                                        title1: await helpers.convertToLang(
                                            req.translation[
                                            MsgConstants.WRITE_TO
                                            ],
                                            " write to "
                                        ),
                                        title2: await helpers.convertToLang(
                                            req.translation[
                                            MsgConstants
                                                .ACTION_PERFORMED_ON_BACK_ONLINE
                                            ],
                                            ". Action will be performed when device is back online"
                                        )
                                    };
                                    res.send(data);
                                }
                            } else {
                                data = {
                                    status: false,
                                    msg: await helpers.convertToLang(
                                        req.translation[
                                        MsgConstants.ERROR_PROC
                                        ],
                                        "Error while Processing"
                                    ) // Error while Processing',
                                };
                                res.send(data);
                            }
                        }
                    );
                } else {
                    let imei = {
                        imei1: imei1,
                        imei2: imei2
                    };
                    let newImei = JSON.stringify(imei);
                    var applyQuery =
                        "INSERT INTO device_history (device_id,dealer_id,user_acc_id, imei, type, action_by, dealer_type) VALUES ('" +
                        device_id +
                        "'," +
                        dealer_id +
                        "," +
                        usrAccId +
                        ", '" +
                        newImei +
                        "', 'imei', " + verify.user.id + ", '" + verify.user.user_type + "')";

                    sql.query(applyQuery, async function (err, rslts) {
                        if (err) {
                            console.log(err);
                        }

                        if (rslts) {
                            // var applyPushQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                            // await sql.query(applyPushQ)
                            let isOnline = await device_helpers.isDeviceOnline(device_id);
                            if (isOnline) {
                                socket_helpers.writeImei(sockets.baseIo, rslts.insertId, newImei, device_id);
                                data = {
                                    status: true,
                                    online: true,
                                    // 'insertedData': insertedData
                                    title1: await helpers.convertToLang(
                                        req.translation[
                                        MsgConstants
                                            .SUCCESSFULLY_WRITTEN_TO
                                        ],
                                        " successfully written to "
                                    ),
                                    title2: await helpers.convertToLang(
                                        req.translation[
                                        MsgConstants
                                            .RESTART_DEVICE_REQUIRED_TO_APPLY_IMEI
                                        ],
                                        " on Device. Restart device is required to apply IMEI."
                                    )
                                };
                                res.send(data);
                            } else {
                                data = {
                                    status: true,
                                    online: false,
                                    // 'insertedData': insertedData
                                    title1: await helpers.convertToLang(
                                        req.translation[
                                        MsgConstants.WRITE_TO
                                        ],
                                        " write to "
                                    ),
                                    title2: await helpers.convertToLang(
                                        req.translation[
                                        MsgConstants
                                            .ACTION_PERFORMED_ON_BACK_ONLINE
                                        ],
                                        ". Action will be performed when device is back online"
                                    )
                                };
                                res.send(data);
                            }
                        } else {
                            data = {
                                status: false,
                                msg: await helpers.convertToLang(
                                    req.translation[MsgConstants.ERROR_PROC],
                                    "Error while Processing"
                                ) // Error while Processing',
                            };
                            res.send(data);
                        }
                    });
                }
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(
                        req.translation[MsgConstants.INVALID_IMEI_NUMBER],
                        "Invalid IMEI number, please make sure you are using a valid IMEI number and try again"
                    ) // Invalid IMEI number, please make sure you are using a valid IMEI number and try again",
                };
                res.send(data);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

exports.submitDevicePassword = async function (req, res) {
    try {
        var verify = req.decoded; // await verifyToken(req, res);
        // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
            let pwdObject = { "admin_password": null, "guest_password": null, "encrypted_password": null, "duress_password": null }
            console.log(req.body, 'params are')
            let password = req.body.passwords.pwd;
            let pwdType = req.body.pwdType;
            let dealer_id = verify.user.id;
            let device_id = req.body.device_id;
            let usrAccId = req.body.usr_acc_id;

            // console.log(pwdType, 'pwdtype')
            if (pwdType) {
                pwdObject[pwdType] = password;
            }

            pwdObject = JSON.stringify(pwdObject);

            console.log(pwdObject)

            applyQuery = `INSERT INTO device_history (device_id, dealer_id, user_acc_id, passwords, type, action_by, dealer_type) VALUES ('${device_id}', ${dealer_id}, ${usrAccId}, '${pwdObject}', 'password', ${verify.user.id}, '${verify.user.user_type}')`;

            sql.query(applyQuery, async function (err, rslts) {
                if (err) {
                    console.log("apply setting and profile query error: ", err);
                }

                if (rslts && rslts.insertId) {
                    let isOnline = await device_helpers.isDeviceOnline(device_id);

                    if (isOnline) {
                        let updateAppliedSettings = `UPDATE device_history SET status=1 WHERE device_id='${device_id}' AND type='password'`;
                        await sql.query(updateAppliedSettings);

                        socket_helpers.sendEmit(sockets.baseIo, null, '', pwdObject, '', '', device_id);
                        // socket_helpers.sendEmit(sockets.baseIo, app_list, passwords, controls, permissions, device_id);

                        data = {
                            status: true,
                            online: isOnline,
                            msg: pwdType == 'duress_password' ? "Password Reset Successfully" : "Password Set Successfully"
                            // msg: await helpers.convertToLang(
                            //     req.translation[
                            //     MsgConstants
                            //         .SETTINGS_APPLIED_SUCCESSFULLY
                            //     ],
                            //     "Settings Applied Successfully"
                            // ) // Settings Applied Successfully',
                        };
                        res.send(data);
                        return;
                    } else {
                        data = {
                            status: true,
                            online: isOnline,
                            msg: pwdType == 'duress_password' ? "Password Reset Successfully.  Action will be performed when device is back online" : "Password set Successfully.  Action will be performed when device is back online"
                            // msg: await helpers.convertToLang(
                            //     req.translation[
                            //     MsgConstants
                            //         .SETTINGS_APPLIED_SUCCESSFULLY
                            //     ],
                            //     "Settings Applied Successfully"
                            // ) // Settings Applied Successfully',
                        };
                        res.send(data);
                        return;
                    }
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getActivities = async function (req, res) {
    try {
        var verify = req.decoded; // await verifyToken(req, res);

        if (verify) {
            let device_id = req.params.device_id;
            let activities = [];
            let usrAccId = await device_helpers.getUserAccByDeviceId(device_id);
            // 'DELETE','SUSPENDED','UNLINKED','EXPIRED','ACTIVE','FLAGGED','UNFLAGGED','TRANSFER','Pre-activated','wiped'
            let acc_action_query =
                "SELECT * FROM acc_action_history WHERE device_id = '" +
                device_id +
                "'";
            let accResults = await sql.query(acc_action_query);
            let device_history_query =
                "SELECT * FROM device_history WHERE user_acc_id = '" +
                usrAccId.id +
                "'";
            let deviceResults = await sql.query(device_history_query);

            let action;
            for (let i = 0; i < accResults.length; i++) {
                if (
                    accResults[i].action ==
                    constants.DEVICE_PENDING_ACTIVATION ||
                    accResults[i].action == constants.DEVICE_PRE_ACTIVATION ||
                    accResults[i].action === constants.DEVICE_EXPIRED ||
                    accResults[i].action === constants.DEVICE_WIPE ||
                    accResults[i].action == "DELETE"
                ) {
                    continue;
                } else {
                    let actionBy = 'N/A';
                    if (accResults[i].dealer_type === 'admin') {
                        actionBy = 'ADMIN';
                    } else {
                        if (accResults[i].action_by) {
                            let actionByDealerDetail = await helpers.getDealerByDealerId(accResults[i].action_by);
                            if (actionByDealerDetail.length) {
                                actionBy = actionByDealerDetail[0].dealer_name;
                            }
                        }
                    }

                    action = {
                        action_name: await helpers.getActivityName(
                            accResults[i].action
                        ),
                        created_at: accResults[i].created_at,
                        action_by: actionBy,
                    };
                    activities.push(action);
                }
            }
            for (let i = 0; i < deviceResults.length; i++) {

                let actionBy = 'N/A';
                if (deviceResults[i].dealer_type === 'admin') {
                    actionBy = 'ADMIN';
                } else {
                    if (deviceResults[i].action_by) {
                        let actionByDealerDetail = await helpers.getDealerByDealerId(deviceResults[i].action_by);
                        if (actionByDealerDetail.length) {
                            actionBy = actionByDealerDetail[0].dealer_name;
                        }
                    }
                }

                action = {
                    action_name: await helpers.getActivityName(
                        deviceResults[i].type
                    ),
                    data: deviceResults[i],
                    created_at: deviceResults[i].created_at,
                    action_by: actionBy,
                };
                activities.push(action);
            }
            // console.log(activities);
            data = {
                status: true,
                data: activities
            };
            res.send(data);
        }
    } catch (error) {
        console.log(error);
    }
};

exports.getIMEI_History = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let query =
            "select * from imei_history where device_id = '" +
            req.params.device_id +
            "'";
        sql.query(query, async function (error, resp) {
            res.send({
                status: true,
                msg: await helpers.convertToLang(
                    req.translation[MsgConstants.SUCCESS],
                    "success"
                ), // "data success",
                data: resp
            });
        });
    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(
                req.translation[MsgConstants.ACCESS_FORBIDDEN],
                "access forbidden"
            ) // "access forbidden"
        });
    }
};

/**
 * Update device IDs
 * Update device IDs of all existing devices
 * http://localhost:3000/users/devices/update_device_ids
 * one time useage - menual end point
 *
 *
 * By Muhammad Irfan Afzal - mi3afzal
 * 01-08-2019
 * **/
exports.updateDeviceIDs = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if (!verify) {
        data = {
            status: false,
            data: ["Bad Request"]
        };
        res.status(400).send(data);
        return;
    }

    sql.query(
        `SELECT * FROM devices WHERE device_id IS NOT NULL ORDER BY id ASC`,
        async function (error, results, fields) {
            if (error) throw error;

            await sql.query(`TRUNCATE apps_queue_jobs`);
            await sql.query(`TRUNCATE policy_queue_jobs`);

            output = [];
            for (var i = 0; i < results.length; i++) {
                const oldDeviceID = results[i].device_id;
                const newDeviceID = helpers.replaceAt(
                    oldDeviceID,
                    app_constants.DEVICE_ID_SYSTEM_LETTER_INDEX,
                    app_constants.DEVICE_ID_SYSTEM_LETTER
                );

                if (oldDeviceID != newDeviceID) {
                    await sql.query(
                        `UPDATE devices SET device_id = '${newDeviceID}' WHERE id = ${
                        results[i].id
                        } `
                    );
                    await sql.query(
                        `UPDATE acc_action_history SET device_id = '${newDeviceID}' WHERE device_id = '${oldDeviceID}' `
                    );
                    await sql.query(
                        `UPDATE device_history SET device_id = '${newDeviceID}' WHERE device_id = '${oldDeviceID}' `
                    );
                    await sql.query(
                        `UPDATE imei_history SET device_id = '${newDeviceID}' WHERE device_id = '${oldDeviceID}' `
                    );
                    await sql.query(
                        `UPDATE login_history SET device_id = '${newDeviceID}' WHERE device_id = '${oldDeviceID}' `
                    );
                }

                output[i] = [oldDeviceID, newDeviceID];
            }

            data = {
                status: true,
                data: ["Data Updated", output]
            };
            res.status(200).send(data);
            return;
        }
    );
};


exports.resetChatPin = async function (req, res) {
    let verify = req.decoded;

    if (verify) {

        let chat_id = req.body.chat_id;
        let pin = req.body.pin;

        pin = await device_helpers.encryptData(pin);
        chat_id = await device_helpers.encryptData(chat_id);

        axios.get('https://signal.lockmesh.com/v1/accounts/pin/reset?chat_id=' + chat_id + '&registration_pin=' + pin).then((response) => {

            if (response.status == 200) {
                res.status(200).send({
                    msg: "Registration Pin successfully reset",
                    status: true
                });
            } else if (response.status == 201) {
                res.status(200).send({
                    msg: "Registration Pin is invalid",
                    status: false
                });
            } else if (response.status == 202) {
                res.status(200).send({
                    msg: "Registration Pin is not set on this account",
                    status: false
                });
            } else if (response.status == 203) {
                res.status(200).send({
                    msg: "No account is registered with this chat ID",
                    status: false
                });
            } else if (response.status == 404) {
                res.status(200).send({
                    msg: "Not Found",
                    status: false
                });
            } else if (response.status == 401) {
                res.status(200).send({
                    msg: "Chat ID or Registration Pin is not provided",
                    status: false
                });
            } else if (response.status == 402) {
                res.status(200).send({
                    msg: "No account is registered with this chat ID",
                    status: false
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

};

exports.changeSchatPinStatus = async function (req, res) {
    let verify = req.decoded;

    if (verify) {


        let chat_id = req.body.chat_id;

        chat_id = await device_helpers.encryptData(chat_id);
        var type = '';

        let URL = '';
        if (req.body.type === 'disable') {
            type = 'disabled';
            URL = 'https://signal.lockmesh.com/v1/accounts/pin/disable?chat_id=' + chat_id;
        } else {
            type = 'enabled';
            URL = 'https://signal.lockmesh.com/v1/accounts/pin/enable?chat_id=' + chat_id;
        }


        axios.get(URL).then((response) => {

            if (response.status == 200) {
                res.status(200).send({
                    msg: "Registration Pin successfully " + type,
                    status: true
                });
            } else if (response.status == 202) {
                res.status(200).send({
                    msg: "Registration Pin is not set on this account",
                    status: false
                });
            } else if (response.status == 203) {
                res.status(200).send({
                    msg: "No account is registered with this chat ID",
                    status: false
                });
            } else if (response.status == 404) {
                res.status(200).send({
                    msg: "Not Found",
                    status: false
                });
            } else if (response.status == 401) {
                res.status(200).send({
                    msg: "Chat ID is not provided",
                    status: false
                });
            } else if (response.status == 402) {
                res.status(200).send({
                    msg: "Authentication failed",
                    status: false
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

};