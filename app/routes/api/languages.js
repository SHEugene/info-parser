const languageService = requireApp('services/languageService');
const routerize = requireApp('lib/routerize');

module.exports = routerize({
	'GET /': function (req, res, next) {
		return languageService.getAll().then(function (languages) {
			res.json(languages);
		});
	}
});
