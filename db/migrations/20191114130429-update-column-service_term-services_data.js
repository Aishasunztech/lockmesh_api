'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('services_data', 'service_term_days', 'service_term', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('services_data', 'grace_days', {
        type: Sequelize.BOOLEAN,
        defaultValue : 0
      })
    ])
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
