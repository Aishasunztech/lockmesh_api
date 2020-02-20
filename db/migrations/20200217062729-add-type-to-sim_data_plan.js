'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'sim_data_plans',
      'type',
      {
        type: Sequelize.ENUM,
        values: ['device', 'standalone'],
        defaultValue: 'device',
        allowNull: false
      }
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
