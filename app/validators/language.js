const { check, body } = require('express-validator');



exports.getLanguage = [ // nn

];

exports.saveLanguage = [
    body('language.id')
        .exists()
        .notEmpty()
        .isNumeric()
];

exports.getAll_Languages = [ // nn

];
