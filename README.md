# 权益平台小程序 - 部署说明文档

## 项目信息

- **项目名称**: 权益平台微信小程序
- **技术栈**: Vue 3 + TypeScript + Vite + Ant Design Vue
- **备份日期**: 2024年10月14日
- **版本**: v3.0 (包含实名认证功能)

## 项目结构

```
rights-platform-v3/
├── src/
│   ├── views/              # 页面组件
│   │   ├── Home.vue        # 首页
│   │   ├── Mine.vue        # 我的
│   │   ├── PointsMall.vue  # 积分商城
│   │   ├── Vouchers.vue    # 我的票券
│   │   ├── EarnPoints.vue  # 玩赚积分
│   │   ├── GovSubsidy.vue  # 政府补贴申请
│   │   ├── LocalVouchers.vue # 本地消费券
│   │   ├── ForeignTrade.vue  # 外贸优品
│   │   ├── SailorEconomy.vue # 海员经济
│   │   ├── RealNameAuth.vue  # 实名认证 (新增)
│   │   └── ...             # 其他页面
│   ├── router/
│   │   └── index.ts        # 路由配置
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── public/                 # 静态资源
├── package.json            # 项目配置
├── vite.config.ts          # Vite配置
└── tsconfig.json           # TypeScript配置
```

## 已实现功能模块

### 核心功能
- ✅ 首页（轮播、金刚区、限时秒杀、特色专区）
- ✅ 积分商城
- ✅ 我的票券
- ✅ 个人中心
- ✅ 玩赚积分（任务、抽奖）

### 政府权益
- ✅ 政府补贴申请
- ✅ 本地消费券

### 特色购物专区
- ✅ 苏品苏货
- ✅ 老字号（15个品牌）
- ✅ 国货潮品
- ✅ 外贸优品
- ✅ 海员经济

### 交易与活动
- ✅ 活动中心
- ✅ 领券中心
- ✅ 限时秒杀
- ✅ 订单管理（详情、物流、售后）
- ✅ 会员中心

### 用户认证
- ✅ 实名认证（四步流程：信息填写 → 证件上传 → 人脸识别 → 完成认证）

## 部署步骤

### 方式一：解压后直接部署（推荐）

1. **解压项目文件**
   ```bash
   tar -xzf rights-platform-v3-backup-20251014.tar.gz
   cd rights-platform-v3
   ```

2. **安装依赖**
   ```bash
   pnpm install
   # 或使用 npm
   npm install
   ```

3. **构建项目**
   ```bash
   pnpm build
   # 或使用 npm
   npm run build
   ```

4. **部署**
   - 静态部署：将 `dist/` 目录部署到任何静态服务器
   - 使用部署工具：直接使用 `deploy_frontend` 工具部署 `dist/` 目录

### 方式二：上传后让AI部署

1. **上传压缩包**
   - 将 `rights-platform-v3-backup-20251014.tar.gz` 上传给AI

2. **告诉AI执行以下命令**
   ```
   请帮我部署这个项目：
   1. 解压项目文件
   2. 安装依赖（pnpm install）
   3. 构建项目（pnpm build）
   4. 部署到公网（使用 deploy_frontend 工具）
   ```

## 开发环境运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

## 构建命令

```bash
# 生产环境构建
pnpm build

# 预览构建结果
pnpm preview
```

## 路由列表

| 路由路径 | 页面名称 | 说明 |
|---------|---------|------|
| `/` | 首页 | 主页面，包含金刚区、秒杀、特色专区 |
| `/mine` | 我的 | 个人中心 |
| `/points-mall` | 积分商城 | 积分兑换商品 |
| `/vouchers` | 我的票券 | 优惠券管理 |
| `/earn-points` | 玩赚积分 | 积分任务和抽奖 |
| `/gov-subsidy` | 政府补贴 | 政府补贴申请 |
| `/local-vouchers` | 本地消费券 | 消费券领取 |
| `/foreign-trade` | 外贸优品 | 外贸商品专区 |
| `/sailor-economy` | 海员经济 | 海员专属服务 |
| `/real-name-auth` | 实名认证 | 用户实名认证 |
| `/local-products` | 苏品苏货 | 本地特色商品 |
| `/heritage-brands` | 老字号 | 老字号品牌 |
| `/trendy-products` | 国货潮品 | 国货潮流商品 |
| `/business-circle` | 活动中心 | 商圈活动 |
| `/flash-sale` | 限时秒杀 | 秒杀商品 |
| `/membership` | 会员中心 | 会员权益 |
| `/orders` | 订单管理 | 订单列表 |

## 注意事项

1. **依赖安装**
   - 推荐使用 `pnpm`，如果没有安装可以使用 `npm install -g pnpm`
   - 也可以使用 `npm` 或 `yarn`

2. **Node.js 版本**
   - 要求 Node.js >= 16.0.0
   - 推荐使用 Node.js 18 或更高版本

3. **构建输出**
   - 构建后的文件在 `dist/` 目录
   - 可以直接部署到任何静态服务器（Nginx、Apache、CDN等）

4. **环境变量**
   - 当前项目未使用环境变量
   - 如需配置API地址等，可创建 `.env` 文件

## 常见问题

### Q1: 构建时出现 TypeScript 错误怎么办？
A: 可以跳过类型检查直接构建：
```bash
pnpm exec vite build
```

### Q2: 如何修改端口？
A: 在 `vite.config.ts` 中修改：
```typescript
export default defineConfig({
  server: {
    port: 3000  // 修改为你想要的端口
  }
})
```

### Q3: 部署后页面空白？
A: 检查以下几点：
- 确保使用了 Hash 路由模式（已配置）
- 检查静态资源路径是否正确
- 查看浏览器控制台是否有错误

## 技术支持

如有问题，请检查：
1. Node.js 版本是否符合要求
2. 依赖是否完整安装
3. 构建过程是否有错误提示

## 更新日志

### v3.0 (2024-10-14)
- ✅ 新增实名认证功能
- ✅ 完善政府补贴申请
- ✅ 新增本地消费券
- ✅ 新增外贸优品专区
- ✅ 新增海员经济专区
- ✅ 首页金刚区扩展至10个入口
- ✅ 优化整体UI和交互体验

---

**备注**: 本项目为演示版本，部分功能为模拟实现，实际生产环境需要对接真实后端API。

