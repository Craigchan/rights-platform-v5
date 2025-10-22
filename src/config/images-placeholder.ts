/**
 * 图片资源配置 - Placeholder版本
 * 使用 picsum.photos 和其他支持热链接的图片服务
 * 
 * 说明:
 * 1. picsum.photos - 高质量随机图片,完全免费,支持热链接
 * 2. 所有图片都可以正常加载,无防盗链限制
 * 3. 这是临时方案,建议后续下载真实图片到本地
 */

export interface ImageSource {
  url: string
  fallback?: string
  alt?: string
}

export interface ImageConfig {
  banners: Record<string, ImageSource>
  products: Record<string, ImageSource>
  categories: Record<string, ImageSource>
  activities: Record<string, ImageSource>
  avatars: Record<string, ImageSource>
}

export const imageConfig: ImageConfig = {
  // ==================== 活动横幅 ====================
  banners: {
    newUser: {
      url: 'https://picsum.photos/seed/banner-newuser/1280/400',
      fallback: '/images/fallback/banner-new-user.jpg',
      alt: '新用户专享优惠'
    },
    flashSale: {
      url: 'https://picsum.photos/seed/banner-flashsale/1280/400',
      fallback: '/images/fallback/banner-flash-sale.jpg',
      alt: '限时秒杀'
    },
    springFestival: {
      url: 'https://picsum.photos/seed/banner-spring/1280/400',
      fallback: '/images/fallback/banner-spring-festival.jpg',
      alt: '春节特惠活动'
    },
    memberDay: {
      url: 'https://picsum.photos/seed/banner-member/1280/400',
      fallback: '/images/fallback/banner-member-day.jpg',
      alt: '会员日专享'
    }
  },

  // ==================== 商品图片 ====================
  products: {
    // 家电类
    smartCooker: {
      url: 'https://picsum.photos/seed/product-cooker/640/640',
      fallback: '/images/fallback/product-cooker.jpg',
      alt: '智能电饭煲'
    },
    airConditioner: {
      url: 'https://picsum.photos/seed/product-ac/640/640',
      fallback: '/images/fallback/product-ac.jpg',
      alt: '空调'
    },
    refrigerator: {
      url: 'https://picsum.photos/seed/product-fridge/640/640',
      fallback: '/images/fallback/product-fridge.jpg',
      alt: '冰箱'
    },
    washingMachine: {
      url: 'https://picsum.photos/seed/product-washer/640/640',
      fallback: '/images/fallback/product-washer.jpg',
      alt: '洗衣机'
    },
    microwave: {
      url: 'https://picsum.photos/seed/product-microwave/640/640',
      fallback: '/images/fallback/product-microwave.jpg',
      alt: '微波炉'
    },
    vacuumCleaner: {
      url: 'https://picsum.photos/seed/product-vacuum/640/640',
      fallback: '/images/fallback/product-vacuum.jpg',
      alt: '吸尘器'
    },

    // 数码类
    smartphone: {
      url: 'https://picsum.photos/seed/product-phone/640/640',
      fallback: '/images/fallback/product-phone.jpg',
      alt: '智能手机'
    },
    laptop: {
      url: 'https://picsum.photos/seed/product-laptop/640/640',
      fallback: '/images/fallback/product-laptop.jpg',
      alt: '笔记本电脑'
    },
    headphones: {
      url: 'https://picsum.photos/seed/product-headphones/640/640',
      fallback: '/images/fallback/product-headphones.jpg',
      alt: '蓝牙耳机'
    },
    smartwatch: {
      url: 'https://picsum.photos/seed/product-watch/640/640',
      fallback: '/images/fallback/product-watch.jpg',
      alt: '智能手表'
    },
    tablet: {
      url: 'https://picsum.photos/seed/product-tablet/640/640',
      fallback: '/images/fallback/product-tablet.jpg',
      alt: '平板电脑'
    },
    camera: {
      url: 'https://picsum.photos/seed/product-camera/640/640',
      fallback: '/images/fallback/product-camera.jpg',
      alt: '数码相机'
    },

    // 服饰类
    sneakers: {
      url: 'https://picsum.photos/seed/product-sneakers/640/640',
      fallback: '/images/fallback/product-sneakers.jpg',
      alt: '运动鞋'
    },
    jacket: {
      url: 'https://picsum.photos/seed/product-jacket/640/640',
      fallback: '/images/fallback/product-jacket.jpg',
      alt: '夹克'
    },
    backpack: {
      url: 'https://picsum.photos/seed/product-backpack/640/640',
      fallback: '/images/fallback/product-backpack.jpg',
      alt: '背包'
    },
    sunglasses: {
      url: 'https://picsum.photos/seed/product-sunglasses/640/640',
      fallback: '/images/fallback/product-sunglasses.jpg',
      alt: '太阳镜'
    },

    // 食品类
    coffee: {
      url: 'https://picsum.photos/seed/product-coffee/640/640',
      fallback: '/images/fallback/product-coffee.jpg',
      alt: '咖啡'
    },
    fruits: {
      url: 'https://picsum.photos/seed/product-fruits/640/640',
      fallback: '/images/fallback/product-fruits.jpg',
      alt: '新鲜水果'
    },
    snacks: {
      url: 'https://picsum.photos/seed/product-snacks/640/640',
      fallback: '/images/fallback/product-snacks.jpg',
      alt: '零食'
    }
  },

  // ==================== 分类图标 ====================
  categories: {
    electronics: {
      url: 'https://picsum.photos/seed/category-electronics/400/400',
      fallback: '/images/fallback/category-electronics.jpg',
      alt: '数码电器'
    },
    fashion: {
      url: 'https://picsum.photos/seed/category-fashion/400/400',
      fallback: '/images/fallback/category-fashion.jpg',
      alt: '服饰鞋包'
    },
    food: {
      url: 'https://picsum.photos/seed/category-food/400/400',
      fallback: '/images/fallback/category-food.jpg',
      alt: '食品生鲜'
    },
    home: {
      url: 'https://picsum.photos/seed/category-home/400/400',
      fallback: '/images/fallback/category-home.jpg',
      alt: '家居生活'
    },
    beauty: {
      url: 'https://picsum.photos/seed/category-beauty/400/400',
      fallback: '/images/fallback/category-beauty.jpg',
      alt: '美妆个护'
    },
    sports: {
      url: 'https://picsum.photos/seed/category-sports/400/400',
      fallback: '/images/fallback/category-sports.jpg',
      alt: '运动户外'
    },
    books: {
      url: 'https://picsum.photos/seed/category-books/400/400',
      fallback: '/images/fallback/category-books.jpg',
      alt: '图书文娱'
    },
    toys: {
      url: 'https://picsum.photos/seed/category-toys/400/400',
      fallback: '/images/fallback/category-toys.jpg',
      alt: '玩具母婴'
    }
  },

  // ==================== 活动图片 ====================
  activities: {
    dejiPlaza: {
      url: 'https://picsum.photos/seed/activity-deji/640/400',
      fallback: '/images/fallback/activity-deji.jpg',
      alt: '德基广场周年庆'
    },
    happyValley: {
      url: 'https://picsum.photos/seed/activity-happyvalley/640/400',
      fallback: '/images/fallback/activity-happyvalley.jpg',
      alt: '南京欢乐谷'
    },
    foodFestival: {
      url: 'https://picsum.photos/seed/activity-food/640/400',
      fallback: '/images/fallback/activity-food.jpg',
      alt: '新街口美食节'
    },
    movieDiscount: {
      url: 'https://picsum.photos/seed/activity-movie/640/400',
      fallback: '/images/fallback/activity-movie.jpg',
      alt: '电影票优惠'
    },
    travelPromo: {
      url: 'https://picsum.photos/seed/activity-travel/640/400',
      fallback: '/images/fallback/activity-travel.jpg',
      alt: '旅游特惠'
    }
  },

  // ==================== 用户头像 ====================
  avatars: {
    default: {
      url: 'https://i.pravatar.cc/150?img=1',
      fallback: '/images/fallback/avatar-default.jpg',
      alt: '用户头像'
    },
    male1: {
      url: 'https://i.pravatar.cc/150?img=12',
      fallback: '/images/fallback/avatar-male1.jpg',
      alt: '用户头像'
    },
    female1: {
      url: 'https://i.pravatar.cc/150?img=45',
      fallback: '/images/fallback/avatar-female1.jpg',
      alt: '用户头像'
    }
  }
}

