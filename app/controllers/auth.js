var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var md5 = require('md5');
const config = require('../../config/constants')
var { sql } = require('../../config/database');
var Admin = require('../models/admin');
var helpers = require('../../helpers/general_helpers');
var app_constants = require('../../constants/application');
var jwt = require('jsonwebtoken');

exports.login = async function (req, res) {
	var email = req.body.email;
	var pwd = req.body.pwd;
	var enc_pwd = md5(pwd);
	//check for if email is already registered
	var userQ = "SELECT * FROM admins WHERE email = '" + email + "' limit 1";
	var users = await sql.query(userQ);

	if (users.length == 0) {
		data = {
			status: false,
			msg: 'User does not exist',
			data: null
		}
		res.send(data);
		return;
	} else {
		var userTypeQuery = "SELECT * FROM user_roles WHERE id =" + users[0].type + " AND status='1'";
		var userType = await sql.query(userTypeQuery);
		if (userType.length == 0) {

			data = {
				status: false,
				msg: 'User does not exist',
				data: null
			}
			res.send(data);
			return;
		} else {

			if (users[0].password !== enc_pwd) {
				data = {
					status: false,
					msg: 'Invalid email or password',
					data: null
				}
				res.send(data);
				return;
			} else {
				let adminStatus = helpers.getAdminStatus(users[0]);
				if (adminStatus === app_constants.DEALER_SUSPENDED) {
					data = {
						status: false,
						msg: 'Your account is suspended',
						data: null
					}
					res.send(data);
					return;
				} else if (adminStatus === app_constants.DEALER_UNLINKED) {
					data = {
						status: false,
						msg: 'Your account is deleted',
						data: null
					}
					res.send(data);
					return;
				} else {

					// if (users[0].is_two_factor_auth === 1 || users[0].is_two_factor_auth === true) {
					// 	verificationCode = randomize('0', 6);
					// 	verificationCode = await helpers.checkVerificationCode(verificationCode);
					// 	let updateVerification = "UPDATE dealers SET verified=0, verification_code='" + md5(verificationCode) + "' WHERE dealer_id=" + users[0].dealer_id;
					// 	await sql.query(updateVerification);
					// 	let html = "Your Login Code is: " + verificationCode;
					// 	sendEmail("Dual Auth Verification", html, users[0].dealer_email, function (error, response) {
					// 		if (error) {
					// 			throw (error)
					// 		} else {
					// 			res.send({
					// 				status: true,
					// 				two_factor_auth: true,
					// 				msg: "Verification Code sent to Your Email"
					// 			})
					// 		}

					// 	});
					// } else {
					// send email you are successfully logged in

					// var userType = await helpers.getUserType(users[0].dealer_id);
					// var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + users[0].dealer_id + "'");
					var ip = req.header('x-real-ip') || req.connection.remoteAddress;

					delete users[0].password;
					delete users[0].verification_code;
					delete users[0].account_status;

					const user = {
						...users[0],
						ip_address: ip,
					}

					jwt.sign(
						{
							user
						},
						config.SECRET,
						{
							expiresIn: config.EXPIRES_IN
						}, async (err, token) => {
							if (err) {
								res.json({
									'err': err
								});
							} else {
								user.expiresIn = config.EXPIRES_IN;
								user.verified = (users[0].is_two_factor_auth === true || users[0].is_two_factor_auth === 1) ? false : true;
								user.token = token;

								await helpers.saveAdminLogin(user, app_constants.ADMIN, app_constants.TOKEN, 1);

								res.json({
									// token: token,
									status: true,
									msg: 'User logged in Successfully',
									// expiresIn: config.expiresIn,
									user,
									two_factor_auth: false,
								});
							}
						}
					);
					// }


				}


			}


		}

	}

}
exports.wlLogin = async function (req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var enc_pwd = md5(password);
	//check for if email is already registered
	if (password != undefined && email != undefined && password != null && email != null && password != '' && email != '') {
		var userQ = "SELECT * FROM admins WHERE email = '" + email + "' AND password ='" + enc_pwd + "' AND type = '2' limit 1";
		var users = await sql.query(userQ);
		if (users.length) {
			delete users[0].password;
			delete users[0].verification_code;
			delete users[0].account_status;
			const user = {
				...users[0],
			}
			jwt.sign(
				{
					user
				},
				config.SECRET,
				{
					expiresIn: config.EXPIRES_IN
				}, async (err, token) => {
					{
						user.token = token;
						res.json({
							status: true,
							user,
						});
						return
					}
				}
			)
		} else {
			res.send({
				status: false
			})
			return
		}
	} else {
		res.send({
			status: false
		})
		return
	}
}


exports.verifyCode = async function (req, res) {
	let verify_code = req.body.verify_code;

	let checkVerificationQ = "SELECT * FROM dealers WHERE verification_code = '" + md5(verify_code) + "' limit 1";
	let checkRes = await sql.query(checkVerificationQ);
	if (checkRes.length) {
		let updateVerificationQ = "UPDATE dealers SET verified = 1, verification_code=null WHERE dealer_id=" + checkRes[0].dealer_id;
		// let updateVerificationQ = "UPDATE dealers SET verified = 1 WHERE dealer_id=" + checkRes[0].dealer_id;
		sql.query(updateVerificationQ, async function (error, response) {
			if (error) throw (error);
			if (response.affectedRows) {
				let dealerStatus = helpers.getDealerStatus(checkRes[0]);
				console.log("dealer status", dealerStatus);
				if (dealerStatus === Constants.DEALER_SUSPENDED) {
					data = {
						'status': false,
						'msg': 'Your account is suspended',
						'data': null
					}
					res.status(200).send(data);
					return;
				} else if (dealerStatus === Constants.DEALER_UNLINKED) {
					data = {
						'status': false,
						'msg': 'Your account is deleted',
						'data': null
					}
					res.status(200).send(data);
					return;
				} else {

					var userType = await helpers.getUserType(checkRes[0].dealer_id);

					var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + checkRes[0].dealer_id + "'");
					var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
					// console.log('object data is ', users[0]);

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
						}, (err, token) => {
							if (err) {
								res.json({
									'err': err
								});
							} else {
								user.expiresIn = config.expiresIn;
								user.verified = checkRes[0].verified;
								user.token = token;
								helpers.saveLogin(user, userType, Constants.TOKEN, 1);

								res.send({
									token: token,
									status: true,
									msg: 'User loged in Successfully',
									expiresIn: config.expiresIn,
									user
								});
							}
						});
				}
			} else {
				return {
					status: false,
					msg: "verification code successfully matched",
					data: null
				}
			}
		});

	} else {
		data = {
			status: false,
			msg: 'invalid verification code',
			data: null
		}
		res.status(200).send(data);
	}

}

