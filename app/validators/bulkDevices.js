const { check, body, param } = require('express-validator');
const {
    bulk_action_list
} = require('./commonValidators/constants');

const { isValidTimeZone, arrayOfObjectWithKeys, validArrayWithValues, validateJSONObject } = require('./commonValidators/validation_helpers')
const { DATE_REGEX, HOURS_MINUTES, DATE_TIME_REGEX, USER_ID_PATTERN, DEVICE_ID_PATTERN } = require('../../constants/validation');

const filteredBulkDevicesDealersSchema = [{
    index: 'key',
    type: 'pk'
}];
const filteredBulkDevicesUsersSchema = [{
    index: 'key',
    type: 'regex',
    pattern: USER_ID_PATTERN
}];
const applyBulkPushAppsAppsSchema = [
    { index: 'key', type: 'pk'},
    { index: 'apk_id', type: 'pk'}, 
    'package_name',
    'version_name',
    'apk',
    'apk_name',
    { index: 'guest', type: 'boolean' },
    { index: 'encrypted', type: 'boolean' },
    { index: 'enable', type: 'boolean' }
];

const applyBulkPullAppsAppsSchema = [
    { index: 'key', type: 'pk'},
    { index: 'app_id', type: 'pk'},
    'package_name',
    'label',
    { index: 'apk_id', type: 'pk'}, 
    'apk_name',
    'version_name',
    'apk',
    { index: 'guest', type: 'boolean' },
    { index: 'encrypted', type: 'boolean' },
    { index: 'enable', type: 'boolean' }
];

const BulkDeviceIdsSchema = [
    { index: 'device_id', type: 'regex', pattern: DEVICE_ID_PATTERN},
    { index: 'usrAccId', type: 'pk'},
    { index: 'usr_device_id', type: 'pk'}
];

const unlinkSelectedDevicesSchema = [
    { index: 'device_id', type: 'regex', pattern: DEVICE_ID_PATTERN },
    { index: 'usr_device_id', type: 'pk'}
];

exports.bulkDevicesHistory = [ // nn

];

exports.getFilteredBulkDevices = [
    body('dealers')
        .custom(v => arrayOfObjectWithKeys(v, filteredBulkDevicesDealersSchema, true)),

    body('users')
        .custom(v => arrayOfObjectWithKeys(v, filteredBulkDevicesUsersSchema, true)),
];

exports.suspendBulkAccountDevices = [
    body('device_ids')
        .custom((v) => validArrayWithValues(v, 'pk')),

    body('dealer_ids')
        .custom(v => validArrayWithValues(v, 'pk', null, true)),

    body('user_ids')
        .custom((v, { req }) => {
            let empty = false;
            try {
                validArrayWithValues(req.body.dealer_ids, 'pk');
                empty = true;
            } catch (err){
                empty = false;
            }
            return validArrayWithValues(v, 'regex', USER_ID_PATTERN, empty);
        })

    // body('apps')
    //     .isArray(),

    // body('policy')
    //     .notEmpty()
    //     .isArray()
];

exports.activateBulkDevices = [
    body('device_ids')
        .custom((v) => validArrayWithValues(v, 'pk')),

    body('dealer_ids')
        .custom(v => validArrayWithValues(v, 'pk', null, true)),

    body('user_ids')
        .custom((v, { req }) => {
            let empty = false;
            try {
                validArrayWithValues(req.body.dealer_ids, 'pk');
                empty = true;
            } catch (err){
                empty = false;
            }
            return validArrayWithValues(v, 'regex', USER_ID_PATTERN, empty);
        })
];

exports.getUsersOfDealers = [

];
exports.applyBulkPushApps = [
    body('selectedDevices')
        .custom((v) => arrayOfObjectWithKeys(v, BulkDeviceIdsSchema)),

    body('dealer_ids')
        .custom(v => validArrayWithValues(v, 'pk', null, true)),

    body('user_ids')
        .custom((v, { req }) => {
            let empty = false;
            try {
                validArrayWithValues(req.body.dealer_ids, 'pk');
                empty = true;
            } catch (err){
                empty = false;
            }
            return validArrayWithValues(v, 'regex', USER_ID_PATTERN, empty);
        }),

    body('apps')
        .custom(v => arrayOfObjectWithKeys(v, applyBulkPushAppsAppsSchema))
];

exports.applyBulkPullApps = [
    body('selectedDevices')
        .custom((v) => arrayOfObjectWithKeys(v, BulkDeviceIdsSchema)),

    body('dealer_ids')
        .custom(v => validArrayWithValues(v, 'pk', null, true)),

    body('user_ids')
        .custom((v, { req }) => {
            let empty = false;
            try {
                validArrayWithValues(req.body.dealer_ids, 'pk');
                empty = true;
            } catch (err){
                empty = false;
            }
            return validArrayWithValues(v, 'regex', USER_ID_PATTERN, empty);
        }),

    body('apps')
        .custom(v => arrayOfObjectWithKeys(v, applyBulkPullAppsAppsSchema))
];

