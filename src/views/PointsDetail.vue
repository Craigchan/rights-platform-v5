<template>
  <div class="points-detail-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">积分明细</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 积分总览卡片 -->
    <div class="points-summary-card">
      <div class="summary-content">
        <div class="total-points">
          <div class="points-label">当前积分</div>
          <div class="points-value">{{ totalPoints }}</div>
        </div>
        <div class="points-stats">
          <div class="stat-item">
            <div class="stat-value">+{{ monthEarned }}</div>
            <div class="stat-label">本月获得</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">-{{ monthUsed }}</div>
            <div class="stat-label">本月使用</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <div 
          v-for="tab in filterTabs" 
          :key="tab.key"
          class="filter-tab"
          :class="{ active: activeFilter === tab.key }"
          @click="activeFilter = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>

    <!-- 积分记录列表 -->
    <div class="records-container">
      <div v-if="filteredRecords.length > 0" class="records-list">
        <div 
          v-for="record in filteredRecords" 
          :key="record.id"
          class="record-item"
        >
          <div class="record-icon" :class="record.type">
            <component :is="getIcon(record.category)" />
          </div>
          <div class="record-info">
            <div class="record-title">{{ record.title }}</div>
            <div class="record-desc">{{ record.description }}</div>
            <div class="record-time">{{ record.time }}</div>
          </div>
          <div class="record-points" :class="record.type">
            {{ record.type === 'earn' ? '+' : '-' }}{{ record.points }}
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <FileTextOutlined class="empty-icon" />
        <div class="empty-text">暂无积分记录</div>
        <div class="empty-tip">快去参与活动赚取积分吧</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  LeftOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  GiftOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  StarOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 积分统计
const totalPoints = ref(12580)
const monthEarned = ref(3200)
const monthUsed = ref(1500)

// 筛选标签
const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'earn', label: '获得' },
  { key: 'use', label: '使用' }
]

const activeFilter = ref('all')

// 积分记录数据
interface PointsRecord {
  id: number
  type: 'earn' | 'use'
  category: string
  title: string
  description: string
  points: number
  time: string
}

const records = ref<PointsRecord[]>([
  {
    id: 1,
    type: 'earn',
    category: 'signin',
    title: '每日签到',
    description: '连续签到7天',
    points: 50,
    time: '2025-10-15 08:30'
  },
  {
    id: 2,
    type: 'use',
    category: 'exchange',
    title: '积分兑换',
    description: '兑换商品: 小米手环',
    points: 2000,
    time: '2025-10-14 16:20'
  },
  {
    id: 3,
    type: 'earn',
    category: 'order',
    title: '订单完成',
    description: '订单号: 202510140001',
    points: 120,
    time: '2025-10-14 15:45'
  },
  {
    id: 4,
    type: 'earn',
    category: 'activity',
    title: '参与活动',
    description: '参与政府消费券活动',
    points: 200,
    time: '2025-10-13 10:15'
  },
  {
    id: 5,
    type: 'use',
    category: 'lottery',
    title: '积分抽奖',
    description: '参与幸运大转盘',
    points: 100,
    time: '2025-10-13 09:30'
  },
  {
    id: 6,
    type: 'earn',
    category: 'voucher',
    title: '核销优惠券',
    description: '使用满100减20优惠券',
    points: 80,
    time: '2025-10-12 18:20'
  },
  {
    id: 7,
    type: 'earn',
    category: 'signin',
    title: '每日签到',
    description: '连续签到6天',
    points: 30,
    time: '2025-10-12 08:15'
  },
  {
    id: 8,
    type: 'earn',
    category: 'task',
    title: '完成任务',
    description: '浏览10个商品',
    points: 50,
    time: '2025-10-11 20:30'
  },
  {
    id: 9,
    type: 'use',
    category: 'exchange',
    title: '积分兑换',
    description: '兑换商品: 星巴克咖啡券',
    points: 500,
    time: '2025-10-11 14:25'
  },
  {
    id: 10,
    type: 'earn',
    category: 'order',
    title: '订单完成',
    description: '订单号: 202510100002',
    points: 150,
    time: '2025-10-10 16:40'
  },
  {
    id: 11,
    type: 'earn',
    category: 'signin',
    title: '每日签到',
    description: '连续签到5天',
    points: 20,
    time: '2025-10-10 08:20'
  },
  {
    id: 12,
    type: 'earn',
    category: 'activity',
    title: '参与活动',
    description: '参与商圈活动',
    points: 300,
    time: '2025-10-09 11:30'
  }
])

// 筛选后的记录
const filteredRecords = computed(() => {
  if (activeFilter.value === 'all') {
    return records.value
  }
  return records.value.filter(record => record.type === activeFilter.value)
})

// 获取图标
const getIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    signin: CalendarOutlined,
    exchange: ShoppingOutlined,
    order: CheckCircleOutlined,
    activity: TrophyOutlined,
    lottery: StarOutlined,
    voucher: GiftOutlined,
    task: CheckCircleOutlined
  }
  return iconMap[category] || FileTextOutlined
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.points-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.header-placeholder {
  width: 20px;
}

/* 积分总览卡片 */
.points-summary-card {
  margin: 12px 16px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.total-points {
  text-align: center;
}

.points-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.points-value {
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
}

.points-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* 筛选栏 */
.filter-bar {
  background: #fff;
  padding: 12px 16px;
  margin: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-tabs {
  display: flex;
  gap: 12px;
}

.filter-tab {
  flex: 1;
  text-align: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab.active {
  background: #FF6B35;
  color: #fff;
  font-weight: 500;
}

/* 记录列表 */
.records-container {
  padding: 0 16px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.record-item:active {
  transform: scale(0.98);
}

.record-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.record-icon.earn {
  background: #e6f7ff;
  color: #1890ff;
}

.record-icon.use {
  background: #fff1f0;
  color: #ff4d4f;
}

.record-info {
  flex: 1;
  min-width: 0;
}

.record-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.record-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-time {
  font-size: 12px;
  color: #bbb;
}

.record-points {
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

.record-points.earn {
  color: #52c41a;
}

.record-points.use {
  color: #ff4d4f;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
  margin-top: 12px;
}

.empty-icon {
  font-size: 80px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.empty-tip {
  font-size: 14px;
  color: #999;
}

/* 响应式 */
@media (min-width: 768px) {
  .points-detail-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

