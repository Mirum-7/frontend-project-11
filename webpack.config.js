
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const paths = {
	entry: path.resolve(__dirname, 'src', 'index.js'),
	output: path.resolve(__dirname, 'build'),
	html: path.resolve(__dirname, 'public', 'index.html'),
};

const config = {
	entry: {
		app: paths.entry,
	},
	output: {
		path: paths.output,
		clean: true,
		filename: '[name].[contenthash:8].js',
	},
	devServer: {
		host: 'localhost',
		port: 3000,
		hot: true,
		open: false,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: paths.html,
		}),

		new FaviconsWebpackPlugin({
			logo: path.resolve(__dirname, 'public', 'icon', 'favicon.ico'),
			mode: 'webapp',
		}),

		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css',
			chunkFilename: 'css/[name].[contenthash:8].css',
		}),
	],
	resolve: {
		extensions: ['.js'],
	},
	devtool: isProduction ? false : 'eval-cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
};

module.exports = () => {
	if (isProduction) {
		config.mode = 'production';
	} else {
		config.mode = 'development';
	}
	return config;
};
