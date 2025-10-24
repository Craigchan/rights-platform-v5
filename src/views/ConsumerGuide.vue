<template>
  <div class="consumer-guide-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <ArrowLeftOutlined class="back-icon" @click="$router.back()" />
      <span class="title">消费指引</span>
      <SearchOutlined class="search-icon" @click="showSearch = true" />
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <div 
        class="tab-item"
        :class="{ 'active': activeCategory === category.value }"
        v-for="category in categories"
        :key="category.value"
        @click="activeCategory = category.value"
      >
        <component :is="category.icon" class="tab-icon" />
        <span class="tab-name">{{ category.label }}</span>
      </div>
    </div>

    <!-- 消费指引内容 -->
    <div class="guide-content">
      <!-- 优惠活动列表 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">
            <FireOutlined style="margin-right: 8px; color: #FF4444;" />
            热门优惠
          </h2>
          <a-button type="link" size="small" @click="viewMore('hot')">
            查看全部 <RightOutlined />
          </a-button>
        </div>
        <div class="benefits-grid">
          <div 
            class="benefit-card"
            v-for="benefit in filteredBenefits"
            :key="benefit.id"
            @click="goToBenefitDetail(benefit)"
          >
            <div class="benefit-image">
              <img v-img-fallback :src="benefit.image" :alt="benefit.title" />
              <div class="benefit-badge" v-if="benefit.badge">{{ benefit.badge }}</div>
              <div class="benefit-distance">{{ benefit.distance }}</div>
            </div>
            <div class="benefit-content">
              <h3 class="benefit-title">{{ benefit.title }}</h3>
              <p class="benefit-merchant">{{ benefit.merchant }}</p>
              <div class="benefit-tags">
                <a-tag v-for="tag in benefit.tags" :key="tag" size="small">{{ tag }}</a-tag>
              </div>
              <div class="benefit-footer">
                <span class="benefit-discount">{{ benefit.discount }}</span>
                <a-button type="primary" size="small">立即使用</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 消费人气榜单 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">
            <TrophyOutlined style="margin-right: 8px; color: #FFD700;" />
            人气榜单
          </h2>
        </div>
        <div class="ranking-tabs">
          <div 
            class="ranking-tab"
            :class="{ 'active': activeRanking === ranking.value }"
            v-for="ranking in rankings"
            :key="ranking.value"
            @click="activeRanking = ranking.value"
          >
            {{ ranking.label }}
          </div>
        </div>
        <div class="ranking-list">
          <div 
            class="ranking-item"
            v-for="(item, index) in currentRankingList"
            :key="item.id"
            @click="goToMerchant(item)"
          >
            <div class="ranking-number" :class="`rank-${index + 1}`">
              {{ index + 1 }}
            </div>
            <div class="ranking-image">
              <img v-img-fallback :src="item.image" :alt="item.name" />
            </div>
            <div class="ranking-info">
              <h3 class="ranking-name">{{ item.name }}</h3>
              <p class="ranking-desc">{{ item.desc }}</p>
              <div class="ranking-stats">
                <span class="stat-item">
                  <StarFilled style="color: #FFD700;" /> {{ item.rating }}
                </span>
                <span class="stat-item">
                  <EnvironmentOutlined /> {{ item.distance }}
                </span>
              </div>
            </div>
            <div class="ranking-tag">{{ item.tag }}</div>
          </div>
        </div>
      </div>

      <!-- 活动攻略 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">
            <FileTextOutlined style="margin-right: 8px;" />
            活动攻略
          </h2>
        </div>
        <div class="strategy-list">
          <div 
            class="strategy-card"
            v-for="strategy in strategies"
            :key="strategy.id"
            @click="goToStrategy(strategy)"
          >
            <div class="strategy-image">
              <img v-img-fallback :src="strategy.image" :alt="strategy.title" />
            </div>
            <div class="strategy-content">
              <h3 class="strategy-title">{{ strategy.title }}</h3>
              <p class="strategy-desc">{{ strategy.desc }}</p>
              <div class="strategy-footer">
                <span class="strategy-views">
                  <EyeOutlined /> {{ strategy.views }}人浏览
                </span>
                <span class="strategy-date">{{ strategy.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 打卡地图 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">
            <EnvironmentOutlined style="margin-right: 8px;" />
            打卡地图
          </h2>
          <a-button type="link" size="small" @click="goToMap">
            查看地图 <RightOutlined />
          </a-button>
        </div>
        <div class="map-preview" @click="goToMap">
          <div class="map-placeholder">
            <EnvironmentFilled style="font-size: 48px; color: #1890ff; opacity: 0.5;" />
            <p>点击查看完整地图</p>
          </div>
          <div class="map-stats">
            <div class="stat-item">
              <span class="stat-value">{{ nearbyCount }}</span>
              <span class="stat-label">附近商家</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ checkInCount }}</span>
              <span class="stat-label">打卡次数</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <a-modal
      v-model:open="showSearch"
      title="搜索优惠"
      :footer="null"
      :width="360"
    >
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索商家、优惠、地点..."
        size="large"
        @search="handleSearch"
      />
      <div class="search-history" v-if="searchHistory.length > 0">
        <div class="history-header">
          <span>搜索历史</span>
          <a-button type="link" size="small" @click="clearHistory">清空</a-button>
        </div>
        <div class="history-tags">
          <a-tag 
            v-for="(keyword, index) in searchHistory" 
            :key="index"
            @click="searchKeyword = keyword; handleSearch(keyword)"
          >
            {{ keyword }}
          </a-tag>
        </div>
      </div>
      <div class="hot-keywords">
        <div class="keywords-header">热门搜索</div>
        <div class="keywords-tags">
          <a-tag 
            v-for="keyword in hotKeywords" 
            :key="keyword"
            color="red"
            @click="searchKeyword = keyword; handleSearch(keyword)"
          >
            {{ keyword }}
          </a-tag>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  SearchOutlined,
  FireOutlined,
  RightOutlined,
  TrophyOutlined,
  StarFilled,
  EnvironmentOutlined,
  EnvironmentFilled,
  FileTextOutlined,
  EyeOutlined,
  ShopOutlined,
  CoffeeOutlined,
  ShoppingOutlined,
  HomeOutlined,
  CarOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 分类
