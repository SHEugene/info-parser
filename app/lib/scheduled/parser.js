var cron = require('node-cron');
const logger = requireLogger('schedulerParser');
const parserController = requireApp('controllers/parserController')
const parser = cron.schedule('* * * * *', () => {
	logger.info('parsing started ');
	parserController.parseURL();
},{
	scheduled: false
});



export default parser;