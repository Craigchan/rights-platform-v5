// 权益平台 - 真实数据模拟工具

/**
 * 生成随机整数
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成随机浮点数
 */
export const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  const value = Math.random() * (max - min) + min
  return Number(value.toFixed(decimals))
}

/**
 * 从数组中随机选择一个元素
 */
export const randomChoice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 从数组中随机选择多个元素
 */
export const randomChoices = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

/**
 * 生成真实化的用户名
 */
export const generateUsername = (): string => {
  const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗']
  const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀英', '桂英', '建华', '玉兰']
  
  const surname = randomChoice(surnames)
  const name = randomChoice(names)
  
  // 30% 概率显示完整名字，70% 概率隐藏中间字
  if (Math.random() > 0.3) {
    return `${surname}*${name.slice(-1)}`
  }
  return `${surname}${name}`
}

/**
 * 生成真实化的手机号（脱敏）
 */
export const generatePhone = (): string => {
  const prefixes = ['130', '131', '132', '133', '135', '136', '137', '138', '139', '150', '151', '152', '155', '156', '157', '158', '159', '180', '181', '182', '183', '185', '186', '187', '188', '189']
  const prefix = randomChoice(prefixes)
  const middle = '****'
  const suffix = randomInt(1000, 9999)
  return `${prefix}${middle}${suffix}`
}

/**
 * 生成真实化的地址
 */
export const generateAddress = (): string => {
  const provinces = ['江苏省', '浙江省', '上海市', '北京市', '广东省', '山东省', '四川省', '湖北省', '河南省', '福建省']
  const cities = ['南京市', '苏州市', '无锡市', '杭州市', '宁波市', '深圳市', '广州市', '成都市', '武汉市', '郑州市']
  const districts = ['鼓楼区', '玄武区', '秦淮区', '建邺区', '雨花台区', '江宁区', '浦口区', '栖霞区', '六合区', '溧水区']
  const streets = ['中山路', '中央路', '汉中路', '新街口', '湖南路', '山西路', '北京东路', '北京西路', '上海路', '广州路']
  
  const province = randomChoice(provinces)
  const city = randomChoice(cities)
  const district = randomChoice(districts)
  const street = randomChoice(streets)
  const number = randomInt(1, 999)
  
  return `${province}${city}${district}${street}${number}号`
}

/**
 * 生成相对时间描述
 */
export const generateRelativeTime = (): string => {
  const now = Date.now()
  const options = [
    { text: '刚刚', range: [0, 60 * 1000] },
    { text: `${randomInt(1, 59)}分钟前`, range: [60 * 1000, 60 * 60 * 1000] },
    { text: `${randomInt(1, 23)}小时前`, range: [60 * 60 * 1000, 24 * 60 * 60 * 1000] },
    { text: '昨天', range: [24 * 60 * 60 * 1000, 2 * 24 * 60 * 60 * 1000] },
    { text: `${randomInt(2, 6)}天前`, range: [2 * 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000] },
    { text: '1周前', range: [7 * 24 * 60 * 60 * 1000, 14 * 24 * 60 * 60 * 1000] },
    { text: `${randomInt(2, 4)}周前`, range: [14 * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000] },
    { text: '1个月前', range: [30 * 24 * 60 * 60 * 1000, 60 * 24 * 60 * 60 * 1000] }
  ]
  
  return randomChoice(options).text
}

/**
 * 生成倒计时文本
 */
