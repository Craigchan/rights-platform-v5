<template>
  <div class="product-detail-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">商品详情</span>
      <ShareAltOutlined class="share-icon" @click="handleShare" />
    </div>

    <!-- 1. 商品主图与轮播区 -->
    <div class="product-gallery">
      <a-carousel autoplay>
        <div v-for="(img, index) in productImages" :key="index" class="gallery-slide">
          <div class="gallery-image" :style="{ background: img }"></div>
        </div>
      </a-carousel>
      <div class="image-indicator">{{ currentImageIndex + 1 }}/{{ productImages.length }}</div>
    </div>

    <!-- 2. 商品基本信息区 -->
    <div class="product-info-section">
      <div class="product-name">{{ productData.name }}</div>
      <div class="product-selling-point">{{ productData.sellingPoint }}</div>
      
      <div class="price-section">
        <div class="exchange-price">
          <span v-if="selectedExchangeType === 'pure'" class="price-main">
            {{ productData.purePoints.toLocaleString() }} 积分
          </span>
          <span v-else class="price-mixed">
            <span class="points-part">{{ productData.mixedPoints }} 积分</span>
            <span class="cash-part">+ ¥{{ productData.mixedCash }}</span>
          </span>
        </div>
        <div class="market-price">市场价：¥{{ productData.marketPrice }}</div>
        <div class="exchange-count">已有 {{ productData.exchangeCount }} 人兑换</div>
      </div>
    </div>

    <!-- 3. 兑换方式选择区 -->
    <div class="exchange-options-section" v-if="productData.hasMultipleOptions">
      <div class="section-title">兑换方式</div>
      <a-radio-group v-model:value="selectedExchangeType" class="exchange-radio-group">
        <a-radio value="pure" class="exchange-radio">
          <div class="radio-content">
            <div class="radio-label">纯积分兑换</div>
            <div class="radio-value">{{ productData.purePoints.toLocaleString() }} 积分</div>
          </div>
        </a-radio>
        <a-radio value="mixed" class="exchange-radio">
          <div class="radio-content">
            <div class="radio-label">积分+现金</div>
            <div class="radio-value">{{ productData.mixedPoints }} 积分 + ¥{{ productData.mixedCash }}</div>
            <div class="radio-badge">推荐</div>
          </div>
        </a-radio>
      </a-radio-group>
    </div>

    <!-- 4. 商品规格选择区 -->
    <div class="spec-section" v-if="productData.hasSpecs">
      <div class="section-title">选择规格</div>
      
      <!-- 颜色选择 -->
      <div class="spec-group" v-if="productData.colors">
        <div class="spec-label">颜色</div>
        <div class="spec-options">
          <div 
            v-for="color in productData.colors" 
            :key="color.id"
            class="spec-option color-option"
            :class="{ 'selected': selectedColor === color.id }"
            @click="selectedColor = color.id"
          >
            <div class="color-block" :style="{ background: color.value }"></div>
            <span>{{ color.name }}</span>
          </div>
        </div>
      </div>

      <!-- 尺寸选择 -->
      <div class="spec-group" v-if="productData.sizes">
        <div class="spec-label">尺寸</div>
        <div class="spec-options">
          <div 
            v-for="size in productData.sizes" 
            :key="size.id"
            class="spec-option"
            :class="{ 'selected': selectedSize === size.id }"
            @click="selectedSize = size.id"
          >
            {{ size.name }}
          </div>
        </div>
      </div>

      <!-- 数量选择 -->
      <div class="spec-group">
        <div class="spec-label">数量</div>
        <div class="quantity-info">
          <span class="limit-text">限兑 {{ productData.limitPerUser }} 件</span>
        </div>
      </div>
    </div>

    <!-- 5. 商品详情与图文描述区 -->
    <div class="detail-tabs-section">
      <a-tabs v-model:activeKey="activeDetailTab">
        <a-tab-pane key="detail" tab="商品详情">
          <div class="detail-content">
            <h4>产品参数</h4>
            <div class="param-list">
              <div v-for="param in productData.params" :key="param.label" class="param-item">
                <span class="param-label">{{ param.label }}</span>
                <span class="param-value">{{ param.value }}</span>
              </div>
            </div>
            <h4>功能特点</h4>
            <ul class="feature-list">
              <li v-for="(feature, index) in productData.features" :key="index">{{ feature }}</li>
            </ul>
            <h4>使用场景</h4>
            <p class="usage-desc">{{ productData.usageScenario }}</p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="exchange" tab="兑换说明">
          <div class="exchange-rules">
            <div class="rule-item">
              <div class="rule-icon">📦</div>
              <div class="rule-content">
                <div class="rule-title">发货时间</div>
                <div class="rule-desc">{{ productData.deliveryTime }}</div>
              </div>
            </div>
            <div class="rule-item">
              <div class="rule-icon">🚚</div>
              <div class="rule-content">
                <div class="rule-title">物流方式</div>
                <div class="rule-desc">{{ productData.logistics }}</div>
              </div>
            </div>
            <div class="rule-item">
              <div class="rule-icon">🔄</div>
              <div class="rule-content">
                <div class="rule-title">售后政策</div>
                <div class="rule-desc">{{ productData.afterSales }}</div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="reviews" tab="用户评价">
          <div class="reviews-section">
            <div class="review-summary">
              <div class="summary-score">
                <span class="score-value">4.8</span>
                <span class="score-total">/5.0</span>
              </div>
              <div class="summary-text">
                <div>好评率 96%</div>
                <div>共 {{ productData.reviewCount }} 条评价</div>
              </div>
            </div>
            <div class="review-list">
              <div v-for="review in productData.reviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <div class="reviewer-info">
                    <div class="reviewer-avatar">{{ review.userName.charAt(0) }}</div>
                    <span class="reviewer-name">{{ review.userName }}</span>
                  </div>
                  <div class="review-rating">
                    <StarFilled v-for="i in 5" :key="i" :class="{ 'active': i <= review.rating }" />
                  </div>
                </div>
                <div class="review-content">{{ review.content }}</div>
                <div class="review-time">{{ review.time }}</div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 6. 温馨提示区 -->
    <div class="notice-section">
      <div class="notice-title">
        <InfoCircleOutlined />
        <span>温馨提示</span>
      </div>
      <ul class="notice-list">
        <li>每个用户限兑 {{ productData.limitPerUser }} 件</li>
        <li>兑换后积分不可退还</li>
        <li v-if="productData.type === 'virtual'">虚拟商品兑换后立即发放至账户</li>
        <li v-else>实物商品预计 {{ productData.deliveryDays }} 个工作日发货</li>
      </ul>
    </div>

    <!-- 悬浮购物车按钮 -->
    <div class="floating-cart-btn" @click="goToCart" v-if="cartStore.totalItems > 0">
      <ShoppingCartOutlined class="cart-icon" />
      <span class="cart-count">{{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}</span>
    </div>

    <!-- 7. 底部操作栏 -->
    <div class="bottom-action-bar">
      <div class="action-icons">
        <div class="action-icon-item" @click="handleContact">
          <CustomerServiceOutlined />
          <span>客服</span>
        </div>
        <div class="action-icon-item" @click="handleFavorite">
          <HeartOutlined :class="{ 'favorited': isFavorited }" />
          <span>收藏</span>
        </div>
      </div>
      <div class="action-buttons">
        <a-button size="large" class="cart-btn" @click="handleAddToCart">
          <ShoppingCartOutlined />
          加入购物车
        </a-button>
        <a-button type="primary" size="large" class="redeem-btn" @click="handleRedeem">
          立即兑换
        </a-button>
      </div>
    </div>

    <!-- 兑换确认弹窗 -->
    <a-modal
      v-model:open="redeemModalVisible"
      title="确认兑换信息"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <div class="redeem-confirm-content">
        <!-- 商品信息 -->
        <div class="confirm-product">
          <div class="confirm-product-image" :style="{ background: productImages[0] }"></div>
          <div class="confirm-product-info">
            <div class="confirm-product-name">{{ productData.name }}</div>
            <div class="confirm-product-spec" v-if="selectedColor || selectedSize">
              <span v-if="selectedColor">{{ getColorName(selectedColor) }}</span>
              <span v-if="selectedSize"> / {{ getSizeName(selectedSize) }}</span>
            </div>
          </div>
        </div>

        <!-- 商家优惠券 -->
        <div class="confirm-section coupon-section" @click="showCouponDrawer">
          <div class="section-label">商家店铺优惠</div>
          <div class="section-value">
            <span v-if="selectedCoupon">已选 {{ selectedCoupon.discount }}元券</span>
            <span v-else class="select-hint">选择优惠券</span>
            <RightOutlined />
          </div>
        </div>

        <!-- 发货信息 -->
        <div class="confirm-section delivery-section" @click="showDeliveryDrawer">
          <div class="section-label">发货</div>
          <div class="section-value">
            <EnvironmentOutlined />
            <span>{{ deliveryInfo.city }}</span>
            <span class="delivery-note">{{ deliveryInfo.note }}</span>
            <RightOutlined />
          </div>
        </div>

        <!-- 商户信息板块 -->
        <div class="merchant-section">
          <div class="merchant-info-row">
            <div class="merchant-left">
              <div class="merchant-name">{{ merchantInfo.name }}</div>
              <div class="merchant-meta">
                <div class="merchant-rating">
                  <StarFilled v-for="i in merchantInfo.rating" :key="i" class="star-icon" />
                </div>
                <span class="follower-count">{{ merchantInfo.followers.toLocaleString() }}人关注</span>
              </div>
              <div class="merchant-address">
                <EnvironmentOutlined class="address-icon" />
                {{ merchantInfo.address }}
              </div>
            </div>
          </div>
          <div class="merchant-actions">
            <a-button class="merchant-btn" @click="handleContactMerchant">联系商家</a-button>
            <a-button class="merchant-btn merchant-btn-primary" @click="handleVisitStore">进入店铺</a-button>
          </div>
        </div>

        <!-- 收货地址 -->
        <div v-if="productData.type === 'physical'" class="confirm-section address-section" @click="showAddressDrawer">
          <div class="section-label">收货地址</div>
          <div class="section-value">
            <span v-if="selectedAddress">{{ selectedAddress.name }} {{ selectedAddress.phone }}</span>
            <span v-else class="select-hint">请选择收货地址</span>
            <RightOutlined />
          </div>
        </div>

        <!-- 积分消耗明细 -->
        <div class="cost-summary">
          <div class="cost-item">
            <span>积分消耗</span>
            <span class="cost-value points-cost">{{ currentRedeemPoints }}</span>
          </div>
          <div v-if="selectedExchangeType === 'mixed'" class="cost-item">
            <span>现金支付</span>
            <span class="cost-value cash-cost">¥{{ productData.mixedCash }}</span>
          </div>
        </div>

        <!-- 确认按钮 -->
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="confirm-redeem-btn"
          @click="confirmRedeem"
        >
          确认兑换
        </a-button>
      </div>
    </a-modal>

    <!-- 优惠券抽屉 -->
    <a-drawer
      v-model:open="couponDrawerVisible"
      title="选择优惠券"
      placement="bottom"
      height="66.67%"
    >
      <div class="coupon-list">
        <div 
          v-for="coupon in availableCoupons" 
          :key="coupon.id"
          class="coupon-item"
          :class="{ 'selected': selectedCoupon?.id === coupon.id }"
          @click="selectCoupon(coupon)"
        >
          <div class="coupon-amount">¥{{ coupon.discount }}</div>
          <div class="coupon-info">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-condition">满{{ coupon.minAmount }}元可用</div>
          </div>
          <div class="coupon-check">
            <CheckCircleFilled v-if="selectedCoupon?.id === coupon.id" />
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- 发货说明抽屉 -->
    <a-drawer
      v-model:open="deliveryDrawerVisible"
      title="包邮说明"
      placement="bottom"
      height="66.67%"
    >
      <div class="delivery-detail">
        <h4>包邮说明</h4>
        <p>{{ deliveryInfo.freeShippingNote }}</p>
        <h4>发货时间</h4>
        <p>{{ productData.deliveryTime }}</p>
        <h4>配送范围</h4>
        <p>{{ deliveryInfo.coverageNote }}</p>
      </div>
    </a-drawer>

    <!-- 地址选择抽屉 -->
    <a-drawer
      v-model:open="addressDrawerVisible"
      title="选择收货地址"
      placement="bottom"
      height="60%"
    >
      <div class="address-list">
        <div 
          v-for="address in userAddresses" 
          :key="address.id"
          class="address-item"
          :class="{ 'selected': selectedAddress?.id === address.id }"
          @click="selectAddress(address)"
        >
          <div class="address-header">
            <span class="address-name">{{ address.name }}</span>
            <span class="address-phone">{{ address.phone }}</span>
            <a-tag v-if="address.isDefault" color="orange" size="small">默认</a-tag>
          </div>
          <div class="address-detail">{{ address.detail }}</div>
          <div class="address-check">
            <CheckCircleFilled v-if="selectedAddress?.id === address.id" />
          </div>
        </div>
        <a-button type="dashed" block @click="handleAddAddress">
          <PlusOutlined /> 新增收货地址
        </a-button>
      </div>
    </a-drawer>

    <!-- 积分不足弹窗 -->
    <a-modal
      v-model:open="pointsInsufficientVisible"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '350px' }"
    >
      <div class="insufficient-content">
        <div class="insufficient-icon">⚠️</div>
        <div class="insufficient-title">积分不足</div>
        <div class="insufficient-message">
          您的积分不足，还需 <span class="shortage-points">{{ pointsShortage.toLocaleString() }}</span> 积分
        </div>
        <div class="insufficient-actions">
          <a-button @click="pointsInsufficientVisible = false">取消</a-button>
          <a-button type="primary" @click="goToEarnPoints">去赚积分</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 兑换成功弹窗 -->
    <a-modal
      v-model:open="successModalVisible"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '350px' }"
    >
      <div class="success-content">
        <CheckCircleFilled class="success-icon" />
        <div class="success-title">兑换成功！</div>
        <div class="success-order">订单编号：{{ orderNumber }}</div>
        <div class="success-delivery">
          <span v-if="productData.type === 'virtual'">已发放至账户</span>
          <span v-else>预计 {{ productData.deliveryDays }} 个工作日发货</span>
        </div>
        <div class="success-actions">
          <a-button @click="viewOrder">查看订单</a-button>
          <a-button type="primary" @click="continueShopping">继续逛逛</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 快速结算 Modal -->
    <CheckoutModal 
      v-model="showQuickCheckoutModal"
      :items="quickCheckoutItems"
      @success="handleQuickCheckoutSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useCartStore } from '@/stores/cart'
