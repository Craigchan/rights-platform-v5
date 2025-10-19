<template>
  <div class="available-coupons" v-if="availableCoupons.length > 0">
    <div class="coupon-tip">
      <GiftOutlined class="tip-icon" />
      <span>有{{ availableCoupons.length }}张券可用,最高省¥{{ maxDiscount }}</span>
    </div>
    
    <div class="coupon-list">
      <div 
        v-for="coupon in availableCoupons" 
        :key="coupon.id"
        class="coupon-item"
        :class="{ received: coupon.isReceived }"
        @click="handleCouponClick(coupon)"
      >
        <div class="coupon-left">
          <div class="coupon-amount">¥{{ coupon.amount }}</div>
          <div class="coupon-condition">{{ coupon.condition }}</div>
        </div>
        <div class="coupon-right">
          <div class="coupon-name">{{ coupon.name }}</div>
          <div class="coupon-expire">{{ coupon.expireDate }}到期</div>
        </div>
        <div class="coupon-action">
          <button 
            v-if="!coupon.isReceived" 
            class="receive-btn"
            @click.stop="receiveCoupon(coupon)"
          >
            立即领取
          </button>
          <span v-else class="received-tag">已领取</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GiftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Coupon {
  id: number
  name: string
  amount: number
  condition: string
  expireDate: string
  isReceived: boolean
}

interface Props {
  productId?: number
  productPrice?: number
}

const props = defineProps<Props>()

// 模拟获取可用优惠券
const availableCoupons = computed<Coupon[]>(() => {
  // TODO: 根据商品ID和价格从API获取可用优惠券
  return [
    {
      id: 1,
      name: '新用户专享券',
      amount: 50,
      condition: '满200可用',
      expireDate: '2025-10-25',
      isReceived: false
    },
    {
      id: 2,
      name: '品类券',
      amount: 30,
      condition: '满100可用',
      expireDate: '2025-10-30',
      isReceived: true
    },
    {
      id: 3,
      name: '平台券',
      amount: 20,
      condition: '无门槛',
      expireDate: '2025-11-01',
      isReceived: false
    }
  ]
})

const maxDiscount = computed(() => {
  return Math.max(...availableCoupons.value.map(c => c.amount))
})

const receiveCoupon = async (coupon: Coupon) => {
  // TODO: 调用API领取优惠券
  message.success(`成功领取${coupon.name}`)
  coupon.isReceived = true
}

const handleCouponClick = (coupon: Coupon) => {
  if (!coupon.isReceived) {
    receiveCoupon(coupon)
  }
}
</script>

<style scoped>
.available-coupons {
  background: #fff5f0;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
}

.coupon-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #FF6B35;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.tip-icon {
  font-size: 18px;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.coupon-item {
  background: white;
  border: 1px solid #ffe0d0;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-item:active {
  transform: scale(0.98);
}

.coupon-item.received {
  opacity: 0.7;
}

.coupon-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  border-right: 1px dashed #ffe0d0;
  padding-right: 12px;
}

.coupon-amount {
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
}

.coupon-condition {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.coupon-right {
  flex: 1;
}

.coupon-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.coupon-expire {
  font-size: 12px;
  color: #999;
}

.coupon-action {
  margin-left: auto;
}

.receive-btn {
  background: #FF6B35;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.receive-btn:active {
  transform: scale(0.95);
}

.received-tag {
  color: #52c41a;
  font-size: 13px;
  font-weight: 600;
}
</style>

