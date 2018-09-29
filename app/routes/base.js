const infoService = requireApp('services/infoService');

module.exports = function (router, passport) {
	router.get('/info', async function (req, res) {
		const  allInfo = await infoService.getAllInfo();
		res.json(allInfo);
	});
};
