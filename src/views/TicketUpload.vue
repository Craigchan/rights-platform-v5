<template>
  <div class="ticket-upload-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">上传票根</span>
      <div class="placeholder"></div>
    </div>

    <!-- 上传引导 -->
    <div v-if="!uploadedImage" class="upload-guide">
      <div class="guide-icon">📸</div>
      <div class="guide-title">上传您的消费票根</div>
      <div class="guide-desc">上传票根后可参与抽奖活动,赢取丰厚奖品!</div>
      
      <div class="guide-tips">
        <div class="tip-title">拍摄提示:</div>
        <div class="tip-item">✓ 确保票根信息清晰可见</div>
        <div class="tip-item">✓ 避免反光和模糊</div>
        <div class="tip-item">✓ 包含完整的票根内容</div>
      </div>

      <!-- 上传按钮 -->
      <div class="upload-actions">
        <div class="upload-btn camera" @click="handleCamera">
          <CameraOutlined class="btn-icon" />
          <span>拍照上传</span>
        </div>
        <div class="upload-btn album" @click="handleAlbum">
          <PictureOutlined class="btn-icon" />
          <span>相册选择</span>
        </div>
      </div>

      <!-- 隐藏的文件输入 -->
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        capture="environment"
        style="display: none"
        @change="handleFileSelect"
      />
    </div>

    <!-- 图片预览和信息填写 -->
    <div v-else class="ticket-form">
      <!-- 图片预览 -->
      <div class="image-preview">
        <img :src="uploadedImage" alt="票根图片" />
        <div class="change-image" @click="handleChangeImage">
          <EditOutlined /> 更换图片
        </div>
      </div>

      <!-- OCR识别中 -->
      <div v-if="isRecognizing" class="recognizing">
        <LoadingOutlined class="loading-icon" />
        <div class="recognizing-text">正在识别票根信息...</div>
      </div>

      <!-- 票根信息表单 -->
      <div v-else class="ticket-info">
        <div class="form-section">
          <div class="section-title">票根类型</div>
          <div class="ticket-types">
            <div 
              v-for="type in ticketTypes" 
              :key="type.value"
              class="type-item"
              :class="{ active: form.type === type.value }"
              @click="form.type = type.value"
            >
              <span class="type-icon">{{ type.icon }}</span>
              <span class="type-label">{{ type.label }}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-title">消费信息</div>
          <div class="form-item">
            <div class="item-label">商家名称</div>
            <input 
              v-model="form.merchantName" 
              type="text" 
              placeholder="请输入商家名称"
              class="item-input"
            />
          </div>
          <div class="form-item">
            <div class="item-label">消费金额</div>
            <div class="amount-input">
              <span class="currency">¥</span>
              <input 
                v-model="form.amount" 
                type="number" 
                placeholder="0.00"
                class="item-input"
              />
            </div>
          </div>
          <div class="form-item">
            <div class="item-label">消费时间</div>
            <input 
              v-model="form.consumeTime" 
              type="datetime-local" 
              class="item-input"
            />
          </div>
          <div class="form-item">
            <div class="item-label">备注(选填)</div>
            <textarea 
              v-model="form.remark" 
              placeholder="请输入备注信息"
              class="item-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-actions">
          <a-button type="primary" size="large" block @click="handleSubmit" :loading="isSubmitting">
            提交审核
          </a-button>
          <div class="submit-tip">提交后将进入审核流程,审核通过后可用于参与抽奖</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '../stores/user'
import { 
  LeftOutlined, 
  CameraOutlined, 
  PictureOutlined,
  EditOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 文件输入引用
const fileInput = ref<HTMLInputElement | null>(null)

// 上传的图片
const uploadedImage = ref('')

// OCR识别中
const isRecognizing = ref(false)

// 提交中
const isSubmitting = ref(false)

// 票根类型
const ticketTypes = [
  { value: 'sports', label: '体育赛事', icon: '⚽' },
  { value: 'movie', label: '电影票', icon: '🎬' },
  { value: 'shopping', label: '商超购物', icon: '🛒' },
  { value: 'dining', label: '餐饮消费', icon: '🍽️' },
  { value: 'other', label: '其他', icon: '📝' }
]

// 表单数据
const form = ref({
  type: 'sports',
  merchantName: '',
  amount: '',
  consumeTime: '',
  remark: ''
})

// 拍照上传
const handleCamera = () => {
  if (fileInput.value) {
    fileInput.value.setAttribute('capture', 'environment')
    fileInput.value.click()
  }
}

// 相册选择
const handleAlbum = () => {
  if (fileInput.value) {
    fileInput.value.removeAttribute('capture')
    fileInput.value.click()
  }
}

// 文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 检查文件大小(限制3MB)
    if (file.size > 3 * 1024 * 1024) {
      message.error('图片大小不能超过3MB')
      return
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      message.error('请选择图片文件')
      return
    }

    // 读取图片
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string
      // 模拟OCR识别
      simulateOCR()
    }
    reader.readAsDataURL(file)
  }

  // 清空input,允许重复选择同一文件
  target.value = ''
}

