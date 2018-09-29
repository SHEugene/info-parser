const Bluebird = require('bluebird');
const tokenService = requireApp('services/tokenService');
const userService = requireApp('services/userService');
const contactService = requireApp('services/contactService');

module.exports = {
	checkConfirmationToken: function (req, res, tokenHash) {
		return tokenService.getByToken(tokenHash).then(function (token) {
			if (!token || !token._data || !token._data.userId) {
				return [];
			} else {
				return Bluebird.all([token, userService.getById(token._data.userId)]);
			}
		})
		.then(function (result) {
			const token = result[0];
			const user = result[1];
			if (!token || !user) {
				res.render('email-confirmation/wrong_token');
				req.log.warn('Received email confirmation token for %s but did not match any existing token.', req.query.token);
				return Bluebird.reject();
			} else {
				return [token, user];
			}
		});
	},
	checkInvitationToken: function (req, res, tokenHash) {
		return tokenService.getByToken(tokenHash).then(function (token) {
			if (!token || !token._data || !token._data.contactId) {
				return [];
			} else {
				return Bluebird.all([token, contactService.getById(token._data.contactId)]);
			}
		}).then(function (result) {
				const token = result[0];
				const contact = result[1];
				if (!token || !contact) {
					res.render('invitation/wrong_token');
					req.log.warn('Received invitation token for %s but did not match any existing token.', req.query.token);
					return Bluebird.reject();
				} else {
					return [token, contact];
				}
			});
	}
};
