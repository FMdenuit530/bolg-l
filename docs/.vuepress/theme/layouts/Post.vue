<template>
  <ParentLayout>
    <template slot="page-top">
      <!-- =========================
           阅读进度条
           ========================= -->

      <div class="reading-progress">
        <div class="reading-progress-bar" :style="{ width: readingProgress + '%' }"></div>
      </div>

      <!-- =========================
           返回顶部
           ========================= -->

      <button v-show="showBackTop" class="back-top" type="button" @click="backToTop" aria-label="返回顶部">↑</button>

      <!-- =========================
           文章头部
           ========================= -->

      <div class="post-header">
        <div class="post-header-inner">
          <h1>
            {{ $page.title }}
          </h1>

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

          <div v-if="$page.frontmatter.tags" class="post-tags">
            <router-link v-for="tag in $page.frontmatter.tags" :key="tag" :to="getTagPath(tag)" class="tag"> # {{ tag }} </router-link>
          </div>
        </div>
      </div>

      <!-- =========================
           文章目录
           ========================= -->

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

    <template slot="page-bottom">
      <!-- =========================
           上一篇 / 下一篇
           ========================= -->

      <div class="post-navigation">
        <router-link v-if="previousPost" :to="previousPost.path" class="post-navigation-card previous">
          <div class="navigation-label">← 上一篇</div>

          <div class="navigation-title">
            {{ previousPost.title }}
          </div>
        </router-link>

        <div v-else class="post-navigation-placeholder"></div>

        <router-link v-if="nextPost" :to="nextPost.path" class="post-navigation-card next">
          <div class="navigation-label">下一篇 →</div>

          <div class="navigation-title">
            {{ nextPost.title }}
          </div>
        </router-link>

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
     * ========================================
     * 所有博客文章
     * ========================================
     */

    blogPosts() {
      return this.$site.pages
        .filter((page) => {
          return page.path.startsWith('/posts/') && page.frontmatter && page.frontmatter.date
        })
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date).getTime()

          const dateB = new Date(b.frontmatter.date).getTime()

          if (dateA === dateB) {
            return a.path.localeCompare(b.path)
          }

          return dateB - dateA
        })
    },

    /*
     * ========================================
     * 当前文章位置
     * ========================================
     */

    currentPostIndex() {
      return this.blogPosts.findIndex((post) => post.path === this.$page.path)
    },

    /*
     * ========================================
     * 上一篇
     * ========================================
     */

    previousPost() {
      if (this.currentPostIndex === -1 || this.currentPostIndex >= this.blogPosts.length - 1) {
        return null
      }

      return this.blogPosts[this.currentPostIndex + 1]
    },

    /*
     * ========================================
     * 下一篇
     * ========================================
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
     * 初始化
     */

    this.handleScroll()

    /*
     * 初始化目录观察
     */

    this.$nextTick(() => {
      this.initTocObserver()
    })
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)

    /*
     * 销毁目录观察器
     */

    if (this.tocObserver) {
      this.tocObserver.disconnect()
      this.tocObserver = null
    }
  },

  methods: {
    /*
     * ========================================
     * 滚动监听
     * ========================================
     */

    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

      if (documentHeight <= 0) {
        this.readingProgress = 0

        this.showBackTop = false

        return
      }

      this.readingProgress = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100))

      this.showBackTop = scrollTop > 300
    },

    /*
     * ========================================
     * 返回顶部
     * ========================================
     */

    backToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },

    /*
     * ========================================
     * 初始化 TOC Observer
     * ========================================
     */

    initTocObserver() {
      if (typeof window === 'undefined') {
        return
      }

      if (!this.$page.headers || !this.$page.headers.length) {
        return
      }

      /*
       * 不支持 IntersectionObserver
       */

      if (!('IntersectionObserver' in window)) {
        return
      }

      /*
       * 如果之前存在
       * 先销毁
       */

      if (this.tocObserver) {
        this.tocObserver.disconnect()

        this.tocObserver = null
      }

      /*
       * 创建观察器
       */

      this.tocObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          if (visible.length) {
            this.activeToc = visible[0].target.id

            return
          }

          /*
           * 当前没有元素完全进入观察区时，
           * 找距离顶部最近的标题
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
           * 顶部预留导航栏空间
           */

          rootMargin: '-90px 0px -65% 0px',

          threshold: [0, 0.1, 0.5, 1],
        },
      )

      /*
       * 开始观察所有标题
       */

      this.$page.headers.forEach((header) => {
        const element = document.getElementById(header.slug)

        if (element) {
          this.tocObserver.observe(element)
        }
      })

      /*
       * 初始状态
       */

      if (this.$page.headers.length) {
        this.activeToc = this.$page.headers[0].slug
      }
    },

    /*
     * ========================================
     * 点击目录平滑滚动
     * ========================================
     */

    scrollToHeading(slug) {
      const element = document.getElementById(slug)

      if (!element) {
        return
      }

      const navbarHeight = 80

      const rect = element.getBoundingClientRect()

      const top = window.pageYOffset + rect.top - navbarHeight

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      })

      this.activeToc = slug

      /*
       * 修改 URL hash
       */

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#' + slug)
      }
    },

    /*
     * ========================================
     * 日期格式
     * ========================================
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
     * ========================================
     * 分类地址
     * ========================================
     */

    getCategoryPath(category) {
      return `/category/${encodeURIComponent(category)}/`
    },

    /*
     * ========================================
     * 标签地址
     * ========================================
     */

    getTagPath(tag) {
      return `/tags/${encodeURIComponent(tag)}/`
    },
  },
}
</script>

