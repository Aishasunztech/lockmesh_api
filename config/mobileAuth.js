const jwt = require('jsonwebtoken');
const config = require('./constants');
const { sql } = require('../config/database');

module.exports = async (req, res, next) => {
    var ath;
    var token = req.headers['authorization'];
    // console.log("TOken", token);

    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, constants.SECRET, function (err, decoded) {
            // console.log(err);
            if (err) {
                ath = {
                    status: false,
                    success: false
                };
                return res.json({
                    success: false,
                    msg: 'TOKEN_INVALID'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;

                req.decoded.status = true;
                req.decoded.success = true;
                ath = decoded;
            }
        });
    } else {
        ath = {
            status: false,
            success: false
        };
        return res.send({
            success: false,
            msg: 'TOKEN_NOT_PROVIDED'
        });
    }

    return ath;

}

