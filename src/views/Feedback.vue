<template>
  <div class="feedback-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">意见反馈</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- Tab切换 -->
    <div class="tabs-bar">
      <div 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 提交反馈 -->
    <div v-if="activeTab === 'submit'" class="submit-container">
      <div class="form-card">
        <a-form :model="feedbackForm" layout="vertical">
          <a-form-item label="反馈类型">
            <a-select 
              v-model:value="feedbackForm.type" 
              placeholder="请选择反馈类型"
            >
              <a-select-option value="bug">功能异常</a-select-option>
              <a-select-option value="suggestion">功能建议</a-select-option>
              <a-select-option value="complaint">投诉建议</a-select-option>
              <a-select-option value="other">其他</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="反馈标题">
            <a-input 
              v-model:value="feedbackForm.title" 
              placeholder="请简要描述您的问题"
              :maxlength="50"
            />
            <div class="char-count">{{ feedbackForm.title.length }}/50</div>
          </a-form-item>

          <a-form-item label="详细描述">
            <a-textarea
              v-model:value="feedbackForm.content"
              placeholder="请详细描述您遇到的问题或建议..."
              :rows="6"
              :maxlength="500"
            />
            <div class="char-count">{{ feedbackForm.content.length }}/500</div>
          </a-form-item>

          <a-form-item label="上传截图(选填)">
            <a-upload
              v-model:file-list="feedbackForm.images"
              list-type="picture-card"
              :before-upload="beforeUpload"
              @preview="handlePreview"
              :max-count="3"
            >
              <div v-if="feedbackForm.images.length < 3">
                <PlusOutlined />
                <div style="margin-top: 8px">上传</div>
              </div>
            </a-upload>
            <div class="upload-tip">最多上传3张图片,每张不超过5MB</div>
          </a-form-item>

          <a-form-item label="联系方式(选填)">
            <a-input 
              v-model:value="feedbackForm.contact" 
              placeholder="手机号或邮箱,方便我们联系您"
            />
          </a-form-item>

          <a-button 
            type="primary" 
            block 
            size="large"
            @click="submitFeedback"
            :loading="submitting"
          >
            提交反馈
          </a-button>
        </a-form>
      </div>
    </div>

    <!-- 我的反馈 -->
    <div v-else class="records-container">
      <div v-if="feedbackRecords.length > 0" class="records-list">
        <div 
          v-for="record in feedbackRecords" 
          :key="record.id"
          class="record-card"
          @click="viewFeedback(record)"
        >
          <div class="record-header">
            <div class="feedback-type" :class="record.type">
              {{ getTypeText(record.type) }}
            </div>
            <div class="feedback-status" :class="record.status">
              {{ getStatusText(record.status) }}
            </div>
          </div>

          <div class="record-content">
            <div class="record-title">{{ record.title }}</div>
            <div class="record-desc">{{ record.content }}</div>
            <div class="record-time">{{ record.time }}</div>
          </div>

          <div v-if="record.reply" class="record-reply">
            <div class="reply-label">
              <CustomerServiceOutlined /> 官方回复:
            </div>
            <div class="reply-content">{{ record.reply }}</div>
            <div class="reply-time">{{ record.replyTime }}</div>
          </div>

          <RightOutlined class="record-arrow" />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <MessageOutlined class="empty-icon" />
        <div class="empty-text">暂无反馈记录</div>
        <div class="empty-tip">您的意见对我们很重要</div>
        <a-button type="primary" @click="activeTab = 'submit'">
          提交反馈
        </a-button>
      </div>
    </div>

    <!-- 反馈详情弹窗 -->
      <a-modal
        v-model:open="detailModalVisible"
        title="反馈详情"
        :footer="null"
        width="90%"
        :style="{ maxWidth: '400px' }"
      >
        <div v-if="selectedFeedback" class="detail-modal">
          <!-- 反馈信息 -->
          <div class="detail-section">
            <div class="detail-header">
              <div class="feedback-type" :class="selectedFeedback.type">
                {{ getTypeText(selectedFeedback.type) }}
              </div>
              <div class="feedback-status" :class="selectedFeedback.status">
                {{ getStatusText(selectedFeedback.status) }}
              </div>
            </div>
            <div class="feedback-title">{{ selectedFeedback.title }}</div>
            <div class="feedback-time">
              <ClockCircleOutlined />
              <span>{{ selectedFeedback.time }}</span>
            </div>
          </div>

          <!-- 详细描述 -->
          <div class="detail-section">
            <div class="section-title">详细描述</div>
            <div class="feedback-content">{{ selectedFeedback.content }}</div>
          </div>

          <!-- 图片附件(如果有) -->
          <div v-if="selectedFeedback.images && selectedFeedback.images.length > 0" class="detail-section">
            <div class="section-title">图片附件</div>
            <div class="feedback-images">
              <img 
                v-for="(img, index) in selectedFeedback.images" 
                :key="index"
                :src="img" 
                alt="反馈图片"
                class="feedback-image"
              />
            </div>
          </div>

          <!-- 官方回复 -->
          <div class="detail-section">
            <div class="section-title">官方回复</div>
            <div v-if="selectedFeedback.reply" class="reply-box">
              <div class="reply-content">{{ selectedFeedback.reply }}</div>
              <div class="reply-time">
                <CustomerServiceOutlined />
                <span>{{ selectedFeedback.replyTime }}</span>
              </div>
            </div>
            <div v-else class="pending-reply">
              <LoadingOutlined />
              <span>我们已收到您的反馈,工作人员会尽快处理...</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="detail-actions">
            <a-button 
              block 
              size="large"
              @click="detailModalVisible = false"
            >
              关闭
            </a-button>
          </div>
        </div>
      </a-modal>

    <!-- 图片预览弹窗 -->
    <a-modal
      v-model:open="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img :src="previewImage" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  PlusOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
  RightOutlined,
  ClockCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