import CheckoutModal from '@/components/CheckoutModal.vue'
import {
  LeftOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  CustomerServiceOutlined,
  HeartOutlined,
  StarFilled,
  RightOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  PlusOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// 当前图片索引
const currentImageIndex = ref(0)

// 商品图片
const productImages = ref([
  'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
  'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
])

// 商品数据
const productData = ref({
  id: 1,
  name: '小米无线蓝牙耳机 Air 2 Pro',
  sellingPoint: '爆款热销，限时特惠，主动降噪，超长续航',
  purePoints: 12000,
  mixedPoints: 500,
  mixedCash: 199,
  marketPrice: 399,
  exchangeCount: 856,
  hasMultipleOptions: true,
  hasSpecs: true,
  type: 'physical', // physical 或 virtual
  limitPerUser: 1,
  deliveryTime: '兑换成功后24小时内发货',
  deliveryDays: 3,
  logistics: '顺丰快递，全国包邮',
  afterSales: '7天无理由退换，质量问题30天包换',
  reviewCount: 234,
  colors: [
    { id: 1, name: '曜石黑', value: '#333' },
    { id: 2, name: '陶瓷白', value: '#fff' },
    { id: 3, name: '天空蓝', value: '#4FACFE' }
  ],
  sizes: [
    { id: 1, name: 'S' },
    { id: 2, name: 'M' },
    { id: 3, name: 'L' },
    { id: 4, name: 'XL' }
  ],
  params: [
    { label: '品牌', value: '小米' },
    { label: '型号', value: 'Air 2 Pro' },
    { label: '连接方式', value: '蓝牙5.2' },
    { label: '续航时间', value: '28小时' },
    { label: '降噪深度', value: '35dB' }
  ],
  features: [
    '主动降噪技术，隔绝外界噪音',
    '超长续航，单次使用7小时',
    '蓝牙5.2，连接更稳定',
    '轻量化设计，佩戴舒适',
    '触控操作，便捷智能'
  ],
  usageScenario: '适用于通勤、运动、办公等多种场景，无论是地铁上、健身房还是办公室，都能享受纯净的音乐体验。',
  reviews: [
    {
      id: 1,
      userName: '张***',
      rating: 5,
      content: '音质很好，降噪效果不错，性价比很高！',
      time: '2025-10-10'
    },
    {
      id: 2,
      userName: '李***',
      rating: 5,
      content: '续航时间长，佩戴舒适，值得购买。',
      time: '2025-10-09'
    },
    {
      id: 3,
      userName: '王***',
      rating: 4,
      content: '整体不错，就是充电盒有点大。',
      time: '2025-10-08'
    }
  ]
})

// 选择的兑换方式
const selectedExchangeType = ref('mixed')

// 选择的颜色和尺寸
const selectedColor = ref(1)
const selectedSize = ref(null)

// 详情Tab
const activeDetailTab = ref('detail')

// 是否收藏
const isFavorited = ref(false)

// 兑换弹窗
const redeemModalVisible = ref(false)

// 快速结算 Modal
const showQuickCheckoutModal = ref(false)

// 快速结算商品列表
const quickCheckoutItems = computed(() => {
  if (!selectedColor.value || !selectedSize.value) return []
  
  const colorName = productData.value.colors.find(c => c.id === selectedColor.value)?.name || ''
  const sizeName = productData.value.sizes.find(s => s.id === selectedSize.value)?.name || ''
  
  return [{
    id: Date.now(),
    productId: productData.value.id,
    name: productData.value.name,
    image: productImages.value[0],
    color: productImages.value[0],
    price: selectedExchangeType.value === 'mixed' ? productData.value.mixedCash : 0,
    points: selectedExchangeType.value === 'mixed' ? productData.value.mixedPoints : productData.value.purePoints,
    quantity: 1,
    spec: `${colorName} ${sizeName}`
  }]
})

// 优惠券相关
const couponDrawerVisible = ref(false)
const selectedCoupon = ref(null)
const availableCoupons = ref([
  { id: 1, name: '店铺优惠券', discount: 10, minAmount: 100 },
  { id: 2, name: '新人专享券', discount: 20, minAmount: 200 },
  { id: 3, name: '满减券', discount: 50, minAmount: 500 }
])

// 发货信息
const deliveryDrawerVisible = ref(false)
const deliveryInfo = ref({
  city: '南京市',
  note: '无条件包邮',
  freeShippingNote: '全国范围内免运费，偏远地区除外（西藏、新疆、内蒙古等）',
  coverageNote: '配送范围覆盖全国大部分地区，部分偏远地区可能无法配送。'
})

// 商户信息
const merchantInfo = ref({
  name: '小米官方旗舰店',
  rating: 5,
  followers: 12580,
  address: '南京市建邺区江东中路123号'
})

// 地址相关
const addressDrawerVisible = ref(false)
const selectedAddress = ref(null)
const userAddresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****5678',
    detail: '江苏省南京市建邺区江东中路123号',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****8765',
    detail: '江苏省南京市鼓楼区中山路456号',
    isDefault: false
  }
])

