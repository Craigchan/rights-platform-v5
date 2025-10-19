<template>
  <div class="points-mall-page">
    <!-- 1. 积分总览与功能区 -->
    <div class="points-overview">
      <div class="points-total">
        <div class="points-label">我的积分</div>
        <div class="points-value">{{ userPoints.toLocaleString() }}</div>
      </div>
      <div class="points-actions">
        <div class="action-item" @click="showPointsDetail">
          <UnorderedListOutlined class="action-icon" />
          <span>积分明细</span>
        </div>
        <div class="action-item" @click="showRedemptionRecord">
          <HistoryOutlined class="action-icon" />
          <span>兑换记录</span>
        </div>
        <div class="action-item" @click="showPointsRules">
          <QuestionCircleOutlined class="action-icon" />
          <span>积分规则</span>
        </div>
      </div>
    </div>

    <!-- 2. 核心活动/玩法区 -->
    <div class="featured-activities">
      <div class="activity-card lottery-card" @click="goToLottery">
        <div class="activity-icon">🎁</div>
        <div class="activity-info">
          <div class="activity-title">积分抽奖</div>
          <div class="activity-subtitle">100积分抽大奖</div>
        </div>
        <div class="activity-badge">HOT</div>
      </div>
      <div class="activity-card flash-card" @click="goToFlashSale">
        <div class="activity-icon">⚡</div>
        <div class="activity-info">
          <div class="activity-title">0元兑/秒杀</div>
          <div class="activity-subtitle">限时特惠</div>
        </div>
        <div class="activity-badge">NEW</div>
      </div>
      <div class="activity-card donate-card" @click="goToDonate">
        <div class="activity-icon">❤️</div>
        <div class="activity-info">
          <div class="activity-title">积分捐赠</div>
          <div class="activity-subtitle">献爱心做公益</div>
        </div>
      </div>
    </div>

    <!-- 3. 商品分类与筛选区 -->
    <div class="category-filter">
      <a-tabs v-model:activeKey="activeCategory" @change="handleCategoryChange">
        <a-tab-pane key="recommend" tab="推荐" />
        <a-tab-pane key="physical" tab="实物商品" />
        <a-tab-pane key="virtual" tab="虚拟票券" />
        <a-tab-pane key="lottery" tab="抽奖专区" />
      </a-tabs>
      <div class="filter-btn" @click="showFilterDrawer">
        <FilterOutlined />
        <span>筛选</span>
      </div>
    </div>

    <!-- 4. 商品瀑布流 -->
    <div class="product-waterfall">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
        @click="goToProductDetail(product.id)"
      >
        <div class="product-image" :style="{ background: product.color }">
          <div v-if="product.tag" class="product-tag">{{ product.tag }}</div>
        </div>
        <div class="product-info">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">
            <span v-if="product.type === 'pure'" class="points-price">
              {{ product.points.toLocaleString() }} 积分
            </span>
            <span v-else class="mixed-price">
              <span class="points-part">{{ product.points }} 积分</span>
              <span class="cash-part">+ ¥{{ product.cash }}</span>
            </span>
          </div>
          <div v-if="product.originalPrice" class="original-price">
            市场价: ¥{{ product.originalPrice }}
          </div>
          <div class="product-stats">
            <span class="redeemed-count">{{ product.redeemed }}人已兑</span>
          </div>
          <a-button type="primary" size="small" class="redeem-btn">
            马上兑
          </a-button>
        </div>
      </div>
    </div>

    <!-- 筛选抽屉 -->
    <a-drawer
      v-model:open="filterVisible"
      title="筛选商品"
      placement="right"
      width="80%"
    >
      <div class="filter-content">
        <div class="filter-section">
          <div class="filter-title">积分范围</div>
          <a-radio-group v-model:value="filterPoints" @change="applyFilter">
            <a-radio value="all">全部</a-radio>
            <a-radio value="0-1000">0-1000分</a-radio>
            <a-radio value="1001-5000">1001-5000分</a-radio>
            <a-radio value="5001-10000">5001-10000分</a-radio>
            <a-radio value="10001+">10001分以上</a-radio>
          </a-radio-group>
        </div>
        <div class="filter-section">
          <div class="filter-title">兑换方式</div>
          <a-radio-group v-model:value="filterType" @change="applyFilter">
            <a-radio value="all">全部</a-radio>
            <a-radio value="pure">纯积分</a-radio>
            <a-radio value="mixed">积分+现金</a-radio>
          </a-radio-group>
        </div>
        <div class="filter-actions">
          <a-button @click="resetFilter">重置</a-button>
          <a-button type="primary" @click="filterVisible = false">确定</a-button>
        </div>
      </div>
    </a-drawer>

    <!-- 积分规则弹窗 -->
    <a-modal
      v-model:open="rulesVisible"
      title="积分规则"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <div class="rules-content">
        <h4>如何获取积分？</h4>
        <ul>
          <li>每日签到：10-50积分</li>
          <li>完成任务：50-200积分</li>
          <li>消费返积分：消费金额的1%-5%</li>
          <li>邀请好友：200积分/人</li>
        </ul>
        <h4>如何使用积分？</h4>
        <ul>
          <li>积分商城兑换商品</li>
          <li>参与积分抽奖活动</li>
          <li>抵扣现金使用（100积分=1元）</li>
        </ul>
        <h4>积分有效期</h4>
        <p>积分自获得之日起有效期为1年，过期自动清零。</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  UnorderedListOutlined,
  HistoryOutlined,
  QuestionCircleOutlined,
  FilterOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 用户积分
