import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import path from 'path';
import { SRC, DIST } from './paths';

const baseConfig: Configuration  = {
  context: path.resolve(__dirname, '..'),
  entry: {
    index: path.resolve(SRC, '', 'index.tsx')
  },
  output: {
    path: DIST,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        resolve: {
          extensions: ['.ts', '.tsx', '.jsx', '.js']
        },
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'index.html')
    })
  ]
};

export default baseConfig
