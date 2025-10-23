import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface MerchantPaymentCoupon {
  id: string
  name: string
  type: 'full_reduction' | 'threshold_reduction' | 'voucher'
  fullAmount?: number      // 每满X元
  reduceAmount?: number    // 减Y元
  threshold?: number       // 满X元
  voucherAmount?: number   // 代金券面值
  timeRange: string
  description: string
  bankLimit?: string       // 银行限制
  dailyLimit?: number      // 每日限制次数
}

export interface MerchantInfo {
  id: string
  name: string
  address: string
  phone: string
  coupons: MerchantPaymentCoupon[]
}

export const useMerchantPaymentStore = defineStore('merchantPayment', () => {
  const merchantInfo = ref<MerchantInfo | null>(null)
  const consumeAmount = ref<string>('')
  const selectedCoupon = ref<MerchantPaymentCoupon | null>(null)

  // 计算优惠金额
  const discountAmount = computed(() => {
    if (!selectedCoupon.value || !consumeAmount.value) return 0

    const coupon = selectedCoupon.value
    const amount = parseFloat(consumeAmount.value)

    if (isNaN(amount) || amount <= 0) return 0

    switch (coupon.type) {
      case 'full_reduction':
        // 每满X减Y（如每满20减2）
        const times = Math.floor(amount / (coupon.fullAmount || 1))
        return times * (coupon.reduceAmount || 0)
      
      case 'threshold_reduction':
        // 满X减Y（如满100减10）
        return amount >= (coupon.threshold || 0) ? (coupon.reduceAmount || 0) : 0
      
      case 'voucher':
        // 代金券（如20元代金券）
        return amount >= (coupon.voucherAmount || 0) ? (coupon.voucherAmount || 0) : 0
      
      default:
        return 0
    }
  })

  // 实付金额
  const finalAmount = computed(() => {
    const amount = parseFloat(consumeAmount.value) || 0
    const discount = discountAmount.value
    const result = amount - discount
    return Math.max(result, 0)
  })

  // 可用优惠券列表（带可用性判断）
  const availableCoupons = computed(() => {
    if (!merchantInfo.value?.coupons) return []

    const amount = parseFloat(consumeAmount.value) || 0

    return merchantInfo.value.coupons.map((coupon) => {
      let available = true
      let reason = ''

      if (amount <= 0) {
        available = false
        reason = '请先输入消费金额'
      } else if (coupon.type === 'full_reduction') {
        if (amount < (coupon.fullAmount || 0)) {
          available = false
          reason = `需满${coupon.fullAmount}元`
        }
      } else if (coupon.type === 'threshold_reduction') {
        if (amount < (coupon.threshold || 0)) {
          available = false
          reason = `需满${coupon.threshold}元`
        }
      } else if (coupon.type === 'voucher') {
        if (amount < (coupon.voucherAmount || 0)) {
          available = false
          reason = `消费需大于${coupon.voucherAmount}元`
        }
      }

      return {
        ...coupon,
        available,
        reason
      }
    })
  })

  // 自动选择最优优惠券
  const autoSelectBestCoupon = () => {
    const available = availableCoupons.value.filter(c => c.available)
    if (available.length === 0) {
      selectedCoupon.value = null
      return
    }

    // 计算每个优惠券的优惠金额，选择最大的
    let bestCoupon = available[0]
    let maxDiscount = 0

    available.forEach(coupon => {
      const tempSelected = selectedCoupon.value
      selectedCoupon.value = coupon
      const discount = discountAmount.value
      if (discount > maxDiscount) {
        maxDiscount = discount
        bestCoupon = coupon
      }
      selectedCoupon.value = tempSelected
    })

    selectedCoupon.value = bestCoupon
  }

  // 生成买单订单
  const createPaymentOrder = () => {
    if (!merchantInfo.value) {
      throw new Error('商家信息不存在')
    }

    const amount = parseFloat(consumeAmount.value)
    if (isNaN(amount) || amount <= 0) {
      throw new Error('请输入有效的消费金额')
    }

    if (amount < 0.01 || amount > 1000) {
      throw new Error('消费金额需在0.01-1000元之间')
    }

    if (selectedCoupon.value?.type === 'voucher' && amount < (selectedCoupon.value.voucherAmount || 0)) {
      throw new Error('使用代金券时，消费总额需大于代金券面值')
    }

    return {
      type: 'merchant_payment',
      merchantId: merchantInfo.value.id,
      merchantName: merchantInfo.value.name,
      consumeAmount: amount,
      couponId: selectedCoupon.value?.id || '',
      couponName: selectedCoupon.value?.name || '',
      discountAmount: discountAmount.value,
      finalAmount: finalAmount.value,
      createTime: Date.now(),
      expireTime: Date.now() + 15 * 60 * 1000 // 15分钟后过期
    }
  }

  // 设置商家信息
  const setMerchantInfo = (info: MerchantInfo) => {
    merchantInfo.value = info
  }

  // 设置消费金额
  const setConsumeAmount = (amount: string) => {
    consumeAmount.value = amount
    // 金额变化时自动选择最优优惠券
    autoSelectBestCoupon()
  }

  // 选择优惠券
  const selectCoupon = (coupon: MerchantPaymentCoupon | null) => {
    selectedCoupon.value = coupon
  }

  // 重置状态
  const reset = () => {
    merchantInfo.value = null
    consumeAmount.value = ''
    selectedCoupon.value = null
  }

  return {
    merchantInfo,
    consumeAmount,
    selectedCoupon,
    discountAmount,
    finalAmount,
    availableCoupons,
    setMerchantInfo,
    setConsumeAmount,
    selectCoupon,
    autoSelectBestCoupon,
    createPaymentOrder,
    reset
  }
})

