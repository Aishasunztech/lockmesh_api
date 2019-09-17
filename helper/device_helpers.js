var express = require('express');
const { sql } = require('../config/database');

var fs = require("fs");
var path = require('path');

// let usr_acc_query_text = "usr_acc.id,usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name";

var Constants = require('../constants/Application');

module.exports = {
    checkNotNull: function (value) {
        if (value === undefined || value === 'undefined' || value === false || value === 'false' || value === 0 || value === '0' || value === '' || value === null || value === 'null') {
            return false;
        } else {
            return true;
        }
    },
    onlineOfflineDevice: async function (deviceId = null, sessionId, status, PK_DeviceID = null) {
        // try {
        let query = "";
        if (deviceId) {
            console.log("device online")
            query = `UPDATE devices SET session_id='${sessionId}', online='${status}' WHERE device_id='${deviceId}'`;
        } else {
            console.log("device offline")
            query = `UPDATE devices SET online = '${status}', session_id=null WHERE session_id='${sessionId.replace(/['"]+/g, '')}'`;
        }

        let res = await sql.query(query);
        if (res) {
            if (PK_DeviceID) {
                query = `SELECT dvc.id, dvc.device_id, dvc.session_id, dvc.ip_address, dvc.mac_address, usr_acc.dealer_id FROM devices AS dvc LEFT JOIN usr_acc ON(usr_acc.device_id = dvc.id) WHERE dvc.id = ${PK_DeviceID}`;
                let loginDevice = await sql.query(query);

                query = `INSERT INTO login_history (device_id, dealer_id, socket_id, ip_address, mac_address, logged_in_client, type) VALUES (${PK_DeviceID}, '${loginDevice[0].dealer_id}', '${loginDevice[0].session_id}', '${loginDevice[0].ip_address}', '${loginDevice[0].mac_address}', 'device', 'socket');`;
                await sql.query(query);
            }
            return true;
        }
        return false;
        // } catch (error) {
        //     console.log("UPDATE devices SET session_id='" + sessionId + "', online='" + status + "' WHERE device_id='" + deviceId + "'")
        // }

    },
    getSessionIdByDeviceId: async function (deviceId) {
        var query = "SELECT session_id FROM devices WHERE device_id ='" + deviceId + "';";
        let res = await sql.query(query);
        if (res.length) {
            return res;
        }
        return null;
    },
    getDeviceIdBySessionId: async function (sessionId) {
        var query = "SELECT device_id FROM devices WHERE session_id ='" + sessionId + "';";
        let res = await sql.query(query);
        if (res.length) {
            return res;
        }
        return null;
    },
    getDeviceSyncStatus: async function (dvcId) {
        var deviceQ = "SELECT is_sync FROM devices WHERE device_id ='" + dvcId + "'";
        let res = await sql.query(deviceQ);
        // console.log(res);
        if (res.length) {
            return (res[0].is_sync == 1) ? true : false;
        }
        return null;
    },
    getDvcIDByDeviceID: async (deviceId) => {
        let deviceQ = "SELECT device_id FROM devices WHERE id=" + deviceId;
        let device = await sql.query(deviceQ);
        if (device.length) {
            return device[0].device_id;
        } else {
            return false;
        }
    },
    getIDByStringDeviceID: async (deviceId) => {
        let deviceQ = "SELECT id FROM devices WHERE device_id='" + deviceId + "'";
        let device = await sql.query(deviceQ);
        if (device.length) {
            return device[0].id;
        } else {
            return false;
        }
    },

    // socket helpers
    deviceSynced: async function (deviceId) {
        var updateQuery = "UPDATE devices set is_sync=1 WHERE device_id='" + deviceId + "'";
        await sql.query(updateQuery);
        console.log("device synced");
    },

    // applications
    insertApps: async function (apps, deviceId) {
        console.log('insertApps');

        let deviceData = await this.getDeviceByDeviceId(deviceId);

        if (deviceData != null) {
            if (apps !== null) {
                await sql.query(`DELETE FROM user_apps WHERE device_id = ${deviceData.id}`);

                apps.forEach(async (app) => {
                    console.log("insertApp: ", app.uniqueName);

                    let default_app = (app.defaultApp !== undefined && app.defaultApp !== null) ? app.defaultApp : (app.default_app !== undefined && app.default_app !== null) ? app.default_app : false;
                    let system_app = (app.systemApp !== undefined && app.systemApp !== null) ? app.systemApp : (app.system_app !== undefined && app.system_app !== null) ? app.system_app : false;

                    // icon uniqueness
                    // let iconName = this.uploadIconFile(app, app.label);
                    let iconName = this.uploadIconFile(app, app.label, app.packageName);

                    let query = `INSERT INTO apps_info (unique_name, label, package_name, icon, extension, visible, default_app, system_app)
                        VALUES ('${app.uniqueName}', '${app.label}', '${app.packageName}', '${iconName}', ${app.extension} , ${app.visible}, ${default_app}, ${system_app})
                        ON DUPLICATE KEY UPDATE
                        extension= ${app.extension},
                        icon= '${iconName}',
                        visible= ${app.visible},
                        default_app= ${default_app},
                        system_app= ${system_app} 
                        `;

                    // " label= '" + app.label +"',"+
                    // " icon= '" + app.icon +"'," +

                    //  console.log("update query error : ", query);

                    // var query = "INSERT IGNORE INTO apps_info (unique_name, label, package_name, icon, extension, visible, default_app) VALUES ('" + app.uniqueName + "', '" + app.label + "', '" + app.packageName + "', '" + iconName + "', " + app.extension + " , " + app.visible + ", " + default_app + ")";
                    await sql.query(query);

                    await this.getApp(app.uniqueName, deviceData.id, app.guest, app.encrypted, app.enable);

                });
            } else {
                console.log("apps are empty")
            }
        } else {
            console.log("device not connected may be deleted");
        }

    },

    // extensions
    insertExtensions: async function (extensions, deviceId) {
        console.log("insertExtensions")
        let deviceData = await this.getDeviceByDeviceId(deviceId);
        if (extensions) {

            // delete extension settings before insert

            extensions.forEach(async (app) => {
                console.log("extension: ", app.uniqueName);

                let getPrntExt = `SELECT id FROM apps_info WHERE (unique_name='${app.uniqueName}' AND (extension=1 OR extension=true) AND extension_id=0) `;

                // console.log("extension query: ", getPrntExt);
                let extension = await sql.query(getPrntExt);
                if (extension.length) {

                    let iconName = this.uploadIconFile(app, app.label, app.uniqueExtension);
                    console.log("extension Icon Name: ", iconName);

                    // var query = "INSERT INTO apps_info (unique_name, label, icon, extension, extension_id) VALUES ('" + app.uniqueExtension + "', '" + app.label + "', '" + iconName + "', 1, " + extension[0].id + ") " +
                    //     " ON DUPLICATE KEY UPDATE " +
                    //     // " label= '" + app.label +"',"+
                    //     // " icon= '" + app.icon +"'," +
                    //     " extension= 1, " +
                    //     // " visible= " + app.visible + ", " +
                    //     " default_app= 0  "

                    var query = `INSERT INTO apps_info (unique_name, label, icon, extension, extension_id) VALUES ('${app.uniqueExtension}', '${app.label}', '${iconName}', 1, ${extension[0].id})
                        ON DUPLICATE KEY UPDATE
                        icon= '${iconName}',
                        extension= 1,
                        default_app= 0  `;
                    // console.log("extension Query: ", query);
                    // " label= '${app.label}',
                    // " visible= " + app.visible + ", " +

                    await sql.query(query);
                    console.log("inserting extension")
                    await this.getExtension(app.uniqueExtension, deviceData.id, app.guest, app.encrypted, true);
                }
            });
        } else {
            console.log("Extensions not found");
        }
    },

    // settings
    insertOrUpdateSettings: async function (controls, device_id) {
        try {
            console.log("testing", controls);
            var updateQuery = `REPLACE INTO user_app_permissions (device_id, permissions) VALUE ('${device_id}', '${controls}')`;
            await sql.query(updateQuery);
        } catch (error) {
            console.log("insert setting error", error);
        }

    },

    // ============ update when come from history may be
    updateApps: async function (apps, deviceId) {
        try {

            let deviceData = await this.getDeviceByDeviceId(deviceId);

            if (deviceData != null) {
                if (apps !== null) {

                    apps.forEach(async (app) => {

                        if (app.isChanged) {
                            if (app.id && app.guest !== undefined && app.enable !== undefined && app.encrypted != undefined) {
                                let updateApp = `UPDATE user_apps SET guest=${app.guest}, enable=${app.enable}, encrypted=${app.encrypted} WHERE id=${app.id}`;
                                await sql.query(updateApp);
                            }
                        }

                    });
                }
            } else {
                console.log("device may be deleted");
            }
        } catch (error) {
            console.log(error);
        }
    },

    updateExtensions: async function (extensions, deviceId) {
        if (extensions) {
            extensions.forEach(async (app) => {
                if (app.isChanged) {
                    console.log(app.id);
                    if (app.id) {
                        let updateApp = `UPDATE user_apps SET guest=${app.guest}, encrypted=${app.encrypted} WHERE id=${app.id}`;
                        await sql.query(updateApp);
                    }
                }
            });
        }
    },


    getApp: async function (uniqueName, device_id, guest, encrypted, enable) {

        var query = "SELECT id FROM apps_info WHERE unique_name='" + uniqueName + "'limit 1";
        // console.log(query);
        let response = await sql.query(query);
        // console.log('res', response, 'for getApp')
        if (response.length) {
            await this.insertOrUpdateApps(response[0].id, device_id, guest, encrypted, enable);
        } else {
            // console.log("app not found");
            return false;
        }
    },
    insertOrUpdateApps: async function (appId, deviceId, guest, encrypted, enable) {
        try {

            var updateQuery = `UPDATE user_apps SET guest=${guest}, encrypted=${encrypted}, enable=${enable} WHERE device_id=${deviceId} AND app_id=${appId}`;

            let row = await sql.query(updateQuery);

            if (row.affectedRows === 0) {
                var insertQuery = `INSERT IGNORE INTO user_apps (device_id, app_id, guest, encrypted, enable) VALUES (${deviceId}, ${appId}, ${guest}, ${encrypted}, ${enable})`;
                await sql.query(insertQuery);
            }
            // let updateQuery = "INSERT INTO user_apps (device_id, app_id, guest, encrypted, enable) VALUES (" + deviceId + ", " + appId + ", " + guest + ", " + encrypted + ", " + enable + " ) " +
            //     " ON DUPLICATE KEY UPDATE " +
            //     " guest = " + guest + ", " +
            //     " encrypted = " + encrypted + ", " +
            //     " enable = " + enable + " ";
            // // var updateQuery = "UPDATE user_apps SET guest=" + guest + " , encrypted=" + encrypted + " , enable=" + enable + "  WHERE device_id=" + deviceId + "  AND app_id=" + appId;
            // sql.query(updateQuery);

        } catch (error) {
            console.log("insert or update apps error:", error);
        }

    },

    getExtension: async function (uniqueName, device_id, guest, encrypted, enable) {
        console.log("getExtension() ");
        var query = "SELECT id FROM apps_info WHERE unique_name='" + uniqueName + "'limit 1";
        // console.log(query);
        let response = await sql.query(query);
        // console.log('res', response, 'for getApp')
        if (response.length) {
            await this.insertOrUpdateExtensions(response[0].id, device_id, guest, encrypted, enable);
        } else {
            // console.log("app not found");
            return false;
        }
    },

    insertOrUpdateExtensions: async function (appId, deviceId, guest, encrypted, enable) {
        try {

            var updateQuery = `UPDATE user_apps SET guest=${guest}, encrypted=${encrypted}, enable=${enable} WHERE device_id=${deviceId} AND app_id=${appId}`;

            sql.query(updateQuery, async function (error, row) {
                if (error) {
                    console.log(error)
                }

                console.log("insert or update device apps");
                if (row && row.affectedRows === 0) {
                    var insertQuery = `INSERT IGNORE INTO user_apps (device_id, app_id, guest, encrypted, enable) VALUES (${deviceId}, ${appId}, ${guest}, ${encrypted}, ${enable})`;
                    await sql.query(insertQuery);
                }
            });

            // let updateQuery = "INSERT INTO user_apps (device_id, app_id, guest, encrypted, enable) VALUES (" + deviceId + ", " + appId + ", " + guest + ", " + encrypted + ", " + enable + " ) " +
            //     " ON DUPLICATE KEY UPDATE " +
            //     " guest = " + guest + ", " +
            //     " encrypted = " + encrypted + ", " +
            //     " enable = " + enable + " ";
            // // var updateQuery = "UPDATE user_apps SET guest=" + guest + " , encrypted=" + encrypted + " , enable=" + enable + "  WHERE device_id=" + deviceId + "  AND app_id=" + appId;
            // sql.query(updateQuery);

        } catch (error) {
            console.log("insert or update apps error:", error);
        }

    },

    getDeviceByDeviceId: async function (deviceId) {
        // console.log("getDevice: " + deviceId);

        var getQuery = `SELECT * FROM devices WHERE device_id='${deviceId}'`;
        let response = await sql.query(getQuery);

        if (response.length) {
            return response[0];
        } else {
            console.log("device not connected may be deleted");
            return null;
        }

    },
    getOriginalIdByDeviceId: async function (deviceId) {
        var getQuery = "SELECT id FROM devices WHERE device_id='" + deviceId + "'";
        let res = await sql.query(getQuery);
        if (res.length > 0) {

            return res[0].id;
        } else {
            return false;
        }
    },
    getUsrAccIDbyDvcId: async (dvc_id) => {
        var usrAcc = "SELECT id FROM usr_acc WHERE device_id = " + dvc_id;
        let res = await sql.query(usrAcc);
        if (res.length > 0) {
            return res[0].id;
        } else {
            return false;
        }
    },
    getUserAccByDeviceId: async (deviceId) => {
        var device = await sql.query("SELECT * FROM devices WHERE device_id='" + deviceId + "'");
        if (device.length) {
            var usrAcc = await sql.query("SELECT * FROM usr_acc WHERE device_id =" + device[0].id);
            if (usrAcc.length) {
                return usrAcc[0];
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    getUserAccByDvcId: async (dvcId) => {
        // console.log(dvcId);
        // console.log("SELECT * FROM usr_acc WHERE device_id =" + dvcId);
        var usrAcc = await sql.query("SELECT * FROM usr_acc WHERE device_id =" + dvcId);
        if (usrAcc.length) {
            return usrAcc[0];
        } else {
            return false;
        }
    },
    uploadIconFile: function (app, iconName, packageName) {
        // let base64Data = "data:image/png;base64,"+ btoa(icon);
        if (app.icon !== undefined) {

            if (typeof app.icon !== 'string' && typeof app.icon !== 'String' && typeof app.icon !== String) {
                console.log("logo uploading: ", packageName);
                var base64Data = Buffer.from(app.icon).toString("base64");

                let icon = `../uploads/icon_${packageName}_${iconName}.png`;

                let file = path.join(__dirname, icon)

                // previous method not valid dir but was working
                // fs.writeFile("./uploads/icon_" + iconName + ".png", base64Data, 'base64', function (err) {
                //     if (err) console.log(err);
                // });

                fs.writeFile(file, base64Data, 'base64', function (err) {
                    if (err) console.log("icon writing error: ", err);
                });

            } else if (typeof app.icon === 'string' || typeof app.icon === String) {
                // var bytes = app.icon.split(",");
                // var base64Data = Buffer.from(bytes).toString("base64");

                // fs.writeFile("./uploads/icon_" + iconName + ".png", base64Data, 'base64', function (err) {
                //     console.log("file error", err);
                // });

            } else {
                console.log("icon type is: ", typeof app.icon)
            }

        } else {
            console.log("icon was undefined");
        }

        // changed because label was same and application was difficult to differenciate
        // return "icon_" + iconName + ".png"
        return `icon_${packageName}_${iconName}.png`;

    },
    isDeviceOnline: async function (device_id) {
        let query = `SELECT online FROM devices WHERE device_id='${device_id}'`;
        let res = await sql.query(query);

        if (res.length) {
            if (res[0].online === Constants.DEVICE_ONLINE) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    checkStatus: function (device) {
        let status = "";

        if (!device.flagged) {
            device.flagged = null;
        }

        // console.log('checkStatus : ', device)

        if ((device.unlink_status === '1' || device.unlink_status === 1) && (device.device_status === 0 || device.device_status === '0')) {
            // status = 'Unlinked';
            status = Constants.DEVICE_UNLINKED;
        }
        else if (device.transfer_status == 1 && device.account_status === 'suspended' && device.flagged !== 'Not flagged') {
            status = Constants.DEVICE_TRANSFERED
        }
        else if (device.transfer_status == 0 && device.account_status === 'suspended' && device.flagged != 'Not flagged') {
            status = Constants.DEVICE_FLAGGED
        }
        else if (device.status === 'active' && (device.account_status === '' || device.account_status === null) && device.unlink_status === 0 && (device.device_status === 1 || device.device_status === '1')) {
            status = Constants.DEVICE_ACTIVATED
        }
        else if (device.status === 'trial' && (device.account_status === '' || device.account_status === null) && device.unlink_status === 0 && (device.device_status === 1 || device.device_status === '1')) {
            status = Constants.DEVICE_TRIAL
        }
        else if (device.status === 'expired') {
            // status = 'Expired';
            status = Constants.DEVICE_EXPIRED;
        }
        else if ((device.device_status === '0' || device.device_status === 0) && (device.unlink_status === '0' || device.unlink_status === 0) && (device.activation_status === null || device.activation_status === '')) {
            // status = 'Pending activation';
            status = Constants.DEVICE_PENDING_ACTIVATION;
        }
        else if ((device.device_status === '0' || device.device_status === 0) && (device.unlink_status === '0' || device.unlink_status === 0) && (device.activation_status === 0)) {
            status = Constants.DEVICE_PRE_ACTIVATION;
        }
        else if (device.account_status === 'suspended') {
            // status = 'Suspended';
            status = Constants.DEVICE_SUSPENDED;
        }
        else {
            status = 'N/A';
        }
        return status;

    },
    getPgpEmails: async (result) => {
        let query = "SELECT pgp_email FROM pgp_emails WHERE user_acc_id = '" + result.id + "' AND used = 1"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].pgp_email
        }
        else {
            return 'N/A'
        }
    },
    getSimids: async (result) => {
        let query = "SELECT sim_id FROM sim_ids WHERE user_acc_id = '" + result.id + "' AND used = 1"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].sim_id
        } else {
            return 'N/A'
        }
    },
    getChatids: async (result) => {
        let query = "SELECT chat_id FROM chat_ids WHERE user_acc_id = '" + result.id + "' AND used = 1"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].chat_id
        } else {
            return 'N/A'
        }
    },
    getLastLoginDetail: async (result) => {
        let query = `SELECT created_at FROM login_history WHERE device_id = '${result.usr_device_id}' ORDER BY id DESC`;
        let results = await sql.query(query);
        if (results.length) {
            return results[0].created_at
        } else {
            return 'N/A'
        }
    },

    getPgpEmails_deviceList: async (ids) => {


        let query = "SELECT pgp_email ,user_acc_id from pgp_emails WHERE user_acc_id IN (" + ids + ")"
        let results = await sql.query(query);
        if (results.length) {
            return results
        }
        else {
            return []
        }
    },
    /**
     * String ids of usr_acc table
     */
    getSimids_deviceList: async (ids) => {
        let query = "SELECT sim_id,user_acc_id FROM sim_ids WHERE user_acc_id IN (" + ids + ")"
        // console.log(query);
        let results = await sql.query(query);
        if (results.length) {
            return results
        } else {
            return []
        }
    },
    /**
     * String ids of usr_acc table
     */
    getChatids_deviceList: async (ids) => {
        let query = "SELECT chat_id,user_acc_id FROM chat_ids WHERE user_acc_id IN (" + ids + ")"
        let results = await sql.query(query);
        if (results.length) {
            return results
        } else {
            return []
        }
    },
    /**
     * String usr_device_ids of usr_acc table
     */
    getLastLoginDetail_deviceList: async (ids) => {
        let query = `SELECT MAX(created_at) as created_at, device_id FROM login_history WHERE device_id IN (${ids}) GROUP BY device_id ORDER BY created_at DESC  `;
        let results = await sql.query(query);
        if (results.length) {
            return results
        } else {
            return []
        }
    },

    getAppJobQueue: async (device_id) => {

        let policyQueue = "SELECT * FROM policy_queue_jobs WHERE device_id = '" + device_id + "' order by created_at desc limit 1"
        let policy = await sql.query(policyQueue);
        if (policy.length) {
            return {
                data: policy[0],
                type: 'policy'
            }
        } else {
            let query = "SELECT * FROM apps_queue_jobs WHERE device_id = '" + device_id + "' order by created_at desc limit 1"
            let results = await sql.query(query);
            if (results.length) {
                return {
                    data: results[0],
                    type: 'pull_push'

                }
            } else {
                return {
                    data: [],
                    type: ''
                }
            }
        }
    },
    getUserAccountId: async (device_id) => {
        let query = "SELECT usr_acc.id from usr_acc left join devices on devices.id=usr_acc.device_id where devices.device_id='" + device_id + "'"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].id
        } else {
            return ''
        }
    },
    saveActionHistory: async (device, action) => {
        // console.log('SAVE HISTORY', action, device);
        let query = "INSERT INTO acc_action_history (action, device_id, device_name, session_id, model, ip_address, simno, imei, simno2, imei2, serial_number, mac_address, fcm_token, online, is_sync, flagged, screen_start_date, reject_status, account_email, dealer_id, prnt_dlr_id, link_code, client_id, start_date, expiry_months, expiry_date, activation_code, status, device_status, activation_status, wipe_status, account_status, unlink_status, transfer_status, transfer_user_status, transfered_from, transfered_to, user_transfered_from, user_transfered_to, dealer_name, prnt_dlr_name, user_acc_id, pgp_email, chat_id, sim_id, finalStatus) VALUES "
        let finalQuery = ''
        if (action === Constants.DEVICE_UNLINKED || action === Constants.UNLINK_DEVICE_DELETE) {
            finalQuery = query + "('" + action + "','" + device.device_id + "','" + device.name + "','" + device.session_id + "' ,'" + device.model + "','" + device.ip_address + "','" + device.simno + "','" + device.imei + "','" + device.simno2 + "','" + device.imei2 + "','" + device.serial_number + "','" + device.mac_address + "','" + device.fcm_token + "','offline','" + device.is_sync + "','" + device.flagged + "','" + device.screen_start_date + "','" + device.reject_status + "','" + device.account_email + "','" + device.dealer_id + "','" + device.prnt_dlr_id + "','" + device.link_code + "','" + device.client_id + "','', " + device.expiry_months + ",'','" + device.activation_code + "','',0,null,'" + device.wipe_status + "','" + device.account_status + "',1,'" + device.transfer_status + "','" + device.transfer_user_status + "','" + device.transfered_from + "','" + device.transfered_to + "','" + device.user_transfered_from + "','" + device.user_transfered_to + "','" + device.dealer_name + "','" + device.prnt_dlr_name + "','" + device.id + "','" + device.pgp_email + "','" + device.chat_id + "','" + device.sim_id + "','Unlinked')"
        } else {
            finalQuery = query + "('" + action + "','" + device.device_id + "','" + device.name + "','" + device.session_id + "' ,'" + device.model + "','" + device.ip_address + "','" + device.simno + "','" + device.imei + "','" + device.simno2 + "','" + device.imei2 + "','" + device.serial_number + "','" + device.mac_address + "','" + device.fcm_token + "','" + device.online + "','" + device.is_sync + "','" + device.flagged + "','" + device.screen_start_date + "','" + device.reject_status + "','" + device.account_email + "','" + device.dealer_id + "','" + device.prnt_dlr_id + "','" + device.link_code + "', '" + device.client_id + "', '" + device.start_date + "', " + device.expiry_months + ", '" + device.expiry_date + "','" + device.activation_code + "','" + device.status + "','" + device.device_status + "',0,'" + device.wipe_status + "','" + device.account_status + "','" + device.unlink_status + "','" + device.transfer_status + "','" + device.transfer_user_status + "','" + device.transfered_from + "','" + device.transfered_to + "','" + device.user_transfered_from + "','" + device.user_transfered_to + "','" + device.dealer_name + "','" + device.prnt_dlr_name + "','" + device.id + "','" + device.pgp_email + "','" + device.chat_id + "','" + device.sim_id + "','" + device.finalStatus + "')"
        }
        // console.log(finalQuery);
        await sql.query(finalQuery)

    },
    saveImeiHistory: async (deviceId, sn, mac, imei1, imei2) => {
        // console.log("Imei History");
        let response = 0;
        let sqlQuery = "SELECT * from imei_history WHERE device_id = '" + deviceId + "' order by created_at DESC";
        let result = await sql.query(sqlQuery);
        if (result.length) {
            if (imei1 == null) {
                imei1 = result[0].imei1
            }
            else if (imei2 == null) {
                imei2 = result[0].imei2
            }
            if (result[0].imei1 != imei1 || result[0].imei2 != imei2) {
                let query = "INSERT INTO imei_history(device_id, serial_number, mac_address, imei1, imei2) VALUES ('" + deviceId + "','" + sn + "','" + mac + "','" + imei1 + "','" + imei2 + "')"
                let result = await sql.query(query);
                if (result && result.affectedRows) {
                    response = result.insertId
                }
                else {
                    response = 0
                }
            }
            else {
                response = 0
            }
        } else {
            let query = "INSERT INTO imei_history(device_id, serial_number, mac_address, orignal_imei1, orignal_imei2, imei1, imei2) VALUES ('" + deviceId + "','" + sn + "','" + mac + "','" + imei1 + "','" + imei2 + "','" + imei1 + "','" + imei2 + "')"
            let result = await sql.query(query);
            if (result && result.affectedRows) {
                response = result.insertId
            }
            else {
                response = 0
            }
        }
        return response

    },
    checkRemainDays: async (createDate, validity) => {
        var createdDateTime, today, days;
        if (validity != null) {

            createdDateTime = new Date(createDate);
            createdDateTime.setDate(createdDateTime.getDate() + validity);
            today = new Date();
            var difference_ms = createdDateTime.getTime() - today.getTime();

            //Get 1 day in milliseconds
            var one_day = 1000 * 60 * 60 * 24;

            // Convert back to days and return
            days = Math.round(difference_ms / one_day);
        } else {
            days = validity
        }

        if (days > 0) return days; else if (days <= 0 && days !== null) return "Expired"; else return "Not Announced";
    },
    getDeviceInfo: (req) => {
        var imei = req.body.imei;
        var ip = req.body.ip;
        var simNo = req.body.simNo;
        var serial_number = req.body.serialNo;
        var mac_address = req.body.macAddr;
        var type = (req.body.type) ? req.body.type : null
        var version = (req.body.version) ? req.body.version : null

        console.log(version, "Version");

        var imei1 = null;
        var imei2 = null;
        var simNo1 = null;
        var simNo2 = null;
        //geting imei's
        if (imei !== undefined) {
            imei1 = (imei[0] !== undefined && imei[0] !== null && imei[0] !== 'null') ? imei[0] : null;
            imei2 = (imei[1] !== undefined && imei[0] !== null && imei[1] !== 'null') ? imei[1] : null;
        }

        if (simNo !== undefined) {
            simNo1 = (simNo[0] !== undefined && simNo[0] !== null && simNo[0] !== 'null') ? simNo[0] : null;
            simNo2 = (simNo[1] !== undefined && simNo[1] !== null && simNo[0] !== 'null') ? simNo[1] : null;
        }

        return {
            imei1, imei2, simNo1, simNo2, serial_number, ip, mac_address, type, version
        }
    },
    checkvalidImei: async (s) => {
        var etal = /^[0-9]{15}$/;
        if (!etal.test(s))
            return false;
        sum = 0; mul = 2; l = 14;
        for (i = 0; i < l; i++) {
            digit = s.substring(l - i - 1, l - i);
            tp = parseInt(digit, 10) * mul;
            if (tp >= 10)
                sum += (tp % 10) + 1;
            else
                sum += tp;
            if (mul == 1)
                mul++;
            else
                mul--;
        }
        chk = ((10 - (sum % 10)) % 10);
        if (chk != parseInt(s.substring(14, 15), 10))
            return false;
        return true;
    },
    getLinkCodeByDealerId: async (dealer_id) => {
        let query = "SELECT link_code from dealers where dealer_id='" + dealer_id + "'"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].link_code
        } else {
            return ''
        }
    },
    pullAppProcess: async (deviceId, dvcId, apps) => {
        console.log("pullAppProcess");
        for (let i = 0; i < apps.length; i++) {
            if (apps[i].packageName) {

                let appInfoQ = `SELECT * FROM apps_info WHERE package_name = '${apps[i].packageName}'`;
                let appInfo = await sql.query(appInfoQ);
                if (appInfo.length) {
                    appInfo.forEach(async (app) => {
                        let deletePullApp = `DELETE FROM user_apps WHERE (device_id=${dvcId} AND app_id=${app.id})`;
                        await sql.query(deletePullApp);
                    })
                    // let completePushApps = 0
                    // let queueAppsData = await sql.query(`SELECT * FROM apps_queue_jobs WHERE device_id = '${device_id}' AND type = 'push' ORDER BY created_at DESC LIMIT 1`)
                    // if (queueAppsData.length) {

                    //     completePushApps = queueAppsData[0].complete_apps + 1
                    //     await sql.query(`UPDATE apps_queue_jobs SET complete_apps = ${completePushApps} WHERE device_id = '${device_id}' AND type = 'pull'`)

                    //     io.emit(Constants.ACK_SINGLE_PULL_APP + device_id, {
                    //         status: true
                    //     })
                    // }
                } else {
                    console.log("the app that you are trying to pull is not found in db, but on mobile side it pulled");
                    // return null;
                }
            } else {
                console.log("package name is null in uninstall apps");
            }
        }

    },
    pushAppProcess: async function (deviceId, dvcId, apps) {
        console.log("pushAppProcess() ");
        let app_list = [];
        let deviceData = await this.getDeviceByDeviceId(deviceId);

        if (deviceData) {
            if (apps) {

                for (let i = 0; i < apps.length; i++) {
                    let iconName = this.uploadIconFile(apps[i], apps[i].label, apps[i].packageName);
                    await installApps(apps, i, deviceData, iconName, this.getApp);
                    await this.getApp(apps[i].uniqueName, deviceData.id, apps[i].guest, apps[i].encrypted, apps[i].enable);

                    var getAppsQ = `SELECT user_apps.id, user_apps.device_id, user_apps.app_id, user_apps.guest, user_apps.encrypted, user_apps.enable,
				    apps_info.label, apps_info.default_app, apps_info.system_app, apps_info.package_name, apps_info.visible, apps_info.unique_name as uniqueName, apps_info.icon as icon , apps_info.extension, apps_info.extension_id
				    FROM user_apps
				    LEFT JOIN apps_info on (user_apps.app_id = apps_info.id)
				    LEFT JOIN devices on (user_apps.device_id=devices.id)
                    WHERE devices.device_id = '${deviceId}' AND apps_info.package_name='${apps[i].packageName}'`;
                    console.log("getAppsQ: ", getAppsQ);
                    let app = await sql.query(getAppsQ);
                    console.log("getapplication: ", app);
                    if (app.length) {
                        app_list.push(app[0]);
                    }
                }

            } else {
                console.log("apps not found")
            }
        } else {
            console.log("device not found")
        }
        return app_list

    }
}

async function installApps(apps, i, deviceData, iconName, getApp) {
    let default_app = (apps[i].defaultApp !== undefined && apps[i].defaultApp !== null) ? apps[i].defaultApp : (apps[i].default_app !== undefined && apps[i].default_app !== null) ? apps[i].default_app : false;
    let system_app = (apps[i].systemApp !== undefined && apps[i].systemApp !== null) ? apps[i].systemApp : (apps[i].system_app !== undefined && apps[i].system_app !== null) ? apps[i].system_app : false;
    let query = `INSERT INTO apps_info (unique_name, label, package_name, icon, extension, visible, default_app, system_app)
                        VALUES ('${apps[i].uniqueName}', '${apps[i].label}', '${apps[i].packageName}', '${iconName}', ${apps[i].extension} , ${apps[i].visible}, ${default_app}, ${system_app})
                        ON DUPLICATE KEY UPDATE
                        extension= ${apps[i].extension},
                        icon= '${iconName}',
                        visible= ${apps[i].visible},
                        default_app= ${default_app},
                        system_app= ${system_app} 
                        `;
    await sql.query(query);

}