/**
 * 获取图片URL的辅助函数
 * @param category 图片分类
 * @param key 图片键名
 * @param size 图片尺寸 (640, 960, 1280, 1920)
 * @returns 图片URL
 */
export function getImageUrl(
  category: keyof ImageConfig, 
  key: string,
  size: 640 | 960 | 1280 | 1920 = 640
): string {
  const image = imageConfig[category]?.[key]
  if (!image?.url) {
    return image?.fallback || '/images/placeholder.jpg'
  }
  
  // picsum.photos支持动态尺寸调整
  // 将URL中的尺寸参数替换为请求的尺寸
  const url = image.url.replace(/\/(\d+)\/(\d+)/, `/${size}/${size}`)
  return url
}

/**
 * 获取图片配置的辅助函数
 * @param category 图片分类
 * @param key 图片键名
 * @returns 图片配置对象
 */
export function getImageConfig(category: keyof ImageConfig, key: string): ImageSource {
  return imageConfig[category]?.[key] || {
    url: '/images/placeholder.jpg',
    fallback: '/images/placeholder.jpg',
    alt: '图片'
  }
}

/**
 * 获取响应式图片srcset
 * @param category 图片分类
 * @param key 图片键名
 * @returns srcset字符串
 */
export function getImageSrcset(category: keyof ImageConfig, key: string): string {
  const image = imageConfig[category]?.[key]
  if (!image?.url) {
    return ''
  }
  
  // 生成不同尺寸的URL
  const url640 = image.url.replace(/\/(\d+)\/(\d+)/, '/640/640')
  const url960 = image.url.replace(/\/(\d+)\/(\d+)/, '/960/960')
  const url1280 = image.url.replace(/\/(\d+)\/(\d+)/, '/1280/1280')
  
  return `
    ${url640} 640w,
    ${url960} 960w,
    ${url1280} 1280w
  `.trim()
}

/**
 * 批量获取某个分类的所有图片
 * @param category 图片分类
 * @returns 图片配置数组
 */
export function getCategoryImages(category: keyof ImageConfig): Array<ImageSource & { key: string }> {
  const categoryConfig = imageConfig[category]
  return Object.entries(categoryConfig).map(([key, value]) => ({
    key,
    ...value
  }))
}

