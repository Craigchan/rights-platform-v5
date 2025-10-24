<template>
  <div class="mine-page">
    <!-- 用户信息卡 -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-section" @click="showAvatarPreview = true">
          <img v-img-fallback :src="userInfo.avatar" alt="头像" class="avatar" />
          <div class="avatar-edit" @click.stop="showAvatarUpload = true">
            <CameraOutlined />
          </div>
        </div>
        
        <div class="user-info">
          <div class="user-name" @click="showEditProfile = true">
            <span class="nickname">{{ userInfo.username }}</span>
            <EditOutlined class="edit-icon" />
          </div>
          <div class="user-phone">{{ userInfo.phone }}</div>
          
          <!-- 会员等级 -->
          <div class="member-level" @click="goToMembership">
            <span class="level-badge" :class="levelClass">
              <CrownOutlined />
              {{ levelName }}
            </span>
            <RightOutlined class="arrow-icon" />
          </div>
        </div>
        
        <div class="header-actions">
          <SettingOutlined class="action-icon" @click="goToSettings" />
        </div>
      </div>
      
      <!-- 会员等级进度条 -->
      <div class="level-progress-section">
        <div class="progress-header">
          <span class="current-level">{{ levelName }}</span>
          <span class="next-level">{{ nextLevelName }}</span>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: levelProgress + '%' }"
              :class="{ 'animate': progressAnimating }"
            ></div>
          </div>
          <span class="progress-text">{{ levelProgress }}%</span>
        </div>
        <div class="progress-tip">
          再获得 {{ pointsToNextLevel }} 积分即可升级
        </div>
      </div>
      
      <!-- 实名认证状态 -->
      <div class="auth-status" @click="goToAuth">
        <div class="auth-info">
          <SafetyCertificateOutlined 
            :class="['auth-icon', userInfo.isVerified ? 'verified' : 'unverified']" 
          />
          <span :class="['auth-text', userInfo.isVerified ? 'verified' : 'unverified']">
            {{ userInfo.isVerified ? '已实名认证' : '未实名认证' }}
          </span>
        </div>
        <RightOutlined class="arrow-icon" />
      </div>
    </div>

    <!-- 快捷统计 -->
    <div class="quick-stats">
      <div class="stat-item" @click="goToPointsDetail">
        <div class="stat-value">
          <CountUp :end-value="userInfo.points" :duration="1000" />
        </div>
        <div class="stat-label">我的积分</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item" @click="goToVouchers">
        <div class="stat-value">{{ voucherCount }}</div>
        <div class="stat-label">优惠券</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item" @click="goToFavorites">
        <div class="stat-value">{{ favoriteCount }}</div>
        <div class="stat-label">收藏</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item" @click="goToHistory">
        <div class="stat-value">{{ historyCount }}</div>
        <div class="stat-label">足迹</div>
      </div>
    </div>

    <!-- 我的订单 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">我的订单</span>
        <span class="section-more" @click="goToOrders()">
          查看全部 <RightOutlined />
        </span>
      </div>
      <div class="order-status-row">
        <div 
          v-for="status in orderStatuses" 
          :key="status.key"
          class="order-status-item"
          @click="goToOrders(status.key)"
        >
          <a-badge :count="status.count" :overflow-count="99">
            <component :is="status.icon" class="status-icon" />
          </a-badge>
          <div class="status-name">{{ status.name }}</div>
        </div>
      </div>
    </div>

    <!-- 我的资产 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">我的资产</span>
      </div>
      <div class="menu-list">
        <div 
          v-for="item in assetMenus" 
          :key="item.key"
          class="menu-item"
          @click="handleMenuClick(item.key)"
        >
          <component :is="item.icon" class="menu-icon" :style="{ color: item.color }" />
          <span class="menu-name">{{ item.name }}</span>
          <span v-if="item.badge" class="menu-badge" :class="item.badgeType">
            {{ item.badge }}
          </span>
          <RightOutlined class="menu-arrow" />
        </div>
      </div>
    </div>

    <!-- 常用工具 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">常用工具</span>
      </div>
      <div class="menu-list">
        <div 
          v-for="item in toolMenus" 
          :key="item.key"
          class="menu-item"
          @click="handleMenuClick(item.key)"
        >
          <component :is="item.icon" class="menu-icon" :style="{ color: item.color }" />
          <span class="menu-name">{{ item.name }}</span>
          <span v-if="item.badge" class="menu-badge" :class="item.badgeType">
            {{ item.badge }}
          </span>
          <RightOutlined class="menu-arrow" />
        </div>
      </div>
    </div>

    <!-- 设置与帮助 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">设置与帮助</span>
      </div>
      <div class="menu-list">
        <div 
          v-for="item in settingMenus" 
          :key="item.key"
          class="menu-item"
          @click="handleMenuClick(item.key)"
        >
          <component :is="item.icon" class="menu-icon" :style="{ color: item.color }" />
          <span class="menu-name">{{ item.name }}</span>
          <RightOutlined class="menu-arrow" />
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <a-button block size="large" danger type="text" @click="handleLogout">
        退出登录
      </a-button>
    </div>

    <!-- 头像预览弹窗 -->
    <a-modal
      v-model:open="showAvatarPreview"
      :footer="null"
      :closable="false"
      centered
      width="80%"
      class="avatar-preview-modal"
    >
      <img v-img-fallback :src="userInfo.avatar" alt="头像" class="avatar-preview-image" />
    </a-modal>

    <!-- 头像上传弹窗 -->
    <a-modal
      v-model:open="showAvatarUpload"
      title="更换头像"
      @ok="handleAvatarUpload"
      @cancel="showAvatarUpload = false"
    >
      <a-upload
        v-model:file-list="avatarFileList"
        list-type="picture-card"
        :max-count="1"
        :before-upload="beforeAvatarUpload"
      >
        <div>
          <PlusOutlined />
          <div style="margin-top: 8px">上传头像</div>
        </div>
      </a-upload>
      <div class="upload-tip">
        建议上传正方形图片，大小不超过2MB
      </div>
    </a-modal>

    <!-- 个人信息编辑弹窗 -->
    <a-modal
      v-model:open="showEditProfile"
      title="编辑个人信息"
      @ok="handleSaveProfile"
      @cancel="showEditProfile = false"
      width="90%"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="昵称">
          <a-input v-model:value="editForm.username" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="性别">
          <a-radio-group v-model:value="editForm.gender">
            <a-radio value="male">男</a-radio>
            <a-radio value="female">女</a-radio>
            <a-radio value="other">保密</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="生日">
          <a-date-picker 
            v-model:value="editForm.birthday" 
            placeholder="请选择生日"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="地址">
          <a-textarea 
            v-model:value="editForm.address" 
            placeholder="请输入地址"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 退出登录确认弹窗 -->
    <a-modal
      v-model:open="showLogoutModal"
      title="退出登录"
      @ok="confirmLogout"
      @cancel="showLogoutModal = false"
    >
      <p>确定要退出登录吗？</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '../stores/user'
