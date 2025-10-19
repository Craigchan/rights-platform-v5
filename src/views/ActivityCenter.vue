<template>
  <div class="activity-center-page">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="nav-title">活动中心</span>
      <SearchOutlined class="search-icon" @click="showSearch" />
    </div>

    <!-- 四季主题切换 -->
    <div class="season-selector">
      <div class="season-header">
        <CalendarOutlined class="header-icon" />
        <span class="header-title">苏新消费 · 全年活动</span>
      </div>
      <div class="season-tabs">
        <div 
          v-for="season in seasons" 
          :key="season.id"
          class="season-tab"
          :class="{ active: currentSeason === season.id }"
          @click="selectSeason(season.id)"
        >
          <div class="season-icon" :style="{ background: season.color }">
            {{ season.icon }}
          </div>
          <div class="season-info">
            <div class="season-name">{{ season.name }}</div>
            <div class="season-period">{{ season.period }}</div>
          </div>
          <div class="season-count">{{ season.activityCount }}场</div>
        </div>
      </div>
    </div>

    <!-- 13城市活动矩阵 -->
    <div class="city-matrix">
      <div class="matrix-header">
        <EnvironmentOutlined class="header-icon" />
        <span class="header-title">一市一主题</span>
        <span class="header-subtitle">13个设区市联动</span>
      </div>
      <div class="city-grid">
        <div 
          v-for="city in cities" 
          :key="city.id"
          class="city-card"
          :class="{ active: currentCity === city.id }"
          @click="selectCity(city.id)"
        >
          <div class="city-icon">{{ city.icon }}</div>
          <div class="city-name">{{ city.name }}</div>
          <div class="city-theme">{{ city.theme }}</div>
          <div class="city-count">{{ city.activityCount }}场活动</div>
        </div>
      </div>
    </div>

    <!-- 活动时间轴 -->
    <div class="timeline-section" v-if="currentSeasonActivities.length > 0">
      <div class="section-header">
        <ClockCircleOutlined class="section-icon" />
        <span class="section-title">{{ currentSeasonName }}活动时间轴</span>
      </div>
      <div class="timeline">
        <div 
          v-for="(activity, index) in currentSeasonActivities" 
          :key="activity.id"
          class="timeline-item"
        >
          <div class="timeline-dot" :style="{ background: activity.color }"></div>
          <div class="timeline-line" v-if="index < currentSeasonActivities.length - 1"></div>
          <div class="timeline-content">
            <div class="activity-date">{{ activity.date }}</div>
            <div class="activity-card-mini" @click="goToDetail(activity.id)">
              <h4 class="activity-title">{{ activity.title }}</h4>
              <div class="activity-location">
                <EnvironmentOutlined />
                <span>{{ activity.city }}</span>
              </div>
              <div class="activity-status" :class="activity.status">
                {{ getStatusText(activity.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="activities-section">
      <div class="section-header">
        <FireOutlined class="section-icon" />
        <span class="section-title">{{ currentFilterTitle }}</span>
        <span class="activity-count">{{ filteredActivities.length }}场</span>
      </div>
      
      <div class="activities-grid">
        <div 
          v-for="activity in filteredActivities" 
          :key="activity.id"
          class="activity-card"
          @click="goToDetail(activity.id)"
        >
          <!-- 活动图片 -->
          <div class="activity-image">
            <div class="image-placeholder" :style="{ background: activity.color }"></div>
            <div class="status-badge" :class="activity.status">
              {{ getStatusText(activity.status) }}
            </div>
            <div class="hot-badge" v-if="activity.hot">🔥 热门</div>
          </div>
          
          <!-- 活动信息 -->
          <div class="activity-info">
            <h3 class="activity-title">{{ activity.title }}</h3>
            <div class="activity-desc">{{ activity.desc }}</div>
            
            <!-- 活动标签 -->
            <div class="activity-tags">
              <span class="tag season">{{ activity.season }}</span>
              <span class="tag city">{{ activity.city }}</span>
            </div>
            
            <!-- 活动时间 -->
            <div class="activity-time">
              <ClockCircleOutlined class="time-icon" />
              <span>{{ activity.startDate }} - {{ activity.endDate }}</span>
            </div>
            
            <!-- 参与人数 -->
            <div class="activity-participants">
              <UserOutlined class="participants-icon" />
              <span>{{ activity.participants }}人参与</span>
            </div>
            
            <!-- 奖励信息 -->
            <div class="activity-reward">
              <GiftOutlined class="reward-icon" />
              <span>{{ activity.reward }}</span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="activity-actions">
            <a-button 
              type="primary" 
              size="small"
              :disabled="activity.status === 'ended'"
              @click.stop="handleJoin(activity)"
            >
              {{ getButtonText(activity.status, activity.joined) }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动统计 -->
    <div class="statistics-section">
      <div class="section-header">
        <BarChartOutlined class="section-icon" />
        <span class="section-title">活动数据</span>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalActivities }}</div>
          <div class="stat-label">全年活动</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalParticipants }}</div>
          <div class="stat-label">参与人次</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalRewards }}</div>
          <div class="stat-label">发放奖励</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">2000+</div>
          <div class="stat-label">参与企业</div>
        </div>
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
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FireOutlined,
  UserOutlined,
  GiftOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 四季主题
