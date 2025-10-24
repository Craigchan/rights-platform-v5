<template>
  <div class="qualification-claim">
    <!-- 头部 -->
    <div class="claim-header">
      <div class="header-left" @click="router.back()">
        <LeftOutlined />
      </div>
      <div class="header-title">资格申领</div>
      <div class="header-right"></div>
    </div>

    <div class="claim-content">
      <!-- 说明卡片 -->
      <div class="info-card">
        <div class="info-icon">
          <SafetyCertificateOutlined />
        </div>
        <div class="info-text">
          <div class="info-title">什么是资格申领?</div>
          <div class="info-desc">
            申领补贴资格后,即可申请对应的补贴项目。每个资格只需申领一次,永久有效。
          </div>
        </div>
      </div>

      <!-- 补贴资格列表 -->
      <div class="qualification-list">
        <div 
          v-for="subsidy in subsidyStore.availableSubsidies" 
          :key="subsidy.id"
          class="qualification-item"
          :class="{ claimed: isQualificationClaimed(subsidy.type) }"
        >
          <div class="item-icon">{{ subsidy.icon }}</div>
          <div class="item-content">
            <div class="item-header">
              <div class="item-title">{{ subsidy.name }}</div>
              <div class="item-amount" :style="{ color: subsidy.color }">
                最高¥{{ subsidy.amount }}
              </div>
            </div>
            <div class="item-desc">{{ subsidy.description }}</div>
            <div class="item-quota">
              <div class="quota-bar">
                <div 
                  class="quota-fill" 
                  :style="{ 
                    width: `${(subsidy.usedQuota / subsidy.totalQuota) * 100}%`,
                    background: subsidy.color 
                  }"
                ></div>
              </div>
              <div class="quota-text">
                剩余 {{ subsidy.totalQuota - subsidy.usedQuota }} / {{ subsidy.totalQuota }}
                <span :class="getQuotaStatusClass(subsidy)">
                  {{ getQuotaStatus(subsidy) }}
                </span>
              </div>
            </div>
          </div>
          <div class="item-action">
            <a-button 
              v-if="!isQualificationClaimed(subsidy.type)"
              type="primary" 
              size="small"
              @click="claimQualification(subsidy)"
            >
              申领
            </a-button>
            <div v-else class="claimed-badge">
              <CheckCircleFilled /> 已申领
            </div>
          </div>
        </div>
      </div>

      <!-- 已申领统计 -->
      <div class="claim-stats">
        <div class="stats-title">申领统计</div>
        <div class="stats-grid">
          <div class="stats-item">
            <div class="stats-value">{{ claimedQualifications.length }}</div>
            <div class="stats-label">已申领资格</div>
          </div>
          <div class="stats-item">
            <div class="stats-value">{{ subsidyStore.availableSubsidies.length - claimedQualifications.length }}</div>
            <div class="stats-label">可申领资格</div>
          </div>
          <div class="stats-item">
            <div class="stats-value">{{ totalSubsidyAmount }}</div>
            <div class="stats-label">可获补贴(元)</div>
          </div>
        </div>
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
  SafetyCertificateOutlined,
  CheckCircleFilled
} from '@ant-design/icons-vue'
import { useSubsidyStore } from '@/stores/subsidy'
import type { SubsidyType } from '@/stores/subsidy'

const router = useRouter()
const subsidyStore = useSubsidyStore()

const claimedQualifications = computed(() => subsidyStore.claimedQualifications)

const isQualificationClaimed = (type: SubsidyType) => {
  return claimedQualifications.value.includes(type)
}

const claimQualification = (subsidy: any) => {
  if (isQualificationClaimed(subsidy.type)) {
    message.warning('您已申领过该资格')
    return
  }

  // 添加到已申领列表
  subsidyStore.claimedQualifications.push(subsidy.type)
  message.success(`成功申领${subsidy.name}资格!`)
}

const getQuotaStatus = (policy: any) => {
  const remaining = policy.totalQuota - policy.usedQuota
  const percentage = (remaining / policy.totalQuota) * 100
  
  if (percentage > 50) return '充足'
  if (percentage > 20) return '紧张'
  return '即将用完'
}

const getQuotaStatusClass = (policy: any) => {
  const remaining = policy.totalQuota - policy.usedQuota
  const percentage = (remaining / policy.totalQuota) * 100
  
  if (percentage > 50) return 'quota-sufficient'
  if (percentage > 20) return 'quota-low'
  return 'quota-critical'
}

const totalSubsidyAmount = computed(() => {
  return claimedQualifications.value.reduce((sum, type) => {
    const subsidy = subsidyStore.availableSubsidies.find(s => s.type === type)
    return sum + (subsidy?.amount || 0)
  }, 0)
})
</script>

<style scoped lang="scss">
.qualification-claim {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.claim-header {
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

.claim-content {
  padding: 16px;
}

.info-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.info-icon {
  font-size: 32px;
  color: #667eea;
}

.info-text {
  flex: 1;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.info-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.qualification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.qualification-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.qualification-item:active {
  transform: scale(0.98);
}

.qualification-item.claimed {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.item-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.item-amount {
  font-size: 16px;
  font-weight: 600;
}

.item-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.item-quota {
  margin-top: 8px;
}

.quota-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.quota-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.quota-text {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quota-sufficient {
  color: #52c41a;
  font-weight: 500;
}

.quota-low {
  color: #faad14;
  font-weight: 500;
}

.quota-critical {
  color: #ff4d4f;
  font-weight: 500;
}

.item-action {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.claimed-badge {
  color: #52c41a;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.claim-stats {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stats-item {
  text-align: center;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 13px;
  color: #999;
}
</style>

