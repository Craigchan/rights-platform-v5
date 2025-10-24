<template>
  <PullToRefresh :on-refresh="handleRefresh">
    <!-- 骨架屏加载状态 -->
    <MineSkeleton v-if="isLoading" />
    
    <!-- 实际内容 -->
    <div v-else class="mine-page-redesigned">
    <!-- 1. 用户信息卡 -->
    <div class="section-card user-info-card">
      <div class="user-header">
        <!-- 头像区域 -->
        <div class="avatar-section" @click="handleAvatarClick">
          <img v-img-fallback :src="userInfo.avatar" alt="用户头像" class="avatar" />
          <div class="avatar-edit-badge">
            <EditOutlined />
          </div>
        </div>

        <!-- 用户详情 -->
        <div class="user-details">
          <div class="user-name" @click="handleEditProfile">
            <span class="nickname">{{ userInfo.nickname }}</span>
            <EditOutlined class="edit-icon" />
          </div>
          <div class="user-phone">{{ userInfo.phone }}</div>
          <div class="member-badge" @click="handleMemberClick">
            <span class="badge-content" :class="userInfo.memberLevel">
              <CrownOutlined />
              {{ levelName }}会员
            </span>
            <RightOutlined class="arrow-icon" />
          </div>
        </div>

        <!-- 设置按钮 -->
        <div class="header-action">
          <SettingOutlined class="setting-icon" @click="goToSettings" />
        </div>
      </div>

      <!-- 会员升级进度 -->
      <div class="level-progress">
        <div class="progress-labels">
          <span class="current-level">{{ levelName }}</span>
          <span class="next-level">{{ nextLevelName }}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :class="userInfo.memberLevel"
              :style="{ width: levelProgress + '%' }"
            ></div>
          </div>
          <span class="progress-percent">{{ levelProgress }}%</span>
        </div>
        <p class="progress-tip">
          再获得 <span class="highlight">{{ pointsToNextLevel }}</span> 积分即可升级
        </p>
      </div>

      <!-- 实名认证状态 -->
      <div class="auth-status" @click="goToAuth">
        <CheckCircleOutlined v-if="userInfo.isAuthenticated" class="auth-icon verified" />
        <ExclamationCircleOutlined v-else class="auth-icon unverified" />
        <span class="auth-text" :class="userInfo.isAuthenticated ? 'verified' : 'unverified'">
          {{ userInfo.isAuthenticated ? '已实名认证' : '未实名认证，去认证' }}
        </span>
        <RightOutlined class="arrow-icon" />
      </div>
    </div>

    <!-- 2. 快捷统计卡 -->
    <div class="section-card quick-stats-card">
      <div class="stat-item" @click="goToPoints">
        <CountUp :end-value="userInfo.points" class="stat-value" />
        <div class="stat-label">我的积分</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item" @click="goToVouchers">
        <CountUp :end-value="voucherCount" class="stat-value" />
        <div class="stat-label">优惠券</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item" @click="goToFavorites">
        <CountUp :end-value="favoriteCount" class="stat-value" />
        <div class="stat-label">收藏</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item" @click="goToHistory">
        <CountUp :end-value="historyCount" class="stat-value" />
        <div class="stat-label">足迹</div>
      </div>
    </div>

    <!-- 3. 我的订单卡 -->
    <div class="section-card order-card">
      <div class="card-header">
        <h3 class="card-title">我的订单</h3>
        <div class="card-more" @click="goToOrders">
          查看全部
          <RightOutlined />
        </div>
      </div>
      <div class="order-status-grid">
        <div 
          v-for="status in orderStatuses" 
          :key="status.type"
          class="order-status-item"
          @click="goToOrdersByStatus(status.type)"
        >
          <div class="status-icon-wrapper">
            <a-badge :count="status.count" :offset="[5, 5]">
              <component :is="status.icon" class="status-icon" />
            </a-badge>
          </div>
          <div class="status-label">{{ status.label }}</div>
        </div>
      </div>
    </div>

    <!-- 4. 常用功能卡 -->
    <div class="section-card common-features-card">
      <div class="card-header">
        <h3 class="card-title">常用功能</h3>
      </div>
      <div class="feature-list">
        <div 
          v-for="feature in visibleFeatures" 
          :key="feature.path"
          class="feature-item"
          @click="navigate(feature.path)"
        >
          <component :is="feature.icon" class="feature-icon" :style="{ color: feature.color }" />
          <span class="feature-name">{{ feature.name }}</span>
          <span v-if="feature.badge" class="feature-badge" :class="feature.badgeType">
            {{ feature.badge }}
          </span>
          <RightOutlined class="feature-arrow" />
        </div>
        <div v-if="moreFeatures.length > 0" class="expand-button" @click="toggleMoreFeatures">
          <DownOutlined class="expand-icon" :style="{ transform: showMoreFeatures ? 'rotate(180deg)' : 'rotate(0deg)' }" />
          <span class="expand-text">{{ showMoreFeatures ? '收起' : '更多功能' }}</span>
        </div>
      </div>
    </div>

    <!-- 5. 设置与帮助卡 -->
    <div class="section-card settings-card">
      <div class="card-header clickable" @click="toggleSettings">
        <h3 class="card-title">设置与帮助</h3>
        <DownOutlined class="toggle-icon" :style="{ transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)' }" />
      </div>
      <div v-show="showSettings" class="feature-list">
        <div 
          v-for="item in settingsItems" 
          :key="item.path"
          class="feature-item"
          @click="navigate(item.path)"
        >
          <component :is="item.icon" class="feature-icon" :style="{ color: item.color }" />
          <span class="feature-name">{{ item.name }}</span>
          <RightOutlined class="feature-arrow" />
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <a-button type="primary" danger block size="large" @click="handleLogout">
        退出登录
      </a-button>
    </div>
    </div>
  </PullToRefresh>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  EditOutlined,
  SettingOutlined,
  CrownOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  WalletOutlined,
  TagOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  CarOutlined,
  InboxOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  GiftOutlined,
  TrophyOutlined,
  StarOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import CountUp from '@/components/CountUp.vue'
