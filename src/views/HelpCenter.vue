<template>
  <div class="help-center-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">帮助中心</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索您想了解的问题..."
        size="large"
        @search="handleSearch"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input-search>
    </div>

    <!-- 热门问题 -->
    <div class="section-card">
      <div class="section-header">
        <FireOutlined class="section-icon" />
        <span class="section-title">热门问题</span>
      </div>
      <div class="question-list">
        <div 
          v-for="question in hotQuestions" 
          :key="question.id"
          class="question-item"
          @click="viewQuestion(question)"
        >
          <div class="question-title">{{ question.title }}</div>
          <RightOutlined class="question-arrow" />
        </div>
      </div>
    </div>

    <!-- 帮助分类 -->
    <div class="section-card">
      <div class="section-header">
        <AppstoreOutlined class="section-icon" />
        <span class="section-title">帮助分类</span>
      </div>
      <div class="category-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-card"
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

    <!-- 新手指南 -->
    <div class="section-card">
      <div class="section-header">
        <BookOutlined class="section-icon" />
        <span class="section-title">新手指南</span>
      </div>
      <div class="guide-list">
        <div 
          v-for="guide in guides" 
          :key="guide.id"
          class="guide-item"
          @click="viewGuide(guide)"
        >
          <div class="guide-number">{{ guide.id }}</div>
          <div class="guide-info">
            <div class="guide-title">{{ guide.title }}</div>
            <div class="guide-desc">{{ guide.desc }}</div>
          </div>
          <RightOutlined class="guide-arrow" />
        </div>
      </div>
    </div>

    <!-- 视频教程 -->
    <div class="section-card">
      <div class="section-header">
        <PlayCircleOutlined class="section-icon" />
        <span class="section-title">视频教程</span>
      </div>
      <div class="video-list">
        <div 
          v-for="video in videos" 
          :key="video.id"
          class="video-item"
          @click="playVideo(video)"
        >
          <div class="video-cover" :style="{ background: video.color }">
            <PlayCircleOutlined class="play-icon" />
          </div>
          <div class="video-info">
            <div class="video-title">{{ video.title }}</div>
            <div class="video-duration">{{ video.duration }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系客服 -->
    <div class="contact-section">
      <div class="contact-card" @click="contactService">
        <div class="contact-icon">
          <CustomerServiceOutlined />
        </div>
        <div class="contact-info">
          <div class="contact-title">找不到答案?</div>
          <div class="contact-desc">联系在线客服为您解答</div>
        </div>
        <a-button type="primary">联系客服</a-button>
      </div>
    </div>

    <!-- 问题详情弹窗 -->
    <a-modal
      v-model:open="showQuestionModal"
      :title="currentQuestion?.title"
      :footer="null"
      width="90%"
    >
      <div class="question-detail">
        <div class="detail-content" v-html="currentQuestion?.content"></div>
        <div class="detail-footer">
          <div class="feedback-text">这篇文章对您有帮助吗?</div>
          <div class="feedback-buttons">
            <a-button @click="feedbackHelpful(true)">
              <LikeOutlined /> 有帮助
            </a-button>
            <a-button @click="feedbackHelpful(false)">
              <DislikeOutlined /> 没帮助
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  SearchOutlined,
  FireOutlined,
  AppstoreOutlined,
  BookOutlined,
  PlayCircleOutlined,
  CustomerServiceOutlined,
  RightOutlined,
  ShoppingOutlined,
  GiftOutlined,
  WalletOutlined,
  CarOutlined,
  SafetyOutlined,
  FileTextOutlined,
  LikeOutlined,
  DislikeOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 热门问题
const hotQuestions = [
  { id: 1, title: '如何领取优惠券?', content: '<p>在首页或领券中心找到您想要的优惠券,点击"立即领取"按钮即可。领取成功后,优惠券会自动存入"我的票券"。</p><p>使用时,在结算页面选择可用的优惠券,系统会自动计算优惠金额。</p>' },
  { id: 2, title: '积分如何获得?', content: '<p>您可以通过以下方式获得积分:</p><ul><li>每日签到: 每天签到可获得50积分</li><li>完成订单: 订单完成后可获得相应积分</li><li>参与活动: 参与平台活动可获得额外积分</li><li>抽奖获得: 参与抽奖活动有机会获得积分</li></ul>' },
  { id: 3, title: '订单多久发货?', content: '<p>一般情况下,订单在支付成功后24小时内发货。特殊商品或活动期间可能会延迟,请以实际发货时间为准。</p><p>您可以在"我的订单"中查看订单状态和物流信息。</p>' },
  { id: 4, title: '如何申请退款?', content: '<p>在订单详情页点击"申请售后",选择退款原因并提交。客服会在1-3个工作日内处理您的申请。</p><p>退款金额将原路返回到您的支付账户。</p>' },
  { id: 5, title: '优惠券为什么不能使用?', content: '<p>优惠券不能使用可能有以下原因:</p><ul><li>优惠券已过期</li><li>未达到使用门槛</li><li>商品不在适用范围内</li><li>优惠券已被使用</li></ul><p>请仔细查看优惠券的使用说明。</p>' }
]

// 帮助分类
const categories = [
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
  },
  {
    id: 5,
    name: '账号安全',
    icon: SafetyOutlined,
    count: 6,
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 6,
    name: '发票相关',
    icon: FileTextOutlined,
    count: 5,
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  }
]

