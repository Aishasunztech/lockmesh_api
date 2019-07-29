const sequelize_conn = require('../helper/sequelize_conn');
const Sequelize = require('sequelize');
// const UserApps = require('./UserApps');

const APKDetails = sequelize_conn.define('apk_details', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    app_name: {
        type: Sequelize.STRING
    },
    logo: {
        type: Sequelize.TEXT
    },
    apk: {
        type: Sequelize.TEXT
    },
    apk_type: {
        type: Sequelize.ENUM,
        values: ['permanent','basic','other','']
    },
    package_name: {
        type: Sequelize.TEXT
    },
    status: {
        type: Sequelize.ENUM,
        values: ['Off','On']
    },
    delete_status: {
        type: Sequelize.BOOLEAN
    },
    createdAt: { type: Sequelize.DATE, field: 'created' },
    updatedAt: { type: Sequelize.DATE, field: 'modified' },
}, {
    timestamps: true,
    // underscored: true,
    // hooks: {
    //     beforeValidate: (user, options) => {
    //       user.mood = 'happy';
    //     },
    //     afterValidate: (user, options) => {
    //       user.username = 'Toni';
    //     }
    // }
})

// AppsInfo.addHook('beforeValidate', (user, options) => {
//     user.mood = 'happy';
// });

// AppsInfo.hasMany(UserApps, { onDelete: 'cascade', hooks: true });
// UserApps.belongsTo(AppsInfo);

module.exports = APKDetails;