const createRouter = require('express').Router;
const router = createRouter({ strict: true });

module.exports = function (passport) {
	require('./base')(router, passport);

	return router;
};
