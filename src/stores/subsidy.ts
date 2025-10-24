// 政府补贴助力 Store

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

// 补贴类型
export type SubsidyType = 
  | 'car'              // 汽车以旧换新
  | 'appliance'        // 家电以旧换新
  | 'furniture'        // 家具换新
  | 'renovation'       // 厨卫焕新
  | '3c'               // 3C数码
  | 'green_appliance'  // 绿色家电

// 申请状态
export type ApplicationStatus = 
  | 'pending'      // 待审核
  | 'in_progress'  // 审核中
  | 'approved'     // 已通过
  | 'rejected'     // 已拒绝
  | 'completed'    // 已完成
  | 'claimed'      // 已领取

// 二级品类
export interface SubsidySubCategory {
  id: string
  name: string
  icon: string
  amount: number
  description: string
  totalQuota: number
  usedQuota: number
  requiredHelpers: number
}

// 补贴配置
export interface SubsidyConfig {
  id: string
  type: SubsidyType
  name: string
  icon: string
  color: string
  amount: number
  description: string
  conditions: string[]
  materials: string[]
  subCategories?: SubsidySubCategory[]  // 二级品类
}

// 补贴申请
export interface SubsidyApplication {
  id: number
  applicationNo: string    // 申请编号
  type: SubsidyType
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
  status: ApplicationStatus
  createdAt: string
  submittedAt?: string     // 提交时间
  approvedAt?: string      // 审核通过时间
  completedAt?: string     // 完成时间
  claimedAt?: string       // 领取时间
  rejectReason?: string    // 拒绝原因
}

