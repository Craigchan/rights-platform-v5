<template>
  <div class="activity-detail-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <LeftOutlined />
      </div>
      <div class="page-title">活动详情</div>
      <div class="share-btn" @click="handleShare">
        <ShareAltOutlined />
      </div>
    </div>

    <!-- 活动头图 -->
    <div class="activity-header" :style="{ background: activity.color }">
      <div class="activity-status-badge" :class="activity.status">
        {{ getStatusText(activity.status) }}
      </div>
      <div v-if="activity.hot" class="hot-badge">🔥 热门活动</div>
    </div>

    <!-- 活动基本信息 -->
    <div class="activity-info">
      <h1 class="activity-title">{{ activity.title }}</h1>
      <p class="activity-desc">{{ activity.desc }}</p>
      
      <div class="info-grid">
        <div class="info-item">
          <ClockCircleOutlined class="info-icon" />
          <div class="info-content">
            <div class="info-label">活动时间</div>
            <div class="info-value">{{ activity.startDate }} 至 {{ activity.endDate }}</div>
          </div>
        </div>
        <div class="info-item">
          <UserOutlined class="info-icon" />
          <div class="info-content">
            <div class="info-label">参与人数</div>
            <div class="info-value">{{ activity.participants }}人</div>
          </div>
        </div>
        <div class="info-item">
          <GiftOutlined class="info-icon" />
          <div class="info-content">
            <div class="info-label">活动奖励</div>
            <div class="info-value">{{ activity.reward }}</div>
          </div>
        </div>
        <div class="info-item">
          <EnvironmentOutlined class="info-icon" />
          <div class="info-content">
            <div class="info-label">适用范围</div>
            <div class="info-value">{{ activity.scope }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动详情 -->
    <div class="detail-section">
      <h2 class="section-title">活动详情</h2>
      <div class="detail-content">
        <p v-for="(paragraph, index) in activity.details" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </div>

    <!-- 参与规则 -->
    <div class="detail-section">
      <h2 class="section-title">参与规则</h2>
      <div class="rules-list">
        <div v-for="(rule, index) in activity.rules" :key="index" class="rule-item">
          <div class="rule-number">{{ index + 1 }}</div>
          <div class="rule-text">{{ rule }}</div>
        </div>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="detail-section">
      <h2 class="section-title">常见问题</h2>
      <a-collapse v-model:activeKey="activeKeys" :bordered="false">
        <a-collapse-panel 
          v-for="(faq, index) in activity.faqs" 
          :key="index"
          :header="faq.question"
        >
          <p>{{ faq.answer }}</p>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="action-buttons">
        <a-button 
          size="large" 
          @click="handleCollect"
          :icon="h(activity.collected ? HeartFilled : HeartOutlined)"
        >
          {{ activity.collected ? '已收藏' : '收藏' }}
        </a-button>
        <a-button 
          type="primary" 
          size="large"
          :disabled="activity.status === 'ended'"
          @click="handleJoin"
        >
          {{ getButtonText(activity.status, activity.joined) }}
        </a-button>
      </div>
    </div>

    <!-- 报名弹窗 -->
    <a-modal 
      v-model:open="joinModalVisible" 
      title="参与活动"
      @ok="submitJoin"
      okText="确认参与"
      cancelText="取消"
    >
      <a-form :model="joinForm" layout="vertical">
        <a-form-item label="姓名" required>
          <a-input v-model:value="joinForm.name" placeholder="请输入您的姓名" />
        </a-form-item>
        <a-form-item label="手机号" required>
          <a-input v-model:value="joinForm.phone" placeholder="请输入您的手机号" />
        </a-form-item>
        <a-form-item label="身份证号" required>
          <a-input v-model:value="joinForm.idCard" placeholder="请输入您的身份证号" />
        </a-form-item>
        <a-alert 
          message="温馨提示" 
          description="参与活动需要实名认证,您的个人信息将被严格保密。" 
          type="info" 
          show-icon 
        />
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  UserOutlined,
  GiftOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 活动数据(实际应从API获取)
const activity = ref({
  id: 1,
  title: '2024家电以旧换新补贴活动',
  desc: '购买符合条件的家电产品,最高可享1000元政府补贴',
  status: 'ongoing',
  hot: true,
  startDate: '2024-10-01',
  endDate: '2024-12-31',
  participants: 15280,
  reward: '最高1000元补贴',
  scope: '全市范围',
  joined: false,
  collected: false,
  color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  details: [
    '为推动绿色消费,促进家电更新换代,政府特推出家电以旧换新补贴活动。消费者购买符合条件的新家电产品,并交回旧家电,可享受政府补贴。',
    '本次活动涵盖电视机、冰箱、洗衣机、空调、热水器等主要家电品类,补贴金额根据产品类型和价格而定,最高可达1000元。',
    '活动期间,消费者可在指定商家门店或线上平台购买新家电,提交旧家电回收凭证和购买发票,即可申请补贴。补贴款项将在审核通过后15个工作日内发放至指定账户。'
  ],
  rules: [
    '参与者需为本市常住居民,并提供有效身份证明',
    '购买的新家电必须为指定品牌和型号,具体清单可在活动页面查看',
    '旧家电必须在本市正规回收点进行回收,并取得回收凭证',
    '每户家庭每类家电限享受一次补贴',
    '补贴申请需在购买之日起30天内提交,逾期不予受理',
    '如发现虚假申报,将取消补贴资格并追究法律责任'
  ],
  faqs: [
    {
      question: '哪些家电可以参与以旧换新?',
      answer: '本次活动涵盖电视机、冰箱、洗衣机、空调、热水器等主要家电品类。具体型号和品牌请查看活动详情页的产品清单。'
    },
    {
      question: '补贴金额如何计算?',
      answer: '补贴金额根据新购家电的类型和价格而定。一般来说,电视机和冰箱补贴300-800元,洗衣机和空调补贴200-600元,热水器补贴100-400元。具体金额以实际审核为准。'
    },
    {
      question: '如何申请补贴?',
      answer: '购买新家电后,请保存好购买发票和旧家电回收凭证。然后在本页面点击"立即参与"按钮,填写申请表格并上传相关证明材料。审核通过后,补贴款项将在15个工作日内发放。'
    },
    {
      question: '补贴多久能到账?',
      answer: '提交申请后,工作人员会在3-5个工作日内完成审核。审核通过后,补贴款项将在15个工作日内发放至您提供的银行账户。'
    },
    {
      question: '一个家庭可以申请多次补贴吗?',
      answer: '每户家庭每类家电限享受一次补贴。例如,您可以申请一次冰箱补贴和一次洗衣机补贴,但不能申请两次冰箱补贴。'
    }
  ]
})

const activeKeys = ref([0])
const joinModalVisible = ref(false)
const joinForm = ref({
  name: '',
  phone: '',
  idCard: ''
})

// 方法
const goBack = () => {
  router.back()
}

const handleShare = () => {
  message.success('分享链接已复制到剪贴板')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    ongoing: '进行中',
    upcoming: '即将开始',
    ended: '已结束'
  }
  return statusMap[status] || status
}

