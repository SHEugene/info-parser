const createRouter = require('express').Router;
const router = createRouter({ strict: true });

module.exports = function (passport) {
	require('./base')(router, passport);

	router.use('/api/v1', require('./api/index'));

	router.use('/confirmation', require('./confirm-email')(passport));
	router.use('/change-email', require('./change-email')(passport));

	return router;
};
