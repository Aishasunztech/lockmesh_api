const { check, body, param } = require('express-validator');
const {
    bulk_action_list
} = require('./commonValidators/constants');

const { isValidTimeZone } = require('./commonValidators/validation_helpers')
const { DATE_REGEX } = require('../../constants/validation');
exports.bulkDevicesHistory = [ // nn

];

exports.getFilteredBulkDevices = [
    body('dealers')
        .isArray(),

    body('users')
        .isArray(),
];

exports.suspendBulkAccountDevices = [
    // body('device_ids')
    //     .notEmpty()
    //     .isArray(),

    // body('dealer_ids')
    //     .notEmpty()
    //     .isArray(),

    // body('user_ids')
    //     .isArray(),

    // body('apps')
    //     .isArray(),

    // body('policy')
    //     .notEmpty()
    //     .isArray()
];

exports.activateBulkDevices = [

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
