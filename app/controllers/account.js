const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
const device_helpers = require('../../helper/device_helpers');
var app_constants = require('../../config/constants');
var XLSX = require('xlsx');
var path = require('path');
var fs = require("fs");

// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"


exports.getProfiles = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    // if (verify.status === true) {
    if (verify) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);
        // console.log('user id si', user_acc_id);
        let where = "where";
        let isValid = true;
        let profiles = [];
        // console.log('d_id', user_acc_id);
        if (user_acc_id != undefined && user_acc_id != '' && user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

        } else {
            where = "";
        }

        if (isValid) {
            let query = "SELECT * FROM usr_acc_profile " + where;

            // console.log("getprofiles query", query);
            sql.query(query, async function (error, results) {

                for (var i = 0; i < results.length; i++) {
                    // console.log('push apps', results[i].push_apps)
                    let controls = (results[i].controls !== undefined && results[i].controls !== null) ? JSON.parse(results[i].controls) : JSON.parse('[]');;
                    let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : JSON.parse('[]');
                    let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : JSON.parse('[]');
                    let passwords = (results[i].passwords !== undefined && results[i].passwords !== null) ? JSON.parse(results[i].passwords) : JSON.parse('[]');

                    dta = {
                        id: results[i].id,
                        profile_name: results[i].profile_name,
                        controls: controls,
                        secure_apps: secure_apps,
                        app_list: app_list2,
                        passwords: passwords
                    }
                    profiles.push(dta);
                }
                //  console.log('profile',result)
                data = {
                    "status": true,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // successful',
                    "profiles": profiles
                };
                res.send(data);
            });

        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], MsgConstants.INVALID_USER), // Invalid User'
            };
            res.send(data);
        }
    }

}


// id & packages

exports.saveNewData = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var loggedInuid = verify.user.id;
        if (req.body.type == 'sim_id') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
            }
        } else if (req.body.type == 'chat_id') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE chat_ids (chat_id) value ('" + row.chat_id + "')");
            }
        } else if (req.body.type == 'pgp_email') {
            for (let row of req.body.newData) {
                let result = await sql.query("INSERT IGNORE pgp_emails (pgp_email) value ('" + row.pgp_email + "')");
            }
        }
        data = {
            "status": true,
            "msg": await helpers.convertToLang(req.translation[MsgConstants.INSERTED_SUCCESSFULLY], MsgConstants.INSERTED_SUCCESSFULLY), // Inserted Successfully"
        }
        res.send(data)
        return
    } else {
        res.send({
            "status": false,
        })
        return
    }
}

exports.importIDs = async (req, res) => {
    // res.setHeader('Content-Type', 'multipart/form-data');
    // console.log(req);

    var verify = req.decoded; // await verifyToken(req, res);
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        res.setHeader('Content-Type', 'multipart/form-data');
        // let filename = '';
        let fieldName = req.params.fieldName;
        let data = req.body.parsedData;
        if (fieldName == 'sim_ids') {
            for (let row of data) {
                if (row.sim_id && row.start_date && row.expiry_date) {
                    // let result = await sql.query("INSERT sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
                    let insertQ = `INSERT IGNORE INTO sim_ids (sim_id, start_date, expiry_date) value ( '${row.sim_id}','${row.start_date}', '${row.expiry_date}')`;
                    await sql.query(insertQ);
                }
            }
            res.send({
                status: true
            })
            return
        } else if (fieldName == 'chat_ids') {
            for (let row of data) {
                if (row.chat_id) {
                    let insertQ = `INSERT IGNORE INTO chat_ids (chat_id) value ('${row.chat_id}')`;
                    await sql.query(insertQ);
                }
            }
            res.send({
                status: true
            })
            return
        } else if (fieldName == 'pgp_emails') {

            for (let row of data) {
                if (row.pgp_email) {
                    let insertQ = `INSERT IGNORE INTO pgp_emails (pgp_email) value ('${row.pgp_email}')`;
                    await sql.query(insertQ);
                }
            }
            res.send({
                status: true
            })
            return
        } else {
            res.send({
                status: false,
            })
        }
    }
}


