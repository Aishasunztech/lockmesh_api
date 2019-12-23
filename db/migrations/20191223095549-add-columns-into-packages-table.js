'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('packages', 'package_type', {
      type: Sequelize.ENUM('services', 'data_plan'),
      defaultValue: 'services',
    }).then(function () {
      return queryInterface.addColumn('packages', 'data_limit', {
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
