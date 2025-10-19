<template>
  <div v-if="!hideTabBar" class="tab-bar">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  WalletOutlined, 
  UserOutlined 
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const currentPath = computed(() => route.path)
const hideTabBar = computed(() => route.meta.hideTabBar === true)

const tabs = [
  { path: '/', label: '首页', icon: HomeOutlined },
  { path: '/points-mall', label: '积分商城', icon: ShoppingOutlined },
  { path: '/vouchers', label: '我的票券', icon: WalletOutlined },
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
</script>

<style scoped>
.tab-bar {
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
</style>

