const { sql } = require('../../config/database');

exports.validate_chat_id = async function (req, res) {
    let device_id = req.body.device_id;
    let chat_id = req.body.chat_id;
    let ts = req.body.ts;

    console.log('*********************** checkChatID', device_id, chat_id, ts);
    console.log('*********************** checkChatID req.body', req.body);

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

    if (chat_detail_row && chat_detail_row.length > 0) {
        console.log('*********************** chat_detail_row: ', chat_detail_row[0]);
        if (chat_detail_row[0].device_id == device_id) {
            res.status(200).send({
                status: true,
                msg: "success"
            });
            return false;
        }
    }
    res.status(400).send({
        status: false,
        msg: "Bad Request: no record found"
    });
    return false;

}

