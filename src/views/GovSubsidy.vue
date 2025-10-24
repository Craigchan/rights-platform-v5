<template>
  <div class="gov-subsidy-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <LeftOutlined @click="goBack" />
      <span class="title">政府补贴</span>
      <QuestionCircleOutlined @click="showHelp" />
    </div>

    <!-- 认证状态卡片 -->
    <div class="auth-status-card" :class="authStatus.status">
      <div class="status-left">
        <component :is="authStatus.icon" class="status-icon" />
        <div class="status-info">
          <div class="status-title">{{ authStatus.title }}</div>
          <div class="status-desc">{{ authStatus.desc }}</div>
        </div>
      </div>
      <a-button 
        v-if="!authStatus.certified" 
        type="primary" 
        size="small"
        @click="goToCertification"
      >
        去认证
      </a-button>
      <CheckCircleFilled v-else class="check-icon" />
    </div>

    <!-- 资格申领入口 -->
    <div v-if="authStatus.certified" class="qualification-entry" @click="goToQualificationClaim">
      <div class="entry-left">
        <SafetyCertificateOutlined class="entry-icon" />
        <div class="entry-info">
          <div class="entry-title">资格申领</div>
          <div class="entry-desc">已申领 {{ claimedCount }} 个资格</div>
        </div>
      </div>
      <RightOutlined class="arrow-icon" />
    </div>

    <!-- 补贴统计 -->
    <div class="subsidy-stats">
      <div class="stat-item">
        <div class="stat-value">¥{{ subsidyStore.statistics.totalAmount }}</div>
        <div class="stat-label">累计补贴</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ subsidyStore.statistics.total }}</div>
        <div class="stat-label">申请次数</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ subsidyStore.statistics.pending }}</div>
        <div class="stat-label">审核中</div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-item"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
        <a-badge v-if="tab.badge" :count="tab.badge" class="tab-badge" />
      </div>
    </div>

    <!-- 补贴政策列表 -->
    <div v-if="currentTab === 'policies'" class="content-section">
      <!-- 商家推荐 -->
      <MerchantRecommend 
        v-if="authStatus.certified && selectedSubsidyType"
        :subsidy-type="selectedSubsidyType"
        :limit="3"
      />
      <div 
        v-for="policy in subsidyStore.availableSubsidies" 
        :key="policy.id"
        class="policy-card"
        @click="viewPolicyDetail(policy)"
      >
        <div class="policy-header">
          <div class="policy-tag" :style="{ background: policy.color }">
            {{ policy.icon }} {{ policy.name }}
          </div>
          <div 
            v-if="subsidyStore.hasAppliedType(policy.type)" 
            class="policy-status applied"
          >
            已申请
          </div>
        </div>
        <div class="policy-title">{{ policy.description }}</div>
        <div class="policy-amount-row">
          <div class="policy-amount">
            <span class="amount-label">补贴金额：</span>
            <span class="amount-value">¥{{ policy.amount }}</span>
          </div>
        </div>
        
        <!-- 库存状态 -->
        <div class="policy-quota">
          <div class="quota-bar">
            <div 
              class="quota-fill" 
              :style="{ 
                width: `${(policy.usedQuota / policy.totalQuota) * 100}%`,
                background: getQuotaColor(policy)
              }"
            ></div>
          </div>
          <div class="quota-text">
            剩余 {{ policy.totalQuota - policy.usedQuota }} / {{ policy.totalQuota }}
            <span :class="getQuotaStatusClass(policy)">
              {{ getQuotaStatus(policy) }}
            </span>
          </div>
        </div>
        
        <!-- 申请条件 -->
        <div class="policy-conditions">
          <div class="condition-title">
            <TagOutlined class="condition-icon" />
            申请条件
          </div>
          <div class="condition-list">
            <div v-for="(condition, index) in policy.conditions" :key="index" class="condition-item">
              • {{ condition }}
            </div>
          </div>
        </div>
        
        <a-button 
          v-if="!subsidyStore.hasAppliedType(policy.type)"
          type="primary" 
          block 
          class="apply-btn"
          :disabled="!authStatus.certified || isQuotaExhausted(policy)"
          @click.stop="applySubsidy(policy)"
        >
          {{ getApplyButtonText(policy) }}
        </a-button>
        <a-button 
          v-else
          block 
          class="view-btn"
          @click.stop="viewMyApplication(policy.type)"
        >
          查看申请
        </a-button>
      </div>
    </div>

    <!-- 我的申请列表 -->
    <div v-if="currentTab === 'myApplications'" class="content-section">
      <div 
        v-for="application in subsidyStore.myApplications" 
        :key="application.id"
        class="application-card"
        @click="viewApplicationDetail(application)"
      >
        <div class="application-header">
          <div class="application-title">{{ application.title }}</div>
          <div 
            class="application-status"
            :class="getStatusClass(application.status)"
          >
            {{ getStatusText(application.status) }}
          </div>
        </div>
        <div class="application-info">
          <div class="info-row">
            <span class="info-label">申请编号：</span>
            <span class="info-value">{{ application.applicationNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">申请金额：</span>
            <span class="info-value amount">¥{{ application.subsidyAmount }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">申请时间：</span>
            <span class="info-value">{{ formatTime(application.submittedAt || application.createdAt) }}</span>
          </div>
          <div class="info-row" v-if="application.approvedAt">
            <span class="info-label">审核时间：</span>
            <span class="info-value">{{ formatTime(application.approvedAt) }}</span>
          </div>
        </div>
        
        <!-- 审核进度 -->
        <div class="application-progress" v-if="isPending(application.status)">
          <a-progress 
            :percent="getProgressPercent(application.status)" 
            :show-info="false" 
            stroke-color="#FF6B35" 
          />
          <span class="progress-text">{{ getProgressText(application.status) }}</span>
        </div>
        
        <!-- 拒绝原因 -->
        <div class="reject-reason" v-if="application.status === 'rejected'">
          <ExclamationCircleOutlined />
          {{ application.rejectReason }}
        </div>
      </div>

      <a-empty v-if="subsidyStore.myApplications.length === 0" description="暂无申请记录">
        <a-button type="primary" @click="currentTab = 'policies'">
          去申请补贴
        </a-button>
      </a-empty>
    </div>

    <!-- 申请指南 -->
    <div v-if="currentTab === 'guide'" class="content-section guide-section">
      <div class="guide-card">
        <div class="guide-title">
          <FileTextOutlined />
          申请流程
        </div>
        <div class="guide-steps">
          <div v-for="(step, index) in guideSteps" :key="index" class="guide-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="guide-card">
        <div class="guide-title">
          <ExclamationCircleOutlined />
          注意事项
        </div>
        <div class="guide-notices">
          <div v-for="(notice, index) in notices" :key="index" class="notice-item">
            <div class="notice-dot"></div>
            <div class="notice-text">{{ notice }}</div>
          </div>
        </div>
      </div>

      <div class="guide-card">
        <div class="guide-title">
          <PhoneOutlined />
          联系我们
        </div>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-label">咨询热线：</span>
            <span class="contact-value">400-123-4567</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">工作时间：</span>
            <span class="contact-value">周一至周五 9:00-18:00</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 补贴申请向导 -->
    <SubsidyWizard v-model="showWizard" @complete="onApplicationComplete" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  QuestionCircleOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  CloseCircleOutlined,
  TagOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import { useSubsidyStore } from '@/stores/subsidy'
import { useUserStore } from '@/stores/user'
import SubsidyWizard from '@/components/subsidy/SubsidyWizard.vue'
import MerchantRecommend from '@/components/subsidy/MerchantRecommend.vue'
import type { SubsidyConfig, SubsidyType, ApplicationStatus } from '@/stores/subsidy'

const router = useRouter()
const subsidyStore = useSubsidyStore()
const userStore = useUserStore()

// 初始化
onMounted(async () => {
  subsidyStore.init()
  // 确保 userStore 已初始化
  if (!userStore.userInfo) {
    await userStore.init()
  }
})

// 认证状态
const authStatus = computed(() => {
  console.log('GovSubsidy - 检查认证状态:')
  console.log('userInfo:', userStore.userInfo)
  console.log('realNameInfo:', userStore.userInfo?.realNameInfo)
  console.log('isRealNameVerified:', userStore.isRealNameVerified)
  
  if (userStore.isRealNameVerified) {
    return {
      certified: true,
      status: 'certified',
      icon: SafetyCertificateOutlined,
      title: '已实名认证',
      desc: '您已完成实名认证，可以申请补贴'
    }
  } else {
    return {
      certified: false,
      status: 'not-certified',
      icon: SafetyCertificateOutlined,
      title: '未实名认证',
      desc: '请先完成实名认证才能申请补贴'
    }
  }
})

// Tab 配置
const tabs = computed(() => [
  { id: 'policies', name: '补贴政策', badge: 0 },
  { id: 'myApplications', name: '我的申请', badge: subsidyStore.statistics.pending },
  { id: 'guide', name: '申请指南', badge: 0 }
])

const currentTab = ref('policies')

// 选中的补贴类型（用于商家推荐）
const selectedSubsidyType = ref<SubsidyType | null>('car')

// 申请指南步骤
const guideSteps = ref([
  {
    title: '完成实名认证',
    desc: '使用身份证完成实名认证,确保信息真实有效'
  },
  {
    title: '选择补贴类型',
    desc: '根据自己的需求选择合适的补贴项目'
  },
  {
    title: '上传资格材料',
    desc: '按要求上传身份证、购买凭证、旧物凭证等材料'
  },
  {
    title: '提交申请',
    desc: '确认信息无误后提交申请,等待审核'
  },
  {
    title: '等待审核',
    desc: '材料审核1个工作日,资格审核2个工作日'
  },
  {
    title: '补贴发放',
    desc: '审核通过后3个工作日内补贴发放到银行卡'
  }
])

// 注意事项
const notices = ref([
  '每个自然人每个品类只能申请一次补贴',
  '请确保上传的材料清晰完整,否则可能导致审核失败',
  '补贴金额将直接发放到您填写的银行卡账户',
  '如有疑问请及时联系客服咨询',
  '虚假申请将被列入黑名单,并承担法律责任'
])

// 申请向导
const showWizard = ref(false)
const selectedPolicyType = ref<SubsidyType | null>(null)

// 库存状态
const getQuotaStatus = (policy: SubsidyConfig) => {
  const remaining = policy.totalQuota - policy.usedQuota
  const percentage = (remaining / policy.totalQuota) * 100
  
  if (percentage > 30) return '库存充足'
  if (percentage > 10) return '库存紧张'
  if (percentage > 0) return '即将售罄'
  return '已售罄'
}

const getQuotaStatusClass = (policy: SubsidyConfig) => {
  const remaining = policy.totalQuota - policy.usedQuota
  const percentage = (remaining / policy.totalQuota) * 100
  
  if (percentage > 30) return 'status-sufficient'
  if (percentage > 10) return 'status-low'
  return 'status-exhausted'
}

const getQuotaColor = (policy: SubsidyConfig) => {
  const remaining = policy.totalQuota - policy.usedQuota
  const percentage = (remaining / policy.totalQuota) * 100
  
  if (percentage > 30) return '#52C41A'
  if (percentage > 10) return '#FFA940'
  return '#FF4D4F'
}

const isQuotaExhausted = (policy: SubsidyConfig) => {
  return policy.usedQuota >= policy.totalQuota
}

const getApplyButtonText = (policy: SubsidyConfig) => {
  if (!authStatus.value.certified) return '需先实名认证'
  if (isQuotaExhausted(policy)) return '配额已用完'
  return '立即申请'
}

// 申请状态
const getStatusText = (status: ApplicationStatus) => {
  const statusMap = {
    draft: '草稿',
    submitted: '已提交',
    material_review: '材料审核中',
    qualification_check: '资格审核中',
    approved: '审核通过',
    rejected: '审核拒绝',
    paid: '已发放'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: ApplicationStatus) => {
  if (['submitted', 'material_review', 'qualification_check'].includes(status)) {
    return 'status-pending'
  }
  if (['approved', 'paid'].includes(status)) {
    return 'status-approved'
  }
  if (status === 'rejected') {
    return 'status-rejected'
  }
  return ''
}

const isPending = (status: ApplicationStatus) => {
  return ['submitted', 'material_review', 'qualification_check'].includes(status)
}

const getProgressPercent = (status: ApplicationStatus) => {
  const percentMap = {
    submitted: 20,
    material_review: 40,
    qualification_check: 70,
    approved: 100
  }
  return percentMap[status as keyof typeof percentMap] || 0
}

const getProgressText = (status: ApplicationStatus) => {
  const textMap = {
    submitted: '已提交,等待审核',
    material_review: '材料审核中,预计1个工作日',
    qualification_check: '资格审核中,预计2个工作日',
  }
  return textMap[status as keyof typeof textMap] || '审核中'
}

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 方法
const goBack = () => {
  router.back()
}

const showHelp = () => {
  currentTab.value = 'guide'
}

const goToCertification = () => {
  router.push('/real-name-auth')
}

const goToQualificationClaim = () => {
  router.push('/qualification-claim')
}

// 已申领资格数量
const claimedCount = computed(() => {
  return subsidyStore.claimedQualifications.length
})

const viewPolicyDetail = (policy: SubsidyConfig) => {
  // 可以跳转到详情页或显示详情弹窗
  console.log('View policy detail:', policy)
}

const applySubsidy = (policy: SubsidyConfig) => {
  if (!authStatus.value.certified) {
    message.warning('请先完成实名认证')
    router.push('/real-name-auth')
    return
  }
  
  if (isQuotaExhausted(policy)) {
    message.warning('该补贴配额已用完')
    return
  }
  
  if (subsidyStore.hasAppliedType(policy.type)) {
    message.warning('您已申请过该类型的补贴')
    return
  }
  
  selectedPolicyType.value = policy.type
  showWizard.value = true
}

const viewMyApplication = (type: SubsidyType) => {
  currentTab.value = 'myApplications'
}

const viewApplicationDetail = (application: any) => {
  // 跳转到申请详情页
  router.push(`/subsidy-applications/${application.id}`)
}

const onApplicationComplete = () => {
  currentTab.value = 'myApplications'
  message.success('申请提交成功')
}
</script>

<style scoped>
.gov-subsidy-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.top-nav .title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.top-nav :deep(.anticon) {
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.auth-status-card {
  margin: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auth-status-card.certified {
  border: 1px solid #52c41a;
}

.auth-status-card.not-certified {
  border: 1px solid #faad14;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  font-size: 32px;
  color: #52c41a;
}

.not-certified .status-icon {
  color: #faad14;
}

.status-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.status-desc {
  font-size: 13px;
  color: #666;
}

.check-icon {
  font-size: 24px;
  color: #52c41a;
}

.qualification-entry {
  margin: 0 16px 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s;
}

.qualification-entry:active {
  transform: scale(0.98);
  background: #f5f5f5;
}

.entry-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.entry-icon {
  font-size: 24px;
  color: #1890ff;
}

.entry-info {
  display: flex;
  flex-direction: column;
}

.entry-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.entry-desc {
  font-size: 12px;
  color: #999;
}

.arrow-icon {
  font-size: 14px;
  color: #999;
}

.subsidy-stats {
  margin: 0 16px 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  color: white;
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

.tabs {
  display: flex;
  background: white;
  margin: 0 16px 16px;
  border-radius: 12px;
  overflow: hidden;
}

.tab-item {
  flex: 1;
  padding: 14px;
  text-align: center;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.tab-item.active {
  color: #FF6B35;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  background: #FF6B35;
  border-radius: 2px 2px 0 0;
}

.content-section {
  padding: 0 16px;
}

.policy-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.policy-card:active {
  transform: scale(0.98);
}

.policy-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.policy-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: white;
  font-weight: 500;
}

.policy-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background: #f0f0f0;
  color: #666;
}

.policy-status.applied {
  background: #e6f7ff;
  color: #1890ff;
}

.policy-title {
  font-size: 15px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.policy-amount-row {
  margin-bottom: 12px;
}

.policy-amount {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.amount-label {
  font-size: 14px;
  color: #666;
}

.amount-value {
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
}

.policy-quota {
  margin-bottom: 12px;
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
  transition: width 0.3s;
}

.quota-text {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-sufficient {
  color: #52C41A;
}

.status-low {
  color: #FFA940;
}

.status-exhausted {
  color: #FF4D4F;
}

.policy-conditions {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.condition-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.condition-icon {
  color: #FF6B35;
}

.condition-list {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

.condition-item {
  padding: 2px 0;
}

.apply-btn {
  border-radius: 20px;
  height: 40px;
  font-weight: 600;
}

.view-btn {
  border-radius: 20px;
  height: 40px;
  font-weight: 600;
  border-color: #FF6B35;
  color: #FF6B35;
}

.application-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
}

.application-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.application-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.application-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status-approved {
  background: #f6ffed;
  color: #52c41a;
}

.status-rejected {
  background: #fff1f0;
  color: #ff4d4f;
}

.application-info {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.info-value.amount {
  color: #FF6B35;
  font-size: 16px;
  font-weight: bold;
}

.application-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.application-progress :deep(.ant-progress) {
  flex: 1;
}

.progress-text {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.reject-reason {
  background: #fff1f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #ff4d4f;
  display: flex;
  align-items: center;
  gap: 8px;
}

.guide-section {
  padding-bottom: 40px;
}

.guide-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.guide-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.guide-title :deep(.anticon) {
  color: #FF6B35;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-step {
  display: flex;
  gap: 12px;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #FF6B35;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.guide-notices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF6B35;
  margin-top: 7px;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  font-size: 14px;
}

.contact-label {
  color: #666;
  width: 80px;
}

.contact-value {
  color: #333;
  font-weight: 500;
}
</style>

