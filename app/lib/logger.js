const lugg = require('lugg');
const Bunyan = require('bunyan');
const config = require('config');
let logStreams;
let logLevel = 'info';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
	logLevel = process.env.LOGLEVEL || 'info';
	if (process.env.NODE_ENV === 'test' && !process.env.DEBUG) {
		logLevel = 'fatal';
	}
	const PrettyStream = require('bunyan-prettystream');
	const prettyStdOut = new PrettyStream({
		mode: 'dev'
	});
	prettyStdOut.pipe(process.stdout);
	logStreams = [{
		level: logLevel,
		type: 'raw',
		stream: prettyStdOut
	}, {
		type: 'rotating-file',
		path: './server/log/app.log',
		period: '1d',
		count: 3,
		level: 'debug'
	}];
} else {
	/* eslint camelcase: 0 */
	logStreams = [{
		type: 'rotating-file',
		path: './server/log/app.log',
		period: '1d',
		count: 3,
		level: 'debug'
	}, {
		stream: process.stderr,
		level: 'debug'
	}];
}

lugg.init({
	level: logLevel,
	streams: logStreams,
	serializers: {
		err: Bunyan.stdSerializers.err,
		req: function (req) {
			const serialized = Bunyan.stdSerializers.req(req);
			serialized.hostname = req.hostname;
			serialized.protocol = req.protocol;
			serialized.originalUrl = req.originalUrl;
			return serialized;
		}
	}
});

module.exports = lugg;
