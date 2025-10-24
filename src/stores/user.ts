// 权益平台 - 用户状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: number
  username: string
  phone: string
  avatar: string
  points: number
  level: number
  isVerified: boolean
  address?: string
  email?: string
  realNameInfo?: {
    realName: string
    idCard: string
    verifiedAt: string
  }
}

// 票根拼图
export interface TicketPuzzle {
  id: number
  name: string
  description: string
  requiredTickets: {
    type: string      // 票根类型
    count: number     // 需要数量
  }[]
  reward: {
    type: 'points' | 'coupon' | 'product'
    value: number | string
  }
  status: 'locked' | 'in_progress' | 'completed'
  progress: {
    type: string
    collected: number
    required: number
  }[]
  completedAt?: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')
  const isLoggedIn = ref<boolean>(false)
  
  // 票根拼图状态
  const ticketPuzzles = ref<TicketPuzzle[]>([
    {
      id: 1,
      name: '文体达人',
      description: '收集体育赛事票根3张 + 电影票根2张',
      requiredTickets: [
        { type: 'sports', count: 3 },
        { type: 'movie', count: 2 }
      ],
      reward: { type: 'points', value: 500 },
      status: 'in_progress',
      progress: [
        { type: 'sports', collected: 0, required: 3 },
        { type: 'movie', collected: 0, required: 2 }
      ]
    },
    {
      id: 2,
      name: '美食探索家',
      description: '收集5家不同餐厅的票根',
      requiredTickets: [
        { type: 'restaurant', count: 5 }
      ],
      reward: { type: 'coupon', value: 'FOOD_50' },
      status: 'locked',
      progress: [
        { type: 'restaurant', collected: 0, required: 5 }
      ]
    },
    {
      id: 3,
      name: '购物狂人',
      description: '收集购物票根10张',
      requiredTickets: [
        { type: 'shopping', count: 10 }
      ],
      reward: { type: 'points', value: 1000 },
      status: 'locked',
      progress: [
        { type: 'shopping', collected: 0, required: 10 }
      ]
    },
    {
      id: 4,
      name: '全能玩家',
      description: '收集每种类型的票根至少1张',
      requiredTickets: [
        { type: 'sports', count: 1 },
        { type: 'movie', count: 1 },
        { type: 'restaurant', count: 1 },
        { type: 'shopping', count: 1 },
        { type: 'other', count: 1 }
      ],
      reward: { type: 'points', value: 2000 },
      status: 'locked',
      progress: [
        { type: 'sports', collected: 0, required: 1 },
        { type: 'movie', collected: 0, required: 1 },
        { type: 'restaurant', collected: 0, required: 1 },
        { type: 'shopping', collected: 0, required: 1 },
        { type: 'other', collected: 0, required: 1 }
      ]
    }
  ])
  
  // 计算属性
  const userId = computed(() => userInfo.value?.id || 0)
  const userName = computed(() => userInfo.value?.username || '游客')
  const userPoints = computed(() => userInfo.value?.points || 0)
  const userLevel = computed(() => userInfo.value?.level || 0)
  const isVerified = computed(() => userInfo.value?.isVerified || false)
  const isRealNameVerified = computed(() => !!userInfo.value?.realNameInfo)
  
  // 用户等级名称
  const levelName = computed(() => {
    const level = userLevel.value
    if (level >= 10) return '钻石会员'
    if (level >= 7) return '黄金会员'
    if (level >= 4) return '白银会员'
    if (level >= 1) return '青铜会员'
    return '普通会员'
  })
  
  // 用户等级进度
  const levelProgress = computed(() => {
    const level = userLevel.value
    const nextLevelPoints = (level + 1) * 1000
    const currentLevelPoints = level * 1000
    const points = userPoints.value
    
    if (points >= nextLevelPoints) return 100
    
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    return Math.max(0, Math.min(100, progress))
  })
  
