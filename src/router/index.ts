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
    }
]

// 创建路由实例
const router = createRouter({
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes
})

export default router