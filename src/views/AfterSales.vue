<template>
  <div class="after-sales-page">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <LeftOutlined />
      </div>
      <div class="page-title">申请售后</div>
      <div class="placeholder"></div>
    </div>

    <!-- 商品信息 -->
    <div class="product-section">
      <div class="section-title">商品信息</div>
      <div class="product-item">
        <div class="product-image" :style="{ background: product.color }"></div>
        <div class="product-info">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-spec">{{ product.spec }}</div>
          <div class="product-price">¥{{ product.price }}</div>
        </div>
      </div>
    </div>

    <!-- 售后类型 -->
    <div class="type-section">
      <div class="section-title">售后类型</div>
      <a-radio-group v-model:value="form.type" class="type-options">
        <a-radio value="refund_only">仅退款</a-radio>
        <a-radio value="return_refund">退货退款</a-radio>
        <a-radio value="exchange">换货</a-radio>
      </a-radio-group>
    </div>

    <!-- 退款金额 -->
    <div class="amount-section" v-if="form.type !== 'exchange'">
      <div class="section-title">退款金额</div>
      <div class="amount-value">¥{{ product.price }}</div>
      <div class="amount-tip">最多可退¥{{ product.price }}</div>
    </div>

    <!-- 退款原因 -->
    <div class="reason-section">
      <div class="section-title">
        <span>退款原因</span>
        <span class="required">*</span>
      </div>
      <a-select 
        v-model:value="form.reason" 
        placeholder="请选择退款原因"
        size="large"
      >
        <a-select-option value="质量问题">质量问题</a-select-option>
        <a-select-option value="描述不符">描述不符</a-select-option>
        <a-select-option value="尺寸不合适">尺寸不合适</a-select-option>
        <a-select-option value="颜色/款式不喜欢">颜色/款式不喜欢</a-select-option>
        <a-select-option value="收到商品破损">收到商品破损</a-select-option>
        <a-select-option value="未按约定时间发货">未按约定时间发货</a-select-option>
        <a-select-option value="其他原因">其他原因</a-select-option>
      </a-select>
    </div>

    <!-- 问题描述 -->
    <div class="description-section">
      <div class="section-title">问题描述</div>
      <a-textarea 
        v-model:value="form.description"
        placeholder="请详细描述您遇到的问题,以便我们更好地为您处理"
        :rows="4"
        :maxlength="200"
        show-count
      />
    </div>

    <!-- 上传图片 -->
    <div class="upload-section">
      <div class="section-title">上传凭证</div>
      <div class="upload-tip">最多上传3张图片,支持jpg、png格式</div>
      <div class="upload-list">
        <div 
          v-for="(image, index) in form.images" 
          :key="index"
          class="upload-item"
        >
          <img v-img-fallback :src="image" alt="">
          <div class="delete-btn" @click="deleteImage(index)">
            <CloseCircleFilled />
          </div>
        </div>
        <div 
          v-if="form.images.length < 3"
          class="upload-btn"
          @click="uploadImage"
        >
          <PlusOutlined />
          <div class="upload-text">上传图片</div>
        </div>
      </div>
    </div>

    <!-- 联系方式 -->
    <div class="contact-section">
      <div class="section-title">
        <span>联系方式</span>
        <span class="required">*</span>
      </div>
      <a-input 
        v-model:value="form.phone"
        placeholder="请输入您的手机号"
        size="large"
      />
    </div>

    <!-- 提交按钮 -->
    <div class="submit-section">
      <a-button 
        type="primary" 
        size="large" 
        block
        @click="submitAfterSales"
      >
        提交申请
      </a-button>
    </div>

    <!-- 温馨提示 -->
    <div class="tips-section">
      <div class="tips-title">温馨提示</div>
      <div class="tips-content">
        <p>1. 请确保商品完好,不影响二次销售</p>
        <p>2. 退货商品需包含完整包装、配件及赠品</p>
        <p>3. 审核通过后,我们会尽快为您处理退款</p>
        <p>4. 如有疑问,请联系客服咨询</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  PlusOutlined,
  CloseCircleFilled
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 商品信息
const product = ref({
  id: 1,
  name: '智能手环运动手表',
  spec: '黑色/标准版',
  price: 299.00,
  color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
})

// 表单数据
const form = ref({
  type: 'refund_only',
  reason: '',
  description: '',
  images: [] as string[],
  phone: ''
})

// 方法
const goBack = () => {
  router.back()
}

const uploadImage = () => {
  // 模拟上传图片
  message.success('图片上传成功')
  form.value.images.push('https://via.placeholder.com/150')
}

const deleteImage = (index: number) => {
  form.value.images.splice(index, 1)
}

const submitAfterSales = () => {
  if (!form.value.reason) {
    message.error('请选择退款原因')
    return
  }
  
  if (!form.value.phone) {
    message.error('请输入联系方式')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    message.error('请输入正确的手机号')
    return
  }
  
  message.success('售后申请已提交,我们会尽快处理')
  setTimeout(() => {
    router.back()
  }, 1500)
}
</script>

<style scoped>
.after-sales-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
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
.placeholder {
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

/* 区块样式 */
.product-section,
.type-section,
.amount-section,
.reason-section,
.description-section,
.upload-section,
.contact-section {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.required {
  color: #ff4d4f;
  margin-left: 4px;
}

/* 商品信息 */
.product-item {
  display: flex;
  gap: 12px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.product-spec {
  font-size: 12px;
  color: #999;
}

.product-price {
  font-size: 15px;
  color: #ff4d4f;
  font-weight: 600;
}

/* 售后类型 */
.type-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.type-options :deep(.ant-radio-wrapper) {
  font-size: 14px;
}

/* 退款金额 */
.amount-value {
  font-size: 24px;
  color: #ff4d4f;
  font-weight: 600;
  margin-bottom: 8px;
}

.amount-tip {
  font-size: 12px;
  color: #999;
}

/* 问题描述 */
.description-section :deep(.ant-input) {
  font-size: 14px;
}

/* 上传图片 */
.upload-tip {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.upload-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.upload-item {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.upload-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.upload-btn {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  border-color: #FF6B35;
  color: #FF6B35;
}

.upload-btn :deep(.anticon) {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 12px;
  color: #999;
}

/* 提交按钮 */
.submit-section {
  padding: 15px;
}

.submit-section :deep(.ant-btn) {
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  border: none;
}

/* 温馨提示 */
.tips-section {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}

.tips-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.tips-content p {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
  margin: 0;
}
</style>

