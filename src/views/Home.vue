<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="location" @click="showCityPicker">
        <EnvironmentOutlined />
        <span>{{ currentCity }}</span>
        <DownOutlined class="arrow" />
      </div>
      <div class="search-box" @click="handleSearch">
        <SearchOutlined />
        <span class="placeholder">搜索优惠券、商品</span>
      </div>
      <BellOutlined class="notification-icon" />
    </div>

    <!-- 轮播广告 -->
    <a-carousel autoplay class="banner-carousel">
      <div v-for="(item, index) in banners" :key="index" class="banner-item">
        <div class="banner-content" :style="{ background: item.color }">
          <h3>{{ item.title }}</h3>
          <p>{{ item.subtitle }}</p>
        </div>
      </div>
    </a-carousel>

    <!-- 一键领券横幅 -->
    <div class="quick-collect-banner" @click="showVoucherCenter">
      <div class="banner-left">
        <GiftOutlined class="gift-icon" />
        <div>
          <div class="banner-title">一键领取全部优惠券</div>
          <div class="banner-subtitle">政府券 · 平台券 · 商家券</div>
        </div>
      </div>
      <a-button type="primary" size="small">立即领取</a-button>
    </div>

    <!-- 金刚区 -->
    <div class="function-grid">
      <div 
        v-for="item in functions" 
        :key="item.id"
        class="function-item"
        @click="handleFunctionClick(item)"
      >
        <div class="function-icon" :style="{ background: item.color }">
          <component :is="item.icon" />
        </div>
        <span class="function-name">{{ item.name }}</span>
        <a-badge v-if="item.badge" :count="item.badge" class="function-badge" />
      </div>
    </div>

    <!-- 限时秒杀横幅 -->
    <div class="flash-sale-banner">
      <div class="flash-sale-left">
        <div class="flash-sale-title">
          <ThunderboltFilled class="thunder-icon" />
          限时秒杀
        </div>
        <div class="flash-sale-time">
          距结束 <span class="countdown">{{ countdown }}</span>
        </div>
      </div>
      <div class="flash-sale-products">
        <div v-for="product in flashSaleProducts.slice(0, 3)" :key="product.id" class="flash-product">
          <div class="product-image" :style="{ background: product.color }"></div>
          <div class="product-price">¥{{ product.price }}</div>
        </div>
      </div>
      <a-button type="link" size="small" @click="goToFlashSale">查看更多 ></a-button>
    </div>

    <!-- 特色电商专区 -->
    <div class="special-zones">
      <div class="section-title">
        <span>特色专区</span>
      </div>
      <div class="zone-layout">
        <!-- 左侧大卡片 -->
        <div class="zone-main" :style="{ background: mainZone.color }" @click="goToTrendyProducts">
          <div class="zone-badge">本周主打</div>
          <div class="zone-name">{{ mainZone.name }}</div>
          <div class="zone-desc">{{ mainZone.desc }}</div>
        </div>
        <!-- 右侧双卡片 -->
        <div class="zone-side">
          <div 
            v-for="zone in sideZones" 
            :key="zone.id"
            class="zone-item-small"
            :style="{ background: zone.color }"
          >
            <div class="zone-name">{{ zone.name }}</div>
            <div class="zone-desc">{{ zone.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 政府活动 -->
    <div class="activity-section">
      <div class="section-title">
        <span>政府活动</span>
        <a-button type="link" size="small">更多 ></a-button>
      </div>
      <div class="gov-activity-scroll">
        <div 
          v-for="activity in govActivities" 
          :key="activity.id"
          class="gov-activity-card"
        >
          <div class="gov-activity-image" :style="{ background: activity.color }">
            <div class="activity-tag-badge">{{ activity.tag }}</div>
          </div>
          <div class="gov-activity-content">
            <h4 class="gov-activity-title">{{ activity.title }}</h4>
            <p class="gov-activity-desc">{{ activity.desc }}</p>
            <div class="gov-activity-footer">
              <div class="activity-stats">
                <span class="participants-count">{{ activity.participants }}人参与</span>
                <span class="end-date">至{{ activity.endDate }}</span>
              </div>
              <a-button type="primary" size="small">立即参与</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 精选活动 -->
    <div class="activity-section">
      <div class="section-title">
        <span>精选推荐</span>
        <span class="section-subtitle">基于您的位置和偏好推荐</span>
      </div>
      <!-- Tab导航 -->
      <div class="recommend-tabs">
        <div 
          v-for="tab in recommendTabs" 
          :key="tab.id"
          :class="['recommend-tab', { active: currentRecommendTab === tab.id }]"
          @click="currentRecommendTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>
      <!-- Tab内容 -->
      <div class="featured-waterfall">
        <div 
          v-for="item in currentRecommendItems" 
          :key="item.id"
          class="featured-card"
          @click="handleRecommendItemClick(item)"
        >
          <div class="featured-image" :style="{ background: item.color }">
            <div v-if="item.tag" class="featured-tag">{{ item.tag }}</div>
          </div>
          <div class="featured-content">
            <h4 class="featured-title">{{ item.title }}</h4>
            <p class="featured-subtitle">{{ item.subtitle }}</p>
            <div class="featured-footer">
              <span v-if="item.distance" class="featured-distance">
                <EnvironmentOutlined /> {{ item.distance }}
              </span>
              <span v-if="item.points" class="featured-points">{{ item.points }}积分</span>
              <span v-if="item.price" class="featured-price">¥{{ item.price }}</span>
              <span v-if="item.category" class="featured-category">{{ item.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮抽奖按钮 -->
    <div class="floating-lottery" @click="router.push('/lottery-center')">
      <GiftFilled class="lottery-icon" />
      <span>抽奖</span>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  EnvironmentOutlined,
  DownOutlined,
  SearchOutlined,
  BellOutlined,
  GiftOutlined,
  GiftFilled,
  ThunderboltFilled,
  BankOutlined,
  ShopOutlined,
  CrownOutlined,
  TrophyOutlined,
  StarOutlined,
  HeartOutlined,
  EllipsisOutlined,
  RocketOutlined,
  GlobalOutlined,
  AccountBookOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 当前城市
const currentCity = ref(localStorage.getItem('selectedCityName') || '南京')

// 轮播数据
const banners = ref([
  { title: '积分不浪费 好券随你兑', subtitle: '天天抽红包 周周兑好券', color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' },
  { title: '政府消费券来了', subtitle: '最高领500元消费券', color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' },
  { title: '限时秒杀', subtitle: '全场5折起', color: 'linear-gradient(135deg, #FF4444 0%, #FF8844 100%)' }
])

// 金刚区功能 - 添加票根经济入口
const functions = ref([
  { id: 1, name: '政府补贴', icon: BankOutlined, color: '#FF6B35', path: '/gov-subsidy' },
  { id: 2, name: '消费券', icon: GiftOutlined, color: '#F7931E', path: '/local-vouchers', badge: '12' },
  { id: 3, name: '抽奖中心', icon: TrophyOutlined, color: '#FF006E', path: '/lottery-center', badge: 'HOT' },
  { id: 4, name: '上传票根', icon: GiftFilled, color: '#FFBE0B', path: '/ticket-upload' },
  { id: 5, name: '票根拼图', icon: AppstoreOutlined, color: '#9C27B0', path: '/ticket-puzzle', badge: 'NEW' },
  { id: 6, name: '玩赚积分', icon: StarOutlined, color: '#00A8E8', path: '/earn-points' },
  { id: 7, name: '活动中心', icon: ShopOutlined, color: '#3A86FF', path: '/business-circle' },
  { id: 8, name: '我的会员', icon: CrownOutlined, color: '#8338EC', path: '/membership' },
  { id: 9, name: '苏超专区', icon: TrophyOutlined, color: '#FF4444', path: '/suchao-zone', badge: 'HOT' },
  { id: 10, name: '苏品苏货', icon: HeartOutlined, color: '#52C41A', path: '/local-products' },
  { id: 11, name: '老字号', icon: ShopOutlined, color: '#FA8C16', path: '/heritage-brands' },
  { id: 12, name: '外贸优品', icon: GlobalOutlined, color: '#1890FF', path: '/foreign-trade' },
  { id: 13, name: '海员经济', icon: AccountBookOutlined, color: '#722ED1', path: '/sailor-economy' }
])
const countdown = ref('02:15:30')
let countdownTimer: number | null = null

// 秒杀商品
const flashSaleProducts = ref([
  { id: 1, name: '商品1', price: 9.9, color: '#FF6B35' },
  { id: 2, name: '商品2', price: 19.9, color: '#F7931E' },
  { id: 3, name: '商品3', price: 29.9, color: '#00A8E8' }
])

// Tab配置
const recommendTabs = ref([
  { id: 'hot', name: '热门活动' },
  { id: 'nearby', name: '附近优惠' },
  { id: 'points', name: '积分可兑' },
  { id: 'products', name: '热门商品' }
])

const currentRecommendTab = ref('hot')

// 热门活动数据
const hotActivities = ref([
  { id: 1, title: '德基广场周年庆', subtitle: '全场5折起!', color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', tag: '热门', category: '商场活动' },
  { id: 2, title: '南京欢乐谷嘉年华', subtitle: '门票买一送一', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', tag: '火爆', category: '游乐场' },
  { id: 3, title: '新街口美食节', subtitle: '满100减30', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', tag: '新品', category: '美食' },
  { id: 4, title: '金鹰国际购物节', subtitle: '满200送50券', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', category: '商场活动' },
  { id: 5, title: '夫子庙文化节', subtitle: '免费入场', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', tag: '热门', category: '文化活动' },
  { id: 6, title: '玄武湖音乐节', subtitle: '早鸟票8折', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', category: '音乐活动' },
  { id: 7, title: '水游城周年庆', subtitle: '全场满减', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', tag: '火爆', category: '商场活动' },
  { id: 8, title: '中山陵景区优惠', subtitle: '门票半价', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', category: '景区' },
  { id: 9, title: '老门东美食街', subtitle: '满50减15', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', tag: '新品', category: '美食' },
  { id: 10, title: '南京博物院特展', subtitle: '免费预约', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', category: '文化活动' }
])

// 附近优惠数据
const nearbyOffers = ref([
  { id: 11, title: '海底捞火锅', subtitle: '满200减50元', color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', distance: '500米', tag: '近', category: '美食' },
  { id: 12, title: '星巴克咖啡', subtitle: '第二杯半价', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', distance: '300米', tag: '近', category: '咖啡' },
  { id: 13, title: '必胜客', subtitle: '披萨买一送一', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', distance: '800米', category: '美食' },
  { id: 14, title: '屈臣氏', subtitle: '满100减20', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', distance: '200米', tag: '近', category: '购物' },
  { id: 15, title: '永辉超市', subtitle: '生鲜8折', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', distance: '600米', category: '超市' },
  { id: 16, title: '肯德基', subtitle: '早餐套餐优惠', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', distance: '400米', category: '快餐' },
  { id: 17, title: '麦当劳', subtitle: '儿童套餐特价', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', distance: '700米', category: '快餐' },
  { id: 18, title: '奈雪的茶', subtitle: '新品尝鲜价', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', distance: '350米', tag: '近', category: '茶饮' },
  { id: 19, title: '喜茶', subtitle: '满30减5', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', distance: '550米', category: '茶饮' },
  { id: 20, title: '西贝莜面村', subtitle: '满300减60', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', distance: '900米', category: '美食' },
  { id: 21, title: '海澜之家', subtitle: '全场5折', color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', distance: '450米', category: '服装' },
  { id: 22, title: '优衣库', subtitle: '新品上市', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', distance: '650米', category: '服装' }
])

// 积分可兑数据
const pointsExchange = ref([
  { id: 23, title: '小米手环7', subtitle: '健康监测专家', color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', points: 5000, tag: '热兑', category: '数码' },
  { id: 24, title: '星巴克咖啡券', subtitle: '中杯任意饮品', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', points: 800, category: '餐饮' },
  { id: 25, title: '京东E卡100元', subtitle: '全场通用', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', points: 10000, tag: '热兑', category: '购物' },
  { id: 26, title: '电影票兑换券', subtitle: '全国影院通用', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', points: 1500, category: '娱乐' },
  { id: 27, title: '话费充值50元', subtitle: '三大运营商', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', points: 4800, category: '充值' },
  { id: 28, title: '麦当劳套餐券', subtitle: '巨无霸套餐', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', points: 600, category: '快餐' },
  { id: 29, title: '视频会员月卡', subtitle: '爱奇艺/腾讯', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', points: 1200, tag: '热兑', category: '会员' },
  { id: 30, title: '滴滴出行券', subtitle: '20元无门槛', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', points: 2000, category: '出行' },
  { id: 31, title: '美团外卖红包', subtitle: '满30减10', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', points: 500, category: '外卖' },
  { id: 32, title: '肯德基早餐券', subtitle: '粥+油条', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', points: 400, category: '快餐' },
  { id: 33, title: '屈臣氏优惠券', subtitle: '满100减20', color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', points: 1000, category: '购物' },
  { id: 34, title: '永辉超市券', subtitle: '满200减30', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', points: 1500, category: '超市' }
])

// 热门商品数据
const hotProducts = ref([
  { id: 35, title: '李宁韦德之道10', subtitle: '专业篮球鞋', color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', price: 899, tag: '爆款', category: '运动' },
  { id: 36, title: '花西子雕花口红', subtitle: '国风彩妆', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', price: 219, tag: '热销', category: '美妆' },
  { id: 37, title: '小米Redmi Buds 4 Pro', subtitle: '主动降噪', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', price: 299, tag: '新品', category: '数码' },
  { id: 38, title: '美的空气炸锅5L', subtitle: '无油烹饪', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', price: 399, tag: '爆款', category: '家电' },
  { id: 39, title: '三只松鼠每日坚果', subtitle: '混合坚果大礼包', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', price: 99, tag: '热销', category: '食品' },
  { id: 40, title: '李宁羽毛球拍N99', subtitle: '专业级球拍', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', price: 699, category: '运动' },
  { id: 41, title: '百雀羚水嫩倍现', subtitle: '补水保湿套装', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', price: 159, tag: '经典', category: '美妆' },
  { id: 42, title: '安踏氢跑鞋3.0', subtitle: '轻量化跑鞋', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', price: 599, tag: '新品', category: '运动' },
  { id: 43, title: '完美日记眼影盘', subtitle: '12色大地色', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', price: 89, tag: '爆款', category: '美妆' },
  { id: 44, title: '九阳破壁机', subtitle: '静音破壁', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', price: 799, category: '家电' },
  { id: 45, title: '鸿星尔克运动套装', subtitle: '透气速干', color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', price: 299, tag: '热销', category: '运动' },
  { id: 46, title: '自然堂面膜礼盒', subtitle: '补水美白', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', price: 129, category: '美妆' },
  { id: 47, title: '小米智能手表', subtitle: '健康监测', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', price: 999, tag: '新品', category: '数码' },
  { id: 48, title: '波司登羽绒服', subtitle: '保暖轻薄', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', price: 1299, tag: '爆款', category: '服装' },
  { id: 49, title: '良品铺子零食大礼包', subtitle: '混合零食', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', price: 149, tag: '热销', category: '食品' },
  { id: 50, title: '回力帆布鞋', subtitle: '经典款', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', price: 49, tag: '经典', category: '鞋类' }
])

// 特色专区 - 主推区
const mainZone = ref({
  id: 1,
  name: '国货潮品节',
  desc: '国潮崛起 · 品质生活',
  color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
})

// 特色专区 - 右侧区
const sideZones = ref([
  { id: 2, name: '老字号', desc: '百年传承', color: 'linear-gradient(135deg, #8338EC 0%, #A855F7 100%)' },
  { id: 3, name: '外贸优品', desc: '品质保证', color: 'linear-gradient(135deg, #00A8E8 0%, #0096D6 100%)' }
])

// 政府活动数据
const govActivities = ref([
  {
    id: 1,
    title: '2024家电以旧换新补贴',
    desc: '购买符合条件的家电产品,最高可享1000元政府补贴',
    tag: '政府补贴',
    participants: 15280,
    endDate: '2024-12-31',
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  {
    id: 2,
    title: '南京消费券第三期',
    desc: '满200减50,满500减120,全市通用',
    tag: '消费券',
    participants: 28560,
    endDate: '2024-11-30',
    color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
  },
  {
    id: 3,
    title: '新能源汽车购置补贴',
    desc: '购买新能源汽车可享最高8000元补贴',
    tag: '汽车补贴',
    participants: 5420,
    endDate: '2024-12-31',
    color: 'linear-gradient(135deg, #00A8E8 0%, #0096D6 100%)'
  }
])

// 当前Tab的推荐内容
const currentRecommendItems = ref(hotActivities.value)

// 监听Tab切换
watch(currentRecommendTab, (newTab) => {
  switch (newTab) {
    case 'hot':
      currentRecommendItems.value = hotActivities.value
      break
    case 'nearby':
      currentRecommendItems.value = nearbyOffers.value
      break
    case 'points':
      currentRecommendItems.value = pointsExchange.value
      break
    case 'products':
      currentRecommendItems.value = hotProducts.value
      break
    default:
      currentRecommendItems.value = hotActivities.value
  }
})



// 方法
const showCityPicker = () => {
  router.push('/city-selector')
}

const handleSearch = () => {
  message.info('搜索功能')
}

const showVoucherCenter = () => {
  router.push('/voucher-center')
}

const handleFunctionClick = (item: any) => {
  if (item.path) {
    router.push(item.path)
  } else {
    message.info(`${item.name}功能开发中...`)
  }
}

const goToFlashSale = () => {
  router.push('/flash-sale')
}

const goToTrendyProducts = () => {
  router.push('/trendy-products')
}

// 处理推荐项点击
const handleRecommendItemClick = (item: any) => {
  // 如果是附近优惠tab，跳转到商户详情页
  if (currentRecommendTab.value === 'nearby') {
    router.push(`/merchant-detail/${item.id}`)
  } else if (currentRecommendTab.value === 'points' || currentRecommendTab.value === 'products') {
    // 积分兑换或热门商品，跳转到商品详情页
    router.push(`/product-detail?id=${item.id}`)
  } else {
    // 其他情况，跳转到活动详情页
    router.push(`/activity-detail/${item.id}`)
  }
}

// 倒计时
const startCountdown = () => {
  countdownTimer = window.setInterval(() => {
    const parts = countdown.value.split(':')
    let hours = parseInt(parts[0])
    let minutes = parseInt(parts[1])
    let seconds = parseInt(parts[2])
    
    seconds--
    if (seconds < 0) {
      seconds = 59
      minutes--
    }
    if (minutes < 0) {
      minutes = 59
      hours--
    }
    if (hours < 0) {
      hours = 23
    }
    
    countdown.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.top-bar {
  background: #fff;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.location .arrow {
  font-size: 10px;
}

.search-box {
  flex: 1;
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.search-box .placeholder {
  color: #999;
  font-size: 14px;
}

.notification-icon {
  font-size: 20px;
  cursor: pointer;
}

/* 轮播 */
.banner-carousel {
  margin: 12px 15px;
  border-radius: 12px;
  overflow: hidden;
}

.banner-item {
  height: 160px;
}

.banner-content {
  height: 100%;
  padding: 30px 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner-content h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.banner-content p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

/* 一键领券横幅 */
.quick-collect-banner {
  background: linear-gradient(135deg, #FFE5E5 0%, #FFF5E5 100%);
  margin: 12px 15px;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gift-icon {
  font-size: 32px;
  color: #FF6B35;
}

.banner-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.banner-subtitle {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* 金刚区 */
.function-grid {
  background: #fff;
  margin: 12px 15px;
  padding: 15px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.function-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  transition: transform 0.3s;
}

.function-item:active .function-icon {
  transform: scale(0.95);
}

.function-name {
  font-size: 12px;
  color: #333;
}

.function-badge {
  position: absolute;
  top: -5px;
  right: 10px;
}

/* 限时秒杀 */
.flash-sale-banner {
  background: linear-gradient(135deg, #FF4444 0%, #FF8844 100%);
  margin: 12px 15px;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
}

.flash-sale-left {
  flex-shrink: 0;
}

.flash-sale-title {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.thunder-icon {
  font-size: 20px;
}

.flash-sale-time {
  font-size: 13px;
  opacity: 0.9;
}

.countdown {
  font-weight: bold;
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
}

.flash-sale-products {
  flex: 1;
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.flash-product {
  flex-shrink: 0;
  width: 80px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 6px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

/* 特色专区 */
.special-zones {
  margin: 12px 15px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: bold;
}

/* 左大右双布局 */
.zone-layout {
  display: flex;
  gap: 12px;
  height: 200px;
}

.zone-main {
  flex: 1;
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.zone-main:active {
  transform: scale(0.98);
}

.zone-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.zone-main .zone-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.zone-main .zone-desc {
  font-size: 14px;
  opacity: 0.9;
}

.zone-side {
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.zone-item-small {
  flex: 1;
  border-radius: 12px;
  padding: 15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.zone-item-small:active {
  transform: scale(0.98);
}

.zone-item-small .zone-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.zone-item-small .zone-desc {
  font-size: 12px;
  opacity: 0.9;
}

/* 活动区域 */
.activity-section {
  margin: 12px 15px;
}

/* 政府活动横向滚动 */
.gov-activity-scroll {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.gov-activity-scroll::-webkit-scrollbar {
  display: none;
}

.gov-activity-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  min-width: 280px;
  max-width: 280px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.gov-activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.gov-activity-image {
  width: 100%;
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-tag-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.95);
  color: #FF6B35;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.gov-activity-content {
  padding: 15px;
}

.gov-activity-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gov-activity-desc {
  font-size: 12px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gov-activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.participants-count {
  font-size: 12px;
  color: #FF6B35;
  font-weight: 600;
}

.end-date {
  font-size: 11px;
  color: #999;
}

/* 精选活动瀑布流 */
.section-subtitle {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

/* 推荐Tab */
.recommend-tabs {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  margin-bottom: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.recommend-tabs::-webkit-scrollbar {
  display: none;
}

.recommend-tab {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
  background: #f5f5f5;
  white-space: nowrap;
}

.recommend-tab.active {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
  font-weight: bold;
}

.featured-waterfall {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.featured-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.featured-image {
  width: 100%;
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.featured-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #FF6B35;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.featured-content {
  padding: 12px;
}

.featured-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.featured-subtitle {
  font-size: 12px;
  color: #666;
  margin: 0 0 10px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.featured-points {
  color: #FF6B35;
  font-weight: bold;
  font-size: 13px;
}

.featured-price {
  color: #FF6B35;
  font-weight: bold;
  font-size: 14px;
}

.featured-distance {
  color: #FF6B35;
  display: flex;
  align-items: center;
  gap: 3px;
}

.featured-category {
  background: #f5f5f5;
  color: #666;
  padding: 3px 8px;
  border-radius: 10px;
}

/* 悬浮抽奖按钮 */
.floating-lottery {
  position: fixed;
  right: 20px;
  bottom: calc(33.33vh + 60px);;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
  cursor: pointer;
  z-index: 999;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.lottery-icon {
  font-size: 24px;
}

.floating-lottery span {
  font-size: 12px;
  margin-top: 2px;
}



.prize-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.prize-value {
  font-size: 12px;
  opacity: 0.8;
}
</style>
