const { sql } = require('../../config/database');

const helpers = require('../../helper/general_helper');
const constants = require('../../constants/Application');
var app_constants = require('../../config/constants');
const device_helpers = require("../../helper/device_helpers");
var axios = require('axios');
var moment = require('moment')
var MsgConstants = require("../../constants/MsgConstants");
var path = require("path");

const { createInvoice } = require('../../helper/CreateInvoice')
const { sendEmail } = require("../../lib/email");

// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";


let data;

exports.createServiceProduct = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let auto_generated = req.body.auto_generated
        let product_data = req.body.product_data
        let type = req.body.type
        if (type && product_data) {
            if (type === 'pgp_email' && !auto_generated) {
                let pgp_email = product_data.username + '@' + product_data.domain
                console.log(pgp_email);
                if (helpers.validateEmail(pgp_email)) {
                    let checkExisted = await sql.query(`SELECT * FROM pgp_emails WHERE pgp_email = '${pgp_email}'`)
                    if (checkExisted && checkExisted.length) {
                        res.send({
                            status: false,
                            msg: "ERROR: Username not available.Please choose another username."
                        })
                        return
                    }
                    product_data.pgp_email = pgp_email
                } else {
                    res.send({
                        status: false,
                        msg: "ERROR: Invalid pgp email."
                    })
                    return
                }
            }

            axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                if (response.data.status) {
                    let data = {
                        auto_generated,
                        product_data,
                        type,
                        label: app_constants.APP_TITLE,
                        uploaded_by: verify.user.user_type,
                        uploaded_by_id: verify.user.id,
                    }
                    axios.post(app_constants.CREATE_SERVICE_PRODUCT, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                        if (response.data.status) {
                            let query = ''
                            let getQuery = ''
                            if (type === 'pgp_email') {
                                query = `INSERT INTO pgp_emails (pgp_email , uploaded_by , uploaded_by_id , domain_id) VALUES ('${response.data.product}' , '${verify.user.user_type}' , '${verify.user.id}' , ${product_data.domain_id})`
                                getQuery = `SELECT * FROM pgp_emails WHERE id = `
                            }
                            else if (type === 'chat_id') {
                                query = `INSERT INTO chat_ids (chat_id , uploaded_by , uploaded_by_id) VALUES ('${response.data.product}' , '${verify.user.user_type}' , '${verify.user.id}')`
                                getQuery = `SELECT * FROM chat_ids WHERE id = `
                            }
                            else if (type === 'sim_id') {
                                query = `INSERT INTO sim_ids (sim_id , uploaded_by , uploaded_by_id) VALUES ('${response.data.product}' , '${verify.user.user_type}' , '${verify.user.id}')`
                            }
                            else {
                                res.send({
                                    status: false,
                                    msg: "ERROR: Invalid Request"
                                })
                                return
                            }
                            sql.query(query, async function (err, results) {
                                if (err) {
                                    console.log(err);
                                    res.send({
                                        status: false,
                                        msg: "ERROR: Internal Server Error. Please Try again."
                                    })
                                    return
                                }
                                if (results && results.insertId) {
                                    let insertData = await sql.query(getQuery + results.insertId)
                                    res.send({
                                        status: true,
                                        msg: "Product has been created Successfully.",
                                        product: insertData[0]
                                    })
                                    return
                                } else {
                                    res.send({
                                        status: false,
                                        msg: "Product not created. Please Try again."
                                    })
                                    return
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
                            msg: "ERROR: Superadmin server not responding please try again later."
                        })
                        return
                    })
                }
            }).catch((err) => {
                console.log(err);
                res.send({
                    status: false,
                    msg: "ERROR: Superadmin server not responding please try again later."
                })
                return
            })
        }
        else {
            res.send({
                status: false,
                msg: "ERROR: Information not provided."
            })
            return
        }

    }

}

