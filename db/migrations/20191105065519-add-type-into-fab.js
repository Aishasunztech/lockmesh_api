'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'financial_account_transections',
        'current_balance',
        {
          type: Sequelize.DECIMAL,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        'financial_account_transections',
        'paid_credits',
        {
          type: Sequelize.DECIMAL,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        'financial_account_transections',
        'due_credits',
        {
          type: Sequelize.DECIMAL,
          defaultValue: 0,
        }
      ),

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