// 兑换成功
const successModalVisible = ref(false)
const orderNumber = ref('')

// 计算当前兑换所需积分
const currentRedeemPoints = computed(() => {
  if (selectedExchangeType.value === 'pure') {
    return `${productData.value.purePoints.toLocaleString()} 积分`
  } else {
    return `${productData.value.mixedPoints} 积分 + ¥${productData.value.mixedCash}`
  }
})

// 方法
const goBack = () => {
  router.back()
}

const handleShare = () => {
  message.success('分享功能')
}

const handleContact = () => {
  message.info('联系客服')
}

const handleFavorite = () => {
  isFavorited.value = !isFavorited.value
  message.success(isFavorited.value ? '已收藏' : '已取消收藏')
}

// 积分不足弹窗
const pointsInsufficientVisible = ref(false)
const pointsShortage = ref(0)

const handleRedeem = () => {
  // 步骤1: 积分余额校验
  const userPoints = 15280
  const requiredPoints = selectedExchangeType.value === 'pure' 
    ? productData.value.purePoints 
    : productData.value.mixedPoints
  
  if (userPoints < requiredPoints) {
    pointsShortage.value = requiredPoints - userPoints
    pointsInsufficientVisible.value = true
    return
  }
  
  // 设置默认地址
  if (!selectedAddress.value && userAddresses.value.length > 0) {
    selectedAddress.value = userAddresses.value.find(a => a.isDefault) || userAddresses.value[0]
  }
  
  // 步骤2: 显示确认兑换信息弹窗
  redeemModalVisible.value = true
}

