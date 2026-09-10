<template>
  <ParentLayout>
    <template slot="page-top">
      <main class="about-page">
        <!-- ========================================
             顶部介绍
             ======================================== -->

        <section class="about-hero">
          <div class="about-eyebrow">ABOUT ME</div>

          <h1 class="about-title">关于我</h1>

          <p class="about-subtitle">记录学习 · 分享技术 · 持续成长</p>

          <p class="about-intro">这里是我的个人技术博客。 我会把学习过程中的思考、实践和踩坑记录下来， 也希望通过持续整理，让知识真正沉淀下来。</p>
        </section>

        <!-- ========================================
             博客介绍
             ======================================== -->

        <section class="about-section">
          <div class="about-section-label">01</div>

          <div class="about-section-content">
            <h2>关于这个博客</h2>

            <p>这个博客主要用来记录日常学习和技术实践。 相比单纯收藏资料，我更希望把真正理解过、 使用过以及遇到过问题的内容整理下来。</p>

            <p>从 JavaScript、Vue，到 Git 以及各种开发过程中的小问题， 都会慢慢沉淀在这里。</p>
          </div>
        </section>

        <!-- ========================================
             技术方向
             ======================================== -->

        <section class="about-section">
          <div class="about-section-label">02</div>

          <div class="about-section-content">
            <h2>技术方向</h2>

            <div class="about-tech-list">
              <div class="about-tech-item">
                <div class="about-tech-name">JavaScript</div>

                <div class="about-tech-description">语言基础、异步编程、Promise、闭包以及日常开发中的实践。</div>
              </div>

              <div class="about-tech-item">
                <div class="about-tech-name">Vue</div>

                <div class="about-tech-description">Vue 3、Composition API、响应式以及现代前端项目开发。</div>
              </div>

              <div class="about-tech-item">
                <div class="about-tech-name">Git</div>

                <div class="about-tech-description">日常开发中的版本管理、提交、分支以及项目部署。</div>
              </div>

              <div class="about-tech-item">
                <div class="about-tech-name">VuePress</div>

                <div class="about-tech-description">使用 VuePress 搭建个人博客，并持续优化博客体验。</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================
             为什么写博客
             ======================================== -->

        <section class="about-section">
          <div class="about-section-label">03</div>

          <div class="about-section-content">
            <h2>为什么写博客</h2>

            <p>学习的时候，经常会遇到一些看起来很简单， 但真正动手之后才发现并没有想象中那么简单的问题。</p>

            <p>把这些问题重新整理一次， 往往也是再次理解它们的过程。</p>

            <p>所以这里不只是一个文章展示页面， 更像是一份属于自己的长期技术笔记。</p>
          </div>
        </section>

        <!-- ========================================
             当前状态
             ======================================== -->

        <section class="about-section">
          <div class="about-section-label">04</div>

          <div class="about-section-content">
            <h2>正在进行</h2>

            <div class="about-status">
              <div class="about-status-row">
                <span class="about-status-name"> Blog </span>

                <span class="about-status-value"> 持续建设中 </span>
              </div>

              <div class="about-status-row">
                <span class="about-status-name"> Learning </span>

                <span class="about-status-value"> 持续学习中 </span>
              </div>

              <div class="about-status-row">
                <span class="about-status-name"> Writing </span>

                <span class="about-status-value"> 持续记录中 </span>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================
             GitHub
             ======================================== -->

        <section class="about-contact">
          <div class="about-contact-inner">
            <div class="about-contact-label">PROJECT</div>

            <h2>我的 GitHub</h2>

            <p>博客源码、配置以及后续项目都会继续放在 GitHub。</p>

            <a class="about-github" href="https://github.com/FMdenuit530/bolg-l" target="_blank" rel="noopener noreferrer">
              <span> github.com/FMdenuit530/bolg-l </span>

              <span class="about-github-arrow"> ↗ </span>
            </a>
          </div>
        </section>

        <!-- ========================================
             底部文字
             ======================================== -->

        <div class="about-footer-note">慢一点没关系，重要的是一直在前进。</div>
      </main>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'

export default {
  name: 'About',

  components: {
    ParentLayout,
  },
}
</script>

<style scoped>
/* ============================================================
 * 页面
 * ============================================================ */

.about-page {
  width: 100%;

  max-width: 880px;

  margin: 0 auto;

  padding: 34px 20px 72px;

  box-sizing: border-box;

  color: #2c3e50;
}

/* ============================================================
 * 顶部
 * ============================================================ */

.about-hero {
  padding: 0;

  text-align: left;
}

.about-eyebrow {
  margin-bottom: 10px;

  color: #9aa6a0;

  font-size: 12px;

  line-height: 1.6;

  letter-spacing: 0.12em;
}

.about-title {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 40px;

  font-weight: 650;

  line-height: 1.25;

  letter-spacing: -0.025em;
}

.about-subtitle {
  margin: 12px 0 0;

  color: #6f7c75;

  font-size: 16px;

  line-height: 1.8;
}

.about-intro {
  max-width: 680px;

  margin: 20px 0 0;

  color: #788186;

  font-size: 14px;

  line-height: 2;
}

/* ============================================================
 * 普通区块
 * ============================================================ */

.about-section {
  display: grid;

  grid-template-columns: 55px minmax(0, 1fr);

  gap: 10px;

  margin-top: 58px;

  padding-top: 30px;

  border-top: 1px solid #eceeef;
}

.about-section-label {
  padding-top: 5px;

  color: #b0b7b3;

  font-family: Consolas, Monaco, monospace;

  font-size: 11px;

  line-height: 1.6;

  letter-spacing: 0.08em;
}

.about-section-content {
  min-width: 0;
}

