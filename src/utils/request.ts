import axios from 'axios'
import { API_CONFIG } from '@/config/api'

// 响应数据接口
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 请求配置接口
export interface RequestConfig {
  showError?: boolean // 是否显示错误信息
  showLoading?: boolean // 是否显示加载状态
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟
  params?: any // 查询参数
}

// 创建axios实例
const service = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: false // 不发送cookies
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 显示加载状态
    console.log('请求开始:', config.url)
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log('请求完成:', response.config.url)
    return response.data
  },
  (error) => {
    console.log('请求失败:', error.config?.url)
    
    // 处理网络错误
    let errorMsg = '网络错误'
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 400:
          errorMsg = '请求参数错误'
          break
        case 401:
          errorMsg = '未授权，请重新登录'
          localStorage.removeItem('token')
          break
        case 403:
          errorMsg = '拒绝访问'
          break
        case 404:
          errorMsg = '请求地址不存在'
          break
        case 500:
          errorMsg = '服务器内部错误'
          break
        default:
          errorMsg = `请求失败: ${status}`
      }
    } else if (error.request) {
      errorMsg = '网络连接失败'
    } else {
      errorMsg = error.message || '请求配置错误'
    }

    // 输出详细错误信息
    console.error('错误信息:', errorMsg)
    console.error('错误详情:', error)
    return Promise.reject(errorMsg)
  }
)

// 重试机制
const retryRequest = async (
  config: any,
  retryCount: number = 0
): Promise<any> => {
  try {
    return await service(config)
  } catch (error) {
    const maxRetries = config.retry || 0
    const retryDelay = config.retryDelay || 1000

    if (retryCount < maxRetries) {
      console.log(`请求失败，${retryDelay}ms后重试 (${retryCount + 1}/${maxRetries})`)
      
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return retryRequest(config, retryCount + 1)
    }
    
    throw error
  }
}

// 封装请求方法
export const request = {
  // GET请求
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return retryRequest({
      method: 'GET',
      url,
      ...config
    })
  },

  // POST请求
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return retryRequest({
      method: 'POST',
      url,
      data,
      ...config
    })
  },

  // PUT请求
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return retryRequest({
      method: 'PUT',
      url,
      data,
      ...config
    })
  },

  // DELETE请求
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return retryRequest({
      method: 'DELETE',
      url,
      ...config
    })
  },

  // PATCH请求
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return retryRequest({
      method: 'PATCH',
      url,
      data,
      ...config
    })
  }
}

// 导出axios实例
export default service
