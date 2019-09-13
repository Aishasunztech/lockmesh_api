'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'usr_acc',
      'firmware_info',
      {
        type: Sequelize.STRING
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('usr_acc', 'firmware_info');
  }
};
