<template>
  <div class="map-checkin-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <a-button type="text" @click="goBack" class="back-btn">
        <template #icon><LeftOutlined /></template>
      </a-button>
      <span class="title">地图打卡</span>
      <a-button type="text" @click="showRecords = true" class="records-btn">
        打卡记录
      </a-button>
    </div>

    <!-- 地图容器 -->
    <div class="map-container" id="map-container">
      <div class="map-placeholder">
        <EnvironmentOutlined :style="{ fontSize: '48px', color: '#1890ff' }" />
        <p>地图加载中...</p>
        <p class="map-tip">实际项目中将集成高德地图或百度地图</p>
      </div>
      
      <!-- 定位按钮 -->
      <a-button 
        class="location-btn" 
        type="primary" 
        shape="circle" 
        @click="relocate"
        :loading="locating"
      >
        <template #icon><AimOutlined /></template>
      </a-button>

      <!-- 当前位置信息 -->
      <div class="location-info">
        <EnvironmentOutlined />
        <span>{{ currentLocation }}</span>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-value">{{ userStats.totalCheckIns }}</div>
        <div class="stat-label">累计打卡</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ userStats.consecutiveDays }}</div>
        <div class="stat-label">连续天数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ userStats.totalPoints }}</div>
        <div class="stat-label">获得积分</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ userStats.achievements }}</div>
        <div class="stat-label">解锁成就</div>
      </div>
    </div>

    <!-- 附近打卡点列表 -->
    <div class="nearby-points">
      <div class="section-header">
        <h3>附近打卡点</h3>
        <a-radio-group v-model:value="sortType" size="small" button-style="solid">
          <a-radio-button value="distance">距离</a-radio-button>
          <a-radio-button value="hot">热度</a-radio-button>
        </a-radio-group>
      </div>

      <div class="points-list">
        <div 
          v-for="point in sortedPoints" 
          :key="point.id" 
          class="point-card"
          @click="showPointDetail(point)"
        >
          <div class="point-image">
            <img :src="point.image" :alt="point.name" />
            <div v-if="point.isCheckedIn" class="checked-badge">
              <CheckCircleFilled />
            </div>
          </div>
          <div class="point-info">
            <h4>{{ point.name }}</h4>
            <div class="point-meta">
              <span class="distance">
                <EnvironmentOutlined />
                {{ point.distance }}
              </span>
              <span class="check-count">
                <TeamOutlined />
                {{ point.checkInCount }}人打卡
              </span>
            </div>
            <div class="point-tags">
              <a-tag v-for="tag in point.tags" :key="tag" color="blue" size="small">
                {{ tag }}
              </a-tag>
            </div>
            <div class="point-reward">
              <TrophyOutlined />
              打卡可得 <span class="points">+{{ point.points }}</span> 积分
            </div>
          </div>
          <div class="point-action">
            <a-button 
              type="primary" 
              size="small"
              :disabled="point.isCheckedIn || point.distance > point.maxDistance"
              @click.stop="checkIn(point)"
            >
              {{ point.isCheckedIn ? '已打卡' : '打卡' }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就系统 -->
    <div class="achievements-section">
      <div class="section-header">
        <h3>成就徽章</h3>
        <a @click="showAllAchievements = true">查看全部</a>
      </div>
      <div class="achievements-grid">
        <div 
          v-for="achievement in recentAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">
            <TrophyOutlined v-if="achievement.unlocked" />
            <LockOutlined v-else />
          </div>
          <div class="achievement-name">{{ achievement.name }}</div>
          <div class="achievement-progress" v-if="!achievement.unlocked">
            {{ achievement.progress }}/{{ achievement.target }}
          </div>
        </div>
      </div>
    </div>

    <!-- 打卡记录抽屉 -->
    <a-drawer
      v-model:open="showRecords"
      title="打卡记录"
      placement="right"
      :width="320"
    >
      <a-timeline>
        <a-timeline-item 
          v-for="record in checkInRecords" 
          :key="record.id"
          :color="record.isToday ? 'green' : 'blue'"
        >
          <div class="record-item">
            <div class="record-header">
              <strong>{{ record.pointName }}</strong>
              <span class="record-points">+{{ record.points }}</span>
            </div>
            <div class="record-time">{{ record.time }}</div>
            <div class="record-location">{{ record.location }}</div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </a-drawer>

    <!-- 打卡点详情弹窗 -->
    <a-modal
      v-model:open="showDetail"
      :title="selectedPoint?.name"
      :footer="null"
      width="90%"
    >
      <div v-if="selectedPoint" class="point-detail">
        <img :src="selectedPoint.image" class="detail-image" />
        <div class="detail-info">
          <div class="info-row">
            <EnvironmentOutlined />
            <span>{{ selectedPoint.address }}</span>
          </div>
          <div class="info-row">
            <ClockCircleOutlined />
            <span>开放时间: {{ selectedPoint.openTime }}</span>
          </div>
          <div class="info-row">
            <TeamOutlined />
            <span>{{ selectedPoint.checkInCount }}人已打卡</span>
          </div>
        </div>
        <div class="detail-description">
          <h4>地点介绍</h4>
          <p>{{ selectedPoint.description }}</p>
        </div>
        <div class="detail-actions">
          <a-button type="primary" block size="large" @click="checkIn(selectedPoint)">
            立即打卡 (+{{ selectedPoint.points }}积分)
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 打卡成功弹窗 -->
    <a-modal
      v-model:open="showSuccess"
      :footer="null"
      :closable="false"
      width="300px"
      centered
    >
      <div class="success-content">
        <CheckCircleOutlined :style="{ fontSize: '64px', color: '#52c41a' }" />
        <h2>打卡成功!</h2>
        <div class="success-reward">
          <p>获得积分: <span class="points-earned">+{{ earnedPoints }}</span></p>
          <p v-if="consecutiveBonus > 0">连续打卡奖励: <span class="bonus">+{{ consecutiveBonus }}</span></p>
        </div>
        <a-button type="primary" block @click="showSuccess = false">
          太棒了
        </a-button>
      </div>
    </a-modal>

    <!-- 成就解锁弹窗 -->
    <a-modal
      v-model:open="showAchievement"
      :footer="null"
      :closable="false"
      width="300px"
      centered
    >
      <div class="achievement-unlock">
        <TrophyOutlined :style="{ fontSize: '64px', color: '#faad14' }" />
        <h2>解锁新成就!</h2>
        <div class="unlocked-achievement">
          <h3>{{ unlockedAchievement?.name }}</h3>
          <p>{{ unlockedAchievement?.description }}</p>
        </div>
        <a-button type="primary" block @click="showAchievement = false">
          继续努力
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  EnvironmentOutlined,
  AimOutlined,
  CheckCircleFilled,
  TeamOutlined,
  TrophyOutlined,
  LockOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 状态管理
const locating = ref(false)
const currentLocation = ref('南京市玄武区中山陵')
const sortType = ref('distance')
const showRecords = ref(false)
const showDetail = ref(false)
const showSuccess = ref(false)
const showAchievement = ref(false)
const showAllAchievements = ref(false)
const selectedPoint = ref<any>(null)
const earnedPoints = ref(0)
const consecutiveBonus = ref(0)
const unlockedAchievement = ref<any>(null)

// 用户统计数据
const userStats = ref({
  totalCheckIns: 28,
  consecutiveDays: 7,
  totalPoints: 560,
  achievements: 5
})

// 打卡点数据
const checkInPoints = ref([
  {
    id: 1,
    name: '中山陵景区',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23g1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E中山陵景区%3C/text%3E%3C/svg%3E',
    address: '南京市玄武区石象路7号',
    distance: 0.5,
    maxDistance: 1.0,
    checkInCount: 1234,
    points: 20,
    tags: ['景点', '历史', '5A级'],
    openTime: '08:00-17:00',
    description: '中山陵是中国近代伟大的民主革命先行者孙中山先生的陵寝,及其附属纪念建筑群,面积8万余平方米。',
    isCheckedIn: false,
    hotScore: 95
  },
  {
    id: 2,
    name: '玄武湖公园',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300c6ff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230072ff;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23g2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E玄武湖公园%3C/text%3E%3C/svg%3E',
    address: '南京市玄武区玄武巷1号',
    distance: 1.2,
    maxDistance: 1.0,
    checkInCount: 2156,
    points: 15,
    tags: ['公园', '休闲', '免费'],
    openTime: '06:00-22:00',
    description: '玄武湖位于南京市玄武区,东枕紫金山,西靠明城墙,是中国最大的皇家园林湖泊。',
    isCheckedIn: true,
    hotScore: 88
  },
  {
    id: 3,
    name: '南京博物院',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23f093fb;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23f5576c;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23g3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E南京博物院%3C/text%3E%3C/svg%3E',
    address: '南京市玄武区中山东路321号',
    distance: 2.1,
    maxDistance: 1.0,
    checkInCount: 987,
    points: 25,
    tags: ['博物馆', '文化', '免费'],
    openTime: '09:00-17:00',
    description: '南京博物院是中国三大博物馆之一,拥有各类藏品42万余件。',
    isCheckedIn: false,
    hotScore: 92
  },
  {
    id: 4,
    name: '夫子庙',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234facfe;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2300f2fe;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23g4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E夫子庙%3C/text%3E%3C/svg%3E',
    address: '南京市秦淮区贡院街152号',
    distance: 3.5,
    maxDistance: 1.0,
    checkInCount: 3421,
    points: 20,
    tags: ['古建筑', '美食', '夜景'],
    openTime: '全天开放',
    description: '夫子庙是一组规模宏大的古建筑群,是供奉和祭祀孔子的地方。',
    isCheckedIn: false,
    hotScore: 98
  },
  {
    id: 5,
    name: '总统府',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2343e97b;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2338f9d7;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23g5)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E总统府%3C/text%3E%3C/svg%3E',
    address: '南京市玄武区长江路292号',
    distance: 1.8,
    maxDistance: 1.0,
    checkInCount: 1567,
    points: 20,
    tags: ['历史', '建筑', '4A级'],
    openTime: '08:30-18:00',
    description: '南京总统府是中国近代建筑遗存中规模最大、保存最完整的建筑群。',
    isCheckedIn: false,
    hotScore: 85
  },
  {
    id: 6,
    name: '鸡鸣寺',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="g6" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23fa709a;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23fee140;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23g6)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="Arial"%3E鸡鸣寺%3C/text%3E%3C/svg%3E',
    address: '南京市玄武区鸡鸣寺路1号',
    distance: 0.8,
    maxDistance: 1.0,
    checkInCount: 2341,
    points: 15,
    tags: ['寺庙', '樱花', '祈福'],
    openTime: '07:00-17:30',
    description: '鸡鸣寺是南京最古老的梵刹之一,春季樱花盛开时景色优美。',
    isCheckedIn: false,
    hotScore: 90
  }
])

