const { check } = require('express-validator');

exports.getProfiles = [
    check('device_id')
        .exists()
        .notEmpty()
];

exports.saveNewData = [
    check('type')
        .exists()
        .notEmpty()
        .isString(),

    check('newData')
        .exists()
        .notEmpty()
        .isArray()
];

exports.importIDs = [
    check('fieldName')
        .exists()
        .notEmpty()
        .isString(),

    check('parsedData')
        .exists()
        .notEmpty()
        .isArray()
];

exports.exportIDs = [
    check('fieldName')
        .exists()
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
    check('fieldName')
        .exists()
        .notEmpty()
        .isString(),

    check('ids')
        .exists()
        .notEmpty()
        .isArray()
];

exports.purchaseCredits = [
    check('data.credits')
        .exists()
        .notEmpty(),

    check('data.method')
        .exists()
        .notEmpty(),

    check('data.total')
        .exists()
        .notEmpty(),

    check('data.currency_price')
        .exists()
        .notEmpty(),

    check('data.promo_code')
        .exists()
        .notEmpty(),

    check('data.currency')
        .exists()
        .notEmpty(),

];

exports.purchaseCredits_CC = [
    check('creditInfo.credits')
        .exists()
        .notEmpty(),

    check('creditInfo.method')
        .exists()
        .notEmpty(),

    check('creditInfo.total')
        .exists()
        .notEmpty(),

    check('creditInfo.currency_price')
        .exists()
        .notEmpty(),

    check('creditInfo.promo_code')
        .exists()
        .notEmpty(),

    check('creditInfo.currency')
        .exists()
        .notEmpty(),

    check('cardInfo.number')
        .exists()
        .notEmpty(),

    check('cardInfo.name')
        .exists()
        .notEmpty(),

    check('cardInfo.cvc')
        .exists()
        .notEmpty(),

    check('cardInfo.expiry')
        .exists()
        .notEmpty(),

];

exports.saveProfile = [
    check('profileName')
        .exists()
        .notEmpty(),

    check('usr_acc_id')
        .exists()
        .notEmpty(),

    check('device_setting.app_list')
        .exists()
        .notEmpty(),

    check('device_setting.passwords')
        .exists()
        .notEmpty(),

    check('device_setting.controls')
        .exists()
        .notEmpty(),

    check('device_setting.extensions')
        .exists()
        .notEmpty()

];

exports.savePackagePermissions = [
    check('action')
        .exists()
        .notEmpty(),

    check('package_id')
        .exists()
        .notEmpty(),

    check('dealers')
        .exists()
        .notEmpty()
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
    check('data.domain')
        .exists()
        .notEmpty(),
];

exports.editDomain = [
    check('data.domain')
        .exists()
        .notEmpty(),

    check('data.oldDomain')
        .exists()
        .notEmpty(),

];

exports.deleteDomain = [
    check('data.domain_name')
        .exists()
        .notEmpty()

];

exports.getLatestPaymentHistory = [
    check('type')
        .exists()
        .notEmpty(),

    check('status')
        .exists()
        .notEmpty(),

    check('limit')
        .exists()
        .notEmpty()
];

exports.getOverdueDetails = [ // nn

];
