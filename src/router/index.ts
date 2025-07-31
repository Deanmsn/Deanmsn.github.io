// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index/index.vue')
    },
    {
        path: '/Home',
        name: 'Home',
        component: () => import('@/views/index/index.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test/test.vue')
    },
    {
        path: '/game',
        name: 'game',
        component: () => import('@/views/game/SnakeGame.vue')
    },
    {
        path: '/idle',
        name: 'idle',
        component: () => import('@/views/game/IdleGame.vue')
    },
    {
        path: '/market',
        name: 'market',
        component: () => import('@/views/market/MarketPrice.vue')
    },
    {
        path: '/api-test',
        name: 'api-test',
        component: () => import('@/views/test/ApiTest.vue')
    },
    {
        path: '/chart-test',
        name: 'chart-test',
        component: () => import('@/views/test/ChartTest.vue')
    },
    {
        path: '/market-analysis',
        name: 'market-analysis',
        component: () => import('@/views/market/MarketAnalysis.vue')
    }
]

// 创建路由实例
const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes
})

export default router