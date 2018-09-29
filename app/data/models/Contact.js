const moment = require('moment-timezone');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Contact', {
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	}, {
		tableName: 'Contact',
		instanceMethods: {
			getName: function () {
				return this.firstName + ' ' + this.lastName;
			}
		},
		classMethods: {
			associate: function (db) {
				db.Contact.belongsTo(db.EmailAddress);
				db.Contact.belongsTo(db.Tenant);
				db.Contact.belongsTo(db.User);
			}
		},
		getterMethods: {
			createdAtRendered: function () {
				const createdAt = moment(this.createdAt).tz('Europe/Berlin');
				return createdAt.format('L') + ' ' + createdAt.format('LT');
			},
			fullName: function () {
				return `${this.firstName} ${this.lastName}`;
			}
		}
	});
};
