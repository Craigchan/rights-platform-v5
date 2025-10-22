<template>
  <Teleport to="body">
    <Transition name="toast-fade">
      <div v-if="visible" class="toast-container" :class="type">
        <component :is="iconComponent" class="toast-icon" />
        <span class="toast-message">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'

interface Props {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 2000,
  show: false
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const visible = ref(props.show)

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleOutlined
    case 'error':
      return CloseCircleOutlined
    case 'warning':
      return ExclamationCircleOutlined
    default:
      return InfoCircleOutlined
  }
})

watch(() => props.show, (newVal) => {
  visible.value = newVal
  if (newVal && props.duration > 0) {
    setTimeout(() => {
      visible.value = false
      emit('update:show', false)
    }, props.duration)
  }
})
</script>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 80vw;
  
  &.success {
    .toast-icon {
      color: #52c41a;
    }
  }
  
  &.error {
    .toast-icon {
      color: #ff4d4f;
    }
  }
  
  &.warning {
    .toast-icon {
      color: #faad14;
    }
  }
  
  &.info {
    .toast-icon {
      color: #1890ff;
    }
  }
}

.toast-icon {
  font-size: 18px;
}

.toast-message {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}
</style>

