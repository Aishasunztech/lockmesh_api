'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_category_id: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      dealer_id: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      status: {
        type: Sequelize.ENUM,
        values: ['delevered', 'cancelled', 'returned', 'deleted', 'active', 'disabled'],
        defaultValue: null
      },
      product_data: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      admin_price: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      dealer_price: {
        type: Sequelize.INTEGER,
        defaultValue: null
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
