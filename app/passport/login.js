const LocalStrategy   = require('passport-local').Strategy;
const userService = requireApp('services/userService');
const passwordService = requireApp('lib/password');

module.exports = function (passport) {
	const strategy = new LocalStrategy({ passReqToCallback: true },
		function (req, username, password, done) {
			userService.getByEmail(username).then(function (user) {
				let err;
				if (!user) {
					req.log.info({ module: 'casavi:login' }, 'User Not Found: ' + username);
					err = new Error('login.email_password_unknown');
					err.status = 401;
					return done(err, false, req);
				} else if (!passwordService.isValidPassword(user, password)) {
					req.log.info({ module: 'casavi:login' }, 'Invalid Password for user ' + username);
					err = new Error('login.email_password_unknown');
					err.status = 401;
					return done(err, false, req);
				} else if (!user.confirmedEmail) {
					req.log.info({ module: 'casavi:login' }, 'User has not validated his e-mail address.');
					err = new Error('login.email_address_not_verified');
					err.status = 400;
					return done(err, false, req);
				} else if (req.body.invite) {
					req.session.returnTo = '/invite?token=' + req.body.invite;
					return done(null, user);
				} else {
					return done(null, user);
				}
			});
		});
	passport.use('login', strategy);
};
