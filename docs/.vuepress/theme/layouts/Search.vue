<template>
  <ParentLayout>
    <template slot="page-top">
      <main class="search-page">
        <!-- ========================================
             页面头部
             ======================================== -->

        <header class="search-header">
          <div class="search-eyebrow">SEARCH</div>

          <h1 class="search-title">搜索文章</h1>

          <p class="search-description">搜索文章标题、简介、分类或标签</p>
        </header>

        <!-- ========================================
             搜索框
             ======================================== -->

        <form class="search-form" @submit.prevent="submitSearch">
          <input v-model="inputKeyword" class="search-input" type="search" placeholder="输入关键词，例如 Promise、Vue、闭包..." autocomplete="off" spellcheck="false" />

          <button class="search-button" type="submit">搜索</button>
        </form>

        <!-- ========================================
             有关键词
             ======================================== -->

        <section v-if="hasKeyword" class="search-results">
          <div class="search-results-header">
            <h2>搜索结果</h2>

            <span> 找到 {{ searchResults.length }} 篇文章 </span>
          </div>

          <!-- 有结果 -->

          <div v-if="searchResults.length" class="search-results-list">
            <article v-for="post in searchResults" :key="post.path" class="search-result-item">
              <!-- 日期 / 分类 -->

              <div class="search-result-meta">
                <span>
                  {{ formatDate(post.frontmatter.date) }}
                </span>

                <span v-if="post.frontmatter.category" class="search-result-category">
                  <span class="search-meta-dot"> · </span>

                  {{ post.frontmatter.category }}
                </span>
              </div>

              <!-- 标题 -->

              <router-link :to="post.path" class="search-result-title">
                {{ post.title }}
              </router-link>

              <!-- 简介 -->

              <p v-if="post.frontmatter.description" class="search-result-description">
                {{ post.frontmatter.description }}
              </p>

              <!-- 标签 -->

              <div v-if="getPostTags(post).length" class="search-result-tags">
                <router-link v-for="tag in getPostTags(post)" :key="tag" :to="getTagPath(tag)" class="search-result-tag"> # {{ tag }} </router-link>
              </div>

              <!-- 阅读 -->

              <router-link :to="post.path" class="search-result-read">
                阅读全文

                <span> → </span>
              </router-link>
            </article>
          </div>

          <!-- 无结果 -->

          <div v-else class="search-empty">
            <div class="search-empty-symbol">—</div>

            <div class="search-empty-title">没有找到相关文章</div>

            <div class="search-empty-description">可以换一个关键词，例如 JavaScript、Vue、Git 或 Promise。</div>
          </div>
        </section>

        <!-- ========================================
             没有关键词
             ======================================== -->

        <section v-else class="search-start">
          <div class="search-start-title">最近文章</div>

          <div class="search-start-description">输入关键词开始搜索，也可以从下面的文章开始浏览。</div>

          <!-- 最近文章 -->

          <div class="search-recent-list">
            <article v-for="post in recentPosts" :key="post.path" class="search-recent-item">
              <div class="search-recent-meta">
                {{ formatDate(post.frontmatter.date) }}

                <span v-if="post.frontmatter.category" class="search-result-category">
                  <span class="search-meta-dot"> · </span>

                  {{ post.frontmatter.category }}
                </span>
              </div>

              <router-link :to="post.path" class="search-recent-title">
                {{ post.title }}
              </router-link>
            </article>
          </div>
        </section>

        <!-- ========================================
             搜索提示
             ======================================== -->

        <div class="search-tip">支持中文关键词，也可以搜索文章标题、简介、分类和标签。</div>
      </main>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'Search',

  components: {
    ParentLayout,
  },

  data() {
    return {
      inputKeyword: '',
    }
  },

  computed: {
    /* ========================================
     * 当前关键词
     * ======================================== */

    searchKeyword() {
      if (!this.$route || !this.$route.query) {
        return ''
      }

      return String(this.$route.query.q || '').trim()
    },

    /* ========================================
     * 是否正在搜索
     * ======================================== */

    hasKeyword() {
      return !!this.searchKeyword
    },

    /* ========================================
     * 所有文章
     * ======================================== */

    allPosts() {
      if (!this.$site || !Array.isArray(this.$site.pages)) {
        return []
      }

      return this.$site.pages
        .filter((page) => {
          return page && page.path && page.path.startsWith('/posts/') && page.frontmatter && page.frontmatter.date
        })
        .slice()
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date).getTime()

          const dateB = new Date(b.frontmatter.date).getTime()

          return dateB - dateA
        })
    },

    /* ========================================
     * 最近文章
     * ======================================== */

    recentPosts() {
      return this.allPosts.slice(0, 5)
    },

    /* ========================================
     * 搜索结果
     * ======================================== */

    searchResults() {
      const keyword = this.searchKeyword.toLowerCase()

      if (!keyword) {
        return []
      }

      return this.allPosts.filter((post) => {
        const frontmatter = post.frontmatter || {}

        const title = String(post.title || '')

        const description = String(frontmatter.description || '')

        const category = String(frontmatter.category || '')

        const tags = this.getPostTags(post).join(' ')

        const path = String(post.path || '')

        const searchText = [title, description, category, tags, path].join(' ').toLowerCase()

        return searchText.indexOf(keyword) !== -1
      })
    },
  },

  watch: {
    /* ========================================
     * 地址变化时同步输入框
     * ======================================== */

    $route: {
      immediate: true,

      handler(route) {
        if (!route || !route.query) {
          this.inputKeyword = ''
          return
        }

        this.inputKeyword = String(route.query.q || '')
      },
    },
  },

  methods: {
    /* ========================================
     * 执行搜索
     * ======================================== */

    submitSearch() {
      const keyword = String(this.inputKeyword || '').trim()

      const query = keyword ? { q: keyword } : {}

      this.$router
        .replace({
          path: '/search/',
          query,
        })
        .catch(() => {})
    },

    /* ========================================
     * 日期格式
     * ======================================== */

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

    /* ========================================
     * 标签
     * ======================================== */

    getPostTags(post) {
      if (!post || !post.frontmatter) {
        return []
      }

      const tags = post.frontmatter.tags

      if (Array.isArray(tags)) {
        return tags
      }

      if (typeof tags === 'string') {
        return [tags]
      }

      const tag = post.frontmatter.tag

      if (Array.isArray(tag)) {
        return tag
      }

      if (typeof tag === 'string') {
        return [tag]
      }

      return []
    },

    /* ========================================
     * 标签地址
     *
     * 和现在已经修好的 Tag.vue
     * 保持同样方式。
     * ======================================== */

    getTagPath(tag) {
      const value = String(tag == null ? '' : tag).trim()

      if (!value) {
        return '/tags/'
      }

      return `/tags/${value}/`
    },
  },
}
</script>

