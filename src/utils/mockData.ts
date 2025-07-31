export interface MarketItem {
  itemId: string
  sellOrders: {
    minPrice: number
    minPriceCount: number
    totalCount: number
    orderCount: number
  } | null
  buyOrders: {
    maxPrice: number
    maxPriceCount: number
    totalCount: number
    orderCount: number
  } | null
  lastUpdateTime: number
}

export interface MarketResponse {
  code: number
  msg: string
  data: {
    items: Record<string, MarketItem>
    lastUpdateTime: number
    totalItems: number
  }
}

export const mockMarketData: Record<string, MarketItem> = {
  "wood": {
    itemId: "wood",
    sellOrders: {
      minPrice: 6,
      minPriceCount: 2003115,
      totalCount: 2675559,
      orderCount: 25
    },
    buyOrders: {
      maxPrice: 4,
      maxPriceCount: 900000,
      totalCount: 23276244,
      orderCount: 13
    },
    lastUpdateTime: 1753924270605
  },
  "stone": {
    itemId: "stone",
    sellOrders: {
      minPrice: 8,
      minPriceCount: 39045,
      totalCount: 3387236,
      orderCount: 59
    },
    buyOrders: {
      maxPrice: 5,
      maxPriceCount: 99999,
      totalCount: 2729216,
      orderCount: 6
    },
    lastUpdateTime: 1753924271802
  },
  "iron": {
    itemId: "iron",
    sellOrders: {
      minPrice: 450,
      minPriceCount: 65430,
      totalCount: 364931,
      orderCount: 11
    },
    buyOrders: {
      maxPrice: 310,
      maxPriceCount: 179500,
      totalCount: 29154070,
      orderCount: 30
    },
    lastUpdateTime: 1753924274192
  },
  "steel": {
    itemId: "steel",
    sellOrders: {
      minPrice: 410,
      minPriceCount: 103941,
      totalCount: 481245,
      orderCount: 6
    },
    buyOrders: {
      maxPrice: 120,
      maxPriceCount: 100000,
      totalCount: 6011060,
      orderCount: 13
    },
    lastUpdateTime: 1753924275365
  }
} 