#!/bin/bash

###############################################################################
# 图片优化脚本
# 用途: 批量优化项目中的图片资源,转换为WebP格式并压缩
# 使用: ./optimize-images.sh [source_dir] [output_dir]
###############################################################################

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 默认参数
SOURCE_DIR="${1:-public/images}"
OUTPUT_DIR="${2:-public/images-optimized}"
QUALITY=85  # WebP质量 (0-100)

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}图片优化脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "源目录: ${YELLOW}$SOURCE_DIR${NC}"
echo -e "输出目录: ${YELLOW}$OUTPUT_DIR${NC}"
echo -e "WebP质量: ${YELLOW}$QUALITY${NC}"
echo ""

# 检查依赖
check_dependencies() {
    echo -e "${YELLOW}检查依赖...${NC}"
    
    if ! command -v cwebp &> /dev/null; then
        echo -e "${RED}错误: 未找到 cwebp 工具${NC}"
        echo "请安装 webp 工具:"
        echo "  Ubuntu/Debian: sudo apt-get install webp"
        echo "  macOS: brew install webp"
        exit 1
    fi
    
    if ! command -v convert &> /dev/null; then
        echo -e "${YELLOW}警告: 未找到 ImageMagick (convert)${NC}"
        echo "建议安装以获得更好的优化效果:"
        echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
        echo "  macOS: brew install imagemagick"
    fi
    
    echo -e "${GREEN}✓ 依赖检查完成${NC}"
    echo ""
}

# 创建输出目录
prepare_output_dir() {
    if [ -d "$OUTPUT_DIR" ]; then
        echo -e "${YELLOW}输出目录已存在,将清空...${NC}"
        rm -rf "$OUTPUT_DIR"
    fi
    
    mkdir -p "$OUTPUT_DIR"
    echo -e "${GREEN}✓ 输出目录已准备${NC}"
    echo ""
}

# 优化单个图片
optimize_image() {
    local input_file="$1"
    local relative_path="${input_file#$SOURCE_DIR/}"
    local output_file="$OUTPUT_DIR/${relative_path%.*}.webp"
    local output_dir=$(dirname "$output_file")
    
    # 创建输出子目录
    mkdir -p "$output_dir"
    
    # 获取文件大小
    local original_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file")
    
    # 转换为WebP
    if cwebp -q $QUALITY "$input_file" -o "$output_file" &> /dev/null; then
        local new_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file")
        local reduction=$(( (original_size - new_size) * 100 / original_size ))
        
        echo -e "${GREEN}✓${NC} $relative_path"
        echo -e "  原始: $(numfmt --to=iec-i --suffix=B $original_size) → WebP: $(numfmt --to=iec-i --suffix=B $new_size) (减少 ${reduction}%)"
    else
        echo -e "${RED}✗${NC} $relative_path (转换失败)"
    fi
}

# 批量优化
optimize_all_images() {
    echo -e "${YELLOW}开始优化图片...${NC}"
    echo ""
    
    local count=0
    local total_original=0
    local total_optimized=0
    
    # 查找所有图片文件
    while IFS= read -r -d '' file; do
        optimize_image "$file"
        count=$((count + 1))
    done < <(find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0)
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}优化完成!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "处理文件数: ${YELLOW}$count${NC}"
    echo ""
    echo -e "优化后的图片已保存到: ${YELLOW}$OUTPUT_DIR${NC}"
    echo ""
    echo -e "${YELLOW}下一步:${NC}"
    echo "1. 检查优化后的图片质量"
    echo "2. 将图片上传到云存储(如阿里云OSS、AWS S3)"
    echo "3. 更新代码中的图片URL"
}

# 主流程
main() {
    check_dependencies
    prepare_output_dir
    optimize_all_images
}

main

