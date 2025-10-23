# Vercel 部署指南

## 项目信息

- **项目名称**: rights-platform-v3
- **GitHub 仓库**: https://github.com/Craigchan/rights-platform-v5
- **技术栈**: Vue 3 + Vite 6 + TypeScript
- **包管理器**: pnpm

---

## 部署步骤

### 1. 访问 Vercel

打开浏览器访问：https://vercel.com

### 2. 登录或注册

- 如果你已有 Vercel 账号，点击 **Log in** 登录
- 如果没有账号，点击 **Sign Up** 注册（推荐使用 GitHub 账号登录）

### 3. 导入 GitHub 项目

登录后，按以下步骤操作：

1. 点击右上角的 **Add New...** 按钮
2. 选择 **Project**
3. 在 "Import Git Repository" 页面，选择 **GitHub**
4. 如果是第一次使用，需要授权 Vercel 访问你的 GitHub 账号
5. 找到并选择 **rights-platform-v5** 仓库
6. 点击 **Import**

### 4. 配置项目

在项目配置页面，Vercel 会自动检测到这是一个 Vite 项目。确认以下配置：

#### Framework Preset
- 选择：**Vite**（应该会自动检测）

#### Root Directory
- 保持默认：`./`（项目根目录）

#### Build and Output Settings

**Build Command**（构建命令）：
```bash
pnpm run build
```

**Output Directory**（输出目录）：
```
dist
```

**Install Command**（安装命令）：
```bash
pnpm install
```

#### Environment Variables（环境变量）

如果项目需要环境变量，可以在这里添加。目前项目不需要特殊的环境变量。

### 5. 部署

1. 确认所有配置正确后，点击 **Deploy** 按钮
2. Vercel 会开始构建和部署你的项目
3. 等待几分钟，部署完成后会显示成功页面

### 6. 访问网站

部署成功后，Vercel 会为你生成一个免费的域名，格式如下：

```
https://rights-platform-v5.vercel.app
```

或者类似：

```
https://rights-platform-v5-craigchan.vercel.app
```

点击这个链接就可以访问你的网站了！

---

## 自动部署

配置完成后，每次你向 GitHub 仓库推送代码时，Vercel 都会自动重新部署：

1. 你在本地修改代码
2. 提交并推送到 GitHub
3. Vercel 自动检测到更新
4. 自动构建并部署新版本

---

## 自定义域名（可选）

如果你想使用自己的域名：

1. 在 Vercel 项目页面，点击 **Settings**
2. 选择 **Domains**
3. 输入你的域名并点击 **Add**
4. 按照提示配置 DNS 记录

---

## 常见问题

### Q: 构建失败怎么办？

A: 检查以下几点：
- 确保 Build Command 是 `pnpm run build`
- 确保 Output Directory 是 `dist`
- 查看构建日志，找到具体错误信息

### Q: 页面显示 404？

A: 这是单页应用（SPA）路由问题，需要配置重写规则。在项目根目录创建 `vercel.json`：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Q: 如何查看部署日志？

A: 在 Vercel 项目页面，点击 **Deployments**，选择具体的部署记录，可以查看详细日志。

### Q: 如何回滚到之前的版本？

A: 在 **Deployments** 页面，找到之前的成功部署，点击右侧的三个点，选择 **Promote to Production**。

---

## 项目特色功能

部署完成后，你可以访问以下页面体验优化后的功能：

### 日常抽奖大转盘

访问路径：`/#/lottery-wheel?type=daily&cost=100`

完整 URL 示例：
```
https://rights-platform-v5.vercel.app/#/lottery-wheel?type=daily&cost=100
```

**特色功能**：
- ✨ 12 条金色光芒放射效果
- 💫 反向旋转的虚线光环
- ✨ 24 个波浪式闪烁光点
- 💡 转盘呼吸发光效果
- 🎁 奖品图标浮动动画
- 🔥 增强的按钮脉冲效果
- 🎯 增强的指针弹跳效果

---

## 技术支持

如果遇到问题，可以：

1. 查看 Vercel 官方文档：https://vercel.com/docs
2. 查看项目的 README.md
3. 检查 GitHub Issues

---

## 下一步

部署成功后，你可以：

1. ✅ 分享网站链接给其他人
2. ✅ 配置自定义域名
3. ✅ 设置环境变量
4. ✅ 查看访问分析
5. ✅ 继续开发新功能

祝你部署顺利！🎉

