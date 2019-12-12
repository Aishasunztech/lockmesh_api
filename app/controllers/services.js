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
                        label: app_constants.APP_TITLE
                    }
                    axios.post(app_constants.CREATE_SERVICE_PRODUCT, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                        if (response.data.status) {
                            if (type === 'pgp_email') {
                                sql.query(`INSERT INTO pgp_emails (pgp_email) VALUES ('${response.data.product}')`, function (err, results) {
                                    if (err) {
                                        console.log(err);
                                        res.send({
                                            status: false,
                                            msg: "ERROR: Internal Server Error. Please Try again."
                                        })
                                        return
                                    }
                                    if (results && results.insertId) {
                                        res.send({
                                            status: true,
                                            msg: "Pgp Email has been created Successfully.",
                                            product: response.data.product
                                        })
                                        return
                                    } else {
                                        res.send({
                                            status: false,
                                            msg: "Pgp Email not created. Please Try again."
                                        })
                                        return
                                    }
                                })
                            }
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