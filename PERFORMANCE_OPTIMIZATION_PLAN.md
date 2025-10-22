# 性能优化方案

## 🔍 性能问题分析

### 当前构建产物分析

#### 文件大小统计
```
index-BRHmHso1.js           1.5MB  (gzip: 482.83 kB)  ⚠️ 严重超标
StubAnalytics-JjNJ_cTg.js   568KB  (gzip: 196.53 kB)  ⚠️ 超标
LotteryStatistics-BawBVzGY.js 213KB (gzip: 74.86 kB)  ⚠️ 偏大
```

#### 问题识别

**核心问题**:
1. ⚠️ **index.js 过大（1.5MB）**: 包含了所有公共依赖和大量组件
2. ⚠️ **StubAnalytics 过大（568KB）**: 票根分析页面包含大量图表库
3. ⚠️ **LotteryStatistics 过大（213KB）**: 抽奖统计页面同样包含图表库
4. ⚠️ **路由懒加载不完善**: 部分组件被打包进 index.js
5. ⚠️ **第三方库未优化**: 如 ECharts、Ant Design Vue 等

**影响**:
- 首屏加载时间长（3-5秒）
- 白屏时间长
- 用户体验差
- 流量消耗大

---

## 🎯 优化目标

### 性能指标目标

| 指标 | 当前值 | 目标值 | 改进 |
|------|--------|--------|------|
| **index.js 大小** | 1.5MB | < 500KB | -67% |
| **首屏加载时间** | 3-5秒 | < 1.5秒 | -50%+ |
| **白屏时间** | 2-3秒 | < 0.8秒 | -60%+ |
| **Lighthouse 分数** | 60-70 | > 90 | +30% |

---

## 📋 优化方案

### 阶段 1: 代码分割优化（核心）

#### 1.1 手动分块（Manual Chunks）

**目标**: 将 index.js 从 1.5MB 减少到 < 500KB

**方案**: 使用 Vite 的 `manualChunks` 配置

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          
          // UI 组件库
          'ant-design': ['ant-design-vue', '@ant-design/icons-vue'],
          
          // 图表库（按需分离）
          'echarts': ['echarts'],
          
          // 工具库
          'utils': ['axios', 'dayjs', 'lodash-es']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
```

**预期效果**:
- index.js: 1.5MB → 400KB (-73%)
- vue-vendor.js: 新增 ~150KB
- ant-design.js: 新增 ~300KB
- echarts.js: 新增 ~400KB（仅在需要时加载）

#### 1.2 路由级别代码分割

**当前问题**: 部分页面组件被打包进 index.js

**优化方案**: 确保所有路由都使用动态导入

```typescript
// router/index.ts - 优化前
import Home from '../views/Home.vue'  // ❌ 静态导入

// router/index.ts - 优化后
component: () => import('../views/Home.vue')  // ✅ 动态导入
```

**需要检查的页面**:
- Home.vue
- Discover.vue
- Mine.vue
- 所有 Feed 组件

#### 1.3 组件级别代码分割

**方案**: 对大型组件使用异步组件

```vue
<script setup>
// 优化前
import HeavyComponent from './HeavyComponent.vue'  // ❌

// 优化后
const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')  // ✅
)
</script>
```

**适用组件**:
- CheckoutModal (大型弹窗)
- 图表组件
- 地图组件

---

### 阶段 2: 第三方库优化

#### 2.1 ECharts 按需引入

**当前问题**: 完整引入 ECharts（~400KB）

**优化方案**: 按需引入需要的组件

```javascript
// 优化前
import * as echarts from 'echarts'  // ❌ 完整引入

// 优化后
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart, LineChart, PieChart,
  GridComponent, TooltipComponent, LegendComponent,
  CanvasRenderer
])
```

**预期效果**: ECharts 体积减少 50%+

#### 2.2 Ant Design Vue 按需引入

**检查**: 确保使用了按需引入插件

```javascript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [AntDesignVueResolver()]
    })
  ]
})
```

#### 2.3 Lodash 优化

**优化方案**: 使用 lodash-es 并按需引入

```javascript
// 优化前
import _ from 'lodash'  // ❌ 完整引入

