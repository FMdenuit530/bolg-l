<template>
  <ParentLayout>
    <template slot="page-top">
      <!-- =========================
           分页页头
           ========================= -->

      <section class="pagination-hero">
        <div class="pagination-hero-inner">
          <div class="pagination-kicker">MY BLOG</div>

          <h1>最新文章</h1>

          <p>第 {{ currentPage }} 页</p>
        </div>
      </section>

      <!-- =========================
           文章列表
           ========================= -->

      <main class="pagination-content">
        <div class="pagination-content-inner">
          <div class="post-list">
            <article v-for="post in $pagination.pages" :key="post.path" class="post-card">
              <!-- =========================
                   日期
                   ========================= -->

              <div class="post-card-date">
                {{ formatDate(post.frontmatter.date) }}
              </div>

              <!-- =========================
                   标题
                   ========================= -->

              <h2 class="post-card-title">
                <router-link :to="post.path">
                  {{ post.title }}
                </router-link>
              </h2>

              <!-- =========================
                   分类 / 标签
                   ========================= -->

              <div class="post-card-meta">
                <router-link v-if="post.frontmatter.category" :to="getCategoryPath(post.frontmatter.category)" class="post-card-category">
                  {{ post.frontmatter.category }}
                </router-link>

                <span v-if="post.frontmatter.category && post.frontmatter.tags && post.frontmatter.tags.length" class="post-card-dot"> · </span>

                <router-link v-for="tag in post.frontmatter.tags || []" :key="tag" :to="getTagPath(tag)" class="post-card-tag"> #{{ tag }} </router-link>
              </div>

              <!-- =========================
                   描述
                   ========================= -->

              <p v-if="post.frontmatter.description" class="post-card-description">
                {{ post.frontmatter.description }}
              </p>

              <!-- =========================
                   阅读全文
                   ========================= -->

              <router-link :to="post.path" class="post-card-read">
                阅读全文

                <span> → </span>
              </router-link>
            </article>
          </div>

          <!-- =========================
               分页
               ========================= -->

          <nav v-if="$pagination" class="custom-pagination" aria-label="文章分页">
            <!-- 上一页 -->

            <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink" class="pagination-link pagination-prev">
              <span class="pagination-arrow"> ← </span>

              <span> 上一页 </span>
            </router-link>

            <!-- 页码 -->

            <div class="pagination-pages">
              <router-link
                to="/"
                class="pagination-page"
                :class="{
                  active: currentPage === 1,
                }"
              >
                1
              </router-link>

              <router-link
                v-if="$pagination.hasPrev || $pagination.hasNext || currentPage === 2"
                to="/page/2/"
                class="pagination-page"
                :class="{
                  active: currentPage === 2,
                }"
              >
                2
              </router-link>
            </div>

            <!-- 下一页 -->

            <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink" class="pagination-link pagination-next">
              <span> 下一页 </span>

              <span class="pagination-arrow"> → </span>
            </router-link>
          </nav>
        </div>
      </main>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'DirectoryPagination',

  components: {
    ParentLayout,
  },

  computed: {
    /*
     * ========================================
     * 当前页
     * ========================================
     */

    currentPage() {
      const match = this.$page.path.match(/\/page\/(\d+)\/?$/)

      if (match) {
        return Number(match[1])
      }

      return 1
    },
  },

  methods: {
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

      return `${year}.${month}.${day}`
    },

    /*
     * ========================================
     * 分类
     * ========================================
     */

    getCategoryPath(category) {
      return `/category/${encodeURIComponent(category)}/`
    },

    /*
     * ========================================
     * 标签
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
   Hero
   ========================= */

.pagination-hero {
  width: 100%;

  padding: 100px 20px 48px;

  box-sizing: border-box;
}

.pagination-hero-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 0 30px;

  box-sizing: border-box;
}

.pagination-kicker {
  margin-bottom: 15px;

  color: #aaa;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.18em;
}

.pagination-hero h1 {
  margin: 0;

  color: #2c3e50;

  font-size: 2.5rem;

  font-weight: 700;

  line-height: 1.3;
}

.pagination-hero p {
  margin: 12px 0 0;

  color: #999;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================
   内容
   ========================= */

.pagination-content {
  width: 100%;

  margin: 0;

  padding: 0;
}

.pagination-content-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 0 30px 70px;

  box-sizing: border-box;
}

/* =========================
   文章列表
   ========================= */

.post-list {
  display: flex;

  flex-direction: column;
}

