<template>
  <div class="lottery-hall-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">抽奖大厅</span>
      <HistoryOutlined @click="router.push('/lottery-records')" />
    </div>

    <!-- Banner -->
    <div class="hall-banner">
      <div class="banner-content">
        <div class="banner-title">🎁 上传票根 参与抽奖</div>
        <div class="banner-desc">每张票根都有机会赢取丰厚奖品</div>
      </div>
    </div>

    <!-- 活动筛选 -->
    <div class="activity-tabs">
      <div 
        v-for="tab in activityTabs" 
        :key="tab.value"
        class="tab-item"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="activities-list">
      <div 
        v-for="activity in filteredActivities" 
        :key="activity.id"
        class="activity-card"
        @click="viewDetail(activity)"
      >
        <!-- 活动头部 -->
        <div class="activity-header">
          <div class="activity-title">{{ activity.title }}</div>
          <div class="activity-status" :class="activity.status">
            {{ getStatusText(activity.status) }}
          </div>
        </div>

        <!-- 活动描述 -->
        <div class="activity-desc">{{ activity.description }}</div>

        <!-- 奖品预览 -->
        <div class="prizes-preview">
          <div class="prize-tag" v-for="(prize, index) in activity.topPrizes" :key="index">
            {{ prize }}
          </div>
        </div>

        <!-- 活动信息 -->
        <div class="activity-info">
          <div class="info-item">
            <ClockCircleOutlined class="info-icon" />
            <span v-if="activity.status === 'ongoing'">
              距离开奖: {{ activity.countdown }}
            </span>
            <span v-else-if="activity.status === 'upcoming'">
              {{ activity.startTime }} 开始
            </span>
            <span v-else>
              已于 {{ activity.endTime }} 结束
            </span>
          </div>
          <div class="info-item">
            <TeamOutlined class="info-icon" />
            <span>{{ activity.participants }}人参与</span>
          </div>
        </div>

        <!-- 参与按钮 -->
        <div class="activity-action">
          <a-button 
            v-if="activity.status === 'ongoing'" 
            type="primary" 
            block
            @click.stop="participate(activity)"
          >
            立即参与
          </a-button>
          <a-button 
            v-else-if="activity.status === 'upcoming'" 
            block
            disabled
          >
            即将开始
          </a-button>
          <a-button 
            v-else 
            block
            @click.stop="viewDetail(activity)"
          >
            查看结果
          </a-button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredActivities.length === 0" class="empty-state">
        <GiftOutlined class="empty-icon" />
        <div class="empty-text">暂无抽奖活动</div>
        <div class="empty-tip">敬请期待更多精彩活动</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  LeftOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  GiftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 活动筛选标签
const activityTabs = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '进行中' },
  { value: 'upcoming', label: '即将开始' },
  { value: 'ended', label: '已结束' }
]

// 当前选中的标签
const activeTab = ref('ongoing')

// 活动列表数据
const activities = ref([
  {
    id: 1,
    title: '大连消费券大抽奖',
    description: '上传大连地区消费票根,即可参与抽奖',
    status: 'ongoing',
    startTime: '2025-10-10 00:00',
    endTime: '2025-10-20 23:59',
    drawTime: '2025-10-21 10:00',
    countdown: '2天3小时',
    participants: 1234,
    topPrizes: ['500元消费券', '200元消费券', '50元消费券'],
    city: '大连'
  },
  {
    id: 2,
    title: '体育赛事门票抽奖',
    description: '上传体育赛事门票,赢取下场比赛门票',
    status: 'ongoing',
    startTime: '2025-10-12 00:00',
    endTime: '2025-10-22 23:59',
    drawTime: '2025-10-23 10:00',
    countdown: '4天5小时',
    participants: 856,
    topPrizes: ['VIP门票', '普通门票', '周边礼品'],
    city: '大连'
  },
  {
    id: 3,
    title: '上海本地生活抽奖',
    description: '上传上海地区消费票根,赢取本地生活权益',
    status: 'upcoming',
    startTime: '2025-10-18 00:00',
    endTime: '2025-10-28 23:59',
    drawTime: '2025-10-29 10:00',
    countdown: '',
    participants: 0,
    topPrizes: ['1000元消费券', '500元消费券', '100元消费券'],
    city: '上海'
  },
  {
    id: 4,
    title: '春节消费大抽奖',
    description: '上传春节期间消费票根,瓜分百万奖池',
    status: 'ended',
    startTime: '2025-01-20 00:00',
    endTime: '2025-02-10 23:59',
    drawTime: '2025-02-11 10:00',
    countdown: '',
    participants: 5678,
    topPrizes: ['5000元现金', '2000元现金', '500元现金'],
    city: '全国'
  }
])

// 过滤后的活动列表
const filteredActivities = computed(() => {
  if (activeTab.value === 'all') {
    return activities.value
  }
  return activities.value.filter(activity => activity.status === activeTab.value)
})

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    ongoing: '进行中',
    upcoming: '即将开始',
    ended: '已结束'
  }
  return texts[status] || '未知'
}

// 查看详情
const viewDetail = (activity: any) => {
  router.push(`/lottery-detail/${activity.id}`)
}

// 参与抽奖
const participate = (activity: any) => {
  router.push(`/get-lottery-code?activityId=${activity.id}`)
}
</script>

<style scoped lang="scss">
.lottery-hall-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  .anticon {
    font-size: 20px;
    cursor: pointer;
  }

  .page-title {
    font-size: 18px;
    font-weight: 500;
  }
}

.hall-banner {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  margin: 15px;
  padding: 30px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);

  .banner-content {
    text-align: center;

    .banner-title {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8px;
    }

    .banner-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

.activity-tabs {
  display: flex;
  background: #fff;
  margin: 0 15px 15px;
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    color: #666;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
      color: #fff;
      font-weight: 500;
    }
  }
}

.activities-list {
  padding: 0 15px;

  .activity-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
    }

    .activity-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .activity-title {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        flex: 1;
      }

      .activity-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        flex-shrink: 0;
        margin-left: 10px;

        &.ongoing {
          background: #f6ffed;
          color: #52c41a;
        }

        &.upcoming {
          background: #e6f7ff;
          color: #1890ff;
        }

        &.ended {
          background: #f5f5f5;
          color: #999;
        }
      }
    }

    .activity-desc {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
      line-height: 1.6;
    }

    .prizes-preview {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 15px;

      .prize-tag {
        padding: 6px 12px;
        background: linear-gradient(135deg, #fff5e6 0%, #ffe7ba 100%);
        color: #ff6b35;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 500;
      }
    }

    .activity-info {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
      padding: 12px;
      background: #fafafa;
      border-radius: 8px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #666;

        .info-icon {
          color: #ff6b35;
        }
      }
    }

    .activity-action {
      margin-top: 15px;
    }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;

    .empty-icon {
      font-size: 80px;
      color: #d9d9d9;
      margin-bottom: 20px;
    }

    .empty-text {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
    }

    .empty-tip {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>

