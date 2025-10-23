<template>
  <a-modal
    v-model:open="visible"
    :title="null"
    :footer="null"
    :width="'85%'"
    class="task-modal"
  >
    <div class="task-content">
      <!-- 签到任务 -->
      <div v-if="task?.type === 'checkin'" class="task-checkin">
        <div class="task-icon-large">📅</div>
        <h2 class="task-title">每日签到</h2>
        <p class="task-reward">完成可获得 +{{ task.points }}积分</p>

        <div class="checkin-calendar">
          <div 
            v-for="day in 7" 
            :key="day"
            class="calendar-day"
            :class="{ 
              checked: day <= checkedDays,
              today: day === checkedDays + 1
            }"
          >
            <div class="day-number">第{{ day }}天</div>
            <div class="day-points">+{{ day * 10 }}</div>
            <CheckCircleOutlined v-if="day <= checkedDays" class="check-icon" />
          </div>
        </div>

        <button class="task-action-btn" @click="handleCheckin">
          立即签到
        </button>
      </div>

      <!-- 分享任务 -->
      <div v-else-if="task?.type === 'share'" class="task-share">
        <div class="task-icon-large">📤</div>
        <h2 class="task-title">分享给好友</h2>
        <p class="task-reward">完成可获得 +{{ task.points }}积分</p>

        <div class="share-options">
          <div class="share-option" @click="shareToWeChat">
            <div class="share-icon wechat">💬</div>
            <div class="share-name">微信</div>
          </div>
          <div class="share-option" @click="shareToMoments">
            <div class="share-icon moments">🔄</div>
            <div class="share-name">朋友圈</div>
          </div>
          <div class="share-option" @click="copyLink">
            <div class="share-icon link">🔗</div>
            <div class="share-name">复制链接</div>
          </div>
        </div>
      </div>

      <!-- 评价任务 -->
      <div v-else-if="task?.type === 'review'" class="task-review">
        <div class="task-icon-large">⭐</div>
        <h2 class="task-title">评价商品</h2>
        <p class="task-reward">完成可获得 +{{ task.points }}积分</p>

        <div class="review-form">
          <div class="rating-section">
            <a-rate v-model:value="rating" :count="5" />
          </div>
          <a-textarea 
            v-model:value="reviewText"
            :rows="4"
            placeholder="分享您的使用感受..."
            :maxlength="200"
            show-count
          />
        </div>

        <button 
          class="task-action-btn" 
          :disabled="!rating || !reviewText"
          @click="submitReview"
        >
          提交评价
        </button>
      </div>

      <!-- 浏览任务 -->
      <div v-else-if="task?.type === 'browse'" class="task-browse">
        <div class="task-icon-large">👀</div>
        <h2 class="task-title">浏览商品</h2>
        <p class="task-reward">浏览{{ task.target }}个商品可获得 +{{ task.points }}积分</p>

        <div class="browse-progress">
          <a-progress 
            :percent="(browseCount / task.target) * 100" 
            :show-info="false"
            stroke-color="#FF6B35"
          />
          <div class="progress-text">
            已浏览 {{ browseCount }}/{{ task.target }}
          </div>
        </div>

        <button class="task-action-btn" @click="goToBrowse">
          去浏览
        </button>
      </div>
    </div>

    <!-- 积分获得动画 -->
    <div v-if="showAnimation" class="points-animation">
      <div class="animation-content">
        <div class="animation-icon">🎉</div>
        <div class="animation-text">+{{ earnedPoints }}积分</div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Task {
  id: number
  type: 'checkin' | 'share' | 'review' | 'browse'
  name: string
  points: number
  target?: number
}

interface Props {
  modelValue: boolean
  task: Task | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'complete'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 签到相关
const checkedDays = ref(3)

// 评价相关
const rating = ref(0)
const reviewText = ref('')

// 浏览相关
const browseCount = ref(0)

// 动画相关
const showAnimation = ref(false)
const earnedPoints = ref(0)

const handleCheckin = () => {
  completeTask(props.task!.points)
}

const shareToWeChat = () => {
  message.success('分享到微信成功')
  completeTask(props.task!.points)
}

const shareToMoments = () => {
  message.success('分享到朋友圈成功')
  completeTask(props.task!.points)
}

const copyLink = () => {
  message.success('链接已复制')
  completeTask(props.task!.points)
}

const submitReview = () => {
  if (!rating.value || !reviewText.value) {
    message.error('请完成评价')
    return
  }
  message.success('评价提交成功')
  completeTask(props.task!.points)
}

const goToBrowse = () => {
  visible.value = false
  // TODO: 跳转到商品列表
}

const completeTask = (points: number) => {
  earnedPoints.value = points
  showAnimation.value = true

  setTimeout(() => {
    showAnimation.value = false
    visible.value = false
    emit('complete', points)
  }, 2000)
}
</script>

<style scoped>
.task-content {
  padding: 20px;
  text-align: center;
}

.task-icon-large {
  font-size: 64px;
  margin-bottom: 16px;
}

.task-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px;
}

.task-reward {
  font-size: 16px;
  color: #FF6B35;
  font-weight: 600;
  margin: 0 0 24px;
}

.checkin-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.calendar-day {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 4px;
  position: relative;
}

.calendar-day.checked {
  background: #fff5f0;
  border: 1px solid #FF6B35;
}

.calendar-day.today {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
  color: white;
}

.day-number {
  font-size: 11px;
  margin-bottom: 4px;
}

.day-points {
  font-size: 13px;
  font-weight: 600;
}

.check-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  color: #52c41a;
  font-size: 14px;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.share-option {
  cursor: pointer;
  transition: all 0.3s;
}

.share-option:active {
  transform: scale(0.95);
}

.share-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 8px;
}

.share-name {
  font-size: 13px;
  color: #666;
}

.review-form {
  margin-bottom: 24px;
}

.rating-section {
  margin-bottom: 16px;
}

.browse-progress {
  margin-bottom: 24px;
}

.progress-text {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.task-action-btn {
  width: 100%;
  padding: 14px;
  background: #FF6B35;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.task-action-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.task-action-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.points-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animation-content {
  text-align: center;
  animation: bounceIn 0.6s;
}

@keyframes bounceIn {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animation-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.animation-text {
  font-size: 36px;
  font-weight: bold;
  color: #FFD700;
}
</style>

