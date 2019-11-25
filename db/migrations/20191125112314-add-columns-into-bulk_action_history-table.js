'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('bulk_device_history', 'msg',
        {
          type: Sequelize.TEXT,
          defaultValue: null,
        }
      ),
      queryInterface.addColumn('bulk_device_history', 'is_in_process',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
				defaultValue: false
      }
    ),
      queryInterface.changeColumn('bulk_device_history', 'action', {
        type: Sequelize.ENUM,
        values: ['PUSHED APPS', 'PULLED APPS', 'PUSHED POLICY', 'SET PERMISSIONS', 'ACTIVATED DEVICES', 'SUSPENDED DEVICES', 'UNLINKED DEVICES', 'WIPED DEVICES', 'SEND MESSAGE']
      })
    ]);
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
