const EmailAddress = requireApp('data/models').EmailAddress;

const emailAddressService = {
	create: function (email) {
		return EmailAddress.create({
			email: email,
			blocked: false
		});
	},
	getByEmail: function (email) {
		return EmailAddress.findOrCreate({
			where: { email: email },
			defaults: {
				email: email,
				blocked: false
			}
		}).spread(function (instance) {
			return instance;
		});
	}
};

module.exports = emailAddressService;
