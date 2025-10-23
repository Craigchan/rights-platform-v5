# 商家买单功能实施方案

**创建日期**: 2025-10-22  
**功能名称**: 商家线下买单  
**实施状态**: 待用户确认

---

## 📱 功能概述

在商家详情页添加线下买单功能，支持用户在实体商家消费后，通过平台完成支付并享受优惠。

### 业务流程

```
商家详情页（惠买单）
    ↓ 点击"买单"按钮
商户买单页（消费者领优惠买单）
    ↓ 输入金额 + 选择优惠 + 确认
收银台确认买单（确认支付）
    ↓ 选择支付方式 + 立即付款
支付成功
```

---

## 🎯 核心功能点

### 1. 商家详情页（MerchantDetail.vue）

**新增元素：**
- **惠买单区域**
  - 显示优惠信息（如"每满20减2元"）
  - 显示活动时间和限制条件
  - 绿色"买单"按钮

**修改内容：**
- 在优惠券区域下方添加"惠买单"模块
- 底部操作栏添加/调整"买单"按钮

---

### 2. 商户买单页（MerchantPayment.vue - 新建）

**页面结构：**

```
┌─────────────────────────────┐
│  < 返回    商户买单          │
├─────────────────────────────┤
│  商家名称                    │
├─────────────────────────────┤
│  消费总额            [输入]  │
├─────────────────────────────┤
│  买单优惠                    │
│  ✓ 优惠券1                  │
│  ○ 优惠券2                  │
├─────────────────────────────┤
│  合计优惠            -¥X     │
├─────────────────────────────┤
│  实际支付金额        ¥XX     │
├─────────────────────────────┤
│  优惠说明：                  │
│  * 使用规则...              │
└─────────────────────────────┘
│  已和店员确认，立即买单      │
└─────────────────────────────┘
```

**核心功能：**

1. **消费总额输入**
   - 大字号显示
   - 数字键盘输入
   - 实时验证（0.01-1000元）
   - 自动格式化为两位小数

2. **买单优惠选择**
   - 显示可用优惠券列表
   - 自动选中最优优惠
   - 支持手动切换
   - 不可用优惠显示为灰色

3. **费用计算**
   - 实时计算优惠金额
   - 显示最终实付金额
   - 金额变化动画效果

4. **优惠说明**
   - 红色文字显示规则
   - 包含时间、金额、次数限制

5. **确认按钮**
   - 绿色大按钮
   - 验证后跳转收银台

**优惠券计算逻辑：**

```javascript
// 每满X减Y（如每满20减2）
const calculateFullReduction = (amount, fullAmount, reduceAmount) => {
  const times = Math.floor(amount / fullAmount)
  return times * reduceAmount
}

// 满X减Y（如满100减10）
const calculateThresholdReduction = (amount, threshold, reduceAmount) => {
  return amount >= threshold ? reduceAmount : 0
}

// 代金券（如20元代金券）
const calculateVoucher = (amount, voucherAmount) => {
  return amount >= voucherAmount ? voucherAmount : 0
}
```

---

### 3. 收银台确认买单（Cashier.vue - 修改）

**适配买单场景：**

```
┌─────────────────────────────┐
│  < 返回    确认支付          │
├─────────────────────────────┤
│  剩余支付时间：00:14:55      │  ← 绿色倒计时
├─────────────────────────────┤
│       商家名称               │
│       ¥19.00                │  ← 绿色大字
│       实付款                 │
├─────────────────────────────┤
│  支付卡片  🏦 银行卡(尾号)   │
│                选择其他卡片 >│
├─────────────────────────────┤
│  订单金额            ¥21.00  │
│  商户买单优惠        -¥2.00  │  ← 橙色
└─────────────────────────────┘
│       立即付款               │
└─────────────────────────────┘
```

**修改内容：**
- 支持 `type: 'merchant_payment'` 订单类型
- 显示"商户买单优惠"而非"优惠券"
- 调整UI适配买单场景

---

## 🛠️ 技术实现

### 新增文件

#### 1. src/views/MerchantPayment.vue

