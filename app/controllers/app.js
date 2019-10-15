const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const helpers = require('../../helper/general_helper');
var Constants = require('../../constants/Application');
// constants
const ADMIN = "admin";
const DEALER = "dealer";
const SDEALER = "sdealer";
const AUTO_UPDATE_ADMIN = "auto_update_admin";
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version"
let usr_acc_query_text = Constants.usr_acc_query_text;

exports.removeSMApps = async function (req, res) {
    var verify = req.decoded;;
    let ids = req.body.data;

    let result = '';
    if (ids.length > 1) {
        result = await sql.query(`DELETE FROM secure_market_apps WHERE dealer_id =${verify.user.dealer_id}`)
    } else {
        result = await sql.query(`DELETE FROM secure_market_apps WHERE apk_id IN (${ids})`)
    }

    console.log(`DELETE FROM secure_market_apps WHERE apk_id IN (${ids})`);
    console.log(req.body.data, result, verify.user.dealer_id)

    if (result.affectedRows) {
        data = {
            status: true,
            msg: "Remove Secure Market App Successfully"
        }

    } else {
        data = {
            status: false,
            msg: "Secure Market App Not Remove"
        }
    }

    res.send(data);
    return;
}

exports.trasnferApps = async function (req, res) {

    let appKeys = req.body.data
    var verify = req.decoded;
    let space_type = req.body.spaceType;

    console.log('appKeys ==> ', appKeys, "space_type ==> ", space_type);
    // return;
    let toDelete = (appKeys.length === 0) ? "''" : appKeys.join(',')
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        let dealer_type = verify.user.user_type;
        let dealer_id = verify.user.id;
        if (dealer_type === ADMIN) {
            let deleteNotIn = "DELETE FROM secure_market_apps WHERE apk_id NOT IN (" + toDelete + ")"
            // console.log(deleteNotIn);
            await sql.query(deleteNotIn);
        } else {
            let deleteNotIn = "DELETE FROM secure_market_apps WHERE apk_id NOT IN ('" + toDelete + "') AND dealer_id = '" + verify.user.id + " '"
            // console.log(deleteNotIn);
            await sql.query(deleteNotIn);

            let adminAppKeys = await sql.query("SELECT apk_id FROM secure_market_apps WHERE dealer_type = '" + ADMIN + "'");
            adminAppKeys.forEach((item) => {
                let index = appKeys.indexOf(item.apk_id)
                if (index !== -1) {
                    appKeys.splice(index, 1)
                }
            })
        }

        // get all secure markete apps
        let sm_apps = await sql.query("SELECT apk_id FROM secure_market_apps");
        let sm_app_ids = []
        if (sm_apps.length) {
            sm_apps.map((item) => sm_app_ids.push(item.apk_id))
        }
        if (appKeys.length) {
            let insertQuery = "INSERT INTO secure_market_apps (dealer_type,dealer_id, apk_id, space_type) VALUES ";
            let insertValues = ' '
            for (let i = 0; i < appKeys.length; i++) {
                if (sm_app_ids.indexOf(appKeys[i]) !== -1) {
                    continue
                }
                insertValues = insertValues + "('" + dealer_type + "' ," + dealer_id + " , " + appKeys[i] + " , '" + space_type + "'),"
            }
            if (insertValues.length > 1) {
                let query = insertQuery + insertValues;
                query = query.slice(0, query.length - 1)
                console.log(query);
                await sql.query(query);
            }
        }

        where = '';
        if (verify.user.user_type !== ADMIN) {
            apklist = await sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.delete_status = 0 AND apk_details.apk_type != 'permanent'")
            where = "AND (secure_market_apps.dealer_type = 'admin' OR secure_market_apps.dealer_id = '" + verify.user.id + "')"
        }
        else {
            apklist = await sql.query("select * from apk_details where delete_status=0 AND apk_type != 'permanent'")
        }

        sql.query("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id, secure_market_apps.is_restrict_uninstall, secure_market_apps.space_type  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 AND apk_details.apk_type != 'permanent'" + where + " ORDER BY created_at desc", async function (err, results) {
            if (err) {
                console.log(err);
            }

            if (results.length) {
                apklist.forEach((item, index) => {
                    for (let i = 0; i < results.length; i++) {
                        if (item.apk_id === results[i].id) {
                            apklist.splice(index, 1)
                        }
                    }
                })
            } else {
                results = [];
            }

            console.log("results ", results)
            console.log("apklist ", apklist)

            data = {
                status: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.APPS_TRANSFERED_SUSSECFULLY], "Apps Transfered Sussecfully"), // 'Apps Transfered Sussecfully',
                data: {
                    marketApplist: results,
                    availableApps: apklist
                }
            }
            res.send(data);
            return
        })
    }
    else {
        data = {
            "status": false,
        }
        res.send(data)
        return;
    }
}

