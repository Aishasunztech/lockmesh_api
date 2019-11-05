'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('services_sale', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_acc_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      service_data_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
      },
      item_data: {
        type: Sequelize.TEXT,
      },
      item_type: {
        type: Sequelize.ENUM,
        values: ['package','product','']
      },
      item_term: {
        type: Sequelize.STRING,
      },
      item_sale_price: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      item_admin_cost: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      item_dealer_cost: {
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
        values: ['delivered','returned','cancelled']
      },
      start_date: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      end_date: {
        type: 'datetime',
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
