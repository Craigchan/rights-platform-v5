<template>
  <div class="empty-state">
    <!-- SVG插画 -->
    <div class="empty-illustration">
      <svg v-if="type === 'order'" width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="50" fill="#F0F0F0"/>
        <path d="M40 50h40v30H40z" fill="#D9D9D9"/>
        <path d="M45 45h30v5H45z" fill="#BFBFBF"/>
        <circle cx="60" cy="65" r="8" fill="#8C8C8C"/>
      </svg>
      <svg v-else-if="type === 'favorite'" width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="50" fill="#FFF0F0"/>
        <path d="M60 75L45 85l3-17-12-12 17-2 7-16 7 16 17 2-12 12 3 17z" fill="#FFB3B3"/>
      </svg>
      <svg v-else-if="type === 'voucher'" width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="50" fill="#FFF7E6"/>
        <rect x="35" y="45" width="50" height="30" rx="4" fill="#FFD591"/>
        <line x1="45" y1="55" x2="75" y2="55" stroke="#FA8C16" stroke-width="2"/>
        <line x1="45" y1="65" x2="65" y2="65" stroke="#FA8C16" stroke-width="2"/>
      </svg>
      <div v-else class="empty-icon">
        <component :is="iconComponent" />
      </div>
    </div>
    <div class="empty-title">{{ title }}</div>
    <div v-if="description" class="empty-description">{{ description }}</div>
    <a-button v-if="actionText" type="primary" @click="handleAction">
      {{ actionText }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  InboxOutlined,
  ShoppingOutlined,
  HeartOutlined,
  FileTextOutlined,
  FrownOutlined
} from '@ant-design/icons-vue'

interface Props {
  type?: 'order' | 'favorite' | 'voucher' | 'default' | 'error'
  title?: string
  description?: string
  actionText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  title: '暂无数据'
})

const emit = defineEmits<{
  (e: 'action'): void
}>()

const iconComponent = computed(() => {
  switch (props.type) {
    case 'order':
      return ShoppingOutlined
    case 'favorite':
      return HeartOutlined
    case 'voucher':
      return FileTextOutlined
    case 'error':
      return FrownOutlined
    default:
      return InboxOutlined
  }
})

const handleAction = () => {
  emit('action')
}
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-illustration {
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
  
  svg {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }
}

.empty-icon {
  font-size: 80px;
  color: #D9D9D9;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: #8C8C8C;
  margin-bottom: 20px;
  max-width: 300px;
}
</style>