// 跳转到玩赚积分页面
const goToEarnPoints = () => {
  pointsInsufficientVisible.value = false
  router.push('/earn-points')
}

const showCouponDrawer = () => {
  couponDrawerVisible.value = true
}

const showDeliveryDrawer = () => {
  deliveryDrawerVisible.value = true
}

const showAddressDrawer = () => {
  addressDrawerVisible.value = true
}

const selectCoupon = (coupon: any) => {
  selectedCoupon.value = coupon
  couponDrawerVisible.value = false
}

const selectAddress = (address: any) => {
  selectedAddress.value = address
  addressDrawerVisible.value = false
}

const handleContactMerchant = () => {
  message.info('联系商家')
}

const handleVisitStore = () => {
  message.info('进入店铺')
}

const handleAddAddress = () => {
  message.info('新增地址功能')
}

const getColorName = (colorId: number) => {
  return productData.value.colors?.find(c => c.id === colorId)?.name || ''
}

const getSizeName = (sizeId: number) => {
  return productData.value.sizes?.find(s => s.id === sizeId)?.name || ''
}

// 加入购物车
const handleAddToCart = () => {
  // 验证规格选择
  if (productData.value.hasSpecs) {
    if (productData.value.colors && !selectedColor.value) {
      message.warning('请选择颜色')
      return
    }
    if (productData.value.sizes && !selectedSize.value) {
      message.warning('请选择尺寸')
      return
    }
  }

  // 获取当前选择的价格
  const points = selectedExchangeType.value === 'pure' 
    ? productData.value.purePoints 
    : productData.value.mixedPoints
  
  const price = selectedExchangeType.value === 'pure'
    ? 0
    : productData.value.mixedCash

  // 构建规格描述
  let spec = ''
  if (selectedColor.value) {
    spec += getColorName(selectedColor.value)
  }
  if (selectedSize.value) {
    spec += (spec ? ' / ' : '') + getSizeName(selectedSize.value)
  }
  if (!spec) {
    spec = '默认规格'
  }

  // 加入购物车
  cartStore.addItem({
    id: Date.now(), // 使用时间戳作为唯一ID
    productId: productData.value.id,
    name: productData.value.name,
    image: productImages.value[0],
    price: price,
    points: points,
    stock: 999 // 模拟库存
  })

  // 提示成功
  message.success({
    content: '已加入购物车',
    duration: 2
  })
}

