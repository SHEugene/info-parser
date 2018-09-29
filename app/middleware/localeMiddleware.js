'use strict';

const localeService = requireApp('services/localeService');

module.exports = function (req, res, next) {
	// NOTE: Check if user locale is already set in session
	if (req.session && req.session.locale) {
		req.i18n.setLocaleFromSessionVar(req);
		return next();
	}

	if (!req.user) {
		if (!req.session) {
			req.i18n.setLocaleFromCookie(req);
			return next();
		}

		// NOTE: req.language is  browser language settings
		req.session.locale = req.language;
		req.i18n.setLocaleFromSessionVar(req);
		return next();
	}

	return localeService
		.getUserLocale(req.user.id)
		.then(storedUserLocale => {
			// NOTE: Take DB settings data or browser language settings if not set
			req.session.locale = storedUserLocale || req.language;

			req.i18n.setLocaleFromSessionVar(req);
			return next();
		});
};
