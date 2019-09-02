'use strict';
const path = require('path');
const webpack = require("webpack");
const SizePlugin = require('size-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

const utils = require('./webpack.utils');

module.exports = (env, argv) => {
  console.log(`Environment mode is: ${argv.mode}`);
  let devmode = (argv.mode == 'development') ? true : false;

  // https://github.com/webpack/webpack/issues/6460
  return {
    devtool: 'sourcemap',
    stats: 'errors-only',
    entry: {
      main: './__src/assets/js/main'
    },
    output: {
      path: path.join(__dirname, '.'),
      filename: 'assets/js/[name].js'
    },
    module: {
      rules: [{
          test: /\.js$/,
          exclude: [
            /node_modules/, /assets\/js/
          ],
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.s(a|c)ss$/,
          exclude: /\.module.(s(a|c)ss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.pug$/,
          use: [{
            loader: 'pug-loader',
            options: {
              pretty: true
            }
          }]
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.scss']
    },
    plugins: [
      new SizePlugin(),
      new webpack.DefinePlugin({
        "process.env.DEVMODE": JSON.stringify(devmode)
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].css'
      }),
      new CopyWebpackPlugin([
        //{
        //  context: '__src',
        //  from: 'assets/img/**/*'
        //},
        {
          from: '__src/assets/js/plugins.js',
          to: 'assets/js/plugins.js'
        }
      ]),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: '__src/views/index.pug',
        inject: true
      }),
      ...utils.pages(env),
      ...utils.pages(env, 'works'),
      /* new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        optipng: null,
        pngquant: {
          speed: 1,
          quality: "75-100"
        },
        svgo: {
          removeViewBox: false
        },
        plugins: [
          imageminMozjpeg({
            quality: 90,
            progressive: true
          })
        ]
      }) */
    ],
    optimization: {
      minimizer: [
        new TerserPlugin()
      ]
    }
  }
};