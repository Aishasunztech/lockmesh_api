'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('chat_ids', 'uploaded_by', {
      type: Sequelize.ENUM('superadmin', 'admin', 'dealer', 'sdealer'),
      defaultValue: 'superadmin',
    }).then(function () {
      queryInterface.addColumn('chat_ids', 'uploaded_by_id', {
        type: Sequelize.INTEGER,
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
