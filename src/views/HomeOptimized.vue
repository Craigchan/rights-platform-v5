<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="location" @click="showCityPicker">
        <EnvironmentOutlined />
        <span>{{ currentCity }}</span>
        <DownOutlined class="arrow" />
      </div>
      <div class="search-box" @click="handleSearch">
        <SearchOutlined />
        <input type="text" placeholder="搜索优惠券、商品" readonly />
      </div>
      <div class="notification-wrapper">
        <BellOutlined class="notification-icon" @click="goToNotifications" />
        <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
      </div>
    </div>

    <!-- 轮播广告 -->
    <div class="banner-section">
      <a-carousel autoplay :autoplay-speed="4000" class="banner-carousel">
        <div v-for="(item, index) in banners" :key="index" class="banner-item">
          <img :src="item.image" :alt="item.title" class="banner-image" />
          <div class="banner-overlay">
            <h3 class="banner-title">{{ item.title }}</h3>
            <p class="banner-subtitle">{{ item.subtitle }}</p>
          </div>
        </div>
      </a-carousel>
      <div class="banner-indicators">
        <span v-for="i in banners.length" :key="i" class="indicator" :class="{ active: i === currentBanner }"></span>
      </div>
    </div>

    <!-- 一键领券横幅 -->
    <div class="quick-collect-banner" @click="showVoucherCenter">
      <div class="banner-content">
        <div class="banner-left">
          <div class="gift-icon-wrapper">
            <GiftOutlined class="gift-icon" />
          </div>
          <div class="banner-text">
            <div class="banner-title">一键领取全部优惠券</div>
            <div class="banner-subtitle">政府券 · 平台券 · 商家券</div>
          </div>
        </div>
        <a-button type="primary" class="collect-btn">
          立即领取
          <RightOutlined />
        </a-button>
      </div>
    </div>

    <!-- 金刚区 -->
    <div class="function-section">
      <div class="function-grid">
        <div 
          v-for="item in functions" 
          :key="item.id"
          class="function-item"
          @click="handleFunctionClick(item)"
        >
          <div class="function-icon-wrapper">
            <div class="function-icon" :style="{ background: item.gradient }">
              <component :is="item.icon" />
            </div>
            <span v-if="item.badge" class="function-badge">{{ item.badge }}</span>
          </div>
          <span class="function-name">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 限时秒杀横幅 -->
    <div class="flash-sale-section">
      <div class="flash-sale-banner">
        <div class="flash-sale-header">
          <div class="flash-sale-left">
            <div class="flash-sale-title">
              <ThunderboltFilled class="thunder-icon" />
              <span>限时秒杀</span>
            </div>
            <div class="flash-sale-time">
              距结束 <span class="countdown">{{ countdown }}</span>
            </div>
          </div>
          <a-button type="link" size="small" class="more-btn" @click="goToFlashSale">
            查看更多 <RightOutlined />
          </a-button>
        </div>
        <div class="flash-sale-products">
          <div v-for="product in flashSaleProducts.slice(0, 3)" :key="product.id" class="flash-product">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <div class="discount-tag">{{ product.discount }}折</div>
            </div>
            <div class="product-info">
              <div class="product-price">¥{{ product.price }}</div>
              <div class="product-original-price">¥{{ product.originalPrice }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色电商专区 -->
    <div class="special-zones-section">
      <div class="section-header">
        <h3 class="section-title">特色专区</h3>
        <span class="section-subtitle">本地新消费</span>
      </div>
      <div class="zone-layout">
        <!-- 左侧大卡片 -->
        <div class="zone-main" @click="goToZone(mainZone)">
          <img :src="mainZone.image" :alt="mainZone.name" class="zone-bg" />
          <div class="zone-overlay">
            <div class="zone-badge">本周主打</div>
            <div class="zone-name">{{ mainZone.name }}</div>
            <div class="zone-desc">{{ mainZone.desc }}</div>
          </div>
        </div>
        <!-- 右侧双卡片 -->
        <div class="zone-side">
          <div 
            v-for="zone in sideZones" 
            :key="zone.id"
            class="zone-item-small"
            @click="goToZone(zone)"
          >
            <img :src="zone.image" :alt="zone.name" class="zone-bg" />
            <div class="zone-overlay">
              <div class="zone-name">{{ zone.name }}</div>
              <div class="zone-desc">{{ zone.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 政府活动区 -->
    <div class="gov-activities-section">
      <div class="section-header">
        <h3 class="section-title">
          <SafetyOutlined class="gov-icon" />
          政府活动
        </h3>
        <a-button type="link" size="small" @click="goToGovActivities">
          更多 <RightOutlined />
        </a-button>
      </div>
      <div class="activities-scroll">
        <div 
          v-for="activity in govActivities" 
          :key="activity.id"
          class="activity-card gov-activity"
          @click="goToActivityDetail(activity)"
        >
          <img :src="activity.image" :alt="activity.title" class="activity-image" />
          <div class="activity-info">
            <h4 class="activity-title">{{ activity.title }}</h4>
            <p class="activity-desc">{{ activity.desc }}</p>
            <div class="activity-meta">
              <span class="activity-participants">
                <UserOutlined /> {{ activity.participants }}人参与
              </span>
              <span class="activity-deadline">{{ activity.deadline }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 精选推荐区 -->
    <div class="recommendations-section">
      <div class="section-header">
        <h3 class="section-title">精选推荐</h3>
        <span class="section-subtitle">基于您的位置和偏好</span>
      </div>
      <a-tabs v-model:activeKey="activeTab" class="recommendation-tabs">
        <a-tab-pane key="nearby" tab="附近优惠">
          <div class="product-grid">
            <div 
              v-for="product in nearbyProducts" 
              :key="product.id"
              class="product-card"
              @click="goToProductDetail(product)"
            >
              <div class="product-image-wrapper">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <span v-if="product.tag" class="product-tag">{{ product.tag }}</span>
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-desc">{{ product.desc }}</p>
                <div class="product-footer">
                  <div class="product-price-wrapper">
                    <span class="product-price">{{ product.points }}积分</span>
                    <span v-if="product.originalPrice" class="product-original-price">¥{{ product.originalPrice }}</span>
                  </div>
                  <span class="product-sales">{{ product.sales }}人已兑</span>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="hot" tab="热门商品">
          <div class="product-grid">
            <!-- 热门商品内容 -->
          </div>
        </a-tab-pane>
        <a-tab-pane key="points" tab="积分好物">
          <div class="product-grid">
            <!-- 积分好物内容 -->
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 悬浮抽奖按钮 -->
    <div class="lottery-float-btn" @click="goToLottery">
      <div class="lottery-icon-wrapper">
        <GiftOutlined class="lottery-icon" />
      </div>
      <span class="lottery-text">抽奖</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  EnvironmentOutlined,
  DownOutlined,
  SearchOutlined,
  BellOutlined,
  GiftOutlined,
  RightOutlined,
  ThunderboltFilled,
  SafetyOutlined,
  UserOutlined,
  DollarOutlined,
  ShopOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  TagsOutlined,
  CrownOutlined,
  ShoppingOutlined,
  StarOutlined,
  FireOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 当前城市
const currentCity = ref('南京')

// 未读消息数
const unreadCount = ref(5)

// 当前轮播索引
const currentBanner = ref(1)

// 轮播广告数据
const banners = ref([
  {
    id: 1,
    title: '家电以旧换新',
    subtitle: '最高补贴2000元',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="750" height="300"%3E%3Cdefs%3E%3ClinearGradient id="b1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="750" height="300" fill="url(%23b1)" /%3E%3Ctext x="50%25" y="40%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E家电以旧换新%3C/text%3E%3Ctext x="50%25" y="60%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E最高补贴2000元%3C/text%3E%3C/svg%3E'
  },
  {
    id: 2,
    title: '政府消费券来了',
    subtitle: '满200减50元',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="750" height="300"%3E%3Cdefs%3E%3ClinearGradient id="b2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231890FF;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230050B3;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="750" height="300" fill="url(%23b2)" /%3E%3Ctext x="50%25" y="40%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E政府消费券来了%3C/text%3E%3Ctext x="50%25" y="60%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E满200减50元%3C/text%3E%3C/svg%3E'
  },
  {
    id: 3,
    title: '积分抽奖活动',
    subtitle: '100积分抽大奖',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="750" height="300"%3E%3Cdefs%3E%3ClinearGradient id="b1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="750" height="300" fill="url(%23b1)" /%3E%3Ctext x="50%25" y="40%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E家电以旧换新%3C/text%3E%3Ctext x="50%25" y="60%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E最高补贴2000元%3C/text%3E%3C/svg%3E'
  }
])

// 金刚区功能
const functions = ref([
  { id: 1, name: '政府补贴', icon: SafetyOutlined, gradient: 'linear-gradient(135deg, #1890FF 0%, #0050B3 100%)', badge: '' },
  { id: 2, name: '消费券', icon: TagsOutlined, gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', badge: '新' },
  { id: 3, name: '商圈活动', icon: ShopOutlined, gradient: 'linear-gradient(135deg, #52C41A 0%, #389E0D 100%)', badge: '' },
  { id: 4, name: '玩赚积分', icon: TrophyOutlined, gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', badge: '' },
  { id: 5, name: '实名认证', icon: SafetyCertificateOutlined, gradient: 'linear-gradient(135deg, #722ED1 0%, #531DAB 100%)', badge: '' },
  { id: 6, name: '领券中心', icon: GiftOutlined, gradient: 'linear-gradient(135deg, #EB2F96 0%, #C41D7F 100%)', badge: '热' },
  { id: 7, name: '我的会员', icon: CrownOutlined, gradient: 'linear-gradient(135deg, #FA8C16 0%, #D46B08 100%)', badge: '' },
  { id: 8, name: '苏品苏货', icon: ShoppingOutlined, gradient: 'linear-gradient(135deg, #13C2C2 0%, #08979C 100%)', badge: '' },
  { id: 9, name: '老字号', icon: StarOutlined, gradient: 'linear-gradient(135deg, #FA541C 0%, #D4380D 100%)', badge: '' },
  { id: 10, name: '国货潮品', icon: FireOutlined, gradient: 'linear-gradient(135deg, #F5222D 0%, #CF1322 100%)', badge: '' }
])

// 倒计时
const countdown = ref('02:35:48')

// 秒杀商品
const flashSaleProducts = ref([
  { id: 1, name: '小米14 Pro', price: 3999, originalPrice: 4999, discount: 8, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="f1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23f1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-family="Arial"%3E小米14 Pro%3C/text%3E%3C/svg%3E' },
  { id: 2, name: '戴森吸尘器', price: 2599, originalPrice: 3599, discount: 7.2, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="f2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300c6ff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230072ff;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23f2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="14" font-family="Arial"%3E戴森吸尘器%3C/text%3E%3C/svg%3E' },
  { id: 3, name: 'AirPods Pro', price: 1299, originalPrice: 1999, discount: 6.5, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="f3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23f093fb;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23f5576c;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23f3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="14" font-family="Arial"%3EAirPods Pro%3C/text%3E%3C/svg%3E' }
])

// 特色专区
const mainZone = ref({
  id: 1,
  name: '国货潮品',
  desc: '新国货 新潮流',
  image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="z1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23F5222D;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23CF1322;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23z1)" /%3E%3Ctext x="50%25" y="45%25" text-anchor="middle" dy=".3em" fill="white" font-size="28" font-weight="bold" font-family="Arial"%3E国货潮品%3C/text%3E%3Ctext x="50%25" y="60%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-family="Arial"%3E新国货 新潮流%3C/text%3E%3C/svg%3E'
})

const sideZones = ref([
  { id: 2, name: '老字号', desc: '传承经典', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Cdefs%3E%3ClinearGradient id="z2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FA541C;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23D4380D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="300" fill="url(%23z2)" /%3E%3Ctext x="50%25" y="45%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-weight="bold" font-family="Arial"%3E老字号%3C/text%3E%3Ctext x="50%25" y="60%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-family="Arial"%3E传承经典%3C/text%3E%3C/svg%3E' },
  { id: 3, name: '苏品苏货', desc: '江苏特产', image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Cdefs%3E%3ClinearGradient id="z3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2313C2C2;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2308979C;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="300" fill="url(%23z3)" /%3E%3Ctext x="50%25" y="45%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-weight="bold" font-family="Arial"%3E苏品苏货%3C/text%3E%3Ctext x="50%25" y="60%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-family="Arial"%3E江苏特产%3C/text%3E%3C/svg%3E' }
])

// 政府活动
const govActivities = ref([
  {
    id: 1,
    title: '家电以旧换新补贴',
    desc: '购买新家电最高补贴2000元',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="a1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23389E0D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23a1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E家电以旧换新%3C/text%3E%3C/svg%3E',
    participants: 12580,
    deadline: '3天后结束'
  },
  {
    id: 2,
    title: '新能源汽车消费券',
    desc: '购车享5000元政府补贴',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="a2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23531DAB;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23a2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E新能源汽车%3C/text%3E%3C/svg%3E',
    participants: 8763,
    deadline: '7天后结束'
  }
])

// 推荐商品
const activeTab = ref('nearby')

const nearbyProducts = ref([
  {
    id: 1,
    name: '小米14 Pro 5G手机',
    desc: '骁龙8 Gen3 | 徕卡光学镜头',
    points: 4999,
    originalPrice: 5999,
    sales: 2358,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="p4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234facfe;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2300f2fe;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23p4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="14" font-family="Arial"%3E小米14 Pro%3C/text%3E%3C/svg%3E',
    tag: '热卖'
  },
  {
    id: 2,
    name: '戴森V15吸尘器',
    desc: '激光探测 | 深度清洁',
    points: 3599,
    originalPrice: 4599,
    sales: 1876,
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="p5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2343e97b;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2338f9d7;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23p5)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="12" font-family="Arial"%3E戴森吸尘器%3C/text%3E%3C/svg%3E',
    tag: '新品'
  }
])

// 方法
const showCityPicker = () => {
  console.log('显示城市选择器')
}

const handleSearch = () => {
  router.push('/search')
}

const goToNotifications = () => {
  router.push('/notifications')
}

const showVoucherCenter = () => {
  router.push('/voucher-center')
}

const handleFunctionClick = (item: any) => {
  console.log('点击功能:', item.name)
  // 根据不同功能跳转到对应页面
}

const goToFlashSale = () => {
  router.push('/flash-sale')
}

const goToZone = (zone: any) => {
  console.log('前往专区:', zone.name)
}

const goToGovActivities = () => {
  router.push('/gov-activities')
}

const goToActivityDetail = (activity: any) => {
  router.push(`/activity/${activity.id}`)
}

const goToProductDetail = (product: any) => {
  router.push(`/product/${product.id}`)
}

const goToLottery = () => {
  router.push('/lottery')
}

// 倒计时逻辑
let countdownTimer: any = null

onMounted(() => {
  // 启动倒计时
  countdownTimer = setInterval(() => {
    // 倒计时逻辑
  }, 1000)
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
@import '../styles/variables.css';

.home-page {
  min-height: 100vh;
  background: var(--color-bg-layout);
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-bg-base);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-sm);
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-md);
  transition: background var(--duration-fast);
}

.location:active {
  background: var(--color-bg-container);
}

.location .arrow {
  font-size: 10px;
  color: var(--color-text-tertiary);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-bg-container);
  border-radius: var(--radius-full);
  cursor: pointer;
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.search-box input::placeholder {
  color: var(--color-text-tertiary);
}

.notification-wrapper {
  position: relative;
}

.notification-icon {
  font-size: 20px;
  color: var(--color-text-primary);
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--color-error);
  color: white;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
}

/* 轮播广告 */
.banner-section {
  position: relative;
  margin: 12px 16px;
}

.banner-carousel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.banner-item {
  position: relative;
  height: 180px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: white;
}

.banner-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 4px;
}

.banner-subtitle {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.banner-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.5);
  transition: all var(--duration-base);
}

.indicator.active {
  width: 20px;
  background: white;
}

/* 一键领券横幅 */
.quick-collect-banner {
  margin: 12px 16px;
  padding: 16px;
  background: var(--color-primary-gradient);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--duration-base);
}

.quick-collect-banner:active {
  transform: scale(0.98);
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gift-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
}

.gift-icon {
  font-size: 24px;
  color: white;
}

.banner-text {
  color: white;
}

.banner-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 4px;
}

.banner-subtitle {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

.collect-btn {
  background: white;
  color: var(--color-primary);
  border: none;
  font-weight: var(--font-weight-medium);
}

/* 金刚区 */
.function-section {
  margin: 12px 16px;
  padding: 16px;
  background: var(--color-bg-base);
  border-radius: var(--radius-xl);
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform var(--duration-base);
}

.function-item:active {
  transform: scale(0.95);
}

.function-icon-wrapper {
  position: relative;
}

.function-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  color: white;
  font-size: 24px;
  box-shadow: var(--shadow-md);
}

.function-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  padding: 2px 6px;
  background: var(--color-error);
  color: white;
  font-size: 10px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
}

.function-name {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
  text-align: center;
}

/* 限时秒杀 */
.flash-sale-section {
  margin: 12px 16px;
}

.flash-sale-banner {
  padding: 16px;
  background: var(--color-bg-base);
  border-radius: var(--radius-xl);
}

.flash-sale-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.flash-sale-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.flash-sale-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.thunder-icon {
  color: var(--color-error);
  font-size: 20px;
}

.flash-sale-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.countdown {
  color: var(--color-error);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-number);
}

.more-btn {
  color: var(--color-text-tertiary);
  padding: 0;
}

.flash-sale-products {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.flash-sale-products::-webkit-scrollbar {
  display: none;
}

.flash-product {
  flex-shrink: 0;
  width: 100px;
}

.flash-product .product-image {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 8px;
}

.flash-product .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-tag {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  background: var(--color-error);
  color: white;
  font-size: 10px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
}

.flash-product .product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.flash-product .product-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-error);
  font-family: var(--font-family-number);
}

.flash-product .product-original-price {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-decoration: line-through;
}

/* 特色专区 */
.special-zones-section {
  margin: 12px 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.gov-icon {
  color: var(--color-secondary);
}

.zone-layout {
  display: flex;
  gap: 12px;
}

.zone-main {
  flex: 1;
  position: relative;
  height: 180px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
}

.zone-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zone-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: white;
}

.zone-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-gold);
  color: white;
  font-size: 10px;
  border-radius: var(--radius-sm);
  margin-bottom: 8px;
}

