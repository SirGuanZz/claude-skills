<!--
 * 根组件 — 包 DefaultLayout + RouterView
 * 路由全部同步 import,DefaultLayout 内 <RouterView /> 裸写,不上 transition/Suspense
 * (Vue Router 5.x + transition 在路由切换时会白屏,刷新才正常)
-->
<template>
  <DefaultLayout />
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>
