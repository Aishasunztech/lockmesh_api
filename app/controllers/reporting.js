const Constants         = require('../../constants/application');
const moment            = require('moment');



exports.generateProductReport = async function (req, res) {
    let verify      = req.decoded;

    if (verify){

        let product     = verify.product;
        let type        = verify.type;
        let dealer      = verify.dealer;
        let from        = verify.from;
        let to          = verify.to;

        let data        = [];
        let condition   = '';

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
            data['CHAT'] = await sql.query(`SELECT * FROM chat_ids WHERE delete_status = 0 ${condition}`);
        }

        if (product === 'PGP' || product === 'ALL'){
            data['PGP'] = await sql.query(`SELECT * FROM chat_ids WHERE delete_status = 0 ${condition}`);
        }

        if (product === 'SIM' || product === 'ALL'){
            data['SIM'] = await sql.query(`SELECT * FROM chat_ids WHERE delete_status = 0 ${condition}`);
        }

        if (product === 'VPN' || product === 'ALL'){
            data['VPN'] = await sql.query(`SELECT * FROM chat_ids WHERE delete_status = 0 ${condition}`);
        }


        res.send();

    }

};
