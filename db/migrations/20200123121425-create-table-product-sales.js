'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_sale', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
      },
      product_data: {
        type: Sequelize.TEXT,
      },
      product_type: {
        type: Sequelize.ENUM,
        values: ['package', 'product', 'standalone']
      },
      product_term: {
        type: Sequelize.STRING,
      },
      product_sale_price: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      product_admin_cost: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      product_dealer_cost: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      paid_sale_price: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      paid_admin_cost: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      paid_dealer_cost: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['delivered', 'returned', 'cancelled']
      },
      start_date: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      end_date: {
        type: 'TIMESTAMP',
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