import CountUp from '../components/CountUp.vue'
import {
  SettingOutlined,
  RightOutlined,
  CameraOutlined,
  EditOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
  ShoppingOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  TrophyOutlined,
  StarOutlined,
  HeartOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  FileTextOutlined,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  LockOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo || {
  id: 10001,
  username: '张伟',
  phone: '138****5678',
  avatar: 'https://i.pravatar.cc/150?img=12',
  points: 8888,
  level: 5,
  isVerified: true,
  gender: 'male',
  birthday: '1990-01-01',
  address: '江苏省南京市鼓楼区中山路123号'
})

// 会员等级相关
const levelName = computed(() => userStore.levelName)
const levelProgress = computed(() => Math.round(userStore.levelProgress))
const progressAnimating = ref(false)

const levelClass = computed(() => {
  const level = userInfo.value.level
  if (level >= 10) return 'diamond'
  if (level >= 7) return 'gold'
  if (level >= 4) return 'silver'
  if (level >= 1) return 'bronze'
  return 'normal'
})

const nextLevelName = computed(() => {
  const level = userInfo.value.level
  if (level >= 10) return '钻石会员'
  if (level >= 7) return '钻石会员'
  if (level >= 4) return '黄金会员'
  if (level >= 1) return '白银会员'
  return '青铜会员'
})

const pointsToNextLevel = computed(() => {
  const level = userInfo.value.level
  const nextLevelPoints = (level + 1) * 1000
  const currentPoints = userInfo.value.points
  return Math.max(0, nextLevelPoints - currentPoints)
})

// 快捷统计数据
const voucherCount = ref(5)
const favoriteCount = ref(23)
const historyCount = ref(156)

// 订单状态
const orderStatuses = ref([
  { key: 'pending', name: '待支付', icon: WalletOutlined, count: 2 },
  { key: 'shipped', name: '待发货', icon: ShoppingOutlined, count: 1 },
  { key: 'delivering', name: '待收货', icon: CarOutlined, count: 3 },
  { key: 'completed', name: '已完成', icon: CheckCircleOutlined, count: 0 },
  { key: 'refund', name: '退款/售后', icon: CustomerServiceOutlined, count: 0 }
])

