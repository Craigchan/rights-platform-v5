<template>
  <div class="foreign-trade-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <LeftOutlined @click="goBack" />
      <span class="title">外贸优品</span>
      <SearchOutlined @click="handleSearch" />
    </div>

    <!-- 轮播横幅 -->
    <a-carousel autoplay class="banner-carousel">
      <div v-for="(banner, index) in banners" :key="index" class="banner-item">
        <div class="banner-content" :style="{ background: banner.color }">
          <div class="banner-text">
            <h3>{{ banner.title }}</h3>
            <p>{{ banner.subtitle }}</p>
          </div>
        </div>
      </div>
    </a-carousel>

    <!-- 特色标签 -->
    <div class="feature-tags">
      <div class="feature-tag">
        <SafetyCertificateOutlined />
        <span>正品保障</span>
      </div>
      <div class="feature-tag">
        <GlobalOutlined />
        <span>全球直采</span>
      </div>
      <div class="feature-tag">
        <ThunderboltOutlined />
        <span>闪电发货</span>
      </div>
      <div class="feature-tag">
        <DollarOutlined />
        <span>价格优势</span>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        :class="{ active: currentCategory === category.id }"
        @click="currentCategory = category.id"
      >
        <div class="category-icon" :style="{ background: category.color }">
          <component :is="category.icon" />
        </div>
        <div class="category-name">{{ category.name }}</div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-left">
        <div 
          v-for="filter in filters" 
          :key="filter.id"
          class="filter-item"
          :class="{ active: currentFilter === filter.id }"
          @click="currentFilter = filter.id"
        >
          {{ filter.name }}
          <DownOutlined v-if="filter.hasDropdown" />
        </div>
      </div>
      <div class="filter-right" @click="showFilterModal = true">
        <FilterOutlined />
        <span>筛选</span>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="product-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
        @click="viewProduct(product)"
      >
        <div class="product-image" :style="{ background: product.color }">
          <div v-if="product.tag" class="product-tag" :style="{ background: product.tagColor }">
            {{ product.tag }}
          </div>
          <div v-if="product.discount" class="discount-badge">
            {{ product.discount }}折
          </div>
        </div>
        <div class="product-info">
          <div class="product-brand">{{ product.brand }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-origin">
            <EnvironmentOutlined />
            <span>{{ product.origin }}</span>
          </div>
          <div class="product-footer">
            <div class="product-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
            </div>
            <div class="product-sales">已售{{ product.sales }}</div>
          </div>
          <div class="product-points" v-if="product.points">
            <TrophyOutlined />
            <span>可获{{ product.points }}积分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选弹窗 -->
    <a-modal
      v-model:open="showFilterModal"
      title="筛选"
      :footer="null"
      width="90%"
    >
      <div class="filter-modal-content">
        <div class="filter-section">
          <div class="filter-section-title">价格区间</div>
          <div class="filter-options">
            <div 
              v-for="price in priceRanges" 
              :key="price.id"
              class="filter-option"
              :class="{ active: selectedPrice === price.id }"
              @click="selectedPrice = price.id"
            >
              {{ price.label }}
            </div>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">产地</div>
          <div class="filter-options">
            <div 
              v-for="origin in origins" 
              :key="origin.id"
              class="filter-option"
              :class="{ active: selectedOrigin === origin.id }"
              @click="selectedOrigin = origin.id"
            >
              {{ origin.name }}
            </div>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-section-title">品牌</div>
          <div class="filter-options">
            <div 
              v-for="brand in brands" 
              :key="brand.id"
              class="filter-option"
              :class="{ active: selectedBrand === brand.id }"
              @click="selectedBrand = brand.id"
            >
              {{ brand.name }}
            </div>
          </div>
        </div>

        <div class="filter-actions">
          <a-button @click="resetFilter">重置</a-button>
          <a-button type="primary" @click="applyFilter">确定</a-button>
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
  LeftOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  DownOutlined,
  FilterOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  SkinOutlined,
  ShoppingOutlined,
  HomeOutlined,
  CoffeeOutlined,
  GiftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 轮播数据
const banners = ref([
  {
    title: '外贸优品 品质保证',
    subtitle: '全球直采 工厂价直销',
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  {
    title: '新品上市 限时特惠',
    subtitle: '精选好物 低至3折',
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
  },
  {
    title: '积分加倍 疯狂购',
    subtitle: '购物即送双倍积分',
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
  }
])

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: HomeOutlined, color: '#FF6B35' },
  { id: 'clothing', name: '服饰', icon: SkinOutlined, color: '#F7931E' },
  { id: 'home', name: '家居', icon: HomeOutlined, color: '#00A8E8' },
  { id: 'food', name: '食品', icon: CoffeeOutlined, color: '#43E97B' },
  { id: 'beauty', name: '美妆', icon: GiftOutlined, color: '#8338EC' },
  { id: 'digital', name: '数码', icon: ShoppingOutlined, color: '#FFBE0B' }
])

