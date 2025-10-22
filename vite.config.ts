import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Ant Design Vue 按需引入
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false // 样式在 main.ts 中全局引入
        })
      ]
    })
  ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          
          // UI 组件库
          'ant-design': ['ant-design-vue'],
          
          // 图标库
          'ant-icons': ['@ant-design/icons-vue'],
          
          // 图表库（按需加载）
          'echarts': ['echarts'],
          
          // 工具库
          'utils': ['axios', 'dayjs']
        }
      }
    },
    chunkSizeWarningLimit: 600,
    // 启用 CSS 代码分割
    cssCodeSplit: true
  }
})
