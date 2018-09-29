const errors = {
	'400': 'Bad Request',
	'404': 'Not found',
	'403': 'Not authorized',
	'403.community': 'Not authorized',
	'401': 'Not authenticated',
	'422': 'Unprocessable Entity',
	'500': 'Internal Server Error'
};

// Generates an error via one handy line instead of requiring many lines of code
// to first instanciate and then editing properties on the error. Also you get
// automatic texts when the error propagates to an express error handler.
//
// Possible properties are first the http status code (i.e. 404), an error and
// additional data to be added to the error.
module.exports = function (errorCode, err, data) {
	if (!(err instanceof Error) && typeof err === 'object') {
		data = err;
		err = null;
	} else if (typeof err === 'string') {
		err = new Error(err);
	}
	if (!err) {
		err = new Error(errors[errorCode]);
	}
	let errorSubType;
	const splitCodes = extractCodes(errorCode);
	errorCode = splitCodes[0];
	errorSubType = splitCodes[1];
	err.type = errorSubType;
	err.status = errorCode;
	err.data = err.data || data;
	return err;
};

function extractCodes (errorCode) {
	let errorSubType;
	if (errorCode.indexOf && errorCode.indexOf('.') !== -1) {
		errorSubType = errorCode.substr(errorCode.indexOf('.') + 1);
		errorCode = parseInt(errorCode.substr(0, errorCode.indexOf('.')), 10);
	}
	return [errorCode, errorSubType];
}
