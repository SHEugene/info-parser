const  request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const logger = requireLogger('parserController');

const URL = 'https://dp.informator.ua/';

module.exports = {
	parseURL : function () {
		request(URL, function (err, res, body) {
		if (err) throw  err;
		let $ = cheerio.load(body);

		const allLinksToNewsEntry =  _.map($('.infinite-post > a'),(a)=>(a.attribs['href']));

		if(allLinksToNewsEntry.length > 0) {
			_.map(allLinksToNewsEntry, function (link) {
				request(URL, function (err, res, body) {
					if (err) throw  err;
					$ = cheerio.load(body);

					

				})
			})

		}

		});
	}
}



