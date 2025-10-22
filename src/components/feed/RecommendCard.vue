<template>
  <div class="recommend-card">
    <div class="card-header">
      <div class="card-title">为您推荐</div>
      <div class="card-subtitle">{{ data.reason }}</div>
    </div>
    
    <div class="product-grid">
      <div 
        v-for="product in data.products" 
        :key="product.id"
        class="product-item"
        @click="viewProduct(product)"
      >
        <SafeImage 
          :src="product.image" 
          :alt="product.name" 
          class="product-image"
        />
        <div class="product-info">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">¥{{ product.price }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SafeImage from '../common/SafeImage.vue'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

interface Props {
  data: {
    products: Product[]
    reason: string
  }
}

defineProps<Props>()
const router = useRouter()

const viewProduct = (product: Product) => {
  console.log('查看商品:', product)
  router.push(`/product/${product.id}`)
}
</script>

<style scoped>
.recommend-card {
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
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 13px;
  color: #999;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.product-item {
  cursor: pointer;
  transition: all 0.3s;
}

.product-item:active {
  transform: scale(0.95);
}

.product-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f5f5f5;
  overflow: hidden;
}

.product-info {
  text-align: center;
}

.product-name {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 15px;
  font-weight: bold;
  color: #FF6B35;
}
</style>

