'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('dealers', 'company_name', {
        type: Sequelize.STRING,
        defaultValue: ''
      }),
      queryInterface.addColumn('dealers', 'company_address', {
        type: Sequelize.TEXT,
        defaultValue: ''
      }),
      queryInterface.addColumn('dealers', 'city', {
        type: Sequelize.STRING,
        defaultValue: ''
      }),
      queryInterface.addColumn('dealers', 'state', {
        type: Sequelize.STRING,
        defaultValue: ''
      }),
      queryInterface.addColumn('dealers', 'country', {
        type: Sequelize.STRING,
        defaultValue: ''
      }),
      queryInterface.addColumn('dealers', 'postal_code', {
        type: Sequelize.STRING,
        defaultValue: ''
      }),
      queryInterface.addColumn('dealers', 'tel_no', {
        type: Sequelize.STRING,
        defaultValue: ''
      }),
      queryInterface.addColumn('dealers', 'website', {
        type: Sequelize.STRING,
        defaultValue: ''
      })
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
