

const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
const constants = require('../../constants/Application');
const moment = require('moment');
// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"
let usr_acc_query_text = constants.usr_acc_query_text;

exports.acceptRequest = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let id = req.params.id
            let query = "SELECT * from credit_requests where id = ? and  status = '0'"
            // console.log(query);
            sql.query(query, [id], async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    let logginUserCredits = await sql.query("select credits from financial_account_balance where dealer_id = ?", [verify.user.id])
                    if (logginUserCredits.length) {
                        if (logginUserCredits[0].credits > result[0].credits) {
                            let dealer_id = result[0].dealer_id
                            let newCredit = result[0].credits
                            let deductedCredits = logginUserCredits[0].credits - result[0].credits
                            let credits = await sql.query("select * from financial_account_balance where dealer_id = ?",  [dealer_id]);
                            // console.log(resul);
                            if (credits.length) {
                                newCredit = credits[0].credits + result[0].credits
                            }
                            sql.query("update financial_account_balance set credits = ? where dealer_id = ?" + [newCredit, dealer_id], async function (err, reslt) {
                                if (err) {
                                    console.log(err);
                                }
                                if (reslt && reslt.affectedRows > 0) {
                                    let updateQuery = "update credit_requests set status = 1 where id= ?"
                                    await sql.query(updateQuery, [id]);
                                    let userCredits = "update financial_account_balance set credits = ? where dealer_id = ?";
                                    await sql.query(userCredits, [deductedCredits, verify.user.id])
                                    res.send({
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully.",
                                        user_credits: deductedCredits
                                    })
                                    return
                                }
                                else {
                                    let query = `INSERT into financial_account_balance (dealer_id,credits) VALUES (?, ?)`;
                                    sql.query(query, [dealer_id, newCredit], async function (err, reslt) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (reslt && reslt.affectedRows > 0) {
                                            let updateQuery = "update credit_requests set status = 1 where id= ?"
                                            await sql.query(updateQuery, [id])
                                            let userCredits = "update financial_account_balance set credits = ? where dealer_id = ?";
                                            await sql.query(userCredits, [newCredit, verify.user.id])
                                            res.send({
                                                status: true,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully.",
                                                user_credits: deductedCredits
                                            })
                                            return
                                        }
                                        else {
                                            res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_UPDATED], "Credits not updated please try again"), // "Credits not updated please try again."
                                            })
                                            returns

                                        }
                                    })
                                }
                            })
                        }
                        else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_ENOUGH_ACCEPT_REQUEST], "Your credits are not enough to accept a request"), // "Your credits are not enough to accept a request."
                            })
                            return
                        }
                    } else {
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_ENOUGH_ACCEPT_REQUEST], "Your credits are not enough to accept a request"), // "Your credits are not enough to accept a request."
                        })
                        return
                    }
                } else {
                    data = {
                        "status": false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_IS_ALREADY_DELETED], "Request is already deleted"), // "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