import PullToRefresh from '@/components/PullToRefresh.vue'
import MineSkeleton from '@/components/MineSkeleton.vue'

const router = useRouter()

// 加载状态
const isLoading = ref(true)

// 用户信息
const userInfo = ref({
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  nickname: '江苏用户',
  phone: '138****8888',
  memberLevel: 'silver', // bronze, silver, gold, diamond, platinum
  points: 12580,
  isAuthenticated: true
})

// 统计数据
const voucherCount = ref(5)
const favoriteCount = ref(23)
const historyCount = ref(156)

// 订单状态
const orderStatuses = ref([
  { type: 'pending', label: '待支付', icon: WalletOutlined, count: 2 },
  { type: 'paid', label: '待发货', icon: ShoppingOutlined, count: 1 },
  { type: 'shipped', label: '待收货', icon: CarOutlined, count: 3 },
  { type: 'completed', label: '已完成', icon: CheckSquareOutlined, count: 0 },
  { type: 'refund', label: '退款/售后', icon: CloseCircleOutlined, count: 0 }
])

// 常用功能
const highFrequencyFeatures = ref([
  { name: '我的票券', path: '/vouchers', icon: TagOutlined, color: '#FF6B35' },
  { name: '积分明细', path: '/points-detail', icon: WalletOutlined, color: '#FFD700' },
  { name: '兑换记录', path: '/exchange-records', icon: GiftOutlined, color: '#FF6B35' },
  { name: '我的票根', path: '/my-tickets', icon: PictureOutlined, color: '#1890ff' },
  { name: '中奖记录', path: '/lottery-records', icon: TrophyOutlined, color: '#FA8C16' },
  { name: '我的收藏', path: '/favorites', icon: HeartOutlined, color: '#FF4D4F' },
  { name: '浏览历史', path: '/history', icon: ClockCircleOutlined, color: '#8C8C8C' },
  { name: '收货地址管理', path: '/address', icon: EnvironmentOutlined, color: '#52C41A' }
])

const moreFeatures = ref([
  { name: '我的发票', path: '/invoice', icon: FileTextOutlined, color: '#1890ff' },
  { name: '客服中心', path: '/customer-service', icon: CustomerServiceOutlined, color: '#FA8C16' },
  { name: '意见反馈', path: '/feedback', icon: MessageOutlined, color: '#52C41A' }
])

