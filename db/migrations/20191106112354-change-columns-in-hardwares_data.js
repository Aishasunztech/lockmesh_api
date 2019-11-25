'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('hardwares_data', 'admin_cost_credits', {
        type: Sequelize.INTEGER,
      }),

      queryInterface.addColumn('hardwares_data', 'dealer_cost_credits', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('hardwares_data', 'status', {
        type: Sequelize.ENUM,
        values: ['returned', 'delivered'],
        defaultValue: 'delivered'
      }),
      queryInterface.removeColumn('hardwares_data', 'del_status')

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
