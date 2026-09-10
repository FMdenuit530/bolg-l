<template>
  <ParentLayout>
    <template slot="page-top">
      <main class="archive-page">
        <!-- =========================
             页面头部
             ========================= -->
        <header class="archive-hero">
          <div class="archive-hero-inner">
            <div class="archive-eyebrow">ARCHIVE</div>

            <h1>文章归档</h1>

            <p class="archive-description">按时间浏览我的全部文章</p>

            <div class="archive-count">共 {{ totalPosts }} 篇文章</div>
          </div>
        </header>

        <!-- =========================
             没有文章
             ========================= -->
        <section v-if="!archiveGroups.length" class="archive-empty">
          <div class="archive-empty-title">暂无文章</div>

          <div class="archive-empty-text">发布文章后，它们会自动出现在这里。</div>
        </section>

        <!-- =========================
             归档内容
             ========================= -->
        <section v-else class="archive-content">
          <div v-for="yearGroup in archiveGroups" :key="yearGroup.year" class="archive-year">
            <!-- 年份 -->
            <div class="archive-year-header">
              <div class="archive-year-title">
                {{ yearGroup.year }}
              </div>

              <div class="archive-year-count">{{ yearGroup.count }} 篇</div>
            </div>

            <!-- 月份 -->
            <div v-for="monthGroup in yearGroup.months" :key="monthGroup.month" class="archive-month">
              <div class="archive-month-title">{{ monthGroup.month }} 月</div>

              <div class="archive-posts">
                <router-link v-for="post in monthGroup.posts" :key="post.path" :to="post.path" class="archive-post">
                  <div class="archive-post-date">
                    {{ formatDay(post.archiveDate) }}
                  </div>

                  <div class="archive-post-main">
                    <div class="archive-post-title">
                      {{ post.title }}
                    </div>

                    <div v-if="post.frontmatter && post.frontmatter.category" class="archive-post-category">
                      {{ post.frontmatter.category }}
                    </div>
                  </div>

                  <div class="archive-post-arrow">→</div>
                </router-link>
              </div>
            </div>
          </div>
        </section>
      </main>
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
    /*
     * ========================================
     * 所有博客文章
     * ========================================
     */
    blogPosts() {
      return (this.$site.pages || [])
        .filter((page) => {
          return page.path.startsWith('/posts/') && page.frontmatter && page.frontmatter.date
        })
        .map((page) => {
          const dateInfo = this.parseDate(page.frontmatter.date)

          return {
            ...page,

            archiveDate: dateInfo.raw,
            archiveYear: dateInfo.year,
            archiveMonth: dateInfo.month,
            archiveDay: dateInfo.day,
            archiveTime: dateInfo.time,
          }
        })
        .filter((post) => {
          return post.archiveYear && post.archiveMonth
        })
        .sort((a, b) => {
          return b.archiveTime - a.archiveTime
        })
    },

    /*
     * ========================================
     * 文章总数量
     * ========================================
     */
    totalPosts() {
      return this.blogPosts.length
    },

    /*
     * ========================================
     * 按年份 + 月份归档
     * ========================================
     */
    archiveGroups() {
      const yearMap = {}

      this.blogPosts.forEach((post) => {
        const year = post.archiveYear
        const month = post.archiveMonth

        if (!yearMap[year]) {
          yearMap[year] = {}
        }

        if (!yearMap[year][month]) {
          yearMap[year][month] = []
        }

        yearMap[year][month].push(post)
      })

      return Object.keys(yearMap)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => {
          const monthMap = yearMap[year]

          const months = Object.keys(monthMap)
            .sort((a, b) => Number(b) - Number(a))
            .map((month) => {
              return {
                month,
                posts: monthMap[month],
              }
            })

          let count = 0

          months.forEach((monthGroup) => {
            count += monthGroup.posts.length
          })

          return {
            year,
            count,
            months,
          }
        })
    },
  },

  methods: {
    /*
     * ========================================
     * 日期解析
     * ========================================
     */
    parseDate(date) {
      const raw = String(date == null ? '' : date).trim()

      /*
       * 优先处理：
       *
       * 2026-09-07
       * 2026-09-07 12:30:00
       *
       * 这种最常见的文章日期格式。
       */
      const match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)

      if (match) {
        const year = Number(match[1])
        const month = Number(match[2])
        const day = Number(match[3])

        return {
          raw,
          year,
          month,
          day,
          time: new Date(year, month - 1, day).getTime(),
        }
      }

      /*
       * 如果以后使用其他合法日期格式，
       * 再尝试交给 Date 解析。
       */
      const d = new Date(raw)

      if (!isNaN(d.getTime())) {
        return {
          raw,
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          day: d.getDate(),
          time: d.getTime(),
        }
      }

      return {
        raw,
        year: null,
        month: null,
        day: null,
        time: 0,
      }
    },

    /*
     * ========================================
     * 显示日期中的“日”
     * ========================================
     */
    formatDay(date) {
      const info = this.parseDate(date)

      if (!info.day) {
        return '--'
      }

      return String(info.day).padStart(2, '0')
    },
  },
}
</script>

