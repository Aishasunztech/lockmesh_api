'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'credit_purchase',
      'accepted_status',
      {
        type: Sequelize.ENUM(
          'pending', 'rejected', 'accepted'
        ),
        defaultValue: 'pending'
      }
    );
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
