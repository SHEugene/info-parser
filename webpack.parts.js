const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.extractCSS = ({ include, exclude, use }) => {
	const plugin = new ExtractTextPlugin({
		allChunks: true,
		filename: '[name].css',
	});
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					include,
					exclude,
					use: plugin.extract({
						use,
						fallback: 'style-loader',
					})
				}
			]
		},
		plugins: [plugin],
	};
};
exports.loadCSS = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.css$/,
				include,
				exclude,
				use: ['style-loader', 'css-loader']
			}
		]
	}
});
exports.loadSass = ({ include, exclude } = {}) => ({
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'sass-loader'
				}]
			}
		]
	}
});
