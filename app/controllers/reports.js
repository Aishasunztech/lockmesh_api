const Constants = require('../../constants/Application');
const generalHelper = require('../../helper/general_helper');
const moment = require('moment');
const { sql } = require("../../config/database");

let productData = {};
let invoiceData = {};
let hardwareData = {};
let paymentHistoryData = {};
let salesData = [];

exports.generateProductReport = async function (req, res) {
    let verify = req.decoded;

    if (verify) {

        let user_type = verify.user.user_type;
        let product = req.body.product;
        let type = req.body.type;
        let dealer = req.body.dealer;
        let from = req.body.from;
        let to = req.body.to;
        let device = req.body.device;


        let condition = '';

        let response = {
            status: false,
        };

        if (type && type === 'USED') {
            condition += ' AND parentTable.used = 1'
        } else if (type && type === 'UNUSED') {
            condition += ' AND parentTable.used = 0'
        }

        if (dealer === '' && user_type === Constants.DEALER) {
            let sDealerIds = await generalHelper.getSdealersByDealerId(verify.user.id);
            if (sDealerIds.length > 0) {
                condition += ' AND parentTable.dealer_id IN (' + verify.user.id + ',' + sDealerIds.join(',') + ')'
            } else {
                condition += ' AND parentTable.dealer_id = ' + verify.user.id
            }
        } else if (dealer) {
            condition += ' AND parentTable.dealer_id = ' + dealer
        }

        if (from) {
            condition += ' AND DATE(parentTable.created_at) >= "' + moment(from).format('YYYY-MM-DD') + '"'
        }

        if (to) {
            condition += ' AND DATE(parentTable.created_at) <= "' + moment(to).format('YYYY-MM-DD') + '"'
        }

        if (device === Constants.DEVICE_PRE_ACTIVATION) {
            condition += ' AND d.device_id IS NULL'
        }

        if (device && device !== Constants.DEVICE_PRE_ACTIVATION) {
            condition += ' AND d.device_id = "' + device + '"'
        }

        if (product === 'CHAT' || product === 'ALL') {
            productData.CHAT = await sql.query(`SELECT parentTable.*, d.device_id as device_id, ua.link_code as dealer_pin FROM chat_ids as parentTable
            JOIN usr_acc AS ua
                ON ua.id = parentTable.user_acc_id
            JOIN devices AS d
                ON ua.device_id = d.id
            WHERE parentTable.delete_status = '0' ${condition} ORDER BY parentTable.id DESC`);

        }

        if (product === 'PGP' || product === 'ALL') {
            productData.PGP = await sql.query(`SELECT parentTable.*, d.device_id as device_id, ua.link_code as dealer_pin FROM pgp_emails as parentTable
            JOIN usr_acc AS ua
                ON ua.id = parentTable.user_acc_id
            JOIN devices AS d
                ON ua.device_id = d.id
            WHERE parentTable.delete_status = '0' ${condition} ORDER BY parentTable.id DESC`);
        }

        if (product === 'SIM' || product === 'ALL') {
            productData.SIM = await sql.query(`SELECT parentTable.*, d.device_id as device_id, ua.link_code as dealer_pin FROM sim_ids as parentTable
            JOIN usr_acc AS ua
                ON ua.id = parentTable.user_acc_id
            JOIN devices AS d
                ON ua.device_id = d.id
            WHERE parentTable.delete_status = '0' ${condition} ORDER BY parentTable.id DESC`);
        }

        if (product === 'VPN' || product === 'ALL') {
            productData.VPN = await sql.query(`SELECT parentTable.*, d.device_id as device_id, ua.link_code as dealer_pin FROM acc_vpn as parentTable
            JOIN usr_acc AS ua
                ON ua.id = parentTable.user_acc_id
            JOIN devices AS d
                ON ua.device_id = d.id
            WHERE parentTable.delete_status = '0' ${condition} ORDER BY parentTable.id DESC`);
        }

        response = {
            status: true,
            data: productData,
        };

        return res.send(response);

    }

};



