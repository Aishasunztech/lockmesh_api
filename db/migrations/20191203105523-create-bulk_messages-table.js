'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bulk_messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      repeat_duration: {
        type: Sequelize.ENUM,
        values: ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        defaultValue: 'NONE'
      },
      timer_status: {
        type: Sequelize.ENUM,
        values: ['NOW', 'DATE/TIME', 'REPEAT'],
        // defaultValue: ''
      },
      device_ids: {
        type: Sequelize.TEXT,
        defaultValue: null
      },
      dealer_ids: {
        type: Sequelize.TEXT,
        defaultValue: null
      },
      user_ids: {
        type: Sequelize.TEXT,
        defaultValue: null
      },
      action_by: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      msg: {
        type: Sequelize.TEXT,
        defaultValue: ''
      },
      sending_time: {
        type: 'TIMESTAMP',
        // allowNull: true,
        // defaultValue: null
      },
      delete_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
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
