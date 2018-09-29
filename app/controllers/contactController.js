const config = require('config');
const contactService = requireApp('services/contactService');
const email = requireApp('lib/email');
const hostnameLib = requireApp('lib/hostname');
const tokenService = requireApp('services/tokenService');

module.exports = {
	create: function (req, stubContact) {
		return contactService.create(stubContact).then((newContact) => {
			return tokenService.createInvitationToken(newContact.id, newContact.TenantId).then((token) => {
				const inviteUrl = hostnameLib.getUrl(req, '/invite?token=' + token.token);
				const inviteLink = '<a href="' + inviteUrl + '">' + req.i18n.__('invite_email') + '</a>';
				email.send({
					req: req,
					to: stubContact.email,
					message: {
						template: 'invite-email',
						data: {
							siteName: config.get('site.name'),
							fullName: newContact.getName(),
							inviteLink: inviteLink
						}
					}
				});
				return newContact;
			});
		});
	}
};