<style scoped>
/* =========================
   文章头部
   ========================= */

.post-header {
  width: 100%;
}

.post-header-inner {
  max-width: 820px;
  margin: 0 auto;
  padding: 92px 40px 20px;
  box-sizing: border-box;
  text-align: left;
}

.post-header-inner h1 {
  margin-top: 0;
  margin-bottom: 18px;

  color: #2c3e50;

  font-size: 2.2rem;

  line-height: 1.4;

  text-align: left;
}

/* =========================
   文章元信息
   ========================= */

.post-meta {
  display: flex;

  align-items: center;

  color: #999;

  font-size: 14px;
}

.post-category {
  display: flex;

  align-items: center;
}

.post-category a {
  color: #3eaf7c;

  text-decoration: none;
}

.post-category a:hover {
  color: #2c3e50;
}

.separator {
  margin: 0 10px;

  color: #ccc;
}

/* =========================
   标签
   ========================= */

.post-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 18px;
}

.tag {
  display: inline-block;

  padding: 4px 10px;

  border-radius: 4px;

  background: #f5f5f5;

  color: #666;

  font-size: 12px;

  text-decoration: none;

  transition: background 0.2s ease, color 0.2s ease;
}

.tag:hover {
  background: #e8f5ef;

  color: #3eaf7c;
}

/* =========================
   文章目录
   ========================= */

.post-toc {
  position: fixed;

  top: 120px;

  right: 30px;

  width: 220px;

  max-height: calc(100vh - 160px);

  padding: 18px;

  border-left: 1px solid #eaecef;

  background: rgba(255, 255, 255, 0.94);

  box-sizing: border-box;

  overflow-y: auto;
}

.toc-title {
  margin-bottom: 12px;

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
  margin: 4px 0;
}

