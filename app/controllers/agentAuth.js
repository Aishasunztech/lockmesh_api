// libraries
const bcrypt = require('bcrypt');
var empty = require('is-empty');
var jwt = require('jsonwebtoken');
var randomize = require('randomatic');

// helpers
const { sql } = require('../../config/database');
var helpers = require('../../helper/general_helper.js');
const device_helpers = require('../../helper/device_helpers.js');

var app_constants = require('../../constants/Application');
var MsgConstants = require('../../constants/MsgConstants');

const constants = require('../../config/constants');
// const { sendEmail } = require('../../lib/email');


var data;

/*****User Login*****/
exports.login = async function (req, res) {
    var email = req.body.email;
    var pwd = req.body.password;
    var dealer_pin = req.body.dealer_pin;

    console.log("email", email);
    console.log('pwd', pwd);

    var data = '';
    // let compare = await bcrypt.compare(pwd);

    //check for if email is already registered
    var agentQ = `SELECT * FROM dealer_agents WHERE email = '${email}' AND delete_status=0 limit 1`;
    var agent = await sql.query(agentQ);

    if (agent.length == 0) {
        data = {
            status: false,
            msg: 'Agent does not exist', // await helpers.convertToLang(req.translation[MsgConstants.USER_DOES_NOT_EXIST], MsgConstants.USER_DOES_NOT_EXIST),
            data: null
        }
        return res.send(data);
    } else {
        bcrypt.compare(pwd, agent[0].password, async function (err, compareSuccess) {
            if (err) {
                data = {
                    status: false,
                    msg: 'Agent info is not valid', // await helpers.convertToLang(req.translation[MsgConstants.USER_DOES_NOT_EXIST], MsgConstants.USER_DOES_NOT_EXIST),
                    data: null
                }
                return res.send(data);
            }

            if (compareSuccess) {
                let dealerQ = `SELECT * FROM dealers WHERE link_code = '${dealer_pin}' LIMIT 1`;
                let dealer = await sql.query(dealerQ);
                if (dealer.length && dealer[0].dealer_id === agent[0].dealer_id) {
                    if (agent[0].status) {

                        var userType = await helpers.getUserType(dealer[0].dealer_id);
                        var ip = req.header('x-real-ip') || req.connection.remoteAddress

                        const user = {
                            id: dealer[0].dealer_id,
                            dealer_id: dealer[0].dealer_id,
                            agent_id: agent[0].id,
                            agent_email: agent[0].email,
                            agent_username: agent[0].name,
                            agent_type: agent[0].type,

                            dealer_name: dealer[0].dealer_name,
                            dealer_email: dealer[0].dealer_email,
                            link_code: dealer[0].link_code,
                            dealer_pin: dealer[0].link_code,
                            connected_dealer: dealer[0].connected_dealer,
                            
                            user_type: userType,
                            ip_address: ip,
                        }

                        jwt.sign(
                            {
                                user
                            },
                            constants.SECRET,
                            {
                                expiresIn: constants.EXPIRES_IN
                            }, async function (err, token) {
                                if (err) {
                                    res.send({
                                        status: false,
                                        err: err
                                    });
                                    return;
                                } else {
                                    user.expiresIn = constants.EXPIRES_IN;
                                    // console.log("logged in user", user[0]);
                                    // user.token = token;

                                    // helpers.saveLogin(user, userType, app_constants.TOKEN, 1);

                                    data = {
                                        token: token,
                                        status: true,
                                        msg: 'Agent logged in Successfully', //expiresIn: constants.EXPIRES_IN, // await helpers.convertToLang(req.translation[MsgConstants.USER_LOGED_IN_SUCCESSFULLY], MsgConstants.USER_LOGED_IN_SUCCESSFULLY),
                                        user,
                                    }
                                    return res.send(data);
                                    
                                }
                            }
                        );
                    } else {
                        data = {
                            status: false,
                            msg: 'Agent info is not valid', // await helpers.convertToLang(req.translation[MsgConstants.USER_DOES_NOT_EXIST], MsgConstants.USER_DOES_NOT_EXIST),
                            data: null
                        }
                        return res.send(data);
                    }
                } else {
                    data = {
                        status: false,
                        msg: 'Agent info is not valid', // await helpers.convertToLang(req.translation[MsgConstants.USER_DOES_NOT_EXIST], MsgConstants.USER_DOES_NOT_EXIST),
                        data: null
                    }
                    return res.send(data);
                }
            } else {
                data = {
                    status: false,
                    msg: 'Agent info is not valid', // await helpers.convertToLang(req.translation[MsgConstants.USER_DOES_NOT_EXIST], MsgConstants.USER_DOES_NOT_EXIST),
                    data: null
                }
                return res.send(data);
            }

        });
        return;

    }
}

