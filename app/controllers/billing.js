

const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
const constants = require('../../constants/Application');
// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"
let usr_acc_query_text =  constants.usr_acc_query_text;

exports.acceptRequest = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let id = req.params.id
            let query = "SELECT * from credit_requests where id = " + id + " and  status = '0'"
            // console.log(query);
            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    let logginUserCredits = await sql.query("select credits from dealer_credits where dealer_id = " + verify.user.id)
                    if (logginUserCredits.length) {
                        if (logginUserCredits[0].credits > result[0].credits) {
                            let dealer_id = result[0].dealer_id
                            let newCredit = result[0].credits
                            let deductedCredits = logginUserCredits[0].credits - result[0].credits
                            let credits = await sql.query("select * from dealer_credits where dealer_id = " + dealer_id);
                            // console.log(resul);
                            if (credits.length) {
                                newCredit = credits[0].credits + result[0].credits
                            }
                            sql.query("update dealer_credits set credits = " + newCredit + " where dealer_id = " + dealer_id, async function (err, reslt) {
                                if (err) {
                                    console.log(err);
                                }
                                if (reslt && reslt.affectedRows > 0) {
                                    let updateQuery = "update credit_requests set status = 1 where id= " + id
                                    await sql.query(updateQuery);
                                    let userCredits = "update dealer_credits set credits = " + deductedCredits + " where dealer_id = " + verify.user.id;
                                    await sql.query(userCredits)
                                    res.send({
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully.",
                                        user_credits: deductedCredits
                                    })
                                    return
                                }
                                else {
                                    let query = `INSERT into dealer_credits (dealer_id,credits) VALUES (${dealer_id}, ${newCredit})`;
                                    sql.query(query, async function (err, reslt) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (reslt && reslt.affectedRows > 0) {
                                            let updateQuery = "update credit_requests set status = 1 where id= " + id
                                            await sql.query(updateQuery)
                                            let userCredits = "update dealer_credits set credits = " + deductedCredits + " where dealer_id = " + verify.user.id;
                                            await sql.query(userCredits)
                                            res.send({
                                                status: true,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully.",
                                                user_credits: deductedCredits
                                            })
                                            return
                                        }
                                        else {
                                            res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_UPDATED], "Credits not updated please try again"), // "Credits not updated please try again."
                                            })
                                            returns

                                        }
                                    })
                                }
                            })
                        }
                        else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_ENOUGH_ACCEPT_REQUEST], "Your credits are not enough to accept a request"), // "Your credits are not enough to accept a request."
                            })
                            return
                        }
                    } else {
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_ENOUGH_ACCEPT_REQUEST], "Your credits are not enough to accept a request"), // "Your credits are not enough to accept a request."
                        })
                        return
                    }
                } else {
                    data = {
                        "status": false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_IS_ALREADY_DELETED], "Request is already deleted"), // "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}


