<template>
  <div class="local-products-page">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="nav-title">苏品苏货</span>
      <SearchOutlined class="search-icon" @click="showSearch" />
    </div>

    <!-- 官方认证头部 -->
    <div class="official-header">
      <div class="official-badge">
        <SafetyCertificateOutlined class="badge-icon" />
        <span>江苏省官方认证</span>
      </div>
      <h1 class="page-title">苏品苏货</h1>
      <p class="page-slogan">江苏好物精选 · 品质官方背书</p>
      
      <!-- 认证说明 -->
      <div class="certification-info">
        <div class="cert-item">
          <CheckCircleOutlined class="cert-icon" />
          <span>省级质量认证</span>
        </div>
        <div class="cert-item">
          <CheckCircleOutlined class="cert-icon" />
          <span>原产地保护</span>
        </div>
        <div class="cert-item">
          <CheckCircleOutlined class="cert-icon" />
          <span>品质溯源</span>
        </div>
      </div>
    </div>

    <!-- 轮播Banner -->
    <div class="banner-section">
      <a-carousel autoplay :dots="{ className: 'custom-dots' }">
        <div v-for="banner in banners" :key="banner.id" class="banner-item">
          <div class="banner-bg" :style="{ background: banner.color }">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.subtitle }}</p>
            </div>
          </div>
        </div>
      </a-carousel>
    </div>

    <!-- 地区分类导航 -->
    <div class="region-nav">
      <div class="nav-header">
        <EnvironmentOutlined class="header-icon" />
        <span class="header-title">按地区选购</span>
      </div>
      <div class="region-scroll">
        <div 
          v-for="region in regions" 
          :key="region.id"
          class="region-item"
          :class="{ active: currentRegion === region.id }"
          @click="selectRegion(region.id)"
        >
          <div class="region-icon">{{ region.icon }}</div>
          <div class="region-name">{{ region.name }}</div>
          <div class="region-count">{{ region.count }}+</div>
        </div>
      </div>
    </div>

    <!-- 品类分类 -->
    <div class="category-tabs">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-tab"
        :class="{ active: currentCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <component :is="category.icon" class="category-icon" />
        <span class="category-name">{{ category.name }}</span>
      </div>
    </div>

    <!-- 地理标志产品专区 -->
    <div class="geo-products-section" v-if="geoProducts.length > 0">
      <div class="section-header">
        <TrophyOutlined class="section-icon" />
        <span class="section-title">地理标志产品</span>
        <span class="section-badge">国家认证</span>
      </div>
      <div class="geo-products-grid">
        <div 
          v-for="product in geoProducts" 
          :key="product.id"
          class="geo-product-card"
          @click="goToProductDetail(product.id)"
        >
          <div class="geo-badge">
            <span class="badge-icon">🏆</span>
            <span class="badge-text">地理标志</span>
          </div>
          <div class="product-image">
            <div class="image-placeholder" :style="{ background: product.color }"></div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-story">{{ product.story }}</div>
            <div class="origin-tag">
              <EnvironmentOutlined />
              <span>{{ product.origin }}</span>
            </div>
            <div class="certification">
              <SafetyCertificateOutlined />
              <span>质量认证</span>
            </div>
            <div class="product-price">
              <span class="points">{{ product.points }}积分</span>
              <span class="plus">+</span>
              <span class="cash">¥{{ product.cash }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="products-section">
      <div class="section-header">
        <FireOutlined class="section-icon" />
        <span class="section-title">{{ currentSectionTitle }}</span>
        <span class="product-count">共{{ filteredProducts.length}}件商品</span>
      </div>
      
      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card official"
          @click="goToProductDetail(product.id)"
        >
          <div class="official-tag">官方认证</div>
          <div class="product-image">
            <div class="image-placeholder" :style="{ background: product.color }"></div>
            <div v-if="product.hot" class="hot-badge">热销</div>
            <div v-if="product.new" class="new-badge">新品</div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-desc">{{ product.desc }}</div>
            <div class="origin-tag">
              <EnvironmentOutlined />
              <span>{{ product.origin }}</span>
            </div>
            <div class="certification-badge">
              <SafetyCertificateOutlined />
              <span>质量认证</span>
            </div>
            <div class="product-tags">
              <span v-for="tag in product.tags" :key="tag" class="product-tag">{{ tag }}</span>
            </div>
            <div class="product-stats">
              <span class="sales">已售{{ product.sales }}</span>
              <span class="rating">
                <StarFilled />
                {{ product.rating }}
              </span>
            </div>
            <div class="product-price">
              <div class="price-main">
                <span class="points">{{ product.points }}积分</span>
                <span class="plus">+</span>
                <span class="cash">¥{{ product.cash }}</span>
              </div>
              <div class="original-price">¥{{ product.originalPrice }}</div>
            </div>
          </div>
          <div class="product-actions">
            <a-button type="primary" size="small" @click.stop="quickBuy(product.id)">
              立即兑换
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 品牌故事 -->
    <div class="brand-story-section">
      <div class="section-header">
        <HeartOutlined class="section-icon" />
        <span class="section-title">品牌故事</span>
      </div>
      <div class="story-content">
        <p>苏品苏货，传承江苏千年文化底蕴,汇聚本地优质特色商品。我们致力于挖掘和推广江苏地区的传统工艺、特色美食和文创产品,让更多人了解和喜爱江苏的文化瑰宝。</p>
        <p>每一件商品都经过<strong>江苏省官方严格筛选和质量认证</strong>,确保品质上乘,让您在享受购物乐趣的同时,感受江苏文化的独特魅力。</p>
      </div>
      <div class="story-tags">
        <span class="tag">官方背书</span>
        <span class="tag">品质保证</span>
        <span class="tag">原产地保护</span>
        <span class="tag">文化传承</span>
      </div>
    </div>
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
  CheckCircleOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  FireOutlined,
  StarFilled,
  HeartOutlined,
  CoffeeOutlined,
  GiftOutlined,
  PictureOutlined,
  ShopOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 轮播Banner
const banners = ref([
  {
    id: 1,
    title: '江苏特产 官方认证',
    subtitle: '省级质量认证 品质有保障',
    color: 'linear-gradient(135deg, #1890FF 0%, #096DD9 100%)'
  },
  {
    id: 2,
    title: '地理标志产品',
    subtitle: '原产地保护 正宗好货',
    color: 'linear-gradient(135deg, #FAAD14 0%, #FA8C16 100%)'
  },
  {
    id: 3,
    title: '品质溯源',
    subtitle: '每件商品都可追溯',
    color: 'linear-gradient(135deg, #52C41A 0%, #389E0D 100%)'
  }
])

// 地区分类
const regions = ref([
  { id: 'all', name: '全部', icon: '🏛️', count: 120 },
  { id: 'nanjing', name: '南京', icon: '🏯', count: 28 },
  { id: 'suzhou', name: '苏州', icon: '🌸', count: 32 },
  { id: 'wuxi', name: '无锡', icon: '🌊', count: 18 },
  { id: 'changzhou', name: '常州', icon: '🐉', count: 15 },
  { id: 'yangzhou', name: '扬州', icon: '🌙', count: 22 },
  { id: 'zhenjiang', name: '镇江', icon: '🍶', count: 12 },
  { id: 'nantong', name: '南通', icon: '⚓', count: 14 },
  { id: 'yancheng', name: '盐城', icon: '🦢', count: 10 },
  { id: 'huaian', name: '淮安', icon: '🚢', count: 11 },
  { id: 'xuzhou', name: '徐州', icon: '🏺', count: 16 },
  { id: 'lianyungang', name: '连云港', icon: '🏔️', count: 9 },
  { id: 'suqian', name: '宿迁', icon: '🍷', count: 8 },
  { id: 'taizhou', name: '泰州', icon: '🎋', count: 13 }
])

const currentRegion = ref('all')

// 品类分类
const categories = ref([
  { id: 'all', name: '全部', icon: FireOutlined },
  { id: 'food', name: '特产美食', icon: CoffeeOutlined },
  { id: 'craft', name: '手工艺品', icon: GiftOutlined },
  { id: 'creative', name: '文创产品', icon: PictureOutlined },
  { id: 'famous', name: '地方名品', icon: ShopOutlined }
])

const currentCategory = ref('all')

// 地理标志产品
const geoProducts = ref([
  {
    id: 101,
    name: '阳澄湖大闸蟹',
    story: '中国国家地理标志产品,蟹中极品',
    origin: '苏州',
    points: 3000,
    cash: 299,
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    isGeo: true
  },
  {
    id: 102,
    name: '洪泽湖大米',
    story: '国家地理标志,生态种植粒粒香',
    origin: '淮安',
    points: 800,
    cash: 69,
    color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    isGeo: true
  },
  {
    id: 103,
    name: '宜兴紫砂壶',
    story: '国家地理标志,名家制作收藏佳品',
    origin: '无锡',
    points: 8000,
    cash: 799,
    color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    isGeo: true
  }
])

// 商品列表
const products = ref([
  {
    id: 1,
    name: '南京盐水鸭',
    desc: '传统工艺 皮白肉嫩',
    origin: '南京',
    region: 'nanjing',
    category: 'food',
    points: 500,
    cash: 29.9,
    originalPrice: 59.8,
    sales: 1580,
    rating: 4.9,
    hot: true,
    new: false,
    tags: ['特产', '美食'],
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '苏州刺绣',
    desc: '非遗传承 精美绝伦',
    origin: '苏州',
    region: 'suzhou',
    category: 'craft',
    points: 2000,
    cash: 199,
    originalPrice: 398,
    sales: 856,
    rating: 5.0,
    hot: true,
    new: false,
    tags: ['手工', '非遗'],
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    name: '扬州漆器',
    desc: '千年工艺 匠心之作',
    origin: '扬州',
    region: 'yangzhou',
    category: 'craft',
    points: 1500,
    cash: 149,
    originalPrice: 298,
    sales: 623,
    rating: 4.8,
    hot: false,
    new: true,
    tags: ['工艺品', '收藏'],
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    name: '无锡惠山泥人',
    desc: '民间艺术 栩栩如生',
    origin: '无锡',
    region: 'wuxi',
    category: 'craft',
    points: 800,
    cash: 79,
    originalPrice: 158,
    sales: 945,
    rating: 4.7,
    hot: false,
    new: false,
    tags: ['泥塑', '民俗'],
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 5,
    name: '镇江香醋',
    desc: '色香味俱全 醇厚甘美',
    origin: '镇江',
    region: 'zhenjiang',
    category: 'food',
    points: 300,
    cash: 19.9,
    originalPrice: 39.8,
    sales: 2156,
    rating: 4.9,
    hot: true,
    new: false,
    tags: ['调味品', '特产'],
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  },
  {
    id: 6,
    name: '南京云锦',
    desc: '皇家御用 华贵典雅',
    origin: '南京',
    region: 'nanjing',
    category: 'craft',
    points: 5000,
    cash: 499,
    originalPrice: 998,
    sales: 456,
    rating: 5.0,
    hot: false,
    new: false,
    tags: ['丝绸', '非遗'],
    color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  {
    id: 7,
    name: '苏州园林文创',
    desc: '园林元素 创意设计',
    origin: '苏州',
    region: 'suzhou',
    category: 'creative',
    points: 600,
    cash: 49,
    originalPrice: 98,
    sales: 1678,
    rating: 4.8,
    hot: false,
    new: true,
    tags: ['文创', '纪念品'],
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    id: 8,
    name: '常州梳篦',
    desc: '宫廷御用 精雕细琢',
    origin: '常州',
    region: 'changzhou',
    category: 'craft',
    points: 400,
    cash: 39,
    originalPrice: 78,
    sales: 789,
    rating: 4.6,
    hot: false,
    new: false,
    tags: ['工艺品', '实用'],
    color: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
  },
  {
    id: 9,
    name: '金陵折扇',
    desc: '书画结合 雅致精美',
    origin: '南京',
    region: 'nanjing',
    category: 'creative',
    points: 1200,
    cash: 99,
    originalPrice: 198,
    sales: 567,
    rating: 4.8,
    hot: false,
    new: false,
    tags: ['文创', '书画'],
    color: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)'
  },
  {
    id: 10,
    name: '扬州三把刀',
    desc: '厨刀、修脚刀、理发刀',
    origin: '扬州',
    region: 'yangzhou',
    category: 'famous',
    points: 900,
    cash: 89,
    originalPrice: 178,
    sales: 1234,
    rating: 4.9,
    hot: true,
    new: false,
    tags: ['工具', '传统'],
    color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
  },
  {
    id: 11,
    name: '南通蓝印花布',
    desc: '民间印染工艺 古朴典雅',
    origin: '南通',
    region: 'nantong',
    category: 'craft',
    points: 700,
    cash: 68,
    originalPrice: 136,
    sales: 892,
    rating: 4.7,
    hot: false,
    new: true,
    tags: ['纺织', '非遗'],
    color: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)'
  },
  {
    id: 12,
    name: '徐州地锅鸡调料',
    desc: '正宗徐州味道 香辣可口',
    origin: '徐州',
    region: 'xuzhou',
    category: 'food',
    points: 200,
    cash: 15.9,
    originalPrice: 31.8,
    sales: 3456,
    rating: 4.8,
    hot: true,
    new: false,
    tags: ['调料', '特色'],
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
])

// 筛选商品
const filteredProducts = computed(() => {
  let result = products.value
  
  // 按地区筛选
  if (currentRegion.value !== 'all') {
    result = result.filter(p => p.region === currentRegion.value)
  }
  
  // 按品类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(p => p.category === currentCategory.value)
  }
  
  return result
})