// 优化后
import debounce from 'lodash-es/debounce'  // ✅ 按需引入
import throttle from 'lodash-es/throttle'
```

---

### 阶段 3: 图片优化

#### 3.1 图片压缩

**方案**: 使用 vite-plugin-imagemin

```javascript
// vite.config.ts
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false }
        ]
      }
    })
  ]
})
```

#### 3.2 图片懒加载

**方案**: 使用 Intersection Observer API

```vue
<template>
  <img
    v-lazy="imageSrc"
    alt="商品图片"
  />
</template>

<script setup>
import { directive as vLazy } from 'vue3-lazy'
</script>
```

**或使用自定义指令**:

```typescript
// directives/lazy.ts
export const lazyLoad = {
  mounted(el: HTMLImageElement, binding: any) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.src = binding.value
          observer.unobserve(el)
        }
      })
    })
    observer.observe(el)
  }
}
```

#### 3.3 使用 WebP 格式

**方案**: 提供 WebP 格式图片，降级到 JPG/PNG

```vue
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="商品图片">
</picture>
```

---

### 阶段 4: 构建优化

#### 4.1 启用 Gzip 压缩

```javascript
// vite.config.ts
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,  // 10KB 以上才压缩
      deleteOriginFile: false
    })
  ]
})
```

#### 4.2 启用 Brotli 压缩（可选）

```javascript
viteCompression({
  algorithm: 'brotliCompress',
  ext: '.br',
  threshold: 10240
})
```

#### 4.3 CSS 代码分割

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    cssCodeSplit: true  // 启用 CSS 代码分割
  }
})
```

---

### 阶段 5: 运行时优化

#### 5.1 路由懒加载 + 预加载

```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    component: () => import(
      /* webpackChunkName: "home" */
      /* webpackPrefetch: true */
      '../views/Home.vue'
    )
  }
]
```

#### 5.2 组件预加载

```typescript
// 在首页空闲时预加载常用组件
import { onMounted } from 'vue'

onMounted(() => {
  // 空闲时预加载
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('../components/ProductCard.vue')
      import('../components/CheckoutModal.vue')
    })
  }
})
```

#### 5.3 虚拟滚动（长列表）

**适用场景**: 商品列表、订单列表

```vue
<template>
  <RecycleScroller
    :items="products"
    :item-size="120"
    key-field="id"
  >
    <template #default="{ item }">
      <ProductCard :product="item" />
    </template>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
</script>
```

---

## 📊 实施计划

### 第一天：代码分割（核心）

**上午（4小时）**:
1. ✅ 配置 manualChunks（1小时）
2. ✅ 检查并修复路由懒加载（1小时）
3. ✅ 优化大型组件为异步组件（2小时）

**下午（4小时）**:
4. ✅ ECharts 按需引入（2小时）
5. ✅ 检查 Ant Design Vue 按需引入（1小时）
6. ✅ Lodash 优化（1小时）

**预期成果**:
- index.js: 1.5MB → 400KB
- 首屏加载时间: 3-5秒 → 1.5-2秒

---

### 第二天：图片和构建优化

**上午（4小时）**:
1. ✅ 安装并配置图片压缩插件（1小时）
2. ✅ 实现图片懒加载指令（2小时）
3. ✅ 应用懒加载到主要页面（1小时）

**下午（4小时）**:
4. ✅ 启用 Gzip 压缩（1小时）
5. ✅ CSS 代码分割（1小时）
6. ✅ 测试和调优（2小时）

**预期成果**:
- 图片体积减少 40%+
- 传输体积减少 60%+（Gzip）
- 首屏加载时间: 1.5-2秒 → < 1.5秒

---

### 第三天：运行时优化和测试

**上午（4小时）**:
1. ✅ 配置路由预加载（1小时）
2. ✅ 实现组件预加载（1小时）
3. ✅ 长列表虚拟滚动（2小时）

**下午（4小时）**:
4. ✅ 完整性能测试（2小时）
5. ✅ Lighthouse 测试（1小时）
6. ✅ 优化调整（1小时）

**预期成果**:
- Lighthouse 分数 > 90
- 首屏加载时间 < 1.5秒
- 白屏时间 < 0.8秒

---

## 🧪 测试方案

### 性能测试工具

#### 1. Lighthouse
```bash
# Chrome DevTools > Lighthouse
# 测试指标：Performance, Accessibility, Best Practices, SEO
```

