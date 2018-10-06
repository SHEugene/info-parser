global.requireApp = function (path) {
	return require('../app/' + path);
};

var models = requireApp('data/models');

// Error on direct access to mysql (last catch)
models.sequelize.connectionManager.dialect.Query.prototype.run = function (query) {
	throw new Error('Access to Database is denied in unit tests (' + query + ')');
};

// Error when accessing a sequelize model (we do not want db access in unit tests)
// Error here b/c this way we can show where exactly the error comes from
Object.keys(models).forEach(function (modelName) {
	var model = models[modelName];
	if (model.findAll) {
		stub(modelName, model, 'all');
		stub(modelName, model, 'find');
		stub(modelName, model, 'findAll');
		stub(modelName, model, 'findById');
		stub(modelName, model, 'create');
		stub(modelName, model, 'update');
		stub(modelName, model, 'count');
		stub(modelName, model.Instance.prototype, 'save');
		stub(modelName, model.Instance.prototype, 'update');
	}
});

function stub (modelName, object, funcName) {
	object[funcName] = function () {
		throw new Error('Access to Database is denied in unit tests (' + modelName + '.' + funcName + ')');
	};
}