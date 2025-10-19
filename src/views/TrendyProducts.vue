<template>
  <div class="trendy-products-page">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="nav-title">国货潮品</span>
      <ShareAltOutlined class="share-icon" @click="handleShare" />
    </div>

    <!-- 潮流头部 -->
    <div class="trendy-header">
      <div class="gradient-bg">
        <div class="floating-icons">
          <span class="float-icon" style="animation-delay: 0s;">🔥</span>
          <span class="float-icon" style="animation-delay: 0.5s;">⚡</span>
          <span class="float-icon" style="animation-delay: 1s;">✨</span>
          <span class="float-icon" style="animation-delay: 1.5s;">🎨</span>
        </div>
      </div>
      <div class="header-content">
        <h1 class="page-title trendy">
          <span class="fire-icon">🔥</span>
          国货潮品
          <span class="new-badge">NEW</span>
        </h1>
        <p class="page-slogan">国潮崛起 · 潮流先锋</p>
      </div>
    </div>

    <!-- 热门标签 -->
    <div class="trending-tags-section">
      <div class="tags-header">
        <ThunderboltOutlined class="header-icon" />
        <span class="header-title">热门话题</span>
      </div>
      <div class="trending-tags">
        <div class="tag hot">#国潮崛起</div>
        <div class="tag hot">#设计师联名</div>
        <div class="tag hot">#Z世代最爱</div>
        <div class="tag hot">#限量发售</div>
        <div class="tag">#国货之光</div>
        <div class="tag">#潮流单品</div>
        <div class="tag">#年轻力量</div>
      </div>
    </div>

    <!-- 品类筛选 -->
    <div class="category-filter">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        :class="{ active: currentCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <component :is="category.icon" class="category-icon" />
        <span class="category-name">{{ category.name }}</span>
        <span class="category-badge" v-if="category.hot">HOT</span>
      </div>
    </div>

    <!-- 本周上新 -->
    <div class="new-arrivals-section" v-if="newArrivals.length > 0">
      <div class="section-header">
        <RocketOutlined class="section-icon" />
        <span class="section-title">本周上新</span>
        <span class="section-badge">NEW</span>
      </div>
      <div class="new-arrivals-scroll">
        <div 
          v-for="product in newArrivals" 
          :key="product.id"
          class="new-arrival-card"
          @click="goToProductDetail(product.id)"
        >
          <div class="new-badge-corner">NEW</div>
          <div class="product-image">
            <div class="image-placeholder" :style="{ background: product.color }"></div>
          </div>
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
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
        <span class="section-title">{{ currentCategoryName }}</span>
        <span class="product-count">{{ filteredProducts.length }}件</span>
      </div>
      
      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card trendy"
          @click="goToProductDetail(product.id)"
        >
          <!-- 潮流标签 -->
          <div class="trendy-tags">
            <span class="tag limited" v-if="product.isLimited">限量</span>
            <span class="tag new" v-if="product.isNew">新品</span>
            <span class="tag hot" v-if="product.isHot">🔥热卖</span>
            <span class="tag collab" v-if="product.isCollab">联名</span>
          </div>
          
          <!-- 商品图片 -->
          <div class="product-image">
            <div class="image-placeholder" :style="{ background: product.color }"></div>
          </div>
          
          <!-- 商品信息 -->
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-desc">{{ product.desc }}</div>
            
            <!-- 设计师标签 -->
            <div class="designer-tag" v-if="product.designer">
              <StarOutlined class="designer-icon" />
              <span>{{ product.designer }}</span>
            </div>
            
            <!-- 销量信息 -->
            <div class="sales-info">
              <FireOutlined class="sales-icon" />
              <span>{{ product.sales }}人已购</span>
            </div>
            
            <!-- 买家秀预览 -->
            <div class="buyer-show" v-if="product.buyerPhotos">
              <div class="buyer-photos">
                <div 
                  v-for="(photo, index) in product.buyerPhotos.slice(0, 3)" 
                  :key="index"
                  class="buyer-photo"
                  :style="{ background: photo }"
                ></div>
                <div class="more-photos" v-if="product.buyerPhotos.length > 3">
                  +{{ product.buyerPhotos.length - 3 }}
                </div>
              </div>
              <span class="buyer-text">买家秀</span>
            </div>
            
            <!-- 价格 -->
            <div class="price-section">
              <div class="price-main">
                <span class="points">{{ product.points }}积分</span>
                <span class="plus">+</span>
                <span class="cash">¥{{ product.cash }}</span>
              </div>
              <div class="old-price" v-if="product.oldPrice">¥{{ product.oldPrice }}</div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="product-actions">
            <a-button type="primary" size="small" @click.stop="quickBuy(product.id)">
              立即抢购
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 达人推荐 -->
    <div class="influencer-section">
      <div class="section-header">
        <CrownOutlined class="section-icon" />
        <span class="section-title">达人推荐</span>
      </div>
      <div class="influencer-list">
        <div 
          v-for="item in influencerPicks" 
          :key="item.id"
          class="influencer-card"
          @click="goToProductDetail(item.productId)"
        >
          <div class="influencer-info">
            <div class="influencer-avatar" :style="{ background: item.avatarColor }">
              {{ item.name.substring(0, 1) }}
            </div>
            <div class="influencer-details">
              <div class="influencer-name">{{ item.name }}</div>
              <div class="influencer-title">{{ item.title }}</div>
            </div>
          </div>
          <div class="recommend-text">"{{ item.comment }}"</div>
          <div class="recommend-product">
            <div class="product-thumb" :style="{ background: item.productColor }"></div>
            <div class="product-info-mini">
              <div class="product-name-mini">{{ item.productName }}</div>
              <div class="product-price-mini">
                <span class="points">{{ item.points }}积分</span>
                <span class="plus">+</span>
                <span class="cash">¥{{ item.cash }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 种草清单 -->
    <div class="wishlist-section">
      <div class="section-header">
        <HeartOutlined class="section-icon" />
        <span class="section-title">种草清单</span>
        <span class="section-subtitle">大家都在买</span>
      </div>
      <div class="story-content">
        <p>国货潮品,代表着中国设计的崛起与创新。从传统文化元素的现代演绎,到原创设计的国际认可,国货品牌正在用<strong>品质</strong>和<strong>创意</strong>征服年轻消费者。</p>
        <p>这里汇聚了最具潮流感的国货单品,每一件都是设计师的匠心之作,每一款都承载着国潮文化的自信表达。</p>
      </div>
      <div class="story-tags">
        <span class="tag">国潮崛起</span>
        <span class="tag">原创设计</span>
        <span class="tag">年轻力量</span>
        <span class="tag">文化自信</span>
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
  ShareAltOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  FireOutlined,
  StarOutlined,
  CrownOutlined,
  HeartOutlined,
  ShoppingOutlined,
  SkinOutlined,
  MobileOutlined,
  CoffeeOutlined,
  GiftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 品类分类
const categories = ref([
  { id: 'all', name: '全部', icon: FireOutlined, hot: false },
  { id: 'fashion', name: '服饰', icon: SkinOutlined, hot: true },
  { id: 'digital', name: '数码', icon: MobileOutlined, hot: true },
  { id: 'beauty', name: '美妆', icon: StarOutlined, hot: false },
  { id: 'creative', name: '文创', icon: GiftOutlined, hot: false },
  { id: 'lifestyle', name: '生活', icon: CoffeeOutlined, hot: false }
])

const currentCategory = ref('all')

const currentCategoryName = computed(() => {
  const category = categories.value.find(c => c.id === currentCategory.value)
  return category ? category.name : '全部商品'
})

// 本周上新
const newArrivals = ref([
  {
    id: 201,
    name: '国潮联名卫衣',
    points: 1200,
    cash: 118,
    color: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)'
  },
  {
    id: 202,
    name: '设计师款帆布鞋',
    points: 800,
    cash: 78,
    color: 'linear-gradient(135deg, #A8E6CF 0%, #FFD3B6 100%)'
  },
  {
    id: 203,
    name: '国风手机壳',
    points: 300,
    cash: 28,
    color: 'linear-gradient(135deg, #FFAAA5 0%, #FF8B94 100%)'
  }
])

