<template>
  <div class="lottery-wheel-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">{{ pageTitle }}</span>
      <div class="header-actions">
        <MessageOutlined @click="showFeedback = true" class="action-icon" />
        <QuestionCircleOutlined @click="showRules = true" class="action-icon" />
      </div>
    </div>

    <!-- 顶部信息栏 -->
    <div class="info-bar">
      <div class="info-item">
        <span class="info-label">{{ costLabel }}</span>
        <span class="info-value">{{ costValue }}</span>
      </div>
      <div class="info-divider"></div>
      <div class="info-item">
        <span class="info-label">剩余次数</span>
        <span class="info-value highlight">{{ remainingTimes }}次</span>
      </div>
    </div>

    <!-- 大转盘 -->
    <LotteryWheel
      ref="wheelRef"
      :prizes="prizes"
      :disabled="remainingTimes === 0"
      :button-text="buttonText"
      @spin="handleSpin"
      @complete="handleComplete"
    />

    <!-- 奖品列表 -->
    <div class="prize-list-section">
      <div class="section-title">
        <span>奖品列表</span>
        <span class="total-prizes">共{{ prizes.length }}个奖品</span>
      </div>
      <div class="prize-grid">
        <div 
          v-for="(prize, index) in prizes" 
          :key="index"
          class="prize-card"
        >
          <div class="prize-icon-large">{{ prize.icon || '🎁' }}</div>
          <div class="prize-name">{{ prize.name }}</div>
          <div class="prize-value">{{ prize.value }}</div>
        </div>
      </div>
    </div>

    <!-- 最近中奖 -->
    <div class="winners-section">
      <div class="section-title">
        <span>最近中奖</span>
      </div>
      <div class="winners-scroll">
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
      width="90%"
      :style="{ maxWidth: '350px' }"
    >
      <div class="result-modal">
        <div class="result-icon">
          <div class="confetti">🎉</div>
          <div class="prize-icon-result">{{ currentPrize?.icon || '🎁' }}</div>
        </div>
        <div class="result-title">恭喜中奖!</div>
        <div class="result-prize">{{ currentPrize?.name }}</div>
        <div class="result-value">{{ currentPrize?.value }}</div>
        <div class="result-actions">
          <a-button type="primary" block @click="handleClaim">
            立即领取
          </a-button>
          <div class="action-row">
            <a-button block @click="handleShare" style="flex: 1">
              <ShareAltOutlined /> 分享
            </a-button>
            <a-button block @click="handleContinue" style="flex: 1; margin-left: 12px">
              继续抽奖
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 规则弹窗 -->
    <a-modal
      v-model:open="showRules"
      title="抽奖规则"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <div class="rules-content">
        <div class="rule-item">
          <div class="rule-title">1. 参与方式</div>
          <div class="rule-desc">{{ rulesText.participate }}</div>
        </div>
        <div class="rule-item">
          <div class="rule-title">2. 抽奖次数</div>
          <div class="rule-desc">{{ rulesText.times }}</div>
        </div>
        <div class="rule-item">
          <div class="rule-title">3. 奖品发放</div>
          <div class="rule-desc">{{ rulesText.prize }}</div>
        </div>
        <div class="rule-item">
          <div class="rule-title">4. 注意事项</div>
          <div class="rule-desc">{{ rulesText.notice }}</div>
        </div>
      </div>
    </a-modal>

    <!-- 反馈弹窗 -->
    <FeedbackModal v-model:open="showFeedback" @submit="handleFeedbackSubmit" />

    <!-- 粒子特效 -->
    <ConfettiEffect :show="showConfetti" @complete="showConfetti = false" />

    <!-- 分享弹窗 -->
    <ShareWinModal v-model:open="showShareWin" :prize="currentPrize" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
  ShareAltOutlined
} from '@ant-design/icons-vue'
import LotteryWheel from '@/components/lottery/LotteryWheel.vue'
import FeedbackModal from '@/components/lottery/FeedbackModal.vue'
import ConfettiEffect from '@/components/lottery/ConfettiEffect.vue'
import ShareWinModal from '@/components/lottery/ShareWinModal.vue'

const router = useRouter()
const route = useRoute()

// 抽奖类型
const lotteryType = ref('')
const activityId = ref('')
const cost = ref(0)

// 转盘引用
const wheelRef = ref()

// 弹窗状态
const showResultModal = ref(false)
const showRules = ref(false)
const showFeedback = ref(false)
const showConfetti = ref(false)
const showShareWin = ref(false)

// 当前中奖奖品
const currentPrize = ref<any>(null)

// 剩余次数
const remainingTimes = ref(10)

