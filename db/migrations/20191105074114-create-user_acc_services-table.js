'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_acc_services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_acc_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
      },
      service_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        // allowNull: false,
      },
      type: {
        type: Sequelize.ENUM,
        values: ['pgp_email','chat_id','sim_id','vpn','sim_id2','']
        // allowNull: false,
      },
      start_date: {
        type: Sequelize.STRING
      },
      end_date: {
        type: Sequelize.STRING
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
