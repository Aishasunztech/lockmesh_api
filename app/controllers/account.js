const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
const device_helpers = require('../../helper/device_helpers');
var app_constants = require('../../config/constants');
const constants = require("../../constants/Application");
var XLSX = require('xlsx');
var path = require('path');
var fs = require("fs");
var axios = require("axios")
const stripe = require("stripe")("sk_test_zJjguM8s6HqyvOrhtPGDk0lV007cDt8U25");
// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"
let usr_acc_query_text = constants.usr_acc_query_text;


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
                    // console.log('push apps', results[i].controls)
                    let controls = (results[i].controls !== undefined && results[i].controls !== null && results[i].controls) ? JSON.parse(results[i].controls) : JSON.parse('[]');
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
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Successful"), // successful',
                    "profiles": profiles
                };
                res.send(data);
            });

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], "Invalid User"), // Invalid User'
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
            let sim_ids = []
            let all_sim_ids = await sql.query("SELECT sim_id from sim_ids")
            if (all_sim_ids.length) {
                all_sim_ids.map((item) => {
                    sim_ids.push(item.sim_id)
                })
            }
            console.log(sim_ids);
            for (let row of req.body.newData) {
                if (!sim_ids.includes(row.sim_id)) {
                    let result = await sql.query("INSERT sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
                }
            }
        } else if (req.body.type == 'chat_id') {
            let chat_ids = []
            let all_chat_ids = await sql.query("SELECT chat_id from chat_ids")
            if (all_chat_ids.length) {
                all_chat_ids.map((item) => {
                    chat_ids.push(item.sim_id)
                })
            }
            console.log(chat_ids);
            for (let row of req.body.newData) {
                if (!chat_ids.includes(row.chat_id)) {
                    let result = await sql.query("INSERT chat_ids (chat_id) value ('" + row.chat_id + "')");
                }
            }
        } else if (req.body.type == 'pgp_email') {
            let pgp_emails = []
            let all_pgp_emails = await sql.query("SELECT pgp_email from pgp_emails")
            if (all_pgp_emails.length) {
                all_pgp_emails.map((item) => {
                    pgp_emails.push(item.pgp_email)
                })
            }
            console.log(pgp_emails);
            for (let row of req.body.newData) {
                if (!pgp_emails.includes(row.pgp_email)) {
                    let result = await sql.query("INSERT pgp_emails (pgp_email) value ('" + row.pgp_email + "')");
                }
            }
        }
        data = {
            status: true,
            msg: await helpers.convertToLang(req.translation[MsgConstants.INSERTED_SUCCESSFULLY], "Inserted Successfully"), // Inserted Successfully"
        }
        res.send(data)
        return
    } else {
        res.send({
            status: false,
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
            let sim_ids = []
            let all_sim_ids = await sql.query("SELECT sim_id from sim_ids")
            if (all_sim_ids.length) {
                all_sim_ids.map((item) => {
                    sim_ids.push(item.sim_id)
                })
            }
            console.log(sim_ids);
            for (let row of data) {
                if (!sim_ids.includes(row.sim_id)) {
                    if (row.sim_id && row.start_date && row.expiry_date) {
                        // let result = await sql.query("INSERT sim_ids (sim_id, start_date, expiry_date) value ('" + row.sim_id + "', '" + row.start_date + "', '" + row.expiry_date + "')");
                        let insertQ = `INSERT INTO sim_ids (sim_id, start_date, expiry_date) value ( '${row.sim_id}','${row.start_date}', '${row.expiry_date}')`;
                        await sql.query(insertQ);
                    }
                }
            }
            res.send({
                status: true
            })
            return
        } else if (fieldName == 'chat_ids') {
            let chat_ids = []
            let all_chat_ids = await sql.query("SELECT chat_id from chat_ids")
            if (all_chat_ids.length) {
                all_chat_ids.map((item) => {
                    chat_ids.push(item.sim_id)
                })
            }
            console.log(chat_ids);
            for (let row of data) {
                if (!chat_ids.includes(row.chat_id)) {
                    if (row.chat_id) {
                        let insertQ = `INSERT INTO chat_ids (chat_id) value ('${row.chat_id}')`;
                        await sql.query(insertQ);
                    }
                }
            }
            res.send({
                status: true
            })
            return
        } else if (fieldName == 'pgp_emails') {
            let pgp_emails = []
            let all_pgp_emails = await sql.query("SELECT pgp_email from pgp_emails")
            if (all_pgp_emails.length) {
                all_pgp_emails.map((item) => {
                    pgp_emails.push(item.pgp_email)
                })
            }
            console.log(pgp_emails);
            for (let row of data) {
                if (!pgp_emails.includes(row.pgp_email)) {
                    if (row.pgp_email) {
                        let insertQ = `INSERT INTO pgp_emails (pgp_email) value ('${row.pgp_email}')`;
                        await sql.query(insertQ);
                    }
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
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_TO_IMPORT], "No data to import"), // "no data to import"
                        }
                        res.send(data)
                    }

                }
            })
        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "Access forbidden"), // "access forbidden"
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
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                data: resp
            }
            res.send(data);
        });
    } else {
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
        }
        res.send(data)
    }

}

