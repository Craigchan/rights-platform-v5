<template>
  <div class="home-feed">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="location" @click="selectCity">
        <EnvironmentOutlined />
        <span>{{ userStore.city }}</span>
        <DownOutlined class="arrow" />
      </div>
      <div class="search" @click="goSearch">
        <SearchOutlined />
        <span>搜索优惠券、商品</span>
      </div>
    </div>

    <!-- 轮播广告 -->
    <div class="banner-section">
      <a-carousel autoplay :autoplay-speed="4000">
        <div v-for="banner in banners" :key="banner.id" class="banner-item">
          <img :src="banner.image" :alt="banner.title" class="banner-image" />
        </div>
      </a-carousel>
    </div>

    <!-- 金刚区 -->
    <div class="function-section">
      <div class="section-header">
        <h2 class="section-title">快捷入口</h2>
        <div class="more-link" @click="goToDiscover">
          <span>更多功能</span>
          <RightOutlined />
        </div>
      </div>
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

    <!-- 智能推荐卡片流 -->
    <div class="feed-container">
      <div class="feed-title">为您推荐</div>
      <div v-for="card in feedCards" :key="card.id" class="feed-card">
        <component 
          :is="getCardComponent(card.component)" 
          :data="card.data" 
        />
      </div>
    </div>

    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMore">
      <a-spin />
      <span>加载更多...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useFeedStore } from '../stores/feedStore'
import { 
  EnvironmentOutlined, 
  DownOutlined, 
  SearchOutlined,
  SafetyOutlined,
  TagsOutlined,
  ShopOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  CrownOutlined,
  ShoppingOutlined,
  StarOutlined,
  FireOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import SubsidyCard from '../components/feed/SubsidyCard.vue'
import CouponCard from '../components/feed/CouponCard.vue'
import RecommendCard from '../components/feed/RecommendCard.vue'
import NearbyCard from '../components/feed/NearbyCard.vue'
import PointsTaskCard from '../components/feed/PointsTaskCard.vue'
import ActivityCard from '../components/feed/ActivityCard.vue'

const router = useRouter()
const userStore = useUserStore()
const feedStore = useFeedStore()

const feedCards = computed(() => feedStore.generateFeedCards)
const hasMore = computed(() => false) // TODO: 实现分页加载

// 轮播广告数据
const banners = [
  {
    id: 1,
    title: '家电以旧换新',
    subtitle: '最高补贴2000元',
    image: 'https://picsum.photos/seed/banner-appliance/750/300'
  },
  {
    id: 2,
    title: '政府消费券',
    subtitle: '满200减50元',
    image: 'https://picsum.photos/seed/banner-voucher/750/300'
  },
  {
    id: 3,
    title: '积分抽奖',
    subtitle: '100积分抽大奖',
    image: 'https://picsum.photos/seed/banner-lottery/750/300'
  }
]

// 金刚区功能 - 精简为5个核心功能
const functions = [
  { id: 1, name: '政府补贴', icon: SafetyOutlined, gradient: 'linear-gradient(135deg, #1890FF 0%, #0050B3 100%)', badge: '', route: '/gov-subsidy' },
  { id: 2, name: '领券中心', icon: GiftOutlined, gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', badge: '热', route: '/voucher-center' },
  { id: 3, name: '积分商城', icon: ShopOutlined, gradient: 'linear-gradient(135deg, #52C41A 0%, #389E0D 100%)', badge: '', route: '/points-mall' },
  { id: 4, name: '玩赚积分', icon: TrophyOutlined, gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', badge: '', route: '/earn-points' },
  { id: 5, name: '附近优惠', icon: EnvironmentOutlined, gradient: 'linear-gradient(135deg, #13C2C2 0%, #08979C 100%)', badge: '', route: '/nearby' }
]

const getCardComponent = (componentName: string) => {
  const components: Record<string, any> = {
    SubsidyCard,
    CouponCard,
    RecommendCard,
    NearbyCard,
    PointsTaskCard,
    ActivityCard
  }
  return components[componentName] || 'div'
}

const selectCity = () => {
  router.push('/city-selector')
}

const goSearch = () => {
  router.push('/search')
}

const goToDiscover = () => {
  router.push('/discover')
}

const handleFunctionClick = (item: any) => {
  if (item.route) {
    router.push(item.route)
  }
}

onMounted(() => {
  console.log('首页加载完成')
})
</script>

<style scoped>
.home-feed {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.top-bar {
  position: sticky;
  top: 0;
  background: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
}

.arrow {
  font-size: 10px;
  color: #999;
}

.search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #999;
  cursor: pointer;
}

/* 轮播广告 */
.banner-section {
  margin-bottom: 16px;
  background: white;
}

.banner-item {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 金刚区 */
.function-section {
  background: white;
  padding: 20px 16px;
  margin-bottom: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  transition: all 0.3s;
}

.more-link:hover {
  color: #FF6B35;
}

.more-link:active {
  transform: scale(0.95);
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px 16px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.function-item:active {
  transform: scale(0.95);
}

.function-icon-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.function-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.function-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #FF4D4F;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 8px;
  line-height: 1;
}

.function-name {
  font-size: 13px;
  color: #666;
  text-align: center;
  font-weight: 500;
}

/* Feed卡片流 */
.feed-container {
  padding: 0 16px;
}

.feed-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 16px;
}

.feed-card {
  margin-bottom: 0;
}

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>

