const jwt = require('jsonwebtoken');
const config = require('./constants');
const { sql } = require('../config/database');
const en_translation = require("../languages/en.json")
const fr_translation = require("../languages/fr.json")

module.exports = async (req, res, next) => {

    var ath;
    var token = req.headers['authorization'];
    // console.log(token);
    // try {
    if (token) {
        // let checkTokenQ = `SELECT id FROM login_history WHERE token='${token}' AND status=1`;
        // let checkToken = await sql.query(checkTokenQ);

        // if(checkToken.length){
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
                req.decoded = decoded;
                req.decoded.status = true;
                req.decoded.success = true;
                ath = decoded;

                if (ath.user) {
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

                    let lan_obj = {}
                    if (d_lng_id === 1) {
                        en_translation.forEach((elem) => {
                            let key_id = elem.key_id;
                            lan_obj[key_id] = elem.key_value
                        })
                        req.translation = lan_obj;
                    } else if (d_lng_id === 2) {
                        fr_translation.forEach((elem) => {
                            let key_id = elem.key_id;
                            lan_obj[key_id] = elem.key_value
                        })
                        req.translation = lan_obj;
                    }
                    // var sTranslation = `SELECT * FROM lng_translations WHERE lng_id = '${d_lng_id}'`;
                    // let resp = await sql.query(sTranslation);
                    // if (resp.length) {
                    //     let obj = {}
                    //     resp.forEach((elem) => {
                    //         let key_id = elem.key_id;
                    //         obj[key_id] = elem.key_value
                    //     })
                    //     req.translation = obj;
                    // }

                    // console.log(req.translation, lan_obj);
                    next();
                } else {
                    ath = {
                        status: false,
                        success: false
                    };
                    return res.send({
                        success: false,
                        msg: 'No User Found'
                    });
                }
            }
        });

        // } else {
        //     ath = {
        //         status: false,
        //         success: false
        //     };
        //     return res.send({
        //         success: false,
        //         msg: 'Invalid Token'
        //     });
        // }

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

    // } catch (error) {
    //     console.log(error);
    // }

}

