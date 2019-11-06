'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('packages').then(function () {
      queryInterface.createTable('packages', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        dealer_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        dealer_type: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: ""
        },
        pkg_name: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: ""
        },
        pkg_price: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: ""
        },
        pkg_term: {
          type: Sequelize.ENUM(
            '12 month', '6 month', '3 month', '1 month'
          ),
          defaultValue: '1 month'
        },
        pkg_expiry: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        pkg_features: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: ""
        },
        delete_status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        dealers: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "[]"
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
