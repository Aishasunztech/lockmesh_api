
var empty = require('is-empty');
const { sql } = require('../../config/database');
const sockets = require('../../routes/sockets');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');




exports.simRegister = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        try {
            let rSim = req.body.data;
            console.log('sim-register ', req.body)

            let device_id = rSim.device_id;
            let iccid = rSim.iccid;
            let name = rSim.name;
            let sim_id = rSim.sim_id;
            let note = rSim.note;
            let guest = rSim.guest;
            let encrypt = rSim.encrypt;
            let dataLimit = rSim.data_limit;

            let sQry = `SELECT * FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}' AND del='0'`;
            console.log(sQry);
            let rslt = await sql.query(sQry);
            console.log(rslt);

            // let activeSims = await sql.query(`SELECT * FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}' AND del='0' AND (slotNo = '0' OR slotNo = '1')`);

            if (rslt.length < 1) {
                // if (activeSims.length < 2) {
                var IQry = `INSERT IGNORE INTO sims (device_id, iccid, name, sim_id, note, guest, encrypt, dataLimit, sync) 
                VALUES ('${device_id}', '${iccid}', '${name}', '${sim_id}', '${note}', ${guest}, ${encrypt}, '${dataLimit}', '0');`;
                sql.query(IQry, async function (err, result) {
                    if (err) console.log(err);

                    // history
                    // await sql.query(`INSERT IGNORE INTO sims_history (device_id, iccid, action, name, sim_id, note, guest, encrypt, dataLimit) 
                    // VALUES ('${device_id}', '${iccid}', 'insert', '${name}', '${sim_id}', '${note}', ${guest}, ${encrypt}, '${dataLimit}');`);

                    sockets.sendRegSim(device_id, "sim_update", [rSim]);
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.SIM_REGISTERED_SUCCESSFULLY], "Sim Registered Successfully"), // "Sim Registered Successfully"
                    }
                    res.send(data);
                    return;
                })
                // } else {
                //     res.send({
                //         status: false,
                //         msg: await helpers.convertToLang(req.translation[MsgConstants.MAXIMUN_2_SIMS_ALLOWED], "Sorry! Maximun 2 registrations are allowed for this device"), // "Sorry! Maximun 2 registrations are allowed for this device."
                //     })
                //     return;
                // }
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


            console.log('req.body is: ', req.body)
            // return;
            // console.log('simData is: ', simData)
            // return;
            let id = req.body.obj.id;
            let label = req.body.label;
            let value = req.body.value;
            console.log('label: ', label);
            console.log('value: ', value);
            if (id == "unrAll") {
                await sql.query(`UPDATE sims SET unrGuest = ${simData.unrGuest}, unrEncrypt=${simData.unrEncrypt} WHERE device_id= '${simData.device_id}' AND del='0'`);

                // // history
                // await sql.query(`INSERT IGNORE INTO sims_history (device_id, action, unrGuest, unrEncrypt) 
                // VALUES ('${simData.device_id}', 'update', ${simData.unrGuest}, ${simData.unrEncrypt});`);

                sockets.sendRegSim(simData.device_id, "sim_unregister", simData);
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
                        console.log('at all')
                        UQry = `UPDATE sims SET ${label} = ${value} WHERE device_id= '${simData.device_id}' AND del='0'`;
                        Query = `SELECT * FROM sims WHERE device_id = '${simData.device_id}' AND del='0'`;
                        console.log('query is: ', Query);
                    } else {
                        UQry = `UPDATE sims SET ${label} = ${value} WHERE id = ${id} AND del='0'`;
                    }

                    // await sql.query(`INSERT IGNORE INTO sims_history (device_id, action, ${label}) VALUES ('${simData.device_id}', 'update', ${value});`);

                } else {
                    UQry = `UPDATE sims SET name='${simData.name}', note='${simData.note}', guest=${simData.guest}, encrypt=${simData.encrypt}, sync = '0' WHERE device_id = '${simData.device_id}' AND iccid = '${simData.iccid}' AND del='0'`;
                    // history
                    // await sql.query(`INSERT IGNORE INTO sims_history (device_id, iccid, action, name, sim_id, note, guest, encrypt) VALUES ('${simData.device_id}', '${simData.iccid}', 'update', '${simData.name}', '${simData.sim_id}', '${simData.note}', ${simData.guest}, ${simData.encrypt});`);
                }

                if (UQry != undefined) {
                    await sql.query(UQry, async function (err, result) {
                        if (err) console.log(err);

                        let sims = [simData];
                        // console.log('sims are: ', sims)
                        if (Query != undefined && Query != '') sims = await sql.query(Query);

                        sockets.sendRegSim(simData.device_id, "sim_update", sims);
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

            console.log('body is: ', req.body);

            // return;
            let simData = req.body;
            let device_id = simData.device_id;
            let iccid = simData.iccid;

            if (device_id != undefined && iccid != undefined) {
                // let dQry = `DELETE FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;
                let dQry = `UPDATE sims SET del='1' WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;

                sql.query(dQry, async function (err, result) {
                    if (err) console.log(err);

                    // history
                    // await sql.query(`INSERT IGNORE INTO sims_history (device_id, iccid, action, name, sim_id, note, guest, encrypt, dataLimit) 
                    // VALUES ('${simData.device_id}', '${simData.iccid}', 'delete', '${simData.name}', '${simData.sim_id}', '${simData.note}', ${simData.guest}, ${simData.encrypt}, '${simData.dataLimit}');`);

                    sockets.sendRegSim(device_id, "sim_delete", [simData.iccid]);
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
    if (verify) {
        if (!empty(req.params.device_id)) {
            var IQry = `SELECT * FROM sims WHERE device_id= '${req.params.device_id}' AND del = '0'`;
            sql.query(IQry, async function (err, result) {
                // console.log("=======================================")
                // console.log('result is :', result)
                if (err) console.log(err);

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

            return;
        } else {
            res.send({
                status: false,
            })
            return;
        }
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
            if (!empty(req.params.device_id)) {
                var IQry = `SELECT * FROM sims WHERE device_id= '${req.params.device_id}' AND del = '1'`;
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

                return;
            } else {
                res.send({
                    status: false,
                })
                return;
            }
        } catch (error) {
            console.log(error);
            res.send({
                status: false,
            })
            return;
        }
    }
}