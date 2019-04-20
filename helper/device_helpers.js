var express = require('express');
const sql = require('../helper/sql.js');
// var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });
var fs = require("fs");
var path = require('path');

// let usr_acc_query_text = "usr_acc.id,usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name";

var Constants = require('../constants/Application');

module.exports = {
    onlineOflineDevice: async function (deviceId = null, sessionId, status) {
        if (deviceId != null) {
            var query = "UPDATE devices SET session_id='" + sessionId + "', online='" + status + "' WHERE device_id='" + deviceId + "';";
            let res = await sql.query(query);
            if (res) {
                return true;
            }
        } else {
            var query = "UPDATE devices SET online = '" + status + "', session_id=null WHERE session_id='" + sessionId.replace(/['"]+/g, '') + "'";
            let res = await sql.query(query);
            if (res) {
                return true;
            }
        }
        return false;
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
    insertApps: async function (apps, deviceId) {
        // console.log("djknjkfnjkafak");
        let deviceData = await this.getDeviceByDeviceId(deviceId);


        if (deviceData != null) {
            // console.log("insertApps device_id:" + deviceData.id);
            // console.log(apps);
            apps.forEach(async (app) => {
                console.log("App Visible:" + app.visible);
                let iconName = this.uploadIconFile(app, app.label);
                // console.log("iconName: " + iconName);
                var query = "INSERT IGNORE INTO apps_info (unique_name, label, package_name, icon, extension ,visible) values ('" + app.uniqueName + "', '" + app.label + "', '" + app.packageName + "', '" + iconName + "', " + app.extension + " , 1)";
                // console.log("helloo: ",query);
                await sql.query(query);
                await this.getApp(app.uniqueName, deviceData.id, app.guest, app.encrypted, app.enable);

            });
        } else {
            console.log("device not connected may be deleted");
        }

    },
    insertExtensions: async function (extensions, deviceId) {
        let deviceData = await this.getDeviceByDeviceId(deviceId);
        // console.log("my extensions", extensions.toString());

        extensions.forEach(async (app) => {
            // console.log("ext object", app.uniqueName);

            let getPrntExt = "SELECT id FROM apps_info WHERE unique_name='" + app.uniqueName + "' AND (extension=1 OR extension=true)";
            // console.log("extension query", getPrntExt);

            let extension = await sql.query(getPrntExt);
            if (extension.length) {
                console.log("parent uniqueName: ", app.uniqueName);
                console.log("child uniqueName: ", app.uniqueExtension);
                console.log("label:", app.label);
                console.log("icon:", app.icon);
                console.log("guest: ", app.guest);
                console.log("encrytped: ", app.encrypted);

                let iconName = this.uploadIconFile(app, app.label);

                var query = "INSERT IGNORE INTO apps_info (unique_name, label, icon, extension, extension_id) VALUES ('" + app.uniqueExtension + "', '" + app.label + "', '" + iconName + "', 1, " + extension[0].id + ")";
                // console.log("helloo:",query);
                await sql.query(query);
                // console.log("inserting extension")
                await this.getApp(app.uniqueExtension, deviceData.id, app.guest, app.encrypted, true);
            }
        });
    },
    insertOrUpdateSettings: async function (permissions, device_id) {
        try {
            // console.log("update or insert settings");
            // console.log(settings);
            var updateQuery = "REPLACE INTO user_app_permissions (device_id, permissions) VALUE ('" + device_id + "', '" + permissions + "')";
            await sql.query(updateQuery, async function (error, row) {
                if (error) throw (error);

                // console.log("check setting update:");
                // console.log(updateQuery);
                // console.log(row);

            });
        } catch (error) {
            console.log(error);
        }

    },
    deviceSynced: async function (deviceId) {
        var updateQuery = "UPDATE devices set is_sync=1 WHERE device_id='" + deviceId + "'";
        await sql.query(updateQuery);
    },
    getApp: async function (uniqueName, device_id, guest, encrypted, enable) {
        // console.log("hello world: " + uniqueName);
        // console.log("device_id: " + device_id);
        // console.log("hello world: " + guest);
        // console.log("hello world: " + encrypted);
        // console.log("hello world: " + enable);
        var query = "SELECT id FROM apps_info WHERE unique_name='" + uniqueName + "' limit 1";
        console.log(query);
        let response = await sql.query(query);
        if (response.length) {
            await this.insertOrUpdateApps(response[0].id, device_id, guest, encrypted, enable);
        } else {
            // console.log("app not found");
            return false;
        }
    },
    insertOrUpdateApps: async function (appId, deviceId, guest, encrypted, enable) {

        try {
            console.log("appId:", appId);
            console.log("deviceId:", deviceId);
            console.log("guest:", guest);
            console.log("encrrypted:", encrypted);
            console.log("enable:", enable);

            var updateQuery = "UPDATE user_apps SET guest=" + guest + " , encrypted=" + encrypted + " , enable=" + enable + "  WHERE device_id=" + deviceId + "  AND app_id=" + appId;
            // console.log("update query", updateQuery);
            sql.query(updateQuery, async function (error, row) {
                console.log("this is", row);
                if (row != undefined && row.affectedRows === 0) {
                    var insertQuery = "INSERT INTO user_apps ( device_id, app_id, guest, encrypted, enable) VALUES (" + deviceId + ", " + appId + ", " + guest + ", " + encrypted + ", " + enable + ")";
                    await sql.query(insertQuery);
                }
            });

        } catch (error) {
            console.log(error);
            throw error;

        }

    },
    getDeviceByDeviceId: async function (deviceId) {
        // console.log("getDevice: " + deviceId);

        var getQuery = "SELECT * FROM devices WHERE device_id='" + deviceId + "'";
        // console.log(getQuery);
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
        var usrAcc = await sql.query("SELECT * FROM usr_acc WHERE device_id =" + dvcId);
        if (usrAcc.length) {
            return usrAcc[0];
        } else {
            return false;
        }
    },
    uploadIconFile: function (app, iconName) {
        // let base64Data = "data:image/png;base64,"+ btoa(icon);
        if (app.icon != undefined && typeof app.icon != 'string') {
            // console.log("icon is available");
            // console.log("uploading icon");
            var base64Data = Buffer.from(app.icon).toString("base64");

            fs.writeFile("./uploads/icon_" + iconName + ".png", base64Data, 'base64', function (err) {
                if (err) console.log(err);
            });

        } else if (typeof app.icon === 'string') {
            console.log("icon was in string type");
            var bytes = app.icon.split(",");
            var base64Data = Buffer.from(bytes).toString("base64");

            fs.writeFile("./uploads/icon_" + iconName + ".png", base64Data, 'base64', function (err) {
                console.log(err);
            });


        } else {

        }

        return "icon_" + iconName + ".png"

    },
    isDeviceOnline: async function (device_id) {
        let query = "SELECT online FROM devices WHERE device_id='" + device_id + "'";
        let res = await sql.query(query);
        // console.log(res);
        if (res.length) {
            if (res[0].online == "On") {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    checkStatus: function (device) {
        let status = "";

        if (device.status === 'active' && (device.account_status === '' || device.account_status === null) && device.unlink_status === 0 && (device.device_status === 1 || device.device_status === '1')) {
            status = Constants.DEVICE_ACTIVATED
        }
        else if (device.status === 'trial' && (device.account_status === '' || device.account_status === null) && device.unlink_status === 0 && (device.device_status === 1 || device.device_status === '1')) {
            status = Constants.DEVICE_TRIAL
        } else if (device.status === 'expired') {
            // status = 'Expired';
            status = Constants.DEVICE_EXPIRED;
        } else if ((device.device_status === '0' || device.device_status === 0) && (device.unlink_status === '0' || device.unlink_status === 0) && (device.activation_status === null || device.activation_status === '')) {
            // status = 'Pending activation';
            status = Constants.DEVICE_PENDING_ACTIVATION;
        } else if ((device.device_status === '0' || device.device_status === 0) && (device.unlink_status === '0' || device.unlink_status === 0) && (device.activation_status === 0)) {
            status = Constants.DEVICE_PRE_ACTIVATION;
        } else if ((device.unlink_status === '1' || device.unlink_status === 1) && (device.device_status === 0 || device.device_status === '0')) {
            // status = 'Unlinked';
            status = Constants.DEVICE_UNLINKED;
        } else if (device.account_status === 'suspended') {
            // status = 'Suspended';
            status = Constants.DEVICE_SUSPENDED;
        } else {
            status = 'N/A';
        }
        return status;

    },
    getPgpEmails: async (result) => {
        let query = "SELECT pgp_email FROM pgp_emails WHERE user_acc_id = '" + result.id + "'"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].pgp_email
        }
        else {
            return 'N/A'
        }
    },
    getSimids: async (result) => {
        let query = "SELECT sim_id FROM sim_ids WHERE user_acc_id = '" + result.id + "'"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].sim_id
        } else {
            return 'N/A'
        }
    },
    getChatids: async (result) => {
        let query = "SELECT chat_id FROM chat_ids WHERE user_acc_id = '" + result.id + "'"
        let results = await sql.query(query);
        if (results.length) {
            return results[0].chat_id
        } else {
            return 'N/A'
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
    // getDealerdata: async (result) => {
    //     let query = "SELECT dealer_name,connected_dealer  FROM dealers WHERE user_acc_id = '" + result.dealer_id + "'"
    //     let results = await sql.query(query);
    //     if (results.length) {
    //         return results[0]
    //     } 
    // }

    // getDeviceDetail: async (device_id, user_type)=> {
    //     sql.query('SELECT devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.transfer_status = 0 AND devices.reject_status = 0 AND devices.id= "'+device_id+'"', async function (error, results, fields) {
    //         if (error) throw error;
    //         if(results.length){
    //             results[0].finalStatus = device_helper.checkStatus(results[0])
    //             results[0].pgp_email = await device_helper.getPgpEmails(results[0])
    //             results[0].sim_id = await device_helper.getSimids(results[0])
    //             results[0].chat_id = await device_helpergetChatids(results[0])
    //             // dealerData = await getDealerdata(results[i]);
    //             return results[0];
    //         }

    // })

    // }
    saveActionHistory: async (device, action) => {
        // console.log('SAVE HISTORY', device);
        let query = "INSERT INTO acc_action_history (action,device_id,device_name,session_id,model,ip_address,simno,imei,simno2,imei2,serial_number,mac_address,fcm_token,online,is_sync,flagged,screen_start_date,reject_status,account_email,dealer_id,prnt_dlr_id,link_code,client_id,start_date,expiry_months,expiry_date,activation_code,status,device_status,activation_status,wipe_status,account_status,unlink_status,transfer_status,dealer_name,prnt_dlr_name,user_acc_id,pgp_email,chat_id,sim_id,finalStatus) VALUES "
        let finalQuery = ''
        if (action === Constants.DEVICE_UNLINKED || action === Constants.UNLINK_DEVICE_DELETE) {
            finalQuery = query + "('" + action + "','" + device.device_id + "','" + device.name + "','" + device.session_id + "' ,'" + device.model + "','" + device.ip_address + "','" + device.simno + "','" + device.imei + "','" + device.simno2 + "','" + device.imei2 + "','" + device.serial_number + "','" + device.mac_address + "','" + device.fcm_token + "','" + device.online + "','" + device.is_sync + "','" + device.flagged + "','" + device.screen_start_date + "','" + device.reject_status + "','" + device.account_email + "','" + device.dealer_id + "','" + device.prnt_dlr_id + "','" + device.link_code + "','" + device.client_id + "','','" + device.expiry_months + "','','" + device.activation_code + "','',0,null,'" + device.wipe_status + "','" + device.account_status + "',1,'" + device.transfer_status + "','" + device.dealer_name + "','" + device.prnt_dlr_name + "','" + device.id + "','" + device.pgp_email + "','" + device.chat_id + "','" + device.sim_id + "','Unlinked')"
        } else if (action === Constants.DEVICE_SUSPENDED || action === Constants.DEVICE_ACTIVATED || action === Constants.DEVICE_FLAGGED || action === Constants.DEVICE_UNFLAGGED || action === Constants.DEVICE_PRE_ACTIVATION || action === Constants.DEVICE_ACCEPT) {
            finalQuery = query + "('" + action + "','" + device.device_id + "','" + device.name + "','" + device.session_id + "' ,'" + device.model + "','" + device.ip_address + "','" + device.simno + "','" + device.imei + "','" + device.simno2 + "','" + device.imei2 + "','" + device.serial_number + "','" + device.mac_address + "','" + device.fcm_token + "','" + device.online + "','" + device.is_sync + "','" + device.flagged + "','" + device.screen_start_date + "','" + device.reject_status + "','" + device.account_email + "','" + device.dealer_id + "','" + device.prnt_dlr_id + "','" + device.link_code + "','" + device.client_id + "','" + device.start_date + "','" + device.expiry_months + "','" + device.expiry_date + "','" + device.activation_code + "','" + device.status + "','" + device.device_status + "','" + device.activation_status + "','" + device.wipe_status + "','" + device.account_status + "','" + device.unlink_status + "','" + device.transfer_status + "','" + device.dealer_name + "','" + device.prnt_dlr_name + "','" + device.id + "','" + device.pgp_email + "','" + device.chat_id + "','" + device.sim_id + "','" + device.finalStatus + "')"
        }
        // console.log(finalQuery); finalQuery
        await sql.query(finalQuery)

    },
}