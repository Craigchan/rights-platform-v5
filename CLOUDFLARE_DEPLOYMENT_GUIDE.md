# Cloudflare Pages 部署指南

## 为什么选择 Cloudflare Pages？

- ✅ **国内访问友好**：Cloudflare CDN 在国内有较好的访问速度
- ✅ **完全免费**：无限带宽，无限请求
- ✅ **自动部署**：GitHub 集成，推送代码自动部署
- ✅ **全球 CDN**：自动分发到全球边缘节点
- ✅ **免费 HTTPS**：自动配置 SSL 证书
- ✅ **自定义域名**：支持绑定自己的域名

---

## 部署步骤

### 第一步：访问 Cloudflare Pages

打开浏览器访问：https://pages.cloudflare.com

### 第二步：注册/登录 Cloudflare 账号

1. 如果没有账号，点击 **Sign up** 注册
   - 输入邮箱和密码
   - 验证邮箱
   
2. 如果已有账号，点击 **Log in** 登录

### 第三步：创建新项目

1. 登录后，点击 **Create a project** 按钮

2. 选择 **Connect to Git**

3. 选择 **GitHub**
   - 如果是第一次使用，需要授权 Cloudflare 访问你的 GitHub
   - 点击 **Connect GitHub**
   - 在弹出窗口中选择授权范围（可以选择所有仓库或特定仓库）
   - 点击 **Install & Authorize**

4. 选择仓库
   - 在仓库列表中找到 **rights-platform-v5**
   - 点击仓库名称旁边的 **Begin setup**

### 第四步：配置构建设置

在 "Set up builds and deployments" 页面，填写以下信息：

#### 1. Project name（项目名称）
```
rights-platform-v5
```
或者你喜欢的其他名称（这将成为你的域名的一部分）

#### 2. Production branch（生产分支）
```
master
```

#### 3. Framework preset（框架预设）
选择：**None**（或者选择 Vite，但我们会手动配置）

#### 4. Build settings（构建设置）

**Build command（构建命令）**：
```bash
pnpm install && pnpm run build
```

**Build output directory（构建输出目录）**：
```
dist
```

#### 5. Environment variables（环境变量）

目前项目不需要环境变量，可以跳过。如果以后需要，可以在项目设置中添加。

### 第五步：部署

1. 确认所有配置正确
2. 点击页面底部的 **Save and Deploy** 按钮
3. Cloudflare Pages 会开始构建和部署
4. 等待几分钟（通常 2-5 分钟）

### 第六步：访问网站

部署成功后，你会看到成功页面，上面显示你的网站地址：

```
https://rights-platform-v5.pages.dev
```

或者类似：

```
https://rights-platform-v5-xxx.pages.dev
```

点击链接即可访问！

---

## 自动部署

配置完成后，每次推送代码到 GitHub 的 master 分支，Cloudflare Pages 都会自动重新部署：

1. 本地修改代码
2. 提交并推送到 GitHub
3. Cloudflare Pages 自动检测更新
4. 自动构建并部署新版本
5. 几分钟后新版本上线

---

## 自定义域名（可选）

如果你有自己的域名，可以绑定到 Cloudflare Pages：

### 方法一：域名已在 Cloudflare

1. 在项目页面，点击 **Custom domains** 标签
2. 点击 **Set up a custom domain**
3. 输入你的域名（例如：`www.example.com`）
4. 点击 **Continue**
5. Cloudflare 会自动配置 DNS 记录
6. 等待几分钟，域名生效

### 方法二：域名在其他服务商

1. 在项目页面，点击 **Custom domains** 标签
2. 点击 **Set up a custom domain**
3. 输入你的域名
4. Cloudflare 会提供 DNS 记录配置信息
5. 去你的域名服务商添加 CNAME 记录：
   ```
   类型: CNAME
   名称: www (或 @)
   值: rights-platform-v5.pages.dev
   ```
6. 等待 DNS 生效（可能需要几小时）

---

## 查看部署状态

### 部署历史

1. 进入项目页面
2. 点击 **Deployments** 标签
3. 可以看到所有部署记录，包括：
   - 部署时间
   - Git 提交信息
   - 部署状态（成功/失败）
   - 部署 URL

### 查看构建日志

