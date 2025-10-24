<template>
  <div class="social-features-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <a-button type="text" @click="goBack" class="back-btn">
        <template #icon><LeftOutlined /></template>
      </a-button>
      <span class="title">票根广场</span>
      <a-button type="text" @click="showPublish = true" class="publish-btn">
        <template #icon><PlusOutlined /></template>
        发布
      </a-button>
    </div>

    <!-- 标签导航 -->
    <div class="tabs-container">
      <a-tabs v-model:activeKey="activeTab" centered>
        <a-tab-pane key="recommend" tab="推荐"></a-tab-pane>
        <a-tab-pane key="follow" tab="关注"></a-tab-pane>
        <a-tab-pane key="hot" tab="热门"></a-tab-pane>
        <a-tab-pane key="nearby" tab="同城"></a-tab-pane>
      </a-tabs>
    </div>

    <!-- 话题标签 -->
    <div class="topics-bar">
      <div class="topics-scroll">
        <a-tag
          v-for="topic in hotTopics"
          :key="topic.id"
          :color="selectedTopic === topic.id ? 'blue' : 'default'"
          @click="selectTopic(topic.id)"
          class="topic-tag"
        >
          # {{ topic.name }}
          <span class="topic-count">{{ topic.count }}</span>
        </a-tag>
      </div>
    </div>

    <!-- 动态列表 -->
    <div class="posts-container">
      <div 
        v-for="post in filteredPosts" 
        :key="post.id" 
        class="post-card"
      >
        <!-- 用户信息 -->
        <div class="post-header">
          <div class="user-info" @click="viewUserProfile(post.user)">
            <a-avatar :src="post.user.avatar" :size="40" />
            <div class="user-details">
              <div class="username">
                {{ post.user.name }}
                <a-tag v-if="post.user.isVip" color="gold" size="small">VIP</a-tag>
              </div>
              <div class="post-meta">
                <span>{{ post.location }}</span>
                <span class="dot">·</span>
                <span>{{ post.time }}</span>
              </div>
            </div>
          </div>
          <a-button 
            type="text" 
            size="small"
            :class="{ followed: post.user.isFollowed }"
            @click="toggleFollow(post.user)"
          >
            {{ post.user.isFollowed ? '已关注' : '+ 关注' }}
          </a-button>
        </div>

        <!-- 文字内容 -->
        <div class="post-content" @click="viewPostDetail(post)">
          <p>{{ post.content }}</p>
          <div class="post-tags">
            <a-tag 
              v-for="tag in post.tags" 
              :key="tag" 
              color="blue" 
              size="small"
            >
              #{{ tag }}
            </a-tag>
          </div>
        </div>

        <!-- 图片展示 -->
        <div 
          v-if="post.images && post.images.length > 0" 
          class="post-images"
          :class="`images-${post.images.length}`"
          @click="previewImages(post.images, 0)"
        >
          <div 
            v-for="(image, index) in post.images.slice(0, 9)" 
            :key="index" 
            class="image-item"
          >
            <img v-img-fallback :src="image" :alt="`图片${index + 1}`" />
          </div>
        </div>

        <!-- 票根信息 -->
        <div v-if="post.ticket" class="ticket-info" @click="viewTicketDetail(post.ticket)">
          <div class="ticket-icon">
            <FileTextOutlined />
          </div>
          <div class="ticket-details">
            <div class="ticket-title">{{ post.ticket.title }}</div>
            <div class="ticket-subtitle">{{ post.ticket.subtitle }}</div>
          </div>
          <RightOutlined />
        </div>

        <!-- 互动栏 -->
        <div class="post-actions">
          <div class="action-item" @click="toggleLike(post)">
            <HeartFilled v-if="post.isLiked" class="liked" />
            <HeartOutlined v-else />
            <span>{{ post.likes }}</span>
          </div>
          <div class="action-item" @click="showComments(post)">
            <CommentOutlined />
            <span>{{ post.comments }}</span>
          </div>
          <div class="action-item" @click="sharePost(post)">
            <ShareAltOutlined />
            <span>{{ post.shares }}</span>
          </div>
          <div class="action-item" @click="collectPost(post)">
            <StarFilled v-if="post.isCollected" class="collected" />
            <StarOutlined v-else />
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load-more">
        <a-button type="link" @click="loadMore">
          加载更多
        </a-button>
      </div>
    </div>

    <!-- 发布动态抽屉 -->
    <a-drawer
      v-model:open="showPublish"
      title="发布动态"
      placement="bottom"
      height="80%"
      :closable="true"
    >
      <div class="publish-form">
        <a-textarea
          v-model:value="publishContent"
          placeholder="分享你的票根故事..."
          :rows="6"
          :maxlength="500"
          show-count
        />

        <!-- 图片上传 -->
        <div class="upload-section">
          <div class="upload-title">添加图片</div>
          <div class="upload-grid">
            <div 
              v-for="(image, index) in publishImages" 
              :key="index" 
              class="upload-item"
            >
              <img v-img-fallback :src="image" />
              <div class="remove-btn" @click="removeImage(index)">
                <CloseCircleFilled />
              </div>
            </div>
            <div 
              v-if="publishImages.length < 9" 
              class="upload-btn"
              @click="uploadImage"
            >
              <PlusOutlined />
              <div>添加图片</div>
            </div>
          </div>
        </div>

        <!-- 选择票根 -->
        <div class="ticket-section">
          <div class="section-title">关联票根</div>
          <div v-if="selectedTicket" class="selected-ticket">
            <FileTextOutlined />
            <span>{{ selectedTicket.title }}</span>
            <CloseOutlined @click="selectedTicket = null" />
          </div>
          <a-button v-else type="dashed" block @click="selectTicket">
            选择票根
          </a-button>
        </div>

        <!-- 添加话题 -->
        <div class="topic-section">
          <div class="section-title">添加话题</div>
          <div class="selected-tags">
            <a-tag 
              v-for="tag in publishTags" 
              :key="tag" 
              closable 
              @close="removeTag(tag)"
            >
              #{{ tag }}
            </a-tag>
            <a-button 
              v-if="publishTags.length < 5" 
              type="dashed" 
              size="small"
              @click="showTopicSelector = true"
            >
              + 添加话题
            </a-button>
          </div>
        </div>

        <!-- 位置信息 -->
        <div class="location-section">
          <div class="section-title">所在位置</div>
          <a-input 
            v-model:value="publishLocation" 
            placeholder="添加位置"
            :prefix="h(EnvironmentOutlined)"
          />
        </div>

        <!-- 发布按钮 -->
        <div class="publish-actions">
          <a-button @click="showPublish = false">取消</a-button>
          <a-button 
            type="primary" 
            @click="submitPost"
            :disabled="!publishContent.trim()"
          >
            发布
          </a-button>
        </div>
      </div>
    </a-drawer>

    <!-- 评论抽屉 -->
    <a-drawer
      v-model:open="showCommentsDrawer"
      title="评论"
      placement="bottom"
      height="70%"
    >
      <div class="comments-container">
        <div 
          v-for="comment in currentComments" 
          :key="comment.id" 
          class="comment-item"
        >
          <a-avatar :src="comment.user.avatar" :size="36" />
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-user">{{ comment.user.name }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <div class="comment-text">{{ comment.text }}</div>
            <div class="comment-actions">
              <span @click="likeComment(comment)">
                <HeartOutlined :class="{ liked: comment.isLiked }" />
                {{ comment.likes }}
              </span>
              <span @click="replyComment(comment)">回复</span>
            </div>
            <!-- 回复列表 -->
            <div v-if="comment.replies && comment.replies.length > 0" class="replies">
              <div 
                v-for="reply in comment.replies" 
                :key="reply.id" 
                class="reply-item"
              >
                <span class="reply-user">{{ reply.user.name }}</span>
                回复
                <span class="reply-target">{{ reply.target }}</span>:
                {{ reply.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 评论输入框 -->
      <div class="comment-input">
        <a-input
          v-model:value="commentText"
          placeholder="说点什么..."
          @pressEnter="submitComment"
        >
          <template #suffix>
            <a-button type="link" @click="submitComment">发送</a-button>
          </template>
        </a-input>
      </div>
    </a-drawer>

    <!-- 话题选择器 -->
    <a-modal
      v-model:open="showTopicSelector"
      title="选择话题"
      :footer="null"
    >
      <div class="topic-list">
        <div 
          v-for="topic in hotTopics" 
          :key="topic.id" 
          class="topic-item"
          @click="addTag(topic.name)"
        >
          <span>#{{ topic.name }}</span>
          <span class="topic-count">{{ topic.count }}条动态</span>
        </div>
      </div>
    </a-modal>

    <!-- 图片预览 -->
    <a-modal
      v-model:open="showImagePreview"
      :footer="null"
      width="100%"
      :bodyStyle="{ padding: 0 }"
    >
      <div class="image-preview">
        <img v-img-fallback :src="previewImage" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  PlusOutlined,
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  ShareAltOutlined,
  StarOutlined,
  StarFilled,
  FileTextOutlined,
  RightOutlined,
  CloseCircleFilled,
  CloseOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 状态管理
const activeTab = ref('recommend')
const selectedTopic = ref<number | null>(null)
const showPublish = ref(false)
const showCommentsDrawer = ref(false)
const showTopicSelector = ref(false)
const showImagePreview = ref(false)
const previewImage = ref('')

// 发布相关
const publishContent = ref('')
const publishImages = ref<string[]>([])
const publishTags = ref<string[]>([])
const publishLocation = ref('南京市')
const selectedTicket = ref<any>(null)
const commentText = ref('')
const currentPost = ref<any>(null)

// 热门话题
const hotTopics = ref([
  { id: 1, name: '电影票根', count: 1234 },
  { id: 2, name: '演唱会', count: 987 },
  { id: 3, name: '博物馆打卡', count: 756 },
  { id: 4, name: '旅行记忆', count: 654 },
  { id: 5, name: '美食探店', count: 543 },
  { id: 6, name: '展览', count: 432 },
  { id: 7, name: '音乐节', count: 321 }
])

// 动态数据
const posts = ref([
  {
    id: 1,
    user: {
      id: 1,
      name: '电影爱好者小王',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      isVip: true,
      isFollowed: false
    },
    content: '今天看了《流浪地球3》,特效太震撼了!强烈推荐大家去IMAX厅观看,视觉体验绝对值回票价!',
    images: [
      'https://picsum.photos/400/300?random=11',
      'https://picsum.photos/400/300?random=12',
      'https://picsum.photos/400/300?random=13'
    ],
    tags: ['电影票根', '科幻', 'IMAX'],
    ticket: {
      id: 1,
      title: '流浪地球3',
      subtitle: '南京德基影城 IMAX厅'
    },
    location: '南京',
    time: '2小时前',
    likes: 128,
    comments: 45,
    shares: 23,
    isLiked: false,
    isCollected: false,
    tab: 'recommend'
  },
  {
    id: 2,
    user: {
      id: 2,
      name: '音乐节狂热粉',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      isVip: false,
      isFollowed: true
    },
    content: '草莓音乐节太嗨了!现场氛围爆炸,遇到了好多志同道合的朋友。这张票根我要好好珍藏!',
    images: [
      'https://picsum.photos/400/300?random=21',
      'https://picsum.photos/400/300?random=22'
    ],
    tags: ['音乐节', '演唱会', '青春'],
    ticket: {
      id: 2,
      title: '2025草莓音乐节',
      subtitle: '南京奥体中心'
    },
    location: '南京',
    time: '5小时前',
    likes: 256,
    comments: 78,
    shares: 34,
    isLiked: true,
    isCollected: true,
    tab: 'follow'
  },
  {
    id: 3,
    user: {
      id: 3,
      name: '文艺青年',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      isVip: true,
      isFollowed: false
    },
    content: '南京博物院的新展览太棒了!从古代文物到现代艺术,每一件展品都值得细细品味。',
    images: [
      'https://picsum.photos/400/300?random=31'
    ],
    tags: ['博物馆打卡', '展览', '文化'],
    ticket: {
      id: 3,
      title: '南京博物院',
      subtitle: '特展:金陵古韵'
    },
    location: '南京',
    time: '1天前',
    likes: 189,
    comments: 56,
    shares: 12,
    isLiked: false,
    isCollected: false,
    tab: 'hot'
  },
  {
    id: 4,
    user: {
      id: 4,
      name: '旅行达人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      isVip: false,
      isFollowed: false
    },
    content: '中山陵的秋色太美了!银杏叶金黄一片,随手一拍都是大片。推荐大家这个季节来打卡!',
    images: [
      'https://picsum.photos/400/300?random=41',
      'https://picsum.photos/400/300?random=42',
      'https://picsum.photos/400/300?random=43',
      'https://picsum.photos/400/300?random=44'
    ],
    tags: ['旅行记忆', '秋天', '打卡'],
    ticket: null,
    location: '南京',
    time: '2天前',
    likes: 342,
    comments: 91,
    shares: 45,
    isLiked: true,
    isCollected: false,
    tab: 'nearby'
  },
  {
    id: 5,
    user: {
      id: 5,
      name: '美食探索家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      isVip: true,
      isFollowed: true
    },
    content: '发现了一家宝藏餐厅!环境优雅,菜品精致,服务也很贴心。用票根优惠还打了8折,太划算了!',
    images: [
      'https://picsum.photos/400/300?random=51',
      'https://picsum.photos/400/300?random=52',
      'https://picsum.photos/400/300?random=53',
      'https://picsum.photos/400/300?random=54',
      'https://picsum.photos/400/300?random=55',
      'https://picsum.photos/400/300?random=56'
    ],
    tags: ['美食探店', '优惠', '推荐'],
    ticket: {
      id: 5,
      title: '江南食府',
      subtitle: '8折优惠券'
    },
    location: '南京',
    time: '3天前',
    likes: 567,
    comments: 123,
    shares: 67,
    isLiked: false,
    isCollected: true,
    tab: 'recommend'
  }
])

// 评论数据
const currentComments = ref([
  {
    id: 1,
    user: {
      name: '评论者A',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1'
    },
    text: '太赞了!我也想去看!',
    time: '1小时前',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 11,
        user: { name: '楼主' },
        target: '评论者A',
        text: '强烈推荐!周末一起去吧'
      }
    ]
  },
  {
    id: 2,
    user: {
      name: '评论者B',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2'
    },
    text: '请问在哪个影院看的?',
    time: '2小时前',
    likes: 5,
    isLiked: true,
    replies: []
  }
])

