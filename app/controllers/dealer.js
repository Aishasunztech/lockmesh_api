// libraries
var generator = require('generate-password');
var empty = require('is-empty');
var md5 = require('md5');
var randomize = require('randomatic');
var empty = require('is-empty');
var moment = require("moment");

var Constants = require('../../constants/Application');
const { sql } = require('../../config/database');
const { sendEmail } = require('../../lib/email');

// 
const general_helpers = require('../../helper/general_helper');


// Constants
const app_constants = require('../../config/constants');
const MsgConstants = require('../../constants/MsgConstants');


// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"
let dealer_query_text = 'dealer_id, first_name, last_name, dealer_email, connected_dealer, dealer_name, link_code, is_two_factor_auth, type, unlink_status, account_status, last_login , account_balance_status, account_balance_status_by, created, modified , demos , remaining_demos ,company_name , company_address , city , state , country , postal_code , tel_no , website, timezone ';
let get_dealer_query_text = 'd.dealer_id, d.first_name, d.last_name, d.dealer_email, d.connected_dealer, d.dealer_name, d.link_code, d.is_two_factor_auth, d.type, d.unlink_status, d.last_login, d.account_status, d.created, d.modified , c.credits , d.demos , d.remaining_demos, d.company_name , d.company_address , d.city , d.state , d.country , d.postal_code , d.tel_no , d.website , d.timezone ';

exports.getAllDealers = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {

        var role = await general_helpers.getUserTypeIDByName(verify.user.user_type);
        if (verify.user.user_type == Constants.ADMIN) {

            sql.query(`SELECT ${dealer_query_text} FROM dealers WHERE type!=${role} AND type != 4 AND type !=5 ORDER BY created DESC`, async function (error, results) {
                if (error) {
                    console.log(error);
                    res.send({
                        status: false,
                        msg: error
                    });
                    return;
                }

                var data = [];

                for (var i = 0; i < results.length; i++) {
                    if (results[i].connected_dealer != 0 && results[i].connected_dealer != '' && results[i].connected_dealer != '0') {
                        var get_parent_dealer = await sql.query("select dealer_id, dealer_name from dealers where dealer_id=" + results[i].connected_dealer + " limit 1");
                        console.log(get_parent_dealer);
                    }
                    var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + results[i].dealer_id + "'");

                    dt = {
                        status: true,
                        dealer_id: results[i].dealer_id,
                        dealer_name: results[i].dealer_name,
                        dealer_email: results[i].dealer_email,
                        link_code: results[i].link_code,
                        account_status: results[i].account_status,
                        unlink_status: results[i].unlink_status,
                        connected_dealer: results[i].connected_dealer,
                        created: results[i].created,
                        modified: results[i].modified,
                        connected_devices: get_connected_devices,
                        demos: results[i].demos,
                        remaining_demos: results[i].remaining_demos,
                        company_name: results[i].company_name,
                        company_address: results[i].company_address,
                        city: results[i].city,
                        state: results[i].state,
                        country: results[i].country,
                        postal_code: results[i].postal_code,
                        tel_no: results[i].tel_no,
                        website: results[i].website,
                        timezone: results[i].timezone
                    };

                    if (get_parent_dealer != undefined && get_parent_dealer.length > 0) {
                        dt.parent_dealer = get_parent_dealer[0].dealer_name;
                        dt.parent_dealer_id = get_parent_dealer[0].dealer_id;
                    } else {
                        dt.parent_dealer = "";
                        dt.parent_dealer_id = "";
                    }

                    data.push(dt);
                }
                res.send(data);
                return;
            });
        } else {

            sql.query(`SELECT ${dealer_query_text} FROM dealers WHERE connected_dealer = '${verify.user.id}' AND  type = 3 ORDER BY created DESC`, async function (error, results) {
                if (error) {
                    res.send({
                        status: false,
                        msg: error
                    });
                    return;
                }

                var data = [];

                for (var i = 0; i < results.length; i++) {

                    var get_connected_devices = await sql.query(`SELECT count(*) AS total FROM usr_acc WHERE dealer_id='${results[i].id}'`);

                    dt = {
                        status: true,
                        dealer_id: results[i].dealer_id,
                        dealer_name: results[i].dealer_name,
                        dealer_email: results[i].dealer_email,
                        link_code: results[i].link_code,
                        account_status: results[i].account_status,
                        unlink_status: results[i].unlink_status,
                        created: results[i].created,
                        modified: results[i].modified,
                        connected_devices: get_connected_devices,
                        connected_dealer: results[i].connected_dealer,
                        demos: results[i].demos,
                        remaining_demos: results[i].remaining_demos,
                        company_name: results[i].company_name,
                        company_address: results[i].company_address,
                        city: results[i].city,
                        state: results[i].state,
                        country: results[i].country,
                        postal_code: results[i].postal_code,
                        tel_no: results[i].tel_no,
                        website: results[i].website,
                        timezone: results[i].timezone
                    };
                    data.push(dt);

                }
                res.send(data);
                return;
            });
        }

    }
}

exports.getAllToAllDealers = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        sql.query(`SELECT ${dealer_query_text} FROM dealers WHERE type != 4 AND type !=5 ORDER BY created DESC`, async function (error, results) {
            if (error) {
                console.log(error);
                res.send({
                    status: false,
                    msg: error
                });
                return;
            }
            // console.log(results)
            var data = [];

            for (var i = 0; i < results.length; i++) {

                dt = {
                    status: true,
                    dealer_id: results[i].dealer_id,
                    dealer_name: results[i].dealer_name,
                    dealer_email: results[i].dealer_email,
                    type: await general_helpers.getUserType(results[i].dealer_id),
                    link_code: results[i].link_code,
                    account_status: results[i].account_status,
                    unlink_status: results[i].unlink_status,
                    created: results[i].created,
                    modified: results[i].modified,
                    demos: results[i].demos,
                    remaining_demos: results[i].remaining_demos,
                    company_name: results[i].company_name,
                    company_address: results[i].company_address,
                    city: results[i].city,
                    state: results[i].state,
                    country: results[i].country,
                    postal_code: results[i].postal_code,
                    tel_no: results[i].tel_no,
                    website: results[i].website,
                    timezone: results[i].timezone
                };
                data.push(dt);
            }
            res.send(data);
            return;
        });
    }
};

exports.getAdmin = async function(req, res){
    var verify = req.decoded;
    if(verify){
        sql.query(`SELECT ${dealer_query_text} FROM dealers WHERE type = 1 LIMIT 1`, async function(err, data){
            if(err){
                console.log(err);
                res.send({
                    status: false,
                    msg: err
                });
                return;
            } else {
                console.log(data);
                res.send(data[0]);
                return;
            }
        });
    }
};

exports.getUserDealers = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {

        var role = await general_helpers.getUserTypeIDByName(verify.user.user_type)
        if (verify.user.user_type == Constants.ADMIN) {

            sql.query(`SELECT ${dealer_query_text} FROM dealers WHERE type = 2 ORDER BY created DESC`, async function (error, results) {
                if (error) {
                    console.log(error);
                    res.send({
                        status: false,
                        msg: error
                    });
                    return;
                }

                var data = [];

                for (var i = 0; i < results.length; i++) {
                    if (results[i].connected_dealer != 0 && results[i].connected_dealer != '' && results[i].connected_dealer != '0') {
                        var get_parent_dealer = await sql.query("select dealer_id, dealer_name from dealers where dealer_id=" + results[i].connected_dealer + " limit 1");
                        console.log(get_parent_dealer);
                    }
                    var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + results[i].dealer_id + "'");

                    dt = {
                        status: true,
                        dealer_id: results[i].dealer_id,
                        dealer_name: results[i].dealer_name,
                        dealer_email: results[i].dealer_email,
                        link_code: results[i].link_code,
                        account_status: results[i].account_status,
                        unlink_status: results[i].unlink_status,
                        connected_dealer: results[i].connected_dealer,
                        created: results[i].created,
                        modified: results[i].modified,
                        connected_devices: get_connected_devices,
                        demos: results[i].demos,
                        remaining_demos: results[i].remaining_demos,
                        company_name: results[i].company_name,
                        company_address: results[i].company_address,
                        city: results[i].city,
                        state: results[i].state,
                        country: results[i].country,
                        postal_code: results[i].postal_code,
                        tel_no: results[i].tel_no,
                        website: results[i].website,
                        timezone: results[i].timezone
                    };

                    if (get_parent_dealer != undefined && get_parent_dealer.length > 0) {
                        dt.parent_dealer = get_parent_dealer[0].dealer_name;
                        dt.parent_dealer_id = get_parent_dealer[0].dealer_id;
                    } else {
                        dt.parent_dealer = "";
                        dt.parent_dealer_id = "";
                    }

                    data.push(dt);
                }
                res.send(data);
                return;
            });
        } else {

            sql.query(`SELECT * FROM dealers WHERE connected_dealer = '${verify.user.id}' AND  type = 3 ORDER BY created DESC`, async function (error, results) {
                if (error) {
                    res.send({
                        status: false,
                        msg: error
                    });
                    return;
                }

                var data = [];

                for (var i = 0; i < results.length; i++) {

                    var get_connected_devices = await sql.query(`SELECT count(*) AS total FROM usr_acc WHERE dealer_id='${results[i].id}'`);

                    dt = {
                        status: true,
                        dealer_id: results[i].dealer_id,
                        dealer_name: results[i].dealer_name,
                        dealer_email: results[i].dealer_email,
                        link_code: results[i].link_code,
                        account_status: results[i].account_status,
                        unlink_status: results[i].unlink_status,
                        created: results[i].created,
                        modified: results[i].modified,
                        connected_devices: get_connected_devices,
                        connected_dealer: results[i].connected_dealer,
                        demos: results[i].demos,
                        remaining_demos: results[i].remaining_demos,
                        company_name: results[i].company_name,
                        company_address: results[i].company_address,
                        city: results[i].city,
                        state: results[i].state,
                        country: results[i].country,
                        postal_code: results[i].postal_code,
                        tel_no: results[i].tel_no,
                        website: results[i].website,
                        timezone: results[i].timezone
                    };
                    data.push(dt);

                }
                res.send(data);
                return;
            });
        }

    }
}

