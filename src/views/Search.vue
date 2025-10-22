<template>
  <div class="search-page">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-bar">
        <LeftOutlined class="back-icon" @click="goBack" />
        <div class="search-input-wrapper">
          <SearchOutlined class="search-icon" />
          <input
            ref="searchInput"
            v-model="searchKeyword"
            type="text"
            placeholder="搜索优惠券、商品"
            class="search-input"
            @input="handleSearch"
            @keyup.enter="handleSearchSubmit"
          />
          <CloseCircleFilled
            v-if="searchKeyword"
            class="clear-icon"
            @click="clearSearch"
          />
        </div>
        <div class="search-button" @click="handleSearchSubmit">搜索</div>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div v-if="!searchKeyword && searchHistory.length > 0" class="search-history">
      <div class="history-header">
        <h3>搜索历史</h3>
        <DeleteOutlined class="clear-all" @click="clearHistory" />
      </div>
      <div class="history-tags">
        <a-tag
          v-for="(item, index) in searchHistory"
          :key="index"
          class="history-tag"
          @click="selectHistory(item)"
        >
          {{ item }}
        </a-tag>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div v-if="!searchKeyword" class="hot-search">
      <h3>热门搜索</h3>
      <div class="hot-tags">
        <a-tag
          v-for="(item, index) in hotSearches"
          :key="index"
          :color="index < 3 ? 'red' : 'default'"
          class="hot-tag"
          @click="selectHotSearch(item)"
        >
          <span class="rank">{{ index + 1 }}</span>
          {{ item }}
        </a-tag>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searchKeyword" class="search-results">
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <a-tab-pane key="all" tab="全部">
          <div v-if="loading" class="loading">
            <a-spin />
          </div>
          <div v-else-if="allResults.length === 0" class="empty">
            <a-empty description="暂无搜索结果" />
          </div>
          <div v-else class="result-list">
            <div
              v-for="item in allResults"
              :key="item.id"
              class="result-item"
              @click="handleResultClick(item)"
            >
              <img :src="item.image" :alt="item.name" class="result-image" />
              <div class="result-info">
                <h4 class="result-name" v-html="highlightKeyword(item.name)"></h4>
                <p class="result-desc">{{ item.desc }}</p>
                <div class="result-footer">
                  <span class="result-price">{{ item.price }}积分</span>
                  <a-tag v-if="item.type === 'coupon'" color="orange">优惠券</a-tag>
                  <a-tag v-else color="blue">商品</a-tag>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="product" tab="商品">
          <div v-if="loading" class="loading">
            <a-spin />
          </div>
          <div v-else-if="productResults.length === 0" class="empty">
            <a-empty description="暂无商品" />
          </div>
          <div v-else class="result-list">
            <div
              v-for="item in productResults"
              :key="item.id"
              class="result-item"
              @click="handleResultClick(item)"
            >
              <img :src="item.image" :alt="item.name" class="result-image" />
              <div class="result-info">
                <h4 class="result-name" v-html="highlightKeyword(item.name)"></h4>
                <p class="result-desc">{{ item.desc }}</p>
                <div class="result-footer">
                  <span class="result-price">{{ item.price }}积分</span>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="coupon" tab="优惠券">
          <div v-if="loading" class="loading">
            <a-spin />
          </div>
          <div v-else-if="couponResults.length === 0" class="empty">
            <a-empty description="暂无优惠券" />
          </div>
          <div v-else class="result-list">
            <div
              v-for="item in couponResults"
              :key="item.id"
              class="result-item"
              @click="handleResultClick(item)"
            >
              <img :src="item.image" :alt="item.name" class="result-image" />
              <div class="result-info">
                <h4 class="result-name" v-html="highlightKeyword(item.name)"></h4>
                <p class="result-desc">{{ item.desc }}</p>
                <div class="result-footer">
                  <span class="result-price">{{ item.price }}积分</span>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  SearchOutlined,
  LeftOutlined,
  CloseCircleFilled,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { getImageUrl } from '@/config/images'

const router = useRouter()
const searchInput = ref<HTMLInputElement>()
const searchKeyword = ref('')
const activeTab = ref('all')
const loading = ref(false)

// 搜索历史
const searchHistory = ref<string[]>([
  '蓝牙耳机',
  '电饭煲',
  '政府补贴'
])

// 热门搜索
const hotSearches = ref([
  '政府消费券',
  '家电以旧换新',
  '积分兑换',
  '限时秒杀',
  '蓝牙耳机',
  '智能手表',
  '电饭煲',
  '苏品苏货'
])

