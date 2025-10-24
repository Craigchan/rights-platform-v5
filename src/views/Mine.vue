<template>
  <div class="mine-page">
    <!-- 1. 个人信息与会员卡区 -->
    <div class="profile-header">
      <div class="user-section">
        <div class="avatar"></div>
        <div class="user-info">
          <div class="nickname">张三</div>
          <div class="member-level" @click="goToMembership">
            <span class="level-badge gold">黄金会员</span>
            <RightOutlined style="font-size: 12px; margin-left: 5px;" />
          </div>
          <div class="auth-status">
            <CheckCircleFilled style="color: #52c41a; margin-right: 5px;" />
            <span>已实名认证</span>
          </div>
        </div>
      </div>
      <div class="quick-actions">
        <SettingOutlined class="action-icon" @click="goToSettings" />
      </div>
    </div>

    <!-- 2. 核心数据展示区 (四宫格) -->
    <div class="metrics-grid">
      <div class="metric-item" @click="goToPoints">
        <div class="metric-value">12,580</div>
        <div class="metric-label">我的积分</div>
        <div class="metric-action">点击查看明细</div>
      </div>
      <div class="metric-item" @click="goToVouchers">
        <div class="metric-value">5 张</div>
        <div class="metric-label">我的优惠券</div>
        <div class="metric-action">点击查看票券</div>
      </div>
      <div class="metric-item" @click="goToOrders">
        <div class="metric-value warn">3 笔待收货</div>
        <div class="metric-label">我的订单</div>
        <div class="metric-action">点击查看订单</div>
      </div>
      <div class="metric-item" @click="goToLottery">
        <div class="metric-value">2 次中奖</div>
        <div class="metric-label">中奖记录</div>
        <div class="metric-action">点击查看记录</div>
      </div>
    </div>

    <!-- 3. 订单管理区 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">我的订单</span>
        <span class="section-more" @click="goToOrders">查看全部 <RightOutlined /></span>
      </div>
      <div class="order-status-row">
        <div class="order-status-item" @click="goToOrderStatus('pending')">
          <a-badge :count="2">
            <WalletOutlined class="status-icon" />
          </a-badge>
          <div class="status-name">待支付</div>
        </div>
        <div class="order-status-item" @click="goToOrderStatus('shipped')">
          <a-badge :count="1">
            <ShoppingOutlined class="status-icon" />
          </a-badge>
          <div class="status-name">待发货</div>
        </div>
        <div class="order-status-item" @click="goToOrderStatus('delivering')">
          <a-badge :count="3">
            <CarOutlined class="status-icon" />
          </a-badge>
          <div class="status-name">待收货</div>
        </div>
        <div class="order-status-item" @click="goToOrderStatus('completed')">
          <CheckCircleOutlined class="status-icon" />
          <div class="status-name">已完成</div>
        </div>
        <div class="order-status-item" @click="goToOrderStatus('refund')">
          <a-badge :count="0">
            <CustomerServiceOutlined class="status-icon" />
          </a-badge>
          <div class="status-name">退款/售后</div>
        </div>
      </div>
    </div>

    <!-- 4. 我的资产区 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">我的资产</span>
      </div>
      <div class="menu-list">
        <div class="menu-item" @click="goToVouchers">
          <GiftOutlined class="menu-icon" style="color: #FF6B35;" />
          <span class="menu-name">我的票券</span>
          <span class="menu-badge">5 张未使用</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToPointsDetail">
          <TrophyOutlined class="menu-icon" style="color: #FFD700;" />
          <span class="menu-name">积分明细</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToRedeemRecords">
          <ShoppingOutlined class="menu-icon" style="color: #1890ff;" />
          <span class="menu-name">兑换记录</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToMyTickets">
          <FileImageOutlined class="menu-icon" style="color: #FFBE0B;" />
          <span class="menu-name">我的票根</span>
          <span class="menu-badge">3 张已通过</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToLotteryRecords">
          <StarOutlined class="menu-icon" style="color: #FF4444;" />
          <span class="menu-name">中奖记录</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToFavorites">
          <HeartOutlined class="menu-icon" style="color: #FF1493;" />
          <span class="menu-name">我的收藏</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToHistory">
          <HistoryOutlined class="menu-icon" style="color: #999;" />
          <span class="menu-name">浏览历史</span>
          <RightOutlined class="menu-arrow" />
        </div>
      </div>
    </div>

    <!-- 5. 常用工具区 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">常用工具</span>
      </div>
      <div class="menu-list">
        <div class="menu-item" @click="goToAddress">
          <EnvironmentOutlined class="menu-icon" style="color: #52c41a;" />
          <span class="menu-name">收货地址管理</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToAuth">
          <SafetyOutlined class="menu-icon" style="color: #1890ff;" />
          <span class="menu-name">实名认证</span>
          <span class="menu-badge success">已认证</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToInvoice">
          <FileTextOutlined class="menu-icon" style="color: #FA8C16;" />
          <span class="menu-name">我的发票</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToCustomerService">
          <CustomerServiceOutlined class="menu-icon" style="color: #722ED1;" />
          <span class="menu-name">客服中心</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToFeedback">
          <MessageOutlined class="menu-icon" style="color: #13C2C2;" />
          <span class="menu-name">意见反馈</span>
          <RightOutlined class="menu-arrow" />
        </div>
      </div>
    </div>

    <!-- 6. 设置与其他区 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">设置与帮助</span>
      </div>
      <div class="menu-list">
        <div class="menu-item" @click="goToAccountSettings">
          <UserOutlined class="menu-icon" style="color: #1890ff;" />
          <span class="menu-name">账号设置</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToNotificationSettings">
          <BellOutlined class="menu-icon" style="color: #FA8C16;" />
          <span class="menu-name">消息通知设置</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToPrivacySettings">
          <LockOutlined class="menu-icon" style="color: #52c41a;" />
          <span class="menu-name">隐私设置</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToAbout">
          <InfoCircleOutlined class="menu-icon" style="color: #666;" />
          <span class="menu-name">关于我们</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="goToHelp">
          <QuestionCircleOutlined class="menu-icon" style="color: #1890ff;" />
          <span class="menu-name">帮助中心</span>
          <RightOutlined class="menu-arrow" />
        </div>
        <div class="menu-item" @click="clearCache">
          <DeleteOutlined class="menu-icon" style="color: #FF4444;" />
          <span class="menu-name">清除缓存</span>
          <RightOutlined class="menu-arrow" />
        </div>
      </div>
    </div>

    <!-- 7. 退出登录按钮 -->
    <div class="logout-section">
      <a-button block size="large" danger type="text" @click="handleLogout">
        退出登录
      </a-button>
    </div>

    <!-- 会员权益弹窗 -->
    <a-modal
      v-model:open="showMemberModal"
      title="会员权益"
      :footer="null"
      width="90%"
    >
      <div class="member-modal">
        <div class="current-level">
          <div class="level-badge-large gold">黄金会员</div>
          <div class="level-desc">尊享多重特权</div>
        </div>

        <div class="benefits-list">
          <div class="benefit-item">
            <CheckCircleFilled style="color: #52c41a; margin-right: 10px;" />
            <span>积分获取倍率：1.2 倍</span>
          </div>
          <div class="benefit-item">
            <CheckCircleFilled style="color: #52c41a; margin-right: 10px;" />
            <span>每月专属优惠券：5 张</span>
          </div>
          <div class="benefit-item">
            <CheckCircleFilled style="color: #52c41a; margin-right: 10px;" />
            <span>专属客服通道</span>
          </div>
          <div class="benefit-item">
            <CheckCircleFilled style="color: #52c41a; margin-right: 10px;" />
            <span>生日专属礼包</span>
          </div>
        </div>

        <div class="upgrade-section">
          <div class="upgrade-title">升级进度</div>
          <a-progress :percent="60" />
          <div class="upgrade-tip">再消费 500 元即可升级至钻石会员</div>
        </div>

        <a-button type="link" block @click="showMemberRules">
          查看会员规则 <RightOutlined />
        </a-button>
      </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  SettingOutlined,
  RightOutlined,
  CheckCircleFilled,
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
  FileImageOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const showMemberModal = ref(false)
