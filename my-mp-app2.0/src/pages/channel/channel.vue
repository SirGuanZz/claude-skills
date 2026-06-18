<!--
 * 频道页 — 已订阅 grid + 推荐 grid;调用 cms 域名 channel/list
 * 修改注意:demo 静态数据;接通 getChannelList 后替换 onShow 内逻辑
-->
<template>
  <view class="page">
    <view class="header">
      <text class="title">频道</text>
      <text class="subtitle">编辑你关心的内容,资讯流自动调整</text>
    </view>

    <view class="section">
      <text class="section-title">已订阅</text>
      <view class="grid">
        <view
          v-for="c in subscribed"
          :key="c.id"
          class="chip chip-active"
          hover-class="chip-press"
        >
          <text class="chip-text">{{ c.name }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">推荐</text>
      <view class="grid">
        <view
          v-for="c in recommended"
          :key="c.id"
          class="chip"
          hover-class="chip-press"
        >
          <text class="chip-text">{{ c.name }}</text>
          <text class="chip-add">+</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Channel } from "@/api/modules/news";

const subscribed = ref<Channel[]>([
  { id: "1", name: "财经" },
  { id: "2", name: "科技" },
  { id: "3", name: "城市" },
  { id: "4", name: "时事" },
]);

const recommended = ref<Channel[]>([
  { id: "5", name: "体育" },
  { id: "6", name: "娱乐" },
  { id: "7", name: "汽车" },
  { id: "8", name: "美食" },
  { id: "9", name: "旅行" },
  { id: "10", name: "数码" },
  { id: "11", name: "教育" },
  { id: "12", name: "健康" },
]);
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: $space-6 $space-4;
}
.header {
  margin-bottom: $space-6;
}
.title {
  display: block;
  font-family: var(--font-display);
  font-size: $fs-display;
  font-weight: 700;
  color: $color-text;
}
.subtitle {
  display: block;
  margin-top: $space-1;
  font-size: $fs-body;
  color: $color-text-soft;
}
.section {
  margin-bottom: $space-6;
}
.section-title {
  display: block;
  font-size: $fs-h3;
  font-weight: 600;
  color: $color-text;
  margin-bottom: $space-3;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}
.chip {
  display: flex;
  align-items: center;
  padding: 0 $space-3;
  height: 64rpx;
  background: #fff;
  border: 1rpx solid $color-line;
  border-radius: $radius-pill;
  transition: transform 200ms ease-out;
}
.chip-active {
  background: $color-brand-50;
  border-color: $color-brand-200;
}
.chip-text {
  font-size: $fs-body;
  color: $color-text;
}
.chip-active .chip-text {
  color: $color-brand-700;
  font-weight: 600;
}
.chip-add {
  margin-left: $space-1;
  font-size: $fs-h3;
  color: $color-brand-500;
  line-height: 1;
}
.chip-press {
  transform: scale(0.95);
}
</style>
