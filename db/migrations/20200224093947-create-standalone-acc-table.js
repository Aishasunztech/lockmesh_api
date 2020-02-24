'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('standalone_sim_acc',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        standalone_sim_id: {
          type: Sequelize.STRING,
          allowNull: false
        },
        dealer_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          defaultValue: ''
        },
        email: {
          type: Sequelize.STRING,
          defaultValue: ''
        },
        note: {
          type: Sequelize.STRING,
          defaultValue: ''
        },
        term: {
          type: Sequelize.INTEGER,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        expiry_date: {
          type: Sequelize.DATE,
        },
        delete_status: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 0
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
