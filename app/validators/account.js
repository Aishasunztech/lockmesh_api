const { check, body, param } = require('express-validator');
const { DEVICE_ID_PATTERN } = require('../../constants/validation');
const { isObject } = require('../validators/commonValidators/validation_helpers');
exports.getProfiles = [
    body('device_id')
        .matches(DEVICE_ID_PATTERN)
];

exports.saveNewData = [
    body('type')
        .notEmpty()
        .isString(),

    body('newData')
        .isArray()
];

exports.importIDs = [
    param('fieldName')
        .notEmpty()
        .isString(),

    body('parsedData')
        .isArray()
];

exports.exportIDs = [
    param('fieldName')
        .notEmpty()
        .isString()
];

exports.getSimIDs = [ // nn

];

exports.getAllSimIDs = [ // nn

];

exports.resync_ids = [ // call same function as above (getAllSimIDs)

];

exports.getUsedSimIDs = [ // nn

];

exports.getChatIDs = [ // nn

];

exports.getAllChatIDs = [ // nn

];

exports.getPGPEmails = [ // nn

];

exports.getAllPGPEmails = [ // nn

];

exports.getUsedPGPEmails = [ // nn

];

exports.getUsedSimIDs = [ // nn

];

exports.getUsedChatIDs = [ // nn

];

exports.deleteCSV = [
    param('fieldName')
        .notEmpty()
        .isString(),

    check('ids')
        .isArray()
];

exports.purchaseCredits = [
    body('data.credits')
        .isInt(),

    body('data.method')
        .notEmpty(),

    body('data.total')
        .isInt(),

    body('data.currency_price')
        .notEmpty(),

    body('data.promo_code')
        .optional()
        .isString(),

    body('data.currency')
        .exists()
        .notEmpty(),

];

exports.purchaseCredits_CC = [
    body('creditInfo.credits')
        .isInt(),

    body('creditInfo.method')
        .notEmpty()
        .isString(),

    body('creditInfo.total')
        .notEmpty()
        .isInt(),

    body('creditInfo.currency_price')
        .notEmpty()
        .isInt(),

    body('creditInfo.promo_code')
        .optional()
        .isString(),

    body('creditInfo.currency')
        .notEmpty()
        .isString(),

    body('cardInfo.number')
        .isCreditCard(),

    body('cardInfo.name')
        .notEmpty()
        .isString(),

    body('cardInfo.cvc')
        .notEmpty()
        .matches(/^[0-9]{3,4}$/),

    body('cardInfo.expiry')
        .matches(/^((0[1-9]|1[0-2]))\/[0-9]{2}$/),
];

exports.saveProfile = [
    body('profileName')
        .notEmpty()
        .isString(),

    body('usr_acc_id')
        .isInt({ min: 1 }),

    check('device_setting.app_list')
        .isArray(),

    check('device_setting.passwords')
        .custom(v => isObject(v)),

    check('device_setting.controls')
        .isArray(),

    check('device_setting.extensions')
        .isArray()

];

exports.savePackagePermissions = [ // nn

];

exports.ackCreditRequest = [
    check('data.credits')
        .exists()
        .notEmpty(),

    check('data.dealer_id')
        .exists()
        .notEmpty(),

    check('data.request_id')
        .exists()
        .notEmpty(),

    check('data.type')
        .exists()
        .notEmpty(),

];

exports.getDomains = [ // nn

];


exports.addDomain = [
    body('data.domain')
        .notEmpty()
        .isFQDN(),
];

exports.editDomain = [
    body('data.domain')
        .exists()
        .notEmpty()
        .isFQDN(),

    body('data.oldDomain')
        .exists()
        .notEmpty()
        .isFQDN()

];

exports.deleteDomain = [
    body('data.domain_name')
        .notEmpty()

];

exports.getLatestPaymentHistory = [
    body('type')
        .notEmpty(),

    body('status')
        .optional()
        .isString(),

    body('limit')
        .notEmpty()
];

exports.getOverdueDetails = [ // nn

];
