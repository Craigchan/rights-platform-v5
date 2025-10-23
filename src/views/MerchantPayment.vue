<template>
  <div class="merchant-payment-page">
    <!-- 顶部导航 -->
    <div class="header">
      <LeftOutlined class="back-icon" @click="goBack" />
      <span class="title">商户买单</span>
    </div>

    <!-- 主内容 -->
    <div class="content">
      <!-- 商家信息 -->
      <div class="merchant-section">
        <h2 class="merchant-name">{{ paymentStore.merchantInfo?.name }}</h2>
      </div>

      <!-- 消费总额 -->
      <div class="amount-section">
        <div class="amount-label">消费总额</div>
        <div class="amount-input-wrapper">
          <input
            v-model="paymentStore.consumeAmount"
            type="number"
            inputmode="decimal"
            class="amount-input"
            placeholder="请输入消费金额"
            @input="onAmountChange"
          />
        </div>
      </div>

      <!-- 买单优惠 -->
      <div class="coupon-section">
        <div class="section-title">买单优惠</div>
        <div class="coupon-list">
          <div
            v-for="coupon in paymentStore.availableCoupons"
            :key="coupon.id"
            :class="[
              'coupon-item',
              {
                'selected': paymentStore.selectedCoupon?.id === coupon.id,
                'disabled': !coupon.available
              }
            ]"
            @click="selectCoupon(coupon)"
          >
            <CheckCircleFilled
              v-if="paymentStore.selectedCoupon?.id === coupon.id"
              class="check-icon selected"
            />
            <CheckCircleOutlined
              v-else
              :class="['check-icon', { disabled: !coupon.available }]"
            />
            <span :class="['coupon-name', { disabled: !coupon.available }]">
              {{ coupon.name }}
            </span>
            <span v-if="!coupon.available && coupon.reason" class="coupon-reason">
              {{ coupon.reason }}
            </span>
          </div>
        </div>
      </div>

      <!-- 费用明细 -->
      <div class="summary-section">
        <div class="summary-item">
          <span class="summary-label">合计优惠</span>
          <span class="summary-value discount">-{{ paymentStore.discountAmount }}</span>
        </div>
        <div class="divider"></div>
        <div class="summary-item total">
          <span class="summary-label">实际支付金额</span>
          <span class="summary-value final">¥{{ paymentStore.finalAmount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 优惠说明 -->
      <div class="notice-section">
        <div class="notice-title">优惠说明：</div>
        <div class="notice-content">
          <p v-if="paymentStore.selectedCoupon">
            * 使用时间 {{ paymentStore.selectedCoupon.timeRange }}。
          </p>
          <p v-if="paymentStore.selectedCoupon">
            * {{ paymentStore.selectedCoupon.description }}。
          </p>
          <p v-if="paymentStore.selectedCoupon?.bankLimit">
            * {{ paymentStore.selectedCoupon.bankLimit }}。
          </p>
          <p>* 每人每日仅限享受一次惠买单优惠，名额有限，先到先得。</p>
          <p>* 单笔实际支付金额需为0.01元至1000元。若使用代金券，消费总额需大于代金券面值。</p>
          <p>* 因支付金额受商户活动名额和客户当日参与活动次数影响，最终支付金额请以支付页面展示为准。</p>
        </div>
      </div>
    </div>

    <!-- 底部确认按钮 -->
    <div class="bottom-bar">
      <a-button
        type="primary"
        size="large"
        block
        :disabled="!canSubmit"
        :loading="submitting"
        @click="confirmPayment"
      >
        已和店员确认，立即买单
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useMerchantPaymentStore } from '@/stores/merchantPayment'
import type { MerchantPaymentCoupon } from '@/stores/merchantPayment'
import {
  LeftOutlined,
  CheckCircleOutlined,
  CheckCircleFilled
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const paymentStore = useMerchantPaymentStore()

const submitting = ref(false)

// 判断是否可以提交
const canSubmit = computed(() => {
  const amount = parseFloat(paymentStore.consumeAmount)
  return (
    !isNaN(amount) &&
    amount >= 0.01 &&
    amount <= 1000 &&
    paymentStore.selectedCoupon !== null
  )
})

// 金额输入变化
const onAmountChange = () => {
  // 限制最多两位小数
  const value = paymentStore.consumeAmount
  const parts = value.split('.')
  if (parts.length > 1 && parts[1].length > 2) {
    paymentStore.consumeAmount = `${parts[0]}.${parts[1].slice(0, 2)}`
  }
}

// 选择优惠券
const selectCoupon = (coupon: any) => {
  if (!coupon.available) {
    message.warning(coupon.reason || '该优惠券暂不可用')
    return
  }
  paymentStore.selectCoupon(coupon)
}

// 确认支付
const confirmPayment = async () => {
  try {
    submitting.value = true

    // 验证金额
    const amount = parseFloat(paymentStore.consumeAmount)
    if (isNaN(amount) || amount < 0.01) {
      message.error('请输入有效的消费金额（最低0.01元）')
      return
    }
    if (amount > 1000) {
      message.error('单笔消费金额不能超过1000元')
      return
    }

    // 验证优惠券
    if (!paymentStore.selectedCoupon) {
      message.error('请选择优惠券')
      return
    }

    // 生成订单
    const order = paymentStore.createPaymentOrder()

    // 跳转到收银台
    router.push({
      name: 'Cashier',
      query: {
        orderData: JSON.stringify(order)
      }
    })
  } catch (error: any) {
    message.error(error.message || '提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 初始化
onMounted(() => {
  const merchantId = route.params.merchantId as string

  // 模拟获取商家信息（实际应该从API获取）
  // 这里使用示例数据
  const mockMerchantInfo = {
    id: merchantId,
    name: '柠季（捞刀河）',
    address: '长青路',
    phone: '19873067238',
    coupons: [
      {
        id: 'coupon_1',
        name: '每满20减2元',
        type: 'full_reduction' as const,
        fullAmount: 20,
        reduceAmount: 2,
        timeRange: '周一至周日 00:00:00-23:59:59',
        description: '每满20减2元',
        bankLimit: '民生银行卡专享'
      },
      {
        id: 'coupon_2',
        name: '满100减10元',
        type: 'threshold_reduction' as const,
        threshold: 100,
        reduceAmount: 10,
        timeRange: '周一至周日 00:00:00-23:59:59',
        description: '满100减10元',
        bankLimit: '民生银行卡专享'
      },
      {
        id: 'coupon_3',
        name: '柠季20元代金券',
        type: 'voucher' as const,
        voucherAmount: 20,
        timeRange: '周一至周日 00:00:00-23:59:59',
        description: '20元代金券',
        bankLimit: '民生银行卡专享'
      }
    ]
  }

  paymentStore.setMerchantInfo(mockMerchantInfo)
})
</script>

<style scoped lang="scss">
.merchant-payment-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  .back-icon {
    font-size: 20px;
    color: #333;
    cursor: pointer;
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-right: 20px;
  }
}

.content {
  padding: 12px 16px;
}

.merchant-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;

  .merchant-name {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin: 0;
  }
}

.amount-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;

  .amount-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
  }

  .amount-input-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .amount-input {
      flex: 1;
      text-align: right;
      font-size: 32px;
      font-weight: 500;
      color: #333;
      border: none;
      outline: none;
      background: transparent;

      &::placeholder {
        color: #ccc;
        font-size: 16px;
      }

      /* 移除数字输入框的上下箭头 */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      &[type='number'] {
        -moz-appearance: textfield;
      }
    }
  }
}

