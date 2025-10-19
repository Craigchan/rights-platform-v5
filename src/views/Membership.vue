<template>
  <div class="membership-page">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="nav-title">我的会员</span>
      <div class="placeholder"></div>
    </div>

    <!-- 会员卡片 -->
    <div class="member-card">
      <div class="card-bg"></div>
      <div class="card-content">
        <div class="member-header">
          <div class="avatar-section">
            <div class="avatar"></div>
            <div class="member-info">
              <div class="nickname">张三</div>
              <div class="member-no">会员编号: 10086</div>
            </div>
          </div>
          <div class="level-badge" :class="currentLevel.key">
            <CrownOutlined />
            <span>{{ currentLevel.name }}</span>
          </div>
        </div>
        
        <!-- 成长值进度 -->
        <div class="growth-progress">
          <div class="progress-header">
            <span class="current-growth">当前成长值: {{ currentGrowth }}</span>
            <span class="next-level">距离{{ nextLevel.name }}还需{{ needGrowth }}成长值</span>
          </div>
          <a-progress 
            :percent="growthPercent" 
            :show-info="false"
            stroke-color="#FFD700"
            trail-color="rgba(255, 255, 255, 0.3)"
          />
        </div>

        <!-- 会员有效期 -->
        <div class="member-validity">
          <CalendarOutlined />
          <span>有效期至: 2025-12-31</span>
        </div>
      </div>
    </div>

    <!-- 会员数据 -->
    <div class="member-stats">
      <div class="stat-item">
        <div class="stat-value">{{ currentGrowth }}</div>
        <div class="stat-label">成长值</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ memberBenefits.discountRate }}折</div>
        <div class="stat-label">专属折扣</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ memberBenefits.pointsMultiple }}倍</div>
        <div class="stat-label">积分倍率</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ completedTasks }}/{{ totalTasks }}</div>
        <div class="stat-label">完成任务</div>
      </div>
    </div>

    <!-- 会员等级说明 -->
    <div class="section-card">
      <div class="section-header">
        <TrophyOutlined class="section-icon" />
        <span class="section-title">会员等级</span>
      </div>
      <div class="level-list">
        <div 
          v-for="level in memberLevels" 
          :key="level.key"
          class="level-item"
          :class="{ active: level.key === currentLevel.key }"
        >
          <div class="level-badge-small" :class="level.key">
            <CrownOutlined />
          </div>
          <div class="level-info">
            <div class="level-name">{{ level.name }}</div>
            <div class="level-requirement">成长值≥{{ level.minGrowth }}</div>
          </div>
          <div class="level-benefits">
            <div class="benefit-tag">{{ level.discount }}折</div>
            <div class="benefit-tag">{{ level.pointsMultiple }}倍积分</div>
          </div>
          <CheckCircleFilled v-if="level.key === currentLevel.key" class="check-icon" />
        </div>
      </div>
    </div>

    <!-- 会员权益 -->
    <div class="section-card">
      <div class="section-header">
        <GiftOutlined class="section-icon" />
        <span class="section-title">会员权益</span>
      </div>
      <div class="benefits-grid">
        <div 
          v-for="benefit in benefits" 
          :key="benefit.id"
          class="benefit-item"
          :class="{ locked: !benefit.unlocked }"
        >
          <component :is="benefit.icon" class="benefit-icon" />
          <div class="benefit-name">{{ benefit.name }}</div>
          <div class="benefit-desc">{{ benefit.desc }}</div>
          <div v-if="!benefit.unlocked" class="lock-mask">
            <LockOutlined />
            <span>{{ benefit.unlockLevel }}解锁</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 升级任务 -->
    <div class="section-card">
      <div class="section-header">
        <RocketOutlined class="section-icon" />
        <span class="section-title">升级任务</span>
        <span class="task-progress">{{ completedTasks }}/{{ totalTasks }}</span>
      </div>
      <div class="task-list">
        <div 
          v-for="task in tasks" 
          :key="task.id"
          class="task-item"
        >
          <div class="task-icon" :class="{ completed: task.completed }">
            <component :is="task.icon" />
          </div>
          <div class="task-info">
            <div class="task-name">{{ task.name }}</div>
            <div class="task-reward">+{{ task.reward }}成长值</div>
          </div>
          <div class="task-progress-bar">
            <a-progress 
              :percent="(task.current / task.target) * 100" 
              :show-info="false"
              size="small"
              stroke-color="#FF6B35"
            />
            <span class="progress-text">{{ task.current }}/{{ task.target }}</span>
          </div>
          <a-button 
            v-if="!task.completed && task.current >= task.target"
            type="primary" 
            size="small"
            @click="claimTaskReward(task.id)"
          >
            领取
          </a-button>
          <a-button 
            v-else-if="!task.completed"
            size="small"
            @click="goToTask(task.id)"
          >
            去完成
          </a-button>
          <CheckCircleFilled v-else class="completed-icon" />
        </div>
      </div>
    </div>

    <!-- 专属优惠 -->
    <div class="section-card">
      <div class="section-header">
        <TagOutlined class="section-icon" />
        <span class="section-title">专属优惠</span>
        <span class="more-link" @click="goToCoupons">查看更多 <RightOutlined /></span>
      </div>
      <div class="coupon-list">
        <div 
          v-for="coupon in exclusiveCoupons" 
          :key="coupon.id"
          class="coupon-item"
          @click="receiveCoupon(coupon.id)"
        >
          <div class="coupon-left">
            <div class="coupon-amount">
              <span class="symbol">¥</span>
              <span class="value">{{ coupon.amount }}</span>
            </div>
            <div class="coupon-condition">满{{ coupon.minAmount }}可用</div>
          </div>
          <div class="coupon-right">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-time">{{ coupon.validTime }}</div>
            <div class="coupon-tag">{{ currentLevel.name }}专享</div>
          </div>
          <div class="coupon-btn">
            <a-button type="primary" size="small">立即领取</a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 会员特权说明 -->
    <div class="section-card">
      <div class="section-header">
        <StarOutlined class="section-icon" />
        <span class="section-title">会员特权</span>
      </div>
      <div class="privilege-list">
        <div 
          v-for="privilege in privileges" 
          :key="privilege.id"
          class="privilege-item"
        >
          <component :is="privilege.icon" class="privilege-icon" />
          <div class="privilege-content">
            <div class="privilege-name">{{ privilege.name }}</div>
            <div class="privilege-desc">{{ privilege.desc }}</div>
          </div>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  CrownOutlined,
  CalendarOutlined,
  TrophyOutlined,
  GiftOutlined,
  RocketOutlined,
  TagOutlined,
  StarOutlined,
  CheckCircleFilled,
  RightOutlined,
  LockOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  ShareAltOutlined,
  CheckOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  SafetyOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 会员等级定义
