const I18n = require('i18n-2');
const path = require('path');

module.exports.getOptions = function () {
	return {
		locales: ['en', 'ua'],
		extension: '.json',
		directory: path.join(__dirname, '../../locales'),
		base: (locale) => {
			const rootLocale = locale.slice(0, 2);
			return rootLocale;
		}
	};
};

module.exports.getInstance = function () {
	return new I18n(module.exports.getOptions());
};
