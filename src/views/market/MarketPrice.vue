<template>
  <div class="market-price">
    <div class="header" ref="headerRef">
      <div class="header-left">
        <h1>市场价格</h1>
        <p v-if="lastUpdateTime" class="update-time">
          最后更新: {{ new Date(lastUpdateTime).toLocaleString() }}
        </p>
      </div>
      <div class="header-right">
        <div class="search-box">
          <input 
            v-model="searchKeyword" 
            @input="filterData"
            placeholder="搜索商品名称..."
            class="search-input"
          />
          <button @click="clearSearch" class="clear-btn">清除</button>
        </div>
        <div class="refresh-btn" @click="fetchMarketData">
          <span>刷新数据</span>
        </div>
        <div class="analysis-btn" @click="goToAnalysis">
          <span>智能分析</span>
        </div>
      </div>
    </div>
    
    <div class="loading" v-if="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div class="error" v-if="error">
      <p>{{ error }}</p>
      <button @click="fetchMarketData">重试</button>
    </div>
    
    <div class="market-content" v-if="Object.keys(filteredMarketData).length > 0">
      <div class="market-stats">
        <div class="stat-card">
          <h3>商品总数</h3>
          <p>{{ Object.keys(marketData).length }}</p>
        </div>
        <div class="stat-card">
          <h3>筛选结果</h3>
          <p>{{ Object.keys(filteredMarketData).length }}</p>
        </div>
        <div class="stat-card">
          <h3>有出售订单</h3>
          <p>{{ sellOrdersCount }}</p>
        </div>
        <div class="stat-card">
          <h3>有求购订单</h3>
          <p>{{ buyOrdersCount }}</p>
        </div>
      </div>
      
      <div class="charts-container">
        <div class="chart-wrapper">
          <h3>价格分布</h3>
          <div ref="priceChart" class="chart"></div>
        </div>
        
        <div class="chart-wrapper">
          <h3>订单数量分布</h3>
          <div ref="orderChart" class="chart"></div>
        </div>
      </div>
      
      <div class="market-table">
        <h3>商品详情</h3>
        <div class="table-container">
          <table>
            <thead ref="headerRef">
              <tr>
                <th :class="{sorted: sortKey === 'itemId'}" @click="handleSort('itemId')">
                  商品名称
                  <span v-if="sortKey === 'itemId'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
                <th :class="{sorted: sortKey === 'sellMinPrice'}" @click="handleSort('sellMinPrice')">
                  最低出售价
                  <span v-if="sortKey === 'sellMinPrice'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
                <th :class="{sorted: sortKey === 'sellMinPriceCount'}" @click="handleSort('sellMinPriceCount')">
                  最低出售数量
                  <span v-if="sortKey === 'sellMinPriceCount'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
                <th :class="{sorted: sortKey === 'sellTotalCount'}" @click="handleSort('sellTotalCount')">
                  总出售数量
                  <span v-if="sortKey === 'sellTotalCount'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
                <th :class="{sorted: sortKey === 'sellOrderCount'}" @click="handleSort('sellOrderCount')">
                  出售订单数
                  <span v-if="sortKey === 'sellOrderCount'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
                <th :class="{sorted: sortKey === 'buyMaxPrice'}" @click="handleSort('buyMaxPrice')">
                  最高求购价
                  <span v-if="sortKey === 'buyMaxPrice'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
                <th :class="{sorted: sortKey === 'buyMaxPriceCount'}" @click="handleSort('buyMaxPriceCount')">
                  最高求购数量
                  <span v-if="sortKey === 'buyMaxPriceCount'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
                <th :class="{sorted: sortKey === 'buyTotalCount'}" @click="handleSort('buyTotalCount')">
                  总求购数量
                  <span v-if="sortKey === 'buyTotalCount'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
                <th :class="{sorted: sortKey === 'buyOrderCount'}" @click="handleSort('buyOrderCount')">
                  求购订单数
                  <span v-if="sortKey === 'buyOrderCount'">
                    <span v-if="sortOrder === 'asc'" class="sort-arrow">▲</span>
                    <span v-else class="sort-arrow">▼</span>
                  </span>
                  <span v-else class="sort-arrow sort-arrow-inactive">▲▼</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in sortedMarketData" :key="key">
                <td>{{ getItemDisplayName(item.itemId) }}</td>
                <td>{{ formatPrice(item.sellOrders?.minPrice || 0) }}</td>
                <td>{{ item.sellOrders?.minPriceCount || 0 }}</td>
                <td>{{ item.sellOrders?.totalCount || 0 }}</td>
                <td>{{ item.sellOrders?.orderCount || 0 }}</td>
                <td>{{ formatPrice(item.buyOrders?.maxPrice || 0) }}</td>
                <td>{{ item.buyOrders?.maxPriceCount || 0 }}</td>
                <td>{{ item.buyOrders?.totalCount || 0 }}</td>
                <td>{{ item.buyOrders?.orderCount || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { mockMarketData, type MarketItem } from '@/utils/mockData'
import { getItemDisplayName } from '@/utils/itemNames'
import { marketApi } from '@/api/market'

const marketData = ref<Record<string, MarketItem>>({})
const filteredMarketData = ref<Record<string, MarketItem>>({})
const loading = ref(false)
const error = ref('')
const lastUpdateTime = ref<number>(0)
const searchKeyword = ref('')
const headerRef = ref<HTMLElement>()
const priceChart = ref<HTMLElement>()
const orderChart = ref<HTMLElement>()

let priceChartInstance: echarts.ECharts | null = null
let orderChartInstance: echarts.ECharts | null = null

const sellOrdersCount = computed(() => {
  return Object.values(filteredMarketData.value).filter(item => item.sellOrders !== null).length
})

const buyOrdersCount = computed(() => {
  return Object.values(filteredMarketData.value).filter(item => item.buyOrders !== null).length
})

const formatPrice = (price: number) => {
  return price.toLocaleString()
}

// 排序相关
const sortKey = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedMarketData = computed(() => {
  const arr = Object.values(filteredMarketData.value)
  if (!sortKey.value) return arr
  return arr.slice().sort((a, b) => {
    let aValue: any, bValue: any
    switch (sortKey.value) {
      case 'itemId':
        aValue = getItemDisplayName(a.itemId)
        bValue = getItemDisplayName(b.itemId)
        break
      case 'sellMinPrice':
        aValue = a.sellOrders?.minPrice || 0
        bValue = b.sellOrders?.minPrice || 0
        break
      case 'sellMinPriceCount':
        aValue = a.sellOrders?.minPriceCount || 0
        bValue = b.sellOrders?.minPriceCount || 0
        break
      case 'sellTotalCount':
        aValue = a.sellOrders?.totalCount || 0
        bValue = b.sellOrders?.totalCount || 0
        break
      case 'sellOrderCount':
        aValue = a.sellOrders?.orderCount || 0
        bValue = b.sellOrders?.orderCount || 0
        break
      case 'buyMaxPrice':
        aValue = a.buyOrders?.maxPrice || 0
        bValue = b.buyOrders?.maxPrice || 0
        break
      case 'buyMaxPriceCount':
        aValue = a.buyOrders?.maxPriceCount || 0
        bValue = b.buyOrders?.maxPriceCount || 0
        break
      case 'buyTotalCount':
        aValue = a.buyOrders?.totalCount || 0
        bValue = b.buyOrders?.totalCount || 0
        break
      case 'buyOrderCount':
        aValue = a.buyOrders?.orderCount || 0
        bValue = b.buyOrders?.orderCount || 0
        break
      default:
        aValue = 0; bValue = 0
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder.value === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
  })
})

function handleSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// 搜索和筛选功能
const filterData = () => {
  if (!searchKeyword.value.trim()) {
    filteredMarketData.value = { ...marketData.value }
  } else {
    const filtered: Record<string, MarketItem> = {}
    Object.entries(marketData.value).forEach(([key, item]) => {
      const displayName = getItemDisplayName(item.itemId).toLowerCase()
      const keyword = searchKeyword.value.toLowerCase()
      if (displayName.includes(keyword) || item.itemId.toLowerCase().includes(keyword)) {
        filtered[key] = item
      }
    })
    filteredMarketData.value = filtered
  }
  // 重新初始化图表
  nextTick(() => {
    initCharts()
  })
}

const clearSearch = () => {
  searchKeyword.value = ''
  filterData()
}

const router = useRouter()

const goToAnalysis = () => {
  router.push('/market-analysis')
}

const fetchMarketData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await marketApi.getMarketPrice()
    if (response.code === 200 && response.data.items) {
      marketData.value = response.data.items
      filteredMarketData.value = { ...response.data.items }
      lastUpdateTime.value = response.data.lastUpdateTime
    } else {
      throw new Error('API返回数据格式错误')
    }
    nextTick(() => {
      initCharts()
    })
  } catch (err) {
    console.log('API请求失败，使用模拟数据:', err)
    // 如果API请求失败，使用模拟数据
    marketData.value = mockMarketData
    filteredMarketData.value = { ...mockMarketData }
    lastUpdateTime.value = Date.now()
    nextTick(() => {
      initCharts()
    })
  } finally {
    loading.value = false
  }
}

const initCharts = () => {
  if (Object.keys(filteredMarketData.value).length === 0) return
  
  // 价格分布图表
  if (priceChart.value) {
    // 销毁旧的图表实例
    if (priceChartInstance) {
      priceChartInstance.dispose()
    }
    priceChartInstance = echarts.init(priceChart.value)
    
    const items = Object.entries(filteredMarketData.value)
    const validItems = items.filter(([_, item]) => 
      (item.sellOrders?.minPrice && item.sellOrders.minPrice > 0) || 
      (item.buyOrders?.maxPrice && item.buyOrders.maxPrice > 0)
    )
    
    const priceOption = {
      title: {
        text: '价格分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const itemId = validItems[params[0].dataIndex]?.[0] || ''
          const displayName = getItemDisplayName(itemId)
          let result = `${displayName}<br/>`
          params.forEach((param: any) => {
            if (param.value !== null && param.value !== undefined) {
              result += `${param.seriesName}: ${param.value}<br/>`
            }
          })
          return result
        }
      },
      legend: {
        data: ['出售价格', '求购价格'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: validItems.map(([itemId, _]) => getItemDisplayName(itemId)),
        axisLabel: {
          rotate: 45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: '价格'
      },
      series: [
        {
          name: '出售价格',
          type: 'bar',
          data: validItems.map(([_, item]) => item.sellOrders?.minPrice || null),
          itemStyle: {
            color: '#ff6b6b'
          }
        },
        {
          name: '求购价格',
          type: 'bar',
          data: validItems.map(([_, item]) => item.buyOrders?.maxPrice || null),
          itemStyle: {
            color: '#4ecdc4'
          }
        }
      ]
    }
    
    priceChartInstance.setOption(priceOption)
  }
  
  // 订单数量分布图表
  if (orderChart.value) {
    // 销毁旧的图表实例
    if (orderChartInstance) {
      orderChartInstance.dispose()
    }
    orderChartInstance = echarts.init(orderChart.value)
    
    const totalItems = Object.keys(filteredMarketData.value).length
    const noOrdersCount = totalItems - sellOrdersCount.value - buyOrdersCount.value
    
    const orderOption = {
      title: {
        text: '订单数量分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 30
      },
      series: [
        {
          name: '订单数量',
          type: 'pie',
          radius: '50%',
          data: [
            {
              value: sellOrdersCount.value,
              name: '有出售订单',
              itemStyle: { color: '#ff6b6b' }
            },
            {
              value: buyOrdersCount.value,
              name: '有求购订单',
              itemStyle: { color: '#4ecdc4' }
            },
            {
              value: noOrdersCount,
              name: '无订单',
              itemStyle: { color: '#95a5a6' }
            }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    
    orderChartInstance.setOption(orderOption)
  }
}

onMounted(() => {
  fetchMarketData()
  
  // 监听窗口大小变化，重新调整图表大小
  window.addEventListener('resize', () => {
    priceChartInstance?.resize()
    orderChartInstance?.resize()
  })
  
  // 监听滚动，实现标题跟随
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  if (headerRef.value) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    if (scrollTop > 100) {
      headerRef.value.classList.add('sticky')
    } else {
      headerRef.value.classList.remove('sticky')
    }
  }
}
</script>

<style scoped>
.market-price {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 20px;
  border-bottom: 2px solid #eee;
  background: white;
  transition: all 0.3s ease;
  z-index: 1000;
}

.header.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.header-left h1 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 28px;
}

.update-time {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  min-width: 200px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4ecdc4;
  box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
}

.clear-btn {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.refresh-btn, .analysis-btn {
  background: #4ecdc4;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.refresh-btn:hover, .analysis-btn:hover {
  background: #45b7aa;
}

.loading {
  text-align: center;
  padding: 50px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4ecdc4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 50px;
  color: #e74c3c;
}

.error button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.market-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 16px;
}

.stat-card p {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #4ecdc4;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.chart-wrapper {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-wrapper h3 {
  margin: 0 0 20px 0;
  text-align: center;
  color: #333;
}

.chart {
  height: 400px;
  width: 100%;
}

.market-table {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.market-table h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

tr:hover {
  background: #f8f9fa;
}

.sort-arrow {
  font-size: 12px;
  margin-left: 5px;
}

.sort-arrow-inactive {
  color: #ccc;
}

.sorted {
  color: #4ecdc4;
  font-weight: bold;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .market-stats {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
  }
  
  .header-right {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .search-input {
    min-width: auto;
    width: 100%;
  }
  
  .header.sticky {
    padding: 15px;
  }
}
</style>
