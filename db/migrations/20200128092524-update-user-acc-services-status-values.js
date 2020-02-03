'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('user_acc_services', 'status', {
      type: Sequelize.ENUM,
      values: ['active', 'cancelled', 'expired', 'extended', 'transferred'],
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
