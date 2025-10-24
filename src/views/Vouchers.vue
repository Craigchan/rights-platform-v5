<template>
  <div class="vouchers-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <LeftOutlined class="back-icon" @click="goBack" />
      <span class="navbar-title">我的优惠券</span>
      <div class="navbar-right"></div>
    </div>

    <!-- 顶部Tab分类区 -->
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

    <!-- 筛选与排序区 -->
    <div class="filter-container" v-if="filteredVouchers.length > 0">
      <div class="filter-item" @click="showTypeFilter = true">
        <span>{{ selectedType }}</span>
        <DownOutlined />
      </div>
      <div class="filter-item" @click="toggleAmountSort">
        <span>金额排序</span>
        <DownOutlined v-if="!amountSort" />
        <UpOutlined v-else />
      </div>
      <div class="filter-item" @click="toggleExpireSort">
        <span :class="{ active: expireSort }">即将到期</span>
      </div>
    </div>

    <!-- 票券列表区 -->
    <div class="voucher-list" v-if="filteredVouchers.length > 0">
      <div 
        v-for="voucher in sortedVouchers" 
        :key="voucher.id"
        :class="['voucher-card', voucher.source]"
        @click="showVoucherDetail(voucher)"
      >
        <!-- 临期提示 -->
        <div class="expire-warning" v-if="isExpiringSoon(voucher) && activeTab === 'unused'">
          <WarningOutlined /> 即将过期,请尽快使用
        </div>

        <div class="card-content" :style="getCardStyle(voucher.source)">
          <!-- 左侧:优惠金额 -->
          <div class="voucher-left">
            <div class="amount">¥{{ voucher.amount }}</div>
            <div class="threshold">{{ voucher.threshold ? `满${voucher.threshold}可用` : '无门槛' }}</div>
          </div>

          <!-- 中间:详细信息 -->
          <div class="voucher-middle">
            <div class="voucher-name">{{ voucher.name }}</div>
            <div class="voucher-scope">{{ voucher.scope }}</div>
            <div class="voucher-date">{{ voucher.validFrom }} - {{ voucher.validTo }}</div>
            <div class="voucher-tags">
              <span :class="['tag', `tag-${voucher.source}`]">{{ getSourceLabel(voucher.source) }}</span>
              <span class="distance" v-if="voucher.distance && activeTab === 'unused'">
                <EnvironmentOutlined /> 距您{{ voucher.distance }}
              </span>
            </div>
          </div>

          <!-- 右侧:操作按钮 -->
          <div class="voucher-right">
            <button 
              v-if="activeTab === 'unused'" 
              class="use-btn"
              @click.stop="useVoucher(voucher)"
            >
              立即使用
            </button>
            <div v-else-if="activeTab === 'used'" class="status-tag used">已使用</div>
            <div v-else-if="activeTab === 'expired'" class="status-tag expired">已过期</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div class="empty-state" v-else>
      <img v-img-fallback src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23f0f0f0'/%3E%3Cpath d='M40 50h40v30H40z' fill='%23d9d9d9'/%3E%3C/svg%3E" alt="empty" class="empty-icon">
      <div class="empty-text">{{ getEmptyText() }}</div>
      <button class="go-get-btn" @click="goToHome" v-if="activeTab === 'unused'">去领券</button>
    </div>

    <!-- 类型筛选抽屉 -->
    <div class="drawer-overlay" v-if="showTypeFilter" @click="showTypeFilter = false">
      <div class="drawer-content" @click.stop>
        <div class="drawer-header">
          <span>选择类型</span>
          <CloseOutlined @click="showTypeFilter = false" />
        </div>
        <div class="type-list">
          <div 
            v-for="type in voucherTypes" 
            :key="type"
            :class="['type-item', { active: selectedType === type }]"
            @click="selectType(type)"
          >
            <span>{{ type }}</span>
            <CheckOutlined v-if="selectedType === type" />
          </div>
        </div>
      </div>
    </div>

    <!-- 票券详情弹窗 -->
    <div class="detail-modal" v-if="showDetail" @click="showDetail = false">
      <div class="detail-content" @click.stop>
        <CloseOutlined class="close-icon" @click="showDetail = false" />
        
        <div class="detail-header">
          <div class="detail-amount">¥{{ currentVoucher.amount }}</div>
          <div class="detail-threshold">{{ currentVoucher.threshold ? `满${currentVoucher.threshold}可用` : '无门槛' }}</div>
        </div>

        <div class="detail-info">
          <div class="info-row">
            <span class="label">票券编号:</span>
            <span class="value">{{ currentVoucher.code }}</span>
          </div>
          <div class="info-row">
            <span class="label">适用商家:</span>
            <span class="value">{{ currentVoucher.merchants }}</span>
          </div>
          <div class="info-row">
            <span class="label">使用规则:</span>
            <span class="value">{{ currentVoucher.rules }}</span>
          </div>
          <div class="info-row">
            <span class="label">有效期:</span>
            <span class="value">{{ currentVoucher.validFrom }} - {{ currentVoucher.validTo }}</span>
          </div>
        </div>

        <!-- 核销二维码 -->
        <div class="qrcode-container" v-if="activeTab === 'unused'">
          <div class="qrcode-box">
            <div class="qrcode-placeholder">
              <QrcodeOutlined style="font-size: 80px; color: #1890ff;" />
            </div>
          </div>
          <div class="code-number">{{ currentVoucher.code }}</div>
          <div class="qrcode-tip">请向商家出示此码进行核销</div>
        </div>

        <button 
          v-if="activeTab === 'unused'" 
          class="verify-btn"
          @click="verifyVoucher"
        >
          确认核销
        </button>
      </div>
    </div>

    <!-- 核销成功弹窗 -->
    <div class="success-modal" v-if="showSuccess" @click="showSuccess = false">
      <div class="success-content" @click.stop>
        <div class="success-icon">
          <CheckCircleOutlined style="font-size: 64px; color: #52c41a;" />
        </div>
        <div class="success-title">核销成功!</div>
        <div class="success-info">
          <div class="info-item">
            <span class="label">节省金额:</span>
            <span class="value">¥{{ currentVoucher.amount }}</span>
          </div>
          <div class="info-item">
            <span class="label">获得积分:</span>
            <span class="value">+{{ currentVoucher.points }} 积分</span>
          </div>
        </div>
        <button class="confirm-btn" @click="closeSuccess">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  LeftOutlined,
  DownOutlined, 
  UpOutlined, 
  WarningOutlined, 
  EnvironmentOutlined,
  CloseOutlined,
  CheckOutlined,
  QrcodeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// Tab配置
