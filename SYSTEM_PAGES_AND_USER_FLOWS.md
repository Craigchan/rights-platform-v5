# 权益平台系统页面清单与用户动线梳理

**梳理日期**: 2025年10月23日  
**系统版本**: V5  
**总页面数**: 82个

---

## 📊 页面分类统计

### 一级导航页面（4个）
1. **首页** - HomeFeed.vue
2. **发现** - Discover.vue
3. **购物车** - Cart.vue
4. **我的** - MineRedesigned.vue

### 核心业务页面（45个）

#### 商品与购物（10个）
- ProductDetail.vue - 商品详情
- Cart.vue - 购物车
- Checkout.vue - 结算页
- Cashier.vue - 收银台
- Orders.vue - 订单列表
- OrderDetail.vue - 订单详情
- Logistics.vue - 物流跟踪
- AfterSales.vue - 售后服务
- Invoice.vue - 发票管理
- FlashSale.vue - 限时抢购

#### 商家与优惠（8个）
- MerchantDetail.vue - 商家详情
- MerchantPayment.vue - 商户买单
- MerchantOfferDetailEnhanced.vue - 商家优惠详情
- MerchantCouponList.vue - 商家优惠券列表
- VoucherCenter.vue - 领券中心
- Vouchers.vue - 我的优惠券
- LocalVouchers.vue - 本地消费券
- Nearby.vue - 附近商家

#### 积分与抽奖（12个）
- PointsMall.vue - 积分商城
- PointsDetail.vue - 积分明细
- EarnPoints.vue - 赚积分
- RedeemRecords.vue - 兑换记录
- LotteryCenter.vue - 抽奖中心
- LotteryWheel.vue - 大转盘
- LotteryHall.vue - 抽奖大厅
- LotteryDraw.vue - 抽奖
- LotteryDetail.vue - 抽奖详情
- LotteryRecords.vue - 抽奖记录
- LotteryStatistics.vue - 抽奖统计
- GetLotteryCode.vue - 获取抽奖码

#### 政府补贴与活动（8个）
- GovSubsidy.vue - 政府补贴
- SubsidyHelp.vue - 补贴帮助
- SubsidyHelpDetail.vue - 补贴帮助详情
- SubsidyApplications.vue - 补贴申请记录
- ActivityCenter.vue - 活动中心
- ActivityDetail.vue - 活动详情
- CityRights.vue - 城市权益
- MatchCalendar.vue - 赛事日历

#### 票根与拼图（7个）
- TicketUpload.vue - 上传票根
- MyTickets.vue - 我的票根
- TicketDetail.vue - 票根详情
- TicketPuzzle.vue - 票根拼图
- TicketPuzzleDetail.vue - 拼图详情
- StubAnalytics.vue - 票根分析
- MapCheckIn.vue - 地图打卡

### 用户中心页面（18个）

#### 账户管理（6个）
- AccountSettings.vue - 账户设置
- RealNameAuth.vue - 实名认证
- ChangePhone.vue - 更换手机号
- ChangePassword.vue - 修改密码
- NotificationSettings.vue - 通知设置
- PrivacySettings.vue - 隐私设置

#### 个人资料（5个）
- Membership.vue - 会员中心
- AddressManagement.vue - 地址管理
- Favorites.vue - 我的收藏
- History.vue - 浏览历史
- SocialFeatures.vue - 社交功能

#### 消息与服务（7个）
- Notifications.vue - 消息通知
- CustomerService.vue - 客服中心
- Feedback.vue - 意见反馈
- HelpCenter.vue - 帮助中心
- About.vue - 关于我们
- ConsumerGuide.vue - 消费指南
- ErrorPage.vue / NotFound.vue - 错误页面