// 商品列表
const products = ref([
  {
    id: 1,
    name: '国潮联名卫衣',
    desc: '设计师联名款 限量500件',
    category: 'fashion',
    designer: '李宁 × 陈冠希',
    points: 1200,
    cash: 118,
    oldPrice: 236,
    sales: 3456,
    isLimited: true,
    isNew: true,
    isHot: true,
    isCollab: true,
    buyerPhotos: [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ],
    color: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)'
  },
  {
    id: 2,
    name: '回力经典帆布鞋',
    desc: '国货之光 复古新潮',
    category: 'fashion',
    designer: '回力设计团队',
    points: 600,
    cash: 58,
    oldPrice: 116,
    sales: 8923,
    isLimited: false,
    isNew: false,
    isHot: true,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ],
    color: 'linear-gradient(135deg, #A8E6CF 0%, #FFD3B6 100%)'
  },
  {
    id: 3,
    name: '华为FreeBuds Pro',
    desc: '国产旗舰降噪耳机',
    category: 'digital',
    designer: '华为',
    points: 2000,
    cash: 199,
    oldPrice: 398,
    sales: 5678,
    isLimited: false,
    isNew: true,
    isHot: true,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ],
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  {
    id: 4,
    name: '完美日记眼影盘',
    desc: '国货美妆 时尚配色',
    category: 'beauty',
    designer: '完美日记',
    points: 400,
    cash: 38,
    oldPrice: 76,
    sales: 12345,
    isLimited: false,
    isNew: false,
    isHot: true,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
      'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
    ],
    color: 'linear-gradient(135deg, #FFAAA5 0%, #FF8B94 100%)'
  },
  {
    id: 5,
    name: '故宫文创手账本',
    desc: '传统文化 现代设计',
    category: 'creative',
    designer: '故宫文创',
    points: 500,
    cash: 48,
    oldPrice: 96,
    sales: 4567,
    isLimited: true,
    isNew: true,
    isHot: false,
    isCollab: true,
    buyerPhotos: [
      'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
      'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
    ],
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
  },
  {
    id: 6,
    name: '小米智能手环',
    desc: '健康监测 运动追踪',
    category: 'digital',
    designer: '小米',
    points: 300,
    cash: 28,
    oldPrice: 56,
    sales: 23456,
    isLimited: false,
    isNew: false,
    isHot: true,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #fee140 0%, #fa709a 100%)'
    ],
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
  },
  {
    id: 7,
    name: '安踏氢跑鞋',
    desc: '科技跑鞋 轻盈舒适',
    category: 'fashion',
    designer: '安踏',
    points: 1500,
    cash: 148,
    oldPrice: 296,
    sales: 6789,
    isLimited: false,
    isNew: true,
    isHot: true,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ],
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
  },
  {
    id: 8,
    name: '花西子散粉',
    desc: '东方美学 定妆持久',
    category: 'beauty',
    designer: '花西子',
    points: 600,
    cash: 58,
    oldPrice: 116,
    sales: 9876,
    isLimited: false,
    isNew: false,
    isHot: true,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
    ],
    color: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
  },
  {
    id: 9,
    name: '国潮帆布包',
    desc: '原创设计 个性百搭',
    category: 'fashion',
    designer: '独立设计师',
    points: 400,
    cash: 38,
    oldPrice: 76,
    sales: 3456,
    isLimited: true,
    isNew: true,
    isHot: false,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'
    ],
    color: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)'
  },
  {
    id: 10,
    name: '茶颜悦色周边',
    desc: '网红品牌 文创好物',
    category: 'lifestyle',
    designer: '茶颜悦色',
    points: 200,
    cash: 18,
    oldPrice: 36,
    sales: 15678,
    isLimited: false,
    isNew: false,
    isHot: true,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)'
    ],
    color: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)'
  },
  {
    id: 11,
    name: 'OPPO Enco耳机',
    desc: '音质出众 颜值在线',
    category: 'digital',
    designer: 'OPPO',
    points: 1000,
    cash: 98,
    oldPrice: 196,
    sales: 4567,
    isLimited: false,
    isNew: true,
    isHot: false,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)'
    ],
    color: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)'
  },
  {
    id: 12,
    name: '国风手机壳',
    desc: '传统纹样 时尚演绎',
    category: 'creative',
    designer: '独立设计师',
    points: 300,
    cash: 28,
    oldPrice: 56,
    sales: 8901,
    isLimited: true,
    isNew: true,
    isHot: true,
    isCollab: false,
    buyerPhotos: [
      'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      'linear-gradient(135deg, #fee140 0%, #fa709a 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    ],
    color: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)'
  }
])

