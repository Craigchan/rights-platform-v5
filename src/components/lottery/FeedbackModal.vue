<template>
  <a-modal
    v-model:open="visible"
    title="反馈与建议"
    :footer="null"
    width="90%"
    :style="{ maxWidth: '500px' }"
    @cancel="handleCancel"
  >
    <div class="feedback-modal">
      <!-- 满意度评价 -->
      <div class="feedback-section">
        <div class="section-title">
          <SmileOutlined class="title-icon" />
          <span>您对抽奖体验的满意度?</span>
        </div>
        <div class="rating-container">
          <a-rate v-model:value="formData.rating" :count="5" allow-half>
            <template #character>
              <HeartFilled />
            </template>
          </a-rate>
          <span class="rating-text">{{ ratingText }}</span>
        </div>
      </div>

      <!-- 反馈类型 -->
      <div class="feedback-section">
        <div class="section-title">
          <TagsOutlined class="title-icon" />
          <span>反馈类型</span>
        </div>
        <a-radio-group v-model:value="formData.type" button-style="solid">
          <a-radio-button value="bug">问题反馈</a-radio-button>
          <a-radio-button value="suggestion">功能建议</a-radio-button>
          <a-radio-button value="praise">表扬鼓励</a-radio-button>
          <a-radio-button value="other">其他</a-radio-button>
        </a-radio-group>
      </div>

      <!-- 快捷标签 -->
      <div class="feedback-section">
        <div class="section-title">
          <TagOutlined class="title-icon" />
          <span>快捷标签(可多选)</span>
        </div>
        <div class="tags-container">
          <a-checkable-tag
            v-for="tag in quickTags"
            :key="tag"
            :checked="formData.tags.includes(tag)"
            @change="(checked) => handleTagChange(tag, checked)"
          >
            {{ tag }}
          </a-checkable-tag>
        </div>
      </div>

      <!-- 详细描述 -->
      <div class="feedback-section">
        <div class="section-title">
          <FileTextOutlined class="title-icon" />
          <span>详细描述</span>
        </div>
        <a-textarea
          v-model:value="formData.content"
          placeholder="请详细描述您的反馈或建议..."
          :rows="4"
          :maxlength="500"
          show-count
        />
      </div>

      <!-- 联系方式(可选) -->
      <div class="feedback-section">
        <div class="section-title">
          <PhoneOutlined class="title-icon" />
          <span>联系方式(可选)</span>
        </div>
        <a-input
          v-model:value="formData.contact"
          placeholder="手机号或邮箱,方便我们与您联系"
        />
      </div>

      <!-- 提交按钮 -->
      <div class="submit-container">
        <a-button @click="handleCancel">取消</a-button>
        <a-button 
          type="primary" 
          :loading="submitting"
          @click="handleSubmit"
        >
          提交反馈
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  SmileOutlined,
  TagsOutlined,
  TagOutlined,
  FileTextOutlined,
  PhoneOutlined,
  HeartFilled
} from '@ant-design/icons-vue'
import { soundManager } from '@/utils/soundAndVibration'

// Props
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:open', 'submit'])

// 状态
const visible = ref(false)
const submitting = ref(false)

// 表单数据
const formData = ref({
  rating: 5,
  type: 'suggestion',
  tags: [] as string[],
  content: '',
  contact: ''
})

// 快捷标签
const quickTags = [
  '音效很棒',
  '动画流畅',
  '奖品丰富',
  '操作简单',
  '加载慢',
  '卡顿',
  '奖品少',
  '规则不清',
  '希望增加音效',
  '希望增加奖品',
  '希望增加抽奖次数'
]

// 评分文字
const ratingText = computed(() => {
  const rating = formData.value.rating
  if (rating >= 4.5) return '非常满意'
  if (rating >= 3.5) return '比较满意'
  if (rating >= 2.5) return '一般'
  if (rating >= 1.5) return '不太满意'
  return '很不满意'
})

// 监听props变化
watch(() => props.open, (val) => {
  visible.value = val
})

// 监听visible变化
watch(visible, (val) => {
  emit('update:open', val)
})

// 处理标签变化
const handleTagChange = (tag: string, checked: boolean) => {
  if (checked) {
    formData.value.tags.push(tag)
  } else {
    formData.value.tags = formData.value.tags.filter(t => t !== tag)
  }
  soundManager.playClick()
}

// 处理取消
const handleCancel = () => {
  visible.value = false
}

// 处理提交
const handleSubmit = async () => {
  // 验证
  if (!formData.value.content.trim()) {
    message.warning('请填写详细描述')
    return
  }

  submitting.value = true

  try {
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 播放成功音效
    soundManager.playSuccess()

    message.success('感谢您的反馈!我们会认真处理')
    
    // 触发提交事件
    emit('submit', formData.value)

    // 重置表单
    formData.value = {
      rating: 5,
      type: 'suggestion',
      tags: [],
      content: '',
      contact: ''
    }

    // 关闭弹窗
    visible.value = false
  } catch (error) {
    soundManager.playError()
    message.error('提交失败,请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.feedback-modal {
  padding: 8px 0;
}

.feedback-section {
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #333;

  .title-icon {
    font-size: 16px;
    color: #FF6B35;
  }
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 12px;

  .rating-text {
    font-size: 14px;
    color: #FF6B35;
    font-weight: 500;
  }
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  :deep(.ant-tag) {
    margin: 0;
    padding: 4px 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s;

    &.ant-tag-checkable-checked {
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      border-color: #FF6B35;
    }
  }
}

.submit-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>