// 我的资产菜单
const assetMenus = ref([
  { 
    key: 'vouchers', 
    name: '我的票券', 
    icon: GiftOutlined, 
    color: '#FF6B35',
    badge: '5张未使用',
    badgeType: 'warn'
  },
  { 
    key: 'points', 
    name: '积分明细', 
    icon: TrophyOutlined, 
    color: '#FFD700'
  },
  { 
    key: 'lottery', 
    name: '中奖记录', 
    icon: StarOutlined, 
    color: '#FF4444'
  },
  { 
    key: 'favorites', 
    name: '我的收藏', 
    icon: HeartOutlined, 
    color: '#FF1493',
    badge: '23',
    badgeType: 'default'
  },
  { 
    key: 'history', 
    name: '浏览历史', 
    icon: HistoryOutlined, 
    color: '#999',
    badge: '156',
    badgeType: 'default'
  }
])

// 常用工具菜单
const toolMenus = ref([
  { 
    key: 'address', 
    name: '收货地址', 
    icon: EnvironmentOutlined, 
    color: '#52c41a'
  },
  { 
    key: 'auth', 
    name: '实名认证', 
    icon: SafetyOutlined, 
    color: '#1890ff',
    badge: userInfo.value.isVerified ? '已认证' : '未认证',
    badgeType: userInfo.value.isVerified ? 'success' : 'warn'
  },
  { 
    key: 'invoice', 
    name: '我的发票', 
    icon: FileTextOutlined, 
    color: '#FA8C16'
  },
  { 
    key: 'service', 
    name: '客服中心', 
    icon: CustomerServiceOutlined, 
    color: '#722ED1'
  },
  { 
    key: 'feedback', 
    name: '意见反馈', 
    icon: MessageOutlined, 
    color: '#13C2C2'
  }
])

// 设置与帮助菜单
const settingMenus = ref([
  { 
    key: 'account', 
    name: '账号设置', 
    icon: UserOutlined, 
    color: '#1890ff'
  },
  { 
    key: 'notification', 
    name: '消息通知', 
    icon: BellOutlined, 
    color: '#FA8C16'
  },
  { 
    key: 'privacy', 
    name: '隐私设置', 
    icon: LockOutlined, 
    color: '#52c41a'
  },
  { 
    key: 'about', 
    name: '关于我们', 
    icon: InfoCircleOutlined, 
    color: '#666'
  },
  { 
    key: 'help', 
    name: '帮助中心', 
    icon: QuestionCircleOutlined, 
    color: '#1890ff'
  },
  { 
    key: 'cache', 
    name: '清除缓存', 
    icon: DeleteOutlined, 
    color: '#FF4444'
  }
])

// 弹窗状态
const showAvatarPreview = ref(false)
const showAvatarUpload = ref(false)
const showEditProfile = ref(false)
const showLogoutModal = ref(false)

// 头像上传
const avatarFileList = ref([])

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件！')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB！')
    return false
  }
  return false // 阻止自动上传
}

const handleAvatarUpload = () => {
  if (avatarFileList.value.length === 0) {
    message.warning('请先选择图片')
    return
  }
  
  // 模拟上传
  message.loading('上传中...', 1)
  setTimeout(() => {
    // 这里应该调用真实的上传API
    const newAvatar = 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
    userStore.updateAvatar(newAvatar)
    message.success('头像更新成功')
    showAvatarUpload.value = false
    avatarFileList.value = []
  }, 1000)
}

// 个人信息编辑
const editForm = ref({
  username: userInfo.value.username,
  gender: userInfo.value.gender || 'male',
  birthday: userInfo.value.birthday,
  address: userInfo.value.address
})

const handleSaveProfile = () => {
  message.loading('保存中...', 1)
  setTimeout(() => {
    // 这里应该调用真实的API
    Object.assign(userInfo.value, editForm.value)
    message.success('保存成功')
    showEditProfile.value = false
  }, 1000)
}

// 菜单点击处理
const handleMenuClick = (key: string) => {
  const routes: Record<string, string> = {
    vouchers: '/vouchers',
    points: '/points-detail',
    lottery: '/lottery-records',
    favorites: '/favorites',
    history: '/history',
    address: '/address',
    auth: '/real-name-auth',
    invoice: '/invoice',
    service: '/customer-service',
    feedback: '/feedback',
    account: '/account-settings',
    notification: '/notification-settings',
    privacy: '/privacy-settings',
    about: '/about',
    help: '/help-center'
  }
  
  if (key === 'cache') {
    handleClearCache()
    return
  }
  
  if (routes[key]) {
    router.push(routes[key])
  } else {
    message.info('功能开发中...')
  }
}

// 页面跳转
const goToMembership = () => {
  router.push('/membership')
}

const goToSettings = () => {
  router.push('/settings')
}

const goToAuth = () => {
  router.push('/real-name-auth')
}

