/**
 * 图片资源配置
 * 集中管理所有图片URL,便于维护和替换
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

/**
 * 图片配置
 * 
 * 使用说明:
 * 1. 当前使用在线图片网站(Unsplash/Pexels)的URL
 * 2. 每个图片都配置了fallback本地占位图
 * 3. 准备上线时,使用 scripts/replace-image-urls.js 批量替换为CDN URL
 */
export const imageConfig: ImageConfig = {
  // 活动横幅
  banners: {
    newUser: {
      url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=750&q=80',
      fallback: '/images/fallback/banner-new-user.jpg',
      alt: '新用户专享优惠'
    },
    springFestival: {
      url: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=750&q=80',
      fallback: '/images/fallback/banner-spring-festival.jpg',
      alt: '春节特惠活动'
    },
    flashSale: {
      url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=750&q=80',
      fallback: '/images/fallback/banner-flash-sale.jpg',
      alt: '限时秒杀'
    }
  },

  // 商品图片
  products: {
    // 家电类
    smartCooker: {
      url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
      fallback: '/images/fallback/product-cooker.jpg',
      alt: '智能电饭煲'
    },
    airConditioner: {
      url: 'https://images.unsplash.com/photo-1631545806609-4b0b76d58e1f?w=600&q=80',
      fallback: '/images/fallback/product-ac.jpg',
      alt: '空调'
    },
    refrigerator: {
      url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80',
      fallback: '/images/fallback/product-fridge.jpg',
      alt: '冰箱'
    },
    washingMachine: {
      url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80',
      fallback: '/images/fallback/product-washer.jpg',
      alt: '洗衣机'
    },

    // 数码类
    smartphone: {
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
      fallback: '/images/fallback/product-phone.jpg',
      alt: '智能手机'
    },
    laptop: {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      fallback: '/images/fallback/product-laptop.jpg',
      alt: '笔记本电脑'
    },
    headphones: {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      fallback: '/images/fallback/product-headphones.jpg',
      alt: '蓝牙耳机'
    },
    smartwatch: {
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      fallback: '/images/fallback/product-watch.jpg',
      alt: '智能手表'
    },

    // 服饰类
    sneakers: {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      fallback: '/images/fallback/product-sneakers.jpg',
      alt: '运动鞋'
    },
    jacket: {
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
      fallback: '/images/fallback/product-jacket.jpg',
      alt: '夹克'
    }
  },

  // 分类图标
  categories: {
    electronics: {
      url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=80',
      fallback: '/images/fallback/category-electronics.jpg',
      alt: '数码电器'
    },
    fashion: {
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80',
      fallback: '/images/fallback/category-fashion.jpg',
      alt: '服饰鞋包'
    },
    food: {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80',
      fallback: '/images/fallback/category-food.jpg',
      alt: '食品生鲜'
    },
    home: {
      url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&q=80',
      fallback: '/images/fallback/category-home.jpg',
      alt: '家居生活'
    }
  },

  // 活动图片
  activities: {
    dejiPlaza: {
      url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=80',
      fallback: '/images/fallback/activity-deji.jpg',
      alt: '德基广场周年庆'
    },
    happyValley: {
      url: 'https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?w=400&q=80',
      fallback: '/images/fallback/activity-happyvalley.jpg',
      alt: '南京欢乐谷'
    },
    foodFestival: {
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
      fallback: '/images/fallback/activity-food.jpg',
      alt: '新街口美食节'
    }
  },

  // 用户头像
  avatars: {
    default: {
      url: 'https://i.pravatar.cc/96',
      fallback: '/images/fallback/avatar-default.jpg',
      alt: '用户头像'
    }
  }
}

/**
 * 获取图片URL的辅助函数
 * @param category 图片分类
 * @param key 图片键名
 * @returns 图片URL
 */
export function getImageUrl(category: keyof ImageConfig, key: string): string {
  const image = imageConfig[category]?.[key]
  return image?.url || image?.fallback || '/images/placeholder.jpg'
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

