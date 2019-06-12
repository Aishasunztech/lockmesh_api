const sequelize_conn = require('../helper/sequelize_conn');
const Sequelize = require('sequelize');

const UserRoles = sequelize_conn.define('user_roles',{
    id: { type: Sequelize.INTEGER, primaryKey: true },
    role: Sequelize.STRING,
    status: Sequelize.BOOLEAN,
    // createdAt: { type: Sequelize.DATE, field: 'created_at' },
    // updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

}, { 
    timestamps: false, 
    // underscored: true
})

module.exports = UserRoles;