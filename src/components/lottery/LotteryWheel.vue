<template>
  <div class="lottery-wheel-component">
    <!-- 转盘容器 -->
    <div class="wheel-container">
      <!-- 外圈装饰 -->
      <div class="wheel-outer-ring">
        <div class="ring-dots">
          <div v-for="i in 24" :key="i" class="dot" :style="{ transform: `rotate(${i * 15}deg) translateY(-165px)`, animationDelay: `${i * 0.05}s` }"></div>
        </div>
        <!-- 旋转光环 -->
        <div class="rotating-ring"></div>
      </div>
      
      <!-- 光芒效果 -->
      <div class="light-rays">
        <div v-for="i in 12" :key="i" class="ray" :style="{ transform: `rotate(${i * 30}deg)` }"></div>
      </div>
      
      <!-- 转盘主体 -->
      <div 
        class="wheel-main" 
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <!-- 使用 canvas 绘制扇区背景 -->
        <canvas ref="wheelCanvas" class="wheel-canvas" width="340" height="340"></canvas>
        
        <!-- 奖品内容层 -->
        <div class="prizes-layer">
          <div 
            v-for="(prize, index) in prizes" 
            :key="index"
            class="prize-item"
            :style="getPrizeItemStyle(index)"
          >
            <div class="prize-icon">{{ prize.icon || '🎁' }}</div>
            <div class="prize-name">{{ prize.name }}</div>
          </div>
        </div>
      </div>
      
      <!-- 中心按钮 -->
      <div 
        class="center-button"
        :class="{ disabled: isSpinning || disabled, spinning: isSpinning }"
        @click="handleSpin"
      >
        <div class="button-inner">
          <div class="button-text">{{ isSpinning ? '抽奖中' : buttonText }}</div>
        </div>
      </div>
      
      <!-- 指针 -->
      <div class="pointer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, PropType } from 'vue'
import { soundManager } from '@/utils/soundAndVibration'

// 奖品接口
interface Prize {
  id: string
  name: string
  icon?: string
  value: string
  probability?: number
  type?: 'coupon' | 'points' | 'product' | 'empty'
}

// Props
const props = defineProps({
  prizes: {
    type: Array as PropType<Prize[]>,
    required: true,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: '开始'
  }
})

// Emits
const emit = defineEmits<{
  spin: []
  complete: [prize: Prize]
}>()

// 状态
const rotation = ref(0)
const isSpinning = ref(false)
const wheelCanvas = ref<HTMLCanvasElement | null>(null)

// 计算扇区角度
const sectorAngle = computed(() => 360 / props.prizes.length)

// 绘制转盘
const drawWheel = () => {
  if (!wheelCanvas.value) return
  
  const canvas = wheelCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = canvas.width / 2
  
  const colors = [
    ['#FFD93D', '#FFA500'],
    ['#FFB84D', '#FF8C00']
  ]
  
  props.prizes.forEach((prize, index) => {
    const startAngle = (sectorAngle.value * index - 90) * Math.PI / 180
    const endAngle = (sectorAngle.value * (index + 1) - 90) * Math.PI / 180
    
    // 绘制扇区
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()
    
    // 渐变填充
    const gradient = ctx.createLinearGradient(
      centerX + Math.cos(startAngle) * radius,
      centerY + Math.sin(startAngle) * radius,
      centerX + Math.cos(endAngle) * radius,
      centerY + Math.sin(endAngle) * radius
    )
    const colorPair = colors[index % 2]
    gradient.addColorStop(0, colorPair[0])
    gradient.addColorStop(1, colorPair[1])
    
    ctx.fillStyle = gradient
    ctx.fill()
    
    // 绘制分隔线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(startAngle) * radius,
      centerY + Math.sin(startAngle) * radius
    )
    ctx.stroke()
  })
}

// 获取奖品位置样式
const getPrizeItemStyle = (index: number) => {
  const angle = (sectorAngle.value * index + sectorAngle.value / 2) * Math.PI / 180
  const distance = 110 // 距离中心的距离
  
  const x = Math.sin(angle) * distance
  const y = -Math.cos(angle) * distance
  
  return {
    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
  }
}

// 开始抽奖
const handleSpin = () => {
  if (isSpinning.value || props.disabled) return
  
  // 播放点击音效和震动
  soundManager.playClick()
  
  emit('spin')
}

// 执行旋转动画
const spin = (targetPrizeIndex: number) => {
  return new Promise<Prize>((resolve) => {
    isSpinning.value = true
    
    // 播放抽奖开始音效
    soundManager.playLotteryStart()
    
    // 计算目标角度
    const baseRotation = 360 * 6 // 基础旋转6圈
    const targetAngle = 360 - (sectorAngle.value * targetPrizeIndex + sectorAngle.value / 2)
    const finalRotation = baseRotation + targetAngle
    
    // 设置旋转
    rotation.value = finalRotation
    
    // 动画完成后
    setTimeout(() => {
      isSpinning.value = false
      const prize = props.prizes[targetPrizeIndex]
      
      // 根据奖品类型播放音效
      if (prize.type === 'empty' || prize.name.includes('谢谢')) {
        soundManager.playLotteryLose()
      } else {
        soundManager.playLotteryWin()
      }
      
      emit('complete', prize)
      resolve(prize)
    }, 5000) // 5秒动画时间
  })
}

// 重置转盘
const reset = () => {
  rotation.value = 0
  isSpinning.value = false
}