const showLogoutModal = ref(false)

// 导航方法
const goToSettings = () => {
  router.push('/account-settings')
}
const goToMembership = () => {
  router.push('/membership')
}

const goToPoints = () => {
  router.push('/earn-points')
}

const goToVouchers = () => {
  router.push('/vouchers')
}

const goToOrders = () => {
  router.push('/orders')
}

const goToLottery = () => {
  message.info('跳转到中奖记录页')
}

const goToOrderStatus = (status: string) => {
  // 映射状态到订单列表的Tab
  const statusMap: Record<string, string> = {
    'pending': 'pending_payment',
    'shipped': 'pending_delivery',
    'delivering': 'pending_receipt',
    'completed': 'completed',
    'refund': 'all'
  }
  router.push(`/orders?status=${statusMap[status] || 'all'}`)
}

const goToPointsDetail = () => {
  router.push('/points-detail')
}

const goToRedeemRecords = () => {
  router.push('/redeem-records')
}

const goToMyTickets = () => {
  router.push('/my-tickets')
}

const goToLotteryRecords = () => {
  router.push('/lottery-records')
}

const goToFavorites = () => {
  router.push('/favorites')
}

const goToHistory = () => {
  router.push('/history')
}

const goToAddress = () => {
  router.push('/address')
}

