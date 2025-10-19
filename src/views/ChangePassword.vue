<template>
  <div class="change-password-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <LeftOutlined />
      </div>
      <div class="page-title">修改密码</div>
      <div class="placeholder"></div>
    </div>

    <!-- 表单区域 -->
    <div class="form-container">
      <div class="form-header">
        <LockOutlined class="header-icon" />
        <div class="header-text">
          <div class="header-title">修改登录密码</div>
          <div class="header-desc">为了您的账号安全,请定期修改密码</div>
        </div>
      </div>

      <div class="form-content">
        <!-- 旧密码 -->
        <div class="form-item">
          <div class="form-label">
            <span>旧密码</span>
            <span class="required">*</span>
          </div>
          <a-input-password
            v-model:value="form.oldPassword"
            placeholder="请输入旧密码"
            size="large"
            @input="validateOldPassword"
            @blur="validateOldPassword"
          />
          <div v-if="errors.oldPassword" class="error-text">{{ errors.oldPassword }}</div>
        </div>

        <!-- 新密码 -->
        <div class="form-item">
          <div class="form-label">
            <span>新密码</span>
            <span class="required">*</span>
          </div>
          <a-input-password
            v-model:value="form.newPassword"
            placeholder="请输入新密码"
            size="large"
            @input="validateNewPassword"
            @blur="validateNewPassword"
          />
          <div v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</div>
          
          <!-- 密码强度指示器 -->
          <div v-if="form.newPassword" class="password-strength">
            <div class="strength-label">密码强度:</div>
            <div class="strength-bars">
              <div 
                v-for="i in 3" 
                :key="i"
                class="strength-bar"
                :class="{
                  weak: passwordStrength >= 1 && i === 1,
                  medium: passwordStrength >= 2 && i <= 2,
                  strong: passwordStrength >= 3 && i <= 3
                }"
              ></div>
            </div>
            <div class="strength-text" :class="strengthClass">
              {{ strengthText }}
            </div>
          </div>

          <!-- 密码要求提示 -->
          <div class="password-tips">
            <div class="tip-title">密码要求:</div>
            <div class="tip-item" :class="{ valid: hasMinLength }">
              <CheckCircleFilled v-if="hasMinLength" />
              <CloseCircleFilled v-else />
              <span>至少8个字符</span>
            </div>
            <div class="tip-item" :class="{ valid: hasLetterAndNumber }">
              <CheckCircleFilled v-if="hasLetterAndNumber" />
              <CloseCircleFilled v-else />
              <span>包含字母和数字</span>
            </div>
            <div class="tip-item" :class="{ valid: hasSpecialChar }">
              <CheckCircleFilled v-if="hasSpecialChar" />
              <CloseCircleFilled v-else />
              <span>包含特殊字符(可选,提升强度)</span>
            </div>
          </div>
        </div>

        <!-- 确认新密码 -->
        <div class="form-item">
          <div class="form-label">
            <span>确认新密码</span>
            <span class="required">*</span>
          </div>
          <a-input-password
            v-model:value="form.confirmPassword"
            placeholder="请再次输入新密码"
            size="large"
            @input="validateConfirmPassword"
            @blur="validateConfirmPassword"
          />
          <div v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</div>
          <div v-if="!errors.confirmPassword && form.confirmPassword && form.confirmPassword === form.newPassword" class="success-text">
            <CheckCircleFilled /> 两次密码输入一致
          </div>
        </div>
      </div>

      <!-- 安全提示 -->
      <div class="security-tips">
        <div class="tips-header">
          <SafetyCertificateOutlined />
          <span>安全提示</span>
        </div>
        <div class="tips-list">
          <div class="tips-item">• 密码长度建议8-20位,包含字母、数字和特殊字符</div>
          <div class="tips-item">• 不要使用过于简单的密码,如123456、生日等</div>
          <div class="tips-item">• 不要与其他网站使用相同密码</div>
          <div class="tips-item">• 建议定期更换密码,保护账号安全</div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <a-button 
          type="primary" 
          size="large" 
          block 
          @click="submitChange"
          :disabled="!canSubmit"
          :loading="submitting"
        >
          确认修改
        </a-button>
      </div>
    </div>

    <!-- 成功弹窗 -->
    <a-modal
      v-model:open="successModalVisible"
      :footer="null"
      :closable="false"
      centered
      width="320px"
    >
      <div class="success-modal">
        <div class="success-icon">
          <CheckCircleFilled />
        </div>
        <div class="success-title">密码修改成功!</div>
        <div class="success-desc">您的密码已更新,请妥善保管</div>
        <a-button type="primary" size="large" block @click="goToAccountSettings">
          返回账号设置
        </a-button>
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
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  SafetyCertificateOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 表单数据
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 错误信息
const errors = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 提交状态
const submitting = ref(false)

// 成功弹窗
const successModalVisible = ref(false)

// 验证旧密码
const validateOldPassword = () => {
  errors.value.oldPassword = ''
  
  if (!form.value.oldPassword) {
    errors.value.oldPassword = '请输入旧密码'
    return false
  }
  
  if (form.value.oldPassword.length < 6) {
    errors.value.oldPassword = '密码长度不能少于6位'
    return false
  }
  
  return true
}

