// libraries
// var express = require('express');
// var router = express.Router();
var md5 = require('md5');
var empty = require('is-empty');
var jwt = require('jsonwebtoken');
var randomize = require('randomatic');

// helpers
const { sql } = require('../../config/database');
var config = require('../../helper/config.js');
var helpers = require('../../helper/general_helper.js');
const device_helpers = require('../../helper/device_helpers.js');

var Constants = require('../../constants/Application');
var MsgConstants = require('../../constants/MsgConstants');

const {sendEmail} = require('../../lib/email');


/*****User Login*****/
exports.login = async function (req, res) {
	var email = req.body.demail;
	var pwd = req.body.pwd;
	var enc_pwd = md5(pwd);
	var data = '';

	//check for if email is already registered
	var userQ = `SELECT * FROM dealers WHERE dealer_email = '${email}' limit 1`;
	var users = await sql.query(userQ);

	if (users.length == 0) {
		data = {
			status: false,
			msg: await helpers.convertToLang("", MsgConstants.USER_DOES_NOT_EXIST), // 'User does not exist',
			data: null
		}
		res.send(data);
		return;
	} else {

		var userTypeQuery = `SELECT * FROM user_roles WHERE id =${users[0].type} AND status=1`;
		var userType = await sql.query(userTypeQuery);
		if (userType.length == 0) {

			data = {
				status: false,
				msg: await helpers.convertToLang("", MsgConstants.USER_DOES_NOT_EXIST), // 'User does not exist',
				data: null
			}
			res.send(data);
			return;
		} else {

			if (users[0].password === enc_pwd) {
				let dealerStatus = helpers.getDealerStatus(users[0]);
				if (dealerStatus === Constants.DEALER_SUSPENDED) {
					data = {
						status: false,
						msg: await helpers.convertToLang("", MsgConstants.YOUR_ACCOUNT_IS_SUSPENDED), // 'Your account is suspended',
						data: null
					}
					res.send(data);
					return;
				} else if (dealerStatus === Constants.DEALER_UNLINKED) {
					data = {
						status: false,
						msg: await helpers.convertToLang("", MsgConstants.YOUR_ACCOUNT_IS_DELETED), // 'Your account is deleted',
						data: null
					}
					res.send(data);
					return;
				} else {

					if (users[0].is_two_factor_auth === 1 || users[0].is_two_factor_auth === true) {
						verificationCode = randomize('0', 6);
						verificationCode = await helpers.checkVerificationCode(verificationCode);
						let updateVerification = `UPDATE dealers SET verified=0, verification_code='${md5(verificationCode)}' WHERE dealer_id=${users[0].dealer_id}`;
						await sql.query(updateVerification);
						let html = "Your Login Code is: " + verificationCode;
						sendEmail("Dual Auth Verification", html, users[0].dealer_email, async function (error, response) {
							if (error) {
								
								res.send({
									status: false,
									two_factor_auth: true,
									msg: await helpers.convertToLang("", MsgConstants.ERROR), // error
								});
								return;
							} else {
								res.send({
									status: true,
									two_factor_auth: true,
									msg: await helpers.convertToLang("", MsgConstants.VERIFICATION_CODE_SENT_TO_YOUR_EMAIL), // "Verification Code sent to Your Email"
								});
								return;
							}

						});
					} else {
						// send email you are successfully logged in

						var userType = await helpers.getUserType(users[0].dealer_id);
						var get_connected_devices = await sql.query(`select count(*) AS total FROM usr_acc WHERE dealer_id='${users[0].dealer_id}'`);
						var ip = req.header('x-real-ip') || req.connection.remoteAddress
						// console.log('object data is ', users[0]);

						const user = {
							id: users[0].dealer_id,
							dealer_id: users[0].dealer_id,
							email: users[0].dealer_email,
							lastName: users[0].last_name,
							name: users[0].dealer_name,
							firstName: users[0].first_name,
							dealer_name: users[0].dealer_name,
							dealer_email: users[0].dealer_email,
							link_code: users[0].link_code,
							connected_dealer: users[0].connected_dealer,
							connected_devices: get_connected_devices,
							account_status: users[0].account_status,
							user_type: userType,
							created: users[0].created,
							modified: users[0].modified,
							two_factor_auth: users[0].is_two_factor_auth,
							ip_address: ip,
						}

						jwt.sign(
							{
								user
							},
							config.secret,
							{
								expiresIn: config.expiresIn
							}, async function (err, token) {
								if (err) {
									res.send({
										status: false,
										err: err
									});
									return;
								} else {
									user.expiresIn = config.expiresIn;
									// console.log("logged in user", user[0]);
									user.verified = (users[0].is_two_factor_auth === true || users[0].is_two_factor_auth === 1) ? false : true;
									user.token = token;

									helpers.saveLogin(user, userType, Constants.TOKEN, 1);

									res.send({
										token: token,
										status: true,
										msg: await helpers.convertToLang("", MsgConstants.USER_LOGED_IN_SUCCESSFULLY), // 'User loged in Successfully',
										expiresIn: config.expiresIn,
										user,
										two_factor_auth: false,
									});
									return;
								}
							}
						);
					}


				}
			} else {

				data = {
					status: false,
					msg: await helpers.convertToLang("", MsgConstants.INVALID_EMAIL_OR_PASSWORD), // 'Invalid email or password',
					data: null
				}
				res.send(data);
				return;
			}


		}

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
                    msg: await helpers.convertToLang("", MsgConstants.INVALID_VERIFICATION_CODE), // 'invalid verification code',
                    data: null
				})
				return;
			}

            if (response.affectedRows) {
                let dealerStatus = helpers.getDealerStatus(checkRes[0]);
                if (dealerStatus === Constants.DEALER_SUSPENDED) {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang("", MsgConstants.YOUR_ACCOUNT_IS_SUSPENDED), // 'Your account is suspended',
                        data: null
                    }
                    res.send(data);
                    return;
                } else if (dealerStatus === Constants.DEALER_UNLINKED) {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang("", MsgConstants.YOUR_ACCOUNT_IS_DELETED), // 'Your account is deleted',
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
                    }, config.secret, {
                            expiresIn: config.expiresIn
                        }, async function (err, token) {
                            if (err) {
                                res.send({
                                    'err': err
								});
								return;
                            } else {
                                user.expiresIn = config.expiresIn;
                                user.verified = checkRes[0].verified;
                                user.token = token;
                                helpers.saveLogin(user, userType, Constants.TOKEN, 1);

                                res.send({
                                    token: token,
                                    status: true,
                                    msg: await helpers.convertToLang("", MsgConstants.USER_LOGED_IN_SUCCESSFULLY), // 'User loged in Successfully',
                                    expiresIn: config.expiresIn,
                                    user
								});
								return;
                            }
                        });
                }
            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang("", MsgConstants.INVALID_VERIFICATION_CODE), // 'invalid verification code',
                    data: null
				})
				return;
            }
        });

    } else {
        data = {
            status: false,
            msg: await helpers.convertToLang("", MsgConstants.INVALID_VERIFICATION_CODE), // 'invalid verification code',
            data: null
        }
		res.send(data);
		return;
    }

}


exports.superAdminLogin = async function (req, res) {

    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email
    var enc_pwd = md5(password);
    if (name != undefined && password != undefined && email != undefined && name != null && password != null && email != null && name != '' && password != '' && email != '') {
        let user = await sql.query(`select * from dealers where dealer_name = '${name}' AND dealer_email = '${email}' AND password = '${enc_pwd}' AND type = '5'`)
        if (user.length) {

            jwt.sign(
                {
                    user
                },
                config.secret,
                {
                    expiresIn: config.expiresIn
                }, async function (err, token) {
                    if (err) {
                        res.send({
                            'err': err
                        });
                        return
                    } else {
                        user.expiresIn = config.expiresIn;
                        user.token = token;
                        res.send({
                            status: true,
                            token: token,
                            msg: await helpers.convertToLang("", MsgConstants.USER_LOGED_IN_SUCCESSFULLY), // 'User loged in Successfully',
                            expiresIn: config.expiresIn,
                            user,
                        });
                        return
                    }
                }
            );
        }
        else {
            res.send({
                status: false,
            });
            return
        }
    }
    else {
        res.send({
            status: false,
        });
        return
    }
}