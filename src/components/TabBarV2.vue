<template>
  <div v-if="!hideTabBar" class="tab-bar-v2">
    <!-- 主导航 Tab -->
    <div 
      v-for="item in tabs" 
      :key="item.path"
      class="tab-item"
      :class="{ active: isActive(item.path) }"
      @click="navigate(item.path)"
    >
      <component :is="item.icon" class="tab-icon" />
      <span class="tab-label">{{ item.label }}</span>
    </div>

    <!-- 悬浮操作按钮 (FAB) -->
    <div class="fab-container" @click="handleFabClick">
      <div class="fab-button">
        <CameraOutlined class="fab-icon" />
      </div>
      <span class="fab-label">上传票根</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  HomeOutlined, 
  CompassOutlined,
  UserOutlined,
  CameraOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const currentPath = computed(() => route.path)
const hideTabBar = computed(() => route.meta.hideTabBar === true)

// 简化为3个核心Tab
const tabs = [
  { path: '/', label: '首页', icon: HomeOutlined },
  { path: '/discover', label: '发现', icon: CompassOutlined },
  { path: '/mine', label: '我的', icon: UserOutlined }
]

const isActive = (path: string) => {
  if (path === '/') {
    return currentPath.value === '/'
  }
  return currentPath.value.startsWith(path)
}

const navigate = (path: string) => {
  router.push(path)
}

const handleFabClick = () => {
  router.push('/ticket-upload')
}
</script>

<style scoped>
.tab-bar-v2 {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  padding: 8px 0;
}

.tab-icon {
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.tab-label {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  transition: all 0.3s;
}

.tab-item.active .tab-icon,
.tab-item.active .tab-label {
  color: #FF6B35;
}

.tab-item:hover .tab-icon,
.tab-item:hover .tab-label {
  color: #FF6B35;
}

.tab-item:active {
  transform: scale(0.95);
}

/* 悬浮操作按钮样式 */
.fab-container {
  position: absolute;
  right: 20px;
  bottom: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 1001;
}

.fab-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.fab-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.5);
}

.fab-button:active {
  transform: scale(0.95);
}

.fab-icon {
  font-size: 28px;
  color: #fff;
}

.fab-label {
  font-size: 11px;
  color: #666;
  margin-top: 6px;
  font-weight: 500;
}
</style>

