const marked = require('marked');
const jade = require('jade');
const toMarkdown = require('to-markdown');
const renderer = new marked.Renderer();

renderer.link = function (href, title, text) {
	let link = '<a href="' + href + '"';
	if (title) {
		link += ' title="' + title + '"';
	}
	link += ' target="_blank" data-track-external>' + text + '</a>';
	return link;
};

const renderOptions = {
	renderer: renderer
};

module.exports = {
	render: function (text, options) {
		options = options || {};
		text = text || '';
		if (!options.isHtml) {
			text = jade.runtime.escape(text);
		}
		return marked(text, renderOptions);
	},
	toMarkdown: function (html) {
		return toMarkdown(html, {
			converters: [{
				filter: 'li',
				replacement: function (content, node) {
					// copied from to-markdown/dist/md-converters.js
					content = content.replace(/^\s+/, '').replace(/\n/gm, '\n    ');
					let prefix = '- ';
					const parent = node.parentNode;
					const index = Array.prototype.indexOf.call(parent.children, node) + 1;

					prefix = /ol/i.test(parent.nodeName) ? index + '. ' : '- ';
					return prefix + content;
				}
			}]
		});
	}
};
