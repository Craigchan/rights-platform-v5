<template>
  <div class="qualification-claim">
    <!-- 头部 -->
    <div class="claim-header">
      <div class="header-left" @click="router.back()">
        <LeftOutlined />
      </div>
      <div class="header-title">资格申领</div>
      <div class="header-right"></div>
    </div>

    <div class="claim-content">
      <!-- 说明卡片 -->
      <div class="info-card">
        <div class="info-icon">
          <SafetyCertificateOutlined />
        </div>
        <div class="info-text">
          <div class="info-title">什么是资格申领?</div>
          <div class="info-desc">
            申领补贴资格后,即可申请对应的补贴项目。每个品类只需申领一次,可随时解绑重新申领。
          </div>
        </div>
      </div>

      <!-- 补贴资格列表 - 折叠面板 -->
      <a-collapse 
        v-model:activeKey="activeKeys" 
        :bordered="false"
        class="qualification-collapse"
      >
        <a-collapse-panel 
          v-for="subsidy in subsidyStore.availableSubsidies" 
          :key="subsidy.id"
          class="qualification-panel"
        >
          <template #header>
            <div class="panel-header">
              <div class="panel-left">
                <span class="panel-icon">{{ subsidy.icon }}</span>
                <span class="panel-title">{{ subsidy.name }}</span>
                <span class="panel-desc">{{ subsidy.description }}</span>
              </div>
              <div class="panel-badge">
                {{ getClaimedCountForCategory(subsidy.type) }}/{{ subsidy.subCategories?.length || 0 }}
              </div>
            </div>
          </template>

          <!-- 二级品类列表 -->
          <div class="sub-category-list">
            <div 
              v-for="subCat in subsidy.subCategories" 
              :key="subCat.id"
              class="sub-category-item"
              :class="{ claimed: isSubCategoryClaimed(subCat.id) }"
            >
              <div class="sub-cat-icon">{{ subCat.icon }}</div>
              <div class="sub-cat-content">
                <div class="sub-cat-header">
                  <div class="sub-cat-title">{{ subCat.name }}</div>
                  <div class="sub-cat-amount" :style="{ color: subsidy.color }">
                    ¥{{ subCat.amount }}
                  </div>
                </div>
                <div class="sub-cat-desc">{{ subCat.description }}</div>
                <div class="sub-cat-info">
                  <span class="info-item">
                    <UserOutlined /> 需{{ subCat.requiredHelpers }}人助力
                  </span>
                  <span class="info-item">
                    <TeamOutlined /> 剩余{{ subCat.totalQuota - subCat.usedQuota }}份
                  </span>
                </div>
                <div class="sub-cat-quota">
                  <div class="quota-bar">
                    <div 
                      class="quota-fill" 
                      :style="{ 
                        width: `${(subCat.usedQuota / subCat.totalQuota) * 100}%`,
                        background: `linear-gradient(90deg, ${subsidy.color}88, ${subsidy.color})`
                      }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="sub-cat-action">
                <template v-if="!isSubCategoryClaimed(subCat.id)">
                  <a-button 
                    type="primary" 
                    size="small"
                    @click="claimSubCategory(subCat.id, subCat.name)"
                  >
                    申领
                  </a-button>
                </template>
                <template v-else>
                  <div class="claimed-badge">
                    <CheckCircleFilled /> 已申领
                  </div>
                  <a-button 
                    type="link" 
                    danger
                    size="small"
                    @click="showUnbindConfirm(subCat.id, subCat.name)"
                  >
                    解绑
                  </a-button>
                </template>
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>

      <!-- 已申领统计 -->
      <div class="claim-stats">
        <div class="stats-title">申领统计</div>
        <div class="stats-grid">
          <div class="stats-item">
            <div class="stats-value">{{ claimedCount }}</div>
            <div class="stats-label">已申领资格</div>
          </div>
          <div class="stats-item">
            <div class="stats-value">{{ totalSubCategories }}</div>
            <div class="stats-label">可申领资格</div>
          </div>
          <div class="stats-item">
            <div class="stats-value">¥{{ totalSubsidyAmount }}</div>
            <div class="stats-label">可获补贴</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 解绑确认对话框 -->
    <a-modal
      v-model:open="unbindModalVisible"
      title="确认解绑资格?"
      @ok="confirmUnbind"
      ok-text="确认解绑"
      cancel-text="取消"
      ok-button-props="{ danger: true }"
    >
      <div class="unbind-confirm">
        <div class="unbind-icon">
          <ExclamationCircleOutlined />
        </div>
        <div class="unbind-text">
          <p>您正在解绑 <strong>{{ unbindingCategoryName }}</strong> 资格</p>
          <p>解绑后需要重新申领才能申请该补贴项目,确定要解绑吗?</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { 
  LeftOutlined, 
  SafetyCertificateOutlined,
  CheckCircleFilled,
  UserOutlined,
  TeamOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { useSubsidyStore } from '@/stores/subsidy'
import type { SubsidyType } from '@/stores/subsidy'

const router = useRouter()
const subsidyStore = useSubsidyStore()

// 折叠面板激活的key
const activeKeys = ref<number[]>([])

// 解绑相关
const unbindModalVisible = ref(false)
const unbindingCategoryId = ref<string>('')
const unbindingCategoryName = ref<string>('')

// 已申领的资格
const claimedQualifications = computed(() => subsidyStore.claimedQualifications)

// 计算已申领数量
const claimedCount = computed(() => claimedQualifications.value.length)

// 计算总的二级品类数量
const totalSubCategories = computed(() => {
  return subsidyStore.availableSubsidies.reduce((total, subsidy) => {
    return total + (subsidy.subCategories?.length || 0)
  }, 0)
})

// 计算可获得的总补贴金额
const totalSubsidyAmount = computed(() => {
  let total = 0
  subsidyStore.availableSubsidies.forEach(subsidy => {
    subsidy.subCategories?.forEach(subCat => {
      if (claimedQualifications.value.includes(subCat.id)) {
        total += subCat.amount
      }
    })
  })
  return total
})

// 获取某个主类别下已申领的子类别数量
const getClaimedCountForCategory = (type: SubsidyType) => {
  const subsidy = subsidyStore.availableSubsidies.find(s => s.type === type)
  if (!subsidy || !subsidy.subCategories) return 0
  
  return subsidy.subCategories.filter(subCat => 
    claimedQualifications.value.includes(subCat.id)
  ).length
}

// 检查某个二级品类是否已申领
const isSubCategoryClaimed = (subCategoryId: string) => {
  return claimedQualifications.value.includes(subCategoryId)
}

// 申领二级品类
const claimSubCategory = (subCategoryId: string, name: string) => {
  const success = subsidyStore.claimQualification(subCategoryId)
  if (success) {
    message.success(`已成功申领${name}资格`)
  } else {
    message.warning('该资格已申领')
  }
}

// 显示解绑确认对话框
const showUnbindConfirm = (subCategoryId: string, name: string) => {
  unbindingCategoryId.value = subCategoryId
  unbindingCategoryName.value = name
  unbindModalVisible.value = true
}

// 确认解绑
const confirmUnbind = () => {
  subsidyStore.unbindQualification(unbindingCategoryId.value)
  message.success(`已解绑${unbindingCategoryName.value}资格`)
  unbindModalVisible.value = false
}
</script>

<style scoped lang="scss">
.qualification-claim {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.claim-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;

  .header-left {
    width: 40px;
    cursor: pointer;
  }

  .header-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }

  .header-right {
    width: 40px;
  }
}

