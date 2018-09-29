const path = require('path');
const webpack = require('webpack');

module.exports = {
	node: {
		fs: "empty"
	},
	devtool: 'inline-source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./client/index.js',
		'./common/scss/main.scss'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			"React": "react",
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['react-hmre']
					}
				}
			}, {
				test: /\.json$/,
				use: {
					loader: 'json-loader'
				}
			}, {
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}, {
				test: /\.scss$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'sass-loader'
				}]
			}, {
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							mimetype: 'application/font-woff'
						}
					}
				]
			}, {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							mimetype: 'application/octet-stream'
						}
					}
				]
			}, {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							mimetype: 'image/svg+xml'
						}
					}
				]
			}, {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: 'file-loader'
				}
			},
		]
	}
};
