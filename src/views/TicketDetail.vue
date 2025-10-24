<template>
  <div class="ticket-detail-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">票根详情</span>
      <div class="placeholder"></div>
    </div>

    <!-- 票根图片 -->
    <div class="ticket-image-section">
      <img v-img-fallback :src="ticket.image" alt="票根图片" class="ticket-image" />
      <div class="status-badge" :class="ticket.status">
        {{ getStatusText(ticket.status) }}
      </div>
    </div>

    <!-- 票根信息 -->
    <div class="ticket-info-section">
      <div class="section-header">
        <span class="type-icon">{{ getTypeIcon(ticket.type) }}</span>
        <span class="type-label">{{ getTypeLabel(ticket.type) }}</span>
      </div>

      <div class="info-list">
        <div class="info-item">
          <div class="item-label">商家名称</div>
          <div class="item-value">{{ ticket.merchantName }}</div>
        </div>
        <div class="info-item">
          <div class="item-label">消费金额</div>
          <div class="item-value amount">¥{{ ticket.amount }}</div>
        </div>
        <div class="info-item">
          <div class="item-label">消费时间</div>
          <div class="item-value">{{ ticket.consumeTime }}</div>
        </div>
        <div class="info-item">
          <div class="item-label">上传时间</div>
          <div class="item-value">{{ ticket.uploadTime }}</div>
        </div>
        <div v-if="ticket.remark" class="info-item">
          <div class="item-label">备注信息</div>
          <div class="item-value">{{ ticket.remark }}</div>
        </div>
      </div>
    </div>

    <!-- 审核信息 -->
    <div class="audit-section">
      <div class="section-title">审核信息</div>
      
      <div v-if="ticket.status === 'passed'" class="audit-card success">
        <CheckCircleOutlined class="audit-icon" />
        <div class="audit-content">
          <div class="audit-title">审核通过</div>
          <div class="audit-desc">票根信息真实有效,可用于参与抽奖活动</div>
          <div class="audit-time">审核时间: {{ ticket.auditTime }}</div>
        </div>
      </div>

      <div v-else-if="ticket.status === 'rejected'" class="audit-card error">
        <CloseCircleOutlined class="audit-icon" />
        <div class="audit-content">
          <div class="audit-title">审核未通过</div>
          <div class="audit-desc">{{ ticket.rejectReason }}</div>
          <div class="audit-time">审核时间: {{ ticket.auditTime }}</div>
        </div>
      </div>

      <div v-else class="audit-card warning">
        <ClockCircleOutlined class="audit-icon" />
        <div class="audit-content">
          <div class="audit-title">审核中</div>
          <div class="audit-desc">工作人员正在审核您的票根,预计24小时内完成</div>
          <div class="audit-time">提交时间: {{ ticket.uploadTime }}</div>
        </div>
      </div>
    </div>

    <!-- 使用记录 -->
    <div v-if="ticket.status === 'passed'" class="usage-section">
      <div class="section-title">使用记录</div>
      
      <div v-if="ticket.used" class="usage-card">
        <div class="usage-header">
          <CheckCircleOutlined class="usage-icon" />
          <span>已使用</span>
        </div>
        <div class="usage-info">
          <div class="usage-item">
            <span class="usage-label">使用活动:</span>
            <span class="usage-value">大连消费券大抽奖</span>
          </div>
          <div class="usage-item">
            <span class="usage-label">使用时间:</span>
            <span class="usage-value">2025-10-14 21:35</span>
          </div>
        </div>
      </div>

      <div v-else class="usage-card available">
        <div class="usage-header">
          <GiftOutlined class="usage-icon" />
          <span>可用于抽奖</span>
        </div>
        <div class="usage-desc">此票根可用于参与抽奖活动,快去抽奖大厅看看吧!</div>
        <a-button type="primary" block @click="router.push('/lottery-hall')">
          前往抽奖大厅
        </a-button>
      </div>
    </div>

    <!-- 底部操作 -->
    <div v-if="ticket.status === 'rejected'" class="bottom-actions">
      <a-button type="primary" size="large" block @click="router.push('/ticket-upload')">
        重新上传
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  LeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  GiftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 模拟票根数据
const ticket = ref({
  id: 1,
  type: 'sports',
  merchantName: '大连人 vs 上海海港',
  amount: '180.00',
  consumeTime: '2025-10-15 19:30',
  uploadTime: '2025-10-15 20:45',
  auditTime: '2025-10-15 21:30',
  status: 'passed',
  image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Cdefs%3E%3ClinearGradient id="td1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="250" fill="url(%23td1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-weight="bold" font-family="Arial"%3E体育赛事票根%3C/text%3E%3C/svg%3E',
  remark: '中超联赛第30轮',
  used: false
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
</script>

<style scoped lang="scss">
.ticket-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
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

  .placeholder {
    width: 20px;
  }
}

.ticket-image-section {
  position: relative;
  margin: 15px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .ticket-image {
    width: 100%;
    display: block;
  }

  .status-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    backdrop-filter: blur(10px);

    &.pending {
      background: rgba(250, 140, 22, 0.9);
      color: #fff;
    }

    &.passed {
      background: rgba(82, 196, 26, 0.9);
      color: #fff;
    }

    &.rejected {
      background: rgba(255, 77, 79, 0.9);
      color: #fff;
    }
  }
}

.ticket-info-section {
  background: #fff;
  margin: 0 15px 15px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;

    .type-icon {
      font-size: 24px;
    }

    .type-label {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }

  .info-list {
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .item-label {
        font-size: 14px;
        color: #999;
        flex-shrink: 0;
        margin-right: 20px;
      }

      .item-value {
        font-size: 15px;
        color: #333;
        text-align: right;
        flex: 1;

        &.amount {
          color: #ff6b35;
          font-weight: 500;
          font-size: 18px;
        }
      }
    }
  }
}

.audit-section, .usage-section {
  margin: 0 15px 15px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
    padding-left: 12px;
    border-left: 4px solid #ff6b35;
  }

  .audit-card, .usage-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    gap: 15px;

    .audit-icon {
      font-size: 32px;
      flex-shrink: 0;
    }

    .audit-content {
      flex: 1;

      .audit-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .audit-desc {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 8px;
      }

      .audit-time {
        font-size: 13px;
        color: #999;
      }
    }

    &.success {
      .audit-icon {
        color: #52c41a;
      }

      .audit-title {
        color: #52c41a;
      }
    }

    &.warning {
      .audit-icon {
        color: #fa8c16;
      }

      .audit-title {
        color: #fa8c16;
      }
    }

    &.error {
      .audit-icon {
        color: #ff4d4f;
      }

      .audit-title {
        color: #ff4d4f;
      }
    }
  }

  .usage-card {
    flex-direction: column;
    gap: 12px;

    .usage-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;

      .usage-icon {
        font-size: 20px;
      }
    }

    .usage-info {
      .usage-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;

        &:last-child {
          margin-bottom: 0;
        }

        .usage-label {
          color: #999;
        }

        .usage-value {
          color: #666;
        }
      }
    }

    .usage-desc {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 12px;
    }

    &.available {
      .usage-header {
        color: #52c41a;

        .usage-icon {
          color: #52c41a;
        }
      }
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}
</style>

