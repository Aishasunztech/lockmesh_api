module.exports = {

    // ACL
    ADMIN: "admin",
    DEALER: "dealer",
    SDEALER: "sdealer",
    DEVICE: 'device',
    SOCKET: 'socket',
    TOKEN: "token",

    // dealers
    DEALER_ACTIVE: "active",
    DEALER_SUSPENDED: "suspended",
    DEALER_UNLINKED: "unlinked",

    // devices
    DEVICE_ACTIVATED: "Active",
    DEVICE_TRIAL: "Trial",
    DEVICE_SUSPENDED: "Suspended",
    DEVICE_EXPIRED: "Expired",
    DEVICE_UNLINKED: "Unlinked",
    DEVICE_PENDING_ACTIVATION: "Pending activation",
    DEVICE_PRE_ACTIVATION: "Pre-activated",
    UNLINK_DEVICE_DELETE: "Delete",
    DEVICE_FLAGGED: "Flagged",
    DEVICE_UNFLAGGED: "Unflagged",
    DEVICE_ACCEPT: "Accept Device",
    NEW_DEVICE: "new device",

    DEVICE_ONLINE: "On",
    DEVICE_OFFLINE: "off",

    // sockets
    GET_SYNC_STATUS: "get_sync_status_",
    GET_APPLIED_SETTINGS: "get_applied_settings_",
    SETTING_APPLIED_STATUS: "settings_applied_status_",
    DEVICE_STATUS:'device_status_',
    WRITE_IMEI:'write_imei_',
    IMEI_CHANGED:'imei_changed_',
    IMEI_APPLIED:'imei_applied_',


    SEND_APPS: "sendApps_",
    SEND_EXTENSIONS: "sendExtensions_",
    SEND_SETTINGS: "sendSettings_",
    DISCONNECT: "disconnect",
    CONNECT_TIMEOUT: "connect_timeout",
    ERROR: "error",
    CONNECT_ERROR:'connect_error',
    RECONNECT: "reconnect",
    RECONNECT_ATTEMPT: "reconnect_attempt",
    RECONNECTING: "reconnecting",
    RECONNECT_ERROR: "reconnect_error",
    RECONNECT_FAILED: "reconnect_failed",
    
    // push apps
    GET_PUSHED_APPS:'get_pushed_apps_',
    SEND_PUSHED_APPS_STATUS:'send_pushed_apps_status_',
    FINISHED_PUSH_APPS: 'finished_push_apps_',
    ACK_PUSHED_APPS: 'ack_pushed_apps_',
    ACK_FINISHED_PUSH_APPS: 'ack_finished_push_apps_',

    // pull apps
    GET_PULLED_APPS:'get_pulled_apps_',
    SEND_PULLED_APPS_STATUS:'send_pulled_apps_status_',
    FINISHED_pull_APPS: 'finished_pull_apps_',
    ACK_pull_APPS: 'ack_pull_apps_',
    ACK_FINISHED_PULL_APPS: 'ack_finished_push_apps_',


    PING: "ping",
    PONG: "pong",

    // apk
    APK: "apk",
    LOGO: "logo",

    APK_ON:'On',
    APK_OFF:'Off'
}