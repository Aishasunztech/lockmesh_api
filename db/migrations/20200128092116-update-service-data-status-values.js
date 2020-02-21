'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('services_data', 'status', {
      type: Sequelize.ENUM,
      values: ['returned', 'cancelled', 'completed', 'extended', 'request_for_cancel', 'deleted', 'active', 'transferred'],
      defaultValue: 'active'
    })
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
