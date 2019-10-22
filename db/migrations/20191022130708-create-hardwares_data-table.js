'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('hardwares', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_acc_id: {
        type: Sequelize.INTEGER,
      },
      dealer_id: {
        type: Sequelize.INTEGER,
      },
      hardware_name: {
        type: Sequelize.STRING,
      },
      hardware_data: {
        type: Sequelize.TEXT,
      },
      total_credits: {
        type: Sequelize.INTEGER,
      },
      del_status: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
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
