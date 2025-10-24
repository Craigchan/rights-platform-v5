<template>
  <div class="real-name-auth-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <LeftOutlined @click="goBack" />
      <span class="title">实名认证</span>
      <span class="placeholder"></span>
    </div>

    <!-- 认证步骤指示器 -->
    <div class="steps-container">
      <a-steps :current="currentStep" size="small">
        <a-step title="填写信息" />
        <a-step title="上传证件" />
        <a-step title="人脸识别" />
        <a-step title="完成认证" />
      </a-steps>
    </div>

    <!-- 步骤1: 填写信息 -->
    <div v-if="currentStep === 0" class="step-content">
      <div class="step-title">
        <SafetyCertificateOutlined />
        <span>请填写您的真实信息</span>
      </div>
      
      <a-form :model="formData" layout="vertical" class="auth-form">
        <a-form-item label="真实姓名" required>
          <a-input 
            v-model:value="formData.realName" 
            placeholder="请输入真实姓名"
            size="large"
          />
        </a-form-item>

        <a-form-item label="身份证号码" required>
          <a-input 
            v-model:value="formData.idCard" 
            placeholder="请输入18位身份证号码"
            size="large"
            maxlength="18"
          />
        </a-form-item>

        <a-form-item label="手机号码" required>
          <a-input 
            v-model:value="formData.phone" 
            placeholder="请输入手机号码"
            size="large"
            maxlength="11"
          />
        </a-form-item>

        <a-form-item label="验证码" required>
          <div class="code-input-group">
            <a-input 
              v-model:value="formData.verifyCode" 
              placeholder="请输入验证码"
              size="large"
              maxlength="6"
            />
            <a-button 
              type="primary" 
              :disabled="countdown > 0"
              @click="sendVerifyCode"
            >
              {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>

      <div class="step-actions">
        <a-button type="primary" size="large" block @click="nextStep">
          下一步
        </a-button>
      </div>

      <div class="auth-tips">
        <ExclamationCircleOutlined />
        <span>请确保填写信息真实有效，认证后不可修改</span>
      </div>
    </div>

    <!-- 步骤2: 上传证件 -->
    <div v-if="currentStep === 1" class="step-content">
      <div class="step-title">
        <IdcardOutlined />
        <span>请上传身份证照片</span>
      </div>

      <div class="upload-section">
        <div class="upload-card">
          <div class="upload-title">身份证人像面</div>
          <div 
            class="upload-area"
            :class="{ uploaded: idCardFront }"
            @click="uploadIdCardFront"
          >
            <div v-if="!idCardFront" class="upload-placeholder">
              <PlusOutlined />
              <div>点击上传</div>
            </div>
            <div v-else class="upload-preview" :style="{ background: idCardFront }">
              <CheckCircleFilled class="check-icon" />
            </div>
          </div>
          <div class="upload-tips">请上传身份证正面照片</div>
        </div>

        <div class="upload-card">
          <div class="upload-title">身份证国徽面</div>
          <div 
            class="upload-area"
            :class="{ uploaded: idCardBack }"
            @click="uploadIdCardBack"
          >
            <div v-if="!idCardBack" class="upload-placeholder">
              <PlusOutlined />
              <div>点击上传</div>
            </div>
            <div v-else class="upload-preview" :style="{ background: idCardBack }">
              <CheckCircleFilled class="check-icon" />
            </div>
          </div>
          <div class="upload-tips">请上传身份证背面照片</div>
        </div>
      </div>

      <div class="upload-requirements">
        <div class="requirement-title">拍摄要求：</div>
        <div class="requirement-item">
          <CheckOutlined />
          <span>确保证件边框完整，字迹清晰</span>
        </div>
        <div class="requirement-item">
          <CheckOutlined />
          <span>避免反光、模糊、遮挡</span>
        </div>
        <div class="requirement-item">
          <CheckOutlined />
          <span>支持JPG、PNG格式，大小不超过5MB</span>
        </div>
      </div>

      <div class="step-actions">
        <a-button size="large" @click="prevStep">上一步</a-button>
        <a-button type="primary" size="large" @click="nextStep">下一步</a-button>
      </div>
    </div>

    <!-- 步骤3: 人脸识别 -->
    <div v-if="currentStep === 2" class="step-content">
      <div class="step-title">
        <ScanOutlined />
        <span>人脸识别验证</span>
      </div>

      <div class="face-recognition-container">
        <div v-if="!faceRecognitionStarted" class="face-start">
          <div class="face-icon-wrapper">
            <UserOutlined class="face-icon" />
          </div>
          <div class="face-tips">
            <div class="tip-title">请确保：</div>
            <div class="tip-item">• 光线充足，面部清晰</div>
            <div class="tip-item">• 摘下眼镜、帽子等遮挡物</div>
            <div class="tip-item">• 保持正脸面对摄像头</div>
          </div>
          <a-button 
            type="primary" 
            size="large" 
            block
            @click="startFaceRecognition"
          >
            开始人脸识别
          </a-button>
        </div>

        <div v-else-if="faceRecognitionProcessing" class="face-processing">
          <div class="scanning-frame">
            <div class="scan-line"></div>
            <UserOutlined class="face-icon-large" />
          </div>
          <div class="processing-text">正在识别中...</div>
          <a-progress :percent="recognitionProgress" :show-info="false" />
        </div>

        <div v-else class="face-success">
          <CheckCircleFilled class="success-icon" />
          <div class="success-text">人脸识别成功</div>
          <div class="success-desc">与身份证照片匹配度: 98%</div>
        </div>
      </div>

      <div class="step-actions">
        <a-button size="large" @click="prevStep" :disabled="faceRecognitionProcessing">
          上一步
        </a-button>
        <a-button 
          type="primary" 
          size="large" 
          @click="nextStep"
          :disabled="!faceRecognitionSuccess"
        >
          下一步
        </a-button>
      </div>
    </div>

    <!-- 步骤4: 完成认证 -->
    <div v-if="currentStep === 3" class="step-content">
      <div class="auth-result">
        <div v-if="authSubmitting" class="submitting">
          <a-spin size="large" />
          <div class="submitting-text">正在提交认证信息...</div>
        </div>

        <div v-else-if="authSuccess" class="auth-success">
          <!-- 成功动画效果 -->
          <div class="success-animation">
            <div class="confetti"></div>
            <div class="confetti"></div>
            <div class="confetti"></div>
            <div class="confetti"></div>
            <div class="confetti"></div>
          </div>

          <!-- 认证徽章 -->
          <div class="auth-badge">
            <div class="badge-circle">
              <CheckCircleFilled class="result-icon success" />
            </div>
            <div class="badge-rays"></div>
          </div>

          <div class="result-title">认证成功</div>
          <div class="result-desc">恭喜您成为平台认证用户！</div>
          
          <!-- 认证证书卡片 -->
          <div class="certificate-card">
            <div class="certificate-header">
              <SafetyCertificateOutlined class="cert-icon" />
              <span class="cert-title">实名认证证书</span>
            </div>
            <div class="certificate-body">
              <div class="info-row">
                <span class="info-label">姓名</span>
                <span class="info-value">{{ formData.realName }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">身份证号</span>
                <span class="info-value">{{ maskIdCard(formData.idCard) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">手机号</span>
                <span class="info-value">{{ maskPhone(formData.phone) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">认证时间</span>
                <span class="info-value">{{ authTime }}</span>
              </div>
            </div>
            <div class="certificate-footer">
              <div class="cert-number">NO.{{ certNumber }}</div>
              <div class="cert-seal">官方认证</div>
            </div>
          </div>

          <!-- 专属权益 -->
          <div class="exclusive-benefits">
            <div class="benefits-header">
              <GiftOutlined class="gift-icon" />
              <span class="benefits-title">专属权益已解锁</span>
            </div>
            <div class="benefits-grid">
              <div class="benefit-card">
                <div class="benefit-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <GiftOutlined />
                </div>
                <div class="benefit-title">新人礼包</div>
                <div class="benefit-desc">200积分</div>
              </div>
              <div class="benefit-card">
                <div class="benefit-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                  <TagOutlined />
                </div>
                <div class="benefit-title">专属优惠</div>
                <div class="benefit-desc">5张优惠券</div>
              </div>
              <div class="benefit-card">
                <div class="benefit-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                  <TrophyOutlined />
                </div>
                <div class="benefit-title">会员等级</div>
                <div class="benefit-desc">黄金会员</div>
              </div>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="quick-actions">
            <div class="action-title">推荐操作</div>
            <div class="action-buttons">
              <div class="action-btn" @click="goToSubsidy">
                <div class="action-icon" style="background: #FF6B35;">
                  <DollarOutlined />
                </div>
                <div class="action-text">
                  <div class="action-name">申请补贴</div>
                  <div class="action-desc">最高1万元</div>
                </div>
                <RightOutlined class="action-arrow" />
              </div>
              <div class="action-btn" @click="goToCoupons">
                <div class="action-icon" style="background: #F7931E;">
                  <TagOutlined />
                </div>
                <div class="action-text">
                  <div class="action-name">领取消费券</div>
                  <div class="action-desc">多种优惠可选</div>
                </div>
                <RightOutlined class="action-arrow" />
              </div>
              <div class="action-btn" @click="goToLottery">
                <div class="action-icon" style="background: #52C41A;">
                  <GiftOutlined />
                </div>
                <div class="action-text">
                  <div class="action-name">参与抽奖</div>
                  <div class="action-desc">100%中奖</div>
                </div>
                <RightOutlined class="action-arrow" />
              </div>
            </div>
          </div>

          <a-button type="primary" size="large" block @click="goToHome" class="home-btn">
            完成
          </a-button>
        </div>
      </div>
    </div>

    <!-- 认证记录入口 -->
    <div v-if="currentStep === 0" class="auth-record-entry" @click="showAuthRecord">
      <HistoryOutlined />
      <span>查看认证记录</span>
      <RightOutlined />
    </div>

    <!-- 认证记录弹窗 -->
    <a-modal
      v-model:open="authRecordVisible"
      title="认证记录"
      :footer="null"
      width="90%"
    >
      <div class="auth-record-list">
        <div 
          v-for="record in authRecords" 
          :key="record.id"
          class="record-item"
        >
          <div class="record-header">
            <div class="record-status" :class="record.status">
              {{ record.statusText }}
            </div>
            <div class="record-time">{{ record.time }}</div>
          </div>
          <div class="record-content">
            <div class="record-row">
              <span class="record-label">姓名：</span>
              <span class="record-value">{{ record.name }}</span>
            </div>
            <div class="record-row">
              <span class="record-label">身份证号：</span>
              <span class="record-value">{{ maskIdCard(record.idCard) }}</span>
            </div>
            <div class="record-row">
              <span class="record-label">手机号：</span>
              <span class="record-value">{{ maskPhone(record.phone) }}</span>
            </div>
            <div v-if="record.remark" class="record-remark">
              备注：{{ record.remark }}
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import {
  LeftOutlined,
  SafetyCertificateOutlined,
  ExclamationCircleOutlined,
  IdcardOutlined,
  PlusOutlined,
  CheckCircleFilled,
  CheckOutlined,
  ScanOutlined,
  UserOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  RightOutlined,
  GiftOutlined,
  TagOutlined,
  TrophyOutlined,
  DollarOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 当前步骤
const currentStep = ref(0)

// 表单数据
const formData = ref({
  realName: '',
  idCard: '',
  phone: '',
  verifyCode: ''
})

// 验证码倒计时
const countdown = ref(0)
let countdownTimer: number | null = null

// 身份证照片
const idCardFront = ref('')
const idCardBack = ref('')

// 人脸识别状态
const faceRecognitionStarted = ref(false)
const faceRecognitionProcessing = ref(false)
const faceRecognitionSuccess = ref(false)
const recognitionProgress = ref(0)

// 认证提交状态
const authSubmitting = ref(false)
const authSuccess = ref(false)
const authTime = ref('')

// 认证记录
const authRecordVisible = ref(false)
const authRecords = ref([
  {
    id: 1,
    name: '张三',
    idCard: '320106199001011234',
    phone: '13800138000',
    status: 'success',
    statusText: '认证成功',
    time: '2024-01-15 14:30:25',
    remark: ''
  },
  {
    id: 2,
    name: '李四',
    idCard: '320106199002021234',
    phone: '13900139000',
    status: 'failed',
    statusText: '认证失败',
    time: '2024-01-10 10:20:15',
    remark: '身份证信息与系统不符'
  },
  {
    id: 3,
    name: '王五',
    idCard: '320106199003031234',
    phone: '13700137000',
    status: 'pending',
    statusText: '审核中',
    time: '2024-01-08 16:45:30',
    remark: ''
  }
])

// 方法
const goBack = () => {
  router.back()
}

const sendVerifyCode = () => {
  if (!formData.value.phone) {
    message.warning('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    message.warning('请输入正确的手机号')
    return
  }

  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
    }
  }, 1000)

  message.success('验证码已发送')
}

const nextStep = () => {
  if (currentStep.value === 0) {
    // 验证第一步
    if (!formData.value.realName) {
      message.warning('请输入真实姓名')
      return
    }
    if (!formData.value.idCard || formData.value.idCard.length !== 18) {
      message.warning('请输入正确的身份证号码')
      return
    }
    if (!formData.value.phone || !/^1[3-9]\d{9}$/.test(formData.value.phone)) {
      message.warning('请输入正确的手机号码')
      return
    }
    if (!formData.value.verifyCode) {
      message.warning('请输入验证码')
      return
    }
  } else if (currentStep.value === 1) {
    // 验证第二步
    if (!idCardFront.value || !idCardBack.value) {
      message.warning('请上传身份证正反面照片')
      return
    }
  } else if (currentStep.value === 2) {
    // 验证第三步
    if (!faceRecognitionSuccess.value) {
      message.warning('请完成人脸识别')
      return
    }
  }

  currentStep.value++
  
  // 进入第4步时自动提交认证
  if (currentStep.value === 3) {
    submitAuth()
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const uploadIdCardFront = () => {
  // 模拟上传
  idCardFront.value = 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  message.success('身份证人像面上传成功')
}

const uploadIdCardBack = () => {
  // 模拟上传
  idCardBack.value = 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
  message.success('身份证国徽面上传成功')
}

const startFaceRecognition = () => {
  faceRecognitionStarted.value = true
  faceRecognitionProcessing.value = true
  recognitionProgress.value = 0

  // 模拟识别进度
  const progressTimer = setInterval(() => {
    recognitionProgress.value += 10
    if (recognitionProgress.value >= 100) {
      clearInterval(progressTimer)
      setTimeout(() => {
        faceRecognitionProcessing.value = false
        faceRecognitionSuccess.value = true
        message.success('人脸识别成功')
      }, 500)
    }
  }, 200)
}

const submitAuth = () => {
  authSubmitting.value = true
  
  // 模拟提交
  setTimeout(() => {
    authSubmitting.value = false
    authSuccess.value = true
    authTime.value = new Date().toLocaleString('zh-CN')
    
    // 更新用户认证状态
    if (!userStore.userInfo) {
      // 如果用户信息不存在,创建默认用户
      userStore.setUserInfo({
        id: Date.now(),
        username: formData.value.realName,
        phone: formData.value.phone,
        avatar: 'https://i.pravatar.cc/150?img=12',
        points: 0,
        level: 0,
        isVerified: false,
        realNameInfo: {
          realName: formData.value.realName,
          idCard: formData.value.idCard,
          verifiedAt: new Date().toISOString()
        }
      })
    } else {
      // 更新现有用户的认证信息
      userStore.userInfo.realNameInfo = {
        realName: formData.value.realName,
        idCard: formData.value.idCard,
        verifiedAt: new Date().toISOString()
      }
    }
    
    // 发放新人礼包积分
    userStore.addPoints(200)
    
    console.log('认证成功,用户信息已更新:', userStore.userInfo)
    console.log('isRealNameVerified:', userStore.isRealNameVerified)
    
    message.success('实名认证成功')
  }, 2000)
}

// 认证证书编号
const certNumber = ref(String(Date.now()).slice(-8))

const goToHome = () => {
  router.push('/')
}

const goToSubsidy = () => {
  router.push('/gov-subsidy')
}

const goToCoupons = () => {
  router.push('/coupons')
}

const goToLottery = () => {
  router.push('/lottery')
}

const showAuthRecord = () => {
  authRecordVisible.value = true
}

const maskIdCard = (idCard: string) => {
  if (!idCard || idCard.length < 18) return idCard
  return idCard.substring(0, 6) + '********' + idCard.substring(14)
}

const maskPhone = (phone: string) => {
  if (!phone || phone.length < 11) return phone
  return phone.substring(0, 3) + '****' + phone.substring(7)
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.real-name-auth-page {
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
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-nav .title {
  font-size: 18px;
  font-weight: 600;
}

.top-nav .anticon,
.top-nav .placeholder {
  font-size: 20px;
  width: 20px;
}

/* 步骤指示器 */
.steps-container {
  background: white;
  padding: 20px 16px;
  margin-bottom: 12px;
}

/* 步骤内容 */
.step-content {
  background: white;
  margin: 0 16px 16px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.step-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.step-title .anticon {
  font-size: 20px;
  color: #667EEA;
}

/* 表单 */
.auth-form {
  margin-bottom: 20px;
}

.code-input-group {
  display: flex;
  gap: 12px;
}

.code-input-group .ant-input {
  flex: 1;
}

/* 步骤操作按钮 */
.step-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.step-actions button {
  flex: 1;
}

/* 提示信息 */
.auth-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #FFF7E6;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 13px;
  color: #FAAD14;
}

/* 上传区域 */
.upload-section {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.upload-card {
  flex: 1;
}

.upload-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.upload-area {
  width: 100%;
  aspect-ratio: 1.6;
  border: 2px dashed #D9D9D9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #667EEA;
}

.upload-area.uploaded {
  border-color: #52C41A;
  border-style: solid;
}

.upload-placeholder {
  text-align: center;
  color: #999;
}

.upload-placeholder .anticon {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-preview {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 48px;
  color: white;
}

.upload-tips {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  text-align: center;
}

/* 上传要求 */
.upload-requirements {
  padding: 16px;
  background: #F5F5F5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.requirement-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.requirement-item .anticon {
  color: #52C41A;
}

/* 人脸识别 */
.face-recognition-container {
  padding: 20px 0;
}

.face-start {
  text-align: center;
}

.face-icon-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.face-icon {
  font-size: 60px;
  color: white;
}

.face-tips {
  text-align: left;
  padding: 20px;
  background: #F5F5F5;
  border-radius: 8px;
  margin-bottom: 24px;
}

.tip-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.tip-item {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.face-processing {
  text-align: center;
}

.scanning-frame {
  width: 200px;
  height: 200px;
  margin: 0 auto 24px;
  border: 3px solid #667EEA;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #667EEA, transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.face-icon-large {
  font-size: 80px;
  color: #667EEA;
}

.processing-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
}

.face-success {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  font-size: 80px;
  color: #52C41A;
  margin-bottom: 16px;
}

.success-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.success-desc {
  font-size: 14px;
  color: #999;
}

/* 认证结果 */
.auth-result {
  padding: 20px 0;
}

.submitting {
  text-align: center;
  padding: 60px 0;
}

.submitting-text {
  font-size: 16px;
  color: #666;
  margin-top: 20px;
}

.auth-success {
  text-align: center;
}

.result-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.result-icon.success {
  color: #52C41A;
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.result-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.auth-info-card {
  background: #F5F5F5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #999;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.benefits-card {
  background: linear-gradient(135deg, #E6F4FF 0%, #F0F5FF 100%);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.benefits-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.benefit-item:last-child {
  margin-bottom: 0;
}

.benefit-item .anticon {
  color: #1890FF;
}

/* 认证记录入口 */
.auth-record-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  margin: 0 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
}

.auth-record-entry:active {
  transform: scale(0.98);
}

.auth-record-entry .anticon:first-child {
  font-size: 20px;
  color: #667EEA;
  margin-right: 8px;
}

.auth-record-entry span {
  flex: 1;
  font-size: 15px;
  color: #333;
}

/* 认证记录列表 */
.auth-record-list {
  max-height: 60vh;
  overflow-y: auto;
}

.record-item {
  padding: 16px;
  background: #F5F5F5;
  border-radius: 8px;
  margin-bottom: 12px;
}

.record-item:last-child {
  margin-bottom: 0;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.record-status.success {
  background: #F6FFED;
  color: #52C41A;
}

.record-status.failed {
  background: #FFF1F0;
  color: #FF4D4F;
}

.record-status.pending {
  background: #FFF7E6;
  color: #FAAD14;
}

.record-time {
  font-size: 12px;
  color: #999;
}

.record-content {
  font-size: 13px;
}

.record-row {
  display: flex;
  margin-bottom: 8px;
}

.record-row:last-child {
  margin-bottom: 0;
}

.record-label {
  color: #999;
  min-width: 80px;
}

.record-value {
  color: #333;
  flex: 1;
}

.record-remark {
  margin-top: 12px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  color: #FF4D4F;
}

/* 认证成功页面优化 */
.auth-success {
  position: relative;
  padding: 20px 0;
}

/* 成功动画效果 */
.success-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation: confetti-fall 3s ease-in-out infinite;
}

.confetti:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.confetti:nth-child(2) {
  left: 30%;
  animation-delay: 0.5s;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.confetti:nth-child(3) {
  left: 50%;
  animation-delay: 1s;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.confetti:nth-child(4) {
  left: 70%;
  animation-delay: 1.5s;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.confetti:nth-child(5) {
  left: 90%;
  animation-delay: 2s;
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(400px) rotate(720deg);
    opacity: 0;
  }
}

/* 认证徽章 */
.auth-badge {
  position: relative;
  margin: 20px auto;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  animation: badge-pulse 2s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.badge-circle .result-icon {
  font-size: 60px;
  color: white;
}

.badge-rays {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  animation: rays-rotate 8s linear infinite;
}

@keyframes badge-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes rays-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.result-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 16px 0 8px;
}

.result-desc {
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-bottom: 24px;
}

/* 认证证书卡片 */
.certificate-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.certificate-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: certificate-glow 6s ease-in-out infinite;
}

@keyframes certificate-glow {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20%, -20%);
  }
}

.certificate-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.cert-icon {
  font-size: 24px;
  color: white;
}

.cert-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.certificate-body {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.certificate-body .info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.certificate-body .info-row:last-child {
  border-bottom: none;
}

.certificate-body .info-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.certificate-body .info-value {
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.certificate-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.cert-number {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Courier New', monospace;
}

.cert-seal {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 12px;
  color: white;
  font-weight: 500;
}

/* 专属权益 */
.exclusive-benefits {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.benefits-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.gift-icon {
  font-size: 20px;
  color: #667eea;
}

.benefits-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.benefit-card {
  text-align: center;
  padding: 16px 8px;
  background: #F7F8FA;
  border-radius: 12px;
  transition: all 0.3s;
}

.benefit-card:active {
  transform: scale(0.95);
}

.benefit-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  color: white;
  font-size: 24px;
}

.benefit-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.benefit-desc {
  font-size: 12px;
  color: #999;
}

/* 快捷操作 */
.quick-actions {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #F7F8FA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:active {
  transform: scale(0.98);
  background: #EBEDF0;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.action-text {
  flex: 1;
}

.action-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.action-desc {
  font-size: 12px;
  color: #999;
}

.action-arrow {
  font-size: 16px;
  color: #D9D9D9;
}

.home-btn {
  margin-top: 8px;
}
</style>

