<template>
  <div class="local-vouchers-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <LeftOutlined @click="goBack" />
      <span class="title">本地消费券</span>
      <div class="nav-actions">
        <HistoryOutlined @click="viewHistory" />
        <QuestionCircleOutlined @click="showHelp" />
      </div>
    </div>

    <!-- 消费券统计 -->
    <div class="voucher-stats">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)">
          <WalletOutlined />
        </div>
        <div class="stat-info">
          <div class="stat-value">¥{{ voucherStats.total }}</div>
          <div class="stat-label">累计领取</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #00A8E8 0%, #0077B6 100%)">
          <CheckCircleOutlined />
        </div>
        <div class="stat-info">
          <div class="stat-value">¥{{ voucherStats.used }}</div>
          <div class="stat-label">已使用</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)">
          <GiftOutlined />
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ voucherStats.count }}</div>
          <div class="stat-label">可用券数</div>
        </div>
      </div>
    </div>

    <!-- 公告横幅 -->
    <div class="announcement-banner">
      <SoundOutlined class="announcement-icon" />
      <div class="announcement-text">{{ announcement }}</div>
    </div>

    <!-- Tab 切换 -->
    <div class="tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-item"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.name }}
        <a-badge v-if="tab.badge" :count="tab.badge" class="tab-badge" />
      </div>
    </div>

    <!-- 可领取消费券 -->
    <div v-if="currentTab === 'available'" class="content-section">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-tags">
          <div 
            v-for="filter in filters" 
            :key="filter.id"
            class="filter-tag"
            :class="{ active: currentFilter === filter.id }"
            @click="currentFilter = filter.id"
          >
            {{ filter.name }}
          </div>
        </div>
      </div>

      <!-- 消费券列表 -->
      <div class="voucher-list">
        <div 
          v-for="voucher in filteredAvailableVouchers" 
          :key="voucher.id"
          class="voucher-card"
          :class="{ 'hot-voucher': voucher.hot }"
        >
          <div class="voucher-left" :style="{ background: voucher.color }">
            <div class="voucher-amount">
              <span class="currency">¥</span>
              <span class="value">{{ voucher.amount }}</span>
            </div>
            <div class="voucher-condition">{{ voucher.condition }}</div>
          </div>
          <div class="voucher-right">
            <div class="voucher-info">
              <div class="voucher-title">
                {{ voucher.title }}
                <span v-if="voucher.hot" class="hot-tag">热门</span>
              </div>
              <div class="voucher-desc">{{ voucher.desc }}</div>
              <div class="voucher-meta">
                <div class="meta-item">
                  <EnvironmentOutlined />
                  <span>{{ voucher.scope }}</span>
                </div>
                <div class="meta-item">
                  <ClockCircleOutlined />
                  <span>{{ voucher.deadline }}</span>
                </div>
              </div>
              <div class="voucher-progress">
                <a-progress 
                  :percent="voucher.progress" 
                  :show-info="false" 
                  stroke-color="#FF6B35"
                  trail-color="#F0F0F0"
                />
                <span class="progress-text">已领{{ voucher.progress }}%</span>
              </div>
            </div>
            <a-button 
              type="primary" 
              size="small"
              class="receive-btn"
              @click="receiveVoucher(voucher)"
            >
              立即领取
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的消费券 -->
    <div v-if="currentTab === 'my'" class="content-section">
      <!-- 状态筛选 -->
      <div class="status-filter">
        <div 
          v-for="status in statusFilters" 
          :key="status.id"
          class="status-item"
          :class="{ active: currentStatus === status.id }"
          @click="currentStatus = status.id"
        >
          {{ status.name }}
          <span class="status-count">({{ status.count }})</span>
        </div>
      </div>

      <!-- 我的消费券列表 -->
      <div class="my-voucher-list">
        <div 
          v-for="voucher in filteredMyVouchers" 
          :key="voucher.id"
          class="my-voucher-card"
          :class="voucher.statusClass"
          @click="viewVoucherDetail(voucher)"
        >
          <div class="voucher-left" :style="{ background: voucher.color }">
            <div class="voucher-amount">
              <span class="currency">¥</span>
              <span class="value">{{ voucher.amount }}</span>
            </div>
            <div class="voucher-condition">{{ voucher.condition }}</div>
            <div class="voucher-status-tag">{{ voucher.statusText }}</div>
          </div>
          <div class="voucher-right">
            <div class="voucher-info">
              <div class="voucher-title">{{ voucher.title }}</div>
              <div class="voucher-desc">{{ voucher.desc }}</div>
              <div class="voucher-meta">
                <div class="meta-item">
                  <EnvironmentOutlined />
                  <span>{{ voucher.scope }}</span>
                </div>
                <div class="meta-item">
                  <ClockCircleOutlined />
                  <span>有效期至 {{ voucher.expireDate }}</span>
                </div>
              </div>
              <div v-if="voucher.status === 'used'" class="use-info">
                <div class="use-time">使用时间：{{ voucher.useTime }}</div>
                <div class="use-merchant">使用商家：{{ voucher.merchant }}</div>
              </div>
            </div>
            <div class="voucher-actions">
              <a-button 
                v-if="voucher.status === 'unused'"
                type="primary" 
                size="small"
                @click.stop="useVoucher(voucher)"
              >
                立即使用
              </a-button>
              <a-button 
                v-if="voucher.status === 'used'"
                size="small"
                @click.stop="viewUsageDetail(voucher)"
              >
                查看详情
              </a-button>
            </div>
          </div>
        </div>

        <a-empty v-if="filteredMyVouchers.length === 0" description="暂无消费券" />
      </div>
    </div>

    <!-- 使用指南 -->
    <div v-if="currentTab === 'guide'" class="content-section guide-section">
      <div class="guide-card">
        <div class="guide-title">
          <FileTextOutlined />
          如何领取消费券
        </div>
        <div class="guide-steps">
          <div v-for="(step, index) in receiveSteps" :key="index" class="guide-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="guide-card">
        <div class="guide-title">
          <ShoppingOutlined />
          如何使用消费券
        </div>
        <div class="guide-steps">
          <div v-for="(step, index) in useSteps" :key="index" class="guide-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="guide-card">
        <div class="guide-title">
          <ExclamationCircleOutlined />
          注意事项
        </div>
        <div class="guide-notices">
          <div v-for="(notice, index) in notices" :key="index" class="notice-item">
            <div class="notice-dot"></div>
            <div class="notice-text">{{ notice }}</div>
          </div>
        </div>
      </div>

      <div class="guide-card">
        <div class="guide-title">
          <QuestionCircleOutlined />
          常见问题
        </div>
        <a-collapse ghost>
          <a-collapse-panel v-for="faq in faqs" :key="faq.id" :header="faq.question">
            <p>{{ faq.answer }}</p>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>

    <!-- 领取成功弹窗 -->
    <a-modal
      v-model:open="showSuccessModal"
      :footer="null"
      :closable="false"
      width="80%"
      centered
    >
      <div class="success-modal">
        <CheckCircleFilled class="success-icon" />
        <div class="success-title">领取成功！</div>
        <div class="success-desc">消费券已存入您的账户</div>
        <div class="success-voucher" v-if="selectedVoucher">
          <div class="voucher-amount">¥{{ selectedVoucher.amount }}</div>
          <div class="voucher-name">{{ selectedVoucher.title }}</div>
        </div>
        <div class="success-actions">
          <a-button @click="showSuccessModal = false">继续领取</a-button>
          <a-button type="primary" @click="goToMyVouchers">查看我的券</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 使用消费券弹窗 -->
    <a-modal
      v-model:open="showUseModal"
      title="使用消费券"
      :footer="null"
      width="90%"
    >
      <div class="use-modal-content" v-if="selectedVoucher">
        <div class="use-voucher-info">
          <div class="voucher-amount">¥{{ selectedVoucher.amount }}</div>
          <div class="voucher-name">{{ selectedVoucher.title }}</div>
          <div class="voucher-condition">{{ selectedVoucher.condition }}</div>
        </div>

        <div class="use-qrcode">
          <div class="qrcode-placeholder">
            <QrcodeOutlined />
            <div>向商家出示此二维码</div>
          </div>
          <div class="qrcode-number">券码：{{ selectedVoucher.code }}</div>
        </div>

        <div class="use-tips">
          <div class="tip-title">使用说明：</div>
          <div class="tip-item">1. 消费时向商家出示此二维码</div>
          <div class="tip-item">2. 商家扫码后自动核销</div>
          <div class="tip-item">3. 核销后不可退款</div>
        </div>

        <a-button type="primary" block @click="showUseModal = false">
          我知道了
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  HistoryOutlined,
  QuestionCircleOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  SoundOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  ExclamationCircleOutlined,
  CheckCircleFilled,
  QrcodeOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 消费券统计