// *****************************  SET AND GET => PRICES & PAKAGES   **************************
exports.savePrices = async function (req, res) {
    // console.log('save-prices data at server is', req.body)
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let data = req.body.data;
        if (data) {
            // console.log(data, 'data')
            // let dealer_id = req.body.dealer_id;
            let dealer_id = verify.user.dealer_id;
            if (dealer_id) {
                // console.log(dealer_id, 'whitelableid');
                let error = 0;

                let month = ''
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        // console.log(key + " -> " + data[key]);
                        let outerKey = key;

                        let innerObject = data[key];
                        // console.log('iner object is', innerObject)
                        for (var innerKey in innerObject) {
                            if (innerObject.hasOwnProperty(innerKey)) {
                                let days = 0;
                                // console.log(innerKey + " -> " + innerObject[innerKey]);
                                if (innerObject[innerKey]) {

                                    // console.log('is string', string)
                                    let stringarray = [];

                                    stringarray = innerKey.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                                    if (stringarray) {
                                        // console.log(stringarray,'is string lenth', stringarray.length)
                                        if (stringarray.length) {
                                            month = stringarray[0];
                                            // console.log('is month', month, stringarray[1])
                                            if (month && stringarray[1]) {
                                                // console.log('sring[1]', stringarray[1])
                                                if (stringarray[1] == 'month') {
                                                    days = parseInt(month) * 30
                                                } else if (string[1] == 'year') {
                                                    days = parseInt(month) * 365
                                                } else {
                                                    days = 30
                                                }
                                            }
                                        }
                                    }
                                }
                                // console.log(days, 'days are')
                                let unit_price = innerKey;
                                let updateQuery = "UPDATE prices SET unit_price='" + innerObject[innerKey] + "', price_expiry='" + days + "', dealer_id='" + dealer_id + "' WHERE price_term='" + innerKey + "' AND price_for='" + key + "'";
                                // console.log(updateQuery, 'query')
                                sql.query(updateQuery, async function (err, result) {
                                    if (err) {
                                        console.log(err)
                                    }

                                    if (result) {
                                        // console.log('outerKey', outerKey)
                                        if (!result.affectedRows) {
                                            let insertQuery = "INSERT INTO prices (price_for, unit_price, price_term, price_expiry, dealer_id) VALUES('" + outerKey + "', '" + innerObject[innerKey] + "', '" + unit_price + "', '" + days + "', '" + dealer_id + "')";
                                            console.log('Billing query', insertQuery)
                                            let rslt = await sql.query(insertQuery);
                                            if (rslt) {
                                                if (rslt.affectedRows == 0) {
                                                    error++;
                                                }
                                            }
                                            // console.log(rslt, 'inner rslt')
                                        }
                                    }
                                })
                            }
                        }

                    }
                }
                console.log('errors are ', error)

                if (error == 0) {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PRICES_SET_SUCCESSFULLY], "Prices Set Successfully"), // 'Prices Set Successfully'
                    })
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some Error Occured"), // 'Some Error Occured'
                    })
                }

            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // 'Invalid Dealer'
                })
            }

        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
        }
    }
}

exports.savePackage = async function (req, res) {
    console.log('data is', req.body)
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // console.log(verify.user, 'user is the ')
        let data = req.body.data;
        let dealer_id = verify.user.dealer_id;
        if (data) {
            // console.log(data, 'data')
            // let dealer_id = req.body.data.dealer_id;
            if (dealer_id) {
                // console.log(dealer_id, 'whitelableid');
                let days = 0;
                if (data.pkgTerm) {
                    stringarray = data.pkgTerm.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                    if (stringarray) {
                        // console.log(stringarray,'is string lenth', stringarray.length)
                        if (stringarray.length) {
                            month = stringarray[0];
                            // console.log('is month', month, stringarray[1])
                            if (month && stringarray[1]) {
                                // console.log('sring[1]', stringarray[1])
                                if (stringarray[1] == 'month') {
                                    days = parseInt(month) * 30
                                } else if (string[1] == 'year') {
                                    days = parseInt(month) * 365
                                } else {
                                    days = 30
                                }
                            }
                        }
                    }
                }
                let pkg_features = JSON.stringify(data.pkgFeatures)
                let insertQuery = "INSERT INTO packages (dealer_id , dealer_type , pkg_name, pkg_term, pkg_price, pkg_expiry, pkg_features) VALUES('" + dealer_id + "' ,'" + verify.user.user_type + "' , '" + data.pkgName + "', '" + data.pkgTerm + "', '" + data.pkgPrice + "','" + days + "', '" + pkg_features + "')";
                sql.query(insertQuery, async (err, rslt) => {
                    if (err) {
                        console.log(err)
                    }

                    if (rslt) {
                        if (rslt.affectedRows) {
                            insertedRecord = await sql.query("SELECT * FROM packages WHERE dealer_id='" + dealer_id + "' AND id='" + rslt.insertId + "'")
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.PACKAGE_SAVED_SUCCESSFULLY], "Package Saved Successfully"), // 'Package Saved Successfully',
                                data: insertedRecord
                            })
                        }
                    }
                })

            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // 'Invalid Dealer'
                })
            }
        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
        }
    }
}



