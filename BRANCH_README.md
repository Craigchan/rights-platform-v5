# Git 分支管理说明

## 当前分支结构

### master（主分支）
- **用途**：生产环境代码
- **状态**：稳定版本
- **最新提交**：修改附近优惠卡片跳转目标为MerchantOfferDetailEnhanced页面 (986dac4)
- **部署**：自动部署到 Cloudflare Pages

### feature/system-optimization（系统优化分支）✨ **当前分支**
- **用途**：系统进一步优化开发
- **创建时间**：2025-10-23
- **基于**：master 分支 (986dac4)
- **状态**：开发中

### feature/ux-optimization（UX优化分支）
- **用途**：用户体验优化
- **状态**：已存在（远程）

## 分支工作流程

### 1. 开发流程
```bash
# 当前已在 feature/system-optimization 分支
git status                    # 查看当前状态
git add .                     # 添加修改
git commit -m "描述"          # 提交修改
git push origin feature/system-optimization  # 推送到远程
```

### 2. 合并到主分支
```bash
# 确保优化分支是最新的
git checkout feature/system-optimization
git pull origin feature/system-optimization

# 切换到主分支并合并
git checkout master
git pull origin master
git merge feature/system-optimization
git push origin master
```

### 3. 同步主分支的更新
```bash
# 在优化分支上同步主分支的最新代码
git checkout feature/system-optimization
git merge master
git push origin feature/system-optimization
```

## 建议的优化方向

### 高优先级优化
1. **性能优化**
   - 组件懒加载
   - 图片懒加载优化
   - 路由懒加载
   - 代码分割

2. **用户体验优化**
   - 加载状态优化
   - 错误处理优化
   - 交互动画优化
   - 响应式布局优化

3. **代码质量优化**
   - TypeScript 类型完善
   - 组件复用性提升
   - 代码规范统一
   - 注释和文档完善

### 中优先级优化
4. **功能完善**
   - 创建 MerchantPayment 页面（买单功能）
   - 完善 SubsidyApplications 页面
   - 优化搜索功能
   - 完善筛选功能

5. **数据管理优化**
   - Pinia store 优化
   - API 请求优化
   - 缓存策略优化
   - 数据持久化

### 低优先级优化
6. **其他优化**
   - SEO 优化
   - 无障碍访问优化
   - 国际化支持
   - 主题切换功能

## 已完成的优化

### 2025-10-23
✅ **图片占位符功能**
- 创建图片工具函数（src/utils/image.ts）
- 创建 Vue 指令（src/directives/image.ts）
- 为 28 个页面添加图片占位符（100%覆盖率）
- 创建测试页面（ImageFallbackTest.vue）

✅ **底部导航栏优化**
- 为 7 个页面隐藏底部导航栏
- 提升沉浸式浏览体验

✅ **惠买单功能**
- 在 MerchantOfferDetailEnhanced.vue 添加惠买单区域
- 统一 UI 设计风格

✅ **路由跳转优化**
- 修复消息通知跳转 404 问题
- 修复政府补贴页面跳转
- 修改附近优惠卡片跳转目标

✅ **日常抽奖大转盘优化**
- 优化转盘视觉效果
- 添加多种酷炫动画
- 修复奖品显示问题

## 注意事项

### 开发规范
1. **提交信息规范**
   - feat: 新功能
   - fix: 修复bug
   - style: 样式修改
   - refactor: 重构
   - perf: 性能优化
   - docs: 文档更新
   - test: 测试相关

2. **代码规范**
   - 使用 TypeScript 类型
   - 遵循 Vue 3 Composition API 规范
   - 保持代码简洁清晰
   - 添加必要的注释

3. **测试规范**
   - 本地测试通过后再推送
   - 重要功能需要充分测试
   - 记录测试结果

### 分支管理
- ✅ 在 feature/system-optimization 分支进行开发
- ✅ 定期提交代码到远程仓库
- ✅ 重要功能完成后合并到 master
- ✅ 保持分支代码整洁

## 快速命令

```bash
# 查看当前分支
git branch

# 查看分支状态
git status

# 切换分支
git checkout <branch-name>

# 查看提交历史
git log --oneline

# 查看远程分支
git branch -r

# 拉取最新代码
git pull origin feature/system-optimization

# 推送代码
git push origin feature/system-optimization
```

## GitHub 链接

- **仓库地址**：https://github.com/Craigchan/rights-platform-v5
- **优化分支**：https://github.com/Craigchan/rights-platform-v5/tree/feature/system-optimization
- **创建 PR**：https://github.com/Craigchan/rights-platform-v5/pull/new/feature/system-optimization

---

**当前工作分支**：`feature/system-optimization`  
**准备就绪**：可以开始进一步优化系统 🚀

