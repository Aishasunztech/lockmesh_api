const { sql } = require('../../config/database');
const multer = require('multer');
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var XLSX = require('xlsx');
var empty = require('is-empty');
var mime = require('mime');
const axios = require('axios');

// const Constants = require('../../constants/application');
const device_helpers = require('../../helper/device_helpers');
const general_helpers = require('../../helper/general_helper');
const moment = require('moment');

exports.addAclModule = async function (req, res) {
    let title = req.body.title;
    let componentName = req.body.componentName;
    let uri = req.body.uri;
    let adminAllow = (req.body.admin && (req.body.admin === "true" || req.body.admin === "1")) ? true : false;
    let dealerAllow = (req.body.dealer && (req.body.dealer === "true" || req.body.dealer === "1")) ? true : false;
    let sdealerAllow = (req.body.sdealer && (req.body.sdealer === "true" || req.body.sdealer === "1")) ? true : false;

    let checkExisting = `SELECT * FROM acl_modules WHERE uri = '${uri}';`;
    let checkExistingResult = await sql.query(checkExisting);
    if (checkExistingResult && checkExistingResult.length) {
        return res.send({ status: false, msg: "failed to add acl role, bcz this route (uri value) already exist" });
    } else {

        if (adminAllow || dealerAllow || sdealerAllow) {
            let insertQuery = `INSERT INTO acl_modules (title, component, uri) VALUES ('${title}', '${componentName}', '${uri}');`;
            // console.log("insertQuery ", insertQuery);
            await sql.query(insertQuery, async function (err, result) {
                if (err) {
                    console.log(err);
                    return res.send({ status: false, msg: "Query error" })
                }

                if (result.affectedRows) {
                    let componentId = result.insertId;
                    let queryValues = '';

                    if (adminAllow) {
                        queryValues = `(1, ${componentId}), `
                    }
                    if (dealerAllow) {
                        queryValues = queryValues + `(2, ${componentId}), `
                    }
                    if (sdealerAllow) {
                        queryValues = queryValues + `(3, ${componentId}) `
                    }

                    if (queryValues === '') {
                        return res.send({ status: false, msg: "query value are empty" });
                    } else {
                        insertQuery = `INSERT INTO acl_module_to_user_roles (user_role_id, component_id) VALUES ${queryValues.replace(/,\s*$/, "")}`
                        // console.log("insertQuery acl_module_to_user_roles:: ", insertQuery);
                        let sResults = await sql.query(insertQuery);

                        if (sResults.affectedRows > 0) {
                            return res.send({ status: true, msg: "component path and role added successfully" });
                        } else {
                            return res.send({ status: false, msg: "failed to add acl role" });
                        }
                    }

                } else {
                    return res.send({ status: false, msg: "Error for insertion" });
                }
            });

        } else {
            return res.send({ status: false, msg: "failed to add acl role, bcz not set any role" });
        }
    }
};

exports.getAllowedComponents = async function (req, res) {
    // res.setHeader('Content-Type', 'applcation/json');

    var verify = req.decoded;
    // if (verify['status'] !== undefined && verify.status == true) {
    if (verify) {

    }
};


exports.checkComponent = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var verify = req.decoded;
    // if (verify['status'] !== undefined && verify.status == true) {
    if (verify) {
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
                verified: user[0].verified,
                account_balance_status: user[0].account_balance_status,
                account_balance_status_by: user[0].account_balance_status_by,
                demos: user[0].demos,
                remaining_demos: user[0].remaining_demos,
                company_name: user[0].company_name,
                company_address: user[0].company_address,
                city: user[0].city,
                state: user[0].state,
                country: user[0].country,
                postal_code: user[0].postal_code,
                tel_no: user[0].tel_no,
                website: user[0].website,
                timezone: user[0].timezone,
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