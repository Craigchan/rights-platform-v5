<template>
  <div class="earn-points-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">玩赚积分</span>
      <QuestionCircleOutlined @click="showRules" class="help-icon" />
    </div>

    <!-- 积分总览 -->
    <div class="points-overview">
      <div class="points-bg">
        <div class="points-amount">{{ userPoints.toLocaleString() }}</div>
        <div class="points-label">我的积分</div>
        <div class="points-actions">
          <a-button size="small" @click="goToPointsDetail">积分明细</a-button>
          <a-button type="primary" size="small" @click="goToPointsMall">去使用</a-button>
        </div>
      </div>
    </div>

    <!-- 每日签到 -->
    <div class="sign-in-section">
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">每日签到</span>
          <span class="section-subtitle">连续签到奖励更多</span>
        </div>
        <div class="sign-calendar">
          <div 
            v-for="(day, index) in signDays" 
            :key="index"
            class="sign-day"
            :class="{ 'signed': day.signed, 'today': day.isToday }"
          >
            <div class="day-label">{{ day.label }}</div>
            <div class="day-points">+{{ day.points }}</div>
            <CheckCircleFilled v-if="day.signed" class="check-icon" />
          </div>
        </div>
        <a-button 
          type="primary" 
          block 
          size="large"
          :disabled="todaySigned"
          @click="handleSignIn"
        >
          {{ todaySigned ? '今日已签到' : '立即签到' }}
        </a-button>
      </div>
    </div>

    <!-- 积分抽奖 -->
    <div class="lottery-section">
      <div class="section-card lottery-card">
        <div class="lottery-header">
          <div>
            <div class="lottery-title">积分抽奖</div>
            <div class="lottery-subtitle">100积分抽大奖，iPhone等你拿！</div>
          </div>
          <a-button type="link" size="small" @click="showLotteryRules">抽奖规则</a-button>
        </div>
        
        <!-- 九宫格 -->
        <div class="lottery-grid">
          <div 
            v-for="(prize, index) in lotteryPrizes" 
            :key="index"
            class="lottery-cell"
            :class="{ 
              'active': currentPrize === index,
              'selected': selectedPrize === index && !isDrawing
            }"
          >
            <div class="prize-name">{{ prize.name }}</div>
            <div class="prize-value">{{ prize.value }}</div>
          </div>
          <div class="lottery-center" @click="startLottery">
            <div v-if="!isDrawing" class="start-text">开始<br/>抽奖</div>
            <LoadingOutlined v-else class="loading-icon" spin />
          </div>
        </div>
        
        <div class="lottery-cost">每次消耗：100积分</div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="tasks-section">
      <!-- 新手任务 -->
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">新手任务</span>
          <span class="task-progress">{{ completedNewbieTasks }}/{{ newbieTasks.length }}</span>
        </div>
        <div class="task-list">
          <div 
            v-for="task in newbieTasks" 
            :key="task.id"
            class="task-item"
          >
            <div class="task-icon" :style="{ background: task.color }">
              <component :is="task.icon" />
            </div>
            <div class="task-info">
              <div class="task-name">{{ task.name }}</div>
              <div class="task-reward">+{{ task.points }}积分</div>
            </div>
            <a-button 
              v-if="!task.completed"
              type="primary" 
              size="small"
              @click="handleTask(task)"
            >
              去完成
            </a-button>
            <CheckCircleFilled v-else class="completed-icon" />
          </div>
        </div>
      </div>

      <!-- 每日任务 -->
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">每日任务</span>
          <span class="task-progress">{{ completedDailyTasks }}/{{ dailyTasks.length }}</span>
        </div>
        <div class="task-list">
          <div 
            v-for="task in dailyTasks" 
            :key="task.id"
            class="task-item"
          >
            <div class="task-icon" :style="{ background: task.color }">
              <component :is="task.icon" />
            </div>
            <div class="task-info">
              <div class="task-name">{{ task.name }}</div>
              <div class="task-desc">{{ task.desc }}</div>
              <div class="task-reward">+{{ task.points}}积分</div>
            </div>
            <div class="task-action">
              <div class="task-progress-text">{{ task.current }}/{{ task.total }}</div>
              <a-button 
                v-if="!task.completed"
                type="primary" 
                size="small"
                @click="handleTask(task)"
              >
                去完成
              </a-button>
              <CheckCircleFilled v-else class="completed-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中奖弹窗 -->
    <a-modal
      v-model:open="prizeModalVisible"
      title="恭喜中奖"
      :footer="null"
      centered
    >
      <div class="prize-modal-content">
        <GiftOutlined class="prize-icon" />
        <div class="prize-name-large">{{ wonPrize?.name }}</div>
        <div class="prize-value-large">{{ wonPrize?.value }}</div>
        <a-button type="primary" block @click="closePrizeModal">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  QuestionCircleOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  GiftOutlined,
  ShoppingOutlined,
  EyeOutlined,
  ShareAltOutlined,
  UserAddOutlined,
  SafetyOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 积分
