const { check, body } = require('express-validator');
const { validArrayWithValues } = require('./commonValidators/validation_helpers')

exports.removeSMApps = [
    body('data')
        .custom(data => {
            if (data && (data === "all" || validArrayWithValues(data, 'pk'))) {
                return true;
            } else {
                return false;
            }
        }),

    check('spaceType')
        .isIn(['guest', 'encrypted'])
];

exports.transferApps = [
    body('data')
        .custom(data => validArrayWithValues(data, 'pk')),

    body('spaceType')
        .isIn(['guest', 'encrypted'])
];

exports.marketApplist = [ // nn

];

exports.getAppPermissions = [ // nn

];

exports.getSystemPermissions = [ // nn

];
