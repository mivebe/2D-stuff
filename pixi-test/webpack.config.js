const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    open: true,
    hot: true,
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    // sprites and sounds are referenced by runtime string paths, copy them as-is
    new CopyPlugin({
      patterns: [
        { from: './images/', to: 'images/' },
        { from: './sounds/', to: 'sounds/' },
      ],
    }),
  ],
};
