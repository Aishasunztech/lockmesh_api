'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
     
      queryInterface.addColumn(
        'pgp_emails',
        'dealer_id',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.addColumn(
        'pgp_emails',
        'start_date',
        {
          type: 'datetime',
        }
      ),
      queryInterface.addColumn(
        'pgp_emails',
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
