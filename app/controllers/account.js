const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
const device_helpers = require('../../helper/device_helpers');
var app_constants = require('../../config/constants');
const constants = require("../../constants/Application");
var XLSX = require('xlsx');
var path = require('path');
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
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
            // console.log(pgp_emails.length, "check pgp_emails==> ", pgp_emails);
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

            // *********************** Add Domains
            let domains = []
            let all_domains = await sql.query("SELECT name from domains")
            if (all_domains.length) {
                all_domains.map((item) => {
                    domains.push(item.name)
                })
            }

            // console.log('domains===> ', domains);

            let checkDuplicateDomains = [];
            for (let row of data) {
                let domainName = row.pgp_email.split('@').pop().trim();
                if (!domains.includes(domainName) && !checkDuplicateDomains.includes(domainName)) {
                    if (domainName) {
                        checkDuplicateDomains.push(domainName);
                        let insertQ = `INSERT INTO domains (name) value ('${domainName}')`;
                        await sql.query(insertQ);
                    }
                }
            }

            // ******* Add pgp emails
            let pgp_emails = []
            let all_pgp_emails = await sql.query("SELECT pgp_email from pgp_emails")
            if (all_pgp_emails.length) {
                all_pgp_emails.map((item) => {
                    pgp_emails.push(item.pgp_email)
                })
            }

            // get latest domains
            all_domains = await sql.query("SELECT * FROM domains");

            for (let row of data) {
                if (!pgp_emails.includes(row.pgp_email)) {
                    if (row.pgp_email) {
                        let indexDomain = all_domains.findIndex((dm) => dm.name === row.pgp_email.split('@').pop().trim());
                        let domain_id = (indexDomain > -1) ? all_domains[indexDomain].id : null;

                        let insertQ = `INSERT INTO pgp_emails (pgp_email, domain_id) value ('${row.pgp_email}', ${domain_id})`;
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
                                used: sim_id.used == 1 ? "Yes" : "No"
                            });
                        });
                    } else if (fieldName === "chat_ids") {
                        response.forEach((chat_id) => {
                            data.push({
                                chat_id: chat_id.chat_id,
                                used: chat_id.used == 1 ? "Yes" : "No"
                            });
                        });
                    } else if (fieldName === "pgp_emails") {
                        response.forEach((pgp_email) => {
                            data.push({
                                pgp_email: pgp_email.pgp_email,
                                used: pgp_email.used == 1 ? "Yes" : "No"
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
        query = "SELECT * FROM sim_ids WHERE delete_status = '0'";
        if (type === DEALER || type === SDEALER) {
            query = query + ` AND (dealer_id = ${verify.user.id} OR uploaded_by_id = ${verify.user.id}) `;
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
        let user_acc_id = req.params.user_acc_id
        let dealer_id = req.params.dealer_id
        let query = `SELECT * FROM chat_ids WHERE user_acc_id = ${user_acc_id} AND dealer_id = ${dealer_id} AND delete_status = '0'`;
        sql.query(query, async function (error, resp) {
            if (error) {
                return res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[""], "Server Error"), // "data success",
                    data: []
                });
            }
            if (resp && resp.length) {
                return res.send({
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                    data: resp
                });
            } else {
                return res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                    data: []
                });
            }
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
        let query = "SELECT * FROM chat_ids WHERE delete_status = '0'";
        if (type === DEALER || type === SDEALER) {
            query = query + ` AND (dealer_id = ${verify.user.id} OR uploaded_by_id = ${verify.user.id}) `;
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
        let loggedUserId = verify.user.dealer_id;
        let loggedUserType = verify.user.user_type;
        let user_acc_id = req.params.user_acc_id
        let dealer_id = req.params.dealer_id
        let condition = '';
        console.log(user_acc_id, dealer_id);
        if (loggedUserType === constants.DEALER) {
            condition = ` OR (dealer_id = 0 AND dealer_type='admin') `
        }
        else if (loggedUserType === constants.SDEALER) {
            let getParentId = await sql.query(`SELECT connected_dealer FROM dealers WHERE dealer_id = ${loggedUserId}`);
            condition = ` OR (dealer_id = 0 AND (dealer_type='admin' OR (dealer_type='dealer' AND permission_by=${getParentId[0].connected_dealer}))) `
        }
        else {
            condition = ` OR dealer_id = 0 `
        }

        let pgpPermisionQ = `SELECT * FROM dealer_permissions WHERE (dealer_id = '${loggedUserId}' ${condition}) AND permission_type = 'domain';`;
        // console.log("pgpPermisionQ ", pgpPermisionQ);
        let dealerDomainPermissions = await sql.query(pgpPermisionQ);
        let permission_ids = dealerDomainPermissions.map((prm) => prm.permission_id);

        let query = `SELECT * FROM pgp_emails WHERE delete_status = '0' AND dealer_id = ${dealer_id} AND user_acc_id = ${user_acc_id} `;
        if (permission_ids.length && loggedUserType !== ADMIN) {
            query = query + `AND domain_id IN (${permission_ids.join()})`;
        }
        // query = `SELECT * FROM pgp_emails WHERE used=0`;
        // console.log("permission_ids ", permission_ids, "query ", query)
        if (query !== '') {
            console.log(query);
            let resp = await sql.query(query);
            res.send({
                status: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Data success"), // "data success",
                data: resp
            });
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
                data: []
            })
        }
    }
    else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ACCESS_FORBIDDEN], "access forbidden"), // "access forbidden"
            data: []
        })
    }
}


