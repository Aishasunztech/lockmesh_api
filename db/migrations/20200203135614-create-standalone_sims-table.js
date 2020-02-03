'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('standalone_sims', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sims_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dealer_id: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM,
        values: ['deleted', 'active', 'disabled'],
        defaultValue: null
      },
      package: {
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
