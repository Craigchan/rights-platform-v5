<template>
  <div class="my-tickets-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">我的票根</span>
      <PlusOutlined @click="router.push('/ticket-upload')" />
    </div>

    <!-- 快捷功能入口 -->
    <div class="quick-actions">
      <div class="action-item" @click="router.push('/social-features')">
        <div class="action-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <ShareAltOutlined />
        </div>
        <div class="action-label">票根广场</div>
      </div>
      <div class="action-item" @click="router.push('/stub-analytics')">
        <div class="action-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <BarChartOutlined />
        </div>
        <div class="action-label">数据统计</div>
      </div>
      <div class="action-item" @click="router.push('/map-checkin')">
        <div class="action-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <EnvironmentOutlined />
        </div>
        <div class="action-label">地图打卡</div>
      </div>
      <div class="action-item" @click="router.push('/city-rights')">
        <div class="action-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <GiftOutlined />
        </div>
        <div class="action-label">跨城权益</div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">累计上传</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value" style="color: #52c41a">{{ stats.passed }}</div>
        <div class="stat-label">审核通过</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value" style="color: #fa8c16">{{ stats.pending }}</div>
        <div class="stat-label">审核中</div>
      </div>
    </div>

    <!-- 状态筛选 -->
    <div class="status-tabs">
      <div 
        v-for="tab in statusTabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 票根列表 -->
    <div class="tickets-list">
      <div 
        v-for="ticket in filteredTickets" 
        :key="ticket.id"
        class="ticket-card"
        @click="viewDetail(ticket)"
      >
        <div class="ticket-header">
          <div class="ticket-type">
            <span class="type-icon">{{ getTypeIcon(ticket.type) }}</span>
            <span class="type-label">{{ getTypeLabel(ticket.type) }}</span>
          </div>
          <div class="ticket-status" :class="ticket.status">
            {{ getStatusText(ticket.status) }}
          </div>
        </div>

        <div class="ticket-content">
          <div class="ticket-image">
            <img v-img-fallback :src="ticket.image" alt="票根图片" />
          </div>
          <div class="ticket-info">
            <div class="info-title">{{ ticket.merchantName }}</div>
            <div class="info-row">
              <span class="info-label">消费金额:</span>
              <span class="info-value amount">¥{{ ticket.amount }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">消费时间:</span>
              <span class="info-value">{{ ticket.consumeTime }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">上传时间:</span>
              <span class="info-value">{{ ticket.uploadTime }}</span>
            </div>
          </div>
        </div>

        <!-- 审核信息 -->
        <div v-if="ticket.status === 'passed'" class="audit-info success">
          <CheckCircleOutlined class="audit-icon" />
          <span>审核通过,可用于参与抽奖</span>
        </div>
        <div v-else-if="ticket.status === 'rejected'" class="audit-info error">
          <CloseCircleOutlined class="audit-icon" />
          <span>{{ ticket.rejectReason || '审核未通过' }}</span>
        </div>
        <div v-else class="audit-info warning">
          <ClockCircleOutlined class="audit-icon" />
          <span>审核中,预计24小时内完成</span>
        </div>

        <RightOutlined class="ticket-arrow" />
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTickets.length === 0" class="empty-state">
        <FileImageOutlined class="empty-icon" />
        <div class="empty-text">暂无票根记录</div>
        <div class="empty-tip">上传消费票根,参与抽奖赢大奖!</div>
        <a-button type="primary" @click="router.push('/ticket-upload')">
          立即上传
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
  PlusOutlined,
  RightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
  GiftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 状态标签
const statusTabs = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '审核中' },
  { value: 'passed', label: '已通过' },
  { value: 'rejected', label: '未通过' }
]

// 当前选中的标签
const activeTab = ref('all')

// 统计数据
const stats = ref({
  total: 8,
  passed: 5,
  pending: 2
})

