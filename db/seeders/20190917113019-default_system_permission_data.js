'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('default_system_permissions', [
      {
        setting_name: 'Wifi',
        setting_status: false
      },
      {
        setting_name: 'Bluetooth',
        setting_status: false
      },
      {
        setting_name: 'Bluetooth File Sharing',
        setting_status: false
      },
      {
        setting_name: 'Hotspot Configuration',
        setting_status: false
      },
      {
        setting_name: 'Screen Capture',
        setting_status: false
      },
      {
        setting_name: 'Block Calls',
        setting_status: false
      },
      {
        setting_name: 'Camera',
        setting_status: false
      },
      {
        setting_name: 'Microphone',
        setting_status: false
      },
      {
        setting_name: 'Speaker',
        setting_status: false
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
