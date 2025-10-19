<template>
  <div class="flash-sale-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">限时秒杀</span>
      <ShareAltOutlined class="share-icon" @click="handleShare" />
    </div>

    <!-- 1. 顶部倒计时与场次切换区 -->
    <div class="countdown-banner">
      <div class="banner-content">
        <ThunderboltFilled class="thunder-icon" />
        <div class="countdown-info">
          <div class="countdown-title">本场距结束</div>
          <div class="countdown-time">{{ countdown }}</div>
        </div>
      </div>
    </div>

    <!-- 场次切换Tab -->
    <div class="session-tabs">
      <div 
        v-for="session in sessions" 
        :key="session.id"
        class="session-tab"
        :class="{ active: currentSession === session.id, upcoming: session.status === 'upcoming', ended: session.status === 'ended' }"
        @click="switchSession(session)"
      >
        <div class="session-time">{{ session.time }}</div>
        <div class="session-status">
          <span v-if="session.status === 'active'" class="status-active">进行中</span>
          <span v-else-if="session.status === 'upcoming'" class="status-upcoming">即将开始</span>
          <span v-else class="status-ended">已结束</span>
        </div>
      </div>
    </div>

    <!-- 2. 秒杀商品列表区 (双列瀑布流) -->
    <div class="product-list">
      <div 
        v-for="product in currentProducts" 
        :key="product.id" 
        class="product-card"
      >
        <div class="product-image" :style="{ background: product.color }">
          <!-- 秒杀标签 -->
          <div class="sale-badge">秒杀</div>
          <!-- 倒计时 -->
          <div class="mini-countdown">{{ countdown }}</div>
        </div>
        <div class="product-info">
          <!-- 商品名称 -->
          <div class="product-name">{{ product.name }}</div>
          
          <!-- 价格区 -->
          <div class="price-row">
            <div class="current-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ product.salePrice }}</span>
            </div>
            <div class="original-price">¥{{ product.originalPrice }}</div>
            <div class="discount-badge">{{ product.discount }}折</div>
          </div>

          <!-- 积分抵扣提示 -->
          <div v-if="product.pointsDeduction" class="points-tip">
            可用{{ product.pointsDeduction.points }}积分抵扣{{ product.pointsDeduction.amount }}元
          </div>

          <!-- 库存进度条 -->
          <div class="stock-section">
            <a-progress 
              :percent="product.soldPercent" 
              :show-info="false"
              stroke-color="#FF4444"
              :stroke-width="8"
            />
            <div class="stock-text">
              <span v-if="product.stock > 0">仅剩{{ product.stock }}件</span>
              <span v-else class="sold-out-text">已抢光</span>
              <span class="sold-percent">已抢{{ product.soldPercent }}%</span>
            </div>
          </div>

          <!-- 抢购按钮 -->
          <a-button 
            v-if="product.stock > 0"
            type="primary" 
            danger 
            block 
            size="large" 
            class="buy-btn"
            @click="handleBuy(product)"
          >
            <span v-if="product.stock < 10">仅剩{{ product.stock }}件，快抢！</span>
            <span v-else>立即抢购</span>
          </a-button>
          <a-button 
            v-else
            block 
            size="large" 
            disabled
            class="sold-out-btn"
          >
            已抢光
          </a-button>

          <!-- 售罄后的推荐 -->
          <div v-if="product.stock === 0" class="recommend-tip" @click="showRecommend">
            看看这些相似商品 >
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 秒杀规则说明区 (底部折叠面板) -->
    <div class="rules-section">
      <a-collapse v-model:activeKey="rulesActiveKey" :bordered="false">
        <a-collapse-panel key="1" header="秒杀规则">
          <div class="rule-item">
            <div class="rule-title">• 限购数量</div>
            <div class="rule-content">每人每场限购1件</div>
          </div>
          <div class="rule-item">
            <div class="rule-title">• 退换货政策</div>
            <div class="rule-content">秒杀商品支持7天无理由退换货</div>
          </div>
          <div class="rule-item">
            <div class="rule-title">• 活动时段</div>
            <div class="rule-content">秒杀价格仅限活动时段内有效</div>
          </div>
          <div class="rule-item">
            <div class="rule-title">• 发货时间</div>
            <div class="rule-content">秒杀商品预计3个工作日内发货</div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <!-- 快速下单弹窗 -->
    <a-modal
      v-model:open="orderModalVisible"
      title="确认订单"
      :footer="null"
      width="90%"
      :bodyStyle="{ padding: '20px' }"
    >
      <div v-if="selectedProduct" class="order-modal">
        <!-- 倒计时提醒 -->
        <div class="payment-countdown">
          <ClockCircleOutlined />
          请在 15 分钟内完成支付，否则订单自动取消
        </div>

        <!-- 商品信息 -->
        <div class="order-product">
          <div class="order-product-image" :style="{ background: selectedProduct.color }"></div>
          <div class="order-product-info">
            <div class="order-product-name">{{ selectedProduct.name }}</div>
            <div class="order-product-price">¥{{ selectedProduct.salePrice }}</div>
          </div>
        </div>

        <!-- 规格选择 -->
        <div class="order-section">
          <div class="section-label">规格</div>
          <a-radio-group v-model:value="selectedSpec" button-style="solid">
            <a-radio-button value="原味">原味</a-radio-button>
            <a-radio-button value="香辣">香辣</a-radio-button>
            <a-radio-button value="麻辣">麻辣</a-radio-button>
          </a-radio-group>
        </div>

        <!-- 数量选择 -->
        <div class="order-section">
          <div class="section-label">数量</div>
          <div class="quantity-selector">
            <a-input-number v-model:value="quantity" :min="1" :max="1" />
            <span class="limit-tip">限购1件</span>
          </div>
        </div>

        <!-- 收货地址 -->
        <div class="order-section address-section" @click="showAddressModal = true">
          <div class="section-label">收货地址</div>
          <div class="address-content">
            <div class="address-info">
              <div class="address-name">张三 138****5678</div>
              <div class="address-detail">江苏省南京市建邺区江东中路123号</div>
            </div>
            <RightOutlined />
          </div>
        </div>

        <!-- 积分抵扣 -->
        <div v-if="selectedProduct.pointsDeduction" class="order-section">
          <div class="section-label">积分抵扣</div>
          <a-checkbox v-model:checked="usePoints">
            使用{{ selectedProduct.pointsDeduction.points }}积分抵扣{{ selectedProduct.pointsDeduction.amount }}元
          </a-checkbox>
        </div>

        <!-- 支付金额 -->
        <div class="payment-amount">
          <div class="amount-label">支付金额</div>
          <div class="amount-value">¥{{ finalAmount }}</div>
        </div>

        <!-- 提交订单按钮 -->
        <a-button 
          type="primary" 
          danger 
          block 
          size="large" 
          class="submit-btn"
          @click="handlePayment"
        >
          立即支付 ¥{{ finalAmount }}
        </a-button>
      </div>
    </a-modal>

    <!-- 支付成功弹窗 -->
    <a-modal
      v-model:open="successModalVisible"
      :footer="null"
      width="90%"
      centered
    >
      <div class="success-modal">
        <div class="success-icon">
          <CheckCircleFilled style="font-size: 64px; color: #52c41a;" />
        </div>
        <div class="success-title">支付成功！</div>
        <div class="success-info">
          <div class="info-item">
            <span class="info-label">订单编号：</span>
            <span class="info-value">{{ orderNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预计发货：</span>
            <span class="info-value">3个工作日内</span>
          </div>
          <div class="info-item reward">
            <GiftOutlined />
            <span>恭喜获得 {{ earnedPoints }} 积分奖励</span>
          </div>
        </div>

        <!-- 社交分享激励 -->
        <div class="share-incentive">
          <div class="share-title">分享给好友，双方各得50积分！</div>
          <a-button type="primary" block @click="handleShareSuccess">
            <ShareAltOutlined />
            分享给好友
          </a-button>
        </div>

        <div class="success-actions">
          <a-button block @click="viewOrder">查看订单</a-button>
          <a-button type="primary" block @click="continueShopping">继续抢购</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 预约提醒弹窗 -->
    <a-modal
      v-model:open="reserveModalVisible"
      title="预约提醒"
      :footer="null"
      width="80%"
    >
      <div class="reserve-modal">
        <div class="reserve-info">
          <ClockCircleOutlined style="font-size: 48px; color: #1890ff; margin-bottom: 15px;" />
          <div class="reserve-title">{{ reserveSession?.time }} 场次即将开始</div>
          <div class="reserve-desc">我们将在开始前5分钟通过微信服务通知提醒您</div>
        </div>
        <a-button type="primary" block size="large" @click="confirmReserve">
          确认预约
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  LeftOutlined, 
  ThunderboltFilled, 
  ShareAltOutlined,
  ClockCircleOutlined,
  RightOutlined,
  CheckCircleFilled,
  GiftOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const countdown = ref('02:15:30')
const currentSession = ref(2)
const rulesActiveKey = ref<string[]>([])
const orderModalVisible = ref(false)
const successModalVisible = ref(false)
const reserveModalVisible = ref(false)
const showAddressModal = ref(false)
const selectedProduct = ref<any>(null)
const selectedSpec = ref('原味')
const quantity = ref(1)
const usePoints = ref(false)
const orderNumber = ref('')
const earnedPoints = ref(0)
const reserveSession = ref<any>(null)

let countdownTimer: number | null = null

// 场次数据
const sessions = ref([
  { id: 1, time: '10:00', status: 'ended' },
  { id: 2, time: '14:00', status: 'active' },
  { id: 3, time: '20:00', status: 'upcoming' },
  { id: 4, time: '次日 10:00', status: 'upcoming' }
])

// 商品数据
const allProducts = ref({
  1: [], // 10:00场次商品
  2: [ // 14:00场次商品
    {
      id: 1,
      name: '爆款零食大礼包',
      salePrice: 9.9,
      originalPrice: 39.9,
      discount: 2.5,
      soldPercent: 85,
      stock: 15,
      color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      pointsDeduction: { points: 500, amount: 5 }
    },
    {
      id: 2,
      name: '新鲜水果组合',
      salePrice: 19.9,
      originalPrice: 49.9,
      discount: 4.0,
      soldPercent: 65,
      stock: 45,
      color: 'linear-gradient(135deg, #00A8E8 0%, #00D9FF 100%)',
      pointsDeduction: null
    },
    {
      id: 3,
      name: '优质大米10斤',
      salePrice: 29.9,
      originalPrice: 59.9,
      discount: 5.0,
      soldPercent: 92,
      stock: 8,
      color: 'linear-gradient(135deg, #8338EC 0%, #A855F7 100%)',
      pointsDeduction: { points: 300, amount: 3 }
    },
    {
      id: 4,
      name: '精品茶叶礼盒',
      salePrice: 39.9,
      originalPrice: 99.9,
      discount: 4.0,
      soldPercent: 30,
      stock: 70,
      color: 'linear-gradient(135deg, #FB5607 0%, #FFBE0B 100%)',
      pointsDeduction: null
    },
    {
      id: 5,
      name: '进口坚果礼包',
      salePrice: 24.9,
      originalPrice: 69.9,
      discount: 3.6,
      soldPercent: 100,
      stock: 0,
      color: 'linear-gradient(135deg, #3A86FF 0%, #06B6D4 100%)',
      pointsDeduction: { points: 200, amount: 2 }
    },
    {
      id: 6,
      name: '有机蔬菜套餐',
      salePrice: 14.9,
      originalPrice: 34.9,
      discount: 4.3,
      soldPercent: 58,
      stock: 42,
      color: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      pointsDeduction: null
    }
  ],
  3: [], // 20:00场次商品
  4: []  // 次日10:00场次商品
})

// 当前场次的商品
const currentProducts = computed(() => {
  return allProducts.value[currentSession.value] || []
})

// 最终支付金额
const finalAmount = computed(() => {
  if (!selectedProduct.value) return 0
  let amount = selectedProduct.value.salePrice
  if (usePoints.value && selectedProduct.value.pointsDeduction) {
    amount -= selectedProduct.value.pointsDeduction.amount
  }
  return amount.toFixed(2)
})

// 倒计时
const startCountdown = () => {
  let hours = 2
  let minutes = 15
  let seconds = 30

  countdownTimer = window.setInterval(() => {
    seconds--
    if (seconds < 0) {
      seconds = 59
      minutes--
      if (minutes < 0) {
        minutes = 59
        hours--
        if (hours < 0) {
          hours = 2
          minutes = 15
          seconds = 30
        }
      }
    }
    countdown.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, 1000)
}

// 切换场次
const switchSession = (session: any) => {
  if (session.status === 'ended') {
    message.info('该场次已结束，查看往期商品')
    return
  }
  if (session.status === 'upcoming') {
    // 显示预约提醒弹窗
    reserveSession.value = session
    reserveModalVisible.value = true
    return
  }
  currentSession.value = session.id
}

// 确认预约
const confirmReserve = () => {
  message.success('预约成功！我们将在开始前5分钟提醒您')
  reserveModalVisible.value = false
}

// 立即抢购
const handleBuy = (product: any) => {
  if (product.stock === 0) {
    message.error('商品已抢光，看看其他商品吧~')
    return
  }
  selectedProduct.value = product
  selectedSpec.value = '原味'
  quantity.value = 1
  usePoints.value = false
  orderModalVisible.value = true
}

// 支付
const handlePayment = () => {
  orderModalVisible.value = false
  // 模拟支付成功
  setTimeout(() => {
    orderNumber.value = 'ORD' + Date.now()
    earnedPoints.value = Math.floor(parseFloat(finalAmount.value) * 10)
    successModalVisible.value = true
  }, 500)
}

// 查看订单
const viewOrder = () => {
  successModalVisible.value = false
  message.info('跳转到订单详情页')
}

// 继续抢购
const continueShopping = () => {
  successModalVisible.value = false
}

// 分享
const handleShare = () => {
  message.success('分享功能开发中')
}

// 分享成功后的奖励
const handleShareSuccess = () => {
  message.success('分享成功！您和好友各获得50积分')
  successModalVisible.value = false
}

// 显示推荐商品
const showRecommend = () => {
  message.info('为您推荐相似商品')
}

// 返回
const goBack = () => {
  router.back()
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.flash-sale-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.page-header {
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
.share-icon {
  font-size: 18px;
  cursor: pointer;
  color: #333;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
}

/* 倒计时横幅 */
.countdown-banner {
  background: linear-gradient(135deg, #FF4444 0%, #FF8844 100%);
  padding: 20px;
  color: #fff;
  text-align: center;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.thunder-icon {
  font-size: 36px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.countdown-info {
  text-align: left;
}

.countdown-title {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.countdown-time {
  font-size: 32px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 场次切换Tab */
.session-tabs {
  background: #fff;
  display: flex;
  padding: 10px;
  gap: 10px;
  overflow-x: auto;
  border-bottom: 1px solid #f0f0f0;
}

.session-tab {
  flex-shrink: 0;
  padding: 10px 20px;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  min-width: 90px;
}

.session-tab.active {
  background: linear-gradient(135deg, #FF4444 0%, #FF8844 100%);
  color: #fff;
}

.session-tab.upcoming {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.session-tab.ended {
  opacity: 0.5;
}

.session-time {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
}

.session-status {
  font-size: 12px;
}

.status-active {
  color: #fff;
}

.status-upcoming {
  color: #1890ff;
}

.status-ended {
  color: #999;
}

/* 商品列表 (双列瀑布流) */
.product-list {
  padding: 15px 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 150px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sale-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 68, 68, 0.95);
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.mini-countdown {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 39px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.current-price {
  color: #FF4444;
  font-weight: bold;
}

.price-symbol {
  font-size: 12px;
}

.price-value {
  font-size: 20px;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background: #FF4444;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.points-tip {
  font-size: 11px;
  color: #FF8844;
  margin-bottom: 8px;
  background: #fff7e6;
  padding: 4px 8px;
  border-radius: 4px;
}

.stock-section {
  margin-bottom: 10px;
}

.stock-text {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

.sold-out-text {
  color: #FF4444;
  font-weight: 600;
}

.sold-percent {
  color: #999;
}

.buy-btn {
  height: 36px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 18px;
}

.sold-out-btn {
  height: 36px;
  font-size: 14px;
  border-radius: 18px;
  background: #f5f5f5;
  color: #999;
}

.recommend-tip {
  text-align: center;
  font-size: 12px;
  color: #1890ff;
  margin-top: 8px;
  cursor: pointer;
}

/* 秒杀规则 */
.rules-section {
  margin: 15px 10px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.rule-item {
  margin-bottom: 12px;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.rule-content {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* 快速下单弹窗 */
.order-modal {
  padding: 10px 0;
}

.payment-countdown {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #fa8c16;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-product {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 15px;
}

.order-product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.order-product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.order-product-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.order-product-price {
  font-size: 20px;
  color: #FF4444;
  font-weight: bold;
}

.order-section {
  margin-bottom: 15px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.limit-tip {
  font-size: 12px;
  color: #999;
}

.address-section {
  cursor: pointer;
}

.address-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.address-info {
  flex: 1;
}

.address-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
}

.address-detail {
  font-size: 13px;
  color: #666;
}

.payment-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 15px;
  margin-bottom: 15px;
}

.amount-label {
  font-size: 14px;
  color: #666;
}

.amount-value {
  font-size: 24px;
  color: #FF4444;
  font-weight: bold;
}

.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
}

/* 支付成功弹窗 */
.success-modal {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  margin-bottom: 20px;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.success-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: left;
}

.info-item {
  margin-bottom: 10px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.info-item.reward {
  color: #fa8c16;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #d9d9d9;
}

.share-incentive {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  color: #fff;
}

.share-title {
  font-size: 14px;
  margin-bottom: 10px;
}

.success-actions {
  display: flex;
  gap: 10px;
}

/* 预约提醒弹窗 */
.reserve-modal {
  text-align: center;
  padding: 20px 0;
}

.reserve-info {
  margin-bottom: 20px;
}

.reserve-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.reserve-desc {
  font-size: 14px;
  color: #666;
}
</style>

