const { sql } = require('../../config/database');

const helpers = require('../../helper/general_helper');
const constants = require('../../constants/Application');
// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";

let data;

exports.getSocketProcesses = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let dealer_id = verify.user.dealer_id;

        let start = (req.query.start) ? req.query.start : 0;
        let limit = (req.query.limit) ? req.query.limit : false;
        let status = (req.query.status) ? req.query.status : false;
        let filter = (req.query.filter) ? req.query.filter : false;
        
        let allTasks = [];
        console.log('status', status, 'limit:', limit, 'start:', start, 'filter', filter);

        let where = ` WHERE dealer_id='${dealer_id}'`;

        if (filter && filter !== 'undefined') {
            where = where + ` AND type= ${req.query.filter} `;
        }
        
        let query = `SELECT * FROM device_history`;
        let limitQ = ' LIMIT 10';
        
        if(limit){
            limitQ = ` LIMIT ${start}, ${limit}`
        } 
        // else {
        //     limitQ = ` LIMIT 10`
        // }

        if(status){
            
            query = `${query} ${where} AND status='${status}' ORDER BY created_at DESC ${limitQ}`

        } else {
            query = `${query} ${where} ORDER BY created_at DESC ${limitQ}`
        }

        console.log("query notifications : ", query);
        allTasks = await sql.query(query);
        console.log("allTasks:: ",allTasks);
        data = {
            status: false,
            tasks: []
        }

        if (allTasks.length) {
            data = {
                status: true,
                tasks: allTasks
            }
        }
        return res.send(data);
    }

}