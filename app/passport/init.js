const logger = requireLogger('passport');
const login = require('./login');
const userService = requireApp('services/userService');

module.exports = function (passport) {
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function (user, done) {
		logger.info('serializing user with id: %s', user.id);
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		logger.info('deserializing user with id %s', id);
		userService.getById(id).then(function (user) {
			//If User is logged in with multiple clients and deletes the account on a single client,
			//the session is invalidated
			if (user) {
				logger.info('deserialized user with id %s and name %s %s', id, user.firstName, user.lastName);
				done(null, user);
			} else {
				logger.info('user does not exist');
				done(null, false);
			}
		}, function (error) {
			logger.info('deserialized user with id %s with error:%s', id, error);
			done(error);
		});
	});

	// Setting up Passport Strategies for Login and SignUp/Registration
	login(passport);
};
