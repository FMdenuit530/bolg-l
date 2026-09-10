<template>
  <div class="custom-404">
    <div class="custom-404-inner">
      <!-- 404 -->
      <div class="custom-404-code">404</div>

      <!-- 绿色短线 -->
      <div class="custom-404-line"></div>

      <!-- 中文标题 -->
      <h1>页面走丢了</h1>

      <!-- 描述 -->
      <p class="custom-404-description">你访问的页面不存在，或者已经被移动。</p>

      <!-- 返回首页 -->
      <router-link to="/" class="custom-404-button"> 返回首页 </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style scoped>
/* =========================================================
   404 页面
   ========================================================= */

.custom-404 {
  position: relative;

  min-height: calc(100vh - 60px);

  display: flex;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 60px 20px 80px;
}

.custom-404-inner {
  width: 100%;

  max-width: 760px;

  margin: 0 auto;

  box-sizing: border-box;

  text-align: center;
}

/* =========================================================
   404 数字
   ========================================================= */

.custom-404-code {
  color: #e1e7e4;

  font-size: 120px;

  font-weight: 650;

  line-height: 1;

  letter-spacing: 0.04em;
}

/* =========================================================
   绿色短线
   ========================================================= */

.custom-404-line {
  width: 44px;

  height: 2px;

  margin: 24px auto 24px;

  border-radius: 2px;

  background: #3eaf7c;

  opacity: 0.7;
}

/* =========================================================
   标题
   ========================================================= */

.custom-404 h1 {
  margin: 0;

  color: #2c3e50;

  font-size: 28px;

  font-weight: 600;

  line-height: 1.5;
}

/* =========================================================
   描述
   ========================================================= */

.custom-404-description {
  margin: 12px 0 0;

  color: #999;

  font-size: 14px;

  line-height: 1.8;
}

/* =========================================================
   返回首页
   ========================================================= */

.custom-404-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 98px;

  height: 36px;

  margin-top: 28px;

  padding: 0 18px;

  box-sizing: border-box;

  border: 1px solid #dfe9e4;

  border-radius: 18px;

  background: #f7fbf9;

  color: #3eaf7c;

  font-size: 13px;

  line-height: 1;

  text-decoration: none;

  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.custom-404-button:hover {
  transform: translateY(-2px);

  border-color: #3eaf7c;

  background: #3eaf7c;

  color: #fff;

  box-shadow: 0 6px 18px rgba(62, 175, 124, 0.1);

  text-decoration: none;
}

/* =========================================================
   手机
   ========================================================= */

@media (max-width: 719px) {
  .custom-404 {
    min-height: calc(100vh - 60px);

    padding: 50px 18px 70px;
  }

  .custom-404-code {
    font-size: 86px;
  }

  .custom-404-line {
    margin-top: 20px;

    margin-bottom: 20px;
  }

  .custom-404 h1 {
    font-size: 23px;
  }

  .custom-404-description {
    font-size: 13px;
  }

  .custom-404-button {
    min-width: 92px;

    height: 35px;

    margin-top: 24px;

    font-size: 12px;
  }
}
</style>
