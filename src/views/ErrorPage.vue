<template>
  <div class="error-page">
    <div class="content">
      <!-- 错误图标和代码 -->
      <div class="error-icon">
        <div class="error-code">{{ errorCode }}</div>
        <component :is="errorIcon" class="icon" />
      </div>

      <!-- 错误信息 -->
      <div class="error-info">
        <h1 class="error-title">{{ errorTitle }}</h1>
        <p class="error-desc">{{ errorDesc }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <a-button type="primary" size="large" class="home-btn" @click="goHome">
          <HomeOutlined />
          返回首页
        </a-button>
        <a-button size="large" class="back-btn" @click="goBack" v-if="canGoBack">
          <LeftOutlined />
          返回上一页
        </a-button>
        <a-button size="large" class="retry-btn" @click="retry" v-if="showRetry">
          <ReloadOutlined />
          重新加载
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeOutlined,
  LeftOutlined,
  ReloadOutlined,
  InboxOutlined,
  WarningOutlined,
  LockOutlined,
  DisconnectOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const canGoBack = ref(false)

// 从路由参数获取错误信息
const errorCode = computed(() => route.query.code as string || '500')
const errorMessage = computed(() => route.query.message as string || '')

// 根据错误代码显示不同的标题和描述
const errorTitle = computed(() => {
  if (errorMessage.value) return errorMessage.value
  
  switch (errorCode.value) {
    case '404':
      return '页面不存在'
    case '403':
      return '访问被拒绝'
    case '500':
      return '服务器错误'
    case '503':
      return '服务不可用'
    default:
      return '出错了'
  }
})

const errorDesc = computed(() => {
  switch (errorCode.value) {
    case '404':
      return '抱歉，您访问的页面不存在或已被删除'
    case '403':
      return '抱歉，您没有权限访问此页面'
    case '500':
      return '抱歉，服务器遇到了一些问题，请稍后再试'
    case '503':
      return '抱歉，服务暂时不可用，请稍后再试'
    default:
      return '抱歉，系统遇到了一些问题'
  }
})

const errorIcon = computed(() => {
  switch (errorCode.value) {
    case '404':
      return InboxOutlined
    case '403':
      return LockOutlined
    case '500':
    case '503':
      return DisconnectOutlined
    default:
      return WarningOutlined
  }
})

const showRetry = computed(() => {
  return ['500', '503'].includes(errorCode.value)
})

onMounted(() => {
  canGoBack.value = window.history.length > 1
})

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}

const retry = () => {
  window.location.reload()
}
</script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.content {
  width: 100%;
  max-width: 600px;
  text-align: center;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.error-icon {
  position: relative;
  margin-bottom: 40px;

  .error-code {
    font-size: 120px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.15);
    line-height: 1;
    letter-spacing: 10px;
    user-select: none;
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 60px;
    color: #fff;
  }
}

.error-info {
  margin-bottom: 40px;

  .error-title {
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 12px;
  }

  .error-desc {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .home-btn {
    background: #fff;
    border-color: #fff;
    color: #667eea;
    font-weight: 500;
    height: 48px;
    border-radius: 24px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  }

  .back-btn,
  .retry-btn {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    color: #fff;
    font-weight: 500;
    height: 48px;
    border-radius: 24px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    backdrop-filter: blur(10px);
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-2px);
    }
  }
}

@media (max-width: 768px) {
  .error-icon {
    .error-code {
      font-size: 80px;
    }

    .icon {
      font-size: 40px;
    }
  }

  .error-info {
    .error-title {
      font-size: 24px;
    }

    .error-desc {
      font-size: 14px;
    }
  }

  .action-buttons {
    .home-btn,
    .back-btn,
    .retry-btn {
      height: 44px;
      font-size: 15px;
    }
  }
}
</style>

