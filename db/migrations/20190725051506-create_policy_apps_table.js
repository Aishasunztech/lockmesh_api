'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('policy_apps', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			policy_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			apk_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			created_at: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
			},
		});
	},

	down: (queryInterface, Sequelize) => {

		return queryInterface.dropTable('policy_apps');

	}
};
