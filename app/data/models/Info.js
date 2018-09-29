const moment = require('moment-timezone');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Info', {
		header: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		},
        imagePath: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        }
	}, {
		tableName: 'Info',
		getterMethods: {
			createdAtRendered: function () {
				const createdAt = moment(this.createdAt).tz('Europe/Berlin');
				return createdAt.format('L') + ' ' + createdAt.format('LT');
			}
		}
	});
};
