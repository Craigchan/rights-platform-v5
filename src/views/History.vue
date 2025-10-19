<template>
  <div class="history-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">浏览历史</span>
      <span class="header-action" @click="clearAll">
        <DeleteOutlined /> 清空
      </span>
    </div>

    <!-- 浏览历史列表 -->
    <div class="history-container">
      <div v-if="historyByDate.length > 0">
        <div 
          v-for="group in historyByDate" 
          :key="group.date"
          class="history-group"
        >
          <div class="date-header">{{ group.date }}</div>
          <div class="history-list">
            <div 
              v-for="item in group.items" 
              :key="item.id"
              class="history-card"
              @click="viewDetail(item)"
            >
              <div class="item-image">
                <div class="image-placeholder" :style="{ background: item.color }">
                  <ShoppingOutlined />
                </div>
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-desc">{{ item.description }}</div>
                <div class="item-meta">
                  <span v-if="item.price" class="item-price">¥{{ item.price }}</span>
                  <span v-if="item.points" class="item-points">{{ item.points }}积分</span>
                  <span class="item-time">{{ item.time }}</span>
                </div>
              </div>
              <div class="item-actions">
                <DeleteOutlined 
                  class="delete-icon" 
                  @click.stop="deleteItem(item.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <HistoryOutlined class="empty-icon" />
        <div class="empty-text">暂无浏览记录</div>
        <div class="empty-tip">浏览过的商品会显示在这里</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  LeftOutlined,
  DeleteOutlined,
  HistoryOutlined,
  ShoppingOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 浏览历史数据
interface HistoryItem {
  id: number
  name: string
  description: string
  price?: number
  points?: number
  time: string
  date: string
  color: string
}

const historyItems = ref<HistoryItem[]>([
  {
    id: 1,
    name: '小米手环8',
    description: 'NFC版 黑色',
    price: 299,
    time: '18:30',
    date: '今天',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    description: '降噪版 白色',
    points: 1500,
    time: '15:20',
    date: '今天',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 3,
    name: '星巴克咖啡券',
    description: '中杯拿铁',
    points: 500,
    time: '10:15',
    date: '今天',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 4,
    name: '运动水杯',
    description: '500ml 蓝色',
    price: 59,
    time: '20:45',
    date: '昨天',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    id: 5,
    name: '京东购物卡',
    description: '50元',
    points: 5000,
    time: '16:30',
    date: '昨天',
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  },
  {
    id: 6,
    name: '电影票兑换券',
    description: '2张',
    points: 800,
    time: '14:20',
    date: '昨天',
    color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  {
    id: 7,
    name: '智能手表',
    description: '运动版 黑色',
    price: 1299,
    time: '11:15',
    date: '10月13日',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 8,
    name: '保温杯',
    description: '316不锈钢 500ml',
    price: 89,
    time: '09:30',
    date: '10月13日',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
])

// 按日期分组
const historyByDate = computed(() => {
  const groups: Record<string, HistoryItem[]> = {}
  
  historyItems.value.forEach(item => {
    if (!groups[item.date]) {
      groups[item.date] = []
    }
    groups[item.date].push(item)
  })
  
  return Object.keys(groups).map(date => ({
    date,
    items: groups[date]
  }))
})

// 删除单个记录
const deleteItem = (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条浏览记录吗?',
    onOk: () => {
      const index = historyItems.value.findIndex(item => item.id === id)
      if (index > -1) {
        historyItems.value.splice(index, 1)
        message.success('删除成功')
      }
    }
  })
}

// 清空全部
const clearAll = () => {
  if (historyItems.value.length === 0) {
    message.info('暂无浏览记录')
    return
  }
  
  Modal.confirm({
    title: '确认清空',
    content: '确定要清空所有浏览记录吗?',
    onOk: () => {
      historyItems.value = []
      message.success('已清空')
    }
  })
}

// 查看详情
const viewDetail = (item: HistoryItem) => {
  router.push('/product-detail')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.header-action {
  font-size: 15px;
  color: #FF6B35;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 历史记录容器 */
.history-container {
  padding: 12px 16px;
}

.history-group {
  margin-bottom: 20px;
}

.date-header {
  font-size: 14px;
  color: #999;
  padding: 8px 0;
  font-weight: 500;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.history-card:active {
  transform: scale(0.98);
}

.item-image {
  flex-shrink: 0;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.item-price {
  color: #FF6B35;
  font-size: 16px;
  font-weight: bold;
}

.item-points {
  color: #FF6B35;
  font-weight: 500;
}

.item-time {
  color: #bbb;
}

.item-actions {
  display: flex;
  align-items: center;
}

.delete-icon {
  font-size: 18px;
  color: #bbb;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s;
}

.delete-icon:hover {
  color: #ff4d4f;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
}

.empty-icon {
  font-size: 80px;
  color: #d9d9d9;
  margin-bottom: 16px;
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

/* 响应式 */
@media (min-width: 768px) {
  .history-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

