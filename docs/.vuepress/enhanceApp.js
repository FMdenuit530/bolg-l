export default ({ router }) => {
  // 添加复制功能
  const addCopyButtons = () => {
    const codeBlocks = document.querySelectorAll('div[class*="language-"]')

    codeBlocks.forEach((block) => {
      // 已经添加过就不重复添加
      if (block.querySelector('.copy-code-button')) {
        return
      }

      const pre = block.querySelector('pre')

      if (!pre) {
        return
      }

      const button = document.createElement('button')

      button.className = 'copy-code-button'
      button.type = 'button'
      button.textContent = '复制'

      button.addEventListener('click', async (event) => {
        // 防止按钮点击影响代码块
        event.preventDefault()
        event.stopPropagation()

        // 获取真正的代码内容
        const codeElement = pre.querySelector('code')

        if (!codeElement) {
          return
        }

        const code = codeElement.textContent

        try {
          await copyText(code)

          button.textContent = '✓ 已复制'

          setTimeout(() => {
            button.textContent = '复制'
          }, 1500)
        } catch (error) {
          button.textContent = '复制失败'

          setTimeout(() => {
            button.textContent = '复制'
          }, 1500)

          console.error('代码复制失败:', error)
        }
      })

      block.appendChild(button)
    })
  }

  // 复制文本
  const copyText = async (text) => {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return
    }

    // 兼容 localhost / 部分浏览器
    const textarea = document.createElement('textarea')

    textarea.value = text

    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '0'

    document.body.appendChild(textarea)

    textarea.focus()
    textarea.select()

    const success = document.execCommand('copy')

    document.body.removeChild(textarea)

    if (!success) {
      throw new Error('浏览器拒绝复制')
    }
  }

  // 注入样式
  const addCopyStyle = () => {
    if (document.getElementById('copy-code-style')) {
      return
    }

    const style = document.createElement('style')

    style.id = 'copy-code-style'

    style.textContent = `
      /* 代码块复制按钮 */

      div[class*="language-"] {
        position: relative;
      }

     .copy-code-button {
  position: absolute;

  top: 8px;
  right: 48px;

  z-index: 10;

  height: 26px;
  padding: 0 9px;

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;

  background: rgba(0, 0, 0, 0.35);

  color: rgba(255, 255, 255, 0.75);

  font-size: 12px;
  line-height: 24px;

  cursor: pointer;

  opacity: 0;

  transition:
    opacity 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

      div[class*="language-"]:hover .copy-code-button {
        opacity: 1;
      }

      .copy-code-button:hover {
        background: rgba(0, 0, 0, 0.6);

        color: #fff;
      }

      .copy-code-button:active {
        transform: translateY(1px);
      }

      .copy-code-button:focus {
        outline: none;
      }

      /* 防止复制按钮和语言名称重叠 */

      div[class*="language-"] > pre {
        padding-top: 1.8rem !important;
      }

      /* 手机端始终显示 */

      @media (max-width: 719px) {
        .copy-code-button {
          opacity: 1;
        }
      }
    `

    document.head.appendChild(style)
  }

  // 初始化
  const init = () => {
    addCopyStyle()

    setTimeout(() => {
      addCopyButtons()
    }, 100)
  }

  // 第一次进入
  init()

  // VuePress 页面切换
  router.afterEach(() => {
    setTimeout(() => {
      addCopyButtons()
    }, 100)
  })
}
