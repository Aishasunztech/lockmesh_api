const { check, param, body } = require('express-validator');
const {
    add_dealer_roles,
    page_names_for_drop_downs
} = require('./commonValidators/constants');


exports.getAllDealers = [ // nn

];

exports.getAllToAllDealers = [ // nn

];

exports.getAdmin = [

];

exports.getUserDealers = [

];

exports.getDealers = [
    param('pageName')
        .exists()
        .notEmpty()
    // .isNumeric()
];

exports.addDealer = [
    body('name')
        .exists()
        .notEmpty()
        .isAlphanumeric(),

    body('email')
        .exists()
        .notEmpty()
        .isEmail(),

    body('pageType')
        .exists()
        .notEmpty()
        .isIn(add_dealer_roles),
];

exports.editDealers = [
    body('name')
        .exists()
        .notEmpty()
        .isAlphanumeric(),

    body('email')
        .exists()
        .notEmpty()
        .isEmail(),

    body('dealer_id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.setDealerCreditsLimit = [
    body('credits_limit')
        .exists()
        .notEmpty()
        // .isNumeric(),
        .matches(/^(-?)[0-9]+$/),

    body('dealer_id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.deleteDealer = [
    body('dealer_id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.undoDealer = [
    body('dealer_id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.suspendDealer = [
    body('dealer_id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.activateDealer = [
    body('dealer_id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.resetPwd = [
    // body('pageName')
    //     .exists()
    //     .notEmpty()
    //     .isIn(add_dealer_roles),

    // body('newpwd')
    //     .exists()
    //     .notEmpty()
    //     .isNumeric(),

    // body('curntpwd')
    //     .exists()
    //     .notEmpty()
    //     .isNumeric(),

    // body('dealer_id')
    //     .exists()
    //     .notEmpty()
    //     .isNumeric(),

    // body('dealer_email')
    //     .exists()
    //     .notEmpty()
    //     .isEmail(),
];

exports.connectDealer = [
    param('dealerId')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.dealerDomains = [
    param('dealerId')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.getDealerPaymentHistory = [
    param('dealerId')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.getDealerSalesHistory = [
    param('dealerId')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.changeDealerStatus = [
    param('dealerId')
        .exists()
        .notEmpty()
        .isNumeric(),

    body('dealerStatus')
        .exists()
        .notEmpty()
        .isIn(['active', 'restricted', 'suspended'])
];

exports.getLoggedDealerApps = [ // nn

];

exports.getInfo = [ // nn

];

exports.getDealerForSA = [ // nn

];

exports.getDropdownSelectedItems = [
    param('dropdownType')
        .exists()
        .notEmpty()
        .isIn([page_names_for_drop_downs]),
];

exports.saveDropDown = [
    // body('selected_items')
    //     .exists()
    //     .isEmpty()
    //     .isArray({ min: 1 }),

    // body('pageName')
    //     .exists()
    //     .notEmpty()
    //     .isIn([page_names_for_drop_downs]),
];

exports.getPagination = [

];

exports.postPagination = [

];

exports.updateDealerPins = [

];

exports.twoFactorAuth = [

];

exports.dealerPermissions = [

];

exports.connectDealerDomainsPermissions = [

];

exports.setDealerDemosLimit = [

];

exports.setTimeZone = [

];
