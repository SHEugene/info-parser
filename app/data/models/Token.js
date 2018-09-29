const moment = require('moment-timezone');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Token', {
		token: {
			type: DataTypes.STRING,
			unique: true
		},
		expiresAt: DataTypes.DATE,
		type: DataTypes.TEXT,
		data: DataTypes.TEXT
	}, {
		tableName: 'Token',
		classMethods: {
			associate: function (db) {}
		},
		instanceMethods: {
			isValid: function () {
				return moment(this.expiresAt).isAfter(moment());
			}
		},
		getterMethods: {
			_data: function () {
				return JSON.parse(this.data);
			},
			expiresAtRendered: function () {
				var expiresAt = moment(this.expiresAt).tz('Europe/Berlin');
				return expiresAt.format('L');
			},
			createdAtRendered: function () {
				var createdAt = moment(this.createdAt).tz('Europe/Berlin');
				return createdAt.format('L');
			}
		},
		setterMethods: {
			_data: function (v) {
				this.data = JSON.stringify(v);
			}
		}
	});
};
