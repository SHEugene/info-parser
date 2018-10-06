var cron = require('node-cron');
const logger = requireLogger('schedulerParser');
const parserController = requireApp('controllers/parserController')
const newsEntryService = requireApp('services/newsEntryService');
const parser = cron.schedule('* * * * *', () => {
	logger.info('parsing started ');
	try{
	const result =	parserController.parseURL();
	newsEntryService.create(result);
	if(result) {

	}
	}catch (e) {

	}

},{
	scheduled: false
});
export default parser;