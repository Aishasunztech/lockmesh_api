const { sql } = require('../../config/database');
const multer = require('multer');
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var XLSX = require('xlsx');
var empty = require('is-empty');
var mime = require('mime');
const axios = require('axios');

const Constants = require('../../constants/application');
const device_helpers = require('../../helpers/device_helpers');
const general_helpers = require('../../helpers/general_helpers');
const moment = require('moment')

exports.checkComponent = async function (req, res) {
    //   console.log(req.decoded.user.id);
    var componentUri = req.body.ComponentUri;
    var userId = req.decoded.user.id;
    var result = await general_helpers.isAllowedComponentByUri(componentUri, userId);
    let getUser = "SELECT * from admins where id =" + userId;
    let user = await sql.query(getUser);
    // var get_connected_devices = await sql.query("SELECT count(*) as total from usr_acc where dealer_id='" + userId + "'");

    // console.log(user);

    if (user.length) {

        const usr = {
            id: user[0].id,
            email: user[0].email,
            last_name: user[0].last_name,
            name: `${user[0].first_name} ${user[0].last_name}`,
            first_name: user[0].first_name,

            two_factor_auth: user[0].is_two_factor_auth,
            verified: user[0].verified
        }

        res.json({
            status: true,
            msg: '',
            user: usr,
            ComponentAllowed: result
        });
    } else {
        res.send({
            status: false,
            msg: "authentication failed"
        });
    }
}


exports.login = async function (req, res) {
    var email = req.body.demail;
    var pwd = req.body.pwd;
    var enc_pwd = md5(pwd);
    var data = '';

    //check for if email is already registered
    var userQ = "SELECT * FROM dealers WHERE dealer_email = '" + email + "' limit 1";
    var users = await sql.query(userQ);

    if (users.length == 0) {
        data = {
            'status': false,
            'msg': 'User does not exist',
            'data': null
        }
        res.status(200).send(data);
    } else {

        var userTypeQuery = "SELECT * FROM user_roles WHERE id =" + users[0].type + " AND status='1'";
        var userType = await sql.query(userTypeQuery);
        if (userType.length == 0) {

            data = {
                'status': false,
                'msg': 'User does not exist',
                'data': null
            }
            res.status(200).send(data);
        } else {

            if (users[0].password === enc_pwd) {
                let dealerStatus = helpers.getDealerStatus(users[0]);
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

                    if (users[0].is_two_factor_auth === 1 || users[0].is_two_factor_auth === true) {
                        verificationCode = randomize('0', 6);
                        verificationCode = await helpers.checkVerificationCode(verificationCode);
                        let updateVerification = "UPDATE dealers SET verified=0, verification_code='" + md5(verificationCode) + "' WHERE dealer_id=" + users[0].dealer_id;
                        await sql.query(updateVerification);
                        let html = "Your Login Code is: " + verificationCode;
                        sendEmail("Dual Auth Verification", html, users[0].dealer_email, function (error, response) {
                            if (error) {
                                throw (error)
                            } else {
                                res.send({
                                    status: true,
                                    two_factor_auth: true,
                                    msg: "Verification Code sent to Your Email"
                                })
                            }

                        });
                    } else {
                        // send email you are successfully logged in

                        var userType = await helpers.getUserType(users[0].dealer_id);
                        var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + users[0].dealer_id + "'");
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
                            }, (err, token) => {
                                if (err) {
                                    res.json({
                                        'err': err
                                    });
                                } else {
                                    user.expiresIn = config.expiresIn;
                                    // console.log("logged in user", user[0]);
                                    user.verified = (users[0].is_two_factor_auth === true || users[0].is_two_factor_auth === 1) ? false : true;
                                    user.token = token;

                                    helpers.saveLogin(user, userType, Constants.TOKEN, 1);

                                    res.json({
                                        token: token,
                                        status: true,
                                        msg: 'User loged in Successfully',
                                        expiresIn: config.expiresIn,
                                        user,
                                        two_factor_auth: false,
                                    });
                                }
                            }
                        );
                    }


                }
            } else {

                data = {
                    'status': false,
                    'msg': 'Invalid email or password',
                    'data': null
                }
                res.status(200).send(data);
                return;
            }


        }

    }
}

exports.verify_code = async function (req, res) {
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
                        status: false,
                        msg: 'Your account is suspended',
                        data: null
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

// enable or disable two factor auth
exports.two_factor_auth = async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status === true) {
        let loggedDealerId = verify.user.id;
        isEnable = req.body.isEnable;
        let updateDealerQ = "UPDATE dealers SET is_two_factor_auth=" + isEnable + " WHERE dealer_id=" + loggedDealerId;
        let updatedDealer = await sql.query(updateDealerQ);
        if (updatedDealer.affectedRows) {
            if (isEnable) {
                res.send({
                    status: true,
                    msg: "Dual Authentication is Successfully enabled",
                    isEnable: isEnable
                })
            } else {
                res.send({
                    status: true,
                    msg: "Dual Authentication is Successfully disabled",
                    isEnable: isEnable
                })
            }
        } else {
            res.send({
                status: false,
                msg: "Dual Authentication could not be enabled"
            })
        }

    }
}


exports.get_allowed_components = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {

    }
}


exports.check_component = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {
        var componentUri = req.body.ComponentUri;
        var userId = verify.user.id;
        var result = await helpers.isAllowedComponentByUri(componentUri, userId);
        let getUser = "SELECT * from dealers where dealer_id =" + userId;
        let user = await sql.query(getUser);
        var get_connected_devices = await sql.query("SELECT count(*) as total from usr_acc where dealer_id='" + userId + "'");

        if (user.length) {

            const usr = {
                id: user[0].dealer_id,
                dealer_id: user[0].dealer_id,
                email: user[0].dealer_email,
                lastName: user[0].last_name,
                name: user[0].dealer_name,
                firstName: user[0].first_name,
                dealer_name: user[0].dealer_name,
                dealer_email: user[0].dealer_email,
                link_code: user[0].link_code,
                connected_dealer: user[0].connected_dealer,
                connected_devices: get_connected_devices,
                account_status: user[0].account_status,
                user_type: verify.user.user_type,
                created: user[0].created,
                modified: user[0].modified,
                two_factor_auth: user[0].is_two_factor_auth,
                verified: user[0].verified
            }

            res.json({
                'status': true,
                'msg': '',
                user: usr,
                ComponentAllowed: result
            });
        } else {
            res.send({
                status: false,
                msg: "authentication failed"
            });
        }
    }
}

/** is_admin **/
exports.is_admin = async function (req, res) {

}

/** get_user_type **/
exports.user_type = async function (req, res) {
}