const userPoints = ref(15280)

// 当前分类
const activeCategory = ref('recommend')

// 筛选相关
const filterVisible = ref(false)
const filterPoints = ref('all')
const filterType = ref('all')

// 积分规则弹窗
const rulesVisible = ref(false)

// 商品数据
const products = ref([
  {
    id: 1,
    name: '星巴克咖啡券',
    points: 500,
    cash: 19.9,
    type: 'mixed',
    originalPrice: 39,
    redeemed: 1580,
    category: 'virtual',
    color: 'linear-gradient(135deg, #00A86B 0%, #00D084 100%)',
    tag: '热销'
  },
  {
    id: 2,
    name: '小米无线耳机',
    points: 12000,
    type: 'pure',
    originalPrice: 399,
    redeemed: 856,
    category: 'physical',
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    tag: '爆款'
  },
  {
    id: 3,
    name: '电影票兑换券',
    points: 800,
    type: 'pure',
    originalPrice: 50,
    redeemed: 2340,
    category: 'virtual',
    color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)'
  },
  {
    id: 4,
    name: '华为智能手环',
    points: 8000,
    type: 'pure',
    originalPrice: 299,
    redeemed: 456,
    category: 'physical',
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    tag: '新品'
  },
  {
    id: 5,
    name: '肯德基套餐券',
    points: 300,
    cash: 9.9,
    type: 'mixed',
    originalPrice: 35,
    redeemed: 3200,
    category: 'virtual',
    color: 'linear-gradient(135deg, #FF4444 0%, #FF8844 100%)',
    tag: '热销'
  },
  {
    id: 6,
    name: '小米移动电源',
    points: 5000,
    type: 'pure',
    originalPrice: 149,
    redeemed: 678,
    category: 'physical',
    color: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
  },
  {
    id: 7,
    name: '优衣库优惠券',
    points: 1000,
    type: 'pure',
    originalPrice: 50,
    redeemed: 1890,
    category: 'virtual',
    color: 'linear-gradient(135deg, #8338EC 0%, #A855F7 100%)'
  },
  {
    id: 8,
    name: '蓝牙音箱',
    points: 6000,
    type: 'pure',
    originalPrice: 199,
    redeemed: 234,
    category: 'physical',
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    tag: '推荐'
  },
  {
    id: 9,
    name: '健身房月卡',
    points: 2000,
    cash: 99,
    type: 'mixed',
    originalPrice: 299,
    redeemed: 567,
    category: 'virtual',
    color: 'linear-gradient(135deg, #FFBE0B 0%, #FFD60A 100%)'
  },
  {
    id: 10,
    name: '智能手表',
    points: 15000,
    type: 'pure',
    originalPrice: 599,
    redeemed: 123,
    category: 'physical',
    color: 'linear-gradient(135deg, #06B6D4 0%, #0EA5E9 100%)',
    tag: '新品'
  }
])

