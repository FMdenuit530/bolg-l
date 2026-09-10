<template>
  <ParentLayout>
    <template slot="page-top">
      <!-- ==================================================
           首页 Hero
           ================================================== -->

      <section class="home-hero">
        <div class="home-hero-inner">
          <div class="home-hero-kicker">MY BLOG</div>

          <h1>我的博客</h1>

          <p class="home-hero-title">记录学习 · 分享技术 · 持续成长</p>

          <p class="home-hero-description">这里记录我的编程学习、开发实践与技术思考。</p>

          <div class="home-hero-actions">
            <router-link to="/category/" class="home-hero-button primary"> 浏览分类 </router-link>

            <router-link to="/tags/" class="home-hero-button secondary"> 查看标签 </router-link>
          </div>
        </div>
      </section>

      <!-- ==================================================
           最新文章
           ================================================== -->

      <section class="home-content">
        <div class="home-content-inner">
          <div class="home-section-heading">
            <div class="home-section-kicker">ARTICLES</div>

            <h2>最新文章</h2>

            <p>记录最近的学习、实践与技术思考</p>
          </div>

          <!-- ==================================================
               文章列表
               ================================================== -->

          <div class="post-list">
            <article v-for="post in $pagination.pages" :key="post.path" class="post-card">
              <!-- 日期 -->

              <div class="post-card-date">
                {{ formatDate(post.frontmatter.date) }}
              </div>

              <!-- 标题 -->

              <h2 class="post-card-title">
                <router-link :to="post.path">
                  {{ post.title }}
                </router-link>
              </h2>

              <!-- 分类 / 标签 -->

              <div v-if="post.frontmatter.category || normalizedTags(post.frontmatter.tags).length" class="post-card-meta">
                <!-- 分类 -->

                <router-link v-if="post.frontmatter.category" :to="getCategoryPath(post.frontmatter.category)" class="post-card-category">
                  {{ post.frontmatter.category }}
                </router-link>

                <!-- 分隔符 -->

                <span v-if="post.frontmatter.category && normalizedTags(post.frontmatter.tags).length" class="post-card-separator"> · </span>

                <!-- 标签 -->

                <a v-for="tag in normalizedTags(post.frontmatter.tags)" :key="tag" :href="getTagHref(tag)" class="post-card-tag"> # {{ tag }} </a>
              </div>

              <!-- 描述 -->

              <p v-if="post.frontmatter.description" class="post-card-description">
                {{ post.frontmatter.description }}
              </p>

              <!-- 阅读全文 -->

              <router-link :to="post.path" class="post-card-read">
                <span> 阅读全文 </span>

                <span class="post-card-read-arrow"> → </span>
              </router-link>
            </article>
          </div>

          <!-- ==================================================
               没有文章
               ================================================== -->

          <div v-if="!$pagination.pages || !$pagination.pages.length" class="post-empty">暂时还没有文章。</div>

          <!-- ==================================================
               首页分页
               ================================================== -->

          <nav v-if="$pagination.hasPrev || $pagination.hasNext" class="home-pagination" aria-label="文章分页">
            <!-- 上一页 -->

            <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink" class="pagination-arrow">
              ←
              <span> 上一页 </span>
            </router-link>

            <!-- 页码 -->

            <div class="pagination-pages">
              <router-link
                to="/"
                class="pagination-number"
                :class="{
                  active: currentPage === 1,
                }"
              >
                1
              </router-link>

              <router-link
                v-if="$pagination.hasNext || $pagination.hasPrev"
                to="/page/2/"
                class="pagination-number"
                :class="{
                  active: currentPage === 2,
                }"
              >
                2
              </router-link>
            </div>

            <!-- 下一页 -->

            <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink" class="pagination-arrow">
              <span> 下一页 </span>
              →
            </router-link>
          </nav>
        </div>
      </section>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'IndexPost',

  components: {
    ParentLayout,
  },

  computed: {
    /* ==================================================
       当前页码

       /
       /page/2/

       目前博客只有两页，
       所以这里保持简单稳定。
       ================================================== */

    currentPage() {
      if (this.$route && this.$route.path === '/') {
        return 1
      }

      if (this.$route && /^\/page\/2\/?$/.test(this.$route.path)) {
        return 2
      }

      return 1
    },
  },

  methods: {
    /* ==================================================
       日期
       ================================================== */

    formatDate(date) {
      if (!date) {
        return ''
      }

      const d = new Date(date)

      if (isNaN(d.getTime())) {
        return date
      }

      const year = d.getFullYear()

      const month = String(d.getMonth() + 1).padStart(2, '0')

      const day = String(d.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },

    /* ==================================================
       分类路径
       ================================================== */

    getCategoryPath(category) {
      return `/category/${encodeURIComponent(String(category).trim())}/`
    },

    /* ==================================================
       标签名称标准化
       ================================================== */

    normalizeTagName(value) {
      return String(value == null ? '' : value).trim()
    },

    /* ==================================================
       URL 解码
       ================================================== */

    decodePathValue(value) {
      const text = String(value == null ? '' : value)

      try {
        return decodeURIComponent(text)
      } catch (error) {
        return text
      }
    },

    /* ==================================================
       查找真实标签页面
       ================================================== */

    getTagPath(tag) {
      const target = this.normalizeTagName(tag)

      if (!target) {
        return '/tags/'
      }

      const pages = Array.isArray(this.$site.pages) ? this.$site.pages : []

      const tagPages = pages.filter((page) => {
        if (!page || !page.path) {
          return false
        }

        const path = String(page.path)

        if (!path.startsWith('/tags/')) {
          return false
        }

        if (path === '/tags/' || path === '/tags') {
          return false
        }

        const clean = path.replace(/^\/tags\//, '').replace(/\/$/, '')

        return clean && clean.indexOf('/') === -1
      })

      /*
       * 按真实 URL 比较
       */

      const pathMatch = tagPages.find((page) => {
        const clean = String(page.path)
          .replace(/^\/tags\//, '')
          .replace(/\/$/, '')

        const pageTag = this.decodePathValue(clean)

        return pageTag === target
      })

      if (pathMatch && pathMatch.path) {
        return pathMatch.path
      }

      /*
       * 再按页面标题比较
       */

      const titleMatch = tagPages.find((page) => {
        const title = page.title || (page.frontmatter && page.frontmatter.title) || ''

        return this.normalizeTagName(title) === target
      })

      if (titleMatch && titleMatch.path) {
        return titleMatch.path
      }

      /*
       * 最终兜底
       */

      return `/tags/${encodeURIComponent(target)}/`
    },

    /* ==================================================
       完整 href

       当前项目 base：
       /bolg-l/
       ================================================== */

    getTagHref(tag) {
      const path = this.getTagPath(tag)

      const base = this.$site && this.$site.base ? this.$site.base : '/'

      return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
    },

    /* ==================================================
       tags 标准化
       ================================================== */

    normalizedTags(tags) {
      if (!tags) {
        return []
      }

      if (Array.isArray(tags)) {
        return tags
      }

      return [tags]
    },
  },
}
</script>

<style scoped>
/* =========================================================
   Hero
   ========================================================= */

.home-hero {
  position: relative;

  width: 100%;

  min-height: 440px;

  display: flex;

  align-items: center;

  box-sizing: border-box;
}

.home-hero-inner {
  width: 100%;

  max-width: 980px;

  margin: 0 auto;

  padding: 105px 40px 80px;

  box-sizing: border-box;

  text-align: left;
}

/* MY BLOG */

.home-hero-kicker {
  margin-bottom: 17px;

  color: #9aa39e;

  font-size: 12px;

  font-weight: 600;

  line-height: 1.5;

  letter-spacing: 0.18em;
}

/* 主标题 */

.home-hero h1 {
  margin: 0;

  color: #2c3e50;

  font-size: 46px;

  font-weight: 650;

  line-height: 1.25;

  letter-spacing: -0.025em;
}

/* Hero 标语 */

.home-hero-title {
  margin: 20px 0 0;

  color: #4b5563;

  font-size: 21px;

  font-weight: 500;

  line-height: 1.7;

  letter-spacing: 0.02em;
}

/* 描述 */

.home-hero-description {
  max-width: 650px;

  margin: 13px 0 0;

  color: #8a9190;

  font-size: 14px;

  line-height: 1.9;
}

/* 按钮 */

.home-hero-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 10px;

  margin-top: 27px;
}

.home-hero-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 92px;

  height: 36px;

  padding: 0 17px;

  box-sizing: border-box;

  border-radius: 18px;

  font-size: 13px;

  line-height: 1;

  text-decoration: none;

  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.home-hero-button.primary {
  border: 1px solid #3eaf7c;

  background: #3eaf7c;

  color: #fff;
}

.home-hero-button.primary:hover {
  transform: translateY(-2px);

  background: #359d6f;

  border-color: #359d6f;

  box-shadow: 0 6px 16px rgba(62, 175, 124, 0.12);

  text-decoration: none;
}

.home-hero-button.secondary {
  border: 1px solid #e5e8e7;

  background: rgba(255, 255, 255, 0.75);

  color: #666;
}

.home-hero-button.secondary:hover {
  transform: translateY(-2px);

  border-color: #cfe5d9;

  background: #f7fbf9;

  color: #3eaf7c;

  text-decoration: none;
}

/* =========================================================
   首页内容
   ========================================================= */

.home-content {
  width: 100%;
}

.home-content-inner {
  max-width: 880px;

  margin: 0 auto;

  padding: 18px 20px 80px;

  box-sizing: border-box;
}

/* =========================================================
   区域标题
   ========================================================= */

.home-section-heading {
  margin-bottom: 28px;
}

.home-section-kicker {
  margin-bottom: 7px;

  color: #a5aaa7;

  font-size: 10px;

  font-weight: 600;

  line-height: 1.5;

  letter-spacing: 0.16em;
}

.home-section-heading h2 {
  margin: 0;

  color: #2c3e50;

  font-size: 25px;

  font-weight: 600;

  line-height: 1.4;
}

.home-section-heading p {
  margin: 8px 0 0;

  color: #999;

  font-size: 13px;

  line-height: 1.7;
}

/* =========================================================
   文章列表
   ========================================================= */

.post-list {
  width: 100%;
}

/* =========================================================
   文章卡片
   ========================================================= */

.post-card {
  position: relative;

  margin-bottom: 18px;

  padding: 25px 28px 28px;

  box-sizing: border-box;

  border: 1px solid #eeeeee;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.86);

  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.post-card:hover {
  transform: translateY(-3px);

  border-color: #e1ebe5;

  background: rgba(255, 255, 255, 0.96);

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.045);
}

/* 日期 */

.post-card-date {
  margin-bottom: 8px;

  color: #aaa;

  font-size: 12px;

  line-height: 1.5;

  letter-spacing: 0.04em;
}

/* 标题 */

.post-card-title {
  margin: 0;

  font-size: 21px;

  font-weight: 600;

  line-height: 1.5;
}

.post-card-title a {
  color: #2c3e50;

  text-decoration: none;

  transition: color 0.2s ease;
}

.post-card-title a:hover {
  color: #3eaf7c;

  text-decoration: none;
}

/* 分类 / 标签 */

.post-card-meta {
  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 8px;

  margin-top: 10px;

  color: #aaa;

  font-size: 12px;

  line-height: 1.6;
}

.post-card-category {
  color: #3eaf7c;

  text-decoration: none;
}

.post-card-category:hover {
  color: #2f9568;

  text-decoration: none;
}

.post-card-separator {
  color: #d3d3d3;
}

.post-card-tag {
  color: #999;

  text-decoration: none;

  transition: color 0.2s ease;
}

.post-card-tag:hover {
  color: #3eaf7c;

  text-decoration: none;
}

/* 描述 */

.post-card-description {
  max-width: 720px;

  margin: 14px 0 0;

  color: #777;

  font-size: 14px;

  line-height: 1.85;
}

/* 阅读全文 */

.post-card-read {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  margin-top: 17px;

  color: #999;

  font-size: 13px;

  text-decoration: none;

  transition: color 0.2s ease, transform 0.2s ease;
}

.post-card-read-arrow {
  transition: transform 0.2s ease;
}

.post-card-read:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: translateX(2px);
}

