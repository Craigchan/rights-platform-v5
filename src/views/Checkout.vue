<template>
  <div class="checkout-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <ArrowLeftOutlined class="back-icon" @click="$router.back()" />
      <span class="title">确认订单</span>
      <span></span>
    </div>

    <div class="checkout-content">
      <!-- 收货地址 -->
      <div class="address-section" @click="showAddressModal = true">
        <div class="section-header">
          <EnvironmentOutlined style="margin-right: 8px; color: #1890ff;" />
          <span class="section-title">收货地址</span>
        </div>
        <div class="address-content" v-if="selectedAddress">
          <div class="address-info">
            <span class="address-name">{{ selectedAddress.name }}</span>
            <span class="address-phone">{{ selectedAddress.phone }}</span>
            <a-tag v-if="selectedAddress.isDefault" color="red" size="small">默认</a-tag>
          </div>
          <div class="address-detail">
            {{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.district }} {{ selectedAddress.detail }}
          </div>
        </div>
        <div class="address-empty" v-else>
          <PlusOutlined style="margin-right: 8px;" />
          添加收货地址
        </div>
        <RightOutlined class="address-arrow" />
      </div>

      <!-- 商品列表 -->
      <div class="goods-section">
        <div class="section-header">
          <ShoppingOutlined style="margin-right: 8px;" />
          <span class="section-title">商品清单</span>
        </div>
        <div class="goods-list">
          <div class="goods-item" v-for="item in checkoutData.items" :key="item.id">
            <div class="goods-image">
              <img v-img-fallback :src="item.image" :alt="item.name" />
            </div>
            <div class="goods-info">
              <h3 class="goods-name">{{ item.name }}</h3>
              <p class="goods-spec">{{ item.spec }}</p>
              <div class="goods-footer">
                <div class="goods-price-group">
                  <span class="goods-points" v-if="item.points > 0">
                    {{ item.points.toLocaleString() }}积分
                  </span>
                  <span class="goods-cash" v-if="item.price > 0">
                    + ¥{{ item.price.toFixed(2) }}
                  </span>
                </div>
                <span class="goods-quantity">x{{ item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 配送方式 -->
      <div class="delivery-section">
        <div class="section-header">
          <CarOutlined style="margin-right: 8px;" />
          <span class="section-title">配送方式</span>
        </div>
        <a-radio-group v-model:value="deliveryMethod" class="delivery-options">
          <a-radio value="express">
            <div class="delivery-option">
              <span class="delivery-name">快递配送</span>
              <span class="delivery-fee">¥10.00</span>
            </div>
            <div class="delivery-desc">预计3-5天送达</div>
          </a-radio>
          <a-radio value="self">
            <div class="delivery-option">
              <span class="delivery-name">到店自提</span>
              <span class="delivery-fee free">免费</span>
            </div>
            <div class="delivery-desc">南京奥体中心官方商店</div>
          </a-radio>
        </a-radio-group>
      </div>

      <!-- 支付方式 -->
      <div class="payment-section">
        <div class="section-header">
          <WalletOutlined style="margin-right: 8px;" />
          <span class="section-title">支付方式</span>
        </div>
        <a-radio-group v-model:value="paymentMethod" class="payment-options">
          <a-radio value="wechat">
            <div class="payment-option">
              <WechatOutlined style="color: #07C160; font-size: 24px;" />
              <span class="payment-name">微信支付</span>
            </div>
          </a-radio>
          <a-radio value="alipay">
            <div class="payment-option">
              <AlipayCircleOutlined style="color: #1677FF; font-size: 24px;" />
              <span class="payment-name">支付宝</span>
            </div>
          </a-radio>
        </a-radio-group>
      </div>

      <!-- 优惠信息 -->
      <div class="discount-section">
        <div class="discount-item" v-if="checkoutData.coupon">
          <span class="discount-label">
            <GiftOutlined style="margin-right: 8px; color: #FF4444;" />
            优惠券
          </span>
          <span class="discount-value">-¥{{ checkoutData.coupon.amount.toFixed(2) }}</span>
        </div>
        <div class="discount-item" v-if="checkoutData.usePoints">
          <span class="discount-label">
            <StarOutlined style="margin-right: 8px; color: #FFD700;" />
            积分抵扣
          </span>
          <span class="discount-value">-¥{{ checkoutData.pointsDiscount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 订单备注 -->
      <div class="remark-section">
        <div class="section-header">
          <EditOutlined style="margin-right: 8px;" />
          <span class="section-title">订单备注</span>
        </div>
        <a-textarea
          v-model:value="orderRemark"
          placeholder="选填,可以告诉商家您的特殊需求"
          :rows="3"
          :maxlength="200"
          show-count
        />
      </div>

      <!-- 价格明细 -->
      <div class="price-section">
        <div class="price-item" v-if="checkoutData.totalPoints > 0">
          <span class="price-label">积分</span>
          <span class="price-value points-color">{{ checkoutData.totalPoints.toLocaleString() }}积分</span>
        </div>
        <div class="price-item" v-if="checkoutData.subtotal > 0">
          <span class="price-label">商品金额</span>
          <span class="price-value">¥{{ checkoutData.subtotal.toFixed(2) }}</span>
        </div>
        <div class="price-item" v-if="deliveryFee > 0">
          <span class="price-label">运费</span>
          <span class="price-value">¥{{ deliveryFee.toFixed(2) }}</span>
        </div>
        <div class="price-item discount" v-if="checkoutData.totalDiscount > 0">
          <span class="price-label">优惠</span>
          <span class="price-value">-¥{{ checkoutData.totalDiscount.toFixed(2) }}</span>
        </div>
        <div class="price-item total">
          <span class="price-label">实付款</span>
          <div class="price-value-group">
            <span class="price-value final points-color" v-if="checkoutData.totalPoints > 0">
              {{ checkoutData.totalPoints.toLocaleString() }}积分
            </span>
            <span class="price-value final" v-if="totalAmount > 0">
              {{ checkoutData.totalPoints > 0 ? ' + ' : '' }}¥{{ totalAmount.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提交栏 -->
    <div class="bottom-bar">
      <div class="bottom-left">
        <div class="total-label">合计:</div>
        <div class="total-price-group">
          <span class="total-points" v-if="checkoutData.totalPoints > 0">
            {{ checkoutData.totalPoints.toLocaleString() }}积分
          </span>
          <span class="total-cash" v-if="totalAmount > 0">
            {{ checkoutData.totalPoints > 0 ? ' + ' : '' }}¥{{ totalAmount.toFixed(2) }}
          </span>
        </div>
      </div>
      <a-button 
        type="primary" 
        size="large"
        :loading="submitting"
        @click="submitOrder"
      >
        提交订单
      </a-button>
    </div>

    <!-- 支付弹窗 -->
    <PaymentModal
      v-model:open="showPaymentModal"
      :order-amount="totalAmount"
      :order-id="createdOrderId"
      @success="handlePaymentSuccess"
      @failure="handlePaymentFailure"
    />

    <!-- 地址选择弹窗 -->
    <a-modal
      v-model:open="showAddressModal"
      title="选择收货地址"
      :footer="null"
      :width="360"
    >
      <div class="address-list">
        <div 
          class="address-item"
          :class="{ 'selected': selectedAddress?.id === address.id }"
          v-for="address in addresses"
          :key="address.id"
          @click="selectAddress(address)"
        >
          <div class="address-item-header">
            <span class="address-item-name">{{ address.name }}</span>
            <span class="address-item-phone">{{ address.phone }}</span>
            <a-tag v-if="address.isDefault" color="red" size="small">默认</a-tag>
          </div>
          <div class="address-item-detail">
            {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
          </div>
          <CheckCircleFilled 
            v-if="selectedAddress?.id === address.id"
            class="address-check"
          />
        </div>
        <a-button type="dashed" block @click="addAddress">
          <PlusOutlined /> 新增收货地址
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import PaymentModal from '@/components/payment/PaymentModal.vue'
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  RightOutlined,
  PlusOutlined,
  ShoppingOutlined,
  CarOutlined,
  WalletOutlined,
  WechatOutlined,
  AlipayCircleOutlined,
  GiftOutlined,
  StarOutlined,
  EditOutlined,
  CheckCircleFilled
} from '@ant-design/icons-vue'

const router = useRouter()

// 从购物车传递的结算数据
const checkoutData = ref<any>({
  items: [],
  coupon: null,
  usePoints: false,
  pointsDiscount: 0,
  subtotal: 0,
  totalDiscount: 0,
  finalPrice: 0
})

// 收货地址
const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****8888',
    province: '江苏省',
    city: '南京市',
    district: '建邺区',
    detail: '奥体大街XXX号XXX小区X栋XXX室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****9999',
    province: '江苏省',
    city: '南京市',
    district: '玄武区',
    detail: '中山路XXX号XXX大厦XXX室',
    isDefault: false
  }
])

const selectedAddress = ref<any>(null)
const showAddressModal = ref(false)

// 支付相关
const showPaymentModal = ref(false)
const createdOrderId = ref('')

// 配送方式
const deliveryMethod = ref('express')

// 支付方式
const paymentMethod = ref('wechat')

// 订单备注
const orderRemark = ref('')

// 提交状态
const submitting = ref(false)

// 计算运费
const deliveryFee = computed(() => {
  return deliveryMethod.value === 'express' ? 10 : 0
})

// 计算总金额
const totalAmount = computed(() => {
  return checkoutData.value.finalPrice + deliveryFee.value
})

// 初始化
onMounted(() => {
  // 从本地存储获取结算数据
  const savedData = localStorage.getItem('checkoutData')
  if (savedData) {
    checkoutData.value = JSON.parse(savedData)
  } else {
    message.error('订单数据异常')
    router.back()
    return
  }

  // 选择默认地址
  const defaultAddress = addresses.value.find(addr => addr.isDefault)
  if (defaultAddress) {
    selectedAddress.value = defaultAddress
  }
})

// 选择地址
const selectAddress = (address: any) => {
  selectedAddress.value = address
  showAddressModal.value = false
}

// 新增地址
const addAddress = () => {
  message.info('新增地址功能开发中')
}

// 提交订单
const submitOrder = async () => {
  if (!selectedAddress.value) {
    message.warning('请选择收货地址')
    return
  }

  submitting.value = true
  
  try {
    // 模拟创建订单
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成订单号
    createdOrderId.value = 'SO' + Date.now()
    
    submitting.value = false
    
    // 打开支付弹窗
    showPaymentModal.value = true
  } catch (error) {
    submitting.value = false
    message.error('订单创建失败,请重试')
  }
}

// 支付成功回调
const handlePaymentSuccess = (data: any) => {
  // 保存订单信息
  const orderData = {
    orderNo: createdOrderId.value,
    items: checkoutData.value.items,
    address: selectedAddress.value,
    deliveryMethod: deliveryMethod.value,
    paymentMethod: data.method,
    coupon: checkoutData.value.coupon,
    usePoints: checkoutData.value.usePoints,
    pointsDiscount: checkoutData.value.pointsDiscount,
    subtotal: checkoutData.value.subtotal,
    deliveryFee: deliveryFee.value,
    totalDiscount: checkoutData.value.totalDiscount,
    totalAmount: totalAmount.value,
    remark: orderRemark.value,
    status: 'paid',
    payTime: new Date(data.timestamp).toISOString(),
    createTime: new Date().toISOString()
  }
  
  // 保存到本地存储(模拟)
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  orders.unshift(orderData)
  localStorage.setItem('orders', JSON.stringify(orders))
  
  // 清除购物车结算数据
  localStorage.removeItem('checkoutData')
  
  message.success('支付成功')
  
  // 跳转到订单页面
  setTimeout(() => {
    router.push('/orders')
  }, 1500)
}

// 支付失败回调
const handlePaymentFailure = (error: any) => {
  message.error(error.error || '支付失败')
}
</script>

<style scoped lang="scss">
.checkout-page {
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

  .back-icon {
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

.checkout-content {
  padding-bottom: 20px;
}

.address-section,
.goods-section,
.delivery-section,
.payment-section,
.discount-section,
.remark-section,
.price-section {
  background: white;
  margin-bottom: 12px;
  padding: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;

  .section-title {
    flex: 1;
  }
}

.address-section {
  position: relative;
  cursor: pointer;

  .address-content {
    .address-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .address-name {
        font-size: 16px;
        font-weight: bold;
      }

      .address-phone {
        font-size: 14px;
        color: #666;
      }
    }

    .address-detail {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
  }

  .address-empty {
    display: flex;
    align-items: center;
    color: #999;
    padding: 20px 0;
  }

  .address-arrow {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
}

.goods-list {
  .goods-item {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #F0F0F0;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .goods-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 12px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .goods-info {
      flex: 1;
      min-width: 0;

      .goods-name {
        font-size: 15px;
        font-weight: 500;
        margin: 0 0 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .goods-spec {
        font-size: 13px;
        color: #999;
        margin: 0 0 8px;
      }

      .goods-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .goods-price-group {
          display: flex;
          align-items: baseline;
          gap: 4px;
          
          .goods-points {
            font-size: 15px;
            font-weight: 600;
            color: #FF6B35;
          }
          
          .goods-cash {
            font-size: 14px;
            color: #FF6B35;
          }
        }

        .goods-price {
          font-size: 16px;
          font-weight: bold;
          color: #FF4444;
        }

        .goods-quantity {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
}

.delivery-options,
.payment-options {
  width: 100%;

  :deep(.ant-radio-wrapper) {
    display: block;
    margin-bottom: 12px;
    padding: 12px;
    border: 1px solid #F0F0F0;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      border-color: #1890ff;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.ant-radio-wrapper-checked) {
    border-color: #1890ff;
    background: #E6F7FF;
  }
}

.delivery-option,
.payment-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;

  .delivery-name,
  .payment-name {
    font-size: 15px;
    font-weight: 500;
    margin-left: 8px;
  }

  .delivery-fee {
    font-size: 14px;
    color: #FF4444;

    &.free {
      color: #52C41A;
    }
  }
}

.delivery-desc {
  font-size: 13px;
  color: #999;
  margin-left: 24px;
}

.discount-section {
  .discount-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }

    .discount-label {
      display: flex;
      align-items: center;
      font-size: 15px;
    }

    .discount-value {
      font-size: 15px;
      font-weight: bold;
      color: #FF4444;
    }
  }
}

.price-section {
  .price-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 14px;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }

    .price-label {
      color: #666;
    }

    .price-value {
      color: #333;
      font-weight: 500;

      &.final {
        color: #FF4444;
        font-size: 20px;
        font-weight: bold;
      }
      
      &.points-color {
        color: #FF6B35;
      }
    }
    
    .price-value-group {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    &.discount {
      .price-value {
        color: #FF4444;
      }
    }

    &.total {
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid #F0F0F0;
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
    .total-label {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;
    }

    .total-price {
      font-size: 20px;
      font-weight: bold;
      color: #FF4444;
    }
    
    .total-price-group {
      display: flex;
      align-items: baseline;
      gap: 4px;
      
      .total-points {
        font-size: 18px;
        font-weight: 700;
        color: #FF6B35;
      }
      
      .total-cash {
        font-size: 18px;
        font-weight: 700;
        color: #FF4444;
      }
    }
  }
}

.address-list {
  max-height: 400px;
  overflow-y: auto;

  .address-item {
    background: #FAFAFA;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.selected {
      border: 2px solid #1890ff;
      background: #E6F7FF;
    }

    .address-item-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .address-item-name {
        font-size: 15px;
        font-weight: bold;
      }

      .address-item-phone {
        font-size: 14px;
        color: #666;
      }
    }

    .address-item-detail {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }

    .address-check {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 20px;
      color: #1890ff;
    }
  }
}
</style>

