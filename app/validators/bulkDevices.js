const { check, body, param } = require('express-validator');
const {
    bulk_action_list
} = require('./commonValidators/constants');

const { isValidTimeZone } = require('./commonValidators/validation_helpers')

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
    body('data.id')
        .notEmpty()
        .isInt(),

    body('data.msg')
        .notEmpty()
        .isString(),

    body('data.timer_status')
        .isIn(['NOW', 'DATE/TIME', 'REPEAT']),

    body('data.repeat_duration')
        .isIn(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', '3 MONTH', '6 MONTHS', '12 MONTHS']),

    // body('data.date_time')

    body('data.week_day') 
    


];

exports.getBulkMsgsList = [
    body('timezone')
        .optional({ nullable: true })
        // .isString()
        .custom(tz => isValidTimeZone(tz))
];

exports.deleteBulkMsg = [
    param('id')
        .notEmpty()
        .isInt()
];
