const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: {

  },
  output: {
    path: path.resolve(__dirname, 'dist0'),
    clean: true
  },
  module: {
    rules: [{
      test: /.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]
  },
  watchOptions: {
    ignore: ['**/node_modules'],
    poll: 1000
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true
        },
        extractComments: {
          condition: true,
          filename: (fileData) => {
            // The "fileData" argument contains object with "filename", "basename", "query" and "hash"
            return `${fileData.filename}.LICENSE.txt${fileData.query}`;
          },
          banner: (commentsFile) => {
            return `My custom banner about license information ${commentsFile}`;
          },
        },
      }),
      new CssMinimizerPlugin()
    ]
  },
  plugins: [new MiniCssExtractPlugin({
    filename: './css/site.min.css'
  })]
}