exports.acceptServiceRequest = async function (req, res) {
    // console.log(req.body);
    // return res.send({
    //     status: false,
    //     msg: ''
    // });
    var verify = req.decoded; // await verifyToken(req, res);
    if(verify.user.user_type !== constants.ADMIN){
        return res.send({
            status: false,
            msg: 'Error: unauthorized access'
        });
    }

    if (verify) {
        try {
            let id = req.params.id
            // let request = req.body
            let usr_acc_id = req.body.user_acc_id
            let query = "SELECT * from services_data where id = " + id + " and  status = 'request_for_cancel'"
            // console.log(query);
            let currentDate = moment().format("YYYY/MM/DD")
            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    let getDeviceInfo = `SELECT * FROM usr_acc WHERE id= ${usr_acc_id}`
                    let deviceData = await sql.query(getDeviceInfo)
                    if (deviceData.length) {
                        let dvc_dealer_id = deviceData[0].dealer_id
                        let dvc_dealer_type = await helpers.getUserType(dvc_dealer_id)
                        sql.query("update services_data set status = 'cancelled' , end_date = '" + currentDate + "' where id = " + id, async function (err, reslt) {
                            if (err) {
                                data = {
                                    "status": false,
                                    msg: await helpers.convertToLang(req.translation[""], "Internal Server Error. Please try again"), // "Request is already deleted"
                                };
                                res.send(data);
                                return
                            }
                            if (reslt && reslt.affectedRows > 0) {

                                let updateUserAcc = `UPDATE usr_acc SET expiry_date = '${currentDate}' , status = 'expired' WHERE id = ${usr_acc_id}`
                                sql.query(updateUserAcc)

                                let prevService = result[0]
                                let prevServicePackages = JSON.parse(prevService.packages)
                                let prevServiceProducts = JSON.parse(prevService.products)
                                let preTotalPrice = prevService.total_credits
                                let prevServiceExpiryDate = moment(new Date(prevService.service_expiry_date))
                                let prevServiceStartDate = moment(new Date(prevService.start_date))
                                let dateNow = moment(new Date())
                                let serviceRemainingDays = prevServiceExpiryDate.diff(dateNow, 'days') + 1
                                let prevServiceTotalDays = prevServiceExpiryDate.diff(prevServiceStartDate, 'days')
                                let creditsToRefund = ((preTotalPrice / prevServiceTotalDays) * serviceRemainingDays).toFixed(2)
                                let prevServicePaidPrice = preTotalPrice - creditsToRefund

                                let profitLoss = await helpers.calculateProfitLoss(prevServicePackages, prevServiceProducts, dvc_dealer_type)
                                let prev_service_admin_profit = profitLoss.admin_profit
                                let prev_service_dealer_profit = profitLoss.dealer_profit
                                let refund_prev_service_admin_profit = (prev_service_admin_profit / prevServiceTotalDays) * serviceRemainingDays
                                let refund_prev_service_dealer_profit = (prev_service_dealer_profit / prevServiceTotalDays) * serviceRemainingDays

                                helpers.updateRefundSaleDetails(usr_acc_id, prevService.id, serviceRemainingDays, prevServiceTotalDays)

                                let transection_record = "SELECT * from financial_account_transections where user_dvc_acc_id = " + usr_acc_id + " AND user_id = '" + dvc_dealer_id + "' AND type = 'services' ORDER BY id DESC LIMIT 1"
                                let transection_record_data = await sql.query(transection_record)
                                if (transection_record_data.length) {
                                    if (transection_record_data[0] && transection_record_data[0].status === 'pending') {
                                        let update_transection = "UPDATE financial_account_transections SET status = 'cancelled' WHERE id = " + transection_record_data[0].id
                                        await sql.query(update_transection)

                                        update_credits_query = 'update financial_account_balance set credits = credits + ' + transection_record_data[0].credits + ' where dealer_id ="' + dvc_dealer_id + '"';
                                        await sql.query(update_credits_query);


                                        let update_profits_transections = "UPDATE financial_account_transections SET status = 'cancelled' WHERE user_dvc_acc_id = " + usr_acc_id + " AND status = 'holding' AND type = 'services'"
                                        await sql.query(update_profits_transections)

                                        if (prevServicePaidPrice > 0) {
                                            let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type , paid_credits , due_credits) VALUES (${dvc_dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service charges", service_id: prevService.id })}',${prevServicePaidPrice} ,'credit','pending' , 'services' , 0 , ${prevServicePaidPrice})`
                                            await sql.query(transection_credits)

                                            update_credits_query = 'update financial_account_balance set credits = credits - ' + prevServicePaidPrice + ' where dealer_id ="' + dvc_dealer_id + '"';
                                            await sql.query(update_credits_query);

                                            let admin_holding_profit = prev_service_admin_profit - refund_prev_service_admin_profit
                                            let dealer_holding_profit = prev_service_dealer_profit - refund_prev_service_dealer_profit

                                            if (admin_holding_profit > 0) {
                                                let admin_profit_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${verify.user.id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service holding profit", service_id: prevService.id })}',${admin_holding_profit} ,'debit','holding' , 'services')`
                                                await sql.query(admin_profit_transection)
                                            }

                                            if (dealer_holding_profit > 0) {
                                                let dealer_profit_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${deviceData[0].prnt_dlr_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service holding profit", service_id: prevService.id })}',${dealer_holding_profit} ,'debit','holding' , 'services')`
                                                await sql.query(dealer_profit_transection)
                                            }
                                        }
                                    } else {
                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${dvc_dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, details: "REFUND SERVICES CREITS", service_id: prevService.id })}' ,${creditsToRefund} ,'debit' , 'transferred' , 'services')`
                                        await sql.query(transection_credits)
                                        update_credits_query = 'update financial_account_balance set credits = credits + ' + creditsToRefund + ' where dealer_id ="' + dvc_dealer_id + '"';
                                        await sql.query(update_credits_query);
                                        refund_prev_service_admin_profit = refund_prev_service_admin_profit - Math.ceil((refund_prev_service_admin_profit * 0.03))
                                        refund_prev_service_dealer_profit = refund_prev_service_dealer_profit - Math.ceil((refund_prev_service_dealer_profit * 0.03))

                                        if (prevServicePaidPrice > 0) {

                                            let admin_prev_service_profit = prev_service_admin_profit - refund_prev_service_admin_profit
                                            let dealer_prev_service_profit = prev_service_dealer_profit - refund_prev_service_dealer_profit

                                            if (admin_prev_service_profit > 0) {

                                                let admin_profit_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${verify.user.id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service refund profit", service_id: prevService.id })}',${admin_prev_service_profit} ,'credit','transferred' , 'services')`
                                                await sql.query(admin_profit_transection)
                                            }
                                            if (dealer_prev_service_profit > 0) {
                                                let dealer_profit_transection = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type) VALUES (${deviceData[0].prnt_dlr_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, description: "Services changed, Previous service refund profit", service_id: prevService.id })}',${dealer_prev_service_profit} ,'credit','transferred' , 'services')`
                                                await sql.query(dealer_profit_transection)
                                            }
                                        }
                                        // console.log("", refund_prev_service_admin_profit);
                                        if (refund_prev_service_admin_profit) {
                                            updateAdminProfit = 'update financial_account_balance set credits = credits - ' + refund_prev_service_admin_profit + ' where dealer_id ="' + verify.user.id + '"';
                                            await sql.query(updateAdminProfit);
                                        }
                                        if (refund_prev_service_dealer_profit) {
                                            updateAdminProfit = 'update financial_account_balance set credits = credits - ' + refund_prev_service_dealer_profit + ' where dealer_id ="' + deviceData[0].prnt_dlr_id + '"';
                                            await sql.query(updateAdminProfit);
                                        }
                                    }
                                }
                                res.send({
                                    status: true,
                                    msg: await helpers.convertToLang(req.translation[""], "Services has been cancalled successfully from device."), // "Credits added successfully.",
                                })
                                return
                            }
                        })
                    } else {
                        data = {
                            "status": false,
                            msg: await helpers.convertToLang(req.translation[""], "Device Data not found."), // "Request is already deleted"
                        };
                        res.send(data);
                        return
                    }
                } else {
                    data = {
                        "status": false,
                        msg: await helpers.convertToLang(req.translation[""], "Request not found on server. Please try again"), // "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

exports.deleteServiceRequest = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if(verify.user.user_type !== constants.ADMIN){
        return res.send({
            status: false,
            msg: 'Error: unauthorized access'
        });
    }

    if (verify) {
        try {
            let id = req.params.id
            let query = "SELECT * from services_data where id = " + id + " and  status = 'request_for_cancel'"
            console.log(query);
            sql.query(query, async function (err, result) {
                if (err) {
                    data = {
                        "status": false,
                        msg: await helpers.convertToLang(req.translation[""], "Internal server error. Please Try again"), // "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
                if (result.length) {

                    let updateQuery = "update services_data set status = 'active' where id= " + id
                    sql.query(updateQuery, async function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        if (result && result.affectedRows > 0) {
                            data = {
                                "status": true,
                                "msg": await helpers.convertToLang(req.translation[""], "Request rejected successfully"), // Request deleted successfully."
                            };
                            res.send(data);
                            return
                        } else {
                            data = {
                                "status": false,
                                "msg": await helpers.convertToLang(req.translation[""], "Request not rejected please try again"), // Request not deleted please try again."
                            };
                            res.send(data);
                            return
                        }
                    })

                } else {
                    data = {
                        "status": false,
                        msg: await helpers.convertToLang(req.translation[""], "Request Not found. Please try again later."), // "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}

// *****************************  SET AND GET => PRICES & PAKAGES   **************************
exports.savePrices = async function (req, res) {
    // console.log('save-prices data at server is', req.body)
    var verify = req.decoded; // await verifyToken(req, res);

    if(verify.user.user_type !== constants.ADMIN){
        return res.send({
            status: false,
            msg: 'Error: unauthorized access'
        });
    }

    if (verify) {
        let data = req.body.data;
        if (data) {
            // console.log(data, 'data')
            // let dealer_id = req.body.dealer_id;
            let dealer_id = verify.user.dealer_id;
            if (dealer_id) {
                // console.log(dealer_id, 'whitelableid');
                let error = 0;

                let month = ''
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        // console.log(key + " -> " + data[key]);
                        let outerKey = key;

                        let innerObject = data[key];
                        // console.log('iner object is', innerObject)
                        for (var innerKey in innerObject) {
                            if (innerObject.hasOwnProperty(innerKey)) {
                                let days = 0;
                                let f_key = innerKey;
                                // console.log(innerKey + " -> " + innerObject[innerKey]);
                                if (innerObject[innerKey]) {

                                    // console.log('is string', string)
                                    let stringarray = [];

                                    stringarray = innerKey.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                                    if (stringarray) {
                                        // console.log(stringarray,'is string lenth', stringarray.length)
                                        if (stringarray.length) {
                                            month = stringarray[0];
                                            // console.log('is month', month, stringarray[1])
                                            if (month && stringarray[1]) {
                                                // console.log('sring[1]', stringarray[1])
                                                if (stringarray[1] == 'month') {
                                                    days = parseInt(month) * 30
                                                } else if (stringarray[1] == 'year') {
                                                    days = parseInt(month) * 365
                                                } else {
                                                    days = 30
                                                }
                                            }
                                        }
                                    }
                                }
                                // console.log(days, 'days are')
                                let unit_price = innerKey;
                                let updateQuery = "UPDATE prices SET unit_price='" + innerObject[f_key] + "', price_expiry='" + days + "' WHERE dealer_id='" + dealer_id + "' AND price_term='" + innerKey + "' AND price_for='" + key + "'";
                                // console.log(updateQuery, 'query')
                                sql.query(updateQuery, async function (err, result) {
                                    if (err) {
                                        console.log(err)
                                    }

                                    if (result) {
                                        // console.log('outerKey', outerKey)
                                        if (!result.affectedRows) {
                                            let insertQuery = "INSERT INTO prices (price_for, unit_price, price_term, price_expiry, dealer_id , dealer_type) VALUES('" + outerKey + "', '" + innerObject[f_key] + "', '" + unit_price + "', '" + days + "', '" + dealer_id + "' , '" + verify.user.user_type + "')";
                                            // console.log('Billing query', insertQuery)
                                            let rslt = await sql.query(insertQuery);
                                            if (rslt) {
                                                if (rslt.affectedRows == 0) {
                                                    error++;
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        }

                    }
                }
                console.log('errors are ', error)

                if (error == 0) {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PRICES_SET_SUCCESSFULLY], "Prices Set Successfully"), // 'Prices Set Successfully'
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some Error Occured"), // 'Some Error Occured'
                    })
                }

            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // 'Invalid Dealer'
                })
            }

        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
        }
    }
}

exports.saveSaPrices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if(verify.user.user_type !== constants.SUPER_ADMIN){
        return res.send({
            status: false,
            msg: 'Error: unuthorized access'
        });
    }
    if (verify) {
        let data = req.body.data;
        if (data) {
            let dealer_id = verify.user.dealer_id;
            if (dealer_id) {
                // console.log(dealer_id, 'whitelableid');
                let error = 0;

                let month = ''
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        // console.log(key + " -> " + data[key]);
                        let outerKey = key;

                        let innerObject = data[key];
                        // console.log('iner object is', innerObject)
                        for (var innerKey in innerObject) {
                            if (innerObject.hasOwnProperty(innerKey)) {
                                let days = 0;
                                // console.log(innerKey + " -> " + innerObject[innerKey]);
                                if (innerObject[innerKey]) {

                                    // console.log('is string', string)
                                    let stringarray = [];

                                    stringarray = innerKey.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                                    if (stringarray) {
                                        // console.log(stringarray,'is string lenth', stringarray.length)
                                        if (stringarray.length) {
                                            month = stringarray[0];
                                            // console.log('is month', month, stringarray[1])
                                            if (month && stringarray[1]) {
                                                // console.log('sring[1]', stringarray[1])
                                                if (stringarray[1] == 'month') {
                                                    days = parseInt(month) * 30
                                                } else if (string[1] == 'year') {
                                                    days = parseInt(month) * 365
                                                } else {
                                                    days = 30
                                                }
                                            }
                                        }
                                    }
                                }
                                // console.log(days, 'days are')
                                let unit_price = innerKey;
                                console.log(innerObject[innerKey], key, "Values");
                                let updateQuery = "UPDATE prices SET unit_price='" + innerObject[innerKey] + "', price_expiry='" + days + "', dealer_id='" + dealer_id + "' WHERE price_term='" + innerKey + "' AND price_for='" + key + "' AND dealer_id = '" + dealer_id + "'";
                                // console.log(updateQuery, 'query')
                                let result = await sql.query(updateQuery)
                                if (result) {
                                    // console.log('outerKey', outerKey)
                                    if (!result.affectedRows) {
                                        let insertQuery = "INSERT INTO prices (dealer_id,dealer_type,price_for, unit_price, price_term, price_expiry) VALUES('" + dealer_id + "' ,'super_admin' , '" + outerKey + "', '" + innerObject[innerKey] + "', '" + unit_price + "', '" + days + "')";
                                        console.log(insertQuery);

                                        let rslt = await sql.query(insertQuery);
                                        if (rslt) {
                                            if (rslt.affectedRows == 0) {
                                                error++;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
                // console.log('errors are ', error)

                if (error == 0) {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PRICES_SET_SUCCESSFULLY], "Prices Set Successfully"), // 'Prices Set Successfully'
                    })
                    return
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some Error Occured"), // 'Some Error Occured'
                    })
                    return
                }

            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // 'Invalid Dealer'
                })
                return
            }

        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
            return
        }
    }
}

exports.savePackage = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // console.log(verify.user, 'user is the ')
        let data = req.body.data;
        let dealer_id = verify.user.dealer_id;
        // console.log(data);
        if (data) {
            // console.log(data, 'data')
            // let dealer_id = req.body.data.dealer_id;
            if (dealer_id) {
                // console.log(dealer_id, 'whitelableid');

                let checkExistingQ = `SELECT pkg_name FROM packages WHERE pkg_name='${data.pkgName}' AND delete_status = 0;`;
                let checkExisting = await sql.query(checkExistingQ);
                if (checkExisting && checkExisting.length) {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[''], "Package Name Already Exist, Please change the Pakcage name"), // 'Invalid Dealer'
                    })
                    return
                } else {
                    let days = 0;
                    if (data.pkgTerm) {
                        if (data.pkgTerm === "trial") {
                            days = 7;
                        } else {
                            stringarray = data.pkgTerm.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                            if (stringarray) {
                                // console.log(stringarray,'is string lenth', stringarray.length)
                                if (stringarray.length) {
                                    month = stringarray[0];
                                    // console.log('is month', month, stringarray[1])
                                    if (month && stringarray[1]) {
                                        // console.log('sring[1]', stringarray[1])
                                        if (stringarray[1] == 'month') {
                                            days = parseInt(month) * 30
                                        } else if (stringarray[1] == 'year') {
                                            days = parseInt(month) * 365
                                        } else {
                                            days = 30
                                        }
                                    }
                                }
                            }
                        }
                    }
                    let pkg_features = JSON.stringify(data.pkgFeatures)
                    let insertQuery = "INSERT INTO packages (dealer_id , dealer_type , pkg_name, pkg_term, pkg_price, pkg_expiry, pkg_features) VALUES('" + dealer_id + "' ,'" + verify.user.user_type + "' , '" + data.pkgName + "', '" + data.pkgTerm + "', '" + data.pkgPrice + "','" + days + "', '" + pkg_features + "')";
                    sql.query(insertQuery, async (err, rslt) => {
                        if (err) {
                            console.log(err)
                            return res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[""], "Package Not Saved"),
                            })

                        }

                        if (rslt) {
                            if (rslt.affectedRows) {

                                // save package price
                                let insertQ = "INSERT INTO dealer_packages_prices ( package_id,dealer_id , created_by , price , retail_price) VALUES(" + rslt.insertId + ",'" + dealer_id + "' ,'" + verify.user.user_type + "' , '" + data.pkgPrice + "' , '" + data.retail_price + "')";
                                // console.log(insertQ);
                                sql.query(insertQ)

                                insertedRecord = await sql.query("SELECT * FROM packages WHERE dealer_id='" + dealer_id + "' AND id='" + rslt.insertId + "'")
                                console.log("insertedRecord ========================> ", insertedRecord)
                                res.send({
                                    status: true,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.PACKAGE_SAVED_SUCCESSFULLY], "Package Saved Successfully"), // 'Package Saved Successfully',
                                    data: insertedRecord
                                })
                            }
                        }
                    })
                }


            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // 'Invalid Dealer'
                })
            }
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
        }
    }
}

