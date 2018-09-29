module.exports = function (sequelize, DataTypes) {
	return sequelize.define('UserRole', {}, {
		tableName: 'UserRole',
		classMethods: {
			associate: function (db) {
				db.UserRole.belongsTo(db.User);
				db.UserRole.belongsTo(db.Role);
			}
		}
	});
};
