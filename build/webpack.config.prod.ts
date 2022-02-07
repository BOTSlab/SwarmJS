import { Configuration }  from 'webpack'
import baseConfig from './webpack.config.base';

const prodConfig: Configuration = {
  mode: 'production'

  // We'll place webpack configuration for production environment here
}

const newConfig: Configuration = {...baseConfig, ...prodConfig};

export default newConfig;