exports.editPackage = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let data = req.body.data;
        if (data) {
            if (data.package_id) {
                // console.log(data, 'whitelableid');
                let package_id = data.package_id
                let whereCond = '';
                if(verify.user.user_type !== constants.ADMIN){
                    whereCond = ' AND dealer_id=' + verify.user.id;
                }

                let getPkgData = "SELECT * FROM packages WHERE id = " + package_id + whereCond;
                let current_pkg_data = await sql.query(getPkgData);
                if (current_pkg_data && current_pkg_data.length) {

                    let checkExistingQ = "SELECT pkg_name FROM packages WHERE pkg_name='" + data.pkgName + "' AND id != " + package_id;
                    let checkExisting = await sql.query(checkExistingQ);
                    if (checkExisting && checkExisting.length) {
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[''], "Package Name Already Exist, Please change the Pakcage name"), // 'Invalid Dealer'
                        })
                        return
                    } else {
                        let days = 0;
                        if (data.pkgTerm) {
                            if (data.pkgTerm === "trial") {
                                days = 7;
                            } else {
                                stringarray = data.pkgTerm.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                                if (stringarray) {
                                    // console.log(stringarray,'is string lenth', stringarray.length)
                                    if (stringarray.length) {
                                        month = stringarray[0];
                                        // console.log('is month', month, stringarray[1])
                                        if (month && stringarray[1]) {
                                            // console.log('sring[1]', stringarray[1])
                                            if (stringarray[1] == 'month') {
                                                days = parseInt(month) * 30
                                            } else if (string[1] == 'year') {
                                                days = parseInt(month) * 365
                                            } else {
                                                days = 30
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        let pkg_features = JSON.stringify(data.pkgFeatures)
                        let insertQuery = `UPDATE packages SET pkg_name = '${data.pkgName}', pkg_term = '${data.pkgTerm}', pkg_price ='${data.pkgPrice}', pkg_expiry = '${days}', pkg_features  = '${pkg_features}' WHERE id = ${package_id}`;
                        sql.query(insertQuery, async (err, rslt) => {
                            if (err) {
                                console.log(err)
                                return res.send({
                                    status: false,
                                    msg: await helpers.convertToLang(req.translation[""], "Package Not Saved"),
                                })

                            }

                            if (rslt) {
                                if (rslt.affectedRows) {
                                    // save package price
                                    let insertQ = `UPDATE dealer_packages_prices SET price = ${data.pkgPrice} , retail_price = ${data.retail_price} WHERE dealer_id = ${current_pkg_data[0].dealer_id} AND package_id = ${package_id}`;
                                    console.log(insertQ);
                                    sql.query(insertQ)
                                    UpdatedRecord = await sql.query("SELECT * FROM packages WHERE id='" + package_id + "'")
                                    res.send({
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.PACKAGE_SAVED_SUCCESSFULLY], "Package Saved Successfully"), // 'Package Saved Successfully',
                                        data: UpdatedRecord[0]
                                    })
                                }
                            }
                        })
                    }

                } else {

                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[''], "Package Not found. Invalid Request"), // 'Invalid Dealer'
                    })
                    return

                }
            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[""], "Invalid Request"), // 'Invalid Dealer'
                })
            }
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
        }
    }
}

exports.saveSaPackage = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if(verify.user.user_type !== constants.SUPER_ADMIN){
        return res.send({
            status: false,
            msg: "Error: unauthorized access"
        });
    }

    if (verify) {

        let data = req.body.data;
        if (data && data.package_type) {
            let package_type = data.package_type;

            if (package_type !== 'services' && package_type !== 'data_plan' && package_type !== 'Standalone Sim') {
                return res.send({
                    status: false,
                    msg: 'Invalid Data'
                })
            }

            let days = 0;
            if (data.pkgTerm) {
                if (data.pkgTerm === "trial") {
                    days = 7;
                } else {
                    stringarray = data.pkgTerm.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                    if (stringarray) {
                        // console.log(stringarray,'is string lenth', stringarray.length)
                        if (stringarray.length) {
                            month = stringarray[0];
                            // console.log('is month', month, stringarray[1])
                            if (month && stringarray[1]) {
                                // console.log('sring[1]', stringarray[1])
                                if (stringarray[1] == 'month') {
                                    days = parseInt(month) * 30
                                } else if (stringarray[1] == 'year') {
                                    days = parseInt(month) * 365
                                } else {
                                    days = 30
                                }
                            }
                        }
                    }
                }
            }

            let pkg_features = '{}';
            let insertQuery = '';
            if (package_type === 'services') {
                let pkg_features = JSON.stringify(data.pkgFeatures)
                insertQuery = `INSERT INTO packages (dealer_id, dealer_type, pkg_name, pkg_term, pkg_price, pkg_expiry, pkg_features, dealers, package_type ) VALUES('${verify.user.dealer_id}', 'super_admin', '${data.pkgName}', '${data.pkgTerm}', '${data.pkgPrice}', '${days}', '${pkg_features}' , '[]', '${package_type}')`;
            } else if (package_type === 'data_plan') {
                insertQuery = `INSERT INTO packages (dealer_id, dealer_type, pkg_name, pkg_term, pkg_price, pkg_expiry, pkg_features, data_limit, dealers, package_type ) VALUES('${verify.user.dealer_id}', 'super_admin', '${data.pkgName}', '${data.pkgTerm}', '${data.pkgPrice}', '${days}', '${pkg_features}', ${data.data_limit}, '[]', '${package_type}')`;
            } else if (package_type === 'Standalone Sim') {
                insertQuery = `INSERT INTO packages (dealer_id, dealer_type, pkg_name, pkg_term, pkg_price, pkg_expiry, pkg_features, dealers, package_type , data_limit) VALUES('${verify.user.dealer_id}', 'super_admin', '${data.pkgName}', '${data.pkgTerm}', '${data.pkgPrice}', '${days}', '${pkg_features}', '[]', '${'standalone_sim'}' , ${data.data_limit})`;
            }

            // console.log(insertQuery);

            sql.query(insertQuery, async (err, rslt) => {
                if (err) {
                    console.log(err)
                    return res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[""], "Package Not Saved. WhiteLabel Server Error"), // 'Package Saved Successfully',
                    })
                }
                if (rslt) {
                    if (rslt.affectedRows) {
                        let insertQ = `INSERT INTO dealer_packages_prices (package_id, dealer_id, created_by, price) VALUES(${rslt.insertId}, '${verify.user.dealer_id}', 'super_admin', '${data.pkgPrice}')`;
                        console.log(insertQ);
                        sql.query(insertQ)
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.PACKAGE_SAVED_SUCCESSFULLY], "Package Saved Successfully"), // 'Package Saved Successfully',
                        })
                        return
                    }
                }
            })

        } else {
            return res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
        }
    }
}

