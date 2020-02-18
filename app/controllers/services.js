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

let usr_acc_query_text = constants.usr_acc_query_text; //"usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status, usr_acc.transfer_user_status, usr_acc.transfered_from,usr_acc.transfered_to, usr_acc.user_transfered_from, usr_acc.user_transfered_to,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"

let data;

exports.createServiceProduct = async function (req, res) {
    var verify = req.decoded;
    try {
        let auto_generated = req.body.auto_generated
        let product_data = req.body.product_data
        let user_acc_id = req.body.user_acc_id ? req.body.user_acc_id : null
        let dealer_id = req.body.dealer_id ? req.body.dealer_id : null
        let type = req.body.type
        if (type && product_data) {
            let usr_acc = await sql.query(`SELECT pgp_remaining_limit FROM usr_acc WHERE id = '${user_acc_id}'`)
            if (usr_acc && usr_acc.length) {
                if (usr_acc[0].pgp_remaining_limit < 1) {
                    return res.send({
                        status: false,
                        msg: "ERROR: You are not allowed to create new PGP EMAIL. Your Max limit has been exeeded to create PGP EMAILS on this device."
                    })
                }
            }
            if (type === 'pgp_email' && !auto_generated) {
                let pgp_email = product_data.username + '@' + product_data.domain
                // console.log(pgp_email);
                if (helpers.validateEmail(pgp_email)) {
                    let checkExisted = await sql.query(`SELECT * FROM pgp_emails WHERE pgp_email = '${pgp_email}'`)
                    if (checkExisted && checkExisted.length) {
                        return res.send({
                            status: false,
                            msg: "ERROR: Username not available.Please choose another username."
                        })
                    }
                    product_data.pgp_email = pgp_email
                } else {
                    return res.send({
                        status: false,
                        msg: "ERROR: Invalid pgp email."
                    })
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
                                query = `INSERT INTO pgp_emails (pgp_email , uploaded_by , uploaded_by_id , domain_id , user_acc_id , dealer_id) VALUES ('${response.data.product.toLowerCase()}' , '${verify.user.user_type}' , '${verify.user.id}' , '${product_data.domain_id}', '${user_acc_id}' , '${dealer_id}')`
                                getQuery = `SELECT * FROM pgp_emails WHERE id = `
                                sql.query(`UPDATE usr_acc SET pgp_remaining_limit = pgp_remaining_limit - 1 WHERE id ='${user_acc_id}'`)
                            }
                            else if (type === 'chat_id') {
                                query = `INSERT INTO chat_ids (chat_id , uploaded_by , uploaded_by_id , user_acc_id , dealer_id) VALUES ('${response.data.product}' , '${verify.user.user_type}' , '${verify.user.id}', '${user_acc_id}' , '${dealer_id}')`
                                getQuery = `SELECT * FROM chat_ids WHERE id = `
                            }
                            else if (type === 'sim_id') {
                                query = `INSERT INTO sim_ids (sim_id , uploaded_by , uploaded_by_id , user_acc_id , dealer_id) VALUES ('${response.data.product}' , '${verify.user.user_type}' , '${verify.user.id}', '${user_acc_id}' , '${dealer_id}')`
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

    } catch(err){
        return res.send({
            status: false,
            msg: "ERROR: request failed."
        })
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
    if (req.body.pgp_email) {
        let pgp_email = req.body.pgp_email
        if (helpers.validateEmail(pgp_email)) {
            console.log('pgp_email.toUpperCase(): ', pgp_email.toLowerCase());
            let checkExistingEmailQuery = `SELECT * FROM pgp_emails WHERE LOWER(pgp_email) = '${pgp_email.toLowerCase()}'`;
            console.log('checkExistingEmailQuery:', checkExistingEmailQuery);
            let checkExisted = await sql.query(checkExistingEmailQuery)
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
    } else {
        return res.send({
            status: false,
            msg: 'Error: data not provided'
        });
    }

}

exports.validateSimId = async function (req, res) {
    var verify = req.decoded;
    if (req.body.sim_id) {
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
    } else {
        return res.send({
            status: false,
            msg: 'Error: data not provided'
        })
    }

}

exports.addDataLimitsPlans = async function (req, res) {
    console.log('addDataLimitsPlans', req.body);
    var verify = req.decoded;
    try {
        if (req.body.usr_device_id) {
            // console.log(req.body);
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
                    sql.query(`SELECT * FROM packages WHERE id = '${data_plan_package_id}' AND package_type = 'data_plan'`, async function (err, data_plan_res) {
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

                            let dealer_credits_data = await sql.query(`SELECT * FROM financial_account_balance WHERE dealer_id = '${verify.user.id}'`)
                            if (dealer_credits_data && dealer_credits_data.length || loggedDealerType === constants.ADMIN) {
                                let dealer_credits = dealer_credits_data[0]
                                let dealer_credits_copy = dealer_credits
                                if (dealer_credits >= package_price || !pay_now || loggedDealerType === constants.ADMIN) {
                                    if (!pay_now && dealer_credits.credits_limit > (dealer_credits.credits - package_price && loggedDealerType !== constants.ADMIN)) {
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
                                            if (loggedDealerType !== constants.ADMIN) {
                                                var transection_status = 'transferred'
                                                if (!pay_now) {
                                                    transection_status = 'pending'
                                                } else {
                                                    package_price = package_price - Math.ceil(Number(package_price * 0.03))
                                                }

                                                if (pay_now) {
                                                    let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES ('${verify.user.id}','${user_acc_id}' ,'${JSON.stringify({ user_acc_id: user_acc_id, description: "Data Plan Changed", service_id: service_id })}', ${package_price} ,'credit' , '${transection_status}' , 'services' , ${package_price} , ${0})`
                                                    let fat_id = await sql.query(transection_credits);
                                                    if(!fat_id || !fat_id.insertId){
                                                        return res.send({
                                                            status: false,
                                                            msg: 'Error: Internel Server Error'
                                                        });
                                                    }
                                                }
                                                else {
                                                    let transection_due_credits = package_price;
                                                    if (dealer_credits_copy > 0) {
                                                        transection_due_credits = package_price - dealer_credits_copy
                                                        paid_credits = dealer_credits_copy
                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${loggedDealerId},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${package_price} ,'credit' , '${transection_status}' , 'services' , ${paid_credits} , ${transection_due_credits})`
                                                        let fat_id2 = await sql.query(transection_credits);
                                                        if(!fat_id2 || !fat_id2.insertId){
                                                            return res.send({
                                                                status: false,
                                                                msg: 'Error: Internel Server Error'
                                                            });
                                                        }
                                                        invoice_status = "PARTIALLY PAID"
                                                    } else {
                                                        let transection_credits = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type , status , type ,paid_credits , due_credits) VALUES (${loggedDealerId},${usr_acc_id} ,'${JSON.stringify({ user_acc_id: usr_acc_id, service_id: service_id })}' ,${package_price} ,'credit' , 'pending' , 'services' , 0 ,${package_price})`
                                                        let fat_id3 = await sql.query(transection_credits);
                                                        if(!fat_id3 || !fat_id3.insertId){
                                                            return res.send({
                                                                status: false,
                                                                msg: 'Error: Internel Server Error'
                                                            });
                                                        }
                                                    }
                                                }
                                                let fab_id4 = await sql.query(`UPDATE financial_account_balance SET credits = credits - ${package_price} WHERE dealer_id = ${loggedDealerId}`);
                                                if(!fab_id4 || !fab_id4.affectedRows){
                                                    return res.send({
                                                        status: false,
                                                        msg: 'Error: Internel Server Error'
                                                    });
                                                }
                                            }


                                            let updateDataPlan = ''
                                            data_plan.added_date = date_now
                                            let currentDataPlan = await sql.query(`SELECT * FROM sim_data_plans WHERE service_id = ${service_id} AND sim_type = '${sim_type}' AND status = 'active'`)
                                            if (currentDataPlan && currentDataPlan.length) {

                                                let data_limit = Number(currentDataPlan[0].total_data) + Number(data_plan.data_limit)
                                                let total_price = Number(currentDataPlan[0].total_price) + Number(data_plan.pkg_price)
                                                let data_plan_packages = JSON.parse(currentDataPlan[0].data_plan_package)
                                                data_plan_packages.push(data_plan)
                                                updateDataPlan = `UPDATE sim_data_plans SET total_data = ${data_limit} , total_price = ${total_price} , data_plan_package = '${JSON.stringify(data_plan_packages)}' WHERE id= ${currentDataPlan[0].id}`
                                                // let updatedPlan = await sql.query(updateCurrentPlan)
                                                // if (updatedPlan && updatedPlan.affectedRows) {
                                                //     updateDataPlan = `INSERT INTO sim_data_plans (service_id , data_plan_package , sim_type , total_data , used_data , start_date ) VALUES(${service_id} , '${JSON.stringify(data_plan)}' , '${sim_type}' , ${data_plan.data_limit} , '${currentDataPlan[0].used_data}' ,'${date_now}')`
                                                // }
                                            } else {
                                                updateDataPlan = `INSERT INTO sim_data_plans (service_id , data_plan_package , sim_type , total_data , start_date ) VALUES(${service_id} , '${JSON.stringify([data_plan])}' , '${sim_type}' , ${data_plan.data_limit}  ,'${date_now}')`
                                            }

                                            let sdp = await sql.query(updateDataPlan);
                                            if(!(sdp && (sdp.insertId || sdp.affectedRows))){
                                                return res.send({
                                                    status: false,
                                                    msg: 'Error: Internel Server Error'
                                                });
                                            }
                                            let activeServicesPackages = JSON.parse(service.packages)
                                            activeServicesPackages.push(data_plan)
                                            let sd = await sql.query(`UPDATE services_data SET packages = '${JSON.stringify(activeServicesPackages)}' WHERE id = ${service_id}`);
                                            if(!sd || !sd.affectedRows){
                                                return res.send({
                                                    status: false,
                                                    msg: 'Error Internel Server Error'
                                                });
                                            }
                                            if (loggedDealerType !== constants.ADMIN) {
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
                                                let invoice_id = await sql.query(`INSERT INTO invoices (inv_no,user_acc_id,dealer_id,file_name ,end_user_payment_status) VALUES('${inv_no}','${user_acc_id}','${loggedDealerId}', '${fileName}' , '${endUser_pay_status}')`);
                                                if(!invoice_id || !invoice_id.insertId){
                                                    return res.send({
                                                        status: false,
                                                        msg: 'Error: Internel Server Error'
                                                    });
                                                }

                                                html = 'Your data plan has been updated on device with device ID : ' + device_id + '.<br>Your Invoice is attached below. <br>';

                                                sendEmail("DATA PLAN ADDED.", html, verify.user.dealer_email, null, attachment);
                                            }
                                            let updatedCredits = await sql.query(`SELECT * FROM financial_account_balance WHERE dealer_id = ${loggedDealerId}`)
                                            var slctquery =
                                                "select devices.*  ," +
                                                usr_acc_query_text +
                                                ", dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id where devices.id = '" +
                                                usr_device_id +
                                                "'";
                                            // console.log(slctquery);
                                            rsltq = await sql.query(slctquery);

                                            // let pgp_emails = await device_helpers.getPgpEmails(rsltq[0].id);
                                            // let sim_ids = await device_helpers.getSimids(rsltq[0].id);
                                            // let chat_ids = await device_helpers.getChatids(rsltq[0].id);
                                            let servicesData = await device_helpers.getServicesData(rsltq[0].id);
                                            let servicesIds = servicesData.map(item => { return item.id })
                                            let userAccServiceData = []
                                            let dataPlans = []
                                            if (servicesIds.length) {
                                                userAccServiceData = await device_helpers.getUserAccServicesData(rsltq[0].id, servicesIds)
                                                dataPlans = await device_helpers.getDataPlans(servicesIds)
                                            }

                                            if (rsltq.length) {
                                                rsltq[0].sim_id = "N/A"
                                                rsltq[0].sim_id2 = "N/A"
                                                rsltq[0].pgp_email = "N/A"
                                                rsltq[0].chat_id = "N/A"
                                                rsltq[0].finalStatus = device_helpers.checkStatus(rsltq[0]);
                                                // if (pgp_emails[0] && pgp_emails[0].pgp_email) {
                                                //     rsltq[0].pgp_email = pgp_emails[0].pgp_email
                                                // } else {
                                                //     rsltq[0].pgp_email = "N/A"
                                                // }
                                                // if (sim_ids && sim_ids.length) {
                                                //     rsltq[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
                                                //     rsltq[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
                                                // }
                                                // if (chat_ids[0] && chat_ids[0].chat_id) {
                                                //     rsltq[0].chat_id = chat_ids[0].chat_id
                                                // }
                                                // else {
                                                //     rsltq[0].chat_id = "N/A"
                                                // }

                                                let services = servicesData;
                                                let service_id = null
                                                if (services && services.length) {
                                                    services.map((item) => {
                                                        if (item.status === 'extended') {
                                                            rsltq[0].extended_services = item
                                                        } else {
                                                            rsltq[0].services = item
                                                            service_id = item.id
                                                        }
                                                    })
                                                }

                                                let productsData = userAccServiceData.filter(item => item.user_acc_id === rsltq[0].id && item.service_id === service_id);
                                                if (productsData && productsData.length) {
                                                    productsData.map((item) => {
                                                        if (item.type === 'sim_id') {
                                                            rsltq[0].sim_id = item.product_value
                                                        }
                                                        else if (item.type === 'sim_id2') {
                                                            rsltq[0].sim_id2 = item.product_value
                                                        }
                                                        else if (item.type === 'pgp_email') {
                                                            rsltq[0].pgp_email = item.product_value
                                                        }
                                                        else if (item.type === 'chat_id') {
                                                            rsltq[0].chat_id = item.product_value
                                                        }
                                                    })
                                                }
                                                // if (servicesData[0]) {
                                                //     rsltq[0].services = servicesData[0]
                                                // }
                                                let sim_id_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id')
                                                rsltq[0].sim_id_data_plan = sim_id_data_plan[0]
                                                let sim_id2_data_plan = dataPlans.filter((item) => item.sim_type == 'sim_id2')
                                                rsltq[0].sim_id2_data_plan = sim_id2_data_plan[0]

                                                if (rsltq[0].expiry_date !== null) {
                                                    let startDate = moment(new Date())
                                                    let expiray_date = new Date(rsltq[0].expiry_date)
                                                    let endDate = moment(expiray_date)
                                                    remainTermDays = endDate.diff(startDate, 'days')
                                                    rsltq[0].remainTermDays = remainTermDays
                                                }
                                            }

                                            res.send({
                                                status: true,
                                                msg: await helpers.convertToLang(
                                                    req.translation[""],
                                                    "Data Plan added successfully."
                                                ),
                                                credits: updatedCredits[0] ? updatedCredits[0].credits : 0,
                                                data: rsltq[0]
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
    } catch (err) {
        res.send({
            status: false,
            msg: "Error: Internel Server Error"
        });
    }

}

exports.resetPgpLimit = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let usr_acc_id = req.body.user_acc_id
        if (usr_acc_id && verify.user.user_type === constants.ADMIN) {
            // console.log(req.body);

            var checkDevice =
                "SELECT * from usr_acc WHERE id = '" +
                usr_acc_id +
                "'";

            sql.query(checkDevice, async function (error, rows) {
                if (error) {
                    res.send({
                        status: false,
                        msg: "ERROR: Internal Server error."
                    })
                    return
                }
                if (rows.length) {
                    let resetPgpLimitQ = `UPDATE usr_acc SET pgp_remaining_limit = 10 WHERE id = '${usr_acc_id}'`
                    sql.query(resetPgpLimitQ, async function (err, results) {
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
                        // console.log(results);
                        if (results && results.affectedRows > 0) {
                            res.send({
                                status: true,
                                msg: await helpers.convertToLang(
                                    req.translation[""],
                                    "Pgp Email Limit has been reset successfully."
                                )
                            });
                            return
                        }
                        else {
                            res.send({
                                status: false,
                                msg: await helpers.convertToLang(
                                    req.translation[""],
                                    "ERROR: Pgp Email Limit not Updated. Please try again."
                                )
                            });
                            return
                        }
                    })
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
        } else {
            res.send({
                status: false,
                msg: "ERROR: Unauthorized Access."
            });
            return
        }
    } else {
        res.send({
            status: false,
            msg: ""
        });
    }

}
