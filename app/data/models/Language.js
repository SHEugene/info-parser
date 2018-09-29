module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Language', {
		code: DataTypes.STRING(10),
		name: DataTypes.STRING
	}, {
		tableName: 'Language',
		classMethods: {
			associate: function (db) {
				db.Language.hasMany(db.User);
			}
		}
	});
};