// 设置与帮助
const settingsItems = ref([
  { name: '账号设置', path: '/account-settings', icon: UserOutlined, color: '#1890ff' },
  { name: '消息通知设置', path: '/notification-settings', icon: BellOutlined, color: '#FA8C16' },
  { name: '隐私设置', path: '/privacy-settings', icon: LockOutlined, color: '#52C41A' },
  { name: '帮助中心', path: '/help-center', icon: QuestionCircleOutlined, color: '#8C8C8C' },
  { name: '关于我们', path: '/about', icon: InfoCircleOutlined, color: '#8C8C8C' },
  { name: '清除缓存', path: '/clear-cache', icon: DeleteOutlined, color: '#FF4D4F' }
])

// 展开/折叠状态
const showMoreFeatures = ref(false)
const showSettings = ref(false)

// 计算属性
const levelName = computed(() => {
  const levels: Record<string, string> = {
    bronze: '青铜',
    silver: '白银',
    gold: '黄金',
    diamond: '钻石',
    platinum: '铂金'
  }
  return levels[userInfo.value.memberLevel] || '普通'
})

const nextLevelName = computed(() => {
  const levelOrder = ['bronze', 'silver', 'gold', 'diamond', 'platinum']
  const currentIndex = levelOrder.indexOf(userInfo.value.memberLevel)
  if (currentIndex === -1 || currentIndex === levelOrder.length - 1) {
    return '最高等级'
  }
  const levels: Record<string, string> = {
    bronze: '青铜',
    silver: '白银',
    gold: '黄金',
    diamond: '钻石',
    platinum: '铂金'
  }
  return levels[levelOrder[currentIndex + 1]]
})

