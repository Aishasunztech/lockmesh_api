'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('device_attributes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      device_id: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      value: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      delete_status: {
        type: Sequelize.ENUM(
          '0', '1'
        ),
        defaultValue: '0',
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
        'ALTER TABLE `device_attributes`'
      );
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
