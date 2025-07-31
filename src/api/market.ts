import { request } from '@/utils/request'
import { API_ENDPOINTS, API_CONFIG } from '@/config/api'
import type { MarketResponse } from '@/utils/mockData'
import { tryMultipleRequests } from '@/utils/corsHelper'

// 市场价格API
// 获取市场价格数据（优先fetch+CORS代理，失败再fallback到axios）
async function fetchMarketPrice() {
  try {
    // 直接用fetch+CORS代理
    const res = await tryMultipleRequests(API_ENDPOINTS.MARKET_PRICE, {
      headers: API_CONFIG.HEADERS,
      timeout: API_CONFIG.TIMEOUT
    })
    const data = await res.json()
    return data
  } catch (e) {
    // fallback到axios
    return marketApi.getMarketPriceByAxios()
  }
}

// 兼容原有axios方案
function getMarketPriceByAxios() {
  return request.get<MarketResponse['data']>(API_ENDPOINTS.MARKET_PRICE, {
    retry: API_CONFIG.RETRY.MAX_RETRIES,
    retryDelay: API_CONFIG.RETRY.RETRY_DELAY
  })
}

export const marketApi = {
  // 获取市场价格数据（自动适配CORS代理）
  async getMarketPrice() {
    return fetchMarketPrice()
  },
  getMarketPriceByAxios,
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
