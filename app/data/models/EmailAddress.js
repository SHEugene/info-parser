
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('EmailAddress', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: true
			}
		},
		blocked: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		}
	}, {
		tableName: 'EmailAddress',
		classMethods: {
			associate: function (db) {
				db.EmailAddress.hasMany(db.Contact);
				db.EmailAddress.hasOne(db.User);
			}
		}
	});
};
