<template>
  <div class="order-detail-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <LeftOutlined />
      </div>
      <div class="page-title">订单详情</div>
      <div class="placeholder"></div>
    </div>

    <!-- 订单状态进度 -->
    <div class="order-progress">
      <div class="status-icon" :class="`status-${order.status}`">
        <CheckCircleFilled v-if="order.status === 'completed'" />
        <ClockCircleFilled v-else-if="order.status === 'pending_payment'" />
        <RocketFilled v-else-if="order.status === 'pending_delivery'" />
        <CarFilled v-else-if="order.status === 'pending_receipt'" />
      </div>
      <div class="status-text">{{ getStatusText(order.status) }}</div>
      <div class="status-desc">{{ getStatusDesc(order.status) }}</div>
    </div>

    <!-- 收货地址 -->
    <div class="address-section">
      <div class="section-title">
        <EnvironmentFilled class="title-icon" />
        <span>收货地址</span>
      </div>
      <div class="address-content">
        <div class="address-info">
          <span class="name">{{ order.address.name }}</span>
          <span class="phone">{{ order.address.phone }}</span>
        </div>
        <div class="address-detail">
          {{ order.address.province }} {{ order.address.city }} {{ order.address.district }} {{ order.address.detail }}
        </div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="products-section">
      <div class="section-title">
        <ShoppingFilled class="title-icon" />
        <span>商品信息</span>
      </div>
      <div class="products-list">
        <div 
          v-for="product in order.products" 
          :key="product.id"
          class="product-item"
        >
          <div class="product-image" :style="{ background: product.color }"></div>
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-spec">{{ product.spec }}</div>
            <div class="product-price-qty">
              <span class="price">¥{{ product.price }}</span>
              <span class="quantity">x{{ product.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单信息 -->
    <div class="order-info-section">
      <div class="section-title">
        <FileTextFilled class="title-icon" />
        <span>订单信息</span>
      </div>
      <div class="info-list">
        <div class="info-item">
          <span class="label">订单编号</span>
          <span class="value">{{ order.orderNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">下单时间</span>
          <span class="value">{{ order.createTime }}</span>
        </div>
        <div class="info-item" v-if="order.payTime">
          <span class="label">付款时间</span>
          <span class="value">{{ order.payTime }}</span>
        </div>
        <div class="info-item" v-if="order.deliveryTime">
          <span class="label">发货时间</span>
          <span class="value">{{ order.deliveryTime }}</span>
        </div>
        <div class="info-item" v-if="order.receiptTime">
          <span class="label">收货时间</span>
          <span class="value">{{ order.receiptTime }}</span>
        </div>
      </div>
    </div>

    <!-- 金额明细 -->
    <div class="amount-section">
      <div class="section-title">
        <WalletFilled class="title-icon" />
        <span>金额明细</span>
      </div>
      <div class="amount-list">
        <div class="amount-item">
          <span class="label">商品总额</span>
          <span class="value">¥{{ order.productAmount }}</span>
        </div>
        <div class="amount-item">
          <span class="label">运费</span>
          <span class="value">¥{{ order.shippingFee }}</span>
        </div>
        <div class="amount-item" v-if="order.discount > 0">
          <span class="label">优惠</span>
          <span class="value discount">-¥{{ order.discount }}</span>
        </div>
        <div class="amount-item" v-if="order.pointsUsed > 0">
          <span class="label">积分抵扣</span>
          <span class="value discount">-¥{{ order.pointsDiscount }}</span>
        </div>
        <div class="amount-item total">
          <span class="label">实付款</span>
          <span class="value">¥{{ order.totalAmount }}</span>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar" v-if="order.status !== 'cancelled'">
      <div class="action-buttons">
        <a-button 
          v-if="order.status === 'pending_payment'"
          size="large"
          @click="cancelOrder"
        >
          取消订单
        </a-button>
        <a-button 
          v-if="order.status === 'pending_payment'"
          type="primary"
          size="large"
          @click="payOrder"
        >
          立即付款
        </a-button>
        <a-button 
          v-if="order.status === 'pending_delivery'"
          size="large"
          @click="applyRefund"
        >
          申请退款
        </a-button>
        <a-button 
          v-if="order.status === 'pending_receipt'"
          size="large"
          @click="viewLogistics"
        >
          查看物流
        </a-button>
        <a-button 
          v-if="order.status === 'pending_receipt'"
          type="primary"
          size="large"
          @click="confirmReceipt"
        >
          确认收货
        </a-button>
        <a-button 
          v-if="order.status === 'completed'"
          size="large"
          @click="buyAgain"
        >
          再次购买
        </a-button>
        <a-button 
          v-if="order.status === 'completed'"
          type="primary"
          size="large"
          @click="applyAfterSales"
        >
          申请售后
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  RocketFilled,
  CarFilled,
  EnvironmentFilled,
  ShoppingFilled,
  FileTextFilled,
  WalletFilled
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 模拟订单详情数据
const order = ref({
  id: 1,
  orderNo: '202410140001',
  status: 'pending_receipt',
  createTime: '2024-10-14 10:30:00',
  payTime: '2024-10-14 10:35:00',
  deliveryTime: '2024-10-14 15:00:00',
  receiptTime: '',
  productAmount: 299.00,
  shippingFee: 10.00,
  discount: 10.00,
  pointsUsed: 100,
  pointsDiscount: 10.00,
  totalAmount: 289.00,
  address: {
    name: '张三',
    phone: '138****5678',
    province: '江苏省',
    city: '南京市',
    district: '鼓楼区',
    detail: '中山北路283号'
  },
  products: [
    {
      id: 1,
      name: '智能手环运动手表',
      spec: '黑色/标准版',
      price: 299.00,
      quantity: 1,
      color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    }
  ]
})

// 方法
const goBack = () => {
  router.back()
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending_payment: '等待买家付款',
    pending_delivery: '等待商家发货',
    pending_receipt: '等待买家收货',
    completed: '交易完成',
    cancelled: '订单已取消'
  }
  return statusMap[status] || status
}

const getStatusDesc = (status: string) => {
  const descMap: Record<string, string> = {
    pending_payment: '请尽快完成付款,超时订单将自动取消',
    pending_delivery: '商家正在准备发货,请耐心等待',
    pending_receipt: '商品正在配送中,请注意查收',
    completed: '感谢您的购买,期待再次光临',
    cancelled: '订单已取消,如有疑问请联系客服'
  }
  return descMap[status] || ''
}

const cancelOrder = () => {
  message.success('订单已取消')
  router.back()
}

const payOrder = () => {
  message.success('跳转到支付页面...')
}

const applyRefund = () => {
  router.push(`/after-sales/${order.value.id}?type=refund`)
}

const viewLogistics = () => {
  router.push(`/logistics/${order.value.id}`)
}

const confirmReceipt = () => {
  message.success('确认收货成功')
  order.value.status = 'completed'
  order.value.receiptTime = new Date().toLocaleString('zh-CN')
}

const buyAgain = () => {
  message.success('已加入购物车')
}

const applyAfterSales = () => {
  router.push(`/after-sales/${order.value.id}`)
}
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.top-bar {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn,
.placeholder {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
}

/* 订单状态进度 */
.order-progress {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  padding: 30px 20px;
  text-align: center;
  color: #fff;
}

.status-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.status-text {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.status-desc {
  font-size: 13px;
  opacity: 0.9;
}

/* 区块样式 */
.address-section,
.products-section,
.order-info-section,
.amount-section {
  background: #fff;
  margin-bottom: 10px;
  padding: 15px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.title-icon {
  font-size: 18px;
  color: #FF6B35;
}

/* 收货地址 */
.address-content {
  padding: 8px 0;
}

.address-info {
  display: flex;
  gap: 20px;
  margin-bottom: 8px;
}

.address-info .name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.address-info .phone {
  font-size: 14px;
  color: #666;
}

.address-detail {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 商品列表 */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  gap: 12px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-spec {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.product-price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.price {
  font-size: 15px;
  color: #ff4d4f;
  font-weight: 600;
}

.quantity {
  font-size: 13px;
  color: #999;
}

/* 订单信息 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.info-item .label {
  color: #666;
}

.info-item .value {
  color: #333;
  font-weight: 500;
}

/* 金额明细 */
.amount-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.amount-item .label {
  color: #666;
}

.amount-item .value {
  color: #333;
  font-weight: 500;
}

.amount-item .discount {
  color: #52c41a;
}

.amount-item.total {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  margin-top: 4px;
}

.amount-item.total .label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.amount-item.total .value {
  font-size: 18px;
  color: #ff4d4f;
  font-weight: 600;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 15px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons :deep(.ant-btn) {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 600;
}

.action-buttons :deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border: none;
}
</style>