exports.getPrices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // let dealer_id = req.params.dealer_id;
        console.log(verify.user)
        let dealer_id = verify.user.dealer_id;
        let sim_id = {};
        let chat_id = {};
        let pgp_email = {};
        let vpn = {};
        if (dealer_id) {
            let selectQuery = "SELECT * FROM prices WHERE dealer_id='" + dealer_id + "'";
            sql.query(selectQuery, async (err, reslt) => {
                if (err) {
                    console.log(err)
                }
                if (reslt) {
                    console.log('result for get prices are is ', reslt);

                    if (reslt.length) {
                        for (let item of reslt) {
                            if (item.price_for == 'sim_id') {
                                sim_id[item.price_term] = item.unit_price
                            } else if (item.price_for == 'chat_id') {
                                chat_id[item.price_term] = item.unit_price
                            } else if (item.price_for == 'pgp_email') {
                                pgp_email[item.price_term] = item.unit_price
                            } else if (item.price_for == 'vpn') {
                                vpn[item.price_term] = item.unit_price
                            }
                        }
                        let data = {
                            sim_id: sim_id ? sim_id : {},
                            chat_id: chat_id ? chat_id : {},
                            pgp_email: pgp_email ? pgp_email : {},
                            vpn: vpn ? vpn : {}
                        }
                        console.log(data, 'reslt data of prices')
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: data

                        })
                    } else {
                        let data = {
                            sim_id: sim_id ? sim_id : {},
                            chat_id: chat_id ? chat_id : {},
                            pgp_email: pgp_email ? pgp_email : {},
                            vpn: vpn ? vpn : {}
                        }

                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: data
                        })
                    }

                } else {
                    let data = {
                        sim_id: sim_id ? sim_id : {},
                        chat_id: chat_id ? chat_id : {},
                        pgp_email: pgp_email ? pgp_email : {},
                        vpn: vpn ? vpn : {}
                    }

                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                        data: data
                    })
                }
            })
        } else {

            let data = {
                sim_id: sim_id ? sim_id : {},
                chat_id: chat_id ? chat_id : {},
                pgp_email: pgp_email ? pgp_email : {},
                vpn: vpn ? vpn : {}
            }

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: data

            })
        }
    }
}

exports.getPackages = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // let dealer_id = req.params.dealer_id;
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            let selectQuery = "SELECT * FROM packages WHERE dealer_id='" + dealer_id + "'";
            sql.query(selectQuery, async (err, reslt) => {
                if (err) {
                    console.log(err)
                }

                if (reslt) {
                    console.log('result for get prices are is ', reslt);

                    if (reslt.length) {
                        console.log(reslt, 'reslt data of prices')
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: reslt

                        })
                    } else {
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: []

                        })
                    }

                } else {

                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                        data: []
                    })
                }
            })
        } else {

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: []

            })
        }
    }
}
exports.getParentPackages = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        console.log(verify.user);
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {

            if (verify.user.user_type === ADMIN) {

            }
            else if (verify.user.user_type === DEALER) {

                let selectQuery = "SELECT * FROM packages WHERE dealer_type='admin'";
                sql.query(selectQuery, async (err, reslt) => {
                    if (err) {
                        console.log(err)
                    }

                    if (reslt) {
                        // console.log('result for get packages are is ', reslt);

                        if (reslt.length) {
                            // console.log(reslt, 'reslt data of prices')
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                                data: reslt

                            })
                        } else {
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                                data: []

                            })
                        }

                    } else {

                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: []
                        })
                    }
                })

            }
            else if (verify.user.user_type === SDEALER) {

                let selectQuery = "SELECT * FROM packages WHERE dealer_type='dealer' AND dealer_id= " + verify.user.connected_dealer;
                sql.query(selectQuery, async (err, reslt) => {
                    if (err) {
                        console.log(err)
                    }

                    if (reslt) {
                        // console.log('result for get packages are is ', reslt);

                        if (reslt.length) {
                            // console.log(reslt, 'reslt data of prices')
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                                data: reslt

                            })
                        } else {
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                                data: []

                            })
                        }

                    } else {
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: []
                        })
                    }
                })

            }



        } else {

            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER_ID], "Invalid dealer id"), // 'Invalid dealer_id',
                data: []

            })
        }
    }
}

