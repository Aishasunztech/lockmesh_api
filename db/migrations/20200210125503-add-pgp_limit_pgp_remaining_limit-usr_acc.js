'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([

      queryInterface.addColumn(
        'usr_acc',
        'pgp_limit',
        {
          type: Sequelize.INTEGER,
          defaultValue: 10
        }
      ),
      queryInterface.addColumn(
        'usr_acc',
        'pgp_remaining_limit',
        {
          type: Sequelize.INTEGER,
          defaultValue: 10
        }
      )
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
