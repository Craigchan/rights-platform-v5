# 买单功能实施文件清单

## 📁 新增文件

### 1. src/stores/merchantPayment.ts
- **大小**: 5.2 KB
- **行数**: 175行
- **功能**: 商家买单状态管理
- **路径**: `/home/ubuntu/src/stores/merchantPayment.ts`

### 2. src/views/MerchantPayment.vue
- **大小**: 12.8 KB
- **行数**: 约400行
- **功能**: 商家买单页面
- **路径**: `/home/ubuntu/src/views/MerchantPayment.vue`

---

## 📝 修改文件

### 1. src/views/MerchantDetail.vue
- **修改行数**: 约100行
- **主要修改**:
  - 添加惠买单区域 (HTML)
  - 添加goToPayment方法 (JS)
  - 添加payment-section样式 (CSS)
- **路径**: `/home/ubuntu/src/views/MerchantDetail.vue`

### 2. src/views/Cashier.vue
- **修改行数**: 约80行
- **主要修改**:
  - 适配买单订单展示 (HTML)
  - 添加finalPayAmount计算属性 (JS)
  - 添加merchant-payment-info样式 (CSS)
- **路径**: `/home/ubuntu/src/views/Cashier.vue`

### 3. src/router/index.ts
- **修改行数**: 5行
- **主要修改**:
  - 添加MerchantPayment路由配置
- **路径**: `/home/ubuntu/src/router/index.ts`

---

## 📚 文档文件

### 1. MERCHANT_PAYMENT_IMPLEMENTATION_PLAN.md
- **大小**: 18.5 KB
- **内容**: 详细实施方案
- **路径**: `/home/ubuntu/MERCHANT_PAYMENT_IMPLEMENTATION_PLAN.md`

### 2. MERCHANT_PAYMENT_IMPLEMENTATION_REPORT.md
- **大小**: 22.3 KB
- **内容**: 实施完成报告
- **路径**: `/home/ubuntu/MERCHANT_PAYMENT_IMPLEMENTATION_REPORT.md`

---

## 🔍 快速定位

```bash
# 查看新增的状态管理
cat src/stores/merchantPayment.ts

# 查看买单页面
cat src/views/MerchantPayment.vue

# 查看商家详情页修改
git diff src/views/MerchantDetail.vue

# 查看收银台修改
git diff src/views/Cashier.vue

# 查看路由配置
git diff src/router/index.ts
```

---

## 📊 代码统计

| 文件类型 | 文件数 | 代码行数 | 大小 |
|---------|--------|---------|------|
| TypeScript | 1 | 175 | 5.2 KB |
| Vue组件 | 1 | 400 | 12.8 KB |
| 修改文件 | 3 | 185 | - |
| **总计** | **5** | **760** | **18 KB** |

