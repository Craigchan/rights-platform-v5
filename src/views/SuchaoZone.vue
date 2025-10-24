<template>
  <div class="suchao-zone">
    <!-- 骨架屏加载 -->
    <PageSkeleton v-if="loading" type="product-list" :count="6" />

    <!-- 主内容 -->
    <div v-else>
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <ArrowLeftOutlined class="back-icon" @click="$router.back()" />
      <span class="title">苏超专区</span>
      <ShareAltOutlined class="share-icon" @click="handleShare" />
    </div>

    <!-- 苏超品牌头部 -->
    <div class="suchao-header">
      <div class="brand-banner">
        <div class="brand-logo">
          <TrophyFilled style="font-size: 48px; color: #FFD700;" />
        </div>
        <div class="brand-info">
          <h1 class="brand-name">苏超联赛</h1>
          <p class="brand-slogan">江苏省超级足球联赛</p>
        </div>
      </div>
      
      <!-- 赛事倒计时 -->
      <div class="countdown-card" v-if="nextMatch">
        <div class="countdown-label">距离下场比赛</div>
        <div class="countdown-time">{{ countdown }}</div>
        <div class="match-info">
          <span class="team">{{ nextMatch.homeTeam }}</span>
          <span class="vs">VS</span>
          <span class="team">{{ nextMatch.awayTeam }}</span>
        </div>
        <div class="match-time">{{ nextMatch.time }}</div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <div class="action-item" @click="goToCalendar">
        <div class="action-icon" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);">
          <CalendarOutlined />
        </div>
        <span class="action-name">赛事日历</span>
      </div>
      <div class="action-item" @click="goToTicketUpload">
        <div class="action-icon" style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);">
          <CameraOutlined />
        </div>
        <span class="action-name">上传票根</span>
      </div>
      <div class="action-item" @click="goToShop">
        <div class="action-icon" style="background: linear-gradient(135deg, #00A8E8 0%, #3A86FF 100%);">
          <ShoppingOutlined />
        </div>
        <span class="action-name">商城购物</span>
      </div>
      <div class="action-item" @click="goToConsumerGuide">
        <div class="action-icon" style="background: linear-gradient(135deg, #52C41A 0%, #73D13D 100%);">
          <CompassOutlined />
        </div>
        <span class="action-name">消费指引</span>
      </div>
    </div>

    <!-- 正在进行的赛事 -->
    <div class="section" v-if="liveMatches.length > 0">
      <div class="section-header">
        <h2 class="section-title">
          <PlayCircleOutlined style="margin-right: 8px; color: #FF4444;" />
          正在直播
        </h2>
      </div>
      <div class="match-card live" v-for="match in liveMatches" :key="match.id" @click="goToLive(match)">
        <div class="live-badge">
          <span class="live-dot"></span>
          直播中
        </div>
        <div class="match-teams">
          <div class="team-item">
            <div class="team-logo">{{ match.homeTeam.charAt(0) }}</div>
            <div class="team-name">{{ match.homeTeam }}</div>
            <div class="team-score">{{ match.homeScore }}</div>
          </div>
          <div class="match-status">
            <div class="match-time-live">{{ match.matchTime }}</div>
            <div class="vs-text">VS</div>
          </div>
          <div class="team-item">
            <div class="team-score">{{ match.awayScore }}</div>
            <div class="team-name">{{ match.awayTeam }}</div>
            <div class="team-logo">{{ match.awayTeam.charAt(0) }}</div>
          </div>
        </div>
        <div class="match-info-row">
          <span class="match-venue">
            <EnvironmentOutlined /> {{ match.venue }}
          </span>
          <span class="match-viewers">
            <EyeOutlined /> {{ match.viewers }}人观看
          </span>
        </div>
        <div class="match-actions">
          <a-button type="primary" danger size="small">
            <PlayCircleOutlined /> 观看直播
          </a-button>
          <a-button size="small">第二现场</a-button>
        </div>
      </div>
    </div>

    <!-- 即将开始的赛事 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">
          <ClockCircleOutlined style="margin-right: 8px;" />
          即将开始
        </h2>
        <a-button type="link" size="small" @click="goToCalendar">
          查看全部 <RightOutlined />
        </a-button>
      </div>
      <div class="match-card" v-for="match in upcomingMatches" :key="match.id" @click="goToMatchDetail(match)">
        <div class="match-date">{{ match.date }}</div>
        <div class="match-teams">
          <div class="team-item">
            <div class="team-logo">{{ match.homeTeam.charAt(0) }}</div>
            <div class="team-name">{{ match.homeTeam }}</div>
          </div>
          <div class="match-status">
            <div class="match-time-text">{{ match.time }}</div>
            <div class="vs-text">VS</div>
          </div>
          <div class="team-item">
            <div class="team-name">{{ match.awayTeam }}</div>
            <div class="team-logo">{{ match.awayTeam.charAt(0) }}</div>
          </div>
        </div>
        <div class="match-info-row">
          <span class="match-venue">
            <EnvironmentOutlined /> {{ match.venue }}
          </span>
        </div>
        <div class="match-actions">
          <a-button type="primary" size="small">
            <ShoppingCartOutlined /> 购票
          </a-button>
          <a-button size="small">
            <BellOutlined /> 订阅提醒
          </a-button>
        </div>
      </div>
    </div>

    <!-- 苏超权益 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">
          <GiftOutlined style="margin-right: 8px;" />
          苏超权益
          <a-tag color="red" style="margin-left: 8px;">票根专属</a-tag>
        </h2>
      </div>
      <div class="benefits-grid">
        <div class="benefit-card" v-for="benefit in benefits" :key="benefit.id" @click="goToBenefit(benefit)">
          <div class="benefit-image">
            <img v-img-fallback :src="benefit.image" :alt="benefit.title" />
            <div class="benefit-tag" v-if="benefit.tag">{{ benefit.tag }}</div>
          </div>
          <div class="benefit-content">
            <h3 class="benefit-title">{{ benefit.title }}</h3>
            <p class="benefit-desc">{{ benefit.desc }}</p>
            <div class="benefit-footer">
              <span class="benefit-discount">{{ benefit.discount }}</span>
              <a-button type="primary" size="small">立即领取</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二现场 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">
          <RocketOutlined style="margin-right: 8px;" />
          第二现场
        </h2>
      </div>
      <div class="second-scene-card" @click="goToSecondScene">
        <div class="scene-banner">
          <div class="scene-content">
            <h3 class="scene-title">线上观赛互动</h3>
            <p class="scene-desc">竞猜比分 · 抢红包 · 投票MVP</p>
            <div class="scene-stats">
              <span><UserOutlined /> 12,345人在线</span>
              <span><FireOutlined /> 热度爆表</span>
            </div>
          </div>
          <div class="scene-icon">
            <RocketOutlined style="font-size: 64px; color: rgba(255,255,255,0.3);" />
          </div>
        </div>
      </div>
    </div>

    <!-- 苏超嘉年华 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">
          <StarOutlined style="margin-right: 8px;" />
          苏超嘉年华
        </h2>
      </div>
      <div class="carnival-card" @click="goToCarnival">
        <div class="carnival-banner">
          <div class="carnival-badge">进行中</div>
          <h3 class="carnival-title">2025苏超嘉年华</h3>
          <p class="carnival-time">2025.10.20 - 10.27</p>
          <p class="carnival-location">南京奥体中心</p>
          <div class="carnival-highlights">
            <span class="highlight-item">
              <StarFilled /> 明星见面会
            </span>
            <span class="highlight-item">
              <ShopFilled /> 美食市集
            </span>
            <span class="highlight-item">
              <TrophyFilled /> 互动游戏
            </span>
          </div>
          <a-button type="primary" size="large" block>
            查看详情 <RightOutlined />
          </a-button>
        </div>
      </div>
    </div>

    <!-- 赛事周边商城 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">
          <ShoppingOutlined style="margin-right: 8px;" />
          赛事周边
        </h2>
        <a-button type="link" size="small" @click="goToShop">
          查看更多 <RightOutlined />
        </a-button>
      </div>
      <div class="products-grid">
        <div class="product-card" v-for="product in products" :key="product.id" @click="goToProduct(product)">
          <div class="product-image">
            <img v-lazy-img="product.image" :alt="product.name" />
            <div class="product-badge" v-if="product.badge">{{ product.badge }}</div>
          </div>
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-footer">
            <span class="product-price">¥{{ product.price }}</span>
            <span class="product-sales">已售{{ product.sales }}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PageSkeleton from '@/components/skeleton/PageSkeleton.vue'
