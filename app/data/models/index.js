const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfig = require('config').get('database');


const db = {};
const enableBenchmark = 'BENCHMARK_SQL' in process.env ? process.env.BENCHMARK_SQL : process.env.NODE_ENV === 'development';
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
	dialect: 'mysql',
	dialectOptions: {
		multipleStatements: true
	},
	host: dbConfig.host,
	port: dbConfig.port,
	benchmark: enableBenchmark,
	logging: function (sqlStatement, time) {
		var info = { sql: sqlStatement };
		if (enableBenchmark) {
			info.executionTime = time;
		}

	}
});

fs
.readdirSync(__dirname)
.filter(function (file) {
	return (file.indexOf('.') !== 0) && (file !== 'index.js');
})
.forEach(function (file) {
	var model = sequelize.import(path.join(__dirname, file));
	db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

if (process.env.NODE_ENV !== 'test') {
	sequelize
	.authenticate()
	.then(function () {

	}).catch(function (err) {

	});
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
