
var app = require('../app');
var debug = require('debug')('webportalbackend:server');
var http = require('http');
var Constants = require('../constants/Application');
const { sql } = require('../config/database');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
require('../routes/sockets').listen(server);

var crons = require('../crons/index');
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);

// servers.listen(port);
// servers.on('error', onError);
// servers.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}

// =======================================Socket======================================= //

// if device is live then send data to device
module.exports.sendEmit = async (app_list, passwords, controls, permissions, device_id) => {

  io.emit(Constants.GET_APPLIED_SETTINGS + device_id, {
    device_id: device_id,
    app_list: (app_list === undefined || app_list === null || app_list === '') ? '[]' : app_list,
    passwords: (passwords === undefined || passwords === null || passwords === '') ? '{}' : passwords,
    settings: (controls === undefined || controls === null || controls === '') ? '{}' : controls,
    extension_list: (permissions == undefined || permissions == null || permissions == '') ? '{}' : permissions,
    status: true
  });
}

module.exports.applyPushApps = (push_apps, device_id) => {
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

module.exports.getPullApps = (pull_apps, device_id) => {
  io.emit(Constants.ACTION_IN_PROCESS + device_id, {
    status: true,
    type: 'pull'
  })
  io.emit(Constants.GET_PULLED_APPS + device_id, {
    status: true,
    device_id: device_id,
    pull_apps: pull_apps
  });
}
module.exports.writeImei = (imei, device_id) => {
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

module.exports.syncDevice = async (device_id) => {
  io.emit(Constants.GET_SYNC_STATUS + device_id, {
    device_id: device_id,
    apps_status: false,
    extensions_status: false,
    settings_status: false,
    is_sync: false,
  });
}
// live device status activity
module.exports.sendDeviceStatus = async function (device_id, device_status, status = false) {
  console.log("send device status", device_id);
  io.emit(Constants.DEVICE_STATUS + device_id, {
    device_id: device_id,
    status: status,
    msg: device_status
  });
}

module.exports.ackFinishedPushApps = async function (device_id, user_acc_id) {

  await sql.query("DELETE from apps_queue_jobs WHERE device_id = '" + device_id + "' AND type = 'push'")
  // await sql.query("UPDATE apps_queue_jobs set is_in_process = 0 WHERE device_id = '" + device_id + "'")
  var pushAppsQ = "UPDATE device_history SET status=1 WHERE type='push_apps' AND user_acc_id=" + user_acc_id + "";
  await sql.query(pushAppsQ)

  io.emit(Constants.ACK_FINISHED_PUSH_APPS + device_id, {
    status: true
  });
}
module.exports.ackFinishedPullApps = async function (device_id, user_acc_id) {


  var pullAppsQ = "UPDATE device_history SET status=1 WHERE type='pull_apps' AND user_acc_id=" + user_acc_id + "";
  await sql.query(pullAppsQ)
  await sql.query("DELETE from apps_queue_jobs WHERE device_id = '" + device_id + "' AND type = 'pull'")

  io.emit(Constants.ACK_FINISHED_PULL_APPS + device_id, {
    status: true
  })
}
module.exports.ackFinishedPolicy = async function (device_id, user_acc_id) {
  console.log("FINISHED POLICY")

  var pushAppsQ = "UPDATE device_history SET status=1 WHERE type='policy' AND user_acc_id=" + user_acc_id + "";
  await sql.query(pushAppsQ)
  await sql.query("DELETE from policy_queue_jobs WHERE device_id = '" + device_id + "'")

  io.emit(Constants.FINISH_POLICY + device_id, {
    status: true
  });
}
module.exports.ackFinishedPolicyStep = async function (device_id, user_acc_id) {
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
module.exports.ackImeiChanged = async function (device_id) {
  console.log("IMEI Applied")
  await sql.query("UPDATE devices set is_push_apps = 0 WHERE device_id = '" + device_id + "'")

  io.emit(Constants.FINISH_IMEI + device_id, {
    status: true
  });
}

module.exports.ackSinglePushApp = async function (device_id, response) {
  // console.log("SINGLE APP PUSH");
  let completePushApps = 0
  let queueAppsData = await sql.query("SELECT * from apps_queue_jobs where device_id = '" + device_id + "' AND type = 'push' order by created_at desc limit 1")
  if (queueAppsData.length) {

    completePushApps = queueAppsData[0].complete_apps + 1
    await sql.query("UPDATE apps_queue_jobs set complete_apps = " + completePushApps + " WHERE device_id = '" + device_id + "' AND type = 'pull'")

    io.emit(Constants.ACK_SINGLE_PUSH_APP + device_id, {
      status: true,
    })
  }
}

module.exports.ackSinglePullApp = async function (device_id, response) {

  // console.log("SINGLE PULL PUSH");
  let completePushApps = 0
  let queueAppsData = await sql.query("SELECT * from apps_queue_jobs where device_id = '" + device_id + "' AND type = 'push' order by created_at desc limit 1")
  if (queueAppsData.length) {

    completePushApps = queueAppsData[0].complete_apps + 1
    await sql.query("UPDATE apps_queue_jobs set complete_apps = " + completePushApps + " WHERE device_id = '" + device_id + "' AND type = 'pull'")

    io.emit(Constants.ACK_SINGLE_PULL_APP + device_id, {
      status: true
    })
  }
}

module.exports.getPolicy = (device_id, policy) => {
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

module.exports.forceCheckUpdate = async function (device_id) {
  console.log("testing forceupdate", device_id);
  io.emit(Constants.FORCE_UPDATE_CHECK + device_id, {
    device_id: device_id,
    status: true
  });
}