export const generateCountdown = (): string => {
  const hours = randomInt(0, 23)
  const minutes = randomInt(0, 59)
  const seconds = randomInt(0, 59)
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * 生成真实化的价格
 */
export const generatePrice = (min: number = 10, max: number = 10000): number => {
  const price = randomFloat(min, max, 2)
  // 让价格更真实，避免过于整齐
  const endings = [0.99, 0.90, 0.80, 0.50, 0.00]
  const ending = randomChoice(endings)
  return Math.floor(price) + ending
}

/**
 * 生成真实化的积分
 */
export const generatePoints = (min: number = 100, max: number = 100000): number => {
  const points = randomInt(min, max)
  // 让积分看起来更真实
  const lastDigit = points % 10
  if (lastDigit === 0 && Math.random() > 0.3) {
    return points + randomInt(1, 9)
  }
  return points
}

/**
 * 生成真实化的销量
 */
export const generateSales = (min: number = 10, max: number = 100000): number => {
  const sales = randomInt(min, max)
  // 热门商品销量更高
  if (Math.random() > 0.7) {
    return sales * randomInt(2, 10)
  }
  return sales
}

/**
 * 生成真实化的评价
 */
export const generateReview = (): string => {
  const reviews = [
    '商品质量很好，物流也很快，非常满意！',
    '性价比超高，比实体店便宜很多，值得购买。',
    '包装很精美，送人很有面子，下次还会再买。',
    '用了几天才来评价，确实不错，推荐给大家。',
    '客服态度很好，有问必答，购物体验很棒。',
    '收到货就迫不及待打开了，没有让我失望。',
    '这个价格能买到这样的商品，真的很划算。',
    '朋友推荐过来的，果然没有让我失望。',
    '质量比想象中的好，五星好评！',
    '发货速度快，包装完好，商品也很满意。'
  ]
  
  return randomChoice(reviews)
}

/**
 * 生成商品名称
 */
export const generateProductName = (category: string): string => {
  const brands = {
    electronics: ['小米', '华为', '苹果', 'OPPO', 'vivo', '三星', '荣耀', '一加'],
    appliances: ['美的', '格力', '海尔', '西门子', '松下', '飞利浦', '戴森', '九阳'],
    food: ['三只松鼠', '百草味', '良品铺子', '来伊份', '盐津铺子', '卫龙', '周黑鸭', '绝味'],
    clothing: ['优衣库', 'ZARA', 'H&M', 'GAP', '森马', '美特斯邦威', '太平鸟', '海澜之家']
  }
  
  const products = {
    electronics: ['手机', '平板电脑', '笔记本电脑', '智能手表', '耳机', '充电宝', '数据线', '保护壳'],
    appliances: ['吸尘器', '空气净化器', '电饭煲', '破壁机', '咖啡机', '电烤箱', '洗衣机', '冰箱'],
    food: ['坚果', '肉干', '薯片', '饼干', '糖果', '巧克力', '果干', '海鲜零食'],
    clothing: ['T恤', '衬衫', '牛仔裤', '运动鞋', '连衣裙', '外套', '卫衣', '休闲裤']
  }
  
  const specs = {
    electronics: ['5G版', '128GB', '256GB', '512GB', 'Pro版', 'Max版', '旗舰版', '标准版'],
    appliances: ['智能款', '旗舰款', '升级版', '豪华版', '家用款', '商用款', '静音款', '节能款'],
    food: ['原味', '香辣味', '海盐味', '蜂蜜味', '芝士味', '烧烤味', '麻辣味', '五香味'],
    clothing: ['春季新款', '夏季新款', '秋季新款', '冬季新款', '经典款', '限量款', '联名款', '热卖款']
  }
  
  const brand = randomChoice(brands[category as keyof typeof brands] || brands.electronics)
  const product = randomChoice(products[category as keyof typeof products] || products.electronics)
  const spec = randomChoice(specs[category as keyof typeof specs] || specs.electronics)
  
  return `${brand} ${product} ${spec}`
}

/**
 * 生成活动标题
 */
export const generateActivityTitle = (): string => {
  const prefixes = ['限时特惠', '疯狂抢购', '超值优惠', '品质好货', '爆款推荐', '新品上市', '热卖精选', '会员专享']
  const middles = ['家电', '3C数码', '食品', '服装', '家居', '美妆', '运动', '图书']
  const suffixes = ['大促', '专场', '狂欢', '节', '周', '季', '月', '日']
  
  const prefix = randomChoice(prefixes)
  const middle = randomChoice(middles)
  const suffix = randomChoice(suffixes)
  
  return `${prefix}·${middle}${suffix}`
}

/**
 * 生成活动描述
 */
export const generateActivityDesc = (): string => {
  const templates = [
    `满${randomInt(100, 500)}减${randomInt(20, 100)}元`,
    `全场${randomInt(5, 9)}折起`,
    `最高立减${randomInt(100, 1000)}元`,
    `买${randomInt(1, 3)}送${randomInt(1, 2)}`,
    `第${randomInt(2, 3)}件半价`,
    `限时${randomInt(1, 24)}小时特惠`,
    `前${randomInt(100, 1000)}名送好礼`,
    `每满${randomInt(100, 300)}减${randomInt(30, 100)}元`
  ]
  
  return randomChoice(templates)
}

/**
 * 生成优惠券信息
 */
export const generateVoucher = () => {
  const types = ['满减券', '折扣券', '兑换券', '通用券', '品类券']
  const type = randomChoice(types)
  
  let title = ''
  let amount = 0
  let condition = 0
  
  if (type === '满减券') {
    amount = randomInt(5, 100)
    condition = amount * randomInt(2, 10)
    title = `满${condition}减${amount}元`
  } else if (type === '折扣券') {
    const discount = randomChoice([9.5, 9, 8.8, 8.5, 8, 7.5, 7])
    condition = randomInt(50, 500)
    title = `满${condition}享${discount}折`
    amount = 0
  } else if (type === '兑换券') {
    amount = randomInt(10, 50)
    title = `${amount}元兑换券`
    condition = 0
  } else if (type === '通用券') {
    amount = randomInt(5, 50)
    condition = amount * randomInt(2, 5)
    title = `全场通用${amount}元券`
  } else {
    amount = randomInt(10, 100)
    condition = amount * randomInt(2, 8)
    const category = randomChoice(['家电', '食品', '服装', '美妆', '图书'])
    title = `${category}${amount}元券`
  }
  
  return {
    type,
    title,
    amount,
    condition,
    validDays: randomInt(3, 30)
  }
}

/**
 * 生成距离文本
 */
export const generateDistance = (): string => {
  const distance = randomFloat(0.1, 50, 1)
  
  if (distance < 1) {
    return `${Math.floor(distance * 1000)}m`
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`
  } else {
    return `${Math.floor(distance)}km`
  }
}

/**
 * 生成评分
 */
export const generateRating = (): number => {
  // 大部分商品评分在 4.0 - 5.0 之间
  return randomFloat(4.0, 5.0, 1)
}

/**
 * 生成库存
 */
export const generateStock = (min: number = 0, max: number = 1000): number => {
  const stock = randomInt(min, max)
  
  // 20% 概率库存紧张
  if (Math.random() > 0.8) {
    return randomInt(1, 10)
  }
  
  return stock
}

/**
 * 生成订单号
 */
export const generateOrderNo = (): string => {
  const timestamp = Date.now()
  const random = randomInt(1000, 9999)
  return `${timestamp}${random}`
}

/**
 * 生成真实化的数据集
 */
export const generateMockDataset = () => {
  return {
    users: Array.from({ length: 20 }, () => ({
      id: randomInt(10000, 99999),
      name: generateUsername(),
      phone: generatePhone(),
      address: generateAddress(),
      points: generatePoints(),
      avatar: `https://i.pravatar.cc/150?img=${randomInt(1, 70)}`
    })),
    
    products: Array.from({ length: 50 }, () => {
      const category = randomChoice(['electronics', 'appliances', 'food', 'clothing'])
      const price = generatePrice(10, 5000)
      const points = Math.floor(price * randomInt(8, 12) / 10)
      
      return {
        id: randomInt(10000, 99999),
        name: generateProductName(category),
        category,
        price,
        originalPrice: price * randomFloat(1.2, 2.0),
        points,
        sales: generateSales(),
        stock: generateStock(),
        rating: generateRating(),
        image: `/images/products/${category}-${randomInt(1, 5)}.jpg`
      }
    }),
    
    activities: Array.from({ length: 20 }, () => ({
      id: randomInt(10000, 99999),
      title: generateActivityTitle(),
      desc: generateActivityDesc(),
      participants: generateSales(100, 50000),
      deadline: `${randomInt(1, 30)}天后结束`,
      image: `/images/activities/activity-${randomInt(1, 10)}.jpg`
    })),
    
    vouchers: Array.from({ length: 30 }, () => {
      const voucher = generateVoucher()
      return {
        id: randomInt(10000, 99999),
        ...voucher,
        validUntil: new Date(Date.now() + voucher.validDays * 24 * 60 * 60 * 1000).toLocaleDateString()
      }
    }),
    
    reviews: Array.from({ length: 100 }, () => ({
      id: randomInt(10000, 99999),
      userName: generateUsername(),
      rating: generateRating(),
      content: generateReview(),
      time: generateRelativeTime(),
      images: Math.random() > 0.5 ? Array.from({ length: randomInt(1, 3) }, () => `/images/reviews/review-${randomInt(1, 20)}.jpg`) : []
    }))
  }
}

export default {
  randomInt,
  randomFloat,
  randomChoice,
  randomChoices,
  generateUsername,
  generatePhone,
  generateAddress,
  generateRelativeTime,
  generateCountdown,
  generatePrice,
  generatePoints,
  generateSales,
  generateReview,
  generateProductName,
  generateActivityTitle,
  generateActivityDesc,
  generateVoucher,
  generateDistance,
  generateRating,
  generateStock,
  generateOrderNo,
  generateMockDataset
}

