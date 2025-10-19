<template>
  <div class="voucher-center-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">领券中心</span>
      <div class="header-action" @click="handleClaimAll">
        <GiftOutlined class="gift-icon" />
        <span>一键领取</span>
      </div>
    </div>
    
    <!-- 今日已领提示区 -->
    <div class="claim-status-banner">
      <div class="status-left">
        <div class="status-title">今日已领 {{ claimedTodayCount }}/{{ totalAvailableVouchers }} 张</div>
        <div class="status-subtitle">还有 {{ remainingVouchers }} 张优惠券等你领取</div>
      </div>
      <div class="status-icon">
        <GiftFilled />
      </div>
    </div>

    <!-- Tab分类区 -->
    <div class="tabs-container">
      <div 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        <span>{{ tab.label }}</span>
        <span class="count">({{ getTabCount(tab.key) }})</span>
      </div>
      <div class="tab-indicator" :style="{ left: indicatorLeft }"></div>
    </div>

    <!-- 券列表区 -->
    <div class="voucher-list-container">
      <div v-if="filteredVouchers.length > 0" class="voucher-list">
        <div 
          v-for="voucher in filteredVouchers" 
          :key="voucher.id"
          :class="['voucher-card', voucher.type, { claimed: voucher.claimed }]"
          @click="showVoucherDetail(voucher)"
        >
          <div class="card-content" :style="getCardStyle(voucher.type)">
            <!-- 左侧:优惠金额 -->
            <div class="voucher-left">
              <div class="amount">¥{{ voucher.amount }}</div>
              <div class="threshold">{{ voucher.threshold ? `满${voucher.threshold}可用` : '无门槛' }}</div>
            </div>

            <!-- 中间:券信息 -->
            <div class="voucher-middle">
              <div class="voucher-name">{{ voucher.name }}</div>
              <div class="voucher-scope">{{ voucher.scope }}</div>
              <div class="voucher-validity">有效期: {{ voucher.validFrom }} - {{ voucher.validTo }}</div>
              <div class="voucher-tags">
                <span :class="['tag', 'tag-' + voucher.type]">{{ getTypeLabel(voucher.type) }}</span>
              </div>
            </div>

            <!-- 右侧:领取按钮 -->
            <div class="voucher-right">
              <button 
                v-if="!voucher.claimed" 
                class="claim-btn"
                @click.stop="claimSingleVoucher(voucher)"
              >
                立即领取
              </button>
              <div v-else class="claimed-badge">
                <CheckCircleFilled />
                <span>已领取</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <InboxOutlined class="empty-icon" />
        <div class="empty-text">暂无可领取的券,请稍后再来~</div>
      </div>
    </div>

    <!-- 一键领取成功弹窗 -->
    <div v-if="showSuccessModal" class="success-modal-overlay" @click="closeSuccessModal">
      <div class="success-modal" @click.stop>
        <div class="success-icon-wrapper">
          <CheckCircleFilled class="success-icon" />
        </div>
        <div class="success-title">领取成功!</div>
        <div class="success-message">成功领取 {{ claimedCount }} 张优惠券!</div>
        <div class="success-actions">
          <button class="btn-secondary" @click="closeSuccessModal">稍后使用</button>
          <button class="btn-primary" @click="goToMyVouchers">去使用</button>
        </div>
      </div>
    </div>

    <!-- 加载动画 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <LoadingOutlined />
        <div class="loading-text">正在领取中...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  LeftOutlined, 
  GiftOutlined, 
  GiftFilled,
  CheckCircleFilled,
  InboxOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// Tab配置
const tabs = [
  { key: 'government', label: '政府消费券' },
  { key: 'platform', label: '平台优惠券' },
  { key: 'merchant', label: '商家优惠券' }
]

const activeTab = ref('government')

// 券数据
interface Voucher {
  id: number
  type: 'government' | 'platform' | 'merchant'
  name: string
  amount: number
  threshold: number
  scope: string
  validFrom: string
  validTo: string
  claimed: boolean
}

