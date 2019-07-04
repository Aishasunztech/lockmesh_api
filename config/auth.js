const jwt = require('jsonwebtoken');
const config = require('./constants');

module.exports = function(req, res, next) {
    var ath;
    var token = req.headers['authorization'];
    if (token) {

        jwt.verify(token, config.SECRET, async function (err, decoded) {
            if (err) {
                ath = {
                    status: false,
                    success: false
                };
                return res.json({
                    success: false,
                    msg: 'Failed to authenticate token.'
                });

            } else {
                // if everything is good, save to request for use in other routes
                // let result = await helpers.getLoginByToken(token);
                // console.log("decoding", result);
                // if(result){
                // if(result.status === true || result.status === 1){
                req.decoded = decoded;
                req.decoded.status = true;
                req.decoded.success = true;
                ath = decoded;
                next();
                // console.log(ath);


                // } else {
                //     ath.status = false;
                //     return res.json({
                //         success: false,
                //         msg: 'Failed to authenticate token.'
                //     });
                // }
                // } else {
                //     ath.status = false;
                //     return res.json({
                //         success: false,
                //         msg: 'Failed to authenticate token.'
                //     });
                // } 

            }
        });
    } else {
        ath = {
            status: false,
            success: false
        };
        return res.send({
            success: false,
            msg: 'No token provided.'
        });
    }
    return ath;
};

    
    





