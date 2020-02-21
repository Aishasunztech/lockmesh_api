'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sim_ids', 'sim_status', {
      type: Sequelize.ENUM,
      values: ['active', 'disabled', 'suspended'],
      defaultValue: 'active'
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
