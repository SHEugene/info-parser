const _ = require('lodash');
const markdownHelper = requireApp('lib/markdown-helper');

const blockFinder =      /<block:([a-zA-Z\-\._]*?)>([\s\S]*?)<\/block:[a-zA-Z\-\._]*?>/g;
const blockFinderLocal = /<block:([a-zA-Z\-\._]*?)>([\s\S]*?)<\/block:[a-zA-Z\-\._]*?>/;

module.exports = {
	getBlockFinder: function getBlockFinder () {
		return '<block:([a-zA-Z\-\._]*?)>([\s\S]*)<\/block:[a-zA-Z\-\._]*?>';
	},
	stripBlocks: function stripBlocks (template) {
		return template.replace(/<\/?block:([a-zA-Z\-\._]*?)>/g, '');
	},
	getCustomizableVariables: function getCustomizableVariables (template) {
		const matches = template.match(blockFinder);
		let match2;
		const result = {};
		if (matches && matches[0]) {
			for (let i = matches.length - 1; i >= 0; i -= 1) {
				match2 = matches[i].match(blockFinderLocal);
				result[match2[1]] = match2[2];
			}
		}
		return result;
	},
	templateToDisplay: function (type, translator, content, variables) {
		content = this.replaceVariableTemplates(type, translator, content, variables);
		content = markdownHelper.toMarkdown(content);
		return content;
	},
	replaceVariableTemplates: function (type, translator, content, variables) {
		const _this = this;
		const notFoundVariables = [];
		content = content.replace(blockFinder, function (match, variable) {
			if (!variables[variable]) {
				notFoundVariables.push(variable);
				return null;
			}
			const variableDisplay = _this.getTranslatedDisplay(type, translator, variable);
			return '[' + variableDisplay + ']';
		});
		if (process.env.NODE_ENV === 'development' && notFoundVariables.length) {
			return new Error('No replacement for variables ' + notFoundVariables.join(', ') + ' found.');
		}
		return content;
	},
	getTranslatedDisplay: function getTranslatedDisplay (type, translator, displayName) {
		return translator(type + '.' + displayName);
	},
	convertDisplayToTemplate: function convertDisplayToTemplate (options) {
		const type = options.type;
		const translator = options.translator;
		const display = options.display;
		const variables = options.variables;
		const useMarkdown = options.hasOwnProperty('useMarkdown') ? options.useMarkdown : true;
		let content = display;
		if (!variables) { return new Error('No matching customizable email template found'); }

		if (useMarkdown) {
			content = markdownHelper.render(content);
		}
		content = this.replaceVariableDisplay(type, translator, content, variables);
		if (content instanceof Error) { return content; }
		return content;
	},
	replaceVariableDisplay: function replaceVariableDisplay (type, translator, content, variables) {
		let err;
		const _this = this;
		content = content.replace(/\[(.*?)\]/g, function (match, group) {
			const variable = _this.getVariableForDisplay(type, translator, variables, group);
			if (!variable) {
				err = new Error('VariableNotFound');
				err.variableName = group;
			}
			return '<block:' + variable + '>' + variables[variable] + '</block:' + variable + '>';
		});
		return err ? err : content;
	},
	getVariableForDisplay: function getVariableForDisplay (type, translator, variables, display) {
		const _this = this;
		return _.findKey(variables, function (variable, key) {
			return _this.getTranslatedDisplay(type, translator, key) === display;
		});
	},
	templateToPreview: function templateToPreview (type, translator, template, variables) {
		if (!template) { throw new Error('No template given, need one!'); }
		const _this = this;
		let err;

		template = markdownHelper.render(template);
		template = template.replace(/\[(.*?)\]/g, function (match, group) {
			const variableKey = _this.getVariableForDisplay(type, translator, variables, group);
			if (!variableKey) {
				err = new Error('VariableNotFound');
				err.variableName = group;
				return;
			}

			return _this.getTranslatedDisplay(type, translator, variableKey + '_preview');
		});
		return err ? err : template;
	}

};
