const os = require('os');
const path = require('path');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const chalk = require('chalk');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const errorOverlayMiddleware = require('react-error-overlay/middleware');
const webpack = require('webpack');

const { name } = require('../package.json');

const port = 3000;
const ipAddress = os.networkInterfaces().en0.find(iface => iface.family === 'IPv4').address;
const networkUrl = `${ipAddress}:${port}`;

const folders = {
  build: path.resolve(__dirname, '../build'),
  nodeModules: path.resolve(__dirname, '../node_modules'),
  public: path.resolve(__dirname, '../public'),
  src: path.resolve(__dirname, '../src'),
};

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'react-dev-utils/webpackHotDevClient',
    'react-error-overlay',
    path.resolve(folders.src, 'dev.jsx'),
  ],
  output: {
    filename: 'js/app.js',
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
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.jpg|mp4|png|svg$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          [
            `You can now view ${chalk.bold(name)} in the browser.\n`,
            `      ${chalk.bold('Local:')} http://localhost:${port}`,
            `      ${chalk.bold('On your network:')} http://${networkUrl}`,
          ].join('\n'),
        ],
        notes: [
          [
            'Note that the development build is not optimized.',
            `    To create a production build, use ${chalk.cyan('yarn run build')}.`,
          ].join('\n'),
        ],
      },
    }),
    new HtmlPlugin({
      template: path.resolve(folders.public, 'index.jsx'),
    }),
    new WatchMissingNodeModulesPlugin(folders.nodeModules),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    clientLogLevel: 'none',
    compress: true,
    contentBase: folders.public,
    historyApiFallback: {
      disableDotRule: true,
    },
    host: '0.0.0.0',
    hot: true,
    overlay: false,
    port,
    public: networkUrl,
    publicPath: '/',
    quiet: true,
    setup(app) {
      app.use(errorOverlayMiddleware());
    },
    watchContentBase: true,
  },
  devtool: 'cheap-module-source-map',
  performance: {
    hints: false,
  },
};
