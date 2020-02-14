const { check, query, param, header, body } = require('express-validator');
const { arrayOfObjectWithKeys, isObject, validateSimId, validatePGPEmail, validateChatId } = require('./commonValidators/validation_helpers');
const { DEVICE_ID_PATTERN, USER_ID_PATTERN, DATE_REGEX, IMEI_REGEX, CHAT_ID } = require('../../constants/validation');

//************************* Define Device Schemas ****************/ 
const applyPushAppsSchema = [
    {
        index: 'apk_id',
        type: 'number'
    },
    {
        index: 'apk_name',
        type: 'string'
    },
    {
        index: 'logo',
        type: 'string'
    },
    {
        index: 'apk',
        type: 'string'
    },
    {
        index: 'package_name',
        type: 'string'
    },
    {
        index: 'version_name',
        type: 'string'
    },
    {
        index: 'guest',
        type: 'boolean'
    },
    {
        index: 'encrypted',
        type: 'boolean'
    },
    {
        index: 'enable',
        type: 'boolean'
    },
    {
        index: 'deleteable',
        type: 'boolean'
    }
];

const applyPullAppsSchema = [
    { index: 'key', type: 'number' },
    { index: 'app_id', type: 'number' },
    { index: 'package_name', type: 'string' },
    { index: 'label', type: 'string' },
    { index: 'apk_id', type: 'number' },
    { index: 'apk_name', type: 'string' },
    { index: 'version_name', type: 'string' },
    { index: 'apk', type: 'string' },
    { index: 'guest', type: 'boolean' },
    { index: 'encrypted', type: 'boolean' },
    { index: 'enable', type: 'boolean' }
];




//************** Device API validation rules ****************/
exports.devices = [ // nn

];

exports.getDevicesForConnectPage = [ // nn
];

exports.getDevicesForReport = [  // nn
];

exports.newDevices = [ // nn

];

