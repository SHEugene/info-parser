const createRouter = require('express').Router;
const coWrap = require('wrap-generator-route');

/**
 * Add a method `getRouter` to the module to extract an Express Router from the plain object
 * Supported are:
 * - the basic HTTP methods `GET`, `POST`, `HEAD`, `PUT`, `DELETE`.
 * - `USE` which will register middlewares (ie: `USE: [(req) => console.log(req.method)]`)
 * - `PARAM :<param>` which will register the parameter (ie: `'PARAM :userID': function (req, res, next) { ... }`)
 * @param  {Object} module              The module with routes in the format `GET /`, `POST /user/:userId/` etc.
 * @param  {Object} options             Options object
 * @param  {Boolean} options.coroutine  If true, the routes will be wrapped with coroutine and support generators inside
 * @return {Objet}                      The module but with added `getRouter` method
 */
function routerize (module, options) {
	module.getRouter = getRouter.bind(module, options);
	return module;
}

const AVAILABLE_METHODS = ['get', 'post', 'head', 'put', 'delete'];

/**
 * Creates an Express Router from a plain object
 * @param  {Object} options  Options from routerize call
 * @return {Express.Router}  The resulting router
 */
function getRouter (options) {
	options = options || {};
	const router = createRouter({ strict: true });

	Object.keys(this).forEach((key) => {
		const parts = key.split(' ');
		const method = parts[0].toLowerCase();
		const url = parts[1];
		let middlewares;
		const getFunc = (func) => options.coroutine ? coWrap(func) : func;

		if (AVAILABLE_METHODS.indexOf(method) !== -1) {
			router[method](url, getFunc(this[key]));
		} else if (method === 'use') {
			middlewares = this[key];
			middlewares.forEach(function (middleware) {
				router.use(getFunc(middleware));
			});
		} else if (method === 'param') {
			router['param'](url.replace(':', ''), getFunc(this[key]));
		}
	});
	return router;
}

module.exports = routerize;
