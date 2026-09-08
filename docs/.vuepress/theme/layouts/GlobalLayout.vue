<template>
  <div id="global-layout">
    <!--
      ========================================
      梅枝背景
      ========================================
    -->
    <BranchBackground />

    <!--
      ========================================
      页面主体
      ========================================
    -->
    <main class="site-main">
      <component :is="layout" />
    </main>

    <!--
      ========================================
      全站 Footer
      ========================================
    -->
    <footer class="site-footer">
      <div class="site-footer-inner">
        <!-- 左侧 -->
        <div class="site-footer-left">
          <div class="site-footer-title">我的博客</div>

          <div class="site-footer-description">记录学习 · 分享技术 · 持续成长</div>
        </div>

        <!-- 右侧 -->
        <div class="site-footer-right">
          <a href="https://github.com/FMdenuit530" target="_blank" rel="noopener noreferrer"> GitHub </a>

          <span class="footer-dot"> · </span>

          <span> Powered by VuePress </span>
        </div>
      </div>

      <div class="site-footer-bottom">
        © {{ year }} 我的博客

        <span class="footer-divider"> · </span>

        Built with VuePress
      </div>
    </footer>
  </div>
</template>

<script>
import BranchBackground from '../components/BranchBackground.vue'

export default {
  name: 'GlobalLayout',

  components: {
    BranchBackground,
  },

  computed: {
    /*
     * ========================================
     * 当前布局
     * ========================================
     */
    layout() {
      if (this.$page.path) {
        /*
         * 如果 frontmatter
         * 指定了 layout
         */
        if (this.$frontmatter.layout) {
          return this.$frontmatter.layout
        }

        /*
         * 默认 VuePress Layout
         */
        return 'Layout'
      }

      return 'NotFound'
    },

    /*
     * ========================================
     * 当前年份
     * ========================================
     */
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style>
/*
 * ========================================
 * GlobalLayout
 * ========================================
 */

#global-layout {
  position: relative;

  min-height: 100vh;

  /*
   * 给 Footer 布局空间
   */
  display: flex;

  flex-direction: column;
}

/*
 * ========================================
 * 页面主体
 * ========================================
 */

.site-main {
  position: relative;

  z-index: 1;

  flex: 1;

  min-height: 0;
}

/*
 * ========================================
 * Footer
 * ========================================
 */

.site-footer {
  position: relative;

  z-index: 1;

  margin-top: 80px;

  padding: 42px 24px 28px;

  border-top: 1px solid #eeeeee;

  background: rgba(255, 255, 255, 0.78);

  backdrop-filter: blur(8px);
}

/*
 * ========================================
 * Footer 内容
 * ========================================
 */

.site-footer-inner {
  width: 100%;

  max-width: 1056px;

  margin: 0 auto;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 32px;
}

/*
 * ========================================
 * 左边
 * ========================================
 */

.site-footer-title {
  font-size: 16px;

  font-weight: 600;

  color: #2c3e50;

  margin-bottom: 7px;
}

.site-footer-description {
  font-size: 13px;

  color: #8a9299;
}

/*
 * ========================================
 * 右边
 * ========================================
 */

.site-footer-right {
  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 13px;

  color: #9aa1a8;

  white-space: nowrap;
}

.site-footer-right a {
  color: #7f8a93;

  text-decoration: none;

  transition: color 0.2s ease;
}

.site-footer-right a:hover {
  color: #42b983;
}

/*
 * ========================================
 * 小圆点
 * ========================================
 */

.footer-dot {
  color: #c8cdd1;
}

/*
 * ========================================
 * 底部版权
 * ========================================
 */

.site-footer-bottom {
  max-width: 1056px;

  margin: 30px auto 0;

  padding-top: 20px;

  border-top: 1px solid #f0f0f0;

  text-align: center;

  font-size: 12px;

  color: #a1a7ad;

  line-height: 1.6;
}

.footer-divider {
  margin: 0 8px;

  color: #d2d5d8;
}

/*
 * ========================================
 * 移动端
 * ========================================
 */

@media (max-width: 768px) {
  .site-footer {
    margin-top: 56px;

    padding: 34px 18px 22px;
  }

  .site-footer-inner {
    flex-direction: column;

    align-items: flex-start;

    gap: 20px;
  }

  .site-footer-right {
    flex-wrap: wrap;

    white-space: normal;
  }

  .site-footer-bottom {
    margin-top: 24px;

    text-align: left;
  }
}
</style>
