<!--
 * 底部 TabBar — 移动 H5 主导航
 * 依赖方:DefaultLayout
 * 修改注意:tabs 顺序与 router 路由对应;新增 tab 须同步 router/index.ts
 *   底部留 safe-area-inset-bottom 防 iPhone 小白条
-->
<template>
  <nav
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[750px] z-30 bg-white/85 backdrop-blur-md border-t border-slate-100"
    :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
  >
    <ul class="flex items-stretch h-14">
      <li v-for="t in tabs" :key="t.path" class="flex-1">
        <RouterLink
          :to="t.path"
          class="h-full flex flex-col items-center justify-center gap-0.5 transition active:scale-95"
          :class="
            isActive(t.path)
              ? 'text-brand-600'
              : 'text-slate-500 hover:text-slate-800'
          "
        >
          <span v-html="t.icon" class="block h-5 w-5"></span>
          <span class="text-[11px] font-medium leading-none">{{ t.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  {
    path: '/',
    label: '首页',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  },
  {
    path: '/about',
    label: '关于',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  },
]

const isActive = computed(() => (path: string) => route.path === path)
</script>