exports.unlinkBulkDevices = [
    body('selectedDevices')
        .custom(v => validateJSONObject(v, arrayOfObjectWithKeys, unlinkSelectedDevicesSchema)),

    body('dealer_ids')
        .custom(v => validArrayWithValues(v, 'pk', null, true)),

    body('user_ids')
        .custom((v, { req }) => {
            let empty = false;
            try {
                validArrayWithValues(req.body.dealer_ids, 'pk');
                empty = true;
            } catch (err){
                empty = false;
            }
            return validArrayWithValues(v, 'regex', USER_ID_PATTERN, empty);
        }),
];

exports.wipeBulkDevices = [
    body('selectedDevices')
        .custom(v => validArrayWithValues(v, 'pk')),

    body('dealer_ids')
        .custom(v => validArrayWithValues(v, 'pk', null, true)),

    body('user_ids')
        .custom((v, { req }) => {
            let empty = false;
            try {
                validArrayWithValues(req.body.dealer_ids, 'pk');
                empty = true;
            } catch (err){
                empty = false;
            }
            return validArrayWithValues(v, 'regex', USER_ID_PATTERN, empty);
        }),
    
    body('wipePassword')
        .notEmpty()
        .isString()
];

exports.applyBulkPolicy = [
    body('selectedDevices')
        .custom((v) => arrayOfObjectWithKeys(v, BulkDeviceIdsSchema)),

    body('dealer_ids')
        .custom(v => validArrayWithValues(v, 'pk', null, true)),

    body('user_ids')
        .custom((v, { req }) => {
            let empty = false;
            try {
                validArrayWithValues(req.body.dealer_ids, 'pk');
                empty = true;
            } catch (err){
                empty = false;
            }
            return validArrayWithValues(v, 'regex', USER_ID_PATTERN, empty);
        }),

    body('policyId')
        .isInt({min: 1})
];

exports.sendBulkMsg = [
    body('timezone')
        .optional({checkFalsy: true})
        .custom(v => isValidTimeZone(v, true)),

    body('data.devices')
        .custom(v => arrayOfObjectWithKeys(v, BulkDeviceIdsSchema)),
    
    body('data.dealer_ids')
        .custom(v => validArrayWithValues(v, 'pk', null, true)),

    body('data.user_ids')
        .custom((v, { req }) => {
            let empty = false;
            try {
                validArrayWithValues(req.body.data.dealer_ids, 'pk');
                empty = true;
            } catch (err){
                empty = false;
            }
            return validArrayWithValues(v, 'regex', USER_ID_PATTERN, empty);
        }),
    
    body('data.msg')
        .notEmpty()
        .isString(),
    
    body('data.timer')
        .isIn(['NOW', 'DATE/TIME', 'REPEAT']),
    
    body('data.repeat')
        .isIn(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', '3 MONTHS', '6 MONTHS', '12 MONTHS']),
    
    body('data.dateTime')
        .custom(v => {
            if(v === 'N/A' || DATE_TIME_REGEX.test(v)){
                return true;
            }
            throw new Error('invalid value');
        }),

    body('data.time')
        .matches(HOURS_MINUTES),

    body('data.weekDay')
        .isInt({min: 0, max: 7}),

    body('data.monthDate')
        .isInt({min: 0, max: 31}),

    body('data.monthName')
        .isInt({min: 0, max: 12})

];

exports.updateBulkMsg = [
    body('data.id')
        .isInt({min: 1}),

    body('data.msg')
        .notEmpty()
        .isString(),

    body('data.timer_status')
        .isIn(['NOW', 'DATE/TIME', 'REPEAT']),

    body('data.repeat_duration')
        .isIn(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', '3 MONTHS', '6 MONTHS', '12 MONTHS']),

    body('data.date_time')
        .custom(v => {
            if(v === 'N/A' || DATE_TIME_REGEX.test(v)){
                return true;
            }
            throw new Error('invalid value');
        }),

    body('data.week_day')
        .matches(/^(|[0-7])$/),

    body('data.month_name')
        .matches(/^(|[0-9]|1[0-2])$/),

    body('data.month_date')
        .matches(/^(|[1-9]|1[0-9]|2[0-9]|3[0-1])$/),

    body('data.time')
        .matches(HOURS_MINUTES),

    body('data.interval_description')
        .isString(),

    body('timezone')
        .optional({ nullable: true })
        .custom(tz => isValidTimeZone(tz))



];

exports.getBulkMsgsList = [
    body('timezone')
        .optional({ nullable: true })
        .custom(tz => isValidTimeZone(tz))
];

exports.deleteBulkMsg = [
    param('id')
        .isInt({min: 1})
];
