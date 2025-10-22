import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import viteImagemin from 'vite-plugin-imagemin'
import viteCompression from 'vite-plugin-compression'

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
    }),
    // 图片压缩
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    }),
    // Gzip 压缩
    viteCompression({
      verbose: true, // 输出压缩结果
      disable: false, // 不禁用压缩
      threshold: 10240, // 体积大于 threshold才会被压缩，单位：b，10KB
      algorithm: 'gzip', // 压缩算法
      ext: '.gz', // 生成的压缩包后缀
      deleteOriginFile: false // 压缩后是否删除源文件
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
