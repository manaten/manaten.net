const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
};

const config = {
  context: PATHS.src,
  entry: [
    './index.pug',
    './gallery/index.pug',
    './assets/css/hatena-blog-theme.css',
  ],
  output: {
    path: PATHS.dist,
    publicPath: '/',
    filename: '.dummy',
  },
  module: {
    rules: [
      {
        test: /\.(gif|png|ico|eot|svg|ttf|woff)$/,
        exclude: /\.embed\.(gif|png)$/,
        use: 'file-loader?name=[path][name].[ext]',
      },
      {
        test: /\.embed\.(gif|png)$/,
        use: 'url-loader',
      },
      {
        test: /\.pug$/,
        use: [
          'file-loader?name=[path][name].html',
          'extract-loader',
          `html-loader?attrs=img:src link:href&root=${PATHS.src}`,
          'pug-html-loader?exports=false',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'file-loader?name=[path][name].css',
          'extract-loader',
          `css-loader?minimize&root=${PATHS.src}`,
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-smart-import')(),
                require('postcss-cssnext')(),
              ],
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin([PATHS.dist]),
    new CopyWebpackPlugin([
      { from: 'blog-entries/images', to: 'wp-content/uploads' },
      { from: 'assets/images/og.gif', to: 'assets/images/og.gif' },
    ]),
  ],
  devServer: {
    host: '',
    port: process.env.PORT || '8080',
    contentBase: PATHS.dist,
  },
};
module.exports = config;
