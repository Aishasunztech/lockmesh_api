const { check, param, body } = require('express-validator');
const {
    add_dealer_roles,
    page_names_for_drop_downs,
    permission_types
} = require('./commonValidators/constants');

const { arrayOfObjectWithKeys, isObject } = require('./commonValidators/validation_helpers');

// Define Dealer Schemas
const saveDropDownSchema = [];



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
        .notEmpty()
    // .isNumeric()
];

exports.addDealer = [
    body('name')
        .notEmpty()
        .isAlphanumeric(),

    body('email')
        .notEmpty()
        .isEmail(),

    body('pageType')
        .notEmpty()
        .isIn(add_dealer_roles),
];

exports.editDealers = [
    body('name')
        .notEmpty()
        .isAlphanumeric(),

    body('email')
        .notEmpty()
        .isEmail(),

    body('dealer_id')
        .notEmpty()
        .isNumeric()
];

exports.setDealerCreditsLimit = [
    body('credits_limit')
        .notEmpty()
        // .isNumeric(),
        .matches(/^(-?)[0-9]+$/),

    body('dealer_id')
        .notEmpty()
        .isNumeric()
];

exports.deleteDealer = [
    body('dealer_id')
        .notEmpty()
        .isNumeric()
];

exports.undoDealer = [
    body('dealer_id')
        .notEmpty()
        .isNumeric()
];

exports.suspendDealer = [
    body('dealer_id')
        .notEmpty()
        .isNumeric()
];

exports.activateDealer = [
    body('dealer_id')
        .notEmpty()
        .isNumeric()
];

exports.resetPwd = [
    // body('pageName')
    //     .notEmpty()
    //     .isIn(add_dealer_roles),

    // body('newpwd')
    //     .notEmpty()
    //     .isNumeric(),

    // body('curntpwd')
    //     .notEmpty()
    //     .isNumeric(),

    // body('dealer_id')
    //     .notEmpty()
    //     .isNumeric(),

    // body('dealer_email')
    //     .notEmpty()
    //     .isEmail(),
];

exports.connectDealer = [
    param('dealerId')
        .notEmpty()
        .isNumeric()
];

exports.dealerDomains = [
    param('dealerId')
        .notEmpty()
        .isNumeric()
];

exports.getDealerPaymentHistory = [
    param('dealerId')
        .notEmpty()
        .isNumeric()
];

exports.getDealerSalesHistory = [
    param('dealerId')
        .notEmpty()
        .isNumeric()
];

exports.changeDealerStatus = [
    param('dealerId')
        .notEmpty()
        .isNumeric(),

    body('dealerStatus')
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
        .notEmpty()
        .isIn(page_names_for_drop_downs),
];

exports.saveDropDown = [
    body('selected_items')
        // .isArray()
        .custom(value => {
            return arrayOfObjectWithKeys(JSON.parse(value), saveDropDownSchema, true);
        }),

    body('pageName')
        .notEmpty()
        .isIn(page_names_for_drop_downs),
];

exports.getPagination = [ // not uses
    // param('dropdownType')
    //     .notEmpty()
    //     .isIn(page_names_for_drop_downs),
];

exports.postPagination = [ // not uses

];

exports.updateDealerPins = [ // nn script

];

exports.twoFactorAuth = [
    body('isEnable')
        // .not().isIn([undefined, null])
        .isBoolean()
];

exports.dealerPermissions = [
    param('permissionType')
        .notEmpty()
        .isIn(permission_types),

    body('action')
        .notEmpty()
        .isIn(['save', 'delete']),

    body('permissionId')
        .notEmpty()
        .isNumeric(),

    body('dealers')
        .notEmpty()
        .custom(value => {
            return arrayOfObjectWithKeys(JSON.parse(value));
        }),

    body('statusAll')
        .isBoolean()

];

exports.connectDealerDomainsPermissions = [

    body('action')
        .notEmpty()
        .isIn(['save', 'delete']),

    body('permissionIds')
        .notEmpty()
        .isArray(),

    body('dealers')
        .notEmpty()
        .isArray(),

    body('statusAll')
        .isBoolean()
];

exports.setDealerDemosLimit = [
    body('demos')
        // .isNumeric()
        .matches(/^[1-9][0-9]+$/),

    body('dealer_id')
        .notEmpty()
        .isNumeric(),
];

exports.setTimeZone = [
    body('data')
        .notEmpty()
        .isString(),
];
