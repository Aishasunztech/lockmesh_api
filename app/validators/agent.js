const { check } = require('express-validator');



exports.getAgentList = [ // nn

];

exports.addAgent = [
    check('name')
        .exists()
        .notEmpty(),

    check('email')
        .exists()
        .notEmpty(),

    check('type')
        .exists()
        .notEmpty(),

];

exports.updateAgent = [
    check('agent_id')
        .exists()
        .notEmpty(),

    check('name')
        .exists()
        .notEmpty(),

    check('email')
        .exists()
        .notEmpty(),

    check('type')
        .exists()
        .notEmpty(),
];

exports.changeStatus = [
    // p
    check('agent_id')
        .exists()
        .notEmpty(),

    check('status')
        .exists()
        .notEmpty()
];

exports.resetPwd = [
    check('agent_id')
        .exists()
        .notEmpty(),
];

exports.deleteAgent = [
    check('agent_id')
        .exists()
        .notEmpty(),
];

exports.updateProfile = [

];