export const useSubsidyStore = defineStore('subsidy', () => {
  // 已申领的补贴资格(二级品类ID)
  const claimedQualifications = ref<string[]>([])
  
  // 解绑资格
  const unbindQualification = (subCategoryId: string) => {
    const index = claimedQualifications.value.indexOf(subCategoryId)
    if (index > -1) {
      claimedQualifications.value.splice(index, 1)
      saveClaimedQualifications()
    }
  }

  // 申领资格
  const claimQualification = (subCategoryId: string) => {
    if (!claimedQualifications.value.includes(subCategoryId)) {
      claimedQualifications.value.push(subCategoryId)
      saveClaimedQualifications()
      return true
    }
    return false
  }

  // 用户的补贴申请列表
  const myApplications = ref<SubsidyApplication[]>([
    {
      id: 1,
      applicationNo: 'BT202510170001',
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
      createdAt: '2025-10-17 09:00',
      submittedAt: '2025-10-17 09:00'
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
      description: '购买新能源汽车,旧车回收最高补贴1万元',
      totalQuota: 1000,
      usedQuota: 234,
      subCategories: [
        {
          id: 'car-ev',
          name: '纯电动汽车',
          icon: '⚡',
          amount: 10000,
          description: '购买纯电动汽车,最高补贴1万元',
          totalQuota: 500,
          usedQuota: 123,
          requiredHelpers: 10
        },
        {
          id: 'car-phev',
          name: '插电混动汽车',
          icon: '🔌',
          amount: 8000,
          description: '购买插电混动汽车,最高补贴8000元',
          totalQuota: 300,
          usedQuota: 67,
          requiredHelpers: 8
        },
        {
          id: 'car-fuel',
          name: '节能燃油汽车',
          icon: '⛽',
          amount: 5000,
          description: '购买国六标准节能燃油车,最高补贴5000元',
          totalQuota: 200,
          usedQuota: 44,
          requiredHelpers: 6
        }
      ]
    },
    {
      id: 2,
      type: 'appliance',
      name: '家电以旧换新',
      icon: '🔌',
      color: '#F7931E',
      amount: 500,
      requiredHelpers: 5,
      description: '购买智能家电,旧家电回收最高补贴500元',
      totalQuota: 2000,
      usedQuota: 567,
      subCategories: [
        {
          id: 'appliance-tv',
          name: '智能电视',
          icon: '📺',
          amount: 500,
          description: '购买4K/8K智能电视,最高补贴500元',
          totalQuota: 600,
          usedQuota: 178,
          requiredHelpers: 5
        },
        {
          id: 'appliance-fridge',
          name: '智能冰箱',
          icon: '❄️',
          amount: 400,
          description: '购买一级能效智能冰箱,最高补贴400元',
          totalQuota: 500,
          usedQuota: 145,
          requiredHelpers: 5
        },
        {
          id: 'appliance-washer',
          name: '智能洗衣机',
          icon: '🧹',
          amount: 300,
          description: '购买智能洗衣机,最高补贴300元',
          totalQuota: 500,
          usedQuota: 134,
          requiredHelpers: 4
        },
        {
          id: 'appliance-ac',
          name: '智能空调',
          icon: '❄️',
          amount: 400,
          description: '购买新一级能效智能空调,最高补贴400元',
          totalQuota: 400,
          usedQuota: 110,
          requiredHelpers: 5
        }
      ]
    },
    {
      id: 3,
      type: 'furniture',
      name: '家具换新补贴',
      icon: '🛌️',
      color: '#00A8E8',
      amount: 800,
      requiredHelpers: 8,
      description: '购买环保家具,最高补贴800元',
      totalQuota: 1500,
      usedQuota: 423,
      subCategories: [
        {
          id: 'furniture-sofa',
          name: '沙发',
          icon: '🛋️',
          amount: 800,
          description: '购买环保沙发,最高补贴800元',
          totalQuota: 400,
          usedQuota: 112,
          requiredHelpers: 8
        },
        {
          id: 'furniture-bed',
          name: '床具',
          icon: '🛏️',
          amount: 600,
          description: '购买环保床具,最高补贴600元',
          totalQuota: 400,
          usedQuota: 98,
          requiredHelpers: 6
        },
        {
          id: 'furniture-wardrobe',
          name: '衣柜',
          icon: '🚪',
          amount: 700,
          description: '购买环保衣柜,最高补贴700元',
          totalQuota: 400,
          usedQuota: 123,
          requiredHelpers: 7
        },
        {
          id: 'furniture-desk',
          name: '书桌椅',
          icon: '🪑',
          amount: 500,
          description: '购买环保书桌椅,最高补贴500元',
          totalQuota: 300,
          usedQuota: 90,
          requiredHelpers: 5
        }
      ]
    },
    {
      id: 4,
      type: 'renovation',
      name: '厨卫焕新补贴',
      icon: '🚿',
      color: '#52C41A',
      amount: 1000,
      requiredHelpers: 10,
      description: '厨卫改造升级,最高补贴1000元',
      totalQuota: 1200,
      usedQuota: 389,
      subCategories: [
        {
          id: 'renovation-kitchen',
          name: '厨房改造',
          icon: '🍳',
          amount: 1000,
          description: '厨房整体改造,最高补贴1000元',
          totalQuota: 300,
          usedQuota: 98,
          requiredHelpers: 10
        },
        {
          id: 'renovation-bathroom',
          name: '卫生间改造',
          icon: '🚿',
          amount: 800,
          description: '卫生间整体改造,最高补贴800元',
          totalQuota: 300,
          usedQuota: 87,
          requiredHelpers: 8
        },
        {
          id: 'renovation-water',
          name: '热水器/净水器',
          icon: '💧',
          amount: 600,
          description: '购买智能热水器或净水器,最高补贴600元',
          totalQuota: 300,
          usedQuota: 112,
          requiredHelpers: 6
        },
        {
          id: 'renovation-range',
          name: '油烟机/灶具',
          icon: '🔥',
          amount: 500,
          description: '购买智能油烟机或灶具,最高补贴500元',
          totalQuota: 300,
          usedQuota: 92,
          requiredHelpers: 5
        }
      ]
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

    // 生成申请编号: BT + 日期 + 4位随机数
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    const applicationNo = `BT${dateStr}${randomNum}`

    const newApp: SubsidyApplication = {
      id: Date.now(),
      applicationNo,
      type: subsidyType,
      title: subsidy.name,
      description: subsidy.description,
      subsidyAmount: subsidy.amount,
      requiredHelpers: subsidy.requiredHelpers,
      currentHelpers: 0,
      helpers: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString()
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

  // 保存已申领资格到localStorage
  const saveClaimedQualifications = () => {
    localStorage.setItem('claimed_qualifications', JSON.stringify(claimedQualifications.value))
  }

  // 保存到localStorage
  const saveToStorage = () => {
    localStorage.setItem('subsidy_applications', JSON.stringify(myApplications.value))
    localStorage.setItem('subsidy_helped', JSON.stringify(myHelpedApplications.value))
  }

  // 从 localStorage加载
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

    const savedQualifications = localStorage.getItem('claimed_qualifications')
    if (savedQualifications) {
      try {
        claimedQualifications.value = JSON.parse(savedQualifications)
      } catch (error) {
        console.error('Failed to load claimed qualifications:', error)
      }
    }
  }

  // 检查是否已申请过某类型的补贴
  const hasAppliedType = (type: SubsidyApplication['type']): boolean => {
    return myApplications.value.some(app => app.type === type)
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
    claimedQualifications,

    // 计算属性
    pendingApplications,
    completedApplications,
    statistics,

    // 方法
    createApplication,
    helpFriend,
    claimSubsidy,
    claimQualification,
    unbindQualification,
    hasAppliedType,
    init
  }
})

