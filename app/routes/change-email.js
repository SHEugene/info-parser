const createRouter = require('express').Router;
const emailChangeController = requireApp('controllers/emailChangeController');
const emailAddressService = requireApp('services/emailAddressService');

module.exports = function () {
	const router = createRouter({ strict: true });

	router.get('/', function (req, res, next) {
		const token = req.query.token;
		emailChangeController.checkToken(req, res, token).spread(function (token, user, newEmail) {
			return emailAddressService.create(newEmail).then((emailAddress) => {
				const oldEmailAddress = user.EmailAddress;
				return user.set({
					EmailAddressId: emailAddress.id
				}).save().then(() => {
					return [token, oldEmailAddress.destroy()];
				});
			});
		}).spread(function (token) {
			return [token.destroy()];
		}).spread(function () {
			res.render('email-change/done', {tenant: {}});
		}).catch(next);
	});

	return router;
};
