const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const logger = requireLogger('parserController');

const URL = 'https://dp.informator.ua/';
const NO_ACCESS = 'Forbidden';
module.exports = {
	parseURL: function () {
		request(URL, function (err, res, body) {
			if (err) throw  err;
			let $ = cheerio.load(body);

			const allLinksToNewsEntry = _.map($('.infinite-post > a'), (a) => (a.attribs['href']));

			if (allLinksToNewsEntry.length > 0) {
				_.map(allLinksToNewsEntry, function (link) {
					request(link, function (err, res, body) {
						if (err) throw  err;
						if (!_.includes(body, NO_ACCESS)) {
							$ = cheerio.load(body);
						// parse header
							let header = $('.post-title');
							if (header.length > 0) {
								header = header[0].children[0].data;
							}
						//parse text
							const paragraphs = $('#content-main > p');

							if(paragraphs.length > 0) {
								_.map(paragraphs, function (p) {
                                    const text =  _.filter(p.children, (child) =>(child.type ==='text'));
								})
							}

						}
					})
				})

			}

		});
	}
}



