<template>
  <div class="lottery-records-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">中奖记录</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 中奖统计卡片 -->
    <div class="stats-card">
      <div class="stats-content">
        <div class="stat-item">
          <div class="stat-value">{{ totalWins }}</div>
          <div class="stat-label">累计中奖</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ totalValue }}</div>
          <div class="stat-label">总价值(元)</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ winRate }}%</div>
          <div class="stat-label">中奖率</div>
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

    <!-- 中奖记录列表 -->
    <div class="records-container">
      <div v-if="filteredRecords.length > 0" class="records-list">
        <div 
          v-for="record in filteredRecords" 
          :key="record.id"
          class="record-card"
        >
          <div class="record-header">
            <div class="lottery-type" :style="{ background: record.color }">
              <component :is="getIcon(record.type)" />
              <span>{{ record.typeName }}</span>
            </div>
            <div class="record-time">{{ record.time }}</div>
          </div>
          
          <div class="record-content">
            <div class="prize-info">
              <div class="prize-icon" :style="{ background: record.prizeColor }">
                <GiftOutlined />
              </div>
              <div class="prize-details">
                <div class="prize-name">{{ record.prizeName }}</div>
                <div class="prize-desc">{{ record.prizeDesc }}</div>
              </div>
            </div>
            
            <div class="prize-value">
              <span v-if="record.prizeValue" class="value-amount">
                价值 ¥{{ record.prizeValue }}
              </span>
              <span v-else class="value-amount points">
                {{ record.prizePoints }} 积分
              </span>
            </div>
          </div>

          <div class="record-footer">
            <div class="status-badge" :class="record.status">
              {{ getStatusText(record.status) }}
            </div>
            <a-button 
              v-if="record.status === 'pending'" 
              type="primary" 
              size="small"
              @click="claimPrize(record)"
            >
              立即领取
            </a-button>
            <a-button 
              v-else-if="record.status === 'claimed'" 
              size="small"
              @click="viewDetail(record)"
            >
              查看详情
            </a-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <TrophyOutlined class="empty-icon" />
        <div class="empty-text">暂无中奖记录</div>
        <div class="empty-tip">参与抽奖活动,赢取丰厚奖品</div>
        <a-button type="primary" @click="goToLottery">
          去抽奖
        </a-button>
      </div>
    </div>

      <!-- 中奖详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="中奖详情"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <div v-if="selectedRecord" class="detail-modal">
        <!-- 奖品信息 -->
        <div class="detail-section">
          <div class="detail-prize">
            <div class="prize-icon">🎁</div>
            <div class="prize-info">
              <div class="prize-name">{{ selectedRecord.prizeName }}</div>
              <div class="prize-value">价值 ¥{{ selectedRecord.prizeValue }}</div>
            </div>
          </div>
        </div>

        <!-- 中奖信息 -->
        <div class="detail-section">
          <div class="section-title">中奖信息</div>
          <div class="info-item">
            <span class="info-label">活动名称</span>
            <span class="info-value">{{ selectedRecord.typeName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">中奖时间</span>
            <span class="info-value">{{ selectedRecord.time }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">中奖编号</span>
            <span class="info-value">WL{{ String(selectedRecord.id).padStart(8, '0') }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">当前状态</span>
            <span class="info-value" :class="`status-${selectedRecord.status}`">
              {{ getStatusText(selectedRecord.status) }}
            </span>
          </div>
        </div>

        <!-- 奖品说明 -->
        <div class="detail-section">
          <div class="section-title">奖品说明</div>
          <div class="prize-desc">
            {{ getPrizeDescription(selectedRecord.prizeName) }}
          </div>
        </div>

        <!-- 领取信息(如果已领取) -->
        <div v-if="selectedRecord.status === 'claimed'" class="detail-section">
          <div class="section-title">领取信息</div>
          <div class="info-item">
            <span class="info-label">领取时间</span>
            <span class="info-value">{{ selectedRecord.claimTime || '2024-10-10 15:30' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">领取方式</span>
            <span class="info-value">自动发放</span>
          </div>
        </div>

        <!-- 有效期(如果未过期) -->
        <div v-if="selectedRecord.status !== 'expired'" class="detail-section">
          <div class="section-title">有效期</div>
          <div class="expire-info">
            <ClockCircleOutlined />
            <span>有效期至 2025-11-15</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <a-button 
            v-if="selectedRecord.status === 'unclaimed'"
            type="primary" 
            block 
            size="large"
            @click="claimPrizeFromDetail"
          >
            立即领取
          </a-button>
          <a-button 
            v-else
            block 
            size="large"
            @click="detailModalVisible = false"
          >
            关闭
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  TrophyOutlined,
  GiftOutlined,
  StarOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 筛选标签
const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待领取' },
  { key: 'claimed', label: '已领取' },
  { key: 'expired', label: '已过期' }
]

const activeFilter = ref('all')

// 中奖记录数据
interface LotteryRecord {
  id: number
  type: 'wheel' | 'scratch' | 'draw'
  typeName: string
  prizeName: string
  prizeDesc: string
  prizeValue?: number
  prizePoints?: number
  time: string
  status: 'pending' | 'claimed' | 'expired'
  color: string
  prizeColor: string
}

const records = ref<LotteryRecord[]>([
  {
    id: 1,
    type: 'wheel',
    typeName: '幸运大转盘',
    prizeName: '100元现金红包',
    prizeDesc: '可直接提现到微信',
    prizeValue: 100,
    time: '2025-10-15 10:30',
    status: 'pending',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    prizeColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 2,
    type: 'scratch',
    typeName: '刮刮乐',
    prizeName: '500积分',
    prizeDesc: '可用于积分商城兑换',
    prizePoints: 500,
    time: '2025-10-14 16:20',
    status: 'claimed',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    prizeColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 3,
    type: 'draw',
    typeName: '每日抽奖',
    prizeName: '星巴克咖啡券',
    prizeDesc: '中杯拿铁一杯',
    prizeValue: 35,
    time: '2025-10-13 09:15',
    status: 'claimed',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    prizeColor: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  },
  {
    id: 4,
    type: 'wheel',
    typeName: '幸运大转盘',
    prizeName: '200积分',
    prizeDesc: '可用于积分商城兑换',
    prizePoints: 200,
    time: '2025-10-12 14:45',
    status: 'claimed',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    prizeColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 5,
    type: 'scratch',
    typeName: '刮刮乐',
    prizeName: '50元优惠券',
    prizeDesc: '满200可用',
    prizeValue: 50,
    time: '2025-10-11 18:30',
    status: 'expired',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    prizeColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  {
    id: 6,
    type: 'draw',
    typeName: '每日抽奖',
    prizeName: '1000积分',
    prizeDesc: '可用于积分商城兑换',
    prizePoints: 1000,
    time: '2025-10-10 11:20',
    status: 'claimed',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    prizeColor: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'
  },
  {
    id: 7,
    type: 'wheel',
    typeName: '幸运大转盘',
    prizeName: '电影票兑换券',
    prizeDesc: '2张',
    prizeValue: 80,
    time: '2025-10-09 20:15',
    status: 'claimed',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    prizeColor: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)'
  },
  {
    id: 8,
    type: 'scratch',
    typeName: '刮刮乐',
    prizeName: '20元现金红包',
    prizeDesc: '可直接提现到微信',
    prizeValue: 20,
    time: '2025-10-08 15:40',
    status: 'expired',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    prizeColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
])

// 统计数据
const totalWins = computed(() => records.value.length)
const totalValue = computed(() => {
  return records.value.reduce((sum, record) => {
    if (record.prizeValue) {
      return sum + record.prizeValue
    }
    return sum
  }, 0)
})
const winRate = computed(() => 35) // 模拟中奖率

// 筛选后的记录
const filteredRecords = computed(() => {
  if (activeFilter.value === 'all') {
    return records.value
  }
  return records.value.filter(record => record.status === activeFilter.value)
})

// 获取图标
const getIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    wheel: StarOutlined,
    scratch: CrownOutlined,
    draw: ThunderboltOutlined
  }
  return iconMap[type] || TrophyOutlined
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待领取',
    claimed: '已领取',
    expired: '已过期'
  }
  return statusMap[status] || '未知'
}

// 领取奖品
const claimPrize = (record: LotteryRecord) => {
  message.success(`成功领取: ${record.prizeName}`)
  record.status = 'claimed'
}

// 详情弹窗
const detailModalVisible = ref(false)
const selectedRecord = ref<LotteryRecord | null>(null)

// 查看详情
const viewDetail = (record: LotteryRecord) => {
  selectedRecord.value = record
  detailModalVisible.value = true
}

// 从详情弹窗领取奖品
const claimPrizeFromDetail = () => {
  if (selectedRecord.value) {
    claimPrize(selectedRecord.value)
    detailModalVisible.value = false
  }
}

// 获取奖品描述
const getPrizeDescription = (prizeName: string) => {
  const descriptions: Record<string, string> = {
    '小米手环7': '小米手环7,支持血氧检测、心率监测、睡眠监测等功能,续航时间长达14天。',
    '50元优惠券': '平台通用优惠券,可在任意商品购买时使用,无门槛限制,有效期30天。',
    '100积分': '平台积分,可用于积分商城兑换商品或抵扣现金使用。',
    '谢谢参与': '很遗憾本次未中奖,请继续参与抽奖活动,祝您好运!',
    '5元红包': '现金红包,可直接提现到微信或支付宝,也可用于平台消费。',
    '20元优惠券': '平台通用优惠券,满50元可用,有效期30天。',
    '星巴克咖啡券': '星巴克中杯咖啡兑换券,可在全国星巴克门店使用,有效期60天。',
    '200积分': '平台积分,可用于积分商城兑换商品或抵扣现金使用。',
    '1000积分': '平台积分,可用于积分商城兑换商品或抵扣现金使用。',
    '电影票兑换券': '电影票兑换券(共2张),可在全国大部分影院使用,有效期90天。',
    '20元现金红包': '现金红包,可直接提现到微信或支付宝,也可用于平台消费。'
  }
  return descriptions[prizeName] || '暂无描述'
}

// 去抽奖
const goToLottery = () => {
  router.push('/earn-points')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.lottery-records-page {
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
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.stats-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
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
  gap: 8px;
}

.filter-tab {
  flex: 1;
  text-align: center;
  padding: 8px 12px;
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

.record-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.lottery-type {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  color: #fff;
  font-weight: 500;
}

.record-time {
  font-size: 12px;
  color: #bbb;
}

.record-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.prize-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.prize-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
}

.prize-details {
  flex: 1;
  min-width: 0;
}

.prize-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.prize-desc {
  font-size: 13px;
  color: #999;
}

.prize-value {
  flex-shrink: 0;
  margin-left: 12px;
}

.value-amount {
  font-size: 16px;
  font-weight: bold;
  color: #FF6B35;
}

.value-amount.points {
  color: #1890ff;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
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

.status-badge.claimed {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.expired {
  background: #f5f5f5;
  color: #999;
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

/* 详情弹窗样式 */
.detail-modal {
  padding: 8px 0;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-prize {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 12px;
  color: #fff;
}

.prize-icon {
  font-size: 48px;
  margin-right: 16px;
}

.prize-info {
  flex: 1;
}

.prize-name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
}

.prize-value {
  font-size: 24px;
  font-weight: bold;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #FF6B35;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.info-value.status-unclaimed {
  color: #FF6B35;
}

.info-value.status-claimed {
  color: #52c41a;
}

.info-value.status-expired {
  color: #999;
}

.prize-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
}

.expire-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
  color: #fa8c16;
  font-size: 14px;
}

.detail-actions {
  margin-top: 24px;
}

/* 响应式 */
@media (min-width: 768px) {
  .lottery-records-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

