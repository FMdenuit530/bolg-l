<template>
  <ParentLayout>
    <template slot="page-top">
      <div class="category-page">
        <h1>文章分类</h1>

        <div v-for="category in categories" :key="category.name" class="category-item">
          <router-link :to="category.path">
            {{ category.name }}
          </router-link>

          <span> {{ category.pages.length }} 篇文章 </span>
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

  computed: {
    categories() {
      if (!this.$frontmatterKey || !this.$frontmatterKey.list) {
        return []
      }

      return this.$frontmatterKey.list
    },
  },
}
</script>

<style scoped>
.category-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 0 40px;
}

.category-page h1 {
  margin-bottom: 30px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 18px 20px;
  margin-bottom: 12px;

  border: 1px solid #eaecef;
  border-radius: 6px;
}

.category-item a {
  color: #3eaf7c;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
}

.category-item a:hover {
  color: #2c3e50;
}

.category-item span {
  color: #999;
  font-size: 14px;
}
</style>
