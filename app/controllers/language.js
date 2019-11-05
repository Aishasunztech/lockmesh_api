const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');

var data;

exports.getLanguage = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            var d_lng_id = 1;
            var sQry = `SELECT dealer_lng_id FROM dealer_language WHERE dealer_id = '${dealer_id}' LIMIT 1`;
            var dLang = await sql.query(sQry);
            if (dLang.length) {
                d_lng_id = dLang[0].dealer_lng_id;
            }

            if (d_lng_id == undefined || d_lng_id === "undefined" || d_lng_id == '' || d_lng_id == null || d_lng_id === 'null' || d_lng_id == '0') {
                d_lng_id = 1;
            }
            var obj = {}
            if (d_lng_id === 1) {
                obj = require("../../languages/en.json");
                obj["lng_id"] = d_lng_id;
            } else if (d_lng_id === 2) {
                obj = require("../../languages/fr.json");
                obj["lng_id"] = d_lng_id;
            }
            res.send({
                status: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Success"), // 'success',
                data: JSON.stringify(obj)
            })
            return;
            // let selectQuery = `SELECT LT.lng_id, LT.key_id, LT.key_value FROM dealer_language AS dl 
            // JOIN lng_translations AS LT 
            // ON (LT.lng_id = dl.dealer_lng_id AND dl.dealer_lng_id != '0') 
            // WHERE dl.dealer_id=${dealer_id}`;

            // sql.query(selectQuery, async function (err, rslt) {
            //     if (err) console.log(err);

            //     // console.log('rslt is: ', rslt)

            //     if (rslt && rslt.length > 0) {
            //         // let obj = {}
            //         // console.log('-------------- 01')
            //         rslt.forEach((elem) => {
            //             let key_id = elem.key_id;
            //             obj[key_id] = elem.key_value
            //         })

            //     } else {

            //         // console.log('-------------- 02')

            //         // Now get English language
            //         let selectQuery = `SELECT key_id, key_value FROM lng_translations WHERE lng_id='1'`;
            //         sql.query(selectQuery, async function (err, rslt) {
            //             if (err) console.log(err);

            //             // console.log('-------------- 03', rslt)
            //             if (rslt.length > 0) {
            //                 let obj = {}
            //                 rslt.forEach((elem) => {
            //                     let key_id = elem.key_id;
            //                     obj[key_id] = elem.key_value
            //                 })
            //                 obj["lng_id"] = '1';
            //                 res.send({
            //                     status: true,
            //                     msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "Success"), // 'success',
            //                     data: JSON.stringify(obj)
            //                 })
            //                 return;
            //             } else {
            //                 console.log('-------------- 04')
            //                 data = {
            //                     status: false,
            //                     msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No data"), // 'No data',
            //                     data: {}
            //                 }
            //                 res.send(data)
            //                 return;
            //             }


            //         });

            //     }
            // })
        }
    }
}


exports.saveLanguage = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        // console.log('save lang body is: ', req.body);
        let lang_id = req.body.language.id;
        // let language = req.body.language;
        // let dealer_lan_id = req.body.language.language_id;
        // console.log('------------------------------')
        // console.log('dealer lang id is: ', dealer_lan_id)
        // console.log('dealer lang id is: ', language)
        // console.log('------------------------------')

        let dealer_id = verify.user.dealer_id;
        if (dealer_id && lang_id) {
            // language = JSON.stringify(language);
            let updateQuery = "UPDATE dealer_language SET dealer_lng_id='" + lang_id + "' WHERE dealer_id='" + dealer_id + "'";
            sql.query(updateQuery, async (err, rslt) => {
                if (err) {
                    console.log(err)
                }

                if (rslt) {
                    if (rslt.affectedRows) {
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.LANGUAGE_CHANGED_SUCCESSFULLY], "Language changed Successfully"), // 'Language changed Successfully'
                        }
                        res.send(data)
                    } else {
                        let insertQuery = "INSERT INTO dealer_language (dealer_id, dealer_lng_id) VALUES ('" + dealer_id + "', '" + lang_id + "')";
                        let inserted = sql.query(insertQuery);
                        if (inserted) {
                            data = {
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.LANGUAGE_CHANGED_SUCCESSFULLY], "Language changed Successfully"), // 'Language changed Successfully'
                            }
                            res.send(data)
                        } else {
                            data = {
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], "Error while Process"), // 'Error while Process'
                            }
                            res.send(data)
                        }
                    }

                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], "Error while Process"), // 'Error while Process'
                    }
                    res.send(data)
                }
            })
        }

    }
}

exports.getAll_Languages = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let languages = [];
        let selectQuery = "SELECT * FROM languages";
        languages = await sql.query(selectQuery);

        if (languages.length) {
            res.send({
                status: true,
                data: languages
            });
        } else {
            res.send({
                status: false,
                data: []
            })
        }
    }
};
