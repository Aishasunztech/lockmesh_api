// sockets.js
var socket = require('socket.io');
const sql = require('../helper/sql.js');
const device_helpers = require('../helper/device_helpers.js');
const general_helpers = require('../helper/general_helper.js');
var jwt = require('jsonwebtoken');
var config = require('../helper/config.js');
var Constants = require('../constants/Application');

// verify token
const verifyToken = function (token) {
    // check header or url parameters or post parameters for token
    if (token !== undefined && token !== null && token !== '' && token !== 'undefined') {
        // verifies secret and checks exp
        return jwt.verify(token.replace(/['"]+/g, ''), config.secret, function (err, decoded) {
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

const verifySession = async (deviceId, sessionId, isWeb = false) => {
    if (isWeb !== undefined && isWeb === true) {
        return true;
    }
    // device is offline or session_id is matched
    // var query = "SELECT id FROM devices WHERE device_id='" + deviceId + "' AND (online='off' OR session_id='" + sessionId + "')";
    var query = "SELECT id FROM devices WHERE device_id='" + deviceId + "'";
    let res = await sql.query(query);
    if (res.length) {
        return true;
    } else {
        return false;
    }
}

module.exports.listen = async function (server) {

    // socket configuration options
    // {
    //    path: '/socket.io',
    //    serveClient: false,
    //    below are engine.IO options
    //    pingInterval: 10000,
    //    pingTimeout: 5000,
    //    cookie: false
    // }

    io = socket();

    // io = socket({
    //     pingTimeout :100
    // });


    // io.attach(server, {
    //     // pingInterval: 1,
    //     pingTimeout: 1,
    //     cookie: false
    // });

    // ===============================================================================
    // io.of('/') is for middleware not for path
    // ===============================================================================

    io.listen(server);

    // check origins of incoming request
    // io.origins((origin, callback) => {
    //     // if (origin !== 'https://foo.example.com') {
    //     //     return callback('origin not allowed', false);
    //     // }
    //     console.log("origins: "+ origin);
    //     callback();
    // });

    // middleware for socket incoming and outgoing requests
    io.use(async function (socket, next) {
        let token = socket.handshake.query.token;
        if (verifyToken(token)) {

            let session_id = socket.id;

            var device_id = null;

            let isWeb = socket.handshake.query['isWeb'];

            if (isWeb !== undefined && isWeb !== 'undefined' && (isWeb !== false || isWeb !== 'false') && (isWeb === true || isWeb === 'true')) {
                isWeb = true;
            } else {
                isWeb = false;
                device_id = socket.handshake.query['device_id'];
            }


            let sessionVerify = await verifySession(device_id, session_id, isWeb);

            if (device_id != undefined && device_id !== null && sessionVerify) {
                console.log("mobile side: ", device_id);
                next();
            } else if (isWeb === true && sessionVerify) {
                console.log("web side: ", isWeb);
                next();
            } else {
                return next(new Error('authentication error'));
            }

        } else {
            return next(new Error('authentication error'));
        }
    });

    var allClients = [];
    io.on('connection', async function (socket) {
        allClients.push(socket);

        //socket.disconnect(true);
        //socket.join('device_id');

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

            await device_helpers.onlineOflineDevice(device_id, socket.id, Constants.DEVICE_ONLINE);

            dvc_id = await device_helpers.getOriginalIdByDeviceId(device_id);
            console.log("dvc_id: ", dvc_id);

            is_sync = await device_helpers.getDeviceSyncStatus(device_id);
            console.log("is_sync:", is_sync);

            user_acc_id = await device_helpers.getUsrAccIDbyDvcId(dvc_id);
            console.log("user_acc_id: ", user_acc_id);

            socket.on(Constants.IMEI_APPLIED + device_id, async function (data) {
                console.log("imei_applied: " + device_id);
                if (data.status) {
                    var imei_query = "UPDATE device_history SET status = 1 WHERE user_acc_id='" + user_acc_id + "' AND type = 'imei' ORDER BY created_at DESC LIMIT 1";
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

                if (serial_number !== undefined && serial_number !== null && mac_address !== undefined && mac_address !== null) {

                    sql.query("UPDATE devices set imei = '" + imei1 + "', imei2 = '" + imei2 + "' WHERE device_id = '" + deviceId + "'")
                    await device_helpers.saveImeiHistory(deviceId, serial_number, mac_address, imei1, imei2)
                    // res.send({
                    //     status: response
                    // })
                }
            });


            var imei_query = "SELECT * FROM device_history WHERE user_acc_id=" + user_acc_id + " AND status=0 AND type='imei' order by created_at desc limit 1";
            let imei_res = await sql.query(imei_query);

            if (imei_res.length) {
                socket.emit(Constants.WRITE_IMEI + device_id, {
                    device_id: device_id,
                    imei: imei_res[0].imei
                });
            }
            socket.emit(Constants.GET_SYNC_STATUS + device_id, {
                device_id: device_id,
                apps_status: false,
                extensions_status: false,
                settings_status: false,
                is_sync: (is_sync === 1 || is_sync === true || is_sync === 'true' || is_sync === '1') ? true : false,
            });

            // pending settings for device
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

            // pending pushed apps for device
            var pendingAppsQ = "SELECT * FROM device_history WHERE user_acc_id=" + user_acc_id + " AND status=0 AND type='push_apps' order by created_at desc limit 1";
            let pendingPushedApps = await sql.query(pendingAppsQ);

            if (pendingPushedApps.length) {
                // console.log("pendingPushedApps",pendingPushedApps);
                let pushHistoryUpdate = "UPDATE device_history SET status=1 WHERE user_acc_id=" + user_acc_id + " AND type='push_apps'";
                await sql.query(pushHistoryUpdate);
                io.emit(Constants.GET_PUSHED_APPS + device_id, {
                    status: true,
                    device_id: device_id,
                    push_apps: pendingPushedApps[0].push_apps
                });
            }

            // request application from portal to specific device
            socket.on(Constants.SETTING_APPLIED_STATUS + device_id, async function (data) {
                console.log("settings_applied: " + device_id);
                // let historyUpdate = "UPDATE device_history SET status=1 WHERE user_acc_id=" + user_acc_id;
                // await sql.query(historyUpdate);
                var setting_query = "SELECT * FROM device_history WHERE user_acc_id='" + user_acc_id + "' AND status=1 ORDER BY created_at DESC LIMIT 1";
                let response = await sql.query(setting_query);

                if (response.length > 0 && data.device_id != null) {
                    let app_list = JSON.parse(response[0].app_list);

                    console.log("insertings applications");
                    // console.log(response[0].app_list);

                    console.log("inserting setiings");
                    // console.log(response[0].permissions);

                    await device_helpers.insertApps(app_list, device_id);

                    // await device_helpers.insertExtensions(extension_apps, device_id);

                    await device_helpers.insertOrUpdateSettings(response[0].controls, device_id);
                }

            });


            // send apps from mobile side
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

            // send extensions from mobile side
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

            // send system settings from mobile side
            socket.on(Constants.SEND_SETTINGS + device_id, async (controls) => {
                console.log('getting device settings from ' + device_id);
                console.log("device controls", controls)
                // let device_permissions = permissions;

                await device_helpers.insertOrUpdateSettings(controls, device_id);
                // console.log("Device save");
                await device_helpers.deviceSynced(device_id);

                socket.emit("get_sync_status_" + device_id, {
                    device_id: device_id,
                    apps_status: true,
                    extensions_status: true,
                    settings_status: true,
                    is_sync: true,
                });
            });

            socket.on(Constants.SEND_PUSHED_APPS_STATUS + device_id, async (pushedApps) => {
                console.log("send_pushed_apps_status_", pushedApps);
                require('../bin/www').ackSinglePushApp(device_id, pushedApps);

            })

            socket.on(Constants.FINISHED_PUSH_APPS + device_id, async (response) => {
                console.log("testing", response);

                require('../bin/www').ackFinishedPushApps(device_id, response);
                // socket.emit(Constants.ACK_FINISHED_PUSH_APPS + device_id, {
                //     status: true
                // });
            });
        } else {
            // socket.emit('ack_finished_push_apps_', {
            //     status:false
            // });
            console.log("web socket");
        }


        // common channels for panel and device
        socket.on(Constants.DISCONNECT, async () => {
            console.log("disconnected: session " + socket.id + " on device id: " + device_id);
            await device_helpers.onlineOflineDevice(null, socket.id, Constants.DEVICE_OFFLINE);
            console.log("connected_users: " + io.engine.clientsCount);

            var i = allClients.indexOf(socket);
            allClients.splice(i, 1);
        });

        socket.on('connect_error', (error) => {
            console.log("connection_error_occured: " + error);
        });

        socket.on('connect_timeout', (timeout) => {
            console.log("connection_timeout: " + timeout);
        });

        socket.on('error', (error) => {
            console.log("error_occured: " + error);
        });

        socket.on('reconnect', (attemptNumber) => {
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

