// 权益平台 - 通用工具函数

/**
 * 格式化价格
 */
export const formatPrice = (price: number, decimals: number = 2): string => {
  return price.toFixed(decimals)
}

/**
 * 格式化货币
 */
export const formatCurrency = (amount: number, symbol: string = '¥'): string => {
  return `${symbol}${formatPrice(amount)}`
}

/**
 * 格式化积分
 */
export const formatPoints = (points: number): string => {
  if (points >= 10000) {
    return `${(points / 10000).toFixed(1)}万`
  }
  return points.toString()
}

/**
 * 格式化数字（千分位）
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化手机号（脱敏）
 */
export const formatPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化身份证号（脱敏）
 */
export const formatIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 6) return idCard
  return idCard.replace(/(\d{6})\d+(\d{4})/, '$1********$2')
}

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = new Date(date)
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const now = Date.now()
  const timestamp = new Date(date).getTime()
  const diff = now - timestamp
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 2 * day) {
    return '昨天'
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < 2 * week) {
    return '1周前'
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else {
    return formatDate(date, 'YYYY-MM-DD')
  }
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0
  
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 深拷贝
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * 生成唯一ID
 */
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 获取URL参数
 */
export const getUrlParam = (name: string): string | null => {
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

/**
 * 设置URL参数
 */
export const setUrlParam = (name: string, value: string): void => {
  const url = new URL(window.location.href)
  url.searchParams.set(name, value)
  window.history.pushState({}, '', url.toString())
}

/**
 * 删除URL参数
 */
export const deleteUrlParam = (name: string): void => {
  const url = new URL(window.location.href)
  url.searchParams.delete(name)
  window.history.pushState({}, '', url.toString())
}

/**
 * 复制到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

/**
 * 下载文件
 */
export const downloadFile = (url: string, filename?: string): void => {
  const link = document.createElement('a')
  link.href = url
  if (filename) link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 图片预加载
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * 批量图片预加载
 */
export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(src => preloadImage(src)))
}

/**
 * 滚动到顶部
 */
export const scrollToTop = (smooth: boolean = true): void => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * 滚动到元素
 */
export const scrollToElement = (element: HTMLElement | string, offset: number = 0, smooth: boolean = true): void => {
  const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element
  if (!el) return
  
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset
  window.scrollTo({
    top,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * 检查是否在视口内
 */
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 获取设备类型
 */
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

/**
 * 检查是否为微信浏览器
 */
export const isWeChat = (): boolean => {
  return /micromessenger/i.test(navigator.userAgent)
}

/**
 * 检查是否为移动端
 */
export const isMobile = (): boolean => {
  return getDeviceType() === 'mobile'
}

/**
 * 本地存储封装
 */
export const storage = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },
  
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue || null
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue || null
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

/**
 * 会话存储封装
 */
export const session = {
  set: (key: string, value: any): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Session set error:', error)
    }
  },
  
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const value = sessionStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue || null
    } catch (error) {
      console.error('Session get error:', error)
      return defaultValue || null
    }
  },
  
  remove: (key: string): void => {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Session remove error:', error)
    }
  },
  
  clear: (): void => {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('Session clear error:', error)
    }
  }
}

export default {
  formatPrice,
  formatCurrency,
  formatPoints,
  formatNumber,
  formatPhone,
  formatIdCard,
  formatDate,
  formatRelativeTime,
  debounce,
  throttle,
  deepClone,
  generateId,
  getUrlParam,
  setUrlParam,
  deleteUrlParam,
  copyToClipboard,
  downloadFile,
  preloadImage,
  preloadImages,
  scrollToTop,
  scrollToElement,
  isInViewport,
  getDeviceType,
  isWeChat,
  isMobile,
  storage,
  session
}

