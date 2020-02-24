const { sql } = require('../../config/database');

exports.validatePgpEmail = async function (req, res) {
    let device_id = req.body.device_id;
    let pgp_email = req.body.pgp_email;
    // let ts = req.body.ts;

    console.log('checkPgpEmail:', device_id, pgp_email);
    
    if (!device_id || !pgp_email) {
        return res.status(422).send({
            status: false,
            msg: "missing required data"
        });
    }

    let pgpDetailQ = `SELECT cid.pgp_email , cid.used , d.device_id 
    FROM pgp_emails AS cid 
    JOIN usr_acc AS ua ON cid.user_acc_id = ua.id 
    JOIN devices AS d ON ua.device_id = d.id 
    WHERE cid.pgp_email = ?`
    let pgpEmailDetailRow = await sql.query(pgpDetailQ, [pgp_email]);

    if (pgpEmailDetailRow && pgpEmailDetailRow.length > 0) {
        console.log('pgpEmailDetailRow: ', pgpEmailDetailRow[0]);
        if (pgpEmailDetailRow[0].device_id == device_id) {
            return res.status(200).send({
                status: true,
                msg: "success"
            });
        }
    }
    return res.send({
        status: false,
        msg: "Bad Request: no record found"
    });

}



