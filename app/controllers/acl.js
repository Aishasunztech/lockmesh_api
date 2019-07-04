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
const device_helpers = require('../../helper/device_helpers');
const general_helpers = require('../../helper/general_helper');
const moment = require('moment')
const verifyToken = require('../../config/auth');
exports.getAllowedComponents = async function (req, res) {
    // res.setHeader('Content-Type', 'applcation/json');

    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {

    }
};

exports.checkComponent = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var verify = await verifyToken(req, res);
    if (verify['status'] !== undefined && verify.status == true) {
        var componentUri = req.body.ComponentUri;
        var userId = verify.user.id;
        var result = await general_helpers.isAllowedComponentByUri(componentUri, userId);

        let getUser = `SELECT * FROM dealers WHERE dealer_id =${userId}`;
        let user = await sql.query(getUser);

        var get_connected_devices = await sql.query(`SELECT count(*) AS total FROM usr_acc WHERE dealer_id='${userId}'`);

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
                status: true,
                msg: '',
                user: usr,
                ComponentAllowed: result
            });
            return;
        } else {
            res.send({
                status: false,
                msg: "authentication failed"
            });
            return;
        }
    }
}

/** is_admin **/
exports.isAdmin = async function (req, res) {

}

/** get_user_type **/
exports.getUserType = async function (req, res) {

}