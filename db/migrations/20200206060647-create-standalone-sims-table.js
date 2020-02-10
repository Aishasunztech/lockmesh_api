'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('standalone_sims',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        sim_id: {
          type: Sequelize.STRING,
          allowNull: false
        },
        iccid: {
          type: Sequelize.STRING,
          allowNull: false
        },
        dealer_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        dealer_type: {
          type: Sequelize.ENUM,
          values: ['dealer', 'sdealer'],
          defaultValue: 'dealer',
          allowNull: false
        },
        package_data: {
          type: Sequelize.TEXT,
        },
        sale_price: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        admin_cost: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        dealer_cost: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        term: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        end_date: {
          type: Sequelize.DATE,
        },
        status: {
          type: Sequelize.ENUM,
          values: ['returned', 'cancelled', 'completed', 'deleted', 'active'],
          allowNull: false,
          defaultValue: 'active'
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
