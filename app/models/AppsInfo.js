const { sequelize_conn } = require('../../config/database');
const Sequelize = require('sequelize');
const UserApps = require('./UserApps');

const AppsInfo = sequelize_conn.define('apps_info', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    unique_name: {
        type: Sequelize.TEXT
    },
    label: {
        type: Sequelize.TEXT
    },
    package_name: {
        type: Sequelize.TEXT
    },
    icon: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: true,
    underscored: true,
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

module.exports = AppsInfo;