<template>
  <div class="safe-image-wrapper">
    <!-- 骨架屏占位 -->
    <div v-if="loading" class="image-skeleton"></div>
    
    <!-- 实际图片 -->
    <img 
      v-show="!loading && !error"
      :src="currentSrc" 
      :alt="alt"
      :loading="lazyLoad ? 'lazy' : 'eager'"
      @load="handleLoad"
      @error="handleError"
      class="safe-image"
    />
    
    <!-- 错误占位图 -->
    <div v-if="error" class="image-error">
      <PictureOutlined class="error-icon" />
      <span class="error-text">图片加载失败</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PictureOutlined } from '@ant-design/icons-vue'

interface Props {
  src: string
  fallback?: string
  alt?: string
  lazyLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallback: '/images/placeholder.jpg',
  alt: '图片',
  lazyLoad: true
})

const currentSrc = ref(props.src)
const loading = ref(true)
const error = ref(false)
const retryCount = ref(0)
const maxRetries = 2

// 监听src变化,重置状态
watch(() => props.src, (newSrc) => {
  currentSrc.value = newSrc
  loading.value = true
  error.value = false
  retryCount.value = 0
})

const handleLoad = () => {
  loading.value = false
  error.value = false
}

const handleError = () => {
  console.warn(`图片加载失败: ${currentSrc.value}`)
  
  // 尝试使用fallback
  if (retryCount.value === 0 && props.fallback && currentSrc.value !== props.fallback) {
    console.log(`切换到备用图片: ${props.fallback}`)
    currentSrc.value = props.fallback
    retryCount.value++
    return
  }
  
  // 如果fallback也失败,显示错误占位
  loading.value = false
  error.value = true
}
</script>

<style scoped>
.safe-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.safe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.error-text {
  font-size: 14px;
}
</style>

