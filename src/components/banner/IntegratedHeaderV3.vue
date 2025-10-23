<template>
  <div class="integrated-header-v3">
    <!-- Banner容器 - 底部有向下凸出的笑脸弧形 -->
    <div class="banner-container">
      <!-- 1. 顶部栏 -->
      <div class="top-bar">
        <div class="location" @click="handleLocationClick">
          <span>📍</span>
          <span>{{ location }}</span>
          <span class="arrow">▼</span>
        </div>
        <div class="search-box" @click="handleSearchClick">
          <span class="search-icon">🔍</span>
          <span class="search-placeholder">{{ searchPlaceholder }}</span>
        </div>
        <div class="notification-icon" @click="handleNotificationClick">
          🔔
          <div v-if="hasUnreadNotifications" class="notification-badge"></div>
        </div>
      </div>

      <!-- 2. Banner内容 -->
      <div class="banner-content">
        <div class="banner-hint">{{ bannerHint }}</div>
        <h1 class="banner-main-title">{{ bannerTitle }}</h1>
        <p class="banner-subtitle">{{ bannerSubtitle }}</p>
        <button class="banner-cta-btn" @click="handleCtaClick">
          {{ ctaText }}
          <span>→</span>
        </button>
      </div>

      <!-- Banner底部的笑脸弧形SVG -->
      <svg class="smile-curve" viewBox="0 0 375 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="smileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#F25555;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF6B6B;stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- 绘制向下凸出的笑脸曲线：填充曲线上方的区域 -->
        <path d="M 0 0 Q 187.5 60 375 0 Z" fill="url(#smileGradient)"/>
      </svg>
    </div>

    <!-- 3. 金刚区 - 直接在背景板上，不使用白色卡片 -->
    <div class="function-grid-container">
      <div class="function-grid">
        <div
          v-for="(item, index) in functionItems"
          :key="index"
          class="function-item"
          @click="handleFunctionClick(item)"
        >
          <div class="function-icon-wrapper style-solid" :style="{ '--bg-color': item.bgColor }">
            <span :style="{ color: item.iconColor }">{{ item.icon }}</span>
          </div>
          <div class="function-name">{{ item.name }}</div>
          <div v-if="item.badge" class="function-badge" :class="item.badgeType">
            {{ item.badge }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Props
interface Props {
  location?: string
  searchPlaceholder?: string
  bannerHint?: string
  bannerTitle?: string
  bannerSubtitle?: string
  ctaText?: string
  hasUnreadNotifications?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  location: '南京',
  searchPlaceholder: '搜索优惠券、商品',
  bannerHint: '国家惠民政策',
  bannerTitle: '领取国补正当时',
  bannerSubtitle: '绿色智能家电和3C·最高补贴2000元',
  ctaText: '资格申领',
  hasUnreadNotifications: true
})

// Router
const router = useRouter()

// 金刚区功能项配置
const functionItems = ref([
  {
    icon: '🎁',
    name: '优惠券',
    bgColor: '#FFE8D6',
    iconColor: '#FF8C5A',
    route: '/voucher-center'
  },
  {
    icon: '💰',
    name: '政府补贴',
    bgColor: '#FFE4CC',
    iconColor: '#FF6B35',
    badge: 'HOT',
    badgeType: 'hot',
    route: '/gov-subsidy'
  },
  {
    icon: '🎯',
    name: '积分任务',
    bgColor: '#FFE0E0',
    iconColor: '#E94444',
    route: '/earn-points'
  },
  {
    icon: '🏪',
    name: '附近商家',
    bgColor: '#E8E4FF',
    iconColor: '#7B68EE',
    route: '/nearby'
  },
  {
    icon: '🎰',
    name: '抽奖中心',
    bgColor: '#E0E8FF',
    iconColor: '#5B8DEE',
    route: '/lottery-hall'
  },
  {
    icon: '🎊',
    name: '苏潮专区',
    bgColor: '#FFE0E0',
    iconColor: '#E94444',
    badge: 'HOT',
    badgeType: 'hot',
    route: '/suchao-zone'
  },
  {
    icon: '🧩',
    name: '券拼图',
    bgColor: '#FFE4CC',
    iconColor: '#FF6B35',
    route: '/ticket-puzzle'
  },
  {
    icon: '🏛️',
    name: '老字号',
    bgColor: '#E8E4FF',
    iconColor: '#7B68EE',
    route: '/heritage-brands'
  },
  {
    icon: '🛒',
    name: '积分商城',
    bgColor: '#E0E8FF',
    iconColor: '#5B8DEE',
    badge: '定制',
    badgeType: 'new',
    route: '/points-mall'
  },
  {
    icon: '⋯',
    name: '更多',
    bgColor: '#FFE8D6',
    iconColor: '#FF8C5A',
    route: '/discover'
  }
])

// Event handlers
const handleLocationClick = () => {
  console.log('Location clicked')
  // TODO: 打开城市选择器
}

const handleSearchClick = () => {
  router.push('/search')
}

const handleNotificationClick = () => {
  router.push('/notifications')
}

const handleCtaClick = () => {
  router.push('/gov-subsidy')
}

const handleFunctionClick = (item: any) => {
  if (item.route) {
    router.push(item.route)
  }
}
</script>

<style scoped>
.integrated-header-v3 {
  position: relative;
  width: 100%;
}

/* Banner容器 - 红色背景区域，底部有向下凸出的笑脸弧形 */
.banner-container {
  position: relative;
  background: linear-gradient(
    180deg,
    #E94444 0%,
    #F25555 50%,
    #FF6B6B 100%
  );
  padding-bottom: 20px;
}

/* Banner底部的笑脸弧形 - 使用SVG */
.smile-curve {
  position: absolute;
  bottom: -40px;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 100;
  pointer-events: none;
}

/* 顶部栏 */
.top-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
}

.arrow {
  font-size: 10px;
}

.search-box {
  flex: 1;
  height: 36px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-box:active {
  transform: scale(0.98);
}

.search-icon {
  font-size: 16px;
  color: #999;
}

.search-placeholder {
  color: #999;
  font-size: 14px;
}

.notification-icon {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #E94444;
}

/* Banner内容区域 */
.banner-content {
  padding: 20px 16px 60px;
  position: relative;
  z-index: 2;
}

.banner-hint {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  text-align: center;
}

.banner-main-title {
  font-size: 42px;
  font-weight: 900;
  color: #fff;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 8px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-style: italic;
  letter-spacing: 2px;
}

.banner-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.banner-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 200px;
  height: 48px;
  margin: 0 auto;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
  border: none;
  border-radius: 24px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
  transition: all 0.3s;
}

.banner-cta-btn:active {
  transform: scale(0.95);
}

/* 金刚区容器 - 直接在背景板上，不使用白色卡版 */
.function-grid-container {
  position: relative;
  background: #f5f5f5;
  padding: 40px 16px 20px;
  margin-top: 0;
  z-index: 10;
}

/* 金刚区 - 直接在背景板上绘制 */
.function-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  position: relative;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
}

.function-item:active {
  transform: scale(0.95);
}

.function-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  position: relative;
  transition: all 0.3s;
}

.function-icon-wrapper.style-solid {
  background: var(--bg-color);
}

.function-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
  text-align: center;
}

.function-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4d4f;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: bold;
}

.function-badge.hot {
  background: linear-gradient(135deg, #FF4D4F 0%, #FF7875 100%);
}

.function-badge.new {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
}
</style>

