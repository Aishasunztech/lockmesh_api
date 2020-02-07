// libraries
var empty = require('is-empty');

// custom libraries
const { sql } = require('../../config/database');
const sockets = require('../../routes/sockets');

// helpers
const helpers = require('../../helper/general_helper');
const device_helpers = require('../../helper/device_helpers');
const socket_helpers = require('../../helper/socket_helper');

// constants
const MsgConstants = require('../../constants/MsgConstants')
const constants = require('../../constants/Application')



exports.getStandAloneSims = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        var SQry = `SELECT s.* , d.device_id FROM sim_ids as s LEFT JOIN usr_acc as u on s.user_acc_id = u.id LEFT JOIN devices as d ON d.id= u.device_id LEFT JOIN standalone_sims as sas ON sas.sim_id = s.sim_id WHERE s.delete_status = '0' AND ( s.delete_status = '0' OR sas.status = 'active' OR sas.status = 'completed')`;
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
        if (id && (type === 'activate' || type === 'suspend')) {
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
                            let responseDate = helpers.updateSimStatus(sim.sim_id, 'active', res)

                        } else {
                            res.send({
                                status: false,
                                msg: "Error: Sim is already activated."
                            })
                            return;
                        }
                    } else if (type === 'suspend') {
                        if (sim.sim_status !== 'suspended') {
                            let responseDate = await helpers.updateSimStatus(sim.sim_id, 'suspended', res)
                        } else {
                            res.send({
                                status: false,
                                msg: "Error: Sim is already suspended."
                            })
                            return;
                        }
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