  // 方法
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    isLoggedIn.value = true
    // 持久化用户信息
    localStorage.setItem('user_info', JSON.stringify(info))
  }
  
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('access_token', newToken)
  }
  
  const updatePoints = (points: number) => {
    if (userInfo.value) {
      userInfo.value.points = points
    }
  }
  
  const addPoints = (points: number) => {
    if (userInfo.value) {
      userInfo.value.points += points
    }
  }
  
  const deductPoints = (points: number) => {
    if (userInfo.value && userInfo.value.points >= points) {
      userInfo.value.points -= points
      return true
    }
    return false
  }
  
  const updateAvatar = (avatar: string) => {
    if (userInfo.value) {
      userInfo.value.avatar = avatar
    }
  }
  
  const setVerified = (verified: boolean) => {
    if (userInfo.value) {
      userInfo.value.isVerified = verified
    }
  }
  
  const login = async (username: string, password: string) => {
    // 模拟登录
    const mockUser: UserInfo = {
      id: 10001,
      username: username,
      phone: '138****5678',
      avatar: 'https://i.pravatar.cc/150?img=12',
      points: 8888,
      level: 5,
      isVerified: true,
      address: '江苏省南京市鼓楼区中山路123号',
      email: 'user@example.com'
    }
    
    setUserInfo(mockUser)
    setToken('mock_token_' + Date.now())
    
    return true
  }
  
  const logout = () => {
    userInfo.value = null
    token.value = ''
    isLoggedIn.value = false
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
  }
  
  const fetchUserInfo = async () => {
    // 模拟获取用户信息
    const mockUser: UserInfo = {
      id: 10001,
      username: '张伟',
      phone: '138****5678',
      avatar: 'https://i.pravatar.cc/150?img=12',
      points: 8888,
      level: 5,
      isVerified: true,
      address: '江苏省南京市鼓楼区中山路123号',
      email: 'user@example.com'
    }
    
    setUserInfo(mockUser)
    return mockUser
  }
  
  // 票根拼图方法
  const updatePuzzleProgress = (ticketType: string) => {
    let updated = false
    
    ticketPuzzles.value.forEach(puzzle => {
      // 跳过已完成的拼图
      if (puzzle.status === 'completed') return
      
      // 解锁拼图（第一个拼图默认解锁）
      if (puzzle.status === 'locked' && puzzle.id === 1) {
        puzzle.status = 'in_progress'
      }
      
      // 更新进度
      if (puzzle.status === 'in_progress') {
        puzzle.progress.forEach(p => {
          if (p.type === ticketType && p.collected < p.required) {
            p.collected++
            updated = true
          }
        })
        
        // 检查是否完成
        const allCompleted = puzzle.progress.every(p => p.collected >= p.required)
        if (allCompleted) {
          puzzle.status = 'completed'
          puzzle.completedAt = new Date().toISOString()
          
          // 发放奖励
          if (puzzle.reward.type === 'points') {
            addPoints(puzzle.reward.value as number)
          }
          
          // 解锁下一个拼图
          const nextPuzzle = ticketPuzzles.value.find(p => p.id === puzzle.id + 1)
          if (nextPuzzle && nextPuzzle.status === 'locked') {
            nextPuzzle.status = 'in_progress'
          }
        }
      }
    })
    
    if (updated) {
      savePuzzlesToStorage()
    }
    
    return updated
  }
  
  const savePuzzlesToStorage = () => {
    localStorage.setItem('ticket_puzzles', JSON.stringify(ticketPuzzles.value))
  }
  
  const loadPuzzlesFromStorage = () => {
    const saved = localStorage.getItem('ticket_puzzles')
    if (saved) {
      try {
        ticketPuzzles.value = JSON.parse(saved)
      } catch (error) {
        console.error('Failed to load puzzles from storage:', error)
      }
    }
  }
  
  // 初始化
  const init = () => {
    const savedToken = localStorage.getItem('access_token')
    if (savedToken) {
      token.value = savedToken
      fetchUserInfo()
    }
    
    // 加载保存的用户信息
    const savedUserInfo = localStorage.getItem('user_info')
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
        isLoggedIn.value = true
      } catch (error) {
        console.error('Failed to load user info from storage:', error)
      }
    }
    
    loadPuzzlesFromStorage()
  }
  
  return {
    // 状态
    userInfo,
    token,
    isLoggedIn,
    ticketPuzzles,
    
    // 计算属性
    userId,
    userName,
    userPoints,
    userLevel,
    isVerified,
    isRealNameVerified,
    levelName,
    levelProgress,
    
    // 方法
    setUserInfo,
    setToken,
    updatePoints,
    addPoints,
    deductPoints,
    updateAvatar,
    setVerified,
    login,
    logout,
    fetchUserInfo,
    updatePuzzleProgress,
    init
  }
})

