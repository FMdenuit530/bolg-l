<template>
  <div id="global-layout">
    <!-- =========================
         全站梅枝背景
         ========================= -->

    <BranchBackground />

    <!-- =========================
         页面内容层
         ========================= -->

    <div class="site-content">
      <component :is="layout" />
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

  computed: {
    layout() {
      if (this.$page.path) {
        if (this.$frontmatter.layout) {
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
#global-layout {
  position: relative;

  min-height: 100vh;
}

/* =========================
   背景层
   ========================= */

#global-layout > .branch-background {
  position: fixed;

  left: 0;

  top: 0;

  width: 100vw;

  height: 100vh;

  z-index: 0;

  pointer-events: none;
}

/* =========================
   页面内容层
   ========================= */

.site-content {
  position: relative;

  z-index: 1;

  min-height: 100vh;
}

/* =========================
   防止 VuePress 默认内容
   建立奇怪的层级
   ========================= */

.site-content .navbar,
.site-content .theme-container,
.site-content .page,
.site-content footer,
.site-content .home-hero,
.site-content .home-content,
.site-content .category-page,
.site-content .tags-page,
.site-content .tag-hero,
.site-content .tag-posts,
.site-content .about-page {
  position: relative;

  z-index: 1;
}
</style>
