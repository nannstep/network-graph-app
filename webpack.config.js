const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
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
    new CopyPlugin({
      patterns: [
        { from: "src/jon_sample_data.csv", to: "jon_sample_data.csv" },
      ],
    }),
  ],
};