import { message } from 'ant-design-vue'
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  TrophyFilled,
  CalendarOutlined,
  CameraOutlined,
  ShoppingOutlined,
  FireOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  RightOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  RocketOutlined,
  UserOutlined,
  StarOutlined,
  StarFilled,
  ShopFilled,
  CompassOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 加载状态
const loading = ref(true)

// 下一场比赛
const nextMatch = ref({
  homeTeam: '南京队',
  awayTeam: '苏州队',
  time: '2025-10-18 19:30'
})

// 倒计时
const countdown = ref('2天15小时30分')

// 正在直播的赛事
const liveMatches = ref([
  {
    id: 1,
    homeTeam: '无锡队',
    awayTeam: '常州队',
    homeScore: 2,
    awayScore: 1,
    matchTime: '下半场 75\'',
    venue: '无锡奥体中心',
    viewers: 8765
  }
])

// 即将开始的赛事
const upcomingMatches = ref([
  {
    id: 2,
    date: '10月18日',
    time: '19:30',
    homeTeam: '南京队',
    awayTeam: '苏州队',
    venue: '南京奥体中心'
  },
  {
    id: 3,
    date: '10月19日',
    time: '15:00',
    homeTeam: '徐州队',
    awayTeam: '盐城队',
    venue: '徐州奥体中心'
  },
  {
    id: 4,
    date: '10月20日',
    time: '19:30',
    homeTeam: '扬州队',
    awayTeam: '镇江队',
    venue: '扬州体育公园'
  }
])

