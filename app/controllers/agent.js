var empty = require('is-empty');
const bcrypt = require('bcrypt');
var randomize = require('randomatic');
var generator = require('generate-password');

// helpers
const { sql } = require('../../config/database');
const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
const { sendEmail } = require('../../lib/email');

// Models
// var DealerAgent = require('../models/DealerAgent');

// constants
const constants = require('../../constants/Application');

exports.getAgentList = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let dealerAgents = [];

        let userType = verify.user.user_type;
        // let agents = await DealerAgent.findAll();
        let agentsQ = `SELECT * FROM dealer_agents WHERE delete_status = 0`;

        if (userType == constants.ADMIN) {
            
        } else if (userType === constants.DEALER) {

        } else if (userType === constants.SDEALER){
        
        }

        // else {
        //     // return res.s
        // }

        let agents = await sql.query(agentsQ);
        if(agents.length){
            
            agents.forEach((agent) => {
                let agentObj ={
                    id:agent.id,
                    dealer_id: agent.dealer_id,
                    dealer_type: agent.dealer_type,
                    delete_status: agent.delete_status,
                    email: agent.email,
                    name: agent.name,
                    status: agent.status,
                    type: agent.type,
                    created_at: agent.created_at
                }
                dealerAgents.push(agentObj);
            });

            return res.send({
                status: true,
                agents: dealerAgents
            })
        } else {
            return res.send({
                status: true,
                agents: dealerAgents
            });
        }
    } else {
        data = {
            status: false,
        }
        res.send(data)
    }
}

exports.addAgent = async function (req, res) {

    // res.setHeader('Content-Type', 'application/json');

    var verify = req.decoded;

    if (verify) {

        var loggedInuid = verify.user.id;
        var userType = verify.user.user_type;
        var name = req.body.name;
        var email = req.body.email;
        
        var agentType = 'agent'
        if(req.body.type===true){
            agentType = 'admin'
        }

        var staffID = randomize('0', 6);
        staffID = await helpers.checkStaffID(staffID);

        var user_pwd = generator.generate({
            length: 10,
            numbers: true
        });
        
        var enc_pwd = await bcrypt.hash(user_pwd, 10); //encryted pwd
        console.log("enc_password", enc_pwd);

        if (!empty(name) && !empty(email)) {
            var agent = await sql.query(`SELECT * FROM dealer_agents WHERE email = '${email}' AND delete_status = 0`);

            if (agent && agent.length > 0) {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation['agent.already.registered'], "Agent Already Registered. Please use another email"), // User Already Registered. Please use another email.
                }
                return res.send(data);
                
            }

            var insertAgentQ = `INSERT INTO dealer_agents (staff_id, dealer_id, dealer_type, name, email, password, type)`;
            insertAgentQ += ` VALUES ('${staffID}', ${loggedInuid}, '${userType}', '${name}', '${email}', '${enc_pwd}', '${agentType}')`;
            
            sql.query(insertAgentQ, async function (error, rows) {
                if (error) {
                    console.log(error);
                }

                var html = 'Agent details are : <br/> ' +
                    'Staff ID : ' + staffID + '.<br/> ' +
                    'Username : ' + name + '<br/> ' +
                    'Password : ' + user_pwd + '<br/>' +
                    'Email : ' + email + '<br/> '
                sendEmail("Agent Registration", html, verify.user.email)
                sendEmail("Agent Registration", html, email)

                // res.send(rows.insertId);
                var agent = await sql.query("SELECT * FROM dealer_agents WHERE id = " + rows.insertId + "");
                
                data = {
                    'status': true,
                    'msg': await helpers.convertToLang(req.translation['agent.successfully.registered'], "Agent has been registered successfully"), // User has been registered successfully.
                    'agent': agent,
                }
                return res.send(data);

            });

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_EMAIL_NAME], "Invalid email or name"), // Invalid email or name
            }
            return res.send(data);
        }
    }
}

exports.updateAgent = async function (req, res) {

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

exports.deleteAgent = async function (req, res) {
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
                        'status': true,
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

// exports.undoDeleteUser = async function (req, res) {
//     var verify = req.decoded;

//     if (verify) {

//         var user_id = req.params.user_id
//         if (!empty(user_id) && user_id != undefined) {
//             let deleteUserQ = "UPDATE users SET del_status = 0 WHERE user_id ='" + user_id + "'";
//             console.log(deleteUserQ);
//             sql.query(deleteUserQ, async function (err, result) {
//                 if (err) {
//                     console.log(err)
//                 }
//                 if (result && result.affectedRows !== 0) {
//                     data = {
//                         'status': true,
//                         'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_ADD_AGAIN], "User added again successfully"), // User added again successfully.
//                     }
//                     res.send(data);
//                     return
//                 } else {
//                     data = {
//                         'status': true,
//                         'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_NOT_ADD], "User not added try again later."), // User not added try again later.
//                     }
//                     res.send(data);
//                     return
//                 }
//             })
//         } else {
//             data = {
//                 'status': false,
//                 'msg': await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], "Invalid User"), // Invalid User.'
//             }
//             res.send(data);
//             return
//         }
//     }
// }

// exports.updateProfile = async function (req, res) {
//     res.setHeader('Content-Type', 'application/json');

//     var verify = req.decoded;

//     if (verify) {

//         sql.query('UPDATE dealers SET `dealer_name` = ? where `dealer_id` = ?', [req.body.name, req.body.dealerId], async function (error, rows, status) {

//             if (error) {
//                 console.log(error);
//             }
//             if (status) {
//                 data = {
//                     "status": false,
//                     "data": req.body,
//                     "msg": await helpers.convertToLang(req.translation[MsgConstants.ERR_UP_PROFILE], "Error While Updating Profile"), // Error While Updating Profile
//                 };
//             } else {
//                 data = {
//                     "status": true,
//                     "data": req.body,
//                     "msg": await helpers.convertToLang(req.translation[MsgConstants.PROFILE_UP_SUCC], "Profile Updated Successfully"), // Profile Updated Successfully
//                 };
//             }

//             console.log('success');
//             res.send(data);
//         });
//     }
// }




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