<!--
 * 我的页 — 头像区 + 订阅/收藏/历史 入口
 * 未登录 → 头像区显示「登录/注册」按钮跳 /pages/login/login
 * 修改注意:本骨架不接 store(用户选了不要会员管理),token 直接读 setStorageSync
-->
<template>
  <view class="page">
    <view class="profile">
      <view class="profile-bg"></view>
      <view class="profile-inner">
        <image class="avatar" :src="avatar" mode="aspectFill" />
        <view class="profile-text">
          <text class="nickname">{{ nickname }}</text>
          <text class="hint">{{ isLogin ? "已登录" : "登录后同步阅读历史" }}</text>
        </view>
        <view v-if="!isLogin" class="login-btn" hover-class="btn-press" @click="goLogin">
          登录 / 注册
        </view>
      </view>
    </view>

    <view class="grid">
      <view v-for="m in menus" :key="m.label" class="menu" hover-class="menu-press">
        <text class="menu-icon">{{ m.icon }}</text>
        <text class="menu-label">{{ m.label }}</text>
      </view>
    </view>

    <view class="settings">
      <view v-for="s in settings" :key="s.label" class="setting-row" hover-class="row-press">
        <text class="setting-label">{{ s.label }}</text>
        <text class="setting-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// 简易登录态:从 storage 读 token 决定是否已登录;未接 Pinia
const token = ref(uni.getStorageSync("token") || "");
const isLogin = computed(() => !!token.value);
const avatar = computed(() =>
  isLogin.value
    ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
    : "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?w=200"
);
const nickname = computed(() => (isLogin.value ? "读者 0001" : "未登录"));

const menus = [
  { icon: "★", label: "我的订阅" },
  { icon: "♡", label: "收藏" },
  { icon: "↺", label: "历史" },
  { icon: "✎", label: "评论" },
];

const settings = [
  { label: "消息推送" },
  { label: "字体大小" },
  { label: "夜间模式" },
  { label: "关于我们" },
];

function goLogin() {
  uni.navigateTo({ url: "/pages/login/login" });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: $space-8;
}

.profile {
  position: relative;
  padding: 120rpx $space-4 $space-6;
  overflow: hidden;
}
.profile-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(140deg, $color-brand-600, $color-brand-500 60%, #38bdf8);
}
.profile-bg::after {
  content: "";
  position: absolute;
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  filter: blur(40rpx);
  top: -100rpx;
  right: -100rpx;
}
.profile-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.6);
  background: #fff;
}
.profile-text {
  flex: 1;
  margin-left: $space-3;
}
.nickname {
  display: block;
  font-family: var(--font-display);
  font-size: $fs-h1;
  font-weight: 700;
  color: #fff;
}
.hint {
  display: block;
  margin-top: $space-1;
  font-size: $fs-caption;
  color: rgba(255, 255, 255, 0.85);
}
.login-btn {
  padding: 0 $space-3;
  height: 64rpx;
  line-height: 64rpx;
  font-size: $fs-caption;
  color: $color-brand-700;
  background: #fff;
  border-radius: $radius-pill;
  font-weight: 600;
  transition: transform 200ms ease-out;
}
.btn-press {
  transform: scale(0.96);
}

.grid {
  margin: -$space-5 $space-4 $space-4;
  position: relative;
  z-index: 2;
  display: flex;
  background: #fff;
  border-radius: $radius-xl;
  padding: $space-4 0;
  box-shadow: 0 16rpx 40rpx rgba(15, 23, 42, 0.08);
}
.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  transition: transform 200ms ease-out;
}
.menu-icon {
  width: 64rpx;
  height: 64rpx;
  line-height: 64rpx;
  text-align: center;
  background: $color-brand-50;
  color: $color-brand-600;
  border-radius: $radius-md;
  font-size: 32rpx;
}
.menu-label {
  font-size: $fs-caption;
  color: $color-text-soft;
}
.menu-press {
  transform: scale(0.94);
}

.settings {
  margin: $space-4;
  background: #fff;
  border-radius: $radius-xl;
  overflow: hidden;
}
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-4;
  border-bottom: 1rpx solid $color-line;
}
.setting-row:last-child {
  border-bottom: none;
}
.setting-label {
  font-size: $fs-body;
  color: $color-text;
}
.setting-arrow {
  font-size: $fs-h3;
  color: $color-text-mute;
}
.row-press {
  background: $color-brand-50;
}
</style>