.post-card {
  position: relative;

  padding: 28px 0 32px;

  border-bottom: 1px solid #eeeeee;

  transition: padding-left 0.2s ease, border-color 0.2s ease;
}

.post-card:first-child {
  padding-top: 10px;
}

.post-card::before {
  content: '';

  position: absolute;

  left: -12px;

  top: 0;

  width: 2px;

  height: 0;

  background: #3eaf7c;

  transition: height 0.2s ease;
}

.post-card:hover {
  padding-left: 10px;

  border-color: #e2e2e2;
}

.post-card:hover::before {
  height: 100%;
}

/* =========================
   日期
   ========================= */

.post-card-date {
  margin-bottom: 9px;

  color: #aaa;

  font-size: 12px;

  letter-spacing: 0.04em;
}

/* =========================
   标题
   ========================= */

.post-card-title {
  margin: 0;

  font-size: 22px;

  font-weight: 600;

  line-height: 1.5;
}

.post-card-title a {
  display: inline-block;

  color: #2c3e50;

  text-decoration: none;

  transition: color 0.2s ease;
}

.post-card-title a:hover {
  color: #3eaf7c;

  text-decoration: none;
}

/* =========================
   分类 / 标签
   ========================= */

.post-card-meta {
  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 8px;

  margin-top: 9px;

  color: #aaa;

  font-size: 12px;
}

.post-card-category {
  color: #3eaf7c;

  text-decoration: none;
}

.post-card-category:hover {
  color: #2c3e50;
}

.post-card-dot {
  color: #d5d5d5;
}

.post-card-tag {
  color: #999;

  text-decoration: none;
}

.post-card-tag:hover {
  color: #3eaf7c;
}

/* =========================
   摘要
   ========================= */

.post-card-description {
  max-width: 700px;

  margin: 14px 0 0;

  color: #777;

  font-size: 14px;

  line-height: 1.8;
}

/* =========================
   阅读全文
   ========================= */

.post-card-read {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  margin-top: 15px;

  color: #999;

  font-size: 13px;

  text-decoration: none;

  transition: color 0.2s ease, transform 0.2s ease;
}

.post-card-read:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: translateX(2px);
}

/* =========================
   分页
   ========================= */

.custom-pagination {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 20px;

  margin: 45px 0 10px;

  padding-top: 30px;

  border-top: 1px solid #eeeeee;
}

.pagination-link {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  color: #999;

  font-size: 13px;

  text-decoration: none;

  white-space: nowrap;

  transition: color 0.2s ease, transform 0.2s ease;
}

.pagination-link:hover {
  color: #3eaf7c;

  text-decoration: none;
}

.pagination-prev:hover {
  transform: translateX(-2px);
}

.pagination-next:hover {
  transform: translateX(2px);
}

.pagination-arrow {
  font-size: 16px;

  line-height: 1;
}

/* =========================
   页码
   ========================= */

.pagination-pages {
  display: flex;

  align-items: center;

  gap: 5px;
}

.pagination-page {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 34px;

  height: 34px;

  border-radius: 50%;

  color: #999;

  font-size: 13px;

  text-decoration: none;

  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.pagination-page:hover {
  background: #f5f7f6;

  color: #3eaf7c;

  text-decoration: none;

  transform: translateY(-1px);
}

.pagination-page.active {
  background: #3eaf7c;

  color: #fff;

  font-weight: 600;
}

/* =========================
   手机
   ========================= */

@media (max-width: 719px) {
  .pagination-hero {
    padding: 82px 18px 40px;
  }

  .pagination-hero-inner {
    padding: 0 2px;
  }

  .pagination-hero h1 {
    font-size: 2rem;
  }

  .pagination-content-inner {
    padding: 0 18px 50px;
  }

  .post-card {
    padding: 24px 0 28px;
  }

  .post-card:first-child {
    padding-top: 8px;
  }

  .post-card:hover {
    padding-left: 0;
  }

  .post-card::before {
    display: none;
  }

  .post-card-title {
    font-size: 19px;
  }

  .post-card-description {
    font-size: 13px;

    line-height: 1.75;
  }

  .custom-pagination {
    gap: 10px;

    margin-top: 35px;

    padding-top: 25px;
  }

  .pagination-link {
    font-size: 12px;
  }

  .pagination-arrow {
    font-size: 15px;
  }

  .pagination-page {
    width: 30px;

    height: 30px;

    font-size: 12px;
  }
}
</style>