const getButtonText = (status: string, joined: boolean) => {
  if (status === 'ended') return '活动已结束'
  if (joined) return '已参与'
  if (status === 'upcoming') return '预约参与'
  return '立即参与'
}

const handleCollect = () => {
  activity.value.collected = !activity.value.collected
  message.success(activity.value.collected ? '收藏成功' : '取消收藏')
}

const handleJoin = () => {
  if (activity.value.joined) {
    message.info('您已参与该活动')
    return
  }
  joinModalVisible.value = true
}

const submitJoin = () => {
  if (!joinForm.value.name || !joinForm.value.phone || !joinForm.value.idCard) {
    message.error('请填写完整信息')
    return
  }
  
  // 简单验证手机号
  if (!/^1[3-9]\d{9}$/.test(joinForm.value.phone)) {
    message.error('请输入正确的手机号')
    return
  }
  
  // 简单验证身份证号
  if (!/^\d{17}[\dXx]$/.test(joinForm.value.idCard)) {
    message.error('请输入正确的身份证号')
    return
  }
  
  activity.value.joined = true
  activity.value.participants++
  joinModalVisible.value = false
  message.success('参与成功!我们会尽快审核您的申请')
  
  // 清空表单
  joinForm.value = {
    name: '',
    phone: '',
    idCard: ''
  }
}
</script>

<style scoped>
.activity-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 顶部导航栏 */
.top-bar {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn,
.share-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
}

/* 活动头图 */
.activity-header {
  width: 100%;
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-status-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
}

.activity-status-badge.ongoing {
  color: #52c41a;
}

.activity-status-badge.upcoming {
  color: #1890ff;
}

.activity-status-badge.ended {
  color: #999;
}

.hot-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(255, 77, 79, 0.95);
  color: #fff;
}

/* 活动基本信息 */
.activity-info {
  background: #fff;
  padding: 20px 15px;
  margin-bottom: 10px;
}

.activity-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.activity-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-item {
  display: flex;
  gap: 10px;
}

.info-icon {
  font-size: 20px;
  color: #FF6B35;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 详情区块 */
.detail-section {
  background: #fff;
  padding: 20px 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #FF6B35;
}

.detail-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 12px;
  text-indent: 2em;
}

.detail-content p:last-child {
  margin-bottom: 0;
}

/* 规则列表 */
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.rule-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.rule-text {
  flex: 1;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  padding-top: 2px;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 15px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons :deep(.ant-btn) {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 600;
}

.action-buttons :deep(.ant-btn-primary) {
  flex: 2;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border: none;
}
</style>

