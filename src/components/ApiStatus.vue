<template>
  <div class="api-status">
    <div class="status-indicator" :class="status">
      <div class="indicator-dot"></div>
      <span class="status-text">{{ statusText }}</span>
    </div>
    
    <div v-if="lastRequest" class="last-request">
      <p><strong>最后请求:</strong> {{ formatTime(lastRequest.time) }}</p>
      <p><strong>响应时间:</strong> {{ lastRequest.duration }}ms</p>
      <p><strong>状态:</strong> {{ lastRequest.success ? '成功' : '失败' }}</p>
    </div>
    
    <div v-if="stats" class="stats">
      <div class="stat-item">
        <span class="stat-label">总请求</span>
        <span class="stat-value">{{ stats.total }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">成功</span>
        <span class="stat-value success">{{ stats.success }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">失败</span>
        <span class="stat-value error">{{ stats.failed }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">成功率</span>
        <span class="stat-value">{{ successRate }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface RequestRecord {
  time: number
  duration: number
  success: boolean
}

interface Stats {
  total: number
  success: number
  failed: number
}

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const lastRequest = ref<RequestRecord | null>(null)
const requestHistory = ref<RequestRecord[]>([])

const statusText = computed(() => {
  switch (status.value) {
    case 'idle': return '空闲'
    case 'loading': return '请求中'
    case 'success': return '成功'
    case 'error': return '错误'
    default: return '未知'
  }
})

const stats = computed((): Stats => {
  const total = requestHistory.value.length
  const success = requestHistory.value.filter(r => r.success).length
  const failed = total - success
  
  return { total, success, failed }
})

const successRate = computed(() => {
  if (stats.value.total === 0) return 0
  return Math.round((stats.value.success / stats.value.total) * 100)
})

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

// 暴露方法供外部调用
const recordRequest = (duration: number, success: boolean) => {
  const record: RequestRecord = {
    time: Date.now(),
    duration,
    success
  }
  
  requestHistory.value.push(record)
  lastRequest.value = record
  
  // 只保留最近10条记录
  if (requestHistory.value.length > 10) {
    requestHistory.value = requestHistory.value.slice(-10)
  }
}

const setStatus = (newStatus: 'idle' | 'loading' | 'success' | 'error') => {
  status.value = newStatus
}

// 暴露方法
defineExpose({
  recordRequest,
  setStatus
})
</script>

<style scoped>
.api-status {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  transition: background-color 0.3s;
}

.status-indicator.idle .indicator-dot {
  background-color: #ccc;
}

.status-indicator.loading .indicator-dot {
  background-color: #ffc107;
  animation: pulse 1s infinite;
}

.status-indicator.success .indicator-dot {
  background-color: #28a745;
}

.status-indicator.error .indicator-dot {
  background-color: #dc3545;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-text {
  font-weight: 500;
  color: #333;
}

.last-request {
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.last-request p {
  margin: 5px 0;
  font-size: 14px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 5px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stat-value.success {
  color: #28a745;
}

.stat-value.error {
  color: #dc3545;
}
</style> 