const currentCategory = ref('all')

// 筛选器
const filters = ref([
  { id: 'default', name: '综合', hasDropdown: false },
  { id: 'sales', name: '销量', hasDropdown: false },
  { id: 'price', name: '价格', hasDropdown: true },
  { id: 'new', name: '新品', hasDropdown: false }
])

const currentFilter = ref('default')

// 商品数据
const products = ref([
  {
    id: 1,
    name: '纯棉T恤 经典款',
    brand: 'UNIQLO',
    origin: '日本',
    price: 99,
    originalPrice: 199,
    sales: 1234,
    color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    category: 'clothing',
    tag: '热卖',
    tagColor: '#FF4D4F',
    discount: 5,
    points: 50
  },
  {
    id: 2,
    name: '北欧风格台灯',
    brand: 'IKEA',
    origin: '瑞典',
    price: 299,
    originalPrice: 499,
    sales: 856,
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    category: 'home',
    tag: '新品',
    tagColor: '#52C41A',
    discount: 6,
    points: 150
  },
  {
    id: 3,
    name: '进口咖啡豆 500g',
    brand: 'Lavazza',
    origin: '意大利',
    price: 128,
    originalPrice: 0,
    sales: 2341,
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    category: 'food',
    tag: '热卖',
    tagColor: '#FF4D4F',
    discount: 0,
    points: 65
  },
  {
    id: 4,
    name: '精华液套装',
    brand: 'Estée Lauder',
    origin: '美国',
    price: 899,
    originalPrice: 1299,
    sales: 567,
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    category: 'beauty',
    tag: '限时',
    tagColor: '#FAAD14',
    discount: 7,
    points: 450
  },
  {
    id: 5,
    name: '蓝牙耳机 降噪版',
    brand: 'Sony',
    origin: '日本',
    price: 1299,
    originalPrice: 1999,
    sales: 432,
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    category: 'digital',
    tag: '新品',
    tagColor: '#52C41A',
    discount: 65,
    points: 650
  },
  {
    id: 6,
    name: '运动鞋 透气款',
    brand: 'Nike',
    origin: '美国',
    price: 599,
    originalPrice: 899,
    sales: 1876,
    color: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    category: 'clothing',
    tag: '热卖',
    tagColor: '#FF4D4F',
    discount: 67,
    points: 300
  },
  {
    id: 7,
    name: '香薰蜡烛礼盒',
    brand: 'Yankee Candle',
    origin: '美国',
    price: 199,
    originalPrice: 299,
    sales: 654,
    color: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    category: 'home',
    tag: '限时',
    tagColor: '#FAAD14',
    discount: 67,
    points: 100
  },
  {
    id: 8,
    name: '巧克力礼盒',
    brand: 'Godiva',
    origin: '比利时',
    price: 258,
    originalPrice: 0,
    sales: 987,
    color: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    category: 'food',
    tag: '',
    tagColor: '',
    discount: 0,
    points: 130
  },
  {
    id: 9,
    name: '口红套装',
    brand: 'MAC',
    origin: '加拿大',
    price: 399,
    originalPrice: 599,
    sales: 1234,
    color: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
    category: 'beauty',
    tag: '热卖',
    tagColor: '#FF4D4F',
    discount: 67,
    points: 200
  },
  {
    id: 10,
    name: '智能手表',
    brand: 'Apple',
    origin: '美国',
    price: 2999,
    originalPrice: 3299,
    sales: 345,
    color: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
    category: 'digital',
    tag: '新品',
    tagColor: '#52C41A',
    discount: 91,
    points: 1500
  },
  {
    id: 11,
    name: '牛仔裤 修身款',
    brand: 'Levi\'s',
    origin: '美国',
    price: 399,
    originalPrice: 699,
    sales: 876,
    color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    category: 'clothing',
    tag: '',
    tagColor: '',
    discount: 57,
    points: 200
  },
  {
    id: 12,
    name: '床上四件套',
    brand: 'MUJI',
    origin: '日本',
    price: 599,
    originalPrice: 899,
    sales: 543,
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    category: 'home',
    tag: '热卖',
    tagColor: '#FF4D4F',
    discount: 67,
    points: 300
  },
  {
    id: 13,
    name: '橄榄油 特级初榨',
    brand: 'Bertolli',
    origin: '意大利',
    price: 168,
    originalPrice: 0,
    sales: 1456,
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    category: 'food',
    tag: '',
    tagColor: '',
    discount: 0,
    points: 85
  },
  {
    id: 14,
    name: '面膜套装',
    brand: 'SK-II',
    origin: '日本',
    price: 699,
    originalPrice: 999,
    sales: 789,
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    category: 'beauty',
    tag: '限时',
    tagColor: '#FAAD14',
    discount: 7,
    points: 350
  },
  {
    id: 15,
    name: '平板电脑',
    brand: 'Samsung',
    origin: '韩国',
    price: 2499,
    originalPrice: 2999,
    sales: 234,
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    category: 'digital',
    tag: '新品',
    tagColor: '#52C41A',
    discount: 83,
    points: 1250
  }
])