const levelProgress = computed(() => {
  // 模拟进度计算
  const currentPoints = userInfo.value.points
  const levelThresholds: Record<string, number> = {
    bronze: 1000,
    silver: 5000,
    gold: 15000,
    diamond: 50000,
    platinum: 100000
  }
  const currentThreshold = levelThresholds[userInfo.value.memberLevel] || 0
  const levelOrder = ['bronze', 'silver', 'gold', 'diamond', 'platinum']
  const currentIndex = levelOrder.indexOf(userInfo.value.memberLevel)
  if (currentIndex === -1 || currentIndex === levelOrder.length - 1) {
    return 100
  }
  const nextThreshold = levelThresholds[levelOrder[currentIndex + 1]]
  const progress = ((currentPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  return Math.min(Math.round(progress), 100)
})

const pointsToNextLevel = computed(() => {
  const currentPoints = userInfo.value.points
  const levelThresholds: Record<string, number> = {
    bronze: 1000,
    silver: 5000,
    gold: 15000,
    diamond: 50000,
    platinum: 100000
  }
  const levelOrder = ['bronze', 'silver', 'gold', 'diamond', 'platinum']
  const currentIndex = levelOrder.indexOf(userInfo.value.memberLevel)
  if (currentIndex === -1 || currentIndex === levelOrder.length - 1) {
    return 0
  }
  const nextThreshold = levelThresholds[levelOrder[currentIndex + 1]]
  return Math.max(nextThreshold - currentPoints, 0)
})

const visibleFeatures = computed(() => {
  return showMoreFeatures.value 
    ? [...highFrequencyFeatures.value, ...moreFeatures.value]
    : highFrequencyFeatures.value
})

// 方法
const navigate = (path: string) => {
  router.push(path)
}

const handleAvatarClick = () => {
  console.log('点击头像')
  // 实现头像预览/更换功能
}

const handleEditProfile = () => {
  router.push('/profile-edit')
}

const handleMemberClick = () => {
  router.push('/membership')
}

const goToSettings = () => {
  router.push('/account-settings')
}

const goToAuth = () => {
  if (!userInfo.value.isAuthenticated) {
    router.push('/real-name-auth')
  }
}

const goToPoints = () => {
  router.push('/points-detail')
}

const goToVouchers = () => {
  router.push('/vouchers')
}

const goToFavorites = () => {
  router.push('/favorites')
}

const goToHistory = () => {
  router.push('/history')
}

const goToOrders = () => {
  router.push('/orders')
}

const goToOrdersByStatus = (status: string) => {
  router.push(`/orders?status=${status}`)
}

const toggleMoreFeatures = () => {
  showMoreFeatures.value = !showMoreFeatures.value
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const handleRefresh = async () => {
  console.log('刷新数据')
  // 模拟刷新延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  // 实际应用中这里调用API重新获取数据
  console.log('刷新完成')
}

const handleLogout = () => {
  console.log('退出登录')
  // 实现退出登录逻辑
}

onMounted(async () => {
  console.log('MineRedesigned mounted')
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  isLoading.value = false
})
</script>

<style scoped lang="scss">
.mine-page-redesigned {
  min-height: 100vh;
  background: #F5F5F5;
  padding: 12px;
  padding-bottom: 80px;
}

// ========== 通用卡片样式 ==========
.section-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: slideInUp 0.4s ease-out;
  animation-fill-mode: both;
  
  // 为每个卡片添加延迟,实现依次出现效果
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  &.clickable {
    cursor: pointer;
    user-select: none;
  }
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.card-more {
  font-size: 14px;
  color: #8C8C8C;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    color: #FF6B35;
  }
}

.toggle-icon {
  font-size: 12px;
  color: #8C8C8C;
  transition: transform 0.3s;
}

// ========== 1. 用户信息卡 ==========
.user-info-card {
  .user-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .avatar-section {
    position: relative;
    cursor: pointer;
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #E8E8E8;
    }
    
    .avatar-edit-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 24px;
      height: 24px;
      background: #FF6B35;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 12px;
      border: 2px solid #fff;
    }
  }
  
  .user-details {
    flex: 1;
    
    .user-name {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
      cursor: pointer;
      
      .nickname {
        font-size: 18px;
        font-weight: 600;
        color: #262626;
      }
      
      .edit-icon {
        font-size: 14px;
        color: #8C8C8C;
      }
    }
    
    .user-phone {
      font-size: 14px;
      color: #8C8C8C;
      margin-bottom: 8px;
    }
    
    .member-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      
      .badge-content {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        
        &.bronze {
          background: linear-gradient(135deg, #CD7F32 0%, #B87333 100%);
          color: #fff;
        }
        
        &.silver {
          background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
          color: #fff;
        }
        
        &.gold {
          background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
          color: #fff;
        }
        
        &.diamond {
          background: linear-gradient(135deg, #B9F2FF 0%, #87CEEB 100%);
          color: #fff;
        }
        
        &.platinum {
          background: linear-gradient(135deg, #E5E4E2 0%, #D3D3D3 100%);
          color: #262626;
        }
      }
      
      .arrow-icon {
        font-size: 12px;
        color: #8C8C8C;
      }
    }
  }
  
  .header-action {
    .setting-icon {
      font-size: 20px;
      color: #8C8C8C;
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: #FF6B35;
      }
    }
  }
  
  // 会员升级进度
  .level-progress {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #E8E8E8;
    
    .progress-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      .current-level,
      .next-level {
        font-size: 12px;
        color: #8C8C8C;
      }
    }
    
    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      
      .progress-bar {
        flex: 1;
        height: 8px;
        background: #E8E8E8;
        border-radius: 4px;
        overflow: hidden;
        
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
          
          &.bronze {
            background: linear-gradient(90deg, #CD7F32 0%, #B87333 100%);
          }
          
          &.silver {
            background: linear-gradient(90deg, #C0C0C0 0%, #A8A8A8 100%);
          }
          
          &.gold {
            background: linear-gradient(90deg, #FFD700 0%, #FFC700 100%);
          }
          
          &.diamond {
            background: linear-gradient(90deg, #B9F2FF 0%, #87CEEB 100%);
          }
          
          &.platinum {
            background: linear-gradient(90deg, #E5E4E2 0%, #D3D3D3 100%);
          }
        }
      }
      
      .progress-percent {
        font-size: 12px;
        font-weight: 600;
        color: #262626;
        min-width: 40px;
        text-align: right;
      }
    }
    
    .progress-tip {
      font-size: 12px;
      color: #8C8C8C;
      text-align: center;
      
      .highlight {
        color: #FF6B35;
        font-weight: 600;
      }
    }
  }
  
  // 实名认证状态
  .auth-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 8px 12px;
    background: #F5F5F5;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #EBEBEB;
    }
    
    .auth-icon {
      font-size: 16px;
      
      &.verified {
        color: #52c41a;
      }
      
      &.unverified {
        color: #FA8C16;
      }
    }
    
    .auth-text {
      flex: 1;
      font-size: 14px;
      
      &.verified {
        color: #52c41a;
      }
      
      &.unverified {
        color: #FA8C16;
      }
    }
    
    .arrow-icon {
      font-size: 12px;
      color: #8C8C8C;
    }
  }
}

// ========== 2. 快捷统计卡 ==========
.quick-stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px 16px;
  
  .stat-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:active {
      transform: scale(0.95);
    }
    
    .stat-value {
      font-size: 20px;
      font-weight: 600;
      color: #FF6B35;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #8C8C8C;
    }
  }
  
  .stat-divider {
    width: 1px;
    height: 32px;
    background: #E8E8E8;
  }
}

