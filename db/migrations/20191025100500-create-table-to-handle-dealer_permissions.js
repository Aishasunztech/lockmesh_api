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
        defaultValue: null,
      },
      dealer_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      permission_type: {
        type: Sequelize.ENUM(
          'apk',
          'policy',
          'domain',
          'package'
        ),
        defaultValue: null,
      },
      permission_by: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      dealer_type: {
        type: Sequelize.ENUM(
          'admin',
          'dealer',
          'sdealer'
        ),
        defaultValue: null,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }).then(() => {
      return queryInterface.sequelize.query('ALTER TABLE `dealer_permissions`');
    }).then(() => {
      return queryInterface.addConstraint('dealer_permissions', ['permission_id', 'dealer_id', 'permission_by', 'permission_type'], {
        type: 'unique',
        name: 'unique_permission_to_dealer'
      })
    });
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
