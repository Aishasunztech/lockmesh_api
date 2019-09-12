'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'usr_acc',
      'pending_services',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('usr_acc', 'pending_services');
  }
};
