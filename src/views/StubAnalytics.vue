<template>
  <div class="stub-analytics-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <a-button type="text" @click="goBack" class="back-btn">
        <template #icon><LeftOutlined /></template>
      </a-button>
      <span class="title">票根统计</span>
      <a-button type="text" @click="exportReport" class="export-btn">
        <template #icon><DownloadOutlined /></template>
        导出
      </a-button>
    </div>

    <!-- 时间选择 -->
    <div class="time-selector">
      <a-radio-group v-model:value="timeRange" button-style="solid" @change="onTimeRangeChange">
        <a-radio-button value="week">近7天</a-radio-button>
        <a-radio-button value="month">本月</a-radio-button>
        <a-radio-button value="year">本年</a-radio-button>
        <a-radio-button value="all">全部</a-radio-button>
      </a-radio-group>
    </div>

    <!-- 总览卡片 -->
    <div class="overview-cards">
      <div class="overview-card">
        <div class="card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <FileTextOutlined />
        </div>
        <div class="card-content">
          <div class="card-value">{{ statistics.totalTickets }}</div>
          <div class="card-label">票根总数</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
          <DollarOutlined />
        </div>
        <div class="card-content">
          <div class="card-value">¥{{ statistics.totalAmount }}</div>
          <div class="card-label">总金额</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <EnvironmentOutlined />
        </div>
        <div class="card-content">
          <div class="card-value">{{ statistics.totalCities }}</div>
          <div class="card-label">打卡城市</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="card-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <TrophyOutlined />
        </div>
        <div class="card-content">
          <div class="card-value">{{ statistics.totalCategories }}</div>
          <div class="card-label">票根类型</div>
        </div>
      </div>
    </div>

    <!-- 趋势分析 -->
    <div class="chart-section">
      <div class="section-header">
        <h3>票根趋势</h3>
        <a-select v-model:value="trendType" size="small" style="width: 100px">
          <a-select-option value="count">数量</a-select-option>
          <a-select-option value="amount">金额</a-select-option>
        </a-select>
      </div>
      <div class="chart-container">
        <v-chart :option="trendChartOption" autoresize />
      </div>
    </div>

    <!-- 分类统计 -->
    <div class="chart-section">
      <div class="section-header">
        <h3>分类统计</h3>
        <a-radio-group v-model:value="categoryChartType" size="small">
          <a-radio-button value="pie">饼图</a-radio-button>
          <a-radio-button value="bar">柱状图</a-radio-button>
        </a-radio-group>
      </div>
      <div class="chart-container">
        <v-chart :option="categoryChartOption" autoresize />
      </div>
    </div>

    <!-- 城市分布 -->
    <div class="chart-section">
      <div class="section-header">
        <h3>城市分布</h3>
      </div>
      <div class="chart-container">
        <v-chart :option="cityChartOption" autoresize />
      </div>
    </div>

    <!-- 消费分析 -->
    <div class="chart-section">
      <div class="section-header">
        <h3>消费分析</h3>
      </div>
      <div class="spending-stats">
        <div class="stat-item">
          <div class="stat-label">平均消费</div>
          <div class="stat-value">¥{{ statistics.avgAmount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">最高消费</div>
          <div class="stat-value">¥{{ statistics.maxAmount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">最低消费</div>
          <div class="stat-value">¥{{ statistics.minAmount }}</div>
        </div>
      </div>
      <div class="chart-container">
        <v-chart :option="spendingChartOption" autoresize />
      </div>
    </div>

    <!-- 热门榜单 -->
    <div class="rankings-section">
      <div class="section-header">
        <h3>热门榜单</h3>
        <a-segmented v-model:value="rankingType" :options="rankingOptions" size="small" />
      </div>
      <div class="ranking-list">
        <div 
          v-for="(item, index) in currentRanking" 
          :key="index" 
          class="ranking-item"
        >
          <div class="rank-badge" :class="`rank-${index + 1}`">
            {{ index + 1 }}
          </div>
          <div class="rank-content">
            <div class="rank-title">{{ item.name }}</div>
            <div class="rank-subtitle">{{ item.subtitle }}</div>
          </div>
          <div class="rank-value">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <!-- 月度对比 -->
    <div class="chart-section">
      <div class="section-header">
        <h3>月度对比</h3>
      </div>
      <div class="chart-container">
        <v-chart :option="monthlyCompareOption" autoresize />
      </div>
    </div>

    <!-- 年度报告 -->
    <div class="annual-report">
      <div class="section-header">
        <h3>2025年度报告</h3>
        <a-button type="primary" ghost @click="generateAnnualReport">
          生成报告
        </a-button>
      </div>
      <div class="report-preview">
        <div class="report-item">
          <CalendarOutlined class="report-icon" />
          <div class="report-text">
            <div class="report-label">活跃天数</div>
            <div class="report-value">{{ annualReport.activeDays }}天</div>
          </div>
        </div>
        <div class="report-item">
          <StarOutlined class="report-icon" />
          <div class="report-text">
            <div class="report-label">最爱类型</div>
            <div class="report-value">{{ annualReport.favoriteCategory }}</div>
          </div>
        </div>
        <div class="report-item">
          <EnvironmentOutlined class="report-icon" />
          <div class="report-text">
            <div class="report-label">最常去</div>
            <div class="report-value">{{ annualReport.favoriteCity }}</div>
          </div>
        </div>
        <div class="report-item">
          <TrophyOutlined class="report-icon" />
          <div class="report-text">
            <div class="report-label">超越用户</div>
            <div class="report-value">{{ annualReport.beatPercent }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据导出弹窗 -->
    <a-modal
      v-model:open="showExportModal"
      title="导出数据"
      @ok="confirmExport"
    >
      <a-form layout="vertical">
        <a-form-item label="导出格式">
          <a-radio-group v-model:value="exportFormat">
            <a-radio value="pdf">PDF报告</a-radio>
            <a-radio value="excel">Excel表格</a-radio>
            <a-radio value="image">图片</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="包含内容">
          <a-checkbox-group v-model:value="exportContent">
            <a-checkbox value="overview">总览数据</a-checkbox>
            <a-checkbox value="trend">趋势分析</a-checkbox>
            <a-checkbox value="category">分类统计</a-checkbox>
            <a-checkbox value="city">城市分布</a-checkbox>
            <a-checkbox value="spending">消费分析</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { 
  LineChart, 
  BarChart, 
  PieChart,
  RadarChart 
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import {
  LeftOutlined,
  DownloadOutlined,
  FileTextOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  CalendarOutlined,
  StarOutlined
} from '@ant-design/icons-vue'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const router = useRouter()

// 状态管理
const timeRange = ref('month')
const trendType = ref('count')
const categoryChartType = ref('pie')
const rankingType = ref('category')
const showExportModal = ref(false)
const exportFormat = ref('pdf')
const exportContent = ref(['overview', 'trend', 'category', 'city', 'spending'])

// 统计数据
const statistics = ref({
  totalTickets: 128,
  totalAmount: 12580,
  totalCities: 8,
  totalCategories: 6,
  avgAmount: 98.3,
  maxAmount: 599,
  minAmount: 15
})

// 年度报告
const annualReport = ref({
  activeDays: 256,
  favoriteCategory: '电影',
  favoriteCity: '南京',
  beatPercent: 87
})

// 榜单选项
const rankingOptions = [
  { label: '分类', value: 'category' },
  { label: '城市', value: 'city' },
  { label: '商家', value: 'merchant' }
]

// 趋势数据
const trendData = ref({
  dates: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'],
  counts: [12, 15, 18, 14, 20, 16, 22, 19, 24, 28],
  amounts: [980, 1250, 1450, 1180, 1680, 1320, 1850, 1580, 2100, 2380]
})

// 分类数据
const categoryData = ref([
  { name: '电影', value: 45, amount: 4500 },
  { name: '演出', value: 28, amount: 3200 },
  { name: '展览', value: 22, amount: 1800 },
  { name: '景点', value: 18, amount: 1600 },
  { name: '餐饮', value: 10, amount: 980 },
  { name: '其他', value: 5, amount: 500 }
])

// 城市数据
const cityData = ref([
  { name: '南京', value: 56 },
  { name: '上海', value: 28 },
  { name: '杭州', value: 18 },
  { name: '苏州', value: 12 },
  { name: '无锡', value: 8 },
  { name: '其他', value: 6 }
])

// 消费分布数据
const spendingData = ref([
  { range: '0-50', count: 25 },
  { range: '50-100', count: 42 },
  { range: '100-200', count: 35 },
  { range: '200-300', count: 18 },
  { range: '300+', count: 8 }
])

// 月度对比数据
const monthlyData = ref({
  months: ['1月', '2月', '3月', '4月', '5月', '6月'],
  thisYear: [12, 15, 18, 14, 20, 16],
  lastYear: [10, 12, 14, 13, 16, 15]
})

// 榜单数据
const rankings = ref({
  category: [
    { name: '电影', subtitle: '45张票根', value: '35.2%' },
    { name: '演出', subtitle: '28张票根', value: '21.9%' },
    { name: '展览', subtitle: '22张票根', value: '17.2%' },
    { name: '景点', subtitle: '18张票根', value: '14.1%' },
    { name: '餐饮', subtitle: '10张票根', value: '7.8%' }
  ],
  city: [
    { name: '南京', subtitle: '56张票根', value: '43.8%' },
    { name: '上海', subtitle: '28张票根', value: '21.9%' },
    { name: '杭州', subtitle: '18张票根', value: '14.1%' },
    { name: '苏州', subtitle: '12张票根', value: '9.4%' },
    { name: '无锡', subtitle: '8张票根', value: '6.3%' }
  ],
  merchant: [
    { name: '德基影城', subtitle: '12次消费', value: '¥1,580' },
    { name: '保利大剧院', subtitle: '8次消费', value: '¥2,400' },
    { name: '南京博物院', subtitle: '6次消费', value: '¥0' },
    { name: '中山陵', subtitle: '5次消费', value: '¥400' },
    { name: '玄武湖', subtitle: '4次消费', value: '¥0' }
  ]
})

// 计算属性
const currentRanking = computed(() => {
  return rankings.value[rankingType.value as keyof typeof rankings.value] || []
})

// 趋势图表配置
const trendChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: trendData.value.dates,
    boundaryGap: false
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: trendType.value === 'count' ? '票根数量' : '消费金额',
    type: 'line',
    smooth: true,
    data: trendType.value === 'count' ? trendData.value.counts : trendData.value.amounts,
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(102, 126, 234, 0.5)'
        }, {
          offset: 1,
          color: 'rgba(102, 126, 234, 0.1)'
        }]
      }
    },
    itemStyle: {
      color: '#667eea'
    },
    lineStyle: {
      width: 3
    }
  }]
}))

