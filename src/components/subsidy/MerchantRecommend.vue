<template>
  <div class="merchant-recommend">
    <div class="recommend-header">
      <ShopOutlined class="header-icon" />
      <div class="header-content">
        <span class="header-title">推荐商家</span>
        <span class="header-subtitle">根据您的补贴类型智能推荐</span>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <a-spin />
      <span class="loading-text">正在加载推荐商家...</span>
    </div>

    <div v-else-if="recommendedMerchants.length === 0" class="empty-state">
      <InboxOutlined class="empty-icon" />
      <div class="empty-text">暂无推荐商家</div>
      <div class="empty-hint">该补贴类型暂无合作商家</div>
    </div>

    <div v-else class="merchant-list">
      <div 
        v-for="item in recommendedMerchants" 
        :key="item.merchant.id"
        class="merchant-card"
        @click="goToMerchantDetail(item.merchant.id)"
      >
        <div class="merchant-logo">
          <img :src="item.merchant.logo" :alt="item.merchant.name" />
        </div>
        
        <div class="merchant-info">
          <div class="merchant-name">{{ item.merchant.name }}</div>
          
          <div class="merchant-rating">
            <a-rate 
              :value="item.merchant.rating" 
              disabled 
              allow-half 
              class="rating-stars"
            />
            <span class="rating-text">{{ item.merchant.rating }}</span>
            <span class="review-count">({{ item.merchant.reviewCount }}条)</span>
          </div>
          
          <div class="merchant-tags">
            <a-tag 
              v-for="tag in item.merchant.tags.slice(0, 3)" 
              :key="tag" 
              color="blue"
              class="tag-item"
            >
              {{ tag }}
            </a-tag>
          </div>
          
          <div class="merchant-meta">
            <div class="meta-item">
              <EnvironmentOutlined class="meta-icon" />
              <span>{{ formatDistance(item.merchant.distance) }}</span>
            </div>
            <div class="meta-item discount">
              <GiftOutlined class="meta-icon" />
              <span>优惠{{ item.merchant.discountRate }}%</span>
            </div>
          </div>
        </div>
        
        <div class="recommend-score">
          <div class="score-value">{{ item.totalScore }}</div>
          <div class="score-label">推荐分</div>
          <div class="score-detail">
            <div class="score-item">
              <span class="score-name">距离</span>
              <span class="score-num">{{ item.distanceScore }}</span>
            </div>
            <div class="score-item">
              <span class="score-name">质量</span>
              <span class="score-num">{{ item.qualityScore }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMerchantStore } from '@/stores/merchant'
import type { SubsidyType } from '@/stores/subsidy'
import { 
  ShopOutlined, 
  EnvironmentOutlined, 
  GiftOutlined,
  InboxOutlined 
} from '@ant-design/icons-vue'

const props = withDefaults(
  defineProps<{
    subsidyType: SubsidyType
    limit?: number
  }>(),
  {
    limit: 5
  }
)

const router = useRouter()
const merchantStore = useMerchantStore()
const loading = ref(true)

const recommendedMerchants = computed(() => {
  return merchantStore.recommendMerchants(props.subsidyType, props.limit)
})

const formatDistance = (distance?: number): string => {
  return merchantStore.formatDistance(distance)
}

const goToMerchantDetail = (id: string) => {
  router.push(`/merchant-detail?id=${id}`)
}

onMounted(async () => {
  // 模拟加载延迟
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped lang="scss">
.merchant-recommend {
  margin: 16px 0;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.recommend-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;

  .header-icon {
    font-size: 22px;
    color: #1890ff;
    margin-right: 10px;
  }

  .header-content {
    display: flex;
    flex-direction: column;
  }

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #262626;
    line-height: 1.4;
  }

  .header-subtitle {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 2px;
  }
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #8c8c8c;

  .loading-text {
    margin-top: 12px;
    font-size: 14px;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    color: #d9d9d9;
  }

  .empty-text {
    font-size: 14px;
    margin-bottom: 6px;
    color: #595959;
  }

  .empty-hint {
    font-size: 12px;
    color: #bfbfbf;
  }
}

.merchant-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.merchant-card {
  display: flex;
  align-items: center;
  padding: 14px;
  background: linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &:hover {
    background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.15);
    border-color: #91d5ff;
  }

  &:active {
    transform: translateY(-1px);
  }

  .merchant-logo {
    width: 64px;
    height: 64px;
    margin-right: 14px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .merchant-info {
    flex: 1;
    min-width: 0;

    .merchant-name {
      font-size: 15px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .merchant-rating {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .rating-stars {
        font-size: 12px;
        margin-right: 6px;
        
        :deep(.ant-rate-star) {
          margin-right: 2px;
        }
      }

      .rating-text {
        font-size: 13px;
        font-weight: 600;
        color: #faad14;
        margin-right: 4px;
      }

      .review-count {
        font-size: 12px;
        color: #8c8c8c;
      }
    }

    .merchant-tags {
      margin-bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      
      .tag-item {
        margin: 0;
        font-size: 11px;
        padding: 0 6px;
        line-height: 20px;
        border-radius: 4px;
      }
    }

    .merchant-meta {
      display: flex;
      gap: 16px;

      .meta-item {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #595959;

        .meta-icon {
          margin-right: 4px;
          font-size: 13px;
        }

        &.discount {
          color: #ff4d4f;
          font-weight: 600;

          .meta-icon {
            color: #ff4d4f;
          }
        }
      }
    }
  }

  .recommend-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    flex-shrink: 0;
    min-width: 70px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

    .score-value {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      margin-bottom: 4px;
    }

    .score-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
    }

    .score-detail {
      display: flex;
      gap: 8px;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);

      .score-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .score-name {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2px;
        }

        .score-num {
          font-size: 12px;
          font-weight: 600;
          color: #fff;
        }
      }
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .merchant-card {
    .recommend-score {
      min-width: 60px;
      padding: 8px 10px;

      .score-value {
        font-size: 20px;
      }

      .score-detail {
        gap: 6px;

        .score-item {
          .score-name {
            font-size: 9px;
          }

          .score-num {
            font-size: 11px;
          }
        }
      }
    }
  }
}
</style>

