
//app/models/user.js
//load the things we need
const sequelize_conn = require('../../config/database');

const Sequelize = require('sequelize');

const UserApps = sequelize_conn.define('user_apps',{
    id: { type: Sequelize.INTEGER, primaryKey: true },
    device_id: Sequelize.INTEGER,
    app_id: Sequelize.INTEGER,
    guest: Sequelize.BOOLEAN,
    encrypted: Sequelize.BOOLEAN,
    enable: Sequelize.BOOLEAN,
    // created_at: Sequelize.DATE,
    // updated_at: Sequelize.DATE,
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

}, { 
    timestamps: true, 
    // underscored: true
})

module.exports = UserApps;