<template>
  <a-modal
    v-model:open="visible"
    title="收银台"
    :footer="null"
    :width="400"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <div class="payment-modal">
      <!-- 订单信息 -->
      <div class="order-info">
        <div class="order-amount">
          <span class="label">订单金额</span>
          <span class="amount">¥{{ orderAmount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-methods">
        <div class="section-title">选择支付方式</div>
        <a-radio-group v-model:value="selectedMethod" class="method-list">
          <div
            v-for="method in paymentMethods"
            :key="method.value"
            :class="['method-item', { 'method-selected': selectedMethod === method.value }]"
            @click="selectedMethod = method.value"
          >
            <a-radio :value="method.value">
              <div class="method-content">
                <component :is="method.icon" class="method-icon" :style="{ color: method.color }" />
                <div class="method-info">
                  <div class="method-name">{{ method.name }}</div>
                  <div v-if="method.desc" class="method-desc">{{ method.desc }}</div>
                </div>
              </div>
            </a-radio>
          </div>
        </a-radio-group>
      </div>

      <!-- 支付密码输入 -->
      <div v-if="showPasswordInput" class="password-section">
        <div class="section-title">输入支付密码</div>
        <div class="password-input-container">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            :ref="el => passwordInputs[index] = el"
            v-model="password[index]"
            type="password"
            maxlength="1"
            class="password-digit"
            @input="handlePasswordInput(index)"
            @keydown="handlePasswordKeydown(index, $event)"
          />
        </div>
        <div class="password-tips">
          <a-checkbox v-model:checked="simulateFailure">
            模拟支付失败(测试用)
          </a-checkbox>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <a-button v-if="!showPasswordInput" block size="large" @click="handleCancel">
          取消
        </a-button>
        <a-button
          type="primary"
          block
          size="large"
          :loading="paying"
          @click="handlePay"
        >
          {{ paying ? '支付中...' : showPasswordInput ? '确认支付' : '立即支付' }}
        </a-button>
      </div>
    </div>
  </a-modal>

  <!-- 支付结果弹窗 -->
  <a-modal
    v-model:open="showResult"
    :title="null"
    :footer="null"
    :closable="false"
    :width="360"
    centered
  >
    <div class="payment-result">
      <div v-if="paymentSuccess" class="result-success">
        <CheckCircleFilled class="result-icon success-icon" />
        <div class="result-title">支付成功</div>
        <div class="result-amount">¥{{ orderAmount.toFixed(2) }}</div>
        <div class="result-tips">您的订单已支付成功</div>
      </div>
      <div v-else class="result-failure">
        <CloseCircleFilled class="result-icon failure-icon" />
        <div class="result-title">支付失败</div>
        <div class="result-message">{{ failureMessage }}</div>
        <div class="result-tips">请重新尝试支付</div>
      </div>
      <div class="result-actions">
        <a-button v-if="paymentSuccess" type="primary" block size="large" @click="handleViewOrder">
          查看订单
        </a-button>
        <a-button v-else type="primary" block size="large" @click="handleRetry">
          重新支付
        </a-button>
        <a-button v-if="!paymentSuccess" block size="large" @click="handleClose">
          取消
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlipayCircleOutlined,
  WechatOutlined,
  CreditCardOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Props {
  open: boolean
  orderAmount: number
  orderId?: string
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success', data: any): void
  (e: 'failure', error: any): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  orderAmount: 0,
  orderId: ''
})

const emit = defineEmits<Emits>()

const router = useRouter()

// 弹窗显示状态
const visible = ref(false)

// 选中的支付方式
const selectedMethod = ref('alipay')

// 支付方式列表
const paymentMethods = [
  {
    value: 'alipay',
    name: '支付宝支付',
    desc: '推荐使用',
    icon: AlipayCircleOutlined,
    color: '#1677ff'
  },
  {
    value: 'wechat',
    name: '微信支付',
    desc: '',
    icon: WechatOutlined,
    color: '#07c160'
  },
  {
    value: 'card',
    name: '银行卡支付',
    desc: '',
    icon: CreditCardOutlined,
    color: '#ff4d4f'
  }
]

// 是否显示密码输入
const showPasswordInput = ref(false)

// 支付密码
const password = ref<string[]>(['', '', '', '', '', ''])

// 密码输入框引用
const passwordInputs = ref<any[]>([])

// 是否正在支付
const paying = ref(false)

// 是否显示结果
const showResult = ref(false)

// 支付是否成功
const paymentSuccess = ref(false)

// 失败消息
const failureMessage = ref('')

// 模拟失败
const simulateFailure = ref(false)

// 监听 props.open 变化
watch(() => props.open, (newVal) => {
  visible.value = newVal
  if (newVal) {
    // 重置状态
    resetState()
  }
})

// 监听 visible 变化
watch(visible, (newVal) => {
  if (!newVal) {
    emit('update:open', false)
  }
})

// 重置状态
const resetState = () => {
  selectedMethod.value = 'alipay'
  showPasswordInput.value = false
  password.value = ['', '', '', '', '', '']
  paying.value = false
  showResult.value = false
  paymentSuccess.value = false
  failureMessage.value = ''
  simulateFailure.value = false
}

// 处理密码输入
const handlePasswordInput = (index: number) => {
  const value = password.value[index]
  
  // 只允许输入数字
  if (value && !/^\d$/.test(value)) {
    password.value[index] = ''
    return
  }

  // 自动聚焦到下一个输入框
  if (value && index < 5) {
    passwordInputs.value[index + 1]?.focus()
  }

  // 如果输入完成,自动提交
  if (index === 5 && value) {
    const fullPassword = password.value.join('')
    if (fullPassword.length === 6) {
      handlePay()
    }
  }
}

// 处理密码键盘事件
const handlePasswordKeydown = (index: number, event: KeyboardEvent) => {
  // 退格键
  if (event.key === 'Backspace') {
    if (!password.value[index] && index > 0) {
      // 如果当前为空,删除前一个
      password.value[index - 1] = ''
      passwordInputs.value[index - 1]?.focus()
    }
  }
}

// 处理支付
const handlePay = async () => {
  if (!showPasswordInput.value) {
    // 显示密码输入
    showPasswordInput.value = true
    await nextTick()
    passwordInputs.value[0]?.focus()
    return
  }

  // 验证密码
  const fullPassword = password.value.join('')
  if (fullPassword.length !== 6) {
    message.error('请输入6位支付密码')
    return
  }

  // 开始支付
  paying.value = true

  try {
    // 模拟支付请求
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateFailure.value) {
          reject(new Error('支付密码错误'))
        } else {
          resolve({ success: true })
        }
      }, 2000)
    })

    // 支付成功
    paymentSuccess.value = true
    visible.value = false
    showResult.value = true

    // 触发成功回调
    emit('success', {
      orderId: props.orderId,
      amount: props.orderAmount,
      method: selectedMethod.value,
      timestamp: Date.now()
    })
  } catch (error: any) {
    // 支付失败
    paymentSuccess.value = false
    failureMessage.value = error.message || '支付失败,请重试'
    visible.value = false
    showResult.value = true

    // 触发失败回调
    emit('failure', {
      orderId: props.orderId,
      error: error.message
    })
  } finally {
    paying.value = false
  }
}