exports.saveSaHardware = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if(verify.user.type !== constants.SUPER_ADMIN){
        return res.send({
            status: false,
            msg: 'Error: unauthorized access'
        });
    }

    if (verify) {

        let data = req.body.data;
        if (data) {
            let insertQuery = "INSERT INTO hardwares (dealer_id , dealer_type , hardware_name, hardware_price) VALUES('" + verify.user.dealer_id + "' ,'super_admin' , '" + data.hardwareName + "', '" + data.hardwarePrice + "')";
            console.log(insertQuery);

            sql.query(insertQuery, async (err, rslt) => {
                if (err) {
                    console.log(err)
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PACKAGE_SAVED_SUCCESSFULLY], "Hardware Not Saved. Whitelabel Server Error."), // 'Package Saved Successfully',
                    })
                    return
                }
                if (rslt) {
                    if (rslt.affectedRows) {
                        let insertQ = "INSERT INTO dealer_hardwares_prices ( hardware_id,dealer_id , created_by , price) VALUES(" + rslt.insertId + ",'" + verify.user.dealer_id + "' ,'super_admin' , '" + data.hardwarePrice + "')";
                        // console.log(insertQ);
                        sql.query(insertQ)
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[""], "Hardware Saved Successfully"), // 'Package Saved Successfully',
                        })
                        return
                    }
                }
            })

        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
            return
        }
    }
}

exports.deletePackage = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let id = req.params.id
        if (id) {
            let whereCond = '';
            if(verify.user.type !== constants.ADMIN){
                whereCond = ` AND dealer_id=${verify.user.id}`;
            }
            let checkPackage = await sql.query(`SELECT * FROM packages WHERE id = ${id}${whereCond} AND delete_status=0`);
            if(!checkPackage || !checkPackage.length){
                return res.send({
                    status: false,
                    msg: 'Error: package not found'
                })
            }
            let query = `UPDATE packages set delete_status = 1 WHERE id = ${id}${whereCond}`
            sql.query(query, function (err, result) {
                if (err) {
                    res.send({
                        status: false,
                        msg: "Error: Package not deleted. Please try again"
                    })
                    return
                }
                if (result && result.affectedRows > 0) {
                    res.send({
                        status: true,
                        msg: "Package Deleted successfully."
                    })
                    return
                }
                else {
                    res.send({
                        status: false,
                        msg: "Error: Package not deleted. Please try again"
                    })
                    return
                }
            })

        }

    }
}

exports.modifyItemPrice = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let id = req.params.id
        let price = req.body.price
        let isModify = req.body.isModify
        // console.log(verify);
        let retail_price = req.body.retail_price && verify.user.user_type !== ADMIN ? req.body.retail_price : null
        let user_type = verify.user.user_type
        let type = req.body.type
        if (id) {
            if (type === 'package') {
                let packageQ = `SELECT * FROM packages WHERE id=${id} AND delete_status != 1`
                sql.query(packageQ, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send({
                            status: true,
                            msg: "Error: Package did not modify."
                        })
                        return
                    }
                    if (result && result.length) {
                        if (isModify) {

                            let updatePrice = "UPDATE dealer_packages_prices set price = " + price + " , retail_price = " + retail_price + "  where package_id=" + id + " AND created_by = '" + user_type + "' AND dealer_id='" + verify.user.id + "'"
                            console.log(updatePrice, 'query 1');
                            sql.query(updatePrice, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        status: true,
                                        msg: "Error: Package did not modify."
                                    })
                                    return
                                }
                                if (result.affectedRows > 0) {
                                    res.send({
                                        status: true,
                                        msg: "Package modified successfully."
                                    })
                                    return
                                } else {
                                    let insertQ = "INSERT INTO dealer_packages_prices (package_id,dealer_id,created_by,price , retail_price) VALUES (" + id + ", " + verify.user.id + " , '" + user_type + "' , " + price + ", " + retail_price + ") "
                                    console.log(insertQ, 'query 2');
                                    sql.query(insertQ, function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            res.send({
                                                status: false,
                                                msg: "Package did not modify."
                                            })
                                            return
                                        }
                                        if (result.affectedRows) {
                                            res.send({
                                                status: true,
                                                msg: "Package modified successfully."
                                            })
                                            return
                                        }

                                    })
                                }
                            })
                        } else {
                            let updatePackage = "UPDATE packages set pkg_price = " + price + " where id=" + id
                            console.log(updatePackage, 'query 3');
                            sql.query(updatePackage, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        status: true,
                                        msg: "Error: Package did not modify."
                                    })
                                    return
                                }
                                if (result && result.affectedRows > 0) {

                                    let updatePrice = "UPDATE dealer_packages_prices set price = " + price + " , retail_price = " + retail_price + " where id=" + id
                                    console.log(updatePrice, 'query 4')
                                    sql.query(updatePrice)
                                    res.send({
                                        status: true,
                                        msg: "Package modified successfully."
                                    })
                                    return
                                }

                            })
                        }
                    }
                    else {
                        res.send({
                            status: false,
                            msg: "Error: Package not found. Please try again"
                        })
                        return
                    }

                })
            }
            else if (type === 'hardware') {
                let hardwareQ = `SELECT * FROM hardwares WHERE id=${id} AND delete_status != 1`
                // console.log(hardwareQ);
                sql.query(hardwareQ, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send({
                            status: true,
                            msg: "Error: Hardware did not modify."
                        })
                        return
                    }
                    if (result && result.length) {
                        if (isModify) {
                            let updatePrice = "UPDATE dealer_hardwares_prices set price = " + price + " , retail_price = " + retail_price + "  where hardware_id=" + id + " AND created_by = '" + user_type + "' AND dealer_id = " + verify.user.id + ""
                            // console.log(updatePrice);
                            sql.query(updatePrice, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        status: true,
                                        msg: "Error: hardware did not modify."
                                    })
                                    return
                                }
                                if (result.affectedRows > 0) {
                                    res.send({
                                        status: true,
                                        msg: "Hardware modified successfully."
                                    })
                                    return
                                } else {
                                    let insertQ = "INSERT INTO dealer_hardwares_prices (Hardware_id,dealer_id,created_by,price , retail_price) VALUES (" + id + ", " + verify.user.id + " , '" + user_type + "' , " + price + ", " + retail_price + ") "
                                    sql.query(insertQ, function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            res.send({
                                                status: false,
                                                msg: "Hardware did not modify."
                                            })
                                            return
                                        }
                                        if (result.affectedRows) {
                                            res.send({
                                                status: true,
                                                msg: "hardware modified successfully."
                                            })
                                            return
                                        }

                                    })
                                }
                            })
                        }
                    }
                    else {
                        res.send({
                            status: false,
                            msg: "Error: Hardware not found. Please try again"
                        })
                        return
                    }

                })
            }
        }
        else {
            res.send({
                status: false,
                msg: "Error: Item not found. Please try again"
            })
            return
        }

    }
}

