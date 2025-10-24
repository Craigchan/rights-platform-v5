<template>
  <div class="get-lottery-code-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">获取抽奖码</span>
      <div class="placeholder"></div>
    </div>

    <!-- 活动信息 -->
    <div class="activity-info">
      <div class="activity-name">{{ activity.title }}</div>
      <div class="activity-tip">选择已审核通过的票根获取抽奖码</div>
    </div>

    <!-- 可用票根列表 -->
    <div class="tickets-section">
      <div class="section-header">
        <span class="section-title">可用票根 ({{ availableTickets.length }})</span>
        <span class="upload-link" @click="router.push('/ticket-upload')">
          <PlusOutlined /> 上传票根
        </span>
      </div>

      <div class="tickets-list">
        <div 
          v-for="ticket in availableTickets" 
          :key="ticket.id"
          class="ticket-card"
          :class="{ selected: selectedTicket === ticket.id }"
          @click="selectTicket(ticket)"
        >
          <div class="ticket-checkbox">
            <CheckCircleFilled v-if="selectedTicket === ticket.id" />
            <div v-else class="checkbox-empty"></div>
          </div>

          <div class="ticket-image">
            <img v-img-fallback :src="ticket.image" alt="票根图片" />
          </div>

          <div class="ticket-info">
            <div class="ticket-name">{{ ticket.merchantName }}</div>
            <div class="ticket-amount">¥{{ ticket.amount }}</div>
            <div class="ticket-time">{{ ticket.consumeTime }}</div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="availableTickets.length === 0" class="empty-state">
          <FileImageOutlined class="empty-icon" />
          <div class="empty-text">暂无可用票根</div>
          <div class="empty-tip">上传消费票根,审核通过后即可参与抽奖</div>
          <a-button type="primary" @click="router.push('/ticket-upload')">
            立即上传
          </a-button>
        </div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="bottom-actions">
      <a-button 
        type="primary" 
        size="large" 
        block
        :disabled="!selectedTicket"
        @click="getLotteryCode"
      >
        获取抽奖码
      </a-button>
    </div>

    <!-- 成功弹窗 -->
    <a-modal
      v-model:open="showSuccessModal"
      :footer="null"
      :closable="false"
      centered
    >
      <div class="success-modal">
        <CheckCircleFilled class="success-icon" />
        <div class="success-title">获取成功!</div>
        <div class="lottery-code">{{ lotteryCode }}</div>
        <div class="success-tip">抽奖码已生成,请等待开奖</div>
        <div class="success-actions">
          <a-button type="primary" block @click="goToLottery">
            立即抽奖
          </a-button>
          <a-button block @click="viewMyCodes" style="margin-top: 10px">
            查看我的抽奖码
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { 
  LeftOutlined,
  PlusOutlined,
  CheckCircleFilled,
  FileImageOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 活动信息
const activity = ref({
  id: 1,
  title: '大连消费券大抽奖'
})

// 选中的票根
const selectedTicket = ref<number | null>(null)

// 抽奖码
const lotteryCode = ref('')

// 显示成功弹窗
const showSuccessModal = ref(false)

// 可用票根列表
const availableTickets = ref([
  {
    id: 1,
    merchantName: '大连人 vs 上海海港',
    amount: '180.00',
    consumeTime: '2025-10-15 19:30',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Cdefs%3E%3ClinearGradient id="gl1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23FF6B35;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23F7931E;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="60" fill="url(%23gl1)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="10" font-weight="bold" font-family="Arial"%3E体育%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 3,
    merchantName: '大商新玛特',
    amount: '328.50',
    consumeTime: '2025-10-13 15:20',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Cdefs%3E%3ClinearGradient id="gl2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238338EC;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23722ED1;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="60" fill="url(%23gl2)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="10" font-weight="bold" font-family="Arial"%3E购物%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 4,
    merchantName: '海底捞火锅',
    amount: '456.00',
    consumeTime: '2025-10-12 19:00',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Cdefs%3E%3ClinearGradient id="gl3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2352C41A;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2373D13D;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="60" fill="url(%23gl3)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="10" font-weight="bold" font-family="Arial"%3E餐饮%3C/text%3E%3C/svg%3E',
    used: false
  },
  {
    id: 5,
    merchantName: '大连体育中心游泳馆',
    amount: '50.00',
    consumeTime: '2025-10-11 10:00',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Cdefs%3E%3ClinearGradient id="gl4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2300A8E8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233A86FF;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="80" height="60" fill="url(%23gl4)" /%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-size="10" font-weight="bold" font-family="Arial"%3E游泳%3C/text%3E%3C/svg%3E',
    used: false
  }
])

// 选择票根
const selectTicket = (ticket: any) => {
  selectedTicket.value = ticket.id
}

// 获取抽奖码
const getLotteryCode = () => {
  if (!selectedTicket.value) {
    message.error('请选择一张票根')
    return
  }

  // 生成抽奖码(模拟)
  lotteryCode.value = `LC${Date.now().toString().slice(-8)}`
  
  // 显示成功弹窗
  showSuccessModal.value = true

  // 标记票根已使用
  const ticket = availableTickets.value.find(t => t.id === selectedTicket.value)
  if (ticket) {
    ticket.used = true
  }

  // 清空选中
  selectedTicket.value = null
}

// 去抽奖
const goToLottery = () => {
  showSuccessModal.value = false
  
  const ticket = availableTickets.value.find(t => t.used)
  
  router.push({
    path: '/lottery-draw',
    query: {
      activityId: route.query.activityId || activity.value.id,
      activityName: route.query.activityName || activity.value.title,
      code: lotteryCode.value,
      ticketId: ticket?.id
    }
  })
}

// 查看我的抽奖码
const viewMyCodes = () => {
  showSuccessModal.value = false
  router.push('/lottery-records')
}

// 关闭成功弹窗
const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>

<style scoped lang="scss">
.get-lottery-code-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
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

  .placeholder {
    width: 20px;
  }
}