#### 2. WebPageTest
```
https://www.webpagetest.org/
# 测试真实网络环境下的加载性能
```

#### 3. Bundle Analyzer
```bash
npm install -D rollup-plugin-visualizer
# 分析打包产物
```

### 测试指标

| 指标 | 优化前 | 目标 | 实际 |
|------|--------|------|------|
| First Contentful Paint (FCP) | 2.5s | < 1.0s | - |
| Largest Contentful Paint (LCP) | 4.0s | < 2.5s | - |
| Time to Interactive (TTI) | 5.0s | < 3.0s | - |
| Total Blocking Time (TBT) | 800ms | < 300ms | - |
| Cumulative Layout Shift (CLS) | 0.15 | < 0.1 | - |
| Speed Index | 3.5s | < 2.0s | - |

---

## 📁 需要修改的文件

### 配置文件
1. ✅ `vite.config.ts` - 添加代码分割、压缩等配置
2. ✅ `package.json` - 添加性能优化相关依赖

### 代码文件
3. ✅ `src/router/index.ts` - 检查路由懒加载
4. ✅ `src/views/*.vue` - 优化大型组件
5. ✅ 图表相关组件 - ECharts 按需引入
6. ✅ `src/directives/lazy.ts` - 图片懒加载指令

### 新增依赖
```json
{
  "devDependencies": {
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-imagemin": "^0.6.1",
    "rollup-plugin-visualizer": "^5.9.2",
    "unplugin-vue-components": "^0.25.2"
  },
  "dependencies": {
    "vue3-lazy": "^1.0.0",
    "vue-virtual-scroller": "^2.0.0-beta.8"
  }
}
```

---

## 🎯 预期效果

### 文件大小对比

| 文件 | 优化前 | 优化后 | 改进 |
|------|--------|--------|------|
| index.js | 1.5MB | 400KB | -73% |
| vue-vendor.js | - | 150KB | 新增 |
| ant-design.js | - | 300KB | 新增 |
| echarts.js | - | 200KB | 按需加载 |
| 总体积（首屏） | 1.5MB | 850KB | -43% |
| Gzip 后 | 483KB | 250KB | -48% |

### 性能指标对比

| 指标 | 优化前 | 优化后 | 改进 |
|------|--------|--------|------|
| 首屏加载时间 | 3-5秒 | < 1.5秒 | -60%+ |
| 白屏时间 | 2-3秒 | < 0.8秒 | -65%+ |
| FCP | 2.5s | < 1.0s | -60% |
| LCP | 4.0s | < 2.5s | -38% |
| TTI | 5.0s | < 3.0s | -40% |
| Lighthouse | 60-70 | > 90 | +30% |

### 用户体验提升

- ✅ 首屏加载更快，减少用户等待
- ✅ 白屏时间更短，减少用户流失
- ✅ 交互更流畅，提升用户满意度
- ✅ 流量消耗更少，节省用户成本

---

## 💡 后续优化建议

### 短期（1-2周）
1. **CDN 部署**: 使用 CDN 加速静态资源
2. **HTTP/2**: 启用 HTTP/2 多路复用
3. **Service Worker**: 离线缓存和预缓存

### 中期（1-2月）
1. **SSR/SSG**: 服务端渲染或静态生成
2. **骨架屏**: 优化加载体验
3. **PWA**: 渐进式 Web 应用

### 长期（3-6月）
1. **性能监控**: 实时性能监控系统
2. **自动化测试**: 性能回归测试
3. **持续优化**: 基于数据持续优化

---

## 🎉 总结

### 优化重点
1. **代码分割** - 最重要，影响最大
2. **第三方库优化** - 减少不必要的依赖
3. **图片优化** - 减少传输体积
4. **构建优化** - Gzip/Brotli 压缩
5. **运行时优化** - 懒加载、预加载

### 预期收益
- **首屏加载时间减少 60%+**
- **白屏时间减少 65%+**
- **Lighthouse 分数提升 30%+**
- **用户体验显著提升**

### 实施时间
- **总计**: 2-3 天
- **第一天**: 代码分割（核心）
- **第二天**: 图片和构建优化
- **第三天**: 运行时优化和测试

---

**准备开始实施？**