// 处理取消
const handleCancel = () => {
  visible.value = false
}

// 查看订单
const handleViewOrder = () => {
  showResult.value = false
  router.push('/orders')
}

// 重新支付
const handleRetry = () => {
  showResult.value = false
  visible.value = true
  resetState()
}

// 关闭结果弹窗
const handleClose = () => {
  showResult.value = false
}
</script>

<style scoped lang="scss">
.payment-modal {
  .order-info {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;

    .order-amount {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label {
        font-size: 14px;
        color: #666;
      }

      .amount {
        font-size: 24px;
        font-weight: bold;
        color: #ff4d4f;
      }
    }
  }

  .payment-methods {
    margin-bottom: 20px;

    .section-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .method-list {
      width: 100%;

      .method-item {
        border: 1px solid #d9d9d9;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: #1890ff;
        }

        &.method-selected {
          border-color: #1890ff;
          background: #f0f5ff;
        }

        .method-content {
          display: flex;
          align-items: center;
          gap: 12px;

          .method-icon {
            font-size: 28px;
          }

          .method-info {
            flex: 1;

            .method-name {
              font-size: 14px;
              font-weight: bold;
            }

            .method-desc {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }

  .password-section {
    margin-bottom: 20px;

    .section-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .password-input-container {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 12px;

      .password-digit {
        width: 40px;
        height: 48px;
        text-align: center;
        font-size: 24px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        outline: none;
        transition: all 0.3s;

        &:focus {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }
    }

    .password-tips {
      text-align: center;
      font-size: 12px;
      color: #999;
    }
  }

  .action-buttons {
    display: flex;
    gap: 12px;
  }
}

.payment-result {
  text-align: center;
  padding: 20px 0;

  .result-success,
  .result-failure {
    .result-icon {
      font-size: 64px;
      margin-bottom: 16px;

      &.success-icon {
        color: #52c41a;
      }

      &.failure-icon {
        color: #ff4d4f;
      }
    }

    .result-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .result-amount {
      font-size: 32px;
      font-weight: bold;
      color: #ff4d4f;
      margin-bottom: 12px;
    }

    .result-message {
      font-size: 16px;
      color: #ff4d4f;
      margin-bottom: 12px;
    }

    .result-tips {
      font-size: 14px;
      color: #999;
      margin-bottom: 24px;
    }
  }

  .result-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>