const confirmRedeem = () => {
  // 检查规格选择
  if (!selectedColor.value) {
    message.warning('请选择颜色')
    return
  }
  if (!selectedSize.value) {
    message.warning('请选择尺寸')
    return
  }
  
  // 关闭兑换弹窗，打开快速结算 Modal
  redeemModalVisible.value = false
  showQuickCheckoutModal.value = true
}

// 快速结算成功回调
const handleQuickCheckoutSuccess = (orderId: string) => {
  orderNumber.value = orderId
  successModalVisible.value = true
}

const completeRedeem = () => {
  // 生成订单号
  orderNumber.value = 'ORD' + Date.now()
  successModalVisible.value = true
}

const viewOrder = () => {
  successModalVisible.value = false
  message.info('查看订单')
}

const continueShopping = () => {
  successModalVisible.value = false
  router.push('/points-mall')
}

const goToCart = () => {
  router.push('/cart')
}

onMounted(() => {
  // 初始化购物车数据
  cartStore.init()
  
  // 可以根据路由参数加载不同的商品数据
  const productId = route.query.id
  console.log('Product ID:', productId)
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 70px;
}

/* 顶部导航 */
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
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
}

/* 1. 商品主图与轮播区 */
.product-gallery {
  position: relative;
  background: #fff;
}