exports.getPrices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // let dealer_id = req.params.dealer_id;
        let dealer_id = verify.user.dealer_id;
        let sim_id = {};
        let chat_id = {};
        let pgp_email = {};
        let vpn = {};
        if (dealer_id) {
            let selectQuery = "SELECT * FROM prices WHERE dealer_id='" + dealer_id + "'";
            sql.query(selectQuery, async (err, reslt) => {
                if (err) {
                    console.log(err)
                }
                if (reslt) {
                    // console.log('result for get prices are is ', reslt);

                    if (reslt.length) {
                        for (let item of reslt) {
                            if (item.price_for == 'sim_id') {
                                sim_id[item.price_term] = item.unit_price
                            } else if (item.price_for == 'chat_id') {
                                chat_id[item.price_term] = item.unit_price
                            } else if (item.price_for == 'pgp_email') {
                                pgp_email[item.price_term] = item.unit_price
                            } else if (item.price_for == 'vpn') {
                                vpn[item.price_term] = item.unit_price
                            }
                        }
                        let data = {
                            sim_id: sim_id ? sim_id : {},
                            chat_id: chat_id ? chat_id : {},
                            pgp_email: pgp_email ? pgp_email : {},
                            vpn: vpn ? vpn : {}
                        }
                        // console.log(data, 'reslt data of prices')
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: data

                        })
                    } else {
                        let data = {
                            sim_id: sim_id ? sim_id : {},
                            chat_id: chat_id ? chat_id : {},
                            pgp_email: pgp_email ? pgp_email : {},
                            vpn: vpn ? vpn : {}
                        }

                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: data
                        })
                    }

                } else {
                    let data = {
                        sim_id: sim_id ? sim_id : {},
                        chat_id: chat_id ? chat_id : {},
                        pgp_email: pgp_email ? pgp_email : {},
                        vpn: vpn ? vpn : {}
                    }

                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                        data: data
                    })
                }
            })
        } else {

            let data = {
                sim_id: sim_id ? sim_id : {},
                chat_id: chat_id ? chat_id : {},
                pgp_email: pgp_email ? pgp_email : {},
                vpn: vpn ? vpn : {}
            }

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: data

            })
        }
    }
}