exports.generateInvoiceReport = async function (req, res) {
    let verify = req.decoded;
    if (verify) {

        let user_type = verify.user.user_type;
        let dealer = req.body.dealer;
        let from = req.body.from;
        let to = req.body.to;
        let device = req.body.device;
        let payment_status = req.body.payment_status;
        let condition = '';


        if (dealer === '' && user_type === Constants.DEALER) {

            let sDealerIds = await generalHelper.getSdealersByDealerId(verify.user.id);
            if (sDealerIds.length > 0) {
                condition += ' AND i.dealer_id IN (' + verify.user.id + ',' + sDealerIds.join(',') + ')'
            } else {
                condition += ' AND i.dealer_id = ' + verify.user.id
            }
        } else if (dealer) {
            condition += ' AND i.dealer_id = ' + dealer
        }


        if (from) {
            condition += ' AND DATE(i.created_at) >= "' + moment(from).format('YYYY-MM-DD') + '"'
        }

        if (to) {
            condition += ' AND DATE(i.created_at) <= "' + moment(to).format('YYYY-MM-DD') + '"'
        }

        if (payment_status) {
            condition += ' AND i.end_user_payment_status = "' + payment_status + '"'
        }

        if (device === Constants.DEVICE_PRE_ACTIVATION) {
            condition += ' AND d.device_id IS NULL'
        }

        if (device && device !== Constants.DEVICE_PRE_ACTIVATION) {
            condition += ' AND d.device_id = "' + device + '"'
        }

        invoiceData = await sql.query(`SELECT i.*,
         d.device_id AS device_id, ua.link_code as dealer_pin
            FROM invoices AS i
            JOIN usr_acc AS ua
                ON ua.id = i.user_acc_id
            JOIN devices AS d
                ON ua.device_id = d.id
            WHERE i.del_status = '0' ${condition}
            ORDER BY  i.id DESC`);

        let response = {
            data: invoiceData,
            status: true
        };

        return res.send(response);
    }

};

exports.generatePaymentHistoryReport = async function (req, res) {

    let verify = req.decoded;

    if (verify) {

        let user_type = verify.user.user_type;
        let dealer = req.body.dealer;
        let from = req.body.from;
        let to = req.body.to;
        let type = req.body.type;
        let transaction_type = req.body.transaction_type;
        let device = req.body.device;

        let condition = '';

        let response = {
            status: false,
        };

        if (dealer === '' && user_type === Constants.DEALER) {

            let sDealerIds = await generalHelper.getSdealersByDealerId(verify.user.id);
            if (sDealerIds.length > 0) {
                condition += ' AND fat.user_id IN (' + verify.user.id + ',' + sDealerIds.join(',') + ')'
            } else {
                condition += ' AND fat.user_id = ' + verify.user.id
            }

        } else if (dealer) {
            condition += ' AND fat.user_id = ' + dealer
        }

        if (from) {
            condition += ' AND DATE(fat.created_at) >= "' + moment(from).format('YYYY-MM-DD') + '"'
        }

        if (to) {
            condition += ' AND DATE(fat.created_at) <= "' + moment(to).format('YYYY-MM-DD') + '"'
        }

        if (type) {
            condition += ' AND fat.type = "' + type + '"'
        }

        if (transaction_type) {
            condition += ' AND fat.transection_type = "' + transaction_type + '"'
        }

        if (device === Constants.DEVICE_PRE_ACTIVATION) {
            condition += ' AND d.device_id IS NULL'
        }

        if (device && device !== Constants.DEVICE_PRE_ACTIVATION) {
            condition += ' AND d.device_id = "' + device + '"'
        }

        paymentHistoryData = await sql.query(`SELECT fat.*, d.device_id as device_id, ua.link_code as dealer_pin FROM financial_account_transections as fat 
        JOIN usr_acc as ua on ua.id = fat.user_dvc_acc_id 
        JOIN devices as d on ua.device_id = d.id
        WHERE fat.id IS NOT NULL ${condition} ORDER BY fat.id DESC`);

        response = {
            status: true,
            data: paymentHistoryData,
        };

        return res.send(response);
    }

};

