<template>
  <div class="logistics-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <LeftOutlined />
      </div>
      <div class="page-title">物流追踪</div>
      <div class="placeholder"></div>
    </div>

    <!-- 物流公司信息 -->
    <div class="logistics-header">
      <div class="company-info">
        <div class="company-logo">
          <CarFilled />
        </div>
        <div class="company-detail">
          <div class="company-name">{{ logistics.company }}</div>
          <div class="tracking-number">
            <span>运单号: {{ logistics.trackingNo }}</span>
            <CopyOutlined class="copy-icon" @click="copyTrackingNo" />
          </div>
        </div>
      </div>
      <div class="current-status">
        <div class="status-text">{{ logistics.currentStatus }}</div>
        <div class="status-time">{{ logistics.currentTime }}</div>
      </div>
    </div>

    <!-- 物流时间轴 -->
    <div class="logistics-timeline">
      <a-timeline>
        <a-timeline-item 
          v-for="(record, index) in logistics.records" 
          :key="index"
          :color="index === 0 ? '#FF6B35' : '#d9d9d9'"
        >
          <template #dot>
            <div class="timeline-dot" :class="{ active: index === 0 }">
              <CheckCircleFilled v-if="index === 0" />
              <div v-else class="dot-circle"></div>
            </div>
          </template>
          <div class="timeline-content">
            <div class="record-desc" :class="{ active: index === 0 }">
              {{ record.desc }}
            </div>
            <div class="record-time">{{ record.time }}</div>
            <div v-if="record.location" class="record-location">
              <EnvironmentOutlined />
              {{ record.location }}
            </div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>

    <!-- 联系客服 -->
    <div class="contact-service">
      <a-button type="primary" size="large" block @click="contactService">
        <PhoneFilled />
        联系客服
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  CarFilled,
  CopyOutlined,
  CheckCircleFilled,
  EnvironmentOutlined,
  PhoneFilled
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 模拟物流数据
const logistics = ref({
  company: '顺丰速运',
  trackingNo: 'SF1234567890',
  currentStatus: '运输中',
  currentTime: '2024-10-14 16:30:00',
  records: [
    {
      time: '2024-10-14 16:30:00',
      desc: '快件已到达【南京鼓楼营业点】,正在派送中',
      location: '江苏省南京市鼓楼区'
    },
    {
      time: '2024-10-14 14:20:00',
      desc: '快件已到达【南京转运中心】',
      location: '江苏省南京市'
    },
    {
      time: '2024-10-14 10:15:00',
      desc: '快件已从【上海转运中心】发出,准备发往【南京转运中心】',
      location: '上海市'
    },
    {
      time: '2024-10-14 08:30:00',
      desc: '快件已到达【上海转运中心】',
      location: '上海市'
    },
    {
      time: '2024-10-14 06:00:00',
      desc: '快件已从【杭州转运中心】发出,准备发往【上海转运中心】',
      location: '浙江省杭州市'
    },
    {
      time: '2024-10-14 02:30:00',
      desc: '快件已到达【杭州转运中心】',
      location: '浙江省杭州市'
    },
    {
      time: '2024-10-13 20:00:00',
      desc: '快件已从【杭州西湖营业点】发出',
      location: '浙江省杭州市西湖区'
    },
    {
      time: '2024-10-13 18:30:00',
      desc: '快件已由【杭州西湖营业点】揽收',
      location: '浙江省杭州市西湖区'
    },
    {
      time: '2024-10-13 15:00:00',
      desc: '商家正在出库,准备发货',
      location: ''
    }
  ]
})

// 方法
const goBack = () => {
  router.back()
}

const copyTrackingNo = () => {
  // 实际应使用clipboard API
  message.success('运单号已复制')
}

const contactService = () => {
  message.info('正在为您转接客服...')
}
</script>

<style scoped>
.logistics-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部导航栏 */
.top-bar {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn,
.placeholder {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
}

/* 物流公司信息 */
.logistics-header {
  background: #fff;
  padding: 20px 15px;
  margin-bottom: 10px;
}

.company-info {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.company-logo {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
}

.company-detail {
  flex: 1;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.tracking-number {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.copy-icon {
  cursor: pointer;
  color: #FF6B35;
}

.current-status {
  background: linear-gradient(135deg, #FFF5F0 0%, #FFE8D9 100%);
  padding: 12px 15px;
  border-radius: 8px;
}

.status-text {
  font-size: 15px;
  font-weight: 600;
  color: #FF6B35;
  margin-bottom: 4px;
}

.status-time {
  font-size: 13px;
  color: #999;
}

/* 物流时间轴 */
.logistics-timeline {
  background: #fff;
  padding: 20px 15px;
  margin-bottom: 10px;
}

.timeline-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.timeline-dot.active {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
}

.dot-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9d9d9;
}

.timeline-content {
  padding-bottom: 20px;
}

.record-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 6px;
}

.record-desc.active {
  color: #333;
  font-weight: 600;
}

.record-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.record-location {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 联系客服 */
.contact-service {
  padding: 15px;
}

.contact-service :deep(.ant-btn) {
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border: none;
}
</style>