exports.getAllSimIDs = async (req, res) => {
    var verify = req.decoded;
    if (verify) {
        let query = "";
        let type = verify.user.user_type;
        if (type === DEALER || type === SDEALER) {
            let userIDs = await helpers.getUserAccID(verify.user.dealer_id);
            query = `SELECT * FROM sim_ids WHERE used = '1' AND delete_status = '0' AND user_acc_id IN (${userIDs})`;
        } else {
            query = "SELECT * FROM sim_ids";
        }

        sql.query(query, async function (error, resp) {

            if (error) {
                console.log(error)
                res.send({
                    status: false,
                    msg: "Error",
                    data: []
                });
                return;
            }

            if (resp && resp.length) {
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                    data: resp
                }
                res.send(data);
            } else {
                data = {
                    status: false,
                    msg: "Error",
                    data: []
                }
                res.send(data);
            }
        });
    } else {
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
        }
        res.send(data)
    }

}

exports.resync_ids = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
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
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                data: resp
            });
        });
    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
        })
    }
}


exports.getAllChatIDs = async (req, res) => {
    var verify = req.decoded;
    if (verify) {
        let type = verify.user.user_type;
        if (type === DEALER || type === SDEALER) {
            let userIDs = await helpers.getUserAccID(verify.user.dealer_id);
            query = `SELECT * FROM chat_ids WHERE used = '1' AND delete_status = '0' AND user_acc_id IN (${userIDs})`;
        } else {
            query = "SELECT * FROM chat_ids";
        }

        sql.query(query, async function (error, resp) {
            if (error) {
                console.log(error)
                res.send({
                    status: false,
                    msg: "Error",
                    data: []
                });
                return;
            }

            if (resp && resp.length) {
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                    data: resp
                }
                res.send(data);
            } else {
                data = {
                    status: false,
                    msg: "Error",
                    data: []
                }
                res.send(data);
            }
            return;
        });
    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
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
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
        })
    }
}


exports.getAllPGPEmails = async (req, res) => {
    var verify = req.decoded;
    if (verify) {
        let type = verify.user.user_type;
        if (type === DEALER || type === SDEALER) {
            let userIDs = await helpers.getUserAccID(verify.user.dealer_id);
            query = `SELECT * FROM pgp_emails WHERE used = '1' AND delete_status = '0' AND user_acc_id IN (${userIDs})`;
        } else {
            query = "SELECT * FROM pgp_emails";
        }
        sql.query(query, async function (error, resp) {
            if (error) {
                console.log(error)
                res.send({
                    status: false,
                    msg: "Error",
                    data: []
                });
                return;
            }

            if (resp && resp.length) {
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                    data: resp
                }
                res.send(data);
            } else {
                data = {
                    status: false,
                    msg: "Error",
                    data: []
                }
                res.send(data);
            }
        });
    }
    else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
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
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
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
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
        })
    }
}

