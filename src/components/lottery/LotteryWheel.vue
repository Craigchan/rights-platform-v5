<template>
  <div class="lottery-wheel-component">
    <!-- 转盘容器 -->
    <div class="wheel-container">
      <!-- 外圈装饰 -->
      <div class="wheel-outer-ring"></div>
      
      <!-- 转盘主体 -->
      <div 
        class="wheel-main" 
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <!-- 奖品扇区 -->
        <div 
          v-for="(prize, index) in prizes" 
          :key="index"
          class="prize-sector"
          :style="getSectorStyle(index)"
        >
          <div class="prize-content" :style="getPrizeContentStyle(index)">
            <div class="prize-icon">{{ prize.icon || '🎁' }}</div>
            <div class="prize-name">{{ prize.name }}</div>
          </div>
        </div>
      </div>
      
      <!-- 中心按钮 -->
      <div 
        class="center-button"
        :class="{ disabled: isSpinning || disabled }"
        @click="handleSpin"
      >
        <div class="button-inner">
          <div class="button-text">{{ buttonText }}</div>
        </div>
      </div>
      
      <!-- 指针 -->
      <div class="pointer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
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

// 计算扇区角度
const sectorAngle = computed(() => 360 / props.prizes.length)

// 获取扇区样式
const getSectorStyle = (index: number) => {
  const angle = sectorAngle.value
  const rotate = angle * index
  
  // 交替颜色
  const colors = [
    'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)'
  ]
  
  return {
    transform: `rotate(${rotate}deg)`,
    background: colors[index % 2],
    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%)`
  }
}

// 获取奖品内容样式
const getPrizeContentStyle = (index: number) => {
  const angle = sectorAngle.value
  const rotate = angle * index + angle / 2
  
  return {
    transform: `rotate(${rotate}deg) translateY(-120px)`
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
    const baseRotation = 360 * 5 // 基础旋转5圈
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
    }, 4000) // 4秒动画时间
  })
}

// 重置转盘
const reset = () => {
  rotation.value = 0
  isSpinning.value = false
}

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
  padding: 20px;
}

.wheel-container {
  position: relative;
  width: 320px;
  height: 320px;
}

// 外圈装饰
.wheel-outer-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.6),
    0 0 40px rgba(255, 165, 0, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.2);
  animation: ringRotate 10s linear infinite, ringPulse 2s ease-in-out infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ringPulse {
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 40px rgba(255, 165, 0, 0.4),
      inset 0 0 20px rgba(255, 255, 255, 0.2);
  }
  50% { 
    box-shadow: 
      0 0 30px rgba(255, 215, 0, 0.8),
      0 0 60px rgba(255, 165, 0, 0.6),
      inset 0 0 30px rgba(255, 255, 255, 0.3);
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
  transition: transform 4s cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

// 奖品扇区
.prize-sector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center center;
}

.prize-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.prize-icon {
  font-size: 28px;
}

.prize-name {
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  text-align: center;
}

// 中心按钮
.center-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
  
  &:active:not(.disabled) {
    transform: translate(-50%, -50%) scale(0.95);
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.button-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
}

.button-text {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

// 指针
.pointer {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #FF4444;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  z-index: 11;
  
  &::after {
    content: '';
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #FF4444;
  }
}
</style>