// 苏超权益
const benefits = ref([
  {
    id: 1,
    title: '观赛餐饮优惠',
    desc: '凭苏超票根享受周边餐饮优惠',
    discount: '满100减30',
    tag: '热门',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="b1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23b1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-weight="bold" font-family="Arial"%3E餐饮优惠%3C/text%3E%3C/svg%3E'
  },
  {
    id: 2,
    title: '停车优惠券',
    desc: '奥体中心停车场专享优惠',
    discount: '5折优惠',
    tag: '推荐',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="b2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23b2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-weight="bold" font-family="Arial"%3E停车优惠%3C/text%3E%3C/svg%3E'
  },
  {
    id: 3,
    title: '球队周边8折',
    desc: '官方周边商品限时折扣',
    discount: '8折',
    tag: '限时',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="b3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23b3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-weight="bold" font-family="Arial"%3E周边8折%3C/text%3E%3C/svg%3E'
  },
  {
    id: 4,
    title: '酒店住宿优惠',
    desc: '合作酒店专属优惠价',
    discount: '立减100',
    tag: '',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Cdefs%3E%3ClinearGradient id="b4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="200" fill="url(%23b4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="20" font-weight="bold" font-family="Arial"%3E酒店优惠%3C/text%3E%3C/svg%3E'
  }
])

// 赛事周边商品
const products = ref([
  {
    id: 1,
    name: '南京队主场球衣',
    price: 299,
    sales: 1234,
    badge: '热销',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="s1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23s1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E球衣%3C/text%3E%3C/svg%3E'
  },
  {
    id: 2,
    name: '苏超限定围巾',
    price: 89,
    sales: 567,
    badge: '新品',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="s2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23s2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E围巾%3C/text%3E%3C/svg%3E'
  },
  {
    id: 3,
    name: '球队徽章套装',
    price: 59,
    sales: 890,
    badge: '',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="s3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23s3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E徽章%3C/text%3E%3C/svg%3E'
  },
  {
    id: 4,
    name: '苏超纪念帽',
    price: 79,
    sales: 456,
    badge: '',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Cdefs%3E%3ClinearGradient id="s4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="200" fill="url(%23s4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="18" font-weight="bold" font-family="Arial"%3E帽子%3C/text%3E%3C/svg%3E'
  }
])

// 倒计时更新
let countdownTimer: number | null = null

const updateCountdown = () => {
  // 模拟倒计时更新
  // 实际应该根据nextMatch.time计算
}

onMounted(async () => {
  // 模拟数据加载
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
  
  countdownTimer = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

// 分享
const handleShare = () => {
  message.success('分享功能开发中')
}

// 导航方法
const goToCalendar = () => {
  router.push('/match-calendar')
}

const goToTicketUpload = () => {
  router.push('/ticket-upload')
}

const goToShop = () => {
  // 跳转到购物车页面
  router.push('/cart')
}

const goToCarnival = () => {
  message.info('苏超嘉年华功能即将上线')
}

const goToConsumerGuide = () => {
  router.push('/consumer-guide')
}

const goToLive = (match: any) => {
  message.info('直播功能即将上线')
}

const goToMatchDetail = (match: any) => {
  // 暂时显示提示,后续可跳转到专门的比赛详情页或购票页
  message.info(`${match.homeTeam} VS ${match.awayTeam} 购票功能即将上线`)
  // TODO: 后续跳转到比赛详情页或购票页
  // router.push(`/match-detail/${match.id}`)
}

const goToBenefit = (benefit: any) => {
  // 模拟领取优惠券
  message.success(`领取${benefit.title}成功！已放入我的优惠券`)
  // 跳转到优惠券页面
  setTimeout(() => {
    router.push('/vouchers')
  }, 1500)
}

const goToSecondScene = () => {
  message.info('第二现场功能即将上线')
}

const goToProduct = (product: any) => {
  router.push({
    path: '/product-detail',
    query: {
      id: product.id,
      name: product.name,
      price: product.price,
      source: 'suchao'
    }
  })
}
</script>

<style scoped lang="scss">
.suchao-zone {
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
  .share-icon {
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}

.suchao-header {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  padding: 20px 16px;
  color: white;

  .brand-banner {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .brand-logo {
      margin-right: 16px;
    }

    .brand-info {
      .brand-name {
        font-size: 28px;
        font-weight: bold;
        margin: 0;
      }

      .brand-slogan {
        font-size: 14px;
        opacity: 0.9;
        margin: 4px 0 0;
      }
    }
  }

  .countdown-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 16px;
    text-align: center;

    .countdown-label {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .countdown-time {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .match-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8px;

      .team {
        font-size: 16px;
        font-weight: bold;
      }

      .vs {
        font-size: 12px;
        opacity: 0.8;
      }
    }

    .match-time {
      font-size: 14px;
      opacity: 0.9;
    }
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 20px 16px;
  background: white;
  margin-bottom: 12px;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      margin-bottom: 8px;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.1);
      }
    }

    .action-name {
      font-size: 13px;
      color: #333;
    }
  }
}

.section {
  background: white;
  margin-bottom: 12px;
  padding: 16px;

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

  .match-card {
    background: #FAFAFA;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    &:last-child {
      margin-bottom: 0;
    }

    &.live {
      background: linear-gradient(135deg, #FFF5F5 0%, #FFE5E5 100%);
      border: 2px solid #FF4444;
    }

    .live-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #FF4444;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;

      .live-dot {
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      }
    }

    .match-date {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }

    .match-teams {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .team-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        flex: 1;

        .team-logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          font-weight: bold;
        }

        .team-name {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        .team-score {
          font-size: 24px;
          font-weight: bold;
          color: #FF4444;
        }
      }

      .match-status {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 0 16px;

        .match-time-live {
          font-size: 12px;
          color: #FF4444;
          font-weight: bold;
        }

        .match-time-text {
          font-size: 16px;
          color: #666;
          font-weight: bold;
        }

        .vs-text {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .match-info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 13px;
      color: #666;

      .match-venue,
      .match-viewers {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .match-actions {
      display: flex;
      gap: 8px;
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

        .benefit-tag {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #FF4444;
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
        }

        .benefit-desc {
          font-size: 12px;
          color: #666;
          margin: 0 0 8px;
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

  .second-scene-card {
    cursor: pointer;

    .scene-banner {
      background: linear-gradient(135deg, #FF006E 0%, #8338EC 100%);
      border-radius: 12px;
      padding: 24px;
      color: white;
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .scene-content {
        flex: 1;
        z-index: 1;

        .scene-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0 0 8px;
        }

        .scene-desc {
          font-size: 14px;
          opacity: 0.9;
          margin: 0 0 12px;
        }

        .scene-stats {
          display: flex;
          gap: 16px;
          font-size: 13px;
          opacity: 0.9;
        }
      }

      .scene-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .carnival-card {
    cursor: pointer;

    .carnival-banner {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      border-radius: 12px;
      padding: 24px;
      color: #333;
      position: relative;

      .carnival-badge {
        position: absolute;
        top: 16px;
        right: 16px;
        background: #FF4444;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
      }

      .carnival-title {
        font-size: 22px;
        font-weight: bold;
        margin: 0 0 8px;
      }

      .carnival-time {
        font-size: 14px;
        margin: 0 0 4px;
      }

      .carnival-location {
        font-size: 14px;
        margin: 0 0 16px;
      }

      .carnival-highlights {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
        }
      }
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .product-card {
      background: #FAFAFA;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .product-image {
        position: relative;
        width: 100%;
        height: 150px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #FF4444;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
        }
      }

      .product-name {
        font-size: 14px;
        font-weight: bold;
        margin: 12px 12px 8px;
      }

      .product-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px 12px;

        .product-price {
          font-size: 16px;
          font-weight: bold;
          color: #FF4444;
        }

        .product-sales {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

