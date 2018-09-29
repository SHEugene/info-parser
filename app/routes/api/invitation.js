const createRouter = require('express').Router;
const tokenController = requireApp('controllers/tokenController');
const loginController = requireApp('controllers/loginController');
const userService = requireApp('services/userService');

module.exports = function () {
	const router = createRouter({ strict: true });

	router.get('/', function (req, res, next) {
		const token = req.query.token;
		tokenController.checkInvitationToken(req, res, token).spread(function (token, contact) {
			res.json({
				tokenString: token.token,
				contact: {
					firstName: contact.firstName,
					lastName: contact.lastName,
					email: contact.EmailAddress.email
				}
			});
		}).catch(next);
	});

	return router;
};