exports.getPackages = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // let dealer_id = req.params.dealer_id;
        let dealer_id = verify.user.id;
        let loggedUserType = verify.user.user_type;

        if (dealer_id) {
            let selectQuery = '';
            if (loggedUserType === ADMIN) {
                selectQuery = "SELECT * FROM packages WHERE (delete_status != 1 OR  delete_status IS NULL)  AND (dealer_id='" + dealer_id + "' OR dealer_type = 'super_admin')";
            }
            else if (loggedUserType === DEALER) {
                // selectQuery = `SELECT dealer_packages_prices.price AS pkg_price, dealer_packages_prices.retail_price, packages.* FROM dealer_packages_prices JOIN packages ON (packages.id = dealer_packages_prices.package_id) WHERE dealer_packages_prices.dealer_id = '${dealer_id}' OR  dealer_packages_prices.created_by = 'admin' AND packages.delete_status != 1`;
                selectQuery = "SELECT * FROM packages WHERE (delete_status != 1 OR  delete_status IS NULL)  AND (dealer_id='" + dealer_id + "' OR dealer_type = 'admin' OR dealer_type = 'super_admin')";
            }
            else if (loggedUserType === SDEALER) {
                // selectQuery = `SELECT dealer_packages_prices.price AS pkg_price, dealer_packages_prices.retail_price, packages.* FROM dealer_packages_prices JOIN packages ON (packages.id = dealer_packages_prices.package_id) WHERE dealer_packages_prices.dealer_id = '${dealer_id}' OR  dealer_packages_prices.created_by = 'admin' AND packages.delete_status != 1`;
                selectQuery = "SELECT * FROM packages WHERE (delete_status != 1 OR  delete_status IS NULL)  AND (dealer_id='" + dealer_id + "' OR dealer_type = 'admin' OR dealer_type = 'super_admin'  OR dealer_id = " + verify.user.connected_dealer + ")";
            }
            if (selectQuery) {
                sql.query(selectQuery, async (err, reslt) => {
                    if (err) {
                        console.log(err)
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No Data found"), // "Data found",
                            data: []

                        })
                        return
                    }

                    if (reslt && reslt.length) {
                        // console.log('result for get prices are is ', reslt);

                        if (loggedUserType !== ADMIN) {
                            let condition = '';
                            if (loggedUserType === DEALER) {
                                condition = ` OR (dealer_id = 0 AND dealer_type = 'admin') `;
                            }
                            else if (loggedUserType === SDEALER) {
                                let getParentId = await sql.query(`SELECT connected_dealer FROM dealers WHERE dealer_id = ${dealer_id}`);
                                condition = ` OR (dealer_id = 0 AND ((dealer_type='dealer' AND permission_by=${getParentId[0].connected_dealer}))) `
                                // condition = `AND (dealer_type = 'admin' OR dealer_type = 'dealer')`
                            }

                            let selectQ = `SELECT * FROM dealer_permissions WHERE (dealer_id = ${dealer_id} ${condition}) AND permission_type = 'package';`;
                            let permissionsResults = await sql.query(selectQ);
                            let permissionIds = permissionsResults.map((prm) => prm.permission_id);
                            // console.log("permissionIds get pkgs: ", permissionIds);
                            let checkPermissions = [];
                            if (permissionIds && permissionIds.length) {
                                reslt.forEach(item => {
                                    if (permissionIds.includes(item.id) || dealer_id === item.dealer_id) {
                                        checkPermissions.push(item);
                                    }
                                });
                            } else {
                                reslt.forEach(item => {
                                    if (dealer_id === item.dealer_id) {
                                        checkPermissions.push(item);
                                    }
                                });
                            }
                            reslt = checkPermissions;
                        }

                        let packages = [];
                        let dealerCount = 0;
                        let sdealerList = []
                        // if (loggedUserType === ADMIN) {
                        //     let dealerRoleId = await helpers.getUserTypeIDByName(DEALER);
                        //     dealerCount = await helpers.userDealerCount(dealerRoleId);
                        //     sdealerList = await sql.query(`SELECT * FROM dealers WHERE type!=${dealerRoleId} AND type != 4 AND type !=5 ORDER BY created DESC`);
                        // }
                        // else if (loggedUserType === DEALER) {
                        //     sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                        //     dealerCount = sdealerList.length;
                        // }
                        // sdealerList = sdealerList.map((dealer) => dealer.dealer_id);
                        // get all dealers under admin or sdealers under dealer
                        let userDealers = await helpers.getUserDealers(loggedUserType, dealer_id, 'package');
                        // console.log("userDealers ", userDealers);
                        sdealerList = userDealers.dealerList;
                        dealerCount = userDealers.dealerCount;

                        for (var i = 0; i < reslt.length; i++) {
                            if (loggedUserType === ADMIN) {
                                let dealer_package_prices = await sql.query(`SELECT * from dealer_packages_prices WHERE (dealer_id=${verify.user.id} OR created_by = '${constants.SUPER_ADMIN_DB}' ) AND package_id = ${reslt[i].id} ORDER BY FIELD(dealer_packages_prices.created_by,'${constants.DEALER}', '${constants.ADMIN}', '${constants.SUPER_ADMIN_DB}')`);
                                if(dealer_package_prices && dealer_package_prices.length){
                                    let k = 1;
                                    while(true && dealer_package_prices[k] !== undefined){
                                        reslt[i].costPrice = dealer_package_prices[k].price ? dealer_package_prices[k].price : 0;

                                        if(reslt[i].costPrice > 0){
                                            break;
                                        }
                                        k++;
                                    }
                                    if(!reslt[i].costPrice){
                                        reslt[i].costPrice = reslt[i].pkg_price;
                                    }

                                    reslt[i].pkg_price = dealer_package_prices[0].price ? dealer_package_prices[0].price : 0 ;
                                    
                                    if(reslt[i].pkg_price === 0){
                                        let j = 1;
                                        while(true && dealer_package_prices[j] !== undefined){
                                            reslt[i].pkg_price = dealer_package_prices[j].price ? dealer_package_prices[j].price : 0 ;
                                            if(reslt[i].pkg_price > 0){
                                                break;
                                            }
                                            j++;
                                        }
                                    }

                                    reslt[i].retail_price = dealer_package_prices[0].retail_price ? dealer_package_prices[0].retail_price : 0 ;
                                } else {
                                    reslt[i].costPrice = reslt[i].pkg_price;
                                    reslt[i].pkg_price = reslt[i].pkg_price ? reslt[i].pkg_price : 0 ;
                                    reslt[i].retail_price = reslt[i].retail_price ? reslt[i].retail_price : 0 ;
                                }
                                // console.log(reslt);
                                // if (reslt[i].dealer_type === 'super_admin') {
                                //     let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                //     // console.log(result);
                                //     if (result && result.length) {
                                //         reslt[i].costPrice = reslt[i].pkg_price
                                //         reslt[i].pkg_price = result[0].price
                                //         reslt[i].retail_price = result[0].retail_price
                                        
                                //     } else {
                                //         console.log(reslt[i.pkg_price]);
                                //         reslt[i].costPrice = reslt[i].pkg_price
                                //         reslt[i].retail_price = reslt[i].pkg_price
                                        
                                //     }
                                // }
                            }
                            else if (loggedUserType === DEALER) {
                                let dealer_package_prices = await sql.query(`SELECT * from dealer_packages_prices WHERE (dealer_id=${verify.user.id} OR created_by IN ('${constants.ADMIN}', '${constants.SUPER_ADMIN_DB}')) AND package_id = ${reslt[i].id} ORDER BY FIELD(dealer_packages_prices.created_by,'${constants.DEALER}', '${constants.ADMIN}', '${constants.SUPER_ADMIN_DB}')`);
                                if(dealer_package_prices && dealer_package_prices.length){
                                    let k = 1;
                                    while(true && dealer_package_prices[k] !== undefined){
                                        reslt[i].costPrice = dealer_package_prices[k].price ? dealer_package_prices[k].price : 0;

                                        if(reslt[i].costPrice > 0){
                                            break;
                                        }
                                        k++;
                                    }
                                    if(!reslt[i].costPrice){
                                        reslt[i].costPrice = reslt[i].pkg_price;
                                    }

                                    reslt[i].pkg_price = dealer_package_prices[0].price ? dealer_package_prices[0].price : 0 ;
                                    
                                    if(reslt[i].pkg_price === 0){
                                        let j = 1;
                                        while(true && dealer_package_prices[j] !== undefined){
                                            reslt[i].pkg_price = dealer_package_prices[j].price ? dealer_package_prices[j].price : 0 ;
                                            if(reslt[i].pkg_price > 0){
                                                break;
                                            }
                                            j++;
                                        }
                                    }


                                    reslt[i].retail_price = dealer_package_prices[0].retail_price ? dealer_package_prices[0].retail_price : 0 ;
                                } else {
                                    reslt[i].costPrice = reslt[i].pkg_price;
                                    reslt[i].pkg_price = reslt[i].pkg_price ? reslt[i].pkg_price : 0 ;
                                    reslt[i].retail_price = reslt[i].retail_price ? reslt[i].retail_price : 0 ;
                                }
                                // if (reslt[i].dealer_type === 'super_admin') {
                                //     let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND dealer_id = " + dealer_id + " AND package_id = " + reslt[i].id);
                                //     if (result && result.length) {
                                //         reslt[i].pkg_price = result[0].price
                                //         reslt[i].retail_price = result[0].retail_price
                                        
                                //     } else {
                                //         let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                //         if (result && result.length) {
                                //             reslt[i].pkg_price = result[0].price
                                //             reslt[i].retail_price = result[0].price
                                            
                                //         } else {
                                //             reslt[i].retail_price = reslt[i].pkg_price
                                            
                                //         }
                                //     }
                                // } else if (reslt[i].dealer_type === 'admin' || reslt[i].dealer_type === 'dealer') {

                                //     let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND dealer_id = " + dealer_id + " AND package_id = " + reslt[i].id);
                                //     // console.log("DEALER PRICE QUERY", "SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND dealer_id = " + dealer_id + " AND package_id = " + reslt[i].id);
                                //     if (result && result.length) {
                                //         reslt[i].pkg_price = result[0].price
                                //         reslt[i].retail_price = result[0].retail_price
                                        
                                //     } else {
                                //         reslt[i].retail_price = reslt[i].pkg_price
                                        
                                //     }
                                // }
                            } else if (loggedUserType === SDEALER) {
                                let dealer_package_prices = await sql.query(`SELECT * from dealer_packages_prices WHERE (dealer_id=${verify.user.id} OR created_by IN ('${constants.DEALER}', '${constants.ADMIN}', '${constants.SUPER_ADMIN_DB}')) AND package_id = ${reslt[i].id} ORDER BY FIELD(dealer_packages_prices.created_by,'${constants.DEALER}', '${constants.ADMIN}', '${constants.SUPER_ADMIN_DB}')`);
                                if(dealer_package_prices && dealer_package_prices.length){
                                    let k = 1;
                                    while(true && dealer_package_prices[k] !== undefined){
                                        reslt[i].costPrice = dealer_package_prices[k].price ? dealer_package_prices[k].price : 0;

                                        if(reslt[i].costPrice > 0){
                                            break;
                                        }
                                        k++;
                                    }
                                    if(!reslt[i].costPrice){
                                        reslt[i].costPrice = reslt[i].pkg_price;
                                    }

                                    reslt[i].pkg_price = dealer_package_prices[0].price ? dealer_package_prices[0].price : 0 ;
                                    
                                    if(reslt[i].pkg_price === 0){
                                        let j = 1;
                                        while(true && dealer_package_prices[j] !== undefined){
                                            reslt[i].pkg_price = dealer_package_prices[j].price ? dealer_package_prices[j].price : 0 ;
                                            if(reslt[i].pkg_price > 0){
                                                break;
                                            }
                                            j++;
                                        }
                                    }
                                    reslt[i].retail_price = dealer_package_prices[0].retail_price ? dealer_package_prices[0].retail_price : 0 ;
                                } else {
                                    reslt[i].costPrice = reslt[i].pkg_price;
                                    reslt[i].pkg_price = reslt[i].pkg_price ? reslt[i].pkg_price : 0 ;
                                    reslt[i].retail_price = reslt[i].retail_price ? reslt[i].retail_price : 0 ;
                                }

                                // if (reslt[i].dealer_type === 'super_admin') {
                                //     let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'sdealer' AND dealer_id = " + dealer_id + " AND package_id = " + reslt[i].id);
                                //     if (result && result.length) {
                                //         reslt[i].pkg_price = result[0].price
                                //         reslt[i].retail_price = result[0].retail_price
                                        
                                //     } else {
                                //         let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND dealer_id = " + verify.user.connected_dealer + " AND package_id = " + reslt[i].id);
                                //         if (result && result.length) {
                                //             reslt[i].pkg_price = result[0].price
                                //             reslt[i].retail_price = reslt[i].pkg_price
                                            
                                //         } else {
                                //             let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                //             if (result && result.length) {
                                //                 reslt[i].pkg_price = result[0].price
                                //                 reslt[i].retail_price = reslt[i].pkg_price
                                                
                                //             } else {
                                //                 reslt[i].retail_price = reslt[i].pkg_price
                                //             }
                                //         }
                                //     }
                                // } else if (reslt[i].dealer_type === 'admin' || reslt[i].dealer_type === 'dealer') {

                                //     let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND dealer_id = " + dealer_id + " AND package_id = " + reslt[i].id);
                                //     // console.log("DEALER PRICE QUERY", "SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND dealer_id = " + dealer_id + " AND package_id = " + reslt[i].id);
                                //     if (result && result.length) {
                                //         reslt[i].costPrice = reslt[i].pkg_price
                                //         reslt[i].pkg_price = result[0].price
                                //         reslt[i].retail_price = result[0].retail_price
                                        
                                //     } else {
                                //         let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND dealer_id = " + verify.user.connected_dealer + " AND package_id = " + reslt[i].id);
                                //         if (result && result.length) {
                                //             reslt[i].costPrice = reslt[i].pkg_price
                                //             reslt[i].pkg_price = result[0].price
                                //             reslt[i].retail_price = reslt[i].pkg_price
                                            
                                //         } else {
                                //             let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                //             if (result && result.length) {
                                //                 reslt[i].costPrice = reslt[i].pkg_price
                                //                 reslt[i].pkg_price = result[0].price
                                //                 reslt[i].retail_price = reslt[i].pkg_price
                                                
                                //             } else {
                                //                 reslt[i].costPrice = reslt[i].pkg_price
                                //                 reslt[i].retail_price = reslt[i].pkg_price
                                                
                                //             }
                                //         }
                                //     }
                                // }

                            }

                            let permissionDealers = await helpers.getDealersAgainstPermissions(reslt[i].id, 'package', dealer_id, sdealerList, loggedUserType);

                            reslt[i].dealers = permissionDealers.allDealers;
                            reslt[i].statusAll = permissionDealers.statusAll;

                            // if (permissionDealers && permissionDealers.length && permissionDealers[0].dealer_id === 0) {

                            //     let Update_sdealerList = sdealerList.map((dealer) => {
                            //         return {
                            //             dealer_id: dealer,
                            //             dealer_type: permissionDealers[0].dealer_type,
                            //             permission_by: permissionDealers[0].permission_by
                            //         }
                            //     })
                            //     // let deleteIds = [];
                            //     // Update_sdealerList.forEach((item) => {
                            //     //     if (item.dealer_type === "admin") {
                            //     //         let index = Update_sdealerList.findIndex((sd) => sd.dealer_type === "dealer" && sd.dealer_id === item.dealer_id);
                            //     //         deleteIds.push(index);
                            //     //     }
                            //     // })
                            //     // console.log("deleteIds index: ", deleteIds);
                            //     let final_list = Update_sdealerList.filter((item) => item.dealer_id !== dealer_id)
                            //     reslt[i].dealers = JSON.stringify(final_list);
                            //     reslt[i].statusAll = true
                            // } else {
                            //     if (permissionDealers.length) {
                            //         permissionDealers = permissionDealers.filter((item) => item.dealer_id !== dealer_id)
                            //     }
                            //     reslt[i].dealers = JSON.stringify(permissionDealers);
                            //     reslt[i].statusAll = false
                            // }

                            let permissions = (reslt[i].dealers !== undefined && reslt[i].dealers !== null) ? JSON.parse(reslt[i].dealers) : [];
                            let permissionCount = 0
                            // if (loggedUserType === constants.DEALER) {
                            //     permissions = permissions.filter((item) => sdealerList.includes(item))
                            // }
                            // if (loggedUserType === DEALER) {
                            //     permissions = permissions.filter(function (item) {
                            //         for (let i = 0; i < sdealerList.length; i++) {
                            //             if (item === sdealerList[i].dealer_id) {
                            //                 return item
                            //             }
                            //         }
                            //     })
                            // }
                            permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                            let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                            // console.log(permissionC);
                            // console.log(dealerCount, permissionCount, permissionC);
                            reslt[i].dealer_permission = permissions;
                            reslt[i].permission_count = permissionC;
                            // packages.push(dta);
                        }
                        // console.log(reslt, 'reslt data of prices')
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: reslt

                        })
                        return

                    } else {
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "Data Not found"), // "Data found",
                            data: []

                        })
                        return
                    }
                })
            }
            else {
                res.send({
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                    data: []

                })
                return
            }
        } else {

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: []

            })
        }
    }
}

