<template>
  <div class="nearby-card">
    <div class="card-header">
      <div class="card-title">
        <EnvironmentOutlined class="title-icon" />
        附近优惠
      </div>
      <div class="card-subtitle">{{ data.city }} · 为您精选</div>
    </div>
    
    <div class="merchant-list">
      <div 
        v-for="merchant in data.merchants" 
        :key="merchant.id"
        class="merchant-item"
        @click="viewMerchant(merchant)"
      >
        <div class="merchant-icon">
          <ShopOutlined />
        </div>
        <div class="merchant-info">
          <div class="merchant-name">{{ merchant.name }}</div>
          <div class="merchant-distance">{{ merchant.distance }}</div>
        </div>
        <div class="merchant-offer">
          <div class="offer-tag">{{ merchant.offer }}</div>
        </div>
      </div>
    </div>
    
    <div class="card-footer" @click="viewMore">
      <span>查看更多附近优惠</span>
      <RightOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  EnvironmentOutlined, 
  ShopOutlined,
  RightOutlined 
} from '@ant-design/icons-vue'

interface Merchant {
  id: number
  name: string
  distance: string
  offer: string
}

interface Props {
  data: {
    merchants: Merchant[]
    city: string
  }
}

defineProps<Props>()
const router = useRouter()

const viewMerchant = (merchant: Merchant) => {
  console.log('查看商家:', merchant)
  router.push('/merchant-offer-detail')
}

const viewMore = () => {
  router.push('/nearby')
}
</script>

<style scoped>
.nearby-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.title-icon {
  color: #FF6B35;
}

.card-subtitle {
  font-size: 13px;
  color: #999;
}

.merchant-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.merchant-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.merchant-item:active {
  transform: scale(0.98);
  background: #f0f0f0;
}

.merchant-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  border-radius: 50%;
  color: white;
  font-size: 20px;
}

.merchant-info {
  flex: 1;
}

.merchant-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.merchant-distance {
  font-size: 12px;
  color: #999;
}

.merchant-offer {
  text-align: right;
}

.offer-tag {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.card-footer:active {
  color: #FF6B35;
}
</style>