const userPoints = ref(15280)

// 签到相关
const signDays = ref([
  { label: '周一', points: 10, signed: true, isToday: false },
  { label: '周二', points: 10, signed: true, isToday: false },
  { label: '周三', points: 20, signed: true, isToday: false },
  { label: '周四', points: 10, signed: false, isToday: true },
  { label: '周五', points: 10, signed: false, isToday: false },
  { label: '周六', points: 30, signed: false, isToday: false },
  { label: '周日', points: 50, signed: false, isToday: false }
])

const todaySigned = computed(() => {
  const today = signDays.value.find(d => d.isToday)
  return today?.signed || false
})

// 抽奖相关
const lotteryPrizes = ref([
  { name: '50元券', value: '50元' },
  { name: '100积分', value: '100' },
  { name: '谢谢参与', value: '--' },
  { name: '10元券', value: '10元' },
  { name: '谢谢参与', value: '--' },
  { name: '20元券', value: '20元' },
  { name: '200积分', value: '200' },
  { name: '谢谢参与', value: '--' }
])

const isDrawing = ref(false)
const currentPrize = ref(-1)
const selectedPrize = ref(-1)
const prizeModalVisible = ref(false)
const wonPrize = ref<any>(null)

// 新手任务
const newbieTasks = ref([
  { id: 1, name: '完善个人资料', points: 50, completed: false, color: '#FF6B35', icon: UserAddOutlined },
  { id: 2, name: '完成实名认证', points: 100, completed: false, color: '#F7931E', icon: SafetyOutlined },
  { id: 3, name: '首次兑换商品', points: 200, completed: false, color: '#00A8E8', icon: GiftOutlined }
])

const completedNewbieTasks = computed(() => {
  return newbieTasks.value.filter(t => t.completed).length
})

// 每日任务
const dailyTasks = ref([
  { id: 1, name: '浏览商品', desc: '浏览任意5个商品', points: 10, current: 2, total: 5, completed: false, color: '#FF6B35', icon: EyeOutlined },
  { id: 2, name: '领取优惠券', desc: '领取任意3张优惠券', points: 20, current: 1, total: 3, completed: false, color: '#F7931E', icon: GiftOutlined },
  { id: 3, name: '分享给好友', desc: '分享1次给好友', points: 30, current: 0, total: 1, completed: false, color: '#00A8E8', icon: ShareAltOutlined },
  { id: 4, name: '消费核销', desc: '使用优惠券消费1次', points: 50, current: 0, total: 1, completed: false, color: '#8338EC', icon: ShoppingOutlined }
])

const completedDailyTasks = computed(() => {
  return dailyTasks.value.filter(t => t.completed).length
})

// 方法
const goBack = () => {
  router.back()
}

const showRules = () => {
  message.info('积分规则说明')
}

const goToPointsDetail = () => {
  message.info('跳转到积分明细')
}

const goToPointsMall = () => {
  router.push('/points-mall')
}

const handleSignIn = () => {
  const today = signDays.value.find(d => d.isToday)
  if (today && !today.signed) {
    today.signed = true
    userPoints.value += today.points
    message.success(`签到成功！获得${today.points}积分`)
  }
}

