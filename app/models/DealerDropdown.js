const sequelize_conn = require('../helper/sequelize_conn');
const Sequelize = require('sequelize');

const DealerDropdown = sequelize_conn.define('dealer_dropdown_list', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    dealer_id: {
        type: Sequelize.INTEGER
    },
    selected_items: {
        type: Sequelize.JSON
    },
    type: {
        type: Sequelize.ENUM,
        values: ['devices','dealer','sdealer','apk']
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
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

module.exports = DealerDropdown;