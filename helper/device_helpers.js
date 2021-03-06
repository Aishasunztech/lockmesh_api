var express = require('express');
const { sql } = require('../config/database');
var moment = require("moment-strftime");
var fs = require("fs");
var path = require('path');
// var general_helpers = require('./general_helper')
var socket_helpers = require('./socket_helper')
var forge = require('node-forge');

// let usr_acc_query_text = "usr_acc.id,usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name";

var Constants = require('../constants/Application');
let usr_acc_query_text = Constants.usr_acc_query_text;

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
            query = `UPDATE devices SET session_id='${sessionId}', online='${status}' , last_login = '${moment().format("YYYY/MM/DD HH:mm:ss")}' WHERE device_id='${deviceId}'`;
        } else {
            console.log("device offline")
            query = `UPDATE devices SET online = '${status}', session_id=null WHERE session_id='${sessionId.replace(/['"]+/g, '')}'`;
        }

        let res = await sql.query(query);
        if (res) {
            if (PK_DeviceID) {
                // query = `SELECT dvc.id, dvc.device_id, dvc.session_id, dvc.ip_address, dvc.mac_address, usr_acc.dealer_id FROM devices AS dvc LEFT JOIN usr_acc ON(usr_acc.device_id = dvc.id) WHERE dvc.id = ${PK_DeviceID}`;
                // let loginDevice = await sql.query(query);

                // query = `INSERT INTO login_history (device_id, dealer_id, socket_id, ip_address, mac_address, logged_in_client, type) VALUES (${PK_DeviceID}, '${loginDevice[0].dealer_id}', '${loginDevice[0].session_id}', '${loginDevice[0].ip_address}', '${loginDevice[0].mac_address}', 'device', 'socket');`;
                // await sql.query(query);


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
        // console.log('insertApps');

        let deviceData = await this.getDeviceByDeviceId(deviceId);

        if (apps && apps.length && deviceData) {

            // this query will delete all apps of device even extension. its working correct because mobile side sent all data again otherwise its wrong
            await sql.query(`DELETE FROM user_apps WHERE device_id = ${deviceData.id}`);
            for (let app of apps) {
                let default_app = (app.defaultApp !== undefined && app.defaultApp !== null) ? app.defaultApp : (app.default_app !== undefined && app.default_app !== null) ? app.default_app : false;
                let system_app = (app.systemApp !== undefined && app.systemApp !== null) ? app.systemApp : (app.system_app !== undefined && app.system_app !== null) ? app.system_app : false;
                let id = 0;

                let checkAppQ = `SELECT id FROM apps_info WHERE unique_name='${app.uniqueName}' LIMIT 1`;
                let checkApp = await sql.query(checkAppQ);
                let iconName = this.uploadIconFile(app, app.label, app.packageName);

                if (checkApp && checkApp.length) {
                    id = checkApp[0].id;

                    let updateAppQ = `UPDATE apps_info SET extension= ${app.extension}, icon= '${iconName}', label= '${app.label}', visible= ${app.visible}, default_app= ${default_app}, system_app= ${system_app} WHERE id=${checkApp[0].id}`
                    console.log("updateApp: ");
                    let updateApp = await sql.query(updateAppQ);

                } else {
                    let insertAppQ = `INSERT INTO apps_info (unique_name, label, package_name, icon, extension, visible, default_app, system_app)
                        VALUES ('${app.uniqueName}', '${app.label}', '${app.packageName}', '${iconName}', ${app.extension} , ${app.visible}, ${default_app}, ${system_app})`;
                    console.log("insertApp: ", insertAppQ);
                    let insertedApp = await sql.query(insertAppQ);
                    if (insertedApp) {
                        id = insertedApp.insertId;
                    }
                }

                if (id) {
                    console.log("insertId App: ", id);
                    await this.insertOrUpdateApps(id, deviceData.id, app.guest, app.encrypted, app.enable);
                }
            }

        } else {
            console.log("device not connected may be deleted or apps was empty");
        }

    },

    insertOrUpdateApps: async function (appId, deviceId, guest, encrypted, enable) {
        // try {
        let checkUserAppQ = `SELECT id FROM user_apps WHERE device_id=${deviceId} AND app_id=${appId}`;

        let checkUserApp = await sql.query(checkUserAppQ);
        console.log(checkUserApp, checkUserApp.length);

        if (checkUserApp && checkUserApp.length) {
            var updateQuery = `UPDATE user_apps SET guest=${guest}, encrypted=${encrypted}, enable=${enable} WHERE id=${checkUserApp[0].id}`;
            console.log(updateQuery);

            let updateApp = await sql.query(updateQuery);

        } else {

            var insertQuery = `INSERT INTO user_apps (device_id, app_id, guest, encrypted, enable) VALUES (${deviceId}, ${appId}, ${guest}, ${encrypted}, ${enable})`;
            console.log(insertQuery);
            let insertApp = await sql.query(insertQuery);
        }

    },

    // extensions
    insertExtensions: async function (extensions, deviceId) {
        console.log("insertExtensions")
        let deviceData = await this.getDeviceByDeviceId(deviceId);
        if (extensions && extensions.length && deviceData) {

            // delete extension settings before insert
            for (let app of extensions) {
                let getPrntExt = `SELECT id FROM apps_info WHERE (unique_name='${app.uniqueName}' AND (extension=1 OR extension=true) AND extension_id=0) `;

                // console.log("extension query: ", getPrntExt);
                let extension = await sql.query(getPrntExt);
                if (extension && extension.length) {

                    let iconName = this.uploadIconFile(app, app.label, app.uniqueExtension);
                    let id = 0;

                    let checkExtQ = `SELECT id FROM apps_info WHERE unique_name='${app.uniqueExtension}' LIMIT 1`;
                    let checkExt = await sql.query(checkExtQ);
                    if (checkExt && checkExt.length) {
                        id = checkExt[0].id;
                        let updateExtQ = `UPDATE apps_info SET icon= '${iconName}', extension= 1, extension_id = ${extension[0].id}, label = '${app.label}', default_app= 0 WHERE id=${checkExt[0].id}`;
                        // console.log('updateExtQ: ', updateExtQ);
                        let updateExt = await sql.query(updateExtQ);
                    } else {
                        let insertExtQ = `INSERT INTO apps_info (unique_name, label, icon, extension, extension_id) VALUES ('${app.uniqueExtension}', '${app.label}', '${iconName}', 1, ${extension[0].id})`;
                        console.log("insertExtQ: ", insertExtQ);
                        let insertExt = await sql.query(insertExtQ)
                        if (insertExt) {
                            id = insertExt.insertId;
                        }
                    }

                    if (id) {
                        // console.log("insertId Extensions: ", id)
                        await this.insertOrUpdateExtensions(id, deviceData.id, app.guest, app.encrypted, true);
                    }
                }
            }

        } else {
            console.log("Extensions not found");
        }
    },

    insertOrUpdateExtensions: async function (appId, deviceId, guest, encrypted, enable) {
        // try {
        console.log(deviceId, appId);
        let checkSubExtQ = `SELECT id FROM user_apps WHERE device_id=${deviceId} AND app_id=${appId}`;
        let checkSubExt = await sql.query(checkSubExtQ);
        console.log(checkSubExt, checkSubExt.length);
        if (checkSubExt && checkSubExt.length) {
            var updateQuery = `UPDATE user_apps SET guest=${guest}, encrypted=${encrypted}, enable=${enable} WHERE device_id=${deviceId} AND app_id=${appId}`;
            console.log("updateExtensionQuery: ");
            let updateExtension = await sql.query(updateQuery);
        } else {
            var insertQuery = `INSERT INTO user_apps (device_id, app_id, guest, encrypted, enable) VALUES (${deviceId}, ${appId}, ${guest}, ${encrypted}, ${enable})`;
            console.log("insertExtension:");
            let insertExtension = await sql.query(insertQuery);
        }

        // } catch (error) {
        //     console.log("insert or update extension error:", error);
        // }

    },

    // settings
    insertOrUpdateSettings: async function (controls, device_id) {
        try {
            let checkSettingQ = `SELECT id FROM user_app_permissions WHERE device_id='${device_id}' LIMIT 1`;
            let checkSetting = await sql.query(checkSettingQ);
            if (checkSetting.length) {
                var updateQuery = `UPDATE user_app_permissions SET permissions ='${controls}' WHERE device_id='${device_id}' `;
                var updateSetting = await sql.query(updateQuery);

            } else {
                var insertQuery = `INSERT INTO user_app_permissions (device_id, permissions) VALUE ('${device_id}', '${controls}')`;
                let insertSetting = await sql.query(insertQuery);
                console.log("insertSetting: ", insertSetting.insertId);
            }
        } catch (error) {
            console.log("insert setting error", error);
        }

    },

    // ============ update when come from history may be
    updateApps: async function (apps, deviceId) {
        try {

            let deviceData = await this.getDeviceByDeviceId(deviceId);

            if (apps && deviceData) {

                apps.forEach(async (app) => {

                    if (app.isChanged) {
                        if (app.id && app.guest !== undefined && app.enable !== undefined && app.encrypted != undefined) {
                            let updateApp = `UPDATE user_apps SET guest=${app.guest}, enable=${app.enable}, encrypted=${app.encrypted} WHERE id=${app.id}`;
                            await sql.query(updateApp);
                        }
                    }

                });
            } else {
                console.log("device may be deleted");
            }
        } catch (error) {
            console.log(error);
        }
    },

    updateExtensions: async function (extensions, deviceId) {
        try {
            let deviceData = await this.getDeviceByDeviceId(deviceId);
            if (extensions && deviceData) {
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
        } catch (error) {
            console.log(error);
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
        if (app.icon) {

            if (typeof app.icon !== 'string' && typeof app.icon !== 'String' && typeof app.icon !== String) {
                // console.log("logo uploading: ", packageName);
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
        else if (device.transfer_status == 1 && device.flagged !== 'Not flagged') {
            status = Constants.DEVICE_TRANSFERED
        }
        else if (device.transfer_status == 0 && device.flagged != 'Not flagged') {
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
        else if (((device.device_status === '0' || device.device_status === 0) && (device.unlink_status === '0' || device.unlink_status === 0) && (device.activation_status === null || device.activation_status === '')) || (device.relink_status === 1 || device.relink_status === '1')) {
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
    /**
     * String ids of usr_acc table
     */
    getPgpEmails: async (ids) => {


        let query = "SELECT pgp_email ,user_acc_id from pgp_emails WHERE user_acc_id IN (" + ids + ") AND used = 1"
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
    getSimids: async (ids) => {
        let query = "SELECT sim_id,user_acc_id FROM sim_ids WHERE user_acc_id IN (" + ids + ") AND used = 1"
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
    getChatids: async (ids) => {
        let query = "SELECT chat_id,user_acc_id FROM chat_ids WHERE user_acc_id IN (" + ids + ") AND used = 1"
        let results = await sql.query(query);
        if (results.length) {
            return results
        } else {
            return []
        }
    },
    /**
    /**
     * String ids of usr_acc table
     */
    getServicesData: async (ids) => {
        console.log('get device ids services: ',ids);
        let query = "SELECT * FROM services_data WHERE user_acc_id IN (" + ids + ") AND (end_date IS NULL OR end_date = '') AND (status = 'active' OR status = 'request_for_cancel' OR status = 'extended') "
        let results = await sql.query(query);
        if (results.length) {
            return results
        } else {
            return []
        }
    },

    getUserAccServicesData: async (ids, servicesIds) => {
        let query = "SELECT * FROM user_acc_services WHERE user_acc_id IN (" + ids + ") AND service_id IN (" + servicesIds + ")"
        // console.log(query);
        let results = await sql.query(query);
        if (results.length) {
            return results
        } else {
            return []
        }
    },

    /** GET DATA PLAN PACKAGES FOR DEVICE LIST */
    getDataPlans: async (servicesIds) => {
        // console.log(servicesIds);
        let query = "SELECT * FROM sim_data_plans WHERE service_id IN (" + servicesIds + ") AND status = 'active'"
        // console.log(query);
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
    getLastLoginDetail: async (ids) => {
        let query = `SELECT MAX(created_at) as created_at, device_id FROM login_history WHERE device_id IN (${ids}) GROUP BY device_id ORDER BY created_at DESC  `;
        let results = await sql.query(query);
        if (results.length) {
            return results
        } else {
            return []
        }
    },

    getVpn: async (result) => {
        let query = "SELECT vpn_id FROM acc_vpn WHERE user_acc_id = '" + result.id + "'"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].vpn_id
        } else {
            return 'NO'
        }
    },

    encryptData: async (data) => {

        let key_1 = "fd3452";
        let key_2 = "y920ww";
        let key_3 = "sdfr234";

        let simpleString = key_1 + data + key_2 + key_3;

        var key = "A61{/>jwE48N{B#*";
        var iv = "P%j.QeM<6S-2p]XX";
        var cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({ iv: iv });
        cipher.update(forge.util.createBuffer(simpleString));
        cipher.finish();
        var encrypted = cipher.output;
        var encodedB64 = forge.util.encode64(encrypted.data);
        var encodedData = encodeURIComponent(encodedB64);

        return encodedData;

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
    saveActionHistory: async (device, action, loggedInUser = '') => {
        // console.log('SAVE HISTORY', action, device);
        let loggedInDealerId = null;
        let loggedInDealerType = '';
        if (loggedInUser) {
            loggedInDealerId = loggedInUser.id;
            loggedInDealerType = loggedInUser.user_type;
        }

        let query = "INSERT INTO acc_action_history (action, device_id, device_name, session_id, model, ip_address, simno, imei, simno2, imei2, serial_number, mac_address, fcm_token, online, is_sync, flagged, screen_start_date, reject_status, account_email, dealer_id, prnt_dlr_id, link_code, client_id, start_date, expiry_months, expiry_date, activation_code, status, device_status, activation_status, wipe_status, account_status, unlink_status, transfer_status, transfer_user_status, transfered_from, transfered_to, user_transfered_from, user_transfered_to, dealer_name, prnt_dlr_name, user_acc_id, pgp_email, chat_id, sim_id, finalStatus, action_by, dealer_type) VALUES "
        let finalQuery = ''
        let accountStatus = '';
        if (device.account_status === 'suspended') {
            accountStatus = device.account_status;
        }
        let parentDealerId = (device.prnt_dlr_id && device.prnt_dlr_id !== "N/A") ? device.prnt_dlr_id : 0;
        if (action === Constants.DEVICE_UNLINKED || action === Constants.UNLINK_DEVICE_DELETE) {
            finalQuery = query + "('" + action + "','" + device.device_id + "','" + device.name + "','" + device.session_id + "' ,'" + device.model + "','" + device.ip_address + "','" + device.simno + "','" + device.imei + "','" + device.simno2 + "','" + device.imei2 + "','" + device.serial_number + "','" + device.mac_address + "','" + device.fcm_token + "','offline','" + device.is_sync + "','" + device.flagged + "','" + device.screen_start_date + "','" + device.reject_status + "','" + device.account_email + "','" + device.dealer_id + "','" + parentDealerId + "','" + device.link_code + "','" + device.client_id + "','', '" + device.expiry_months + "','','" + device.activation_code + "','',0,null,'" + device.wipe_status + "','" + accountStatus + "',1,'" + device.transfer_status + "','" + device.transfer_user_status + "','" + device.transfered_from + "','" + device.transfered_to + "','" + device.user_transfered_from + "','" + device.user_transfered_to + "','" + device.dealer_name + "','" + device.prnt_dlr_name + "','" + device.id + "','" + device.pgp_email + "','" + device.chat_id + "','" + device.sim_id + "','Unlinked'," + loggedInDealerId + ", '" + loggedInDealerType + "')"
        } else {
            finalQuery = query + "('" + action + "','" + device.device_id + "','" + device.name + "','" + device.session_id + "' ,'" + device.model + "','" + device.ip_address + "','" + device.simno + "','" + device.imei + "','" + device.simno2 + "','" + device.imei2 + "','" + device.serial_number + "','" + device.mac_address + "','" + device.fcm_token + "','" + device.online + "','" + device.is_sync + "','" + device.flagged + "','" + device.screen_start_date + "','" + device.reject_status + "','" + device.account_email + "','" + device.dealer_id + "','" + parentDealerId + "','" + device.link_code + "', '" + device.client_id + "', '" + device.start_date + "', '" + device.expiry_months + "', '" + device.expiry_date + "','" + device.activation_code + "','" + device.status + "','" + device.device_status + "',0,'" + device.wipe_status + "','" + accountStatus + "','" + device.unlink_status + "','" + device.transfer_status + "','" + device.transfer_user_status + "','" + device.transfered_from + "','" + device.transfered_to + "','" + device.user_transfered_from + "','" + device.user_transfered_to + "','" + device.dealer_name + "','" + device.prnt_dlr_name + "','" + device.id + "','" + device.pgp_email + "','" + device.chat_id + "','" + device.sim_id + "','" + device.finalStatus + "'," + loggedInDealerId + ", '" + loggedInDealerType + "')"
        }
        // console.log("saveActionHistory:: ", finalQuery);
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

        if (deviceData && apps) {

            for (let i = 0; i < apps.length; i++) {
                // let iconName = this.uploadIconFile(apps[i], apps[i].label, apps[i].packageName);
                await this.installApps(apps[i], deviceData);

                // await this.getApp(apps[i].uniqueName, deviceData.id, apps[i].guest, apps[i].encrypted, apps[i].enable);


                var getAppsQ = `SELECT user_apps.id, user_apps.device_id, user_apps.app_id, user_apps.guest, user_apps.encrypted, user_apps.enable,
				    apps_info.label, apps_info.default_app, apps_info.system_app, apps_info.package_name, apps_info.visible, apps_info.unique_name as uniqueName, apps_info.icon as icon , apps_info.extension, apps_info.extension_id
				    FROM user_apps
				    LEFT JOIN apps_info on (user_apps.app_id = apps_info.id)
				    LEFT JOIN devices on (user_apps.device_id=devices.id)
                    WHERE devices.device_id = '${deviceId}' AND apps_info.package_name='${apps[i].packageName}'`;
                console.log("getAppsQ: ", getAppsQ);
                let app = await sql.query(getAppsQ);

                if (app.length) {
                    app_list.push(app[0]);
                }
            }
        } else {
            console.log("device not found")
        }
        return app_list
    },
    saveSimActionHistory: async function (device_id, action, setting) {
        let InsertQ = `INSERT INTO sim_action_history (device_id, action, settings) VALUES ('${device_id}', '${action}', '${JSON.stringify(setting)}')`;
        console.log("saveSimActionHistory InsertQ ", InsertQ);
        await sql.query(InsertQ);
    },

    installApps: async function (app, deviceData) {
        // let default_app = (apps[i].defaultApp !== undefined && apps[i].defaultApp !== null) ? apps[i].defaultApp : (apps[i].default_app !== undefined && apps[i].default_app !== null) ? apps[i].default_app : false;
        // let system_app = (apps[i].systemApp !== undefined && apps[i].systemApp !== null) ? apps[i].systemApp : (apps[i].system_app !== undefined && apps[i].system_app !== null) ? apps[i].system_app : false;
        // let query = `INSERT INTO apps_info (unique_name, label, package_name, icon, extension, visible, default_app, system_app)
        //                     VALUES ('${apps[i].uniqueName}', '${apps[i].label}', '${apps[i].packageName}', '${iconName}', ${apps[i].extension} , ${apps[i].visible}, ${default_app}, ${system_app})
        //                     ON DUPLICATE KEY UPDATE
        //                     extension= ${apps[i].extension},
        //                     icon= '${iconName}',
        //                     visible= ${apps[i].visible},
        //                     default_app= ${default_app},
        //                     system_app= ${system_app} 
        //                     `;
        // await sql.query(query);

        let default_app = (app.defaultApp !== undefined && app.defaultApp !== null) ? app.defaultApp : (app.default_app !== undefined && app.default_app !== null) ? app.default_app : false;
        let system_app = (app.systemApp !== undefined && app.systemApp !== null) ? app.systemApp : (app.system_app !== undefined && app.system_app !== null) ? app.system_app : false;
        let id = 0;

        let checkAppQ = `SELECT id FROM apps_info WHERE unique_name='${app.uniqueName}' LIMIT 1`;
        let checkApp = await sql.query(checkAppQ);
        let iconName = this.uploadIconFile(app, app.label, app.packageName);

        if (checkApp && checkApp.length) {
            id = checkApp[0].id;

            let updateAppQ = `UPDATE apps_info SET extension= ${app.extension}, icon= '${iconName}', label= '${app.label}', visible= ${app.visible}, default_app= ${default_app}, system_app= ${system_app} WHERE id=${checkApp[0].id}`
            console.log("updateApp: ", updateAppQ);
            let updateApp = await sql.query(updateAppQ);

        } else {
            let insertAppQ = `INSERT INTO apps_info (unique_name, label, package_name, icon, extension, visible, default_app, system_app)
                            VALUES ('${app.uniqueName}', '${app.label}', '${app.packageName}', '${iconName}', ${app.extension} , ${app.visible}, ${default_app}, ${system_app})`;
            console.log("insertApp: ", insertAppQ);
            let insertedApp = await sql.query(insertAppQ);
            if (insertedApp) {
                id = insertedApp.insertId;
            }
        }

        if (id) {
            console.log("insertId App: ", id);
            await this.insertOrUpdateApps(id, deviceData.id, app.guest, app.encrypted, app.enable);
        }

    },


    // Bulk History
    saveBuklActionHistory: async (data, action) => {
        // console.log('saveBuklActionHistory ', action, data);

        let InsertQuery = `INSERT INTO bulk_device_history (action, dealer_ids, user_ids, device_ids, apps, policy, action_by) VALUES ('${action}', '${JSON.stringify(data.dealer_ids)}', '${JSON.stringify(data.user_ids)}', '${JSON.stringify(data.device_ids)}', '${data.apps ? JSON.stringify(data.apps) : "[]"}', '${data.policy ? JSON.stringify(data.policy) : null}', '${data.action_by}');`;
        console.log(InsertQuery);
        await sql.query(InsertQuery);
    },

    // Bulk Msgs
    saveBuklMsg: async function (data) {
        console.log('saveBuklMsg ', data);
        let responseData = [];

        let InsertQuery = `INSERT INTO bulk_messages (repeat_duration, timer_status, dealer_ids, user_ids, device_ids, action_by, msg, date_time, week_day, month_date, month_name) 
        VALUES ('${data.repeat}', '${data.timer}', '${JSON.stringify(data.dealer_ids)}', '${JSON.stringify(data.user_ids)}', '${JSON.stringify(data.device_ids)}', ${data.action_by}, '${data.msg}', '${data.dateTime}', ${data.weekDay}, ${data.monthDate}, ${data.monthName});`;
        console.log(InsertQuery);
        let insertData = await sql.query(InsertQuery);
        if (insertData.affectedRows) {
            let getLastInsertMsg = `SELECT id, repeat_duration, timer_status, msg, date_time, week_day, month_date, month_name, time, created_at FROM bulk_messages WHERE id = ${insertData.insertId} ORDER BY id DESC LIMIT 1;`;
            // console.log("getLastInsertMsg", getLastInsertMsg)
            responseData = await sql.query(getLastInsertMsg);
        }
        return data = {
            status: insertData.affectedRows ? true : false,
            responseData,
            insertId: insertData.insertId
        };
        // return responseData;
    },

    editDeviceAdmin: async (body, verify) => {
        let data = {
            status: false,
            msg: "Internal server error"
        }

        let loggedDealerId = verify.user.id;
        let loggedDealerType = verify.user.user_type;
        let device_id = body.device_id;
        let dealer_id = body.dealer_id;
        let client_id = body.client_id;
        let model = body.model;
        let usr_acc_id = body.usr_acc_id;
        let usr_device_id = body.usr_device_id;
        let prevPGP = body.prevPGP;
        let prevChatID = body.prevChatID;
        let prevSimId = body.prevSimId;
        let prevSimId2 = body.prevSimId2;
        let finalStatus = body.finalStatus;
        var note = body.note;
        var validity = body.validity;
        let start_date = body.start_date;
        let sim_id = body.sim_id;
        let sim_id2 = body.sim_id2;
        let chat_id = body.chat_id;
        let pgp_email = body.pgp_email;
        let service = body.prevService
        let admin_data = await sql.query("SELECT * from dealers WHERE type = 1")
        // console.log(prevPGP, prevSimId2, prevSimId, prevChatID);
        var expiry_date = moment(body.expiry_date).format("YYYY/MM/DD")
        var date_now = moment(new Date()).format('YYYY/MM/DD')
        // console.log(expiry_date, chat_id, pgp_email, sim_id, sim_id2, prevService);
        let common_Query = ""
        let usr_acc_Query = ""

        var checkDevice =
            "SELECT start_date ,expiry_date from usr_acc WHERE device_id = '" +
            usr_device_id +
            "'";
        let rows = await sql.query(checkDevice)
        if (rows && rows.length) {
            let service_id = null
            if (service) {
                service_id = service.id
            }
            if (expiry_date !== rows[0].expiry_date) {
                // console.log(service);
                if (!service_id) {
                    let serviceData = await sql.query(`SELECT * FROM services_data WHERE user_acc_id = ${usr_acc_id} ORDER BY created_at DESC LIMIT 1`)
                    if (serviceData && serviceData.length) {
                        service_id = serviceData[0].id
                    } else {
                        return {
                            status: false,
                            msg: "No service found on this device Please Add service first to use grace days."
                        }
                    }
                }
            }
            if (finalStatus == Constants.DEVICE_PRE_ACTIVATION) {
                var status = "";
            } else if (finalStatus == Constants.DEVICE_EXPIRED) {
                var status = "expired";
            } else {
                var status = "active";
            }

            if (date_now < expiry_date && finalStatus === Constants.DEVICE_EXPIRED) {
                // console.log(device);
                require('./socket_helper').sendDeviceStatus(require("../routes/sockets").baseIo,
                    device_id,
                    "active",
                    true
                );
                status = "active";
            }
            common_Query =
                "UPDATE devices set model = '" +
                model +
                "' WHERE id = '" +
                usr_device_id +
                "'";
            if (
                finalStatus !== Constants.DEVICE_PRE_ACTIVATION
            ) {
                if (expiry_date == 0) {
                    usr_acc_Query =
                        "UPDATE usr_acc set status = '" +
                        status +
                        "',note = '" +
                        note +
                        "' ,client_id = '" +
                        client_id +
                        "', device_status = 1, unlink_status=0 ,  start_date = '" +
                        start_date +
                        "' WHERE device_id = '" +
                        usr_device_id +
                        "'";
                } else {
                    usr_acc_Query =
                        "UPDATE usr_acc set  status = '" +
                        status +
                        "',note = '" +
                        note +
                        "' ,client_id = '" +
                        client_id +
                        "', device_status = 1, unlink_status=0 ,  start_date = '" +
                        start_date +
                        "' ,expiry_date = '" +
                        expiry_date +
                        "' WHERE device_id = '" +
                        usr_device_id +
                        "'";
                }
            } else {
                if (expiry_date == 0) {
                    usr_acc_Query =
                        "UPDATE usr_acc set status = '" +
                        status +
                        "',validity = '" +
                        validity +
                        "' ,note = '" +
                        note +
                        "' ,client_id = '" +
                        client_id +
                        "', device_status = 0, unlink_status=0 ,start_date = '" +
                        start_date +
                        "' WHERE device_id = '" +
                        usr_device_id +
                        "'";
                } else {
                    usr_acc_Query =
                        "UPDATE usr_acc set status = '" +
                        status +
                        "',validity = '" +
                        validity +
                        "' ,note = '" +
                        note +
                        "' ,client_id = '" +
                        client_id +
                        "', device_status = 0, unlink_status=0 ,start_date = '" +
                        start_date +
                        "', expiry_date = '" +
                        expiry_date +
                        "' WHERE device_id = '" +
                        usr_device_id +
                        "'";
                }
            }
            let row = await sql.query(common_Query)
            if (row && row.affectedRows) {
                await sql.query(usr_acc_Query);
                data = {
                    status: true,
                    msg: "Record Updated Successfully."
                }
                if (expiry_date != rows[0].expiry_date) {
                    let grace_days = moment(new Date(expiry_date)).diff(moment(new Date(rows[0].expiry_date)), 'days')
                    let alreadyGraced = await sql.query(`SELECT * FROM grace_days_histories WHERE user_acc_id = ${usr_acc_id} AND service_id = ${service_id}`)
                    let grace_day_query = ''
                    if (alreadyGraced && alreadyGraced.length) {
                        grace_days = moment(new Date(expiry_date)).diff(moment(new Date(alreadyGraced[0].from_date)), 'days')
                        grace_day_query = `UPDATE grace_days_histories SET to_date = '${expiry_date}' , grace_days = ${grace_days} WHERE id = ${alreadyGraced[0].id}`
                    } else {
                        grace_day_query = `INSERT INTO grace_days_histories 
                                    (dealer_id,device_id, user_acc_id , service_id , grace_days , from_date , to_date)
                                    VALUES (${dealer_id} , '${device_id}' ,${usr_acc_id} , ${service_id} , ${grace_days} , '${rows[0].expiry_date}' , '${expiry_date}' )`
                    }
                    let result = await sql.query(grace_day_query)
                    if (result.insertId || result.affectedRows) {
                        let updateService = `UPDATE services_data SET service_expiry_date = '${expiry_date}', grace_days = ${grace_days} WHERE id = ${service_id}`
                        await sql.query(updateService)
                        data.msg = "Grace Days Added SuccessFully."
                    } else {
                        data.msg = "Expiry Date Updated but services not updated"
                    }
                }


                if (pgp_email && pgp_email !== 'N/A' && pgp_email != prevPGP) {
                    console.log("PGP change");
                    let updatePgpEmails =
                        'update pgp_emails set user_acc_id = "' +
                        usr_acc_id +
                        '",  used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '"  where pgp_email ="' +
                        pgp_email +
                        '"';
                    await sql.query(updatePgpEmails);

                    if (
                        finalStatus ===
                        Constants.DEVICE_PRE_ACTIVATION
                    ) {
                        let updatePrevPgp =
                            'update pgp_emails set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where pgp_email ="' +
                            prevPGP +
                            '"';
                        await sql.query(updatePrevPgp);
                    } else {
                        let updatePrevPgp =
                            'update pgp_emails set end_date = "' + date_now + '" where pgp_email ="' +
                            prevPGP +
                            '"';
                        await sql.query(updatePrevPgp);
                    }
                    let getPgp = "SELECT * FROM pgp_emails WHERE pgp_email = '" + pgp_email + "'"
                    sql.query(getPgp, function (err, result) {
                        if (result && result.length) {
                            if (prevPGP === 'N/A') {
                                let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].pgp_email}' , 'pgp_email' , '${start_date}')`
                                sql.query(insertAccService)
                            } else {
                                sql.query(`UPDATE user_acc_services SET product_value = '${pgp_email}' , product_id = ${result[0].id} WHERE service_id= ${service_id} AND product_value = '${prevPGP}'`)
                            }
                        }
                    })

                }
                if (chat_id && chat_id !== 'N/A' && chat_id != prevChatID) {
                    console.log("Chat change");
                    let updateChatIds =
                        'update chat_ids set user_acc_id = "' +
                        usr_acc_id +
                        '", used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '" where chat_id ="' +
                        chat_id +
                        '"';
                    await sql.query(updateChatIds);
                    if (
                        finalStatus ===
                        Constants.DEVICE_PRE_ACTIVATION
                    ) {
                        let updatePrevChat =
                            'update chat_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where chat_id ="' +
                            prevChatID +
                            '"';
                        await sql.query(updatePrevChat);
                    } else {
                        let updatePrevChat =
                            'update chat_ids set end_date = "' + date_now + '" where chat_id ="' +
                            prevChatID +
                            '"';
                        await sql.query(updatePrevChat);
                    }
                    let getChatID = "SELECT * FROM chat_ids WHERE chat_id = '" + chat_id + "'"
                    sql.query(getChatID, function (err, result) {
                        if (result && result.length) {
                            if (prevChatID === 'N/A') {
                                let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].chat_id}' , 'chat_id' , '${start_date}')`
                                sql.query(insertAccService)
                            } else {
                                sql.query(`UPDATE user_acc_services SET product_value = '${chat_id}' WHERE service_id= ${service_id} AND product_value = '${prevChatID}'`)
                            }
                        }
                    })
                }
                if (sim_id && sim_id != 'N/A' && sim_id != prevSimId) {
                    console.log("sim change");

                    // console.log("sim id 2 change");
                    let insertSimIds = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used ,uploaded_by , uploaded_by_id) VALUES ('${sim_id}' , ${usr_acc_id} , '${date_now}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;

                    // let insertSimIds =
                    //     'update sim_ids set user_acc_id = "' +
                    //     usr_acc_id +
                    //     '",  used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '" where sim_id ="' +
                    //     sim_id +
                    //     '"';
                    sql.query(insertSimIds, function (err, result) {
                        if (result && result.insertId) {
                            if (finalStatus != Constants.DEVICE_PRE_ACTIVATION) {
                                require('./general_helper').updateSimStatus(sim_id, 'active')
                            }
                        }
                    });

                    // let updateSimIds =
                    //     'update sim_ids set user_acc_id = "' +
                    //     usr_acc_id +
                    //     '",  used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '" where sim_id ="' +
                    //     sim_id +
                    //     '"';
                    // await sql.query(updateSimIds);
                    if (
                        finalStatus ===
                        Constants.DEVICE_PRE_ACTIVATION
                    ) {
                        let updatePrevSim =
                            'update sim_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where sim_id ="' +
                            prevSimId +
                            '"';
                        await sql.query(updatePrevSim);
                    } else {
                        let updatePrevSim =
                            'update sim_ids set expiry_date = "' + date_now + '" where sim_id ="' +
                            prevSimId +
                            '"';
                        await sql.query(updatePrevSim);
                    }
                    let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id + "'"
                    sql.query(getsimID, function (err, result) {
                        if (result && result.length) {
                            if (prevSimId === 'N/A') {
                                let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id' , '${start_date}')`
                                sql.query(insertAccService)
                            } else {
                                sql.query(`UPDATE user_acc_services SET product_value = '${sim_id}' WHERE service_id= ${service_id} AND product_value = '${prevSimId}'`)
                            }
                        }
                    })


                }
                if (sim_id2 && sim_id2 != 'N/A' && sim_id2 != prevSimId2) {
                    console.log("sim2 change");

                    let insertSimIds = `INSERT INTO sim_ids (sim_id , user_acc_id , start_date , dealer_id , used ,uploaded_by , uploaded_by_id) VALUES ('${sim_id2}' , ${usr_acc_id} , '${date_now}' , ${dealer_id} , 1 , '${verify.user.user_type}' , '${verify.user.id}')`;
                    sql.query(insertSimIds, function (err, result) {
                        if (result && result.insertId) {
                            if (finalStatus != constants.DEVICE_PRE_ACTIVATION) {
                                require('./general_helper').updateSimStatus(sim_id2, 'active')
                            }
                        }
                    });

                    // let updateSimIds =
                    //     'update sim_ids set user_acc_id = "' +
                    //     usr_acc_id +
                    //     '",  used=1 , start_date = "' + date_now + '" , dealer_id = "' + dealer_id + '" where sim_id ="' +
                    //     sim_id +
                    //     '"';
                    // await sql.query(updateSimIds);
                    if (
                        finalStatus ===
                        Constants.DEVICE_PRE_ACTIVATION
                    ) {
                        let updatePrevSim =
                            'update sim_ids set user_acc_id = null,  used=0 , start_date = NULL , dealer_id = null where sim_id ="' +
                            prevSimId +
                            '"';
                        await sql.query(updatePrevSim);
                    } else {
                        let updatePrevSim =
                            'update sim_ids set expiry_date = "' + date_now + '" where sim_id ="' +
                            prevSimId +
                            '"';
                        await sql.query(updatePrevSim);
                    }
                    let getsimID = "SELECT * FROM sim_ids WHERE sim_id = '" + sim_id2 + "'"
                    sql.query(getsimID, function (err, result) {
                        if (result && result.length) {
                            if (prevSimId2 === 'N/A') {
                                let insertAccService = `INSERT INTO user_acc_services (user_acc_id , service_id , product_id, product_value, type , start_date) VALUES(${usr_acc_id} , ${service_id} , ${result[0].id} , '${result[0].sim_id}' , 'sim_id2' , '${start_date}')`
                                sql.query(insertAccService)
                            } else {
                                sql.query(`UPDATE user_acc_services SET product_value = '${sim_id2}' WHERE service_id= ${service_id} AND product_value = '${prevSimId2}'`)
                            }
                        }
                    })
                }

                // console.log(device_id);
                let deviceData = await require('./general_helper').getAllRecordbyUserAccId(usr_acc_id)
                // console.log(deviceData);
                data.data = [deviceData]

                var d = new Date(deviceData.expiry_date);
                var n = d.valueOf();

                socket_helpers.deviceInfoUpdated(require("../routes/sockets").baseIo,
                    device_id,
                    {
                        device_id: deviceData.device_id,
                        expiry_date: n,
                        user_id: deviceData.user_id,
                        sim_id: deviceData.sim_id,
                        sim_id2: deviceData.sim_id2,
                        pgp_email: deviceData.pgp_email,
                        chat_id: deviceData.chat_id
                    }
                );
            }
        }
        // console.log(data)
        return data
    },
    checkValue: value => {
        if (
            value !== undefined &&
            value !== "" &&
            value !== null &&
            value !== "undefined" &&
            value !== "Undefined" &&
            value !== "UNDEFINED" &&
            value !== "null" &&
            value !== "Null" &&
            value !== "NULL"
        ) {
            return value;
        } else {
            return "N/A";
        }
    },

    // get device detail
    getCompleteDetailOfDevice: async function (device_ids) {
        // console.log("device_ids callback func ", device_ids);
        try {
            let query = `SELECT devices.*, ${usr_acc_query_text}, dealers.dealer_name, dealers.connected_dealer FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers ON (usr_acc.dealer_id = dealers.dealer_id) 
                WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.device_id IN (${device_ids.join()}) ORDER BY devices.id DESC`;
            // console.log('query is: ', query);

            let results = await sql.query(query);
            // console.log('result is: ', results)

            if (results.length) {
                let devices_acc_array = [];
                let usr_device_ids_array = []
                for (let i = 0; i < results.length; i++) {
                    devices_acc_array.push(results[i].id)
                    usr_device_ids_array.push(results[i].usr_device_id)
                }
                let user_acc_ids = devices_acc_array.join()
                let usr_device_ids = usr_device_ids_array.join()
                let loginHistoryData = await this.getLastLoginDetail(usr_device_ids)
                let servicesData = await this.getServicesData(user_acc_ids)
                let servicesIds = servicesData.map(item => { return item.id })
                let userAccServiceData = []
                if (servicesIds.length) {
                    userAccServiceData = await this.getUserAccServicesData(user_acc_ids, servicesIds)
                }

                for (var i = 0; i < results.length; i++) {
                    results[i].sim_id = "N/A"
                    results[i].sim_id2 = "N/A"
                    results[i].pgp_email = "N/A"
                    results[i].chat_id = "N/A"

                    let service_id = null
                    let services = servicesData.filter(data => data.user_acc_id === results[i].id);
                    if (services && services.length) {
                        services.map((item) => {
                            if (item.status === 'extended') {
                                results[i].extended_services = item
                            } else {
                                results[i].services = item
                                service_id = item.id
                            }
                        })
                    }
                    let productsData = userAccServiceData.filter(item => item.user_acc_id === results[i].id && item.service_id === service_id);
                    if (productsData && productsData.length) {
                        productsData.map((item) => {
                            if (item.type === 'sim_id') {
                                results[i].sim_id = item.product_value
                            }
                            else if (item.type === 'sim_id2') {
                                results[i].sim_id2 = item.product_value
                            }
                            else if (item.type === 'pgp_email') {
                                results[i].pgp_email = item.product_value
                            }
                            else if (item.type === 'chat_id') {
                                results[i].chat_id = item.product_value
                            }
                        })
                    }

                    let lastOnline = loginHistoryData.find(record => record.device_id == results[i].usr_device_id);
                    if (lastOnline) {
                        results[i].lastOnline = lastOnline.created_at
                    }
                    results[i].finalStatus = await this.checkStatus(
                        results[i]
                    );
                    results[i].validity = await this.checkRemainDays(
                        results[i].created_at,
                        results[i].validity
                    );
                }

                let finalResult = [...results];
                // let checkValue = await this.checkValue;
                for (let device of finalResult) {

                    let remainTermDays = "N/A"

                    if (device.expiry_date !== null) {
                        let startDate = moment(new Date())
                        let expiray_date = new Date(device.expiry_date)
                        let endDate = moment(expiray_date)
                        remainTermDays = endDate.diff(startDate, 'days')
                    }
                    device.remainTermDays = remainTermDays
                    device.account_email = await this.checkValue(device.account_email);
                    device.firmware_info = await this.checkValue(device.firmware_info);
                    device.account_name = await this.checkValue(device.account_name);
                    device.account_status = await this.checkValue(device.account_status);
                    device.activation_code = await this.checkValue(device.activation_code);
                    device.activation_status = await this.checkValue(
                        device.activation_status
                    );
                    device.batch_no = await this.checkValue(device.batch_no);
                    device.chat_id = await this.checkValue(device.chat_id);
                    device.client_id = await this.checkValue(device.client_id);
                    device.connected_dealer = await this.checkValue(
                        device.connected_dealer
                    );
                    device.created_at = await this.checkValue(device.created_at);
                    device.dealer_id = await this.checkValue(device.dealer_id);
                    device.dealer_name = await this.checkValue(device.dealer_name);
                    device.del_status = await this.checkValue(device.del_status);
                    device.device_id = await this.checkValue(device.device_id);
                    device.device_status = await this.checkValue(device.device_status);
                    device.expiry_date = await this.checkValue(device.expiry_date);
                    device.expiry_months = await this.checkValue(device.expiry_months);
                    device.fcm_token = await this.checkValue(device.fcm_token);
                    device.finalStatus = await this.checkValue(device.finalStatus);
                    device.flagged = await this.checkValue(device.flagged);
                    device.id = await this.checkValue(device.id);
                    device.imei = await this.checkValue(device.imei);
                    device.imei2 = await this.checkValue(device.imei2);
                    device.ip_address = await this.checkValue(device.ip_address);
                    device.is_push_apps = await this.checkValue(device.is_push_apps);
                    device.is_sync = await this.checkValue(device.is_sync);
                    device.link_code = await this.checkValue(device.link_code);
                    device.mac_address = await this.checkValue(device.mac_address);
                    device.model = await this.checkValue(device.model);
                    device.name = await this.checkValue(device.name);
                    device.note = await this.checkValue(device.note);
                    device.online = await this.checkValue(device.online);
                    device.pgp_email = await this.checkValue(device.pgp_email);
                    device.prnt_dlr_id = await this.checkValue(device.prnt_dlr_id);
                    device.prnt_dlr_name = await this.checkValue(device.prnt_dlr_name);
                    device.reject_status = await this.checkValue(device.reject_status);
                    device.screen_start_date = await this.checkValue(
                        device.screen_start_date
                    );
                    device.serial_number = await this.checkValue(device.serial_number);
                    device.session_id = await this.checkValue(device.session_id);
                    device.sim_id = await this.checkValue(device.sim_id);
                    device.sim_id2 = await this.checkValue(device.sim_id2)
                    device.simno = await this.checkValue(device.simno);
                    device.simno2 = await this.checkValue(device.simno2);
                    device.start_date = await this.checkValue(device.start_date);
                    device.status = await this.checkValue(device.status);
                    device.transfer_status = await this.checkValue(device.transfer_status);
                    device.unlink_status = await this.checkValue(device.unlink_status);
                    device.updated_at = await this.checkValue(device.updated_at);
                    device.user_id = await this.checkValue(device.user_id);
                    device.usr_device_id = await this.checkValue(device.usr_device_id);
                    device.validity = await this.checkValue(device.validity);
                }

                return finalResult;
            } else {
                return [];
            }
        } catch (error) {
            console.log("error: ", error);
            return [];
        }
    }
}


