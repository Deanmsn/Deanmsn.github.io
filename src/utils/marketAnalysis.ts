import type { MarketItem } from './mockData'
import { getItemDisplayName } from './itemNames'

// 分析结果接口
export interface AnalysisResult {
  itemId: string
  displayName: string
  score: number
  reason: string
  details: {
    sellPrice?: number
    buyPrice?: number
    priceGap?: number
    sellVolume?: number
    buyVolume?: number
    sellOrders?: number
    buyOrders?: number
  }
}

// 分析配置
export interface AnalysisConfig {
  minPriceGap?: number // 最小价格差距
  minVolume?: number // 最小交易量
  maxPrice?: number // 最大价格限制
  weightPriceGap?: number // 价格差距权重
  weightVolume?: number // 交易量权重
  weightOrders?: number // 订单数权重
}

// 默认分析配置
export const DEFAULT_ANALYSIS_CONFIG: AnalysisConfig = {
  minPriceGap: 10, // 最小价格差距10
  minVolume: 100, // 最小交易量100
  maxPrice: 100000, // 最大价格限制
  weightPriceGap: 0.4, // 价格差距权重40%
  weightVolume: 0.3, // 交易量权重30%
  weightOrders: 0.3 // 订单数权重30%
}

/**
 * 分析最适合购入的商品
 * 标准：价格差距大、求购量大、求购订单多
 */
export function analyzeBestBuyItems(
  marketData: Record<string, MarketItem>,
  config: AnalysisConfig = DEFAULT_ANALYSIS_CONFIG,
  limit: number = 10
): AnalysisResult[] {
  const results: AnalysisResult[] = []
  
  Object.entries(marketData).forEach(([itemId, item]) => {
    // 必须有求购订单
    if (!item.buyOrders) return
    
    const buyPrice = item.buyOrders.maxPrice
    const sellPrice = item.sellOrders?.minPrice || 0
    const priceGap = sellPrice - buyPrice
    
    // 过滤条件
    if (priceGap < (config.minPriceGap || 0)) return
    if (buyPrice > (config.maxPrice || Infinity)) return
    if (item.buyOrders.totalCount < (config.minVolume || 0)) return
    
    // 计算评分
    const priceGapScore = Math.min(priceGap / 100, 1) // 价格差距评分
    const volumeScore = Math.min(item.buyOrders.totalCount / 10000, 1) // 交易量评分
    const ordersScore = Math.min(item.buyOrders.orderCount / 50, 1) // 订单数评分
    
    const totalScore = 
      (priceGapScore * (config.weightPriceGap || 0.4)) +
      (volumeScore * (config.weightVolume || 0.3)) +
      (ordersScore * (config.weightOrders || 0.3))
    
    results.push({
      itemId,
      displayName: getItemDisplayName(itemId),
      score: totalScore,
      reason: generateBuyReason(item, priceGap),
      details: {
        sellPrice,
        buyPrice,
        priceGap,
        buyVolume: item.buyOrders.totalCount,
        buyOrders: item.buyOrders.orderCount
      }
    })
  })
  
  // 按评分排序，返回前N名
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * 分析最适合出手的商品
 * 标准：价格差距大、出售量大、出售订单多
 */
export function analyzeBestSellItems(
  marketData: Record<string, MarketItem>,
  config: AnalysisConfig = DEFAULT_ANALYSIS_CONFIG,
  limit: number = 10
): AnalysisResult[] {
  const results: AnalysisResult[] = []
  
  Object.entries(marketData).forEach(([itemId, item]) => {
    // 必须有出售订单
    if (!item.sellOrders) return
    
    const sellPrice = item.sellOrders.minPrice
    const buyPrice = item.buyOrders?.maxPrice || 0
    const priceGap = sellPrice - buyPrice
    
    // 过滤条件
    if (priceGap < (config.minPriceGap || 0)) return
    if (sellPrice > (config.maxPrice || Infinity)) return
    if (item.sellOrders.totalCount < (config.minVolume || 0)) return
    
    // 计算评分
    const priceGapScore = Math.min(priceGap / 100, 1) // 价格差距评分
    const volumeScore = Math.min(item.sellOrders.totalCount / 10000, 1) // 交易量评分
    const ordersScore = Math.min(item.sellOrders.orderCount / 50, 1) // 订单数评分
    
    const totalScore = 
      (priceGapScore * (config.weightPriceGap || 0.4)) +
      (volumeScore * (config.weightVolume || 0.3)) +
      (ordersScore * (config.weightOrders || 0.3))
    
    results.push({
      itemId,
      displayName: getItemDisplayName(itemId),
      score: totalScore,
      reason: generateSellReason(item, priceGap),
      details: {
        sellPrice,
        buyPrice,
        priceGap,
        sellVolume: item.sellOrders.totalCount,
        sellOrders: item.sellOrders.orderCount
      }
    })
  })
  
  // 按评分排序，返回前N名
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * 生成购入理由
 */
function generateBuyReason(item: MarketItem, priceGap: number): string {
  const reasons: string[] = []
  
  if (priceGap > 50) {
    reasons.push('价格差距很大')
  } else if (priceGap > 20) {
    reasons.push('价格差距较大')
  }
  
  if (item.buyOrders!.totalCount > 10000) {
    reasons.push('求购量很大')
  } else if (item.buyOrders!.totalCount > 1000) {
    reasons.push('求购量较大')
  }
  
  if (item.buyOrders!.orderCount > 20) {
    reasons.push('求购订单很多')
  } else if (item.buyOrders!.orderCount > 5) {
    reasons.push('求购订单较多')
  }
  
  return reasons.join('，') || '价格合理，有一定交易量'
}

/**
 * 生成出手理由
 */
function generateSellReason(item: MarketItem, priceGap: number): string {
  const reasons: string[] = []
  
  if (priceGap > 50) {
    reasons.push('价格差距很大')
  } else if (priceGap > 20) {
    reasons.push('价格差距较大')
  }
  
  if (item.sellOrders!.totalCount > 10000) {
    reasons.push('出售量很大')
  } else if (item.sellOrders!.totalCount > 1000) {
    reasons.push('出售量较大')
  }
  
  if (item.sellOrders!.orderCount > 20) {
    reasons.push('出售订单很多')
  } else if (item.sellOrders!.orderCount > 5) {
    reasons.push('出售订单较多')
  }
  
  return reasons.join('，') || '价格合理，有一定交易量'
}

/**
 * 获取市场概况
 */
export function getMarketOverview(marketData: Record<string, MarketItem>) {
  const items = Object.values(marketData)
  
  return {
    totalItems: items.length,
    itemsWithSellOrders: items.filter(item => item.sellOrders !== null).length,
    itemsWithBuyOrders: items.filter(item => item.buyOrders !== null).length,
    avgSellPrice: items
      .filter(item => item.sellOrders?.minPrice)
      .reduce((sum, item) => sum + (item.sellOrders?.minPrice || 0), 0) / 
      items.filter(item => item.sellOrders?.minPrice).length,
    avgBuyPrice: items
      .filter(item => item.buyOrders?.maxPrice)
      .reduce((sum, item) => sum + (item.buyOrders?.maxPrice || 0), 0) / 
      items.filter(item => item.buyOrders?.maxPrice).length,
    totalSellVolume: items
      .filter(item => item.sellOrders?.totalCount)
      .reduce((sum, item) => sum + (item.sellOrders?.totalCount || 0), 0),
    totalBuyVolume: items
      .filter(item => item.buyOrders?.totalCount)
      .reduce((sum, item) => sum + (item.buyOrders?.totalCount || 0), 0)
  }
} 