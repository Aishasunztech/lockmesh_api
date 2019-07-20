
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
            let total_devices = req.body.total_dvc;

            if (total_devices < 2) {
                var IQry = `INSERT IGNORE INTO sims (device_id, iccid, name, sim_id, note, guest, encrypt, dataLimit) 
                VALUES ('${device_id}', '${iccid}', '${name}', '${sim_id}', '${note}', '${guest}', '${encrypt}', '${dataLimit}');`;
                sql.query(IQry, async function (err, result) {
                    if (err) console.log(err);
                    // console.log('rSim at users is: ', rSim)
                    // sockets.sendRegSim(rSim);
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
        } catch (error) {
            console.log(error);
            res.send({
                status: false,
                msg: "Error1"
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



exports.simUpdate = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        try {
            let id = req.body.id;
            let label = req.body.label;
            let value = req.body.value;
            // console.log("=======================================")
            // console.log('test id: ', id);
            // console.log("=======================================")
            let UQry;
            if (id == "all") {
                UQry = `UPDATE sims SET ${label} = '${value}'`;
                // console.log('query is: ', UQry);
            } else if (label != undefined && value != undefined) {
                UQry = `UPDATE sims SET ${label} = '${value}' WHERE id = ${id}`;
                // console.log('query is: ', UQry);
            }
            // console.log('at update q', UQry)

            if (UQry != undefined) {

                sql.query(UQry, async function (err, result) {
                    if (err) {
                        console.log(err);
                    }
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