const voucherStats = ref({
  total: 2580,
  used: 1200,
  count: 8
})

// 公告
const announcement = ref('南京市政府消费券第三期已开启，快来领取吧！')

// Tab 配置
const tabs = ref([
  { id: 'available', name: '可领取', badge: 12 },
  { id: 'my', name: '我的消费券', badge: 0 },
  { id: 'guide', name: '使用指南', badge: 0 }
])

const currentTab = ref('available')

// 筛选器
const filters = ref([
  { id: 'all', name: '全部' },
  { id: 'gov', name: '政府券' },
  { id: 'platform', name: '平台券' },
  { id: 'merchant', name: '商家券' }
])

const currentFilter = ref('all')

// 可领取消费券数据
const availableVouchers = ref([
  {
    id: 1,
    title: '南京市政府消费券',
    desc: '全市通用，支持餐饮、购物、娱乐等消费',
    amount: 100,
    condition: '满200可用',
    scope: '全市通用',
    deadline: '2025-12-31',
    color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    type: 'gov',
    hot: true,
    progress: 75
  },
  {
    id: 2,
    title: '家电消费补贴券',
    desc: '购买家电产品专用',
    amount: 200,
    condition: '满1000可用',
    scope: '指定商家',
    deadline: '2025-11-30',
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    type: 'gov',
    hot: true,
    progress: 60
  },
  {
    id: 3,
    title: '平台新人券',
    desc: '新用户专享优惠券',
    amount: 50,
    condition: '满100可用',
    scope: '全平台通用',
    deadline: '2025-10-31',
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    type: 'platform',
    hot: false,
    progress: 40
  },
  {
    id: 4,
    title: '德基广场购物券',
    desc: '德基广场全场通用',
    amount: 80,
    condition: '满300可用',
    scope: '德基广场',
    deadline: '2025-12-15',
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    type: 'merchant',
    hot: false,
    progress: 55
  },
  {
    id: 5,
    title: '餐饮美食券',
    desc: '指定餐饮商家可用',
    amount: 30,
    condition: '满100可用',
    scope: '指定餐饮',
    deadline: '2025-11-20',
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    type: 'merchant',
    hot: true,
    progress: 80
  },
  {
    id: 6,
    title: '新街口商圈券',
    desc: '新街口商圈通用',
    amount: 60,
    condition: '满200可用',
    scope: '新街口商圈',
    deadline: '2025-12-10',
    color: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    type: 'merchant',
    hot: false,
    progress: 45
  },
  {
    id: 7,
    title: '文化消费券',
    desc: '图书、电影、演出等文化消费',
    amount: 40,
    condition: '满150可用',
    scope: '文化场所',
    deadline: '2025-11-30',
    color: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    type: 'gov',
    hot: false,
    progress: 50
  },
  {
    id: 8,
    title: '体育健身券',
    desc: '健身房、游泳馆等体育场所',
    amount: 50,
    condition: '满200可用',
    scope: '体育场所',
    deadline: '2025-12-20',
    color: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    type: 'gov',
    hot: false,
    progress: 35
  },
  {
    id: 9,
    title: '旅游消费券',
    desc: '景区门票、酒店住宿等',
    amount: 150,
    condition: '满500可用',
    scope: '旅游景区',
    deadline: '2025-12-31',
    color: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
    type: 'gov',
    hot: true,
    progress: 70
  },
  {
    id: 10,
    title: '母婴用品券',
    desc: '母婴用品专用',
    amount: 70,
    condition: '满300可用',
    scope: '母婴店',
    deadline: '2025-11-25',
    color: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
    type: 'merchant',
    hot: false,
    progress: 42
  },
  {
    id: 11,
    title: '数码产品券',
    desc: '手机、电脑等数码产品',
    amount: 300,
    condition: '满2000可用',
    scope: '数码商城',
    deadline: '2025-12-15',
    color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    type: 'merchant',
    hot: true,
    progress: 65
  },
  {
    id: 12,
    title: '美容美发券',
    desc: '美容美发店通用',
    amount: 40,
    condition: '满150可用',
    scope: '美容美发',
    deadline: '2025-11-18',
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    type: 'merchant',
    hot: false,
    progress: 38
  }
])

