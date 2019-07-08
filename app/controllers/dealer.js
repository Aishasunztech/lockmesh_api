var generator = require('generate-password');
var empty = require('is-empty');
var md5 = require('md5');
var randomize = require('randomatic');
var empty = require('is-empty');

const { sql } = require('../../config/database');
const { sendEmail } = require('../../lib/email');
const verifyToken = require('../../config/auth');

// 
const general_helpers = require('../../helper/general_helper');


// Constants
const app_constants = require('../../config/constants');
var MsgConstants = require('../../constants/MsgConstants');
const constants = require('../../constants/Application');

exports.getAllDealers = async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {

        var role = await general_helpers.getuserTypeIdByName(verify.user.user_type);
        if (verify.user.user_type == constants.ADMIN) {

            sql.query(`SELECT * FROM dealers WHERE type!=${role} AND type != 4 ORDER BY created DESC`, async function (error, results) {
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
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
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

    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
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


            var link_code = randomize('0', 6);
            link_code = await general_helpers.checkLinkCode(link_code)

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
                    msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_ALREADY_REG), // Dealer Already Registered. Please use another email.
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

            sql.query(sql1, function (error, rows) {
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
                                    msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.EMAIL_NOT_SENT) + emailError, // Email could not sent due to error: " + emailError,
                                    added_dealer: dealer,
                                }
                                res.send(data);
                                return;
                            }
                            // console.log('result add',dealer);
                            data = {
                                status: true,
                                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_REG_SUCC), // Dealer has been registered successfully
                                added_dealer: dealer,

                            }
                            res.send(data);
                            return;
                        } else {
                            data = {
                                status: false,
                                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_NOT_ADDED), // Dealer could not be added
                            }
                            res.send(data);
                            return;
                        }

                    });
                } else {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_NOT_ADDED), // Dealer could not be added
                    }
                    res.send(data);
                    return;
                }


            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.INVALID_EMAIL_NAME), // Invalid email or name
            }
            res.send(data);
            return;
        }

    }
}

exports.editDealers = async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
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
                            msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.EMAIL_ALREDY_USED_DEALER), // Email is already in use of other dealer
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
                    msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.EMAIL_ALREDY_USED_DEALER), // Dealer not found to Update"
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

                    sendEmail("Account Registration", html, email, function (error, response) {
                        if (error) {
                            console.log(error)
                            res.send({
                                status: true,
                                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.RECORD_UPD_SUCC_EMAIL_NOT_SEND), // Record updated successfully. Email not sent
                                alreadyAvailable: alreadyAvailable
                            })
                            return;
                        } else {
                            res.send({
                                status: true,
                                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.RECORD_UPD_SUCC_EMAIL_SEND), // Record updated successfully. Email has been sent.
                                alreadyAvailable: alreadyAvailable
                            })
                            return;
                        }
                    });

                } else {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.RECORD_NOT_UPD), // Record not updated.
                    };
                    res.send(data);
                    return;
                }
            });
        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.ENTER_VALID_DETAIL), // Please enter valid details
            }
            res.send(data);
            return;
        }
    }
}


exports.deleteDealer = async function (req, res) {

    var verify = await verifyToken(req, res);
    var dealer_id = req.body.dealer_id;

    if (verify.status !== undefined && verify.status == true) {
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
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_DEL_SUCC), // Dealer deleted successfully.
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        "status": false,
                        "msg": await general_helpers.convertToLang(loggedInuid, MsgConstants.RECORD_NOT_DEL), // Record not deleted.
                    };
                    res.send(data);
                    return;
                }

            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.INVALID_DEALER), // Invalid Dealer.
            };
            res.send(data);
            return;
        }
    }
}

/** Undo Dealer / S-Dealer **/
exports.undoDealer = async function (req, res) {
    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
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
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_ADDED_AGAIN), // Dealer added again.
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_NOT_ADDED), // Dealer not added.
                    };
                    res.send(data);
                    return;
                }
            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.INVALID_DEALER), // Invalid Dealer.
            };
            res.send(data);
            return;
        }
    }

}

exports.suspendDealer = async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
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
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_SUSP_SUCC), // Dealer suspended successfully.
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_NOT_SUSP), // Dealer not suspended.                    
                    };
                    res.send(data);
                    return;
                }
            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.INVALID_DEALER), // Invalid Dealer.',
            };
            res.send(data);
            return;
        }
    }

}

exports.activateDealer = async function (req, res) {
    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
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
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DEALER_ACTIV_SUCC), // Dealer activated successfully.
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: true,
                        msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.DELAER_NOT_ACTIV), // Dealer not activated.'
                    };
                    res.send(data);
                    return;

                }
            });

        } else {
            data = {
                status: false,
                msg: await general_helpers.convertToLang(loggedInuid, MsgConstants.INVALID_DEALER), // Invalid Dealer.',
            };
            res.send(data);
            return;

        }
    }

}


