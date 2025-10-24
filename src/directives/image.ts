/**
 * Vue 图片指令
 * 自动处理图片加载失败
 */

import type { Directive } from 'vue'
import { getPlaceholderImage, getGrayPlaceholder } from '@/utils/image'

/**
 * v-img-fallback 指令
 * 当图片加载失败时，自动替换为占位图
 * 
 * 用法：
 * <img v-img-fallback src="..." />
 * <img v-img-fallback:gray src="..." />
 * <img v-img-fallback:picsum src="..." />
 * <img v-img-fallback="{ type: 'picsum', width: 400, height: 300 }" src="..." />
 */
export const imgFallback: Directive<HTMLImageElement, any> = {
  mounted(el, binding) {
    // 获取配置
    const config = typeof binding.value === 'object' ? binding.value : {}
    const type = binding.arg || config.type || 'picsum'
    const width = config.width || el.width || el.naturalWidth || 400
    const height = config.height || el.height || el.naturalHeight || 300
    
    // 添加错误处理
    const handleError = () => {
      // 避免无限循环
      if (el.dataset.errorHandled === 'true') {
        return
      }
      
      el.dataset.errorHandled = 'true'
      
      // 根据类型设置占位图
      if (type === 'picsum') {
        // 使用原始 src 作为 seed
        const seed = el.src.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        el.src = getPlaceholderImage(width, height, seed)
      } else if (type === 'gray') {
        el.src = getGrayPlaceholder(width, height, config.text || '图片加载失败')
      }
    }
    
    el.addEventListener('error', handleError, { once: true })
    
    // 保存处理函数，用于卸载时清理
    ;(el as any)._imgFallbackHandler = handleError
  },
  
  unmounted(el) {
    // 清理事件监听器
    const handler = (el as any)._imgFallbackHandler
    if (handler) {
      el.removeEventListener('error', handler)
      delete (el as any)._imgFallbackHandler
    }
  }
}

/**
 * v-lazy-img 指令
 * 图片懒加载 + 错误处理
 * 
 * 用法：
 * <img v-lazy-img="imageUrl" />
 * <img v-lazy-img="{ src: imageUrl, placeholder: placeholderUrl }" />
 */
export const lazyImg: Directive<HTMLImageElement, any> = {
  mounted(el, binding) {
    const config = typeof binding.value === 'string' 
      ? { src: binding.value } 
      : binding.value
    
    const { src, placeholder, fallbackType = 'picsum' } = config
    
    // 设置占位图
    if (placeholder) {
      el.src = placeholder
    } else {
      const width = el.width || 400
      const height = el.height || 300
      el.src = getGrayPlaceholder(width, height, '加载中...')
    }
    
    // 创建 IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 图片进入视口，开始加载
          const img = entry.target as HTMLImageElement
          
          // 添加错误处理
          const handleError = () => {
            if (img.dataset.errorHandled === 'true') return
            img.dataset.errorHandled = 'true'
            
            const width = img.width || img.naturalWidth || 400
            const height = img.height || img.naturalHeight || 300
            const seed = src.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
            
            if (fallbackType === 'picsum') {
              img.src = getPlaceholderImage(width, height, seed)
            } else {
              img.src = getGrayPlaceholder(width, height, '图片加载失败')
            }
          }
          
          img.addEventListener('error', handleError, { once: true })
          
          // 加载图片
          img.src = src
          
          // 停止观察
          observer.unobserve(img)
        }
      })
    })
    
    // 开始观察
    observer.observe(el)
    
    // 保存 observer，用于卸载时清理
    ;(el as any)._lazyImgObserver = observer
  },
  
  unmounted(el) {
    // 清理 observer
    const observer = (el as any)._lazyImgObserver
    if (observer) {
      observer.disconnect()
      delete (el as any)._lazyImgObserver
    }
  }
}

export default {
  imgFallback,
  lazyImg
}