// 我的消费券数据
const myVouchers = ref([
  {
    id: 1,
    title: '南京市政府消费券',
    desc: '全市通用，支持餐饮、购物、娱乐等消费',
    amount: 100,
    condition: '满200可用',
    scope: '全市通用',
    expireDate: '2025-12-31',
    color: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    status: 'unused',
    statusText: '未使用',
    statusClass: 'status-unused',
    code: '1234567890'
  },
  {
    id: 2,
    title: '家电消费补贴券',
    desc: '购买家电产品专用',
    amount: 200,
    condition: '满1000可用',
    scope: '指定商家',
    expireDate: '2025-11-30',
    color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    status: 'unused',
    statusText: '未使用',
    statusClass: 'status-unused',
    code: '2345678901'
  },
  {
    id: 3,
    title: '平台新人券',
    desc: '新用户专享优惠券',
    amount: 50,
    condition: '满100可用',
    scope: '全平台通用',
    expireDate: '2025-10-31',
    color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    status: 'used',
    statusText: '已使用',
    statusClass: 'status-used',
    useTime: '2025-10-10 14:30',
    merchant: '德基广场',
    code: '3456789012'
  },
  {
    id: 4,
    title: '德基广场购物券',
    desc: '德基广场全场通用',
    amount: 80,
    condition: '满300可用',
    scope: '德基广场',
    expireDate: '2025-12-15',
    color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    status: 'unused',
    statusText: '未使用',
    statusClass: 'status-unused',
    code: '4567890123'
  },
  {
    id: 5,
    title: '餐饮美食券',
    desc: '指定餐饮商家可用',
    amount: 30,
    condition: '满100可用',
    scope: '指定餐饮',
    expireDate: '2025-11-20',
    color: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    status: 'used',
    statusText: '已使用',
    statusClass: 'status-used',
    useTime: '2025-10-08 18:45',
    merchant: '海底捞火锅',
    code: '5678901234'
  },
  {
    id: 6,
    title: '新街口商圈券',
    desc: '新街口商圈通用',
    amount: 60,
    condition: '满200可用',
    scope: '新街口商圈',
    expireDate: '2025-12-10',
    color: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    status: 'unused',
    statusText: '未使用',
    statusClass: 'status-unused',
    code: '6789012345'
  },
  {
    id: 7,
    title: '文化消费券',
    desc: '图书、电影、演出等文化消费',
    amount: 40,
    condition: '满150可用',
    scope: '文化场所',
    expireDate: '2025-11-30',
    color: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    status: 'expired',
    statusText: '已过期',
    statusClass: 'status-expired',
    code: '7890123456'
  },
  {
    id: 8,
    title: '体育健身券',
    desc: '健身房、游泳馆等体育场所',
    amount: 50,
    condition: '满200可用',
    scope: '体育场所',
    expireDate: '2025-12-20',
    color: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
    status: 'unused',
    statusText: '未使用',
    statusClass: 'status-unused',
    code: '8901234567'
  }
])

