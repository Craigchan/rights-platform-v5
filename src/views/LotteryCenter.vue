<template>
  <div class="lottery-center-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">抽奖中心</span>
      <div class="header-actions">
        <SettingOutlined @click="showSettings = true" class="action-icon" />
        <HistoryOutlined @click="router.push('/lottery-records')" class="action-icon" />
      </div>
    </div>

    <!-- 顶部信息卡 -->
    <div class="info-card">
      <div class="info-item">
        <div class="info-icon" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%)">
          💰
        </div>
        <div class="info-content">
          <div class="info-label">我的积分</div>
          <div class="info-value">{{ userInfo.points }}</div>
        </div>
      </div>
      <div class="info-item">
        <div class="info-icon" style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)">
          🎫
        </div>
        <div class="info-content">
          <div class="info-label">抽奖码</div>
          <div class="info-value">{{ userInfo.lotteryCode }}张</div>
        </div>
      </div>
      <div class="info-item">
        <div class="info-icon" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%)">
          🎯
        </div>
        <div class="info-content">
          <div class="info-label">今日已抽</div>
          <div class="info-value">{{ userInfo.todayDraws }}/{{ userInfo.maxDraws }}次</div>
        </div>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs-container">
      <div 
        v-for="tab in tabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </div>
    </div>

    <!-- 积分抽奖标签内容 -->
    <div v-show="activeTab === 'points'" class="tab-content">
      <div class="lottery-cards">
        <!-- 日常抽奖 -->
        <div class="lottery-card daily">
          <div class="card-header">
            <div class="card-title">
              <span class="title-icon">🎁</span>
              <span>日常抽奖</span>
            </div>
            <div class="card-tag hot">HOT</div>
          </div>
          <div class="card-body">
            <div class="card-desc">每天10次机会,100积分/次</div>
            <div class="card-prizes">
              <div class="prize-tag">50元券</div>
              <div class="prize-tag">100积分</div>
              <div class="prize-tag">实物奖品</div>
            </div>
            <div class="card-info">
              <span>剩余次数: {{ dailyRemaining }}/10</span>
            </div>
          </div>
          <div class="card-footer">
            <a-button 
              type="primary" 
              block
              :disabled="dailyRemaining === 0 || userInfo.points < 100"
              @click="goToLottery('daily', 100)"
            >
              {{ dailyRemaining === 0 ? '今日已用完' : userInfo.points < 100 ? '积分不足' : '立即抽奖' }}
            </a-button>
          </div>
        </div>

        <!-- 高级抽奖 -->
        <div class="lottery-card premium">
          <div class="card-header">
            <div class="card-title">
              <span class="title-icon">💎</span>
              <span>高级抽奖</span>
            </div>
            <div class="card-tag vip">VIP</div>
          </div>
          <div class="card-body">
            <div class="card-desc">奖品更丰厚,500积分/次</div>
            <div class="card-prizes">
              <div class="prize-tag">200元券</div>
              <div class="prize-tag">500积分</div>
              <div class="prize-tag">iPhone</div>
            </div>
            <div class="card-info">
              <span>不限次数</span>
            </div>
          </div>
          <div class="card-footer">
            <a-button 
              type="primary" 
              block
              :disabled="userInfo.points < 500"
              @click="goToLottery('premium', 500)"
            >
              {{ userInfo.points < 500 ? '积分不足' : '立即抽奖' }}
            </a-button>
          </div>
        </div>

        <!-- 限时抽奖 -->
        <div class="lottery-card limited">
          <div class="card-header">
            <div class="card-title">
              <span class="title-icon">⏰</span>
              <span>限时抽奖</span>
            </div>
            <div class="card-tag limited">限时</div>
          </div>
          <div class="card-body">
            <div class="card-desc">限时特惠,200积分/次</div>
            <div class="card-prizes">
              <div class="prize-tag">100元券</div>
              <div class="prize-tag">300积分</div>
              <div class="prize-tag">AirPods</div>
            </div>
            <div class="card-info">
              <span class="countdown">距结束: {{ limitedCountdown }}</span>
            </div>
          </div>
          <div class="card-footer">
            <a-button 
              type="primary" 
              block
              :disabled="userInfo.points < 200"
              @click="goToLottery('limited', 200)"
            >
              {{ userInfo.points < 200 ? '积分不足' : '立即抽奖' }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 票根抽奖标签内容 -->
    <div v-show="activeTab === 'ticket'" class="tab-content">
      <div class="activity-list">
        <div 
          v-for="activity in ticketActivities" 
          :key="activity.id"
          class="activity-card"
          @click="viewActivityDetail(activity)"
        >
          <div class="activity-header">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-status" :class="activity.status">
              {{ getStatusText(activity.status) }}
            </div>
          </div>
          <div class="activity-desc">{{ activity.description }}</div>
          <div class="activity-prizes">
            <div class="prize-preview" v-for="(prize, index) in activity.topPrizes" :key="index">
              {{ prize }}
            </div>
          </div>
          <div class="activity-info">
            <div class="info-row">
              <ClockCircleOutlined />
              <span v-if="activity.status === 'ongoing'">距离开奖: {{ activity.countdown }}</span>
              <span v-else-if="activity.status === 'upcoming'">{{ activity.startTime }} 开始</span>
              <span v-else>已于 {{ activity.endTime }} 结束</span>
            </div>
            <div class="info-row">
              <TeamOutlined />
              <span>{{ activity.participants }}人参与</span>
            </div>
          </div>
          <div class="activity-action">
            <a-button 
              v-if="activity.status === 'ongoing'" 
              type="primary" 
              block
              @click.stop="participateActivity(activity)"
            >
              立即参与
            </a-button>
            <a-button 
              v-else-if="activity.status === 'upcoming'" 
              block
              disabled
            >
              即将开始
            </a-button>
            <a-button 
              v-else 
              block
              @click.stop="viewActivityDetail(activity)"
            >
              查看结果
            </a-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="ticketActivities.length === 0" class="empty-state">
          <GiftOutlined class="empty-icon" />
          <div class="empty-text">暂无票根抽奖活动</div>
          <a-button type="primary" @click="router.push('/ticket-upload')">
            上传票根获取抽奖码
          </a-button>
        </div>
      </div>
    </div>

    <!-- 我的抽奖标签内容 -->
    <div v-show="activeTab === 'mine'" class="tab-content">
      <!-- 统计数据 -->
      <div class="my-stats">
        <div class="stat-card">
          <div class="stat-value">{{ myStats.totalDraws }}</div>
          <div class="stat-label">累计抽奖</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ myStats.totalWins }}</div>
          <div class="stat-label">中奖次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ myStats.winRate }}%</div>
          <div class="stat-label">中奖率</div>
        </div>
      </div>

      <!-- 中奖记录 -->
      <div class="section-title">
        <span>最近中奖</span>
        <a-button type="link" size="small" @click="router.push('/lottery-statistics')">
          查看详细统计 >
        </a-button>
      </div>
      <div class="win-records">
        <div 
          v-for="record in winRecords" 
          :key="record.id"
          class="win-record-item"
        >
          <div class="record-icon">🎁</div>
          <div class="record-content">
            <div class="record-title">{{ record.prizeName }}</div>
            <div class="record-time">{{ record.time }}</div>
          </div>
          <div class="record-action">
            <a-button 
              v-if="record.status === 'pending'" 
              type="primary" 
              size="small"
              @click="claimPrize(record)"
            >
              领取
            </a-button>
            <span v-else class="claimed-tag">已领取</span>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="winRecords.length === 0" class="empty-state">
          <TrophyOutlined class="empty-icon" />
          <div class="empty-text">暂无中奖记录</div>
        </div>
      </div>

      <!-- 我的抽奖码 -->
      <div class="section-title">我的抽奖码</div>
      <div class="lottery-codes">
        <div 
          v-for="code in lotteryCodes" 
          :key="code.id"
          class="code-item"
        >
          <div class="code-info">
            <div class="code-number">{{ code.code }}</div>
            <div class="code-source">来源: {{ code.source }}</div>
          </div>
          <div class="code-status" :class="code.status">
            {{ code.status === 'unused' ? '未使用' : '已使用' }}
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="lotteryCodes.length === 0" class="empty-state">
          <FileTextOutlined class="empty-icon" />
          <div class="empty-text">暂无抽奖码</div>
          <a-button type="primary" @click="router.push('/ticket-upload')">
            上传票根获取
          </a-button>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <a-modal
      v-model:open="showSettings"
      title="抽奖设置"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <SoundSettings />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  GiftOutlined,
  TrophyOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import SoundSettings from '@/components/lottery/SoundSettings.vue'

