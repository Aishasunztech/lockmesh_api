const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const { sql } = require('../config/database');



module.exports = async (req, res, next) => {

    var ath;
    var token = req.headers['authorization'];
    // console.log(token);
    // try {
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
                let checkTokenQ = `SELECT id FROM login_history WHERE token='${token}' AND status=1 ORDER BY created_at DESC LIMIT 1`;
                let checkToken = await sql.query(checkTokenQ);

                if (checkToken.length && decoded && decoded.user) {
                    req.decoded = decoded;
                    req.decoded.status = true;
                    req.decoded.success = true;
                    ath = decoded;


                    var user_id = ath.user.id

                    var d_lng_id = 1;

                    if (user_id != undefined && user_id != '' && user_id != null) {
                        var sQry = `SELECT dealer_lng_id FROM dealer_language WHERE dealer_id = '${user_id}' LIMIT 1`;
                        var dLang = await sql.query(sQry);
                        if (dLang.length) {
                            d_lng_id = dLang[0].dealer_lng_id;
                        }
                    }

                    if (d_lng_id == undefined || d_lng_id === "undefined" || d_lng_id == '' || d_lng_id == null || d_lng_id === 'null' || d_lng_id == '0') {
                        d_lng_id = 1;
                    }

                    if (d_lng_id === 1) {
                        req.translation = require("../languages/en.json");
                    } else if (d_lng_id === 2) {
                        req.translation = require("../languages/fr.json");
                    }

                    next();

                } else {
                    ath = {
                        status: false,
                        success: false
                    };
                    return res.send({
                        success: false,
                        msg: 'Invalid Token'
                    });
                }
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
    // return ath;

    // } catch (error) {
    //     console.log(error);
    // }

}