// 状态筛选
const statusFilters = ref([
  { id: 'all', name: '全部', count: 8 },
  { id: 'unused', name: '未使用', count: 5 },
  { id: 'used', name: '已使用', count: 2 },
  { id: 'expired', name: '已过期', count: 1 }
])

const currentStatus = ref('all')

// 领取指南
const receiveSteps = ref([
  {
    title: '浏览消费券',
    desc: '在"可领取"页面浏览当前可领取的消费券'
  },
  {
    title: '选择消费券',
    desc: '选择符合您需求的消费券，查看使用条件'
  },
  {
    title: '点击领取',
    desc: '点击"立即领取"按钮，消费券将自动存入您的账户'
  },
  {
    title: '查看我的券',
    desc: '在"我的消费券"中查看已领取的消费券'
  }
])

// 使用指南
const useSteps = ref([
  {
    title: '选择消费券',
    desc: '在"我的消费券"中选择要使用的消费券'
  },
  {
    title: '查看适用范围',
    desc: '确认消费券的适用范围和使用条件'
  },
  {
    title: '消费时出示',
    desc: '在符合条件的商家消费时，向商家出示消费券二维码'
  },
  {
    title: '商家扫码核销',
    desc: '商家扫码后自动核销，享受优惠'
  }
])

// 注意事项
const notices = ref([
  '每张消费券只能使用一次，核销后不可退款',
  '消费券不可转让、不可兑换现金',
  '请在有效期内使用，过期自动失效',
  '部分消费券有使用范围限制，请仔细阅读使用说明',
  '同一订单只能使用一张消费券',
  '如有疑问，请联系客服咨询'
])

