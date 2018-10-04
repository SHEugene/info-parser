const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const URL = 'https://dp.informator.ua/';
const NO_ACCESS = 'Forbidden';
module.exports = {
	parseURL: function () {
		request(URL, function (err, res, body) {
			if (err){
				throw  err;
			}
			const allLinksToNewsEntry = getLinks(body);

			if (allLinksToNewsEntry.length > 0) {
				_.map(allLinksToNewsEntry, function (link) {
					request(link, function (err, res, body) {
						if (err){
							throw  err;
						}
						const newsEntity = getNewEntityFromBody(body,link);
						if(newsEntity) {
							return newsEntity;
						}
					})
				})
			}
		});
	},
	getLinks(body) {
		let $ = cheerio.load(body);
	   const links = _.map($('.infinite-post > a'), (a) => (a.attribs['href']));

	   if(links && links.length>0) {
	   	return links;
	   } else return [];
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


