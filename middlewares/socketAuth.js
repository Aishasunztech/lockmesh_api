// Libraries
var jwt = require('jsonwebtoken');

// Helpers
const { sql } = require('../config/database');
const device_helpers = require('../helper/device_helpers.js');

// Constants
const app_constants = require('../config/constants');

// verify token
const verifyToken = function (token) {

    if (device_helpers.checkNotNull(token)) {
        // verifies secret and checks exp
        return jwt.verify(token.replace(/['"]+/g, ''), app_constants.SECRET, function (err, decoded) {
            if (err) {
                return false;
            } else {
                return true;
                // if everything is good, save to request for use in other routes
                // ath = decoded;
            }
        });
    } else {
        return false;
    }
}

const verifySession = async (deviceId, sessionId, isWeb = false, dealerId = null) => {
    if (device_helpers.checkNotNull(isWeb)) {
        console.log("web side: ", isWeb);
        return true;

    } else if (device_helpers.checkNotNull(deviceId)) {
        console.log("mobile side: ", deviceId);
        
        var query = `SELECT id FROM devices WHERE device_id='${deviceId}' LIMIT 1`;
        let res = await sql.query(query);
        if (res.length) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

module.exports = async (socket, next) => {
    let token = socket.handshake.query.token;
    
    next();
    // if (verifyToken(token)) {

    //     // let session_id = socket.id;

    //     // var device_id = null;
    //     // var dealer_id = null;

    //     // let isWeb = socket.handshake.query['isWeb'];

    //     // if (device_helpers.checkNotNull(isWeb)) {
    //     //     isWeb = true;
    //     //     // dealer_id = socket.handshake.query['dealer_id'];

    //     // } else {
    //     //     isWeb = false;
    //     //     device_id = socket.handshake.query['device_id'];
    //     // }

    //     // let sessionVerify = await verifySession(device_id, session_id, isWeb, dealer_id);
        
    //     // if (sessionVerify) {
    //     // } else {
    //     //     return next(new Error('Unauthorized: token not provided'));
    //     // }

    // } else {
    //     return next('Unauthorized: token not provided');
    // }
}