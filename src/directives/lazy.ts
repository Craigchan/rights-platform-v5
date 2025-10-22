/**
 * 图片懒加载指令
 * 使用 Intersection Observer API 实现
 */

import type { Directive, DirectiveBinding } from 'vue'

// 默认占位图（1x1 透明 GIF）
const DEFAULT_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// 加载失败时的占位图
const ERROR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg=='

interface LazyOptions {
  src: string
  loading?: string
  error?: string
  delay?: number
}

// 创建 Intersection Observer 实例
const createObserver = (el: HTMLImageElement, binding: DirectiveBinding<string | LazyOptions>) => {
  const options: LazyOptions = typeof binding.value === 'string' 
    ? { src: binding.value }
    : binding.value

  const { src, loading = DEFAULT_PLACEHOLDER, error = ERROR_PLACEHOLDER, delay = 0 } = options

  // 设置初始占位图
  el.src = loading

  // 创建 observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 元素进入视口
          const img = entry.target as HTMLImageElement
          
          // 延迟加载（可选）
          setTimeout(() => {
            const tempImg = new Image()
            
            // 图片加载成功
            tempImg.onload = () => {
              img.src = src
              img.classList.add('lazy-loaded')
              img.classList.remove('lazy-loading')
            }
            
            // 图片加载失败
            tempImg.onerror = () => {
              img.src = error
              img.classList.add('lazy-error')
              img.classList.remove('lazy-loading')
            }
            
            // 开始加载
            img.classList.add('lazy-loading')
            tempImg.src = src
          }, delay)
          
          // 停止观察
          observer.unobserve(img)
        }
      })
    },
    {
      // 提前 100px 开始加载
      rootMargin: '100px',
      threshold: 0.01
    }
  )

  // 开始观察
  observer.observe(el)

  // 保存 observer 实例，用于卸载时清理
  ;(el as any)._lazyObserver = observer
}

export const lazyLoad: Directive = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding<string | LazyOptions>) {
    // 检查浏览器是否支持 Intersection Observer
    if ('IntersectionObserver' in window) {
      createObserver(el, binding)
    } else {
      // 不支持则直接加载
      const src = typeof binding.value === 'string' ? binding.value : binding.value.src
      el.src = src
    }
  },

  updated(el: HTMLImageElement, binding: DirectiveBinding<string | LazyOptions>) {
    // 如果 src 改变，重新创建 observer
    const oldSrc = typeof binding.oldValue === 'string' ? binding.oldValue : binding.oldValue?.src
    const newSrc = typeof binding.value === 'string' ? binding.value : binding.value.src
    
    if (oldSrc !== newSrc) {
      // 清理旧的 observer
      const oldObserver = (el as any)._lazyObserver
      if (oldObserver) {
        oldObserver.unobserve(el)
      }
      
      // 创建新的 observer
      if ('IntersectionObserver' in window) {
        createObserver(el, binding)
      } else {
        el.src = newSrc
      }
    }
  },

  unmounted(el: HTMLImageElement) {
    // 清理 observer
    const observer = (el as any)._lazyObserver
    if (observer) {
      observer.unobserve(el)
      delete (el as any)._lazyObserver
    }
  }
}

// 默认导出
export default lazyLoad

