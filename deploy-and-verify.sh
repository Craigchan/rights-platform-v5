#!/bin/bash

# 权益平台V5 - 本地部署验证脚本
# 用途: 构建项目并启动本地预览服务器

set -e

echo "========================================="
echo "权益平台V5 - 本地部署验证"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="/home/ubuntu/rights-platform-v5"
cd $PROJECT_DIR

echo -e "${BLUE}[1/6] 清理旧的构建文件...${NC}"
rm -rf dist
rm -rf node_modules/.vite
echo -e "${GREEN}✓ 清理完成${NC}"
echo ""

echo -e "${BLUE}[2/6] 停止现有的开发服务器...${NC}"
pkill -9 -f "vite" 2>/dev/null || true
pkill -9 -f "preview" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✓ 已停止${NC}"
echo ""

echo -e "${BLUE}[3/6] 构建生产版本...${NC}"
echo -e "${YELLOW}这可能需要1-2分钟,请耐心等待...${NC}"
pnpm build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 构建成功${NC}"
else
    echo -e "${RED}✗ 构建失败${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}[4/6] 检查构建产物...${NC}"
if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    FILE_COUNT=$(find dist -type f | wc -l)
    echo -e "${GREEN}✓ dist目录存在${NC}"
    echo "  - 大小: $DIST_SIZE"
    echo "  - 文件数: $FILE_COUNT"
else
    echo -e "${RED}✗ dist目录不存在${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}[5/6] 启动预览服务器...${NC}"
echo -e "${YELLOW}服务器将在后台运行,日志输出到 /tmp/preview.log${NC}"
nohup pnpm preview --host 0.0.0.0 --port 4173 > /tmp/preview.log 2>&1 &
PREVIEW_PID=$!
echo "  - 进程ID: $PREVIEW_PID"
sleep 5
echo ""

echo -e "${BLUE}[6/6] 验证服务器状态...${NC}"
if ps -p $PREVIEW_PID > /dev/null; then
    echo -e "${GREEN}✓ 预览服务器正在运行${NC}"
    echo ""
    echo "========================================="
    echo -e "${GREEN}部署成功!${NC}"
    echo "========================================="
    echo ""
    echo "访问地址:"
    echo "  - 本地: http://localhost:4173"
    echo "  - 公网: https://4173-ilpikexqzg8a38tyacus2-3ff747d6.manus-asia.computer"
    echo ""
    echo "查看日志:"
    echo "  tail -f /tmp/preview.log"
    echo ""
    echo "停止服务器:"
    echo "  kill $PREVIEW_PID"
    echo ""
else
    echo -e "${RED}✗ 预览服务器启动失败${NC}"
    echo "查看日志: cat /tmp/preview.log"
    exit 1
fi

# 显示最近的日志
echo "最近的服务器日志:"
echo "========================================="
tail -20 /tmp/preview.log
echo "========================================="