exports.getUsedChatIDs = async (req, res) => {
    var verify = req.decoded; // await verifyToken(req, res);
    if (verify) {
        var loggedInuid = verify.user.id;
        let query = "select * from chat_ids where used=1 AND user_acc_id is null";
        sql.query(query, async function (error, resp) {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                data: resp
            });
        });
    }
    else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
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
            console.log(verify.user);

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
                            // if (verify.user.user_type === ADMIN) {
                            if (method == 'CASH') {
                                console.log(app_constants.SUPERADMIN_LOGIN_URL);
                                axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then(async function (response) {
                                    if (response.data.status) {
                                        let data = {
                                            dealer_id: dealerId,
                                            dealer_name: verify.user.dealer_name,
                                            label: app_constants.APP_TITLE,
                                            credits: credits,
                                            dealer_email: verify.user.email,
                                            dealer_pin: (verify.user.user_type === ADMIN) ? 'N/A' : verify.user.link_code,
                                            request_id: result.insertId,
                                            account_type: verify.user.user_type
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
                                            msg: await helpers.convertToLang(req.translation[MsgConstants.NOT_ALLOWED_TO_MAKE_REQUEST], "Not allowed to make request"), // "Not allowed to make request.",
                                        })
                                        return
                                    }
                                })
                            } else {
                                res.send()
                            }
                            // } 
                            // else {
                            //     // console.log(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`);
                            //     sql.query(`INSERT into credit_requests (dealer_id,dealer_name,dealer_email,credits,dealer_type) VALUES (${dealerId},'${verify.user.dealer_name}','${verify.user.email}',${credits},'${verify.user.user_type}')`, async function (err, result) {
                            //         if (err) {
                            //             console.log(err);
                            //         }
                            //         if (result && result.affectedRows > 0) {
                            //             res.send({
                            //                 status: true,
                            //                 msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_SUBMITTED_SUCCESSFULLY], "Request submitted successfully"), // "Request submitted successfully.",
                            //             })
                            //             return
                            //         }
                            //         else {
                            //             res.send({
                            //                 status: false,
                            //                 msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_NOT_SUBMITTED_SUCCESSFULLY], "Request not submitted please try again"), // "Request not submitted please try again.",
                            //             })
                            //         }
                            //     })

                            // }
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

            if (credits != undefined && credits != '' && credits != null) {

                if (promo_code != '') {

                } else {
                    // console.log(result);
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
                                    axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                                        if (response.data.status) {
                                            let data = {
                                                credits: credits,
                                                payment_type: "CC",
                                                dealer_id: dealerId,
                                                dealer_pin: (verify.user.user_type === ADMIN) ? 'N/A' : verify.user.link_code,
                                                dealer_type: verify.user.user_type,
                                                dealer_name: verify.user.dealer_name,
                                                label: app_constants.APP_TITLE,
                                                dealer_email: verify.user.email
                                            }
                                            axios.post(app_constants.ADD_CREDITS_SALE_RECORD, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                                                if (response.data.status) {
                                                    let checkBalanceAccout = "SELECT * from financial_account_balance WHERE dealer_id = " + dealerId
                                                    let dealerBalanceData = await sql.query(checkBalanceAccout);
                                                    let addCreditsQ = ""
                                                    let totalCredits = 0
                                                    if (dealerBalanceData.length) {
                                                        totalCredits = dealerBalanceData[0].credits + credits
                                                        addCreditsQ = `UPDATE financial_account_balance SET credits = credits + ${credits} WHERE dealer_id = ${dealerId}`
                                                    } else {
                                                        totalCredits = credits
                                                        addCreditsQ = `INSERT INTO financial_account_balance (dealer_id,credits) VALUES(${dealerId} , ${credits})`
                                                    }

                                                    sql.query(addCreditsQ, async function (err, result) {
                                                        if (err) {
                                                            console.log(err);
                                                            res.send({
                                                                status: false,
                                                                msg: ""
                                                            })
                                                            return
                                                        }
                                                        if (result.affectedRows) {

                                                            let transection_credits = `INSERT INTO financial_account_transections (user_id,transection_data, credits ,transection_type , status) VALUES (${dealerId},'${JSON.stringify({ request_type: "Creedit Card request" })}' ,${credits} ,'debit' , 'transferred')`
                                                            await sql.query(transection_credits)

                                                            let query = `INSERT INTO credit_purchase (dealer_id,credits,usd_price,currency_price,payment_method) VALUES (${dealerId},${credits},${total_price},${currency_price},'${method}')`;
                                                            sql.query(query, async function (err, result) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    res.send({
                                                                        status: false,
                                                                        msg: ""
                                                                    })
                                                                    return
                                                                }
                                                                if (result.affectedRows > 0) {
                                                                    res.send({
                                                                        status: true,
                                                                        msg: await helpers.convertToLang(req.translation[MsgConstants.PAYMENT_HAS_BEEN_DONE], "Payment has been done"), // "Payment has been done.",
                                                                        credits: totalCredits
                                                                    })
                                                                    return
                                                                }
                                                            })
                                                        }

                                                    })
                                                } else {
                                                    console.log(err);
                                                    res.send({
                                                        status: false,
                                                        msg: "ERROR: Superadmin server not responding please try again later."
                                                    })
                                                    return
                                                }
                                            }).catch((err) => {
                                                console.log(err);
                                                res.send({
                                                    status: false,
                                                    msg: "ERROR: Superadmin server not responding please try again later."
                                                })
                                                return
                                            })
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                        res.send({
                                            status: false,
                                            msg: "ERROR: Superadmin server not responding please try again later."
                                        })
                                        return
                                    })
                                };
                            });
                        }
                    });


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

            var query = `SELECT id FROM usr_acc_profile WHERE profile_name = '${name}' AND user_acc_id= ${usr_acc_id}`;

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
                    if (rslts && rslts.affectedRows) {
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.PROFILE_SAV_SUCC], "Profile Saved Successfully"), // Profile Saved Successfully
                            data: {
                                app_list: app_list ? JSON.parse(app_list) : [],
                                controls: controls ? JSON.parse(controls) : [],
                                passwords: JSON.parse(passwords),
                                secure_apps: permissions ? JSON.parse(permissions) : [],
                                profile_name: name,
                                id: rslts.insertId
                            }
                        };
                        res.send(data);
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.PROFILE_NAME_IS_ALREADY_EXIST], "Profile Name is already Exist"), // Profile Name is already Exist
                        };
                        res.send(data);
                    }


                });

            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.PROFILE_NAME_IS_ALREADY_EXIST], "Profile Name is already Exist"), // Profile Name is already Exist',
                };
                res.send(data);
            }

        }
    } catch (error) {
        console.log(error)
    }
}

