<template>
  <div class="pull-to-refresh-container" ref="containerRef">
    <!-- 下拉提示区域 -->
    <div class="pull-indicator" :style="{ height: pullDistance + 'px' }">
      <div class="indicator-content" :class="pullStatus">
        <LoadingOutlined v-if="pullStatus === 'refreshing'" class="indicator-icon spinning" />
        <DownOutlined v-else-if="pullStatus === 'pull'" class="indicator-icon" />
        <UpOutlined v-else-if="pullStatus === 'release'" class="indicator-icon" />
        <CheckCircleOutlined v-else-if="pullStatus === 'success'" class="indicator-icon" />
        <span class="indicator-text">{{ statusText }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper" :style="{ transform: `translateY(${contentTransform}px)` }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  LoadingOutlined,
  DownOutlined,
  UpOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

interface Props {
  onRefresh: () => Promise<void>
  threshold?: number // 触发刷新的阈值
  maxDistance?: number // 最大下拉距离
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 60,
  maxDistance: 100
})

const containerRef = ref<HTMLElement | null>(null)
const pullDistance = ref(0)
const pullStatus = ref<'idle' | 'pull' | 'release' | 'refreshing' | 'success'>('idle')
const startY = ref(0)
const isPulling = ref(false)

const statusText = computed(() => {
  switch (pullStatus.value) {
    case 'pull':
      return '下拉刷新'
    case 'release':
      return '释放刷新'
    case 'refreshing':
      return '刷新中...'
    case 'success':
      return '刷新成功'
    default:
      return ''
  }
})

const contentTransform = computed(() => {
  return pullStatus.value === 'refreshing' ? props.threshold : pullDistance.value
})

const handleTouchStart = (e: TouchEvent) => {
  // 只有在页面顶部时才允许下拉刷新
  if (window.scrollY === 0 && !isPulling.value && pullStatus.value === 'idle') {
    startY.value = e.touches[0].clientY
    isPulling.value = true
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isPulling.value || pullStatus.value === 'refreshing') return

  const currentY = e.touches[0].clientY
  const distance = currentY - startY.value

  if (distance > 0) {
    // 阻止默认滚动行为
    e.preventDefault()

    // 计算下拉距离,使用阻尼效果
    const damping = 0.5
    pullDistance.value = Math.min(distance * damping, props.maxDistance)

    // 更新状态
    if (pullDistance.value >= props.threshold) {
      pullStatus.value = 'release'
    } else {
      pullStatus.value = 'pull'
    }
  }
}

const handleTouchEnd = async () => {
  if (!isPulling.value) return

  isPulling.value = false

  if (pullStatus.value === 'release') {
    // 触发刷新
    pullStatus.value = 'refreshing'
    pullDistance.value = props.threshold

    try {
      await props.onRefresh()
      pullStatus.value = 'success'

      // 显示成功状态1秒后重置
      setTimeout(() => {
        resetPull()
      }, 1000)
    } catch (error) {
      console.error('刷新失败:', error)
      resetPull()
    }
  } else {
    // 未达到阈值,回弹
    resetPull()
  }
}

const resetPull = () => {
  pullDistance.value = 0
  pullStatus.value = 'idle'
}

onMounted(() => {
  const container = containerRef.value
  if (container) {
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
  }
})

onUnmounted(() => {
  const container = containerRef.value
  if (container) {
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
    container.removeEventListener('touchend', handleTouchEnd)
  }
})
</script>

<style scoped lang="scss">
.pull-to-refresh-container {
  position: relative;
  overflow: hidden;
}

.pull-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  transition: height 0.2s ease;
  z-index: 10;
}

.indicator-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  transition: all 0.3s ease;

  &.pull {
    .indicator-icon {
      color: #8C8C8C;
    }
  }

  &.release {
    .indicator-icon {
      color: #FF6B35;
      transform: rotate(180deg);
    }
  }

  &.refreshing {
    .indicator-icon {
      color: #FF6B35;
    }
  }

  &.success {
    .indicator-icon {
      color: #52c41a;
    }
  }
}

.indicator-icon {
  font-size: 20px;
  transition: all 0.3s ease;

  &.spinning {
    animation: spin 1s linear infinite;
  }
}

.indicator-text {
  font-size: 12px;
  color: #8C8C8C;
}

.content-wrapper {
  transition: transform 0.3s ease;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

