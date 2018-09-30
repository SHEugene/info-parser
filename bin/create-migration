#!/usr/bin/env node

const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const moment = require('moment-timezone');
const util = require('util');
const path = require('path');

const name = argv._[0];
const today = moment().format('YYYYMMDDHHmmss');

if (!name) {
	console.error('No migration name given! Usage: ' + path.basename(process.argv[1]) + ' <name>');
	process.exit(1);
}

const filename = util.format('V1_%s__%s.sql', today, name);
const filepath = path.join('.', 'migrations', filename);
fs.writeFile(filepath, '', function (err) {
	if (err) { console.error('Failed to create new migration at ' + filepath + ': ', err); }
	console.log('Created new migration stub at ' + filepath);
});
