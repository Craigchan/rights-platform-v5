<template>
  <div class="ticket-puzzle-page">
    <!-- 顶部导航 -->
    <div class="header">
      <LeftOutlined @click="$router.back()" class="back-icon" />
      <span class="title">票根拼图</span>
      <div class="placeholder"></div>
    </div>

    <!-- 说明卡片 -->
    <div class="intro-card">
      <div class="intro-icon">🧩</div>
      <div class="intro-content">
        <h3>收集票根,赢取奖励!</h3>
        <p>上传不同类型的票根,完成拼图任务,即可获得积分和优惠券奖励</p>
      </div>
    </div>

    <!-- 拼图列表 -->
    <div class="puzzles-container">
      <div 
        v-for="puzzle in userStore.ticketPuzzles" 
        :key="puzzle.id"
        class="puzzle-card"
        :class="{ 
          'locked': puzzle.status === 'locked',
          'completed': puzzle.status === 'completed'
        }"
        @click="viewPuzzleDetail(puzzle)"
      >
        <!-- 状态标签 -->
        <div class="status-badge" v-if="puzzle.status === 'completed'">
          <CheckCircleOutlined /> 已完成
        </div>
        <div class="status-badge locked" v-else-if="puzzle.status === 'locked'">
          <LockOutlined /> 未解锁
        </div>
        <div class="status-badge in-progress" v-else>
          <ClockCircleOutlined /> 进行中
        </div>

        <!-- 拼图信息 -->
        <div class="puzzle-header">
          <div class="puzzle-icon">
            {{ getPuzzleIcon(puzzle.id) }}
          </div>
          <div class="puzzle-info">
            <h3>{{ puzzle.name }}</h3>
            <p>{{ puzzle.description }}</p>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-section">
          <div class="progress-items">
            <div 
              v-for="(p, index) in puzzle.progress" 
              :key="index"
              class="progress-item"
            >
              <div class="progress-label">
                {{ getTicketTypeName(p.type) }}
              </div>
              <div class="progress-bar-wrapper">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${(p.collected / p.required) * 100}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ p.collected }}/{{ p.required }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 奖励信息 -->
        <div class="reward-section">
          <GiftOutlined class="reward-icon" />
          <span class="reward-text">
            {{ getRewardText(puzzle.reward) }}
          </span>
        </div>

        <!-- 完成时间 -->
        <div class="completed-time" v-if="puzzle.completedAt">
          完成于 {{ formatDate(puzzle.completedAt) }}
        </div>
      </div>
    </div>

    <!-- 上传票根按钮 -->
    <div class="upload-button" @click="goToUpload">
      <PlusCircleOutlined />
      上传票根
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import type { TicketPuzzle } from '../stores/user'
import { 
  LeftOutlined, 
  CheckCircleOutlined, 
  LockOutlined, 
  ClockCircleOutlined,
  GiftOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const getPuzzleIcon = (id: number) => {
  const icons = ['🎯', '🍜', '🛍️', '🏆']
  return icons[id - 1] || '🧩'
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

const getRewardText = (reward: TicketPuzzle['reward']) => {
  if (reward.type === 'points') {
    return `${reward.value}积分`
  } else if (reward.type === 'coupon') {
    return `优惠券: ${reward.value}`
  } else {
    return `商品: ${reward.value}`
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const viewPuzzleDetail = (puzzle: TicketPuzzle) => {
  if (puzzle.status === 'locked') {
    return
  }
  router.push(`/ticket-puzzle/${puzzle.id}`)
}

const goToUpload = () => {
  router.push('/ticket-upload')
}
</script>

<style scoped>
.ticket-puzzle-page {
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

.intro-card {
  margin: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.intro-icon {
  font-size: 48px;
}

.intro-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.intro-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.puzzles-container {
  padding: 0 16px;
}

.puzzle-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.puzzle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.puzzle-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.puzzle-card.locked:hover {
  transform: none;
}

.puzzle-card.completed {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #52c41a;
  color: white;
}

.status-badge.locked {
  background: #d9d9d9;
  color: #666;
}

.status-badge.in-progress {
  background: #1890ff;
}

.puzzle-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.puzzle-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
}

.puzzle-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.puzzle-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.progress-section {
  margin: 16px 0;
}

.progress-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-label {
  font-size: 12px;
  color: #666;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 40px;
  text-align: right;
}

.reward-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  border-radius: 8px;
  margin-top: 12px;
}

.reward-icon {
  font-size: 20px;
  color: #d63031;
}

.reward-text {
  font-size: 14px;
  font-weight: 600;
  color: #2d3436;
}

.completed-time {
  margin-top: 12px;
  font-size: 12px;
  color: #999;
  text-align: right;
}

.upload-button {
  position: fixed;
  bottom: 80px;
  right: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.upload-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.upload-button:active {
  transform: translateY(0);
}
</style>

