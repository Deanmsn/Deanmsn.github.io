// 判断是否为开发环境
const isDev = import.meta.env.DEV

// API配置
export const API_CONFIG = {
  // 基础URL - 开发环境使用代理，生产环境使用完整URL
  BASE_URL: isDev ? '' : 'https://www.moyu-idle.com',
  
  // 超时时间
  TIMEOUT: 10000,
  
  // 重试配置
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
  },
  
  // 请求头
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// API端点
export const API_ENDPOINTS = {
  // 市场价格
  MARKET_PRICE: '/api/game/market/price',
  
  // 商品价格
  ITEM_PRICE: (itemId: string) => `/api/game/market/price/${itemId}`,
  
  // 价格历史
  PRICE_HISTORY: (itemId: string) => `/api/game/market/history/${itemId}`
} 