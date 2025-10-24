<template>
  <div class="test-page">
    <div class="header">
      <h1>图片占位符功能测试页面</h1>
      <p>此页面用于测试 v-img-fallback 和 v-lazy-img 指令的功能</p>
    </div>

    <div class="test-section">
      <h2>测试1: v-img-fallback 指令（无效图片URL）</h2>
      <div class="test-grid">
        <div class="test-item">
          <h3>无效URL - 应显示占位图</h3>
          <img 
            v-img-fallback 
            src="https://invalid-url-test-123456.com/image1.jpg" 
            alt="测试图片1"
            style="width: 300px; height: 200px; border: 1px solid #ddd;"
          />
        </div>

        <div class="test-item">
          <h3>另一个无效URL - 应显示占位图</h3>
          <img 
            v-img-fallback 
            src="https://example-fake-domain-999.com/image2.jpg" 
            alt="测试图片2"
            style="width: 300px; height: 200px; border: 1px solid #ddd;"
          />
        </div>

        <div class="test-item">
          <h3>有效URL - 应正常显示</h3>
          <img 
            v-img-fallback 
            src="https://picsum.photos/300/200?random=1" 
            alt="测试图片3"
            style="width: 300px; height: 200px; border: 1px solid #ddd;"
          />
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>测试2: v-lazy-img 指令（懒加载）</h2>
      <div class="test-grid">
        <div class="test-item" v-for="i in 6" :key="i">
          <h3>懒加载图片 {{ i }}</h3>
          <img 
            v-lazy-img="`https://picsum.photos/300/200?random=${i + 10}`"
            alt="`懒加载测试图片${i}`"
            style="width: 300px; height: 200px; border: 1px solid #ddd;"
          />
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>测试3: 灰色占位图</h2>
      <div class="test-grid">
        <div class="test-item">
          <h3>灰色占位图</h3>
          <img 
            v-img-fallback:gray 
            src="https://invalid-gray-test.com/image.jpg" 
            alt="灰色占位图测试"
            style="width: 300px; height: 200px; border: 1px solid #ddd;"
          />
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>测试4: 不同尺寸的占位图</h2>
      <div class="test-grid">
        <div class="test-item">
          <h3>400x300</h3>
          <img 
            v-img-fallback 
            src="https://invalid-size-test-1.com/image.jpg" 
            alt="尺寸测试1"
            style="width: 400px; height: 300px; border: 1px solid #ddd;"
          />
        </div>

        <div class="test-item">
          <h3>200x200</h3>
          <img 
            v-img-fallback 
            src="https://invalid-size-test-2.com/image.jpg" 
            alt="尺寸测试2"
            style="width: 200px; height: 200px; border: 1px solid #ddd;"
          />
        </div>

        <div class="test-item">
          <h3>600x400</h3>
          <img 
            v-img-fallback 
            src="https://invalid-size-test-3.com/image.jpg" 
            alt="尺寸测试3"
            style="width: 600px; height: 400px; border: 1px solid #ddd;"
          />
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>测试结果说明</h2>
      <ul class="test-notes">
        <li>✅ 无效URL的图片应该显示 Picsum Photos 的随机占位图</li>
        <li>✅ 同一个无效URL应该总是显示相同的占位图（使用URL hash作为seed）</li>
        <li>✅ 有效URL的图片应该正常显示</li>
        <li>✅ 懒加载图片应该在滚动到可视区域时才加载</li>
        <li>✅ 灰色占位图应该显示纯灰色背景</li>
        <li>✅ 占位图的尺寸应该与img标签的尺寸匹配</li>
      </ul>
    </div>

    <div class="test-section">
      <h2>控制台检查</h2>
      <a-button type="primary" @click="checkImages">检查所有图片状态</a-button>
      <pre class="console-output">{{ consoleOutput }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const consoleOutput = ref('')

const checkImages = () => {
  const images = document.querySelectorAll('img')
  const result: any[] = []
  
  images.forEach((img, index) => {
    result.push({
      序号: index + 1,
      alt: img.alt,
      src: img.src.substring(0, 60) + '...',
      width: img.width,
      height: img.height,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    })
  })
  
  consoleOutput.value = JSON.stringify(result, null, 2)
  console.table(result)
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.test-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.test-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 10px;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.test-item {
  border: 1px solid #e8e8e8;
  padding: 15px;
  border-radius: 4px;
  background: #fafafa;
}

.test-item h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}

.test-item img {
  display: block;
  object-fit: cover;
}

.test-notes {
  list-style: none;
  padding: 0;
  margin: 0;
}

.test-notes li {
  padding: 10px 15px;
  margin-bottom: 10px;
  background: #f0f9ff;
  border-left: 3px solid #1890ff;
  border-radius: 4px;
}

.console-output {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 4px;
  margin-top: 15px;
  max-height: 400px;
  overflow: auto;
  font-size: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
}
</style>

