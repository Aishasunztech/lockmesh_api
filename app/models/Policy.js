const { sequelize_conn } = require('../../config/database');
const Sequelize = require('sequelize');
const Constants = require('../../constants/Application');
var PolicyApps = require('./PolicyApps');

var Policy = sequelize_conn.define('policy',{
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true 
    },
    policy_name: Sequelize.STRING,
    policy_note: Sequelize.STRING,
    dealer_id: Sequelize.INTEGER, // relational with dealers
    dealer_type: {
        type: Sequelize.ENUM,
        values: [Constants.ADMIN, Constants.DEALER, Constants.SDEALER]
    },
    command_name: Sequelize.STRING,
    permissions: Sequelize.JSON,
    app_list: Sequelize.JSON,
    controls: Sequelize.JSON,
    dealers: Sequelize.JSON,
    passwords: Sequelize.JSON,
    status: Sequelize.BOOLEAN,
    object_size: Sequelize.STRING,
    policy_size: Sequelize.STRING,

    created_at: { type: Sequelize.DATE, field: 'created_at' },
    updated_at: { type: Sequelize.DATE, field: 'updated_at' },

}, { 
    timestamps: false,
    tableName: 'policy'
})

Policy.hasMany(PolicyApps);

module.exports = Policy;