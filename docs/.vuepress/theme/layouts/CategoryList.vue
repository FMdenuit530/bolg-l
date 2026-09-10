<template>
  <ParentLayout>
    <template slot="page-top">
      <div class="category-detail-page">
        <!-- ==============================
             分类头部
             ============================== -->

        <header class="category-detail-header">
          <div class="category-detail-label">分类</div>

          <h1 class="category-detail-title">
            {{ categoryName }}
          </h1>

          <p class="category-detail-description">浏览「{{ categoryName }}」分类下的相关文章</p>
        </header>

        <!-- ==============================
             文章区域
             ============================== -->

        <section class="category-articles">
          <div class="category-articles-title-row">
            <h2 class="category-articles-title">相关文章</h2>

            <span class="category-articles-count"> {{ articleList.length }} 篇 </span>
          </div>

          <!-- ==============================
               文章列表
               ============================== -->

          <div v-if="articleList.length" class="category-articles-list">
            <article v-for="post in articleList" :key="post.path" class="category-article-item">
              <!-- 日期 / 标签 -->

              <div class="category-article-meta">
                <span v-if="post.frontmatter && post.frontmatter.date" class="category-article-date">
                  {{ formatDate(post.frontmatter.date) }}
                </span>

                <span v-if="post.frontmatter && post.frontmatter.category" class="category-article-category">
                  <span class="category-meta-dot"> · </span>

                  {{ post.frontmatter.category }}
                </span>
              </div>

              <!-- 标题 -->

              <router-link :to="post.path" class="category-article-title">
                {{ post.title }}
              </router-link>

              <!-- 简介 -->

              <div v-if="post.frontmatter && post.frontmatter.description" class="category-article-description">
                {{ post.frontmatter.description }}
              </div>

              <!-- 标签 -->

              <div v-if="getPostTags(post).length" class="category-article-tags">
                <router-link v-for="tag in getPostTags(post)" :key="tag" :to="getTagPath(tag)" class="category-article-tag"> # {{ tag }} </router-link>
              </div>

              <!-- 阅读全文 -->

              <router-link :to="post.path" class="category-article-read">
                阅读全文

                <span> → </span>
              </router-link>
            </article>
          </div>

          <!-- ==============================
               没有文章
               ============================== -->

          <div v-else class="category-empty">
            <div class="category-empty-title">暂无相关文章</div>

            <div class="category-empty-description">这个分类目前还没有对应的文章。</div>
          </div>

          <!-- ==============================
               分页
               ============================== -->

          <div v-if="paginationVisible" class="category-pagination">
            <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink" class="category-pagination-button"> ← 上一页 </router-link>

            <span class="category-pagination-current"> 第 {{ currentPage }} 页 </span>

            <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink" class="category-pagination-button"> 下一页 → </router-link>
          </div>
        </section>
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'CategoryList',

  components: {
    ParentLayout,
  },

  computed: {
    /* ========================================
     * 当前分类名称
     * ======================================== */
    categoryName() {
      const pageTitle = this.$page && this.$page.title

      if (pageTitle) {
        return pageTitle
      }

      const path = this.$route && this.$route.path ? this.$route.path : ''

      const match = path.match(/^\/category\/(.+?)\/?$/)

      if (match && match[1]) {
        try {
          return decodeURIComponent(match[1])
        } catch (e) {
          return match[1]
        }
      }

      return '分类'
    },

    /* ========================================
     * 当前分类文章
     * ======================================== */
    articleList() {
      if (!this.$pagination || !Array.isArray(this.$pagination.pages)) {
        return []
      }

      return this.$pagination.pages
        .filter((page) => {
          return page && page.frontmatter && page.frontmatter.date
        })
        .slice()
        .sort((a, b) => {
          const dateA = new Date(a.frontmatter.date).getTime()

          const dateB = new Date(b.frontmatter.date).getTime()

          if (dateA === dateB) {
            return String(a.path).localeCompare(String(b.path))
          }

          return dateB - dateA
        })
    },

    /* ========================================
     * 是否显示分页
     * ======================================== */
    paginationVisible() {
      return !!(this.$pagination && (this.$pagination.hasPrev || this.$pagination.hasNext))
    },

    /* ========================================
     * 当前页码
     * ======================================== */
    currentPage() {
      if (!this.$pagination || !this.$pagination.pageNumber) {
        return 1
      }

      return this.$pagination.pageNumber
    },
  },

  methods: {
    /* ========================================
     * 日期
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
     * 获取文章标签
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
     * 和刚刚修好的 Tag.vue
     * 保持完全一致。
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

.category-detail-page {
  width: 100%;

  max-width: 880px;

  margin: 0 auto;

  padding: 34px 20px 70px;

  box-sizing: border-box;

  color: #2c3e50;
}

/* ============================================================
 * 分类头部
 * ============================================================ */

.category-detail-header {
  margin: 0;

  padding: 0;

  text-align: left;
}

.category-detail-label {
  margin-bottom: 10px;

  color: #9aa6a0;

  font-size: 13px;

  line-height: 1.6;

  letter-spacing: 0.08em;
}

.category-detail-title {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 38px;

  font-weight: 650;

  line-height: 1.25;

  letter-spacing: -0.02em;
}

.category-detail-description {
  margin: 14px 0 0;

  padding: 0;

  color: #9a9fa3;

  font-size: 14px;

  line-height: 1.8;
}

/* ============================================================
 * 文章区域
 * ============================================================ */

.category-articles {
  margin-top: 42px;
}

.category-articles-title-row {
  display: flex;

  align-items: baseline;

  justify-content: space-between;

  gap: 20px;

  padding-bottom: 13px;

  border-bottom: 1px solid #eceeef;
}

.category-articles-title {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.5;
}

.category-articles-count {
  flex-shrink: 0;

  color: #a2a8ab;

  font-size: 13px;

  line-height: 1.5;
}

/* ============================================================
 * 文章列表
 * ============================================================ */

.category-articles-list {
  display: flex;

  flex-direction: column;

  gap: 18px;

  margin-top: 20px;
}

/* ============================================================
 * 文章卡片
 * ============================================================ */

.category-article-item {
  position: relative;

  width: 100%;

  margin: 0;

  padding: 24px 26px;

  box-sizing: border-box;

  border: 1px solid #e9edef;

  border-radius: 11px;

  background: rgba(255, 255, 255, 0.96);

  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.025);

  overflow: hidden;

  transform: none !important;

  animation: none !important;

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.category-article-item:hover {
  border-color: #dcebe4;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.055);

  transform: none !important;
}

/* ============================================================
 * 元信息
 * ============================================================ */

.category-article-meta {
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  margin: 0;

  color: #a0a5a8;

  font-size: 12px;

  line-height: 1.7;
}

.category-article-category {
  display: inline-flex;

  align-items: center;

  color: #3eaf7c;
}

.category-meta-dot {
  margin: 0 8px;

  color: #c8cdcf;
}

/* ============================================================
 * 标题
 * ============================================================ */

.category-article-title {
  display: block;

  margin: 10px 0 0;

  padding: 0;

  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.55;

  text-decoration: none;

  transform: none !important;

  animation: none !important;

  transition: color 0.2s ease;
}

.category-article-title:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: none !important;
}

