<template>
  <div class="heritage-brands-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <LeftOutlined class="back-icon" @click="$router.back()" />
      <span class="title">老字号</span>
      <SearchOutlined class="search-icon" @click="handleSearch" />
    </div>

    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <h2>中华老字号</h2>
        <p>传承百年匠心，品味经典国货</p>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <div 
        v-for="category in categories" 
        :key="category.id"
        :class="['category-tab', { active: currentCategory === category.id }]"
        @click="currentCategory = category.id"
      >
        {{ category.name }}
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="products-section">
      <div class="section-header">
        <span class="section-title">精选好物</span>
        <span class="product-count">共 {{ filteredProducts.length }} 件商品</span>
      </div>

      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card"
          @click="goToProduct(product.id)"
        >
          <div class="product-image" :style="{ background: product.color }">
            <div v-if="product.tag" class="product-tag">{{ product.tag }}</div>
          </div>
          <div class="product-info">
            <div class="brand-name">{{ product.brand }}</div>
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-desc">{{ product.desc }}</p>
            <div class="product-footer">
              <div class="price-group">
                <span class="points" v-if="product.points">{{ product.points.toLocaleString() }}积分</span>
                <span class="price" v-if="product.price">¥{{ product.price }}</span>
              </div>
              <div class="sales">已售{{ product.sales }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <InboxOutlined class="empty-icon" />
        <p>暂无相关商品</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LeftOutlined, SearchOutlined, InboxOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 分类
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'food', name: '食品' },
  { id: 'tea', name: '茶叶' },
  { id: 'medicine', name: '医药' },
  { id: 'craft', name: '工艺品' },
  { id: 'clothing', name: '服饰' }
])

const currentCategory = ref('all')

// 商品数据
const products = ref([
  {
    id: 1,
    brand: '稻香村',
    name: '京式糕点礼盒',
    desc: '传统手工制作，口感细腻',
    points: 8000,
    price: 128,
    sales: '2.3万',
    category: 'food',
    tag: '热销',
    color: 'linear-gradient(135deg, #FFF5E1 0%, #FFE4B5 100%)'
  },
  {
    id: 2,
    brand: '同仁堂',
    name: '阿胶糕礼盒',
    desc: '滋补养生，精选原料',
    points: 15000,
    price: 298,
    sales: '1.8万',
    category: 'medicine',
    tag: '推荐',
    color: 'linear-gradient(135deg, #FFE4E1 0%, #FFC0CB 100%)'
  },
  {
    id: 3,
    brand: '张小泉',
    name: '精品刀具套装',
    desc: '百年工艺，锋利耐用',
    points: 12000,
    price: 199,
    sales: '1.5万',
    category: 'craft',
    color: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)'
  },
  {
    id: 4,
    brand: '全聚德',
    name: '北京烤鸭礼券',
    desc: '正宗北京烤鸭，到店即用',
    points: 10000,
    price: 168,
    sales: '3.2万',
    category: 'food',
    tag: '热销',
    color: 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)'
  },
  {
    id: 5,
    brand: '吴裕泰',
    name: '茉莉花茶礼盒',
    desc: '清香四溢，回味悠长',
    points: 6000,
    price: 98,
    sales: '2.1万',
    category: 'tea',
    color: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
  },
  {
    id: 6,
    brand: '瑞蚨祥',
    name: '真丝围巾',
    desc: '手工刺绣，典雅大方',
    points: 18000,
    price: 358,
    sales: '8600',
    category: 'clothing',
    tag: '新品',
    color: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)'
  },
  {
    id: 7,
    brand: '王致和',
    name: '腐乳礼盒',
    desc: '传统发酵工艺，风味独特',
    points: 3000,
    price: 48,
    sales: '4.5万',
    category: 'food',
    color: 'linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)'
  },
  {
    id: 8,
    brand: '内联升',
    name: '千层底布鞋',
    desc: '纯手工制作，舒适透气',
    points: 9000,
    price: 158,
    sales: '1.2万',
    category: 'clothing',
    color: 'linear-gradient(135deg, #FFCCBC 0%, #FFAB91 100%)'
  },
  {
    id: 9,
    brand: '六必居',
    name: '酱菜礼盒',
    desc: '传统秘制，开胃下饭',
    points: 4000,
    price: 68,
    sales: '3.8万',
    category: 'food',
    color: 'linear-gradient(135deg, #DCEDC8 0%, #C5E1A5 100%)'
  },
  {
    id: 10,
    brand: '荣宝斋',
    name: '书画用品套装',
    desc: '文房四宝，品质上乘',
    points: 20000,
    price: 388,
    sales: '5200',
    category: 'craft',
    tag: '精品',
    color: 'linear-gradient(135deg, #B3E5FC 0%, #81D4FA 100%)'
  },
  {
    id: 11,
    brand: '马聚源',
    name: '手工毡帽',
    desc: '传统工艺，保暖舒适',
    points: 7000,
    price: 118,
    sales: '9800',
    category: 'clothing',
    color: 'linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 100%)'
  },
  {
    id: 12,
    brand: '龙凤',
    name: '中式糕点礼盒',
    desc: '精致美味，送礼佳品',
    points: 8500,
    price: 138,
    sales: '2.7万',
    category: 'food',
    tag: '热销',
    color: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)'
  }
])

// 筛选商品
const filteredProducts = computed(() => {
  if (currentCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.category === currentCategory.value)
})

// 跳转到商品详情
const goToProduct = (id: number) => {
  router.push(`/product-detail?id=${id}`)
}

// 搜索
const handleSearch = () => {
  router.push('/search')
}
</script>

<style scoped>
.heritage-brands-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-icon,
.search-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
  padding: 4px;
}

.back-icon:active,
.search-icon:active {
  opacity: 0.6;
}

.title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

/* Banner */
.banner {
  background: linear-gradient(135deg, #D32F2F 0%, #C62828 100%);
  padding: 30px 20px;
  color: white;
  text-align: center;
}

.banner-content h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px;
}

.banner-content p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 12px;
  padding: 16px 15px;
  background: white;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  flex-shrink: 0;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.category-tab.active {
  background: #D32F2F;
  color: white;
  font-weight: 600;
}

.category-tab:active {
  transform: scale(0.95);
}

/* 商品区域 */
.products-section {
  padding: 0 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.product-count {
  font-size: 13px;
  color: #999;
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-card:active {
  transform: scale(0.98);
}

.product-image {
  width: 100%;
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #D32F2F;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.product-info {
  padding: 12px;
}

.brand-name {
  font-size: 12px;
  color: #D32F2F;
  font-weight: 600;
  margin-bottom: 4px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 12px;
  color: #999;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.points {
  font-size: 13px;
  font-weight: 600;
  color: #FF6B35;
}

.price {
  font-size: 12px;
  color: #999;
}

.sales {
  font-size: 12px;
  color: #999;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}
</style>