exports.checkPackageName = async function (req, res) {

    try {
        var verify = req.decoded; // await verifyToken(req, res);

        if (verify) {
            let name = req.body.name !== undefined ? req.body.name : null;

            let checkExistingQ = "SELECT pkg_name FROM packages WHERE pkg_name='" + name + "'";

            let checkExisting = await sql.query(checkExistingQ);
            console.log(checkExistingQ, 'query is')
            if (checkExisting.length) {
                data = {
                    status: false,
                };
                res.send(data);
                return;
            }
            else {
                data = {
                    status: true,
                };
                res.send(data);
                return;
            }
        }
    } catch (error) {
        console.log(error);
    }

}

exports.updateCredit = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let credits = req.body.data.credits
            let dealer_id = req.body.data.dealer_id
            console.log(credits);
            if (dealer_id !== '' && dealer_id !== undefined && dealer_id !== null) {
                sql.query("SELECt * from dealer_credits where dealer_id = " + dealer_id, async function (err, result) {
                    if (err) {
                        console.log(err)
                    }

                    if (result.length) {
                        let newCredit = credits + result[0].credits
                        sql.query("update dealer_credits set credits = " + newCredit + " where dealer_id = " + dealer_id, async function (err, reslt) {
                            if (err) {
                                console.log(err)
                            }

                            if (reslt && reslt.affectedRows > 0) {
                                res.send({
                                    status: true,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully."
                                })
                                return
                            }
                            else {
                                res.send({
                                    status: false,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_UPDATED], "Credits not updated please try again"), // "Credits not updated please try again."
                                })
                                returns

                            }
                        })
                    }
                    else {
                        let query = `INSERT into dealer_credits (dealer_id,credits) VALUES (${dealer_id}, ${credits})`;
                        sql.query(query, async function (err, reslt) {
                            if (err) {
                                console.log(err);
                            }
                            if (reslt && reslt.affectedRows > 0) {
                                res.send({
                                    status: true,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully."
                                })
                                return
                            }
                            else {
                                res.send({
                                    status: false,
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_NOT_UPDATED], "Credits not updated please try again"), // "Credits not updated please try again."
                                })
                                returns

                            }
                        })
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

exports.newRequests = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let query = ''
            // console.log(verify.user);
            if (verify.user.user_type === ADMIN) {
                query = "SELECT * from credit_requests where status = '0' AND dealer_type = 'dealer'"
            } else {
                let sdealers = await helpers.getSdealersByDealerId(verify.user.id)
                // console.log(sdealers);
                if (sdealers.length) {
                    query = `SELECT * from credit_requests where status = '0' AND dealer_type = 'sdealer' AND dealer_id IN (${sdealers.join()})`
                } else {
                    data = {
                        "status": false,
                        "data": []
                    };
                    res.send(data);
                    return
                }
            }
            console.log(query);
            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    data = {
                        "status": true,
                        "data": result
                    };
                    res.send(data);
                    return
                } else {
                    data = {
                        "status": true,
                        "data": []
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}

exports.getUserCredits = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let query = ''
            query = `SELECT credits from dealer_credits where dealer_id= ${verify.user.id}`

            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {
                    console.log(result);
                    data = {
                        "status": true,
                        "credits": result[0].credits
                    };
                    res.send(data);
                    return
                } else {
                    data = {
                        "status": true,
                        "credits": 0
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

exports.deleteRequest = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        try {
            let id = req.params.id
            let query = "SELECT * from credit_requests where id = " + id + " and  status = '0'"
            console.log(query);
            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.length) {

                    let updateQuery = "update credit_requests set status = 1, del_status = 1 where id= " + id
                    sql.query(updateQuery, async function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        if (result && result.affectedRows > 0) {
                            data = {
                                "status": true,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.REQUEST_DELETED_SUCCESSFULLY], "Request deleted successfully"), // Request deleted successfully."
                            };
                            res.send(data);
                            return
                        } else {
                            data = {
                                "status": false,
                                "msg": await helpers.convertToLang(req.translation[MsgConstants.REQUEST_NOT_DELETED], "Request not deleted please try again"), // Request not deleted please try again."
                            };
                            res.send(data);
                            return
                        }
                    })

                } else {
                    data = {
                        "status": false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.REQUEST_IS_ALREADY_DELETED], "Request is already deleted"), // "Request is already deleted"
                    };
                    res.send(data);
                    return
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}