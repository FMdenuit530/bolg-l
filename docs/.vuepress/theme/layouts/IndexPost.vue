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

              <!-- 阅读 -->

              <router-link :to="post.path" class="post-card-read">
                阅读全文

                <span> → </span>
              </router-link>
            </article>
          </div>
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

    getCategoryPath(category) {
      return `/category/${encodeURIComponent(category)}/`
    },

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

.home-hero {
  width: 100%;

  box-sizing: border-box;

  padding: 100px 20px 55px;
}

.home-hero-inner {
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

  color: #888;

  font-size: 16px;

  line-height: 1.8;
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
   最新文章标题
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

/* =========================
   文章
   ========================= */

.post-card {
  position: relative;

  padding: 28px 0 32px;

  border-bottom: 1px solid #eeeeee;
}

.post-card:first-child {
  padding-top: 10px;
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
  color: #2c3e50;

  text-decoration: none;

  transition: color 0.2s ease;
}

.post-card-title a:hover {
  color: #3eaf7c;
}

/* =========================
   分类标签
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

.post-card-read span {
  transition: transform 0.2s ease;
}

.post-card-read:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: translateX(2px);
}

.post-card-read:hover span {
  transform: translateX(3px);
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

  .post-card-title {
    font-size: 19px;
  }

  .post-card-description {
    font-size: 13px;

    line-height: 1.75;
  }
}
</style>
