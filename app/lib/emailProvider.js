const logger = requireLogger('emailProvider');
const config = require('config');
const Bluebird = require('bluebird');
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate;
const juice = require('juice');
const _ = require('lodash');

let setupWasCalled = false;

const emailProvider = {
	transporter: null,
	setup: function () {
		if (!setupWasCalled) {
			setupWasCalled = true;
			this.transporter = this.getTransporter();
		}
	},
	getTransporter: function () {
		logger.info('Using smtp transport');
		let transporter = nodemailer.createTransport({
			auth: {
				user: config.get('email.user'),
				pass: config.get('email.pass')
			},
			host: config.get('email.host'),
			port: config.get('email.port'),
			logger: logger
		});
		transporter.use('compile', htmlToText());
		return transporter;
	},
	send: function (options) {
		return emailProvider.constructNodemailerOptions(options).then(function (nodemailerOptions) {
			if (nodemailerOptions) {
				return emailProvider.sendMail(nodemailerOptions);
			} else {
				// if nodemailer options means email is blocked
				return null;
			}
		});
	},
	sendMail: function (mailOptions) {
		return Bluebird.promisify(this.transporter.sendMail, { context: this.transporter })(mailOptions);
	},
	constructNodemailerOptions: function (options) {
		const _this = this;

		function resolve (data) {
			return Bluebird.resolve(_.extend({
				id: options.id,
				to: options.to,
				from: options.from,
				subject: options.subject,
				messageHtml: options.message,
				vars: options.vars,
				headers: options.headers,
				transporter: _this.transporter,
				tenantId: options.TenantId,
				attachments: options.attachments ? options.attachments.map(mapAttachments) : []
			}, data));
		}

		if (options.vars && options.vars.plainText) {
			return resolve({
				html: undefined,
				text: options.message
			});
		} else {
			options.html = options.message;
			return renderEmailLocally(options, 'basic').then(function (renderedOptions) {
				return resolve({
					html: renderedOptions.html
				});
			});
		}
	},
};

function renderEmailLocally (options, templateName) {
	const defaultTemplate = 'basic';
	const template = templateName || defaultTemplate;
	const templateDir = path.join(__dirname, '../views/email-templates', template);
	const basicEmail = new EmailTemplate(templateDir);
	const templateOptions = {
		SUBJECT: options.subject,
		PREHEADER: options.vars && options.vars.header || null,
		BRANDING: (options.vars && options.vars.branding) || {},
		MAIN: options.html,
		MAINTEXT: options.vars && options.vars.mainText,
		INVITATION: options.vars && options.vars.invitation || null,
		FOOTER: options.vars && options.vars.footer || null,
		ISREGISTERED: Boolean(options.vars && options.vars.isRegistered),
		UNSUBSCRIBE_URL: options.vars && options.vars.unsubscribe_url || null,
		UNSUBSCRIBEREGISTERED: options.vars && options.vars.unsubscribeRegistered || null,
		HEADERIMAGE_URL: (options.vars && options.vars.headerImageUrl),
		HEADERIMAGE_CAPTION: (options.vars && options.vars.headerImageCaption)
	};
	return basicEmail.render(templateOptions)
		.then(function (email) {
			email.html = juice(email.html);
			return Bluebird.resolve(email);
		});
}

function mapAttachments (attachment) {
	const oneDay = 60 * 60 * 24;
	return {
		filename: attachment.filename,
		path: filestorage.link(attachment.key, oneDay)
	};
}

module.exports = emailProvider;
