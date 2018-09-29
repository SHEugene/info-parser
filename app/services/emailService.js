const Email = requireApp('data/models').Email;
const Tenant = requireApp('data/models').Tenant;
const moment = require('moment-timezone');
const PAGE_SIZE = 25;

const emailService = {
	getById: function (id) {
		return Email.find({ where: { id: id }});
	},
	getByMessageId: function (messageId) {
		return Email.find({ where: { messageId: messageId }});
	},
	create: function (attributes) {
		return Email.build(attributes).save();
	},
	change: function (email, attributes) {
		return email.set(attributes).save({ fields: ['processedAt', 'messageId', 'event'] });
	},
	getPaged: function (options) {
		return Email.findAndCount({
			limit: PAGE_SIZE,
			include: [Tenant],
			offset: ('page' in options) ? options.page * PAGE_SIZE : null,
			order: [['createdAt', 'DESC']]
		}).then(function (results) {
			results.pageSize = PAGE_SIZE;
			results.pageCount = Math.ceil(results.count / PAGE_SIZE);
			results.page = options.page;
			return results;
		});
	},
	getOldestUnsentEmail: function () {
		return Email.find({
			where: {
				processedAt: null
			},
			order: [['createdAt', 'ASC']]
		});
	},
	checkDuplicates: function (email) {
		return Email.all({
			where: {
				TenantId: email.TenantId,
				to: email.to,
				subject: email.subject,
				message: email.message,
				processedAt: {
					$gt: moment(new Date((new Date()).getTime() - 30 * 60000)).tz('Europe/Berlin'),
					$lte: moment().tz('Europe/Berlin')
				}
			}
		});
	}
};

module.exports = emailService;
