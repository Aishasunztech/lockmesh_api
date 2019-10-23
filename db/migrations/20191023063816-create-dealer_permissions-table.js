'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('dealer_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dealer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      permission_type: {
        type: Sequelize.ENUM,
        values: ['apk','policy', 'domain'],
        allowNull: false
      },
      permission_by: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }).then(function(){
      return queryInterface.addConstraint('dealer_permissions', ['permission_id', 'dealer_id', 'permission_type'], {
        type: 'unique',
        name: 'unique_permission_id_dealer_id_permission_type'
      })
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
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