exports.getHardwares = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // let dealer_id = req.params.dealer_id;
        let dealer_id = verify.user.dealer_id;

        if (dealer_id) {
            let selectQuery = '';
            // if (verify.user.user_type === ADMIN) {
            selectQuery = "SELECT * FROM hardwares WHERE (delete_status != 1 OR  delete_status IS NULL)  AND (dealer_id='" + dealer_id + "' OR dealer_type = 'super_admin')";
            // }
            // else if (verify.user.user_type === DEALER) {
            //     selectQuery = "SELECT * FROM hardwares WHERE (delete_status != 1 OR  delete_status IS NULL)  AND (dealer_id='" + dealer_id + "' OR dealer_type = 'super_admin')";
            //     // selectQuery = "select dealer_hardwares_prices.price as hardware_price ,dealer_hardwares_prices.retail_price   ,  hardwares.* from dealer_hardwares_prices join hardwares on hardwares.id = dealer_hardwares_prices.hardware_id where dealer_hardwares_prices.dealer_id = '" + dealer_id + "' OR  dealer_hardwares_prices.created_by = 'admin' AND hardwares.delete_status != 1";
            // }
            if (selectQuery) {
                sql.query(selectQuery, async (err, reslt) => {
                    if (err) {
                        console.log(err)
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No Data found"), // "Data found",
                            data: []

                        })
                        return
                    }

                    if (reslt && reslt.length) {
                        
                            // if (verify.user.user_type !== SDEALER) {
                            for (var i = 0; i < reslt.length; i++) {
                                if (verify.user.user_type === ADMIN) {
                                    if (reslt[i].dealer_type === 'super_admin') {
                                        let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'admin' AND hardware_id = " + reslt[i].id);
                                        if (result && result.length) {
                                            reslt[i].hardware_price = result[0].price
                                        }
                                    }
                                }
                                else if (verify.user.user_type === DEALER) {
                                    if (reslt[i].dealer_type === 'super_admin') {
                                        let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'dealer' AND hardware_id = " + reslt[i].id + " AND dealer_id = " + dealer_id + "");
                                        if (result && result.length) {
                                            reslt[i].hardware_price = result[0].price
                                            reslt[i].retail_price = result[0].retail_price
                                        } else {
                                            let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'admin' AND hardware_id = " + reslt[i].id);
                                            if (result && result.length) {
                                                reslt[i].hardware_price = result[0].price
                                                reslt[i].retail_price = result[0].price
                                            } else {
                                                reslt[i].retail_price = reslt[i].hardware_price
                                            }
                                        }
                                    }
                                    // else if (reslt[i].dealer_type === 'admin') {

                                    //     let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'dealer' AND hardware_id = " + reslt[i].id + " AND dealer_id = " + dealer_id + "");
                                    //     if (result && result.length) {
                                    //         reslt[i].hardware_price = result[0].price
                                    //     }
                                    // }
                                } else {
                                    if (reslt[i].dealer_type === 'super_admin') {
                                        let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'sdealer' AND hardware_id = " + reslt[i].id + " AND dealer_id = " + dealer_id + "");
                                        if (result && result.length) {
                                            reslt[i].hardware_price = result[0].price
                                            reslt[i].retail_price = result[0].retail_price
                                        } else {
                                            let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'dealer' AND hardware_id = " + reslt[i].id + " AND dealer_id = " + verify.user.connected_dealer + "");
                                            if (result && result.length) {
                                                reslt[i].hardware_price = result[0].price
                                                reslt[i].retail_price = result[0].price
                                            } else {
                                                let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'admin' AND hardware_id = " + reslt[i].id);
                                                if (result && result.length) {
                                                    reslt[i].hardware_price = result[0].price
                                                    reslt[i].retail_price = result[0].price
                                                } else {
                                                    reslt[i].retail_price = reslt[i].hardware_price
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            // }
                            // console.log(reslt, 'reslt data of prices')
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                                data: reslt

                            })
                            return
                    
                    } else {
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: []

                        })
                        return
                    }
                })
            }
            else {
                res.send({
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                    data: []

                })
                return
            }
        } else {

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: []

            })
        }
    }
}

exports.getParentPackages = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // console.log(verify.user);
        let selectQuery = ""
        // console.log(verify.user);
        let loggedUserId = verify.user.dealer_id;
        let loggedUserType = verify.user.user_type;

        if (loggedUserId) {
            let condition = '';
            if (loggedUserType === DEALER) {
                condition = ` OR (dealer_permissions.dealer_id = 0 AND dealer_permissions.dealer_type = 'admin') `
            }
            else if (loggedUserType === SDEALER) {
                let getParentId = await sql.query(`SELECT connected_dealer FROM dealers WHERE dealer_id = ${loggedUserId}`);
                condition = ` OR (dealer_permissions.dealer_id = 0 AND (dealer_permissions.dealer_type='admin' OR (dealer_permissions.dealer_type='dealer' AND dealer_permissions.permission_by=${getParentId[0].connected_dealer}))) `
            }

            // selectQuery = "select packages.* from dealer_packages join packages on packages.id = dealer_packages.package_id where dealer_packages.dealer_id = ' " + dealer_id + "' AND packages.delete_status != 1";
            selectQuery = `SELECT packages.* FROM packages JOIN dealer_permissions ON (packages.id = dealer_permissions.permission_id) WHERE (dealer_permissions.dealer_id = '${loggedUserId}' ${condition}) AND packages.delete_status != 1 AND dealer_permissions.permission_type = 'package';`;
            // console.log("selectQuery ", selectQuery)
            sql.query(selectQuery, async (err, reslt) => {
                if (err) {
                    console.log(err)
                }
                if (reslt.length) {
                    // console.log("reslt getParentPackages ", reslt)

                    for (let i = 0; i < reslt.length; i++) {
                        if (verify.user.user_type === DEALER) {
                            if (reslt[i].dealer_type === 'super_admin') {
                                let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                if (result && result.length) {
                                    reslt[i].pkg_price = result[0].price
                                }
                                let dealerResult = await sql.query("SELECT * from dealer_packages_prices WHERE dealer_id = " + verify.user.id + " AND package_id = " + reslt[i].id);
                                if (dealerResult && dealerResult.length) {
                                    reslt[i].retail_price = dealerResult[0].retail_price
                                } else {
                                    if (result && result.length) {
                                        reslt[i].retail_price = result[0].pkg_price
                                    } else {
                                        reslt[i].retail_price = reslt[i].pkg_price
                                    }
                                }
                            } else {
                                let dealerResult = await sql.query("SELECT * from dealer_packages_prices WHERE dealer_id = " + verify.user.id + " AND package_id = " + reslt[i].id);
                                if (dealerResult && dealerResult.length) {
                                    reslt[i].retail_price = dealerResult[0].retail_price
                                } else {
                                    reslt[i].retail_price = reslt[i].pkg_price
                                }
                            }
                        }
                        else if (verify.user.user_type === SDEALER) {
                            if (reslt[i].dealer_type === 'super_admin' || reslt[i].dealer_type === 'admin') {
                                let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND package_id = " + reslt[i].id + " AND dealer_id = " + verify.user.connected_dealer);
                                if (result && result.length) {
                                    reslt[i].pkg_price = result[0].price
                                    reslt[i].retail_price = result[0].retail_price
                                } else {
                                    let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                    if (result && result.length) {
                                        reslt[i].pkg_price = result[0].price
                                        reslt[i].retail_price = result[0].retail_price
                                    } else {
                                        reslt[i].retail_price = reslt[i].pkg_price
                                    }
                                }
                                let sdealerResult = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND package_id = " + reslt[i].id + " AND dealer_id = " + verify.user.id);
                                if (sdealerResult && sdealerResult.length) {
                                    reslt[i].retail_price = sdealerResult[0].retail_price
                                }

                            }
                        }
                    }
                    // console.log(reslt)
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                        data: reslt
                    })
                }
                else {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "Data not found"), // "Data found",
                        data: []
                    })
                }
            })
        } else {

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: []

            })
        }
    }
}