exports.exportIDs = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        console.log("exporting data");
        let fieldName = req.params.fieldName;
        if (verify.user.user_type === ADMIN) {
            let query = '';
            if (fieldName === "sim_ids") {
                query = "SELECT * FROM sim_ids ";
            } else if (fieldName === "chat_ids") {
                query = "SELECT * FROM chat_ids "
            } else if (fieldName === "pgp_emails") {
                query = "SELECT * FROM pgp_emails ";
            }
            sql.query(query, async (error, response) => {
                if (error) {
                    console.log(error);
                }
                if (response.length) {
                    var data = [];

                    if (fieldName === "sim_ids") {
                        response.forEach((sim_id) => {
                            data.push({
                                sim_id: sim_id.sim_id,
                                start_date: sim_id.start_date,
                                expiry_date: sim_id.expiry_date,
                                used: sim_id.used
                            });
                        });
                    } else if (fieldName === "chat_ids") {
                        response.forEach((chat_id) => {
                            data.push({
                                chat_id: chat_id.chat_id,
                                used: chat_id.used
                            });
                        });
                    } else if (fieldName === "pgp_emails") {
                        response.forEach((pgp_email) => {
                            data.push({
                                pgp_email: pgp_email.pgp_email,
                                used: pgp_email.used
                            });
                        });
                    }

                    /* this line is only needed if you are not adding a script tag reference */

                    if (data.length) {
                        /* make the worksheet */
                        var ws = XLSX.utils.json_to_sheet(data);

                        /* add to workbook */
                        var wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, "People");

                        /* generate an XLSX file */
                        let fileName = fieldName + '_' + Date.now() + ".xlsx";
                        await XLSX.writeFile(wb, path.join(__dirname, "../../uploads/" + fileName));

                        res.send({
                            path: fileName,
                            status: true
                        });
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_TO_IMPORT], MsgConstants.NO_DATA_TO_IMPORT), // "no data to import"
                        }
                        res.send(data)
                    }

                }
            })
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], MsgConstants.ACCESS_FORBIDDEN), // "access forbidden"
            }
            res.send(data)
        }
    }
}

exports.getSimIDs = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        let query = "select * from sim_ids where used=0";
        sql.query(query, async function (error, resp) {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // "data success",
                data: resp
            }
            res.send(data);
        });
    } else {
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], MsgConstants.ACCESS_FORBIDDEN), // "access forbidden"
        }
        res.send(data)
    }

}

exports.getAllSimIDs = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from sim_ids";
        sql.query(query, async function (error, resp) {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // "data success",
                data: resp
            }
            res.send(data);
        });
    } else {
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], MsgConstants.ACCESS_FORBIDDEN), // "access forbidden"
        }
        res.send(data)
    }

}

// exports.getUsedSimIDs = async function (req, res) {
//     var verify = req.decoded; // await verifyToken(req, res);
//     if (verify) {
//         var loggedInuid = verify.user.id;
//         let query = "select * from sim_ids where used=1";
//         sql.query(query, async function (error, resp) {
//             data = {
//                 status: false,
//                 msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // "data success",
//                 data: resp
//             }
//             res.send(data);
//         });
//     }
//     else {
//         data = {
//             status: false,
//             msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], MsgConstants.ACCESS_FORBIDDEN), // "access forbidden"
//         }
//         res.send(data)
//     }
// }


exports.getChatIDs = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from chat_ids where used=0";
        sql.query(query, async function (error, resp) {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // "data success",
                data: resp
            });
        });
    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], MsgConstants.ACCESS_FORBIDDEN), // "access forbidden"
        })
    }
}


exports.getAllChatIDs = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from chat_ids";
        sql.query(query, async function (error, resp) {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // "data success",
                data: resp
            });
        });
    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], MsgConstants.ACCESS_FORBIDDEN), // "access forbidden"
        })
    }
}




