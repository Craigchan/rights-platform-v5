import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Notification {
  id: string
  type: 'system' | 'activity' | 'order'
  title: string
  description: string
  time: string
  icon: string
  iconColor: string
  isRead: boolean
  createTime: number
  targetRoute?: string  // 目标路由
  targetParams?: Record<string, any>  // 路由参数
}

export const useNotificationStore = defineStore('notification', () => {
  // 消息列表
  const notifications = ref<Notification[]>([
    {
      id: '1',
      type: 'activity',
      title: '双11狂欢节即将开始',
      description: '全场5折起，积分翻倍赠，赶快参与吧！',
      time: '2小时前',
      icon: 'gift',
      iconColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      isRead: false,
      createTime: Date.now() - 2 * 60 * 60 * 1000,
      targetRoute: '/activity-center'
    },
    {
      id: '2',
      type: 'activity',
      title: '您有3张优惠券即将过期',
      description: '请尽快使用，不要浪费积攒机会',
      time: '5小时前',
      icon: 'tag',
      iconColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      isRead: false,
      createTime: Date.now() - 5 * 60 * 60 * 1000,
      targetRoute: '/my-coupons'
    },
    {
      id: '3',
      type: 'system',
      title: '政府补贴审请度更新',
      description: '您的以旧换新补贴审请已通过审核',
      time: '1天前',
      icon: 'dollar',
      iconColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      isRead: false,
      createTime: Date.now() - 24 * 60 * 60 * 1000,
      targetRoute: '/government-subsidy'
    },
    {
      id: '4',
      type: 'order',
      title: '积分兑换成功',
      description: '您兑换的小米智能手环7已发货',
      time: '2天前',
      icon: 'shopping',
      iconColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      isRead: true,
      createTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
      targetRoute: '/orders',
      targetParams: { orderId: 'ORD20231021001' }
    },
    {
      id: '5',
      type: 'activity',
      title: '每日签到提醒',
      description: '今日还未签到，签到可获得10积分',
      time: '3天前',
      icon: 'trophy',
      iconColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      isRead: true,
      createTime: Date.now() - 3 * 24 * 60 * 60 * 1000,
      targetRoute: '/check-in'
    }
  ])

  // 当前选中的分类
  const currentTab = ref<'all' | 'system' | 'activity' | 'order'>('all')

  // 过滤后的消息列表
  const filteredNotifications = computed(() => {
    if (currentTab.value === 'all') {
      return notifications.value
    }
    return notifications.value.filter(n => n.type === currentTab.value)
  })

  // 未读消息数量
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  // 各分类未读数量
  const unreadCountByType = computed(() => {
    return {
      all: unreadCount.value,
      system: notifications.value.filter(n => n.type === 'system' && !n.isRead).length,
      activity: notifications.value.filter(n => n.type === 'activity' && !n.isRead).length,
      order: notifications.value.filter(n => n.type === 'order' && !n.isRead).length
    }
  })

  // 切换分类
  const setCurrentTab = (tab: 'all' | 'system' | 'activity' | 'order') => {
    currentTab.value = tab
  }

  // 标记单条消息为已读
  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }

  // 标记所有消息为已读
  const markAllAsRead = () => {
    notifications.value.forEach(n => {
      n.isRead = true
    })
  }

  // 添加新消息
  const addNotification = (notification: Omit<Notification, 'id' | 'createTime'>) => {
    notifications.value.unshift({
      ...notification,
      id: Date.now().toString(),
      createTime: Date.now()
    })
  }

  return {
    notifications,
    currentTab,
    filteredNotifications,
    unreadCount,
    unreadCountByType,
    setCurrentTab,
    markAsRead,
    markAllAsRead,
    addNotification
  }
})

