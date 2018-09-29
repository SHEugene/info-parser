module.exports = function (sequelize, DataTypes) {
	return sequelize.define('RolePermission', {}, {
		tableName: 'RolePermission',
		classMethods: {
			associate: function (db) {
				db.RolePermission.belongsTo(db.Role);
				db.RolePermission.belongsTo(db.Permission);
			}
		}
	});
};
