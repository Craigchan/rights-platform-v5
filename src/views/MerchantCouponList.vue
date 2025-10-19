<template>
  <div class="merchant-coupon-list">
    <!-- 顶部导航栏 -->
    <div class="nav-bar" :class="{ scrolled: isScrolled }">
      <LeftOutlined class="nav-back" @click="goBack" />
      <div class="nav-title">{{ merchantName }}优惠券</div>
      <div class="nav-placeholder"></div>
    </div>

    <!-- 商家信息卡片 -->
    <div class="merchant-card">
      <div class="merchant-cover">
        <img :src="merchantCover" alt="商家封面" />
      </div>
      <div class="merchant-info">
        <div class="merchant-name">{{ merchantName }}</div>
        <div class="merchant-desc">{{ merchantDesc }}</div>
        <div class="merchant-stats">
          <span><FireOutlined /> 热度 {{ merchantHot }}</span>
          <span><EnvironmentOutlined /> {{ merchantDistance }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <div
          v-for="tab in filterTabs"
          :key="tab.value"
          class="filter-tab"
          :class="{ active: currentFilter === tab.value }"
          @click="changeFilter(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>
      <div class="filter-sort" @click="toggleSort">
        <span>{{ sortLabel }}</span>
        <SwapOutlined :class="{ rotated: sortOrder === 'asc' }" />
      </div>
    </div>

    <!-- 优惠券列表 -->
    <div class="coupon-list-container">
      <div v-if="filteredCoupons.length === 0" class="empty-state">
        <InboxOutlined class="empty-icon" />
        <div class="empty-text">暂无优惠券</div>
      </div>
      <div v-else class="coupon-list">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          class="coupon-card"
          :class="{ claimed: coupon.claimed, expired: coupon.expired }"
        >
          <div class="coupon-left">
            <div class="coupon-amount">
              <span class="amount-symbol">¥</span>
              <span class="amount-value">{{ coupon.amount }}</span>
            </div>
            <div class="coupon-condition">{{ coupon.condition }}</div>
          </div>
          <div class="coupon-right">
            <div class="coupon-header">
              <div class="coupon-name">{{ coupon.name }}</div>
              <div v-if="coupon.tag" class="coupon-tag" :class="`tag-${coupon.tagType}`">
                {{ coupon.tag }}
              </div>
            </div>
            <div class="coupon-desc">{{ coupon.desc }}</div>
            <div class="coupon-validity">
              <ClockCircleOutlined />
              <span>{{ coupon.validUntil }}</span>
            </div>
            <div class="coupon-footer">
              <div class="coupon-stock">剩余 {{ coupon.stock }} 张</div>
              <a-button
                v-if="coupon.expired"
                size="small"
                disabled
              >
                已过期
              </a-button>
              <a-button
                v-else-if="coupon.claimed"
                size="small"
                disabled
              >
                已领取
              </a-button>
              <a-button
                v-else-if="coupon.stock === 0"
                size="small"
                disabled
              >
                已抢光
              </a-button>
              <a-button
                v-else
                type="primary"
                size="small"
                @click="claimCoupon(coupon)"
              >
                立即领取
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="usage-tips">
      <div class="tips-title">
        <QuestionCircleOutlined />
        使用说明
      </div>
      <div class="tips-content">
        <div class="tip-item">
          <div class="tip-number">1</div>
          <div class="tip-text">每张优惠券限领一次，领取后请在有效期内使用</div>
        </div>
        <div class="tip-item">
          <div class="tip-number">2</div>
          <div class="tip-text">优惠券不可叠加使用，每笔订单仅可使用一张</div>
        </div>
        <div class="tip-item">
          <div class="tip-number">3</div>
          <div class="tip-text">优惠券使用规则以商家规定为准，部分商品可能不参与活动</div>
        </div>
        <div class="tip-item">
          <div class="tip-number">4</div>
          <div class="tip-text">如有疑问，请联系商家客服或平台客服</div>
        </div>
      </div>
    </div>

    <!-- 优惠券飞入动画 -->
    <div v-if="showCouponFly" class="coupon-fly-animation" :style="couponFlyStyle">
      <GiftOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  FireOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  InboxOutlined,
  GiftOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 页面滚动状态
const isScrolled = ref(false)

// 商家信息
const merchantId = ref(route.query.merchantId || '1')
const merchantName = ref('海底捞火锅')
const merchantDesc = ref('川味火锅 | 新街口店')
const merchantCover = ref('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800')
const merchantHot = ref('9856')
const merchantDistance = ref('距您 1.2km')

// 筛选选项
const filterTabs = ref([
  { label: '全部', value: 'all' },
  { label: '满减券', value: 'discount' },
  { label: '折扣券', value: 'percentage' },
  { label: '新用户', value: 'newuser' },
  { label: '特惠券', value: 'special' }
])

const currentFilter = ref('all')
const sortOrder = ref('desc') // desc: 金额从高到低, asc: 金额从低到高

const sortLabel = computed(() => {
  return sortOrder.value === 'desc' ? '金额从高到低' : '金额从低到高'
})

// 优惠券列表
const coupons = ref([
  {
    id: 1,
    name: '满200减50元券',
    amount: 50,
    condition: '满200元可用',
    desc: '全场通用，部分商品除外',
    validUntil: '2024-12-31',
    stock: 156,
    type: 'discount',
    tag: '热门',
    tagType: 'hot',
    claimed: false,
    expired: false
  },
  {
    id: 2,
    name: '满100减20元券',
    amount: 20,
    condition: '满100元可用',
    desc: '全场通用',
    validUntil: '2024-12-31',
    stock: 289,
    type: 'discount',
    tag: null,
    tagType: null,
    claimed: false,
    expired: false
  },
  {
    id: 3,
    name: '新用户专享券',
    amount: 30,
    condition: '新用户专享',
    desc: '首次消费立减30元',
    validUntil: '2024-12-31',
    stock: 500,
    type: 'newuser',
    tag: '新人',
    tagType: 'new',
    claimed: false,
    expired: false
  },
  {
    id: 4,
    name: '周末特惠券',
    amount: 15,
    condition: '周末可用',
    desc: '周六周日使用',
    validUntil: '2024-12-31',
    stock: 200,
    type: 'special',
    tag: '限时',
    tagType: 'limited',
    claimed: false,
    expired: false
  },
  {
    id: 5,
    name: '满300减80元券',
    amount: 80,
    condition: '满300元可用',
    desc: '全场通用，部分商品除外',
    validUntil: '2024-12-31',
    stock: 88,
    type: 'discount',
    tag: '热门',
    tagType: 'hot',
    claimed: false,
    expired: false
  },
  {
    id: 6,
    name: '9折优惠券',
    amount: 0,
    condition: '全场9折',
    desc: '最高优惠50元',
    validUntil: '2024-12-31',
    stock: 0,
    type: 'percentage',
    tag: '已抢光',
    tagType: 'soldout',
    claimed: false,
    expired: false
  },
  {
    id: 7,
    name: '满50减10元券',
    amount: 10,
    condition: '满50元可用',
    desc: '全场通用',
    validUntil: '2024-11-30',
    stock: 150,
    type: 'discount',
    tag: null,
    tagType: null,
    claimed: false,
    expired: true
  },
  {
    id: 8,
    name: '会员专享券',
    amount: 25,
    condition: '会员专享',
    desc: '会员等级达到银卡及以上可用',
    validUntil: '2024-12-31',
    stock: 300,
    type: 'special',
    tag: '会员',
    tagType: 'vip',
    claimed: false,
    expired: false
  }
])

// 筛选后的优惠券列表
const filteredCoupons = computed(() => {
  let result = coupons.value

  // 按类型筛选
  if (currentFilter.value !== 'all') {
    result = result.filter(coupon => coupon.type === currentFilter.value)
  }

  // 按金额排序
  result = [...result].sort((a, b) => {
    if (sortOrder.value === 'desc') {
      return b.amount - a.amount
    } else {
      return a.amount - b.amount
    }
  })

  return result
})

// 优惠券飞入动画
const showCouponFly = ref(false)
const couponFlyStyle = ref({})

// 切换筛选
const changeFilter = (value: string) => {
  currentFilter.value = value
}

// 切换排序
const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

// 领取优惠券
const claimCoupon = (coupon: any) => {
  if (coupon.claimed) {
    message.warning('您已领取过该优惠券')
    return
  }

  if (coupon.stock === 0) {
    message.warning('该优惠券已被抢光')
    return
  }

  if (coupon.expired) {
    message.warning('该优惠券已过期')
    return
  }

  // 标记为已领取
  coupon.claimed = true
  coupon.stock -= 1

  // 显示成功提示
  message.success('领取成功！')

  // 触发飞入动画
  triggerCouponFly()
}

// 触发优惠券飞入动画
const triggerCouponFly = () => {
  showCouponFly.value = true
  couponFlyStyle.value = {
    left: '50%',
    top: '50%',
    animation: 'couponFlyToTop 1s ease-out forwards'
  }

  setTimeout(() => {
    showCouponFly.value = false
  }, 1000)
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 监听滚动
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.merchant-coupon-list {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid transparent;
  transition: all 0.3s;
  z-index: 1000;
}

.nav-bar.scrolled {
  border-bottom-color: #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.nav-back {
  font-size: 20px;
  color: #333;
  cursor: pointer;
  padding: 5px;
}

.nav-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}

.nav-placeholder {
  width: 30px;
}

/* 商家信息卡片 */
.merchant-card {
  margin-top: 44px;
  background: #fff;
  padding: 15px;
  display: flex;
  gap: 12px;
}

.merchant-cover {
  flex: 0 0 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.merchant-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.merchant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.merchant-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.merchant-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.merchant-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.merchant-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 筛选栏 */
.filter-bar {
  position: sticky;
  top: 44px;
  background: #fff;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  z-index: 999;
}

.filter-tabs {
  display: flex;
  gap: 15px;
  flex: 1;
  overflow-x: auto;
}

.filter-tab {
  flex-shrink: 0;
  font-size: 14px;
  color: #666;
  padding: 5px 12px;
  border-radius: 16px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab.active {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-weight: 600;
}

.filter-sort {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;
  padding: 5px 10px;
  border-radius: 16px;
  background: #f5f5f5;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: 10px;
}

.filter-sort .anticon {
  transition: transform 0.3s;
}

.filter-sort .anticon.rotated {
  transform: rotate(180deg);
}

/* 优惠券列表容器 */
.coupon-list-container {
  padding: 15px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 优惠券列表 */
.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 优惠券卡片 */
.coupon-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.coupon-card:active {
  transform: scale(0.98);
}

.coupon-card.claimed,
.coupon-card.expired {
  opacity: 0.6;
}

/* 优惠券左侧 */
.coupon-left {
  flex: 0 0 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  position: relative;
}

.coupon-card.claimed .coupon-left,
.coupon-card.expired .coupon-left {
  background: linear-gradient(135deg, #d9d9d9 0%, #e8e8e8 100%);
}

.coupon-left::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #f5f5f5;
  border-radius: 50%;
}

.coupon-amount {
  display: flex;
  align-items: baseline;
  color: #fff;
  margin-bottom: 6px;
}

.coupon-card.claimed .coupon-amount,
.coupon-card.expired .coupon-amount {
  color: #999;
}

.amount-symbol {
  font-size: 16px;
  font-weight: 600;
}

.amount-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.coupon-condition {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.coupon-card.claimed .coupon-condition,
.coupon-card.expired .coupon-condition {
  color: #999;
}

/* 优惠券右侧 */
.coupon-right {
  flex: 1;
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.coupon-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.coupon-tag {
  flex-shrink: 0;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 8px;
}

.coupon-tag.tag-hot {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  color: #fff;
}

.coupon-tag.tag-new {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.coupon-tag.tag-limited {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
}

.coupon-tag.tag-vip {
  background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
  color: #fff;
}

.coupon-tag.tag-soldout {
  background: #f5f5f5;
  color: #999;
}

.coupon-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  line-height: 1.4;
}

.coupon-validity {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.coupon-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coupon-stock {
  font-size: 12px;
  color: #ff6b6b;
}

/* 使用说明 */
.usage-tips {
  margin: 20px 15px;
  background: #fff;
  border-radius: 12px;
  padding: 15px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  gap: 10px;
}

.tip-number {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip-text {
  flex: 1;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* 优惠券飞入动画 */
.coupon-fly-animation {
  position: fixed;
  font-size: 32px;
  color: #ff6b6b;
  z-index: 9999;
  pointer-events: none;
}

@keyframes couponFlyToTop {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -300px) scale(0.3);
    opacity: 0;
  }
}
</style>