exports.generateHardwareReport = async function (req, res) {

    let verify = req.decoded;

    if (verify) {

        let user_type = verify.user.user_type;
        let dealer = req.body.dealer;
        let from = req.body.from;
        let to = req.body.to;
        let hardware = req.body.hardware;
        let condition = '';
        let response = {};
        let device = req.body.device;

        if (hardware) {
            condition += ' AND hd.hardware_name = "' + hardware + '"'
        }

        if (dealer === '' && user_type === Constants.DEALER) {

            let sDealerIds = await generalHelper.getSdealersByDealerId(verify.user.id);
            if (sDealerIds.length > 0) {
                condition += ' AND hd.dealer_id IN (' + verify.user.id + ',' + sDealerIds.join(',') + ')'
            } else {
                condition += ' AND hd.dealer_id = ' + verify.user.id
            }

        } else if (dealer) {
            condition += ' AND hd.dealer_id = ' + dealer
        }

        if (from) {
            condition += ' AND DATE(hd.created_at) >= ' + moment(from).format('YYYY-MM-DD')
        }

        if (to) {
            condition += ' AND DATE(hd.created_at) <= ' + moment(to).format('YYYY-MM-DD')
        }

        if (device === Constants.DEVICE_PRE_ACTIVATION) {
            condition += ' AND d.device_id IS NULL'
        }

        if (device && device !== Constants.DEVICE_PRE_ACTIVATION) {
            condition += ' AND d.device_id = "' + device + '"'
        }

        hardwareData = await sql.query(`SELECT hd.*, d.device_id, ua.link_code as dealer_pin FROM hardwares_data as hd
        JOIN usr_acc as ua on ua.id = hd.user_acc_id 
        JOIN devices as d on ua.device_id = d.id 
        WHERE hd.status = 'returned' ${condition} ORDER BY hd.id DESC`);

        response = {
            data: hardwareData,
        };

        return res.send(response);
    }

};