.gallery-slide {
  height: 375px;
}

.gallery-image {
  width: 100%;
  height: 100%;
}

.image-indicator {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

/* 2. 商品基本信息区 */
.product-info-section {
  background: #fff;
  padding: 15px;
  margin-top: 10px;
}

.product-name {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 8px;
}

.product-selling-point {
  font-size: 13px;
  color: #999;
  line-height: 1.5;
  margin-bottom: 15px;
}

.price-section {
  padding: 15px;
  background: #FFF5E5;
  border-radius: 8px;
}

.exchange-price {
  margin-bottom: 8px;
}

.price-main {
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
}

.price-mixed {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.points-part,
.cash-part {
  font-size: 20px;
  font-weight: bold;
  color: #FF6B35;
}

.market-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
  margin-bottom: 6px;
}

.exchange-count {
  font-size: 12px;
  color: #666;
}

/* 3. 兑换方式选择区 */
.exchange-options-section {
  background: #fff;
  padding: 15px;
  margin-top: 10px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.exchange-radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exchange-radio {
  width: 100%;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin: 0;
}

.exchange-radio :deep(.ant-radio) {
  align-self: flex-start;
  margin-top: 2px;
}

.radio-content {
  flex: 1;
  position: relative;
}

.radio-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.radio-value {
  font-size: 16px;
  font-weight: 600;
  color: #FF6B35;
}

.radio-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 4. 商品规格选择区 */
.spec-section {
  background: #fff;
  padding: 15px;
  margin-top: 10px;
}

.spec-group {
  margin-bottom: 20px;
}

.spec-group:last-child {
  margin-bottom: 0;
}

.spec-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-option {
  padding: 8px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.spec-option.selected {
  border-color: #FF6B35;
  color: #FF6B35;
  background: #FFF5E5;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-block {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #e8e8e8;
}

.quantity-info {
  font-size: 13px;
  color: #999;
}

.limit-text {
  color: #FF6B35;
}

/* 5. 商品详情与图文描述区 */
.detail-tabs-section {
  background: #fff;
  margin-top: 10px;
  padding: 0 15px;
}

.detail-content h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 15px 0 10px;
}

.param-list {
  margin-bottom: 15px;
}

.param-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
}

.param-label {
  color: #999;
}

.param-value {
  color: #333;
}

.feature-list {
  padding-left: 20px;
  margin-bottom: 15px;
}

.feature-list li {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.usage-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.exchange-rules {
  padding: 10px 0;
}

.rule-item {
  display: flex;
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-icon {
  font-size: 24px;
}

.rule-content {
  flex: 1;
}

.rule-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.rule-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.reviews-section {
  padding: 10px 0;
}

.review-summary {
  display: flex;
  gap: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 15px;
}

.summary-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  color: #FF6B35;
}

.score-total {
  font-size: 16px;
  color: #999;
}

.summary-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-item {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reviewer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.reviewer-name {
  font-size: 14px;
  color: #333;
}

.review-rating {
  display: flex;
  gap: 2px;
  font-size: 12px;
  color: #ddd;
}

.review-rating .active {
  color: #FFB800;
}

.review-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.review-time {
  font-size: 12px;
  color: #999;
}

/* 6. 温馨提示区 */
.notice-section {
  background: #fff;
  padding: 15px;
  margin-top: 10px;
}

.notice-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.notice-list {
  padding-left: 20px;
}

.notice-list li {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

/* 7. 底部操作栏 */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.action-icons {
  display: flex;
  gap: 20px;
}

.action-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 20px;
  color: #666;
}

.action-icon-item span {
  font-size: 11px;
}

.action-icon-item .favorited {
  color: #FF6B35;
}

.action-buttons {
  flex: 1;
  display: flex;
  gap: 10px;
}

.cart-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 500;
  border: 1px solid #FF6B35;
  color: #FF6B35;
}

.cart-btn:hover {
  border-color: #FF8C61;
  color: #FF8C61;
}

.redeem-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 600;
}

/* 悬浮购物车按钮 */
.floating-cart-btn {
  position: fixed;
  right: 20px;
  bottom: 100px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s;
  animation: float 3s ease-in-out infinite;
}

.floating-cart-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.5);
}

