#!/usr/bin/env node

/**
 * 图片URL批量替换脚本
 * 用途: 将代码中的本地图片路径替换为云端CDN URL
 * 使用: node replace-image-urls.js <cdn-base-url>
 * 示例: node replace-image-urls.js https://your-bucket.oss-cn-hangzhou.aliyuncs.com
 */

const fs = require('fs');
const path = require('path');

// 配置
const CDN_BASE_URL = process.argv[2] || 'https://cdn.example.com';
const SRC_DIR = path.join(__dirname, '../src');
const BACKUP_SUFFIX = '.backup';

// 需要处理的文件扩展名
const FILE_EXTENSIONS = ['.vue', '.ts', '.js', '.tsx', '.jsx'];

// 图片路径匹配正则
const IMAGE_PATH_REGEX = /(['"`])\/images\/([^'"`]+\.(jpg|jpeg|png|webp|svg))\1/gi;

console.log('========================================');
console.log('图片URL批量替换脚本');
console.log('========================================');
console.log('');
console.log(`CDN Base URL: ${CDN_BASE_URL}`);
console.log(`源代码目录: ${SRC_DIR}`);
console.log('');

// 递归查找文件
function findFiles(dir, extensions) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳过 node_modules 和 dist
        if (item !== 'node_modules' && item !== 'dist') {
          traverse(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// 替换文件中的图片URL
function replaceImageUrls(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let replacedCount = 0;
  
  const newContent = content.replace(IMAGE_PATH_REGEX, (match, quote, imagePath, ext) => {
    replacedCount++;
    // 将 .jpg/.png 替换为 .webp (如果需要)
    const optimizedPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return `${quote}${CDN_BASE_URL}/${optimizedPath}${quote}`;
  });
  
  if (replacedCount > 0) {
    // 备份原文件
    fs.copyFileSync(filePath, filePath + BACKUP_SUFFIX);
    
    // 写入新内容
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    const relativePath = path.relative(SRC_DIR, filePath);
    console.log(`✓ ${relativePath} (替换 ${replacedCount} 处)`);
    
    return replacedCount;
  }
  
  return 0;
}

// 主流程
function main() {
  if (!CDN_BASE_URL || CDN_BASE_URL === 'https://cdn.example.com') {
    console.error('错误: 请提供有效的CDN Base URL');
    console.error('使用方法: node replace-image-urls.js <cdn-base-url>');
    console.error('示例: node replace-image-urls.js https://your-bucket.oss-cn-hangzhou.aliyuncs.com');
    process.exit(1);
  }
  
  console.log('正在查找需要处理的文件...');
  const files = findFiles(SRC_DIR, FILE_EXTENSIONS);
  console.log(`找到 ${files.length} 个文件\n`);
  
  console.log('开始替换图片URL...\n');
  let totalReplacements = 0;
  let filesModified = 0;
  
  for (const file of files) {
    const count = replaceImageUrls(file);
    if (count > 0) {
      totalReplacements += count;
      filesModified++;
    }
  }
  
  console.log('');
  console.log('========================================');
  console.log('替换完成!');
  console.log('========================================');
  console.log(`修改文件数: ${filesModified}`);
  console.log(`替换总数: ${totalReplacements}`);
  console.log('');
  console.log('备份文件已创建 (*.backup)');
  console.log('');
  console.log('下一步:');
  console.log('1. 检查修改后的代码是否正确');
  console.log('2. 测试应用是否正常运行');
  console.log('3. 如果一切正常,删除备份文件: find src -name "*.backup" -delete');
  console.log('4. 提交代码到Git');
}

main();

