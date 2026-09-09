<template>
  <ParentLayout>
    <template slot="page-top">
      <main class="about-page">
        <!-- =========================
             Hero
             ========================= -->

        <section class="about-hero">
          <div class="about-hero-inner">
            <div class="about-kicker">ABOUT ME</div>

            <h1>关于我</h1>

            <p class="about-intro">记录学习 · 分享技术 · 持续成长</p>
          </div>
        </section>

        <!-- =========================
             内容
             ========================= -->

        <section class="about-content">
          <div class="about-content-inner">
            <!-- =========================
                 自我介绍
                 ========================= -->

            <section class="about-section">
              <div class="about-section-title">你好</div>

              <p>欢迎来到我的博客。</p>

              <p>这里主要记录我在编程学习、 开发实践以及技术探索过程中的一些 思考和总结。</p>

              <p>希望通过持续记录，把零散的知识 逐渐整理成自己的技术体系。</p>
            </section>

            <!-- =========================
                 技术方向
                 ========================= -->

            <section class="about-section">
              <div class="about-section-title">技术方向</div>

              <div class="skill-list">
                <div class="skill-item">
                  <div class="skill-name">JavaScript</div>

                  <div class="skill-line">Web 开发、异步编程、现代 JavaScript</div>
                </div>

                <div class="skill-item">
                  <div class="skill-name">Vue</div>

                  <div class="skill-line">Vue 生态、组件化开发、VuePress</div>
                </div>

                <div class="skill-item">
                  <div class="skill-name">Git</div>

                  <div class="skill-line">版本控制、项目协作、GitHub</div>
                </div>
              </div>
            </section>

            <!-- =========================
                 博客
                 ========================= -->

            <section class="about-section">
              <div class="about-section-title">关于这个博客</div>

              <p>这个博客主要用于记录学习过程中的 技术文章、开发笔记和一些实践经验。</p>

              <p>博客使用 VuePress 构建，并部署在 GitHub Pages。</p>
            </section>

            <!-- =========================
                 座右铭
                 ========================= -->

            <section class="about-quote">
              <div class="quote-mark">“</div>

              <p>不积跬步，无以至千里。</p>

              <div class="quote-author">持续学习，持续记录。</div>
            </section>

            <!-- =========================
                 GitHub
                 ========================= -->

            <section class="about-links">
              <a href="https://github.com/FMdenuit530" target="_blank" rel="noopener noreferrer" class="about-github">
                <span> GitHub </span>

                <span> ↗ </span>
              </a>
            </section>
          </div>
        </section>
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
/* =========================
   页面
   ========================= */

.about-page {
  width: 100%;

  min-height: 100vh;

  box-sizing: border-box;
}

/* =========================
   Hero
   ========================= */

.about-hero {
  width: 100%;

  padding: 100px 20px 55px;

  box-sizing: border-box;
}

.about-hero-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 0 30px;

  box-sizing: border-box;
}

.about-kicker {
  margin-bottom: 15px;

  color: #aaa;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.18em;
}

.about-hero h1 {
  margin: 0;

  color: #2c3e50;

  font-size: 2.7rem;

  font-weight: 700;

  line-height: 1.3;
}

.about-intro {
  margin: 15px 0 0;

  color: #888;

  font-size: 16px;

  line-height: 1.8;
}

/* =========================
   内容
   ========================= */

.about-content {
  width: 100%;
}

.about-content-inner {
  max-width: 900px;

  margin: 0 auto;

  padding: 0 30px 80px;

  box-sizing: border-box;
}

/* =========================
   内容段落
   ========================= */

.about-section {
  padding: 35px 0;

  border-bottom: 1px solid #eeeeee;
}

.about-section:first-child {
  padding-top: 10px;
}

.about-section-title {
  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 20px;

  color: #2c3e50;

  font-size: 17px;

  font-weight: 600;
}

.about-section-title::after {
  content: '';

  width: 55px;

  height: 1px;

  background: #eeeeee;
}

.about-section p {
  max-width: 720px;

  margin: 12px 0;

  color: #666;

  font-size: 15px;

  line-height: 2;
}

/* =========================
   技术方向
   ========================= */

.skill-list {
  display: flex;

  flex-direction: column;
}

.skill-item {
  display: grid;

  grid-template-columns: 140px 1fr;

  align-items: center;

  gap: 20px;

  padding: 17px 0;

  border-bottom: 1px solid #f2f2f2;
}

.skill-item:last-child {
  border-bottom: none;
}

.skill-name {
  color: #3eaf7c;

  font-size: 15px;

  font-weight: 600;
}

.skill-line {
  color: #888;

  font-size: 14px;

  line-height: 1.7;
}

/* =========================
   引用
   ========================= */

.about-quote {
  position: relative;

  margin: 45px 0;

  padding: 30px 35px;

  border-left: 2px solid #3eaf7c;

  background: #fafcfb;

  box-sizing: border-box;
}

.quote-mark {
  position: absolute;

  top: 8px;

  left: 18px;

  color: #dcefe5;

  font-family: Georgia, serif;

  font-size: 54px;

  line-height: 1;
}

.about-quote p {
  position: relative;

  margin: 0;

  color: #555;

  font-family: Georgia, 'Noto Serif SC', serif;

  font-size: 19px;

  line-height: 1.8;
}

.quote-author {
  position: relative;

  margin-top: 10px;

  color: #aaa;

  font-size: 12px;
}

/* =========================
   GitHub
   ========================= */

.about-links {
  padding-top: 10px;
}

.about-github {
  display: inline-flex;

  align-items: center;

  gap: 10px;

  padding: 10px 16px;

  border: 1px solid #e5ebe8;

  border-radius: 6px;

  color: #666;

  font-size: 13px;

  text-decoration: none;

  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.about-github:hover {
  border-color: #cfe8da;

  color: #3eaf7c;

  text-decoration: none;

  transform: translateY(-2px);
}

/* =========================
   手机
   ========================= */

@media (max-width: 719px) {
  .about-hero {
    padding: 82px 18px 45px;
  }

  .about-hero-inner {
    padding: 0 2px;
  }

  .about-hero h1 {
    font-size: 2.2rem;
  }

  .about-intro {
    font-size: 14px;
  }

  .about-content-inner {
    padding: 0 18px 55px;
  }

  .about-section {
    padding: 28px 0;
  }

  .about-section:first-child {
    padding-top: 8px;
  }

  .about-section p {
    font-size: 14px;

    line-height: 1.9;
  }

  .skill-item {
    grid-template-columns: 1fr;

    gap: 5px;

    padding: 15px 0;
  }

  .skill-line {
    font-size: 13px;
  }

  .about-quote {
    margin: 35px 0;

    padding: 25px 25px;
  }

  .about-quote p {
    font-size: 17px;
  }
}
</style>