// 计算属性
const filteredPosts = computed(() => {
  let filtered = posts.value

  // 根据标签页筛选
  if (activeTab.value !== 'recommend') {
    filtered = filtered.filter(post => post.tab === activeTab.value)
  }

  // 根据话题筛选
  if (selectedTopic.value) {
    const topicName = hotTopics.value.find(t => t.id === selectedTopic.value)?.name
    if (topicName) {
      filtered = filtered.filter(post => post.tags.includes(topicName))
    }
  }

  return filtered
})

// 方法
const goBack = () => {
  router.back()
}

const selectTopic = (topicId: number) => {
  selectedTopic.value = selectedTopic.value === topicId ? null : topicId
}

const toggleFollow = (user: any) => {
  user.isFollowed = !user.isFollowed
  message.success(user.isFollowed ? '关注成功' : '取消关注')
}

const toggleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const collectPost = (post: any) => {
  post.isCollected = !post.isCollected
  message.success(post.isCollected ? '收藏成功' : '取消收藏')
}

const showComments = (post: any) => {
  currentPost.value = post
  showCommentsDrawer.value = true
}

const sharePost = (post: any) => {
  message.success('分享功能开发中')
}

const viewUserProfile = (user: any) => {
  message.info('查看用户主页: ' + user.name)
}