exports.getDealers = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        let where = "";
        var role = null;
        if (verify.user.user_type === Constants.ADMIN) {
            role = await general_helpers.getDealerTypeIdByName(req.params.pageName);
        } else if (verify.user.user_type === Constants.DEALER) {
            role = await general_helpers.getDealerTypeIdByName('sdealer');
            where = ` AND d.connected_dealer =${verify.user.id}`
        }

        if (!empty(role)) {
            // console.log(`SELECT ${get_dealer_query_text} FROM dealers as d LEFT JOIN financial_account_balance as c ON d.dealer_id = c.dealer_id WHERE d.type=${role}  ${where} ORDER BY created DESC`);
            sql.query(`SELECT ${get_dealer_query_text} FROM dealers as d LEFT JOIN financial_account_balance as c ON d.dealer_id = c.dealer_id WHERE d.type=${role}  ${where} ORDER BY created DESC`, async function (error, results) {
                if (error) {
                    console.log(error);
                    res.send({
                        status: false,
                        msg: "Error in query " + error,
                        data: []
                    });
                    return;
                };

                var data = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].connected_dealer != 0 && results[i].connected_dealer != '' && results[i].connected_dealer != '0') {
                        var get_parent_dealer = await sql.query(`SELECT dealer_id, dealer_name FROM dealers WHERE dealer_id=${results[i].connected_dealer} limit 1`);
                    }
                    var get_connected_devices = await sql.query(`SELECT count(*) AS total FROM usr_acc WHERE dealer_id=${results[i].dealer_id}`);

                    // var last_login = await sql.query(`SELECT MAX(created_at) AS last_login FROM login_history WHERE dealer_id=${dealer[0].dealer_id} AND type='token' LIMIT 1`)

                    dt = {
                        status: true,
                        dealer_id: results[i].dealer_id,
                        dealer_name: results[i].dealer_name,
                        dealer_email: results[i].dealer_email,
                        link_code: results[i].link_code,
                        account_status: results[i].account_status,
                        unlink_status: results[i].unlink_status,
                        last_login: results[i].last_login,
                        created: results[i].created,
                        modified: results[i].modified,
                        connected_devices: get_connected_devices,
                        devicesList: await general_helpers.getAllRecordByDealerID(results[i].dealer_id),
                        dealer_credits: results[i].credits,
                        demos: results[i].demos,
                        remaining_demos: results[i].remaining_demos,
                        company_name: results[i].company_name,
                        company_address: results[i].company_address,
                        city: results[i].city,
                        state: results[i].state,
                        country: results[i].country,
                        postal_code: results[i].postal_code,
                        tel_no: results[i].tel_no,
                        website: results[i].website,
                        timezone: results[i].timezone
                    };

                    // if (last_login && last_login.length) {
                    //     dt.last_login = last_login[0].last_login
                    // }

                    if (get_parent_dealer != undefined && get_parent_dealer.length > 0) {
                        dt.parent_dealer = get_parent_dealer[0].dealer_name;
                        dt.parent_dealer_id = get_parent_dealer[0].dealer_id;
                    } else {
                        dt.parent_dealer = "";
                        dt.parent_dealer_id = "";
                    }

                    data.push(dt);
                }
                res.send(data);
                return;
            });
        } else {
            return res.send({
                status: false,
                msg: "Error in query " + error,
                data: []
            });
        }
    }
}



exports.addDealer = async function (req, res) {

    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var dealerName = req.body.name;
        var dealerEmail = req.body.email;

        if (!empty(dealerEmail) && !empty(dealerName)) {
            var pageType = req.body.pageType;

            var loggedInuid = verify.user.id;
            let userType = await general_helpers.getUserType(loggedInuid);

            if (userType == Constants.SDEALER || (userType == Constants.DEALER && pageType == Constants.DEALER)) {
                data = {
                    status: false,
                    msg: "invalid operation",
                }
                res.send(data);
                return;
            }

            let sdealerDealerId = 0;

            if (userType == Constants.ADMIN && pageType == Constants.SDEALER) {
                sdealerDealerId = req.body.dealerId;
            } else if (userType == Constants.DEALER && pageType == Constants.SDEALER) {
                sdealerDealerId = loggedInuid;
            }

            /* var link_code = randomize('0', 6);
            link_code = await general_helpers.checkLinkCode(link_code); */
            var link_code = await general_helpers.generateLinkCode();

            var type = await general_helpers.getDealerTypeIdByName(pageType);

            var dealer_pwd = generator.generate({
                length: 10,
                numbers: true
            });

            var enc_pwd = md5(dealer_pwd); //encryted pwd

            var dealer = await sql.query(`SELECT * FROM dealers WHERE dealer_email = '${dealerEmail}'`);
            if (dealer.length > 0) {
                data = {
                    status: false,
                    msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_ALREADY_REG], "Dealer Already Registered. Please use another email"), // Dealer Already Registered. Please use another email.
                }
                res.send(data);
                return;
            }

            var sql1 = `INSERT INTO dealers (connected_dealer, dealer_name, dealer_email, password, link_code , type , modified, created) `;
            if (sdealerDealerId != undefined && !empty(sdealerDealerId) && sdealerDealerId != null && sdealerDealerId != 0) {
                sql1 += ` VALUES (${sdealerDealerId}, '${dealerName}', '${dealerEmail}', '${enc_pwd}', '${link_code}', '${type}', NOW(), NOW())`;
            } else {
                sql1 += ` VALUES (0, '${dealerName}', '${dealerEmail}', '${enc_pwd}', '${link_code}', '${type}', NOW(), NOW())`;
            }

            sql.query(sql1, async function (error, rows) {
                if (error) {
                    console.log(error);
                    return;
                };

                if (rows && rows.affectedRows) {

                    sql.query("INSERT INTO financial_account_balance(dealer_id) VALUES(" + rows.insertId + ")")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(Constants.deviceColumns) + "', 'devices') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(Constants.dealerColumns) + "', 'dealer') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(Constants.sdealerColumns) + "', 'sdealer') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(Constants.apkColumns) + "', 'apk') ")
                    var html = '';

                    html = `Your login details are : <br>
                    Email : ${dealerEmail}<br>
                    Password : ${dealer_pwd} <br>
                    Dealer id : ${rows.insertId}<br>
                    Dealer Pin : ${link_code}<br>
                    Below is the link to login : <br> ${app_constants.HOST} <br>`;

                    // if (pageType === DEALER) {

                    //     html = `Your login details are : <br>
                    //         Email : ${dealerEmail}<br>
                    //         Password : ${dealer_pwd} <br>
                    //         Dealer id : ${rows.insertId}<br>
                    //         Dealer Pin : ${link_code}<br>
                    //         Below is the link to login : <br> ${app_constants.HOST} <br>`;
                    // } else {
                    //     html = `Your login details are : <br>
                    //         Email : ${dealerEmail}<br>
                    //         Password : ${dealer_pwd} <br>
                    //         Dealer id : ${rows.insertId}<br>
                    //         Dealer Pin : ${link_code}<br>
                    //         Below is the link to login : <br> ${app_constants.HOST} <br>`;
                    // }

                    sendEmail("Account Registration", html, dealerEmail, async function (emailError, response) {
                        var dealer = await sql.query(`SELECT * FROM dealers WHERE dealer_email = '${dealerEmail}' limit 1`);
                        if (dealer.length) {

                            dealer[0].connected_devices = [{ total: '0' }];

                            dealer[0].devicesList = [];
                            dealer[0].dealer_token = 'N/A';

                            if (pageType == Constants.SDEALER && (sdealerDealerId != undefined && !empty(sdealerDealerId) && sdealerDealerId != null && sdealerDealerId != 0)) {
                                let prnt_dealer = await general_helpers.getDealerByDealerId(sdealerDealerId);

                                if (prnt_dealer && prnt_dealer.length) {
                                    dealer[0].parent_dealer = prnt_dealer[0].dealer_name;
                                    dealer[0].parent_dealer_id = prnt_dealer[0].dealer_id;
                                }
                            }
                            if (emailError) {
                                data = {
                                    status: true,
                                    msg: await general_helpers.convertToLang(req.translation[MsgConstants.EMAIL_NOT_SENT], "Email could not sent due to error: ") + emailError, // Email could not sent due to error: " + emailError,
                                    added_dealer: dealer,
                                }
                                res.send(data);
                                return;
                            }
                            // console.log('result add',dealer);
                            data = {
                                status: true,
                                msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_REG_SUCC], "Dealer has been registered successfully"), // Dealer has been registered successfully
                                added_dealer: dealer,

                            }
                            res.send(data);
                            return;
                        } else {
                            data = {
                                status: false,
                                msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_NOT_ADDED], "Dealer could not be added"), // Dealer could not be added
                            }
                            res.send(data);
                            return;
                        }

                    });
                } else {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_NOT_ADDED], "Dealer could not be added"), // Dealer could not be added
                    }
                    res.send(data);
                    return;
                }


            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.INVALID_EMAIL_NAME], "Invalid email or name"), // Invalid email or name
            }
            res.send(data);
            return;
        }

    }
}

exports.editDealers = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var loggedInuid = verify.user.id;

        var name = req.body.name;
        var email = req.body.email;
        var dealer_id = req.body.dealer_id;
        var setFields = "";
        var alreadyAvailable = false;
        var mailGiven = false;
        var enc_pwd = ''
        if (dealer_id && (name || email)) {

            // let dealer = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_email = '${email}' AND dealer_id =${dealer_id}`)
            let dealer = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_id =${dealer_id}`)
            if (!dealer) {
                return res.send({
                    status: false,
                    msg: await general_helpers.convertToLang(req.translation[MsgConstants.EMAIL_ALREDY_USED_DEALER], "Email is already in use of other dealer"), // Dealer not found to Update"
                });
            }

            if (dealer && dealer.length) {
                // if changed email is provided
                if (email && email !== dealer[0].dealer_email) {

                    mailGiven = true;
                    let checkMail = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_email='${email}' AND dealer_id !=${dealer_id}`);
                    if (checkMail && checkMail.length) {
                        alreadyAvailable = true;

                        data = {
                            status: false,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.EMAIL_ALREDY_USED_DEALER], "Email is already in use of other dealer"), // Email is already in use of other dealer
                            alreadyAvailable: alreadyAvailable
                        };
                        return res.send(data);

                    }

                    var dealer_pwd = generator.generate({
                        length: 10,
                        numbers: true
                    });
                    enc_pwd = md5(dealer_pwd);

                    setFields = `${setFields}  dealer_email='${email}', password = '${enc_pwd}' `;
                }

                if (!empty(name)) {

                    if (mailGiven == true && alreadyAvailable == false) {
                        setFields = `${setFields}, dealer_name='${name}'`;
                    } else {
                        setFields = ` dealer_name='${name}'`;
                    }
                }

                var query = `UPDATE dealers SET ${setFields} WHERE dealer_id = ${dealer_id}`;

                sql.query(query, async function (error, row) {
                    if (error) {
                        console.log(error)
                        data = {
                            status: true,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_NOT_UPD], "Record not updated"), // Record not updated.
                        };
                        return res.send(data);
                    }

                    if (row && row.affectedRows != 0) {
                        html = `Your login details are : <br>
                                Email : ${email} <br>
                                Password : ${dealer_pwd} <br>
                                Below is the link to login : <br> 
                                ${app_constants.HOST} <br>`;
                        if (mailGiven) {
                            sendEmail("Account Information Changed", html, email);
                        }

                        return res.send({
                            status: true,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], "Record updated successfully"), // Record updated successfully. Email has been sent.
                            alreadyAvailable: alreadyAvailable
                        })
                    } else {
                        data = {
                            status: true,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_NOT_UPD], "Record not updated"), // Record not updated.
                        };
                        return res.send(data);
                    }
                });

            }

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.ENTER_VALID_DETAIL], "Please enter valid details"), // Please enter valid details
            }
            return res.send(data);
        }
    }
}

