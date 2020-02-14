const { check, query, param, header, body } = require('express-validator');
const { arrayOfObjectWithKeys, isObject, validateSimId, validatePGPEmail, validateChatId } = require('./commonValidators/validation_helpers');
const { DEVICE_ID_PATTERN, USER_ID_PATTERN, DATE_REGEX } = require('../../constants/validation');

exports.devices = [ // nn

];

exports.getDevicesForConnectPage = [ // nn
    //     check('dealer_id')
    //         .exists()
    //         .notEmpty(),

];

exports.getDevicesForReport = [  // nn
    //     check('dealer_id')
    //         .exists()
    //         .notEmpty(),
];

exports.newDevices = [ // nn

];

exports.acceptDevice = [ // put
    // check('user_id')
    //     .exists()
    //     .notEmpty(),

    // check('pay_now')
    //     .exists()
    //     .notEmpty(),

    // check('device_id')
    //     .exists()
    //     .notEmpty(),

    // check('client_id')
    //     .exists()
    //     .notEmpty(),

    // check('model')
    //     .exists()
    //     .notEmpty(),

    // check('dealer_id')
    //     .exists()
    //     .notEmpty(),

    // check('connected_dealer')
    //     .exists()
    //     .notEmpty(),

    // check('usr_acc_id')
    //     .exists()
    //     .notEmpty(),

    // check('usr_device_id')
    //     .exists()
    //     .notEmpty(),

    // check('policy_id')
    //     .exists()
    //     .notEmpty(),

    // check('sim_id')
    //     .exists()
    //     .notEmpty(),

    // check('sim_id')
    //     .exists()
    //     .notEmpty(),

    // check('sim_id2')
    //     .exists()
    //     .notEmpty(),

    // check('sim_id2')
    //     .exists()
    //     .notEmpty(),

    // check('chat_id')
    //     .exists()
    //     .notEmpty(),

    // check('chat_id')
    //     .exists()
    //     .notEmpty(),

    // check('pgp_email')
    //     .exists()
    //     .notEmpty(),

    // check('pgp_email')
    //     .exists()
    //     .notEmpty(),

    // check('term')
    //     .exists()
    //     .notEmpty(),

    // check('products')
    //     .exists()
    //     .notEmpty(),

    // check('packages')
    //     .exists()
    //     .notEmpty(),

    // check('hardwares')
    //     .exists()
    //     .notEmpty(),

    // check('total_price')
    //     .exists()
    //     .notEmpty(),

    // check('hardwarePrice')
    //     .exists()
    //     .notEmpty(),

    // check('data_plans')
    //     .exists()
    //     .notEmpty(),

    // check('paid_by_user')
    //     .exists()
    //     .notEmpty(),

    // check('model')
    //     .exists()
    //     .notEmpty(),

];

