// libraries
var empty = require('is-empty');
var moment = require('moment');
var path = require("path");

// custom libraries
const { sql } = require('../../config/database');
const sockets = require('../../routes/sockets');

// helpers
const helpers = require('../../helper/general_helper');
const device_helpers = require('../../helper/device_helpers');
const socket_helpers = require('../../helper/socket_helper');
var axios = require('axios');
// constants
const MsgConstants = require('../../constants/MsgConstants')
const constants = require('../../constants/Application')
var app_constants = require('../../config/constants');
const { createInvoice } = require('../../helper/CreateInvoice')
const { sendEmail } = require("../../lib/email");




exports.getStandAloneSims = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let loggedInId = verify.user.id
        let loggedInType = verify.user.user_type
        var SQry = `SELECT s.* , d.device_id FROM sim_ids as s LEFT JOIN usr_acc as u on s.user_acc_id = u.id LEFT JOIN devices as d ON d.id= u.device_id LEFT JOIN standalone_sims as sas ON sas.sim_id = s.sim_id WHERE s.delete_status = '0' AND ( s.delete_status = '0' OR sas.status = 'active' OR sas.status = 'completed') `;
        if (loggedInType !== constants.ADMIN) {
            SQry = SQry + `AND (s.dealer_id = ${loggedInId} OR s.uploaded_by_id = ${loggedInId}) `
        }
        SQry = SQry + ` ORDER BY s.created_at DESC`
        sql.query(SQry, async function (err, result) {
            // console.log("=======================================")
            // console.log('result is :', result)
            if (err) {
                console.log(err)
                res.send({
                    status: false,
                })
                return;
            };
            if (result.length > 0) {
                result.map(item => {
                    item.device_id = helpers.checkValue(item.device_id)
                    item.term = helpers.checkValue(item.term)
                    item.start_date = helpers.checkValue(item.start_date)
                    item.expiry_date = helpers.checkValue(item.expiry_date)
                })
                data = {
                    status: true,
                    data: result
                }
            } else {
                data = {
                    status: false,
                    data: []
                }
            }
            res.send(data);
            return;
        })


    } else {
        res.send({
            status: false,
        })
        return;
    }
}

exports.changeSimStatus = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let id = req.body.id
        let type = req.body.type
        let user_id = verify.user.id
        let user_type = verify.user.user_type
        if (id && (type === 'activate' || type === 'suspend' || type === 'reset')) {
            let sim_query = `SELECT * FROM sim_ids WHERE id = ${id} AND delete_status = '0' `
            if (user_type !== constants.ADMIN) {
                sim_query = sim_query + `AND dealer_id = ${user_id} `
            }
            // console.log(sim_query);
            sql.query(sim_query, async function (err, results) {
                if (err) {
                    res.send({
                        status: false,
                        msg: "Error: Internal server error."
                    })
                    return;
                }
                if (results && results.length) {
                    let sim = results[0]
                    if (type === 'activate') {
                        if (sim.sim_status !== 'active') {
                            helpers.updateSimStatus(sim.sim_id, 'active', res)
                        } else {
                            res.send({
                                status: false,
                                msg: "Error: Sim is already activated."
                            })
                            return;
                        }
                    } else if (type === 'suspend') {
                        if (sim.sim_status !== 'suspended') {
                            await helpers.updateSimStatus(sim.sim_id, 'suspended', res)
                        } else {
                            res.send({
                                status: false,
                                msg: "Error: Sim is already suspended."
                            })
                            return;
                        }
                    }
                    else if (type === 'reset') {
                        await helpers.updateSimStatus(sim.sim_id, 'reset', res)
                    } else {
                        res.send({
                            status: false,
                            msg: "Error: Unautorized Command."
                        })
                        return;
                    }
                } else {
                    res.send({
                        status: false,
                        msg: "Error: Sim not found."
                    })
                    return;
                }
            })
        } else {
            res.send({
                status: false,
                msg: "Error: Unauthorized Access"
            })
            return;
        }
    } else {
        res.send({
            status: false,
            msg: "Error: Unauthorized Access"
        })
        return;
    }
}



