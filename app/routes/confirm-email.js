const createRouter = require('express').Router;
const tokenController = requireApp('controllers/tokenController');
const loginController = requireApp('controllers/loginController');
const userService = requireApp('services/userService');

module.exports = function (passport) {
	const router = createRouter({ strict: true });

	router.get('/', function (req, res, next) {
		const token = req.query.token;
		tokenController.checkConfirmationToken(req, res, token).spread(function (token, user) {
			user.set({ confirmedEmail: true }).save({ fields: ['confirmedEmail'] }).then(function () {
				return token.destroy();
			}).then(function () {
				req.login(user, function () {
					loginController.login(req, res, next, user);
				});
			});
		}).catch(next);
	});

	return router;
};
