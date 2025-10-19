<template>
  <div class="change-phone-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <LeftOutlined />
      </div>
      <div class="page-title">更换手机号</div>
      <div class="placeholder"></div>
    </div>

    <!-- 步骤指示器 -->
    <div class="steps-container">
      <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <div class="step-circle">
          <CheckOutlined v-if="currentStep > 1" />
          <span v-else>1</span>
        </div>
        <div class="step-label">验证当前手机</div>
      </div>
      <div class="step-line" :class="{ active: currentStep > 1 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <div class="step-circle">
          <CheckOutlined v-if="currentStep > 2" />
          <span v-else>2</span>
        </div>
        <div class="step-label">绑定新手机</div>
      </div>
      <div class="step-line" :class="{ active: currentStep > 2 }"></div>
      <div class="step-item" :class="{ active: currentStep >= 3 }">
        <div class="step-circle">
          <CheckOutlined v-if="currentStep > 3" />
          <span v-else>3</span>
        </div>
        <div class="step-label">完成</div>
      </div>
    </div>

    <!-- 步骤1: 验证当前手机号 -->
    <div v-if="currentStep === 1" class="step-content">
      <div class="step-header">
        <MobileOutlined class="header-icon" />
        <div class="header-text">
          <div class="header-title">验证当前手机号</div>
          <div class="header-desc">为了您的账号安全,请先验证当前手机号</div>
        </div>
      </div>

      <div class="form-container">
        <div class="form-item">
          <div class="form-label">当前手机号</div>
          <div class="phone-display">{{ maskedCurrentPhone }}</div>
        </div>

        <div class="form-item">
          <div class="form-label">验证码</div>
          <div class="code-input-group">
            <a-input
              v-model:value="step1Form.code"
              placeholder="请输入6位验证码"
              size="large"
              maxlength="6"
              @input="validateStep1Code"
            />
            <a-button
              type="primary"
              size="large"
              :disabled="step1Countdown > 0"
              @click="sendStep1Code"
            >
              {{ step1Countdown > 0 ? `${step1Countdown}秒后重试` : '发送验证码' }}
            </a-button>
          </div>
          <div v-if="step1CodeError" class="error-text">{{ step1CodeError }}</div>
        </div>

        <div class="tips-box">
          <ExclamationCircleOutlined />
          <span>验证码已发送至您的手机,请注意查收</span>
        </div>
      </div>

      <div class="step-actions">
        <a-button type="primary" size="large" block @click="nextToStep2" :disabled="!canGoStep2">
          下一步
        </a-button>
      </div>
    </div>

    <!-- 步骤2: 绑定新手机号 -->
    <div v-if="currentStep === 2" class="step-content">
      <div class="step-header">
        <MobileOutlined class="header-icon" />
        <div class="header-text">
          <div class="header-title">绑定新手机号</div>
          <div class="header-desc">请输入您的新手机号并验证</div>
        </div>
      </div>

      <div class="form-container">
        <div class="form-item">
          <div class="form-label">新手机号</div>
          <a-input
            v-model:value="step2Form.phone"
            placeholder="请输入新手机号"
            size="large"
            maxlength="11"
            @input="validateStep2Phone"
          />
          <div v-if="step2PhoneError" class="error-text">{{ step2PhoneError }}</div>
        </div>

        <div class="form-item">
          <div class="form-label">验证码</div>
          <div class="code-input-group">
            <a-input
              v-model:value="step2Form.code"
              placeholder="请输入6位验证码"
              size="large"
              maxlength="6"
              :disabled="!isStep2PhoneValid"
              @input="validateStep2Code"
            />
            <a-button
              type="primary"
              size="large"
              :disabled="step2Countdown > 0 || !isStep2PhoneValid"
              @click="sendStep2Code"
            >
              {{ step2Countdown > 0 ? `${step2Countdown}秒后重试` : '发送验证码' }}
            </a-button>
          </div>
          <div v-if="step2CodeError" class="error-text">{{ step2CodeError }}</div>
        </div>

        <div class="tips-box">
          <ExclamationCircleOutlined />
          <span>请确保新手机号可以正常接收短信</span>
        </div>
      </div>

      <div class="step-actions">
        <a-button size="large" block @click="backToStep1" style="margin-bottom: 12px;">
          上一步
        </a-button>
        <a-button type="primary" size="large" block @click="submitChange" :disabled="!canSubmit" :loading="submitting">
          确认更换
        </a-button>
      </div>
    </div>

    <!-- 步骤3: 完成 -->
    <div v-if="currentStep === 3" class="step-content success-content">
      <div class="success-icon">
        <CheckCircleFilled />
      </div>
      <div class="success-title">手机号更换成功!</div>
      <div class="success-desc">您的新手机号为: {{ maskedNewPhone }}</div>
      
      <div class="success-tips">
        <div class="tip-item">
          <SafetyCertificateOutlined />
          <span>请妥善保管您的手机号,避免账号被盗</span>
        </div>
        <div class="tip-item">
          <BellOutlined />
          <span>重要通知将发送到您的新手机号</span>
        </div>
      </div>

      <div class="step-actions">
        <a-button type="primary" size="large" block @click="goToAccountSettings">
          返回账号设置
        </a-button>
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
  MobileOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  BellOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 当前步骤
const currentStep = ref(1)

// 当前手机号(模拟数据)
const currentPhone = ref('13800138000')

// 步骤1表单
const step1Form = ref({
  code: ''
})
const step1Countdown = ref(0)
const step1CodeError = ref('')

