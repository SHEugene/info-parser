module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Permission', {
		name: DataTypes.STRING,
		to: DataTypes.STRING
	}, {
		tableName: 'Permission',
		classMethods: {
			associate: function (db) {
				db.Permission.belongsToMany(db.Role, { through: db.RolePermission });
			}
		}
	});
};
