const { sql } = require('../../config/database');

const helpers = require('../../helper/general_helper');
const constants = require('../../constants/Application');
var app_constants = require('../../config/constants');
var axios = require('axios');
// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";

let data;

exports.createServiceProduct = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let auto_generated = req.body.auto_generated
        let product_data = req.body.product_data
        let type = req.body.type
        if (type && product_data) {
            if (type === 'pgp_email' && !auto_generated) {
                let pgp_email = product_data.username + '@' + product_data.domain
                console.log(pgp_email);
                if (helpers.validateEmail(pgp_email)) {
                    let checkExisted = await sql.query(`SELECT * FROM pgp_emails WHERE pgp_email = '${pgp_email}'`)
                    if (checkExisted && checkExisted.length) {
                        res.send({
                            status: false,
                            msg: "ERROR: Username not available.Please choose another username."
                        })
                        return
                    }
                    product_data.pgp_email = pgp_email
                } else {
                    res.send({
                        status: false,
                        msg: "ERROR: Invalid pgp email."
                    })
                    return
                }
            }

            axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                if (response.data.status) {
                    let data = {
                        auto_generated,
                        product_data,
                        type,
                        label: app_constants.APP_TITLE,
                        uploaded_by: verify.user.user_type,
                        uploaded_by_id: verify.user.id,
                    }
                    axios.post(app_constants.CREATE_SERVICE_PRODUCT, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                        if (response.data.status) {
                            let query = ''
                            let getQuery = ''
                            if (type === 'pgp_email') {
                                query = `INSERT INTO pgp_emails (pgp_email , uploaded_by , uploaded_by_id , domain_id) VALUES ('${response.data.product}' , '${verify.user.user_type}' , '${verify.user.id}' , ${product_data.domain_id})`
                                getQuery = `SELECT * FROM pgp_emails WHERE id = `
                            }
                            else if (type === 'chat_id') {
                                query = `INSERT INTO chat_ids (chat_id , uploaded_by , uploaded_by_id) VALUES ('${response.data.product}' , '${verify.user.user_type}' , '${verify.user.id}')`
                                getQuery = `SELECT * FROM chat_ids WHERE id = `
                            }
                            else if (type === 'sim_id') {
                                query = `INSERT INTO sim_ids (sim_id , uploaded_by , uploaded_by_id) VALUES ('${response.data.product}' , '${verify.user.user_type}' , '${verify.user.id}')`
                            }
                            else {
                                res.send({
                                    status: false,
                                    msg: "ERROR: Invalid Request"
                                })
                                return
                            }
                            sql.query(query, async function (err, results) {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        status: false,
                                        msg: "ERROR: Internal Server Error. Please Try again."
                                    })
                                    return
                                }
                                if (results && results.insertId) {
                                    let insertData = await sql.query(getQuery + results.insertId)
                                    res.send({
                                        status: true,
                                        msg: "Product has been created Successfully.",
                                        product: insertData[0]
                                    })
                                    return
                                } else {
                                    res.send({
                                        status: false,
                                        msg: "Product not created. Please Try again."
                                    })
                                    return
                                }
                            })
                        } else {
                            res.send({
                                status: false,
                                msg: response.data.msg
                            })
                            return
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.send({
                            status: false,
                            msg: "ERROR: Superadmin server not responding please try again later."
                        })
                        return
                    })
                }
            }).catch((err) => {
                console.log(err);
                res.send({
                    status: false,
                    msg: "ERROR: Superadmin server not responding please try again later."
                })
                return
            })
        }
        else {
            res.send({
                status: false,
                msg: "ERROR: Information not provided."
            })
            return
        }

    }

}

exports.generateRandomUsername = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
            console.log(response.data.status);
            if (response.data.status) {
                let data = {
                    label: app_constants.APP_TITLE
                }
                axios.post(app_constants.GENERATE_RANDOM_PGP, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                    if (response.data.status) {
                        res.send({
                            status: true,
                            username: response.data.username
                        })
                    } else {
                        res.send({
                            status: false,
                            msg: response.data.msg
                        })
                        return
                    }
                }).catch((err) => {
                    console.log(err);
                    res.send({
                        status: false,
                        msg: "ERROR: Superadmin server not responding please try again later."
                    })
                    return
                })
            }
        }).catch((err) => {
            console.log(err);
            res.send({
                status: false,
                msg: "ERROR: Superadmin server not responding please try again later."
            })
            return
        })
    }

}

exports.checkUniquePgp = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let pgp_email = req.body.pgp_email
        if (helpers.validateEmail(pgp_email)) {
            let checkExisted = await sql.query(`SELECT * FROM pgp_emails WHERE pgp_email = '${pgp_email}'`)
            if (checkExisted && checkExisted.length) {
                res.send({
                    status: false,
                    msg: "ERROR: Username not available"
                })
                return
            } else {
                axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                    if (response.data.status) {
                        let data = {
                            label: app_constants.APP_TITLE,
                            pgp_email,
                        }
                        axios.post(app_constants.CHECK_UNIQUE_PGP, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                            if (response.data.status) {
                                res.send({
                                    status: true,
                                    available: response.data.available
                                })
                            } else {
                                res.send({
                                    status: false,
                                    msg: response.data.msg
                                })
                                return
                            }
                        }).catch((err) => {
                            console.log(err);
                            res.send({
                                status: false,
                                msg: "ERROR: Superadmin server not responding."
                            })
                            return
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                    res.send({
                        status: false,
                        msg: "ERROR: Superadmin server not responding."
                    })
                    return
                })
            }
        } else {
            res.send({
                status: false,
                msg: "ERROR: Invalid pgp email."
            })
            return
        }
    }

}

exports.validateSimId = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let sim_id = req.body.sim_id
        if (sim_id) {
            if (sim_id.length < 19 || sim_id.length > 20) {
                res.send({
                    status: false,
                    msg: "ERROR: ICCID MUST BE 19 OR 20 DIGITS LONG"
                })
                return
            } else {
                let selectSimQ = `SELECT * FROM sim_ids WHERE sim_id = '${sim_id}' AND activated = 1 AND delete_status = 0`
                let simFound = await sql.query(selectSimQ)
                if (simFound && simFound.length) {
                    res.send({
                        status: false,
                        msg: "ERROR: THIS ICCID IS IN USE, PLEASE TRY ANOTHER ONE"
                    })
                    return
                }
            }
            axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                if (response.data.status) {
                    let data = {
                        label: app_constants.APP_TITLE,
                        sim_id,
                    }
                    axios.post(app_constants.VALIDATE_SIM_ID, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                        if (response.data.status) {
                            res.send({
                                status: true,
                                valid: response.data.valid
                            })
                        } else {
                            res.send({
                                status: false,
                                msg: response.data.msg
                            })
                            return
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.send({
                            status: false,
                            msg: "ERROR: Superadmin server not responding."
                        })
                        return
                    })
                } else {
                    console.log(err);
                    res.send({
                        status: false,
                        msg: "ERROR: Unauthorized Access."
                    })
                    return
                }
            }).catch((err) => {
                console.log(err);
                res.send({
                    status: false,
                    msg: "ERROR: Superadmin server not responding."
                })
                return
            })
        } else {
            res.send({
                status: false,
                msg: "ERROR: Invalid Sim ID."
            })
            return
        }
    }

}