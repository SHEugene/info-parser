const bCrypt = require('bcrypt-nodejs');

module.exports = {
	// Generates hash using bCrypt
	createHash: function (password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	},
	isValidPassword: function (user, password) {
		try {
			return bCrypt.compareSync(password, user.password);
		} catch (err) {
			return false;
		}
	},
	isSecurePassword: function (password) {
		return password && password.length >= 8;
	}
};
