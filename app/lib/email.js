const emailQueue = require('./emailQueue');

const email = {
	send: function (options) {
		return emailQueue.add(options);
	}
};

module.exports = email;
