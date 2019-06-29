const { sequelize_conn } = require('../../config/database');

const Sequelize = require('sequelize');

const Admin = sequelize_conn.define('admins', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    verified: Sequelize.BOOLEAN,
    verification_code: Sequelize.STRING,
    is_two_factor_auth: Sequelize.BOOLEAN,
    type: Sequelize.INTEGER,
    unlink_status: Sequelize.BOOLEAN,
    account_status: {
        type: Sequelize.ENUM,
        values: ['suspended', '']
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },

}, {
        timestamps: true,
        // underscored: true
    })

module.exports = Admin;