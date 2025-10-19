<template>
  <div class="sound-settings">
    <div class="setting-item">
      <div class="setting-label">
        <SoundOutlined class="setting-icon" />
        <span>音效</span>
      </div>
      <a-switch v-model:checked="soundEnabled" @change="handleSoundChange" />
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <MobileOutlined class="setting-icon" />
        <span>震动反馈</span>
      </div>
      <a-switch v-model:checked="vibrationEnabled" @change="handleVibrationChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { SoundOutlined, MobileOutlined } from '@ant-design/icons-vue'
import { soundManager } from '@/utils/soundAndVibration'

// 状态
const soundEnabled = ref(true)
const vibrationEnabled = ref(true)

// 初始化
onMounted(() => {
  soundEnabled.value = soundManager.isSoundEnabled()
  vibrationEnabled.value = soundManager.isVibrationEnabled()
})

// 处理音效开关变化
const handleSoundChange = (checked: boolean) => {
  soundManager.setSoundEnabled(checked)
  if (checked) {
    soundManager.playSuccess()
  }
}

// 处理震动开关变化
const handleVibrationChange = (checked: boolean) => {
  soundManager.setVibrationEnabled(checked)
  if (checked) {
    soundManager.vibrate('medium' as any)
  }
}
</script>

<style scoped lang="scss">
.sound-settings {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.setting-icon {
  font-size: 18px;
  color: #FF6B35;
}
</style>

