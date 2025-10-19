<template>
  <div class="subsidy-card" @click="handleClick">
    <div class="card-header">
      <div class="card-badge">🎁 政府补贴</div>
      <div class="card-status">进行中</div>
    </div>
    
    <div class="card-body">
      <h3 class="card-title">{{ data.title }}</h3>
      <div class="card-amount">最高可得 <span class="amount">¥{{ data.amount }}</span></div>
      
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-text">
          已邀请 {{ data.progress }}/{{ data.total }} 位好友
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <button class="action-btn">继续邀请好友</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  data: {
    title: string
    amount: number
    progress: number
    total: number
    status: string
  }
}

const props = defineProps<Props>()
const router = useRouter()

const progressPercent = computed(() => {
  return (props.data.progress / props.data.total) * 100
})

const handleClick = () => {
  router.push('/subsidy-help')
}
</script>

<style scoped>
.subsidy-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 16px;
}

.subsidy-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-badge {
  font-size: 14px;
  font-weight: 600;
}

.card-status {
  background: rgba(255, 255, 255, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.card-body {
  margin-bottom: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 8px;
}

.card-amount {
  font-size: 14px;
  opacity: 0.9;
}

.amount {
  font-size: 28px;
  font-weight: bold;
  margin-left: 4px;
}

.progress-section {
  margin-top: 16px;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 13px;
  opacity: 0.9;
}

.card-footer {
  display: flex;
  justify-content: center;
}

.action-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.action-btn:active {
  transform: scale(0.95);
}
</style>

