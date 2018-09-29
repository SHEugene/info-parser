const $ = require('jquery');
const linkTo = require('./link-to');
//var i18n = require('./i18n');
//var flash = require('../base/flash');
const Bluebird = require('bluebird');
const _ = require('lodash');
const appVersion = process.env.APP_VERSION;
const apiVersion = '1.0.0';

const api = module.exports = {
	post: function POST (url, json) {
		const isJSON = typeof json === 'object';
		return $.ajax({
			type: 'POST',
			url: linkTo(url),
			headers: {
				'Accept': 'application/json',
				'App-Version': appVersion,
				'API-Version': apiVersion
			},
			contentType: isJSON ? 'application/json' : null,
			data: isJSON ? JSON.stringify(json) : json
		});
	},
	postMultipart: function POST (url, json, options) {
		options = options || {};
		return $.ajax({
			type: 'POST',
			url: linkTo(url),
			headers: _.extend({
				'Accept': 'application/json',
				'App-Version': appVersion,
				'API-Version': apiVersion
			}, options.headers),
			contentType: false,
			processData: false,
			enctype: 'multipart/form-data',
			data: json
		});
	},
	get: function get (url) {
		return $.ajax({
			type: 'GET',
			url: linkTo(url),
			headers: {
				'Accept': 'application/json',
				'App-Version': appVersion,
				'API-Version': apiVersion
			},
			cache: false
		});
	},
	del: function del (url) {
		return $.ajax({
			type: 'DELETE',
			url: linkTo(url),
			headers: {
				'Accept': 'application/json',
				'App-Version': appVersion,
				'API-Version': apiVersion
			}
		});
	},
	postAsync: function (url, json) {
		return wrapWithPromiseA(api.post(url, json));
	},
	postMultipartAsync: function (url, json, options) {
		return wrapWithPromiseA(api.postMultipart(url, json, options));
	},
	getAsync: function (url) {
		return wrapWithPromiseA(api.get(url));
	},
	delAsync: function (url) {
		return wrapWithPromiseA(api.del(url));
	},
	errorDisplay: function () {
		return (err) => {
			//flash.flash('error', i18n.__('errors.default.text'));
			throw err;
		};
	}
};

function wrapWithPromiseA (jqueryPromise) {
	return new Bluebird((resolve, reject) => {
		jqueryPromise.done(function (response, textStatus, xhr) {
			resolve({
				data: response,
				textStatus: textStatus,
				xhr: xhr
			});
		}).fail(function (xhr, textStatus, errorThrown) {
			let err;
			if (xhr.responseJSON) {
				err = _.extend(new Error(xhr.responseJSON), xhr.responseJSON);
			} else {
				err = _.extend(new Error(errorThrown.message), errorThrown);
			}
			reject(err);
		});
	});
}
