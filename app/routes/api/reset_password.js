const tokenService = requireApp('services/tokenService');
const userService = requireApp('services/userService');
const contactService = requireApp('services/contactService');
const routerize = requireApp('lib/routerize');
const passwordService = requireApp('lib/password');
const tenantResolver = requireApp('lib/tenantResolver');
const loginController = requireApp('controllers/loginController');
const resetPasswordController = requireApp('controllers/resetPasswordController');
const logger = requireLogger('resetPasswordController');

module.exports = routerize({
	'POST /': function * (req, res, next) {
		logger.info('Received password reset request for %s', req.body.username);
		const user = yield userService.getByEmail(req.body.username);
		if (!user) {
			logger.info('Received password reset request for %s but did not find user matching user', req.body.username);
			return res.json({ message: 'failure' });
		}
		const tenant = yield tenantResolver.getTenantFromRequest(req);
		logger.info('Received password reset request and found user with id  %s', user.id);
		yield resetPasswordController.sendResetEmailForUser(req, user, tenant);
		res.json({ message: 'success' });
	},
	'GET /choose': function (req, res, next) {
		tokenService.getByToken(req.query.token).then(function (token) {
			if (!token) {
				return [null, null];
			} else {
				return [
					token,
					userService.getById(token._data.userId),
					contactService.getById(token._data.managerId, token._data.tenantId)
				];
			}
		})
			.spread(function (token, user, contact) {
				const tenant = contact ? contact.Tenant : null;
				if (!token || !user) {
					logger.info('Received password reset token for %s but did not match any existing token.', req.query.token);
					res.json({ tenant: tenant, token: null, isValid: false });
				} else if (token && !token.isValid()) {
					logger.info('Received password reset token for %s but is expired.', req.query.token);
					res.json({ tenant: tenant, token: token, isValid: false });
				} else {
					logger.info('Received password reset token for ' + user.id + ', serving form.');
					res.json({ tenant: tenant, token: token, isValid: true });
				}
			}).catch(next);
	},
	'POST /choose': function (req, res, next) {
		tokenService.getByToken(req.body.token).then(function (token) {
			if (!token) {
				res.json({ message: 'wrong token' });
				logger.info('Received password reset token for % but did not match any existing token.', req.query.token);
				return [null, null, null];
			}
			return [
				token,
				userService.getById(token._data.userId)
			];
		}).spread(function (token, user) {
			if (token) {
				logger.info('Received password reset token + password for %s.', user.id);
				user.set({
					password: passwordService.createHash(req.body.password),
					confirmedEmail: true
				});
				user.save({ fields: ['password', 'confirmedEmail'] }).then(() => {
					return token.destroy();
				}).then(function () {
					loginController.login(req, res, next, user);
				});
			} else {
				logger.info('Received password reset token + password for %s but did not match any existing token.', req.query.token);
				res.json({ message: 'wrong token' });
			}
		}).catch(next);

	}
}, { coroutine: true });
