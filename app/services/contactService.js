const Contact = requireApp('data/models').Contact;
const EmailAddress = requireApp('data/models').EmailAddress;
const emailAddressService = requireApp('services/emailAddressService');

module.exports = {
	getById: (id) => {
		return Contact.find({
			where: { id: id },
			include: [
				EmailAddress
			]
		});
	},
	create: (data) => {
		return emailAddressService.getByEmail(data.email).then((emailAddress) => {
			data.EmailAddressId = emailAddress.id;
			return Contact.create(data);
		});
	},
	getAll: () => {
		return Contact.findAll();
	},
	getForTenant: (tenantId) => {
		return Contact.findAll({
			include: [
				{
					model: EmailAddress
				}
			],
			where: {
				tenantId: tenantId
			}
		});
	}
};
