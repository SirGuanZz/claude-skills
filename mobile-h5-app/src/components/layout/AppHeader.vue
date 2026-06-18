<!--
 * 顶栏 — 移动 H5 风格,左 logo 右 icon
 * 依赖方:DefaultLayout
 * 修改注意:height 与 main pt-* 联动;改高度需检查首页 hero 起始 padding
-->
<template>
  <header
    class="sticky top-0 z-30 flex items-center justify-between px-4 backdrop-blur-md bg-white/70 border-b border-slate-100"
    :style="{ paddingTop: 'env(safe-area-inset-top)' }"
  >
    <div class="flex items-center gap-2 h-14">
      <span
        class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white font-display font-bold"
        >M</span
      >
      <span class="font-display text-lg font-semibold tracking-tight text-slate-900">
        Mobile App
      </span>
    </div>
    <button
      class="h-9 w-9 inline-flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 active:scale-95 transition"
      aria-label="搜索"
      @click="onSearch"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" stroke-linecap="round" />
      </svg>
    </button>
  </header>
</template>

<script setup lang="ts">
import { showToast } from 'vant'

function onSearch() {
  showToast('搜索功能待接入')
}
</script>
