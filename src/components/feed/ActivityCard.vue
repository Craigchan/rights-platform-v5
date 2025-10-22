<template>
  <div class="activity-card">
    <div class="card-header">
      <div class="card-title">
        <FireOutlined class="title-icon" />
        热门活动
      </div>
      <div class="card-subtitle">精彩活动不容错过</div>
    </div>
    
    <div class="activity-list">
      <div 
        v-for="activity in data.activities" 
        :key="activity.id"
        class="activity-item"
        @click="viewActivity(activity)"
      >
        <SafeImage 
          :src="activity.image" 
          :alt="activity.name" 
          class="activity-image"
        />
        <div class="activity-overlay">
          <div class="activity-tag">{{ activity.tag }}</div>
          <div class="activity-name">{{ activity.name }}</div>
        </div>
      </div>
    </div>
    
    <div class="card-footer" @click="viewMore">
      <span>查看更多活动</span>
      <RightOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  FireOutlined,
  RightOutlined 
} from '@ant-design/icons-vue'
import SafeImage from '../common/SafeImage.vue'

interface Activity {
  id: number
  name: string
  tag: string
  image: string
}

interface Props {
  data: {
    activities: Activity[]
  }
}

defineProps<Props>()
const router = useRouter()

const viewActivity = (activity: Activity) => {
  console.log('查看活动:', activity)
  router.push(`/activity/${activity.id}`)
}

const viewMore = () => {
  router.push('/activity-center')
}
</script>

<style scoped>
.activity-card {
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
  color: #FF4D4F;
}

.card-subtitle {
  font-size: 13px;
  color: #999;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  position: relative;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.activity-item:active {
  transform: scale(0.98);
}

.activity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.activity-tag {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(255, 107, 53, 0.9);
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
  margin-bottom: 8px;
}

.activity-name {
  font-size: 15px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
  color: #FF4D4F;
}
</style>

