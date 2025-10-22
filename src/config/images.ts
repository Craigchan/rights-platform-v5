/**
 * 图片资源配置 - Pixabay版本
 * 所有图片来自 Pixabay (https://pixabay.com/zh/)
 * 授权: Content License (免费商用,无需署名)
 * 
 * 使用说明:
 * 1. 所有图片URL均来自Pixabay CDN,国内访问速度快
 * 2. 每个图片都配置了本地fallback占位图
 * 3. 准备上线时,建议下载图片并迁移到自己的CDN
 */

export interface ImageSource {
  url: string
  fallback?: string
  alt?: string
  pixabayId?: number // Pixabay图片ID,便于追踪
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
      url: 'https://cdn.pixabay.com/photo/2016/03/27/19/31/shopping-1309519_1280.jpg',
      fallback: '/images/fallback/banner-new-user.jpg',
      alt: '新用户专享优惠',
      pixabayId: 1309519
    },
    flashSale: {
      url: 'https://cdn.pixabay.com/photo/2018/12/23/20/47/shopping-3962246_1280.jpg',
      fallback: '/images/fallback/banner-flash-sale.jpg',
      alt: '限时秒杀',
      pixabayId: 3962246
    },
    springFestival: {
      url: 'https://cdn.pixabay.com/photo/2017/10/10/07/48/chinese-new-year-2847508_1280.jpg',
      fallback: '/images/fallback/banner-spring-festival.jpg',
      alt: '春节特惠活动',
      pixabayId: 2847508
    },
    memberDay: {
      url: 'https://cdn.pixabay.com/photo/2017/03/13/17/26/ecommerce-2140603_1280.jpg',
      fallback: '/images/fallback/banner-member-day.jpg',
      alt: '会员日专享',
      pixabayId: 2140603
    }
  },

  // ==================== 商品图片 ====================
  products: {
    // 家电类
    smartCooker: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/11/11/rice-cooker-1889068_640.jpg',
      fallback: '/images/fallback/product-cooker.jpg',
      alt: '智能电饭煲',
      pixabayId: 1889068
    },
    airConditioner: {
      url: 'https://cdn.pixabay.com/photo/2020/10/15/17/26/air-conditioner-5710192_640.jpg',
      fallback: '/images/fallback/product-ac.jpg',
      alt: '空调',
      pixabayId: 5710192
    },
    refrigerator: {
      url: 'https://cdn.pixabay.com/photo/2017/07/03/20/17/kitchen-2475582_640.jpg',
      fallback: '/images/fallback/product-fridge.jpg',
      alt: '冰箱',
      pixabayId: 2475582
    },
    washingMachine: {
      url: 'https://cdn.pixabay.com/photo/2017/08/10/03/47/washing-machine-2668472_640.jpg',
      fallback: '/images/fallback/product-washer.jpg',
      alt: '洗衣机',
      pixabayId: 2668472
    },
    microwave: {
      url: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/kitchen-2068732_640.jpg',
      fallback: '/images/fallback/product-microwave.jpg',
      alt: '微波炉',
      pixabayId: 2068732
    },
    vacuumCleaner: {
      url: 'https://cdn.pixabay.com/photo/2015/07/11/09/07/vacuum-cleaner-839899_640.jpg',
      fallback: '/images/fallback/product-vacuum.jpg',
      alt: '吸尘器',
      pixabayId: 839899
    },

    // 数码类
    smartphone: {
      url: 'https://cdn.pixabay.com/photo/2016/06/07/17/15/iphone-1419275_640.jpg',
      fallback: '/images/fallback/product-phone.jpg',
      alt: '智能手机',
      pixabayId: 1419275
    },
    laptop: {
      url: 'https://cdn.pixabay.com/photo/2014/05/02/21/50/laptop-336378_640.jpg',
      fallback: '/images/fallback/product-laptop.jpg',
      alt: '笔记本电脑',
      pixabayId: 336378
    },
    headphones: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/08/41/apple-1868612_640.jpg',
      fallback: '/images/fallback/product-headphones.jpg',
      alt: '蓝牙耳机',
      pixabayId: 1868612
    },
    smartwatch: {
      url: 'https://cdn.pixabay.com/photo/2015/07/02/10/22/smartwatch-828786_640.jpg',
      fallback: '/images/fallback/product-watch.jpg',
      alt: '智能手表',
      pixabayId: 828786
    },
    tablet: {
      url: 'https://cdn.pixabay.com/photo/2015/01/21/14/14/ipad-605440_640.jpg',
      fallback: '/images/fallback/product-tablet.jpg',
      alt: '平板电脑',
      pixabayId: 605440
    },
    camera: {
      url: 'https://cdn.pixabay.com/photo/2016/11/19/15/32/camera-1839384_640.jpg',
      fallback: '/images/fallback/product-camera.jpg',
      alt: '数码相机',
      pixabayId: 1839384
    },

    // 服饰类
    sneakers: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/03/53/shoes-1867055_640.jpg',
      fallback: '/images/fallback/product-sneakers.jpg',
      alt: '运动鞋',
      pixabayId: 1867055
    },
    jacket: {
      url: 'https://cdn.pixabay.com/photo/2016/11/23/18/19/jacket-1850804_640.jpg',
      fallback: '/images/fallback/product-jacket.jpg',
      alt: '夹克',
      pixabayId: 1850804
    },
    backpack: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/04/54/backpack-1867744_640.jpg',
      fallback: '/images/fallback/product-backpack.jpg',
      alt: '背包',
      pixabayId: 1867744
    },
    sunglasses: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/03/36/sunglasses-1866963_640.jpg',
      fallback: '/images/fallback/product-sunglasses.jpg',
      alt: '太阳镜',
      pixabayId: 1866963
    },

    // 食品类
    coffee: {
      url: 'https://cdn.pixabay.com/photo/2015/05/07/13/46/coffee-756490_640.jpg',
      fallback: '/images/fallback/product-coffee.jpg',
      alt: '咖啡',
      pixabayId: 756490
    },
    fruits: {
      url: 'https://cdn.pixabay.com/photo/2016/11/18/14/39/vegetables-1834645_640.jpg',
      fallback: '/images/fallback/product-fruits.jpg',
      alt: '新鲜水果',
      pixabayId: 1834645
    },
    snacks: {
      url: 'https://cdn.pixabay.com/photo/2017/01/11/11/33/cake-1971552_640.jpg',
      fallback: '/images/fallback/product-snacks.jpg',
      alt: '零食',
      pixabayId: 1971552
    }
  },

  // ==================== 分类图标 ====================
  categories: {
    electronics: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/09/10/electronics-1867761_640.jpg',
      fallback: '/images/fallback/category-electronics.jpg',
      alt: '数码电器',
      pixabayId: 1867761
    },
    fashion: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/04/19/fashion-1867096_640.jpg',
      fallback: '/images/fallback/category-fashion.jpg',
      alt: '服饰鞋包',
      pixabayId: 1867096
    },
    food: {
      url: 'https://cdn.pixabay.com/photo/2016/11/18/14/39/vegetables-1834645_640.jpg',
      fallback: '/images/fallback/category-food.jpg',
      alt: '食品生鲜',
      pixabayId: 1834645
    },
    home: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/04/19/home-1867093_640.jpg',
      fallback: '/images/fallback/category-home.jpg',
      alt: '家居生活',
      pixabayId: 1867093
    },
    beauty: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/12/13/cosmetics-1869277_640.jpg',
      fallback: '/images/fallback/category-beauty.jpg',
      alt: '美妆个护',
      pixabayId: 1869277
    },
    sports: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/01/22/sport-1866837_640.jpg',
      fallback: '/images/fallback/category-sports.jpg',
      alt: '运动户外',
      pixabayId: 1866837
    },
    books: {
      url: 'https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_640.jpg',
      fallback: '/images/fallback/category-books.jpg',
      alt: '图书文娱',
      pixabayId: 1052010
    },
    toys: {
      url: 'https://cdn.pixabay.com/photo/2017/05/13/12/40/toy-2309531_640.jpg',
      fallback: '/images/fallback/category-toys.jpg',
      alt: '玩具母婴',
      pixabayId: 2309531
    }
  },

  // ==================== 活动图片 ====================
  activities: {
    dejiPlaza: {
      url: 'https://cdn.pixabay.com/photo/2016/11/22/19/15/hand-1850120_640.jpg',
      fallback: '/images/fallback/activity-deji.jpg',
      alt: '德基广场周年庆',
      pixabayId: 1850120
    },
    happyValley: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/02/05/ferris-wheel-1866876_640.jpg',
      fallback: '/images/fallback/activity-happyvalley.jpg',
      alt: '南京欢乐谷',
      pixabayId: 1866876
    },
    foodFestival: {
      url: 'https://cdn.pixabay.com/photo/2015/05/31/13/59/restaurant-791207_640.jpg',
      fallback: '/images/fallback/activity-food.jpg',
      alt: '新街口美食节',
      pixabayId: 791207
    },
    movieDiscount: {
      url: 'https://cdn.pixabay.com/photo/2017/12/08/11/52/cinema-3005147_640.jpg',
      fallback: '/images/fallback/activity-movie.jpg',
      alt: '电影票优惠',
      pixabayId: 3005147
    },
    travelPromo: {
      url: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/adventure-1867908_640.jpg',
      fallback: '/images/fallback/activity-travel.jpg',
      alt: '旅游特惠',
      pixabayId: 1867908
    }
  },

  // ==================== 用户头像 ====================
  avatars: {
    default: {
      url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
      fallback: '/images/fallback/avatar-default.jpg',
      alt: '用户头像',
      pixabayId: 973460
    },
    male1: {
      url: 'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_640.png',
      fallback: '/images/fallback/avatar-male1.jpg',
      alt: '用户头像',
      pixabayId: 1837375
    },
    female1: {
      url: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_640.jpg',
      fallback: '/images/fallback/avatar-female1.jpg',
      alt: '用户头像',
      pixabayId: 1845166
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
  
  // 替换URL中的尺寸参数
  const url = image.url.replace(/_\d+\.(jpg|png)/, `_${size}.$1`)
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
  
  const baseUrl = image.url.replace(/_\d+\.(jpg|png)/, '')
  const ext = image.url.match(/\.(jpg|png)$/)?.[0] || '.jpg'
  
  return `
    ${baseUrl}_640${ext} 640w,
    ${baseUrl}_960${ext} 960w,
    ${baseUrl}_1280${ext} 1280w
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

