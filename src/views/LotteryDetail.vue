<template>
  <div class="lottery-detail-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <LeftOutlined @click="router.back()" />
      <span class="page-title">活动详情</span>
      <ShareAltOutlined />
    </div>

    <!-- 活动Banner -->
    <div class="activity-banner">
      <div class="banner-bg"></div>
      <div class="banner-content">
        <div class="activity-title">{{ activity.title }}</div>
        <div class="activity-status" :class="activity.status">
          {{ getStatusText(activity.status) }}
        </div>
      </div>
    </div>

    <!-- 倒计时 -->
    <div v-if="activity.status === 'ongoing'" class="countdown-section">
      <div class="countdown-label">距离开奖</div>
      <div class="countdown-time">{{ activity.countdown }}</div>
    </div>

    <!-- 参与统计 -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-value">{{ activity.participants }}</div>
        <div class="stat-label">参与人数</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ activity.codes }}</div>
        <div class="stat-label">抽奖码数量</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">{{ activity.prizes.length }}</div>
        <div class="stat-label">奖品总数</div>
      </div>
    </div>

    <!-- 奖品列表 -->
    <div class="prizes-section">
      <div class="section-title">🎁 奖品列表</div>
      <div class="prizes-list">
        <div v-for="(prize, index) in activity.prizes" :key="index" class="prize-card">
          <div class="prize-level">{{ prize.level }}</div>
          <div class="prize-info">
            <div class="prize-name">{{ prize.name }}</div>
            <div class="prize-quantity">x {{ prize.quantity }}份</div>
          </div>
          <div class="prize-value">¥{{ prize.value }}</div>
        </div>
      </div>
    </div>

    <!-- 活动规则 -->
    <div class="rules-section">
      <div class="section-title">📋 活动规则</div>
      <div class="rules-content">
        <div v-for="(rule, index) in activity.rules" :key="index" class="rule-item">
          <span class="rule-number">{{ index + 1 }}.</span>
          <span class="rule-text">{{ rule }}</span>
        </div>
      </div>
    </div>

    <!-- 开奖算法 -->
    <div class="algorithm-section">
      <div class="section-title">🔐 开奖算法</div>
      <div class="algorithm-content">
        <div class="algorithm-desc">{{ activity.algorithm }}</div>
        <div class="algorithm-note">算法公开透明,确保公平公正</div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="bottom-actions">
      <a-button 
        v-if="activity.status === 'ongoing'" 
        type="primary" 
        size="large" 
        block
        @click="participate"
      >
        立即参与抽奖
      </a-button>
      <a-button 
        v-else-if="activity.status === 'upcoming'" 
        size="large" 
        block
        disabled
      >
        活动未开始
      </a-button>
      <a-button 
        v-else 
        size="large" 
        block
        @click="viewResults"
      >
        查看开奖结果
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LeftOutlined, ShareAltOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 活动数据
const activity = ref({
  id: 1,
  title: '大连消费券大抽奖',
  description: '上传大连地区消费票根,即可参与抽奖',
  status: 'ongoing',
  startTime: '2025-10-10 00:00',
  endTime: '2025-10-20 23:59',
  drawTime: '2025-10-21 10:00',
  countdown: '2天3小时',
  participants: 1234,
  codes: 2156,
  prizes: [
    { level: '一等奖', name: '500元消费券', quantity: 10, value: '500' },
    { level: '二等奖', name: '200元消费券', quantity: 50, value: '200' },
    { level: '三等奖', name: '50元消费券', quantity: 200, value: '50' },
    { level: '参与奖', name: '5元消费券', quantity: 1000, value: '5' }
  ],
  rules: [
    '上传大连地区消费票根,审核通过后可获得抽奖码',
    '每张票根只能获得一个抽奖码,不可重复使用',
    '抽奖码数量不限,上传越多中奖概率越大',
    '开奖时间为2025年10月21日10:00',
    '中奖后请在7天内领取奖品,逾期视为放弃',
    '虚拟奖品将自动发放到账户,实物奖品需填写收货地址',
    '本活动最终解释权归主办方所有'
  ],
  algorithm: '采用区块链随机数算法,基于开奖时刻的区块哈希值生成随机数,确保开奖结果公平公正,不可篡改。'
})

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    ongoing: '进行中',
    upcoming: '即将开始',
    ended: '已结束'
  }
  return texts[status] || '未知'
}

// 参与抽奖
const participate = () => {
  router.push(`/get-lottery-code?activityId=${activity.value.id}`)
}

// 查看结果
const viewResults = () => {
  router.push('/lottery-records')
}
</script>

<style scoped lang="scss">
.lottery-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
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
}

.activity-banner {
  position: relative;
  height: 200px;
  overflow: hidden;

  .banner-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
  }

  .banner-content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;

    .activity-title {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      text-align: center;
      margin-bottom: 12px;
    }

    .activity-status {
      padding: 6px 20px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.3);
      color: #fff;
      backdrop-filter: blur(10px);
    }
  }
}

.countdown-section {
  background: linear-gradient(135deg, #fff5e6 0%, #ffe7ba 100%);
  margin: -20px 15px 15px;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);

  .countdown-label {
    font-size: 14px;
    color: #ff6b35;
    margin-bottom: 8px;
  }

  .countdown-time {
    font-size: 28px;
    font-weight: bold;
    color: #ff6b35;
  }
}

.stats-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #fff;
  margin: 0 15px 15px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .stat-item {
    text-align: center;

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #ff6b35;
      margin-bottom: 6px;
    }

    .stat-label {
      font-size: 13px;
      color: #999;
    }
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: #f0f0f0;
  }
}

.prizes-section, .rules-section, .algorithm-section {
  margin: 0 15px 15px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
    padding-left: 12px;
    border-left: 4px solid #ff6b35;
  }

  .prizes-list {
    .prize-card {
      background: #fff;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      gap: 15px;

      .prize-level {
        padding: 8px 12px;
        background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
        color: #fff;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        flex-shrink: 0;
      }

      .prize-info {
        flex: 1;

        .prize-name {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .prize-quantity {
          font-size: 13px;
          color: #999;
        }
      }

      .prize-value {
        font-size: 20px;
        font-weight: bold;
        color: #ff6b35;
      }
    }
  }

  .rules-content {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .rule-item {
      display: flex;
      margin-bottom: 12px;
      line-height: 1.6;

      &:last-child {
        margin-bottom: 0;
      }

      .rule-number {
        color: #ff6b35;
        font-weight: 500;
        margin-right: 8px;
        flex-shrink: 0;
      }

      .rule-text {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .algorithm-content {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .algorithm-desc {
      font-size: 14px;
      color: #666;
      line-height: 1.8;
      margin-bottom: 12px;
    }

    .algorithm-note {
      font-size: 13px;
      color: #52c41a;
      padding: 10px;
      background: #f6ffed;
      border-radius: 8px;
      text-align: center;
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}
</style>