/* ============================================================
 * 简介
 * ============================================================ */

.category-article-description {
  margin: 11px 0 0;

  padding: 0;

  color: #747c81;

  font-size: 14px;

  line-height: 1.9;

  word-break: break-word;
}

/* ============================================================
 * 标签
 * ============================================================ */

.category-article-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;

  margin: 15px 0 0;
}

.category-article-tag {
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

  transform: none !important;

  animation: none !important;

  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.category-article-tag:hover {
  border-color: #d7e9df;

  background: #f2f9f5;

  color: #3eaf7c;

  text-decoration: none;

  transform: none !important;
}

/* ============================================================
 * 阅读全文
 * ============================================================ */

.category-article-read {
  display: inline-flex;

  align-items: center;

  gap: 5px;

  margin-top: 17px;

  color: #8d9792;

  font-size: 12px;

  line-height: 1.6;

  text-decoration: none;

  transform: none !important;

  animation: none !important;

  transition: color 0.2s ease;
}

.category-article-read span {
  display: inline-block;

  transform: none !important;
}

.category-article-read:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: none !important;
}

/* ============================================================
 * 空状态
 * ============================================================ */

.category-empty {
  margin-top: 22px;

  padding: 44px 20px;

  border: 1px solid #edf0ef;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.72);

  text-align: center;
}

.category-empty-title {
  color: #7f8985;

  font-size: 15px;

  line-height: 1.7;
}

.category-empty-description {
  margin-top: 8px;

  color: #b0b5b7;

  font-size: 12px;

  line-height: 1.8;
}

/* ============================================================
 * 分页
 * ============================================================ */

.category-pagination {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 16px;

  margin-top: 30px;
}

.category-pagination-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 76px;

  min-height: 32px;

  padding: 0 12px;

  box-sizing: border-box;

  border: 1px solid #e5ebe8;

  border-radius: 16px;

  background: #f8fbf9;

  color: #6f7d76;

  font-size: 12px;

  line-height: 1;

  text-decoration: none;

  transform: none !important;

  animation: none !important;

  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.category-pagination-button:hover {
  border-color: #cfe5d9;

  background: #f2f9f5;

  color: #3eaf7c;

  text-decoration: none;

  transform: none !important;
}

.category-pagination-current {
  color: #a2aaa7;

  font-size: 12px;

  line-height: 1.6;
}

/* ============================================================
 * 手机
 * ============================================================ */

@media (max-width: 719px) {
  .category-detail-page {
    max-width: 100%;

    padding: 22px 18px 55px;
  }

  .category-detail-label {
    margin-bottom: 8px;

    font-size: 12px;
  }

  .category-detail-title {
    font-size: 30px;

    line-height: 1.3;
  }

  .category-detail-description {
    margin-top: 11px;

    font-size: 13px;

    line-height: 1.8;
  }

  .category-articles {
    margin-top: 30px;
  }

  .category-articles-title-row {
    padding-bottom: 11px;
  }

  .category-articles-title {
    font-size: 18px;
  }

  .category-articles-count {
    font-size: 12px;
  }

  .category-articles-list {
    gap: 14px;

    margin-top: 16px;
  }

  .category-article-item {
    padding: 19px 17px;

    border-radius: 9px;
  }

  .category-article-title {
    margin-top: 8px;

    font-size: 18px;

    line-height: 1.55;
  }

  .category-article-description {
    margin-top: 9px;

    font-size: 13px;

    line-height: 1.85;
  }

  .category-article-tags {
    margin-top: 12px;

    gap: 6px;
  }

  .category-article-read {
    margin-top: 14px;
  }

  .category-pagination {
    margin-top: 24px;

    gap: 10px;
  }
}
</style>
