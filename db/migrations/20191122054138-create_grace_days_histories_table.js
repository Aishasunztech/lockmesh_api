'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('grace_days_histories').then(function () {
            queryInterface.createTable('grace_days_histories', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                dealer_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                device_id: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                user_acc_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                service_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                grace_days: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                from_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                to_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                created_at: {
                    type: 'TIMESTAMP',
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: 'TIMESTAMP',
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                },
            })
        })
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
    }
};
