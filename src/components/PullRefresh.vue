<template>
  <div class="pull-refresh-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <div class="pull-refresh-header" :style="{ height: pullDistance + 'px' }">
      <div class="refresh-content" :class="{ refreshing: isRefreshing }">
        <LoadingOutlined v-if="isRefreshing" class="refresh-icon spin" />
        <ArrowDownOutlined v-else class="refresh-icon" :class="{ 'icon-rotate': pullDistance >= threshold }" />
        <span class="refresh-text">{{ refreshText }}</span>
      </div>
    </div>
    <div class="pull-refresh-content" :style="{ transform: `translateY(${pullDistance}px)` }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LoadingOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'

interface Props {
  threshold?: number
  onRefresh?: () => Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 60
})

const emit = defineEmits<{
  refresh: []
}>()

const pullDistance = ref(0)
const isRefreshing = ref(false)
const startY = ref(0)
const isPulling = ref(false)

const refreshText = computed(() => {
  if (isRefreshing.value) return '刷新中...'
  if (pullDistance.value >= props.threshold) return '松开刷新'
  return '下拉刷新'
})

const handleTouchStart = (e: TouchEvent) => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop === 0 && !isRefreshing.value) {
    startY.value = e.touches[0].clientY
    isPulling.value = true
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isPulling.value) return
  
  const currentY = e.touches[0].clientY
  const distance = currentY - startY.value
  
  if (distance > 0) {
    e.preventDefault()
    // 添加阻尼效果
    pullDistance.value = Math.min(distance * 0.5, props.threshold * 1.5)
  }
}

const handleTouchEnd = async () => {
  if (!isPulling.value) return
  
  isPulling.value = false
  
  if (pullDistance.value >= props.threshold && !isRefreshing.value) {
    isRefreshing.value = true
    pullDistance.value = props.threshold
    
    try {
      if (props.onRefresh) {
        await props.onRefresh()
      }
      emit('refresh')
    } finally {
      setTimeout(() => {
        isRefreshing.value = false
        pullDistance.value = 0
      }, 300)
    }
  } else {
    pullDistance.value = 0
  }
}
</script>

<style scoped>
@import '../styles/variables.css';
@import '../styles/animations.css';

.pull-refresh-container {
  position: relative;
  overflow: hidden;
}

.pull-refresh-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  transition: height 0.3s ease-out;
}

.refresh-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: var(--color-text-secondary);
}

.refresh-content.refreshing {
  color: var(--color-primary);
}

.refresh-icon {
  font-size: 18px;
  transition: transform 0.3s ease-out;
}

.icon-rotate {
  transform: rotate(180deg);
}

.refresh-text {
  font-size: var(--font-size-sm);
}

.pull-refresh-content {
  transition: transform 0.3s ease-out;
}
</style>

