<template>
  <div class="match-calendar-page">
    <!-- 头部导航 -->
    <div class="header">
      <LeftOutlined class="back-icon" @click="goBack" />
      <span class="title">赛事日历</span>
      <CalendarOutlined class="calendar-icon" @click="showCalendarModal = true" />
    </div>

    <!-- 月份选择器 -->
    <div class="month-selector">
      <LeftOutlined @click="prevMonth" />
      <span class="current-month">{{ currentMonthText }}</span>
      <RightOutlined @click="nextMonth" />
    </div>

    <!-- 日历视图 -->
    <div class="calendar-view">
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      <div class="dates">
        <div
          v-for="date in calendarDates"
          :key="date.key"
          :class="['date-cell', {
            'other-month': date.otherMonth,
            'today': date.isToday,
            'has-match': date.hasMatch,
            'selected': date.selected
          }]"
          @click="selectDate(date)"
        >
          <div class="date-number">{{ date.day }}</div>
          <div v-if="date.matchCount" class="match-dot">{{ date.matchCount }}</div>
        </div>
      </div>
    </div>

    <!-- 赛事列表 -->
    <div class="match-list">
      <div class="list-header">
        <span class="list-title">{{ selectedDateText }}的赛事</span>
        <a-radio-group v-model:value="filterType" button-style="solid" size="small">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="home">主场</a-radio-button>
          <a-radio-button value="away">客场</a-radio-button>
        </a-radio-group>
      </div>

      <div v-if="filteredMatches.length === 0" class="empty-state">
        <CalendarOutlined style="font-size: 48px; color: #d9d9d9;" />
        <p>当天暂无赛事</p>
      </div>

      <div v-else class="matches">
        <div
          v-for="match in filteredMatches"
          :key="match.id"
          class="match-card"
          @click="viewMatchDetail(match)"
        >
          <div class="match-time">
            <ClockCircleOutlined />
            <span>{{ match.time }}</span>
            <a-tag v-if="match.status === 'live'" color="red">直播中</a-tag>
            <a-tag v-else-if="match.status === 'upcoming'" color="blue">未开始</a-tag>
            <a-tag v-else color="default">已结束</a-tag>
          </div>

          <div class="match-info">
            <div class="team home-team">
              <img v-img-fallback :src="match.homeTeam.logo" :alt="match.homeTeam.name" />
              <span class="team-name">{{ match.homeTeam.name }}</span>
              <span v-if="match.status === 'finished'" class="score">{{ match.homeScore }}</span>
            </div>

            <div class="vs">VS</div>

            <div class="team away-team">
              <span v-if="match.status === 'finished'" class="score">{{ match.awayScore }}</span>
              <span class="team-name">{{ match.awayTeam.name }}</span>
              <img v-img-fallback :src="match.awayTeam.logo" :alt="match.awayTeam.name" />
            </div>
          </div>

          <div class="match-venue">
            <EnvironmentOutlined />
            <span>{{ match.venue }}</span>
          </div>

          <div class="match-actions">
            <a-button v-if="match.status === 'upcoming'" type="primary" size="small">
              <ShoppingOutlined />
              购票
            </a-button>
            <a-button v-if="match.status === 'live'" type="primary" danger size="small">
              <PlayCircleOutlined />
              观看直播
            </a-button>
            <a-button v-if="match.status === 'finished'" size="small">
              <EyeOutlined />
              查看回放
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 日历选择弹窗 -->
    <a-modal
      v-model:open="showCalendarModal"
      title="选择日期"
      :footer="null"
      width="90%"
    >
      <a-calendar
        :fullscreen="false"
        @select="onCalendarSelect"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  PlayCircleOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const router = useRouter()

// 当前月份
const currentMonth = ref(dayjs())

// 选中的日期
const selectedDate = ref(dayjs())

// 筛选类型
const filterType = ref('all')

// 日历弹窗
const showCalendarModal = ref(false)

