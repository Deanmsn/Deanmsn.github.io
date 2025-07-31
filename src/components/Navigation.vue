<template>
  <nav class="navigation">
    <div class="nav-container">
      <router-link to="/" class="nav-item">
        <span>🏠</span>
        <span>主页</span>
      </router-link>
      <router-link to="/test" class="nav-item">
        <span>🧪</span>
        <span>测试</span>
      </router-link>
      <router-link to="/game" class="nav-item">
        <span>🐍</span>
        <span>贪吃蛇</span>
      </router-link>
      <router-link to="/idle" class="nav-item">
        <span>💰</span>
        <span>挂机游戏</span>
      </router-link>
      <router-link to="/market" class="nav-item">
        <span>📊</span>
        <span>市场价格</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style scoped>
.navigation {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s;
  min-width: 80px;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #4ecdc4;
}

.nav-item.router-link-active {
  background: #4ecdc4;
  color: white;
}

.nav-item span:first-child {
  font-size: 20px;
  margin-bottom: 5px;
}

.nav-item span:last-child {
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .nav-container {
    gap: 10px;
  }
  
  .nav-item {
    min-width: 60px;
    padding: 8px;
  }
  
  .nav-item span:first-child {
    font-size: 16px;
  }
  
  .nav-item span:last-child {
    font-size: 10px;
  }
}
</style> 