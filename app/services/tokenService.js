const logger = requireLogger('tokenService');
const Token = requireApp('data/models').Token;
const moment = require('moment-timezone');
const crypto = require('crypto');

const tokenService = {
	getByToken: function (token, type) {
		token = token ? token.replace(/[^0-9a-zA-Z]/g, '') : null;
		const whereQuery = { token: token };
		if (type) {
			whereQuery.type = type;
		}
		return Token.find({
			where: whereQuery
		});
	},
	createInvitationToken: function (contactId, tenantId) {
		const token = generateToken();
		const secret = generateToken();
		return Token.create({
			token: token,
			type: 'invite',
			expiresAt: moment().add(3, 'month').toDate(),
			_data: { contactId: toId(contactId), tenantId: toId(tenantId), secret: secret },
			search: 'T:' + tenantId + '-C:' + contactId
		}).then(function (token) {
			logger.info('Created invite token %s for contact %s.', token.token, contactId);
			return token;
		});
	},
	createEmailChangeToken: function (userId, newEmail) {
		const token = generateLongToken();
		return Token.create({
			token: token,
			type: 'email-change',
			expiresAt: moment().add(7, 'day').toDate(),
			_data: { userId: toId(userId), newEmail: newEmail }
		}).then(function (token) {
			logger.info('Created email change token %s for user %s.', token.token, userId);
			return token;
		});
	},
	createEmailConfirmationToken: function (userId) {
		const token = generateLongToken();
		return Token.create({
			token: token,
			type: 'email',
			expiresAt: moment().add(7, 'day').toDate(),
			_data: { userId: toId(userId) }
		}).then(function (token) {
			logger.info('Created email confirmation token, %s for contact %s.', token.token, userId);
			return token;
		});
	},
	createResetToken: function (user, manager) {
		const token = generateLongToken();
		let expiresAt = moment().add(1, 'day').toDate();
		const data = {
			userId: toId(user.id)
		};

		if (manager) {
			data.managerId = manager.id;
			data.tenantId = manager.TenantId;
			// managers have 7 days to activate their user
			expiresAt = moment().add(7, 'day').toDate();
		}

		return Token.create({
			token: token,
			type: 'reset',
			expiresAt: expiresAt,
			_data: data
		}).then(function (savedTokenModel) {
			logger.info('Created password reset token %s for user %s.', savedTokenModel.token, user.id);
			return savedTokenModel.token;
		});
	}
};

function generateToken () {
	return crypto.randomBytes(4).toString('hex');
}

function generateLongToken () {
	return crypto.randomBytes(16).toString('hex');
}

function toId (id) {
	return id ? parseInt(id, 10) : id;
}

module.exports = tokenService;
