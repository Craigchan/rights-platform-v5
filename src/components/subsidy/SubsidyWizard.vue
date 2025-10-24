<template>
  <a-modal
    v-model:open="visible"
    :title="null"
    :footer="null"
    :width="'90%'"
    :closable="false"
    class="subsidy-wizard-modal"
  >
    <div class="subsidy-wizard">
      <!-- 步骤指示器 -->
      <div class="steps-indicator">
        <div 
          v-for="i in 3" 
          :key="i"
          class="step-dot"
          :class="{ active: currentStep >= i, completed: currentStep > i }"
        ></div>
      </div>

      <!-- 步骤1: 选择类型 -->
      <div v-if="currentStep === 1" class="wizard-step step-select">
        <div class="step-icon">📝</div>
        <h2 class="step-title">选择补贴类型</h2>
        <p class="step-desc">请选择您要申请的补贴项目</p>

        <div class="subsidy-types">
          <div 
            v-for="subsidy in subsidyStore.availableSubsidies" 
            :key="subsidy.id"
            class="type-card"
            :class="{ 
              selected: selectedType === subsidy.type,
              disabled: subsidyStore.hasAppliedType(subsidy.type)
            }"
            @click="selectType(subsidy.type)"
          >
            <div class="type-icon">{{ subsidy.icon }}</div>
            <div class="type-name">{{ subsidy.name }}</div>
            <div class="type-amount">最高¥{{ subsidy.amount }}</div>
            <div class="type-desc">{{ subsidy.description }}</div>
            
            <!-- 库存状态 -->
            <div class="type-quota">
              <div class="quota-bar">
                <div 
                  class="quota-fill" 
                  :style="{ width: `${(subsidy.usedQuota / subsidy.totalQuota) * 100}%` }"
                ></div>
              </div>
              <div class="quota-text">
                剩余 {{ subsidy.totalQuota - subsidy.usedQuota }} / {{ subsidy.totalQuota }}
              </div>
            </div>
            
            <!-- 已申请标识 -->
            <div v-if="subsidyStore.hasAppliedType(subsidy.type)" class="applied-badge">
              <CheckCircleFilled /> 已申请
            </div>
          </div>
        </div>

        <button 
          class="wizard-btn primary" 
          :disabled="!selectedType"
          @click="createApplication"
        >
          下一步
        </button>
        <button class="wizard-btn secondary" @click="closeWizard">取消</button>
      </div>

      <!-- 步骤2: 上传材料 -->
      <div v-else-if="currentStep === 2" class="wizard-step step-upload">
        <div class="step-icon">📤</div>
        <h2 class="step-title">上传资格证明材料</h2>
        <p class="step-desc">请按要求上传以下材料,确保照片清晰完整</p>

        <div class="upload-section">
          <!-- 身份证 -->
          <div class="upload-group">
            <div class="group-title">
              <span class="required">*</span>
              身份证正反面
            </div>
            <div class="upload-grid">
              <div class="upload-item">
                <a-upload
                  :show-upload-list="false"
                  :before-upload="(file) => handleUpload(file, 'idCardFront')"
                  accept="image/*"
                >
                  <div class="upload-box" :class="{ uploaded: materials.idCardFront }">
                    <div v-if="materials.idCardFront" class="upload-preview">
                      <img :src="materials.idCardFront" alt="身份证正面" />
                    </div>
                    <div v-else class="upload-placeholder">
                      <PlusOutlined />
                      <div>身份证正面</div>
                    </div>
                  </div>
                </a-upload>
              </div>
              <div class="upload-item">
                <a-upload
                  :show-upload-list="false"
                  :before-upload="(file) => handleUpload(file, 'idCardBack')"
                  accept="image/*"
                >
                  <div class="upload-box" :class="{ uploaded: materials.idCardBack }">
                    <div v-if="materials.idCardBack" class="upload-preview">
                      <img :src="materials.idCardBack" alt="身份证反面" />
                    </div>
                    <div v-else class="upload-placeholder">
                      <PlusOutlined />
                      <div>身份证反面</div>
                    </div>
                  </div>
                </a-upload>
              </div>
            </div>
          </div>

          <!-- 购买凭证 -->
          <div class="upload-group">
            <div class="group-title">
              <span class="required">*</span>
              购买凭证(发票/订单截图)
            </div>
            <div class="upload-list">
              <div 
                v-for="(proof, index) in materials.purchaseProofs" 
                :key="index"
                class="upload-item-small"
              >
                <img :src="proof" alt="购买凭证" />
                <CloseCircleFilled 
                  class="delete-icon" 
                  @click="removeImage('purchaseProofs', index)"
                />
              </div>
              <a-upload
                v-if="materials.purchaseProofs.length < 5"
                :show-upload-list="false"
                :before-upload="(file) => handleUpload(file, 'purchaseProofs')"
                accept="image/*"
              >
                <div class="upload-box-small">
                  <PlusOutlined />
                </div>
              </a-upload>
            </div>
            <div class="upload-tip">最多上传5张,支持jpg/png格式</div>
          </div>

          <!-- 旧物凭证 -->
          <div class="upload-group">
            <div class="group-title">
              <span class="required">*</span>
              旧物凭证(照片/回收单)
            </div>
            <div class="upload-list">
              <div 
                v-for="(proof, index) in materials.oldItemProofs" 
                :key="index"
                class="upload-item-small"
              >
                <img :src="proof" alt="旧物凭证" />
                <CloseCircleFilled 
                  class="delete-icon" 
                  @click="removeImage('oldItemProofs', index)"
                />
              </div>
              <a-upload
                v-if="materials.oldItemProofs.length < 5"
                :show-upload-list="false"
                :before-upload="(file) => handleUpload(file, 'oldItemProofs')"
                accept="image/*"
              >
                <div class="upload-box-small">
                  <PlusOutlined />
                </div>
              </a-upload>
            </div>
            <div class="upload-tip">最多上传5张,支持jpg/png格式</div>
          </div>

          <!-- 银行卡信息 -->
          <div class="upload-group">
            <div class="group-title">
              <span class="required">*</span>
              银行卡信息
            </div>
            <a-input 
              v-model:value="materials.bankCard" 
              placeholder="请输入银行卡号"
              size="large"
            />
            <div class="upload-tip">补贴将直接发放到该银行卡</div>
          </div>
        </div>

        <button 
          class="wizard-btn primary" 
          :disabled="!canSubmit"
          @click="submitApplication"
        >
          提交申请
        </button>
        <button class="wizard-btn secondary" @click="prevStep">上一步</button>
      </div>

      <!-- 步骤3: 完成 -->
      <div v-else-if="currentStep === 3" class="wizard-step step-complete">
        <div class="step-icon success">🎉</div>
        <h2 class="step-title">申请提交成功!</h2>
        <p class="step-desc">
          您的申请已提交,预计3个工作日内完成审核<br/>
          可以在"我的申请"中查看进度
        </p>

        <div class="application-info">
          <div class="info-row">
            <span class="info-label">申请编号:</span>
            <span class="info-value">{{ currentApplication?.applicationNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">补贴金额:</span>
            <span class="info-value amount">¥{{ currentApplication?.subsidyAmount }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">申请时间:</span>
            <span class="info-value">{{ formatTime(currentApplication?.submittedAt) }}</span>
          </div>
        </div>

        <!-- 商家推荐 -->
        <div class="merchant-recommend-section" v-if="selectedType">
          <div class="recommend-title">
            <span class="recommend-icon">🏪</span>
            推荐合作商家
          </div>
          <MerchantRecommend 
            :subsidy-type="selectedType"
            :limit="3"
          />
        </div>

        <div class="complete-actions">
          <button class="wizard-btn primary" @click="viewApplication">
            查看申请详情
          </button>
          <button class="wizard-btn secondary" @click="closeWizard">
            知道了
          </button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CheckCircleFilled, 
  PlusOutlined, 
  CloseCircleFilled 
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useSubsidyStore } from '@/stores/subsidy'
import MerchantRecommend from '@/components/subsidy/MerchantRecommend.vue'
import type { SubsidyType, QualificationMaterials, SubsidyApplication } from '@/stores/subsidy'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'complete'])

