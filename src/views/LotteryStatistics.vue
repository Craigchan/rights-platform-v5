<template>
  <div class="lottery-statistics-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">抽奖统计</span>
      <ShareAltOutlined @click="handleShare" />
    </div>

    <!-- 时间范围选择 -->
    <div class="time-range-selector">
      <a-radio-group v-model:value="timeRange" button-style="solid" size="small">
        <a-radio-button value="week">近7天</a-radio-button>
        <a-radio-button value="month">近30天</a-radio-button>
        <a-radio-button value="all">全部</a-radio-button>
      </a-radio-group>
    </div>

    <!-- 数据总览 -->
    <div class="overview-section">
      <div class="section-title">
        <BarChartOutlined class="title-icon" />
        <span>数据总览</span>
      </div>
      <div class="overview-grid">
        <div class="overview-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)">
            🎯
          </div>
          <div class="card-content">
            <div class="card-value">{{ statistics.totalDraws }}</div>
            <div class="card-label">总抽奖次数</div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%)">
            🏆
          </div>
          <div class="card-content">
            <div class="card-value">{{ statistics.totalWins }}</div>
            <div class="card-label">中奖次数</div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%)">
            📊
          </div>
          <div class="card-content">
            <div class="card-value">{{ statistics.winRate }}%</div>
            <div class="card-label">中奖率</div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #F093FB 0%, #F5576C 100%)">
            💰
          </div>
          <div class="card-content">
            <div class="card-value">{{ statistics.totalValue }}</div>
            <div class="card-label">奖品总价值</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 抽奖趋势图 -->
    <div class="chart-section">
      <div class="section-title">
        <LineChartOutlined class="title-icon" />
        <span>抽奖趋势</span>
      </div>
      <div class="chart-container">
        <canvas ref="trendChartRef"></canvas>
      </div>
    </div>

    <!-- 中奖分布 -->
    <div class="chart-section">
      <div class="section-title">
        <PieChartOutlined class="title-icon" />
        <span>中奖分布</span>
      </div>
      <div class="chart-container">
        <canvas ref="pieChartRef"></canvas>
      </div>
    </div>

    <!-- 抽奖类型统计 -->
    <div class="type-stats-section">
      <div class="section-title">
        <FundOutlined class="title-icon" />
        <span>抽奖类型统计</span>
      </div>
      <div class="type-stats-list">
        <div 
          v-for="item in typeStats" 
          :key="item.type"
          class="type-stat-item"
        >
          <div class="type-info">
            <div class="type-name">{{ item.name }}</div>
            <div class="type-count">{{ item.count }}次</div>
          </div>
          <div class="type-progress">
            <div 
              class="progress-bar"
              :style="{ 
                width: `${(item.count / statistics.totalDraws * 100)}%`,
                background: item.color
              }"
            ></div>
          </div>
          <div class="type-percentage">
            {{ ((item.count / statistics.totalDraws * 100).toFixed(1)) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 最近中奖记录 -->
    <div class="recent-wins-section">
      <div class="section-title">
        <TrophyOutlined class="title-icon" />
        <span>最近中奖</span>
      </div>
      <div class="wins-list">
        <div 
          v-for="win in recentWins" 
          :key="win.id"
          class="win-item"
        >
          <div class="win-icon">{{ win.icon }}</div>
          <div class="win-info">
            <div class="win-name">{{ win.prizeName }}</div>
            <div class="win-time">{{ win.time }}</div>
          </div>
          <div class="win-value">{{ win.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  FundOutlined,
  TrophyOutlined
} from '@ant-design/icons-vue'
import Chart from 'chart.js/auto'

const router = useRouter()

// 时间范围
const timeRange = ref('month')

// 统计数据
const statistics = ref({
  totalDraws: 156,
  totalWins: 89,
  winRate: 57.1,
  totalValue: '¥2,580'
})

// 类型统计
const typeStats = ref([
  { type: 'daily', name: '日常抽奖', count: 68, color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' },
  { type: 'premium', name: '高级抽奖', count: 45, color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
  { type: 'limited', name: '限时抽奖', count: 32, color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' },
  { type: 'ticket', name: '票根抽奖', count: 11, color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)' }
])

// 最近中奖
const recentWins = ref([
  { id: 1, icon: '🎫', prizeName: '50元优惠券', value: '¥50', time: '2025-10-16 14:30' },
  { id: 2, icon: '💎', prizeName: '200积分', value: '200', time: '2025-10-16 10:15' },
  { id: 3, icon: '🎁', prizeName: '神秘礼盒', value: '¥99', time: '2025-10-15 18:45' },
  { id: 4, icon: '🎫', prizeName: '20元优惠券', value: '¥20', time: '2025-10-15 16:20' },
  { id: 5, icon: '💎', prizeName: '100积分', value: '100', time: '2025-10-15 11:30' }
])

// 图表引用
const trendChartRef = ref<HTMLCanvasElement>()
const pieChartRef = ref<HTMLCanvasElement>()

let trendChart: Chart | null = null
let pieChart: Chart | null = null

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  const ctx = trendChartRef.value.getContext('2d')
  if (!ctx) return

  // 销毁旧图表
  if (trendChart) {
    trendChart.destroy()
  }

  // 模拟数据
  const labels = ['10-10', '10-11', '10-12', '10-13', '10-14', '10-15', '10-16']
  const drawData = [12, 15, 18, 14, 20, 22, 25]
  const winData = [7, 9, 10, 8, 11, 13, 15]

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '抽奖次数',
          data: drawData,
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: '中奖次数',
          data: winData,
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return

  const ctx = pieChartRef.value.getContext('2d')
  if (!ctx) return

  // 销毁旧图表
  if (pieChart) {
    pieChart.destroy()
  }

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['优惠券', '积分', '实物奖品', '谢谢参与'],
      datasets: [{
        data: [35, 28, 26, 11],
        backgroundColor: [
          '#FF6B35',
          '#FFD700',
          '#667EEA',
          '#E0E0E0'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  })
}

// 分享
const handleShare = () => {
  message.success('分享功能开发中...')
}

// 监听时间范围变化
watch(timeRange, () => {
  // 重新加载数据和图表
  nextTick(() => {
    initTrendChart()
    initPieChart()
  })
})

// 初始化
onMounted(() => {
  nextTick(() => {
    initTrendChart()
    initPieChart()
  })
})
</script>

<style scoped lang="scss">
.lottery-statistics-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .anticon {
    font-size: 20px;
    cursor: pointer;
  }

  .page-title {
    font-size: 18px;
    font-weight: bold;
  }
}

.time-range-selector {
  padding: 16px;
  background: white;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.overview-section,
.chart-section,
.type-stats-section,
.recent-wins-section {
  background: white;
  padding: 16px;
  margin-bottom: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: bold;
  color: #333;

  .title-icon {
    font-size: 18px;
    color: #FF6B35;
  }
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 12px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.card-label {
  font-size: 12px;
  color: #999;
}

.chart-container {
  height: 250px;
  position: relative;
}

.type-stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.type-stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-info {
  width: 100px;
}

.type-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.type-count {
  font-size: 12px;
  color: #999;
}

.type-progress {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.type-percentage {
  width: 50px;
  text-align: right;
  font-size: 14px;
  font-weight: bold;
  color: #FF6B35;
}

.wins-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.win-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.win-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.win-info {
  flex: 1;
}

.win-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.win-time {
  font-size: 12px;
  color: #999;
}

.win-value {
  font-size: 16px;
  font-weight: bold;
  color: #FF6B35;
}
</style>

