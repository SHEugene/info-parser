//const userRoleController = requireApp('controller/userRoleController');
const _ = require('lodash');

const loginController = module.exports = {
	login: function (req, res, next, user) {
		req.login(user, function () {
			loginController.postLogin(req, user, function (err) {
				if (err) { return next(err); }
				res.redirect('/');
			});
		});
	},
	postLogin: function (req, user, done) {
		loginController.loginTo(req, user, null, done);
	},
	loginTo: function (req, user, communityId, done) {
		done(null, {})
	}
};