exports.savePackagePermissions = async function (req, res) {
    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var action = req.body.action
        let package_id = req.body.package_id;
        let dealers = req.body.dealers;
        // console.log(package_id);
        let prevPermissions = await sql.query("SELECT dealers FROM packages WHERE id = " + package_id);
        let prevParsDealers = (prevPermissions[0].dealers !== null && prevPermissions[0].dealers !== '' && prevPermissions[0].dealers !== 'null') ? JSON.parse(prevPermissions[0].dealers) : [];
        // console.log(prevPermissions[0].dealers, prevParsDealers, 'dalers for da', dealers)
        if (action === 'save') {
            var parsedDealers = JSON.parse(dealers);
            console.log(parsedDealers.length, 'parsed dealers')
            for (let i = 0; i < parsedDealers.length; i++) {
                if (prevParsDealers.indexOf(parsedDealers[i]) === -1) {
                    prevParsDealers.push(parsedDealers[i])
                }
            }
            let parsedCombineArray = JSON.stringify(prevParsDealers)
            let updateAPKQ = "UPDATE packages SET dealers = '" + parsedCombineArray + "' WHERE id=" + package_id;

            if (prevParsDealers.length) {
                let deleteNotIn = "DELETE FROM dealer_packages WHERE dealer_id NOT IN (" + prevParsDealers.join() + ") AND package_id = " + package_id;
                // console.log(deleteNotIn);
                await sql.query(deleteNotIn);
                let insertQuery = "INSERT IGNORE INTO dealer_packages (dealer_id, package_id) VALUES ";

                let insertOrIgnore = ' '
                for (let i = 0; i < prevParsDealers.length; i++) {
                    if (i === prevParsDealers.length - 1) {
                        insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + package_id + ")"
                    } else {
                        insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + package_id + "),"
                    }
                }
                await sql.query(insertQuery + insertOrIgnore);
            }

            sql.query(updateAPKQ, async (error, result) => {
                if (error) {
                    console.log(error);
                }
                let permissionC = [];
                let rslt = await sql.query("select dealers from packages where id='" + package_id + "' order by id ASC")
                if (rslt.length) {
                    if (rslt !== undefined && rslt !== null) {
                        let permission = JSON.parse(rslt[0].dealers);
                        console.log(rslt, 'reslt lenth')
                        // console.log("Verify user id", verify.user.user_type);
                        if (verify.user.user_type === ADMIN) {
                            if (permission !== undefined && permission !== null && permission !== '[]') {
                                let dealerRoleId = await helpers.getUserTypeIDByName(DEALER);
                                let dealerCount = await helpers.userDealerCount(dealerRoleId);
                                console.log('amdin add all', permission.length, dealerCount)
                                permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();
                            }
                        } else if (verify.user.user_type === DEALER) {
                            let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList ? sdealerList.length : 0;
                            // console.log("dealer count", dealerCount);
                            let Sdealerpermissions = permission.filter(function (item) {
                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (item === sdealerList[i].dealer_id) {
                                        return item
                                    }
                                }
                            })
                            // console.log("sdeler permissiosn", Sdealerpermissions);
                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;

                            permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                            // console.log(permissionC, 'permissions count')
                        }
                    };
                }
                if (result.affectedRows) {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_SAVED_SUCCESSFULLY], "Permission saved successfully"), // "Permission saved successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], "Permission couldn't be saved"), // "Permission couldn't be saved"
                    })
                }
            });
        } else {
            console.log(dealers, 'dealer list from front-end');
            dealers = JSON.parse(dealers);

            for (let i = 0; i < dealers.length; i++) {
                var index = prevParsDealers.indexOf(dealers[i]);
                console.log("array index", index);
                if (index > -1) {
                    prevParsDealers.splice(index, 1);
                }
            }
            console.log(prevParsDealers);
            let toDeleteDealers = (prevParsDealers.length > 0) ? prevParsDealers.join() : '""';

            let updateAPKQ = "UPDATE packages SET dealers = '" + JSON.stringify(prevParsDealers) + "' WHERE id=" + package_id;
            if (dealers.length) {
                let deleteNotIn = "DELETE FROM dealer_packages WHERE dealer_id NOT IN (" + toDeleteDealers + ") AND package_id = " + package_id;
                console.log(deleteNotIn);
                await sql.query(deleteNotIn);
                if (prevParsDealers.length > 0) {
                    let insertQuery = "INSERT IGNORE INTO dealer_packages (dealer_id, package_id) VALUES";

                    let insertOrIgnore = ' '
                    for (let i = 0; i < prevParsDealers.length; i++) {
                        if (i === prevParsDealers.length - 1) {
                            insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + package_id + ")"
                        } else {
                            insertOrIgnore = insertOrIgnore + "(" + prevParsDealers[i] + "," + package_id + "),"
                        }
                    }
                    console.log(insertQuery + insertOrIgnore);
                    await sql.query(insertQuery + insertOrIgnore);

                }
                // console.log(insertQuery + insertOrIgnore);
            }

            sql.query(updateAPKQ, async (error, result) => {
                if (error) {
                    console.log(error);
                }
                let permissionC = [];
                let rslt = await sql.query("select dealers from packages where id='" + package_id + "' order by id ASC")
                if (rslt.length) {
                    // console.log(rslt, ' do ti ');
                    if (rslt !== undefined && rslt !== null) {
                        let permission = JSON.parse(rslt[0].dealers);
                        console.log("Verify user id", verify.user.user_type);
                        if (verify.user.user_type === ADMIN) {
                            if (permission !== undefined && permission !== null && permission !== '[]') {
                                let dealerRoleId = await helpers.getUserTypeIDByName(DEALER);
                                let dealerCount = await helpers.userDealerCount(dealerRoleId);
                                permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();

                            }
                        }
                        else if (verify.user.user_type === DEALER) {
                            let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                            let dealerCount = sdealerList ? sdealerList.length : 0;
                            console.log("dasda", dealerCount);
                            let Sdealerpermissions = permission.filter(function (item) {
                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (item === sdealerList[i].dealer_id) {
                                        return item
                                    }
                                }
                            })
                            console.log("sadasdsad", Sdealerpermissions);
                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                            permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        }
                    };

                }
                if (result.affectedRows) {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_REMOVED_SUCCESSFULLY], "Permission Removed successfully"), // "Permission Removed successfully",
                        permission_count: permissionC,
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], "Permission couldn't be saved"), // "Permission couldn't be saved"
                    })
                }
            });

        }
    }
}

