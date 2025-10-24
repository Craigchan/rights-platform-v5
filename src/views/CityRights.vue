<template>
  <div class="city-rights-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <a-button type="text" @click="goBack" class="back-btn">
        <template #icon><LeftOutlined /></template>
      </a-button>
      <span class="title">跨城权益</span>
      <a-button type="text" @click="showCitySelector = true" class="city-btn">
        <template #icon><EnvironmentOutlined /></template>
        {{ currentCity }}
      </a-button>
    </div>

    <!-- 城市切换 -->
    <div class="city-switch">
      <div class="current-city-info">
        <div class="city-name">
          <EnvironmentFilled />
          当前: {{ currentCity }}
        </div>
        <div class="city-stats">
          <span>{{ currentCityRights.length }}项权益</span>
          <span class="dot">·</span>
          <span>可节省¥{{ totalSavings }}</span>
        </div>
      </div>
      <a-button type="primary" ghost @click="showCitySelector = true">
        切换城市
      </a-button>
    </div>

    <!-- 推荐类型标签 -->
    <div class="recommend-tabs">
      <a-radio-group v-model:value="recommendType" button-style="solid" size="large">
        <a-radio-button value="intelligent">智能推荐</a-radio-button>
        <a-radio-button value="hot">热门城市</a-radio-button>
        <a-radio-button value="nearby">周边城市</a-radio-button>
      </a-radio-group>
    </div>

    <!-- 推荐理由 -->
    <div v-if="recommendType === 'intelligent'" class="recommend-reason">
      <BulbOutlined />
      <span>{{ recommendReason }}</span>
    </div>

    <!-- 城市列表 -->
    <div class="cities-section">
      <div class="section-header">
        <h3>{{ sectionTitle }}</h3>
        <span class="city-count">{{ recommendedCities.length }}个城市</span>
      </div>

      <div class="cities-grid">
        <div 
          v-for="city in recommendedCities" 
          :key="city.id" 
          class="city-card"
          @click="selectCity(city)"
        >
          <div class="city-image">
            <img v-img-fallback :src="city.image" :alt="city.name" />
            <div class="city-overlay">
              <h4>{{ city.name }}</h4>
              <p>{{ city.description }}</p>
            </div>
            <div v-if="city.isHot" class="hot-badge">
              <FireOutlined /> 热门
            </div>
          </div>
          <div class="city-info">
            <div class="city-meta">
              <span class="distance">
                <EnvironmentOutlined />
                {{ city.distance }}
              </span>
              <span class="rights-count">
                {{ city.rightsCount }}项权益
              </span>
            </div>
            <div class="city-tags">
              <a-tag 
                v-for="tag in city.tags.slice(0, 3)" 
                :key="tag" 
                size="small"
              >
                {{ tag }}
              </a-tag>
            </div>
            <div class="city-highlight">
              <GiftOutlined />
              最高可省 <span class="savings">¥{{ city.maxSavings }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 权益分类 -->
    <div class="rights-categories">
      <div class="section-header">
        <h3>权益分类</h3>
      </div>
      <div class="categories-grid">
        <div 
          v-for="category in rightsCategories" 
          :key="category.id"
          class="category-card"
          :class="{ active: selectedCategory === category.id }"
          @click="filterByCategory(category.id)"
        >
          <div class="category-icon" :style="{ background: category.color }">
            <component :is="category.icon" />
          </div>
          <div class="category-name">{{ category.name }}</div>
          <div class="category-count">{{ category.count }}</div>
        </div>
      </div>
    </div>

    <!-- 权益列表 -->
    <div class="rights-list">
      <div class="section-header">
        <h3>{{ selectedCityName }}权益列表</h3>
        <a-select v-model:value="sortBy" size="small" style="width: 120px">
          <a-select-option value="recommend">推荐排序</a-select-option>
          <a-select-option value="savings">优惠力度</a-select-option>
          <a-select-option value="distance">距离优先</a-select-option>
          <a-select-option value="hot">热度优先</a-select-option>
        </a-select>
      </div>

      <div class="rights-items">
        <div 
          v-for="right in filteredRights" 
          :key="right.id" 
          class="right-card"
          @click="viewRightDetail(right)"
        >
          <div class="right-image">
            <img v-img-fallback :src="right.image" :alt="right.title" />
            <div v-if="right.discount" class="discount-badge">
              {{ right.discount }}
            </div>
          </div>
          <div class="right-content">
            <h4>{{ right.title }}</h4>
            <p class="right-subtitle">{{ right.subtitle }}</p>
            <div class="right-meta">
              <span class="category-tag">{{ right.category }}</span>
              <span class="validity">
                <ClockCircleOutlined />
                {{ right.validity }}
              </span>
            </div>
            <div class="right-footer">
              <div class="price-info">
                <span class="current-price">¥{{ right.price }}</span>
                <span v-if="right.originalPrice" class="original-price">¥{{ right.originalPrice }}</span>
              </div>
              <a-button 
                type="primary" 
                size="small"
                @click.stop="claimRight(right)"
              >
                {{ right.isClaimed ? '已领取' : '立即领取' }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用指南 -->
    <div class="usage-guide">
      <div class="section-header">
        <h3>跨城权益使用指南</h3>
      </div>
      <a-collapse v-model:activeKey="guideActiveKey" ghost>
        <a-collapse-panel key="1" header="如何领取跨城权益?">
          <p>1. 选择目标城市,浏览该城市的权益列表</p>
          <p>2. 点击"立即领取"按钮,权益将自动添加到您的账户</p>
          <p>3. 在"我的票券"中查看已领取的权益</p>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="如何使用跨城权益?">
          <p>1. 到达目标城市后,打开"我的票券"</p>
          <p>2. 选择要使用的权益,查看使用说明</p>
          <p>3. 在商家处出示核销码即可使用</p>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="权益有效期说明">
          <p>1. 每项权益都有明确的有效期,请在有效期内使用</p>
          <p>2. 部分权益需要提前预约,请注意查看使用条件</p>
          <p>3. 过期权益将自动失效,无法退款</p>
        </a-collapse-panel>
        <a-collapse-panel key="4" header="注意事项">
          <p>1. 部分权益仅限本人使用,不可转让</p>
          <p>2. 使用前请仔细阅读权益详情和使用规则</p>
          <p>3. 如有疑问,请联系客服咨询</p>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <!-- 城市选择器弹窗 -->
    <a-modal
      v-model:open="showCitySelector"
      title="选择城市"
      :footer="null"
      width="90%"
    >
      <div class="city-selector">
        <a-input-search
          v-model:value="citySearchText"
          placeholder="搜索城市"
          @search="searchCity"
        />
        
        <div class="city-groups">
          <div class="city-group">
            <div class="group-title">热门城市</div>
            <div class="city-tags">
              <a-tag 
                v-for="city in hotCities" 
                :key="city.id"
                :color="currentCity === city.name ? 'blue' : 'default'"
                @click="changeCity(city)"
              >
                {{ city.name }}
              </a-tag>
            </div>
          </div>
          
          <div class="city-group">
            <div class="group-title">周边城市</div>
            <div class="city-tags">
              <a-tag 
                v-for="city in nearbyCities" 
                :key="city.id"
                :color="currentCity === city.name ? 'blue' : 'default'"
                @click="changeCity(city)"
              >
                {{ city.name }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 权益详情弹窗 -->
    <a-modal
      v-model:open="showRightDetail"
      :title="selectedRight?.title"
      :footer="null"
      width="90%"
    >
      <div v-if="selectedRight" class="right-detail">
        <img v-img-fallback :src="selectedRight.image" class="detail-image" />
        
        <div class="detail-section">
          <h4>权益详情</h4>
          <p>{{ selectedRight.description }}</p>
        </div>

        <div class="detail-section">
          <h4>使用说明</h4>
          <div class="usage-steps">
            <div v-for="(step, index) in selectedRight.usageSteps" :key="index" class="step">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-text">{{ step }}</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>适用范围</h4>
          <p>{{ selectedRight.scope }}</p>
        </div>

        <div class="detail-section">
          <h4>有效期</h4>
          <p>{{ selectedRight.validity }}</p>
        </div>

        <div class="detail-actions">
          <a-button 
            type="primary" 
            block 
            size="large"
            @click="claimRight(selectedRight)"
          >
            {{ selectedRight.isClaimed ? '已领取' : '立即领取' }}
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  EnvironmentOutlined,
  EnvironmentFilled,
  BulbOutlined,
  FireOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  CoffeeOutlined,
  CarOutlined,
  HomeOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 状态管理
const currentCity = ref('南京')
const recommendType = ref('intelligent')
const selectedCategory = ref<number | null>(null)
const sortBy = ref('recommend')
const showCitySelector = ref(false)
const showRightDetail = ref(false)
const selectedRight = ref<any>(null)
const citySearchText = ref('')
const guideActiveKey = ref(['1'])

// 城市数据
const hotCities = ref([
  { id: 1, name: '上海', distance: '300km', rightsCount: 156 },
  { id: 2, name: '杭州', distance: '270km', rightsCount: 98 },
  { id: 3, name: '苏州', distance: '200km', rightsCount: 87 },
  { id: 4, name: '无锡', distance: '180km', rightsCount: 76 },
  { id: 5, name: '南京', distance: '0km', rightsCount: 145 }
])

const nearbyCities = ref([
  { id: 6, name: '镇江', distance: '80km', rightsCount: 45 },
  { id: 7, name: '扬州', distance: '100km', rightsCount: 52 },
  { id: 8, name: '常州', distance: '120km', rightsCount: 63 },
  { id: 9, name: '泰州', distance: '150km', rightsCount: 38 }
])

// 推荐城市
const cities = ref([
  {
    id: 1,
    name: '上海',
    description: '魔都风情,购物天堂',
    image: 'https://picsum.photos/600/400?random=101',
    distance: '300km',
    rightsCount: 156,
    maxSavings: 2000,
    tags: ['购物', '美食', '景点', '文化'],
    isHot: true,
    type: 'hot'
  },
  {
    id: 2,
    name: '杭州',
    description: '人间天堂,西湖美景',
    image: 'https://picsum.photos/600/400?random=102',
    distance: '270km',
    rightsCount: 98,
    maxSavings: 1500,
    tags: ['景点', '美食', '休闲', '文化'],
    isHot: true,
    type: 'hot'
  },
  {
    id: 3,
    name: '苏州',
    description: '园林之城,江南水乡',
    image: 'https://picsum.photos/600/400?random=103',
    distance: '200km',
    rightsCount: 87,
    maxSavings: 1200,
    tags: ['景点', '园林', '文化', '美食'],
    isHot: false,
    type: 'nearby'
  },
  {
    id: 4,
    name: '无锡',
    description: '太湖明珠,鱼米之乡',
    image: 'https://picsum.photos/600/400?random=104',
    distance: '180km',
    rightsCount: 76,
    maxSavings: 1000,
    tags: ['景点', '美食', '休闲'],
    isHot: false,
    type: 'nearby'
  },
  {
    id: 5,
    name: '镇江',
    description: '三山一渡,醋香四溢',
    image: 'https://picsum.photos/600/400?random=105',
    distance: '80km',
    rightsCount: 45,
    maxSavings: 600,
    tags: ['景点', '美食', '文化'],
    isHot: false,
    type: 'nearby'
  },
  {
    id: 6,
    name: '扬州',
    description: '烟花三月,瘦西湖畔',
    image: 'https://picsum.photos/600/400?random=106',
    distance: '100km',
    rightsCount: 52,
    maxSavings: 800,
    tags: ['景点', '美食', '文化', '休闲'],
    isHot: false,
    type: 'nearby'
  }
])

// 权益分类
const rightsCategories = ref([
  { id: 1, name: '景点门票', icon: EnvironmentOutlined, count: 45, color: '#1890ff' },
  { id: 2, name: '美食餐饮', icon: CoffeeOutlined, count: 67, color: '#52c41a' },
  { id: 3, name: '购物优惠', icon: ShoppingOutlined, count: 89, color: '#fa8c16' },
  { id: 4, name: '交通出行', icon: CarOutlined, count: 34, color: '#722ed1' },
  { id: 5, name: '酒店住宿', icon: HomeOutlined, count: 28, color: '#eb2f96' }
])

// 权益数据
const rights = ref([
  {
    id: 1,
    cityId: 1,
    cityName: '上海',
    title: '上海迪士尼乐园门票',
    subtitle: '标准票 - 成人',
    category: '景点门票',
    categoryId: 1,
    image: 'https://picsum.photos/400/300?random=201',
    price: 399,
    originalPrice: 599,
    discount: '6.7折',
    validity: '2025年12月31日前有效',
    description: '上海迪士尼乐园是中国内地首座迪士尼主题乐园,拥有七大主题园区,适合全家游玩。',
    usageSteps: [
      '在线预约入园日期',
      '到达乐园后扫码入园',
      '尽情享受迪士尼的魔法世界'
    ],
    scope: '上海迪士尼乐园全园通用',
    isClaimed: false,
    hot: 98
  },
  {
    id: 2,
    cityId: 1,
    cityName: '上海',
    title: '外滩观光隧道',
    subtitle: '单程票',
    category: '景点门票',
    categoryId: 1,
    image: 'https://picsum.photos/400/300?random=202',
    price: 35,
    originalPrice: 50,
    discount: '7折',
    validity: '长期有效',
    description: '外滩观光隧道是中国第一条越江行人隧道,全长646.7米,连接浦西外滩和浦东陆家嘴。',
    usageSteps: [
      '到达外滩观光隧道入口',
      '出示核销码兑换门票',
      '乘坐观光车穿越隧道'
    ],
    scope: '外滩观光隧道单程',
    isClaimed: false,
    hot: 85
  },
  {
    id: 3,
    cityId: 1,
    cityName: '上海',
    title: '南翔小笼包',
    subtitle: '100元代金券',
    category: '美食餐饮',
    categoryId: 2,
    image: 'https://picsum.photos/400/300?random=203',
    price: 80,
    originalPrice: 100,
    discount: '8折',
    validity: '2025年6月30日前有效',
    description: '南翔小笼包是上海著名的传统小吃,皮薄馅大,汤汁鲜美。',
    usageSteps: [
      '到店后告知使用代金券',
      '出示核销码',
      '享用美食后抵扣相应金额'
    ],
    scope: '上海南翔小笼包所有门店通用',
    isClaimed: false,
    hot: 92
  },
  {
    id: 4,
    cityId: 2,
    cityName: '杭州',
    title: '西湖游船',
    subtitle: '双人票',
    category: '景点门票',
    categoryId: 1,
    image: 'https://picsum.photos/400/300?random=204',
    price: 120,
    originalPrice: 160,
    discount: '7.5折',
    validity: '2025年12月31日前有效',
    description: '乘坐游船游览西湖,欣赏湖光山色,体验"人在画中游"的意境。',
    usageSteps: [
      '提前预约游船时间',
      '到达码头后出示核销码',
      '登船游览西湖美景'
    ],
    scope: '西湖游船指定码头',
    isClaimed: false,
    hot: 88
  },
  {
    id: 5,
    cityId: 2,
    cityName: '杭州',
    title: '楼外楼',
    subtitle: '200元代金券',
    category: '美食餐饮',
    categoryId: 2,
    image: 'https://picsum.photos/400/300?random=205',
    price: 160,
    originalPrice: 200,
    discount: '8折',
    validity: '2025年12月31日前有效',
    description: '楼外楼是杭州著名的百年老店,以西湖醋鱼、龙井虾仁等杭帮菜闻名。',
    usageSteps: [
      '提前预约座位',
      '到店后出示核销码',
      '享用美食后抵扣相应金额'
    ],
    scope: '楼外楼所有门店通用',
    isClaimed: true,
    hot: 95
  },
  {
    id: 6,
    cityId: 3,
    cityName: '苏州',
    title: '拙政园门票',
    subtitle: '成人票',
    category: '景点门票',
    categoryId: 1,
    image: 'https://picsum.photos/400/300?random=206',
    price: 60,
    originalPrice: 90,
    discount: '6.7折',
    validity: '2025年12月31日前有效',
    description: '拙政园是苏州四大名园之一,也是中国四大名园之一,被誉为"中国园林之母"。',
    usageSteps: [
      '在线预约参观日期',
      '到达景区后扫码入园',
      '欣赏江南园林之美'
    ],
    scope: '拙政园景区',
    isClaimed: false,
    hot: 90
  }
])

// 计算属性
const recommendedCities = computed(() => {
  if (recommendType.value === 'intelligent') {
    // 智能推荐:基于用户历史和偏好
    return cities.value.slice(0, 4)
  } else if (recommendType.value === 'hot') {
    return cities.value.filter(c => c.type === 'hot')
  } else {
    return cities.value.filter(c => c.type === 'nearby')
  }
})

const sectionTitle = computed(() => {
  if (recommendType.value === 'intelligent') return '为你推荐'
  if (recommendType.value === 'hot') return '热门城市'
  return '周边城市'
})

const recommendReason = computed(() => {
  return '根据您的浏览历史和偏好,为您推荐以下城市的优惠权益'
})

const selectedCityName = computed(() => {
  return currentCity.value
})

const currentCityRights = computed(() => {
  return rights.value.filter(r => r.cityName === currentCity.value)
})

const totalSavings = computed(() => {
  return currentCityRights.value.reduce((sum, r) => {
    return sum + (r.originalPrice - r.price)
  }, 0)
})

const filteredRights = computed(() => {
  let filtered = currentCityRights.value

  // 按分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(r => r.categoryId === selectedCategory.value)
  }

  // 排序
  if (sortBy.value === 'savings') {
    filtered = [...filtered].sort((a, b) => {
      const savingsA = a.originalPrice - a.price
      const savingsB = b.originalPrice - b.price
      return savingsB - savingsA
    })
  } else if (sortBy.value === 'hot') {
    filtered = [...filtered].sort((a, b) => b.hot - a.hot)
  }

  return filtered
})

// 方法
const goBack = () => {
  router.back()
}

const selectCity = (city: any) => {
  currentCity.value = city.name
  message.success(`已切换到${city.name}`)
}

const changeCity = (city: any) => {
  currentCity.value = city.name
  showCitySelector.value = false
  message.success(`已切换到${city.name}`)
}

const filterByCategory = (categoryId: number) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
}

const viewRightDetail = (right: any) => {
  selectedRight.value = right
  showRightDetail.value = true
}

const claimRight = (right: any) => {
  if (right.isClaimed) {
    message.warning('您已领取过该权益')
    return
  }

  right.isClaimed = true
  message.success('领取成功!已添加到我的票券')
  showRightDetail.value = false
}

const searchCity = () => {
  message.info('搜索功能开发中')
}
</script>

<style scoped>
.city-rights-page {
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
.city-btn {
  color: white !important;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.city-switch {
  background: white;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-city-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.city-name {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1890ff;
}

.city-stats {
  font-size: 13px;
  color: #666;
}

.dot {
  margin: 0 6px;
}

.recommend-tabs {
  background: white;
  padding: 12px 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}

.recommend-reason {
  background: #e6f7ff;
  padding: 12px 16px;
  margin: 0 16px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  font-size: 13px;
}

.cities-section,
.rights-categories,
.rights-list,
.usage-guide {
  padding: 0 16px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.city-count {
  font-size: 13px;
  color: #999;
}

.cities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.city-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.city-card:active {
  transform: scale(0.98);
}

.city-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.city-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.city-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.city-overlay h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: white;
}

.city-overlay p {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.hot-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.city-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.city-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.distance {
  display: flex;
  align-items: center;
  gap: 4px;
}

.city-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.city-highlight {
  font-size: 13px;
  color: #fa8c16;
  display: flex;
  align-items: center;
  gap: 4px;
}

.savings {
  font-weight: bold;
  color: #f5222d;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.category-card {
  background: white;
  padding: 16px 8px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-card.active {
  background: #e6f7ff;
  border: 1px solid #1890ff;
}

.category-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.category-name {
  font-size: 12px;
  margin-bottom: 4px;
}

.category-count {
  font-size: 11px;
  color: #999;
}

.rights-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.right-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.right-card:active {
  transform: scale(0.98);
}

.right-image {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.right-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.right-content h4 {
  margin: 0;
  font-size: 15px;
  font-weight: bold;
}

.right-subtitle {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.right-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.category-tag {
  color: #1890ff;
}

.validity {
  display: flex;
  align-items: center;
  gap: 4px;
}

.right-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #f5222d;
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.city-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.city-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.city-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-title {
  font-weight: bold;
  font-size: 14px;
}

.city-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.city-tags .ant-tag {
  cursor: pointer;
}

.right-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.detail-section h4 {
  margin-bottom: 8px;
  font-weight: bold;
}

.detail-section p {
  color: #666;
  line-height: 1.6;
}

.usage-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.step-text {
  flex: 1;
  line-height: 24px;
  color: #666;
}
</style>

