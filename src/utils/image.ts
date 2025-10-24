/**
 * 图片工具函数
 * 提供图片占位符和错误处理功能
 */

/**
 * 获取 Picsum Photos 占位图
 * @param width 图片宽度，默认 400
 * @param height 图片高度，默认 300
 * @param seed 随机种子，用于固定图片（可选）
 * @returns Picsum Photos 图片 URL
 */
export const getPlaceholderImage = (
  width: number = 400,
  height: number = 300,
  seed?: string | number
): string => {
  const baseUrl = `https://picsum.photos/${width}/${height}`
  return seed ? `${baseUrl}?random=${seed}` : baseUrl
}

/**
 * 获取灰色占位图（纯色背景）
 * @param width 图片宽度
 * @param height 图片高度
 * @param text 占位文字（可选）
 * @param bgColor 背景色，默认 #f0f0f0
 * @param textColor 文字颜色，默认 #999
 * @returns Data URL 格式的占位图
 */
export const getGrayPlaceholder = (
  width: number = 400,
  height: number = 300,
  text?: string,
  bgColor: string = '#f0f0f0',
  textColor: string = '#999999'
): string => {
  // 使用 canvas 生成占位图
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // 绘制背景
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)
      
      // 绘制文字
      if (text) {
        ctx.fillStyle = textColor
        ctx.font = `${Math.min(width, height) / 10}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, width / 2, height / 2)
      }
      
      return canvas.toDataURL()
    }
  }
  
  // 降级方案：使用 SVG
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      ${text ? `<text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="${textColor}" font-size="${Math.min(width, height) / 10}">${text}</text>` : ''}
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * 图片加载错误处理函数
 * @param event 图片加载错误事件
 * @param fallbackType 降级类型：'picsum' | 'gray'，默认 'picsum'
 */
export const handleImageError = (
  event: Event,
  fallbackType: 'picsum' | 'gray' = 'picsum'
): void => {
  const img = event.target as HTMLImageElement
  
  // 避免无限循环
  if (img.dataset.errorHandled === 'true') {
    return
  }
  
  img.dataset.errorHandled = 'true'
  
  // 获取图片尺寸
  const width = img.width || img.naturalWidth || 400
  const height = img.height || img.naturalHeight || 300
  
  // 根据类型设置占位图
  if (fallbackType === 'picsum') {
    // 使用原始 src 作为 seed，确保同一个失效链接总是显示相同的占位图
    const seed = img.src.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    img.src = getPlaceholderImage(width, height, seed)
  } else {
    img.src = getGrayPlaceholder(width, height, '图片加载失败')
  }
}

/**
 * 为图片元素添加错误处理
 * @param img 图片元素
 * @param fallbackType 降级类型
 */
export const addImageErrorHandler = (
  img: HTMLImageElement,
  fallbackType: 'picsum' | 'gray' = 'picsum'
): void => {
  img.addEventListener('error', (e) => handleImageError(e, fallbackType), { once: true })
}

/**
 * 批量为图片元素添加错误处理
 * @param selector CSS 选择器，默认 'img'
 * @param fallbackType 降级类型
 */
export const addImageErrorHandlers = (
  selector: string = 'img',
  fallbackType: 'picsum' | 'gray' = 'picsum'
): void => {
  const images = document.querySelectorAll<HTMLImageElement>(selector)
  images.forEach(img => addImageErrorHandler(img, fallbackType))
}

/**
 * 检查图片 URL 是否有效
 * @param url 图片 URL
 * @returns Promise<boolean>
 */
export const checkImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/**
 * 获取图片实际尺寸
 * @param url 图片 URL
 * @returns Promise<{width: number, height: number}>
 */
export const getImageSize = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