// 页面标题
const pageTitle = computed(() => {
  const typeMap: Record<string, string> = {
    daily: '日常抽奖',
    premium: '高级抽奖',
    limited: '限时抽奖',
    ticket: '票根抽奖'
  }
  return typeMap[lotteryType.value] || '抽奖'
})

// 消耗标签
const costLabel = computed(() => {
  return lotteryType.value === 'ticket' ? '我的抽奖码' : '我的积分'
})

// 消耗值
const costValue = computed(() => {
  return lotteryType.value === 'ticket' ? '3张' : '15,280'
})

// 按钮文字
const buttonText = computed(() => {
  if (remainingTimes.value === 0) return '已用完'
  return '开始'
})

// 奖品列表
const prizes = ref([
  { id: '1', name: '50元券', icon: '🎫', value: '50元优惠券', probability: 0.2 },
  { id: '2', name: '100积分', icon: '💎', value: '100积分', probability: 0.3 },
  { id: '3', name: '谢谢参与', icon: '😊', value: '--', probability: 0.25 },
  { id: '4', name: '20元券', icon: '🎟️', value: '20元优惠券', probability: 0.15 },
  { id: '5', name: '200积分', icon: '💰', value: '200积分', probability: 0.05 },
  { id: '6', name: '10元券', icon: '🎁', value: '10元优惠券', probability: 0.03 },
  { id: '7', name: '500积分', icon: '🏆', value: '500积分', probability: 0.015 },
  { id: '8', name: 'iPhone', icon: '📱', value: 'iPhone 15 Pro', probability: 0.005 }
])

// 最近中奖记录
const recentWinners = ref([
  { name: '张***', prize: '50元券', time: '刚刚' },
  { name: '李***', prize: '100积分', time: '1分钟前' },
  { name: '王***', prize: '20元券', time: '2分钟前' },
  { name: '刘***', prize: '200积分', time: '3分钟前' },
  { name: '陈***', prize: '10元券', time: '5分钟前' }
])

// 规则文本
const rulesText = computed(() => {
  if (lotteryType.value === 'ticket') {
    return {
      participate: '使用票根抽奖码参与抽奖,每个抽奖码可抽奖一次',
      times: '抽奖次数取决于您拥有的抽奖码数量,上传票根可获得抽奖码',
      prize: '中奖后奖品将自动发放到您的账户,可在"我的奖品"中查看',
      notice: '请确保账户信息真实有效,以便奖品发放。活动最终解释权归平台所有。'
    }
  } else {
    return {
      participate: `消耗${cost.value}积分参与抽奖,点击开始按钮即可抽奖`,
      times: lotteryType.value === 'daily' ? '每日限抽10次,次日重置' : '不限次数,积分充足即可抽奖',
      prize: '中奖后奖品将自动发放到您的账户,优惠券可在"我的优惠券"中查看',
      notice: '积分一经消耗不可退还,请谨慎抽奖。活动最终解释权归平台所有。'
    }
  }
})

// 初始化
onMounted(() => {
  lotteryType.value = route.query.type as string || 'daily'
  activityId.value = route.query.activityId as string || ''
  cost.value = parseInt(route.query.cost as string) || 100

  // 根据类型加载不同的奖品
  loadPrizes()
})

// 加载奖品
const loadPrizes = () => {
  // 这里可以根据不同的抽奖类型加载不同的奖品
  if (lotteryType.value === 'premium') {
    prizes.value = [
      { id: '1', name: '200元券', icon: '🎫', value: '200元优惠券', probability: 0.15 },
      { id: '2', name: '500积分', icon: '💎', value: '500积分', probability: 0.2 },
      { id: '3', name: '谢谢参与', icon: '😊', value: '--', probability: 0.2 },
      { id: '4', name: '100元券', icon: '🎟️', value: '100元优惠券', probability: 0.25 },
      { id: '5', name: '1000积分', icon: '💰', value: '1000积分', probability: 0.1 },
      { id: '6', name: '50元券', icon: '🎁', value: '50元优惠券', probability: 0.08 },
      { id: '7', name: 'AirPods', icon: '🎧', value: 'AirPods Pro', probability: 0.015 },
      { id: '8', name: 'iPhone', icon: '📱', value: 'iPhone 15 Pro', probability: 0.005 }
    ]
  } else if (lotteryType.value === 'limited') {
    prizes.value = [
      { id: '1', name: '100元券', icon: '🎫', value: '100元优惠券', probability: 0.2 },
      { id: '2', name: '300积分', icon: '💎', value: '300积分', probability: 0.25 },
      { id: '3', name: '谢谢参与', icon: '😊', value: '--', probability: 0.2 },
      { id: '4', name: '50元券', icon: '🎟️', value: '50元优惠券', probability: 0.2 },
      { id: '5', name: '500积分', icon: '💰', value: '500积分', probability: 0.1 },
      { id: '6', name: '20元券', icon: '🎁', value: '20元优惠券', probability: 0.03 },
      { id: '7', name: 'AirPods', icon: '🎧', value: 'AirPods Pro', probability: 0.015 },
      { id: '8', name: 'iPad', icon: '📱', value: 'iPad Air', probability: 0.005 }
    ]
  }
}