// 当前版块标题
const currentSectionTitle = computed(() => {
  const regionName = regions.value.find(r => r.id === currentRegion.value)?.name || '全部'
  const categoryName = categories.value.find(c => c.id === currentCategory.value)?.name || '全部'
  
  if (currentRegion.value === 'all' && currentCategory.value === 'all') {
    return '全部商品'
  } else if (currentRegion.value !== 'all' && currentCategory.value === 'all') {
    return `${regionName}特产`
  } else if (currentRegion.value === 'all' && currentCategory.value !== 'all') {
    return categoryName
  } else {
    return `${regionName} · ${categoryName}`
  }
})

// 方法
const goBack = () => {
  router.back()
}

const showSearch = () => {
  message.info('搜索功能开发中')
}

const selectRegion = (regionId: string) => {
  currentRegion.value = regionId
}

const selectCategory = (categoryId: string) => {
  currentCategory.value = categoryId
}

const goToProductDetail = (productId: number) => {
  router.push(`/product-detail?id=${productId}`)
}

const quickBuy = (productId: number) => {
  message.success('已加入购物车')
}
</script>

<style scoped>
.local-products-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: linear-gradient(135deg, #1890FF 0%, #096DD9 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.back-icon,
.search-icon {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.back-icon:hover,
.search-icon:hover {
  transform: scale(1.1);
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
}

/* 官方认证头部 */
.official-header {
  background: linear-gradient(135deg, #1890FF 0%, #096DD9 100%);
  padding: 20px 15px 30px;
  color: white;
  text-align: center;
}

.official-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.badge-icon {
  font-size: 14px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  margin: 10px 0;
  color: white;
}

.page-slogan {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.certification-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.15);
  padding: 5px 10px;
  border-radius: 15px;
}

.cert-icon {
  font-size: 14px;
  color: #FAAD14;
}

/* 轮播Banner */
.banner-section {
  margin: -15px 15px 15px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.banner-item {
  height: 150px;
}

.banner-bg {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.banner-content {
  text-align: center;
  color: white;
}

.banner-content h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 8px;
  color: white;
}

.banner-content p {
  font-size: 13px;
  margin: 0;
  opacity: 0.9;
}

/* 地区导航 */
.region-nav {
  background: white;
  padding: 15px;
  margin: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.nav-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.header-icon {
  font-size: 18px;
  color: #1890FF;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.region-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.region-scroll::-webkit-scrollbar {
  height: 4px;
}

.region-scroll::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

.region-item {
  flex-shrink: 0;
  text-align: center;
  padding: 10px 15px;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.region-item.active {
  background: linear-gradient(135deg, #1890FF 0%, #096DD9 100%);
  color: white;
  border-color: #1890FF;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
}

.region-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.region-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 3px;
}

.region-count {
  font-size: 11px;
  opacity: 0.7;
}

.region-item.active .region-count {
  opacity: 0.9;
}

/* 品类分类 */
.category-tabs {
  display: flex;
  gap: 10px;
  padding: 0 15px 15px;
  overflow-x: auto;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #d9d9d9;
}

.category-tab.active {
  background: linear-gradient(135deg, #FAAD14 0%, #FA8C16 100%);
  color: white;
  border-color: #FAAD14;
  box-shadow: 0 2px 8px rgba(250, 173, 20, 0.3);
}

.category-icon {
  font-size: 16px;
}

.category-name {
  font-size: 13px;
  font-weight: 500;
}

/* 地理标志产品专区 */
.geo-products-section {
  background: white;
  padding: 15px;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.section-icon {
  font-size: 18px;
  color: #FAAD14;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.section-badge {
  font-size: 11px;
  padding: 3px 8px;
  background: linear-gradient(135deg, #FAAD14 0%, #FA8C16 100%);
  color: white;
  border-radius: 10px;
}

.geo-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.geo-product-card {
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  border: 2px solid #FAAD14;
}

.geo-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(250, 173, 20, 0.3);
}

.geo-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #FAAD14 0%, #FA8C16 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 3px;
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.badge-icon {
  font-size: 12px;
}

.badge-text {
  font-weight: 500;
}

/* 商品列表 */
.products-section {
  background: white;
  padding: 15px;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-count {
  font-size: 12px;
  color: #999;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.product-card {
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.product-card.official {
  border: 1px solid #1890FF;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.official-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #1890FF 0%, #096DD9 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 3px;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
}

.product-image {
  position: relative;
  height: 160px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
}

.hot-badge,
.new-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  color: white;
}

.hot-badge {
  background: linear-gradient(135deg, #FF4D4F 0%, #CF1322 100%);
}

.new-badge {
  background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-story {
  font-size: 11px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.origin-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #1890FF;
  background: #E6F7FF;
  padding: 3px 8px;
  border-radius: 10px;
  margin-bottom: 5px;
}

.certification,
.certification-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  color: #FAAD14;
  background: #FFFBE6;
  padding: 3px 8px;
  border-radius: 10px;
  margin-bottom: 8px;
  margin-left: 5px;
}

.product-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.product-tag {
  font-size: 10px;
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 8px;
  color: #666;
}

.product-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 11px;
  color: #999;
}

.rating {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #FAAD14;
}

.product-price {
  margin-bottom: 10px;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-bottom: 3px;
}

.points {
  font-size: 16px;
  font-weight: bold;
  color: #FF4D4F;
}

.plus {
  font-size: 12px;
  color: #999;
}

.cash {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.original-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
}

.product-actions {
  padding: 0 12px 12px;
}

.product-actions button {
  width: 100%;
  border-radius: 20px;
  background: linear-gradient(135deg, #1890FF 0%, #096DD9 100%);
  border: none;
  font-weight: 500;
}

/* 品牌故事 */
.brand-story-section {
  background: white;
  padding: 20px 15px;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.story-content {
  font-size: 13px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 15px;
}

.story-content p {
  margin-bottom: 10px;
}

.story-content strong {
  color: #1890FF;
  font-weight: 600;
}

.story-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  background: linear-gradient(135deg, #E6F7FF 0%, #BAE7FF 100%);
  color: #1890FF;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #91D5FF;
}

/* 自定义轮播点 */
:deep(.custom-dots) {
  bottom: 10px;
}

:deep(.custom-dots li button) {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

:deep(.custom-dots li.slick-active button) {
  background: white;
}
</style>

