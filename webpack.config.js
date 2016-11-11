const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const detectPort = require('detect-port');
const deasync = require('deasync');

const PATHS = {
  src : path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
};

const config = {
  context  : PATHS.src,
  entry    : [
    './index.pug',
    './gallery/index.pug',
    './assets/css/hatena-blog-theme.css',
  ],
  output   : {
    path      : PATHS.dist,
    publicPath: '/',
    filename  : '.dummy'
  },
  module   : {
    rules: [
      {
        test   : /\.(gif|png|ico|eot|svg|ttf|woff)$/,
        exclude: /\.embed\.(gif|png)$/,
        use    : 'file?name=[path][name].[ext]'
      },
      {
        test: /\.embed\.(gif|png)$/,
        use : 'url'
      },
      {
        test: /\.pug$/,
        use : [
          'file?name=[path][name].html',
          'extract',
          `html?attrs=img:src link:href&root=${PATHS.src}`,
          'pug-html?exports=false'
        ]
      },
      {
        test: /\.css$/,
        use : [
          'file?name=[path][name].css',
          'extract',
          `css?minimize&root=${PATHS.src}`,
          {
            loader : 'postcss',
            options: {
              plugins: [
                require('postcss-smart-import')(),
                require('postcss-cssnext')()
              ]
            }
          }
        ]
      }
    ],
  },
  devtool  : 'source-map',
  plugins  : [
    new CleanWebpackPlugin([PATHS.dist])
  ],
  devServer: {
    host          : '0.0.0.0',
    port          : process.env.PORT || deasync(detectPort)('8080'),
    'content-base': PATHS.dist
  }
};
module.exports = config;
