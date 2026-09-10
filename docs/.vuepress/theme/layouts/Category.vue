<template>
  <ParentLayout>
    <template slot="page-top">
      <div class="category-page">
        <!-- ==============================
             页面头部
             ============================== -->

        <header class="category-header">
          <div class="category-label">分类</div>

          <h1 class="category-title">文章分类</h1>

          <p class="category-description">按技术方向浏览博客文章</p>
        </header>

        <!-- ==============================
             分类列表
             ============================== -->

        <section class="category-section">
          <div class="category-section-title-row">
            <h2 class="category-section-title">全部分类</h2>

            <span class="category-section-count"> {{ categoryList.length }} 个分类 </span>
          </div>

          <!-- 分类 -->

          <div v-if="categoryList.length" class="category-list">
            <router-link v-for="item in categoryList" :key="item.name" :to="item.path" class="category-item">
              <div class="category-item-main">
                <div class="category-item-name">
                  {{ item.name }}
                </div>

                <div class="category-item-description">浏览「{{ item.name }}」分类下的文章</div>
              </div>

              <div class="category-item-right">
                <span class="category-item-count">
                  {{ item.pages.length }}
                </span>

                <span class="category-item-arrow"> → </span>
              </div>
            </router-link>
          </div>

          <!-- 没有分类 -->

          <div v-else class="category-empty">
            <div class="category-empty-title">暂无分类</div>

            <div class="category-empty-description">当前还没有可展示的文章分类。</div>
          </div>
        </section>
      </div>
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

  computed: {
    /* ========================================
     * 分类列表
     *
     * @vuepress/plugin-blog
     * frontmatter 分类器：
     *
     * $category.list
     * ======================================== */
    categoryList() {
      if (!this.$category || !Array.isArray(this.$category.list)) {
        return []
      }

      return this.$category.list
        .filter((item) => {
          return item && item.name && Array.isArray(item.pages)
        })
        .map((item) => {
          return {
            name: String(item.name),
            path: item.path,
            pages: item.pages,
          }
        })
        .sort((a, b) => {
          if (b.pages.length !== a.pages.length) {
            return b.pages.length - a.pages.length
          }

          return a.name.localeCompare(b.name)
        })
    },
  },
}
</script>

<style scoped>
/* ============================================================
 * 页面
 * ============================================================ */

.category-page {
  width: 100%;

  max-width: 880px;

  margin: 0 auto;

  padding: 34px 20px 70px;

  box-sizing: border-box;

  color: #2c3e50;
}

/* ============================================================
 * 页面头部
 * ============================================================ */

.category-header {
  margin: 0;

  padding: 0;

  text-align: left;
}

.category-label {
  margin-bottom: 10px;

  color: #9aa6a0;

  font-size: 13px;

  line-height: 1.6;

  letter-spacing: 0.08em;
}

.category-title {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 38px;

  font-weight: 650;

  line-height: 1.25;

  letter-spacing: -0.02em;
}

.category-description {
  margin: 14px 0 0;

  padding: 0;

  color: #9a9fa3;

  font-size: 14px;

  line-height: 1.8;
}

/* ============================================================
 * 分类区域
 * ============================================================ */

.category-section {
  margin-top: 42px;
}

.category-section-title-row {
  display: flex;

  align-items: baseline;

  justify-content: space-between;

  gap: 20px;

  padding-bottom: 13px;

  border-bottom: 1px solid #eceeef;
}

.category-section-title {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.5;
}

.category-section-count {
  flex-shrink: 0;

  color: #a2a8ab;

  font-size: 13px;

  line-height: 1.5;
}

/* ============================================================
 * 分类列表
 * ============================================================ */

.category-list {
  display: flex;

  flex-direction: column;

  gap: 12px;

  margin-top: 20px;
}

/* ============================================================
 * 分类卡片
 *
 * 不使用 transform
 * 不使用 animation
 *
 * 避免再次出现首次进入位置异常。
 * ============================================================ */

.category-item {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  width: 100%;

  min-height: 88px;

  padding: 19px 22px;

  box-sizing: border-box;

  border: 1px solid #e9edef;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.96);

  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.025);

  color: #2c3e50;

  text-decoration: none;

  transform: none !important;

  animation: none !important;

  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.category-item:hover {
  border-color: #dcebe4;

  background: rgba(255, 255, 255, 0.99);

  box-shadow: 0 7px 22px rgba(0, 0, 0, 0.05);

  text-decoration: none;

  transform: none !important;
}

/* ============================================================
 * 分类左侧
 * ============================================================ */

.category-item-main {
  min-width: 0;

  flex: 1;
}

.category-item-name {
  color: #2c3e50;

  font-size: 18px;

  font-weight: 600;

  line-height: 1.6;

  word-break: break-word;

  transition: color 0.2s ease;
}

.category-item:hover .category-item-name {
  color: #3eaf7c;
}

.category-item-description {
  margin-top: 5px;

  color: #9aa1a5;

  font-size: 12px;

  line-height: 1.7;
}

/* ============================================================
 * 分类右侧
 * ============================================================ */

.category-item-right {
  display: flex;

  align-items: center;

  gap: 10px;

  flex-shrink: 0;
}

.category-item-count {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 28px;

  height: 28px;

  padding: 0 8px;

  box-sizing: border-box;

  border-radius: 14px;

  background: #f4f8f6;

  color: #7f9087;

  font-size: 11px;

  line-height: 1;
}

.category-item-arrow {
  color: #a4aca8;

  font-size: 16px;

  line-height: 1;

  transition: color 0.2s ease;
}

.category-item:hover .category-item-arrow {
  color: #3eaf7c;
}

/* ============================================================
 * 空状态
 * ============================================================ */

.category-empty {
  margin-top: 22px;

  padding: 44px 20px;

  border: 1px solid #edf0ef;

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.72);

  text-align: center;
}

.category-empty-title {
  color: #7f8985;

  font-size: 15px;

  line-height: 1.7;
}

.category-empty-description {
  margin-top: 8px;

  color: #b0b5b7;

  font-size: 12px;

  line-height: 1.8;
}

/* ============================================================
 * 手机
 * ============================================================ */

@media (max-width: 719px) {
  .category-page {
    max-width: 100%;

    padding: 22px 18px 55px;
  }

  .category-label {
    margin-bottom: 8px;

    font-size: 12px;
  }

  .category-title {
    font-size: 30px;

    line-height: 1.3;
  }

  .category-description {
    margin-top: 11px;

    font-size: 13px;
  }

  .category-section {
    margin-top: 30px;
  }

  .category-section-title-row {
    padding-bottom: 11px;
  }

  .category-section-title {
    font-size: 18px;
  }

  .category-section-count {
    font-size: 12px;
  }

  .category-list {
    gap: 10px;

    margin-top: 16px;
  }

  .category-item {
    min-height: 78px;

    padding: 16px;
  }

  .category-item-name {
    font-size: 16px;
  }

  .category-item-description {
    margin-top: 4px;

    font-size: 11px;
  }

  .category-item-right {
    gap: 7px;
  }

  .category-item-count {
    min-width: 26px;

    height: 26px;

    padding: 0 7px;
  }
}
</style>
