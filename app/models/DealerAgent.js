const { sequelize_conn } = require('../../config/database');
const Sequelize = require('sequelize');

var DealerAgent = sequelize_conn.define('dealer_agents', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    staff_id: {
        type: Sequelize.STRING
    },
    dealer_id: {
        type: Sequelize.INTEGER,
    },
    dealer_type: {
        type: Sequelize.ENUM,
        values: ['admin', 'dealer', 'sdealer'],
    },
    name: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.ENUM,
        values: ['agent', 'admin'],
        defaultValue: 'agent',
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    delete_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    created_at: { type: Sequelize.DATE, field: 'created_at' },
    updated_at: { type: Sequelize.DATE, field: 'updated_at' },

}, {
        timestamps: false,
        tableName: 'dealer_agents'
    }
)

module.exports = DealerAgent;