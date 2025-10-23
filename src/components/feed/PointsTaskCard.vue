<template>
  <div class="points-task-card">
    <div class="card-header">
      <div class="card-title">
        <TrophyOutlined class="title-icon" />
        每日任务
      </div>
      <div class="card-subtitle">今日已赚 {{ data.todayPoints }} 积分</div>
    </div>
    
    <div class="task-list">
      <div 
        v-for="task in data.tasks" 
        :key="task.id"
        class="task-item"
        :class="{ 'completed': task.completed }"
        @click="handleTask(task)"
      >
        <div class="task-icon">
          <CheckCircleFilled v-if="task.completed" class="check-icon" />
          <div v-else class="unchecked-icon"></div>
        </div>
        <div class="task-info">
          <div class="task-name">{{ task.name }}</div>
          <div class="task-points">+{{ task.points }} 积分</div>
        </div>
        <div class="task-action">
          <span v-if="task.completed" class="completed-text">已完成</span>
          <a-button v-else type="primary" size="small">去完成</a-button>
        </div>
      </div>
    </div>
    
    <div class="card-footer" @click="viewAllTasks">
      <span>查看全部任务</span>
      <RightOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  TrophyOutlined,
  CheckCircleFilled,
  RightOutlined 
} from '@ant-design/icons-vue'

interface Task {
  id: number
  name: string
  points: number
  completed: boolean
}

interface Props {
  data: {
    tasks: Task[]
    todayPoints: number
  }
}

defineProps<Props>()
const router = useRouter()

const handleTask = (task: Task) => {
  if (task.completed) return
  console.log('执行任务:', task)
  // 根据任务类型跳转到对应页面
  if (task.name.includes('签到')) {
    router.push('/check-in')
  } else if (task.name.includes('分享')) {
    // 触发分享
  } else {
    router.push('/earn-points')
  }
}

const viewAllTasks = () => {
  router.push('/earn-points')
}
</script>

<style scoped>
.points-task-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.title-icon {
  color: #FFB800;
}

.card-subtitle {
  font-size: 13px;
  color: #999;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.task-item:not(.completed):active {
  transform: scale(0.98);
  background: #f0f0f0;
}

.task-item.completed {
  opacity: 0.6;
  cursor: default;
}

.task-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 24px;
  color: #52c41a;
}

.unchecked-icon {
  width: 20px;
  height: 20px;
  border: 2px solid #d9d9d9;
  border-radius: 50%;
}

.task-info {
  flex: 1;
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.task-points {
  font-size: 12px;
  color: #FFB800;
  font-weight: 500;
}

.task-action {
  min-width: 70px;
  text-align: right;
}

.completed-text {
  font-size: 12px;
  color: #999;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.card-footer:active {
  color: #FFB800;
}
</style>

