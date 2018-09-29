const Tenant = requireApp('data/models').Tenant;

module.exports = {
	getById: (id) => {
		return Tenant.findOne({
			where: { id: id }
		});
	},
	getAll: () => {
		return Tenant.findAll();
	},
	create: (data) => {
		return Tenant.create(data);
	},
	getTenantForDomain: function (domain) {
		return Promise.resolve(null);
		/*return Tenant.find({
			where: {
				hostMapping: domain
			}
		});*/
	}
};
