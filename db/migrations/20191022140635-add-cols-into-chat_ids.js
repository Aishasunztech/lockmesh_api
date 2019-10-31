'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      
      queryInterface.addColumn(
        'chat_ids',
        'dealer_id',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.addColumn(
        'chat_ids',
        'start_date',
        {
          type: 'datetime',
        }
      ),
      queryInterface.addColumn(
        'chat_ids',
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
