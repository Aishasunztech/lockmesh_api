'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sim_data_plans',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        service_id: {
          type: Sequelize.STRING,
        },
        data_plan_package: {
          type: Sequelize.TEXT
        },
        pkg_price: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        sim_type: {
          type: Sequelize.ENUM,
          values: ['sim_id', 'sim_id2'],
          allowNull: false,
        },
        total_data: {
          type: Sequelize.STRING,
        },
        used_data: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '0'
        },
        start_date: {
          type: Sequelize.STRING,
          allowNull: false
        },
        end_date: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.ENUM,
          values: ['active', 'deleted'],
          defaultValue: 'active',
          allowNull: false,
        },
        created_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        }
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
