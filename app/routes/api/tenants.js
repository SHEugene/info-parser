const tenantService = requireApp('services/tenantService');
const userService = requireApp('services/userService');
const contactService = requireApp('services/contactService');
const contactController = requireApp('controllers/contactController');
const routerize = requireApp('lib/routerize');

module.exports = routerize({
	'GET /': function (req, res, next) {
		return tenantService.getAll().then(function (tenants) {
			res.json(tenants);
		}).catch(next);
	},
	'GET /:tenantId/users': function (req, res, next) {
		return userService.getForTenant(req.params.tenantId).then(function (users) {
			res.json(users);
		}).catch(next);
	},
	'GET /:tenantId/contacts': function (req, res, next) {
		return contactService.getForTenant(req.params.tenantId).then((contacts) => {
			res.json(contacts);
		}).catch(next);
	},
	'POST /:tenantId/contacts': function (req, res, next) {
		const stubContact = req.body;
		stubContact.TenantId = req.params.tenantId;
		return contactController.create(req, stubContact).then((newContact) => {
			res.json({status: 'success'});
		}).catch(next);
	}
});
