<template>
  <div class="cashier-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="handleBack" class="back-icon" />
      <span class="page-title">收银台</span>
      <span class="placeholder"></span>
    </div>

    <!-- 订单倒计时 -->
    <div class="countdown-section">
      <ClockCircleOutlined class="clock-icon" />
      <span class="countdown-text">订单将在 {{ formatTime(countdown) }} 后关闭</span>
    </div>

    <!-- 订单信息 -->
    <div class="order-section">
      <div class="section-title">订单信息</div>
      <div class="order-info">
        <div class="info-row">
          <span class="label">订单编号</span>
          <span class="value">{{ orderData.orderNo }}</span>
        </div>
        <div class="info-row">
          <span class="label">商品数量</span>
          <span class="value">{{ orderData.itemCount }} 件</span>
        </div>
        <div class="info-row">
          <span class="label">收货地址</span>
          <span class="value address">{{ orderData.address }}</span>
        </div>
      </div>
    </div>

    <!-- 支付金额 -->
    <div class="amount-section">
      <div class="section-title">支付金额</div>
      <div class="amount-detail">
        <div class="amount-row" v-if="orderData.points > 0">
          <span class="label">积分抵扣</span>
          <span class="value points">{{ orderData.points.toLocaleString() }} 积分</span>
        </div>
        <div class="amount-row" v-if="orderData.couponDiscount > 0">
          <span class="label">优惠券</span>
          <span class="value discount">-¥{{ orderData.couponDiscount.toFixed(2) }}</span>
        </div>
        <div class="amount-divider"></div>
        <div class="amount-row total">
          <span class="label">需要支付</span>
          <span class="value price">¥{{ orderData.payAmount.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="payment-section">
      <div class="section-title">支付方式</div>
      <div class="payment-methods">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          :class="['payment-item', { active: selectedPayment === method.id, disabled: !method.available }]"
          @click="selectPayment(method)"
        >
          <div class="payment-icon" :style="{ background: method.color }">
            <component :is="method.icon" />
          </div>
          <div class="payment-info">
            <div class="payment-name">{{ method.name }}</div>
            <div class="payment-desc">{{ method.desc }}</div>
          </div>
          <div class="payment-check">
            <CheckCircleFilled v-if="selectedPayment === method.id" />
          </div>
        </div>
      </div>
    </div>

    <!-- 底部支付按钮 -->
    <div class="bottom-bar">
      <div class="pay-info">
        <div class="pay-label">需支付</div>
        <div class="pay-amount">¥{{ orderData.payAmount.toFixed(2) }}</div>
      </div>
      <a-button 
        type="primary" 
        size="large"
        class="pay-btn"
        :loading="paying"
        :disabled="!selectedPayment"
        @click="handlePay"
      >
        立即支付
      </a-button>
    </div>

    <!-- 支付中遮罩 -->
    <a-modal
      v-model:open="paymentModalVisible"
      :footer="null"
      :closable="false"
      :maskClosable="false"
      centered
    >
      <div class="payment-processing">
        <LoadingOutlined class="loading-icon" />
        <div class="processing-text">支付处理中...</div>
        <div class="processing-hint">请勿关闭页面</div>
      </div>
    </a-modal>

    <!-- 支付成功弹窗 -->
    <a-modal
      v-model:open="successModalVisible"
      :footer="null"
      :closable="false"
      centered
    >
      <div class="payment-success">
        <CheckCircleOutlined class="success-icon" />
        <div class="success-title">支付成功</div>
        <div class="success-amount">¥{{ orderData.payAmount.toFixed(2) }}</div>
        <div class="success-actions">
          <a-button size="large" @click="viewOrder">查看订单</a-button>
          <a-button type="primary" size="large" @click="backToHome">返回首页</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  LeftOutlined,
  ClockCircleOutlined,
  AlipayCircleOutlined,
  WechatOutlined,
  WalletOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 订单数据
const orderData = ref({
  orderNo: '',
  itemCount: 0,
  address: '',
  points: 0,
  couponDiscount: 0,
  payAmount: 0
})

// 倒计时（15分钟）
const countdown = ref(15 * 60)
let countdownTimer: any = null

// 支付方式
const paymentMethods = ref([
  {
    id: 'alipay',
    name: '支付宝',
    desc: '推荐使用支付宝支付',
    icon: AlipayCircleOutlined,
    color: 'linear-gradient(135deg, #1677FF 0%, #00A0E9 100%)',
    available: true
  },
  {
    id: 'wechat',
    name: '微信支付',
    desc: '使用微信扫码支付',
    icon: WechatOutlined,
    color: 'linear-gradient(135deg, #09BB07 0%, #00D100 100%)',
    available: true
  },
  {
    id: 'balance',
    name: '余额支付',
    desc: '当前余额：¥0.00',
    icon: WalletOutlined,
    color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    available: false
  }
])

const selectedPayment = ref<string>('alipay')
const paying = ref(false)
const paymentModalVisible = ref(false)
const successModalVisible = ref(false)

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 倒计时
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      Modal.warning({
        title: '订单已关闭',
        content: '订单超时未支付，已自动关闭',
        onOk: () => {
          router.push('/cart')
        }
      })
    }
  }, 1000)
}

