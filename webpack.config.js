const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const DartScss = require('sass');
const glob = require('glob');

module.exports = {
  mode: 'development',
  entry: {
    '/js/timezones': glob.sync('./js/**/*.js', {
      ignore: ['./js/service-worker-src.js', './js/workbox.js']
    }),
    '/css/timezones': './scss/timezones.scss',
  },
  output: {
    path: path.resolve('./public'),
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
