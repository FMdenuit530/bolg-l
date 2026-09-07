module.exports = ({ router }) => {
  // 浏览器环境才执行
  if (typeof document === 'undefined') {
    return
  }

  function addCopyStyle() {
    if (document.getElementById('copy-code-style')) {
      return
    }

    const style = document.createElement('style')

    style.id = 'copy-code-style'

    style.innerHTML = `
      .copy-code-button {
        position: absolute;
        top: 8px;
        right: 48px;
        z-index: 10;
        padding: 3px 8px;
        border: 1px solid #eaecef;
        border-radius: 4px;
        background: #fff;
        color: #666;
        font-size: 12px;
        cursor: pointer;
        transition: all .2s ease;
      }

      .copy-code-button:hover {
        color: #3eaf7c;
        border-color: #3eaf7c;
      }

      div[class*="language-"] {
        position: relative;
      }
    `

    document.head.appendChild(style)
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
    }

    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea')

      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'

      document.body.appendChild(textarea)

      textarea.focus()
      textarea.select()

      try {
        document.execCommand('copy')
        resolve()
      } catch (error) {
        reject(error)
      }

      document.body.removeChild(textarea)
    })
  }

  function addCopyButtons() {
    addCopyStyle()

    const blocks = document.querySelectorAll('div[class*="language-"]')

    blocks.forEach((block) => {
      if (block.querySelector('.copy-code-button')) {
        return
      }

      const button = document.createElement('button')

      button.className = 'copy-code-button'
      button.type = 'button'
      button.textContent = '复制'

      button.addEventListener('click', () => {
        const code = block.querySelector('code')

        if (!code) {
          return
        }

        copyText(code.innerText)
          .then(() => {
            button.textContent = '已复制'

            setTimeout(() => {
              button.textContent = '复制'
            }, 1500)
          })
          .catch(() => {
            button.textContent = '复制失败'

            setTimeout(() => {
              button.textContent = '复制'
            }, 1500)
          })
      })

      block.appendChild(button)
    })
  }

  // 首次加载
  router.onReady(() => {
    setTimeout(addCopyButtons, 0)
  })

  // VuePress 页面切换后重新添加
  router.afterEach(() => {
    setTimeout(addCopyButtons, 0)
  })
}
