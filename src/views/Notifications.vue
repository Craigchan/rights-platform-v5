<template>
  <div class="notifications-page">
    <!-- 顶部导航 -->
    <div class="header">
      <LeftOutlined class="back-icon" @click="goBack" />
      <span class="title">消息通知</span>
      <span class="mark-all-read" @click="handleMarkAllRead">全部已读</span>
    </div>

    <!-- 分类Tab -->
    <div class="tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: currentTab === tab.key }]"
        @click="handleTabChange(tab.key)"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span v-if="unreadCountByType[tab.key] > 0" class="tab-badge">
          {{ unreadCountByType[tab.key] }}
        </span>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="notification-list">
      <div
        v-for="item in filteredNotifications"
        :key="item.id"
        :class="['notification-item', { unread: !item.isRead }]"
        @click="handleItemClick(item)"
      >
        <!-- 图标 -->
        <div class="icon-wrapper" :style="{ background: item.iconColor }">
          <component :is="getIcon(item.icon)" class="icon" />
        </div>

        <!-- 内容 -->
        <div class="content">
          <div class="title-row">
            <span class="title">{{ item.title }}</span>
            <span v-if="!item.isRead" class="unread-dot"></span>
          </div>
          <div class="description">{{ item.description }}</div>
          <div class="time">{{ item.time }}</div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <InboxOutlined class="empty-icon" />
        <div class="empty-text">暂无消息</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  GiftOutlined,
  TagOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const notificationStore = useNotificationStore()

// Tab配置
const tabs = [
  { key: 'all' as const, label: '全部' },
  { key: 'system' as const, label: '系统通知' },
  { key: 'activity' as const, label: '活动消息' },
  { key: 'order' as const, label: '订单消息' }
]

// 当前Tab
const currentTab = computed(() => notificationStore.currentTab)

// 过滤后的消息列表
const filteredNotifications = computed(() => notificationStore.filteredNotifications)

// 各分类未读数量
const unreadCountByType = computed(() => notificationStore.unreadCountByType)

// 返回
const goBack = () => {
  router.back()
}

// 切换Tab
const handleTabChange = (tab: 'all' | 'system' | 'activity' | 'order') => {
  notificationStore.setCurrentTab(tab)
}

// 全部已读
const handleMarkAllRead = () => {
  notificationStore.markAllAsRead()
  message.success('已全部标记为已读')
}

// 点击消息项
const handleItemClick = (item: any) => {
  // 标记为已读
  if (!item.isRead) {
    notificationStore.markAsRead(item.id)
  }
  
  // 根据 targetRoute 跳转到目标页面
  if (item.targetRoute) {
    // 如果有路由参数，传递参数
    if (item.targetParams) {
      router.push({
        path: item.targetRoute,
        query: item.targetParams
      })
    } else {
      router.push(item.targetRoute)
    }
  } else {
    // 没有配置 targetRoute 的消息，显示提示
    message.info('消息详情功能开发中')
  }
}

// 根据图标名称获取图标组件
const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    gift: GiftOutlined,
    tag: TagOutlined,
    dollar: DollarOutlined,
    shopping: ShoppingOutlined,
    trophy: TrophyOutlined
  }
  return iconMap[iconName] || GiftOutlined
}
</script>

<style scoped lang="scss">
.notifications-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航 */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .back-icon {
    font-size: 20px;
    color: #333;
    cursor: pointer;
    padding: 8px;
    margin-left: -8px;

    &:active {
      opacity: 0.6;
    }
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    flex: 1;
    text-align: center;
  }

  .mark-all-read {
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
    padding: 8px;
    margin-right: -8px;

    &:active {
      opacity: 0.6;
    }
  }
}

/* 分类Tab */
.tabs {
  background: #fff;
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;

  .tab-label {
    font-size: 15px;
    color: #666;
    transition: all 0.3s;
  }

  .tab-badge {
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    background: #ff4d4f;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  &.active {
    .tab-label {
      color: #1890ff;
      font-weight: 600;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 3px;
      background: #1890ff;
      border-radius: 2px 2px 0 0;
    }
  }

  &:active {
    opacity: 0.6;
  }
}

/* 消息列表 */
.notification-list {
  padding: 8px 0;
}

.notification-item {
  background: #fff;
  padding: 16px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #f5f5f5;

  &:active {
    background: #fafafa;
  }

  &.unread {
    background: #f6f9ff;
  }
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .icon {
    font-size: 24px;
    color: #fff;
  }
}

.content {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
  flex-shrink: 0;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 12px;
  color: #999;
}

/* 空状态 */
.empty-state {
  padding: 80px 20px;
  text-align: center;

  .empty-icon {
    font-size: 64px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 14px;
    color: #999;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .header {
    .title {
      font-size: 17px;
    }
  }

  .tab-item {
    .tab-label {
      font-size: 14px;
    }
  }

  .notification-item {
    padding: 14px;
  }

  .icon-wrapper {
    width: 44px;
    height: 44px;

    .icon {
      font-size: 22px;
    }
  }

  .title {
    font-size: 15px;
  }

  .description {
    font-size: 13px;
  }
}
</style>

