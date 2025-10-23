// 政府补贴助力 Store

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

// 补贴申请
export interface SubsidyApplication {
  id: number
  type: 'car' | 'appliance' | 'furniture' | 'renovation'
  title: string
  description: string
  subsidyAmount: number
  requiredHelpers: number  // 需要的助力人数
  currentHelpers: number   // 当前助力人数
  helpers: {
    userId: number
    userName: string
    avatar: string
    helpedAt: string
  }[]
  status: 'pending' | 'in_progress' | 'completed' | 'claimed'
  createdAt: string
  completedAt?: string
  claimedAt?: string
}

export const useSubsidyStore = defineStore('subsidy', () => {
  // 用户的补贴申请列表
  const myApplications = ref<SubsidyApplication[]>([
    {
      id: 1,
      type: 'appliance',
      title: '家电以旧换新补贴',
      description: '购买新家电,旧家电回收可获得政府补贴',
      subsidyAmount: 500,
      requiredHelpers: 5,
      currentHelpers: 3,
      helpers: [
        {
          userId: 10002,
          userName: '李明',
          avatar: 'https://i.pravatar.cc/150?img=1',
          helpedAt: '2025-10-17 10:30'
        },
        {
          userId: 10003,
          userName: '王芳',
          avatar: 'https://i.pravatar.cc/150?img=2',
          helpedAt: '2025-10-17 11:15'
        },
        {
          userId: 10004,
          userName: '张强',
          avatar: 'https://i.pravatar.cc/150?img=3',
          helpedAt: '2025-10-17 14:20'
        }
      ],
      status: 'in_progress',
      createdAt: '2025-10-17 09:00'
    }
  ])

  // 可申请的补贴项目
  const availableSubsidies = ref([
    {
      id: 1,
      type: 'car',
      name: '汽车以旧换新',
      icon: '🚗',
      color: '#FF6B35',
      amount: 10000,
      requiredHelpers: 10,
      description: '购买新能源汽车,旧车回收最高补贴1万元'
    },
    {
      id: 2,
      type: 'appliance',
      name: '家电以旧换新',
      icon: '🔌',
      color: '#F7931E',
      amount: 500,
      requiredHelpers: 5,
      description: '购买智能家电,旧家电回收最高补贴500元'
    },
    {
      id: 3,
      type: 'furniture',
      name: '家具换新补贴',
      icon: '🛋️',
      color: '#00A8E8',
      amount: 800,
      requiredHelpers: 8,
      description: '购买环保家具,最高补贴800元'
    },
    {
      id: 4,
      type: 'renovation',
      name: '厨卫焕新补贴',
      icon: '🚿',
      color: '#52C41A',
      amount: 1000,
      requiredHelpers: 10,
      description: '厨卫改造升级,最高补贴1000元'
    }
  ])

  // 我帮助过的申请
  const myHelpedApplications = ref<number[]>([])

  // 计算属性
  const pendingApplications = computed(() => 
    myApplications.value.filter(app => app.status === 'pending' || app.status === 'in_progress')
  )

  const completedApplications = computed(() => 
    myApplications.value.filter(app => app.status === 'completed' || app.status === 'claimed')
  )

  // 统计数据
  const statistics = computed(() => ({
    total: myApplications.value.length,
    pending: myApplications.value.filter(app => app.status === 'pending').length,
    completed: myApplications.value.filter(app => app.status === 'completed' || app.status === 'claimed').length,
    totalAmount: myApplications.value
      .filter(app => app.status === 'claimed')
      .reduce((sum, app) => sum + app.subsidyAmount, 0)
  }))

  // 创建补贴申请
  const createApplication = (subsidyType: SubsidyApplication['type']) => {
    const subsidy = availableSubsidies.value.find(s => s.type === subsidyType)
    if (!subsidy) return null

    const newApp: SubsidyApplication = {
      id: Date.now(),
      type: subsidyType,
      title: subsidy.name,
      description: subsidy.description,
      subsidyAmount: subsidy.amount,
      requiredHelpers: subsidy.requiredHelpers,
      currentHelpers: 0,
      helpers: [],
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    myApplications.value.unshift(newApp)
    saveToStorage()
    return newApp
  }

  // 帮助好友
  const helpFriend = (applicationId: number) => {
    const userStore = useUserStore()
    const app = myApplications.value.find(a => a.id === applicationId)
    
    if (!app) return false
    if (app.currentHelpers >= app.requiredHelpers) return false
    if (myHelpedApplications.value.includes(applicationId)) return false

    // 添加助力记录
    app.helpers.push({
      userId: userStore.userId,
      userName: userStore.userName,
      avatar: userStore.userInfo?.avatar || 'https://i.pravatar.cc/150?img=12',
      helpedAt: new Date().toISOString()
    })

    app.currentHelpers++

    // 检查是否完成
    if (app.currentHelpers >= app.requiredHelpers) {
      app.status = 'completed'
      app.completedAt = new Date().toISOString()
    } else {
      app.status = 'in_progress'
    }

    myHelpedApplications.value.push(applicationId)
    
    saveToStorage()
    return true
  }

  // 领取补贴
  const claimSubsidy = (applicationId: number) => {
    const app = myApplications.value.find(a => a.id === applicationId)
    
    if (!app) return false
    if (app.status !== 'completed') return false

    app.status = 'claimed'
    app.claimedAt = new Date().toISOString()

    // 发放积分奖励
    const userStore = useUserStore()
    userStore.addPoints(app.subsidyAmount)

    saveToStorage()
    return true
  }

  // 保存到localStorage
  const saveToStorage = () => {
    localStorage.setItem('subsidy_applications', JSON.stringify(myApplications.value))
    localStorage.setItem('subsidy_helped', JSON.stringify(myHelpedApplications.value))
  }

  // 从localStorage加载
  const loadFromStorage = () => {
    const savedApps = localStorage.getItem('subsidy_applications')
    if (savedApps) {
      try {
        myApplications.value = JSON.parse(savedApps)
      } catch (error) {
        console.error('Failed to load applications:', error)
      }
    }

    const savedHelped = localStorage.getItem('subsidy_helped')
    if (savedHelped) {
      try {
        myHelpedApplications.value = JSON.parse(savedHelped)
      } catch (error) {
        console.error('Failed to load helped applications:', error)
      }
    }
  }

  // 初始化
  const init = () => {
    loadFromStorage()
  }

  return {
    // 状态
    myApplications,
    availableSubsidies,
    myHelpedApplications,

    // 计算属性
    pendingApplications,
    completedApplications,
    statistics,

    // 方法
    createApplication,
    helpFriend,
    claimSubsidy,
    init
  }
})

