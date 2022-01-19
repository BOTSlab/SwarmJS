const { merge } = require('webpack-merge');

module.exports = merge(require('./webpack.config.base'), {
  mode: 'development',
  watch: true,
  devtool: 'source-map'

  // All webpack configuration for development environment will go here
});
