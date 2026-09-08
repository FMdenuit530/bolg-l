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

  /*
   * ========================================
   * 自动生成页面 SEO
   * ========================================
   */
  extendPageData(page) {
    const frontmatter = page.frontmatter || {}

    const title = frontmatter.title || page.title || '我的博客'

    const siteTitle = '我的博客'

    /*
     * ----------------------------------------
     * 只处理文章
     * ----------------------------------------
     */
    const isPost = page.path.startsWith('/posts/')

    if (isPost) {
      /*
       * 如果文章自己已经写了 description
       * 就优先使用文章自己的描述
       */
      if (!frontmatter.description) {
        frontmatter.description = `${title}，记录我的学习、实践与技术总结。`
      }

      /*
       * 自动生成 keywords
       */
      if (!frontmatter.meta) {
        frontmatter.meta = []
      }

      const existingKeywords = frontmatter.meta.find((item) => {
        return item && item[0] === 'meta' && item[1] && item[1].name === 'keywords'
      })

      if (!existingKeywords) {
        const keywords = []

        if (frontmatter.category) {
          keywords.push(frontmatter.category)
        }

        if (Array.isArray(frontmatter.tags)) {
          frontmatter.tags.forEach((tag) => {
            if (tag && !keywords.includes(tag)) {
              keywords.push(tag)
            }
          })
        }

        if (keywords.length) {
          frontmatter.meta.push([
            'meta',
            {
              name: 'keywords',
              content: keywords.join(','),
            },
          ])
        }
      }

      /*
       * Open Graph
       */
      const hasOgTitle = frontmatter.meta.some((item) => {
        return item && item[0] === 'meta' && item[1] && item[1].property === 'og:title'
      })

      if (!hasOgTitle) {
        frontmatter.meta.push([
          'meta',
          {
            property: 'og:title',
            content: title,
          },
        ])
      }

      const hasOgDescription = frontmatter.meta.some((item) => {
        return item && item[0] === 'meta' && item[1] && item[1].property === 'og:description'
      })

      if (!hasOgDescription) {
        frontmatter.meta.push([
          'meta',
          {
            property: 'og:description',
            content: frontmatter.description,
          },
        ])
      }

      const hasOgType = frontmatter.meta.some((item) => {
        return item && item[0] === 'meta' && item[1] && item[1].property === 'og:type'
      })

      if (!hasOgType) {
        frontmatter.meta.push([
          'meta',
          {
            property: 'og:type',
            content: 'article',
          },
        ])
      }

      const hasOgUrl = frontmatter.meta.some((item) => {
        return item && item[0] === 'meta' && item[1] && item[1].property === 'og:url'
      })

      if (!hasOgUrl) {
        frontmatter.meta.push([
          'meta',
          {
            property: 'og:url',
            content: `https://fmdenuit530.github.io/bolg-l${page.path}`,
          },
        ])
      }

      /*
       * Twitter Card
       */
      const hasTwitterCard = frontmatter.meta.some((item) => {
        return item && item[0] === 'meta' && item[1] && item[1].name === 'twitter:card'
      })

      if (!hasTwitterCard) {
        frontmatter.meta.push([
          'meta',
          {
            name: 'twitter:card',
            content: 'summary',
          },
        ])
      }

      /*
       * Canonical URL
       */
      if (!frontmatter.canonicalUrl) {
        frontmatter.canonicalUrl = `https://fmdenuit530.github.io/bolg-l${page.path}`
      }

      /*
       * 页面标题
       *
       * 最终：
       * JavaScript Promise | 我的博客
       */
      if (!frontmatter.metaTitle) {
        frontmatter.metaTitle = `${title} | ${siteTitle}`
      }
    }
  },

  /*
   * ========================================
   * 主题配置
   * ========================================
   */
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
