'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'acc_vpn',
        'delete_status',
        {
          type: Sequelize.BOOLEAN
        }
      ),
      queryInterface.addColumn(
        'acc_vpn',
        'dealer_id',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.addColumn(
        'acc_vpn',
        'start_date',
        {
          type: 'datetime',
        }
      ),
      queryInterface.addColumn(
        'acc_vpn',
        'end_date',
        {
          type: 'datetime',
        }
      ),
     
    ]);
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