exports.setDealerCreditsLimit = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var credits_limit = req.body.credits_limit;
        var dealer_id = req.body.dealer_id;
        if (dealer_id && credits_limit) {
            let dealer = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_id =${dealer_id}`)
            if (!dealer) {
                return res.send({
                    status: false,
                    msg: await general_helpers.convertToLang(req.translation[""], "Dealer not found to update."), // Dealer not found to Update"
                });
            }

            if (dealer && dealer.length) {
                let updateCreditsLimitQ = `UPDATE financial_account_balance SET credits_limit = ${credits_limit} WHERE dealer_id = ${dealer_id}`
                sql.query(updateCreditsLimitQ, async function (err, response) {
                    if (err) {
                        console.log(err);
                        data = {
                            status: false,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.QUERY_ERROR], "Query Error"), // Please enter valid details
                        }
                        return res.send(data);
                    }
                    if (response && response.affectedRows) {
                        data = {
                            status: true,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], "Record Updated Successfully"), // Please enter valid details
                        }
                        return res.send(data)
                    } else {
                        data = {
                            status: false,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_NOT_UPD], "Record not Updated."), // Please enter valid details
                        }
                        return res.send(data)

                    }
                })
            }
        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.ENTER_VALID_DETAIL], "Please enter valid details"), // Please enter valid details
            }
            return res.send(data);
        }
    }
}


exports.deleteDealer = async function (req, res) {

    var verify = req.decoded;
    var dealer_id = req.body.dealer_id;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var loggedInuid = verify.user.id;

        if (!empty(dealer_id)) {
            var qury = `UPDATE dealers SET unlink_status = 1 WHERE dealer_id = ${dealer_id} `;

            sql.query(qury, async function (error, row) {

                // var qury1 = "UPDATE dealers set unlink_status = 1 where connected_dealer = '" + dealer_id + "'";
                // var rslt = await sql.query(qury1);
                // if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                //     data = {
                //         status: true,
                //         msg: 'Dealer and Sub-Dealer deleted successfully.',
                //         data: row
                //     };
                //     res.send(data);
                //     return;
                // } else 

                if (row && row.affectedRows !== 0) {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_DEL_SUCC], "Dealer deleted successfully"), // Dealer deleted successfully.
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        "status": false,
                        "msg": await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_NOT_DEL], "Record not deleted"), // Record not deleted.
                    };
                    res.send(data);
                    return;
                }

            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // Invalid Dealer.
            };
            res.send(data);
            return;
        }
    }
}

/** Undo Dealer / S-Dealer **/
exports.undoDealer = async function (req, res) {
    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var loggedInuid = verify.user.id;
        var dealer_id = req.body.dealer_id;
        if (!empty(dealer_id)) {
            var qury = "UPDATE dealers set unlink_status = '0' where dealer_id = '" + dealer_id + "'";

            sql.query(qury, async function (error, row) {
                // var qury1 = "UPDATE dealers set unlink_status = '0' where connected_dealer = '" + dealer_id + "'";
                // var rslt = await sql.query(qury1);

                // if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                //     data = {
                //         "status": true,
                //         "msg": 'Dealer and S-Dealer added again.',
                //         "data": row
                //     };
                //     res.send(data);
                // } else

                if (row && row.affectedRows != 0) {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_ADDED_AGAIN], "Dealer added again"), // Dealer added again.
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_NOT_ADDED], "Dealer could not be added"), // Dealer not added.
                    };
                    res.send(data);
                    return;
                }
            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // Invalid Dealer.
            };
            res.send(data);
            return;
        }
    }

}

/**
 * @description need to implement check who is suspending which one dealer weather He is allowed or not
 */
exports.suspendDealer = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var loggedInuid = verify.user.id;
        let dealer_id = req.body.dealer_id;

        if (!empty(dealer_id)) {

            //suspend dealer
            var qury = `UPDATE dealers set account_status = 'suspended' where dealer_id = '${dealer_id}'`;

            sql.query(qury, async function (error, row) {
                if (error) {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_NOT_SUSP], "Dealer not suspended"), // Dealer not suspended.                    
                    };
                    return res.send(data);
                }

                //suspend sub dealer                                                                                                                 
                // var qury1 = "UPDATE dealers set account_status = 'suspended' where connected_dealer = '" + dealer_id + "'";
                // var rslt = await sql.query(qury1);

                // if (row.affectedRows != 0 && rslt.affectedRows != 0) {

                //     data = {
                //         "status": true,
                //         "msg": 'Dealer and Sub-Dealer suspended successfully.',
                //         "data": row
                //     };
                //     res.send(data);
                // } else 

                if (row.affectedRows != 0) {
                    await general_helpers.expireDealerLogin(dealer_id);
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_SUSP_SUCC], "Dealer suspended successfully"), // Dealer suspended successfully.
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_NOT_SUSP], "Dealer not suspended"), // Dealer not suspended.                    
                    };
                    return res.send(data);
                }
            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // Invalid Dealer.',
            };
            res.send(data);
            return;
        }
    }

}

exports.activateDealer = async function (req, res) {
    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var loggedInuid = verify.user.id;
        var dealer_id = req.body.dealer_id;

        if (!empty(dealer_id)) {
            var qury = `UPDATE dealers SET account_status = '' WHERE dealer_id = ${dealer_id} `;

            sql.query(qury, async function (error, row) {
                // var qury1 = "UPDATE dealers set account_status = '' where connected_dealer = '" + dealer_id + "'";
                // var rslt = await sql.query(qury1);
                // if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                //     data = {
                //         "status": true,
                //         "msg": 'Dealer and S Dealer activated successfully.',
                //         "data": row
                //     };
                //     res.send(data);
                // } else 
                if (row && row.affectedRows != 0) {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DEALER_ACTIV_SUCC], "Dealer activated successfully"), // Dealer activated successfully.
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.DELAER_NOT_ACTIV], "Dealer not activated"), // Dealer not activated.'
                    };
                    res.send(data);
                    return;

                }
            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // Invalid Dealer.',
            };
            res.send(data);
            return;

        }
    }

}


exports.resetPwd = async function (req, res) {

    var verify = req.decoded;
    var isReset = false;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {

        var user = verify.user;
        if (req.body.pageName != undefined && req.body.pageName != "") {
            if (user.user_type === Constants.ADMIN || user.user_type === Constants.DEALER) {
                var newpwd = generator.generate({
                    length: 10,
                    numbers: true
                });
                isReset = true;
                var query = "SELECT password FROM dealers WHERE dealer_id=" + req.body.dealer_id + " limit 1";
                var rslt = await sql.query(query);
                var curntPassword = rslt[0].password;
            }
        } else {

            if (req.body.newpwd != undefined) {
                var newpwd = req.body.newpwd;
                var curntPassword = md5(req.body.curntpwd);
            }
        }
        // console.log("new password " + newpwd);
        var email = req.body.dealer_email;
        var dealer_id = req.body.dealer_id;
        var enc_pwd = md5(newpwd); // encryted pwd


        if (!empty(email) && !empty(newpwd) && !empty(dealer_id)) {

            var query = "SELECT link_code from dealers where dealer_id=" + dealer_id + " AND password='" + curntPassword + "' limit 1";


            var result = await sql.query(query);
            if (result.length) {
                // console.log('error');
                if (isReset) {

                    var subject = "Password Reset";
                    var message = 'Your login details are : <br> Email : ' + email + '<br> Password : ' + newpwd + '<br> Dealer id : ' + dealer_id + '<br> Dealer Pin : ' + result[0].link_code + '.<br> Below is the link to login : <br> http://www.lockmesh.com <br>';
                } else {
                    var subject = "Password Change";
                    var message = 'You have changed your password in your Lockmesh.com account. <br><br> This is just to inform you about the activity. If it was not you, please immediately contact your provider to reset the password.';
                }

                sendEmail(subject, message, email, async function (errors, response) {
                    if (errors) {
                        res.send({
                            status: false,
                            msg: "ERROR: Email could not sent."
                        });
                        return;
                    } else {

                        var sq = "update dealers set password = '" + enc_pwd + "' where dealer_id = '" + dealer_id + "'";
                        sql.query(sq, async function (error, rows) {
                            if (error) {
                                console.log(error);
                                res.send({
                                    status: false,
                                    msg: "ERROR: Internal Server Error."
                                });
                            }

                            if (rows.affectedRows == 0) {
                                data = {
                                    "status": false,
                                    "data": rows
                                };
                                res.send(data);
                                return;
                            } else {
                                data = {
                                    "status": true,
                                    "msg": await general_helpers.convertToLang(req.translation[MsgConstants.PASS_CHANGE_SUCC], "Password changed successfully.Please check your email"), // Password changed successfully.Please check your email.
                                };
                                res.send(data);
                                return;
                            }
                        });
                    }

                });
            } else {
                data = {
                    "status": false,
                    "msg": await general_helpers.convertToLang(req.translation[MsgConstants.INVALID_USER_AND_PASS], "Invalid User and Password"), // Invalid User and Password'
                };
                res.send(data);
                return;
            }
        } else {
            res.json({
                status: false,
                "msg": await general_helpers.convertToLang(req.translation[MsgConstants.ENTER_VALID_DETAIL], "Please enter valid details"), // Invalid details"
            });
            return;
        }
    }

}

exports.connectDealer = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {

    let dealer_id = req.params.dealerId;
    let userType = verify.user.user_type;
    let userId = verify.user.id;

    if (!dealer_id || userType === Constants.SDEALER) {
        return res.send({
            status: false,
            dealer: null
        })
    }
    let where_con = '';

    // this is for sdealer connect page and logic to be improved
    if (userType === Constants.DEALER) {
        where_con = ` AND connected_dealer= ${userId}`
    }

    let dealerQ = `SELECT ${dealer_query_text} FROM dealers WHERE dealer_id=${dealer_id} ${where_con} LIMIT 1`;
    let dealer = await sql.query(dealerQ);
    if (dealer && dealer.length) {

        let _0to21 = 0;
        let _0to21_dues = 0;
        let _0to21_dues_history = [];

        let _21to30 = 0;
        let _21to30_dues = 0;
        let _21to30_dues_history = [];


        let _30to60 = 0;
        let _30to60_dues = 0;
        let _30to60_dues_history = [];

        let _60toOnward = 0;
        let _60toOnward_dues = 0;
        let _60toOnward_history = [];

        // get parent dealer
        let get_parent_dealer = null;
        if (dealer[0].connected_dealer != 0 && dealer[0].connected_dealer != '' && dealer[0].connected_dealer != '0') {
            get_parent_dealer = await sql.query(`SELECT dealer_id, dealer_name FROM dealers WHERE dealer_id=${dealer[0].connected_dealer} LIMIT 1`);

        }

        // devices
        var get_connected_devices = await sql.query(`SELECT COUNT(*) AS total FROM usr_acc WHERE dealer_id='${dealer[0].dealer_id}'`);

        // last login
        // var last_login = await sql.query(`SELECT MAX(created_at) AS last_login FROM login_history WHERE dealer_id=${dealer[0].dealer_id} AND type='token' LIMIT 1`)

        // Dealer Type
        let dealer_type = await sql.query(`SELECT role FROM user_roles WHERE id = ${dealer[0].type} LIMIT 1`)

        // Payment History
        paymentHistoryData = await sql.query(`SELECT * FROM financial_account_transections WHERE user_id = ${dealer[0].dealer_id} AND status = 'pending'`);

        paymentHistoryData.map(item => {
            console.log("hello:", item);
            let now = moment();
            let end = moment(item.created_at).format('YYYY-MM-DD');
            let duration = now.diff(end, 'days');

            if (duration >= 0 && duration <= 21) {
                ++_0to21;
                _0to21_dues += parseInt(item.due_credits);
                _0to21_dues_history.push(item);

            } else if (duration > 21 && duration <= 30) {
                ++_21to30;
                _21to30_dues += parseInt(item.due_credits);
                _21to30_dues_history.push(item);

            } else if (duration > 30 && duration <= 60) {
                ++_30to60;
                _30to60_dues += parseInt(item.due_credits);
                _30to60_dues_history.push(item);

            } else if (duration > 60) {
                ++_60toOnward;
                _60toOnward_dues += parseInt(item.due_credits);
                _60toOnward_history.push(item)
            }

        });

        // Credits
        let creditsQ = `SELECT * FROM financial_account_balance WHERE dealer_id=${dealer[0].dealer_id} LIMIT 1`;
        let credits = await sql.query(creditsQ);

        dt = {
            status: true,
            dealer_id: dealer[0].dealer_id,
            dealer_name: dealer[0].dealer_name,
            dealer_email: dealer[0].dealer_email,
            link_code: dealer[0].link_code,
            type: dealer[0].type,
            account_status: dealer[0].account_status,
            unlink_status: dealer[0].unlink_status,
            connected_dealer: dealer[0].connected_dealer,
            account_balance_status: dealer[0].account_balance_status,
            account_balance_status_by: dealer[0].account_balance_status_by,
            created: dealer[0].created,
            modified: dealer[0].modified,
            credits: credits[0].credits,
            credits_limit: credits[0].credits_limit,
            dealer_type: '',
            last_login: dealer[0].last_login,
            connected_devices: 0,
            parent_dealer: "",
            parent_dealer_id: "",
            _0to21: _0to21,
            _0to21_dues: _0to21_dues,
            _0to21_dues_history: _0to21_dues_history,

            _21to30: _21to30,
            _21to30_dues: _21to30_dues,
            _21to30_dues_history: _21to30_dues_history,

            _30to60: _30to60,
            _30to60_dues: _30to60_dues,
            _30to60_dues_history: _30to60_dues_history,

            _60toOnward: _60toOnward,
            _60toOnward_dues: _60toOnward_dues,
            _60toOnward_history: _60toOnward_history,

            demos: dealer[0].demos,
            remaining_demos: dealer[0].remaining_demos,
            company_name: dealer[0].company_name,
            company_address: dealer[0].company_address,
            city: dealer[0].city,
            state: dealer[0].state,
            country: dealer[0].country,
            postal_code: dealer[0].postal_code,
            tel_no: dealer[0].tel_no,
            website: dealer[0].website,
            timezone: dealer[0].timezone
        }

        if (get_connected_devices && get_connected_devices.length) {
            dt.connected_devices = get_connected_devices[0].total
        }

        if (get_parent_dealer && get_parent_dealer.length) {
            dt.parent_dealer = get_parent_dealer[0].dealer_name;
            dt.parent_dealer_id = get_parent_dealer[0].dealer_id;
        }

        // if (last_login && last_login.length) {
        //     dt.last_login = last_login[0].last_login
        // }

        if (dealer_type && dealer_type.length) {
            dt.dealer_type = dealer_type[0].role
        }

        return res.send({
            status: true,
            dealer: dt
        })
    } else {
        return res.send({
            status: false,
            dealer: null
        })
    }
}

exports.dealerDomains = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {

    let dealer_id = req.params.dealerId;
    let userType = verify.user.user_type;
    let userId = verify.user.id;

    if (!dealer_id || userType === Constants.SDEALER) {
        return res.send({
            status: false,
            domains: []
        })
    }
    let where_con = '';

    // if (userType === Constants.DEALER) {
    //     where_con = ` AND connected_dealer= ${userId}`
    // }
    let dealer_type = await general_helpers.getUserType(dealer_id);

    if (dealer_type === Constants.DEALER && userType == Constants.DEALER) {

        return res.send({
            status: false,
            domains: []
        })
    }

    if (dealer_type === Constants.DEALER) {
        where_con = ` OR (dealer_permissions.dealer_id = 0 AND dealer_permissions.dealer_type = 'admin') `
    } else if (dealer_type === Constants.SDEALER) {
        let getParentId = await sql.query(`SELECT connected_dealer FROM dealers WHERE dealer_id = ${dealer_id}`);
        where_con = ` OR (dealer_permissions.dealer_id = 0 AND (dealer_permissions.dealer_type='admin' OR (dealer_permissions.dealer_type='dealer' AND dealer_permissions.permission_by=${getParentId[0].connected_dealer}))) `
    }
    selectQ = `SELECT domains.*, dealer_permissions.permission_id, dealer_permissions.dealer_id, dealer_permissions.permission_by, dealer_permissions.dealer_type FROM domains JOIN dealer_permissions ON (dealer_permissions.permission_id = domains.id) WHERE (dealer_permissions.dealer_id = ${dealer_id} ${where_con}) AND permission_type = 'domain';`;

    let selectDomains = await sql.query(selectQ);

    // get all dealers under admin or sdealers under dealer
    let userDealers = await general_helpers.getUserDealers(dealer_type, dealer_id);
    // console.log("userDealers ========> ", userDealers);
    let sdealerList = userDealers.dealerList;
    let dealerCount = userDealers.dealerCount;



    let results = selectDomains;
    // for (var i = 0; i < results.length; i++) {
    //     let permissionDealers = await general_helpers.getDealersAgainstPermissions(results[i].id, 'domain', dealer_id, sdealerList, dealer_type);
    //     // let allDealers = [];

    //     results[i].dealers = permissionDealers.allDealers;
    //     results[i].statusAll = permissionDealers.statusAll;

    //     let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : [];

    //     let permissionCount = (permissions && permissions.length) ? permissions.length : 0;

    //     let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
    //     results[i].permission_count = permissionC;
    // }

    if (results && results.length) {
        return res.send({
            status: true,
            domains: results
        })
    } else {
        return res.send({
            status: true,
            domains: []
        })
    }
    // let dealerQ = `SELECT ${dealer_query_text} FROM dealers WHERE dealer_id=${dealer_id} ${where_con} LIMIT 1`;
    // let dealer = await sql.query(dealerQ);
}

exports.getDealerPaymentHistory = async function (req, res) {
    let verify = req.decoded;

    let user_type = verify.user.user_type;
    let dealer_id = req.params.dealerId;
    let condition = '';
    let status = req.body.status;

    if (!dealer_id || user_type === Constants.SDEALER) {
        return res.send({
            status: false,
            data: []
        })
    }
    let paymentHistoryQ = `SELECT * FROM financial_account_transections AS fat WHERE user_id=${dealer_id}`;

    if (status) {
        condition = ` AND status = '${status}'`
    } else {
        condition = ` AND type='credits'`
    }

    paymentHistoryQ = `${paymentHistoryQ} ${condition} ORDER BY id DESC`

    paymentHistoryData = await sql.query(paymentHistoryQ);


    response = {
        status: true,
        data: paymentHistoryData,
    };

    return res.send(response);

}

exports.getDealerSalesHistory = async function (req, res) {
    let verify = req.decoded;

    let user_type = verify.user.user_type;
    let dealer_id = req.body.dealer_id;

    let condition = '';
    let hardwareCondition = '';

    let packages = [];
    let packagesData = [];

    let hardwares = [];
    let hardwaresData = [];
    let totalCost = 0;
    let totalSale = 0;
    let totalProfitLoss = 0;
    let response = {};
    let sDealerIds = [];

    if (!dealer_id || user_type === Constants.SDEALER) {
        let saleInfo = {
            'totalCost': totalCost,
            'totalSale': totalSale,
            'totalProfitLoss': totalSale - totalCost,
        };

        response = {
            data: [...packagesData, ...hardwaresData],
            saleInfo,
            status: true,
        };

        return res.send(response);
    }



    let dealer_type = await general_helpers.getUserType(dealer_id);
    if (dealer_type === Constants.DEALER && user_type == Constants.DEALER) {
        let saleInfo = {
            totalCost: totalCost,
            totalSale: totalSale,
            totalProfitLoss: totalSale - totalCost,
        };

        response = {
            data: [...packagesData, ...hardwaresData],
            saleInfo,
            status: true,
        };

        return res.send(response);
    }

    condition = ` AND ua.dealer_id = ${dealer_id}`
    hardwareCondition = ` AND hd.dealer_id = ${dealer_id}`

    if (user_type === Constants.ADMIN && dealer_type === Constants.DEALER) {
        sDealerIds = await generalHelper.getSdealersByDealerId(dealer_id);

        if (sDealerIds.length > 0) {
            condition = ` AND ua.dealer_id IN (${dealer_id}, ${sDealerIds.join(',')})`
            hardwareCondition = ` AND hd.dealer_id IN (${dealer_id}, ${sDealerIds.join(',')})`
        }

    }

    let packagesQ = `SELECT ss.*, d.device_id as device_id, ss.status as status, ua.dealer_id as dealer_id, ua.link_code as dealer_pin FROM services_sale as ss
    JOIN usr_acc as ua on ua.id = ss.user_acc_id 
    JOIN devices as d on ua.device_id = d.id
    WHERE (ss.status != 'cancelled') AND ss.item_type LIKE 'package' ${condition} ORDER BY ss.id DESC`
    packages = await sql.query(packagesQ);

    packages.map(function (value) {

        let name = JSON.parse(value.item_data).pkg_name;
        let cost_price = 0;
        let sale_price = 0;
        let profit_loss = 0;

        if (value.item_dealer_cost === 0 && (user_type === Constants.ADMIN || user_type === Constants.SUPER_ADMIN)) {

            if (value.status === 'returned') {
                cost_price = parseInt(value.paid_admin_cost);
                sale_price = parseInt(value.paid_sale_price);

            } else {
                cost_price = parseInt(value.item_admin_cost);
                sale_price = parseInt(value.item_sale_price);
            }
            profit_loss = sale_price - cost_price;

            totalCost += cost_price;
            totalSale += sale_price;

            packagesData.push({
                'type': 'Package',
                'name': name.replace(/_/g, ' '),
                'dealer_pin': value.dealer_pin,
                'device_id': value.device_id,
                'cost_price': cost_price,
                'sale_price': sale_price,
                'profit_loss': profit_loss,
                'status': value.status,
                'created_at': value.created_at,
            })

        } else {

            if ((value.item_dealer_cost !== 0 || value.dealer_id == verify.user.id) && user_type === Constants.DEALER) {


                if (value.item_dealer_cost != 0) {

                    if (value.status === 'returned') {
                        cost_price = parseInt(value.paid_dealer_cost);
                        sale_price = parseInt(value.paid_sale_price);
                    } else {
                        cost_price = parseInt(value.item_dealer_cost);
                        sale_price = parseInt(value.item_sale_price);
                    }

                } else {
                    if (value.status === 'returned') {
                        cost_price = parseInt(value.paid_sale_price);
                        sale_price = parseInt(value.paid_retail_price);
                    } else {
                        cost_price = parseInt(value.item_sale_price);
                        sale_price = parseInt(value.retail_price);
                    }
                }

                profit_loss = sale_price - cost_price;

                totalCost += cost_price;
                totalSale += sale_price;

                packagesData.push({
                    'type': 'Package',
                    'name': name.replace(/_/g, ' '),
                    'dealer_pin': value.dealer_pin,
                    'device_id': value.device_id,
                    'cost_price': cost_price,
                    'sale_price': sale_price,
                    'profit_loss': profit_loss,
                    'status': value.status,
                    'created_at': value.created_at,
                })

            } else if (user_type === Constants.ADMIN || user_type === Constants.SUPER_ADMIN) {

                cost_price = parseInt(value.item_admin_cost);
                sale_price = parseInt(value.item_dealer_cost);
                profit_loss = sale_price - cost_price;

                totalCost += cost_price;
                totalSale += sale_price;

                packagesData.push({
                    'type': 'Package',
                    'name': name.replace(/_/g, ' '),
                    'dealer_pin': value.dealer_pin,
                    'device_id': value.device_id,
                    'cost_price': cost_price,
                    'sale_price': sale_price,
                    'profit_loss': profit_loss,
                    'created_at': value.created_at,
                })
            } else if (user_type === Constants.SDEALER) {

                if (value.status === 'returned') {
                    cost_price = parseInt(value.paid_retail_price);
                    sale_price = parseInt(value.paid_dealer_cost);
                } else {
                    cost_price = parseInt(value.item_sale_price);
                    sale_price = parseInt(value.retail_price);
                }

                profit_loss = sale_price - cost_price;

                totalCost += cost_price;
                totalSale += sale_price;

                packagesData.push({
                    'type': 'Package',
                    'name': name.replace(/_/g, ' '),
                    'dealer_pin': value.dealer_pin,
                    'device_id': value.device_id,
                    'cost_price': cost_price,
                    'sale_price': sale_price,
                    'profit_loss': profit_loss,
                    'created_at': value.created_at,
                })
            }
        }

    });


    let salesQ = `SELECT hd.*, d.device_id as device_id, ua.dealer_id as dealer_id, ua.link_code as dealer_pin FROM hardwares_data as hd
        JOIN usr_acc as ua 
            on ua.id = hd.user_acc_id 
        JOIN devices as d 
            on ua.device_id = d.id
        WHERE hd.id IS NOT NULL ${hardwareCondition} AND hd.status != 'returned' ORDER BY hd.id DESC`;

    hardwares = await sql.query(salesQ);

    hardwares.map(function (value, index) {
        let cost_price = 0;
        let sale_price = 0;
        let profit_loss = 0;

        if (value.dealer_cost_credits === 0 && (user_type === Constants.ADMIN || user_type === Constants.SUPER_ADMIN)) {

            cost_price = parseInt(value.admin_cost_credits);
            sale_price = parseInt(value.total_credits);
            profit_loss = sale_price - cost_price;

            totalCost += cost_price;
            totalSale += sale_price;

            hardwaresData.push({
                'type': 'Hardware',
                'name': value.hardware_name,
                'dealer_pin': value.dealer_pin,
                'device_id': value.device_id,
                'cost_price': cost_price,
                'sale_price': sale_price,
                'profit_loss': profit_loss,
                'created_at': value.created_at,
            })

        } else {

            if ((value.dealer_cost_credits !== 0 || value.dealer_id == verify.user.id) && user_type === Constants.DEALER) {

                if (value.dealer_cost_credits != 0) {

                    cost_price = parseInt(value.dealer_cost_credits);
                    sale_price = parseInt(value.total_credits);
                    profit_loss = sale_price - cost_price;

                    totalCost += cost_price;
                    totalSale += sale_price;

                    hardwaresData.push({
                        'type': 'Hardware',
                        'name': value.hardware_name,
                        'dealer_pin': value.dealer_pin,
                        'device_id': value.device_id,
                        'cost_price': cost_price,
                        'sale_price': sale_price,
                        'profit_loss': profit_loss,
                        'created_at': value.created_at,
                    })

                } else {

                    cost_price = parseInt(value.total_credits);
                    sale_price = parseInt(value.retail_price);
                    profit_loss = sale_price - cost_price;

                    totalCost += cost_price;
                    totalSale += sale_price;

                    hardwaresData.push({
                        'type': 'Hardware',
                        'name': value.hardware_name,
                        'dealer_pin': value.dealer_pin,
                        'device_id': value.device_id,
                        'cost_price': cost_price,
                        'sale_price': sale_price,
                        'profit_loss': profit_loss,
                        'created_at': value.created_at,
                    })
                }


            } else if (user_type === Constants.ADMIN || user_type === Constants.SUPER_ADMIN) {
                cost_price = parseInt(value.admin_cost_credits);
                sale_price = parseInt(value.dealer_cost_credits);
                profit_loss = sale_price - cost_price;

                totalCost += cost_price;
                totalSale += sale_price;

                hardwaresData.push({
                    'type': 'Hardware',
                    'name': value.hardware_name,
                    'dealer_pin': value.dealer_pin,
                    'device_id': value.device_id,
                    'cost_price': cost_price,
                    'sale_price': sale_price,
                    'profit_loss': profit_loss,
                    'created_at': value.created_at,
                })

            } else if (user_type === Constants.SDEALER) {
                cost_price = parseInt(value.total_credits);
                sale_price = parseInt(value.retail_price);
                profit_loss = sale_price - cost_price;

                totalCost += cost_price;
                totalSale += sale_price;

                hardwaresData.push({
                    'type': 'Hardware',
                    'name': value.hardware_name,
                    'dealer_pin': value.dealer_pin,
                    'device_id': value.device_id,
                    'cost_price': cost_price,
                    'sale_price': sale_price,
                    'profit_loss': profit_loss,
                    'created_at': value.created_at,
                })
            }

        }

    });


    let saleInfo = {
        'totalCost': totalCost,
        'totalSale': totalSale,
        'totalProfitLoss': totalSale - totalCost,
    };

    response = {
        data: [...packagesData, ...hardwaresData],
        saleInfo,
        status: true,
    };

    return res.send(response);
}

exports.changeDealerStatus = async function (req, res) {
    let verify = req.decoded;
    let userType = verify.user.user_type;
    let dealerStatus = req.body.dealerStatus;
    let dealerId = req.params.dealerId;

    if (userType !== Constants.ADMIN || !dealerStatus || !dealerId) {
        return res.send({
            status: false,
            msg: `Account Restriction couldn't be processed`
        })
    }

    let updateDealerQ = `UPDATE dealers SET account_balance_status='${dealerStatus}', account_balance_status_by='admin' WHERE dealer_id=${dealerId}`;
    sql.query(updateDealerQ, async function (error, updateResult) {
        if (error || !updateResult) {
            return res.send({
                status: false,
                msg: `Account Restriction couldn't be processed`
            })
        }

        /**
         * @author Usman Hafeez
         * @description commented this query as there is no need to select record again for now...
         */

        // let getDealerStatusQ = `SELECT account_balance_status, account_balance_status_by FROM dealers WHERE dealer_id=${dealerId} LIMIT 1`;
        // let dealerAccountStatus = await sql.query(getDealerStatusQ);
        // if(!dealerAccountStatus){
        //     return res.send({
        //         status: false,
        //         msg: `Account Restriction couldn't be processed`
        //     })
        // }

        return res.send({
            status: true,
            // account_balance_status: dealerAccountStatus[0].account_balance_status,
            // account_balance_status_by: dealerAccountStatus[0].account_balance_status_by,
            account_balance_status: dealerStatus,
            account_balance_status_by: userType,
            msg: 'Account Restricted successfully'
        })
    })
}