// 成就数据
const achievements = ref([
  { id: 1, name: '初来乍到', description: '完成首次打卡', unlocked: true, progress: 1, target: 1 },
  { id: 2, name: '坚持不懈', description: '连续打卡7天', unlocked: true, progress: 7, target: 7 },
  { id: 3, name: '探索达人', description: '打卡10个不同地点', unlocked: true, progress: 10, target: 10 },
  { id: 4, name: '城市漫步者', description: '累计打卡30次', unlocked: false, progress: 28, target: 30 },
  { id: 5, name: '月度冠军', description: '单月打卡20次', unlocked: true, progress: 20, target: 20 },
  { id: 6, name: '文化爱好者', description: '打卡5个博物馆', unlocked: true, progress: 5, target: 5 },
  { id: 7, name: '自然探索者', description: '打卡5个公园', unlocked: false, progress: 3, target: 5 },
  { id: 8, name: '历史追寻者', description: '打卡所有历史景点', unlocked: false, progress: 4, target: 8 }
])

// 打卡记录
const checkInRecords = ref([
  {
    id: 1,
    pointName: '玄武湖公园',
    location: '南京市玄武区',
    time: '今天 09:30',
    points: 15,
    isToday: true
  },
  {
    id: 2,
    pointName: '鸡鸣寺',
    location: '南京市玄武区',
    time: '昨天 14:20',
    points: 15,
    isToday: false
  },
  {
    id: 3,
    pointName: '中山陵景区',
    location: '南京市玄武区',
    time: '2天前 10:15',
    points: 20,
    isToday: false
  },
  {
    id: 4,
    pointName: '南京博物院',
    location: '南京市玄武区',
    time: '3天前 15:45',
    points: 25,
    isToday: false
  },
  {
    id: 5,
    pointName: '总统府',
    location: '南京市玄武区',
    time: '4天前 11:30',
    points: 20,
    isToday: false
  }
])

