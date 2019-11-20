'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([

            queryInterface.addColumn(
                'hardwares_data',
                'retail_price',
                {
                    type: Sequelize.INTEGER,
                    defaultValue : 0
                }
            ),
        ]);
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