exports.simRegister = async function (req, res) {
    var verify = req.decoded;
    try {
        console.log("req.body ", req.body);
        let rSim = req.body.data;
        // return res.send({ status: true, msg: 'jkl' });
        // console.log('sim-register ', req.body)

        let device_id = rSim.device_id;
        let iccid = rSim.iccid;
        let name = rSim.name;
        let sim_id = rSim.sim_id;
        let note = rSim.note;
        let guest = rSim.guest;
        let encrypt = rSim.encrypt;
        let dataLimit = rSim.data_limit;
        let status = rSim.status ? rSim.status : '';

        let sQry = `SELECT * FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}' AND delete_status='0'`;
        // console.log(sQry);
        let rslt = await sql.query(sQry);
        // console.log(rslt);

        // let activeSims = await sql.query(`SELECT * FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}' AND delete_status='0' AND (slotNo = '0' OR slotNo = '1')`);

        if (rslt.length < 1) {
            // if (activeSims.length < 2) {
            //*********/ Asked abaid to remove ingore from insert query **********//
            var IQry = `INSERT INTO sims (device_id, iccid, name, status, sim_id, note, guest, encrypt, dataLimit, sync, is_changed) 
                VALUES ('${device_id}', '${iccid}', '${name}', '${status}', '${sim_id}', '${note}', ${guest}, ${encrypt}, 0, '0', '1');`;
            sql.query(IQry, async function (err, result) {
                if (err) {
                    console.log(err)
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "ERROR"), // "You have already registered this device ID and ICC-ID."
                    })
                    return;
                };
                sql.query(`UPDATE sims SET is_changed = '0' WHERE device_id = '${device_id}' AND iccid = '${iccid}' AND delete_status='1'`)
                socket_helpers.sendRegSim(sockets.baseIo, device_id, "sim_update", [rSim]);
                device_helpers.saveSimActionHistory(device_id, "NEW_REGISTERED_SIM", [rSim]);
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SIM_REGISTERED_SUCCESSFULLY], "Sim Registered Successfully"), // "Sim Registered Successfully"
                }
                res.send(data);
                return;
            })

        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ALREADY_SIM_REGISTER], "You have already registered this device ID and ICC-ID"), // "You have already registered this device ID and ICC-ID."
            })
            return;
        }
    } catch (error) {
        console.log(error);
        return res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[""], "Error while processing!"),
        })
    }

}



exports.simUpdate = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        try {
            let simData = req.body.obj;


            // console.log('req.body simData is: ', simData)
            // return;
            // console.log('simData is: ', simData)
            // return;
            let id = req.body.obj.id;
            let label = req.body.label;
            let value = req.body.value;
            // console.log('label: ', label);
            // console.log('value: ', value);
            if (id == "unrAll") {

                //*********************** ur register guest *******************/
                let checkGuest = await sql.query(`SELECT * FROM device_attributes WHERE device_id = '${simData.device_id}' AND name = 'un_register_guest' AND delete_status = '0'`);
                if (checkGuest.length) {
                    await sql.query(`UPDATE device_attributes SET value = '${simData.unrGuest ? 1 : 0}' WHERE device_id= '${simData.device_id}' AND name='un_register_guest' AND delete_status='0'`);
                } else {
                    await sql.query(`INSERT INTO device_attributes (device_id, name, value) VALUES ('${simData.device_id}', 'un_register_guest', '${simData.unrGuest ? 1 : 0}')`);
                }

                //*************************** ur register encrypt  *************/
                let checkEncrypt = await sql.query(`SELECT * FROM device_attributes WHERE device_id = '${simData.device_id}' AND name = 'un_register_encrypt' AND delete_status = '0'`);
                if (checkEncrypt.length) {
                    await sql.query(`UPDATE device_attributes SET value = '${simData.unrEncrypt ? 1 : 0}' WHERE device_id= '${simData.device_id}' AND name='un_register_encrypt' AND delete_status='0'`);
                } else {
                    await sql.query(`INSERT INTO device_attributes (device_id, name, value) VALUES ('${simData.device_id}', 'un_register_encrypt', '${simData.unrEncrypt ? 1 : 0}')`);
                }


                // await sql.query(`UPDATE sims SET unrGuest = ${simData.unrGuest}, unrEncrypt=${simData.unrEncrypt} WHERE device_id= '${simData.device_id}' AND delete_status='0'`);

                socket_helpers.sendRegSim(sockets.baseIo, simData.device_id, "sim_unregister", simData);
                device_helpers.saveSimActionHistory(simData.device_id, "UN_REGISTER", simData);
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.UPDATE_SUCCESSFULLY], "Updated Successfully"), // "Updated Successfully"
                }
                res.send(data);
                return;
            } else {

                let UQry;
                let Query = '';
                if (label != undefined && req.body.value != undefined) {
                    if (id == "all") {
                        // console.log('at all')
                        UQry = `UPDATE sims SET ${label} = ${value}, is_changed = '1' WHERE device_id= '${simData.device_id}' AND delete_status='0'`;
                        Query = `SELECT * FROM sims WHERE device_id = '${simData.device_id}' AND delete_status='0'`;
                        // console.log('query is: ', Query);
                    } else {
                        UQry = `UPDATE sims SET ${label} = ${value}, is_changed = '1' WHERE id = ${id} AND delete_status='0'`;
                    }


                } else {
                    UQry = `UPDATE sims SET name='${simData.name}', note='${simData.note}', guest=${simData.guest}, encrypt=${simData.encrypt}, sync = '0', is_changed = '1' WHERE device_id = '${simData.device_id}' AND iccid = '${simData.iccid}' AND delete_status='0'`;
                }

                if (UQry != undefined) {
                    await sql.query(UQry, async function (err, result) {
                        if (err) {
                            console.log(err)
                            res.send({
                                status: false,
                            })
                            return;
                        };

                        let sims = [simData];
                        // console.log('sims are: ', sims)
                        if (Query != undefined && Query != '') sims = await sql.query(Query);

                        socket_helpers.sendRegSim(sockets.baseIo, simData.device_id, "sim_update", sims);
                        device_helpers.saveSimActionHistory(simData.device_id, "UPDATE", sims);
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.UPDATE_SUCCESSFULLY], "Updated Successfully"), // "Updated Successfully"
                        }
                        res.send(data);
                        return;
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.QUERY_ERROR], "Query Error"), // "Query error"
                    })
                    return;
                }
            }


        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Error"), // "Error"
            })
            return;
        }

    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Error"), // "Error"
        })
        return;
    }
}

