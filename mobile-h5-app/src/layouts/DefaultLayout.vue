<!--
 * 默认布局 — 移动 H5 单端结构;mobile-wrapper 大屏 PC 预览居中
 * 依赖方:App.vue 包根、所有 RouterView 出现位置
 * 修改注意:
 *   - 根容器渐变 + 噪点(.bg-decor)落地"禁纯白铺底",删它须同步加替代视觉
 *   - <RouterView /> 裸写,不套 <transition>/<Suspense> — Vue Router 5.x + transition 切路由会白屏
 *   - 顶栏 70rpx ≈ 56px;TabBar 留底部 safe-area 防 iPhone 底部小白条
-->
<template>
  <div class="mobile-wrapper">
    <div class="mobile-container bg-decor">
      <AppHeader />
      <main class="relative pb-20">
        <RouterView />
      </main>
      <AppTabBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppTabBar from '@/components/layout/AppTabBar.vue'
</script>
