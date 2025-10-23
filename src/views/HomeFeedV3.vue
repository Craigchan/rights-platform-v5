<template>
  <div class="home-feed-v3">
    <!-- 一体化头部设计 V3 - 笑脸曲线Banner + 金刚区 -->
    <IntegratedHeaderV3 
      :location="userStore.city"
      :has-unread-notifications="notificationStore.unreadCount > 0"
    />

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
import { useNotificationStore } from '../stores/notificationStore'
import IntegratedHeaderV3 from '../components/banner/IntegratedHeaderV3.vue'
import SubsidyCard from '../components/feed/SubsidyCard.vue'
import CouponCard from '../components/feed/CouponCard.vue'
import RecommendCard from '../components/feed/RecommendCard.vue'
import NearbyCard from '../components/feed/NearbyCard.vue'
import PointsTaskCard from '../components/feed/PointsTaskCard.vue'
import ActivityCard from '../components/feed/ActivityCard.vue'

const router = useRouter()
const notificationStore = useNotificationStore()
const userStore = useUserStore()
const feedStore = useFeedStore()

const feedCards = computed(() => feedStore.generateFeedCards)
const hasMore = computed(() => false) // TODO: 实现分页加载

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

onMounted(() => {
  console.log('首页V3加载完成 - 集成头部设计')
})
</script>

<style scoped>
.home-feed-v3 {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 推荐卡片流容器 */
.feed-container {
  padding: 0 16px;
}

.feed-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 20px 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feed-title::before {
  content: '';
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, #E94444 0%, #FF6B6B 100%);
  border-radius: 2px;
}

.feed-card {
  margin-bottom: 12px;
}

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  color: #999;
  font-size: 14px;
}
</style>

