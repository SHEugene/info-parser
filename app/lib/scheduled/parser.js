var cron = require('node-cron');
const config = require('config');
const lugg = requireApp('lib/logger');
const logger = lugg(config.get('project.name'));

const parser = cron.schedule('* * * * *', () => {
	logger.info('running every minute 1, 2, 4 and 5');
},{
	scheduled: false
});



export default parser;