// libraries
var empty = require('is-empty');

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



exports.getStandAloneSims = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let loggedInId = verify.user.id
        let loggedInType = verify.user.user_type
        var SQry = `SELECT s.* , d.device_id FROM sim_ids as s LEFT JOIN usr_acc as u on s.user_acc_id = u.id LEFT JOIN devices as d ON d.id= u.device_id LEFT JOIN standalone_sims as sas ON sas.sim_id = s.sim_id WHERE s.delete_status = '0' AND ( s.delete_status = '0' OR sas.status = 'active' OR sas.status = 'completed') `;
        if (loggedInType !== constants.ADMIN) {
            SQry = SQry + `AND (s.dealer_id = ${loggedInId} OR s.uploaded_by_id = ${loggedInId}) `
        }
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
    if (verify) {
        try {
            let rSim = req.body.data;
            // console.log('sim-register ', req.body)

            let device_id = rSim.device_id;
            let iccid = rSim.iccid;
            let name = rSim.name;
            let sim_id = rSim.sim_id;
            let note = rSim.note;
            let guest = rSim.guest;
            let encrypt = rSim.encrypt;
            let dataLimit = rSim.data_limit;
            let status = rSim.status ? rSim.status : null;

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
        // try {
        let sim_id = req.body.iccid
        let package_id = req.body.package
        let data_plan_id = req.body.data_plan
        let pay_now = req.body.pay_now
        let paid_by_user = req.body.paid_by_user
        let note = req.body.note
        let name = req.body.name
        let email = req.body.email
        // console.log(req.body);
        let user = verify.user
        let user_id = verify.user.id
        let user_type = verify.user.user_type
        let total_price = 0
        let discounted_total_price = 0
        let loggedDealer = {}
        // console.log(user);
        if (user_type !== constants.ADMIN) {
            let loggedInUserData = await sql.query(`SELECT * FROM dealers WHERE dealer_id =?`, [user_id])
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
            let dealerBalanceAccont = await sql.query(`SELECT * FROM financial_account_balance WHERE dealer_id = ?`, [user_id])
            let dealer_account = null
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
                                    sql.query(`SELECT * FROM packages WHERE id = ? AND delete_status = '0'`, [package_id], async function (err, packages) {
                                        if (err) {
                                            console.log(err);
                                            return res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(req.translation[""], "ERROR: Internal server error.")
                                            })
                                        }
                                        if (packages && packages.length) {
                                            if (packages && Array.isArray(packages)) {
                                                packages.map(item => {
                                                    total_price += Number(item.pkg_price)
                                                })
                                                discounted_total_price = total_price
                                                if (pay_now) {
                                                    discounted_total_price = total_price - Math.ceil((total_price * 0.03))
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
                                                    return res.send({
                                                        status: true,
                                                        msg: await helpers.convertToLang(req.translation[""], "SAB OK HAI YAHA TAK.")
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
                                            console.log(err);
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
        // } catch (error) {
        //     console.log(error);
        //     res.send({
        //         status: false,
        //         msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Error"), // "Error"
        //     })
        //     return;
        // }
    } else {
        res.send({
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Error"), // "Error"
        })
        return;
    }
}