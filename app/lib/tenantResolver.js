const tenantService = requireApp('services/tenantService');
const tokenService = requireApp('services/tokenService');
const co = require('co');

module.exports = {
	getTenantFromRequest: co.wrap(function * (req) {
		const tenant = yield tenantService.getTenantForDomain(req.hostname);
		if (tenant) return tenant;
		const tenantIdFromQuery = req.query.t;
		const tenantIdFromCookie = req.cookies['last_account'];
		let tenantIdFromInviteCode;
		if (!tenantIdFromQuery && !tenantIdFromCookie) {
			const token = yield tokenService.getByToken(req.query.token);
			if (token && token._data) {
				tenantIdFromInviteCode = token._data.tenantId;
			}
		}
		return tenantService.getById(tenantIdFromQuery || tenantIdFromInviteCode || tenantIdFromCookie);
	})
};