// 筛选选项
const priceRanges = ref([
  { id: 'all', label: '全部' },
  { id: '0-100', label: '0-100元' },
  { id: '100-300', label: '100-300元' },
  { id: '300-500', label: '300-500元' },
  { id: '500-1000', label: '500-1000元' },
  { id: '1000+', label: '1000元以上' }
])

const origins = ref([
  { id: 'all', name: '全部' },
  { id: 'japan', name: '日本' },
  { id: 'usa', name: '美国' },
  { id: 'europe', name: '欧洲' },
  { id: 'korea', name: '韩国' }
])

const brands = ref([
  { id: 'all', name: '全部' },
  { id: 'nike', name: 'Nike' },
  { id: 'uniqlo', name: 'UNIQLO' },
  { id: 'ikea', name: 'IKEA' },
  { id: 'sony', name: 'Sony' },
  { id: 'apple', name: 'Apple' }
])

const selectedPrice = ref('all')
const selectedOrigin = ref('all')
const selectedBrand = ref('all')

const showFilterModal = ref(false)

// 计算属性
const filteredProducts = computed(() => {
  let result = products.value

  // 按分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(p => p.category === currentCategory.value)
  }

  // 按排序
  if (currentFilter.value === 'sales') {
    result = [...result].sort((a, b) => b.sales - a.sales)
  } else if (currentFilter.value === 'price') {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (currentFilter.value === 'new') {
    result = result.filter(p => p.tag === '新品')
  }

  return result
})

// 方法
const goBack = () => {
  router.back()
}

const handleSearch = () => {
  message.info('搜索功能')
}

const viewProduct = (product: any) => {
  router.push({
    path: '/product-detail',
    query: { id: product.id }
  })
}

const resetFilter = () => {
  selectedPrice.value = 'all'
  selectedOrigin.value = 'all'
  selectedBrand.value = 'all'
}

const applyFilter = () => {
  showFilterModal.value = false
  message.success('筛选条件已应用')
}
</script>

<style scoped>
.foreign-trade-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 20px;
}

/* 顶部导航 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-nav .title {
  font-size: 18px;
  font-weight: 600;
}

.top-nav .anticon {
  font-size: 20px;
  cursor: pointer;
}

/* 轮播横幅 */
.banner-carousel {
  margin: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.banner-item {
  height: 160px;
}

.banner-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: white;
}

.banner-text h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.banner-text p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

/* 特色标签 */
.feature-tags {
  display: flex;
  gap: 12px;
  padding: 0 16px 16px;
}

.feature-tag {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.feature-tag .anticon {
  font-size: 20px;
  color: #667EEA;
}

.feature-tag span {
  font-size: 11px;
  color: #666;
}

/* 分类导航 */
.category-nav {
  display: flex;
  gap: 12px;
  padding: 0 16px 16px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-nav::-webkit-scrollbar {
  display: none;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  min-width: 60px;
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  transition: transform 0.3s;
}

.category-item.active .category-icon {
  transform: scale(1.1);
}

.category-name {
  font-size: 12px;
  color: #666;
  transition: color 0.3s;
}

.category-item.active .category-name {
  color: #667EEA;
  font-weight: 600;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.filter-left {
  display: flex;
  gap: 20px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.filter-item.active {
  color: #667EEA;
  font-weight: 600;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:active {
  transform: scale(0.98);
}

.product-image {
  width: 100%;
  height: 180px;
  position: relative;
}

.product-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  color: white;
  font-weight: 500;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #FF4D4F;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.product-info {
  padding: 12px;
}

.product-brand {
  font-size: 11px;
  color: #999;
  margin-bottom: 4px;
}

.product-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-origin {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
  margin-bottom: 8px;
}

.product-origin .anticon {
  font-size: 11px;
}

.product-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 6px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #FF4D4F;
}

.original-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
}

.product-sales {
  font-size: 11px;
  color: #999;
}

.product-points {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #FFF7E6;
  border-radius: 4px;
  font-size: 11px;
  color: #FAAD14;
}

.product-points .anticon {
  font-size: 11px;
}

/* 筛选弹窗 */
.filter-modal-content {
  padding: 8px 0;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-option {
  padding: 8px 16px;
  background: #F5F5F5;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-option.active {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.filter-actions button {
  flex: 1;
}
</style>

