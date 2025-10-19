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

    <!-- 智能推荐卡片流 -->
    <div class="feed-container">
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
  SearchOutlined 
} from '@ant-design/icons-vue'
import SubsidyCard from '../components/feed/SubsidyCard.vue'
import CouponCard from '../components/feed/CouponCard.vue'
import RecommendCard from '../components/feed/RecommendCard.vue'

const router = useRouter()
const userStore = useUserStore()
const feedStore = useFeedStore()

const feedCards = computed(() => feedStore.generateFeedCards)
const hasMore = computed(() => false) // TODO: 实现分页加载

const getCardComponent = (componentName: string) => {
  const components: Record<string, any> = {
    SubsidyCard,
    CouponCard,
    RecommendCard
  }
  return components[componentName] || 'div'
}

const selectCity = () => {
  router.push('/city-selector')
}

const goSearch = () => {
  // TODO: 实现搜索功能
  console.log('打开搜索')
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

.feed-container {
  padding: 16px;
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

