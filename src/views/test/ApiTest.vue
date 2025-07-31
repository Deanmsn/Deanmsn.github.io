<template>
  <div class="api-test">
    <h1>API 测试页面</h1>
    
    <ApiStatus ref="apiStatusRef" />
    
    <div class="test-section">
      <h2>市场价格API测试</h2>
      
              <div class="test-controls">
          <button @click="testMarketApi" :disabled="loading">
            {{ loading ? '请求中...' : '测试市场价格API' }}
          </button>
          <button @click="testDirectFetch" :disabled="loading">
            测试直接Fetch
          </button>
          <button @click="testCorsFix" :disabled="loading">
            测试CORS修复
          </button>
        </div>
      
      <div class="test-results">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>请求中...</p>
        </div>
        
        <div v-if="error" class="error">
          <h3>错误信息</h3>
          <pre>{{ error }}</pre>
        </div>
        
        <div v-if="result" class="success">
          <h3>请求成功</h3>
          <div class="result-info">
            <p><strong>状态码:</strong> {{ result.code }}</p>
            <p><strong>消息:</strong> {{ result.msg }}</p>
            <p><strong>商品数量:</strong> {{ Object.keys(result.data?.items || {}).length }}</p>
            <p><strong>最后更新时间:</strong> {{ formatTime(result.data?.lastUpdateTime) }}</p>
          </div>
          
          <div class="sample-data">
            <h4>示例数据 (前5个商品)</h4>
            <div v-for="(item, key) in sampleItems" :key="key" class="item">
              <h5>{{ getItemDisplayName(key) }}</h5>
              <div class="item-details">
                <div class="sell-info">
                  <strong>出售信息:</strong>
                  <span v-if="item.sellOrders">
                    最低价: {{ item.sellOrders.minPrice }}, 
                    数量: {{ item.sellOrders.minPriceCount }}, 
                    订单数: {{ item.sellOrders.orderCount }}
                  </span>
                  <span v-else>无出售订单</span>
                </div>
                <div class="buy-info">
                  <strong>求购信息:</strong>
                  <span v-if="item.buyOrders">
                    最高价: {{ item.buyOrders.maxPrice }}, 
                    数量: {{ item.buyOrders.maxPriceCount }}, 
                    订单数: {{ item.buyOrders.orderCount }}
                  </span>
                  <span v-else>无求购订单</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="test-section">
      <h2>请求日志</h2>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { marketApi } from '@/api/market'
import { getItemDisplayName } from '@/utils/itemNames'
import type { MarketResponse } from '@/utils/mockData'
import ApiStatus from '@/components/ApiStatus.vue'
import { isCorsError, getCorsErrorMessage, tryMultipleRequests } from '@/utils/corsHelper'

const loading = ref(false)
const error = ref('')
const result = ref<MarketResponse | null>(null)
const logs = ref<Array<{ time: string; message: string; type: string }>>([])
const apiStatusRef = ref()

const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
}

const formatTime = (timestamp?: number) => {
  if (!timestamp) return '未知'
  return new Date(timestamp).toLocaleString()
}

const testMarketApi = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  
  apiStatusRef.value?.setStatus('loading')
  addLog('开始测试市场价格API...', 'info')
  
  const startTime = Date.now()
  
  try {
    const response = await marketApi.getMarketPrice()
    result.value = response
    
    const duration = Date.now() - startTime
    apiStatusRef.value?.recordRequest(duration, true)
    apiStatusRef.value?.setStatus('success')
    
    addLog('API请求成功', 'success')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
    
    // 检查是否为CORS错误
    if (isCorsError(err)) {
      error.value = getCorsErrorMessage(err)
      addLog('检测到CORS错误，建议使用代理或联系服务器管理员', 'error')
    }
    
    const duration = Date.now() - startTime
    apiStatusRef.value?.recordRequest(duration, false)
    apiStatusRef.value?.setStatus('error')
    
    addLog(`API请求失败: ${error.value}`, 'error')
  } finally {
    loading.value = false
  }
}

const testDirectFetch = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  
  apiStatusRef.value?.setStatus('loading')
  addLog('开始测试直接Fetch请求...', 'info')
  
  const startTime = Date.now()
  
  try {
    const response = await fetch('https://www.moyu-idle.com/api/game/market/price')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    result.value = data
    
    const duration = Date.now() - startTime
    apiStatusRef.value?.recordRequest(duration, true)
    apiStatusRef.value?.setStatus('success')
    
    addLog('Fetch请求成功', 'success')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
    
    // 检查是否为CORS错误
    if (isCorsError(err)) {
      error.value = getCorsErrorMessage(err)
      addLog('检测到CORS错误，建议使用代理或联系服务器管理员', 'error')
    }
    
    const duration = Date.now() - startTime
    apiStatusRef.value?.recordRequest(duration, false)
    apiStatusRef.value?.setStatus('error')
    
    addLog(`Fetch请求失败: ${error.value}`, 'error')
  } finally {
    loading.value = false
  }
}

const testCorsFix = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  
  apiStatusRef.value?.setStatus('loading')
  addLog('开始测试CORS修复方法...', 'info')
  
  const startTime = Date.now()
  
  try {
    const response = await tryMultipleRequests('/api/game/market/price')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    result.value = data
    
    const duration = Date.now() - startTime
    apiStatusRef.value?.recordRequest(duration, true)
    apiStatusRef.value?.setStatus('success')
    
    addLog('CORS修复请求成功', 'success')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
    
    const duration = Date.now() - startTime
    apiStatusRef.value?.recordRequest(duration, false)
    apiStatusRef.value?.setStatus('error')
    
    addLog(`CORS修复请求失败: ${error.value}`, 'error')
  } finally {
    loading.value = false
  }
}

const sampleItems = computed(() => {
  if (!result.value?.data?.items) return {}
  
  const items = result.value.data.items
  const keys = Object.keys(items)
  const sampleKeys = keys.slice(0, 5)
  
  const sample: Record<string, any> = {}
  sampleKeys.forEach(key => {
    sample[key] = items[key]
  })
  
  return sample
})
</script>

<style scoped>
.api-test {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.test-controls {
  margin-bottom: 20px;
}

.test-controls button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background 0.3s;
}

.test-controls button:hover {
  background: #45b7aa;
}

.test-controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 20px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4ecdc4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background: #ffe6e6;
  border: 1px solid #ff9999;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.error pre {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 3px;
  overflow-x: auto;
}

.success {
  background: #e6ffe6;
  border: 1px solid #99ff99;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.result-info {
  margin-bottom: 20px;
}

.result-info p {
  margin: 5px 0;
}

.sample-data {
  margin-top: 20px;
}

.item {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.item h5 {
  margin: 0 0 10px 0;
  color: #333;
}

.item-details {
  font-size: 14px;
}

.sell-info, .buy-info {
  margin-bottom: 5px;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px;
}

.log-item {
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
  font-family: monospace;
  font-size: 12px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #666;
  margin-right: 10px;
}

.log-item.info .log-message {
  color: #333;
}

.log-item.success .log-message {
  color: #28a745;
}

.log-item.error .log-message {
  color: #dc3545;
}
</style> 