const router = useRouter()

// 标签页
const tabs = [
  { value: 'points', label: '积分抽奖', badge: '' },
  { value: 'ticket', label: '票根抽奖', badge: '3' },
  { value: 'mine', label: '我的抽奖', badge: '' }
]

const activeTab = ref('points')
const showSettings = ref(false)

// 用户信息
const userInfo = ref({
  points: 15280,
  lotteryCode: 3,
  todayDraws: 5,
  maxDraws: 10
})

// 日常抽奖剩余次数
const dailyRemaining = computed(() => userInfo.value.maxDraws - userInfo.value.todayDraws)

// 限时抽奖倒计时
const limitedCountdown = ref('2小时30分')

// 票根抽奖活动
const ticketActivities = ref([
  {
    id: 1,
    title: '春节大抽奖',
    description: '上传春节消费票根,赢取iPhone 15 Pro',
    status: 'ongoing',
    topPrizes: ['iPhone 15 Pro', '500元券', '100积分'],
    countdown: '3天12小时',
    participants: 1580,
    startTime: '2025-01-20',
    endTime: '2025-02-10'
  },
  {
    id: 2,
    title: '电影票根抽奖',
    description: '上传电影票根,抽取电影周边大奖',
    status: 'ongoing',
    topPrizes: ['电影周边', '200元券', '50积分'],
    countdown: '5天',
    participants: 856,
    startTime: '2025-01-15',
    endTime: '2025-02-15'
  },
  {
    id: 3,
    title: '元旦特别抽奖',
    description: '元旦消费票根专属抽奖活动',
    status: 'ended',
    topPrizes: ['AirPods Pro', '300元券', '100积分'],
    countdown: '',
    participants: 2340,
    startTime: '2025-01-01',
    endTime: '2025-01-10'
  }
])

