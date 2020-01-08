'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('task_schedules', 'status', {
        type: Sequelize.ENUM,
        values: ['NEW', 'SUCCESS', 'FAILED', 'IN-PROCESS', 'COMPLETE'],
        defaultValue: 'NEW'
      }),
      queryInterface.addColumn('task_schedules', 'start_time', {
        type: Sequelize.STRING,
        defaultValue: null
      }),
      queryInterface.removeColumn('task_schedules', 'sorting_order'),
      queryInterface.removeColumn('task_schedules', 'delete_status'),
      queryInterface.removeColumn('task_schedules', 'date_time')
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
