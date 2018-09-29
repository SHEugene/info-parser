const createRouter = require('express').Router;
const errors = requireApp('lib/errors');
const router = createRouter({ strict: true });

function isAuthentificated (req, res, next) {
	if (req.user) {
		return next();
	} else {
		next(errors(401));
	}
}

router.use('/tenants', require('./tenants').getRouter());
router.use('/users', require('./users').getRouter());
router.use('/languages', require('./languages').getRouter());
router.use('/reset_password', require('./reset_password').getRouter());
router.use('/invitation', require('./invitation')());
router.use(isAuthentificated);
router.use('/profile', require('./profile').getRouter());

module.exports = router;