.post-card-read:hover .post-card-read-arrow {
  transform: translateX(3px);
}

/* 没有文章 */

.post-empty {
  padding: 60px 20px;

  border: 1px solid #eeeeee;

  border-radius: 10px;

  color: #aaa;

  font-size: 14px;

  text-align: center;
}

/* =========================================================
   分页
   ========================================================= */

.home-pagination {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 14px;

  margin-top: 38px;
}

.pagination-pages {
  display: flex;

  align-items: center;

  gap: 6px;
}

.pagination-number {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 32px;

  height: 32px;

  border: 1px solid #eeeeee;

  border-radius: 50%;

  box-sizing: border-box;

  background: rgba(255, 255, 255, 0.82);

  color: #999;

  font-size: 12px;

  line-height: 1;

  text-decoration: none;

  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.pagination-number:hover {
  border-color: #d7e9df;

  background: #f7fbf9;

  color: #3eaf7c;

  text-decoration: none;

  transform: translateY(-1px);
}

.pagination-number.active {
  border-color: #3eaf7c;

  background: #3eaf7c;

  color: #fff;
}

.pagination-arrow {
  display: inline-flex;

  align-items: center;

  gap: 5px;

  color: #999;

  font-size: 12px;

  text-decoration: none;

  transition: color 0.2s ease, transform 0.2s ease;
}

.pagination-arrow:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: translateX(2px);
}

