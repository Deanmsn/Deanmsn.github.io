<template>
  <div class="navigation-container">
    <header class="header">
<!--      <img src="https://deanmsn.github.io/logo.svg" alt="Logo" class="logo" />-->
      <h1 class="site-title">Dean's Hub</h1>
    </header>
    <main class="main-content">
      <p class="description">需要一点灵感</p>
      <nav class="navigation-grid">
        <div @click="navigateTo('/test')" class="nav-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div class="text-content">
            <h3>测试页面</h3>
            <p>一些简单的测试和想法。</p>
          </div>
        </div>
        <div @click="navigateTo('/game')" class="nav-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="text-content">
            <h3>贪吃蛇</h3>
            <p>一个经典的小游戏。</p>
          </div>
        </div>
        <div @click="navigateTo('/idle')" class="nav-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8h-8m8 0a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
          </div>
          <div class="text-content">
            <h3>挂机游戏</h3>
            <p>自动赚金币，升级成长！</p>
          </div>
        </div>
        <div class="nav-card disabled">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div class="text-content">
            <h3>敬请期待</h3>
            <p>更多内容正在建设中。</p>
          </div>
        </div>
      </nav>
    </main>
    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} Deanmsn. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateTo(path: string) {
  router.push(path)
}
</script>

<style scoped>
:root {
  --bg-color: #f8f9fa;
  --text-color: #343a40;
  --card-bg: #ffffff;
  --card-shadow: rgba(0, 0, 0, 0.05);
  --primary-color: #4c6ef5;
}

.navigation-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.logo {
  height: 40px;
  width: 40px;
  margin-right: 1rem;
}

.site-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.description {
  font-size: 1.125rem;
  color: #6c757d;
  max-width: 500px;
  margin-bottom: 3rem;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
}

.nav-card {
  display: flex;
  align-items: center;
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 6px var(--card-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e9ecef;
  cursor: pointer;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.nav-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.icon-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  border-radius: 50%;
  color: var(--primary-color);
}

.icon-wrapper svg {
  width: 24px;
  height: 24px;
}

.text-content {
  text-align: left;
}

.text-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.text-content p {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

.footer {
  padding: 1.5rem 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: #adb5bd;
}

@media (max-width: 768px) {
  .header { padding: 1rem; }
  .main-content { padding: 1rem; }
  .description {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  .navigation-grid {
    grid-template-columns: 1fr;
  }
}
</style>