exports.getAllPGPEmails = async (req, res) => {
    var verify = req.decoded;
    if (verify) {
        let type = verify.user.user_type;
        let dealer_id = verify.user.dealer_id;
        let query = "SELECT * FROM pgp_emails WHERE delete_status = '0'";
        if (type === DEALER || type === SDEALER) {
            query = query + ` AND (dealer_id = ${verify.user.id} OR uploaded_by_id = ${verify.user.id}) `;
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
            // console.log(verify.user);

            // return
            if (credits != undefined && credits != '' && credits != null) {

                // if (promo_code) {

                // } else {
                let query = `INSERT INTO credit_purchase (dealer_id,credits,usd_price,currency_price,payment_method) VALUES (${dealerId},${credits},${total_price},${currency_price},'${method}')`;
                console.log(query);
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

                // if (promo_code != '') {

                // } else {
                // console.log(result);
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
                                }).then(async function (stripeResponse) {
                                    if (stripeResponse.status == 'succeeded') {
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
                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,transection_data, credits ,transection_type , status , type , current_balance) VALUES (${dealerId},'${JSON.stringify({ request_type: "Credit Card" })}' ,${credits} ,'debit' , 'transferred', 'credits' , ${dealerBalanceData[0] ? dealerBalanceData[0].credits : 0})`
                                                        await sql.query(transection_credits)
                                                        await helpers.updatePendingTransactions(dealerId, credits)
                                                        let query = `INSERT INTO credit_purchase (dealer_id,credits,usd_price,currency_price,payment_method) VALUES (${dealerId},${credits},${total_price},${currency_price},'${method}')`;
                                                        sql.query(query)
                                                        res.send({
                                                            status: true,
                                                            msg: await helpers.convertToLang(req.translation[""], "your account has been recharged successfully."), // "Payment has been done.",
                                                            credits: totalCredits
                                                        })
                                                        return
                                                    } else {
                                                        res.send({
                                                            status: false,
                                                            msg: "ERROR: Internal Server error."
                                                        })
                                                        return
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
                                    };
                                });
                            }
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                    res.send({
                        status: false,
                        msg: "ERROR: Superadmin server not responding please try again later."
                    })
                    return
                })
                // }
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
                                let transection_credits = `INSERT INTO financial_account_transections (user_id,transection_data, credits ,transection_type , status , type , current_balance) VALUES (${dealer_id},'${JSON.stringify({ request_type: "Cash" })}' ,${credits} ,'debit' , 'transferred', 'credits' , ${result[0] ? result[0].credits : 0})`
                                await sql.query(transection_credits)
                                await helpers.updatePendingTransactions(dealer_id, credits)
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

// exports.getDomains = async function (req, res) {
//     var verify = req.decoded;

//     if (verify) {
//         let dealer_id = verify.user.dealer_id;
//         let selectDomains = await sql.query(`SELECT * FROM domains`);
//         // console.log(verify, 'get domains:: ', selectDomains);

//         if (selectDomains.length) {
//             if (verify.user.user_type !== ADMIN) {
//                 let selectPermisions = await sql.query(`SELECT * FROM dealer_permissions WHERE dealer_id = ${dealer_id} AND permission_type = 'domain'`);
//                 // console.log("selectPermisions ", selectPermisions)

//                 let prmIds = selectPermisions.map((p) => p.permission_id);
//                 // console.log("prmIds ", prmIds)
//                 selectDomains = selectDomains.filter((prm) => prmIds.includes(prm.id));
//             }

//             // console.log("selectDomains final:: ", selectDomains);
//             res.send({
//                 status: true,
//                 domains: selectDomains
//             })
//         } else {
//             res.send({
//                 status: true,
//                 domains: []
//             })
//         }
//     }
// }

exports.getDomains = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        let loggedUserId = verify.user.dealer_id;
        let loggedUserType = verify.user.user_type;
        let selectQ = '';

        if (loggedUserType !== ADMIN) {
            let condition = '';
            if (loggedUserType === DEALER) {
                condition = ` OR (dealer_permissions.dealer_id = 0 AND dealer_permissions.dealer_type = 'admin') `
            }
            else if (loggedUserType === SDEALER) {
                let getParentId = await sql.query(`SELECT connected_dealer FROM dealers WHERE dealer_id = ${loggedUserId}`);
                condition = ` OR (dealer_permissions.dealer_id = 0 AND (dealer_permissions.dealer_type='admin' OR (dealer_permissions.dealer_type='dealer' AND dealer_permissions.permission_by=${getParentId[0].connected_dealer}))) `
                // condition = `AND (dealer_type = 'admin' OR dealer_type = 'dealer')`
            }
            selectQ = `SELECT domains.*, dealer_permissions.permission_id, dealer_permissions.dealer_id, dealer_permissions.permission_by, dealer_permissions.dealer_type FROM domains JOIN dealer_permissions ON (dealer_permissions.permission_id = domains.id) WHERE (dealer_permissions.dealer_id = ${loggedUserId} ${condition}) AND dealer_permissions.permission_type = 'domain' AND domains.delete_status = 0;`;
        } else {
            selectQ = `SELECT * FROM domains WHERE delete_status = 0`;
        }
        console.log("selectDomains selectQ ", selectQ)
        let selectDomains = await sql.query(selectQ);

        // get all dealers under admin or sdealers under dealer
        let userDealers = await helpers.getUserDealers(loggedUserType, loggedUserId);
        // console.log("userDealers ========> ", userDealers);
        let sdealerList = userDealers.dealerList;
        let dealerCount = userDealers.dealerCount;

        // if (loggedUserType === constants.ADMIN) {
        //     let adminRoleId = await helpers.getUserTypeIDByName(loggedUserType);
        //     dealerCount = await helpers.dealerCount(adminRoleId);
        // }
        // else if (loggedUserType === constants.DEALER) {
        //     dealerCount = sdealerList ? sdealerList.length : 0;
        // }
        // console.log("dealerCount ", dealerCount);

        let results = selectDomains;
        for (var i = 0; i < results.length; i++) {
            let permissionDealers = await helpers.getDealersAgainstPermissions(results[i].id, 'domain', loggedUserId, sdealerList, loggedUserType);
            // let allDealers = [];

            results[i].dealers = permissionDealers.allDealers;
            results[i].statusAll = permissionDealers.statusAll;

            // // get dealer name
            // if (results[i].dealer_type === ADMIN) {
            //     results[i].permission_by = ADMIN;
            // } else if (results[i].dealer_type === DEALER || results[i].dealer_type === SDEALER) {
            //     let dealerName = await sql.query(`SELECT dealer_name FROM dealers WHERE dealer_id = '${results[i].permission_by}'`);
            //     // console.log("dealerName ", dealerName);
            //     results[i].permission_by = dealerName[0].dealer_name ? dealerName[0].dealer_name : 'N/A';
            // } else {
            //     results[i].permission_by = 'N/A';
            // }

            // if (!results[i].dealer_type) {
            //     results[i].dealer_type = 'N/A';
            // }


            // if (permissionDealers && permissionDealers.length && permissionDealers[0].dealer_id === 0) {
            //     // console.log('set permisin for all dealers ')

            //     let Update_sdealerList = sdealerList.map((dealer) => {
            //         return {
            //             dealer_id: dealer,
            //             dealer_type: permissionDealers[0].dealer_type,
            //             permission_by: permissionDealers[0].permission_by
            //         }
            //     })
            //     let final_list = Update_sdealerList.filter((item) => item.dealer_id !== loggedUserId)
            //     // results[i].dealers = JSON.stringify(final_list);
            //     allDealers = final_list;
            //     results[i].statusAll = true
            // } else {
            //     if (permissionDealers.length) {
            //         permissionDealers = permissionDealers.filter((item) => item.dealer_id !== loggedUserId)
            //     }
            //     allDealers = permissionDealers;
            //     // results[i].dealers = JSON.stringify(permissionDealers);
            //     results[i].statusAll = false
            // }

            // if (loggedUserType !== ADMIN) {
            //     let deleteIds = [];
            //     allDealers.forEach((item) => {
            //         console.log("item ", item);
            //         if (item.dealer_type === "admin") {
            //             let index = allDealers.findIndex((sd) => sd.dealer_type === "dealer" && sd.dealer_id === item.dealer_id);
            //             deleteIds.push(index);
            //         }
            //     })
            //     console.log("deleteIds index: ", deleteIds);
            //     results[i].dealers = JSON.stringify(allDealers.filter((item, i) => !deleteIds.includes(i)));
            // } else {
            //     results[i].dealers = JSON.stringify(allDealers);
            // }
            let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : [];

            // console.log('permissions are: ', permissions);

            // if (loggedUserType === constants.DEALER) {
            //     sdealerList = sdealerList.map((dealer) => dealer.dealer_id);
            //     permissions = permissions.filter((item) => sdealerList.includes(item))
            // }
            // if (permissions.length) {
            // if (loggedUserType === constants.DEALER) {
            //     permissions = permissions.filter(function (item) {
            //         for (let i = 0; i < sdealerList.length; i++) {
            //             if (item.dealer_id === sdealerList[i].dealer_id) {
            //                 return item
            //             }
            //         }
            //     })
            // }
            // }
            // console.log('permissions to check counter are: ', permissions);
            let permissionCount = (permissions && permissions.length) ? permissions.length : 0;
            // console.log("dealerCount == permissionCount ", dealerCount == permissionCount, dealerCount, permissionCount)
            let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
            results[i].permission_count = permissionC;
        }

        console.log('get domains:: ', results);
        if (results && results.length) {
            res.send({
                status: true,
                domains: results
            })
        } else {
            res.send({
                status: true,
                domains: []
            })
        }
    }
}


exports.addDomain = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        let domain = req.body.data.domain
        let alreadyAdded = await sql.query(`SELECT * FROM domains WHERE name = '${domain}' AND delete_status = 0`)
        if (alreadyAdded && alreadyAdded.length) {
            res.send({
                status: false,
                msg: 'Domain already added on whitelabel.Please Choose another domain.'
            })
            return
        } else {
            let insertQuery = "INSERT INTO domains (name) VALUES('" + domain + "')";
            sql.query(insertQuery, async (err, rslt) => {
                if (err) throw err;
                if (rslt) {
                    if (rslt.affectedRows) {
                        res.send({
                            status: true,
                            msg: 'Domain Saved Successfully.',
                        })
                        return
                    } else {
                        res.send({
                            status: false,
                            msg: 'Domain Not Saved.Please try again',
                        })
                        return
                    }
                }
            })
        }
    }
}
exports.editDomain = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let domain = req.body.data.domain
        let oldDomain = req.body.data.oldDomain
        console.log(oldDomain);
        let alreadyAdded = await sql.query(`SELECT * FROM domains WHERE name = '${oldDomain}'`)
        if (alreadyAdded.length == 0) {
            res.send({
                status: false,
                msg: 'Domain not Found on whiteLabel Server'
            })
            return
        } else {
            let insertQuery = `UPDATE domains SET name = '${domain}' WHERE name = '${oldDomain}'`;
            sql.query(insertQuery, async (err, rslt) => {
                if (err) throw err;
                if (rslt) {
                    if (rslt.affectedRows) {
                        res.send({
                            status: true,
                            msg: 'Domain updated Successfully.',
                        })
                        return
                    } else {
                        res.send({
                            status: false,
                            msg: 'Domain Not updated.Please try again',
                        })
                        return
                    }
                }
            })
        }
    }
}
exports.deleteDomain = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let domain_name = req.body.data.domain_name
        let alreadyAdded = await sql.query(`SELECT * FROM domains WHERE name = '${domain_name}'`)
        if (alreadyAdded.length == 0) {
            res.send({
                status: false,
                msg: 'Domain not Found on whiteLabel Server.'
            })
            return
        } else {
            let insertQuery = `UPDATE domains SET delete_status = 1 WHERE name = '${domain_name}'`;
            sql.query(insertQuery, async (err, rslt) => {
                if (err) throw err;
                if (rslt) {
                    if (rslt.affectedRows) {
                        res.send({
                            status: true,
                            msg: 'Domain deleted Successfully.',
                        })
                        return
                    } else {
                        res.send({
                            status: false,
                            msg: 'ERROR: Domain Not deleted.Please try again',
                        })
                        return
                    }
                }
            })
        }
    }
}
exports.getLatestPaymentHistory = async function (req, res) {

    let paymentHistoryData = [];
    let _limit = '';
    let verify = req.decoded;
    let condition = '';

    if (verify) {

        if (req.body.type) {
            condition += ' AND type = "' + req.body.type + '"'
        }

        if (req.body.status) {
            condition += ' AND status = "' + req.body.status + '"'
        }

        if (req.body.limit) {
            let limit = req.body.limit;
            _limit = 'LIMIT ' + limit
        }
        paymentHistoryData = await sql.query("SELECT * FROM financial_account_transections WHERE user_id = " + verify.user.id + condition + " ORDER BY id DESC " + _limit);

        return res.send(paymentHistoryData);
    }

};


exports.getOverdueDetails = async function (req, res) {

    let paymentHistoryData = [];
    let response = {
        _0to21: 0,
        _0to21_dues: 0,
        _21to30: 0,
        _21to30_dues: 0,
        _30to60: 0,
        _30to60_dues: 0,
        _60toOnward: 0,
        _60toOnward_dues: 0,
    };


    let verify = req.decoded;
    let _0to21 = 0;
    let _0to21_dues = 0;
    let _21to30 = 0;
    let _21to30_dues = 0;
    let _30to60 = 0;
    let _30to60_dues = 0;
    let _60toOnward = 0;
    let _60toOnward_dues = 0;

    if (verify) {
        paymentHistoryData = await sql.query("SELECT * FROM financial_account_transections WHERE user_id = " + verify.user.id + " AND status = 'pending'");

        paymentHistoryData.map(item => {

            let now = moment();
            let end = moment(item.created_at).format('YYYY-MM-DD');
            let duration = now.diff(end, 'days');

            if (duration >= 0 && duration <= 21) {
                ++_0to21;
                _0to21_dues += parseInt(item.due_credits);

            } else if (duration > 21 && duration <= 30) {
                ++_21to30;
                _21to30_dues += parseInt(item.due_credits);

            } else if (duration > 30 && duration <= 60) {
                ++_30to60;
                _30to60_dues += parseInt(item.due_credits);

            } else if (duration > 60) {
                ++_60toOnward;
                _60toOnward_dues += parseInt(item.due_credits);
            }

            response = {
                _0to21,
                _0to21_dues,
                _21to30,
                _21to30_dues,
                _30to60,
                _30to60_dues,
                _60toOnward,
                _60toOnward_dues,
            };


        });
        return res.send(response);
    }

};

