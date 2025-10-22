<template>
  <div class="coupon-banner" v-if="availableCoupons.length > 0" @click="$emit('showCoupons')">
    <div class="banner-icon">
      <GiftOutlined />
    </div>
    <div class="banner-content">
      <div class="banner-title">
        有 <span class="highlight">{{ availableCoupons.length }}</span> 张优惠券可用
      </div>
      <div class="banner-subtitle">
        最高可省 <span class="amount">¥{{ maxDiscount }}</span>
      </div>
    </div>
    <div class="banner-action">
      <span>立即领取</span>
      <RightOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GiftOutlined, RightOutlined } from '@ant-design/icons-vue'

interface Coupon {
  id: number
  name: string
  discount: number
  condition: number
}

interface Props {
  availableCoupons: Coupon[]
}

const props = defineProps<Props>()

defineEmits(['showCoupons'])

const maxDiscount = computed(() => {
  if (props.availableCoupons.length === 0) return 0
  return Math.max(...props.availableCoupons.map(c => c.discount))
})
</script>

<style scoped>
.coupon-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 12px 16px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);
}

.coupon-banner:active {
  transform: scale(0.98);
}

.banner-icon {
  font-size: 24px;
  color: white;
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 2px;
}

.banner-title .highlight {
  font-size: 16px;
  font-weight: bold;
}

.banner-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.banner-subtitle .amount {
  font-size: 14px;
  font-weight: bold;
}

.banner-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: white;
}
</style>