const seasons = ref([
  {
    id: 'spring',
    name: '春惠江苏',
    period: '3-5月',
    icon: '🌸',
    color: 'linear-gradient(135deg, #A8E6CF 0%, #FFD3B6 100%)',
    activityCount: 156
  },
  {
    id: 'summer',
    name: '夏夜生活',
    period: '6-8月',
    icon: '🌙',
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    activityCount: 189
  },
  {
    id: 'autumn',
    name: '金秋惠购',
    period: '9-11月',
    icon: '🍂',
    color: 'linear-gradient(135deg, #FA8C16 0%, #FA541C 100%)',
    activityCount: 234
  },
  {
    id: 'winter',
    name: '暖冬购物季',
    period: '12-2月',
    icon: '❄️',
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    activityCount: 178
  }
])

const currentSeason = ref('autumn') // 当前是10月,属于金秋惠购

// 13个设区市
const cities = ref([
  { id: 'nanjing', name: '南京', icon: '🏯', theme: '文化消费', activityCount: 68 },
  { id: 'suzhou', name: '苏州', icon: '🌸', theme: '园林雅韵', activityCount: 72 },
  { id: 'wuxi', name: '无锡', icon: '🌊', theme: '太湖风情', activityCount: 54 },
  { id: 'changzhou', name: '常州', icon: '🐉', theme: '智造之城', activityCount: 48 },
  { id: 'nantong', name: '南通', icon: '⚓', theme: '江海门户', activityCount: 42 },
  { id: 'yangzhou', name: '扬州', icon: '🌙', theme: '月城风雅', activityCount: 51 },
  { id: 'zhenjiang', name: '镇江', icon: '🍶', theme: '醋都香韵', activityCount: 38 },
  { id: 'yancheng', name: '盐城', icon: '🦢', theme: '湿地之都', activityCount: 36 },
  { id: 'huaian', name: '淮安', icon: '🚢', theme: '运河之都', activityCount: 41 },
  { id: 'xuzhou', name: '徐州', icon: '🏺', theme: '汉韵彭城', activityCount: 45 },
  { id: 'lianyungang', name: '连云港', icon: '🏔️', theme: '山海港城', activityCount: 33 },
  { id: 'suqian', name: '宿迁', icon: '🍷', theme: '酒都风情', activityCount: 29 },
  { id: 'taizhou', name: '泰州', icon: '🎋', theme: '水城慢生活', activityCount: 40 }
])

const currentCity = ref('all')

// 当前季节名称
const currentSeasonName = computed(() => {
  const season = seasons.value.find(s => s.id === currentSeason.value)
  return season ? season.name : ''
})

// 当前筛选标题
const currentFilterTitle = computed(() => {
  const seasonName = seasons.value.find(s => s.id === currentSeason.value)?.name || '全部'
  const cityName = cities.value.find(c => c.id === currentCity.value)?.name || '全省'
  
  if (currentSeason.value === 'all' && currentCity.value === 'all') {
    return '全部活动'
  } else if (currentSeason.value !== 'all' && currentCity.value === 'all') {
    return `${seasonName}活动`
  } else if (currentSeason.value === 'all' && currentCity.value !== 'all') {
    return `${cityName}活动`
  } else {
    return `${seasonName} · ${cityName}`
  }
})