const goToAuth = () => {
  router.push('/real-name-auth')
  // 旧代码:message.info('跳转到实名认证页')
}

const goToInvoice = () => {
  router.push('/invoice')
}

const goToCustomerService = () => {
  router.push('/customer-service')
}

const goToFeedback = () => {
  router.push('/feedback')
}

const goToAccountSettings = () => {
  router.push('/account-settings')
}

const goToNotificationSettings = () => {
  router.push('/notification-settings')
}

const goToPrivacySettings = () => {
  router.push('/privacy-settings')
}

const goToAbout = () => {
  router.push('/about')
}

const goToHelp = () => {
  router.push('/help-center')
}

const clearCache = () => {
  message.success('缓存已清除')
}

const showMemberRules = () => {
  message.info('查看会员规则')
}

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  showLogoutModal.value = false
  message.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 1. 个人信息与会员卡区 */
.profile-header {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  padding: 40px 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #fff;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.member-level {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.level-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.level-badge.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #fff;
}

.auth-status {
  font-size: 13px;
  opacity: 0.9;
  display: flex;
  align-items: center;
}

.quick-actions {
  display: flex;
  gap: 15px;
}

.action-icon {
  font-size: 20px;
  cursor: pointer;
  opacity: 0.9;
}

.action-icon:hover {
  opacity: 1;
}

/* 2. 核心数据展示区 (四宫格) */
.metrics-grid {
  background: #fff;
  margin: -20px 15px 15px;
  border-radius: 12px;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.metric-item {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s;
}

.metric-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.metric-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}

.metric-value.warn {
  color: #FF6B35;
}

.metric-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.metric-action {
  font-size: 11px;
  color: #999;
}

/* 3-6. 卡片区域 */
.section-card {
  background: #fff;
  margin: 0 15px 15px;
  border-radius: 12px;
  padding: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-more {
  font-size: 13px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 订单状态行 */
.order-status-row {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}

.order-status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.status-icon {
  font-size: 24px;
  color: #666;
}

.status-name {
  font-size: 12px;
  color: #666;
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
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f9f9f9;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.menu-badge {
  font-size: 12px;
  color: #FF6B35;
  margin-right: 8px;
}

.menu-badge.success {
  color: #52c41a;
}

.menu-arrow {
  font-size: 12px;
  color: #999;
}

/* 7. 退出登录按钮 */
.logout-section {
  background: #fff;
  margin: 0 15px;
  border-radius: 12px;
  padding: 15px;
}

/* 会员权益弹窗 */
.member-modal {
  padding: 10px 0;
}

.current-level {
  text-align: center;
  margin-bottom: 20px;
}

.level-badge-large {
  display: inline-block;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.level-badge-large.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #fff;
}

.level-desc {
  font-size: 14px;
  color: #666;
}

.benefits-list {
  margin-bottom: 20px;
}

.benefit-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  font-size: 14px;
  color: #333;
}

.upgrade-section {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.upgrade-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.upgrade-tip {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}
</style>

