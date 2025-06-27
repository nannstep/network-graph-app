const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Network Graph App',
      template: 'index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/jon_sample_data.csv", to: "jon_sample_data.csv" },
      ],
    }),
  ],
};