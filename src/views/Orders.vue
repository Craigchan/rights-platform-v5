<template>
  <div class="orders-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <LeftOutlined />
      </div>
      <div class="page-title">我的订单</div>
      <div class="placeholder"></div>
    </div>

    <!-- 订单状态Tab -->
    <div class="status-tabs">
      <div 
        v-for="tab in statusTabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentStatus === tab.key }"
        @click="switchStatus(tab.key)"
      >
        <div class="tab-label">{{ tab.label }}</div>
        <div v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="orders-list">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <a-empty description="暂无订单" />
      </div>

      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="order-card"
        @click="goToDetail(order.id)"
      >
        <!-- 订单头部 -->
        <div class="order-header">
          <div class="order-number">订单号: {{ order.orderNo }}</div>
          <div class="order-status" :class="`status-${order.status}`">
            {{ getStatusText(order.status) }}
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="product-list">
          <div 
            v-for="product in order.products" 
            :key="product.id"
            class="product-item"
          >
            <div class="product-image" :style="{ background: product.color }">
              <img v-if="product.image" :src="product.image" alt="">
            </div>
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

        <!-- 订单金额 -->
        <div class="order-amount">
          <span class="label">实付款:</span>
          <span class="amount">¥{{ order.totalAmount }}</span>
        </div>

        <!-- 订单操作 -->
        <div class="order-actions" @click.stop>
          <a-button 
            v-if="order.status === 'pending_payment'"
            size="small"
            @click="cancelOrder(order.id)"
          >
            取消订单
          </a-button>
          <a-button 
            v-if="order.status === 'pending_payment'"
            type="primary"
            size="small"
            @click="payOrder(order.id)"
          >
            立即付款
          </a-button>
          <a-button 
            v-if="order.status === 'pending_delivery'"
            size="small"
            @click="applyRefund(order.id)"
          >
            申请退款
          </a-button>
          <a-button 
            v-if="order.status === 'pending_receipt'"
            size="small"
            @click="viewLogistics(order.id)"
          >
            查看物流
          </a-button>
          <a-button 
            v-if="order.status === 'pending_receipt'"
            type="primary"
            size="small"
            @click="confirmReceipt(order.id)"
          >
            确认收货
          </a-button>
          <a-button 
            v-if="order.status === 'completed'"
            size="small"
            @click="buyAgain(order.id)"
          >
            再次购买
          </a-button>
          <a-button 
            v-if="order.status === 'completed'"
            size="small"
            @click="applyAfterSales(order.id)"
          >
            申请售后
          </a-button>
        </div>
      </div>
    </div>

    <!-- 取消订单弹窗 -->
    <a-modal 
      v-model:open="cancelModalVisible" 
      title="取消订单"
      @ok="confirmCancel"
      okText="确认取消"
      cancelText="我再想想"
    >
      <p>确定要取消该订单吗?</p>
      <a-select 
        v-model:value="cancelReason" 
        style="width: 100%"
        placeholder="请选择取消原因"
      >
        <a-select-option value="不想要了">不想要了</a-select-option>
        <a-select-option value="信息填写错误">信息填写错误</a-select-option>
        <a-select-option value="重复下单">重复下单</a-select-option>
        <a-select-option value="其他原因">其他原因</a-select-option>
      </a-select>
    </a-modal>

    <!-- 确认收货弹窗 -->
    <a-modal 
      v-model:open="receiptModalVisible" 
      title="确认收货"
      @ok="confirmReceiptSubmit"
      okText="确认收货"
      cancelText="取消"
    >
      <p>请确认您已收到商品,确认收货后订单将完成。</p>
      <a-alert 
        message="温馨提示" 
        description="确认收货后,如有质量问题可申请售后服务。" 
        type="info" 
        show-icon 
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { LeftOutlined } from '@ant-design/icons-vue'
const route = useRoute()

const router = useRouter()

// 订单状态Tab
const statusTabs = ref([
  { key: 'all', label: '全部', count: 0 },
  { key: 'pending_payment', label: '待付款', count: 2 },
  { key: 'pending_delivery', label: '待发货', count: 1 },
  { key: 'pending_receipt', label: '待收货', count: 3 },
  { key: 'completed', label: '已完成', count: 5 }
])