.activity-info {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  padding: 20px;
  text-align: center;

  .activity-name {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8px;
  }

  .activity-tip {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.tickets-section {
  padding: 15px;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .upload-link {
      font-size: 14px;
      color: #ff6b35;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;

      &:active {
        opacity: 0.7;
      }
    }
  }

  .tickets-list {
    .ticket-card {
      background: #fff;
      border-radius: 12px;
      padding: 15px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;

      &.selected {
        border-color: #ff6b35;
        background: linear-gradient(135deg, #fff5e6 0%, #ffe7ba 100%);
      }

      &:active {
        transform: scale(0.98);
      }

      .ticket-checkbox {
        .anticon {
          font-size: 24px;
          color: #ff6b35;
        }

        .checkbox-empty {
          width: 24px;
          height: 24px;
          border: 2px solid #d9d9d9;
          border-radius: 50%;
        }
      }

      .ticket-image {
        width: 80px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .ticket-info {
        flex: 1;

        .ticket-name {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
        }

        .ticket-amount {
          font-size: 16px;
          font-weight: bold;
          color: #ff6b35;
          margin-bottom: 4px;
        }

        .ticket-time {
          font-size: 13px;
          color: #999;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;

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
        margin-bottom: 24px;
        line-height: 1.6;
      }
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}

.success-modal {
  text-align: center;
  padding: 20px 0;

  .success-icon {
    font-size: 64px;
    color: #52c41a;
    margin-bottom: 20px;
  }

  .success-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .lottery-code {
    font-size: 32px;
    font-weight: bold;
    color: #ff6b35;
    letter-spacing: 4px;
    margin-bottom: 15px;
    padding: 20px;
    background: linear-gradient(135deg, #fff5e6 0%, #ffe7ba 100%);
    border-radius: 12px;
  }

  .success-tip {
    font-size: 14px;
    color: #666;
    margin-bottom: 30px;
  }

  .success-actions {
    padding: 0 20px;
  }
}
</style>

