'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('dealer_agents', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			staff_id: {
				type: Sequelize.STRING,
			},
			dealer_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			dealer_type: {
				type: Sequelize.ENUM,
				values: ['admin', 'dealer', 'sdealer'],
				defaultValue: 'dealer'
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			type: {
				type: Sequelize.ENUM,
				values: ['staff', 'admin'],
				defaultValue: 'staff',
				allowNull: false,
			},
			status: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			delete_status: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			created_at: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
			}
		})
		// .then(function () {
		// 	// return queryInterface.sequelize.query(
		// 	// 	'ALTER TABLE `policy_apps` ADD UNIQUE `unique_index`(`policy_id`, `apk_id`)'
		// 	// );
		// });
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('policy_apps');
	}
};
