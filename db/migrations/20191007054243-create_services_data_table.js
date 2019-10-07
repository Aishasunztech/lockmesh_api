'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('services_data', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_acc_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dealer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      packages: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "[]"
      },
      products: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "[]"
      },
      total_credits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      paid_credits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      start_date: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      end_date: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      service_expiry_date: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      del_status: {
        type: Sequelize.INTEGER,
        allowNull: false
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
