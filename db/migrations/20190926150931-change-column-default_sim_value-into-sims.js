'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('sims', 'unrGuest', {
      type: Sequelize.BOOLEAN,
      defaultValue: 1
    },
    ).then(()=>{
      return queryInterface.changeColumn('sims', 'unrEncrypt', {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      ).then(()=>{
        return queryInterface.changeColumn('sims', 'del', {
          type: Sequelize.ENUM(
            '0', '1'
          ),
          defaultValue: '0'
        },
        )
      })
      
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
