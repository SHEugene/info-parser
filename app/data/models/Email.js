const moment = require('moment-timezone');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Email', {
		to: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true
			}
		},
		fromName: DataTypes.STRING,
		fromEmail: DataTypes.STRING,
		subject: DataTypes.TEXT,
		message: DataTypes.TEXT,
		headers: DataTypes.TEXT,
		vars: DataTypes.TEXT,
		processedAt: DataTypes.DATE,
		attachments: DataTypes.TEXT,
		messageId: DataTypes.STRING,
		event: DataTypes.STRING(10)
	}, {
		tableName: 'Email',
		classMethods: {
			associate: function (db) {
				db.Email.belongsTo(db.Tenant, { foreignKey: { allowNull: true }});
			}
		},
		getterMethods: {
			from: function () {
				return `"${this.fromName}" <${this.fromEmail}>`;
			},
			createdAtRendered: function () {
				const createdAt = moment(this.createdAt).tz('Europe/Berlin');
				return createdAt.format('L') + ' ' + createdAt.format('LT');
			},
			vars: function () {
				return JSON.parse(this.getDataValue('vars')) || {};
			},
			headers: function () {
				return JSON.parse(this.getDataValue('headers')) || {};
			},
			attachments: function () {
				return JSON.parse(this.getDataValue('attachments')) || [];
			}
		},
		setterMethods: {
			vars: function (v) {
				this.setDataValue('vars', JSON.stringify(v || {}));
			},
			headers: function (v) {
				this.setDataValue('headers', JSON.stringify(v || {}));
			},
			attachments: function (v) {
				this.setDataValue('attachments', JSON.stringify(v || []));
			}
		},
		instanceMethods: {
			getFrom: function () {
				return `"${this.fromName}" <${this.fromEmail}>`;
			}
		},
	});
};
