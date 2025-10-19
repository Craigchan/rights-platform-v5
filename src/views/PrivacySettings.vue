<template>
  <div class="privacy-settings-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">隐私设置</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 个人信息可见性 -->
    <div class="section-card">
      <div class="section-header">
        <LockOutlined class="section-icon" />
        <span class="section-title">个人信息可见性</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">显示真实姓名</div>
          <div class="setting-desc">在评价、咨询等场景显示真实姓名</div>
        </div>
        <a-switch v-model:checked="privacy.showRealName" @change="saveSettings" />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">显示手机号</div>
          <div class="setting-desc">允许商家查看您的手机号</div>
        </div>
        <a-switch v-model:checked="privacy.showPhone" @change="saveSettings" />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">显示头像</div>
          <div class="setting-desc">在公开场景显示您的头像</div>
        </div>
        <a-switch v-model:checked="privacy.showAvatar" @change="saveSettings" />
      </div>
    </div>

    <!-- 活动记录 -->
    <div class="section-card">
      <div class="section-header">
        <HistoryOutlined class="section-icon" />
        <span class="section-title">活动记录</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">保存浏览历史</div>
          <div class="setting-desc">记录您浏览过的商品和页面</div>
        </div>
        <a-switch v-model:checked="privacy.saveBrowseHistory" @change="saveSettings" />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">保存搜索历史</div>
          <div class="setting-desc">记录您的搜索关键词</div>
        </div>
        <a-switch v-model:checked="privacy.saveSearchHistory" @change="saveSettings" />
      </div>

      <div class="setting-item clickable" @click="clearHistory">
        <div class="setting-info">
          <div class="setting-label">清除历史记录</div>
          <div class="setting-desc">清除浏览和搜索历史</div>
        </div>
        <RightOutlined class="arrow-icon" />
      </div>
    </div>

    <!-- 数据使用 -->
    <div class="section-card">
      <div class="section-header">
        <DatabaseOutlined class="section-icon" />
        <span class="section-title">数据使用</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">个性化推荐</div>
          <div class="setting-desc">根据您的偏好推荐商品和活动</div>
        </div>
        <a-switch v-model:checked="privacy.personalization" @change="saveSettings" />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">数据分析</div>
          <div class="setting-desc">允许使用您的数据进行统计分析</div>
        </div>
        <a-switch v-model:checked="privacy.analytics" @change="saveSettings" />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">第三方数据共享</div>
          <div class="setting-desc">与合作伙伴共享必要数据</div>
        </div>
        <a-switch v-model:checked="privacy.thirdPartySharing" @change="saveSettings" />
      </div>
    </div>

    <!-- 位置信息 -->
    <div class="section-card">
      <div class="section-header">
        <EnvironmentOutlined class="section-icon" />
        <span class="section-title">位置信息</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">允许获取位置</div>
          <div class="setting-desc">用于推荐附近商家和活动</div>
        </div>
        <a-switch v-model:checked="privacy.location" @change="saveSettings" />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">后台定位</div>
          <div class="setting-desc">应用在后台时也可获取位置</div>
        </div>
        <a-switch 
          v-model:checked="privacy.backgroundLocation" 
          :disabled="!privacy.location"
          @change="saveSettings" 
        />
      </div>
    </div>

    <!-- 账号安全 -->
    <div class="section-card">
      <div class="section-header">
        <SafetyOutlined class="section-icon" />
        <span class="section-title">账号安全</span>
      </div>
      
      <div class="setting-item clickable" @click="viewLoginDevices">
        <div class="setting-info">
          <div class="setting-label">登录设备管理</div>
          <div class="setting-desc">查看和管理已登录的设备</div>
        </div>
        <RightOutlined class="arrow-icon" />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">登录保护</div>
          <div class="setting-desc">异地登录时需要验证</div>
        </div>
        <a-switch v-model:checked="privacy.loginProtection" @change="saveSettings" />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">支付密码</div>
          <div class="setting-desc">支付时需要输入密码</div>
        </div>
        <a-switch v-model:checked="privacy.paymentPassword" @change="saveSettings" />
      </div>
    </div>

    <!-- 隐私政策 -->
    <div class="section-card">
      <div class="section-header">
        <FileTextOutlined class="section-icon" />
        <span class="section-title">隐私政策</span>
      </div>
      
      <div class="setting-item clickable" @click="viewPrivacyPolicy">
        <div class="setting-info">
          <div class="setting-label">隐私政策</div>
          <div class="setting-desc">查看完整的隐私政策</div>
        </div>
        <RightOutlined class="arrow-icon" />
      </div>

      <div class="setting-item clickable" @click="viewUserAgreement">
        <div class="setting-info">
          <div class="setting-label">用户协议</div>
          <div class="setting-desc">查看用户服务协议</div>
        </div>
        <RightOutlined class="arrow-icon" />
      </div>

      <div class="setting-item clickable" @click="downloadData">
        <div class="setting-info">
          <div class="setting-label">下载我的数据</div>
          <div class="setting-desc">导出您在平台的所有数据</div>
        </div>
        <RightOutlined class="arrow-icon" />
      </div>

      <div class="setting-item clickable danger" @click="deleteAccount">
        <div class="setting-info">
          <div class="setting-label">注销账号</div>
          <div class="setting-desc">永久删除账号和所有数据</div>
        </div>
        <RightOutlined class="arrow-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  LeftOutlined,
  LockOutlined,
  HistoryOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  FileTextOutlined,
  RightOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 隐私设置
