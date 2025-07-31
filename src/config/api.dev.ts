// 开发环境API配置
export const DEV_API_CONFIG = {
  // 开发环境使用代理，避免CORS问题
  BASE_URL: '', // 空字符串，使用相对路径
  
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
export const DEV_API_ENDPOINTS = {
  // 市场价格
  MARKET_PRICE: '/api/game/market/price',
  
  // 商品价格
  ITEM_PRICE: (itemId: string) => `/api/game/market/price/${itemId}`,
  
  // 价格历史
  PRICE_HISTORY: (itemId: string) => `/api/game/market/history/${itemId}`
} 