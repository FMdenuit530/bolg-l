<template>
  <ParentLayout>
    <template slot="page-top">
      <!-- =========================
           标签页头部
           ========================= -->

      <section class="tag-hero">
        <div class="tag-hero-inner">
          <div class="tag-kicker">TAG</div>

          <h1>#{{ $frontmatter.title || $page.title }}</h1>

          <p>浏览这个标签下的相关文章</p>
        </div>
      </section>
    </template>

    <!-- =========================
         标签文章
         ========================= -->

    <template slot="page-bottom">
      <section v-if="$pagination && $pagination.pages && $pagination.pages.length" class="tag-posts">
        <div class="tag-posts-inner">
          <div class="tag-section-title">相关文章</div>

          <div class="tag-post-list">
            <article v-for="post in $pagination.pages" :key="post.path" class="tag-post-card">
              <!-- 日期 -->

              <div class="tag-post-date">
                {{ formatDate(post.frontmatter.date) }}
              </div>

              <!-- 标题 -->

              <h2>
                <router-link :to="post.path">
                  {{ post.title }}
                </router-link>
              </h2>

              <!-- 分类 -->

              <div class="tag-post-meta">
                <router-link v-if="post.frontmatter.category" :to="getCategoryPath(post.frontmatter.category)">
                  {{ post.frontmatter.category }}
                </router-link>
              </div>

              <!-- 标签 -->

              <div v-if="post.frontmatter.tags && post.frontmatter.tags.length" class="tag-post-tags">
                <router-link v-for="tag in post.frontmatter.tags" :key="tag" :to="getTagPath(tag)"> #{{ tag }} </router-link>
              </div>

              <!-- 摘要 -->

              <p v-if="post.frontmatter.description" class="tag-post-description">
                {{ post.frontmatter.description }}
              </p>

              <!-- 阅读 -->

              <router-link :to="post.path" class="tag-post-read">
                阅读全文
                <span>→</span>
              </router-link>
            </article>
          </div>
        </div>
      </section>

      <!-- =========================
           没有文章
           ========================= -->

      <section v-else class="tag-empty">
        <div class="tag-empty-inner">
          <div class="tag-empty-title">暂无相关文章</div>

          <router-link to="/tags/" class="tag-empty-link"> ← 返回标签 </router-link>
        </div>
      </section>
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

  methods: {
    /* =========================
       日期
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

      return `${year}.${month}.${day}`
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
   标签页头部
   ========================= */

.tag-hero {
  width: 100%;

  padding: 100px 20px 45px;

  box-sizing: border-box;
}

.tag-hero-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 0 30px;

  box-sizing: border-box;
}

.tag-kicker {
  margin-bottom: 14px;

  color: #aaa;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.18em;
}

.tag-hero h1 {
  margin: 0;

  color: #2c3e50;

  font-size: 2.5rem;

  font-weight: 700;

  line-height: 1.3;
}

.tag-hero p {
  margin: 12px 0 0;

  color: #999;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================
   文章区域
   ========================= */

.tag-posts {
  width: 100%;
}

.tag-posts-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 0 30px 70px;

  box-sizing: border-box;
}

/* =========================
   小标题
   ========================= */

.tag-section-title {
  display: flex;

  align-items: center;

  gap: 16px;

  margin-bottom: 20px;

  color: #2c3e50;

  font-size: 15px;

  font-weight: 600;
}

.tag-section-title::after {
  content: '';

  flex: 1;

  height: 1px;

  background: #eeeeee;
}

/* =========================
   文章列表
   ========================= */

.tag-post-list {
  display: flex;

  flex-direction: column;
}

.tag-post-card {
  position: relative;

  padding: 27px 0 32px;

  border-bottom: 1px solid #eeeeee;

  transition: padding-left 0.2s ease;
}

.tag-post-card:first-child {
  padding-top: 10px;
}

.tag-post-card:hover {
  padding-left: 10px;
}

.tag-post-card::before {
  content: '';

  position: absolute;

  top: 0;

  left: -12px;

  width: 2px;

  height: 0;

  background: #3eaf7c;

  transition: height 0.2s ease;
}

.tag-post-card:hover::before {
  height: 100%;
}

/* =========================
   日期
   ========================= */

.tag-post-date {
  margin-bottom: 8px;

  color: #aaa;

  font-size: 12px;

  letter-spacing: 0.04em;
}

/* =========================
   标题
   ========================= */

.tag-post-card h2 {
  margin: 0;

  font-size: 21px;

  font-weight: 600;

  line-height: 1.5;
}

.tag-post-card h2 a {
  color: #2c3e50;

  text-decoration: none;

  transition: color 0.2s ease;
}

.tag-post-card h2 a:hover {
  color: #3eaf7c;

  text-decoration: none;
}

/* =========================
   分类
   ========================= */

.tag-post-meta {
  margin-top: 8px;

  font-size: 12px;
}

.tag-post-meta a {
  color: #3eaf7c;

  text-decoration: none;
}

/* =========================
   标签
   ========================= */

.tag-post-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 8px;
}

.tag-post-tags a {
  color: #999;

  font-size: 12px;

  text-decoration: none;
}

.tag-post-tags a:hover {
  color: #3eaf7c;
}

/* =========================
   摘要
   ========================= */

.tag-post-description {
  max-width: 700px;

  margin: 13px 0 0;

  color: #777;

  font-size: 14px;

  line-height: 1.8;
}

/* =========================
   阅读
   ========================= */

.tag-post-read {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  margin-top: 14px;

  color: #999;

  font-size: 13px;

  text-decoration: none;

  transition: color 0.2s ease, transform 0.2s ease;
}

.tag-post-read:hover {
  color: #3eaf7c;

  text-decoration: none;

  transform: translateX(2px);
}

/* =========================
   空状态
   ========================= */

.tag-empty {
  width: 100%;
}

.tag-empty-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 40px 30px 80px;

  box-sizing: border-box;

  text-align: center;
}

.tag-empty-title {
  margin-bottom: 15px;

  color: #999;

  font-size: 14px;
}

.tag-empty-link {
  color: #3eaf7c;

  font-size: 13px;

  text-decoration: none;
}

.tag-empty-link:hover {
  text-decoration: underline;
}

/* =========================
   手机
   ========================= */

@media (max-width: 719px) {
  .tag-hero {
    padding: 82px 18px 40px;
  }

  .tag-hero-inner {
    padding: 0 2px;
  }

  .tag-hero h1 {
    font-size: 2rem;
  }

  .tag-posts-inner {
    padding: 0 18px 50px;
  }

  .tag-post-card {
    padding: 23px 0 28px;
  }

  .tag-post-card:hover {
    padding-left: 0;
  }

  .tag-post-card::before {
    display: none;
  }

  .tag-post-card h2 {
    font-size: 19px;
  }

  .tag-post-description {
    font-size: 13px;

    line-height: 1.75;
  }

  .tag-empty-inner {
    padding: 30px 18px 55px;
  }
}
</style>