// 开始抽奖
const handleSpin = () => {
  if (remainingTimes.value === 0) {
    message.warning('抽奖次数已用完')
    return
  }

  // 模拟抽奖结果
  const result = simulateDraw()
  
  // 执行转盘动画
  wheelRef.value.spin(result.index)
}

// 模拟抽奖
const simulateDraw = () => {
  // 根据概率随机抽取
  const random = Math.random()
  let sum = 0
  
  for (let i = 0; i < prizes.value.length; i++) {
    sum += prizes.value[i].probability || 0
    if (random <= sum) {
      return { index: i, prize: prizes.value[i] }
    }
  }
  
  // 默认返回第一个
  return { index: 0, prize: prizes.value[0] }
}

// 抽奖完成
const handleComplete = (prize: any) => {
  currentPrize.value = prize
  
  // 如果中奖(非谢谢参与),显示粒子特效
  if (prize.type !== 'empty' && !prize.name.includes('谢谢')) {
    showConfetti.value = true
  }
  
  // 显示中奖弹稗
  setTimeout(() => {
    showResultModal.value = true
  }, 500)
}

// 领取奖品
const handleClaim = () => {
  message.success('奖品已领取,可在"我的奖品"中查看')
  showResultModal.value = false
}

// 继续抽奖
const handleContinue = () => {
  showResultModal.value = false
  
  if (remainingTimes.value === 0) {
    message.info('抽奖次数已用完')
  }
}

// 处理反馈提交
const handleFeedbackSubmit = (data: any) => {
  console.log('用户反馈:', data)
  // 这里可以调用API上传反馈数据
}

// 处理分享
const handleShare = () => {
  showShareWin.value = true
}
</script>

<style scoped lang="scss">
.lottery-wheel-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5E5 0%, #f5f5f5 100%);
  padding-bottom: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .anticon {
    font-size: 20px;
    cursor: pointer;
  }

  .page-title {
    font-size: 18px;
    font-weight: bold;
  }

  .header-actions {
    display: flex;
    gap: 16px;

    .action-icon {
      font-size: 20px;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.info-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: white;
  margin: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #999;
}

.info-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;

  &.highlight {
    color: #FF6B35;
  }
}

.info-divider {
  width: 1px;
  height: 30px;
  background: #e8e8e8;
}

.prize-list-section {
  padding: 0 16px;
  margin-top: 20px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;

  .total-prizes {
    font-size: 12px;
    color: #999;
    font-weight: normal;
  }
}

.prize-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.prize-card {
  background: white;
  padding: 16px 8px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.prize-icon-large {
  font-size: 32px;
}

.prize-name {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

.prize-value {
  font-size: 10px;
  color: #999;
  text-align: center;
}

.winners-section {
  padding: 0 16px;
  margin-top: 20px;
}

.winners-scroll {
  background: white;
  border-radius: 12px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.winner-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.winner-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.winner-info {
  flex: 1;
}

.winner-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.winner-time {
  font-size: 12px;
  color: #999;
}

.winner-prize {
  font-size: 14px;
  color: #FF6B35;
  font-weight: bold;
}

.result-modal {
  padding: 20px;
  text-align: center;
  animation: modalSlideIn 0.5s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.result-icon {
  position: relative;
  margin-bottom: 20px;
}

.confetti {
  font-size: 80px;
  animation: confettiPop 0.6s ease-out, confettiRotate 1s ease-in-out infinite;
}

@keyframes confettiPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes confettiRotate {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.prize-icon-result {
  font-size: 64px;
  margin-top: 10px;
  animation: prizeShow 0.6s ease-out 0.3s both;
}

@keyframes prizeShow {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.result-title {
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 12px;
}

.result-prize {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.result-value {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.result-actions {
  margin-top: 20px;

  .action-row {
    display: flex;
    gap: 0;
    margin-top: 12px;
  }
}

.rules-content {
  padding: 10px 0;
}

.rule-item {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.rule-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.rule-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>