/* =========================================================
   手机
   ========================================================= */

@media (max-width: 719px) {
  .home-hero {
    min-height: auto;
  }

  .home-hero-inner {
    padding: 78px 20px 58px;
  }

  .home-hero-kicker {
    margin-bottom: 13px;

    font-size: 10px;
  }

  .home-hero h1 {
    font-size: 34px;

    line-height: 1.3;
  }

  .home-hero-title {
    margin-top: 15px;

    font-size: 17px;

    line-height: 1.7;
  }

  .home-hero-description {
    margin-top: 10px;

    font-size: 13px;

    line-height: 1.85;
  }

  .home-hero-actions {
    margin-top: 22px;

    gap: 8px;
  }

  .home-hero-button {
    min-width: 86px;

    height: 34px;

    padding: 0 14px;

    font-size: 12px;
  }

  .home-content-inner {
    padding: 8px 18px 60px;
  }

  .home-section-heading {
    margin-bottom: 20px;
  }

  .home-section-heading h2 {
    font-size: 22px;
  }

  .home-section-heading p {
    font-size: 12px;
  }

  .post-card {
    margin-bottom: 12px;

    padding: 21px 18px 24px;

    border-radius: 8px;
  }

  .post-card:hover {
    transform: none;

    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.035);
  }

  .post-card-title {
    font-size: 19px;

    line-height: 1.5;
  }

  .post-card-meta {
    gap: 6px;

    margin-top: 8px;

    font-size: 11px;
  }

  .post-card-description {
    margin-top: 12px;

    font-size: 13px;

    line-height: 1.8;
  }

  .post-card-read {
    margin-top: 15px;

    font-size: 12px;
  }

  .home-pagination {
    gap: 10px;

    margin-top: 30px;
  }

  .pagination-number {
    width: 30px;

    height: 30px;

    font-size: 11px;
  }

  .pagination-arrow {
    font-size: 11px;
  }
}
</style>
