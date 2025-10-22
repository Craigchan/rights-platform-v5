import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { getImageUrl } from '../config/images'

export interface FeedCard {
  id: string
  type: 'subsidy' | 'coupon' | 'recommend' | 'nearby' | 'points' | 'activity'
  component: string
  data: any
  priority: number
}

export const useFeedStore = defineStore('feed', () => {
  const userStore = useUserStore()
  
  // 生成智能推荐卡片流
  const generateFeedCards = computed((): FeedCard[] => {
    const cards: FeedCard[] = []

    // 优先级1: 未完成的政府补贴申请 (最高优先级)
    if (hasUnfinishedSubsidy()) {
      cards.push({
        id: 'subsidy-unfinished',
        type: 'subsidy',
        component: 'SubsidyCard',
        data: {
          title: '家电以旧换新补贴',
          amount: 2000,
          progress: 3,
          total: 5,
          status: 'pending'
        },
        priority: 100
      })
    }

    // 优先级2: 即将过期的优惠券
    const expiringCoupons = getExpiringCoupons()
    if (expiringCoupons.length > 0) {
      cards.push({
        id: 'coupon-expiring',
        type: 'coupon',
        component: 'CouponCard',
        data: {
          coupons: expiringCoupons,
          expiringCount: expiringCoupons.length
        },
        priority: 90
      })
    }

    // 优先级3: 基于浏览历史的商品推荐
    cards.push({
      id: 'recommend-products',
      type: 'recommend',
      component: 'RecommendCard',
      data: {
        products: getRecommendedProducts(),
        reason: '根据您的浏览记录推荐'
      },
      priority: 80
    })

    // 优先级4: 附近的优惠商家 (基于地理位置)
    if (userStore.location) {
      cards.push({
        id: 'nearby-merchants',
        type: 'nearby',
        component: 'NearbyCard',
        data: {
          merchants: getNearbyMerchants(),
          city: userStore.city
        },
        priority: 70
      })
    }

    // 优先级5: 积分任务 (每日首次访问显示)
    if (!hasSeenPointsTaskToday()) {
      cards.push({
        id: 'points-tasks',
        type: 'points',
        component: 'PointsTaskCard',
        data: {
          tasks: getDailyTasks(),
          todayPoints: getTodayPoints()
        },
        priority: 60
      })
    }

    // 优先级6: 热门活动
    cards.push({
      id: 'hot-activities',
      type: 'activity',
      component: 'ActivityCard',
      data: {
        activities: getHotActivities()
      },
      priority: 50
    })

    // 按优先级排序
    return cards.sort((a, b) => b.priority - a.priority)
  })

  // 检查是否有未完成的补贴申请
  const hasUnfinishedSubsidy = (): boolean => {
    // TODO: 实际实现应该从后端API获取
    return Math.random() > 0.7 // 模拟30%的用户有未完成申请
  }

  // 获取即将过期的优惠券
  const getExpiringCoupons = () => {
    // TODO: 实际实现应该从后端API获取
    const mockCoupons = [
      { id: 1, name: '满100减30', amount: 30, expireDate: '2025-10-20' },
      { id: 2, name: '满200减50', amount: 50, expireDate: '2025-10-21' }
    ]
    return mockCoupons.filter(() => Math.random() > 0.5)
  }

  // 获取推荐商品
  const getRecommendedProducts = () => {
    // TODO: 基于用户浏览历史和偏好推荐
    return [
      { id: 1, name: '智能电饭煲', price: 299, image: getImageUrl('products', 'smartCooker', 640) },
      { id: 2, name: '蓝牙耳机', price: 199, image: getImageUrl('products', 'headphones', 640) },
      { id: 3, name: '运动鞋', price: 399, image: getImageUrl('products', 'sneakers', 640) }
    ]
  }

  // 获取附近商家
  const getNearbyMerchants = () => {
    // TODO: 基于地理位置获取
    return [
      { id: 1, name: '德基广场', distance: '500m', offer: '全场5折起' },
      { id: 2, name: '金鹰国际', distance: '800m', offer: '满200送50券' },
      { id: 3, name: '新街口美食街', distance: '1.2km', offer: '满100减30' }
    ]
  }

  // 检查今天是否已查看积分任务
  const hasSeenPointsTaskToday = (): boolean => {
    const lastSeen = localStorage.getItem('pointsTaskLastSeen')
    if (!lastSeen) return false
    
    const today = new Date().toDateString()
    return lastSeen === today
  }

  // 标记已查看积分任务
  const markPointsTaskSeen = () => {
    localStorage.setItem('pointsTaskLastSeen', new Date().toDateString())
  }

  // 获取每日任务
  const getDailyTasks = () => {
    return [
      { id: 1, name: '每日签到', points: 10, completed: false },
      { id: 2, name: '分享好友', points: 5, completed: false },
      { id: 3, name: '评价商品', points: 10, completed: false }
    ]
  }

  // 获取今日已赚积分
  const getTodayPoints = (): number => {
    // TODO: 从后端API获取
    return 0
  }

  // 获取热门活动
  const getHotActivities = () => {
    return [
      { id: 1, name: '德基广场周年庆', tag: '全场5折起', image: getImageUrl('activities', 'dejiPlaza', 640) },
      { id: 2, name: '南京欢乐谷嘉年华', tag: '门票买一送一', image: getImageUrl('activities', 'happyValley', 640) },
      { id: 3, name: '新街口美食节', tag: '满100减30', image: getImageUrl('activities', 'foodFestival', 640) }
    ]
  }

  return {
    generateFeedCards,
    markPointsTaskSeen
  }
})