// 常见问题
const faqs = ref([
  {
    id: 1,
    question: '消费券可以叠加使用吗？',
    answer: '同一订单只能使用一张消费券，不支持叠加使用。'
  },
  {
    id: 2,
    question: '消费券可以转让给他人吗？',
    answer: '消费券不可转让，仅限本人使用。'
  },
  {
    id: 3,
    question: '消费券过期了怎么办？',
    answer: '消费券过期后自动失效，无法使用。请在有效期内使用。'
  },
  {
    id: 4,
    question: '消费券可以退款吗？',
    answer: '消费券一旦核销，不支持退款。请在使用前确认订单信息。'
  },
  {
    id: 5,
    question: '如何查看消费券使用记录？',
    answer: '在"我的消费券"页面，选择"已使用"状态，即可查看使用记录。'
  }
])

// 弹窗状态
const showSuccessModal = ref(false)
const showUseModal = ref(false)
const selectedVoucher = ref<any>(null)

// 计算属性
const filteredAvailableVouchers = computed(() => {
  if (currentFilter.value === 'all') {
    return availableVouchers.value
  }
  return availableVouchers.value.filter(v => v.type === currentFilter.value)
})

const filteredMyVouchers = computed(() => {
  if (currentStatus.value === 'all') {
    return myVouchers.value
  }
  return myVouchers.value.filter(v => v.status === currentStatus.value)
})

// 方法
const goBack = () => {
  router.back()
}

const viewHistory = () => {
  message.info('查看领取历史')
}

const showHelp = () => {
  currentTab.value = 'guide'
}

const receiveVoucher = (voucher: any) => {
  selectedVoucher.value = voucher
  showSuccessModal.value = true
  
  // 更新统计
  voucherStats.value.count++
  voucherStats.value.total += voucher.amount
  
  // 添加到我的消费券
  myVouchers.value.unshift({
    ...voucher,
    expireDate: voucher.deadline,
    status: 'unused',
    statusText: '未使用',
    statusClass: 'status-unused',
    code: Math.random().toString().slice(2, 12)
  })
  
  // 更新状态筛选计数
  statusFilters.value[0].count++
  statusFilters.value[1].count++
}

const goToMyVouchers = () => {
  showSuccessModal.value = false
  currentTab.value = 'my'
}

const viewVoucherDetail = (voucher: any) => {
  message.info(`查看消费券详情：${voucher.title}`)
}

const useVoucher = (voucher: any) => {
  selectedVoucher.value = voucher
  showUseModal.value = true
}

const viewUsageDetail = (voucher: any) => {
  message.info(`查看使用详情：${voucher.title}`)
}
</script>

<style scoped>
.local-vouchers-page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 20px;
}

/* 顶部导航 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-nav .title {
  font-size: 18px;
  font-weight: 600;
}

.top-nav .anticon {
  font-size: 20px;
  cursor: pointer;
}

.nav-actions {
  display: flex;
  gap: 16px;
}

/* 消费券统计 */
.voucher-stats {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* 公告横幅 */
.announcement-banner {
  margin: 0 16px 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.announcement-icon {
  color: #FF6B35;
  font-size: 18px;
  animation: ring 2s infinite;
}

@keyframes ring {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-10deg); }
  20%, 40% { transform: rotate(10deg); }
}

.announcement-text {
  flex: 1;
  font-size: 14px;
  color: #666;
}