const viewPostDetail = (post: any) => {
  message.info('查看动态详情')
}

const viewTicketDetail = (ticket: any) => {
  message.info('查看票根详情: ' + ticket.title)
}

const previewImages = (images: string[], index: number) => {
  previewImage.value = images[index]
  showImagePreview.value = true
}

const uploadImage = () => {
  // 模拟上传图片
  const randomImage = `https://picsum.photos/400/300?random=${Date.now()}`
  publishImages.value.push(randomImage)
}

const removeImage = (index: number) => {
  publishImages.value.splice(index, 1)
}

const selectTicket = () => {
  // 模拟选择票根
  selectedTicket.value = {
    id: 99,
    title: '我的电影票根'
  }
}

const addTag = (tagName: string) => {
  if (!publishTags.value.includes(tagName) && publishTags.value.length < 5) {
    publishTags.value.push(tagName)
  }
  showTopicSelector.value = false
}

const removeTag = (tag: string) => {
  const index = publishTags.value.indexOf(tag)
  if (index > -1) {
    publishTags.value.splice(index, 1)
  }
}

const submitPost = () => {
  if (!publishContent.value.trim()) {
    message.warning('请输入内容')
    return
  }

  // 创建新动态
  const newPost = {
    id: Date.now(),
    user: {
      id: 999,
      name: '我',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      isVip: true,
      isFollowed: false
    },
    content: publishContent.value,
    images: [...publishImages.value],
    tags: [...publishTags.value],
    ticket: selectedTicket.value,
    location: publishLocation.value,
    time: '刚刚',
    likes: 0,
    comments: 0,
    shares: 0,
    isLiked: false,
    isCollected: false,
    tab: 'recommend'
  }

  posts.value.unshift(newPost)

  // 重置表单
  publishContent.value = ''
  publishImages.value = []
  publishTags.value = []
  selectedTicket.value = null
  showPublish.value = false

  message.success('发布成功!')
}