// 监听奖品变化，重新绘制转盘
watch(() => props.prizes, () => {
  drawWheel()
}, { immediate: false })

// 组件挂载后绘制转盘
onMounted(() => {
  drawWheel()
})

// 暴露方法给父组件
defineExpose({
  spin,
  reset
})
</script>

<style scoped lang="scss">
.lottery-wheel-component {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
}

.wheel-container {
  position: relative;
  width: 340px;
  height: 340px;
}

// 光芒效果
.light-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: raysRotate 20s linear infinite;
}

.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 200px;
  margin-left: -2px;
  margin-top: -200px;
  background: linear-gradient(to bottom, 
    rgba(255, 215, 0, 0.8) 0%, 
    rgba(255, 215, 0, 0.4) 30%,
    transparent 100%);
  transform-origin: center 200px;
  opacity: 0;
  animation: rayPulse 3s ease-in-out infinite;
}

.ray:nth-child(odd) {
  animation-delay: 1.5s;
}

@keyframes raysRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes rayPulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

// 外圈装饰
.wheel-outer-ring {
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.8),
    0 0 60px rgba(255, 165, 0, 0.5),
    0 8px 20px rgba(0, 0, 0, 0.15),
    inset 0 0 30px rgba(255, 255, 255, 0.3);
  animation: ringPulse 2s ease-in-out infinite;
}

.ring-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  margin-left: -4px;
  margin-top: -4px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  animation: dotBlink 1.5s ease-in-out infinite;
}

.dot:nth-child(3n) {
  background: #FFD700;
}

.dot:nth-child(3n+1) {
  background: #FFA500;
}

.rotating-ring {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 3px dashed rgba(255, 255, 255, 0.4);
  animation: ringRotateReverse 8s linear infinite;
}

@keyframes ringRotateReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes dotBlink {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  }
  50% { 
    opacity: 0.3; 
    transform: scale(1.3);
    box-shadow: 0 0 15px rgba(255, 255, 255, 1);
  }
}

@keyframes ringPulse {
  0%, 100% { 
    box-shadow: 
      0 0 30px rgba(255, 215, 0, 0.8),
      0 0 60px rgba(255, 165, 0, 0.5),
      0 8px 20px rgba(0, 0, 0, 0.15),
      inset 0 0 30px rgba(255, 255, 255, 0.3);
  }
  50% { 
    box-shadow: 
      0 0 40px rgba(255, 215, 0, 1),
      0 0 80px rgba(255, 165, 0, 0.7),
      0 8px 20px rgba(0, 0, 0, 0.15),
      inset 0 0 40px rgba(255, 255, 255, 0.4);
  }
}

// 转盘主体
.wheel-main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.25),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.wheel-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: canvasGlow 3s ease-in-out infinite;
}

@keyframes canvasGlow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
  }
}

// 奖品层
.prizes-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.prize-item {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.4),
    0 0 8px rgba(0, 0, 0, 0.2);
}

.prize-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: prizeFloat 3s ease-in-out infinite;
}

.prize-item:nth-child(odd) .prize-icon {
  animation-delay: 1.5s;
}

@keyframes prizeFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.prize-name {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  text-align: center;
  background: rgba(0, 0, 0, 0.15);
  padding: 2px 8px;
  border-radius: 10px;
}

// 中心按钮
.center-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  box-shadow: 
    0 6px 20px rgba(255, 107, 53, 0.5),
    0 0 30px rgba(255, 107, 53, 0.3);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
  
  &:hover:not(.disabled) {
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 
      0 8px 25px rgba(255, 107, 53, 0.6),
      0 0 40px rgba(255, 107, 53, 0.4);
  }
  
  &:active:not(.disabled) {
    transform: translate(-50%, -50%) scale(0.95);
  }
  
  &.spinning {
    animation: buttonPulse 0.8s ease-in-out infinite;
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

@keyframes buttonPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 
      0 6px 20px rgba(255, 107, 53, 0.5),
      0 0 30px rgba(255, 107, 53, 0.3);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.08);
    box-shadow: 
      0 8px 30px rgba(255, 107, 53, 0.7),
      0 0 50px rgba(255, 107, 53, 0.5),
      0 0 80px rgba(255, 215, 0, 0.3);
  }
}

.button-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
}

.button-text {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.4),
    0 0 10px rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
}

// 指针
.pointer {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-top: 35px solid #FF4444;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  z-index: 11;
  animation: pointerBounce 1s ease-in-out infinite;
  
  &::after {
    content: '';
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #FF4444;
    box-shadow: 
      0 0 10px rgba(255, 68, 68, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  }
}

@keyframes pointerBounce {
  0%, 100% { 
    transform: translateX(-50%) translateY(0) scale(1);
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  }
  50% { 
    transform: translateX(-50%) translateY(5px) scale(1.05);
    filter: drop-shadow(0 5px 10px rgba(255, 68, 68, 0.6));
  }
}

// 响应式
@media (max-width: 400px) {
  .wheel-container {
    width: 300px;
    height: 300px;
  }
  
  .wheel-canvas {
    width: 300px;
    height: 300px;
  }
  
  .prize-icon {
    font-size: 28px;
  }
  
  .prize-name {
    font-size: 12px;
  }
  
  .center-button {
    width: 85px;
    height: 85px;
  }
  
  .button-text {
    font-size: 18px;
  }
}
</style>

