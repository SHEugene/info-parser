const url = require('url');
const config = require('config');

module.exports = {
	getUrl: function getUrl (req, urlPath) {
		if (!req.hostname) { throw new Error('req.hostname not defined'); }
		if (!req.protocol) { throw new Error('req.protocol not defined'); }
		let result = req.protocol + '://' + req.hostname;
		// no port here, because we do not know at which port this instance runs
		// (there is nginx in front of node, which has the public port)
		if (urlPath) {
			result = url.resolve(result, urlPath);
		}
		return result;
	},
	/**
	 * Get the full url for a specific tenant. Depending on the hostMapping the correct domain
	 * for the tenant is included.
	 * @param  {Tenant} tenant
	 * @param  {String} urlPath the path to include in the URL. I.e. `/tentants/1`
	 * @return {String}         the complete URI
	 */
	getTenantUrl: function getTenantUrl (tenant, urlPath) {
		if (!urlPath) { urlPath = ''; }
		if (!tenant.hostMapping) {
			return url.resolve(config.get('defaultAddress.url'), urlPath);
		} else {
			const address = config.get('defaultAddress.protocol') + '://' + tenant.hostMapping;
			return url.resolve(address, urlPath);
		}
	},
	/**
	 * Get a link for the default host, does not take host mapping into account.
	 * @param  {String} urlPath  Example: `/tenants/1`
	 * @return {String}          Example: `https://mycasavi.com/tenants/1`
	 */
	getDefaultUrl: function (urlPath) {
		if (!urlPath) { urlPath = ''; }
		return url.resolve(config.get('defaultAddress.url'), urlPath);
	}
};
