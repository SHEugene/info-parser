const userRoute = requireApp('routes/api/users');
const userController = requireApp('controllers/userController');

module.exports = function (router, passport) {
	router.post('/api/login', function (req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			if (err) { return next(err); }
			if (!user) { return res.redirect('/login'); }
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				userRoute.getUserInfo(user.id, req).then(function (userInfo) {
					res.json({message: 'success', user: userInfo });
				}).catch(next);
			});
		})(req, res, next);
	});

	router.post('/api/register', function (req, res, next) {
		userRoute.createUser(req, res, next);
	});

	router.post('/api/registerByInvite', function (req, res, next) {
		userController.create(req, res).then(function (result) {
			if (!result || !result.finished) {
				res.json({message: 'success'});
			}
		}).catch(next);
	});

	router.get('/api/logout', function (req, res) {
		req.logout();
		req.session.destroy(function () {
			res.json({message: 'success'});
		});
	});
};
