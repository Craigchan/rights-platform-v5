# 图片替换实施指南

本文档提供了将"权益平台"项目中的图片资源从本地静态管理迁移到云端动态管理的完整实施指南。

---

## 📋 目录

1. [快速开始](#快速开始)
2. [详细步骤](#详细步骤)
3. [工具脚本使用](#工具脚本使用)
4. [云存储服务配置](#云存储服务配置)
5. [常见问题](#常见问题)

---

## 🚀 快速开始

### 前置条件

- 已选择云存储服务商(推荐: 阿里云OSS、AWS S3、Cloudflare R2)
- 已准备好真实图片资源
- 已安装 `webp` 工具(用于图片优化)

### 快速流程

```bash
# 1. 优化图片
./scripts/optimize-images.sh public/images public/images-optimized

# 2. 上传优化后的图片到云存储
# (使用云服务商提供的CLI工具或Web控制台)

# 3. 批量替换代码中的图片URL
node scripts/replace-image-urls.js https://your-cdn-domain.com

# 4. 测试应用
pnpm dev

# 5. 提交代码
git add .
git commit -m "Replace local images with CDN URLs"
git push
```

---

## 📖 详细步骤

### 步骤1: 准备真实图片资源

根据项目需求,您需要准备以下类型的图片:

| 图片类型 | 数量估算 | 推荐尺寸 | 推荐来源 |
|---------|---------|---------|---------|
| **活动横幅** | 10-20张 | 750x400 (移动端)<br>1920x600 (桌面端) | AI生成 (Midjourney, DALL-E)<br>免费图库 (Unsplash, Pexels) |
| **商品图片** | 50-200张 | 600x600 (主图)<br>200x200 (缩略图) | 品牌官网<br>供应商提供<br>自行拍摄 |
| **分类图标** | 10-20个 | 64x64 (SVG优先) | 开源图标库 (Feather Icons)<br>付费图标库 (IconFinder) |
| **用户头像** | 20-50张 | 96x96 | AI生成 (thispersondoesnotexist.com) |
| **活动图片** | 20-50张 | 400x300 (卡片)<br>800x600 (详情) | AI生成<br>免费图库 |

**重要提示**:
- 确保所有图片都有**合法的使用授权**,避免版权纠纷
- 图片命名应**语义化**,如 `spring-festival-banner.jpg` 而非 `IMG_001.jpg`
- 按类别组织图片,便于管理

### 步骤2: 优化图片

使用提供的优化脚本将图片转换为WebP格式并压缩:

```bash
# 基本用法
./scripts/optimize-images.sh

# 指定源目录和输出目录
./scripts/optimize-images.sh public/images public/images-optimized

# 查看帮助
./scripts/optimize-images.sh --help
```

**脚本功能**:
- ✅ 自动将 JPG/PNG 转换为 WebP 格式
- ✅ 压缩图片,减小体积 30%-80%
- ✅ 保持目录结构
- ✅ 显示优化前后的体积对比

**输出示例**:
```
✓ banners/new-user-promo.jpg
  原始: 2.3 MiB → WebP: 456 KiB (减少 80%)
✓ products/smart-cooker.png
  原始: 1.8 MiB → WebP: 320 KiB (减少 82%)
```

### 步骤3: 上传图片到云存储

#### 选项A: 阿里云OSS (推荐国内用户)

**1. 安装阿里云CLI**
```bash
# macOS
brew install aliyun-cli

# Linux
wget https://aliyuncli.alicdn.com/aliyun-cli-linux-latest-amd64.tgz
tar -xzf aliyun-cli-linux-latest-amd64.tgz
sudo mv aliyun /usr/local/bin/
```

**2. 配置访问凭证**
```bash
aliyun configure
# 输入 Access Key ID 和 Access Key Secret
```

**3. 批量上传**
```bash
# 上传整个目录
aliyun oss cp -r public/images-optimized/ oss://your-bucket-name/ --update

# 设置公共读权限
aliyun oss set-acl oss://your-bucket-name/ public-read
```

**4. 获取CDN域名**
- 登录阿里云控制台
- 进入OSS管理 → 选择Bucket → 域名管理
- 绑定自定义域名或使用默认域名
- 示例: `https://your-bucket.oss-cn-hangzhou.aliyuncs.com`

#### 选项B: AWS S3 + CloudFront

**1. 安装AWS CLI**
```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**2. 配置访问凭证**
```bash
aws configure
# 输入 Access Key ID, Secret Access Key, Region
```

**3. 创建S3 Bucket**
```bash
aws s3 mb s3://rights-platform-images --region us-east-1
```

**4. 批量上传**
```bash
aws s3 sync public/images-optimized/ s3://rights-platform-images/ --acl public-read
```

**5. 配置CloudFront CDN**
- 登录AWS控制台
- 创建CloudFront分发
- 源域名选择S3 Bucket
- 获取CloudFront域名,如 `https://d1234abcd.cloudfront.net`

#### 选项C: Cloudflare R2 (性价比最高)

**1. 安装Wrangler CLI**
```bash
npm install -g wrangler
```

**2. 登录Cloudflare**
```bash
wrangler login
```

**3. 创建R2 Bucket**
```bash
wrangler r2 bucket create rights-platform-images
```

**4. 批量上传**
```bash
# 需要使用S3兼容API或Web控制台上传
```

### 步骤4: 批量替换代码中的图片URL

使用提供的脚本自动替换所有图片路径:

```bash
# 基本用法
node scripts/replace-image-urls.js https://your-cdn-domain.com

# 示例
node scripts/replace-image-urls.js https://rights-platform.oss-cn-hangzhou.aliyuncs.com
```

**脚本功能**:
- ✅ 自动查找所有 `.vue`, `.ts`, `.js` 文件
- ✅ 将本地路径 `/images/xxx.jpg` 替换为 CDN URL
- ✅ 自动将 `.jpg/.png` 替换为 `.webp`
- ✅ 创建备份文件 (*.backup)

**替换示例**:

**替换前**:
```typescript
image: '/images/products/smart-cooker.jpg'
```

**替换后**:
```typescript
image: 'https://rights-platform.oss-cn-hangzhou.aliyuncs.com/products/smart-cooker.webp'
```

### 步骤5: 测试应用

```bash
# 启动开发服务器
pnpm dev

# 在浏览器中访问
# 检查所有图片是否正常显示
# 打开浏览器开发者工具,检查Network面板,确认图片从CDN加载
```

**检查清单**:
- [ ] 首页轮播图正常显示
- [ ] 商品图片正常显示
- [ ] 活动图片正常显示
- [ ] 分类图标正常显示
- [ ] 用户头像正常显示
- [ ] 图片加载速度快
- [ ] 无404错误

### 步骤6: 清理和提交

```bash
# 如果一切正常,删除备份文件
find src -name "*.backup" -delete

# 删除本地图片资源(可选,建议保留一份备份)
# rm -rf public/images

# 提交代码
git add .
git commit -m "feat: Replace local images with CDN URLs and optimize to WebP format"
git push origin feature/ux-optimization
```

---

## 🛠️ 工具脚本使用

### optimize-images.sh

**用途**: 批量优化图片,转换为WebP格式

**依赖**:
```bash
# Ubuntu/Debian
sudo apt-get install webp imagemagick

# macOS
brew install webp imagemagick
```

**使用方法**:
```bash
# 基本用法
./scripts/optimize-images.sh

# 自定义参数
./scripts/optimize-images.sh [源目录] [输出目录]

# 示例
./scripts/optimize-images.sh public/images public/images-optimized
```

**参数说明**:
- 源目录: 包含原始图片的目录 (默认: `public/images`)
- 输出目录: 优化后图片的保存目录 (默认: `public/images-optimized`)

### replace-image-urls.js

**用途**: 批量替换代码中的图片URL

**使用方法**:
```bash
# 基本用法
node scripts/replace-image-urls.js <CDN-Base-URL>

# 示例
node scripts/replace-image-urls.js https://cdn.example.com
```

**注意事项**:
- 脚本会自动创建 `.backup` 备份文件
- 替换前请确保已提交当前代码到Git
- 替换后务必测试应用是否正常运行

### image-config.example.json

**用途**: 图片管理配置文件示例

**使用方法**:
```bash
# 复制示例配置
cp scripts/image-config.example.json scripts/image-config.json

# 编辑配置
vim scripts/image-config.json
```

**配置说明**:
- `cdn.baseUrl`: CDN基础URL
- `optimization.quality`: WebP压缩质量 (0-100)
- `categories`: 各类图片的尺寸规范

---

## ☁️ 云存储服务配置

### 阿里云OSS

**优势**:
- ✅ 国内访问速度快
- ✅ 价格实惠
- ✅ 提供图片处理服务

**定价** (按量付费):
- 存储: ¥0.12/GB/月
- 流量: ¥0.50/GB (CDN回源)
- 请求: ¥0.01/万次

**配置步骤**:
1. 登录 https://oss.console.aliyun.com
2. 创建Bucket,选择区域(如 `oss-cn-hangzhou`)
3. 设置读写权限为"公共读"
4. 绑定自定义域名(可选)
5. 开启CDN加速(推荐)

### AWS S3 + CloudFront

**优势**:
- ✅ 全球覆盖
- ✅ 稳定可靠
- ✅ 生态完善

**定价** (按量付费):
- 存储: $0.023/GB/月
- 流量: $0.09/GB (前10TB)
- 请求: $0.005/千次

**配置步骤**:
1. 登录 https://console.aws.amazon.com
2. 创建S3 Bucket
3. 设置Bucket策略允许公共读
4. 创建CloudFront分发
5. 配置HTTPS和自定义域名

### Cloudflare R2

**优势**:
- ✅ 无出口流量费用
- ✅ 性价比最高
- ✅ 全球CDN免费

**定价**:
- 存储: $0.015/GB/月
- 流量: **免费**
- 请求: $0.36/百万次

**配置步骤**:
1. 登录 https://dash.cloudflare.com
2. 创建R2 Bucket
3. 配置公共访问
4. 绑定自定义域名
5. 自动使用Cloudflare CDN

---

## ❓ 常见问题

### Q1: 图片优化后质量下降明显怎么办?

**A**: 调整WebP压缩质量参数。编辑 `scripts/optimize-images.sh`,将 `QUALITY=85` 改为 `QUALITY=90` 或更高。

### Q2: 如何为不同屏幕尺寸提供不同分辨率的图片?

**A**: 使用响应式图片技术。在上传时为每张图片生成多个尺寸,然后在代码中使用 `srcset` 属性:

```html
<img 
  src="https://cdn.example.com/product-600w.webp"
  srcset="
    https://cdn.example.com/product-400w.webp 400w,
    https://cdn.example.com/product-800w.webp 800w,
    https://cdn.example.com/product-1200w.webp 1200w
  "
  sizes="(max-width: 600px) 400px, 800px"
  alt="商品图片"
/>
```

### Q3: 云存储费用会很高吗?

**A**: 对于中小型项目,费用非常低。以阿里云OSS为例:
- 存储1000张图片(每张500KB) = 500MB ≈ ¥0.06/月
- 每月10万次访问,流量50GB ≈ ¥25/月
- **总计约 ¥25/月**

### Q4: 如何回滚到本地图片?

**A**: 如果需要回滚:
```bash
# 恢复备份文件
find src -name "*.backup" -exec sh -c 'mv "$1" "${1%.backup}"' _ {} \;

# 或者从Git恢复
git checkout HEAD -- src/
```

### Q5: 图片加载失败怎么办?

**A**: 
1. 检查CDN URL是否正确
2. 检查云存储Bucket权限是否设置为"公共读"
3. 检查图片文件名是否匹配(注意大小写)
4. 在浏览器开发者工具Network面板查看具体错误

### Q6: 如何实现图片懒加载?

**A**: 使用原生 `loading="lazy"` 属性:

```html
<img src="https://cdn.example.com/image.webp" loading="lazy" alt="..." />
```

或使用Vue组件库如 `vue-lazyload`:

```bash
pnpm add vue-lazyload
```

### Q7: 需要支持老浏览器不支持WebP怎么办?

**A**: 使用 `<picture>` 标签提供降级方案:

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="...">
</picture>
```

---

## 📚 参考资源

- [WebP官方文档](https://developers.google.com/speed/webp)
- [阿里云OSS文档](https://help.aliyun.com/product/31815.html)
- [AWS S3文档](https://docs.aws.amazon.com/s3/)
- [Cloudflare R2文档](https://developers.cloudflare.com/r2/)
- [响应式图片指南](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

---

**文档维护**: Manus AI  
**最后更新**: 2025年10月19日  
**版本**: v1.0

