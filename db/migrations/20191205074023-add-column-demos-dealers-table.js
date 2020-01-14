'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('dealers', 'demos', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }).then(function () {
      queryInterface.addColumn('dealers', 'remaining_demos', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
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
