import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import './styles/variables.css'
import './styles/global.css'
import './styles/animations.css'
import App from './App.vue'
import router from './router'
import { useCartStore } from './stores/cart'
import { useFavoritesStore } from './stores/favorites'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)

// 初始化 stores
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
cartStore.init()
favoritesStore.init()

app.mount('#app')
