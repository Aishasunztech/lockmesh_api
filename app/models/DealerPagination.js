const { sequelize_conn } = require('../../config/database');
const Sequelize = require('sequelize');

const DealerPagination = sequelize_conn.define('dealer_pagination', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    dealer_id: {
        type: Sequelize.INTEGER
    },
    record_per_page: {
        type: Sequelize.INTEGER
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

module.exports = DealerPagination;