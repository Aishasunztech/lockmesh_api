'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      // queryInterface.renameColumn('device_history', 'status', 'status1'),
      queryInterface.addColumn('device_history', 'status',
      {
        type: Sequelize.ENUM(
          'pending', 
          'in_queue_process', 
          'sent_to_device',
          'completed_successfully',
          'completed_unsuccessful', 
          'rejected_by_user', 
          'reject_by_system',
        ),
        defaultValue: 'pending'
      },
    )

    ])
    
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
