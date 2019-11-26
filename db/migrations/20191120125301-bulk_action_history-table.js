'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bulk_device_history', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      action: {
        type: Sequelize.ENUM,
        values: ['PUSHED APPS', 'PULLED APPS', 'PUSHED POLICY', 'SET PERMISSIONS', 'ACTIVATED DEVICES', 'SUSPENDED DEVICES', 'UNLINKED DEVICES', 'WIPED DEVICES']
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
      apps: {
        type: Sequelize.TEXT,
        defaultValue: null
      },
      action_by: {
        type: Sequelize.STRING,
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
