// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = MiniCssExtractPlugin.loader;

const paths = {
	entry: path.resolve(__dirname, 'src', 'index.js'),
	output: path.resolve(__dirname, 'build'),
	html: path.resolve(__dirname, 'public', 'index.html')
}

const config = {
  entry: paths.entry,
  output: {
    path: paths.output,
    clean: true,
		filename: '[name].[contenthash:8].js',
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.html,
    }),

		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css',
			chunkFilename: 'css/[name].[contenthash:8].css',
		}),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
					MiniCssExtractPlugin.loader, 
					'css-loader',
					"sass-loader",
				],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
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