// 分类图表配置
const categoryChartOption = computed(() => {
  if (categoryChartType.value === 'pie') {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: categoryData.value.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa8c16', '#999'][index]
          }
        }))
      }]
    }
  } else {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categoryData.value.map(item => item.name)
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'bar',
        data: categoryData.value.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa8c16', '#999'][index]
          }
        })),
        barWidth: '60%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0]
        }
      }]
    }
  }
})

// 城市图表配置
const cityChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}张 ({d}%)'
  },
  series: [{
    type: 'pie',
    radius: '70%',
    center: ['50%', '50%'],
    data: cityData.value.map((item, index) => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa8c16', '#999'][index]
      }
    })),
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
    label: {
      formatter: '{b}\n{c}张'
    }
  }]
}))

// 消费分析图表配置
const spendingChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: spendingData.value.map(item => item.range)
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    type: 'bar',
    data: spendingData.value.map(item => item.count),
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: '#667eea'
        }, {
          offset: 1,
          color: '#764ba2'
        }]
      },
      borderRadius: [8, 8, 0, 0]
    },
    barWidth: '50%'
  }]
}))

// 月度对比图表配置
const monthlyCompareOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['2025年', '2024年']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: monthlyData.value.months
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '2025年',
      type: 'bar',
      data: monthlyData.value.thisYear,
      itemStyle: {
        color: '#667eea',
        borderRadius: [8, 8, 0, 0]
      }
    },
    {
      name: '2024年',
      type: 'bar',
      data: monthlyData.value.lastYear,
      itemStyle: {
        color: '#e0e0e0',
        borderRadius: [8, 8, 0, 0]
      }
    }
  ]
}))

// 方法
const goBack = () => {
  router.back()
}

const onTimeRangeChange = () => {
  message.info(`切换到${timeRange.value}数据`)
}

const exportReport = () => {
  showExportModal.value = true
}

const confirmExport = () => {
  message.success(`正在导出${exportFormat.value}格式报告...`)
  showExportModal.value = false
}

const generateAnnualReport = () => {
  message.success('正在生成年度报告...')
}
</script>

<style scoped>
.stub-analytics-page {
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
.export-btn {
  color: white !important;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.time-selector {
  background: white;
  padding: 12px 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 16px;
}

.overview-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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

.chart-section,
.rankings-section,
.annual-report {
  background: white;
  padding: 16px;
  margin: 0 16px 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.chart-container {
  height: 250px;
}

.spending-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  background: #999;
  flex-shrink: 0;
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #cd7f32 0%, #daa520 100%);
}

.rank-content {
  flex: 1;
}

.rank-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.rank-subtitle {
  font-size: 12px;
  color: #999;
}

.rank-value {
  font-weight: bold;
  color: #667eea;
}

.report-preview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.report-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
}

.report-icon {
  font-size: 32px;
  color: #667eea;
}

.report-text {
  flex: 1;
}

.report-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.report-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>