.about-section-content h2 {
  margin: 0;

  padding: 0;

  color: #2c3e50;

  font-size: 22px;

  font-weight: 600;

  line-height: 1.5;
}

.about-section-content p {
  margin: 16px 0 0;

  color: #69747a;

  font-size: 14px;

  line-height: 2;
}

/* ============================================================
 * 技术方向
 * ============================================================ */

.about-tech-list {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 12px;

  margin-top: 22px;
}

.about-tech-item {
  min-height: 112px;

  padding: 18px 18px;

  box-sizing: border-box;

  border: 1px solid #e9edef;

  border-radius: 9px;

  background: rgba(255, 255, 255, 0.76);

  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.about-tech-item:hover {
  border-color: #dcebe4;

  background: rgba(255, 255, 255, 0.94);

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.035);
}

.about-tech-name {
  color: #2c3e50;

  font-size: 15px;

  font-weight: 600;

  line-height: 1.6;

  transition: color 0.2s ease;
}

.about-tech-item:hover .about-tech-name {
  color: #3eaf7c;
}

.about-tech-description {
  margin-top: 7px;

  color: #8a9397;

  font-size: 12px;

  line-height: 1.85;
}

/* ============================================================
 * 状态
 * ============================================================ */

.about-status {
  margin-top: 20px;

  border-top: 1px solid #edf0ef;
}

.about-status-row {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  min-height: 52px;

  border-bottom: 1px solid #edf0ef;
}

.about-status-name {
  color: #59646a;

  font-size: 13px;

  line-height: 1.6;
}

.about-status-value {
  color: #9ba39f;

  font-size: 12px;

  line-height: 1.6;
}

/* ============================================================
 * GitHub
 * ============================================================ */

.about-contact {
  margin-top: 58px;

  padding-top: 30px;

  border-top: 1px solid #eceeef;
}

.about-contact-inner {
  padding: 28px;

  box-sizing: border-box;

  border: 1px solid #e6ebe8;

  border-radius: 11px;

  background: linear-gradient(135deg, rgba(248, 251, 249, 0.96), rgba(255, 255, 255, 0.96));
}

.about-contact-label {
  margin-bottom: 9px;

  color: #a0aaa4;

  font-size: 11px;

  line-height: 1.6;

  letter-spacing: 0.1em;
}

.about-contact h2 {
  margin: 0;

  color: #2c3e50;

  font-size: 20px;

  font-weight: 600;

  line-height: 1.5;
}

.about-contact p {
  margin: 11px 0 0;

  color: #7d878c;

  font-size: 13px;

  line-height: 1.8;
}

.about-github {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-top: 20px;

  padding: 12px 14px;

  box-sizing: border-box;

  border: 1px solid #e1e9e4;

  border-radius: 7px;

  background: rgba(255, 255, 255, 0.78);

  color: #64716b;

  font-size: 12px;

  line-height: 1.6;

  text-decoration: none;

  overflow: hidden;

  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.about-github:hover {
  border-color: #cfe3d8;

  background: #f7fbf9;

  color: #3eaf7c;

  text-decoration: none;
}

.about-github > span:first-child {
  min-width: 0;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.about-github-arrow {
  flex-shrink: 0;

  color: #9ca8a2;

  font-size: 15px;
}

/* ============================================================
 * 底部
 * ============================================================ */

.about-footer-note {
  margin-top: 46px;

  padding-top: 22px;

  border-top: 1px solid #f0f1f1;

  color: #afb5b2;

  font-size: 12px;

  line-height: 1.8;

  text-align: center;
}

/* ============================================================
 * PC
 * ============================================================ */

@media (min-width: 1201px) {
  .about-page {
    max-width: 880px;

    padding-left: 20px;

    padding-right: 20px;
  }
}

/* ============================================================
 * 手机
 * ============================================================ */

@media (max-width: 719px) {
  .about-page {
    max-width: 100%;

    padding: 22px 18px 55px;
  }

  .about-eyebrow {
    font-size: 11px;
  }

  .about-title {
    font-size: 30px;

    line-height: 1.3;
  }

  .about-subtitle {
    margin-top: 10px;

    font-size: 14px;
  }

  .about-intro {
    margin-top: 16px;

    font-size: 13px;

    line-height: 1.9;
  }

  .about-section {
    grid-template-columns: 38px minmax(0, 1fr);

    gap: 5px;

    margin-top: 42px;

    padding-top: 24px;
  }

  .about-section-label {
    padding-top: 4px;

    font-size: 10px;
  }

  .about-section-content h2 {
    font-size: 19px;
  }

  .about-section-content p {
    margin-top: 13px;

    font-size: 13px;

    line-height: 1.9;
  }

  .about-tech-list {
    grid-template-columns: 1fr;

    gap: 10px;

    margin-top: 17px;
  }

  .about-tech-item {
    min-height: auto;

    padding: 16px;
  }

  .about-tech-name {
    font-size: 14px;
  }

  .about-tech-description {
    font-size: 11px;

    line-height: 1.85;
  }

  .about-status-row {
    min-height: 48px;

    gap: 15px;
  }

  .about-status-name {
    font-size: 12px;
  }

  .about-status-value {
    font-size: 11px;
  }

  .about-contact {
    margin-top: 42px;

    padding-top: 24px;
  }

  .about-contact-inner {
    padding: 20px 17px;
  }

  .about-contact h2 {
    font-size: 18px;
  }

  .about-contact p {
    font-size: 12px;
  }

  .about-github {
    margin-top: 16px;

    padding: 11px 12px;

    font-size: 11px;
  }

  .about-footer-note {
    margin-top: 38px;

    padding-top: 18px;

    font-size: 11px;
  }
}
</style>