const submitComment = () => {
  if (!commentText.value.trim()) {
    return
  }

  const newComment = {
    id: Date.now(),
    user: {
      name: '我',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me'
    },
    text: commentText.value,
    time: '刚刚',
    likes: 0,
    isLiked: false,
    replies: []
  }

  currentComments.value.unshift(newComment)
  if (currentPost.value) {
    currentPost.value.comments++
  }

  commentText.value = ''
  message.success('评论成功')
}

const likeComment = (comment: any) => {
  comment.isLiked = !comment.isLiked
  comment.likes += comment.isLiked ? 1 : -1
}

const replyComment = (comment: any) => {
  message.info('回复功能开发中')
}

const loadMore = () => {
  message.info('加载更多数据...')
}
</script>

<style scoped>
.social-features-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn,
.publish-btn {
  color: white !important;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.tabs-container {
  background: white;
  position: sticky;
  top: 48px;
  z-index: 99;
}

.topics-bar {
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 96px;
  z-index: 98;
}

.topics-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.topics-scroll::-webkit-scrollbar {
  display: none;
}

.topic-tag {
  cursor: pointer;
  flex-shrink: 0;
}

.topic-count {
  margin-left: 4px;
  font-size: 11px;
  opacity: 0.7;
}

.posts-container {
  padding: 12px 0;
}

.post-card {
  background: white;
  padding: 16px;
  margin-bottom: 12px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
}

.post-meta {
  font-size: 12px;
  color: #999;
}

.dot {
  margin: 0 4px;
}

.followed {
  color: #999 !important;
}

.post-content {
  margin-bottom: 12px;
  cursor: pointer;
}

.post-content p {
  margin: 0 0 8px 0;
  line-height: 1.6;
  color: #333;
}

.post-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.post-images {
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
  cursor: pointer;
}

.images-1 {
  grid-template-columns: 1fr;
}

.images-2,
.images-4 {
  grid-template-columns: repeat(2, 1fr);
}

.images-3,
.images-5,
.images-6,
.images-7,
.images-8,
.images-9 {
  grid-template-columns: repeat(3, 1fr);
}

.image-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ticket-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
}

.ticket-icon {
  font-size: 24px;
  color: #1890ff;
}

.ticket-details {
  flex: 1;
}

.ticket-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.ticket-subtitle {
  font-size: 12px;
  color: #666;
}

.post-actions {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.3s;
}

.action-item:active {
  transform: scale(0.95);
}

.liked,
.collected {
  color: #f5222d;
}

.load-more {
  text-align: center;
  padding: 20px;
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-section,
.ticket-section,
.topic-section,
.location-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-title,
.section-title {
  font-weight: bold;
  font-size: 14px;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.upload-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.upload-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
}

.upload-btn {
  aspect-ratio: 1;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  font-size: 12px;
}

.selected-ticket {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.selected-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.publish-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.comments-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 60px;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.comment-user {
  font-weight: bold;
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  margin-bottom: 8px;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
}

.comment-actions span {
  cursor: pointer;
}

.replies {
  margin-top: 12px;
  padding-left: 12px;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

.reply-user,
.reply-target {
  color: #1890ff;
  font-weight: 500;
}

.comment-input {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topic-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.topic-item:hover {
  background: #f5f5f5;
}

.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #000;
}

.image-preview img {
  max-width: 100%;
  max-height: 80vh;
}
</style>

