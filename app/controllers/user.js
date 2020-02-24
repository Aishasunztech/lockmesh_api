var empty = require('is-empty');
var md5 = require('md5');
var randomize = require('randomatic');
var generator = require('generate-password');
const { sql } = require('../../config/database');
const MsgConstants = require('../../constants/MsgConstants');
const constants = require("../../constants/Application");
const helpers = require('../../helper/general_helper');
const { sendEmail } = require('../../lib/email');

// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"
let usr_acc_query_text = constants.usr_acc_query_text;

exports.getAllUsers = async function (req, res) {
    let devicesData = [];
    var verify = req.decoded;
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        if (verify.user.user_type == ADMIN) {
            var role = await helpers.getUserTypeIDByName(verify.user.user_type);
            let results = await sql.query("select * from users where del_status =0 order by created_at DESC")
            if (results.length) {
                for (let i = 0; i < results.length; i++) {
                    let data = await helpers.getAllRecordbyUserID(results[i].user_id)
                    results[i].devicesList = data
                }
                // console.log("Devices For user", devicesData);
                data = {
                    "status": true,
                    data: {
                        users_list: results,
                    }
                }
                res.send(data);
            }
        } else if (verify.user.user_type === DEALER) {
            sql.query("select dealer_id from dealers where connected_dealer = '" + verify.user.id + "' AND  type = 3 order by created DESC", async function (error, result) {
                if (error) {
                    console.log(error);
                }
                dealer = [verify.user.id]
                console.log(result);
                // if (result.length) {
                //     for (var i = 0; i < result.length; i++) {
                //         var sDealers_id = result[i].dealer_id;
                //         dealer.push(sDealers_id)
                //     }
                // }
                console.log("select * from users WHERE dealer_id IN (" + dealer.join() + ") order by created_at DESC");

                let selectQry = `SELECT * FROM users WHERE dealer_id = ${verify.user.id} AND del_status = 0 ORDER BY created_at DESC;`;
                // console.log("selectQry :::::: ", selectQry);


                let results = await sql.query(selectQry)
                if (results.length) {
                    for (let i = 0; i < results.length; i++) {
                        let data = await helpers.getAllRecordbyUserID(results[i].user_id)
                        results[i].devicesList = data
                    }
                    // console.log("Devices For user", devicesData);
                    data = {
                        "status": true,
                        data: {
                            users_list: results,
                        }
                    }
                    res.send(data);
                } else {
                    data = {
                        status: false,
                        data: {
                            users_list: [],
                        }
                    }
                    return res.send(data);
                }
            });
        }
        else {
            let results = await sql.query("select * from users WHERE dealer_id = '" + verify.user.id + "' AND del_status = 0 order by created_at DESC")
            if (results.length) {
                for (let i = 0; i < results.length; i++) {
                    let data = await helpers.getAllRecordbyUserID(results[i].user_id)
                    results[i].devicesList = data
                }
                // console.log("Devices For user", devicesData);
                data = {
                    "status": true,
                    data: {
                        users_list: results,
                    }
                }
                res.send(data);
            }

        }
    }
    else {
        data = {
            "status": false,
        }
        res.send(data)
    }
}

exports.getDealerUsers = async function (req, res) {
    var verify = req.decoded;
    let dealerId = req.body.dealerId;

    // console.log("dealerId ", dealerId)
    if (verify) {

        let SelectQ = `SELECT * from users WHERE dealer_id = '${dealerId}' AND del_status = 0 ORDER BY created_at DESC`;

        // console.log("SelectQ ", SelectQ)
        let results = await sql.query(SelectQ);
        // console.log("results ", results.length)
        if (results.length) {
            data = {
                status: true,
                data: results
            }
        } else {
            data = {
                status: false,
                data: []
            }
        }
        res.send(data);
    }
}