const categories = ref([
  { label: '全部', value: 'all', icon: ShopOutlined },
  { label: '餐饮', value: 'food', icon: CoffeeOutlined },
  { label: '购物', value: 'shopping', icon: ShoppingOutlined },
  { label: '酒店', value: 'hotel', icon: HomeOutlined },
  { label: '交通', value: 'transport', icon: CarOutlined }
])

const activeCategory = ref('all')

// 优惠活动
const benefits = ref([
  {
    id: 1,
    title: '南京大牌档8折优惠',
    merchant: '南京大牌档(奥体店)',
    category: 'food',
    discount: '8折',
    distance: '距您500m',
    badge: '热门',
    tags: ['苏超专属', '票根优惠'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="cg1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23cg1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-weight="bold" font-family="Arial"%3E餐饮优惠%3C/text%3E%3C/svg%3E'
  },
  {
    id: 2,
    title: '停车场5折优惠',
    merchant: '奥体中心停车场',
    category: 'transport',
    discount: '5折',
    distance: '距您200m',
    badge: '推荐',
    tags: ['停车优惠'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="cg2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23cg2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-weight="bold" font-family="Arial"%3E停车优惠%3C/text%3E%3C/svg%3E'
  },
  {
    id: 3,
    title: '球队周边商品8折',
    merchant: '苏超官方商店',
    category: 'shopping',
    discount: '8折',
    distance: '距您300m',
    badge: '限时',
    tags: ['周边商品'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="cg3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23cg3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-weight="bold" font-family="Arial"%3E周边8折%3C/text%3E%3C/svg%3E'
  },
  {
    id: 4,
    title: '如家酒店立减100',
    merchant: '如家酒店(奥体店)',
    category: 'hotel',
    discount: '立减100',
    distance: '距您800m',
    badge: '',
    tags: ['住宿优惠'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="cg4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23cg4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-weight="bold" font-family="Arial"%3E酒店优惠%3C/text%3E%3C/svg%3E'
  }
])

// 过滤后的优惠
const filteredBenefits = computed(() => {
  if (activeCategory.value === 'all') {
    return benefits.value
  }
  return benefits.value.filter(b => b.category === activeCategory.value)
})

// 榜单
const rankings = ref([
  { label: '必吃榜', value: 'food' },
  { label: '必逛榜', value: 'shopping' },
  { label: '必住榜', value: 'hotel' }
])

const activeRanking = ref('food')

// 榜单数据
const rankingData = ref({
  food: [
    {
      id: 1,
      name: '南京大牌档',
      desc: '地道南京菜,环境优雅',
      rating: 4.8,
      distance: '500m',
      tag: '人均¥80',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Cdefs%3E%3ClinearGradient id="rank1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="80" fill="url(%23rank1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E1%3C/text%3E%3C/svg%3E'
    },
    {
      id: 2,
      name: '海底捞火锅',
      desc: '服务一流,味道正宗',
      rating: 4.9,
      distance: '1.2km',
      tag: '人均¥120',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Cdefs%3E%3ClinearGradient id="rank2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="80" fill="url(%23rank2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E2%3C/text%3E%3C/svg%3E'
    },
    {
      id: 3,
      name: '星巴克',
      desc: '环境舒适,咖啡香浓',
      rating: 4.7,
      distance: '300m',
      tag: '人均¥40',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Cdefs%3E%3ClinearGradient id="rank3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="80" fill="url(%23rank3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E3%3C/text%3E%3C/svg%3E'
    }
  ],
  shopping: [
    {
      id: 4,
      name: '金鹰购物中心',
      desc: '品牌齐全,购物天堂',
      rating: 4.8,
      distance: '1.5km',
      tag: '大型商场',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Cdefs%3E%3ClinearGradient id="rank1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="80" fill="url(%23rank1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E1%3C/text%3E%3C/svg%3E'
    },
    {
      id: 5,
      name: '苏超官方商店',
      desc: '正品保证,球迷必逛',
      rating: 4.9,
      distance: '300m',
      tag: '周边商品',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Cdefs%3E%3ClinearGradient id="rank2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="80" fill="url(%23rank2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E2%3C/text%3E%3C/svg%3E'
    }
  ],
  hotel: [
    {
      id: 6,
      name: '希尔顿酒店',
      desc: '五星级酒店,服务一流',
      rating: 4.9,
      distance: '1km',
      tag: '¥800起',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Cdefs%3E%3ClinearGradient id="rank1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="80" fill="url(%23rank1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E1%3C/text%3E%3C/svg%3E'
    },
    {
      id: 7,
      name: '如家酒店',
      desc: '经济实惠,干净整洁',
      rating: 4.6,
      distance: '800m',
      tag: '¥200起',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Cdefs%3E%3ClinearGradient id="rank2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="80" fill="url(%23rank2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-weight="bold" font-family="Arial"%3E2%3C/text%3E%3C/svg%3E'
    }
  ]
})

// 当前榜单列表
const currentRankingList = computed(() => {
  return rankingData.value[activeRanking.value as keyof typeof rankingData.value] || []
})

// 活动攻略
const strategies = ref([
  {
    id: 1,
    title: '苏超观赛完整攻略',
    desc: '从购票到观赛,从美食到周边,一篇攻略全搞定!',
    views: 12345,
    date: '2025-10-15',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150"%3E%3Cdefs%3E%3ClinearGradient id="guide1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="150" fill="url(%23guide1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E观赛攻略%3C/text%3E%3C/svg%3E'
  },
  {
    id: 2,
    title: '奥体中心周边美食地图',
    desc: '精选奥体周边10家必吃餐厅,让你吃遍南京美食!',
    views: 8765,
    date: '2025-10-14',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150"%3E%3Cdefs%3E%3ClinearGradient id="guide2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="150" fill="url(%23guide2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E美食地图%3C/text%3E%3C/svg%3E'
  },
  {
    id: 3,
    title: '苏超嘉年华游玩指南',
    desc: '嘉年华活动全攻略,带你玩转现场每个角落!',
    views: 6543,
    date: '2025-10-13',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150"%3E%3Cdefs%3E%3ClinearGradient id="guide3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="150" fill="url(%23guide3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E嘉年华%3C/text%3E%3C/svg%3E'
  }
])

// 地图统计
const nearbyCount = ref(28)
const checkInCount = ref(156)

// 搜索
const showSearch = ref(false)
const searchKeyword = ref('')
const searchHistory = ref(['南京大牌档', '停车优惠', '球队周边'])
const hotKeywords = ref(['餐饮优惠', '停车', '酒店', '周边商品', '交通'])

// 方法
const viewMore = (type: string) => {
  message.info('查看更多功能开发中')
}

const goToBenefitDetail = (benefit: any) => {
  message.info(`查看${benefit.title}详情`)
}

const goToMerchant = (item: any) => {
  router.push(`/merchant-detail/${item.id}`)
}

const goToStrategy = (strategy: any) => {
  message.info(`查看${strategy.title}`)
}

const goToMap = () => {
  router.push('/map-checkin')
}

const handleSearch = (keyword: string) => {
  if (!keyword.trim()) {
    message.warning('请输入搜索关键词')
    return
  }
  
  // 添加到搜索历史
  if (!searchHistory.value.includes(keyword)) {
    searchHistory.value.unshift(keyword)
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop()
    }
  }
  
  message.success(`搜索: ${keyword}`)
  showSearch.value = false
}

const clearHistory = () => {
  searchHistory.value = []
  message.success('已清空搜索历史')
}
</script>

<style scoped lang="scss">
.consumer-guide-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 20px;
}

.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;

  .back-icon,
  .search-icon {
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}

.category-tabs {
  display: flex;
  background: white;
  padding: 12px 16px;
  margin-bottom: 12px;
  overflow-x: auto;
  gap: 12px;

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;

    .tab-icon {
      font-size: 24px;
      color: #999;
      transition: all 0.3s;
    }

    .tab-name {
      font-size: 13px;
      color: #666;
      transition: all 0.3s;
    }

    &.active {
      background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);

      .tab-icon,
      .tab-name {
        color: white;
      }
    }
  }
}

.guide-content {
  padding: 0 16px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
      display: flex;
      align-items: center;
    }
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .benefit-card {
      background: #FAFAFA;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .benefit-image {
        position: relative;
        width: 100%;
        height: 120px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .benefit-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #FF4444;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .benefit-distance {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
        }
      }

      .benefit-content {
        padding: 12px;

        .benefit-title {
          font-size: 14px;
          font-weight: bold;
          margin: 0 0 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .benefit-merchant {
          font-size: 12px;
          color: #999;
          margin: 0 0 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .benefit-tags {
          margin-bottom: 8px;
        }

        .benefit-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .benefit-discount {
            font-size: 16px;
            font-weight: bold;
            color: #FF4444;
          }
        }
      }
    }
  }

  .ranking-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    .ranking-tab {
      flex: 1;
      text-align: center;
      padding: 8px 16px;
      border-radius: 8px;
      background: #FAFAFA;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 14px;
      color: #666;

      &.active {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        color: white;
        font-weight: bold;
      }
    }
  }

  .ranking-list {
    .ranking-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #FAFAFA;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .ranking-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        background: #DDD;
        color: white;
        flex-shrink: 0;

        &.rank-1 {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        }

        &.rank-2 {
          background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
        }

        &.rank-3 {
          background: linear-gradient(135deg, #CD7F32 0%, #B8733C 100%);
        }
      }

      .ranking-image {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .ranking-info {
        flex: 1;
        min-width: 0;

        .ranking-name {
          font-size: 15px;
          font-weight: bold;
          margin: 0 0 4px;
        }

        .ranking-desc {
          font-size: 13px;
          color: #999;
          margin: 0 0 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ranking-stats {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #666;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }

      .ranking-tag {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #FF4444;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
      }
    }
  }

  .strategy-list {
    .strategy-card {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #FAFAFA;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .strategy-image {
        width: 120px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .strategy-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .strategy-title {
          font-size: 15px;
          font-weight: bold;
          margin: 0 0 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .strategy-desc {
          font-size: 13px;
          color: #999;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .strategy-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
          margin-top: 4px;

          .strategy-views {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }

  .map-preview {
    cursor: pointer;

    .map-placeholder {
      height: 200px;
      background: #FAFAFA;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;

      p {
        margin: 8px 0 0;
        color: #999;
        font-size: 14px;
      }
    }

    .map-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .stat-item {
        background: #FAFAFA;
        border-radius: 8px;
        padding: 16px;
        text-align: center;

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #1890ff;
          margin-bottom: 4px;
        }

        .stat-label {
          display: block;
          font-size: 13px;
          color: #999;
        }
      }
    }
  }
}

.search-history,
.hot-keywords {
  margin-top: 20px;

  .history-header,
  .keywords-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  .history-tags,
  .keywords-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    :deep(.ant-tag) {
      cursor: pointer;
      margin: 0;
    }
  }
}
</style>

