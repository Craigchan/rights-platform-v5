<template>
  <div class="page-skeleton">
    <!-- 商品列表骨架屏 -->
    <div v-if="type === 'product-list'" class="product-list-skeleton">
      <div v-for="i in count" :key="i" class="product-skeleton-item">
        <a-skeleton-image class="product-image" />
        <div class="product-info">
          <a-skeleton :paragraph="{ rows: 2 }" active />
        </div>
      </div>
    </div>

    <!-- 商品详情骨架屏 -->
    <div v-else-if="type === 'product-detail'" class="product-detail-skeleton">
      <a-skeleton-image class="detail-banner" />
      <div class="detail-content">
        <a-skeleton active :paragraph="{ rows: 4 }" />
        <a-skeleton active :paragraph="{ rows: 3 }" />
      </div>
    </div>

    <!-- 列表骨架屏 -->
    <div v-else-if="type === 'list'" class="list-skeleton">
      <div v-for="i in count" :key="i" class="list-skeleton-item">
        <a-skeleton active :paragraph="{ rows: 2 }" />
      </div>
    </div>

    <!-- 卡片列表骨架屏 -->
    <div v-else-if="type === 'card-list'" class="card-list-skeleton">
      <div v-for="i in count" :key="i" class="card-skeleton-item">
        <a-skeleton-image class="card-image" />
        <div class="card-content">
          <a-skeleton active :paragraph="{ rows: 2 }" />
        </div>
      </div>
    </div>

    <!-- 商家详情骨架屏 -->
    <div v-else-if="type === 'merchant-detail'" class="merchant-detail-skeleton">
      <a-skeleton-image class="merchant-banner" />
      <div class="merchant-info-skeleton">
        <a-skeleton active :paragraph="{ rows: 3 }" />
      </div>
      <div class="merchant-products-skeleton">
        <div v-for="i in 4" :key="i" class="merchant-product-item">
          <a-skeleton-image class="product-image-small" />
          <a-skeleton active :paragraph="{ rows: 1 }" />
        </div>
      </div>
    </div>

    <!-- 赛事日历骨架屏 -->
    <div v-else-if="type === 'calendar'" class="calendar-skeleton">
      <a-skeleton-image class="calendar-header" />
      <div class="calendar-list">
        <div v-for="i in count" :key="i" class="calendar-item-skeleton">
          <a-skeleton active :paragraph="{ rows: 2 }" />
        </div>
      </div>
    </div>

    <!-- 默认骨架屏 -->
    <div v-else class="default-skeleton">
      <a-skeleton active :paragraph="{ rows: 6 }" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'product-list' | 'product-detail' | 'list' | 'card-list' | 'merchant-detail' | 'calendar' | 'default'
  count?: number
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  count: 3
})
</script>

<style scoped lang="scss">
.page-skeleton {
  padding: 16px;
  background: #fff;
}

// 商品列表骨架屏
.product-list-skeleton {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .product-skeleton-item {
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;

    .product-image {
      width: 100%;
      height: 150px;
    }

    .product-info {
      padding: 12px;
    }
  }
}

// 商品详情骨架屏
.product-detail-skeleton {
  .detail-banner {
    width: 100%;
    height: 300px;
    margin-bottom: 16px;
  }

  .detail-content {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

// 列表骨架屏
.list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .list-skeleton-item {
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
  }
}

// 卡片列表骨架屏
.card-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .card-skeleton-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;

    .card-image {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;
    }
  }
}

// 商家详情骨架屏
.merchant-detail-skeleton {
  .merchant-banner {
    width: 100%;
    height: 250px;
    margin-bottom: 16px;
  }

  .merchant-info-skeleton {
    padding: 16px;
    margin-bottom: 16px;
  }

  .merchant-products-skeleton {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 16px;

    .merchant-product-item {
      .product-image-small {
        width: 100%;
        height: 120px;
        margin-bottom: 8px;
      }
    }
  }
}

// 赛事日历骨架屏
.calendar-skeleton {
  .calendar-header {
    width: 100%;
    height: 60px;
    margin-bottom: 16px;
  }

  .calendar-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .calendar-item-skeleton {
      padding: 16px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
    }
  }
}

// 默认骨架屏
.default-skeleton {
  padding: 16px;
}
</style>