.zone-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 4px;
}

.zone-desc {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

.zone-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 140px;
}

.zone-item-small {
  position: relative;
  height: 84px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
}

/* 政府活动 */
.gov-activities-section {
  margin: 12px 16px;
}

.activities-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}

.activities-scroll::-webkit-scrollbar {
  display: none;
}

.activity-card {
  flex-shrink: 0;
  width: 280px;
  background: var(--color-bg-base);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-base);
}

.activity-card:active {
  transform: scale(0.98);
}

.gov-activity {
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.activity-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.activity-info {
  padding: 12px;
}

.activity-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.activity-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.activity-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.activity-participants {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 精选推荐 */
.recommendations-section {
  margin: 12px 16px;
}

.recommendation-tabs {
  margin-top: 12px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  background: var(--color-bg-base);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-base);
}

.product-card:active {
  transform: scale(0.98);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 160px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  background: var(--color-error);
  color: white;
  font-size: 10px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price-wrapper {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.product-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gold-dark);
  font-family: var(--font-family-number);
}

.product-original-price {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-decoration: line-through;
}

.product-sales {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* 悬浮抽奖按钮 */
.lottery-float-btn {
  position: fixed;
  right: 16px;
  bottom: 120px;
  width: 56px;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-gold-gradient);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-xl);
  cursor: pointer;
  z-index: var(--z-fixed);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.lottery-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottery-icon {
  font-size: 24px;
  color: white;
}

.lottery-text {
  font-size: 10px;
  color: white;
  font-weight: var(--font-weight-medium);
  margin-top: -4px;
}
</style>

