import path from 'path';
// import jdown from 'jdown';
// import chokidar from 'chokidar';

// chokidar.watch('./src/contents').on('all', () => reloadRoutes());

export default {
  siteRoot: 'https://manaten.net/',

  paths: {
    src: path.join('src', 'app'),
    pages: path.join('src', 'app', 'pages'),
    public: path.join('src', 'public'),
  },

  plugins: [
    'react-static-plugin-typescript',
    'react-static-plugin-preact',
    'react-static-plugin-emotion',
  ],

  getSiteData: () => ({
    title: 'まなドット',
  }),

  getRoutes: async () => {
    // const { data: posts } = await axios.get(
    //   'https://jsonplaceholder.typicode.com/posts'
    // )
    return [
      // {
      //   path: '/blog',
      //   getData: () => ({
      //     posts,
      //   }),
      //   children: posts.map(post => ({
      //     path: `/post/${post.id}`,
      //     component: 'src/containers/Post',
      //     getData: () => ({
      //       post,
      //     }),
      //   })),
      // },
    ];
  },
};