// 计算属性
const sortedPoints = computed(() => {
  const points = [...checkInPoints.value]
  if (sortType.value === 'distance') {
    return points.sort((a, b) => a.distance - b.distance)
  } else {
    return points.sort((a, b) => b.hotScore - a.hotScore)
  }
})

const recentAchievements = computed(() => {
  return achievements.value.slice(0, 4)
})

// 方法
const goBack = () => {
  router.back()
}

const relocate = () => {
  locating.value = true
  setTimeout(() => {
    locating.value = false
    message.success('定位成功')
  }, 1000)
}

const showPointDetail = (point: any) => {
  selectedPoint.value = point
  showDetail.value = true
}

const checkIn = (point: any) => {
  if (point.isCheckedIn) {
    message.warning('今天已经打卡过了')
    return
  }

  if (point.distance > point.maxDistance) {
    message.error('距离太远,无法打卡(需在' + point.maxDistance + 'km范围内)')
    return
  }

  // 模拟打卡
  point.isCheckedIn = true
  earnedPoints.value = point.points
  
  // 计算连续打卡奖励
  if (userStats.value.consecutiveDays >= 7) {
    consecutiveBonus.value = 10
  }

  // 更新统计
  userStats.value.totalCheckIns++
  userStats.value.totalPoints += earnedPoints.value + consecutiveBonus.value

  // 添加打卡记录
  checkInRecords.value.unshift({
    id: Date.now(),
    pointName: point.name,
    location: point.address,
    time: '刚刚',
    points: earnedPoints.value,
    isToday: true
  })

  showDetail.value = false
  showSuccess.value = true

  // 检查是否解锁新成就
  setTimeout(() => {
    checkAchievements()
  }, 1500)
}

