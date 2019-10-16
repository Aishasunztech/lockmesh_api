

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
let usr_acc_query_text = constants.usr_acc_query_text;

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
                    let logginUserCredits = await sql.query("select credits from financial_account_balance where dealer_id = " + verify.user.id)
                    if (logginUserCredits.length) {
                        if (logginUserCredits[0].credits > result[0].credits) {
                            let dealer_id = result[0].dealer_id
                            let newCredit = result[0].credits
                            let deductedCredits = logginUserCredits[0].credits - result[0].credits
                            let credits = await sql.query("select * from financial_account_balance where dealer_id = " + dealer_id);
                            // console.log(resul);
                            if (credits.length) {
                                newCredit = credits[0].credits + result[0].credits
                            }
                            sql.query("update financial_account_balance set credits = " + newCredit + " where dealer_id = " + dealer_id, async function (err, reslt) {
                                if (err) {
                                    console.log(err);
                                }
                                if (reslt && reslt.affectedRows > 0) {
                                    let updateQuery = "update credit_requests set status = 1 where id= " + id
                                    await sql.query(updateQuery);
                                    let userCredits = "update financial_account_balance set credits = " + deductedCredits + " where dealer_id = " + verify.user.id;
                                    await sql.query(userCredits)
                                    res.send({
                                        status: true,
                                        msg: await helpers.convertToLang(req.translation[MsgConstants.CREDITS_ADDED_SUCCESSFULLY], "Credits added successfully"), // "Credits added successfully.",
                                        user_credits: deductedCredits
                                    })
                                    return
                                }
                                else {
                                    let query = `INSERT into financial_account_balance (dealer_id,credits) VALUES (${dealer_id}, ${newCredit})`;
                                    sql.query(query, async function (err, reslt) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        if (reslt && reslt.affectedRows > 0) {
                                            let updateQuery = "update credit_requests set status = 1 where id= " + id
                                            await sql.query(updateQuery)
                                            let userCredits = "update financial_account_balance set credits = " + deductedCredits + " where dealer_id = " + verify.user.id;
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
                                let f_key = innerKey;
                                console.log(innerKey + " -> " + innerObject[innerKey]);
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
                                let updateQuery = "UPDATE prices SET unit_price='" + innerObject[f_key] + "', price_expiry='" + days + "' WHERE dealer_id='" + dealer_id + "' AND price_term='" + innerKey + "' AND price_for='" + key + "'";
                                // console.log(updateQuery, 'query')
                                sql.query(updateQuery, async function (err, result) {
                                    if (err) {
                                        console.log(err)
                                    }

                                    if (result) {
                                        // console.log('outerKey', outerKey)
                                        if (!result.affectedRows) {
                                            let insertQuery = "INSERT INTO prices (price_for, unit_price, price_term, price_expiry, dealer_id , dealer_type) VALUES('" + outerKey + "', '" + innerObject[f_key] + "', '" + unit_price + "', '" + days + "', '" + dealer_id + "' , '" + verify.user.user_type + "')";
                                            // console.log('Billing query', insertQuery)
                                            let rslt = await sql.query(insertQuery);
                                            if (rslt) {
                                                if (rslt.affectedRows == 0) {
                                                    error++;
                                                }
                                            }
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
exports.saveSaPrices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let data = req.body.data;
        if (data) {
            let dealer_id = verify.user[0].dealer_id;
            console.log(dealer_id);
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
                                console.log(innerObject[innerKey], key, "Values");
                                let updateQuery = "UPDATE prices SET unit_price='" + innerObject[innerKey] + "', price_expiry='" + days + "', dealer_id='" + dealer_id + "' WHERE price_term='" + innerKey + "' AND price_for='" + key + "' AND dealer_id = '" + dealer_id + "'";
                                // console.log(updateQuery, 'query')
                                let result = await sql.query(updateQuery)
                                if (result) {
                                    // console.log('outerKey', outerKey)
                                    if (!result.affectedRows) {
                                        let insertQuery = "INSERT INTO prices (dealer_id,dealer_type,price_for, unit_price, price_term, price_expiry) VALUES('" + dealer_id + "' ,'super_admin' , '" + outerKey + "', '" + innerObject[innerKey] + "', '" + unit_price + "', '" + days + "')";
                                        console.log(insertQuery);

                                        let rslt = await sql.query(insertQuery);
                                        if (rslt) {
                                            if (rslt.affectedRows == 0) {
                                                error++;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
                // console.log('errors are ', error)

                if (error == 0) {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PRICES_SET_SUCCESSFULLY], "Prices Set Successfully"), // 'Prices Set Successfully'
                    })
                    return
                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "Some Error Occured"), // 'Some Error Occured'
                    })
                    return
                }

            } else {
                res.send({
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DEALER], "Invalid Dealer"), // 'Invalid Dealer'
                })
                return
            }

        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
            return
        }
    }
}

exports.savePackage = async function (req, res) {
    // console.log('data is', req.body)
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // console.log(verify.user, 'user is the ')
        let data = req.body.data;
        let dealer_id = verify.user.dealer_id;
        // console.log(data);
        if (data) {
            // console.log(data, 'data')
            // let dealer_id = req.body.data.dealer_id;
            if (dealer_id) {
                // console.log(dealer_id, 'whitelableid');

                let checkExistingQ = "SELECT pkg_name FROM packages WHERE pkg_name='" + data.pkgName + "'";
                let checkExisting = await sql.query(checkExistingQ);
                if (checkExisting && checkExisting.length) {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(req.translation[''], "Package Name Already Exist, Please change the Pakcage name"), // 'Invalid Dealer'
                    })
                    return
                } else {
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
exports.saveSaPackage = async function (req, res) {

    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {

        let data = req.body.data;
        if (data) {
            console.log(verify.user[0].dealer_id);
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
            let insertQuery = "INSERT INTO packages (dealer_id , dealer_type , pkg_name, pkg_term, pkg_price, pkg_expiry, pkg_features , dealers) VALUES('" + verify.user[0].dealer_id + "' ,'super_admin' , '" + data.pkgName + "', '" + data.pkgTerm + "', '" + data.pkgPrice + "','" + days + "', '" + pkg_features + "' , '[]')";
            console.log(insertQuery);

            sql.query(insertQuery, async (err, rslt) => {
                if (err) {
                    console.log(err)
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PACKAGE_SAVED_SUCCESSFULLY], "Package Saved Successfully"), // 'Package Saved Successfully',
                    })
                    return
                }
                if (rslt) {
                    if (rslt.affectedRows) {
                        let insertQ = "INSERT INTO dealer_packages_prices ( package_id,dealer_id , created_by , price) VALUES(" + rslt.insertId + ",'" + verify.user[0].dealer_id + "' ,'super_admin' , '" + data.pkgPrice + "')";
                        console.log(insertQ);
                        sql.query(insertQ)
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.PACKAGE_SAVED_SUCCESSFULLY], "Package Saved Successfully"), // 'Package Saved Successfully',
                        })
                        return
                    }
                }
            })

        } else {
            res.send({
                status: false,
                msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_DATA], "Invalid Data"), // 'Invalid Data'
            })
            return
        }
    }
}

