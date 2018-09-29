const Bluebird = require('bluebird');
const userService = requireApp('services/userService');
const passwordService = requireApp('lib/password');
const errors = requireApp('lib/errors');
const routerize = requireApp('lib/routerize');
const emailChangeController = requireApp('controllers/emailChangeController');

module.exports = routerize({
	'POST /password': function (req, res, next) {
		const oldPassword = req.body.oldPassword;
		const newPassword = req.body.newPassword;
		return userService.getById(req.user.id).then(function (user) {
			if (!passwordService.isValidPassword(user, oldPassword)) {
				return Bluebird.reject(errors(req.i18n.__('validation.password_check_current')));
			} else {
				user.password = passwordService.createHash(newPassword);
				return user.save({ fields: ['password'] });
			}
		}).then(function (contact) {
			res.json(contact);
		}).catch(next);
	},
	'POST /email': function (req, res, next) {
		let changedEmail;
		const newEmail = req.body.newEmail;
		return userService.getById(req.user.id).then(function (user) {
			changedEmail = user.EmailAddress.email !== newEmail;
			delete req.body.newEmail;
			return [user, userService.getByEmail(newEmail)];
		}).spread(function (user, userWithNewEmail) {
			if (changedEmail && userWithNewEmail) {
				return Bluebird.reject(errors(req.i18n.__('validation.email_already_used')));
			} else if (!changedEmail) {
				return Bluebird.reject(errors(req.i18n.__('validation.email_already_used')));
			} else {
				emailChangeController.startChange(req, user, newEmail);
				res.json({
					message: req.i18n.__('profile.email_change_check_emails', newEmail)
				});
			}
		}).catch(next);
	}
}, { coroutine: true });
