const logger = requireLogger('emailQueue');
const Bluebird = require('bluebird');
const moment = require('moment-timezone');
const config = require('config');
const emailProvider = requireApp('lib/emailProvider');
const emailUtils = requireApp('lib/emailUtils');
const emailService = requireApp('services/emailService');

const DEBOUNCE_INTERVAL = 80;
const MIN_FAIL_INTERVAL = 5 * 1000;
const MAX_FAIL_INTERVAL = 15 * 60 * 1000;

const emailQueue = {
	interval: 0,
	working: false,
	add: function (emailOpt) {
		return getEmailAttributes(emailOpt).then(function (options) {
			return emailService.create(options);
		}).then(function (email) {
			logger.info({
				from: email.getFrom(),
				to: email.to,
				subject: email.subject,
				message: email.message,
				headers: email.headers
			}, 'Created email');
			if (emailQueue.working) {
				return Bluebird.resolve(email);
			}
			return emailQueue.work();
		});
	},
	work: function () {
		if (emailQueue.working) {
			return emailQueue.task;
		}
		emailQueue.working = true;
		emailQueue.task = Bluebird.delay(emailQueue.interval).then(function () {
			return emailService.getOldestUnsentEmail().then(function (email) {
				if (email) {
					return emailService.checkDuplicates(email).then(function (duplicates) {
						if (duplicates && duplicates.length > 0) {
							return emailService.change(email, { processedAt: moment().tz('Europe/Berlin'), event: 'duplicate' })
								.then(function (email) {
									logger.error(`Attempt to send a duplicate email ( ${email.id}: { sender: "${email.getFrom()}", tenantId: "${email.TenantId}", subject: "${email.subject}" } )`);
									return emailQueue.continueQueue();
								});
						} else {
							return emailProvider.send(email.get({ plain: true })).then(function (response) {
								if (response) {
									return emailService.change(email, { processedAt: moment().tz('Europe/Berlin') })
										.then(function (email) {
											if (emailQueue.interval !== DEBOUNCE_INTERVAL && emailQueue.interval !== 0) {
												logger.info('Sending email succeeded, resetting queue interval to %s s', DEBOUNCE_INTERVAL / 1000);
											}
											return emailQueue.continueQueue();
										});
								} else {
									return emailService.change(email, { processedAt: moment().tz('Europe/Berlin'), event: 'blocked' })
										.then(function (email) {
											// Null response means that the email address is blocked
											return emailQueue.continueQueue();
										});
								}
							});
						}
					}).catch(function (err) {
						if (err.message === 'Invalid status code 404') {
							logger.error(err, 'Could not find attachment for email to %s, removing all attachments.', email.to);
							email.attachments = [];
							return email.save().then(() => {
								return emailQueue.continueQueue();
							});
						} else if (err.message === 'Message failed: 452 4.3.4 Error: message file too big') {
							logger.error(err, 'Email too big to deliver to %s, ommitting attachments.', email.to);
							const seperator = email.vars.plainText ? '\n\n' : '<br><br>';
							const fileNames = email.attachments.map((a) => a.filename).join(', ');
							email.message += `${seperator} ${email.attachments.length} Anhänge konnten nicht angehängt werden, da diese die maximale Größe überschritten: ${fileNames}`;
							email.attachments = [];
							return email.save().then(() => {
								return emailQueue.continueQueue();
							});
						} else {
							logger.error(err, 'Failed to deliver mail to %s, setting queue interval to %s s', email.to, emailQueue.getIntervalAfterFailing() / 1000);
							return emailQueue.gotoErrorQueueMode();
						}
					});
				} else {
					emailQueue.interval = 0;
					emailQueue.working = false;
					emailQueue.task = null;
					return Bluebird.resolve();
				}
			});
		});
		return emailQueue.task;
	},
	continueQueue: function () {
		emailQueue.interval = DEBOUNCE_INTERVAL;
		emailQueue.working = false;
		emailQueue.task = null;
		return emailQueue.work();
	},
	gotoErrorQueueMode: function () {
		emailQueue.interval = emailQueue.getIntervalAfterFailing();
		emailQueue.working = false;
		emailQueue.task = null;
		return emailQueue.work();
	},
	getIntervalAfterFailing: function () {
		const safeInterval = Math.max(2 * this.interval, MIN_FAIL_INTERVAL);
		return Math.min(MAX_FAIL_INTERVAL, safeInterval);
	}
};

function getEmailAttributes (options) {
	if (typeof options.message === 'object') {
		const htmlTemplate = emailUtils.getMessage(options.message.template);
		const subjectTemplate = options.subject || emailUtils.getSubject(options.message.template);
		const html = emailUtils.render(htmlTemplate, options.message.data);
		const subject = emailUtils.render(subjectTemplate, options.message.data);
		return Bluebird.resolve({
			to: options.to,
			fromName: options.fromName || getFromName(),
			fromEmail: options.fromEmail || getFromEmail(),
			subject: subject,
			message: html,
			vars: options.vars,
			headers: options.headers,
			TenantId: options.tenantId,
			processedAt: null,
			attachments: options.attachments
		});
	} else {
		return Bluebird.resolve({
			to: options.to,
			fromName: options.fromName || getFromName(),
			fromEmail: options.fromEmail || getFromEmail(),
			subject: options.subject,
			message: options.message,
			vars: options.vars,
			headers: options.headers,
			TenantId: options.tenantId,
			processedAt: null,
			attachments: options.attachments
		});
	}
}

function getFromName () {
	return config.get('email.fromName');
}

function getFromEmail () {
	return config.get('email.user');
}

module.exports = emailQueue;
