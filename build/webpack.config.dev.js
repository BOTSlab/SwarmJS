const { merge } = require('webpack-merge');

module.exports = merge(require('./webpack.config.base'), {
  mode: 'development',
  devtool: 'source-map'

  // All webpack configuration for development environment will go here
});
