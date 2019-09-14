'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('device_history', 'type', {
      type: Sequelize.ENUM(
        'push_apps', 'pull_apps', 'history', 'imei', 'policy', 'force_update', 'profile', 'password', 'wipe'
      )
    },
    )
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
