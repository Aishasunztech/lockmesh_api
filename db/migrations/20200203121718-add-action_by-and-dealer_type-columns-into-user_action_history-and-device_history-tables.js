'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([

      queryInterface.addColumn(
        'acc_action_history',
        'action_by',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.addColumn(
        'acc_action_history',
        'dealer_type',
        {
          type: Sequelize.ENUM,
          values: ['admin', 'dealer', 'sdealer'],
        }
      ),

      queryInterface.addColumn(
        'device_history',
        'action_by',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.addColumn(
        'device_history',
        'dealer_type',
        {
          type: Sequelize.ENUM,
          values: ['admin', 'dealer', 'sdealer'],
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