.floating-cart-btn:active {
  transform: scale(0.95);
}

.floating-cart-btn .cart-icon {
  font-size: 26px;
  color: #fff;
}

.floating-cart-btn .cart-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  background: #FF4444;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(255, 68, 68, 0.4);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 兑换确认弹窗 */
.redeem-confirm-content {
  padding: 10px 0;
}

.confirm-product {
  display: flex;
  gap: 12px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 15px;
}

.confirm-product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.confirm-product-info {
  flex: 1;
}

.confirm-product-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.confirm-product-spec {
  font-size: 13px;
  color: #999;
}

.confirm-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.section-label {
  font-size: 14px;
  color: #333;
}

.section-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.select-hint {
  color: #999;
}

.delivery-note {
  color: #FF6B35;
  font-size: 12px;
}

.merchant-section {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 15px 0;
}

.merchant-info-row {
  margin-bottom: 12px;
}

.merchant-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.merchant-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.merchant-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.merchant-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.star-icon {
  color: #FFB800;
  font-size: 14px;
}

.follower-count {
  font-size: 13px;
  color: #999;
}

.merchant-address {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.address-icon {
  color: #999;
  font-size: 12px;
}

.merchant-actions {
  display: flex;
  gap: 10px;
}

.merchant-btn {
  flex: 1;
  height: 36px;
  border-radius: 18px;
  font-size: 14px;
  border: 1px solid #1890ff;
  color: #1890ff;
}

.merchant-btn-primary {
  background: linear-gradient(135deg, #FFB800 0%, #FF8C00 100%);
  border: none;
  color: #fff;
}

.cost-summary {
  padding: 15px 0;
  border-top: 1px solid #f5f5f5;
  margin-top: 15px;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.cost-value {
  font-weight: 600;
}

.points-cost {
  color: #FF6B35;
}

.cash-cost {
  color: #FF6B35;
}

.confirm-redeem-btn {
  margin-top: 20px;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 600;
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
  gap: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #FFF5E5 0%, #FFE5E5 100%);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
}

.coupon-item.selected {
  border-color: #FF6B35;
}

.coupon-amount {
  font-size: 24px;
  font-weight: bold;
  color: #FF6B35;
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

.coupon-condition {
  font-size: 12px;
  color: #999;
}

.coupon-check {
  font-size: 20px;
  color: #FF6B35;
}

/* 发货说明 */
.delivery-detail h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 15px 0 10px;
}

.delivery-detail h4:first-child {
  margin-top: 0;
}

.delivery-detail p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

/* 地址列表 */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-item {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
}

.address-item.selected {
  border-color: #FF6B35;
  background: #FFF5E5;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.address-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.address-phone {
  font-size: 14px;
  color: #666;
}

.address-detail {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.address-check {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 20px;
  color: #FF6B35;
}

/* 积分不足弹窗 */
.insufficient-content {
  text-align: center;
  padding: 20px 0;
}

.insufficient-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.insufficient-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.insufficient-message {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.shortage-points {
  color: #FF6B35;
  font-weight: 600;
  font-size: 16px;
}

.insufficient-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.insufficient-actions button {
  min-width: 120px;
}

/* 兑换成功 */
.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 64px;
  color: #52C41A;
  margin-bottom: 20px;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.success-order {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.success-delivery {
  font-size: 14px;
  color: #999;
  margin-bottom: 30px;
}

.success-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.success-actions button {
  min-width: 120px;
}
</style>

