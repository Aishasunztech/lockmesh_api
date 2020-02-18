'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('packages', 'package_type', {
      type: Sequelize.ENUM,
      values: ['services', 'data_plan', 'standalone_sim'],
      defaultValue: 'services'
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
