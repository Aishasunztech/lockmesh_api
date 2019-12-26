'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('task_schedules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      device_id: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: ''
      },

      interval_status: {
        type: Sequelize.ENUM,
        values: ['NOW', 'DATE/TIME', 'REPEAT'],
        defaultValue: null
      },
      interval_time: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      interval_description: {
        type: Sequelize.ENUM,
        values: ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', '3 MONTH', '6 MONTHS', '12 MONTHS'],
        defaultValue: 'NONE'
      },
      next_schedule: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      last_execution_time: {
        type: Sequelize.STRING,
        defaultValue: null
      },

      sorting_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      date_time: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      week_day: { // saturday
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      month_day: { // 1 - 31  (day of month)
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      month_name: { // 1 - 12
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      delete_status: { // when no more iteration is remaining
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      action_by: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },

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
