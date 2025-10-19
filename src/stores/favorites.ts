// 权益平台 - 收藏状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface FavoriteMerchant {
  id: number
  name: string
  image: string
  rating: number
  address: string
  distance: string
  addedAt: number
}

export interface FavoriteProduct {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
  points?: number
  addedAt: number
}

export interface FavoriteActivity {
  id: number
  title: string
  image: string
  startTime: string
  endTime: string
  addedAt: number
}

export const useFavoritesStore = defineStore('favorites', () => {
  // 状态
  const merchants = ref<FavoriteMerchant[]>([])
  const products = ref<FavoriteProduct[]>([])
  const activities = ref<FavoriteActivity[]>([])
  
  // 计算属性
  const totalCount = computed(() => {
    return merchants.value.length + products.value.length + activities.value.length
  })
  
  const merchantCount = computed(() => merchants.value.length)
  const productCount = computed(() => products.value.length)
  const activityCount = computed(() => activities.value.length)
  
  // 商家收藏方法
  const addMerchant = (merchant: Omit<FavoriteMerchant, 'addedAt'>) => {
    const exists = merchants.value.find(m => m.id === merchant.id)
    if (!exists) {
      merchants.value.unshift({
        ...merchant,
        addedAt: Date.now()
      })
      saveToStorage()
      return true
    }
    return false
  }
  
  const removeMerchant = (id: number) => {
    const index = merchants.value.findIndex(m => m.id === id)
    if (index > -1) {
      merchants.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }
  
  const isMerchantFavorited = (id: number) => {
    return merchants.value.some(m => m.id === id)
  }
  
  const toggleMerchant = (merchant: Omit<FavoriteMerchant, 'addedAt'>) => {
    if (isMerchantFavorited(merchant.id)) {
      removeMerchant(merchant.id)
      return false
    } else {
      addMerchant(merchant)
      return true
    }
  }
  
  // 商品收藏方法
  const addProduct = (product: Omit<FavoriteProduct, 'addedAt'>) => {
    const exists = products.value.find(p => p.id === product.id)
    if (!exists) {
      products.value.unshift({
        ...product,
        addedAt: Date.now()
      })
      saveToStorage()
      return true
    }
    return false
  }
  
  const removeProduct = (id: number) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }
  
  const isProductFavorited = (id: number) => {
    return products.value.some(p => p.id === id)
  }
  
  const toggleProduct = (product: Omit<FavoriteProduct, 'addedAt'>) => {
    if (isProductFavorited(product.id)) {
      removeProduct(product.id)
      return false
    } else {
      addProduct(product)
      return true
    }
  }
  
  // 活动收藏方法
  const addActivity = (activity: Omit<FavoriteActivity, 'addedAt'>) => {
    const exists = activities.value.find(a => a.id === activity.id)
    if (!exists) {
      activities.value.unshift({
        ...activity,
        addedAt: Date.now()
      })
      saveToStorage()
      return true
    }
    return false
  }
  
  const removeActivity = (id: number) => {
    const index = activities.value.findIndex(a => a.id === id)
    if (index > -1) {
      activities.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }
  
  const isActivityFavorited = (id: number) => {
    return activities.value.some(a => a.id === id)
  }
  
  const toggleActivity = (activity: Omit<FavoriteActivity, 'addedAt'>) => {
    if (isActivityFavorited(activity.id)) {
      removeActivity(activity.id)
      return false
    } else {
      addActivity(activity)
      return true
    }
  }
  
  // 批量操作
  const clearMerchants = () => {
    merchants.value = []
    saveToStorage()
  }
  
  const clearProducts = () => {
    products.value = []
    saveToStorage()
  }
  
  const clearActivities = () => {
    activities.value = []
    saveToStorage()
  }
  
  const clearAll = () => {
    merchants.value = []
    products.value = []
    activities.value = []
    saveToStorage()
  }
  
  // 存储方法
  const saveToStorage = () => {
    localStorage.setItem('favorites_merchants', JSON.stringify(merchants.value))
    localStorage.setItem('favorites_products', JSON.stringify(products.value))
    localStorage.setItem('favorites_activities', JSON.stringify(activities.value))
  }
  
  const loadFromStorage = () => {
    try {
      const savedMerchants = localStorage.getItem('favorites_merchants')
      const savedProducts = localStorage.getItem('favorites_products')
      const savedActivities = localStorage.getItem('favorites_activities')
      
      if (savedMerchants) merchants.value = JSON.parse(savedMerchants)
      if (savedProducts) products.value = JSON.parse(savedProducts)
      if (savedActivities) activities.value = JSON.parse(savedActivities)
    } catch (error) {
      console.error('Failed to load favorites from storage:', error)
    }
  }
  
  // 初始化
  const init = () => {
    loadFromStorage()
  }
  
  return {
    // 状态
    merchants,
    products,
    activities,
    
    // 计算属性
    totalCount,
    merchantCount,
    productCount,
    activityCount,
    
    // 商家方法
    addMerchant,
    removeMerchant,
    isMerchantFavorited,
    toggleMerchant,
    
    // 商品方法
    addProduct,
    removeProduct,
    isProductFavorited,
    toggleProduct,
    
    // 活动方法
    addActivity,
    removeActivity,
    isActivityFavorited,
    toggleActivity,
    
    // 批量操作
    clearMerchants,
    clearProducts,
    clearActivities,
    clearAll,
    
    // 初始化
    init
  }
})

