const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DartScss = require('sass');
const glob = require('glob');

module.exports = {
  mode: 'development',
  entry: {
    'js/timezones': glob.sync('./js/src/**/*.js', {
      ignore: ['./js/src/service-worker-src.js', './js/src/workbox.js']
    }),
    'css/timezones': './scss/timezones.scss',
  },
  output: {
    path: path.resolve('./'),
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: './fonts/[name][ext]',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: DartScss
            }
          },
        ],
      },
    ],
  }
};
