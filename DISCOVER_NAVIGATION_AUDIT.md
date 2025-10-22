# Discover 页面导航审计报告

## 审计时间
2025-10-22

## 审计目标
检查 Discover.vue 页面中所有 21 个功能入口的路由配置，确保所有导航链接都能正确跳转到目标页面。

## 功能入口清单

### 1. 购物消费 (6项)
| 序号 | 功能名称 | 路由路径 | 目标页面 | 状态 |
|------|---------|---------|---------|------|
| 1 | 积分商城 | `/points-mall` | PointsMall.vue | ✅ 已存在 |
| 2 | 苏品苏货 | `/local-products` | LocalProducts.vue | ❓ 待检查 |
| 3 | 老字号 | `/heritage-brands` | HeritageBrands.vue | ❓ 待检查 |
| 4 | 国货潮品 | `/trendy-products` | TrendyProducts.vue | ❓ 待检查 |
| 5 | 外贸优品 | `/foreign-trade` | ForeignTrade.vue | ❓ 待检查 |
| 6 | 海员经济 | `/sailor-economy` | SailorEconomy.vue | ❓ 待检查 |

### 2. 权益福利 (4项)
| 序号 | 功能名称 | 路由路径 | 目标页面 | 状态 |
|------|---------|---------|---------|------|
| 7 | 优惠券中心 | `/voucher-center` | VoucherCenter.vue | ✅ 已存在 |
| 8 | 政府补贴 | `/gov-subsidy` | GovSubsidy.vue | ✅ 已存在 |
| 9 | 以旧换新 | `/gov-subsidy` | GovSubsidy.vue | ✅ 已存在 (复用) |
| 10 | 会员权益 | `/membership` | Membership.vue | ❓ 待检查 |

### 3. 互动玩法 (5项)
| 序号 | 功能名称 | 路由路径 | 目标页面 | 状态 |
|------|---------|---------|---------|------|
| 11 | 签到打卡 | `/earn-points` | EarnPoints.vue | ✅ 已存在 |
| 12 | 积分任务 | `/earn-points` | EarnPoints.vue | ✅ 已存在 (复用) |
| 13 | 幸运抽奖 | `/lottery-center` | LotteryCenter.vue | ✅ 已存在 |
| 14 | 票根拼图 | `/ticket-puzzle` | TicketPuzzle.vue | ✅ 已存在 |
| 15 | 政府补贴助力 | `/subsidy-help` | SubsidyHelp.vue | ✅ 已存在 |

### 4. 活动专区 (3项)
| 序号 | 功能名称 | 路由路径 | 目标页面 | 状态 |
|------|---------|---------|---------|------|
| 16 | 活动中心 | `/activity-center` | ActivityCenter.vue | ✅ 已存在 |
| 17 | 苏超专区 | `/suchao-zone` | SuchaoZone.vue | ✅ 已存在 |
| 18 | 限时秒杀 | `/flash-sale` | FlashSale.vue | ❓ 待检查 |

### 5. 本地服务 (3项)
| 序号 | 功能名称 | 路由路径 | 目标页面 | 状态 |
|------|---------|---------|---------|------|
| 19 | 附近优惠 | `/nearby` | Nearby.vue | ✅ 已存在 |
| 20 | 商家地图 | `/nearby` | Nearby.vue | ✅ 已存在 (复用) |
| 21 | 上传票根 | `/ticket-upload` | TicketUpload.vue | ❓ 待检查 |

## 待检查路由列表

需要检查以下 7 个路由是否已配置：

1. `/local-products` - 苏品苏货
2. `/heritage-brands` - 老字号
3. `/trendy-products` - 国货潮品
4. `/foreign-trade` - 外贸优品
5. `/sailor-economy` - 海员经济
6. `/membership` - 会员权益
7. `/flash-sale` - 限时秒杀
8. `/ticket-upload` - 上传票根

## 下一步操作

1. 检查 router/index.ts 中是否存在这些路由配置
2. 检查 src/views 目录中是否存在对应的页面组件
3. 对于缺失的路由/页面，需要创建或修复

