var generator = require('generate-password');
var empty = require('is-empty');
var md5 = require('md5');


const { sql } = require('../../config/database');
const { sendEmail } = require('../../lib/email');
const verifyToken = require('../../config/auth');

// 
const general_helpers = require('../../helper/general_helper');

// Constants
const app_constants = require('../../config/constants');
const constants = require('../../constants/Application');

exports.getAllDealers = async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        
        var role = await general_helpers.getuserTypeIdByName(verify.user.user_type);
        if (verify.user.user_type == constants.ADMIN) {
            
            sql.query(`SELECT * FROM dealers WHERE type!=${role} AND type != 4 ORDER BY created DESC`, async function (error, results) {
                if (error) {
                    console.log(error);
                    res.send({
                        status: false,
                        msgg: error
                    });
                    return;
                }

                var data = [];
                
                for (var i = 0; i < results.length; i++) {
                    if (results[i].connected_dealer != 0 && results[i].connected_dealer != '' && results[i].connected_dealer != '0') {
                        var get_parent_dealer = await sql.query("select dealer_id, dealer_name from dealers where dealer_id=" + results[i].connected_dealer + " limit 1");
                        console.log(get_parent_dealer);
                    }
                    var get_connected_devices = await sql.query("select count(*) as total from usr_acc where dealer_id='" + results[i].dealer_id + "'");

                    dt = {
                        status: true,
                        dealer_id: results[i].dealer_id,
                        dealer_name: results[i].dealer_name,
                        dealer_email: results[i].dealer_email,
                        link_code: results[i].link_code,
                        account_status: results[i].account_status,
                        unlink_status: results[i].unlink_status,
                        connected_dealer: results[i].connected_dealer,
                        created: results[i].created,
                        modified: results[i].modified,
                        connected_devices: get_connected_devices
                    };

                    if (get_parent_dealer != undefined && get_parent_dealer.length > 0) {
                        dt.parent_dealer = get_parent_dealer[0].dealer_name;
                        dt.parent_dealer_id = get_parent_dealer[0].dealer_id;
                    } else {
                        dt.parent_dealer = "";
                        dt.parent_dealer_id = "";
                    }

                    data.push(dt);
                }
                res.send(data);
                return;
            });
        } else {

            sql.query(`select * from dealers where connected_dealer = '${verify.user.id}' AND  type = 3 order by created DESC`, async function (error, results) {
                if (error) {
                    res.send({
                        status: false,
                        msgg: error
                    });
                    return;
                }
                
                var data = [];

                for (var i = 0; i < results.length; i++) {

                    var get_connected_devices = await sql.query(`SELECT count(*) AS total FROM usr_acc WHERE dealer_id='${results[i].id}'`);

                    dt = {
                        status: true,
                        dealer_id: results[i].dealer_id,
                        dealer_name: results[i].dealer_name,
                        dealer_email: results[i].dealer_email,
                        link_code: results[i].link_code,
                        account_status: results[i].account_status,
                        unlink_status: results[i].unlink_status,
                        created: results[i].created,
                        modified: results[i].modified,
                        connected_devices: get_connected_devices,
                        connected_dealer: results[i].connected_dealer,
                    };
                    data.push(dt);
                    
                }
                res.send(data);
                return;
            });
        }

    }
}


exports.editDealers = async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        var name = req.body.name;
        var email = req.body.email;
        var dealer_id = req.body.dealer_id;
        var setFields = "";
        var alreadyAvailable = false;
        var mailgiven = false;
        var enc_pwd = ''
        if (!empty(dealer_id) && (!empty(name) || !empty(email))) {

            // let dealer = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_email = '${email}' AND dealer_id =${dealer_id}`)
            let dealer = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_id =${dealer_id}`)
            if (dealer && dealer.length) {
                if (!empty(email)) {

                    mailgiven = true;
                    let checkMail = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_email='${email}' AND dealer_id !=${dealer_id}`);
                    if (checkMail.length) {
                        alreadyAvailable = true;

                        data = {
                            status: true,
                            msg: 'Email is already in use of other dealer',
                            data: row,
                            alreadyAvailable: alreadyAvailable
                        };
                        res.send(data);
                        return;

                    }

                    var dealer_pwd = generator.generate({
                        length: 10,
                        numbers: true
                    });
                    enc_pwd = md5(dealer_pwd);

                    setFields = `${setFields}  dealer_email='${email}', password = '${enc_pwd}' `;
                }

            } else {
                res.send({
                    status: false,
                    msg: "Dealer not found to Update"
                });
                return;
            }


            if (!empty(name)) {

                if (mailgiven == true && alreadyAvailable == false) {
                    setFields = `${setFields}, dealer_name='${name}'`;
                } else {
                    setFields = ` dealer_name='${name}'`;
                }
            }

            var query = `UPDATE dealers SET ${setFields} WHERE dealer_id = ${dealer_id}`;

            sql.query(query, async function (error, row) {

                if (row.affectedRows != 0) {
                    html = `Your login details are : <br>
                            Email : ${email} <br>
                            Password : ${dealer_pwd} <br>
                            Below is the link to login : <br> 
                            ${app_constants.HOST} <br>`;

                    sendEmail("Account Registration", html, email, function (error, response) {
                        if (error) {
                            console.log(error)
                            res.send({
                                status: true,
                                msg: 'Record updated successfully. Email not sent',
                                alreadyAvailable: alreadyAvailable
                            })
                            return;
                        } else {
                            res.send({
                                status: true,
                                msg: 'Record updated successfully. Email has been sent.',
                                alreadyAvailable: alreadyAvailable
                            })
                            return;
                        }
                    });

                } else {
                    data = {
                        status: true,
                        msg: 'Record not updated.'
                    };
                    res.send(data);
                    return;
                }
            });
        } else {
            data = {
                status: false,
                msg: "Please enter valid details"
            }
            res.send(data);
            return;
        }
    }
}


