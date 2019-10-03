
const { sql } = require('../../config/database');
var XLSX = require('xlsx');
var path = require('path');
var fs = require("fs");

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
const device_helpers = require('../../helper/device_helpers.js');
const constants = require('../../constants/Application');


// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"
let usr_acc_query_text = constants.usr_acc_query_text;

var data;
exports.createBackupDB = async function (req, res) {

    res.setHeader('Content-Type', 'application/json');

    var verify = req.decoded;
    // var loggedInuid = verify.user.id;
    if (verify) {
        var ws;
        var wb = XLSX.utils.book_new();
        let devices = []
        let query = "SELECT * From acc_action_history WHERE action = 'UNLINKED'";
        let newArray = await sql.query(query)
        let results = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0 order by devices.id DESC')
        if (results.length) {
            let devices_acc_array = [];
            let usr_device_ids_array = []
            for (let i = 0; i < results.length; i++) {
                devices_acc_array.push(results[i].id)
                usr_device_ids_array.push(results[i].usr_device_id)
            }
            let user_acc_ids = devices_acc_array.join()
            let usr_device_ids = usr_device_ids_array.join()
            let pgp_emails = await device_helpers.getPgpEmails(user_acc_ids);
            let sim_ids = await device_helpers.getSimids(user_acc_ids);
            let chat_ids = await device_helpers.getChatids(user_acc_ids);
            // let loginHistoryData = await device_helpers.getLastLoginDetail(usr_device_ids)

            for (var i = 0; i < results.length; i++) {
                let pgp_email = pgp_emails.find(pgp_email => pgp_email.user_acc_id === results[i].id);
                if (pgp_email) {
                    results[i].pgp_email = pgp_email.pgp_email
                }
                let sim_id = sim_ids.find(sim_id => sim_id.user_acc_id === results[i].id);
                if (sim_id) {
                    results[i].sim_id = sim_id.sim_id
                }
                let chat_id = chat_ids.find(chat_id => chat_id.user_acc_id === results[i].id);
                if (chat_id) {
                    results[i].chat_id = chat_id.chat_id
                }
                // let lastOnline = loginHistoryData.find(record => record.device_id == results[i].usr_device_id);
                // if (lastOnline) {
                    results[i].lastOnline = results[i].last_login
                // }
                results[i].finalStatus = device_helpers.checkStatus(
                    results[i]
                );
                results[i].validity = await device_helpers.checkRemainDays(
                    results[i].created_at,
                    results[i].validity
                );
            }
        }
        let finalResult = [...results, ...newArray]
        // console.log('old', finalResult);
        let checkValue = helpers.checkValue;
        for (let device of finalResult) {
            let data = {
                device_id: checkValue(device.device_id),
                user_id: checkValue(device.user_id),
                batch_no: checkValue(device.batch_no),
                name: checkValue(device.name),
                dealer_id: checkValue(device.dealer_id),
                dealer_name: checkValue(device.dealer_name),
                account_email: checkValue(device.account_email),
                firmware_info: checkValue(device.firmware_info),
                account_name: checkValue(device.account_name),
                model: checkValue(device.model),
                link_code: checkValue(device.link_code),
                activation_code: checkValue(device.activation_code),
                pgp_email: checkValue(device.pgp_email),
                chat_id: checkValue(device.chat_id),
                sim_id: checkValue(device.sim_id),
                client_id: checkValue(device.client_id),
                finalStatus: checkValue(device.finalStatus),
                ip_address: checkValue(device.ip_address),
                mac_address: checkValue(device.mac_address),
                serial_number: checkValue(device.serial_number),
                imei: checkValue(device.imei),
                imei2: checkValue(device.imei2),
                online: checkValue(device.online),
                simno: checkValue(device.simno),
                simno2: checkValue(device.simno2),
                note: checkValue(device.note),
                prnt_dlr_id: checkValue(device.prnt_dlr_id),
                prnt_dlr_name: checkValue(device.prnt_dlr_name),
                connected_dealer: checkValue(device.connected_dealer),
                start_date: checkValue(device.start_date),
                expiry_date: checkValue(device.expiry_date),
                expiry_months: checkValue(device.expiry_months),
                validity: checkValue(device.validity),
                updated_at: checkValue(device.updated_at),
                created_at: checkValue(device.created_at),
            }
            devices.push(data)
        }
        if (devices.length) {
            ws = XLSX.utils.json_to_sheet(devices);
            XLSX.utils.book_append_sheet(wb, ws, 'Devices');
        }

        let userData = await sql.query('select id,user_id,user_name,email,dealer_id from users');
        if (userData.length) {
            ws = XLSX.utils.json_to_sheet(userData);
            XLSX.utils.book_append_sheet(wb, ws, 'Users');
        }
        let dealerData = await sql.query('select dealer_id,dealer_name,dealer_email,link_code,connected_dealer ,unlink_status from dealers WHERE dealer_email != "super123!admin@gmail.com"');
        if (userData.length) {
            ws = XLSX.utils.json_to_sheet(dealerData);
            XLSX.utils.book_append_sheet(wb, ws, 'Dealers');
        }
        let IDsTables = ['chat_ids', 'sim_ids', 'pgp_emails'];
        for (let i = 0; i < IDsTables.length; i++) {
            let tableDate = await sql.query("SELECT * from " + IDsTables[i])
            if (tableDate.length) {
                /* make the worksheet */
                ws = XLSX.utils.json_to_sheet(tableDate);
                /* add to workbook */
                XLSX.utils.book_append_sheet(wb, ws, IDsTables[i]);
            }
        }
        let fileNameCSV = 'DB_Backup' + '_' + Date.now() + ".xlsx";
        await XLSX.writeFile(wb, path.join(__dirname, "../../db_backup/" + fileNameCSV))
        let data = {
            status: true,
            path: fileNameCSV
        }
        res.send(data)
        return;
    }
}


exports.getBackupFiles = async function (req, res) {
    // var loggedInuid = req.decoded.user.id;
    let file = path.join(__dirname, "../../db_backup/" + req.params.file);
    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        data = {
            "status": false,
            "msg": "File Not Found", // file not found"
        }
        res.send(data)
        return;
    }
}