const tabs = [
  { key: 'unused', label: '未使用' },
  { key: 'used', label: '已使用' },
  { key: 'expired', label: '已过期' },
  { key: 'all', label: '全部' }
]

const activeTab = ref('unused')

// 票券数据
const vouchers = ref([
  {
    id: 1,
    name: 'XX商场通用消费券',
    amount: 50,
    threshold: 200,
    scope: '仅限XX商圈使用',
    validFrom: '2025.10.13',
    validTo: '2025.11.13',
    source: 'government', // government/mall/merchant
    status: 'unused', // unused/used/expired
    code: '8888999900001111',
    merchants: 'XX商场、XX超市、XX餐厅等',
    rules: '单笔消费满200元可用,不可叠加使用',
    points: 200,
    distance: '500m'
  },
  {
    id: 2,
    name: '商圈活动优惠券',
    amount: 30,
    threshold: 150,
    scope: '全商圈通用',
    validFrom: '2025.10.13',
    validTo: '2025.10.18',
    source: 'mall',
    status: 'unused',
    code: '7777888899990000',
    merchants: '商圈内所有商家',
    rules: '单笔消费满150元可用',
    points: 150,
    distance: '1.2km'
  },
  {
    id: 3,
    name: '商家专属优惠券',
    amount: 20,
    threshold: 0,
    scope: '仅限指定商家',
    validFrom: '2025.10.13',
    validTo: '2025.11.30',
    source: 'merchant',
    status: 'unused',
    code: '6666777788889999',
    merchants: 'XX餐厅',
    rules: '无门槛使用,不可叠加',
    points: 100,
    distance: '300m'
  },
  {
    id: 4,
    name: '政府消费补贴券',
    amount: 100,
    threshold: 500,
    scope: '全市通用',
    validFrom: '2025.09.01',
    validTo: '2025.10.31',
    source: 'government',
    status: 'used',
    code: '5555666677778888',
    merchants: '全市参与商家',
    rules: '单笔消费满500元可用',
    points: 500
  },
  {
    id: 5,
    name: '过期优惠券',
    amount: 15,
    threshold: 100,
    scope: '已过期',
    validFrom: '2025.08.01',
    validTo: '2025.09.30',
    source: 'merchant',
    status: 'expired',
    code: '4444555566667777',
    merchants: 'XX商家',
    rules: '已过期',
    points: 0
  }
])

