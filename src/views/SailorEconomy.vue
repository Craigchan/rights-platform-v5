<template>
  <div class="sailor-economy-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <LeftOutlined @click="goBack" />
      <span class="title">海员经济</span>
      <ShareAltOutlined @click="handleShare" />
    </div>

    <!-- 海洋主题横幅 -->
    <div class="ocean-banner">
      <div class="ocean-waves">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
      </div>
      <div class="banner-content">
        <h2>扬帆起航 · 海员专属</h2>
        <p>为海员群体提供优质商品与专属服务</p>
      </div>
    </div>

    <!-- 海员认证卡片 -->
    <div class="sailor-auth-card">
      <div class="auth-left">
        <div class="auth-icon">
          <SafetyCertificateOutlined />
        </div>
        <div class="auth-info">
          <div class="auth-title">海员身份认证</div>
          <div class="auth-desc">认证后享受专属优惠</div>
        </div>
      </div>
      <a-button type="primary" size="small" @click="goToAuth">
        {{ isAuthenticated ? '已认证' : '去认证' }}
      </a-button>
    </div>

    <!-- 特色服务 -->
    <div class="feature-services">
      <div class="section-title">
        <span>特色服务</span>
      </div>
      <div class="service-grid">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="service-card"
          @click="handleService(service)"
        >
          <div class="service-icon" :style="{ background: service.color }">
            <component :is="service.icon" />
          </div>
          <div class="service-name">{{ service.name }}</div>
          <div class="service-desc">{{ service.desc }}</div>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-item"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
      </div>
    </div>

    <!-- 海员专供商品 -->
    <div v-if="currentTab === 'products'" class="content-section">
      <div class="product-list">
        <div 
          v-for="product in products" 
          :key="product.id"
          class="product-card"
          @click="viewProduct(product)"
        >
          <div class="product-image" :style="{ background: product.color }">
            <div v-if="product.tag" class="product-tag">{{ product.tag }}</div>
            <div v-if="product.sailorOnly" class="sailor-badge">海员专享</div>
          </div>
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-desc">{{ product.desc }}</div>
            <div class="product-footer">
              <div class="product-price">
                <span class="sailor-price">海员价 ¥{{ product.sailorPrice }}</span>
                <span class="normal-price">原价 ¥{{ product.normalPrice }}</span>
              </div>
              <div class="product-discount">
                省¥{{ product.normalPrice - product.sailorPrice }}
              </div>
            </div>
            <div class="product-points">
              <TrophyOutlined />
              <span>购买可获{{ product.points }}积分</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 海员故事 -->
    <div v-if="currentTab === 'stories'" class="content-section">
      <div class="story-list">
        <div 
          v-for="story in stories" 
          :key="story.id"
          class="story-card"
          @click="viewStory(story)"
        >
          <div class="story-image" :style="{ background: story.color }"></div>
          <div class="story-content">
            <div class="story-title">{{ story.title }}</div>
            <div class="story-excerpt">{{ story.excerpt }}</div>
            <div class="story-meta">
              <div class="story-author">
                <UserOutlined />
                <span>{{ story.author }}</span>
              </div>
              <div class="story-time">
                <ClockCircleOutlined />
                <span>{{ story.time }}</span>
              </div>
            </div>
            <div class="story-stats">
              <div class="stat-item">
                <EyeOutlined />
                <span>{{ story.views }}</span>
              </div>
              <div class="stat-item">
                <HeartOutlined />
                <span>{{ story.likes }}</span>
              </div>
              <div class="stat-item">
                <MessageOutlined />
                <span>{{ story.comments }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 航运资讯 -->
    <div v-if="currentTab === 'news'" class="content-section">
      <div class="news-list">
        <div 
          v-for="news in newsList" 
          :key="news.id"
          class="news-card"
          @click="viewNews(news)"
        >
          <div class="news-content">
            <div class="news-title">{{ news.title }}</div>
            <div class="news-summary">{{ news.summary }}</div>
            <div class="news-meta">
              <span class="news-source">{{ news.source }}</span>
              <span class="news-time">{{ news.time }}</span>
            </div>
          </div>
          <div class="news-image" :style="{ background: news.color }"></div>
        </div>
      </div>
    </div>

    <!-- 社区互动 -->
    <div v-if="currentTab === 'community'" class="content-section">
      <div class="community-header">
        <a-button type="primary" @click="showPostModal = true">
          <PlusOutlined />
          发布动态
        </a-button>
      </div>

      <div class="post-list">
        <div 
          v-for="post in posts" 
          :key="post.id"
          class="post-card"
        >
          <div class="post-header">
            <div class="post-user">
              <div class="user-avatar" :style="{ background: post.avatarColor }">
                {{ post.author[0] }}
              </div>
              <div class="user-info">
                <div class="user-name">{{ post.author }}</div>
                <div class="post-time">{{ post.time }}</div>
              </div>
            </div>
          </div>
          <div class="post-content">{{ post.content }}</div>
          <div v-if="post.images && post.images.length > 0" class="post-images">
            <div 
              v-for="(img, index) in post.images" 
              :key="index"
              class="post-image"
              :style="{ background: img }"
            ></div>
          </div>
          <div class="post-actions">
            <div class="action-item" @click="likePost(post)">
              <HeartOutlined :class="{ liked: post.isLiked }" />
              <span>{{ post.likes }}</span>
            </div>
            <div class="action-item" @click="commentPost(post)">
              <MessageOutlined />
              <span>{{ post.comments }}</span>
            </div>
            <div class="action-item" @click="sharePost(post)">
              <ShareAltOutlined />
              <span>分享</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布动态弹窗 -->
    <a-modal
      v-model:open="showPostModal"
      title="发布动态"
      :footer="null"
      width="90%"
    >
      <div class="post-modal-content">
        <a-textarea 
          v-model:value="postContent" 
          placeholder="分享你的海上故事..."
          :rows="6"
        />
        <div class="post-actions-bar">
          <a-button @click="showPostModal = false">取消</a-button>
          <a-button type="primary" @click="submitPost">发布</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  ShareAltOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  BookOutlined,
  TrophyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 海员认证状态
const isAuthenticated = ref(true)

// 特色服务
const services = ref([
  {
    id: 1,
    name: '海员专供',
    desc: '专属优惠商品',
    icon: ShoppingOutlined,
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  {
    id: 2,
    name: '在线咨询',
    desc: '24小时服务',
    icon: CustomerServiceOutlined,
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
  },
  {
    id: 3,
    name: '海员社区',
    desc: '交流互动',
    icon: TeamOutlined,
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
  },
  {
    id: 4,
    name: '航运资讯',
    desc: '行业动态',
    icon: BookOutlined,
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
  }
])

// Tab 配置
const tabs = ref([
  { id: 'products', name: '海员专供' },
  { id: 'stories', name: '海员故事' },
  { id: 'news', name: '航运资讯' },
  { id: 'community', name: '社区互动' }
])

const currentTab = ref('products')

// 海员专供商品
const products = ref([
  {
    id: 1,
    name: '航海工具套装',
    desc: '专业航海必备工具',
    sailorPrice: 299,
    normalPrice: 499,
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    tag: '热销',
    sailorOnly: true,
    points: 150
  },
  {
    id: 2,
    name: '防水工作服',
    desc: '高品质防水透气',
    sailorPrice: 199,
    normalPrice: 399,
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    tag: '新品',
    sailorOnly: true,
    points: 100
  },
  {
    id: 3,
    name: '航海日志本',
    desc: '记录海上生活',
    sailorPrice: 49,
    normalPrice: 99,
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    tag: '',
    sailorOnly: true,
    points: 25
  },
  {
    id: 4,
    name: '专业望远镜',
    desc: '高清夜视功能',
    sailorPrice: 599,
    normalPrice: 999,
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    tag: '推荐',
    sailorOnly: true,
    points: 300
  },
  {
    id: 5,
    name: '航海手表',
    desc: '防水防震设计',
    sailorPrice: 799,
    normalPrice: 1299,
    color: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    tag: '热销',
    sailorOnly: true,
    points: 400
  },
  {
    id: 6,
    name: '海员礼包',
    desc: '精选生活用品',
    sailorPrice: 159,
    normalPrice: 299,
    color: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    tag: '',
    sailorOnly: true,
    points: 80
  }
])

// 海员故事
const stories = ref([
  {
    id: 1,
    title: '我的第一次远航',
    excerpt: '那是一个阳光明媚的早晨，我第一次踏上了远洋货轮...',
    author: '张船长',
    time: '2天前',
    views: 1234,
    likes: 89,
    comments: 23,
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  {
    id: 2,
    title: '穿越太平洋的日子',
    excerpt: '在茫茫大海上，每一天都是新的挑战和收获...',
    author: '李水手',
    time: '5天前',
    views: 2345,
    likes: 156,
    comments: 45,
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
  },
  {
    id: 3,
    title: '海上的星空',
    excerpt: '远离城市的喧嚣，在海上看到的星空格外璀璨...',
    author: '王大副',
    time: '1周前',
    views: 3456,
    likes: 234,
    comments: 67,
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
  },
  {
    id: 4,
    title: '风暴中的坚守',
    excerpt: '那次遭遇的风暴让我终生难忘，但我们团结一心...',
    author: '陈轮机长',
    time: '2周前',
    views: 4567,
    likes: 345,
    comments: 89,
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
  }
])

// 航运资讯
const newsList = ref([
  {
    id: 1,
    title: '国际航运市场回暖，运价持续上涨',
    summary: '据最新数据显示，国际航运市场呈现回暖趋势，主要航线运价持续上涨...',
    source: '航运新闻',
    time: '1小时前',
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  {
    id: 2,
    title: '新型环保船舶技术获得突破',
    summary: '我国自主研发的新型环保船舶技术取得重大突破，将大幅降低碳排放...',
    source: '科技日报',
    time: '3小时前',
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)'
  },
  {
    id: 3,
    title: '海员权益保障新政策出台',
    summary: '交通运输部发布海员权益保障新政策，进一步提升海员福利待遇...',
    source: '政策解读',
    time: '5小时前',
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
  },
  {
    id: 4,
    title: '全球港口智能化建设加速',
    summary: '随着5G、AI等技术的应用，全球主要港口智能化建设步伐加快...',
    source: '港口周刊',
    time: '1天前',
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)'
  }
])

// 社区动态
const posts = ref([
  {
    id: 1,
    author: '老船长',
    avatarColor: '#667EEA',
    time: '2小时前',
    content: '今天终于靠港了，看到陆地的感觉真好！分享几张港口的照片给大家。',
    images: [
      'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
      'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
    ],
    likes: 45,
    comments: 12,
    isLiked: false
  },
  {
    id: 2,
    author: '小水手',
    avatarColor: '#F093FB',
    time: '5小时前',
    content: '第一次出海，既兴奋又紧张。感谢前辈们的照顾！',
    images: [],
    likes: 23,
    comments: 8,
    isLiked: false
  },
  {
    id: 3,
    author: '大副',
    avatarColor: '#4FACFE',
    time: '1天前',
    content: '海上的日落永远看不腻，每次都有不同的美。',
    images: [
      'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
    ],
    likes: 67,
    comments: 15,
    isLiked: true
  }
])

// 发布动态
const showPostModal = ref(false)
const postContent = ref('')

// 方法
const goBack = () => {
  router.back()
}

const handleShare = () => {
  message.success('分享功能')
}

const goToAuth = () => {
  if (!isAuthenticated.value) {
    message.info('跳转到海员认证页面')
  }
}

const handleService = (service: any) => {
  message.info(`${service.name}功能`)
}

const viewProduct = (product: any) => {
  router.push({
    path: '/product-detail',
    query: { id: product.id }
  })
}

const viewStory = (story: any) => {
  message.info(`查看故事：${story.title}`)
}

const viewNews = (news: any) => {
  message.info(`查看资讯：${news.title}`)
}

const likePost = (post: any) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const commentPost = (post: any) => {
  message.info('评论功能')
}

const sharePost = (post: any) => {
  message.success('分享成功')
}

const submitPost = () => {
  if (!postContent.value.trim()) {
    message.warning('请输入内容')
    return
  }

  posts.value.unshift({
    id: Date.now(),
    author: '我',
    avatarColor: '#43E97B',
    time: '刚刚',
    content: postContent.value,
    images: [],
    likes: 0,
    comments: 0,
    isLiked: false
  })

  showPostModal.value = false
  postContent.value = ''
  message.success('发布成功')
}
</script>

<style scoped>
.sailor-economy-page {
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
  background: linear-gradient(135deg, #0077B6 0%, #023E8A 100%);
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

/* 海洋主题横幅 */
.ocean-banner {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #0077B6 0%, #023E8A 100%);
  overflow: hidden;
}

.ocean-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background-repeat: repeat-x;
  opacity: 0.3;
}

.wave1 {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="%23ffffff"/></svg>');
  animation: wave 10s linear infinite;
}

.wave2 {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".5" fill="%23ffffff"/></svg>');
  animation: wave 15s linear infinite;
}

.wave3 {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".75" fill="%23ffffff"/></svg>');
  animation: wave 20s linear infinite;
}

@keyframes wave {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.banner-content {
  position: relative;
  z-index: 1;
  padding: 40px 24px;
  color: white;
  text-align: center;
}

.banner-content h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.banner-content p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

/* 海员认证卡片 */
.sailor-auth-card {
  margin: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.auth-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0077B6 0%, #023E8A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.auth-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.auth-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.auth-desc {
  font-size: 12px;
  color: #999;
}

/* 特色服务 */
.feature-services {
  margin: 0 16px 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #0077B6;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s;
}

.service-card:active {
  transform: scale(0.95);
}

.service-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.service-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.service-desc {
  font-size: 11px;
  color: #999;
  text-align: center;
}

/* Tab 切换 */
.tabs {
  display: flex;
  background: white;
  margin: 0 16px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-item {
  flex: 1;
  padding: 14px;
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #0077B6;
  font-weight: 600;
  background: linear-gradient(to bottom, #E6F4FA 0%, white 100%);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #0077B6;
  border-radius: 2px 2px 0 0;
}

/* 内容区域 */
.content-section {
  padding: 0 16px;
}

/* 商品列表 */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-card {
  background: white;
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.product-image {
  width: 120px;
  height: 120px;
  position: relative;
  flex-shrink: 0;
}

.product-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 12px;
  background: #FF4D4F;
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.sailor-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgba(0, 119, 182, 0.9);
  color: white;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.product-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.product-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.product-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 8px;
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sailor-price {
  font-size: 18px;
  font-weight: 600;
  color: #0077B6;
}

.normal-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.product-discount {
  padding: 4px 8px;
  background: #FFF7E6;
  color: #FAAD14;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.product-points {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #0077B6;
}

/* 故事列表 */
.story-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.story-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.story-image {
  width: 100%;
  height: 180px;
}

.story-content {
  padding: 16px;
}

.story-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.story-excerpt {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.story-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #999;
}

.story-author,
.story-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.story-stats {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

/* 资讯列表 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.news-content {
  flex: 1;
}

.news-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.news-summary {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}

.news-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #999;
}

.news-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  flex-shrink: 0;
}

/* 社区互动 */
.community-header {
  margin-bottom: 16px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.post-header {
  margin-bottom: 12px;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.post-time {
  font-size: 11px;
  color: #999;
}

.post-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.post-image {
  width: 100%;
  padding-bottom: 100%;
  border-radius: 8px;
}

.post-actions {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.action-item:active {
  color: #0077B6;
}

.action-item .anticon.liked {
  color: #FF4D4F;
}

/* 发布动态弹窗 */
.post-modal-content {
  padding: 8px 0;
}

.post-actions-bar {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.post-actions-bar button {
  flex: 1;
}
</style>

