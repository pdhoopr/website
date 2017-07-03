const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const webpack = require('webpack');

const folders = {
  build: path.resolve(__dirname, '../build'),
  public: path.resolve(__dirname, '../public'),
  src: path.resolve(__dirname, '../src'),
};

module.exports = {
  entry: path.resolve(folders.src, 'static.jsx'),
  output: {
    filename: 'static/js/site.js',
    libraryTarget: 'umd',
    path: folders.build,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        include: [folders.public, folders.src],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?importLoaders=1&sourceMap!postcss-loader',
        }),
      },
      {
        test: /\.jpg|mp4|png|svg$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'static/css/site.css',
      allChunks: true,
    }),
    new StaticSiteGeneratorPlugin({
      paths: ['/'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
