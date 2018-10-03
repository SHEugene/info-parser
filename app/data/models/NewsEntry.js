const moment = require('moment-timezone');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('NewsEntry', {
		header: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		},
		link: {
			type: DataTypes.STRING,
			validate: {
				notEmpty: true
			}
		},
        imagePath: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: false
            }
        },
        description: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        }
	}, {
		tableName: 'NewsEntry',
		getterMethods: {
			createdAtRendered: function () {
				const createdAt = moment(this.createdAt).tz('Europe/Berlin');
				return createdAt.format('L') + ' ' + createdAt.format('LT');
			}
		}
	});
};
