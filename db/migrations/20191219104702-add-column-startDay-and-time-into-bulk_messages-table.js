'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('bulk_messages', 'time', {
        type: Sequelize.STRING,
        defaultValue: ''
      }),
      queryInterface.addColumn('bulk_messages', 'startDay', {
        type: Sequelize.STRING,
        defaultValue: 'Mon'
      }),

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