exports.getLoggedDealerApps = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let loggedUserId = verify.user.id;
        let loggedUserType = verify.user.user_type;

        let getAppsQ = "SELECT apk_details.* FROM apk_details ";
        if (loggedUserType !== Constants.ADMIN) {
            getAppsQ = `${getAppsQ} JOIN dealer_permissions ON (dealer_permissions.permission_id = apk_details.id) WHERE (dealer_permissions.dealer_id =${loggedUserId} OR dealer_permissions.dealer_id=0) AND apk_details.delete_status=0 AND apk_details.apk_type != 'permanent' AND dealer_permissions.permission_type = 'apk';`;
        } else {
            getAppsQ = `${getAppsQ} WHERE delete_status=0 AND apk_type != 'permanent';`;

        }
        console.log("getAppsQ ", getAppsQ);
        let apps = await sql.query(getAppsQ);

        if (apps.length > 0) {
            let data = []
            for (var i = 0; i < apps.length; i++) {
                dta = {
                    apk_id: apps[i].id,
                    apk_name: apps[i].app_name,
                    logo: apps[i].logo,
                    apk: apps[i].apk,
                    package_name: apps[i].package_name,
                    version_name: apps[i].version_name,
                    guest: false,
                    encrypted: false,
                    enable: false,
                    apk_status: apps[i].status,
                    deleteable: (apps[i].apk_type == "permanent") ? false : true
                }
                data.push(dta);
            }

            return res.json({
                status: true,
                list: data
            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // No result found
                list: []
            }

            res.send(data);
        }
    }
}


