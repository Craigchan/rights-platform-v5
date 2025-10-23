<template>
  <div class="discover-page">
    <div class="discover-header">
      <h1 class="discover-title">发现</h1>
      <p class="discover-subtitle">探索更多权益与服务</p>
    </div>

    <div class="discover-content">
      <!-- 购物消费 -->
      <div class="category-section">
        <div class="category-header">
          <ShoppingOutlined class="category-icon" />
          <h2 class="category-title">购物消费</h2>
        </div>
        <div class="feature-grid">
          <div 
            v-for="item in shoppingFeatures" 
            :key="item.path"
            class="feature-card"
            @click="navigate(item.path)"
          >
            <div class="feature-icon" :style="{ background: item.color }">
              <component :is="item.icon" />
            </div>
            <div class="feature-info">
              <h3 class="feature-name">{{ item.name }}</h3>
              <p class="feature-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 权益福利 -->
      <div class="category-section">
        <div class="category-header">
          <GiftOutlined class="category-icon" />
          <h2 class="category-title">权益福利</h2>
        </div>
        <div class="feature-grid">
          <div 
            v-for="item in benefitsFeatures" 
            :key="item.path"
            class="feature-card"
            @click="navigate(item.path)"
          >
            <div class="feature-icon" :style="{ background: item.color }">
              <component :is="item.icon" />
            </div>
            <div class="feature-info">
              <h3 class="feature-name">{{ item.name }}</h3>
              <p class="feature-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 互动玩法 -->
      <div class="category-section">
        <div class="category-header">
          <TrophyOutlined class="category-icon" />
          <h2 class="category-title">互动玩法</h2>
        </div>
        <div class="feature-grid">
          <div 
            v-for="item in gameFeatures" 
            :key="item.path"
            class="feature-card"
            @click="navigate(item.path)"
          >
            <div class="feature-icon" :style="{ background: item.color }">
              <component :is="item.icon" />
            </div>
            <div class="feature-info">
              <h3 class="feature-name">{{ item.name }}</h3>
              <p class="feature-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动专区 -->
      <div class="category-section">
        <div class="category-header">
          <CalendarOutlined class="category-icon" />
          <h2 class="category-title">活动专区</h2>
        </div>
        <div class="feature-grid">
          <div 
            v-for="item in activityFeatures" 
            :key="item.path"
            class="feature-card"
            @click="navigate(item.path)"
          >
            <div class="feature-icon" :style="{ background: item.color }">
              <component :is="item.icon" />
            </div>
            <div class="feature-info">
              <h3 class="feature-name">{{ item.name }}</h3>
              <p class="feature-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 本地服务 -->
      <div class="category-section">
        <div class="category-header">
          <EnvironmentOutlined class="category-icon" />
          <h2 class="category-title">本地服务</h2>
        </div>
        <div class="feature-grid">
          <div 
            v-for="item in localFeatures" 
            :key="item.path"
            class="feature-card"
            @click="navigate(item.path)"
          >
            <div class="feature-icon" :style="{ background: item.color }">
              <component :is="item.icon" />
            </div>
            <div class="feature-info">
              <h3 class="feature-name">{{ item.name }}</h3>
              <p class="feature-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ShoppingOutlined,
  GiftOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  CrownOutlined,
  FireOutlined,
  GlobalOutlined,
  DollarOutlined,
  TagOutlined,
  BankOutlined,
  SwapOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StarOutlined,
  SmileOutlined,
  PictureOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  CompassOutlined,
  CameraOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

const navigate = (path: string) => {
  router.push(path)
}

// 购物消费功能
const shoppingFeatures = [
  { name: '积分商城', desc: '积分兑好礼', path: '/points-mall', icon: ShopOutlined, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '苏品苏货', desc: '江苏特产', path: '/local-products', icon: CrownOutlined, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '老字号', desc: '百年传承', path: '/heritage-brands', icon: FireOutlined, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '国货潮品', desc: '国潮新势力', path: '/trendy-products', icon: GlobalOutlined, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: '外贸优品', desc: '出口品质', path: '/foreign-trade', icon: DollarOutlined, color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: '海员经济', desc: '港口特供', path: '/sailor-economy', icon: GlobalOutlined, color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
]

// 权益福利功能
const benefitsFeatures = [
  { name: '优惠券中心', desc: '领券省钱', path: '/voucher-center', icon: TagOutlined, color: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)' },
  { name: '政府补贴', desc: '官方补贴', path: '/gov-subsidy', icon: BankOutlined, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '以旧换新', desc: '换新补贴', path: '/gov-subsidy', icon: SwapOutlined, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '会员权益', desc: '专属特权', path: '/membership', icon: TeamOutlined, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
]

// 互动玩法功能
const gameFeatures = [
  { name: '签到打卡', desc: '每日领积分', path: '/earn-points', icon: CheckCircleOutlined, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '积分任务', desc: '做任务赚积分', path: '/earn-points', icon: StarOutlined, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '幸运抽奖', desc: '抽奖赢大奖', path: '/lottery-center', icon: SmileOutlined, color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: '票根拼图', desc: '收集赢奖励', path: '/ticket-puzzle', icon: PictureOutlined, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '政府补贴助力', desc: '好友助力', path: '/subsidy-help', icon: ThunderboltOutlined, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
]

// 活动专区功能
const activityFeatures = [
  { name: '活动中心', desc: '精彩活动', path: '/activity-center', icon: HeartOutlined, color: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)' },
  { name: '苏超专区', desc: '球迷福利', path: '/suchao-zone', icon: TrophyOutlined, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '限时秒杀', desc: '超值抢购', path: '/flash-sale', icon: ThunderboltOutlined, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
]

// 本地服务功能
const localFeatures = [
  { name: '附近优惠', desc: '周边商家', path: '/nearby', icon: CompassOutlined, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '商家地图', desc: '地图导航', path: '/nearby', icon: EnvironmentOutlined, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: '上传票根', desc: '票根换优惠', path: '/ticket-upload', icon: CameraOutlined, color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
]
</script>

<style scoped>
.discover-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.discover-header {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
  padding: 60px 20px 30px;
  color: white;
}

.discover-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.discover-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 8px 0 0;
}

.discover-content {
  padding: 20px;
}

.category-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.category-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.category-icon {
  font-size: 24px;
  color: #FF6B35;
  margin-right: 8px;
}

.category-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.feature-card {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:active {
  transform: scale(0.95);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 24px;
  color: white;
}

.feature-info {
  width: 100%;
}

.feature-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px;
}

.feature-desc {
  font-size: 12px;
  color: #999;
  margin: 0;
}
</style>

