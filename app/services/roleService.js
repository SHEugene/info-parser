const Bluebird = require('bluebird');
const Role = requireApp('data/models').Role;
const Permission = requireApp('data/models').Permission;
const UserRole = requireApp('data/models').UserRole;
const Tenant = requireApp('data/models').Tenant;

const permissionEnum = {
	MANAGE : 1,
	MANAGE_OF_TENANT : 2,
	USING_OF_TENANT : 3
};

const roleService = {
	createRole: (data) => {
		return Role.create(data);
	},
	getRole: (name, tenantId) => {
		return Role.findOne({
			where: {
				name: name,
				TenantId: tenantId
			}
		});
	},
	getPermissionById: (id) => {
		return Permission.find({
			where: {id: id}
		});
	},
	createRoleAdminOfTenant: (tenantId) => {
		return Bluebird.join(
			roleService.getPermissionById(permissionEnum.MANAGE_OF_TENANT),
			roleService.createRole({
				name: 'adminOfTenant',
				TenantId: tenantId
			}),
			(permission, role) => {
				role.addPermission(permission);
				return role;
			});
	},
	createRoleClientOfTenant: (tenantId) => {
		return Bluebird.join(
			roleService.getPermissionById(permissionEnum.USING_OF_TENANT),
			roleService.createRole({
				name: 'clientOfTenant',
				TenantId: tenantId
			}),
			(permission, role) => {
				role.addPermission(permission);
				return role;
			});
	},
	addAdminOfTenant: (user, tenantId) => {
		return Bluebird.all([
			user,
			roleService.createRoleAdminOfTenant(tenantId),
			roleService.createRoleClientOfTenant(tenantId),
		]).spread((user, roleAdmin, roleClient) => {
			return Bluebird.all([
				user.addRole(roleAdmin),
				user.addRole(roleClient)
			]);
		});
	},
	addClientOfTenant: (user, tenantId) => {
		return Bluebird.all([
			user,
			roleService.getRole('clientOfTenant', tenantId),
		]).spread((user, role) => {
			return user.addRole(role);
		});
	},
	getRoleForUser: (userId) => {
		return Role.findAll({
			include: [
				{
					model: UserRole,
					where: {
						UserId: userId
					}
				}, Tenant
			]
		});
	}
};

module.exports = roleService;
