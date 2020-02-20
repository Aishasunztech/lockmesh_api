'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'financial_account_transections',
      'type',
      {
        type: Sequelize.ENUM,
        values: ['credits', 'services', 'hardwares', 'standalone_sim'],
        defaultValue: 'services',
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
