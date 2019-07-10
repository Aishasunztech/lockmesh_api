const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');

// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no"


var data;
exports.getLanguage = async function (req, res) {
    var verify = req.decoded;

    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        let dealer_id = verify.user.dealer_id;
        if (dealer_id) {
            let selectQuery = `SELECT LT.key_id, LT.key_value FROM dealer_language AS dl 
            JOIN lng_translations AS LT 
            ON (LT.lng_id = dl.dealer_lng_id) 
            WHERE dl.dealer_id=${dealer_id}`;

            sql.query(selectQuery, async function (err, rslt) {
                if (err) console.log(err);

                if (rslt && rslt.length) {
                    let obj = {}
                    rslt.forEach((elem) => {
                        let key_id = elem.key_id;
                        obj[key_id] = elem.key_value
                    })
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // 'success',
                        data: JSON.stringify(obj)
                    }
                    res.send(data)
                    return;
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], MsgConstants.NO_DATA_FOUND), // 'No data',
                        data: {}
                    }
                    res.send(data)
                    return;
                }
            })
        }
    }
}


exports.saveLanguage = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        // console.log('save lang body is: ', req.body);
        let lang_id = req.body.language.id;
        let language = req.body.language;
        let dealer_lan_id = req.body.language.language_id;
        // console.log('------------------------------')
        // console.log('dealer lang id is: ', dealer_lan_id)
        // console.log('dealer lang id is: ', language)
        // console.log('------------------------------')

        let dealer_id = verify.user.dealer_id;
        console.log(dealer_id, 'dealer id is', verify.user)
        if (dealer_id && language) {
            language = JSON.stringify(language);
            let updateQuery = "UPDATE dealer_language SET dealer_lng_id='" + lang_id + "' WHERE dealer_id='" + dealer_id + "'";
            sql.query(updateQuery, async (err, rslt) => {
                if (err) {
                    console.log(err)
                }

                if (rslt) {
                    if (rslt.affectedRows) {
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.LANGUAGE_CHANGED_SUCCESSFULLY], MsgConstants.LANGUAGE_CHANGED_SUCCESSFULLY), // 'Language changed Successfully'
                        }
                        res.send(data)
                    } else {
                        let insertQuery = "INSERT INTO dealer_language (dealer_id, dealer_lng_id) VALUES ('" + dealer_id + "', '" + lang_id + "')";
                        let inserted = sql.query(insertQuery);
                        if (inserted) {
                            data = {
                                status: true,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.LANGUAGE_CHANGED_SUCCESSFULLY], MsgConstants.LANGUAGE_CHANGED_SUCCESSFULLY), // 'Language changed Successfully'
                            }
                            res.send(data)
                        } else {
                            data = {
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], MsgConstants.ERROR_PROC), // 'Error while Process'
                            }
                            res.send(data)
                        }
                    }

                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], MsgConstants.ERROR_PROC), // 'Error while Process'
                    }
                    res.send(data)
                }
            })
        }

    }
}

exports.languages = async function (req, res) {
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
