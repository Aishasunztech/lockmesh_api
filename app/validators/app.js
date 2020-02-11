const { check, body } = require('express-validator');

exports.removeSMApps = [
    check('data')
        .exists()
        .notEmpty()
        .custom(data => {
            if (checkArrayAndString(data, ['all'])) {
              throw new Error('bad request')
            }
          })
        ,

    check('spaceType')
        .exists()
        .notEmpty()
        .isAlpha()
        .isIn(['guest', 'encrypted'])
];

exports.transferApps = [
    body('data')
        .exists()
        .notEmpty()
        .isArray(),  // check array length not empty

    body('spaceType')
        .exists()
        .notEmpty()
        .isAlpha()
        .isIn(['guest', 'encrypted'])
];

exports.marketApplist = [ // nn

];

exports.getAppPermissions = [ // nn

];

exports.getSystemPermissions = [ // nn

];