```vue
<template>
  <div class="merchant-payment-page">
    <!-- 顶部导航 -->
    <div class="header">
      <LeftOutlined @click="goBack" />
      <span class="title">商户买单</span>
    </div>

    <!-- 商家信息 -->
    <div class="merchant-info">
      <h2>{{ merchantInfo.name }}</h2>
    </div>

    <!-- 消费总额 -->
    <div class="amount-section">
      <div class="label">消费总额</div>
      <input
        v-model="consumeAmount"
        type="number"
        inputmode="decimal"
        placeholder="请输入消费金额"
        @input="onAmountChange"
      />
    </div>

    <!-- 买单优惠 -->
    <div class="coupon-section">
      <div class="section-title">买单优惠</div>
      <div
        v-for="coupon in availableCoupons"
        :key="coupon.id"
        :class="['coupon-item', { selected: selectedCoupon?.id === coupon.id, disabled: !coupon.available }]"
        @click="selectCoupon(coupon)"
      >
        <CheckCircleOutlined v-if="selectedCoupon?.id === coupon.id" />
        <CircleOutlined v-else />
        <span>{{ coupon.name }}</span>
      </div>
    </div>

    <!-- 费用明细 -->
    <div class="summary-section">
      <div class="summary-item">
        <span>合计优惠</span>
        <span class="discount">-{{ discountAmount }}</span>
      </div>
      <div class="summary-item total">
        <span>实际支付金额</span>
        <span class="final-amount">¥{{ finalAmount }}</span>
      </div>
    </div>

    <!-- 优惠说明 -->
    <div class="notice-section">
      <div class="notice-title">优惠说明：</div>
      <div class="notice-content">
        <p>* 使用时间 {{ couponRules.timeRange }}。</p>
        <p>* {{ couponRules.description }}。</p>
        <p>* 每人每日仅限享受一次惠买单优惠，名额有限，先到先得。</p>
        <p>* 单笔实际支付金额需为0.01元至1000元。若使用代金券，消费总额需大于代金券面值。</p>
        <p>* 因支付金额受商户活动名额和客户当日参与活动次数影响，最终支付金额请以支付页面展示为准。</p>
      </div>
    </div>

    <!-- 确认按钮 -->
    <div class="bottom-bar">
      <a-button
        type="primary"
        size="large"
        block
        :disabled="!canSubmit"
        @click="confirmPayment"
      >
        已和店员确认，立即买单
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMerchantPaymentStore } from '@/stores/merchantPayment'
import { LeftOutlined, CheckCircleOutlined, CircleOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const paymentStore = useMerchantPaymentStore()

// ... 逻辑实现
</script>
```

#### 2. src/stores/merchantPayment.ts

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface MerchantPaymentCoupon {
  id: string
  name: string
  type: 'full_reduction' | 'threshold_reduction' | 'voucher'
  fullAmount?: number      // 每满X元
  reduceAmount?: number    // 减Y元
  threshold?: number       // 满X元
  voucherAmount?: number   // 代金券面值
  timeRange: string
  description: string
  available: boolean
}

