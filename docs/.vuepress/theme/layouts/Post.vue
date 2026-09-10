<template>
  <ParentLayout>
    <template slot="page-top">
      <!-- ==================================================
           阅读进度条
           ================================================== -->

      <div class="reading-progress">
        <div
          class="reading-progress-bar"
          :style="{
            width: readingProgress + '%',
          }"
        ></div>
      </div>

      <!-- ==================================================
           返回顶部
           ================================================== -->

      <button v-show="showBackTop" class="back-top" type="button" @click="backToTop" aria-label="返回顶部">↑</button>

      <!-- ==================================================
           文章头部
           ================================================== -->

      <div class="post-header">
        <div class="post-header-inner">
          <h1>
            {{ $page.title }}
          </h1>

          <!-- 日期 / 分类 -->

          <div class="post-meta">
            <span v-if="$page.frontmatter.date" class="post-date">
              {{ formatDate($page.frontmatter.date) }}
            </span>

            <span v-if="$page.frontmatter.category" class="post-category">
              <span class="separator"> · </span>

              <router-link :to="getCategoryPath($page.frontmatter.category)">
                {{ $page.frontmatter.category }}
              </router-link>
            </span>
          </div>

          <!-- ==================================================
               标签

               这里必须使用 router-link。
               不使用普通 a 标签。
               ================================================== -->

          <div v-if="normalizedTags($page.frontmatter.tags).length" class="post-tags">
            <router-link v-for="tag in normalizedTags($page.frontmatter.tags)" :key="tag" :to="getTagPath(tag)" class="tag"> # {{ tag }} </router-link>
          </div>
        </div>
      </div>

      <!-- ==================================================
           文章目录
           ================================================== -->

      <aside v-if="$page.headers && $page.headers.length" class="post-toc">
        <div class="toc-title">文章目录</div>

        <ul>
          <li
            v-for="header in $page.headers"
            :key="header.slug"
            :class="[
              'toc-item',
              'toc-level-' + header.level,
              {
                active: activeToc === header.slug,
              },
            ]"
          >
            <a :href="'#' + header.slug" @click.prevent="scrollToHeading(header.slug)">
              {{ header.title }}
            </a>
          </li>
        </ul>
      </aside>
    </template>

    <!-- ==================================================
         上一篇 / 下一篇
         ================================================== -->

    <template slot="page-bottom">
      <div v-if="previousPost || nextPost" class="post-navigation">
        <!-- 上一篇 -->

        <router-link v-if="previousPost" :to="previousPost.path" class="post-navigation-card previous">
          <div class="navigation-label">上一篇</div>

          <div class="navigation-title">
            {{ previousPost.title }}
          </div>

          <div class="navigation-arrow">←</div>
        </router-link>

        <!-- 没有上一篇 -->

        <div v-else class="post-navigation-placeholder"></div>

        <!-- 下一篇 -->

        <router-link v-if="nextPost" :to="nextPost.path" class="post-navigation-card next">
          <div class="navigation-label">下一篇</div>

          <div class="navigation-title">
            {{ nextPost.title }}
          </div>

          <div class="navigation-arrow">→</div>
        </router-link>

        <!-- 没有下一篇 -->

        <div v-else class="post-navigation-placeholder"></div>
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  components: {
    ParentLayout,
  },

  data() {
    return {
      readingProgress: 0,

      showBackTop: false,

      /*
       * 当前正在阅读的标题
       */
      activeToc: '',

      /*
       * IntersectionObserver
       */
      tocObserver: null,
    }
  },

  computed: {
    /*
     * ==================================================
     * 所有博客文章
     * ==================================================
     */

    blogPosts() {
      return this.$site.pages

        .filter((page) => {
          return page.path.startsWith('/posts/') && page.frontmatter && page.frontmatter.date
        })

        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date).getTime()

          const dateB = new Date(b.frontmatter.date).getTime()

          /*
           * 日期相同的时候，
           * 再按照路径排序。
           */

          if (dateA === dateB) {
            return a.path.localeCompare(b.path)
          }

          return dateB - dateA
        })
    },

    /*
     * ==================================================
     * 当前文章位置
     * ==================================================
     */

    currentPostIndex() {
      return this.blogPosts.findIndex((post) => post.path === this.$page.path)
    },

    /*
     * ==================================================
     * 上一篇
     * ==================================================
     */

    previousPost() {
      if (this.currentPostIndex === -1 || this.currentPostIndex >= this.blogPosts.length - 1) {
        return null
      }

      return this.blogPosts[this.currentPostIndex + 1]
    },

    /*
     * ==================================================
     * 下一篇
     * ==================================================
     */

    nextPost() {
      if (this.currentPostIndex <= 0) {
        return null
      }

      return this.blogPosts[this.currentPostIndex - 1]
    },
  },

  mounted() {
    /*
     * 滚动监听
     */

    window.addEventListener('scroll', this.handleScroll, {
      passive: true,
    })

    /*
     * 初始化阅读进度
     */

    this.handleScroll()

    /*
     * 初始化目录
     */

    this.$nextTick(() => {
      this.initTocObserver()
    })
  },

  beforeDestroy() {
    /*
     * 移除滚动监听
     */

    window.removeEventListener('scroll', this.handleScroll)

    /*
     * 销毁目录观察
     */

    if (this.tocObserver) {
      this.tocObserver.disconnect()

      this.tocObserver = null
    }
  },

  methods: {
    /*
     * ==================================================
     * 滚动监听
     * ==================================================
     */

    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

      /*
       * 页面没有产生滚动
       */

      if (documentHeight <= 0) {
        this.readingProgress = 0

        this.showBackTop = false

        return
      }

      /*
       * 阅读进度百分比
       */

      this.readingProgress = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100))

      /*
       * 超过 300px 显示返回顶部
       */

      this.showBackTop = scrollTop > 300
    },

    /*
     * ==================================================
     * 返回顶部
     * ==================================================
     */

    backToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },

    /*
     * ==================================================
     * 初始化 TOC
     * ==================================================
     */

    initTocObserver() {
      if (typeof window === 'undefined') {
        return
      }

      if (!this.$page.headers || !this.$page.headers.length) {
        return
      }

      /*
       * 浏览器不支持
       */

      if (!('IntersectionObserver' in window)) {
        return
      }

      /*
       * 销毁旧 Observer
       */

      if (this.tocObserver) {
        this.tocObserver.disconnect()

        this.tocObserver = null
      }

      /*
       * 创建 Observer
       */

      this.tocObserver = new IntersectionObserver(
        (entries) => {
          /*
           * 当前进入观察区域的标题
           */

          const visible = entries

            .filter((entry) => entry.isIntersecting)

            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          if (visible.length) {
            this.activeToc = visible[0].target.id

            return
          }

          /*
           * 如果没有标题直接进入观察区，
           * 找距离顶部最近的标题。
           */

          const candidates = entries

            .map((entry) => ({
              id: entry.target.id,

              top: Math.abs(entry.boundingClientRect.top),
            }))

            .sort((a, b) => a.top - b.top)

          if (candidates.length) {
            this.activeToc = candidates[0].id
          }
        },
        {
          root: null,

          /*
           * 为顶部导航留空间
           */

          rootMargin: '-90px 0px -65% 0px',

          threshold: [0, 0.1, 0.5, 1],
        },
      )

      /*
       * 观察所有标题
       */

      this.$page.headers.forEach((header) => {
        const element = document.getElementById(header.slug)

        if (element) {
          this.tocObserver.observe(element)
        }
      })

      /*
       * 默认选中第一个标题
       */

      if (this.$page.headers.length) {
        this.activeToc = this.$page.headers[0].slug
      }
    },

    /*
     * ==================================================
     * TOC 点击滚动
     * ==================================================
     */

    scrollToHeading(slug) {
      const element = document.getElementById(slug)

      if (!element) {
        return
      }

      /*
       * 顶部导航高度
       */

      const navbarHeight = 80

      const rect = element.getBoundingClientRect()

      const top = window.pageYOffset + rect.top - navbarHeight

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      })

      /*
       * 更新当前目录
       */

      this.activeToc = slug

      /*
       * 更新 hash
       */

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#' + slug)
      }
    },

    /*
     * ==================================================
     * 日期格式
     * ==================================================
     */

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

    /*
     * ==================================================
     * 分类地址
     * ==================================================
     */

    getCategoryPath(category) {
      const value = String(category == null ? '' : category).trim()

      if (!value) {
        return '/category/'
      }

      /*
       * 注意：
       *
       * 不在这里手动编码。
       *
       * router-link 会负责
       * Vue Router 的路径处理。
       */

      return `/category/${value}/`
    },

    /*
     * ==================================================
     * 标签地址
     * ==================================================
     *
     * 关键修复：
     *
     * 不再使用：
     *
     * encodeURIComponent(tag)
     *
     * 也不再使用：
     *
     * <a href="">
     *
     * 而是直接生成 VuePress
     * 内部路由：
     *
     * /tags/闭包/
     *
     * 再交给 router-link 处理。
     * ==================================================
     */

    getTagPath(tag) {
      const value = String(tag == null ? '' : tag).trim()

      if (!value) {
        return '/tags/'
      }

      return `/tags/${value}/`
    },

    /*
     * ==================================================
     * tags 标准化
     * ==================================================
     *
     * 支持：
     *
     * tags:
     *   - JavaScript
     *   - 闭包
     *
     * 也兼容：
     *
     * tags: JavaScript
     * ==================================================
     */

    normalizedTags(tags) {
      if (!tags) {
        return []
      }

      if (Array.isArray(tags)) {
        return tags.map((tag) => String(tag == null ? '' : tag).trim()).filter(Boolean)
      }

      const value = String(tags).trim()

      return value ? [value] : []
    },
  },
}
</script>

