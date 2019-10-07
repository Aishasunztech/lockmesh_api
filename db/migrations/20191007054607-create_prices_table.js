'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('prices').then(function () {
      queryInterface.createTable('prices', {
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
        price_for: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: ""
        },
        unit_price: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: ""
        },
        price_term: {
          type: Sequelize.ENUM(
            '12 month', '6 month', '3 month', '1 month'
          ),
          defaultValue: '1 month'
        },
        price_expiry: {
          type: Sequelize.INTEGER,
          allowNull: false
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
