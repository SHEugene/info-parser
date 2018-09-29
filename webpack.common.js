const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

module.exports = merge([
	{
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
			path: path.join(__dirname, 'public'),
			filename: 'bundle.js',
			publicPath: '/public/'
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
	},
	// parts.loadCSS(),
	parts.loadSass()
]);