<style scoped>
/* =========================================================
   文章头部
   ========================================================= */

.post-header {
  position: relative;

  width: 100%;
}

.post-header-inner {
  max-width: 880px;

  margin: 0 auto;

  padding: 88px 20px 26px;

  box-sizing: border-box;

  text-align: left;
}

.post-header-inner h1 {
  margin: 0 0 18px;

  color: #2c3e50;

  font-size: 2.35rem;

  font-weight: 650;

  line-height: 1.38;

  letter-spacing: -0.015em;

  text-align: left;
}

/* 标题底部短线 */

.post-header-inner::after {
  content: '';

  display: block;

  width: 46px;

  height: 2px;

  margin-top: 22px;

  border-radius: 2px;

  background: #3eaf7c;

  opacity: 0.7;
}

/* =========================================================
   元信息
   ========================================================= */

.post-meta {
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  min-height: 24px;

  color: #a0a0a0;

  font-size: 13px;

  line-height: 1.6;
}

.post-date {
  color: #999;

  letter-spacing: 0.02em;
}

.post-category {
  display: flex;

  align-items: center;
}

.post-category a {
  color: #3eaf7c;

  text-decoration: none;

  transition: color 0.2s ease;
}

.post-category a:hover {
  color: #2c3e50;

  text-decoration: none;
}