const memberLevels = ref([
  { 
    key: 'normal', 
    name: '普通会员', 
    minGrowth: 0, 
    discount: 9.9, 
    pointsMultiple: 1,
    color: '#95a5a6'
  },
  { 
    key: 'silver', 
    name: '白银会员', 
    minGrowth: 1000, 
    discount: 9.5, 
    pointsMultiple: 1.2,
    color: '#c0c0c0'
  },
  { 
    key: 'gold', 
    name: '黄金会员', 
    minGrowth: 3000, 
    discount: 9.0, 
    pointsMultiple: 1.5,
    color: '#FFD700'
  },
  { 
    key: 'platinum', 
    name: '铂金会员', 
    minGrowth: 8000, 
    discount: 8.5, 
    pointsMultiple: 2.0,
    color: '#E5E4E2'
  },
  { 
    key: 'diamond', 
    name: '钻石会员', 
    minGrowth: 20000, 
    discount: 8.0, 
    pointsMultiple: 3.0,
    color: '#B9F2FF'
  }
])

// 当前成长值
const currentGrowth = ref(3580)

// 计算当前等级
const currentLevel = computed(() => {
  const levels = [...memberLevels.value].reverse()
  return levels.find(level => currentGrowth.value >= level.minGrowth) || memberLevels.value[0]
})

// 计算下一等级
const nextLevel = computed(() => {
  const currentIndex = memberLevels.value.findIndex(l => l.key === currentLevel.value.key)
  return memberLevels.value[currentIndex + 1] || currentLevel.value
})

// 计算还需成长值
const needGrowth = computed(() => {
  return Math.max(0, nextLevel.value.minGrowth - currentGrowth.value)
})

// 计算成长值百分比
const growthPercent = computed(() => {
  if (currentLevel.value.key === 'diamond') return 100
  const current = currentGrowth.value - currentLevel.value.minGrowth
  const total = nextLevel.value.minGrowth - currentLevel.value.minGrowth
  return Math.min(100, Math.round((current / total) * 100))
})

// 会员权益
const memberBenefits = computed(() => ({
  discountRate: currentLevel.value.discount,
  pointsMultiple: currentLevel.value.pointsMultiple
}))