.coupon-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;

  .section-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
  }

  .coupon-list {
    .coupon-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.3s;

      &:last-child {
        border-bottom: none;
      }

      &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .check-icon {
        font-size: 20px;
        margin-right: 12px;
        color: #d9d9d9;

        &.selected {
          color: #00c853;
        }

        &.disabled {
          color: #d9d9d9;
        }
      }

      .coupon-name {
        flex: 1;
        font-size: 14px;
        color: #333;

        &.disabled {
          color: #999;
        }
      }

      .coupon-reason {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.summary-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;

    .summary-label {
      font-size: 14px;
      color: #666;
    }

    .summary-value {
      font-size: 14px;
      color: #333;

      &.discount {
        color: #ff6b35;
      }

      &.final {
        font-size: 24px;
        font-weight: 500;
        color: #00c853;
      }
    }

    &.total {
      padding-top: 12px;
    }
  }

  .divider {
    height: 1px;
    background: #f0f0f0;
    margin: 8px 0;
  }
}

.notice-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;

  .notice-title {
    font-size: 14px;
    font-weight: 500;
    color: #ff4444;
    margin-bottom: 8px;
  }

  .notice-content {
    p {
      font-size: 12px;
      color: #ff4444;
      line-height: 1.6;
      margin: 4px 0;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  z-index: 100;

  :deep(.ant-btn-primary) {
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    background: #00c853;
    border-color: #00c853;

    &:hover:not(:disabled) {
      background: #00b248;
      border-color: #00b248;
    }

    &:disabled {
      background: #d9d9d9;
      border-color: #d9d9d9;
    }
  }
}
</style>