1. 在 **Deployments** 页面
2. 点击某个部署记录
3. 点击 **View build log**
4. 可以看到详细的构建过程和错误信息

---

## 常见问题

### Q: 构建失败怎么办？

**A:** 检查以下几点：

1. **构建命令是否正确**
   - 应该是：`pnpm install && pnpm run build`
   
2. **输出目录是否正确**
   - 应该是：`dist`
   
3. **查看构建日志**
   - 在部署详情页面查看具体错误
   
4. **常见错误**：
   - 如果提示找不到 pnpm，尝试改用 npm：
     ```bash
     npm install && npm run build
     ```

### Q: 页面显示 404？

**A:** 这是单页应用路由问题，需要配置重定向规则。

在项目根目录创建 `_redirects` 文件（已为你创建）：
```
/* /index.html 200
```

或者创建 `public/_redirects` 文件。

### Q: 如何回滚到之前的版本？

**A:** 
1. 进入 **Deployments** 页面
2. 找到之前的成功部署
3. 点击右侧的 **...** 菜单
4. 选择 **Rollback to this deployment**

### Q: 国内访问速度如何？

**A:** Cloudflare 在国内有 CDN 节点，访问速度通常比 Vercel 好。但具体速度取决于：
- 用户所在地区
- 网络运营商
- 当前网络状况

如果访问仍然较慢，可以考虑：
- 使用国内 CDN（阿里云、腾讯云）
- 绑定自定义域名并使用国内 DNS

---

## 项目访问路径

### 首页
```
https://rights-platform-v5.pages.dev
```

### 日常抽奖大转盘
```
https://rights-platform-v5.pages.dev/#/lottery-wheel?type=daily&cost=100
```

---

## 性能优化建议

### 1. 启用 Brotli 压缩
Cloudflare Pages 默认启用，无需配置。

### 2. 配置缓存
在项目设置中可以配置缓存策略：
- 静态资源缓存时间
- HTML 缓存策略

### 3. 图片优化
使用 Cloudflare Images 服务（可选，需付费）

### 4. 分析工具
在项目设置中启用 Web Analytics：
- 访问量统计
- 页面性能分析
- 用户行为追踪

---

## 高级功能

### Functions（边缘函数）
Cloudflare Pages 支持在边缘运行 JavaScript 函数：
- API 端点
- 服务端渲染
- 中间件

### 环境变量
在项目设置中可以添加环境变量：
- 生产环境变量
- 预览环境变量

### 预览部署
每个 Pull Request 都会自动创建预览部署：
- 独立的预览 URL
- 方便测试新功能
- 不影响生产环境

---

## 费用说明

Cloudflare Pages 免费计划包括：
- ✅ 无限请求
- ✅ 无限带宽
- ✅ 500 次构建/月
- ✅ 100 个自定义域名
- ✅ 免费 SSL 证书
- ✅ 全球 CDN

对于个人项目和中小型网站，免费计划完全够用！

---

## 技术支持

如果遇到问题：

1. **查看官方文档**
   - https://developers.cloudflare.com/pages/

2. **社区论坛**
   - https://community.cloudflare.com/

3. **GitHub Issues**
   - 在项目仓库提交问题

---

## 对比其他平台

| 特性 | Cloudflare Pages | Vercel | Netlify |
|------|-----------------|--------|---------|
| 国内访问 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 免费额度 | 无限 | 100GB/月 | 100GB/月 |
| 构建速度 | 快 | 很快 | 快 |
| 自定义域名 | 免费 | 免费 | 免费 |
| 边缘函数 | 支持 | 支持 | 支持 |

---

## 下一步

部署成功后，你可以：

1. ✅ 分享网站链接
2. ✅ 配置自定义域名
3. ✅ 启用 Web Analytics
4. ✅ 设置环境变量
5. ✅ 继续开发新功能

祝你部署顺利！🎉

---

## 快速开始

**现在就开始部署：**

1. 访问：https://pages.cloudflare.com
2. 登录/注册账号
3. 点击 **Create a project**
4. 连接 GitHub
5. 选择 **rights-platform-v5** 仓库
6. 配置构建设置：
   - Build command: `pnpm install && pnpm run build`
   - Build output directory: `dist`
7. 点击 **Save and Deploy**
8. 等待部署完成
9. 访问你的网站！

整个过程只需要 **5-10 分钟**！

