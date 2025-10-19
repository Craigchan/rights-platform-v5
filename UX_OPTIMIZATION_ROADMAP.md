# UX优化实施路线图

## 总体目标
将权益平台从"功能为中心"的陈列式应用,转变为"用户任务为中心"的智能化服务平台。

---

## 第一阶段：信息架构重构 (1-2周)

### 任务1.1: 底部导航简化 - "3+1"模式
- [ ] 修改 `src/components/TabBar.vue` 或创建新的 `TabBarV2.vue`
- [ ] 将5个Tab简化为3个: 首页、发现、我的
- [ ] 添加悬浮操作按钮 (FAB) 用于快速操作

### 任务1.2: 创建"发现"页面 - 功能聚合入口
- [ ] 创建 `src/views/Discover.vue`
- [ ] 设计分类结构:
  - 购物消费 (积分商城、苏品苏货、老字号等)
  - 权益福利 (优惠券、政府补贴、会员权益)
  - 互动玩法 (签到、任务、抽奖、票根拼图)
  - 活动专区 (活动中心、苏超专区)
  - 本地服务 (附近优惠、商家地图、上传票根)
- [ ] 更新路由配置

### 任务1.3: 首页改造 - 智能卡片流
- [ ] 创建 `src/stores/feedStore.ts` 管理卡片生成逻辑
- [ ] 创建卡片组件:
  - `src/components/feed/SubsidyCard.vue` (政府补贴卡片)
  - `src/components/feed/CouponCard.vue` (优惠券卡片)
  - `src/components/feed/RecommendCard.vue` (商品推荐卡片)
  - `src/components/feed/NearbyCard.vue` (附近优惠卡片)
  - `src/components/feed/PointsTaskCard.vue` (积分任务卡片)
  - `src/components/feed/ActivityCard.vue` (活动卡片)
- [ ] 重构 `src/views/Home.vue` 或创建 `src/views/HomeFeed.vue`
- [ ] 实现个性化推荐算法

---

## 第二阶段：核心动线优化 (2-3周)

### 任务2.1: 购物流程优化 - "沉浸式购物"
- [ ] 优化 `src/views/ProductDetail.vue`:
  - 添加 `AvailableCoupons` 组件自动显示可用优惠券
  - 实现侧边栏结算 (Drawer) 替代页面跳转
- [ ] 创建 `src/components/checkout/CheckoutDrawer.vue`
- [ ] 优化优惠券自动匹配逻辑

### 任务2.2: 政府补贴申请优化 - "向导式流程"
- [ ] 创建 `src/components/subsidy/SubsidyWizard.vue`
- [ ] 实现分步引导:
  - Step 1: 欢迎与说明
  - Step 2: 创建申请
  - Step 3: 邀请好友 (自动生成海报)
  - Step 4: 完成反馈
- [ ] 优化 `src/views/GovSubsidy.vue` 集成向导

### 任务2.3: 积分任务流程优化
- [ ] 优化 `src/views/EarnPoints.vue`
- [ ] 创建任务完成弹窗组件 `src/components/points/TaskModal.vue`
- [ ] 添加积分获得动画效果
- [ ] 实现任务连续完成功能

---

## 第三阶段：体验个性化 (2周)

### 任务3.1: 用户画像与行为追踪
- [ ] 扩展 `src/stores/user.ts` 添加用户画像数据
- [ ] 实现浏览历史记录
- [ ] 实现行为分析逻辑

### 任务3.2: 动态内容推荐
- [ ] 实现新老用户差异化展示
- [ ] 实现基于地理位置的内容推荐
- [ ] 实现基于浏览历史的商品推荐

### 任务3.3: 游戏化机制整合
- [ ] 优化票根上传流程,添加即时反馈
- [ ] 在核心流程中集成拼图进度提示
- [ ] 优化积分获得动画和成就系统

---

## 第四阶段：技术性能提升 (持续进行)

### 任务4.1: 性能优化
- [ ] 深度代码分割
  - 拆分大型组件 (Home.vue, SuchaoZone.vue)
  - 异步加载非首屏组件
- [ ] 图片优化
  - 转换为WebP格式
  - 实现图片懒加载
- [ ] 精简依赖包

### 任务4.2: 代码重构
- [ ] 拆分巨型组件为小组件
- [ ] 提取可复用逻辑到 composables
- [ ] 统一代码风格

---

## 验收标准

### 用户体验指标
- [ ] 核心任务完成步骤减少50%以上
- [ ] 页面跳转次数减少60%以上
- [ ] 首页加载时间 < 2秒
- [ ] 用户满意度提升

### 技术指标
- [ ] 首屏加载时间 < 2秒
- [ ] Bundle大小减少30%
- [ ] Lighthouse性能分数 > 90
- [ ] 无严重可访问性问题

---

## 当前进度

- [x] 第一阶段准备: 创建优化分支
- [ ] 第一阶段: 信息架构重构
- [ ] 第二阶段: 核心动线优化
- [ ] 第三阶段: 体验个性化
- [ ] 第四阶段: 技术性能提升
- [ ] 最终测试与部署

