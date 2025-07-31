import { request } from '@/utils/request'
import { API_ENDPOINTS, API_CONFIG } from '@/config/api'
import type { MarketResponse } from '@/utils/mockData'

// 市场价格API
export const marketApi = {
  // 获取市场价格数据
  getMarketPrice() {
    return request.get<MarketResponse['data']>(API_ENDPOINTS.MARKET_PRICE, {
      retry: API_CONFIG.RETRY.MAX_RETRIES,
      retryDelay: API_CONFIG.RETRY.RETRY_DELAY
    })
  },

  // 获取特定商品价格
  getItemPrice(itemId: string) {
    return request.get<MarketResponse['data']>(API_ENDPOINTS.ITEM_PRICE(itemId))
  },

  // 获取价格历史
  getPriceHistory(itemId: string, days: number = 7) {
    return request.get(API_ENDPOINTS.PRICE_HISTORY(itemId), {
      params: { days }
    })
  }
} 