exports.verifyCode = async function (req, res) {
    let verify_code = req.body.verify_code;

    let checkVerificationQ = `SELECT * FROM dealers WHERE verification_code = '${md5(verify_code)}' LIMIT 1`;
    let checkRes = await sql.query(checkVerificationQ);
    if (checkRes.length) {
        let updateVerificationQ = `UPDATE dealers SET verified = 1, verification_code=null WHERE dealer_id= ${checkRes[0].dealer_id}`;

        sql.query(updateVerificationQ, async function (error, response) {
            if (error) {
                res.send({
                    status: false,
                    msg: 'Invalid verification code', // await helpers.convertToLang(req.translation[MsgConstants.INVALID_VERIFICATION_CODE], MsgConstants.INVALID_VERIFICATION_CODE),
                    data: null
                })
                return;
            }

            if (response.affectedRows) {
                let dealerStatus = helpers.getDealerStatus(checkRes[0]);
                if (dealerStatus === app_constants.DEALER_SUSPENDED) {
                    data = {
                        status: false,
                        msg: 'Your account is suspended', // await helpers.convertToLang(req.translation[MsgConstants.YOUR_ACCOUNT_IS_SUSPENDED], MsgConstants.YOUR_ACCOUNT_IS_SUSPENDED),
                        data: null
                    }
                    res.send(data);
                    return;
                } else if (dealerStatus === app_constants.DEALER_UNLINKED) {
                    data = {
                        status: false,
                        msg: 'Your account is deleted', // await helpers.convertToLang(req.translation[MsgConstants.YOUR_ACCOUNT_IS_DELETED], MsgConstants.YOUR_ACCOUNT_IS_DELETED),
                        data: null
                    }
                    res.status(200).send(data);
                    return;
                } else {
                    var userType = await helpers.getUserType(checkRes[0].dealer_id);

                    var get_connected_devices = await sql.query(`SELECT count(*) AS total FROm usr_acc WHERE dealer_id='${checkRes[0].dealer_id}'`);
                    var ip = req.header('x-real-ip') || req.connection.remoteAddress

                    const user = {
                        id: checkRes[0].dealer_id,
                        dealer_id: checkRes[0].dealer_id,
                        email: checkRes[0].dealer_email,
                        lastName: checkRes[0].last_name,
                        name: checkRes[0].dealer_name,
                        firstName: checkRes[0].first_name,
                        dealer_name: checkRes[0].dealer_name,
                        dealer_email: checkRes[0].dealer_email,
                        link_code: checkRes[0].link_code,
                        connected_dealer: checkRes[0].connected_dealer,
                        connected_devices: get_connected_devices,
                        account_status: checkRes[0].account_status,
                        user_type: userType,
                        created: checkRes[0].created,
                        modified: checkRes[0].modified,
                        two_factor_auth: checkRes[0].is_two_factor_auth,
                        ip_address: ip,
                    }

                    jwt.sign({
                        user
                    }, constants.SECRET, {
                            expiresIn: constants.EXPIRES_IN
                        }, async function (err, token) {
                            if (err) {
                                res.send({
                                    'err': err
                                });
                                return;
                            } else {
                                user.expiresIn = constants.EXPIRES_IN;
                                user.verified = checkRes[0].verified;
                                user.token = token;
                                helpers.saveLogin(user, userType, app_constants.TOKEN, 1);

                                res.send({
                                    token: token,
                                    status: true,
                                    msg: 'User loged in Successfully', //                                   expiresIn: constants.EXPIRES_IN, // await helpers.convertToLang(req.translation[MsgConstants.USER_LOGED_IN_SUCCESSFULLY], MsgConstants.USER_LOGED_IN_SUCCESSFULLY),
                                    user
                                });
                                return;
                            }
                        });
                }
            } else {
                res.send({
                    status: false,
                    msg: 'Invalid verification code', // await helpers.convertToLang(req.translation[MsgConstants.INVALID_VERIFICATION_CODE], MsgConstants.INVALID_VERIFICATION_CODE),
                    data: null
                })
                return;
            }
        });

    } else {
        data = {
            status: false,
            msg: 'Invalid verification code', // await helpers.convertToLang(req.translation[MsgConstants.INVALID_VERIFICATION_CODE], MsgConstants.INVALID_VERIFICATION_CODE),
            data: null
        }
        res.send(data);
        return;
    }

}

