const { check, body, param } = require('express-validator');
const {
    bulk_action_list
} = require('./commonValidators/constants');

const { isValidTimeZone, arrayOfObjectWithKeys, validArrayWithValues } = require('./commonValidators/validation_helpers')
const { DATE_REGEX, USER_ID_PATTERN } = require('../../constants/validation');
exports.bulkDevicesHistory = [ // nn

];

const filteredBulkDevicesDealersSchema = [{
    index: 'key',
    type: 'pk'
}];
const filteredBulkDevicesUsersSchema = [{
    index: 'key',
    type: 'regex',
    pattern: USER_ID_PATTERN
}];

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

];

exports.applyBulkPullApps = [

];

exports.unlinkBulkDevices = [

];

exports.wipeBulkDevices = [

];

exports.applyBulkPolicy = [

];

exports.sendBulkMsg = [

];

exports.updateBulkMsg = [
    // body('data.id')
    //     .notEmpty()
    //     .isInt(),

    // body('data.msg')
    //     .notEmpty()
    //     .isString(),

    // body('data.timer_status')
    //     .isIn(['NOW', 'DATE/TIME', 'REPEAT']),

    // body('data.repeat_duration')
    //     .isIn(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', '3 MONTH', '6 MONTHS', '12 MONTHS']),

    // body('data.date_time')
    //     .matches(DATE_REGEX),

    body('data.week_day')
        .optional({ checkFalsy: true,  })
        .isNumeric()
        .matches(/^[1-7]$/),

    // body('data.month_date')
    //     .matches(/^[1-12]$/),

    // body('data.week_day')
    //     .matches(/^[0-6]$/),

    // body('data.week_day')
    //     .matches(/^[0-6]$/),


    // body('timezone')
    //     .optional({ nullable: true })
    //     .custom(tz => isValidTimeZone(tz))



];

exports.getBulkMsgsList = [
    body('timezone')
        .optional({ nullable: true })
        .custom(tz => isValidTimeZone(tz))
];

exports.deleteBulkMsg = [
    param('id')
        .notEmpty()
        .isInt()
];