.separator {
  margin: 0 10px;

  color: #d5d5d5;
}

/* =========================================================
   标签
   ========================================================= */

.post-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;

  margin-top: 16px;
}

.tag {
  display: inline-flex;

  align-items: center;

  padding: 4px 9px;

  border: 1px solid #eeeeee;

  border-radius: 5px;

  background: rgba(248, 250, 249, 0.8);

  color: #888;

  font-size: 12px;

  line-height: 1.4;

  text-decoration: none;

  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.tag:hover {
  border-color: #d8ebe1;

  background: #f4faf7;

  color: #3eaf7c;

  transform: translateY(-1px);

  text-decoration: none;
}

/* =========================================================
   文章目录
   ========================================================= */

.post-toc {
  position: fixed;

  top: 120px;

  right: 26px;

  width: 210px;

  max-height: calc(100vh - 160px);

  padding: 16px 14px;

  box-sizing: border-box;

  border-left: 1px solid #eeeeee;

  background: rgba(255, 255, 255, 0.92);

  overflow-y: auto;
}

.toc-title {
  margin-bottom: 13px;

  color: #2c3e50;

  font-size: 14px;

  font-weight: 600;
}

.post-toc ul {
  margin: 0;

  padding: 0;

  list-style: none;
}

.toc-item {
  margin: 3px 0;
}

.post-toc a {
  display: block;

  padding: 5px 7px;

  border-left: 2px solid transparent;

  color: #999;

  font-size: 13px;

  line-height: 1.55;

  text-decoration: none;

  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.post-toc a:hover {
  color: #3eaf7c;

  text-decoration: none;
}

.toc-item.active > a {
  border-left-color: #3eaf7c;

  background: #f8faf9;

  color: #3eaf7c;

  font-weight: 500;
}

.toc-level-3 {
  padding-left: 12px;
}

.toc-level-4 {
  padding-left: 24px;
}

.toc-level-5 {
  padding-left: 36px;
}

/* =========================================================
   阅读进度
   ========================================================= */

.reading-progress {
  position: fixed;

  top: 0;

  left: 0;

  z-index: 9999;

  width: 100%;

  height: 2px;

  pointer-events: none;

  background: rgba(0, 0, 0, 0.025);
}

.reading-progress-bar {
  height: 100%;

  background: #3eaf7c;

  box-shadow: 0 0 6px rgba(62, 175, 124, 0.18);

  transition: width 0.08s linear;
}

/* =========================================================
   返回顶部
   ========================================================= */

.back-top {
  position: fixed;

  right: 28px;

  bottom: 28px;

  z-index: 1000;

  width: 40px;

  height: 40px;

  padding: 0;

  border: 1px solid #e6e9eb;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.94);

  color: #8b9a92;

  font-size: 17px;

  font-weight: 400;

  line-height: 38px;

  text-align: center;

  cursor: pointer;

  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.06);

  backdrop-filter: blur(8px);

  -webkit-backdrop-filter: blur(8px);

  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.back-top:hover {
  transform: translateY(-3px);

  border-color: #d8ebe1;

  background: #f7fbf9;

  color: #3eaf7c;

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
}

/* =========================================================
   上一篇 / 下一篇
   ========================================================= */

.post-navigation {
  max-width: 880px;

  margin: 58px auto 36px;

  padding: 0 20px;

  box-sizing: border-box;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 18px;
}

.post-navigation-card {
  position: relative;

  display: block;

  min-height: 116px;

  padding: 22px 56px 22px 22px;

  box-sizing: border-box;

  border: 1px solid #eeeeee;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.82);

  text-decoration: none;

  overflow: hidden;

  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.post-navigation-card::before {
  content: '';

  position: absolute;

  left: 0;

  top: 0;

  bottom: 0;

  width: 2px;

  background: #3eaf7c;

  opacity: 0;

  transition: opacity 0.22s ease;
}

.post-navigation-card:hover {
  transform: translateY(-3px);

  border-color: #dfece5;

  background: rgba(255, 255, 255, 0.97);

  box-shadow: 0 9px 26px rgba(0, 0, 0, 0.045);

  text-decoration: none;
}

.post-navigation-card:hover::before {
  opacity: 1;
}

.navigation-label {
  margin-bottom: 9px;

  color: #aaa;

  font-size: 12px;

  line-height: 1.5;

  letter-spacing: 0.02em;
}

.navigation-title {
  color: #374151;

  font-size: 15px;

  font-weight: 600;

  line-height: 1.7;

  transition: color 0.2s ease;
}

.post-navigation-card:hover .navigation-title {
  color: #3eaf7c;
}

.navigation-arrow {
  position: absolute;

  top: 50%;

  right: 21px;

  color: #b9c0bd;

  font-size: 19px;

  line-height: 1;

  transform: translateY(-50%);

  transition: color 0.2s ease, transform 0.2s ease;
}

.post-navigation-card.previous:hover .navigation-arrow {
  color: #3eaf7c;

  transform: translate(-3px, -50%);
}

/* 下一篇 */

.post-navigation-card.next {
  padding-left: 56px;

  padding-right: 22px;

  text-align: right;
}

.post-navigation-card.next::before {
  left: auto;

  right: 0;
}

.post-navigation-card.next .navigation-arrow {
  right: auto;

  left: 21px;
}

.post-navigation-card.next:hover .navigation-arrow {
  color: #3eaf7c;

  transform: translate(3px, -50%);
}

/* 占位 */

.post-navigation-placeholder {
  min-height: 116px;

  visibility: hidden;

  pointer-events: none;
}

/* =========================================================
   平板
   ========================================================= */

@media (max-width: 1200px) and (min-width: 769px) {
  .post-toc {
    position: fixed;

    top: 110px;

    right: 16px;

    width: 190px;

    max-height: calc(100vh - 140px);

    padding: 14px;

    background: rgba(255, 255, 255, 0.96);

    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
  }

  .post-header-inner {
    max-width: none;

    width: calc(100% - 250px);

    margin-left: 30px;

    margin-right: 220px;

    padding: 92px 20px 20px;
  }

  .post-navigation {
    max-width: none;

    width: calc(100% - 250px);

    margin-left: 30px;

    margin-right: 220px;

    padding: 0 20px;
  }

  .post-toc a {
    font-size: 12px;

    line-height: 1.55;
  }

  .toc-title {
    font-size: 13px;
  }
}

/* =========================================================
   手机
   ========================================================= */

@media (max-width: 768px) {
  .post-toc {
    display: none;
  }

  .post-header-inner {
    width: 100%;

    max-width: 820px;

    margin: 0 auto;

    padding: 82px 20px 22px;

    box-sizing: border-box;
  }

  .post-header-inner h1 {
    margin-bottom: 14px;

    font-size: 1.85rem;

    line-height: 1.4;

    word-break: break-word;
  }

  .post-header-inner::after {
    width: 38px;

    margin-top: 18px;
  }

  .post-meta {
    font-size: 12px;
  }

  .post-tags {
    margin-top: 14px;

    gap: 6px;
  }

  .tag {
    padding: 3px 8px;

    font-size: 11px;
  }

  .back-top {
    right: 17px;

    bottom: 18px;

    width: 38px;

    height: 38px;

    font-size: 16px;

    line-height: 36px;
  }

  .post-navigation {
    width: auto;

    margin: 40px 0 24px;

    padding: 0 20px;

    grid-template-columns: 1fr;

    gap: 10px;
  }

  .post-navigation-card {
    min-height: 94px;

    padding: 18px 48px 18px 18px;

    border-radius: 8px;
  }

  .post-navigation-card.next {
    padding-left: 48px;

    padding-right: 18px;
  }

  .navigation-label {
    margin-bottom: 7px;

    font-size: 11px;
  }

  .navigation-title {
    font-size: 14px;

    line-height: 1.65;
  }

  .navigation-arrow {
    right: 17px;

    font-size: 17px;
  }

  .post-navigation-card.next .navigation-arrow {
    left: 17px;

    right: auto;
  }

  .post-navigation-placeholder {
    display: none;
  }
}
</style>