exports.deletePackage = async function (req, res) {
    // console.log('data is', req.body)
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let id = req.params.id
        if (id) {
            let query = "UPDATE packages set delete_status = 1 WHERE id = " + id
            sql.query(query, function (err, result) {
                if (err) {
                    res.send({
                        status: false,
                        msg: "Error: Package not deleted. Please try again"
                    })
                    return
                }
                if (result && result.affectedRows > 0) {
                    res.send({
                        status: true,
                        msg: "Package Deleted successfully."
                    })
                    return
                }
                else {
                    res.send({
                        status: false,
                        msg: "Error: Package not deleted. Please try again"
                    })
                    return
                }
            })

        }

    }
}
exports.editPackage = async function (req, res) {
    // console.log('data is', req.body)
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let id = req.params.id
        let price = req.body.price
        let isModify = req.body.isModify
        let user_type = verify.user.user_type
        if (id) {
            let packageQ = "SELECT * FROM packages WHERE id=" + id + " AND delete_status != 1"
            sql.query(packageQ, function (err, result) {
                if (err) {
                    console.log(err);
                    res.send({
                        status: true,
                        msg: "Error: Package did not modify."
                    })
                    return
                }
                if (result && result.length) {
                    if (isModify) {
                        let updatePrice = "UPDATE dealer_packages_prices set price = " + price + " where package_id=" + id + " AND created_by = '" + user_type + "'"
                        // console.log(updatePrice);
                        sql.query(updatePrice, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    status: true,
                                    msg: "Error: Package did not modify."
                                })
                                return
                            }
                            if (result.affectedRows > 0) {
                                res.send({
                                    status: true,
                                    msg: "Package modified successfully."
                                })
                                return
                            } else {
                                let insertQ = "INSERT INTO dealer_packages_prices (package_id,dealer_id,created_by,price) VALUES (" + id + ", " + verify.user.dealer_id + " , '" + user_type + "' , " + price + ") "
                                sql.query(insertQ, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        res.send({
                                            status: false,
                                            msg: "Package did not modify."
                                        })
                                        return
                                    }
                                    if (result.affectedRows) {
                                        res.send({
                                            status: true,
                                            msg: "Package modified successfully."
                                        })
                                        return
                                    }

                                })
                            }
                        })
                    } else {
                        let updatePackage = "UPDATE packages set pkg_price = " + price + " where id=" + id
                        sql.query(updatePackage, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    status: true,
                                    msg: "Error: Package did not modify."
                                })
                                return
                            }
                            if (result && result.affectedRows > 0) {

                                let updatePrice = "UPDATE dealer_packages_prices set price = " + price + " where id=" + id
                                sql.query(updatePrice)
                                res.send({
                                    status: true,
                                    msg: "Package modified successfully."
                                })
                                return
                            }

                        })
                    }
                }
                else {
                    res.send({
                        status: false,
                        msg: "Error: Package not found. Please try again"
                    })
                    return
                }

            })
        }
        else {
            res.send({
                status: false,
                msg: "Error: Package not found. Please try again"
            })
            return
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
                    // console.log('result for get prices are is ', reslt);

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
                        // console.log(data, 'reslt data of prices')
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
            let selectQuery = '';
            if (verify.user.user_type === ADMIN) {
                selectQuery = "SELECT * FROM packages WHERE (delete_status != 1 OR  delete_status IS NULL)  AND (dealer_id='" + dealer_id + "' OR dealer_type = 'super_admin')";
            }
            else if (verify.user.user_type === DEALER) {
                selectQuery = "select dealer_packages_prices.price as pkg_price ,  packages.* from dealer_packages_prices join packages on packages.id = dealer_packages_prices.package_id where dealer_packages_prices.dealer_id = '" + dealer_id + "' OR  dealer_packages_prices.created_by = 'admin' AND packages.delete_status != 1";
            }

            if (selectQuery) {
                sql.query(selectQuery, async (err, reslt) => {
                    if (err) {
                        console.log(err)
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No Data found"), // "Data found",
                            data: []

                        })
                        return
                    }

                    if (reslt) {
                        // console.log('result for get prices are is ', reslt);

                        if (reslt.length) {
                            let packages = [];
                            let dealerCount = 0;
                            let sdealerList = []
                            if (verify.user.user_type !== SDEALER) {
                                if (verify.user.user_type === ADMIN) {
                                    let dealerRoleId = await helpers.getUserTypeIDByName(DEALER);
                                    dealerCount = await helpers.userDealerCount(dealerRoleId);
                                }
                                else if (verify.user.user_type === DEALER) {
                                    sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                                    dealerCount = sdealerList.length;
                                }
                                for (var i = 0; i < reslt.length; i++) {
                                    if (verify.user.user_type === ADMIN) {
                                        if (reslt[i].dealer_type === 'super_admin') {
                                            let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                            if (result && result.length) {
                                                reslt[i].pkg_price = result[0].price
                                            }
                                        }
                                    }
                                    else if (verify.user.user_type === DEALER) {
                                        if (reslt[i].dealer_type === 'super_admin') {
                                            let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND package_id = " + reslt[i].id);
                                            if (result && result.length) {
                                                reslt[i].pkg_price = result[0].price
                                            } else {
                                                let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                                if (result && result.length) {
                                                    reslt[i].pkg_price = result[0].price
                                                }
                                            }
                                        } else if (reslt[i].dealer_type === 'admin') {

                                            let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND package_id = " + reslt[i].id);
                                            if (result && result.length) {
                                                reslt[i].pkg_price = result[0].price
                                            }
                                        }
                                    }
                                    // console.log('push apps', reslt[i].push_apps)
                                    let permissions = (reslt[i].dealers !== undefined && reslt[i].dealers !== null) ? JSON.parse(reslt[i].dealers) : [];
                                    let permissionCount = 0
                                    if (verify.user.user_type === DEALER) {
                                        permissions = permissions.filter(function (item) {
                                            for (let i = 0; i < sdealerList.length; i++) {
                                                if (item === sdealerList[i].dealer_id) {
                                                    return item
                                                }
                                            }
                                        })
                                    }
                                    permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                                    let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                                    // console.log(permissionC);
                                    console.log(dealerCount, permissionCount, permissionC);
                                    reslt[i].dealer_permission = permissions;
                                    reslt[i].permission_count = permissionC;
                                    // packages.push(dta);
                                }
                            }
                            // console.log(reslt, 'reslt data of prices')
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                                data: reslt

                            })
                            return
                        }
                    } else {
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: []

                        })
                        return
                    }
                })
            }
            else {
                res.send({
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                    data: []

                })
                return
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

exports.getDevicesTest = async function (req, res) {
    var verify = req.decoded;
    if (verify) {

        let start = req.query.limit == 'all' ? 0 : parseInt(req.query.start) || 0;
        let limit = req.query.limit == 'all' ? 10^34 : parseInt(req.query.limit) || 10;
        let filter = req.query.filter && req.query.filter !== '' ? "where online="+`${req.query.filter}`+" " : '';

        let query = "Select * from devices "+filter+" limit " + start +", " +limit;
        console.log(query)
        sql.query(query, (err, result) => {
            if (err) throw err;
            else if (result && result.length) {
                console.log(result.length, 'result is')
                res.send({
                    status: true,
                    msg: 'success',
                    data: result

                })
            } else {
                res.send({
                    status: false,
                    msg: 'Data not found',
                    data: []

                })
            }
        })
    }
}


exports.getParentPackages = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        let selectQuery = ""
        // console.log(verify.user);
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            selectQuery = "select packages.* from dealer_packages join packages on packages.id = dealer_packages.package_id where dealer_packages.dealer_id = ' " + dealer_id + "' AND packages.delete_status != 1";
            sql.query(selectQuery, async (err, reslt) => {
                if (err) {
                    console.log(err)
                }
                if (reslt.length) {

                    for (let i = 0; i < reslt.length; i++) {
                        if (verify.user.user_type === DEALER) {
                            if (reslt[i].dealer_type === 'super_admin') {
                                let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                if (result && result.length) {
                                    reslt[i].pkg_price = result[0].price
                                }
                            }
                        }
                        else if (verify.user.user_type === SDEALER) {
                            if (reslt[i].dealer_type === 'super_admin' || reslt[i].dealer_type === 'admin') {
                                let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'dealer' AND package_id = " + reslt[i].id);
                                if (result && result.length) {
                                    reslt[i].pkg_price = result[0].price
                                } else {
                                    let result = await sql.query("SELECT * from dealer_packages_prices WHERE created_by = 'admin' AND package_id = " + reslt[i].id);
                                    if (result && result.length) {
                                        reslt[i].pkg_price = result[0].price
                                    }
                                }
                            }
                        }
                    }
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                        data: reslt
                    })
                }
                else {
                    res.send({
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "Data not found"), // "Data found",
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

exports.getProductPrices = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);

    if (verify) {
        // console.log(verify.user);
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            if (verify.user.user_type === DEALER) {

                let selectQuery = "SELECT * FROM prices WHERE dealer_type='admin'";
                sql.query(selectQuery, async (err, reslt) => {
                    // console.log(reslt.length);
                    if (err) {
                        console.log(err)
                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: []
                        })
                        return

                    }

                    if (reslt.length) {
                        // console.log(reslt);
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: reslt

                        })
                    } else {

                        res.send({
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DETAIL_FOUND], "No detail found"), // "Data found",
                            data: []
                        })
                    }
                })

            }
            else if (verify.user.user_type === SDEALER) {

                let selectQuery = "SELECT * FROM prices WHERE dealer_type='dealer' AND dealer_id= " + verify.user.connected_dealer;
                sql.query(selectQuery, async (err, reslt) => {
                    if (err) {
                        console.log(err)
                    }

                    if (reslt.length) {
                        res.send({
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.DATA_FOUND], "Data found"), // "Data found",
                            data: reslt

                        })
                    } else {
                        res.send({
                            status: false,
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

            let checkExistingQ = "SELECT pkg_name FROM packages WHERE pkg_name='" + name + "' AND delete_status != 1";

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
            query = `SELECT credits from financial_account_balance where dealer_id= ${verify.user.id}`

            sql.query(query, async function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result && result.length) {
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