// 我的统计
const myStats = ref({
  totalDraws: 128,
  totalWins: 45,
  winRate: 35
})

// 中奖记录
const winRecords = ref([
  {
    id: 1,
    prizeName: '50元优惠券',
    time: '2025-10-16 14:30',
    status: 'pending'
  },
  {
    id: 2,
    prizeName: '100积分',
    time: '2025-10-15 10:20',
    status: 'claimed'
  },
  {
    id: 3,
    prizeName: '20元优惠券',
    time: '2025-10-14 16:45',
    status: 'claimed'
  }
])

// 抽奖码
const lotteryCodes = ref([
  {
    id: 1,
    code: 'LT20251016001',
    source: '上传电影票根',
    status: 'unused'
  },
  {
    id: 2,
    code: 'LT20251015002',
    source: '上传餐饮票根',
    status: 'unused'
  },
  {
    id: 3,
    code: 'LT20251014003',
    source: '上传购物票根',
    status: 'used'
  }
])

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    ongoing: '进行中',
    upcoming: '即将开始',
    ended: '已结束'
  }
  return map[status] || '未知'
}

// 前往抽奖
const goToLottery = (type: string, cost: number) => {
  router.push({
    path: '/lottery-wheel',
    query: { type, cost }
  })
}

// 查看活动详情
const viewActivityDetail = (activity: any) => {
  router.push(`/lottery-detail/${activity.id}`)
}

// 参与活动
const participateActivity = (activity: any) => {
  if (userInfo.value.lotteryCode === 0) {
    message.warning('暂无可用抽奖码,请先上传票根')
    return
  }
  router.push({
    path: '/lottery-wheel',
    query: { type: 'ticket', activityId: activity.id }
  })
}

// 领取奖品
const claimPrize = (record: any) => {
  message.success('奖品领取成功!')
  record.status = 'claimed'
}
</script>

<style scoped lang="scss">
.lottery-center-page {
  min-height: 100vh;
  background: #f5f5f5;
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

.info-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  margin-bottom: 12px;
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 12px;
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.info-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.tabs-container {
  display: flex;
  background: white;
  padding: 0 16px;
  margin-bottom: 12px;
}

.tab-item {
  flex: 1;
  padding: 16px 0;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    color: #FF6B35;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 3px;
      background: #FF6B35;
      border-radius: 2px;
    }
  }
}

.tab-label {
  margin-right: 4px;
}

.tab-badge {
  display: inline-block;
  padding: 2px 6px;
  background: #FF4444;
  color: white;
  font-size: 10px;
  border-radius: 10px;
  vertical-align: top;
}

.tab-content {
  padding: 0 16px;
}

.lottery-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lottery-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }

  &.daily::before {
    background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
  }

  &.premium::before {
    background: linear-gradient(90deg, #FF6B35 0%, #F7931E 100%);
  }

  &.limited::before {
    background: linear-gradient(90deg, #667EEA 0%, #764BA2 100%);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.title-icon {
  font-size: 24px;
}

.card-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;

  &.hot {
    background: linear-gradient(135deg, #FF4444 0%, #FF8844 100%);
    color: white;
  }

  &.vip {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #333;
  }

  &.limited {
    background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
    color: white;
  }
}

.card-body {
  margin-bottom: 16px;
}

.card-desc {
  color: #666;
  margin-bottom: 12px;
}

.card-prizes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.prize-tag {
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.card-info {
  font-size: 14px;
  color: #999;

  .countdown {
    color: #FF6B35;
    font-weight: bold;
  }
}

.card-footer {
  margin-top: 16px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.activity-title {
  font-size: 16px;
  font-weight: bold;
}

.activity-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;

  &.ongoing {
    background: #52c41a;
    color: white;
  }

  &.upcoming {
    background: #1890ff;
    color: white;
  }

  &.ended {
    background: #d9d9d9;
    color: #666;
  }
}

.activity-desc {
  color: #666;
  margin-bottom: 12px;
}

.activity-prizes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.prize-preview {
  padding: 4px 12px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 12px;
  font-size: 12px;
  color: #fa8c16;
}

.activity-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #999;

  .anticon {
    font-size: 14px;
  }
}

.activity-action {
  margin-top: 16px;
}

.my-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 12px;
}

.win-records {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.win-record-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.record-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.record-content {
  flex: 1;
}

.record-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.record-time {
  font-size: 12px;
  color: #999;
}

.claimed-tag {
  color: #999;
  font-size: 12px;
}

.lottery-codes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.code-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.code-info {
  flex: 1;
}

.code-number {
  font-weight: bold;
  font-family: monospace;
  margin-bottom: 4px;
}

.code-source {
  font-size: 12px;
  color: #999;
}

.code-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;

  &.unused {
    background: #52c41a;
    color: white;
  }

  &.used {
    background: #d9d9d9;
    color: #666;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}
</style>

