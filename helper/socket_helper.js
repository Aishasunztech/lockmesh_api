// Libraries

// Helpers
const { sql } = require('../config/database');

// console.log(webIo, deviceIo, baseIo)
// const device_helpers = require('../helper/device_helpers.js');
// const general_helpers = require('../helper/general_helper.js');


// Constants
const Constants = require('../constants/Application');



module.exports = {
    checkSocketVars: () => {
        const socket_helper = require('../routes/sockets');
        console.log(socket_helper.deviceIo)
    },

    // send to device/panel
    writeImei: (io, setting_id, imei, device_id) => {
        console.log("write_imei_" + device_id);

        // yeh loading k liye tha
        // io.emit(Constants.ACTION_IN_PROCESS + device_id, {
        //     status: true,
        //     type: 'imei'
        // })

        io.emit(Constants.WRITE_IMEI + device_id, {
            setting_id: setting_id,
            status: true,
            device_id: device_id,
            imei: imei
        });

        sendSocketDataToDevice(Constants.WRITE_IMEI + device_id, {
            setting_id: setting_id,
            status: true,
            device_id: device_id,
            imei: imei
        });
    },

    // send to panel 
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
                            require('./device_helpers.js').saveSimActionHistory(device_id, "NEW_REGISTERED_SIM", arr[i]);
                        } else {
                            //*********/ Asked abaid to remove ingore from insert query **********//
                            var IQry = `INSERT INTO sims (device_id, iccid, name, note, guest, encrypt, dataLimit, sync, is_changed) 
                VALUES ('${device_id}', '${arr[i].iccid}', '${arr[i].name}', '${arr[i].note}', ${arr[i].guest}, ${arr[i].encrypt}, 0, '1', '0');`;
                            await sql.query(IQry);

                            // Save action of sim as history
                            require('./device_helpers.js').saveSimActionHistory(device_id, "NEW_REGISTERED_SIM", arr[i]);
                        }

                        // })
                    }

                    // console.log('iccids: ', iccids);
                    if (iccids.length) {
                        // delete sims which are not on device
                        let dQry = `UPDATE sims SET delete_status='1', is_changed='0' WHERE device_id = '${device_id}' AND iccid NOT IN (${iccid})`;
                        await sql.query(dQry);

                        // Save action of sim as history
                        require('./device_helpers.js').saveSimActionHistory(device_id, "DELETE", { device_id, iccid });
                    }
                } else {
                    // delete sims which are not on device
                    let dQry = `UPDATE sims SET delete_status='1', is_changed='0' WHERE device_id = '${device_id}'`;
                    await sql.query(dQry);

                    // Save action of sim as history
                    require('./device_helpers.js').saveSimActionHistory(device_id, "DELETE", { device_id });
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
                require('./device_helpers.js').saveSimActionHistory(device_id, "UN_REGISTER", { un_register_guest: arr.unrGuest ? 1 : 0, un_register_encrypt: arr.unrEncrypt ? 1 : 0 });



                // let uQry = `UPDATE sims SET unrGuest=${arr.unrGuest}, unrEncrypt=${arr.unrEncrypt} WHERE device_id='${device_id}' AND delete_status='0'`;
                // await sql.query(uQry);

            } else if (response.action === 'sim_delete') {
                arr.map(async function (iccid, index) {

                    // let dQry = `DELETE FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;
                    let dQry = `UPDATE sims SET delete_status='1', is_changed='0' WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;
                    await sql.query(dQry);

                    // Save action of sim as history
                    require('./device_helpers.js').saveSimActionHistory(device_id, "DELETE", { device_id, iccid });
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
                        require('./device_helpers.js').saveSimActionHistory(device_id, "UPDATE", arr[i]);
                    } else {
                        // console.log('33')
                        //*********/ Asked abaid to remove ingore from insert query **********//
                        let IQry = `INSERT INTO sims (device_id, iccid, name, sim_id, slotNo, note, guest, encrypt, status, dataLimit, sync, is_changed) VALUES ('${device_id}', '${arr[i].iccid}', '${arr[i].name}', '', '${arr[i].slotNo}', '${arr[i].note}', ${arr[i].guest}, ${arr[i].encrypt}, '${arr[i].status}', 0, '1', '0');`;
                        await sql.query(IQry);

                        // Save action of sim as history
                        require('./device_helpers.js').saveSimActionHistory(device_id, "NEW_REGISTERED_SIM", arr[i]);
                    }
                }




            }

            // Backward Compatibility
            io.emit(Constants.RECV_SIM_DATA + device_id, {
                status: true,
                unRegSims: dataIs
            });

            // new code
            sendSocketDataToPanel(Constants.RECV_SIM_DATA + device_id, {
                status: true,
                unRegSims: dataIs
            })
        }

    },

    // send to panel
    sendOnlineOfflineStatus: async (io, status, deviceId) => {
        console.log(status, ":", deviceId);
        io.emit(Constants.SEND_ONLINE_OFFLINE_STATUS + deviceId, {
            status: status
        })

        // new code
        sendSocketDataToPanel(Constants.SEND_ONLINE_OFFLINE_STATUS + deviceId, {
            status: status
        })
    },

    // send to panel
    deviceSynced: (io, deviceId, status) => {
        io.emit('device_synced_' + deviceId, status);

        // new code
        sendSocketDataToPanel('device_synced_' + deviceId, { status: status })
    },




    // send to panel
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

        io.emit(Constants.ACK_SETTING_APPLIED + device_id, { setting: setting });

        sendSocketDataToPanel(Constants.ACK_SETTING_APPLIED + device_id, { setting: setting });
    },


    // send to panel
    installedApps: async (io, deviceId, dvcId, response) => {
        // console.log("installedApps()", response);
        try {
            let app_list = JSON.parse(response);

            let application = await require('./device_helpers.js').pushAppProcess(deviceId, dvcId, app_list);
            let apps = [];
            if (application && application.length) {
                apps = application
            }

            io.emit(Constants.ACK_INSTALLED_APPS + deviceId, {
                app_list: apps,
                status: true
            })

            sendSocketDataToPanel(Constants.ACK_INSTALLED_APPS + deviceId, {
                app_list: apps,
                status: true
            })
        } catch (error) {
            console.log('install app parsing error:')
        }

    },

    // send to panel
    ackSinglePushApp: async function (io, device_id, dvcId, response) {
        console.log("ackSinglePushApp()");
        // let pushApp = null;

        // if(response.status){
        //     pushApp = await require('./device_helpers.js').pushAppProcess(deviceId, dvcId, response.packageName);

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

        sendSocketDataToPanel(Constants.ACK_SINGLE_PUSH_APP + device_id, {
            status: true,
        })
        // io.emit(Constants.ACK_SINGLE_PUSH_APP + device_id, {
        //     status: true,
        //     pushApp: pushApp
        // })
    },

    // send to panel
    uninstalledApps: async (io, deviceId, dvcId, response) => {
        // console.log("uninstalledApps() ", response);
        try {
            
            let app_list = JSON.parse(response);
            await require('./device_helpers.js').pullAppProcess(deviceId, dvcId, app_list);
    
            io.emit(Constants.ACK_UNINSTALLED_APPS + deviceId, {
                status: true,
                app_list: app_list
            })

            sendSocketDataToPanel(Constants.ACK_UNINSTALLED_APPS + deviceId, {
                status: true,
                app_list: app_list
            })

        } catch (error) {
            console.log("uninstall app parsing error:")
        }
    },

    // send to panel
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

        // pullApp = await require('./device_helpers.js').pullAppProcess(deviceId, dvc_id, response.packageName);
        // } else {
        //     console.log("app is not pulled successfully")
        // }

        io.emit(Constants.ACK_SINGLE_PULL_APP + device_id, {
            status: response.status,
            // pullApp: pullApp
        })

        sendSocketDataToPanel(Constants.ACK_SINGLE_PULL_APP + device_id, {
            status: response.status,
            // pullApp: pullApp
        })

    },

    // send to panel
    ackFinishedPolicyStep: async function (io, device_id, user_acc_id) {
        console.log("FINISHED POLICY STEP")

        let completeSteps = 0
        let queueAppsData = await sql.query(`SELECT * FROM policy_queue_jobs WHERE device_id = '${device_id}' ORDER BY created_at DESC LIMIT 1`)
        if (queueAppsData && queueAppsData.length) {

            completeSteps = queueAppsData[0].complete_steps + 1
            await sql.query(`UPDATE policy_queue_jobs SET complete_steps = ${completeSteps} WHERE device_id = '${device_id}'`)

            io.emit(Constants.FINISH_POLICY_STEP + device_id, {
                status: true
            });

            sendSocketDataToPanel(Constants.FINISH_POLICY_STEP + device_id, {
                status: true
            });
        }
    },

    // send to panel
    ackFinishedWipe: async function (io, device_id, user_acc_id) {
        console.log("DEVICE WIPED SUCCESSFULLY")

        var clearWipeDevice = `UPDATE device_history SET status='completed_successfully' WHERE type='wipe' AND user_acc_id=${user_acc_id}`;
        await sql.query(clearWipeDevice)

        io.emit(Constants.FINISH_WIPE + device_id, {
            status: true
        });
        
        sendSocketDataToPanel(Constants.FINISH_WIPE + device_id, {
            status: true
        });
    },

    // send to panel
    ackImeiChanged: async function (io, device_id) {
        console.log("IMEI Applied")
        await sql.query(`UPDATE devices SET is_push_apps = 0 WHERE device_id = ?`, [device_id]);

        io.emit(Constants.FINISH_IMEI + device_id, {
            status: true
        });

        sendSocketDataToPanel(Constants.FINISH_IMEI + device_id, {
            status: true
        });
    },
    // send to panel
    sendJobToPanel: function (io, job) {
        console.log("data emitted on panel successfully");
        io.emit(Constants.SEND_JOB_TO_PANEL, {job: job});
        sendSocketDataToPanel(Constants.SEND_JOB_TO_PANEL, {job: job});

    },

    // send to device
    sendEmit: async (io, setting_id, app_list, passwords, controls, permissions, device_id) => {
        console.log("applied history ID:", setting_id);

        io.emit(Constants.GET_APPLIED_SETTINGS + device_id, {
            setting_id: setting_id,
            device_id: device_id,
            app_list: (!app_list) ? '[]' : app_list,
            passwords: (!passwords) ? '{}' : passwords,
            settings: (!controls) ? '[]' : controls,
            extension_list: (!permissions) ? '{}' : permissions,
            status: true
        });

        sendSocketDataToDevice(Constants.GET_APPLIED_SETTINGS + device_id, {
            setting_id: setting_id,
            device_id: device_id,
            app_list: (!app_list) ? '[]' : app_list,
            passwords: (!passwords) ? '{}' : passwords,
            settings: (!controls) ? '[]' : controls,
            extension_list: (!permissions) ? '{}' : permissions,
            status: true
        })
    },


    // send to device
    sendRegSim: async (io, device_id, action, data) => {

        io.emit(Constants.SEND_SIM + device_id, {
            action,
            device_id,
            entries: (!data) ? '[]' : JSON.stringify(data),
        });

        sendSocketDataToDevice(Constants.SEND_SIM + device_id, {
            action,
            device_id,
            entries: (!data) ? '[]' : JSON.stringify(data),
        });

    },

    // send to device/panel
    applyPushApps: (io, setting_id, push_apps, device_id) => {
        console.log("applied pushApps ID:", setting_id);

        // console.log(Constants.GET_PUSHED_APPS + device_id);

        // yeh loading k liye tha
        // io.emit(Constants.ACTION_IN_PROCESS + device_id, {
        //     status: true,
        //     type: 'push'
        // })

        io.emit(Constants.GET_PUSHED_APPS + device_id, {
            setting_id: setting_id,
            status: true,
            device_id: device_id,
            push_apps: push_apps
        });

        sendSocketDataToDevice(Constants.GET_PUSHED_APPS + device_id, {
            setting_id: setting_id,
            status: true,
            device_id: device_id,
            push_apps: push_apps
        });
    },

    // send to device/panel
    getPullApps: (io, setting_id, pull_apps, device_id) => {
        console.log("applied pullApps ID:", setting_id);

        // yeh loading k liye tha
        // io.emit(Constants.ACTION_IN_PROCESS + device_id, {
        //     status: true,
        //     type: 'pull'
        // })

        io.emit(Constants.GET_PULLED_APPS + device_id, {
            setting_id: setting_id,
            status: true,
            device_id: device_id,
            pull_apps: pull_apps
        });

        sendSocketDataToDevice(Constants.GET_PULLED_APPS + device_id, {
            setting_id: setting_id,
            status: true,
            device_id: device_id,
            pull_apps: pull_apps
        });
    },

    // send to device
    syncDevice: async (io, device_id) => {
        io.emit(Constants.GET_SYNC_STATUS + device_id, {
            device_id: device_id,
            apps_status: false,
            extensions_status: false,
            settings_status: false,
            is_sync: false,
        });

        sendSocketDataToDevice(Constants.GET_SYNC_STATUS + device_id, {
            device_id: device_id,
            apps_status: false,
            extensions_status: false,
            settings_status: false,
            is_sync: false,
        });
    },

    // live device status activity
    // send to device
    sendDeviceStatus: async function (io, device_id, device_status, status = false) {
        console.log("send device status", device_id, device_status);
        io.emit(Constants.DEVICE_STATUS + device_id, {
            device_id: device_id,
            status: status,
            msg: device_status
        });
        
        sendSocketDataToDevice(Constants.DEVICE_STATUS + device_id, {
            device_id: device_id,
            status: status,
            msg: device_status
        });
    },
    // send to device
    getPolicy: (io, setting_id, device_id, policy) => {

        // to send acknowledgement on frontend
        // io.emit(Constants.ACTION_IN_PROCESS + device_id, {
        //     status: true,
        //     type: 'policy'
        // })

        if (policy) {
            io.emit(Constants.GET_POLICY + device_id, {
                setting_id: setting_id,
                status: true,
                app_list: (!policy.app_list) ? '[]' : policy.app_list,
                settings: (!policy.controls) ? '[]' : policy.controls,
                extension_list: (!policy.permissions) ? '[]' : policy.permissions,
                push_apps: (!policy.push_apps) ? '[]' : policy.push_apps,
                device_id: device_id,
            });
            
            sendSocketDataToDevice(Constants.GET_POLICY + device_id, {
                setting_id: setting_id,
                status: true,
                app_list: (!policy.app_list) ? '[]' : policy.app_list,
                settings: (!policy.controls) ? '[]' : policy.controls,
                extension_list: (!policy.permissions) ? '[]' : policy.permissions,
                push_apps: (!policy.push_apps) ? '[]' : policy.push_apps,
                device_id: device_id,
            });
        } else {
            console.log('policy not found');
        }
    },

    // send to device
    sendMsgToDevice: async function (io, device_id, job_id, msg, SERVER_TIMEZONE) {
        console.log("data::  ", device_id, msg, job_id, "channel name: ", Constants.SEND_MSG_TO_DEVICE + device_id);

        if (msg) {
            io.emit(Constants.SEND_MSG_TO_DEVICE + device_id, {
                status: true,
                msg,
                job_id,
                device_id
                // server_timezone: SERVER_TIMEZONE
            });

            sendSocketDataToDevice(Constants.SEND_MSG_TO_DEVICE + device_id, {
                status: true,
                msg,
                job_id,
                device_id
                // server_timezone: SERVER_TIMEZONE
            });
        } else {
            console.log('message not found')
        }
    },

    // send to device
    forceCheckUpdate: async function (io, device_id) {
        console.log("testing force update: ", device_id);
        io.emit(Constants.FORCE_UPDATE_CHECK + device_id, {
            device_id: device_id,
            status: true
        });
        
        sendSocketDataToDevice(Constants.FORCE_UPDATE_CHECK + device_id, {
            device_id: device_id,
            status: true
        });
    },

    // send to device
    deviceInfoUpdated: async function (io, device_id, data) {
        console.log("DEVICE INFORMATION UPDATED", data);
        // Backward Compatibility
        io.emit(Constants.DEVICE_INFO_UPDATED + device_id, {
            status: true,
            data: data
        });

        // New Code
        sendSocketDataToDevice(Constants.DEVICE_INFO_UPDATED + device_id, {
            status: true,
            data: data
        })

    },
}

function sendSocketDataToDevice (eventName, payload) {
    const { deviceIo } = require('../routes/sockets');
    if(deviceIo){
        deviceIo.emit(eventName, payload)
    }
}

function  sendSocketDataToPanel(eventName, payload) {
    const { webIo } = require('../routes/sockets');
    if(webIo){
        webIo.emit(eventName, payload)
    }
}