const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { SRC, DIST } = require('./paths');

module.exports = {
  // mode: 'development',
  context: path.resolve(__dirname, '..'),
  entry: {
    index: path.resolve(SRC, '', 'index.js')
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
        test: /\.(js|jsx)$/,
        resolve: {
          extensions: ['.js', '.jsx']
        },
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'index.html')
    })
  ]
};