// 模拟搜索结果
const mockResults = ref([
  {
    id: 1,
    type: 'product',
    name: '小米蓝牙耳机 Air 2 Pro',
    desc: '主动降噪 | 长续航 | 高音质',
    price: 2999,
    image: getImageUrl('products', 'headphones', 640)
  },
  {
    id: 2,
    type: 'product',
    name: '九阳电饭煲 智能预约',
    desc: '4L容量 | 24小时预约 | 多功能',
    price: 3999,
    image: getImageUrl('products', 'smartCooker', 640)
  },
  {
    id: 3,
    type: 'coupon',
    name: '政府消费券 50元',
    desc: '全场通用 | 无门槛使用',
    price: 0,
    image: getImageUrl('activities', 'govCoupon', 640)
  },
  {
    id: 4,
    type: 'product',
    name: '华为智能手表 GT 3',
    desc: '健康监测 | 长续航 | 运动模式',
    price: 4999,
    image: getImageUrl('products', 'smartWatch', 640)
  },
  {
    id: 5,
    type: 'coupon',
    name: '家电以旧换新补贴',
    desc: '最高补贴500元',
    price: 0,
    image: getImageUrl('activities', 'tradeIn', 640)
  }
])

// 计算搜索结果
const allResults = computed(() => {
  if (!searchKeyword.value) return []
  return mockResults.value.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const productResults = computed(() => {
  return allResults.value.filter(item => item.type === 'product')
})

const couponResults = computed(() => {
  return allResults.value.filter(item => item.type === 'coupon')
})

// 返回
const goBack = () => {
  router.back()
}

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = ''
  searchInput.value?.focus()
}

// 搜索处理
const handleSearch = () => {
  // 实时搜索可以在这里实现
}

// 提交搜索
const handleSearchSubmit = () => {
  if (!searchKeyword.value.trim()) return
  
  // 添加到搜索历史
  if (!searchHistory.value.includes(searchKeyword.value)) {
    searchHistory.value.unshift(searchKeyword.value)
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }
  }
  
  // 模拟加载
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 选择历史记录
const selectHistory = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearchSubmit()
}

// 选择热门搜索
const selectHotSearch = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearchSubmit()
}

// 清空历史
const clearHistory = () => {
  searchHistory.value = []
}

// Tab切换
const handleTabChange = (key: string) => {
  activeTab.value = key
}

// 点击结果
const handleResultClick = (item: any) => {
  if (item.type === 'product') {
    router.push(`/product/${item.id}`)
  } else if (item.type === 'coupon') {
    router.push('/voucher-center')
  }
}

// 高亮关键词
const highlightKeyword = (text: string) => {
  if (!searchKeyword.value) return text
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 自动聚焦
onMounted(() => {
  nextTick(() => {
    searchInput.value?.focus()
  })
})
</script>

<style scoped lang="less">
.search-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #ff6700;
  }

  &:active {
    transform: scale(0.95);
  }
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
}

.search-icon {
  font-size: 16px;
  color: #999;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #999;
  }
}

.clear-icon {
  font-size: 16px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #666;
  }
}

.search-button {
  padding: 8px 16px;
  background: linear-gradient(135deg, #ff6700 0%, #ff8533 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 103, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.search-history,
.hot-search {
  background: #fff;
  margin: 12px 16px;
  padding: 16px;
  border-radius: 12px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
  }
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h3 {
    margin: 0;
  }

  .clear-all {
    font-size: 16px;
    color: #999;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #ff6700;
    }
  }
}

.history-tags,
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag,
.hot-tag {
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.hot-tag {
  .rank {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background: #ff6700;
    color: #fff;
    border-radius: 50%;
    font-size: 12px;
    margin-right: 4px;
  }
}

.search-results {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;

  :deep(.ant-tabs) {
    .ant-tabs-nav {
      margin: 0;
      padding: 0 16px;
    }

    .ant-tabs-tab {
      padding: 12px 0;
      margin: 0 16px 0 0;
    }
  }
}

.loading,
.empty {
  padding: 60px 20px;
  text-align: center;
}

.result-list {
  padding: 0 16px 16px;
}

.result-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f5f5f5;
    transform: translateX(4px);
  }

  &:active {
    transform: scale(0.98);
  }
}

.result-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.result-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  :deep(.highlight) {
    color: #ff6700;
    font-weight: 600;
  }
}

.result-desc {
  font-size: 13px;
  color: #999;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6700;
}
</style>

