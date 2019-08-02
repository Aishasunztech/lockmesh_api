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

        } else if (userType === constants.SDEALER) {

        }

        // else {
        //     // return res.s
        // }

        let agents = await sql.query(agentsQ);
        if (agents.length) {

            agents.forEach((agent) => {
                let agentObj = {
                    id: agent.id,
                    dealer_id: agent.dealer_id,
                    dealer_type: agent.dealer_type,
                    delete_status: agent.delete_status,
                    email: agent.email,
                    name: agent.name,
                    status: agent.status,
                    type: agent.type,
                    staff_id: agent.staff_id,
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

        var agentType = 'staff'
        if (req.body.type === true) {
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
    // res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded;

    if (verify) {

        var agentID = req.body.agent_id
        var name = req.body.name;
        var email = req.body.email;

        var agentType = 'staff'
        if (req.body.type === true) {
            agentType = 'admin'
        }

        if (!empty(email) && !empty(name)) {
            var user = await sql.query("SELECT * FROM dealer_agents WHERE email = '" + email + "' AND id != '" + agentID + "'");

            if (user.length > 0) {
                data = {
                    'status': false,
                    'msg': await helpers.convertToLang(req.translation['agent already registered'], "Agent Already Registered. Please use another email"), // User Already Registered. Please use another email.',
                }
                return res.send(data);
            }


            var updateAgentQ = `UPDATE users SET name ='${name}', email = '${email}', type='${agentType}' WHERE id=${agentID}`;

            sql.query(updateAgentQ, async function (error, rows) {
                if (error) {
                    console.log(error);
                }

                // if (PrevUserData[0].email != userEmail) {

                //     var html = 'User details are : <br> ' +
                //         'User ID : ' + user_id + '.<br> ' +
                //         'Name : ' + userName + '<br> ' +
                //         'Email : ' + userEmail + '<br> '
                //     sendEmail("User info Changed Successfully", html, verify.user.email)
                //     sendEmail("User Info Changed Successfully", html, userEmail)
                // }

                // let userData = await helpers.getUserDataByUserId(user_id)
                // let data = await helpers.getAllRecordbyUserID(user_id)
                // userData[0].devicesList = data

                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.USER_INFO_CHANGE_SUCC], "User Info has been changed successfully"), // User Info has been changed successfully.
                    // agent: userData,
                }
                return res.send(data);

            });

        } else {
            data = {
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_EMAIL_NAME], "Invalid email or name"), // Invalid email or name'
            }
            return res.send(data);
        }
    }
}

exports.deleteAgent = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        var agentID = req.params.agentID

        if (!empty(agentID) && agentID != undefined) {

            let deleteUserQ = `UPDATE dealer_agents SET delete_status = 1 WHERE id =${agentID}'`;

            sql.query(deleteUserQ, async function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result && result.affectedRows !== 0) {
                    data = {
                        'status': true,
                        'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_DEL_SUCC], "User deleted successfully"), // User deleted successfully.
                    }
                    return res.send(data);
                } else {
                    data = {
                        'status': true,
                        'msg': await helpers.convertToLang(req.translation[MsgConstants.USER_NOT_DEL_SUCC], "User not deleted try again later"), // User not deleted try again later.'
                    }
                    return res.send(data);
                }
            })
        } else {
            data = {
                'status': false,
                'msg': await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], "Invalid User"), // Invalid User.
            }
            return res.send(data);
        }
    }
}

exports.changeStatus = async function (req, res) {

}

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