// 筛选后的商品列表
const filteredProducts = computed(() => {
  let result = products.value

  // 按分类筛选
  if (activeCategory.value !== 'recommend') {
    if (activeCategory.value === 'lottery') {
      // 抽奖专区暂时返回空数组
      return []
    }
    result = result.filter(p => p.category === activeCategory.value)
  }

  // 按积分范围筛选
  if (filterPoints.value !== 'all') {
    const [min, max] = filterPoints.value.split('-').map(v => {
      if (v.includes('+')) return [parseInt(v), Infinity]
      return parseInt(v)
    })
    if (Array.isArray(min)) {
      result = result.filter(p => p.points >= min[0])
    } else if (typeof max === 'number') {
      result = result.filter(p => p.points >= min && p.points <= max)
    }
  }

  // 按兑换方式筛选
  if (filterType.value !== 'all') {
    result = result.filter(p => p.type === filterType.value)
  }

  return result
})

// 方法
const showPointsDetail = () => {
  message.info('积分明细功能')
}

const showRedemptionRecord = () => {
  message.info('兑换记录功能')
}

const showPointsRules = () => {
  rulesVisible.value = true
}

const goToLottery = () => {
  router.push('/earn-points')
}

const goToFlashSale = () => {
  router.push('/flash-sale')
}

const goToDonate = () => {
  message.info('积分捐赠功能开发中...')
}

const handleCategoryChange = () => {
  // 分类切换时的处理
}

const showFilterDrawer = () => {
  filterVisible.value = true
}

const applyFilter = () => {
  // 筛选应用会自动通过computed更新
}

const resetFilter = () => {
  filterPoints.value = 'all'
  filterType.value = 'all'
}

const goToProductDetail = (id: number) => {
  router.push({ path: '/product-detail', query: { id } })
}
</script>

<style scoped>
.points-mall-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 1. 积分总览与功能区 */
.points-overview {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  padding: 30px 20px 20px;
  color: #fff;
}

.points-total {
  text-align: center;
  margin-bottom: 20px;
}

.points-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.points-value {
  font-size: 48px;
  font-weight: bold;
  letter-spacing: 2px;
}

.points-actions {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

.action-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.98);
}

.action-icon {
  font-size: 20px;
  display: block;
  margin-bottom: 6px;
}

.action-item span {
  font-size: 12px;
}

/* 2. 核心活动/玩法区 */
.featured-activities {
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.activity-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.activity-card:active {
  transform: scale(0.98);
}

.activity-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.activity-subtitle {
  font-size: 11px;
  color: #999;
}

.activity-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

/* 3. 商品分类与筛选区 */
.category-filter {
  background: #fff;
  padding: 0 15px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.category-filter :deep(.ant-tabs) {
  flex: 1;
  margin: 0;
}

.category-filter :deep(.ant-tabs-nav) {
  margin: 0;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  margin-left: 10px;
}

.filter-btn:active {
  background: #e8e8e8;
}

/* 4. 商品瀑布流 */
.product-waterfall {
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-card:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 140px;
  position: relative;
}

.product-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 107, 53, 0.95);
  color: #fff;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  margin-bottom: 6px;
}

.points-price {
  font-size: 16px;
  font-weight: bold;
  color: #FF6B35;
}

.mixed-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.points-part {
  font-size: 14px;
  font-weight: 600;
  color: #FF6B35;
}

.cash-part {
  font-size: 14px;
  font-weight: 600;
  color: #FF6B35;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-bottom: 6px;
}

.product-stats {
  font-size: 11px;
  color: #999;
  margin-bottom: 10px;
}

.redeem-btn {
  width: 100%;
  border-radius: 6px;
  font-weight: 600;
}

/* 筛选抽屉 */
.filter-content {
  padding: 10px 0;
}

.filter-section {
  margin-bottom: 30px;
}

.filter-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.filter-section :deep(.ant-radio-group) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.filter-actions button {
  flex: 1;
}

/* 积分规则弹窗 */
.rules-content h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 15px 0 10px;
}

.rules-content h4:first-child {
  margin-top: 0;
}

.rules-content ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.rules-content li {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.rules-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>

