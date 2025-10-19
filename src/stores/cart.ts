// 权益平台 - 购物车状态管理

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: number
  productId: number
  name: string
  image: string
  price: number
  points: number
  quantity: number
  stock: number
  selected: boolean
}

export const useCartStore = defineStore('cart', () => {
  // 状态
  const items = ref<CartItem[]>([])
  
  // 计算属性
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const selectedItems = computed(() => {
    return items.value.filter(item => item.selected)
  })
  
  const selectedCount = computed(() => {
    return selectedItems.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return selectedItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })
  
  const totalPoints = computed(() => {
    return selectedItems.value.reduce((total, item) => total + item.points * item.quantity, 0)
  })
  
  const isAllSelected = computed(() => {
    return items.value.length > 0 && items.value.every(item => item.selected)
  })
  
  // 方法
  const addItem = (product: Omit<CartItem, 'quantity' | 'selected'>) => {
    const existingItem = items.value.find(item => item.productId === product.productId)
    
    if (existingItem) {
      if (existingItem.quantity < existingItem.stock) {
        existingItem.quantity++
      }
    } else {
      items.value.push({
        ...product,
        quantity: 1,
        selected: true
      })
    }
    
    saveToStorage()
  }
  
  const removeItem = (id: number) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  const updateQuantity = (id: number, quantity: number) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.stock))
      saveToStorage()
    }
  }
  
  const increaseQuantity = (id: number) => {
    const item = items.value.find(item => item.id === id)
    if (item && item.quantity < item.stock) {
      item.quantity++
      saveToStorage()
    }
  }
  
  const decreaseQuantity = (id: number) => {
    const item = items.value.find(item => item.id === id)
    if (item && item.quantity > 1) {
      item.quantity--
      saveToStorage()
    }
  }
  
  const toggleSelect = (id: number) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }
  
  const toggleSelectAll = () => {
    const allSelected = isAllSelected.value
    items.value.forEach(item => {
      item.selected = !allSelected
    })
    saveToStorage()
  }
  
  const clearSelected = () => {
    items.value = items.value.filter(item => !item.selected)
    saveToStorage()
  }
  
  const clearAll = () => {
    items.value = []
    saveToStorage()
  }
  
  const saveToStorage = () => {
    localStorage.setItem('cart_items', JSON.stringify(items.value))
  }
  
  const loadFromStorage = () => {
    const saved = localStorage.getItem('cart_items')
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch (error) {
        console.error('Failed to load cart from storage:', error)
      }
    }
  }
  
  // 初始化
  const init = () => {
    loadFromStorage()
  }
  
  return {
    // 状态
    items,
    
    // 计算属性
    totalItems,
    selectedItems,
    selectedCount,
    totalPrice,
    totalPoints,
    isAllSelected,
    
    // 方法
    addItem,
    removeItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    toggleSelect,
    toggleSelectAll,
    clearSelected,
    clearAll,
    init
  }
})

