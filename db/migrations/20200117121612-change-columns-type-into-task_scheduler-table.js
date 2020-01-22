'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('task_schedules', 'id', {
        type: Sequelize.BIGINT,
        autoIncrement: true
      }),
      queryInterface.changeColumn('task_schedules', 'title', {
        type: Sequelize.TEXT,
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
