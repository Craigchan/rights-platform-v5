<template>
  <div class="subsidy-application-detail">
    <!-- 头部 -->
    <div class="detail-header">
      <div class="header-left" @click="router.back()">
        <LeftOutlined />
      </div>
      <div class="header-title">申请详情</div>
      <div class="header-right"></div>
    </div>

    <div v-if="application" class="detail-content">
      <!-- 状态卡片 -->
      <div class="status-card" :class="`status-${application.status}`">
        <div class="status-icon">
          <CheckCircleOutlined v-if="application.status === 'completed' || application.status === 'claimed'" />
          <ClockCircleOutlined v-else-if="application.status === 'pending' || application.status === 'in_progress'" />
          <CloseCircleOutlined v-else />
        </div>
        <div class="status-text">{{ getStatusText(application.status) }}</div>
        <div class="status-desc">{{ getStatusDesc(application.status) }}</div>
      </div>

      <!-- 申请信息 -->
      <div class="info-section">
        <div class="section-title">申请信息</div>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">申请编号</span>
            <span class="info-value">{{ application.applicationNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">补贴类型</span>
            <span class="info-value">{{ application.title }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">补贴金额</span>
            <span class="info-value amount">¥{{ application.subsidyAmount }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">申请时间</span>
            <span class="info-value">{{ formatTime(application.submittedAt || application.createdAt) }}</span>
          </div>
          <div class="info-row" v-if="application.approvedAt">
            <span class="info-label">审核时间</span>
            <span class="info-value">{{ formatTime(application.approvedAt) }}</span>
          </div>
          <div class="info-row" v-if="application.completedAt">
            <span class="info-label">完成时间</span>
            <span class="info-value">{{ formatTime(application.completedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 助力进度 -->
      <div class="info-section" v-if="application.status === 'in_progress'">
        <div class="section-title">
          助力进度
          <span class="progress-count">{{ application.currentHelpers }}/{{ application.requiredHelpers }}</span>
        </div>
        <div class="progress-card">
          <a-progress 
            :percent="(application.currentHelpers / application.requiredHelpers) * 100" 
            :show-info="false"
            stroke-color="#667eea"
            :stroke-width="8"
          />
          <div class="progress-text">
            还需 <span class="highlight">{{ application.requiredHelpers - application.currentHelpers }}</span> 人助力即可领取补贴
          </div>
          <a-button type="primary" size="large" class="share-btn" @click="shareToFriends">
            <ShareAltOutlined /> 邀请好友助力
          </a-button>
        </div>
      </div>

      <!-- 助力好友列表 -->
      <div class="info-section" v-if="application.helpers && application.helpers.length > 0">
        <div class="section-title">助力好友 ({{ application.helpers.length }})</div>
        <div class="helpers-list">
          <div v-for="helper in application.helpers" :key="helper.userId" class="helper-item">
            <img :src="helper.avatar" :alt="helper.userName" class="helper-avatar" />
            <div class="helper-info">
              <div class="helper-name">{{ helper.userName }}</div>
              <div class="helper-time">{{ helper.helpedAt }}</div>
            </div>
            <div class="helper-badge">
              <HeartFilled /> 已助力
            </div>
          </div>
        </div>
      </div>

      <!-- 审核进度时间线 -->
      <div class="info-section">
        <div class="section-title">审核进度</div>
        <div class="timeline-card">
          <a-timeline>
            <a-timeline-item color="green">
              <template #dot>
                <CheckCircleOutlined style="font-size: 16px" />
              </template>
              <div class="timeline-content">
                <div class="timeline-title">提交申请</div>
                <div class="timeline-time">{{ formatTime(application.createdAt) }}</div>
              </div>
            </a-timeline-item>

            <a-timeline-item 
              :color="application.status === 'in_progress' || application.status === 'completed' || application.status === 'claimed' ? 'green' : 'gray'"
            >
              <template #dot>
                <CheckCircleOutlined v-if="application.status === 'in_progress' || application.status === 'completed' || application.status === 'claimed'" style="font-size: 16px" />
                <ClockCircleOutlined v-else style="font-size: 16px" />
              </template>
              <div class="timeline-content">
                <div class="timeline-title">资格审核</div>
                <div class="timeline-time" v-if="application.approvedAt">{{ formatTime(application.approvedAt) }}</div>
                <div class="timeline-desc" v-else>审核中...</div>
              </div>
            </a-timeline-item>

            <a-timeline-item 
              :color="application.status === 'completed' || application.status === 'claimed' ? 'green' : 'gray'"
            >
              <template #dot>
                <CheckCircleOutlined v-if="application.status === 'completed' || application.status === 'claimed'" style="font-size: 16px" />
                <ClockCircleOutlined v-else style="font-size: 16px" />
              </template>
              <div class="timeline-content">
                <div class="timeline-title">好友助力完成</div>
                <div class="timeline-time" v-if="application.completedAt">{{ formatTime(application.completedAt) }}</div>
                <div class="timeline-desc" v-else>等待好友助力...</div>
              </div>
            </a-timeline-item>

            <a-timeline-item 
              :color="application.status === 'claimed' ? 'green' : 'gray'"
            >
              <template #dot>
                <CheckCircleOutlined v-if="application.status === 'claimed'" style="font-size: 16px" />
                <ClockCircleOutlined v-else style="font-size: 16px" />
              </template>
              <div class="timeline-content">
                <div class="timeline-title">领取补贴</div>
                <div class="timeline-time" v-if="application.claimedAt">{{ formatTime(application.claimedAt) }}</div>
                <div class="timeline-desc" v-else>待领取</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>

      <!-- 拒绝原因 -->
      <div class="info-section" v-if="application.status === 'rejected' && application.rejectReason">
        <div class="section-title">拒绝原因</div>
        <div class="reject-card">
          <ExclamationCircleOutlined />
          {{ application.rejectReason }}
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="bottom-actions" v-if="application.status === 'completed'">
        <a-button type="primary" size="large" block @click="claimSubsidy">
          立即领取补贴
        </a-button>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-else class="loading-state">
      <a-spin size="large" />
      <div class="loading-text">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ShareAltOutlined,
  HeartFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { useSubsidyStore } from '@/stores/subsidy'
import type { SubsidyApplication } from '@/stores/subsidy'

const router = useRouter()
const route = useRoute()
const subsidyStore = useSubsidyStore()

const application = ref<SubsidyApplication | null>(null)

onMounted(() => {
  const id = Number(route.params.id)
  const app = subsidyStore.myApplications.find(a => a.id === id)
  if (app) {
    application.value = app
  } else {
    message.error('申请不存在')
    router.back()
  }
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    in_progress: '审核中',
    approved: '已通过',
    rejected: '已拒绝',
    completed: '已完成',
    claimed: '已领取'
  }
  return statusMap[status] || status
}

const getStatusDesc = (status: string) => {
  const descMap: Record<string, string> = {
    pending: '您的申请正在等待审核',
    in_progress: '审核通过,邀请好友助力即可领取',
    completed: '助力已完成,可以领取补贴了',
    claimed: '补贴已成功领取',
    rejected: '很抱歉,您的申请未通过审核'
  }
  return descMap[status] || ''
}

const formatTime = (time: string) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const shareToFriends = () => {
  message.info('分享功能开发中...')
  // TODO: 实现分享功能
}

const claimSubsidy = () => {
  if (!application.value) return
  
  subsidyStore.claimSubsidy(application.value.id)
  message.success('领取成功!')
  
  // 刷新数据
  const app = subsidyStore.myApplications.find(a => a.id === application.value!.id)
  if (app) {
    application.value = app
  }
}
</script>

<style scoped lang="scss">
.subsidy-application-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.detail-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  width: 28px;
}

.detail-content {
  padding: 16px;
}

.status-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.status-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.status-card.status-completed .status-icon,
.status-card.status-claimed .status-icon {
  color: #52c41a;
}

.status-card.status-pending .status-icon,
.status-card.status-in_progress .status-icon {
  color: #1890ff;
}

.status-card.status-rejected .status-icon {
  color: #ff4d4f;
}

.status-text {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.status-desc {
  font-size: 14px;
  color: #666;
}

.info-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-count {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
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

.info-value.amount {
  font-size: 18px;
  color: #ff6b35;
  font-weight: 600;
}

.progress-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.progress-text {
  margin-top: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.progress-text .highlight {
  color: #667eea;
  font-weight: 600;
  font-size: 18px;
}

.share-btn {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 16px;
  font-weight: 600;
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
}

.helper-item:last-child {
  border-bottom: none;
}

.helper-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
}

.helper-info {
  flex: 1;
}

.helper-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.helper-time {
  font-size: 13px;
  color: #999;
}

.helper-badge {
  font-size: 13px;
  color: #ff6b35;
  display: flex;
  align-items: center;
  gap: 4px;
}

.timeline-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.timeline-content {
  padding-left: 8px;
}

.timeline-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.timeline-time {
  font-size: 13px;
  color: #999;
}

.timeline-desc {
  font-size: 13px;
  color: #999;
}

.reject-card {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 12px;
  padding: 16px;
  color: #ff4d4f;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 16px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
}

.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: #999;
}
</style>

