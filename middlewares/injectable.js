var rawbody = require('raw-body');

const general_helpers = require('../helper/general_helper');
const { sql } = require('../config/database');


function middleware(req, res, next) {

    var containsSql = false;
    if (req.originalUrl !== null && req.originalUrl !== undefined) {
        if (general_helpers.hasSql(req.originalUrl) === true) {
            containsSql = true;
        }
    }

    if (containsSql === false) {
        rawbody(req, {
            encoding: 'utf8'
        }, function(err, body) {
            console.log(body)
            if (err) {
                return next(err);
            }
            return next()
            // if (body !== null && body !== undefined) {
            //     if (typeof body !== 'string') {
            //         body = JSON.stringify(body);
            //     }

            //     if (general_helpers.hasSql(body) === true) {
            //         containsSql = true;
            //     }
            // }

            // if (containsSql === true) {
            //     console.log('hello');

            //     next();
            //     // req.body = sql.escape(body);
            //     // res.status(403).json({
            //     //     error: 'SQL Detected in Request, Rejected.'
            //     // });
            // } else {
            //     next();
            // }
        });
    } else {
        res.status(403).json({
            error: 'SQL Detected in Request, Rejected.'
        });
    }
}

module.exports = middleware;