export const useMerchantPaymentStore = defineStore('merchantPayment', () => {
  const merchantInfo = ref<any>(null)
  const consumeAmount = ref<number>(0)
  const selectedCoupon = ref<MerchantPaymentCoupon | null>(null)

  // 计算优惠金额
  const discountAmount = computed(() => {
    if (!selectedCoupon.value || consumeAmount.value <= 0) return 0

    const coupon = selectedCoupon.value
    const amount = consumeAmount.value

    switch (coupon.type) {
      case 'full_reduction':
        // 每满X减Y
        const times = Math.floor(amount / (coupon.fullAmount || 1))
        return times * (coupon.reduceAmount || 0)
      
      case 'threshold_reduction':
        // 满X减Y
        return amount >= (coupon.threshold || 0) ? (coupon.reduceAmount || 0) : 0
      
      case 'voucher':
        // 代金券
        return amount >= (coupon.voucherAmount || 0) ? (coupon.voucherAmount || 0) : 0
      
      default:
        return 0
    }
  })

  // 实付金额
  const finalAmount = computed(() => {
    const result = consumeAmount.value - discountAmount.value
    return Math.max(result, 0).toFixed(2)
  })

  // 可用优惠券列表
  const availableCoupons = computed(() => {
    return merchantInfo.value?.coupons?.map((coupon: MerchantPaymentCoupon) => {
      // 判断优惠券是否可用
      let available = true
      if (coupon.type === 'full_reduction') {
        available = consumeAmount.value >= (coupon.fullAmount || 0)
      } else if (coupon.type === 'threshold_reduction') {
        available = consumeAmount.value >= (coupon.threshold || 0)
      } else if (coupon.type === 'voucher') {
        available = consumeAmount.value >= (coupon.voucherAmount || 0)
      }
      return { ...coupon, available }
    }) || []
  })

  // 生成买单订单
  const createPaymentOrder = () => {
    return {
      type: 'merchant_payment',
      merchantId: merchantInfo.value.id,
      merchantName: merchantInfo.value.name,
      consumeAmount: consumeAmount.value,
      couponId: selectedCoupon.value?.id,
      couponName: selectedCoupon.value?.name,
      discountAmount: discountAmount.value,
      finalAmount: parseFloat(finalAmount.value),
      createTime: Date.now(),
      expireTime: Date.now() + 15 * 60 * 1000 // 15分钟后过期
    }
  }

  // 重置状态
  const reset = () => {
    consumeAmount.value = 0
    selectedCoupon.value = null
  }

  return {
    merchantInfo,
    consumeAmount,
    selectedCoupon,
    discountAmount,
    finalAmount,
    availableCoupons,
    createPaymentOrder,
    reset
  }
})
```

---

### 修改文件

#### 1. src/views/MerchantDetail.vue

**添加惠买单区域：**

```vue
<!-- 在优惠券区域后添加 -->
<div class="payment-section">
  <div class="section-header">
    <div class="payment-badge">
      <span class="badge-icon">单</span>
      <span class="badge-text">惠买单</span>
    </div>
  </div>
  <div class="payment-card">
    <div class="payment-info">
      <div class="payment-offer">每满20减2元</div>
      <div class="payment-time">周一至周日 | 民生银行卡专享</div>
    </div>
    <a-button type="primary" class="payment-btn" @click="goToPayment">
      买单
    </a-button>
  </div>
</div>
```

**添加方法：**

```typescript
const goToPayment = () => {
  router.push({
    name: 'MerchantPayment',
    params: { merchantId: merchant.value.id }
  })
}
```

#### 2. src/views/Cashier.vue

**适配买单订单类型：**

```vue
<!-- 订单明细区域 -->
<div class="order-summary">
  <div class="summary-item">
    <span>订单金额</span>
    <span>¥{{ orderInfo.consumeAmount || orderInfo.totalAmount }}</span>
  </div>
  <div v-if="orderInfo.type === 'merchant_payment'" class="summary-item">
    <span class="discount-label">商户买单优惠</span>
    <span class="discount-value">-¥{{ orderInfo.discountAmount }}</span>
  </div>
  <div v-else-if="orderInfo.couponDiscount" class="summary-item">
    <span class="discount-label">优惠券</span>
    <span class="discount-value">-¥{{ orderInfo.couponDiscount }}</span>
  </div>
</div>
```

#### 3. src/router/index.ts

**添加路由：**

```typescript
{
  path: '/merchant-payment/:merchantId',
  name: 'MerchantPayment',
  component: () => import('../views/MerchantPayment.vue'),
  meta: { hideTabBar: true }
}
```

---

## 🎨 样式设计

### 颜色规范

- **主色调**: `#00C853` (绿色) - 用于按钮、强调文字
- **辅助色**: `#FF6B35` (橙色) - 用于优惠金额
- **警示色**: `#FF4444` (红色) - 用于规则说明
- **文字色**: `#333333` (深灰) - 主要文字
- **次要文字**: `#999999` (浅灰) - 次要信息

### 字体大小

