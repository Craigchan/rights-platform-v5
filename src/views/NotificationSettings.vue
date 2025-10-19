<template>
  <div class="notification-settings-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <LeftOutlined @click="goBack" class="back-icon" />
      <span class="page-title">消息通知设置</span>
      <div class="header-placeholder"></div>
    </div>

    <!-- 通知总开关 -->
    <div class="section-card">
      <div class="setting-item master-switch">
        <div class="setting-info">
          <div class="setting-label">
            <BellOutlined class="label-icon" />
            接收通知
          </div>
          <div class="setting-desc">关闭后将不再接收任何通知</div>
        </div>
        <a-switch v-model:checked="masterSwitch" @change="handleMasterSwitch" />
      </div>
    </div>

    <!-- 系统通知 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">系统通知</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">订单消息</div>
          <div class="setting-desc">订单状态变更、物流更新等</div>
        </div>
        <a-switch 
          v-model:checked="settings.order" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">优惠券消息</div>
          <div class="setting-desc">优惠券到账、即将过期提醒</div>
        </div>
        <a-switch 
          v-model:checked="settings.coupon" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">积分消息</div>
          <div class="setting-desc">积分变动、积分即将过期</div>
        </div>
        <a-switch 
          v-model:checked="settings.points" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">中奖消息</div>
          <div class="setting-desc">抽奖中奖、奖品即将过期</div>
        </div>
        <a-switch 
          v-model:checked="settings.lottery" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>
    </div>

    <!-- 活动通知 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">活动通知</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">促销活动</div>
          <div class="setting-desc">限时秒杀、特价促销等活动</div>
        </div>
        <a-switch 
          v-model:checked="settings.promotion" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">新品上架</div>
          <div class="setting-desc">新商品、新优惠券上架通知</div>
        </div>
        <a-switch 
          v-model:checked="settings.newProduct" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">政府活动</div>
          <div class="setting-desc">政府消费券、惠民活动</div>
        </div>
        <a-switch 
          v-model:checked="settings.govActivity" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>
    </div>

    <!-- 互动通知 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">互动通知</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">评价提醒</div>
          <div class="setting-desc">订单完成后的评价提醒</div>
        </div>
        <a-switch 
          v-model:checked="settings.review" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">客服回复</div>
          <div class="setting-desc">客服回复您的咨询</div>
        </div>
        <a-switch 
          v-model:checked="settings.customerService" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">反馈回复</div>
          <div class="setting-desc">意见反馈的官方回复</div>
        </div>
        <a-switch 
          v-model:checked="settings.feedback" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>
    </div>

    <!-- 通知方式 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">通知方式</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">应用内通知</div>
          <div class="setting-desc">在应用内显示通知消息</div>
        </div>
        <a-switch 
          v-model:checked="notificationMethods.inApp" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">推送通知</div>
          <div class="setting-desc">通过系统推送通知</div>
        </div>
        <a-switch 
          v-model:checked="notificationMethods.push" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">短信通知</div>
          <div class="setting-desc">重要消息通过短信通知</div>
        </div>
        <a-switch 
          v-model:checked="notificationMethods.sms" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">邮件通知</div>
          <div class="setting-desc">通过邮件接收通知</div>
        </div>
        <a-switch 
          v-model:checked="notificationMethods.email" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>
    </div>

    <!-- 免打扰时段 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">免打扰时段</span>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">开启免打扰</div>
          <div class="setting-desc">在指定时段内不接收通知</div>
        </div>
        <a-switch 
          v-model:checked="doNotDisturb.enabled" 
          :disabled="!masterSwitch"
          @change="saveSettings"
        />
      </div>

      <div v-if="doNotDisturb.enabled" class="time-picker-section">
        <div class="time-picker-item">
          <span class="time-label">开始时间</span>
          <a-time-picker 
            v-model:value="doNotDisturb.startTime" 
            format="HH:mm"
            @change="saveSettings"
          />
        </div>
        <div class="time-picker-item">
          <span class="time-label">结束时间</span>
          <a-time-picker 
            v-model:value="doNotDisturb.endTime" 
            format="HH:mm"
            @change="saveSettings"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  LeftOutlined,
  BellOutlined
} from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'

const router = useRouter()

// 总开关
const masterSwitch = ref(true)

// 通知设置
const settings = ref({
  // 系统通知
  order: true,
  coupon: true,
  points: true,
  lottery: true,
  // 活动通知
  promotion: true,
  newProduct: false,
  govActivity: true,
  // 互动通知
  review: true,
  customerService: true,
  feedback: true
})

// 通知方式
const notificationMethods = ref({
  inApp: true,
  push: true,
  sms: false,
  email: false
})

// 免打扰时段
const doNotDisturb = ref({
  enabled: false,
  startTime: dayjs('22:00', 'HH:mm') as Dayjs | null,
  endTime: dayjs('08:00', 'HH:mm') as Dayjs | null
})

// 处理总开关
const handleMasterSwitch = (checked: boolean) => {
  if (!checked) {
    message.warning('关闭后将不再接收任何通知')
  } else {
    message.success('已开启通知')
  }
  saveSettings()
}

// 保存设置
const saveSettings = () => {
  // 模拟保存到服务器
  setTimeout(() => {
    message.success('设置已保存')
  }, 300)
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.notification-settings-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航栏 */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-icon {
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.page-title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.header-placeholder {
  width: 20px;
}

/* 设置卡片 */
.section-card {
  background: #fff;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.master-switch {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: #fff;
  border-bottom: none;
}

.setting-info {
  flex: 1;
  min-width: 0;
}

.setting-label {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.master-switch .setting-label {
  color: #fff;
  font-weight: 500;
}

.label-icon {
  font-size: 18px;
}

.setting-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
}

.master-switch .setting-desc {
  color: rgba(255, 255, 255, 0.8);
}

/* 时间选择器 */
.time-picker-section {
  padding: 16px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-label {
  font-size: 14px;
  color: #666;
}

/* 响应式 */
@media (min-width: 768px) {
  .notification-settings-page {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>