const vouchers = ref<Voucher[]>([
  // 政府消费券
  { 
    id: 1, 
    type: 'government', 
    name: '南京市数字消费券', 
    amount: 50, 
    threshold: 200, 
    scope: '全市指定商户通用',
    validFrom: '2025.10.13',
    validTo: '2025.11.30',
    claimed: false 
  },
  { 
    id: 2, 
    type: 'government', 
    name: '政府惠民消费券', 
    amount: 30, 
    threshold: 150, 
    scope: '餐饮、购物类商户',
    validFrom: '2025.10.13',
    validTo: '2025.11.30',
    claimed: false 
  },
  { 
    id: 3, 
    type: 'government', 
    name: '家电消费补贴券', 
    amount: 100, 
    threshold: 500, 
    scope: '家电类商户专用',
    validFrom: '2025.10.13',
    validTo: '2025.12.31',
    claimed: false 
  },
  { 
    id: 4, 
    type: 'government', 
    name: '文旅消费券', 
    amount: 20, 
    threshold: 100, 
    scope: '景区、影院、书店',
    validFrom: '2025.10.13',
    validTo: '2025.11.15',
    claimed: false 
  },

  // 平台优惠券
  { 
    id: 5, 
    type: 'platform', 
    name: '平台满减券', 
    amount: 20, 
    threshold: 100, 
    scope: '全平台商品通用',
    validFrom: '2025.10.13',
    validTo: '2025.10.31',
    claimed: false 
  },
  { 
    id: 6, 
    type: 'platform', 
    name: '新人专享券', 
    amount: 15, 
    threshold: 80, 
    scope: '新用户首单专享',
    validFrom: '2025.10.13',
    validTo: '2025.10.31',
    claimed: false 
  },
  { 
    id: 7, 
    type: 'platform', 
    name: '会员专属券', 
    amount: 30, 
    threshold: 150, 
    scope: '会员用户专享',
    validFrom: '2025.10.13',
    validTo: '2025.11.30',
    claimed: false 
  },
  { 
    id: 8, 
    type: 'platform', 
    name: '积分兑换券', 
    amount: 10, 
    threshold: 50, 
    scope: '积分商城专用',
    validFrom: '2025.10.13',
    validTo: '2025.10.31',
    claimed: false 
  },

  // 商家优惠券
  { 
    id: 9, 
    type: 'merchant', 
    name: 'XX商场优惠券', 
    amount: 10, 
    threshold: 50, 
    scope: 'XX商场全场通用',
    validFrom: '2025.10.13',
    validTo: '2025.10.20',
    claimed: false 
  },
  { 
    id: 10, 
    type: 'merchant', 
    name: 'XX超市特惠券', 
    amount: 5, 
    threshold: 30, 
    scope: 'XX超市全场通用',
    validFrom: '2025.10.13',
    validTo: '2025.10.20',
    claimed: false 
  },
  { 
    id: 11, 
    type: 'merchant', 
    name: 'XX餐厅代金券', 
    amount: 20, 
    threshold: 100, 
    scope: 'XX餐厅堂食专用',
    validFrom: '2025.10.13',
    validTo: '2025.10.25',
    claimed: false 
  },
  { 
    id: 12, 
    type: 'merchant', 
    name: 'XX影院观影券', 
    amount: 15, 
    threshold: 0, 
    scope: 'XX影院观影专用',
    validFrom: '2025.10.13',
    validTo: '2025.10.31',
    claimed: false 
  }
])

const isLoading = ref(false)
const showSuccessModal = ref(false)
const claimedCount = ref(0)

// 计算属性
const filteredVouchers = computed(() => {
  return vouchers.value.filter(v => v.type === activeTab.value)
})

const totalAvailableVouchers = computed(() => {
  return vouchers.value.length
})

const claimedTodayCount = computed(() => {
  return vouchers.value.filter(v => v.claimed).length
})

const remainingVouchers = computed(() => {
  return vouchers.value.filter(v => !v.claimed).length
})

const getTabCount = (tabKey: string) => {
  return vouchers.value.filter(v => v.type === tabKey && !v.claimed).length
}

const indicatorLeft = computed(() => {
  const index = tabs.findIndex(t => t.key === activeTab.value)
  return `${index * 33.33}%`
})

// 方法
const goBack = () => {
  router.back()
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    government: '政府补贴',
    platform: '平台优惠',
    merchant: '商家优惠'
  }
  return labels[type] || type
}

const getCardStyle = (type: string) => {
  const gradients: Record<string, string> = {
    government: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    platform: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    merchant: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  }
  return {
    background: gradients[type] || gradients.government
  }
}

