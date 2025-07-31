<template>
  <div class="market-analysis">
    <div class="header">
      <h1>市场智能分析</h1>
      <button @click="refreshAnalysis" :disabled="loading">
        {{ loading ? '分析中...' : '重新分析' }}
      </button>
    </div>

    <!-- 最适合购入 -->
    <div class="analysis-section">
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
              <th>价格差距</th>
              <th>推荐理由</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in bestBuyItems" :key="item.itemId">
              <td>{{ index + 1 }}</td>
              <td>{{ item.displayName }}</td>
              <td>{{ (item.score * 100).toFixed(1) }}%</td>
              <td>{{ formatPrice(item.details.sellPrice || 0) }}</td>
              <td>{{ formatPrice(item.details.buyPrice || 0) }}</td>
              <td>{{ formatPrice(item.details.priceGap || 0) }}</td>
              <td>{{ item.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 最适合出手 -->
    <div class="analysis-section">
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
              <th>价格差距</th>
              <th>推荐理由</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in bestSellItems" :key="item.itemId">
              <td>{{ index + 1 }}</td>
              <td>{{ item.displayName }}</td>
              <td>{{ (item.score * 100).toFixed(1) }}%</td>
              <td>{{ formatPrice(item.details.sellPrice || 0) }}</td>
              <td>{{ formatPrice(item.details.buyPrice || 0) }}</td>
              <td>{{ formatPrice(item.details.priceGap || 0) }}</td>
              <td>{{ item.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { marketApi } from '@/api/market'
import { mockMarketData } from '@/utils/mockData'
import { analyzeBestBuyItems, analyzeBestSellItems } from '@/utils/marketAnalysis'

const loading = ref(false)
const bestBuyItems = ref([])
const bestSellItems = ref([])

const formatPrice = (price: number) => {
  return price.toLocaleString()
}

const refreshAnalysis = async () => {
  loading.value = true
  
  try {
    const response = await marketApi.getMarketPrice()
    if (response.code === 200 && response.data.items) {
      performAnalysis(response.data.items)
    }
  } catch (err) {
    console.log('使用模拟数据进行分析')
    performAnalysis(mockMarketData)
  }
  
  loading.value = false
}

const performAnalysis = (marketData: any) => {
  bestBuyItems.value = analyzeBestBuyItems(marketData, {}, 10)
  bestSellItems.value = analyzeBestSellItems(marketData, {}, 10)
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

.analysis-section h2 {
  margin: 0 0 20px 0;
  color: #333;
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
</style> 