const opn = require('opn');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('../config/webpack.config.dev');

const devServerConfig = config.devServer;
const { host, port } = devServerConfig;

new WebpackDevServer(webpack(config), devServerConfig)
  .listen(port, host, () => {
    opn(`http://localhost:${port}`);
  });
