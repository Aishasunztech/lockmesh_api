'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('bulk_device_history', 'policy', 'old_policy', {
      type: Sequelize.TEXT,
      defaultValue: null
    }).then(function () {
      return queryInterface.addColumn('bulk_device_history', 'policy', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
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
