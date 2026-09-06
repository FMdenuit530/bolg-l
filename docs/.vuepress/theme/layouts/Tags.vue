<template>
  <ParentLayout>
    <template slot="page-top">
      <div class="tags-page">
        <h1>文章标签</h1>

        <div class="tags-list">
          <div v-for="tag in tags" :key="tag.name" class="tag-item">
            <router-link :to="tag.path">
              {{ tag.name }}
            </router-link>

            <span> {{ tag.pages.length }} 篇文章 </span>
          </div>
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
    tags() {
      if (!this.$frontmatterKey || !this.$frontmatterKey.list) {
        return []
      }

      return this.$frontmatterKey.list
    },
  },
}
</script>

<style scoped>
.tags-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 0 40px;
}

.tags-page h1 {
  margin-bottom: 30px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 16px;

  border: 1px solid #eaecef;
  border-radius: 6px;

  background: #fff;
}

.tag-item a {
  color: #3eaf7c;
  font-size: 16px;
  text-decoration: none;
}

.tag-item a:hover {
  color: #2c3e50;
}

.tag-item span {
  color: #999;
  font-size: 13px;
}
</style>
