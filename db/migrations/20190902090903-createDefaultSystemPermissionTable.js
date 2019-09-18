'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('default_system_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      setting_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      setting_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }).then(function () {
      return queryInterface.sequelize.query(
        'ALTER TABLE `default_system_permissions` ADD UNIQUE `unique_index`(`setting_name`)'
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('default_system_permissions');
  }
};
