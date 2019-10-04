'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('sims', 'unrEncrypt'
    ).then(() => {
      return queryInterface.removeColumn('sims', 'unrGuest'
      ).then(() => {
        return queryInterface.renameColumn('sims', 'del', 'delete_status')
      })
    });
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