// 筛选和排序
const selectedType = ref('全部类型')
const voucherTypes = ['全部类型', '政府消费券', '商圈优惠', '商家券']
const showTypeFilter = ref(false)
const amountSort = ref(false) // false: 不排序, true: 从高到低
const expireSort = ref(false)

// 弹窗状态
const showDetail = ref(false)
const showSuccess = ref(false)
const currentVoucher = ref<any>({})

// 计算Tab指示器位置
const indicatorLeft = computed(() => {
  const index = tabs.findIndex(tab => tab.key === activeTab.value)
  return `${index * 25}%`
})

// 获取Tab数量
const getTabCount = (key: string) => {
  if (key === 'all') return vouchers.value.length
  return vouchers.value.filter(v => v.status === key).length
}

// 筛选票券
const filteredVouchers = computed(() => {
  let result = vouchers.value

  // 按Tab筛选
  if (activeTab.value !== 'all') {
    result = result.filter(v => v.status === activeTab.value)
  }

  // 按类型筛选
  if (selectedType.value !== '全部类型') {
    const typeMap: any = {
      '政府消费券': 'government',
      '商圈优惠': 'mall',
      '商家券': 'merchant'
    }
    result = result.filter(v => v.source === typeMap[selectedType.value])
  }

  return result
})

// 排序票券
const sortedVouchers = computed(() => {
  let result = [...filteredVouchers.value]

  // 按金额排序
  if (amountSort.value) {
    result.sort((a, b) => b.amount - a.amount)
  }

  // 按到期时间排序
  if (expireSort.value) {
    result.sort((a, b) => {
      const dateA = new Date(a.validTo.replace(/\./g, '-'))
      const dateB = new Date(b.validTo.replace(/\./g, '-'))
      return dateA.getTime() - dateB.getTime()
    })
  }

  return result
})

// 判断是否即将过期(3天内)
const isExpiringSoon = (voucher: any) => {
  const today = new Date()
  const validTo = new Date(voucher.validTo.replace(/\./g, '-'))
  const diff = validTo.getTime() - today.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days <= 3 && days > 0
}

// 获取来源标签
const getSourceLabel = (source: string) => {
  const labels: any = {
    government: '政府补贴',
    mall: '商圈活动',
    merchant: '商家优惠'
  }
  return labels[source] || ''
}

// 获取空状态文字
const getEmptyText = () => {
  const texts: any = {
    unused: '暂无可用票券,快去首页领券吧~',
    used: '您还没有使用过任何票券',
    expired: '暂无过期票券',
    all: '暂无票券'
  }
  return texts[activeTab.value] || ''
}

// 获取卡片背景样式
const getCardStyle = (source: string) => {
  const gradients: any = {
    government: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    mall: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    merchant: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  }
  return {
    background: gradients[source] || gradients.mall
  }
}

// 切换金额排序
const toggleAmountSort = () => {
  amountSort.value = !amountSort.value
  if (amountSort.value) {
    expireSort.value = false
  }
}

