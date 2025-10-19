<template>
  <a-modal
    v-model:open="visible"
    title="在线客服"
    :footer="null"
    :width="400"
    :bodyStyle="{ padding: 0, height: '500px', display: 'flex', flexDirection: 'column' }"
    centered
  >
    <div class="service-chat">
      <!-- 客服信息 -->
      <div class="service-info">
        <a-avatar :size="40" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%231890ff'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-weight='bold'%3E客服%3C/text%3E%3C/svg%3E" />
        <div class="service-details">
          <div class="service-name">在线客服</div>
          <div class="service-status">
            <span class="status-dot"></span>
            在线
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-list" ref="messageListRef">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message-item', msg.type]"
        >
          <a-avatar
            v-if="msg.type === 'service'"
            :size="32"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%231890ff'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='14' font-weight='bold'%3E客服%3C/text%3E%3C/svg%3E"
          />
          <div class="message-content">
            <div class="message-bubble">{{ msg.content }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
          <a-avatar
            v-if="msg.type === 'user'"
            :size="32"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%2352c41a'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='14' font-weight='bold'%3E我%3C/text%3E%3C/svg%3E"
          />
        </div>
      </div>

      <!-- 快捷回复 -->
      <div class="quick-replies" v-if="showQuickReplies">
        <div
          v-for="reply in quickReplies"
          :key="reply"
          class="quick-reply-item"
          @click="sendQuickReply(reply)"
        >
          {{ reply }}
        </div>
      </div>

      <!-- 输入框 -->
      <div class="input-area">
        <a-input
          v-model:value="inputMessage"
          placeholder="请输入消息..."
          @pressEnter="sendMessage"
          :maxlength="200"
        >
          <template #suffix>
            <a-button type="primary" size="small" @click="sendMessage">
              发送
            </a-button>
          </template>
        </a-input>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'

interface Message {
  id: number
  type: 'user' | 'service'
  content: string
  time: string
}

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:open'])

const visible = ref(false)
const inputMessage = ref('')
const messageListRef = ref<HTMLElement>()
const showQuickReplies = ref(true)

const messages = ref<Message[]>([
  {
    id: 1,
    type: 'service',
    content: '您好！我是在线客服,有什么可以帮助您的吗?',
    time: getCurrentTime()
  }
])

const quickReplies = [
  '营业时间是什么时候?',
  '如何使用优惠券?',
  '可以预约吗?',
  '有停车位吗?'
]

watch(() => props.open, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:open', val)
  if (val) {
    nextTick(() => {
      scrollToBottom()
    })
  }
})

function getCurrentTime() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

function scrollToBottom() {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

function sendMessage() {
  if (!inputMessage.value.trim()) {
    return
  }

  // 添加用户消息
  messages.value.push({
    id: messages.value.length + 1,
    type: 'user',
    content: inputMessage.value,
    time: getCurrentTime()
  })

  const userMsg = inputMessage.value
  inputMessage.value = ''
  showQuickReplies.value = false

  nextTick(() => {
    scrollToBottom()
  })

  // 模拟客服回复
  setTimeout(() => {
    let reply = ''
    if (userMsg.includes('营业时间')) {
      reply = '我们的营业时间是每天10:00-22:00,欢迎您的光临!'
    } else if (userMsg.includes('优惠券')) {
      reply = '您可以在结账时出示优惠券二维码,我们的收银员会帮您核销使用。'
    } else if (userMsg.includes('预约')) {
      reply = '我们支持电话预约和线上预约,您可以拨打025-12345678进行预约。'
    } else if (userMsg.includes('停车')) {
      reply = '我们有专属停车场,凭消费小票可免费停车2小时。'
    } else {
      reply = '感谢您的咨询,我会尽快为您解答。如需更多帮助,请拨打客服电话025-12345678。'
    }

    messages.value.push({
      id: messages.value.length + 1,
      type: 'service',
      content: reply,
      time: getCurrentTime()
    })

    nextTick(() => {
      scrollToBottom()
    })
  }, 1000)
}

function sendQuickReply(reply: string) {
  inputMessage.value = reply
  sendMessage()
}
</script>

<style scoped lang="scss">
.service-chat {
  display: flex;
  flex-direction: column;
  height: 100%;

  .service-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;

    .service-details {
      flex: 1;

      .service-name {
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .service-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #52c41a;

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #52c41a;
        }
      }
    }
  }

  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f5f5f5;

    .message-item {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;

      &.service {
        justify-content: flex-start;

        .message-bubble {
          background: white;
          color: #333;
        }

        .message-time {
          text-align: left;
        }
      }

      &.user {
        justify-content: flex-end;

        .message-bubble {
          background: #1890ff;
          color: white;
        }

        .message-time {
          text-align: right;
        }
      }

      .message-content {
        max-width: 70%;

        .message-bubble {
          padding: 10px 14px;
          border-radius: 8px;
          word-wrap: break-word;
          font-size: 14px;
          line-height: 1.5;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message-time {
          margin-top: 4px;
          font-size: 11px;
          color: #999;
        }
      }
    }
  }

  .quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    background: white;

    .quick-reply-item {
      padding: 6px 12px;
      background: #f0f0f0;
      border-radius: 16px;
      font-size: 13px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #e6f7ff;
        color: #1890ff;
      }
    }
  }

  .input-area {
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    background: white;
  }
}
</style>

