/**
 * 路由表 — 全部同步 import,Vue Router 5.x 雷区:
 *   懒加载 + DefaultLayout 内不套 Suspense → 路由切换白屏(刷新才正常)
 * 修改注意:首屏与中频页保持同步 import;深层非首屏大体积页面才懒加载,且 layout 必须 Suspense 兜底
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- 公开路由 ---
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
  ],
})

export default router
