
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
            let encrypt = rSim.encrypt;
            let guest = rSim.guest;
            let dataLimit = rSim.data_limit;
            // let total_devices = req.body.total_dvc;

            let sQry = `SELECT * FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;
            console.log(sQry);
            let rslt = await sql.query(sQry);
            console.log(rslt);

            if (rslt.length < 1) {
                if (rslt.length < 2) {
                    var IQry = `INSERT IGNORE INTO sims (device_id, iccid, name, sim_id, note, guest, encrypt, dataLimit, sync) 
                VALUES ('${device_id}', '${iccid}', '${name}', '${sim_id}', '${note}', '${guest}', '${encrypt}', '${dataLimit}', '0');`;
                    sql.query(IQry, async function (err, result) {
                        if (err) console.log(err);
                        // console.log('rSim at users is: ', rSim)
                        sockets.sendRegSim(rSim);
                        data = {
                            status: true,
                            msg: "Sim Registered Successfully"
                        }
                        res.send(data);
                        return;
                    })
                } else {
                    res.send({
                        status: false,
                        msg: "Sorry! Maximun 2 registrations are allowed for this device."
                    })
                    return;
                }
            } else {
                res.send({
                    status: false,
                    msg: "You have already registered against this device ID and ICC-ID."
                })
                return;
            }
        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                msg: "Error"
            })
            return;
        }
    } else {
        res.send({
            status: false,
            msg: "Error"
        })
        return;
    }
}



exports.simUpdate = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        try {
            let simData = req.body.obj;
            console.log('simData is: ', simData)
            // return;
            let id = req.body.obj.id;
            let label = req.body.label;
            let value = (req.body.value == true) ? '1' : '0';

            let UQry;
            let Query = '';
            if (label != undefined && req.body.value != undefined) {
                if (id == "all") {
                    UQry = `UPDATE sims SET ${label} = '${value}' WHERE device_id= '${simData.device_id}'`;
                    Query = `SELECT * FROM sims WHERE device_id = '${simData.device_id}' AND iccid='${simData.iccid}'`;
                } else if (label != undefined && value != undefined) {
                    UQry = `UPDATE sims SET ${label} = '${value}' WHERE id = ${id}`;
                }
            } else {
                UQry = `UPDATE sims SET name='${simData.name}', note='${simData.note}', guest='${simData.guest}', encrypt='${simData.encrypt}', status='${simData.status}', sync = '0' WHERE device_id = '${simData.device_id}' AND iccid = '${simData.iccid}'`;
            }

            if (UQry != undefined) {
                sql.query(UQry, async function (err, result) {
                    if (err) console.log(err);

                    let guest = 0;
                    let encrypt = 0;
                    if (simData.guest == 1) guest = true; else guest = false;
                    if (simData.encrypt == 1) encrypt = true; else encrypt = false;

                    if (Query != undefined && Query != '') simData = sql.query(Query);
                    // sockets.sendRegSim(simData);
                    data = {
                        status: true,
                        msg: "Update Successfully"
                    }
                    res.send(data);
                    return;
                })
            } else {
                res.send({
                    status: false,
                    msg: "Query error"
                })
                return;
            }



        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                msg: "Error"
            })
            return;
        }

    } else {
        res.send({
            status: false,
            msg: "Error"
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
            let device_id = req.body.device_id;
            let iccid = req.body.iccid;

            if (device_id != undefined && iccid != undefined) {
                let dQry = `DELETE FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;

                sql.query(dQry, async function (err, result) {
                    if (err) console.log(err);

                    // sockets.sendRegSim(req.body.obj);
                    data = {
                        status: true,
                        msg: "Sim Delete Successfully"
                    }
                    res.send(data);
                    return;
                })
            } else {
                res.send({
                    status: false,
                    msg: "Error1"
                })
                return;
            }

        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                msg: "Error: something wrong for delete sim record"
            })
            return;
        }

    } else {
        res.send({
            status: false,
            msg: "Error2"
        })
        return;
    }
}


exports.getSims = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        if (!empty(req.params.device_id)) {
            var IQry = `SELECT * FROM sims WHERE device_id= '${req.params.device_id}'`;
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