<template>
  <div class="merchant-offer-detail">
    <!-- 顶部导航栏 -->
    <div class="nav-bar" :class="{ scrolled: isScrolled }">
      <div class="nav-left" @click="goBack">
        <LeftOutlined />
      </div>
      <div class="nav-title">{{ isScrolled ? merchantData.name : '' }}</div>
      <div class="nav-right">
        <ShareAltOutlined class="nav-icon" @click="handleShare" />
        <HeartOutlined 
          class="nav-icon" 
          :class="{ active: isFavorited }" 
          @click="toggleFavorite" 
        />
      </div>
    </div>

    <!-- 商家头图轮播 -->
    <div class="merchant-banner">
      <a-carousel autoplay :dots="true" effect="fade">
        <div v-for="(image, index) in merchantData.images" :key="index" class="banner-slide">
          <img v-img-fallback :src="image" :alt="`商家图片${index + 1}`" />
        </div>
      </a-carousel>
      <div class="banner-overlay">
        <div class="merchant-name">{{ merchantData.name }}</div>
        <div class="merchant-meta">
          <span class="merchant-type">{{ merchantData.type }}</span>
          <span class="merchant-distance">
            <EnvironmentOutlined />
            距您 {{ merchantData.distance }}
          </span>
        </div>
      </div>
    </div>

    <!-- 优惠信息卡片 -->
    <div class="offer-card">
      <div class="offer-badge">
        <FireOutlined class="badge-icon" />
        <span class="badge-text">限时优惠</span>
      </div>
      
      <div class="offer-content">
        <div class="offer-main">
          <div class="discount-tag">{{ merchantData.offer.displayValue }}</div>
          <div class="offer-list">
            <div 
              v-for="(item, index) in merchantData.offer.items" 
              :key="index"
              class="offer-item"
              :class="{ 'new-user': item.isNewUser }"
            >
              <CheckCircleFilled v-if="item.isNewUser" class="item-icon" />
              {{ item.text }}
            </div>
          </div>
        </div>
        
        <div class="offer-countdown">
          <ClockCircleOutlined />
          距结束还有 <span class="countdown-text">{{ countdown }}</span>
        </div>
        
        <div class="offer-actions">
          <a-button type="primary" size="large" @click="useOffer">
            立即使用
          </a-button>
          <a-button size="large" @click="showCouponList">
            领取优惠券
          </a-button>
        </div>
      </div>
    </div>

    <!-- 商家基本信息 -->
    <div class="merchant-info">
      <div class="info-item" @click="showMap">
        <EnvironmentOutlined class="info-icon" style="color: #52c41a;" />
        <div class="info-content">
          <div class="info-label">地址</div>
          <div class="info-value">{{ merchantData.address }}</div>
        </div>
        <div class="info-actions">
          <a-button size="small" @click.stop="viewMap">查看地图</a-button>
          <a-button size="small" type="primary" @click.stop="navigate">一键导航</a-button>
        </div>
      </div>

      <div class="info-item" @click="callPhone">
        <PhoneOutlined class="info-icon" style="color: #1890ff;" />
        <div class="info-content">
          <div class="info-label">电话</div>
          <div class="info-value">{{ merchantData.phone }}</div>
        </div>
        <a-button size="small" @click.stop="callPhone">拨打电话</a-button>
      </div>

      <div class="info-item">
        <ClockCircleOutlined class="info-icon" style="color: #fa8c16;" />
        <div class="info-content">
          <div class="info-label">营业时间</div>
          <div class="info-value">{{ merchantData.businessHours }}</div>
        </div>
        <span class="business-status" :class="{ open: isBusinessOpen }">
          {{ isBusinessOpen ? '营业中' : '已打烊' }}
        </span>
      </div>

      <div class="info-item" @click="scrollToReviews">
        <StarOutlined class="info-icon" style="color: #faad14;" />
        <div class="info-content">
          <div class="info-label">评分</div>
          <div class="info-value">
            {{ merchantData.rating }}分 ({{ merchantData.reviewCount }}条评价)
          </div>
        </div>
        <RightOutlined class="info-arrow" />
      </div>

      <div class="info-item">
        <WalletOutlined class="info-icon" style="color: #ff4d4f;" />
        <div class="info-content">
          <div class="info-label">人均消费</div>
          <div class="info-value">¥{{ merchantData.avgPrice }}</div>
        </div>
      </div>
    </div>

    <!-- 优惠券列表 -->
    <div class="coupon-section">
      <div class="section-header">
        <div class="section-title">优惠券</div>
        <div class="section-more" @click="showAllCoupons">
          查看全部 <RightOutlined />
        </div>
      </div>
      <div class="coupon-scroll">
        <div 
          v-for="coupon in merchantData.coupons" 
          :key="coupon.id"
          class="coupon-card"
          :class="{ claimed: coupon.claimed, soldout: coupon.soldout }"
        >
          <div class="coupon-left">
            <div class="coupon-amount">¥{{ coupon.amount }}</div>
            <div class="coupon-condition">满{{ coupon.minAmount }}可用</div>
          </div>
          <div class="coupon-right">
            <div class="coupon-name">{{ coupon.name }}</div>
            <div class="coupon-expire">有效期至 {{ coupon.expireDate }}</div>
            <a-button 
              size="small" 
              type="primary"
              :disabled="coupon.claimed || coupon.soldout"
              @click="claimCoupon(coupon)"
              class="coupon-btn"
            >
              {{ coupon.claimed ? '已领取' : coupon.soldout ? '已抢光' : '立即领取' }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 商家详情 -->
    <div class="merchant-detail">
      <div class="section-header">
        <div class="section-title">商家详情</div>
      </div>
      <div class="detail-content">
        <div class="detail-section">
          <div class="detail-subtitle">商家简介</div>
          <div class="detail-text">{{ merchantData.description }}</div>
        </div>
        
        <div class="detail-section">
          <div class="detail-subtitle">环境展示</div>
          <div class="detail-images">
            <img v-img-fallback v-for="(img, index) in merchantData.detailImages" 
              :key="index"
              :src="img" 
              :alt="`环境图${index + 1}`"
              @click="previewImage(index)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 用户评价 -->
    <div class="review-section" ref="reviewSection">
      <div class="section-header">
        <div class="section-title">用户评价</div>
        <div class="section-more" @click="showAllReviews">
          查看全部 <RightOutlined />
        </div>
      </div>

      <!-- 评分统计 -->
      <div class="rating-summary">
        <div class="rating-score">
          <div class="score-number">{{ merchantData.rating }}</div>
          <div class="score-stars">
            <a-rate :value="merchantData.rating" disabled allow-half />
          </div>
          <div class="score-count">共{{ merchantData.reviewCount }}条评价</div>
        </div>
        <div class="rating-distribution">
          <div 
            v-for="(item, index) in ratingDistribution" 
            :key="index"
            class="distribution-item"
          >
            <span class="distribution-label">{{ 5 - index }}星</span>
            <div class="distribution-bar">
              <div 
                class="distribution-fill" 
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
            <span class="distribution-percentage">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>

      <!-- 评价筛选 -->
      <div class="review-filter">
        <a-radio-group v-model:value="reviewFilter" button-style="solid" size="small">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="good">好评</a-radio-button>
          <a-radio-button value="medium">中评</a-radio-button>
          <a-radio-button value="bad">差评</a-radio-button>
          <a-radio-button value="image">有图</a-radio-button>
        </a-radio-group>
      </div>

      <!-- 评价列表 -->
      <div class="review-list">
        <div 
          v-for="review in filteredReviews" 
          :key="review.id"
          class="review-card"
        >
          <div class="review-header">
            <img v-img-fallback :src="review.avatar" alt="用户头像" class="review-avatar" />
            <div class="review-user">
              <div class="user-name">{{ review.username }}</div>
              <div class="review-meta">
                <a-rate :value="review.rating" disabled size="small" />
                <span class="review-time">{{ review.time }}</span>
              </div>
            </div>
          </div>
          <div class="review-content">{{ review.content }}</div>
          <div v-if="review.images && review.images.length" class="review-images">
            <img v-img-fallback v-for="(img, index) in review.images" 
              :key="index"
              :src="img" 
              :alt="`评价图${index + 1}`"
              @click="previewReviewImage(review.images, index)"
            />
          </div>
          <div class="review-actions">
            <span class="action-item" @click="likeReview(review)">
              <LikeOutlined :class="{ active: review.liked }" />
              有用({{ review.likes }})
            </span>
            <span class="action-item" @click="replyReview(review)">
              <MessageOutlined />
              回复
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐商品/套餐 -->
    <div class="recommend-section">
      <div class="section-header">
        <div class="section-title">推荐商品</div>
        <div class="section-more" @click="showAllProducts">
          查看全部 <RightOutlined />
        </div>
      </div>
      <div class="product-scroll">
        <div 
          v-for="product in merchantData.recommendProducts" 
          :key="product.id"
          class="product-card"
          @click="viewProduct(product)"
        >
          <img v-img-fallback :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">¥{{ product.price }}</div>
          <div class="product-sales">已售{{ product.sales }}份</div>
        </div>
      </div>
    </div>

    <!-- 相似商家推荐 -->
    <div class="similar-section">
      <div class="section-header">
        <div class="section-title">相似商家</div>
      </div>
      <div class="similar-grid">
        <div 
          v-for="merchant in merchantData.similarMerchants" 
          :key="merchant.id"
          class="similar-card"
          @click="viewMerchant(merchant)"
        >
          <img v-img-fallback :src="merchant.image" :alt="merchant.name" class="similar-image" />
          <div class="similar-info">
            <div class="similar-name">{{ merchant.name }}</div>
            <div class="similar-meta">
              <span class="similar-rating">
                <StarFilled />
                {{ merchant.rating }}
              </span>
              <span class="similar-distance">{{ merchant.distance }}</span>
            </div>
            <div class="similar-price">人均¥{{ merchant.avgPrice }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="bar-left">
        <div class="bar-item" @click="contactService">
          <CustomerServiceOutlined />
          <span>客服</span>
        </div>
        <div class="bar-item" @click="toggleFavorite">
          <HeartOutlined :class="{ active: isFavorited }" />
          <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
        </div>
      </div>
      <div class="bar-right">
        <a-button type="primary" size="large" block @click="useOffer">
          {{ mainActionText }}
        </a-button>
      </div>
    </div>

    <!-- 优惠券飞入动画元素 -->
    <div v-if="showCouponFly" class="coupon-fly" :style="couponFlyStyle">
      <GiftOutlined />
    </div>

    <!-- 核销弹窗 -->
    <a-modal
      v-model:open="verificationVisible"
      :title="null"
      :footer="null"
      :closable="false"
      :width="'90%'"
      :bodyStyle="{ padding: 0 }"
      :maskClosable="verificationStatus !== 'showing'"
    >
      <div class="verification-modal">
        <!-- 顶部导航栏 -->
        <div class="verification-header">
          <CloseOutlined class="close-btn" @click="closeVerification" />
          <div class="header-title">核销优惠</div>
          <QuestionCircleOutlined class="help-btn" @click="() => message.info('使用说明：请在商家处出示此码，由商家扫码核销')" />
        </div>

        <!-- 核销中状态 -->
        <div v-if="verificationStatus === 'showing'" class="verification-content">
          <!-- 商家信息 -->
          <div class="merchant-info">
            <div class="merchant-logo">
              <img v-img-fallback :src="merchantData.images[0]" alt="商家Logo" />
            </div>
            <div class="merchant-name">{{ merchantData.name }}</div>
            <div class="merchant-address">{{ merchantData.address }}</div>
          </div>

          <!-- 二维码区域 -->
          <div class="qrcode-container">
            <img v-img-fallback v-if="qrCodeUrl" :src="qrCodeUrl" alt="核销二维码" class="qrcode-image" />
            <a-spin v-else size="large" />
          </div>

          <!-- 核销码 -->
          <div class="verification-code">
            <span class="code-label">核销码：</span>
            <span class="code-value">{{ verificationCode }}</span>
            <CopyOutlined class="copy-icon" @click="copyVerificationCode" />
          </div>

          <!-- 优惠详情 -->
          <div class="offer-details">
            <div class="detail-item">
              <span class="detail-label">优惠内容：</span>
              <span class="detail-value">全场8折</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">优惠金额：</span>
              <span class="detail-value">最高减50元</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">有效期：</span>
              <span class="detail-value">{{ merchantData.offer.endTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">使用次数：</span>
              <span class="detail-value">1/1</span>
            </div>
          </div>

          <!-- 使用说明 -->
          <div class="usage-tips">
            <div class="tips-title">使用说明：</div>
            <div class="tips-list">
              <div class="tip-item">1. 请在商家处出示此码</div>
              <div class="tip-item">2. 由商家扫码核销</div>
              <div class="tip-item">3. 核销成功后获得积分</div>
            </div>
          </div>

          <!-- 模拟核销按钮（仅用于demo演示） -->
          <div class="demo-actions">
            <a-button type="primary" @click="simulateVerification">
              模拟核销成功（Demo）
            </a-button>
          </div>
        </div>

        <!-- 核销成功状态 -->
        <div v-if="verificationStatus === 'success'" class="verification-success">
          <div class="success-icon">
            <CheckCircleFilled style="font-size: 80px; color: #52c41a;" />
          </div>
          <div class="success-title">核销成功！</div>
          <div class="success-amount">已为您节省 ¥{{ savedAmount }}</div>
          <div class="success-points">
            <GiftOutlined /> +{{ earnedPoints }} 积分
          </div>
          <div class="success-info">
            <div class="info-item">
              <span class="info-label">核销时间：</span>
              <span class="info-value">{{ new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">核销门店：</span>
              <span class="info-value">新街口店</span>
            </div>
          </div>
          <div class="success-actions">
            <a-button @click="closeVerification">继续逛逛</a-button>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 优惠券列表弹窗 -->
    <a-modal
      v-model:open="couponListVisible"
      title="领取优惠券"
      :footer="null"
      :width="'90%'"
    >
      <div class="coupon-list-modal">
        <div class="coupon-list">
          <div
            v-for="coupon in merchantData.coupons"
            :key="coupon.id"
            class="coupon-item"
            :class="{ claimed: coupon.claimed }"
          >
            <div class="coupon-left">
              <div class="coupon-amount">
                <span class="amount-symbol">¥</span>
                <span class="amount-value">{{ coupon.amount }}</span>
              </div>
              <div class="coupon-condition">{{ coupon.condition }}</div>
            </div>
            <div class="coupon-right">
              <div class="coupon-name">{{ coupon.name }}</div>
              <div class="coupon-validity">有效期至 {{ coupon.validUntil }}</div>
              <a-button
                v-if="!coupon.claimed"
                type="primary"
                size="small"
                @click="claimCoupon(coupon)"
              >
                立即领取
              </a-button>
              <a-button v-else size="small" disabled>
                已领取
              </a-button>
            </div>
          </div>
        </div>
        <div class="coupon-tips">
          <div class="tips-title">温馨提示</div>
          <div class="tips-content">
            <div>1. 每张优惠券限领一次</div>
            <div>2. 优惠券领取后请在有效期内使用</div>
            <div>3. 优惠券不可叠加使用</div>
            <div>4. 优惠券使用规则以商家规定为准</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  ShareAltOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  StarOutlined,
  WalletOutlined,
  RightOutlined,
  FireOutlined,
  CheckCircleFilled,
  CustomerServiceOutlined,
  GiftOutlined,
  LikeOutlined,
  MessageOutlined,
  StarFilled,
  CloseOutlined,
  QuestionCircleOutlined,
  CopyOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 页面滚动状态
const isScrolled = ref(false)
const reviewSection = ref<HTMLElement | null>(null)

// 收藏状态
const isFavorited = ref(false)

// 评价筛选
const reviewFilter = ref('all')

// 优惠券飞入动画
const showCouponFly = ref(false)
const couponFlyStyle = ref({})

// 倒计时
const countdown = ref('2天3小时15分')

// 营业状态
const isBusinessOpen = computed(() => {
  // 这里应该根据当前时间和营业时间判断
  return true
})

// 主按钮文字
const mainActionText = computed(() => {
  return '立即使用'
})

// 模拟商家数据
const merchantData = ref({
  id: 1,
  name: '海底捞火锅(新街口店)',
  type: '火锅',
  distance: '1.2km',
  images: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
  ],
  offer: {
    type: 'discount',
    displayValue: '8折',
    items: [
      { text: '全场8折', isNewUser: false },
      { text: '满100减20', isNewUser: false },
      { text: '新用户立减30', isNewUser: true }
    ],
    endTime: '2024-12-31 23:59:59'
  },
  address: '南京市鼓楼区中山路123号新街口国际广场3楼',
  phone: '025-12345678',
  businessHours: '10:00 - 22:00',
  rating: 4.8,
  reviewCount: 1258,
  avgPrice: 120,
  description: '海底捞火锅成立于1994年，是一家以经营川味火锅为主、融汇各地火锅特色为一体的大型跨省直营餐饮品牌火锅店。秉承"服务至上、顾客至上"的理念，以创新为核心，将传统的火锅美食与现代化的服务理念相结合，为顾客提供优质的就餐体验。',
  detailImages: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400'
  ],
  coupons: [
    { id: 1, name: '满减券', amount: 20, minAmount: 100, expireDate: '12/31', claimed: false, soldout: false },
    { id: 2, name: '折扣券', amount: 30, minAmount: 150, expireDate: '12/31', claimed: false, soldout: false },
    { id: 3, name: '新用户券', amount: 50, minAmount: 200, expireDate: '12/31', claimed: true, soldout: false },
    { id: 4, name: '通用券', amount: 10, minAmount: 50, expireDate: '12/31', claimed: false, soldout: true }
  ],
  reviews: [
    {
      id: 1,
      username: '张**',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      time: '2024-10-10',
      content: '环境很好，服务态度也不错，菜品新鲜，性价比高，下次还会再来！',
      images: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200'
      ],
      likes: 23,
      liked: false
    },
    {
      id: 2,
      username: '李**',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4,
      time: '2024-10-08',
      content: '味道不错，就是人太多了，等位时间有点长。',
      images: [],
      likes: 15,
      liked: false
    },
    {
      id: 3,
      username: '王**',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      time: '2024-10-05',
      content: '服务真的太好了！小哥哥小姐姐都很热情，菜品也很新鲜，强烈推荐！',
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'
      ],
      likes: 45,
      liked: false
    }
  ],
  recommendProducts: [
    { id: 1, name: '招牌火锅套餐', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="p1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23p1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-family="Arial"%3E火锅套餐%3C/text%3E%3C/svg%3E', price: 168, sales: 1234 },
    { id: 2, name: '精品牛肉拼盘', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="p2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23p2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-family="Arial"%3E牛肉拼盘%3C/text%3E%3C/svg%3E', price: 88, sales: 856 },
    { id: 3, name: '海鲜拼盘', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="p3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23p3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-family="Arial"%3E海鲜拼盘%3C/text%3E%3C/svg%3E', price: 128, sales: 623 }
  ],
  similarMerchants: [
    { id: 2, name: '小龙坎火锅', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="m1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23m1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-family="Arial"%3E小龙坎火锅%3C/text%3E%3C/svg%3E', rating: 4.7, distance: '1.5km', avgPrice: 90 },
    { id: 3, name: '呷哺呷哺', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="m2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231890FF;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23m2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-family="Arial"%3E呷哺呷哺%3C/text%3E%3C/svg%3E', rating: 4.5, distance: '800m', avgPrice: 60 }
  ]
})

// 评分分布
const ratingDistribution = ref([
  { stars: 5, percentage: 80 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 3 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 }
])

// 筛选后的评价
const filteredReviews = computed(() => {
  let reviews = merchantData.value.reviews
  
  if (reviewFilter.value === 'good') {
    reviews = reviews.filter(r => r.rating >= 4)
  } else if (reviewFilter.value === 'medium') {
    reviews = reviews.filter(r => r.rating === 3)
  } else if (reviewFilter.value === 'bad') {
    reviews = reviews.filter(r => r.rating <= 2)
  } else if (reviewFilter.value === 'image') {
    reviews = reviews.filter(r => r.images && r.images.length > 0)
  }
  
  return reviews
})

// 监听滚动
const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

// 返回
const goBack = () => {
  router.back()
}

// 分享
const handleShare = () => {
  message.success('分享功能开发中...')
}

// 收藏/取消收藏
const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  message.success(isFavorited.value ? '收藏成功' : '已取消收藏')
}

// 查看地图
const viewMap = () => {
  message.info('查看地图功能开发中...')
}

// 导航
const navigate = () => {
  message.info('导航功能开发中...')
}

// 拨打电话
const callPhone = () => {
  window.location.href = `tel:${merchantData.value.phone}`
}

// 显示地图
const showMap = () => {
  message.info('查看地图功能开发中...')
}

// 滚动到评价区域
const scrollToReviews = () => {
  reviewSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 显示优惠券列表
const showCouponList = () => {
  couponListVisible.value = true
}

// 领取优惠券
const claimCoupon = (coupon: any) => {
  if (coupon.claimed) {
    message.warning('您已领取过该优惠券')
    return
  }
  if (coupon.soldout) {
    message.warning('该优惠券已抢光')
    return
  }
  
  // 触发飞入动画
  showCouponFly.value = true
  couponFlyStyle.value = {
    animation: 'couponFlyToTop 1s ease-out forwards'
  }
  
  setTimeout(() => {
    showCouponFly.value = false
    coupon.claimed = true
    message.success('领取成功！')
  }, 1000)
}

// 查看所有优惠券
const showAllCoupons = () => {
  router.push({
    path: '/merchant-coupon-list',
    query: {
      merchantId: merchantData.value.id,
      merchantName: merchantData.value.name
    }
  })
}

// 查看所有评价
const showAllReviews = () => {
  message.info('查看全部评价功能开发中...')
}

// 预览图片
const previewImage = (index: number) => {
  message.info('图片预览功能开发中...')
}

// 预览评价图片
const previewReviewImage = (images: string[], index: number) => {
  message.info('图片预览功能开发中...')
}

// 点赞评价
const likeReview = (review: any) => {
  review.liked = !review.liked
  review.likes += review.liked ? 1 : -1
}

// 回复评价
const replyReview = (review: any) => {
  message.info('回复功能开发中...')
}

// 查看商品
const viewProduct = (product: any) => {
  router.push(`/product-detail?id=${product.id}`)
}

// 查看全部商品
const showAllProducts = () => {
  message.info('查看全部商品功能开发中...')
}

// 查看商家
const viewMerchant = (merchant: any) => {
  router.push(`/merchant-offer-detail?id=${merchant.id}`)
}

// 联系客服
const contactService = () => {
  message.info('客服功能开发中...')
}

// 核销弹窗状态
const verificationVisible = ref(false)
const couponListVisible = ref(false)
const qrCodeUrl = ref('')
const verificationCode = ref('')
const verificationStatus = ref('idle') // idle, showing, success
const savedAmount = ref(0)
const earnedPoints = ref(0)

// 生成核销码
const generateVerificationCode = () => {
  const merchantCode = 'HD' // 海底捞
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const serial = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `${merchantCode}${date}${serial}`
}

// 生成二维码
const generateQRCode = async () => {
  const QRCode = (await import('qrcode')).default
  
  const qrData = {
    type: 'merchant_offer',
    offerId: merchantData.value.id,
    merchantId: merchantData.value.id,
    userId: '10001',
    offerType: merchantData.value.offer.type,
    offerValue: merchantData.value.offer.displayValue,
    verificationCode: verificationCode.value,
    timestamp: Date.now()
  }
  
  try {
    const url = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 280,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    qrCodeUrl.value = url
  } catch (error) {
    message.error('二维码生成失败')
  }
}

// 使用优惠
const useOffer = async () => {
  // 生成核销码
  verificationCode.value = generateVerificationCode()
  
  // 生成二维码
  await generateQRCode()
  
  // 显示核销弹窗
  verificationVisible.value = true
  verificationStatus.value = 'showing'
}

// 模拟核销成功
const simulateVerification = () => {
  setTimeout(() => {
    verificationStatus.value = 'success'
    savedAmount.value = 36
    earnedPoints.value = 50
    message.success('核销成功！')
  }, 3000)
}

// 关闭核销弹窗
const closeVerification = () => {
  verificationVisible.value = false
  verificationStatus.value = 'idle'
  qrCodeUrl.value = ''
  verificationCode.value = ''
}

// 复制核销码
const copyVerificationCode = async () => {
  try {
    await navigator.clipboard.writeText(verificationCode.value)
    message.success('核销码已复制')
  } catch (error) {
    const input = document.createElement('input')
    input.value = verificationCode.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    message.success('核销码已复制')
  }
}

// 主操作
const handleMainAction = () => {
  message.success('立即使用优惠！')
}

// 初始化
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // 模拟倒计时更新
  setInterval(() => {
    // 这里应该实现真实的倒计时逻辑
  }, 1000)
})

// 清理
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.merchant-offer-detail {
  min-height: 100vh;
  background: var(--color-bg-light);
  padding-bottom: 70px;
}

/* 顶部导航栏 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  z-index: 1000;
  transition: all var(--transition-normal);
  background: transparent;
  color: white;
}

.nav-bar.scrolled {
  background: white;
  color: var(--color-text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-left {
  font-size: 20px;
  cursor: pointer;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.nav-bar.scrolled .nav-title {
  opacity: 1;
}

.nav-icon {
  font-size: 20px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.nav-icon:active {
  transform: scale(0.9);
}

.nav-icon.active {
  color: var(--color-danger);
}

/* 商家头图轮播 */
.merchant-banner {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.banner-slide {
  height: 250px;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.merchant-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 8px;
}

.merchant-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: var(--font-size-sm);
}

.merchant-type {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-sm);
}

.merchant-distance {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 优惠信息卡片 */
.offer-card {
  background: white;
  margin: -20px 15px 12px;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  z-index: 10;
}

.offer-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF4444 100%);
  color: white;
  font-weight: var(--font-weight-semibold);
}

.badge-icon {
  font-size: 16px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.offer-content {
  padding: 15px;
}

.offer-main {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.discount-tag {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: var(--radius-lg);
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: white;
  box-shadow: 0 4px 8px rgba(255, 165, 0, 0.3);
}

.offer-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.offer-item {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 5px;
}

.offer-item.new-user {
  color: var(--color-danger);
  font-weight: var(--font-weight-medium);
}

.item-icon {
  font-size: 14px;
}

.offer-countdown {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  background: var(--color-bg-light);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 15px;
}

.countdown-text {
  color: var(--color-danger);
  font-weight: var(--font-weight-semibold);
}

.offer-actions {
  display: flex;
  gap: 10px;
}

.offer-actions .ant-btn {
  flex: 1;
}

/* 商家基本信息 */
.merchant-info {
  background: white;
  margin-bottom: 12px;
  padding: 0 15px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item:active {
  background: var(--color-bg-light);
}

.info-icon {
  font-size: 20px;
  margin-right: 12px;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.info-value {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.info-actions {
  display: flex;
  gap: 8px;
}

.info-arrow {
  font-size: 12px;
  color: var(--color-text-placeholder);
}

.business-status {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  background: var(--color-bg-light);
  color: var(--color-text-secondary);
}

.business-status.open {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

/* 优惠券列表 */
.coupon-section {
  background: white;
  margin-bottom: 12px;
  padding: 15px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.section-more {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.coupon-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.coupon-scroll::-webkit-scrollbar {
  height: 4px;
}

.coupon-card {
  flex-shrink: 0;
  width: 280px;
  display: flex;
  background: linear-gradient(135deg, #FF6B35 0%, #FF4444 100%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
}

.coupon-card::before {
  content: '';
  position: absolute;
  left: 90px;
  top: -5px;
  bottom: -5px;
  width: 10px;
  background: radial-gradient(circle, transparent 50%, white 50%);
  background-size: 10px 10px;
  background-position: 0 0;
}

.coupon-card.claimed,
.coupon-card.soldout {
  background: linear-gradient(135deg, #ccc 0%, #999 100%);
}

.coupon-left {
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 15px 10px;
}

.coupon-amount {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-number);
}

.coupon-condition {
  font-size: var(--font-size-xs);
  margin-top: 5px;
}

.coupon-right {
  flex: 1;
  padding: 15px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: 5px;
}

.coupon-expire {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.coupon-btn {
  align-self: flex-start;
}

/* 商家详情 */
.merchant-detail {
  background: white;
  margin-bottom: 12px;
  padding: 15px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-subtitle {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.detail-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.detail-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.detail-images img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.detail-images img:active {
  transform: scale(0.95);
}

/* 用户评价 */
.review-section {
  background: white;
  margin-bottom: 12px;
  padding: 15px;
}

.rating-summary {
  display: flex;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 15px;
}

.rating-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.score-number {
  font-size: 36px;
  font-weight: var(--font-weight-bold);
  color: var(--color-warning);
  font-family: var(--font-family-number);
}

.score-stars {
  margin: 5px 0;
}

.score-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.rating-distribution {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.distribution-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 40px;
}

.distribution-bar {
  flex: 1;
  height: 6px;
  background: var(--color-bg-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  background: var(--color-warning);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.distribution-percentage {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  min-width: 40px;
  text-align: right;
}

.review-filter {
  margin-bottom: 15px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-card {
  padding: 15px;
  background: var(--color-bg-light);
  border-radius: var(--radius-md);
}

.review-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.review-user {
  flex: 1;
}

.user-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: 5px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.review-content {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  line-height: 1.6;
  margin-bottom: 10px;
}

.review-images {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.review-images img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.review-actions {
  display: flex;
  gap: 20px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.action-item .active {
  color: var(--color-primary);
}

/* 推荐商品 */
.recommend-section {
  background: white;
  margin-bottom: 12px;
  padding: 15px;
}

.product-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.product-card {
  flex-shrink: 0;
  width: 140px;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: 8px;
}

.product-name {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-danger);
  margin-bottom: 3px;
}

.product-sales {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

/* 相似商家 */
.similar-section {
  background: white;
  margin-bottom: 12px;
  padding: 15px;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.similar-card {
  cursor: pointer;
  transition: all var(--transition-normal);
}

.similar-card:active {
  transform: scale(0.98);
}

.similar-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: 8px;
}

.similar-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.similar-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.similar-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.similar-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--color-warning);
}

.similar-price {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 10px 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 100;
}

.bar-left {
  display: flex;
  gap: 20px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.bar-item .anticon {
  font-size: 20px;
}

.bar-item .active {
  color: var(--color-danger);
}

.bar-right {
  flex: 1;
}

/* 优惠券飞入动画 */
.coupon-fly {
  position: fixed;
  font-size: 40px;
  color: var(--color-warning);
  z-index: 9999;
  pointer-events: none;
}

@keyframes couponFlyToTop {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(0, -500px) scale(0.3);
    opacity: 0;
  }
}

/* 核销弹窗样式 */
.verification-modal {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.verification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.close-btn,
.help-btn {
  font-size: 20px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover,
.help-btn:hover {
  color: #1890ff;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.verification-content {
  padding: 20px;
  text-align: center;
}

.merchant-info {
  margin-bottom: 30px;
}

.merchant-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f0f0f0;
}

.merchant-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.merchant-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.merchant-address {
  font-size: 14px;
  color: #999;
}

.qrcode-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  margin: 20px 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qrcode-image {
  width: 280px;
  height: 280px;
  border-radius: 8px;
}

.verification-code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.code-label {
  font-size: 14px;
  color: #666;
}

.code-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
}

.copy-icon {
  font-size: 16px;
  color: #1890ff;
  cursor: pointer;
  transition: transform 0.3s;
}

.copy-icon:hover {
  transform: scale(1.2);
}

.offer-details {
  text-align: left;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin: 20px 0;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #666;
}

.detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.usage-tips {
  text-align: left;
  padding: 15px;
  background: #fff7e6;
  border-radius: 8px;
  border: 1px solid #ffd591;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #fa8c16;
  margin-bottom: 10px;
}

.tips-list {
  font-size: 13px;
  color: #666;
}

.tip-item {
  padding: 4px 0;
}

.demo-actions {
  margin-top: 30px;
}

.verification-success {
  padding: 40px 20px;
  text-align: center;
}

.success-icon {
  margin-bottom: 20px;
  animation: successBounce 0.5s ease-out;
}

@keyframes successBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.success-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.success-amount {
  font-size: 20px;
  color: #f5222d;
  font-weight: 600;
  margin-bottom: 20px;
}

.success-points {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  border-radius: 20px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 30px;
  animation: pointsShine 1s ease-in-out infinite alternate;
}

@keyframes pointsShine {
  0% {
    box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
  }
  100% {
    box-shadow: 0 4px 20px rgba(255, 165, 0, 0.6);
  }
}

.success-info {
  text-align: left;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.success-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* 优惠券列表弹窗样式 */
.coupon-list-modal {
  max-height: 60vh;
  overflow-y: auto;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.coupon-item {
  display: flex;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  transition: all 0.3s;
}

.coupon-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
}

.coupon-item.claimed {
  background: linear-gradient(135deg, #d9d9d9 0%, #e8e8e8 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coupon-item.claimed:hover {
  transform: none;
}

.coupon-left {
  flex: 0 0 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
}

.coupon-item.claimed .coupon-left {
  background: rgba(0, 0, 0, 0.05);
  border-right-color: rgba(0, 0, 0, 0.1);
}

.coupon-amount {
  display: flex;
  align-items: baseline;
  color: #fff;
  margin-bottom: 8px;
}

.coupon-item.claimed .coupon-amount {
  color: #999;
}

.amount-symbol {
  font-size: 20px;
  font-weight: 600;
}

.amount-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.coupon-condition {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.coupon-item.claimed .coupon-condition {
  color: #999;
}

.coupon-right {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
}

.coupon-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.coupon-validity {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.coupon-tips {
  padding: 15px;
  background: #fff7e6;
  border-radius: 8px;
  border: 1px solid #ffd591;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #fa8c16;
  margin-bottom: 10px;
}

.tips-content {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

.tips-content div {
  padding: 2px 0;
}
</style>

