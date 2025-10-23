<template>
  <div class="mine-skeleton">
    <!-- 用户信息卡骨架 -->
    <div class="skeleton-card">
      <div class="user-skeleton">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-info">
          <div class="skeleton-line" style="width: 120px; height: 20px;"></div>
          <div class="skeleton-line" style="width: 100px; height: 14px; margin-top: 8px;"></div>
          <div class="skeleton-line" style="width: 80px; height: 24px; margin-top: 8px; border-radius: 12px;"></div>
        </div>
      </div>
      <div class="skeleton-progress" style="margin-top: 16px;">
        <div class="skeleton-line" style="width: 100%; height: 8px; border-radius: 4px;"></div>
      </div>
    </div>

    <!-- 快捷统计卡骨架 -->
    <div class="skeleton-card">
      <div class="stats-skeleton">
        <div class="stat-skeleton-item" v-for="i in 4" :key="i">
          <div class="skeleton-line" style="width: 40px; height: 24px;"></div>
          <div class="skeleton-line" style="width: 50px; height: 12px; margin-top: 4px;"></div>
        </div>
      </div>
    </div>

    <!-- 订单卡骨架 -->
    <div class="skeleton-card">
      <div class="skeleton-line" style="width: 80px; height: 18px; margin-bottom: 16px;"></div>
      <div class="order-skeleton">
        <div class="order-skeleton-item" v-for="i in 5" :key="i">
          <div class="skeleton-circle" style="width: 48px; height: 48px;"></div>
          <div class="skeleton-line" style="width: 40px; height: 12px; margin-top: 8px;"></div>
        </div>
      </div>
    </div>

    <!-- 功能列表骨架 -->
    <div class="skeleton-card">
      <div class="skeleton-line" style="width: 80px; height: 18px; margin-bottom: 16px;"></div>
      <div class="feature-skeleton">
        <div class="feature-skeleton-item" v-for="i in 6" :key="i">
          <div class="skeleton-line" style="width: 100%; height: 44px; border-radius: 8px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 骨架屏组件,无需逻辑
</script>

<style scoped lang="scss">
.mine-skeleton {
  padding: 12px;
  padding-bottom: 80px;
  background: #F5F5F5;
  min-height: 100vh;
}

.skeleton-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.user-skeleton {
  display: flex;
  gap: 12px;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-info {
  flex: 1;
}

.skeleton-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-circle {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 50%;
}

.stats-skeleton {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-skeleton-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.order-skeleton {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.order-skeleton-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>

