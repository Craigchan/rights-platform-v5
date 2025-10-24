import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Ant Design Vue 组件已通过 unplugin-vue-components 按需引入
import 'ant-design-vue/dist/reset.css'
import './style.css'
import './styles/variables.css'
import './styles/global.css'
import './styles/animations.css'
import './styles/lazy.css'
import App from './App.vue'
import router from './router'
import { useCartStore } from './stores/cart'
import { useFavoritesStore } from './stores/favorites'
import { lazyLoad } from './directives'
import { imgFallback, lazyImg } from './directives/image'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// Ant Design Vue 已自动按需引入，无需全局注册

// 注册全局指令
app.directive('lazy', lazyLoad)
app.directive('img-fallback', imgFallback)
app.directive('lazy-img', lazyImg)

// 初始化 stores
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
cartStore.init()
favoritesStore.init()

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('[Global Error]', err, info)
  // 可以在这里上报错误到监控系统
}

// 路由错误处理
router.onError((error) => {
  console.error('[Router Error]', error)
  router.push({
    name: 'Error',
    query: {
      code: '500',
      message: '路由加载失败'
    }
  })
})

app.mount('#app')
