const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const newsEntryService = requireApp('services/newsEntryService');
const logger = requireLogger('parserController');
const URL = 'https://dp.informator.ua/';
const NO_ACCESS = 'Forbidden';
module.exports = {
	parseURL: function () {
		request(URL, function (err, res, body) {
			if (err){
				logger.error(err);
				throw  err;
			}
				logger.info('first request successful')
			let $ = cheerio.load(body);

			const allLinksToNewsEntry = _.map($('.infinite-post > a'), (a) => (a.attribs['href']));

			if (allLinksToNewsEntry.length > 0) {
				_.map(allLinksToNewsEntry, function (link) {
					request(link, function (err, res, body) {
						if (err){
							logger.error(err);
							throw  err;
						}
						logger.info('second request successful')
						try {
						if (!_.includes(body, NO_ACCESS)) {
							$ = cheerio.load(body);
						// parse header
							let header = $('.post-title');
							if (header.length > 0) {
								header = header[0].children[0].data;
							}
						//parse text
							const paragraphs = $('#content-main > p').contents();
							let texts = '';
							if(paragraphs.length > 0) {
								_.forEach(paragraphs, function (p) {
									if(p.type === 'text') {
										texts +=  (p.data+'');
									} else if(p.name === 'strong' || p.name === 'a' ) {
										texts += (p.children[0].data+'');
									}
								}.bind(this))
							}

							if(header && texts) {
								newsEntryService.create({
									header: header,
									description: texts,
									link:link
								});
								logger.info('created successful');
							}

						}
						} catch (e) {
                            logger.error(e);
							logger.info(e);
						}
					})
				})
			}
		});
	}
}


