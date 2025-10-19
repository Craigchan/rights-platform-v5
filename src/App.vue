<template>
  <div id="app" :class="{ 'no-tabbar': hideTabBar }">
    <router-view />
    <TabBar />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from './components/TabBar.vue'

const route = useRoute()
const hideTabBar = computed(() => route.meta.hideTabBar === true)
</script>

<style scoped>
#app {
  padding-bottom: 60px;
}

#app.no-tabbar {
  padding-bottom: 0;
}
</style>
