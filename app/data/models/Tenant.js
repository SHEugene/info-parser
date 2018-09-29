const moment = require('moment-timezone');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Tenant', {
		name: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		}
	}, {
		tableName: 'Tenant',
		classMethods: {
			associate: function (db) {
				db.Tenant.hasMany(db.Contact);
			}
		},
		getterMethods: {
			createdAtRendered: function () {
				const createdAt = moment(this.createdAt).tz('Europe/Berlin');
				return createdAt.format('L') + ' ' + createdAt.format('LT');
			}
		}
	});
};