const startLottery = () => {
  if (isDrawing.value) return
  
  if (userPoints.value < 100) {
    message.error('积分不足，无法抽奖')
    return
  }
  
  isDrawing.value = true
  selectedPrize.value = -1
  let count = 0
  const maxCount = 30
  
  const timer = setInterval(() => {
    currentPrize.value = count % 8
    count++
    
    if (count >= maxCount) {
      clearInterval(timer)
      // 随机中奖（这里可以设置概率）
      const finalPrize = Math.floor(Math.random() * 8)
      selectedPrize.value = finalPrize
      currentPrize.value = finalPrize
      isDrawing.value = false
      userPoints.value -= 100
      
      // 显示中奖弹窗
      setTimeout(() => {
        wonPrize.value = lotteryPrizes.value[finalPrize]
        prizeModalVisible.value = true
      }, 500)
    }
  }, 80)
}

const showLotteryRules = () => {
  message.info('抽奖规则说明')
}

const closePrizeModal = () => {
  prizeModalVisible.value = false
  selectedPrize.value = -1
}

const handleTask = (task: any) => {
  message.info(`执行任务：${task.name}`)
  // 这里可以根据不同任务跳转到不同页面
}
</script>

<style scoped>
.earn-points-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 页面头部 */
.page-header {
  background: #fff;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.back-icon, .help-icon {
  font-size: 18px;
  cursor: pointer;
  color: #333;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
}

/* 积分总览 */
.points-overview {
  padding: 15px;
}

.points-bg {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  color: #fff;
}

.points-amount {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
}

.points-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.points-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 通用卡片样式 */
.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

/* 签到日历 */
.sign-in-section {
  padding: 0 15px;
  margin-bottom: 15px;
}

.sign-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.sign-day {
  text-align: center;
  padding: 12px 4px;
  border-radius: 8px;
  background: #f5f5f5;
  position: relative;
}

.sign-day.today {
  background: #fff7e6;
  border: 1px solid #ffa940;
}

.sign-day.signed {
  background: #f6ffed;
  border: 1px solid #52c41a;
}

.day-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.day-points {
  font-size: 14px;
  font-weight: 600;
  color: #FF6B35;
}

.check-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #52c41a;
  font-size: 12px;
}

/* 抽奖区域 */
.lottery-section {
  padding: 0 15px;
  margin-bottom: 15px;
}

.lottery-card {
  background: linear-gradient(135deg, #FFF7E6 0%, #FFE7BA 100%);
}

.lottery-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.lottery-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.lottery-subtitle {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.lottery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
  position: relative;
}

.lottery-cell {
  aspect-ratio: 1;
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.lottery-cell.active {
  border-color: #FF6B35;
  background: #FFF7E6;
  transform: scale(1.05);
}

.lottery-cell.selected {
  border-color: #52c41a;
  background: #f6ffed;
  animation: prize-bounce 0.5s;
}

@keyframes prize-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.prize-name {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.prize-value {
  font-size: 16px;
  font-weight: 600;
  color: #FF6B35;
}

.lottery-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(33.333% - 5.33px);
  aspect-ratio: 1;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  transition: transform 0.2s;
}

.lottery-center:active {
  transform: translate(-50%, -50%) scale(0.95);
}

.start-text {
  text-align: center;
  line-height: 1.4;
}

.loading-icon {
  font-size: 24px;
}

.lottery-cost {
  text-align: center;
  font-size: 12px;
  color: #666;
}

/* 任务列表 */
.tasks-section {
  padding: 0 15px;
}

.task-progress {
  font-size: 14px;
  color: #FF6B35;
  font-weight: 600;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

.task-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}

.task-info {
  flex: 1;
}

.task-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.task-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.task-reward {
  font-size: 12px;
  color: #FF6B35;
  font-weight: 600;
}

.task-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.task-progress-text {
  font-size: 12px;
  color: #999;
}

.completed-icon {
  font-size: 24px;
  color: #52c41a;
}

/* 中奖弹窗 */
.prize-modal-content {
  text-align: center;
  padding: 20px;
}

.prize-icon {
  font-size: 64px;
  color: #FF6B35;
  margin-bottom: 16px;
}

.prize-name-large {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.prize-value-large {
  font-size: 32px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 24px;
}
</style>