const currentStatus = ref('all')

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: '202410140001',
    status: 'pending_payment',
    createTime: '2024-10-14 10:30:00',
    totalAmount: 299.00,
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
  },
  {
    id: 2,
    orderNo: '202410140002',
    status: 'pending_payment',
    createTime: '2024-10-14 09:15:00',
    totalAmount: 1299.00,
    products: [
      {
        id: 2,
        name: '无线蓝牙耳机',
        spec: '白色/降噪版',
        price: 599.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
      },
      {
        id: 3,
        name: '手机支架',
        spec: '银色/折叠款',
        price: 89.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
      }
    ]
  },
  {
    id: 3,
    orderNo: '202410130001',
    status: 'pending_delivery',
    createTime: '2024-10-13 16:20:00',
    payTime: '2024-10-13 16:25:00',
    totalAmount: 2999.00,
    products: [
      {
        id: 4,
        name: '智能扫地机器人',
        spec: '白色/旗舰版',
        price: 2999.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
      }
    ]
  },
  {
    id: 4,
    orderNo: '202410120001',
    status: 'pending_receipt',
    createTime: '2024-10-12 14:30:00',
    payTime: '2024-10-12 14:35:00',
    deliveryTime: '2024-10-12 18:00:00',
    totalAmount: 499.00,
    products: [
      {
        id: 5,
        name: '保温杯304不锈钢',
        spec: '粉色/500ml',
        price: 129.00,
        quantity: 2,
        color: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)'
      },
      {
        id: 6,
        name: '运动水壶',
        spec: '蓝色/1000ml',
        price: 79.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)'
      }
    ]
  },
  {
    id: 5,
    orderNo: '202410110001',
    status: 'pending_receipt',
    createTime: '2024-10-11 10:00:00',
    payTime: '2024-10-11 10:05:00',
    deliveryTime: '2024-10-11 15:30:00',
    totalAmount: 1599.00,
    products: [
      {
        id: 7,
        name: '电动牙刷套装',
        spec: '白色/智能版',
        price: 399.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)'
      },
      {
        id: 8,
        name: '洗面奶套装',
        spec: '清爽型/5件套',
        price: 299.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 100%)'
      }
    ]
  },
  {
    id: 6,
    orderNo: '202410100001',
    status: 'pending_receipt',
    createTime: '2024-10-10 11:20:00',
    payTime: '2024-10-10 11:25:00',
    deliveryTime: '2024-10-10 16:00:00',
    totalAmount: 899.00,
    products: [
      {
        id: 9,
        name: '运动鞋男款',
        spec: '黑色/42码',
        price: 899.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #FFD89B 0%, #19547B 100%)'
      }
    ]
  },
  {
    id: 7,
    orderNo: '202410090001',
    status: 'completed',
    createTime: '2024-10-09 09:00:00',
    payTime: '2024-10-09 09:05:00',
    deliveryTime: '2024-10-09 14:00:00',
    receiptTime: '2024-10-10 10:30:00',
    totalAmount: 199.00,
    products: [
      {
        id: 10,
        name: '数据线Type-C',
        spec: '白色/1米',
        price: 39.00,
        quantity: 5,
        color: 'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)'
      }
    ]
  },
  {
    id: 8,
    orderNo: '202410080001',
    status: 'completed',
    createTime: '2024-10-08 15:30:00',
    payTime: '2024-10-08 15:35:00',
    deliveryTime: '2024-10-08 20:00:00',
    receiptTime: '2024-10-09 12:00:00',
    totalAmount: 3299.00,
    products: [
      {
        id: 11,
        name: '空气净化器',
        spec: '白色/除甲醛版',
        price: 3299.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #D299C2 0%, #FEF9D7 100%)'
      }
    ]
  },
  {
    id: 9,
    orderNo: '202410070001',
    status: 'completed',
    createTime: '2024-10-07 13:00:00',
    payTime: '2024-10-07 13:05:00',
    deliveryTime: '2024-10-07 17:00:00',
    receiptTime: '2024-10-08 09:00:00',
    totalAmount: 699.00,
    products: [
      {
        id: 12,
        name: '蓝牙音箱',
        spec: '黑色/重低音',
        price: 699.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #FEE140 0%, #FA709A 100%)'
      }
    ]
  },
  {
    id: 10,
    orderNo: '202410060001',
    status: 'completed',
    createTime: '2024-10-06 10:00:00',
    payTime: '2024-10-06 10:05:00',
    deliveryTime: '2024-10-06 15:00:00',
    receiptTime: '2024-10-07 11:00:00',
    totalAmount: 1599.00,
    products: [
      {
        id: 13,
        name: '智能手表',
        spec: '银色/运动版',
        price: 1599.00,
        quantity: 1,
        color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
      }
    ]
  },
  {
    id: 11,
    orderNo: '202410050001',
    status: 'completed',
    createTime: '2024-10-05 14:30:00',
    payTime: '2024-10-05 14:35:00',
    deliveryTime: '2024-10-05 19:00:00',
    receiptTime: '2024-10-06 10:00:00',
    totalAmount: 399.00,
    products: [
      {
        id: 14,
        name: '充电宝20000mAh',
        spec: '黑色/快充版',
        price: 199.00,
        quantity: 2,
        color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
      }
    ]
  }
])

