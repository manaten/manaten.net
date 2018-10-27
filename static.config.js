import { reloadRoutes } from 'react-static/node';
import path from 'path';
import jdown from 'jdown';
import chokidar from 'chokidar';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

// chokidar.watch('./src/contents').on('all', () => reloadRoutes());

export default {
  plugins: ['react-static-plugin-sass', 'react-static-plugin-preact'],
  entry: path.join(__dirname, 'src', 'app', 'index.tsx'),

  src: path.join(__dirname, 'src', 'app'),
  public: path.join(__dirname, 'src', 'public'),

  getSiteData: () => ({
    title: 'まなドット',
  }),

  getRoutes: async () => {
    // const contents = await jdown('./src/contents');
    return [
      {
        path: '/',
        component: 'src/app/containers/Home',
      },
      {
        path: '/404',
        component: 'src/app/containers/404',
      },
    ];
  },

  webpack: (config, { defaultLoaders, stage }) => {
    let loaders = [];

    if (stage === 'dev') {
      loaders = [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }];
    } else {
      loaders = [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            minimize: stage === 'prod',
            sourceMap: false,
          },
        },
        {
          loader: 'sass-loader',
          options: { includePaths: ['src/'] },
        },
      ];

      // Don't extract css to file during node build process
      if (stage !== 'node') {
        loaders = ExtractTextPlugin.extract({
          fallback: {
            loader: 'style-loader',
            options: {
              sourceMap: false,
              hmr: false,
            },
          },
          use: loaders,
        });
      }
    }

    config.resolve.extensions.push('.ts', '.tsx');
    config.module.rules = [
      {
        oneOf: [
          {
            ...defaultLoaders.jsLoader,
            test: /\.(js|jsx|ts|tsx)$/,
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          {
            test: /\.s(a|c)ss$/,
            use: loaders,
          },
          defaultLoaders.cssLoader,
          defaultLoaders.fileLoader,
        ],
      },
    ];
    return config;
  },
};
