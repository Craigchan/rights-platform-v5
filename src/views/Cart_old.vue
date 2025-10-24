<template>
  <div class="cart-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <ArrowLeftOutlined class="back-icon" @click="$router.back()" />
      <span class="title">购物车 ({{ totalItems }})</span>
      <EditOutlined class="edit-icon" @click="toggleEditMode" />
    </div>

    <!-- 购物车为空 -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <ShoppingCartOutlined style="font-size: 80px; color: #DDD;" />
      <p class="empty-text">购物车还是空的</p>
      <a-button type="primary" @click="goToHome">去逛逛</a-button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-content">
      <!-- 商品列表 -->
      <div class="cart-items">
        <div class="cart-item" v-for="item in cartItems" :key="item.id">
          <a-checkbox 
            v-model:checked="item.checked" 
            @change="onItemCheck"
            class="item-checkbox"
          />
          <div class="item-image" @click="goToProduct(item)">
            <img v-img-fallback :src="item.image" :alt="item.name" />
          </div>
          <div class="item-info">
            <h3 class="item-name" @click="goToProduct(item)">{{ item.name }}</h3>
            <p class="item-spec">{{ item.spec }}</p>
            <div class="item-tags" v-if="item.tags && item.tags.length > 0">
              <a-tag v-for="tag in item.tags" :key="tag" color="red" size="small">{{ tag }}</a-tag>
            </div>
            <div class="item-footer">
              <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
              <div class="item-quantity">
                <a-button 
                  size="small" 
                  :disabled="item.quantity <= 1"
                  @click="decreaseQuantity(item)"
                >
                  <MinusOutlined />
                </a-button>
                <span class="quantity-text">{{ item.quantity }}</span>
                <a-button 
                  size="small"
                  :disabled="item.quantity >= item.stock"
                  @click="increaseQuantity(item)"
                >
                  <PlusOutlined />
                </a-button>
              </div>
            </div>
          </div>
          <DeleteOutlined 
            class="item-delete" 
            @click="removeItem(item)"
            v-if="isEditMode"
          />
        </div>
      </div>

      <!-- 优惠券选择 -->
      <div class="coupon-section" @click="showCouponModal = true">
        <div class="coupon-left">
          <GiftOutlined style="color: #FF4444; margin-right: 8px;" />
          <span>优惠券</span>
        </div>
        <div class="coupon-right">
          <span class="coupon-text" v-if="selectedCoupon">
            -¥{{ selectedCoupon.amount }}
          </span>
          <span class="coupon-text" v-else style="color: #999;">
            {{ availableCoupons.length }}张可用
          </span>
          <RightOutlined style="margin-left: 8px; color: #999;" />
        </div>
      </div>

      <!-- 积分抵扣 -->
      <div class="points-section">
        <div class="points-left">
          <StarOutlined style="color: #FFD700; margin-right: 8px;" />
          <span>积分抵扣</span>
          <span class="points-balance">(可用{{ userPoints }}积分)</span>
        </div>
        <div class="points-right">
          <a-switch 
            v-model:checked="usePoints" 
            @change="onPointsChange"
            size="small"
          />
          <span class="points-discount" v-if="usePoints">
            -¥{{ pointsDiscount.toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- 推荐商品 -->
      <div class="recommend-section">
        <h3 class="recommend-title">猜你喜欢</h3>
        <div class="recommend-grid">
          <div 
            class="recommend-item" 
            v-for="item in recommendItems" 
            :key="item.id"
            @click="goToProduct(item)"
          >
            <div class="recommend-image">
              <img v-img-fallback :src="item.image" :alt="item.name" />
            </div>
            <p class="recommend-name">{{ item.name }}</p>
            <div class="recommend-footer">
              <span class="recommend-price">¥{{ item.price }}</span>
              <a-button size="small" type="primary" @click.stop="addToCart(item)">
                <PlusOutlined />
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="bottom-bar" v-if="cartItems.length > 0">
      <div class="bottom-left">
        <a-checkbox 
          v-model:checked="selectAll" 
          @change="onSelectAll"
        >
          全选
        </a-checkbox>
      </div>
      <div class="bottom-right">
        <div class="price-info">
          <div class="price-row">
            <span class="price-label">合计:</span>
            <span class="price-value">¥{{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="price-row discount" v-if="totalDiscount > 0">
            <span class="price-label">优惠:</span>
            <span class="price-value">-¥{{ totalDiscount.toFixed(2) }}</span>
          </div>
          <div class="price-row total">
            <span class="price-label">实付:</span>
            <span class="price-value final">¥{{ finalPrice.toFixed(2) }}</span>
          </div>
        </div>
        <a-button 
          type="primary" 
          size="large"
          :disabled="checkedItems.length === 0"
          @click="goToCheckout"
        >
          结算({{ checkedItems.length }})
        </a-button>
      </div>
    </div>

    <!-- 优惠券选择弹窗 -->
    <a-modal
      v-model:open="showCouponModal"
      title="选择优惠券"
      :footer="null"
      :width="360"
    >
      <div class="coupon-list">
        <div 
          class="coupon-item"
          :class="{ 'selected': selectedCoupon?.id === coupon.id, 'disabled': !coupon.available }"
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          @click="selectCoupon(coupon)"
        >
          <div class="coupon-left-part">
            <div class="coupon-amount">¥{{ coupon.amount }}</div>
            <div class="coupon-condition">{{ coupon.condition }}</div>
          </div>
          <div class="coupon-right-part">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-expire">有效期至 {{ coupon.expireDate }}</div>
            <CheckCircleFilled 
              v-if="selectedCoupon?.id === coupon.id"
              class="coupon-check"
            />
          </div>
        </div>
        <div class="coupon-item disabled" @click="selectCoupon(null)">
          <div class="coupon-left-part">
            <div class="coupon-amount">不使用</div>
          </div>
          <div class="coupon-right-part">
            <CheckCircleFilled 
              v-if="!selectedCoupon"
              class="coupon-check"
            />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  GiftOutlined,
  RightOutlined,
  StarOutlined,
  CheckCircleFilled
} from '@ant-design/icons-vue'

const router = useRouter()

// 编辑模式
const isEditMode = ref(false)

// 购物车商品
const cartItems = ref([
  {
    id: 1,
    name: '南京队主场球衣 2025赛季',
    spec: '规格: 红色/L',
    price: 299,
    quantity: 1,
    stock: 10,
    checked: true,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cdefs%3E%3ClinearGradient id="c1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23c1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="14" font-weight="bold" font-family="Arial"%3E球衣%3C/text%3E%3C/svg%3E',
    tags: ['苏超专属']
  },
  {
    id: 2,
    name: '苏超限定围巾',
    spec: '规格: 经典款',
    price: 89,
    quantity: 2,
    stock: 20,
    checked: true,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cdefs%3E%3ClinearGradient id="c2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23c2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="14" font-weight="bold" font-family="Arial"%3E围巾%3C/text%3E%3C/svg%3E',
    tags: ['热销']
  },
  {
    id: 3,
    name: '球队徽章套装',
    spec: '规格: 12支球队',
    price: 59,
    quantity: 1,
    stock: 15,
    checked: false,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cdefs%3E%3ClinearGradient id="c3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23c3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="14" font-weight="bold" font-family="Arial"%3E徽章%3C/text%3E%3C/svg%3E',
    tags: []
  }
])

// 用户积分
const userPoints = ref(15280)

// 是否使用积分
const usePoints = ref(false)

// 优惠券
const availableCoupons = ref([
  {
    id: 1,
    name: '全场通用券',
    amount: 20,
    condition: '满100可用',
    expireDate: '2025-12-31',
    available: true,
    minAmount: 100
  },
  {
    id: 2,
    name: '苏超专属券',
    amount: 50,
    condition: '满300可用',
    expireDate: '2025-11-30',
    available: true,
    minAmount: 300
  },
  {
    id: 3,
    name: '新人专享券',
    amount: 30,
    condition: '满200可用',
    expireDate: '2025-10-31',
    available: false,
    minAmount: 200
  }
])

// 选中的优惠券
const selectedCoupon = ref<any>(null)

// 优惠券弹窗
const showCouponModal = ref(false)

// 推荐商品
const recommendItems = ref([
  {
    id: 101,
    name: '苏超纪念帽',
    price: 79,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Cdefs%3E%3ClinearGradient id="r1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="150" height="150" fill="url(%23r1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E帽子%3C/text%3E%3C/svg%3E'
  },
  {
    id: 102,
    name: '球队水杯',
    price: 49,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Cdefs%3E%3ClinearGradient id="r2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="150" height="150" fill="url(%23r2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E水杯%3C/text%3E%3C/svg%3E'
  },
  {
    id: 103,
    name: '运动背包',
    price: 159,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Cdefs%3E%3ClinearGradient id="r3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="150" height="150" fill="url(%23r3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E背包%3C/text%3E%3C/svg%3E'
  },
  {
    id: 104,
    name: '球迷手环',
    price: 29,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Cdefs%3E%3ClinearGradient id="r4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="150" height="150" fill="url(%23r4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E手环%3C/text%3E%3C/svg%3E'
  }
])

// 计算属性
const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const checkedItems = computed(() => {
  return cartItems.value.filter(item => item.checked)
})

const subtotal = computed(() => {
  return checkedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const couponDiscount = computed(() => {
  if (!selectedCoupon.value) return 0
  if (subtotal.value < selectedCoupon.value.minAmount) {
    return 0
  }
  return selectedCoupon.value.amount
})

const pointsDiscount = computed(() => {
  if (!usePoints.value) return 0
  // 100积分抵扣1元,最多抵扣订单金额的10%
  const maxDiscount = subtotal.value * 0.1
  const pointsValue = userPoints.value / 100
  return Math.min(maxDiscount, pointsValue)
})

const totalDiscount = computed(() => {
  return couponDiscount.value + pointsDiscount.value
})

const finalPrice = computed(() => {
  return Math.max(0, subtotal.value - totalDiscount.value)
})

const selectAll = computed({
  get: () => cartItems.value.length > 0 && cartItems.value.every(item => item.checked),
  set: (value) => {
    cartItems.value.forEach(item => item.checked = value)
  }
})

// 方法
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const onItemCheck = () => {
  // 检查优惠券是否还可用
  if (selectedCoupon.value && subtotal.value < selectedCoupon.value.minAmount) {
    message.warning(`订单金额不满足优惠券使用条件(满${selectedCoupon.value.minAmount}可用)`)
  }
}

const onSelectAll = () => {
  // selectAll的setter会自动处理
}

const decreaseQuantity = (item: any) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const increaseQuantity = (item: any) => {
  if (item.quantity < item.stock) {
    item.quantity++
  } else {
    message.warning('库存不足')
  }
}

const removeItem = (item: any) => {
  const index = cartItems.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    cartItems.value.splice(index, 1)
    message.success('已移除')
  }
}

const selectCoupon = (coupon: any) => {
  if (coupon && !coupon.available) {
    message.warning('该优惠券不可用')
    return
  }
  if (coupon && subtotal.value < coupon.minAmount) {
    message.warning(`订单金额不满足优惠券使用条件(满${coupon.minAmount}可用)`)
    return
  }
  selectedCoupon.value = coupon
  showCouponModal.value = false
  if (coupon) {
    message.success(`已选择优惠券: ${coupon.name}`)
  }
}

const onPointsChange = (checked: boolean) => {
  if (checked) {
    message.success(`使用${Math.floor(pointsDiscount.value * 100)}积分抵扣¥${pointsDiscount.value.toFixed(2)}`)
  }
}

const goToHome = () => {
  router.push('/')
}

const goToProduct = (item: any) => {
  message.info('商品详情功能开发中')
}

const addToCart = (item: any) => {
  message.success(`已添加${item.name}到购物车`)
}

const goToCheckout = () => {
  if (checkedItems.value.length === 0) {
    message.warning('请选择要结算的商品')
    return
  }
  
  // 保存结算信息到本地存储
  const checkoutData = {
    items: checkedItems.value,
    coupon: selectedCoupon.value,
    usePoints: usePoints.value,
    pointsDiscount: pointsDiscount.value,
    subtotal: subtotal.value,
    totalDiscount: totalDiscount.value,
    finalPrice: finalPrice.value
  }
  localStorage.setItem('checkoutData', JSON.stringify(checkoutData))
  
  router.push('/checkout')
}
</script>

<style scoped lang="scss">
.cart-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 80px;
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #F0F0F0;

  .back-icon,
  .edit-icon {
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    color: #333;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;

  .empty-text {
    font-size: 16px;
    color: #999;
    margin: 20px 0;
  }
}

.cart-content {
  padding-bottom: 20px;
}

.cart-items {
  background: white;
  margin-bottom: 12px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-bottom: 1px solid #F0F0F0;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  .item-checkbox {
    margin-right: 12px;
    margin-top: 30px;
  }

  .item-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 12px;
    flex-shrink: 0;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-info {
    flex: 1;
    min-width: 0;

    .item-name {
      font-size: 15px;
      font-weight: 500;
      margin: 0 0 4px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      &:hover {
        color: #1890ff;
      }
    }

    .item-spec {
      font-size: 13px;
      color: #999;
      margin: 0 0 4px;
    }

    .item-tags {
      margin-bottom: 8px;
    }

    .item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;

      .item-price {
        font-size: 18px;
        font-weight: bold;
        color: #FF4444;
      }

      .item-quantity {
        display: flex;
        align-items: center;
        gap: 8px;

        .quantity-text {
          min-width: 30px;
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }

  .item-delete {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 20px;
    color: #FF4444;
    cursor: pointer;
    padding: 4px;

    &:hover {
      color: #FF0000;
    }
  }
}

.coupon-section,
.points-section {
  background: white;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  .coupon-left,
  .points-left {
    display: flex;
    align-items: center;
    font-size: 15px;

    .points-balance {
      font-size: 12px;
      color: #999;
      margin-left: 4px;
    }
  }

  .coupon-right,
  .points-right {
    display: flex;
    align-items: center;

    .coupon-text {
      font-size: 14px;
      color: #FF4444;
      font-weight: bold;
    }

    .points-discount {
      font-size: 14px;
      color: #FF4444;
      font-weight: bold;
      margin-left: 8px;
    }
  }
}

.points-section {
  cursor: default;
}

.recommend-section {
  background: white;
  padding: 16px;

  .recommend-title {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 16px;
  }

  .recommend-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .recommend-item {
      cursor: pointer;

      .recommend-image {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 8px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .recommend-name {
        font-size: 14px;
        margin: 0 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .recommend-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .recommend-price {
          font-size: 16px;
          font-weight: bold;
          color: #FF4444;
        }
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #F0F0F0;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

  .bottom-left {
    flex-shrink: 0;
  }

  .bottom-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .price-info {
      text-align: right;

      .price-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        margin-bottom: 2px;

        &:last-child {
          margin-bottom: 0;
        }

        .price-label {
          color: #666;
        }

        .price-value {
          color: #333;
          font-weight: 500;

          &.final {
            color: #FF4444;
            font-size: 18px;
            font-weight: bold;
          }
        }

        &.discount {
          .price-value {
            color: #FF4444;
          }
        }

        &.total {
          margin-top: 4px;
        }
      }
    }
  }
}

.coupon-list {
  max-height: 400px;
  overflow-y: auto;

  .coupon-item {
    display: flex;
    background: #FAFAFA;
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;

    &:hover:not(.disabled) {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.selected {
      border: 2px solid #1890ff;
      background: #E6F7FF;
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .coupon-left-part {
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 100px;

      .coupon-amount {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 4px;
      }

      .coupon-condition {
        font-size: 12px;
        opacity: 0.9;
      }
    }

    .coupon-right-part {
      flex: 1;
      padding: 12px;
      position: relative;

      .coupon-name {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 4px;
      }

      .coupon-expire {
        font-size: 12px;
        color: #999;
      }

      .coupon-check {
        position: absolute;
        top: 12px;
        right: 12px;
        font-size: 20px;
        color: #1890ff;
      }
    }
  }
}
</style>

