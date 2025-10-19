<template>
  <div class="city-selector-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">选择城市</span>
      <div class="placeholder"></div>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <a-input
        v-model:value="searchKeyword"
        placeholder="搜索城市"
        size="large"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </div>

    <!-- 当前定位 -->
    <div class="location-section">
      <div class="section-title">当前定位</div>
      <div class="location-card" @click="selectCity(currentCity)">
        <EnvironmentOutlined class="location-icon" />
        <span class="location-name">{{ currentCity.name }}</span>
        <span v-if="currentCity.code === selectedCity" class="location-selected">
          <CheckOutlined />
        </span>
      </div>
    </div>

    <!-- 热门城市 -->
    <div class="hot-cities-section">
      <div class="section-title">热门城市</div>
      <div class="cities-grid">
        <div 
          v-for="city in hotCities" 
          :key="city.code"
          class="city-item"
          :class="{ selected: city.code === selectedCity }"
          @click="selectCity(city)"
        >
          {{ city.name }}
        </div>
      </div>
    </div>

    <!-- 全部城市 -->
    <div class="all-cities-section">
      <div class="section-title">全部城市</div>
      <div v-for="group in filteredCityGroups" :key="group.letter" class="city-group">
        <div class="group-letter">{{ group.letter }}</div>
        <div class="group-cities">
          <div 
            v-for="city in group.cities" 
            :key="city.code"
            class="city-row"
            :class="{ selected: city.code === selectedCity }"
            @click="selectCity(city)"
          >
            <span class="city-name">{{ city.name }}</span>
            <CheckOutlined v-if="city.code === selectedCity" class="city-check" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { 
  LeftOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  CheckOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的城市
const selectedCity = ref('dalian')

// 当前定位城市
const currentCity = ref({
  code: 'dalian',
  name: '大连'
})

// 热门城市
const hotCities = ref([
  { code: 'beijing', name: '北京' },
  { code: 'shanghai', name: '上海' },
  { code: 'guangzhou', name: '广州' },
  { code: 'shenzhen', name: '深圳' },
  { code: 'hangzhou', name: '杭州' },
  { code: 'chengdu', name: '成都' },
  { code: 'dalian', name: '大连' },
  { code: 'qingdao', name: '青岛' }
])

// 全部城市(按字母分组)
const cityGroups = ref([
  {
    letter: 'A',
    cities: [
      { code: 'anshan', name: '鞍山' },
      { code: 'anyang', name: '安阳' }
    ]
  },
  {
    letter: 'B',
    cities: [
      { code: 'beijing', name: '北京' },
      { code: 'baoding', name: '保定' }
    ]
  },
  {
    letter: 'C',
    cities: [
      { code: 'chengdu', name: '成都' },
      { code: 'chongqing', name: '重庆' },
      { code: 'changsha', name: '长沙' },
      { code: 'changchun', name: '长春' }
    ]
  },
  {
    letter: 'D',
    cities: [
      { code: 'dalian', name: '大连' },
      { code: 'dongguan', name: '东莞' },
      { code: 'dandong', name: '丹东' }
    ]
  },
  {
    letter: 'G',
    cities: [
      { code: 'guangzhou', name: '广州' },
      { code: 'guiyang', name: '贵阳' }
    ]
  },
  {
    letter: 'H',
    cities: [
      { code: 'hangzhou', name: '杭州' },
      { code: 'harbin', name: '哈尔滨' },
      { code: 'hefei', name: '合肥' }
    ]
  },
  {
    letter: 'N',
    cities: [
      { code: 'nanjing', name: '南京' },
      { code: 'nanchang', name: '南昌' },
      { code: 'ningbo', name: '宁波' }
    ]
  },
  {
    letter: 'Q',
    cities: [
      { code: 'qingdao', name: '青岛' },
      { code: 'qinhuangdao', name: '秦皇岛' }
    ]
  },
  {
    letter: 'S',
    cities: [
      { code: 'shanghai', name: '上海' },
      { code: 'shenzhen', name: '深圳' },
      { code: 'shenyang', name: '沈阳' },
      { code: 'suzhou', name: '苏州' }
    ]
  },
  {
    letter: 'T',
    cities: [
      { code: 'tianjin', name: '天津' },
      { code: 'taiyuan', name: '太原' }
    ]
  },
  {
    letter: 'W',
    cities: [
      { code: 'wuhan', name: '武汉' },
      { code: 'wuxi', name: '无锡' }
    ]
  },
  {
    letter: 'X',
    cities: [
      { code: 'xian', name: '西安' },
      { code: 'xiamen', name: '厦门' }
    ]
  },
  {
    letter: 'Z',
    cities: [
      { code: 'zhengzhou', name: '郑州' },
      { code: 'zhuhai', name: '珠海' }
    ]
  }
])

// 过滤后的城市分组
const filteredCityGroups = computed(() => {
  if (!searchKeyword.value) {
    return cityGroups.value
  }
  
  const keyword = searchKeyword.value.toLowerCase()
  return cityGroups.value
    .map(group => ({
      ...group,
      cities: group.cities.filter(city => 
        city.name.toLowerCase().includes(keyword) ||
        city.code.toLowerCase().includes(keyword)
      )
    }))
    .filter(group => group.cities.length > 0)
})

// 选择城市
const selectCity = (city: any) => {
  selectedCity.value = city.code
  
  // 保存到本地存储
  localStorage.setItem('selectedCity', city.code)
  localStorage.setItem('selectedCityName', city.name)
  
  message.success(`已切换到${city.name}`)
  
  // 延迟返回,让用户看到选中效果
  setTimeout(() => {
    router.back()
  }, 500)
}
</script>

<style scoped lang="scss">
.city-selector-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  .anticon {
    font-size: 20px;
    cursor: pointer;
  }

  .page-title {
    font-size: 18px;
    font-weight: 500;
  }

  .placeholder {
    width: 20px;
  }
}

.search-section {
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.location-section, .hot-cities-section, .all-cities-section {
  margin-bottom: 15px;

  .section-title {
    font-size: 14px;
    color: #999;
    padding: 15px;
  }

  .location-card {
    background: #fff;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: background 0.3s;

    &:active {
      background: #f5f5f5;
    }

    .location-icon {
      font-size: 20px;
      color: #ff6b35;
    }

    .location-name {
      flex: 1;
      font-size: 16px;
      color: #333;
    }

    .location-selected {
      color: #ff6b35;
      font-size: 18px;
    }
  }
}

.hot-cities-section {
  .cities-grid {
    background: #fff;
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    .city-item {
      padding: 12px 0;
      text-align: center;
      font-size: 14px;
      color: #333;
      background: #f5f5f5;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &.selected {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
        color: #fff;
        font-weight: 500;
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.all-cities-section {
  .city-group {
    margin-bottom: 0;

    .group-letter {
      padding: 8px 15px;
      background: #f5f5f5;
      font-size: 14px;
      font-weight: 500;
      color: #ff6b35;
    }

    .group-cities {
      background: #fff;

      .city-row {
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background 0.3s;

        &:last-child {
          border-bottom: none;
        }

        &.selected {
          background: #fff5e6;

          .city-name {
            color: #ff6b35;
            font-weight: 500;
          }
        }

        &:active {
          background: #f5f5f5;
        }

        .city-name {
          font-size: 15px;
          color: #333;
        }

        .city-check {
          color: #ff6b35;
          font-size: 18px;
        }
      }
    }
  }
}
</style>

