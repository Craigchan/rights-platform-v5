<template>
  <div class="confetti-container" v-if="show">
    <div
      v-for="(confetti, index) in confettis"
      :key="index"
      class="confetti"
      :style="getConfettiStyle(confetti)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 3000
  }
})

// Emits
const emit = defineEmits(['complete'])

// 粒子数据
interface Confetti {
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  delay: number
  duration: number
}

const confettis = ref<Confetti[]>([])
let timer: number | null = null

// 颜色列表
const colors = [
  '#FFD700', // 金色
  '#FFA500', // 橙色
  '#FF6B35', // 红橙
  '#F7931E', // 橙黄
  '#FF69B4', // 粉红
  '#00CED1', // 青色
  '#9370DB', // 紫色
  '#32CD32'  // 绿色
]

// 生成粒子
const generateConfettis = () => {
  const count = 50 // 粒子数量
  confettis.value = []
  
  for (let i = 0; i < count; i++) {
    confettis.value.push({
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2
    })
  }
}

// 获取粒子样式
const getConfettiStyle = (confetti: Confetti) => {
  return {
    left: `${confetti.x}%`,
    top: `${confetti.y}%`,
    backgroundColor: confetti.color,
    transform: `rotate(${confetti.rotation}deg) scale(${confetti.scale})`,
    animationDelay: `${confetti.delay}s`,
    animationDuration: `${confetti.duration}s`
  }
}

// 监听show变化
watch(() => props.show, (val) => {
  if (val) {
    generateConfettis()
    
    // 设置自动隐藏
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => {
      emit('complete')
    }, props.duration)
  }
})

// 清理
onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped lang="scss">
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confettiFall linear forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
</style>

