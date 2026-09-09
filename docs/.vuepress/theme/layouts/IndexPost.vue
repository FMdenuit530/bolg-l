<template>
  <ParentLayout>
    <template slot="page-top">
      <!-- =========================
           首页 Hero
           ========================= -->

      <section class="home-hero">
        <div class="home-hero-inner">
          <div class="home-kicker">MY BLOG</div>

          <h1>我的博客</h1>

          <p class="home-description">记录学习 · 分享技术 · 持续成长</p>

          <p class="home-subdescription">这里记录我的编程学习、开发实践与技术思考。</p>

          <!-- =========================
         Hero 操作
         ========================= -->

          <div class="home-actions">
            <router-link to="/category/" class="home-action primary"> 浏览分类 </router-link>

            <router-link to="/tags/" class="home-action secondary"> 查看标签 </router-link>
          </div>
        </div>
      </section>

      <!-- =========================
           最新文章
           ========================= -->

      <main class="home-content">
        <div class="home-content-inner">
          <div class="home-section-title">
            <span> 最新文章 </span>

            <span class="home-section-line"></span>
          </div>

          <!-- =========================
               文章列表
               ========================= -->

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

              <div class="post-card-meta">
                <router-link v-if="post.frontmatter.category" :to="getCategoryPath(post.frontmatter.category)" class="post-card-category">
                  {{ post.frontmatter.category }}
                </router-link>

                <span v-if="post.frontmatter.category && post.frontmatter.tags && post.frontmatter.tags.length" class="post-card-dot"> · </span>

                <router-link v-for="tag in post.frontmatter.tags || []" :key="tag" :to="getTagPath(tag)" class="post-card-tag"> #{{ tag }} </router-link>
              </div>

              <!-- 摘要 -->

              <p v-if="post.frontmatter.description" class="post-card-description">
                {{ post.frontmatter.description }}
              </p>

              <!-- 阅读全文 -->

              <router-link :to="post.path" class="post-card-read">
                阅读全文

                <span> → </span>
              </router-link>
            </article>
          </div>

          <!-- =========================
               首页分页
               ========================= -->

          <nav v-if="$pagination && ($pagination.hasPrev || $pagination.hasNext)" class="home-pagination" aria-label="文章分页">
            <!-- 上一页 -->

            <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink" class="home-pagination-link pagination-prev">
              <span class="pagination-arrow"> ← </span>

              <span> 上一页 </span>
            </router-link>

            <!-- 页码 -->

            <div class="home-pagination-pages">
              <!-- 当前首页 -->

              <router-link to="/" class="home-pagination-page active"> 1 </router-link>

              <!-- 第二页 -->

              <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink" class="home-pagination-page"> 2 </router-link>
            </div>

            <!-- 下一页 -->

            <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink" class="home-pagination-link pagination-next">
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
  name: 'IndexPost',

  components: {
    ParentLayout,
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
   首页 Hero
   ========================= */

/* =========================
   首页 Hero
   ========================= */

.home-hero {
  position: relative;

  width: 100%;

  box-sizing: border-box;

  padding: 100px 20px 70px;
}

.home-hero-inner {
  position: relative;

  max-width: 900px;

  margin: 0 auto;

  padding: 0 30px;

  box-sizing: border-box;
}

.home-kicker {
  margin-bottom: 16px;

  color: #aaa;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.18em;
}

.home-hero h1 {
  margin: 0;

  color: #2c3e50;

  font-size: 3rem;

  font-weight: 700;

  line-height: 1.25;

  letter-spacing: -0.02em;
}

.home-description {
  margin: 18px 0 0;

  color: #666;

  font-size: 17px;

  line-height: 1.8;
}

.home-subdescription {
  max-width: 650px;

  margin: 8px 0 0;

  color: #999;

  font-size: 14px;

  line-height: 1.9;
}

/* =========================
   Hero 按钮
   ========================= */

.home-actions {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-top: 28px;
}

.home-action {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 92px;

  height: 38px;

  padding: 0 18px;

  box-sizing: border-box;

  border-radius: 6px;

  font-size: 13px;

  text-decoration: none;

  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.home-action.primary {
  border: 1px solid #3eaf7c;

  background: #3eaf7c;

  color: #fff;
}

.home-action.primary:hover {
  background: #359e70;

  color: #fff;

  text-decoration: none;

  transform: translateY(-2px);

  box-shadow: 0 6px 16px rgba(62, 175, 124, 0.18);
}

.home-action.secondary {
  border: 1px solid #dfe8e3;

  background: rgba(255, 255, 255, 0.82);

  color: #666;
}

.home-action.secondary:hover {
  border-color: #cfe5da;

  background: #f8fbf9;

  color: #3eaf7c;

  text-decoration: none;

  transform: translateY(-2px);
}

/* =========================
   内容
   ========================= */

.home-content {
  width: 100%;

  margin: 0;

  padding: 0;
}

.home-content-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 0 30px 70px;

  box-sizing: border-box;
}

/* =========================
   最新文章
   ========================= */

.home-section-title {
  display: flex;

  align-items: center;

  gap: 16px;

  margin-bottom: 25px;

  color: #2c3e50;

  font-size: 15px;

  font-weight: 600;
}

.home-section-line {
  flex: 1;

  height: 1px;

  background: #eeeeee;
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
   首页分页
   ========================= */

.home-pagination {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 20px;

  margin: 45px 0 10px;

  padding-top: 30px;

  border-top: 1px solid #eeeeee;
}

/* =========================
   上一页 / 下一页
   ========================= */

.home-pagination-link {
  display: inline-flex;

  align-items: center;

  gap: 6px;

  color: #999;

  font-size: 13px;

  text-decoration: none;

  transition: color 0.2s ease, transform 0.2s ease;
}

.home-pagination-link:hover {
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

.home-pagination-pages {
  display: flex;

  align-items: center;

  gap: 5px;
}

.home-pagination-page {
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

.home-pagination-page:hover {
  background: #f5f7f6;

  color: #3eaf7c;

  text-decoration: none;

  transform: translateY(-1px);
}

.home-pagination-page.active {
  background: #3eaf7c;

  color: #fff;

  font-weight: 600;
}

/* =========================
   手机
   ========================= */

@media (max-width: 719px) {
  .home-hero {
    padding: 82px 18px 45px;
  }

  .home-hero-inner {
    padding: 0 2px;
  }

  .home-hero h1 {
    font-size: 2.25rem;
  }

  .home-description {
    font-size: 14px;
  }

  .home-content-inner {
    padding: 0 18px 50px;
  }

  .home-section-title {
    margin-bottom: 16px;
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

  /*
   * 手机分页
   */

  .home-pagination {
    gap: 10px;

    margin-top: 35px;

    padding-top: 25px;
  }

  .home-pagination-link {
    font-size: 12px;
  }

  .home-pagination-page {
    width: 30px;

    height: 30px;

    font-size: 12px;
  }

  .home-pagination-pages {
    gap: 2px;
  }
  .home-actions {
    gap: 10px;

    margin-top: 24px;
  }

  .home-action {
    min-width: 88px;

    height: 36px;

    padding: 0 15px;

    font-size: 12px;
  }

  .home-subdescription {
    font-size: 13px;

    line-height: 1.8;
  }
}
</style>
