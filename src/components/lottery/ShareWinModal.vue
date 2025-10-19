<template>
  <a-modal
    v-model:open="visible"
    title="分享中奖"
    :footer="null"
    width="90%"
    :style="{ maxWidth: '400px' }"
    @cancel="handleCancel"
  >
    <div class="share-win-modal">
      <!-- 分享卡片预览 -->
      <div class="share-card" ref="shareCardRef">
        <div class="card-bg">
          <div class="card-header">
            <div class="platform-name">票根经济平台</div>
            <div class="win-badge">🎉 中奖啦!</div>
          </div>
          
          <div class="card-content">
            <div class="prize-icon-large">{{ prize?.icon || '🎁' }}</div>
            <div class="prize-name-large">{{ prize?.name }}</div>
            <div class="prize-value-large">{{ prize?.value }}</div>
          </div>

          <div class="card-footer">
            <div class="user-info">
              <div class="user-avatar">{{ userName.charAt(0) }}</div>
              <div class="user-name">{{ userName }}</div>
            </div>
            <div class="win-time">{{ currentTime }}</div>
          </div>

          <div class="card-decoration">
            <div class="decoration-item" v-for="i in 10" :key="i"></div>
          </div>
        </div>
      </div>

      <!-- 分享文案 -->
      <div class="share-text-section">
        <div class="section-label">分享文案</div>
        <a-textarea
          v-model:value="shareText"
          :rows="3"
          placeholder="添加一些文字吧..."
        />
      </div>

      <!-- 分享渠道 -->
      <div class="share-channels">
        <div class="section-label">分享到</div>
        <div class="channels-grid">
          <div class="channel-item" @click="handleShare('wechat')">
            <div class="channel-icon" style="background: #07C160">
              <WechatOutlined />
            </div>
            <div class="channel-name">微信</div>
          </div>
          <div class="channel-item" @click="handleShare('moments')">
            <div class="channel-icon" style="background: #07C160">
              <MessageOutlined />
            </div>
            <div class="channel-name">朋友圈</div>
          </div>
          <div class="channel-item" @click="handleShare('qq')">
            <div class="channel-icon" style="background: #12B7F5">
              <QqOutlined />
            </div>
            <div class="channel-name">QQ</div>
          </div>
          <div class="channel-item" @click="handleShare('weibo')">
            <div class="channel-icon" style="background: #E6162D">
              <WeiboOutlined />
            </div>
            <div class="channel-name">微博</div>
          </div>
          <div class="channel-item" @click="handleCopyLink">
            <div class="channel-icon" style="background: #999">
              <LinkOutlined />
            </div>
            <div class="channel-name">复制链接</div>
          </div>
          <div class="channel-item" @click="handleSaveImage">
            <div class="channel-icon" style="background: #FF6B35">
              <PictureOutlined />
            </div>
            <div class="channel-name">保存图片</div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  WechatOutlined,
  MessageOutlined,
  QqOutlined,
  WeiboOutlined,
  LinkOutlined,
  PictureOutlined
} from '@ant-design/icons-vue'
import { soundManager } from '@/utils/soundAndVibration'

// Props
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  prize: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:open'])

// 状态
const visible = ref(false)
const shareCardRef = ref()
const userName = ref('用户' + Math.floor(Math.random() * 10000))

// 分享文案
const shareText = ref('')

// 当前时间
const currentTime = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
})

// 监听props变化
watch(() => props.open, (val) => {
  visible.value = val
  if (val && props.prize) {
    // 生成默认分享文案
    shareText.value = `🎉 太幸运了!我在票根经济平台抽中了【${props.prize.name}】!快来一起参与吧!`
  }
})

// 监听visible变化
watch(visible, (val) => {
  emit('update:open', val)
})

// 处理取消
const handleCancel = () => {
  visible.value = false
}

// 处理分享
const handleShare = (channel: string) => {
  soundManager.playClick()
  
  const channelNames: Record<string, string> = {
    wechat: '微信',
    moments: '朋友圈',
    qq: 'QQ',
    weibo: '微博'
  }
  
  message.success(`正在分享到${channelNames[channel]}...`)
  
  // 这里可以调用实际的分享API
  setTimeout(() => {
    visible.value = false
  }, 1000)
}

// 复制链接
const handleCopyLink = async () => {
  soundManager.playClick()
  
  const link = `https://example.com/lottery/share?prize=${props.prize?.id}`
  
  try {
    await navigator.clipboard.writeText(link)
    message.success('链接已复制到剪贴板')
  } catch (error) {
    message.error('复制失败,请手动复制')
  }
}

// 保存图片
const handleSaveImage = () => {
  soundManager.playClick()
  message.success('图片保存功能开发中...')
  // 这里可以使用html2canvas等库将分享卡片转为图片
}
</script>

<style scoped lang="scss">
.share-win-modal {
  padding: 8px 0;
}

.share-card {
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-bg {
  position: relative;
  padding: 24px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.platform-name {
  font-size: 14px;
  font-weight: bold;
}

.win-badge {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 12px;
}

.card-content {
  text-align: center;
  padding: 32px 0;
}

.prize-icon-large {
  font-size: 80px;
  margin-bottom: 16px;
  animation: prizeFloat 2s ease-in-out infinite;
}

@keyframes prizeFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.prize-name-large {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.prize-value-large {
  font-size: 18px;
  opacity: 0.9;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-name {
  font-size: 14px;
}

.win-time {
  font-size: 12px;
  opacity: 0.8;
}

.card-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-item {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: decorationFloat 3s ease-in-out infinite;
  
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      animation-delay: #{$i * 0.3}s;
    }
  }
}

@keyframes decorationFloat {
  0%, 100% {
    transform: translate(0, 0);
    opacity: 0.2;
  }
  50% {
    transform: translate(10px, -10px);
    opacity: 0.4;
  }
}

.share-text-section {
  margin-bottom: 24px;
}

.section-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.share-channels {
  
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.channel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.95);
  }
}

.channel-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.channel-name {
  font-size: 12px;
  color: #666;
}
</style>