const router = useRouter()
const subsidyStore = useSubsidyStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentStep = ref(1)
const selectedType = ref<SubsidyType | null>(null)
const currentApplication = ref<SubsidyApplication | null>(null)

// 材料数据
const materials = ref<QualificationMaterials>({
  purchaseProofs: [],
  oldItemProofs: [],
  invoices: []
})

// 选择补贴类型
const selectType = (type: SubsidyType) => {
  if (subsidyStore.hasAppliedType(type)) {
    message.warning('您已申请过该类型的补贴')
    return
  }
  selectedType.value = type
}

// 创建申请
const createApplication = async () => {
  if (!selectedType.value) {
    message.error('请选择补贴类型')
    return
  }
  
  const result = await subsidyStore.createApplication(selectedType.value)
  
  if (!result.success) {
    if (result.code === 'NOT_VERIFIED') {
      message.error(result.message)
      router.push('/real-name-auth')
      closeWizard()
      return
    }
    
    if (result.code === 'ALREADY_APPLIED') {
      message.error(result.message)
      return
    }
    
    message.error(result.message)
    return
  }
  
  currentApplication.value = result.application!
  currentStep.value = 2
}

// 处理文件上传
const handleUpload = (file: File, field: keyof QualificationMaterials) => {
  // 模拟上传,实际应调用上传API
  const reader = new FileReader()
  reader.onload = (e) => {
    const url = e.target?.result as string
    
    if (field === 'purchaseProofs' || field === 'oldItemProofs' || field === 'invoices') {
      materials.value[field].push(url)
    } else {
      materials.value[field] = url
    }
    
    message.success('上传成功')
  }
  reader.readAsDataURL(file)
  
  return false // 阻止自动上传
}

