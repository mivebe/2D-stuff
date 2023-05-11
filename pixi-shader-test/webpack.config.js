const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(json|png|gif|mp3)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    devServer: {
        open: true,
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({ template: './index.html' }),
        new CopyPlugin({
            patterns: [
                { from: './assets/', to: 'assets/' }
            ]
        })
    ]
}