// 票根列表数据
const tickets = ref([
  {
    id: 1,
    type: 'sports',
    merchantName: '大连人 vs 上海海港',
    amount: '180.00',
    consumeTime: '2025-10-15 19:30',
    uploadTime: '2025-10-15 20:45',
    status: 'passed',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Cdefs%3E%3ClinearGradient id="mt1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="120" height="80" fill="url(%23mt1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold" font-family="Arial"%3E体育赛事%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 2,
    type: 'movie',
    merchantName: '流浪地球3 - 万达影城',
    amount: '45.00',
    consumeTime: '2025-10-14 18:00',
    uploadTime: '2025-10-14 21:30',
    status: 'passed',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Cdefs%3E%3ClinearGradient id="mt2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="120" height="80" fill="url(%23mt2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold" font-family="Arial"%3E电影票%3C/text%3E%3C/svg%3E',
    used: true
  },
  {
    id: 3,
    type: 'shopping',
    merchantName: '大商新玛特',
    amount: '328.50',
    consumeTime: '2025-10-13 15:20',
    uploadTime: '2025-10-13 16:00',
    status: 'passed',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Cdefs%3E%3ClinearGradient id="mt3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="120" height="80" fill="url(%23mt3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold" font-family="Arial"%3E购物%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 4,
    type: 'dining',
    merchantName: '海底捞火锅',
    amount: '456.00',
    consumeTime: '2025-10-12 19:00',
    uploadTime: '2025-10-12 21:15',
    status: 'passed',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Cdefs%3E%3ClinearGradient id="mt4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="120" height="80" fill="url(%23mt4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold" font-family="Arial"%3E餐饮%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 5,
    type: 'sports',
    merchantName: '大连体育中心游泳馆',
    amount: '50.00',
    consumeTime: '2025-10-11 10:00',
    uploadTime: '2025-10-11 11:30',
    status: 'passed',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Cdefs%3E%3ClinearGradient id="mt5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231890FF;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="120" height="80" fill="url(%23mt5)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold" font-family="Arial"%3E游泳%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 6,
    type: 'shopping',
    merchantName: '罗斯福购物中心',
    amount: '589.00',
    consumeTime: '2025-10-16 14:30',
    uploadTime: '2025-10-16 15:00',
    status: 'pending',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Cdefs%3E%3ClinearGradient id="mt3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="120" height="80" fill="url(%23mt3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold" font-family="Arial"%3E购物%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 7,
    type: 'dining',
    merchantName: '星巴克咖啡',
    amount: '68.00',
    consumeTime: '2025-10-16 09:00',
    uploadTime: '2025-10-16 09:30',
    status: 'pending',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Cdefs%3E%3ClinearGradient id="mt6" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FA541C;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23D4380D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="120" height="80" fill="url(%23mt6)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold" font-family="Arial"%3E咖啡%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 8,
    type: 'other',
    merchantName: '某不知名商家',
    amount: '100.00',
    consumeTime: '2025-10-10 12:00',
    uploadTime: '2025-10-10 13:00',
    status: 'rejected',
    rejectReason: '票根信息不清晰,请重新上传',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Cdefs%3E%3ClinearGradient id="mt7" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23BFBFBF;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%238C8C8C;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="120" height="80" fill="url(%23mt7)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-weight="bold" font-family="Arial"%3E未识别%3C/text%3E%3C/svg%3E',
    used: false
  }
])

// 过滤后的票根列表
const filteredTickets = computed(() => {
  if (activeTab.value === 'all') {
    return tickets.value
  }
  return tickets.value.filter(ticket => ticket.status === activeTab.value)
})

// 获取类型图标
const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    sports: '⚽',
    movie: '🎬',
    shopping: '🛒',
    dining: '🍽️',
    other: '📝'
  }
  return icons[type] || '📝'
}

// 获取类型标签
const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    sports: '体育赛事',
    movie: '电影票',
    shopping: '商超购物',
    dining: '餐饮消费',
    other: '其他'
  }
  return labels[type] || '其他'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '审核中',
    passed: '已通过',
    rejected: '未通过'
  }
  return texts[status] || '未知'
}

// 查看详情
const viewDetail = (ticket: any) => {
  router.push(`/ticket-detail/${ticket.id}`)
}
</script>

<style scoped lang="scss">
.my-tickets-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  .anticon {
    font-size: 20px;
    cursor: pointer;
  }

  .page-title {
    font-size: 18px;
    font-weight: 500;
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 15px;
  background: white;
  margin-bottom: 0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.action-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  margin: 15px;
  padding: 25px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);

  .stat-item {
    text-align: center;

    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 6px;
    }

    .stat-label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.3);
  }
}

.status-tabs {
  display: flex;
  background: #fff;
  margin: 0 15px 15px;
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    color: #666;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
      color: #fff;
      font-weight: 500;
    }
  }
}

.tickets-list {
  padding: 0 15px;

  .ticket-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s;
    position: relative;

    &:active {
      transform: scale(0.98);
    }

    .ticket-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .ticket-type {
        display: flex;
        align-items: center;
        gap: 6px;

        .type-icon {
          font-size: 20px;
        }

        .type-label {
          font-size: 14px;
          color: #666;
        }
      }

      .ticket-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.pending {
          background: #fff7e6;
          color: #fa8c16;
        }

        &.passed {
          background: #f6ffed;
          color: #52c41a;
        }

        &.rejected {
          background: #fff1f0;
          color: #ff4d4f;
        }
      }
    }

    .ticket-content {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;

      .ticket-image {
        width: 120px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .ticket-info {
        flex: 1;

        .info-title {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 13px;

          &:last-child {
            margin-bottom: 0;
          }

          .info-label {
            color: #999;
            margin-right: 6px;
          }

          .info-value {
            color: #666;

            &.amount {
              color: #ff6b35;
              font-weight: 500;
              font-size: 14px;
            }
          }
        }
      }
    }

    .audit-info {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;

      .audit-icon {
        margin-right: 6px;
        font-size: 16px;
      }

      &.success {
        background: #f6ffed;
        color: #52c41a;
      }

      &.warning {
        background: #fff7e6;
        color: #fa8c16;
      }

      &.error {
        background: #fff1f0;
        color: #ff4d4f;
      }
    }

    .ticket-arrow {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: #d9d9d9;
    }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;

    .empty-icon {
      font-size: 80px;
      color: #d9d9d9;
      margin-bottom: 20px;
    }

    .empty-text {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
    }

    .empty-tip {
      font-size: 14px;
      color: #999;
      margin-bottom: 24px;
    }
  }
}
</style>

