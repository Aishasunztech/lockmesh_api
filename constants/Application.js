module.exports = {

  // Usr_acc Query
  usr_acc_query_text: "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status, usr_acc.transfer_user_status, usr_acc.transfered_from,usr_acc.transfered_to, usr_acc.user_transfered_from, usr_acc.user_transfered_to,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no,usr_acc.type,usr_acc.version , usr_acc.pgp_limit , usr_acc.pgp_remaining_limit , usr_acc.firmware_info , usr_acc.relink_status",


  // DATE TIME CONSTATNS
  TIMESTAMP_FORMAT: "YYYY-MM-DD HH:mm:ss",
  TIMESTAMP_FORMAT_NOT_SEC: "YYYY-MM-DD HH:mm",
  DATE_FORMAT: "YYYY-MM-DD",
  TIME_FORMAT: "HH:mm:ss",
  TIME_FORMAT_HM: "HH:mm",

  // ACL
  ADMIN: "admin",
  DEALER: "dealer",
  SDEALER: "sdealer",
  AUTO_UPDATE_ADMIN: "auto_update_admin",
  SUPER_ADMIN: 'SuperAdmin',
  SUPER_ADMIN_DB: 'super_admin',

  DEVICE: 'device',
  SOCKET: 'socket',
  TOKEN: "token",

  // dealers
  DEALER_ACTIVE: "active",
  DEALER_SUSPENDED: "suspended",
  DEALER_UNLINKED: "unlinked",

  // Bulk Devices
  BULK_PUSHED_APPS: "PUSHED APPS",
  BULK_PULLED_APPS: "PULLED APPS",
  BULK_PUSHED_POLICY: "PUSHED POLICY",
  BULK_SET_PERMISSIONS: "SET PERMISSIONS",
  BULK_ACTIVATED_DEVICES: "ACTIVATED DEVICES",
  BULK_SUSPENDED_DEVICES: "SUSPENDED DEVICES",
  BULK_UNLINKED_DEVICES: "UNLINKED DEVICES",
  BULK_WIPED_DEVICES: "WIPED DEVICES",
  BULK_SEND_MESSAGE: "SEND MESSAGE",


  // devices
  DEVICE_ACTIVATED: "Active",
  DEVICE_TRIAL: "Trial",
  DEVICE_SUSPENDED: "Suspended",
  DEVICE_TRANSFERED: "Transfered",
  DEVICE_EXPIRED: "Expired",
  DEVICE_UNLINKED: "Unlinked",
  DEVICE_PENDING_ACTIVATION: "Pending activation",
  DEVICE_PRE_ACTIVATION: "Pre-activated",
  UNLINK_DEVICE_DELETE: "Delete",
  // DEVICE_TRANSFERED: "Device Transfered",
  USER_TRANSFERED: "User Transfered",
  DEVICE_FLAGGED: "Flagged",
  DEVICE_UNFLAGGED: "Unflagged",
  DEVICE_ACCEPT: "Accept Device",
  NEW_DEVICE: "new device",
  DEVICE_WIPE: "wiped",
  DEVICE_INFO_UPDATED: "device_info_updated_",


  DEVICE_ONLINE: "online",
  DEVICE_OFFLINE: "offline",

  DUPLICATE_MAC: "duplicate_mac",
  DUPLICATE_SERIAL: "duplicate_serial",
  DUPLICATE_MAC_AND_SERIAL: "duplicate_mac_and_serial",
  DEALER_NOT_FOUND: "dealer_not_found",

  PRE_DEFINED_SERIAL_NUMBER: "0123456789ABCDEF",
  PRE_DEFINED_MAC_ADDRESS: "02:00:00:00:00:00",

  // Device History Enumerables
  DEVICE_HISTORY_PUSH_APPS: 'push_apps',
  DEVICE_HISTORY_PULL_APPS: 'pull_apps',
  DEVICE_HISTORY: 'history',
  DEVICE_HISTORY_IMEI: 'imei',
  DEVICE_HISTORY_POLICY: 'policy',
  DEVICE_HISTORY_FORCE_UPDATE: 'force_update',

  // sockets
  SEND_ONLINE_OFFLINE_STATUS: 'send_online_offline_status_',
  GET_SYNC_STATUS: "get_sync_status_",
  SYSTEM_EVENT: "system_event_",
  GET_APPLIED_SETTINGS: "get_applied_settings_",
  SETTING_APPLIED_STATUS: "settings_applied_status_",
  DEVICE_STATUS: 'device_status_',
  WRITE_IMEI: 'write_imei_',
  IMEI_CHANGED: 'imei_changed_',
  IMEI_APPLIED: 'imei_applied_',
  FINISH_IMEI: 'finish_imei',

  // sim
  SEND_SIM: 'reg_sim_',
  ACK_SIM: 'ack_sim_',
  RECV_SIM: 'sendSim_',
  RECV_SIM_DATA: 'receiveSimData_',
  // DD: 'unRegister_sim_',

  HANDLE_SIM_SLOTS: 'handle_sim_slots_',

  // Transfer
  FLAGGED: 'flagged_',

  SEND_APPS: "sendApps_",
  SEND_EXTENSIONS: "sendExtensions_",
  SEND_SETTINGS: "sendSettings_",
  DISCONNECT: "disconnect",
  CONNECT_TIMEOUT: "connect_timeout",
  ERROR: "error",
  CONNECT_ERROR: 'connect_error',
  RECONNECT: "reconnect",
  RECONNECT_ATTEMPT: "reconnect_attempt",
  RECONNECTING: "reconnecting",
  RECONNECT_ERROR: "reconnect_error",
  RECONNECT_FAILED: "reconnect_failed",

  // push apps
  GET_PUSHED_APPS: 'get_pushed_apps_',
  SEND_PUSHED_APPS_STATUS: 'send_pushed_apps_status_',
  FINISHED_PUSH_APPS: 'finished_push_apps_',
  ACK_PUSHED_APPS: 'ack_pushed_apps_',
  ACK_FINISHED_PUSH_APPS: 'ack_finished_push_apps_',
  ACK_SINGLE_PUSH_APP: 'ack_single_push_app_',

  // pull apps
  GET_PULLED_APPS: 'get_pulled_apps_',
  SEND_PULLED_APPS_STATUS: 'send_pulled_apps_status_',
  FINISHED_PULL_APPS: 'finished_pulled_apps_',
  ACK_pull_APPS: 'ack_pull_apps_',
  ACK_FINISHED_PULL_APPS: 'ack_finished_pull_apps_',
  ACK_SINGLE_PULL_APP: 'ack_single_pull_app_',
  ACK_SETTING_APPLIED: 'ack_setting_applied_',
  ACTION_IN_PROCESS: 'action_in_process',

  // Policy
  LOAD_POLICY: 'load_policy_',
  GET_POLICY: 'get_policy_',
  FINISH_POLICY_PUSH_APPS: "finish_policy_push_apps_",
  FINISH_POLICY_APPS: "finish_policy_apps_",
  FINISH_POLICY_SETTINGS: "finish_policy_settings_",
  FINISH_POLICY_EXTENSIONS: "finish_policy_extensions_",
  FINISH_POLICY: 'finish_policy_',
  FINISH_WIPE: 'finish_wipe_',
  FINISH_POLICY_STEP: 'finish_policy_step_',

  SEND_MSG_TO_DEVICE: 'send_device_msg_',
  ACK_MSG_TO_DEVICE: 'ack_msg_to_device_',
  // INSTALL OR UNINSTALL APPS
  GET_INSTALLED_APPS: 'send_installed_apps_',
  ACK_INSTALLED_APPS: 'ack_installed_apps_',

  GET_UNINSTALLED_APPS: 'send_uninstalled_apps_',
  ACK_UNINSTALLED_APPS: 'ack_uninstalled_apps_',

  SEND_JOB_TO_PANEL: 'SEND_JOB_TO_PANEL',

  // force update
  FORCE_UPDATE_CHECK: 'force_update_check_',

  PING: "ping",
  PONG: "pong",

  // apk
  APK: "apk",
  LOGO: "logo",

  APK_ON: 'On',
  APK_OFF: 'Off',
  FEATURED_APK_PACKAGES: ['com.secure.d2d', 'com.schat.android', 'com.secure.vpn', 'com.secure.svault', 'com.android.smail'],

  // Default Columns
  // deviceColumns : ["DEVICE ID", "USER ID", "REMAINING DAYS", "FLAGGED", "STATUS", "MODE", "DEVICE NAME", "ACTIVATION CODE", "ACCOUNT EMAIL", "PGP EMAIL", "CHAT ID", "CLIENT ID", "DEALER ID", "DEALER PIN", "MAC ADDRESS", "SIM ID", "IMEI 1", "SIM 1", "IMEI 2", "SIM 2", "SERIAL NUMBER", "MODEL", "START DATE", "EXPIRY DATE", "DEALER NAME", "S-DEALER", "S-DEALER NAME"],
  // dealerColumns : ["DEALER ID", "DEALER NAME", "DEALER EMAIL", "DEALER PIN", "DEVICES", "TOKENS"],
  // apkColumns : ["SHOW ON DEVICE", "APK", "APP NAME", "APP LOGO"],
  // sdealerColumns : ["DEALER ID", "DEALER NAME", "DEALER EMAIL", "DEALER PIN", "DEVICES", "TOKENS", "PARENT DEALER", "PARENT DEALER ID"],

  deviceColumns: [
    { "key": "device_id", "value": "tableHeadings.DEVICEID" },
    { "key": "user_id", "value": "tableHeadings.USERID" },
    { "key": "validity", "value": "tableHeadings.REMAININGDAYS" },
    { "key": "status", "value": "tableHeadings.STATUS" },
    { "key": "lastOnline", "value": "tableHeadings.lastOnline" },
    { "key": "online", "value": "tableHeadings.MODE" },
    { "key": "type", "value": "tableHeadings.TYPE" },
    { "key": "version", "value": "tableHeadings.VERSION" },
    { "key": "firmware_info", "value": "FIRMWARE INFO" },
    { "key": "flagged", "value": "tableHeadings.FLAGGED" },
    { "key": "transfered_to", "value": "tableHeadings.TRANSFERED" },
    { "key": "name", "value": "tableHeadings.DEVICENAME" },
    { "key": "account_email", "value": "tableHeadings.ACCOUNTEMAIL" },
    // { "key": "client_id", "value": "tableHeadings.CLIENTID" },
    { "key": "activation_code", "value": "tableHeadings.ACTIVATIONCODE" },
    { "key": "pgp_email", "value": "tableHeadings.PGPEMAIL" },
    { "key": "sim_id", "value": "tableHeadings.SIMID" },
    { "key": "sim_id2", "value": "SIM ID 2" },
    { "key": "chat_id", "value": "tableHeadings.CHATID" },
    { "key": "dealer_id", "value": "tableHeadings.DEALERID" },
    { "key": "dealer_name", "value": "tableHeadings.DEALERNAME" },
    { "key": "dealer_pin", "value": "tableHeadings.DEALERPIN" },
    { "key": "s_dealer", "value": "tableHeadings.device-parent-id" }, // PARENT DEALER ID
    { "key": "s_dealer_name", "value": "tableHeadings.device-parent-name" }, // PARENT DEALER NAME
    { "key": "mac_address", "value": "tableHeadings.MACADDRESS" },
    { "key": "imei_1", "value": "tableHeadings.IMEI1" },
    { "key": "sim_1", "value": "tableHeadings.SIM1" },
    { "key": "imei_2", "value": "tableHeadings.IMEI2" },
    { "key": "sim_2", "value": "tableHeadings.SIM2" },
    { "key": "serial_number", "value": "tableHeadings.SERIALNUMBER" },
    { "key": "model", "value": "tableHeadings.MODEL" },
    // { "key": "s_dealer", "value": "tableHeadings.S-DEALER" },
    // { "key": "s_dealer_name", "value": "tableHeadings.S-DEALERNAME" },
    { "key": "remainTermDays", "value": "REMAINING TERM DAYS" },
    { "key": "start_date", "value": "tableHeadings.STARTDATE" },
    { "key": "expiry_date", "value": "tableHeadings.EXPIRYDATE" },
  ],
  dealerColumns: [
    { "key": "dealer_id", "value": "dealer.id" },
    { "key": "dealer_name", "value": "dealer.name.id" },
    { "key": "dealer_email", "value": "dealer.email.id" },
    { "key": "link_code", "value": "dealer.pin.id" },
    { "key": "connected_devices", "value": "devices" },
    { "key": "dealer_credits", "value": "credits.id" },
    { "key": "last_login", "value": "LAST LOGIN" },
  ],
  sdealerColumns: [
    { "key": "dealer_id", "value": "dealer.id" },
    { "key": "dealer_name", "value": "dealer.name.id" },
    { "key": "dealer_email", "value": "dealer.email.id" },
    { "key": "link_code", "value": "dealer.pin.id" },
    { "key": "connected_devices", "value": "devices" },
    { "key": "dealer_credits", "value": "credits.id" },
    { "key": "parent_dealer", "value": "parent.dealer.id" },
    { "key": "parent_dealer_id", "value": "parent.dealer.id.id" },
    { "key": "last_login", "value": "LAST LOGIN" },

  ],
  apkColumns: [
    { "key": "permission", "value": 'permission.id' },
    { "key": "apk_status", "value": 'show.on.device.id' },
    { "key": "apk", "value": "apk.id" },
    { "key": "apk_name", "value": "app.name.id" },
    { "key": "apk_logo", "value": "app.logo.id" },
    { "key": "apk_size", "value": "SIZE" },
    { "key": "label", "value": "LABEL" },
    { "key": "package_name", "value": "PACKAGE NAME" },
    { "key": "version", "value": "VERSION" },
    { "key": "created_at", "value": "UPLOAD DATE" },
    { "key": "updated_at", "value": "EDIT DATE" },
  ]
}