exports.getInfo = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var getinfo = "select * from dealers where dealer_id='" + verify.user.id + "'";

        sql.query(getinfo, async function (err, rows) {
            if (verify.user.user_type != 'sdealer') {
                data = {
                    "status": true,
                    "dealer_id": rows[0].dealer_id,
                    "dealer_name": rows[0].dealer_name,
                    "dealer_email": rows[0].dealer_email,
                    "link_code": rows[0].link_code
                }
            } else {
                var gtdealername = await sql.query("select * from dealers where dealer_id = '" + rows[0].connected_dealer + "'");
                data = {
                    "status": true,
                    "dealer_id": rows[0].dealer_id,
                    "connected_dealer": gtdealername[0].dealer_name,
                    "dealer_name": rows[0].dealer_name,
                    "dealer_email": rows[0].dealer_email,
                    "link_code": rows[0].link_code
                }
                res.send(data);
            }
            res.send(data);
        });

    }
}

exports.getDealerForSA = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        sql.query(`SELECT * FROM dealers WHERE type = 2 OR type = 3`, async function (error, results) {
            if (error) {
                console.log(error);
                res.send({
                    status: false,
                    msg: error
                });
                return;
            }
            console.log(results);
            if (results.length) {

                res.send({
                    status: true,
                    msg: "DATA FOUND",
                    data: results

                });
            }
            else {
                res.send({
                    status: false,
                    msg: "DATA NOT FOUND"
                });
                return;
            }
            return;
        });
    }
}

