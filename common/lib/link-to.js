var url = require('url');
//var cordovaAppHelper = require('./cordovaAppHelper');

module.exports = function linkTo (target) {
	// is used if app is used via cordova
	/*if (cordovaAppHelper.isCordovaApp) {
		// config is set in the index.html of the cordova app
		return url.resolve(getServerUrl(), target);
	} else	*/if (!target) {
		return window.location.pathname;
	} else if (target.substr(0, 1) === '.' || target.substr(0, 1) === '/') {
		return url.resolve(window.location.pathname, target);
	} else {
		return url.resolve(getBaseUrl(), target);
	}
};

function getBaseUrl () {
	var csvistate = window.csvistate;
	if (csvistate && csvistate.baseurl) {
		return csvistate.baseurl;
	} else {
		var pathname = window.location.pathname;
		var urlParts = pathname.split('/');
		var base = urlParts.length ? urlParts[0] : '';
		if (!base) {
			base = urlParts[1];
		}
		return '/' + base + '/';
	}
}
/*
function getServerUrl () {
	if (typeof window !== 'undefined') {
		return window.config.BACKEND_SERVER_URL;
	} else {
		throw new Error('Server URL should not be needed on the server ');
	}
}*/
