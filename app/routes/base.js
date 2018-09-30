const newsEntryService = requireApp('services/newsEntryService');

module.exports = function (router, passport) {
	router.get('/info', async function (req, res) {
		const  allInfo = await newsEntryService.getAllInfo();
		res.json(allInfo);
	});
};