exports.acceptDevice = [ // put
    body('user_id')
        .notEmpty()
        .matches(USER_ID_PATTERN),

    body('pay_now')
        .isBoolean(),

    body('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN),

    body('model')
        .isString(),

    body('dealer_id')
        .notEmpty()
        .isInt(),

    body('connected_dealer')
        .optional({checkFalsy: true})
        .isInt(),

    body('usr_acc_id')
        .notEmpty()
        .isInt(),

    body('usr_device_id')
        .notEmpty()
        .isInt(),

    body('policy_id')
        .optional({ checkFalsy: true })
        .isInt(),

    
    check('sim_id')
        .optional({checkFalsy:true})
        .isInt(),

    body('sim_id2')
        .optional({checkFalsy:true})
        .isInt(),

    body('chat_id')
        .optional({checkFalsy: true})
        .matches(CHAT_ID),

    body('pgp_email')
        .optional({checkFalsy: true})
        .isEmail(),

    body('term')
        .optional({checkFalsy: true})
        .not().isIn([false])
        .isInt({min: 0, max: 12}),

    body('products')
        .optional()
        .isArray(),

    body('packages')
        .optional()
        .isArray(),

    body('hardwares')
        .optional({checkFalsy: true})
        .isArray(),

    body('total_price')
        .isNumeric(),

    body('hardwarePrice')
        .optional({checkFalsy: true})
        .isNumeric(),

    body('data_plans')
        .optional({checkFalsy: true})
        .custom(v => isObject(v)),

    body('paid_by_user')
        .isIn(["PAID", "UNPAID"]),

];

exports.createDeviceProfile = [
    body('client_id')
        .optional({checkFalsy: true})
        .isString(),

    body('chat_id')
        .optional({checkFalsy: true})
        .matches(CHAT_ID),

    body('model')
        .isString(),

    body('user_id')
        .notEmpty()
        .matches(USER_ID_PATTERN),

    body('pgp_email')
        .optional({checkFalsy: true})
        .isEmail(),

    body('term')
        .optional({checkFalsy: true})
        .not().isIn([false])
        .isInt({min: 0, max: 12}),

    body('duplicate')
        .optional({checkFalsy: true})
        .isInt(),

    body('data_plans')
        .optional({checkFalsy: true})
        .custom(v => isObject(v)),

    body('note')
        .optional({checkFalsy: true})
        .isString(),

    body('validity')
        .optional({nullable: true})
        .isInt(),

    body('sim_id')
        .optional()
        .isInt(),

    body('sim_id2')
        .optional()
        .isInt(),

    body('policy_id')
        .optional({checkFalsy:true})
        .isInt(),

    body('products')
        .optional({checkFalsy: true})
        .isArray(),

    body('packages')
        .optional({checkFalsy: true})
        .isArray(),

    body('hardwares')
        .optional()
        .isArray(),

    body('pay_now')
        .isBoolean(),

    body('hardwarePrice')
        .optional({checkFalsy: true})
        .isNumeric(),

    body('paid_by_user')
        .isIn(['PAID', 'UNPAID']),

    body('total_price')
        .isNumeric()

];

exports.editDevices = [
    // check('usr_device_id')
    //     .exists()
    //     .notEmpty(),

    // check('device_id')
    //     .exists()
    //     .notEmpty(),

    // check('dealer_id')
    //     .exists()
    //     .notEmpty(),

    // check('client_id')
    //     .exists()
    //     .notEmpty(),

    // check('model')
    //     .exists()
    //     .notEmpty(),

    // check('user_id')
    //     .exists()
    //     .notEmpty(),

    // check('usr_acc_id')
    //     .exists()
    //     .notEmpty(),

    // check('usr_device_id')
    //     .exists()
    //     .notEmpty(),

    // check('prevPGP')
    //     .exists()
    //     .notEmpty(),

    // check('prevChatID')
    //     .exists()
    //     .notEmpty(),

    // check('prevSimId')
    //     .exists()
    //     .notEmpty(),

    // check('prevSimId2')
    //     .exists()
    //     .notEmpty(),

    // check('finalStatus')
    //     .exists()
    //     .notEmpty(),

    // check('note')
    //     .exists()
    //     .notEmpty(),

    // check('validity')
    //     .exists()
    //     .notEmpty(),

    // check('start_date')
    //     .exists()
    //     .notEmpty(),

    // check('sim_id')
    //     .exists()
    //     .notEmpty(),

    // check('sim_id2')
    //     .exists()
    //     .notEmpty(),

    // check('chat_id')
    //     .exists()
    //     .notEmpty(),

    // check('pgp_email')
    //     .exists()
    //     .notEmpty(),

    // check('service')
    //     .exists()
    //     .notEmpty(),

    // check('prevService')
    //     .exists()
    //     .notEmpty(),

    // check('paid_by_user')
    //     .exists()
    //     .notEmpty(),

    // check('products')
    //     .exists()
    //     .notEmpty(),

    // check('packages')
    //     .exists()
    //     .notEmpty(),

    // check('total_price')
    //     .exists()
    //     .notEmpty(),

    // check('expiry_date')
    //     .exists()
    //     .notEmpty(),

    // check('pay_now')
    //     .exists()
    //     .notEmpty(),

    // check('cancelService')
    //     .exists()
    //     .notEmpty(),

    // check('data_plans')
    //     .exists()
    //     .notEmpty(),

];

exports.extendServices = [
    body('usr_device_id')
        .notEmpty()
        .isInt(),

    body('dealer_id')
        .notEmpty()
        .isInt(),

    body('usr_acc_id')
        .notEmpty()
        .isInt(),

    body('model')
        .optional({nullable: true})
        .isString(),

    body('usr_device_id')
        .notEmpty()
        .isInt(),

    body('prevChatID')
        .optional()
        .custom(value => validateChatId(value)),

    body('prevSimId')
        .optional()
        .isInt(),

    body('prevSimId2')
        .optional()
        .isInt(),

    body('finalStatus')
        .optional()
        .isString(),

    body('sim_id')
        .optional()
        .isInt(),

    body('sim_id2')
        .optional()
        .isInt(),

    body('chat_id')
        .optional()
        .custom(value => validateChatId(value)),

    body('pgp_email')
        .optional()
        .custom(value => validatePGPEmail(value, 'pgp_email')),
    
    body('prevPGP')
        .optional()
        .custom(value=> validatePGPEmail(value, 'prevPGP')),

    body('service')
        .optional()
        .isBoolean(),

    body('prevService')
        .notEmpty()
        .custom(value => isObject(value)),

    body('paid_by_user')
        .optional()
        .isIn(['PAID', 'UNPAID']),

    body('products')
        .optional()
        .isArray(),

    body('packages')
        .optional()
        .isArray(),

    body('total_price')
        .notEmpty()
        .isInt(),

    body('expiry_date')
        .optional()
        .matches(DATE_REGEX),

    body('pay_now')
        .optional()
        .isBoolean(),

    check('renewService')
        .optional()
        .isBoolean(),

    body('user_id')
        .notEmpty()
        .matches(USER_ID_PATTERN),

];

exports.cancelExtendedServices = [
    body('service_id')
        .exists()
        .notEmpty()
        .isInt(),

    body('user_acc_id')
        .exists()
        .notEmpty()
        .isInt()
];

exports.getServiceRefund = [
    check('service_id')
        .exists()
        .notEmpty()
        .isInt(),

    body('user_acc_id')
        .exists()
        .notEmpty()
        .isInt()
];

exports.deleteDevice = [ // nn
];

exports.unlinkDevice = [
    param('id')
        .exists()
        .notEmpty()
        .isNumeric(),

    body('device')
        .custom(value => isObject(value))
];

exports.relinkDevice = [
    param('id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.unflagDevice = [
    param('id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.flagDevice = [
    param('id')
        .exists()
        .notEmpty()
        .isNumeric(),

    body('data')
        .exists()
        .notEmpty()
        .isAlpha()
];

exports.transferUser = [
    body('NewUser')
        .exists()
        .notEmpty()
        .matches(USER_ID_PATTERN),

    body('OldUser')
        .exists()
        .notEmpty()
        .matches(USER_ID_PATTERN),

    body('OldUsr_device_id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.transferDeviceProfile = [
    check('flagged_device')
        .exists()
        .notEmpty()
        .custom(value => isObject(value)),

    check('reqDevice')
        .exists()
        .notEmpty()
        .custom(value => isObject(value))
];

exports.transferHistory = [
    param('device_id')
        .isLength({ min: 10, max: 10 })
        .isString(),

    // req.params.device_id
];

exports.getServicesHistory = [
    param('usr_acc_id')
        .notEmpty()
        .isInt()
];

exports.suspendAccountDevices = [
    param('id')
        .notEmpty()
        .isInt()
];

exports.activateDevice = [
    param('id')
        .notEmpty()
        .isInt()
];

exports.wipeDevice = [
    param('id')
        .notEmpty()
        .isInt()
];

exports.connectDevice = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN)
];

exports.getDeviceBillingHistory = [
    param('user_acc_id')
        .notEmpty()
        .isInt(),

    check('dealer_id')
        .notEmpty()
        .isInt()
];

exports.getAppsOfDevice = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN)
];

