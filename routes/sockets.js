// Libraries
var socket = require('socket.io');
var jwt = require('jsonwebtoken');

// Helpers
const { sql } = require('../config/database');
const device_helpers = require('../helper/device_helpers.js');
const general_helpers = require('../helper/general_helper.js');

// Constants
const Constants = require('../constants/Application');
const app_constants = require('../config/constants');

var sockets = {};
let io;

// verify token
const verifyToken = function (socket, token) {

    if (device_helpers.checkNotNull(token)) {
        // verifies secret and checks exp
        return jwt.verify(token.replace(/['"]+/g, ''), app_constants.SECRET, function (err, decoded) {
            if (err) {
                return false;
            } else {
                return true;
                // if everything is good, save to request for use in other routes
                // ath = decoded;
            }
        });
    } else {
        return false;
    }
}

const verifySession = async (deviceId, sessionId, isWeb = false, dealerId = null) => {
    if (device_helpers.checkNotNull(isWeb)) {
        console.log("web side: ", isWeb);
        return true;

    } else if (device_helpers.checkNotNull(deviceId)) {
        console.log("mobile side: ", deviceId);
        // var query = "SELECT id FROM devices WHERE device_id='" + deviceId + "' AND (online='off' OR session_id='" + sessionId + "')";
        var query = "SELECT id FROM devices WHERE device_id='" + deviceId + "'";
        let res = await sql.query(query);
        if (res.length) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const socketMiddleware = async (socket, next) => {
    let token = socket.handshake.query.token;
    // console.log("Token", verifyToken(token));
    if (verifyToken(socket, token)) {

        let session_id = socket.id;

        var device_id = null;
        var dealer_id = null;

        let isWeb = socket.handshake.query['isWeb'];

        if (device_helpers.checkNotNull(isWeb)) {
            isWeb = true;
            // dealer_id = socket.handshake.query['dealer_id'];

        } else {
            isWeb = false;
            device_id = socket.handshake.query['device_id'];
        }

        let sessionVerify = await verifySession(device_id, session_id, isWeb, dealer_id);
        console.log("Session", sessionVerify);

        if (sessionVerify) {
            next();
        } else {
            return next(new Error('Unauthorized: token not provided'));
        }

    } else {
        return next(new Error('Unauthorized: token not provided'));
    }
}

sockets.listen = function (server) {

    // socket configuration options
    
    // {
    //    path: '/socket.io',
    //    serveClient: false,
    //    pingInterval: 10000,
    //    pingTimeout: 5000,
    //    cookie: false
    // }

    io = socket();

    // io = socket({
    //     pingTimeout :100
    // });


    // io.attach(server, {
    //     // pingInterval: 60000,
    //     // pingTimeout: 120000,
    //     // cookie: false
    // });

    // io.set('transports', ['websocket']);

    // ===============================================================================
    // io.of('/') is for middleware not for path/namespace/endpoint 
    // ===============================================================================
    
    // ===============================================================================
    // io.of('dynamic of for device_id') for dynamic/namespace/endpoint
    // ===============================================================================
    // const dynamicNsp = io.of(/^\/\d+$/).on('connect', (socket) => {
    //     const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'
      
    //     // broadcast to all clients in the given sub-namespace
    //     newNamespace.emit('hello');
    // });
    
    io.listen(server);


    // middleware for socket incoming and outgoing requests
    io.use(socketMiddleware);


    io.sockets.on('connection', async function (socket) {


        // get device id on connection
        let device_id = null;
        let session_id = socket.id;
        let dvc_id = 0;
        let user_acc_id = 0;
        let is_sync = false;

        let isWeb = socket.handshake.query['isWeb'];
        if (isWeb !== undefined && isWeb !== 'undefined' && (isWeb !== false || isWeb !== 'false') && (isWeb === true || isWeb === 'true')) {
            isWeb = true;
        } else {
            isWeb = false;
            device_id = socket.handshake.query['device_id'];
        }

        console.log("connection established on device_id: " + device_id + " and session_id: " + session_id);

        // console.log("Number of sockets: ",io.sockets.sockets);
        // check the number of sockets connected to server
        let users = io.engine.clientsCount;
        console.log("connected_users: " + users);

        // socket io clients
        // console.log("socket clients", io.sockets.clients())

        // get socket io client url
        // console.log("url: " + socket.handshake.url);

        // get socket io server ip
        // console.log("server ip: " + socket.handshake.address);

        // get socket io server port
        // console.log(socket.handshake.address.port);

        // get socket io client ip
        // console.log("client ip: " + socket.request.connection.remoteAddress);

        if (device_id != undefined && device_id != null && isWeb === false) {

            console.log("on mobile side event");

            console.log("device_id: ", device_id);

            await device_helpers.onlineOfflineDevice(device_id, socket.id, Constants.DEVICE_ONLINE);

            dvc_id = await device_helpers.getOriginalIdByDeviceId(device_id);
            console.log("dvc_id: ", dvc_id);

            is_sync = await device_helpers.getDeviceSyncStatus(device_id);
            console.log("is_sync:", is_sync);

            user_acc_id = await device_helpers.getUsrAccIDbyDvcId(dvc_id);
            console.log("user_acc_id: ", user_acc_id);

            // on connection send current status to device
            socket.emit(Constants.GET_SYNC_STATUS + device_id, {
                device_id: device_id,
                apps_status: false,
                extensions_status: false,
                settings_status: false,
                // is_sync: (is_sync === 1 || is_sync === true || is_sync === 'true' || is_sync === '1') ? true : false,
                is_sync: device_helpers.checkNotNull(is_sync) ? true : false,
            });

            // ===================================================== Syncing Device ===================================================
            // request application from portal to specific device

            // from mobile side status of (history, profile)
            socket.on(Constants.SETTING_APPLIED_STATUS + device_id, async function (data) {
                console.log("settings applied successfully: " + device_id);
                // let historyUpdate = "UPDATE device_history SET status=1 WHERE user_acc_id=" + user_acc_id;
                // await sql.query(historyUpdate);

                var setting_query = `SELECT * FROM device_history WHERE user_acc_id=${user_acc_id} AND status=1 ORDER BY created_at DESC LIMIT 1`;
                let response = await sql.query(setting_query);

                // if (response.length > 0 && data.device_id != null) {
                if (response.length > 0) {
                    let app_list = JSON.parse(response[0].app_list);
                    let extensions = JSON.parse(response[0].permissions);
                    let controls = response[0].controls;

                    // new method that will only update not will check double query. here will be these methods
                    await device_helpers.updateApps(app_list, device_id);

                    await device_helpers.updateExtensions(extensions, device_id);

                    await device_helpers.insertOrUpdateSettings(controls, device_id);
                    
                    // these methods are old and wrong

                    // await device_helpers.insertApps(app_list, device_id);

                    // await device_helpers.insertExtensions(extensions, device_id);

                    // await device_helpers.insertOrUpdateSettings(response[0].controls, device_id);
                    sockets.ackSettingApplied(device_id, app_list, extensions, controls)
                }

            });


            // get apps from mobile side
            socket.on(Constants.SEND_APPS + device_id, async (apps) => {
                try {
                    console.log("get applications event: ", device_id);
                    // console.log(apps);
                    let applications = JSON.parse(apps);
                    // console.log("syncing device");
                    await device_helpers.insertApps(applications, device_id);
                    // console.log("device synced");
                    socket.emit(Constants.GET_SYNC_STATUS + device_id, {
                        device_id: device_id,
                        apps_status: true,
                        extensions_status: false,
                        settings_status: false,
                        is_sync: false,
                    });
                } catch (error) {
                    console.log(error);
                }

            });

            // get extensions from mobile side
            socket.on(Constants.SEND_EXTENSIONS + device_id, async (extensions) => {
                console.log("get extension event: " + device_id);
                // console.log("extensions: ", extensions);
                let extension_apps = JSON.parse(extensions);
                await device_helpers.insertExtensions(extension_apps, device_id);
                socket.emit("get_sync_status_" + device_id, {
                    device_id: device_id,
                    apps_status: true,
                    extensions_status: true,
                    settings_status: false,
                    is_sync: false,
                });
            });

            // get system settings from mobile side
            socket.on(Constants.SEND_SETTINGS + device_id, async (controls) => {
                console.log('getting device settings from ' + device_id);
                console.log("device controls", controls)
                // let device_permissions = permissions;

                await device_helpers.insertOrUpdateSettings(controls, device_id);
                console.log("Device save");
                await device_helpers.deviceSynced(device_id);

                socket.emit("get_sync_status_" + device_id, {
                    device_id: device_id,
                    apps_status: true,
                    extensions_status: true,
                    settings_status: true,
                    is_sync: true,
                });
            });

            // ===================================================== Pending Device Processes ===============================================
            // pending settings for device

            var profile_query = `SELECT * FROM device_history WHERE user_acc_id=${user_acc_id} AND status=0 AND type='profile' order by created_at desc limit 1`;
            let profile_res = await sql.query(profile_query);
            if (profile_res.length) {

                let historyUpdate = "UPDATE device_history SET status=1 WHERE user_acc_id=" + user_acc_id + " AND (type='history' OR type = 'profile') ";
                await sql.query(historyUpdate);

                socket.emit(Constants.GET_APPLIED_SETTINGS + device_id, {
                    device_id: device_id,
                    app_list: (profile_res[0].app_list === undefined || profile_res[0].app_list === null || profile_res[0].app_list === '') ? '[]' : profile_res[0].app_list,
                    passwords: (profile_res[0].passwords === undefined || profile_res[0].passwords === null || profile_res[0].passwords === '') ? '{}' : profile_res[0].passwords,
                    settings: (profile_res[0].controls === undefined || profile_res[0].controls === null || profile_res[0].controls === '') ? '{}' : profile_res[0].controls,
                    extension_list: (profile_res[0].permissions === undefined || profile_res[0].permissions === null || profile_res[0].permissions === '') ? '[]' : profile_res[0].permissions,
                    status: true
                });

            } else {
                var setting_query = "SELECT * FROM device_history WHERE user_acc_id=" + user_acc_id + " AND status=0 AND type='history' order by created_at desc limit 1";
                let setting_res = await sql.query(setting_query);
                if (setting_res.length) {
                    let historyUpdate = "UPDATE device_history SET status=1 WHERE user_acc_id=" + user_acc_id + " AND type='history' ";
                    await sql.query(historyUpdate);


                    socket.emit(Constants.GET_APPLIED_SETTINGS + device_id, {
                        device_id: device_id,
                        app_list: (setting_res[0].app_list === undefined || setting_res[0].app_list === null || setting_res[0].app_list === '') ? '[]' : setting_res[0].app_list,
                        passwords: (setting_res[0].passwords === undefined || setting_res[0].passwords === null || setting_res[0].passwords === '') ? '{}' : setting_res[0].passwords,
                        settings: (setting_res[0].controls === undefined || setting_res[0].controls === null || setting_res[0].controls === '') ? '{}' : setting_res[0].controls,
                        extension_list: (setting_res[0].permissions === undefined || setting_res[0].permissions === null || setting_res[0].permissions === '') ? '[]' : setting_res[0].permissions,
                        status: true
                    });
                } else {
                    socket.emit('get_applied_settings_' + device_id, {
                        device_id: device_id,
                        status: false
                    });
                }
            }



            // ================================================================ IMEI ===================================================
            // IMEI SOCKET
            socket.on(Constants.IMEI_APPLIED + device_id, async function (data) {
                console.log("imei_applied: " + device_id);
                sockets.ackImeiChanged(device_id);
                if (data.status) {
                    var imei_query = "UPDATE device_history SET status = 1 WHERE user_acc_id='" + user_acc_id + "' AND type = 'imei'";
                    let response = await sql.query(imei_query);
                }
            });

            socket.on(Constants.IMEI_CHANGED + device_id, async function (data) {
                let deviceId = data.device_id;
                var imei = data.imei;
                var serial_number = data.serial;
                var mac_address = data.mac;
                var imei1 = data.imei1
                var imei2 = data.imei2
                // console.log(data);


                if (serial_number !== undefined && serial_number !== null && mac_address !== undefined && mac_address !== null) {

                    sql.query("UPDATE devices set imei = '" + imei1 + "', imei2 = '" + imei2 + "' WHERE device_id = '" + deviceId + "'")
                    await device_helpers.saveImeiHistory(deviceId, serial_number, mac_address, imei1, imei2)
                    // res.send({
                    //     status: response
                    // })
                }
            });


            // IMEI History
            var imei_query = "SELECT * FROM device_history WHERE user_acc_id=" + user_acc_id + " AND status=0 AND type='imei' order by created_at desc limit 1";
            let imei_res = await sql.query(imei_query);

            if (imei_res.length) {
                io.emit(Constants.ACTION_IN_PROCESS + device_id, {
                    status: true,
                    type: 'imei'
                })
                socket.emit(Constants.WRITE_IMEI + device_id, {
                    device_id: device_id,
                    imei: imei_res[0].imei
                });
            }

            // ========================================================== PUSH APPS ============================================
            // pending pushed apps for device
            var pendingAppsQ = "SELECT * FROM device_history WHERE user_acc_id=" + user_acc_id + " AND status=0 AND type='push_apps' order by created_at desc limit 1";
            let pendingPushedApps = await sql.query(pendingAppsQ);

            if (pendingPushedApps.length) {

                io.emit(Constants.GET_PUSHED_APPS + device_id, {
                    status: true,
                    device_id: device_id,
                    push_apps: pendingPushedApps[0].push_apps
                });
                io.emit(Constants.ACTION_IN_PROCESS + device_id, {
                    status: true,
                    type: 'push'
                })
            }

            socket.on(Constants.SEND_PUSHED_APPS_STATUS + device_id, async (pushedApps) => {
                sockets.ackSinglePushApp(device_id, dvc_id, pushedApps);
            });

            socket.on(Constants.FINISHED_PUSH_APPS + device_id, async (response) => {
                // console.log("testing", response);
                sockets.ackFinishedPushApps(device_id, user_acc_id);
                // socket.emit(Constants.ACK_FINISHED_PUSH_APPS + device_id, {
                //     status: true
                // });
            });

            // =====================================================PULL APPS=================================================
            // pending pull apps
            var pendingPullAppsQ = `SELECT * FROM device_history WHERE user_acc_id=${user_acc_id} AND status=0 AND type='pull_apps' order by created_at desc limit 1`;
            let pendingPulledApps = await sql.query(pendingPullAppsQ);

            if (pendingPulledApps.length) {
                console.log("pendingPulledApps");

                io.emit(Constants.ACTION_IN_PROCESS + device_id, {
                    status: true,
                    type: 'pull'
                })

                io.emit(Constants.GET_PULLED_APPS + device_id, {
                    status: true,
                    device_id: device_id,
                    pull_apps: pendingPulledApps[0].pull_apps
                });
            }


            socket.on(Constants.SEND_PULLED_APPS_STATUS + device_id, async (pushedApps) => {
                console.log("send_pulled_apps_status_", pushedApps);
                sockets.ackSinglePullApp(device_id, dvc_id, pushedApps);
            })


            socket.on(Constants.FINISHED_PULL_APPS + device_id, async (response) => {
                console.log("FINISHED PULLED APPS", response);

                sockets.ackFinishedPullApps(device_id, user_acc_id);
                // socket.emit(Constants.ACK_FINISHED_PUSH_APPS + device_id, {
                //     status: true
                // });
            });


            // ======================================================= Policy ============================================================= \\

            // load policy from mobile menu via command
            socket.on(Constants.LOAD_POLICY + device_id, async (response) => {
                let { link_code, device_id, policy_name, is_default } = response;
                if (link_code != undefined && link_code !== null && link_code !== '') {

                    let dealerQ = "SELECT * FROM dealers WHERE link_code ='" + link_code + "'";

                    if (is_default) {
                        let dealer = await sql.query(dealerQ);
                        if (dealer.length) {
                            let policiesQ = "SELECT policy.* FROM policy LEFT JOIN dealer_policies ON policy.id = dealer_policies.policy_id WHERE (dealer_policies.dealer_id=" + dealer[0].dealer_id + " OR policy.dealer_id=" + dealer[0].dealer_id + " )  AND  policy.status=1  AND policy.delete_status=0";

                            let policies = await sql.query(policiesQ);
                            if (policies.length) {
                                let policyIds = [];
                                policies.forEach((policy) => {
                                    policyIds.push(policy.id);
                                });

                                let defaultQ = "SELECT * FROM default_policies WHERE dealer_id = " + dealer[0].dealer_id + " AND policy_id IN (" + policyIds.join() + ") ";
                                console.log(defaultQ);
                                let defaultP = await sql.query(defaultQ);
                                if (defaultP.length) {
                                    let policyQ = "SELECT * FROM policy WHERE id=" + defaultP[0].policy_id;
                                    let policy = await sql.query(policyQ);
                                    if (policy.length) {
                                        policy = await general_helpers.refactorPolicy(policy);

                                        socket.emit(Constants.GET_POLICY + device_id, {
                                            status: true,
                                            app_list: (policy[0].app_list === undefined || policy[0].app_list === null || policy[0].app_list === '') ? '[]' : policy[0].app_list,
                                            // passwords: (policy[0].passwords === undefined || policy[0].passwords === null || policy[0].passwords === '') ? '{}' : policy[0].passwords,
                                            settings: (policy[0].controls === undefined || policy[0].controls === null || policy[0].controls === '') ? '{}' : policy[0].controls,
                                            extension_list: (policy[0].permissions === undefined || policy[0].permissions === null || policy[0].permissions === '') ? '[]' : policy[0].permissions,
                                            push_apps: (policy[0].push_apps === undefined || policy[0].push_apps === null || policy[0].push_apps === '') ? '[]' : policy[0].push_apps,
                                            device_id: device_id,
                                        })
                                    } else {
                                        socket.emit(Constants.GET_POLICY + device_id, {
                                            status: false,
                                            device_id: device_id
                                        })
                                    }

                                } else {
                                    socket.emit(Constants.GET_POLICY + device_id, {
                                        status: false,
                                        device_id: device_id
                                    })
                                }

                            } else {
                                socket.emit(Constants.GET_POLICY + device_id, {
                                    status: false,
                                    device_id: device_id
                                })
                            }
                        } else {
                            socket.emit(Constants.GET_POLICY + device_id, {
                                status: false,
                                device_id: device_id
                            })
                        }
                    } else if (policy_name !== '' && policy_name !== null) {
                        let dealer = await sql.query(dealerQ);
                        if (dealer.length) {
                            let policyQ = "SELECT policy.* FROM policy LEFT JOIN dealer_policies ON policy.id = dealer_policies.policy_id WHERE (dealer_policies.dealer_id=" + dealer[0].dealer_id + " OR policy.dealer_id=" + dealer[0].dealer_id + " )  AND  policy.command_name = '" + policy_name + "' AND policy.status=1  AND policy.delete_status=0";
                            let policy = await sql.query(policyQ);
                            if (policy.length) {
                                policy = await general_helpers.refactorPolicy(policy);

                                socket.emit(Constants.GET_POLICY + device_id, {
                                    status: true,
                                    app_list: (policy[0].app_list === undefined || policy[0].app_list === null || policy[0].app_list === '') ? '[]' : policy[0].app_list,
                                    settings: (policy[0].controls === undefined || policy[0].controls === null || policy[0].controls === '') ? '{}' : policy[0].controls,
                                    extension_list: (policy[0].permissions === undefined || policy[0].permissions === null || policy[0].permissions === '') ? '[]' : policy[0].permissions,
                                    push_apps: (policy[0].push_apps === undefined || policy[0].push_apps === null || policy[0].push_apps === '') ? '[]' : policy[0].push_apps,
                                    device_id: device_id,
                                })
                            } else {
                                socket.emit(Constants.GET_POLICY + device_id, {
                                    status: false,
                                    device_id: device_id
                                })
                            }

                        } else {
                            socket.emit(Constants.GET_POLICY + device_id, {
                                status: false,
                                device_id: device_id
                            })
                        }

                    } else {
                        socket.emit(Constants.GET_POLICY + device_id, {
                            status: false,
                            device_id: device_id
                        });
                    }
                } else {
                    socket.emit(Constants.GET_POLICY + device_id, {
                        status: false,
                        device_id: device_id
                    });
                }
            });

            //apply_policy_offline with top priority
            let policyHistoryQ = "SELECT * FROM device_history WHERE user_acc_id=" + user_acc_id + " AND status=0 AND type='policy' order by created_at desc limit 1";
            let policyResult = await sql.query(policyHistoryQ)
            if (policyResult.length) {

                socket.emit(Constants.GET_POLICY + device_id, {
                    status: true,
                    app_list: (policyResult[0].app_list === undefined || policyResult[0].app_list === null || policyResult[0].app_list === '') ? '[]' : policyResult[0].app_list,
                    settings: (policyResult[0].controls === undefined || policyResult[0].controls === null || policyResult[0].controls === '') ? '{}' : policyResult[0].controls,
                    extension_list: (policyResult[0].permissions === undefined || policyResult[0].permissions === null || policyResult[0].permissions === '') ? '[]' : policyResult[0].permissions,
                    push_apps: (policyResult[0].push_apps === undefined || policyResult[0].push_apps === null || policyResult[0].push_apps === '') ? '[]' : policyResult[0].push_apps,
                    device_id: device_id,
                });
            }

            // policy step 1;
            socket.on(Constants.FINISH_POLICY_PUSH_APPS + device_id, (response) => {
                sockets.ackFinishedPolicyStep(device_id, user_acc_id);

            });

            // policy step 2;
            socket.on(Constants.FINISH_POLICY_APPS + device_id, (response) => {
                sockets.ackFinishedPolicyStep(device_id, user_acc_id);
            });

            // policy step 3;
            socket.on(Constants.FINISH_POLICY_SETTINGS + device_id, (response) => {
                sockets.ackFinishedPolicyStep(device_id, user_acc_id);
            });

            // policy step 4;
            socket.on(Constants.FINISH_POLICY_EXTENSIONS + device_id, (response) => {
                sockets.ackFinishedPolicyStep(device_id, user_acc_id);
            });

            // policy finished;
            socket.on(Constants.FINISH_POLICY + device_id, (response) => {
                sockets.ackFinishedPolicy(device_id, user_acc_id);
            })



            //************** */ SIM MODULE
            socket.on(Constants.ACK_SIM + device_id, async function (response) {
                console.log('ack ==============> ', response)
                if (response != undefined) {
                    let uQry = `UPDATE sims SET sync = '1' WHERE device_id = '${response.device_id}' AND iccid = '${response.iccid}'`;
                    await sql.query(uQry);
                }
            })

            socket.on(Constants.RECV_SIM + device_id, async function (response) {
                console.log('===== RECV_SIM =========> ', response);
                // return;
                sockets.updateSimRecord(device_id, response);
            })


            let sUnEmitSims = `SELECT * FROM sims WHERE sync = '0' AND del ='0'`;
            // console.log('========= check data when socket => re-connect ================= ', sUnEmitSims);
            let simResult = await sql.query(sUnEmitSims);
            // console.log('results are: ', simResult);
            if (simResult.length > 0) {
                simResult.forEach(async function (data, index) {
                    // data['guest'] = data.guest == 1 ? true : false;
                    // data['encrypt'] = data.encrypt == 1 ? true : false;
                    // console.log('updated result is: ', data);
                    socket.emit(Constants.SEND_SIM + data.device_id, {
                        device_id: data.device_id,
                        sim: (data === undefined || data === null || data === '') ? '{}' : JSON.stringify(data),
                    });
                    let uQry = `UPDATE sims SET sync = '1' WHERE device_id = '${data.device_id}' AND iccid = '${data.iccid}' AND del='0'`;
                    await sql.query(uQry);
                })
            }

            // socket.on(Constants.GET_INSTALLED_APPS + device_id, sockets.installedApps)

            // socket.on(Constants.GET_UNINSTALLED_APPS + device_id, sockets.uninstalledApps)
            
            socket.on(Constants.GET_INSTALLED_APPS + device_id, (response)=> {
                sockets.installedApps(device_id, dvc_id, response)
            })

            socket.on(Constants.GET_UNINSTALLED_APPS + device_id, (response)=> {
                sockets.uninstalledApps(device_id, dvc_id, response)
            })

            // ====================================================== Force Update =====================================

        } else {
            // socket.join('testRoom');
            // console.log("on web side");
            setInterval(function () {
                // socket.to('testRoom').emit('hello_web', "hello web");
                // socket.emit('hello_web', "hello web");
            }, 1000);
            // socket.emit('hello_web', "hello web");
        }


        // ====================================================== Common Channels =====================================
        // common channels for panel and device
        socket.on(Constants.DISCONNECT, async () => {
            console.log("disconnected: session " + socket.id + " on device id: " + device_id);
            await device_helpers.onlineOfflineDevice(null, socket.id, Constants.DEVICE_OFFLINE);
            console.log("connected_users: " + io.engine.clientsCount);

        });

        socket.on(Constants.CONNECT_ERROR, (error) => {
            console.log("connection_error_occurred: " + error);
        });

        socket.on(Constants.CONNECT_TIMEOUT, (timeout) => {
            console.log("connection_timeout: " + timeout);
        });

        socket.on('error', (error) => {
            console.log("error_occurred: " + error);
        });

        socket.on(Constants.RECONNECT, (attemptNumber) => {
            console.log("reconnecting: " + attemptNumber);
        });

        socket.on(Constants.RECONNECT_ATTEMPT, (attemptNumber) => {
            console.log("reconnect_attempt: " + attemptNumber);
        });

        socket.on(Constants.RECONNECTING, (attemptNumber) => {
            console.log("reconnecting: " + attemptNumber);
        });

        socket.on(Constants.RECONNECT_ERROR, (error) => {
            console.log("reconnect_error: " + error);
        });

        socket.on(Constants.RECONNECT_FAILED, () => {
            console.log("reconnect_failed: ");
        });

        socket.on(Constants.PING, () => {
            console.log("ping: ");
        });

        socket.on(Constants.PONG, (latency) => {
            console.log("pong: " + latency);
        });

        // socket.compress(false).emit('an event', { some: 'data' });
    });

    return io;
}

// sockets.deviceFlagged = async (device_id, msg) => {
//     console.log('deviceFlagged data is=> ', { device_id, msg });

//     io.emit(Constants.FLAGGED + device_id, {
//         device_id,
//         msg
//     });
// }

sockets.sendRegSim = async (device_id, action, data) => {
    console.log('sendRegSim data is=> ', {
        action,
        device_id,
        entries: (data === undefined || data === null || data === '') ? '{}' : JSON.stringify(data),
    });

    io.emit(Constants.SEND_SIM + device_id, {
        action,
        device_id,
        entries: (data === undefined || data === null || data === '') ? '{}' : JSON.stringify(data),
    });
}

sockets.updateSimRecord = async function (device_id, response) {
    // console.log('action is: ', response.action)
    // console.log('entries is: ', response.entries)

    let arr = JSON.parse(response.entries);
    console.log('parsed data is: ', arr);
    if (response.action == "sim_unregister") {
        // console.log('you are at unReg Section');
        sql.query(`UPDATE sims SET unrGuest=${arr.unrGuest}, unrEncrypt=${arr.unrEncrypt} WHERE device_id='${device_id}' AND del='0'`, async function (err, reslt) {
            if (err) console.log(err)
        });
    } else {

        if (arr.length > 0) {
            if (response.action == 'sim_delete') {
                arr.map(async function (iccid, index) {
                    // let dQry = `DELETE FROM sims WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;
                    let dQry = `UPDATE sims SET del='1' WHERE device_id = '${device_id}' AND iccid = '${iccid}'`;

                    await sql.query(dQry);
                })
            } else {
                arr.map(async function (data, index) {
                    let sQry = `SELECT * FROM sims WHERE device_id = '${device_id}' AND iccid = '${data.iccid}' AND del='0'`;
                    let rslt = await sql.query(sQry);

                    if (rslt.length < 1) {
                        let IQry = `INSERT IGNORE INTO sims (device_id, iccid, name, sim_id, slotNo, note, guest, encrypt, status, dataLimit, sync) VALUES ('${device_id}', '${data.iccid}', '${data.name}', '', '${data.slotNo}', '${data.note}', ${data.guest}, ${data.encrypt}, '${data.status}', '', '1');`;
                        await sql.query(IQry, async function (err, result) {
                            if (err) console.log(err);
                        })
                    } else {
                        let uQry = `UPDATE sims SET name='${data.name}', note='${data.note}', guest=${data.guest}, encrypt=${data.encrypt}, status='${data.status}', slotNo='${data.slotNo}', sync = '1' WHERE device_id = '${device_id}' AND iccid = '${data.iccid}' AND del='0'`;
                        await sql.query(uQry);
                    }

                })
            }
        }
    }
    io.emit(Constants.RECV_SIM_DATA + device_id, {
        status: true
    });
}


sockets.sendEmit = async (app_list, passwords, controls, permissions, device_id) => {

    io.emit(Constants.GET_APPLIED_SETTINGS + device_id, {
        device_id: device_id,
        app_list: (app_list === undefined || app_list === null || app_list === '') ? '[]' : app_list,
        passwords: (passwords === undefined || passwords === null || passwords === '') ? '{}' : passwords,
        settings: (controls === undefined || controls === null || controls === '') ? '{}' : controls,
        extension_list: (permissions == undefined || permissions == null || permissions == '') ? '{}' : permissions,
        status: true
    });
}

sockets.applyPushApps = (push_apps, device_id) => {
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
}

sockets.getPullApps = (pull_apps, device_id) => {

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
}

sockets.writeImei = (imei, device_id) => {
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
}

sockets.syncDevice = async (device_id) => {
    io.emit(Constants.GET_SYNC_STATUS + device_id, {
        device_id: device_id,
        apps_status: false,
        extensions_status: false,
        settings_status: false,
        is_sync: false,
    });
}

// live device status activity
sockets.sendDeviceStatus = async function (device_id, device_status, status = false) {
    console.log("send device status", device_id);
    io.emit(Constants.DEVICE_STATUS + device_id, {
        device_id: device_id,
        status: status,
        msg: device_status
    });
}

sockets.ackSettingApplied = async function (device_id, app_list, extensions, controls){
    console.log("ackSettingApplied() ", device_id, controls);
    io.emit(Constants.ACK_SETTING_APPLIED + device_id, {
        app_list: app_list,
        extensions: extensions,
        controls: controls
    })
}


sockets.installedApps = async (deviceId, dvcId, response) => {
    // console.log("installedApps()", response);
    let app_list = JSON.parse(response);

    let application = await device_helpers.pushAppProcess(deviceId, dvcId, app_list);
    
    if(application.length){
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
    

}


sockets.ackSinglePushApp = async function (device_id, dvcId, response) {
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
}

sockets.ackFinishedPushApps = async function (device_id, user_acc_id) {

    await sql.query("DELETE from apps_queue_jobs WHERE device_id = '" + device_id + "' AND type = 'push'")
    // await sql.query("UPDATE apps_queue_jobs set is_in_process = 0 WHERE device_id = '" + device_id + "'")
    var pushAppsQ = "UPDATE device_history SET status=1 WHERE type='push_apps' AND user_acc_id=" + user_acc_id + "";
    await sql.query(pushAppsQ)

    io.emit(Constants.ACK_FINISHED_PUSH_APPS + device_id, {
        status: true
    });
}

sockets.uninstalledApps = async (deviceId, dvcId, response) => {
    console.log("uninstalledApps() ", response);
    let app_list = JSON.parse(response);
    await device_helpers.pullAppProcess(deviceId, dvcId, app_list);

    io.emit(Constants.ACK_UNINSTALLED_APPS + deviceId, {
        status: true,
        app_list: app_list
    })
}

sockets.ackSinglePullApp = async function (device_id, dvc_id, response) {

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

}
sockets.ackFinishedPullApps = async function (device_id, user_acc_id) {
    var pullAppsQ = "UPDATE device_history SET status=1 WHERE type='pull_apps' AND user_acc_id=" + user_acc_id + "";
    await sql.query(pullAppsQ)
    await sql.query("DELETE from apps_queue_jobs WHERE device_id = '" + device_id + "' AND type = 'pull'")

    io.emit(Constants.ACK_FINISHED_PULL_APPS + device_id, {
        status: true
    })
}

sockets.ackFinishedPolicyStep = async function (device_id, user_acc_id) {
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
}

sockets.ackFinishedPolicy = async function (device_id, user_acc_id) {
    console.log("FINISHED POLICY")

    var pushAppsQ = "UPDATE device_history SET status=1 WHERE type='policy' AND user_acc_id=" + user_acc_id + "";
    await sql.query(pushAppsQ)
    await sql.query("DELETE from policy_queue_jobs WHERE device_id = '" + device_id + "'")

    io.emit(Constants.FINISH_POLICY + device_id, {
        status: true
    });
}

sockets.ackImeiChanged = async function (device_id) {
    console.log("IMEI Applied")
    await sql.query("UPDATE devices set is_push_apps = 0 WHERE device_id = '" + device_id + "'")

    io.emit(Constants.FINISH_IMEI + device_id, {
        status: true
    });
}


sockets.getPolicy = (device_id, policy) => {
    io.emit(Constants.ACTION_IN_PROCESS + device_id, {
        status: true,
        type: 'policy'
    })
    io.emit(Constants.GET_POLICY + device_id, {
        status: true,
        app_list: (policy.app_list === undefined || policy.app_list === null || policy.app_list === '') ? '[]' : policy.app_list,
        settings: (policy.controls === undefined || policy.controls === null || policy.controls === '') ? '{}' : policy.controls,
        extension_list: (policy.permissions === undefined || policy.permissions === null || policy.permissions === '') ? '[]' : policy.permissions,
        push_apps: (policy.push_apps === undefined || policy.push_apps === null || policy.push_apps === '') ? '[]' : policy.push_apps,
        device_id: device_id,
    });
}

sockets.forceCheckUpdate = async function (device_id) {
    console.log("testing forceupdate", device_id);
    io.emit(Constants.FORCE_UPDATE_CHECK + device_id, {
        device_id: device_id,
        status: true
    });
}

module.exports = sockets;


