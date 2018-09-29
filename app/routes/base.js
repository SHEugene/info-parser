
module.exports = function (router, passport) {


	router.get('/api/main', function (req, res) {
			res.json({message: 'success'});
	});
};
