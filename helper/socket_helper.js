// Libraries

// Helpers
const { sql } = require('../config/database');
const device_helpers = require('../helper/device_helpers.js');
const general_helpers = require('../helper/general_helper.js');


// Constants
const Constants = require('../constants/Application');



module.exports = {
    sendRegSim: async (io, device_id, action, data) => {
        console.log(Constants.SEND_SIM + device_id, 'sendRegSim data is=> ', {
            action,
            device_id,
            entries: (data === undefined || data === null) ? '[]' : JSON.stringify(data),
        });

        io.emit(Constants.SEND_SIM + device_id, {
            action,
            device_id,
            entries: (data === undefined || data === null) ? '[]' : JSON.stringify(data),
        });
    },

    updateSimRecord: async function (io, device_id, response, socket = null) {
        // console.log('action is: ', response.action)
        console.log('updateSimRecord response is:: ', response)

        let arr = JSON.parse(response.entries);
        // console.log('parsed data is: ', arr);

        let dataIs = [];
        if (response && arr && device_id) {

            if (response.action === "sim_new_device") {

                let iccids = [];

                if (arr.length) {

                    for (let i = 0; i < arr.length; i++) {

                        // arr.map(async function (data, index) {

                        // let uQry = `UPDATE sims SET name='${data.name}', note='${data.note}', guest=${data.guest}, encrypt=${data.encrypt}, status='${data.status}', slotNo='${data.slotNo}', sync = '1' WHERE device_id = '${device_id}' AND iccid = '${data.iccid}' AND delete_status='0'`;
                        let uQry = `UPDATE sims SET name='${arr[i].name}', note='${arr[i].note}', guest=${arr[i].guest}, encrypt=${arr[i].encrypt}, status='${arr[i].status}', slotNo='${arr[i].slotNo}', sync = '1', is_changed = '0' WHERE device_id = '${device_id}' AND iccid = '${arr[i].iccid}' AND delete_status='0'`;
                        let result = await sql.query(uQry);

                        if (result.affectedRows > 0) {
                            iccids.push(`"${arr[i].iccid}"`);

                            // Save action of sim as history
                            device_helpers.saveSimActionHistory(device_id, "NEW_REGISTERED_SIM", arr[i]);
                        } else {
                            //*********/ Asked abaid to remove ingore from insert query **********//
                            var IQry = `INSERT INTO sims (device_id, iccid, name, note, guest, encrypt, dataLimit, sync, is_changed) 
                VALUES ('${device_id}', '${arr[i].iccid}', '${arr[i].name}', '${arr[i].note}', ${arr[i].guest}, ${arr[i].encrypt}, 0, '1', '0');`;
                            await sql.query(IQry);

                            // Save action of sim as history
                            device_helpers.saveSimActionHistory(device_id, "NEW_REGISTERED_SIM", arr[i]);
                        }

                        // })
                    }

                    // console.log('iccids: ', iccids);
                    if (iccids.length) {
                        // delete sims which are not on device
                        let dQry = `UPDATE sims SET delete_status='1', is_changed='0' WHERE device_id = '${device_id}' AND iccid NOT IN (${iccid})`;
                        await sql.query(dQry);

                        // Save action of sim as history
                        device_helpers.saveSimActionHistory(device_id, "DELETE", { device_id, iccid });
                    }
                } else {
                    // delete sims which are not on device
                    let dQry = `UPDATE sims SET delete_status='1', is_changed='0' WHERE device_id = '${device_id}'`;
                    await sql.query(dQry);

                    // Save action of sim as history
                    device_helpers.saveSimActionHistory(device_id, "DELETE", { device_id });
                }

                io.emit(Constants.GET_SYNC_STATUS + device_id, {
                    device_id: device_id,
                    apps_status: false,
                    extensions_status: false,
                    settings_status: false,
                    is_sync: false,
                });

            } else if (response.action === "sim_inserted") {
                console.log('console for sim_inserted ');
                dataIs = arr;
            } else if (response.action === "sim_unregister") {
                // console.log('you are at unReg Section');

                //*********************** ur register guest *******************/
                let checkGuest = await sql.query(`SELECT * FROM device_attributes WHERE device_id = '${device_id}' AND name = 'un_register_guest' AND delete_status = '0'`);
                if (checkGuest.length) {
                    await sql.query(`UPDATE device_attributes SET value = '${arr.unrGuest ? 1 : 0}' WHERE device_id= '${device_id}' AND name='un_register_guest' AND delete_status='0'`);
                } else {
                    await sql.query(`INSERT INTO device_attributes (device_id, name, value) VALUES ('${device_id}', 'un_register_guest', '${arr.unrGuest ? 1 : 0}')`);
                }

                //*************************** ur register encrypt  *************/
                let checkEncrypt = await sql.query(`SELECT * FROM device_attributes WHERE device_id = '${device_id}' AND name = 'un_register_encrypt' AND delete_status = '0'`);
                if (checkEncrypt.length) {
                    await sql.query(`UPDATE device_attributes SET value = '${arr.unrEncrypt ? 1 : 0}' WHERE device_id= '${device_id}' AND name='un_register_encrypt' AND delete_status='0'`);
                } else {
                    await sql.query(`INSERT INTO device_attributes (device_id, name, value) VALUES ('${device_id}', 'un_register_encrypt', '${arr.unrEncrypt ? 1 : 0}')`);
                }

                // Save action of sim as history
                device_helpers.saveSimActionHistory(device_id, "UN_REGISTER", { un_register_guest: arr.unrGuest ? 1 : 0, un_register_encrypt: arr.unrEncrypt ? 1 : 0 });



                // let uQry = `UPDATE sims SET unrGuest=${arr.unrGuest}, unrEncrypt=${arr.unrEncrypt} WHERE device_id='${device_id}' AND delete_status='0'`;
                // await sql.query(uQry);

            } else if (response.action === 'sim_delete') {
                arr.map(async function (iccid, index) {

                    // let dQry = `DELETE FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;
                    let dQry = `UPDATE sims SET delete_status='1', is_changed='0' WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;
                    await sql.query(dQry);

                    // Save action of sim as history
                    device_helpers.saveSimActionHistory(device_id, "DELETE", { device_id, iccid });
                })
            } else {

                for (let i = 0; i < arr.length; i++) {

                    // console.log('11', arr[i])
                    let sQry = `SELECT * FROM sims WHERE device_id = '${device_id}' AND iccid = '${arr[i].iccid}' AND delete_status='0'`;
                    let rslt = await sql.query(sQry);


                    if (rslt.length > 0) {
                        // console.log('22')

                        let uQry = `UPDATE sims SET name='${arr[i].name}', note='${arr[i].note}', guest=${arr[i].guest}, encrypt=${arr[i].encrypt}, status='${arr[i].status}', slotNo='${arr[i].slotNo}', sync = '1', is_changed = '0' WHERE device_id = '${device_id}' AND iccid = '${arr[i].iccid}' AND delete_status='0'`;
                        await sql.query(uQry);

                        // Save action of sim as history
                        device_helpers.saveSimActionHistory(device_id, "UPDATE", arr[i]);
                    } else {
                        // console.log('33')
                        //*********/ Asked abaid to remove ingore from insert query **********//
                        let IQry = `INSERT INTO sims (device_id, iccid, name, sim_id, slotNo, note, guest, encrypt, status, dataLimit, sync, is_changed) VALUES ('${device_id}', '${arr[i].iccid}', '${arr[i].name}', '', '${arr[i].slotNo}', '${arr[i].note}', ${arr[i].guest}, ${arr[i].encrypt}, '${arr[i].status}', 0, '1', '0');`;
                        await sql.query(IQry);

                        // Save action of sim as history
                        device_helpers.saveSimActionHistory(device_id, "NEW_REGISTERED_SIM", arr[i]);
                    }
                }




            }


            io.emit(Constants.RECV_SIM_DATA + device_id, {
                status: true,
                unRegSims: dataIs
            });
        }

    },

    sendOnlineOfflineStatus: async (io, status, deviceId) => {
        console.log(status, ":", deviceId);
        io.emit(Constants.SEND_ONLINE_OFFLINE_STATUS + deviceId, {
            status: status
        })
    },

    deviceSynced: (io, deviceId, status) => {
        io.emit('device_synced_' + deviceId, status);
    },

    sendEmit: async (io, app_list, passwords, controls, permissions, device_id) => {
        // console.log('password socket')

        io.emit(Constants.GET_APPLIED_SETTINGS + device_id, {
            device_id: device_id,
            app_list: (app_list === undefined || app_list === null || app_list === '') ? '[]' : app_list,
            passwords: (passwords === undefined || passwords === null || passwords === '') ? '{}' : passwords,
            settings: (controls === undefined || controls === null || controls === '') ? '[]' : controls,
            extension_list: (permissions == undefined || permissions == null || permissions == '') ? '{}' : permissions,
            status: true
        });
    },

    applyPushApps: (io, push_apps, device_id) => {
        console.log(Constants.GET_PUSHED_APPS + device_id);

        io.emit(Constants.ACTION_IN_PROCESS + device_id, {
            status: true,
            type: 'push'
        })

        io.emit(Constants.GET_PUSHED_APPS + device_id, {
            status: true,
            device_id: device_id,
            push_apps: push_apps
        });
    },

    getPullApps: (io, pull_apps, device_id) => {

        // yeh loading k liye tha
        // io.emit(Constants.ACTION_IN_PROCESS + device_id, {
        //     status: true,
        //     type: 'pull'
        // })

        io.emit(Constants.GET_PULLED_APPS + device_id, {
            status: true,
            device_id: device_id,
            pull_apps: pull_apps
        });
    },

    writeImei: (io, imei, device_id) => {
        console.log("write_imei_" + device_id);
        io.emit(Constants.ACTION_IN_PROCESS + device_id, {
            status: true,
            type: 'imei'
        })
        io.emit(Constants.WRITE_IMEI + device_id, {
            status: true,
            device_id: device_id,
            imei: imei
        });
    },

    syncDevice: async (io, device_id) => {
        io.emit(Constants.GET_SYNC_STATUS + device_id, {
            device_id: device_id,
            apps_status: false,
            extensions_status: false,
            settings_status: false,
            is_sync: false,
        });
    },

    // live device status activity
    sendDeviceStatus: async function (io, device_id, device_status, status = false) {
        console.log("send device status", device_id, device_status);
        io.emit(Constants.DEVICE_STATUS + device_id, {
            device_id: device_id,
            status: status,
            msg: device_status
        });
    },

    ackSettingApplied: async function (io, device_id, app_list, extensions, controls) {
        let setting = {};
        if (app_list) {
            setting.app_list = app_list
        }

        if (extensions) {
            setting.extensions = extensions
        }

        if (controls) {
            setting.controls = controls
        }

        io.emit(Constants.ACK_SETTING_APPLIED + device_id, setting);
    },


    installedApps: async (io, deviceId, dvcId, response) => {
        // console.log("installedApps()", response);
        let app_list = JSON.parse(response);

        let application = await device_helpers.pushAppProcess(deviceId, dvcId, app_list);

        if (application.length) {
            io.emit(Constants.ACK_INSTALLED_APPS + deviceId, {
                app_list: application,
                status: true
            })
        } else {
            io.emit(Constants.ACK_INSTALLED_APPS + deviceId, {
                app_list: [],
                status: true
            })
        }


    },


    ackSinglePushApp: async function (io, device_id, dvcId, response) {
        console.log("ackSinglePushApp()");
        // let pushApp = null;

        // if(response.status){
        //     pushApp = await device_helpers.pushAppProcess(deviceId, dvcId, response.packageName);

        // } else {
        //     console.log("app is not pushed successfully")
        // }

        // yeh code push app ki loading k liye he, bad me use krunga or push app process me move krna he
        // let completePushApps = 0
        // let queueAppsData = await sql.query("SELECT * from apps_queue_jobs where device_id = '" + device_id + "' AND type = 'push' order by created_at desc limit 1")
        // if (queueAppsData.length) {

        //     completePushApps = queueAppsData[0].complete_apps + 1
        //     await sql.query("UPDATE apps_queue_jobs set complete_apps = " + completePushApps + " WHERE device_id = '" + device_id + "' AND type = 'pull'")

        //     io.emit(Constants.ACK_SINGLE_PUSH_APP + device_id, {
        //         status: true,
        //     })
        // }

        io.emit(Constants.ACK_SINGLE_PUSH_APP + device_id, {
            status: true,
        })
        // io.emit(Constants.ACK_SINGLE_PUSH_APP + device_id, {
        //     status: true,
        //     pushApp: pushApp
        // })
    },

    ackFinishedPushApps: async function (io, device_id, user_acc_id) {

        await sql.query("DELETE from apps_queue_jobs WHERE device_id = '" + device_id + "' AND type = 'push'")
        // await sql.query("UPDATE apps_queue_jobs set is_in_process = 0 WHERE device_id = '" + device_id + "'")
        var pushAppsQ = "UPDATE device_history SET status=1 WHERE type='push_apps' AND user_acc_id=" + user_acc_id + "";
        await sql.query(pushAppsQ)

        io.emit(Constants.ACK_FINISHED_PUSH_APPS + device_id, {
            status: true
        });
    },

    uninstalledApps: async (io, deviceId, dvcId, response) => {
        console.log("uninstalledApps() ", response);
        let app_list = JSON.parse(response);
        await device_helpers.pullAppProcess(deviceId, dvcId, app_list);

        io.emit(Constants.ACK_UNINSTALLED_APPS + deviceId, {
            status: true,
            app_list: app_list
        })
    },

    ackSinglePullApp: async function (io, device_id, dvc_id, response) {

        let pullApp = null;
        // console.log("SINGLE PULL PUSH");
        // if (response.status) {

        // Pull apps ki loading wala code he yeh, bad me use kia jayga
        // let completePushApps = 0
        // let queueAppsData = await sql.query(`SELECT * FROM apps_queue_jobs WHERE device_id = '${device_id}' AND type = 'push' ORDER BY created_at DESC LIMIT 1`)
        // if (queueAppsData.length) {

        //     completePushApps = queueAppsData[0].complete_apps + 1
        //     await sql.query(`UPDATE apps_queue_jobs SET complete_apps = ${completePushApps} WHERE device_id = '${device_id}' AND type = 'pull'`)

        //     io.emit(Constants.ACK_SINGLE_PULL_APP + device_id, {
        //         status: true
        //     })
        // }

        // pullApp = await device_helpers.pullAppProcess(deviceId, dvc_id, response.packageName);
        // } else {
        //     console.log("app is not pulled successfully")
        // }

        io.emit(Constants.ACK_SINGLE_PULL_APP + device_id, {
            status: response.status,
            // pullApp: pullApp
        })

    },
    ackFinishedPullApps: async function (io, device_id, user_acc_id) {
        var pullAppsQ = "UPDATE device_history SET status=1 WHERE type='pull_apps' AND user_acc_id=" + user_acc_id + "";
        await sql.query(pullAppsQ)
        await sql.query("DELETE from apps_queue_jobs WHERE device_id = '" + device_id + "' AND type = 'pull'")

        io.emit(Constants.ACK_FINISHED_PULL_APPS + device_id, {
            status: true
        })
    },

    ackFinishedPolicyStep: async function (io, device_id, user_acc_id) {
        console.log("FINISHED POLICY STEP")

        let completeSteps = 0
        let queueAppsData = await sql.query("SELECT * from policy_queue_jobs where device_id = '" + device_id + "' order by created_at desc limit 1")
        if (queueAppsData.length) {

            completeSteps = queueAppsData[0].complete_steps + 1
            await sql.query("UPDATE policy_queue_jobs set complete_steps = " + completeSteps + " WHERE device_id = '" + device_id + "'")

            io.emit(Constants.FINISH_POLICY_STEP + device_id, {
                status: true
            });
        }
    },

    ackFinishedPolicy: async function (io, device_id, user_acc_id) {
        console.log("FINISHED POLICY")

        var pushAppsQ = "UPDATE device_history SET status=1 WHERE type='policy' AND user_acc_id=" + user_acc_id + "";
        await sql.query(pushAppsQ)
        await sql.query("DELETE from policy_queue_jobs WHERE device_id = '" + device_id + "'")

        io.emit(Constants.FINISH_POLICY + device_id, {
            status: true
        });
    },
    ackFinishedWipe: function (io, device_id, user_acc_id) {
        console.log("DEVICE WIPED SUCCESSFULLY")

        var clearWipeDevice = "UPDATE device_history SET status=1 WHERE type='wipe' AND user_acc_id=" + user_acc_id + "";
        sql.query(clearWipeDevice)

        io.emit(Constants.FINISH_WIPE + device_id, {
            status: true
        });
    },

    ackImeiChanged: async function (io, device_id) {
        console.log("IMEI Applied")
        await sql.query("UPDATE devices set is_push_apps = 0 WHERE device_id = '" + device_id + "'")

        io.emit(Constants.FINISH_IMEI + device_id, {
            status: true
        });
    },


    getPolicy: (io, device_id, policy) => {
        io.emit(Constants.ACTION_IN_PROCESS + device_id, {
            status: true,
            type: 'policy'
        })
        io.emit(Constants.GET_POLICY + device_id, {
            status: true,
            app_list: (policy.app_list === undefined || policy.app_list === null || policy.app_list === '') ? '[]' : policy.app_list,
            settings: (policy.controls === undefined || policy.controls === null || policy.controls === '') ? '[]' : policy.controls,
            extension_list: (policy.permissions === undefined || policy.permissions === null || policy.permissions === '') ? '[]' : policy.permissions,
            push_apps: (policy.push_apps === undefined || policy.push_apps === null || policy.push_apps === '') ? '[]' : policy.push_apps,
            device_id: device_id,
        });
    },

    forceCheckUpdate: async function (io, device_id) {
        console.log("testing forceupdate", device_id);
        io.emit(Constants.FORCE_UPDATE_CHECK + device_id, {
            device_id: device_id,
            status: true
        });
    }
}
