
var jwt = require('jsonwebtoken');
var app_constants = require('../config/constants');


module.exports = async (req, res) => {
    // check header or url parameters or post parameters for token
    var ath;
    var token = req.headers['authorization'];

    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app_constants.SECRET, function (err, decoded) {
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