exports.addUser = async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {

        var loggedInuid = verify.user.id;
        var userName = req.body.name;
        var userEmail = req.body.email;

        var userId = await helpers.generateUserId()

        var user_pwd = generator.generate({
            length: 10,
            numbers: true
        });
        var enc_pwd = md5(user_pwd); //encryted pwd
        // console.log("encrypted password" + enc_pwd);
        if (!empty(userEmail) && !empty(userName)) {
            var user = await sql.query("SELECT * FROM users WHERE email = '" + userEmail + "' AND dealer_id = " + loggedInuid + " AND del_status = 0");

            if (user.length > 0) {
                data = {
                    'status': false,
                    'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_ALRDY_REG], "User Already Registered. Please use another email"), // User Already Registered. Please use another email.
                }
                res.status(200).send(data);
                return;
            }

            var sql1 = "INSERT INTO users (user_id, user_name, email, password, dealer_id , type)";
            sql1 += " VALUES ('" + userId + "', '" + userName + "','" + userEmail + "', '" + enc_pwd + "','" + loggedInuid + "', 4)";
            sql.query(sql1, async function (error, rows) {
                if (error) {
                    console.log(error);
                }

                var html = 'User details are : <br> ' +
                    'User ID : ' + userId + '.<br> ' +
                    'Name : ' + userName + '<br> ' +
                    'Email : ' + userEmail + '<br> '
                sendEmail("User Registration", html, verify.user.email)
                sendEmail("User Registration", html, userEmail)

                // res.send(rows.insertId);
                var user = await sql.query("SELECT * FROM users WHERE id = " + rows.insertId + "");
                let data = await helpers.getAllRecordbyUserID(userId)
                user[0].devicesList = data
                // console.log('result add',dealer);
                data = {
                    'status': true,
                    'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_REG_SUCC], "User has been registered successfully"), // User has been registered successfully.
                    'user': user,
                }
                res.status(200).send(data);

            });

        } else {
            data = {
                'status': false,
                'msg': await helpers.convertToLang(req.translation[MsgConstants.INVALID_EMAIL_NAME], "Invalid email or name"), // Invalid email or name
            }
            res.status(200).send(data);
        }
    }
}

exports.editUser = async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = req.decoded;


    if (verify) {


        var userName = req.body.name;
        var userEmail = req.body.email;
        var user_id = req.body.user_id
        if (!empty(userEmail) && !empty(userName)) {
            var user = await sql.query("SELECT * FROM users WHERE email = '" + userEmail + "' AND user_id != '" + user_id + "'");

            if (user.length > 0) {
                data = {
                    'status': false,
                    'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_ALRDY_REG], "User Already Registered. Please use another email"), // User Already Registered. Please use another email.',
                }
                res.status(200).send(data);
                return;
            }
            let PrevUserData = await helpers.getUserDataByUserId(user_id)
            var sql1 = "UPDATE users set user_name ='" + userName + "',  email = '" + userEmail + "' WHERE user_id ='" + user_id + "'";
            sql.query(sql1, async function (error, rows) {
                if (error) {
                    console.log(error);
                }

                if (PrevUserData[0].email != userEmail) {

                    var html = 'User details are : <br> ' +
                        'User ID : ' + user_id + '.<br> ' +
                        'Name : ' + userName + '<br> ' +
                        'Email : ' + userEmail + '<br> '
                    sendEmail("User info Changed Successfully", html, verify.user.email)
                    sendEmail("User Info Changed Successfully", html, userEmail)
                    let updateDeviceEmails = `UPDATE usr_acc SET account_email = '${userEmail}' , account_name = '${userName}'  WHERE user_id = '${user_id}'`
                    sql.query(updateDeviceEmails)
                }

                //res.send("Email has been sent successfully");
                let userData = await helpers.getUserDataByUserId(user_id)
                let data = await helpers.getAllRecordbyUserID(user_id)
                userData[0].devicesList = data

                data = {
                    'status': true,
                    'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_INFO_CHANGE_SUCC], "User Info has been changed successfully"), // User Info has been changed successfully.
                    'user': userData,
                }
                res.status(200).send(data);

            });

        } else {
            data = {
                'status': false,
                'msg': await helpers.convertToLang(req.translation[MsgConstants.INVALID_EMAIL_NAME], "Invalid email or name"), // Invalid email or name'
            }
            res.status(200).send(data);
        }
    }
}