// ========== 3. 我的订单卡 ==========
.order-card {
  .order-status-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    
    .order-status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: transform 0.2s;
      
      &:active {
        transform: scale(0.95);
      }
      
      .status-icon-wrapper {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #FFE8E0 0%, #FFF5F2 100%);
        border-radius: 50%;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        
        // 添加光晕效果
        &::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .status-icon {
          font-size: 24px;
          color: #FF6B35;
          transition: transform 0.3s;
        }
      }
      
      &:hover .status-icon-wrapper {
        background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        transform: translateY(-2px);
        
        &::before {
          opacity: 1;
        }
        
        .status-icon {
          color: #FFFFFF;
          transform: scale(1.1);
        }
      }
      
      .status-label {
        font-size: 12px;
        color: #262626;
      }
    }
  }
}

// ========== 4. 常用功能卡 & 5. 设置与帮助卡 ==========
.common-features-card,
.settings-card {
  .feature-list {
    .feature-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #FAFAFA;
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      &:hover {
        background: #F0F0F0;
      }
      
      &:active {
        transform: scale(0.98);
        background: rgba(0, 0, 0, 0.05);
      }
      
      .feature-icon {
        font-size: 20px;
        margin-right: 12px;
      }
      
      .feature-name {
        flex: 1;
        font-size: 14px;
        color: #262626;
      }
      
      .feature-badge {
        font-size: 12px;
        color: #8C8C8C;
        margin-right: 8px;
        
        &.success {
          color: #52c41a;
        }
      }
      
      .feature-arrow {
        font-size: 12px;
        color: #8C8C8C;
      }
    }
    
    .expand-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px;
      margin-top: 8px;
      background: #FAFAFA;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: #F0F0F0;
      }
      
      .expand-icon {
        font-size: 12px;
        color: #8C8C8C;
        transition: transform 0.3s;
      }
      
      .expand-text {
        font-size: 14px;
        color: #8C8C8C;
      }
    }
  }
}

// ========== 退出登录按钮 ==========
.logout-section {
  margin-top: 12px;
  padding: 0 12px;
}

// ========== 响应式设计 ==========
@media (min-width: 768px) {
  .mine-page-redesigned {
    max-width: 600px;
    margin: 0 auto;
  }
}

// ========== 深色模式 ==========
@media (prefers-color-scheme: dark) {
  .mine-page-redesigned {
    background: #141414;
  }
  
  .section-card {
    background: #1F1F1F;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  }
  
  .card-header .card-title,
  .user-nickname,
  .status-label,
  .feature-label,
  .empty-title {
    color: #E8E8E8;
  }
  
  .user-phone,
  .stat-label,
  .feature-desc,
  .empty-description {
    color: #A6A6A6;
  }
  
  .feature-item {
    background: #2A2A2A;
    
    &:hover {
      background: #333333;
    }
  }
  
  .progress-bar {
    background: #2A2A2A;
  }
}

// ========== 动画效果 ==========
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>