// 选择支付方式
const selectPayment = (method: any) => {
  if (!method.available) {
    message.warning('该支付方式暂不可用')
    return
  }
  selectedPayment.value = method.id
}

// 返回
const handleBack = () => {
  Modal.confirm({
    title: '确认离开？',
    content: '离开后订单将保留，可在"我的订单"中继续支付',
    okText: '确认离开',
    cancelText: '继续支付',
    onOk: () => {
      router.back()
    }
  })
}

// 支付
const handlePay = async () => {
  if (!selectedPayment.value) {
    message.warning('请选择支付方式')
    return
  }

  try {
    paying.value = true
    paymentModalVisible.value = true

    // 模拟支付过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟支付成功
    paymentModalVisible.value = false
    successModalVisible.value = true

    // 清除倒计时
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }

  } catch (error: any) {
    paymentModalVisible.value = false
    message.error(error.message || '支付失败，请重试')
  } finally {
    paying.value = false
  }
}

// 查看订单
const viewOrder = () => {
  successModalVisible.value = false
  router.push(`/order-detail/${orderData.value.orderNo}`)
}

// 返回首页
const backToHome = () => {
  successModalVisible.value = false
  router.push('/')
}

onMounted(() => {
  // 从路由参数获取订单数据
  const orderDataStr = route.query.data as string
  if (orderDataStr) {
    try {
      const data = JSON.parse(decodeURIComponent(orderDataStr))
      orderData.value = data
    } catch (error) {
      message.error('订单数据异常')
      router.back()
      return
    }
  } else {
    message.error('订单数据缺失')
    router.back()
    return
  }

  // 启动倒计时
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.cashier-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 顶部导航 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.placeholder {
  width: 20px;
}

/* 倒计时 */
.countdown-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #fff5f0;
  border-bottom: 1px solid #ffe0d0;
}

.clock-icon {
  color: #FF6B35;
  font-size: 16px;
}

.countdown-text {
  font-size: 14px;
  color: #FF6B35;
  font-weight: 500;
}

/* 区块样式 */
.order-section,
.amount-section,
.payment-section {
  margin: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

/* 订单信息 */
.order-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
}

.info-row .label {
  color: #999;
  min-width: 80px;
}

.info-row .value {
  color: #333;
  font-weight: 500;
  text-align: right;
  flex: 1;
}

.info-row .value.address {
  max-width: 200px;
  word-break: break-all;
}

/* 金额明细 */
.amount-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.amount-row .label {
  color: #666;
}

.amount-row .value {
  font-weight: 500;
}

.amount-row .value.points {
  color: #FF6B35;
}

.amount-row .value.discount {
  color: #52c41a;
}

.amount-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 4px 0;
}

.amount-row.total {
  font-size: 16px;
  margin-top: 4px;
}

.amount-row.total .label {
  color: #333;
  font-weight: 600;
}

.amount-row.total .value.price {
  color: #FF6B35;
  font-size: 20px;
  font-weight: 600;
}

/* 支付方式 */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-item.active {
  background: #fff5f0;
  border-color: #FF6B35;
}

.payment-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-item:not(.disabled):hover {
  background: #f0f0f0;
}

.payment-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.payment-info {
  flex: 1;
}

.payment-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.payment-desc {
  font-size: 12px;
  color: #999;
}

.payment-check {
  color: #FF6B35;
  font-size: 24px;
}

/* 底部支付栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.pay-info {
  flex: 1;
}

.pay-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.pay-amount {
  font-size: 20px;
  font-weight: 600;
  color: #FF6B35;
}

.pay-btn {
  flex-shrink: 0;
  min-width: 120px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: #FF6B35;
  border-color: #FF6B35;
}

.pay-btn:hover {
  background: #ff8555;
  border-color: #ff8555;
}

/* 支付处理中 */
.payment-processing {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.loading-icon {
  font-size: 48px;
  color: #FF6B35;
  margin-bottom: 20px;
}

.processing-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.processing-hint {
  font-size: 14px;
  color: #999;
}

/* 支付成功 */
.payment-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.success-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 20px;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.success-amount {
  font-size: 28px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 32px;
}

.success-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

.success-actions button {
  flex: 1;
  height: 44px;
}
</style>

