<template>
  <ParentLayout>
    <template slot="page-top">
      <div class="pagination-page">
        <h1>文章列表</h1>

        <div v-for="post in $pagination.pages" :key="post.path" class="post-item">
          <h2>
            <router-link :to="post.path">
              {{ post.title }}
            </router-link>
          </h2>

          <p v-if="post.frontmatter.date" class="post-date">
            {{ formatDate(post.frontmatter.date) }}
          </p>

          <p v-if="post.frontmatter.description" class="post-description">
            {{ post.frontmatter.description }}
          </p>

          <router-link :to="post.path" class="read-more"> 阅读全文 → </router-link>
        </div>

        <div class="pagination">
          <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink"> ← 上一页 </router-link>

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
  },
}
</script>

<style scoped>
.pagination-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 0 40px;
}

.pagination-page h1 {
  margin-top: 0;
  margin-bottom: 30px;
}

.post-item {
  padding: 20px 0 25px;
  border-bottom: 1px solid #eaecef;
}

.post-item h2 {
  margin-top: 0;
  margin-bottom: 15px;
}

.post-item h2 a {
  color: #2c3e50;
  text-decoration: none;
}

.post-item h2 a:hover {
  color: #3eaf7c;
}

.post-date {
  color: #999;
  font-size: 14px;
  margin-bottom: 12px;
}

.post-description {
  color: #666;
  line-height: 1.8;
}

.read-more {
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: space-between;

  margin-top: 40px;
  padding-top: 20px;

  border-top: 1px solid #eaecef;
}

.pagination a {
  color: #3eaf7c;
  text-decoration: none;
}

.pagination a:hover {
  color: #2c3e50;
}
</style>
