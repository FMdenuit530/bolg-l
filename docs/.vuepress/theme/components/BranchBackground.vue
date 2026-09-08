<template>
  <canvas ref="canvas" class="branch-background"></canvas>
</template>

<script>
export default {
  name: 'BranchBackground',

  data() {
    return {
      canvas: null,
      ctx: null,

      width: 0,
      height: 0,

      /*
       * ========================================
       * 正在生长的枝条
       * ========================================
       */
      tips: [],

      /*
       * ========================================
       * 已经生成的枝条空间记录
       *
       * 用于：
       * 防止枝条在局部区域疯狂打架
       * ========================================
       */
      branchPoints: [],

      /*
       * ========================================
       * 总枝条数量
       * ========================================
       */
      branchCount: 0,

      /*
       * 1500 左右比较适合博客背景
       */
      maxBranches: 800,

      /*
       * ========================================
       * 动画
       * ========================================
       */
      animationFrame: null,
      startTime: 0,
      duration: 7800,

      /*
       * ========================================
       * 参数
       * ========================================
       */
      config: {
        /*
         * ====================================
         * 最大深度
         * ====================================
         */
        maxDepth: 18,

        /*
         * ====================================
         * 根节点
         *
         * 始终 3~4 边
         *
         * 每个边最多一个根
         * ====================================
         */
        rootMin: 3,
        rootMax: 4,

        rootMinDistance: 0.3,

        /*
         * ====================================
         * 普通枝条长度
         * ====================================
         */
        lengthMin: 40,
        lengthMax: 60,

        /*
         * ====================================
         * 末端枝条长度
         * ====================================
         */
        terminalLengthMin: 22,
        terminalLengthMax: 44,

        /*
         * ====================================
         * 墨色
         * ====================================
         */
        ink: '76, 76, 76',

        /*
         * ====================================
         * 透明度
         * ====================================
         */
        opacityMin: 0.018,
        opacityMax: 0.038,

        /*
         * ====================================
         * 弯曲
         * ====================================
         */
        bendMin: 0.26,
        bendMax: 0.82,

        /*
         * ====================================
         * 方向记忆
         * ====================================
         */
        directionMemoryMin: 0.7,
        directionMemoryMax: 0.92,

        /*
         * ====================================
         * 漂移
         * ====================================
         */
        driftMin: 0.06,
        driftMax: 0.24,

        /*
         * ====================================
         * 老枝转向
         * ====================================
         */
        oldBranchTurnProbability: 0.095,

        /*
         * ====================================
         * 三枝 / 四枝
         * ====================================
         */
        threeBranchProbability: 0.055,
        fourBranchProbability: 0.005,

        /*
         * ====================================
         * 中心引导
         * ====================================
         */
        centerPullMin: 0.008,
        centerPullMax: 0.065,

        /*
         * ====================================
         * 向外延伸
         * ====================================
         */
        outerFlowProbability: 0.1,

        /*
         * ====================================
         * 子枝随机性
         * ====================================
         */
        childDirectionRandomness: 0.3,

        /*
         * ====================================
         * 节点随机性
         * ====================================
         */
        jointRandomness: 0.26,

        /*
         * ====================================
         * 长度随机变化
         * ====================================
         */
        lengthVariation: 0.5,

        /*
         * ====================================
         * 长枝概率
         * ====================================
         */
        longSegmentProbability: 0.18,

        /*
         * ====================================
         * 短枝概率
         * ====================================
         */
        shortSegmentProbability: 0.14,

        /*
         * ====================================
         * 分枝延迟
         * ====================================
         */
        branchDelayMin: 1,
        branchDelayMax: 3,

        /*
         * ====================================
         * 最小生长段数
         * ====================================
         */
        minimumGrowthSegments: 6,

        /*
         * ====================================
         * 屏幕边缘反弹
         * ====================================
         */

        edgeMargin: 65,

        edgeBounceStrength: 0.58,

        edgeLimit: 12,

        /*
         * ====================================
         * 文字区域保护
         * ====================================
         */

        textSafeZone: true,

        textSafeWidth: 0.72,

        textSafeHeight: 0.42,

        textSafeOpacity: 0.28,

        /*
         * ========================================
         * 新增：枝条发散控制
         * ========================================
         *
         * 这是解决“挤成一坨”的核心。
         */

        /*
         * 周围多少像素开始检测其它枝条
         */
        spreadRadius: 105,

        /*
         * 同一方向至少保持多少角度
         *
         * 0.28 ≈ 16°
         * 0.36 ≈ 21°
         */
        spreadMinAngle: 0.3,

        /*
         * 避让强度
         *
         * 越大越不容易打架
         */
        spreadStrength: 0.72,

        /*
         * 检测附近枝条数量
         *
         * 不扫描全部 1500+
         */
        spreadSampleCount: 45,

        /*
         * ========================================
         * 新增：节点分叉间距
         * ========================================
         *
         * 防止同一个节点：
         *
         *       /
         *      /
         *  ----
         *      \
         *       \
         *
         * 变成：
         *
         *       ///
         *  ----///
         *      ///
         */
        jointMinAngle: 0.42,

        /*
         * ========================================
         * 新增：局部拥挤抑制
         * ========================================
         */
        crowdingRadius: 72,

        crowdingStrength: 0.62,
      },
    }
  },

  mounted() {
    this.canvas = this.$refs.canvas

    this.ctx = this.canvas.getContext('2d')

    this.resize()

    window.addEventListener('resize', this.resize)

    this.start()

    /*
     * VuePress 路由切换
     */
    if (this.$router) {
      this.$router.afterEach(() => {
        setTimeout(() => {
          this.start()
        }, 100)
      })
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize)

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  },

  methods: {
    /*
     * ========================================
     * 基础随机
     * ========================================
     */

    random(min, max) {
      return Math.random() * (max - min) + min
    },

    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value))
    },

    normalizeAngle(angle) {
      while (angle > Math.PI) {
        angle -= Math.PI * 2
      }

      while (angle < -Math.PI) {
        angle += Math.PI * 2
      }

      return angle
    },

    angleDifference(a, b) {
      return this.normalizeAngle(a - b)
    },

    /*
     * ========================================
     * Canvas 尺寸
     * ========================================
     */

    resize() {
      if (!this.canvas || !this.ctx) {
        return
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      this.width = window.innerWidth
      this.height = window.innerHeight

      this.canvas.width = this.width * dpr
      this.canvas.height = this.height * dpr

      this.canvas.style.width = this.width + 'px'
      this.canvas.style.height = this.height + 'px'

      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      this.ctx.clearRect(0, 0, this.width, this.height)
    },

    /*
     * ========================================
     * 开始
     * ========================================
     */

    start() {
      if (!this.ctx) {
        return
      }

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
      }

      this.ctx.clearRect(0, 0, this.width, this.height)

      this.tips = []

      this.branchPoints = []

      this.branchCount = 0

      /*
       * 3~4 个边缘根
       */
      this.createEdgeRoots()

      this.startTime = performance.now()

      this.animationFrame = requestAnimationFrame(this.animate)
    },

    /*
     * ========================================
     * 选择根所在边
     *
     * 永远：
     * 3 边
     * 或
     * 4 边
     *
     * 每边最多一个
     * ========================================
     */

    chooseEdges() {
      const r = Math.random()

      /*
       * 78% 三边
       */
      if (r < 0.78) {
        const missing = this.randomInt(0, 3)

        return [0, 1, 2, 3].filter((side) => side !== missing)
      }

      /*
       * 22% 四边
       */
      return [0, 1, 2, 3]
    },

    /*
     * ========================================
     * 创建边缘根
     * ========================================
     */

    createEdgeRoots() {
      const edges = this.chooseEdges()

      const uniqueEdges = [...new Set(edges)]

      uniqueEdges.forEach((side) => {
        this.createRoot(side)
      })
    },

    /*
     * ========================================
     * 创建根
     * ========================================
     */

    createRoot(side) {
      const margin = 38

      let x
      let y
      let angle

      /*
       * 0 = 上
       * 1 = 右
       * 2 = 下
       * 3 = 左
       */

      if (side === 0) {
        x = this.random(margin, this.width - margin)

        y = -8

        angle = Math.PI / 2 + this.random(-0.34, 0.34)
      } else if (side === 1) {
        x = this.width + 8

        y = this.random(margin, this.height - margin)

        angle = Math.PI + this.random(-0.34, 0.34)
      } else if (side === 2) {
        x = this.random(margin, this.width - margin)

        y = this.height + 8

        angle = -Math.PI / 2 + this.random(-0.34, 0.34)
      } else {
        x = -8

        y = this.random(margin, this.height - margin)

        angle = this.random(-0.34, 0.34)
      }

      /*
       * ====================================
       * 中心方向
       * ====================================
       */

      const centerAngle = this.getCenterAngle(x, y)

      const flowRandom = Math.random()

      if (flowRandom < 0.55) {
        angle = angle * 0.42 + centerAngle * 0.58
      } else if (flowRandom < 0.55 + this.config.outerFlowProbability) {
        angle += this.random(-0.35, 0.35)
      }

      /*
       * 根也进行一次边缘保护
       */
      angle = this.getEdgeBounceAngle(x, y, angle)

      this.addTip({
        x,
        y,
        angle,
        depth: 0,
        type: 'backbone',
        flow: 'in',
        segmentIndex: 0,
        parentAngle: angle,
      })
    },

    /*
     * ========================================
     * 中心方向
     * ========================================
     */

    getCenterAngle(x, y) {
      const cx = this.width / 2
      const cy = this.height / 2

      return Math.atan2(cy - y, cx - x)
    },

    /*
     * ========================================
     * 中心距离
     * ========================================
     */

    getCenterDistance(x, y) {
      const cx = this.width / 2
      const cy = this.height / 2

      return Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2))
    },

    /*
     * ========================================
     * 空间方向
     * ========================================
     */

    getSpatialAngle(x, y, angle) {
      const cx = this.width / 2
      const cy = this.height / 2

      const dx = x - cx
      const dy = y - cy

      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 1) {
        return angle
      }

      const radialAngle = Math.atan2(dy, dx)

      const tangent = radialAngle + (Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2)

      return this.normalizeAngle(tangent * 0.25 + angle * 0.75)
    },

    /*
     * ========================================
     * 屏幕边缘柔性反弹
     * ========================================
     */

    getEdgeBounceAngle(x, y, angle) {
      const margin = this.config.edgeMargin

      let forceX = 0
      let forceY = 0

      /*
       * 左
       */
      if (x < margin) {
        const strength = 1 - this.clamp(x / margin, 0, 1)

        forceX += strength
      }

      /*
       * 右
       */
      if (x > this.width - margin) {
        const strength = 1 - this.clamp((this.width - x) / margin, 0, 1)

        forceX -= strength
      }

      /*
       * 上
       */
      if (y < margin) {
        const strength = 1 - this.clamp(y / margin, 0, 1)

        forceY += strength
      }

      /*
       * 下
       */
      if (y > this.height - margin) {
        const strength = 1 - this.clamp((this.height - y) / margin, 0, 1)

        forceY -= strength
      }

      /*
       * 没靠近边缘
       */
      if (Math.abs(forceX) < 0.001 && Math.abs(forceY) < 0.001) {
        return angle
      }

      const targetAngle = Math.atan2(forceY, forceX)

      const forceLength = Math.sqrt(forceX * forceX + forceY * forceY)

      const strength = this.clamp(forceLength * this.config.edgeBounceStrength, 0, 0.92)

      return this.normalizeAngle(angle + this.angleDifference(targetAngle, angle) * strength)
    },

    /*
     * ========================================
     * 硬限制
     * ========================================
     */

    constrainAngleInside(x, y, angle) {
      const limit = this.config.edgeLimit

      if (x <= -limit && Math.cos(angle) < 0) {
        angle = -angle
      }

      if (x >= this.width + limit && Math.cos(angle) > 0) {
        angle = Math.PI - angle
      }

      if (y <= -limit && Math.sin(angle) < 0) {
        angle = Math.PI - angle
      }

      if (y >= this.height + limit && Math.sin(angle) > 0) {
        angle = -angle
      }

      return this.normalizeAngle(angle)
    },

    /*
     * ========================================
     * 文字区域透明度
     * ========================================
     */

    getTextSafeOpacity(x, y) {
      if (!this.config.textSafeZone) {
        return 1
      }

      const safeWidth = this.width * this.config.textSafeWidth

      const safeHeight = this.height * this.config.textSafeHeight

      const left = (this.width - safeWidth) / 2

      const right = left + safeWidth

      const top = (this.height - safeHeight) / 2

      const bottom = top + safeHeight

      if (x < left || x > right || y < top || y > bottom) {
        return 1
      }

      const centerX = this.width / 2

      const centerY = this.height / 2

      const dx = Math.abs(x - centerX) / (safeWidth / 2)

      const dy = Math.abs(y - centerY) / (safeHeight / 2)

      const distance = Math.max(dx, dy)

      const strength = 1 - this.clamp(distance, 0, 1)

      return 1 - strength * (1 - this.config.textSafeOpacity)
    },

    /*
     * ========================================
     * 判断一个位置附近是否太拥挤
     * ========================================
     *
     * 不是检查所有枝条。
     *
     * 只检查最近生成的一部分枝条，
     * 避免 1500+ 条时性能下降。
     */

    getCrowdingForce(x, y, angle) {
      const radius = this.config.crowdingRadius

      let forceX = 0
      let forceY = 0

      let count = 0

      const start = Math.max(0, this.branchPoints.length - this.config.spreadSampleCount)

      for (let i = this.branchPoints.length - 1; i >= start; i--) {
        const point = this.branchPoints[i]

        const dx = x - point.x

        const dy = y - point.y

        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= 1 || distance > radius) {
          continue
        }

        /*
         * 越近影响越强
         */
        const strength = 1 - distance / radius

        /*
         * 从拥挤点指向外面
         */
        forceX += (dx / distance) * strength

        forceY += (dy / distance) * strength

        count++

        if (count >= this.config.spreadSampleCount) {
          break
        }
      }

      if (count === 0) {
        return angle
      }

      const forceAngle = Math.atan2(forceY, forceX)

      /*
       * 只轻微改变方向
       *
       * 不让枝条突然拐弯
       */
      const forceStrength = this.clamp(Math.sqrt(forceX * forceX + forceY * forceY) * this.config.crowdingStrength, 0, 0.65)

      return this.normalizeAngle(angle + this.angleDifference(forceAngle, angle) * forceStrength)
    },

    /*
     * ========================================
     * 发散方向修正
     * ========================================
     *
     * 核心：
     *
     * 如果附近已有枝条朝向非常接近，
     * 就把当前枝条轻轻推开。
     *
     * 不改变整体随机性。
     */

    getSpreadAngle(x, y, angle, usedAngles) {
      let result = angle

      /*
       * ====================================
       * 第一层：
       * 同节点分枝不能太接近
       * ====================================
       */

      if (usedAngles && usedAngles.length) {
        let bestAngle = result
        let bestScore = -Infinity

        /*
         * 当前方向
         */
        const candidates = [result, result + this.config.jointMinAngle, result - this.config.jointMinAngle, result + this.config.jointMinAngle * 1.45, result - this.config.jointMinAngle * 1.45, result + this.config.jointMinAngle * 2.0, result - this.config.jointMinAngle * 2.0]

        candidates.forEach((candidate) => {
          let score = 0

          usedAngles.forEach((existing) => {
            const diff = Math.abs(this.angleDifference(candidate, existing))

            score += Math.min(diff, Math.PI)
          })

          if (score > bestScore) {
            bestScore = score
            bestAngle = candidate
          }
        })

        result = bestAngle
      }

      /*
       * ====================================
       * 第二层：
       * 附近已有枝条
       * ====================================
       */

      result = this.getCrowdingForce(x, y, result)

      /*
       * ====================================
       * 第三层：
       * 检查最近生成的枝条
       * ====================================
       */

      const radius = this.config.spreadRadius

      const start = Math.max(0, this.branchPoints.length - this.config.spreadSampleCount)

      let nearest = null
      let nearestDistance = Infinity

      for (let i = this.branchPoints.length - 1; i >= start; i--) {
        const point = this.branchPoints[i]

        const dx = x - point.x

        const dy = y - point.y

        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < nearestDistance && distance < radius) {
          nearest = point
          nearestDistance = distance
        }
      }

      if (nearest) {
        const existingAngle = nearest.angle

        const diff = this.angleDifference(result, existingAngle)

        const absDiff = Math.abs(diff)

        /*
         * 如果方向太接近
         */
        if (absDiff < this.config.spreadMinAngle) {
          const side = diff >= 0 ? 1 : -1

          const push = (this.config.spreadMinAngle - absDiff) * this.config.spreadStrength

          result += side * push
        }
      }

      /*
       * 最后保持自然随机
       */
      result += this.random(-0.08, 0.08)

      return this.normalizeAngle(result)
    },

    /*
     * ========================================
     * 创建枝条
     * ========================================
     */

    addTip(data) {
      if (this.branchCount >= this.maxBranches) {
        return null
      }

      if (data.depth > this.config.maxDepth) {
        return null
      }

      const isBackbone = data.type === 'backbone'

      const terminal = data.depth >= 13

      let length

      if (terminal) {
        length = this.random(this.config.terminalLengthMin, this.config.terminalLengthMax)
      } else {
        length = this.random(this.config.lengthMin, this.config.lengthMax)
      }

      /*
       * 长枝
       */
      if (Math.random() < this.config.longSegmentProbability) {
        length *= this.random(1.12, 1.42)
      }

      /*
       * 短枝
       */
      if (Math.random() < this.config.shortSegmentProbability) {
        length *= this.random(0.62, 0.82)
      }

      /*
       * 长度随机
       */
      length *= this.random(1 - this.config.lengthVariation, 1 + this.config.lengthVariation)

      /*
       * 深度越深越短
       */
      const depthScale = 1 - Math.min(data.depth / 24, 0.38)

      length *= depthScale

      /*
       * ====================================
       * 线宽
       * ====================================
       */

      let lineWidth

      if (isBackbone) {
        lineWidth = this.random(1.05, 1.85)
      } else {
        lineWidth = this.random(0.55, 1.18)
      }

      lineWidth *= 1 - Math.min(data.depth * 0.035, 0.48)

      /*
       * ====================================
       * 透明度
       * ====================================
       */

      let opacity = this.random(this.config.opacityMin, this.config.opacityMax)

      const depthOpacityScale = 1 - Math.min(data.depth * 0.032, 0.55)

      opacity *= depthOpacityScale

      /*
       * ====================================
       * 弯曲
       * ====================================
       */

      const bend = this.random(this.config.bendMin, this.config.bendMax)

      /*
       * ====================================
       * 方向记忆
       * ====================================
       */

      const directionMemory = this.random(this.config.directionMemoryMin, this.config.directionMemoryMax)

      /*
       * ====================================
       * 漂移
       * ====================================
       */

      const drift = this.random(this.config.driftMin, this.config.driftMax)

      /*
       * ====================================
       * 生长速度
       * ====================================
       */

      const speed = this.random(0.7, 1.02)

      const tip = {
        x: data.x,
        y: data.y,

        angle: data.angle,

        depth: data.depth,

        type: data.type,

        flow: data.flow || 'in',

        segmentIndex: data.segmentIndex || 0,

        parentAngle: data.parentAngle || data.angle,

        length,

        progress: 0,

        bend,

        directionMemory,

        drift,

        speed,

        lineWidth,

        opacity,

        branched: false,

        growthSegments: 0,

        delay: this.randomInt(this.config.branchDelayMin, this.config.branchDelayMax),

        /*
         * 固定弯曲方向
         */
        bendSide: Math.random() < 0.5 ? -1 : 1,
      }

      this.tips.push(tip)

      this.branchCount++

      /*
       * ====================================
       * 记录空间位置
       *
       * 不记录全部细节，
       * 只用于后续发散判断。
       * ====================================
       */

      this.branchPoints.push({
        x: data.x,
        y: data.y,
        angle: data.angle,
        depth: data.depth,
      })

      /*
       * 控制空间记录大小
       */
      if (this.branchPoints.length > 500) {
        this.branchPoints.shift()
      }

      return tip
    },

    /*
     * ========================================
     * 判断停止
     * ========================================
     */

    shouldStop(tip) {
      if (tip.depth >= this.config.maxDepth) {
        return true
      }

      if (tip.growthSegments < this.config.minimumGrowthSegments) {
        return false
      }

      /*
       * 主干
       */
      if (tip.type === 'backbone') {
        if (tip.depth <= 4) {
          return Math.random() < 0.018
        }

        if (tip.depth <= 8) {
          return Math.random() < 0.032
        }

        if (tip.depth <= 12) {
          return Math.random() < 0.06
        }

        return Math.random() < 0.11
      }

      /*
       * 普通枝
       */
      if (tip.depth <= 4) {
        return Math.random() < 0.05
      }

      if (tip.depth <= 8) {
        return Math.random() < 0.085
      }

      if (tip.depth <= 12) {
        return Math.random() < 0.14
      }

      if (tip.depth <= 15) {
        return Math.random() < 0.21
      }

      return Math.random() < 0.32
    },

    /*
     * ========================================
     * 是否允许分枝
     * ========================================
     */

    canBranch(tip) {
      if (tip.depth >= this.config.maxDepth) {
        return false
      }

      if (tip.type === 'backbone' && tip.segmentIndex < this.config.branchDelayMin) {
        return false
      }

      if (tip.type === 'backbone' && tip.segmentIndex < tip.delay) {
        return false
      }

      return true
    },

    /*
     * ========================================
     * 子枝数量
     * ========================================
     */

    getChildCount(tip) {
      if (tip.depth >= this.config.maxDepth) {
        return 0
      }

      if (this.shouldStop(tip)) {
        return 0
      }

      /*
       * 主干
       */
      if (tip.type === 'backbone') {
        if (!this.canBranch(tip)) {
          return 1
        }

        const r = Math.random()

        const one = 0.42
        const two = 0.49

        const three = this.config.threeBranchProbability

        const four = this.config.fourBranchProbability

        if (r < one) {
          return 1
        }

        if (r < one + two) {
          return 2
        }

        if (r < one + two + three) {
          return 3
        }

        if (r < one + two + three + four) {
          return 4
        }

        return 2
      }

      /*
       * 深层
       */
      if (tip.depth >= 13) {
        const r = Math.random()

        if (r < 0.52) {
          return 1
        }

        if (r < 0.85) {
          return 2
        }

        if (r < 0.85 + this.config.threeBranchProbability) {
          return 3
        }

        return 1
      }

      /*
       * 普通枝
       */
      const r = Math.random()

      const one = 0.48
      const two = 0.45

      const three = this.config.threeBranchProbability

      const four = this.config.fourBranchProbability

      if (r < one) {
        return 1
      }

      if (r < one + two) {
        return 2
      }

      if (r < one + two + three) {
        return 3
      }

      if (r < one + two + three + four) {
        return 4
      }

      return 2
    },

    /*
     * ========================================
     * 创建子枝
     * ========================================
     */

    spawnChildren(tip) {
      if (tip.branched) {
        return
      }

      tip.branched = true

      const count = this.getChildCount(tip)

      if (count <= 0) {
        return
      }

      /*
       * ====================================
       * 当前枝条末端
       * ====================================
       */

      const endX = tip.x + Math.cos(tip.angle) * tip.length

      const endY = tip.y + Math.sin(tip.angle) * tip.length

      /*
       * ====================================
       * 边缘反弹
       * ====================================
       */

      let bouncedAngle = this.getEdgeBounceAngle(endX, endY, tip.angle)

      bouncedAngle = this.constrainAngleInside(endX, endY, bouncedAngle)

      /*
       * ====================================
       * 空间方向
       * ====================================
       */

      const spatialAngle = this.getSpatialAngle(endX, endY, bouncedAngle)

      /*
       * ====================================
       * 中心方向
       * ====================================
       */

      const centerAngle = this.getCenterAngle(endX, endY)

      /*
       * ====================================
       * 基础方向
       * ====================================
       */

      let baseAngle = bouncedAngle

      if (tip.flow === 'in') {
        baseAngle = baseAngle * 0.72 + centerAngle * 0.28
      } else if (tip.flow === 'out') {
        baseAngle = baseAngle * 0.82 + spatialAngle * 0.18
      } else {
        baseAngle = baseAngle * 0.82 + spatialAngle * 0.18
      }

      /*
       * 再次边缘修正
       */
      baseAngle = this.getEdgeBounceAngle(endX, endY, baseAngle)

      baseAngle = this.constrainAngleInside(endX, endY, baseAngle)

      /*
       * 漂移
       */
      baseAngle += this.random(-tip.drift, tip.drift)

      /*
       * ====================================
       * 候选方向
       * ====================================
       */

      const candidates = []

      /*
       * ====================================
       * 一枝
       * ====================================
       */

      if (count === 1) {
        let angle = baseAngle * tip.directionMemory + spatialAngle * (1 - tip.directionMemory)

        angle += this.random(-this.config.childDirectionRandomness, this.config.childDirectionRandomness)

        angle += this.random(-tip.bend * 0.48, tip.bend * 0.48)

        /*
         * 偶尔转向
         */
        if (Math.random() < this.config.oldBranchTurnProbability) {
          angle += this.random(-0.55, 0.55)
        }

        angle = this.getEdgeBounceAngle(endX, endY, angle)

        candidates.push(angle)
      } else if (count === 2) {
        /*
         * ==================================
         * 两枝
         * ==================================
         */

        let mainAngle = baseAngle * tip.directionMemory + spatialAngle * (1 - tip.directionMemory)

        mainAngle += this.random(-tip.bend * 0.36, tip.bend * 0.36)

        mainAngle += this.random(-this.config.childDirectionRandomness, this.config.childDirectionRandomness)

        mainAngle = this.getEdgeBounceAngle(endX, endY, mainAngle)

        candidates.push(mainAngle)

        /*
         * 侧枝
         */
        const side = Math.random() < 0.5 ? -1 : 1

        let sideAngle = mainAngle + side * this.random(0.62, 1.02)

        sideAngle += this.random(-this.config.jointRandomness, this.config.jointRandomness)

        sideAngle = this.getEdgeBounceAngle(endX, endY, sideAngle)

        candidates.push(sideAngle)
      } else if (count === 3) {
        /*
         * ==================================
         * 三枝
         * ==================================
         */

        let mainAngle = baseAngle * tip.directionMemory + spatialAngle * (1 - tip.directionMemory)

        mainAngle += this.random(-tip.bend * 0.32, tip.bend * 0.32)

        mainAngle = this.getEdgeBounceAngle(endX, endY, mainAngle)

        candidates.push(mainAngle)

        candidates.push(this.getEdgeBounceAngle(endX, endY, mainAngle + this.random(0.56, 0.86)))

        candidates.push(this.getEdgeBounceAngle(endX, endY, mainAngle - this.random(0.56, 0.86)))
      } else {
        /*
         * ==================================
         * 四枝
         * ==================================
         */

        const offsets = [-1.16, -0.48, 0.46, 1.12]

        offsets.forEach((offset) => {
          candidates.push(this.getEdgeBounceAngle(endX, endY, baseAngle + offset + this.random(-0.12, 0.12)))
        })
      }

      /*
       * ====================================
       * 随机打乱
       * ====================================
       */

      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))

        const temp = candidates[i]

        candidates[i] = candidates[j]

        candidates[j] = temp
      }

      /*
       * ====================================
       * 实际创建
       * ====================================
       */

      const usedAngles = []

      candidates.forEach((angle) => {
        /*
         * ==================================
         * 发散修正
         * ==================================
         */

        angle = this.getSpreadAngle(endX, endY, angle, usedAngles)

        /*
         * 再次边缘保护
         */
        angle = this.getEdgeBounceAngle(endX, endY, angle)

        angle = this.constrainAngleInside(endX, endY, angle)

        /*
         * ==================================
         * 同节点方向检测
         * ==================================
         */

        let valid = true

        for (let i = 0; i < usedAngles.length; i++) {
          const diff = Math.abs(this.angleDifference(angle, usedAngles[i]))

          if (diff < this.config.jointMinAngle) {
            valid = false
            break
          }
        }

        if (!valid) {
          return
        }

        usedAngles.push(angle)

        /*
         * ==================================
         * 子枝流向
         * ==================================
         */

        let childFlow = tip.flow

        if (Math.random() < 0.2) {
          const r = Math.random()

          if (r < 0.5) {
            childFlow = 'in'
          } else if (r < 0.78) {
            childFlow = 'out'
          } else {
            childFlow = 'neutral'
          }
        }

        /*
         * ==================================
         * 关节点随机偏移
         *
         * 现在缩小一点，
         * 防止枝条从节点附近互相穿插。
         * ==================================
         */

        const jointOffset = this.random(-Math.min(this.config.jointRandomness, 0.18), Math.min(this.config.jointRandomness, 0.18))

        /*
         * ==================================
         * 深度
         * ==================================
         */

        const childDepth = tip.depth + 1

        /*
         * ==================================
         * 深层使用 twig
         * ==================================
         */

        let childType = 'branch'

        if (tip.depth >= 9 && Math.random() < 0.3) {
          childType = 'twig'
        }

        /*
         * ==================================
         * 最终方向
         * ==================================
         */

        let finalAngle = angle

        finalAngle = this.getSpreadAngle(endX, endY, finalAngle, usedAngles)

        finalAngle = this.getEdgeBounceAngle(endX, endY, finalAngle)

        finalAngle = this.constrainAngleInside(endX, endY, finalAngle)

        /*
         * ==================================
         * 创建
         * ==================================
         */

        this.addTip({
          x: endX + Math.cos(finalAngle) * jointOffset,

          y: endY + Math.sin(finalAngle) * jointOffset,

          angle: finalAngle,

          depth: childDepth,

          type: childType,

          flow: childFlow,

          segmentIndex: tip.segmentIndex + 1,

          parentAngle: tip.angle,
        })
      })
    },

    /*
     * ========================================
     * 绘制枝条
     * ========================================
     */

    drawTip(tip, progress) {
      if (!this.ctx) {
        return
      }

      const p = this.clamp(progress, 0, 1)

      if (p <= 0) {
        return
      }

      const currentLength = tip.length * p

      const x0 = tip.x
      const y0 = tip.y

      const x3 = tip.x + Math.cos(tip.angle) * currentLength

      const y3 = tip.y + Math.sin(tip.angle) * currentLength

      /*
       * ====================================
       * 弯曲方向
       * ====================================
       */

      const bend = tip.bend * tip.bendSide

      /*
       * ====================================
       * 控制点
       * ====================================
       */

      const c1Length = currentLength * 0.34

      const c2Length = currentLength * 0.72

      const c1Angle = tip.angle + bend * 0.42

      const c2Angle = tip.angle + bend * 0.72

      const x1 = x0 + Math.cos(c1Angle) * c1Length

      const y1 = y0 + Math.sin(c1Angle) * c1Length

      const x2 = x0 + Math.cos(c2Angle) * c2Length

      const y2 = y0 + Math.sin(c2Angle) * c2Length

      /*
       * ====================================
       * 文字区域透明度
       * ====================================
       */

      const midX = (x0 + x3) / 2

      const midY = (y0 + y3) / 2

      const textSafeOpacity = this.getTextSafeOpacity(midX, midY)

      const finalOpacity = tip.opacity * textSafeOpacity

      /*
       * ====================================
       * 绘制
       * ====================================
       */

      this.ctx.beginPath()

      this.ctx.moveTo(x0, y0)

      this.ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)

      this.ctx.strokeStyle = `rgba(${this.config.ink}, ${finalOpacity})`

      this.ctx.lineWidth = tip.lineWidth

      this.ctx.lineCap = 'butt'

      this.ctx.lineJoin = 'round'

      this.ctx.stroke()
    },

    /*
     * ========================================
     * 生长
     * ========================================
     */

    growTip(tip) {
      if (!tip) {
        return
      }

      tip.progress += 0.025 * tip.speed

      this.drawTip(tip, tip.progress)

      /*
       * ====================================
       * 完整一段
       * ====================================
       */

      if (tip.progress >= 1) {
        tip.progress = 1

        tip.growthSegments++

        if (!tip.branched) {
          this.spawnChildren(tip)
        }
      }
    },

    /*
     * ========================================
     * 动画
     * ========================================
     */

    animate(timestamp) {
      const elapsed = timestamp - this.startTime

      /*
       * ====================================
       * 动画结束
       * ====================================
       */

      if (elapsed >= this.duration) {
        this.tips.forEach((tip) => {
          if (tip.progress < 1) {
            this.drawTip(tip, 1)
          }
        })

        this.animationFrame = null

        return
      }

      /*
       * ====================================
       * 当前枝条
       * ====================================
       */

      const currentTips = this.tips.slice()

      currentTips.forEach((tip) => {
        if (tip.progress < 1) {
          this.growTip(tip)
        }
      })

      /*
       * ====================================
       * 下一帧
       * ====================================
       */

      this.animationFrame = requestAnimationFrame(this.animate)
    },
  },
}
</script>

<style scoped>
.branch-background {
  position: fixed;

  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  pointer-events: none;

  /*
   * Canvas 在页面内容下面
   */
  z-index: 0;

  display: block;
}
</style>