// 新手指南
const guides = [
  { id: 1, title: '注册登录', desc: '如何注册账号和登录平台' },
  { id: 2, title: '领取优惠券', desc: '如何领取和使用优惠券' },
  { id: 3, title: '积分兑换', desc: '如何使用积分兑换商品' },
  { id: 4, title: '下单购物', desc: '如何下单和支付' },
  { id: 5, title: '查看订单', desc: '如何查看订单状态和物流' }
]

// 视频教程
const videos = [
  {
    id: 1,
    title: '平台功能介绍',
    duration: '3:25',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    title: '如何领取优惠券',
    duration: '2:15',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 3,
    title: '积分商城使用教程',
    duration: '4:10',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 4,
    title: '玩赚积分攻略',
    duration: '3:50',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

// 当前问题
const showQuestionModal = ref(false)
const currentQuestion = ref<any>(null)

// 搜索
const handleSearch = (value: string) => {
  if (!value.trim()) {
    message.warning('请输入搜索关键词')
    return
  }
  message.info(`搜索: ${value}`)
}

// 查看问题
const viewQuestion = (question: any) => {
  currentQuestion.value = question
  showQuestionModal.value = true
}

// 查看分类
const viewCategory = (category: any) => {
  message.info(`查看${category.name}相关帮助`)
}

// 查看指南
const viewGuide = (guide: any) => {
  message.info(`查看指南: ${guide.title}`)
}

// 播放视频
const playVideo = (video: any) => {
  message.info(`播放视频: ${video.title}`)
}

// 联系客服
const contactService = () => {
  router.push('/customer-service')
}

// 反馈帮助
const feedbackHelpful = (helpful: boolean) => {
  if (helpful) {
    message.success('感谢您的反馈!')
  } else {
    message.info('我们会继续改进,您也可以联系客服获取更多帮助')
  }
  showQuestionModal.value = false
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.help-center-page {
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

/* 搜索区域 */
.search-section {
  padding: 16px;
  background: #fff;
}

/* 区块卡片 */
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

/* 问题列表 */
.question-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.question-item:active {
  transform: scale(0.98);
}

.question-title {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.question-arrow {
  font-size: 14px;
  color: #bbb;
  flex-shrink: 0;
}

/* 分类网格 */
.category-grid {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:active {
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
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

.category-count {
  font-size: 12px;
  color: #999;
}

/* 指南列表 */
.guide-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.guide-item:active {
  transform: scale(0.98);
}

.guide-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #FF6B35;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.guide-info {
  flex: 1;
  min-width: 0;
}

.guide-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.guide-desc {
  font-size: 12px;
  color: #999;
}

.guide-arrow {
  font-size: 14px;
  color: #bbb;
  flex-shrink: 0;
}

/* 视频列表 */
.video-list {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.video-item {
  cursor: pointer;
  transition: all 0.3s;
}

.video-item:active {
  transform: scale(0.95);
}

.video-cover {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.play-icon {
  font-size: 40px;
  color: #fff;
}

.video-info {
  padding: 0 4px;
}

.video-title {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-duration {
  font-size: 12px;
  color: #999;
}

/* 联系客服 */
.contact-section {
  padding: 0 16px;
  margin-top: 12px;
}

.contact-card {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.contact-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.contact-desc {
  font-size: 13px;
  opacity: 0.9;
}

/* 问题详情 */
.question-detail {
  padding: 16px 0;
}

.detail-content {
  line-height: 1.8;
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
}

.detail-content p {
  margin-bottom: 12px;
}

.detail-content ul {
  padding-left: 20px;
  margin-bottom: 12px;
}

.detail-content li {
  margin-bottom: 8px;
}

.detail-footer {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.feedback-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.feedback-buttons {
  display: flex;
  gap: 12px;
}

/* 响应式 */
@media (min-width: 768px) {
  .help-center-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