const router = useRouter()

// Tab数据
const tabs = [
  { key: 'submit', label: '提交反馈' },
  { key: 'records', label: '我的反馈' }
]

const activeTab = ref('submit')
const submitting = ref(false)

// 反馈表单
const feedbackForm = ref({
  type: '',
  title: '',
  content: '',
  images: [] as any[],
  contact: ''
})

// 图片预览
const previewVisible = ref(false)
const previewImage = ref('')

// 反馈记录
interface FeedbackRecord {
  id: number
  type: 'bug' | 'suggestion' | 'complaint' | 'other'
  title: string
  content: string
  time: string
  status: 'pending' | 'processing' | 'replied' | 'closed'
  reply?: string
  replyTime?: string
}

const feedbackRecords = ref<FeedbackRecord[]>([
  {
    id: 1,
    type: 'bug',
    title: '积分兑换页面加载缓慢',
    content: '打开积分商城页面时,加载时间超过5秒,体验不好',
    time: '2025-10-15 10:30',
    status: 'replied',
    reply: '感谢您的反馈!我们已经优化了积分商城的加载速度,请更新到最新版本体验。',
    replyTime: '2025-10-15 14:20'
  },
  {
    id: 2,
    type: 'suggestion',
    title: '建议增加夜间模式',
    content: '希望能增加夜间模式,晚上使用时对眼睛更友好',
    time: '2025-10-14 16:20',
    status: 'processing',
  },
  {
    id: 3,
    type: 'complaint',
    title: '优惠券使用规则不清楚',
    content: '优惠券的使用条件说明不够清晰,导致结算时无法使用',
    time: '2025-10-13 09:15',
    status: 'replied',
    reply: '非常抱歉给您带来不便!我们已经优化了优惠券的使用说明,现在会更加清晰地展示使用条件。',
    replyTime: '2025-10-13 15:30'
  },
  {
    id: 4,
    type: 'other',
    title: '希望增加更多支付方式',
    content: '建议增加支付宝、微信支付等常用支付方式',
    time: '2025-10-12 14:45',
    status: 'closed'
  }
])

// 获取类型文本
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    bug: '功能异常',
    suggestion: '功能建议',
    complaint: '投诉建议',
    other: '其他'
  }
  return typeMap[type] || '未知'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    replied: '已回复',
    closed: '已关闭'
  }
  return statusMap[status] || '未知'
}

// 上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过 5MB!')
    return false
  }
  return false // 阻止自动上传
}

// 预览图片
const handlePreview = (file: any) => {
  previewImage.value = file.url || file.thumbUrl
  previewVisible.value = true
}

// 提交反馈
const submitFeedback = () => {
  if (!feedbackForm.value.type) {
    message.error('请选择反馈类型')
    return
  }
  if (!feedbackForm.value.title.trim()) {
    message.error('请输入反馈标题')
    return
  }
  if (!feedbackForm.value.content.trim()) {
    message.error('请输入详细描述')
    return
  }

  submitting.value = true

  // 模拟提交
  setTimeout(() => {
    const newFeedback: FeedbackRecord = {
      id: Date.now(),
      type: feedbackForm.value.type as any,
      title: feedbackForm.value.title,
      content: feedbackForm.value.content,
      time: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      status: 'pending'
    }

    feedbackRecords.value.unshift(newFeedback)

    // 重置表单
    feedbackForm.value = {
      type: '',
      title: '',
      content: '',
      images: [],
      contact: ''
    }

    submitting.value = false
    message.success('反馈提交成功,我们会尽快处理!')
    activeTab.value = 'records'
  }, 1000)
}

// 详情弹窗
const detailModalVisible = ref(false)
const selectedFeedback = ref<FeedbackRecord | null>(null)

// 查看反馈详情
const viewFeedback = (record: FeedbackRecord) => {
  selectedFeedback.value = record
  detailModalVisible.value = true
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.feedback-page {
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

/* Tab栏 */
.tabs-bar {
  background: #fff;
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #FF6B35;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: #FF6B35;
  border-radius: 2px;
}

/* 提交反馈 */
.submit-container {
  padding: 12px 16px;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #bbb;
  margin-top: 4px;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

/* 反馈记录 */
.records-container {
  padding: 12px 16px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.record-card:active {
  transform: scale(0.98);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.feedback-type {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.feedback-type.bug {
  background: #fff1f0;
  color: #ff4d4f;
}

.feedback-type.suggestion {
  background: #e6f7ff;
  color: #1890ff;
}

.feedback-type.complaint {
  background: #fff7e6;
  color: #fa8c16;
}

.feedback-type.other {
  background: #f5f5f5;
  color: #666;
}

.feedback-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.feedback-status.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.feedback-status.processing {
  background: #e6f7ff;
  color: #1890ff;
}

.feedback-status.replied {
  background: #f6ffed;
  color: #52c41a;
}

.feedback-status.closed {
  background: #f5f5f5;
  color: #999;
}

.record-content {
  margin-bottom: 12px;
}

.record-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.record-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.record-time {
  font-size: 12px;
  color: #bbb;
}

.record-reply {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
}

.reply-label {
  font-size: 13px;
  color: #FF6B35;
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.reply-content {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
}

.reply-time {
  font-size: 12px;
  color: #bbb;
}

.record-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #bbb;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
}

.empty-icon {
  font-size: 80px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.empty-tip {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

/* 响应式 */
@media (min-width: 768px) {
  .feedback-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

