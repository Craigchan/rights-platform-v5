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

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// Ant Design Vue 已自动按需引入，无需全局注册

// 注册全局指令
app.directive('lazy', lazyLoad)

// 初始化 stores
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
cartStore.init()
favoritesStore.init()

app.mount('#app')