// 活动数据
const activities = ref([
  {
    id: 1,
    title: '金秋家电焕新季',
    desc: '以旧换新最高补贴2000元',
    season: '金秋惠购',
    city: '南京',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    date: '9月1日',
    participants: 15678,
    reward: '最高2000元补贴',
    status: 'ongoing',
    hot: true,
    joined: false,
    color: 'linear-gradient(135deg, #FA8C16 0%, #FA541C 100%)'
  },
  {
    id: 2,
    title: '苏州园林文化节',
    desc: '游园赏秋 文化消费优惠',
    season: '金秋惠购',
    city: '苏州',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    date: '10月1日',
    participants: 23456,
    reward: '门票8折+消费券',
    status: 'ongoing',
    hot: true,
    joined: true,
    color: 'linear-gradient(135deg, #52C41A 0%, #389E0D 100%)'
  },
  {
    id: 3,
    title: '无锡太湖美食节',
    desc: '品味太湖 舌尖上的无锡',
    season: '金秋惠购',
    city: '无锡',
    startDate: '2025-10-15',
    endDate: '2025-11-15',
    date: '10月15日',
    participants: 18923,
    reward: '满200减50',
    status: 'ongoing',
    hot: false,
    joined: false,
    color: 'linear-gradient(135deg, #1890FF 0%, #096DD9 100%)'
  },
  {
    id: 4,
    title: '常州智造博览会',
    desc: '智能家居 科技生活',
    season: '金秋惠购',
    city: '常州',
    startDate: '2025-10-20',
    endDate: '2025-10-25',
    date: '10月20日',
    participants: 12345,
    reward: '购物满额送积分',
    status: 'upcoming',
    hot: false,
    joined: false,
    color: 'linear-gradient(135deg, #722ED1 0%, #531DAB 100%)'
  },
  {
    id: 5,
    title: '扬州月城购物节',
    desc: '月圆中秋 惠购扬州',
    season: '金秋惠购',
    city: '扬州',
    startDate: '2025-09-15',
    endDate: '2025-10-08',
    date: '9月15日',
    participants: 16789,
    reward: '满300减80',
    status: 'ended',
    hot: false,
    joined: true,
    color: 'linear-gradient(135deg, #FAAD14 0%, #FA8C16 100%)'
  },
  {
    id: 6,
    title: '春惠江苏启动仪式',
    desc: '全省联动 惠民消费',
    season: '春惠江苏',
    city: '南京',
    startDate: '2025-03-01',
    endDate: '2025-03-03',
    date: '3月1日',
    participants: 45678,
    reward: '消费券大礼包',
    status: 'ended',
    hot: true,
    joined: false,
    color: 'linear-gradient(135deg, #A8E6CF 0%, #FFD3B6 100%)'
  },
  {
    id: 7,
    title: '夏夜生活节',
    desc: '夜经济 新活力',
    season: '夏夜生活',
    city: '苏州',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    date: '6月1日',
    participants: 67890,
    reward: '夜间消费双倍积分',
    status: 'ended',
    hot: true,
    joined: true,
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  {
    id: 8,
    title: '暖冬购物季预热',
    desc: '提前锁定 冬季好物',
    season: '暖冬购物季',
    city: '南京',
    startDate: '2025-11-25',
    endDate: '2025-12-05',
    date: '11月25日',
    participants: 0,
    reward: '预售优惠+积分',
    status: 'upcoming',
    hot: false,
    joined: false,
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
  }
])

// 当前季节活动(用于时间轴)
const currentSeasonActivities = computed(() => {
  return activities.value
    .filter(a => a.season === currentSeasonName.value)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
})

// 筛选后的活动
const filteredActivities = computed(() => {
  let result = activities.value
  
  // 按季节筛选
  if (currentSeason.value !== 'all') {
    const seasonName = currentSeasonName.value
    result = result.filter(a => a.season === seasonName)
  }
  
  // 按城市筛选
  if (currentCity.value !== 'all') {
    const cityName = cities.value.find(c => c.id === currentCity.value)?.name
    result = result.filter(a => a.city === cityName)
  }
  
  return result
})

// 统计数据
const totalActivities = computed(() => {
  return seasons.value.reduce((sum, season) => sum + season.activityCount, 0)
})

const totalParticipants = computed(() => {
  return '150万+'
})

const totalRewards = computed(() => {
  return '5亿元'
})

// 方法
const goBack = () => {
  router.back()
}

const showSearch = () => {
  message.info('搜索功能开发中')
}

const selectSeason = (seasonId: string) => {
  currentSeason.value = seasonId
}

const selectCity = (cityId: string) => {
  currentCity.value = cityId
}

const goToDetail = (activityId: number) => {
  router.push(`/activity-detail?id=${activityId}`)
}

const handleJoin = (activity: any) => {
  if (activity.status === 'ended') {
    message.warning('活动已结束')
    return
  }
  if (activity.joined) {
    message.info('您已参与该活动')
    return
  }
  message.success('报名成功!')
  activity.joined = true
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    ongoing: '进行中',
    upcoming: '即将开始',
    ended: '已结束'
  }
  return statusMap[status] || status
}

