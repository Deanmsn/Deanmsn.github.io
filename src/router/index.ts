import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index/index.vue')
    },
    {
        path: '/text',
        name: 'text',
        component: () => import('@/views/test/text.vue')
    }
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router