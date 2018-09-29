const Bluebird = require('bluebird');
const User = requireApp('data/models').User;
const UserRole = requireApp('data/models').UserRole;
const Role = requireApp('data/models').Role;
const RolePermission = requireApp('data/models').RolePermission;
const Permission = requireApp('data/models').Permission;
const EmailAddress = requireApp('data/models').EmailAddress;
const emailAddressService = requireApp('services/emailAddressService');
const roleService = requireApp('services/roleService');

module.exports = {
	getById: function (id) {
		return Bluebird.join(
			User.find({
				where: { id: id },
				include: [
					EmailAddress
				]
			}),
			roleService.getRoleForUser(id),
			(user, roles) => {
				user.roles = roles;
				user.dataValues.roles = roles;
				return user;
			});
	},
	create: function (data) {
		return emailAddressService.getByEmail(data.email).then((emailAddress) => {
			data.EmailAddressId = emailAddress.id;
			return User.create(data);
		});
	},
	getWithRoles: function (id) {
		return Bluebird.join(
			User.find({
				where: { id: id },
				include: [
					EmailAddress
				]
			}),
			roleService.getRoleForUser(id),
			(user, roles) => {
				user.roles = roles;
				user.dataValues.roles = roles;
				return user;
			});
	},
	getByEmail: function (email) {
		return User.find({
			include: [
				{
					model: EmailAddress,
					where: { email: email }
				}
			]
		});
	},
	getAll: function () {
		return User.findAll();
	},
	getForTenant: (tenantId) => {
		return User.findAll({
			include: [
				{
					model: EmailAddress
				}, {
					model: UserRole,
					include: [
						{
							model: Role,
							where: {
								TenantId: tenantId
							},
							include: [
								{
									model: RolePermission,
									include: [Permission]
								}
							]
						}
					]
				}
			]
		});
	}
};