exports.createDeviceProfile = [
    // check('client_id')
    //     .exists()
    //     .notEmpty(),

    // check('chat_id')
    //     .exists()
    //     .notEmpty(),

    // check('model')
    //     .exists()
    //     .notEmpty(),

    // check('user_id')
    //     .exists()
    //     .notEmpty(),

    // check('pgp_email')
    //     .exists()
    //     .notEmpty(),

    // check('term')
    //     .exists()
    //     .notEmpty(),

    // check('duplicate')
    //     .exists()
    //     .notEmpty(),

    // check('data_plans')
    //     .exists()
    //     .notEmpty(),

    // check('note')
    //     .exists()
    //     .notEmpty(),

    // check('validity')
    //     .exists()
    //     .notEmpty(),

    // check('sim_id')
    //     .exists()
    //     .notEmpty(),

    // check('sim_id2')
    //     .exists()
    //     .notEmpty(),

    // check('policy_id')
    //     .exists()
    //     .notEmpty(),

    // check('products')
    //     .exists()
    //     .notEmpty(),

    // check('packages')
    //     .exists()
    //     .notEmpty(),

    // check('hardwares')
    //     .exists()
    //     .notEmpty(),

    // check('pay_now')
    //     .exists()
    //     .notEmpty(),

    // check('hardwarePrice')
    //     .exists()
    //     .notEmpty(),

    // check('paid_by_user')
    //     .exists()
    //     .notEmpty(),

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

exports.deleteDevice = [
    // check('device_id')
    //     .exists()
    //     .notEmpty()
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
    check('device_id')
        .exists()
        .notEmpty()
        .isLength({ min: 10, max: 10 })
        // .withMessage('device length incorect')
        .isString()

    // req.params.device_id
];

exports.getServicesHistory = [
    check('usr_acc_id')
        .exists()
        .notEmpty()
    // .withMessage('asdfgh')

    // req.params.usr_acc_id
];

exports.suspendAccountDevices = [
    check('id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.activateDevice = [
    check('id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.wipeDevice = [
    check('id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.connectDevice = [
    check('device_id')
        .exists()
        .notEmpty()
        .isLength({ min: 10, max: 10 })
        // .withMessage('')
        .isString()
];

exports.getDeviceBillingHistory = [
    check('user_acc_id')
        .exists()
        .notEmpty(),

    check('dealer_id')
        .exists()
        .notEmpty()
];

exports.getAppsOfDevice = [
    check('device_id')
        .exists()
        .notEmpty()
];

exports.applySettings = [
    check('device_id')
        .exists()
        .notEmpty()
];

exports.applyPushApps = [
    param('device_id')
        .exists()
        .notEmpty()
        .isAlphanumeric(),

    body('push_apps')
        .custom(value => {
            return arrayOfObjectWithKeys(value, [{
                    index: 'apk_id',
                    type: 'number'
                }, {
                    index: 'apk_name',
                    type: 'string'
                }, {
                    index: 'logo',
                    type: 'string'
                }, {
                    index: 'apk',
                    type: 'string'
                }, {
                    index: 'package_name',
                    type: 'string'
                }, {
                    index: 'version_name',
                    type: 'string'
                }, {
                    index: 'guest',
                    type: 'boolean'
                }, {
                    index: 'encrypted',
                    type: 'boolean'
                }, {
                    index: 'enable',
                    type: 'boolean'
                }, {
                    index: 'deleteable',
                    type: 'boolean'
                }]
            );
        }),

    body('usrAccId')
        .exists()
        .notEmpty()
        .isNumeric()    

];

exports.applyPullApps = [
    param('device_id')
        .exists()
        .notEmpty()
        .isAlphanumeric(),

    body('pull_apps')
        .custom(value => {
            return arrayOfObjectWithKeys(value, [
                {index: 'key', type: 'number'},
                {index: 'app_id', type: 'number'},
                {index: 'package_name', type: 'string'},
                {index: 'label', type: 'string'},
                {index: 'apk_id', type: 'number'},
                {index: 'apk_name', type: 'string'},
                {index: 'version_name', type: 'string'},
                {index: 'apk', type: 'string'},
                {index: 'guest', type: 'boolean'},
                {index: 'encrypted', type: 'boolean'},
                {index: 'enable', type: 'boolean'}
            ]);
        }),
    
    body('usrAccId')
        .exists()
        .notEmpty()
        .isNumeric()
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
    check('device_id')
        .exists()
        .notEmpty()
];

exports.writeIMEI = [
    check('device_id')
        .exists()
        .notEmpty()
];

exports.submitDevicePassword = [
    check('device_id')
        .exists()
        .notEmpty(),

    check('usr_acc_id')
        .exists()
        .notEmpty()
];

exports.getActivities = [
    check('device_id')
        .exists()
        .notEmpty(),
];

exports.getIMEI_History = [
    check('device_id')
        .exists()
        .notEmpty()
];

exports.updateDeviceIDs = [ // nn

];

exports.resetChatPin = [
    check('chat_id')
        .exists()
        .notEmpty(),

    check('pin')
        .exists()
        .notEmpty()
];

exports.changeSchatPinStatus = [
    check('chat_id')
        .exists()
        .notEmpty()
];
