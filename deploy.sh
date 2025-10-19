#!/bin/bash

# 权益平台小程序 - 快速部署脚本
# 使用方法: bash deploy.sh

echo "=========================================="
echo "权益平台小程序 - 快速部署脚本"
echo "=========================================="
echo ""

# 检查 Node.js
echo "1. 检查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js >= 16.0.0"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"
echo ""

# 检查包管理器
echo "2. 检查包管理器..."
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo "✅ 使用 pnpm"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo "✅ 使用 npm"
else
    echo "❌ 未检测到包管理器"
    exit 1
fi
echo ""

# 安装依赖
echo "3. 安装项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖，请稍候..."
    $PKG_MANAGER install
    if [ $? -eq 0 ]; then
        echo "✅ 依赖安装成功"
    else
        echo "❌ 依赖安装失败"
        exit 1
    fi
else
    echo "✅ 依赖已存在，跳过安装"
fi
echo ""

# 构建项目
echo "4. 构建项目..."
echo "正在构建，请稍候..."
if [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm exec vite build
else
    npm run build
fi

if [ $? -eq 0 ]; then
    echo "✅ 项目构建成功"
else
    echo "❌ 项目构建失败"
    exit 1
fi
echo ""

# 检查构建结果
if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    echo "✅ 构建产物大小: $DIST_SIZE"
    echo "✅ 构建产物位置: $(pwd)/dist"
else
    echo "❌ 未找到构建产物"
    exit 1
fi
echo ""

echo "=========================================="
echo "🎉 部署准备完成！"
echo "=========================================="
echo ""
echo "下一步操作："
echo "1. 静态服务器部署: 将 dist/ 目录上传到服务器"
echo "2. 本地预览: 运行 $PKG_MANAGER preview"
echo "3. 使用部署工具: 使用 deploy_frontend 工具部署 dist/ 目录"
echo ""
echo "访问路径示例："
echo "- 首页: /"
echo "- 实名认证: /real-name-auth"
echo "- 政府补贴: /gov-subsidy"
echo "- 更多路由请查看 README.md"
echo ""

