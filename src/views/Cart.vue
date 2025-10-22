<template>
  <div class="cart-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <LeftOutlined class="back-icon" @click="$router.back()" />
      <span class="title">购物车 ({{ cartStore.totalItems }})</span>
      <DeleteOutlined 
        class="delete-icon" 
        @click="handleClearSelected"
        v-if="cartStore.selectedItems.length > 0"
      />
    </div>

    <!-- 购物车为空 -->
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <div class="empty-icon">
        <ShoppingCartOutlined />
      </div>
      <p class="empty-text">购物车还是空的</p>
      <p class="empty-hint">快去挑选心仪的商品吧~</p>
      <a-button type="primary" size="large" @click="goToMall">去逛逛</a-button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-content">
      <!-- 商品列表 -->
      <div class="cart-items">
        <div class="cart-item" v-for="item in cartStore.items" :key="item.id">
          <!-- 选择框 -->
          <a-checkbox 
            :checked="item.selected" 
            @change="() => cartStore.toggleSelect(item.id)"
            class="item-checkbox"
          />
          
          <!-- 商品图片 -->
          <div class="item-image" @click="goToProduct(item)">
            <div class="image-wrapper" :style="{ background: item.image }"></div>
          </div>
          
          <!-- 商品信息 -->
          <div class="item-info">
            <h3 class="item-name" @click="goToProduct(item)">{{ item.name }}</h3>
            
            <!-- 价格信息 -->
            <div class="item-price-row">
              <div class="price-group">
                <span class="points-price" v-if="item.points > 0">
                  {{ item.points.toLocaleString() }} 积分
                </span>
                <span class="cash-price" v-if="item.price > 0">
                  + ¥{{ item.price.toFixed(2) }}
                </span>
                <span class="pure-points" v-if="item.price === 0 && item.points > 0">
                  纯积分兑换
                </span>
              </div>
            </div>
            
            <!-- 数量控制 -->
            <div class="item-footer">
              <div class="item-quantity">
                <a-button 
                  size="small" 
                  :disabled="item.quantity <= 1"
                  @click="() => cartStore.decreaseQuantity(item.id)"
                  class="quantity-btn"
                >
                  <MinusOutlined />
                </a-button>
                <span class="quantity-text">{{ item.quantity }}</span>
                <a-button 
                  size="small"
                  :disabled="item.quantity >= item.stock"
                  @click="() => cartStore.increaseQuantity(item.id)"
                  class="quantity-btn"
                >
                  <PlusOutlined />
                </a-button>
              </div>
              
              <!-- 删除按钮 -->
              <DeleteOutlined 
                class="item-delete-btn" 
                @click="() => handleRemoveItem(item)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 优惠信息卡片 -->
      <div class="benefits-card">
        <div class="benefit-item" @click="showCouponDrawer = true">
          <div class="benefit-left">
            <GiftOutlined class="benefit-icon" />
            <span class="benefit-label">优惠券</span>
          </div>
          <div class="benefit-right">
            <span class="benefit-value" v-if="selectedCoupon">
              已选 {{ selectedCoupon.discount }}元券
            </span>
            <span class="benefit-hint" v-else>
              {{ availableCoupons.length }}张可用
            </span>
            <RightOutlined class="benefit-arrow" />
          </div>
        </div>
      </div>

      <!-- 推荐商品 -->
      <div class="recommend-section" v-if="recommendItems.length > 0">
        <div class="recommend-header">
          <h3 class="recommend-title">
            <FireOutlined style="color: #FF4444; margin-right: 6px;" />
            猜你喜欢
          </h3>
        </div>
        <div class="recommend-grid">
          <div 
            class="recommend-item" 
            v-for="item in recommendItems" 
            :key="item.id"
            @click="goToRecommendProduct(item)"
          >
            <div class="recommend-image" :style="{ background: item.image }"></div>
            <p class="recommend-name">{{ item.name }}</p>
            <div class="recommend-footer">
              <span class="recommend-points">{{ item.points.toLocaleString() }}积分</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="bottom-bar" v-if="cartStore.items.length > 0">
      <div class="bottom-left">
        <a-checkbox 
          :checked="cartStore.isAllSelected" 
          @change="cartStore.toggleSelectAll"
          class="select-all-checkbox"
        >
          全选
        </a-checkbox>
      </div>
      
      <div class="bottom-right">
        <div class="price-summary">
          <div class="summary-row">
            <span class="summary-label">合计:</span>
            <div class="summary-value">
              <span class="total-points">{{ cartStore.totalPoints.toLocaleString() }}积分</span>
              <span class="total-cash" v-if="cartStore.totalPrice > 0">
                + ¥{{ cartStore.totalPrice.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
        
        <a-button 
          type="primary" 
          size="large"
          class="checkout-btn"
          :disabled="cartStore.selectedItems.length === 0"
          @click="handleCheckout"
        >
          结算({{ cartStore.selectedCount }})
        </a-button>
      </div>
    </div>

    <!-- 优惠券抽屉 -->
    <a-drawer
      v-model:open="showCouponDrawer"
      title="选择优惠券"
      placement="bottom"
      height="60%"
    >
      <div class="coupon-list">
        <div 
          v-for="coupon in availableCoupons" 
          :key="coupon.id"
          class="coupon-card"
          :class="{ 'selected': selectedCoupon?.id === coupon.id }"
          @click="selectCoupon(coupon)"
        >
          <div class="coupon-amount">¥{{ coupon.discount }}</div>
          <div class="coupon-info">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-condition">满{{ coupon.minAmount }}元可用</div>
            <div class="coupon-expire">有效期至 {{ coupon.expireDate }}</div>
          </div>
          <div class="coupon-check">
            <CheckCircleFilled v-if="selectedCoupon?.id === coupon.id" />
          </div>
        </div>
        
        <!-- 不使用优惠券选项 -->
        <div 
          class="coupon-card no-coupon"
          :class="{ 'selected': !selectedCoupon }"
          @click="selectCoupon(null)"
        >
          <div class="no-coupon-text">不使用优惠券</div>
          <div class="coupon-check">
            <CheckCircleFilled v-if="!selectedCoupon" />
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- 结算 Modal -->
    <CheckoutModal 
      v-model="showCheckoutModal"
      :items="cartStore.selectedItems"
      @success="handleCheckoutSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useCartStore } from '@/stores/cart'

// 异步加载大型组件
const CheckoutModal = defineAsyncComponent(() =>
  import('@/components/CheckoutModal.vue')
)
import {
  LeftOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
  GiftOutlined,
  RightOutlined,
  CheckCircleFilled,
  FireOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const cartStore = useCartStore()

// 优惠券相关
const showCouponDrawer = ref(false)
const selectedCoupon = ref<any>(null)

// 结算 Modal
const showCheckoutModal = ref(false)

// 模拟优惠券数据
const availableCoupons = ref([
  {
    id: 1,
    name: '全场通用券',
    discount: 20,
    minAmount: 100,
    expireDate: '2025-12-31'
  },
  {
    id: 2,
    name: '积分商城专享',
    discount: 50,
    minAmount: 300,
    expireDate: '2025-11-30'
  },
  {
    id: 3,
    name: '新人专享券',
    discount: 30,
    minAmount: 200,
    expireDate: '2025-10-31'
  }
])

// 推荐商品
const recommendItems = ref([
  {
    id: 101,
    name: '小米无线充电器',
    points: 8000,
    image: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  {
    id: 102,
    name: '蓝牙音箱',
    points: 15000,
    image: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
  },
  {
    id: 103,
    name: '运动手环',
    points: 12000,
    image: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
  },
  {
    id: 104,
    name: '保温杯',
    points: 6000,
    image: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
  }
])

// 初始化
onMounted(() => {
  cartStore.init()
})

// 跳转到商品详情
const goToProduct = (item: any) => {
  router.push(`/product/${item.productId}`)
}

// 跳转到推荐商品
const goToRecommendProduct = (item: any) => {
  router.push(`/product/${item.id}`)
}

// 跳转到商城
const goToMall = () => {
  router.push('/points-mall')
}

// 删除商品
const handleRemoveItem = (item: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除"${item.name}"吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      cartStore.removeItem(item.id)
      message.success('已删除')
    }
  })
}

// 清空选中商品
const handleClearSelected = () => {
  Modal.confirm({
    title: '确认清空',
    content: `确定要删除选中的 ${cartStore.selectedItems.length} 件商品吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      cartStore.clearSelected()
      message.success('已清空')
    }
  })
}

// 选择优惠券
const selectCoupon = (coupon: any) => {
  selectedCoupon.value = coupon
  showCouponDrawer.value = false
  if (coupon) {
    message.success(`已选择 ${coupon.name}`)
  }
}

// 结算
const handleCheckout = () => {
  if (cartStore.selectedItems.length === 0) {
    message.warning('请选择要结算的商品')
    return
  }
  
  // 检查积分是否足够（这里需要从用户信息获取）
  const userPoints = 50000 // 模拟用户积分
  if (cartStore.totalPoints > userPoints) {
    message.error('积分不足，请调整商品数量或去赚取积分')
    return
  }
  
  // 打开结算 Modal
  showCheckoutModal.value = true
}

// 结算成功回调
const handleCheckoutSuccess = (orderId: string) => {
  // 清空已选中的商品
  cartStore.selectedItems.forEach(item => {
    cartStore.removeItem(item.id)
  })
  message.success('已清空已兑换的商品')
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.top-bar {
  background: #fff;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.back-icon,
.delete-icon {
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.delete-icon {
  color: #FF4444;
}

.title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

/* 空购物车 */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 100px;
  color: #DDD;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: #999;
  margin-bottom: 30px;
}

/* 购物车内容 */
.cart-content {
  padding-bottom: 20px;
}

/* 商品列表 */
.cart-items {
  background: #fff;
  margin-bottom: 10px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  gap: 12px;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-checkbox {
  margin-top: 30px;
}

.item-image {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  cursor: pointer;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin: 0;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-group {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.points-price {
  font-size: 16px;
  font-weight: 600;
  color: #FF6B35;
}

.cash-price {
  font-size: 14px;
  color: #FF6B35;
}

.pure-points {
  font-size: 12px;
  color: #52c41a;
  background: #f6ffed;
  padding: 2px 8px;
  border-radius: 4px;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.quantity-text {
  font-size: 15px;
  color: #333;
  min-width: 30px;
  text-align: center;
}

.item-delete-btn {
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.item-delete-btn:hover {
  color: #FF4444;
}

/* 优惠信息卡片 */
.benefits-card {
  background: #fff;
  margin-bottom: 10px;
}

.benefit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  cursor: pointer;
}

.benefit-item:active {
  background: #f5f5f5;
}

.benefit-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.benefit-icon {
  font-size: 18px;
  color: #FF6B35;
}

.benefit-label {
  font-size: 15px;
  color: #333;
}

.benefit-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.benefit-value {
  font-size: 14px;
  color: #FF6B35;
}

.benefit-hint {
  font-size: 14px;
  color: #999;
}

.benefit-arrow {
  font-size: 12px;
  color: #999;
}

/* 推荐商品 */
.recommend-section {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.recommend-header {
  margin-bottom: 15px;
}

.recommend-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.recommend-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.recommend-item:active {
  transform: scale(0.98);
}

.recommend-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  margin-bottom: 8px;
}

.recommend-name {
  font-size: 14px;
  color: #333;
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.recommend-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.recommend-points {
  font-size: 15px;
  font-weight: 600;
  color: #FF6B35;
}

/* 底部结算栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.bottom-left {
  flex-shrink: 0;
}

.select-all-checkbox {
  font-size: 14px;
}

.bottom-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
}

.price-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.summary-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.summary-label {
  font-size: 13px;
  color: #666;
}

.summary-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-points {
  font-size: 18px;
  font-weight: 700;
  color: #FF6B35;
}

.total-cash {
  font-size: 14px;
  color: #FF6B35;
}

.checkout-btn {
  height: 44px;
  padding: 0 30px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 600;
}

/* 优惠券抽屉 */
.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background: linear-gradient(135deg, #FFF5F0 0%, #FFE8DD 100%);
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-card.selected {
  border-color: #FF6B35;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);
}

.coupon-amount {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B35;
  margin-right: 15px;
  min-width: 80px;
  text-align: center;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.coupon-condition {
  font-size: 13px;
  color: #666;
  margin-bottom: 2px;
}

.coupon-expire {
  font-size: 12px;
  color: #999;
}

.coupon-check {
  font-size: 24px;
  color: #FF6B35;
  margin-left: 10px;
}

.coupon-card.no-coupon {
  background: #f5f5f5;
  justify-content: center;
}

.no-coupon-text {
  font-size: 15px;
  color: #666;
  flex: 1;
  text-align: center;
}
</style>

