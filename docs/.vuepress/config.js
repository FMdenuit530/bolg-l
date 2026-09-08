module.exports = {
  base: '/bolg-l/',

  /*
   * ========================================
   * 网站基础信息
   * ========================================
   */
  title: '我的博客',

  description: '记录学习、分享技术、持续成长的个人博客',

  /*
   * ========================================
   * HTML head
   * ========================================
   */
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1',
      },
    ],

    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],

    [
      'meta',
      {
        name: 'author',
        content: '我的博客',
      },
    ],
  ],

  themeConfig: {
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

    [
      'sitemap',
      {
        hostname: 'https://fmdenuit530.github.io/bolg-l/',
      },
    ],
  ],
}
