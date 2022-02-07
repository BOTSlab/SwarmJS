import { Configuration } from 'webpack';
import baseConfig from './webpack.config.base';

const devConfig: Configuration = {
  mode: 'development',
  devtool: 'source-map'
}

const newConfig: Configuration = {...baseConfig, ...devConfig};

export default newConfig;
