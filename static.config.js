import React from 'react';
import { reloadRoutes } from 'react-static/node';
import path from 'path';
import jdown from 'jdown';
import chokidar from 'chokidar';
import { renderStylesToString } from 'emotion-server';

// chokidar.watch('./src/contents').on('all', () => reloadRoutes());

export default {
  siteRoot: 'https://manaten.net/',
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
  renderToHtml: (render, Comp) => renderStylesToString(render(<Comp />)),
  webpack: (config, { defaultLoaders }) => {
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
          defaultLoaders.cssLoader,
          defaultLoaders.fileLoader,
        ],
      },
    ];
    return config;
  },
};