// 星期
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 赛事数据
const matches = ref([
  {
    id: 1,
    date: '2025-10-18',
    time: '19:30',
    homeTeam: {
      name: '南京队',
      logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Cdefs%3E%3ClinearGradient id="t1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="20" fill="url(%23t1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E南%3C/text%3E%3C/svg%3E'
    },
    awayTeam: {
      name: '苏州队',
      logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Cdefs%3E%3ClinearGradient id="t2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="20" fill="url(%23t2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E苏%3C/text%3E%3C/svg%3E'
    },
    homeScore: null,
    awayScore: null,
    venue: '南京奥体中心',
    status: 'upcoming',
    type: 'home'
  },
  {
    id: 2,
    date: '2025-10-20',
    time: '15:00',
    homeTeam: {
      name: '无锡队',
      logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Cdefs%3E%3ClinearGradient id="t3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="20" fill="url(%23t3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E无%3C/text%3E%3C/svg%3E'
    },
    awayTeam: {
      name: '南京队',
      logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Cdefs%3E%3ClinearGradient id="t1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="20" fill="url(%23t1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E南%3C/text%3E%3C/svg%3E'
    },
    homeScore: null,
    awayScore: null,
    venue: '无锡体育中心',
    status: 'upcoming',
    type: 'away'
  },
  {
    id: 3,
    date: '2025-10-16',
    time: '19:30',
    homeTeam: {
      name: '南京队',
      logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Cdefs%3E%3ClinearGradient id="t1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="20" fill="url(%23t1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E南%3C/text%3E%3C/svg%3E'
    },
    awayTeam: {
      name: '常州队',
      logo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Cdefs%3E%3ClinearGradient id="t4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx="20" cy="20" r="20" fill="url(%23t4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-weight="bold" font-family="Arial"%3E常%3C/text%3E%3C/svg%3E'
    },
    homeScore: 2,
    awayScore: 1,
    venue: '南京奥体中心',
    status: 'finished',
    type: 'home'
  }
])

// 当前月份文本
const currentMonthText = computed(() => {
  return currentMonth.value.format('YYYY年MM月')
})

// 选中日期文本
const selectedDateText = computed(() => {
  return selectedDate.value.format('MM月DD日')
})

// 生成日历日期
const calendarDates = computed(() => {
  const dates: any[] = []
  const firstDay = currentMonth.value.startOf('month')
  const lastDay = currentMonth.value.endOf('month')
  const startDate = firstDay.startOf('week')
  const endDate = lastDay.endOf('week')

  let current = startDate
  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    const dateStr = current.format('YYYY-MM-DD')
    const matchCount = matches.value.filter(m => m.date === dateStr).length

    dates.push({
      key: dateStr,
      day: current.date(),
      date: current,
      otherMonth: !current.isSame(currentMonth.value, 'month'),
      isToday: current.isSame(dayjs(), 'day'),
      hasMatch: matchCount > 0,
      matchCount: matchCount,
      selected: current.isSame(selectedDate.value, 'day')
    })

    current = current.add(1, 'day')
  }

  return dates
})

// 筛选后的赛事
const filteredMatches = computed(() => {
  const dateStr = selectedDate.value.format('YYYY-MM-DD')
  let filtered = matches.value.filter(m => m.date === dateStr)

  if (filterType.value !== 'all') {
    filtered = filtered.filter(m => m.type === filterType.value)
  }

  return filtered
})

// 上一月
const prevMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, 'month')
}

// 下一月
const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, 'month')
}

// 选择日期
const selectDate = (date: any) => {
  if (date.otherMonth) {
    currentMonth.value = date.date
  }
  selectedDate.value = date.date
}

// 日历选择
const onCalendarSelect = (date: Dayjs) => {
  selectedDate.value = date
  currentMonth.value = date
  showCalendarModal.value = false
}

// 查看赛事详情
const viewMatchDetail = (match: any) => {
  message.info('赛事详情功能开发中')
}

// 返回
const goBack = () => {
  router.back()
}

onMounted(() => {
  // 初始化
})
</script>

<style scoped lang="scss">
.match-calendar-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  .back-icon,
  .calendar-icon {
    font-size: 20px;
    cursor: pointer;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}

.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: white;
  gap: 20px;

  .current-month {
    font-size: 16px;
    font-weight: bold;
    min-width: 120px;
    text-align: center;
  }

  .anticon {
    font-size: 18px;
    cursor: pointer;
    color: #667eea;

    &:hover {
      color: #764ba2;
    }
  }
}

.calendar-view {
  background: white;
  margin: 12px;
  border-radius: 8px;
  padding: 16px;

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    margin-bottom: 8px;

    .weekday {
      text-align: center;
      font-size: 14px;
      color: #666;
      font-weight: bold;
    }
  }

  .dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;

    .date-cell {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s;

      &:hover {
        background: #f0f0f0;
      }

      &.other-month {
        .date-number {
          color: #ccc;
        }
      }

      &.today {
        .date-number {
          color: #667eea;
          font-weight: bold;
        }
      }

      &.has-match {
        background: #f0f5ff;
      }

      &.selected {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        .date-number {
          color: white !important;
        }

        .match-dot {
          background: white;
          color: #667eea;
        }
      }

      .date-number {
        font-size: 14px;
      }

      .match-dot {
        position: absolute;
        bottom: 2px;
        min-width: 16px;
        height: 16px;
        background: #ff4d4f;
        color: white;
        border-radius: 8px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 4px;
      }
    }
  }
}

.match-list {
  margin: 12px;

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .list-title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .empty-state {
    background: white;
    border-radius: 8px;
    padding: 60px 20px;
    text-align: center;

    p {
      margin-top: 16px;
      color: #999;
    }
  }

  .matches {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .match-card {
      background: white;
      border-radius: 8px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .match-time {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .match-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        .team {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }

          .team-name {
            font-size: 16px;
            font-weight: bold;
          }

          .score {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            min-width: 30px;
            text-align: center;
          }

          &.away-team {
            flex-direction: row-reverse;
            text-align: right;
          }
        }

        .vs {
          font-size: 14px;
          color: #999;
          margin: 0 16px;
        }
      }

      .match-venue {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        font-size: 14px;
        margin-bottom: 12px;
      }

      .match-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
    }
  }
}
</style>

