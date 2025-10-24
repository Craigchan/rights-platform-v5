<template>
  <div class="subsidy-help-detail" v-if="application">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-left" @click="router.back()">
        <LeftOutlined />
      </div>
      <div class="nav-title">助力详情</div>
      <div class="nav-right"></div>
    </div>

    <!-- 顶部卡片 -->
    <div class="top-card">
      <div class="card-icon">🎁</div>
      <div class="card-title">{{ application.title }}</div>
      <div class="card-desc">{{ application.description }}</div>
      <div class="subsidy-amount">补贴金额: ¥{{ application.subsidyAmount }}</div>
    </div>

    <!-- 助力进度 -->
    <div class="progress-section">
      <div class="progress-header">
        <div class="progress-title">助力进度</div>
        <div class="progress-count">
          <span class="current">{{ application.currentHelpers }}</span>
          <span class="separator">/</span>
          <span class="total">{{ application.requiredHelpers }}</span>
        </div>
      </div>

      <div class="progress-circle">
        <svg viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f0f0f0"
            stroke-width="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            stroke-width="8"
            :stroke-dasharray="`${progressPercent * 2.827} 282.7`"
            stroke-linecap="round"
            transform="rotate(-90 50 50)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#667eea" />
              <stop offset="100%" stop-color="#764ba2" />
            </linearGradient>
          </defs>
        </svg>
        <div class="progress-text">
          <div class="percent">{{ progressPercent }}%</div>
          <div class="label">已完成</div>
        </div>
      </div>

      <div class="progress-status">
        <div v-if="application.status === 'pending'" class="status-text pending">
          <ClockCircleOutlined /> 等待助力中
        </div>
        <div v-else-if="application.status === 'in_progress'" class="status-text in-progress">
          <LoadingOutlined /> 助力进行中
        </div>
        <div v-else-if="application.status === 'completed'" class="status-text completed">
          <CheckCircleOutlined /> 助力已完成
        </div>
        <div v-else-if="application.status === 'claimed'" class="status-text claimed">
          <TrophyOutlined /> 补贴已领取
        </div>
      </div>
    </div>

    <!-- 助力好友列表 -->
    <div class="helpers-section">
      <div class="section-title">助力好友 ({{ application.helpers.length }})</div>
      
      <div class="helpers-list" v-if="application.helpers.length > 0">
        <div class="helper-item" v-for="helper in application.helpers" :key="helper.userId">
          <img v-img-fallback :src="helper.avatar" class="helper-avatar" />
          <div class="helper-info">
            <div class="helper-name">{{ helper.userName }}</div>
            <div class="helper-time">{{ formatTime(helper.helpedAt) }}</div>
          </div>
          <div class="helper-badge">
            <CheckOutlined /> 已助力
          </div>
        </div>
      </div>

      <div class="empty-helpers" v-else>
        <div class="empty-icon">👥</div>
        <div class="empty-text">还没有好友助力,快去邀请吧!</div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="bottom-actions">
      <button 
        v-if="application.status === 'pending' || application.status === 'in_progress'"
        class="share-btn"
        @click="shareToFriends"
      >
        <ShareAltOutlined /> 分享给好友助力
      </button>

      <button 
        v-else-if="application.status === 'completed'"
        class="claim-btn"
        @click="claimSubsidy"
      >
        <GiftOutlined /> 领取补贴
      </button>

      <button 
        v-else-if="application.status === 'claimed'"
        class="claimed-btn"
        disabled
      >
        <CheckCircleOutlined /> 已领取
      </button>
    </div>
  </div>

  <div class="not-found" v-else>
    <div class="not-found-icon">😕</div>
    <div class="not-found-text">申请不存在</div>
    <button class="back-btn" @click="router.back()">返回</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  CheckOutlined,
  ShareAltOutlined,
  GiftOutlined
} from '@ant-design/icons-vue'
import { useSubsidyStore } from '../stores/subsidy'

const route = useRoute()
const router = useRouter()
const subsidyStore = useSubsidyStore()

// 初始化
subsidyStore.init()

// 获取申请详情
const applicationId = parseInt(route.params.id as string)
const application = computed(() => 
  subsidyStore.myApplications.find(app => app.id === applicationId)
)

// 计算进度百分比
const progressPercent = computed(() => {
  if (!application.value) return 0
  return Math.round((application.value.currentHelpers / application.value.requiredHelpers) * 100)
})

// 格式化时间
const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString()
}

// 分享给好友
const shareToFriends = () => {
  message.success('分享链接已复制到剪贴板')
  // TODO: 实际分享功能
}

// 领取补贴
const claimSubsidy = () => {
  if (subsidyStore.claimSubsidy(applicationId)) {
    message.success(`恭喜您获得 ¥${application.value?.subsidyAmount} 补贴!`)
  } else {
    message.error('领取失败,请稍后重试')
  }
}
</script>

<style scoped lang="scss">
.subsidy-help-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  padding-bottom: 80px;
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

.top-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  text-align: center;

  .card-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .card-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .card-desc {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 16px;
  }

  .subsidy-amount {
    display: inline-block;
    padding: 8px 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    font-size: 18px;
    font-weight: 600;
  }
}

.progress-section {
  margin: 20px 16px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .progress-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .progress-count {
      font-size: 16px;

      .current {
        color: #667eea;
        font-weight: 700;
        font-size: 24px;
      }

      .separator {
        color: #ccc;
        margin: 0 4px;
      }

      .total {
        color: #999;
      }
    }
  }

  .progress-circle {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 24px;

    svg {
      width: 100%;
      height: 100%;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      .percent {
        font-size: 36px;
        font-weight: 700;
        color: #667eea;
        line-height: 1;
        margin-bottom: 8px;
      }

      .label {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .progress-status {
    text-align: center;

    .status-text {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;

      &.pending {
        background: #fff3e0;
        color: #f57c00;
      }

      &.in-progress {
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
}

.helpers-section {
  margin: 20px 16px;

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }

  .helpers-list {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .helper-item {
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .helper-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
    }

    .helper-info {
      flex: 1;

      .helper-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .helper-time {
        font-size: 13px;
        color: #999;
      }
    }

    .helper-badge {
      padding: 4px 12px;
      background: #e8f5e9;
      color: #388e3c;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
  }

  .empty-helpers {
    background: white;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .empty-text {
      font-size: 14px;
      color: #999;
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

  button {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .share-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      opacity: 0.9;
      transform: scale(1.02);
    }
  }

  .claim-btn {
    background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
    color: white;

    &:hover {
      opacity: 0.9;
      transform: scale(1.02);
    }
  }

  .claimed-btn {
    background: #f0f0f0;
    color: #999;
    cursor: not-allowed;
  }
}

.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .not-found-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .not-found-text {
    font-size: 18px;
    color: #666;
    margin-bottom: 24px;
  }

  .back-btn {
    padding: 12px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>