exports.applySettings = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN),

    param('usr_acc_id')
        .notEmpty()
        .isInt(),
    
    body('device_setting')
        .notEmpty()
        .custom(value=>isObject(value))
];

exports.applyPushApps = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN),

    body('push_apps')
        .custom(value => arrayOfObjectWithKeys(value, applyPushAppsSchema)),

    body('usrAccId')
        .notEmpty()
        .isInt()

];

exports.applyPullApps = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN),

    body('pull_apps')
        .custom(value => arrayOfObjectWithKeys(value, applyPullAppsSchema)),

    body('usrAccId')
        .notEmpty()
        .isInt()
];

exports.getAppJobQueueOfDevice = [
    param('device_id')
        .exists()
        .notEmpty()
        .isAlphanumeric()
];

exports.resyncDevice = [
    body('device_id')
        .exists()
        .notEmpty()
        .matches(DEVICE_ID_PATTERN)
];

exports.deleteUnlinkDevice = [
    check('action')
        .exists()
        .notEmpty()
        .isString(),

    check('devices')
        .exists()
        .notEmpty()
        .isArray()

];

exports.getDeviceHistory = [
    body('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN)
];

exports.writeIMEI = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN),

    body('usrAccId')
        .isEmpty()
        .isInt(),

    body('type')
        .isEmpty()
        .isIn(['IMEI1', 'IMEI2']),

    body('imeiNo')
        .notEmpty()
        .matches(IMEI_REGEX),
];

exports.submitDevicePassword = [
    check('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN),

    body('usr_acc_id')
        .notEmpty()
        .isInt(),

    body()
        .notEmpty()
        .isIn(["admin_password","guest_password","encrypted_password","duress_password"]),

    body('passwords.pwd')
        .isString()
        .notEmpty()
];

exports.getActivities = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN),
];

exports.getIMEI_History = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN)
];

exports.updateDeviceIDs = [ // nn

];

exports.resetChatPin = [
    body('chat_id')
        .notEmpty()
        .matches(CHAT_ID),

    body('pin')
        .notEmpty()
        .isInt()
];

exports.changeSchatPinStatus = [
    body('chat_id')
        .notEmpty()
        .matches(CHAT_ID),

    body('type')
        .isString()
];
