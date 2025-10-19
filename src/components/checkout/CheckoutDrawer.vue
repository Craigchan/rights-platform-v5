<template>
  <a-drawer
    v-model:open="visible"
    title="确认订单"
    placement="bottom"
    :height="'80%'"
    :closable="true"
    @close="handleClose"
  >
    <div class="checkout-drawer">
      <!-- 商品信息 -->
      <div class="section">
        <h3 class="section-title">商品信息</h3>
        <div class="product-item">
          <img :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-spec">{{ product.spec }}</div>
            <div class="product-price">¥{{ product.price }}</div>
          </div>
          <div class="product-quantity">x{{ quantity }}</div>
        </div>
      </div>

      <!-- 收货地址 -->
      <div class="section" @click="selectAddress">
        <h3 class="section-title">收货地址</h3>
        <div v-if="selectedAddress" class="address-info">
          <div class="address-header">
            <span class="address-name">{{ selectedAddress.name }}</span>
            <span class="address-phone">{{ selectedAddress.phone }}</span>
          </div>
          <div class="address-detail">{{ selectedAddress.address }}</div>
        </div>
        <div v-else class="address-empty">
          <PlusOutlined />
          <span>添加收货地址</span>
        </div>
      </div>

      <!-- 优惠券 -->
      <div class="section" @click="selectCoupon">
        <h3 class="section-title">优惠券</h3>
        <div class="coupon-selector">
          <span v-if="selectedCoupon">-¥{{ selectedCoupon.amount }}</span>
          <span v-else>{{ availableCoupons.length }}张可用</span>
          <RightOutlined />
        </div>
      </div>

      <!-- 积分抵扣 -->
      <div class="section">
        <h3 class="section-title">积分抵扣</h3>
        <div class="points-selector">
          <span>可用{{ userPoints }}积分</span>
          <a-switch v-model:checked="usePoints" @change="handlePointsChange" />
        </div>
        <div v-if="usePoints" class="points-input">
          <a-input-number 
            v-model:value="pointsToUse" 
            :min="0" 
            :max="maxPointsToUse"
            :step="100"
          />
          <span class="points-tip">{{ pointsToUse }}积分 = ¥{{ pointsDiscount }}</span>
        </div>
      </div>

      <!-- 价格明细 -->
      <div class="section">
        <div class="price-row">
          <span>商品金额</span>
          <span>¥{{ productTotal }}</span>
        </div>
        <div class="price-row" v-if="selectedCoupon">
          <span>优惠券</span>
          <span class="discount">-¥{{ selectedCoupon.amount }}</span>
        </div>
        <div class="price-row" v-if="usePoints">
          <span>积分抵扣</span>
          <span class="discount">-¥{{ pointsDiscount }}</span>
        </div>
        <div class="price-row total">
          <span>实付款</span>
          <span class="total-amount">¥{{ finalAmount }}</span>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="bottom-bar">
        <div class="total-info">
          <div class="total-label">合计</div>
          <div class="total-price">¥{{ finalAmount }}</div>
        </div>
        <button class="submit-btn" @click="handleSubmit">
          提交订单
        </button>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined, RightOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Product {
  id: number
  name: string
  price: number
  image: string
  spec: string
}

interface Props {
  modelValue: boolean
  product: Product
  quantity?: number
}

const props = withDefaults(defineProps<Props>(), {
  quantity: 1
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 收货地址
const selectedAddress = ref({
  name: '张三',
  phone: '138****1234',
  address: '江苏省南京市玄武区中山路1号'
})

// 优惠券
const availableCoupons = ref([
  { id: 1, amount: 30, name: '满100减30' },
  { id: 2, amount: 50, name: '满200减50' }
])
const selectedCoupon = ref(null)

// 积分
const userPoints = ref(1000)
const usePoints = ref(false)
const pointsToUse = ref(0)
const maxPointsToUse = computed(() => Math.min(userPoints.value, props.product.price * 100))
const pointsDiscount = computed(() => Math.floor(pointsToUse.value / 100))

// 价格计算
const productTotal = computed(() => props.product.price * props.quantity)
const finalAmount = computed(() => {
  let amount = productTotal.value
  if (selectedCoupon.value) {
    amount -= selectedCoupon.value.amount
  }
  if (usePoints.value) {
    amount -= pointsDiscount.value
  }
  return Math.max(0, amount)
})

const selectAddress = () => {
  message.info('选择收货地址')
}

const selectCoupon = () => {
  message.info('选择优惠券')
}

const handlePointsChange = (checked: boolean) => {
  if (checked) {
    pointsToUse.value = Math.min(100, maxPointsToUse.value)
  } else {
    pointsToUse.value = 0
  }
}

const handleClose = () => {
  visible.value = false
}

const handleSubmit = () => {
  if (!selectedAddress.value) {
    message.error('请选择收货地址')
    return
  }
  
  const orderData = {
    product: props.product,
    quantity: props.quantity,
    address: selectedAddress.value,
    coupon: selectedCoupon.value,
    points: usePoints.value ? pointsToUse.value : 0,
    totalAmount: finalAmount.value
  }
  
  emit('submit', orderData)
  message.success('订单提交成功!')
  visible.value = false
}
</script>

<style scoped>
.checkout-drawer {
  padding-bottom: 80px;
}

.section {
  background: white;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px;
}

.product-item {
  display: flex;
  gap: 12px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.product-spec {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #FF6B35;
}

.product-quantity {
  color: #999;
  font-size: 14px;
}

.address-info {
  cursor: pointer;
}

.address-header {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.address-name {
  font-weight: 600;
  color: #333;
}

.address-phone {
  color: #666;
}

.address-detail {
  color: #666;
  font-size: 14px;
}

.address-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  cursor: pointer;
}

.coupon-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.points-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-input {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.points-tip {
  font-size: 13px;
  color: #FF6B35;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #666;
}

.price-row.total {
  border-top: 1px dashed #e8e8e8;
  margin-top: 8px;
  padding-top: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.discount {
  color: #FF6B35;
}

.total-amount {
  color: #FF6B35;
  font-size: 20px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
}

.total-info {
  flex: 1;
}

.total-label {
  font-size: 12px;
  color: #999;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
  color: #FF6B35;
}

.submit-btn {
  background: #FF6B35;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:active {
  transform: scale(0.95);
}
</style>

