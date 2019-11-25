'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('invoices', 'user_acc_id', {
        type: Sequelize.TEXT,
      }),

      queryInterface.changeColumn('invoices', 'dealer_id', {
        type: Sequelize.INTEGER,
        allowNull: false
      }),

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
