const { sequelize_conn } = require('../../config/database');
const Sequelize = require('sequelize');
var Policy = require('./Policy');

var PolicyApps = sequelize_conn.define('policy_apps',{
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true 
    },
    policy_id: Sequelize.INTEGER,
    apk_id: Sequelize.INTEGER,

    guest: Sequelize.BOOLEAN, // relational with dealers
    encrypted: Sequelize.BOOLEAN,
    enable: Sequelize.BOOLEAN,
    
    created_at: { type: Sequelize.DATE, field: 'created_at' },
    updated_at: { type: Sequelize.DATE, field: 'updated_at' },

}, { 
    timestamps: false,
    tableName: 'policy_apps'
})

// PolicyApps.belongsTo(Policy);

module.exports = PolicyApps;