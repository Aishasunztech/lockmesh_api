'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('financial_account_transections', 'status', {
      type: Sequelize.ENUM,
      values: ['holding','transferred','pending','cancelled'],
    }).then(function(){
      return queryInterface.addColumn('financial_account_transections', 'type', {
        type: Sequelize.ENUM,
        values: ['credits','services','hardwares'],
      })
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
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
