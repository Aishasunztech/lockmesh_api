'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([

      queryInterface.addColumn(
        'sim_ids',
        'name',
        {
          type: Sequelize.STRING,
          defaultValue: ''
        }
      ),
      queryInterface.addColumn(
        'sim_ids',
        'email',
        {
          type: Sequelize.STRING,
          defaultValue: ''
        }
      ),
      queryInterface.addColumn(
        'sim_ids',
        'note',
        {
          type: Sequelize.STRING,
          defaultValue: ''
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
