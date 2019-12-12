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

exports.createPgpEmail = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let auto_generated = req.body.auto_generated
        let product_data = req.body.product_data
        let type = req.body.type
        if (type && auto_generated && product_data) {
            axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                if (response.data.status) {
                    let data = {
                        auto_generated,
                        product_data,
                        type
                    }
                    axios.post(app_constants.CREATE_SERVICE_PRODUCT, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                        if (response.data.status) {

                        } else {
                            console.log(err);
                            res.send({
                                status: false,
                                msg: "ERROR: Superadmin server not responding please try again later."
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

}