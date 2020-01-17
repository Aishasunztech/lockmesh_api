'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('login_history', 'logged_in_client', {
      type: Sequelize.ENUM,
      values: ['dealer', 'admin', 'device', 'sdealer', 'auto_update_admin', 'SuperAdmin'],
      defaultValue: 'admin'
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
