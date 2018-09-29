const Bluebird = require('bluebird');
const _ = require('lodash');
const config = require('config');
const routerize = requireApp('lib/routerize');
const password = requireApp('lib/password');
const email = requireApp('lib/email');
const hostnameLib = requireApp('lib/hostname');
const userService = requireApp('services/userService');
const tenantService = requireApp('services/tenantService');
const tokenService = requireApp('services/tokenService');
const roleService = requireApp('services/roleService');

module.exports = routerize({
	'GET /': function (req, res, next) {
		return userService.getAll().then(function (users) {
			res.json(users);
		});
	},
	'getUserInfo': function (userId, req) {
		return Bluebird.join(
			userService.getWithRoles(userId),
			function (user) {
				return {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					fullName: user.lastName + ' ' + user.firstName,
					email: user.EmailAddress.email,
					isSysAdmin: user.isSysAdmin,
					roles: _.map(user.roles, (role) => {
						return {
							name: role.name,
							tenantId: role.Tenant && role.Tenant.id,
							tenantName: role.Tenant && role.Tenant.name
						};
					})
				};
			}
		);
	},
	'createUser': function (req, res, next) {
		if (!password.isSecurePassword(req.body.password)) {
			res.status(422);
			return res.json({ status: 'password length incorrect', message: req.i18n.__('validation.password_length') });
		}
		return userService.getByEmail(req.body.email).then((user) => {
			if (user) {
				res.status(409);
				return res.json({ status: 'duplication of user email', message: req.i18n.__('validation.duplication_of_user_email') });
			} else {
				req.body.password = password.createHash(req.body.password);
				const stabTenant = {
					name: `Tenant of ${req.body.firstName} ${req.body.lastName}`
				};
				return Bluebird.all([
					userService.create(req.body),
					tenantService.create(stabTenant)
				]).spread((user, tenant) => {
					return Bluebird.all([
						tokenService.createEmailConfirmationToken(user.id),
						roleService.addAdminOfTenant(user, tenant.id)
					]).spread((token) => {
						const confirmUrl = hostnameLib.getUrl(req, '/confirmation?token=' + token.token);
						const confirmLink = '<a href="' + confirmUrl + '">' + req.i18n.__('confirm_email') + '</a>';
						email.send({
							req: req,
							to: req.body.email,
							message: {
								template: 'confirm-email',
								data: {
									siteName: config.get('site.name'),
									fullName: user.getName(),
									confirmLink: confirmLink
								}
							}
						});
						return res.json({message: 'success'});
					});
				});
			}
		}).catch(next);
	}
});
