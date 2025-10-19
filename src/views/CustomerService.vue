<template>
  <div class="customer-service-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">客服中心</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 客服入口卡片 -->
    <div class="service-entries">
      <div class="entry-card" @click="startChat">
        <div class="entry-icon chat">
          <MessageOutlined />
        </div>
        <div class="entry-info">
          <div class="entry-title">在线客服</div>
          <div class="entry-desc">7x24小时在线服务</div>
        </div>
        <div class="entry-badge online">在线</div>
      </div>

      <div class="entry-card" @click="callPhone">
        <div class="entry-icon phone">
          <PhoneOutlined />
        </div>
        <div class="entry-info">
          <div class="entry-title">电话客服</div>
          <div class="entry-desc">400-123-4567</div>
        </div>
        <RightOutlined class="entry-arrow" />
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="section-card">
      <div class="section-header">
        <QuestionCircleOutlined class="section-icon" />
        <span class="section-title">常见问题</span>
      </div>
      
      <a-collapse v-model:activeKey="activeFaqKey" :bordered="false">
        <a-collapse-panel 
          v-for="faq in faqs" 
          :key="faq.id"
          :header="faq.question"
        >
          <div class="faq-answer">{{ faq.answer }}</div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <!-- 帮助分类 -->
    <div class="section-card">
      <div class="section-header">
        <BookOutlined class="section-icon" />
        <span class="section-title">帮助分类</span>
      </div>
      
      <div class="help-categories">
        <div 
          v-for="category in helpCategories" 
          :key="category.id"
          class="category-item"
          @click="viewCategory(category)"
        >
          <div class="category-icon" :style="{ background: category.color }">
            <component :is="category.icon" />
          </div>
          <div class="category-name">{{ category.name }}</div>
          <div class="category-count">{{ category.count }}篇</div>
        </div>
      </div>
    </div>

    <!-- 我的咨询 -->
    <div class="section-card">
      <div class="section-header">
        <HistoryOutlined class="section-icon" />
        <span class="section-title">我的咨询</span>
        <span class="section-more" @click="viewAllConsultations">
          查看全部 <RightOutlined />
        </span>
      </div>

      <div v-if="consultations.length > 0" class="consultation-list">
        <div 
          v-for="item in consultations" 
          :key="item.id"
          class="consultation-item"
          @click="viewConsultation(item)"
        >
          <div class="consultation-content">
            <div class="consultation-question">{{ item.question }}</div>
            <div class="consultation-time">{{ item.time }}</div>
          </div>
          <div class="consultation-status" :class="item.status">
            {{ item.status === 'replied' ? '已回复' : '待回复' }}
          </div>
        </div>
      </div>

      <div v-else class="empty-consultation">
        <div class="empty-text">暂无咨询记录</div>
      </div>
    </div>

    <!-- 咨询详情弹窗 -->
    <a-modal
      v-model:open="consultationDetailVisible"
      title="咨询详情"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <div v-if="selectedConsultation" class="detail-modal">
        <!-- 问题信息 -->
        <div class="detail-section">
          <div class="section-title">咨询问题</div>
          <div class="question-content">
            {{ selectedConsultation.question }}
          </div>
          <div class="question-time">
            <ClockCircleOutlined />
            <span>{{ selectedConsultation.time }}</span>
          </div>
        </div>

        <!-- 回复信息 -->
        <div class="detail-section">
          <div class="section-title">客服回复</div>
          <div v-if="selectedConsultation.status === 'replied'" class="reply-content">
            <div class="reply-text">{{ selectedConsultation.reply }}</div>
            <div class="reply-time">{{ selectedConsultation.replyTime }}</div>
          </div>
          <div v-else class="pending-reply">
            <LoadingOutlined />
            <span>客服正在处理中,请耐心等待...</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <a-button 
            v-if="selectedConsultation.status === 'pending'"
            type="primary" 
            block 
            size="large"
            @click="contactService"
          >
            联系客服
          </a-button>
          <a-button 
            v-else
            block 
            size="large"
            @click="consultationDetailVisible = false"
          >
            关闭
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 在线客服聊天弹窗 -->
    <a-modal
      v-model:open="showChatModal"
      title="在线客服"
      :footer="null"
      width="90%"
      :bodyStyle="{ padding: 0, height: '500px' }"
    >
      <div class="chat-container">
        <div class="chat-messages" ref="messagesContainer">
          <div 
            v-for="msg in chatMessages" 
            :key="msg.id"
            class="message-item"
            :class="msg.type"
          >
            <div v-if="msg.type === 'service'" class="message-avatar">
              <CustomerServiceOutlined />
            </div>
            <div class="message-content">
              <div class="message-text">{{ msg.text }}</div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
            <div v-if="msg.type === 'user'" class="message-avatar user">
              <UserOutlined />
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <a-input
            v-model:value="chatInput"
            placeholder="请输入您的问题..."
            @pressEnter="sendMessage"
          >
            <template #suffix>
              <SendOutlined 
                class="send-icon" 
                @click="sendMessage"
              />
            </template>
          </a-input>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  LeftOutlined,
  MessageOutlined,
  PhoneOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  HistoryOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  SendOutlined,
  ShoppingOutlined,
  GiftOutlined,
  WalletOutlined,
  CarOutlined,
  ClockCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 常见问题激活的key
const activeFaqKey = ref<number[]>([])

