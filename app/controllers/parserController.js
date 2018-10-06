const request = require('request');
const cheerio = require('cheerio');
const logger = requireLogger('parserController');
const _ = require('lodash');
const newsEntryService = requireApp('services/newsEntryService');
const URL = 'https://dp.informator.ua/';
const NO_ACCESS = 'Forbidden';
const parser = module.exports = {
	parseURL: function () {
		request(URL, function (err, res, body) {
			if (err){
				logger.error(err);
				throw  err;
			}
			const allLinksToNewsEntry = parser.getLinks(body);
			logger.info('links length ' +allLinksToNewsEntry.length);
			if (allLinksToNewsEntry.length > 0) {
			 _.forEach(allLinksToNewsEntry,async function (link) {
				 const existEntity = await newsEntryService.getByLink(link);
				 if(!existEntity) {
					 request(link, async function (err, res, body) {
						 logger.info('secons req');
						 if (err) {
							 logger.error(err);
							 throw  err;
						 }
						 const newsEntity = parser.getNewEntityFromBody(body, link);
						 logger.info(newsEntity);
						 if (newsEntity) {

								 logger.info('no exist');
								 logger.info('created');
								 newsEntryService.create(newsEntity);

						 }
					 });
				 } else {
					 logger.info('entity already exist');
				 }
				})
			}
		});
	},
	getLinks(body) {
	   let $ = cheerio.load(body);
	   const links = _.map($('.infinite-post > a'), (a) => (a.attribs['href']));
	   if(links && links.length>0) {
	   	return links;
	   } else 
	return [];
	},
	getNewEntityFromBody(body,link) {
		 if (!_.includes(body, NO_ACCESS)) {
			let $ = cheerio.load(body);
			// parse header
			let header = $('.post-title');
			if (header.length > 0) {
				header = header[0].children[0].data;
			} else {
				header = 'No header';
			}
			//parse text
			const paragraphs = $('#content-main > p').contents();
			let texts = '';
			if (paragraphs.length > 0) {
				_.forEach(paragraphs, function (p) {
					if (p.type === 'text') {
						texts += (p.data + '');
					} else if (p.name === 'strong' || p.name === 'a') {
						texts += (p.children[0].data + '');
					}
				}.bind(this))
			} else {
				return null;
			}

			if (texts) {
				return {
					header: header,
					description: texts,
					link: link
				};
			} else {
				return null
			}

		}
		else {
			throw Error('No Access o the site')
		}
	}
}


