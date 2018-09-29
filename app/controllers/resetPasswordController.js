const tokenService = requireApp('services/tokenService');
const hostnameLib = requireApp('lib/hostname');
const email = requireApp('lib/email');

module.exports = {
	sendResetEmailForUser: function (req, user, tenant) {
		return tokenService
			.createResetToken(user)
			.then(token => {
				return sendEmail(req, user, token, tenant);
			});
	}
};

function createResetLink (req, token) {
	return hostnameLib.getUrl(req, '/reset_password/choose?token=' + token);
}

function sendEmail (req, user, token, tenant) {
	const resetUrl = createResetLink(req, token);
	return email.send({
		req: req,
		to: user.EmailAddress.email,
		subject: 'Оновлення паролю',
		tenant: tenant,
		message: {
			template: 'reset_password',
			data: {
				user: user,
				token: token,
				resetUrl: resetUrl
			}
		}
	});
}