exports.generateRandomUsername = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
            console.log(response.data.status);
            if (response.data.status) {
                let data = {
                    label: app_constants.APP_TITLE
                }
                axios.post(app_constants.GENERATE_RANDOM_PGP, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                    if (response.data.status) {
                        res.send({
                            status: true,
                            username: response.data.username
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
                        msg: "ERROR: Superadmin server not responding please try again later."
                    })
                    return
                })
            }
        }).catch((err) => {
            console.log(err);
            res.send({
                status: false,
                msg: "ERROR: Superadmin server not responding please try again later."
            })
            return
        })
    }

}

exports.checkUniquePgp = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let pgp_email = req.body.pgp_email
        if (helpers.validateEmail(pgp_email)) {
            let checkExisted = await sql.query(`SELECT * FROM pgp_emails WHERE pgp_email = '${pgp_email}'`)
            if (checkExisted && checkExisted.length) {
                res.send({
                    status: false,
                    msg: "ERROR: Username not available"
                })
                return
            } else {
                axios.post(app_constants.SUPERADMIN_LOGIN_URL, app_constants.SUPERADMIN_USER_CREDENTIALS, { headers: {} }).then((response) => {
                    if (response.data.status) {
                        let data = {
                            label: app_constants.APP_TITLE,
                            pgp_email,
                        }
                        axios.post(app_constants.CHECK_UNIQUE_PGP, data, { headers: { authorization: response.data.user.token } }).then(async function (response) {
                            if (response.data.status) {
                                res.send({
                                    status: true,
                                    available: response.data.available
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
                msg: "ERROR: Invalid pgp email."
            })
            return
        }
    }

}

exports.validateSimId = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let sim_id = req.body.sim_id
        let user_acc_id = req.body.user_acc_id ? req.body.user_acc_id : null
        if (sim_id) {
            if (sim_id.length < 19 || sim_id.length > 20) {
                res.send({
                    status: false,
                    msg: "ERROR: ICCID MUST BE 19 OR 20 DIGITS LONG"
                })
                return
            } else {
                let selectSimQ = `SELECT * FROM sim_ids WHERE sim_id = '${sim_id}' AND delete_status = '0' AND user_acc_id  !=${user_acc_id}`
                console.log(selectSimQ);
                let simFound = await sql.query(selectSimQ)
                if (simFound && simFound.length) {
                    console.log("sdasd");
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
                            res.send(response.data)
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
        } else {
            res.send({
                status: false,
                msg: "ERROR: Invalid Sim ID."
            })
            return
        }
    }

}

exports.changeDataLimitsPlans = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        if (req.body.usr_device_id) {
            console.log(req.body);
            let device_id = req.body.device_id;
            let loggedDealerId = verify.user.id;
            let loggedDealerType = verify.user.user_type;
            let user_acc_id = req.body.usr_acc_id
            let usr_device_id = req.body.usr_device_id;
            let user_id = req.body.user_id
            var date_now = moment(new Date()).format('YYYY/MM/DD')
            let pay_now = req.body.pay_now
            let data_plan_package_id = req.body.data_plan_package_id
            let sim_type = req.body.sim_type
            let endUser_pay_status = req.body.paid_by_user

            var checkDevice =
                "SELECT start_date ,expiry_date from usr_acc WHERE device_id = '" +
                usr_device_id +
                "'";
            if (loggedDealerType === constants.SDEALER) {
                checkDevice =
                    checkDevice + " AND dealer_id = " + loggedDealerId;
            } else if (loggedDealerType === constants.DEALER) {
                checkDevice =
                    checkDevice +
                    " AND (dealer_id = " +
                    loggedDealerId +
                    " OR prnt_dlr_id = " +
                    loggedDealerId +
                    " )";
            } else if (loggedDealerType === constants.ADMIN) {
                checkDevice = checkDevice;
            } else {
                res.send({
                    status: false,
                    msg: ""
                });
                return;
            }

            sql.query(checkDevice, async function (error, rows) {
                if (error) {
                    res.send({
                        status: false,
                        msg: "ERROR: Internal Server error."
                    })
                    return
                }
                if (rows.length) {
                    sql.query(`SELECT * FROM packages WHERE id = ${data_plan_package_id} AND package_type = 'data_plan'`, async function (err, data_plan_res) {
                        if (err) {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(
                                    req.translation[""],
                                    "ERROR: Internal Server Error."
                                )
                            });
                            return
                        }
                        if (data_plan_res && data_plan_res.length) {
                            let data_plan = data_plan_res[0]
                            let package_price = data_plan.pkg_price
                            let discounted_price = package_price
                            let invoice_subtotal = package_price
                            if (pay_now) {
                                discount = Math.ceil(((package_price) * 0.03));
                                discounted_price = (package_price) - discount
                            }
                            let invoice_status = pay_now ? "PAID" : "UNPAID"
                            let paid_credits = 0

                            let dealer_credits_data = await sql.query(`SELECT * FROM financial_account_balance WHERE dealer_id = ${verify.user.id}`)
                            if (dealer_credits_data && dealer_credits_data.length || loggedDealerType === 'admin') {
                                let dealer_credits = dealer_credits_data[0]
                                let dealer_credits_copy = dealer_credits
                                if (dealer_credits >= package_price || !pay_now || loggedDealerType === 'admin') {
                                    if (!pay_now && dealer_credits.credits_limit > (dealer_credits.credits - package_price && loggedDealerType !== 'admin')) {
                                        res.send({
                                            status: false,
                                            msg: "Error: Your Credits limits will exceed after apply this service. Please select other services OR Purchase Credits."
                                        });
                                        return
                                    }
                                    let service_data_result = await device_helpers.getServicesData(user_acc_id);
                                    if (service_data_result && service_data_result.length) {
                                        let activeService = service_data_result.filter(service => service.status == 'active' || service.status == 'request_for_cancel')
                                        if (activeService && activeService.length) {
                                            let service = activeService[0]
                                            let service_id = service.id
                                            if (loggedDealerType !== 'admin') {
                                                var transection_status = 'transferred'
                                                if (!pay_now) {
                                                    transection_status = 'pending'
                                                } else {
                                                    package_price = package_price - Math.ceil(Number(package_price * 0.03))
                                                }

                                                if (pay_now) {
                                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${verify.user.id},${user_acc_id} ,'${JSON.stringify({ user_acc_id: user_acc_id, description: "Data Plan Changed", service_id: service_id })}', ${package_price} ,'credit' , '${transection_status}' , 'services' , ${package_price} , ${0})`
                                                    await sql.query(transection_credits)
                                                }
                                                else {
                                                    let transection_due_credits = package_price;
                                                    if (dealer_credits_copy > 0) {
                                                        transection_due_credits = package_price - dealer_credits_copy
                                                        paid_credits = dealer_credits_copy
                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${package_price} ,'credit' , '${transection_status}' , 'services' , ${paid_credits} , ${transection_due_credits})`
                                                        await sql.query(transection_credits)
                                                        invoice_status = "PARTIALLY PAID"
                                                    } else {
                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${dealer_id},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${package_price} ,'credit' , 'pending' , 'services' , 0 ,${package_price})`
                                                        await sql.query(transection_credits)
                                                    }
                                                }
                                                await sql.query(`UPDATE financial_account_balance SET credits = credits - ${package_price} WHERE dealer_id = ${loggedDealerId}`)
                                            }


                                            let insertDataPlan = ''

                                            let currentDataPlan = await sql.query(`SELECT * FROM sim_data_plans WHERE service_id = ${service_id} AND sim_type = '${sim_type}' AND status = 'active'`)
                                            if (currentDataPlan && currentDataPlan.length) {
                                                let updateCurrentPlan = `UPDATE sim_data_plans SET status = 'deleted' , end_date = '${date_now}' WHERE id= ${currentDataPlan[0].id}`
                                                let updatedPlan = await sql.query(updateCurrentPlan)
                                                if (updatedPlan && updatedPlan.affectedRows) {
                                                    insertDataPlan = `INSERT INTO sim_data_plans (service_id , data_plan_package , sim_type , total_data , used_data , start_date ) VALUES(${service_id} , '${JSON.stringify(data_plan)}' , '${sim_type}' , ${data_plan.data_limit} , '${currentDataPlan[0].used_data}' ,'${date_now}')`
                                                }
                                            } else {
                                                insertDataPlan = `INSERT INTO sim_data_plans (service_id , data_plan_package , sim_type , total_data , start_date ) VALUES(${service_id} , '${JSON.stringify(data_plan)}' , '${sim_type}' , ${data_plan.data_limit}  ,'${date_now}')`
                                            }


                                            await sql.query(insertDataPlan)
                                            if (loggedDealerType !== ADMIN) {
                                                let inv_no = await helpers.getInvoiceId()
                                                const invoice = {
                                                    shipping: {
                                                        name: verify.user.dealer_name,
                                                        device_id: device_id,
                                                        dealer_pin: verify.user.link_code,
                                                        user_id: user_id
                                                    },
                                                    packages: [data_plan],
                                                    hardwares: [],
                                                    products: [],
                                                    pay_now: pay_now,
                                                    discount: discount,
                                                    discountPercent: "3%",
                                                    quantity: 1,
                                                    subtotal: invoice_subtotal,
                                                    paid: discounted_price,
                                                    invoice_nr: inv_no,
                                                    invoice_status: invoice_status,
                                                    paid_credits: paid_credits
                                                };

                                                let fileName = "invoice-" + inv_no + ".pdf"
                                                let filePath = path.join(__dirname, "../../uploads/" + fileName)
                                                await createInvoice(invoice, filePath)

                                                let attachment = {
                                                    fileName: fileName,
                                                    file: filePath
                                                }
                                                // console.log(verify.user.dealer_email)
                                                sql.query(`INSERT INTO invoices (inv_no,user_acc_id,dealer_id,file_name ,end_user_payment_status) VALUES('${inv_no}',${user_acc_id},${loggedDealerId}, '${fileName}' , '${endUser_pay_status}')`)

                                                html = 'Your data plan has been updated of ' + device_id + '.<br>Your Invoice is attached below. <br>';

                                                sendEmail("CHNAGE DATA PLAN.", html, verify.user.dealer_email, null, attachment);
                                            }
                                            let updatedCredits = await sql.query(`SELECT * FROM financial_account_balance WHERE dealer_id = ${loggedDealerId}`)
                                            res.send({
                                                status: true,
                                                msg: await helpers.convertToLang(
                                                    req.translation[""],
                                                    "Data Plan added successfully."
                                                ),
                                                credits: updatedCredits[0] ? updatedCredits[0].credits : 0
                                            });
                                            return
                                        } else {
                                            res.send({
                                                status: false,
                                                msg: await helpers.convertToLang(
                                                    req.translation[""],
                                                    "Active Service not found on this device. Please add a service first on this device."
                                                )
                                            });
                                            return
                                        }
                                    } else {

                                        res.send({
                                            status: false,
                                            msg: await helpers.convertToLang(
                                                req.translation[""],
                                                "Services not found on this device. Please add a service first on this device."
                                            )
                                        });
                                        return

                                    }

                                } else {
                                    res.send({
                                        status: false,
                                        msg: await helpers.convertToLang(
                                            req.translation[""],
                                            "ERROR: Dealer Credits are not enough. Please Choose another Data Plan or Purchase Credits."
                                        )
                                    });
                                    return
                                }
                            } else {
                                res.send({
                                    status: false,
                                    msg: await helpers.convertToLang(
                                        req.translation[""],
                                        "ERROR: Dealer Balance Account not Found."
                                    )
                                });
                                return
                            }

                        } else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(
                                    req.translation[""],
                                    "ERROR: Data plan not found on server. Please Choose another plan."
                                )
                            });
                            return
                        }
                    })
                    if (loggedDealerType === constants.ADMIN) {
                        // let response = await device_helpers.editDeviceAdmin(req.body, verify)
                        // res.send(response)
                        // return
                    } else {

                    }


                } else {
                    res.send({
                        status: false,
                        msg: await helpers.convertToLang(
                            req.translation[MsgConstants.DEVICE_NOT_FOUND],
                            "No Device found"
                        )
                    });
                }
            });
        }
    } else {
        res.send({
            status: false,
            msg: ""
        });
    }

}
