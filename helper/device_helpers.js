var express = require('express');
const sql = require('../helper/sql.js');
// var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });
var fs = require("fs");
var path = require('path');

module.exports = {
    onlineOflineDevice: async function (deviceId = null, sessionId, status) {
        if (deviceId != null) {
            var query = "update devices set session_id='" + sessionId + "', online='" + status + "' where device_id='" + deviceId + "';";
            let res = await sql.query(query);
            if (res) {
                return true;
            }
        } else {
            var query = "update devices set online = '" + status + "', session_id=null where session_id='" + sessionId.replace(/['"]+/g, '') + "'";
            let res = await sql.query(query);
            if (res) {
                return true;
            }
        }
        return false;
    },
    getSessionIdByDeviceId: async function (deviceId) {
        var query = "select session_id from devices where device_id ='" + deviceId + "';";
        let res = await sql.query(query);
        if (res.length) {
            return res;
        }
        return null;
    },
    getDeviceIdBySessionId: async function (sessionId) {
        var query = "select device_id from devices where session_id ='" + sessionId + "';";
        let res = await sql.query(query);
        if (res.length) {
            return res;
        }
        return null;
    },
    insertApps: async function (apps, deviceId) {
        // console.log("djknjkfnjkafak");
        let deviceData = await this.getDeviceByDeviceId(deviceId);

        // console.log("djknjkfnjkafak" + deviceData);

        if (deviceData != null) {
            // console.log("insertApps device_id:" + deviceData.id);
            // console.log(apps);
            apps.forEach(async (app) => {
                // console.log("inserting app:" + app.uniqueName);

                let iconName = this.uploadIconFile(app, app.label);
                // console.log("iconName: " + iconName);

                var query = "insert ignore into apps_info (unique_name,label,package_name,icon) values ('" + app.uniqueName + "','" + app.label + "','" + app.packageName + "','" + iconName + "')";
                // console.log(query);
                await sql.query(query);

                await this.getApp(app.uniqueName, deviceData.id, app.guest, app.encrypted, app.enable);

            });
        } else {
            // console.log("hello world");
        }

    },

    insertOrUpdateSettings: async function (settings, device_id) {
        try {
            // console.log("update or insert settings");
            // console.log(settings);
            var updateQuery = "REPLACE into tbl_device_settings (device_id, settings) value ('" + device_id + "', '" + settings + "')";
            await sql.query(updateQuery, async function (error, row) {
                if (error) {
                    console.log(error);
                }

                // console.log("check setting update:");
                // console.log(updateQuery);
                // console.log(row);

            });
        } catch (error) {
            console.log(error);
        }

    },
    getApp: async function (uniqueName, device_id, guest, encrypted, enable) {
        // console.log("hello world: " + uniqueName);
        // console.log("device_id: " + device_id);
        // console.log("hello world: " + guest);
        // console.log("hello world: " + encrypted);
        // console.log("hello world: " + enable);
        var query = "select id from apps_info where unique_name='" + uniqueName + "' limit 1";
        // console.log(query);
        let response = await sql.query(query);
        if (response.length) {
            await this.insertOrUpdateApps(response[0].id, device_id, guest, encrypted, enable);
        } else {
            // console.log("app not found");
            return false;
        }
    },
    insertOrUpdateApps: async function (appId, deviceId, guest, encrypted, enable) {
        // console.log("update or insert");
        // console.log("appId:" + appId);
        try {
            var updateQuery = "update user_apps set guest=" + guest + " , encrypted=" + encrypted + " , enable=" + enable + " where device_id=" + deviceId + " and app_id=" + appId + "";
            sql.query(updateQuery, async function (error, row) {
                // console.log("app updated:");
                // console.log(updateQuery);
                // console.log(row.affectedRows);    
                if (row != undefined && row.affectedRows == 0) {
                    // console.log("app_setting_inserted");
                    var insertQuery = "insert into user_apps ( device_id, app_id, guest, encrypted, enable) values (" + deviceId + "," + appId + "," + guest + "," + encrypted + "," + enable + ")";
                    await sql.query(insertQuery);
                } else {
                    // console.log("app_setting_updated");
                }
            });

        } catch (error) {
            console.log(error);
        }

    },
    getDeviceByDeviceId: async function (deviceId) {
        // console.log("getDevice: " + deviceId);

        var getQuery = "select id from devices where device_id='" + deviceId + "'";
        // console.log(getQuery);

        let response = await sql.query(getQuery);
        var updateQuery = "update devices set is_sync=1 where device_id='" + deviceId + "'";
        await sql.query(updateQuery);
        if (response.length) {
            return response[0];
        } else {
            // console.log("hellow");
        }

    },
    getOriginalIdByDeviceId: async function (deviceId) {
        var getQuery = "select * from devices where device_id='" + deviceId + "'";
        let res = await sql.query(getQuery);
        if (res.length > 0) {

            return res[0].id;
        } else {
            return false;
        }
    },
    uploadIconFile: function (app, iconName) {
        // let base64Data = "data:image/png;base64,"+ btoa(icon);
        if (app.icon != undefined) {
            // console.log("icon is available");
            if (typeof app.icon != 'string') {
                // console.log("uploading icon");
                var base64Data = Buffer.from(app.icon).toString("base64");

                fs.writeFile("./uploads/icon_" + iconName + ".png", base64Data, 'base64', function (err) {
                    console.log(err);
                });
            } else {
                console.log("icon was in string type");
                // var bytes = app.icon.split(",");
                // var base64Data = Buffer.from(icon).toString("base64");

                // fs.writeFile("./uploads/icon_" + iconName + ".png", base64Data, 'base64', function (err) {
                //     console.log(err);
                // });
            }
        }

        return "icon_" + iconName + ".png"

    },
    isDeviceOnline: async function (device_id) {
        let query = "select online from devices where device_id='" + device_id + "'";
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
    checkStatus: function (results) {
        console.log("helleo results", results)
        let deviceData = results.map((results) => {

            if (results.status === 'active' && (results.account_status === '' || results.account_status === null) && results.unlink_status === 0 && (results.device_status === 1 || results.device_status === '1')) {
                results.finalStatus = 'Activated'
            }
            else if (results.status === 'expired') {
                results.finalStatus = 'Expired';
            } else if ((results.device_status === '0' || results.device_status === 0) && (results.unlink_status === '0' || results.unlink_status === 0) && (results.activation_status === null || results.activation_status === '')) {
                results.finalStatus = 'Pending activation';
            } else if ((results.device_status === '0' || results.device_status === 0) && (results.unlink_status === '0' || results.unlink_status === 0) && (results.activation_status === 0)) {
                results.finalStatus = 'Pre-activated';
            } else if ((results.unlink_status === '1' || results.unlink_status === 1) && (results.device_status === 0 || results.device_status === '0')) {
                // console.log("hello unlinked");
                results.finalStatus = 'Unlinked';
            } else if (results.account_status === 'suspended') {
                results.finalStatus = 'Suspended';
            } else {
                results.finalStatus = 'N/A';
            }
            return results

        })
        data = {
            "status": true,
            "data": deviceData
        };
        return data

    }
}