const goToPointsDetail = () => {
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

const goToOrders = (status?: string) => {
  if (status) {
    router.push(`/orders?status=${status}`)
  } else {
    router.push('/orders')
  }
}

// 清除缓存
const handleClearCache = () => {
  message.loading('清除中...', 1)
  setTimeout(() => {
    message.success('缓存清除成功')
  }, 1000)
}

// 退出登录
const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  message.loading('退出中...', 1)
  setTimeout(() => {
    userStore.logout()
    message.success('已退出登录')
    showLogoutModal.value = false
    router.push('/login')
  }, 1000)
}

// 初始化
onMounted(() => {
  // 初始化用户store
  userStore.init()
  
  // 触发进度条动画
  setTimeout(() => {
    progressAnimating.value = true
  }, 300)
  
  // 模拟加载数据
  // 这里应该调用真实的API获取统计数据
})
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background: var(--color-bg-light);
  padding-bottom: 20px;
}

/* 用户信息卡 */
.profile-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: 20px;
  color: white;
  margin-bottom: 12px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.avatar-section {
  position: relative;
  margin-right: 15px;
  cursor: pointer;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: all var(--transition-normal);
}

.avatar-section:active .avatar {
  transform: scale(0.95);
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: 2px solid white;
  transition: all var(--transition-normal);
}

.avatar-edit:active {
  transform: scale(0.9);
}

.user-info {
  flex: 1;
}

.user-name {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
}

.nickname {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-right: 8px;
}

.edit-icon {
  font-size: 14px;
  opacity: 0.8;
}

.user-phone {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin-bottom: 10px;
}

.member-level {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.member-level:active {
  transform: scale(0.95);
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.level-badge.diamond {
  background: linear-gradient(135deg, #B9F2FF 0%, #66D9EF 100%);
  color: #0066CC;
}

.level-badge.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #8B4513;
}

.level-badge.silver {
  background: linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 100%);
  color: #666;
}

.level-badge.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #B87333 100%);
  color: white;
}

.arrow-icon {
  font-size: 12px;
  margin-left: 5px;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  align-items: center;
}

.action-icon {
  font-size: 20px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.action-icon:active {
  transform: scale(0.9);
}

/* 会员等级进度条 */
.level-progress-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: 15px;
  margin-bottom: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: var(--font-size-sm);
}

.current-level {
  font-weight: var(--font-weight-semibold);
}

.next-level {
  opacity: 0.8;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
  border-radius: var(--radius-full);
  transition: width 1s ease-out;
}

.progress-fill.animate {
  animation: progressGlow 2s ease-in-out infinite;
}

@keyframes progressGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
  }
}

.progress-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  min-width: 40px;
  text-align: right;
}

.progress-tip {
  font-size: var(--font-size-xs);
  opacity: 0.8;
  text-align: center;
}

/* 实名认证状态 */
.auth-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: 12px 15px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.auth-status:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.2);
}

.auth-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-icon {
  font-size: 18px;
}

.auth-icon.verified {
  color: #52c41a;
}

.auth-icon.unverified {
  color: #faad14;
}

.auth-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.auth-text.verified {
  color: white;
}

.auth-text.unverified {
  color: rgba(255, 255, 255, 0.9);
}

/* 快捷统计 */
.quick-stats {
  display: flex;
  align-items: center;
  background: white;
  padding: 20px 0;
  margin-bottom: 12px;
}

.stat-item {
  flex: 1;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.stat-item:active {
  transform: scale(0.95);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: 5px;
  font-family: var(--font-family-number);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--color-border);
}

/* 区块卡片 */
.section-card {
  background: white;
  margin-bottom: 12px;
  padding: 15px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.section-more {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all var(--transition-normal);
}

.section-more:active {
  color: var(--color-primary);
}

/* 订单状态行 */
.order-status-row {
  display: flex;
  justify-content: space-around;
}

.order-status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.order-status-item:active {
  transform: scale(0.95);
}

.status-icon {
  font-size: 24px;
  color: var(--color-text-primary);
}

.status-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* 菜单列表 */
.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: var(--color-bg-light);
  transform: scale(0.98);
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-name {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.menu-badge {
  font-size: var(--font-size-sm);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  margin-right: 8px;
}

.menu-badge.default {
  color: var(--color-text-secondary);
  background: var(--color-bg-light);
}

.menu-badge.success {
  color: var(--color-success);
  background: rgba(82, 196, 26, 0.1);
}

.menu-badge.warn {
  color: var(--color-warning);
  background: rgba(250, 173, 20, 0.1);
}

.menu-arrow {
  font-size: 12px;
  color: var(--color-text-placeholder);
}

/* 退出登录 */
.logout-section {
  padding: 20px;
}

/* 头像预览弹窗 */
.avatar-preview-modal :deep(.ant-modal-body) {
  padding: 0;
}

.avatar-preview-image {
  width: 100%;
  display: block;
}

/* 上传提示 */
.upload-tip {
  margin-top: 10px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}
</style>

