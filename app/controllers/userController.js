const Bluebird = require('bluebird');
const password = requireApp('lib/password');
const userService = requireApp('services/userService');
const tokenService = requireApp('services/tokenService');
const contactService = requireApp('services/contactService');
const roleService = requireApp('services/roleService');

module.exports = {
	create: function (req, res) {
		if (!password.isSecurePassword(req.body.password)) {
			res.status(422);
			return res.json({ status: 'password length incorrect', message: req.i18n.__('validation.password_length') });
		}
		return userService.getByEmail(req.body.email).then((user) => {
			if (user) {
				res.status(409);
				return res.json({ status: 'password length incorrect', message: req.i18n.__('validation.password_length') });
			} else {
				const stubUser = req.body;
				stubUser.password = password.createHash(req.body.password);
				stubUser.confirmedEmail = true;
				return Bluebird.join(
					userService.create(stubUser),
					tokenService.getByToken(stubUser.tokenString),
					(newUser, token) => {
						return Bluebird.join(
							contactService.getById(token._data.contactId),
							roleService.addClientOfTenant(newUser, token._data.tenantId),
							(contact) => {
								contact.destroy();
								token.destroy();
								return newUser;
							});
					});
			}
		});
	}
};