// 会员权益列表
const benefits = ref([
  {
    id: 1,
    name: '专属折扣',
    desc: '享受会员专属折扣',
    icon: TagOutlined,
    unlocked: true,
    unlockLevel: ''
  },
  {
    id: 2,
    name: '积分加速',
    desc: '购物积分倍率提升',
    icon: ThunderboltOutlined,
    unlocked: true,
    unlockLevel: ''
  },
  {
    id: 3,
    name: '免费配送',
    desc: '订单免运费特权',
    icon: CarOutlined,
    unlocked: currentLevel.value.minGrowth >= 1000,
    unlockLevel: '白银会员'
  },
  {
    id: 4,
    name: '优先客服',
    desc: '专属客服通道',
    icon: CustomerServiceOutlined,
    unlocked: currentLevel.value.minGrowth >= 3000,
    unlockLevel: '黄金会员'
  },
  {
    id: 5,
    name: '生日礼包',
    desc: '生日当月专属礼包',
    icon: GiftOutlined,
    unlocked: currentLevel.value.minGrowth >= 3000,
    unlockLevel: '黄金会员'
  },
  {
    id: 6,
    name: '优先购买',
    desc: '新品优先购买权',
    icon: ShoppingOutlined,
    unlocked: currentLevel.value.minGrowth >= 8000,
    unlockLevel: '铂金会员'
  },
  {
    id: 7,
    name: '专属客服',
    desc: '一对一VIP客服',
    icon: HeartOutlined,
    unlocked: currentLevel.value.minGrowth >= 20000,
    unlockLevel: '钻石会员'
  },
  {
    id: 8,
    name: '延保服务',
    desc: '商品延长保修',
    icon: SafetyOutlined,
    unlocked: currentLevel.value.minGrowth >= 20000,
    unlockLevel: '钻石会员'
  }
])

// 升级任务
const tasks = ref([
  {
    id: 1,
    name: '每日签到',
    reward: 10,
    current: 7,
    target: 7,
    completed: false,
    icon: CheckOutlined
  },
  {
    id: 2,
    name: '完成订单',
    reward: 50,
    current: 3,
    target: 5,
    completed: false,
    icon: ShoppingOutlined
  },
  {
    id: 3,
    name: '邀请好友',
    reward: 100,
    current: 1,
    target: 3,
    completed: false,
    icon: UserAddOutlined
  },
  {
    id: 4,
    name: '分享活动',
    reward: 20,
    current: 5,
    target: 10,
    completed: false,
    icon: ShareAltOutlined
  },
  {
    id: 5,
    name: '完善资料',
    reward: 30,
    current: 1,
    target: 1,
    completed: true,
    icon: CheckCircleFilled
  }
])

// 计算任务统计
const totalTasks = computed(() => tasks.value.length)
const completedTasks = computed(() => tasks.value.filter(t => t.completed).length)

// 专属优惠券
const exclusiveCoupons = ref([
  {
    id: 1,
    name: '会员专享券',
    amount: 50,
    minAmount: 299,
    validTime: '2024.10.14 - 2024.11.14'
  },
  {
    id: 2,
    name: '生日礼券',
    amount: 100,
    minAmount: 599,
    validTime: '2024.10.14 - 2024.11.14'
  },
  {
    id: 3,
    name: '升级奖励券',
    amount: 30,
    minAmount: 199,
    validTime: '2024.10.14 - 2024.11.14'
  }
])

// 会员特权
const privileges = ref([
  {
    id: 1,
    name: '会员日专享',
    desc: '每月会员日享受额外优惠',
    icon: StarOutlined
  },
  {
    id: 2,
    name: '积分兑换',
    desc: '积分兑换商品更优惠',
    icon: GiftOutlined
  },
  {
    id: 3,
    name: '专属活动',
    desc: '参与会员专属活动',
    icon: TrophyOutlined
  },
  {
    id: 4,
    name: '售后无忧',
    desc: '享受更长售后保障期',
    icon: SafetyOutlined
  }
])

// 方法
const goBack = () => {
  router.back()
}

const claimTaskReward = (taskId: number) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task && task.current >= task.target) {
    task.completed = true
    currentGrowth.value += task.reward
    message.success(`领取成功!获得${task.reward}成长值`)
  }
}

const goToTask = (taskId: number) => {
  message.info('跳转到任务页面')
}

const goToCoupons = () => {
  router.push('/vouchers')
}

const receiveCoupon = (couponId: number) => {
  message.success('优惠券领取成功!')
}
</script>

<style scoped>
.membership-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
}

.back-icon {
  font-size: 20px;
  cursor: pointer;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
}