// 筛选订单
const filteredOrders = computed(() => {
  if (currentStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === currentStatus.value)
})

// 弹窗状态
const cancelModalVisible = ref(false)
const receiptModalVisible = ref(false)
const cancelReason = ref('')
const currentOrderId = ref<number | null>(null)

// 方法
const goBack = () => {
  router.back()
}

const switchStatus = (status: string) => {
  currentStatus.value = status
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending_payment: '待付款',
    pending_delivery: '待发货',
    pending_receipt: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const goToDetail = (orderId: number) => {
  router.push(`/order-detail/${orderId}`)
}

const cancelOrder = (orderId: number) => {
  currentOrderId.value = orderId
  cancelModalVisible.value = true
}

const confirmCancel = () => {
  if (!cancelReason.value) {
    message.error('请选择取消原因')
    return
  }
  
  const order = orders.value.find(o => o.id === currentOrderId.value)
  if (order) {
    order.status = 'cancelled'
    // 更新状态Tab计数
    const tab = statusTabs.value.find(t => t.key === 'pending_payment')
    if (tab) tab.count--
  }
  
  cancelModalVisible.value = false
  cancelReason.value = ''
  message.success('订单已取消')
}

const payOrder = (orderId: number) => {
  message.success('跳转到支付页面...')
  // 实际应跳转到支付页面
}

const applyRefund = (orderId: number) => {
  router.push(`/after-sales/${orderId}?type=refund`)
}

const viewLogistics = (orderId: number) => {
  router.push(`/logistics/${orderId}`)
}

const confirmReceipt = (orderId: number) => {
  currentOrderId.value = orderId
  receiptModalVisible.value = true
}

const confirmReceiptSubmit = () => {
  const order = orders.value.find(o => o.id === currentOrderId.value)
  if (order) {
    order.status = 'completed'
    order.receiptTime = new Date().toLocaleString('zh-CN')
    // 更新状态Tab计数
    const pendingTab = statusTabs.value.find(t => t.key === 'pending_receipt')
    const completedTab = statusTabs.value.find(t => t.key === 'completed')
    if (pendingTab) pendingTab.count--
    if (completedTab) completedTab.count++
  }
  
  receiptModalVisible.value = false
  message.success('确认收货成功')
}

const buyAgain = (orderId: number) => {
  message.success('已加入购物车')
}

const applyAfterSales = (orderId: number) => {
  router.push(`/after-sales/${orderId}`)
}

// 页面加载时检查URL参数
onMounted(() => {
  const status = route.query.status as string
  if (status && statusTabs.value.some(tab => tab.key === status)) {
    currentStatus.value = status
  }
})
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
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

/* 订单状态Tab */
.status-tabs {
  background: #fff;
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 56px;
  z-index: 99;
}

.tab-item {
  flex: 1;
  text-align: center;
  cursor: pointer;
  position: relative;
  padding: 8px 0;
}

.tab-label {
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
}

.tab-item.active .tab-label {
  color: #FF6B35;
  font-weight: 600;
}

.tab-badge {
  position: absolute;
  top: 2px;
  right: 20%;
  background: #ff4d4f;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 12px;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 2px;
}

/* 订单列表 */
.orders-list {
  padding: 10px 15px;
}

.empty-state {
  background: #fff;
  padding: 60px 20px;
  border-radius: 8px;
  text-align: center;
}

.order-card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.order-number {
  font-size: 13px;
  color: #666;
}

.order-status {
  font-size: 13px;
  font-weight: 600;
}

.status-pending_payment {
  color: #ff4d4f;
}

.status-pending_delivery {
  color: #faad14;
}

.status-pending_receipt {
  color: #1890ff;
}

.status-completed {
  color: #52c41a;
}

.status-cancelled {
  color: #999;
}

/* 商品列表 */
.product-list {
  padding: 12px 15px;
}

.product-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.product-item:last-child {
  margin-bottom: 0;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* 订单金额 */
.order-amount {
  padding: 12px 15px;
  text-align: right;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.order-amount .label {
  font-size: 13px;
  color: #666;
  margin-right: 8px;
}

.order-amount .amount {
  font-size: 16px;
  color: #ff4d4f;
  font-weight: 600;
}

/* 订单操作 */
.order-actions {
  padding: 12px 15px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.order-actions :deep(.ant-btn) {
  height: 32px;
  padding: 0 16px;
  font-size: 13px;
  border-radius: 16px;
}

.order-actions :deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border: none;
}
</style>