// 更换图片
const handleChangeImage = () => {
  uploadedImage.value = ''
  form.value = {
    type: 'sports',
    merchantName: '',
    amount: '',
    consumeTime: '',
    remark: ''
  }
}

// 模拟OCR识别
const simulateOCR = () => {
  isRecognizing.value = true
  
  // 模拟识别过程(2秒)
  setTimeout(() => {
    isRecognizing.value = false
    
    // 模拟识别结果
    form.value = {
      type: 'sports',
      merchantName: '大连人足球俱乐部',
      amount: '180',
      consumeTime: new Date().toISOString().slice(0, 16),
      remark: ''
    }
    
    message.success('识别成功,请确认信息')
  }, 2000)
}

// 提交审核
const handleSubmit = () => {
  // 表单验证
  if (!form.value.merchantName) {
    message.error('请输入商家名称')
    return
  }
  if (!form.value.amount || parseFloat(form.value.amount) <= 0) {
    message.error('请输入正确的消费金额')
    return
  }
  if (!form.value.consumeTime) {
    message.error('请选择消费时间')
    return
  }

  isSubmitting.value = true

  // 模拟提交
  setTimeout(() => {
    isSubmitting.value = false
    
    // 更新票根拼图进度
    const userStore = useUserStore()
    const updated = userStore.updatePuzzleProgress(form.value.type)
    
    if (updated) {
      message.success('提交成功!票根拼图进度已更新')
    } else {
      message.success('提交成功,请等待审核')
    }
    
    // 跳转到我的票根页面
    router.push('/my-tickets')
  }, 1000)
}
</script>

<style scoped lang="scss">
.ticket-upload-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  .anticon {
    font-size: 20px;
    cursor: pointer;
  }

  .page-title {
    font-size: 18px;
    font-weight: 500;
  }

  .placeholder {
    width: 20px;
  }
}

.upload-guide {
  padding: 40px 20px;
  text-align: center;

  .guide-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }

  .guide-title {
    font-size: 24px;
    font-weight: 500;
    color: #333;
    margin-bottom: 10px;
  }

  .guide-desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 30px;
  }

  .guide-tips {
    background: linear-gradient(135deg, #fff5e6 0%, #ffe7ba 100%);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 40px;
    text-align: left;

    .tip-title {
      font-size: 15px;
      font-weight: 500;
      color: #ff6b35;
      margin-bottom: 12px;
    }

    .tip-item {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .upload-actions {
    display: flex;
    gap: 15px;
    padding: 0 20px;

    .upload-btn {
      flex: 1;
      background: #fff;
      border-radius: 12px;
      padding: 30px 20px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      &:active {
        transform: scale(0.98);
      }

      .btn-icon {
        font-size: 40px;
        display: block;
        margin-bottom: 12px;
      }

      span {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      &.camera {
        .btn-icon {
          color: #1890ff;
        }
      }

      &.album {
        .btn-icon {
          color: #52c41a;
        }
      }
    }
  }
}

.ticket-form {
  .image-preview {
    position: relative;
    margin: 20px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      display: block;
    }

    .change-image {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 12px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.3s;

      &:active {
        background: rgba(0, 0, 0, 0.8);
      }

      .anticon {
        margin-right: 6px;
      }
    }
  }

  .recognizing {
    text-align: center;
    padding: 60px 20px;

    .loading-icon {
      font-size: 48px;
      color: #1890ff;
      margin-bottom: 20px;
    }

    .recognizing-text {
      font-size: 16px;
      color: #666;
    }
  }

  .ticket-info {
    padding: 0 20px;

    .form-section {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 15px;

      .section-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 15px;
        padding-left: 12px;
        border-left: 4px solid #ff6b35;
      }

      .ticket-types {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;

        .type-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 10px;
          border: 2px solid #f0f0f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;

          &.active {
            border-color: #ff6b35;
            background: linear-gradient(135deg, #fff5e6 0%, #ffe7ba 100%);
          }

          .type-icon {
            font-size: 28px;
            margin-bottom: 8px;
          }

          .type-label {
            font-size: 13px;
            color: #666;
          }

          &.active .type-label {
            color: #ff6b35;
            font-weight: 500;
          }
        }
      }

      .form-item {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        .item-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .item-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.3s;

          &:focus {
            outline: none;
            border-color: #ff6b35;
          }
        }

        .amount-input {
          display: flex;
          align-items: center;
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          padding: 0 12px;
          transition: border-color 0.3s;

          &:focus-within {
            border-color: #ff6b35;
          }

          .currency {
            font-size: 16px;
            color: #ff6b35;
            font-weight: 500;
            margin-right: 8px;
          }

          .item-input {
            border: none;
            padding: 12px 0;
          }
        }

        .item-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d9d9d9;
          border-radius: 8px;
          font-size: 15px;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.3s;

          &:focus {
            outline: none;
            border-color: #ff6b35;
          }
        }
      }
    }

    .submit-actions {
      margin-top: 30px;

      .submit-tip {
        text-align: center;
        font-size: 13px;
        color: #999;
        margin-top: 12px;
        line-height: 1.6;
      }
    }
  }
}
</style>

