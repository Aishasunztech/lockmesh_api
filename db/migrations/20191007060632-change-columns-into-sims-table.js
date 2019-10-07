'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('sims', 'guest', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull:false

    },
    ).then(() => {
      return queryInterface.changeColumn('sims', 'encrypt', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull:false
      },
      )
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