exports.simDelete = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        try {

            // console.log('body is: ', req.body);

            // return;
            let simData = req.body;
            let device_id = simData.device_id;
            let iccid = simData.iccid;

            if (device_id != undefined && iccid != undefined) {
                // let dQry = `DELETE FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;
                let dQry = `UPDATE sims SET delete_status='1', is_changed='1' WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;

                sql.query(dQry, async function (err, result) {
                    if (err) {
                        console.log(err)
                        res.send({
                            status: false,
                        })
                        return;
                    };

                    socket_helpers.sendRegSim(sockets.baseIo, device_id, "sim_delete", [simData.iccid]);
                    device_helpers.saveSimActionHistory(device_id, "DELETE", [simData.iccid]);
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.SIM_DELETE_SUCCESSFULLY], "Sim Deleted Successfully"), // "Sim Deleted Successfully"
                    }
                    res.send(data);
                    return;
                })
            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "ERROR"), // "ERROR"
                })
                return;
            }

        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SOMETHING_WRONG_DELETE_SIM], "Error: could not delete sim record"), // "Error: could not delete sim record"
            })
            return;
        }

    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Error"), // "Error"
        })
        return;
    }
}


exports.getSims = async function (req, res) {
    var verify = req.decoded;
    let deviceId = req.params.device_id;
    if (verify && deviceId) {

        // socket_helpers.sendRegSim(sockets.baseIo,deviceId, "sim_inserted");

        var SQry = `SELECT * FROM sims WHERE device_id= '${deviceId}' AND delete_status = '0'`;
        sql.query(SQry, async function (err, result) {
            // console.log("=======================================")
            // console.log('result is :', result)
            if (err) {
                console.log(err)
                res.send({
                    status: false,
                })
                return;
            };

            // console.log(`SELECT * FROM device_attributes WHERE device_id= '${deviceId}' AND (name='un_register_guest' OR name='un_register_encrypt') AND delete_status = '0'`);

            var SDeviceAttributes = await sql.query(`SELECT * FROM device_attributes WHERE device_id= '${deviceId}' AND (name='un_register_guest' OR name='un_register_encrypt') AND delete_status = '0'`);
            let obj = {
                unRegisterGuest: 0,
                unRegisterEncrypt: 1
            }

            SDeviceAttributes.forEach(record => {
                // console.log('record is; ', record);
                if (record.name === "un_register_guest") {
                    obj.unRegisterGuest = JSON.parse(record.value);
                } else if (record.name === "un_register_encrypt") {
                    obj.unRegisterEncrypt = JSON.parse(record.value);
                }
            });


            // console.log("SDeviceAttributes ========>obj  ", obj)
            if (result.length > 0) {
                data = {
                    status: true,
                    data: result,
                    unRegisterSetting: obj
                }
            } else {
                data = {
                    status: false,
                    data: [],
                    unRegisterSetting: obj
                }
            }
            res.send(data);
            return;
        })


    } else {
        res.send({
            status: false,
        })
        return;
    }
}

exports.simHistory = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        try {
            if (req.params.device_id) {
                var IQry = `SELECT * FROM sims WHERE device_id= '${req.params.device_id}' AND delete_status = '1'`;
                sql.query(IQry, async function (err, result) {
                    // console.log("=======================================")
                    // console.log('result is :', result)
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if (result.length > 0) {
                        data = {
                            status: true,
                            data: result
                        }
                    } else {
                        data = {
                            status: false,
                            data: []
                        }
                    }
                    res.send(data);

                })

                // return;
            } else {
                res.send({
                    status: false,
                })
                // return;
            }
        } catch (error) {
            console.log(error);
            res.send({
                status: false,
            })
            // return;
        }
    }
}


exports.getUnRegisterSims = async function (req, res) {
    var verify = req.decoded;
    let deviceId = req.params.device_id;
    // console.log("getUnRegisterSims device is: ", deviceId);
    if (verify && deviceId) {

        let online = await device_helpers.isDeviceOnline(deviceId);
        // console.log(deviceId, 'check device online ', online);

        if (online) {

            socket_helpers.sendRegSim(sockets.baseIo, deviceId, "sim_inserted");
            res.send({
                status: false,
            })
            return;
        } else {
            res.send({
                status: true,
            })
            return;
        }

    }
}


exports.addStandAloneSim = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let sim_id = req.body.iccid
        let package_id = req.body.package
        let data_plan_id = req.body.data_plan
        let pay_now = req.body.pay_now
        let paid_by_user = req.body.paid_by_user
        let note = req.body.note
        let name = req.body.name
        let email = req.body.email
        let user = verify.user
        let user_id = verify.user.id
        let user_type = verify.user.user_type
        let total_price = 0
        let discounted_total_price = 0
        let discount = 0
        let date_now = moment().format('YYYY/MM/DD')
        let term = req.body.term
        let loggedDealer = {}
        sql.getConnection(async (error, connection) => {
            if (error) {
                console.log(error)
                return res.send({
                    status: false,
                    msg: "ERROR: Internal server error."
                })
            }
            // console.log(sql.query());
            try {

                connection.beginTransaction(async function (err) {
                    if (err) {
                        console.log(err)
                        return res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[""], "ERROR: Internal server error.")
                        })

                    };
                    if (user_type !== constants.ADMIN) {
                        let loggedInUserData = await sql.query(`SELECT * FROM dealers WHERE dealer_id =?`, [user_id])
                        // console.log(loggedInUserData);
                        if (!loggedInUserData || loggedInUserData.length < 1) {
                            res.send({
                                status: false,
                                msg: "Error: Dealer not found."
                            });
                            return
                        }
                        else if (loggedInUserData && loggedInUserData.length) {
                            loggedDealer = loggedInUserData[0]
                            if (loggedDealer.account_balance_status == 'restricted' && !pay_now) {
                                res.send({
                                    status: false,
                                    msg: "Error: Your Account balance status is on restricted level 1. You cannot use pay later function. Please Contact your admin"
                                });
                                return
                            } else if (loggedDealer.account_balance_status == 'suspended') {
                                res.send({
                                    status: false,
                                    msg: "Error: Your Account balance status is on restricted level 2. You cannot add new sims. Please Contact your admin"
                                });
                                return
                            }
                        }
                        let admin_data = await sql.query("SELECT * from dealers WHERE type = 1")
                        let dealerBalanceAccont = await sql.query(`SELECT * FROM financial_account_balance WHERE dealer_id = ?`, [user_id])
                        let dealer_account = null
                        // console.log(dealerBalanceAccont);
                        if (dealerBalanceAccont && dealerBalanceAccont.length) {
                            dealer_account = dealerBalanceAccont[0]
                        } else {
                            return res.send({
                                status: false,
                                msg: "ERROR: Dealer balance account not found."
                            })
                        }
                        if (sim_id && package_id && typeof pay_now === "boolean") {
                            if (sim_id) {
                                if (sim_id.length < 19 || sim_id.length > 20) {
                                    res.send({
                                        status: false,
                                        msg: "ERROR: ICCID MUST BE 19 OR 20 DIGITS LONG"
                                    })
                                    return
                                } else {
                                    let selectSimQ = `SELECT * FROM sim_ids WHERE sim_id = '${sim_id}' AND delete_status = '0'`
                                    let simFound = await sql.query(selectSimQ)
                                    if (simFound && simFound.length) {
                                        // console.log("sdasd");
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
                                                // res.send(response.data)
                                                let pkg_term = term + ' month'
                                                sql.query(`SELECT * FROM packages WHERE (id = ? OR id = ?) AND delete_status = '0' AND pkg_term = ?`, [package_id, data_plan_id, pkg_term], async function (err, packages) {
                                                    if (err) {
                                                        console.log(err);
                                                        return res.send({
                                                            status: false,
                                                            msg: await helpers.convertToLang(req.translation[""], "ERROR: Internal server error.")
                                                        })
                                                    }
                                                    console.log(package_id, data_plan_id, pkg_term);
                                                    if (packages && packages.length) {
                                                        let data_plan_package = null
                                                        let admin_cost = 0
                                                        let dealer_cost = 0
                                                        let paid_credits = 0
                                                        let expiry_date = helpers.getExpDateByMonth(date_now, term)
                                                        if (packages && Array.isArray(packages)) {
                                                            packages.map(async item => {
                                                                total_price += Number(item.pkg_price)
                                                                if (item.package_type === 'data_plan') {
                                                                    data_plan_package = item
                                                                }
                                                                let result = await sql.query("SELECT * FROM dealer_packages_prices WHERE package_id =" + item.id + " AND created_by = 'super_admin'")
                                                                if (result.length) {
                                                                    admin_cost = result[0].price
                                                                }
                                                                if (user_type === constants.SDEALER) {
                                                                    let result = await sql.query("SELECT * FROM dealer_packages_prices WHERE package_id =" + item.id + " AND created_by = 'admin'")
                                                                    if (result.length) {
                                                                        dealer_cost = result[0].price
                                                                    }
                                                                }

                                                                if (pay_now) {
                                                                    admin_cost = admin_cost - Math.ceil(Number((admin_cost * 0.03)))
                                                                    dealer_cost = dealer_cost - Math.ceil(Number((dealer_cost * 0.03)))
                                                                }
                                                            })
                                                            discounted_total_price = total_price
                                                            if (pay_now) {
                                                                discount = Math.ceil((total_price * 0.03))
                                                                discounted_total_price = total_price - discount
                                                            }
                                                            if (pay_now && dealer_account.credits < discounted_total_price) {
                                                                return res.send({
                                                                    status: false,
                                                                    msg: await helpers.convertToLang(req.translation[""], "ERROR: Your account balance is not enough to add new sim.Please choose other packages OR PURCHASE CREDITS.")
                                                                })
                                                            } else if (!pay_now && dealer_account.credit_limit > (Number(dealer_account.credits) - discounted_total_price)) {
                                                                return res.send({
                                                                    status: false,
                                                                    msg: await helpers.convertToLang(req.translation[""], "ERROR: Your account balance credit limit will exceed after buy this SIM.Please choose other packages OR PURCHASE CREDITS.")
                                                                })
                                                            } else {
                                                                let profitLoss = await helpers.calculateProfitLoss(packages, [], user_type)
                                                                let admin_profit = 0
                                                                let dealer_profit = 0
                                                                if (pay_now) {
                                                                    admin_profit = profitLoss.admin_profit - Math.ceil((profitLoss.admin_profit * 0.03))
                                                                    dealer_profit = profitLoss.dealer_profit - Math.ceil((profitLoss.dealer_profit * 0.03))
                                                                } else {
                                                                    admin_profit = profitLoss.admin_profit
                                                                    dealer_profit = profitLoss.dealer_profit
                                                                }

                                                                let inserQuery = `INSERT INTO sim_ids (sim_id , used , dealer_id , start_date , uploaded_by , uploaded_by_id , type , name , email , note) VALUES (?,?,?,?,?,?,?,?,?,?)`
                                                                let values = [sim_id, 1, user_id, date_now, user_type, user_id, 'standalone', name, email, note]
                                                                sql.query(inserQuery, values, function (err, insertResult) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        connection.rollback()
                                                                        return res.send({
                                                                            status: false,
                                                                            msg: "ERROR: Internal server error."
                                                                        })
                                                                    }
                                                                    if (insertResult && insertResult.insertId) {
                                                                        let sim_t_id = insertResult.insertId
                                                                        let inserStandaloneQuery = `INSERT INTO standalone_sims (sim_id ,iccid , dealer_id , dealer_type , package_data , sale_price , admin_cost , dealer_cost , term , start_date , end_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
                                                                        let standAloneValues = [sim_t_id, sim_id, user_id, user_type, JSON.stringify(packages), discounted_total_price, admin_cost, dealer_cost, term, date_now, expiry_date]
                                                                        sql.query(inserStandaloneQuery, standAloneValues, async function (error, insertResultStandAlone) {
                                                                            if (error) {
                                                                                console.log(error);
                                                                                connection.rollback()
                                                                                return res.send({
                                                                                    status: false,
                                                                                    msg: "ERROR: Internal server error."
                                                                                })
                                                                            }
                                                                            if (insertResultStandAlone && insertResultStandAlone.insertId) {
                                                                                let standalone_t_id = insertResultStandAlone.insertId
                                                                                if (data_plan_package) {
                                                                                    let data_plan_package_data = [{
                                                                                        data_limit: data_plan_package.data_limit,
                                                                                        pkg_price: data_plan_package.pkg_price,
                                                                                        term: term,
                                                                                        added_date: date_now
                                                                                    }]
                                                                                    let inserDataPlanQuery = `INSERT INTO sim_data_plans (service_id ,data_plan_package , total_price , sim_type , total_data  , start_date , type) VALUES (?,?,?,?,?,?,?)`
                                                                                    let dataPlanValues = [standalone_t_id, JSON.stringify(data_plan_package_data), data_plan_package.pkg_price, 'sim_id', data_plan_package.data_limit, date_now, 'standalone']
                                                                                    let insertResultDataPlan = await sql.query(inserDataPlanQuery, dataPlanValues)
                                                                                    if (!insertResultDataPlan || !insertResultDataPlan.insertId) {
                                                                                        connection.rollback()
                                                                                        console.log("Data Plan failed to add.");
                                                                                        return res.send({
                                                                                            status: false,
                                                                                            msg: "ERROR: Sim not added. Please try again."
                                                                                        })
                                                                                    }
                                                                                }
                                                                                let inv_no = await helpers.getInvoiceId()
                                                                                let fileName = "invoice-" + inv_no + ".pdf"
                                                                                let filePath = path.join(__dirname, "../../uploads/" + fileName)
                                                                                let invoiceData = await sql.query(`INSERT INTO invoices (inv_no,sim_t_id,dealer_id,file_name ,end_user_payment_status , type) VALUES('${inv_no}',${sim_t_id},${user_id}, '${fileName}' , '${paid_by_user}' , 'standalone_sim')`)
                                                                                let invoice_status = pay_now ? "PAID" : "UNPAID"
                                                                                let transection_data = {
                                                                                    sim_iccid: sim_id,
                                                                                    standalone_service_id: standalone_t_id
                                                                                }
                                                                                if (pay_now) {
                                                                                    let transection_credits = `INSERT INTO financial_account_transections (user_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits , invoice_id) VALUES (${user_id} ,'${JSON.stringify(transection_data)}' ,${discounted_total_price} ,'credit' , 'transferred' , 'standalone_sim' , ${discounted_total_price} , ${0} , ${invoiceData.insertId})`
                                                                                    let inserteddata = await sql.query(transection_credits)
                                                                                    if (!inserteddata || !inserteddata.insertId) {
                                                                                        connection.rollback()
                                                                                        console.log("Data Plan failed to add.");
                                                                                        return res.send({
                                                                                            status: false,
                                                                                            msg: "ERROR: Sim not added. Please try again."
                                                                                        })
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    let transection_due_credits = discounted_total_price;
                                                                                    if (dealer_account.credits > 0) {
                                                                                        transection_due_credits = discounted_total_price - dealer_account.credits
                                                                                        paid_credits = dealer_account.credits
                                                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits, invoice_id) VALUES (${user_id} ,'${JSON.stringify(transection_data)}' ,${discounted_total_price} ,'credit' , 'pending' , 'standalone_sim' , ${paid_credits} , ${transection_due_credits} , ${invoiceData.insertId})`
                                                                                        let inserteddata = await sql.query(transection_credits)
                                                                                        if (!inserteddata || !inserteddata.insertId) {
                                                                                            connection.rollback()
                                                                                            console.log("Data Plan failed to add.");
                                                                                            return res.send({
                                                                                                status: false,
                                                                                                msg: "ERROR: Sim not added. Please try again."
                                                                                            })
                                                                                        }
                                                                                        dealer_credits_remaining = false
                                                                                        invoice_status = "PARTIALLY PAID"
                                                                                    } else {
                                                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits, invoice_id) VALUES (${user_id} ,'${JSON.stringify(transection_data)}' ,${discounted_total_price} ,'credit' , 'pending' , 'standalone_sim' , 0 ,${discounted_total_price} , ${invoiceData.insertId})`
                                                                                        let inserteddata = await sql.query(transection_credits)
                                                                                        if (!inserteddata || !inserteddata.insertId) {
                                                                                            connection.rollback()
                                                                                            console.log("Data Plan failed to add.");
                                                                                            return res.send({
                                                                                                status: false,
                                                                                                msg: "ERROR: Sim not added. Please try again."
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                }
                                                                                let profit_transection_status = 'holding'
                                                                                if (pay_now) {
                                                                                    profit_transection_status = 'transferred'

                                                                                }
                                                                                if (admin_profit !== 0) {
                                                                                    let type = 'debit'
                                                                                    if (admin_profit < 0) {
                                                                                        type = 'credit'
                                                                                    }
                                                                                    let admin_profit_query = `INSERT INTO financial_account_transections (user_id, transection_data ,credits , transection_type , status , type) VALUES (${admin_data[0].dealer_id} ,'${JSON.stringify(transection_data)}', ${admin_profit} ,'${type}', '${profit_transection_status}', 'standalone_sim')`
                                                                                    let profit_result = await sql.query(admin_profit_query);
                                                                                    if (profit_result && profit_result.length) {
                                                                                        if (pay_now) {
                                                                                            let update_admin_credits = `UPDATE financial_account_balance SET credits = credits + ${admin_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
                                                                                            await sql.query(update_admin_credits)
                                                                                        }
                                                                                    } else {
                                                                                        connection.rollback()
                                                                                    }
                                                                                }
                                                                                if (user_type === constants.SDEALER) {
                                                                                    if (dealer_profit !== 0) {
                                                                                        let type = 'debit'
                                                                                        if (dealer_profit < 0) {
                                                                                            type = 'credit'
                                                                                        }
                                                                                        let dealer_profit_query = `INSERT INTO financial_account_transections (user_id, transection_data ,credits , transection_type , status , type) VALUES (${user.connected_dealer},'${JSON.stringify(transection_data)}', ${dealer_profit} ,'${type}', '${profit_transection_status}', 'standalone_sim')`
                                                                                        let profit_result = await sql.query(dealer_profit_query);
                                                                                        if (profit_result && profit_result.length && pay_now) {
                                                                                            if (pay_now) {
                                                                                                let update_admin_credits = `UPDATE financial_account_balance SET credits = credits + ${dealer_profit} WHERE dealer_id = ${user.connected_dealer}`
                                                                                                let updatedResult = await sql.query(update_admin_credits)
                                                                                                if (!updatedResult || updatedResult.affectedRows < 0) {
                                                                                                    connection.rollback()
                                                                                                }
                                                                                            }
                                                                                        } else {
                                                                                            connection.rollback()
                                                                                        }
                                                                                    }
                                                                                }
                                                                                let update_dealer_credits = `UPDATE financial_account_balance SET credits = credits - ${discounted_total_price} WHERE dealer_id = ${user_id}`
                                                                                let updatedResult = await sql.query(update_dealer_credits)
                                                                                if (!updatedResult || updatedResult.affectedRows < 0) {
                                                                                    connection.rollback()
                                                                                }
                                                                                let user_credits = "SELECT * FROM financial_account_balance WHERE dealer_id=" + user_id
                                                                                let account_balance = await sql.query(user_credits)
                                                                                const invoice = {
                                                                                    shipping: {
                                                                                        name: verify.user.dealer_name,
                                                                                        dealer_pin: verify.user.link_code,
                                                                                        sim_id: sim_id,
                                                                                    },
                                                                                    products: [],
                                                                                    packages: packages,
                                                                                    hardwares: [],
                                                                                    pay_now: pay_now,
                                                                                    discount: discount,
                                                                                    discountPercent: "3%",
                                                                                    quantity: 1,
                                                                                    subtotal: total_price,
                                                                                    paid: discounted_total_price,
                                                                                    invoice_nr: inv_no,
                                                                                    invoice_status: invoice_status,
                                                                                    paid_credits: paid_credits,
                                                                                    expiry_date: expiry_date,
                                                                                    type: 'standalone_sim'
                                                                                };
                                                                                await createInvoice(invoice, filePath)

                                                                                let attachment = {
                                                                                    fileName: fileName,
                                                                                    file: filePath
                                                                                }


                                                                                html = 'You have added a new standalone sim with ICCID :  ' + sim_id + '.<br>Your Invoice is attached below. <br>';

                                                                                sendEmail("NEW STANDALONE SIM ADDED", html, verify.user.dealer_email, null, attachment);

                                                                                let dealer_data = {
                                                                                    dealer_name: loggedDealer.dealer_name,
                                                                                    dealer_pin: loggedDealer.link_code
                                                                                }
                                                                                helpers.updateSimStatus(sim_id, 'active', null, true, dealer_data)


                                                                                var SimQry = `SELECT s.* , d.device_id FROM sim_ids as s LEFT JOIN usr_acc as u on s.user_acc_id = u.id LEFT JOIN devices as d ON d.id= u.device_id LEFT JOIN standalone_sims as sas ON sas.sim_id = s.id WHERE s.id = ${sim_t_id} AND sas.id = ${standalone_t_id}`;
                                                                                console.log(SimQry);
                                                                                sql.query(SimQry, async function (err, result) {
                                                                                    if (err) {
                                                                                        console.log(err);
                                                                                        connection.rollback()
                                                                                        return res.send({
                                                                                            status: false,
                                                                                            msg: "ERROR: Sim not added. Please try again."
                                                                                        })
                                                                                    }
                                                                                    if (result && result.length) {
                                                                                        // connection.commit(function (commitErr) {
                                                                                        //     if (commitErr) {
                                                                                        //         console.log(commitErr)
                                                                                        //         return res.send({
                                                                                        //             status: false,
                                                                                        //             msg: "ERROR: Sim not added. Please try again."
                                                                                        //         })
                                                                                        //     } else {
                                                                                        //     }
                                                                                        // })


                                                                                        console.log("Standalone Sim added Successfully");
                                                                                        return res.send({
                                                                                            status: true,
                                                                                            msg: "Stand Alone Sim added Successfully.",
                                                                                            data: result[0],
                                                                                            credits: account_balance[0] ? account_balance[0].credits : 0,
                                                                                        })
                                                                                    }
                                                                                })
                                                                            } else {
                                                                                connection.rollback()
                                                                                console.log("Standalone Sim data failed to add.");
                                                                                return res.send({
                                                                                    status: false,
                                                                                    msg: "ERROR: Sim not added. Please try again."
                                                                                })
                                                                            }
                                                                        })
                                                                    } else {
                                                                        connection.rollback()
                                                                        return res.send({
                                                                            status: false,
                                                                            msg: "ERROR: Sim not added. Please try again."
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        } else {
                                                            console.log(packages);
                                                            return res.send({
                                                                status: false,
                                                                msg: await helpers.convertToLang(req.translation[""], "ERROR: Internal server error.")
                                                            })
                                                        }
                                                    } else {
                                                        return res.send({
                                                            status: false,
                                                            msg: await helpers.convertToLang(req.translation[""], "ERROR: Package not found.")
                                                        })
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
                            }
                        } else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[""], "ERROR: Invalid information provided."), // "Error"
                            })
                            return;
                        }
                    } else {
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[""], "ERROR: Unauthorized access"), // "Error"
                        })
                        return;
                    }

                })
            } catch (error) {
                console.log(error);
                connection.rollback()
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Error"), // "Error"
                })
                return;
            }
        })

    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Error"), // "Error"
        })
        return;
    }

}