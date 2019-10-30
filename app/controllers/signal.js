const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
var Constants = require('../../constants/Application');
// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"
let usr_acc_query_text = Constants.usr_acc_query_text;


exports.validate_chat_id = async function (req, res) {
    let device_id = req.body.device_id;
    let chat_id = req.body.chat_id;
    let ts = req.body.ts;

    if (!device_id || !chat_id || !ts) {
        res.status(422).send({
            status: false,
            msg: "missing required data"
        });
        return false;
    }

    let chat_detail = `SELECT cid.chat_id , cid.used , d.device_id 
    FROM chat_ids AS cid 
    JOIN usr_acc AS ua ON cid.user_acc_id = ua.id 
    JOIN devices AS d ON ua.device_id = d.id 
    WHERE cid.chat_id = '${chat_id}'`
    let chat_detail_row = await sql.query(chat_detail);

    if (!chat_detail_row || chat_detail_row.length <= 0) {
        if (chat_detail_row[0].device_id == device_id) {
            res.status(200).send({
                status: true,
                msg: "success"
            });
            return false;
        }

        res.status(400).send({
            status: false,
            msg: "Bad Request: not success"
        });
        return false;
    }
}

