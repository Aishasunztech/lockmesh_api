const { sequelize_conn } = require('../../config/database');
const Sequelize = require('sequelize');

const UserApps = sequelize_conn.define('devices', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    device_id: Sequelize.STRING,
    dealer_id: Sequelize.INTEGER,
    connected_dealer: Sequelize.INTEGER,
    chat_id: Sequelize.STRING,
    client_id: Sequelize.STRING,
    session_id: Sequelize.STRING,
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    pgp_email: Sequelize.STRING,
    link_code: Sequelize.STRING,
    model: Sequelize.STRING,
    ip_address: Sequelize.STRING,
    sim_id: Sequelize.STRING,
    simno: Sequelize.TEXT,
    imei: Sequelize.TEXT,
    sim_id2: Sequelize.TEXT,
    simno2: Sequelize.TEXT,
    imei2: Sequelize.TEXT,
    serial_number: Sequelize.TEXT,
    mac_address: Sequelize.TEXT,
    s_dealer: Sequelize.STRING,
    s_dealer_name: Sequelize.STRING,
    account: Sequelize.STRING,
    fcm_token: Sequelize.STRING,
    activation_code: Sequelize.STRING,
    activation_status: Sequelize.BOOLEAN,
    online: {
        type : Sequelize.ENUM,
        values: ['On', 'off','']
    },
    device_status: Sequelize.BOOLEAN,
    is_sync: Sequelize.BOOLEAN,
    status:  {
        type : Sequelize.ENUM,
        values: ['active', 'expired','']
    },
    account_status:  {
        type : Sequelize.ENUM,
        values: ['suspended','']
    },
    unlink_status: Sequelize.BOOLEAN,
    // screen_start_date: Sequelize.,
    start_date: Sequelize.DATE,
    expiry_months: Sequelize.INTEGER,
    expiry_date: Sequelize.DATE
}, {
    timestamps: true,
    underscored: true
})

module.exports = UserApps;