const HtmlWebpackPlugin = require('html-webpack-plugin');
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
      {
        test: /\.(frag|vert|glsl)$/i,
        type: 'asset/source',
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
  ],
};