// 删除图片
const removeImage = (field: 'purchaseProofs' | 'oldItemProofs' | 'invoices', index: number) => {
  materials.value[field].splice(index, 1)
}

// 检查是否可以提交
const canSubmit = computed(() => {
  return materials.value.idCardFront &&
         materials.value.idCardBack &&
         materials.value.purchaseProofs.length > 0 &&
         materials.value.oldItemProofs.length > 0 &&
         materials.value.bankCard
})

// 提交申请
const submitApplication = () => {
  if (!currentApplication.value) {
    message.error('申请不存在')
    return
  }
  
  // 上传材料
  subsidyStore.uploadMaterials(currentApplication.value.id, materials.value)
  
  // 提交申请
  const result = subsidyStore.submitApplication(currentApplication.value.id)
  
  if (!result.success) {
    message.error(result.message)
    return
  }
  
  currentStep.value = 3
}

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN')
}

// 查看申请
const viewApplication = () => {
  emit('complete')
  closeWizard()
  router.push('/subsidy-applications')
}

// 上一步
const prevStep = () => {
  currentStep.value--
}

// 关闭向导
const closeWizard = () => {
  visible.value = false
  currentStep.value = 1
  selectedType.value = null
  currentApplication.value = null
  materials.value = {
    purchaseProofs: [],
    oldItemProofs: [],
    invoices: []
  }
}
</script>

<style scoped>
.subsidy-wizard {
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.steps-indicator {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e8e8e8;
  transition: all 0.3s;
}

.step-dot.active {
  background: #FF6B35;
  width: 24px;
  border-radius: 4px;
}

.step-dot.completed {
  background: #52c41a;
}

.wizard-step {
  text-align: center;
}

.step-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.step-icon.success {
  animation: bounce 0.6s;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.step-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px;
}

.step-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px;
  line-height: 1.6;
}

.subsidy-types {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 24px;
  text-align: left;
}

.type-card {
  background: #f8f8f8;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.type-card.selected {
  border-color: #FF6B35;
  background: #fff5f0;
}

.type-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f0f0f0;
}

.type-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.type-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.type-amount {
  font-size: 20px;
  font-weight: bold;
  color: #FF6B35;
  margin-bottom: 4px;
}

.type-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.type-quota {
  margin-top: 12px;
}

.quota-bar {
  height: 4px;
  background: #e8e8e8;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.quota-fill {
  height: 100%;
  background: #FF6B35;
  transition: width 0.3s;
}

.quota-text {
  font-size: 12px;
  color: #999;
}

.applied-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #52c41a;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.upload-section {
  text-align: left;
  margin-bottom: 24px;
}

.upload-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.required {
  color: #ff4d4f;
  margin-right: 4px;
}

.upload-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.upload-box {
  aspect-ratio: 3/2;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-box:hover {
  border-color: #FF6B35;
}

.upload-box.uploaded {
  border-style: solid;
  border-color: #52c41a;
}

.upload-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.upload-placeholder :deep(.anticon) {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-preview {
  height: 100%;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.upload-item-small {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.upload-item-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 18px;
  color: #ff4d4f;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.upload-box-small {
  width: 80px;
  height: 80px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-box-small:hover {
  border-color: #FF6B35;
}

.upload-box-small :deep(.anticon) {
  font-size: 24px;
  color: #999;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.application-info {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.info-value.amount {
  color: #FF6B35;
  font-size: 18px;
  font-weight: bold;
}

.wizard-btn {
  width: 100%;
  padding: 14px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  margin-bottom: 12px;
}

.wizard-btn.primary {
  background: #FF6B35;
  color: white;
}

.wizard-btn.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.wizard-btn.secondary {
  background: white;
  color: #666;
  border: 1px solid #e8e8e8;
}

.wizard-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.complete-actions {
  margin-top: 32px;
}

.merchant-recommend-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.recommend-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.recommend-icon {
  font-size: 20px;
}
</style>

