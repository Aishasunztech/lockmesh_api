'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([

      queryInterface.addColumn(
        'invoices',
        'type',
        {
          type: Sequelize.ENUM,
          values: ['device', 'standalone_sim'],
          defaultValue: 'device',
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'invoices',
        'sim_t_id',
        {
          type: Sequelize.INTEGER,
          defaultValue: null
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