const claimSingleVoucher = (voucher: Voucher) => {
  if (voucher.claimed) return
  
  voucher.claimed = true
  
  // 显示成功提示
  const tempModal = document.createElement('div')
  tempModal.className = 'toast-message'
  tempModal.textContent = `成功领取${voucher.name}!`
  document.body.appendChild(tempModal)
  
  setTimeout(() => {
    document.body.removeChild(tempModal)
  }, 2000)
}

const handleClaimAll = async () => {
  const unclaimedVouchers = vouchers.value.filter(v => !v.claimed)
  
  if (unclaimedVouchers.length === 0) {
    // 显示提示
    const tempModal = document.createElement('div')
    tempModal.className = 'toast-message'
    tempModal.textContent = '所有券已领取完毕'
    document.body.appendChild(tempModal)
    
    setTimeout(() => {
      document.body.removeChild(tempModal)
    }, 2000)
    return
  }

  // 显示加载动画
  isLoading.value = true
  
  // 模拟批量领取过程(1-2秒)
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 批量领取
  let count = 0
  unclaimedVouchers.forEach(v => {
    v.claimed = true
    count++
  })
  
  claimedCount.value = count
  isLoading.value = false
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}

const goToMyVouchers = () => {
  router.push('/vouchers')
}

const showVoucherDetail = (voucher: Voucher) => {
  // 可以在这里添加显示券详情的逻辑
  console.log('Show voucher detail:', voucher)
}
</script>

<style scoped>
.voucher-center-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.page-header {
  background: #fff;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.back-icon {
  font-size: 20px;
  cursor: pointer;
  color: #333;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.header-action:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.gift-icon {
  font-size: 16px;
}

/* 今日已领提示区 */
.claim-status-banner {
  margin: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.status-left {
  flex: 1;
}

.status-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 6px;
}

.status-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.status-icon {
  font-size: 48px;
  opacity: 0.3;
}

/* Tab分类区 */
.tabs-container {
  position: relative;
  display: flex;
  background: #fff;
  margin: 0 16px 16px;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 2;
}

.tab-item.active {
  color: #1890ff;
  font-weight: 600;
}

.tab-item .count {
  font-size: 13px;
  margin-left: 4px;
}

.tab-indicator {
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 33.33%;
  height: 3px;
  background: #1890ff;
  border-radius: 2px;
  transition: left 0.3s ease;
  z-index: 1;
}

/* 券列表区 */
.voucher-list-container {
  padding: 0 16px;
}

.voucher-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voucher-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
}

.voucher-card:active {
  transform: scale(0.98);
}

.voucher-card.claimed {
  opacity: 0.6;
}

.card-content {
  display: flex;
  align-items: center;
  padding: 16px;
  color: #fff;
  position: relative;
}

/* 左侧:优惠金额 */
.voucher-left {
  flex-shrink: 0;
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 2px dashed rgba(255, 255, 255, 0.4);
  padding-right: 12px;
}

.amount {
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 4px;
}

.threshold {
  font-size: 12px;
  opacity: 0.9;
}

/* 中间:券信息 */
.voucher-middle {
  flex: 1;
  padding: 0 12px;
}

.voucher-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.3;
}

.voucher-scope {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.voucher-validity {
  font-size: 12px;
  opacity: 0.85;
  margin-bottom: 8px;
}

.voucher-tags {
  display: flex;
  gap: 6px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

/* 右侧:领取按钮 */
.voucher-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.claim-btn {
  padding: 8px 16px;
  background: #fff;
  color: #FF6B35;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.claim-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.claimed-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  opacity: 0.8;
}

.claimed-badge svg {
  font-size: 24px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 15px;
}

/* 成功弹窗 */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.success-modal {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  width: 85%;
  max-width: 320px;
  text-align: center;
  animation: slideUp 0.3s;
}

.success-icon-wrapper {
  margin-bottom: 16px;
}

.success-icon {
  font-size: 64px;
  color: #52c41a;
  animation: pulse 0.6s;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.success-message {
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
}

.success-actions {
  display: flex;
  gap: 12px;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

/* 加载动画 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-spinner {
  background: #fff;
  border-radius: 12px;
  padding: 32px 48px;
  text-align: center;
}

.loading-spinner svg {
  font-size: 48px;
  color: #1890ff;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 15px;
  color: #666;
}

/* Toast消息 */
.toast-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  z-index: 2000;
  animation: fadeIn 0.3s, fadeOut 0.3s 1.7s;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

