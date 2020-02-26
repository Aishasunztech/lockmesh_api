const { check, body, param } = require('express-validator');
const { IMEI_REGEX, LINK_CODE_REGEX, SIM_NO_REGEX, DEVICE_ID_PATTERN } = require('../../constants/validation');

// 0 => imei1, imei2,
// 1 =>  simNo1, simNo2,
// 2 => serial_number,
// 3 => ip, 
// 4 => mac_address, 
// 5 => type, 
// 6 => version

// let imei = 'imei'
// let simNo = 'simNo';
// let serialNo = 'serialNo';
// let ip = 'ip';
// let macAddr = 'macAddr';
// let type = 'type';
// let version = 'version';

const deviceInfoValidations = [
    // 0 index
    body('imei')
        .optional({ checkFalsy: true, nullable: true })
        .custom(value => {
            console.log('check imei array', value);
            if (value && Array.isArray(value)) {
                if (!value[0] || !IMEI_REGEX.test(value[0])) return false;
                if (!value[1] || !IMEI_REGEX.test(value[1])) return false;
                return true;
            }
            return false;
        })
        .withMessage('Invalid IMEI numbers'),

    // 1 index
    body('simNo')
        .optional({ checkFalsy: true, nullable: true })
        .custom(value => {
            if (value && Array.isArray(value)) {
                if (!value[0] || !SIM_NO_REGEX.test(value[0])) return false;
                if (!value[1] || !SIM_NO_REGEX.test(value[1])) return false;
                return true;
            }
            return false;
        })
        .withMessage('Invalid SIM numbers'),

    // 2 index
    body('serialNo')
        .optional({ checkFalsy: true, nullable: true })
        .isAlphanumeric()
        .withMessage('Incorrect serial No')
        .isLength({ min: 18, max: 21 })
        .withMessage('Incorrect length of serial No'),

    // 3 index
    body('macAddr')
        .optional({ checkFalsy: true, nullable: true })
        .isMACAddress()
        .withMessage('Incorrect MAC Address'),

    // 4 index
    body('ip')
        .optional({ checkFalsy: true, nullable: true })
        .isIP()
        .withMessage('Incorrect IP Address'),

    // 5 index
    body('type')
        .optional({ checkFalsy: true, nullable: true })
        .isAlpha()
        .withMessage('Incorrect version value, Only allow alphabet'),

    // 6 index
    body('version')
        .optional({ checkFalsy: true, nullable: true })
        .isFloat()
        .withMessage('Incorrect version value, Only allow float numbers'),
]



exports.login = [
    body('link_code')
        .matches(LINK_CODE_REGEX)
        .withMessage('Link code should be 6 digits long'),

    ...deviceInfoValidations
];

exports.systemLogin = [

    deviceInfoValidations[2], // serial number
    deviceInfoValidations[3], // mac address
    deviceInfoValidations[4], // ip address

];

exports.linkDevice = [
    body('dId')
        .notEmpty()
        .isInt({ min: 1 }),

    body('connected_dealer')
        .optional({ checkFalsy: true, nullable: true })
        .isInt({ min: 0 }),

    ...deviceInfoValidations
];

exports.getStatus = [
    body('serial_number')
        .optional({ checkFalsy: true, nullable: true })
        .isAlphanumeric()
        .withMessage('Incorrect serial No')
        .isLength({ min: 18, max: 21 })
        .withMessage('Incorrect length of serial No'),

    body('mac')
        .optional({ checkFalsy: true, nullable: true })
        .isMACAddress()
        .withMessage('Incorrect MAC Address'),

];

exports.deviceStatus = [
    body('serial_no')
        .optional({ checkFalsy: true, nullable: true })
        .isAlphanumeric()
        .withMessage('Incorrect serial No')
        .isLength({ min: 18, max: 21 })
        .withMessage('Incorrect length of serial No'),

    body('mac_address')
        .optional({ checkFalsy: true, nullable: true })
        .isMACAddress()
        .withMessage('Incorrect MAC Address'),
];

exports.stopLinking = [
    param('serialNo')
        .optional({ checkFalsy: true, nullable: true })
        .isAlphanumeric()
        .withMessage('Incorrect serial No')
        .isLength({ min: 18, max: 21 })
        .withMessage('Incorrect length of serial No'),

    param('macAddr')
        .optional({ checkFalsy: true, nullable: true })
        .isMACAddress()
        .withMessage('Incorrect MAC Address'),
];

exports.installAppList = [ // nn

];

exports.checkForUpdate = [ // nn
    // param('version')
    //     .optional({ checkFalsy: true, nullable: true })
    //     .isFloat()
    //     .withMessage('Incorrect version value, Only allow float numbers'),

    //     param('packageName')
    //     ,

    //     param('label')
];

exports.getUpdate = [ // nn

];

exports.IMEIChanged = [
    body('device_id')
        .matches(DEVICE_ID_PATTERN),

    body('imei')
        .optional({ checkFalsy: true, nullable: true })
        .custom(value => {
            console.log('check imei array', value);
            if (value && Array.isArray(value)) {
                if (!value[0] || !IMEI_REGEX.test(value[0])) return false;
                if (!value[1] || !IMEI_REGEX.test(value[1])) return false;
                return true;
            }
            return false;
        })
        .withMessage('Invalid IMEI numbers'),

    body('serial')
        .optional({ checkFalsy: true, nullable: true })
        .isAlphanumeric()
        .withMessage('Incorrect serial No')
        .isLength({ min: 18, max: 21 })
        .withMessage('Incorrect length of serial No'),

    body('mac')
        .optional({ checkFalsy: true, nullable: true })
        .isMACAddress()
        .withMessage('Incorrect MAC Address'),
];

exports.adminSMAppList = [ // nn

];

exports.SMAppList = [
    param('link_code')
        .matches(LINK_CODE_REGEX)
        .withMessage('Link code should be 6 digits long'),
];

exports.adminSMAppList_V2 = [
    param('spaceType')
        .isIn(['guest', 'encrypted'])

];

exports.SMAppList_V2 = [
    param('spaceType')
        .isIn(['guest', 'encrypted']),

    param('linkCode')
        .matches(LINK_CODE_REGEX)
        .withMessage('Link code should be 6 digits long'),
];

exports.SMAppListV3 = [
    body('spaceType')
        .isIn(['guest', 'encrypted']),

    body('linkCode')
        .matches(LINK_CODE_REGEX)
        .withMessage('Link code should be 6 digits long'),
];
