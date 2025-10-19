<template>
  <div class="subsidy-applications-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-left" @click="router.back()">
        <LeftOutlined />
      </div>
      <div class="nav-title">我的申请</div>
      <div class="nav-right"></div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-value">{{ statistics.total }}</div>
        <div class="stat-label">总申请</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ statistics.pending }}</div>
        <div class="stat-label">待助力</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ statistics.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">¥{{ statistics.totalAmount }}</div>
        <div class="stat-label">累计补贴</div>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-tabs">
      <div 
        class="filter-tab"
        :class="{ active: activeFilter === 'all' }"
        @click="activeFilter = 'all'"
      >
        全部 ({{ myApplications.length }})
      </div>
      <div 
        class="filter-tab"
        :class="{ active: activeFilter === 'pending' }"
        @click="activeFilter = 'pending'"
      >
        待助力 ({{ pendingCount }})
      </div>
      <div 
        class="filter-tab"
        :class="{ active: activeFilter === 'in_progress' }"
        @click="activeFilter = 'in_progress'"
      >
        助力中 ({{ inProgressCount }})
      </div>
      <div 
        class="filter-tab"
        :class="{ active: activeFilter === 'completed' }"
        @click="activeFilter = 'completed'"
      >
        已完成 ({{ completedCount }})
      </div>
    </div>

    <!-- 申请列表 -->
    <div class="applications-list">
      <div 
        class="application-card"
        v-for="app in filteredApplications"
        :key="app.id"
        @click="goToDetail(app.id)"
      >
        <div class="card-header">
          <div class="card-title">{{ app.title }}</div>
          <div class="card-status" :class="app.status">
            {{ getStatusText(app.status) }}
          </div>
        </div>

        <div class="card-body">
          <div class="subsidy-info">
            <div class="subsidy-amount">补贴金额: ¥{{ app.subsidyAmount }}</div>
            <div class="created-time">{{ formatDate(app.createdAt) }}</div>
          </div>

          <div class="progress-info">
            <div class="progress-text">
              助力进度: {{ app.currentHelpers }}/{{ app.requiredHelpers }} 人
            </div>
            <div class="progress-percent">
              {{ Math.round((app.currentHelpers / app.requiredHelpers) * 100) }}%
            </div>
          </div>

          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: (app.currentHelpers / app.requiredHelpers * 100) + '%' }"
            ></div>
          </div>
        </div>

        <div class="card-footer">
          <button 
            v-if="app.status === 'pending' || app.status === 'in_progress'"
            class="action-btn primary"
            @click.stop="shareApplication(app.id)"
          >
            <ShareAltOutlined /> 邀请好友助力
          </button>

          <button 
            v-else-if="app.status === 'completed'"
            class="action-btn success"
            @click.stop="claimSubsidy(app.id)"
          >
            <GiftOutlined /> 领取补贴
          </button>

          <button 
            v-else-if="app.status === 'claimed'"
            class="action-btn disabled"
            disabled
          >
            <CheckCircleOutlined /> 已领取
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredApplications.length === 0">
        <div class="empty-icon">📋</div>
        <div class="empty-text">暂无申请记录</div>
        <button class="apply-btn" @click="router.push('/subsidy-help')">
          去申请补贴
        </button>
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
  ShareAltOutlined,
  GiftOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'
import { useSubsidyStore } from '../stores/subsidy'

const router = useRouter()
const subsidyStore = useSubsidyStore()

// 初始化
subsidyStore.init()

// 筛选状态
const activeFilter = ref<'all' | 'pending' | 'in_progress' | 'completed'>('all')

// 获取申请列表
const myApplications = computed(() => subsidyStore.myApplications)

// 筛选后的申请
const filteredApplications = computed(() => {
  if (activeFilter.value === 'all') return myApplications.value
  return myApplications.value.filter(app => app.status === activeFilter.value)
})

// 统计数据
const statistics = computed(() => subsidyStore.statistics)

// 各状态数量
const pendingCount = computed(() => 
  myApplications.value.filter(app => app.status === 'pending').length
)
const inProgressCount = computed(() => 
  myApplications.value.filter(app => app.status === 'in_progress').length
)
const completedCount = computed(() => 
  myApplications.value.filter(app => app.status === 'completed').length
)

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待助力',
    in_progress: '助力中',
    completed: '已完成',
    claimed: '已领取'
  }
  return statusMap[status] || status
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 分享申请
const shareApplication = (appId: number) => {
  message.success('分享链接已复制到剪贴板')
  // TODO: 实际分享功能
}

// 领取补贴
const claimSubsidy = (appId: number) => {
  const app = myApplications.value.find(a => a.id === appId)
  if (subsidyStore.claimSubsidy(appId)) {
    message.success(`恭喜您获得 ¥${app?.subsidyAmount} 补贴!`)
  } else {
    message.error('领取失败,请稍后重试')
  }
}

// 跳转到详情页
const goToDetail = (appId: number) => {
  router.push(`/subsidy-help/${appId}`)
}
</script>

<style scoped lang="scss">
.subsidy-applications-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  padding-bottom: 20px;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-left, .nav-right {
    width: 60px;
    cursor: pointer;
  }

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 16px 8px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #999;
    }
  }
}

.filter-tabs {
  display: flex;
  padding: 0 16px;
  margin-bottom: 16px;
  gap: 8px;
  overflow-x: auto;

  .filter-tab {
    flex-shrink: 0;
    padding: 8px 16px;
    background: white;
    border-radius: 20px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
    }

    &:not(.active):hover {
      background: #f5f5f5;
    }
  }
}

.applications-list {
  padding: 0 16px;

  .application-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .card-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;

        &.pending {
          background: #fff3e0;
          color: #f57c00;
        }

        &.in_progress {
          background: #e3f2fd;
          color: #1976d2;
        }

        &.completed {
          background: #e8f5e9;
          color: #388e3c;
        }

        &.claimed {
          background: #f3e5f5;
          color: #7b1fa2;
        }
      }
    }

    .card-body {
      .subsidy-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        .subsidy-amount {
          font-size: 16px;
          font-weight: 700;
          color: #ff6b35;
        }

        .created-time {
          font-size: 13px;
          color: #999;
        }
      }

      .progress-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;

        .progress-percent {
          color: #667eea;
          font-weight: 600;
        }
      }

      .progress-bar {
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s;
        }
      }
    }

    .card-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;

      .action-btn {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;

        &.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;

          &:hover {
            opacity: 0.9;
            transform: scale(1.02);
          }
        }

        &.success {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;

          &:hover {
            opacity: 0.9;
            transform: scale(1.02);
          }
        }

        &.disabled {
          background: #f0f0f0;
          color: #999;
          cursor: not-allowed;
        }
      }
    }
  }

  .empty-state {
    padding: 60px 20px;
    text-align: center;

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 16px;
      color: #999;
      margin-bottom: 24px;
    }

    .apply-btn {
      padding: 12px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        opacity: 0.9;
        transform: scale(1.02);
      }
    }
  }
}
</style>

