// 权益平台 - API 请求封装

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'

// API 基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const TIMEOUT = 30000

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('access_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加请求时间戳（防止缓存）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response
    
    // 如果是下载文件，直接返回
    if (config.responseType === 'blob') {
      return response
    }
    
    // 统一处理业务错误
    if (data.code !== undefined && data.code !== 0 && data.code !== 200) {
      const errorMsg = data.message || '请求失败'
      message.error(errorMsg)
      return Promise.reject(new Error(errorMsg))
    }
    
    return data
  },
  (error: AxiosError) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          message.error('未授权，请重新登录')
          // 清除 token 并跳转到登录页
          localStorage.removeItem('access_token')
          window.location.href = '/login'
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器错误')
          break
        case 502:
          message.error('网关错误')
          break
        case 503:
          message.error('服务不可用')
          break
        default:
          message.error((data as any)?.message || '请求失败')
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message.error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      message.error(error.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)

// 通用请求方法
export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return instance.request(config)
}

// GET 请求
export const get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.get(url, { params, ...config })
}

// POST 请求
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.post(url, data, config)
}

// PUT 请求
export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.put(url, data, config)
}

// DELETE 请求
export const del = <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.delete(url, { params, ...config })
}

// PATCH 请求
export const patch = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.patch(url, data, config)
}

// 文件上传
export const upload = <T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
  const formData = new FormData()
  formData.append('file', file)
  
  return instance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}

// 文件下载
export const download = async (url: string, filename?: string): Promise<void> => {
  try {
    const response = await instance.get(url, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download error:', error)
    message.error('下载失败')
  }
}

// 批量请求
export const all = <T = any>(requests: Promise<any>[]): Promise<T[]> => {
  return Promise.all(requests)
}

// 请求重试
export const retry = <T = any>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  return fn().catch((error) => {
    if (retries > 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(retry(fn, retries - 1, delay))
        }, delay)
      })
    }
    return Promise.reject(error)
  })
}

// 请求取消
export const createCancelToken = () => {
  const CancelToken = axios.CancelToken
  return CancelToken.source()
}

export default {
  request,
  get,
  post,
  put,
  del,
  patch,
  upload,
  download,
  all,
  retry,
  createCancelToken
}

