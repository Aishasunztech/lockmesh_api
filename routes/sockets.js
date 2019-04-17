// sockets.js
var socket = require('socket.io');
const sql = require('../helper/sql.js');
const device_helpers = require('../helper/device_helpers.js');
const general_helpers = require('../helper/general_helper.js');
var jwt = require('jsonwebtoken');
var config = require('../helper/config.js');
var zlib = require('zlib');
var gzip = zlib.createUnzip();

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


    // io.attach(server, {
    //     pingInterval: 10000,
    //     pingTimeout: 5000,
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

    // verify token
    var verifyToken = function (token) {
        // check header or url parameters or post parameters for token
        if (token) {
            // verifies secret and checks exp
            return jwt.verify(token.replace(/['"]+/g, ''), config.secret, function (err, decoded) {
                console.log(err);
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

    var verifySession = async (deviceId, sessionId, isWeb = false) => {
        if (isWeb !==undefined && isWeb===true) {
            return true;
        }
        var query = "select * from devices where device_id='" + deviceId + "' and session_id='" + sessionId + "'";
        let res = await sql.query(query);
        if (res.length) {
            return true;
        } else {
            false;
        }
    }
    // middleware for socket incoming and outgoing requests
    io.use(function (socket, next) {
        console.log("socket middleware");
        let token = socket.handshake.query.token;
        // console.log("socket token", socket.handshake);
        let session_id = socket.id;

        var device_id = null;
        isWeb = false;

        if (socket.handshake._query == undefined) {
            device_id = socket.handshake.query['device_id'];
            isWeb = socket.handshake.query['isWeb'];
        } else {
            device_id = socket.handshake._query['device_id'];
            isWeb = socket.handshake._query['isWeb'];
        }
        console.log("isWeb", isWeb);
        if (verifyToken(token)) {
            if (device_id != undefined && verifySession(device_id, session_id, isWeb)) {
                next();
            } else if (isWeb===true){
                console.log("m here",isWeb);
                next();
            } 
            else {
                // console.log("authentication error device");
                return next(new Error('authentication error'));
            }
        } else {
            // console.log("authentication error token");
            return next(new Error('authentication error'));
        }
    });

    io.on('connection', async function (socket) {

        //socket.disconnect(true);
        //socket.join('device_id');

        // get device id on connection
        let device_id = socket.request._query['device_id'];
        let session_id = socket.id;
        let dvc_id = 0;
        let user_acc_id= 0;
        let isWeb = socket.handshake.query['isWeb'];

        console.log("connection established on: " + device_id + " and " + session_id);

        // check the number of sockets connected to server
        // console.log(io.sockets.sockets.length);
        console.log("connected_users: " + io.engine.clientsCount);

        // get socket io client url
        // console.log("url: " + socket.handshake.url);

        // get socket io server ip
        // console.log("server ip: " + socket.handshake.address);

        // get socket io server port
        // console.log(socket.handshake.address.port);

        // get socket io client ip
        // console.log("client ip: " + socket.request.connection.remoteAddress);

        if (device_id != undefined && device_id != null) {
            // if (socket.handshake.query['isWeb'] == undefined || socket.handshake.query['isWeb'] == false) {
            console.log("on mobile side event");
            await device_helpers.onlineOflineDevice(device_id, socket.id, 'On');
            dvc_id = await device_helpers.getOriginalIdByDeviceId(device_id);
            console.log("dvc_id", dvc_id);
            user_acc_id = await device_helpers.getUsrAccIDbyDvcId(dvc_id);
            console.log("user_acc_id", user_acc_id);

            // }
        }

        var setting_query = "SELECT * FROM device_history WHERE user_acc_id=" + user_acc_id + " AND status=0 order by created_at desc limit 1";
        let setting_res = await sql.query(setting_query);

        if (setting_res.length) {
            console.log("app_list" + setting_res[0].app_list);

            socket.emit('get_applied_settings_' + device_id, {
                device_id: device_id,
                app_list: (setting_res[0].app_list == null || setting_res[0].app_list == '') ? '[]' : setting_res[0].app_list,
                passwords: (setting_res[0].passwords ==null || setting_res[0].passwords == '')? '{}' : setting_res[0].passwords,
                settings: (setting_res[0].permissions == null || setting_res[0].permissions == '') ? '{}' : setting_res[0].permissions,
                status: true
            });
        } else {
            socket.emit('get_applied_settings_' + device_id, {
                device_id: device_id,
                status: false
            });
        }

        // request application from portal to specific device
        socket.on('settings_applied_status_' + device_id, async function (data) {
            console.log("settings_applied: " + data.device_id);
            let historyUpdate = "UPDATE device_history SET status=1 WHERE user_acc_id=" + user_acc_id;
            await sql.query(historyUpdate);
            var setting_query = "SELECT * FROM device_history WHERE user_acc_id='" + user_acc_id + "' AND status=1 ORDER BY created_at DESC LIMIT 1";
            let response = await sql.query(setting_query);
            
            if (response.length > 0 && data.device_id != null) {
                let app_list = JSON.parse(response[0].app_list);

                // console.log("insertings applications");
                // console.log(response[0].app_list);

                console.log("inserting setiings");
                console.log(response[0].permissions);
                
                await device_helpers.insertApps(app_list, data.device_id);
                await device_helpers.insertOrUpdateSettings(response[0].permissions, data.device_id);
            }


        });


        socket.on('sendApps_' + device_id, async (apps) => {
            console.log("get applications event: " + device_id);

            let applications = JSON.parse(apps);

            console.log("application_lenght: " + applications.length);
            console.log("syncing device");

            await device_helpers.insertApps(applications, device_id);
            console.log("device synced");
            socket.emit("get_sync_status_" + device_id, {
                is_sync: true,
                device_id: device_id
            });

        });

        socket.on('sendSettings_' + device_id, async (permissions) => {
            console.log('getting device settings from ' + device_id);
            let device_permissions = permissions;
            console.log("device permissions", device_permissions)
            await device_helpers.insertOrUpdateSettings(device_settings, dvc_id);
            
        });

        // listen on built-in channels
        socket.on('disconnect', async () => {
            // check the number of sockets connected to server
            // console.log("disconnected: session " + socket.id + " on device id: " + device_id);

            // console.log("connected_users: " + io.engine.clientsCount);
            // if (socket.handshake.query['isWeb'] == undefined || socket.handshake.query['isWeb'] == false) {
                await device_helpers.onlineOflineDevice(null, socket.id, 'off');
            // }
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

        socket.on('reconnect_attempt', (attemptNumber) => {
            console.log("reconnect_attempt: " + attemptNumber);
        });

        socket.on('reconnecting', (attemptNumber) => {
            console.log("reconnecting: " + attemptNumber);
        });

        socket.on('reconnect_error', (error) => {
            console.log("reconnect_error: " + error);
        });

        socket.on('reconnect_failed', () => {
            console.log("reconnect_failed: ");
        });

        socket.on('ping', () => {
            console.log("ping: ");
        });

        socket.on('pong', (latency) => {
            console.log("pong: " + latency);
        });

        

        // socket.compress(false).emit('an event', { some: 'data' });
    });
    return io;
}

