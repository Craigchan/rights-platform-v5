<template>
  <div class="lottery-draw-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">{{ activityName }}</span>
      <div class="placeholder"></div>
    </div>

    <!-- 抽奖信息 -->
    <div class="lottery-info">
      <div class="info-item">
        <span class="info-label">我的抽奖码</span>
        <span class="info-value">{{ lotteryCode }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">剩余次数</span>
        <span class="info-value highlight">{{ remainingTimes }}次</span>
      </div>
    </div>

    <!-- 大转盘 -->
    <div class="lottery-wheel-container">
      <div class="wheel-wrapper">
        <!-- 转盘背景 -->
        <div class="wheel-bg">
          <div 
            v-for="(prize, index) in prizes" 
            :key="index"
            class="prize-sector"
            :style="getSectorStyle(index)"
          >
            <div class="prize-content" :style="getPrizeContentStyle(index)">
              <div class="prize-icon">🎁</div>
              <div class="prize-name">{{ prize.name }}</div>
            </div>
          </div>
        </div>

        <!-- 转盘指针 -->
        <div 
          class="wheel-pointer"
          :style="{ transform: `rotate(${rotation}deg)` }"
        >
          <div class="pointer-inner"></div>
        </div>

        <!-- 抽奖按钮 -->
        <div 
          class="lottery-button"
          :class="{ disabled: isDrawing || remainingTimes === 0 }"
          @click="startDraw"
        >
          <div class="button-text">
            {{ isDrawing ? '抽奖中' : remainingTimes === 0 ? '已用完' : '开始' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 奖品列表 -->
    <div class="prize-list-section">
      <div class="section-title">奖品列表</div>
      <div class="prize-grid">
        <div 
          v-for="(prize, index) in prizes" 
          :key="index"
          class="prize-card"
        >
          <div class="prize-icon-large">🎁</div>
          <div class="prize-name">{{ prize.name }}</div>
          <div class="prize-value">{{ prize.value }}</div>
          <div class="prize-count">剩余{{ prize.count }}份</div>
        </div>
      </div>
    </div>

    <!-- 中奖记录 -->
    <div class="recent-winners-section">
      <div class="section-title">最近中奖</div>
      <div class="winners-list">
        <div 
          v-for="(winner, index) in recentWinners" 
          :key="index"
          class="winner-item"
        >
          <div class="winner-avatar">{{ winner.name.charAt(0) }}</div>
          <div class="winner-info">
            <div class="winner-name">{{ winner.name }}</div>
            <div class="winner-time">{{ winner.time }}</div>
          </div>
          <div class="winner-prize">{{ winner.prize }}</div>
        </div>
      </div>
    </div>

    <!-- 中奖弹窗 -->
    <a-modal
      v-model:open="showResultModal"
      :footer="null"
      :closable="false"
      centered
      width="80%"
    >
      <div class="result-modal">
        <div class="result-icon">🎉</div>
        <div class="result-title">恭喜中奖!</div>
        <div class="result-prize">{{ wonPrize?.name }}</div>
        <div class="result-value">{{ wonPrize?.value }}</div>
        <div class="result-tips">奖品将在3个工作日内发放</div>
        <a-button type="primary" size="large" block @click="closeResultModal">
          确定
        </a-button>
        <a-button type="link" size="small" block @click="viewMyPrizes">
          查看我的奖品
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { LeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 活动信息
const activityId = ref(route.query.activityId as string || '1')
const activityName = ref(route.query.activityName as string || '体育赛事票根抽奖')
const lotteryCode = ref(route.query.code as string || 'LC' + Date.now())
const ticketId = ref(route.query.ticketId as string || '')

// 抽奖状态
const remainingTimes = ref(1)
const isDrawing = ref(false)
const rotation = ref(0)
const showResultModal = ref(false)
const wonPrize = ref<any>(null)

// 奖品列表
const prizes = ref([
  { id: 1, name: '一等奖', value: 'iPhone 15 Pro', count: 1, probability: 0.01 },
  { id: 2, name: '二等奖', value: '华为手环', count: 10, probability: 0.05 },
  { id: 3, name: '三等奖', value: '50元券', count: 50, probability: 0.15 },
  { id: 4, name: '参与奖', value: '5元券', count: 200, probability: 0.30 },
  { id: 5, name: '谢谢参与', value: '--', count: 999, probability: 0.49 },
  { id: 6, name: '二等奖', value: '小米音箱', count: 10, probability: 0.05 },
  { id: 7, name: '三等奖', value: '30元券', count: 50, probability: 0.15 },
  { id: 8, name: '参与奖', value: '10元券', count: 200, probability: 0.30 }
])

// 最近中奖记录
const recentWinners = ref([
  { name: '张***', time: '刚刚', prize: '三等奖' },
  { name: '李***', time: '1分钟前', prize: '参与奖' },
  { name: '王***', time: '2分钟前', prize: '二等奖' },
  { name: '刘***', time: '3分钟前', prize: '参与奖' },
  { name: '陈***', time: '5分钟前', prize: '三等奖' }
])

// 获取扇形样式
const getSectorStyle = (index: number) => {
  const angle = 360 / prizes.value.length
  const rotation = angle * index
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
  
  return {
    transform: `rotate(${rotation}deg)`,
    background: colors[index % colors.length]
  }
}

// 获取奖品内容样式
const getPrizeContentStyle = (index: number) => {
  const angle = 360 / prizes.value.length
  const rotation = angle / 2
  
  return {
    transform: `rotate(${rotation}deg)`
  }
}

// 开始抽奖
const startDraw = async () => {
  if (isDrawing.value || remainingTimes.value === 0) {
    return
  }

  isDrawing.value = true
  
  // 计算中奖结果
  const result = calculatePrize()
  const targetIndex = prizes.value.findIndex(p => p.id === result.id)
  
  // 计算旋转角度
  const baseRotation = 360 * 5 // 转5圈
  const angle = 360 / prizes.value.length
  const targetAngle = 360 - (targetIndex * angle + angle / 2) // 指针指向扇形中心
  const finalRotation = baseRotation + targetAngle
  
  // 开始旋转
  rotation.value += finalRotation
  
  // 3秒后停止
  setTimeout(() => {
    isDrawing.value = false
    remainingTimes.value--
    wonPrize.value = result
    showResultModal.value = true
    
    // 保存中奖记录
    saveLotteryRecord(result)
    
    // 更新票根使用记录
    updateTicketUsage()
  }, 3000)
}

// 计算中奖结果(根据概率)
const calculatePrize = () => {
  const random = Math.random()
  let cumulative = 0
  
  for (const prize of prizes.value) {
    cumulative += prize.probability
    if (random <= cumulative) {
      return prize
    }
  }
  
  return prizes.value[prizes.value.length - 1] // 兜底返回最后一个
}

// 保存中奖记录
const saveLotteryRecord = (prize: any) => {
  const records = JSON.parse(localStorage.getItem('lotteryRecords') || '[]')
  
  const newRecord = {
    id: Date.now().toString(),
    activityId: activityId.value,
    activityName: activityName.value,
    ticketId: ticketId.value,
    lotteryCode: lotteryCode.value,
    prizeName: prize.name,
    prizeValue: prize.value,
    status: prize.name === '谢谢参与' ? 'none' : 'pending',
    drawTime: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
  
  records.unshift(newRecord)
  localStorage.setItem('lotteryRecords', JSON.stringify(records))
}

// 更新票根使用记录
const updateTicketUsage = () => {
  if (!ticketId.value) return
  
  const tickets = JSON.parse(localStorage.getItem('myTickets') || '[]')
  const ticket = tickets.find((t: any) => t.id === ticketId.value)
  
  if (ticket) {
    if (!ticket.usageRecords) {
      ticket.usageRecords = []
    }
    
    ticket.usageRecords.push({
      activityId: activityId.value,
      activityName: activityName.value,
      useTime: new Date().toISOString(),
      lotteryCode: lotteryCode.value
    })
    
    localStorage.setItem('myTickets', JSON.stringify(tickets))
  }
}

// 关闭结果弹窗
const closeResultModal = () => {
  showResultModal.value = false
  
  if (remainingTimes.value === 0) {
    message.success('抽奖次数已用完')
    setTimeout(() => {
      router.back()
    }, 1000)
  }
}

// 查看我的奖品
const viewMyPrizes = () => {
  showResultModal.value = false
  router.push('/lottery-records')
}

onMounted(() => {
  // 可以根据抽奖码查询剩余次数
  // 这里简化为固定1次
})
</script>

<style scoped lang="scss">
.lottery-draw-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FF6B35 0%, #F7931E 100%);
  padding-bottom: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  color: #fff;

  .anticon {
    font-size: 20px;
    cursor: pointer;
  }

  .page-title {
    font-size: 18px;
    font-weight: 500;
  }

  .placeholder {
    width: 20px;
  }
}

.lottery-info {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  margin: 0 15px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);

  .info-item {
    text-align: center;

    .info-label {
      display: block;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 8px;
    }

    .info-value {
      display: block;
      font-size: 20px;
      font-weight: bold;
      color: #fff;

      &.highlight {
        color: #FFD700;
      }
    }
  }
}

.lottery-wheel-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.wheel-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
}

.wheel-bg {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.prize-sector {
  position: absolute;
  width: 50%;
  height: 50%;
  left: 50%;
  top: 50%;
  transform-origin: 0 0;
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.prize-content {
  position: absolute;
  top: 20%;
  left: 30%;
  transform-origin: 0 0;
  color: #fff;
  text-align: center;
  width: 80px;

  .prize-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .prize-name {
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
  }
}

.wheel-pointer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
  z-index: 10;

  .pointer-inner {
    position: absolute;
    top: -120px;
    left: -15px;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 40px solid #fff;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
}

.lottery-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s;

  &:active:not(.disabled) {
    transform: translate(-50%, -50%) scale(0.95);
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button-text {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.prize-list-section, .recent-winners-section {
  margin: 20px 15px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }
}

.prize-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.prize-card {
  text-align: center;
  padding: 12px 8px;
  background: #f5f5f5;
  border-radius: 8px;

  .prize-icon-large {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .prize-name {
    font-size: 12px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }

  .prize-value {
    font-size: 11px;
    color: #FF6B35;
    margin-bottom: 4px;
  }

  .prize-count {
    font-size: 10px;
    color: #999;
  }
}

.winners-list {
  .winner-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .winner-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 12px;
    }

    .winner-info {
      flex: 1;

      .winner-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }

      .winner-time {
        font-size: 12px;
        color: #999;
      }
    }

    .winner-prize {
      font-size: 14px;
      font-weight: bold;
      color: #FF6B35;
    }
  }
}

.result-modal {
  text-align: center;
  padding: 20px;

  .result-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }

  .result-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
  }

  .result-prize {
    font-size: 20px;
    font-weight: bold;
    color: #FF6B35;
    margin-bottom: 8px;
  }

  .result-value {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
  }

  .result-tips {
    font-size: 14px;
    color: #999;
    margin-bottom: 24px;
  }

  .ant-btn {
    margin-top: 8px;
  }
}
</style>