// 验证新密码
const validateNewPassword = () => {
  errors.value.newPassword = ''
  
  if (!form.value.newPassword) {
    errors.value.newPassword = '请输入新密码'
    return false
  }
  
  if (form.value.newPassword.length < 8) {
    errors.value.newPassword = '密码长度不能少于8位'
    return false
  }
  
  if (form.value.newPassword.length > 20) {
    errors.value.newPassword = '密码长度不能超过20位'
    return false
  }
  
  if (!/[a-zA-Z]/.test(form.value.newPassword) || !/\d/.test(form.value.newPassword)) {
    errors.value.newPassword = '密码必须包含字母和数字'
    return false
  }
  
  if (form.value.oldPassword && form.value.newPassword === form.value.oldPassword) {
    errors.value.newPassword = '新密码不能与旧密码相同'
    return false
  }
  
  // 如果确认密码已输入,重新验证
  if (form.value.confirmPassword) {
    validateConfirmPassword()
  }
  
  return true
}

// 验证确认密码
const validateConfirmPassword = () => {
  errors.value.confirmPassword = ''
  
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = '请再次输入新密码'
    return false
  }
  
  if (form.value.confirmPassword !== form.value.newPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致'
    return false
  }
  
  return true
}

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = form.value.newPassword
  if (!pwd) return 0
  
  let strength = 0
  
  // 长度
  if (pwd.length >= 8) strength++
  
  // 包含字母和数字
  if (/[a-zA-Z]/.test(pwd) && /\d/.test(pwd)) strength++
  
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++
  
  return strength
})

// 密码强度文本
const strengthText = computed(() => {
  switch (passwordStrength.value) {
    case 1:
      return '弱'
    case 2:
      return '中'
    case 3:
      return '强'
    default:
      return ''
  }
})

// 密码强度样式类
const strengthClass = computed(() => {
  switch (passwordStrength.value) {
    case 1:
      return 'weak'
    case 2:
      return 'medium'
    case 3:
      return 'strong'
    default:
      return ''
  }
})

// 密码要求检查
const hasMinLength = computed(() => form.value.newPassword.length >= 8)
const hasLetterAndNumber = computed(() => /[a-zA-Z]/.test(form.value.newPassword) && /\d/.test(form.value.newPassword))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.value.newPassword))

// 是否可以提交
const canSubmit = computed(() => {
  return form.value.oldPassword &&
         form.value.newPassword &&
         form.value.confirmPassword &&
         !errors.value.oldPassword &&
         !errors.value.newPassword &&
         !errors.value.confirmPassword &&
         form.value.newPassword === form.value.confirmPassword &&
         hasMinLength.value &&
         hasLetterAndNumber.value
})

// 提交修改
const submitChange = async () => {
  // 验证所有字段
  const isOldPasswordValid = validateOldPassword()
  const isNewPasswordValid = validateNewPassword()
  const isConfirmPasswordValid = validateConfirmPassword()
  
  if (!isOldPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
    message.warning('请检查表单填写是否正确')
    return
  }
  
  // 模拟验证旧密码
  if (form.value.oldPassword !== '123456') {
    errors.value.oldPassword = '旧密码错误,请重新输入'
    return
  }
  
  submitting.value = true
  
  // 模拟API请求
  setTimeout(() => {
    submitting.value = false
    successModalVisible.value = true
    message.success('密码修改成功!')
  }, 1500)
}

// 返回账号设置
const goToAccountSettings = () => {
  router.push('/account-settings')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.change-password-page {
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

/* 表单容器 */
.form-container {
  background: #fff;
  padding: 24px 16px;
  margin-top: 12px;
}

.form-header {
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

/* 表单内容 */
.form-content {
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ff4d4f;
}

.error-text {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.success-text {
  font-size: 12px;
  color: #52c41a;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 密码强度 */
.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.strength-label {
  font-size: 12px;
  color: #666;
}

.strength-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

.strength-bar {
  height: 4px;
  flex: 1;
  background: #d9d9d9;
  border-radius: 2px;
  transition: all 0.3s;
}

.strength-bar.weak {
  background: #ff4d4f;
}

.strength-bar.medium {
  background: #faad14;
}

.strength-bar.strong {
  background: #52c41a;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
  min-width: 24px;
}

.strength-text.weak {
  color: #ff4d4f;
}

.strength-text.medium {
  color: #faad14;
}

.strength-text.strong {
  color: #52c41a;
}

/* 密码要求提示 */
.password-tips {
  margin-top: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.tip-title {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item .anticon {
  font-size: 14px;
}

.tip-item.valid {
  color: #52c41a;
}

.tip-item:not(.valid) .anticon {
  color: #d9d9d9;
}

/* 安全提示 */
.security-tips {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #ad6800;
  margin-bottom: 12px;
}

.tips-header .anticon {
  font-size: 16px;
}

.tips-list {
  font-size: 13px;
  color: #ad6800;
}

.tips-item {
  margin-bottom: 6px;
  line-height: 1.6;
}

.tips-item:last-child {
  margin-bottom: 0;
}

/* 操作按钮 */
.form-actions {
  margin-top: 32px;
}

/* 成功弹窗 */
.success-modal {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 16px;
}

.success-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.success-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}
</style>