.post-toc a {
  display: block;

  padding: 4px 8px;

  border-left: 2px solid transparent;

  color: #999;

  font-size: 13px;

  line-height: 1.5;

  text-decoration: none;

  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.post-toc a:hover {
  color: #3eaf7c;
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

/* =========================
   阅读进度条
   ========================= */

.reading-progress {
  position: fixed;

  top: 0;

  left: 0;

  z-index: 9999;

  width: 100%;

  height: 3px;

  pointer-events: none;
}

.reading-progress-bar {
  height: 100%;

  background: #3eaf7c;

  transition: width 0.1s ease;
}

/* =========================
   返回顶部
   ========================= */

.back-top {
  position: fixed;

  right: 30px;

  bottom: 30px;

  z-index: 1000;

  width: 42px;

  height: 42px;

  padding: 0;

  border: 1px solid #eaecef;

  border-radius: 50%;

  background: #fff;

  color: #3eaf7c;

  font-size: 20px;

  line-height: 40px;

  text-align: center;

  cursor: pointer;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.back-top:hover {
  transform: translateY(-3px);

  background: #f8faf9;

  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.12);
}

/* =========================
   上一篇 / 下一篇
   ========================= */

.post-navigation {
  max-width: 820px;

  margin: 45px auto 20px;

  padding: 0 40px;

  box-sizing: border-box;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 20px;
}

.post-navigation-card {
  display: block;

  min-height: 95px;

  padding: 20px 22px;

  box-sizing: border-box;

  border: 1px solid #eaecef;

  border-radius: 10px;

  background: #fff;

  text-decoration: none;

  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.post-navigation-card:hover {
  transform: translateY(-3px);

  border-color: #d7eee3;

  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);

  text-decoration: none;
}

.navigation-label {
  margin-bottom: 10px;

  color: #999;

  font-size: 13px;
}

.navigation-title {
  color: #2c3e50;

  font-size: 15px;

  font-weight: 500;

  line-height: 1.6;
}

.post-navigation-card:hover .navigation-title {
  color: #3eaf7c;
}

.post-navigation-placeholder {
  min-height: 95px;
}

/* =========================
   移动端
   ========================= */

/* =========================
   平板
   769px - 1200px
   ========================= */

@media (max-width: 1200px) and (min-width: 769px) {
  /*
   * 右侧目录
   */

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

  /*
   * 文章头部
   *
   * 给右侧目录留出空间
   */

  .post-header-inner {
    max-width: none;

    width: calc(100% - 250px);

    margin-left: 30px;

    margin-right: 220px;

    padding: 92px 20px 20px;

    box-sizing: border-box;
  }

  /*
   * 正文区域
   *
   * VuePress 默认正文容器
   */

  .theme-default-content {
    max-width: none;

    width: calc(100% - 250px);

    margin-left: 30px;

    margin-right: 220px;

    box-sizing: border-box;
  }

  /*
   * 上一篇 / 下一篇
   */

  .post-navigation {
    max-width: none;

    width: calc(100% - 250px);

    margin-left: 30px;

    margin-right: 220px;

    padding: 0 20px;

    box-sizing: border-box;
  }

  /*
   * 目录文字稍微紧凑一些
   */

  .post-toc a {
    font-size: 12px;

    line-height: 1.55;
  }

  .toc-title {
    font-size: 13px;
  }
}

/* =========================
   手机
   768px 以下
   ========================= */

@media (max-width: 768px) {
  /*
   * 手机隐藏目录
   */

  .post-toc {
    display: none;
  }

  /*
   * 文章头部恢复全宽
   */

  .post-header-inner {
    width: 100%;

    max-width: 820px;

    margin: 0 auto;

    padding: 84px 20px 18px;

    box-sizing: border-box;
  }

  .post-header-inner h1 {
    font-size: 1.8rem;
  }

  /*
   * 正文恢复默认宽度
   */

  .theme-default-content {
    width: auto;

    margin-left: auto;

    margin-right: auto;
  }

  /*
   * 返回顶部
   */

  .back-top {
    right: 18px;

    bottom: 20px;

    width: 38px;

    height: 38px;

    line-height: 36px;
  }

  /*
   * 上一篇 / 下一篇
   */

  .post-navigation {
    width: auto;

    margin: 35px 0 20px;

    padding: 0 20px;

    grid-template-columns: 1fr;

    gap: 12px;
  }

  .post-navigation-placeholder {
    display: none;
  }
}
</style>
