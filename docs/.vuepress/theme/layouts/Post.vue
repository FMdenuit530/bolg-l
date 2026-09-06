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

          <!-- 标签 -->

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
          <li v-for="header in $page.headers" :key="header.slug" :class="'toc-level-' + header.level">
            <a :href="'#' + header.slug">
              {{ header.title }}
            </a>
          </li>
        </ul>
      </aside>
    </template>

    <!-- =========================
         文章底部上一篇 / 下一篇
         ========================= -->

    <template slot="page-bottom">
      <div class="post-navigation">
        <!-- 上一篇 -->

        <router-link v-if="previousPost" :to="previousPost.path" class="post-navigation-card previous">
          <div class="navigation-label">← 上一篇</div>

          <div class="navigation-title">
            {{ previousPost.title }}
          </div>
        </router-link>

        <div v-else class="post-navigation-placeholder"></div>

        <!-- 下一篇 -->

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

  /* =========================
     页面数据
     ========================= */

  data() {
    return {
      // 阅读进度
      readingProgress: 0,

      // 是否显示返回顶部
      showBackTop: false,
    }
  },

  /* =========================
     计算属性
     ========================= */

  computed: {
    blogPosts() {
      return this.$site.pages
        .filter((page) => {
          // 只处理真正的文章页面
          return page.path.startsWith('/posts/') && page.frontmatter && page.frontmatter.date
        })
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date).getTime()
          const dateB = new Date(b.frontmatter.date).getTime()

          // 日期相同的时候，用路径保证顺序稳定
          if (dateA === dateB) {
            return a.path.localeCompare(b.path)
          }

          // 最新文章在前
          return dateB - dateA
        })
    },

    currentPostIndex() {
      return this.blogPosts.findIndex((post) => post.path === this.$page.path)
    },

    previousPost() {
      // 当前文章后面的文章 = 更旧的文章
      if (this.currentPostIndex === -1 || this.currentPostIndex >= this.blogPosts.length - 1) {
        return null
      }

      return this.blogPosts[this.currentPostIndex + 1]
    },

    nextPost() {
      // 当前文章前面的文章 = 更新的文章
      if (this.currentPostIndex <= 0) {
        return null
      }

      return this.blogPosts[this.currentPostIndex - 1]
    },
  },

  /* =========================
     页面加载
     ========================= */

  mounted() {
    window.addEventListener('scroll', this.handleScroll)

    this.handleScroll()
  },

  /* =========================
     页面销毁
     ========================= */

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    /* =========================
       阅读进度
       ========================= */

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

    /* =========================
       返回顶部
       ========================= */

    backToTop() {
      window.scrollTo({
        top: 0,

        behavior: 'smooth',
      })
    },

    /* =========================
       日期格式化
       ========================= */

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

    /* =========================
       分类地址
       ========================= */

    getCategoryPath(category) {
      return `/category/${encodeURIComponent(category)}/`
    },

    /* =========================
       标签地址
       ========================= */

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

  padding: 60px 40px 20px;

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
   日期和分类
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

  padding: 18px;

  border-left: 1px solid #eaecef;

  background: #fff;

  box-sizing: border-box;
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

.post-toc li {
  margin: 8px 0;
}

.post-toc a {
  display: block;

  color: #999;

  font-size: 13px;

  line-height: 1.5;

  text-decoration: none;

  transition: color 0.2s ease;
}

.post-toc a:hover {
  color: #3eaf7c;
}

/* 二级标题 */

.post-toc .toc-level-3 {
  padding-left: 12px;
}

.post-toc .toc-level-4 {
  padding-left: 24px;
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
   手机端
   ========================= */

@media (max-width: 719px) {
  .post-header-inner {
    padding: 40px 20px 15px;
  }

  .post-header-inner h1 {
    font-size: 1.8rem;
  }

  .back-top {
    right: 18px;

    bottom: 20px;

    width: 38px;

    height: 38px;

    line-height: 36px;
  }

  .post-navigation {
    grid-template-columns: 1fr;

    gap: 12px;

    margin-top: 35px;

    padding: 0 20px;
  }

  .post-navigation-placeholder {
    display: none;
  }
}

/* =========================
   平板 / 小屏幕隐藏目录
   ========================= */

@media (max-width: 1200px) {
  .post-toc {
    display: none;
  }
}
</style>
