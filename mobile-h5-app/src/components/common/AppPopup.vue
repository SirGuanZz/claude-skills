<!--
 * 通用弹窗 — Vant 路径之外的轻量化方案
 * 依赖方:任意页面需要居中弹窗的场景
 * 修改注意:
 *   - v-model:visible 控显隐,父组件 update:visible 同步
 *   - title 可空(纯内容卡片);默认有 close icon,设置 hideClose=true 隐藏
 *   - transition 用 fade-in + translate-y 做软入场,150~250ms ease-out 落地"动效纪律"
-->
<template>
  <Transition name="popup" appear>
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      @click.self="onClose"
    >
      <div class="absolute inset-0 bg-slate-900/40"></div>
      <div
        class="relative w-full max-w-sm rounded-2xl bg-white shadow-card overflow-hidden"
      >
        <header
          v-if="title || !hideClose"
          class="flex items-center justify-between px-5 pt-5 pb-3"
        >
          <h3 v-if="title" class="font-display text-lg font-semibold text-slate-900">
            {{ title }}
          </h3>
          <button
            v-if="!hideClose"
            class="ml-auto h-8 w-8 inline-flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 active:scale-90 transition"
            aria-label="关闭"
            @click="onClose"
          >
            ×
          </button>
        </header>
        <div class="px-5 pb-5">
          <slot />
        </div>
        <footer
          v-if="$slots.footer"
          class="px-5 pb-5 pt-2 border-t border-slate-100"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title?: string
  hideClose?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
}>()

function onClose() {
  emit('update:visible', false)
}
</script>

<style scoped>
.popup-enter-active,
.popup-leave-active {
  transition: opacity 200ms ease-out;
}
.popup-enter-active > div:last-child,
.popup-leave-active > div:last-child {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
.popup-enter-from > div:last-child,
.popup-leave-to > div:last-child {
  transform: translateY(8px);
  opacity: 0;
}
</style>
