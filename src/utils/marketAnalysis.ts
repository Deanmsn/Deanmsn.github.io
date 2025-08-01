import type { MarketItem } from './mockData'
import { getItemDisplayName } from './itemNames'

export interface AnalysisResult {
  itemId: string
  displayName: string
  score: number
  reason: string
  details: {
    sellPrice?: number
    buyPrice?: number
    priceProfit?: number
    sellVolume?: number
    buyVolume?: number
    sellOrders?: number
    buyOrders?: number
  }
}

export interface AnalysisConfig {
  label: string
  priceWeight?: number
  volumeWeight?: number
  ordersWeight?: number
  minPriceGap?: number
  minVolume?: number
  maxPrice?: number
  weightPriceGap?: number
  weightVolume?: number
  weightOrders?: number
}

export const DEFAULT_ANALYSIS_CONFIG: AnalysisConfig = {
  minPriceGap: 10,
  minVolume: 100,
  maxPrice: 100000,
  weightPriceGap: 0.4,
  weightVolume: 0.3,
  weightOrders: 0.3
}

function calculateScore(
    priceProfit: number,
    volume: number,
    orders: number,
    config: AnalysisConfig
): number {
  const priceScore = Math.min(priceProfit / 100, 1)
  const volumeScore = Math.min(volume / 10000, 1)
  const ordersScore = Math.min(orders / 50, 1)

  return (
      priceScore * (config.weightPriceGap ?? 0.4) +
      volumeScore * (config.weightVolume ?? 0.3) +
      ordersScore * (config.weightOrders ?? 0.3)
  )
}

export function analyzeBestBuyItems(
    marketData: Record<string, MarketItem>,
    config: AnalysisConfig = DEFAULT_ANALYSIS_CONFIG,
    limit: number = 10
): AnalysisResult[] {
  const results: AnalysisResult[] = []

  for (const [itemId, item] of Object.entries(marketData)) {
    if (!item.buyOrders || !item.sellOrders) continue
    const buy = item.buyOrders
    const sell = item.sellOrders

    const buyPrice = buy.maxPrice
    const sellPrice = sell.minPrice
    const priceProfit = buyPrice - sellPrice

    if (priceProfit < (config.minPriceGap ?? 0)) continue
    if (buyPrice > (config.maxPrice ?? Infinity)) continue
    if (buy.totalCount < (config.minVolume ?? 0)) continue

    const score = calculateScore(priceProfit, buy.totalCount, buy.orderCount, config)

    results.push({
      itemId,
      displayName: getItemDisplayName(itemId),
      score,
      reason: generateBuyReason(buy, priceProfit),
      details: {
        sellPrice,
        buyPrice,
        priceProfit,
        buyVolume: buy.totalCount,
        buyOrders: buy.orderCount
      }
    })
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}

export function analyzeBestSellItems(
    marketData: Record<string, MarketItem>,
    config: AnalysisConfig = DEFAULT_ANALYSIS_CONFIG,
    limit: number = 10
): AnalysisResult[] {
  const results: AnalysisResult[] = []

  for (const [itemId, item] of Object.entries(marketData)) {
    if (!item.buyOrders || !item.sellOrders) continue
    const buy = item.buyOrders
    const sell = item.sellOrders

    const buyPrice = buy.maxPrice
    const sellPrice = sell.minPrice
    const priceProfit = sellPrice - buyPrice

    if (priceProfit < (config.minPriceGap ?? 0)) continue
    if (sellPrice > (config.maxPrice ?? Infinity)) continue
    if (sell.totalCount < (config.minVolume ?? 0)) continue

    const score = calculateScore(priceProfit, sell.totalCount, sell.orderCount, config)

    results.push({
      itemId,
      displayName: getItemDisplayName(itemId),
      score,
      reason: generateSellReason(sell, priceProfit),
      details: {
        sellPrice,
        buyPrice,
        priceProfit,
        sellVolume: sell.totalCount,
        sellOrders: sell.orderCount
      }
    })
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}

function generateBuyReason(buy: NonNullable<MarketItem['buyOrders']>, profit: number): string {
  const reasons: string[] = []

  if (profit > 50) reasons.push('套利空间极大')
  else if (profit > 20) reasons.push('有明显价格优势')

  if (buy.totalCount > 10000) reasons.push('求购量很大')
  else if (buy.totalCount > 1000) reasons.push('求购量较多')

  if (buy.orderCount > 20) reasons.push('求购订单非常活跃')
  else if (buy.orderCount > 5) reasons.push('有一定活跃度')

  return reasons.join('，') || '价格合理，有一定交易量'
}

function generateSellReason(sell: NonNullable<MarketItem['sellOrders']>, profit: number): string {
  const reasons: string[] = []

  if (profit > 50) reasons.push('价格远高于买单')
  else if (profit > 20) reasons.push('价格差距明显')

  if (sell.totalCount > 10000) reasons.push('出售量很大')
  else if (sell.totalCount > 1000) reasons.push('出售量较多')

  if (sell.orderCount > 20) reasons.push('出售订单非常活跃')
  else if (sell.orderCount > 5) reasons.push('有一定活跃度')

  return reasons.join('，') || '价格合理，有一定交易量'
}

export function getMarketOverview(marketData: Record<string, MarketItem>) {
  const items = Object.values(marketData)

  return {
    totalItems: items.length,
    itemsWithSellOrders: items.filter(i => i.sellOrders).length,
    itemsWithBuyOrders: items.filter(i => i.buyOrders).length,
    avgSellPrice:
        items.filter(i => i.sellOrders?.minPrice).reduce((sum, i) => sum + (i.sellOrders?.minPrice || 0), 0) /
        items.filter(i => i.sellOrders?.minPrice).length,
    avgBuyPrice:
        items.filter(i => i.buyOrders?.maxPrice).reduce((sum, i) => sum + (i.buyOrders?.maxPrice || 0), 0) /
        items.filter(i => i.buyOrders?.maxPrice).length,
    totalSellVolume:
        items.filter(i => i.sellOrders?.totalCount).reduce((sum, i) => sum + (i.sellOrders?.totalCount || 0), 0),
    totalBuyVolume:
        items.filter(i => i.buyOrders?.totalCount).reduce((sum, i) => sum + (i.buyOrders?.totalCount || 0), 0)
  }
}