exports.getPGPEmails = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from pgp_emails where used=0";
        sql.query(query, async function (error, resp) {
            res.send({
                status: false,
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


exports.getAllPGPEmails = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from pgp_emails";
        sql.query(query, async function (error, resp) {
            res.send({
                status: false,
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

exports.getUsedPGPEmails = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from pgp_emails where used=1 AND user_acc_id is null";
        sql.query(query, async function (error, resp) {
            res.send({
                status: false,
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

exports.getUsedSimIDs = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from sim_ids where used=1 AND user_acc_id is null";
        sql.query(query, async function (error, resp) {
            res.send({
                status: false,
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
// exports.getPackages = async (req, res) => {
//     var verify = req.decoded; // await verifyToken(req, res);
//     if (verify) {
//         var loggedInuid = verify.user.id;
//         let query = "select * from sim_ids where used=1 AND user_acc_id is null";
//         sql.query(query, async function (error, resp) {
//             res.send({
//                 status: false,
//                 msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // "data success",
//                 data: resp
//             });
//         });
//     }
//     else {
//         res.send({
//             status: false,
//             msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], MsgConstants.ACCESS_FORBIDDEN), // "access forbidden"
//         })
//     }
// }


exports.getUsedChatIDs = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from chat_ids where used=1 AND user_acc_id is null";
        sql.query(query, async function (error, resp) {
            res.send({
                status: false,
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

exports.deleteCSV = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    var fieldName = req.params.fieldName
    var ids = req.body.ids
    if (verify) {
        try {
            if (fieldName === 'pgp_email') {
                var idsName = ids.map((item) => {
                    return item.pgp_email
                })
                let query = "DELETE FROM pgp_emails where pgp_email IN ('" + idsName.join("','") + "')";
                console.log(query);
                sql.query(query, (error, resp) => {
                    if (error) throw error
                    if (resp.affectedRows) {
                        let query = "select * from pgp_emails where used=1";
                        sql.query(query, (error, resp) => {
                            res.send({
                                status: true,
                                type: 'pgp',
                                msg: "CSV Released Successfully.",
                                data: resp
                            });
                        });
                    } else {
                        res.send({
                            status: false,
                            msg: "CSV Not Released.",
                        });
                    }
                });
            }
            else if (fieldName === 'sim_id') {
                var idsName = ids.map((item) => {
                    return item.sim_id
                })
                let query = "DELETE FROM sim_ids where sim_id IN (" + idsName.join() + ")";
                console.log(query);
                sql.query(query, (error, resp) => {
                    if (error) throw error
                    if (resp.affectedRows) {
                        res.send({
                            status: true,
                            type: 'sim',
                            msg: "CSV Released Successfully.",
                            data: resp
                        });
                    } else {
                        res.send({
                            status: false,
                            msg: "CSV Not Released.",
                        });
                    }
                });
            }
            else if (fieldName === 'chat_id') {
                var idsName = ids.map((item) => {
                    return item.chat_id
                })
                let query = "DELETE FROM chat_ids where chat_id IN ('" + idsName.join("','") + "')";
                console.log(query);
                sql.query(query, (error, resp) => {
                    if (error) throw error
                    if (resp.affectedRows) {
                        res.send({
                            status: true,
                            type: 'chat',
                            msg: "CSV Released Successfully.",
                            data: resp
                        });
                    } else {
                        res.send({
                            status: false,
                            msg: "CSV Not Released.",
                        });
                    }
                });
            }

        }
        catch (err) {
            console.log(err);
            res.send({
                status: false,
                msg: "CSV Not Released.",
            });
            return
        }
    }
}


// Purchase credits_CASH
exports.purchaseCredits = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        try {
            // console.log(req.body);
            let credits = req.body.data.credits
            let method = req.body.data.method
            let total_price = req.body.data.total
            let currency_price = req.body.data.currency_price
            let promo_code = req.body.data.promo_code
            let currency = req.body.data.currency
            let dealerId = verify.user.id
            // console.log(verify.user);
            console.log(currency_price);

            // return
            if (credits != undefined && credits != '' && credits != null) {

                if (promo_code != '') {

                } else {
                    let query = `INSERT INTO credit_purchase (dealer_id,credits,usd_price,currency_price,payment_method) VALUES (${dealerId},${credits},${total_price},${currency_price},'${method}')`;
                    // console.log(query);
                    sql.query(query, async function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        // console.log(result);
                        if (result.affectedRows > 0) {
                            if (verify.user.user_type === ADMIN) {
                                if (method == 'CASH') {
                                    axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then(async function (response) {
                                        if (response.data.status) {
                                            let data = {
                                                dealer_id: dealerId,
                                                dealer_name: verify.user.dealer_name,
                                                label: app_constants.APP_TITLE,
                                                credits: credits,
                                                dealer_email: verify.user.email
                                            }
                                            axios.post(app_constants.REQUEST_FOR_CREDITS, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                                                // console.log(response);
                                                if (response.data.status) {
                                                    res.send({
                                                        status: true,
                                                        msg: response.data.msg
                                                    })

                                                } else {
                                                    // console.log("object");
                                                    res.send({
                                                        status: false,
                                                        msg: response.data.msg
                                                    })
                                                }
                                            })
                                        }
                                        else {
                                            // console.log("NOT ALLOWED");
                                            res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.NOT_ALLOWED_TO_MAKE_REQUEST], MsgConstants.NOT_ALLOWED_TO_MAKE_REQUEST), // "Not allowed to make request.",
                                            })
                                            return
                                        }
                                    })

                                } else {
                                    res.send()
                                }
                            } else {
                                // console.log(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`);
                                sql.query(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`, async function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    if (result && result.affectedRows > 0) {
                                        res.send({
                                            status: true,
                                            msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_SUBMITTED_SUCCESSFULLY], MsgConstants.REQUEST_SUBMITTED_SUCCESSFULLY), // "Request submitted successfully.",
                                        })
                                        return
                                    }
                                    else {
                                        res.send({
                                            status: false,
                                            msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_NOT_SUBMITTED_SUCCESSFULLY], MsgConstants.REQUEST_NOT_SUBMITTED_SUCCESSFULLY), // "Request not submitted please try again.",
                                        })
                                    }
                                })

                            }
                        } else {
                            res.send()
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }

    }
}
exports.purchaseCredits_CC = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        try {
            let credits = req.body.creditInfo.credits
            let method = req.body.creditInfo.method
            let total_price = req.body.creditInfo.total * 100
            let currency_price = req.body.creditInfo.currency_price
            let promo_code = req.body.creditInfo.promo_code
            let currency = req.body.creditInfo.currency
            let cardNumber = req.body.cardInfo.number
            let cardName = req.body.cardInfo.name
            let cvc = req.body.cardInfo.cvc
            let expiryCard = req.body.cardInfo.expiry
            let dealerId = verify.user.id
            let stripeToken = null
            let cardExpiryMonth = expiryCard.slice(0, 2)
            let cardExpiryYear = 20 + expiryCard.slice(5)
            // console.log(cardExpiryMonth);
            // console.log(cardExpiryYear);
            // console.log(total_price.toFixed(2));


            // return
            if (credits != undefined && credits != '' && credits != null) {

                if (promo_code != '') {

                } else {
                    let query = `INSERT INTO credit_purchase (dealer_id,credits,usd_price,currency_price,payment_method) VALUES (${dealerId},${credits},${total_price},${currency_price},'${method}')`;
                    // console.log(query);
                    sql.query(query, async function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        // console.log(result);
                        if (result.affectedRows > 0) {
                            stripe.tokens.create({
                                card: {
                                    number: cardNumber,
                                    exp_month: cardExpiryMonth,
                                    exp_year: cardExpiryYear,
                                    cvc: cvc
                                }
                            }, async function (err, token) {
                                if (err) {
                                    console.log(err.type);
                                    switch (err.type) {
                                        case 'StripeCardError':
                                            // A declined card error
                                            console.log(err.message);
                                            err.message; // => e.g. "Your card's expiration year is invalid."
                                            break;
                                        case 'RateLimitError':
                                            // Too many requests made to the API too quickly
                                            break;
                                        case 'StripeInvalidRequestError':
                                            // Invalid parameters were supplied to Stripe's API
                                            break;
                                        case 'StripeAPIError':
                                            // An error occurred internally with Stripe's API
                                            break;
                                        case 'StripeConnectionError':
                                            // Some kind of error occurred during the HTTPS communication
                                            break;
                                        case 'StripeAuthenticationError':
                                            // You probably used an incorrect API key
                                            break;
                                        default:
                                            // Handle any other types of unexpected errors
                                            break;
                                    }
                                    res.send({
                                        status: false,
                                        msg: err.message
                                    })
                                    return
                                } else {
                                    stripeToken = token
                                    // console.log(token);
                                    stripe.charges.create({
                                        amount: total_price,
                                        currency: "usd",
                                        source: stripeToken.id, // obtained with Stripe.js
                                        metadata: { 'order_id': '6735' }
                                    }).then(async function (response) {
                                        if (response.status == 'succeeded') {
                                            res.send({
                                                status: true,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.PAYMENT_HAS_BEEN_DONE], MsgConstants.PAYMENT_HAS_BEEN_DONE), // "Payment has been done.",
                                            })
                                            return
                                        };
                                    });
                                }
                            });
                            if (verify.user.user_type === ADMIN) {



                            } else {
                                // console.log(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`);
                                sql.query(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`, async function (err, result) {
                                    if (err) {
                                        console.log(err)
                                    }
                                    if (result && result.affectedRows > 0) {
                                        res.send({
                                            status: true,
                                            msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_SUBMITTED_SUCCESSFULLY], MsgConstants.REQUEST_SUBMITTED_SUCCESSFULLY), // "Request submitted successfully.",
                                        })
                                        return
                                    }
                                    else {
                                        res.send({
                                            status: false,
                                            msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_NOT_SUBMITTED_SUCCESSFULLY], MsgConstants.REQUEST_NOT_SUBMITTED_SUCCESSFULLY), // "Request not submitted please try again.",
                                        })
                                    }
                                })

                            }
                        } else {
                            res.send()
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }

    }
}
exports.saveProfile = async function (req, res) {
    try {
        var verify = req.decoded; // await verifyToken(req, res);
        // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
            // console.log('body is', req.body)
            let name = req.body.profileName;
            let dealer_id = verify.user.id;
            let usr_acc_id = req.body.usr_acc_id;

            let app_list = (req.body.device_setting.app_list == undefined) ? '' : JSON.stringify(req.body.device_setting.app_list);

            let passwords = (req.body.device_setting.passwords == undefined) ? '' : JSON.stringify(req.body.device_setting.passwords);


            let controls = (req.body.device_setting.controls == undefined) ? '' : JSON.stringify(req.body.device_setting.controls);

            let permissions = (req.body.device_setting.extensions == undefined) ? '' : JSON.stringify(req.body.device_setting.extensions);

            var query = "select id from usr_acc_profile where profile_name = '" + name + "'";

            let result = await sql.query(query);


            if (result.length == 0 || name == '') {
                var applyQuery = "insert into usr_acc_profile (profile_name,dealer_id, user_acc_id, app_list,permissions, controls,passwords) values ('" + name + "', '" + dealer_id + "','" + usr_acc_id + "','" + app_list + "','" + permissions + "', '" + controls + "', '" + passwords + "')";
                // console.log('query insert', applyQuery);
                // console.log(applyQuery, 'thats it');

                sql.query(applyQuery, async function (err, rslts) {
                    if (err) {
                        console.log(err)
                    }
                    // console.log(rslts, 'rslt is query')
                    if (rslts.affectedRows) {
                        data = {
                            "status": true,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.PROFILE_SAV_SUCC], MsgConstants.PROFILE_SAV_SUCC), // Profile Saved Successfully
                            "data": rslts
                        };
                        res.send(data);
                    } else {
                        data = {
                            "status": false,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.PROFILE_NAME_IS_ALREADY_EXIST], MsgConstants.PROFILE_NAME_IS_ALREADY_EXIST), // Profile Name is already Exist
                        };
                        res.send(data);
                    }


                });

            } else {
                data = {
                    "status": false,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.PROFILE_NAME_IS_ALREADY_EXIST], MsgConstants.PROFILE_NAME_IS_ALREADY_EXIST), // Profile Name is already Exist',
                };
                res.send(data);
            }

        }
    } catch (error) {
        console.log(error)
    }
}