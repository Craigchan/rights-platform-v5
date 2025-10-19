/**
 * 音效和震动反馈工具类
 */

// 音效类型
export enum SoundType {
  SPIN = 'spin',           // 转盘旋转
  WIN = 'win',             // 中奖
  LOSE = 'lose',           // 未中奖
  CLICK = 'click',         // 点击
  SUCCESS = 'success',     // 成功
  ERROR = 'error'          // 错误
}

// 震动模式
export enum VibrationPattern {
  LIGHT = 'light',         // 轻震动
  MEDIUM = 'medium',       // 中等震动
  HEAVY = 'heavy',         // 重震动
  SUCCESS = 'success',     // 成功震动
  ERROR = 'error'          // 错误震动
}

class SoundAndVibrationManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<SoundType, HTMLAudioElement> = new Map()
  private enabled: boolean = true
  private vibrationEnabled: boolean = true

  constructor() {
    this.init()
  }

  /**
   * 初始化
   */
  private init() {
    // 从本地存储读取设置
    const soundEnabled = localStorage.getItem('soundEnabled')
    const vibrationEnabled = localStorage.getItem('vibrationEnabled')
    
    this.enabled = soundEnabled !== 'false'
    this.vibrationEnabled = vibrationEnabled !== 'false'
  }

  /**
   * 预加载音效
   */
  preloadSounds() {
    // 注意: 实际项目中应该有真实的音频文件
    // 这里使用Web Audio API生成简单的音效
    this.generateSounds()
  }

  /**
   * 生成音效(使用Web Audio API)
   */
  private generateSounds() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  /**
   * 播放音效
   */
  playSound(type: SoundType) {
    if (!this.enabled) return

    try {
      if (this.audioContext) {
        this.playSynthSound(type)
      }
    } catch (e) {
      console.warn('Failed to play sound:', e)
    }
  }

  /**
   * 使用Web Audio API播放合成音效
   */
  private playSynthSound(type: SoundType) {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // 根据类型设置不同的音效参数
    switch (type) {
      case SoundType.SPIN:
        oscillator.frequency.value = 440
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.1)
        break

      case SoundType.WIN:
        // 胜利音效 - 上升音阶
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2) // G5
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.5)
        break

      case SoundType.LOSE:
        // 失败音效 - 下降音阶
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime)
        oscillator.frequency.setValueAtTime(392.00, this.audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.3)
        break

      case SoundType.CLICK:
        oscillator.frequency.value = 800
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.05)
        break

      case SoundType.SUCCESS:
        oscillator.frequency.value = 880
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.2)
        break

      case SoundType.ERROR:
        oscillator.frequency.value = 200
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.2)
        break
    }
  }

  /**
   * 触发震动
   */
  vibrate(pattern: VibrationPattern) {
    if (!this.vibrationEnabled) return
    if (!navigator.vibrate) return

    try {
      switch (pattern) {
        case VibrationPattern.LIGHT:
          navigator.vibrate(10)
          break
        case VibrationPattern.MEDIUM:
          navigator.vibrate(30)
          break
        case VibrationPattern.HEAVY:
          navigator.vibrate(50)
          break
        case VibrationPattern.SUCCESS:
          navigator.vibrate([10, 50, 10, 50, 10])
          break
        case VibrationPattern.ERROR:
          navigator.vibrate([50, 100, 50])
          break
      }
    } catch (e) {
      console.warn('Vibration not supported:', e)
    }
  }

  /**
   * 播放音效并震动
   */
  playSoundAndVibrate(soundType: SoundType, vibrationPattern: VibrationPattern) {
    this.playSound(soundType)
    this.vibrate(vibrationPattern)
  }

  /**
   * 设置音效开关
   */
  setSoundEnabled(enabled: boolean) {
    this.enabled = enabled
    localStorage.setItem('soundEnabled', enabled.toString())
  }

  /**
   * 设置震动开关
   */
  setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled
    localStorage.setItem('vibrationEnabled', enabled.toString())
  }

  /**
   * 获取音效开关状态
   */
  isSoundEnabled(): boolean {
    return this.enabled
  }

  /**
   * 获取震动开关状态
   */
  isVibrationEnabled(): boolean {
    return this.vibrationEnabled
  }

  /**
   * 抽奖开始音效
   */
  playLotteryStart() {
    this.playSoundAndVibrate(SoundType.SPIN, VibrationPattern.LIGHT)
  }

  /**
   * 抽奖中奖音效
   */
  playLotteryWin() {
    this.playSoundAndVibrate(SoundType.WIN, VibrationPattern.SUCCESS)
  }

  /**
   * 抽奖未中奖音效
   */
  playLotteryLose() {
    this.playSoundAndVibrate(SoundType.LOSE, VibrationPattern.MEDIUM)
  }

  /**
   * 点击音效
   */
  playClick() {
    this.playSoundAndVibrate(SoundType.CLICK, VibrationPattern.LIGHT)
  }

  /**
   * 成功音效
   */
  playSuccess() {
    this.playSoundAndVibrate(SoundType.SUCCESS, VibrationPattern.MEDIUM)
  }

  /**
   * 错误音效
   */
  playError() {
    this.playSoundAndVibrate(SoundType.ERROR, VibrationPattern.ERROR)
  }
}

// 导出单例
export const soundManager = new SoundAndVibrationManager()

// 初始化时预加载音效
soundManager.preloadSounds()

