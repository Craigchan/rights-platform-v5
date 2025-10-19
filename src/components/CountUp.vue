<template>
  <span class="count-up">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  endValue: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  decimals: 0,
  prefix: '',
  suffix: ''
})

const displayValue = ref(props.prefix + '0' + props.suffix)

const animate = (start: number, end: number) => {
  const startTime = Date.now()
  const range = end - start
  
  const step = () => {
    const now = Date.now()
    const progress = Math.min((now - startTime) / props.duration, 1)
    
    // 使用 easeOutCubic 缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    
    const current = start + range * easeProgress
    const value = props.decimals > 0 
      ? current.toFixed(props.decimals)
      : Math.floor(current).toString()
    
    displayValue.value = props.prefix + value + props.suffix
    
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  
  requestAnimationFrame(step)
}

watch(() => props.endValue, (newVal, oldVal) => {
  const start = oldVal || 0
  animate(start, newVal)
})

onMounted(() => {
  animate(0, props.endValue)
})
</script>

<style scoped>
.count-up {
  font-family: var(--font-family-number);
  font-variant-numeric: tabular-nums;
}
</style>