### 特色功能页面（10个）
- Search.vue - 搜索
- CitySelector.vue - 城市选择
- TrendyProducts.vue - 潮品专区
- LocalProducts.vue - 本地好物
- HeritageBrands.vue - 老字号
- ForeignTrade.vue - 外贸优品
- SailorEconomy.vue - 水手经济
- SuchaoZone.vue - 苏潮专区
- Home.vue / HomeOptimized.vue - 旧版首页（待清理）
- Mine.vue / MineOptimized.vue - 旧版我的（待清理）

### 其他页面（5个）
- Cart_old.vue - 旧版购物车（待清理）
- Home.vue.full.vue - 首页完整版（待清理）

---

## 🎯 核心用户动线分析

### 动线1：商品购买流程
```
首页/发现页
  ↓ 浏览商品
商品详情页
  ↓ 加入购物车
购物车
  ↓ 选择商品、使用优惠券
结算页
  ↓ 选择地址、支付方式
收银台
  ↓ 确认支付
订单详情
  ↓ 查看物流
物流跟踪
```

**关键触点**: 8个页面  
**转化漏斗**: 首页 → 详情 → 购物车 → 结算 → 支付 → 完成

---

### 动线2：商户买单流程
```
首页/发现页
  ↓ 查找商家
商家详情页
  ↓ 点击"买单"
商户买单页
  ↓ 输入金额、选择优惠
收银台
  ↓ 确认支付
支付成功
```

**关键触点**: 5个页面  
**转化漏斗**: 商家详情 → 买单页 → 收银台 → 完成

---

### 动线3：领券使用流程
```
首页/发现页
  ↓ 点击"领券中心"
领券中心
  ↓ 浏览优惠券
优惠券详情
  ↓ 领取优惠券
我的优惠券
  ↓ 去使用
商品详情/商家详情
  ↓ 下单
结算页（自动应用优惠券）
```

**关键触点**: 6个页面  
**转化漏斗**: 领券 → 查看 → 使用 → 下单

---

### 动线4：积分兑换流程
```
首页/我的页
  ↓ 点击"积分商城"
积分商城
  ↓ 浏览商品
商品详情
  ↓ 积分兑换
确认兑换
  ↓ 兑换成功
订单详情
```

**关键触点**: 5个页面  
**转化漏斗**: 商城 → 详情 → 兑换 → 完成

---

### 动线5：抽奖参与流程
```
首页/我的页
  ↓ 点击"抽奖中心"
抽奖中心
  ↓ 选择抽奖活动
抽奖详情
  ↓ 获取抽奖码
获取抽奖码页
  ↓ 参与抽奖
大转盘/抽奖页
  ↓ 查看结果
中奖记录
```

**关键触点**: 6个页面  
**转化漏斗**: 中心 → 详情 → 获取码 → 抽奖 → 查看

---

### 动线6：政府补贴申请流程
```
首页/发现页
  ↓ 点击"政府补贴"
政府补贴页
  ↓ 查看补贴政策
补贴帮助详情
  ↓ 申请补贴
实名认证（如需要）
  ↓ 提交申请
补贴申请记录
  ↓ 查看审核状态
```

**关键触点**: 5-6个页面  
**转化漏斗**: 补贴页 → 详情 → 认证 → 申请 → 完成

---

### 动线7：票根上传与拼图流程
```
首页/任意页面
  ↓ 点击悬浮按钮"上传票根"
上传票根页
  ↓ 拍照/选择图片
上传成功
  ↓ 查看我的票根
我的票根
  ↓ 参与拼图
票根拼图
  ↓ 完成拼图
拼图详情/奖励
```

**关键触点**: 6个页面  
**转化漏斗**: 上传 → 成功 → 查看 → 拼图 → 完成

---

### 动线8：消息通知流程
```
任意页面
  ↓ 收到通知（铃铛角标）
点击铃铛
  ↓ 进入消息通知页
消息通知列表
  ↓ 点击消息
目标页面（活动/订单/优惠券等）
```

**关键触点**: 3个页面  
**转化漏斗**: 通知 → 列表 → 目标页

---

## 🔍 页面层级结构

### Level 1 - 一级导航（4个）
- HomeFeed（首页）
- Discover（发现）
- Cart（购物车）
- MineRedesigned（我的）