<style scoped>
/* ============================================================
 * 页面
 * ============================================================ */

.search-page {
  position: relative;

  z-index: 2;

  width: 100%;

  max-width: 880px;

  margin: 0 auto;

  padding: 34px 20px 72px;

  box-sizing: border-box;

  color: #2c3e50;
}

/* ============================================================
 * 页面头部
 * ============================================================ */

.search-header {
  margin: 0;

  padding: 0;
}

.search-eyebrow {
  margin-bottom: 10px;

  color: #9aa6a0;

  font-size: 12px;

  line-height: 1.6;

  letter-spacing: 0.12em;
}

.search-title {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 40px;

  font-weight: 650;

  line-height: 1.25;

  letter-spacing: -0.025em;
}

.search-description {
  margin: 13px 0 0;

  padding: 0;

  color: #8a9397;

  font-size: 14px;

  line-height: 1.8;
}

/* ============================================================
 * 搜索表单
 * ============================================================ */

.search-form {
  display: flex;

  align-items: stretch;

  width: 100%;

  margin-top: 30px;

  gap: 10px;
}

.search-input {
  flex: 1;

  min-width: 0;

  height: 44px;

  padding: 0 16px;

  box-sizing: border-box;

  border: 1px solid #e1e7e4;

  border-radius: 8px;

  outline: none;

  background: rgba(255, 255, 255, 0.9);

  color: #4a5559;

  font-size: 13px;

  line-height: 44px;

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input::placeholder {
  color: #b0b5b7;
}

.search-input:focus {
  border-color: #cfe4d8;

  box-shadow: 0 0 0 3px rgba(62, 175, 124, 0.07);
}

.search-button {
  flex-shrink: 0;

  height: 44px;

  padding: 0 22px;

  border: 1px solid #d9e7df;

  border-radius: 8px;

  outline: none;

  background: #f5faf7;

  color: #4f7562;

  font-size: 13px;

  line-height: 42px;

  cursor: pointer;

  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.search-button:hover {
  border-color: #bfdccc;

  background: #eef8f2;

  color: #3eaf7c;
}

/* ============================================================
 * 搜索结果
 * ============================================================ */

.search-results {
  margin-top: 42px;
}

.search-results-header {
  display: flex;

  align-items: baseline;

  justify-content: space-between;

  gap: 20px;

  padding-bottom: 13px;

  border-bottom: 1px solid #eceeef;
}

.search-results-header h2 {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.5;
}

.search-results-header span {
  flex-shrink: 0;

  color: #a2a8ab;

  font-size: 12px;

  line-height: 1.5;
}

/* ============================================================
 * 搜索结果列表
 * ============================================================ */

.search-results-list {
  display: flex;

  flex-direction: column;

  gap: 18px;

  margin-top: 20px;
}

.search-result-item {
  position: relative;

  width: 100%;

  padding: 24px 26px;

  box-sizing: border-box;

  border: 1px solid #e9edef;

  border-radius: 11px;

  background: rgba(255, 255, 255, 0.96);

  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.025);

  overflow: hidden;

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-result-item:hover {
  border-color: #dcebe4;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

/* ============================================================
 * 元信息
 * ============================================================ */

.search-result-meta,
.search-recent-meta {
  color: #a0a5a8;

  font-size: 12px;

  line-height: 1.7;
}

.search-result-category {
  color: #3eaf7c;
}

.search-meta-dot {
  margin: 0 8px;

  color: #c8cdcf;
}

/* ============================================================
 * 标题
 * ============================================================ */

.search-result-title {
  display: block;

  margin-top: 10px;

  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.55;

  text-decoration: none;

  transition: color 0.2s ease;
}

.search-result-title:hover {
  color: #3eaf7c;

  text-decoration: none;
}

/* ============================================================
 * 简介
 * ============================================================ */

.search-result-description {
  margin: 11px 0 0;

  color: #747c81;

  font-size: 14px;

  line-height: 1.9;
}

/* ============================================================
 * 标签
 * ============================================================ */

.search-result-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;

  margin-top: 15px;
}

.search-result-tag {
  display: inline-flex;

  align-items: center;

  min-height: 24px;

  padding: 2px 9px;

  box-sizing: border-box;

  border: 1px solid #edf0ef;

  border-radius: 5px;

  background: #f7f9f8;

  color: #8b9490;

  font-size: 11px;

  line-height: 1.6;

  text-decoration: none;

  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.search-result-tag:hover {
  border-color: #d7e9df;

  background: #f2f9f5;

  color: #3eaf7c;

  text-decoration: none;
}

/* ============================================================
 * 阅读全文
 * ============================================================ */

.search-result-read {
  display: inline-flex;

  align-items: center;

  gap: 5px;

  margin-top: 17px;

  color: #8d9792;

  font-size: 12px;

  line-height: 1.6;

  text-decoration: none;

  transition: color 0.2s ease;
}

.search-result-read:hover {
  color: #3eaf7c;

  text-decoration: none;
}

/* ============================================================
 * 最近文章
 * ============================================================ */

.search-start {
  margin-top: 42px;
}

.search-start-title {
  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.5;
}

.search-start-description {
  margin-top: 8px;

  color: #9ba2a5;

  font-size: 12px;

  line-height: 1.8;
}

.search-recent-list {
  margin-top: 20px;

  border-top: 1px solid #edf0ef;
}

.search-recent-item {
  padding: 18px 2px;

  border-bottom: 1px solid #edf0ef;
}

.search-recent-title {
  display: block;

  margin-top: 6px;

  color: #3d4a50;

  font-size: 15px;

  font-weight: 500;

  line-height: 1.7;

  text-decoration: none;

  transition: color 0.2s ease;
}

.search-recent-title:hover {
  color: #3eaf7c;

  text-decoration: none;
}

/* ============================================================
 * 空结果
 * ============================================================ */

.search-empty {
  margin-top: 22px;

  padding: 54px 20px;

  border: 1px solid #edf0ef;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.72);

  text-align: center;
}

.search-empty-symbol {
  color: #c1c8c4;

  font-size: 20px;

  line-height: 1;
}

.search-empty-title {
  margin-top: 16px;

  color: #7f8985;

  font-size: 15px;

  line-height: 1.7;
}

.search-empty-description {
  margin-top: 8px;

  color: #adb3b1;

  font-size: 12px;

  line-height: 1.8;
}

/* ============================================================
 * 底部提示
 * ============================================================ */

.search-tip {
  margin-top: 38px;

  padding-top: 20px;

  border-top: 1px solid #f0f1f1;

  color: #afb5b2;

  font-size: 11px;

  line-height: 1.8;

  text-align: center;
}

/* ============================================================
 * 手机
 * ============================================================ */

@media (max-width: 719px) {
  .search-page {
    max-width: 100%;

    padding: 22px 18px 55px;
  }

  .search-eyebrow {
    font-size: 11px;
  }

  .search-title {
    font-size: 30px;

    line-height: 1.3;
  }

  .search-description {
    margin-top: 10px;

    font-size: 13px;
  }

  .search-form {
    margin-top: 23px;

    gap: 8px;
  }

  .search-input {
    height: 42px;

    padding: 0 13px;

    font-size: 12px;

    line-height: 42px;
  }

  .search-button {
    height: 42px;

    padding: 0 16px;

    font-size: 12px;

    line-height: 40px;
  }

  .search-results,
  .search-start {
    margin-top: 30px;
  }

  .search-results-header {
    padding-bottom: 11px;
  }

  .search-results-header h2,
  .search-start-title {
    font-size: 18px;
  }

  .search-results-header span {
    font-size: 11px;
  }

  .search-results-list {
    gap: 14px;

    margin-top: 16px;
  }

  .search-result-item {
    padding: 19px 17px;

    border-radius: 9px;
  }

  .search-result-title {
    margin-top: 8px;

    font-size: 18px;

    line-height: 1.55;
  }

  .search-result-description {
    margin-top: 9px;

    font-size: 13px;

    line-height: 1.85;
  }

  .search-result-tags {
    margin-top: 12px;

    gap: 6px;
  }

  .search-result-read {
    margin-top: 14px;
  }

  .search-start-description {
    font-size: 11px;
  }

  .search-recent-item {
    padding: 15px 2px;
  }

  .search-recent-title {
    font-size: 14px;
  }

  .search-empty {
    padding: 45px 18px;
  }

  .search-tip {
    margin-top: 30px;

    padding-top: 17px;

    font-size: 10px;
  }
}
</style>
