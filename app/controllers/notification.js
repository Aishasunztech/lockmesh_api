const { sql } = require('../../config/database');

const helpers = require('../../helper/general_helper');
const constants = require('../../constants/Application');
// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";


exports.getQueJobs = async function (req, res) {
    try {
        var verify = req.decoded;
        if (verify) {
            let where = '';
            let dealer_id = verify.user.dealer_id;
            console.log(req.query.limit, req.query.start)
            let start = req.query.limit == 'all' ? 0 : parseInt(req.query.start) || 0;
            let limit = req.query.limit == 'all' ? 10 ^ 99 : parseInt(req.query.limit) || 10;
            let status = req.query.status;
            let filter = req.query.filter;
            let completedTasks = [];
            let pendingTasks = [];
            console.log('status',status, 'limit:', limit, 'start:', start, 'filter',filter )
            if (filter && filter !== '' && filter !== undefined && filter !== 'undefined') {
                where = " WHERE dealer_id=" + `${dealer_id}` + " AND type=" + `${req.query.filter} `;
            } else {
                where = " WHERE dealer_id=" + `${dealer_id}`;
            }
           
            if (status === 'completed' || status === '' || status === undefined || status === 'undefined') {
                completedTasks = await sql.query("SELECT * FROM device_history " + where + " AND status='completed_successfully' ORDER BY created_at DESC limit " + start + ", " + limit);
            } 
            if (status === 'pending' || status === '' || status === undefined || status === 'undefined') {
                pendingTasks = await sql.query("SELECT * FROM device_history " + where + " AND status='pending' ORDER BY created_at DESC limit " + start + ", " + limit);
            }

            console.log(pendingTasks.length, 'comppleted tasks are', completedTasks.length)

            if(Array.isArray(completedTasks) && Array.isArray(pendingTasks)){
                res.send({
                    status: true,
                    msg: 'success',
                    data: {
                        completedTasks: completedTasks,
                        pendingTasks: pendingTasks
                    }
                })
            }else{
                res.send({
                    status: false,
                    msg: 'Error',
                    data: {
                        completedTasks: [],
                        pendingTasks: []
                    }
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}