// 步骤2表单
const step2Form = ref({
  phone: '',
  code: ''
})
const step2Countdown = ref(0)
const step2PhoneError = ref('')
const step2CodeError = ref('')
const submitting = ref(false)

// 脱敏显示当前手机号
const maskedCurrentPhone = computed(() => {
  return currentPhone.value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

// 脱敏显示新手机号
const maskedNewPhone = computed(() => {
  return step2Form.value.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

// 验证步骤1验证码
const validateStep1Code = () => {
  step1CodeError.value = ''
  if (step1Form.value.code && !/^\d{6}$/.test(step1Form.value.code)) {
    step1CodeError.value = '请输入6位数字验证码'
  }
}

// 验证步骤2手机号
const validateStep2Phone = () => {
  step2PhoneError.value = ''
  const phone = step2Form.value.phone
  
  if (!phone) {
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    step2PhoneError.value = '请输入正确的手机号码'
    return
  }
  
  if (phone === currentPhone.value) {
    step2PhoneError.value = '新手机号不能与当前手机号相同'
    return
  }
}

// 验证步骤2验证码
const validateStep2Code = () => {
  step2CodeError.value = ''
  if (step2Form.value.code && !/^\d{6}$/.test(step2Form.value.code)) {
    step2CodeError.value = '请输入6位数字验证码'
  }
}

// 是否可以进入步骤2
const canGoStep2 = computed(() => {
  return step1Form.value.code.length === 6 && !step1CodeError.value
})

// 步骤2手机号是否有效
const isStep2PhoneValid = computed(() => {
  const phone = step2Form.value.phone
  return /^1[3-9]\d{9}$/.test(phone) && phone !== currentPhone.value && !step2PhoneError.value
})

// 是否可以提交
const canSubmit = computed(() => {
  return isStep2PhoneValid.value && 
         step2Form.value.code.length === 6 && 
         !step2CodeError.value
})

// 发送步骤1验证码
const sendStep1Code = () => {
  if (step1Countdown.value > 0) return
  
  message.success(`验证码已发送至 ${maskedCurrentPhone.value}`)
  
  // 开始倒计时
  step1Countdown.value = 60
  const timer = setInterval(() => {
    step1Countdown.value--
    if (step1Countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 发送步骤2验证码
const sendStep2Code = () => {
  if (step2Countdown.value > 0 || !isStep2PhoneValid.value) return
  
  message.success(`验证码已发送至 ${step2Form.value.phone}`)
  
  // 开始倒计时
  step2Countdown.value = 60
  const timer = setInterval(() => {
    step2Countdown.value--
    if (step2Countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 进入步骤2
const nextToStep2 = () => {
  if (!canGoStep2.value) {
    message.warning('请先完成验证码验证')
    return
  }
  
  // 模拟验证
  if (step1Form.value.code !== '123456') {
    step1CodeError.value = '验证码错误,请重新输入'
    return
  }
  
  currentStep.value = 2
}

// 返回步骤1
const backToStep1 = () => {
  currentStep.value = 1
}

// 提交更换
const submitChange = async () => {
  if (!canSubmit.value) {
    message.warning('请完成所有验证')
    return
  }
  
  // 模拟验证
  if (step2Form.value.code !== '123456') {
    step2CodeError.value = '验证码错误,请重新输入'
    return
  }
  
  submitting.value = true
  
  // 模拟API请求
  setTimeout(() => {
    submitting.value = false
    currentStep.value = 3
    message.success('手机号更换成功!')
  }, 1500)
}

// 返回账号设置
const goToAccountSettings = () => {
  router.push('/account-settings')
}

// 返回上一页
const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.back()
  }
}
</script>

<style scoped>
.change-phone-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-btn {
  font-size: 18px;
  cursor: pointer;
  color: #333;
  padding: 4px;
}

.page-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.placeholder {
  width: 26px;
}

/* 步骤指示器 */
.steps-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background: #fff;
  margin-bottom: 12px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #999;
  background: #fff;
  transition: all 0.3s;
}

.step-item.active .step-circle {
  border-color: #FF6B35;
  color: #FF6B35;
  background: #fff5f0;
}

.step-item.completed .step-circle {
  border-color: #52c41a;
  background: #52c41a;
  color: #fff;
}

.step-label {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}

.step-item.active .step-label {
  color: #FF6B35;
  font-weight: 500;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #d9d9d9;
  margin: 0 8px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.step-line.active {
  background: #52c41a;
}

/* 步骤内容 */
.step-content {
  background: #fff;
  padding: 24px 16px;
  margin-bottom: 12px;
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.header-icon {
  font-size: 24px;
  color: #FF6B35;
  margin-top: 2px;
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.header-desc {
  font-size: 14px;
  color: #666;
}

/* 表单 */
.form-container {
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.phone-display {
  font-size: 18px;
  color: #333;
  font-weight: 500;
  padding: 12px 0;
  letter-spacing: 1px;
}

.code-input-group {
  display: flex;
  gap: 12px;
}

.code-input-group :deep(.ant-input) {
  flex: 1;
}

.code-input-group :deep(.ant-btn) {
  flex-shrink: 0;
  min-width: 120px;
}

.error-text {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
}

.tips-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  font-size: 13px;
  color: #ad6800;
}

.tips-box .anticon {
  font-size: 16px;
}

/* 操作按钮 */
.step-actions {
  margin-top: 32px;
}

/* 成功页面 */
.success-content {
  text-align: center;
  padding: 40px 16px;
}

.success-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 16px;
}

.success-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.success-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 32px;
}

.success-tips {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
  text-align: left;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #52c41a;
  margin-bottom: 12px;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item .anticon {
  font-size: 16px;
}
</style>

