// 商户推荐Store

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
  rating: number              // 评分 1-5
  reviewCount: number         // 评价数
  location: {
    lat: number
    lng: number
    address: string
    district: string
  }
  distance?: number           // 距离(米)
  discountRate: number        // 优惠力度 0-100
  subsidySupport: SubsidyType[]  // 支持的补贴类型
  tags: string[]              // 标签
  description: string
  phone: string
  businessHours: string
  features: string[]          // 特色服务
  certifications: string[]    // 资质认证
  salesVolume: number         // 销量
  establishedYear: number     // 成立年份
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
  // 状态
  const merchants = ref<Merchant[]>([])
  const userLocation = ref<{ lat: number; lng: number } | null>(null)
  
  // 初始化示例数据
  const initMerchants = () => {
    merchants.value = [
      // 汽车经销商
      {
        id: 'm001',
        name: '江苏汽车城',
        category: 'car_dealer',
        logo: 'https://via.placeholder.com/100x100?text=Car',
        images: [
          'https://via.placeholder.com/400x300?text=Showroom',
          'https://via.placeholder.com/400x300?text=Cars'
        ],
        rating: 4.8,
        reviewCount: 2580,
        location: {
          lat: 32.0603,
          lng: 118.7969,
          address: '江苏省南京市建邺区江东中路100号',
          district: '建邺区'
        },
        discountRate: 15,
        subsidySupport: ['car'],
        tags: ['官方授权', '以旧换新', '金融服务', '上门试驾'],
        description: '江苏最大的汽车销售中心,提供全系列品牌汽车销售和以旧换新服务',
        phone: '025-8888-8888',
        businessHours: '9:00-21:00',
        features: ['免费评估', '当日提车', '终身质保', '代办手续'],
        certifications: ['官方授权经销商', 'ISO9001认证'],
        salesVolume: 15000,
        establishedYear: 2010
      }
    ]
  }
  
  initMerchants()
  
  return {
    merchants,
    userLocation
  }
})
