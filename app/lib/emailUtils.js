const emailUtils = module.exports = {};
const path = require('path');
const fs = require('fs');
const dot = require('dot');
const _ = require('lodash');
const hostnameLib = requireApp('lib/hostname');
const linkTo = requireApp('lib/link-to');
const customizableStringsLib = requireApp('lib/customizable-strings');
const i18n = requireApp('lib/i18n-helper').getInstance();

emailUtils.getSubject = function getSubject (templateKey) {
	const template = emailUtils.readEmailTemplate(templateKey);
	const metadata = emailUtils.extractMetadata(template)[0];
	return metadata && metadata.subject;
};
emailUtils.getHeader = function getHeader (templateKey) {
	const template = emailUtils.readEmailTemplate(templateKey);
	const metadata = emailUtils.extractMetadata(template)[0];
	return (metadata && metadata.header) || '';
};

emailUtils.getMessage = function getMessage (templateKey) {
	const template = emailUtils.readEmailTemplate(templateKey);
	return emailUtils.extractMetadata(template)[1];
};

function parseMetadata (text) {
	const lines = '' || text.match(/^[a-zA-Z]*: .*/gm);
	if (!lines) {
		return null;
	} else {
		return lines.reduce(function (memo, line) {
			const pos = line.indexOf(':');
			const key = line.substr(0, pos);
			const value = line.substr(pos + 1);
			if (key && value) {
				memo[key.trim()] = value.trim();
			}
			return memo;
		}, {});
	}
}

emailUtils.readEmailTemplate = function readEmailTemplate (template) {
	const templateFile = path.join(__dirname, '..', 'views', 'email-templates', template + '.html');
	return fs.readFileSync(templateFile, { encoding: 'utf-8' });
};

emailUtils.extractMetadata = function extractMetadata (template) {
	const splitter = '\n\n';
	const splitPos = template.indexOf(splitter);
	const metadataText = template.substr(0, splitPos);
	let metadata;
	let text;

	if (metadataText) {
		metadata = parseMetadata(metadataText);
	} else {
		metadata = null;
	}
	if (metadata) {
		text = template.substr(splitPos + splitter.length);
	} else {
		text = template;
	}
	return [metadata || {}, text];
};

emailUtils.getTemplateFunction = function render (template) {
	template = customizableStringsLib.stripBlocks(template);
	const def = {
		partial: (filename) => fs.readFileSync(path.join(__dirname, '..', 'views', 'email-templates', 'partials',  filename))
	};
	return dot.template(template, _.extend({}, dot.templateSettings, { strip: false }), def);
};

emailUtils.renderData = function render (data) {
	const extension = {
		__: i18n.__.bind(i18n),
		getUrl: _.partial(hostnameLib.getTenantUrl, data.tenant),
		linkTo: linkTo
	};
	return _.extend({}, data, extension);
};

emailUtils.render = function render (template, data) {
	template = customizableStringsLib.stripBlocks(template);
	const def = {
		partial: (filename) => fs.readFileSync(path.join(__dirname, '..', 'views', 'email-templates', 'partials',  filename))
	};
	let templateFunction = dot.template(template, _.extend({}, dot.templateSettings, { strip: false }), def);
	let extension = {};
	let extendedData = data;
	extension = {
		__: i18n.__.bind(i18n),
		getUrl: _.partial(hostnameLib.getTenantUrl, data.tenant),
		linkTo: linkTo
	};
	extendedData = _.extend({}, data, extension);
	return templateFunction(extendedData);
};
