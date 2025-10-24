<template>
  <div class="merchant-detail-page">
    <!-- 骨架屏加载 -->
    <PageSkeleton v-if="loading" type="merchant-detail" />

    <!-- 主内容 -->
    <div v-else>
    <!-- 顶部导航栏 -->
    <div :class="['header', { 'header-solid': scrolled }]">
      <LeftOutlined class="back-icon" @click="goBack" />
      <span v-if="scrolled" class="title">{{ merchant.name }}</span>
      <div class="header-actions">
        <ShareAltOutlined @click="shareMerchant" />
        <HeartOutlined v-if="!isFavorite" @click="toggleFavorite" />
        <HeartFilled v-else @click="toggleFavorite" style="color: #ff4d4f;" />
      </div>
    </div>

    <!-- 商家头图轮播 -->
    <div class="banner-carousel">
      <a-carousel autoplay :dots="{ className: 'custom-dots' }">
        <div v-for="(image, index) in merchant.images" :key="index" class="carousel-item">
          <img v-img-fallback :src="image" :alt="`商家图片${index + 1}`" />
        </div>
      </a-carousel>
      <div class="banner-overlay">
        <h1 class="merchant-name">{{ merchant.name }}</h1>
        <div class="merchant-tags">
          <a-tag v-for="tag in merchant.tags" :key="tag" color="orange">{{ tag }}</a-tag>
        </div>
        <div class="merchant-distance">
          <EnvironmentOutlined />
          距您 {{ merchant.distance }}
        </div>
      </div>
    </div>

    <!-- 商家信息卡片 -->
    <div class="merchant-info-card">
      <div class="rating-section">
        <div class="rating-score">
          <span class="score">{{ merchant.rating }}</span>
          <a-rate :value="merchant.rating" allow-half disabled />
        </div>
        <div class="rating-count" @click="scrollToReviews">
          <span>{{ merchant.reviewCount }}条评价</span>
          <RightOutlined />
        </div>
      </div>

      <div class="info-row">
        <EnvironmentOutlined class="icon" />
        <span class="text">{{ merchant.address }}</span>
        <a-button type="link" size="small" @click="navigateToMerchant">
          导航
        </a-button>
      </div>

      <div class="info-row">
        <ClockCircleOutlined class="icon" />
        <span class="text">{{ merchant.businessHours }}</span>
        <a-tag v-if="merchant.isOpen" color="success">营业中</a-tag>
        <a-tag v-else color="default">已打烊</a-tag>
      </div>

      <div class="info-row">
        <PhoneOutlined class="icon" />
        <span class="text">{{ merchant.phone }}</span>
        <a-button type="link" size="small" @click="callMerchant">
          拨打
        </a-button>
      </div>
    </div>

    <!-- 优惠券区域 -->
    <div class="coupon-section">
      <div class="section-header">
        <span class="section-title">优惠券</span>
        <span class="section-more" @click="viewAllCoupons">
          查看全部 <RightOutlined />
        </span>
      </div>
      <div class="coupon-list">
        <div
          v-for="coupon in merchant.coupons"
          :key="coupon.id"
          :class="['coupon-card', { 'coupon-received': coupon.received }]"
          @click="receiveCoupon(coupon)"
        >
          <div class="coupon-left">
            <div class="coupon-amount">
              <span class="symbol">¥</span>
              <span class="value">{{ coupon.amount }}</span>
            </div>
            <div class="coupon-condition">满{{ coupon.condition }}可用</div>
          </div>
          <div class="coupon-right">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-validity">{{ coupon.validity }}</div>
            <div class="coupon-action">
              {{ coupon.received ? '已领取' : '立即领取' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 惠买单区域 -->
    <div class="payment-section">
      <div class="section-header">
        <div class="payment-badge">
          <span class="badge-icon">单</span>
          <span class="badge-text">惠买单</span>
        </div>
      </div>
      <div class="payment-card">
        <div class="payment-info">
          <div class="payment-offer">每满20减2元</div>
          <div class="payment-time">周一至周日 | 民生银行卡专享</div>
        </div>
        <a-button type="primary" class="payment-btn" @click="goToPayment">
          买单
        </a-button>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div class="product-section">
      <div class="section-header">
        <span class="section-title">推荐商品</span>
      </div>
      <div class="product-grid">
        <div
          v-for="product in merchant.products"
          :key="product.id"
          class="product-card"
          @click="viewProduct(product)"
        >
          <img v-img-fallback :src="product.image" :alt="product.name" />
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ¥{{ product.originalPrice }}
              </span>
            </div>
            <a-button type="primary" size="small" block @click.stop="addToCart(product)">
              加入购物车
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户评价 -->
    <div ref="reviewsSection" class="reviews-section">
      <div class="section-header">
        <span class="section-title">用户评价 ({{ merchant.reviewCount }})</span>
      </div>

      <!-- 评分统计 -->
      <div class="rating-stats">
        <div class="rating-overview">
          <div class="overall-score">{{ merchant.rating }}</div>
          <a-rate :value="merchant.rating" allow-half disabled />
          <div class="total-reviews">共{{ merchant.reviewCount }}条评价</div>
        </div>
        <div class="rating-bars">
          <div v-for="(count, star) in merchant.ratingDistribution" :key="star" class="rating-bar">
            <span class="star-label">{{ star }}星</span>
            <a-progress
              :percent="(count / merchant.reviewCount) * 100"
              :show-info="false"
              stroke-color="#faad14"
            />
            <span class="count">{{ count }}</span>
          </div>
        </div>
      </div>

      <!-- 评价筛选 -->
      <div class="review-filters">
        <a-radio-group v-model:value="reviewFilter" button-style="solid" size="small">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="good">好评</a-radio-button>
          <a-radio-button value="medium">中评</a-radio-button>
          <a-radio-button value="bad">差评</a-radio-button>
          <a-radio-button value="withImages">有图</a-radio-button>
        </a-radio-group>
      </div>

      <!-- 评价列表 -->
      <div class="review-list">
        <div v-for="review in filteredReviews" :key="review.id" class="review-item">
          <div class="review-header">
            <img v-img-fallback :src="review.userAvatar" :alt="review.userName" class="user-avatar" />
            <div class="user-info">
              <div class="user-name">{{ review.userName }}</div>
              <a-rate :value="review.rating" disabled size="small" />
            </div>
            <div class="review-date">{{ review.date }}</div>
          </div>
          <div class="review-content">{{ review.content }}</div>
          <div v-if="review.images && review.images.length > 0" class="review-images">
            <img v-img-fallback v-for="(image, index) in review.images"
              :key="index"
              :src="image"
              :alt="`评价图片${index + 1}`"
              @click="previewImage(review.images, index)"
            />
          </div>
          <div v-if="review.reply" class="merchant-reply">
            <div class="reply-label">商家回复：</div>
            <div class="reply-content">{{ review.reply }}</div>
          </div>
        </div>
      </div>

      <div v-if="hasMoreReviews" class="load-more">
        <a-button @click="loadMoreReviews" :loading="loadingMoreReviews">
          {{ loadingMoreReviews ? '加载中...' : '加载更多评价' }}
        </a-button>
      </div>
      <div v-else class="no-more">
        <span>没有更多评价了</span>
      </div>
    </div>

    <!-- 购物车浮标 -->
    <div class="cart-float" @click="goToCart" v-if="cartStore.totalItems > 0">
      <ShoppingCartOutlined />
      <a-badge :count="cartStore.totalItems" :offset="[-5, 5]" />
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="bottom-actions">
        <div class="action-item" @click="contactService">
          <CustomerServiceOutlined />
          <span>客服</span>
        </div>
        <div class="action-item" @click="toggleFavorite">
          <HeartOutlined v-if="!isFavorite" />
          <HeartFilled v-else style="color: #ff4d4f;" />
          <span>收藏</span>
        </div>
      </div>
      <a-button type="primary" size="large" class="main-action" @click="useNow">
        立即使用
      </a-button>
    </div>
    </div>

    <!-- 分享弹窗 -->
    <ShareModal v-model:open="showShareModal" :share-data="shareData" />

    <!-- 导航弹窗 -->
    <a-modal
      v-model:open="showNavigationModal"
      title="选择导航应用"
      :footer="null"
      :width="400"
      centered
    >
      <div class="navigation-apps">
        <div class="nav-app-item" @click="navigateWithApp('amap')">
          <div class="nav-app-icon" style="background: linear-gradient(135deg, #00A0E9 0%, #00D4FF 100%);">
            <EnvironmentOutlined />
          </div>
          <span class="nav-app-name">高德地图</span>
        </div>
        <div class="nav-app-item" @click="navigateWithApp('baidu')">
          <div class="nav-app-icon" style="background: linear-gradient(135deg, #3385FF 0%, #4A9FFF 100%);">
            <EnvironmentOutlined />
          </div>
          <span class="nav-app-name">百度地图</span>
        </div>
        <div class="nav-app-item" @click="navigateWithApp('tencent')">
          <div class="nav-app-icon" style="background: linear-gradient(135deg, #00A870 0%, #00D48A 100%);">
            <EnvironmentOutlined />
          </div>
          <span class="nav-app-name">腾讯地图</span>
        </div>
        <div class="nav-app-item" @click="navigateWithApp('apple')">
          <div class="nav-app-icon" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);">
            <EnvironmentOutlined />
          </div>
          <span class="nav-app-name">Apple地图</span>
        </div>
      </div>
      <div class="navigation-info">
        <p><strong>目的地:</strong> {{ merchant.address }}</p>
        <p><strong>距离:</strong> {{ merchant.distance }}</p>
      </div>
    </a-modal>

    <!-- 客服对话 -->
    <ServiceChat v-model:open="showServiceChat" />

    <!-- 使用优惠券弹窗 -->
    <a-modal
      v-model:open="showUseModal"
      title="使用优惠券"
      :width="400"
      centered
      @ok="confirmUse"
    >
      <div v-if="selectedCouponForUse" class="use-coupon-modal">
        <div class="coupon-preview">
          <div class="coupon-amount">¥{{ selectedCouponForUse.amount }}</div>
          <div class="coupon-name">{{ selectedCouponForUse.name }}</div>
          <div class="coupon-condition">满{{ selectedCouponForUse.condition }}元可用</div>
        </div>
        <div class="use-qrcode">
          <div class="qrcode-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
              <rect width="200" height="200" fill="#f0f0f0" />
              <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-size="14">使用二维码</text>
            </svg>
          </div>
          <p class="qrcode-tip">请向商家出示此二维码进行核销</p>
        </div>
      </div>
    </a-modal>

    <!-- 图片预览 -->
    <a-modal
      v-model:open="showImagePreview"
      :footer="null"
      :width="'90%'"
      :style="{ maxWidth: '800px' }"
      centered
      @cancel="closePreview"
    >
      <div class="image-preview">
        <img v-img-fallback :src="previewImages[previewIndex]" alt="预览图片" />
        <div class="preview-controls">
          <a-button 
            v-if="previewIndex > 0" 
            class="prev-btn" 
            @click="prevImage"
            size="large"
            shape="circle"
          >
            <LeftOutlined />
          </a-button>
          <a-button 
            v-if="previewIndex < previewImages.length - 1" 
            class="next-btn" 
            @click="nextImage"
            size="large"
            shape="circle"
          >
            <RightOutlined />
          </a-button>
        </div>
        <div class="preview-counter">
          {{ previewIndex + 1 }} / {{ previewImages.length }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import PageSkeleton from '@/components/skeleton/PageSkeleton.vue'
import ShareModal from '@/components/share/ShareModal.vue'
import ServiceChat from '@/components/service/ServiceChat.vue'
import {
  LeftOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  RightOutlined,
  CustomerServiceOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const route = useRoute()

// 滚动状态
const scrolled = ref(false)

// 加载状态
const loading = ref(true)

// 收藏状态
const isFavorite = computed(() => favoritesStore.isMerchantFavorited(merchant.value.id))

// 评价筛选
const reviewFilter = ref('all')

// 评价区域引用
const reviewsSection = ref<HTMLElement>()

// 是否有更多评价
const hasMoreReviews = ref(true)

// 商家数据
const merchant = ref({
  id: 1,
  name: '老字号餐厅',
  rating: 4.8,
  reviewCount: 1256,
  distance: '1.5km',
  address: '南京市鼓楼区中山路123号',
  latitude: 32.0603,
  longitude: 118.7969,
  phone: '025-12345678',
  businessHours: '10:00-22:00',
  isOpen: true,
  tags: ['老字号', '苏帮菜', '环境优雅'],
  images: [
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Cdefs%3E%3ClinearGradient id="bg1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="250" fill="url(%23bg1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E老字号餐厅%3C/text%3E%3C/svg%3E',
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Cdefs%3E%3ClinearGradient id="bg2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="250" fill="url(%23bg2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E店内环境%3C/text%3E%3C/svg%3E',
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Cdefs%3E%3ClinearGradient id="bg3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="250" fill="url(%23bg3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E特色菜品%3C/text%3E%3C/svg%3E'
  ],
  coupons: [
    {
      id: 1,
      name: '满减优惠券',
      amount: 20,
      condition: 100,
      validity: '有效期至2025-12-31',
      received: false,
      used: false
    },
    {
      id: 2,
      name: '新人专享券',
      amount: 50,
      condition: 200,
      validity: '有效期至2025-12-31',
      received: false,
      used: false
    },
    {
      id: 3,
      name: '周末特惠券',
      amount: 30,
      condition: 150,
      validity: '有效期至2025-12-31',
      received: true,
      used: false
    }
  ],
  products: [
    {
      id: 1,
      name: '招牌狮子头',
      price: 68,
      originalPrice: 88,
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Cdefs%3E%3ClinearGradient id="p1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="150" height="150" fill="url(%23p1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E狮子头%3C/text%3E%3C/svg%3E'
    },
    {
      id: 2,
      name: '清蒸鲈鱼',
      price: 98,
      originalPrice: null,
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Cdefs%3E%3ClinearGradient id="p2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="150" height="150" fill="url(%23p2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E清蒸鲈鱼%3C/text%3E%3C/svg%3E'
    },
    {
      id: 3,
      name: '松鼠桂鱼',
      price: 128,
      originalPrice: 158,
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Cdefs%3E%3ClinearGradient id="p3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="150" height="150" fill="url(%23p3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E松鼠桂鱼%3C/text%3E%3C/svg%3E'
    },
    {
      id: 4,
      name: '蟹粉小笼包',
      price: 38,
      originalPrice: null,
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Cdefs%3E%3ClinearGradient id="p4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="150" height="150" fill="url(%23p4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E小笼包%3C/text%3E%3C/svg%3E'
    }
  ],
  ratingDistribution: {
    5: 856,
    4: 280,
    3: 80,
    2: 30,
    1: 10
  },
  reviews: [
    {
      id: 1,
      userName: '美食家小王',
      userAvatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23667eea" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E王%3C/text%3E%3C/svg%3E',
      rating: 5,
      date: '2025-10-15',
      content: '老字号就是不一样,狮子头做得非常地道,肥而不腻,入口即化。环境也很好,服务员态度热情。强烈推荐!',
      images: [],
      reply: '感谢您的好评!我们会继续努力,为您提供更好的服务!'
    },
    {
      id: 2,
      userName: '吃货小李',
      userAvatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23f093fb" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E李%3C/text%3E%3C/svg%3E',
      rating: 4,
      date: '2025-10-14',
      content: '菜品味道不错,就是上菜速度有点慢,等了半个小时。不过味道确实值得等待。',
      images: [],
      reply: null
    },
    {
      id: 3,
      userName: '南京吃货',
      userAvatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%234facfe" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E南%3C/text%3E%3C/svg%3E',
      rating: 5,
      date: '2025-10-13',
      content: '环境优雅,菜品精致,价格合理。特别喜欢他们家的松鼠桂鱼,外酥里嫩,酸甜适中。',
      images: [],
      reply: '谢谢您的支持!欢迎常来!'
    }
  ]
})

// 筛选后的评价
const filteredReviews = computed(() => {
  let filtered = merchant.value.reviews

  if (reviewFilter.value === 'good') {
    filtered = filtered.filter(r => r.rating >= 4)
  } else if (reviewFilter.value === 'medium') {
    filtered = filtered.filter(r => r.rating === 3)
  } else if (reviewFilter.value === 'bad') {
    filtered = filtered.filter(r => r.rating <= 2)
  } else if (reviewFilter.value === 'withImages') {
    filtered = filtered.filter(r => r.images && r.images.length > 0)
  }

  return filtered
})

// 监听滚动
const handleScroll = () => {
  scrolled.value = window.scrollY > 200
}

// 返回
const goBack = () => {
  router.back()
}

// 去购物车
const goToCart = () => {
  router.push('/cart')
}

// 分享商家
const showShareModal = ref(false)
const shareData = computed(() => ({
  title: merchant.value.name,
  desc: merchant.value.desc,
  image: merchant.value.images[0],
  url: window.location.href
}))

const shareMerchant = () => {
  showShareModal.value = true
}

// 切换收藏
const toggleFavorite = () => {
  const result = favoritesStore.toggleMerchant({
    id: merchant.value.id,
    name: merchant.value.name,
    image: merchant.value.images[0],
    rating: merchant.value.rating,
    address: merchant.value.address,
    distance: merchant.value.distance
  })
  
  if (result) {
    const h = message.success({
      content: '收藏成功',
      duration: 3,
      onClick: () => {
        router.push('/favorites')
        h()
      }
    })
  } else {
    message.info('取消收藏')
  }
}

// 导航到商家
const showNavigationModal = ref(false)

const navigateToMerchant = () => {
  showNavigationModal.value = true
}

const navigateWithApp = (app: string) => {
  const { address, latitude, longitude } = merchant.value
  let url = ''
  
  switch (app) {
    case 'amap': // 高德地图
      url = `https://uri.amap.com/navigation?to=${longitude},${latitude},${address}&mode=car&policy=1&src=myapp&coordinate=gaode&callnative=1`
      break
    case 'baidu': // 百度地图
      url = `https://api.map.baidu.com/direction?destination=latlng:${latitude},${longitude}|name:${address}&mode=driving&src=myapp`
      break
    case 'tencent': // 腾讯地图
      url = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${latitude},${longitude};title:${address}&referer=myapp`
      break
    case 'apple': // Apple地图
      url = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`
      break
  }
  
  window.location.href = url
  showNavigationModal.value = false
}

// 拨打电话
const callMerchant = () => {
  window.location.href = `tel:${merchant.value.phone}`
}

// 查看所有优惠券
const viewAllCoupons = () => {
  router.push('/vouchers')
}

// 领取优惠券
const receiveCoupon = (coupon: any) => {
  if (coupon.received) {
    message.info('您已领取过该优惠券')
    return
  }

  coupon.received = true
  message.success('领取成功!')
}

// 查看商品
const viewProduct = (product: any) => {
  router.push(`/product-detail/${product.id}`)
}

// 加入购物车
const showSkuModal = ref(false)
const selectedProduct = ref<any>(null)

const addToCart = (product: any) => {
  // 如果商品有多规格,显示规格选择弹窗
  if (product.skus && product.skus.length > 1) {
    selectedProduct.value = product
    showSkuModal.value = true
  } else {
    // 直接加入购物车
    addToCartDirect(product)
  }
}

const addToCartDirect = (product: any, sku?: any) => {
  cartStore.addItem({
    id: Date.now(),
    productId: product.id,
    name: product.name,
    image: product.image,
    price: sku?.price || product.price,
    points: sku?.points || product.points || 0,
    stock: sku?.stock || product.stock || 999
  })
  
  const h = message.success({
    content: `${product.name} 已加入购物车`,
    duration: 3,
    onClick: () => {
      router.push('/cart')
      h()
    }
  })
  
  showSkuModal.value = false
}

const closeSkuModal = () => {
  showSkuModal.value = false
  selectedProduct.value = null
}

// 滚动到评价区域
const scrollToReviews = () => {
  reviewsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 加载更多评价
const loadingMoreReviews = ref(false)

const loadMoreReviews = () => {
  if (loadingMoreReviews.value) return
  
  loadingMoreReviews.value = true
  
  // 模拟加载
  setTimeout(() => {
    const newReviews = [
      {
        id: merchant.value.reviews.length + 1,
        userName: `用户${merchant.value.reviews.length + 1}`,
        avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3C/svg%3E`,
        rating: Math.floor(Math.random() * 2) + 4,
        date: '2025-10-15',
        content: '商家服务很好，环境也不错，下次还会来。',
        images: []
      },
      {
        id: merchant.value.reviews.length + 2,
        userName: `用户${merchant.value.reviews.length + 2}`,
        avatar: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23${Math.floor(Math.random()*16777215).toString(16)}'/%3E%3C/svg%3E`,
        rating: Math.floor(Math.random() * 2) + 4,
        date: '2025-10-14',
        content: '价格实惠，菜品丰富，强烈推荐！',
        images: []
      }
    ]
    
    merchant.value.reviews.push(...newReviews)
    loadingMoreReviews.value = false
    
    // 如果加载了10条以上，设置没有更多了
    if (merchant.value.reviews.length >= 10) {
      hasMoreReviews.value = false
      message.info('已加载全部评价')
    } else {
      message.success(`已加载${newReviews.length}条评价`)
    }
  }, 1000)
}

// 预览图片
const showImagePreview = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

const previewImage = (images: string[], index: number) => {
  previewImages.value = images
  previewIndex.value = index
  showImagePreview.value = true
}

const closePreview = () => {
  showImagePreview.value = false
}

const prevImage = () => {
  if (previewIndex.value > 0) {
    previewIndex.value--
  }
}

const nextImage = () => {
  if (previewIndex.value < previewImages.value.length - 1) {
    previewIndex.value++
  }
}

// 联系客服
const showServiceChat = ref(false)

const contactService = () => {
  showServiceChat.value = true
}

// 立即使用
const showUseModal = ref(false)
const selectedCouponForUse = ref<any>(null)

const useNow = () => {
  // 检查是否有可用的优惠券
  const availableCoupon = merchant.value.coupons.find(c => c.received && !c.used)
  if (availableCoupon) {
    selectedCouponForUse.value = availableCoupon
    showUseModal.value = true
  } else {
    message.warning('您还没有可用的优惠券，请先领取优惠券')
    // 滚动到优惠券区域
    document.querySelector('.coupons-section')?.scrollIntoView({ behavior: 'smooth' })
  }
}

const confirmUse = () => {
  if (selectedCouponForUse.value) {
    selectedCouponForUse.value.used = true
    message.success('优惠券使用成功！请向商家出示使用记录')
    showUseModal.value = false
  }
}

// 跳转到买单页面
const goToPayment = () => {
  router.push({
    name: 'MerchantPayment',
    params: { merchantId: merchant.value.id }
  })
}

onMounted(async () => {
  // 模拟数据加载
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
  
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.merchant-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 70px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: transparent;
  color: white;
  transition: all 0.3s;

  &.header-solid {
    background: white;
    color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .back-icon {
    font-size: 20px;
    cursor: pointer;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
  }

  .header-actions {
    display: flex;
    gap: 16px;
    font-size: 20px;

    .anticon {
      cursor: pointer;
    }
  }
}

.banner-carousel {
  position: relative;
  height: 250px;

  .carousel-item {
    height: 250px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .banner-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    color: white;

    .merchant-name {
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 8px 0;
    }

    .merchant-tags {
      margin-bottom: 8px;
    }

    .merchant-distance {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }
  }
}

.merchant-info-card {
  background: white;
  margin: 12px;
  border-radius: 8px;
  padding: 16px;

  .rating-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 16px;

    .rating-score {
      display: flex;
      align-items: center;
      gap: 8px;

      .score {
        font-size: 32px;
        font-weight: bold;
        color: #faad14;
      }
    }

    .rating-count {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;

    .icon {
      color: #1890ff;
      font-size: 16px;
    }

    .text {
      flex: 1;
      color: #666;
    }
  }
}

.coupon-section,
.product-section,
.reviews-section {
  background: white;
  margin: 12px;
  border-radius: 8px;
  padding: 16px;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: bold;
    }

    .section-more {
      color: #666;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .coupon-card {
    display: flex;
    border: 1px solid #ff4d4f;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
    }

    &.coupon-received {
      border-color: #d9d9d9;
      opacity: 0.6;
    }

    .coupon-left {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff4d4f 100%);
      color: white;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 100px;

      .coupon-amount {
        .symbol {
          font-size: 16px;
        }

        .value {
          font-size: 32px;
          font-weight: bold;
        }
      }

      .coupon-condition {
        font-size: 12px;
        margin-top: 4px;
      }
    }

    .coupon-right {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .coupon-name {
        font-size: 16px;
        font-weight: bold;
      }

      .coupon-validity {
        font-size: 12px;
        color: #999;
        margin-top: 4px;
      }

      .coupon-action {
        text-align: right;
        color: #ff4d4f;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}

// 惠买单区域样式
.payment-section {
  margin-bottom: 16px;

  .section-header {
    margin-bottom: 12px;

    .payment-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      .badge-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #00c853 0%, #00b248 100%);
        color: #fff;
        font-size: 12px;
        font-weight: bold;
        border-radius: 4px;
      }

      .badge-text {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }
  }

  .payment-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%);
    border: 1px solid #ffd699;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
    }

    .payment-info {
      flex: 1;

      .payment-offer {
        font-size: 16px;
        font-weight: 600;
        color: #ff6b35;
        margin-bottom: 4px;
      }

      .payment-time {
        font-size: 12px;
        color: #999;
      }
    }

    .payment-btn {
      background: #00c853;
      border-color: #00c853;
      color: #fff;
      font-weight: 500;
      padding: 8px 24px;
      height: auto;
      border-radius: 20px;

      &:hover {
        background: #00b248;
        border-color: #00b248;
      }
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .product-card {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .product-info {
      padding: 12px;

      .product-name {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-price {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .current-price {
          font-size: 18px;
          font-weight: bold;
          color: #ff4d4f;
        }

        .original-price {
          font-size: 12px;
          color: #999;
          text-decoration: line-through;
        }
      }
    }
  }
}

.rating-stats {
  display: flex;
  gap: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;

  .rating-overview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 100px;

    .overall-score {
      font-size: 48px;
      font-weight: bold;
      color: #faad14;
    }

    .total-reviews {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }
  }

  .rating-bars {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .rating-bar {
      display: flex;
      align-items: center;
      gap: 8px;

      .star-label {
        min-width: 40px;
        font-size: 12px;
        color: #666;
      }

      .count {
        min-width: 40px;
        text-align: right;
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.review-filters {
  margin-bottom: 16px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .review-item {
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;

    .review-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      .user-info {
        flex: 1;

        .user-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
      }

      .review-date {
        font-size: 12px;
        color: #999;
      }
    }

    .review-content {
      line-height: 1.6;
      color: #333;
      margin-bottom: 12px;
    }

    .review-images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 12px;

      img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
      }
    }

    .merchant-reply {
      background: white;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #1890ff;

      .reply-label {
        font-size: 12px;
        color: #1890ff;
        font-weight: bold;
        margin-bottom: 4px;
      }

      .reply-content {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

.load-more {
  text-align: center;
  margin-top: 16px;
}

.cart-float {
  position: fixed;
  right: 16px;
  bottom: 100px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(255, 71, 87, 0.4);
  cursor: pointer;
  z-index: 99;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 71, 87, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  :deep(.anticon) {
    font-size: 24px;
    color: white;
  }

  :deep(.ant-badge) {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;

  .bottom-actions {
    display: flex;
    gap: 20px;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      font-size: 12px;
      color: #666;

      .anticon {
        font-size: 20px;
      }

      &:hover {
        color: #1890ff;
      }
    }
  }

  .main-action {
    flex: 1;
    height: 44px;
    font-size: 16px;
    font-weight: bold;
  }
}

:deep(.custom-dots) {
  bottom: 10px;

  li button {
    background: rgba(255, 255, 255, 0.5);
  }

  li.slick-active button {
    background: white;
  }
}
.navigation-apps {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  .nav-app-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    &:active {
      transform: translateY(0);
    }

    .nav-app-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-app-name {
      font-size: 14px;
      color: #333;
    }
  }
}

.navigation-info {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  p {
    margin: 8px 0;
    font-size: 14px;
    color: #666;

    strong {
      color: #333;
    }
  }
}

.image-preview {
  position: relative;
  width: 100%;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .preview-controls {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    pointer-events: none;
    
    .prev-btn,
    .next-btn {
      pointer-events: auto;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      
      &:hover {
        background: rgba(0, 0, 0, 0.7);
        color: white;
      }
    }
  }
  
  .preview-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
  }
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

.use-coupon-modal {
  .coupon-preview {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
    border-radius: 8px;
    color: white;
    margin-bottom: 20px;

    .coupon-amount {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .coupon-name {
      font-size: 18px;
      margin-bottom: 4px;
    }

    .coupon-condition {
      font-size: 14px;
      opacity: 0.9;
    }
  }

  .use-qrcode {
    text-align: center;

    .qrcode-placeholder {
      display: inline-block;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .qrcode-tip {
      margin-top: 12px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>

