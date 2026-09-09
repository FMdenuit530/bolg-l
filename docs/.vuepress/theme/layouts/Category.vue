<template>
  <ParentLayout>
    <template slot="page-top">
      <!-- =========================
           分类页面
           ========================= -->

      <section class="category-page">
        <div class="category-inner">
          <!-- 页面标题 -->

          <div class="category-header">
            <div class="category-kicker">CATEGORY</div>

            <h1>文章分类</h1>

            <p>按主题浏览我的文章</p>
          </div>

          <!-- =========================
               分类列表
               ========================= -->

          <div v-if="$frontmatterKey && $frontmatterKey.list" class="category-list">
            <router-link v-for="category in $frontmatterKey.list" :key="category.name" :to="category.path" class="category-item">
              <div class="category-item-left">
                <div class="category-name">
                  {{ category.name }}
                </div>

                <div class="category-description">浏览 {{ category.pages.length }} 篇文章</div>
              </div>

              <div class="category-item-right">
                <span class="category-count">
                  {{ category.pages.length }}
                </span>

                <span class="category-arrow"> → </span>
              </div>
            </router-link>
          </div>

          <!-- 没有分类 -->

          <div v-else class="category-empty">暂无文章分类</div>
        </div>
      </section>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'Category',

  components: {
    ParentLayout,
  },
}
</script>

<style scoped>
/* =========================
   整体
   ========================= */

.category-page {
  width: 100%;

  box-sizing: border-box;
}

.category-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 100px 30px 80px;

  box-sizing: border-box;
}

/* =========================
   页面标题
   ========================= */

.category-header {
  margin-bottom: 45px;
}

.category-kicker {
  margin-bottom: 15px;

  color: #aaa;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.18em;
}

.category-header h1 {
  margin: 0;

  color: #2c3e50;

  font-size: 2.5rem;

  font-weight: 700;

  line-height: 1.3;
}

.category-header p {
  margin: 12px 0 0;

  color: #999;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================
   分类列表
   ========================= */

.category-list {
  display: flex;

  flex-direction: column;

  border-top: 1px solid #eeeeee;
}

/* =========================
   分类项目
   ========================= */

.category-item {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 24px 10px;

  border-bottom: 1px solid #eeeeee;

  color: inherit;

  text-decoration: none;

  transition: padding-left 0.2s ease, background 0.2s ease;
}

.category-item::before {
  content: '';

  position: absolute;

  left: -1px;

  top: 0;

  width: 2px;

  height: 0;

  background: #3eaf7c;

  transition: height 0.2s ease;
}

.category-item:hover {
  padding-left: 18px;

  background: #fafcfb;

  text-decoration: none;
}

.category-item:hover::before {
  height: 100%;
}

/* =========================
   左侧
   ========================= */

.category-item-left {
  min-width: 0;
}

.category-name {
  color: #2c3e50;

  font-size: 19px;

  font-weight: 600;

  line-height: 1.5;

  transition: color 0.2s ease;
}

.category-item:hover .category-name {
  color: #3eaf7c;
}

.category-description {
  margin-top: 5px;

  color: #aaa;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================
   右侧
   ========================= */

.category-item-right {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-shrink: 0;
}

.category-count {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 28px;

  height: 28px;

  padding: 0 8px;

  border-radius: 14px;

  background: #f5f7f6;

  color: #999;

  font-size: 12px;

  box-sizing: border-box;
}

.category-arrow {
  color: #aaa;

  font-size: 16px;

  transition: color 0.2s ease, transform 0.2s ease;
}

.category-item:hover .category-arrow {
  color: #3eaf7c;

  transform: translateX(3px);
}

/* =========================
   空状态
   ========================= */

.category-empty {
  padding: 40px 0;

  color: #999;

  font-size: 14px;

  text-align: center;
}

/* =========================
   手机
   ========================= */

@media (max-width: 719px) {
  .category-inner {
    padding: 82px 18px 55px;
  }

  .category-header {
    margin-bottom: 30px;
  }

  .category-header h1 {
    font-size: 2rem;
  }

  .category-item {
    padding: 21px 6px;
  }

  .category-item:hover {
    padding-left: 10px;
  }

  .category-name {
    font-size: 17px;
  }

  .category-description {
    font-size: 11px;
  }

  .category-count {
    min-width: 26px;

    height: 26px;

    padding: 0 7px;

    border-radius: 13px;
  }

  .category-arrow {
    font-size: 15px;
  }
}
</style>
