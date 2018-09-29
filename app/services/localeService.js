'use strict';

const Bluebird = require('bluebird');
const User = requireApp('data/models').User;
const Language = requireApp('data/models').Language;

module.exports = {
	getUserLocale: function (userId) {
		if (!userId) {
			throw new Error('userId is not set');
		}

		return Bluebird
			.join(getUserDisplayLanguage(userId),
				(userDisplayLanguage) => {
					return userDisplayLanguage;
				});
	}
};

function getUserDisplayLanguage (userId) {
	return User
		.findOne({
			where: { id: userId },
			include: [
				{
					model: Language,
					attributes: ['code']
				}
			]
		}).then(user => {
			return user.Language.code;
		});
}
