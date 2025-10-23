<template>
  <div class="coupon-card">
    <div class="card-header">
      <div class="card-icon">🎟️</div>
      <div class="card-title">即将过期的优惠券</div>
    </div>
    
    <div class="coupon-list">
      <div 
        v-for="coupon in data.coupons" 
        :key="coupon.id"
        class="coupon-item"
        @click="useCoupon(coupon)"
      >
        <div class="coupon-amount">¥{{ coupon.amount }}</div>
        <div class="coupon-info">
          <div class="coupon-name">{{ coupon.name }}</div>
          <div class="coupon-expire">{{ coupon.expireDate }} 到期</div>
        </div>
        <button class="use-btn">去使用</button>
      </div>
    </div>
    
    <div class="card-footer" @click="viewAll">
      查看全部优惠券 →
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Coupon {
  id: number
  name: string
  amount: number
  expireDate: string
}

interface Props {
  data: {
    coupons: Coupon[]
    expiringCount: number
  }
}

defineProps<Props>()
const router = useRouter()

const useCoupon = (coupon: Coupon) => {
  console.log('使用优惠券:', coupon)
  router.push('/points-mall')
}

const viewAll = () => {
  router.push('/vouchers')
}
</script>

<style scoped>
.coupon-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.card-icon {
  font-size: 24px;
  margin-right: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.coupon-list {
  margin-bottom: 12px;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff5f0;
  border: 1px solid #ffe0d0;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-item:active {
  transform: scale(0.98);
}

.coupon-amount {
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
  margin-right: 12px;
  min-width: 70px;
}

.coupon-info {
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

.use-btn {
  background: #FF6B35;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.use-btn:active {
  transform: scale(0.95);
}

.card-footer {
  text-align: center;
  color: #FF6B35;
  font-size: 14px;
  cursor: pointer;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
</style>

