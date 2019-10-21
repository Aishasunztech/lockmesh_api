const Constants         = require('../../constants/application');
const moment            = require('moment');
const { sql }           = require("../../config/database");

var productData = {};
var invoiceData = {};
var paymentHistoryData = {};
exports.generateProductReport = async function (req, res) {
    let verify      = req.decoded;

    if (verify){

        let product     = req.body.product;
        let type        = req.body.type;
        let dealer      = req.body.dealer;
        let from        = req.body.from;
        let to          = req.body.to;


        let condition   = '';

        let response = {
            status: false,
        };

        if (type && type === 'USED'){
            condition += ' AND used = 1'
        }else if(type && type === 'UNUSED'){
            condition += ' AND used = 0'
        }

        if (dealer){
            condition += ' AND dealer_id = '+dealer
        }

        if (from){
            condition += ' AND DATE(created_at) >= '+moment(from).format('YYYY-MM-DD')
        }

        if (to){
            condition += ' AND DATE(created_at) >= '+moment(to).format('YYYY-MM-DD')
        }

        if (product === 'CHAT' || product === 'ALL'){
            productData.CHAT = await sql.query(`SELECT * FROM chat_ids WHERE delete_status = '0' ${condition} ORDER BY id DESC`);

        }

        if (product === 'PGP' || product === 'ALL'){
            productData.PGP = await sql .query(`SELECT * FROM pgp_emails WHERE delete_status = '0' ${condition} ORDER BY id DESC`);
        }

        if (product === 'SIM' || product === 'ALL'){
            productData.SIM = await sql.query(`SELECT * FROM sim_ids WHERE delete_status = '0' ${condition} ORDER BY id DESC`);
        }

        if (product === 'VPN' || product === 'ALL'){
            productData.VPN = await sql.query(`SELECT * FROM acc_vpn WHERE delete_status = '0' ${condition} ORDER BY id DESC`);
        }

        response = {
            status: true,
            data: productData,

        };

        return res.send(response);

    }

};



exports.generateInvoiceReport = async function (req, res) {
    let verify      = req.decoded;

    if (verify){

        let dealer          = req.body.dealer;
        let from            = req.body.from;
        let to              = req.body.to;
        let payment_status  = req.body.payment_status;
        let condition       = '';
        

        let response = {
            status: false,
        };

        if (dealer){
            condition += ' AND i.dealer_id = '+dealer
        }

        if (from){
            condition += ' AND DATE(i.created_at) >= '+moment(from).format('YYYY-MM-DD')
        }

        if (to){
            condition += ' AND DATE(i.created_at) >= '+moment(to).format('YYYY-MM-DD')
        }

        if (payment_status) {
            condition += ' AND i.end_user_payment_status = "' + payment_status +'"'
        }

        invoiceData = await sql.query(`SELECT i.*, d.device_id as device_id FROM invoices as i 
        JOIN usr_acc as ua on ua.id = i.user_acc_id 
        JOIN devices as d on ua.device_id = d.id 
        WHERE i.del_status = '0' ${condition} ORDER BY i.id DESC`);

        response = {
            status: true,
            data: invoiceData,
        };

        return res.send(response);
    }

};

exports.generatePaymentHistoryReport = async function (req, res) {

    let verify      = req.decoded;

    if (verify){

        let dealer      = req.body.dealer;
        let from        = req.body.from;
        let to          = req.body.to;

        let condition   = '';

        let response = {
            status: false,
        };

        if (dealer){
            condition += ' AND fat.user_id = '+dealer
        }

        if (from){
            condition += ' AND DATE(fat.created_at) >= '+moment(from).format('YYYY-MM-DD')
        }

        if (to){
            condition += ' AND DATE(fat.created_at) >= '+moment(to).format('YYYY-MM-DD')
        }

        paymentHistoryData = await sql.query(`SELECT fat.*, d.device_id as device_id FROM financial_account_transections as fat 
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

        let dealer  = req.body.dealer;
        let from    = req.body.from;
        let to      = req.body.to;

        let condition = '';

        let response = {
            status: false,
        };

        if (dealer) {
            condition += ' AND fat.user_id = ' + dealer
        }

        if (from) {
            condition += ' AND DATE(fat.created_at) >= ' + moment(from).format('YYYY-MM-DD')
        }

        if (to) {
            condition += ' AND DATE(fat.created_at) >= ' + moment(to).format('YYYY-MM-DD')
        }

        paymentHistoryData = await sql.query(`SELECT fat.*, d.device_id as device_id FROM hardware_data as fat 
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