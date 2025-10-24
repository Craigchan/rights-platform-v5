// 商户推荐Store
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SubsidyType } from './subsidy'

// 商户类型
export type MerchantCategory = 
  | 'car_dealer'           // 汽车经销商
  | 'appliance_store'      // 家电商店
  | 'furniture_store'      // 家具商店
  | 'renovation_company'   // 装修公司
  | '3c_store'            // 3C数码店
  | 'green_appliance'     // 绿色家电店

// 商户信息
export interface Merchant {
  id: string
  name: string
  category: MerchantCategory
  logo: string
  images: string[]
  rating: number
  reviewCount: number
  location: {
    lat: number
    lng: number
    address: string
    district: string
  }
  distance?: number
  discountRate: number
  subsidySupport: SubsidyType[]
  tags: string[]
  description: string
  phone: string
  businessHours: string
  features: string[]
  certifications: string[]
  salesVolume: number
  establishedYear: number
}

// 推荐评分
export interface MerchantScore {
  merchant: Merchant
  totalScore: number
  distanceScore: number
  qualityScore: number
  popularityScore: number
  discountScore: number
}

export const useMerchantStore = defineStore('merchant', () => {
  const merchants = ref<Merchant[]>([])
  const userLocation = ref<{ lat: number; lng: number }>({ lat: 32.0603, lng: 118.7969 })
  
  // 初始化商家数据
  const initMerchants = () => {
    merchants.value = [
      // 汽车经销商 (5个)
      {
        id: 'm001',
        name: '江苏汽车城',
        category: 'car_dealer',
        logo: 'https://via.placeholder.com/100x100?text=Car1',
        images: ['https://via.placeholder.com/400x300?text=Showroom'],
        rating: 4.8,
        reviewCount: 2580,
        location: { lat: 32.0603, lng: 118.7969, address: '南京市建邺区江东中路100号', district: '建邺区' },
        discountRate: 15,
        subsidySupport: ['car'],
        tags: ['官方授权', '以旧换新', '金融服务'],
        description: '江苏最大的汽车销售中心',
        phone: '025-8888-8888',
        businessHours: '9:00-21:00',
        features: ['免费评估', '当日提车'],
        certifications: ['官方授权经销商'],
        salesVolume: 15000,
        establishedYear: 2010
      },
      {
        id: 'm002',
        name: '南京新能源汽车广场',
        category: 'car_dealer',
        logo: 'https://via.placeholder.com/100x100?text=Car2',
        images: ['https://via.placeholder.com/400x300?text=EV'],
        rating: 4.7,
        reviewCount: 1850,
        location: { lat: 32.0450, lng: 118.7800, address: '南京市秦淮区中山南路200号', district: '秦淮区' },
        discountRate: 18,
        subsidySupport: ['car'],
        tags: ['新能源', '环保补贴', '充电桩'],
        description: '专注新能源汽车销售',
        phone: '025-6666-6666',
        businessHours: '9:00-20:00',
        features: ['充电桩安装', '电池质保'],
        certifications: ['新能源认证'],
        salesVolume: 8000,
        establishedYear: 2018
      },
      {
        id: 'm003',
        name: '豪车汇',
        category: 'car_dealer',
        logo: 'https://via.placeholder.com/100x100?text=Car3',
        images: ['https://via.placeholder.com/400x300?text=Luxury'],
        rating: 4.9,
        reviewCount: 3200,
        location: { lat: 32.0700, lng: 118.8100, address: '南京市鼓楼区中央路300号', district: '鼓楼区' },
        discountRate: 12,
        subsidySupport: ['car'],
        tags: ['豪华品牌', 'VIP服务', '原厂配件'],
        description: '高端汽车销售服务',
        phone: '025-9999-9999',
        businessHours: '10:00-22:00',
        features: ['专属顾问', '终身保养'],
        certifications: ['豪华品牌授权'],
        salesVolume: 5000,
        establishedYear: 2015
      },
      {
        id: 'm004',
        name: '二手车交易市场',
        category: 'car_dealer',
        logo: 'https://via.placeholder.com/100x100?text=Car4',
        images: ['https://via.placeholder.com/400x300?text=Used'],
        rating: 4.5,
        reviewCount: 1200,
        location: { lat: 32.0300, lng: 118.7600, address: '南京市雨花台区软件大道400号', district: '雨花台区' },
        discountRate: 20,
        subsidySupport: ['car'],
        tags: ['二手车', '置换补贴', '质保'],
        description: '专业二手车交易平台',
        phone: '025-7777-7777',
        businessHours: '8:30-19:00',
        features: ['质量检测', '置换服务'],
        certifications: ['二手车认证'],
        salesVolume: 12000,
        establishedYear: 2012
      },
      {
        id: 'm005',
        name: '进口车直销中心',
        category: 'car_dealer',
        logo: 'https://via.placeholder.com/100x100?text=Car5',
        images: ['https://via.placeholder.com/400x300?text=Import'],
        rating: 4.6,
        reviewCount: 980,
        location: { lat: 32.0800, lng: 118.8200, address: '南京市玄武区龙蟠路500号', district: '玄武区' },
        discountRate: 10,
        subsidySupport: ['car'],
        tags: ['进口车', '平行进口', '关税优惠'],
        description: '进口汽车一站式服务',
        phone: '025-5555-5555',
        businessHours: '9:30-20:30',
        features: ['海外直采', '品质保证'],
        certifications: ['进口车资质'],
        salesVolume: 3000,
        establishedYear: 2016
      },
      
      // 家电商店 (5个)
      {
        id: 'm006',
        name: '苏宁易购旗舰店',
        category: 'appliance_store',
        logo: 'https://via.placeholder.com/100x100?text=Suning',
        images: ['https://via.placeholder.com/400x300?text=Appliance'],
        rating: 4.7,
        reviewCount: 5600,
        location: { lat: 32.0550, lng: 118.7900, address: '南京市建邺区江东中路88号', district: '建邺区' },
        discountRate: 15,
        subsidySupport: ['appliance', 'green_appliance'],
        tags: ['全国连锁', '正品保证', '送货上门'],
        description: '家电零售领导品牌',
        phone: '025-8888-1111',
        businessHours: '9:00-22:00',
        features: ['免费配送', '以旧换新', '延保服务'],
        certifications: ['连锁经营许可'],
        salesVolume: 50000,
        establishedYear: 2000
      },
      {
        id: 'm007',
        name: '国美电器',
        category: 'appliance_store',
        logo: 'https://via.placeholder.com/100x100?text=Gome',
        images: ['https://via.placeholder.com/400x300?text=Electronics'],
        rating: 4.6,
        reviewCount: 4200,
        location: { lat: 32.0400, lng: 118.7700, address: '南京市秦淮区中华路150号', district: '秦淮区' },
        discountRate: 18,
        subsidySupport: ['appliance', 'green_appliance'],
        tags: ['品牌齐全', '价格实惠', '售后保障'],
        description: '家电连锁零售企业',
        phone: '025-6666-2222',
        businessHours: '9:00-21:00',
        features: ['价格保护', '安装服务'],
        certifications: ['家电零售资质'],
        salesVolume: 40000,
        establishedYear: 2005
      },
      {
        id: 'm008',
        name: '京东家电专卖店',
        category: 'appliance_store',
        logo: 'https://via.placeholder.com/100x100?text=JD',
        images: ['https://via.placeholder.com/400x300?text=JDHome'],
        rating: 4.8,
        reviewCount: 6800,
        location: { lat: 32.0650, lng: 118.8000, address: '南京市鼓楼区中山路220号', district: '鼓楼区' },
        discountRate: 16,
        subsidySupport: ['appliance', 'green_appliance', '3c'],
        tags: ['京东自营', '次日达', '无忧退换'],
        description: '京东线下体验店',
        phone: '025-9999-3333',
        businessHours: '10:00-22:00',
        features: ['线上线下同价', '极速配送'],
        certifications: ['京东授权'],
        salesVolume: 60000,
        establishedYear: 2017
      },
      {
        id: 'm009',
        name: '五星电器',
        category: 'appliance_store',
        logo: 'https://via.placeholder.com/100x100?text=5Star',
        images: ['https://via.placeholder.com/400x300?text=5Star'],
        rating: 4.5,
        reviewCount: 3500,
        location: { lat: 32.0250, lng: 118.7550, address: '南京市雨花台区应天大街300号', district: '雨花台区' },
        discountRate: 17,
        subsidySupport: ['appliance'],
        tags: ['本地品牌', '服务周到', '维修快'],
        description: '江苏本土家电连锁',
        phone: '025-7777-4444',
        businessHours: '9:00-21:00',
        features: ['本地仓储', '快速维修'],
        certifications: ['区域连锁'],
        salesVolume: 35000,
        establishedYear: 2003
      },
      {
        id: 'm010',
        name: '格力专卖店',
        category: 'appliance_store',
        logo: 'https://via.placeholder.com/100x100?text=Gree',
        images: ['https://via.placeholder.com/400x300?text=AC'],
        rating: 4.9,
        reviewCount: 2800,
        location: { lat: 32.0750, lng: 118.8150, address: '南京市玄武区北京东路400号', district: '玄武区' },
        discountRate: 14,
        subsidySupport: ['appliance', 'green_appliance'],
        tags: ['品牌直营', '空调专家', '节能补贴'],
        description: '格力官方授权店',
        phone: '025-5555-5555',
        businessHours: '9:00-20:00',
        features: ['官方质保', '专业安装'],
        certifications: ['格力授权'],
        salesVolume: 25000,
        establishedYear: 2010
      },
      
      // 家具商店 (5个)
      {
        id: 'm011',
        name: '红星美凯龙',
        category: 'furniture_store',
        logo: 'https://via.placeholder.com/100x100?text=RedStar',
        images: ['https://via.placeholder.com/400x300?text=Furniture'],
        rating: 4.7,
        reviewCount: 4500,
        location: { lat: 32.0600, lng: 118.7950, address: '南京市建邺区江东中路168号', district: '建邺区' },
        discountRate: 12,
        subsidySupport: ['furniture'],
        tags: ['高端家具', '品牌齐全', '设计服务'],
        description: '家居建材连锁品牌',
        phone: '025-8888-6666',
        businessHours: '9:30-21:30',
        features: ['免费设计', '送货安装'],
        certifications: ['家居零售资质'],
        salesVolume: 30000,
        establishedYear: 2008
      },
      {
        id: 'm012',
        name: '宜家家居',
        category: 'furniture_store',
        logo: 'https://via.placeholder.com/100x100?text=IKEA',
        images: ['https://via.placeholder.com/400x300?text=IKEA'],
        rating: 4.8,
        reviewCount: 7200,
        location: { lat: 32.0500, lng: 118.7850, address: '南京市秦淮区卡子门大街200号', district: '秦淮区' },
        discountRate: 10,
        subsidySupport: ['furniture'],
        tags: ['北欧风格', '性价比高', '环保材料'],
        description: '瑞典家居品牌',
        phone: '025-6666-7777',
        businessHours: '10:00-22:00',
        features: ['自助购物', '会员优惠'],
        certifications: ['国际品牌'],
        salesVolume: 80000,
        establishedYear: 2012
      },
      {
        id: 'm013',
        name: '顾家家居',
        category: 'furniture_store',
        logo: 'https://via.placeholder.com/100x100?text=KUKA',
        images: ['https://via.placeholder.com/400x300?text=Sofa'],
        rating: 4.6,
        reviewCount: 3200,
        location: { lat: 32.0700, lng: 118.8050, address: '南京市鼓楼区湖南路280号', district: '鼓楼区' },
        discountRate: 15,
        subsidySupport: ['furniture'],
        tags: ['沙发专家', '软体家具', '定制服务'],
        description: '中国家居领导品牌',
        phone: '025-9999-8888',
        businessHours: '9:00-21:00',
        features: ['个性定制', '终身维护'],
        certifications: ['品牌授权'],
        salesVolume: 20000,
        establishedYear: 2015
      },
      {
        id: 'm014',
        name: '全友家居',
        category: 'furniture_store',
        logo: 'https://via.placeholder.com/100x100?text=QuanU',
        images: ['https://via.placeholder.com/400x300?text=Home'],
        rating: 4.5,
        reviewCount: 2600,
        location: { lat: 32.0300, lng: 118.7650, address: '南京市雨花台区软件大道350号', district: '雨花台区' },
        discountRate: 18,
        subsidySupport: ['furniture'],
        tags: ['全屋定制', '环保板材', '一站式'],
        description: '全屋家具解决方案',
        phone: '025-7777-9999',
        businessHours: '9:00-20:00',
        features: ['全屋设计', '环保认证'],
        certifications: ['环保认证'],
        salesVolume: 18000,
        establishedYear: 2011
      },
      {
        id: 'm015',
        name: '曲美家居',
        category: 'furniture_store',
        logo: 'https://via.placeholder.com/100x100?text=QM',
        images: ['https://via.placeholder.com/400x300?text=Modern'],
        rating: 4.7,
        reviewCount: 1900,
        location: { lat: 32.0800, lng: 118.8200, address: '南京市玄武区珠江路350号', district: '玄武区' },
        discountRate: 13,
        subsidySupport: ['furniture'],
        tags: ['现代简约', '原创设计', '品质保证'],
        description: '原创设计家具品牌',
        phone: '025-5555-1111',
        businessHours: '9:30-20:30',
        features: ['原创设计', '品质保证'],
        certifications: ['设计专利'],
        salesVolume: 15000,
        establishedYear: 2013
      },
      
      // 装修公司 (5个)
      {
        id: 'm016',
        name: '东易日盛装饰',
        category: 'renovation_company',
        logo: 'https://via.placeholder.com/100x100?text=Dongyi',
        images: ['https://via.placeholder.com/400x300?text=Renovation'],
        rating: 4.8,
        reviewCount: 3800,
        location: { lat: 32.0620, lng: 118.7980, address: '南京市建邺区江东中路128号', district: '建邺区' },
        discountRate: 10,
        subsidySupport: ['renovation'],
        tags: ['高端装修', '全案设计', '环保材料'],
        description: '中国家装行业领导品牌',
        phone: '025-8888-2222',
        businessHours: '9:00-21:00',
        features: ['3D设计', '环保施工', '质保5年'],
        certifications: ['装修资质一级'],
        salesVolume: 5000,
        establishedYear: 2006
      },
      {
        id: 'm017',
        name: '业之峰装饰',
        category: 'renovation_company',
        logo: 'https://via.placeholder.com/100x100?text=Yezhi',
        images: ['https://via.placeholder.com/400x300?text=Design'],
        rating: 4.7,
        reviewCount: 3200,
        location: { lat: 32.0480, lng: 118.7820, address: '南京市秦淮区中山南路180号', district: '秦淮区' },
        discountRate: 12,
        subsidySupport: ['renovation'],
        tags: ['整装服务', '德系工艺', '透明报价'],
        description: '全国连锁装饰企业',
        phone: '025-6666-3333',
        businessHours: '9:00-20:00',
        features: ['德系工艺', '透明报价'],
        certifications: ['装修资质'],
        salesVolume: 4500,
        establishedYear: 2008
      },
      {
        id: 'm018',
        name: '金螳螂家',
        category: 'renovation_company',
        logo: 'https://via.placeholder.com/100x100?text=JTL',
        images: ['https://via.placeholder.com/400x300?text=Luxury'],
        rating: 4.9,
        reviewCount: 2800,
        location: { lat: 32.0720, lng: 118.8080, address: '南京市鼓楼区中央路260号', district: '鼓楼区' },
        discountRate: 8,
        subsidySupport: ['renovation'],
        tags: ['豪宅装修', '上市公司', '工程品质'],
        description: '上市装饰企业',
        phone: '025-9999-4444',
        businessHours: '9:30-21:00',
        features: ['豪宅设计', '工程管理'],
        certifications: ['装修资质特级'],
        salesVolume: 3000,
        establishedYear: 2010
      },
      {
        id: 'm019',
        name: '生活家装饰',
        category: 'renovation_company',
        logo: 'https://via.placeholder.com/100x100?text=Life',
        images: ['https://via.placeholder.com/400x300?text=Home'],
        rating: 4.6,
        reviewCount: 2400,
        location: { lat: 32.0280, lng: 118.7600, address: '南京市雨花台区应天大街280号', district: '雨花台区' },
        discountRate: 15,
        subsidySupport: ['renovation'],
        tags: ['整装套餐', '性价比高', '快速交付'],
        description: '整装一站式服务',
        phone: '025-7777-5555',
        businessHours: '9:00-20:00',
        features: ['整装套餐', '快速交付'],
        certifications: ['装修资质'],
        salesVolume: 6000,
        establishedYear: 2012
      },
      {
        id: 'm020',
        name: '土巴兔装修',
        category: 'renovation_company',
        logo: 'https://via.placeholder.com/100x100?text=Tubatu',
        images: ['https://via.placeholder.com/400x300?text=Platform'],
        rating: 4.5,
        reviewCount: 5600,
        location: { lat: 32.0780, lng: 118.8180, address: '南京市玄武区龙蟠路380号', district: '玄武区' },
        discountRate: 20,
        subsidySupport: ['renovation'],
        tags: ['互联网装修', '多家对比', '装修保'],
        description: '互联网装修平台',
        phone: '025-5555-6666',
        businessHours: '8:30-21:00',
        features: ['装修保障', '多家对比'],
        certifications: ['平台认证'],
        salesVolume: 8000,
        establishedYear: 2015
      },
      
      // 3C数码店 (5个)
      {
        id: 'm021',
        name: '苹果授权专营店',
        category: '3c_store',
        logo: 'https://via.placeholder.com/100x100?text=Apple',
        images: ['https://via.placeholder.com/400x300?text=iPhone'],
        rating: 4.9,
        reviewCount: 8900,
        location: { lat: 32.0580, lng: 118.7920, address: '南京市建邺区江东中路108号', district: '建邺区' },
        discountRate: 5,
        subsidySupport: ['3c'],
        tags: ['官方授权', '正品保证', '以旧换新'],
        description: '苹果官方授权店',
        phone: '025-8888-3333',
        businessHours: '10:00-22:00',
        features: ['官方质保', 'AppleCare'],
        certifications: ['苹果授权'],
        salesVolume: 50000,
        establishedYear: 2014
      },
      {
        id: 'm022',
        name: '华为体验店',
        category: '3c_store',
        logo: 'https://via.placeholder.com/100x100?text=Huawei',
        images: ['https://via.placeholder.com/400x300?text=Mate'],
        rating: 4.8,
        reviewCount: 7200,
        location: { lat: 32.0460, lng: 118.7800, address: '南京市秦淮区中华路160号', district: '秦淮区' },
        discountRate: 8,
        subsidySupport: ['3c'],
        tags: ['国产品牌', '5G手机', '智能生态'],
        description: '华为官方体验店',
        phone: '025-6666-4444',
        businessHours: '10:00-21:00',
        features: ['全系产品', '智能家居'],
        certifications: ['华为授权'],
        salesVolume: 45000,
        establishedYear: 2016
      },
      {
        id: 'm023',
        name: '小米之家',
        category: '3c_store',
        logo: 'https://via.placeholder.com/100x100?text=Mi',
        images: ['https://via.placeholder.com/400x300?text=Xiaomi'],
        rating: 4.7,
        reviewCount: 6500,
        location: { lat: 32.0680, lng: 118.8020, address: '南京市鼓楼区中山路240号', district: '鼓楼区' },
        discountRate: 10,
        subsidySupport: ['3c'],
        tags: ['性价比', 'IoT生态', '米粉专享'],
        description: '小米线下零售店',
        phone: '025-9999-5555',
        businessHours: '10:00-22:00',
        features: ['IoT体验', '会员优惠'],
        certifications: ['小米授权'],
        salesVolume: 40000,
        establishedYear: 2017
      },
      {
        id: 'm024',
        name: '戴尔直营店',
        category: '3c_store',
        logo: 'https://via.placeholder.com/100x100?text=Dell',
        images: ['https://via.placeholder.com/400x300?text=Laptop'],
        rating: 4.6,
        reviewCount: 3800,
        location: { lat: 32.0320, lng: 118.7680, address: '南京市雨花台区软件大道320号', district: '雨花台区' },
        discountRate: 12,
        subsidySupport: ['3c'],
        tags: ['商务笔记本', '定制服务', '企业采购'],
        description: '戴尔官方直营店',
        phone: '025-7777-6666',
        businessHours: '9:00-20:00',
        features: ['定制配置', '企业服务'],
        certifications: ['戴尔授权'],
        salesVolume: 15000,
        establishedYear: 2013
      },
      {
        id: 'm025',
        name: '数码广场',
        category: '3c_store',
        logo: 'https://via.placeholder.com/100x100?text=Digital',
        images: ['https://via.placeholder.com/400x300?text=Electronics'],
        rating: 4.5,
        reviewCount: 5200,
        location: { lat: 32.0760, lng: 118.8160, address: '南京市玄武区珠江路300号', district: '玄武区' },
        discountRate: 15,
        subsidySupport: ['3c'],
        tags: ['品类齐全', '价格优惠', '现货充足'],
        description: '综合数码产品卖场',
        phone: '025-5555-7777',
        businessHours: '9:00-21:00',
        features: ['品类齐全', '即买即走'],
        certifications: ['数码零售'],
        salesVolume: 60000,
        establishedYear: 2005
      },
      
      // 绿色家电店 (5个)
      {
        id: 'm026',
        name: '海尔智家体验中心',
        category: 'green_appliance',
        logo: 'https://via.placeholder.com/100x100?text=Haier',
        images: ['https://via.placeholder.com/400x300?text=Smart'],
        rating: 4.8,
        reviewCount: 4200,
        location: { lat: 32.0600, lng: 118.7960, address: '南京市建邺区江东中路138号', district: '建邺区' },
        discountRate: 14,
        subsidySupport: ['green_appliance', 'appliance'],
        tags: ['智能家电', '节能环保', '全屋智能'],
        description: '海尔智慧家庭体验',
        phone: '025-8888-4444',
        businessHours: '9:00-21:00',
        features: ['智能互联', '节能补贴'],
        certifications: ['节能认证'],
        salesVolume: 35000,
        establishedYear: 2018
      },
      {
        id: 'm027',
        name: '美的智能家电馆',
        category: 'green_appliance',
        logo: 'https://via.placeholder.com/100x100?text=Midea',
        images: ['https://via.placeholder.com/400x300?text=Green'],
        rating: 4.7,
        reviewCount: 3800,
        location: { lat: 32.0440, lng: 118.7780, address: '南京市秦淮区中山南路170号', district: '秦淮区' },
        discountRate: 16,
        subsidySupport: ['green_appliance', 'appliance'],
        tags: ['变频节能', '智能控制', '环保材料'],
        description: '美的智能家电专卖',
        phone: '025-6666-5555',
        businessHours: '9:00-21:00',
        features: ['变频技术', '智能APP'],
        certifications: ['能效标识'],
        salesVolume: 32000,
        establishedYear: 2017
      },
      {
        id: 'm028',
        name: '西门子家电',
        category: 'green_appliance',
        logo: 'https://via.placeholder.com/100x100?text=Siemens',
        images: ['https://via.placeholder.com/400x300?text=German'],
        rating: 4.9,
        reviewCount: 2600,
        location: { lat: 32.0690, lng: 118.8040, address: '南京市鼓楼区湖南路250号', district: '鼓楼区' },
        discountRate: 10,
        subsidySupport: ['green_appliance'],
        tags: ['德国品质', '节能高效', '静音技术'],
        description: '西门子官方专卖店',
        phone: '025-9999-6666',
        businessHours: '9:30-21:00',
        features: ['德国工艺', '静音节能'],
        certifications: ['欧盟能效'],
        salesVolume: 18000,
        establishedYear: 2015
      },
      {
        id: 'm029',
        name: '松下电器',
        category: 'green_appliance',
        logo: 'https://via.placeholder.com/100x100?text=Panasonic',
        images: ['https://via.placeholder.com/400x300?text=Japan'],
        rating: 4.8,
        reviewCount: 2200,
        location: { lat: 32.0310, lng: 118.7660, address: '南京市雨花台区应天大街290号', district: '雨花台区' },
        discountRate: 12,
        subsidySupport: ['green_appliance'],
        tags: ['日本品质', '环保科技', '健康家电'],
        description: '松下官方旗舰店',
        phone: '025-7777-7777',
        businessHours: '9:00-20:00',
        features: ['nanoe技术', '健康除菌'],
        certifications: ['环保认证'],
        salesVolume: 20000,
        establishedYear: 2014
      },
      {
        id: 'm030',
        name: '方太厨电',
        category: 'green_appliance',
        logo: 'https://via.placeholder.com/100x100?text=Fotile',
        images: ['https://via.placeholder.com/400x300?text=Kitchen'],
        rating: 4.9,
        reviewCount: 3100,
        location: { lat: 32.0770, lng: 118.8170, address: '南京市玄武区北京东路360号', district: '玄武区' },
        discountRate: 11,
        subsidySupport: ['green_appliance'],
        tags: ['高端厨电', '油烟净化', '节能环保'],
        description: '方太高端厨电专卖',
        phone: '025-5555-8888',
        businessHours: '9:00-20:00',
        features: ['油烟净化', '智能烹饪'],
        certifications: ['厨电认证'],
        salesVolume: 16000,
        establishedYear: 2016
      }
    ]
  }
  
  // 计算两点间距离(Haversine公式)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // 地球半径(公里)
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c * 1000 // 返回米
  }
  
  // 推荐商家
  const recommendMerchants = (subsidyType: SubsidyType, limit: number = 5): MerchantScore[] => {
    // 筛选支持该补贴类型的商家
    const filtered = merchants.value.filter(m => m.subsidySupport.includes(subsidyType))
    
    // 计算每个商家的评分
    const scored = filtered.map(merchant => {
      // 计算距离
      const distance = calculateDistance(
        userLocation.value.lat,
        userLocation.value.lng,
        merchant.location.lat,
        merchant.location.lng
      )
      merchant.distance = distance
      
      // 距离分数 (0-100): 距离越近分数越高
      const distanceScore = Math.max(0, 100 - (distance / 1000) * 10)
      
      // 质量分数 (0-100): 评分和评价数量
      const qualityScore = merchant.rating * 20 + Math.min(merchant.reviewCount / 100, 1) * 20
      
      // 人气分数 (0-100): 销量和成立年限
      const popularityScore = 
        Math.min(merchant.salesVolume / 500, 1) * 50 + 
        Math.min((new Date().getFullYear() - merchant.establishedYear) / 10, 1) * 50
      
      // 优惠分数 (0-100): 优惠力度
      const discountScore = merchant.discountRate
      
      // 总分 = 距离30% + 质量30% + 人气20% + 优惠20%
      const totalScore = Math.round(
        distanceScore * 0.3 +
        qualityScore * 0.3 +
        popularityScore * 0.2 +
        discountScore * 0.2
      )
      
      return {
        merchant,
        totalScore,
        distanceScore: Math.round(distanceScore),
        qualityScore: Math.round(qualityScore),
        popularityScore: Math.round(popularityScore),
        discountScore: Math.round(discountScore)
      }
    })
    
    // 按总分排序并返回前N个
    return scored.sort((a, b) => b.totalScore - a.totalScore).slice(0, limit)
  }
  
  // 格式化距离
  const formatDistance = (distance?: number): string => {
    if (!distance) return '未知'
    if (distance < 1000) return `${Math.round(distance)}m`
    return `${(distance / 1000).toFixed(1)}km`
  }
  
  // 初始化
  initMerchants()
  
  return {
    merchants,
    userLocation,
    calculateDistance,
    recommendMerchants,
    formatDistance
  }
})