exports.marketApplist = async function (req, res) {

    var verify = req.decoded;

    var data = [];
    let apklist = []
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        where = '';
        if (verify.user.user_type !== ADMIN) {
            apklist = await sql.query("select dealer_apks.* ,apk_details.* from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.delete_status = 0 AND apk_details.apk_type != 'permanent'")
        }
        else {
            apklist = await sql.query("select * from apk_details where delete_status=0 AND apk_type != 'permanent'")
        }
        if (verify.user.user_type !== ADMIN) {
            where = "AND (secure_market_apps.dealer_type = 'admin' OR secure_market_apps.dealer_id = '" + verify.user.id + "')"
        }
        // console.log("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 " + where + "ORDER BY created_at desc");
        sql.query("SELECT apk_details.* ,secure_market_apps.dealer_type , secure_market_apps.dealer_id , secure_market_apps.is_restrict_uninstall  from apk_details JOIN secure_market_apps ON secure_market_apps.apk_id = apk_details.id where apk_details.delete_status = 0 AND apk_details.apk_type != 'permanent'" + where + "ORDER BY created_at desc", async function (err, results) {
            if (err) {
                console.log(err);
            }

            if (results.length) {
                apklist.forEach((item, index) => {
                    for (let i = 0; i < results.length; i++) {
                        if (item.apk_id === results[i].id) {
                            apklist.splice(index, 1)
                        }
                    }
                })
                data = {
                    status: true,
                    data: {
                        marketApplist: results,
                        availableApps: apklist
                    }

                }
                res.send(data)
            } else {
                data = {
                    status: true,
                    data: {
                        marketApplist: [],
                        availableApps: apklist
                    }
                }
                res.send(data)
            }
        })
    }
    else {
        data = {
            status: false
        }
        res.send(data)
        return;
    }
}


exports.getAppPermissions = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        // let loggedUserType = verify.user.user_type;
        // if (loggedUserType !== Constants.ADMIN) {
        let query = "select id, unique_name as uniqueName, label, package_name as packageName, icon, extension, visible, default_app, extension_id, created_at from default_apps";

        sql.query(query, async (error, apps) => {

            if (error) {
                console.log(error)
            };

            let Extension = [];
            let onlyApps = [];
            for (let item of apps) {
                let subExtension = [];
                // console.log("extenstion id", item.extension_id);
                if (item.extension === 1 && item.extension_id === 0) {
                    // console.log('main', item)
                    Extension.push(item);
                }

                if (item.extension == 0 && item.extension_id === 0) {
                    onlyApps.push(item)
                }
            }

            let newExtlist = [];
            for (let ext of Extension) {
                let subExtension = [];

                for (let item of apps) {
                    // console.log(ext.id, item.extension_id);
                    if (ext.id === item.extension_id) {
                        //  console.log('sub ext item', item.guest)
                        // console.log(ext.unique_name, 'dfs',item.unique_name);
                        subExtension.push({
                            uniqueName: ext.uniqueName,
                            uniqueExtension: item.uniqueName,
                            guest: item.guest != undefined ? item.guest : 0,
                            label: item.label,
                            icon: item.icon,
                            encrypted: item.encrypted != undefined ? item.encrypted : 0,
                            id: item.id,
                            device_id: item.device_id,
                            app_id: item.id,
                            default_app: item.default_app
                        });
                    }

                }


                newExtlist.push({
                    uniqueName: ext.uniqueName,
                    guest: ext.guest != undefined ? ext.guest : 0,
                    encrypted: ext.encrypted != undefined ? ext.encrypted : 0,
                    enable: ext.enable != undefined ? ext.enable : 0,
                    label: ext.label,
                    subExtension: subExtension,
                    extension: ext.extension,
                    default_app: ext.default_app,
                    visible: ext.visible

                })
            }


            res.send({
                status: true,
                extensions: newExtlist,
                appPermissions: onlyApps
            });
        })
    }
    // }

}

exports.getSystemPermissions = async function (req, res) {
    var verify = req.decoded;
    // console.log('get app permisiion si sdaf', verify.status)
    // if (verify.status !== undefined && verify.status == true) {
    if (verify) {
        let query = "SELECT * from default_system_permissions";

        sql.query(query, async (error, systemPermissions) => {

            if (error) {
                console.log(error);
            };

            let data = [];

            for (let sysPermission of systemPermissions) {
                data.push({
                    setting_name: sysPermission.setting_name,
                    setting_status: sysPermission.setting_status
                });
            }


            res.send({
                status: true,
                sysPermissions: data
            });
        })
    }
}