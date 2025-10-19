<template>
  <div class="redeem-records-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">兑换记录</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-value">{{ totalRecords }}</div>
        <div class="stat-label">累计兑换</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ totalPoints }}</div>
        <div class="stat-label">消耗积分</div>
      </div>
    </div>

    <!-- 兑换记录列表 -->
    <div class="records-container">
      <div v-if="records.length > 0" class="records-list">
        <div 
          v-for="record in records" 
          :key="record.id"
          class="record-card"
          @click="viewDetail(record)"
        >
          <div class="record-image">
            <div class="image-placeholder" :style="{ background: record.color }">
              <GiftOutlined />
            </div>
          </div>
          <div class="record-info">
            <div class="record-name">{{ record.productName }}</div>
            <div class="record-spec">{{ record.spec }}</div>
            <div class="record-time">
              <ClockCircleOutlined />
              {{ record.time }}
            </div>
            <div class="record-points">
              <TrophyOutlined />
              {{ record.points }} 积分
            </div>
          </div>
          <div class="record-status">
            <div class="status-badge" :class="record.status">
              {{ getStatusText(record.status) }}
            </div>
            <RightOutlined class="arrow-icon" />
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <ShoppingOutlined class="empty-icon" />
        <div class="empty-text">暂无兑换记录</div>
        <div class="empty-tip">快去积分商城兑换心仪商品吧</div>
        <a-button type="primary" @click="goToPointsMall">
          去兑换
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  LeftOutlined,
  ShoppingOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RightOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 兑换记录数据
interface RedeemRecord {
  id: number
  productName: string
  spec: string
  points: number
  time: string
  status: 'pending' | 'shipped' | 'completed' | 'cancelled'
  color: string
}

const records = ref<RedeemRecord[]>([
  {
    id: 1,
    productName: '小米手环8',
    spec: '黑色',
    points: 2000,
    time: '2025-10-14 16:20',
    status: 'shipped',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    productName: '星巴克咖啡券',
    spec: '中杯拿铁',
    points: 500,
    time: '2025-10-11 14:25',
    status: 'completed',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    productName: '京东购物卡',
    spec: '50元',
    points: 5000,
    time: '2025-10-08 10:15',
    status: 'completed',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    productName: '无线蓝牙耳机',
    spec: '白色',
    points: 1500,
    time: '2025-10-05 18:30',
    status: 'completed',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 5,
    productName: '电影票兑换券',
    spec: '2张',
    points: 800,
    time: '2025-10-02 20:45',
    status: 'completed',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 6,
    productName: '运动水杯',
    spec: '500ml',
    points: 300,
    time: '2025-09-28 15:20',
    status: 'completed',
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  }
])

// 统计数据
const totalRecords = computed(() => records.value.length)
const totalPoints = computed(() => 
  records.value.reduce((sum, record) => sum + record.points, 0)
)

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

// 查看详情
const viewDetail = (record: RedeemRecord) => {
  router.push(`/redeem-detail/${record.id}`)
}

// 去积分商城
const goToPointsMall = () => {
  router.push('/points-mall')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.redeem-records-page {
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

/* 统计卡片 */
.stats-card {
  margin: 12px 16px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #f0f0f0;
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

.record-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.record-card:active {
  transform: scale(0.98);
}

.record-image {
  flex-shrink: 0;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
}

.record-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.record-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-spec {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.record-time {
  font-size: 12px;
  color: #bbb;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.record-points {
  font-size: 14px;
  color: #FF6B35;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.record-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.shipped {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.cancelled {
  background: #fff1f0;
  color: #ff4d4f;
}

.arrow-icon {
  font-size: 14px;
  color: #bbb;
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
  margin-bottom: 20px;
}

/* 响应式 */
@media (min-width: 768px) {
  .redeem-records-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

