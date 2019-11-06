'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('secure_market_apps', ['apk_id', 'dealer_id', 'space_type'], {
      type: 'unique',
      name: 'unique_apkId_dealerId_spaceType'
    })
      .then(() => {
        return queryInterface.removeIndex('secure_market_apps', 'apk_id')
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