exports.ackCreditRequest = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let credits = req.body.data.credits
            let dealer_id = req.body.data.dealer_id
            let request_id = req.body.data.request_id
            let type = req.body.data.type

            if (dealer_id !== '' && dealer_id !== undefined && dealer_id !== null && request_id !== '' && request_id !== undefined && request_id !== null) {
                if (type === 'accepted') {
                    sql.query("SELECT * FROM credit_purchase where id = " + request_id + " AND accepted_status = 'pending'", async function (err, requests) {
                        if (err) {
                            res.send({
                                status: false,
                                msg: "No cash credit request found on whitelabel server."
                            })
                            return
                        }
                        if (requests.length) {
                            sql.query("SELECT * from financial_account_balance where dealer_id = " + dealer_id, async function (err, result) {
                                if (err) {
                                    console.log(err)
                                    res.send({
                                        status: false,
                                        msg: "Credits not updated please try again", // "Credits not updated please try again."
                                    })
                                    return
                                }
                                if (result.length) {
                                    let newCredit = credits + result[0].credits
                                    sql.query("update financial_account_balance set credits = " + newCredit + " where dealer_id = " + dealer_id, async function (err, reslt) {
                                        if (err) {
                                            console.log(err)
                                            res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_UPDATED], "Credits not updated please try again"), // "Credits not updated please try again."
                                            })
                                            return
                                        }

                                        if (reslt && reslt.affectedRows > 0) {
                                            await sql.query("update credit_purchase set accepted_status = 'accepted' where id = " + request_id)
                                            res.send({
                                                status: true,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully."
                                            })
                                            return

                                        }
                                        else {
                                            res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_UPDATED], "Credits not updated please try again"), // "Credits not updated please try again."
                                            })
                                            return

                                        }
                                    })
                                }
                                else {
                                    let query = `INSERT into financial_account_balance (dealer_id,credits) VALUES (${dealer_id}, ${credits})`;
                                    sql.query(query, async function (err, reslt) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (reslt && reslt.affectedRows > 0) {
                                            res.send({
                                                status: true,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully."
                                            })
                                            return
                                        }
                                        else {
                                            res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_UPDATED], "Credits not updated please try again"), // "Credits not updated please try again."
                                            })
                                            return

                                        }
                                    })
                                }
                            })
                        } else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[" "], "ERROR: No request found on whitelabel server."),
                            })
                            return
                        }
                    })
                } else if (type === 'rejected') {
                    sql.query("update credit_purchase set accepted_status = 'rejected' where id = " + request_id, async function (err, result) {
                        if (err) {
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(req.translation[""], "Request not deleted. Please try again.")
                            })
                            return
                        }
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[""], "Request Deleted Successfully."), // "Request Deleted successfully."
                        })
                        return
                    })
                }
            }
        } catch (error) {
            console.log(error)
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[""], "ERROR: White label server error occurred. Please try again."), // "Credits not updated please try again."
            })
            return
        }
    }
}