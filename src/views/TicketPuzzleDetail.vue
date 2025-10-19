<template>
  <div class="puzzle-detail-page" v-if="puzzle">
    <!-- 顶部导航 -->
    <div class="header">
      <LeftOutlined @click="$router.back()" class="back-icon" />
      <span class="title">拼图详情</span>
      <div class="placeholder"></div>
    </div>

    <!-- 拼图信息卡片 -->
    <div class="puzzle-info-card">
      <div class="puzzle-icon-large">
        {{ getPuzzleIcon(puzzle.id) }}
      </div>
      <h2>{{ puzzle.name }}</h2>
      <p class="description">{{ puzzle.description }}</p>
      
      <!-- 状态标签 -->
      <div class="status-tag" :class="puzzle.status">
        <CheckCircleOutlined v-if="puzzle.status === 'completed'" />
        <LockOutlined v-else-if="puzzle.status === 'locked'" />
        <ClockCircleOutlined v-else />
        {{ getStatusText(puzzle.status) }}
      </div>
    </div>

    <!-- 收集进度 -->
    <div class="progress-card">
      <h3>收集进度</h3>
      <div class="progress-grid">
        <div 
          v-for="(p, index) in puzzle.progress" 
          :key="index"
          class="progress-box"
          :class="{ completed: p.collected >= p.required }"
        >
          <div class="ticket-icon">
            {{ getTicketIcon(p.type) }}
          </div>
          <div class="ticket-name">{{ getTicketTypeName(p.type) }}</div>
          <div class="ticket-count">
            <span class="current">{{ p.collected }}</span>
            <span class="separator">/</span>
            <span class="total">{{ p.required }}</span>
          </div>
          <div class="check-mark" v-if="p.collected >= p.required">
            <CheckCircleOutlined />
          </div>
        </div>
      </div>
    </div>

    <!-- 奖励信息 -->
    <div class="reward-card">
      <h3>完成奖励</h3>
      <div class="reward-content">
        <GiftOutlined class="gift-icon" />
        <div class="reward-info">
          <div class="reward-type">{{ getRewardTypeText(puzzle.reward.type) }}</div>
          <div class="reward-value">{{ getRewardValueText(puzzle.reward) }}</div>
        </div>
      </div>
    </div>

    <!-- 完成信息 -->
    <div class="completed-card" v-if="puzzle.status === 'completed'">
      <TrophyOutlined class="trophy-icon" />
      <div class="completed-text">
        <h3>恭喜完成!</h3>
        <p>完成时间: {{ formatDateTime(puzzle.completedAt!) }}</p>
        <p>奖励已发放到您的账户</p>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <a-button 
        type="primary" 
        size="large" 
        block
        @click="goToUpload"
        v-if="puzzle.status !== 'completed'"
      >
        <PlusCircleOutlined />
        上传票根
      </a-button>
      <a-button 
        size="large" 
        block
        @click="$router.back()"
        v-else
      >
        返回列表
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import type { TicketPuzzle } from '../stores/user'
import { 
  LeftOutlined, 
  CheckCircleOutlined, 
  LockOutlined, 
  ClockCircleOutlined,
  GiftOutlined,
  PlusCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const puzzleId = ref(Number(route.params.id))
const puzzle = computed(() => 
  userStore.ticketPuzzles.find(p => p.id === puzzleId.value)
)

const getPuzzleIcon = (id: number) => {
  const icons = ['🎯', '🍜', '🛍️', '🏆']
  return icons[id - 1] || '🧩'
}

const getTicketIcon = (type: string) => {
  const icons: Record<string, string> = {
    'sports': '⚽',
    'movie': '🎬',
    'restaurant': '🍽️',
    'shopping': '🛒',
    'other': '🎫'
  }
  return icons[type] || '🎫'
}

const getTicketTypeName = (type: string) => {
  const names: Record<string, string> = {
    'sports': '体育赛事',
    'movie': '电影',
    'restaurant': '餐饮',
    'shopping': '购物',
    'other': '其他'
  }
  return names[type] || type
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'locked': '未解锁',
    'in_progress': '进行中',
    'completed': '已完成'
  }
  return texts[status] || status
}

const getRewardTypeText = (type: string) => {
  const texts: Record<string, string> = {
    'points': '积分奖励',
    'coupon': '优惠券',
    'product': '实物商品'
  }
  return texts[type] || type
}

const getRewardValueText = (reward: TicketPuzzle['reward']) => {
  if (reward.type === 'points') {
    return `${reward.value}积分`
  } else {
    return String(reward.value)
  }
}

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const goToUpload = () => {
  router.push('/ticket-upload')
}

onMounted(() => {
  if (!puzzle.value) {
    router.back()
  }
})
</script>

<style scoped>
.puzzle-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 80px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-icon {
  font-size: 20px;
  cursor: pointer;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.placeholder {
  width: 20px;
}

.puzzle-info-card {
  margin: 16px;
  padding: 32px 20px;
  background: white;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.puzzle-icon-large {
  font-size: 80px;
  margin-bottom: 16px;
}

.puzzle-info-card h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #333;
}

.description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.status-tag.completed {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-tag.in_progress {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.status-tag.locked {
  background: #f5f5f5;
  color: #999;
  border: 1px solid #d9d9d9;
}

.progress-card {
  margin: 0 16px 16px 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.progress-card h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.progress-box {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.progress-box.completed {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  border: 2px solid #52c41a;
}

.ticket-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.ticket-name {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.ticket-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.ticket-count .current {
  color: #667eea;
}

.ticket-count .separator {
  margin: 0 4px;
  color: #999;
}

.ticket-count .total {
  color: #999;
}

.check-mark {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
  color: #52c41a;
}

.reward-card {
  margin: 0 16px 16px 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.reward-card h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.reward-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-radius: 12px;
}

.gift-icon {
  font-size: 48px;
  color: #d63031;
}

.reward-info {
  flex: 1;
}

.reward-type {
  font-size: 14px;
  color: #2d3436;
  margin-bottom: 4px;
}

.reward-value {
  font-size: 24px;
  font-weight: 700;
  color: #2d3436;
}

.completed-card {
  margin: 0 16px 16px 16px;
  padding: 20px;
  background: linear-gradient(135deg, #fff9e6 0%, #ffe58f 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.trophy-icon {
  font-size: 48px;
  color: #faad14;
}

.completed-text h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.completed-text p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.action-buttons {
  margin: 0 16px;
}
</style>