exports.getProductPrices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // console.log(verify.user);
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            if (verify.user.user_type === DEALER) {

                let selectQuery = "SELECT * FROM prices WHERE dealer_type='admin'";
                sql.query(selectQuery, async (err, reslt) => {
                    // console.log(reslt.length);
                    if (err) {
                        console.log(err)
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: []
                        })
                        return

                    }

                    if (reslt.length) {
                        // console.log(reslt);
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: reslt

                        })
                    } else {

                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DETAIL_FOUND], "No detail found"), // "Data found",
                            data: []
                        })
                    }
                })

            }
            else if (verify.user.user_type === SDEALER) {

                let selectQuery = "SELECT * FROM prices WHERE dealer_type='dealer' AND dealer_id= " + verify.user.connected_dealer;
                sql.query(selectQuery, async (err, reslt) => {
                    if (err) {
                        console.log(err)
                    }

                    if (reslt.length) {
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: reslt

                        })
                    } else {
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "Data found"), // "Data found",
                            data: []
                        })
                    }
                })

            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "Data not found"), // "Data found",
                    data: []
                })
            }
        } else {

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: []

            })
        }
    }
}

exports.getHardwarePrices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        let selectQuery = ""
        // console.log(verify.user);
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            selectQuery = "select * FROM hardwares WHERE delete_status != 1";
            sql.query(selectQuery, async (err, reslt) => {
                if (err) {
                    console.log(err)
                }
                if (reslt.length) {
                    for (let i = 0; i < reslt.length; i++) {
                        if (verify.user.user_type === DEALER) {
                            let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'admin' AND hardware_id = " + reslt[i].id);
                            if (result && result.length) {
                                reslt[i].hardware_price = result[0].price
                            }
                        }
                        else if (verify.user.user_type === SDEALER) {
                            let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'dealer' AND hardware_id = " + reslt[i].id);
                            if (result && result.length) {
                                reslt[i].hardware_price = result[0].price
                            } else {
                                let result = await sql.query("SELECT * from dealer_hardwares_prices WHERE created_by = 'admin' AND hardware_id = " + reslt[i].id);
                                if (result && result.length) {
                                    reslt[i].hardware_price = result[0].price
                                }
                            }
                        }
                    }
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                        data: reslt
                    })
                }
                else {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "Data not found"), // "Data found",
                        data: []
                    })
                }
            })
        } else {

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: []

            })
        }
    }
}

exports.checkPackageName = async function (req, res) {

    try {
        var verify = req.decoded; // await verifyToken(req, res);

        if (verify) {
            let name = req.body.name !== undefined ? req.body.name : null;

            let checkExistingQ = "SELECT pkg_name FROM packages WHERE pkg_name='" + name + "' AND delete_status != 1";

            let checkExisting = await sql.query(checkExistingQ);
            console.log(checkExistingQ, 'query is')
            if (checkExisting.length) {
                data = {
                    status: false,
                };
                res.send(data);
                return;
            }
            else {
                data = {
                    status: true,
                };
                res.send(data);
                return;
            }
        }
    } catch (error) {
        console.log(error);
    }

}

exports.newRequests = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let query = ''
            // console.log(verify.user);
            if (verify.user.user_type === ADMIN) {
                query = "SELECT * from credit_requests where status = '0' AND dealer_type = 'dealer'"
            } else {
                let sdealers = await helpers.getSdealersByDealerId(verify.user.id)
                // console.log(sdealers);
                if (sdealers.length) {
                    query = `SELECT * from credit_requests where status = '0' AND dealer_type = 'sdealer' AND dealer_id IN (${sdealers.join()})`
                } else {
                    data = {
                        "status": false,
                        "data": []
                    };
                    res.send(data);
                    return
                }
            }
            console.log(query);
            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    data = {
                        "status": true,
                        "data": result
                    };
                    res.send(data);
                    return
                } else {
                    data = {
                        "status": true,
                        "data": []
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}

exports.getUserCredits = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let query = ''
            query = `SELECT * from financial_account_balance where dealer_id= ${verify.user.id}`

            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result && result.length) {
                    data = {
                        "status": true,
                        "credits": result[0].credits,
                        "credits_limit": result[0].credits_limit

                    };
                    res.send(data);
                    return
                } else {
                    data = {
                        "status": true,
                        "credits": 0,
                        "credits_limit": 0
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

exports.deleteRequest = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let id = req.params.id
            let query = "SELECT * from credit_requests where id = " + id + " and  status = '0'"
            sql.query(query, async function (err, result) {
                if (err) {
                    return res.send({
                        status: false,
                        msg: 'Error: Internel Server Error'
                    });
                }
                if (result.length) {

                    let updateQuery = "update credit_requests set status = 1, del_status = 1 where id= " + id
                    sql.query(updateQuery, async function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.send({
                                status: false,
                                msg: 'Error: Internel Server Error'
                            });
                        }
                        if (result && result.affectedRows > 0) {
                            data = {
                                "status": true,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.REQUEST_DELETED_SUCCESSFULLY], "Request deleted successfully"), // Request deleted successfully."
                            };
                            res.send(data);
                            return
                        } else {
                            data = {
                                "status": false,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.REQUEST_NOT_DELETED], "Request not deleted please try again"), // Request not deleted please try again."
                            };
                            res.send(data);
                            return
                        }
                    })

                } else {
                    data = {
                        "status": false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_IS_ALREADY_DELETED], "Request is already deleted"), // "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error)
            return res.send({
                status: false,
                msg: 'Error: Internel Server Error'
            });
        }
    }
}

exports.deleteSaPackage = async function (req, res) {
    var verify = req.decoded;

    if(verify.user.user_type !== constants.SUPER_ADMIN){
        return res.send({
            status: false,
            msg: 'Error: unauthorized access'
        });
    }

    if (verify) {

        let data = req.body.data;
        if (data) {
            console.log('data is: delteSaPackage ', data);
            let deletePkgQ = `UPDATE packages SET delete_status = 1 WHERE pkg_name = '${data.pkg_name}'`
            console.log("deletePkgQ ", deletePkgQ);
            let result = await sql.query(deletePkgQ);

            if (result && result.affectedRows) {
                res.send({ status: true })
            } else {
                res.send({ status: false });
            }
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
            return
        }
    }
}

exports.deleteSaHardware = async function (req, res) {
    var verify = req.decoded;

    if(verify.user.user_type !== constants.SUPER_ADMIN){
        return res.send({
            status: false,
            msg: 'Error: unauthorized access'
        });
    }

    if (verify) {

        let data = req.body.data;
        if (data) {
            console.log('data is: deleteSaHardware ', data);
            let deleteHdwQ = `UPDATE hardwares SET delete_status = 1 WHERE hardware_name = '${data.name}'`
            console.log("deleteHdwQ ", deleteHdwQ);
            let result = await sql.query(deleteHdwQ);

            if (result && result.affectedRows) {
                res.send({ status: true })
            } else {
                res.send({ status: false });
            }
        } else {
            res.send({ status: false });
        }
    }
}

exports.editSaHardware = async function (req, res) {
    var verify = req.decoded;

    if(verify.user.user_type !== constants.SUPER_ADMIN){
        return res.send({
            status: false,
            msg: 'Error: unauthorized access'
        })
    }

    if (verify) {

        let data = req.body.data;
        if (data) {
            console.log('data is: editSaHardware ', data);
            let editHdwQ = `UPDATE hardwares SET hardware_name = '${data.new_name}', hardware_price = ${data.new_price} WHERE hardware_name = '${data.name}'`
            console.log("editHdwQ ", editHdwQ);
            let result = await sql.query(editHdwQ);

            if (result && result.affectedRows) {
                res.send({ status: true })
            } else {
                res.send({ status: false });
            }

        } else {
            res.send({ status: false });
        }
    }
}

exports.getCancelServiceRequests = async function (req, res) {
    var verify = req.decoded;

    if (verify) {



        let requestsQuery = `SELECT s.*,
        d.device_id AS device_id , ua.link_code as dealer_pin
           FROM services_data AS s
           JOIN usr_acc AS ua
               ON ua.id = s.user_acc_id
           JOIN devices AS d
               ON ua.device_id = d.id
           WHERE s.status = 'request_for_cancel' ORDER BY  s.id DESC`

        sql.query(requestsQuery, function (err, results) {
            if (err) {
                console.log(err);
                return res.send({
                    status: false,
                    data: []
                })
            }
            if (results.length) {
                console.log(results);
                // let currentDate = moment()                let service_term = moment(request.service_expiry_date).diff(moment(request.start_date), 'month', true)

                results.map((request) => {
                    let preTotalPrice = request.total_credits
                    let requestExpiryDate = moment(new Date(request.service_expiry_date))
                    let requestStartDate = moment(new Date(request.start_date))
                    let dateNow = moment(new Date())
                    let serviceRemainingDays = requestExpiryDate.diff(dateNow, 'days') + 1
                    let totalDays = requestExpiryDate.diff(requestStartDate, 'days')
                    let creditsToRefund = Math.floor((preTotalPrice / totalDays) * serviceRemainingDays)
                    // let service_term = requestExpiryDate.diff(requestStartDate, 'month', true)
                    request.service_remaining_days = serviceRemainingDays
                    request.credits_to_refund = creditsToRefund
                    // request.service_term = service_term
                })
                return res.send({
                    status: true,
                    data: results
                })
            } else {
                return res.send({
                    status: true,
                    data: []
                })
            }
        });
    }
}
