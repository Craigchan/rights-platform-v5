import { ref } from 'vue'

interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toastState = ref({
  show: false,
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info',
  duration: 2000
})

export function useToast() {
  const showToast = (options: ToastOptions) => {
    toastState.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 2000
    }
  }

  const success = (message: string, duration?: number) => {
    showToast({ message, type: 'success', duration })
  }

  const error = (message: string, duration?: number) => {
    showToast({ message, type: 'error', duration })
  }

  const warning = (message: string, duration?: number) => {
    showToast({ message, type: 'warning', duration })
  }

  const info = (message: string, duration?: number) => {
    showToast({ message, type: 'info', duration })
  }

  return {
    toastState,
    showToast,
    success,
    error,
    warning,
    info
  }
}

