<template>
  <div class="not-found-page">
    <div class="content">
      <!-- 404图标和文字 -->
      <div class="error-icon">
        <div class="error-code">404</div>
        <InboxOutlined class="icon" />
      </div>

      <!-- 错误信息 -->
      <div class="error-info">
        <h1 class="error-title">页面不存在</h1>
        <p class="error-desc">抱歉，您访问的页面不存在或已被删除</p>
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
      </div>

      <!-- 快捷入口 -->
      <div class="quick-links">
        <div class="links-title">您可能想访问：</div>
        <div class="links-grid">
          <div class="link-item" @click="goTo('/vouchers')">
            <GiftOutlined class="link-icon" />
            <span class="link-text">领券中心</span>
          </div>
          <div class="link-item" @click="goTo('/lottery-center')">
            <TrophyOutlined class="link-icon" />
            <span class="link-text">积分抽奖</span>
          </div>
          <div class="link-item" @click="goTo('/orders')">
            <ShoppingOutlined class="link-icon" />
            <span class="link-text">我的订单</span>
          </div>
          <div class="link-item" @click="goTo('/mine-redesigned')">
            <UserOutlined class="link-icon" />
            <span class="link-text">个人中心</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeOutlined,
  LeftOutlined,
  InboxOutlined,
  GiftOutlined,
  TrophyOutlined,
  ShoppingOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const canGoBack = ref(false)

onMounted(() => {
  // 检查是否可以返回上一页
  canGoBack.value = window.history.length > 1
})

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}

const goTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.not-found-page {
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

/* 404图标和文字 */
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

/* 错误信息 */
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

/* 操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 60px;

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

  .back-btn {
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

/* 快捷入口 */
.quick-links {
  .links-title {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 20px;
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .link-item {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-4px);
    }

    .link-icon {
      font-size: 28px;
      color: #fff;
    }

    .link-text {
      font-size: 14px;
      color: #fff;
      font-weight: 500;
    }
  }
}

/* 响应式设计 */
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
    .back-btn {
      height: 44px;
      font-size: 15px;
    }
  }

  .quick-links {
    .links-title {
      font-size: 14px;
    }

    .link-item {
      padding: 16px;

      .link-icon {
        font-size: 24px;
      }

      .link-text {
        font-size: 13px;
      }
    }
  }
}
</style>

