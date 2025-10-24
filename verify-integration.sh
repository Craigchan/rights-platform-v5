#!/bin/bash

# 商家推荐系统集成验证脚本
# 验证所有文件和集成是否正确

echo "========================================="
echo "商家推荐系统集成验证"
echo "========================================="
echo ""

PROJECT_DIR="/home/ubuntu/rights-platform-v5"
cd $PROJECT_DIR

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0

# 验证函数
verify_file() {
    local file=$1
    local desc=$2
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $desc"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $desc (文件不存在: $file)"
        ((FAIL++))
    fi
}

verify_content() {
    local file=$1
    local pattern=$2
    local desc=$3
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $desc"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $desc"
        ((FAIL++))
    fi
}

echo -e "${BLUE}[1] 验证核心文件存在${NC}"
echo "-----------------------------------"
verify_file "src/stores/merchant.ts" "商家Store文件"
verify_file "src/components/subsidy/MerchantRecommend.vue" "商家推荐组件"
verify_file "src/views/MerchantDetail.vue" "商家详情页"
verify_file "src/views/GovSubsidy.vue" "政府补贴主页"
verify_file "src/components/subsidy/SubsidyWizard.vue" "补贴申请向导"
echo ""

echo -e "${BLUE}[2] 验证组件导入${NC}"
echo "-----------------------------------"
verify_content "src/views/GovSubsidy.vue" "import MerchantRecommend" "GovSubsidy导入MerchantRecommend"
verify_content "src/components/subsidy/SubsidyWizard.vue" "import MerchantRecommend" "SubsidyWizard导入MerchantRecommend"
echo ""

echo -e "${BLUE}[3] 验证组件使用${NC}"
echo "-----------------------------------"
verify_content "src/views/GovSubsidy.vue" "<MerchantRecommend" "GovSubsidy使用MerchantRecommend组件"
verify_content "src/components/subsidy/SubsidyWizard.vue" "<MerchantRecommend" "SubsidyWizard使用MerchantRecommend组件"
echo ""

echo -e "${BLUE}[4] 验证Store功能${NC}"
echo "-----------------------------------"
verify_content "src/stores/merchant.ts" "recommendMerchants" "推荐算法函数"
verify_content "src/stores/merchant.ts" "calculateDistance" "距离计算函数"
verify_content "src/stores/merchant.ts" "interface Merchant" "商家接口定义"
verify_content "src/stores/merchant.ts" "interface MerchantScore" "评分接口定义"
echo ""

echo -e "${BLUE}[5] 验证商家数据${NC}"
echo "-----------------------------------"
MERCHANT_COUNT=$(grep -c "id: 'm[0-9]" src/stores/merchant.ts 2>/dev/null || echo "0")
if [ "$MERCHANT_COUNT" -ge 30 ]; then
    echo -e "${GREEN}✓${NC} 商家数据 (找到 $MERCHANT_COUNT 个商家)"
    ((PASS++))
else
    echo -e "${RED}✗${NC} 商家数据不足 (只有 $MERCHANT_COUNT 个)"
    ((FAIL++))
fi
echo ""

echo -e "${BLUE}[6] 验证路由配置${NC}"
echo "-----------------------------------"
verify_content "src/router/index.ts" "MerchantDetail" "商家详情路由"
echo ""

echo -e "${BLUE}[7] 验证文档${NC}"
echo "-----------------------------------"
verify_file "商家推荐系统集成完成报告.md" "集成完成报告"
verify_file "商家推荐系统使用指南.md" "使用指南"
verify_file "项目整体进度总结.md" "项目总结"
echo ""

echo "========================================="
echo "验证结果统计"
echo "========================================="
echo -e "通过: ${GREEN}$PASS${NC}"
echo -e "失败: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 所有验证项通过!${NC}"
    echo ""
    echo "商家推荐系统已成功集成到项目中。"
    echo ""
    echo "主要功能:"
    echo "  ✓ 智能推荐算法 (多维度评分)"
    echo "  ✓ 30+商家数据 (6大类别)"
    echo "  ✓ 政府补贴页面集成"
    echo "  ✓ 申请成功页面集成"
    echo "  ✓ 完整业务闭环"
    echo ""
    exit 0
else
    echo -e "${RED}⚠ 发现 $FAIL 个问题,请检查${NC}"
    exit 1
fi

