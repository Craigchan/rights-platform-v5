<template>
  <Transition name="fade-up">
    <div 
      v-show="visible" 
      class="back-to-top"
      @click="scrollToTop"
      :style="{ bottom: bottomOffset + 'px', right: rightOffset + 'px' }"
    >
      <UpOutlined class="icon" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { UpOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const visible = ref(false)
const scrollThreshold = 300 // 滚动超过300px时显示

// 根据是否有TabBar调整底部距离和左右位置
const bottomOffset = ref(80)
const rightOffset = ref(20)

// 监听滚动事件
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  visible.value = scrollTop > scrollThreshold
}

// 平滑滚动到顶部
const scrollToTop = () => {
  // 使用动画滚动
  const scrollStep = -window.scrollY / (300 / 15) // 300ms内完成
  const scrollInterval = setInterval(() => {
    if (window.scrollY !== 0) {
      window.scrollBy(0, scrollStep)
    } else {
      clearInterval(scrollInterval)
    }
  }, 15)
}

// 根据路由调整底部距离和左右位置
const updatePosition = () => {
  // 如果路由meta中hideTabBar为true，则距离底部更近，在右侧
  if (route.meta.hideTabBar) {
    bottomOffset.value = 30
    rightOffset.value = 20  // 无TabBar时在右侧
  } else {
    bottomOffset.value = 80
    rightOffset.value = 90  // 有TabBar时在左侧，避开上传票根按钮
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  updatePosition()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 监听路由变化，更新位置
import { watch } from 'vue'
watch(() => route.path, () => {
  updatePosition()
  // 路由切换时隐藏按钮
  visible.value = false
})
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  /* right值通过style动态设置 */
  width: 48px;
  height: 48px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;

  &:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    background: #f5f5f5;
  }

  &:active {
    transform: scale(0.95);
  }

  .icon {
    font-size: 20px;
    color: #1890ff;
    transition: color 0.3s;
  }

  &:hover .icon {
    color: #40a9ff;
  }
}

// 淡入淡出 + 上滑动画
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

// 移动端优化
@media (max-width: 768px) {
  .back-to-top {
    width: 44px;
    height: 44px;
    right: 16px;

    .icon {
      font-size: 18px;
    }
  }
}

// 深色模式支持（可选）
@media (prefers-color-scheme: dark) {
  .back-to-top {
    background: #1f1f1f;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background: #2a2a2a;
    }

    .icon {
      color: #40a9ff;
    }
  }
}
</style>

