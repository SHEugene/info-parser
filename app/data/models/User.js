const moment = require('moment-timezone');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('User', {
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
		},
		password: DataTypes.STRING,
		location: DataTypes.STRING,
		referral: DataTypes.STRING,
		confirmedEmail: DataTypes.BOOLEAN
	}, {
		tableName: 'User',
		instanceMethods: {
			getName: function () {
				return this.firstName + ' ' + this.lastName;
			}
		},
		classMethods: {
			associate: function (db) {
				db.User.belongsTo(db.Language);
				db.User.belongsTo(db.EmailAddress);
				db.User.belongsToMany(db.Role, { through: db.UserRole });
				db.User.hasMany(db.UserRole);
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
