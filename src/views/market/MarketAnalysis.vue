
<template>
  <div class="market-analysis">
    <div class="header">
      <h1>市场智能分析</h1>

      <button @click="refreshAnalysis" :disabled="loading">
        {{ loading ? '分析中...' : '重新分析' }}
      </button>
    </div>

    <!-- 策略选择器 -->
    <div class="strategy-selector">
      <label>策略：</label>
      <select v-model="selectedStrategy" @change="refreshAnalysis">
        <option v-for="(config, key) in analysisPresets" :key="key" :value="key">
          {{ config.label }}
        </option>
      </select>
    </div>

    <!-- 图表展示 -->
    <div class="analysis-section">
      <h2>📊 买入评分分布图</h2>
      <div ref="buyChartRef" class="chart-box" />
    </div>
    <div class="analysis-section">
      <h2>📊 出手评分分布图</h2>
      <div ref="sellChartRef" class="chart-box" />
    </div>

    <!-- 最适合购入 -->
    <div class="analysis-section">
      <p v-if="lastUpdateTime"  class="update-time">
        最后更新: {{ new Date(lastUpdateTime).toLocaleString() }}
      </p>
      <h2>🎯 最适合购入的商品 (前10名)</h2>
      <div class="analysis-table">
        <table>
          <thead>
          <tr>
            <th>排名</th>
            <th>商品名称</th>
            <th>评分</th>
            <th>最低出售价</th>
            <th>最高求购价</th>
            <th>价格差</th>
            <th>推荐理由</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in bestBuyItems" :key="item.itemId">
            <td>{{ index + 1 }}</td>
            <td>{{ item.displayName }}</td>
            <td :style="{ color: item.score > 0.8 ? 'green' : item.score > 0.6 ? '#333' : 'gray' }">
              {{ (item.score * 100).toFixed(1) }}%
            </td>
            <td>{{ formatPrice(item.details.sellPrice || 0) }}</td>
            <td>{{ formatPrice(item.details.buyPrice || 0) }}</td>
            <td>{{ formatPrice(item.details.priceProfit || 0) }}</td>
            <td>{{ item.reason }}</td>
          </tr>
          <tr v-if="bestBuyItems.length === 0">
            <td colspan="7">暂无推荐商品</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 最适合出手 -->
    <div class="analysis-section">
      <p v-if="lastUpdateTime"  class="update-time">
        最后更新: {{ new Date(lastUpdateTime).toLocaleString() }}
      </p>
      <h2>💰 最适合出手的商品 (前10名)</h2>
      <div class="analysis-table">
        <table>
          <thead>
          <tr>
            <th>排名</th>
            <th>商品名称</th>
            <th>评分</th>
            <th>最低出售价</th>
            <th>最高求购价</th>
            <th>价格差</th>
            <th>推荐理由</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in bestSellItems" :key="item.itemId">
            <td>{{ index + 1 }}</td>
            <td>{{ item.displayName }}</td>
            <td :style="{ color: item.score > 0.8 ? '#d35400' : item.score > 0.6 ? '#333' : 'gray' }">
              {{ (item.score * 100).toFixed(1) }}%
            </td>
            <td>{{ formatPrice(item.details.sellPrice || 0) }}</td>
            <td>{{ formatPrice(item.details.buyPrice || 0) }}</td>
            <td>{{ formatPrice(item.details.priceProfit || 0) }}</td>
            <td>{{ item.reason }}</td>
          </tr>
          <tr v-if="bestSellItems.length === 0">
            <td colspan="7">暂无推荐商品</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { marketApi } from '@/api/market'
import { mockMarketData } from '@/utils/mockData'
import { analyzeBestBuyItems, analyzeBestSellItems } from '@/utils/marketAnalysis'
import type { AnalysisResult } from '@/utils/marketAnalysis'

const loading = ref(false)
const bestBuyItems = ref<AnalysisResult[]>([])
const bestSellItems = ref<AnalysisResult[]>([])
const lastUpdateTime = ref<number>(0)
const selectedStrategy = ref('default')
const analysisPresets = {
  default: {
    label: '标准权重',
    priceWeight: 0.5,
    volumeWeight: 0.3,
    orderWeight: 0.2,
  },
  aggressive: {
    label: '进攻型（重价格差）',
    priceWeight: 0.7,
    volumeWeight: 0.2,
    orderWeight: 0.1,
  },
  conservative: {
    label: '保守型（重交易活跃）',
    priceWeight: 0.3,
    volumeWeight: 0.4,
    orderWeight: 0.3,
  },
}

const formatPrice = (price: number) => price.toLocaleString()

const buyChartRef = ref<HTMLElement | null>(null)
const sellChartRef = ref<HTMLElement | null>(null)
let buyChartInstance: echarts.ECharts | null = null
let sellChartInstance: echarts.ECharts | null = null

const updateECharts = () => {
  if (!buyChartRef.value || !sellChartRef.value) return
  buyChartInstance?.dispose()
  sellChartInstance?.dispose()

  buyChartInstance = echarts.init(buyChartRef.value)
  sellChartInstance = echarts.init(sellChartRef.value)

  buyChartInstance.setOption({
    title: { text: '买入评分分布', left: 'center' },
    tooltip: {},
    xAxis: { type: 'category', data: bestBuyItems.value.map(i => i.displayName) },
    yAxis: { type: 'value', name: '评分(%)' },
    series: [{
      type: 'bar',
      data: bestBuyItems.value.map(i => +(i.score * 100).toFixed(1)),
      itemStyle: { color: '#4ecdc4' },
      label: { show: true, position: 'top', formatter: '{c}%' }
    }]
  })

  sellChartInstance.setOption({
    title: { text: '出手评分分布', left: 'center' },
    tooltip: {},
    xAxis: { type: 'category', data: bestSellItems.value.map(i => i.displayName) },
    yAxis: { type: 'value', name: '评分(%)' },
    series: [{
      type: 'bar',
      data: bestSellItems.value.map(i => +(i.score * 100).toFixed(1)),
      itemStyle: { color: '#f9c74f' },
      label: { show: true, position: 'top', formatter: '{c}%' }
    }]
  })
}

const performAnalysis = (marketData: any) => {
  const config = analysisPresets[selectedStrategy.value as StrategyKey ]
  bestBuyItems.value = analyzeBestBuyItems(marketData, config, 10)
  bestSellItems.value = analyzeBestSellItems(marketData, config, 10)
  nextTick(updateECharts)
}

const refreshAnalysis = async () => {
  loading.value = true
  try {
    const response = await marketApi.getMarketPrice()
    if (response.code === 200 && response.data.items) {
      performAnalysis(response.data.items)
      lastUpdateTime.value = response.data.lastUpdateTime
    }
  } catch (err) {
    console.warn('使用模拟数据进行分析')
    performAnalysis(mockMarketData)
    lastUpdateTime.value = Date.now()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshAnalysis()
})
</script>

<style scoped>
.market-analysis {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.strategy-selector {
  margin-bottom: 20px;
  background: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
}
.header h1 {
  margin: 0;
  color: #333;
}
.header button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
.header button:disabled {
  background: #ccc;
}
.analysis-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.analysis-table {
  overflow-x: auto;
}
.analysis-table table {
  width: 100%;
  border-collapse: collapse;
}
.analysis-table th,
.analysis-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.analysis-table th {
  background: #f8f9fa;
  font-weight: 600;
}
.analysis-table tr:hover {
  background: #f8f9fa;
}
.chart-box {
  width: 100%;
  height: 400px;
}
</style>