const getButtonText = (status: string, joined: boolean) => {
  if (status === 'ended') return '已结束'
  if (joined) return '已参与'
  if (status === 'upcoming') return '预约报名'
  return '立即参与'
}
</script>

<style scoped>
.activity-center-page {
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

/* 四季主题选择器 */
.season-selector {
  background: white;
  padding: 15px;
  margin: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.season-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
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

.season-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.season-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #fafafa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.season-tab.active {
  border-color: #1890FF;
  background: #E6F7FF;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.season-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.season-info {
  flex: 1;
}

.season-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 3px;
}

.season-period {
  font-size: 11px;
  color: #999;
}

.season-count {
  font-size: 12px;
  color: #1890FF;
  font-weight: 600;
}

/* 城市矩阵 */
.city-matrix {
  background: white;
  padding: 15px;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.matrix-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.header-subtitle {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.city-card {
  text-align: center;
  padding: 10px 5px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.city-card.active {
  border-color: #FA8C16;
  background: #FFF7E6;
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.2);
}

.city-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.city-name {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  margin-bottom: 3px;
}

.city-theme {
  font-size: 10px;
  color: #666;
  margin-bottom: 3px;
}

.city-count {
  font-size: 10px;
  color: #FA8C16;
}

/* 活动时间轴 */
.timeline-section {
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
  color: #1890FF;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -30px;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #1890FF;
}

.timeline-line {
  position: absolute;
  left: -24px;
  top: 12px;
  width: 2px;
  height: calc(100% + 20px);
  background: #E6F7FF;
}

.timeline-content {
  margin-bottom: 15px;
}

.activity-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.activity-card-mini {
  background: #fafafa;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}

.activity-card-mini:hover {
  background: #E6F7FF;
  border-color: #1890FF;
}

.activity-card-mini .activity-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.activity-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.activity-status {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.activity-status.ongoing {
  background: #E6FFFB;
  color: #13C2C2;
}

.activity-status.upcoming {
  background: #FFF7E6;
  color: #FA8C16;
}

.activity-status.ended {
  background: #F5F5F5;
  color: #999;
}

/* 活动列表 */
.activities-section {
  background: white;
  padding: 15px;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.activity-count {
  font-size: 12px;
  color: #999;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.activity-card {
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #f0f0f0;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #1890FF;
}

.activity-image {
  position: relative;
  height: 150px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
}

.status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.status-badge.ongoing {
  background: linear-gradient(135deg, #13C2C2 0%, #08979C 100%);
}

.status-badge.upcoming {
  background: linear-gradient(135deg, #FA8C16 0%, #FA541C 100%);
}

.status-badge.ended {
  background: linear-gradient(135deg, #999 0%, #666 100%);
}

.hot-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #FF4D4F 0%, #CF1322 100%);
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
}

.activity-info {
  padding: 15px;
}

.activity-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.activity-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.activity-tags {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

.tag {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.tag.season {
  background: #FFF7E6;
  color: #FA8C16;
}

.tag.city {
  background: #E6F7FF;
  color: #1890FF;
}

.activity-time,
.activity-participants,
.activity-reward {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.time-icon,
.participants-icon,
.reward-icon {
  color: #1890FF;
}

.activity-actions {
  padding: 0 15px 15px;
}

.activity-actions button {
  width: 100%;
  border-radius: 20px;
  background: linear-gradient(135deg, #1890FF 0%, #096DD9 100%);
  border: none;
  font-weight: 500;
}

/* 活动统计 */
.statistics-section {
  background: white;
  padding: 15px;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stat-card {
  text-align: center;
  padding: 15px 10px;
  background: #fafafa;
  border-radius: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #1890FF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}
</style>