// 切换到期排序
const toggleExpireSort = () => {
  expireSort.value = !expireSort.value
  if (expireSort.value) {
    amountSort.value = false
  }
}

// 选择类型
const selectType = (type: string) => {
  selectedType.value = type
  showTypeFilter.value = false
}

// 显示票券详情
const showVoucherDetail = (voucher: any) => {
  currentVoucher.value = voucher
  showDetail.value = true
}

// 使用票券
const useVoucher = (voucher: any) => {
  currentVoucher.value = voucher
  showDetail.value = true
}

// 核销票券
const verifyVoucher = () => {
  // 更新票券状态
  const voucher = vouchers.value.find(v => v.id === currentVoucher.value.id)
  if (voucher) {
    voucher.status = 'used'
  }
  
  showDetail.value = false
  showSuccess.value = true
}

// 关闭成功弹窗
const closeSuccess = () => {
  showSuccess.value = false
  activeTab.value = 'used'
}

// 去首页领券
const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.vouchers-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  background: #fff;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

.back-icon {
  font-size: 18px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}

.back-icon:hover {
  color: #1890ff;
}

.navbar-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.navbar-right {
  width: 18px;
}

/* 顶部Tab分类区 */
.tabs-container {
  background: #fff;
  display: flex;
  position: relative;
  padding: 0 16px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item.active {
  color: #1890ff;
  font-weight: 500;
}

.tab-item .count {
  font-size: 12px;
  margin-left: 4px;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 25%;
  height: 3px;
  background: #1890ff;
  transition: left 0.3s;
}

/* 筛选与排序区 */
.filter-container {
  background: #fff;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.filter-item.active,
.filter-item span.active {
  color: #1890ff;
}

/* 票券列表区 */
.voucher-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.voucher-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.voucher-card .card-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.voucher-card.government .card-content {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%) !important;
}

.voucher-card.mall .card-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.voucher-card.merchant .card-content {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
}

.expire-warning {
  background: #ff4d4f;
  color: #fff;
  padding: 6px 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-content {
  display: flex;
  padding: 20px;
  color: #fff;
  gap: 16px;
}

.voucher-left {
  width: 80px;
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
  padding-right: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.amount {
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 8px;
}

.threshold {
  font-size: 12px;
  opacity: 0.9;
}

.voucher-middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.voucher-name {
  font-size: 16px;
  font-weight: 500;
}

.voucher-scope,
.voucher-date {
  font-size: 12px;
  opacity: 0.9;
}

.voucher-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.3);
}

.distance {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.voucher-right {
  display: flex;
  align-items: center;
}

.use-btn {
  padding: 8px 20px;
  background: #fff;
  color: #1890ff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}

.status-tag {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.3);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.go-get-btn {
  padding: 10px 32px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

/* 类型筛选抽屉 */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.drawer-content {
  background: #fff;
  width: 100%;
  border-radius: 16px 16px 0 0;
  max-height: 50vh;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 500;
}

.type-list {
  padding: 8px 0;
}

.type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
}

.type-item.active {
  color: #1890ff;
}

/* 票券详情弹窗 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.detail-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  padding: 24px;
}

.close-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.detail-header {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-amount {
  font-size: 48px;
  font-weight: bold;
  color: #1890ff;
  line-height: 1;
  margin-bottom: 8px;
}

.detail-threshold {
  font-size: 14px;
  color: #666;
}

.detail-info {
  padding: 20px 0;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row .label {
  width: 80px;
  color: #999;
}

.info-row .value {
  flex: 1;
  color: #333;
}

.qrcode-container {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
}

.qrcode-box {
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-number {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.qrcode-tip {
  font-size: 12px;
  color: #999;
}

.verify-btn {
  width: 100%;
  padding: 14px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
}

/* 核销成功弹窗 */
.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.success-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 320px;
  padding: 32px 24px;
  text-align: center;
}

.success-icon {
  margin-bottom: 16px;
}

.success-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 24px;
}

.success-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: #666;
}

.info-item .value {
  color: #333;
  font-weight: 500;
}

.confirm-btn {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>


