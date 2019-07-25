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
			guest: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			encrypted: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			enable: {
				type: Sequelize.BOOLEAN,
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
		}).then(function () {
			return queryInterface.sequelize.query(
				'ALTER TABLE `policy_apps` ADD UNIQUE `unique_index`(`policy_id`, `apk_id`)'
			);
		});
	},

	down: (queryInterface, Sequelize) => {

		return queryInterface.dropTable('policy_apps');

	}
};
