module.exports = {
  /*
   * ==================================================
   * GitHub Pages
   * ==================================================
   */

  base: '/bolg-l/',

  /*
   * ==================================================
   * 网站基础信息
   * ==================================================
   */

  title: '我的博客',

  description: '我的个人技术博客',

  /*
   * ==================================================
   * 主题配置
   * ==================================================
   */

  themeConfig: {
    /*
     * GitHub
     */

    repo: 'FMdenuit530/bolg-l',

    repoLabel: 'GitHub',
    search: false,

    /*
     * 顶部导航
     */

    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/category/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archive/' },
      { text: '搜索', link: '/search/' },
      { text: '关于我', link: '/about/' },
    ],
    /*
     * 更新信息
     */

    lastUpdated: '最后更新',

    /*
     * VuePress 默认上一页 / 下一页
     */

    nextLinks: true,

    prevLinks: true,
  },

  /*
   * ==================================================
   * VuePress Blog Plugin
   * ==================================================
   */

  plugins: [
    [
      '@vuepress/blog',

      {
        /*
         * ==============================================
         * 文章目录
         * ==============================================
         */

        directories: [
          {
            /*
             * 唯一 ID
             */
            id: 'post',

            /*
             * Markdown 所在目录
             */
            dirname: '_posts',

            /*
             * 首页
             */
            path: '/',

            /*
             * 首页布局
             */
            layout: 'IndexPost',

            /*
             * 文章详情布局
             */
            itemLayout: 'Post',

            /*
             * 文章永久链接
             */
            itemPermalink: '/posts/:year/:month/:day/:slug.html',

            /*
             * 首页分页
             */
            pagination: {
              /*
               * 每页 2 篇
               */
              lengthPerPage: 2,

              /*
               * 第 2 页使用这个布局
               */
              layout: 'DirectoryPagination',
            },
          },
        ],

        /*
         * ==============================================
         * 分类 + 标签
         * ==============================================
         */

        frontmatters: [
          /*
           * 分类
           */

          {
            id: 'category',

            keys: ['category'],

            path: '/category/',

            layout: 'Category',

            scopeLayout: 'CategoryList',
          },

          /*
           * 标签
           *
           * 同时支持：
           *
           * tags:
           *   - JavaScript
           *
           * 以及：
           *
           * tag: JavaScript
           *
           * 这样以后不会因为
           * tag / tags 写法不同导致 404。
           */

          {
            id: 'tag',

            keys: ['tag', 'tags'],

            path: '/tags/',

            layout: 'Tags',

            scopeLayout: 'Tag',
          },
        ],
      },
    ],
  ],
}
