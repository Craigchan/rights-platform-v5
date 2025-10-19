<template>
  <a-modal
    v-model:open="visible"
    title="分享到"
    :footer="null"
    :width="400"
    centered
  >
    <div class="share-modal">
      <div class="share-platforms">
        <div class="platform-item" @click="shareToWeChat">
          <div class="platform-icon wechat">
            <WechatOutlined />
          </div>
          <span class="platform-name">微信好友</span>
        </div>
        <div class="platform-item" @click="shareToMoments">
          <div class="platform-icon moments">
            <WechatOutlined />
          </div>
          <span class="platform-name">朋友圈</span>
        </div>
        <div class="platform-item" @click="shareToWeibo">
          <div class="platform-icon weibo">
            <WeiboOutlined />
          </div>
          <span class="platform-name">微博</span>
        </div>
        <div class="platform-item" @click="shareToQQ">
          <div class="platform-icon qq">
            <QqOutlined />
          </div>
          <span class="platform-name">QQ</span>
        </div>
        <div class="platform-item" @click="shareToQzone">
          <div class="platform-icon qzone">
            <QqOutlined />
          </div>
          <span class="platform-name">QQ空间</span>
        </div>
        <div class="platform-item" @click="copyLink">
          <div class="platform-icon link">
            <LinkOutlined />
          </div>
          <span class="platform-name">复制链接</span>
        </div>
      </div>

      <div class="share-preview" v-if="shareData">
        <div class="preview-card">
          <img :src="shareData.image" :alt="shareData.title" class="preview-image" />
          <div class="preview-content">
            <h3 class="preview-title">{{ shareData.title }}</h3>
            <p class="preview-desc">{{ shareData.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  LinkOutlined
} from '@ant-design/icons-vue'

interface ShareData {
  title: string
  desc: string
  image: string
  url?: string
}

interface Props {
  open: boolean
  shareData?: ShareData
}

const props = defineProps<Props>()
const emit = defineEmits(['update:open'])

const visible = ref(false)

watch(() => props.open, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:open', val)
})

const shareToWeChat = () => {
  // 模拟分享到微信
  message.success('已调起微信分享')
  visible.value = false
}

const shareToMoments = () => {
  // 模拟分享到朋友圈
  message.success('已调起朋友圈分享')
  visible.value = false
}

const shareToWeibo = () => {
  // 模拟分享到微博
  if (props.shareData) {
    const url = props.shareData.url || window.location.href
    const text = `${props.shareData.title} - ${props.shareData.desc}`
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}&pic=${encodeURIComponent(props.shareData.image)}`
    window.open(weiboUrl, '_blank')
  }
  visible.value = false
}

const shareToQQ = () => {
  // 模拟分享到QQ
  if (props.shareData) {
    const url = props.shareData.url || window.location.href
    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(props.shareData.title)}&desc=${encodeURIComponent(props.shareData.desc)}&pics=${encodeURIComponent(props.shareData.image)}`
    window.open(qqUrl, '_blank')
  }
  visible.value = false
}

const shareToQzone = () => {
  // 模拟分享到QQ空间
  if (props.shareData) {
    const url = props.shareData.url || window.location.href
    const qzoneUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(props.shareData.title)}&desc=${encodeURIComponent(props.shareData.desc)}&pics=${encodeURIComponent(props.shareData.image)}`
    window.open(qzoneUrl, '_blank')
  }
  visible.value = false
}

const copyLink = async () => {
  const url = props.shareData?.url || window.location.href
  try {
    await navigator.clipboard.writeText(url)
    message.success('链接已复制到剪贴板')
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    message.success('链接已复制到剪贴板')
  }
  visible.value = false
}
</script>

<style scoped lang="scss">
.share-modal {
  .share-platforms {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;

    .platform-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-4px);
      }

      &:active {
        transform: translateY(0);
      }

      .platform-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        &.wechat {
          background: linear-gradient(135deg, #09BB07 0%, #00D100 100%);
        }

        &.moments {
          background: linear-gradient(135deg, #00A0E9 0%, #00D4FF 100%);
        }

        &.weibo {
          background: linear-gradient(135deg, #E6162D 0%, #FF4757 100%);
        }

        &.qq {
          background: linear-gradient(135deg, #12B7F5 0%, #00D4FF 100%);
        }

        &.qzone {
          background: linear-gradient(135deg, #FDBE00 0%, #FFD700 100%);
        }

        &.link {
          background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
        }
      }

      .platform-name {
        font-size: 13px;
        color: #666;
      }
    }
  }

  .share-preview {
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;

    .preview-card {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #f7f7f7;
      border-radius: 8px;

      .preview-image {
        width: 80px;
        height: 80px;
        border-radius: 6px;
        object-fit: cover;
      }

      .preview-content {
        flex: 1;
        overflow: hidden;

        .preview-title {
          font-size: 14px;
          font-weight: 500;
          margin: 0 0 6px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .preview-desc {
          font-size: 12px;
          color: #999;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>

