<template>
  <a-modal
    v-model:open="visible"
    title="确认兑换"
    :footer="null"
    :width="360"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <div class="checkout-modal-content">
      <!-- 商品清单 -->
      <div class="section goods-section">
        <div class="section-title">
          <ShoppingOutlined />
          <span>商品清单 ({{ items.length }}件)</span>
        </div>
        <div class="goods-list">
          <div v-for="item in items" :key="item.id" class="goods-item">
            <div class="goods-image" :style="{ background: item.color || '#f5f5f5' }"></div>
            <div class="goods-info">
              <div class="goods-name">{{ item.name }}</div>
              <div class="goods-spec" v-if="item.spec">{{ item.spec }}</div>
              <div class="goods-price">
                <span v-if="item.points" class="points">{{ item.points }}积分</span>
                <span v-if="item.price" class="price">+ ¥{{ item.price }}</span>
                <span class="quantity">× {{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 收货地址 -->
      <div class="section address-section">
        <div class="section-title">
          <EnvironmentOutlined />
          <span>收货地址</span>
        </div>
        <div v-if="selectedAddress" class="address-card" @click="showAddressDrawer = true">
          <div class="address-info">
            <div class="address-name">{{ selectedAddress.name }} {{ selectedAddress.phone }}</div>
            <div class="address-detail">{{ selectedAddress.address }}</div>
          </div>
          <RightOutlined class="arrow-icon" />
        </div>
        <div v-else class="address-empty" @click="showAddressDrawer = true">
          <PlusOutlined />
          <span>添加收货地址</span>
        </div>
      </div>

      <!-- 优惠券 -->
      <div class="section coupon-section">
        <div class="section-title">
          <GiftOutlined />
          <span>优惠券</span>
        </div>
        <div class="coupon-card" @click="showCouponDrawer = true">
          <div class="coupon-info">
            <span v-if="selectedCoupon">{{ selectedCoupon.name }} (已应用)</span>
            <span v-else class="coupon-placeholder">选择优惠券</span>
          </div>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>

      <!-- 费用明细 -->
      <div class="section summary-section">
        <div class="section-title">
          <WalletOutlined />
          <span>费用明细</span>
        </div>
        <div class="summary-list">
          <div class="summary-item" v-if="totalPoints > 0">
            <span>商品积分</span>
            <span class="value points">{{ totalPoints.toLocaleString() }}积分</span>
          </div>
          <div class="summary-item" v-if="totalPrice > 0">
            <span>商品金额</span>
            <span class="value">¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-item" v-if="couponDiscount > 0">
            <span>优惠券</span>
            <span class="value discount">-¥{{ couponDiscount.toFixed(2) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item total">
            <span>合计</span>
            <div class="total-value">
              <span v-if="totalPoints > 0" class="points">{{ totalPoints.toLocaleString() }}积分</span>
              <span v-if="finalPrice > 0" class="price">
                {{ totalPoints > 0 ? '+ ' : '' }}¥{{ finalPrice.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <a-button size="large" @click="handleCancel">取消</a-button>
        <a-button 
          type="primary" 
          size="large" 
          :loading="loading"
          :disabled="!selectedAddress"
          @click="handleConfirm"
        >
          确认兑换
        </a-button>
      </div>
    </div>

    <!-- 地址选择抽屉 -->
    <a-drawer
      v-model:open="showAddressDrawer"
      title="选择收货地址"
      placement="bottom"
      :height="400"
    >
      <div class="address-list">
        <div 
          v-for="addr in addresses" 
          :key="addr.id"
          :class="['address-item', { active: selectedAddress?.id === addr.id }]"
          @click="selectAddress(addr)"
        >
          <div class="address-content">
            <div class="address-header">
              <span class="name">{{ addr.name }}</span>
              <span class="phone">{{ addr.phone }}</span>
              <a-tag v-if="addr.isDefault" color="orange" size="small">默认</a-tag>
            </div>
            <div class="address-text">{{ addr.address }}</div>
          </div>
          <CheckCircleFilled v-if="selectedAddress?.id === addr.id" class="check-icon" />
        </div>
        <div class="add-address-btn" @click="handleAddAddress">
          <PlusOutlined />
          <span>新增收货地址</span>
        </div>
      </div>
    </a-drawer>

    <!-- 优惠券选择抽屉 -->
    <a-drawer
      v-model:open="showCouponDrawer"
      title="选择优惠券"
      placement="bottom"
      :height="400"
    >
      <div class="coupon-list">
        <div 
          v-for="coupon in availableCoupons" 
          :key="coupon.id"
          :class="['coupon-item', { active: selectedCoupon?.id === coupon.id, disabled: !coupon.available }]"
          @click="selectCoupon(coupon)"
        >
          <div class="coupon-amount">¥{{ coupon.amount }}</div>
          <div class="coupon-content">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-condition">{{ coupon.condition }}</div>
          </div>
          <CheckCircleFilled v-if="selectedCoupon?.id === coupon.id" class="check-icon" />
        </div>
        <div class="no-coupon-btn" @click="selectCoupon(null)">
          <span>不使用优惠券</span>
        </div>
      </div>
    </a-drawer>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ShoppingOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  WalletOutlined,
  RightOutlined,
  PlusOutlined,
  CheckCircleFilled
} from '@ant-design/icons-vue'

interface CartItem {
  id: number
  productId: number
  name: string
  image?: string
  color?: string
  price: number
  points: number
  quantity: number
  spec?: string
}

interface Address {
  id: number
  name: string
  phone: string
  address: string
  isDefault: boolean
}

interface Coupon {
  id: number
  name: string
  amount: number
  condition: string
  minAmount: number
  available: boolean
}

interface Props {
  modelValue: boolean
  items: CartItem[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const router = useRouter()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const showAddressDrawer = ref(false)
const showCouponDrawer = ref(false)

// 地址数据（模拟）
const addresses = ref<Address[]>([
  {
    id: 1,
    name: '张三',
    phone: '138****1234',
    address: '江苏省南京市玄武区中山路1号',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****5678',
    address: '江苏省南京市鼓楼区汉中路2号',
    isDefault: false
  }
])

const selectedAddress = ref<Address | null>(addresses.value.find(a => a.isDefault) || null)

// 优惠券数据（模拟）
const coupons = ref<Coupon[]>([
  {
    id: 1,
    name: '满200减20',
    amount: 20,
    condition: '满200元可用',
    minAmount: 200,
    available: true
  },
  {
    id: 2,
    name: '满500减50',
    amount: 50,
    condition: '满500元可用',
    minAmount: 500,
    available: false
  },
  {
    id: 3,
    name: '满100减10',
    amount: 10,
    condition: '满100元可用',
    minAmount: 100,
    available: true
  }
])

const selectedCoupon = ref<Coupon | null>(null)

// 计算总积分
const totalPoints = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.points || 0) * item.quantity, 0)
})

// 计算总金额
const totalPrice = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
})

// 计算可用优惠券
const availableCoupons = computed(() => {
  return coupons.value.map(coupon => ({
    ...coupon,
    available: totalPrice.value >= coupon.minAmount
  }))
})

// 优惠券折扣
const couponDiscount = computed(() => {
  return selectedCoupon.value?.amount || 0
})

// 最终金额
const finalPrice = computed(() => {
  return Math.max(0, totalPrice.value - couponDiscount.value)
})

// 自动选择最优优惠券
watch(() => props.modelValue, (val) => {
  if (val && !selectedCoupon.value) {
    const bestCoupon = availableCoupons.value
      .filter(c => c.available)
      .sort((a, b) => b.amount - a.amount)[0]
    if (bestCoupon) {
      selectedCoupon.value = bestCoupon
    }
  }
})

// 选择地址
const selectAddress = (addr: Address) => {
  selectedAddress.value = addr
  showAddressDrawer.value = false
}

// 添加地址
const handleAddAddress = () => {
  showAddressDrawer.value = false
  message.info('跳转到添加地址页面')
  // router.push('/address/add')
}

// 选择优惠券
const selectCoupon = (coupon: Coupon | null) => {
  if (coupon && !coupon.available) {
    message.warning(`需要满${coupon.minAmount}元才能使用`)
    return
  }
  selectedCoupon.value = coupon
  showCouponDrawer.value = false
}

// 取消
const handleCancel = () => {
  visible.value = false
}

// 确认兑换
const handleConfirm = async () => {
  if (!selectedAddress.value) {
    message.warning('请选择收货地址')
    return
  }

  try {
    loading.value = true
    
    // 模拟订单创建
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const orderId = `${Date.now()}`
    
    // 关闭 Modal
    visible.value = false
    
    // 触发成功事件
    emit('success', orderId)
    
    // 判断是否需要支付
    const needPayment = finalPrice.value > 0
    
    if (needPayment) {
      // 需要支付 -> 跳转收银台
      message.success('订单创建成功，请完成支付')
      
      // 准备收银台数据
      const cashierData = {
        orderNo: orderId,
        itemCount: props.items.length,
        address: selectedAddress.value.address,
        points: totalPoints.value,
        couponDiscount: couponDiscount.value,
        payAmount: finalPrice.value
      }
      
      setTimeout(() => {
        router.push({
          path: '/cashier',
          query: {
            data: encodeURIComponent(JSON.stringify(cashierData))
          }
        })
      }, 500)
    } else {
      // 纯积分兑换 -> 直接完成
      message.success('兑换成功！')
      setTimeout(() => {
        router.push(`/order-detail/${orderId}`)
      }, 500)
    }
    
  } catch (error: any) {
    message.error(error.message || '兑换失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

/* 区块样式 */
.section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section:last-of-type {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.section-title .anticon {
  color: #FF6B35;
}

/* 商品清单 */
.goods-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goods-item {
  display: flex;
  gap: 12px;
}

.goods-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  min-width: 0;
}

.goods-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-spec {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.goods-price {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.goods-price .points {
  color: #FF6B35;
  font-weight: 600;
}

.goods-price .price {
  color: #666;
}

.goods-price .quantity {
  color: #999;
}

/* 地址卡片 */
.address-card,
.address-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-card:hover,
.address-empty:hover {
  background: #f0f0f0;
}

.address-info {
  flex: 1;
}

.address-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.address-detail {
  font-size: 12px;
  color: #666;
}

.address-empty {
  justify-content: center;
  gap: 6px;
  color: #999;
}

.arrow-icon {
  color: #999;
  font-size: 12px;
}

/* 优惠券卡片 */
.coupon-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #fff5f0;
  border: 1px solid #ffe0d0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-card:hover {
  background: #ffebdd;
}

.coupon-info {
  flex: 1;
  font-size: 13px;
  color: #FF6B35;
  font-weight: 500;
}

.coupon-placeholder {
  color: #999;
}

/* 费用明细 */
.summary-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #666;
}

.summary-item .value {
  font-weight: 500;
  color: #333;
}

.summary-item .value.points {
  color: #FF6B35;
}

.summary-item .value.discount {
  color: #52c41a;
}

.summary-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 4px 0;
}

.summary-item.total {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.total-value {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.total-value .points {
  color: #FF6B35;
  font-size: 15px;
}

.total-value .price {
  color: #333;
  font-size: 15px;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.actions button {
  flex: 1;
}

/* 地址列表 */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-item.active {
  background: #fff5f0;
  border: 1px solid #FF6B35;
}

.address-item:hover {
  background: #f0f0f0;
}

.address-content {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.address-header .name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.address-header .phone {
  font-size: 13px;
  color: #666;
}

.address-text {
  font-size: 13px;
  color: #666;
}

.check-icon {
  color: #FF6B35;
  font-size: 20px;
}

.add-address-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px;
  background: white;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.add-address-btn:hover {
  border-color: #FF6B35;
  color: #FF6B35;
}

/* 优惠券列表 */
.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff5f0;
  border: 1px solid #ffe0d0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-item.active {
  border-color: #FF6B35;
  box-shadow: 0 0 0 1px #FF6B35;
}

.coupon-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.coupon-item:not(.disabled):hover {
  background: #ffebdd;
}

.coupon-amount {
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
  min-width: 70px;
  text-align: center;
}

.coupon-content {
  flex: 1;
}

.coupon-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.coupon-condition {
  font-size: 12px;
  color: #999;
}

.no-coupon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.no-coupon-btn:hover {
  border-color: #FF6B35;
  color: #FF6B35;
}
</style>

