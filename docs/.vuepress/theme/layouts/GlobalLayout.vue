<template>
  <div id="global-layout">
    <!-- ==================================================
         梅枝背景
         ================================================== -->

    <BranchBackground />

    <!-- ==================================================
         网站主体
         ================================================== -->

    <div class="site-content">
      <component :is="layout" />

      <!-- ==================================================
           全站 Footer
           ================================================== -->

      <footer class="site-footer">
        <div class="site-footer-inner">
          <div class="site-footer-left">
            <div class="site-footer-title">我的博客</div>

            <div class="site-footer-subtitle">记录学习 · 分享技术 · 持续成长</div>
          </div>

          <div class="site-footer-right">
            <a href="https://github.com/FMdenuit530/bolg-l" target="_blank" rel="noopener noreferrer"> GitHub </a>

            <span class="site-footer-dot"> · </span>

            <span> VuePress </span>
          </div>
        </div>

        <div class="site-footer-bottom">© {{ currentYear }} 我的博客</div>
      </footer>
    </div>
  </div>
</template>

<script>
import BranchBackground from '../components/BranchBackground.vue'

export default {
  name: 'GlobalLayout',

  components: {
    BranchBackground,
  },

  data() {
    return {
      currentYear: new Date().getFullYear(),
    }
  },

  computed: {
    layout() {
      if (this.$page.path) {
        if (this.$frontmatter && this.$frontmatter.layout) {
          return this.$frontmatter.layout
        }

        return 'Layout'
      }

      return 'NotFound'
    },
  },
}
</script>

<style>
/* =========================================================
   全局容器
   ========================================================= */

#global-layout {
  position: relative;

  min-height: 100vh;
}

/* =========================================================
   梅枝背景
   ========================================================= */

#global-layout > .branch-background {
  position: fixed;

  left: 0;

  top: 0;

  width: 100vw;

  height: 100vh;

  z-index: 0;

  pointer-events: none;
}

/* =========================================================
   网站主体
   ========================================================= */

.site-content {
  position: relative;

  z-index: 1;

  min-height: 100vh;
}

/* =========================================================
   导航栏
   ========================================================= */

.site-content .navbar {
  position: relative;

  z-index: 10;
}

/* =========================================================
   正文
   ========================================================= */

.site-content .theme-default-content {
  position: relative;

  z-index: 2;
}

/* =========================================================
   自定义页面
   ========================================================= */

.site-content .home-hero,
.site-content .home-content,
.site-content .category-page,
.site-content .tags-page,
.site-content .tag-hero,
.site-content .tag-posts,
.site-content .about-page {
  position: relative;

  z-index: 2;
}

/* =========================================================
   Footer
   ========================================================= */

.site-footer {
  position: relative;

  z-index: 2;

  width: 100%;

  margin-top: 30px;

  padding: 30px 20px 20px;

  box-sizing: border-box;

  border-top: 1px solid #f0f1f1;

  background: rgba(255, 255, 255, 0.78);

  color: #999;
}

/* =========================================================
   Footer 主区域
   ========================================================= */

.site-footer-inner {
  width: 100%;

  max-width: 880px;

  margin: 0 auto;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;
}

/* 左侧 */

.site-footer-left {
  min-width: 0;
}

.site-footer-title {
  color: #59636b;

  font-size: 14px;

  font-weight: 600;

  line-height: 1.6;
}

.site-footer-subtitle {
  margin-top: 5px;

  color: #aaa;

  font-size: 11px;

  line-height: 1.7;
}

/* 右侧 */

.site-footer-right {
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  justify-content: flex-end;

  color: #aaa;

  font-size: 11px;

  line-height: 1.7;
}

.site-footer-right a {
  color: #999;

  text-decoration: none;

  transition: color 0.2s ease;
}

.site-footer-right a:hover {
  color: #3eaf7c;

  text-decoration: none;
}

.site-footer-dot {
  margin: 0 8px;

  color: #d5d5d5;
}

/* =========================================================
   Footer 底部
   ========================================================= */

.site-footer-bottom {
  max-width: 880px;

  margin: 22px auto 0;

  padding-top: 14px;

  border-top: 1px solid #f3f3f3;

  color: #b0b0b0;

  font-size: 10px;

  line-height: 1.7;

  text-align: center;
}

/* =========================================================
   手机
   ========================================================= */

@media (max-width: 719px) {
  .site-footer {
    margin-top: 20px;

    padding: 28px 18px 20px;
  }

  .site-footer-inner {
    display: flex;

    flex-direction: column;

    align-items: flex-start;

    gap: 14px;
  }

  .site-footer-right {
    justify-content: flex-start;

    line-height: 1.8;
  }

  .site-footer-bottom {
    margin-top: 20px;

    padding-top: 13px;

    text-align: left;

    line-height: 1.8;
  }
}
</style>
