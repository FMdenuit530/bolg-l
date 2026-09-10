<template>
  <ParentLayout>
    <template slot="page-top">
      <div class="tag-detail-page">
        <!-- ==============================
             页面头部
             ============================== -->
        <header class="tag-detail-header">
          <div class="tag-detail-label">标签</div>

          <h1 class="tag-detail-title">
            {{ tagName }}
          </h1>

          <p class="tag-detail-description">查看使用「{{ tagName }}」标签的相关文章</p>
        </header>

        <!-- ==============================
             相关文章
             ============================== -->
        <section class="tag-articles">
          <div class="tag-articles-title-row">
            <h2 class="tag-articles-title">相关文章</h2>

            <span class="tag-articles-count"> {{ tagPosts.length }} 篇 </span>
          </div>

          <!-- 有文章 -->
          <div v-if="tagPosts.length" class="tag-articles-list">
            <article v-for="post in tagPosts" :key="post.path" class="tag-article-item">
              <!-- 日期 -->
              <div class="tag-article-meta">
                <span v-if="post.frontmatter && post.frontmatter.date" class="tag-article-date">
                  {{ formatDate(post.frontmatter.date) }}
                </span>

                <span v-if="post.frontmatter && post.frontmatter.category" class="tag-article-category">
                  <span class="tag-meta-dot">·</span>

                  {{ post.frontmatter.category }}
                </span>
              </div>

              <!-- 标题 -->
              <router-link :to="post.path" class="tag-article-title">
                {{ post.title }}
              </router-link>

              <!-- 描述 -->
              <div v-if="post.frontmatter && post.frontmatter.description" class="tag-article-description">
                {{ post.frontmatter.description }}
              </div>

              <!-- 标签 -->
              <div v-if="getPostTags(post).length" class="tag-article-tags">
                <router-link v-for="tag in getPostTags(post)" :key="tag" :to="getTagPath(tag)" class="tag-article-tag"> # {{ tag }} </router-link>
              </div>

              <!-- 阅读全文 -->
              <router-link :to="post.path" class="tag-article-read">
                阅读全文
                <span>→</span>
              </router-link>
            </article>
          </div>

          <!-- 没有文章 -->
          <div v-else class="tag-empty">
            <div class="tag-empty-title">暂无相关文章</div>

            <div class="tag-empty-description">这个标签目前还没有对应的文章。</div>
          </div>

          <!-- ==============================
               分页
               ============================== -->
          <div v-if="paginationVisible" class="tag-pagination">
            <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink" class="tag-pagination-button"> ← 上一页 </router-link>

            <span class="tag-pagination-current"> 第 {{ currentPage }} 页 </span>

            <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink" class="tag-pagination-button"> 下一页 → </router-link>
          </div>
        </section>
      </div>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'Tag',

  components: {
    ParentLayout,
  },

  computed: {
    /* ========================================
     * 当前标签名称
     * ======================================== */
    tagName() {
      const path = this.$route && this.$route.path ? this.$route.path : ''

      const match = path.match(/^\/tags\/(.+?)\/?$/)

      if (match && match[1]) {
        try {
          return decodeURIComponent(match[1])
        } catch (e) {
          return match[1]
        }
      }

      return '标签'
    },

    /* ========================================
     * 当前标签下的文章
     * ======================================== */
    tagPosts() {
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
     * 标签地址
     *
     * 保持我们之前已经修好的方式：
     * 不 encodeURIComponent
     * ================================ ======== */
    getTagPath(tag) {
      const value = String(tag == null ? '' : tag).trim()

      if (!value) {
        return '/tags/'
      }

      return `/tags/${value}/`
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
  },
}
</script>

<style scoped>
/* ============================================================
 * 整个标签详情页
 * ============================================================ */

.tag-detail-page {
  width: 100%;
  max-width: 880px;

  margin: 0 auto;

  padding: 34px 20px 70px;

  box-sizing: border-box;

  color: #2c3e50;
}

/* ============================================================
 * 页面头部
 * ============================================================ */

.tag-detail-header {
  margin: 0;

  padding: 0;

  text-align: left;
}

.tag-detail-label {
  margin-bottom: 10px;

  color: #9aa6a0;

  font-size: 13px;

  line-height: 1.6;

  letter-spacing: 0.08em;
}

.tag-detail-title {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 38px;

  font-weight: 650;

  line-height: 1.25;

  letter-spacing: -0.02em;
}

.tag-detail-description {
  margin: 14px 0 0;

  padding: 0;

  color: #9a9fa3;

  font-size: 14px;

  line-height: 1.8;
}

/* ============================================================
 * 相关文章区域
 * ============================================================ */

.tag-articles {
  margin-top: 42px;
}

/* 标题栏 */

.tag-articles-title-row {
  display: flex;

  align-items: baseline;

  justify-content: space-between;

  gap: 20px;

  padding-bottom: 13px;

  border-bottom: 1px solid #eceeef;
}

.tag-articles-title {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.5;
}

.tag-articles-count {
  flex-shrink: 0;

  color: #a2a8ab;

  font-size: 13px;

  line-height: 1.5;
}

/* ============================================================
 * 文章列表
 * ============================================================ */

.tag-articles-list {
  display: flex;

  flex-direction: column;

  gap: 18px;

  margin-top: 20px;
}

/* ============================================================
 * 文章卡片
 *
 * 重点：
 * 不使用 transform
 * 不使用 animation
 * 不使用 position 动画
 *
 * 保证第一次进入页面时
 * 位置就是最终位置。
 * ============================================================ */

.tag-article-item {
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

  /*
   * 明确禁止外部动画影响
   */
  transform: none !important;

  animation: none !important;

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* 鼠标悬停 */

.tag-article-item:hover {
  border-color: #dcebe4;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.055);

  /*
   * 绝对不移动卡片
   */
  transform: none !important;
}

/* ============================================================
 * 日期 + 分类
 * ============================================================ */

.tag-article-meta {
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 0;

  margin: 0;

  color: #a0a5a8;

  font-size: 12px;

  line-height: 1.7;
}

.tag-article-category {
  display: inline-flex;

  align-items: center;

  color: #3eaf7c;
}

.tag-meta-dot {
  margin: 0 8px;

  color: #c8cdcf;
}

/* ============================================================
 * 文章标题
 * ============================================================ */

.tag-article-title {
  display: block;

  margin: 10px 0 0;

  padding: 0;

  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.55;

  text-decoration: none;

  /*
   * 禁止任何 inherited transform
   */
  transform: none !important;

  animation: none !important;

  transition: color 0.2s ease;
}

.tag-article-title:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: none !important;
}

/* ============================================================
 * 文章描述
 * ============================================================ */

.tag-article-description {
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

.tag-article-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;

  margin: 15px 0 0;
}

.tag-article-tag {
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

  transform: none !important;

  animation: none !important;
}

.tag-article-tag:hover {
  border-color: #d7e9df;

  background: #f2f9f5;

  color: #3eaf7c;

  text-decoration: none;

  transform: none !important;
}

/* ============================================================
 * 阅读全文
 * ============================================================ */

.tag-article-read {
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

.tag-article-read span {
  display: inline-block;

  transform: none !important;
}

.tag-article-read:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: none !important;
}

/* ============================================================
 * 空状态
 * ============================================================ */

.tag-empty {
  margin-top: 22px;

  padding: 44px 20px;

  border: 1px solid #edf0ef;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.72);

  text-align: center;
}

.tag-empty-title {
  color: #7f8985;

  font-size: 15px;

  line-height: 1.7;
}

.tag-empty-description {
  margin-top: 8px;

  color: #b0b5b7;

  font-size: 12px;

  line-height: 1.8;
}

/* ============================================================
 * 分页
 * ============================================================ */

.tag-pagination {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 16px;

  margin-top: 30px;
}

.tag-pagination-button {
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

  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;

  transform: none !important;

  animation: none !important;
}

.tag-pagination-button:hover {
  border-color: #cfe5d9;

  background: #f2f9f5;

  color: #3eaf7c;

  text-decoration: none;

  transform: none !important;
}

.tag-pagination-current {
  color: #a2aaa7;

  font-size: 12px;

  line-height: 1.6;
}

/* ============================================================
 * 桌面端进一步控制
 * ============================================================ */

@media (min-width: 1201px) {
  .tag-detail-page {
    max-width: 880px;

    padding-left: 20px;
    padding-right: 20px;
  }
}

/* ============================================================
 * 手机端
 * ============================================================ */

@media (max-width: 719px) {
  .tag-detail-page {
    max-width: 100%;

    padding: 22px 18px 55px;
  }

  .tag-detail-label {
    margin-bottom: 8px;

    font-size: 12px;
  }

  .tag-detail-title {
    font-size: 30px;

    line-height: 1.3;
  }

  .tag-detail-description {
    margin-top: 11px;

    font-size: 13px;

    line-height: 1.8;
  }

  .tag-articles {
    margin-top: 30px;
  }

  .tag-articles-title-row {
    padding-bottom: 11px;
  }

  .tag-articles-title {
    font-size: 18px;
  }

  .tag-articles-count {
    font-size: 12px;
  }

  .tag-articles-list {
    gap: 14px;

    margin-top: 16px;
  }

  .tag-article-item {
    padding: 19px 17px;

    border-radius: 9px;
  }

  .tag-article-title {
    margin-top: 8px;

    font-size: 18px;

    line-height: 1.55;
  }

  .tag-article-description {
    margin-top: 9px;

    font-size: 13px;

    line-height: 1.85;
  }

  .tag-article-tags {
    margin-top: 12px;

    gap: 6px;
  }

  .tag-article-read {
    margin-top: 14px;
  }

  .tag-pagination {
    margin-top: 24px;

    gap: 10px;
  }
}
</style>
