<template>
  <div class="nearby-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <LeftOutlined class="back-btn" @click="goBack" />
      <div class="location-info">
        <EnvironmentFilled class="location-icon" />
        <span class="location-text">{{ currentLocation }}</span>
        <DownOutlined class="arrow-icon" />
      </div>
      <div class="view-switch">
        <div 
          class="switch-item" 
          :class="{ active: viewMode === 'map' }"
          @click="viewMode = 'map'"
        >
          <EnvironmentOutlined />
          <span>地图</span>
        </div>
        <div 
          class="switch-item" 
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <UnorderedListOutlined />
          <span>列表</span>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="filter-tab"
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          {{ category.name }}
        </div>
      </div>
      <div class="filter-btn" @click="showFilterDrawer = true">
        <FilterOutlined />
        <span>筛选</span>
      </div>
    </div>

    <!-- 地图视图 -->
    <div v-if="viewMode === 'map'" class="map-view">
      <div class="map-container">
        <div class="map-placeholder">
          <EnvironmentOutlined class="map-icon" />
          <p>地图加载中...</p>
          <p class="map-tip">实际应用中可集成高德地图或百度地图</p>
        </div>
      </div>
      
      <!-- 地图上的商家卡片列表 -->
      <div class="map-merchant-list">
        <div 
          v-for="merchant in nearbyMerchants.slice(0, 3)" 
          :key="merchant.id"
          class="map-merchant-card"
          @click="goToMerchantDetail(merchant.id)"
        >
          <div class="merchant-image" :style="{ background: merchant.color }"></div>
          <div class="merchant-info">
            <div class="merchant-name">{{ merchant.name }}</div>
            <div class="merchant-distance">
              <EnvironmentOutlined />
              <span>{{ merchant.distance }}</span>
            </div>
            <div class="merchant-tags">
              <a-tag v-for="tag in merchant.tags" :key="tag" color="orange" size="small">
                {{ tag }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else class="list-view">
      <div class="sort-bar">
        <div 
          v-for="sort in sortOptions" 
          :key="sort.id"
          class="sort-item"
          :class="{ active: activeSort === sort.id }"
          @click="activeSort = sort.id"
        >
          {{ sort.name }}
          <CaretDownOutlined v-if="activeSort === sort.id" />
        </div>
      </div>

      <div class="merchant-list">
        <div 
          v-for="merchant in filteredMerchants" 
          :key="merchant.id"
          class="merchant-card"
          @click="goToMerchantDetail(merchant.id)"
        >
          <div class="merchant-image" :style="{ background: merchant.color }">
            <div v-if="merchant.discount" class="discount-badge">
              {{ merchant.discount }}
            </div>
          </div>
          <div class="merchant-content">
            <div class="merchant-header">
              <h3 class="merchant-name">{{ merchant.name }}</h3>
              <div class="merchant-rating">
                <StarFilled class="star-icon" />
                <span>{{ merchant.rating }}</span>
              </div>
            </div>
            <div class="merchant-category">{{ merchant.category }}</div>
            <div class="merchant-address">
              <EnvironmentOutlined />
              <span>{{ merchant.address }}</span>
            </div>
            <div class="merchant-distance-info">
              <span class="distance">{{ merchant.distance }}</span>
              <span class="sales">已售{{ merchant.sales }}份</span>
            </div>
            <div class="merchant-offers">
              <div 
                v-for="offer in merchant.offers.slice(0, 2)" 
                :key="offer.id"
                class="offer-tag"
              >
                <GiftOutlined />
                <span>{{ offer.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <a-empty 
        v-if="filteredMerchants.length === 0"
        description="附近暂无商家"
        class="empty-state"
      >
        <template #image>
          <EnvironmentOutlined style="font-size: 64px; color: #d9d9d9;" />
        </template>
      </a-empty>
    </div>

    <!-- 筛选抽屉 -->
    <a-drawer
      v-model:open="showFilterDrawer"
      title="筛选条件"
      placement="right"
      :width="300"
    >
      <div class="filter-section">
        <h4>距离</h4>
        <a-radio-group v-model:value="filterDistance">
          <a-radio value="all">不限</a-radio>
          <a-radio value="1km">1公里内</a-radio>
          <a-radio value="3km">3公里内</a-radio>
          <a-radio value="5km">5公里内</a-radio>
        </a-radio-group>
      </div>

      <div class="filter-section">
        <h4>优惠类型</h4>
        <a-checkbox-group v-model:value="filterOfferTypes">
          <a-checkbox value="coupon">优惠券</a-checkbox>
          <a-checkbox value="discount">折扣</a-checkbox>
          <a-checkbox value="gift">赠品</a-checkbox>
          <a-checkbox value="points">积分</a-checkbox>
        </a-checkbox-group>
      </div>

      <div class="filter-section">
        <h4>评分</h4>
        <a-radio-group v-model:value="filterRating">
          <a-radio value="all">不限</a-radio>
          <a-radio value="4.5">4.5分以上</a-radio>
          <a-radio value="4.0">4.0分以上</a-radio>
          <a-radio value="3.5">3.5分以上</a-radio>
        </a-radio-group>
      </div>

      <template #footer>
        <div class="filter-footer">
          <a-button @click="resetFilter">重置</a-button>
          <a-button type="primary" @click="applyFilter">确定</a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  EnvironmentOutlined, 
  EnvironmentFilled,
  UnorderedListOutlined,
  FilterOutlined,
  DownOutlined,
  CaretDownOutlined,
  StarFilled,
  GiftOutlined,
  LeftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 当前位置
const currentLocation = ref('南京市鼓楼区')

// 视图模式
const viewMode = ref<'map' | 'list'>('list')

// 分类
const activeCategory = ref('all')
const categories = [
  { id: 'all', name: '全部' },
  { id: 'food', name: '美食' },
  { id: 'shopping', name: '购物' },
  { id: 'entertainment', name: '娱乐' },
  { id: 'life', name: '生活服务' }
]

// 排序
const activeSort = ref('distance')
const sortOptions = [
  { id: 'distance', name: '距离最近' },
  { id: 'rating', name: '评分最高' },
  { id: 'sales', name: '销量最高' },
  { id: 'discount', name: '优惠最多' }
]

// 筛选
const showFilterDrawer = ref(false)
const filterDistance = ref('all')
const filterOfferTypes = ref<string[]>([])
const filterRating = ref('all')

// 模拟附近商家数据
const nearbyMerchants = ref([
  {
    id: 1,
    name: '星巴克咖啡(新街口店)',
    category: '咖啡厅',
    address: '中山路18号德基广场1F',
    distance: '200m',
    rating: 4.8,
    sales: 1250,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    discount: '满50减10',
    tags: ['优惠券', '积分'],
    offers: [
      { id: 1, title: '满50减10元券' },
      { id: 2, title: '消费送积分' }
    ]
  },
  {
    id: 2,
    name: '海底捞火锅(新街口店)',
    category: '火锅',
    address: '中山路1号新街口百货B1',
    distance: '350m',
    rating: 4.9,
    sales: 2100,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    discount: '8折',
    tags: ['折扣', '赠品'],
    offers: [
      { id: 1, title: '全场8折优惠' },
      { id: 2, title: '消费送小吃' }
    ]
  },
  {
    id: 3,
    name: '苏宁易购(新街口店)',
    category: '数码电器',
    address: '中山南路1号苏宁广场',
    distance: '500m',
    rating: 4.7,
    sales: 850,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    discount: '满1000减100',
    tags: ['优惠券', '积分', '政府补贴'],
    offers: [
      { id: 1, title: '满1000减100' },
      { id: 2, title: '家电补贴最高500元' }
    ]
  },
  {
    id: 4,
    name: '万达影城(新街口店)',
    category: '电影院',
    address: '中山路1号万达广场5F',
    distance: '600m',
    rating: 4.6,
    sales: 1500,
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    discount: '会员5折',
    tags: ['折扣', '积分'],
    offers: [
      { id: 1, title: '会员观影5折' },
      { id: 2, title: '积分兑换电影票' }
    ]
  },
  {
    id: 5,
    name: '屈臣氏(新街口店)',
    category: '美妆个护',
    address: '中山路18号德基广场2F',
    distance: '250m',
    rating: 4.5,
    sales: 980,
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    discount: '满200减50',
    tags: ['优惠券', '赠品'],
    offers: [
      { id: 1, title: '满200减50' },
      { id: 2, title: '买2送1' }
    ]
  }
])

// 筛选后的商家列表
const filteredMerchants = computed(() => {
  let result = [...nearbyMerchants.value]

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    // 这里简化处理,实际应该根据category字段筛选
    result = result
  }

  // 按距离筛选
  if (filterDistance.value !== 'all') {
    // 这里简化处理,实际应该根据距离筛选
    result = result
  }

  // 按评分筛选
  if (filterRating.value !== 'all') {
    const minRating = parseFloat(filterRating.value)
    result = result.filter(m => m.rating >= minRating)
  }

  // 排序
  if (activeSort.value === 'distance') {
    // 按距离排序(这里简化处理)
    result = result
  } else if (activeSort.value === 'rating') {
    result = result.sort((a, b) => b.rating - a.rating)
  } else if (activeSort.value === 'sales') {
    result = result.sort((a, b) => b.sales - a.sales)
  }

  return result
})

// 重置筛选
const resetFilter = () => {
  filterDistance.value = 'all'
  filterOfferTypes.value = []
  filterRating.value = 'all'
}

// 应用筛选
const applyFilter = () => {
  showFilterDrawer.value = false
}

// 跳转到商家详情
const goToMerchantDetail = (id: number) => {
  router.push({
    name: 'MerchantOfferDetail',
    query: { id }
  })
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.nearby-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

/* 顶部导航栏 */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-btn {
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}

.back-btn:active {
  opacity: 0.6;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.location-icon {
  color: #FF6B35;
  font-size: 18px;
}

.location-text {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.arrow-icon {
  font-size: 12px;
  color: #999;
}

.view-switch {
  display: flex;
  gap: 8px;
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 16px;
  background: #f5f5f5;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.switch-item.active {
  background: #FF6B35;
  color: #fff;
}

/* 筛选栏 */
.filter-bar {
  background: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.filter-tabs {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  flex: 1;
}

.filter-tab {
  white-space: nowrap;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.filter-tab.active {
  color: #FF6B35;
  font-weight: 500;
  border-bottom-color: #FF6B35;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 16px;
  background: #f5f5f5;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  margin-left: 12px;
}

/* 地图视图 */
.map-view {
  position: relative;
  height: calc(100vh - 180px);
}

.map-container {
  width: 100%;
  height: 100%;
  background: #e5e5e5;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.map-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.map-tip {
  font-size: 12px;
  color: #bbb;
  margin-top: 8px;
}

.map-merchant-list {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.map-merchant-card {
  flex-shrink: 0;
  width: 200px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.map-merchant-card:active {
  transform: scale(0.95);
}

.map-merchant-card .merchant-image {
  width: 100%;
  height: 100px;
}

.map-merchant-card .merchant-info {
  padding: 12px;
}

.map-merchant-card .merchant-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.map-merchant-card .merchant-distance {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #FF6B35;
  margin-bottom: 8px;
}

.map-merchant-card .merchant-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* 列表视图 */
.list-view {
  padding: 0 0 16px 0;
}

.sort-bar {
  background: #fff;
  padding: 12px 16px;
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.sort-item.active {
  color: #FF6B35;
  font-weight: 500;
}

.merchant-list {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.merchant-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.merchant-card:active {
  transform: scale(0.98);
}

.merchant-image {
  width: 100%;
  height: 160px;
  position: relative;
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 107, 53, 0.95);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.merchant-content {
  padding: 16px;
}

.merchant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.merchant-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
  flex: 1;
}

.merchant-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #FF6B35;
}

.star-icon {
  font-size: 14px;
}

.merchant-category {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.merchant-address {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.merchant-distance-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
}

.distance {
  color: #FF6B35;
  font-weight: 500;
}

.sales {
  color: #999;
}

.merchant-offers {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.offer-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #fff7f0;
  border: 1px solid #ffd8bf;
  border-radius: 12px;
  font-size: 12px;
  color: #FF6B35;
}

.empty-state {
  margin-top: 60px;
}

/* 筛选抽屉 */
.filter-section {
  margin-bottom: 24px;
}

.filter-section h4 {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.filter-footer {
  display: flex;
  gap: 12px;
}

.filter-footer .ant-btn {
  flex: 1;
}
</style>

