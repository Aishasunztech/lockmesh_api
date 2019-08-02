var generator = require('generate-password');
var empty = require('is-empty');
var md5 = require('md5');
var randomize = require('randomatic');
var empty = require('is-empty');
var Constants = require('../../constants/Application');
const { sql } = require('../../config/database');
const { sendEmail } = require('../../lib/email');
const verifyToken = require('../../config/auth');

// 
const general_helpers = require('../../helper/general_helper');


// Constants
const app_constants = require('../../config/constants');
const MsgConstants = require('../../constants/MsgConstants');
const constants = require('../../constants/Application');

// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"

exports.getAllDealers = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {

        var role = await general_helpers.getuserTypeIdByName(verify.user.user_type);
        if (verify.user.user_type == constants.ADMIN) {

            sql.query(`SELECT * FROM dealers WHERE type!=${role} AND type != 4 AND type !=5 ORDER BY created DESC`, async function (error, results) {
                if (error) {
                    console.log(error);
                    res.send({
                        status: false,
                        msgg: error
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
                        connected_devices: get_connected_devices
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
                        msgg: error
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
        if (verify.user.user_type === constants.ADMIN) {
            role = await general_helpers.getDealerTypeIdByName(req.params.pageName);
        } else if (verify.user.user_type === constants.DEALER) {
            role = await general_helpers.getDealerTypeIdByName('sdealer');
            where = ` AND connected_dealer =${verify.user.id} `
        }

        if (!empty(role)) {
            sql.query(`SELECT * FROM dealers WHERE type=${role}  ${where} ORDER BY created DESC`, async function (error, results) {
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
                        devicesList: await general_helpers.getAllRecordbyDealerId(results[i].dealer_id)
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
            res.send({
                status: false,
                msg: "Error in query " + error,
                data: []
            });
            return;
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

            if (userType == constants.SDEALER || (userType == constants.DEALER && pageType == constants.DEALER)) {
                data = {
                    status: false,
                    msg: "invalid operation",
                }
                res.send(data);
                return;
            }

            let sdealerDealerId = 0;

            if (userType == constants.ADMIN && pageType == constants.SDEALER) {
                sdealerDealerId = req.body.dealerId;
            } else if (userType == constants.DEALER && pageType == constants.SDEALER) {
                sdealerDealerId = loggedInuid;
            }

            /* var link_code = randomize('0', 6);
            link_code = await general_helpers.checkLinkCode(link_code); */
            var link_code = await general_helpers.genrateLinkCode();

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

                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(constants.deviceColumns) + "', 'devices') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(constants.dealerColumns) + "', 'dealer') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(constants.sdealerColumns) + "', 'sdealer') ")
                    sql.query("INSERT INTO dealer_dropdown_list(dealer_id, selected_items, type) VALUES('" + rows.insertId + "', '" + JSON.stringify(constants.apkColumns) + "', 'apk') ")
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

                            if (pageType == constants.SDEALER && (sdealerDealerId != undefined && !empty(sdealerDealerId) && sdealerDealerId != null && sdealerDealerId != 0)) {
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
        var mailgiven = false;
        var enc_pwd = ''
        if (!empty(dealer_id) && (!empty(name) || !empty(email))) {

            // let dealer = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_email = '${email}' AND dealer_id =${dealer_id}`)
            let dealer = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_id =${dealer_id}`)
            if (dealer && dealer.length) {
                if (!empty(email)) {

                    mailgiven = true;
                    let checkMail = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_email='${email}' AND dealer_id !=${dealer_id}`);
                    if (checkMail.length) {
                        alreadyAvailable = true;

                        data = {
                            status: true,
                            msg: await general_helpers.convertToLang(req.translation[MsgConstants.EMAIL_ALREDY_USED_DEALER], "Email is already in use of other dealer"), // Email is already in use of other dealer
                            data: row,
                            alreadyAvailable: alreadyAvailable
                        };
                        res.send(data);
                        return;

                    }

                    var dealer_pwd = generator.generate({
                        length: 10,
                        numbers: true
                    });
                    enc_pwd = md5(dealer_pwd);

                    setFields = `${setFields}  dealer_email='${email}', password = '${enc_pwd}' `;
                }

            } else {
                res.send({
                    status: false,
                    msg: await general_helpers.convertToLang(req.translation[MsgConstants.EMAIL_ALREDY_USED_DEALER], "Email is already in use of other dealer"), // Dealer not found to Update"
                });
                return;
            }


            if (!empty(name)) {

                if (mailgiven == true && alreadyAvailable == false) {
                    setFields = `${setFields}, dealer_name='${name}'`;
                } else {
                    setFields = ` dealer_name='${name}'`;
                }
            }

            var query = `UPDATE dealers SET ${setFields} WHERE dealer_id = ${dealer_id}`;

            sql.query(query, async function (error, row) {

                if (row.affectedRows != 0) {
                    html = `Your login details are : <br>
                            Email : ${email} <br>
                            Password : ${dealer_pwd} <br>
                            Below is the link to login : <br> 
                            ${app_constants.HOST} <br>`;

                    sendEmail("Account Registration", html, email, async function (error, response) {
                        if (error) {
                            console.log(error)
                            res.send({
                                status: true,
                                msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC_EMAIL_NOT_SEND], "Record updated successfully. Email not sent"), // Record updated successfully. Email not sent
                                alreadyAvailable: alreadyAvailable
                            })
                            return;
                        } else {
                            res.send({
                                status: true,
                                msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_UPD_SUCC_EMAIL_SEND], "Record updated successfully. Email has been sent"), // Record updated successfully. Email has been sent.
                                alreadyAvailable: alreadyAvailable
                            })
                            return;
                        }
                    });

                } else {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(req.translation[MsgConstants.RECORD_NOT_UPD], "Record not updated"), // Record not updated.
                    };
                    res.send(data);
                    return;
                }
            });
        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(req.translation[MsgConstants.ENTER_VALID_DETAIL], "Please enter valid details"), // Please enter valid details
            }
            res.send(data);
            return;
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

exports.suspendDealer = async function (req, res) {
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        var loggedInuid = verify.user.id;
        let dealer_id = req.body.dealer_id;

        if (!empty(dealer_id)) {

            //suspend dealer
            var qury = "UPDATE dealers set account_status = 'suspended' where dealer_id = '" + dealer_id + "'";

            sql.query(qury, async function (error, row) {
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
            if (user.user_type === ADMIN || user.user_type === DEALER) {
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
                        res.send("Email could not sent due to error: " + errors);
                        return;
                    } else {

                        var sq = "update dealers set password = '" + enc_pwd + "' where dealer_id = '" + dealer_id + "'";
                        sql.query(sq, async function (error, rows) {


                            if (error) {
                                console.log(error);
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


exports.getLoggedDealerApps = async function (req, res) {
    // console.log('apoi recivedx')
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        let loggedUserId = verify.user.id;
        let loggedUserType = verify.user.user_type;

        let getAppsQ = "SELECT apk_details.* FROM apk_details ";
        if (loggedUserType !== ADMIN) {
            getAppsQ = getAppsQ + " JOIN dealer_apks on dealer_apks.apk_id = apk_details.id WHERE dealer_apks.dealer_id =" + loggedUserId + " AND delete_status=0 AND apk_type != 'permanent'";
        } else {
            getAppsQ = getAppsQ + " WHERE delete_status=0 AND apk_type != 'permanent'";

        }
        // console.log(getAppsQ);
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

exports.dropDown = async function (req, res) {
    var verify = req.decoded;
    var loggedInuid = verify.user.id;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {

        var selected_items = req.body.selected_items;
        var dropdownType = req.body.pageName;
        var dealer_id = verify.user.id;
        var squery = "select * from dealer_dropdown_list where dealer_id = " + dealer_id + " AND type ='" + dropdownType + "'";
        // console.log('query', squery);
        var srslt = await sql.query(squery);
        // console.log('query result', srslt);

        if (srslt.length == 0) {
            var squery = sql.query("insert into dealer_dropdown_list (dealer_id, selected_items, type) values (" + dealer_id + ", '" + selected_items + "', '" + dropdownType + "')", async function (err, rslts) {
                data = {
                    "status": true,
                    "msg": await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_ADDED], "Items Added"), // Items Added.
                    "data": rslts
                };
                res.send(data);
            });
        } else {

            sql.query("update dealer_dropdown_list set selected_items = '" + selected_items + "' where type='" + dropdownType + "' AND dealer_id='" + dealer_id + "'", async function (err, row) {
                // console.log('squery data ', 'rowws', row);
                if (row.affectedRows != 0) {
                    data = {
                        "status": true,
                        "msg": await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_UP], "Items Updated"), // Items Updated.',
                        "data": row
                    };
                    res.send(data);
                } else {
                    data = {
                        "status": false,
                        "msg": await general_helpers.convertToLang(req.translation[MsgConstants.ITEMS_NOT_UP], "Items Not Updated"), // Items Not Updated.',
                        "data": row
                    };
                    res.send(data);

                }
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