const checkAchievements = () => {
  // 检查"城市漫步者"成就
  const walkerAchievement = achievements.value.find(a => a.id === 4)
  if (walkerAchievement && !walkerAchievement.unlocked && userStats.value.totalCheckIns >= 30) {
    walkerAchievement.unlocked = true
    walkerAchievement.progress = userStats.value.totalCheckIns
    userStats.value.achievements++
    
    unlockedAchievement.value = walkerAchievement
    showSuccess.value = false
    showAchievement.value = true
  }
}

onMounted(() => {
  // 实际项目中这里会初始化地图
  console.log('地图打卡页面已加载')
})
</script>

<style scoped>
.map-checkin-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn,
.records-btn {
  color: white !important;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.map-container {
  position: relative;
  height: 300px;
  background: #e6f7ff;
  margin-bottom: 16px;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.map-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.location-btn {
  position: absolute;
  bottom: 80px;
  right: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.location-info {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 16px;
}

.stat-card {
  background: white;
  padding: 16px 8px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.nearby-points {
  padding: 0 16px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.point-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
}

.point-card:active {
  transform: scale(0.98);
}

.point-image {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.point-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.checked-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(82, 196, 26, 0.9);
  color: white;
  padding: 4px;
  border-radius: 50%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.point-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.point-info h4 {
  margin: 0;
  font-size: 15px;
  font-weight: bold;
}

.point-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.distance,
.check-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.point-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.point-reward {
  font-size: 13px;
  color: #fa8c16;
  display: flex;
  align-items: center;
  gap: 4px;
}

.points {
  font-weight: bold;
  color: #f5222d;
}

.point-action {
  display: flex;
  align-items: center;
}

.achievements-section {
  padding: 0 16px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.achievement-card {
  background: white;
  padding: 16px 8px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  opacity: 0.5;
}

.achievement-card.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
}

.achievement-icon {
  font-size: 32px;
  margin-bottom: 8px;
  color: #faad14;
}

.achievement-card:not(.unlocked) .achievement-icon {
  color: #d9d9d9;
}

.achievement-name {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
}

.achievement-progress {
  font-size: 11px;
  color: #666;
}

.record-item {
  padding: 4px 0;
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.record-points {
  color: #52c41a;
  font-weight: bold;
}

.record-time,
.record-location {
  font-size: 12px;
  color: #999;
}

.point-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.detail-description h4 {
  margin-bottom: 8px;
}

.detail-description p {
  color: #666;
  line-height: 1.6;
}

.success-content,
.achievement-unlock {
  text-align: center;
  padding: 20px;
}

.success-content h2,
.achievement-unlock h2 {
  margin: 16px 0;
}

.success-reward {
  margin: 20px 0;
  font-size: 16px;
}

.points-earned {
  color: #52c41a;
  font-size: 24px;
  font-weight: bold;
}

.bonus {
  color: #fa8c16;
  font-weight: bold;
}

.unlocked-achievement {
  margin: 20px 0;
}

.unlocked-achievement h3 {
  color: #faad14;
  margin-bottom: 8px;
}

.unlocked-achievement p {
  color: #666;
}
</style>