<style scoped>
/* =========================
   页面
   ========================= */

.archive-page {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 70vh;
}

/* =========================
   顶部
   ========================= */

.archive-hero {
  width: 100%;
}

.archive-hero-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 88px 40px 48px;
  box-sizing: border-box;
  text-align: left;
}

.archive-eyebrow {
  margin-bottom: 14px;
  color: #3eaf7c;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
}

.archive-hero-inner h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2.35rem;
  font-weight: 600;
  line-height: 1.35;
}

.archive-description {
  margin: 14px 0 0;
  color: #888;
  font-size: 15px;
  line-height: 1.8;
}

.archive-count {
  margin-top: 14px;
  color: #aaa;
  font-size: 13px;
}

/* =========================
   内容
   ========================= */

.archive-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px 80px;
  box-sizing: border-box;
}

.archive-year {
  margin-bottom: 54px;
}

.archive-year-header {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 24px;
}

.archive-year-title {
  color: #2c3e50;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.3;
}

.archive-year-count {
  color: #aaa;
  font-size: 13px;
}

/* =========================
   月份
   ========================= */

.archive-month {
  margin-bottom: 28px;
}

.archive-month-title {
  margin-bottom: 10px;
  color: #999;
  font-size: 14px;
  font-weight: 500;
}

/* =========================
   文章列表
   ========================= */

.archive-posts {
  border-left: 1px solid #edf0ef;
}

.archive-post {
  display: flex;
  align-items: center;
  min-height: 62px;
  padding: 12px 14px 12px 20px;
  box-sizing: border-box;

  border-bottom: 1px solid #f2f3f3;

  color: inherit;
  text-decoration: none;

  transition: background-color 0.2s ease, padding-left 0.2s ease;
}

.archive-post:hover {
  background: #fafcfb;
  padding-left: 24px;
}

/* =========================
   日期
   ========================= */

.archive-post-date {
  flex: 0 0 42px;

  color: #aaa;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

/* =========================
   文章主体
   ========================= */

.archive-post-main {
  flex: 1;
  min-width: 0;
}

.archive-post-title {
  color: #2c3e50;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archive-post-category {
  margin-top: 4px;
  color: #aaa;
  font-size: 12px;
}

/* =========================
   箭头
   ========================= */

.archive-post-arrow {
  margin-left: 16px;

  color: #bbb;
  font-size: 15px;

  transition: color 0.2s ease, transform 0.2s ease;
}

.archive-post:hover .archive-post-arrow {
  color: #3eaf7c;
  transform: translateX(3px);
}

/* =========================
   空状态
   ========================= */

.archive-empty {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 40px 100px;
  box-sizing: border-box;
}

.archive-empty-title {
  color: #2c3e50;
  font-size: 18px;
  font-weight: 500;
}

.archive-empty-text {
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}

/* =========================
   手机
   ========================= */

@media (max-width: 768px) {
  .archive-hero-inner {
    padding: 72px 20px 36px;
  }

  .archive-hero-inner h1 {
    font-size: 2rem;
  }

  .archive-content {
    padding: 0 20px 60px;
  }

  .archive-year {
    margin-bottom: 40px;
  }

  .archive-year-title {
    font-size: 26px;
  }

  .archive-post {
    min-height: 58px;
    padding-left: 14px;
  }

  .archive-post:hover {
    padding-left: 18px;
  }

  .archive-post-date {
    flex-basis: 36px;
    font-size: 12px;
  }

  .archive-post-title {
    font-size: 14px;
  }

  .archive-post-arrow {
    margin-left: 10px;
  }

  .archive-empty {
    padding: 10px 20px 80px;
  }
}
</style>