.placeholder {
  width: 20px;
}

/* 会员卡片 */
.member-card {
  position: relative;
  margin: 15px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.9;
}

.card-content {
  position: relative;
  padding: 20px;
  color: white;
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.avatar-section {
  display: flex;
  gap: 12px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.member-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nickname {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.member-no {
  font-size: 13px;
  opacity: 0.9;
}

.level-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-size: 14px;
  font-weight: 600;
}

.level-badge.gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #333;
}

/* 成长值进度 */
.growth-progress {
  margin-bottom: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.member-validity {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  opacity: 0.9;
}

/* 会员数据 */
.member-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 0 15px 15px;
}

.stat-item {
  background: white;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #FF6B35;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* 区块卡片 */
.section-card {
  background: white;
  margin: 0 15px 15px;
  padding: 15px;
  border-radius: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.section-icon {
  font-size: 18px;
  color: #FF6B35;
  margin-right: 8px;
}

.section-title {
  flex: 1;
}

.task-progress,
.more-link {
  font-size: 13px;
  color: #999;
  cursor: pointer;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 等级列表 */
.level-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9f9f9;
  position: relative;
}

.level-item.active {
  background: linear-gradient(135deg, #fff5f0, #ffe8dd);
  border: 1px solid #FF6B35;
}

.level-badge-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

.level-badge-small.normal {
  background: #95a5a6;
}

.level-badge-small.silver {
  background: linear-gradient(135deg, #c0c0c0, #a8a8a8);
}

.level-badge-small.gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.level-badge-small.platinum {
  background: linear-gradient(135deg, #E5E4E2, #C0C0C0);
}

.level-badge-small.diamond {
  background: linear-gradient(135deg, #B9F2FF, #87CEEB);
}

.level-info {
  flex: 1;
}

.level-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 3px;
}

.level-requirement {
  font-size: 12px;
  color: #999;
}

.level-benefits {
  display: flex;
  gap: 5px;
}

.benefit-tag {
  padding: 3px 8px;
  border-radius: 4px;
  background: #f0f0f0;
  font-size: 11px;
  color: #666;
}

.check-icon {
  font-size: 20px;
  color: #52c41a;
}

/* 权益网格 */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.benefit-item {
  position: relative;
  text-align: center;
  padding: 15px 10px;
  border-radius: 8px;
  background: #f9f9f9;
}

.benefit-item.locked {
  opacity: 0.5;
}

.benefit-icon {
  font-size: 28px;
  color: #FF6B35;
  margin-bottom: 8px;
}

.benefit-name {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
}

.benefit-desc {
  font-size: 11px;
  color: #999;
}

.lock-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  font-size: 11px;
  color: #999;
}

.lock-mask .anticon {
  font-size: 20px;
  margin-bottom: 5px;
}

/* 任务列表 */
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
  border-radius: 8px;
  background: #f9f9f9;
}

.task-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  color: white;
  font-size: 18px;
}

.task-icon.completed {
  background: #52c41a;
}

.task-info {
  flex: 1;
}

.task-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 3px;
}

.task-reward {
  font-size: 12px;
  color: #FF6B35;
}

.task-progress-bar {
  width: 120px;
  position: relative;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 11px;
  color: #999;
}

.completed-icon {
  font-size: 24px;
  color: #52c41a;
}

/* 优惠券列表 */
.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fff5f0, #ffe8dd);
  border: 1px dashed #FF6B35;
  cursor: pointer;
  position: relative;
}

.coupon-left {
  width: 80px;
  text-align: center;
  border-right: 1px dashed #FF6B35;
  padding-right: 15px;
}

.coupon-amount {
  color: #FF6B35;
  margin-bottom: 5px;
}

.symbol {
  font-size: 16px;
}

.value {
  font-size: 28px;
  font-weight: 600;
}

.coupon-condition {
  font-size: 11px;
  color: #999;
}

.coupon-right {
  flex: 1;
  padding-left: 15px;
}

.coupon-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 5px;
}

.coupon-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.coupon-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: #FF6B35;
  color: white;
  font-size: 11px;
}

.coupon-btn {
  margin-left: 10px;
}

/* 特权列表 */
.privilege-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.privilege-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
}

.privilege-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35, #F7931E);
  color: white;
  font-size: 18px;
}

.privilege-content {
  flex: 1;
}

.privilege-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 3px;
}

.privilege-desc {
  font-size: 12px;
  color: #999;
}

.arrow-icon {
  font-size: 14px;
  color: #999;
}
</style>