exports.generateSalesReport = async function (req, res) {

    let verify = req.decoded;

    if (verify) {

        let user_type = verify.user.user_type;
        let dealer = req.body.dealer;
        let from = req.body.from;
        let to = req.body.to;
        let productType = req.body.product_type;
        let device = req.body.device;
        let condition = '';
        let packages = [];
        let packagesData = [];
        let products = [];
        let productsData = [];
        let hardwares = [];
        let hardwaresData = [];
        let totalCost = 0;
        let totalSale = 0;
        let totalProfitLoss = 0;
        let response = {};

        if (productType === 'PACKAGES' || productType === 'ALL') {

            if (dealer === '' && user_type === Constants.DEALER) {

                let sDealerIds = await generalHelper.getSdealersByDealerId(verify.user.id);
                if (sDealerIds.length > 0) {
                    condition += ' AND ua.dealer_id IN (' + verify.user.id + ',' + sDealerIds.join(',') + ')'
                } else {
                    condition += ' AND ua.dealer_id = ' + verify.user.id
                }

            } else if (dealer) {
                condition += ' AND ua.dealer_id = ' + dealer
            }

            if (from) {
                condition += ' AND DATE(ss.created_at) >= "' + moment(from).format('YYYY-MM-DD') + '"'
            }

            if (to) {
                condition += ' AND DATE(ss.created_at) <= "' + moment(to).format('YYYY-MM-DD') + '"'
            }

            if (device === Constants.DEVICE_PRE_ACTIVATION) {
                condition += ' AND d.device_id IS NULL'
            }

            if (device && device !== Constants.DEVICE_PRE_ACTIVATION) {
                condition += ' AND d.device_id = "' + device + '"'
            }

            packages = await sql.query(`SELECT ss.*, d.device_id as device_id, ua.link_code as dealer_pin FROM services_sale as ss
            JOIN usr_acc as ua on ua.id = ss.user_acc_id 
            JOIN devices as d on ua.device_id = d.id
            WHERE ss.status != 'cancelled' AND ss.item_type LIKE 'package'  ${condition} ORDER BY ss.id DESC`);

            packages.map(function (value, index) {

                let name = JSON.parse(value.item_data).pkg_name;
                let cost_price = 0;
                let sale_price = 0;
                let profit_loss = 0;

                if (value.item_dealer_cost == 0 && user_type === Constants.ADMIN) {

                    cost_price = parseInt(value.item_admin_cost);
                    sale_price = parseInt(value.item_sale_price);
                    profit_loss = sale_price - cost_price;

                    totalCost += cost_price;
                    totalSale += sale_price;

                    packagesData.push({
                        'type': 'Package',
                        'name': name.replace(/_/g, ' '),
                        'dealer_pin': value.dealer_pin,
                        'device_id': value.device_id,
                        'cost_price': cost_price,
                        'sale_price': sale_price,
                        'profit_loss': profit_loss,
                        'created_at': value.created_at,
                    })

                } else {

                    if (value.item_dealer_cost != 0 && user_type === Constants.DEALER) {
                        cost_price = parseInt(value.item_dealer_cost);
                        sale_price = parseInt(value.item_sale_price);
                        profit_loss = sale_price - cost_price;

                        totalCost += cost_price;
                        totalSale += sale_price;

                        packagesData.push({
                            'type': 'Package',
                            'name': name.replace(/_/g, ' '),
                            'dealer_pin': value.dealer_pin,
                            'device_id': value.device_id,
                            'cost_price': cost_price,
                            'sale_price': sale_price,
                            'profit_loss': profit_loss,
                            'created_at': value.created_at,
                        })

                    } else if (user_type === Constants.ADMIN) {
                        cost_price = parseInt(value.item_admin_cost);
                        sale_price = parseInt(value.item_dealer_cost);
                        profit_loss = sale_price - cost_price;

                        totalCost += cost_price;
                        totalSale += sale_price;

                        packagesData.push({
                            'type': 'Package',
                            'name': name.replace(/_/g, ' '),
                            'dealer_pin': value.dealer_pin,
                            'device_id': value.device_id,
                            'cost_price': cost_price,
                            'sale_price': sale_price,
                            'profit_loss': profit_loss,
                            'created_at': value.created_at,
                        })
                    }
                }

            });

        }

        if (productType === 'PRODUCTS' || productType === 'ALL') {

            if (dealer === '' && user_type === Constants.DEALER) {

                let sDealerIds = await generalHelper.getSdealersByDealerId(verify.user.id);
                if (sDealerIds.length > 0) {
                    condition += ' AND ua.dealer_id IN (' + verify.user.id + ',' + sDealerIds.join(',') + ')'
                } else {
                    condition += ' AND ua.dealer_id = ' + verify.user.id
                }


            } else if (dealer) {
                condition += ' AND ua.dealer_id = ' + dealer
            }

            if (from) {
                condition += ' AND DATE(ss.created_at) >= "' + moment(from).format('YYYY-MM-DD') + '"'
            }

            if (to) {
                condition += ' AND DATE(ss.created_at) <= "' + moment(to).format('YYYY-MM-DD') + '"'
            }

            if (device === Constants.DEVICE_PRE_ACTIVATION) {
                condition += ' AND d.device_id IS NULL'
            }

            if (device && device !== Constants.DEVICE_PRE_ACTIVATION) {
                condition += ' AND d.device_id = "' + device + '"'
            }

            products = await sql.query(`SELECT ss.*, d.device_id as device_id, ua.dealer_id as dealer_id, ua.link_code as dealer_pin FROM services_sale as ss
            JOIN usr_acc as ua on ua.id = ss.user_acc_id 
            JOIN devices as d on ua.device_id = d.id
            WHERE ss.status != 'cancelled' AND ss.item_type LIKE 'product'  ${condition} ORDER BY ss.id DESC`);

            products.map(function (value, index) {

                let cost_price = 0;
                let sale_price = 0;
                let profit_loss = 0;

                if (value.item_dealer_cost == 0 && user_type === Constants.ADMIN) {

                    cost_price = parseInt(value.item_admin_cost);
                    sale_price = parseInt(value.item_sale_price);
                    profit_loss = sale_price - cost_price;

                    totalCost += cost_price;
                    totalSale += profit_loss;

                } else {

                    if (user_type === Constants.DEALER) {
                        cost_price = parseInt(value.item_dealer_cost);
                        sale_price = parseInt(value.total_credits);
                        profit_loss = sale_price - cost_price;

                        totalCost += cost_price;
                        totalSale += profit_loss;
                    } else {
                        cost_price = parseInt(value.item_admin_cost);
                        sale_price = parseInt(value.item_dealer_cost);
                        profit_loss = sale_price - cost_price;

                        totalCost += cost_price;
                        totalSale += profit_loss;
                    }

                }

                let name = JSON.parse(value.item_data).price_for;
                productsData.push({
                    'type': 'Product',
                    'name': name.replace(/_/g, ' '),
                    'dealer_pin': value.dealer_pin,
                    'device_id': value.device_id,
                    'cost_price': cost_price,
                    'sale_price': sale_price,
                    'profit_loss': profit_loss,
                    'created_at': value.created_at,
                })
            });

        }

        if (productType === 'HARDWARES' || productType === 'ALL') {

            if (dealer === '' && user_type === Constants.DEALER) {

                let sDealerIds = await generalHelper.getSdealersByDealerId(verify.user.id);
                if (sDealerIds.length > 0) {
                    condition += ' AND hd.dealer_id IN (' + verify.user.id + ',' + sDealerIds.join(',') + ')'
                } else {
                    condition += ' AND hd.dealer_id = ' + verify.user.id
                }

            } else if (dealer) {
                condition += ' AND hd.dealer_id = ' + dealer
            }

            if (from) {
                condition += ' AND DATE(hd.created_at) >= "' + moment(from).format('YYYY-MM-DD') + '"'
            }

            if (to) {
                condition += ' AND DATE(hd.created_at) <= "' + moment(to).format('YYYY-MM-DD') + '"'
            }

            if (device === Constants.DEVICE_PRE_ACTIVATION) {
                condition += ' AND d.device_id IS NULL'
            }

            if (device && device !== Constants.DEVICE_PRE_ACTIVATION) {
                condition += ' AND d.device_id = "' + device + '"'
            }

            hardwares = await sql.query(`SELECT hd.*, d.device_id as device_id, ua.link_code as dealer_pin FROM hardwares_data as hd
                JOIN usr_acc as ua 
                    on ua.id = hd.user_acc_id 
                JOIN devices as d 
                    on ua.device_id = d.id
                WHERE hd.id IS NOT NULL ${condition} AND hd.status != 'returned' ORDER BY hd.id DESC`);

            hardwares.map(function (value, index) {
                let cost_price = 0;
                let sale_price = 0;
                let profit_loss = 0;

                if (value.dealer_cost_credits === 0 && user_type === Constants.ADMIN) {

                    cost_price = parseInt(value.admin_cost_credits);
                    sale_price = parseInt(value.total_credits);
                    profit_loss = sale_price - cost_price;

                    totalCost += cost_price;
                    totalSale += sale_price;

                    hardwaresData.push({
                        'type': 'Hardware',
                        'name': value.hardware_name,
                        'dealer_pin': value.dealer_pin,
                        'device_id': value.device_id,
                        'cost_price': cost_price,
                        'sale_price': sale_price,
                        'profit_loss': profit_loss,
                        'created_at': value.created_at,
                    })

                } else {

                    if (value.item_dealer_cost != 0 && user_type === Constants.DEALER) {
                        cost_price = parseInt(value.dealer_cost_credits);
                        sale_price = parseInt(value.total_credits);
                        profit_loss = sale_price - cost_price;

                        totalCost += cost_price;
                        totalSale += sale_price;

                        hardwaresData.push({
                            'type': 'Hardware',
                            'name': value.hardware_name,
                            'dealer_pin': value.dealer_pin,
                            'device_id': value.device_id,
                            'cost_price': cost_price,
                            'sale_price': sale_price,
                            'profit_loss': profit_loss,
                            'created_at': value.created_at,
                        })

                    } else if (user_type === Constants.ADMIN) {
                        cost_price = parseInt(value.admin_cost_credits);
                        sale_price = parseInt(value.dealer_cost_credits);
                        profit_loss = sale_price - cost_price;

                        totalCost += cost_price;
                        totalSale += sale_price;

                        hardwaresData.push({
                            'type': 'Hardware',
                            'name': value.hardware_name,
                            'dealer_pin': value.dealer_pin,
                            'device_id': value.device_id,
                            'cost_price': cost_price,
                            'sale_price': sale_price,
                            'profit_loss': profit_loss,
                            'created_at': value.created_at,
                        })
                    }

                }

            });

        }

        let saleInfo = {
            'totalCost': totalCost,
            'totalSale': totalSale,
            'totalProfitLoss': totalSale - totalCost,
        };

        response = {
            data: [...packagesData, ...productsData, ...hardwaresData],
            saleInfo,
            status: true,
        };
        return res.send(response);
    }


};
