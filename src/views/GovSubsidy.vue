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

    <!-- 补贴统计 -->
    <div class="subsidy-stats">
      <div class="stat-item">
        <div class="stat-value">¥{{ subsidyStats.total }}</div>
        <div class="stat-label">累计补贴</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ subsidyStats.count }}</div>
        <div class="stat-label">申请次数</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ subsidyStats.pending }}</div>
        <div class="stat-label">审核中</div>
      </div>
    </div>

    <!-- 好友助力入口 -->
    <div class="help-entry" @click="goToSubsidyHelp">
      <div class="help-icon">🤝</div>
      <div class="help-content">
        <div class="help-title">好友助力,快速获得补贴</div>
        <div class="help-desc">邀请好友助力,完成后即可申请政府补贴资格</div>
      </div>
      <RightOutlined class="help-arrow" />
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
      <div 
        v-for="policy in subsidyPolicies" 
        :key="policy.id"
        class="policy-card"
        @click="viewPolicyDetail(policy)"
      >
        <div class="policy-header">
          <div class="policy-tag" :style="{ background: policy.tagColor }">
            {{ policy.tag }}
          </div>
          <div class="policy-status" v-if="policy.applied">
            {{ policy.status }}
          </div>
        </div>
        <div class="policy-title">{{ policy.title }}</div>
        <div class="policy-desc">{{ policy.desc }}</div>
        <div class="policy-footer">
          <div class="policy-amount">
            <span class="amount-label">补贴金额：</span>
            <span class="amount-value">¥{{ policy.amount }}</span>
          </div>
          <div class="policy-time">{{ policy.deadline }}</div>
        </div>
        <div class="policy-conditions">
          <TagOutlined class="condition-icon" />
          <span>{{ policy.condition }}</span>
        </div>
        <a-button 
          v-if="!policy.applied"
          type="primary" 
          block 
          class="apply-btn"
          :disabled="!authStatus.certified"
          @click.stop="applySubsidy(policy)"
        >
          {{ authStatus.certified ? '立即申请' : '需先实名认证' }}
        </a-button>
      </div>
    </div>

    <!-- 我的申请列表 -->
    <div v-if="currentTab === 'myApplications'" class="content-section">
      <div 
        v-for="application in myApplications" 
        :key="application.id"
        class="application-card"
        @click="viewApplicationDetail(application)"
      >
        <div class="application-header">
          <div class="application-title">{{ application.policyName }}</div>
          <div 
            class="application-status"
            :class="application.statusClass"
          >
            {{ application.statusText }}
          </div>
        </div>
        <div class="application-info">
          <div class="info-row">
            <span class="info-label">申请金额：</span>
            <span class="info-value">¥{{ application.amount }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">申请时间：</span>
            <span class="info-value">{{ application.applyTime }}</span>
          </div>
          <div class="info-row" v-if="application.approveTime">
            <span class="info-label">审核时间：</span>
            <span class="info-value">{{ application.approveTime }}</span>
          </div>
        </div>
        <div class="application-progress" v-if="application.status === 'pending'">
          <a-progress :percent="50" :show-info="false" stroke-color="#FF6B35" />
          <span class="progress-text">审核中，预计3个工作日</span>
        </div>
        <div class="application-actions" v-if="application.status === 'approved'">
          <a-button size="small" @click.stop="viewCertificate(application)">
            查看凭证
          </a-button>
        </div>
      </div>

      <a-empty v-if="myApplications.length === 0" description="暂无申请记录" />
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

    <!-- 申请弹窗 -->
    <a-modal
      v-model:open="showApplyModal"
      title="申请补贴"
      :footer="null"
      width="90%"
    >
      <div class="apply-modal-content" v-if="selectedPolicy">
        <div class="modal-policy-info">
          <div class="modal-policy-title">{{ selectedPolicy.title }}</div>
          <div class="modal-policy-amount">补贴金额：¥{{ selectedPolicy.amount }}</div>
        </div>

        <a-form :model="applyForm" layout="vertical">
          <a-form-item label="姓名" required>
            <a-input v-model:value="applyForm.name" placeholder="请输入真实姓名" />
          </a-form-item>
          <a-form-item label="身份证号" required>
            <a-input v-model:value="applyForm.idCard" placeholder="请输入身份证号" />
          </a-form-item>
          <a-form-item label="手机号" required>
            <a-input v-model:value="applyForm.phone" placeholder="请输入手机号" />
          </a-form-item>
          <a-form-item label="购买凭证" required>
            <div class="upload-area">
              <div class="upload-item" v-for="(img, index) in applyForm.images" :key="index">
                <div class="upload-preview" :style="{ background: img.color }"></div>
                <CloseCircleOutlined class="remove-icon" @click="removeImage(index)" />
              </div>
              <div class="upload-btn" @click="uploadImage" v-if="applyForm.images.length < 3">
                <PlusOutlined />
                <div>上传凭证</div>
              </div>
            </div>
            <div class="upload-tip">请上传购买发票或小票，最多3张</div>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea 
              v-model:value="applyForm.remark" 
              placeholder="请输入备注信息（选填）"
              :rows="3"
            />
          </a-form-item>
        </a-form>

        <div class="modal-actions">
          <a-button @click="showApplyModal = false">取消</a-button>
          <a-button type="primary" @click="submitApplication" :loading="submitting">
            提交申请
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 帮助弹窗 -->
    <a-modal
      v-model:open="showHelpModal"
      title="帮助中心"
      :footer="null"
      width="90%"
    >
      <div class="help-content">
        <div class="help-section">
          <div class="help-question">什么是政府补贴？</div>
          <div class="help-answer">
            政府补贴是政府为鼓励消费、促进经济发展而推出的惠民政策，符合条件的消费者可以申请相应的补贴金额。
          </div>
        </div>
        <div class="help-section">
          <div class="help-question">如何申请补贴？</div>
          <div class="help-answer">
            1. 完成实名认证<br>
            2. 选择符合条件的补贴政策<br>
            3. 填写申请信息并上传凭证<br>
            4. 等待审核<br>
            5. 审核通过后补贴将发放到账
          </div>
        </div>
        <div class="help-section">
          <div class="help-question">审核需要多长时间？</div>
          <div class="help-answer">
            一般情况下，审核时间为3-5个工作日。您可以在"我的申请"中查看审核进度。
          </div>
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
  QuestionCircleOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  CloseCircleOutlined,
  TagOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 认证状态
const authStatus = ref({
  certified: true, // 模拟已认证状态
  status: 'certified',
  icon: SafetyCertificateOutlined,
  title: '已实名认证',
  desc: '您已完成实名认证，可以申请补贴'
})

// 补贴统计
const subsidyStats = ref({
  total: 1580,
  count: 5,
  pending: 1
})

// Tab 配置
const tabs = ref([
  { id: 'policies', name: '补贴政策', badge: 0 },
  { id: 'myApplications', name: '我的申请', badge: 1 },
  { id: 'guide', name: '申请指南', badge: 0 }
])

const currentTab = ref('policies')

// 补贴政策数据
const subsidyPolicies = ref([
  {
    id: 1,
    title: '家电以旧换新补贴',
    desc: '购买符合条件的家电产品，最高可获500元补贴',
    amount: 500,
    tag: '热门',
    tagColor: '#FF6B35',
    condition: '购买金额≥2000元',
    deadline: '2025年12月31日截止',
    applied: false,
    status: ''
  },
  {
    id: 2,
    title: '新能源汽车购置补贴',
    desc: '购买新能源汽车可享受政府补贴',
    amount: 8000,
    tag: '推荐',
    tagColor: '#00A8E8',
    condition: '购买新能源汽车',
    deadline: '2025年12月31日截止',
    applied: false,
    status: ''
  },
  {
    id: 3,
    title: '绿色智能家电补贴',
    desc: '购买绿色智能家电产品补贴',
    amount: 300,
    tag: '进行中',
    tagColor: '#43E97B',
    condition: '购买金额≥1500元',
    deadline: '2025年10月31日截止',
    applied: true,
    status: '已申请'
  },
  {
    id: 4,
    title: '家装消费补贴',
    desc: '家庭装修消费补贴政策',
    amount: 1000,
    tag: '新政策',
    tagColor: '#8338EC',
    condition: '装修金额≥10000元',
    deadline: '2025年12月31日截止',
    applied: false,
    status: ''
  },
  {
    id: 5,
    title: '智能家居产品补贴',
    desc: '购买智能家居产品享受补贴',
    amount: 200,
    tag: '热门',
    tagColor: '#FF6B35',
    condition: '购买金额≥1000元',
    deadline: '2025年11月30日截止',
    applied: false,
    status: ''
  },
  {
    id: 6,
    title: '节能产品补贴',
    desc: '购买节能认证产品补贴',
    amount: 150,
    tag: '环保',
    tagColor: '#43E97B',
    condition: '购买节能产品',
    deadline: '2025年12月31日截止',
    applied: false,
    status: ''
  }
])

// 我的申请数据
const myApplications = ref([
  {
    id: 1,
    policyName: '绿色智能家电补贴',
    amount: 300,
    applyTime: '2025-10-10 14:30',
    approveTime: '',
    status: 'pending',
    statusText: '审核中',
    statusClass: 'status-pending'
  },
  {
    id: 2,
    policyName: '家电以旧换新补贴',
    amount: 500,
    applyTime: '2025-09-15 10:20',
    approveTime: '2025-09-18 16:45',
    status: 'approved',
    statusText: '已通过',
    statusClass: 'status-approved'
  },
  {
    id: 3,
    policyName: '智能家居产品补贴',
    amount: 200,
    applyTime: '2025-08-20 11:15',
    approveTime: '2025-08-23 09:30',
    status: 'approved',
    statusText: '已通过',
    statusClass: 'status-approved'
  },
  {
    id: 4,
    policyName: '节能产品补贴',
    amount: 150,
    applyTime: '2025-07-10 15:40',
    approveTime: '2025-07-13 14:20',
    status: 'approved',
    statusText: '已通过',
    statusClass: 'status-approved'
  },
  {
    id: 5,
    policyName: '家装消费补贴',
    amount: 430,
    applyTime: '2025-06-05 09:10',
    approveTime: '2025-06-08 11:25',
    status: 'approved',
    statusText: '已通过',
    statusClass: 'status-approved'
  }
])

// 申请指南
const guideSteps = ref([
  {
    title: '完成实名认证',
    desc: '首次使用需要完成实名认证，确保信息真实有效'
  },
  {
    title: '选择补贴政策',
    desc: '浏览补贴政策列表，选择符合条件的政策'
  },
  {
    title: '填写申请信息',
    desc: '准确填写个人信息和购买信息'
  },
  {
    title: '上传购买凭证',
    desc: '上传购买发票、小票等凭证照片'
  },
  {
    title: '提交申请',
    desc: '确认信息无误后提交申请'
  },
  {
    title: '等待审核',
    desc: '工作人员将在3-5个工作日内完成审核'
  },
  {
    title: '补贴发放',
    desc: '审核通过后，补贴将发放到您的账户'
  }
])

const notices = ref([
  '请确保上传的凭证清晰可见，包含完整的购买信息',
  '同一政策每人每年只能申请一次',
  '申请信息必须真实有效，如有虚假将取消申请资格',
  '补贴金额将在审核通过后7个工作日内发放',
  '如有疑问，请联系客服咨询'
])

// 申请弹窗
const showApplyModal = ref(false)
const selectedPolicy = ref<any>(null)
const submitting = ref(false)

const applyForm = ref({
  name: '',
  idCard: '',
  phone: '',
  images: [] as any[],
  remark: ''
})

// 帮助弹窗
const showHelpModal = ref(false)

// 方法
const goBack = () => {
  router.back()
}

const showHelp = () => {
  showHelpModal.value = true
}

const goToCertification = () => {
  message.info('跳转到实名认证页面')
  // router.push('/certification')
}

const goToSubsidyHelp = () => {
  router.push('/subsidy-help')
}

const viewPolicyDetail = (policy: any) => {
  message.info(`查看政策详情：${policy.title}`)
}

const applySubsidy = (policy: any) => {
  selectedPolicy.value = policy
  showApplyModal.value = true
}

const uploadImage = () => {
  // 模拟上传图片
  const colors = ['#FF6B35', '#00A8E8', '#43E97B', '#8338EC', '#FFBE0B']
  applyForm.value.images.push({
    id: Date.now(),
    color: colors[Math.floor(Math.random() * colors.length)]
  })
}

const removeImage = (index: number) => {
  applyForm.value.images.splice(index, 1)
}

const submitApplication = async () => {
  if (!applyForm.value.name || !applyForm.value.idCard || !applyForm.value.phone) {
    message.warning('请填写完整信息')
    return
  }

  if (applyForm.value.images.length === 0) {
    message.warning('请上传购买凭证')
    return
  }

  submitting.value = true
  
  // 模拟提交
  setTimeout(() => {
    submitting.value = false
    showApplyModal.value = false
    message.success('申请提交成功，请等待审核')
    
    // 更新政策状态
    if (selectedPolicy.value) {
      selectedPolicy.value.applied = true
      selectedPolicy.value.status = '已申请'
    }

    // 添加到我的申请
    myApplications.value.unshift({
      id: Date.now(),
      policyName: selectedPolicy.value.title,
      amount: selectedPolicy.value.amount,
      applyTime: new Date().toLocaleString('zh-CN'),
      approveTime: '',
      status: 'pending',
      statusText: '审核中',
      statusClass: 'status-pending'
    })

    // 更新统计
    subsidyStats.value.count++
    subsidyStats.value.pending++

    // 更新 badge
    tabs.value[1].badge = subsidyStats.value.pending

    // 重置表单
    applyForm.value = {
      name: '',
      idCard: '',
      phone: '',
      images: [],
      remark: ''
    }
  }, 1500)
}

const viewApplicationDetail = (application: any) => {
  message.info(`查看申请详情：${application.policyName}`)
}

const viewCertificate = (application: any) => {
  message.success('查看补贴凭证')
}
</script>

<style scoped>
.gov-subsidy-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 20px;
}

