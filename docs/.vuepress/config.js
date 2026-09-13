module.exports = {
  /*
   * ========================================
   * GitHub Pages 部署路径
   * ========================================
   */
  base: '/bolg-l/',

  /*
   * ========================================
   * 网站基本信息
   * ========================================
   */
  title: '我的博客',
  description: '我的个人技术博客',

  /*
   * ========================================
   * 网站语言
   * ========================================
   */
  locales: {
    '/': {
      lang: 'zh-CN',
    },
  },

  /*
   * ========================================
   * 全站 Head
   * ========================================
   *
   * 这里放整个网站都通用的 head 标签。
   */
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
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

  /*
   * ========================================
   * SEO
   * ========================================
   *
   * 构建时给每一个页面自动生成：
   *
   * 1. canonical
   * 2. Open Graph
   * 3. Twitter Card
   *
   * 以后新增文章不需要手动重复配置。
   */
  extendPageData($page) {
    const siteUrl = 'https://fmdenuit530.github.io/bolg-l'
    const siteTitle = '我的博客'
    const siteDescription = '我的个人技术博客'

    const pagePath = $page.path || '/'

    /*
     * 规范化 URL
     *
     * 例如：
     *
     * /
     * -> https://fmdenuit530.github.io/bolg-l/
     *
     * /search/
     * -> https://fmdenuit530.github.io/bolg-l/search/
     *
     * /posts/2026/09/07/vue3.html
     * -> https://fmdenuit530.github.io/bolg-l/posts/2026/09/07/vue3.html
     */
    let canonicalUrl = `${siteUrl}${pagePath}`

    if (!canonicalUrl.endsWith('/') && !pagePath.includes('.html')) {
      canonicalUrl += '/'
    }

    /*
     * 当前页面标题
     */
    const pageTitle = $page.title || ($page.frontmatter && $page.frontmatter.title) || siteTitle

    /*
     * 当前页面描述
     */
    const pageDescription = ($page.frontmatter && $page.frontmatter.description) || siteDescription

    /*
     * 判断是不是文章页
     */
    const isPost = pagePath.startsWith('/posts/') && $page.frontmatter && $page.frontmatter.date

    /*
     * ========================================
     * canonical
     * ========================================
     */
    $page.frontmatter.canonicalUrl = canonicalUrl

    /*
     * ========================================
     * Open Graph
     * ========================================
     */
    const seoMeta = [
      {
        property: 'og:type',
        content: isPost ? 'article' : 'website',
      },
      {
        property: 'og:title',
        content: pageTitle,
      },
      {
        property: 'og:description',
        content: pageDescription,
      },
      {
        property: 'og:url',
        content: canonicalUrl,
      },
      {
        property: 'og:site_name',
        content: siteTitle,
      },
      {
        property: 'og:locale',
        content: 'zh_CN',
      },

      /*
       * ====================================
       * Twitter Card
       * ====================================
       */
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: pageTitle,
      },
      {
        name: 'twitter:description',
        content: pageDescription,
      },
    ]

    /*
     * ========================================
     * 文章页额外信息
     * ========================================
     */
    if (isPost && $page.frontmatter.category) {
      seoMeta.push({
        property: 'article:section',
        content: String($page.frontmatter.category),
      })
    }

    /*
     * 如果以后某个页面自己写了 meta，
     * 保留原来的内容，再追加博客 SEO。
     */
    const existingMeta = Array.isArray($page.frontmatter.meta) ? $page.frontmatter.meta : []

    $page.frontmatter.meta = [...existingMeta, ...seoMeta]
  },

  /*
   * ========================================
   * Theme
   * ========================================
   */
  themeConfig: {
    logo: '/logo.png',

    repo: 'FMdenuit530/bolg-l',
    repoLabel: 'GitHub',

    /*
     * 关闭 VuePress 默认搜索框
     */
    search: false,

    /*
     * 导航栏
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
     * 最后更新时间
     */
    lastUpdated: '最后更新',

    /*
     * 上一篇 / 下一篇
     */
    nextLinks: true,
    prevLinks: true,
  },

  /*
   * ========================================
   * 插件
   * ========================================
   */
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

        /*
         * 分类
         */
        frontmatters: [
          {
            id: 'category',
            keys: ['category'],
            path: '/category/',
            layout: 'Category',
            scopeLayout: 'CategoryList',
          },

          /*
           * 标签
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
