const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'index.js',
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
    new CopyPlugin({
      patterns: [
        { from: "index.html" },
        { from: "src/jon_sample_data.csv", to: "jon_sample_data.csv" },
      ],
    }),
  ],
};