// 筛选商品
const filteredProducts = computed(() => {
  if (currentCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.category === currentCategory.value)
})

// 达人推荐
const influencerPicks = ref([
  {
    id: 1,
    name: '潮流博主小李',
    title: '时尚达人',
    avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    comment: '这款卫衣设计感超强,上身效果很赞!',
    productId: 1,
    productName: '国潮联名卫衣',
    productColor: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
    points: 1200,
    cash: 118
  },
  {
    id: 2,
    name: '美妆达人小美',
    title: '美妆博主',
    avatarColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    comment: '完美日记的配色太美了,显色度也很好!',
    productId: 4,
    productName: '完美日记眼影盘',
    productColor: 'linear-gradient(135deg, #FFAAA5 0%, #FF8B94 100%)',
    points: 400,
    cash: 38
  }
])

// 方法
const goBack = () => {
  router.back()
}

const handleShare = () => {
  message.info('分享功能开发中')
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
.trendy-products-page {
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
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.back-icon,
.share-icon {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.back-icon:hover,
.share-icon:hover {
  transform: scale(1.1);
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
}

/* 潮流头部 */
.trendy-header {
  position: relative;
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
  padding: 30px 15px;
  color: white;
  overflow: hidden;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.float-icon {
  position: absolute;
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
}

.float-icon:nth-child(1) {
  top: 20%;
  left: 10%;
}

.float-icon:nth-child(2) {
  top: 60%;
  left: 80%;
}

.float-icon:nth-child(3) {
  top: 40%;
  left: 60%;
}

.float-icon:nth-child(4) {
  top: 70%;
  left: 30%;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.header-content {
  position: relative;
  text-align: center;
}

.page-title.trendy {
  font-size: 28px;
  font-weight: bold;
  margin: 10px 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.fire-icon {
  font-size: 32px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.new-badge {
  font-size: 12px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 12px;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.page-slogan {
  font-size: 14px;
  opacity: 0.9;
}

/* 热门标签 */
.trending-tags-section {
  background: white;
  padding: 15px;
  margin: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tags-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.header-icon {
  font-size: 18px;
  color: #FF6B6B;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.trending-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.trending-tags .tag {
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 15px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.trending-tags .tag.hot {
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
  color: white;
  font-weight: 600;
  border-color: #FF6B6B;
  animation: shake 3s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

.trending-tags .tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 品类筛选 */
.category-filter {
  display: flex;
  gap: 10px;
  padding: 0 15px 15px;
  overflow-x: auto;
}

.category-filter::-webkit-scrollbar {
  display: none;
}

.category-item {
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 16px;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #d9d9d9;
}

.category-item.active {
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
  color: white;
  border-color: #FF6B6B;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.category-icon {
  font-size: 16px;
}

.category-name {
  font-size: 13px;
  font-weight: 500;
}

.category-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 10px;
  padding: 2px 5px;
  background: #FF4D4F;
  color: white;
  border-radius: 8px;
  font-weight: bold;
}

/* 本周上新 */
.new-arrivals-section {
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
  color: #FF6B6B;
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
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
  color: white;
  border-radius: 10px;
  font-weight: bold;
}

.new-arrivals-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.new-arrivals-scroll::-webkit-scrollbar {
  height: 4px;
}

.new-arrivals-scroll::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

.new-arrival-card {
  flex-shrink: 0;
  width: 140px;
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  border: 2px solid #52C41A;
}

.new-arrival-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(82, 196, 26, 0.3);
}

.new-badge-corner {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
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

.product-card.trendy {
  border: 2px solid #FF6B6B;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
}

.trendy-tags {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  z-index: 1;
}

.trendy-tags .tag {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.trendy-tags .tag.limited {
  background: linear-gradient(135deg, #FA8C16 0%, #FA541C 100%);
}

.trendy-tags .tag.new {
  background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
}

.trendy-tags .tag.hot {
  background: linear-gradient(135deg, #FF4D4F 0%, #CF1322 100%);
}

.trendy-tags .tag.collab {
  background: linear-gradient(135deg, #722ED1 0%, #531DAB 100%);
}

.product-image {
  position: relative;
  height: 160px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
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

.designer-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #722ED1;
  background: #F9F0FF;
  padding: 3px 8px;
  border-radius: 10px;
  margin-bottom: 5px;
}

.designer-icon {
  font-size: 12px;
}

.sales-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #FF4D4F;
  margin-bottom: 8px;
}

.sales-icon {
  font-size: 12px;
}

.buyer-show {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.buyer-photos {
  display: flex;
  gap: 3px;
}

.buyer-photo {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid white;
}

.more-photos {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.buyer-text {
  font-size: 11px;
  color: #666;
}

.price-section {
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

.old-price {
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
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
  border: none;
  font-weight: 500;
}

/* 达人推荐 */
.influencer-section {
  background: white;
  padding: 15px;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.influencer-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.influencer-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #FAAD14;
}

.influencer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(250, 173, 20, 0.3);
}

.influencer-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.influencer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.influencer-details {
  flex: 1;
}

.influencer-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.influencer-title {
  font-size: 11px;
  color: #999;
}

.recommend-text {
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
  font-style: italic;
}

.recommend-product {
  display: flex;
  gap: 10px;
  background: white;
  padding: 8px;
  border-radius: 8px;
}

.product-thumb {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  flex-shrink: 0;
}

.product-info-mini {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name-mini {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.product-price-mini {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.product-price-mini .points {
  font-size: 14px;
}

.product-price-mini .cash {
  font-size: 12px;
}

/* 种草清单 */
.wishlist-section {
  background: white;
  padding: 20px 15px;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-left: auto;
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
  color: #FF6B6B;
  font-weight: 600;
}

.story-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.story-tags .tag {
  padding: 6px 12px;
  background: linear-gradient(135deg, #FFF1F0 0%, #FFCCC7 100%);
  color: #FF4D4F;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #FFA39E;
}
</style>