exports.getDropdownSelectedItems = async function (req, res) {
    var verify = req.decoded;
    // console.log('done or not');
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var loggedInuid = verify.user.id;
        // console.log('data from req', req.params.dropdownType);
        let dealer_id = verify.user.id;
        let dropdownType = req.params.dropdownType;
        sql.query("select * from dealer_dropdown_list where dealer_id = " + dealer_id + " AND type = '" + dropdownType + "'", async function (err, rslts) {
            if (err) {
                console.log(err)
            }

            if (rslts.length == 0) {
                data = {
                    "status": false,
                    "msg": await general_helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // No data found",
                    "data": '[]'
                };
                res.send(data);
            } else {
                if (rslts[0].selected_items != '' && rslts[0].selected_items != null) {
                    var str = rslts[0].selected_items;

                    data = {
                        "status": true,
                        "data": str
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": await general_helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // No data found",
                        "data": '[]'
                    };
                    res.send(data);
                }
            }
        });
    }
}

exports.saveDropDown = async function (req, res) {
    var verify = req.decoded;
    if (verify) {

        var selected_items = req.body.selected_items;
        var dropdownType = req.body.pageName;
        var dealer_id = verify.user.id;
        var sQuery = `SELECT * FROM dealer_dropdown_list WHERE dealer_id = ${dealer_id} AND type ='${dropdownType}'`;

        var sResult = await sql.query(sQuery);

        if (sResult.length == 0) {
            sql.query(`insert into dealer_dropdown_list (dealer_id, selected_items, type) values (${dealer_id}, '${selected_items}', '${dropdownType}')`, async function (err, rslts) {
                if (err) {
                    return res.send({
                        status: false,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_NOT_UP], "Items Not Updated"),
                    })
                }

                data = {
                    status: true,
                    msg: await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_ADDED], "Items Added"), // Items Added.
                    data: selected_items
                };
                return res.send(data);
            });
        } else {

            sql.query(`UPDATE dealer_dropdown_list SET selected_items = '${selected_items}' WHERE type='${dropdownType}' AND dealer_id=${dealer_id}`, async function (err, row) {
                if (err) {
                    return res.send({
                        status: false,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_NOT_UP], "Items Not Updated"),
                    })
                }

                if (row.affectedRows != 0) {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_UP], "Items Updated"), // Items Updated.',
                        data: selected_items
                    };
                } else {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_NOT_UP], "Items Not Updated"), // Items Not Updated.',
                    };
                }
                return res.send(data);
            });
        }
    }
}

exports.getPagination = async function (req, res) {
    var verify = req.decoded;
    // console.log('done or not');
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {

        // console.log('data from req', req.params.dropdownType);
        let dealer_id = verify.user.id;
        let dropdownType = req.params.dropdownType;
        sql.query("select record_per_page from dealer_pagination where dealer_id = " + dealer_id + " AND type = '" + dropdownType + "'", async function (err, rslts) {
            if (err) {
                console.log(err)
            }

            if (rslts.length == 0) {
                data = {
                    "status": false,
                    "msg": await general_helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // No data found",
                    "data": '10'
                };
                res.send(data);
            } else {

                data = {
                    "status": true,
                    "data": rslts[0].record_per_page

                };
                res.send(data);

            }
        });
    }
}


exports.postPagination = async function (req, res) {
    // console.log("Working")
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var selectedValue = req.body.selectedValue;
        var dropdownType = req.body.pageName;
        var dealer_id = verify.user.id;
        var squery = "select * from dealer_pagination where dealer_id = " + dealer_id + " AND type ='" + dropdownType + "'";
        var srslt = await sql.query(squery);

        if (srslt.length == 0) {
            var squery = sql.query("insert into dealer_pagination (dealer_id, record_per_page, type) values (" + dealer_id + ", '" + selectedValue + "', '" + dropdownType + "')", async function (err, rslts) {
                data = {
                    status: true,
                    msg: await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_ADDED], "record Added"), // record Added.',
                    data: rslts
                };
                res.send(data);
            });
        } else {

            sql.query("update dealer_pagination set record_per_page = '" + selectedValue + "' where type='" + dropdownType + "' AND dealer_id='" + dealer_id + "'", async function (err, row) {
                // console.log('squery data ', 'rowws', row);
                if (row && row.affectedRows !== 0) {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_UP], "Items Updated"), // Items Updated.',
                        data: row
                    };

                    res.send(data);
                } else {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_NOT_UP], "Items Not Updated"), // Items Not Updated.',
                        data: row
                    };
                    res.send(data);

                }
            });
        }
    }
}


/**
 * Update Dealer PINs
 * Update Dealer PINs of all existing dealers
 * http://localhost:3000/users/dealer/update_dealer_pins
 * one time useage - menual end point
 *
 *
 * By Muhammad Irfan Afzal - mi3afzal
 * 02-08-2019
 * **/
