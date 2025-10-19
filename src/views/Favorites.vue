<template>
  <div class="favorites-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">我的收藏</span>
      <span class="header-action" @click="toggleEditMode">
        {{ editMode ? '完成' : '管理' }}
      </span>
    </div>

    <!-- Tab切换 -->
    <div class="tabs-bar">
      <div 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="tab-count">({{ tab.count }})</span>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div class="favorites-container">
      <!-- 商家收藏 -->
      <div v-if="activeTab === 'merchants' && favoritesStore.merchants.length > 0" class="favorites-list">
        <div 
          v-for="merchant in favoritesStore.merchants" 
          :key="merchant.id"
          class="favorite-card merchant-card"
          @click="viewMerchant(merchant)"
        >
          <!-- 编辑模式选择框 -->
          <div v-if="editMode" class="select-checkbox" @click.stop="toggleSelect(merchant.id)">
            <a-checkbox :checked="selectedIds.includes(merchant.id)" />
          </div>

          <div class="item-image">
            <img :src="merchant.image" :alt="merchant.name" />
          </div>
          <div class="item-info">
            <div class="item-name">{{ merchant.name }}</div>
            <div class="item-rating">
              <StarFilled style="color: #FFD700; font-size: 14px;" />
              <span>{{ merchant.rating }}</span>
            </div>
            <div class="item-meta">
              <EnvironmentOutlined style="font-size: 12px; color: #999;" />
              <span class="item-distance">{{ merchant.distance }}</span>
              <span class="item-time">{{ formatTime(merchant.addedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品收藏 -->
      <div v-if="activeTab === 'products' && favoritesStore.products.length > 0" class="favorites-list">
        <div 
          v-for="product in favoritesStore.products" 
          :key="product.id"
          class="favorite-card product-card"
          @click="viewProduct(product)"
        >
          <!-- 编辑模式选择框 -->
          <div v-if="editMode" class="select-checkbox" @click.stop="toggleSelect(product.id)">
            <a-checkbox :checked="selectedIds.includes(product.id)" />
          </div>

          <div class="item-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="item-info">
            <div class="item-name">{{ product.name }}</div>
            <div class="item-price-row">
              <span class="item-price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="item-original-price">¥{{ product.originalPrice }}</span>
            </div>
            <div class="item-meta">
              <span v-if="product.points" class="item-points">{{ product.points }}积分可兑</span>
              <span class="item-time">{{ formatTime(product.addedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动收藏 -->
      <div v-if="activeTab === 'activities' && favoritesStore.activities.length > 0" class="favorites-list">
        <div 
          v-for="activity in favoritesStore.activities" 
          :key="activity.id"
          class="favorite-card activity-card"
          @click="viewActivity(activity)"
        >
          <!-- 编辑模式选择框 -->
          <div v-if="editMode" class="select-checkbox" @click.stop="toggleSelect(activity.id)">
            <a-checkbox :checked="selectedIds.includes(activity.id)" />
          </div>

          <div class="item-image">
            <img :src="activity.image" :alt="activity.title" />
          </div>
          <div class="item-info">
            <div class="item-name">{{ activity.title }}</div>
            <div class="item-meta">
              <ClockCircleOutlined style="font-size: 12px; color: #999;" />
              <span class="item-time-range">{{ activity.startTime }} - {{ activity.endTime }}</span>
            </div>
            <div class="item-meta">
              <span class="item-time">收藏于 {{ formatTime(activity.addedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="currentList.length === 0" class="empty-state">
        <HeartOutlined class="empty-icon" />
        <div class="empty-text">暂无收藏</div>
        <div class="empty-tip">{{ emptyTip }}</div>
        <a-button type="primary" @click="goToHome">去逛逛</a-button>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="editMode && currentList.length > 0" class="batch-actions">
      <a-checkbox 
        :checked="isAllSelected"
        @change="toggleSelectAll"
      >
        全选
      </a-checkbox>
      <div class="action-buttons">
        <a-button 
          type="primary" 
          danger
          :disabled="selectedIds.length === 0"
          @click="batchDelete"
        >
          删除({{ selectedIds.length }})
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { useFavoritesStore } from '@/stores/favorites'
import {
  LeftOutlined,
  HeartOutlined,
  StarFilled,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()

// Tab配置
const activeTab = ref('merchants')
const tabs = computed(() => [
  { key: 'merchants', label: '商家', count: favoritesStore.merchantCount },
  { key: 'products', label: '商品', count: favoritesStore.productCount },
  { key: 'activities', label: '活动', count: favoritesStore.activityCount }
])

// 当前列表
const currentList = computed(() => {
  switch (activeTab.value) {
    case 'merchants':
      return favoritesStore.merchants
    case 'products':
      return favoritesStore.products
    case 'activities':
      return favoritesStore.activities
    default:
      return []
  }
})

// 空状态提示
const emptyTip = computed(() => {
  switch (activeTab.value) {
    case 'merchants':
      return '收藏喜欢的商家,方便下次查看'
    case 'products':
      return '收藏心仪的商品,不错过优惠'
    case 'activities':
      return '收藏感兴趣的活动,及时参与'
    default:
      return ''
  }
})

// 编辑模式
const editMode = ref(false)
const selectedIds = ref<number[]>([])

const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (!editMode.value) {
    selectedIds.value = []
  }
}

const toggleSelect = (id: number) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const isAllSelected = computed(() => {
  return currentList.value.length > 0 && selectedIds.value.length === currentList.value.length
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = currentList.value.map((item: any) => item.id)
  }
}

// 批量删除
const batchDelete = () => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedIds.value.length} 项收藏吗?`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      selectedIds.value.forEach(id => {
        switch (activeTab.value) {
          case 'merchants':
            favoritesStore.removeMerchant(id)
            break
          case 'products':
            favoritesStore.removeProduct(id)
            break
          case 'activities':
            favoritesStore.removeActivity(id)
            break
        }
      })
      message.success('删除成功')
      selectedIds.value = []
      editMode.value = false
    }
  })
}

// 切换Tab
const switchTab = (key: string) => {
  activeTab.value = key
  selectedIds.value = []
  editMode.value = false
}

// 查看详情
const viewMerchant = (merchant: any) => {
  if (!editMode.value) {
    router.push(`/merchant-detail/${merchant.id}`)
  }
}

const viewProduct = (product: any) => {
  if (!editMode.value) {
    router.push(`/product-detail/${product.id}`)
  }
}

const viewActivity = (activity: any) => {
  if (!editMode.value) {
    router.push(`/activity-detail/${activity.id}`)
  }
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}周前`
  } else {
    return `${Math.floor(days / 30)}个月前`
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 去首页
const goToHome = () => {
  router.push('/')
}

// 初始化
onMounted(() => {
  favoritesStore.init()
})
</script>

<style scoped lang="scss">
.favorites-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 80px;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  background: #FFF;
  border-bottom: 1px solid #F0F0F0;

  .back-icon {
    font-size: 18px;
    color: #333;
    cursor: pointer;
  }

  .page-title {
    flex: 1;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    color: #333;
  }

  .header-action {
    font-size: 14px;
    color: var(--primary-color);
    cursor: pointer;
  }
}

.tabs-bar {
  display: flex;
  background: #FFF;
  border-bottom: 1px solid #F0F0F0;

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    font-size: 15px;
    color: #666;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;

    &.active {
      color: var(--primary-color);
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 3px;
        background: var(--primary-color);
        border-radius: 2px;
      }
    }

    .tab-count {
      margin-left: 4px;
      font-size: 12px;
    }
  }
}

.favorites-container {
  padding: 12px 16px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-card {
  display: flex;
  background: #FFF;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:active {
    transform: scale(0.98);
  }

  .select-checkbox {
    display: flex;
    align-items: center;
    margin-right: 12px;
  }

  .item-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 12px;
    overflow: hidden;

    .item-name {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.4;
    }

    .item-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }

    .item-price-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;

      .item-price {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-color);
      }

      .item-original-price {
        font-size: 13px;
        color: #999;
        text-decoration: line-through;
      }
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #999;
      margin-top: 4px;

      .item-distance,
      .item-points {
        color: #666;
      }

      .item-time-range {
        color: #666;
        margin-left: 4px;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;

  .empty-icon {
    font-size: 80px;
    color: #DDD;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
    color: #999;
    margin-bottom: 8px;
  }

  .empty-tip {
    font-size: 14px;
    color: #BBB;
    margin-bottom: 24px;
  }
}

.batch-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
  background: #FFF;
  border-top: 1px solid #F0F0F0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);

  .action-buttons {
    display: flex;
    gap: 12px;
  }
}
</style>