- **大标题**: `32px` - 实付金额
- **标题**: `18px` - 区域标题
- **正文**: `14px` - 普通文字
- **小字**: `12px` - 说明文字

### 间距规范

- **页面边距**: `16px`
- **区域间距**: `12px`
- **元素间距**: `8px`

---

## 🔄 数据流

```
MerchantDetail.vue
    ↓ 传递 merchantId
MerchantPayment.vue
    ↓ 创建订单数据
merchantPaymentStore
    ↓ 生成订单
Cashier.vue
    ↓ 调起支付
支付成功
```

---

## ✅ 验证规则

### 金额验证
- 必须大于 0.01 元
- 不能超过 1000 元
- 必须是数字
- 最多两位小数

### 优惠券验证
- 检查是否满足使用条件
- 检查是否在有效期内
- 检查是否已达使用次数上限

### 提交验证
- 金额必须有效
- 必须选择优惠券（如果有可用的）
- 最终金额必须大于 0

---

## 📊 测试用例

### 1. 金额输入测试
- [ ] 输入正常金额（如 21）
- [ ] 输入小数金额（如 21.50）
- [ ] 输入无效金额（如 0、-1、1001）
- [ ] 输入非数字字符

### 2. 优惠计算测试
- [ ] 每满20减2：输入21 → 优惠2 → 实付19
- [ ] 每满20减2：输入19 → 优惠0 → 实付19
- [ ] 每满20减2：输入41 → 优惠4 → 实付37
- [ ] 满100减10：输入99 → 优惠0 → 实付99
- [ ] 满100减10：输入100 → 优惠10 → 实付90

### 3. 优惠券切换测试
- [ ] 选择不同优惠券，费用正确更新
- [ ] 不可用优惠券显示为灰色
- [ ] 金额变化时优惠券可用性更新

### 4. 流程测试
- [ ] 从商家详情进入买单页
- [ ] 完成买单后跳转收银台
- [ ] 收银台显示正确的订单信息
- [ ] 支付成功后跳转订单详情

---

## 📝 开发检查清单

### 阶段1：创建买单页面
- [ ] 创建 MerchantPayment.vue 文件
- [ ] 实现页面布局和样式
- [ ] 实现金额输入组件
- [ ] 实现优惠券选择UI
- [ ] 实现费用明细展示

### 阶段2：状态管理
- [ ] 创建 merchantPayment.ts
- [ ] 实现优惠计算逻辑
- [ ] 实现优惠券匹配逻辑
- [ ] 实现订单生成逻辑

### 阶段3：集成商家详情页
- [ ] 修改 MerchantDetail.vue
- [ ] 添加惠买单区域
- [ ] 添加买单按钮
- [ ] 实现跳转逻辑

### 阶段4：适配收银台
- [ ] 修改 Cashier.vue
- [ ] 支持买单订单类型
- [ ] 调整UI显示
- [ ] 测试支付流程

### 阶段5：路由配置
- [ ] 添加买单页面路由
- [ ] 配置路由参数
- [ ] 测试路由跳转

### 阶段6：测试和优化
- [ ] 功能测试
- [ ] 边界情况测试
- [ ] UI/UX 优化
- [ ] 性能优化

---

## 🚀 预计时间

- **阶段1**: 创建买单页面 - 60分钟
- **阶段2**: 状态管理 - 30分钟
- **阶段3**: 集成商家详情页 - 20分钟
- **阶段4**: 适配收银台 - 20分钟
- **阶段5**: 路由配置 - 10分钟
- **阶段6**: 测试和优化 - 40分钟

**总计**: 约 3 小时

---

## 📌 注意事项

1. **金额精度**: 使用 `toFixed(2)` 确保两位小数
2. **优惠计算**: 注意向下取整（`Math.floor`）
3. **状态管理**: 页面离开时清理状态
4. **错误处理**: 添加友好的错误提示
5. **加载状态**: 添加 loading 状态
6. **空状态**: 处理无可用优惠券的情况

---

**文档状态**: 待用户确认  
**下一步**: 等待用户确认后开始实施

