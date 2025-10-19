<template>
  <div class="subsidy-help-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-left" @click="router.back()">
        <LeftOutlined />
      </div>
      <div class="nav-title">政府补贴助力</div>
      <div class="nav-right" @click="goToMyApplications">
        我的申请
      </div>
    </div>

    <!-- 顶部说明 -->
    <div class="intro-section">
      <div class="intro-icon">🤝</div>
      <div class="intro-title">好友助力,快速获得政府补贴</div>
      <div class="intro-desc">邀请好友助力,完成后即可申请政府补贴资格</div>
    </div>

    <!-- 我的申请进度 -->
    <div class="my-progress" v-if="pendingApplications.length > 0">
      <div class="section-title">
        <span>我的助力进度</span>
        <span class="view-all" @click="goToMyApplications">查看全部 <RightOutlined /></span>
      </div>
      
      <div class="progress-card" v-for="app in pendingApplications" :key="app.id" @click="goToDetail(app.id)">
        <div class="card-header">
          <div class="card-title">{{ app.title }}</div>
          <div class="card-status" :class="app.status">
            {{ app.status === 'pending' ? '待助力' : '助力中' }}
          </div>
        </div>
        <div class="card-body">
          <div class="progress-info">
            <div class="progress-text">
              已助力 <span class="highlight">{{ app.currentHelpers }}</span>/{{ app.requiredHelpers }} 人
            </div>
            <div class="progress-percent">{{ Math.round(app.currentHelpers / app.requiredHelpers * 100) }}%</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: (app.currentHelpers / app.requiredHelpers * 100) + '%' }"></div>
          </div>
          <div class="subsidy-amount">补贴金额: ¥{{ app.subsidyAmount }}</div>
        </div>
        <div class="card-footer">
          <button class="share-btn" @click.stop="shareApplication(app.id)">
            <ShareAltOutlined /> 分享给好友
          </button>
        </div>
      </div>
    </div>

    <!-- 可申请的补贴项目 -->
    <div class="available-subsidies">
      <div class="section-title">可申请的补贴项目</div>
      
      <div class="subsidy-grid">
        <div 
          class="subsidy-card" 
          v-for="subsidy in availableSubsidies" 
          :key="subsidy.id"
          @click="applySubsidy(subsidy.type)"
        >
          <div class="subsidy-icon" :style="{ background: subsidy.color }">
            {{ subsidy.icon }}
          </div>
          <div class="subsidy-info">
            <div class="subsidy-name">{{ subsidy.name }}</div>
            <div class="subsidy-amount">最高补贴 ¥{{ subsidy.amount }}</div>
            <div class="subsidy-desc">{{ subsidy.description }}</div>
            <div class="subsidy-requirement">
              需要 {{ subsidy.requiredHelpers }} 人助力
            </div>
          </div>
          <button class="apply-btn">
            <PlusCircleOutlined /> 立即申请
          </button>
        </div>
      </div>
    </div>

    <!-- 助力说明 -->
    <div class="help-guide">
      <div class="section-title">如何获得补贴?</div>
      <div class="guide-steps">
        <div class="guide-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <div class="step-title">选择补贴项目</div>
            <div class="step-desc">选择您需要的补贴类型并提交申请</div>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <div class="step-title">邀请好友助力</div>
            <div class="step-desc">分享给好友,邀请他们为您助力</div>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <div class="step-title">完成助力目标</div>
            <div class="step-desc">达到所需助力人数后即可申请补贴</div>
          </div>
        </div>
        <div class="guide-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <div class="step-title">领取补贴奖励</div>
            <div class="step-desc">补贴将以积分形式发放到您的账户</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  RightOutlined,
  ShareAltOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue'
import { useSubsidyStore } from '../stores/subsidy'

const router = useRouter()
const subsidyStore = useSubsidyStore()

// 初始化
subsidyStore.init()

// 计算属性
const pendingApplications = computed(() => subsidyStore.pendingApplications)
const availableSubsidies = computed(() => subsidyStore.availableSubsidies)

// 申请补贴
const applySubsidy = (type: string) => {
  const app = subsidyStore.createApplication(type as any)
  if (app) {
    message.success('申请成功!快去邀请好友助力吧')
    router.push(`/subsidy-help/${app.id}`)
  } else {
    message.error('申请失败,请稍后重试')
  }
}

// 分享申请
const shareApplication = (appId: number) => {
  message.success('分享链接已复制到剪贴板')
  // TODO: 实际分享功能
}

// 跳转到详情页
const goToDetail = (appId: number) => {
  router.push(`/subsidy-help/${appId}`)
}

// 跳转到我的申请
const goToMyApplications = () => {
  router.push('/subsidy-applications')
}
</script>

<style scoped lang="scss">
.subsidy-help-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  padding-bottom: 20px;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-left, .nav-right {
    width: 80px;
    cursor: pointer;
  }

  .nav-right {
    text-align: right;
    font-size: 14px;
  }

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
}

.intro-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  text-align: center;

  .intro-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .intro-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .intro-desc {
    font-size: 14px;
    opacity: 0.9;
  }
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 12px;
  font-size: 18px;
  font-weight: 600;
  color: #333;

  .view-all {
    font-size: 14px;
    font-weight: normal;
    color: #667eea;
    cursor: pointer;
  }
}

.my-progress {
  margin-bottom: 20px;

  .progress-card {
    margin: 0 16px 12px;
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .card-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;

        &.pending {
          background: #fff3e0;
          color: #f57c00;
        }

        &.in_progress {
          background: #e3f2fd;
          color: #1976d2;
        }
      }
    }

    .card-body {
      .progress-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;

        .highlight {
          color: #667eea;
          font-weight: 600;
          font-size: 16px;
        }

        .progress-percent {
          color: #667eea;
          font-weight: 600;
        }
      }

      .progress-bar {
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 12px;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s;
        }
      }

      .subsidy-amount {
        font-size: 14px;
        color: #ff6b35;
        font-weight: 600;
      }
    }

    .card-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;

      .share-btn {
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
      }
    }
  }
}

.available-subsidies {
  .subsidy-grid {
    padding: 0 16px;
  }

  .subsidy-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .subsidy-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-bottom: 12px;
    }

    .subsidy-info {
      margin-bottom: 12px;

      .subsidy-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 6px;
      }

      .subsidy-amount {
        font-size: 20px;
        font-weight: 700;
        color: #ff6b35;
        margin-bottom: 8px;
      }

      .subsidy-desc {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .subsidy-requirement {
        font-size: 13px;
        color: #999;
      }
    }

    .apply-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        opacity: 0.9;
        transform: scale(1.02);
      }
    }
  }
}

.help-guide {
  margin-top: 20px;

  .guide-steps {
    padding: 0 16px;
  }

  .guide-step {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
      margin-right: 12px;
    }

    .step-content {
      flex: 1;

      .step-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .step-desc {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
    }
  }
}
</style>

