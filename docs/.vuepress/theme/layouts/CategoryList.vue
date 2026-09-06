<template>
  <ParentLayout>
    <template slot="page-top">
      <div class="category-list">
        <h1>
          {{ $page.title }}
        </h1>

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
.category-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 0 40px;
}

.category-list h1 {
  margin-bottom: 30px;
}

.post-item {
  padding: 20px 0 25px;
  border-bottom: 1px solid #eaecef;
}

.post-item h2 {
  margin-top: 0;
}

.post-item h2 a {
  color: #3eaf7c;
  text-decoration: none;
}

.post-item h2 a:hover {
  color: #2c3e50;
}

.post-date {
  color: #999;
  font-size: 14px;
}

.post-description {
  color: #666;
  line-height: 1.8;
}
</style>