### Level 2 - 二级页面（约30个）
从一级导航直接可达的页面：
- 商品详情、商家详情
- 领券中心、积分商城
- 活动中心、抽奖中心
- 政府补贴、我的订单
- 我的优惠券、账户设置
- 等...

### Level 3 - 三级页面（约40个）
需要通过二级页面才能到达：
- 订单详情、物流跟踪
- 抽奖详情、拼图详情
- 补贴帮助详情、活动详情
- 地址管理、实名认证
- 等...

### Level 4+ - 深层页面（约8个）
需要多次跳转才能到达：
- 修改密码、更换手机号
- 发票管理、售后服务
- 等...

---

## 📱 页面访问频率预估

### 高频页面（日均访问>1000次）
1. HomeFeed - 首页
2. Discover - 发现页
3. MineRedesigned - 我的页
4. ProductDetail - 商品详情
5. MerchantDetail - 商家详情
6. Cart - 购物车
7. Orders - 订单列表
8. Notifications - 消息通知

### 中频页面（日均访问100-1000次）
- VoucherCenter - 领券中心
- PointsMall - 积分商城
- LotteryCenter - 抽奖中心
- ActivityCenter - 活动中心
- GovSubsidy - 政府补贴
- Search - 搜索
- Vouchers - 我的优惠券
- PointsDetail - 积分明细

### 低频页面（日均访问<100次）
- AccountSettings - 账户设置
- AddressManagement - 地址管理
- HelpCenter - 帮助中心
- Feedback - 意见反馈
- About - 关于我们
- 等设置和帮助类页面

---

## 🎨 页面类型分类

### 列表页（约20个）
- Orders, LotteryRecords, MyTickets
- Vouchers, RedeemRecords, History
- Favorites, Notifications, SubsidyApplications
- 等...

### 详情页（约25个）
- ProductDetail, MerchantDetail, OrderDetail
- ActivityDetail, LotteryDetail, TicketDetail
- SubsidyHelpDetail, TicketPuzzleDetail
- 等...

### 表单页（约15个）
- Checkout, MerchantPayment, TicketUpload
- RealNameAuth, AddressManagement, Feedback
- ChangePhone, ChangePassword
- 等...

### 展示页（约15个）
- HomeFeed, Discover, PointsMall
- VoucherCenter, LotteryCenter, ActivityCenter
- 等...

### 交互页（约7个）
- Cart, LotteryWheel, LotteryDraw
- TicketPuzzle, MapCheckIn
- 等...

---

## 🚀 待优化的旧版页面

### 需要清理的文件（5个）
1. Home.vue - 旧版首页（已被HomeFeed.vue替代）
2. HomeOptimized.vue - 优化版首页（已被HomeFeed.vue替代）
3. Home.vue.full.vue - 完整版首页（开发测试文件）
4. Mine.vue - 旧版我的页（已被MineRedesigned.vue替代）
5. MineOptimized.vue - 优化版我的页（已被MineRedesigned.vue替代）
6. Cart_old.vue - 旧版购物车（已被Cart.vue替代）

**建议**: 删除或归档这些文件，避免混淆

---

## 📊 总结

### 系统规模
- **总页面数**: 82个
- **核心页面**: 45个
- **用户中心**: 18个
- **特色功能**: 10个
- **待清理**: 5个

### 页面层级
- **Level 1**: 4个（一级导航）
- **Level 2**: 30个（二级页面）
- **Level 3**: 40个（三级页面）
- **Level 4+**: 8个（深层页面）

### 核心动线
- **商品购买**: 8个触点
- **商户买单**: 5个触点
- **领券使用**: 6个触点
- **积分兑换**: 5个触点
- **抽奖参与**: 6个触点
- **政府补贴**: 5-6个触点
- **票根拼图**: 6个触点
- **消息通知**: 3个触点

---

**下一步**: 逐页面深度分析UI/UX和交互体验

