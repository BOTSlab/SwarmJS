const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { SRC, DIST } = require('./paths');

module.exports = {
  // mode: 'development',
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
      },
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
