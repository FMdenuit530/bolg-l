<template>
  <ParentLayout>
    <template slot="page-top">
      <div class="blog-index">
        <div class="blog-hero">
          <div class="hero-content">
            <div class="hero-badge">👋 Welcome to my blog</div>

            <h1>记录学习 · 分享技术 · 持续成长</h1>

            <p>这里记录我的编程学习、开发实践与技术思考。</p>

            <div class="hero-links">
              <router-link to="/category/"> 浏览分类 </router-link>

              <router-link to="/tags/"> 查看标签 </router-link>
            </div>
          </div>
        </div>

        <div class="section-title">
          <h2>最新文章</h2>
          <p>记录学习、开发与技术实践</p>
        </div>

        <div v-for="post in $pagination.pages" :key="post.path" class="post-card">
          <h2>
            <router-link :to="post.path">
              {{ post.title }}
            </router-link>
          </h2>

          <div class="post-meta">
            <span v-if="post.frontmatter.date">
              {{ formatDate(post.frontmatter.date) }}
            </span>

            <span v-if="post.frontmatter.category" class="category">
              <router-link :to="getCategoryPath(post.frontmatter.category)">
                {{ post.frontmatter.category }}
              </router-link>
            </span>
          </div>

          <p v-if="post.frontmatter.description" class="post-description">
            {{ post.frontmatter.description }}
          </p>

          <div v-if="post.frontmatter.tags" class="post-tags">
            <router-link v-for="tag in post.frontmatter.tags" :key="tag" :to="getTagPath(tag)" class="tag"> # {{ tag }} </router-link>
          </div>

          <router-link :to="post.path" class="read-more">
            阅读全文
            <span>→</span>
          </router-link>
        </div>

        <div class="pagination">
          <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink"> ← 上一页 </router-link>

          <span v-else></span>

          <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink"> 下一页 → </router-link>
        </div>
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

      return `${year}-${month}-${day}`
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
.blog-index {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 0 50px;
}

/* =========================
   首页 Hero
   ========================= */

.blog-hero {
  margin-bottom: 45px;

  padding: 55px 45px;

  border-radius: 14px;

  background: linear-gradient(135deg, #f8faf9 0%, #f3f8f5 100%);

  border: 1px solid #edf2ef;
}

.hero-content {
  max-width: 700px;
}

.hero-badge {
  display: inline-block;

  margin-bottom: 18px;

  padding: 5px 10px;

  border-radius: 20px;

  background: #e8f5ef;

  color: #3eaf7c;

  font-size: 12px;

  font-weight: 500;
}

.hero-content h1 {
  margin: 0 0 15px;

  color: #2c3e50;

  font-size: 32px;

  line-height: 1.4;
}

.hero-content p {
  margin: 0;

  color: #777;

  font-size: 15px;

  line-height: 1.8;
}

.hero-links {
  display: flex;

  gap: 12px;

  margin-top: 25px;
}

.hero-links a {
  display: inline-block;

  padding: 8px 16px;

  border-radius: 6px;

  background: #3eaf7c;

  color: #fff;

  font-size: 13px;

  text-decoration: none;

  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.hero-links a:hover {
  background: #359568;

  color: #fff;

  text-decoration: none;

  transform: translateY(-2px);

  box-shadow: 0 5px 15px rgba(62, 175, 124, 0.2);
}

/* =========================
   最新文章标题
   ========================= */

.section-title {
  margin-bottom: 25px;
}

.section-title h2 {
  margin: 0 0 6px;

  color: #2c3e50;

  font-size: 24px;
}

.section-title p {
  margin: 0;

  color: #999;

  font-size: 14px;
}

/* 文章卡片 */

.post-card {
  position: relative;

  padding: 28px 30px;
  margin-bottom: 20px;

  border: 1px solid #eaecef;
  border-radius: 10px;

  background: #fff;

  overflow: hidden;

  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.post-card::before {
  content: '';

  position: absolute;

  top: 0;
  left: 0;

  width: 3px;
  height: 0;

  background: #3eaf7c;

  transition: height 0.25s ease;
}

.post-card:hover {
  transform: translateY(-3px);

  border-color: #dfe2e5;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}

.post-card:hover::before {
  height: 100%;
}

.post-card:hover {
  transform: translateY(-3px);

  border-color: #dfe2e5;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}

/* 标题 */

.post-card h2 {
  margin-top: 0;
  margin-bottom: 12px;

  font-size: 21px;
  line-height: 1.5;
}

.post-card h2 a {
  display: inline;

  color: #2c3e50;

  text-decoration: none;

  background-image: linear-gradient(to right, #3eaf7c, #3eaf7c);

  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0 2px;

  transition: color 0.2s ease, background-size 0.25s ease;
}

.post-card h2 a:hover {
  color: #3eaf7c;

  background-size: 100% 2px;
}

.post-card h2 a {
  color: #2c3e50;
  text-decoration: none;
}

.post-card h2 a:hover {
  color: #3eaf7c;
}

/* 日期 + 分类 */

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 16px;

  color: #999;
  font-size: 13px;
}

.post-meta .category {
  position: relative;

  padding: 3px 9px;

  border-radius: 4px;

  background: #f0f8f4;

  color: #3eaf7c;
}

.post-meta .category::before {
  display: none;
}

.post-meta .category a {
  color: #3eaf7c;
  text-decoration: none;
}

.post-meta .category a:hover {
  color: #2c3e50;
}

.post-meta .category {
  position: relative;
  padding-left: 15px;
}

.post-meta .category::before {
  content: '·';

  position: absolute;
  left: 0;
  top: 0;
}

.post-meta .category a {
  color: #3eaf7c;
  text-decoration: none;
}

/* 摘要 */

.post-description {
  margin: 0 0 17px;

  color: #666;

  font-size: 14px;

  line-height: 1.8;
}

/* 标签 */

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  margin-bottom: 20px;
}

.tag {
  display: inline-block;

  padding: 4px 9px;

  border: 1px solid #eee;

  border-radius: 4px;

  background: #fafafa;

  color: #777;

  font-size: 12px;

  text-decoration: none;

  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.tag:hover {
  background: #f0f8f4;

  border-color: #d7eee3;

  color: #3eaf7c;
}

.tag:hover {
  background: #e8f5ef;
  color: #3eaf7c;
}

/* 阅读全文 */

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  color: #3eaf7c;

  font-size: 14px;

  text-decoration: none;
}

.read-more span {
  transition: transform 0.2s ease;
}

.read-more:hover span {
  transform: translateX(4px);
}

/* 分页 */

.pagination {
  display: flex;
  justify-content: space-between;

  margin-top: 40px;
  padding-top: 25px;

  border-top: 1px solid #eaecef;
}

.pagination a {
  color: #3eaf7c;
  text-decoration: none;
}

.pagination a:hover {
  color: #2c3e50;
}

/* 手机端 */

@media (max-width: 719px) {
  .blog-index {
    padding: 40px 20px;
  }

  .blog-hero {
    padding: 35px 25px;

    margin-bottom: 35px;
  }

  .hero-content h1 {
    font-size: 25px;
  }

  .hero-content p {
    font-size: 14px;
  }

  .hero-links {
    flex-wrap: wrap;
  }

  .post-card {
    padding: 22px 20px;
  }

  .post-card h2 {
    font-size: 20px;
  }
}
</style>