.claim-content {
  padding: 16px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .info-icon {
    font-size: 24px;
    color: #667eea;
  }

  .info-text {
    flex: 1;

    .info-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    .info-desc {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
  }
}

.qualification-collapse {
  background: transparent;

  :deep(.ant-collapse-item) {
    background: white;
    border-radius: 12px;
    margin-bottom: 12px;
    border: none;
    overflow: hidden;
  }

  :deep(.ant-collapse-header) {
    padding: 16px !important;
    background: white;
  }

  :deep(.ant-collapse-content) {
    border-top: 1px solid #f0f0f0;
  }

  :deep(.ant-collapse-content-box) {
    padding: 12px !important;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .panel-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;

    .panel-icon {
      font-size: 24px;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .panel-desc {
      font-size: 12px;
      color: #999;
      margin-left: 8px;
    }
  }

  .panel-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin-right: 12px;
  }
}

.sub-category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-category-item {
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  transition: all 0.3s;

  &.claimed {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
  }

  .sub-cat-icon {
    font-size: 32px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
  }

  .sub-cat-content {
    flex: 1;
  }

  .sub-cat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .sub-cat-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .sub-cat-amount {
      font-size: 18px;
      font-weight: 700;
    }
  }

  .sub-cat-desc {
    font-size: 13px;
    color: #666;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .sub-cat-info {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;

    .info-item {
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .sub-cat-quota {
    .quota-bar {
      height: 6px;
      background: #e8e8e8;
      border-radius: 3px;
      overflow: hidden;

      .quota-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s;
      }
    }
  }

  .sub-cat-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;

    .claimed-badge {
      color: #52c41a;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.claim-stats {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .stats-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .stats-item {
    text-align: center;

    .stats-value {
      font-size: 24px;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 8px;
    }

    .stats-label {
      font-size: 13px;
      color: #999;
    }
  }
}

.unbind-confirm {
  display: flex;
  gap: 16px;
  padding: 16px 0;

  .unbind-icon {
    font-size: 32px;
    color: #faad14;
  }

  .unbind-text {
    flex: 1;

    p {
      margin-bottom: 12px;
      color: #666;
      line-height: 1.6;

      strong {
        color: #333;
      }
    }
  }
}
</style>
