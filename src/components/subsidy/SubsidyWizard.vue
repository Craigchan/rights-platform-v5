<template>
  <a-modal
    v-model:open="visible"
    :title="null"
    :footer="null"
    :width="'90%'"
    :closable="false"
    class="subsidy-wizard-modal"
  >
    <div class="subsidy-wizard">
      <!-- 步骤指示器 -->
      <div class="steps-indicator">
        <div 
          v-for="i in 4" 
          :key="i"
          class="step-dot"
          :class="{ active: currentStep >= i, completed: currentStep > i }"
        ></div>
      </div>

      <!-- 步骤1: 欢迎 -->
      <div v-if="currentStep === 1" class="wizard-step step-welcome">
        <div class="step-icon">👋</div>
        <h2 class="step-title">申请政府补贴</h2>
        <p class="step-desc">只需3步,即可获得¥{{ subsidyAmount }}补贴资格</p>
        
        <div class="subsidy-info">
          <div class="info-item">
            <CheckCircleOutlined class="info-icon" />
            <span>政府官方补贴</span>
          </div>
          <div class="info-item">
            <CheckCircleOutlined class="info-icon" />
            <span>真金白银到账</span>
          </div>
          <div class="info-item">
            <CheckCircleOutlined class="info-icon" />
            <span>简单快捷申请</span>
          </div>
        </div>

        <button class="wizard-btn primary" @click="nextStep">开始申请</button>
        <button class="wizard-btn secondary" @click="closeWizard">暂不申请</button>
      </div>

      <!-- 步骤2: 选择类型 -->
      <div v-else-if="currentStep === 2" class="wizard-step step-select">
        <div class="step-icon">📝</div>
        <h2 class="step-title">第1步:选择补贴类型</h2>
        <p class="step-desc">请选择您要申请的补贴项目</p>

        <div class="subsidy-types">
          <div 
            v-for="type in subsidyTypes" 
            :key="type.id"
            class="type-card"
            :class="{ selected: selectedType === type.id }"
            @click="selectedType = type.id"
          >
            <div class="type-icon">{{ type.icon }}</div>
            <div class="type-name">{{ type.name }}</div>
            <div class="type-amount">最高¥{{ type.amount }}</div>
            <div class="type-condition">{{ type.condition }}</div>
          </div>
        </div>

        <button 
          class="wizard-btn primary" 
          :disabled="!selectedType"
          @click="createApplication"
        >
          下一步
        </button>
        <button class="wizard-btn secondary" @click="prevStep">上一步</button>
      </div>

      <!-- 步骤3: 邀请好友 -->
      <div v-else-if="currentStep === 3" class="wizard-step step-invite">
        <div class="step-icon">👥</div>
        <h2 class="step-title">第2步:邀请好友助力</h2>
        <p class="step-desc">分享给{{ requiredHelpers }}位好友,达标即可领取补贴</p>

        <div class="progress-section">
          <div class="progress-circle">
            <div class="circle-text">
              <div class="current">{{ helpersCount }}</div>
              <div class="total">/{{ requiredHelpers }}</div>
            </div>
          </div>
          <div class="progress-tip">
            还需{{ requiredHelpers - helpersCount }}位好友助力
          </div>
        </div>

        <div class="share-poster">
          <div class="poster-content">
            <h3>帮我助力领取政府补贴</h3>
            <div class="poster-amount">¥{{ subsidyAmount }}</div>
            <div class="poster-qr">
              <!-- 二维码占位 -->
              <div class="qr-placeholder">二维码</div>
            </div>
          </div>
        </div>

        <button class="wizard-btn primary" @click="shareToFriends">
          <ShareAltOutlined />
          一键分享
        </button>
        <button class="wizard-btn secondary" @click="shareLater">稍后分享</button>
      </div>

      <!-- 步骤4: 完成 -->
      <div v-else-if="currentStep === 4" class="wizard-step step-complete">
        <div class="step-icon success">🎉</div>
        <h2 class="step-title">申请已创建!</h2>
        <p class="step-desc">
          好友助力后,您会收到通知<br/>
          可以在"我的申请"中查看进度
        </p>

        <div class="complete-actions">
          <button class="wizard-btn primary" @click="viewApplication">
            查看申请
          </button>
          <button class="wizard-btn secondary" @click="closeWizard">
            知道了
          </button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircleOutlined, ShareAltOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'complete'])

const router = useRouter()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentStep = ref(1)
const selectedType = ref<number | null>(null)
const subsidyAmount = ref(2000)
const requiredHelpers = ref(5)
const helpersCount = ref(0)

const subsidyTypes = [
  {
    id: 1,
    icon: '📱',
    name: '家电换"智"',
    amount: 2000,
    condition: '购买智能家电'
  },
  {
    id: 2,
    icon: '🚗',
    name: '汽车换"能"',
    amount: 5000,
    condition: '购买新能源汽车'
  },
  {
    id: 3,
    icon: '🏠',
    name: '家装焕"新"',
    amount: 3000,
    condition: '厨卫装修改造'
  }
]

const nextStep = () => {
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const createApplication = () => {
  if (!selectedType.value) {
    message.error('请选择补贴类型')
    return
  }
  
  const selected = subsidyTypes.find(t => t.id === selectedType.value)
  if (selected) {
    subsidyAmount.value = selected.amount
  }
  
  // TODO: 调用API创建申请
  message.success('申请创建成功')
  nextStep()
}

const shareToFriends = () => {
  // TODO: 调用分享功能
  message.success('分享成功')
  nextStep()
}

const shareLater = () => {
  nextStep()
}

const viewApplication = () => {
  emit('complete')
  closeWizard()
  router.push('/subsidy-applications')
}

const closeWizard = () => {
  visible.value = false
  currentStep.value = 1
  selectedType.value = null
}
</script>

<style scoped>
.subsidy-wizard {
  padding: 20px;
}

.steps-indicator {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e8e8e8;
  transition: all 0.3s;
}

.step-dot.active {
  background: #FF6B35;
  width: 24px;
  border-radius: 4px;
}

.step-dot.completed {
  background: #52c41a;
}

.wizard-step {
  text-align: center;
}

.step-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.step-icon.success {
  animation: bounce 0.6s;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.step-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px;
}

.step-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px;
  line-height: 1.6;
}

.subsidy-info {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #333;
}

.info-icon {
  color: #52c41a;
  font-size: 18px;
}

.subsidy-types {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.type-card {
  background: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.type-card.selected {
  border-color: #FF6B35;
  background: #fff5f0;
}

.type-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.type-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.type-amount {
  font-size: 20px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 4px;
}

.type-condition {
  font-size: 13px;
  color: #999;
}

.progress-section {
  margin-bottom: 24px;
}

.progress-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 8px solid #FF6B35;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-text {
  text-align: center;
}

.current {
  font-size: 36px;
  font-weight: bold;
  color: #FF6B35;
}

.total {
  font-size: 18px;
  color: #999;
}

.progress-tip {
  font-size: 14px;
  color: #666;
}

.share-poster {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
}

.poster-content h3 {
  font-size: 18px;
  margin: 0 0 12px;
}

.poster-amount {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
}

.qr-placeholder {
  width: 120px;
  height: 120px;
  background: white;
  margin: 0 auto;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.wizard-btn {
  width: 100%;
  padding: 14px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  margin-bottom: 12px;
}

.wizard-btn.primary {
  background: #FF6B35;
  color: white;
}

.wizard-btn.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.wizard-btn.secondary {
  background: white;
  color: #666;
  border: 1px solid #e8e8e8;
}

.wizard-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.complete-actions {
  margin-top: 32px;
}
</style>

