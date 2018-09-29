module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Role', {
		name: DataTypes.STRING,
		description: DataTypes.STRING
	}, {
		tableName: 'Role',
		classMethods: {
			associate: function (db) {
				db.Role.belongsTo(db.Tenant, { foreignKey: { allowNull: true } });
				db.Role.belongsToMany(db.User, { through: db.UserRole });
				db.Role.hasOne(db.UserRole);
				db.Role.belongsToMany(db.Permission, { through: db.RolePermission });
				db.Role.hasMany(db.RolePermission);
			}
		}
	});
};
