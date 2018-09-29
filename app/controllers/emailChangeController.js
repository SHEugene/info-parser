const Bluebird = require('bluebird');
const email = requireApp('lib/email');
const hostnameLib = requireApp('lib/hostname');
const tokenService = requireApp('services/tokenService');
const userService = requireApp('services/userService');

module.exports = {
	startChange: function (req, user, newEmail) {
		return Bluebird.join(
			tokenService.createEmailChangeToken(user.id, newEmail),
			function (token) {
				let confirmationUrl = hostnameLib.getUrl(req, '/change-email?token=' + token.token);
				req.log.info('Requested a email change from %s to %s.', user.EmailAddress.email, newEmail);
				return Bluebird.promisify(email.send, { context: email })({
					to: newEmail,
					subject: 'Please confirm your changed email address',
					message: {
						template: 'email-change',
						data: {
							user: user,
							confirmationUrl: confirmationUrl
						}
					},
					vars: {
						isRegistered: true
					}
				});
			}
		);
	},
	checkToken: function (req, res, tokenHash) {
		return tokenService.getByToken(tokenHash).then(function (token) {
			if (!token || !token._data || !token._data.userId) {
				return [];
			} else {
				return Bluebird.all([
					token,
					userService.getById(token._data.userId),
					token._data.newEmail
				]);
			}
		}).then(function (result) {
			let token = result[0];
			let user = result[1];
			let newEmail = result[2];

			if (!token || !user || !newEmail) {
				res.render('email-change/wrong_token');
				req.log.warn('Received email change token for %s but did not match any existing token.', tokenHash);
				return Bluebird.reject();
			} else {
				return [token, user, newEmail];
			}
		});
	}
};