exports.updateDealerPins = async function (req, res) {
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
        `SELECT * FROM dealers WHERE link_code IS NOT NULL ORDER BY dealer_id ASC`,
        async function (error, results, fields) {
            if (error) throw error;

            output = [];
            for (var i = 0; i < results.length; i++) {
                const oldDealerPin = results[i].link_code;
                const newDealerPin = general_helpers.replaceAt(
                    oldDealerPin,
                    app_constants.DEALER_PIN_SYSTEM_LETTER_INDEX,
                    app_constants.DEALER_PIN_SYSTEM_LETTER
                );

                var email = '';
                if (oldDealerPin != newDealerPin) {
                    await sql.query(
                        `UPDATE dealers SET link_code = '${newDealerPin}' WHERE dealer_id = ${
                        results[i].dealer_id
                        } `
                    );
                    await sql.query(
                        `UPDATE acc_action_history SET link_code = '${newDealerPin}' WHERE link_code = '${oldDealerPin}' `
                    );
                    await sql.query(
                        `UPDATE transferred_profiles SET link_code = '${newDealerPin}' WHERE link_code = '${oldDealerPin}' `
                    );
                    await sql.query(
                        `UPDATE usr_acc SET link_code = '${newDealerPin}' WHERE link_code = '${oldDealerPin}' `
                    );


                    email = 'email send';
                    var html = `We have updated your Dealer PIN for better system integrity. <br>
                    Your new Dealer Pin is : ${newDealerPin}<br>
                    Below is the link to login : <br> ${app_constants.HOST} <br>`;

                    sendEmail("Account Update", html, results[i].dealer_email, async function (emailError, response) {
                        if (emailError) email = 'email not send';
                    });
                }
                output[i] = [oldDealerPin, newDealerPin, email];
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


/**
 *
 */
exports.twoFactorAuth = async function (req, res) {
    var verify = req.decoded;
    // if (verify['status'] !== undefined && verify.status === true) {
    if (verify) {
        let loggedDealerId = verify.user.id;
        isEnable = req.body.isEnable;
        let updateDealerQ =
            "UPDATE dealers SET is_two_factor_auth=" +
            isEnable +
            " WHERE dealer_id=" +
            loggedDealerId;
        let updatedDealer = await sql.query(updateDealerQ);
        if (updatedDealer.affectedRows) {
            if (isEnable) {
                data = {
                    status: true,
                    msg: await general_helpers.convertToLang(
                        req.translation[MsgConstants.DUAL_AUTH_SUCC_ENBL],
                        "Dual Authentication is Successfully enabled"
                    ), // Dual Authentication is Successfully enabled
                    isEnable: isEnable
                };
            } else {
                data = {
                    status: true,
                    msg: await general_helpers.convertToLang(
                        req.translation[MsgConstants.DUAL_AUTH_SUCC_DISABL],
                        "Dual Authentication is Successfully disabled"
                    ), // Dual Authentication is Successfully disabled
                    isEnable: isEnable
                };
            }
            return res.send(data);
        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(
                    req.translation[MsgConstants.DUAL_AUTH_NOT_ENBL],
                    "Dual Authentication could not be enabled"
                ) // Dual Authentication could not be enabled
            };
            return res.send(data);
        }
    }
}




/**
 * save dealer permissions with new structure
 * @author Usman Hafeez
 *
 */
exports.dealerPermissions = async function (req, res) {
    var verify = req.decoded;
    let loggedUserId = verify.user.dealer_id;
    let loggedUserType = verify.user.user_type;
    let permissionType = req.params.permissionType;
    console.log(req.body, "permissionType ", permissionType)
    let action = req.body.action // save, delete, 
    let permissionId = req.body.permissionId;
    let dealers = req.body.dealers;
    let statusAll = req.body.statusAll;

    let prevPermissionsQ = ''
    let prevParsDealers = [];
    let allDealers = [];

    prevPermissionsQ = `SELECT dealer_id FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type ='${permissionType}' AND permission_by = ${loggedUserId}`;
    // console.log("prevPermissionsQ ", prevPermissionsQ)

    let getPermissionDealers = await sql.query(prevPermissionsQ);
    // console.log("getPermissionDealers ", getPermissionDealers)

    if (getPermissionDealers.length > 0) {
        if (getPermissionDealers[0].dealer_id == 0) {
            prevParsDealers = 0;
            // if (permissionType == "package") {
            //     if (loggedUserType === ADMIN) {
            //         let getDealers = await sql.query(`SELECT * FROM dealers WHERE type = 2 ORDER BY created DESC`);
            //         allDealers = getDealers.map((dlr) => dlr.dealer_id);
            //     }
            //     else if (loggedUserType === DEALER) {
            //         let getDealers = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
            //         allDealers = getDealers.map((dlr) => dlr.dealer_id);
            //     }
            // } else {
            let dealerData = await general_helpers.getUserDealers(loggedUserType, loggedUserId, permissionType);
            allDealers = dealerData.dealerList;
            // }
        } else {
            prevParsDealers = getPermissionDealers.map((prm) => prm.dealer_id);
        }
    }
    // console.log("prevParsDelaer", prevParsDealers);

    // console.log("selected", dealers);
    let newDealers = JSON.parse(dealers); // dealers from client side to permit
    let condition = '';

    if (newDealers.length) {

        if (prevParsDealers === 0) {
            if (action === 'delete') {

                // console.log("prevParsDealers, permissionType, permissionId, loggedUserId ::", getPermissionDealers, prevParsDealers, permissionType, permissionId, loggedUserId)
                // let responseData = await general_helpers.savePermission(prevParsDealers, permissionType, permissionId, loggedUserId)

                let deleteNotIn = `DELETE FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by=${loggedUserId}`;
                // console.log("deleteNotIn: ", deleteNotIn);
                let deleteDealers = await sql.query(deleteNotIn);

                if (deleteDealers.affectedRows) {
                    // console.log("allDealers ", allDealers);
                    prevParsDealers = allDealers.filter((dealerId) => !newDealers.includes(dealerId))
                    // console.log("prevParsDelaer delete func for all dealers: ", prevParsDealers);

                    if (prevParsDealers.length) {

                        let responseData = await general_helpers.savePermission(getPermissionDealers, prevParsDealers, permissionType, permissionId, loggedUserId, loggedUserType)
                        // console.log("responseData ", responseData);
                        if (responseData.status) {
                            return res.send({
                                status: true,
                                msg: 'Permission remove successfully'
                            })
                        } else {
                            return res.send({
                                status: false,
                                msg: 'Failed to remove permission'
                            })
                        }
                    } else {
                        return res.send({
                            status: true,
                            msg: 'Permission remove successfully'
                        })
                    }
                } else {
                    return res.send({
                        status: false,
                        msg: 'Permission not found'
                    })
                }


            } else {
                return res.send({
                    status: false,
                    msg: 'permission action is not defined.'
                })
            }
        } else {

            if (action === 'save') {
                console.log('save action')

                // if selected all dealers
                if (!statusAll) {
                    // console.log('save action not all');

                    // if (prevParsDealers != 0) {
                    if (prevParsDealers.length) {
                        // console.log('previous exist')
                        for (let i = 0; i < newDealers.length; i++) {
                            if (prevParsDealers.indexOf(newDealers[i]) === -1) {
                                prevParsDealers.push(newDealers[i])
                            }
                        }
                    } else {
                        // console.log('previous not exist')
                        prevParsDealers = newDealers
                    }

                    // console.log(typeof (prevParsDealers), "prevParsDelaer updated", prevParsDealers);

                    if (prevParsDealers.length) {
                        // delete dealers that are not in new permissions
                        let deleteNotIn = `DELETE FROM dealer_permissions WHERE dealer_id NOT IN (${prevParsDealers}) AND permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by= ${loggedUserId}`;
                        let deleteDealers = await sql.query(deleteNotIn);
                        // console.log("deleteDealers: ", deleteDealers);
                    }

                    let responseData = await general_helpers.savePermission(getPermissionDealers, prevParsDealers, permissionType, permissionId, loggedUserId, loggedUserType)
                    // console.log("responseData ", responseData);
                    return res.send(responseData);
                    // }


                } else {
                    console.log("All", dealers);
                    let parsedDealers = JSON.parse(dealers);

                    for (let i = 0; i < parsedDealers.length; i++) {
                        if (prevParsDealers.indexOf(parsedDealers[i]) === -1) {
                            prevParsDealers.push(parsedDealers[i])
                        }
                    }

                    // delete All Entries with dealer ids
                    let deleteAllDealersQ = `DELETE FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by = ${loggedUserId}`;
                    // console.log("deleteAllDealersQ: ", deleteAllDealersQ);
                    let deleteAllDealers = await sql.query(deleteAllDealersQ);
                    // console.log("deleteAllDealers: ", deleteAllDealers);

                    let insertAllDealersQ = `INSERT INTO dealer_permissions (permission_id, dealer_id, permission_type, permission_by, dealer_type) VALUE (${permissionId}, '0', '${permissionType}', ${loggedUserId}, '${loggedUserType}')`;
                    console.log("insertAllDealersQ: ", insertAllDealersQ);
                    let insertAllDealers = await sql.query(insertAllDealersQ, async function (error, result) {
                        if (error) {
                            return res.send({
                                status: false,
                                msg: 'Permission duplicate problem'
                            })
                        }

                        return res.send({
                            status: true,
                            msg: 'Permission saved successfully'
                        })
                    });

                }

            } else if (action === 'delete') {
                console.log('delete dealers:');

                if (!statusAll) {
                    dealers = JSON.parse(dealers);

                    if (prevParsDealers !== 0) {
                        for (let i = 0; i < dealers.length; i++) {
                            var index = prevParsDealers.indexOf(dealers[i]);
                            // console.log("array index", index);
                            if (index > -1) {
                                prevParsDealers.splice(index, 1);
                            }
                        }


                        console.log("prevParsDealers ", prevParsDealers);

                        // delete dealers that are not in new permissions
                        let deleteNotIn = '';
                        if (prevParsDealers.length) {
                            deleteNotIn = `DELETE FROM dealer_permissions WHERE dealer_id NOT IN (${prevParsDealers.join()}) AND permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by=${loggedUserId}`;
                        } else {
                            deleteNotIn = `DELETE FROM dealer_permissions WHERE dealer_id IN (${dealers}) AND permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by=${loggedUserId}`;
                        }
                        console.log("deleteNotIn: ", deleteNotIn);
                        let deleteDealers = await sql.query(deleteNotIn);
                        // console.log("deleteDealers: ", deleteDealers);

                        if (deleteDealers.affectedRows) {
                            await sql.query(`DELETE FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by IN (${dealers})`);

                            return res.send({
                                status: true,
                                msg: 'Permission remove successfully'
                            })
                        } else {
                            return res.send({
                                status: false,
                                msg: 'Failed to remove permission'
                            })
                        }
                    } else {

                    }

                } else {

                    if (loggedUserType !== Constants.ADMIN) {
                        condition = ` AND permission_by=${loggedUserId}`
                    }
                    let deleteNotIn = `DELETE FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type='${permissionType}' ${condition}`;
                    console.log("deleteNotIn: ", deleteNotIn);
                    let deleteDealers = await sql.query(deleteNotIn);
                    console.log("deleteDealers: ", deleteDealers);

                    // let updateDealersOfTypeQ = `UPDATE ${tableName} SET dealers = '${JSON.stringify([])}' WHERE id=${permissionId}`;
                    // let updateDealersOfType = await sql.query(updateDealersOfTypeQ)

                    if (deleteDealers.affectedRows) {
                        // await sql.query(`DELETE FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by IN (${dealers})`);

                        return res.send({
                            status: true,
                            msg: 'Permission remove successfully'
                        })
                    } else {
                        return res.send({
                            status: false,
                            msg: 'Failed to remove permission'
                        })
                    }
                }
                // dealers = JSON.parse(dealers);

                // if (dealers.length) {
                //     for (let i = 0; i < dealers.length; i++) {
                //         var index = prevParsDealers.indexOf(dealers[i]);
                //         console.log("array index", index);
                //         if (index > -1) {
                //             prevParsDealers.splice(index, 1);
                //         }
                //     }
                //     // console.log(prevParsDealers);
                //     let toDeleteDealers = (prevParsDealers.length > 0) ? prevParsDealers.join() : '""';

                //     let updateDealersOfTypeQ = `UPDATE ${tableName} SET dealers = '${JSON.stringify(prevParsDealers)}' WHERE id=${permissionId}`;
                //     let updateDealersOfType = await sql.query(updateDealersOfTypeQ)


                // let deleteNotInQ = `DELETE FROM dealer_permissions WHERE dealer_id NOT IN (${toDeleteDealers}) AND permission_id = ${permissionId} AND permission_type='${permissionType}'`;
                //     console.log(deleteNotIn);
                //     await sql.query(deleteNotIn);
                //     if (prevParsDealers.length > 0) {
                //         let dealerids = []
                //         let apkIds = []
                //         let dealer_apks_data = await sql.query("SELECT * from dealer_apks");
                //         if (dealer_apks_data.length) {
                //             dealer_apks_data.map(
                //             insertOrIgnore = ins(item) => {
                //                 dealerids.push(item.dealer_id)
                //                 apkIds.push(item.apk_id)
                //             })
                //         }
                //         let insertQuery = "INSERT INTO dealer_apks (dealer_id, apk_id) VALUES";

                //         let insertOrIgnore = ' '
                //         for (let i = 0; i < prevParsDealers.length; i++) {
                //             if (apkIds.indexOf(apkId) !== -1 && dealerids.indexOf(prevParsDealers[i]) !== -1) {
                //                 continue
                //             }ertOrIgnore + "(" + prevParsDealers[i] + "," + apkId + "),"
                //         }
                //         if (insertOrIgnore.length > 1) {
                //             let query = insertQuery + insertOrIgnore;
                //             query = query.slice(0, query.length - 1)
                //             console.log(query);
                //             await sql.query(query);
                //         }
                //     }
                //     // console.log(insertQuery + insertOrIgnore);
                // }

                // sql.query(updateAPKQ, async (error, result) => {
                //     if (error) {
                //         console.log(error);
                //     }
                //     let permissionC = [];
                //     let rslt = await sql.query("select dealers from apk_details where id='" + apkId + "' order by id ASC")
                //     if (rslt.length) {
                //         console.log(rslt, ' do ti ');
                //         if (rslt !== undefined && rslt !== null) {
                //             let permission = JSON.parse(rslt[0].dealers);
                //             console.log("Verify user id", verify.user.user_type);
                //             if (verify.user.user_type === Constants.ADMIN) {
                //                 if (permission !== undefined && permission !== null && permission !== '[]') {
                //                     let adminRoleId = await helpers.getUserTypeIDByName(Constants.ADMIN);
                //                     let dealerCount = await helpers.dealerCount(adminRoleId);
                //                     permissionC = ((permission.length == dealerCount) && (permission.length > 0)) ? "All" : permission.length.toString();

                //                 }
                //             }
                //             else if (verify.user.user_type === Constants.DEALER) {
                //                 let sdealerList = await sql.query("select count(*) as dealer_count ,dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                //                 let dealerCount = sdealerList[0].dealer_count;
                //                 console.log("dasda", dealerCount);
                //                 let Sdealerpermissions = permission.filter(function (item) {
                //                     for (let i = 0; i < sdealerList.length; i++) {
                //                         if (item === sdealerList[i].dealer_id) {
                //                             return item
                //                         }
                //                     }
                //                 })
                //                 console.log("sadasdsad", Sdealerpermissions);
                //                 let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                //                 permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                //             }
                //         };

                //     }
                //     if (result.affectedRows) {
                //         res.send({
                //             status: true,
                //             msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_REMOVED_SUCCESSFULLY], "Permission Removed successfully"), // "Permission Removed successfully",
                //             permission_count: permissionC,
                //         })
                //     } else {
                //         res.send({
                //             status: false,
                //             msg: await helpers.convertToLang(req.translation[MsgConstants.PERMISSION_NOT_SAVED], "Permission couldn't be saved"), // "Permission couldn't be saved"
                //         })
                //     }
                // });

            } else {
                return res.send({
                    status: false,
                    msg: 'permission action is not defined'
                })
            }
        }
    } else {
        return res.send({
            status: false,
            msg: 'Dealers not selected'
        })
    }

}


exports.connectDealerDomainsPermissions = async function (req, res) {
    var verify = req.decoded;
    let loggedUserId = verify.user.dealer_id;
    let loggedUserType = verify.user.user_type;
    let permissionType = 'domain' // req.params.permissionType;
    console.log(req.body, "permissionType ", permissionType)
    let action = req.body.action // save, delete, 
    let permissionIds = req.body.permissionIds;
    let permitDealer = req.body.dealers;
    let statusAll = req.body.statusAll;

    let prevPermissionsQ = ''
    let prevParsDealers = [];
    let allDealers = [];

    let failedToAdd = [];
    let failedToRemove = [];
    let permissionAdded = [];
    let permissionRemoved = [];
    let ActionNotDefined = [];

    for (let permissionId of permissionIds) {

        prevPermissionsQ = `SELECT dealer_id FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type ='${permissionType}' AND permission_by = ${loggedUserId}`;
        // console.log("prevPermissionsQ ", prevPermissionsQ)

        let getPermissionDealers = await sql.query(prevPermissionsQ);
        // console.log("getPermissionDealers ", getPermissionDealers)

        if (getPermissionDealers.length > 0) {
            if (getPermissionDealers[0].dealer_id == 0) {
                prevParsDealers = 0;

                let dealerData = await general_helpers.getUserDealers(loggedUserType, loggedUserId, permissionType);
                allDealers = dealerData.dealerList;

            } else {
                prevParsDealers = getPermissionDealers.map((prm) => prm.dealer_id);
            }
        }
        // console.log("prevParsDelaer", prevParsDealers);

        // console.log("selected", dealers);
        let newDealers = permitDealer; // dealers from client side to permit

        if (prevParsDealers === 0) {
            if (action === 'delete') {

                let deleteNotIn = `DELETE FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by=${loggedUserId}`;
                // console.log("deleteNotIn: ", deleteNotIn);
                let deleteDealers = await sql.query(deleteNotIn);

                if (deleteDealers.affectedRows) {
                    // console.log("allDealers ", allDealers);
                    prevParsDealers = allDealers.filter((dealerId) => !newDealers.includes(dealerId))
                    // console.log("prevParsDelaer delete func for all dealers: ", prevParsDealers);

                    if (prevParsDealers.length) {

                        let responseData = await general_helpers.savePermission(getPermissionDealers, prevParsDealers, permissionType, permissionId, loggedUserId, loggedUserType)
                        // console.log("responseData ", responseData);
                        if (responseData.status) {
                            permissionRemoved.push(permissionId);
                        } else {
                            failedToRemove.push(permissionId);
                        }
                    } else {
                        permissionRemoved.push(permissionId);
                    }
                } else {
                    failedToRemove.push(permissionId);
                }


            } else {
                ActionNotDefined.push(permissionId);
            }
        } else {

            if (action === 'save') {
                console.log('save action')

                // if selected all dealers
                if (!statusAll) {
                    // console.log('save action not all');

                    if (prevParsDealers.length) {
                        // console.log('previous exist')
                        for (let i = 0; i < newDealers.length; i++) {
                            if (prevParsDealers.indexOf(newDealers[i]) === -1) {
                                prevParsDealers.push(newDealers[i])
                            }
                        }
                    } else {
                        // console.log('previous not exist')
                        prevParsDealers = newDealers
                    }
                    // console.log(typeof (prevParsDealers), "prevParsDelaer updated", prevParsDealers);

                    if (prevParsDealers.length) {
                        // delete dealers that are not in new permissions
                        let deleteNotIn = `DELETE FROM dealer_permissions WHERE dealer_id NOT IN (${prevParsDealers}) AND permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by= ${loggedUserId}`;
                        let deleteDealers = await sql.query(deleteNotIn);
                        // console.log("deleteDealers: ", deleteDealers);
                    }

                    let responseData = await general_helpers.savePermission(getPermissionDealers, prevParsDealers, permissionType, permissionId, loggedUserId, loggedUserType)
                    // console.log("responseData ", responseData);
                    // return res.send(responseData);
                    if (responseData.status) {
                        permissionAdded.push(permissionId);
                    } else {
                        failedToAdd.push(permissionId);
                    }
                }

            } else if (action === 'delete') {
                console.log('delete dealers:');

                if (!statusAll) {
                    dealers = permitDealer;

                    if (prevParsDealers !== 0) {
                        for (let i = 0; i < dealers.length; i++) {
                            var index = prevParsDealers.indexOf(dealers[i]);
                            if (index > -1) {
                                prevParsDealers.splice(index, 1);
                            }
                        }
                        // console.log("prevParsDealers ", prevParsDealers);

                        // delete dealers that are not in new permissions
                        let deleteNotIn = '';
                        if (prevParsDealers.length) {
                            deleteNotIn = `DELETE FROM dealer_permissions WHERE dealer_id NOT IN (${prevParsDealers.join()}) AND permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by=${loggedUserId}`;
                        } else {
                            deleteNotIn = `DELETE FROM dealer_permissions WHERE dealer_id IN (${dealers}) AND permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by=${loggedUserId}`;
                        }
                        console.log("deleteNotIn: ", deleteNotIn);
                        let deleteDealers = await sql.query(deleteNotIn);
                        // console.log("deleteDealers: ", deleteDealers);

                        if (deleteDealers.affectedRows) {
                            await sql.query(`DELETE FROM dealer_permissions WHERE permission_id = ${permissionId} AND permission_type='${permissionType}' AND permission_by IN (${dealers})`);

                            permissionRemoved.push(permissionId);
                        } else {
                            failedToRemove.push(permissionId);
                        }
                    } else {
                        failedToRemove.push(permissionId);
                    }
                }

            } else {
                ActionNotDefined.push(permissionId);
            }
        }
    }; // end for loop

    // console.log("permissionAdded: ", permissionAdded, "failedToAdd:: ", failedToAdd, "permissionRemoved: ", permissionRemoved, "failedToRemove: ", failedToRemove, "ActionNotDefined: ", ActionNotDefined);

    // handle all responses
    if (permissionAdded.length > 0 && failedToAdd.length === 0) {
        data = {
            status: true,
            msg: permissionAdded.length > 1 ? 'Domains Added successfully' : 'Domain Add successfully'
        }
    }
    else if (permissionAdded.length === 0 && failedToAdd.length > 0) {
        data = {
            status: false,
            msg: 'Failed to add domains'
        }
    }
    else if (permissionAdded.length > 0 && failedToAdd.length > 0) {
        data = {
            status: true,
            msg: 'Some domains added successfully but others failed to add!'
        }
    }
    else if (permissionRemoved.length > 0 && failedToRemove.length === 0) {
        data = {
            status: true,
            msg: 'Domain remove successfully'
        }
    }
    else if (permissionRemoved.length === 0 && failedToRemove.length > 0) {
        data = {
            status: false,
            msg: 'Failed to remove'
        }
    }
    else if (permissionRemoved.length > 0 && failedToRemove.length > 0) {
        data = {
            status: true,
            msg: 'Some domains remove successfully but others failed to remove!'
        }
    }
    else if (ActionNotDefined.length > 0) {
        data = {
            status: false,
            msg: 'Action not define'
        }
    }
    else {
        data = {
            status: false,
            msg: 'Error while processing'
        }
    }
    // console.log("response data is: ", data)
    res.send(data);
}

exports.setDealerDemosLimit = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var demos = req.body.demos;
        var dealer_id = req.body.dealer_id;
        if (dealer_id && demos) {
            let dealer = await sql.query(`SELECT * FROM dealers WHERE dealer_id =${dealer_id}`)
            if (!dealer) {
                return res.send({
                    status: false,
                    msg: await general_helpers.convertToLang(req.translation[""], "Dealer not found to update."), // Dealer not found to Update"
                });
            }
            if (dealer && dealer.length) {
                let updateDemosLimitQ = ''
                if (dealer[0].demos == 0) {
                    updateDemosLimitQ = `UPDATE dealers SET demos = ${demos} , remaining_demos = ${demos} WHERE dealer_id = ${dealer_id}`
                } else {
                    let used_demos = dealer[0].demos - dealer[0].remaining_demos
                    let remaining_demos = demos - used_demos
                    remaining_demos = remaining_demos > 0 ? remaining_demos : 0
                    updateDemosLimitQ = `UPDATE dealers SET demos = ${demos} , remaining_demos = ${remaining_demos} WHERE dealer_id = ${dealer_id}`
                }
                sql.query(updateDemosLimitQ, async function (err, response) {
                    if (err) {
                        console.log(err);
                        data = {
                            status: false,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.QUERY_ERROR], "Query Error"), // Please enter valid details
                        }
                        return res.send(data);
                    }
                    if (response && response.affectedRows) {
                        let updatedRecord = await sql.query(`SELECT * FROM dealers WHERE dealer_id = ${dealer_id}`)
                        data = {
                            status: true,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC], "Record Updated Successfully"), // Please enter valid details
                            data: updatedRecord[0]
                        }
                        return res.send(data)
                    } else {
                        data = {
                            status: false,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_NOT_UPD], "Record not Updated."), // Please enter valid details
                        }
                        return res.send(data)

                    }
                })
            }
        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.ENTER_VALID_DETAIL], "Please enter valid details"), // Please enter valid details
            }
            return res.send(data);
        }
    }
}

exports.setTimeZone = async function (req, res) {
    try {
        var verify = req.decoded;
        console.log("setTimeZone :: ", req.body.data);
        // return res.send({ status: true, msg: "done" });

        if (verify) {
            let updateQ = `UPDATE dealers SET timezone = '${req.body.data}' WHERE dealer_id = ${verify.user.id};`;
            console.log("updateQ ", updateQ);
            let result = await sql.query(updateQ);

            if (result && result.affectedRows) {
                res.send({ status: true, msg: "Timezone Successfully Updated" });
            } else {
                res.send({ status: false, msg: "Failed to Update timezone" });
            }

        }
    } catch (err) {
        console.log(err);
        res.send({ status: false, msg: "Error While Processing" });
    }
}