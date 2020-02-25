const { check, param, body } = require('express-validator');



exports.getAgentList = [ // nn

];

exports.addAgent = [
    // body('name')
    //     .exists()
    //     .notEmpty(),

    // body('email')
    //     .exists()
    //     .notEmpty(),

    // body('type')
    //     .exists()
    //     .notEmpty(),

];

exports.updateAgent = [
    // body('agent_id')
    //     .exists()
    //     .notEmpty(),

    // body('name')
    //     .exists()
    //     .notEmpty(),

    // body('email')
    //     .exists()
    //     .notEmpty(),

    // body('type')
    //     .exists()
    //     .notEmpty(),
];

exports.changeStatus = [
    // param('agent_id')
    //     .exists()
    //     .notEmpty(),

    // body('status')
    //     .exists()
    //     .notEmpty()
];

exports.resetPwd = [
    // body('agent_id')
    //     .exists()
    //     .notEmpty(),
];

exports.deleteAgent = [
    // body('agent_id')
    //     .exists()
    //     .notEmpty(),
];

exports.updateProfile = [

];