// 常见问题数据
const faqs = [
  {
    id: 1,
    question: '如何使用优惠券?',
    answer: '在结算页面选择可用的优惠券,系统会自动计算优惠金额。每个订单只能使用一张优惠券。'
  },
  {
    id: 2,
    question: '积分如何获得和使用?',
    answer: '通过每日签到、完成订单、参与活动等方式获得积分。积分可在积分商城兑换商品或抵扣现金。'
  },
  {
    id: 3,
    question: '订单多久发货?',
    answer: '一般情况下,订单在支付成功后24小时内发货。特殊商品或活动期间可能会延迟,请以实际发货时间为准。'
  },
  {
    id: 4,
    question: '如何申请退款?',
    answer: '在订单详情页点击"申请售后",选择退款原因并提交。客服会在1-3个工作日内处理您的申请。'
  },
  {
    id: 5,
    question: '发票如何开具?',
    answer: '订单完成后,在"我的发票"页面申请开具发票。电子发票会发送到您填写的邮箱。'
  }
]

// 帮助分类
const helpCategories = [
  {
    id: 1,
    name: '订单问题',
    icon: ShoppingOutlined,
    count: 15,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '优惠券',
    icon: GiftOutlined,
    count: 12,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    name: '积分规则',
    icon: WalletOutlined,
    count: 10,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    name: '物流配送',
    icon: CarOutlined,
    count: 8,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

// 我的咨询
const consultations = ref([
  {
    id: 1,
    question: '订单什么时候发货?',
    time: '2025-10-15 10:30',
    status: 'replied'
  },
  {
    id: 2,
    question: '如何使用满减优惠券?',
    time: '2025-10-14 16:20',
    status: 'replied'
  },
  {
    id: 3,
    question: '积分兑换的商品多久到货?',
    time: '2025-10-13 09:15',
    status: 'pending'
  }
])

// 聊天相关
const showChatModal = ref(false)
const chatInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

interface ChatMessage {
  id: number
  type: 'user' | 'service'
  text: string
  time: string
}

const chatMessages = ref<ChatMessage[]>([
  {
    id: 1,
    type: 'service',
    text: '您好,我是智能客服小助手,有什么可以帮您的吗?',
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
])

// 开始聊天
const startChat = () => {
  showChatModal.value = true
}

// 发送消息
const sendMessage = () => {
  if (!chatInput.value.trim()) return

  // 添加用户消息
  const userMessage: ChatMessage = {
    id: Date.now(),
    type: 'user',
    text: chatInput.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  chatMessages.value.push(userMessage)
  chatInput.value = ''

  // 滚动到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })

  // 模拟客服回复
  setTimeout(() => {
    const serviceMessage: ChatMessage = {
      id: Date.now(),
      type: 'service',
      text: '感谢您的咨询,客服正在为您处理,请稍候...',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    chatMessages.value.push(serviceMessage)

    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }, 1000)
}

// 拨打电话
const callPhone = () => {
  Modal.confirm({
    title: '拨打客服电话',
    content: '400-123-4567',
    okText: '拨打',
    onOk: () => {
      message.success('正在拨打客服电话...')
    }
  })
}

// 查看帮助分类
const viewCategory = (category: any) => {
  message.info(`查看${category.name}相关帮助`)
}

// 查看全部咨询
const viewAllConsultations = () => {
  message.info('查看全部咨询记录')
}

// 咨询详情弹窗
const consultationDetailVisible = ref(false)
const selectedConsultation = ref<any>(null)

// 查看咨询详情
const viewConsultation = (item: any) => {
  selectedConsultation.value = item
  consultationDetailVisible.value = true
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.customer-service-page {
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

/* 客服入口 */
.service-entries {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.entry-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.entry-card:active {
  transform: scale(0.98);
}

.entry-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  flex-shrink: 0;
}

.entry-icon.chat {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.entry-icon.phone {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.entry-info {
  flex: 1;
}

.entry-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.entry-desc {
  font-size: 13px;
  color: #999;
}

.entry-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.entry-badge.online {
  background: #f6ffed;
  color: #52c41a;
}

.entry-arrow {
  font-size: 14px;
  color: #bbb;
}

/* 区块卡片 */
.section-card {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-icon {
  font-size: 18px;
  color: #FF6B35;
  margin-right: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  flex: 1;
}

.section-more {
  font-size: 13px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 常见问题 */
.faq-answer {
  color: #666;
  line-height: 1.6;
}

/* 帮助分类 */
.help-categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:active {
  transform: scale(0.95);
}

.category-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  margin-bottom: 8px;
}

.category-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.category-count {
  font-size: 12px;
  color: #999;
}

/* 咨询列表 */
.consultation-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.consultation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.consultation-item:active {
  transform: scale(0.98);
}

.consultation-content {
  flex: 1;
  min-width: 0;
}

.consultation-question {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.consultation-time {
  font-size: 12px;
  color: #bbb;
}

.consultation-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
  margin-left: 12px;
}

.consultation-status.replied {
  background: #f6ffed;
  color: #52c41a;
}

.consultation-status.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.empty-consultation {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 聊天窗口 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f5f5;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}

.message-avatar.user {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.message-content {
  max-width: 70%;
}

.message-text {
  background: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-item.user .message-text {
  background: #FF6B35;
  color: #fff;
}

.message-time {
  font-size: 12px;
  color: #bbb;
  margin-top: 4px;
  text-align: center;
}

.chat-input-area {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.send-icon {
  color: #FF6B35;
  font-size: 18px;
  cursor: pointer;
}

/* 响应式 */
@media (min-width: 768px) {
  .customer-service-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