/* Tab 切换 */
.tabs {
  display: flex;
  background: white;
  margin: 0 16px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-item {
  flex: 1;
  padding: 14px;
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #FF6B35;
  font-weight: 600;
  background: linear-gradient(to bottom, #FFF5F0 0%, white 100%);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #FF6B35;
  border-radius: 2px 2px 0 0;
}

/* 内容区域 */
.content-section {
  padding: 0 16px;
}

/* 筛选栏 */
.filter-bar {
  margin-bottom: 16px;
}

.filter-tags {
  display: flex;
  gap: 12px;
}

.filter-tag {
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.filter-tag.active {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
}

/* 消费券列表 */
.voucher-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voucher-card {
  background: white;
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.voucher-card.hot-voucher::before {
  content: '热门';
  position: absolute;
  top: 8px;
  left: -20px;
  background: #FF4D4F;
  color: white;
  padding: 2px 24px;
  font-size: 11px;
  transform: rotate(-45deg);
  z-index: 1;
}

.voucher-left {
  width: 120px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
}

.voucher-left::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: #F5F5F5;
  border-radius: 50%;
}

.voucher-amount {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.currency {
  font-size: 16px;
  font-weight: 500;
}

.value {
  font-size: 32px;
  font-weight: 600;
}

.voucher-condition {
  font-size: 12px;
  opacity: 0.9;
}

.voucher-right {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.voucher-info {
  flex: 1;
}

.voucher-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hot-tag {
  padding: 2px 8px;
  background: #FF4D4F;
  color: white;
  font-size: 11px;
  border-radius: 4px;
}

.voucher-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  line-height: 1.4;
}

.voucher-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.meta-item .anticon {
  font-size: 12px;
}

.voucher-progress {
  margin-top: 8px;
}

.progress-text {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.receive-btn {
  margin-top: 12px;
  align-self: flex-end;
}

/* 状态筛选 */
.status-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.status-item {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.status-item.active {
  background: linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%);
  color: #FF6B35;
  font-weight: 600;
}

.status-count {
  font-size: 12px;
  margin-left: 4px;
}

/* 我的消费券列表 */
.my-voucher-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.my-voucher-card {
  background: white;
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.my-voucher-card.status-expired {
  opacity: 0.6;
}

.my-voucher-card.status-used {
  opacity: 0.8;
}

.voucher-status-tag {
  margin-top: 8px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 11px;
  text-align: center;
}

.use-info {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #F0F0F0;
  font-size: 12px;
  color: #999;
}

.use-time, .use-merchant {
  margin-bottom: 4px;
}

.voucher-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

/* 指南区域 */
.guide-section {
  padding-bottom: 20px;
}

.guide-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.guide-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.guide-title .anticon {
  color: #FF6B35;
  font-size: 20px;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-step {
  display: flex;
  gap: 12px;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

.guide-notices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FF6B35;
  margin-top: 6px;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 领取成功弹窗 */
.success-modal {
  padding: 24px;
  text-align: center;
}

.success-icon {
  font-size: 64px;
  color: #52C41A;
  margin-bottom: 16px;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.success-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.success-voucher {
  padding: 20px;
  background: linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

.success-voucher .voucher-amount {
  font-size: 32px;
  font-weight: 600;
  color: #FF6B35;
  margin-bottom: 8px;
}

.success-voucher .voucher-name {
  font-size: 14px;
  color: #666;
}

.success-actions {
  display: flex;
  gap: 12px;
}

.success-actions button {
  flex: 1;
}

/* 使用消费券弹窗 */
.use-modal-content {
  padding: 8px 0;
}

.use-voucher-info {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%);
  border-radius: 12px;
  margin-bottom: 20px;
}

.use-voucher-info .voucher-amount {
  font-size: 36px;
  font-weight: 600;
  color: #FF6B35;
  margin-bottom: 8px;
}

.use-voucher-info .voucher-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.use-voucher-info .voucher-condition {
  font-size: 12px;
  color: #999;
}

.use-qrcode {
  text-align: center;
  margin-bottom: 20px;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  margin: 0 auto 12px;
  background: #F5F5F5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
}

.qrcode-placeholder .anticon {
  font-size: 64px;
}

.qrcode-number {
  font-size: 14px;
  color: #666;
  font-family: monospace;
}

.use-tips {
  padding: 16px;
  background: #F5F5F5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.tip-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.tip-item {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}
</style>

