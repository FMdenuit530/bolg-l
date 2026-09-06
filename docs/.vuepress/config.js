module.exports = {
  title: '我的博客',
  description: '我的个人技术博客',

  themeConfig: {
    // GitHub 仓库
    repo: 'FMdenuit530/bolg-l',
    repoLabel: 'GitHub',

    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '分类',
        link: '/category/',
      },
      {
        text: '标签',
        link: '/tags/',
      },
      {
        text: '关于我',
        link: '/about/',
      },
    ],

    lastUpdated: '最后更新',

    nextLinks: true,
    prevLinks: true,
  },

  plugins: [
    [
      '@vuepress/blog',
      {
        directories: [
          {
            id: 'post',
            dirname: '_posts',

            path: '/',

            layout: 'IndexPost',
            itemLayout: 'Post',

            itemPermalink: '/posts/:year/:month/:day/:slug.html',

            pagination: {
              lengthPerPage: 2,
              layout: 'DirectoryPagination',
            },
          },
        ],

        frontmatters: [
          {
            id: 'category',
            keys: ['category'],
            path: '/category/',
            layout: 'Category',
            scopeLayout: 'CategoryList',
          },

          {
            id: 'tag',
            keys: ['tags'],
            path: '/tags/',
            layout: 'Tags',
            scopeLayout: 'Tag',
          },
        ],
      },
    ],
  ],
}
