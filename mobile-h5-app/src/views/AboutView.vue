<!--
 * 关于页 — 占位
 * 修改注意:用于验证路由切换 SPA 行为;build 不报错 ≠ 路由切换正常,需手测
-->
<template>
  <div class="px-4 pt-6 pb-8">
    <h1 class="font-display text-3xl font-bold tracking-tight text-slate-900">关于</h1>
    <p class="mt-2 text-base text-slate-600">这是一个 mobile H5 骨架占位页。</p>

    <ul class="mt-6 space-y-3">
      <li
        v-for="(it, i) in items"
        :key="i"
        class="rounded-xl bg-white p-4 border border-slate-100 shadow-sm"
      >
        <p class="text-sm font-semibold text-slate-900">{{ it.k }}</p>
        <p class="mt-1 text-sm text-slate-600 break-all">{{ it.v }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { DESIGN } from '@/config/design'

const items = [
  { k: '端 / 设计稿', v: `${DESIGN.platform} / ${DESIGN.designWidth}` },
  { k: '是否有接口', v: DESIGN.hasApi ? '是' : '否(纯静态)' },
  { k: '单位策略', v: DESIGN.unit },
]
</script>
