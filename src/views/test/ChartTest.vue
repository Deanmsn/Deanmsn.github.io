<template>
  <div class="chart-test">
    <h1>ECharts 测试页面</h1>
    
    <div class="test-section">
      <h2>基础图表测试</h2>
      <div ref="testChart" class="chart-container"></div>
    </div>
    
    <div class="test-section">
      <h2>数据更新测试</h2>
      <button @click="updateData">更新数据</button>
      <button @click="clearChart">清除图表</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const testChart = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!testChart.value) return
  
  chartInstance = echarts.init(testChart.value)
  
  const option = {
    title: {
      text: '测试图表',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '数据1',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '数据2',
        type: 'bar',
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  }
  
  chartInstance.setOption(option)
}

const updateData = () => {
  if (!chartInstance) return
  
  const newData = [
    Math.floor(Math.random() * 300),
    Math.floor(Math.random() * 300),
    Math.floor(Math.random() * 300),
    Math.floor(Math.random() * 300),
    Math.floor(Math.random() * 300),
    Math.floor(Math.random() * 300),
    Math.floor(Math.random() * 300)
  ]
  
  chartInstance.setOption({
    series: [
      {
        name: '数据1',
        data: newData
      },
      {
        name: '数据2',
        data: newData.map(v => v + 50)
      }
    ]
  })
}

const clearChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
  
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>

<style scoped>
.chart-test {
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

.chart-container {
  height: 400px;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 5px;
}

button {
  background: #4ecdc4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background 0.3s;
}

button:hover {
  background: #45b7aa;
}
</style> 