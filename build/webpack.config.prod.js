const { merge } = require('webpack-merge');

module.exports = merge(require('./webpack.config.base'), {
  mode: 'production'

  // We'll place webpack configuration for production environment here
});