/* 顶部导航 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-nav .title {
  font-size: 18px;
  font-weight: 600;
}

.top-nav .anticon {
  font-size: 20px;
  cursor: pointer;
}

/* 认证状态卡片 */
.auth-status-card {
  margin: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.status-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  font-size: 32px;
  color: #52C41A;
}

.auth-status-card.not-certified .status-icon {
  color: #FAAD14;
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.status-desc {
  font-size: 12px;
  color: #999;
}

.check-icon {
  font-size: 24px;
  color: #52C41A;
}

/* 补贴统计 */
.subsidy-stats {
  margin: 0 16px 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #FF6B35;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #E8E8E8;
}

/* 好友助力入口 */
.help-entry {
  margin: 0 16px 16px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  .help-icon {
    font-size: 40px;
    margin-right: 12px;
  }

  .help-content {
    flex: 1;

    .help-title {
      font-size: 16px;
      font-weight: 600;
      color: white;
      margin-bottom: 4px;
    }

    .help-desc {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .help-arrow {
    color: white;
    font-size: 16px;
  }
}

/* Tab 切换 */
.tabs {
  display: flex;
  background: white;
  margin: 0 16px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-item {
  flex: 1;
  padding: 14px;
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #FF6B35;
  font-weight: 600;
  background: linear-gradient(to bottom, #FFF5F0 0%, white 100%);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #FF6B35;
  border-radius: 2px 2px 0 0;
}

.tab-badge {
  margin-left: 4px;
}

/* 内容区域 */
.content-section {
  padding: 0 16px;
}

/* 政策卡片 */
.policy-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s;
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
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.policy-status {
  font-size: 12px;
  color: #999;
}

.policy-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.policy-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.policy-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.policy-amount {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.amount-label {
  font-size: 12px;
  color: #999;
}

.amount-value {
  font-size: 20px;
  font-weight: 600;
  color: #FF6B35;
}

.policy-time {
  font-size: 12px;
  color: #999;
}

.policy-conditions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #F5F5F5;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
}

.condition-icon {
  color: #FF6B35;
}

.apply-btn {
  margin-top: 8px;
}

/* 申请卡片 */
.application-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  font-weight: 500;
}

.status-pending {
  background: #FFF7E6;
  color: #FAAD14;
}

.status-approved {
  background: #F6FFED;
  color: #52C41A;
}

.status-rejected {
  background: #FFF1F0;
  color: #FF4D4F;
}

.application-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.info-label {
  color: #999;
  min-width: 80px;
}

.info-value {
  color: #333;
}

.application-progress {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.progress-text {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  display: block;
}

.application-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
  display: flex;
  justify-content: flex-end;
}

/* 指南区域 */
.guide-section {
  padding-bottom: 20px;
}

.guide-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.guide-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.guide-title .anticon {
  color: #FF6B35;
  font-size: 20px;
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
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.guide-notices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF6B35;
  margin-top: 6px;
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
  align-items: center;
  font-size: 14px;
}

.contact-label {
  color: #999;
  min-width: 80px;
}

.contact-value {
  color: #333;
  font-weight: 500;
}

/* 申请弹窗 */
.apply-modal-content {
  padding: 8px 0;
}

.modal-policy-info {
  padding: 16px;
  background: linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%);
  border-radius: 8px;
  margin-bottom: 20px;
}

.modal-policy-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.modal-policy-amount {
  font-size: 14px;
  color: #FF6B35;
  font-weight: 500;
}

.upload-area {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.upload-item {
  position: relative;
  width: 80px;
  height: 80px;
}

.upload-preview {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.remove-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 20px;
  color: #FF4D4F;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #D9D9D9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: #999;
  font-size: 12px;
  transition: all 0.3s;
}

.upload-btn:hover {
  border-color: #FF6B35;
  color: #FF6B35;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions button {
  flex: 1;
}

/* 帮助内容 */
.help-content {
  padding: 8px 0;
}

.help-section {
  margin-bottom: 20px;
}

.help-question {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.help-answer {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}
</style>

