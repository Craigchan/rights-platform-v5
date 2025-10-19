<template>
  <div class="tab-bar">
    <div 
      v-for="item in tabs" 
      :key="item.path"
      class="tab-item"
      :class="{ active: isActive(item.path) }"
      @click="handleTabClick(item)"
    >
      <div class="tab-icon-wrapper">
        <component :is="item.icon" class="tab-icon" />
        <span v-if="item.badge" class="tab-badge">{{ item.badge }}</span>
      </div>
      <span class="tab-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeOutlined,
  TagsOutlined,
  EnvironmentOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const tabs = [
  {
    path: '/',
    label: '首页',
    icon: HomeOutlined,
    badge: ''
  },
  {
    path: '/vouchers',
    label: '优惠券',
    icon: TagsOutlined,
    badge: '3'
  },
  {
    path: '/nearby',
    label: '附近',
    icon: EnvironmentOutlined,
    badge: ''
  },
  {
    path: '/mine',
    label: '我的',
    icon: UserOutlined,
    badge: ''
  }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleTabClick = (item: any) => {
  if (route.path !== item.path) {
    router.push(item.path)
  }
}
</script>

<style scoped>
@import '../styles/variables.css';

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: var(--tabbar-height);
  background: var(--color-bg-base);
  border-top: 1px solid var(--color-border-light);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: var(--z-fixed);
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  transition: all var(--duration-fast);
}

.tab-item:active {
  transform: scale(0.95);
}

.tab-icon-wrapper {
  position: relative;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon {
  font-size: 24px;
  color: var(--color-text-tertiary);
  transition: all var(--duration-base);
}

.tab-item.active .tab-icon {
  color: var(--color-primary);
  transform: scale(1.1);
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--color-error);
  color: white;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
}

.tab-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
  transition: all var(--duration-base);
}

.tab-item.active .tab-label {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
</style>