exports.deleteDealer = async function (req, res) {

    var verify = await verifyToken(req, res);
    var dealer_id = req.body.dealer_id;

    if (verify.status !== undefined && verify.status == true) {

        if (!empty(dealer_id)) {
            var qury = `UPDATE dealers SET unlink_status = 1 WHERE dealer_id = ${dealer_id} `;

            sql.query(qury, async function (error, row) {

                // var qury1 = "UPDATE dealers set unlink_status = 1 where connected_dealer = '" + dealer_id + "'";
                // var rslt = await sql.query(qury1);
                // if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                //     data = {
                //         status: true,
                //         msg: 'Dealer and Sub-Dealer deleted successfully.',
                //         data: row
                //     };
                //     res.send(data);
                //     return;
                // } else 

                if (row && row.affectedRows !== 0) {
                    data = {
                        status: true,
                        msg: 'Dealer deleted successfully.',
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        "status": false,
                        "msg": 'Record not deleted.'
                    };
                    res.send(data);
                    return;
                }

            });

        } else {
            data = {
                status: false,
                msg: 'Invalid Dealer.',
            };
            res.send(data);
            return;
        }
    }
}

/** Undo Dealer / S-Dealer **/
exports.undoDealer = async function (req, res) {
    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        var dealer_id = req.body.dealer_id;
        if (!empty(dealer_id)) {
            var qury = "UPDATE dealers set unlink_status = '0' where dealer_id = '" + dealer_id + "'";

            sql.query(qury, async function (error, row) {
                // var qury1 = "UPDATE dealers set unlink_status = '0' where connected_dealer = '" + dealer_id + "'";
                // var rslt = await sql.query(qury1);

                // if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                //     data = {
                //         "status": true,
                //         "msg": 'Dealer and S-Dealer added again.',
                //         "data": row
                //     };
                //     res.send(data);
                // } else

                if (row && row.affectedRows != 0) {
                    data = {
                        status: true,
                        msg: 'Dealer added again.',
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: 'Dealer not added.'
                    };
                    res.send(data);
                    return;
                }
            });

        } else {
            data = {
                status: false,
                msg: 'Invalid Dealer.',
            };
            res.send(data);
            return;
        }
    }

}

exports.suspendDealer = async function (req, res) {
    var verify = await verifyToken(req, res);
    if (verify.status !== undefined && verify.status == true) {
        let dealer_id = req.body.dealer_id;

        if (!empty(dealer_id)) {

            //suspend dealer
            var qury = "UPDATE dealers set account_status = 'suspended' where dealer_id = '" + dealer_id + "'";

            sql.query(qury, async function (error, row) {
                //suspend sub dealer                                                                                                                 
                // var qury1 = "UPDATE dealers set account_status = 'suspended' where connected_dealer = '" + dealer_id + "'";
                // var rslt = await sql.query(qury1);

                // if (row.affectedRows != 0 && rslt.affectedRows != 0) {

                //     data = {
                //         "status": true,
                //         "msg": 'Dealer and Sub-Dealer suspended successfully.',
                //         "data": row
                //     };
                //     res.send(data);
                // } else 
                if (row.affectedRows != 0) {
                    data = {
                        status: true,
                        msg: 'Dealer suspended successfully.',
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: false,
                        msg: 'Dealer not suspended.'
                    };
                    res.send(data);
                    return;
                }
            });

        } else {
            data = {
                status: false,
                msg: 'Invalid Dealer.',
            };
            res.send(data);
            return;
        }
    }

}

exports.activateDealer = async function (req, res) {
    var verify = await verifyToken(req, res);

    if (verify.status !== undefined && verify.status == true) {
        var dealer_id = req.body.dealer_id;

        if (!empty(dealer_id)) {
            var qury = `UPDATE dealers SET account_status = '' WHERE dealer_id = ${dealer_id} `;

            sql.query(qury, async function (error, row) {
                // var qury1 = "UPDATE dealers set account_status = '' where connected_dealer = '" + dealer_id + "'";
                // var rslt = await sql.query(qury1);
                // if (row.affectedRows != 0 && rslt.affectedRows != 0) {
                //     data = {
                //         "status": true,
                //         "msg": 'Dealer and S Dealer activated successfully.',
                //         "data": row
                //     };
                //     res.send(data);
                // } else 
                if (row && row.affectedRows != 0) {
                    data = {
                        status: true,
                        msg: 'Dealer activated successfully.',
                        data: row
                    };
                    res.send(data);
                    return;
                } else {
                    data = {
                        status: true,
                        msg: 'Dealer not activated.'
                    };
                    res.send(data);
                    return;

                }
            });

        } else {
            data = {
                status: false,
                msg: 'Invalid Dealer.',
            };
            res.send(data);
            return;

        }
    }

}