exports.deleteUser = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        var user_id = req.params.user_id
        if (!empty(user_id) && user_id != undefined) {
            let deleteUserQ = "UPDATE users SET del_status = 1 WHERE user_id ='" + user_id + "'";
            // console.log(deleteUserQ);
            sql.query(deleteUserQ, async function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result && result.affectedRows !== 0) {
                    data = {
                        'status': true,
                        'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_DEL_SUCC], "User deleted successfully"), // User deleted successfully.
                    }
                    res.send(data);
                    return
                } else {
                    data = {
                        'status': false,
                        'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_NOT_DEL_SUCC], "User not deleted try again later"), // User not deleted try again later.'
                    }
                    res.send(data);
                    return
                }
            })
        } else {
            data = {
                'status': false,
                'msg': await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], "Invalid User"), // Invalid User.
            }
            res.send(data);
            return
        }
    }
}

exports.undoDeleteUser = async function (req, res) {
    var verify = req.decoded;

    if (verify) {

        var user_id = req.params.user_id
        if (!empty(user_id) && user_id != undefined) {
            let deleteUserQ = "UPDATE users SET del_status = 0 WHERE user_id ='" + user_id + "'";
            console.log(deleteUserQ);
            sql.query(deleteUserQ, async function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result && result.affectedRows !== 0) {
                    data = {
                        'status': true,
                        'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_ADD_AGAIN], "User added again successfully"), // User added again successfully.
                    }
                    res.send(data);
                    return
                } else {
                    data = {
                        'status': true,
                        'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_NOT_ADD], "User not added try again later."), // User not added try again later.
                    }
                    res.send(data);
                    return
                }
            })
        } else {
            data = {
                'status': false,
                'msg': await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], "Invalid User"), // Invalid User.'
            }
            res.send(data);
            return
        }
    }
}

exports.updateProfile = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = req.decoded;

    if (verify) {

        sql.query('UPDATE dealers SET `dealer_name` = ? ,`company_name` = ? ,`company_address` = ? ,`city` = ? ,`state` = ? ,`country` = ? , `postal_code` = ? , `tel_no` = ? ,`website` = ? where `dealer_id` = ?', [req.body.name, req.body.company_name, req.body.company_address, req.body.city, req.body.state, req.body.country, req.body.postal_code, req.body.tel_no, req.body.website, req.body.dealerId], async function (error, rows, status) {

            if (error) {
                console.log(error);
            }
            if (status) {
                data = {
                    "status": false,
                    "data": req.body,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.ERR_UP_PROFILE], "Error While Updating Profile"), // Error While Updating Profile
                };
            } else {
                data = {
                    "status": true,
                    "data": req.body,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.PROFILE_UP_SUCC], "Profile Updated Successfully"), // Profile Updated Successfully
                };
            }

            console.log('success');
            res.send(data);
        });
    }
}

exports.checkProfile = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        if (!empty(req.params.profile_id)) {

            sql.query("delete from device_history WHERE id=" + req.params.profile_id, async function (error, results) {
                // console.log(results);
                //response.end(JSON.stringify(rows));
                if (error) {
                    console.log(error);
                }
                if (results.affectedRows == 0) {
                    data = {
                        "status": false,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.APK_NOT_DELETED], "Apk not deleted"), // Apk not deleted.",
                        "fld": fields,
                        "rdlt": results
                    };
                } else {
                    data = {
                        "status": true,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.APK_DELETED_SUCCESSFULLY], "Apk deleted successfully"), // Apk deleted successfully.",

                    };
                }
                res.send(data);
            });
        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some error occurred"), // Some error occurred."

            }
            res.send(data);
        }

    }
}

exports.checkPrevPass = async function (req, res) {
    console.log(req.body);
    var verify = req.decoded;
    if (verify) {
        let pwd = md5(req.body.user.password);
        let query_res = await sql.query("select * from dealers where dealer_id=" + verify.user.id + " and password='" + pwd + "'");
        if (query_res.length) {
            res.send({
                password_matched: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.PASSWORD_MATCHED_SUCC], "Password Matched Successfully"), // "Password Matched Successfully"
            });
            return;
        }
    }
    data = {
        password_matched: false,
        msg: await helpers.convertToLang(req.translation[MsgConstants.PASSWORD_DID_NOT_MATCH], "Password Did not Match. Please Try again"), // "Password Did not Match. Please Try again"
    }
    res.send(data);
}

exports.getInvoiceId = async function (req, res) {
    var verify = req.decoded;
    let data;
    if (verify) {
        let invoiceId = await helpers.getInvoiceId()
        data = {
            status: true,
            data: invoiceId
        }
        res.send(data);
        return;
    }
}