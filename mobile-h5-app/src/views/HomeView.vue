<!--
 * 首页 — 移动 H5 审美样板:渐变 hero + CTA + 功能卡片 grid + Vant 组件示范
 * 修改注意:本页为审美样板,正式开发可整体替换;Vant 自动按需引入(<van-button>)由 vite 插件保障
-->
<template>
  <div class="px-4 pt-6 pb-8">
    <!-- Hero 区:大字标题 + 副文案 + CTA -->
    <section class="relative">
      <span
        class="inline-flex items-center gap-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
        新版本上线
      </span>
      <h1
        class="mt-3 font-display text-4xl leading-tight font-bold tracking-tight text-slate-900"
      >
        让你的
        <span
          class="bg-gradient-to-r from-brand-600 via-brand-500 to-pink-400 bg-clip-text text-transparent"
        >
          每一次启动
        </span>
        都更顺手
      </h1>
      <p class="mt-3 text-base text-slate-600 leading-relaxed">
        移动 H5 骨架已就位,集成 Tailwind + Vant + Vue Router,
        审美与工程基线都按"协作约定"落地。
      </p>

      <div class="mt-6 flex items-center gap-3">
        <button
          class="inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-card hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-200"
          @click="onPrimary"
        >
          立即体验
        </button>
        <button
          class="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-700 active:scale-95 transition-all duration-200"
          @click="popupVisible = true"
        >
          查看说明
        </button>
      </div>
    </section>

    <!-- Feature Grid:卡片 hover/active 微动效,字号 2 层 -->
    <section class="mt-10">
      <div class="flex items-end justify-between">
        <h2 class="font-display text-xl font-semibold text-slate-900">为什么是它</h2>
        <span class="text-xs text-slate-500">骨架已包含</span>
      </div>
      <div class="mt-4 grid grid-cols-1 gap-3">
        <div
          v-for="f in features"
          :key="f.title"
          class="group relative rounded-2xl bg-white p-4 shadow-sm hover:shadow-card hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 border border-slate-100"
        >
          <div
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition"
          >
            <span class="text-lg">{{ f.icon }}</span>
          </div>
          <h3 class="mt-3 font-display text-base font-semibold text-slate-900">
            {{ f.title }}
          </h3>
          <p class="mt-1 text-sm text-slate-600 leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Vant 组件示范:验证按需引入工作 -->
    <section class="mt-10">
      <h2 class="font-display text-xl font-semibold text-slate-900">Vant 组件</h2>
      <p class="mt-1 text-sm text-slate-600">下方是 Vant 按需引入示例,直接 &lt;van-button&gt; 即可</p>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <van-button type="primary" size="small" @click="onVantToast">主要</van-button>
        <van-button type="default" size="small">默认</van-button>
        <van-button type="success" size="small" plain>朴素</van-button>
      </div>
    </section>

    <!-- 通用 Popup demo -->
    <AppPopup v-model:visible="popupVisible" title="设计纪律提醒">
      <p class="text-sm text-slate-600 leading-relaxed">
        本骨架已落地双字族 / brand 占位非紫 / 渐变噪点背景 / 微动效;
        正式开发请替换 brand 主题色与业务壳。
      </p>
      <template #footer>
        <button
          class="w-full h-10 rounded-full bg-brand-600 text-white text-sm font-semibold active:scale-95 transition"
          @click="popupVisible = false"
        >
          知道了
        </button>
      </template>
    </AppPopup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import AppPopup from '@/components/common/AppPopup.vue'

const popupVisible = ref(false)

const features = [
  {
    icon: '⚡',
    title: 'Tailwind v3 已就位',
    desc: 'theme.extend 注册 brand 色阶 + 双字族 + hero-gradient,直接写 utility 即可。',
  },
  {
    icon: '🎯',
    title: 'Vant 按需自动引入',
    desc: 'unplugin-vue-components + VantResolver,无需手动 import 组件与 css。',
  },
  {
    icon: '🧭',
    title: 'Router 同步 import',
    desc: 'Vue Router 5.x 路由全部同步加载,DefaultLayout 内 RouterView 裸写,规避白屏雷区。',
  },
]

function onPrimary() {
  showToast('CTA 占位,接入业务后替换')
}

function onVantToast() {
  showToast('Vant 工作正常 ✓')
}
</script>
