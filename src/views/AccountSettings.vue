<template>
  <div class="account-settings-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">账号设置</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 头像设置 -->
    <div class="section-card">
      <div class="setting-item" @click="showAvatarModal = true">
        <span class="setting-label">头像</span>
        <div class="setting-value">
          <img :src="userInfo.avatar" alt="头像" class="avatar-preview" />
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="section-card">
      <div class="setting-item" @click="editNickname">
        <span class="setting-label">昵称</span>
        <div class="setting-value">
          <span class="value-text">{{ userInfo.nickname }}</span>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
      <div class="setting-item">
        <span class="setting-label">手机号</span>
        <div class="setting-value">
          <span class="value-text">{{ userInfo.phone }}</span>
          <a-button type="link" size="small" @click="changePhone">更换</a-button>
        </div>
      </div>
      <div class="setting-item" @click="editGender">
        <span class="setting-label">性别</span>
        <div class="setting-value">
          <span class="value-text">{{ genderText }}</span>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
      <div class="setting-item" @click="editBirthday">
        <span class="setting-label">生日</span>
        <div class="setting-value">
          <span class="value-text">{{ userInfo.birthday || '未设置' }}</span>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
    </div>

    <!-- 账号安全 -->
    <div class="section-card">
      <div class="section-title">账号安全</div>
      <div class="setting-item" @click="changePassword">
        <span class="setting-label">
          <LockOutlined class="label-icon" />
          修改密码
        </span>
        <RightOutlined class="arrow-icon" />
      </div>
      <div class="setting-item" @click="bindEmail">
        <span class="setting-label">
          <MailOutlined class="label-icon" />
          绑定邮箱
        </span>
        <div class="setting-value">
          <span class="value-text">{{ userInfo.email || '未绑定' }}</span>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
      <div class="setting-item" @click="bindWechat">
        <span class="setting-label">
          <WechatOutlined class="label-icon" />
          绑定微信
        </span>
        <div class="setting-value">
          <span class="value-text">{{ userInfo.wechat ? '已绑定' : '未绑定' }}</span>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
    </div>

    <!-- 其他设置 -->
    <div class="section-card">
      <div class="section-title">其他设置</div>
      <div class="setting-item">
        <span class="setting-label">语言</span>
        <div class="setting-value">
          <span class="value-text">简体中文</span>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
      <div class="setting-item">
        <span class="setting-label">地区</span>
        <div class="setting-value">
          <span class="value-text">中国大陆</span>
          <RightOutlined class="arrow-icon" />
        </div>
      </div>
    </div>

    <!-- 头像上传弹窗 -->
    <a-modal
      v-model:open="showAvatarModal"
      title="更换头像"
      :footer="null"
    >
      <a-upload
        :before-upload="beforeAvatarUpload"
        :show-upload-list="false"
        accept="image/*"
      >
        <a-button block type="primary">
          <UploadOutlined /> 选择图片
        </a-button>
      </a-upload>
      <div class="upload-tip">支持 JPG、PNG 格式,大小不超过 2MB</div>
    </a-modal>

    <!-- 昵称编辑弹窗 -->
    <a-modal
      v-model:open="showNicknameModal"
      title="修改昵称"
      @ok="saveNickname"
    >
      <a-input 
        v-model:value="editingNickname" 
        placeholder="请输入昵称"
        :maxlength="20"
      />
      <div class="input-tip">2-20个字符</div>
    </a-modal>

    <!-- 性别选择弹窗 -->
    <a-modal
      v-model:open="showGenderModal"
      title="选择性别"
      @ok="saveGender"
    >
      <a-radio-group v-model:value="editingGender">
        <a-radio :value="1">男</a-radio>
        <a-radio :value="2">女</a-radio>
        <a-radio :value="0">保密</a-radio>
      </a-radio-group>
    </a-modal>

    <!-- 生日选择弹窗 -->
    <a-modal
      v-model:open="showBirthdayModal"
      title="选择生日"
      @ok="saveBirthday"
    >
      <a-date-picker 
        v-model:value="editingBirthday" 
        style="width: 100%"
        placeholder="请选择生日"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  RightOutlined,
  LockOutlined,
  MailOutlined,
  WechatOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'

const router = useRouter()

// 用户信息
const userInfo = ref({
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  nickname: '张三',
  phone: '138****5678',
  gender: 1, // 0:保密 1:男 2:女
  birthday: '1990-01-01',
  email: '',
  wechat: false
})

// 弹窗状态
const showAvatarModal = ref(false)
const showNicknameModal = ref(false)
const showGenderModal = ref(false)
const showBirthdayModal = ref(false)

// 编辑中的数据
const editingNickname = ref('')
const editingGender = ref(0)
const editingBirthday = ref<Dayjs | null>(null)

// 性别文本
const genderText = computed(() => {
  const genderMap: Record<number, string> = {
    0: '保密',
    1: '男',
    2: '女'
  }
  return genderMap[userInfo.value.gender] || '保密'
})

// 头像上传前验证
const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }
  
  // 模拟上传成功
  setTimeout(() => {
    userInfo.value.avatar = URL.createObjectURL(file)
    message.success('头像更换成功')
    showAvatarModal.value = false
  }, 500)
  
  return false
}

// 编辑昵称
const editNickname = () => {
  editingNickname.value = userInfo.value.nickname
  showNicknameModal.value = true
}

const saveNickname = () => {
  if (!editingNickname.value.trim()) {
    message.error('昵称不能为空')
    return
  }
  if (editingNickname.value.length < 2 || editingNickname.value.length > 20) {
    message.error('昵称长度为2-20个字符')
    return
  }
  userInfo.value.nickname = editingNickname.value
  showNicknameModal.value = false
  message.success('昵称修改成功')
}

// 更换手机号
const changePhone = () => {
  router.push('/change-phone')
}

// 编辑性别
const editGender = () => {
  editingGender.value = userInfo.value.gender
  showGenderModal.value = true
}

const saveGender = () => {
  userInfo.value.gender = editingGender.value
  showGenderModal.value = false
  message.success('性别修改成功')
}

// 编辑生日
const editBirthday = () => {
  showBirthdayModal.value = true
}

const saveBirthday = () => {
  if (editingBirthday.value) {
    userInfo.value.birthday = editingBirthday.value.format('YYYY-MM-DD')
    message.success('生日设置成功')
  }
  showBirthdayModal.value = false
}

// 修改密码
const changePassword = () => {
  router.push('/change-password')
}

// 绑定邮箱
const bindEmail = () => {
  message.info('跳转到绑定邮箱页面')
}

// 绑定微信
const bindWechat = () => {
  message.info('跳转到绑定微信页面')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.account-settings-page {
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

.section-title {
  padding: 16px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:active {
  background: #f5f5f5;
}

.setting-label {
  font-size: 15px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-icon {
  font-size: 16px;
  color: #FF6B35;
}

.setting-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.value-text {
  font-size: 14px;
  color: #999;
}

.arrow-icon {
  font-size: 14px;
  color: #bbb;
}

.avatar-preview {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

/* 上传提示 */
.upload-tip {
  margin-top: 12px;
  font-size: 13px;
  color: #999;
  text-align: center;
}

/* 输入提示 */
.input-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

/* 响应式 */
@media (min-width: 768px) {
  .account-settings-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

