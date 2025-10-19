<template>
  <div class="invoice-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">我的发票</span>
      <span class="header-action" @click="addInvoice">
        <PlusOutlined /> 添加
      </span>
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

    <!-- 发票列表 -->
    <div class="invoice-container">
      <div v-if="currentList.length > 0" class="invoice-list">
        <div 
          v-for="invoice in currentList" 
          :key="invoice.id"
          class="invoice-card"
        >
          <div class="invoice-header">
            <div class="invoice-type" :class="invoice.type">
              <FileTextOutlined />
              <span>{{ invoice.type === 'personal' ? '个人' : '企业' }}</span>
            </div>
            <div class="invoice-status" :class="invoice.status">
              {{ getStatusText(invoice.status) }}
            </div>
          </div>

          <div class="invoice-info">
            <div class="info-row">
              <span class="info-label">发票抬头:</span>
              <span class="info-value">{{ invoice.title }}</span>
            </div>
            <div v-if="invoice.type === 'company'" class="info-row">
              <span class="info-label">税号:</span>
              <span class="info-value">{{ invoice.taxNumber }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">订单号:</span>
              <span class="info-value">{{ invoice.orderNo }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">金额:</span>
              <span class="info-value amount">¥{{ invoice.amount }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">申请时间:</span>
              <span class="info-value">{{ invoice.applyTime }}</span>
            </div>
          </div>

          <div class="invoice-actions">
            <a-button 
              v-if="invoice.status === 'issued'" 
              type="primary" 
              size="small"
              @click="downloadInvoice(invoice)"
            >
              <DownloadOutlined /> 下载
            </a-button>
            <a-button 
              v-if="invoice.status === 'issued'" 
              size="small"
              @click="viewInvoice(invoice)"
            >
              <EyeOutlined /> 查看
            </a-button>
            <a-button 
              v-if="invoice.status === 'pending'" 
              size="small"
              danger
              @click="cancelInvoice(invoice)"
            >
              取消申请
            </a-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <FileTextOutlined class="empty-icon" />
        <div class="empty-text">暂无发票记录</div>
        <div class="empty-tip">完成订单后可申请开具发票</div>
      </div>
    </div>

    <!-- 发票详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="发票详情"
      :footer="null"
      width="90%"
      :style="{ maxWidth: '400px' }"
    >
      <div v-if="selectedInvoice" class="detail-modal">
        <!-- 发票头部 -->
        <div class="detail-header">
          <div class="invoice-icon">📝</div>
          <div class="invoice-title-info">
            <div class="invoice-title-text">{{ selectedInvoice.type === 'personal' ? '个人发票' : '企业发票' }}</div>
            <div class="invoice-status" :class="selectedInvoice.status">
              {{ getStatusText(selectedInvoice.status) }}
            </div>
          </div>
        </div>

        <!-- 发票信息 -->
        <div class="detail-section">
          <div class="section-title">发票信息</div>
          <div class="info-item">
            <span class="info-label">发票抬头</span>
            <span class="info-value">{{ selectedInvoice.title }}</span>
          </div>
          <div v-if="selectedInvoice.type === 'company'" class="info-item">
            <span class="info-label">税号</span>
            <span class="info-value">{{ selectedInvoice.taxNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发票类型</span>
            <span class="info-value">{{ selectedInvoice.type === 'personal' ? '个人普通发票' : '企业增值税发票' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发票金额</span>
            <span class="info-value amount">¥{{ selectedInvoice.amount }}</span>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="detail-section">
          <div class="section-title">订单信息</div>
          <div class="info-item">
            <span class="info-label">订单编号</span>
            <span class="info-value">{{ selectedInvoice.orderNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">申请时间</span>
            <span class="info-value">{{ selectedInvoice.applyTime }}</span>
          </div>
          <div v-if="selectedInvoice.status === 'issued'" class="info-item">
            <span class="info-label">开具时间</span>
            <span class="info-value">{{ selectedInvoice.issueTime || '2024-10-11 10:30' }}</span>
          </div>
        </div>

        <!-- 发票详情(如果已开具) -->
        <div v-if="selectedInvoice.status === 'issued'" class="detail-section">
          <div class="section-title">发票详情</div>
          <div class="info-item">
            <span class="info-label">发票代码</span>
            <span class="info-value">{{ getInvoiceCode(selectedInvoice.id) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发票号码</span>
            <span class="info-value">{{ getInvoiceNumber(selectedInvoice.id) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">校验码</span>
            <span class="info-value">{{ getCheckCode(selectedInvoice.id) }}</span>
          </div>
        </div>

        <!-- 驳回原因(如果已驳回) -->
        <div v-if="selectedInvoice.status === 'rejected'" class="detail-section">
          <div class="section-title">驳回原因</div>
          <div class="reject-reason">
            {{ selectedInvoice.rejectReason || '发票信息填写不完整，请重新申请' }}
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <a-button 
            v-if="selectedInvoice.status === 'issued'"
            type="primary" 
            block 
            size="large"
            @click="downloadInvoiceFromDetail"
          >
            <DownloadOutlined /> 下载发票
          </a-button>
          <a-button 
            v-else
            block 
            size="large"
            @click="detailModalVisible = false"
          >
            关闭
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 添加发票弹窗 -->
    <a-modal
      v-model:open="showAddModal"
      title="申请发票"
      @ok="submitInvoice"
      width="90%"
    >
      <a-form :model="invoiceForm" layout="vertical">
        <a-form-item label="发票类型">
          <a-radio-group v-model:value="invoiceForm.type">
            <a-radio value="personal">个人</a-radio>
            <a-radio value="company">企业</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="发票抬头">
          <a-input 
            v-model:value="invoiceForm.title" 
            placeholder="请输入发票抬头"
          />
        </a-form-item>

        <a-form-item v-if="invoiceForm.type === 'company'" label="税号">
          <a-input 
            v-model:value="invoiceForm.taxNumber" 
            placeholder="请输入纳税人识别号"
          />
        </a-form-item>

        <a-form-item label="选择订单">
          <a-select 
            v-model:value="invoiceForm.orderNo" 
            placeholder="请选择需要开票的订单"
          >
            <a-select-option value="202510150001">订单 202510150001 - ¥299</a-select-option>
            <a-select-option value="202510140002">订单 202510140002 - ¥158</a-select-option>
            <a-select-option value="202510130003">订单 202510130003 - ¥89</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="电子邮箱">
          <a-input 
            v-model:value="invoiceForm.email" 
            placeholder="用于接收电子发票"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  LeftOutlined,
  PlusOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// Tab数据
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待开具' },
  { key: 'issued', label: '已开具' },
  { key: 'rejected', label: '已驳回' }
]

const activeTab = ref('all')
const showAddModal = ref(false)

// 发票表单
const invoiceForm = ref({
  type: 'personal',
  title: '',
  taxNumber: '',
  orderNo: '',
  email: ''
})

// 发票数据
interface Invoice {
  id: number
  type: 'personal' | 'company'
  title: string
  taxNumber?: string
  orderNo: string
  amount: number
  applyTime: string
  status: 'pending' | 'issued' | 'rejected'
}

const invoices = ref<Invoice[]>([
  {
    id: 1,
    type: 'personal',
    title: '张三',
    orderNo: '202510150001',
    amount: 299,
    applyTime: '2025-10-15 10:30',
    status: 'issued'
  },
  {
    id: 2,
    type: 'company',
    title: '某某科技有限公司',
    taxNumber: '91320100MA1WXXXX1X',
    orderNo: '202510140002',
    amount: 1580,
    applyTime: '2025-10-14 16:20',
    status: 'issued'
  },
  {
    id: 3,
    type: 'personal',
    title: '张三',
    orderNo: '202510130003',
    amount: 89,
    applyTime: '2025-10-13 09:15',
    status: 'pending'
  },
  {
    id: 4,
    type: 'company',
    title: '某某贸易有限公司',
    taxNumber: '91320100MA1WYYYY2Y',
    orderNo: '202510120004',
    amount: 2350,
    applyTime: '2025-10-12 14:45',
    status: 'rejected'
  },
  {
    id: 5,
    type: 'personal',
    title: '张三',
    orderNo: '202510110005',
    amount: 158,
    applyTime: '2025-10-11 18:30',
    status: 'issued'
  }
])

// 当前列表
const currentList = computed(() => {
  if (activeTab.value === 'all') {
    return invoices.value
  }
  return invoices.value.filter(invoice => invoice.status === activeTab.value)
})

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待开具',
    issued: '已开具',
    rejected: '已驳回'
  }
  return statusMap[status] || '未知'
}

// 添加发票
const addInvoice = () => {
  invoiceForm.value = {
    type: 'personal',
    title: '',
    taxNumber: '',
    orderNo: '',
    email: ''
  }
  showAddModal.value = true
}

// 提交发票申请
const submitInvoice = () => {
  if (!invoiceForm.value.title) {
    message.error('请输入发票抬头')
    return
  }
  if (invoiceForm.value.type === 'company' && !invoiceForm.value.taxNumber) {
    message.error('请输入纳税人识别号')
    return
  }
  if (!invoiceForm.value.orderNo) {
    message.error('请选择订单')
    return
  }
  if (!invoiceForm.value.email) {
    message.error('请输入电子邮箱')
    return
  }

  // 模拟提交
  const newInvoice: Invoice = {
    id: Date.now(),
    type: invoiceForm.value.type,
    title: invoiceForm.value.title,
    taxNumber: invoiceForm.value.taxNumber,
    orderNo: invoiceForm.value.orderNo,
    amount: 299, // 模拟金额
    applyTime: new Date().toLocaleString('zh-CN', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-'),
    status: 'pending'
  }
  
  invoices.value.unshift(newInvoice)
  showAddModal.value = false
  message.success('发票申请已提交')
}

// 下载发票
const downloadInvoice = (invoice: Invoice) => {
  message.success(`正在下载发票: ${invoice.orderNo}`)
}

// 详情弹窗
const detailModalVisible = ref(false)
const selectedInvoice = ref<Invoice | null>(null)

// 查看发票
const viewInvoice = (invoice: Invoice) => {
  selectedInvoice.value = invoice
  detailModalVisible.value = true
}

// 从详情弹窗下载发票
const downloadInvoiceFromDetail = () => {
  if (selectedInvoice.value) {
    downloadInvoice(selectedInvoice.value)
    detailModalVisible.value = false
  }
}

// 生成发票代码
const getInvoiceCode = (id: number) => {
  return `0${String(id + 3200000000).padStart(10, '0')}`
}

// 生成发票号码
const getInvoiceNumber = (id: number) => {
  return `No.${String(id + 20241000).padStart(8, '0')}`
}

// 生成校验码
const getCheckCode = (id: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 20; i++) {
    code += chars.charAt((id * (i + 1)) % chars.length)
  }
  return code
}

// 取消申请
const cancelInvoice = (invoice: Invoice) => {
  Modal.confirm({
    title: '确认取消',
    content: '确定要取消这个发票申请吗?',
    onOk: () => {
      const index = invoices.value.findIndex(item => item.id === invoice.id)
      if (index > -1) {
        invoices.value.splice(index, 1)
        message.success('已取消申请')
      }
    }
  })
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.invoice-page {
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

.header-action {
  font-size: 15px;
  color: #FF6B35;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
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

/* 发票列表 */
.invoice-container {
  padding: 12px 16px;
}

.invoice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.invoice-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.invoice-type {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.invoice-type.personal {
  background: #e6f7ff;
  color: #1890ff;
}

.invoice-type.company {
  background: #f6ffed;
  color: #52c41a;
}

.invoice-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.invoice-status.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.invoice-status.issued {
  background: #f6ffed;
  color: #52c41a;
}

.invoice-status.rejected {
  background: #fff1f0;
  color: #ff4d4f;
}

.invoice-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}

.info-label {
  color: #999;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  text-align: right;
  word-break: break-all;
}

.info-value.amount {
  color: #FF6B35;
  font-weight: bold;
  font-size: 16px;
}

.invoice-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
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
}

/* 响应式 */
@media (min-width: 768px) {
  .invoice-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

