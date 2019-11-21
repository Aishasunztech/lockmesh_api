'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('services_data', 'total_credits', {
        type: Sequelize.DECIMAL,
      }),

      queryInterface.changeColumn('services_data', 'paid_credits', {
        type: Sequelize.DECIMAL,
      }),

      queryInterface.addColumn('services_data', 'service_term_days', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn('services_data', 'status', {
        type: Sequelize.ENUM,
        values: ['returned', 'cancelled', 'completed', 'extended', 'request_for_cancel', 'deleted', 'active'],
        defaultValue: 'active'
      }),
      queryInterface.removeColumn('services_data', 'del_status')

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
