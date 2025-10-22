<template>
  <div class="empty-state">
    <div class="empty-icon">
      <component :is="iconComponent" />
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

.empty-icon {
  font-size: 80px;
  color: #D9D9D9;
  margin-bottom: 16px;
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

