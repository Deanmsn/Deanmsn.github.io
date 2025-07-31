// CORS错误处理工具

/**
 * 检查是否为CORS错误
 */
export function isCorsError(error: any): boolean {
  return error.message?.includes('CORS') || 
         error.message?.includes('cors') ||
         error.message?.includes('Access-Control') ||
         error.code === 'ERR_NETWORK' ||
         error.name === 'NetworkError'
}

/**
 * 获取CORS错误信息
 */
export function getCorsErrorMessage(error: any): string {
  if (isCorsError(error)) {
    return '跨域请求被阻止。请检查：\n1. 服务器是否允许跨域请求\n2. 是否使用了正确的代理配置\n3. 网络连接是否正常'
  }
  return error.message || '未知错误'
}

/**
 * 创建CORS友好的请求配置
 */
export function createCorsFriendlyConfig() {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials: false
  }
}

/**
 * 尝试多种请求方式
 */
export async function tryMultipleRequests(url: string, options: any = {}) {
  // 只保留允许的安全头部
  const safeHeaders = { ...options.headers }
  if (safeHeaders['Content-Type']) delete safeHeaders['Content-Type']

  // 目标完整URL
  const fullUrl = url.startsWith('http') ? url : `https://www.moyu-idle.com${url}`

  const methods = [
    // 方法0: 使用 CORS 代理，完整URL且不带Content-Type
    () => fetch(`https://corsproxy.io/?${encodeURIComponent(fullUrl)}`, {
      ...options,
      headers: safeHeaders
    }),
    // 方法1: 直接请求目标
    () => fetch(fullUrl, { ...options, mode: 'cors', headers: safeHeaders }),
    // 方法2: no-cors
    () => fetch(fullUrl, { ...options, mode: 'no-cors', headers: safeHeaders })
  ]
  for (let i = 0; i < methods.length; i++) {
    try {
      const response = await methods[i]()
      if (response.ok) {
        return response
      }
    } catch (error) {
      console.log(`方法${i + 1}失败:`, error)
      if (i === methods.length - 1) {
        throw error
      }
    }
  }
  throw new Error('所有请求方法都失败了')
}