const privacy = ref({
  // 个人信息可见性
  showRealName: false,
  showPhone: false,
  showAvatar: true,
  // 活动记录
  saveBrowseHistory: true,
  saveSearchHistory: true,
  // 数据使用
  personalization: true,
  analytics: true,
  thirdPartySharing: false,
  // 位置信息
  location: true,
  backgroundLocation: false,
  // 账号安全
  loginProtection: true,
  paymentPassword: true
})

// 保存设置
const saveSettings = () => {
  setTimeout(() => {
    message.success('设置已保存')
  }, 300)
}

// 清除历史记录
const clearHistory = () => {
  Modal.confirm({
    title: '清除历史记录',
    content: '确定要清除所有浏览和搜索历史吗?此操作不可恢复。',
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      message.success('历史记录已清除')
    }
  })
}

// 查看登录设备
const viewLoginDevices = () => {
  message.info('查看登录设备管理')
}

// 查看隐私政策
const viewPrivacyPolicy = () => {
  message.info('查看隐私政策')
}

// 查看用户协议
const viewUserAgreement = () => {
  message.info('查看用户协议')
}

// 下载数据
const downloadData = () => {
  Modal.confirm({
    title: '下载我的数据',
    content: '我们将在3个工作日内将您的数据打包发送到您的邮箱。',
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      message.success('数据导出请求已提交')
    }
  })
}

// 注销账号
const deleteAccount = () => {
  Modal.confirm({
    title: '注销账号',
    content: '注销账号后,您的所有数据将被永久删除,且无法恢复。确定要继续吗?',
    okText: '确定注销',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      message.error('账号注销功能暂未开放,请联系客服')
    }
  })
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.privacy-settings-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.header-placeholder {
  width: 20px;
}

/* 设置卡片 */
.section-card {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 18px;
  color: #FF6B35;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.clickable {
  cursor: pointer;
  transition: all 0.3s;
}

.setting-item.clickable:active {
  background: #f5f5f5;
}

.setting-item.danger .setting-label {
  color: #ff4d4f;
}

.setting-info {
  flex: 1;
  min-width: 0;
}

.setting-label {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
}

.arrow-icon {
  font-size: 14px;
  color: #bbb;
}

/* 响应式 */
@media (min-width: 768px) {
  .privacy-settings-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

